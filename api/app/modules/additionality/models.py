"""VM0042 v2.2 §7 additionality assessment per project (versioned, four-eyes approval)."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class AdditionalityAssessment(TenantModel):
    """One version of a project's additionality demonstration.

    Lifecycle: draft -> submitted -> approved (or rejected). Only drafts can be edited; an approved
    version is superseded when a newer version is approved. A new version starts as a copy.
    """

    __tablename__ = "additionality_assessments"
    __table_args__ = (UniqueConstraint("project_id", "version"),)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(12), default="draft")  # draft | submitted | approved | rejected | superseded
    # Step 1 regulatory surplus: {statement, legally_required, evidence_ids}
    regulatory_surplus: Mapped[dict] = mapped_column(JSON, default=dict)
    # Step 2 barrier analysis (VT0008 Step 2): [{type, description, evidence_ids}]
    barriers: Mapped[list] = mapped_column(JSON, default=list)
    # Step 3 common practice: [{practice, region, adoption_pct, source_type, source_reference, expert, evidence_ids,
    #                          essential_distinction: {n_all_ha, n_diff_ha, description, evidence_ids}}]
    common_practice: Mapped[list] = mapped_column(JSON, default=list)
    result: Mapped[dict] = mapped_column(JSON, default=dict)  # frozen at submission
    submitted_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    review_note: Mapped[str] = mapped_column(Text, default="")
    supersedes_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("additionality_assessments.id"), nullable=True)
