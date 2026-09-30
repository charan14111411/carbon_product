from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field

KeyScope = Literal["read", "write_practices"]


class ApiKeyIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    scopes: list[KeyScope] = Field(min_length=1)


class WebhookIn(BaseModel):
    url: str = Field(min_length=8, max_length=500)
    events: list[str] = Field(min_length=1)
    description: str = Field(default="", max_length=2000)


class WebhookPatch(BaseModel):
    url: str | None = Field(default=None, min_length=8, max_length=500)
    events: list[str] | None = None
    description: str | None = Field(default=None, max_length=2000)
    is_active: bool | None = None


class PartnerPracticeIn(BaseModel):
    field_id: str
    practice_code: str = Field(min_length=2, max_length=40)
    scenario: Literal["baseline", "project"] = "project"
    performed_on: date
    ended_on: date | None = None
    quantity: float | None = Field(default=None, ge=0)
    unit: str | None = Field(default=None, max_length=20)
    area_ha: float | None = Field(default=None, gt=0)
    details: dict = Field(default_factory=dict)
    client_ref: str = Field(min_length=4, max_length=80, pattern=r"^[A-Za-z0-9._:-]+$")


class AskIn(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    run_id: str | None = None
