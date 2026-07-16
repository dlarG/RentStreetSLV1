from datetime import datetime
from pydantic import BaseModel


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