from datetime import datetime, time, timezone
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, cast
from geoalchemy2.elements import WKTElement
from geoalchemy2 import Geometry


from app.core.database import get_db
from app.api.deps import require_roles
from app.core.files import save_upload, ALLOWED_IMAGE_TYPES
from app.models.users import User, LandlordProfile
from app.models.properties import BoardingHouse, Room, Amenity, BoardingHouseAmenity, PropertyImage
from app.models.bookings import Tenancy
from app.models.trust import TrustScore
from app.schemas.property import (
    BoardingHouseCreateRequest, BoardingHouseUpdateRequest, BoardingHouseListItem, BoardingHouseDetail,
    RoomCreateRequest, RoomUpdateRequest, RoomItem, AmenityItem, TenantAtProperty, RoomImageItem,
)

router = APIRouter(prefix="/landlord", tags=["landlord"])
landlord_only = require_roles("landlord")


def _require_approved(landlord: User, db: Session) -> LandlordProfile:
    profile = db.query(LandlordProfile).filter(LandlordProfile.user_id == landlord.id).first()
    if profile is None or profile.approval_status != "accepted":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your landlord account must be approved before you can manage properties.",
        )
    return profile


def _own_property_or_404(property_id: str, landlord_id, db: Session) -> BoardingHouse:
    bh = db.query(BoardingHouse).filter(
        BoardingHouse.id == property_id, BoardingHouse.landlord_id == landlord_id
    ).first()
    if bh is None:
        raise HTTPException(status_code=404, detail="Property not found.")
    return bh


# ---------- Amenities (read-only reference list) ----------

@router.get("/amenities", response_model=list[AmenityItem])
def list_amenities(db: Session = Depends(get_db), _: User = Depends(landlord_only)):
    return db.query(Amenity).order_by(Amenity.category, Amenity.name).all()


# ---------- Boarding houses ----------

@router.get("/properties", response_model=list[BoardingHouseListItem])
def list_properties(db: Session = Depends(get_db), landlord: User = Depends(landlord_only)):
    geom = cast(BoardingHouse.location, Geometry)
    rows = (
        db.query(
            BoardingHouse,
            func.ST_Y(geom).label("lat"),
            func.ST_X(geom).label("lng"),
            func.count(Room.id).label("room_count"),
        )
        .outerjoin(Room, Room.boarding_house_id == BoardingHouse.id)
        .filter(BoardingHouse.landlord_id == landlord.id)
        .group_by(BoardingHouse.id)
        .order_by(BoardingHouse.created_at.desc())
        .all()
    )

    bh_ids = [bh.id for bh, _, _, _ in rows]
    cover_images = {}
    if bh_ids:
        primaries = db.query(PropertyImage).filter(
            PropertyImage.boarding_house_id.in_(bh_ids),
            PropertyImage.room_id.is_(None),
            PropertyImage.is_primary == True,
        ).all()
        cover_images = {img.boarding_house_id: img.image_url for img in primaries}

    return [
        BoardingHouseListItem(
            id=str(bh.id), name=bh.name, address_line=bh.address_line, barangay=bh.barangay,
            municipality=bh.municipality, latitude=lat, longitude=lng, status=bh.status,
            room_count=room_count, created_at=bh.created_at,
            cover_image_url=cover_images.get(bh.id),
        )
        for bh, lat, lng, room_count in rows
    ]



@router.post("/properties", response_model=BoardingHouseDetail, status_code=status.HTTP_201_CREATED)
def create_property(
    payload: BoardingHouseCreateRequest,
    db: Session = Depends(get_db),
    landlord: User = Depends(landlord_only),
):
    _require_approved(landlord, db)

    curfew = None
    if payload.curfew_time:
        try:
            h, m = payload.curfew_time.split(":")
            curfew = time(int(h), int(m))
        except (ValueError, AttributeError):
            raise HTTPException(status_code=422, detail="curfew_time must be in HH:MM format.")

    bh = BoardingHouse(
        landlord_id=landlord.id,
        name=payload.name,
        description=payload.description,
        address_line=payload.address_line,
        barangay=payload.barangay,
        municipality=payload.municipality,
        province=payload.province,
        location=WKTElement(f"POINT({payload.longitude} {payload.latitude})", srid=4326),
        curfew_time=curfew,
        allows_cooking=payload.allows_cooking,
        gender_policy=payload.gender_policy,
        water_supply_rating=payload.water_supply_rating,
        is_sub_metered=payload.is_sub_metered,
        status="pending_review",  # new listings go through admin review before going live
    )
    db.add(bh)
    db.flush()

    for amenity_id in payload.amenity_ids:
        db.add(BoardingHouseAmenity(boarding_house_id=bh.id, amenity_id=amenity_id))

    db.commit()
    return get_property(str(bh.id), db, landlord)


