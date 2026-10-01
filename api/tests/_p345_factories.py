"""Test data built directly as SQLAlchemy rows (supporting, intelligence, credits, payments, risk, partners)."""

from __future__ import annotations

import hashlib
import uuid
from datetime import UTC, date, datetime, timedelta
from typing import Any

from app.core import db as dbmod
from app.core.geo import footprint, square
from app.modules.calculation.models import CalculationRun, Claim, RunStatusEvent
from app.modules.catalogue.models import PracticeType
from app.modules.farmers.models import Farmer
from app.modules.identity.models import User
from app.modules.lab.models import Lab, LabResult
from app.modules.land.models import Enrolment, Farm, Field
from app.modules.methodology.models import Rule, RulePack
from app.modules.practices.models import PracticeRecord
from app.modules.programmes.models import Programme, Project
from app.modules.sampling.models import Campaign, Sample, SamplingPoint, Site, SoilLayer, Stratum
from app.modules.intelligence.models import SatelliteIndex

_counter = {"n": 0}


def _n() -> int:
    _counter["n"] += 1
    return _counter["n"]


def session():
    return dbmod.session_factory()()


def uid(email: str) -> uuid.UUID:
    with session() as s:
        return s.query(User).filter_by(email=email).one().id


def farmer(s, org, name: str | None = None, user_id=None) -> Farmer:
    n = _n()
    f = Farmer(org_id=org, code=f"F{n:04d}", full_name=name or f"Farmer {n}", phone=f"+9198{n:08d}",
               village="Hosahalli", district="Hassan", state="Karnataka", user_id=user_id)
    s.add(f)
    s.flush()
    return f


def farm(s, org, farmer_row: Farmer) -> Farm:
    f = Farm(org_id=org, farmer_id=farmer_row.id, name=f"Farm {_n()}")
    s.add(f)
    s.flush()
    return f


def field(s, org, farm_row: Farm, lat: float = 12.5, lon: float = 75.8, side_m: float = 200,
          crop_code: str | None = "rice", elevation_m: float | None = None) -> Field:
    fp = footprint(square(lat, lon, side_m))
    f = Field(org_id=org, farm_id=farm_row.id, code=f"FLD{_n():04d}", name="Field", boundary=fp.geojson,
              area_ha=fp.area_ha, centroid_lat=fp.centroid_lat, centroid_lon=fp.centroid_lon,
              min_lat=fp.min_lat, max_lat=fp.max_lat, min_lon=fp.min_lon, max_lon=fp.max_lon,
              crop_code=crop_code, elevation_m=elevation_m)
    s.add(f)
    s.flush()
    return f


def programme(s, org) -> Programme:
    p = Programme(org_id=org, code=f"PRG{_n()}", name="Soil Health Programme", status="active")
    s.add(p)
    s.flush()
    return p


def project(s, org, prog: Programme, rule_pack_id=None) -> Project:
    p = Project(org_id=org, programme_id=prog.id, code=f"PRJ{_n()}", name="Hassan Soil Carbon",
                rule_pack_id=rule_pack_id, status="active")
    s.add(p)
    s.flush()
    return p


def enrol(s, org, proj: Project, fld: Field, status: str = "enrolled") -> Enrolment:
    fm = s.get(Farm, fld.farm_id)
    e = Enrolment(org_id=org, project_id=proj.id, field_id=fld.id, farmer_id=fm.farmer_id, status=status,
                  enrolled_on=date(2024, 1, 1))
    s.add(e)
    s.flush()
    return e


def rule_pack(s, org, values: dict[str, Any], status: str = "approved") -> RulePack:
    rp = RulePack(org_id=org, methodology_code="VM0042", methodology_version="2.2", revision=_n(),
                  title="VM0042 test pack", status=status)
    s.add(rp)
    s.flush()
    for k, v in values.items():
        s.add(Rule(org_id=org, pack_id=rp.id, key=k, value={"value": v}, source_document="VM0042 v2.2",
                   source_section="§8"))
    s.flush()
    return rp


