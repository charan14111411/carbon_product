"""The real member directory: ``MemberDirectory.lookup`` backed by the FarmFuture platform."""

from __future__ import annotations

from collections.abc import Callable

import httpx

from app.modules.farmers.member_directory import MemberDirectoryUnavailable, MemberFarm, MemberRecord
from app.modules.farmfuture.client import FarmFutureClient
from app.modules.farmfuture.config import FarmFutureConfig
from app.modules.farmfuture.lookup import CustomerLookup, has_soil_readings, has_weather_readings, lookup_customer
from app.modules.farmfuture.session import TokenStore, phone_digits, to_e164, token_store
from app.modules.farmfuture.trace import RunTrace

MEMBER_PREFIX = "FF-"


def member_id_for(phone_e164: str) -> str:
    """Their platform identifies a customer by mobile number and returns no other customer id, so the
    member id is derived from the E.164 number -- stable for as long as the farmer keeps the number."""
    return MEMBER_PREFIX + phone_digits(phone_e164)


class FarmFutureDirectory:
    source = "farmfuture"

    def __init__(
        self,
        config: FarmFutureConfig | None = None,
        *,
        transport: httpx.BaseTransport | None = None,
        tokens: TokenStore | None = None,
        with_readings: bool = True,
        on_trace: Callable[[RunTrace], None] | None = None,
    ) -> None:
        self.config = config or FarmFutureConfig.from_settings()
        self.transport = transport
        self.tokens = tokens if tokens is not None else token_store
        self.with_readings = with_readings
        self.on_trace = on_trace

    def client(self) -> FarmFutureClient:
        return FarmFutureClient(self.config, transport=self.transport)

    def customer(self, phone: str) -> CustomerLookup:
        with self.client() as client:
            result = lookup_customer(phone, client=client, with_readings=self.with_readings, tokens=self.tokens)
        if self.on_trace:
            self.on_trace(result.trace)
        return result

    def lookup(self, phone: str) -> MemberRecord:
        e164 = to_e164(phone, self.config.country_code)
        result = self.customer(e164)
        if result.lookup_failed:
            raise MemberDirectoryUnavailable(
                "Varsapradaya couldn't be reached, so we don't know yet whether this farmer is a member. "
                "Nothing was saved. Try again in a few minutes.",
                details={"reasons": result.warnings})
        if not result.is_existing_customer:
            return MemberRecord(is_member=False, phone=phone, source=self.source, summary=result.summary())
        farms: list[MemberFarm] = []
        warnings = list(result.warnings)
        for c in result.candidates:
            f = c.farm
            if not f.farm_id:
                warnings.append(f"A farm named '{f.name or 'unnamed'}' has no ID on Varsapradaya and can't be imported.")
                continue
            farms.append(MemberFarm(
                external_farm_id=f.farm_id,
                name=f.name or f.estate_name or f"Farm {f.farm_id[:8]}",
                has_soilsync=has_soil_readings(c.sensors),
                has_microclime=has_weather_readings(c.stations),
                estate_id=f.estate_id or None,
                estate_name=f.estate_name,
                postal_code=f.postal_code,
                crops=list(f.crops),
                plants_per_hectare=f.plants_per_hectare,
                has_sensor=f.has_sensor,
                has_weather=f.has_weather,
                subscription_active=f.subscription_active,
                tier=c.tier,
                notes=list(c.notes),
            ))
        return MemberRecord(is_member=True, phone=phone, member_id=member_id_for(e164), farms=farms,
                            source=self.source, tier=result.tier, summary=result.summary(), warnings=warnings)
