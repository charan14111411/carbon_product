"""Small HTTP helper for the public data providers (NASA POWER, SoilGrids, Planetary Computer).

* One ``httpx.Client`` per provider instance, with the timeout from ``Settings.http_timeout_s``.
* Limited retries with exponential backoff (1 s, 2 s, 4 s ...) on rate limits and server errors; free services
  throttle bursts. ``Retry-After`` is honoured when it is short.
* Every failure (network error, timeout, HTTP error after the retries, a body that is not JSON) becomes
  ``ProviderUnavailable``, which the supporting-data resolver turns into a "not available" value with the reason,
  and which the API shows as a 503 with a plain message.

Only coordinates, dates and public scene ids are sent; never user or farmer data.
"""

from __future__ import annotations

import logging
import time
from collections.abc import Callable
from typing import Any

import httpx

from app.core.errors import ProviderUnavailable

log = logging.getLogger("app.providers")

RETRY_STATUSES = frozenset({429, 500, 502, 503, 504})
MAX_RETRY_AFTER_S = 30.0


class JsonHttp:
    def __init__(self, provider: str, *, timeout_s: float, retries: int, client: httpx.Client | None = None,
                 retry_statuses: frozenset[int] = RETRY_STATUSES, sleep: Callable[[float], None] = time.sleep,
                 backoff_s: float = 1.0):
        self.provider = provider
        self.retries = max(0, retries)
        self.retry_statuses = retry_statuses
        self.backoff_s = backoff_s
        self._sleep = sleep
        self._client = client or httpx.Client(timeout=httpx.Timeout(timeout_s, connect=min(timeout_s, 15.0)),
                                              headers={"User-Agent": "varsapradaya-carbon/1.0"})

    def _wait(self, attempt: int, response: httpx.Response | None) -> None:
        delay = self.backoff_s * 2 ** attempt
        if response is not None:
            try:
                delay = max(delay, min(MAX_RETRY_AFTER_S, float(response.headers.get("Retry-After", 0))))
            except ValueError:
                pass
        self._sleep(delay)

    def _send(self, method: str, url: str, **kw: Any) -> httpx.Response:
        last: str = ""
        for attempt in range(self.retries + 1):
            response: httpx.Response | None = None
            try:
                response = self._client.request(method, url, **kw)
            except httpx.TimeoutException:
                last = "timed out"
            except httpx.HTTPError as e:
                last = f"network error: {type(e).__name__}"
            else:
                if response.status_code < 400:
                    return response
                last = f"HTTP {response.status_code}"
                if response.status_code not in self.retry_statuses:
                    break
            if attempt < self.retries:
                log.info("%s: %s on %s, retrying (%d/%d)", self.provider, last, url, attempt + 1, self.retries)
                self._wait(attempt, response)
        log.warning("%s unavailable: %s (%s)", self.provider, last, url)
        raise ProviderUnavailable(self.provider, last)

    def request(self, method: str, url: str, **kw: Any) -> Any:
        """The decoded JSON body, or ``ProviderUnavailable``."""
        response = self._send(method, url, **kw)
        try:
            return response.json()
        except ValueError as e:
            raise ProviderUnavailable(self.provider, "the answer was not valid JSON") from e

    def raw(self, method: str, url: str, **kw: Any) -> bytes:
        """The body bytes (e.g. a .npy raster window), or ``ProviderUnavailable``."""
        return self._send(method, url, **kw).content

    def get(self, url: str, **kw: Any) -> Any:
        return self.request("GET", url, **kw)

    def post(self, url: str, **kw: Any) -> Any:
        return self.request("POST", url, **kw)


class TtlCache:
    """A tiny in-process cache (public data changes slowly; avoid calling external APIs on every page load)."""

    def __init__(self, ttl_s: float, max_items: int = 512):
        self.ttl_s, self.max_items = ttl_s, max_items
        self._data: dict[Any, tuple[float, Any]] = {}

    def get(self, key: Any) -> Any | None:
        hit = self._data.get(key)
        if hit is None:
            return None
        if time.monotonic() - hit[0] > self.ttl_s:
            self._data.pop(key, None)
            return None
        return hit[1]

    def put(self, key: Any, value: Any) -> Any:
        if len(self._data) >= self.max_items:
            self._data.pop(next(iter(self._data)))
        self._data[key] = (time.monotonic(), value)
        return value

    def clear(self) -> None:
        self._data.clear()
