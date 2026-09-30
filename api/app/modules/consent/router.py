from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.consent import service
from app.modules.consent.models import AgreementTemplate
from app.modules.consent.schemas import (
    AgreementOut, ConsentEventOut, ConsentIn, ConsentsOut, SignIn, SignOut, TemplateIn, TemplateOut, TemplatePatch,
)

router = APIRouter(tags=["Consent"])
_read = require(P.READ, P.MANAGE_PROGRAMMES)
_write = require(P.MANAGE_PROGRAMMES)
# Farmer records: staff, or the farmer themself (scope.farmer_id) for self-service.
_farmer_read = require(P.READ, P.MANAGE_FARMERS, P.FARMER_SELF)
_farmer_write = require(P.MANAGE_FARMERS, P.FARMER_SELF)
_STAFF_READ = (P.READ, P.MANAGE_FARMERS)
_STAFF_WRITE = (P.MANAGE_FARMERS,)


# ------------------------------------------------------------------ templates
@router.get("/agreement-templates", response_model=list[TemplateOut])
def list_templates(code: str | None = None, status: str | None = None,
                   user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.list_templates(db, user, code, status)


@router.post("/agreement-templates", response_model=TemplateOut, status_code=201)
def create_template(body: TemplateIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_template(db, user, body.model_dump())


@router.get("/agreement-templates/{template_id}", response_model=TemplateOut)
def get_template(template_id: str, user: CurrentUser = Depends(_farmer_read), db: Session = Depends(get_db)):
    return get_owned(db, AgreementTemplate, template_id, user, "Agreement")


@router.patch("/agreement-templates/{template_id}", response_model=TemplateOut)
def update_template(template_id: str, body: TemplatePatch, user: CurrentUser = Depends(_write),
                    db: Session = Depends(get_db)):
    return service.update_template(db, user, template_id, body.model_dump(exclude_unset=True))


@router.post("/agreement-templates/{template_id}/publish", response_model=TemplateOut)
def publish_template(template_id: str, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.publish_template(db, user, template_id)


@router.post("/agreement-templates/{template_id}/new-version", response_model=TemplateOut, status_code=201)
def new_version(template_id: str, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.new_template_version(db, user, template_id)


# ------------------------------------------------------------------ farmer agreements & consents
@router.get("/farmers/{farmer_id}/agreements", response_model=list[AgreementOut])
def list_agreements(farmer_id: str, user: CurrentUser = Depends(_farmer_read), db: Session = Depends(get_db)):
    farmer = service.farmer_for(db, user, farmer_id, _STAFF_READ)
    return service.list_agreements(db, user, farmer)


@router.post("/farmers/{farmer_id}/agreements", response_model=SignOut, status_code=201)
def sign_agreement(farmer_id: str, body: SignIn, user: CurrentUser = Depends(_farmer_write),
                   db: Session = Depends(get_db)):
    farmer = service.farmer_for(db, user, farmer_id, _STAFF_WRITE)
    agreement, events = service.sign_agreement(
        db, user, farmer, template_id=body.template_id, language=body.language, method=body.method,
        otp_code=body.otp_code,
    )
    return {"agreement": agreement, "consents": events}


@router.get("/farmers/{farmer_id}/consents", response_model=ConsentsOut)
def get_consents(farmer_id: str, user: CurrentUser = Depends(_farmer_read), db: Session = Depends(get_db)):
    farmer = service.farmer_for(db, user, farmer_id, _STAFF_READ)
    return service.consents(db, user, farmer)


@router.post("/farmers/{farmer_id}/consents", response_model=ConsentEventOut, status_code=201)
def record_consent(farmer_id: str, body: ConsentIn, user: CurrentUser = Depends(_farmer_write),
                   db: Session = Depends(get_db)):
    farmer = service.farmer_for(db, user, farmer_id, _STAFF_WRITE)
    return service.record_consent(db, user, farmer, purpose=body.purpose, granted=body.granted,
                                  channel=body.channel, notes=body.notes)
