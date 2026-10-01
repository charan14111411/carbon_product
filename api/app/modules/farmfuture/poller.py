"""Reads every Varsapradaya member farm's devices on a timer and keeps each reading (``DeviceReading``).

Their API returns only the latest value, so a device's history exists only if it is read regularly. With
``VC_DEVICE_PROVIDER=farmfuture`` the API runs ``poll_all`` every ``VARSAPRADAYA_POLL_MINUTES`` (default 60;
0 = off). ``python -m scripts.poll_varsapradaya`` runs one round by hand, and
``POST /api/varsapradaya/devices/poll`` runs one round for the caller's organisation.

A farm that fails (their API down, farmer no longer a member) is reported and skipped; the next round tries
again. Nothing is ever written for a farm whose readings could not be fetched.
"""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

from sqlalchemy import select

from app.core.auth import CurrentUser
from app.core.config import get_settings, provider_choice
from app.core.errors import AppError
from app.core.permissions import permissions_for
from app.modules.farmfuture.devices import PROVIDER_NAME, refresh_farm_devices
from app.modules.identity.models import User
from app.modules.land.models import Farm

log = logging.getLogger("vcarbon.farmfuture")

# The account a scheduled round acts as (audit entries name it): the organisation's first active administrator.
_ACTOR_ROLES = ("platform_admin", "programme_admin")


def enabled() -> bool:
    return provider_choice("VC_DEVICE_PROVIDER", "simulated") == PROVIDER_NAME


def _actor(db, org_id) -> CurrentUser | None:
    for role in _ACTOR_ROLES:
        u = db.scalar(select(User).where(User.org_id == org_id, User.role == role, User.is_active == True)  # noqa: E712
                      .order_by(User.created_at))
        if u is not None:
            return CurrentUser(id=u.id, org_id=u.org_id, role=u.role, email=u.email, full_name=u.full_name,
                               permissions=permissions_for(u.role), scope=dict(u.scope or {}))
    return None


def poll_org(db, user: CurrentUser) -> dict[str, Any]:
    """One round for one organisation, in the caller's session (one commit per farm is the caller's choice)."""
    farms = list(db.scalars(select(Farm.id).where(Farm.org_id == user.org_id, Farm.external_farm_id.is_not(None))))
    out = {"farms": len(farms), "ok": 0, "failed": [], "readings_kept": 0}
    for farm_id in farms:
        try:
            res = refresh_farm_devices(db, user, str(farm_id))
            out["ok"] += 1
            out["readings_kept"] += res.get("readings_kept", 0)
        except AppError as e:
            out["failed"].append({"farm_id": str(farm_id), "code": e.code, "message": e.message})
    return out


def poll_all() -> dict[str, Any]:
    """One round across every organisation; each farm is committed on its own so one failure loses nothing."""
    from app.core import db as dbmod
    from app.modules.identity.models import Organization

    if not enabled():
        return {"skipped": "VC_DEVICE_PROVIDER is not farmfuture"}
    started = time.monotonic()
    total = {"orgs": 0, "farms": 0, "ok": 0, "failed": 0, "readings_kept": 0}
    with dbmod.session_factory()() as db:
        orgs = [o.id for o in db.scalars(select(Organization).where(Organization.is_active == True))]  # noqa: E712
    for org_id in orgs:
        with dbmod.session_factory()() as db:
            actor = _actor(db, org_id)
            if actor is None:
                continue
            farm_ids = list(db.scalars(select(Farm.id).where(Farm.org_id == org_id,
                                                             Farm.external_farm_id.is_not(None))))
        total["orgs"] += 1
        for farm_id in farm_ids:
            total["farms"] += 1
            with dbmod.session_factory()() as db:
                try:
                    res = refresh_farm_devices(db, actor, str(farm_id))
                    db.commit()
                    total["ok"] += 1
                    total["readings_kept"] += res.get("readings_kept", 0)
                except AppError as e:
                    db.rollback()
                    total["failed"] += 1
                    log.warning("[farmfuture] poll farm %s skipped: %s (%s)", farm_id, e.message, e.code)
                except Exception:  # never let one farm stop the round
                    db.rollback()
                    total["failed"] += 1
                    log.exception("[farmfuture] poll farm %s failed", farm_id)
    total["seconds"] = round(time.monotonic() - started, 1)
    log.info("[farmfuture] device poll: %s", total)
    return total


async def run_forever() -> None:
    """The API's background loop. Checks the switch every round, so editing api/.env takes effect without a
    restart; the interval is read at start-up."""
    minutes = get_settings().varsapradaya_poll_minutes
    if minutes <= 0:
        return
    await asyncio.sleep(30)  # let the API finish starting
    while True:
        if enabled():
            try:
                await asyncio.to_thread(poll_all)
            except Exception:
                log.exception("[farmfuture] device poll round failed")
        await asyncio.sleep(minutes * 60)
