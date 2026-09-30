from __future__ import annotations

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned, scoped
from app.modules.partners import service
from app.modules.partners.models import EVENTS, ApiKey, Webhook
from app.modules.partners.schemas import ApiKeyIn, AskIn, PartnerPracticeIn, WebhookIn, WebhookPatch
from app.modules.partners.service import PartnerContext, partner_scope

router = APIRouter()
_manage = require(P.MANAGE_PARTNERS)


# ------------------------------------------------------------------ API keys
@router.get("/partners/api-keys", tags=["Partners"])
def list_keys(user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return [service.key_out(k) for k in db.scalars(scoped(ApiKey, user).order_by(ApiKey.created_at.desc())).all()]


@router.post("/partners/api-keys", status_code=201, tags=["Partners"])
def create_key(body: ApiKeyIn, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    k, raw = service.create_key(db, user, body.name, list(body.scopes))
    return {**service.key_out(k), "key": raw,
            "message": "Copy this key now. It is shown only once and can't be recovered."}


@router.post("/partners/api-keys/{key_id}/revoke", tags=["Partners"])
def revoke_key(key_id: str, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return service.key_out(service.revoke_key(db, user, key_id))


# ------------------------------------------------------------------ webhooks & events
@router.get("/partners/webhooks", tags=["Partners"])
def list_webhooks(user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return [service.webhook_out(w) for w in db.scalars(scoped(Webhook, user).order_by(Webhook.created_at)).all()]


@router.get("/partners/webhook-events", tags=["Partners"])
def webhook_events(_: CurrentUser = Depends(_manage)):
    return list(EVENTS)


@router.post("/partners/webhooks", status_code=201, tags=["Partners"])
def create_webhook(body: WebhookIn, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return service.webhook_out(service.create_webhook(db, user, body), secret=True)


@router.post("/partners/webhooks/dispatch", tags=["Partners"])
def dispatch(user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return service.dispatch_pending(db, org_id=user.org_id)


@router.get("/partners/webhooks/{webhook_id}", tags=["Partners"])
def get_webhook(webhook_id: str, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return service.webhook_out(get_owned(db, Webhook, webhook_id, user, "Webhook"))


@router.patch("/partners/webhooks/{webhook_id}", tags=["Partners"])
def update_webhook(webhook_id: str, body: WebhookPatch, user: CurrentUser = Depends(_manage),
                   db: Session = Depends(get_db)):
    return service.webhook_out(service.update_webhook(db, user, webhook_id, body))


@router.delete("/partners/webhooks/{webhook_id}", tags=["Partners"])
def deactivate_webhook(webhook_id: str, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    """Webhooks are deactivated rather than deleted, so their delivery history is kept."""
    return service.webhook_out(service.update_webhook(db, user, webhook_id, WebhookPatch(is_active=False)))


@router.get("/partners/webhooks/{webhook_id}/deliveries", tags=["Partners"])
def webhook_deliveries(webhook_id: str, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return service.deliveries(db, user, webhook_id)


@router.get("/partners/events", tags=["Partners"])
def events(event: str | None = None, limit: int = 100, user: CurrentUser = Depends(require(P.MANAGE_PARTNERS, P.READ)),
           db: Session = Depends(get_db)):
    return service.recent_events(db, user, event, limit)


# ------------------------------------------------------------------ Partner API (X-API-Key)
@router.get("/partner/v1/projects", tags=["Partner API"])
def partner_projects(ctx: PartnerContext = Depends(partner_scope("read")), db: Session = Depends(get_db)):
    return service.partner_projects(db, ctx)


@router.get("/partner/v1/projects/{project_id}/results", tags=["Partner API"])
def partner_results(project_id: str, ctx: PartnerContext = Depends(partner_scope("read")),
                    db: Session = Depends(get_db)):
    return service.partner_results(db, ctx, project_id)


@router.post("/partner/v1/practices", status_code=201, tags=["Partner API"])
def partner_practice(body: PartnerPracticeIn, response: Response,
                     ctx: PartnerContext = Depends(partner_scope("write_practices")), db: Session = Depends(get_db)):
    rec, created = service.partner_practice(db, ctx, body)
    if not created:
        response.status_code = 200
    return {**service.practice_out(rec), "replayed": not created}


# ------------------------------------------------------------------ forecast & assistant
@router.get("/projects/{project_id}/forecast", tags=["Forecast"])
def forecast(project_id: str, years: int = 5, user: CurrentUser = Depends(require(P.READ)),
             db: Session = Depends(get_db)):
    return service.forecast(db, user, project_id, years)


@router.post("/assistant/ask", tags=["Assistant"])
def ask(body: AskIn, user: CurrentUser = Depends(require(P.READ, P.VERIFY)), db: Session = Depends(get_db)):
    return service.ask(db, user, body.question, body.run_id)
