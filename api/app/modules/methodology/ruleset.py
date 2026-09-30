"""Read-only view of an approved rule pack, used by the engine and the quality checks.

``require(key)`` raises ``RuleMissing`` naming the key. Nothing is ever defaulted.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import RuleMissing
from app.modules.methodology.definitions import BY_KEY


@dataclass(frozen=True)
class RuleSet:
    pack_id: str
    methodology_code: str
    methodology_version: str
    revision: int
    values: dict[str, Any]
    sources: dict[str, str]

    def get(self, key: str, default: Any = None) -> Any:
        return self.values.get(key, default)

    def require(self, key: str) -> Any:
        if self.values.get(key) is None:
            label = BY_KEY[key].label if key in BY_KEY else key
            raise RuleMissing(
                f"The methodology rule “{label}” has not been entered and approved, so this can't continue.",
                details={"rule_key": key, "pack_id": self.pack_id},
            )
        return self.values[key]

    def snapshot(self) -> dict[str, Any]:
        return {
            "pack_id": self.pack_id,
            "methodology": f"{self.methodology_code} v{self.methodology_version} rev {self.revision}",
            "values": self.values,
            "sources": self.sources,
        }


def from_values(values: dict[str, Any], pack_id: str = "test", code: str = "TEST", version: str = "0") -> RuleSet:
    """Build a rule set directly (tests and simulations only)."""
    return RuleSet(pack_id, code, version, 0, dict(values), {k: "test" for k in values})


def load_pack(db: Session, pack_id: uuid.UUID, *, require_approved: bool = True) -> RuleSet:
    from app.modules.methodology.models import Rule, RulePack

    pack = db.get(RulePack, pack_id)
    if pack is None:
        raise RuleMissing("The project has no methodology rule pack.", details={"rule_key": "rule_pack"})
    if require_approved and pack.status != "approved":
        raise RuleMissing(
            "The project's methodology rules are not approved yet (Gate 0).",
            details={"rule_key": "rule_pack_approval", "pack_id": str(pack.id), "status": pack.status},
        )
    rows = db.scalars(select(Rule).where(Rule.pack_id == pack.id)).all()
    values = {r.key: (r.value or {}).get("value") for r in rows}
    sources = {
        r.key: ", ".join(x for x in (r.source_document, r.source_section, f"p. {r.source_page}" if r.source_page else None) if x)
        for r in rows
    }
    return RuleSet(str(pack.id), pack.methodology_code, pack.methodology_version, pack.revision, values, sources)


def for_project(db: Session, project, *, require_approved: bool = True) -> RuleSet:
    if project.rule_pack_id is None:
        raise RuleMissing(
            "Assign an approved methodology rule pack to this project first.",
            details={"rule_key": "rule_pack", "project_id": str(project.id)},
        )
    return load_pack(db, project.rule_pack_id, require_approved=require_approved)
