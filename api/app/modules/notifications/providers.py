"""Messaging adapters (SMS / WhatsApp / IVR / email).

``SimulatedMessagingProvider`` is deterministic and sends nothing:

* a message to an address ending in ``0`` fails (to exercise failure handling);
* every other message is accepted and reported delivered at once;
* the provider reference is derived from the idempotency key, so asking twice for the same
  notification gives the same reference, as an idempotent real API would.

Choose with ``VC_MESSAGING_PROVIDER`` (default ``simulated``). A real provider (an SMS gateway,
the WhatsApp Business API, an IVR vendor, SMTP) implements ``MessagingProvider`` and is registered
with ``register_messaging_provider(name, factory)``.
"""

from __future__ import annotations

import hashlib
import os
from collections.abc import Callable
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class SendResult:
    ok: bool
    status: str  # sent | delivered | failed
    provider_ref: str | None = None
    reason: str | None = None


class MessagingProvider(Protocol):
    name: str

    def send(self, *, channel: str, to: str, body: str, subject: str | None, idempotency_key: str) -> SendResult: ...


class SimulatedMessagingProvider:
    name = "simulated"

    def send(self, *, channel: str, to: str, body: str, subject: str | None, idempotency_key: str) -> SendResult:
        if not to:
            return SendResult(False, "failed", reason="No address to send to.")
        if not body.strip():
            return SendResult(False, "failed", reason="The message is empty.")
        if to.strip().endswith("0"):
            return SendResult(False, "failed", reason="The provider could not deliver the message (simulated failure).")
        ref = "SIMMSG-" + hashlib.sha256(idempotency_key.encode()).hexdigest()[:16].upper()
        return SendResult(True, "delivered", provider_ref=ref)


_REGISTRY: dict[str, Callable[[], MessagingProvider]] = {"simulated": SimulatedMessagingProvider}


def register_messaging_provider(name: str, factory: Callable[[], MessagingProvider]) -> None:
    _REGISTRY[name] = factory


def get_messaging_provider() -> MessagingProvider:
    name = os.environ.get("VC_MESSAGING_PROVIDER", "simulated")
    if name not in _REGISTRY:
        raise RuntimeError(f"Unknown messaging provider '{name}'. Registered: {sorted(_REGISTRY)}")
    return _REGISTRY[name]()
