"""Passwords, tokens and second-factor codes."""

from __future__ import annotations

import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

import bcrypt
import jwt
import pyotp

from app.core.config import get_settings
from app.core.errors import Unauthorized


def _prehash(password: str) -> bytes:
    # bcrypt reads at most 72 bytes; pre-hash so long passphrases are never truncated.
    return hashlib.sha256(password.encode("utf-8")).hexdigest().encode("ascii")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_prehash(password), bcrypt.gensalt(rounds=12)).decode("ascii")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(_prehash(password), hashed.encode("ascii"))
    except ValueError:
        return False


# A real hash of a random value, so login takes the same time whether or not the user exists.
DUMMY_HASH = hash_password(secrets.token_hex(16))


def create_token(subject: str, *, scope: str = "session", minutes: int | None = None, **claims: Any) -> str:
    s = get_settings()
    now = datetime.now(UTC)
    payload = {
        "sub": subject,
        "scope": scope,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=minutes or s.access_token_minutes)).timestamp()),
        **claims,
    }
    return jwt.encode(payload, s.jwt_secret, algorithm=s.jwt_algorithm)


def decode_token(token: str, *, scope: str = "session") -> dict[str, Any]:
    s = get_settings()
    try:
        payload = jwt.decode(token, s.jwt_secret, algorithms=[s.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise Unauthorized("Your session has expired. Please sign in again.", code="TOKEN_EXPIRED") from exc
    except jwt.PyJWTError as exc:
        raise Unauthorized("Invalid token.") from exc
    if payload.get("scope") != scope:
        raise Unauthorized("This token cannot be used here.")
    return payload


def new_totp_secret() -> str:
    return pyotp.random_base32()


def totp_uri(secret: str, email: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name=get_settings().app_name)


def verify_totp(secret: str, code: str) -> bool:
    return bool(secret) and pyotp.TOTP(secret).verify(code.strip(), valid_window=1)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()
