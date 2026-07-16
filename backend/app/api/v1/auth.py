# backend/app/api/v1/auth.py
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.users import User
from app.schemas.auth import LoginRequest, TokenResponse, UserPublic
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

MAX_FAILED_ATTEMPTS = 3
LOCKOUT_MINUTES = 15


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        or_(User.email == payload.identifier, User.phone_number == payload.identifier)
    ).first()

    # Generic error for "not found" — never reveal whether the identifier exists
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email/phone number or password.",
    )

    if user is None:
        raise invalid_credentials

    now = datetime.now(timezone.utc)

    # Locked account check
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

    # Success — reset lockout state, record login
    user.failed_login_attempts = 0
    user.locked_until = None
    user.last_login_at = now
    db.commit()
    db.refresh(user)

    token = create_access_token(user_id=str(user.id), role=user.role)
    return TokenResponse(access_token=token, user=UserPublic.model_validate(user, from_attributes=True) if False else UserPublic(
        id=str(user.id), email=user.email, phone_number=user.phone_number,
        full_name=user.full_name, role=user.role,
    ))


@router.get("/me", response_model=UserPublic)
def get_me(current_user: User = Depends(get_current_user)):
    return UserPublic(
        id=str(current_user.id), email=current_user.email, phone_number=current_user.phone_number,
        full_name=current_user.full_name, role=current_user.role,
    )