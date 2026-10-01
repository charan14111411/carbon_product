"""Buyer offers and offtake agreements.

An offer does not reserve credits (a sale does); availability is checked when the offer is created
and again when it is accepted. An agreement's deliveries are the sales whose ``contract_ref`` is the
agreement code (read-only link; sales stay owned by the credits module).
"""

from __future__ import annotations

import uuid
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, ValidationFailed
from app.core.permissions import P
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.credits.models import Buyer, CreditBatch, Sale
from app.modules.credits.service import balances
from app.modules.evidence.models import EvidenceFile
from app.modules.identity.models import AuditEntry, Organization
from app.modules.offtake.models import Offer, OfftakeAgreement
from app.modules.offtake.schemas import AgreementIn, AgreementPatch, OfferIn, OfferPatch, check_schedule

DELIVERED = ("delivered", "retired")
DUE_SOON_DAYS = 30


def today() -> date:
    return datetime.now(UTC).date()


def _money(v: Any) -> str:
    return str(Decimal(str(v)).quantize(Decimal("0.01")))


# ------------------------------------------------------------------ access
def is_staff(user: CurrentUser) -> bool:
    return user.can(P.MANAGE_SALES) or user.can(P.READ)


def own_buyer(db: Session, user: CurrentUser) -> Buyer | None:
    return db.scalars(scoped(Buyer, user).where(Buyer.user_id == user.id)).first()


def _visible(db: Session, user: CurrentUser, buyer_id: uuid.UUID, status: str) -> bool:
    if is_staff(user):
        return True
    b = own_buyer(db, user)
    return b is not None and b.id == buyer_id and status != "draft"


def get_offer(db: Session, user: CurrentUser, offer_id: str) -> Offer:
    o = get_owned(db, Offer, offer_id, user, "Offer")
    if not _visible(db, user, o.buyer_id, o.status):
        raise NotFound("Offer not found.")
    return o


def get_agreement(db: Session, user: CurrentUser, agreement_id: str) -> OfftakeAgreement:
    a = get_owned(db, OfftakeAgreement, agreement_id, user, "Offtake agreement")
    if not _visible(db, user, a.buyer_id, a.status):
        raise NotFound("Offtake agreement not found.")
    return a


def _seller(db: Session, user: CurrentUser, given: str | None) -> str:
    if given and given.strip():
        return given.strip()
    org = db.get(Organization, user.org_id)
    return org.name if org else ""


def _editors(db: Session, org_id: uuid.UUID, entity: Any, actions: tuple[str, ...]) -> list[uuid.UUID | None]:
    return list(db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == org_id, AuditEntry.entity_id == str(entity.id), AuditEntry.action.in_(actions))).all())


def _next_code(db: Session, model, org_id: uuid.UUID, prefix: str) -> str:
    n = db.scalar(select(func.count()).select_from(model).where(model.org_id == org_id,
                                                                model.code.like(f"{prefix}%"))) or 0
    return f"{prefix}{n + 1:03d}"


# ------------------------------------------------------------------ offers
def effective_status(o: Offer, on: date | None = None) -> str:
    if o.status == "sent" and o.valid_until < (on or today()):
        return "expired"
    return o.status


def offer_out(db: Session, o: Offer) -> dict[str, Any]:
    buyer = db.get(Buyer, o.buyer_id)
    batch = db.get(CreditBatch, o.batch_id)
    return {"id": str(o.id), "code": o.code, "seller_name": o.seller_name, "buyer_id": str(o.buyer_id),
            "buyer_name": buyer.name if buyer else None, "batch_id": str(o.batch_id),
            "batch_code": batch.code if batch else None, "vintage": batch.vintage if batch else None,
            "credit_type": o.credit_type, "quantity": o.quantity, "unit_price": _money(o.unit_price),
            "value": _money(Decimal(str(o.quantity)) * Decimal(str(o.unit_price))), "currency": o.currency,
            "valid_until": o.valid_until.isoformat(), "terms": o.terms, "status": effective_status(o),
            "sent_at": o.sent_at.isoformat() if o.sent_at else None,
            "responded_at": o.responded_at.isoformat() if o.responded_at else None,
            "response_note": o.response_note, "created_at": o.created_at.isoformat()}


