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