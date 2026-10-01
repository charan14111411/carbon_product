"""Notification templates, the outbox, the domain-event consumer and inbound farmer messages.

* Templates are versioned per (code, channel, language); only approved versions are used.
* A farmer is only messaged when their latest ``data_use`` consent is a grant. Otherwise the
  notification is stored as ``skipped`` (reason ``NO_CONSENT``) with no text, as proof it was not sent.
* ``dispatch_events`` reads the domain-event outbox and marks each handled event in
  ``processed_events``, so running it again sends nothing twice.
* Inbound WhatsApp/SMS commands never write practice records directly: a ``PRACTICE`` report waits
  for staff review, and ``HELP`` opens a grievance through the risk service.
"""

from __future__ import annotations

import re
import string
import uuid
from collections import Counter
from datetime import date, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, Forbidden, IllegalTransition, RuleMissing, ValidationFailed
from app.core.permissions import P
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.catalogue.service import get_practice_type
from app.modules.consent.service import has_consent
from app.modules.farmers.models import Farmer
from app.modules.identity.models import AuditEntry, User
from app.modules.land.models import Farm, Field
from app.modules.notifications.models import (
    DeliveryAttempt, InboundMessage, Notification, NotificationTemplate, ProcessedEvent,
)
from app.modules.notifications.providers import get_messaging_provider
from app.modules.notifications.schemas import InboundIn, ReviewIn, SendIn, TemplateIn, TemplatePatch
from app.modules.partners.models import DomainEvent
from app.modules.portfolio.masking import mask_phone

CONSUMER = "notifications"
CONSENT_PURPOSE = "data_use"
CHANNELS = ("sms", "whatsapp", "ivr", "email")
EVENT_TEMPLATES = {"payout.completed": "payment_statement", "farmer.enrolled": "welcome",
                   "practice.recorded": "practice_thanks"}

DEFAULT_TEXT = {
    "welcome": {
        "en": "Namaste {farmer_name}! You are now enrolled in {project_name} with field {field_code} "
              "({area_ha} ha). Send HELP and your question at any time.",
        "kn": "ನಮಸ್ಕಾರ {farmer_name}! ನಿಮ್ಮ ಹೊಲ {field_code} ({area_ha} ಹೆಕ್ಟೇರ್) ಜೊತೆಗೆ ನೀವು {project_name} "
              "ಯೋಜನೆಗೆ ಸೇರಿದ್ದೀರಿ. ಸಹಾಯಕ್ಕಾಗಿ ಯಾವಾಗ ಬೇಕಾದರೂ HELP ಮತ್ತು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕಳುಹಿಸಿ.",
    },
    "payment_statement": {
        "en": "Dear {farmer_name}, {amount} {currency} has been paid to you for carbon batch {batch_code} "
              "(reference {provider_ref}, {paid_on}).",
        "kn": "ಆತ್ಮೀಯ {farmer_name}, ಕಾರ್ಬನ್ ಬ್ಯಾಚ್ {batch_code} ಗಾಗಿ ನಿಮಗೆ {amount} {currency} ಪಾವತಿಸಲಾಗಿದೆ "
              "(ಉಲ್ಲೇಖ {provider_ref}, {paid_on}).",
    },
    "practice_thanks": {
        "en": "Thank you {farmer_name}. We have recorded {practice_name} on {performed_on}.",
        "kn": "ಧನ್ಯವಾದಗಳು {farmer_name}. {performed_on} ರಂದು {practice_name} ದಾಖಲಿಸಲಾಗಿದೆ.",
    },
}
DEFAULT_CHANNELS = ("sms", "whatsapp")
_PLACEHOLDER = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


# ------------------------------------------------------------------ rendering
def placeholders(body: str) -> list[str]:
    try:
        parts = list(string.Formatter().parse(body))
    except ValueError as exc:
        raise ValidationFailed("The message has an unmatched { or }. Use {name} for placeholders.",
                               code="INVALID_TEMPLATE") from exc
    names = []
    for _, name, spec, conv in parts:
        if name is None:
            continue
        if not _PLACEHOLDER.match(name) or spec or conv:
            raise ValidationFailed(f"'{{{name}}}' is not a valid placeholder. Use simple names like {{farmer_name}}.",
                                   code="INVALID_TEMPLATE")
        if name not in names:
            names.append(name)
    return names


