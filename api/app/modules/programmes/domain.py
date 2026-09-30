"""Pure programme/project rules: status machines and period arithmetic."""

from __future__ import annotations

from datetime import date

from app.core.errors import IllegalTransition

PROGRAMME_TRANSITIONS: dict[str, frozenset[str]] = {
    "draft": frozenset({"active"}),
    "active": frozenset({"suspended", "closed"}),
    "suspended": frozenset({"active", "closed"}),
    "closed": frozenset(),
}

PROJECT_TRANSITIONS: dict[str, frozenset[str]] = {
    "design": frozenset({"active"}),
    "active": frozenset({"monitoring", "closed"}),
    "monitoring": frozenset({"closed"}),
    "closed": frozenset(),
}


def check_transition(table: dict[str, frozenset[str]], current: str, target: str, what: str) -> None:
    if target not in table:
        raise IllegalTransition(f"'{target}' is not a valid status for a {what}.",
                                details={"from": current, "to": target})
    if target not in table.get(current, frozenset()):
        allowed = sorted(table.get(current, frozenset()))
        hint = (f" From '{current}' it can move to: {', '.join(allowed)}." if allowed
                else f" A {current} {what} can't change.")
        raise IllegalTransition(f"A {what} can't move from '{current}' to '{target}'.{hint}",
                                details={"from": current, "to": target, "allowed": allowed})


def periods_overlap(a_start: date | None, a_end: date | None, b_start: date | None, b_end: date | None) -> bool:
    """Closed intervals; ``None`` means open-ended on that side."""
    a0, a1 = a_start or date.min, a_end or date.max
    b0, b1 = b_start or date.min, b_end or date.max
    return a0 <= b1 and b0 <= a1
