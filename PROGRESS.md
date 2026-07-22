# RentStreet — Progress Log

_Last updated: July 22, 2026_

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

## 10. Registration — Document Uploads & Trust Score Foundation

- Registration moved to `multipart/form-data`. **Every** registering user
  (renter or landlord) now uploads a profile photo + valid ID; landlords
  additionally upload a business name and a business permit / boarding
  house registration certificate. Files saved to local disk under
  `app/static/uploads/{subfolder}/`, served via `StaticFiles` mount at
  `/static`. **Known gap**: local disk storage won't survive a redeploy —
  flagged for a move to real cloud storage (S3/Cloudinary) before production.
- `RegisterPage.jsx` rebuilt as a **4-step wizard** (Role → About You →
  Security → Documents/Photo), with per-step validation, live image
  previews for uploaded files, and a step count/labels that change based on
  selected role.
- Added `registration_ip` on `users` (logged as an admin investigative
  signal only — explicitly **not** used to auto-block registrations, since
  shared campus/dorm networks would cause false positives; the actual
  anti-duplicate-account tool is a human-reviewed admin screen, see below).
- Every renter gets a `TrustScore` row created at registration
  (`score = 100.00`). Clarified as a design principle: this is an **empty
  ledger**, not a "starting grade" — the row must always exist so a missing
  row is treated as a data-integrity error, not silently treated as "trusted
  by default." No scoring events fire yet since tenancies/payments (the
  triggers for real score changes) don't exist.
- Fixed a chain of bugs along the way: an `AmbiguousForeignKeysError` from
  `LandlordProfile` now having two FKs to `users` (`user_id` and
  `validated_by`) — needed explicit `foreign_keys=` on **both** sides of the
  relationship; a `UserPublic.approval_status` `AttributeError` after that
  field moved off `User` onto `LandlordProfile`; a Pydantic `ValidationError`
  from handing a raw SQLAlchemy `UUID` object into a `str`-typed schema
  field (fixed with a `field_validator(mode="before")` coercion).

## 11. Approval Workflow — Corrected Data Model

- **Moved `approval_status`/`accepted_at`/`rejected_at`/`validated_by` off
  `User` onto `LandlordProfile`**, since only landlords go through approval
  — this was a design mistake from section 8, corrected via a hand-written
  migration that also backfilled existing data before dropping the old
  columns. Added `rejection_reason` on `LandlordProfile` at the same time.
  Removed the now-redundant `is_verified_landlord`/`verified_at` (superseded
  by `approval_status`/`accepted_at`).

## 12. Admin — Landlord Review

- `GET /admin/landlords` (filter by pending/accepted/rejected/all, search,
  paginated), `GET /admin/landlords/{id}` (full detail incl. document
  URLs), `PATCH /admin/landlords/{id}/approve`, `PATCH .../reject` (requires
  a reason, stored and shown back to the landlord), `GET
/admin/landlords/pending-count` (sidebar badge).
- `LandLordManagement.jsx` — 3-tab (Pending/Accepted/Rejected) table with
  search, a details modal showing uploaded ID/permit as clickable links to
  the static file, and approve/reject confirmation modals.

## 13. Admin — Tenant (Renter) Management

- Full CRUD, distinct from the landlord flow: `GET/POST /admin/renters`,
  `PATCH /admin/renters/{id}` (profile fields), `PATCH .../password` (admin
  password reset, also clears any lockout state), `PATCH .../status`
  (activate/deactivate), `DELETE /admin/renters/{id}`.
- **Soft-delete by design**: hard `DELETE` is blocked server-side (`409`) if
  the renter has any `rental_applications`/`tenancies` history — the
  endpoint requires deactivation instead once real history exists, so
  landlord/dispute records are never silently destroyed. A brand-new
  duplicate/dump account with zero history can still be hard-deleted.
- Deactivation reuses the existing `users.is_active` column (present since
  the original schema) — already enforced at login (`403` on inactive
  accounts), so this is a real access-revoking action, not just a display
  flag.