def render(body: str, context: dict[str, Any]) -> str:
    names = placeholders(body)
    missing = [n for n in names if context.get(n) in (None, "")]
    if missing:
        raise ValidationFailed(f"Missing values for: {', '.join(missing)}.", code="MISSING_PLACEHOLDER",
                               details={"missing": missing})
    return body.format_map({n: str(context[n]) for n in names})


# ------------------------------------------------------------------ templates
def template_out(t: NotificationTemplate) -> dict[str, Any]:
    return {"id": str(t.id), "code": t.code, "channel": t.channel, "language": t.language, "version": t.version,
            "subject": t.subject, "body": t.body, "placeholders": t.placeholders or [], "status": t.status,
            "is_default": t.is_default, "approved_by": str(t.approved_by) if t.approved_by else None,
            "approved_at": t.approved_at.isoformat() if t.approved_at else None, "notes": t.notes,
            "created_by": str(t.created_by) if t.created_by else None, "created_at": t.created_at.isoformat()}


def _next_version(db: Session, org_id: uuid.UUID, code: str, channel: str, language: str) -> int:
    return (db.scalar(select(func.max(NotificationTemplate.version)).where(
        NotificationTemplate.org_id == org_id, NotificationTemplate.code == code,
        NotificationTemplate.channel == channel, NotificationTemplate.language == language)) or 0) + 1


def create_template(db: Session, user: CurrentUser, body: TemplateIn) -> NotificationTemplate:
    names = placeholders(body.body)
    t = NotificationTemplate(org_id=user.org_id, created_by=user.id, code=body.code, channel=body.channel,
                             language=body.language, version=_next_version(db, user.org_id, body.code, body.channel,
                                                                           body.language),
                             subject=body.subject, body=body.body, placeholders=names, status="draft",
                             notes=body.notes)
    db.add(t)
    audit(db, user, "notification_template.create", t)
    return t


def update_template(db: Session, user: CurrentUser, template_id: str, body: TemplatePatch) -> NotificationTemplate:
    t = get_owned(db, NotificationTemplate, template_id, user, "Template")
    if t.status != "draft":
        raise IllegalTransition("Approved templates are frozen. Create a new version instead.", code="TEMPLATE_FROZEN")
    before = snapshot(t)
    if body.body is not None:
        t.body, t.placeholders = body.body, placeholders(body.body)
    if body.subject is not None:
        t.subject = body.subject
    if body.notes is not None:
        t.notes = body.notes
    t.updated_at = utcnow()
    audit(db, user, "notification_template.update", t, before=before)
    return t


def approve_template(db: Session, user: CurrentUser, template_id: str) -> NotificationTemplate:
    t = get_owned(db, NotificationTemplate, template_id, user, "Template")
    if t.status != "draft":
        raise IllegalTransition(f"Only a draft template can be approved; this one is {t.status}.")
    editors = db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == user.org_id, AuditEntry.entity_id == str(t.id),
        AuditEntry.action == "notification_template.update")).all()
    ensure_not_author(user.id, t.created_by, *editors, what="a message template")
    for prev in db.scalars(scoped(NotificationTemplate, user).where(
            NotificationTemplate.code == t.code, NotificationTemplate.channel == t.channel,
            NotificationTemplate.language == t.language, NotificationTemplate.status == "approved")).all():
        pb = snapshot(prev)
        prev.status = "retired"
        audit(db, user, "notification_template.retire", prev, before=pb, reason=f"Replaced by version {t.version}")
    before = snapshot(t)
    t.status, t.approved_by, t.approved_at = "approved", user.id, utcnow()
    audit(db, user, "notification_template.approve", t, before=before)
    return t


