from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field, field_validator


class VerifierAccessIn(BaseModel):
    verifier_name: str = Field(min_length=2, max_length=200)
    verifier_email: EmailStr
    organisation: str = Field(default="", max_length=200)
    days: int = Field(ge=1, le=90)


class VerifierQueryIn(BaseModel):
    question: str = Field(min_length=5, max_length=10000)
    subject_type: str = Field(default="package", min_length=1, max_length=40)
    subject_id: str = Field(default="", max_length=64)


class AnswerIn(BaseModel):
    answer: str = Field(min_length=2, max_length=10000)


class DecisionIn(BaseModel):
    status: str
    note: str = Field(default="", max_length=10000)

    @field_validator("status")
    @classmethod
    def _status(cls, v: str) -> str:
        if v not in ("verified", "findings"):
            raise ValueError("Choose verified or findings")
        return v
