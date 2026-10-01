"""QA2 baseline control sites (VM0042 v2.2 §8.2, Table 7, Appendix 5)."""

import math
import uuid
from datetime import UTC, date, datetime

import pytest

from app.core import db as dbmod
from app.core.errors import ImmutableRecord
from app.modules.controlsites import domain
from app.modules.controlsites.models import ControlSiteAssessment
from app.modules.lab.models import Lab, LabResult
from app.modules.land.models import LandUseRecord
from app.modules.programmes.models import Project
from app.modules.sampling.models import Campaign, Sample, SamplingPoint, Site, SoilLayer, Stratum
from tests.conftest import login, make_org, make_user
from tests.test_baseline import crop, evidence, fert, rec, till
from tests.test_land import farm_for, mk_field

LAT, LON = 12.40, 75.70
ATTRS = {"slope_pct": 5, "aspect_deg": 90, "soil_texture_class": "sandy_clay_loam", "wrb_soil_group": "Nitisols",
         "ecoregion": "South Western Ghats moist deciduous forests", "climate_zone": "tropical_moist",
         "mean_annual_precip_mm": 1800}


def offset_lon(km: float) -> float:
    return LON + km / (111.32 * math.cos(math.radians(LAT)))


# ------------------------------------------------------------------ factories (seed-free, direct DB)
class World:
    def __init__(self, client, h):
        self.client, self.h = client, h
        self.farmer, self.farm = farm_for(client, h)
        prog = client.post("/api/programmes", headers=h, json={"code": "PG-CS", "name": "Programme"}).json()
        self.project = client.post("/api/projects", headers=h, json={
            "programme_id": prog["id"], "code": "CS-1", "name": "Project", "baseline_start": "2024-06-01",
            "crediting_start": "2025-01-01", "crediting_end": "2034-12-31"}).json()
        self.ev = evidence(client, h)
        self.n = 0
        with dbmod.session_factory()() as s:
            p = s.get(Project, uuid.UUID(self.project["id"]))
            self.org = p.org_id
            lab = Lab(org_id=self.org, code="LAB1", name="Soil Lab")
            camp = Campaign(org_id=self.org, project_id=p.id, code="BL", name="Baseline", kind="baseline",
                            design="paired", planned_start=date(2024, 6, 1), planned_end=date(2024, 7, 1),
                            depth_to_cm=30, placement_seed=1)
            s.add_all([lab, camp])
            s.commit()
            self.lab_id, self.campaign_id = lab.id, camp.id

    def field(self, km_east=0.0, row=0, land_use=((1990, 2023, "cropland"),), **attrs):
        self.n += 1
        lat = LAT + row * 0.002
        f = mk_field(self.client, self.h, self.farm["id"], lat=lat, lon=offset_lon(km_east) + self.n * 0.002,
                     **{**ATTRS, **attrs})
        self.land_use(f, land_use)
        return f

    def land_use(self, field, periods):
        with dbmod.session_factory()() as s:
            s.add_all([LandUseRecord(org_id=self.org, field_id=uuid.UUID(field["id"]), from_year=a, to_year=b,
                                     land_use=use, source="test") for a, b, use in periods])
            s.commit()

    def stratum(self, code, fields, role="project", qu=None):
        with dbmod.session_factory()() as s:
            st = Stratum(org_id=self.org, project_id=uuid.UUID(self.project["id"]), code=code, name=code, role=role,
                         quantification_unit=qu, field_ids=[f["id"] for f in fields], area_ha=len(fields),
                         effective_from=date(2024, 1, 1))
            s.add(st)
            s.commit()
            return str(st.id)

    def soc(self, stratum_id, field, values):
        """One baseline sample per value; top layer 0–15 cm carries the accepted SOC %, a deeper layer too."""
        with dbmod.session_factory()() as s:
            for v in values:
                self.n += 1
                site = Site(org_id=self.org, project_id=uuid.UUID(self.project["id"]), field_id=uuid.UUID(field["id"]),
                            stratum_id=uuid.UUID(stratum_id), code=f"S{self.n}", latitude=LAT, longitude=LON)
                s.add(site)
                s.flush()
                pt = SamplingPoint(org_id=self.org, campaign_id=self.campaign_id, site_id=site.id)
                s.add(pt)
                s.flush()
                smp = Sample(org_id=self.org, point_id=pt.id, campaign_id=self.campaign_id, site_id=site.id,
                             code=f"SMP{self.n}", collected_at=datetime(2024, 6, 10, tzinfo=UTC), latitude=LAT,
                             longitude=LON, distance_from_site_m=1, depth_reached_cm=30, client_ref=f"c{self.n}")
                s.add(smp)
                s.flush()
                top = SoilLayer(org_id=self.org, sample_id=smp.id, code=f"L{self.n}a", label_qr=f"Q{self.n}a",
                                depth_from_cm=0, depth_to_cm=15)
                deep = SoilLayer(org_id=self.org, sample_id=smp.id, code=f"L{self.n}b", label_qr=f"Q{self.n}b",
                                 depth_from_cm=15, depth_to_cm=30)
                s.add_all([top, deep])
                s.flush()
                for layer, value, status in ((top, v, "accepted"), (deep, 0.1, "accepted"), (top, 99.0, "rejected")):
                    s.add(LabResult(org_id=self.org, layer_id=layer.id, lab_id=self.lab_id, analyte="soc_pct",
                                    value=value, unit="%", method="dry_combustion", analysed_on=date(2024, 7, 1),
                                    status=status))
            s.commit()

    def alm(self, field, irrigation=False, crop_name="maize", years=range(2020, 2025)):
        pid = self.project["id"]
        for y in years:
            rec(self.client, self.h, pid, field["id"], y, "crop", crop(crop_name, y), evidence_ids=[self.ev])
            rec(self.client, self.h, pid, field["id"], y, "tillage_residue", till(True), evidence_ids=[self.ev])
            rec(self.client, self.h, pid, field["id"], y, "n_fertilizer", fert(100), evidence_ids=[self.ev])
            water = {"irrigation": irrigation, "flooding": False, **({"irrigation_rate_mm": 300} if irrigation else {})}
            rec(self.client, self.h, pid, field["id"], y, "water", water, evidence_ids=[self.ev])

    def link(self, control_id, stratum_id=None, qu=None, expect=201, plan=True):
        body = {"control_stratum_id": control_id, "managed_by": "Research farm KVK",
                "management_plan_evidence_id": self.ev if plan else None}
        body.update({"project_stratum_id": stratum_id} if stratum_id else {"qu_code": qu})
        r = self.client.post(f"/api/projects/{self.project['id']}/control-sites", headers=self.h, json=body)
        assert r.status_code == expect, r.text
        return r.json()

    def assess(self, h=None, expect=200):
        r = self.client.post(f"/api/projects/{self.project['id']}/control-sites/assess", headers=h or self.h)
        assert r.status_code == expect, r.text
        return r.json()