@router.get("/properties/{property_id}", response_model=BoardingHouseDetail)
def get_property(property_id: str, db: Session = Depends(get_db), landlord: User = Depends(landlord_only)):
    bh = _own_property_or_404(property_id, landlord.id, db)

    geom = cast(BoardingHouse.location, Geometry)
    lat, lng = db.query(func.ST_Y(geom), func.ST_X(geom)).filter(BoardingHouse.id == bh.id).first()

    rooms = db.query(Room).filter(Room.boarding_house_id == bh.id).order_by(Room.room_label).all()
    amenities = (
        db.query(Amenity)
        .join(BoardingHouseAmenity, BoardingHouseAmenity.amenity_id == Amenity.id)
        .filter(BoardingHouseAmenity.boarding_house_id == bh.id)
        .all()
    )
    images = db.query(PropertyImage).filter(
        PropertyImage.boarding_house_id == bh.id, PropertyImage.room_id.is_(None)
    ).order_by(PropertyImage.sort_order).all()

    cover = next((i for i in images if i.is_primary), None)

    return BoardingHouseDetail(
        id=str(bh.id), name=bh.name, description=bh.description, address_line=bh.address_line,
        barangay=bh.barangay, municipality=bh.municipality, province=bh.province,
        latitude=lat, longitude=lng, status=bh.status,
        curfew_time=bh.curfew_time.strftime("%H:%M") if bh.curfew_time else None,
        allows_cooking=bh.allows_cooking, gender_policy=bh.gender_policy,
        water_supply_rating=bh.water_supply_rating, is_sub_metered=bh.is_sub_metered,
        room_count=len(rooms), created_at=bh.created_at,
        cover_image_url=cover.image_url if cover else None,
        amenities=[AmenityItem.model_validate(a) for a in amenities],
        rejection_reason=bh.rejection_reason,
        rooms=[RoomItem.model_validate(r) for r in rooms],
        images=[{"id": str(i.id), "url": i.image_url, "is_primary": i.is_primary} for i in images],
    )

@router.patch("/properties/{property_id}", response_model=BoardingHouseDetail)
def update_property(
    property_id: str, payload: BoardingHouseUpdateRequest,
    db: Session = Depends(get_db), landlord: User = Depends(landlord_only),
):
    bh = _own_property_or_404(property_id, landlord.id, db)

    if bh.status == "suspended":
        raise HTTPException(
            status_code=403,
            detail="This property is suspended and can't be edited. Contact support to resolve this.",
        )

    # A landlord editing a rejected (inactive) property is treated as a
    # resubmission — back into the review queue automatically.
    was_inactive = bh.status == "inactive"

    if payload.status is not None:
        if payload.status not in ("active", "inactive"):
            raise HTTPException(
                status_code=403,
                detail="You can only set status to active or inactive. Contact an admin for review or suspension changes.",
            )
        bh.status = payload.status

    for field in ("name", "description", "address_line", "barangay", "allows_cooking",
                  "gender_policy", "water_supply_rating", "is_sub_metered"):
        value = getattr(payload, field)
        if value is not None:
            setattr(bh, field, value)

    if payload.curfew_time is not None:
        try:
            h, m = payload.curfew_time.split(":")
            bh.curfew_time = time(int(h), int(m))
        except ValueError:
            raise HTTPException(status_code=422, detail="curfew_time must be in HH:MM format.")

    if payload.latitude is not None and payload.longitude is not None:
        bh.location = WKTElement(f"POINT({payload.longitude} {payload.latitude})", srid=4326)

    if payload.amenity_ids is not None:
        db.query(BoardingHouseAmenity).filter(BoardingHouseAmenity.boarding_house_id == bh.id).delete()
        for amenity_id in payload.amenity_ids:
            db.add(BoardingHouseAmenity(boarding_house_id=bh.id, amenity_id=amenity_id))

    if was_inactive:
        bh.status = "pending_review"
        bh.rejection_reason = None

    bh.updated_at = datetime.now(timezone.utc)
    db.commit()
    return get_property(property_id, db, landlord)


