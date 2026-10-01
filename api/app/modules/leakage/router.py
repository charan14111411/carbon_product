from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.leakage import service
from app.modules.leakage.schemas import (
    DisplacementComputeIn, DisplacementIn, DisplacementVersionIn, ResidueComputeIn, ResidueIn, ResidueVersionIn, VoidIn,
)

router = APIRouter(tags=["Leakage"])
_read = require(P.READ)
_write = require(P.RUN_CALCULATION, P.MANAGE_PROGRAMMES)
_publish = require(P.RUN_CALCULATION, P.EDIT_RULES)


# ------------------------------------------------------------------ biomass residues (TOOL16)
@router.post("/projects/{project_id}/leakage/residues", status_code=201)
def create_residue(project_id: str, body: ResidueIn, user: CurrentUser = Depends(_write),
                   db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.residue_out(service.create_residue(db, user, project_id, body.model_dump()))


@router.get("/projects/{project_id}/leakage/residues")
def list_residues(project_id: str, period_label: str | None = None, include_voided: bool = False,
                  user: CurrentUser = Depends(_read), db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.residue_out(r) for r in service.list_residues(db, user, project_id, period_label, include_voided)]


@router.post("/leakage/residues/{record_id}/versions", status_code=201)
def correct_residue(record_id: str, body: ResidueVersionIn, user: CurrentUser = Depends(_write),
                    db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.residue_out(service.residue_version(db, user, record_id, body.model_dump()))


@router.post("/leakage/residues/{record_id}/void", status_code=201)
def void_residue(record_id: str, body: VoidIn, user: CurrentUser = Depends(_write),
                 db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.residue_out(service.residue_version(db, user, record_id, body.model_dump(), void=True))


@router.post("/projects/{project_id}/leakage/residues/compute")
def compute_residues(project_id: str, body: ResidueComputeIn, user: CurrentUser = Depends(_read),
                     db: Session = Depends(get_db)) -> dict[str, Any]:
    """Preview LE_BR (VM0042 §8.4.4 / CDM TOOL16) for a period without saving."""
    return service.compute_residues(db, user, project_id, body.period_label)


@router.post("/projects/{project_id}/leakage/residues/publish-term", status_code=201)
def publish_residues(project_id: str, body: ResidueComputeIn, user: CurrentUser = Depends(_publish),
                     db: Session = Depends(get_db)) -> dict[str, Any]:
    """Save LE_BR as a DRAFT term estimate; a colleague approves it via POST /terms/{id}/approve."""
    return service.publish_residues(db, user, project_id, body.period_label)


# ------------------------------------------------------------------ livestock displacement / production (VMD0054)
@router.post("/projects/{project_id}/leakage/displacement", status_code=201)
def create_displacement(project_id: str, body: DisplacementIn, user: CurrentUser = Depends(_write),
                        db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.displacement_out(service.create_displacement(db, user, project_id, body.model_dump()))


@router.get("/projects/{project_id}/leakage/displacement")
def list_displacement(project_id: str, include_voided: bool = False, user: CurrentUser = Depends(_read),
                      db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return [service.displacement_out(r) for r in service.list_displacement(db, user, project_id, include_voided)]


@router.post("/leakage/displacement/{record_id}/versions", status_code=201)
def correct_displacement(record_id: str, body: DisplacementVersionIn, user: CurrentUser = Depends(_write),
                         db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.displacement_out(service.displacement_version(db, user, record_id, body.model_dump()))


@router.post("/leakage/displacement/{record_id}/void", status_code=201)
def void_displacement(record_id: str, body: VoidIn, user: CurrentUser = Depends(_write),
                      db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.displacement_out(service.displacement_version(db, user, record_id, body.model_dump(), void=True))


@router.post("/projects/{project_id}/leakage/displacement/compute")
def compute_displacement(project_id: str, body: DisplacementComputeIn, user: CurrentUser = Depends(_read),
                         db: Session = Depends(get_db)) -> dict[str, Any]:
    """Preview LK_disp (VM0042 Eq. 34–36 with VMD0054 inputs) for a verification period without saving."""
    return service.compute_displacement(db, user, project_id, body.model_dump())


@router.post("/projects/{project_id}/leakage/displacement/publish-term", status_code=201)
def publish_displacement(project_id: str, body: DisplacementComputeIn, user: CurrentUser = Depends(_publish),
                         db: Session = Depends(get_db)) -> dict[str, Any]:
    """Save LK_disp as a DRAFT term estimate; a colleague approves it via POST /terms/{id}/approve."""
    return service.publish_displacement(db, user, project_id, body.model_dump())
