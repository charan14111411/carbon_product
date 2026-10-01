from __future__ import annotations

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class _In(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")


class StratumIn(_In):
    code: str = Field(min_length=1, max_length=40, pattern=r"^[A-Za-z0-9_.-]+$")
    name: str = Field(min_length=2, max_length=200)
    role: Literal["project", "control"] = "project"
    control_for_code: str | None = Field(default=None, max_length=40)
    quantification_unit: str | None = Field(default=None, min_length=1, max_length=40, pattern=r"^[A-Za-z0-9_.-]+$")
    # VM0042 v2.2 §8.2.1.2: the stratification factors used (keys from domain.STRATIFICATION_FACTORS)
    criteria: dict = Field(default_factory=dict)
    field_ids: list[str] = Field(min_length=1)
    effective_from: date


class CampaignIn(_In):
    code: str = Field(min_length=2, max_length=40, pattern=r"^[A-Za-z0-9_.-]+$")
    name: str = Field(min_length=2, max_length=200)
    kind: Literal["baseline", "monitoring"]
    design: Literal["paired", "independent"]
    revisits_campaign_id: str | None = None
    planned_start: date
    planned_end: date
    depth_from_cm: float = Field(default=0.0, ge=0)
    depth_to_cm: float = Field(gt=0, le=300)
    placement_seed: int | None = Field(default=None, ge=0, lt=2**31)
    season: str | None = Field(default=None, max_length=60)
    season_override_reason: str | None = Field(default=None, min_length=10, max_length=2000)


class CampaignStatusIn(_In):
    status: Literal["planned", "fieldwork", "lab", "complete"]


class PlanIn(_In):
    stratum_id: str
    n_required: int | None = Field(default=None, ge=1, le=10000)
    method: Literal["manual", "variance_formula"] = "manual"
    inputs: dict = Field(default_factory=dict)
    justification: str = Field(min_length=5, max_length=5000)


class PlanPatch(_In):
    n_required: int | None = Field(default=None, ge=1, le=10000)
    method: Literal["manual", "variance_formula"] | None = None
    inputs: dict | None = None
    justification: str | None = Field(default=None, min_length=5, max_length=5000)


class MddIn(_In):
    """Power analysis, VM0042 v2.2 Eq. 1-2. Give ``mdd`` to get n, or ``n`` to get the MDD."""

    s: float = Field(gt=0, description="Standard deviation of the difference (same units as the MDD)")
    alpha: float = Field(gt=0, lt=1, description="Two-sided significance level, e.g. 0.05")
    power: float = Field(gt=0, lt=1, description="1 - beta, e.g. 0.90")
    mdd: float | None = Field(default=None, gt=0)
    n: int | None = Field(default=None, ge=2, le=10000)


class AssignIn(_In):
    user_id: str
    point_ids: list[str] = Field(min_length=1)


class LayerIn(_In):
    depth_from_cm: float = Field(ge=0)
    depth_to_cm: float = Field(gt=0)
    label_qr: str = Field(min_length=3, max_length=80)


class SampleIn(_In):
    client_ref: str = Field(min_length=6, max_length=80)
    point_id: str
    collected_at: datetime
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    gps_accuracy_m: float | None = Field(default=None, ge=0)
    depth_reached_cm: float = Field(gt=0, le=300)
    layers: list[LayerIn] = Field(min_length=1, max_length=20)
    photo_ids: list[str] = Field(default_factory=list, max_length=20)
    deviation_reason: str | None = Field(default=None, max_length=2000)
    depth_limit: Literal["bedrock", "hardpan", "stones", "other"] | None = None
    device_id: str | None = Field(default=None, max_length=80)
    # VM0042 v2.2 Eq. 3 inputs
    probe_diameter_mm: float | None = Field(default=None, gt=0, le=200)
    cores_composited: int | None = Field(default=None, ge=1, le=200)
    core_depths_reached_cm: list[float] | None = Field(default=None, max_length=200)


class SkipIn(_In):
    reason: str = Field(min_length=5, max_length=2000)


class StorageIn(_In):
    condition: Literal["dried", "refrigerated", "frozen", "ambient"]


class CustodyIn(_In):
    event: str = Field(min_length=3, max_length=30)
    occurred_at: datetime
    location: str = Field(default="", max_length=200)
    seal_intact: bool | None = None
    count_matches: bool | None = None
    notes: str = Field(default="", max_length=5000)
    corrects_event_id: str | None = None
    storage: StorageIn | None = None


# ------------------------------------------------------------------ multi-stage design (VM0042 Appendix 6)
Selection = Literal["census", "pps_wr", "equal_wr"]


class DesignFieldIn(_In):
    field_id: str
    draws: int = Field(default=1, ge=1, le=1000)
    # optional cross-check: the server computes p (PPS: A_fj / A_f, equal: 1 / K_f) and refuses a mismatch
    selection_probability: float | None = Field(default=None, gt=0, le=1)


class DesignUnitIn(_In):
    unit_id: str  # farmer id (landowner), farm id (farm) or field id (field)
    draws: int = Field(default=1, ge=1, le=1000)
    selection_probability: float | None = Field(default=None, gt=0, le=1)
    fields: list[DesignFieldIn] = Field(default_factory=list, max_length=5000)


class SamplingDesignIn(_In):
    stage1_unit: Literal["landowner", "farm", "field"]
    stage1_selection: Selection
    stage2_selection: Selection | None = None  # required unless stage1_unit is "field"
    units: list[DesignUnitIn] = Field(min_length=1, max_length=5000)
    justification: str = Field(min_length=5, max_length=5000)
