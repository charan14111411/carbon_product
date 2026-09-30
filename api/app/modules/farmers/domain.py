"""Pure farmer rules (no database)."""

from __future__ import annotations

import re

from app.core.errors import ValidationFailed

_SEPARATORS = re.compile(r"[\s\-().]")
_INDIAN_MOBILE = re.compile(r"^[6-9]\d{9}$")


def normalise_phone(raw: str, default_country: str = "91") -> str:
    """Return the number in E.164 (``+<country><number>``) or raise ``ValidationFailed``.

    Accepts ``9812345678``, ``09812345678``, ``919812345678``, ``+91 98123-45678`` and other
    international numbers written with a leading ``+`` or ``00``.
    """
    s = _SEPARATORS.sub("", (raw or "").strip())
    if s.startswith("00"):
        s = "+" + s[2:]
    bad = ValidationFailed(
        "That phone number doesn't look right. Enter a 10-digit mobile number, or include the country code.",
        code="INVALID_PHONE", details={"phone": raw},
    )
    if s.startswith("+"):
        digits = s[1:]
        if not digits.isdigit() or not 8 <= len(digits) <= 15 or digits[0] == "0":
            raise bad
        if digits.startswith("91") and not _INDIAN_MOBILE.match(digits[2:]):
            raise bad
        return "+" + digits
    if not s.isdigit():
        raise bad
    if len(s) == 11 and s.startswith("0"):
        s = s[1:]
    elif len(s) == 12 and s.startswith(default_country):
        s = s[2:]
    if default_country == "91" and not _INDIAN_MOBILE.match(s):
        raise bad
    return f"+{default_country}{s}"


def phone_digits(text: str) -> str:
    return re.sub(r"\D", "", text or "")
