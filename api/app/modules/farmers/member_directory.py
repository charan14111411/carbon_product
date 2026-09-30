"""Adapter for the Varsapradaya member platform.

This build ships a deterministic stand-in so onboarding can be demonstrated and tested
without the live service: a phone number whose last digit is even belongs to a member.
Replace ``MemberDirectory.lookup`` with an HTTP client when the platform API is available;
callers depend only on the ``MemberRecord`` shape.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field

_FARM_NAMES = ("Hill Estate", "River Plot", "Upper Terrace", "Lower Field", "Home Garden",
               "Mango Grove", "East Block", "West Block", "Tank Side", "Valley Farm")


@dataclass(frozen=True)
class MemberFarm:
    external_farm_id: str
    name: str
    has_soilsync: bool
    has_microclime: bool


@dataclass(frozen=True)
class MemberRecord:
    is_member: bool
    phone: str
    member_id: str | None = None
    farms: list[MemberFarm] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


class MemberDirectory:
    """Looks up a farmer on the Varsapradaya platform by E.164 phone number."""

    def lookup(self, phone: str) -> MemberRecord:
        digits = "".join(ch for ch in phone if ch.isdigit())
        if not digits or int(digits[-1]) % 2 != 0:
            return MemberRecord(is_member=False, phone=phone)
        tail = digits[-6:].rjust(6, "0")
        member_id = f"VP-{tail}"
        n_farms = 1 + int(tail[-2]) % 2
        farms = []
        for i in range(n_farms):
            seed = (int(tail) * 7 + i * 13) // 3
            farms.append(MemberFarm(
                external_farm_id=f"{member_id}-F{i + 1}",
                name=_FARM_NAMES[seed % len(_FARM_NAMES)],
                has_soilsync=int(tail[-3 - i]) % 2 == 0,
                has_microclime=int(tail[-4 - i]) % 3 == 0,
            ))
        return MemberRecord(is_member=True, phone=phone, member_id=member_id, farms=farms)


def get_member_directory() -> MemberDirectory:
    """FastAPI dependency; override in tests or swap for the live client."""
    return MemberDirectory()
