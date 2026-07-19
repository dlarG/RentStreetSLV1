from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from geoalchemy2 import Geometry
from sqlalchemy import cast
from sqlalchemy import or_, func

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.users import User, LandlordProfile, RenterProfile
from app.core.security import hash_password
from app.models.bookings import RentalApplication, Tenancy
from app.models.properties import BoardingHouse, Room, Amenity, BoardingHouseAmenity, PropertyImage
from app.schemas.admin import (
    LandlordListItem, LandlordDetail, LandlordListResponse, RejectLandlordRequest, RenterListItem, RenterDetail, RenterListResponse,
    RenterCreateRequest, RenterUpdateRequest, ChangePasswordRequest, AdminPropertyListItem, AdminPropertyDetail, AdminPropertyListResponse,
    AdminRoomItem, AdminAmenityItem, RejectPropertyRequest,
)

from app.models.users import RenterProfile
from app.models.trust import TrustScore, TrustScoreEvent


router = APIRouter(prefix="/admin", tags=["admin"])

admin_only = require_roles("admin")


def _base_query(db: Session):
    return db.query(User, LandlordProfile).join(
        LandlordProfile, LandlordProfile.user_id == User.id
    )


@router.get("/landlords/pending-count")
def pending_count(db: Session = Depends(get_db), _: User = Depends(admin_only)):
    count = db.query(func.count(LandlordProfile.user_id)).filter(
        LandlordProfile.approval_status == "pending"
    ).scalar()
    return {"count": count}


