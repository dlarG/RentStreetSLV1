from datetime import datetime
from pydantic import BaseModel, field_validator


class RoomCreateRequest(BaseModel):
    room_label: str
    room_type: str  # "private" | "shared"
    capacity: int = 1
    base_price_monthly: float
    has_own_bathroom: bool = False
    has_aircon: bool = False
    floor_level: int | None = None

    @field_validator("room_type")
    @classmethod
    def check_room_type(cls, v: str) -> str:
        if v not in ("private", "shared"):
            raise ValueError("room_type must be 'private' or 'shared'.")
        return v


class RoomUpdateRequest(BaseModel):
    room_label: str | None = None
    capacity: int | None = None
    base_price_monthly: float | None = None
    has_own_bathroom: bool | None = None
    has_aircon: bool | None = None
    floor_level: int | None = None
    status: str | None = None  # "available" | "full" | "maintenance" | "delisted"


class RoomItem(BaseModel):
    id: str
    room_label: str
    room_type: str
    capacity: int
    base_price_monthly: float
    has_own_bathroom: bool
    has_aircon: bool
    floor_level: int | None
    status: str

    @field_validator("id", mode="before")
    @classmethod
    def stringify_id(cls, v):
        return str(v)

    model_config = {"from_attributes": True}


class BoardingHouseCreateRequest(BaseModel):
    name: str
    description: str | None = None
    address_line: str | None = None
    barangay: str | None = None
    municipality: str = "Sogod"
    province: str = "Southern Leyte"
    latitude: float
    longitude: float
    curfew_time: str | None = None  # "HH:MM", None = no curfew
    allows_cooking: bool = False
    gender_policy: str = "mixed"
    water_supply_rating: int | None = None
    is_sub_metered: bool = True
    amenity_ids: list[int] = []

    @field_validator("gender_policy")
    @classmethod
    def check_gender_policy(cls, v: str) -> str:
        if v not in ("male_only", "female_only", "mixed"):
            raise ValueError("gender_policy must be male_only, female_only, or mixed.")
        return v

    @field_validator("water_supply_rating")
    @classmethod
    def check_rating(cls, v: int | None) -> int | None:
        if v is not None and not (1 <= v <= 5):
            raise ValueError("water_supply_rating must be between 1 and 5.")
        return v


class BoardingHouseUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    address_line: str | None = None
    barangay: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    curfew_time: str | None = None
    allows_cooking: bool | None = None
    gender_policy: str | None = None
    water_supply_rating: int | None = None
    is_sub_metered: bool | None = None
    status: str | None = None  # landlord can only set active/inactive; pending_review/suspended are admin-only
    amenity_ids: list[int] | None = None


class AmenityItem(BaseModel):
    id: int
    name: str
    category: str
    icon_key: str | None

    model_config = {"from_attributes": True}


class BoardingHouseListItem(BaseModel):
    id: str
    name: str
    address_line: str | None
    barangay: str | None
    municipality: str
    latitude: float
    longitude: float
    status: str
    room_count: int
    cover_image_url: str | None = None   # <-- new
    created_at: datetime


class BoardingHouseDetail(BoardingHouseListItem):
    description: str | None
    province: str
    curfew_time: str | None
    allows_cooking: bool
    gender_policy: str
    water_supply_rating: int | None
    is_sub_metered: bool
    amenities: list[AmenityItem]
    rooms: list[RoomItem]
    images: list[dict]


class TenantAtProperty(BaseModel):
    tenancy_id: str
    renter_id: str
    renter_name: str
    renter_email: str
    renter_phone: str | None
    renter_photo_url: str | None
    trust_score: float | None
    boarding_house_name: str
    room_label: str
    bed_slot_label: str | None
    monthly_rate: float
    start_date: str
    end_date: str | None
    status: str

class RoomImageItem(BaseModel):
    id: str
    url: str
    is_primary: bool
    sort_order: int