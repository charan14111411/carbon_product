from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class Stratum(TenantModel):
    """A zone of similar land. Versioned by date: a redraw closes the old version."""

    __tablename__ = "strata"
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(10), default="project")  # project | control
    control_for_code: Mapped[str | None] = mapped_column(String(40), nullable=True)
    criteria: Mapped[dict] = mapped_column(JSON, default=dict)  # e.g. {"soil_type": "red", "crop_code": "coffee"}
    field_ids: Mapped[list] = mapped_column(JSON, default=list)
    area_ha: Mapped[float] = mapped_column(Float, default=0.0)
    version: Mapped[int] = mapped_column(Integer, default=1)
    effective_from: Mapped[date] = mapped_column(Date)
    effective_to: Mapped[date | None] = mapped_column(Date, nullable=True)


class Campaign(TenantModel):
    """One round of sampling: baseline or a later monitoring round."""

    __tablename__ = "campaigns"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200))
    kind: Mapped[str] = mapped_column(String(12))  # baseline | monitoring
    design: Mapped[str] = mapped_column(String(12))  # paired | independent
    revisits_campaign_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("campaigns.id"), nullable=True)
    planned_start: Mapped[date] = mapped_column(Date)
    planned_end: Mapped[date] = mapped_column(Date)
    depth_from_cm: Mapped[float] = mapped_column(Float, default=0.0)
    depth_to_cm: Mapped[float] = mapped_column(Float)
    placement_seed: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(20), default="planned")  # planned | fieldwork | lab | complete


class SamplePlan(TenantModel):
    """How many samples a zone needs in a campaign. Calculated by one person, approved by another."""

    __tablename__ = "sample_plans"
    __table_args__ = (UniqueConstraint("campaign_id", "stratum_id"),)
    campaign_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("campaigns.id"), index=True)
    stratum_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("strata.id"))
    n_required: Mapped[int] = mapped_column(Integer)
    method: Mapped[str] = mapped_column(String(40), default="manual")  # manual | variance_formula
    inputs: Mapped[dict] = mapped_column(JSON, default=dict)  # prior_sd, target_error, confidence...
    justification: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft | approved
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Site(TenantModel):
    """A permanent sampling location. Its code never changes for the life of the project."""

    __tablename__ = "sites"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    field_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("fields.id"), index=True)
    stratum_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("strata.id"), index=True)
    code: Mapped[str] = mapped_column(String(40))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)


class SamplingPoint(TenantModel):
    """A site to be sampled in one campaign, assigned to a collector."""

    __tablename__ = "sampling_points"
    __table_args__ = (UniqueConstraint("campaign_id", "site_id"),)
    campaign_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("campaigns.id"), index=True)
    site_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("sites.id"), index=True)
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True, index=True)
    sequence: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="planned")  # planned | collected | skipped
    skip_reason: Mapped[str | None] = mapped_column(Text, nullable=True)


class Sample(LedgerModel):
    """A soil core as collected in the field. Never edited."""

    __tablename__ = "samples"
    __table_args__ = (UniqueConstraint("org_id", "code"), UniqueConstraint("org_id", "client_ref"))
    point_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("sampling_points.id"), unique=True)
    campaign_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("campaigns.id"), index=True)
    site_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("sites.id"), index=True)
    code: Mapped[str] = mapped_column(String(60), index=True)  # <site>-<campaign token>
    collected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    gps_accuracy_m: Mapped[float | None] = mapped_column(Float, nullable=True)
    distance_from_site_m: Mapped[float] = mapped_column(Float)
    depth_reached_cm: Mapped[float] = mapped_column(Float)
    photo_ids: Mapped[list] = mapped_column(JSON, default=list)
    deviation_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    device_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    client_ref: Mapped[str] = mapped_column(String(80), index=True)  # idempotency key from the field app
    context: Mapped[dict] = mapped_column(JSON, default=dict)  # snapshot: weather, sensor, satellite at collection


class SoilLayer(LedgerModel):
    """One depth increment of a core = one labelled bag sent to the lab."""

    __tablename__ = "soil_layers"
    __table_args__ = (UniqueConstraint("org_id", "code"), UniqueConstraint("org_id", "label_qr"))
    sample_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("samples.id"), index=True)
    code: Mapped[str] = mapped_column(String(70), index=True)  # <sample code>-D<n>
    label_qr: Mapped[str] = mapped_column(String(80), index=True)
    depth_from_cm: Mapped[float] = mapped_column(Float)
    depth_to_cm: Mapped[float] = mapped_column(Float)


class CustodyEvent(LedgerModel):
    """A hand-over in the life of a sample. Corrections are new events."""

    __tablename__ = "custody_events"
    sample_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("samples.id"), index=True)
    event: Mapped[str] = mapped_column(String(30))
    # collected | packed | dispatched | courier_received | lab_received | opened | analysed | archived | correction
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    location: Mapped[str] = mapped_column(String(200), default="")
    seal_intact: Mapped[bool | None] = mapped_column(nullable=True)
    count_matches: Mapped[bool | None] = mapped_column(nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    corrects_event_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("custody_events.id"), nullable=True)
