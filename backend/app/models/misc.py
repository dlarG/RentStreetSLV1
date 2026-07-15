# backend/app/models/misc.py
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, SmallInteger, text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("tenancy_id", name="reviews_tenancy_id_key"),)

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    tenancy_id = Column(UUID(as_uuid=True), ForeignKey("tenancies.id"), nullable=False)
    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    boarding_house_id = Column(UUID(as_uuid=True), ForeignKey("boarding_houses.id"), nullable=False)
    rating = Column(SmallInteger, nullable=False)
    comment = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)
    payload = Column(JSONB, server_default=text("'{}'::jsonb"))
    is_read = Column(Boolean, nullable=False, server_default=text("false"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))