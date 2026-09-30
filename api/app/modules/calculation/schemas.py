from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator

from app.modules.calculation.models import TERMS


class TermIn(BaseModel):
    period_label: str = Field(min_length=1, max_length=40)
    term: str
    value_t_co2e: float
    variance: float = Field(ge=0)
    df: float | None = Field(default=None, gt=0)
    source: str = Field(min_length=5, max_length=5000)

    @field_validator("term")
    @classmethod
    def _known_term(cls, v: str) -> str:
        if v not in TERMS:
            raise ValueError(f"Choose one of: {', '.join(TERMS)}")
        return v


class TermOut(BaseModel):
    id: str
    project_id: str
    period_label: str
    term: str
    value_t_co2e: float
    variance: float
    df: float | None
    source: str
    version: int
    status: str
    created_by: str | None
    approved_by: str | None
    approved_at: datetime | None
    created_at: datetime


class RunIn(BaseModel):
    period_label: str = Field(min_length=1, max_length=40)
    period_start: date
    period_end: date
    baseline_campaign_id: str
    monitoring_campaign_id: str
    supersedes_run_id: str | None = None


class NoteIn(BaseModel):
    note: str = Field(min_length=5, max_length=5000)


class OptionalNoteIn(BaseModel):
    note: str = Field(default="", max_length=5000)