@router.get("/landlords", response_model=LandlordListResponse)
def list_landlords(
    status_filter: str = Query("pending", alias="status"),  # "pending" | "accepted" | "rejected" | "all"
    search: str = Query(""),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(admin_only),
):
    query = _base_query(db)

    if status_filter != "all":
        if status_filter not in ("pending", "accepted", "rejected"):
            raise HTTPException(status_code=422, detail="status must be pending, accepted, rejected, or all.")
        query = query.filter(LandlordProfile.approval_status == status_filter)

    if search:
        like = f"%{search}%"
        query = query.filter(or_(
            User.full_name.ilike(like),
            User.email.ilike(like),
            LandlordProfile.business_name.ilike(like),
        ))

    total = query.count()
    rows = (
        query.order_by(User.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = [
        LandlordListItem(
            id=str(user.id), full_name=user.full_name, email=user.email,
            phone_number=user.phone_number, profile_photo_url=user.profile_photo_url,
            business_name=profile.business_name, approval_status=profile.approval_status,
            created_at=user.created_at,
        )
        for user, profile in rows
    ]
    return LandlordListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/landlords/{user_id}", response_model=LandlordDetail)
def get_landlord(user_id: str, db: Session = Depends(get_db), _: User = Depends(admin_only)):
    row = _base_query(db).filter(User.id == user_id).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Landlord not found.")
    user, profile = row

    validator_name = None
    if profile.validated_by:
        validator = db.query(User).filter(User.id == profile.validated_by).first()
        validator_name = validator.full_name if validator else None

    return LandlordDetail(
        id=str(user.id), full_name=user.full_name, email=user.email,
        phone_number=user.phone_number, profile_photo_url=user.profile_photo_url,
        business_name=profile.business_name, approval_status=profile.approval_status,
        created_at=user.created_at, gcash_number=profile.gcash_number,
        maya_number=profile.maya_number, valid_id_url=profile.valid_id_url,
        business_permit_url=profile.business_permit_url, rejected_at=profile.rejected_at,
        rejection_reason=profile.rejection_reason, accepted_at=profile.accepted_at,
        validated_by_name=validator_name,
    )


@router.patch("/landlords/{user_id}/approve", response_model=LandlordDetail)
def approve_landlord(
    user_id: str, db: Session = Depends(get_db), admin: User = Depends(admin_only),
):
    profile = db.query(LandlordProfile).filter(LandlordProfile.user_id == user_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Landlord not found.")

    now = datetime.now(timezone.utc)
    profile.approval_status = "accepted"
    profile.accepted_at = now
    profile.rejected_at = None
    profile.rejection_reason = None
    profile.validated_by = admin.id
    db.commit()

    return get_landlord(user_id, db, admin)


@router.patch("/landlords/{user_id}/reject", response_model=LandlordDetail)
def reject_landlord(
    user_id: str, payload: RejectLandlordRequest,
    db: Session = Depends(get_db), admin: User = Depends(admin_only),
):
    if not payload.reason.strip():
        raise HTTPException(status_code=422, detail="A rejection reason is required.")

    profile = db.query(LandlordProfile).filter(LandlordProfile.user_id == user_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Landlord not found.")

    now = datetime.now(timezone.utc)
    profile.approval_status = "rejected"
    profile.rejected_at = now
    profile.rejection_reason = payload.reason.strip()
    profile.accepted_at = None
    profile.validated_by = admin.id
    db.commit()

    return get_landlord(user_id, db, admin)

@router.get("/renters")
def list_renters(
    search: str = Query(""),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(admin_only),
):
    query = (
        db.query(User, RenterProfile, TrustScore)
        .join(RenterProfile, RenterProfile.user_id == User.id)
        .outerjoin(TrustScore, TrustScore.renter_id == User.id)
        .filter(User.role == "renter")
    )
    if search:
        like = f"%{search}%"
        query = query.filter(or_(User.full_name.ilike(like), User.email.ilike(like)))

    total = query.count()
    rows = query.order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    # Flag same-IP registrations as a review hint — surfaced, never enforced
    items = []
    for user, profile, trust in rows:
        same_ip_count = 0
        if user.registration_ip:
            same_ip_count = db.query(func.count(User.id)).filter(
                User.registration_ip == user.registration_ip, User.id != user.id
            ).scalar()
        items.append({
            "id": str(user.id), "full_name": user.full_name, "email": user.email,
            "phone_number": user.phone_number, "profile_photo_url": user.profile_photo_url,
            "valid_id_url": profile.valid_id_url, "trust_score": float(trust.score) if trust else None,
            "is_active": user.is_active, "registration_ip": user.registration_ip,
            "other_accounts_same_ip": same_ip_count, "created_at": user.created_at,
        })
    return {"items": items, "total": total, "page": page, "page_size": page_size}


@router.patch("/renters/{user_id}/trust-score")
def adjust_trust_score(
    user_id: str, points_delta: int, reason: str,
    db: Session = Depends(get_db), admin: User = Depends(admin_only),
):
    if not reason.strip():
        raise HTTPException(status_code=422, detail="A reason is required for any trust score adjustment.")

    trust = db.query(TrustScore).filter(TrustScore.renter_id == user_id).first()
    if trust is None:
        raise HTTPException(status_code=404, detail="No trust score record for this renter.")

    trust.score = max(0, min(100, float(trust.score) + points_delta))
    trust.last_updated = datetime.now(timezone.utc)

    db.add(TrustScoreEvent(
        renter_id=user_id, event_type="admin_adjustment",
        points_delta=points_delta, created_by=admin.id,
    ))
    db.commit()
    return {"score": float(trust.score)}


@router.patch("/renters/{user_id}/deactivate")
def deactivate_renter(user_id: str, db: Session = Depends(get_db), _: User = Depends(admin_only)):
    user = db.query(User).filter(User.id == user_id, User.role == "renter").first()
    if user is None:
        raise HTTPException(status_code=404, detail="Renter not found.")
    user.is_active = False
    db.commit()
    return {"message": "Account deactivated."}

def _renter_to_item(user: User, profile: RenterProfile, trust: TrustScore | None, db: Session) -> RenterListItem:
    same_ip_count = 0
    if user.registration_ip:
        same_ip_count = db.query(func.count(User.id)).filter(
            User.registration_ip == user.registration_ip, User.id != user.id
        ).scalar()
    return RenterListItem(
        id=str(user.id), full_name=user.full_name, email=user.email,
        phone_number=user.phone_number, profile_photo_url=user.profile_photo_url,
        valid_id_url=profile.valid_id_url if profile else None,
        trust_score=float(trust.score) if trust else None,
        is_active=user.is_active, registration_ip=user.registration_ip,
        other_accounts_same_ip=same_ip_count, created_at=user.created_at,
    )


@router.get("/renters", response_model=RenterListResponse)
def list_renters(
    search: str = Query(""),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(admin_only),
):
    query = (
        db.query(User, RenterProfile, TrustScore)
        .join(RenterProfile, RenterProfile.user_id == User.id)
        .outerjoin(TrustScore, TrustScore.renter_id == User.id)
        .filter(User.role == "renter")
    )
    if search:
        like = f"%{search}%"
        query = query.filter(or_(User.full_name.ilike(like), User.email.ilike(like)))

    total = query.count()
    rows = query.order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    items = [_renter_to_item(user, profile, trust, db) for user, profile, trust in rows]
    return RenterListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/renters/{user_id}", response_model=RenterDetail)
def get_renter(user_id: str, db: Session = Depends(get_db), _: User = Depends(admin_only)):
    row = (
        db.query(User, RenterProfile, TrustScore)
        .join(RenterProfile, RenterProfile.user_id == User.id)
        .outerjoin(TrustScore, TrustScore.renter_id == User.id)
        .filter(User.id == user_id, User.role == "renter")
        .first()
    )
    if row is None:
        raise HTTPException(status_code=404, detail="Renter not found.")
    user, profile, trust = row
    base = _renter_to_item(user, profile, trust, db)
    return RenterDetail(
        **base.model_dump(),
        academic_major=profile.academic_major, year_level=profile.year_level,
        budget_min=float(profile.budget_min) if profile.budget_min else None,
        budget_max=float(profile.budget_max) if profile.budget_max else None,
    )


@router.post("/renters", response_model=RenterDetail, status_code=status.HTTP_201_CREATED)
def create_renter(payload: RenterCreateRequest, db: Session = Depends(get_db), _: User = Depends(admin_only)):
    email_lower = payload.email.lower()
    existing = db.query(User).filter(
        or_(User.email == email_lower, User.phone_number == payload.phone_number)
    ).first()
    if existing:
        field = "email" if existing.email == email_lower else "phone number"
        raise HTTPException(status_code=409, detail=f"An account with this {field} already exists.")

    user = User(
        email=email_lower, phone_number=payload.phone_number,
        password_hash=hash_password(payload.password), role="renter",
        full_name=payload.full_name, is_active=True,
    )
    db.add(user)
    db.flush()
    db.add(RenterProfile(user_id=user.id))
    db.add(TrustScore(renter_id=user.id, score=100.00))
    db.commit()

    return get_renter(str(user.id), db, None)


@router.patch("/renters/{user_id}", response_model=RenterDetail)
def update_renter(
    user_id: str, payload: RenterUpdateRequest,
    db: Session = Depends(get_db), _: User = Depends(admin_only),
):
    user = db.query(User).filter(User.id == user_id, User.role == "renter").first()
    if user is None:
        raise HTTPException(status_code=404, detail="Renter not found.")

    if payload.email is not None:
        email_lower = payload.email.lower()
        conflict = db.query(User).filter(User.email == email_lower, User.id != user.id).first()
        if conflict:
            raise HTTPException(status_code=409, detail="Another account already uses this email.")
        user.email = email_lower

    if payload.phone_number is not None:
        conflict = db.query(User).filter(User.phone_number == payload.phone_number, User.id != user.id).first()
        if conflict:
            raise HTTPException(status_code=409, detail="Another account already uses this phone number.")
        user.phone_number = payload.phone_number

    if payload.full_name is not None:
        user.full_name = payload.full_name

    profile = db.query(RenterProfile).filter(RenterProfile.user_id == user.id).first()
    if profile:
        if payload.academic_major is not None:
            profile.academic_major = payload.academic_major
        if payload.year_level is not None:
            profile.year_level = payload.year_level

    db.commit()
    return get_renter(user_id, db, None)


@router.patch("/renters/{user_id}/password")
def change_renter_password(
    user_id: str, payload: ChangePasswordRequest,
    db: Session = Depends(get_db), admin: User = Depends(admin_only),
):
    user = db.query(User).filter(User.id == user_id, User.role == "renter").first()
    if user is None:
        raise HTTPException(status_code=404, detail="Renter not found.")

    user.password_hash = hash_password(payload.new_password)
    # Clear any lockout state — an admin-issued reset shouldn't leave the account stuck
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return {"message": "Password updated."}


@router.patch("/renters/{user_id}/status")
def set_renter_status(
    user_id: str, is_active: bool,
    db: Session = Depends(get_db), _: User = Depends(admin_only),
):
    user = db.query(User).filter(User.id == user_id, User.role == "renter").first()
    if user is None:
        raise HTTPException(status_code=404, detail="Renter not found.")
    user.is_active = is_active
    db.commit()
    return {"message": "Account reactivated." if is_active else "Account deactivated."}


@router.delete("/renters/{user_id}")
def delete_renter(user_id: str, db: Session = Depends(get_db), _: User = Depends(admin_only)):
    user = db.query(User).filter(User.id == user_id, User.role == "renter").first()
    if user is None:
        raise HTTPException(status_code=404, detail="Renter not found.")

    # Never hard-delete an account with real rental history — that history
    # (applications, tenancies, and by extension payments/trust events tied
    # to them) needs to survive for landlords and disputes. Deactivate instead.
    has_applications = db.query(RentalApplication).filter(RentalApplication.renter_id == user_id).first()
    has_tenancies = db.query(Tenancy).filter(Tenancy.renter_id == user_id).first()
    if has_applications or has_tenancies:
        raise HTTPException(
            status_code=409,
            detail="This renter has application or rental history and can't be permanently deleted. Deactivate the account instead.",
        )

    db.query(TrustScoreEvent).filter(TrustScoreEvent.renter_id == user_id).delete()
    db.query(TrustScore).filter(TrustScore.renter_id == user_id).delete()
    db.query(RenterProfile).filter(RenterProfile.user_id == user_id).delete()
    db.delete(user)
    db.commit()
    return {"message": "Account permanently deleted."}

def _property_cover(db: Session, bh_id) -> str | None:
    img = db.query(PropertyImage).filter(
        PropertyImage.boarding_house_id == bh_id, PropertyImage.room_id.is_(None), PropertyImage.is_primary == True
    ).first()
    return img.image_url if img else None


@router.get("/properties/pending-count")
def properties_pending_count(db: Session = Depends(get_db), _: User = Depends(admin_only)):
    count = db.query(func.count(BoardingHouse.id)).filter(BoardingHouse.status == "pending_review").scalar()
    return {"count": count}


@router.get("/properties", response_model=AdminPropertyListResponse)
def list_properties(
    status_filter: str = Query("pending_review", alias="status"),  # active|inactive|pending_review|suspended|all
    search: str = Query(""),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(admin_only),
):
    geom = cast(BoardingHouse.location, Geometry)
    query = (
        db.query(
            BoardingHouse,
            func.ST_Y(geom).label("lat"), func.ST_X(geom).label("lng"),
            func.count(Room.id.distinct()).label("room_count"),
            User.full_name.label("landlord_name"), User.email.label("landlord_email"),
        )
        .join(User, User.id == BoardingHouse.landlord_id)
        .outerjoin(Room, Room.boarding_house_id == BoardingHouse.id)
        .group_by(BoardingHouse.id, User.id)
    )

    if status_filter != "all":
        valid = ("active", "inactive", "pending_review", "suspended")
        if status_filter not in valid:
            raise HTTPException(status_code=422, detail=f"status must be one of {valid} or all.")
        query = query.filter(BoardingHouse.status == status_filter)

    if search:
        like = f"%{search}%"
        query = query.filter(or_(BoardingHouse.name.ilike(like), User.full_name.ilike(like)))

    total = query.count()
    rows = query.order_by(BoardingHouse.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    items = [
        AdminPropertyListItem(
            id=str(bh.id), name=bh.name, address_line=bh.address_line, barangay=bh.barangay,
            municipality=bh.municipality, latitude=lat, longitude=lng, status=bh.status,
            room_count=room_count, cover_image_url=_property_cover(db, bh.id),
            landlord_id=str(bh.landlord_id), landlord_name=landlord_name, landlord_email=landlord_email,
            created_at=bh.created_at,
        )
        for bh, lat, lng, room_count, landlord_name, landlord_email in rows
    ]
    return AdminPropertyListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/properties/{property_id}", response_model=AdminPropertyDetail)
def get_property(property_id: str, db: Session = Depends(get_db), _: User = Depends(admin_only)):
    row = (
        db.query(BoardingHouse, User)
        .join(User, User.id == BoardingHouse.landlord_id)
        .filter(BoardingHouse.id == property_id)
        .first()
    )
    if row is None:
        raise HTTPException(status_code=404, detail="Property not found.")
    bh, landlord = row

    geom = cast(BoardingHouse.location, Geometry)
    lat, lng = db.query(func.ST_Y(geom), func.ST_X(geom)).filter(BoardingHouse.id == bh.id).first()

    rooms = db.query(Room).filter(Room.boarding_house_id == bh.id).order_by(Room.room_label).all()
    room_images = {}
    if rooms:
        imgs = db.query(PropertyImage).filter(PropertyImage.room_id.in_([r.id for r in rooms])).order_by(PropertyImage.sort_order).all()
        for img in imgs:
            room_images.setdefault(img.room_id, []).append({"id": str(img.id), "url": img.image_url, "is_primary": img.is_primary})

    amenities = (
        db.query(Amenity).join(BoardingHouseAmenity, BoardingHouseAmenity.amenity_id == Amenity.id)
        .filter(BoardingHouseAmenity.boarding_house_id == bh.id).all()
    )
    property_images = db.query(PropertyImage).filter(
        PropertyImage.boarding_house_id == bh.id, PropertyImage.room_id.is_(None)
    ).order_by(PropertyImage.sort_order).all()
    cover = next((i for i in property_images if i.is_primary), None)

    return AdminPropertyDetail(
        id=str(bh.id), name=bh.name, description=bh.description, address_line=bh.address_line,
        barangay=bh.barangay, municipality=bh.municipality, province=bh.province,
        latitude=lat, longitude=lng, status=bh.status,
        curfew_time=bh.curfew_time.strftime("%H:%M") if bh.curfew_time else None,
        allows_cooking=bh.allows_cooking, gender_policy=bh.gender_policy,
        water_supply_rating=bh.water_supply_rating, is_sub_metered=bh.is_sub_metered,
        room_count=len(rooms), cover_image_url=cover.image_url if cover else None,
        landlord_id=str(landlord.id), landlord_name=landlord.full_name,
        landlord_email=landlord.email, landlord_phone=landlord.phone_number,
        created_at=bh.created_at,
        rejection_reason=bh.rejection_reason, suspension_reason=bh.suspension_reason,
        amenities=[AdminAmenityItem(id=a.id, name=a.name, category=a.category) for a in amenities],
        rooms=[
            AdminRoomItem(
                id=str(r.id), room_label=r.room_label, room_type=r.room_type, capacity=r.capacity,
                base_price_monthly=float(r.base_price_monthly), has_own_bathroom=r.has_own_bathroom,
                has_aircon=r.has_aircon, floor_level=r.floor_level, status=r.status,
                images=room_images.get(r.id, []),
            )
            for r in rooms
        ],
        images=[{"id": str(i.id), "url": i.image_url, "is_primary": i.is_primary} for i in property_images],
    )


@router.patch("/properties/{property_id}/approve", response_model=AdminPropertyDetail)
def approve_property(property_id: str, db: Session = Depends(get_db), admin: User = Depends(admin_only)):
    bh = db.query(BoardingHouse).filter(BoardingHouse.id == property_id).first()
    if bh is None:
        raise HTTPException(status_code=404, detail="Property not found.")
    if bh.status not in ("pending_review", "inactive"):
        raise HTTPException(status_code=409, detail=f"Can't approve a property that is currently {bh.status}.")

    bh.status = "active"
    bh.rejection_reason = None
    bh.status_updated_by = admin.id
    bh.status_updated_at = datetime.now(timezone.utc)
    bh.updated_at = datetime.now(timezone.utc)
    db.commit()
    return get_property(property_id, db, admin)


@router.patch("/properties/{property_id}/reject", response_model=AdminPropertyDetail)
def reject_property(
    property_id: str, payload: RejectPropertyRequest,
    db: Session = Depends(get_db), admin: User = Depends(admin_only),
):
    if not payload.reason.strip():
        raise HTTPException(status_code=422, detail="A rejection reason is required.")
    bh = db.query(BoardingHouse).filter(BoardingHouse.id == property_id).first()
    if bh is None:
        raise HTTPException(status_code=404, detail="Property not found.")
    if bh.status != "pending_review":
        raise HTTPException(status_code=409, detail="Only properties awaiting review can be rejected.")

    bh.status = "inactive"
    bh.rejection_reason = payload.reason.strip()
    bh.status_updated_by = admin.id
    bh.status_updated_at = datetime.now(timezone.utc)
    bh.updated_at = datetime.now(timezone.utc)
    db.commit()
    return get_property(property_id, db, admin)


@router.patch("/properties/{property_id}/suspend", response_model=AdminPropertyDetail)
def suspend_property(
    property_id: str, payload: RejectPropertyRequest,  # reused shape: { reason: str }
    db: Session = Depends(get_db), admin: User = Depends(admin_only),
):
    if not payload.reason.strip():
        raise HTTPException(status_code=422, detail="A suspension reason is required.")
    bh = db.query(BoardingHouse).filter(BoardingHouse.id == property_id).first()
    if bh is None:
        raise HTTPException(status_code=404, detail="Property not found.")
    if bh.status == "suspended":
        raise HTTPException(status_code=409, detail="This property is already suspended.")

    bh.status = "suspended"
    bh.suspension_reason = payload.reason.strip()
    bh.status_updated_by = admin.id
    bh.status_updated_at = datetime.now(timezone.utc)
    bh.updated_at = datetime.now(timezone.utc)
    db.commit()
    return get_property(property_id, db, admin)