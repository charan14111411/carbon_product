from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

FarmerStatus = Literal["active", "inactive", "exited"]
KycStatus = Literal["not_started", "pending", "verified", "failed"]


class OrmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v


# ------------------------------------------------------------------ FPOs
class FPOIn(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    registration_no: str | None = Field(default=None, max_length=80)
    district: str = Field(default="", max_length=120)
    state: str = Field(default="", max_length=120)
    contact_name: str | None = Field(default=None, max_length=200)
    contact_phone: str | None = Field(default=None, max_length=30)


class FPOPatch(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    registration_no: str | None = Field(default=None, max_length=80)
    district: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    contact_name: str | None = Field(default=None, max_length=200)
    contact_phone: str | None = Field(default=None, max_length=30)


class FPOOut(OrmOut):
    id: str
    name: str
    registration_no: str | None
    district: str
    state: str
    contact_name: str | None
    contact_phone: str | None
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------------ farmers
class FarmerIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=200)
    phone: str = Field(min_length=6, max_length=30)
    village: str = Field(default="", max_length=120)
    district: str = Field(default="", max_length=120)
    state: str = Field(default="", max_length=120)
    language: str = Field(default="kn", min_length=2, max_length=10)
    fpo_id: str | None = None
    meta: dict = Field(default_factory=dict)


class FarmerPatch(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=200)
    phone: str | None = Field(default=None, min_length=6, max_length=30)
    village: str | None = Field(default=None, max_length=120)
    district: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    language: str | None = Field(default=None, min_length=2, max_length=10)
    fpo_id: str | None = None
    status: FarmerStatus | None = None
    kyc_status: KycStatus | None = None
    meta: dict | None = None


class FarmerOut(OrmOut):
    id: str
    code: str
    full_name: str
    phone: str
    village: str
    district: str
    state: str
    language: str
    fpo_id: str | None
    member_id: str | None
    status: str
    kyc_status: str
    meta: dict
    created_at: datetime
    updated_at: datetime


class FarmerPage(BaseModel):
    items: list[FarmerOut]
    total: int
    limit: int
    offset: int


# ------------------------------------------------------------------ member lookup
class MemberLookupIn(BaseModel):
    phone: str = Field(min_length=6, max_length=30)
    farmer_id: str | None = None  # when given, link the member to this farmer


DeviceTier = Literal["full", "partial", "none"]


class MemberFarmOut(BaseModel):
    external_farm_id: str
    name: str
    has_soilsync: bool  # SoilSync readings actually arrived
    has_microclime: bool  # MicroClime (measured, not forecast) readings actually arrived
    estate_id: str | None = None
    estate_name: str | None = None
    postal_code: str | None = None
    crops: list[str] = []
    plants_per_hectare: float | None = None
    has_sensor: bool = False  # the platform's own flags (a prior only)
    has_weather: bool = False
    subscription_active: bool = True
    tier: DeviceTier = "none"
    notes: list[str] = []
    imported_farm_id: str | None = None  # our Farm already created from this one, if any


class MemberLookupOut(BaseModel):
    phone: str
    is_member: bool
    member_id: str | None
    farms: list[MemberFarmOut]
    existing_farmer_id: str | None
    linked_farmer_id: str | None
    source: str = "simulated"  # simulated | farmfuture
    tier: DeviceTier = "none"
    summary: str = ""
    warnings: list[str] = []


class MemberFarmImportIn(BaseModel):
    external_farm_ids: list[str] = Field(min_length=1, max_length=50)


class ImportedFarmOut(BaseModel):
    id: str
    name: str
    external_farm_id: str
    postal_code: str | None
    notes: str


class SkippedFarmOut(BaseModel):
    external_farm_id: str
    farm_id: str
    farmer_id: str
    reason: str


class MemberFarmImportOut(BaseModel):
    farmer_id: str
    member_id: str
    created: list[ImportedFarmOut]
    skipped: list[SkippedFarmOut]
    fields_created: int = 0
    note: str


# ------------------------------------------------------------------ farmer 360
class OverviewField(BaseModel):
    id: str
    code: str
    name: str
    area_ha: float
    crop_code: str | None
    status: str


class OverviewFarm(BaseModel):
    id: str
    name: str
    village: str
    external_farm_id: str | None
    postal_code: str | None = None
    fields: list[OverviewField]


class OverviewEnrolment(BaseModel):
    id: str
    project_id: str
    project_code: str
    field_id: str
    field_code: str
    status: str
    enrolled_on: date | None


class OverviewConsent(BaseModel):
    purpose: str
    state: str  # granted | withdrawn | not_given
    effective_on: date | None


class FarmerOverview(BaseModel):
    farmer: FarmerOut
    fpo: FPOOut | None
    farms: list[OverviewFarm]
    total_area_ha: float
    enrolments: list[OverviewEnrolment]
    consents: list[OverviewConsent]
    practice_records: int
