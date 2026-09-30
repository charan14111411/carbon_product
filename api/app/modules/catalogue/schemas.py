from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

CropCategory = Literal["field", "horticulture", "plantation", "agroforestry", "rice"]
PracticeCategory = Literal["soil", "nutrient", "water", "residue", "tillage", "trees", "livestock", "energy"]
CODE = r"^[a-z][a-z0-9_]{1,39}$"


class OrmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v


class AttributeDef(BaseModel):
    key: str = Field(pattern=r"^[a-z][a-z0-9_]{0,39}$")
    label: str = Field(min_length=1, max_length=120)
    type: Literal["text", "number", "choice"] = "text"
    required: bool = False
    choices: list[str] = Field(default_factory=list)
    unit: str | None = Field(default=None, max_length=20)
    min: float | None = None
    max: float | None = None

    @model_validator(mode="after")
    def _check(self) -> "AttributeDef":
        if self.type == "choice" and not self.choices:
            raise ValueError(f"'{self.key}' is a choice, so it needs a list of choices.")
        if self.min is not None and self.max is not None and self.min > self.max:
            raise ValueError(f"'{self.key}' has a minimum greater than its maximum.")
        return self


def _unique_keys(v: list[AttributeDef]) -> list[AttributeDef]:
    keys = [a.key for a in v]
    dupes = sorted({k for k in keys if keys.count(k) > 1})
    if dupes:
        raise ValueError(f"Each attribute key must be unique (repeated: {', '.join(dupes)}).")
    return v


# ------------------------------------------------------------------ crops
class CropIn(BaseModel):
    code: str = Field(pattern=CODE)
    name: str = Field(min_length=1, max_length=120)
    local_name: str | None = Field(default=None, max_length=120)
    category: CropCategory = "field"
    attributes: list[AttributeDef] = Field(default_factory=list)

    @field_validator("attributes")
    @classmethod
    def _keys(cls, v: list[AttributeDef]) -> list[AttributeDef]:
        return _unique_keys(v)


class CropPatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    local_name: str | None = Field(default=None, max_length=120)
    category: CropCategory | None = None
    attributes: list[AttributeDef] | None = None
    is_active: bool | None = None

    @field_validator("attributes")
    @classmethod
    def _keys(cls, v: list[AttributeDef] | None) -> list[AttributeDef] | None:
        return None if v is None else _unique_keys(v)


class CropOut(OrmOut):
    id: str
    code: str
    name: str
    local_name: str | None
    category: str
    attributes: list[dict]
    is_active: bool
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------------ practice types
class PracticeTypeIn(BaseModel):
    code: str = Field(pattern=CODE)
    name: str = Field(min_length=1, max_length=120)
    category: PracticeCategory = "soil"
    description: str = ""
    crop_codes: list[str] = Field(default_factory=list)
    unit: str | None = Field(default=None, max_length=20)
    requires_quantity: bool = False
    required_evidence: list[str] = Field(default_factory=list)
    fields: list[AttributeDef] = Field(default_factory=list)
    emission_factor_keys: list[str] = Field(default_factory=list)

    @field_validator("fields")
    @classmethod
    def _keys(cls, v: list[AttributeDef]) -> list[AttributeDef]:
        return _unique_keys(v)

    @model_validator(mode="after")
    def _unit_for_quantity(self) -> "PracticeTypeIn":
        if self.requires_quantity and not self.unit:
            raise ValueError("A practice that needs a quantity must say which unit it is measured in.")
        return self


class PracticeTypePatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    category: PracticeCategory | None = None
    description: str | None = None
    crop_codes: list[str] | None = None
    unit: str | None = Field(default=None, max_length=20)
    requires_quantity: bool | None = None
    required_evidence: list[str] | None = None
    fields: list[AttributeDef] | None = None
    emission_factor_keys: list[str] | None = None
    is_active: bool | None = None

    @field_validator("fields")
    @classmethod
    def _keys(cls, v: list[AttributeDef] | None) -> list[AttributeDef] | None:
        return None if v is None else _unique_keys(v)


class PracticeTypeOut(OrmOut):
    id: str
    code: str
    name: str
    category: str
    description: str
    crop_codes: list[str]
    unit: str | None
    requires_quantity: bool
    required_evidence: list[str]
    fields: list[dict]
    emission_factor_keys: list[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime


class InstallDefaultsOut(BaseModel):
    crops_added: list[str]
    practice_types_added: list[str]