def _check_available(db: Session, batch: CreditBatch, credit_type: str, quantity: float) -> None:
    if batch.status == "cancelled":
        raise Blocked("This credit batch has been cancelled.", code="BATCH_CANCELLED")
    avail = balances(db, batch.id)[credit_type]["available"]
    if quantity > avail + 1e-9:
        raise Blocked(f"Only {avail:g} t of {credit_type} credits are available in batch {batch.code}.",
                      code="INSUFFICIENT_CREDITS", details={"available": avail, "requested": quantity})


def create_offer(db: Session, user: CurrentUser, body: OfferIn) -> Offer:
    buyer = get_owned(db, Buyer, body.buyer_id, user, "Buyer")
    batch = get_owned(db, CreditBatch, body.batch_id, user, "Credit batch")
    if body.valid_until < today():
        raise ValidationFailed("The offer must be valid until today or later.", code="INVALID_VALIDITY")
    _check_available(db, batch, body.credit_type, body.quantity)
    o = Offer(org_id=user.org_id, created_by=user.id, code=_next_code(db, Offer, user.org_id, f"OF-{today().year}-"),
              seller_name=_seller(db, user, body.seller_name), buyer_id=buyer.id, batch_id=batch.id,
              credit_type=body.credit_type, quantity=body.quantity, unit_price=body.unit_price,
              currency=body.currency.upper(), valid_until=body.valid_until, terms=body.terms, status="draft")
    db.add(o)
    audit(db, user, "offer.create", o)
    return o


def update_offer(db: Session, user: CurrentUser, offer_id: str, body: OfferPatch) -> Offer:
    o = get_owned(db, Offer, offer_id, user, "Offer")
    if o.status != "draft":
        raise IllegalTransition("Only a draft offer can be changed. Withdraw it and make a new one.")
    before = snapshot(o)
    data = body.model_dump(exclude_unset=True)
    if data.get("quantity") is not None:
        _check_available(db, db.get(CreditBatch, o.batch_id), o.credit_type, body.quantity)
    if data.get("valid_until") is not None and body.valid_until < today():
        raise ValidationFailed("The offer must be valid until today or later.", code="INVALID_VALIDITY")
    for k, v in data.items():
        if v is not None:
            setattr(o, k, v)
    audit(db, user, "offer.update", o, before=before)
    return o


def send_offer(db: Session, user: CurrentUser, offer_id: str) -> Offer:
    o = get_owned(db, Offer, offer_id, user, "Offer")
    if o.status != "draft":
        raise IllegalTransition(f"Only a draft offer can be sent; this one is {o.status}.")
    if o.valid_until < today():
        raise ValidationFailed("This offer's validity has already passed. Change the date first.",
                               code="INVALID_VALIDITY")
    _check_available(db, db.get(CreditBatch, o.batch_id), o.credit_type, o.quantity)
    before = snapshot(o)
    o.status, o.sent_at = "sent", utcnow()
    audit(db, user, "offer.send", o, before=before)
    return o


def respond_offer(db: Session, user: CurrentUser, offer_id: str, accept: bool, note: str) -> Offer:
    o = get_offer(db, user, offer_id)
    if not user.can(P.MANAGE_SALES):
        b = own_buyer(db, user)
        if b is None or b.id != o.buyer_id or not user.can(P.BUYER_READ):
            raise NotFound("Offer not found.")
    if o.status != "sent":
        raise IllegalTransition(f"Only a sent offer can be answered; this one is {effective_status(o)}.")
    if effective_status(o) == "expired":
        raise IllegalTransition("This offer has expired. Ask the seller for a new one.", code="OFFER_EXPIRED")
    if accept:
        _check_available(db, db.get(CreditBatch, o.batch_id), o.credit_type, o.quantity)
    before = snapshot(o)
    o.status = "accepted" if accept else "rejected"
    o.responded_at, o.responded_by, o.response_note = utcnow(), user.id, note or None
    audit(db, user, f"offer.{o.status}", o, before=before, reason=note or None)
    return o


