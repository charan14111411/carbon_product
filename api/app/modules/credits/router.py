from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned, scoped
from app.modules.credits import service
from app.modules.credits.models import Buyer, CreditBatch, Sale
from app.modules.credits.schemas import (
    BuyerIn, BuyerPatch, CancelSaleIn, ContractIn, IssueIn, ReasonIn, RetireIn, SaleIn,
)

router = APIRouter(tags=["Credits & sales"])
_credits = require(P.MANAGE_CREDITS)
_sales = require(P.MANAGE_SALES)
_read = require(P.READ, P.MANAGE_CREDITS, P.MANAGE_SALES)


# ------------------------------------------------------------------ batches
@router.post("/calculations/{run_id}/credit-batch", status_code=201)
def create_batch(run_id: str, user: CurrentUser = Depends(_credits), db: Session = Depends(get_db)):
    return service.batch_out(db, service.create_batch(db, user, run_id), moves=True)


@router.get("/credit-batches")
def list_batches(project_id: str | None = None, status: str | None = None, user: CurrentUser = Depends(_read),
                 db: Session = Depends(get_db)):
    return [service.batch_out(db, b) for b in service.list_batches(db, user, project_id, status)]


@router.get("/credit-batches/{batch_id}")
def get_batch(batch_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.batch_out(db, get_owned(db, CreditBatch, batch_id, user, "Credit batch"), moves=True)


@router.post("/credit-batches/{batch_id}/verify")
def verify_batch(batch_id: str, user: CurrentUser = Depends(_credits), db: Session = Depends(get_db)):
    return service.batch_out(db, service.verify_batch(db, user, batch_id))


@router.post("/credit-batches/{batch_id}/issue")
def issue_batch(batch_id: str, body: IssueIn, user: CurrentUser = Depends(_credits), db: Session = Depends(get_db)):
    return service.batch_out(db, service.issue_batch(db, user, batch_id, body))


@router.post("/credit-batches/{batch_id}/cancel")
def cancel_batch(batch_id: str, body: ReasonIn, user: CurrentUser = Depends(_credits), db: Session = Depends(get_db)):
    return service.batch_out(db, service.cancel_batch(db, user, batch_id, body.reason), moves=True)


# ------------------------------------------------------------------ buyers
@router.get("/buyers")
def list_buyers(user: CurrentUser = Depends(require(P.MANAGE_SALES, P.READ)), db: Session = Depends(get_db)):
    return [service.buyer_out(b) for b in db.scalars(scoped(Buyer, user).order_by(Buyer.name)).all()]


@router.post("/buyers", status_code=201)
def create_buyer(body: BuyerIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.buyer_out(service.create_buyer(db, user, body))


@router.get("/buyers/{buyer_id}")
def get_buyer(buyer_id: str, user: CurrentUser = Depends(require(P.MANAGE_SALES, P.READ)),
              db: Session = Depends(get_db)):
    return service.buyer_out(get_owned(db, Buyer, buyer_id, user, "Buyer"))


@router.patch("/buyers/{buyer_id}")
def update_buyer(buyer_id: str, body: BuyerPatch, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.buyer_out(service.update_buyer(db, user, buyer_id, body))


@router.get("/buyer/portfolio")
def buyer_portfolio(user: CurrentUser = Depends(require(P.BUYER_READ)), db: Session = Depends(get_db)):
    return service.portfolio(db, user)


# ------------------------------------------------------------------ sales
@router.get("/sales")
def list_sales(status: str | None = None, buyer_id: str | None = None, batch_id: str | None = None,
               user: CurrentUser = Depends(require(P.MANAGE_SALES, P.READ)), db: Session = Depends(get_db)):
    return [service.sale_out(db, s) for s in service.list_sales(db, user, status, buyer_id, batch_id)]


@router.post("/sales", status_code=201)
def create_sale(body: SaleIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.sale_out(db, service.create_sale(db, user, body))


@router.get("/sales/{sale_id}")
def get_sale(sale_id: str, user: CurrentUser = Depends(require(P.MANAGE_SALES, P.READ)),
             db: Session = Depends(get_db)):
    return service.sale_out(db, get_owned(db, Sale, sale_id, user, "Sale"))


@router.post("/sales/{sale_id}/contract")
def contract(sale_id: str, body: ContractIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.sale_out(db, service.contract_sale(db, user, sale_id, body.contract_ref, body.trade_date))


@router.post("/sales/{sale_id}/deliver")
def deliver(sale_id: str, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.sale_out(db, service.deliver_sale(db, user, sale_id))


@router.post("/sales/{sale_id}/retire")
def retire(sale_id: str, body: RetireIn, user: CurrentUser = Depends(_sales), db: Session = Depends(get_db)):
    return service.sale_out(db, service.retire_sale(db, user, sale_id, body.beneficiary))


@router.post("/sales/{sale_id}/cancel")
def cancel(sale_id: str, body: CancelSaleIn | None = None, user: CurrentUser = Depends(_sales),
           db: Session = Depends(get_db)):
    return service.sale_out(db, service.cancel_sale(db, user, sale_id, (body or CancelSaleIn()).reason))


@router.get("/sales/{sale_id}/report")
def sale_report(sale_id: str, user: CurrentUser = Depends(require(P.MANAGE_SALES, P.READ, P.BUYER_READ)),
                db: Session = Depends(get_db)):
    return service.sale_report(db, service.sale_for_report(db, user, sale_id))
