from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class InterventionPlan(TenantModel):
    """What a farmer commits to do on one enrolled field. Versioned: a change is a new version of the
    same ``plan_id``; the earlier version is kept (``superseded``) once the change is activated."""

    __tablename__ = "intervention_plans"
    __table_args__ = (UniqueConstraint("plan_id", "version"),)
    plan_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    code: Mapped[str] = mapped_column(String(40), index=True)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    enrolment_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("enrolments.id"), index=True)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="draft")
    # draft | agreed | active | completed | withdrawn | superseded
    supersedes_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("intervention_plans.id"), nullable=True)
    change_reason: Mapped[str] = mapped_column(Text, default="")
    notes: Mapped[str] = mapped_column(Text, default="")
    agreed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    agreed_method: Mapped[str | None] = mapped_column(String(20), nullable=True)  # otp | assisted
    agreed_text_sha256: Mapped[str | None] = mapped_column(String(64), nullable=True)
    witness_user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    activated_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    activated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    closed_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    close_reason: Mapped[str | None] = mapped_column(Text, nullable=True)


class Commitment(TenantModel):
    """One practice the farmer commits to, over a period of years."""

    __tablename__ = "intervention_commitments"
    plan_row_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("intervention_plans.id"), index=True)
    practice_code: Mapped[str] = mapped_column(String(40))
    start_year: Mapped[int] = mapped_column(Integer)
    start_season: Mapped[str | None] = mapped_column(String(30), nullable=True)
    end_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    end_season: Mapped[str | None] = mapped_column(String(30), nullable=True)
    times_per_year: Mapped[int] = mapped_column(Integer, default=1)
    expected_quantity: Mapped[float | None] = mapped_column(Float, nullable=True)  # per year
    unit: Mapped[str | None] = mapped_column(String(20), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")


class Deviation(TenantModel):
    """A missed or changed commitment: detected automatically or reported by staff."""

    __tablename__ = "intervention_deviations"
    plan_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)  # the plan (all versions)
    plan_row_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("intervention_plans.id"), index=True)
    commitment_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("intervention_commitments.id"), nullable=True, index=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    source: Mapped[str] = mapped_column(String(10))  # auto | manual
    kind: Mapped[str] = mapped_column(String(20))  # missed | partial | changed | other
    reason: Mapped[str] = mapped_column(Text, default="")
    corrective_action: Mapped[str] = mapped_column(Text, default="")
    impact: Mapped[str] = mapped_column(String(12), default="unassessed")  # unassessed | none | minor | major
    status: Mapped[str] = mapped_column(String(12), default="open")  # open | acknowledged | closed
    detail: Mapped[dict] = mapped_column(JSON, default=dict)
    history: Mapped[list] = mapped_column(JSON, default=list)
