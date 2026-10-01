"""Build a complete, calculable VM0042 v2.2 project directly with SQLAlchemy rows (tests only).

The default project is QA2 with baseline control sites: one project stratum (2 fields) and one control
stratum (3 control fields, ≥ 3 control sites), samples in two depth increments (0–30, 30–50 cm) for
equivalent soil mass, and a Table 4 activity-data set (3 look-back years + project years)."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import UTC, date, datetime, timedelta

from app.core import db as dbmod
from app.core import geo
from app.core.auth import CurrentUser
from app.core.permissions import permissions_for
from app.modules.baseline.models import ActivityRecord
from app.modules.calculation.models import TermEstimate
from app.modules.evidence import service as evidence
from app.modules.farmers.models import Farmer
from app.modules.identity.models import User
from app.modules.lab.models import Lab, LabResult
from app.modules.land.models import Enrolment, Farm, Field, LandUseRecord
from app.modules.methodology.definitions import RULES
from app.modules.methodology.models import Rule, RulePack
from app.modules.practices.models import PracticeRecord
from app.modules.programmes.models import Programme, Project
from app.modules.sampling.models import (
    Campaign, CustodyEvent, Sample, SamplePlan, SamplingPoint, Site, SoilLayer, Stratum,
)

BASE_SOC = (1.00, 1.10, 1.05, 1.20, 1.12)
MON_SOC = (1.15, 1.22, 1.18, 1.30, 1.24)
CTRL_BASE_SOC = (1.02, 1.08, 1.04, 1.12, 1.06)
CTRL_MON_SOC = (1.03, 1.08, 1.06, 1.13, 1.07)
LOWER_SOC_FACTOR = 0.6  # SOC of the 30–50 cm increment relative to 0–30 cm
PHOTOS_PER_CORE = 3
PROBE_MM, CORES = 21.5, 4


@dataclass
class Built:
    org_id: uuid.UUID
    project_id: str
    pack_id: str
    baseline_id: str
    monitoring_id: str
    field_ids: list[str]
    stratum_id: str
    control_stratum_id: str | None = None
    control_field_ids: list[str] = field(default_factory=list)
    certificate_ids: list[str] = field(default_factory=list)
    photo_ids: list[str] = field(default_factory=list)
    unrelated_evidence_id: str = ""
    layer_ids: list[str] = field(default_factory=list)
    activity_ids: list[str] = field(default_factory=list)


def user_id(email: str) -> uuid.UUID:
    with dbmod.session_factory()() as s:
        return s.query(User).filter_by(email=email).one().id


def as_current(u: User) -> CurrentUser:
    return CurrentUser(id=u.id, org_id=u.org_id, role=u.role, email=u.email, full_name=u.full_name,
                       permissions=permissions_for(u.role))


def rule_values(**over) -> dict:
    """A realistic VM0042 v2.2 pack: every fixed methodology value plus the owner's choices."""
    v = {r.key: r.example for r in RULES}
    v.update({r.key: r.vm0042_default for r in RULES if r.vm0042_default is not None})
    v.update(over)
    return v


def baseline_activity(year: int) -> list[tuple[str, dict]]:
    return [
        ("crop", {"crop_types": ["millet"], "planting_date": f"{year}-06-15", "harvest_date": f"{year}-10-20",
                  "yield_t_ha": 1.8}),
        ("n_fertilizer", {"synthetic_n": True, "manure": False, "compost": False,
                          "synthetic_fertilizers": [{"type": "urea", "mass_t": 0.20, "n_content": 0.46}]}),
        ("tillage_residue", {"tillage": True, "depth_cm": 20, "frequency_per_year": 2, "soil_disturbed_pct": 100,
                             "residue_removal": True, "residue_removed_pct": 80}),
        ("water", {"irrigation": False, "flooding": False}),
        ("grazing", {"grazing": False, "harvesting": False}),
        ("liming", {"limestone": True, "limestone_t": 0.5, "dolomite": False}),
        ("fossil_fuel", {"fuels": [{"fuel": "diesel", "litres": 120}]}),
    ]


