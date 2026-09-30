"""Credit batches, the inventory ledger, buyers and sales.

Balances are never stored: they are always the sum of ``InventoryMove`` rows per
(batch, credit type, state), so every tonne can be traced and nothing can be lost.
"""

from __future__ import annotations

import uuid
from collections import defaultdict
from datetime import UTC, date, datetime
from decimal import ROUND_HALF_UP, Decimal
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, ValidationFailed
from app.core.events import emit
from app.core.permissions import P
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.calculation.models import CalculationRun, Claim, RunStatusEvent
from app.modules.credits.models import Buyer, CreditBatch, InventoryMove, Sale
from app.modules.credits.schemas import BuyerIn, BuyerPatch, IssueIn, SaleIn
from app.modules.identity.models import User
from app.modules.land.models import Enrolment, Field
from app.modules.programmes.models import Project
from app.modules.verification.models import VerificationPackage

STATES = ("available", "reserved", "sold", "retired", "buffer", "cancelled")
CREDIT_TYPES = ("reduction", "removal")
EPS = 1e-9
CENT = Decimal("0.01")


def money(v: Any) -> Decimal:
    return Decimal(str(v)).quantize(CENT, rounding=ROUND_HALF_UP)


def _q(v: float) -> float:
    return round(float(v), 6)


def _next_code(db: Session, model, org_id: uuid.UUID, prefix: str, width: int = 3) -> str:
    n = db.scalar(select(func.count()).select_from(model).where(model.org_id == org_id,
                                                                model.code.like(f"{prefix}%"))) or 0
    return f"{prefix}{n + 1:0{width}d}"


# ------------------------------------------------------------------ run status (read directly)
def run_status(db: Session, run_id: uuid.UUID) -> str | None:
    ev = db.scalars(select(RunStatusEvent).where(RunStatusEvent.run_id == run_id)
                    .order_by(RunStatusEvent.created_at.desc())).first()
    return ev.status if ev else None


