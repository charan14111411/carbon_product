from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel

# Approved estimates the engine can use (VM0042 v2.2). Keep in sync with engine.ENGINE_TERMS.
TERMS = (
    "baseline_scenario", "project_emissions", "baseline_emissions", "leakage",
    "soc_project_modelled", "ch4_soil", "n2o_soil", "leakage_biomass_residues", "leakage_displacement",
    "woody_biomass_project", "woody_biomass_baseline",
)


class TermEstimate(TenantModel):
    """A decided project-level term (tCO2e) with its variance and source.
    Entered by one person, approved by another. Versioned: a change is a new row."""

    __tablename__ = "term_estimates"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    period_label: Mapped[str] = mapped_column(String(40))
    term: Mapped[str] = mapped_column(String(30))
    value_t_co2e: Mapped[float] = mapped_column(Float)
    variance: Mapped[float] = mapped_column(Float, default=0.0)
    df: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[str] = mapped_column(Text)
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(12), default="draft")  # draft | approved | superseded
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class CalculationRun(LedgerModel):
    """A frozen calculation: every input, rule and result. Status lives in RunStatusEvent."""

    __tablename__ = "calculation_runs"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    period_label: Mapped[str] = mapped_column(String(40))
    period_start: Mapped[date] = mapped_column(Date)
    period_end: Mapped[date] = mapped_column(Date)
    baseline_campaign_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("campaigns.id"))
    monitoring_campaign_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("campaigns.id"))
    rule_pack_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("rule_packs.id"))
    engine_version: Mapped[str] = mapped_column(String(20))
    inputs_snapshot: Mapped[dict] = mapped_column(JSON)
    rules_snapshot: Mapped[dict] = mapped_column(JSON)
    results: Mapped[dict] = mapped_column(JSON)
    gross_t_co2e: Mapped[float] = mapped_column(Float)
    uncertainty_deduction_t_co2e: Mapped[float] = mapped_column(Float)
    buffer_t_co2e: Mapped[float] = mapped_column(Float)
    net_t_co2e: Mapped[float] = mapped_column(Float)  # never floored; may be negative
    reductions_t_co2e: Mapped[float] = mapped_column(Float)
    removals_t_co2e: Mapped[float] = mapped_column(Float)
    supersedes_run_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("calculation_runs.id"), nullable=True)
    snapshot_sha256: Mapped[str] = mapped_column(String(64))


class RunStatusEvent(LedgerModel):
    __tablename__ = "run_status_events"
    run_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("calculation_runs.id"), index=True)
    status: Mapped[str] = mapped_column(String(20))  # calculated | under_review | approved | rejected | superseded
    note: Mapped[str] = mapped_column(Text, default="")


class Claim(LedgerModel):
    """Field × carbon pool × period, credited by one approved run. Prevents double counting."""

    __tablename__ = "claims"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    pool: Mapped[str] = mapped_column(String(20))  # soc | co2 | n2o | ch4 | biomass
    period_start: Mapped[date] = mapped_column(Date)
    period_end: Mapped[date] = mapped_column(Date)
    run_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("calculation_runs.id"), index=True)
    released_by_run_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)
