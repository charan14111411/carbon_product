from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned, scoped
from app.modules.sampling import service
from app.modules.sampling.models import Campaign, SamplePlan
from app.modules.sampling.schemas import (
    AssignIn, CampaignIn, CampaignStatusIn, CustodyIn, MddIn, PlanIn, PlanPatch, SampleIn, SamplingDesignIn, SkipIn,
    StratumIn,
)

router = APIRouter(tags=["Sampling"])

READ = require(P.READ)
PLAN = require(P.PLAN_SAMPLING)


# ------------------------------------------------------------------ strata
@router.post("/projects/{project_id}/strata", status_code=201)
def create_stratum(project_id: str, body: StratumIn, user: CurrentUser = Depends(PLAN), db: Session = Depends(get_db)):
    project = service.get_project(db, user, project_id)
    return service.stratum_out(service.create_stratum(db, user, project, body))


@router.get("/projects/{project_id}/strata")
def list_strata(
    project_id: str, all: bool = False, user: CurrentUser = Depends(READ), db: Session = Depends(get_db)  # noqa: A002
):
    return service.list_strata(db, user, service.get_project(db, user, project_id), include_history=all)


@router.get("/projects/{project_id}/sampling-annex.json")
def sampling_annex_json(project_id: str, user: CurrentUser = Depends(READ),
                        db: Session = Depends(get_db)):
    """Strata and sampling points annex (VM0042 v2.2 §8.2.1.2), submitted at every verification."""
    return service.sampling_annex(db, user, service.get_project(db, user, project_id))


@router.get("/projects/{project_id}/sampling-annex.csv")
def sampling_annex_csv(project_id: str, user: CurrentUser = Depends(READ),
                       db: Session = Depends(get_db)):
    project = service.get_project(db, user, project_id)
    text = service.sampling_annex_csv(service.sampling_annex(db, user, project))
    return Response(content=text, media_type="text/csv", headers={
        "Content-Disposition": f'attachment; filename="{project.code}-sampling-annex.csv"'})


# ------------------------------------------------------------------ campaigns
@router.post("/projects/{project_id}/campaigns", status_code=201)
def create_campaign(project_id: str, body: CampaignIn, user: CurrentUser = Depends(PLAN),
                    db: Session = Depends(get_db)):
    c = service.create_campaign(db, user, service.get_project(db, user, project_id), body)
    return service.campaign_out(db, c)


@router.get("/projects/{project_id}/campaigns")
def list_campaigns(project_id: str, user: CurrentUser = Depends(READ), db: Session = Depends(get_db)):
    project = service.get_project(db, user, project_id)
    rows = db.scalars(scoped(Campaign, user).where(Campaign.project_id == project.id)
                      .order_by(Campaign.planned_start))
    return [service.campaign_out(db, c) for c in rows]


@router.get("/campaigns/{campaign_id}")
def campaign_detail(campaign_id: str, user: CurrentUser = Depends(READ), db: Session = Depends(get_db)):
    c = service.get_campaign(db, user, campaign_id)
    return {**service.campaign_out(db, c), "plans": service.list_plans(db, user, c)}


@router.post("/campaigns/{campaign_id}/status")
def campaign_status(campaign_id: str, body: CampaignStatusIn, user: CurrentUser = Depends(PLAN),
                    db: Session = Depends(get_db)):
    c = service.set_campaign_status(db, user, service.get_campaign(db, user, campaign_id), body.status)
    return service.campaign_out(db, c)


# ------------------------------------------------------------------ multi-stage design (VM0042 Appendix 6)
@router.get("/projects/{project_id}/sampling-design/population")
def design_population(project_id: str, stage1_unit: Literal["landowner", "farm", "field"] = "landowner",
                      user: CurrentUser = Depends(require(P.READ, P.PLAN_SAMPLING)), db: Session = Depends(get_db)):
    """Stage-1 units and their fields with areas and PPS / equal selection probabilities."""
    return service.population_out(db, user, service.get_project(db, user, project_id), stage1_unit)


@router.get("/campaigns/{campaign_id}/sampling-design")
def get_sampling_design(campaign_id: str, user: CurrentUser = Depends(require(P.READ, P.PLAN_SAMPLING)),
                        db: Session = Depends(get_db)):
    c = service.get_campaign(db, user, campaign_id)
    return service.design_out(db, service.get_design(db, user, c))


@router.post("/campaigns/{campaign_id}/sampling-design", status_code=201)
def create_sampling_design(campaign_id: str, body: SamplingDesignIn, user: CurrentUser = Depends(PLAN),
                           db: Session = Depends(get_db)):
    c = service.get_campaign(db, user, campaign_id)
    return service.design_out(db, service.save_design(db, user, c, body))


@router.put("/campaigns/{campaign_id}/sampling-design")
def update_sampling_design(campaign_id: str, body: SamplingDesignIn, user: CurrentUser = Depends(PLAN),
                           db: Session = Depends(get_db)):
    c = service.get_campaign(db, user, campaign_id)
    return service.design_out(db, service.save_design(db, user, c, body, existing=service.get_design(db, user, c)))


@router.delete("/campaigns/{campaign_id}/sampling-design", status_code=204)
def delete_sampling_design(campaign_id: str, user: CurrentUser = Depends(PLAN), db: Session = Depends(get_db)):
    service.delete_design(db, user, service.get_campaign(db, user, campaign_id))
    return Response(status_code=204)


# ------------------------------------------------------------------ plans
@router.post("/campaigns/{campaign_id}/sample-plans", status_code=201)
def create_plan(campaign_id: str, body: PlanIn, user: CurrentUser = Depends(PLAN), db: Session = Depends(get_db)):
    plan, warnings = service.create_plan(db, user, service.get_campaign(db, user, campaign_id), body)
    return service.plan_out(db, plan, warnings)


