"""VM0042 v2.2 activity data: the baseline schedule of activities (§6, Table 4, Box 1) and the
monitored project-scenario activity data used by the QA3 default-factor equations (Eq. 6–33).

One row = one category of activity for one field (quantification-unit member), one year, one scenario.
Append-only and versioned like practice records: a correction is a new row with the same
``record_id`` and ``version + 1``.
"""

from __future__ import annotations

import uuid

from sqlalchemy import Float, JSON, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel

# Table 4 categories plus the extra activity data the QA3 equations need.
ACTIVITY_CATEGORIES = (
    "crop",               # crop type, planting/harvest dates, yield
    "n_fertilizer",       # manure/compost/synthetic Y/N; rates; N content (Eq. 18–23)
    "tillage_residue",    # tillage Y/N, depth, frequency, % disturbed, residue removal Y/N, % removed
    "water",              # irrigation Y/N, flooding Y/N, rate
    "grazing",            # grazing Y/N, animal type, stocking, harvest/mowing
    "liming",             # limestone/dolomite Y/N, tonnes (Eq. 8–9)
    "fossil_fuel",        # litres by fuel type (Eq. 6–7)
    "biomass_burning",    # residue type, mass burned (Eq. 14, 32)
    "livestock",          # population, weight, productivity system, AWMS (Eq. 11–13, 26–31)
    "n_fixing",           # N-fixing species dry matter returned (Eq. 24–25)
    "organic_amendment_import",  # imported manure/compost/biosolids for leakage (Eq. 33)
    "biochar",            # biochar applied and its organic carbon (§4 condition 7)
)

# Box 1 data-source hierarchy (1 = best).
DATA_TIERS = {
    1: "Historical/monitored management records with documented evidence, or remote sensing",
    2: "Historical management plan with documented evidence",
    3: "Signed farmer/landowner attestation",
    4: "Regional (sub-national) census average with attestation",
}


class ActivityRecord(LedgerModel):
    __tablename__ = "activity_records"
    __table_args__ = (UniqueConstraint("record_id", "version"),)
    record_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    scenario: Mapped[str] = mapped_column(String(10))  # baseline | project
    # Calendar year the activity applies to. Baseline look-back rows use the historical year (t = −1 … −x).
    year: Mapped[int] = mapped_column(Integer, index=True)
    category: Mapped[str] = mapped_column(String(30), index=True)
    # Qualitative Y/N answers and quantitative values, e.g.
    # {"synthetic_n": true, "synthetic_fertilizers": [{"type": "urea", "mass_t": 0.25, "n_content": 0.46}]}
    attributes: Mapped[dict] = mapped_column(JSON, default=dict)
    data_tier: Mapped[int] = mapped_column(Integer)  # Box 1 tier 1–4
    source_note: Mapped[str] = mapped_column(Text, default="")
    # Box 1 tier 4: how often the census dataset is released (years), for the "10 most recent iterations" rule
    census_release_interval_years: Mapped[float | None] = mapped_column(Float, nullable=True)
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    attestation_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("evidence_files.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(10), default="active")  # active | voided
    reason: Mapped[str] = mapped_column(Text, default="")


class BaselineAttestation(LedgerModel):
    """A farmer's signed attestation of a field's baseline management (VM0042 Box 1: qualitative
    information needs a signed attestation). The generated PDF is stored as evidence of kind "attestation"."""

    __tablename__ = "baseline_attestations"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    evidence_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("evidence_files.id"), unique=True)
    years: Mapped[list] = mapped_column(JSON, default=list)
    statement_lang: Mapped[str] = mapped_column(String(10))
    method: Mapped[str] = mapped_column(String(10))  # otp | esign | assisted
    witness_user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    # [{record_id, version, year, category}] summarised in the PDF, plus farmer declarations
    records: Mapped[list] = mapped_column(JSON, default=list)
    declarations: Mapped[list] = mapped_column(JSON, default=list)
