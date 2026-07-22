from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, cast
from fastapi import status
from geoalchemy2 import Geometry
from sqlalchemy import or_

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.users import User, RenterProfile
from app.models.trust import TrustScore
from app.models.bookings import RentalApplication, Tenancy
from app.models.properties import BoardingHouse, Room, PropertyImage, Amenity, BoardingHouseAmenity
from app.models.ml import Favorite
from app.models.misc import Review
from fastapi import UploadFile, File
from app.models.misc import Notification
from app.core.security import verify_password
from app.core.files import save_upload, ALLOWED_IMAGE_TYPES
from app.models.users import Campus
from app.schemas.renter import (
    ApplicationListItem, ProfileCompleteness, ProfileChecklistItem, DashboardStats,
    NearbyProperty, ActivityItem, RenterProfileDetail, RenterProfileUpdateRequest, DeactivateAccountRequest,
    AmenityMini, PropertySearchItem, PropertySearchResponse,
    PublicRoomItem, PropertyPublicDetail, ApplyRequest,
)

router = APIRouter(prefix="/renter", tags=["renter"])
renter_only = require_roles("renter")


def _profile_to_detail(user: User, profile: RenterProfile, db: Session) -> RenterProfileDetail:
    campus_name = None
    if profile and profile.campus_id:
        campus = db.query(Campus).filter(Campus.id == profile.campus_id).first()
        campus_name = campus.name if campus else None

    return RenterProfileDetail(
        id=str(user.id), full_name=user.full_name, email=user.email,
        phone_number=user.phone_number, profile_photo_url=user.profile_photo_url,
        valid_id_url=profile.valid_id_url if profile else None,
        renter_type=profile.renter_type if profile else "student",
        campus_id=profile.campus_id if profile else None, campus_name=campus_name,
        academic_major=profile.academic_major if profile else None,
        year_level=profile.year_level if profile else None,
        occupation=profile.occupation if profile else None,
        employer_name=profile.employer_name if profile else None,
        stay_duration=profile.stay_duration if profile else None,
        budget_min=float(profile.budget_min) if profile and profile.budget_min else None,
        budget_max=float(profile.budget_max) if profile and profile.budget_max else None,
        created_at=str(user.created_at),
    )


@router.get("/profile", response_model=RenterProfileDetail)
def get_profile(db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    profile = db.query(RenterProfile).filter(RenterProfile.user_id == renter.id).first()
    return _profile_to_detail(renter, profile, db)

@router.patch("/profile", response_model=RenterProfileDetail)
def update_profile(
    payload: RenterProfileUpdateRequest,
    db: Session = Depends(get_db), renter: User = Depends(renter_only),
):
    if payload.full_name is not None:
        if len(payload.full_name.strip()) < 2:
            raise HTTPException(status_code=422, detail="Please enter your full name.")
        renter.full_name = payload.full_name.strip()

    if payload.phone_number is not None:
        conflict = db.query(User).filter(User.phone_number == payload.phone_number, User.id != renter.id).first()
        if conflict:
            raise HTTPException(status_code=409, detail="Another account already uses this phone number.")
        renter.phone_number = payload.phone_number

    profile = db.query(RenterProfile).filter(RenterProfile.user_id == renter.id).first()
    if profile is None:
        profile = RenterProfile(user_id=renter.id)
        db.add(profile)

    if payload.renter_type is not None:
        if payload.renter_type not in ("student", "worker", "tourist", "other"):
            raise HTTPException(status_code=422, detail="Invalid renter type.")
        profile.renter_type = payload.renter_type

    # Only persist type-specific fields relevant to the (possibly just-updated) type —
    # keeps stale data from a previous type from lingering (e.g. an old academic_major
    # sitting around after switching from student to tourist).
    effective_type = payload.renter_type or profile.renter_type

    if effective_type == "student":
        if payload.campus_id is not None:
            profile.campus_id = payload.campus_id
        if payload.academic_major is not None:
            profile.academic_major = payload.academic_major
        if payload.year_level is not None:
            profile.year_level = payload.year_level
    elif effective_type == "worker":
        if payload.occupation is not None:
            profile.occupation = payload.occupation
        if payload.employer_name is not None:
            profile.employer_name = payload.employer_name
    elif effective_type == "tourist":
        if payload.stay_duration is not None:
            profile.stay_duration = payload.stay_duration

    if payload.budget_min is not None:
        profile.budget_min = payload.budget_min
    if payload.budget_max is not None:
        profile.budget_max = payload.budget_max

    db.commit()
    db.refresh(renter)
    db.refresh(profile)
    return _profile_to_detail(renter, profile, db)


@router.post("/profile/photo", response_model=RenterProfileDetail)
async def update_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db), renter: User = Depends(renter_only),
):
    url = await save_upload(file, "profile_photos", ALLOWED_IMAGE_TYPES)
    renter.profile_photo_url = url
    db.commit()
    profile = db.query(RenterProfile).filter(RenterProfile.user_id == renter.id).first()
    return _profile_to_detail(renter, profile, db)