- `other_accounts_same_ip` is computed and surfaced per renter (flagged with
  a warning icon in the table) — the human-review signal for potential
  duplicate accounts described in section 10.
- `TenantManagement.jsx` — table with trust-score-colored badges, Add/Edit/
  View/Delete modals; Edit includes an inline, collapsible "change password"
  section.

## 14. Landlord — Property & Room Management (CRUD)

- New `app/api/v1/landlord.py` router. Endpoints gate on
  `LandlordProfile.approval_status == 'accepted'` for property creation.
- **Boarding houses**: `GET/POST /landlord/properties`, `GET/PATCH/DELETE
/landlord/properties/{id}`. New properties always start at
  `pending_review` regardless of input. `DELETE` is blocked if any room has
  an active tenancy.
- **Rooms**: `POST /landlord/properties/{id}/rooms`, `PATCH/DELETE
/landlord/rooms/{id}`. Deliberately **not** gated behind property
  approval — a landlord can build out rooms while `pending_review`, so
  admins review the whole property (rooms included) in one pass rather than
  approving an empty shell. Blocked only while `suspended`.
- **Images**: property-level cover photo (`POST
/landlord/properties/{id}/cover-image`) and **per-room multi-image
  galleries** (`POST /landlord/rooms/{id}/images`, accepts up to 10 files at
  once; `PATCH .../primary` to change cover; `DELETE` an image). First
  image ever uploaded to an empty room auto-becomes its cover; deleting the
  current cover auto-promotes the next-oldest image rather than leaving the
  room photo-less.
- Uses `PropertyImage.is_primary` (already in the original schema) as the
  single source of truth for "which photo is the cover" — an earlier,
  redundant `registration_image_url` column on `boarding_houses` was
  identified as duplicating this and abandoned in favor of the proper
  `property_images` mechanism.
- Fixed a `psycopg2.errors.UndefinedFunction: st_y(geography)` bug —
  `ST_X`/`ST_Y` are PostGIS **geometry** functions and don't have a
  `geography` overload; reads now `cast(BoardingHouse.location, Geometry)`
  before extracting lat/lng (writes via `WKTElement` were unaffected).
- `PropertyManagement.jsx` (list + cards with cover photos + status
  badges), `PropertyFormModal.jsx` (create/edit with an interactive
  `react-leaflet` map — click-to-place-pin — and amenity multi-select),
  `RoomsModal.jsx` (per-property room list, add/edit/delete, launches the
  room photo gallery modal).

## 15. Landlord — My Tenants (read-only)

- `GET /landlord/tenants` — every tenancy across all of a landlord's
  properties, joined with renter info + trust score. Currently always
  returns empty (no `Tenancy` rows exist yet — nothing creates one until
  the rental-application-accept flow is built), but the endpoint and
  `MyTenants.jsx` UI are ready for when it does.

## 16. Admin — Property Review + Status Workflow

- `GET /admin/properties` (filter by status, search, paginated), `GET
/admin/properties/{id}` (full detail: landlord contact, amenities, every
  room with its images, read-only `react-leaflet` map), `GET
/admin/properties/pending-count`.
- **Three admin actions, gated by current status** (discussed and
  explicitly confirmed as a design decision):
  - **Approve** — from `pending_review` _or_ `inactive` (a landlord
    reconsideration path) → `active`.
  - **Reject** — only from `pending_review`, requires a reason → `inactive`
    (not a hard delete; the property still exists and is landlord-editable).
  - **Suspend** — only from `active` (confirmed: not available from
    `pending_review`, since reject already covers that case), requires a
    reason → `suspended`. **One-way** — no "unsuspend" endpoint exists yet;
    intentionally left as an admin-only action requiring direct
    intervention, not something a landlord can edit their way out of.
- Added `rejection_reason`, `suspension_reason`, `status_updated_by`,
  `status_updated_at` to `boarding_houses`.
