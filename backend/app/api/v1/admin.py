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