from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.core.database import get_db
from app.api.deps import require_roles
from app.models.users import User, LandlordProfile
from app.schemas.admin import (
    LandlordListItem, LandlordDetail, LandlordListResponse, RejectLandlordRequest,
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