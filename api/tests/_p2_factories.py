"""Build a complete, calculable project directly with SQLAlchemy rows (tests only)."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import UTC, date, datetime, timedelta

from app.core import db as dbmod
from app.core import geo
from app.core.auth import CurrentUser
from app.core.permissions import permissions_for
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
PHOTOS_PER_CORE = 3


@dataclass
class Built:
    org_id: uuid.UUID
    project_id: str
    pack_id: str
    baseline_id: str
    monitoring_id: str
    field_ids: list[str]
    stratum_id: str
    certificate_ids: list[str] = field(default_factory=list)
    photo_ids: list[str] = field(default_factory=list)
    unrelated_evidence_id: str = ""
    layer_ids: list[str] = field(default_factory=list)


def user_id(email: str) -> uuid.UUID:
    with dbmod.session_factory()() as s:
        return s.query(User).filter_by(email=email).one().id


def as_current(u: User) -> CurrentUser:
    return CurrentUser(id=u.id, org_id=u.org_id, role=u.role, email=u.email, full_name=u.full_name,
                       permissions=permissions_for(u.role))


def rule_values(**over) -> dict:
    v = {r.key: r.example for r in RULES}
    v.update(over)
    return v


def build_project(
    org_id: uuid.UUID,
    *,
    base_soc: tuple[float, ...] = BASE_SOC,
    mon_soc: tuple[float, ...] = MON_SOC,
    period_label: str = "P1",
    rules_over: dict | None = None,
    pack_status: str = "approved",
    skip_result_for_site: int | None = None,
    approve_terms: bool = True,
    tag: str | None = None,
) -> Built:
    tag = tag or uuid.uuid4().hex[:6]
    with dbmod.session_factory()() as s:
        owner = User(org_id=org_id, email=f"builder-{tag}@example.com", full_name="Data Builder",
                     role="platform_admin", password_hash="x")
        approver = User(org_id=org_id, email=f"checker-{tag}@example.com", full_name="Data Checker",
                        role="methodology_owner", password_hash="x")
        s.add_all([owner, approver])
        s.flush()
        cu = as_current(owner)
        now = datetime(2025, 1, 10, tzinfo=UTC)

        pack = RulePack(org_id=org_id, created_by=owner.id, methodology_code="VM0042", methodology_version="2.2",
                        revision=1, title=f"VM0042 v2.2 {tag}", status=pack_status,
                        approved_by=approver.id if pack_status == "approved" else None,
                        approved_at=now if pack_status == "approved" else None)
        s.add(pack)
        s.flush()
        for key, value in rule_values(**(rules_over or {})).items():
            if value is None:
                continue
            s.add(Rule(org_id=org_id, created_by=owner.id, pack_id=pack.id, key=key, value={"value": value},
                       source_document="VM0042 v2.2", source_section=f"§{key[:10]}", source_page="12",
                       notes="", editors=[str(owner.id)]))

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

        fields: list[Field] = []
        for i, (lat, lon) in enumerate(((12.40, 75.70), (12.41, 75.71))):
            fp = geo.footprint(geo.square(lat, lon, 100))
            f = Field(org_id=org_id, created_by=owner.id, farm_id=farm.id, code=f"FLD-{tag}-{i}", name=f"Plot {i}",
                      boundary=fp.geojson, area_ha=fp.area_ha, centroid_lat=fp.centroid_lat,
                      centroid_lon=fp.centroid_lon, min_lat=fp.min_lat, max_lat=fp.max_lat, min_lon=fp.min_lon,
                      max_lon=fp.max_lon, crop_code="millet", soil_type="red")
            s.add(f)
            fields.append(f)
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
                          role="project", field_ids=[str(f.id) for f in fields],
                          area_ha=sum(f.area_ha for f in fields), effective_from=date(2020, 1, 1))
        s.add(stratum)
        s.flush()
        base = Campaign(org_id=org_id, created_by=owner.id, project_id=project.id, code=f"BL-{tag}", name="Baseline",
                        kind="baseline", design="paired", planned_start=date(2021, 1, 1),
                        planned_end=date(2021, 3, 1), depth_to_cm=30, placement_seed=1, status="complete")
        s.add(base)
        s.flush()
        mon = Campaign(org_id=org_id, created_by=owner.id, project_id=project.id, code=f"MN-{tag}", name="Monitoring 1",
                       kind="monitoring", design="paired", revisits_campaign_id=base.id,
                       planned_start=date(2024, 1, 1), planned_end=date(2024, 3, 1), depth_to_cm=30,
                       placement_seed=1, status="complete")
        s.add(mon)
        s.flush()
        for c in (base, mon):
            s.add(SamplePlan(org_id=org_id, created_by=owner.id, campaign_id=c.id, stratum_id=stratum.id,
                             n_required=len(base_soc), status="approved", approved_by=approver.id))

        lab = Lab(org_id=org_id, created_by=owner.id, code=f"LAB-{tag}", name="Agri Soil Lab",
                  accreditation="NABL")
        s.add(lab)
        s.flush()

        built = Built(org_id=org_id, project_id=str(project.id), pack_id=str(pack.id), baseline_id=str(base.id),
                      monitoring_id=str(mon.id), field_ids=[str(f.id) for f in fields], stratum_id=str(stratum.id))
        n_sites = max(len(base_soc), len(mon_soc))
        for i in range(n_sites):
            f = fields[i % len(fields)]
            site = Site(org_id=org_id, created_by=owner.id, project_id=project.id, field_id=f.id,
                        stratum_id=stratum.id, code=f"S-{tag}-{i}", latitude=f.centroid_lat, longitude=f.centroid_lon)
            s.add(site)
            s.flush()
            for camp, socs, token in ((base, base_soc, "B"), (mon, mon_soc, "M")):
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
                smp = Sample(org_id=org_id, created_by=owner.id, point_id=pt.id, campaign_id=camp.id, site_id=site.id,
                             code=code, collected_at=collected, latitude=site.latitude, longitude=site.longitude,
                             gps_accuracy_m=3.0, distance_from_site_m=1.5, depth_reached_cm=30,
                             photo_ids=[str(p.id) for p in photos], client_ref=f"cr-{code}")
                s.add(smp)
                s.flush()
                for ev, hours in (("collected", 0), ("dispatched", 5), ("lab_received", 48)):
                    s.add(CustodyEvent(org_id=org_id, created_by=owner.id, sample_id=smp.id, event=ev,
                                       occurred_at=collected + timedelta(hours=hours), location="Field / lab",
                                       seal_intact=True, count_matches=True))
                layer = SoilLayer(org_id=org_id, created_by=owner.id, sample_id=smp.id, code=f"{code}-D1",
                                  label_qr=f"QR-{code}-D1", depth_from_cm=0, depth_to_cm=30)
                s.add(layer)
                s.flush()
                built.layer_ids.append(str(layer.id))
                cert = evidence.store(s, cu, data=f"certificate-{code}".encode(), filename=f"{code}.pdf",
                                      mime_type="application/pdf", kind="certificate", entity_type="lab_result")
                built.certificate_ids.append(str(cert.id))
                values = {"soc_pct": (socs[i], "%", "dry_combustion"),
                          "bulk_density_g_cm3": (1.2, "g/cm3", "core_ring"),
                          "coarse_fraction": (0.05, "fraction", "sieving")}
                for analyte, (val, unit, method) in values.items():
                    if skip_result_for_site == i and token == "M" and analyte == "soc_pct":
                        continue
                    s.add(LabResult(org_id=org_id, created_by=owner.id, layer_id=layer.id, lab_id=lab.id,
                                    analyte=analyte, value=val, unit=unit, method=method,
                                    analysed_on=date(camp.planned_start.year, 2, 1), certificate_id=cert.id,
                                    status="accepted", reviewed_by=approver.id, reviewed_at=now))

        unrelated = evidence.store(s, cu, data=b"unrelated-file-" + tag.encode(), filename="other.pdf",
                                   mime_type="application/pdf", kind="document")
        built.unrelated_evidence_id = str(unrelated.id)

        for term, value, var in (("baseline_scenario", 0.5, 0.01), ("project_emissions", 1.0, 0.04),
                                 ("leakage", 0.2, 0.0)):
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
