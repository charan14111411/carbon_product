"""VM0042 v2.2 §8.2 (QA2) baseline control sites: which control stratum stands in for which project
stratum / quantification unit, and the append-only record of every Table 7 similarity assessment."""

from __future__ import annotations

import uuid

from sqlalchemy import JSON, Float, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class ControlSiteLink(TenantModel):
    """A control stratum (role "control") linked to one project stratum or to a whole quantification unit.
    One control site may serve several QUs (one link each). Its location is fixed when linked."""

    __tablename__ = "control_site_links"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    control_stratum_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("strata.id"), index=True)
    project_stratum_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("strata.id"), nullable=True)
    qu_code: Mapped[str | None] = mapped_column(String(40), nullable=True)
    managed_by: Mapped[str] = mapped_column(String(200))
    management_plan_evidence_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("evidence_files.id"), nullable=True)
    # Location fixed for the project lifetime (§8.2): area-weighted centroid of the control fields when linked.
    fixed_lat: Mapped[float] = mapped_column(Float)
    fixed_lon: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(10), default="active")  # active | retired
    notes: Mapped[str] = mapped_column(Text, default="")
    # Table 7 note e: crop functional groups may be compared only where the crop type can't be matched — why not
    crop_group_justification: Mapped[str] = mapped_column(Text, default="")


class ControlSiteAssessment(LedgerModel):
    """One result row of an assessment run: a link's Table 7 criteria, or the project-level checks."""

    __tablename__ = "control_site_assessments"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    run_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    scope: Mapped[str] = mapped_column(String(10))  # link | project
    link_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("control_site_links.id"), nullable=True)
    overall: Mapped[str] = mapped_column(String(10))  # pass | fail | pending
    criteria: Mapped[list] = mapped_column(JSON, default=list)
    summary: Mapped[dict] = mapped_column(JSON, default=dict)
