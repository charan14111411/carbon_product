from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

BarrierType = Literal["investment", "technological", "institutional", "other"]
SourceType = Literal["census", "peer_reviewed", "research", "industry", "expert_attestation"]


class RegulatorySurplusIn(BaseModel):
    statement: str = Field(default="", max_length=8000)
    legally_required: bool | None = None
    evidence_ids: list[str] = Field(default_factory=list, max_length=50)


class BarrierIn(BaseModel):
    type: BarrierType
    description: str = Field(max_length=8000)
    evidence_ids: list[str] = Field(default_factory=list, max_length=50)


class ExpertIn(BaseModel):
    name: str = Field(default="", max_length=200)
    qualifications: str = Field(default="", max_length=4000)
    method: str = Field(default="", max_length=4000)
    attestation_evidence_id: str | None = None


class EssentialDistinctionIn(BaseModel):
    n_all_ha: float | None = Field(default=None, ge=0)
    n_diff_ha: float | None = Field(default=None, ge=0)
    description: str = Field(default="", max_length=8000)
    evidence_ids: list[str] = Field(default_factory=list, max_length=50)


class PracticeIn(BaseModel):
    practice: str = Field(min_length=2, max_length=300)  # a single practice or a stack, e.g. "no-till + cover crops"
    region: str = Field(default="", max_length=200)  # state / province
    adoption_pct: float | None = Field(default=None, ge=0, le=100)  # None = unknown
    source_type: SourceType | None = None
    source_reference: str = Field(default="", max_length=2000)
    expert: ExpertIn | None = None
    evidence_ids: list[str] = Field(default_factory=list, max_length=50)
    essential_distinction: EssentialDistinctionIn | None = None


class AssessmentIn(BaseModel):
    regulatory_surplus: RegulatorySurplusIn = Field(default_factory=RegulatorySurplusIn)
    barriers: list[BarrierIn] = Field(default_factory=list, max_length=50)
    common_practice: list[PracticeIn] = Field(default_factory=list, max_length=50)


class AssessmentPatch(BaseModel):
    regulatory_surplus: RegulatorySurplusIn | None = None
    barriers: list[BarrierIn] | None = Field(default=None, max_length=50)
    common_practice: list[PracticeIn] | None = Field(default=None, max_length=50)


class ReviewIn(BaseModel):
    note: str = Field(default="", max_length=4000)


class AssessmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    version: int
    status: str
    regulatory_surplus: dict
    barriers: list[dict]
    common_practice: list[dict]
    result: dict
    submitted_by: str | None
    submitted_at: datetime | None
    approved_by: str | None
    approved_at: datetime | None
    review_note: str
    supersedes_id: str | None
    created_by: str | None
    created_at: datetime
    updated_at: datetime
    data_class: str = "DERIVED"

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v
