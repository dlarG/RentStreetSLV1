# backend/app/schemas/auth.py
from pydantic import BaseModel, field_validator


class LoginRequest(BaseModel):
    identifier: str   # email OR phone number
    password: str

    @field_validator("identifier")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Email or phone number is required")
        return v


class UserPublic(BaseModel):
    id: str
    email: str
    phone_number: str | None
    full_name: str
    role: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic