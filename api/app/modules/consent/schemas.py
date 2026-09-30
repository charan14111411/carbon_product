from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.modules.consent.models import CONSENT_PURPOSES

Channel = Literal["app", "whatsapp", "ivr", "paper", "field_officer"]
SignMethod = Literal["otp", "esign", "assisted"]


class OrmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    @field_validator("*", mode="before")
    @classmethod
    def _uuid_to_str(cls, v: Any) -> Any:
        return str(v) if isinstance(v, uuid.UUID) else v


def _check_purposes(v: list[str]) -> list[str]:
    unknown = sorted(set(v) - set(CONSENT_PURPOSES))
    if unknown:
        raise ValueError(f"Unknown consent purpose(s): {', '.join(unknown)}. "
                         f"Use: {', '.join(CONSENT_PURPOSES)}.")
    return sorted(set(v), key=CONSENT_PURPOSES.index)


def _check_body(v: dict[str, str]) -> dict[str, str]:
    if not v:
        raise ValueError("Add the agreement text in at least one language.")
    for lang, text in v.items():
        if not (2 <= len(lang) <= 10) or not isinstance(text, str) or not text.strip():
            raise ValueError(f"The agreement text for '{lang}' is empty or the language code is invalid.")
    return v


# ------------------------------------------------------------------ templates
class TemplateIn(BaseModel):
    programme_id: str | None = None
    code: str = Field(pattern=r"^[A-Za-z0-9][A-Za-z0-9_-]{1,39}$")
    title: str = Field(min_length=2, max_length=200)
    body: dict[str, str]
    purposes: list[str] = Field(min_length=1)

    @field_validator("purposes")
    @classmethod
    def _p(cls, v: list[str]) -> list[str]:
        return _check_purposes(v)

    @field_validator("body")
    @classmethod
    def _b(cls, v: dict[str, str]) -> dict[str, str]:
        return _check_body(v)


class TemplatePatch(BaseModel):
    programme_id: str | None = None
    title: str | None = Field(default=None, min_length=2, max_length=200)
    body: dict[str, str] | None = None
    purposes: list[str] | None = Field(default=None, min_length=1)

    @field_validator("purposes")
    @classmethod
    def _p(cls, v: list[str] | None) -> list[str] | None:
        return None if v is None else _check_purposes(v)

    @field_validator("body")
    @classmethod
    def _b(cls, v: dict[str, str] | None) -> dict[str, str] | None:
        return None if v is None else _check_body(v)


class TemplateOut(OrmOut):
    id: str
    programme_id: str | None
    code: str
    version: int
    title: str
    body: dict[str, str]
    purposes: list[str]
    status: str
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------------ signing
class SignIn(BaseModel):
    template_id: str
    language: str = Field(min_length=2, max_length=10)
    method: SignMethod
    otp_code: str | None = Field(default=None, max_length=10)


class AgreementOut(OrmOut):
    id: str
    farmer_id: str
    template_id: str
    template_version: int
    language: str
    signed_at: datetime
    method: str
    signed_text_sha256: str
    witness_user_id: str | None
    created_at: datetime


# ------------------------------------------------------------------ consent events
class ConsentIn(BaseModel):
    purpose: str
    granted: bool
    channel: Channel = "app"
    notes: str = Field(default="", max_length=2000)

    @field_validator("purpose")
    @classmethod
    def _purpose(cls, v: str) -> str:
        if v not in CONSENT_PURPOSES:
            raise ValueError(f"Unknown consent purpose. Use one of: {', '.join(CONSENT_PURPOSES)}.")
        return v


class ConsentEventOut(OrmOut):
    id: str
    farmer_id: str
    purpose: str
    granted: bool
    effective_on: date
    agreement_id: str | None
    channel: str
    notes: str
    created_by: str | None
    created_at: datetime


class ConsentState(BaseModel):
    purpose: str
    state: str  # granted | withdrawn | not_given
    granted: bool
    effective_on: date | None
    event_id: str | None
    agreement_id: str | None


class ConsentsOut(BaseModel):
    farmer_id: str
    current: list[ConsentState]
    history: list[ConsentEventOut]


class SignOut(BaseModel):
    agreement: AgreementOut
    consents: list[ConsentEventOut]
