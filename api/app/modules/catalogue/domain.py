"""Pure validation of configurable attribute schemas (no database).

A schema is a list of attribute definitions, the same shape for ``Crop.attributes`` and
``PracticeType.fields``::

    {"key": "variety", "label": "Variety", "type": "text|number|choice",
     "required": bool, "choices": [...], "unit": "kg", "min": 0, "max": 100}
"""

from __future__ import annotations

import math
import re
from typing import Any

ATTRIBUTE_TYPES = ("text", "number", "choice")
_KEY = re.compile(r"^[a-z][a-z0-9_]{0,39}$")


def validate_schema(schema_list: list[dict[str, Any]]) -> list[str]:
    """Problems with an attribute schema itself (empty list = valid)."""
    errors: list[str] = []
    seen: set[str] = set()
    for i, d in enumerate(schema_list or []):
        key = d.get("key") if isinstance(d, dict) else None
        if not isinstance(key, str) or not _KEY.match(key):
            errors.append(f"Attribute {i + 1} needs a key made of lowercase letters, digits and underscores.")
            continue
        if key in seen:
            errors.append(f"The attribute key '{key}' is used more than once.")
        seen.add(key)
        t = d.get("type", "text")
        if t not in ATTRIBUTE_TYPES:
            errors.append(f"Attribute '{key}' has an unknown type '{t}'. Use text, number or choice.")
        if t == "choice" and not d.get("choices"):
            errors.append(f"Attribute '{key}' is a choice, so it needs a list of choices.")
        lo, hi = d.get("min"), d.get("max")
        if lo is not None and hi is not None and lo > hi:
            errors.append(f"Attribute '{key}' has a minimum greater than its maximum.")
    return errors


def _blank(v: Any) -> bool:
    return v is None or (isinstance(v, str) and not v.strip())


def validate_attributes(schema_list: list[dict[str, Any]], values: dict[str, Any] | None) -> list[str]:
    """Check ``values`` against ``schema_list``. Returns plain-English problems (empty = valid).

    Unknown keys are rejected so typos never pass silently.
    """
    values = values or {}
    defs = {d["key"]: d for d in (schema_list or []) if isinstance(d, dict) and "key" in d}
    errors = [f"'{k}' is not a recognised field." for k in values if k not in defs]

    for key, d in defs.items():
        label = d.get("label") or key
        v = values.get(key)
        if _blank(v):
            if d.get("required"):
                errors.append(f"{label} is required.")
            continue
        t = d.get("type", "text")
        if t == "number":
            if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v):
                errors.append(f"{label} must be a number.")
                continue
            if d.get("min") is not None and v < d["min"]:
                errors.append(f"{label} must be at least {d['min']}.")
            if d.get("max") is not None and v > d["max"]:
                errors.append(f"{label} must be at most {d['max']}.")
        elif t == "choice":
            choices = d.get("choices") or []
            if v not in choices:
                errors.append(f"{label} must be one of: {', '.join(str(c) for c in choices)}.")
        elif not isinstance(v, str):
            errors.append(f"{label} must be text.")
    return errors
