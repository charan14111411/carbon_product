from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, model_validator

Channel = Literal["sms", "whatsapp", "ivr", "email"]


class TemplateIn(BaseModel):
    code: str = Field(min_length=2, max_length=60, pattern=r"^[a-z0-9_.-]+$")
    channel: Channel
    language: str = Field(min_length=2, max_length=10)
    subject: str | None = Field(default=None, max_length=200)
    body: str = Field(min_length=1, max_length=4000)
    notes: str = Field(default="", max_length=2000)


class TemplatePatch(BaseModel):
    subject: str | None = Field(default=None, max_length=200)
    body: str | None = Field(default=None, min_length=1, max_length=4000)
    notes: str | None = Field(default=None, max_length=2000)


class SendIn(BaseModel):
    farmer_id: str | None = None
    user_id: str | None = None
    channel: Channel = "sms"
    template_code: str | None = None
    language: str | None = None
    subject: str | None = Field(default=None, max_length=200)
    body: str | None = Field(default=None, min_length=1, max_length=4000)
    context: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def _one_each(self) -> "SendIn":
        if bool(self.farmer_id) == bool(self.user_id):
            raise ValueError("Send to either a farmer or a user.")
        if bool(self.template_code) == bool(self.body):
            raise ValueError("Give either a template code or a message body.")
        return self


class InboundIn(BaseModel):
    phone: str = Field(min_length=5, max_length=30)
    text: str = Field(min_length=1, max_length=2000)
    channel: Literal["whatsapp", "sms"] = "whatsapp"


class ReviewIn(BaseModel):
    decision: Literal["accept", "reject"]
    field_id: str | None = None
    quantity: float | None = Field(default=None, ge=0)
    unit: str | None = Field(default=None, max_length=20)
    note: str = Field(default="", max_length=2000)
