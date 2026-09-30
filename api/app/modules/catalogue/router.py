from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, current_user, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.catalogue import service
from app.modules.catalogue.models import Crop, PracticeType
from app.modules.catalogue.schemas import (
    CropIn, CropOut, CropPatch, InstallDefaultsOut, PracticeTypeIn, PracticeTypeOut, PracticeTypePatch,
)

router = APIRouter(prefix="/catalogue", tags=["Catalogue"])
_write = require(P.MANAGE_CATALOGUE)


@router.get("/crops", response_model=list[CropOut])
def list_crops(include_inactive: bool = False, user: CurrentUser = Depends(current_user),
               db: Session = Depends(get_db)):
    return service.list_crops(db, user, include_inactive)


@router.post("/crops", response_model=CropOut, status_code=201)
def create_crop(body: CropIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_crop(db, user, body)


@router.get("/crops/{crop_id}", response_model=CropOut)
def get_crop(crop_id: str, user: CurrentUser = Depends(current_user), db: Session = Depends(get_db)):
    return get_owned(db, Crop, crop_id, user, "Crop")


@router.patch("/crops/{crop_id}", response_model=CropOut)
def update_crop(crop_id: str, body: CropPatch, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.update_crop(db, user, crop_id, body)


@router.get("/practice-types", response_model=list[PracticeTypeOut])
def list_practice_types(include_inactive: bool = False, crop_code: str | None = None,
                        user: CurrentUser = Depends(current_user), db: Session = Depends(get_db)):
    return service.list_practice_types(db, user, include_inactive, crop_code)


@router.post("/practice-types", response_model=PracticeTypeOut, status_code=201)
def create_practice_type(body: PracticeTypeIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_practice_type(db, user, body)


@router.get("/practice-types/{pt_id}", response_model=PracticeTypeOut)
def get_practice_type(pt_id: str, user: CurrentUser = Depends(current_user), db: Session = Depends(get_db)):
    return get_owned(db, PracticeType, pt_id, user, "Practice")


@router.patch("/practice-types/{pt_id}", response_model=PracticeTypeOut)
def update_practice_type(pt_id: str, body: PracticeTypePatch, user: CurrentUser = Depends(_write),
                         db: Session = Depends(get_db)):
    return service.update_practice_type(db, user, pt_id, body)


@router.post("/install-defaults", response_model=InstallDefaultsOut)
def install_defaults(user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.install_defaults(db, user)
