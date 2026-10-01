from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Proficiency = Literal["NAPT", "GLOSOLAN", "other", "none"]


class _In(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")


class LabIn(_In):
    code: str = Field(min_length=2, max_length=40, pattern=r"^[A-Za-z0-9_.-]+$")
    name: str = Field(min_length=2, max_length=200)
    accreditation: str | None = Field(default=None, max_length=120)
    accreditation_valid_until: date | None = None
    city: str = Field(default="", max_length=120)
    contact_email: str | None = Field(default=None, max_length=200)
    iso17025: bool | None = None
    proficiency_program: Proficiency | None = None
    analytical_error_report_id: str | None = None


class LabPatch(_In):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    accreditation: str | None = Field(default=None, max_length=120)
    accreditation_valid_until: date | None = None
    city: str | None = Field(default=None, max_length=120)
    contact_email: str | None = Field(default=None, max_length=200)
    iso17025: bool | None = None
    proficiency_program: Proficiency | None = None
    analytical_error_report_id: str | None = None


class LabChangeIn(_In):
    from_lab_id: str
    to_lab_id: str
    justification: str = Field(min_length=20, max_length=5000)
    sop_consistency_statement: str = Field(min_length=20, max_length=5000)
    evidence_ids: list[str] = Field(default_factory=list, max_length=20)
    effective_from: date | None = None


class BatchIn(_In):
    lab_id: str
    campaign_id: str
    layer_ids: list[str] = Field(min_length=1, max_length=5000)


class DispatchIn(_In):
    dispatched_on: date | None = None


class ResultIn(_In):
    layer_id: str
    analyte: str
    value: float
    unit: str = Field(min_length=1, max_length=20)
    method: str = Field(min_length=2, max_length=60)
    analysed_on: date
    uncertainty: float | None = Field(default=None, ge=0)
    detection_limit: float | None = Field(default=None, ge=0)
    method_justification: str | None = Field(default=None, max_length=5000)
    purpose: Literal["primary", "spectroscopy_check"] = "primary"
    lab_id: str | None = None
    calibration_id: str | None = None


class ResultPatch(_In):
    value: float | None = None
    unit: str | None = Field(default=None, min_length=1, max_length=20)
    method: str | None = Field(default=None, min_length=2, max_length=60)
    analysed_on: date | None = None
    uncertainty: float | None = Field(default=None, ge=0)
    detection_limit: float | None = Field(default=None, ge=0)
    method_justification: str | None = Field(default=None, max_length=5000)
    calibration_id: str | None = None


class ReviewIn(_In):
    note: str | None = Field(default=None, max_length=5000)


class NoteIn(_In):
    note: str = Field(min_length=5, max_length=5000)


class SupersedeIn(_In):
    value: float
    method: str = Field(min_length=2, max_length=60)
    analysed_on: date
    reason: str = Field(min_length=5, max_length=5000)
    unit: str | None = Field(default=None, min_length=1, max_length=20)
    uncertainty: float | None = Field(default=None, ge=0)
    detection_limit: float | None = Field(default=None, ge=0)
    method_justification: str | None = Field(default=None, max_length=5000)
    calibration_id: str | None = None


class CalibrationIn(_In):
    code: str = Field(min_length=2, max_length=40)
    analyte: str
    reference_method: str = Field(min_length=2, max_length=60)
    n_samples: int = Field(ge=10)
    rmse: float = Field(ge=0)
    r2: float = Field(ge=0, le=1)
    bias: float = 0.0
    valid_range: dict
    notes: str = Field(default="", max_length=5000)
    rpiq: float | None = Field(default=None, gt=0)
    lin_ccc: float | None = Field(default=None, ge=-1, le=1)
    split_method: str | None = Field(default=None, min_length=3, max_length=120)
    n_peer_reviewed_refs: int | None = Field(default=None, ge=0, le=1000)
    spectral_range: str | None = Field(default=None, min_length=2, max_length=120)
    instrument: str | None = Field(default=None, min_length=2, max_length=200)


class CalibrationPatch(_In):
    reference_method: str | None = Field(default=None, min_length=2, max_length=60)
    n_samples: int | None = Field(default=None, ge=10)
    rmse: float | None = Field(default=None, ge=0)
    r2: float | None = Field(default=None, ge=0, le=1)
    bias: float | None = None
    valid_range: dict | None = None
    notes: str | None = Field(default=None, max_length=5000)
    rpiq: float | None = Field(default=None, gt=0)
    lin_ccc: float | None = Field(default=None, ge=-1, le=1)
    split_method: str | None = Field(default=None, min_length=3, max_length=120)
    n_peer_reviewed_refs: int | None = Field(default=None, ge=0, le=1000)
    spectral_range: str | None = Field(default=None, min_length=2, max_length=120)
    instrument: str | None = Field(default=None, min_length=2, max_length=200)