def install_defaults(db: Session, user: CurrentUser) -> dict[str, Any]:
    """Install the platform's default English and Kannada texts where the org has no template yet."""
    created = []
    for code, texts in DEFAULT_TEXT.items():
        for channel in DEFAULT_CHANNELS:
            for language, text in texts.items():
                exists = db.scalar(scoped(NotificationTemplate, user).where(
                    NotificationTemplate.code == code, NotificationTemplate.channel == channel,
                    NotificationTemplate.language == language))
                if exists:
                    continue
                t = NotificationTemplate(org_id=user.org_id, created_by=user.id, code=code, channel=channel,
                                         language=language, version=1, body=text, placeholders=placeholders(text),
                                         status="approved", approved_at=utcnow(), is_default=True,
                                         notes="Platform default text. Review the wording (especially translations) "
                                               "and approve a new version if it needs changing.")
                db.add(t)
                audit(db, user, "notification_template.install_default", t)
                created.append(t)
    return {"installed": len(created), "templates": [template_out(t) for t in created]}


def active_template(db: Session, org_id: uuid.UUID, code: str, channel: str,
                    language: str | None) -> NotificationTemplate | None:
    for lang in [x for x in (language, "en") if x]:
        t = db.scalars(select(NotificationTemplate).where(
            NotificationTemplate.org_id == org_id, NotificationTemplate.code == code,
            NotificationTemplate.channel == channel, NotificationTemplate.language == lang,
            NotificationTemplate.status == "approved").order_by(NotificationTemplate.version.desc())).first()
        if t:
            return t
    return None


# ------------------------------------------------------------------ outbox
def notification_out(n: Notification) -> dict[str, Any]:
    return {"id": str(n.id), "farmer_id": str(n.farmer_id) if n.farmer_id else None,
            "user_id": str(n.user_id) if n.user_id else None, "channel": n.channel,
            "address": mask_phone(n.address) if n.channel != "email" else n.address, "language": n.language,
            "template_code": n.template_code, "template_version": n.template_version, "trigger": n.trigger,
            "event_id": str(n.event_id) if n.event_id else None, "subject": n.subject, "body": n.body,
            "status": n.status, "skip_reason": n.skip_reason, "provider": n.provider, "provider_ref": n.provider_ref,
            "attempts": n.attempts, "last_error": n.last_error,
            "sent_at": n.sent_at.isoformat() if n.sent_at else None,
            "delivered_at": n.delivered_at.isoformat() if n.delivered_at else None,
            "created_at": n.created_at.isoformat()}


def _deliver(db: Session, n: Notification) -> None:
    provider = get_messaging_provider()
    n.attempts = (n.attempts or 0) + 1
    res = provider.send(channel=n.channel, to=n.address or "", body=n.body, subject=n.subject,
                        idempotency_key=str(n.id))
    db.add(DeliveryAttempt(org_id=n.org_id, created_by=n.created_by, notification_id=n.id, attempt=n.attempts,
                           provider=provider.name, ok=res.ok, status=res.status, provider_ref=res.provider_ref,
                           error=res.reason))
    n.provider = provider.name
    if res.ok:
        n.status, n.provider_ref, n.last_error, n.sent_at = res.status, res.provider_ref, None, utcnow()
        if res.status == "delivered":
            n.delivered_at = n.sent_at
    else:
        n.status, n.last_error = "failed", res.reason


def _address(channel: str, farmer: Farmer | None, user: User | None) -> str | None:
    if farmer is not None:
        return (farmer.meta or {}).get("email") if channel == "email" else farmer.phone
    if user is not None:
        return user.email if channel == "email" else user.phone
    return None


