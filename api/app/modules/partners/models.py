from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel

EVENTS = (
    "result.approved", "result.superseded", "package.issued", "credits.issued",
    "sale.created", "payout.completed", "farmer.enrolled", "practice.recorded",
)


class ApiKey(TenantModel):
    """A partner's key for the Partner API. Only its hash is stored."""

    __tablename__ = "api_keys"
    name: Mapped[str] = mapped_column(String(120))
    prefix: Mapped[str] = mapped_column(String(12), index=True)
    key_sha256: Mapped[str] = mapped_column(String(64), unique=True)
    scopes: Mapped[list] = mapped_column(JSON, default=list)  # read | write_practices
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Webhook(TenantModel):
    __tablename__ = "webhooks"
    url: Mapped[str] = mapped_column(String(500))
    events: Mapped[list] = mapped_column(JSON, default=list)
    secret: Mapped[str] = mapped_column(String(80))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    description: Mapped[str] = mapped_column(Text, default="")


class DomainEvent(LedgerModel):
    """The outbox: every important moment, written in the same transaction as the change."""

    __tablename__ = "domain_events"
    event: Mapped[str] = mapped_column(String(60), index=True)
    entity_type: Mapped[str] = mapped_column(String(40))
    entity_id: Mapped[str] = mapped_column(String(64))
    payload: Mapped[dict] = mapped_column(JSON, default=dict)


class WebhookDelivery(LedgerModel):
    __tablename__ = "webhook_deliveries"
    webhook_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("webhooks.id"), index=True)
    event_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("domain_events.id"), index=True)
    status_code: Mapped[int | None] = mapped_column(Integer, nullable=True)
    ok: Mapped[bool] = mapped_column(Boolean, default=False)
    attempt: Mapped[int] = mapped_column(Integer, default=1)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
