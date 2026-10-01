from __future__ import annotations

from datetime import date
from typing import Any, Literal

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
    features: list[str] = PField(default_factory=list)
    feature_set_id: str | None = None
    project_id: str | None = None
    ridge_lambda: float = PField(default=1.0, gt=0, le=1000)

    @model_validator(mode="after")
    def _source(self) -> "TrainIn":
        if not self.features and not self.feature_set_id:
            raise ValueError("Choose the model's features, or a feature set.")
        return self


class FeatureSetIn(BaseModel):
    name: str = PField(min_length=2, max_length=80, pattern=r"^[A-Za-z0-9][A-Za-z0-9 _.-]*$")
    definition: dict[str, Any]
    description: str = PField(default="", max_length=2000)


class MaterializeIn(BaseModel):
    project_id: str
    as_of_date: date


class DriftIn(BaseModel):
    bias_sd: float | None = PField(default=None, gt=0, le=1000)
    coverage_min: float | None = PField(default=None, gt=0, le=1)
    rmse_ratio: float | None = PField(default=None, gt=1, le=1000)
    warn_bias_sd: float | None = PField(default=None, gt=0, le=1000)
    warn_coverage_min: float | None = PField(default=None, gt=0, le=1)
    warn_rmse_ratio: float | None = PField(default=None, gt=1, le=1000)
    min_rows: int | None = PField(default=None, ge=1, le=10000)


class SocMapIn(BaseModel):
    model_id: str
    top_n: int = PField(default=5, ge=0, le=500)


class DriftReviewIn(BaseModel):
    decision: Literal["keep", "retire"]
    note: str = PField(min_length=3, max_length=2000)
