"""Benefit sharing: rules, pools and entitlements, payment profiles, payout batches and statements."""

from __future__ import annotations

import uuid
from collections import defaultdict
from datetime import UTC, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, RuleMissing, ValidationFailed
from app.core.events import emit
from app.core.permissions import P
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.credits.models import CreditBatch, Sale
from app.modules.calculation.models import CalculationRun
from app.modules.farmers.models import Farmer
from app.modules.identity.models import AuditEntry
from app.modules.land.models import Enrolment, Field
from app.modules.payments import domain
from app.modules.payments.domain import money
from app.modules.payments.models import (
    BenefitPool, BenefitRule, Entitlement, PaymentAttempt, PaymentProfile, Payout, PayoutBatch,
)
from app.modules.payments.providers import ProfileRef, get_payout_provider
from app.modules.payments.schemas import BenefitRuleIn, BenefitRulePatch, PaymentProfileIn
from app.modules.practices.models import PracticeRecord
from app.modules.programmes.models import Programme, Project


def _s(v: Any) -> str | None:
    return None if v is None else str(money(v))


def _next_code(db: Session, model, org_id: uuid.UUID, prefix: str) -> str:
    n = db.scalar(select(func.count()).select_from(model).where(model.org_id == org_id,
                                                                model.code.like(f"{prefix}%"))) or 0
    return f"{prefix}{n + 1:03d}"


# ------------------------------------------------------------------ benefit rules
def rule_out(r: BenefitRule) -> dict[str, Any]:
    return {"id": str(r.id), "programme_id": str(r.programme_id), "version": r.version,
            "farmer_share_pct": str(Decimal(str(r.farmer_share_pct)).quantize(Decimal("0.01"))),
            "weights": r.weights, "deductions": r.deductions, "min_payout": _s(r.min_payout), "status": r.status,
            "approved_by": str(r.approved_by) if r.approved_by else None,
            "approved_at": r.approved_at.isoformat() if r.approved_at else None, "notes": r.notes,
            "created_by": str(r.created_by) if r.created_by else None, "created_at": r.created_at.isoformat()}


def _deductions(items) -> list[dict[str, Any]]:
    return [{"name": d.name, "pct": float(d.pct)} for d in items]


def create_rule(db: Session, user: CurrentUser, body: BenefitRuleIn) -> BenefitRule:
    prog = get_owned(db, Programme, body.programme_id, user, "Programme")
    version = (db.scalar(select(func.max(BenefitRule.version)).where(
        BenefitRule.org_id == user.org_id, BenefitRule.programme_id == prog.id)) or 0) + 1
    r = BenefitRule(org_id=user.org_id, created_by=user.id, programme_id=prog.id, version=version,
                    farmer_share_pct=body.farmer_share_pct, weights={k: float(v) for k, v in body.weights.items()},
                    deductions=_deductions(body.deductions), min_payout=money(body.min_payout), notes=body.notes,
                    status="draft")
    db.add(r)
    audit(db, user, "benefit_rule.create", r)
    return r


def update_rule(db: Session, user: CurrentUser, rule_id: str, body: BenefitRulePatch) -> BenefitRule:
    r = get_owned(db, BenefitRule, rule_id, user, "Benefit rule")
    if r.status != "draft":
        raise IllegalTransition("Approved benefit rules are frozen. Create a new version instead.",
                                code="RULE_FROZEN")
    before = snapshot(r)
    data = body.model_dump(exclude_unset=True)
    if data.get("farmer_share_pct") is not None:
        r.farmer_share_pct = body.farmer_share_pct
    if data.get("weights") is not None:
        r.weights = {k: float(v) for k, v in body.weights.items()}
    if data.get("deductions") is not None:
        r.deductions = _deductions(body.deductions)
    if data.get("min_payout") is not None:
        r.min_payout = money(body.min_payout)
    if data.get("notes") is not None:
        r.notes = body.notes
    audit(db, user, "benefit_rule.update", r, before=before)
    return r


