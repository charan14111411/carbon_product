from __future__ import annotations

import re
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

from app.modules.payments.domain import validate_deductions, validate_weights
from app.modules.payments.providers import IFSC_RE, UPI_RE


class Deduction(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    pct: Decimal = Field(ge=0, le=100, max_digits=5, decimal_places=2)


class BenefitRuleIn(BaseModel):
    programme_id: str
    farmer_share_pct: Decimal = Field(ge=0, le=100, max_digits=5, decimal_places=2)
    weights: dict[str, float]
    deductions: list[Deduction] = Field(default_factory=list)
    min_payout: Decimal = Field(default=Decimal("0"), ge=0, max_digits=14, decimal_places=2)
    notes: str = Field(default="", max_length=4000)

    @model_validator(mode="after")
    def _check(self) -> "BenefitRuleIn":
        errors = validate_weights(self.weights) + validate_deductions([d.model_dump() for d in self.deductions])
        if errors:
            raise ValueError(" ".join(errors))
        return self


class BenefitRulePatch(BaseModel):
    farmer_share_pct: Decimal | None = Field(default=None, ge=0, le=100, max_digits=5, decimal_places=2)
    weights: dict[str, float] | None = None
    deductions: list[Deduction] | None = None
    min_payout: Decimal | None = Field(default=None, ge=0, max_digits=14, decimal_places=2)
    notes: str | None = Field(default=None, max_length=4000)

    @model_validator(mode="after")
    def _check(self) -> "BenefitRulePatch":
        errors = []
        if self.weights is not None:
            errors += validate_weights(self.weights)
        if self.deductions is not None:
            errors += validate_deductions([d.model_dump() for d in self.deductions])
        if errors:
            raise ValueError(" ".join(errors))
        return self


class PaymentProfileIn(BaseModel):
    method: Literal["upi", "bank"]
    upi_id: str | None = Field(default=None, max_length=100)
    account_number: str | None = None
    ifsc: str | None = None
    account_name: str = Field(min_length=2, max_length=200)

    @field_validator("ifsc")
    @classmethod
    def _upper(cls, v: str | None) -> str | None:
        return v.strip().upper() if v else v

    @model_validator(mode="after")
    def _check(self) -> "PaymentProfileIn":
        if self.method == "upi":
            if not self.upi_id or not UPI_RE.match(self.upi_id.strip()):
                raise ValueError("Enter a UPI ID like name@bank.")
            if self.account_number or self.ifsc:
                raise ValueError("Give either a UPI ID or bank details, not both.")
        else:
            digits = re.sub(r"\s", "", self.account_number or "")
            if not re.fullmatch(r"\d{9,18}", digits):
                raise ValueError("The bank account number must be 9 to 18 digits.")
            if not self.ifsc or not IFSC_RE.match(self.ifsc):
                raise ValueError("Enter a valid IFSC code, e.g. SBIN0001234.")
            if self.upi_id:
                raise ValueError("Give either a UPI ID or bank details, not both.")
            self.account_number = digits
        return self
