from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.offtake import service
from app.modules.offtake.schemas import AgreementIn, AgreementPatch, CloseIn, OfferIn, OfferPatch, RespondIn, SignIn

router = APIRouter(tags=["Offers & offtake"])
_sales = require(P.MANAGE_SALES)
_read = require(P.MANAGE_SALES, P.READ, P.BUYER_READ)
_respond = require(P.MANAGE_SALES, P.BUYER_READ)


# ------------------------------------------------------------------ offers
@router.get("/offers")
def list_offers(status: str | None = None, buyer_id: str | None = None, user: CurrentUser = Depends(_read),
                db: Session = Depends(get_db)):
    return [service.offer_out(db, o) for o in service.list_offers(db, user, status, buyer_id)]


@router.post("/offers", status_code=201)
def create_offer(body: OfferIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.offer_out(db, service.create_offer(db, user, body))


@router.post("/offers/expire-due")
def expire_due(user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.expire_due(db, user)


@router.get("/offers/{offer_id}")
def get_offer(offer_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.offer_out(db, service.get_offer(db, user, offer_id))


@router.patch("/offers/{offer_id}")
def update_offer(offer_id: str, body: OfferPatch, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.offer_out(db, service.update_offer(db, user, offer_id, body))


@router.post("/offers/{offer_id}/send")
def send_offer(offer_id: str, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.offer_out(db, service.send_offer(db, user, offer_id))


@router.post("/offers/{offer_id}/accept")
def accept_offer(offer_id: str, body: RespondIn, user: CurrentUser = Depends(_respond), db: Session = Depends(get_db)):
    return service.offer_out(db, service.respond_offer(db, user, offer_id, True, body.note))


@router.post("/offers/{offer_id}/reject")
def reject_offer(offer_id: str, body: RespondIn, user: CurrentUser = Depends(_respond), db: Session = Depends(get_db)):
    return service.offer_out(db, service.respond_offer(db, user, offer_id, False, body.note))


@router.post("/offers/{offer_id}/withdraw")
def withdraw_offer(offer_id: str, body: RespondIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.offer_out(db, service.withdraw_offer(db, user, offer_id, body.note))


# ------------------------------------------------------------------ agreements
@router.get("/offtake-agreements")
def list_agreements(status: str | None = None, buyer_id: str | None = None, user: CurrentUser = Depends(_read),
                    db: Session = Depends(get_db)):
    return [service.agreement_out(db, a) for a in service.list_agreements(db, user, status, buyer_id)]


@router.post("/offtake-agreements", status_code=201)
def create_agreement(body: AgreementIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.agreement_out(db, service.create_agreement(db, user, body))


@router.get("/offtake-agreements/{agreement_id}")
def get_agreement(agreement_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.agreement_out(db, service.get_agreement(db, user, agreement_id), deliveries=True)


@router.patch("/offtake-agreements/{agreement_id}")
def update_agreement(agreement_id: str, body: AgreementPatch, user: CurrentUser = Depends(_sales),
                     db: Session = Depends(get_db)):
    return service.agreement_out(db, service.update_agreement(db, user, agreement_id, body))


@router.post("/offtake-agreements/{agreement_id}/sign")
def sign_agreement(agreement_id: str, body: SignIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.agreement_out(db, service.sign_agreement(db, user, agreement_id, body.contract_evidence_id,
                                                            body.signed_on))


@router.post("/offtake-agreements/{agreement_id}/activate")
def activate(agreement_id: str, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.agreement_out(db, service.move_agreement(db, user, agreement_id, "active", ""))


@router.post("/offtake-agreements/{agreement_id}/complete")
def complete(agreement_id: str, body: CloseIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.agreement_out(db, service.move_agreement(db, user, agreement_id, "completed", body.reason))


@router.post("/offtake-agreements/{agreement_id}/terminate")
def terminate(agreement_id: str, body: CloseIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.agreement_out(db, service.move_agreement(db, user, agreement_id, "terminated", body.reason))


@router.get("/offtake-agreements/{agreement_id}/deliveries")
def deliveries(agreement_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.delivery_report(db, service.get_agreement(db, user, agreement_id))