def withdraw_offer(db: Session, user: CurrentUser, offer_id: str, reason: str) -> Offer:
    o = get_owned(db, Offer, offer_id, user, "Offer")
    if o.status not in ("draft", "sent"):
        raise IllegalTransition(f"An offer that is {o.status} can't be withdrawn.")
    before = snapshot(o)
    o.status, o.response_note = "withdrawn", reason or None
    audit(db, user, "offer.withdraw", o, before=before, reason=reason or None)
    return o


def expire_due(db: Session, user: CurrentUser) -> dict[str, Any]:
    rows = db.scalars(scoped(Offer, user).where(Offer.status == "sent", Offer.valid_until < today())).all()
    for o in rows:
        before = snapshot(o)
        o.status = "expired"
        audit(db, user, "offer.expire", o, before=before)
    return {"expired": len(rows), "codes": [o.code for o in rows]}


def list_offers(db: Session, user: CurrentUser, status: str | None, buyer_id: str | None) -> list[Offer]:
    q = scoped(Offer, user).order_by(Offer.created_at.desc())
    if not is_staff(user):
        b = own_buyer(db, user)
        if b is None:
            return []
        q = q.where(Offer.buyer_id == b.id, Offer.status != "draft")
    elif buyer_id:
        q = q.where(Offer.buyer_id == get_owned(db, Buyer, buyer_id, user, "Buyer").id)
    rows = list(db.scalars(q).all())
    return [o for o in rows if effective_status(o) == status] if status else rows


# ------------------------------------------------------------------ agreements
def agreement_out(db: Session, a: OfftakeAgreement, deliveries: bool = False) -> dict[str, Any]:
    buyer = db.get(Buyer, a.buyer_id)
    out = {"id": str(a.id), "code": a.code, "title": a.title, "seller_name": a.seller_name,
           "buyer_id": str(a.buyer_id), "buyer_name": buyer.name if buyer else None,
           "offer_id": str(a.offer_id) if a.offer_id else None, "credit_type": a.credit_type,
           "total_volume_t": a.total_volume_t, "vintages": a.vintages or [], "price_type": a.price_type,
           "price": _money(a.price), "currency": a.currency, "delivery_schedule": a.delivery_schedule or [],
           "status": a.status, "contract_evidence_id": str(a.contract_evidence_id) if a.contract_evidence_id else None,
           "signed_on": a.signed_on.isoformat() if a.signed_on else None,
           "effective_from": a.effective_from.isoformat() if a.effective_from else None,
           "effective_to": a.effective_to.isoformat() if a.effective_to else None,
           "closed_on": a.closed_on.isoformat() if a.closed_on else None, "close_reason": a.close_reason,
           "notes": a.notes, "created_by": str(a.created_by) if a.created_by else None,
           "created_at": a.created_at.isoformat()}
    if deliveries:
        out["deliveries"] = delivery_report(db, a)
    return out


def _schedule(lines) -> list[dict[str, Any]]:
    return [{"due_date": x.due_date.isoformat(), "quantity": x.quantity}
            for x in sorted(lines, key=lambda x: x.due_date)]


def create_agreement(db: Session, user: CurrentUser, body: AgreementIn) -> OfftakeAgreement:
    buyer = get_owned(db, Buyer, body.buyer_id, user, "Buyer")
    offer_id = None
    if body.offer_id:
        offer = get_owned(db, Offer, body.offer_id, user, "Offer")
        if offer.status != "accepted":
            raise Blocked("Only an accepted offer can become an agreement.", code="OFFER_NOT_ACCEPTED")
        if offer.buyer_id != buyer.id:
            raise ValidationFailed("The offer was made to a different buyer.", code="BUYER_MISMATCH")
        if db.scalar(scoped(OfftakeAgreement, user).where(OfftakeAgreement.offer_id == offer.id)):
            raise Conflict("An agreement already exists for this offer.", code="AGREEMENT_EXISTS")
        offer_id = offer.id
    code = body.code or _next_code(db, OfftakeAgreement, user.org_id, f"OA-{today().year}-")
    if db.scalar(scoped(OfftakeAgreement, user).where(OfftakeAgreement.code == code)):
        raise Conflict(f"Agreement code {code} is already used.", code="CODE_TAKEN")
    a = OfftakeAgreement(org_id=user.org_id, created_by=user.id, code=code, title=body.title,
                         seller_name=_seller(db, user, body.seller_name), buyer_id=buyer.id, offer_id=offer_id,
                         credit_type=body.credit_type, total_volume_t=body.total_volume_t,
                         vintages=sorted(set(body.vintages)), price_type=body.price_type, price=body.price,
                         currency=body.currency.upper(), delivery_schedule=_schedule(body.delivery_schedule),
                         effective_from=body.effective_from, effective_to=body.effective_to, notes=body.notes,
                         status="draft")
    db.add(a)
    audit(db, user, "offtake_agreement.create", a)
    return a