def _editors(db: Session, org_id: uuid.UUID, entity: Any, action: str) -> list[uuid.UUID | None]:
    return list(db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == org_id, AuditEntry.entity_id == str(entity.id), AuditEntry.action == action)).all())


def approve_rule(db: Session, user: CurrentUser, rule_id: str) -> BenefitRule:
    r = get_owned(db, BenefitRule, rule_id, user, "Benefit rule")
    if r.status != "draft":
        raise IllegalTransition(f"Only draft rules can be approved; this one is {r.status}.")
    ensure_not_author(user.id, r.created_by, *_editors(db, user.org_id, r, "benefit_rule.update"), what="a benefit rule")
    before = snapshot(r)
    for prev in db.scalars(scoped(BenefitRule, user).where(BenefitRule.programme_id == r.programme_id,
                                                           BenefitRule.status == "approved")).all():
        pb = snapshot(prev)
        prev.status = "retired"
        audit(db, user, "benefit_rule.retire", prev, before=pb, reason=f"Replaced by version {r.version}")
    r.status, r.approved_by, r.approved_at = "approved", user.id, utcnow()
    audit(db, user, "benefit_rule.approve", r, before=before)
    return r


# ------------------------------------------------------------------ pools & entitlements
def _latest_active_practices(db: Session, org_id: uuid.UUID, field_ids: list[uuid.UUID]) -> list[PracticeRecord]:
    if not field_ids:
        return []
    latest: dict[uuid.UUID, PracticeRecord] = {}
    for r in db.scalars(select(PracticeRecord).where(PracticeRecord.org_id == org_id,
                                                     PracticeRecord.field_id.in_(field_ids))).all():
        if r.record_id not in latest or r.version > latest[r.record_id].version:
            latest[r.record_id] = r
    return [r for r in latest.values() if r.status == "active"]


