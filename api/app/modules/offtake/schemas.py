from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class OfferIn(BaseModel):
    buyer_id: str
    batch_id: str
    credit_type: Literal["reduction", "removal"]
    quantity: float = Field(gt=0)
    unit_price: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    currency: str = Field(default="INR", min_length=3, max_length=3)
    valid_until: date
    seller_name: str | None = Field(default=None, max_length=200)
    terms: str = Field(default="", max_length=8000)


class OfferPatch(BaseModel):
    quantity: float | None = Field(default=None, gt=0)
    unit_price: Decimal | None = Field(default=None, gt=0, max_digits=14, decimal_places=2)
    valid_until: date | None = None
    terms: str | None = Field(default=None, max_length=8000)


class RespondIn(BaseModel):
    note: str = Field(default="", max_length=2000)


class DeliveryLine(BaseModel):
    due_date: date
    quantity: float = Field(gt=0)


class AgreementIn(BaseModel):
    buyer_id: str
    title: str = Field(min_length=3, max_length=200)
    code: str | None = Field(default=None, min_length=3, max_length=40, pattern=r"^[A-Za-z0-9._/-]+$")
    seller_name: str | None = Field(default=None, max_length=200)
    offer_id: str | None = None
    credit_type: Literal["reduction", "removal", "any"] = "any"
    total_volume_t: float = Field(gt=0)
    vintages: list[int] = Field(default_factory=list)
    price_type: Literal["fixed", "floor"]
    price: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    currency: str = Field(default="INR", min_length=3, max_length=3)
    delivery_schedule: list[DeliveryLine] = Field(min_length=1, max_length=120)
    effective_from: date | None = None
    effective_to: date | None = None
    notes: str = Field(default="", max_length=8000)

    @model_validator(mode="after")
    def _check(self) -> "AgreementIn":
        check_schedule(self.delivery_schedule, self.total_volume_t)
        if self.effective_from and self.effective_to and self.effective_to < self.effective_from:
            raise ValueError("The agreement can't end before it starts.")
        return self


class AgreementPatch(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    total_volume_t: float | None = Field(default=None, gt=0)
    vintages: list[int] | None = None
    price_type: Literal["fixed", "floor"] | None = None
    price: Decimal | None = Field(default=None, gt=0, max_digits=14, decimal_places=2)
    delivery_schedule: list[DeliveryLine] | None = Field(default=None, min_length=1, max_length=120)
    effective_from: date | None = None
    effective_to: date | None = None
    notes: str | None = Field(default=None, max_length=8000)


class SignIn(BaseModel):
    contract_evidence_id: str
    signed_on: date


class CloseIn(BaseModel):
    reason: str = Field(default="", max_length=4000)


def check_schedule(lines: list[DeliveryLine], total: float) -> None:
    dates = [x.due_date for x in lines]
    if len(set(dates)) != len(dates):
        raise ValueError("Each delivery date can appear only once.")
    s = sum(x.quantity for x in lines)
    if abs(s - total) > 1e-6:
        raise ValueError(f"The delivery schedule adds up to {s:g} t but the agreement is for {total:g} t.")
