"""Write a domain event to the outbox, in the same transaction as the change it describes.
The partners module delivers outbox events to subscribed webhooks."""

from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.tenancy import _plain


def emit(db: Session, user: CurrentUser | None, event: str, entity: Any, payload: dict | None = None) -> None:
    from app.modules.partners.models import DomainEvent

    db.flush()
    db.add(
        DomainEvent(
            org_id=user.org_id if user else entity.org_id,
            created_by=user.id if user else None,
            event=event,
            entity_type=type(entity).__name__,
            entity_id=str(entity.id),
            payload=_plain(payload or {}),
        )
    )
