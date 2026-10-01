"""Releasing held payouts and reconciling a batch against the provider's settlement statement.

Reconciliation never changes a payout: it records what the statement says against what the
platform believes was paid, and flags every difference for finance to investigate.
"""

from __future__ import annotations

import csv
import io
import uuid
from collections import Counter, defaultdict
from decimal import Decimal, InvalidOperation
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.errors import Blocked, IllegalTransition, NotFound, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.identity.models import AuditEntry
from app.modules.payments import service
from app.modules.payments.domain import money
from app.modules.payments.models import (
    BenefitPool, BenefitRule, PaymentAttempt, PaymentProfile, Payout, PayoutBatch, ReconciliationItem,
    ReconciliationRun,
)

PAID_WORDS = {"paid", "success", "succeeded", "successful", "settled", "completed", "processed"}
FAILED_WORDS = {"failed", "failure", "rejected", "returned", "reversed", "cancelled", "canceled"}
REQUIRED_COLUMNS = ("provider_ref", "amount", "status")


# ------------------------------------------------------------------ release held payouts
def release_payout(db: Session, user: CurrentUser, payout_id: str) -> Payout:
    p = get_owned(db, Payout, payout_id, user, "Payout")
    if p.status != "on_hold":
        raise IllegalTransition(f"Only a payout on hold can be released; this one is {p.status}.")
    b = db.get(PayoutBatch, p.batch_id)
    pool = db.get(BenefitPool, b.pool_id)
    rule = db.get(BenefitRule, pool.rule_id)
    prof = db.scalar(select(PaymentProfile).where(PaymentProfile.farmer_id == p.farmer_id))
    if prof is None or not prof.verified:
        raise Blocked("The farmer's payment details must be verified before the payout is released.",
                      code="PROFILE_NOT_VERIFIED")
    minimum = money(rule.min_payout or 0)
    if money(p.amount) <= 0 or money(p.amount) < minimum:
        raise Blocked(f"The amount is below the minimum payout of {minimum} {pool.currency}; it stays carried "
                      "forward.", code="BELOW_MINIMUM")
    verifiers = db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == user.org_id, AuditEntry.entity_id == str(prof.id),
        AuditEntry.action == "payment_profile.verify")).all()
    ensure_not_author(user.id, b.created_by, *verifiers, what="a payout release (you prepared the batch or "
                                                                "verified these payment details)")
    before = snapshot(p)
    p.status, p.failure_reason = "pending", None
    audit(db, user, "payout.release", p, before=before)
    if b.status in ("submitted", "completed", "partially_failed"):
        service._pay(db, user, p, pool.currency)
        db.flush()
        service._settle(db, user, b, released=[p])
    return p


# ------------------------------------------------------------------ reconciliation
def _norm_status(raw: str) -> str:
    v = raw.strip().lower()
    if v in PAID_WORDS:
        return "paid"
    if v in FAILED_WORDS:
        return "failed"
    return v or "unknown"


def parse_statement(data: bytes) -> list[dict[str, Any]]:
    try:
        text = data.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ValidationFailed("The statement must be a UTF-8 CSV file.", code="INVALID_STATEMENT") from exc
    reader = csv.DictReader(io.StringIO(text))
    headers = [h.strip().lower() for h in (reader.fieldnames or [])]
    missing = [c for c in REQUIRED_COLUMNS if c not in headers]
    if missing:
        raise ValidationFailed(f"The statement needs the columns {', '.join(REQUIRED_COLUMNS)}; missing "
                               f"{', '.join(missing)}.", code="INVALID_STATEMENT", details={"missing": missing})
    rows, errors = [], []
    for i, raw in enumerate(reader, start=2):  # row 1 is the header
        row = {(k or "").strip().lower(): (v or "").strip() for k, v in raw.items()}
        if not any(row.values()):
            continue
        if not row["provider_ref"]:
            errors.append({"row": i, "message": "The provider reference is empty."})
            continue
        try:
            amount = money(Decimal(row["amount"].replace(",", "")))
        except (InvalidOperation, ValueError):
            errors.append({"row": i, "message": f"'{row['amount']}' is not an amount."})
            continue
        rows.append({"row": i, "provider_ref": row["provider_ref"], "amount": amount, "status_raw": row["status"],
                     "status": _norm_status(row["status"])})
    if errors:
        raise ValidationFailed(f"{len(errors)} row(s) in the statement can't be read.", code="INVALID_STATEMENT",
                               details={"errors": errors[:50]})
    if not rows:
        raise ValidationFailed("The statement has no rows.", code="INVALID_STATEMENT")
    return rows


