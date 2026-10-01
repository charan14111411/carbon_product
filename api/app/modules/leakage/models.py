"""Leakage inputs: biomass residues diverted from energy use (VM0042 v2.2 §8.4.4, CDM TOOL16) and yearly livestock /
production records for VMD0054 (§8.4.2–8.4.3, Eq. 34–36). Both append-only: a correction or void is a new row with
the same ``record_id`` and ``version + 1``."""

from __future__ import annotations

import uuid

from sqlalchemy import JSON, Boolean, Float, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel


class ResidueDiversion(LedgerModel):
    __tablename__ = "leakage_residue_diversions"
    record_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(10), default="active")  # active | voided
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    period_label: Mapped[str] = mapped_column(String(40))
    residue_type: Mapped[str] = mapped_column(String(120))
    baseline_energy_use: Mapped[str] = mapped_column(Text)
    quantity_t_dry: Mapped[float] = mapped_column(Float)
    ncv_gj_per_t_dry: Mapped[float | None] = mapped_column(Float, nullable=True)
    ef_co2_t_per_gj: Mapped[float | None] = mapped_column(Float, nullable=True)
    factor_source: Mapped[str] = mapped_column(Text, default="")
    leakage_ruled_out: Mapped[bool] = mapped_column(Boolean, default=False)
    ruled_out_reason: Mapped[str] = mapped_column(Text, default="")
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    note: Mapped[str] = mapped_column(Text, default="")


class DisplacementRecord(LedgerModel):
    __tablename__ = "leakage_displacement_records"
    record_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(10), default="active")  # active | voided
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    year: Mapped[int] = mapped_column(Integer)
    mode: Mapped[str] = mapped_column(String(12))  # vmd0054 | no_decrease
    commodities: Mapped[list] = mapped_column(JSON, default=list)
    livestock: Mapped[list] = mapped_column(JSON, default=list)
    ef_t_co2e_per_ha: Mapped[float | None] = mapped_column(Float, nullable=True)
    ef_source: Mapped[str] = mapped_column(Text, default="")
    statement: Mapped[str] = mapped_column(Text, default="")
    evidence_ids: Mapped[list] = mapped_column(JSON, default=list)
    note: Mapped[str] = mapped_column(Text, default="")
