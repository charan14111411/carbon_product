from __future__ import annotations

import uuid

from sqlalchemy import JSON, ForeignKey, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class FPO(TenantModel):
    """Farmer Producer Organisation (cooperative)."""

    __tablename__ = "fpos"
    name: Mapped[str] = mapped_column(String(200))
    registration_no: Mapped[str | None] = mapped_column(String(80), nullable=True)
    district: Mapped[str] = mapped_column(String(120), default="")
    state: Mapped[str] = mapped_column(String(120), default="")
    contact_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    contact_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)


class Farmer(TenantModel):
    """One master record per farmer, reused across programmes."""

    __tablename__ = "farmers"
    __table_args__ = (UniqueConstraint("org_id", "phone"), UniqueConstraint("org_id", "code"))
    code: Mapped[str] = mapped_column(String(40), index=True)
    full_name: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(20))  # E.164, e.g. +919812345678
    village: Mapped[str] = mapped_column(String(120), default="")
    district: Mapped[str] = mapped_column(String(120), default="")
    state: Mapped[str] = mapped_column(String(120), default="")
    language: Mapped[str] = mapped_column(String(10), default="kn")
    fpo_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("fpos.id"), nullable=True, index=True)
    # Existing Varsapradaya member? Linked by the member lookup.
    member_id: Mapped[str | None] = mapped_column(String(80), nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(20), default="active")  # active | inactive | exited
    user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    kyc_status: Mapped[str] = mapped_column(String(20), default="not_started")  # not_started | pending | verified | failed
    meta: Mapped[dict] = mapped_column(JSON, default=dict)
