from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

CreditType = Literal["reduction", "removal"]


class IssueIn(BaseModel):
    registry_name: str = Field(min_length=2, max_length=40)
    registry_project_ref: str = Field(min_length=1, max_length=80)
    serial_start: str = Field(min_length=1, max_length=120)
    serial_end: str = Field(min_length=1, max_length=120)
    issued_on: date


class ReasonIn(BaseModel):
    reason: str = Field(min_length=3, max_length=2000)


class BuyerIn(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    kind: Literal["corporate", "trader", "ngo", "government"] = "corporate"
    country: str = Field(default="", max_length=80)
    contact_name: str | None = Field(default=None, max_length=200)
    contact_email: EmailStr | None = None
    requirements: dict = Field(default_factory=dict)
    user_id: str | None = None


class BuyerPatch(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    kind: Literal["corporate", "trader", "ngo", "government"] | None = None
    country: str | None = Field(default=None, max_length=80)
    contact_name: str | None = Field(default=None, max_length=200)
    contact_email: EmailStr | None = None
    requirements: dict | None = None
    user_id: str | None = None


class SaleIn(BaseModel):
    buyer_id: str
    batch_id: str
    credit_type: CreditType
    quantity: float = Field(gt=0)
    unit_price: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    currency: str = Field(default="INR", pattern=r"^[A-Z]{3}$")
    notes: str = Field(default="", max_length=2000)


class ContractIn(BaseModel):
    contract_ref: str = Field(min_length=2, max_length=120)
    trade_date: date | None = None


class RetireIn(BaseModel):
    beneficiary: str = Field(min_length=2, max_length=200)


class CancelSaleIn(BaseModel):
    reason: str = Field(default="Cancelled", min_length=3, max_length=2000)
