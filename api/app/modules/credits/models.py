from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import JSON, Date, Float, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class CreditBatch(TenantModel):
    """Credits arising from one approved calculation run, tracked through their life."""

    __tablename__ = "credit_batches"
    __table_args__ = (UniqueConstraint("run_id"),)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    run_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("calculation_runs.id"))
    code: Mapped[str] = mapped_column(String(40))
    vintage: Mapped[int] = mapped_column(Integer)
    reductions_t: Mapped[float] = mapped_column(Float)
    removals_t: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(20), default="provisional")
    # provisional | verified | issued | cancelled
    registry_name: Mapped[str | None] = mapped_column(String(40), nullable=True)
    registry_project_ref: Mapped[str | None] = mapped_column(String(80), nullable=True)
    serial_start: Mapped[str | None] = mapped_column(String(120), nullable=True)
    serial_end: Mapped[str | None] = mapped_column(String(120), nullable=True)
    issued_on: Mapped[date | None] = mapped_column(Date, nullable=True)


class InventoryMove(LedgerModel):
    """Every change in a batch's quantities. Balances are the sum of moves, so nothing is lost."""

    __tablename__ = "inventory_moves"
    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("credit_batches.id"), index=True)
    credit_type: Mapped[str] = mapped_column(String(12))  # reduction | removal
    from_state: Mapped[str] = mapped_column(String(12))  # none | available | reserved | sold | buffer
    to_state: Mapped[str] = mapped_column(String(12))  # available | reserved | sold | retired | buffer | cancelled
    quantity: Mapped[float] = mapped_column(Float)
    sale_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("sales.id"), nullable=True)
    reason: Mapped[str] = mapped_column(Text, default="")


class Buyer(TenantModel):
    __tablename__ = "buyers"
    name: Mapped[str] = mapped_column(String(200))
    kind: Mapped[str] = mapped_column(String(20), default="corporate")  # corporate | trader | ngo | government
    country: Mapped[str] = mapped_column(String(80), default="")
    contact_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    contact_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    requirements: Mapped[dict] = mapped_column(JSON, default=dict)  # vintages, removals_only, geography...
    user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)


class Sale(TenantModel):
    __tablename__ = "sales"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    buyer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("buyers.id"), index=True)
    batch_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("credit_batches.id"), index=True)
    credit_type: Mapped[str] = mapped_column(String(12))  # reduction | removal
    quantity: Mapped[float] = mapped_column(Float)
    unit_price: Mapped[float] = mapped_column(Numeric(14, 2))
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    status: Mapped[str] = mapped_column(String(20), default="reserved")  # reserved | contracted | delivered | retired | cancelled
    contract_ref: Mapped[str | None] = mapped_column(String(120), nullable=True)
    retirement_beneficiary: Mapped[str | None] = mapped_column(String(200), nullable=True)
    trade_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")