def criteria(result, link_id):
    link = next(x for x in result["links"] if x["link_id"] == link_id)
    return link, {c["code"]: c for c in link["criteria"]}


def good_pair(w, control_km=50.0, qu_code=None, control_code="C1", control_attrs=None, soc_c=(1.50, 1.60, 1.55),
              soc_q=(1.52, 1.58, 1.61), alm=True):
    q1, q2 = w.field(0), w.field(0, row=1)
    c1 = w.field(control_km, **(control_attrs or {}))
    sq = w.stratum(f"S-{control_code}", [q1, q2], qu=qu_code)
    sc = w.stratum(control_code, [c1], role="control")
    w.soc(sq, q1, soc_q)
    w.soc(sc, c1, soc_c)
    if alm:
        for f in (q1, q2, c1):
            w.alm(f)
    return sq, sc, (q1, q2, c1)


@pytest.fixture()
def world(client, as_role):
    return World(client, as_role("programme_admin"))


# ------------------------------------------------------------------ pure rules
def test_functional_groups():
    assert domain.functional_group("Maize") == domain.functional_group("sorghum") == "grasses_cereals"
    assert domain.functional_group("soybean") == "legumes"
    assert domain.functional_group("coffee") == "perennial_tree"
    assert domain.functional_group("dragonfruit") == "crop:dragonfruit"


