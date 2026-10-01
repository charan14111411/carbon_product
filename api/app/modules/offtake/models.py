from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, Numeric, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class Offer(TenantModel):
    """A priced proposal from the seller to a buyer for credits from one batch."""

    __tablename__ = "offers"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    seller_name: Mapped[str] = mapped_column(String(200))  # the legal seller is explicit data, not assumed
    buyer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("buyers.id"), index=True)
    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("credit_batches.id"), index=True)
    credit_type: Mapped[str] = mapped_column(String(12))  # reduction | removal
    quantity: Mapped[float] = mapped_column(Float)
    unit_price: Mapped[float] = mapped_column(Numeric(14, 2))
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    valid_until: Mapped[date] = mapped_column(Date)
    terms: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(12), default="draft")
    # draft | sent | accepted | rejected | expired | withdrawn
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    responded_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    response_note: Mapped[str | None] = mapped_column(Text, nullable=True)


class OfftakeAgreement(TenantModel):
    """A contract with a buyer for a volume of credits over time. Sales whose ``contract_ref`` equals
    the agreement code count as deliveries against it."""

    __tablename__ = "offtake_agreements"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    title: Mapped[str] = mapped_column(String(200))
    seller_name: Mapped[str] = mapped_column(String(200))
    buyer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("buyers.id"), index=True)
    offer_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("offers.id"), nullable=True)
    credit_type: Mapped[str] = mapped_column(String(12), default="any")  # reduction | removal | any
    total_volume_t: Mapped[float] = mapped_column(Float)
    vintages: Mapped[list] = mapped_column(JSON, default=list)  # [2024, 2025]; empty = any vintage
    price_type: Mapped[str] = mapped_column(String(8))  # fixed | floor
    price: Mapped[float] = mapped_column(Numeric(14, 2))
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    delivery_schedule: Mapped[list] = mapped_column(JSON, default=list)  # [{due_date, quantity}]
    status: Mapped[str] = mapped_column(String(12), default="draft")
    # draft | signed | active | completed | terminated
    contract_evidence_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("evidence_files.id"), nullable=True)
    signed_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    signed_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    effective_from: Mapped[date | None] = mapped_column(Date, nullable=True)
    effective_to: Mapped[date | None] = mapped_column(Date, nullable=True)
    closed_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    close_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")
