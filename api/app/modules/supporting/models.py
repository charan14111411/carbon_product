from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel

PARAMETERS = {
    "rain_mm": ("Rainfall", "mm"),
    "air_temp_c": ("Air temperature", "°C"),
    "rel_humidity_pct": ("Relative humidity", "%"),
    "soil_moisture_20cm_pct": ("Soil moisture 20 cm", "%"),
    "soil_moisture_60cm_pct": ("Soil moisture 60 cm", "%"),
    "soil_temp_c": ("Soil temperature", "°C"),
    "soil_ec_ds_m": ("Soil EC", "dS/m"),
    "soil_ph": ("Soil pH", ""),
    "solar_mj_m2": ("Solar radiation", "MJ/m²"),
    "wind_m_s": ("Wind speed", "m/s"),
}


class Device(TenantModel):
    """A Varsapradaya SoilSync sensor or MicroClime weather station."""

    __tablename__ = "devices"
    __table_args__ = (UniqueConstraint("org_id", "external_id"),)
    kind: Mapped[str] = mapped_column(String(20))  # soilsync | microclime
    external_id: Mapped[str] = mapped_column(String(80))
    name: Mapped[str] = mapped_column(String(200))
    farm_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("farms.id"), nullable=True, index=True)
    field_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("fields.id"), nullable=True, index=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    elevation_m: Mapped[float | None] = mapped_column(Float, nullable=True)
    parameters: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(20), default="online")  # online | offline | retired
    last_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    calibrated_on: Mapped[date | None] = mapped_column(Date, nullable=True)


class Observation(LedgerModel):
    """A daily supporting value for a field, with where it came from and how good it is."""

    __tablename__ = "observations"
    __table_args__ = (UniqueConstraint("field_id", "parameter", "observed_on", "provider"),)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    parameter: Mapped[str] = mapped_column(String(40), index=True)
    observed_on: Mapped[date] = mapped_column(Date, index=True)
    value: Mapped[float | None] = mapped_column(Float, nullable=True)
    unit: Mapped[str] = mapped_column(String(20))
    tier: Mapped[int] = mapped_column(Integer)  # 1 own device | 2 nearby station | 3 external | 0 not available
    provider: Mapped[str] = mapped_column(String(40))  # soilsync | microclime | nasa_power | era5 | imd | smap | soilgrids
    source_ref: Mapped[str] = mapped_column(String(120), default="")
    distance_km: Mapped[float | None] = mapped_column(Float, nullable=True)
    quality: Mapped[float] = mapped_column(Float)  # 0..1
    data_class: Mapped[str] = mapped_column(String(12))  # MEASURED | OBSERVED | MODELLED
    bias_corrected: Mapped[bool] = mapped_column(default=False)
    note: Mapped[str] = mapped_column(Text, default="")


class SyncRun(LedgerModel):
    __tablename__ = "sync_runs"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    window_start: Mapped[date] = mapped_column(Date)
    window_end: Mapped[date] = mapped_column(Date)
    summary: Mapped[dict] = mapped_column(JSON, default=dict)  # parameter -> {tier, provider, count}


class TerrainSummary(LedgerModel):
    """DEM-derived terrain for a field (DERIVED): slope / aspect / elevation and the slope-class histogram
    (VM0042 v2.2 Appendix 5 Table 10)."""

    __tablename__ = "terrain_summaries"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    provider: Mapped[str] = mapped_column(String(40))
    source_ref: Mapped[str] = mapped_column(String(120), default="")
    cell_size_m: Mapped[float] = mapped_column(Float)
    n_cells: Mapped[int] = mapped_column(Integer)
    elevation_mean_m: Mapped[float] = mapped_column(Float)
    slope_mean_pct: Mapped[float] = mapped_column(Float)
    aspect_deg: Mapped[float | None] = mapped_column(Float, nullable=True)
    dominant_slope_class: Mapped[str] = mapped_column(String(30))
    histogram: Mapped[dict] = mapped_column(JSON, default=dict)
    stats: Mapped[dict] = mapped_column(JSON, default=dict)
    applied: Mapped[dict] = mapped_column(JSON, default=dict)  # column -> {written, before, after}


class SoilPropertySuggestion(LedgerModel):
    """A soil-map suggestion for a field's texture class / WRB group (MODELLED). Never applied automatically;
    a person applies it with a separate, audited action."""

    __tablename__ = "soil_property_suggestions"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    provider: Mapped[str] = mapped_column(String(40))
    source_ref: Mapped[str] = mapped_column(String(120), default="")
    properties: Mapped[dict] = mapped_column(JSON, default=dict)
    soil_texture_class: Mapped[str | None] = mapped_column(String(40), nullable=True)
    wrb_soil_group: Mapped[str | None] = mapped_column(String(60), nullable=True)
    wrb_probability: Mapped[float | None] = mapped_column(Float, nullable=True)
    data_class: Mapped[str] = mapped_column(String(12), default="MODELLED")


class SoilPropertyApplication(LedgerModel):
    """Who applied which suggestion to the field record, and what changed."""

    __tablename__ = "soil_property_applications"
    suggestion_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("soil_property_suggestions.id"), index=True)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    changes: Mapped[dict] = mapped_column(JSON, default=dict)  # column -> {before, after}
    note: Mapped[str] = mapped_column(Text, default="")
