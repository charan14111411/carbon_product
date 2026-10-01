from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class NotificationTemplate(TenantModel):
    """Message text for one purpose, channel and language. Versioned; approved versions are frozen."""

    __tablename__ = "notification_templates"
    __table_args__ = (UniqueConstraint("org_id", "code", "channel", "language", "version"),)
    code: Mapped[str] = mapped_column(String(60), index=True)
    channel: Mapped[str] = mapped_column(String(12))  # sms | whatsapp | ivr | email
    language: Mapped[str] = mapped_column(String(10))
    version: Mapped[int] = mapped_column(Integer, default=1)
    subject: Mapped[str | None] = mapped_column(String(200), nullable=True)  # email only
    body: Mapped[str] = mapped_column(Text)
    placeholders: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(12), default="draft")  # draft | approved | retired
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str] = mapped_column(Text, default="")


class Notification(TenantModel):
    """The outbox: one message to one recipient, with its delivery status."""

    __tablename__ = "notifications"
    farmer_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("farmers.id"), nullable=True, index=True)
    user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True, index=True)
    channel: Mapped[str] = mapped_column(String(12))
    address: Mapped[str | None] = mapped_column(String(200), nullable=True)
    language: Mapped[str | None] = mapped_column(String(10), nullable=True)
    template_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("notification_templates.id"), nullable=True)
    template_code: Mapped[str | None] = mapped_column(String(60), nullable=True, index=True)
    template_version: Mapped[int | None] = mapped_column(Integer, nullable=True)
    trigger: Mapped[str] = mapped_column(String(60), default="manual")  # manual | <domain event name>
    event_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("domain_events.id"), nullable=True, index=True)
    subject: Mapped[str | None] = mapped_column(String(200), nullable=True)
    body: Mapped[str] = mapped_column(Text, default="")
    context: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(12), default="queued")  # queued | sent | delivered | failed | skipped
    skip_reason: Mapped[str | None] = mapped_column(String(40), nullable=True)
    provider: Mapped[str | None] = mapped_column(String(40), nullable=True)
    provider_ref: Mapped[str | None] = mapped_column(String(120), nullable=True)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    last_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class DeliveryAttempt(LedgerModel):
    """Every hand-over to the messaging provider and what it answered."""

    __tablename__ = "notification_attempts"
    notification_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("notifications.id"), index=True)
    attempt: Mapped[int] = mapped_column(Integer)
    provider: Mapped[str] = mapped_column(String(40))
    ok: Mapped[bool] = mapped_column(Boolean)
    status: Mapped[str] = mapped_column(String(12))
    provider_ref: Mapped[str | None] = mapped_column(String(120), nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)


class ProcessedEvent(LedgerModel):
    """Marks a domain event as handled by a consumer, so dispatching twice sends nothing twice."""

    __tablename__ = "processed_events"
    __table_args__ = (UniqueConstraint("consumer", "event_id"),)
    consumer: Mapped[str] = mapped_column(String(40))
    event_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("domain_events.id"), index=True)
    outcome: Mapped[dict] = mapped_column(JSON, default=dict)


class InboundMessage(TenantModel):
    """A message received from a farmer (e.g. WhatsApp). Practice reports wait for staff review."""

    __tablename__ = "inbound_messages"
    channel: Mapped[str] = mapped_column(String(12), default="whatsapp")
    phone: Mapped[str] = mapped_column(String(30))
    farmer_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("farmers.id"), nullable=True, index=True)
    text: Mapped[str] = mapped_column(Text)
    command: Mapped[str | None] = mapped_column(String(20), nullable=True)  # PRACTICE | HELP
    parsed: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(20))
    # pending_review | accepted | rejected | processed | unrecognised | unmatched
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    grievance_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("grievances.id"), nullable=True)
    practice_record_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True)
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    review_note: Mapped[str | None] = mapped_column(Text, nullable=True)
