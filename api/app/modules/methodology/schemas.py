from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class _In(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")


class RulePackIn(_In):
    methodology_code: str = Field(min_length=2, max_length=40)
    methodology_version: str = Field(min_length=1, max_length=20)
    title: str = Field(min_length=3, max_length=200)
    source_url: str | None = Field(default=None, max_length=500)
    based_on_id: str | None = None


class RulePackPatch(_In):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    source_url: str | None = Field(default=None, max_length=500)


class RuleValueIn(_In):
    value: Any
    source_document: str = Field(min_length=3, max_length=300)
    source_section: str | None = Field(default=None, max_length=120)
    source_page: str | None = Field(default=None, max_length=40)
    notes: str | None = Field(default=None, max_length=5000)


class AssignPackIn(_In):
    pack_id: str
