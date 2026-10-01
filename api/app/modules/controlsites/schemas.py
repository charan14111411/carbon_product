from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class LinkIn(BaseModel):
    control_stratum_id: str
    project_stratum_id: str | None = None
    qu_code: str | None = Field(default=None, min_length=1, max_length=40)
    managed_by: str = Field(min_length=2, max_length=200)
    management_plan_evidence_id: str | None = None
    notes: str = Field(default="", max_length=4000)
    crop_group_justification: str = Field(default="", max_length=4000)

    @model_validator(mode="after")
    def _target(self) -> "LinkIn":
        if bool(self.project_stratum_id) == bool(self.qu_code):
            raise ValueError("Link the control site to either a project stratum or a quantification unit code.")
        return self


class LinkPatch(BaseModel):
    """What may change on a link. The location, the control stratum and the target never change (§8.2)."""

    managed_by: str | None = Field(default=None, min_length=2, max_length=200)
    management_plan_evidence_id: str | None = None
    notes: str | None = Field(default=None, max_length=4000)
    crop_group_justification: str | None = Field(default=None, max_length=4000)
    status: Literal["active", "retired"] | None = None


class LinkOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    control_stratum_id: str
    project_stratum_id: str | None
    qu_code: str | None
    managed_by: str
    management_plan_evidence_id: str | None
    fixed_lat: float
    fixed_lon: float
    status: str
    notes: str
    crop_group_justification: str = ""
    created_by: str | None
    created_at: datetime

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v