def test_aspect_and_angles():
    assert domain.angle_diff(350, 10) == pytest.approx(20)
    assert domain.angle_diff(domain.circular_mean([350, 10]), 0) == pytest.approx(0, abs=1e-9)
    steep = dict(code="x", area_ha=1, lat=0, lon=0, slope_pct=35, texture=None, wrb=None, ecoregion=None,
                 climate_zone=None, precip_mm=None)
    a = [domain.Site(**steep, aspect_deg=350)]
    b = [domain.Site(**steep, aspect_deg=15)]
    far = [domain.Site(**steep, aspect_deg=60)]
    slope = domain.slope_check(a, b)
    assert slope["status"] == "pass" and slope["details"]["control"] == "steep"
    assert domain.aspect_check(a, b, slope)["status"] == "pass"
    assert domain.aspect_check(a, far, domain.slope_check(a, far))["status"] == "fail"
    flat = [domain.Site(**{**steep, "slope_pct": 2}, aspect_deg=0)]
    flat2 = [domain.Site(**{**steep, "slope_pct": 1}, aspect_deg=180)]
    assert domain.aspect_check(flat, flat2, domain.slope_check(flat, flat2))["status"] == "not_applicable"


def test_welch_soc():
    assert domain.soc_check([1.5, 1.6, 1.55], [1.52, 1.58, 1.61])["status"] == "pass"
    r = domain.soc_check([1.0, 1.05, 0.98, 1.02], [2.0, 2.1, 1.95, 2.05])
    assert r["status"] == "fail" and r["details"]["p_value"] < 0.10
    assert domain.soc_check([1.5], [1.5, 1.6])["status"] == "pending"
    assert domain.soc_check([1.5, 1.5], [1.5, 1.5])["status"] == "pass"


def test_alm_rule_pure():
    years = [2020, 2021]

    def g(irr, crop_type="maize", years=years):
        return {y: {"tillage_residue": [till(True)], "crop": [crop(crop_type, y)], "n_fertilizer": [fert(100)],
                    "water": [{"irrigation": irr, "flooding": False}]} for y in years}

    # Table 7 note e: crop type first; the functional group only where the type can't be matched, with a reason
    assert domain.alm_check({"A": g(False)}, {"B": g(False)}, years)["status"] == "pass"
    differ = domain.alm_check({"A": g(False)}, {"B": g(False, "sorghum")}, years)
    assert differ["status"] == "fail" and differ["details"]["differences"][0]["practice"] == "crop_type"
    why = "No maize control plot within 250 km; sorghum is the nearest cereal."
    grp = domain.alm_check({"A": g(False)}, {"B": g(False, "sorghum")}, years, crop_group_justification=why)
    assert grp["status"] == "pass" and len(grp["details"]["crop_group_matches"]) == 2 and why in grp["message"]
    assert domain.alm_check({"A": g(False)}, {"B": g(False, "soybean")}, years,
                            crop_group_justification=why)["status"] == "fail"  # legume ≠ cereal
    fail = domain.alm_check({"A": g(False)}, {"B": g(True)}, years)
    assert fail["status"] == "fail" and fail["details"]["differences"][0]["practice"] == "irrigation"
    assert domain.alm_check({"A": g(False)}, {"B": g(False, "soybean")}, years)["status"] == "fail"
    pending = domain.alm_check({"A": g(False, years=[2020])}, {"B": g(False)}, years)
    assert pending["status"] == "pending" and pending["details"]["missing"]


