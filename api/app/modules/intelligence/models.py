from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class SatelliteIndex(LedgerModel):
    """A per-field vegetation / moisture index from one satellite pass (OBSERVED)."""

    __tablename__ = "satellite_indices"
    __table_args__ = (UniqueConstraint("field_id", "index_name", "observed_on", "source"),)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    index_name: Mapped[str] = mapped_column(String(20))  # ndvi | ndmi | ndwi | lst | lai (lai is DERIVED)
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


class FeatureSet(TenantModel):
    """A versioned, immutable definition of model features and their time windows.

    ``definition = {"features": [{"feature": "sm20_mean", "window_days": 30}, {"feature": "slope_pct"}, ...]}``.
    A change is a new version; a version's definition never changes."""

    __tablename__ = "feature_sets"
    __table_args__ = (UniqueConstraint("org_id", "name", "version"),)
    name: Mapped[str] = mapped_column(String(80))
    version: Mapped[int] = mapped_column(Integer)
    definition: Mapped[dict] = mapped_column(JSON)
    columns: Mapped[list] = mapped_column(JSON, default=list)  # resolved column names, in order
    status: Mapped[str] = mapped_column(String(20), default="active")  # active | retired
    description: Mapped[str] = mapped_column(Text, default="")


class FieldFeature(LedgerModel):
    """Materialised feature vector for one field as of a date (point-in-time: only data observed on or
    before ``as_of_date`` is used). Append-only; a recomputation with different inputs is a new row."""

    __tablename__ = "field_features"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    feature_set_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("feature_sets.id"), index=True)
    project_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=True)
    as_of_date: Mapped[date] = mapped_column(Date, index=True)
    values: Mapped[dict] = mapped_column(JSON)  # column -> number | null
    details: Mapped[dict] = mapped_column(JSON, default=dict)  # column -> {source, n, tiers, quality}
    data_classes: Mapped[dict] = mapped_column(JSON, default=dict)  # column -> DERIVED | OBSERVED | MODELLED ...
    input_fingerprint: Mapped[str] = mapped_column(String(64), index=True)


class DriftReport(LedgerModel):
    """Performance of a model on accepted lab results that were not in its training set."""

    __tablename__ = "drift_reports"
    model_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("model_versions.id"), index=True)
    status: Mapped[str] = mapped_column(String(12))  # ok | warning | drift | insufficient
    n_new: Mapped[int] = mapped_column(Integer)
    metrics: Mapped[dict] = mapped_column(JSON, default=dict)
    baseline: Mapped[dict] = mapped_column(JSON, default=dict)
    thresholds: Mapped[dict] = mapped_column(JSON, default=dict)
    reasons: Mapped[list] = mapped_column(JSON, default=list)
    rows: Mapped[list] = mapped_column(JSON, default=list)
    action: Mapped[str] = mapped_column(String(20), default="none")  # none | review_required
