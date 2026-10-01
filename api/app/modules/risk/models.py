from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, Integer, String, Text, Uuid
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


class RiskProfile(TenantModel):
    """A project's non-permanence risk worksheet (see ``risk.npr``). Versioned; the approved version's
    ``final_npr_pct`` is the figure to use, entered by a methodology owner (four-eyes)."""

    __tablename__ = "risk_profiles"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    tool_version: Mapped[str] = mapped_column(String(80))
    inputs: Mapped[dict] = mapped_column(JSON, default=dict)
    computed: Mapped[dict] = mapped_column(JSON, default=dict)
    computed_rating_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    final_npr_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    justification: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(12), default="draft")  # draft | submitted | approved | superseded
    submitted_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")


class MonitoringObligation(TenantModel):
    """A check the project must do in future: SOC re-measurement, baseline reassessment, data retention..."""

    __tablename__ = "monitoring_obligations"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    kind: Mapped[str] = mapped_column(String(30))  # soc_remeasurement | baseline_reassessment | data_retention | other
    title: Mapped[str] = mapped_column(String(200))
    due_on: Mapped[date] = mapped_column(Date)
    basis: Mapped[str] = mapped_column(Text, default="")  # how the due date was worked out
    rule_ref: Mapped[dict] = mapped_column(JSON, default=dict)  # {key, value, source}
    anchor_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    generated: Mapped[bool] = mapped_column(default=False)
    responsible_user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(12), default="open")  # open | done | cancelled
    done_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    notes: Mapped[str] = mapped_column(Text, default="")


class RemediationAction(TenantModel):
    """A corrective action for a risk event, with an owner and a due date."""

    __tablename__ = "remediation_actions"
    risk_event_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("risk_events.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")
    owner_user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    due_on: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(12), default="open")  # open | in_progress | done | cancelled
    completed_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    history: Mapped[list] = mapped_column(JSON, default=list)
