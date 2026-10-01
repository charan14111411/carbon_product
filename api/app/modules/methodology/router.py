from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.methodology import service
from app.modules.methodology.models import RulePack
from app.modules.methodology.schemas import AssignPackIn, RulePackIn, RulePackPatch, RuleValueIn

router = APIRouter(tags=["Methodology"])


def _pack(db: Session, user: CurrentUser, pack_id: str) -> RulePack:
    return get_owned(db, RulePack, pack_id, user, "Rule pack")


@router.get("/methodology/definitions")
def definitions(_: CurrentUser = Depends(require(P.READ, P.EDIT_RULES))):
    return service.definitions()


@router.post("/rule-packs", status_code=201)
def create_pack(body: RulePackIn, user: CurrentUser = Depends(require(P.EDIT_RULES)), db: Session = Depends(get_db)):
    pack = service.create_pack(db, user, body)
    return service.pack_detail(db, user, pack)


@router.get("/rule-packs")
def list_packs(
    status: str | None = None, methodology_code: str | None = None,
    user: CurrentUser = Depends(require(P.READ)), db: Session = Depends(get_db),
):
    return service.list_packs(db, user, status=status, code=methodology_code)


@router.get("/rule-packs/{pack_id}")
def pack_detail(pack_id: str, user: CurrentUser = Depends(require(P.READ)), db: Session = Depends(get_db)):
    return service.pack_detail(db, user, _pack(db, user, pack_id))


@router.patch("/rule-packs/{pack_id}")
def update_pack(
    pack_id: str, body: RulePackPatch, user: CurrentUser = Depends(require(P.EDIT_RULES)), db: Session = Depends(get_db)
):
    pack = service.update_pack(db, user, _pack(db, user, pack_id), body)
    return service.pack_detail(db, user, pack)


@router.get("/rule-packs/{pack_id}/readiness")
def readiness(pack_id: str, user: CurrentUser = Depends(require(P.READ)), db: Session = Depends(get_db)):
    return service.readiness(db, _pack(db, user, pack_id))


@router.put("/rule-packs/{pack_id}/rules/{key}")
def set_rule(
    pack_id: str, key: str, body: RuleValueIn,
    user: CurrentUser = Depends(require(P.EDIT_RULES)), db: Session = Depends(get_db),
):
    pack = _pack(db, user, pack_id)
    service.set_rule(db, user, pack, key, body)
    return service.pack_detail(db, user, pack)


@router.delete("/rule-packs/{pack_id}/rules/{key}")
def delete_rule(
    pack_id: str, key: str, user: CurrentUser = Depends(require(P.EDIT_RULES)), db: Session = Depends(get_db)
):
    pack = _pack(db, user, pack_id)
    service.delete_rule(db, user, pack, key)
    return service.pack_detail(db, user, pack)


@router.post("/rule-packs/{pack_id}/apply-vm0042-defaults")
def apply_vm0042_defaults(pack_id: str, overwrite: bool = False, user: CurrentUser = Depends(require(P.EDIT_RULES)),
                          db: Session = Depends(get_db)):
    pack = _pack(db, user, pack_id)
    summary = service.apply_vm0042_defaults(db, user, pack, overwrite=overwrite)
    return {**service.pack_detail(db, user, pack), "vm0042_defaults": summary}


@router.post("/rule-packs/{pack_id}/approve")
def approve(pack_id: str, user: CurrentUser = Depends(require(P.APPROVE_RULES)), db: Session = Depends(get_db)):
    pack = service.approve(db, user, _pack(db, user, pack_id))
    return service.pack_detail(db, user, pack)


@router.post("/rule-packs/{pack_id}/retire")
def retire(pack_id: str, user: CurrentUser = Depends(require(P.APPROVE_RULES)), db: Session = Depends(get_db)):
    pack = service.retire(db, user, _pack(db, user, pack_id))
    return service.pack_detail(db, user, pack)


@router.post("/projects/{project_id}/rule-pack")
def assign_pack(
    project_id: str, body: AssignPackIn,
    user: CurrentUser = Depends(require(P.EDIT_RULES, P.MANAGE_PROGRAMMES)), db: Session = Depends(get_db),
):
    return service.assign_to_project(db, user, project_id, body.pack_id)
