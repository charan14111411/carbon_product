"""Agreement templates, farmer signatures and the consent ledger.

Consent is an append-only stream of events per farmer and purpose; the latest event
effective on a date decides whether consent is held on that date.
"""

from __future__ import annotations

import hashlib
import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.config import get_settings
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, ImmutableRecord, NotFound, ValidationFailed
from app.core.permissions import P
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.consent.models import CONSENT_PURPOSES, Agreement, AgreementTemplate, ConsentEvent
from app.modules.farmers.models import Farmer

DEMO_OTP = "123456"
_METHOD_CHANNEL = {"otp": "app", "esign": "app", "assisted": "field_officer"}


# ------------------------------------------------------------------ access
def farmer_for(db: Session, user: CurrentUser, farmer_id: str, staff_perms: tuple[P, ...]) -> Farmer:
    """The farmer, if the caller is staff with one of ``staff_perms`` or is that farmer (self-service)."""
    farmer = get_owned(db, Farmer, farmer_id, user, "Farmer")
    if any(user.can(p) for p in staff_perms):
        return farmer
    if user.can(P.FARMER_SELF) and str(user.scope.get("farmer_id")) == str(farmer.id):
        return farmer
    raise NotFound("Farmer not found.")


# ------------------------------------------------------------------ consent state
def _events(db: Session, org_id: uuid.UUID, farmer_id: uuid.UUID) -> list[ConsentEvent]:
    return list(db.scalars(
        select(ConsentEvent).where(ConsentEvent.org_id == org_id, ConsentEvent.farmer_id == farmer_id)
        .order_by(ConsentEvent.effective_on, ConsentEvent.created_at)
    ).all())


def _latest_by_purpose(events: list[ConsentEvent], on_date: date) -> dict[str, ConsentEvent]:
    latest: dict[str, ConsentEvent] = {}
    for ev in events:  # ordered oldest first, so later events overwrite
        if ev.effective_on <= on_date:
            latest[ev.purpose] = ev
    return latest


def has_consent(db: Session, org_id: uuid.UUID, farmer_id: uuid.UUID, purpose: str,
                on_date: date | None = None) -> bool:
    """True if the latest consent event for ``purpose`` effective on ``on_date`` (default today) is a grant."""
    ev = _latest_by_purpose(_events(db, org_id, farmer_id), on_date or date.today()).get(purpose)
    return bool(ev and ev.granted)


def current_state(db: Session, org_id: uuid.UUID, farmer_id: uuid.UUID,
                  on_date: date | None = None) -> list[dict[str, Any]]:
    latest = _latest_by_purpose(_events(db, org_id, farmer_id), on_date or date.today())
    out = []
    for purpose in CONSENT_PURPOSES:
        ev = latest.get(purpose)
        out.append({
            "purpose": purpose,
            "state": "not_given" if ev is None else ("granted" if ev.granted else "withdrawn"),
            "granted": bool(ev and ev.granted),
            "effective_on": ev.effective_on if ev else None,
            "event_id": str(ev.id) if ev else None,
            "agreement_id": str(ev.agreement_id) if ev and ev.agreement_id else None,
        })
    return out


def consents(db: Session, user: CurrentUser, farmer: Farmer) -> dict[str, Any]:
    history = _events(db, user.org_id, farmer.id)
    return {
        "farmer_id": str(farmer.id),
        "current": current_state(db, user.org_id, farmer.id),
        "history": list(reversed(history)),
    }


def record_consent(db: Session, user: CurrentUser, farmer: Farmer, *, purpose: str, granted: bool,
                   channel: str, notes: str = "", agreement_id: uuid.UUID | None = None) -> ConsentEvent:
    if purpose not in CONSENT_PURPOSES:
        raise ValidationFailed(f"Unknown consent purpose. Use one of: {', '.join(CONSENT_PURPOSES)}.")
    ev = ConsentEvent(org_id=user.org_id, created_by=user.id, farmer_id=farmer.id, purpose=purpose,
                      granted=granted, effective_on=date.today(), agreement_id=agreement_id,
                      channel=channel, notes=notes)
    db.add(ev)
    audit(db, user, "consent.granted" if granted else "consent.withdrawn", ev, reason=notes or None)
    return ev


# ------------------------------------------------------------------ templates
def _programme_id(db: Session, user: CurrentUser, value: str | None) -> uuid.UUID | None:
    if value is None:
        return None
    from app.modules.programmes.models import Programme

    return get_owned(db, Programme, value, user, "Programme").id


def list_templates(db: Session, user: CurrentUser, code: str | None = None,
                   status: str | None = None) -> list[AgreementTemplate]:
    q = scoped(AgreementTemplate, user).order_by(AgreementTemplate.code, AgreementTemplate.version.desc())
    if code:
        q = q.where(AgreementTemplate.code == code)
    if status:
        q = q.where(AgreementTemplate.status == status)
    return list(db.scalars(q).all())