def create_pool(db: Session, user: CurrentUser, sale_id: str) -> BenefitPool:
    sale = get_owned(db, Sale, sale_id, user, "Sale")
    if sale.status not in ("delivered", "retired"):
        raise Blocked("Money can only be shared once the credits have been delivered to the buyer.",
                      code="SALE_NOT_DELIVERED", details={"status": sale.status})
    if db.scalar(select(BenefitPool).where(BenefitPool.sale_id == sale.id)):
        raise Conflict("A benefit pool already exists for this sale.", code="POOL_EXISTS")
    batch = db.get(CreditBatch, sale.batch_id)
    project = db.get(Project, batch.project_id)
    run = db.get(CalculationRun, batch.run_id)
    rule = db.scalars(scoped(BenefitRule, user).where(BenefitRule.programme_id == project.programme_id,
                                                      BenefitRule.status == "approved")
                      .order_by(BenefitRule.version.desc())).first()
    if rule is None:
        raise RuleMissing("This programme has no approved benefit-sharing rule, so the farmer share can't be worked out.",
                          code="BENEFIT_RULE_MISSING", details={"programme_id": str(project.programme_id)})

    gross = money(Decimal(str(sale.quantity)) * money(sale.unit_price))
    amounts = domain.pool_amounts(gross, rule.deductions or [], Decimal(str(rule.farmer_share_pct)))

    enrolments = db.scalars(select(Enrolment).where(Enrolment.org_id == user.org_id, Enrolment.project_id == project.id,
                                                    Enrolment.status == "enrolled")).all()
    # QA2 baseline control-site fields are enrolled only to be stratified; they earn no credits, so they don't share
    # in the revenue of the run that produced the sold credits.
    control_fields = {str(f) for s in ((run.inputs_snapshot or {}).get("sources") or {}).get("strata", [])
                      if s.get("role") == "control" for f in s.get("field_ids", [])}
    enrolments = [e for e in enrolments if str(e.field_id) not in control_fields]
    fields = {f.id: f for f in db.scalars(select(Field).where(Field.id.in_([e.field_id for e in enrolments]))).all()} \
        if enrolments else {}
    practices = [p for p in _latest_active_practices(db, user.org_id, list(fields))
                 if p.scenario == "project" and run.period_start <= p.performed_on <= run.period_end]
    inputs: dict[str, dict[str, Any]] = defaultdict(lambda: {"area": 0.0, "practices": 0, "credits": 0.0, "fields": []})
    field_farmer = {}
    for e in enrolments:
        f = fields.get(e.field_id)
        if f is None:
            continue
        x = inputs[str(e.farmer_id)]
        x["area"] = round(x["area"] + f.area_ha, 6)
        x["credits"] = x["area"]  # area-proportional proxy for each farmer's credit contribution
        x["fields"].append(f.code)
        field_farmer[f.id] = str(e.farmer_id)
    for p in practices:
        if p.field_id in field_farmer:
            inputs[field_farmer[p.field_id]]["practices"] += 1
    if not inputs:
        raise Blocked("No farmers are enrolled in this project, so there is nobody to share with.", code="NO_FARMERS")
    try:
        score_map, score_detail = domain.scores(inputs, rule.weights)
        split = domain.allocate(amounts["farmer_pool"], score_map)
    except ValueError as exc:
        raise Blocked("None of the weighting inputs (area, practices, credits) have any value, so the pool can't "
                      "be split.", code="NO_WEIGHTING_INPUTS") from exc
    assert sum(split.values(), Decimal(0)) == amounts["farmer_pool"]

    pool = BenefitPool(
        org_id=user.org_id, created_by=user.id, sale_id=sale.id, rule_id=rule.id, gross_amount=amounts["gross"],
        deductions_amount=amounts["deductions_total"], farmer_pool_amount=amounts["farmer_pool"],
        currency=sale.currency, status="calculated",
        breakdown={
            "sale_code": sale.code, "quantity_t": sale.quantity, "unit_price": str(money(sale.unit_price)),
            "gross": str(amounts["gross"]),
            "deductions": [{**d, "amount": str(d["amount"])} for d in amounts["deductions"]],
            "net_after_deductions": str(amounts["net"]), "farmer_share_pct": float(rule.farmer_share_pct),
            "farmer_pool": str(amounts["farmer_pool"]), "rule_version": rule.version, "weights": rule.weights,
            "period": [run.period_start.isoformat(), run.period_end.isoformat()], "farmers": len(split),
            "totals": score_detail["totals"], "weights_used": score_detail["weights_used"],
            "rounding": "Shares rounded down to the paisa; leftover paise go to the largest remainders.",
        },
    )
    db.add(pool)
    db.flush()
    for fid in sorted(split):
        x = inputs[fid]
        db.add(Entitlement(
            org_id=user.org_id, created_by=user.id, pool_id=pool.id, farmer_id=uuid.UUID(fid), amount=split[fid],
            inputs={"area_ha": x["area"], "practices": x["practices"], "credits_proxy_area_ha": x["credits"],
                    "fields": x["fields"], "weights": rule.weights, "rule_id": str(rule.id), "rule_version": rule.version,
                    **score_detail["per_farmer"][fid], "sale_code": sale.code},
            calc_version=1,
        ))
    audit(db, user, "benefit_pool.create", pool)
    return pool


def entitlements(db: Session, pool_id: uuid.UUID) -> list[Entitlement]:
    rows = db.scalars(select(Entitlement).where(Entitlement.pool_id == pool_id)).all()
    if not rows:
        return []
    latest = max(r.calc_version for r in rows)
    return sorted((r for r in rows if r.calc_version == latest), key=lambda r: str(r.farmer_id))