def campaign(s, org, proj: Project, kind: str = "baseline") -> Campaign:
    c = Campaign(org_id=org, project_id=proj.id, code=f"C{_n()}", name=f"{kind} campaign", kind=kind,
                 design="paired", planned_start=date(2024, 1, 1), planned_end=date(2024, 3, 1),
                 depth_to_cm=30, placement_seed=42)
    s.add(c)
    s.flush()
    return c


def run(s, org, proj: Project, *, net: float, reductions: float, removals: float, buffer: float = 0.0,
        gross: float | None = None, uncertainty: float = 0.0, status: str = "approved",
        period_start: date = date(2024, 1, 1), period_end: date = date(2024, 12, 31),
        inputs: dict | None = None, results: dict | None = None, rules: dict | None = None,
        rule_pack_id=None) -> CalculationRun:
    if rule_pack_id is None:
        rule_pack_id = proj.rule_pack_id or rule_pack(s, org, {"buffer_pct": 10}).id
    c1, c2 = campaign(s, org, proj, "baseline"), campaign(s, org, proj, "monitoring")
    r = CalculationRun(
        org_id=org, project_id=proj.id, period_label=f"{period_start.year}", period_start=period_start,
        period_end=period_end, baseline_campaign_id=c1.id, monitoring_campaign_id=c2.id,
        rule_pack_id=rule_pack_id, engine_version="1.0.0", inputs_snapshot=inputs or {},
        rules_snapshot=rules or {}, results=results or {},
        gross_t_co2e=gross if gross is not None else net + buffer + uncertainty,
        uncertainty_deduction_t_co2e=uncertainty, buffer_t_co2e=buffer, net_t_co2e=net,
        reductions_t_co2e=reductions, removals_t_co2e=removals, snapshot_sha256="0" * 64,
    )
    s.add(r)
    s.flush()
    s.add(RunStatusEvent(org_id=org, run_id=r.id, status="calculated"))
    if status != "calculated":
        s.add(RunStatusEvent(org_id=org, run_id=r.id, status=status,
                             created_at=datetime.now(UTC) + timedelta(seconds=1)))
    s.flush()
    return r


def claim(s, org, fld: Field, r: CalculationRun) -> Claim:
    c = Claim(org_id=org, field_id=fld.id, pool="soc", period_start=r.period_start, period_end=r.period_end,
              run_id=r.id)
    s.add(c)
    s.flush()
    return c


def practice(s, org, fld: Field, code: str, performed_on: date, *, scenario: str = "project",
             ended_on: date | None = None, quantity: float | None = None, details: dict | None = None,
             status: str = "active", source: str = "field_app") -> PracticeRecord:
    p = PracticeRecord(org_id=org, record_id=uuid.uuid4(), version=1, field_id=fld.id, practice_code=code,
                       scenario=scenario, performed_on=performed_on, ended_on=ended_on, quantity=quantity,
                       details=details or {}, status=status, source=source)
    s.add(p)
    s.flush()
    return p


def practice_type(s, org, code: str, emission_factor_keys: list[str] | None = None) -> PracticeType:
    pt = PracticeType(org_id=org, code=code, name=code.replace("_", " ").title(),
                      emission_factor_keys=emission_factor_keys or [])
    s.add(pt)
    s.flush()
    return pt


def stratum(s, org, proj: Project, field_ids: list, code: str | None = None) -> Stratum:
    st = Stratum(org_id=org, project_id=proj.id, code=code or f"S{_n()}", name="Zone",
                 field_ids=[str(x) for x in field_ids], effective_from=date(2024, 1, 1))
    s.add(st)
    s.flush()
    return st


def lab(s, org) -> Lab:
    lb = Lab(org_id=org, code=f"LAB{_n()}", name="Soil Lab")
    s.add(lb)
    s.flush()
    return lb


