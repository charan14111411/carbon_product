from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import (
    JSON, Date, DateTime, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint, Uuid, text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class Farm(TenantModel):
    __tablename__ = "farms"
    # One farm record per Varsapradaya farm in an organisation (filtered: farms without one are unlimited).
    __table_args__ = (
        Index("uq_farms_org_external_farm_id", "org_id", "external_farm_id", unique=True,
              mssql_where=text("external_farm_id IS NOT NULL"), sqlite_where=text("external_farm_id IS NOT NULL")),
    )
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    name: Mapped[str] = mapped_column(String(200))
    village: Mapped[str] = mapped_column(String(120), default="")
    district: Mapped[str] = mapped_column(String(120), default="")
    state: Mapped[str] = mapped_column(String(120), default="")
    external_farm_id: Mapped[str | None] = mapped_column(String(80), nullable=True)  # Varsapradaya farm id
    postal_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")


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
    # VM0042 v2.2 Table 7 / Appendix 5 attributes (control-site similarity, stratification, applicability)
    slope_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    aspect_deg: Mapped[float | None] = mapped_column(Float, nullable=True)
    soil_texture_class: Mapped[str | None] = mapped_column(String(40), nullable=True)  # FAO/USDA textural class
    wrb_soil_group: Mapped[str | None] = mapped_column(String(60), nullable=True)  # WRB reference soil group
    ecoregion: Mapped[str | None] = mapped_column(String(120), nullable=True)  # WWF terrestrial ecoregion
    climate_zone: Mapped[str | None] = mapped_column(String(60), nullable=True)  # IPCC climate zone
    mean_annual_precip_mm: Mapped[float | None] = mapped_column(Float, nullable=True)
    land_cover: Mapped[str] = mapped_column(String(20), default="cropland")  # cropland | grassland | wetland | other
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


class LandTenure(TenantModel):
    """Who controls a field, for which period, backed by documents (VCS Standard project ownership /
    right of use). A second person verifies it (four-eyes) before it counts for enrolment."""

    __tablename__ = "land_tenures"
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    holder_farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    kind: Mapped[str] = mapped_column(String(20))  # owned | leased | shared | community | other
    document_evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    valid_from: Mapped[date] = mapped_column(Date)
    valid_to: Mapped[date | None] = mapped_column(Date, nullable=True)  # None = open-ended
    notes: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(10), default="pending")  # pending | verified | rejected
    verified_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    review_note: Mapped[str] = mapped_column(Text, default="")