def pool_out(db: Session, p: BenefitPool, lines: bool = True) -> dict[str, Any]:
    out = {"id": str(p.id), "sale_id": str(p.sale_id), "rule_id": str(p.rule_id), "gross_amount": _s(p.gross_amount),
           "deductions_amount": _s(p.deductions_amount), "farmer_pool_amount": _s(p.farmer_pool_amount),
           "currency": p.currency, "status": p.status, "breakdown": p.breakdown, "created_at": p.created_at.isoformat(),
           "created_by": str(p.created_by) if p.created_by else None, "data_class": "CALCULATED"}
    if lines:
        names = {f.id: f.full_name for f in db.scalars(select(Farmer).where(
            Farmer.id.in_([e.farmer_id for e in entitlements(db, p.id)]))).all()}
        out["entitlements"] = [{"id": str(e.id), "farmer_id": str(e.farmer_id), "farmer_name": names.get(e.farmer_id),
                                "amount": _s(e.amount), "inputs": e.inputs, "calc_version": e.calc_version}
                               for e in entitlements(db, p.id)]
    return out


def approve_pool(db: Session, user: CurrentUser, pool_id: str) -> BenefitPool:
    p = get_owned(db, BenefitPool, pool_id, user, "Benefit pool")
    if p.status != "calculated":
        raise IllegalTransition(f"Only a calculated pool can be approved; this one is {p.status}.")
    ensure_not_author(user.id, p.created_by, what="a benefit pool")
    before = snapshot(p)
    p.status = "approved"
    audit(db, user, "benefit_pool.approve", p, before=before)
    return p


# ------------------------------------------------------------------ payment profiles
def farmer_for(db: Session, user: CurrentUser, farmer_id: str) -> Farmer:
    farmer = get_owned(db, Farmer, farmer_id, user, "Farmer")
    staff = user.can(P.PREPARE_PAYOUT) or user.can(P.APPROVE_PAYOUT) or user.can(P.READ)
    if not staff and str((user.scope or {}).get("farmer_id")) != str(farmer.id):
        raise NotFound("Farmer not found.")
    return farmer


def profile_out(p: PaymentProfile | None) -> dict[str, Any] | None:
    if p is None:
        return None
    return {"id": str(p.id), "farmer_id": str(p.farmer_id), "method": p.method, "upi_id": p.upi_id,
            "account_masked": p.account_masked, "ifsc": p.ifsc, "account_name": p.account_name,
            "verified": p.verified, "verified_on": p.verified_on.isoformat() if p.verified_on else None,
            "updated_at": p.updated_at.isoformat()}


def _ref(p: PaymentProfile) -> ProfileRef:
    return ProfileRef(p.method, p.upi_id, p.account_masked, p.ifsc, p.account_name)


def put_profile(db: Session, user: CurrentUser, farmer_id: str, body: PaymentProfileIn) -> PaymentProfile:
    farmer = get_owned(db, Farmer, farmer_id, user, "Farmer")
    if not user.can(P.PREPARE_PAYOUT) and str((user.scope or {}).get("farmer_id")) != str(farmer.id):
        raise NotFound("Farmer not found.")
    p = db.scalar(select(PaymentProfile).where(PaymentProfile.farmer_id == farmer.id))
    before = snapshot(p) if p else None
    if p is None:
        p = PaymentProfile(org_id=user.org_id, created_by=user.id, farmer_id=farmer.id, method=body.method,
                           account_name=body.account_name)
        db.add(p)
    p.method, p.account_name = body.method, body.account_name
    if body.method == "upi":
        p.upi_id, p.account_masked, p.ifsc = body.upi_id.strip(), None, None
    else:
        p.upi_id, p.account_masked, p.ifsc = None, "XXXXXX" + body.account_number[-4:], body.ifsc
    p.verified, p.verified_on = False, None  # any change needs a fresh verification
    audit(db, user, "payment_profile.update" if before else "payment_profile.create", p, before=before)
    return p


