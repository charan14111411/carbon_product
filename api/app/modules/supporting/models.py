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
