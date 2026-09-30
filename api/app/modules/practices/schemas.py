from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Scenario = Literal["baseline", "project"]
Source = Literal["field_app", "farmer_app", "whatsapp", "import", "partner", "console"]


class OrmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v


class PracticeIn(BaseModel):
    field_id: str
    practice_code: str = Field(min_length=1, max_length=40)
    scenario: Scenario  # required: never assumed
    performed_on: date
    ended_on: date | None = None
    quantity: float | None = None
    unit: str | None = Field(default=None, max_length=20)
    area_ha: float | None = None
    extra: dict[str, Any] = Field(default_factory=dict)  # validated against the practice type's fields
    evidence_ids: list[str] = Field(default_factory=list)
    source: Source = "field_app"
    client_ref: str | None = Field(default=None, min_length=1, max_length=80)


class PracticeVersionIn(BaseModel):
    """A correction: only the fields being changed, plus why."""

    reason: str = Field(min_length=5, max_length=2000)
    field_id: str | None = None
    practice_code: str | None = Field(default=None, min_length=1, max_length=40)
    scenario: Scenario | None = None
    performed_on: date | None = None
    ended_on: date | None = None
    quantity: float | None = None
    unit: str | None = Field(default=None, max_length=20)
    area_ha: float | None = None
    extra: dict[str, Any] | None = None
    evidence_ids: list[str] | None = None


class VoidIn(BaseModel):
    reason: str = Field(min_length=5, max_length=2000)


class PracticeOut(OrmOut):
    id: str
    record_id: str
    version: int
    field_id: str
    practice_code: str
    scenario: str
    performed_on: date
    ended_on: date | None
    quantity: float | None
    unit: str | None
    area_ha: float | None
    details: dict
    evidence_ids: list[str]
    source: str
    status: str
    reason: str
    created_by: str | None
    created_at: datetime
    missing_evidence: bool = False
    data_class: str = "RECORDED"


class PracticePage(BaseModel):
    items: list[PracticeOut]
    total: int
    limit: int
    offset: int
