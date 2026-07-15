# backend/app/models/trust.py
from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, SmallInteger, Numeric, Integer, text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.core.enums import trust_event_type_enum, dispute_status_enum


class TrustScoreEvent(Base):
    __tablename__ = "trust_score_events"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    tenancy_id = Column(UUID(as_uuid=True), ForeignKey("tenancies.id"))
    payment_id = Column(UUID(as_uuid=True), ForeignKey("payments.id"))
    event_type = Column(trust_event_type_enum, nullable=False)
    points_delta = Column(SmallInteger, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class TrustScore(Base):
    __tablename__ = "trust_scores"

    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    score = Column(Numeric(5, 2), nullable=False, server_default="100.00")
    total_tenancies = Column(Integer, nullable=False, server_default="0")
    on_time_count = Column(Integer, nullable=False, server_default="0")
    late_count = Column(Integer, nullable=False, server_default="0")
    is_frozen = Column(Boolean, nullable=False, server_default=text("false"))
    last_updated = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trust_score_event_id = Column(UUID(as_uuid=True), ForeignKey("trust_score_events.id"), nullable=False)
    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reason = Column(String, nullable=False)
    status = Column(dispute_status_enum, nullable=False, server_default="open")
    resolved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    resolution_notes = Column(String)
    resolved_at = Column(TIMESTAMP(timezone=True))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class DisputeEvidence(Base):
    __tablename__ = "dispute_evidence"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    dispute_id = Column(UUID(as_uuid=True), ForeignKey("disputes.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(String, nullable=False)
    file_type = Column(String(30))
    uploaded_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))


class TrustScoreAccessLog(Base):
    __tablename__ = "trust_score_access_log"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    landlord_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    application_id = Column(UUID(as_uuid=True), ForeignKey("rental_applications.id"), nullable=False)
    accessed_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))