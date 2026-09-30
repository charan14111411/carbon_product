from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field as PField, model_validator


class WindowIn(BaseModel):
    start: date
    end: date

    @model_validator(mode="after")
    def _order(self) -> "WindowIn":
        if self.end < self.start:
            raise ValueError("The end date can't be before the start date.")
        return self


class DetectionIn(BaseModel):
    season_start: date
    season_end: date
    fallow_start: date | None = None
    fallow_end: date | None = None


class TrainIn(BaseModel):
    name: str = PField(min_length=2, max_length=80, pattern=r"^[A-Za-z0-9][A-Za-z0-9 _.-]*$")
    features: list[str] = PField(min_length=1)
    project_id: str | None = None
    ridge_lambda: float = PField(default=1.0, gt=0, le=1000)


class SocMapIn(BaseModel):
    model_id: str
    top_n: int = PField(default=5, ge=0, le=500)