def notify(db: Session, org_id: uuid.UUID, actor: CurrentUser | None, trigger: str, farmer_id: uuid.UUID,
           context: dict[str, Any], *, template_code: str | None = None, channel: str | None = None,
           event_id: uuid.UUID | None = None) -> Notification | None:
    """Queue and send one templated message to a farmer, honouring consent. Never raises for
    missing consent, template or placeholders: the outcome is recorded on the notification."""
    farmer = db.get(Farmer, farmer_id)
    if farmer is None or farmer.org_id != org_id:
        return None
    code = template_code or EVENT_TEMPLATES.get(trigger)
    channel = channel or (farmer.meta or {}).get("preferred_channel") or "sms"
    if channel not in CHANNELS:
        channel = "sms"
    ctx = {"farmer_name": farmer.full_name, "farmer_code": farmer.code, **context}
    n = Notification(org_id=org_id, created_by=actor.id if actor else None, farmer_id=farmer.id, channel=channel,
                     address=_address(channel, farmer, None), language=farmer.language, template_code=code,
                     trigger=trigger, event_id=event_id, context=_plain_ctx(context), status="queued")
    db.add(n)
    if not has_consent(db, org_id, farmer.id, CONSENT_PURPOSE):
        n.status, n.skip_reason, n.address = "skipped", "NO_CONSENT", None
    elif not n.address:
        n.status, n.skip_reason = "skipped", "NO_ADDRESS"
    else:
        t = active_template(db, org_id, code, channel, farmer.language) if code else None
        if t is None:
            n.status, n.skip_reason = "skipped", "TEMPLATE_MISSING"
        else:
            n.template_id, n.template_version, n.language, n.subject = t.id, t.version, t.language, t.subject
            try:
                n.body = render(t.body, ctx)
            except ValidationFailed as exc:
                n.status, n.last_error = "failed", exc.message
    db.flush()
    if n.status == "queued":
        _deliver(db, n)
    audit(db, actor, "notification.create", n, org_id=org_id)
    return n


def _plain_ctx(ctx: dict[str, Any]) -> dict[str, Any]:
    return {k: (v.isoformat() if isinstance(v, (date, datetime)) else v if isinstance(v, (int, float, bool)) or v is None
                else str(v)) for k, v in ctx.items()}


def send_manual(db: Session, user: CurrentUser, body: SendIn) -> Notification:
    farmer = get_owned(db, Farmer, body.farmer_id, user, "Farmer") if body.farmer_id else None
    target = get_owned(db, User, body.user_id, user, "User") if body.user_id else None
    if farmer is not None and not has_consent(db, user.org_id, farmer.id, CONSENT_PURPOSE):
        raise Blocked("This farmer has not given consent for us to contact them (data use).", code="NO_CONSENT")
    address = _address(body.channel, farmer, target)
    if not address:
        raise ValidationFailed(f"There is no {'email address' if body.channel == 'email' else 'phone number'} "
                               "for this recipient.", code="NO_ADDRESS")
    language = body.language or (farmer.language if farmer else target.language)
    ctx = dict(body.context)
    if farmer is not None:
        ctx.setdefault("farmer_name", farmer.full_name)
        ctx.setdefault("farmer_code", farmer.code)
    t = None
    if body.template_code:
        t = active_template(db, user.org_id, body.template_code, body.channel, language)
        if t is None:
            raise RuleMissing(f"There is no approved '{body.template_code}' template for {body.channel}.",
                              code="TEMPLATE_MISSING")
        text, subject = render(t.body, ctx), t.subject
    else:
        text, subject = render(body.body, ctx), body.subject
    n = Notification(org_id=user.org_id, created_by=user.id, farmer_id=farmer.id if farmer else None,
                     user_id=target.id if target else None, channel=body.channel, address=address,
                     language=t.language if t else language, template_id=t.id if t else None,
                     template_code=t.code if t else None, template_version=t.version if t else None,
                     trigger="manual", subject=subject, body=text, context=_plain_ctx(body.context), status="queued")
    db.add(n)
    db.flush()
    _deliver(db, n)
    audit(db, user, "notification.send", n)
    return n


def retry(db: Session, user: CurrentUser, notification_id: str) -> Notification:
    n = get_owned(db, Notification, notification_id, user, "Notification")
    if n.status != "failed" or not n.body:
        raise IllegalTransition("Only a failed message with text can be retried.")
    if n.farmer_id and not has_consent(db, user.org_id, n.farmer_id, CONSENT_PURPOSE):
        raise Blocked("This farmer has withdrawn consent to be contacted.", code="NO_CONSENT")
    before = snapshot(n)
    _deliver(db, n)
    audit(db, user, "notification.retry", n, before=before)
    return n


