from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.calculation import service as calc_service
from app.modules.qa1 import service
from app.modules.qa1.models import Qa1Analysis, Qa1Model, Qa1TrueUp
from app.modules.qa1.schemas import AnalysisIn, ModelIn, ModelPatch, RunImportIn, TrueUpIn

router = APIRouter(tags=["QA1 Measure and Model"])
_read = require(P.READ)
_manage_models = require(P.MANAGE_MODELS)
_approve_models = require(P.APPROVE_MODELS)
_analyst = require(P.RUN_CALCULATION)


class ReasonIn(BaseModel):
    reason: str = Field(min_length=5, max_length=2000)


# ------------------------------------------------------------------ model registry (§4 cond. 4)
@router.get("/qa1/models")
def list_models(status: str | None = None, user: CurrentUser = Depends(_read),
                db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.model_out(m) for m in service.list_models(db, user, status)]


@router.post("/qa1/models", status_code=201)
def create_model(body: ModelIn, user: CurrentUser = Depends(_manage_models),
                 db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.model_out(service.create_model(db, user, body))


@router.get("/qa1/models/{model_id}")
def get_model(model_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.model_out(get_owned(db, Qa1Model, model_id, user, "Model"))


@router.patch("/qa1/models/{model_id}")
def update_model(model_id: str, body: ModelPatch, user: CurrentUser = Depends(_manage_models),
                 db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.model_out(service.update_model(db, user, model_id, body))


@router.post("/qa1/models/{model_id}/approve")
def approve_model(model_id: str, user: CurrentUser = Depends(_approve_models),
                  db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.model_out(service.approve_model(db, user, model_id))


@router.post("/qa1/models/{model_id}/retire")
def retire_model(model_id: str, body: ReasonIn, user: CurrentUser = Depends(_approve_models),
                 db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.model_out(service.retire_model(db, user, model_id, body.reason))


# ------------------------------------------------------------------ model runs (MODELLED data)
@router.post("/projects/{project_id}/qa1/run-imports", status_code=201)
def create_import(project_id: str, body: RunImportIn, user: CurrentUser = Depends(_analyst),
                  db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.import_out(service.create_import(db, user, project_id, body))


@router.get("/projects/{project_id}/qa1/run-imports")
def list_imports(project_id: str, user: CurrentUser = Depends(_read),
                 db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.import_out(i) for i in service.list_imports(db, user, project_id)]


@router.get("/qa1/run-imports/{import_id}")
def get_import(import_id: str, include_rows: bool = False, user: CurrentUser = Depends(_read),
               db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.import_detail(db, user, import_id, include_rows)


# ------------------------------------------------------------------ analyses → draft terms
@router.post("/projects/{project_id}/qa1/analyses", status_code=201)
def create_analysis(project_id: str, body: AnalysisIn, user: CurrentUser = Depends(_analyst),
                    db: Session = Depends(get_db)) -> dict[str, Any]:
    an = service.compute_analysis(db, user, project_id, body)
    db.flush()
    return service.analysis_out(db, an)


@router.get("/projects/{project_id}/qa1/analyses")
def list_analyses(project_id: str, user: CurrentUser = Depends(_read),
                  db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.analysis_out(db, a) for a in service.list_analyses(db, user, project_id)]


@router.get("/qa1/analyses/{analysis_id}")
def get_analysis(analysis_id: str, user: CurrentUser = Depends(_read),
                 db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.analysis_out(db, get_owned(db, Qa1Analysis, analysis_id, user, "QA1 analysis"))


@router.post("/qa1/analyses/{analysis_id}/publish", status_code=201)
def publish(analysis_id: str, user: CurrentUser = Depends(_analyst), db: Session = Depends(get_db)) -> dict[str, Any]:
    """Create DRAFT term estimates; a second person approves them with POST /terms/{id}/approve."""
    an, terms = service.publish(db, user, analysis_id)
    db.flush()
    return {"analysis": service.analysis_out(db, an), "terms": [calc_service.term_out(t) for t in terms]}


# ------------------------------------------------------------------ true-up (§8.6.1.3)
@router.get("/projects/{project_id}/qa1/status")
def project_status(project_id: str, user: CurrentUser = Depends(_read),
                   db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.project_status(db, user, project_id)


@router.post("/projects/{project_id}/qa1/trueups", status_code=201)
def create_trueup(project_id: str, body: TrueUpIn, user: CurrentUser = Depends(_analyst),
                  db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.trueup_out(service.create_trueup(db, user, project_id, body))


@router.get("/projects/{project_id}/qa1/trueups")
def list_trueups(project_id: str, user: CurrentUser = Depends(_read),
                 db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.trueup_out(t) for t in service.list_trueups(db, user, project_id)]


@router.get("/qa1/trueups/{trueup_id}")
def get_trueup(trueup_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.trueup_out(get_owned(db, Qa1TrueUp, trueup_id, user, "True-up"))


@router.post("/qa1/trueups/{trueup_id}/approve")
def approve_trueup(trueup_id: str, user: CurrentUser = Depends(_approve_models),
                   db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.trueup_out(service.approve_trueup(db, user, trueup_id))
