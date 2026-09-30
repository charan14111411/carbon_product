from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class NoteIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    note: str = Field(min_length=5, max_length=5000)
