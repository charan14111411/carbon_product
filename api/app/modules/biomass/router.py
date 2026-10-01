from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.biomass import domain, service
from app.modules.biomass.schemas import (
    AllometryIn, CampaignIn, MeasurementIn, MeasurementVersionIn, PlotIn, VoidIn, WoodyComputeIn,
)

router = APIRouter(tags=["Woody biomass"])
_read = require(P.READ)
# Carbon analysts and programme managers enter the inventory.
_write = require(P.RUN_CALCULATION, P.MANAGE_PROGRAMMES)
_publish = require(P.RUN_CALCULATION, P.EDIT_RULES)  # same as creating a term estimate by hand
_model_write = require(P.RUN_CALCULATION, P.MANAGE_MODELS, P.EDIT_RULES)
_model_approve = require(P.APPROVE_MODELS, P.APPROVE_RULES)


@router.get("/biomass/allometry-forms")
def forms(user: CurrentUser = Depends(_read)) -> dict[str, Any]:
    """Supported allometric equation forms (DBH in cm, height in m)."""
    return {"forms": [{"key": k, "label": v["label"], "params": list(v["params"]), "needs_height": v["height"]}
                      for k, v in domain.FORMS.items()], "output_units": list(domain.OUTPUT_UNITS)}


# ------------------------------------------------------------------ allometric models
@router.post("/projects/{project_id}/allometric-models", status_code=201)
def create_allometry(project_id: str, body: AllometryIn, user: CurrentUser = Depends(_model_write),
                     db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.allometry_out(service.create_allometry(db, user, project_id, body.model_dump()))


@router.get("/projects/{project_id}/allometric-models")
def list_allometry(project_id: str, user: CurrentUser = Depends(_read),
                   db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.allometry_out(m) for m in service.list_allometry(db, user, project_id)]


@router.post("/allometric-models/{model_id}/approve")
def approve_allometry(model_id: str, user: CurrentUser = Depends(_model_approve),
                      db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.allometry_out(service.approve_allometry(db, user, model_id))


@router.post("/allometric-models/{model_id}/retire")
def retire_allometry(model_id: str, body: VoidIn, user: CurrentUser = Depends(_model_approve),
                     db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.allometry_out(service.retire_allometry(db, user, model_id, body.reason))


# ------------------------------------------------------------------ plots & campaigns
@router.post("/projects/{project_id}/biomass/plots", status_code=201)
def create_plot(project_id: str, body: PlotIn, user: CurrentUser = Depends(_write),
                db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.plot_out(service.create_plot(db, user, project_id, body.model_dump()))


@router.get("/projects/{project_id}/biomass/plots")
def list_plots(project_id: str, user: CurrentUser = Depends(_read),
               db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.plot_out(p) for p in service.list_plots(db, user, project_id)]


@router.post("/projects/{project_id}/biomass/campaigns", status_code=201)
def create_campaign(project_id: str, body: CampaignIn, user: CurrentUser = Depends(_write),
                    db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.campaign_out(service.create_campaign(db, user, project_id, body.model_dump()))


@router.get("/projects/{project_id}/biomass/campaigns")
def list_campaigns(project_id: str, user: CurrentUser = Depends(_read),
                   db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.campaign_out(c) for c in service.list_campaigns(db, user, project_id)]


# ------------------------------------------------------------------ measurements
@router.post("/biomass/measurements", status_code=201)
def create_measurement(body: MeasurementIn, user: CurrentUser = Depends(_write),
                       db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.measurement_out(service.create_measurement(db, user, body.model_dump()))


@router.get("/projects/{project_id}/biomass/measurements")
def list_measurements(project_id: str, campaign_id: str | None = None, include_voided: bool = False,
                      user: CurrentUser = Depends(_read), db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.measurement_out(m)
            for m in service.list_measurements(db, user, project_id, campaign_id, include_voided)]


@router.post("/biomass/measurements/{record_id}/versions", status_code=201)
def correct_measurement(record_id: str, body: MeasurementVersionIn, user: CurrentUser = Depends(_write),
                        db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.measurement_out(service.new_version(db, user, record_id, body.model_dump()))


@router.post("/biomass/measurements/{record_id}/void", status_code=201)
def void_measurement(record_id: str, body: VoidIn, user: CurrentUser = Depends(_write),
                     db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.measurement_out(service.new_version(db, user, record_id, body.model_dump(), void=True))


# ------------------------------------------------------------------ compute & publish
@router.post("/projects/{project_id}/biomass/compute")
def compute(project_id: str, body: WoodyComputeIn, user: CurrentUser = Depends(_read),
            db: Session = Depends(get_db)) -> dict[str, Any]:
    """Preview ΔC_TREE + ΔC_SHRUB (Eq. 48–51) without saving anything."""
    return service.compute_woody(db, user, project_id, body.model_dump())


@router.post("/projects/{project_id}/biomass/publish-term", status_code=201)
def publish(project_id: str, body: WoodyComputeIn, user: CurrentUser = Depends(_publish),
            db: Session = Depends(get_db)) -> dict[str, Any]:
    """Compute and save a DRAFT woody-biomass term estimate; a colleague approves it via POST /terms/{id}/approve."""
    return service.publish_woody(db, user, project_id, body.model_dump())


@router.get("/projects/{project_id}/term-computations")
def computations(project_id: str, term: str | None = None, user: CurrentUser = Depends(_read),
                 db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    """Frozen computations behind platform-computed term estimates (woody biomass and leakage)."""
    return [service.computation_out(c)
            for c in service.list_computations(db, user, project_id, term)]
