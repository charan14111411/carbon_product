"""Tree and shrub inventory (VM0042 v2.2 §8.2.2, Eq. 48–51; CDM AR-TOOL14) and the computation records behind
platform-computed term estimates (shared with the leakage module)."""

from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class AllometricModel(TenantModel):
    """An allometric equation (or volume × wood density × BEF method) for one species, with its published source.
    Entered by one person, approved by another; an approved model is never edited (retire it and add a new one)."""

    __tablename__ = "allometric_models"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    species: Mapped[str] = mapped_column(String(200))  # "*" = generic equation, chosen explicitly
    form: Mapped[str] = mapped_column(String(20))
    params: Mapped[dict] = mapped_column(JSON, default=dict)
    output_unit: Mapped[str] = mapped_column(String(4), default="kg")
    dbh_min_cm: Mapped[float] = mapped_column(Float)
    dbh_max_cm: Mapped[float] = mapped_column(Float)
    root_shoot_ratio: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[str] = mapped_column(Text)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(12), default="draft")  # draft | approved | retired
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class BiomassPlot(TenantModel):
    """A permanent tree/shrub plot in one zone (stratum) for the project or the baseline scenario."""

    __tablename__ = "biomass_plots"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    stratum_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("strata.id"), index=True)
    field_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("fields.id"), nullable=True)
    code: Mapped[str] = mapped_column(String(40))
    scenario: Mapped[str] = mapped_column(String(10))  # project | baseline
    area_m2: Mapped[float] = mapped_column(Float)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(10), default="active")  # active | retired


class BiomassCampaign(TenantModel):
    """One measurement occasion of the plots (its date sets x in Eq. 48–51)."""

    __tablename__ = "biomass_campaigns"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    code: Mapped[str] = mapped_column(String(40))
    measured_on: Mapped[date] = mapped_column(Date)
    note: Mapped[str] = mapped_column(Text, default="")


class PlotMeasurement(LedgerModel):
    """The complete tree list (and shrub record) of one plot in one campaign. Append-only: a correction or void is
    a new row with the same ``record_id`` and ``version + 1``."""

    __tablename__ = "biomass_plot_measurements"
    record_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(10), default="active")  # active | voided
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    campaign_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("biomass_campaigns.id"), index=True)
    plot_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("biomass_plots.id"), index=True)
    trees: Mapped[list] = mapped_column(JSON, default=list)  # [{species, dbh_cm, height_m, count}]
    shrub: Mapped[dict | None] = mapped_column(JSON, nullable=True)  # {crown_cover_fraction} | {agb_t_dm_ha}
    harvested: Mapped[bool] = mapped_column(Boolean, default=False)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    note: Mapped[str] = mapped_column(Text, default="")


class TermComputation(LedgerModel):
    """Frozen inputs and results of a platform computation published as a draft TermEstimate.
    Shared by the biomass and leakage modules."""

    __tablename__ = "term_computations"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    term: Mapped[str] = mapped_column(String(30))
    period_label: Mapped[str] = mapped_column(String(40))
    method: Mapped[str] = mapped_column(String(200))
    inputs: Mapped[dict] = mapped_column(JSON)
    results: Mapped[dict] = mapped_column(JSON)
    rule_pack_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("rule_packs.id"), nullable=True)
    term_estimate_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("term_estimates.id"), index=True)
    snapshot_sha256: Mapped[str] = mapped_column(String(64))
