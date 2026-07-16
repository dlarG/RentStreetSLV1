# RentStreet — Progress Log

_Last updated: July 15, 2026_

## 1. Database Design

Designed a full PostgreSQL + PostGIS schema (22 tables) covering the full spec:

- Users, roles, campuses
- Boarding houses → rooms → bed slots (supports both whole-room and per-bed rentals)
- Amenities (property-level, filterable)
- Rental applications → tenancies → payments
- Trust score system: append-only event log (not a mutable number), mandatory
  consent gateway, dispute + evidence tables, and an access log so a landlord
  can only view a score after a real application exists — built for RA 10173
  compliance ("no public shaming" + right to dispute)
- Subscriptions/trials (landlord monetization)
- ML support tables: price_predictions, listing_interactions (recommender
  training data), enrollment_cycles (demand forecasting)

Tables were physically created in DBeaver with the PostGIS extension enabled.

## 2. Backend Scaffold

FastAPI backend confirmed connecting to Postgres. `config.py` reads settings
from `.env` via `pydantic-settings`. `/api/db-test` endpoint verifies PostGIS
is active (`PostGIS_Version()` query).

## 3. SQLAlchemy Models

All 22 tables modeled across:

- `models/users.py`, `models/properties.py`, `models/trust.py`,
  `models/bookings.py`, `models/subscriptions.py`, `models/ml.py`, `models/misc.py`
- `core/enums.py` — shared Postgres ENUM type definitions (`create_type=False`
  since types already exist in the DB)
- `models/__init__.py` — central registry so Alembic/`Base.metadata` sees everything

## 4. Alembic Migrations

Worked through a broken `alembic init` (blank `alembic.ini`, corrupted
`script.py.mako`) via a full clean reinit. `env.py` now imports `Base.metadata`
from the models and pulls `DATABASE_URL` from `.env` instead of hardcoding it.

First autogenerate migration came back **empty** — confirming models match the
DBeaver-built database exactly — then the DB was stamped to that baseline
revision without altering any tables.

**Workflow going forward:** all schema changes go through
`alembic revision --autogenerate` → review → `alembic upgrade head`.
DBeaver is now read-only for inspecting data, not for editing structure.

## 5. Seed Data

`scripts/seed_users.py` — idempotent, skips existing emails on re-run.
Seeded 1 admin, 2 landlords, 3 renters with bcrypt-hashed passwords.

Hit a `passlib`/`bcrypt` version incompatibility (`passlib` expects a
`bcrypt.__about__` attribute removed in newer `bcrypt` releases) — resolved
by dropping `passlib` and hashing directly with `bcrypt` in `core/security.py`.

## 6. Frontend

Vite + React scaffolded, Tailwind CSS installed and working. Landing page
design + `react-router-dom` routing structure in progress (this session).

---

## Where things stand

Database, models, and migrations are fully in sync. Six real accounts exist
to build against. Frontend project exists but isn't yet wired to the backend.

## Next up

- Auth endpoints (login + JWT) using the seeded users
- Pydantic request/response schemas
- Seed `campuses` + `renter_profiles`/`landlord_profiles`
- Frontend landing page + routing (starting now)

# RentStreet — Progress Log

_Last updated: July 16, 2026_

## 1. Database Design

Designed a full PostgreSQL + PostGIS schema (22 tables) covering the full spec:

- Users, roles, campuses
- Boarding houses → rooms → bed slots (supports both whole-room and per-bed rentals)
- Amenities (property-level, filterable)
- Rental applications → tenancies → payments
- Trust score system: append-only event log (not a mutable number), mandatory
  consent gateway, dispute + evidence tables, and an access log so a landlord
  can only view a score after a real application exists — built for RA 10173
  compliance ("no public shaming" + right to dispute)
- Subscriptions/trials (landlord monetization)
- ML support tables: price_predictions, listing_interactions (recommender
  training data), enrollment_cycles (demand forecasting)

Tables were physically created in DBeaver with the PostGIS extension enabled.

## 2. Backend Scaffold

