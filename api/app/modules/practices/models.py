from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import JSON, Date, Float, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel


class PracticeRecord(LedgerModel):
    """What a farmer actually did on a field. Append-only and versioned:
    a correction is a new row with the same ``record_id`` and ``version + 1``."""

    __tablename__ = "practice_records"
    __table_args__ = (UniqueConstraint("record_id", "version"),)
    record_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    practice_code: Mapped[str] = mapped_column(String(40), index=True)
    scenario: Mapped[str] = mapped_column(String(10))  # baseline | project
    performed_on: Mapped[date] = mapped_column(Date)
    ended_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    quantity: Mapped[float | None] = mapped_column(Float, nullable=True)
    unit: Mapped[str | None] = mapped_column(String(20), nullable=True)
    area_ha: Mapped[float | None] = mapped_column(Float, nullable=True)
    details: Mapped[dict] = mapped_column(JSON, default=dict)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    source: Mapped[str] = mapped_column(String(20), default="field_app")  # field_app | farmer_app | whatsapp | import | partner
    status: Mapped[str] = mapped_column(String(10), default="active")  # active | voided
    reason: Mapped[str] = mapped_column(Text, default="")  # why this version was written
    # Satellite confirmation is stored separately (intelligence.PracticeDetection) so this row stays immutable.