def list_notifications(db: Session, user: CurrentUser, *, status: str | None, channel: str | None,
                       farmer_id: str | None, trigger: str | None, template_code: str | None,
                       limit: int = 200) -> list[Notification]:
    q = scoped(Notification, user).order_by(Notification.created_at.desc()).limit(min(max(limit, 1), 1000))
    if farmer_id:
        q = q.where(Notification.farmer_id == get_owned(db, Farmer, farmer_id, user, "Farmer").id)
    for col, v in ((Notification.status, status), (Notification.channel, channel), (Notification.trigger, trigger),
                   (Notification.template_code, template_code)):
        if v:
            q = q.where(col == v)
    return list(db.scalars(q).all())


# ------------------------------------------------------------------ event consumer
def _uuid(v: Any) -> uuid.UUID | None:
    try:
        return uuid.UUID(str(v))
    except (TypeError, ValueError):
        return None


def _on_payout(db: Session, user: CurrentUser, ev: DomainEvent) -> list[Notification]:
    from app.modules.payments.models import BenefitPool, Payout, PayoutBatch

    batch = db.get(PayoutBatch, _uuid(ev.entity_id))
    if batch is None:
        return []
    pool = db.get(BenefitPool, batch.pool_id)
    ids = {_uuid(x) for x in (ev.payload or {}).get("payout_ids") or []}
    q = select(Payout).where(Payout.batch_id == batch.id, Payout.status == "paid")
    out = []
    for p in db.scalars(q.order_by(Payout.farmer_id)).all():
        if ids and p.id not in ids:
            continue
        n = notify(db, user.org_id, user, ev.event, p.farmer_id, {
            "amount": f"{Decimal(str(p.amount)):.2f}",
            "currency": pool.currency if pool else "INR", "batch_code": batch.code,
            "provider_ref": p.provider_ref, "paid_on": p.paid_at.date().isoformat() if p.paid_at else ""},
            event_id=ev.id)
        if n:
            out.append(n)
    return out


def _on_enrolled(db: Session, user: CurrentUser, ev: DomainEvent) -> list[Notification]:
    from app.modules.programmes.models import Project

    pl = ev.payload or {}
    project = db.get(Project, _uuid(pl.get("project_id")))
    fld = db.get(Field, _uuid(pl.get("field_id")))
    fid = _uuid(pl.get("farmer_id"))
    if fid is None:
        return []
    n = notify(db, user.org_id, user, ev.event, fid, {
        "project_name": project.name if project else "", "field_code": fld.code if fld else "",
        "area_ha": f"{float(pl.get('area_ha') or (fld.area_ha if fld else 0)):.2f}"}, event_id=ev.id)
    return [n] if n else []


def _on_practice(db: Session, user: CurrentUser, ev: DomainEvent) -> list[Notification]:
    from app.modules.practices.models import PracticeRecord

    rec = db.get(PracticeRecord, _uuid(ev.entity_id))
    if rec is None or rec.version != 1 or rec.status != "active":
        return []  # thank farmers for new records only, not corrections or voids
    fld = db.get(Field, rec.field_id)
    farm = db.get(Farm, fld.farm_id) if fld else None
    if farm is None:
        return []
    pt = get_practice_type(db, rec.org_id, rec.practice_code)
    n = notify(db, user.org_id, user, ev.event, farm.farmer_id, {
        "practice_name": pt.name if pt else rec.practice_code, "practice_code": rec.practice_code,
        "performed_on": rec.performed_on.isoformat(), "field_code": fld.code}, event_id=ev.id)
    return [n] if n else []


HANDLERS = {"payout.completed": _on_payout, "farmer.enrolled": _on_enrolled, "practice.recorded": _on_practice}


