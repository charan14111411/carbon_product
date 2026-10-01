"""Test data for the methodology / sampling / lab / QA tests, written straight to the database
(the programme, farmer and land APIs are built separately)."""

from __future__ import annotations

import uuid
from datetime import UTC, date, datetime, timedelta

from fastapi.testclient import TestClient

from app.core import db as dbmod
from app.core import geo
from app.core.db import utcnow
from app.modules.farmers.models import Farmer
from app.modules.identity.models import User
from app.modules.land.models import Enrolment, Farm, Field
from app.modules.methodology.definitions import RULES
from app.modules.methodology.models import Rule, RulePack
from app.modules.programmes.models import Programme, Project
from tests.conftest import login, make_user

BASE_LAT, BASE_LON = 12.42, 75.74

# VM0042 v2.2 thresholds read by the sampling / lab / QA checks that are not (yet) rule definitions in
# methodology/definitions.py, so a test pack adds them explicitly. Values the definitions already give an
# example for (ship_within_days, storage_max_days, remeasure_max_years, min_composites_per_stratum,
# spectroscopy_check_fraction_min, stock_depth_cm) take precedence. Sources: docs/VM0042_v2.2_REQUIREMENTS.md.
VM0042_EXTRA = {
    "resample_min_depth_increments": 2,    # §8.2.1.3 (7) p.32
    "min_composites_per_stratum": 3,       # §8.2.1.2 p.30
    "ship_within_days": 5,                 # §8.2.1.3 (5) p.32
    "storage_max_days": 90,                # §8.2.1.3 (5) p.32
    "remeasure_max_years": 5,              # §8.1 p.20
    "spectroscopy_check_fraction_min": 0.10,  # §8.6.2.1 p.78
    "spectroscopy_check_fraction_max": 0.15,
}


def full_values(**overrides) -> dict:
    """Example value for every rule definition (what a real scientist would enter), with overrides."""
    vals = {**VM0042_EXTRA, **{r.key: r.example for r in RULES if r.example is not None}}
    vals["stock_method"] = "fixed_depth"
    vals.pop("esm_reference_mass_t_ha", None)
    vals.update(overrides)
    return {k: v for k, v in vals.items() if v is not None}


def user_id(email: str) -> uuid.UUID:
    with dbmod.session_factory()() as s:
        return s.query(User).filter_by(email=email).one().id


def make_project(org_id: uuid.UUID, *, n_fields: int = 2, side_m: float = 200.0, lat: float = BASE_LAT,
                 lon: float = BASE_LON, enrol: bool = True) -> dict:
    """Programme → project → farmer → farm → n square fields (300 m apart), all enrolled."""
    tag = uuid.uuid4().hex[:6].upper()
    with dbmod.session_factory()() as s:
        prog = Programme(org_id=org_id, code=f"PRG-{tag}", name=f"Programme {tag}")
        s.add(prog)
        s.flush()
        proj = Project(org_id=org_id, programme_id=prog.id, code=f"PRJ-{tag}", name=f"Project {tag}",
                       methodology_code="VM0042", methodology_version="2.2")
        farmer = Farmer(org_id=org_id, code=f"F-{tag}", full_name="Test Farmer",
                        phone=f"+9198{uuid.uuid4().int % 10**8:08d}")
        s.add_all([proj, farmer])
        s.flush()
        farm = Farm(org_id=org_id, farmer_id=farmer.id, name="Home farm")
        s.add(farm)
        s.flush()
        field_ids = []
        for i in range(n_fields):
            dlon = (300.0 * i) / (111_320.0 * 0.976)
            boundary = geo.square(lat, lon + dlon, side_m)
            fp = geo.footprint(boundary)
            f = Field(org_id=org_id, farm_id=farm.id, code=f"FLD-{tag}-{i + 1}", name=f"Field {i + 1}",
                      boundary=fp.geojson, area_ha=fp.area_ha, centroid_lat=fp.centroid_lat,
                      centroid_lon=fp.centroid_lon, min_lat=fp.min_lat, max_lat=fp.max_lat, min_lon=fp.min_lon,
                      max_lon=fp.max_lon, crop_code="maize")
            s.add(f)
            s.flush()
            field_ids.append(f.id)
            s.add(Enrolment(org_id=org_id, project_id=proj.id, field_id=f.id, farmer_id=farmer.id,
                            status="enrolled" if enrol else "pending"))
        s.commit()
        return {"project_id": str(proj.id), "field_ids": [str(f) for f in field_ids], "tag": tag,
                "farmer_id": str(farmer.id), "farm_id": str(farm.id)}


def make_pack(org_id: uuid.UUID, *, values: dict | None = None, status: str = "approved",
              project_id: str | None = None) -> str:
    """A rule pack written directly (bypasses the approval API), optionally assigned to a project."""
    vals = full_values() if values is None else values
    with dbmod.session_factory()() as s:
        rev = (s.query(RulePack).filter_by(org_id=org_id).count()) + 1
        pack = RulePack(org_id=org_id, methodology_code="VM0042", methodology_version="2.2", revision=rev,
                        title="Test pack", status=status, approved_at=utcnow() if status == "approved" else None)
        s.add(pack)
        s.flush()
        for k, v in vals.items():
            s.add(Rule(org_id=org_id, pack_id=pack.id, key=k, value={"value": v}, source_document="VM0042 v2.2",
                       editors=[]))
        if project_id:
            s.get(Project, uuid.UUID(project_id)).rule_pack_id = pack.id
        s.commit()
        return str(pack.id)


