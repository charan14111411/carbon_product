from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.documents import service
from app.modules.documents.models import Document
from app.modules.documents.schemas import ApproveIn, DocumentIn, DocumentPatch, PolicyIn, PolicyPatch, VersionIn

router = APIRouter(tags=["Documents"])
_write = require(P.MANAGE_PROGRAMMES)
_approve = require(P.MANAGE_PROGRAMMES, P.APPROVE_RULES)
_read = require(P.READ, P.MANAGE_PROGRAMMES)


# ------------------------------------------------------------------ retention (declared before /{id})
@router.get("/documents/retention")
def retention(within_days: int = 365, status: str | None = None, user: CurrentUser = Depends(_read),
              db: Session = Depends(get_db)):
    return service.retention_report(db, user, max(0, min(within_days, 36500)), status)


@router.get("/documents/retention-policies")
def list_policies(user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return [service.policy_out(p) for p in service.list_policies(db, user)]


@router.post("/documents/retention-policies", status_code=201)
def create_policy(body: PolicyIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.policy_out(service.create_policy(db, user, body))


@router.post("/documents/retention-policies/install-defaults")
def install_defaults(user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.install_default_policies(db, user)


@router.patch("/documents/retention-policies/{policy_id}")
def update_policy(policy_id: str, body: PolicyPatch, user: CurrentUser = Depends(_write),
                  db: Session = Depends(get_db)):
    return service.policy_out(service.update_policy(db, user, policy_id, body))


# ------------------------------------------------------------------ documents
@router.get("/documents")
def list_documents(kind: str | None = None, entity_type: str | None = None, entity_id: str | None = None,
                   project_id: str | None = None, status: str | None = None, user: CurrentUser = Depends(_read),
                   db: Session = Depends(get_db)):
    rows = service.list_documents(db, user, kind=kind, entity_type=entity_type, entity_id=entity_id,
                                  project_id=project_id, status=status)
    return [service.document_out(db, d, detail=False) for d in rows]


@router.post("/documents", status_code=201)
def create_document(body: DocumentIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.document_out(db, service.create_document(db, user, body))


@router.get("/documents/{document_id}")
def get_document(document_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.document_out(db, get_owned(db, Document, document_id, user, "Document"))


@router.patch("/documents/{document_id}")
def update_document(document_id: str, body: DocumentPatch, user: CurrentUser = Depends(_write),
                    db: Session = Depends(get_db)):
    return service.document_out(db, service.update_document(db, user, document_id, body))


@router.post("/documents/{document_id}/versions", status_code=201)
def add_version(document_id: str, body: VersionIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    service.add_version(db, user, document_id, body.evidence_id, body.change_note)
    return service.document_out(db, get_owned(db, Document, document_id, user, "Document"))


@router.post("/documents/{document_id}/versions/{version}/approve")
def approve_version(document_id: str, version: int, body: ApproveIn, user: CurrentUser = Depends(_approve),
                    db: Session = Depends(get_db)):
    service.decide_version(db, user, document_id, version, body.decision, body.note)
    return service.document_out(db, get_owned(db, Document, document_id, user, "Document"))
