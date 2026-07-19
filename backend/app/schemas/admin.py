from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
import re


class LandlordListItem(BaseModel):
    id: str
    full_name: str
    email: str
    phone_number: str | None
    profile_photo_url: str | None
    business_name: str | None
    approval_status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LandlordDetail(LandlordListItem):
    gcash_number: str | None
    maya_number: str | None
    valid_id_url: str | None
    business_permit_url: str | None
    rejected_at: datetime | None
    rejection_reason: str | None
    accepted_at: datetime | None
    validated_by_name: str | None


class LandlordListResponse(BaseModel):
    items: list[LandlordListItem]
    total: int
    page: int
    page_size: int


class RejectLandlordRequest(BaseModel):
    reason: str

class RenterListItem(BaseModel):
    id: str
    full_name: str
    email: str
    phone_number: str | None
    profile_photo_url: str | None
    valid_id_url: str | None
    trust_score: float | None
    is_active: bool
    registration_ip: str | None
    other_accounts_same_ip: int
    created_at: datetime

    model_config = {"from_attributes": True}


class RenterDetail(RenterListItem):
    academic_major: str | None = None
    year_level: int | None = None
    budget_min: float | None = None
    budget_max: float | None = None


class RenterListResponse(BaseModel):
    items: list[RenterListItem]
    total: int
    page: int
    page_size: int


def _validate_password_strength(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters.")
    if not re.search(r"[A-Z]", v):
        raise ValueError("Password must include an uppercase letter.")
    if not re.search(r"[a-z]", v):
        raise ValueError("Password must include a lowercase letter.")
    if not re.search(r"\d", v):
        raise ValueError("Password must include a number.")
    return v


class RenterCreateRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    password: str

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return _validate_password_strength(v)


class RenterUpdateRequest(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    phone_number: str | None = None
    academic_major: str | None = None
    year_level: int | None = None


class ChangePasswordRequest(BaseModel):
    new_password: str

    @field_validator("new_password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return _validate_password_strength(v)
    
class AdminRoomItem(BaseModel):
    id: str
    room_label: str
    room_type: str
    capacity: int
    base_price_monthly: float
    has_own_bathroom: bool
    has_aircon: bool
    floor_level: int | None
    status: str
    images: list[dict]


class AdminAmenityItem(BaseModel):
    id: int
    name: str
    category: str


class AdminPropertyListItem(BaseModel):
    id: str
    name: str
    address_line: str | None
    barangay: str | None
    municipality: str
    latitude: float
    longitude: float
    status: str
    room_count: int
    cover_image_url: str | None
    landlord_id: str
    landlord_name: str
    landlord_email: str
    created_at: datetime


class AdminPropertyDetail(AdminPropertyListItem):
    description: str | None
    province: str
    curfew_time: str | None
    allows_cooking: bool
    gender_policy: str
    water_supply_rating: int | None
    is_sub_metered: bool
    landlord_phone: str | None
    amenities: list[AdminAmenityItem]
    rooms: list[AdminRoomItem]
    images: list[dict]
    rejection_reason: str | None = None
    suspension_reason: str | None = None


class AdminPropertyListResponse(BaseModel):
    items: list[AdminPropertyListItem]
    total: int
    page: int
    page_size: int


class RejectPropertyRequest(BaseModel):
    reason: str