# backend/app/schemas/auth.py
from pydantic import BaseModel, EmailStr, field_validator, model_validator
import re
PH_PHONE_REGEX = re.compile(r"^(09\d{9}|\+639\d{9})$")


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
    approval_status: str | None = None
    profile_photo_url: str | None = None  

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    password: str
    confirm_password: str
    role: str  # "renter" or "landlord" — never "admin", that's not self-servable

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Please enter your full name.")
        return v

    @field_validator("phone_number")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not PH_PHONE_REGEX.match(v):
            raise ValueError("Enter a valid PH mobile number, e.g. 09171234567.")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("renter", "landlord"):
            raise ValueError("Role must be renter or landlord.")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must include an uppercase letter.")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must include a lowercase letter.")
        if not re.search(r"\d", v):
            raise ValueError("Password must include a number.")
        return v

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


class RegisterResponse(BaseModel):
    message: str
    user: "UserPublic"