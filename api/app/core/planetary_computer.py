"""Microsoft Planetary Computer: STAC search and the Data API (free, no account), shared by the satellite
provider (``intelligence/planetary_computer.py``) and the Copernicus DEM terrain provider
(``supporting/copernicus_dem.py``).

* STAC search: ``POST {stac_url}/search`` (paged through the ``next`` link).
* ``POST {pc_data_api_url}/item/statistics``: zonal statistics of band expressions inside a GeoJSON polygon,
  computed server-side (no imagery download, no GDAL here). Several expressions separated by ``;`` come back in
  one answer, in order.
* ``GET {pc_data_api_url}/item/bbox/{minx},{miny},{maxx},{maxy}/{w}x{h}.npy``: a small raster window as a NumPy
  array (band 1 = data, last band = mask, 255 = valid).

The free service throttles bursts: 403/429 and 5xx are retried with backoff. Only geometries, dates and public
scene ids are sent.
"""

from __future__ import annotations

import io
from datetime import date
from typing import Any

import numpy as np

from app.core.config import get_settings
from app.core.errors import ProviderUnavailable
from app.core.http import RETRY_STATUSES, JsonHttp

PROVIDER_LABEL = "Microsoft Planetary Computer"
PC_RETRY_STATUSES = RETRY_STATUSES | {403}  # the Data API answers 403 when it throttles
MAX_PAGES = 10


class PlanetaryComputerClient:
    def __init__(self, http: JsonHttp | None = None):
        s = get_settings()
        self.stac_url = s.stac_url.rstrip("/")
        self.data_url = s.pc_data_api_url.rstrip("/")
        self.http = http or JsonHttp(PROVIDER_LABEL, timeout_s=max(s.http_timeout_s, 120.0), retries=s.http_retries,
                                     retry_statuses=PC_RETRY_STATUSES, backoff_s=2.0)

    def search(self, collection: str, geometry: dict, start: date | None = None, end: date | None = None,
               query: dict | None = None, fields: list[str] | None = None, limit: int = 100) -> list[dict]:
        body: dict[str, Any] = {"collections": [collection], "intersects": geometry, "limit": limit}
        if start and end:
            body["datetime"] = f"{start.isoformat()}T00:00:00Z/{end.isoformat()}T23:59:59Z"
        if query:
            body["query"] = query
        if fields:
            body["fields"] = {"include": ["id", *fields], "exclude": ["links", "geometry", "bbox", "assets"]}
        url, method = f"{self.stac_url}/search", "POST"
        out: list[dict] = []
        for _ in range(MAX_PAGES):
            page = self.http.request(method, url, json=body) if method == "POST" else self.http.get(url)
            try:
                out.extend(page["features"])
            except (KeyError, TypeError) as e:
                raise ProviderUnavailable(PROVIDER_LABEL, "unexpected STAC search answer") from e
            nxt = next((link for link in page.get("links", []) if link.get("rel") == "next"), None)
            if not nxt:
                break
            url, method = nxt["href"], nxt.get("method", "GET").upper()
            if method == "POST":
                body = nxt.get("body") or body
        return out

    def statistics(self, collection: str, item_id: str, geometry: dict, expressions: list[str]) -> list[dict]:
        """One statistics dict (mean, count, ...) per expression, in the order given."""
        body = self.http.post(
            f"{self.data_url}/item/statistics",
            params={"collection": collection, "item": item_id, "expression": ";".join(expressions),
                    "asset_as_band": "true"},
            json={"type": "Feature", "geometry": geometry, "properties": {}})
        try:
            stats = list(body["properties"]["statistics"].values())
        except (KeyError, TypeError, AttributeError) as e:
            raise ProviderUnavailable(PROVIDER_LABEL, "unexpected statistics answer") from e
        if len(stats) != len(expressions):
            raise ProviderUnavailable(PROVIDER_LABEL, "statistics answer has the wrong number of bands")
        return stats

    def bbox_array(self, collection: str, item_id: str, asset: str, bounds: tuple[float, float, float, float],
                   width: int, height: int) -> np.ndarray:
        """``(bands, height, width)`` float array; rows run north→south. The last band is the mask (255 = valid)."""
        minx, miny, maxx, maxy = bounds
        url = f"{self.data_url}/item/bbox/{minx:.6f},{miny:.6f},{maxx:.6f},{maxy:.6f}/{width}x{height}.npy"
        raw = self.http.raw("GET", url, params={"collection": collection, "item": item_id, "assets": asset})
        try:
            arr = np.load(io.BytesIO(raw), allow_pickle=False)
        except (ValueError, OSError) as e:
            raise ProviderUnavailable(PROVIDER_LABEL, "unreadable raster answer") from e
        if arr.ndim != 3 or arr.shape[1:] != (height, width):
            raise ProviderUnavailable(PROVIDER_LABEL, f"raster answer has shape {arr.shape}")
        return arr