# ------------------------------------------------------------------ API
def test_matching_control_site_passes(world, client):
    sq, sc, _ = good_pair(world)
    link = world.link(sc, stratum_id=sq)
    assert link["fixed_lat"] and link["project_stratum_id"] == sq
    res = world.assess()
    lk, c = criteria(res, link["id"])
    assert lk["overall"] == "pass", {k: (v["status"], v["message"]) for k, v in c.items()}
    assert c["distance"]["details"]["distance_km"] == pytest.approx(50, abs=2)
    assert c["aspect"]["status"] == "not_applicable" and c["soc_mean"]["details"]["n_control"] == 3
    # Table 7: average SOC % to the project-boundary depth (≥ 30 cm): (top 1.55 + deep 0.1) / 2, accepted only
    assert c["soc_mean"]["details"]["control_mean_pct"] == pytest.approx(0.825)
    assert c["soc_mean"]["details"]["depth_cm"] == 30
    assert c["historical_alm"]["details"]["years"] == [2020, 2021, 2022, 2023, 2024]
    proj = {x["code"]: x for x in res["project_checks"]}
    assert proj["min_control_sites"]["status"] == "fail"  # only one control site
    assert proj["control_site_per_stratum"]["status"] == "pass"
    assert res["overall"] == "fail"
    got = client.get(f"/api/projects/{world.project['id']}/control-sites/assessment", headers=world.h).json()
    assert got["run_id"] == res["run_id"]


@pytest.mark.parametrize("attrs,code", [
    ({"soil_texture_class": "clay"}, "soil_texture"),
    ({"wrb_soil_group": "Ferralsols"}, "wrb_soil_group"),
    ({"ecoregion": "Deccan thorn scrub forests"}, "ecoregion"),
    ({"climate_zone": "tropical_dry"}, "climate_zone"),
    ({"mean_annual_precip_mm": 1650}, "precipitation"),
    ({"slope_pct": 20}, "slope_class"),
])
def test_attribute_mismatch_fails(world, attrs, code):
    sq, sc, _ = good_pair(world, control_attrs=attrs, alm=False)
    link = world.link(sc, stratum_id=sq)
    lk, c = criteria(world.assess(), link["id"])
    assert c[code]["status"] == "fail" and lk["overall"] == "fail"


def test_precipitation_within_100mm_passes(world):
    sq, sc, _ = good_pair(world, control_attrs={"mean_annual_precip_mm": 1890}, alm=False)
    link = world.link(sc, stratum_id=sq)
    assert criteria(world.assess(), link["id"])[1]["precipitation"]["status"] == "pass"


def test_distance_over_250km_fails(world):
    sq, sc, _ = good_pair(world, control_km=260, alm=False)
    link = world.link(sc, stratum_id=sq)
    assert criteria(world.assess(), link["id"])[1]["distance"]["status"] == "fail"


def test_steep_land_checks_aspect(world):
    sq, sc, _ = good_pair(world, control_attrs={"slope_pct": 25, "aspect_deg": 150}, alm=False)
    q_fields = [f for f in world.client.get("/api/fields", headers=world.h).json()["items"]
                if f["code"] in ("FLD-000001", "FLD-000002")]
    for f in q_fields:
        world.client.patch(f"/api/fields/{f['id']}", headers=world.h, json={"slope_pct": 22, "aspect_deg": 100})
    link = world.link(sc, stratum_id=sq)
    c = criteria(world.assess(), link["id"])[1]
    assert c["slope_class"]["status"] == "pass" and c["aspect"]["status"] == "fail"


def test_significantly_different_soc_fails(world):
    sq, sc, _ = good_pair(world, soc_c=(0.9, 0.95, 0.92, 0.94), soc_q=(1.8, 1.85, 1.9, 1.82), alm=False)
    link = world.link(sc, stratum_id=sq)
    assert criteria(world.assess(), link["id"])[1]["soc_mean"]["status"] == "fail"