def verify_profile(db: Session, user: CurrentUser, farmer_id: str) -> PaymentProfile:
    farmer = get_owned(db, Farmer, farmer_id, user, "Farmer")
    p = db.scalar(select(PaymentProfile).where(PaymentProfile.farmer_id == farmer.id))
    if p is None:
        raise NotFound("This farmer has no payment details yet.")
    res = get_payout_provider().verify(_ref(p))
    if not res.ok:
        raise ValidationFailed(res.reason or "The payment details could not be verified.", code="VERIFICATION_FAILED")
    before = snapshot(p)
    p.verified, p.verified_on = True, datetime.now(UTC).date()
    audit(db, user, "payment_profile.verify", p, before=before, reason=res.provider_ref)
    return p


# ------------------------------------------------------------------ payout batches
def create_payout_batch(db: Session, user: CurrentUser, pool_id: str) -> PayoutBatch:
    pool = get_owned(db, BenefitPool, pool_id, user, "Benefit pool")
    if pool.status != "approved":
        raise Blocked("The benefit pool must be approved before payouts are prepared.", code="POOL_NOT_APPROVED",
                      details={"status": pool.status})
    if db.scalar(select(PayoutBatch).where(PayoutBatch.pool_id == pool.id)):
        raise Conflict("A payout batch already exists for this pool.", code="PAYOUT_BATCH_EXISTS")
    rule = db.get(BenefitRule, pool.rule_id)
    min_payout = money(rule.min_payout or 0)
    ents = entitlements(db, pool.id)
    batch = PayoutBatch(org_id=user.org_id, created_by=user.id, pool_id=pool.id,
                        code=_next_code(db, PayoutBatch, user.org_id, f"PB-{datetime.now(UTC).year}-"),
                        total_amount=money(sum((money(e.amount) for e in ents), Decimal(0))), status="draft")
    db.add(batch)
    db.flush()
    profiles = {p.farmer_id: p for p in db.scalars(select(PaymentProfile).where(
        PaymentProfile.farmer_id.in_([e.farmer_id for e in ents]))).all()} if ents else {}
    for e in ents:
        amt = money(e.amount)
        prof = profiles.get(e.farmer_id)
        status, reason = "pending", None
        if prof is None or not prof.verified:
            status, reason = "on_hold", "No verified payment details for this farmer yet."
        elif amt <= 0 or amt < min_payout:
            status, reason = "on_hold", f"Below the minimum payout of {min_payout} {pool.currency}; carried forward."
        db.add(Payout(org_id=user.org_id, created_by=user.id, batch_id=batch.id, entitlement_id=e.id,
                      farmer_id=e.farmer_id, amount=amt, status=status, failure_reason=reason, attempts=0))
    audit(db, user, "payout_batch.create", batch)
    return batch


def approve_payout_batch(db: Session, user: CurrentUser, batch_id: str) -> PayoutBatch:
    b = get_owned(db, PayoutBatch, batch_id, user, "Payout batch")
    if b.status != "draft":
        raise IllegalTransition(f"Only a draft payout batch can be approved; this one is {b.status}.")
    ensure_not_author(user.id, b.created_by, what="a payout batch")
    before = snapshot(b)
    b.status, b.approved_by, b.approved_at = "approved", user.id, utcnow()
    audit(db, user, "payout_batch.approve", b, before=before)
    return b


