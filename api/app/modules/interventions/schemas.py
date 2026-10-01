from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator


class CommitmentIn(BaseModel):
    practice_code: str = Field(min_length=1, max_length=40)
    start_year: int = Field(ge=1990, le=2100)
    start_season: str | None = Field(default=None, max_length=30)
    end_year: int | None = Field(default=None, ge=1990, le=2100)
    end_season: str | None = Field(default=None, max_length=30)
    times_per_year: int = Field(default=1, ge=1, le=52)
    expected_quantity: float | None = Field(default=None, gt=0)
    unit: str | None = Field(default=None, max_length=20)
    notes: str = Field(default="", max_length=2000)

    @model_validator(mode="after")
    def _years(self) -> "CommitmentIn":
        if self.end_year is not None and self.end_year < self.start_year:
            raise ValueError("The end year can't be before the start year.")
        return self


class PlanIn(BaseModel):
    project_id: str
    field_id: str
    notes: str = Field(default="", max_length=4000)
    commitments: list[CommitmentIn] = Field(min_length=1, max_length=50)


class PlanPatch(BaseModel):
    notes: str | None = Field(default=None, max_length=4000)
    commitments: list[CommitmentIn] | None = Field(default=None, min_length=1, max_length=50)


class ReviseIn(BaseModel):
    reason: str = Field(min_length=5, max_length=4000)
    notes: str | None = Field(default=None, max_length=4000)
    commitments: list[CommitmentIn] = Field(min_length=1, max_length=50)


class AgreeIn(BaseModel):
    method: Literal["otp", "assisted"]
    otp_code: str | None = None


class CloseIn(BaseModel):
    reason: str = Field(default="", max_length=4000)


class DeviationIn(BaseModel):
    commitment_id: str | None = None
    year: int | None = Field(default=None, ge=1990, le=2100)
    kind: Literal["missed", "partial", "changed", "other"] = "other"
    reason: str = Field(min_length=5, max_length=4000)
    corrective_action: str = Field(default="", max_length=4000)


class DeviationStatusIn(BaseModel):
    status: Literal["acknowledged", "closed"]
    impact: Literal["unassessed", "none", "minor", "major"] | None = None
    corrective_action: str | None = Field(default=None, max_length=4000)
    note: str = Field(default="", max_length=2000)