def test_missing_data_is_pending_not_pass(world):
    q1 = world.field(0, slope_pct=None, soil_texture_class=None)
    c1 = world.field(30)
    sq = world.stratum("S1", [q1])
    sc = world.stratum("C1", [c1], role="control")
    link = world.link(sc, stratum_id=sq, plan=False)
    lk, c = criteria(world.assess(), link["id"])
    assert lk["overall"] == "pending"
    for code in ("slope_class", "aspect", "soil_texture", "soc_mean", "historical_alm", "management_plan"):
        assert c[code]["status"] == "pending", code
    assert c["distance"]["status"] == "pass"


def test_historical_alm_difference_fails(world):
    sq, sc, (q1, q2, c1) = good_pair(world, alm=False)
    world.alm(q1)
    world.alm(q2)
    world.alm(c1, irrigation=True)
    link = world.link(sc, stratum_id=sq)
    c = criteria(world.assess(), link["id"])[1]
    assert c["historical_alm"]["status"] == "fail" and "irrigation" in c["historical_alm"]["message"]


def test_crop_may_differ_within_functional_group(world):
    sq, sc, (q1, q2, c1) = good_pair(world, alm=False)
    world.alm(q1)
    world.alm(q2)
    world.alm(c1, crop_name="sorghum")
    link = world.link(sc, stratum_id=sq)
    assert criteria(world.assess(), link["id"])[1]["historical_alm"]["status"] == "fail"  # type first (note e)
    r = world.client.patch(f"/api/projects/{world.project['id']}/control-sites/{link['id']}", headers=world.h,
                           json={"crop_group_justification": "No maize control plot within 250 km."})
    assert r.status_code == 200, r.text
    assert r.json()["fixed_lat"] == link["fixed_lat"]  # the location never changes
    assert r.json()["crop_group_justification"].startswith("No maize")
    assert criteria(world.assess(), r.json()["id"])[1]["historical_alm"]["status"] == "pass"


def test_project_level_checks_pass_with_three_sites_and_qu_links(world):
    q = [world.field(0, row=r) for r in range(3)]
    controls = [world.field(20 + 10 * i) for i in range(3)]
    sa = world.stratum("SA", q[:2], qu="QU-1")
    sb = world.stratum("SB", q[2:], qu="QU-1")
    for f in q + controls:
        world.alm(f)
    links = []
    for i, cf in enumerate(controls):
        sc = world.stratum(f"C{i}", [cf], role="control")
        world.soc(sc, cf, (1.5, 1.6, 1.55))
        links.append(world.link(sc, qu="QU-1"))
    world.soc(sa, q[0], (1.52, 1.58, 1.6))
    world.soc(sb, q[2], (1.5, 1.57, 1.62))
    res = world.assess()
    assert all(lk["overall"] == "pass" for lk in res["links"]), res["links"]
    proj = {x["code"]: x for x in res["project_checks"]}
    assert proj["min_control_sites"]["status"] == "pass" and proj["min_control_sites"]["details"]["passing"] == 3
    assert proj["control_site_per_stratum"]["status"] == "pass" and res["overall"] == "pass"


def test_uncovered_stratum_fails(world):
    sq, sc, _ = good_pair(world, alm=False)
    world.stratum("S-UNCOVERED", [world.field(0, row=3)])
    world.link(sc, stratum_id=sq)
    proj = {x["code"]: x for x in world.assess()["project_checks"]}
    assert proj["control_site_per_stratum"]["status"] == "fail"
    assert "S-UNCOVERED" in proj["control_site_per_stratum"]["message"]