def project_activity(year: int) -> list[tuple[str, dict]]:
    rows = [
        ("crop", {"crop_types": ["millet", "cowpea cover crop"], "planting_date": f"{year}-06-10",
                  "harvest_date": f"{year}-10-25", "yield_t_ha": 1.9}),
        ("n_fertilizer", {"synthetic_n": True, "manure": False, "compost": False,
                          "synthetic_fertilizers": [{"type": "urea", "mass_t": 0.12, "n_content": 0.46}]}),
        ("tillage_residue", {"tillage": True, "depth_cm": 10, "frequency_per_year": 1, "soil_disturbed_pct": 30,
                             "residue_removal": False, "residue_removed_pct": 0}),
        ("water", {"irrigation": False, "flooding": False}),
        ("grazing", {"grazing": False, "harvesting": False}),
        ("liming", {"limestone": True, "limestone_t": 0.5, "dolomite": False}),
        ("fossil_fuel", {"fuels": [{"fuel": "diesel", "litres": 80}]}),
    ]
    if year == 2022:
        rows.append(("organic_amendment_import", {"amendments": [
            {"type": "compost", "mass_t": 2.0, "carbon_content": 0.30, "produced_on_site": False}]}))
    return rows


def build_project(
    org_id: uuid.UUID,
    *,
    base_soc: tuple[float, ...] = BASE_SOC,
    mon_soc: tuple[float, ...] = MON_SOC,
    ctrl_base_soc: tuple[float, ...] = CTRL_BASE_SOC,
    ctrl_mon_soc: tuple[float, ...] = CTRL_MON_SOC,
    controls: bool = True,
    period_label: str = "P1",
    rules_over: dict | None = None,
    pack_status: str = "approved",
    skip_result_for_site: int | None = None,
    approve_terms: bool = True,
    terms: dict[str, tuple[float, float]] | None = None,
    activity: bool = True,
    layers: int = 2,
    eq3: bool = False,
    tag: str | None = None,
) -> Built:
    tag = tag or uuid.uuid4().hex[:6]
    terms = {"leakage": (0.2, 0.0)} if terms is None else terms
    with dbmod.session_factory()() as s:
        owner = User(org_id=org_id, email=f"builder-{tag}@example.com", full_name="Data Builder",
                     role="platform_admin", password_hash="x")
        approver = User(org_id=org_id, email=f"checker-{tag}@example.com", full_name="Data Checker",
                        role="methodology_owner", password_hash="x")
        s.add_all([owner, approver])
        s.flush()
        cu = as_current(owner)
        now = datetime(2025, 1, 10, tzinfo=UTC)

        revision = s.query(RulePack).filter_by(org_id=org_id).count() + 1
        pack = RulePack(org_id=org_id, created_by=owner.id, methodology_code="VM0042", methodology_version="2.2",
                        revision=revision, title=f"VM0042 v2.2 {tag}", status=pack_status,
                        approved_by=approver.id if pack_status == "approved" else None,
                        approved_at=now if pack_status == "approved" else None)
        s.add(pack)
        s.flush()
        for key, value in rule_values(**{"leakage_required": True, **(rules_over or {})}).items():
            if value is None:
                continue
            s.add(Rule(org_id=org_id, created_by=owner.id, pack_id=pack.id, key=key, value={"value": value},
                       source_document="Verra VM0042 v2.2 (21 Oct 2025)", source_section=f"§{key[:10]}",
                       source_page="12", notes="", editors=[str(owner.id)]))

        prog = Programme(org_id=org_id, created_by=owner.id, code=f"PRG-{tag}", name="Regenerative Soils",
                         region="Karnataka, India", status="active")
        s.add(prog)
        s.flush()
        project = Project(org_id=org_id, created_by=owner.id, programme_id=prog.id, code=f"PRJ-{tag}",
                          name="Soil Carbon Project", rule_pack_id=pack.id, status="monitoring",
                          baseline_start=date(2021, 1, 1), crediting_start=date(2021, 1, 1))
        s.add(project)
        farmer = Farmer(org_id=org_id, created_by=owner.id, code=f"F-{tag}", full_name="Ravi Kumar",
                        phone=f"+9198{uuid.uuid4().int % 10**8:08d}")
        s.add(farmer)
        s.flush()
        farm = Farm(org_id=org_id, created_by=owner.id, farmer_id=farmer.id, name="Ravi's farm")
        s.add(farm)
        s.flush()

        def mk_field(code: str, name: str, lat: float, lon: float) -> Field:
            fp = geo.footprint(geo.square(lat, lon, 100))
            f = Field(org_id=org_id, created_by=owner.id, farm_id=farm.id, code=code, name=name,
                      boundary=fp.geojson, area_ha=fp.area_ha, centroid_lat=fp.centroid_lat,
                      centroid_lon=fp.centroid_lon, min_lat=fp.min_lat, max_lat=fp.max_lat, min_lon=fp.min_lon,
                      max_lon=fp.max_lon, crop_code="millet", soil_type="red", land_cover="cropland",
                      mean_annual_precip_mm=900, climate_zone="tropical_dry", wrb_soil_group="Luvisols",
                      soil_texture_class="sandy loam")
            s.add(f)
            return f

        fields = [mk_field(f"FLD-{tag}-{i}", f"Plot {i}", lat, lon)
                  for i, (lat, lon) in enumerate(((12.40, 75.70), (12.41, 75.71)))]
        ctrl_fields = [mk_field(f"CTL-{tag}-{i}", f"Control {i}", 12.42 + 0.005 * i, 75.72)
                       for i in range(3)] if controls else []
        s.flush()
        for f in fields:
            s.add(Enrolment(org_id=org_id, created_by=owner.id, project_id=project.id, field_id=f.id,
                            farmer_id=farmer.id, status="enrolled", enrolled_on=date(2021, 1, 1),
                            eligibility={"checks": [{"code": "LOOKBACK", "passed": True, "message": "ok"}]}))
            s.add(LandUseRecord(org_id=org_id, created_by=owner.id, field_id=f.id, from_year=2011, to_year=2020,
                                land_use="cropland", source="farmer declaration"))
            s.add(PracticeRecord(org_id=org_id, created_by=owner.id, record_id=uuid.uuid4(), version=1,
                                 field_id=f.id, practice_code="cover_crop", scenario="project",
                                 performed_on=date(2022, 6, 1)))

        stratum = Stratum(org_id=org_id, created_by=owner.id, project_id=project.id, code="Z1", name="Red soils",
                          role="project", quantification_unit="QU1", field_ids=[str(f.id) for f in fields],
                          area_ha=sum(f.area_ha for f in fields), effective_from=date(2020, 1, 1),
                          criteria={"soil_type": "red"})
        s.add(stratum)
        ctrl = None
        if controls:
            ctrl = Stratum(org_id=org_id, created_by=owner.id, project_id=project.id, code="C1",
                           name="Control sites", role="control", control_for_code="Z1",
                           field_ids=[str(f.id) for f in ctrl_fields], area_ha=sum(f.area_ha for f in ctrl_fields),
                           effective_from=date(2020, 1, 1), criteria={"soil_type": "red"})
            s.add(ctrl)
        s.flush()
        depth = 50 if layers >= 2 else 30
        base = Campaign(org_id=org_id, created_by=owner.id, project_id=project.id, code=f"BL-{tag}", name="Baseline",
                        kind="baseline", design="paired", planned_start=date(2021, 1, 1),
                        planned_end=date(2021, 3, 1), depth_to_cm=depth, placement_seed=1, status="complete")
        s.add(base)
        s.flush()
        mon = Campaign(org_id=org_id, created_by=owner.id, project_id=project.id, code=f"MN-{tag}", name="Monitoring 1",
                       kind="monitoring", design="paired", revisits_campaign_id=base.id,
                       planned_start=date(2024, 1, 1), planned_end=date(2024, 3, 1), depth_to_cm=depth,
                       placement_seed=1, status="complete")
        s.add(mon)
        s.flush()
        for c in (base, mon):
            s.add(SamplePlan(org_id=org_id, created_by=owner.id, campaign_id=c.id, stratum_id=stratum.id,
                             n_required=len(base_soc), status="approved", approved_by=approver.id))
            if ctrl is not None:
                s.add(SamplePlan(org_id=org_id, created_by=owner.id, campaign_id=c.id, stratum_id=ctrl.id,
                                 n_required=len(ctrl_base_soc), status="approved", approved_by=approver.id))

        lab = Lab(org_id=org_id, created_by=owner.id, code=f"LAB-{tag}", name="Agri Soil Lab",
                  accreditation="NABL")
        s.add(lab)
        s.flush()

        built = Built(org_id=org_id, project_id=str(project.id), pack_id=str(pack.id), baseline_id=str(base.id),
                      monitoring_id=str(mon.id), field_ids=[str(f.id) for f in fields], stratum_id=str(stratum.id),
                      control_stratum_id=str(ctrl.id) if ctrl else None,
                      control_field_ids=[str(f.id) for f in ctrl_fields])

        def sites_for(st: Stratum, flds: list[Field], b_soc, m_soc, prefix: str, skip: int | None) -> None:
            for i in range(max(len(b_soc), len(m_soc))):
                f = flds[i % len(flds)]
                site = Site(org_id=org_id, created_by=owner.id, project_id=project.id, field_id=f.id,
                            stratum_id=st.id, code=f"{prefix}-{tag}-{i}", latitude=f.centroid_lat,
                            longitude=f.centroid_lon)
                s.add(site)
                s.flush()
                for camp, socs, token in ((base, b_soc, "B"), (mon, m_soc, "M")):
                    if i >= len(socs):
                        continue
                    pt = SamplingPoint(org_id=org_id, created_by=owner.id, campaign_id=camp.id, site_id=site.id,
                                       sequence=i, status="collected")
                    s.add(pt)
                    s.flush()
                    code = f"{site.code}-{token}"
                    photos = [evidence.store(s, cu, data=f"photo-{code}-{k}".encode(), filename=f"{code}-{k}.jpg",
                                             mime_type="image/jpeg", kind="photo", entity_type="sample")
                              for k in range(PHOTOS_PER_CORE)]
                    built.photo_ids.extend(str(p.id) for p in photos)
                    collected = datetime(camp.planned_start.year, 1, 15, 9, 0, tzinfo=UTC) + timedelta(hours=i)
                    smp = Sample(org_id=org_id, created_by=owner.id, point_id=pt.id, campaign_id=camp.id,
                                 site_id=site.id, code=code, collected_at=collected, latitude=site.latitude,
                                 longitude=site.longitude, gps_accuracy_m=3.0, distance_from_site_m=1.5,
                                 depth_reached_cm=depth, photo_ids=[str(p.id) for p in photos],
                                 client_ref=f"cr-{code}", probe_diameter_mm=PROBE_MM if eq3 else None,
                                 cores_composited=CORES if eq3 else None)
                    s.add(smp)
                    s.flush()
                    for ev, hours in (("collected", 0), ("dispatched", 5), ("lab_received", 48)):
                        s.add(CustodyEvent(org_id=org_id, created_by=owner.id, sample_id=smp.id, event=ev,
                                           occurred_at=collected + timedelta(hours=hours), location="Field / lab",
                                           seal_intact=True, count_matches=True))
                    cert = evidence.store(s, cu, data=f"certificate-{code}".encode(), filename=f"{code}.pdf",
                                          mime_type="application/pdf", kind="certificate", entity_type="lab_result")
                    built.certificate_ids.append(str(cert.id))
                    increments = ((1, 0, 30, 1.2, 1.0), (2, 30, 50, 1.3, LOWER_SOC_FACTOR))[:max(1, layers)]
                    for k, top, bottom, bd, fac in increments:
                        layer = SoilLayer(org_id=org_id, created_by=owner.id, sample_id=smp.id, code=f"{code}-D{k}",
                                          label_qr=f"QR-{code}-D{k}", depth_from_cm=top, depth_to_cm=bottom)
                        s.add(layer)
                        s.flush()
                        built.layer_ids.append(str(layer.id))
                        values = {"soc_pct": (round(socs[i] * fac, 4), "%", "dry_combustion"),
                                  "bulk_density_g_cm3": (bd, "g/cm3", "core_ring"),
                                  "coarse_fraction": (0.05, "fraction", "sieving")}
                        if eq3:
                            mass_t_ha = bd * (bottom - top) * 100 * 0.95
                            grams = mass_t_ha / 10_000 * 3.141592653589793 * (PROBE_MM / 2) ** 2 * CORES
                            values["fine_soil_mass_g"] = (round(grams, 4), "g", "oven_dry_sieved")
                        for analyte, (val, unit, method) in values.items():
                            if skip == i and token == "M" and analyte == "soc_pct" and k == 1:
                                continue
                            s.add(LabResult(org_id=org_id, created_by=owner.id, layer_id=layer.id, lab_id=lab.id,
                                            analyte=analyte, value=val, unit=unit, method=method,
                                            analysed_on=date(camp.planned_start.year, 2, 1), certificate_id=cert.id,
                                            status="accepted", reviewed_by=approver.id, reviewed_at=now))

        sites_for(stratum, fields, base_soc, mon_soc, "S", skip_result_for_site)
        if ctrl is not None:
            sites_for(ctrl, ctrl_fields, ctrl_base_soc, ctrl_mon_soc, "CS", None)

        if activity:
            for f in fields:
                att = evidence.store(s, cu, data=f"attestation-{f.code}".encode(), filename=f"{f.code}-att.pdf",
                                     mime_type="application/pdf", kind="document", entity_type="field")
                for scenario, years, maker, tier in (("baseline", (2018, 2019, 2020), baseline_activity, 3),
                                                     ("project", (2021, 2022, 2023, 2024), project_activity, 1)):
                    for y in years:
                        for cat, attrs in maker(y):
                            r = ActivityRecord(org_id=org_id, created_by=owner.id, record_id=uuid.uuid4(), version=1,
                                               project_id=project.id, field_id=f.id, scenario=scenario, year=y,
                                               category=cat, attributes=attrs, data_tier=tier,
                                               source_note="farm records", evidence_ids=[],
                                               attestation_id=att.id if tier >= 3 else None, status="active")
                            s.add(r)
                            s.flush()
                            built.activity_ids.append(str(r.id))

        unrelated = evidence.store(s, cu, data=b"unrelated-file-" + tag.encode(), filename="other.pdf",
                                   mime_type="application/pdf", kind="document")
        built.unrelated_evidence_id = str(unrelated.id)

        for term, (value, var) in terms.items():
            s.add(TermEstimate(org_id=org_id, created_by=owner.id, project_id=project.id, period_label=period_label,
                               term=term, value_t_co2e=value, variance=var, source="Approved project calculation",
                               version=1, status="approved" if approve_terms else "draft",
                               approved_by=approver.id if approve_terms else None,
                               approved_at=now if approve_terms else None))
        s.commit()
        return built


def run_body(b: Built, period_label: str = "P1", start: str = "2021-01-01", end: str = "2024-12-31", **extra) -> dict:
    return {"period_label": period_label, "period_start": start, "period_end": end,
            "baseline_campaign_id": b.baseline_id, "monitoring_campaign_id": b.monitoring_id, **extra}
