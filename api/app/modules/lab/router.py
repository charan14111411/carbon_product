from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned, scoped
from app.modules.lab import service
from app.modules.lab.models import SpectralCalibration
from app.modules.lab.schemas import (
    BatchIn, CalibrationIn, CalibrationPatch, DispatchIn, LabChangeIn, LabIn, LabPatch, NoteIn, ResultIn, ResultPatch,
    ReviewIn, SupersedeIn,
)
from app.modules.programmes.models import Project
from app.modules.sampling.models import Campaign

router = APIRouter(tags=["Laboratory"])

LAB_WRITE = require(P.PLAN_SAMPLING, P.MANAGE_PROGRAMMES)
LAB_READ = require(P.READ, P.SUBMIT_LAB)
BATCH_WRITE = require(P.PLAN_SAMPLING, P.RECORD_CUSTODY)
BATCH_READ = require(P.READ, P.RECORD_CUSTODY, P.SUBMIT_LAB)
RESULT_READ = require(P.READ, P.SUBMIT_LAB, P.REVIEW_LAB)
REVIEW = require(P.REVIEW_LAB)


# ------------------------------------------------------------------ labs
@router.post("/labs", status_code=201)
def create_lab(body: LabIn, user: CurrentUser = Depends(LAB_WRITE), db: Session = Depends(get_db)):
    return service.lab_out(service.create_lab(db, user, body))


@router.get("/labs")
def list_labs(user: CurrentUser = Depends(LAB_READ), db: Session = Depends(get_db)):
    return [service.lab_out(lab) for lab in service.list_labs(db, user)]


@router.get("/labs/{lab_id}")
def lab_detail(lab_id: str, user: CurrentUser = Depends(LAB_READ), db: Session = Depends(get_db)):
    return service.lab_out(service.get_lab(db, user, lab_id))


@router.put("/labs/{lab_id}")
def update_lab(lab_id: str, body: LabPatch, user: CurrentUser = Depends(LAB_WRITE), db: Session = Depends(get_db)):
    return service.lab_out(service.update_lab(db, user, service.get_lab(db, user, lab_id), body))


@router.delete("/labs/{lab_id}", status_code=204)
def delete_lab(lab_id: str, user: CurrentUser = Depends(LAB_WRITE), db: Session = Depends(get_db)):
    service.delete_lab(db, user, service.get_lab(db, user, lab_id))


# ------------------------------------------------------------------ batches
@router.post("/lab-batches", status_code=201)
def create_batch(body: BatchIn, user: CurrentUser = Depends(BATCH_WRITE), db: Session = Depends(get_db)):
    return service.batch_out(db, service.create_batch(db, user, body), manifest=True)


@router.get("/lab-batches")
def list_batches(campaign_id: str | None = None, user: CurrentUser = Depends(BATCH_READ),
                 db: Session = Depends(get_db)):
    return [service.batch_out(db, b) for b in service.list_batches(db, user, campaign_id=campaign_id)]


@router.get("/lab-batches/{batch_id}")
def batch_detail(batch_id: str, user: CurrentUser = Depends(BATCH_READ), db: Session = Depends(get_db)):
    return service.batch_out(db, service.get_batch(db, user, batch_id), manifest=True)


@router.post("/lab-batches/{batch_id}/dispatch")
def dispatch_batch(batch_id: str, body: DispatchIn | None = None, user: CurrentUser = Depends(BATCH_WRITE),
                   db: Session = Depends(get_db)):
    b = service.dispatch_batch(db, user, service.get_batch(db, user, batch_id), body.dispatched_on if body else None)
    return service.batch_out(db, b, manifest=True)


# ------------------------------------------------------------------ results
@router.post("/lab-results", status_code=201)
def create_result(body: ResultIn, user: CurrentUser = Depends(require(P.SUBMIT_LAB)), db: Session = Depends(get_db)):
    return service.result_out(db, service.create_result(db, user, body))


@router.post("/lab-results/import")
async def import_results(
    file: UploadFile = File(...), lab_id: str | None = Form(None),
    user: CurrentUser = Depends(require(P.SUBMIT_LAB)), db: Session = Depends(get_db),
):
    data = await file.read()
    return service.import_csv(db, user, data=data, filename=file.filename or "lab-results.csv", lab_id=lab_id)


@router.get("/lab-results")
def list_results(
    campaign_id: str | None = None, status: str | None = None, analyte: str | None = None, lab_id: str | None = None,
    page: int = Query(1, ge=1), page_size: int = Query(50, ge=1, le=500),
    user: CurrentUser = Depends(RESULT_READ), db: Session = Depends(get_db),
):
    return service.list_results(db, user, campaign_id=campaign_id, status=status, analyte=analyte, lab_id=lab_id,
                                page=page, page_size=page_size)


@router.get("/lab-results/{result_id}")
def result_detail(result_id: str, user: CurrentUser = Depends(RESULT_READ), db: Session = Depends(get_db)):
    return service.result_out(db, service.get_result(db, user, result_id))


@router.put("/lab-results/{result_id}")
def update_result(result_id: str, body: ResultPatch, user: CurrentUser = Depends(require(P.SUBMIT_LAB)),
                  db: Session = Depends(get_db)):
    return service.result_out(db, service.update_result(db, user, service.get_result(db, user, result_id), body))