@router.post("/sample-plans/mdd")
def mdd(body: MddIn, user: CurrentUser = Depends(require(P.PLAN_SAMPLING, P.APPROVE_SAMPLING, P.READ))):
    """Power analysis (VM0042 v2.2 Eq. 1-2): n for a target MDD, or the MDD for a given n."""
    return service.power_analysis(body.s, body.alpha, body.power, body.mdd, body.n)


@router.get("/campaigns/{campaign_id}/sample-plans")
def list_plans(campaign_id: str, user: CurrentUser = Depends(READ), db: Session = Depends(get_db)):
    return service.list_plans(db, user, service.get_campaign(db, user, campaign_id))


@router.put("/sample-plans/{plan_id}")
def update_plan(plan_id: str, body: PlanPatch, user: CurrentUser = Depends(PLAN), db: Session = Depends(get_db)):
    plan, warnings = service.update_plan(db, user, get_owned(db, SamplePlan, plan_id, user, "Sample plan"), body)
    return service.plan_out(db, plan, warnings)


@router.post("/sample-plans/{plan_id}/approve")
def approve_plan(plan_id: str, user: CurrentUser = Depends(require(P.APPROVE_SAMPLING)),
                 db: Session = Depends(get_db)):
    plan = service.approve_plan(db, user, get_owned(db, SamplePlan, plan_id, user, "Sample plan"))
    return service.plan_out(db, plan)


# ------------------------------------------------------------------ points
@router.post("/campaigns/{campaign_id}/place-points", status_code=201)
def place_points(campaign_id: str, user: CurrentUser = Depends(PLAN), db: Session = Depends(get_db)):
    return service.place_points(db, user, service.get_campaign(db, user, campaign_id))


@router.get("/campaigns/{campaign_id}/points")
def list_points(campaign_id: str, user: CurrentUser = Depends(require(P.READ, P.PLAN_SAMPLING)),
                db: Session = Depends(get_db)):
    return service.list_points(db, user, service.get_campaign(db, user, campaign_id))


@router.get("/campaigns/{campaign_id}/points.geojson")
def points_geojson(campaign_id: str, user: CurrentUser = Depends(require(P.READ, P.PLAN_SAMPLING)),
                   db: Session = Depends(get_db)):
    return service.points_geojson(db, user, service.get_campaign(db, user, campaign_id))


@router.post("/campaigns/{campaign_id}/assign")
def assign(campaign_id: str, body: AssignIn, user: CurrentUser = Depends(PLAN), db: Session = Depends(get_db)):
    return service.assign(db, user, service.get_campaign(db, user, campaign_id), body)


@router.get("/me/assignments")
def my_assignments(user: CurrentUser = Depends(require(P.COLLECT_SAMPLE)), db: Session = Depends(get_db)):
    return service.my_assignments(db, user)


@router.get("/campaigns/{campaign_id}/bundle")
def bundle(campaign_id: str, user: CurrentUser = Depends(require(P.COLLECT_SAMPLE, P.PLAN_SAMPLING)),
           db: Session = Depends(get_db)):
    return service.bundle(db, user, service.get_campaign(db, user, campaign_id))


@router.post("/points/{point_id}/skip")
def skip_point(point_id: str, body: SkipIn, user: CurrentUser = Depends(require(P.COLLECT_SAMPLE, P.PLAN_SAMPLING)),
               db: Session = Depends(get_db)):
    pt = service.skip_point(db, user, service.get_point(db, user, point_id), body.reason)
    return {"id": str(pt.id), "status": pt.status, "skip_reason": pt.skip_reason}


# ------------------------------------------------------------------ samples
@router.post("/samples", status_code=201)
def submit_sample(body: SampleIn, response: Response, user: CurrentUser = Depends(require(P.COLLECT_SAMPLE)),
                  db: Session = Depends(get_db)):
    sample, replayed, findings = service.submit_sample(db, user, body)
    if replayed:
        response.status_code = 200
    return {"replayed": replayed, "sample": service.sample_detail(db, user, sample), "findings": findings}


@router.get("/samples")
def list_samples(
    campaign_id: str | None = None, status: str | None = None, limit: int = Query(500, ge=1, le=5000),
    user: CurrentUser = Depends(require(P.READ, P.COLLECT_SAMPLE, P.RECORD_CUSTODY)), db: Session = Depends(get_db),
):
    return service.list_samples(db, user, campaign_id=campaign_id, status=status, limit=limit)


@router.get("/samples/by-code/{code}/trace")
def trace(code: str, user: CurrentUser = Depends(require(P.READ, P.RECORD_CUSTODY)), db: Session = Depends(get_db)):
    return service.trace(db, user, code)


@router.get("/samples/{sample_id}")
def sample_detail(sample_id: str, user: CurrentUser = Depends(require(P.READ, P.COLLECT_SAMPLE, P.RECORD_CUSTODY)),
                  db: Session = Depends(get_db)):
    return service.sample_detail(db, user, service.get_sample(db, user, sample_id))


@router.post("/samples/{sample_id}/custody", status_code=201)
def add_custody(sample_id: str, body: CustodyIn, user: CurrentUser = Depends(require(P.RECORD_CUSTODY)),
                db: Session = Depends(get_db)):
    sample = service.get_sample(db, user, sample_id)
    service.add_custody(db, user, sample, body)
    return service.custody_list(db, user, sample)


@router.get("/samples/{sample_id}/custody")
def custody(sample_id: str, user: CurrentUser = Depends(require(P.READ, P.RECORD_CUSTODY)),
            db: Session = Depends(get_db)):
    return service.custody_list(db, user, service.get_sample(db, user, sample_id))


