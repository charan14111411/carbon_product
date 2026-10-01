from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.notifications import service
from app.modules.notifications.models import Notification
from app.modules.notifications.schemas import InboundIn, ReviewIn, SendIn, TemplateIn, TemplatePatch

router = APIRouter(tags=["Notifications"])
_templates = require(P.MANAGE_PROGRAMMES)
_outbox = require(P.MANAGE_FARMERS, P.MANAGE_PROGRAMMES)
_send = require(P.MANAGE_FARMERS)


# ------------------------------------------------------------------ templates
@router.get("/notifications/templates")
def list_templates(code: str | None = None, status: str | None = None, user: CurrentUser = Depends(_outbox),
                   db: Session = Depends(get_db)):
    return [service.template_out(t) for t in service.list_templates(db, user, code, status)]


@router.post("/notifications/templates", status_code=201)
def create_template(body: TemplateIn, user: CurrentUser = Depends(_templates), db: Session = Depends(get_db)):
    return service.template_out(service.create_template(db, user, body))


@router.post("/notifications/templates/install-defaults")
def install_defaults(user: CurrentUser = Depends(_templates), db: Session = Depends(get_db)):
    return service.install_defaults(db, user)


@router.get("/notifications/templates/{template_id}")
def get_template(template_id: str, user: CurrentUser = Depends(_outbox), db: Session = Depends(get_db)):
    return service.template_out(service.get_template(db, user, template_id))


@router.patch("/notifications/templates/{template_id}")
def update_template(template_id: str, body: TemplatePatch, user: CurrentUser = Depends(_templates),
                    db: Session = Depends(get_db)):
    return service.template_out(service.update_template(db, user, template_id, body))


@router.post("/notifications/templates/{template_id}/approve")
def approve_template(template_id: str, user: CurrentUser = Depends(_templates), db: Session = Depends(get_db)):
    return service.template_out(service.approve_template(db, user, template_id))


# ------------------------------------------------------------------ outbox
@router.post("/notifications/send", status_code=201)
def send(body: SendIn, user: CurrentUser = Depends(_send), db: Session = Depends(get_db)):
    return service.notification_out(service.send_manual(db, user, body))


@router.post("/notifications/dispatch-events")
def dispatch(limit: int = 500, user: CurrentUser = Depends(_outbox), db: Session = Depends(get_db)):
    return service.dispatch_events(db, user, limit)


# ------------------------------------------------------------------ inbound
@router.post("/notifications/inbound", status_code=201)
def inbound(body: InboundIn, user: CurrentUser = Depends(require(P.MANAGE_FARMERS, P.HANDLE_GRIEVANCE)),
            db: Session = Depends(get_db)):
    return service.inbound_out(service.receive_inbound(db, user, body))


@router.get("/notifications/inbound")
def list_inbound(status: str | None = None, user: CurrentUser = Depends(require(P.MANAGE_FARMERS, P.RECORD_PRACTICE,
                                                                                  P.HANDLE_GRIEVANCE)),
                 db: Session = Depends(get_db)):
    return [service.inbound_out(m) for m in service.list_inbound(db, user, status)]


@router.post("/notifications/inbound/{message_id}/review")
def review_inbound(message_id: str, body: ReviewIn, user: CurrentUser = Depends(require(P.RECORD_PRACTICE)),
                   db: Session = Depends(get_db)):
    return service.inbound_out(service.review_inbound(db, user, message_id, body))


@router.get("/notifications")
def list_notifications(status: str | None = None, channel: str | None = None, farmer_id: str | None = None,
                       trigger: str | None = None, template_code: str | None = None, limit: int = 200,
                       user: CurrentUser = Depends(_outbox), db: Session = Depends(get_db)):
    rows = service.list_notifications(db, user, status=status, channel=channel, farmer_id=farmer_id,
                                      trigger=trigger, template_code=template_code, limit=limit)
    return [service.notification_out(n) for n in rows]


@router.get("/notifications/{notification_id}")
def get_notification(notification_id: str, user: CurrentUser = Depends(_outbox), db: Session = Depends(get_db)):
    return service.notification_out(get_owned(db, Notification, notification_id, user, "Notification"))


@router.post("/notifications/{notification_id}/retry")
def retry(notification_id: str, user: CurrentUser = Depends(_send), db: Session = Depends(get_db)):
    return service.notification_out(service.retry(db, user, notification_id))
