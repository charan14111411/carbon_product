from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.controlsites import domain, service
from app.modules.controlsites.schemas import LinkIn, LinkOut, LinkPatch

router = APIRouter(prefix="/projects/{project_id}/control-sites", tags=["Control sites"])
_read = require(P.READ)
_write = require(P.MANAGE_PROGRAMMES, P.MANAGE_LAND)


@router.get("", response_model=list[LinkOut])
def list_links(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.list_links(db, user, project_id)


@router.post("", response_model=LinkOut, status_code=201)
def create_link(project_id: str, body: LinkIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    """Link a control stratum to a project stratum or quantification unit. Its location is fixed now."""
    return service.create_link(db, user, project_id, body.model_dump())


@router.patch("/{link_id}", response_model=LinkOut)
def update_link(project_id: str, link_id: str, body: LinkPatch, user: CurrentUser = Depends(_write),
                db: Session = Depends(get_db)):
    """Change the manager, management plan, notes, crop-group justification or retire the link (audited)."""
    return service.update_link(db, user, project_id, link_id, body.model_dump(exclude_unset=True))


@router.get("/rules")
def rules(project_id: str, user: CurrentUser = Depends(_read)):
    return {"max_distance_km": domain.MAX_DISTANCE_KM, "max_aspect_diff_deg": domain.MAX_ASPECT_DIFF_DEG,
            "soc_confidence": domain.SOC_CONFIDENCE, "max_precip_diff_mm": domain.MAX_PRECIP_DIFF_MM,
            "alm_years": domain.ALM_YEARS, "min_control_sites": domain.MIN_CONTROL_SITES,
            "crop_functional_groups": {k: sorted(v) for k, v in domain.FUNCTIONAL_GROUPS.items()},
            "reference": "VM0042 v2.2 §8.2 p.25–27, Table 7, Appendix 5 Table 10"}


@router.post("/assess")
def assess(project_id: str, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    """Run every Table 7 check for each link plus the project-level checks, and keep the result."""
    return service.assess(db, user, project_id)


@router.get("/assessment")
def latest(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.latest(db, user, project_id)