@router.post("/account/deactivate")
def deactivate_own_account(
    payload: DeactivateAccountRequest,
    db: Session = Depends(get_db), renter: User = Depends(renter_only),
):
    if not verify_password(payload.password, renter.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    renter.is_active = False
    db.commit()
    return {"message": "Your account has been deactivated."}


@router.get("/profile/completeness", response_model=ProfileCompleteness)
def get_profile_completeness(db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    profile = db.query(RenterProfile).filter(RenterProfile.user_id == renter.id).first()

    checklist = [
        ProfileChecklistItem(field="renter_type", label="Who you are", done=bool(profile and profile.renter_type)),
        ProfileChecklistItem(field="budget", label="Budget range", done=bool(profile and (profile.budget_min or profile.budget_max))),
    ]

    if profile and profile.renter_type == "student":
        checklist.append(ProfileChecklistItem(field="campus", label="Campus", done=bool(profile.campus_id)))
        checklist.append(ProfileChecklistItem(field="academic_major", label="Academic major", done=bool(profile.academic_major)))
    elif profile and profile.renter_type == "worker":
        checklist.append(ProfileChecklistItem(field="occupation", label="Occupation", done=bool(profile.occupation)))
    elif profile and profile.renter_type == "tourist":
        checklist.append(ProfileChecklistItem(field="stay_duration", label="Expected stay length", done=bool(profile.stay_duration)))

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

    favorites = db.query(func.count(Favorite.boarding_house_id)).filter(Favorite.renter_id == renter.id).scalar()

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

@router.get("/properties/search", response_model=PropertySearchResponse)
def search_properties(
    search: str = Query(""),
    sort: str = Query("rating"),  # rating | price_low | price_high | newest
    min_price: float | None = Query(None),
    max_price: float | None = Query(None),
    amenity_ids: list[int] = Query([]),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    db: Session = Depends(get_db),
    renter: User = Depends(renter_only),
):
    geom = cast(BoardingHouse.location, Geometry)

    room_agg = (
        db.query(
            Room.boarding_house_id.label("bh_id"),
            func.min(Room.base_price_monthly).label("min_price"),
            func.max(Room.base_price_monthly).label("max_price"),
            func.count(Room.id).label("available_rooms"),
        )
        .filter(Room.status == "available")
        .group_by(Room.boarding_house_id)
        .subquery()
    )
    review_agg = (
        db.query(
            Review.boarding_house_id.label("bh_id"),
            func.avg(Review.rating).label("avg_rating"),
            func.count(Review.id).label("review_count"),
        )
        .group_by(Review.boarding_house_id)
        .subquery()
    )
    

    query = (
        db.query(
            BoardingHouse, room_agg.c.min_price, room_agg.c.max_price, room_agg.c.available_rooms,
            review_agg.c.avg_rating, review_agg.c.review_count,
        )
        .join(room_agg, room_agg.c.bh_id == BoardingHouse.id)
        .outerjoin(review_agg, review_agg.c.bh_id == BoardingHouse.id)
        .filter(BoardingHouse.status == "active")
    )


    if search:
        like = f"%{search}%"
        query = query.filter(or_(BoardingHouse.name.ilike(like), BoardingHouse.barangay.ilike(like)))
    if min_price is not None:
        query = query.filter(room_agg.c.max_price >= min_price)
    if max_price is not None:
        query = query.filter(room_agg.c.min_price <= max_price)
    if amenity_ids:
        subq = (
            db.query(BoardingHouseAmenity.boarding_house_id)
            .filter(BoardingHouseAmenity.amenity_id.in_(amenity_ids))
            .group_by(BoardingHouseAmenity.boarding_house_id)
            .having(func.count(BoardingHouseAmenity.amenity_id.distinct()) == len(amenity_ids))
        )
        query = query.filter(BoardingHouse.id.in_(subq))

    total = query.count()

    if sort == "price_low":
        query = query.order_by(room_agg.c.min_price.asc())
    elif sort == "price_high":
        query = query.order_by(room_agg.c.max_price.desc())
    elif sort == "newest":
        query = query.order_by(BoardingHouse.created_at.desc())
    else:  # rating (default)
        query = query.order_by(func.coalesce(review_agg.c.avg_rating, 0).desc(), room_agg.c.available_rooms.desc())

    rows = query.offset((page - 1) * page_size).limit(page_size).all()

    favorited_ids = {
        f.boarding_house_id for f in db.query(Favorite).filter(Favorite.renter_id == renter.id).all()
    }

    items = []
    for bh, min_price_v, max_price_v, avail, avg_rating, review_count in rows:
        amenities = (
            db.query(Amenity)
            .join(BoardingHouseAmenity, BoardingHouseAmenity.amenity_id == Amenity.id)
            .filter(BoardingHouseAmenity.boarding_house_id == bh.id)
            .limit(5)
            .all()
        )
        price_label = (
            f"\u20b1{int(min_price_v):,}" if min_price_v == max_price_v
            else f"\u20b1{int(min_price_v):,} - \u20b1{int(max_price_v):,}"
        )
        lat, lng = db.query(func.ST_Y(geom), func.ST_X(geom)).filter(BoardingHouse.id == bh.id).first()
        items.append(PropertySearchItem(
            id=str(bh.id), name=bh.name, cover_image_url=_cover_image(db, bh.id),
            barangay=bh.barangay, municipality=bh.municipality,
            price_label=price_label, min_price=float(min_price_v), max_price=float(max_price_v),
            avg_rating=round(float(avg_rating), 1) if avg_rating else None, review_count=review_count or 0,
            available_rooms_count=avail,
            amenities=[AmenityMini(id=a.id, name=a.name, icon_key=a.icon_key) for a in amenities],
            is_favorited=bh.id in favorited_ids, latitude=lat, longitude=lng,
        ))

    return PropertySearchResponse(items=items, total=total, page=page, page_size=page_size)

@router.get("/properties/{property_id}", response_model=PropertyPublicDetail)
def get_property_public_detail(property_id: str, db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    bh = db.query(BoardingHouse).filter(BoardingHouse.id == property_id, BoardingHouse.status == "active").first()
    if bh is None:
        raise HTTPException(status_code=404, detail="Property not found.")

    geom = cast(BoardingHouse.location, Geometry)
    lat, lng = db.query(func.ST_Y(geom), func.ST_X(geom)).filter(BoardingHouse.id == bh.id).first()

    rooms = db.query(Room).filter(Room.boarding_house_id == bh.id).order_by(Room.room_label).all()
    room_images = {}
    if rooms:
        imgs = db.query(PropertyImage).filter(
            PropertyImage.room_id.in_([r.id for r in rooms])
        ).order_by(PropertyImage.sort_order).all()
        for img in imgs:
            room_images.setdefault(img.room_id, []).append(
                {"id": str(img.id), "url": img.image_url, "is_primary": img.is_primary}
            )

    amenities = (
        db.query(Amenity).join(BoardingHouseAmenity, BoardingHouseAmenity.amenity_id == Amenity.id)
        .filter(BoardingHouseAmenity.boarding_house_id == bh.id).all()
    )

    avg_rating, review_count = db.query(
        func.avg(Review.rating), func.count(Review.id)
    ).filter(Review.boarding_house_id == bh.id).first()

    available_rooms = [r for r in rooms if r.status == "available"]
    prices = [float(r.base_price_monthly) for r in (available_rooms or rooms)]
    min_price_v, max_price_v = (min(prices), max(prices)) if prices else (0.0, 0.0)
    price_label = (
        f"\u20b1{int(min_price_v):,}" if min_price_v == max_price_v
        else f"\u20b1{int(min_price_v):,} - \u20b1{int(max_price_v):,}"
    )

    is_favorited = db.query(Favorite).filter(
        Favorite.renter_id == renter.id, Favorite.boarding_house_id == bh.id
    ).first() is not None

    my_applications = db.query(RentalApplication).filter(
        RentalApplication.renter_id == renter.id,
        RentalApplication.boarding_house_id == bh.id,
        RentalApplication.status.in_(("submitted", "viewed", "accepted")),
    ).all()
    room_application_status = {str(a.room_id): a.status for a in my_applications if a.room_id}

    return PropertyPublicDetail(
        id=str(bh.id), name=bh.name, cover_image_url=_cover_image(db, bh.id),
        barangay=bh.barangay, municipality=bh.municipality,
        price_label=price_label, min_price=min_price_v, max_price=max_price_v,
        avg_rating=round(float(avg_rating), 1) if avg_rating else None, review_count=review_count or 0,
        available_rooms_count=len(available_rooms),
        amenities=[AmenityMini(id=a.id, name=a.name, icon_key=a.icon_key) for a in amenities[:5]],
        is_favorited=is_favorited, latitude=lat, longitude=lng,
        description=bh.description, curfew_time=bh.curfew_time.strftime("%H:%M") if bh.curfew_time else None,
        allows_cooking=bh.allows_cooking, gender_policy=bh.gender_policy,
        water_supply_rating=bh.water_supply_rating, is_sub_metered=bh.is_sub_metered,
        rooms=[
            PublicRoomItem(
                id=str(r.id), room_label=r.room_label, room_type=r.room_type, capacity=r.capacity,
                base_price_monthly=float(r.base_price_monthly), has_own_bathroom=r.has_own_bathroom,
                has_aircon=r.has_aircon, status=r.status, images=room_images.get(r.id, []),
            )
            for r in rooms
        ],
        room_application_status=room_application_status,
        all_amenities=[AmenityMini(id=a.id, name=a.name, icon_key=a.icon_key) for a in amenities],
    )

@router.post("/favorites/{boarding_house_id}")
def add_favorite(boarding_house_id: str, db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    bh = db.query(BoardingHouse).filter(BoardingHouse.id == boarding_house_id).first()
    if bh is None:
        raise HTTPException(status_code=404, detail="Property not found.")
    exists = db.query(Favorite).filter(
        Favorite.renter_id == renter.id, Favorite.boarding_house_id == boarding_house_id
    ).first()
    if not exists:
        db.add(Favorite(renter_id=renter.id, boarding_house_id=boarding_house_id))
        db.commit()
    return {"is_favorited": True}


@router.delete("/favorites/{boarding_house_id}")
def remove_favorite(boarding_house_id: str, db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    db.query(Favorite).filter(
        Favorite.renter_id == renter.id, Favorite.boarding_house_id == boarding_house_id
    ).delete()
    db.commit()
    return {"is_favorited": False}


@router.post("/applications", status_code=status.HTTP_201_CREATED)
def apply_to_room(payload: ApplyRequest, db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    room = db.query(Room).filter(Room.id == payload.room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found.")
    bh = db.query(BoardingHouse).filter(BoardingHouse.id == room.boarding_house_id).first()
    if bh is None or bh.status != "active":
        raise HTTPException(status_code=409, detail="This property isn't currently accepting applications.")
    if room.status != "available":
        raise HTTPException(status_code=409, detail="This room is no longer available.")

    existing = db.query(RentalApplication).filter(
        RentalApplication.renter_id == renter.id,
        RentalApplication.room_id == payload.room_id,
        RentalApplication.status.in_(("submitted", "viewed", "accepted")),
    ).first()
    if existing:
        detail = (
            "You're already renting this room."
            if existing.status == "accepted"
            else "You already have a pending application for this room."
        )
        raise HTTPException(status_code=409, detail=detail)

    application = RentalApplication(
        renter_id=renter.id, boarding_house_id=bh.id, room_id=room.id, message=payload.message,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return {"message": "Application submitted! The landlord will review it soon.", "id": str(application.id)}

@router.get("/applications", response_model=list[ApplicationListItem])
def list_my_applications(
    status_filter: str = Query("all"),
    db: Session = Depends(get_db), renter: User = Depends(renter_only),
):
    query = (
        db.query(RentalApplication, BoardingHouse, Room)
        .join(BoardingHouse, BoardingHouse.id == RentalApplication.boarding_house_id)
        .join(Room, Room.id == RentalApplication.room_id)
        .filter(RentalApplication.renter_id == renter.id)
    )
    if status_filter != "all":
        query = query.filter(RentalApplication.status == status_filter)

    rows = query.order_by(RentalApplication.applied_at.desc()).all()
    return [
        ApplicationListItem(
            id=str(app.id), boarding_house_id=str(bh.id), boarding_house_name=bh.name,
            cover_image_url=_cover_image(db, bh.id), room_id=str(room.id), room_label=room.room_label,
            monthly_rate=float(room.base_price_monthly), status=app.status, message=app.message,
            applied_at=str(app.applied_at), decided_at=str(app.decided_at) if app.decided_at else None,
        )
        for app, bh, room in rows
    ]


@router.get("/applications/pending-count")
def applications_pending_count(db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    count = db.query(func.count(RentalApplication.id)).filter(
        RentalApplication.renter_id == renter.id,
        RentalApplication.status.in_(("submitted", "viewed")),
    ).scalar()
    return {"count": count}


@router.patch("/applications/{application_id}/withdraw")
def withdraw_application(
    application_id: str, db: Session = Depends(get_db), renter: User = Depends(renter_only),
):
    app = db.query(RentalApplication).filter(
        RentalApplication.id == application_id, RentalApplication.renter_id == renter.id,
    ).first()
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found.")
    if app.status not in ("submitted", "viewed"):
        raise HTTPException(status_code=409, detail="Only pending applications can be withdrawn.")

    app.status = "withdrawn"
    app.decided_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Application withdrawn."}

@router.get("/notifications/unread-count")
def notifications_unread_count(db: Session = Depends(get_db), renter: User = Depends(renter_only)):
    count = db.query(func.count(Notification.id)).filter(
        Notification.user_id == renter.id, Notification.is_read == False,
    ).scalar()
    return {"count": count}