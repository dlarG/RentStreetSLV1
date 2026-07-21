from pydantic import BaseModel


class RenterProfileDetail(BaseModel):
    id: str
    full_name: str
    email: str
    phone_number: str | None
    profile_photo_url: str | None
    valid_id_url: str | None
    renter_type: str
    campus_id: int | None
    campus_name: str | None
    academic_major: str | None
    year_level: int | None
    occupation: str | None
    employer_name: str | None
    stay_duration: str | None
    budget_min: float | None
    budget_max: float | None
    created_at: str


class RenterProfileUpdateRequest(BaseModel):
    full_name: str | None = None
    phone_number: str | None = None
    renter_type: str | None = None
    campus_id: int | None = None
    academic_major: str | None = None
    year_level: int | None = None
    occupation: str | None = None
    employer_name: str | None = None
    stay_duration: str | None = None
    budget_min: float | None = None
    budget_max: float | None = None


class DeactivateAccountRequest(BaseModel):
    password: str

class ProfileChecklistItem(BaseModel):
    field: str
    label: str
    done: bool


class ProfileCompleteness(BaseModel):
    is_complete: bool
    percent: int
    checklist: list[ProfileChecklistItem]


class DashboardStats(BaseModel):
    active_applications: int
    favorites: int
    trust_score: float
    current_tenancy: dict | None


class NearbyProperty(BaseModel):
    id: str
    name: str
    barangay: str | None
    municipality: str
    cover_image_url: str | None
    min_price: float | None
    distance_km: float | None


class ActivityItem(BaseModel):
    id: str
    type: str  # "application" | "payment" | "move_in"
    description: str
    time: str

class AmenityMini(BaseModel):
    id: int
    name: str
    icon_key: str | None


class PropertySearchItem(BaseModel):
    id: str
    name: str
    cover_image_url: str | None
    barangay: str | None
    municipality: str
    price_label: str
    min_price: float
    max_price: float
    avg_rating: float | None
    review_count: int
    available_rooms_count: int
    amenities: list[AmenityMini]
    is_favorited: bool
    latitude: float
    longitude: float


class PropertySearchResponse(BaseModel):
    items: list[PropertySearchItem]
    total: int
    page: int
    page_size: int


class PublicRoomItem(BaseModel):
    id: str
    room_label: str
    room_type: str
    capacity: int
    base_price_monthly: float
    has_own_bathroom: bool
    has_aircon: bool
    status: str
    images: list[dict]


class PropertyPublicDetail(PropertySearchItem):
    description: str | None
    curfew_time: str | None
    allows_cooking: bool
    gender_policy: str
    water_supply_rating: int | None
    is_sub_metered: bool
    rooms: list[PublicRoomItem]
    all_amenities: list[AmenityMini]


class ApplyRequest(BaseModel):
    room_id: str
    message: str | None = None