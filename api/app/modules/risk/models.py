from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class RiskEvent(TenantModel):
    """Something that could reverse carbon gains: exit, land-use change, fire, flood..."""

    __tablename__ = "risk_events"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    field_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("fields.id"), nullable=True)
    kind: Mapped[str] = mapped_column(String(30))  # farmer_exit | land_use_change | fire | flood | practice_reversal | other
    occurred_on: Mapped[date] = mapped_column(Date)
    description: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(10), default="medium")  # low | medium | high
    estimated_impact_t: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="open")  # open | assessing | action | resolved
    resolution: Mapped[str | None] = mapped_column(Text, nullable=True)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)


class Grievance(TenantModel):
    __tablename__ = "grievances"
    code: Mapped[str] = mapped_column(String(40), index=True)
    farmer_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("farmers.id"), nullable=True, index=True)
    category: Mapped[str] = mapped_column(String(30))  # payment | enrolment | sampling | data | other
    subject: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    channel: Mapped[str] = mapped_column(String(20), default="app")
    priority: Mapped[str] = mapped_column(String(10), default="normal")  # low | normal | high
    status: Mapped[str] = mapped_column(String(20), default="open")  # open | in_progress | resolved | appealed | closed
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    due_on: Mapped[date] = mapped_column(Date)
    resolution: Mapped[str | None] = mapped_column(Text, nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    history: Mapped[list] = mapped_column(JSON, default=list)  # [{at, by, status, note}]