def _pay(db: Session, user: CurrentUser, p: Payout, currency: str) -> None:
    if p.status == "paid" or (p.provider_ref and p.paid_at):  # never pay twice
        return
    prof = db.scalar(select(PaymentProfile).where(PaymentProfile.farmer_id == p.farmer_id))
    before = snapshot(p)
    p.attempts = (p.attempts or 0) + 1
    provider_name, ref = None, None
    if prof is None or not prof.verified:
        p.status, p.failure_reason = "failed", "Payment details are missing or not verified."
    else:
        provider = get_payout_provider()
        provider_name = provider.name
        res = provider.pay(idempotency_key=str(p.id), amount=money(p.amount), currency=currency, profile=_ref(prof))
        ref = res.provider_ref
        if res.ok:
            p.status, p.provider_ref, p.paid_at, p.failure_reason = "paid", res.provider_ref, utcnow(), None
        else:
            p.status, p.failure_reason = "failed", res.reason
    db.add(PaymentAttempt(org_id=p.org_id, created_by=user.id, payout_id=p.id, batch_id=p.batch_id,
                          attempt_no=p.attempts, provider=provider_name, provider_ref=ref, amount=money(p.amount),
                          currency=currency, status=p.status, error=p.failure_reason if p.status == "failed" else None))
    audit(db, user, "payout.attempt", p, before=before)


def _settle(db: Session, user: CurrentUser, b: PayoutBatch, released: list[Payout] | None = None) -> None:
    lines = db.scalars(select(Payout).where(Payout.batch_id == b.id)).all()
    before = snapshot(b)
    was = b.status
    b.status = "partially_failed" if any(x.status == "failed" for x in lines) else "completed"
    if b.status != was:
        audit(db, user, f"payout_batch.{b.status}", b, before=before)
    if b.status != "completed":
        return
    pool = db.get(BenefitPool, b.pool_id)
    if pool.status != "paid" and not any(x.status in ("on_hold", "pending") for x in lines):
        pb = snapshot(pool)
        pool.status = "paid"
        audit(db, user, "benefit_pool.paid", pool, before=pb)
    if was != "completed":
        paid = [x for x in lines if x.status == "paid"]
    else:  # a held payout released after the batch completed: announce only that payment
        paid = [x for x in (released or []) if x.status == "paid"]
        if not paid:
            return
    emit(db, user, "payout.completed", b, {
        "code": b.code, "paid": len(paid), "on_hold": sum(1 for x in lines if x.status == "on_hold"),
        "amount_paid": str(money(sum((money(x.amount) for x in paid), Decimal(0)))), "currency": pool.currency,
        "payout_ids": [str(x.id) for x in paid], "released": was == "completed",
    })


def submit_payout_batch(db: Session, user: CurrentUser, batch_id: str) -> PayoutBatch:
    b = get_owned(db, PayoutBatch, batch_id, user, "Payout batch")
    locked = db.execute(select(PayoutBatch).where(PayoutBatch.id == b.id).with_for_update()).scalar_one()
    if locked.status != "approved":
        raise IllegalTransition(
            "Only an approved payout batch can be submitted." if locked.status == "draft"
            else f"This batch was already submitted ({locked.status}). Retry individual failed payouts instead.")
    pool = db.get(BenefitPool, b.pool_id)
    before = snapshot(b)
    b.status = "submitted"
    audit(db, user, "payout_batch.submit", b, before=before)
    for p in db.scalars(select(Payout).where(Payout.batch_id == b.id, Payout.status == "pending")
                        .order_by(Payout.farmer_id)).all():
        _pay(db, user, p, pool.currency)
    db.flush()
    _settle(db, user, b)
    return b


def retry_payout(db: Session, user: CurrentUser, payout_id: str) -> Payout:
    p = get_owned(db, Payout, payout_id, user, "Payout")
    if p.status != "failed":
        raise IllegalTransition(f"Only failed payouts can be retried; this one is {p.status}.")
    b = db.get(PayoutBatch, p.batch_id)
    pool = db.get(BenefitPool, b.pool_id)
    _pay(db, user, p, pool.currency)
    db.flush()
    _settle(db, user, b)
    return p


