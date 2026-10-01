from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class ResidueIn(BaseModel):
    period_label: str = Field(min_length=1, max_length=40)
    residue_type: str = Field(min_length=2, max_length=120)
    baseline_energy_use: str = Field(min_length=5, max_length=2000,
                                     description="How the residue was used for energy before the project")
    quantity_t_dry: float = Field(ge=0, le=10_000_000, description="BR_LE,k diverted in the period (t dry matter)")
    ncv_gj_per_t_dry: float | None = Field(default=None, gt=0, le=60)
    ef_co2_t_per_gj: float | None = Field(default=None, ge=0, le=1)
    factor_source: str = Field(default="", max_length=2000)
    leakage_ruled_out: bool = False
    ruled_out_reason: str = Field(default="", max_length=2000)
    evidence_ids: list[str] = Field(min_length=1)
    note: str = Field(default="", max_length=2000)

    @model_validator(mode="after")
    def _factors(self) -> ResidueIn:
        if self.leakage_ruled_out:
            if len(self.ruled_out_reason.strip()) < 10:
                raise ValueError("Explain (with evidence) why TOOL16 leakage is ruled out for this residue.")
        else:
            if self.ncv_gj_per_t_dry is None or self.ef_co2_t_per_gj is None:
                raise ValueError("Enter the residue's net calorific value and the emission factor of the replacing "
                                 "fuel (TOOL16).")
            if len(self.factor_source.strip()) < 5:
                raise ValueError("Say where the calorific value and emission factor come from.")
        return self


class ResidueVersionIn(ResidueIn):
    reason: str = Field(min_length=5, max_length=2000)


class CommodityIn(BaseModel):
    commodity: str = Field(min_length=1, max_length=120)
    unit: str = Field(min_length=1, max_length=40)
    baseline_production: float = Field(ge=0)
    project_production: float = Field(ge=0)
    lm: float | None = Field(default=None, description="LM_j,t leakage-mitigation production (same unit)")
    inl_ha: float | None = Field(default=None, description="INL_j,t from the VMD0054 worksheet (ha)")


class LivestockIn(BaseModel):
    livestock_type: str = Field(min_length=1, max_length=80)
    baseline_head: float = Field(ge=0)
    project_head: float = Field(ge=0)


class DisplacementIn(BaseModel):
    year: int = Field(ge=1990, le=2200)
    mode: Literal["vmd0054", "no_decrease"]
    commodities: list[CommodityIn] = Field(default_factory=list, max_length=200)
    livestock: list[LivestockIn] = Field(default_factory=list, max_length=200)
    ef_t_co2e_per_ha: float | None = Field(default=None, ge=0, le=10_000)
    ef_source: str = Field(default="", max_length=2000)
    statement: str = Field(min_length=10, max_length=5000,
                           description="What the evidence shows (e.g. production records; livestock sold for "
                                       "slaughter, not moved elsewhere)")
    evidence_ids: list[str] = Field(min_length=1)
    note: str = Field(default="", max_length=2000)

    @model_validator(mode="after")
    def _ef(self) -> DisplacementIn:
        if self.mode == "vmd0054" and self.ef_t_co2e_per_ha is not None and len(self.ef_source.strip()) < 5:
            raise ValueError("Say where the VMD0054 emission factor per hectare comes from.")
        return self


class DisplacementVersionIn(DisplacementIn):
    reason: str = Field(min_length=5, max_length=2000)


class VoidIn(BaseModel):
    reason: str = Field(min_length=5, max_length=2000)


class ResidueComputeIn(BaseModel):
    period_label: str = Field(min_length=1, max_length=40)


class DisplacementComputeIn(BaseModel):
    period_label: str = Field(min_length=1, max_length=40)
    period_start: date
    period_end: date
