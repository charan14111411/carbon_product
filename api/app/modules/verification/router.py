from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Header
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.evidence import service as evidence
from app.modules.verification import service
from app.modules.verification.models import VerificationPackage, VerifierAccess
from app.modules.verification.schemas import AnswerIn, DecisionIn, VerifierAccessIn, VerifierQueryIn

router = APIRouter(tags=["Verification"])
_read = require(P.READ)
_issue = require(P.ISSUE_PACKAGE)


# ------------------------------------------------------------------ packages (team)
@router.post("/calculations/{run_id}/package", status_code=201)
def issue_package(run_id: str, user: CurrentUser = Depends(_issue), db: Session = Depends(get_db)) -> dict[str, Any]:
    vp = service.issue_package(db, user, run_id)
    db.flush()
    return service.package_out(vp)


@router.get("/projects/{project_id}/packages")
def list_packages(project_id: str, user: CurrentUser = Depends(_read),
                  db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.package_out(p) for p in service.list_packages(db, user, project_id)]


@router.get("/packages/{package_id}")
def get_package(package_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.package_out(get_owned(db, VerificationPackage, package_id, user, "Package"))


@router.get("/packages/{package_id}/annex.csv")
def package_annex(package_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    vp = get_owned(db, VerificationPackage, package_id, user, "Package")
    return Response(service.annex_csv(db, vp), media_type="text/csv",
                    headers={"Content-Disposition": f'attachment; filename="annex_v{vp.version}.csv"'})


@router.get("/packages/{package_id}/verify")
def verify_package(package_id: str, user: CurrentUser = Depends(_read),
                   db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.verify_package(db, get_owned(db, VerificationPackage, package_id, user, "Package"))


# ------------------------------------------------------------------ verifier access (team)
@router.post("/packages/{package_id}/verifier-access", status_code=201)
def grant_access(package_id: str, body: VerifierAccessIn, user: CurrentUser = Depends(_issue),
                 db: Session = Depends(get_db)) -> dict[str, Any]:
    acc, token = service.grant_access(db, user, package_id, body)
    db.flush()
    return {"access": service.access_out(acc), "token": token,
            "note": "Share this token with the verifier now. It is shown only once."}


@router.get("/packages/{package_id}/verifier-access")
def list_access(package_id: str, user: CurrentUser = Depends(_read),
                db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.access_out(a) for a in service.list_access(db, user, package_id)]


@router.post("/verifier-access/{access_id}/revoke")
def revoke_access(access_id: str, user: CurrentUser = Depends(_issue), db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.access_out(service.revoke_access(db, user, access_id))


@router.get("/packages/{package_id}/queries")
def package_queries(package_id: str, user: CurrentUser = Depends(_read),
                    db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return service.package_queries(db, user, package_id)


@router.post("/verifier-queries/{query_id}/answer")
def answer_query(query_id: str, body: AnswerIn, user: CurrentUser = Depends(require(P.ISSUE_PACKAGE, P.RUN_CALCULATION)),
                 db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.query_out(service.answer_query(db, user, query_id, body.answer))


# ------------------------------------------------------------------ verifier portal (token, no sign-in)
def verifier(x_verifier_token: str | None = Header(default=None), db: Session = Depends(get_db)) -> VerifierAccess:
    return service.resolve_token(db, x_verifier_token)


@router.get("/verifier/session", tags=["Verifier portal"])
def verifier_session(acc: VerifierAccess = Depends(verifier), db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.verifier_session(db, acc)


@router.get("/verifier/package", tags=["Verifier portal"])
def verifier_package(acc: VerifierAccess = Depends(verifier), db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.verifier_package(db, acc)


@router.get("/verifier/files/{evidence_id}", tags=["Verifier portal"])
def verifier_file(evidence_id: str, acc: VerifierAccess = Depends(verifier), db: Session = Depends(get_db)):
    rec = service.verifier_file(db, acc, evidence_id)
    return Response(
        evidence.read_bytes(rec), media_type=rec.mime_type,
        headers={"Content-Disposition": f'inline; filename="{rec.filename}"', "X-Content-SHA256": rec.sha256},
    )


@router.get("/verifier/provenance/{run_id}", tags=["Verifier portal"])
def verifier_provenance(run_id: str, acc: VerifierAccess = Depends(verifier),
                        db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.verifier_provenance(db, acc, run_id)


@router.post("/verifier/queries", status_code=201, tags=["Verifier portal"])
def verifier_ask(body: VerifierQueryIn, acc: VerifierAccess = Depends(verifier),
                 db: Session = Depends(get_db)) -> dict[str, Any]:
    q = service.verifier_ask(db, acc, body)
    db.flush()
    return service.query_out(q)


@router.get("/verifier/queries", tags=["Verifier portal"])
def verifier_queries(acc: VerifierAccess = Depends(verifier), db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.query_out(q) for q in service.verifier_queries(db, acc)]


@router.post("/verifier/decision", tags=["Verifier portal"])
def verifier_decision(body: DecisionIn, acc: VerifierAccess = Depends(verifier),
                      db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.access_out(service.verifier_decide(db, acc, body))
