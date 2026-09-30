from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

LandUse = Literal["cropland", "grassland", "forest", "wetland", "settlement", "other"]
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
class FieldIn(BaseModel):
    farm_id: str
    name: str = Field(min_length=1, max_length=200)
    boundary: dict
    crop_code: str | None = None
    crop_attributes: dict = Field(default_factory=dict)
    soil_type: str | None = Field(default=None, max_length=80)
    elevation_m: float | None = Field(default=None, ge=-500, le=9000)


class FieldPatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    boundary: dict | None = None
    reason: str | None = Field(default=None, max_length=2000)  # required when the boundary changes
    crop_code: str | None = None
    crop_attributes: dict | None = None
    soil_type: str | None = Field(default=None, max_length=80)
    elevation_m: float | None = Field(default=None, ge=-500, le=9000)
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
    version: int
    status: str
    created_at: datetime
    updated_at: datetime
    data_class: str = "CALCULATED"  # area is computed from the boundary


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
