from __future__ import annotations

from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator

from app.modules.qa1.domain import PRACTICE_CATEGORIES

Pool = Literal["soc", "ch4_soil", "n2o_soil"]


def _clean_list(values: list[str]) -> list[str]:
    out: list[str] = []
    for v in values:
        s = v.strip()
        if s and s not in out:
            out.append(s)
    return out


class ValidationDomainIn(BaseModel):
    """Where the model has been validated (VM0042 §3 "project domain": crop type, soil texture, climate;
    §8.6.1.1.1: practice categories). VMD0053 sets how the domain is evidenced — that is in the report."""

    crop_functional_groups: list[str] = Field(default_factory=list, max_length=50)
    practice_categories: list[str] = Field(default_factory=list, max_length=10)
    climate_zones: list[str] = Field(default_factory=list, max_length=50)
    soil_textures: list[str] = Field(default_factory=list, max_length=50)

    @field_validator("crop_functional_groups", "climate_zones", "soil_textures")
    @classmethod
    def _clean(cls, v: list[str]) -> list[str]:
        return _clean_list(v)

    @field_validator("practice_categories")
    @classmethod
    def _known(cls, v: list[str]) -> list[str]:
        v = _clean_list(v)
        bad = [x for x in v if x not in PRACTICE_CATEGORIES]
        if bad:
            raise ValueError(f"Unknown practice categories {bad}. Choose from: {', '.join(PRACTICE_CATEGORIES)}")
        return v


class ValidationMetricIn(BaseModel):
    """Model prediction error for one pool and practice category, from the model validation report.

    Variances are of the per-hectare change over a verification period, (t CO2e/ha)². Give either the
    direct side-by-side estimate ``s2_model_delta`` (§8.6.1.1.1 "ideal" dataset) or ``s2_model`` with the
    correlation ``rho`` (Eq. 61) or the covariance ``cov`` (Eq. 60)."""

    pool: Pool
    practice_category: str
    n_sites: int = Field(ge=2, le=1_000_000)  # statistical validation dataset size
    median_duration_years: float = Field(gt=0, le=200)  # p.65: usable for periods up to the median length
    bias: float  # mean error (model − measured), t CO2e/ha
    bias_test_passed: bool  # VMD0053 bias test outcome (stated in the validation report)
    s2_model_delta: float | None = Field(default=None, ge=0)
    s2_model: float | None = Field(default=None, ge=0)
    rho: float | None = Field(default=None, ge=-1, le=1)
    cov: float | None = None
    rmse: float | None = Field(default=None, ge=0)
    notes: str = Field(default="", max_length=2000)

    @field_validator("practice_category")
    @classmethod
    def _known(cls, v: str) -> str:
        if v not in PRACTICE_CATEGORIES:
            raise ValueError(f"Choose one of: {', '.join(PRACTICE_CATEGORIES)}")
        return v

    @model_validator(mode="after")
    def _one_error_form(self) -> ValidationMetricIn:
        if self.s2_model_delta is None and not (self.s2_model is not None and (self.rho is not None
                                                                                or self.cov is not None)):
            raise ValueError("Give s2_model_delta, or s2_model with rho (Eq. 61) or cov (Eq. 60).")
        return self


class ModelIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    version: str = Field(min_length=1, max_length=40)
    public_source: str = Field(default="", max_length=2000)
    source_accessed_on: date | None = None
    publicly_available: bool = False
    documentation_ref: str = Field(default="", max_length=2000)
    peer_review_refs: list[str] = Field(default_factory=list, max_length=100)
    parameter_set: dict[str, Any] = Field(default_factory=dict)
    parameter_sources: str = Field(default="", max_length=10000)
    validation_report_evidence_id: str | None = None
    ime_report_evidence_id: str | None = None
    validation_domain: ValidationDomainIn = Field(default_factory=ValidationDomainIn)
    pools: list[Pool] = Field(default_factory=list)
    validation_metrics: list[ValidationMetricIn] = Field(default_factory=list, max_length=200)
    trueup_ids: list[str] = Field(default_factory=list, max_length=50)
    notes: str = Field(default="", max_length=5000)
    supersedes_id: str | None = None

    @field_validator("peer_review_refs")
    @classmethod
    def _refs(cls, v: list[str]) -> list[str]:
        return _clean_list(v)


class ModelPatch(BaseModel):
    public_source: str | None = Field(default=None, max_length=2000)
    source_accessed_on: date | None = None
    publicly_available: bool | None = None
    documentation_ref: str | None = Field(default=None, max_length=2000)
    peer_review_refs: list[str] | None = Field(default=None, max_length=100)
    parameter_set: dict[str, Any] | None = None
    parameter_sources: str | None = Field(default=None, max_length=10000)
    validation_report_evidence_id: str | None = None
    ime_report_evidence_id: str | None = None
    validation_domain: ValidationDomainIn | None = None
    pools: list[Pool] | None = None
    validation_metrics: list[ValidationMetricIn] | None = Field(default=None, max_length=200)
    trueup_ids: list[str] | None = Field(default=None, max_length=50)
    notes: str | None = Field(default=None, max_length=5000)


class RunImportIn(BaseModel):
    """Modelled outputs per sampling point (site code), scenario and calendar year.

    Columns: ``site_code, scenario (baseline|project), year, draw (blank/0 = central run, 1..L = posterior
    predictive draw), soc_t_c_ha (SOC stock at the END of the year, t C/ha), ch4_t_ch4_ha and n2o_t_n2o_ha
    (fluxes during the year, t CH4/ha and t N2O/ha), practice_category, crop_functional_group``.
    The row for ``year = project start year − 1`` is the t0 stock (SOC_wp,0 = SOC_bsl,0)."""

    model_id: str
    label: str = Field(min_length=1, max_length=120)
    initial_campaign_id: str | None = None
    format: Literal["csv", "json"]
    csv: str | None = Field(default=None, max_length=50_000_000)
    rows: list[dict[str, Any]] | None = Field(default=None, max_length=2_000_000)
    spectroscopy_de_minimis_evidence_id: str | None = None
    supersedes_id: str | None = None
    notes: str = Field(default="", max_length=5000)

    @model_validator(mode="after")
    def _payload(self) -> RunImportIn:
        if self.format == "csv" and not (self.csv or "").strip():
            raise ValueError("Paste or upload the CSV content.")
        if self.format == "json" and not self.rows:
            raise ValueError("Send the rows as a list of objects.")
        return self


class AnalysisIn(BaseModel):
    period_label: str = Field(min_length=1, max_length=40)
    period_start: date
    period_end: date
    import_ids: list[str] = Field(min_length=1, max_length=50)
    seed: int | None = Field(default=None, ge=0, le=2**31 - 1)


class TrueUpIn(BaseModel):
    import_id: str
    campaign_id: str
    evidence_ids: list[str] = Field(default_factory=list, max_length=50)
    notes: str = Field(default="", max_length=5000)