def update_agreement(db: Session, user: CurrentUser, agreement_id: str, body: AgreementPatch) -> OfftakeAgreement:
    a = get_owned(db, OfftakeAgreement, agreement_id, user, "Offtake agreement")
    if a.status != "draft":
        raise IllegalTransition("A signed agreement can't be changed. Record an amendment as a new agreement.",
                                code="AGREEMENT_FROZEN")
    before = snapshot(a)
    data = body.model_dump(exclude_unset=True)
    total = body.total_volume_t if body.total_volume_t is not None else a.total_volume_t
    if body.delivery_schedule is not None or body.total_volume_t is not None:
        from app.modules.offtake.schemas import DeliveryLine

        lines = body.delivery_schedule if body.delivery_schedule is not None else [
            DeliveryLine(due_date=date.fromisoformat(x["due_date"]), quantity=x["quantity"])
            for x in a.delivery_schedule]
        try:
            check_schedule(lines, total)
        except ValueError as exc:
            raise ValidationFailed(str(exc), code="INVALID_SCHEDULE") from exc
        a.delivery_schedule = _schedule(lines)
    data.pop("delivery_schedule", None)
    if data.get("vintages") is not None:
        a.vintages = sorted(set(data.pop("vintages")))
    for k, v in data.items():
        if v is not None:
            setattr(a, k, v)
    if a.effective_from and a.effective_to and a.effective_to < a.effective_from:
        raise ValidationFailed("The agreement can't end before it starts.")
    audit(db, user, "offtake_agreement.update", a, before=before)
    return a


def sign_agreement(db: Session, user: CurrentUser, agreement_id: str, evidence_id: str,
                   signed_on: date) -> OfftakeAgreement:
    a = get_owned(db, OfftakeAgreement, agreement_id, user, "Offtake agreement")
    if a.status != "draft":
        raise IllegalTransition(f"Only a draft agreement can be signed; this one is {a.status}.")
    ev = get_owned(db, EvidenceFile, evidence_id, user, "Contract document")
    if signed_on > today():
        raise ValidationFailed("The signing date can't be in the future.")
    ensure_not_author(user.id, a.created_by, *_editors(db, user.org_id, a, ("offtake_agreement.update",)),
                      what="an offtake agreement")
    before = snapshot(a)
    a.status, a.contract_evidence_id, a.signed_on, a.signed_by = "signed", ev.id, signed_on, user.id
    audit(db, user, "offtake_agreement.sign", a, before=before)
    return a


def move_agreement(db: Session, user: CurrentUser, agreement_id: str, to: str, reason: str) -> OfftakeAgreement:
    a = get_owned(db, OfftakeAgreement, agreement_id, user, "Offtake agreement")
    allowed = {"active": ("signed",), "completed": ("active",), "terminated": ("signed", "active")}[to]
    if a.status not in allowed:
        raise IllegalTransition(f"An agreement that is {a.status} can't become {to}.",
                                details={"from": a.status, "to": to, "allowed_from": list(allowed)})
    if to == "terminated" and not reason.strip():
        raise ValidationFailed("Say why the agreement is terminated.", code="REASON_REQUIRED")
    if to == "completed":
        rep = delivery_report(db, a)
        if rep["delivered_t"] + 1e-9 < a.total_volume_t:
            raise Blocked(f"Only {rep['delivered_t']:g} of {a.total_volume_t:g} t have been delivered. "
                          "Terminate the agreement if the rest will not be delivered.", code="UNDER_DELIVERED")
    before = snapshot(a)
    a.status = to
    if to in ("completed", "terminated"):
        a.closed_on, a.close_reason = today(), reason or None
    audit(db, user, f"offtake_agreement.{to}", a, before=before, reason=reason or None)
    return a