@router.post("/lab-results/{result_id}/certificate")
async def upload_certificate(
    result_id: str, file: UploadFile = File(...),
    user: CurrentUser = Depends(require(P.SUBMIT_LAB, P.REVIEW_LAB)), db: Session = Depends(get_db),
):
    r = service.get_result(db, user, result_id)
    data = await file.read()
    r = service.attach_certificate(db, user, r, data=data, filename=file.filename or "certificate.pdf",
                                   mime_type=file.content_type or "")
    return service.result_out(db, r)


@router.post("/lab-results/{result_id}/accept")
def accept(result_id: str, body: ReviewIn | None = None, user: CurrentUser = Depends(REVIEW),
           db: Session = Depends(get_db)):
    r = service.accept(db, user, service.get_result(db, user, result_id), body.note if body else None)
    return service.result_out(db, r)


@router.post("/lab-results/{result_id}/reject")
def reject(result_id: str, body: NoteIn, user: CurrentUser = Depends(REVIEW), db: Session = Depends(get_db)):
    return service.result_out(db, service.reject(db, user, service.get_result(db, user, result_id), body.note))


@router.post("/lab-results/{result_id}/void")
def void(result_id: str, body: NoteIn, user: CurrentUser = Depends(REVIEW), db: Session = Depends(get_db)):
    return service.result_out(db, service.void(db, user, service.get_result(db, user, result_id), body.note))


@router.post("/lab-results/{result_id}/supersede", status_code=201)
def supersede(result_id: str, body: SupersedeIn, user: CurrentUser = Depends(require(P.SUBMIT_LAB, P.REVIEW_LAB)),
              db: Session = Depends(get_db)):
    return service.result_out(db, service.supersede(db, user, service.get_result(db, user, result_id), body))


@router.get("/campaigns/{campaign_id}/lab-progress")
def lab_progress(campaign_id: str, user: CurrentUser = Depends(RESULT_READ), db: Session = Depends(get_db)):
    return service.lab_progress(db, user, get_owned(db, Campaign, campaign_id, user, "Campaign"))


# ------------------------------------------------------------------ calibrations
def _cal(db: Session, user: CurrentUser, cal_id: str) -> SpectralCalibration:
    return get_owned(db, SpectralCalibration, cal_id, user, "Calibration")


@router.post("/spectral-calibrations", status_code=201)
def create_calibration(body: CalibrationIn, user: CurrentUser = Depends(require(P.REVIEW_LAB, P.MANAGE_MODELS)),
                       db: Session = Depends(get_db)):
    return service.calibration_out(db, service.create_calibration(db, user, body))


@router.get("/spectral-calibrations")
def list_calibrations(status: str | None = None, user: CurrentUser = Depends(RESULT_READ),
                      db: Session = Depends(get_db)):
    q = scoped(SpectralCalibration, user).order_by(SpectralCalibration.code)
    if status:
        q = q.where(SpectralCalibration.status == status)
    return [service.calibration_out(db, c) for c in db.scalars(q)]


@router.get("/spectral-calibrations/{cal_id}")
def calibration_detail(cal_id: str, user: CurrentUser = Depends(RESULT_READ), db: Session = Depends(get_db)):
    return service.calibration_out(db, _cal(db, user, cal_id))


@router.put("/spectral-calibrations/{cal_id}")
def update_calibration(cal_id: str, body: CalibrationPatch,
                       user: CurrentUser = Depends(require(P.REVIEW_LAB, P.MANAGE_MODELS)),
                       db: Session = Depends(get_db)):
    return service.calibration_out(db, service.update_calibration(db, user, _cal(db, user, cal_id), body))


@router.post("/spectral-calibrations/{cal_id}/approve")
def approve_calibration(cal_id: str, user: CurrentUser = Depends(REVIEW), db: Session = Depends(get_db)):
    return service.calibration_out(db, service.approve_calibration(db, user, _cal(db, user, cal_id)))


@router.post("/spectral-calibrations/{cal_id}/retire")
def retire_calibration(cal_id: str, user: CurrentUser = Depends(REVIEW), db: Session = Depends(get_db)):
    return service.calibration_out(db, service.retire_calibration(db, user, _cal(db, user, cal_id)))


# ------------------------------------------------------------------ lab changes & spectroscopy check
@router.post("/projects/{project_id}/lab-changes", status_code=201)
def create_lab_change(project_id: str, body: LabChangeIn, user: CurrentUser = Depends(LAB_WRITE),
                      db: Session = Depends(get_db)):
    """Justify a change of laboratory (VM0042 v2.2 §8.2.1.4)."""
    project = get_owned(db, Project, project_id, user, "Project")
    return service.lab_change_out(db, service.create_lab_change(db, user, project, body))


@router.get("/projects/{project_id}/lab-changes")
def list_lab_changes(project_id: str, user: CurrentUser = Depends(require(P.READ)), db: Session = Depends(get_db)):
    return service.list_lab_changes(db, user, get_owned(db, Project, project_id, user, "Project"))


@router.get("/campaigns/{campaign_id}/spectroscopy-check")
def spectroscopy_check(campaign_id: str, user: CurrentUser = Depends(RESULT_READ), db: Session = Depends(get_db)):
    """Share of spectroscopy samples re-run by dry combustion, and the Eq. 73 model error."""
    return service.spectroscopy_check(db, user, get_owned(db, Campaign, campaign_id, user, "Campaign"))
