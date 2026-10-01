from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.farmfuture import devices
from app.modules.farmfuture.lookup import LATEST_ONLY_NOTE
from app.modules.land.models import Field

router = APIRouter(tags=["Varsapradaya (FarmFuture)"])


@router.post("/farms/{farm_id}/devices/refresh")
def refresh_farm_devices(farm_id: str, user: CurrentUser = Depends(require(P.SYNC_DATA)),
                         db: Session = Depends(get_db)):
    """Register or update this farm's SoilSync / MicroClime devices from Varsapradaya's latest readings.

    Needs ``VC_DEVICE_PROVIDER=farmfuture``. The platform returns the latest value only; each reading fetched is
    kept, so the farm's own devices supply the daily series for the days they reported (tier 1)."""
    return devices.refresh_farm_devices(db, user, farm_id)


@router.post("/varsapradaya/devices/poll")
def poll_devices(user: CurrentUser = Depends(require(P.SYNC_DATA)), db: Session = Depends(get_db)):
    """Read every Varsapradaya member farm's devices in this organisation now (the API also does this on a
    timer, every VARSAPRADAYA_POLL_MINUTES). Farms that fail are listed and skipped."""
    from app.modules.farmfuture import poller

    devices._provider(None)  # 409 unless VC_DEVICE_PROVIDER=farmfuture
    return poller.poll_org(db, user)


@router.get("/fields/{field_id}/supporting/latest")
def field_latest(field_id: str, user: CurrentUser = Depends(require(P.READ)), db: Session = Depends(get_db)):
    """The latest device readings for a field (tier 1, MEASURED)."""
    fld = get_owned(db, Field, field_id, user, "Field")
    values = devices.latest_resolved(db, fld)
    return {
        "field_id": str(fld.id), "latest_only": True, "note": LATEST_ONLY_NOTE,
        "values": [{"parameter": r.parameter, "date": r.observed_on.isoformat(), "value": r.value, "unit": r.unit,
                    "tier": r.tier, "provider": r.provider, "source_ref": r.source_ref, "quality": r.quality,
                    "data_class": r.data_class, "note": r.note, "device_id": r.device_id} for r in values],
    }