- **Auto-resubmission behavior**: any landlord edit (`PATCH`) to an
  `inactive` property automatically flips it back to `pending_review` and
  clears `rejection_reason` — framed to the landlord as "any change here
  resubmits this property for review," shown directly in
  `PropertyFormModal.jsx` alongside the rejection reason so they know why
  changes are needed _and_ what clicking Save will do. Edits to `suspended`
  properties are blocked entirely (`403`) — suspension requires explicit
  admin action to lift, by design.
- `AdminPropertyManagement.jsx` — 4-tab table (Pending/Active/Inactive/
  Suspended) with a detail modal showing the full property (cover photo,
  Leaflet map, landlord contact, amenities, every room with its photo
  strip) and the three status-aware action buttons with reason-capture
  forms.

## 17. Logout

- `AuthContext.logout()` (clear token + user state) already existed but
  wasn't wired to any UI button. Connected across all three role dashboards
  (admin sidebar + navbar, landlord sidebar + navbar), each redirecting to
  `/login` after clearing state. Confirmed this is client-side-only by
  design (stateless JWT, no server session to invalidate) — noted as an
  acceptable tradeoff for now, with token-blocklist-based immediate
  revocation flagged as a possible future hardening step, not a current gap.

## 18. Mobile / PWA Responsiveness

- Reworked both Admin and Landlord dashboard shells from a "shrink the
  sidebar to icons" mobile pattern to a proper **off-canvas drawer**:
  sidebar is `translate-x` hidden below `lg`, full-width when opened via a
  hamburger in the navbar, with a backdrop, body-scroll lock while open, and
  auto-close on navigation.
  Debugged a layout bug where a toggled mobile search dropdown was
  expanding the fixed-height header and overlapping page content below it
  — fixed by making the search bar a permanently inline flex child
  (`flex-1 min-w-0`) instead of a conditionally-rendered block.
- Added `env(safe-area-inset-*)` padding to header/sidebar/footer chrome
  for notched-phone PWA display (requires `viewport-fit=cover` in the
  `index.html` viewport meta tag to actually take effect).

---

## Where things stand

Auth, registration (with document uploads for both roles), and the
landlord-approval workflow are solid and battle-tested through real usage.
The **admin side now has full moderation tooling** for both landlords and
renters (approve/reject/suspend, with reasons that flow back to the
affected user) and for properties (the same three-state review pattern,
plus room/image review). The **landlord side has full property + room CRUD**
with map-based location picking and multi-image galleries. Both admin and
landlord dashboards are mobile/PWA-responsive with proper off-canvas nav.

What's still conspicuously not built: nothing yet lets a **renter** browse
or apply to a room — there's no renter-facing UI at all beyond a login
redirect target, and no `RentalApplication`/`Tenancy` ever gets created,
which is why trust scores and "My Tenants" are correctly wired but
currently always empty. That's the natural next major piece.

## Next up (in rough priority order)

- **Renter-facing browse/search UI** — the interactive Leaflet map search,
  amenity filters, room detail pages described in the original spec. This
  unlocks everything downstream (applications, tenancies, payments, trust
  score actually moving).
- **Rental application flow**: renter applies to a room →
  `rental_applications` row → landlord accepts/rejects → accepted creates a
  `Tenancy`. This is what finally populates "My Tenants" and enables
  payment tracking.
- **Payments + trust score events**: once tenancies exist, recording
  payments (on-time/late) is what actually moves a renter's trust score off
  its neutral starting value for the first time.
- Alembic cleanup: `include_object` to exclude `spatial_ref_sys`, add
  `Index()` declarations to models to match the raw-SQL schema so future
  autogenerate diffs are clean (flagged since section 7, still not done —
  safe to defer indefinitely since the workaround, hand-written migrations,
  is working fine).
- Seed `campuses` data (needed for the renter-facing "near campus" filter).
- Cloud file storage migration (currently local disk — flagged in section 10).
- Email verification send-out, per-IP rate limiting on `/register` (flagged
  since section 9, still open, not urgent for local dev).
- "Unsuspend" endpoint for properties (currently one-way — flagged in
  section 16, needs a decision on whether that's intentional long-term or
  just not built yet).
