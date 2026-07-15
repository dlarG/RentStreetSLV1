# backend/app/models/bookings.py
from sqlalchemy import Column, String, Boolean, TIMESTAMP, Date, ForeignKey, Numeric, text, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.core.enums import application_status_enum, tenancy_status_enum, payment_status_enum, payment_method_enum


class RentalApplication(Base):
    __tablename__ = "rental_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    boarding_house_id = Column(UUID(as_uuid=True), ForeignKey("boarding_houses.id"), nullable=False)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"))
    bed_slot_id = Column(UUID(as_uuid=True), ForeignKey("bed_slots.id"))
    status = Column(application_status_enum, nullable=False, server_default="submitted")
    message = Column(String)
    applied_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    decided_at = Column(TIMESTAMP(timezone=True))


class Tenancy(Base):
    __tablename__ = "tenancies"
    __table_args__ = (
        CheckConstraint("room_id IS NOT NULL OR bed_slot_id IS NOT NULL", name="tenancies_room_or_slot_check"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    application_id = Column(UUID(as_uuid=True), ForeignKey("rental_applications.id"))
    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"))
    bed_slot_id = Column(UUID(as_uuid=True), ForeignKey("bed_slots.id"))
    monthly_rate = Column(Numeric(10, 2), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    status = Column(tenancy_status_enum, nullable=False, server_default="pending")
    checkout_compliant = Column(Boolean)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    tenancy_id = Column(UUID(as_uuid=True), ForeignKey("tenancies.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    due_date = Column(Date, nullable=False)
    paid_date = Column(Date)
    status = Column(payment_status_enum, nullable=False, server_default="unpaid")
    method = Column(payment_method_enum)
    reference_number = Column(String(100))
    recorded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))