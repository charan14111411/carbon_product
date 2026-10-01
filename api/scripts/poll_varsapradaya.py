"""Read every Varsapradaya member farm's SoilSync / MicroClime devices once and keep the readings.

    ..\.venv\Scripts\python -m scripts.poll_varsapradaya

Needs VC_DEVICE_PROVIDER=farmfuture in api/.env. The API already does this on a timer
(VARSAPRADAYA_POLL_MINUTES, default 60); use this script for a one-off round or from Windows Task Scheduler.
"""

from __future__ import annotations

import logging


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    from app.main import load_models
    from app.modules.farmfuture import poller

    load_models()
    print(poller.poll_all())


if __name__ == "__main__":
    main()
