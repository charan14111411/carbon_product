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
