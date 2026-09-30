"""Tenant-safe data access and the audit trail.

Every read goes through ``scoped`` or ``get_owned`` so a caller only ever sees
rows belonging to their own organisation. A row from another organisation is
reported as *not found*, never as *forbidden*, so its existence is not leaked.
"""

from __future__ import annotations

import enum
import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Any, TypeVar

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.errors import NotFound

T = TypeVar("T")


def scoped(model: type[T], user: CurrentUser) -> Select[tuple[T]]:
    return select(model).where(model.org_id == user.org_id)  # type: ignore[attr-defined]


def get_owned(db: Session, model: type[T], obj_id: uuid.UUID | str, user: CurrentUser, what: str | None = None) -> T:
    if isinstance(obj_id, str):
        try:
            obj_id = uuid.UUID(obj_id)
        except ValueError as exc:
            raise NotFound(f"{what or model.__name__} not found.") from exc
    obj = db.get(model, obj_id)
    if obj is None or getattr(obj, "org_id", None) != user.org_id:
        raise NotFound(f"{what or model.__name__} not found.")
    return obj


def _plain(value: Any) -> Any:
    if isinstance(value, (uuid.UUID,)):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, enum.Enum):
        return value.value
    if isinstance(value, dict):
        return {k: _plain(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [_plain(v) for v in value]
    return value


def snapshot(obj: Any) -> dict[str, Any]:
    """Column values of an ORM object as JSON-safe data."""
    return {c.key: _plain(getattr(obj, c.key)) for c in obj.__table__.columns}


def audit(
    db: Session,
    user: CurrentUser | None,
    action: str,
    entity: Any,
    *,
    before: dict | None = None,
    reason: str | None = None,
    org_id: uuid.UUID | None = None,
) -> None:
    from app.modules.identity.models import AuditEntry

    db.flush()
    db.add(
        AuditEntry(
            org_id=org_id or (user.org_id if user else entity.org_id),
            created_by=user.id if user else None,
            action=action,
            entity_type=type(entity).__name__,
            entity_id=str(entity.id),
            before=before,
            after=snapshot(entity),
            reason=reason,
        )
    )
