from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.modules.land.domain import (
    IPCC_CLIMATE_ZONES, TEXTURE_CLASSES, WRB_SOIL_GROUPS, normalise_code, slope_class,
)

LandUse = Literal["cropland", "grassland", "native_grassland", "forest", "wetland", "settlement", "other"]
LandCover = Literal["cropland", "grassland", "wetland", "other"]
TenureKind = Literal["owned", "leased", "shared", "community", "other"]
FieldStatus = Literal["active", "retired"]


class OrmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v


# ------------------------------------------------------------------ farms
class FarmIn(BaseModel):
    farmer_id: str
    name: str = Field(min_length=1, max_length=200)
    village: str = Field(default="", max_length=120)
    district: str = Field(default="", max_length=120)
    state: str = Field(default="", max_length=120)
    external_farm_id: str | None = Field(default=None, max_length=80)


class FarmPatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    village: str | None = Field(default=None, max_length=120)
    district: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    external_farm_id: str | None = Field(default=None, max_length=80)


class FarmOut(OrmOut):
    id: str
    farmer_id: str
    name: str
    village: str
    district: str
    state: str
    external_farm_id: str | None
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------------ fields
_WRB = {g.lower(): g for g in WRB_SOIL_GROUPS}


class SiteAttributes(BaseModel):
    """VM0042 v2.2 Table 7 / Appendix 5 attributes used for applicability, stratification and control sites."""

    slope_pct: float | None = Field(default=None, ge=0, le=300)
    aspect_deg: float | None = Field(default=None, ge=0, lt=360)
    soil_texture_class: str | None = None
    wrb_soil_group: str | None = None
    ecoregion: str | None = Field(default=None, min_length=2, max_length=120)
    climate_zone: str | None = None
    mean_annual_precip_mm: float | None = Field(default=None, ge=0, le=15000)

    @field_validator("soil_texture_class")
    @classmethod
    def _texture(cls, v: str | None) -> str | None:
        if v is None:
            return v
        code = normalise_code(v)
        if code not in TEXTURE_CLASSES:
            raise ValueError(f"Use a textural class: {', '.join(TEXTURE_CLASSES)}.")
        return code

    @field_validator("wrb_soil_group")
    @classmethod
    def _wrb(cls, v: str | None) -> str | None:
        if v is None:
            return v
        key = v.strip().lower()
        key = key if key in _WRB else f"{key}s" if f"{key}s" in _WRB else key
        if key not in _WRB:
            raise ValueError("Use a WRB reference soil group, e.g. Ferralsols, Nitisols, Vertisols.")
        return _WRB[key]

    @field_validator("climate_zone")
    @classmethod
    def _climate(cls, v: str | None) -> str | None:
        if v is None:
            return v
        code = normalise_code(v)
        if code not in IPCC_CLIMATE_ZONES:
            raise ValueError(f"Use an IPCC climate zone: {', '.join(IPCC_CLIMATE_ZONES)}.")
        return code


class FieldIn(SiteAttributes):
    farm_id: str
    name: str = Field(min_length=1, max_length=200)
    boundary: dict
    crop_code: str | None = None
    crop_attributes: dict = Field(default_factory=dict)
    soil_type: str | None = Field(default=None, max_length=80)
    elevation_m: float | None = Field(default=None, ge=-500, le=9000)
    land_cover: LandCover = "cropland"


class FieldPatch(SiteAttributes):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    boundary: dict | None = None
    reason: str | None = Field(default=None, max_length=2000)  # required when the boundary changes
    crop_code: str | None = None
    crop_attributes: dict | None = None
    soil_type: str | None = Field(default=None, max_length=80)
    elevation_m: float | None = Field(default=None, ge=-500, le=9000)
    land_cover: LandCover | None = None
    status: FieldStatus | None = None


