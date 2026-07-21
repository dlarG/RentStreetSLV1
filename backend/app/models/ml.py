# backend/app/models/ml.py
from sqlalchemy import Column, String, TIMESTAMP, Date, ForeignKey, Numeric, Integer, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base
from app.core.enums import interaction_type_enum


class PricePrediction(Base):
    __tablename__ = "price_predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"))
    predicted_price = Column(Numeric(10, 2), nullable=False)
    input_features = Column(JSONB, nullable=False)
    model_version = Column(String(30), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class ListingInteraction(Base):
    __tablename__ = "listing_interactions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    boarding_house_id = Column(UUID(as_uuid=True), ForeignKey("boarding_houses.id"), nullable=False)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"))
    interaction_type = Column(interaction_type_enum, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class Favorite(Base):
    __tablename__ = "favorites"

    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    boarding_house_id = Column(UUID(as_uuid=True), ForeignKey("boarding_houses.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class EnrollmentCycle(Base):
    __tablename__ = "enrollment_cycles"

    id = Column(Integer, primary_key=True)
    campus_id = Column(Integer, ForeignKey("campuses.id"), nullable=False)
    semester_label = Column(String(50), nullable=False)
    enrollment_start_date = Column(Date, nullable=False)
    classes_start_date = Column(Date)
    expected_influx_count = Column(Integer)
    actual_influx_count = Column(Integer)