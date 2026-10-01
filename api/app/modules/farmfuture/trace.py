"""One log line per FarmFuture call, saying whether data came back.

Ported from the first integration. The question asked of this integration during bring-up is not
"did it raise" but "did that endpoint actually return rows for this customer": an HTTP 200 carrying an
empty list is the most common failure here, and it looks like success everywhere else.

Nothing here ever prints a token, a payload or a phone number in full.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field

logger = logging.getLogger("vcarbon.farmfuture")

#: Printed in the DATA column. Three states, not two: an endpoint that answered with nothing is not the
#: same as one that failed, and treating them the same is how an empty estate list becomes "no devices".
YES, EMPTY, FAIL = "yes", "EMPTY", "FAIL"


def mask_phone(phone: str | None) -> str:
    """+919812345678 -> +9198****5678. Enough to tell two customers apart."""
    phone = phone or ""
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) < 8:
        return "*" * len(digits)
    prefix = "+" if phone.strip().startswith("+") else ""
    return f"{prefix}{digits[:4]}{'*' * (len(digits) - 8)}{digits[-4:]}"


def mask_token(token: str | None) -> str:
    if not token:
        return "none"
    # ASCII only: this is read in a Windows console, where a cp1252 codepage mangles an ellipsis.
    return f"...{token[-6:]} (len {len(token)})"


@dataclass
class CallTrace:
    """What one endpoint did."""

    endpoint: str
    status: int | None = None
    data: str = FAIL
    count: int | None = None
    elapsed_s: float = 0.0
    detail: str = ""
    #: Set once the line has been logged. The HTTP layer knows the status but not yet whether the body
    #: held anything, so a call is recorded when it returns and logged once its caller has judged it.
    printed: bool = False

    def as_dict(self) -> dict:
        return {"endpoint": self.endpoint, "status": self.status, "data": self.data, "count": self.count,
                "elapsed_s": round(self.elapsed_s, 3), "detail": self.detail}


@dataclass
class RunTrace:
    """Every call made while looking one customer (or one farm) up."""

    calls: list[CallTrace] = field(default_factory=list)

    def add(self, call: CallTrace) -> CallTrace:
        self.calls.append(call)
        return call

    def settle(self, call: CallTrace) -> CallTrace:
        """Logs the line, now that DATA is known. Safe to call twice."""
        if not call.printed:
            call.printed = True
            _emit(call)
        return call

    @property
    def all_ok(self) -> bool:
        return all(c.data == YES for c in self.calls)

    def table(self) -> str:
        """The end-of-run summary, as printed by ``scripts/farmfuture_check.py``."""
        width = max([len(c.endpoint) for c in self.calls] + [8])
        lines = [
            f"{'ENDPOINT'.ljust(width)}  HTTP  DATA   COUNT  TIME    DETAIL",
            f"{'-' * width}  ----  -----  -----  ------  ------",
        ]
        for c in self.calls:
            lines.append(
                f"{c.endpoint.ljust(width)}  {str(c.status or '---').rjust(4)}  {c.data.ljust(5)}  "
                f"{str(c.count if c.count is not None else '-').rjust(5)}  {c.elapsed_s:5.2f}s  {c.detail}"
            )
        return "\n".join(lines)


def _emit(call: CallTrace) -> None:
    level = logging.INFO if call.data == YES else logging.WARNING
    logger.log(
        level,
        "[farmfuture] %-28s HTTP %-4s %5.2fs DATA=%-5s count=%-5s %s",
        call.endpoint,
        call.status if call.status is not None else "---",
        call.elapsed_s,
        call.data,
        call.count if call.count is not None else "-",
        call.detail,
    )
