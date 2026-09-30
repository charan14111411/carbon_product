from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field

RiskKind = Literal["farmer_exit", "land_use_change", "fire", "flood", "drought", "practice_reversal", "other"]
Severity = Literal["low", "medium", "high"]
RiskStatus = Literal["open", "assessing", "action", "resolved"]
GrievanceStatus = Literal["open", "in_progress", "resolved", "appealed", "closed"]


class RiskEventIn(BaseModel):
    project_id: str
    field_id: str | None = None
    kind: RiskKind
    occurred_on: date
    description: str = Field(min_length=5, max_length=5000)
    severity: Severity = "medium"
    estimated_impact_t: float | None = Field(default=None, ge=0)
    evidence_ids: list[str] = Field(default_factory=list)


class RiskEventPatch(BaseModel):
    description: str | None = Field(default=None, min_length=5, max_length=5000)
    severity: Severity | None = None
    estimated_impact_t: float | None = Field(default=None, ge=0)
    evidence_ids: list[str] | None = None


class RiskStatusIn(BaseModel):
    status: RiskStatus
    note: str = Field(default="", max_length=2000)
    resolution: str | None = Field(default=None, max_length=5000)


class GrievanceIn(BaseModel):
    farmer_id: str | None = None
    category: Literal["payment", "enrolment", "sampling", "data", "other"]
    subject: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=5, max_length=5000)
    channel: Literal["app", "whatsapp", "ivr", "phone", "paper", "field_officer", "email"] = "app"
    priority: Literal["low", "normal", "high"] = "normal"


class AssignIn(BaseModel):
    user_id: str
    note: str = Field(default="", max_length=2000)


class GrievanceStatusIn(BaseModel):
    status: GrievanceStatus
    note: str = Field(default="", max_length=2000)
    resolution: str | None = Field(default=None, max_length=5000)