def create_template(db: Session, user: CurrentUser, data: dict[str, Any]) -> AgreementTemplate:
    if db.scalar(scoped(AgreementTemplate, user).where(AgreementTemplate.code == data["code"])):
        raise Conflict(f"An agreement with the code '{data['code']}' already exists. "
                       "Create a new version of it instead.",
                       code="DUPLICATE_CODE")
    data["programme_id"] = _programme_id(db, user, data.get("programme_id"))
    t = AgreementTemplate(org_id=user.org_id, created_by=user.id, version=1, status="draft", **data)
    db.add(t)
    audit(db, user, "agreement_template.create", t)
    return t


def _refuse_if_published(t: AgreementTemplate) -> None:
    if t.status != "draft":
        raise ImmutableRecord("This agreement has been published and can't be changed. Create a new version instead.")


def update_template(db: Session, user: CurrentUser, template_id: str, changes: dict[str, Any]) -> AgreementTemplate:
    t = get_owned(db, AgreementTemplate, template_id, user, "Agreement")
    _refuse_if_published(t)
    before = snapshot(t)
    if "programme_id" in changes:
        changes["programme_id"] = _programme_id(db, user, changes["programme_id"])
    for k, v in changes.items():
        if v is None and k != "programme_id":
            continue
        setattr(t, k, v)
    audit(db, user, "agreement_template.update", t, before=before)
    return t


def publish_template(db: Session, user: CurrentUser, template_id: str) -> AgreementTemplate:
    t = get_owned(db, AgreementTemplate, template_id, user, "Agreement")
    _refuse_if_published(t)
    for old in db.scalars(scoped(AgreementTemplate, user).where(
        AgreementTemplate.code == t.code, AgreementTemplate.status == "published", AgreementTemplate.id != t.id,
    )).all():
        before = snapshot(old)
        old.status = "retired"
        audit(db, user, "agreement_template.retire", old, before=before, reason=f"Replaced by version {t.version}")
    before = snapshot(t)
    t.status = "published"
    audit(db, user, "agreement_template.publish", t, before=before)
    return t


def new_template_version(db: Session, user: CurrentUser, template_id: str) -> AgreementTemplate:
    src = get_owned(db, AgreementTemplate, template_id, user, "Agreement")
    draft = db.scalar(scoped(AgreementTemplate, user).where(
        AgreementTemplate.code == src.code, AgreementTemplate.status == "draft"))
    if draft:
        raise Conflict(f"Version {draft.version} of this agreement is still a draft. Edit or publish it first.",
                       code="DRAFT_EXISTS", details={"template_id": str(draft.id)})
    top = db.scalar(select(func.max(AgreementTemplate.version)).where(
        AgreementTemplate.org_id == user.org_id, AgreementTemplate.code == src.code)) or 0
    t = AgreementTemplate(
        org_id=user.org_id, created_by=user.id, programme_id=src.programme_id, code=src.code, version=top + 1,
        title=src.title, body=dict(src.body), purposes=list(src.purposes), status="draft",
    )
    db.add(t)
    audit(db, user, "agreement_template.new_version", t, reason=f"Copied from version {src.version}")
    return t


# ------------------------------------------------------------------ signing
def _check_otp(code: str | None) -> None:
    if get_settings().is_production:
        raise ValidationFailed("OTP signing isn't connected to an SMS provider yet. Use e-sign or assisted signing.",
                               code="OTP_UNAVAILABLE")
    if (code or "").strip() != DEMO_OTP:
        raise ValidationFailed("That code didn't work. Check the SMS and try again.", code="OTP_INVALID")


def sign_agreement(db: Session, user: CurrentUser, farmer: Farmer, *, template_id: str, language: str,
                   method: str, otp_code: str | None) -> tuple[Agreement, list[ConsentEvent]]:
    if farmer.status != "active":
        raise Blocked("Only active farmers can sign an agreement.")
    t = get_owned(db, AgreementTemplate, template_id, user, "Agreement")
    if t.status != "published":
        raise Blocked("Only a published agreement can be signed.")
    text = (t.body or {}).get(language)
    if not text:
        raise ValidationFailed(f"This agreement isn't available in '{language}'. "
                               f"Available: {', '.join(sorted(t.body or {}))}.", code="LANGUAGE_UNAVAILABLE")
    if method == "otp":
        _check_otp(otp_code)
    witness = None
    if method == "assisted":
        if not user.can(P.MANAGE_FARMERS):
            raise ValidationFailed("Assisted signing must be witnessed by a staff member.")
        witness = user.id

    agreement = Agreement(
        org_id=user.org_id, created_by=user.id, farmer_id=farmer.id, template_id=t.id,
        template_version=t.version, language=language, signed_at=utcnow(), method=method,
        signed_text_sha256=hashlib.sha256(text.encode("utf-8")).hexdigest(), witness_user_id=witness,
    )
    db.add(agreement)
    audit(db, user, "agreement.sign", agreement)
    events = [
        record_consent(db, user, farmer, purpose=p, granted=True, channel=_METHOD_CHANNEL[method],
                       notes=f"Signed {t.code} v{t.version}", agreement_id=agreement.id)
        for p in t.purposes
    ]
    return agreement, events


def list_agreements(db: Session, user: CurrentUser, farmer: Farmer) -> list[Agreement]:
    return list(db.scalars(
        scoped(Agreement, user).where(Agreement.farmer_id == farmer.id).order_by(Agreement.signed_at.desc())
    ).all())