def test_link_validation(world, client):
    sq, sc, (q1, _, c1) = good_pair(world, alm=False)
    r = world.link(sq, stratum_id=sq, expect=422)
    assert r["code"] == "WRONG_STRATUM_ROLE"
    assert world.link(sc, stratum_id=sc, expect=422)["code"] == "WRONG_STRATUM_ROLE"
    assert world.link(sc, qu="NOPE", expect=422)["code"] == "UNKNOWN_QU"
    world.link(sc, stratum_id=sq)
    assert world.link(sc, stratum_id=sq, expect=422)["code"] == "DUPLICATE_LINK"
    both = client.post(f"/api/projects/{world.project['id']}/control-sites", headers=world.h, json={
        "control_stratum_id": sc, "project_stratum_id": sq, "qu_code": "X", "managed_by": "KVK"})
    assert both.status_code == 422
    empty = world.stratum("C-EMPTY", [], role="control")
    assert world.link(empty, stratum_id=sq, expect=422)
    world.link(sc, qu="S-C1")  # one control site may serve several QUs (QU code defaults to the stratum code)
    assert len(client.get(f"/api/projects/{world.project['id']}/control-sites", headers=world.h).json()) == 2


def test_location_must_stay_fixed(world):
    sq, sc, _ = good_pair(world, alm=False)
    link = world.link(sc, stratum_id=sq)
    moved = world.field(80)
    with dbmod.session_factory()() as s:
        st = s.get(Stratum, uuid.UUID(sc))
        st.field_ids = [moved["id"]]
        s.commit()
    assert criteria(world.assess(), link["id"])[1]["location_fixed"]["status"] == "fail"


def test_assessments_append_only_and_latest(world, client):
    sq, sc, _ = good_pair(world, alm=False)
    world.link(sc, stratum_id=sq)
    url = f"/api/projects/{world.project['id']}/control-sites/assessment"
    assert client.get(url, headers=world.h).status_code == 404
    first = world.assess()
    second = world.assess()
    assert first["run_id"] != second["run_id"]
    assert client.get(url, headers=world.h).json()["run_id"] == second["run_id"]
    with dbmod.session_factory()() as s:
        assert s.query(ControlSiteAssessment).count() == 4
        row = s.query(ControlSiteAssessment).first()
        row.overall = "pass"
        with pytest.raises(ImmutableRecord):
            s.flush()


def test_permissions_and_isolation(world, client, as_role):
    sq, sc, _ = good_pair(world, alm=False)
    world.link(sc, stratum_id=sq)
    analyst = as_role("mrv_analyst")
    assert client.get(f"/api/projects/{world.project['id']}/control-sites", headers=analyst).status_code == 200
    world.assess(h=analyst, expect=403)
    world.assess(h=as_role("field_collector"))  # land managers may run it
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    pid = world.project["id"]
    assert client.get(f"/api/projects/{pid}/control-sites", headers=rival).status_code == 404
    assert client.post(f"/api/projects/{pid}/control-sites/assess", headers=rival).status_code == 404
    assert client.get(f"/api/projects/{pid}/control-sites/assessment", headers=rival).status_code == 404
    prog = client.post("/api/programmes", headers=rival, json={"code": "PG-R", "name": "Programme"}).json()
    rp = client.post("/api/projects", headers=rival, json={"programme_id": prog["id"], "code": "R1",
                                                            "name": "Project"}).json()
    r = client.post(f"/api/projects/{rp['id']}/control-sites", headers=rival,
                    json={"control_stratum_id": sc, "project_stratum_id": sq, "managed_by": "Thief"})
    assert r.status_code == 404


# ------------------------------------------------------------------ Table 7 historical land cover
def test_conversion_from_land_use_records():
    assert domain.conversion([], 2024) == "unknown"
    assert domain.conversion([(1990, 2023, "cropland")], 2024) is None
    assert domain.conversion([(1980, 1999, "forest"), (2000, 2023, "cropland")], 2024) == ("forest", 2000)
    assert domain.conversion([(1960, 1969, "forest"), (1970, 2023, "cropland")], 2024) is None  # > 50 years