class FieldOut(OrmOut):
    id: str
    farm_id: str
    code: str
    name: str
    boundary: dict
    area_ha: float
    centroid_lat: float
    centroid_lon: float
    crop_code: str | None
    crop_attributes: dict
    soil_type: str | None
    elevation_m: float | None
    slope_pct: float | None = None
    aspect_deg: float | None = None
    soil_texture_class: str | None = None
    wrb_soil_group: str | None = None
    ecoregion: str | None = None
    climate_zone: str | None = None
    mean_annual_precip_mm: float | None = None
    land_cover: str = "cropland"
    slope_class: str | None = None  # VM0042 Appendix 5 Table 10, derived from slope_pct
    version: int
    status: str
    created_at: datetime
    updated_at: datetime
    data_class: str = "CALCULATED"  # area is computed from the boundary

    @model_validator(mode="after")
    def _slope_class(self) -> "FieldOut":
        self.slope_class = slope_class(self.slope_pct)
        return self


class FieldPage(BaseModel):
    items: list[FieldOut]
    total: int
    limit: int
    offset: int


class BoundaryVersionOut(OrmOut):
    id: str
    field_id: str
    version: int
    boundary: dict
    area_ha: float
    reason: str
    created_by: str | None
    created_at: datetime


class ContainsOut(BaseModel):
    field_id: str
    lat: float
    lon: float
    inside: bool


# ------------------------------------------------------------------ land use
class LandUseIn(BaseModel):
    from_year: int = Field(ge=1900, le=2100)
    to_year: int = Field(ge=1900, le=2100)
    land_use: LandUse
    evidence_id: str | None = None
    source: str = Field(default="", max_length=120)
    notes: str = Field(default="", max_length=4000)

    @model_validator(mode="after")
    def _order(self) -> "LandUseIn":
        if self.from_year > self.to_year:
            raise ValueError("The start year can't be after the end year.")
        return self


class LandUseOut(OrmOut):
    id: str
    field_id: str
    from_year: int
    to_year: int
    land_use: str
    evidence_id: str | None
    source: str
    notes: str
    created_by: str | None
    created_at: datetime
    evidence_missing: bool = False

    @model_validator(mode="after")
    def _flag(self) -> "LandUseOut":
        self.evidence_missing = self.evidence_id is None
        return self


# ------------------------------------------------------------------ enrolment
class EnrolmentIn(BaseModel):
    field_id: str


class WithdrawIn(BaseModel):
    reason: str = Field(min_length=5, max_length=2000)


class EnrolmentOut(BaseModel):
    id: str
    project_id: str
    field_id: str
    field_code: str
    field_area_ha: float
    farmer_id: str
    farmer_name: str
    status: str
    eligibility: dict
    enrolled_on: date | None
    withdrawn_on: date | None
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------------ land tenure
class TenureIn(BaseModel):
    holder_farmer_id: str
    kind: TenureKind
    document_evidence_ids: list[str] = Field(min_length=1, max_length=50)
    valid_from: date
    valid_to: date | None = None
    notes: str = Field(default="", max_length=4000)

    @model_validator(mode="after")
    def _check(self) -> "TenureIn":
        if self.valid_to is not None and self.valid_to < self.valid_from:
            raise ValueError("The end date can't be before the start date.")
        if self.kind == "other" and len(self.notes.strip()) < 5:
            raise ValueError("Describe the arrangement in the notes when the tenure kind is 'other'.")
        return self


class TenureVerifyIn(BaseModel):
    decision: Literal["verified", "rejected"]
    note: str = Field(default="", max_length=4000)

    @model_validator(mode="after")
    def _note(self) -> "TenureVerifyIn":
        if self.decision == "rejected" and len(self.note.strip()) < 5:
            raise ValueError("Say why the tenure is rejected (at least 5 characters).")
        return self


class TenureOut(OrmOut):
    id: str
    field_id: str
    holder_farmer_id: str
    kind: str
    document_evidence_ids: list[str]
    valid_from: date
    valid_to: date | None
    notes: str
    status: str
    verified_by: str | None
    verified_at: datetime | None
    review_note: str
    created_by: str | None
    created_at: datetime
    updated_at: datetime
    data_class: str = "RECORDED"
