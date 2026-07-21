from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, cast
from geoalchemy2 import Geometry

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.users import User, RenterProfile
from app.models.trust import TrustScore
from app.models.bookings import RentalApplication, Tenancy
from app.models.properties import BoardingHouse, Room, PropertyImage
from app.models.ml import Favorite
from app.schemas.renter import (
    ProfileCompleteness, ProfileChecklistItem, DashboardStats,
    NearbyProperty, ActivityItem,
)

router = APIRouter(prefix="/renter", tags=["renter"])
renter_only = require_roles("renter")


@router.get("/profile/completeness", response_model=ProfileCompleteness)
def get_profile_completeness(db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    profile = db.query(RenterProfile).filter(RenterProfile.user_id == renter.id).first()

    checklist = [
        ProfileChecklistItem(field="campus", label="Campus", done=bool(profile and profile.campus_id)),
        ProfileChecklistItem(field="academic_major", label="Academic major", done=bool(profile and profile.academic_major)),
        ProfileChecklistItem(field="year_level", label="Year level", done=bool(profile and profile.year_level)),
        ProfileChecklistItem(field="budget", label="Budget range", done=bool(profile and (profile.budget_min or profile.budget_max))),
    ]
    missing = [item for item in checklist if not item.done]
    return ProfileCompleteness(
        is_complete=len(missing) == 0,
        percent=int((len(checklist) - len(missing)) / len(checklist) * 100),
        checklist=checklist,
    )


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    active_applications = db.query(func.count(RentalApplication.id)).filter(
        RentalApplication.renter_id == renter.id,
        RentalApplication.status.in_(("submitted", "viewed")),
    ).scalar()

    favorites = db.query(func.count(Favorite.room_id)).filter(Favorite.renter_id == renter.id).scalar()

    trust = db.query(TrustScore).filter(TrustScore.renter_id == renter.id).first()
    trust_score = float(trust.score) if trust else 100.0

    tenancy = (
        db.query(Tenancy, Room, BoardingHouse)
        .join(Room, Room.id == Tenancy.room_id)
        .join(BoardingHouse, BoardingHouse.id == Room.boarding_house_id)
        .filter(Tenancy.renter_id == renter.id, Tenancy.status == "active")
        .first()
    )
    current_tenancy = None
    if tenancy:
        t, room, bh = tenancy
        current_tenancy = {
            "boarding_house_name": bh.name, "room_label": room.room_label,
            "monthly_rate": float(t.monthly_rate), "start_date": str(t.start_date),
        }

    return DashboardStats(
        active_applications=active_applications, favorites=favorites,
        trust_score=trust_score, current_tenancy=current_tenancy,
    )


@router.get("/properties/nearby", response_model=list[NearbyProperty])
def get_nearby_properties(
    limit: int = Query(3, ge=1, le=20),
    db: Session = Depends(get_db),
    renter: User = Depends(renter_only),
):
    geom = cast(BoardingHouse.location, Geometry)
    profile = db.query(RenterProfile).filter(RenterProfile.user_id == renter.id).first()

    query = (
        db.query(
            BoardingHouse,
            func.min(Room.base_price_monthly).label("min_price"),
        )
        .join(Room, Room.boarding_house_id == BoardingHouse.id)
        .filter(BoardingHouse.status == "active", Room.status == "available")
        .group_by(BoardingHouse.id)
    )

    # If the renter has a campus set, order by real distance to it; otherwise
    # just show the most recently listed active properties.
    if profile and profile.campus_id:
        from app.models.users import Campus
        campus = db.query(Campus).filter(Campus.id == profile.campus_id).first()
        if campus:
            campus_geom = cast(Campus.location, Geometry)
            distance_expr = func.ST_Distance(
                func.ST_Transform(geom, 3857), func.ST_Transform(campus_geom, 3857)
            )
            rows = query.add_columns(distance_expr.label("distance_m")).order_by("distance_m").limit(limit).all()
            return [
                NearbyProperty(
                    id=str(bh.id), name=bh.name, barangay=bh.barangay, municipality=bh.municipality,
                    cover_image_url=_cover_image(db, bh.id), min_price=float(min_price) if min_price else None,
                    distance_km=round(distance_m / 1000, 1) if distance_m is not None else None,
                )
                for bh, min_price, distance_m in rows
            ]

    rows = query.order_by(BoardingHouse.created_at.desc()).limit(limit).all()
    return [
        NearbyProperty(
            id=str(bh.id), name=bh.name, barangay=bh.barangay, municipality=bh.municipality,
            cover_image_url=_cover_image(db, bh.id), min_price=float(min_price) if min_price else None,
            distance_km=None,
        )
        for bh, min_price in rows
    ]


@router.get("/dashboard/recent-activity", response_model=list[ActivityItem])
def get_recent_activity(db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    # No dedicated activity-log table yet — built from applications for now.
    # Extend this once payments/tenancy-status-change events exist too.
    applications = (
        db.query(RentalApplication, BoardingHouse)
        .join(BoardingHouse, BoardingHouse.id == RentalApplication.boarding_house_id)
        .filter(RentalApplication.renter_id == renter.id)
        .order_by(RentalApplication.applied_at.desc())
        .limit(5)
        .all()
    )
    return [
        ActivityItem(
            id=str(app.id), type="application",
            description=f"Applied to {bh.name}",
            time=_relative_time(app.applied_at),
        )
        for app, bh in applications
    ]


def _cover_image(db: Session, bh_id) -> str | None:
    img = db.query(PropertyImage).filter(
        PropertyImage.boarding_house_id == bh_id, PropertyImage.room_id.is_(None), PropertyImage.is_primary == True
    ).first()
    return img.image_url if img else None


def _relative_time(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    delta = datetime.now(timezone.utc) - dt
    seconds = delta.total_seconds()
    if seconds < 60:
        return "just now"
    if seconds < 3600:
        return f"{int(seconds // 60)} min ago"
    if seconds < 86400:
        return f"{int(seconds // 3600)} hour(s) ago"
    return f"{int(seconds // 86400)} day(s) ago"