from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class SatelliteIndex(LedgerModel):
    """A per-field vegetation / moisture index from one satellite pass (OBSERVED)."""

    __tablename__ = "satellite_indices"
    __table_args__ = (UniqueConstraint("field_id", "index_name", "observed_on", "source"),)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    index_name: Mapped[str] = mapped_column(String(20))  # ndvi | ndmi | lst
    observed_on: Mapped[date] = mapped_column(Date, index=True)
    value: Mapped[float] = mapped_column(Float)
    cloud_pct: Mapped[float] = mapped_column(Float, default=0.0)
    source: Mapped[str] = mapped_column(String(40))  # sentinel2 | landsat | simulated


class PracticeDetection(LedgerModel):
    """Satellite check of a reported practice. A mismatch goes to a person; it never edits the record."""

    __tablename__ = "practice_detections"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    practice_record_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True, index=True)
    practice_code: Mapped[str] = mapped_column(String(40))
    season: Mapped[str] = mapped_column(String(20))
    detected: Mapped[bool] = mapped_column()
    confidence: Mapped[float] = mapped_column(Float)
    outcome: Mapped[str] = mapped_column(String(12))  # confirmed | mismatch | inconclusive
    evidence: Mapped[dict] = mapped_column(JSON, default=dict)


class ModelVersion(TenantModel):
    """A soil-carbon prediction or process model, validated and approved before use."""

    __tablename__ = "model_versions"
    __table_args__ = (UniqueConstraint("org_id", "name", "version"),)
    name: Mapped[str] = mapped_column(String(80))
    version: Mapped[str] = mapped_column(String(20))
    kind: Mapped[str] = mapped_column(String(20))  # soc_prediction | process_model
    algorithm: Mapped[str] = mapped_column(String(60))
    features: Mapped[list] = mapped_column(JSON, default=list)
    training_summary: Mapped[dict] = mapped_column(JSON, default=dict)
    metrics: Mapped[dict] = mapped_column(JSON, default=dict)  # rmse, mae, bias, r2, coverage
    validation: Mapped[str] = mapped_column(String(40), default="farm_holdout")
    status: Mapped[str] = mapped_column(String(20), default="candidate")  # candidate | approved | retired
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    params: Mapped[dict] = mapped_column(JSON, default=dict)  # fitted coefficients (portable, reproducible)
    notes: Mapped[str] = mapped_column(Text, default="")


class SocMap(LedgerModel):
    """Modelled soil carbon per field with uncertainty and a sampling priority (MODELLED)."""

    __tablename__ = "soc_maps"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    model_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("model_versions.id"))
    generated_on: Mapped[date] = mapped_column(Date)
    cells: Mapped[list] = mapped_column(JSON)  # [{field_id, predicted_soc_pct, lower, upper, in_domain, priority}]
    summary: Mapped[dict] = mapped_column(JSON, default=dict)
