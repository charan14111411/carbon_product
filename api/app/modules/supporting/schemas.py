from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

MAX_SYNC_DAYS = 400


class OrmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v


class DeviceIn(BaseModel):
    kind: Literal["soilsync", "microclime"]
    external_id: str = Field(min_length=2, max_length=80)
    name: str = Field(min_length=2, max_length=200)
    farm_id: str | None = None
    field_id: str | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    elevation_m: float | None = Field(default=None, ge=-500, le=9000)
    parameters: list[str] | None = None
    status: Literal["online", "offline"] = "online"
    calibrated_on: date | None = None


class DevicePatch(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    farm_id: str | None = None
    field_id: str | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    elevation_m: float | None = Field(default=None, ge=-500, le=9000)
    parameters: list[str] | None = None
    status: Literal["online", "offline", "retired"] | None = None
    calibrated_on: date | None = None


class DeviceOut(OrmOut):
    id: str
    kind: str
    external_id: str
    name: str
    farm_id: str | None
    field_id: str | None
    latitude: float
    longitude: float
    elevation_m: float | None
    parameters: list[str]
    status: str
    last_seen_at: datetime | None
    calibrated_on: date | None
    created_at: datetime


class SyncIn(BaseModel):
    start: date
    end: date
    parameters: list[str] | None = None

    @model_validator(mode="after")
    def _window(self) -> "SyncIn":
        if self.end < self.start:
            raise ValueError("The end date can't be before the start date.")
        if (self.end - self.start).days + 1 > MAX_SYNC_DAYS:
            raise ValueError(f"Sync at most {MAX_SYNC_DAYS} days at a time.")
        return self


class TerrainRefreshIn(BaseModel):
    force: bool = False


class SoilApplyIn(BaseModel):
    suggestion_id: str
    columns: list[Literal["soil_texture_class", "wrb_soil_group"]] = Field(
        default_factory=lambda: ["soil_texture_class", "wrb_soil_group"], min_length=1)
    overwrite: bool = False
    note: str = Field(default="", max_length=2000)