def dispatch_events(db: Session, user: CurrentUser, limit: int = 500) -> dict[str, Any]:
    done = select(ProcessedEvent.event_id).where(ProcessedEvent.consumer == CONSUMER,
                                                 ProcessedEvent.org_id == user.org_id)
    events = db.scalars(select(DomainEvent).where(
        DomainEvent.org_id == user.org_id, DomainEvent.event.in_(list(HANDLERS)), DomainEvent.id.not_in(done))
        .order_by(DomainEvent.created_at).limit(min(max(limit, 1), 5000))).all()
    statuses: Counter = Counter()
    for ev in events:
        sent = HANDLERS[ev.event](db, user, ev)
        c = Counter(n.status for n in sent)
        statuses.update(c)
        db.add(ProcessedEvent(org_id=user.org_id, created_by=user.id, consumer=CONSUMER, event_id=ev.id,
                              outcome={"notifications": len(sent), "statuses": dict(c)}))
        db.flush()
    return {"events_processed": len(events), "notifications": sum(statuses.values()),
            "by_status": dict(statuses)}


# ------------------------------------------------------------------ inbound messages
def _normalise_phone(phone: str) -> str:
    p = re.sub(r"[\s\-()]", "", phone)
    return p if p.startswith("+") else "+" + p


def _parse_date(s: str) -> date | None:
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def parse_command(text: str) -> dict[str, Any]:
    """``PRACTICE <code> <date> [quantity]`` or ``HELP <message>``. Returns {command, ...} or {error}."""
    t = text.strip()
    head, _, rest = t.partition(" ")
    cmd = head.upper()
    if cmd == "PRACTICE":
        parts = rest.split()
        if len(parts) < 2:
            return {"command": cmd, "error": "Send: PRACTICE <practice code> <date, e.g. 2025-06-01>."}
        on = _parse_date(parts[1])
        if on is None:
            return {"command": cmd, "error": f"'{parts[1]}' is not a date. Use YYYY-MM-DD."}
        if on > date.today():
            return {"command": cmd, "error": "The date can't be in the future."}
        out: dict[str, Any] = {"command": cmd, "practice_code": parts[0].lower(), "performed_on": on.isoformat()}
        if len(parts) >= 3:
            try:
                out["quantity"] = float(parts[2])
            except ValueError:
                return {"command": cmd, "error": f"'{parts[2]}' is not a number."}
        return out
    if cmd == "HELP":
        if len(rest.strip()) < 3:
            return {"command": cmd, "error": "Write your question after HELP."}
        return {"command": cmd, "message": rest.strip()}
    return {"command": None, "error": "Unknown command. Send PRACTICE <code> <date> or HELP <message>."}


def inbound_out(m: InboundMessage) -> dict[str, Any]:
    return {"id": str(m.id), "channel": m.channel, "phone": mask_phone(m.phone),
            "farmer_id": str(m.farmer_id) if m.farmer_id else None, "text": m.text, "command": m.command,
            "parsed": m.parsed or {}, "status": m.status, "error": m.error,
            "grievance_id": str(m.grievance_id) if m.grievance_id else None,
            "practice_record_id": str(m.practice_record_id) if m.practice_record_id else None,
            "reviewed_by": str(m.reviewed_by) if m.reviewed_by else None, "review_note": m.review_note,
            "created_at": m.created_at.isoformat()}


