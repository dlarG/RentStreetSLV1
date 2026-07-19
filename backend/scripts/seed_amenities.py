# backend/scripts/seed_amenities.py
"""
Seeds baseline amenities into the RentStreet database.
Safe to re-run: skips any amenity whose name already exists.

Run from the backend/ folder:
    python -m scripts.seed_amenities
"""
import sys
import os

sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.models.properties import Amenity

SEED_AMENITIES = [
    # --- Connectivity ---
    {"name": "Wi-Fi", "category": "connectivity", "icon_key": "wifi"},
    {"name": "Cable TV", "category": "connectivity", "icon_key": "tv"},

    # --- Utility ---
    {"name": "Sub-metered Electricity", "category": "utility", "icon_key": "zap"},
    {"name": "Sub-metered Water", "category": "utility", "icon_key": "droplet"},
    {"name": "24/7 Water Supply", "category": "utility", "icon_key": "droplets"},
    {"name": "Own Comfort Room", "category": "utility", "icon_key": "shower-head"},
    {"name": "Shared Comfort Room", "category": "utility", "icon_key": "bath"},
    {"name": "Air Conditioning", "category": "utility", "icon_key": "wind"},
    {"name": "Electric Fan", "category": "utility", "icon_key": "fan"},
    {"name": "Study Desk", "category": "utility", "icon_key": "table"},
    {"name": "Closet / Cabinet", "category": "utility", "icon_key": "cabinet"},

    # --- Safety ---
    {"name": "CCTV", "category": "safety", "icon_key": "camera"},
    {"name": "Security Guard", "category": "safety", "icon_key": "shield"},
    {"name": "Gated Property", "category": "safety", "icon_key": "lock"},
    {"name": "Fire Extinguisher", "category": "safety", "icon_key": "flame"},
    {"name": "Well-lit Entrance", "category": "safety", "icon_key": "lightbulb"},

    # --- Lifestyle ---
    {"name": "Cooking Allowed", "category": "lifestyle", "icon_key": "cooking-pot"},
    {"name": "Shared Kitchen", "category": "lifestyle", "icon_key": "utensils"},
    {"name": "Laundry Area", "category": "lifestyle", "icon_key": "washing-machine"},
    {"name": "Common Area / Lounge", "category": "lifestyle", "icon_key": "sofa"},
    {"name": "Parking Space", "category": "lifestyle", "icon_key": "car"},
    {"name": "Pet Friendly", "category": "lifestyle", "icon_key": "paw-print"},
    {"name": "No Curfew", "category": "lifestyle", "icon_key": "moon"},
    {"name": "Near Campus (Walking Distance)", "category": "lifestyle", "icon_key": "footprints"},
    {"name": "Near Public Transport", "category": "lifestyle", "icon_key": "bus"},
    {"name": "Near Grocery / Convenience Store", "category": "lifestyle", "icon_key": "shopping-bag"},
    {"name": "Near Hospital / Clinic", "category": "lifestyle", "icon_key": "hospital"},
    # --- Miscellaneous ---
    {"name": "Furnished", "category": "utility", "icon_key": "couch"},
    {"name": "Unfurnished", "category": "utility", "icon_key": "couch"},
    {"name": "Open for couples", "category": "lifestyle", "icon_key": "heart"},
    {"name": "Open for students", "category": "lifestyle", "icon_key": "graduation-cap"},
    {"name": "Open for working professionals", "category": "lifestyle", "icon_key": "briefcase"},
]


def seed_amenities():
    db = SessionLocal()
    created, skipped = 0, 0
    try:
        for entry in SEED_AMENITIES:
            existing = db.query(Amenity).filter(Amenity.name == entry["name"]).first()
            if existing:
                print(f"⏭️  Skipping (already exists): {entry['name']}")
                skipped += 1
                continue

            db.add(Amenity(**entry))
            created += 1
            print(f"✅ Created: {entry['name']} ({entry['category']})")

        db.commit()
        print(f"\nDone. {created} created, {skipped} skipped.")
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed, rolled back: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_amenities()