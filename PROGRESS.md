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
