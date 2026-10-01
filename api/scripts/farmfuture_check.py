"""Bring-up check for the Varsapradaya (FarmFuture) API: does each call return data? READ-ONLY.

Run from the ``api`` folder, with a phone number you are entitled to look up (your own):

    ..\\.venv\\Scripts\\python -m scripts.farmfuture_check +91XXXXXXXXXX
    ..\\.venv\\Scripts\\python -m scripts.farmfuture_check +91XXXXXXXXXX --farm <their farm GUID>
    ..\\.venv\\Scripts\\python -m scripts.farmfuture_check +91XXXXXXXXXX --keys

It makes only the four read calls (ValidateMobileNumber, GetUserEstatesAndFarmsList,
GetAllSensorsLatestData, GetAllWeatherData), writes nothing to the database, prints one masked line per call
while it runs and a summary table at the end, then exits non-zero if an account-level call failed or answered
with nothing -- so a silently emptied endpoint is caught rather than discovered at verification.

Settings come from api/.env (FARMFUTURE_BASE_URL, FARMFUTURE_TIMEOUT_S, FARMFUTURE_VERIFY_TLS,
FARMFUTURE_COUNTRY_CODE). The token is held in memory for this run only and never printed in full.

``--keys`` prints the field names each endpoint actually returned, to tighten the mapping in
``app/modules/farmfuture/parsing.py`` from evidence.
"""

from __future__ import annotations

import argparse
import json
import logging
import sys

from app.modules.farmfuture.client import FarmFutureClient, FarmFutureError
from app.modules.farmfuture.config import FarmFutureConfig
from app.modules.farmfuture.lookup import lookup_customer
from app.modules.farmfuture.trace import FAIL, YES, mask_phone


def configure_logging(verbose: bool) -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(message)s"))
    root = logging.getLogger()
    root.handlers[:] = [handler]
    root.setLevel(logging.DEBUG if verbose else logging.INFO)
    # httpx logs full URLs at INFO; they carry farm GUIDs but never the phone or the token.
    logging.getLogger("httpx").setLevel(logging.INFO if verbose else logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("phone", help="mobile number to check, e.g. +91XXXXXXXXXX")
    parser.add_argument("--farm", help="skip the estate list and read the latest-readings calls for this farm GUID")
    parser.add_argument("--keys", action="store_true", help="print the field names each endpoint returned")
    parser.add_argument("--no-readings", action="store_true", help="skip the sensor and weather calls")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args(argv)
    configure_logging(args.verbose)

    config = FarmFutureConfig.from_settings()
    print(f"\nVarsapradaya / FarmFuture check -- {mask_phone(args.phone)} against {config.base_url}\n")

    if args.farm:
        return _readings_only(args, config)

    with FarmFutureClient(config) as client:
        result = lookup_customer(args.phone, client=client, with_readings=not args.no_readings)

    print("\n" + result.trace.table())
    print("\n" + result.summary())
    for candidate in result.candidates:
        farm = candidate.farm
        print(f"\n  farm {farm.farm_id or '(no GUID)'}  {farm.name or '(unnamed)'}  estate={farm.estate_name or '-'}"
              f"  postal={farm.postal_code or '-'}  crops={', '.join(farm.crops) or '-'}  tier={candidate.tier}")
        for sensor in [*candidate.sensors, *candidate.stations]:
            _print_device(sensor, "      ")
        for note in candidate.notes:
            print(f"      note: {note}")
        if args.keys:
            print(f"      their farm keys: {sorted(farm.raw)}")
            for sensor in candidate.sensors[:1]:
                print(f"      their sensor keys: {sorted(sensor.raw)}")
                print(f"      sample row: {json.dumps(sensor.raw)[:400]}")
            for station in candidate.stations[:1]:
                print(f"      their weather keys: {sorted(station.raw)}")
    for warning in result.warnings:
        print(f"\n  WARNING: {warning}")

    # An empty answer from a per-farm call is a fact about that farm (most farms have no weather station),
    # not a fault. Only the two account-level calls must return rows; a FAIL anywhere counts.
    account_level = {"ValidateMobileNumber", "GetUserEstatesAndFarmsList"}
    failed = [c for c in result.trace.calls if c.data == FAIL or (c.endpoint in account_level and c.data != YES)]
    if failed:
        print("\nFAIL -- " + ", ".join(f"{c.endpoint} ({c.data})" for c in failed) + "\n")
        return 1
    empty = [c for c in result.trace.calls if c.data != YES]
    if empty:
        print(f"\nOK -- every call answered. {len(empty)} returned no rows, which means no device on that endpoint "
              "for that farm: a fallback, not a fault.\n")
    else:
        print("\nOK -- every endpoint returned data.\n")
    return 0


def _print_device(sensor, indent: str) -> None:
    print(f"{indent}{sensor.kind:<7} {sensor.device_id or '(no id)'}  type={sensor.device_type or '-'}"
          f"  at={sensor.observed_at or '-'}{'' if sensor.observed_at_is_utc else ' (local time)'}"
          + ("  FORECAST" if sensor.is_forecast else ""))
    for name, value in sorted(sensor.parameters.items()):
        print(f"{indent}    {name:<22} {value}")
    for name, value in sorted(sensor.text_values.items()):
        print(f"{indent}    {name:<22} {value}")
    if sensor.missing:
        print(f"{indent}    no reading (-1): {', '.join(sensor.missing)}")


def _readings_only(args, config: FarmFutureConfig) -> int:
    """The latest-readings calls on their own, for a farm GUID that is already known."""
    with FarmFutureClient(config) as client:
        token = None
        try:
            token = client.validate_mobile_number(args.phone)
        except FarmFutureError as exc:
            print(f"  token step failed: {exc}; trying the readings calls unauthenticated")
        try:
            sensors = client.sensors_latest(args.farm, token)
            stations = client.weather_latest(args.farm, token)
        except FarmFutureError as exc:
            print(f"\n{client.trace.table()}\n\nFAIL -- {exc}\n")
            return 1
        print("\n" + client.trace.table() + "\n")
        for sensor in [*sensors, *stations]:
            _print_device(sensor, "  ")
            unmapped = sorted(set(sensor.raw) - set(sensor.parameters))
            if args.keys and unmapped:
                print(f"      unmapped keys: {unmapped}")
        if not sensors and not stations:
            print("  no devices returned -- this farm runs on fallback sources\n")
            return 1
    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
