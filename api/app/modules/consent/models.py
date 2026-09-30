from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel

CONSENT_PURPOSES = ("sampling", "data_use", "practice_monitoring", "share_with_buyers", "payments", "sensor_installation")


class AgreementTemplate(TenantModel):
    """A versioned participation agreement. Published versions are never edited."""

    __tablename__ = "agreement_templates"
    __table_args__ = (UniqueConstraint("org_id", "code", "version"),)
    programme_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("programmes.id"), nullable=True)
    code: Mapped[str] = mapped_column(String(40))
    version: Mapped[int] = mapped_column(Integer, default=1)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[dict] = mapped_column(JSON, default=dict)  # {"en": "...", "kn": "..."}
    purposes: Mapped[list] = mapped_column(JSON, default=list)  # consent purposes this agreement asks for
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft | published | retired


class Agreement(LedgerModel):
    """A farmer's signature on a specific template version."""

    __tablename__ = "agreements"
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    template_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("agreement_templates.id"))
    template_version: Mapped[int] = mapped_column(Integer)
    language: Mapped[str] = mapped_column(String(10))
    signed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    method: Mapped[str] = mapped_column(String(20))  # otp | esign | assisted
    signed_text_sha256: Mapped[str] = mapped_column(String(64))
    witness_user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)


class ConsentEvent(LedgerModel):
    """Consent granted or withdrawn for one purpose. The latest event per purpose wins."""

    __tablename__ = "consent_events"
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    purpose: Mapped[str] = mapped_column(String(40), index=True)
    granted: Mapped[bool] = mapped_column()
    effective_on: Mapped[date] = mapped_column(Date)
    agreement_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("agreements.id"), nullable=True)
    channel: Mapped[str] = mapped_column(String(20), default="app")  # app | whatsapp | ivr | paper | field_officer
    notes: Mapped[str] = mapped_column(Text, default="")
