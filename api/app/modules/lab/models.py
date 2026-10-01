from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import (
    JSON, Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel

ANALYTES = ("soc_pct", "bulk_density_g_cm3", "coarse_fraction", "fine_soil_mass_g", "ph", "texture_clay_pct",
            "texture_sand_pct", "inorganic_c_pct")
# Proximal sensing methods allowed under VM0042 v2.2 Appendix 4 (MIR, NIR, Vis-NIR, LIBS, INS).
SPECTRO_METHODS = frozenset({"mir_spectroscopy", "nir_spectroscopy", "nir", "vis_nir_spectroscopy", "vis_nir", "libs",
                             "ins"})
# VM0042 v2.2 §8.2.1.4: not recommended; only where no other method is available (justify).
NOT_RECOMMENDED_METHODS = frozenset({"walkley_black", "loss_on_ignition", "loi"})


class Lab(TenantModel):
    __tablename__ = "labs"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200))
    accreditation: Mapped[str | None] = mapped_column(String(120), nullable=True)
    accreditation_valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    city: Mapped[str] = mapped_column(String(120), default="")
    contact_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    # VM0042 v2.2 §8.2.1.4: ISO/IEC 17025 where possible; analytical error, internal QC, round-robin programme.
    iso17025: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    proficiency_program: Mapped[str | None] = mapped_column(String(20), nullable=True)  # NAPT | GLOSOLAN | other | none
    analytical_error_report_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("evidence_files.id"), nullable=True)


class LabBatch(TenantModel):
    """A shipment of bags sent to one lab (the manifest)."""

    __tablename__ = "lab_batches"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    lab_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("labs.id"), index=True)
    campaign_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("campaigns.id"), index=True)
    code: Mapped[str] = mapped_column(String(40))
    layer_ids: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(20), default="open")  # open | dispatched | received | complete
    dispatched_on: Mapped[date | None] = mapped_column(Date, nullable=True)


class LabResult(TenantModel):
    """One analyte for one soil layer. Pending results can be corrected; once reviewed,
    a result is frozen and a correction is a new version that supersedes it."""

    __tablename__ = "lab_results"
    layer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("soil_layers.id"), index=True)
    lab_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("labs.id"), index=True)
    analyte: Mapped[str] = mapped_column(String(30), index=True)
    value: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(20))
    method: Mapped[str] = mapped_column(String(60))  # dry_combustion | walkley_black | core_ring | mir_spectroscopy ...
    analysed_on: Mapped[date] = mapped_column(Date)
    uncertainty: Mapped[float | None] = mapped_column(Float, nullable=True)
    detection_limit: Mapped[float | None] = mapped_column(Float, nullable=True)
    certificate_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("evidence_files.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(12), default="pending")  # pending | accepted | rejected | voided
    version: Mapped[int] = mapped_column(Integer, default=1)
    supersedes_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("lab_results.id"), nullable=True)
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    review_note: Mapped[str] = mapped_column(Text, default="")
    calibration_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("spectral_calibrations.id"), nullable=True)
    # VM0042 v2.2 §8.2.1.4: Walkley-Black / loss-on-ignition only with a written justification.
    method_justification: Mapped[str | None] = mapped_column(Text, nullable=True)
    # value < detection_limit: stored exactly as reported, flagged.
    below_detection_limit: Mapped[bool] = mapped_column(Boolean, default=False)
    # primary = the result used for accounting; spectroscopy_check = dry-combustion re-analysis of a
    # spectroscopy sample (VM0042 v2.2 §8.6.2.1 Eq. 73, 10-15 % check). Only primary results are accounting inputs.
    purpose: Mapped[str] = mapped_column(String(20), default="primary")


class SpectralCalibration(TenantModel):
    """Calibration that lets infrared spectroscopy stand in for a lab method (Phase 3)."""

    __tablename__ = "spectral_calibrations"
    code: Mapped[str] = mapped_column(String(40))
    analyte: Mapped[str] = mapped_column(String(30))
    reference_method: Mapped[str] = mapped_column(String(60))
    n_samples: Mapped[int] = mapped_column(Integer)
    rmse: Mapped[float] = mapped_column(Float)
    r2: Mapped[float] = mapped_column(Float)
    bias: Mapped[float] = mapped_column(Float, default=0.0)
    valid_range: Mapped[dict] = mapped_column(JSON, default=dict)  # {"min": 0.2, "max": 4.5}
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft | approved | retired
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    # VM0042 v2.2 Appendix 4 (p.152-157): monitoring-plan items required before approval
    rpiq: Mapped[float | None] = mapped_column(Float, nullable=True)
    lin_ccc: Mapped[float | None] = mapped_column(Float, nullable=True)
    split_method: Mapped[str | None] = mapped_column(String(120), nullable=True)  # e.g. random 70/30, 10-fold CV
    n_peer_reviewed_refs: Mapped[int | None] = mapped_column(Integer, nullable=True)
    spectral_range: Mapped[str | None] = mapped_column(String(120), nullable=True)  # e.g. 4000-600 cm-1
    instrument: Mapped[str | None] = mapped_column(String(200), nullable=True)


class LabChange(LedgerModel):
    """Justification for moving a project's analyses to another lab (VM0042 v2.2 §8.2.1.4: the same lab
    should be used for the project lifetime; a change requires justification and SOP consistency)."""

    __tablename__ = "lab_changes"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    from_lab_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("labs.id"))
    to_lab_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("labs.id"))
    justification: Mapped[str] = mapped_column(Text)
    sop_consistency_statement: Mapped[str] = mapped_column(Text)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    effective_from: Mapped[date | None] = mapped_column(Date, nullable=True)