def receive_inbound(db: Session, user: CurrentUser, body: InboundIn) -> InboundMessage:
    phone = _normalise_phone(body.phone)
    farmer = db.scalar(scoped(Farmer, user).where(Farmer.phone == phone))
    parsed = parse_command(body.text)
    m = InboundMessage(org_id=user.org_id, created_by=user.id, channel=body.channel, phone=phone,
                       farmer_id=farmer.id if farmer else None, text=body.text, command=parsed.get("command"),
                       parsed={k: v for k, v in parsed.items() if k not in ("command", "error")},
                       status="unrecognised", error=parsed.get("error"))
    db.add(m)
    if not parsed.get("error"):
        if parsed["command"] == "PRACTICE":
            if farmer is None:
                m.status, m.error = "unmatched", "No farmer is registered with this phone number."
            else:
                pt = get_practice_type(db, user.org_id, parsed["practice_code"])
                m.parsed = {**m.parsed, "known_practice": bool(pt and pt.is_active)}
                fields = db.scalars(select(Field).join(Farm, Farm.id == Field.farm_id).where(
                    Farm.farmer_id == farmer.id, Field.org_id == user.org_id, Field.status == "active")).all()
                if len(fields) == 1:
                    m.parsed = {**m.parsed, "suggested_field_id": str(fields[0].id)}
                m.status = "pending_review"
        elif parsed["command"] == "HELP":
            from app.modules.risk import service as risk_service
            from app.modules.risk.schemas import GrievanceIn

            if not (user.can(P.HANDLE_GRIEVANCE) or user.can(P.MANAGE_RISK)):
                raise Forbidden("You don't have permission to open grievances.")
            who = f"farmer {farmer.code}" if farmer else f"unregistered number {mask_phone(phone)}"
            g = risk_service.create_grievance(db, user, GrievanceIn(
                farmer_id=str(farmer.id) if farmer else None, category="other",
                subject="Help request received by message",
                description=f"Message from {who} via {body.channel}: {parsed['message']}", channel=body.channel))
            m.status, m.grievance_id = "processed", g.id
    db.flush()
    audit(db, user, "inbound_message.receive", m)
    return m


def review_inbound(db: Session, user: CurrentUser, message_id: str, body: ReviewIn) -> InboundMessage:
    from app.modules.practices import service as practice_service

    m = get_owned(db, InboundMessage, message_id, user, "Message")
    if m.status != "pending_review":
        raise IllegalTransition(f"This message is {m.status.replace('_', ' ')}, not waiting for review.")
    before = snapshot(m)
    if body.decision == "reject":
        if not body.note.strip():
            raise ValidationFailed("Say why the report is rejected.", code="NOTE_REQUIRED")
        m.status = "rejected"
    else:
        field_id = body.field_id or (m.parsed or {}).get("suggested_field_id")
        if not field_id:
            raise ValidationFailed("Choose the field this practice was done on.", code="FIELD_REQUIRED")
        fld = get_owned(db, Field, field_id, user, "Field")
        farm = db.get(Farm, fld.farm_id)
        if farm is None or farm.farmer_id != m.farmer_id:
            raise ValidationFailed("That field doesn't belong to the farmer who sent the message.",
                                   code="FIELD_NOT_FARMERS")
        rec, _ = practice_service.create(db, user, {
            "field_id": str(fld.id), "practice_code": m.parsed["practice_code"], "scenario": "project",
            "performed_on": date.fromisoformat(m.parsed["performed_on"]),
            "quantity": body.quantity if body.quantity is not None else m.parsed.get("quantity"),
            "unit": body.unit, "source": "whatsapp", "client_ref": f"inbound-{m.id}"})
        m.status, m.practice_record_id = "accepted", rec.record_id
    m.reviewed_by, m.reviewed_at, m.review_note = user.id, utcnow(), body.note or None
    audit(db, user, "inbound_message.review", m, before=before)
    return m


def list_inbound(db: Session, user: CurrentUser, status: str | None) -> list[InboundMessage]:
    q = scoped(InboundMessage, user).order_by(InboundMessage.created_at.desc())
    if status:
        q = q.where(InboundMessage.status == status)
    return list(db.scalars(q).all())


def get_template(db: Session, user: CurrentUser, template_id: str) -> NotificationTemplate:
    return get_owned(db, NotificationTemplate, template_id, user, "Template")


def list_templates(db: Session, user: CurrentUser, code: str | None, status: str | None) -> list[NotificationTemplate]:
    q = scoped(NotificationTemplate, user).order_by(NotificationTemplate.code, NotificationTemplate.channel,
                                                    NotificationTemplate.language, NotificationTemplate.version)
    if code:
        q = q.where(NotificationTemplate.code == code)
    if status:
        q = q.where(NotificationTemplate.status == status)
    return list(db.scalars(q).all())

