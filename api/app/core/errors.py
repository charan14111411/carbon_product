"""One error shape for the whole API: ``{"code", "message", "details"}``.

Codes are stable, machine-readable strings the web app can translate.
"""

from __future__ import annotations

from typing import Any


class AppError(Exception):
    status = 400
    code = "BAD_REQUEST"

    def __init__(self, message: str, *, details: dict[str, Any] | None = None, code: str | None = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}
        if code:
            self.code = code


class ValidationFailed(AppError):
    status, code = 422, "VALIDATION_ERROR"


class NotFound(AppError):
    status, code = 404, "NOT_FOUND"


class Unauthorized(AppError):
    status, code = 401, "UNAUTHORIZED"


class Forbidden(AppError):
    status, code = 403, "FORBIDDEN"


class SelfApproval(AppError):
    status, code = 403, "SELF_APPROVAL_REJECTED"


class Conflict(AppError):
    status, code = 409, "CONFLICT"


class ImmutableRecord(AppError):
    status, code = 409, "IMMUTABLE_RECORD"


class RuleMissing(AppError):
    """A methodology rule or required input is missing. Nothing is assumed."""

    status, code = 409, "RULE_MISSING"


class Blocked(AppError):
    """A blocking quality finding or workflow prerequisite stops the action."""

    status, code = 409, "BLOCKED"


class IllegalTransition(AppError):
    status, code = 409, "ILLEGAL_STATE_TRANSITION"


class ProviderUnavailable(AppError):
    """An outside data service (weather, soil map, satellite, DEM) could not be reached or gave no usable answer.
    Supporting-data sync catches it and records the value as not available; other screens show the message."""

    status, code = 503, "PROVIDER_UNAVAILABLE"

    def __init__(self, provider: str, reason: str, *, details: dict[str, Any] | None = None, no_data: bool = False):
        message = (f"{provider} has no value for this location: {reason}." if no_data else
                   f"The {provider} service is unavailable right now ({reason}). Try again later.")
        super().__init__(message, details={"provider": provider, "reason": reason, **(details or {})})
        self.provider = provider
        self.reason = reason
