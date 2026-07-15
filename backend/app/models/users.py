# backend/app/models/users.py
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, SmallInteger, Numeric, Integer, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography
from app.core.database import Base
from app.core.enums import user_role_enum


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    email = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String(20), unique=True)
    password_hash = Column(String, nullable=False)
    role = Column(user_role_enum, nullable=False)
    full_name = Column(String(150), nullable=False)
    profile_photo_url = Column(String)
    is_email_verified = Column(Boolean, nullable=False, server_default=text("false"))
    is_active = Column(Boolean, nullable=False, server_default=text("true"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))

    renter_profile = relationship("RenterProfile", back_populates="user", uselist=False)
    landlord_profile = relationship("LandlordProfile", back_populates="user", uselist=False)


class Campus(Base):
    __tablename__ = "campuses"

    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    short_code = Column(String(20), nullable=False)
    municipality = Column(String(100), nullable=False)
    province = Column(String(100), nullable=False)
    location = Column(Geography(geometry_type="POINT", srid=4326), nullable=False)
    is_active = Column(Boolean, nullable=False, server_default=text("true"))


class RenterProfile(Base):
    __tablename__ = "renter_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    campus_id = Column(Integer, ForeignKey("campuses.id"))
    academic_major = Column(String(150))
    year_level = Column(SmallInteger)
    budget_min = Column(Numeric(10, 2))
    budget_max = Column(Numeric(10, 2))
    study_habits = Column(String(30))
    lifestyle_tags = Column(JSONB, server_default=text("'[]'::jsonb"))
    trust_score_consent = Column(Boolean, nullable=False, server_default=text("false"))
    trust_score_consent_at = Column(TIMESTAMP(timezone=True))

    user = relationship("User", back_populates="renter_profile")


class LandlordProfile(Base):
    __tablename__ = "landlord_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    business_name = Column(String(150))
    gcash_number = Column(String(20))
    maya_number = Column(String(20))
    valid_id_url = Column(String)
    is_verified_landlord = Column(Boolean, nullable=False, server_default=text("false"))
    verified_at = Column(TIMESTAMP(timezone=True))

    user = relationship("User", back_populates="landlord_profile")