def approved_runs(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> list[CalculationRun]:
    runs = db.scalars(select(CalculationRun).where(CalculationRun.org_id == org_id,
                                                   CalculationRun.project_id == project_id)
                      .order_by(CalculationRun.period_end)).all()
    return [r for r in runs if run_status(db, r.id) == "approved"]


def latest_package(db: Session, run_id: uuid.UUID) -> VerificationPackage | None:
    return db.scalars(select(VerificationPackage).where(VerificationPackage.run_id == run_id)
                      .order_by(VerificationPackage.version.desc())).first()


# ------------------------------------------------------------------ ledger
def balances(db: Session, batch_id: uuid.UUID) -> dict[str, dict[str, float]]:
    out = {t: {s: 0.0 for s in STATES} for t in CREDIT_TYPES}
    for m in db.scalars(select(InventoryMove).where(InventoryMove.batch_id == batch_id)).all():
        if m.from_state in out[m.credit_type]:
            out[m.credit_type][m.from_state] -= m.quantity
        out[m.credit_type][m.to_state] += m.quantity
    return {t: {s: _q(v) for s, v in states.items()} for t, states in out.items()}


def issued_total(db: Session, batch_id: uuid.UUID) -> dict[str, float]:
    tot = {t: 0.0 for t in CREDIT_TYPES}
    for m in db.scalars(select(InventoryMove).where(InventoryMove.batch_id == batch_id,
                                                    InventoryMove.from_state == "none")).all():
        tot[m.credit_type] += m.quantity
    return {t: _q(v) for t, v in tot.items()}


def _move(db: Session, user: CurrentUser, batch: CreditBatch, credit_type: str, frm: str, to: str, qty: float,
          reason: str, sale: Sale | None = None) -> InventoryMove:
    m = InventoryMove(org_id=batch.org_id, created_by=user.id, batch_id=batch.id, credit_type=credit_type,
                      from_state=frm, to_state=to, quantity=_q(qty), sale_id=sale.id if sale else None, reason=reason)
    db.add(m)
    db.flush()
    return m


def _lock_batch(db: Session, batch_id: uuid.UUID) -> CreditBatch:
    """Row lock on the batch so concurrent sales re-check the balance one at a time (no-op on SQLite)."""
    return db.execute(select(CreditBatch).where(CreditBatch.id == batch_id).with_for_update()
                      .execution_options(populate_existing=True)).scalar_one()


# ------------------------------------------------------------------ batches
def create_batch(db: Session, user: CurrentUser, run_id: str) -> CreditBatch:
    run = get_owned(db, CalculationRun, run_id, user, "Calculation run")
    status = run_status(db, run.id)
    if status != "approved":
        raise Blocked("Credits can only come from an approved calculation. This run is "
                      f"{status or 'not yet reviewed'}.", code="RUN_NOT_APPROVED", details={"status": status})
    if run.net_t_co2e is None or run.net_t_co2e <= 0:
        raise Blocked("This calculation has no positive net result, so there are no credits to create.",
                      code="NET_NOT_POSITIVE", details={"net_t_co2e": run.net_t_co2e})
    # A negative reductions figure means net project emissions for the period. It is netted against
    # removals (never issued as negative credits), so issuable = reductions + removals = net credits.
    reductions, removals = run.reductions_t_co2e, run.removals_t_co2e
    netting = None
    if reductions < 0:
        netting = {"reductions_before": reductions, "removals_before": removals}
        removals, reductions = removals + reductions, 0.0
    elif removals < 0:
        netting = {"reductions_before": reductions, "removals_before": removals}
        reductions, removals = reductions + removals, 0.0
    if reductions < 0 or removals < 0 or reductions + removals <= 0:
        raise Blocked("This calculation has no reductions or removals to credit after netting.",
                      code="NET_NOT_POSITIVE", details={"reductions": reductions, "removals": removals})
    if db.scalar(select(CreditBatch).where(CreditBatch.run_id == run.id)):
        raise Conflict("A credit batch already exists for this calculation run.", code="BATCH_EXISTS")
    year = datetime.now(UTC).year
    batch = CreditBatch(
        org_id=user.org_id, created_by=user.id, project_id=run.project_id, run_id=run.id,
        code=_next_code(db, CreditBatch, user.org_id, f"CB-{year}-"), vintage=run.period_end.year,
        reductions_t=_q(reductions), removals_t=_q(removals), status="provisional",
    )
    db.add(batch)
    db.flush()
    note = f"Created from calculation run {run.id}"
    if netting:
        note += (f" (net project emissions of {abs(min(netting['reductions_before'], netting['removals_before'])):.2f} t"
                 " netted against the other credit type)")
    for ctype, qty in (("reduction", reductions), ("removal", removals)):
        if qty > 0:
            _move(db, user, batch, ctype, "none", "available", qty, note)
    audit(db, user, "credit_batch.create", batch, reason=note if netting else None)
    return batch


def _transition(db: Session, user: CurrentUser, batch: CreditBatch, allowed: tuple[str, ...], to: str) -> dict:
    if batch.status not in allowed:
        raise IllegalTransition(f"A {batch.status} batch can't become {to}.",
                                details={"from": batch.status, "to": to})
    before = snapshot(batch)
    batch.status = to
    return before


def verify_batch(db: Session, user: CurrentUser, batch_id: str) -> CreditBatch:
    batch = get_owned(db, CreditBatch, batch_id, user, "Credit batch")
    before = _transition(db, user, batch, ("provisional",), "verified")
    audit(db, user, "credit_batch.verify", batch, before=before)
    return batch


def issue_batch(db: Session, user: CurrentUser, batch_id: str, body: IssueIn) -> CreditBatch:
    batch = get_owned(db, CreditBatch, batch_id, user, "Credit batch")
    before = _transition(db, user, batch, ("verified",), "issued")
    batch.registry_name, batch.registry_project_ref = body.registry_name, body.registry_project_ref
    batch.serial_start, batch.serial_end, batch.issued_on = body.serial_start, body.serial_end, body.issued_on
    audit(db, user, "credit_batch.issue", batch, before=before)
    emit(db, user, "credits.issued", batch, {
        "code": batch.code, "vintage": batch.vintage, "project_id": batch.project_id,
        "reductions_t": batch.reductions_t, "removals_t": batch.removals_t, "registry": batch.registry_name,
        "serial_start": batch.serial_start, "serial_end": batch.serial_end,
    })
    return batch


def cancel_batch(db: Session, user: CurrentUser, batch_id: str, reason: str) -> CreditBatch:
    batch = _lock_batch(db, get_owned(db, CreditBatch, batch_id, user, "Credit batch").id)
    bal = balances(db, batch.id)
    committed = {t: bal[t]["reserved"] + bal[t]["sold"] + bal[t]["retired"] for t in CREDIT_TYPES}
    if any(v > EPS for v in committed.values()):
        raise Blocked("This batch has credits reserved, sold or retired, so it can't be cancelled.",
                      code="BATCH_IN_USE", details={"committed": committed})
    before = _transition(db, user, batch, ("provisional", "verified", "issued"), "cancelled")
    for t in CREDIT_TYPES:
        if bal[t]["available"] > EPS:
            _move(db, user, batch, t, "available", "cancelled", bal[t]["available"], reason)
    audit(db, user, "credit_batch.cancel", batch, before=before, reason=reason)
    return batch


def batch_out(db: Session, b: CreditBatch, moves: bool = False) -> dict[str, Any]:
    bal = balances(db, b.id)
    out = {
        "id": str(b.id), "code": b.code, "project_id": str(b.project_id), "run_id": str(b.run_id),
        "vintage": b.vintage, "reductions_t": b.reductions_t, "removals_t": b.removals_t, "status": b.status,
        "registry_name": b.registry_name, "registry_project_ref": b.registry_project_ref,
        "serial_start": b.serial_start, "serial_end": b.serial_end,
        "issued_on": b.issued_on.isoformat() if b.issued_on else None, "created_at": b.created_at.isoformat(),
        "balances": bal,
        "totals": {s: _q(sum(bal[t][s] for t in CREDIT_TYPES)) for s in STATES},
        "issued_total": issued_total(db, b.id),
    }
    if moves:
        rows = db.scalars(select(InventoryMove).where(InventoryMove.batch_id == b.id)
                          .order_by(InventoryMove.created_at)).all()
        out["moves"] = [{"id": str(m.id), "at": m.created_at.isoformat(), "credit_type": m.credit_type,
                         "from": m.from_state, "to": m.to_state, "quantity": m.quantity,
                         "sale_id": str(m.sale_id) if m.sale_id else None, "reason": m.reason} for m in rows]
    return out


def list_batches(db: Session, user: CurrentUser, project_id: str | None, status: str | None) -> list[CreditBatch]:
    q = scoped(CreditBatch, user).order_by(CreditBatch.created_at.desc())
    if project_id:
        try:
            q = q.where(CreditBatch.project_id == uuid.UUID(project_id))
        except ValueError as exc:
            raise ValidationFailed("project_id is not a valid id.") from exc
    if status:
        q = q.where(CreditBatch.status == status)
    return list(db.scalars(q).all())


# ------------------------------------------------------------------ buyers
def _buyer_user(db: Session, user: CurrentUser, user_id: str | None) -> uuid.UUID | None:
    if not user_id:
        return None
    u = get_owned(db, User, user_id, user, "User")
    if u.role != "buyer":
        raise ValidationFailed("Only a user with the Buyer role can be linked to a buyer.", code="NOT_A_BUYER_USER")
    return u.id


def buyer_out(b: Buyer) -> dict[str, Any]:
    return {"id": str(b.id), "name": b.name, "kind": b.kind, "country": b.country, "contact_name": b.contact_name,
            "contact_email": b.contact_email, "requirements": b.requirements or {},
            "user_id": str(b.user_id) if b.user_id else None, "created_at": b.created_at.isoformat()}


def create_buyer(db: Session, user: CurrentUser, body: BuyerIn) -> Buyer:
    data = body.model_dump()
    data["user_id"] = _buyer_user(db, user, data.pop("user_id"))
    b = Buyer(org_id=user.org_id, created_by=user.id, **data)
    db.add(b)
    audit(db, user, "buyer.create", b)
    return b


def update_buyer(db: Session, user: CurrentUser, buyer_id: str, body: BuyerPatch) -> Buyer:
    b = get_owned(db, Buyer, buyer_id, user, "Buyer")
    before = snapshot(b)
    data = body.model_dump(exclude_unset=True)
    if "user_id" in data:
        b.user_id = _buyer_user(db, user, data.pop("user_id"))
    for k, v in data.items():
        if v is not None:
            setattr(b, k, v)
    audit(db, user, "buyer.update", b, before=before)
    return b


# ------------------------------------------------------------------ sales
def sale_out(db: Session, s: Sale) -> dict[str, Any]:
    batch = db.get(CreditBatch, s.batch_id)
    buyer = db.get(Buyer, s.buyer_id)
    price = money(s.unit_price)
    return {
        "id": str(s.id), "code": s.code, "buyer_id": str(s.buyer_id), "buyer_name": buyer.name if buyer else None,
        "batch_id": str(s.batch_id), "batch_code": batch.code if batch else None,
        "vintage": batch.vintage if batch else None, "credit_type": s.credit_type, "quantity": s.quantity,
        "unit_price": str(price), "total_amount": str(money(Decimal(str(s.quantity)) * price)), "currency": s.currency,
        "status": s.status, "contract_ref": s.contract_ref, "retirement_beneficiary": s.retirement_beneficiary,
        "trade_date": s.trade_date.isoformat() if s.trade_date else None, "notes": s.notes,
        "created_at": s.created_at.isoformat(),
    }


def create_sale(db: Session, user: CurrentUser, body: SaleIn) -> Sale:
    buyer = get_owned(db, Buyer, body.buyer_id, user, "Buyer")
    batch = _lock_batch(db, get_owned(db, CreditBatch, body.batch_id, user, "Credit batch").id)
    if batch.status != "issued":
        raise Blocked("Credits can only be sold once the batch has been issued by the registry.",
                      code="BATCH_NOT_ISSUED", details={"status": batch.status})
    qty = _q(body.quantity)
    available = balances(db, batch.id)[body.credit_type]["available"]  # re-checked under the row lock
    if qty > available + EPS:
        raise Conflict(
            f"Only {available:g} t of {body.credit_type} credits are available in {batch.code}; "
            f"{qty:g} t were requested.",
            code="INVENTORY_INSUFFICIENT", details={"available": available, "requested": qty},
        )
    year = datetime.now(UTC).year
    sale = Sale(
        org_id=user.org_id, created_by=user.id, code=_next_code(db, Sale, user.org_id, f"S-{year}-"),
        buyer_id=buyer.id, batch_id=batch.id, credit_type=body.credit_type, quantity=qty,
        unit_price=money(body.unit_price), currency=body.currency, status="reserved", notes=body.notes,
    )
    db.add(sale)
    db.flush()
    _move(db, user, batch, body.credit_type, "available", "reserved", qty, f"Reserved for sale {sale.code}", sale)
    audit(db, user, "sale.create", sale)
    emit(db, user, "sale.created", sale, {"code": sale.code, "batch_code": batch.code, "credit_type": sale.credit_type,
                                          "quantity": qty, "vintage": batch.vintage})
    return sale


def _sale_step(db: Session, user: CurrentUser, sale_id: str, allowed: tuple[str, ...], to: str) -> tuple[Sale, CreditBatch, dict]:
    sale = get_owned(db, Sale, sale_id, user, "Sale")
    batch = _lock_batch(db, sale.batch_id)
    if sale.status not in allowed:
        raise IllegalTransition(f"A {sale.status} sale can't be marked {to}.", details={"from": sale.status, "to": to})
    before = snapshot(sale)
    sale.status = to
    return sale, batch, before


def contract_sale(db: Session, user: CurrentUser, sale_id: str, contract_ref: str, trade_date: date | None) -> Sale:
    sale, _, before = _sale_step(db, user, sale_id, ("reserved",), "contracted")
    sale.contract_ref = contract_ref
    sale.trade_date = trade_date or datetime.now(UTC).date()
    audit(db, user, "sale.contract", sale, before=before)
    return sale


def deliver_sale(db: Session, user: CurrentUser, sale_id: str) -> Sale:
    sale, batch, before = _sale_step(db, user, sale_id, ("contracted",), "delivered")
    _move(db, user, batch, sale.credit_type, "reserved", "sold", sale.quantity, f"Delivered under sale {sale.code}", sale)
    audit(db, user, "sale.deliver", sale, before=before)
    return sale


def retire_sale(db: Session, user: CurrentUser, sale_id: str, beneficiary: str) -> Sale:
    sale, batch, before = _sale_step(db, user, sale_id, ("delivered",), "retired")
    sale.retirement_beneficiary = beneficiary
    _move(db, user, batch, sale.credit_type, "sold", "retired", sale.quantity,
          f"Retired on behalf of {beneficiary} (sale {sale.code})", sale)
    audit(db, user, "sale.retire", sale, before=before)
    return sale


def cancel_sale(db: Session, user: CurrentUser, sale_id: str, reason: str) -> Sale:
    sale, batch, before = _sale_step(db, user, sale_id, ("reserved", "contracted"), "cancelled")
    _move(db, user, batch, sale.credit_type, "reserved", "available", sale.quantity,
          f"Sale {sale.code} cancelled: {reason}", sale)
    audit(db, user, "sale.cancel", sale, before=before, reason=reason)
    return sale


def list_sales(db: Session, user: CurrentUser, status: str | None, buyer_id: str | None,
               batch_id: str | None) -> list[Sale]:
    q = scoped(Sale, user).order_by(Sale.created_at.desc())
    try:
        if buyer_id:
            q = q.where(Sale.buyer_id == uuid.UUID(buyer_id))
        if batch_id:
            q = q.where(Sale.batch_id == uuid.UUID(batch_id))
    except ValueError as exc:
        raise ValidationFailed("Invalid id filter.") from exc
    if status:
        q = q.where(Sale.status == status)
    return list(db.scalars(q).all())


# ------------------------------------------------------------------ buyer portal & reports
def _retired_move(db: Session, sale: Sale) -> InventoryMove | None:
    return db.scalars(select(InventoryMove).where(InventoryMove.sale_id == sale.id,
                                                  InventoryMove.to_state == "retired")).first()


def portfolio(db: Session, user: CurrentUser) -> dict[str, Any]:
    buyer = db.scalars(scoped(Buyer, user).where(Buyer.user_id == user.id)).first()
    if buyer is None:
        return {"buyer": None, "sales": [], "totals": {},
                "message": "Your account isn't linked to a buyer yet. Contact the programme team."}
    sales = db.scalars(scoped(Sale, user).where(Sale.buyer_id == buyer.id).order_by(Sale.created_at)).all()
    items = []
    totals: dict[str, float] = defaultdict(float)
    for s in sales:
        b = db.get(CreditBatch, s.batch_id)
        proj = db.get(Project, b.project_id)
        mv = _retired_move(db, s)
        items.append({
            "id": str(s.id), "sale_code": s.code, "status": s.status, "credit_type": s.credit_type, "quantity": s.quantity,
            "unit_price": str(money(s.unit_price)), "currency": s.currency, "vintage": b.vintage,
            "batch_code": b.code, "project": {"code": proj.code, "name": proj.name} if proj else None,
            "registry": b.registry_name, "registry_project_ref": b.registry_project_ref,
            "serial_start": b.serial_start, "serial_end": b.serial_end, "contract_ref": s.contract_ref,
            "retirement": None if s.status != "retired" else {
                "beneficiary": s.retirement_beneficiary, "quantity": s.quantity,
                "retired_at": mv.created_at.isoformat() if mv else None,
                "certificate_ref": f"{s.code}/{b.code}", "registry": b.registry_name,
                "serials": [b.serial_start, b.serial_end],
            },
            "report_url": f"/api/sales/{s.id}/report",
        })
        if s.status != "cancelled":
            totals[s.status] += s.quantity
    return {"buyer": {"id": str(buyer.id), "name": buyer.name}, "sales": items,
            "totals": {k: _q(v) for k, v in totals.items()}}


def sale_for_report(db: Session, user: CurrentUser, sale_id: str) -> Sale:
    sale = get_owned(db, Sale, sale_id, user, "Sale")
    if not (user.can(P.MANAGE_SALES) or user.can(P.READ)):  # a buyer sees only their own sales
        buyer = db.get(Buyer, sale.buyer_id)
        if buyer is None or buyer.user_id != user.id:
            raise NotFound("Sale not found.")
    return sale


def sale_report(db: Session, sale: Sale) -> dict[str, Any]:
    batch = db.get(CreditBatch, sale.batch_id)
    run = db.get(CalculationRun, batch.run_id)
    proj = db.get(Project, batch.project_id)
    pkg = latest_package(db, run.id)
    claim_fields = set(db.scalars(select(Claim.field_id).where(Claim.run_id == run.id)).all())
    if claim_fields:
        basis = "fields credited by the calculation run"
        field_ids = claim_fields
    else:
        basis = "fields enrolled in the project"
        field_ids = set(db.scalars(select(Enrolment.field_id).where(Enrolment.project_id == proj.id,
                                                                    Enrolment.status == "enrolled")).all())
    area = sum(db.scalars(select(Field.area_ha).where(Field.id.in_(field_ids))).all()) if field_ids else 0.0
    mv = _retired_move(db, sale)
    return {
        "report": "Scope 3 / insetting summary",
        "sale": {"code": sale.code, "status": sale.status, "credit_type": sale.credit_type, "quantity_t_co2e": sale.quantity,
                 "contract_ref": sale.contract_ref, "trade_date": sale.trade_date.isoformat() if sale.trade_date else None,
                 "retirement_beneficiary": sale.retirement_beneficiary,
                 "retired_at": mv.created_at.isoformat() if mv else None},
        "project": {"code": proj.code, "name": proj.name, "methodology": f"{proj.methodology_code} v{proj.methodology_version}"},
        "batch": {"code": batch.code, "vintage": batch.vintage, "status": batch.status,
                  "reductions_t_co2e": batch.reductions_t, "removals_t_co2e": batch.removals_t,
                  "registry": batch.registry_name, "registry_project_ref": batch.registry_project_ref,
                  "serial_start": batch.serial_start, "serial_end": batch.serial_end},
        "calculation": {"period_start": run.period_start.isoformat(), "period_end": run.period_end.isoformat(),
                        "net_t_co2e": run.net_t_co2e, "engine_version": run.engine_version,
                        "snapshot_sha256": run.snapshot_sha256},
        "verification_package": {"version": pkg.version, "sha256": pkg.sha256} if pkg else None,
        "footprint": {"fields": len(field_ids), "area_ha": round(float(area), 4), "basis": basis},
        "data_class": "CALCULATED",
        "privacy": "Aggregated project data only; no farmer personal data is included.",
    }
