from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.errors import NotFound
from app.core.permissions import P
from app.core.tenancy import get_owned, scoped
from app.modules.intelligence import service
from app.modules.intelligence.models import FeatureSet, ModelVersion
from app.modules.intelligence.schemas import (
    DetectionIn, DriftIn, DriftReviewIn, FeatureSetIn, MaterializeIn, SocMapIn, TrainIn, WindowIn,
)
from app.modules.supporting import service as supporting

router = APIRouter(tags=["Intelligence"])
_read = require(P.READ, P.MANAGE_MODELS)


# ------------------------------------------------------------------ satellite
@router.post("/fields/{field_id}/satellite/refresh", status_code=201)
def refresh(field_id: str, body: WindowIn, user: CurrentUser = Depends(require(P.SYNC_DATA)),
            db: Session = Depends(get_db)):
    return service.refresh_satellite(db, user, supporting.get_field(db, user, field_id), body.start, body.end)


@router.get("/fields/{field_id}/satellite")
def satellite(field_id: str, index: str = "ndvi", start: date | None = None, end: date | None = None,
              include_cloudy: bool = False, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.satellite_series(db, supporting.get_field(db, user, field_id), index, start, end, include_cloudy)


@router.get("/projects/{project_id}/satellite/alerts")
def alerts(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.satellite_alerts(db, user, supporting.get_project(db, user, project_id))


# ------------------------------------------------------------------ practice detection
@router.post("/projects/{project_id}/practice-detection/run", status_code=201)
def run_detection(project_id: str, body: DetectionIn,
                  user: CurrentUser = Depends(require(P.SYNC_DATA, P.RUN_CALCULATION)),
                  db: Session = Depends(get_db)):
    return service.run_detection(db, user, supporting.get_project(db, user, project_id), body.season_start,
                                 body.season_end, body.fallow_start, body.fallow_end)


@router.get("/projects/{project_id}/practice-detection")
def project_detections(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.project_detections(db, user, supporting.get_project(db, user, project_id))


@router.get("/fields/{field_id}/practice-detection")
def field_detections(field_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.field_detections(db, user, supporting.get_field(db, user, field_id))


# ------------------------------------------------------------------ models
@router.post("/models/soc/train", status_code=201)
def train(body: TrainIn, user: CurrentUser = Depends(require(P.MANAGE_MODELS)), db: Session = Depends(get_db)):
    mv = service.train_soc(db, user, name=body.name, features=body.features, project_id=body.project_id,
                           ridge_lambda=body.ridge_lambda, feature_set_id=body.feature_set_id)
    return service.model_out(mv, full=True)


@router.get("/models")
def list_models(name: str | None = None, status: str | None = None, user: CurrentUser = Depends(_read),
                db: Session = Depends(get_db)):
    q = scoped(ModelVersion, user).order_by(ModelVersion.name, ModelVersion.created_at.desc())
    if name:
        q = q.where(ModelVersion.name == name)
    if status:
        q = q.where(ModelVersion.status == status)
    return [service.model_out(m) for m in db.scalars(q).all()]


@router.get("/models/{model_id}")
def get_model(model_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.model_out(get_owned(db, ModelVersion, model_id, user, "Model"), full=True)


@router.post("/models/{model_id}/approve")
def approve(model_id: str, user: CurrentUser = Depends(require(P.APPROVE_MODELS)), db: Session = Depends(get_db)):
    return service.model_out(service.approve_model(db, user, model_id))


# ------------------------------------------------------------------ SOC map & sampling
@router.post("/projects/{project_id}/soc-map", status_code=201)
def create_soc_map(project_id: str, body: SocMapIn,
                   user: CurrentUser = Depends(require(P.MANAGE_MODELS, P.PLAN_SAMPLING)),
                   db: Session = Depends(get_db)):
    sm = service.soc_map(db, user, supporting.get_project(db, user, project_id), body.model_id, body.top_n)
    return service.soc_map_out(sm)


@router.get("/projects/{project_id}/soc-maps/latest")
def latest_soc_map(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    sm = service.latest_soc_map(db, user, supporting.get_project(db, user, project_id))
    if sm is None:
        raise NotFound("No soil-carbon map has been generated for this project yet.")
    return service.soc_map_out(sm)


@router.get("/projects/{project_id}/sampling-optimiser")
def sampling_optimiser(project_id: str, budget: int = Query(ge=1, le=10000),
                       user: CurrentUser = Depends(require(P.READ, P.PLAN_SAMPLING)), db: Session = Depends(get_db)):
    return service.sampling_optimiser(db, user, supporting.get_project(db, user, project_id), budget)


@router.get("/projects/{project_id}/emissions-estimate")
def emissions_estimate(project_id: str, start: date, end: date, user: CurrentUser = Depends(_read),
                       db: Session = Depends(get_db)):
    return service.emissions_estimate(db, user, supporting.get_project(db, user, project_id), start, end)


# ------------------------------------------------------------------ model drift
@router.post("/models/{model_id}/drift-check", status_code=201)
def drift_check(model_id: str, body: DriftIn | None = None, user: CurrentUser = Depends(require(P.MANAGE_MODELS)),
                db: Session = Depends(get_db)):
    rep = service.drift_check(db, user, model_id, body.model_dump() if body else None)
    return service.drift_out(rep)


@router.post("/models/{model_id}/drift-review")
def drift_review(model_id: str, body: DriftReviewIn, user: CurrentUser = Depends(require(P.APPROVE_MODELS)),
                 db: Session = Depends(get_db)):
    return service.model_out(service.resolve_drift_review(db, user, model_id, body.decision, body.note))


@router.get("/models/{model_id}/drift")
def drift_history(model_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.drift_reports(db, user, model_id)


# ------------------------------------------------------------------ feature store
@router.get("/feature-sets/catalogue")
def feature_catalogue(_: CurrentUser = Depends(_read)):
    return service.feature_catalogue()


@router.post("/feature-sets", status_code=201)
def create_feature_set(body: FeatureSetIn, user: CurrentUser = Depends(require(P.MANAGE_MODELS)),
                       db: Session = Depends(get_db)):
    return service.feature_set_out(service.create_feature_set(db, user, body.name, body.definition, body.description))


@router.get("/feature-sets")
def list_feature_sets(name: str | None = None, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    q = scoped(FeatureSet, user).order_by(FeatureSet.name, FeatureSet.version.desc())
    if name:
        q = q.where(FeatureSet.name == name)
    return [service.feature_set_out(f) for f in db.scalars(q).all()]


@router.get("/feature-sets/{fs_id}")
def get_feature_set(fs_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.feature_set_out(get_owned(db, FeatureSet, fs_id, user, "Feature set"))


@router.post("/feature-sets/{fs_id}/retire")
def retire_feature_set(fs_id: str, user: CurrentUser = Depends(require(P.MANAGE_MODELS)),
                       db: Session = Depends(get_db)):
    return service.feature_set_out(service.retire_feature_set(db, user, fs_id))


@router.post("/feature-sets/{fs_id}/materialize", status_code=201)
def materialize(fs_id: str, body: MaterializeIn, user: CurrentUser = Depends(require(P.MANAGE_MODELS, P.SYNC_DATA)),
                db: Session = Depends(get_db)):
    return service.materialize(db, user, fs_id, body.project_id, body.as_of_date)


@router.get("/fields/{field_id}/features")
def field_features(field_id: str, feature_set: str, version: int | None = None, as_of: date | None = None,
                   user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.field_features(db, user, supporting.get_field(db, user, field_id), feature_set, version, as_of)
