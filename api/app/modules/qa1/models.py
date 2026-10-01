"""VM0042 v2.2 Quantification Approach 1 (Measure and Model) records.

* ``Qa1Model`` — a biogeochemical model version with its parameter set and VMD0053 validation evidence
  (§4 cond. 4 p.10–11). Mutable while draft; approved by a second person; never edited once approved (a new
  parameter set or an updated model validation report is a new record).
* ``Qa1RunImport`` / ``Qa1RunRow`` — modelled SOC stocks and soil CH4/N2O fluxes per sampling point, scenario
  and year (data class MODELLED). Append-only and fingerprinted; a correction is a new import.
* ``Qa1Analysis`` — a frozen QA1 quantification for a project period (Eq. 46/47, 54, 58 and the §8.6.1
  uncertainty), the source of the draft ``TermEstimate`` rows it publishes (``Qa1Publication``).
* ``Qa1TrueUp`` — re-measured project SOC compared with the model (§8.6.1.3), approved by a second person.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class Qa1Model(TenantModel):
    __tablename__ = "qa1_models"
    __table_args__ = (UniqueConstraint("org_id", "name", "version", "revision"),)
    name: Mapped[str] = mapped_column(String(120))
    version: Mapped[str] = mapped_column(String(40))  # the model software version (§4 cond. 4c)
    revision: Mapped[int] = mapped_column(Integer, default=1)  # new parameter set / updated MVR = new revision
    public_source: Mapped[str] = mapped_column(Text, default="")  # hyperlink or citation (§4 cond. 4a)
    source_accessed_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    publicly_available: Mapped[bool] = mapped_column(Boolean, default=False)
    documentation_ref: Mapped[str] = mapped_column(Text, default="")  # conceptual documentation of inputs/outputs
    peer_review_refs: Mapped[list] = mapped_column(JSON, default=list)  # §4 cond. 4b
    parameter_set: Mapped[dict] = mapped_column(JSON, default=dict)  # all parameter values (§4 cond. 4c)
    parameter_sources: Mapped[str] = mapped_column(Text, default="")
    parameter_fingerprint: Mapped[str] = mapped_column(String(64), default="")
    validation_report_evidence_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("evidence_files.id"), nullable=True)  # model validation report (VMD0053)
    ime_report_evidence_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("evidence_files.id"), nullable=True)  # independent modelling expert assessment
    validation_domain: Mapped[dict] = mapped_column(JSON, default=dict)
    pools: Mapped[list] = mapped_column(JSON, default=list)  # soc | ch4_soil | n2o_soil
    validation_metrics: Mapped[list] = mapped_column(JSON, default=list)
    trueup_ids: Mapped[list] = mapped_column(JSON, default=list)  # true-ups whose data this MVR incorporates
    notes: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(12), default="draft")  # draft | approved | retired
    editors: Mapped[list] = mapped_column(JSON, default=list)
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    supersedes_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("qa1_models.id"), nullable=True)


class Qa1RunImport(LedgerModel):
    __tablename__ = "qa1_run_imports"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    model_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("qa1_models.id"), index=True)
    model_fingerprint: Mapped[str] = mapped_column(String(64))
    label: Mapped[str] = mapped_column(String(120))
    source_format: Mapped[str] = mapped_column(String(10))  # csv | json
    sha256: Mapped[str] = mapped_column(String(64), index=True)
    evidence_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("evidence_files.id"))
    initial_campaign_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("campaigns.id"), nullable=True)
    initial_measurement_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    t0_year: Mapped[int] = mapped_column(Integer)  # end of this year = t0 (year before the project start)
    row_count: Mapped[int] = mapped_column(Integer)
    site_codes: Mapped[list] = mapped_column(JSON, default=list)
    first_year: Mapped[int] = mapped_column(Integer)
    last_year: Mapped[int] = mapped_column(Integer)
    pools: Mapped[list] = mapped_column(JSON, default=list)
    mc_draws: Mapped[int] = mapped_column(Integer, default=0)  # L of imported posterior predictive draws
    inputs: Mapped[dict] = mapped_column(JSON, default=dict)  # Eq. 4 per site, activity records used
    warnings: Mapped[list] = mapped_column(JSON, default=list)
    spectroscopy_used: Mapped[bool] = mapped_column(Boolean, default=False)
    spectroscopy_de_minimis_evidence_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("evidence_files.id"), nullable=True)
    data_class: Mapped[str] = mapped_column(String(12), default="MODELLED")
    supersedes_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("qa1_run_imports.id"), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")


class Qa1RunRow(LedgerModel):
    __tablename__ = "qa1_run_rows"
    import_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("qa1_run_imports.id"), index=True)
    site_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("sites.id"), index=True)
    site_code: Mapped[str] = mapped_column(String(40))
    scenario: Mapped[str] = mapped_column(String(10))  # baseline | project
    year: Mapped[int] = mapped_column(Integer)
    draw: Mapped[int] = mapped_column(Integer, default=0)  # 0 = central run; 1..L = posterior predictive draws
    soc_t_c_ha: Mapped[float | None] = mapped_column(Float, nullable=True)  # stock at the end of the year
    ch4_t_ch4_ha: Mapped[float | None] = mapped_column(Float, nullable=True)  # flux during the year (Eq. 10 ʄ)
    n2o_t_n2o_ha: Mapped[float | None] = mapped_column(Float, nullable=True)  # flux during the year (Eq. 15 ʄ)
    practice_category: Mapped[str] = mapped_column(String(40))
    crop_functional_group: Mapped[str] = mapped_column(String(60))


class Qa1Analysis(LedgerModel):
    __tablename__ = "qa1_analyses"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    period_label: Mapped[str] = mapped_column(String(40))
    period_start: Mapped[date] = mapped_column(Date)
    period_end: Mapped[date] = mapped_column(Date)
    model_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("qa1_models.id"))
    import_ids: Mapped[list] = mapped_column(JSON, default=list)
    method: Mapped[str] = mapped_column(String(20))  # analytical | monte_carlo
    seed: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rule_pack_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("rule_packs.id"))
    rules_used: Mapped[dict] = mapped_column(JSON, default=dict)
    results: Mapped[dict] = mapped_column(JSON, default=dict)
    trueup: Mapped[dict] = mapped_column(JSON, default=dict)  # true-up status at computation time
    sha256: Mapped[str] = mapped_column(String(64))


class Qa1Publication(LedgerModel):
    """Which draft TermEstimate rows an analysis created (one row per publish)."""

    __tablename__ = "qa1_publications"
    analysis_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("qa1_analyses.id"), index=True)
    term_ids: Mapped[list] = mapped_column(JSON, default=list)


class Qa1TrueUp(TenantModel):
    __tablename__ = "qa1_trueups"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    model_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("qa1_models.id"))
    import_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("qa1_run_imports.id"))
    campaign_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("campaigns.id"))
    measured_on: Mapped[date] = mapped_column(Date)  # mean collection date of the re-measurement samples
    points: Mapped[list] = mapped_column(JSON, default=list)
    stats: Mapped[dict] = mapped_column(JSON, default=dict)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    notes: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(12), default="draft")  # draft | approved
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
