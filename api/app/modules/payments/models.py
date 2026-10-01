from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class BenefitRule(TenantModel):
    """How revenue is shared with farmers. Versioned; approved versions are frozen."""

    __tablename__ = "benefit_rules"
    __table_args__ = (UniqueConstraint("org_id", "programme_id", "version"),)
    programme_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("programmes.id"), index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    farmer_share_pct: Mapped[float] = mapped_column(Numeric(5, 2))
    # weighting of the farmer pool: {"area": 0.5, "practices": 0.5} or {"credits": 1.0}
    weights: Mapped[dict] = mapped_column(JSON)
    deductions: Mapped[list] = mapped_column(JSON, default=list)  # [{"name": "Verification fee", "pct": 5}]
    min_payout: Mapped[float] = mapped_column(Numeric(14, 2), default=0)
    status: Mapped[str] = mapped_column(String(12), default="draft")  # draft | approved | retired
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")


class BenefitPool(TenantModel):
    """Money from one sale set aside for farmers, and how it was split."""

    __tablename__ = "benefit_pools"
    sale_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("sales.id"), unique=True)
    rule_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("benefit_rules.id"))
    gross_amount: Mapped[float] = mapped_column(Numeric(14, 2))
    deductions_amount: Mapped[float] = mapped_column(Numeric(14, 2))
    farmer_pool_amount: Mapped[float] = mapped_column(Numeric(14, 2))
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    status: Mapped[str] = mapped_column(String(20), default="calculated")  # calculated | approved | paid
    breakdown: Mapped[dict] = mapped_column(JSON, default=dict)


class Entitlement(LedgerModel):
    """One farmer's share of a pool, with the inputs used. Recalculation = new rows."""

    __tablename__ = "entitlements"
    pool_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("benefit_pools.id"), index=True)
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    amount: Mapped[float] = mapped_column(Numeric(14, 2))
    inputs: Mapped[dict] = mapped_column(JSON)  # area_ha, practices, credits, weights, rule version
    calc_version: Mapped[int] = mapped_column(Integer, default=1)


class PaymentProfile(TenantModel):
    __tablename__ = "payment_profiles"
    __table_args__ = (UniqueConstraint("farmer_id"),)
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"))
    method: Mapped[str] = mapped_column(String(10))  # upi | bank
    upi_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    account_masked: Mapped[str | None] = mapped_column(String(30), nullable=True)  # XXXXXX1234
    ifsc: Mapped[str | None] = mapped_column(String(15), nullable=True)
    account_name: Mapped[str] = mapped_column(String(200))
    # Opaque token from the payout provider (tokenised account). Full numbers are never stored.
    provider_token: Mapped[str | None] = mapped_column(String(200), nullable=True)
    verified: Mapped[bool] = mapped_column(default=False)
    verified_on: Mapped[date | None] = mapped_column(Date, nullable=True)


class PayoutBatch(TenantModel):
    __tablename__ = "payout_batches"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    pool_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("benefit_pools.id"), index=True)
    total_amount: Mapped[float] = mapped_column(Numeric(14, 2))
    status: Mapped[str] = mapped_column(String(20), default="draft")
    # draft | approved | submitted | completed | partially_failed
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Payout(TenantModel):
    __tablename__ = "payouts"
    __table_args__ = (UniqueConstraint("batch_id", "entitlement_id"),)
    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("payout_batches.id"), index=True)
    entitlement_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("entitlements.id"))
    farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    amount: Mapped[float] = mapped_column(Numeric(14, 2))
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending | paid | failed | on_hold
    provider_ref: Mapped[str | None] = mapped_column(String(120), nullable=True)
    failure_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    attempts: Mapped[int] = mapped_column(Integer, default=0)


class PaymentAttempt(LedgerModel):
    """Every hand-over of a payout to the provider and its answer. Append-only."""

    __tablename__ = "payment_attempts"
    payout_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("payouts.id"), index=True)
    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("payout_batches.id"), index=True)
    attempt_no: Mapped[int] = mapped_column(Integer)
    provider: Mapped[str | None] = mapped_column(String(40), nullable=True)
    provider_ref: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    amount: Mapped[float] = mapped_column(Numeric(14, 2))
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    status: Mapped[str] = mapped_column(String(12))  # paid | failed
    error: Mapped[str | None] = mapped_column(Text, nullable=True)


class ReconciliationRun(TenantModel):
    """One provider settlement statement matched against a batch's payment attempts."""

    __tablename__ = "reconciliation_runs"
    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("payout_batches.id"), index=True)
    statement_evidence_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("evidence_files.id"))
    statement_sha256: Mapped[str] = mapped_column(String(64))
    rows: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20))  # reconciled | mismatches
    counts: Mapped[dict] = mapped_column(JSON, default=dict)


class ReconciliationItem(LedgerModel):
    """One matching outcome. Append-only; a fresh statement means a new run."""

    __tablename__ = "reconciliation_items"
    run_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("reconciliation_runs.id"), index=True)
    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("payout_batches.id"), index=True)
    payout_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("payouts.id"), nullable=True)
    provider_ref: Mapped[str | None] = mapped_column(String(120), nullable=True)
    row_no: Mapped[int | None] = mapped_column(Integer, nullable=True)
    expected_amount: Mapped[float | None] = mapped_column(Numeric(14, 2), nullable=True)
    statement_amount: Mapped[float | None] = mapped_column(Numeric(14, 2), nullable=True)
    statement_status: Mapped[str | None] = mapped_column(String(30), nullable=True)
    outcome: Mapped[str] = mapped_column(String(30))
    # matched | amount_mismatch | status_mismatch | missing_in_statement | unknown_ref | duplicate_in_statement
    # | duplicate_payment
    note: Mapped[str] = mapped_column(Text, default="")