def payout_batch_out(db: Session, b: PayoutBatch) -> dict[str, Any]:
    lines = db.scalars(select(Payout).where(Payout.batch_id == b.id).order_by(Payout.farmer_id)).all()
    names = {f.id: f.full_name for f in db.scalars(select(Farmer).where(Farmer.id.in_([x.farmer_id for x in lines]))).all()} \
        if lines else {}
    counts: dict[str, int] = defaultdict(int)
    for x in lines:
        counts[x.status] += 1
    return {
        "id": str(b.id), "code": b.code, "pool_id": str(b.pool_id), "total_amount": _s(b.total_amount),
        "status": b.status, "approved_by": str(b.approved_by) if b.approved_by else None,
        "created_by": str(b.created_by) if b.created_by else None, "counts": dict(counts),
        "paid_amount": _s(sum((money(x.amount) for x in lines if x.status == "paid"), Decimal(0))),
        "lines": [{"id": str(x.id), "farmer_id": str(x.farmer_id), "farmer_name": names.get(x.farmer_id),
                   "amount": _s(x.amount), "status": x.status, "provider_ref": x.provider_ref,
                   "failure_reason": x.failure_reason, "paid_at": x.paid_at.isoformat() if x.paid_at else None,
                   "attempts": x.attempts} for x in lines],
    }


# ------------------------------------------------------------------ farmer statement
def statement(db: Session, user: CurrentUser, farmer_id: str) -> dict[str, Any]:
    farmer = farmer_for(db, user, farmer_id)
    ents = db.scalars(scoped(Entitlement, user).where(Entitlement.farmer_id == farmer.id)
                      .order_by(Entitlement.created_at)).all()
    items = []
    for e in ents:
        pool = db.get(BenefitPool, e.pool_id)
        if e.calc_version != max((x.calc_version for x in entitlements(db, pool.id)), default=e.calc_version):
            continue
        sale = db.get(Sale, pool.sale_id)
        rule = db.get(BenefitRule, pool.rule_id)
        payout = db.scalar(select(Payout).where(Payout.entitlement_id == e.id))
        amount = money(e.amount)
        inp = e.inputs or {}
        weights = ", ".join(f"{k} {float(v) * 100:.0f}%" for k, v in (rule.weights or {}).items())
        lines = [
            f"Sale {sale.code}: {sale.quantity:g} t of credits sold for {_s(pool.gross_amount)} {pool.currency}.",
            f"After deductions of {_s(pool.deductions_amount)} {pool.currency}, {float(rule.farmer_share_pct):g}% "
            f"goes to farmers: {_s(pool.farmer_pool_amount)} {pool.currency} shared between "
            f"{pool.breakdown.get('farmers', '?')} farmers.",
            f"Your share uses benefit rule version {rule.version} ({weights}): your enrolled area "
            f"{inp.get('area_ha', 0):g} ha and {inp.get('practices', 0)} recorded practices.",
            f"Your amount: {amount} {pool.currency}.",
        ]
        if payout is None:
            status = "not_scheduled"
            lines.append("Payment has not been scheduled yet.")
        elif payout.status == "paid":
            status = "paid"
            lines.append(f"Paid on {payout.paid_at.date().isoformat()} (reference {payout.provider_ref}).")
        elif payout.status == "on_hold":
            status = "on_hold"
            lines.append(f"On hold: {payout.failure_reason}")
        elif payout.status == "failed":
            status = "failed"
            lines.append(f"The payment did not go through: {payout.failure_reason} It will be retried.")
        else:
            status = "pending"
            lines.append("Payment is scheduled.")
        items.append({"pool_id": str(pool.id), "sale_code": sale.code, "rule_version": rule.version,
                      "inputs": inp, "amount": str(amount), "currency": pool.currency, "payout_status": status,
                      "lines": lines})
    total = sum((Decimal(i["amount"]) for i in items), Decimal(0))
    paid = sum((Decimal(i["amount"]) for i in items if i["payout_status"] == "paid"), Decimal(0))
    return {"farmer_id": str(farmer.id), "farmer_name": farmer.full_name, "items": items,
            "total_entitled": str(money(total)), "total_paid": str(money(paid))}
