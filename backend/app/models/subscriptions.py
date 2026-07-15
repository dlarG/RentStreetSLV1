# backend/app/models/subscriptions.py
from sqlalchemy import Column, String, TIMESTAMP, Date, ForeignKey, Numeric, Integer, Boolean, text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.core.enums import subscription_status_enum, payment_method_enum


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    price_monthly = Column(Numeric(10, 2), nullable=False, server_default="0")
    priority_map_pinning = Column(Boolean, nullable=False, server_default=text("false"))
    includes_ml_pricing = Column(Boolean, nullable=False, server_default=text("false"))
    includes_booking_analytics = Column(Boolean, nullable=False, server_default=text("false"))
    max_listings = Column(Integer)


class LandlordSubscription(Base):
    __tablename__ = "landlord_subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    landlord_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    status = Column(subscription_status_enum, nullable=False, server_default="trialing")
    trial_start = Column(Date)
    trial_end = Column(Date)
    current_period_start = Column(Date)
    current_period_end = Column(Date)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class SubscriptionPayment(Base):
    __tablename__ = "subscription_payments"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("landlord_subscriptions.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    method = Column(payment_method_enum)
    reference_number = Column(String(100))
    paid_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))