@pytest.mark.parametrize("control,qu,status", [
    ({"a": None}, {"b": None}, "pass"),
    ({"a": ("grassland", 2000)}, {"b": ("grassland", 2008)}, "pass"),
    ({"a": ("grassland", 2000)}, {"b": ("grassland", 2011)}, "fail"),   # > ±10 years apart
    ({"a": ("forest", 2000)}, {"b": ("grassland", 2000)}, "fail"),
    ({"a": None}, {"b": ("forest", 2000)}, "fail"),
    ({"a": "unknown"}, {"b": None}, "pending"),
])
def test_land_cover_check(control, qu, status):
    assert domain.land_cover_check(control, qu)["status"] == status


def test_historical_land_cover_in_assessment(client, as_role):
    world = World(client, as_role("programme_admin"))
    q = world.field(0, land_use=((1980, 1999, "grassland"), (2000, 2023, "cropland")))
    c = world.field(5, land_use=((1980, 2014, "forest"), (2015, 2023, "cropland")))
    sq = world.stratum("A", [q], qu="QU-1")
    sc = world.stratum("C1", [c], role="control")
    world.link(sc, stratum_id=sq)
    crit = {x["code"]: x for x in world.assess()["links"][0]["criteria"]}
    lc = crit["historical_land_cover"]
    assert lc["status"] == "fail" and lc["details"]["control"]["converted_from"] == "forest"
    assert lc["details"]["quantification_unit"] == {"converted_from": "grassland", "year": 2000}



def test_table7_average_texture():
    def site(code, texture, area=1.0):
        return domain.Site(code=code, area_ha=area, lat=0, lon=0, slope_pct=2, aspect_deg=0, texture=texture, wrb=None,
                           ecoregion=None, climate_zone=None, precip_mm=None)
    one, two = [site("C1", "loam")], [site("Q1", "loam"), site("Q2", "loam")]
    assert domain.texture_check(one, two)["status"] == "pass"  # a single class on each side is its own average
    mixed = domain.texture_check(one, [site("Q1", "loam"), site("Q2", "clay")])
    assert mixed["status"] == "pending" and "measured sand and clay" in mixed["message"]
    # measured: control 40/20 → loam; QU averages (20/10 and 60/30, equal areas) = 40/20 → loam
    ok = domain.texture_check(one, two, {"C1": (40, 20)}, {"Q1": (20, 10), "Q2": (60, 30)})
    assert ok["status"] == "pass" and ok["details"]["basis"] == "measured"
    assert ok["details"]["quantification_unit_sand_silt_clay"] == [40.0, 40.0, 20.0]
    # area weighting moves the QU average into sandy clay loam
    far = domain.texture_check(one, [site("Q1", "x", 1), site("Q2", "x", 9)], {"C1": (40, 20)},
                               {"Q1": (20, 10), "Q2": (60, 30)})
    assert far["status"] == "fail" and far["details"]["quantification_unit"] == "sandy_clay_loam"


def test_soc_profile_mean_is_mass_weighted_and_needs_full_depth(world):
    from app.modules.controlsites import service
    f = world.field(0)
    sq = world.stratum("A", [f], qu="QU-1")
    world.soc(sq, f, (2.0,))  # 0–15: 2.0 %, 15–30: 0.1 %
    with dbmod.session_factory()() as s:
        layers = s.query(SoilLayer).order_by(SoilLayer.depth_from_cm).all()
        for layer, bd in zip(layers, (1.0, 1.5)):  # bulk density on both layers → mass weights 15 and 22.5
            s.add(LabResult(org_id=world.org, layer_id=layer.id, lab_id=world.lab_id, analyte="bulk_density_g_cm3",
                            value=bd, unit="g/cm3", method="core", analysed_on=date(2024, 7, 1), status="accepted"))
        s.commit()
        st = s.get(Stratum, uuid.UUID(sq))
        assert service._soc_values(s, world.org, [st], 30) == [pytest.approx((2.0 * 15 + 0.1 * 22.5) / 37.5)]
        assert service._soc_values(s, world.org, [st], 50) == []  # layers stop at 30 cm: not averaged to 50
