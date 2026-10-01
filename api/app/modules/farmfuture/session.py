"""E.164 for their validator, and the in-memory token cache.

The FarmFuture token comes from ``ValidateMobileNumber``, so it is derived from a farmer's phone number:
a personal credential. Rules this module enforces:

* **Memory only.** Never written to the database, a log, a response or a JWT.
* **Keyed by the phone number** it was issued for, so one customer can never be served another's token.
* **Expires on its own** after ``FARMFUTURE_TOKEN_TTL_S`` -- our ceiling, not theirs (they publish none).

The store is per process: with several API workers a token acquired on one is a cache miss on another,
which is correct, just one more validation call.
"""

from __future__ import annotations

import threading
import time


def phone_digits(phone: str) -> str:
    return "".join(c for c in str(phone or "") if c.isdigit())


def to_e164(phone: str, country_code: str = "+91") -> str:
    """The form ``ValidateMobileNumber`` accepts: ``+919812345678``.

    It accepts nothing else, and answers a badly formatted number with HTTP 200 and "User does not
    exist, please register." -- ``919812345678`` and ``9812345678`` are both reported as unknown. So the
    number is put in E.164 here, once, before it is ever sent.
    """
    code = (country_code or "").strip()
    digits = phone_digits(phone)
    if not digits:
        return ""
    # An explicit "+" means the caller already said which country. Adding the default on top of it
    # turns +1 555 0100 into +9115550100.
    if str(phone).strip().startswith("+"):
        return "+" + digits
    bare_code = code.lstrip("+")
    if not bare_code:
        return "+" + digits
    if digits.startswith(bare_code) and len(digits) > len(bare_code) + 9:
        return "+" + digits
    if len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]
    return f"+{bare_code}{digits}"


class TokenStore:
    """A TTL map from a phone number (digits) to their token."""

    def __init__(self, ttl_s: float = 900.0) -> None:
        self.ttl_s = ttl_s
        self._lock = threading.Lock()
        self._tokens: dict[str, tuple[str, float]] = {}

    def get(self, phone: str) -> str | None:
        key = phone_digits(phone)
        with self._lock:
            entry = self._tokens.get(key)
            if entry is None:
                return None
            token, expires_at = entry
            if expires_at <= time.monotonic():
                del self._tokens[key]
                return None
            return token

    def put(self, phone: str, token: str, ttl_s: float | None = None) -> None:
        ttl = self.ttl_s if ttl_s is None else ttl_s
        if ttl <= 0:
            return
        with self._lock:
            self._tokens[phone_digits(phone)] = (token, time.monotonic() + ttl)

    def drop(self, phone: str) -> None:
        with self._lock:
            self._tokens.pop(phone_digits(phone), None)

    def clear(self) -> None:
        with self._lock:
            self._tokens.clear()

    def __repr__(self) -> str:  # never show tokens, even in a debugger or a traceback
        return f"TokenStore({len(self._tokens)} cached)"


#: The process-wide store.
token_store = TokenStore()
