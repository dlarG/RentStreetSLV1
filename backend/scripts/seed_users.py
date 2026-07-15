# backend/scripts/seed_users.py
"""
Seeds baseline users into the RentStreet database.
Safe to re-run: skips any user whose email already exists.

Run from the backend/ folder:
    python -m scripts.seed_users
"""
import sys
import os

sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.users import User

SEED_USERS = [
    {
        "email": "admin@rentstreet.ph",
        "phone_number": "09170000001",
        "password": "AdminPass123!",
        "role": "admin",
        "full_name": "RentStreet Admin",
    },
    {
        "email": "landlord.delacruz@rentstreet.ph",
        "phone_number": "09170000002",
        "password": "LandlordPass123!",
        "role": "landlord",
        "full_name": "Josefina Dela Cruz",
    },
    {
        "email": "landlord.reyes@rentstreet.ph",
        "phone_number": "09170000003",
        "password": "LandlordPass123!",
        "role": "landlord",
        "full_name": "Marco Reyes",
    },
    {
        "email": "renter.santos@rentstreet.ph",
        "phone_number": "09170000004",
        "password": "RenterPass123!",
        "role": "renter",
        "full_name": "Angelo Santos",
    },
    {
        "email": "renter.bautista@rentstreet.ph",
        "phone_number": "09170000005",
        "password": "RenterPass123!",
        "role": "renter",
        "full_name": "Kristine Bautista",
    },
    {
        "email": "renter.villar@rentstreet.ph",
        "phone_number": "09170000006",
        "password": "RenterPass123!",
        "role": "renter",
        "full_name": "Paolo Villar",
    },
]


def seed_users():
    db = SessionLocal()
    created, skipped = 0, 0
    try:
        for entry in SEED_USERS:
            existing = db.query(User).filter(User.email == entry["email"]).first()
            if existing:
                print(f"⏭️  Skipping (already exists): {entry['email']}")
                skipped += 1
                continue

            user = User(
                email=entry["email"],
                phone_number=entry["phone_number"],
                password_hash=hash_password(entry["password"]),
                role=entry["role"],
                full_name=entry["full_name"],
                is_email_verified=True,   # seeded users treated as pre-verified
                is_active=True,
            )
            db.add(user)
            created += 1
            print(f"✅ Created: {entry['full_name']} ({entry['role']}) - {entry['email']}")

        db.commit()
        print(f"\nDone. {created} created, {skipped} skipped.")
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed, rolled back: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_users()