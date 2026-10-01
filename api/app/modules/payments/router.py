from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.errors import NotFound, ValidationFailed
from app.core.permissions import P
from app.core.tenancy import get_owned, scoped
from app.modules.payments import reconciliation, service
from app.modules.payments.models import BenefitPool, BenefitRule, PaymentProfile, PayoutBatch
from app.modules.payments.schemas import BenefitRuleIn, BenefitRulePatch, PaymentProfileIn

router = APIRouter(tags=["Payments"])
_prepare = require(P.PREPARE_PAYOUT)
_approve = require(P.APPROVE_PAYOUT)
_read = require(P.READ, P.PREPARE_PAYOUT, P.APPROVE_PAYOUT)


# ------------------------------------------------------------------ benefit rules
@router.get("/benefit-rules")
def list_rules(programme_id: str | None = None, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    q = scoped(BenefitRule, user).order_by(BenefitRule.programme_id, BenefitRule.version.desc())
    if programme_id:
        try:
            q = q.where(BenefitRule.programme_id == uuid.UUID(programme_id))
        except ValueError as exc:
            raise ValidationFailed("programme_id is not a valid id.") from exc
    return [service.rule_out(r) for r in db.scalars(q).all()]


@router.post("/benefit-rules", status_code=201)
def create_rule(body: BenefitRuleIn, user: CurrentUser = Depends(_prepare), db: Session = Depends(get_db)):
    return service.rule_out(service.create_rule(db, user, body))


@router.get("/benefit-rules/{rule_id}")
def get_rule(rule_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.rule_out(get_owned(db, BenefitRule, rule_id, user, "Benefit rule"))


@router.patch("/benefit-rules/{rule_id}")
def update_rule(rule_id: str, body: BenefitRulePatch, user: CurrentUser = Depends(_prepare),
                db: Session = Depends(get_db)):
    return service.rule_out(service.update_rule(db, user, rule_id, body))


@router.post("/benefit-rules/{rule_id}/approve")
def approve_rule(rule_id: str, user: CurrentUser = Depends(_approve), db: Session = Depends(get_db)):
    return service.rule_out(service.approve_rule(db, user, rule_id))


# ------------------------------------------------------------------ pools
@router.post("/sales/{sale_id}/benefit-pool", status_code=201)
def create_pool(sale_id: str, user: CurrentUser = Depends(_prepare), db: Session = Depends(get_db)):
    return service.pool_out(db, service.create_pool(db, user, sale_id))


@router.get("/benefit-pools")
def list_pools(user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    rows = db.scalars(scoped(BenefitPool, user).order_by(BenefitPool.created_at.desc())).all()
    return [service.pool_out(db, p, lines=False) for p in rows]


@router.get("/benefit-pools/{pool_id}")
def get_pool(pool_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.pool_out(db, get_owned(db, BenefitPool, pool_id, user, "Benefit pool"))


@router.post("/benefit-pools/{pool_id}/approve")
def approve_pool(pool_id: str, user: CurrentUser = Depends(_approve), db: Session = Depends(get_db)):
    return service.pool_out(db, service.approve_pool(db, user, pool_id))


# ------------------------------------------------------------------ payment profiles
@router.get("/farmers/{farmer_id}/payment-profile")
def get_profile(farmer_id: str, user: CurrentUser = Depends(require(P.READ, P.PREPARE_PAYOUT, P.APPROVE_PAYOUT,
                                                                       P.FARMER_SELF)),
                db: Session = Depends(get_db)):
    farmer = service.farmer_for(db, user, farmer_id)
    p = db.scalar(select(PaymentProfile).where(PaymentProfile.farmer_id == farmer.id))
    if p is None:
        raise NotFound("No payment details have been added for this farmer.")
    return service.profile_out(p)


@router.put("/farmers/{farmer_id}/payment-profile")
def put_profile(farmer_id: str, body: PaymentProfileIn,
                user: CurrentUser = Depends(require(P.PREPARE_PAYOUT, P.FARMER_SELF)), db: Session = Depends(get_db)):
    return service.profile_out(service.put_profile(db, user, farmer_id, body))


@router.post("/farmers/{farmer_id}/payment-profile/verify")
def verify_profile(farmer_id: str, user: CurrentUser = Depends(_prepare), db: Session = Depends(get_db)):
    return service.profile_out(service.verify_profile(db, user, farmer_id))


@router.get("/farmers/{farmer_id}/statement")
def statement(farmer_id: str, user: CurrentUser = Depends(require(P.READ, P.PREPARE_PAYOUT, P.APPROVE_PAYOUT,
                                                                   P.FARMER_SELF)),
              db: Session = Depends(get_db)):
    return service.statement(db, user, farmer_id)


# ------------------------------------------------------------------ payouts
@router.post("/benefit-pools/{pool_id}/payout-batch", status_code=201)
def create_payout_batch(pool_id: str, user: CurrentUser = Depends(_prepare), db: Session = Depends(get_db)):
    return service.payout_batch_out(db, service.create_payout_batch(db, user, pool_id))


@router.get("/payout-batches")
def list_payout_batches(user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    rows = db.scalars(scoped(PayoutBatch, user).order_by(PayoutBatch.created_at.desc())).all()
    return [{k: v for k, v in service.payout_batch_out(db, b).items() if k != "lines"} for b in rows]


@router.get("/payout-batches/{batch_id}")
def get_payout_batch(batch_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.payout_batch_out(db, get_owned(db, PayoutBatch, batch_id, user, "Payout batch"))


@router.post("/payout-batches/{batch_id}/approve")
def approve_payout_batch(batch_id: str, user: CurrentUser = Depends(_approve), db: Session = Depends(get_db)):
    return service.payout_batch_out(db, service.approve_payout_batch(db, user, batch_id))


@router.post("/payout-batches/{batch_id}/submit")
def submit_payout_batch(batch_id: str, user: CurrentUser = Depends(require(P.PREPARE_PAYOUT, P.APPROVE_PAYOUT)),
                        db: Session = Depends(get_db)):
    return service.payout_batch_out(db, service.submit_payout_batch(db, user, batch_id))


@router.post("/payouts/{payout_id}/retry")
def retry_payout(payout_id: str, user: CurrentUser = Depends(require(P.PREPARE_PAYOUT, P.APPROVE_PAYOUT)),
                 db: Session = Depends(get_db)):
    p = service.retry_payout(db, user, payout_id)
    return service.payout_batch_out(db, db.get(PayoutBatch, p.batch_id))




# ------------------------------------------------------------------ release & reconciliation

@router.post("/payouts/{payout_id}/release")
def release_payout(payout_id: str, user: CurrentUser = Depends(_approve), db: Session = Depends(get_db)):
    p = reconciliation.release_payout(db, user, payout_id)
    return service.payout_batch_out(db, db.get(PayoutBatch, p.batch_id))


@router.get("/payout-batches/{batch_id}/attempts")
def payment_attempts(batch_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return reconciliation.attempts(db, user, batch_id)


@router.post("/payout-batches/{batch_id}/reconcile", status_code=201)
async def reconcile(batch_id: str, file: UploadFile = File(...),
                    user: CurrentUser = Depends(require(P.PREPARE_PAYOUT, P.APPROVE_PAYOUT)),
                    db: Session = Depends(get_db)):
    data = await file.read()
    run = reconciliation.reconcile(db, user, batch_id, data, file.filename or "statement.csv")
    return reconciliation.run_out(db, run)


@router.get("/payout-batches/{batch_id}/reconciliation")
def reconciliation_report(batch_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return reconciliation.report(db, user, batch_id)
