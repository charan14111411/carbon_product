"""Payout adapters (UPI / bank transfer).

``SimulatedPayoutProvider`` is deterministic and moves no money:

* ``verify`` – a simulated penny-drop: succeeds when the details have a valid format.
* ``pay``    – succeeds unless the UPI id contains "fail" (to exercise failure handling).
  The provider reference is derived from the idempotency key, so asking twice for the
  same payout gives the same reference, as a real idempotent API would.

Choose with ``VC_PAYOUT_PROVIDER`` (default ``simulated``). A real provider (e.g. a bank's
payout API or a UPI aggregator) implements ``PayoutProvider`` and is registered with
``register_payout_provider("razorpayx", factory)``. Real bank payouts need a tokenised
account reference from the provider; only a masked account number is stored here.
"""

from __future__ import annotations

import hashlib
import os
import re
from collections.abc import Callable
from dataclasses import dataclass
from decimal import Decimal
from typing import Protocol

UPI_RE = re.compile(r"^[A-Za-z0-9._-]{2,256}@[A-Za-z][A-Za-z0-9]{1,63}$")
IFSC_RE = re.compile(r"^[A-Z]{4}0[A-Z0-9]{6}$")
MASKED_RE = re.compile(r"^X{6}\d{4}$")


@dataclass(frozen=True)
class ProfileRef:
    method: str
    upi_id: str | None
    account_masked: str | None
    ifsc: str | None
    account_name: str


@dataclass(frozen=True)
class ProviderResult:
    ok: bool
    provider_ref: str | None = None
    reason: str | None = None


class PayoutProvider(Protocol):
    name: str

    def verify(self, profile: ProfileRef) -> ProviderResult: ...

    def pay(self, *, idempotency_key: str, amount: Decimal, currency: str, profile: ProfileRef) -> ProviderResult: ...


class SimulatedPayoutProvider:
    name = "simulated"

    def verify(self, profile: ProfileRef) -> ProviderResult:
        if profile.method == "upi":
            if profile.upi_id and UPI_RE.match(profile.upi_id):
                return ProviderResult(True, "SIMVERIFY-" + hashlib.sha256(profile.upi_id.encode()).hexdigest()[:10])
            return ProviderResult(False, reason="The UPI ID could not be verified.")
        if profile.method == "bank":
            if profile.ifsc and IFSC_RE.match(profile.ifsc) and profile.account_masked and MASKED_RE.match(profile.account_masked):
                key = f"{profile.ifsc}{profile.account_masked}"
                return ProviderResult(True, "SIMVERIFY-" + hashlib.sha256(key.encode()).hexdigest()[:10])
            return ProviderResult(False, reason="The bank details could not be verified.")
        return ProviderResult(False, reason="Unknown payment method.")

    def pay(self, *, idempotency_key: str, amount: Decimal, currency: str, profile: ProfileRef) -> ProviderResult:
        if amount <= 0:
            return ProviderResult(False, reason="Amount must be more than zero.")
        if profile.method == "upi" and profile.upi_id and "fail" in profile.upi_id.lower():
            return ProviderResult(False, reason="The payment provider rejected the transfer (simulated failure).")
        return ProviderResult(True, "SIMPAY-" + hashlib.sha256(idempotency_key.encode()).hexdigest()[:16].upper())


_REGISTRY: dict[str, Callable[[], PayoutProvider]] = {"simulated": SimulatedPayoutProvider}


def register_payout_provider(name: str, factory: Callable[[], PayoutProvider]) -> None:
    _REGISTRY[name] = factory


def get_payout_provider() -> PayoutProvider:
    name = os.environ.get("VC_PAYOUT_PROVIDER", "simulated")
    if name not in _REGISTRY:
        raise RuntimeError(f"Unknown payout provider '{name}'. Registered: {sorted(_REGISTRY)}")
    return _REGISTRY[name]()