def soc_sample(s, org, *, proj: Project, fld: Field, camp: Campaign, strat: Stratum, lab_row: Lab, soc: float,
               clay: float | None = None, collected_at: datetime | None = None,
               status: str = "accepted") -> Sample:
    n = _n()
    site = Site(org_id=org, project_id=proj.id, field_id=fld.id, stratum_id=strat.id, code=f"SITE{n}",
                latitude=fld.centroid_lat, longitude=fld.centroid_lon)
    s.add(site)
    s.flush()
    pt = SamplingPoint(org_id=org, campaign_id=camp.id, site_id=site.id)
    s.add(pt)
    s.flush()
    smp = Sample(org_id=org, point_id=pt.id, campaign_id=camp.id, site_id=site.id, code=f"SMP{n}",
                 collected_at=collected_at or datetime(2025, 3, 1, tzinfo=UTC), latitude=site.latitude,
                 longitude=site.longitude, distance_from_site_m=1.0, depth_reached_cm=30, client_ref=f"cr{n}")
    s.add(smp)
    s.flush()
    top = SoilLayer(org_id=org, sample_id=smp.id, code=f"SMP{n}-D1", label_qr=f"QR{n}a", depth_from_cm=0,
                    depth_to_cm=15)
    deep = SoilLayer(org_id=org, sample_id=smp.id, code=f"SMP{n}-D2", label_qr=f"QR{n}b", depth_from_cm=15,
                     depth_to_cm=30)
    s.add_all([top, deep])
    s.flush()
    for layer, v in ((top, soc), (deep, soc * 0.6)):
        s.add(LabResult(org_id=org, layer_id=layer.id, lab_id=lab_row.id, analyte="soc_pct", value=v, unit="%",
                        method="dry_combustion", analysed_on=date(2025, 3, 10), status=status))
    if clay is not None:
        s.add(LabResult(org_id=org, layer_id=top.id, lab_id=lab_row.id, analyte="texture_clay_pct", value=clay,
                        unit="%", method="hydrometer", analysed_on=date(2025, 3, 10), status="accepted"))
    s.flush()
    return smp


def satellite(s, org, fld: Field, index: str, day: date, value: float, cloud: float = 0.0,
              source: str = "test") -> SatelliteIndex:
    x = SatelliteIndex(org_id=org, field_id=fld.id, index_name=index, observed_on=day, value=value,
                       cloud_pct=cloud, source=source)
    s.add(x)
    s.flush()
    return x


def world(org, n_farmers: int = 2, fields_per_farmer: int = 1, lat: float = 12.5, lon: float = 75.8,
          rule_values: dict | None = None) -> dict[str, Any]:
    """A programme + project with enrolled fields. Returns plain ids."""
    with session() as s:
        prog = programme(s, org)
        rp = rule_pack(s, org, rule_values) if rule_values is not None else None
        proj = project(s, org, prog, rp.id if rp else None)
        farmers, fields = [], []
        for i in range(n_farmers):
            fr = farmer(s, org)
            fm = farm(s, org, fr)
            farmers.append(fr.id)
            for j in range(fields_per_farmer):
                fl = field(s, org, fm, lat + 0.01 * i, lon + 0.01 * j, side_m=100 * (i + j + 1))
                enrol(s, org, proj, fl)
                fields.append(fl.id)
        s.commit()
        return {"programme_id": prog.id, "project_id": proj.id, "farmer_ids": farmers, "field_ids": fields,
                "rule_pack_id": rp.id if rp else None}


