from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Kind = Literal["policy", "contract", "report", "sop", "monitoring_plan", "other"]


class DocumentIn(BaseModel):
    title: str = Field(min_length=3, max_length=300)
    kind: Kind
    code: str | None = Field(default=None, min_length=2, max_length=60, pattern=r"^[A-Za-z0-9._/-]+$")
    classification: Literal["public", "internal", "confidential"] = "internal"
    entity_type: str | None = Field(default=None, max_length=60)
    entity_id: str | None = Field(default=None, max_length=64)
    project_id: str | None = None
    retention_policy_id: str | None = None
    description: str = Field(default="", max_length=4000)
    evidence_id: str | None = None  # first version
    change_note: str = Field(default="First version", max_length=2000)


class DocumentPatch(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=300)
    classification: Literal["public", "internal", "confidential"] | None = None
    retention_policy_id: str | None = None
    status: Literal["active", "archived"] | None = None
    description: str | None = Field(default=None, max_length=4000)


class VersionIn(BaseModel):
    evidence_id: str
    change_note: str = Field(min_length=3, max_length=2000)


class ApproveIn(BaseModel):
    decision: Literal["approved", "rejected"] = "approved"
    note: str = Field(default="", max_length=2000)


class PolicyIn(BaseModel):
    kind: Literal["policy", "contract", "report", "sop", "monitoring_plan", "other", "*"]
    rule: Literal["fixed_years", "after_crediting_end"]
    years: int = Field(ge=0, le=100)
    source: str = Field(min_length=3, max_length=300)
    notes: str = Field(default="", max_length=2000)


class PolicyPatch(BaseModel):
    years: int | None = Field(default=None, ge=0, le=100)
    source: str | None = Field(default=None, min_length=3, max_length=300)
    status: Literal["active", "retired"] | None = None
    notes: str | None = Field(default=None, max_length=2000)