def set_project_pack(project_id: str, pack_id: str | None) -> None:
    with dbmod.session_factory()() as s:
        s.get(Project, uuid.UUID(project_id)).rule_pack_id = uuid.UUID(pack_id) if pack_id else None
        s.commit()


class Flow:
    """Drives the sampling API end-to-end for tests."""

    def __init__(self, client: TestClient, org_id: uuid.UUID, *, n_fields: int = 2, rules: dict | None = None,
                 with_pack: bool = True):
        self.c = client
        self.org = org_id
        self.p = make_project(org_id, n_fields=n_fields)
        self.pid = self.p["project_id"]
        self.pack_id = make_pack(org_id, values=rules, project_id=self.pid) if with_pack else None
        self.planner = login(client, make_user(org_id, "programme_admin"))
        self.approver = login(client, make_user(org_id, "methodology_owner"))
        self.collector_email = make_user(org_id, "field_collector")
        self.collector = login(client, self.collector_email)
        self.collector_id = str(user_id(self.collector_email))

    # -- setup steps
    def stratum(self, code: str = "A", field_ids: list[str] | None = None, **kw) -> dict:
        body = {"code": code, "name": f"Zone {code}", "field_ids": field_ids or self.p["field_ids"],
                "effective_from": "2024-01-01", "criteria": {"soil_type": "red", "crop": "maize"}, **kw}
        r = self.c.post(f"/api/projects/{self.pid}/strata", headers=self.planner, json=body)
        assert r.status_code == 201, r.text
        return r.json()

    def campaign(self, code: str | None = None, **kw) -> dict:
        body = {"code": code or f"BL-{uuid.uuid4().hex[:5]}", "name": "Baseline", "kind": "baseline",
                "design": "paired", "planned_start": "2024-02-01", "planned_end": "2024-03-01",
                "depth_to_cm": 30, "placement_seed": 12345, **kw}
        r = self.c.post(f"/api/projects/{self.pid}/campaigns", headers=self.planner, json=body)
        assert r.status_code == 201, r.text
        return r.json()

    def plan(self, campaign_id: str, stratum_id: str, n: int = 5, approve: bool = True) -> dict:
        r = self.c.post(f"/api/campaigns/{campaign_id}/sample-plans", headers=self.planner,
                        json={"stratum_id": stratum_id, "n_required": n, "method": "manual",
                              "justification": "Prior variance from pilot"})
        assert r.status_code == 201, r.text
        plan = r.json()
        if approve:
            a = self.c.post(f"/api/sample-plans/{plan['id']}/approve", headers=self.approver)
            assert a.status_code == 200, a.text
            plan = a.json()
        return plan

    def placed_campaign(self, n: int = 5, **kw) -> tuple[dict, list[dict]]:
        st = self.stratum()
        camp = self.campaign(**kw)
        self.plan(camp["id"], st["id"], n)
        r = self.c.post(f"/api/campaigns/{camp['id']}/place-points", headers=self.planner)
        assert r.status_code == 201, r.text
        points = self.c.get(f"/api/campaigns/{camp['id']}/points", headers=self.planner).json()
        a = self.c.post(f"/api/campaigns/{camp['id']}/assign", headers=self.planner,
                        json={"user_id": self.collector_id, "point_ids": [p["id"] for p in points]})
        assert a.status_code == 200, a.text
        points = self.c.get(f"/api/campaigns/{camp['id']}/points", headers=self.planner).json()
        return camp, points

    def photos(self, n: int = 3) -> list[str]:
        ids = []
        for i in range(n):
            r = self.c.post("/api/evidence", headers=self.collector,
                            files={"file": (f"core{i}.jpg", b"\xff\xd8" + uuid.uuid4().bytes, "image/jpeg")},
                            data={"kind": "photo"})
            assert r.status_code == 201, r.text
            ids.append(r.json()["id"])
        return ids

    def sample_body(self, point: dict, **kw) -> dict:
        tag = uuid.uuid4().hex[:8]
        body = {
            "client_ref": f"dev1-{tag}", "point_id": point["id"],
            "collected_at": (datetime(2024, 2, 10, 9, 30, tzinfo=UTC)).isoformat(),
            "latitude": point["latitude"], "longitude": point["longitude"], "gps_accuracy_m": 3.0,
            "depth_reached_cm": 30,
            "layers": [{"depth_from_cm": 0, "depth_to_cm": 15, "label_qr": f"QR-{tag}-1"},
                       {"depth_from_cm": 15, "depth_to_cm": 30, "label_qr": f"QR-{tag}-2"}],
            "photo_ids": kw.pop("photo_ids", None) if "photo_ids" in kw else self.photos(3),
            "device_id": "tablet-7", "probe_diameter_mm": 50, "cores_composited": 5,
        }
        body.update(kw)
        return body

    def submit(self, point: dict, headers: dict | None = None, **kw):
        return self.c.post("/api/samples", headers=headers or self.collector, json=self.sample_body(point, **kw))


def days_ago(n: int) -> str:
    return (date.today() - timedelta(days=n)).isoformat()