def sha(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()


# ------------------------------------------------------------------ API helpers (credits / payments)
def approved_run(org, w: dict, *, reductions: float = 40.0, removals: float = 60.0, buffer: float = 10.0,
                 **kw) -> uuid.UUID:
    from app.modules.programmes.models import Project as _Project

    with session() as s:
        proj = s.get(_Project, w["project_id"])
        r = run(s, org, proj, net=reductions + removals, reductions=reductions, removals=removals, buffer=buffer, **kw)
        s.commit()
        return r.id


def issued_batch(client, h: dict, run_id) -> dict:
    b = client.post(f"/api/calculations/{run_id}/credit-batch", headers=h)
    assert b.status_code == 201, b.text
    bid = b.json()["id"]
    assert client.post(f"/api/credit-batches/{bid}/verify", headers=h).status_code == 200
    r = client.post(f"/api/credit-batches/{bid}/issue", headers=h, json={
        "registry_name": "Verra", "registry_project_ref": "VCS-4321", "serial_start": "VCS-1-0001",
        "serial_end": "VCS-1-0100", "issued_on": "2025-12-01"})
    assert r.status_code == 200, r.text
    return r.json()


def buyer(client, h: dict, **kw) -> dict:
    r = client.post("/api/buyers", headers=h, json={"name": kw.pop("name", "Acme Foods"), **kw})
    assert r.status_code == 201, r.text
    return r.json()


def delivered_sale(client, h: dict, batch_id: str, buyer_id: str, quantity: float = 10, unit_price: str = "1000.00",
                   credit_type: str = "removal", retire: bool = False) -> dict:
    s = client.post("/api/sales", headers=h, json={"buyer_id": buyer_id, "batch_id": batch_id, "credit_type": credit_type,
                                                    "quantity": quantity, "unit_price": unit_price})
    assert s.status_code == 201, s.text
    sid = s.json()["id"]
    assert client.post(f"/api/sales/{sid}/contract", headers=h, json={"contract_ref": "C-1"}).status_code == 200
    d = client.post(f"/api/sales/{sid}/deliver", headers=h)
    assert d.status_code == 200, d.text
    if retire:
        d = client.post(f"/api/sales/{sid}/retire", headers=h, json={"beneficiary": "Acme Foods Ltd"})
    return d.json()


# ------------------------------------------------------------------ supporting observations (derived features / feature store)
def observation(s, org, fld: Field, parameter: str, day: date, value: float, *, tier: int = 1,
                provider: str = "soilsync", quality: float = 1.0, data_class: str = "MEASURED",
                unit: str = "") -> Any:
    from app.modules.supporting.models import Observation

    o = Observation(org_id=org, field_id=fld.id, parameter=parameter, observed_on=day, value=value, unit=unit,
                    tier=tier, provider=provider, quality=quality, data_class=data_class)
    s.add(o)
    s.flush()
    return o


def daily_observations(s, org, fld: Field, parameter: str, start: date, values: list[float], **kw) -> None:
    for i, v in enumerate(values):
        observation(s, org, fld, parameter, start + timedelta(days=i), v, **kw)


# ------------------------------------------------------------------ helpers for interventions / notifications / documents
def consent(s, org, farmer_id, purpose: str = "data_use", granted: bool = True,
            effective_on: date | None = None):
    from app.modules.consent.models import ConsentEvent

    ev = ConsentEvent(org_id=org, farmer_id=farmer_id, purpose=purpose, granted=granted,
                      effective_on=effective_on or date(2024, 1, 1), channel="app")
    s.add(ev)
    s.flush()
    return ev


def evidence(s, org, text: str | None = None, filename: str = "doc.pdf", mime: str = "application/pdf"):
    from app.modules.evidence.models import EvidenceFile

    body = text or f"document {_n()}"
    ev = EvidenceFile(org_id=org, sha256=sha(body), kind="document", filename=filename, mime_type=mime,
                      size_bytes=len(body), storage_key=f"test/{sha(body)}")
    s.add(ev)
    s.flush()
    return ev


def evidence_id(org, text: str | None = None) -> str:
    with session() as s:
        ev = evidence(s, org, text)
        s.commit()
        return str(ev.id)


def set_phone(farmer_id, phone: str, language: str | None = None) -> None:
    with session() as s:
        f = s.get(Farmer, farmer_id)
        f.phone = phone
        if language:
            f.language = language
        s.commit()