def reconcile(db: Session, user: CurrentUser, batch_id: str, data: bytes, filename: str) -> ReconciliationRun:
    from app.modules.evidence import service as evidence_service

    b = get_owned(db, PayoutBatch, batch_id, user, "Payout batch")
    if b.status in ("draft", "approved"):
        raise Blocked("Only a submitted batch can be reconciled.", code="BATCH_NOT_SUBMITTED")
    rows = parse_statement(data)
    ev = evidence_service.store(db, user, data=data, filename=filename or "statement.csv", mime_type="text/csv",
                                kind="document", entity_type="payout_batch", entity_id=str(b.id),
                                meta={"purpose": "settlement_statement"})
    run = ReconciliationRun(org_id=user.org_id, created_by=user.id, batch_id=b.id, statement_evidence_id=ev.id,
                            statement_sha256=ev.sha256, rows=len(rows), status="mismatches", counts={})
    db.add(run)
    db.flush()

    payouts = db.scalars(select(Payout).where(Payout.batch_id == b.id)).all()
    expected = {p.provider_ref: p for p in payouts if p.status == "paid" and p.provider_ref}
    by_ref_any = {p.provider_ref: p for p in payouts if p.provider_ref}
    items: list[ReconciliationItem] = []

    def item(outcome: str, **kw: Any) -> None:
        items.append(ReconciliationItem(org_id=user.org_id, created_by=user.id, run_id=run.id, batch_id=b.id,
                                        outcome=outcome, **kw))

    paid_attempts: dict[uuid.UUID, set[str]] = defaultdict(set)
    for a in db.scalars(select(PaymentAttempt).where(PaymentAttempt.batch_id == b.id,
                                                     PaymentAttempt.status == "paid")).all():
        paid_attempts[a.payout_id].add(a.provider_ref or "")
    for pid, refs in paid_attempts.items():
        if len(refs) > 1:
            item("duplicate_payment", payout_id=pid, note=f"Paid more than once: {', '.join(sorted(refs))}.")

    seen: set[str] = set()
    for r in rows:
        ref = r["provider_ref"]
        common = {"provider_ref": ref, "row_no": r["row"], "statement_amount": r["amount"],
                  "statement_status": r["status_raw"]}
        if ref in seen:
            item("duplicate_in_statement", payout_id=by_ref_any[ref].id if ref in by_ref_any else None,
                 note="This reference appears more than once in the statement.", **common)
            continue
        seen.add(ref)
        p = expected.get(ref)
        if p is None:
            known = by_ref_any.get(ref)
            item("unknown_ref", payout_id=known.id if known else None,
                 note="No paid payout in this batch has this reference." if known is None
                 else f"The payout with this reference is {known.status}, not paid.", **common)
            continue
        exp = money(p.amount)
        if r["amount"] != exp:
            item("amount_mismatch", payout_id=p.id, expected_amount=exp,
                 note=f"Statement shows {r['amount']}, the payout was {exp}.", **common)
        elif r["status"] != "paid":
            item("status_mismatch", payout_id=p.id, expected_amount=exp,
                 note=f"The provider reports '{r['status_raw']}' but the payout is recorded as paid.", **common)
        else:
            item("matched", payout_id=p.id, expected_amount=exp, **common)
    for ref, p in sorted(expected.items()):
        if ref not in seen:
            item("missing_in_statement", payout_id=p.id, provider_ref=ref, expected_amount=money(p.amount),
                 note="A payment recorded as paid is not on the provider's statement.")
    for it in items:
        db.add(it)
    counts = Counter(i.outcome for i in items)
    run.counts = dict(counts)
    run.status = "reconciled" if counts and set(counts) == {"matched"} else "mismatches"
    audit(db, user, "payout_batch.reconcile", run)
    return run


def item_out(i: ReconciliationItem) -> dict[str, Any]:
    return {"id": str(i.id), "outcome": i.outcome, "payout_id": str(i.payout_id) if i.payout_id else None,
            "provider_ref": i.provider_ref, "row_no": i.row_no,
            "expected_amount": None if i.expected_amount is None else str(money(i.expected_amount)),
            "statement_amount": None if i.statement_amount is None else str(money(i.statement_amount)),
            "statement_status": i.statement_status, "note": i.note}


def run_out(db: Session, r: ReconciliationRun, items: bool = True) -> dict[str, Any]:
    out = {"id": str(r.id), "batch_id": str(r.batch_id), "statement_evidence_id": str(r.statement_evidence_id),
           "statement_sha256": r.statement_sha256, "rows": r.rows, "status": r.status, "counts": r.counts,
           "created_by": str(r.created_by) if r.created_by else None, "created_at": r.created_at.isoformat()}
    if items:
        rows = db.scalars(select(ReconciliationItem).where(ReconciliationItem.run_id == r.id)
                          .order_by(ReconciliationItem.row_no, ReconciliationItem.provider_ref)).all()
        out["items"] = [item_out(i) for i in rows]
        out["exceptions"] = [item_out(i) for i in rows if i.outcome != "matched"]
    return out


def report(db: Session, user: CurrentUser, batch_id: str) -> dict[str, Any]:
    b = get_owned(db, PayoutBatch, batch_id, user, "Payout batch")
    runs = db.scalars(scoped(ReconciliationRun, user).where(ReconciliationRun.batch_id == b.id)
                      .order_by(ReconciliationRun.created_at.desc())).all()
    if not runs:
        raise NotFound("This batch has not been reconciled yet. Upload the provider's settlement statement.")
    return {"batch_id": str(b.id), "batch_code": b.code, "latest": run_out(db, runs[0]),
            "history": [run_out(db, r, items=False) for r in runs]}


def attempts(db: Session, user: CurrentUser, batch_id: str) -> list[dict[str, Any]]:
    b = get_owned(db, PayoutBatch, batch_id, user, "Payout batch")
    rows = db.scalars(select(PaymentAttempt).where(PaymentAttempt.batch_id == b.id)
                      .order_by(PaymentAttempt.payout_id, PaymentAttempt.attempt_no)).all()
    return [{"id": str(a.id), "payout_id": str(a.payout_id), "attempt_no": a.attempt_no, "provider": a.provider,
             "provider_ref": a.provider_ref, "amount": str(money(a.amount)), "currency": a.currency,
             "status": a.status, "error": a.error, "at": a.created_at.isoformat()} for a in rows]
