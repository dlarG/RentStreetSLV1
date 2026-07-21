from pydantic import BaseModel


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