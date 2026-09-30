"""Who is calling, and may they do this? Every protected route depends on ``require``."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Any

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.errors import Forbidden, SelfApproval, Unauthorized
from app.core.permissions import P, permissions_for
from app.core.security import decode_token


@dataclass(frozen=True)
class CurrentUser:
    id: uuid.UUID
    org_id: uuid.UUID
    role: str
    email: str
    full_name: str
    permissions: frozenset[P]
    scope: dict[str, Any] = field(default_factory=dict)

    def can(self, perm: P) -> bool:
        return perm in self.permissions


def _bearer(request: Request) -> str:
    header = request.headers.get("authorization", "")
    if header.lower().startswith("bearer "):
        return header[7:].strip()
    raise Unauthorized("Sign in to continue.")


def current_user(request: Request, db: Session = Depends(get_db)) -> CurrentUser:
    from app.modules.identity.models import User

    payload = decode_token(_bearer(request))
    user = db.get(User, uuid.UUID(payload["sub"]))
    if user is None or not user.is_active:
        raise Unauthorized("This account is not active.")
    return CurrentUser(
        id=user.id,
        org_id=user.org_id,
        role=user.role,
        email=user.email,
        full_name=user.full_name,
        permissions=permissions_for(user.role),
        scope=dict(user.scope or {}),
    )


def require(*perms: P):
    """Dependency: the caller must hold at least one of ``perms``."""

    def dep(user: CurrentUser = Depends(current_user)) -> CurrentUser:
        if perms and not any(user.can(p) for p in perms):
            raise Forbidden("You don't have permission to do this.", details={"needs": [p.value for p in perms]})
        return user

    return dep


def ensure_not_author(approver_id: uuid.UUID, *author_ids: uuid.UUID | None, what: str) -> None:
    """Four-eyes rule: nobody approves something they created or edited."""
    if approver_id in {a for a in author_ids if a is not None}:
        raise SelfApproval(f"You can't approve {what} you created or edited. Ask a colleague to approve it.")