@router.delete("/properties/{property_id}")
def delete_property(property_id: str, db: Session = Depends(get_db), landlord: User = Depends(landlord_only)):
    bh = _own_property_or_404(property_id, landlord.id, db)

    active_tenancy = (
        db.query(Tenancy)
        .join(Room, Room.id == Tenancy.room_id)
        .filter(Room.boarding_house_id == bh.id, Tenancy.status == "active")
        .first()
    )
    if active_tenancy:
        raise HTTPException(
            status_code=409,
            detail="This property has active tenants and can't be deleted. Set it to inactive instead.",
        )

    db.delete(bh)  # ON DELETE CASCADE handles rooms, bed_slots, images, amenities
    db.commit()
    return {"message": "Property deleted."}


@router.post("/properties/{property_id}/images")
async def upload_property_image(
    property_id: str, file: UploadFile = File(...), is_primary: bool = False,
    db: Session = Depends(get_db), landlord: User = Depends(landlord_only),
):
    bh = _own_property_or_404(property_id, landlord.id, db)
    url = await save_upload(file, "property_images", ALLOWED_IMAGE_TYPES)

    if is_primary:
        db.query(PropertyImage).filter(PropertyImage.boarding_house_id == bh.id).update({"is_primary": False})

    image = PropertyImage(boarding_house_id=bh.id, image_url=url, is_primary=is_primary)
    db.add(image)
    db.commit()
    return {"id": str(image.id), "url": url, "is_primary": is_primary}


@router.post("/properties/{property_id}/cover-image")
async def upload_cover_image(
    property_id: str, file: UploadFile = File(...),
    db: Session = Depends(get_db), landlord: User = Depends(landlord_only),
):
    bh = _own_property_or_404(property_id, landlord.id, db)
    url = await save_upload(file, "property_images", ALLOWED_IMAGE_TYPES)

    # Only one property-level cover at a time — unset any previous primary
    db.query(PropertyImage).filter(
        PropertyImage.boarding_house_id == bh.id, PropertyImage.room_id.is_(None)
    ).update({"is_primary": False})

    image = PropertyImage(boarding_house_id=bh.id, image_url=url, is_primary=True)
    db.add(image)
    db.commit()
    return {"cover_image_url": url}

# ---------- Rooms ----------

