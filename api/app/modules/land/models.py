from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import JSON, Date, Float, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class Farm(TenantModel):
    __tablename__ = "farms"
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    name: Mapped[str] = mapped_column(String(200))
    village: Mapped[str] = mapped_column(String(120), default="")
    district: Mapped[str] = mapped_column(String(120), default="")
    state: Mapped[str] = mapped_column(String(120), default="")
    external_farm_id: Mapped[str | None] = mapped_column(String(80), nullable=True)  # Varsapradaya farm id


class Field(TenantModel):
    """A plot with a GPS boundary. Area is always computed from the boundary."""

    __tablename__ = "fields"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    farm_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farms.id"), index=True)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200))
    boundary: Mapped[dict] = mapped_column(JSON)  # GeoJSON Polygon, WGS84
    area_ha: Mapped[float] = mapped_column(Float)
    centroid_lat: Mapped[float] = mapped_column(Float)
    centroid_lon: Mapped[float] = mapped_column(Float)
    min_lat: Mapped[float] = mapped_column(Float, index=True)
    max_lat: Mapped[float] = mapped_column(Float)
    min_lon: Mapped[float] = mapped_column(Float, index=True)
    max_lon: Mapped[float] = mapped_column(Float)
    crop_code: Mapped[str | None] = mapped_column(String(40), nullable=True)
    crop_attributes: Mapped[dict] = mapped_column(JSON, default=dict)
    soil_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    elevation_m: Mapped[float | None] = mapped_column(Float, nullable=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(20), default="active")  # active | retired


class FieldBoundaryVersion(LedgerModel):
    """History of every boundary a field has had."""

    __tablename__ = "field_boundary_versions"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    version: Mapped[int] = mapped_column(Integer)
    boundary: Mapped[dict] = mapped_column(JSON)
    area_ha: Mapped[float] = mapped_column(Float)
    reason: Mapped[str] = mapped_column(Text, default="")


class LandUseRecord(LedgerModel):
    """What the land was used for over a period, backed by evidence."""

    __tablename__ = "land_use_records"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    from_year: Mapped[int] = mapped_column(Integer)
    to_year: Mapped[int] = mapped_column(Integer)
    land_use: Mapped[str] = mapped_column(String(40))  # cropland | grassland | forest | wetland | settlement | other
    evidence_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("evidence_files.id"), nullable=True)
    source: Mapped[str] = mapped_column(String(120), default="")
    notes: Mapped[str] = mapped_column(Text, default="")


class Enrolment(TenantModel):
    """A field taking part in a project, and the eligibility decision."""

    __tablename__ = "enrolments"
    __table_args__ = (UniqueConstraint("project_id", "field_id"),)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    # pending | eligible | ineligible | enrolled | withdrawn
    eligibility: Mapped[dict] = mapped_column(JSON, default=dict)  # {checks: [{code, passed, message}], decided_at}
    enrolled_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    withdrawn_on: Mapped[date | None] = mapped_column(Date, nullable=True)