FastAPI backend confirmed connecting to Postgres. `config.py` reads settings
from `.env` via `pydantic-settings`. `/api/db-test` endpoint verifies PostGIS
is active (`PostGIS_Version()` query).

## 3. SQLAlchemy Models

All 22 tables modeled across:

- `models/users.py`, `models/properties.py`, `models/trust.py`,
  `models/bookings.py`, `models/subscriptions.py`, `models/ml.py`, `models/misc.py`
- `core/enums.py` — shared Postgres ENUM type definitions (`create_type=False`
  since types already exist in the DB)
- `models/__init__.py` — central registry so Alembic/`Base.metadata` sees everything

## 4. Alembic Migrations

Worked through a broken `alembic init` (blank `alembic.ini`, corrupted
`script.py.mako`) via a full clean reinit. `env.py` now imports `Base.metadata`
from the models and pulls `DATABASE_URL` from `.env` instead of hardcoding it.

First autogenerate migration came back **empty** — confirming models match the
DBeaver-built database exactly — then the DB was stamped to that baseline
revision without altering any tables.

**Workflow going forward:** all schema changes go through
`alembic revision --autogenerate` → review → `alembic upgrade head`.
DBeaver is now read-only for inspecting data, not for editing structure.

## 5. Seed Data

`scripts/seed_users.py` — idempotent, skips existing emails on re-run.
Seeded 1 admin, 2 landlords, 3 renters with bcrypt-hashed passwords.

Hit a `passlib`/`bcrypt` version incompatibility (`passlib` expects a
`bcrypt.__about__` attribute removed in newer `bcrypt` releases) — resolved
by dropping `passlib` and hashing directly with `bcrypt` in `core/security.py`.

## 6. Frontend Landing Page

Vite + React scaffolded, Tailwind CSS working. Built a full custom-branded
landing page (Navbar, Hero, Why Us, Pricing, Contact Us, Footer) using a
palette/type system grounded in Sogod Bay + jeepney signage (bay teal,
marigold, papaya coral; Bricolage Grotesque + Inter + Space Mono), wired
into `react-router-dom` (`BrowserRouter` in `main.jsx`, routes in `App.jsx`,
`LandingPage.jsx` composing the section components).

Fixed a mobile nav bug where the menu was rendering in normal document flow
(pushing page content down instead of overlaying it) and a related scroll
bug on the "Home" link. Nav now uses a `fixed` overlay menu, backdrop blur,
body-scroll lock while open, `IntersectionObserver`-based active-link
highlighting, and click-driven smooth scrolling instead of raw `#hash` links.

## 7. Authentication — Backend

- Added JWT support (`pyjwt`), `JWT_SECRET_KEY`/`JWT_ALGORITHM`/
  `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env` and `config.py`.
- `core/security.py`: bcrypt password hashing + JWT encode/decode helpers.
- `api/deps.py`: `get_current_user` and `require_roles(*roles)` dependencies
  for role-gated endpoints.
- `api/v1/auth.py`:
  - `POST /auth/login` — accepts **email or phone number** as one
    `identifier` field. Generic "invalid credentials" error regardless of
    whether the identifier exists (prevents account enumeration). **3-attempt
    lockout** (`failed_login_attempts`, `locked_until` on `users`), returns
    `423 Locked` with a time-remaining message, DB-backed so it survives
    restarts/multiple workers (not in-memory).
  - `GET /auth/me` — returns the current user from a valid token.
- Debugged and fixed a chain of setup issues along the way: a broken
  `alembic init`, a circular import (`deps.py` accidentally contained
  `auth.py`'s content), a wrong import path (`app.api.v1` vs
  `app.api.v1.auth`), and missing `app/api/__init__.py` files.
- **Root-caused a bigger issue**: `alembic/env.py` was missing the
  `run_migrations_offline/online()` functions and their invocation at the
  bottom of the file — so `target_metadata = Base.metadata` was set but never
  actually used. This made every `alembic upgrade head` silently do nothing
  with no error, which is why the lockout columns had to be added via a
  manual `ALTER TABLE` before the fix landed. `env.py` is now complete and
  autogenerate correctly diffs models against the DB.
