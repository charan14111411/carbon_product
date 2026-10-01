"""Adapter for the Varsapradaya member platform (FarmFuture).

Two implementations of one contract, ``lookup(phone) -> MemberRecord``, chosen by ``VC_MEMBER_DIRECTORY``
(api/.env or the environment):

* ``simulated`` (default) -- a deterministic stand-in so onboarding can be demonstrated and tested
  without the live service: a phone number whose last digit is even belongs to a member.
* ``farmfuture`` -- the real platform (``app/modules/farmfuture``), configured by the ``FARMFUTURE_*``
  settings.

"Not a member" and "could not ask" are different answers. The second raises
``MemberDirectoryUnavailable`` (HTTP 503, code ``MEMBER_DIRECTORY_UNAVAILABLE``) and nothing is stored.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Protocol

from app.core.errors import AppError

_FARM_NAMES = ("Hill Estate", "River Plot", "Upper Terrace", "Lower Field", "Home Garden",
               "Mango Grove", "East Block", "West Block", "Tank Side", "Valley Farm")

TIERS = ("full", "partial", "none")


class MemberDirectoryUnavailable(AppError):
    """The member platform could not be reached or rejected the request. Not an answer about the farmer."""

    status, code = 503, "MEMBER_DIRECTORY_UNAVAILABLE"


@dataclass(frozen=True)
class MemberFarm:
    external_farm_id: str
    name: str
    #: Readings actually arrived from a SoilSync probe / a MicroClime station (not the platform's flags).
    has_soilsync: bool
    has_microclime: bool
    estate_id: str | None = None
    estate_name: str | None = None
    postal_code: str | None = None
    crops: list[str] = field(default_factory=list)
    plants_per_hectare: float | None = None
    #: What the platform says is installed / subscribed. A prior only.
    has_sensor: bool = False
    has_weather: bool = False
    subscription_active: bool = True
    #: full | partial | none, decided from the readings that arrived.
    tier: str = "none"
    notes: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class MemberRecord:
    is_member: bool
    phone: str
    member_id: str | None = None
    farms: list[MemberFarm] = field(default_factory=list)
    source: str = "simulated"
    tier: str = "none"
    summary: str = ""
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


class MemberDirectoryProtocol(Protocol):
    source: str

    def lookup(self, phone: str) -> MemberRecord: ...


def tier_from(has_soil: bool, has_weather: bool) -> str:
    return "full" if has_soil and has_weather else "partial" if has_soil or has_weather else "none"


class MemberDirectory:
    """Simulated directory: looks up a farmer by E.164 phone number, deterministically."""

    source = "simulated"

    def lookup(self, phone: str) -> MemberRecord:
        digits = "".join(ch for ch in phone if ch.isdigit())
        if not digits or int(digits[-1]) % 2 != 0:
            return MemberRecord(is_member=False, phone=phone, source=self.source,
                                summary="Not a member (simulated directory).")
        tail = digits[-6:].rjust(6, "0")
        member_id = f"VP-{tail}"
        n_farms = 1 + int(tail[-2]) % 2
        farms = []
        for i in range(n_farms):
            seed = (int(tail) * 7 + i * 13) // 3
            soil, weather = int(tail[-3 - i]) % 2 == 0, int(tail[-4 - i]) % 3 == 0
            farms.append(MemberFarm(
                external_farm_id=f"{member_id}-F{i + 1}",
                name=_FARM_NAMES[seed % len(_FARM_NAMES)],
                has_soilsync=soil,
                has_microclime=weather,
                has_sensor=soil,
                has_weather=weather,
                tier=tier_from(soil, weather),
                notes=["Simulated member platform: no real farm data."],
            ))
        tier = max((f.tier for f in farms), key=lambda t: -TIERS.index(t), default="none")
        return MemberRecord(is_member=True, phone=phone, member_id=member_id, farms=farms, source=self.source,
                            tier=tier, summary=f"Member with {len(farms)} farm(s) (simulated directory).")


SimulatedMemberDirectory = MemberDirectory


def get_member_directory() -> MemberDirectoryProtocol:
    """FastAPI dependency: the directory chosen by ``VC_MEMBER_DIRECTORY``. Override in tests."""
    from app.core.config import get_settings

    name = (get_settings().vc_member_directory or "simulated").strip().lower()
    if name == "simulated":
        return MemberDirectory()
    if name == "farmfuture":
        from app.modules.farmfuture.directory import FarmFutureDirectory

        return FarmFutureDirectory()
    raise MemberDirectoryUnavailable(
        "The member platform isn't configured correctly on the server. Ask an administrator to check "
        "VC_MEMBER_DIRECTORY.", code="MEMBER_DIRECTORY_MISCONFIGURED", details={"allowed": ["simulated", "farmfuture"]})
