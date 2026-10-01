from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Scenario = Literal["baseline", "project"]
AttestationMethod = Literal["otp", "esign", "assisted"]


class OrmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v


class ActivityIn(BaseModel):
    project_id: str
    field_id: str
    scenario: Scenario
    year: int = Field(ge=1950, le=2100)
    category: str
    attributes: dict = Field(default_factory=dict)
    data_tier: int = Field(ge=1, le=4)
    source_note: str = Field(default="", max_length=4000)
    census_release_interval_years: float | None = Field(default=None, gt=0, le=50)
    evidence_ids: list[str] = Field(default_factory=list, max_length=50)
    attestation_id: str | None = None


class ActivityVersionIn(BaseModel):
    """A correction: the new full values for anything that changes, and why."""

    reason: str = Field(min_length=5, max_length=2000)
    year: int | None = Field(default=None, ge=1950, le=2100)
    attributes: dict | None = None
    data_tier: int | None = Field(default=None, ge=1, le=4)
    source_note: str | None = Field(default=None, max_length=4000)
    census_release_interval_years: float | None = Field(default=None, gt=0, le=50)
    evidence_ids: list[str] | None = Field(default=None, max_length=50)
    attestation_id: str | None = None


class VoidIn(BaseModel):
    reason: str = Field(min_length=5, max_length=2000)


class ActivityOut(OrmOut):
    id: str
    record_id: str
    version: int
    project_id: str
    field_id: str
    scenario: str
    year: int
    category: str
    attributes: dict
    data_tier: int
    data_tier_label: str = ""
    source_note: str
    census_release_interval_years: float | None = None
    evidence_ids: list[str]
    attestation_id: str | None
    status: str
    reason: str
    created_by: str | None
    created_at: datetime
    data_class: str = "RECORDED"


class ActivityPage(BaseModel):
    items: list[ActivityOut]
    total: int
    limit: int
    offset: int


class Declaration(BaseModel):
    """Something the farmer declares about a year that isn't yet an activity record (printed in the PDF)."""

    year: int = Field(ge=1950, le=2100)
    category: str
    attributes: dict = Field(default_factory=dict)


class AttestationIn(BaseModel):
    years: list[int] = Field(min_length=1, max_length=30)
    statement_lang: str = Field(min_length=2, max_length=10)
    method: AttestationMethod
    otp_code: str | None = Field(default=None, max_length=10)
    declarations: list[Declaration] = Field(default_factory=list, max_length=200)


class AttestationOut(OrmOut):
    id: str
    project_id: str
    field_id: str
    farmer_id: str
    evidence_id: str
    years: list[int]
    statement_lang: str
    method: str
    witness_user_id: str | None
    records: list[dict]
    declarations: list[dict]
    created_by: str | None
    created_at: datetime
    data_class: str = "RECORDED"
