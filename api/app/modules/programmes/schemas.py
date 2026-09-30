from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

CODE = r"^[A-Za-z0-9][A-Za-z0-9_-]{1,39}$"


class OrmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v


def _dates_in_order(start: date | None, end: date | None, what: str) -> None:
    if start and end and end < start:
        raise ValueError(f"The {what} end date can't be before its start date.")


# ------------------------------------------------------------------ programmes
class ProgrammeIn(BaseModel):
    code: str = Field(pattern=CODE)
    name: str = Field(min_length=2, max_length=200)
    description: str | None = None
    region: str = Field(default="", max_length=200)
    boundary: dict | None = None
    eligible_crops: list[str] = Field(default_factory=list)
    start_date: date | None = None
    end_date: date | None = None
    commercial_terms: dict = Field(default_factory=dict)

    @model_validator(mode="after")
    def _dates(self) -> "ProgrammeIn":
        _dates_in_order(self.start_date, self.end_date, "programme")
        return self


class ProgrammePatch(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    region: str | None = Field(default=None, max_length=200)
    boundary: dict | None = None
    eligible_crops: list[str] | None = None
    start_date: date | None = None
    end_date: date | None = None
    commercial_terms: dict | None = None


class ProgrammeOut(OrmOut):
    id: str
    code: str
    name: str
    description: str | None
    region: str
    boundary: dict | None
    eligible_crops: list[str]
    start_date: date | None
    end_date: date | None
    status: str
    commercial_terms: dict
    created_at: datetime
    updated_at: datetime


class StatusChange(BaseModel):
    status: str = Field(min_length=1, max_length=20)
    reason: str | None = Field(default=None, max_length=2000)


class ProgrammeSummary(BaseModel):
    programme_id: str
    status: str
    projects: int
    projects_by_status: dict[str, int]
    farmers_enrolled: int
    fields_enrolled: int
    hectares_enrolled: float


# ------------------------------------------------------------------ projects
class ProjectIn(BaseModel):
    programme_id: str
    code: str = Field(pattern=CODE)
    name: str = Field(min_length=2, max_length=200)
    methodology_code: str = Field(default="VM0042", min_length=1, max_length=40)
    methodology_version: str = Field(default="2.2", min_length=1, max_length=20)
    rule_pack_id: str | None = None
    baseline_start: date | None = None
    crediting_start: date | None = None
    crediting_end: date | None = None

    @model_validator(mode="after")
    def _dates(self) -> "ProjectIn":
        _dates_in_order(self.crediting_start, self.crediting_end, "crediting period")
        return self


class ProjectPatch(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    methodology_code: str | None = Field(default=None, min_length=1, max_length=40)
    methodology_version: str | None = Field(default=None, min_length=1, max_length=20)
    rule_pack_id: str | None = None
    baseline_start: date | None = None
    crediting_start: date | None = None
    crediting_end: date | None = None


class ProjectOut(OrmOut):
    id: str
    programme_id: str
    code: str
    name: str
    methodology_code: str
    methodology_version: str
    rule_pack_id: str | None
    baseline_start: date | None
    crediting_start: date | None
    crediting_end: date | None
    status: str
    created_at: datetime
    updated_at: datetime
