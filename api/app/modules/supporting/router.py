from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.supporting import service
from app.modules.supporting.models import PARAMETERS, Device
from app.modules.supporting.schemas import DeviceIn, DeviceOut, DevicePatch, SyncIn

router = APIRouter(tags=["Supporting data"])
_read = require(P.READ)
_write = require(P.SYNC_DATA)


@router.get("/supporting/parameters")
def parameters(_: CurrentUser = Depends(_read)):
    return [{"parameter": k, "label": v[0], "unit": v[1]} for k, v in PARAMETERS.items()]


@router.get("/devices", response_model=list[DeviceOut])
def list_devices(field_id: str | None = None, status: str | None = None, user: CurrentUser = Depends(_read),
                 db: Session = Depends(get_db)):
    return service.list_devices(db, user, field_id=field_id, status=status)


@router.post("/devices", response_model=DeviceOut, status_code=201)
def create_device(body: DeviceIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_device(db, user, body)


@router.get("/devices/health")
def device_health(user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.device_health(db, user)


@router.get("/devices/{device_id}", response_model=DeviceOut)
def get_device(device_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return get_owned(db, Device, device_id, user, "Device")


@router.patch("/devices/{device_id}", response_model=DeviceOut)
def update_device(device_id: str, body: DevicePatch, user: CurrentUser = Depends(_write),
                  db: Session = Depends(get_db)):
    return service.update_device(db, user, device_id, body)


@router.post("/devices/{device_id}/heartbeat", response_model=DeviceOut)
def heartbeat(device_id: str, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.heartbeat(db, user, device_id)


@router.post("/fields/{field_id}/supporting/sync", status_code=201)
def sync_field(field_id: str, body: SyncIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    fld = service.get_field(db, user, field_id)
    return service.sync_field(db, user, fld, body.start, body.end, body.parameters)


@router.post("/projects/{project_id}/supporting/sync", status_code=201)
def sync_project(project_id: str, body: SyncIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    project = service.get_project(db, user, project_id)
    return service.sync_project(db, user, project, body.start, body.end, body.parameters)


@router.get("/fields/{field_id}/supporting")
def field_series(field_id: str, parameter: str, start: date | None = None, end: date | None = None,
                 user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.series(db, service.get_field(db, user, field_id), parameter, start, end)


@router.get("/fields/{field_id}/supporting/summary")
def field_summary(field_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.summary(db, service.get_field(db, user, field_id))


@router.get("/projects/{project_id}/supporting/coverage")
def project_coverage(project_id: str, on: date | None = None, user: CurrentUser = Depends(_read),
                     db: Session = Depends(get_db)):
    return service.coverage(db, user, service.get_project(db, user, project_id), on)
