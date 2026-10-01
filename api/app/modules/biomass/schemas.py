from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, model_validator

Scenario = Literal["project", "baseline"]


class AllometryIn(BaseModel):
    species: str = Field(min_length=1, max_length=200, description='Species name, or "*" for a generic equation')
    form: str
    params: dict[str, float]
    output_unit: Literal["kg", "t"] = Field(description="Unit of the equation's result (ignored for volume_bef)")
    dbh_min_cm: float = Field(gt=0)
    dbh_max_cm: float = Field(gt=0)
    root_shoot_ratio: float | None = Field(default=None, ge=0, le=10)
    source: str = Field(min_length=5, max_length=2000)
    evidence_ids: list[str] = Field(default_factory=list)


class PlotIn(BaseModel):
    stratum_id: str
    field_id: str | None = None
    code: str = Field(min_length=1, max_length=40)
    scenario: Scenario
    area_m2: float = Field(gt=0, le=1_000_000)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)


class CampaignIn(BaseModel):
    code: str = Field(min_length=1, max_length=40)
    measured_on: date
    note: str = Field(default="", max_length=2000)


class TreeIn(BaseModel):
    species: str = Field(min_length=1, max_length=200)
    dbh_cm: float = Field(gt=0, le=1000)
    height_m: float | None = Field(default=None, gt=0, le=150)
    count: int = Field(default=1, ge=1, le=100_000)


class ShrubIn(BaseModel):
    crown_cover_fraction: float | None = Field(default=None, ge=0, le=1)
    agb_t_dm_ha: float | None = Field(default=None, ge=0, le=1000)

    @model_validator(mode="after")
    def _one(self) -> ShrubIn:
        if (self.crown_cover_fraction is None) == (self.agb_t_dm_ha is None):
            raise ValueError("Give either the shrub crown cover or the measured shrub biomass, not both or neither.")
        return self


class MeasurementIn(BaseModel):
    campaign_id: str
    plot_id: str
    trees: list[TreeIn] = Field(default_factory=list, max_length=20_000)
    shrub: ShrubIn | None = None
    harvested: bool = False
    evidence_ids: list[str] = Field(min_length=1, description="Field sheets / photos proving the measurement")
    note: str = Field(default="", max_length=2000)


class MeasurementVersionIn(BaseModel):
    trees: list[TreeIn] = Field(default_factory=list, max_length=20_000)
    shrub: ShrubIn | None = None
    harvested: bool = False
    evidence_ids: list[str] = Field(min_length=1)
    reason: str = Field(min_length=5, max_length=2000)


class VoidIn(BaseModel):
    reason: str = Field(min_length=5, max_length=2000)


class WoodyComputeIn(BaseModel):
    scenario: Scenario
    from_campaign_id: str
    to_campaign_id: str
    period_label: str = Field(min_length=1, max_length=40)
    period_start: date
    period_end: date