- **Known follow-up (not yet done)**: models don't declare the `Index(...)`/
  unique constraints that exist in the raw SQL schema, and `spatial_ref_sys`
  (a PostGIS system table) isn't excluded — so autogenerate currently reports
  a lot of noise (index/constraint "removals") on every run. Safe to ignore
  for now (never run `upgrade` on a noisy autogenerated file without reading
  it first), but should be cleaned up via `include_object` in `env.py` +
  adding matching `Index()` declarations to the models.

## 8. Registration & Approval Workflow

- Added `approval_status` enum (`pending` / `accepted` / `rejected`) plus
  `accepted_at`, `rejected_at`, `validated_by` (self-referencing FK to
  `users`) — written as a **hand-written** Alembic migration (not
  autogenerate, to avoid the index noise above). Existing seeded users were
  backfilled to `accepted`.
- `POST /auth/register`:
  - Role is restricted to `renter` or `landlord` (never self-serve `admin`).
  - **Renters are auto-accepted** (`approval_status = 'accepted'`,
    `accepted_at` set immediately). **Landlords default to `pending`** for
    admin review.
  - Duplicate email/phone check (case-insensitive email), Pydantic validators
    for PH phone format, password complexity (8+ chars, upper/lower/digit),
    and a `confirm_password` match check — all enforced server-side
    regardless of frontend validation.
  - Creates the linked `RenterProfile` or `LandlordProfile` row in the same
    transaction.
  - **Known gap, not yet done**: no email verification send-out, no per-IP
    rate limiting on `/register` (only login has attempt limiting so far).

## 9. Registration & Login — Frontend

- `AuthContext.jsx`: `login`, `register`, `logout`, persisted JWT in
  `localStorage`, `ROLE_ROUTES` mapping (`renter → /student`,
  `landlord → /landlord`, `admin → /admin`).
- `ProtectedRoute.jsx`: role-gated routing; landlord routes additionally use
  a `requireApproved` flag that shows a "pending review" / "not approved"
  screen instead of the dashboard when `approval_status !== 'accepted'`,
  rather than redirecting away confusingly.
- `LoginPage.jsx` — polished, on-brand, identifier field accepts email or
  phone, password visibility toggle, inline error banner for lockout/invalid
  credential messages.
- `RegisterPage.jsx` — rebuilt as a **3-step wizard** (Role → About You →
  Security) with a progress bar (numbered circles, checkmarks for completed
  steps, connecting line fills in). Per-step validation gates the "Next"
  button; full validation re-runs on final submit. Form state persists
  across steps so navigating back doesn't lose input.
- **Success modal** added post-submit (replacing an immediate redirect):
  renter sees a teal checkmark + "Account created!" and a manual "Continue
  to Login" button; landlord sees a marigold clock icon + review-timeline
  messaging. Redirect to `/login` only happens on that button click, not
  automatically — so the message can't be missed.

---

## Where things stand

Database, models, and migrations are in sync (Alembic fully functional as of
this session). Backend has working, security-conscious auth: login with
email-or-phone + lockout, and a two-tier registration flow where landlords
require admin approval before accessing their dashboard. Frontend has a
polished landing page, login, and multi-step register page, all wired to the
real backend and gated by role + approval status.

## Next up (in rough priority order)

- **Admin review endpoints**: `PATCH /admin/landlords/{id}/approve` and
  `/reject`, plus a basic admin dashboard UI to act on pending landlord
  applications (this is the other half of the approval workflow — landlords
  can apply, but nothing can approve them yet).
- Alembic cleanup: `include_object` to exclude `spatial_ref_sys`, add
  `Index()` declarations to models to match the raw-SQL schema so future
  autogenerate diffs are clean.
- Property registration flow for landlords (the long process: boarding
  house registration certificate upload, room/bed slot setup) — separate
  from account registration, still not started.
- Seed `campuses` + real `renter_profiles`/`landlord_profiles` data.
- Email verification send-out and per-IP rate limiting on `/register`
  (flagged gaps, not urgent for local dev).
