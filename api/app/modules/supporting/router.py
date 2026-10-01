from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.supporting import service, site_context
from app.modules.supporting.models import PARAMETERS, Device
from app.modules.supporting.schemas import DeviceIn, DeviceOut, DevicePatch, SoilApplyIn, SyncIn, TerrainRefreshIn

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


# ------------------------------------------------------------------ derived features
@router.get("/fields/{field_id}/derived-features")
def derived_features(field_id: str, start: date, end: date, window: str = "monthly",
                     wet_threshold_pct: float | None = Query(default=None, gt=0, le=100),
                     user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.derived_features(db, service.get_field(db, user, field_id), start, end, window, wet_threshold_pct)


# ------------------------------------------------------------------ terrain
@router.post("/fields/{field_id}/terrain/refresh", status_code=201)
def terrain_refresh(field_id: str, body: TerrainRefreshIn | None = None, user: CurrentUser = Depends(_write),
                    db: Session = Depends(get_db)):
    return site_context.refresh_terrain(db, user, service.get_field(db, user, field_id), bool(body and body.force))


@router.post("/projects/{project_id}/terrain/refresh", status_code=201)
def project_terrain_refresh(project_id: str, body: TerrainRefreshIn | None = None,
                            user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return site_context.refresh_project_terrain(db, user, service.get_project(db, user, project_id),
                                                bool(body and body.force))


@router.get("/fields/{field_id}/terrain")
def terrain_history(field_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return site_context.terrain_history(db, user, service.get_field(db, user, field_id))


# ------------------------------------------------------------------ soil-map suggestions
@router.post("/fields/{field_id}/soil-properties/refresh", status_code=201)
def soil_refresh(field_id: str, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return site_context.refresh_soil_properties(db, user, service.get_field(db, user, field_id))


@router.get("/fields/{field_id}/soil-properties")
def soil_suggestions(field_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return site_context.list_soil_suggestions(db, user, service.get_field(db, user, field_id))


@router.post("/fields/{field_id}/soil-properties/apply")
def soil_apply(field_id: str, body: SoilApplyIn, user: CurrentUser = Depends(require(P.MANAGE_LAND)),
               db: Session = Depends(get_db)):
    return site_context.apply_soil_suggestion(db, user, service.get_field(db, user, field_id), body.suggestion_id,
                                              list(body.columns), body.overwrite, body.note)


# ------------------------------------------------------------------ weather station check
@router.get("/projects/{project_id}/weather-station-check")
def weather_station_check(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return site_context.weather_station_check(db, user, service.get_project(db, user, project_id))
