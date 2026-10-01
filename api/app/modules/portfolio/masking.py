"""Masking of farmer personal data for client and buyer views.

A programme's client (``client_viewer``) and buyers see progress and results, never who the
farmers are: names become a pseudonymous label built from the farmer code and phone numbers
are removed. Every module that returns farmer details to a READ/BUYER_READ caller uses this.
"""

from __future__ import annotations

from typing import Any

from app.core.auth import CurrentUser

MASKED_ROLES = frozenset({"client_viewer", "buyer"})


def masks_pii(user: CurrentUser) -> bool:
    return user.role in MASKED_ROLES


def farmer_label(code: str | None) -> str:
    return f"Farmer {code}" if code else "Farmer"


def farmer_name(user: CurrentUser, farmer: Any) -> str | None:
    if farmer is None:
        return None
    return farmer_label(farmer.code) if masks_pii(user) else farmer.full_name


def farmer_public(user: CurrentUser, farmer: Any) -> dict[str, Any] | None:
    """Farmer summary safe for ``user``: masked for client/buyer roles."""
    if farmer is None:
        return None
    masked = masks_pii(user)
    return {
        "id": str(farmer.id), "code": farmer.code,
        "name": farmer_label(farmer.code) if masked else farmer.full_name,
        "phone": None if masked else farmer.phone,
        "village": farmer.village, "district": farmer.district, "state": farmer.state,
        "status": farmer.status, "masked": masked,
    }


def mask_phone(phone: str | None) -> str | None:
    """+919812345678 -> +91******5678 (for staff lists that don't need the full number)."""
    if not phone:
        return phone
    if len(phone) <= 6:
        return "*" * len(phone)
    return phone[:3] + "*" * (len(phone) - 7) + phone[-4:]