@router.post("/properties/{property_id}/rooms", response_model=RoomItem, status_code=status.HTTP_201_CREATED)
def create_room(
    property_id: str, payload: RoomCreateRequest,
    db: Session = Depends(get_db), landlord: User = Depends(landlord_only),
):
    bh = _own_property_or_404(property_id, landlord.id, db)

    if bh.status == "suspended":
        raise HTTPException(status_code=403, detail="This property has been suspended and can't be modified.")

    room = Room(
        boarding_house_id=bh.id, room_label=payload.room_label, room_type=payload.room_type,
        capacity=payload.capacity, base_price_monthly=payload.base_price_monthly,
        has_own_bathroom=payload.has_own_bathroom, has_aircon=payload.has_aircon,
        floor_level=payload.floor_level,
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return RoomItem.model_validate(room)


def _own_room_or_404(room_id: str, landlord_id, db: Session) -> Room:
    room = (
        db.query(Room)
        .join(BoardingHouse, BoardingHouse.id == Room.boarding_house_id)
        .filter(Room.id == room_id, BoardingHouse.landlord_id == landlord_id)
        .first()
    )
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found.")
    return room


@router.patch("/rooms/{room_id}", response_model=RoomItem)
def update_room(
    room_id: str, payload: RoomUpdateRequest,
    db: Session = Depends(get_db), landlord: User = Depends(landlord_only),
):
    room = _own_room_or_404(room_id, landlord.id, db)
    if payload.status is not None and payload.status not in ("available", "full", "maintenance", "delisted"):
        raise HTTPException(status_code=422, detail="Invalid room status.")

    for field in ("room_label", "capacity", "base_price_monthly", "has_own_bathroom",
                  "has_aircon", "floor_level", "status"):
        value = getattr(payload, field)
        if value is not None:
            setattr(room, field, value)

    db.commit()
    db.refresh(room)
    return RoomItem.model_validate(room)


@router.delete("/rooms/{room_id}")
def delete_room(room_id: str, db: Session = Depends(get_db), landlord: User = Depends(landlord_only)):
    room = _own_room_or_404(room_id, landlord.id, db)

    active_tenancy = db.query(Tenancy).filter(Tenancy.room_id == room_id, Tenancy.status == "active").first()
    if active_tenancy:
        raise HTTPException(status_code=409, detail="This room has an active tenant and can't be deleted.")

    db.delete(room)
    db.commit()
    return {"message": "Room deleted."}

@router.get("/rooms/{room_id}/images", response_model=list[RoomImageItem])
def list_room_images(room_id: str, db: Session = Depends(get_db), landlord: User = Depends(landlord_only)):
    _own_room_or_404(room_id, landlord.id, db)
    images = db.query(PropertyImage).filter(
        PropertyImage.room_id == room_id
    ).order_by(PropertyImage.sort_order, PropertyImage.uploaded_at).all()
    return [RoomImageItem(id=str(i.id), url=i.image_url, is_primary=i.is_primary, sort_order=i.sort_order) for i in images]


@router.post("/rooms/{room_id}/images", response_model=list[RoomImageItem])
async def upload_room_images(
    room_id: str, files: list[UploadFile] = File(...),
    db: Session = Depends(get_db), landlord: User = Depends(landlord_only),
):
    _own_room_or_404(room_id, landlord.id, db)

    if len(files) > 10:
        raise HTTPException(status_code=422, detail="You can upload up to 10 images at a time.")

    existing_count = db.query(func.count(PropertyImage.id)).filter(PropertyImage.room_id == room_id).scalar()
    has_primary = db.query(PropertyImage).filter(PropertyImage.room_id == room_id, PropertyImage.is_primary == True).first() is not None

    created = []
    for i, file in enumerate(files):
        url = await save_upload(file, "room_images", ALLOWED_IMAGE_TYPES)
        image = PropertyImage(
            room_id=room_id, image_url=url,
            is_primary=(not has_primary and i == 0),  # first-ever upload becomes the cover automatically
            sort_order=existing_count + i,
        )
        db.add(image)
        created.append(image)

    db.commit()
    for img in created:
        db.refresh(img)
    return [RoomImageItem(id=str(i.id), url=i.image_url, is_primary=i.is_primary, sort_order=i.sort_order) for i in created]


@router.patch("/rooms/images/{image_id}/primary")
def set_room_image_primary(image_id: str, db: Session = Depends(get_db), landlord: User = Depends(landlord_only)):
    image = (
        db.query(PropertyImage)
        .join(Room, Room.id == PropertyImage.room_id)
        .join(BoardingHouse, BoardingHouse.id == Room.boarding_house_id)
        .filter(PropertyImage.id == image_id, BoardingHouse.landlord_id == landlord.id)
        .first()
    )
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found.")

    db.query(PropertyImage).filter(PropertyImage.room_id == image.room_id).update({"is_primary": False})
    image.is_primary = True
    db.commit()
    return {"message": "Cover image updated."}


@router.delete("/rooms/images/{image_id}")
def delete_room_image(image_id: str, db: Session = Depends(get_db), landlord: User = Depends(landlord_only)):
    image = (
        db.query(PropertyImage)
        .join(Room, Room.id == PropertyImage.room_id)
        .join(BoardingHouse, BoardingHouse.id == Room.boarding_house_id)
        .filter(PropertyImage.id == image_id, BoardingHouse.landlord_id == landlord.id)
        .first()
    )
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found.")

    was_primary = image.is_primary
    room_id = image.room_id
    db.delete(image)
    db.flush()

    # If we just deleted the cover, promote the next remaining image automatically
    if was_primary:
        next_image = db.query(PropertyImage).filter(PropertyImage.room_id == room_id).order_by(PropertyImage.sort_order).first()
        if next_image:
            next_image.is_primary = True

    db.commit()
    return {"message": "Image deleted."}


# ---------- Tenants across all of this landlord's properties ----------

@router.get("/tenants", response_model=list[TenantAtProperty])
def list_my_tenants(db: Session = Depends(get_db), landlord: User = Depends(landlord_only)):
    rows = (
        db.query(Tenancy, Room, BoardingHouse, User, TrustScore)
        .join(Room, Room.id == Tenancy.room_id)
        .join(BoardingHouse, BoardingHouse.id == Room.boarding_house_id)
        .join(User, User.id == Tenancy.renter_id)
        .outerjoin(TrustScore, TrustScore.renter_id == User.id)
        .filter(BoardingHouse.landlord_id == landlord.id)
        .order_by(Tenancy.status, Tenancy.start_date.desc())
        .all()
    )
    return [
        TenantAtProperty(
            tenancy_id=str(t.id), renter_id=str(u.id), renter_name=u.full_name,
            renter_email=u.email, renter_phone=u.phone_number, renter_photo_url=u.profile_photo_url,
            trust_score=float(ts.score) if ts else None,
            boarding_house_name=bh.name, room_label=r.room_label,
            bed_slot_label=None,  # populated once bed_slot-level tenancies exist
            monthly_rate=float(t.monthly_rate), start_date=str(t.start_date),
            end_date=str(t.end_date) if t.end_date else None, status=t.status,
        )
        for t, r, bh, u, ts in rows
    ]