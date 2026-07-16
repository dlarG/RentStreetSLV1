# backend/app/api/v1/auth.py
from datetime import datetime, timedelta, timezone
from fastapi import Form, File, UploadFile, APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.users import User, RenterProfile, LandlordProfile
from app.schemas.auth import LoginRequest, TokenResponse, UserPublic, RegisterRequest, RegisterResponse
from app.api.deps import get_current_user
from app.core.files import save_upload, ALLOWED_DOCUMENT_TYPES, ALLOWED_IMAGE_TYPES

router = APIRouter(prefix="/auth", tags=["auth"])

MAX_FAILED_ATTEMPTS = 3
LOCKOUT_MINUTES = 15


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        or_(User.email == payload.identifier, User.phone_number == payload.identifier)
    ).first()

    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email/phone number or password.",
    )

    if user is None:
        raise invalid_credentials

    now = datetime.now(timezone.utc)

    if user.locked_until and user.locked_until > now:
        remaining = int((user.locked_until - now).total_seconds() / 60) + 1
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=f"Too many failed attempts. Try again in {remaining} minute(s).",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Contact support.",
        )

    if not verify_password(payload.password, user.password_hash):
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1

        if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
            user.locked_until = now + timedelta(minutes=LOCKOUT_MINUTES)
            user.failed_login_attempts = 0
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=f"Too many failed attempts. Account locked for {LOCKOUT_MINUTES} minutes.",
            )

        db.commit()
        raise invalid_credentials

    user.failed_login_attempts = 0
    user.locked_until = None
    user.last_login_at = now
    db.commit()
    db.refresh(user)

    token = create_access_token(user_id=str(user.id), role=user.role)
    return TokenResponse(access_token=token, user=UserPublic(**_to_public(user, db)))


@router.get("/me", response_model=UserPublic)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return UserPublic(**_to_public(current_user, db))

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    full_name: str = Form(...),
    email: str = Form(...),
    phone_number: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    role: str = Form(...),
    business_name: str | None = Form(None),
    profile_photo: UploadFile = File(...),
    valid_id: UploadFile | None = File(None),
    business_permit: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    # Reuse the same Pydantic validation rules as before
    try:
        payload = RegisterRequest(
            full_name=full_name, email=email, phone_number=phone_number,
            password=password, confirm_password=confirm_password, role=role,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    email_lower = payload.email.lower()
    is_renter = payload.role == "renter"

    if not is_renter:
        if not business_name or not business_name.strip():
            raise HTTPException(status_code=422, detail="Business name is required for landlord accounts.")
        if not valid_id:
            raise HTTPException(status_code=422, detail="A valid government ID is required for landlord accounts.")
        if not business_permit:
            raise HTTPException(status_code=422, detail="A business permit or boarding house registration certificate is required.")

    existing = db.query(User).filter(
        or_(User.email == email_lower, User.phone_number == payload.phone_number)
    ).first()
    if existing:
        field = "email" if existing.email == email_lower else "phone number"
        raise HTTPException(status_code=409, detail=f"An account with this {field} already exists.")

    profile_photo_url = await save_upload(profile_photo, "profile_photos", ALLOWED_IMAGE_TYPES)

    now = datetime.now(timezone.utc)
    user = User(
        email=email_lower,
        phone_number=payload.phone_number,
        password_hash=hash_password(payload.password),
        role=payload.role,
        full_name=payload.full_name,
        profile_photo_url=profile_photo_url,
        is_active=True,
    )
    db.add(user)
    db.flush()

    if is_renter:
        db.add(RenterProfile(user_id=user.id))
    else:
        valid_id_url = await save_upload(valid_id, "valid_ids", ALLOWED_DOCUMENT_TYPES)
        business_permit_url = await save_upload(business_permit, "business_permits", ALLOWED_DOCUMENT_TYPES)
        db.add(LandlordProfile(
            user_id=user.id,
            business_name=business_name.strip(),
            valid_id_url=valid_id_url,
            business_permit_url=business_permit_url,
            approval_status="pending",
        ))

    db.commit()
    db.refresh(user)

    message = (
        "Account created."
        if is_renter
        else "Application submitted. Our team will review your documents and notify you of the result."
    )
    return {"message": message, "user": _to_public(user, db)}

def _to_public(user: User, db: Session) -> dict:
    approval_status = None
    if user.role == "landlord":
        profile = db.query(LandlordProfile).filter(LandlordProfile.user_id == user.id).first()
        approval_status = profile.approval_status if profile else None
    return {
        "id": str(user.id), "email": user.email, "phone_number": user.phone_number,
        "full_name": user.full_name, "role": user.role, "approval_status": approval_status,
    }