def delivery_report(db: Session, a: OfftakeAgreement, on: date | None = None) -> dict[str, Any]:
    on = on or today()
    sales = db.scalars(select(Sale).where(Sale.org_id == a.org_id, Sale.contract_ref == a.code)
                       .order_by(Sale.created_at)).all()
    rows, by_status = [], defaultdict(float)
    delivered = 0.0
    for s in sales:
        batch = db.get(CreditBatch, s.batch_id)
        issues = []
        if s.buyer_id != a.buyer_id:
            issues.append("Sold to a different buyer than the agreement's.")
        if a.credit_type != "any" and s.credit_type != a.credit_type:
            issues.append(f"Credit type {s.credit_type} is not the contracted {a.credit_type}.")
        if a.vintages and batch and batch.vintage not in a.vintages:
            issues.append(f"Vintage {batch.vintage} is not one of the contracted vintages.")
        price = Decimal(str(s.unit_price))
        if s.currency != a.currency:
            issues.append(f"Priced in {s.currency}, not {a.currency}.")
        elif a.price_type == "fixed" and price != Decimal(str(a.price)):
            issues.append(f"Price {_money(price)} differs from the fixed price {_money(a.price)}.")
        elif a.price_type == "floor" and price < Decimal(str(a.price)):
            issues.append(f"Price {_money(price)} is below the floor price {_money(a.price)}.")
        if s.status != "cancelled":
            by_status[s.status] += s.quantity
            if s.status in DELIVERED and s.buyer_id == a.buyer_id:
                delivered += s.quantity
        rows.append({"sale_id": str(s.id), "sale_code": s.code, "status": s.status, "quantity": s.quantity,
                     "credit_type": s.credit_type, "vintage": batch.vintage if batch else None,
                     "unit_price": _money(s.unit_price), "currency": s.currency,
                     "trade_date": s.trade_date.isoformat() if s.trade_date else None, "issues": issues})
    delivered = round(delivered, 6)
    lines, cum = [], 0.0
    for x in a.delivery_schedule or []:
        cum = round(cum + float(x["quantity"]), 6)
        due = date.fromisoformat(x["due_date"])
        if delivered + 1e-9 >= cum:
            st = "covered"
        elif due < on:
            st = "overdue"
        elif due <= on + timedelta(days=DUE_SOON_DAYS):
            st = "due_soon"
        else:
            st = "upcoming"
        lines.append({"due_date": x["due_date"], "quantity": x["quantity"], "cumulative_due": cum, "status": st})
    due_to_date = round(sum(float(x["quantity"]) for x in a.delivery_schedule or []
                            if date.fromisoformat(x["due_date"]) <= on), 6)
    shortfall = round(max(0.0, due_to_date - delivered), 6)
    return {"agreement_code": a.code, "total_volume_t": a.total_volume_t, "delivered_t": delivered,
            "remaining_t": round(max(0.0, a.total_volume_t - delivered), 6), "due_to_date_t": due_to_date,
            "shortfall_t": shortfall, "on_track": shortfall <= 1e-9,
            "by_sale_status": {k: round(v, 6) for k, v in by_status.items()}, "schedule": lines, "sales": rows,
            "sales_with_issues": sum(1 for r in rows if r["issues"]),
            "basis": "Sales whose contract reference equals the agreement code; delivered and retired sales to the "
                     "agreement's buyer count as delivered."}


def list_agreements(db: Session, user: CurrentUser, status: str | None, buyer_id: str | None) -> list[OfftakeAgreement]:
    q = scoped(OfftakeAgreement, user).order_by(OfftakeAgreement.created_at.desc())
    if not is_staff(user):
        b = own_buyer(db, user)
        if b is None:
            return []
        q = q.where(OfftakeAgreement.buyer_id == b.id, OfftakeAgreement.status != "draft")
    elif buyer_id:
        q = q.where(OfftakeAgreement.buyer_id == get_owned(db, Buyer, buyer_id, user, "Buyer").id)
    if status:
        q = q.where(OfftakeAgreement.status == status)
    return list(db.scalars(q).all())
