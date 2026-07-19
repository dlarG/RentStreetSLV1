# backend/app/models/properties.py
from sqlalchemy import (
    Column, String, Boolean, TIMESTAMP, ForeignKey, SmallInteger,
    Numeric, Integer, Time, text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography
from app.core.database import Base
from app.core.enums import (
    gender_policy_enum, property_status_enum, room_type_enum,
    room_status_enum, bed_slot_status_enum, amenity_category_enum,
)


class BoardingHouse(Base):
    __tablename__ = "boarding_houses"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    landlord_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    campus_id = Column(Integer, ForeignKey("campuses.id"))
    name = Column(String(150), nullable=False)
    description = Column(String)
    address_line = Column(String(255))
    barangay = Column(String(100))
    municipality = Column(String(100), nullable=False, server_default="Sogod")
    province = Column(String(100), nullable=False, server_default="Southern Leyte")
    location = Column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    curfew_time = Column(Time)
    allows_cooking = Column(Boolean, nullable=False, server_default=text("false"))
    gender_policy = Column(gender_policy_enum, nullable=False, server_default="mixed")
    water_supply_rating = Column(SmallInteger)
    is_sub_metered = Column(Boolean, nullable=False, server_default=text("true"))
    status = Column(property_status_enum, nullable=False, server_default="pending_review")
    rejection_reason = Column(String, nullable=True)
    suspension_reason = Column(String, nullable=True)
    status_updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    status_updated_at = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    registration_image_url = Column(String)
    
    
    rooms = relationship("Room", back_populates="boarding_house", cascade="all, delete-orphan")
    amenities = relationship("Amenity", secondary="boarding_house_amenities")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    boarding_house_id = Column(UUID(as_uuid=True), ForeignKey("boarding_houses.id", ondelete="CASCADE"), nullable=False)
    room_label = Column(String(50), nullable=False)
    room_type = Column(room_type_enum, nullable=False)
    capacity = Column(SmallInteger, nullable=False, server_default="1")
    base_price_monthly = Column(Numeric(10, 2), nullable=False)
    has_own_bathroom = Column(Boolean, nullable=False, server_default=text("false"))
    has_aircon = Column(Boolean, nullable=False, server_default=text("false"))
    floor_level = Column(SmallInteger)
    status = Column(room_status_enum, nullable=False, server_default="available")
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))

    boarding_house = relationship("BoardingHouse", back_populates="rooms")
    bed_slots = relationship("BedSlot", back_populates="room", cascade="all, delete-orphan")


class BedSlot(Base):
    __tablename__ = "bed_slots"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    slot_label = Column(String(30), nullable=False)
    price_monthly = Column(Numeric(10, 2), nullable=False)
    status = Column(bed_slot_status_enum, nullable=False, server_default="vacant")
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))

    room = relationship("Room", back_populates="bed_slots")


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True)
    name = Column(String(80), unique=True, nullable=False)
    category = Column(amenity_category_enum, nullable=False)
    icon_key = Column(String(50))


class BoardingHouseAmenity(Base):
    __tablename__ = "boarding_house_amenities"

    boarding_house_id = Column(UUID(as_uuid=True), ForeignKey("boarding_houses.id", ondelete="CASCADE"), primary_key=True)
    amenity_id = Column(Integer, ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True)


class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    boarding_house_id = Column(UUID(as_uuid=True), ForeignKey("boarding_houses.id", ondelete="CASCADE"))
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"))
    image_url = Column(String, nullable=False)
    is_primary = Column(Boolean, nullable=False, server_default=text("false"))
    sort_order = Column(SmallInteger, nullable=False, server_default="0")
    uploaded_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))