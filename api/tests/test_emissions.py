"""VM0042 v2.2 QA3 emissions (Eq. 6–33): pure equations, conservative factors, baseline schedule, API."""

from __future__ import annotations

import dataclasses
import uuid

import pytest

from app.core import db as dbmod
from app.core.errors import Blocked, RuleMissing, ValidationFailed
from app.modules.baseline.models import ActivityRecord
from app.modules.emissions import domain as em
from app.modules.methodology.definitions import RULES
from app.modules.methodology.ruleset import from_values
from tests._p2_factories import build_project
from tests.conftest import login, make_org, make_user

GWP_CH4, GWP_N2O, N2O_N, C = 28, 265, 44 / 28, 44 / 12


def rules(**over):
    v = {r.key: r.example for r in RULES}
    v.update({r.key: r.vm0042_default for r in RULES if r.vm0042_default is not None})
    v.update(over)
    return from_values({k: x for k, x in v.items() if x is not None})


def act(scenario, year, category, attrs, field="F1", rid=None, version=1):
    return em.Activity(field, scenario, year, category, attrs, 1, rid or uuid.uuid4().hex, version)


def run(acts, *, years=(2021,), start=2021, r=None, area=10.0, biochar_years=()):
    inp = em.EmissionsInput(tuple(acts), (em.QuantUnit("QU1", area, ("F1",)),), {"F1": area}, start,
                            {y: 1.0 for y in years}, biochar_years)
    return em.quantify(inp, r or rules())


# ------------------------------------------------------------------ pure equations
def test_fossil_fuel_and_liming():
    assert em.eq7_fossil_fuel(1000, 0.002886) == pytest.approx(2.886)  # diesel
    assert em.eq7_fossil_fuel(1000, 0.002810) == pytest.approx(2.810)  # gasoline
    assert em.eq9_liming(10, 0, 0.12, 0.13) == pytest.approx(4.4)  # 10 × 0.12 × 44/12
    assert em.eq9_liming(0, 10, 0.12, 0.13) == pytest.approx(10 * 0.13 * C)
    assert em.areal(4.4, 2.0) == pytest.approx(2.2)
    with pytest.raises(ValidationFailed):
        em.areal(1.0, 0)


def test_fertiliser_eq18_to_23_hand_example():
    fsn = em.eq19_fsn([(1.0, 0.46)])  # 1 t urea → 0.46 t N
    fon = em.eq20_fon([(10.0, 0.02)])  # 10 t manure → 0.2 t N
    assert (fsn, fon) == pytest.approx((0.46, 0.2))
    f = {"EF_Ndirect": 0.01, "EF_Nvolat": 0.01, "EF_Nleach": 0.011, "Frac_GASF": 0.11, "Frac_GASM": 0.21,
         "Frac_LEACH": 0.24}
    parts = em.eq17_fertilizer(fsn, fon, f, GWP_N2O)
    assert parts["direct"] == pytest.approx(0.66 * 0.01 * N2O_N * 265)  # Eq. 18 = 2.7484
    assert parts["direct"] == pytest.approx(2.7484, abs=1e-4)
    assert parts["volatilisation"] == pytest.approx((0.46 * 0.11 + 0.2 * 0.21) * 0.01 * N2O_N * 265)  # Eq. 22
    assert parts["leaching"] == pytest.approx(0.66 * 0.24 * 0.011 * N2O_N * 265)  # Eq. 23
    assert parts["indirect"] == pytest.approx(parts["volatilisation"] + parts["leaching"])  # Eq. 21
    assert parts["total"] == pytest.approx(parts["direct"] + parts["indirect"])  # Eq. 17


def test_n_fixing_livestock_burning_and_leakage():
    fcr = em.eq25_fcr([(2.0, 0.03)])
    assert em.eq24_n_fixing(fcr, 0.01, GWP_N2O) == pytest.approx(0.06 * 0.01 * N2O_N * 265)
    assert em.eq11_enteric(10, 72, GWP_CH4) == pytest.approx(28 * 10 * 72 / 1000)  # 20.16 t CO2e
    vs = em.eq13_vs(8.4, 500)
    assert vs == pytest.approx(8.4 * 0.5 * 365)
    assert em.eq12_manure_ch4(10, vs, 0.5, 0.47, GWP_CH4) == pytest.approx(28 * 10 * vs * 0.5 * 0.47 / 1e6)
    fm = em.eq27_f_manure(10, 60, 0.5, 1.0)
    n2o = em.eq26_31_manure_n2o(fm, {"EF_N2O_md": 0.004, "Frac_GASM": 0.21, "EF_Nvolat": 0.01, "Frac_LEACH": 0.24,
                                     "EF_Nleach": 0.011}, GWP_N2O)
    assert n2o["direct"] == pytest.approx(300 * 0.004 * N2O_N * 265 / 1000)
    assert em.eq14_burning_ch4(1000, 0.8, 2.7, GWP_CH4) == pytest.approx(28 * 1000 * 0.8 * 2.7 / 1e6)
    assert em.eq32_burning_n2o(1000, 0.8, 0.07, GWP_N2O) == pytest.approx(265 * 1000 * 0.8 * 0.07 / 1e6)
    # Eq. 33 example: 100 t compost with 30 % carbon → 100 × 0.3 × 0.12 × 44/12 = 13.2 t CO2e
    assert em.eq33_leakage_oa(100, 0.3, 0.12) == pytest.approx(13.2)
    assert em.eq16_soil_n2o(1, 2, 3) == 6


# ------------------------------------------------------------------ quantify
def test_reductions_are_baseline_minus_project_with_areal_means():
    res = run([act("baseline", 2020, "fossil_fuel", {"fuels": [{"fuel": "diesel", "litres": 1000}]}),
               act("project", 2021, "fossil_fuel", {"diesel_l": 400})])
    src = res.sources["co2_fossil_fuel"]
    assert src["baseline_t_co2e"] == pytest.approx(2.886) and src["project_t_co2e"] == pytest.approx(0.4 * 2.886)
    assert res.reduction("co2_fossil_fuel") == pytest.approx(0.6 * 2.886)
    unit = next(u for u in res.units if u["source"] == "co2_fossil_fuel")
    assert unit["baseline_t_co2e_ha"] == pytest.approx(0.2886)  # Eq. 6 areal mean, A = 10 ha
    row = res.fields[0]
    assert row["baseline_data_year"] == 2020 and row["project_t_co2e_ha"] == pytest.approx(0.4 * 0.2886)
    assert res.trail and res.trail[0]["eq"] == "Eq. 6–7"


def test_conservative_emission_factor_end():
    ranged = {"EF_Ndirect": {"value": 0.01, "low": 0.001, "high": 0.018}, "EF_Nvolat": 0.01, "EF_Nleach": 0.011,
              "Frac_GASF": 0.11, "Frac_GASM": 0.21, "Frac_LEACH": 0.0}
    r = rules(emission_factors=ranged)

    def fert(t):
        return {"synthetic_fertilizers": [{"type": "urea", "mass_t": t, "n_content": 0.5}]}

    down = run([act("baseline", 2020, "n_fertilizer", fert(1.0)), act("project", 2021, "n_fertilizer", fert(0.5))],
               r=r)
    assert down.sources["n2o_fertilizer"]["ef_end"] == "low"
    base = 0.5 * 0.001 * N2O_N * 265 + 0.5 * 0.11 * 0.01 * N2O_N * 265
    assert down.sources["n2o_fertilizer"]["baseline_t_co2e"] == pytest.approx(base)
    up = run([act("baseline", 2020, "n_fertilizer", fert(0.5)), act("project", 2021, "n_fertilizer", fert(1.0))], r=r)
    assert up.sources["n2o_fertilizer"]["ef_end"] == "high"
    assert up.sources["n2o_fertilizer"]["project_t_co2e"] == pytest.approx(
        0.5 * 0.018 * N2O_N * 265 + 0.5 * 0.11 * 0.01 * N2O_N * 265)


def test_baseline_schedule_repeats_every_lookback_period():
    assert [em.baseline_year_for(y, [2018, 2019, 2020], 2021) for y in (2021, 2022, 2023, 2024)] == \
        [2018, 2019, 2020, 2018]
    assert em.baseline_year_for(2022, [2018, 2019, 2020, 2022], 2021) == 2022  # projected schedule row
    assert em.baseline_year_for(2022, [], 2021) is None


def test_missing_project_record_for_baseline_category_blocks():
    with pytest.raises(Blocked) as e:
        run([act("baseline", 2020, "liming", {"limestone_t": 1})])
    assert e.value.code == "ACTIVITY_DATA_INCOMPLETE" and e.value.details["missing"][0]["category"] == "liming"


def test_missing_factor_and_incomplete_attributes_fail_closed():
    with pytest.raises(RuleMissing) as e:
        run([act("baseline", 2020, "livestock", {"animals": [{"type": "goat", "population": 5, "weight_kg": 30,
                                                              "awms": 1}]}),
             act("project", 2021, "livestock", {"animals": []})])
    assert e.value.details["rule_key"] == "emission_factors" and e.value.details["factor_key"] == "EF_ent_goat"
    with pytest.raises(ValidationFailed) as e:
        run([act("project", 2021, "n_fertilizer", {"synthetic_n": True})])
    assert e.value.code == "ACTIVITY_DATA_INCOMPLETE"
    with pytest.raises(ValidationFailed):
        run([act("project", 2021, "liming", {"limestone_t": -1})])


def test_livestock_through_quantify():
    cow = {"type": "dairy cattle", "population": 10, "weight_kg": 500, "awms": 0.5}
    # §8.4.2 (b): production maintained and animals slaughtered (evidenced), so the project herd is used
    res = run([act("baseline", 2020, "livestock", {"animals": [cow]}),
               act("project", 2021, "livestock", {"animals": [{**cow, "population": 5}],
                                                   "production_maintained_slaughtered": True})])
    assert res.livestock_floor[0]["option"] == "b" and not res.displacement_leakage_required
    assert res.sources["ch4_enteric"]["baseline_t_co2e"] == pytest.approx(28 * 10 * 58 / 1000)  # low end, decrease
    assert res.reduction("ch4_enteric") == pytest.approx(28 * 5 * 58 / 1000)
    assert res.sources["ch4_manure"]["reduction_t_co2e"] > 0
    # manure N2O decreases, so the low ends are used (EF_N2O_md low = 0 in the example table)
    assert res.sources["n2o_manure"]["ef_end"] == "low" and res.sources["n2o_manure"]["reduction_t_co2e"] >= 0


def test_organic_amendment_leakage_exemptions_and_additionality():
    def am(**kw):
        return {"amendments": [{"type": "compost", "mass_t": 10, "carbon_content": 0.3, **kw}]}

    base = act("baseline", 2020, "organic_amendment_import", {"amendments": [
        {"type": "compost", "mass_t": 4, "carbon_content": 0.3}]})
    res = run([base, act("project", 2021, "organic_amendment_import", am())])
    assert res.leakage_oa_by_year[2021] == pytest.approx(6 * 0.3 * 0.12 * C)  # only the additional 6 t
    for exemption in ("produced_on_site", "diverted_from_anaerobic_storage", "not_previously_used_as_amendment"):
        ex = run([act("project", 2021, "organic_amendment_import", am(**{exemption: True}))])
        assert ex.leakage_oa_by_year[2021] == 0 and ex.leakage_items[0]["exemption"] == exemption


def test_biochar_years_and_versions_and_qa1_skip():
    rid = "same"
    acts = [act("project", 2021, "biochar", {"organic_carbon_t": 1.0}, rid=rid, version=1),
            act("project", 2021, "biochar", {"mass_t": 4.0, "organic_carbon_fraction": 0.5}, rid=rid, version=2),
            act("project", 2019, "biochar", {"organic_carbon_t": 9.0})]
    res = run(acts, biochar_years=(2021,))
    assert res.biochar_t_co2e == pytest.approx(2.0 * C)  # latest version only, only interval years
    skipped = run([], r=rules(qa_n2o_soil="qa1"))
    assert set(skipped.skipped_sources) == {"n2o_fertilizer", "n2o_n_fixing", "n2o_manure"}
    with pytest.raises(Blocked) as e:
        run([], r=rules(qa_liming="qa1"))
    assert e.value.code == "APPROACH_NOT_PERMITTED"


# ------------------------------------------------------------------ API
def test_emissions_endpoint(client, org, as_role):
    b = build_project(org)
    h = as_role("mrv_analyst")
    r = client.get(f"/api/projects/{b.project_id}/emissions", params={"start": "2021-01-01", "end": "2024-12-31"},
                   headers=h)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["quantification_units"][0]["code"] == "QU1" and body["records_used"] == 100
    assert body["sources"]["co2_fossil_fuel"]["reduction_t_co2e"] == pytest.approx(2 * 4 * 40 * 0.002886)
    assert body["leakage_oa_t_co2e"] == pytest.approx(2 * 2 * 0.3 * 0.12 * C)
    assert body["fields"] and {"baseline_t_co2e_ha", "project_t_co2e_ha"} <= set(body["fields"][0])
    assert body["tiers"] == {"1": 58, "3": 42}
    # a voided correction removes a record from the calculation
    with dbmod.session_factory()() as s:
        rec = s.query(ActivityRecord).filter_by(project_id=uuid.UUID(b.project_id), category="crop").first()
        s.add(ActivityRecord(org_id=rec.org_id, record_id=rec.record_id, version=2, project_id=rec.project_id,
                             field_id=rec.field_id, scenario=rec.scenario, year=rec.year, category=rec.category,
                             attributes=rec.attributes, data_tier=rec.data_tier, status="voided", reason="duplicate"))
        s.commit()
    again = client.get(f"/api/projects/{b.project_id}/emissions", params={"start": "2021-01-01",
                                                                           "end": "2024-12-31"}, headers=h).json()
    assert again["records_used"] == 99
    bad = client.get(f"/api/projects/{b.project_id}/emissions", params={"start": "2024-01-01", "end": "2021-01-01"},
                     headers=h)
    assert bad.status_code == 422
    rival = login(client, make_user(make_org("Rival"), "mrv_analyst"))
    assert client.get(f"/api/projects/{b.project_id}/emissions", params={"start": "2021-01-01", "end": "2021-12-31"},
                      headers=rival).status_code == 404
    assert client.get(f"/api/projects/{b.project_id}/emissions", params={"start": "2021-01-01", "end": "2021-12-31"},
                      headers=as_role("field_collector")).status_code == 403


def test_emissions_endpoint_needs_approved_rules(client, org, as_role):
    b = build_project(org, pack_status="draft")
    r = client.get(f"/api/projects/{b.project_id}/emissions", params={"start": "2021-01-01", "end": "2021-12-31"},
                   headers=as_role("mrv_analyst"))
    assert r.status_code == 409 and r.json()["code"] == "RULE_MISSING"


# ------------------------------------------------------------------ Table 4 flat form = itemised form
FACTORS = {"EF_Ndirect": 0.01, "EF_Nvolat": 0.01, "EF_Nleach": 0.011, "Frac_GASF": 0.11, "Frac_GASM": 0.21,
           "Frac_LEACH": 0.24, "EF_N2O_md": 0.01, "EF_ent_dairy_cattle": 60, "VS_rate_dairy_cattle": 0.009,
           "EF_CH4_md_dairy_cattle": 1.0, "Nex_dairy_cattle": 0.6, "CF_rice_straw": 0.8,
           "EF_CH4_bb_rice_straw": 2.7, "EF_N2O_bb_rice_straw": 0.07, "N_content_manure": 0.005}


def total(source, attrs, area=4.0, factors=FACTORS):
    F = em.Factors(rules(emission_factors=factors))
    return em.source_total(source, [act("project", 2021, em.SOURCES[source][0], attrs)], F, area)[0]


@pytest.mark.parametrize("source,flat,listed", [
    ("co2_liming", {"limestone": True, "limestone_t_ha": 0.5, "dolomite": False}, {"limestone_t": 2.0}),
    ("n2o_fertilizer", {"synthetic_n": True, "synthetic_n_rate_kg_n_ha": 50, "manure": False, "compost": False},
     {"synthetic_fertilizers": [{"mass_t": 0.2, "n_content": 1.0}]}),
    ("n2o_fertilizer", {"synthetic_n": False, "manure": True, "manure_rate_t_ha": 2.5, "compost": False},
     {"organic_fertilizers": [{"mass_t": 10.0, "n_content": 0.005}]}),
    ("n2o_n_fixing", {"n_fixing": True, "species_name": "sunn hemp", "dry_matter_t_ha": 1.5, "n_content": 0.03},
     {"species": [{"name": "sunn hemp", "dry_matter_t": 6.0, "n_content": 0.03}]}),
    ("ch4_enteric", {"livestock": True, "animal_type": "dairy_cattle", "population_head": 3, "days_on_site": 200},
     {"animals": [{"type": "dairy_cattle", "population": 3, "days_on_site": 200}]}),
    ("ch4_manure", {"livestock": True, "animal_type": "dairy_cattle", "population_head": 2, "avg_weight_kg": 350,
                    "awms": 0.5}, {"animals": [{"type": "dairy_cattle", "population": 2, "weight_kg": 350,
                                                "awms": 0.5}]}),
    ("ch4_biomass_burning", {"burning": True, "residue_type": "rice_straw", "mass_burned_t": 1.2},
     {"burns": [{"residue": "rice_straw", "mass_t": 1.2}]}),
])
def test_flat_table4_form_equals_itemised_form(source, flat, listed):
    a, b = total(source, flat), total(source, listed)
    assert a > 0 and a == pytest.approx(b)
    assert total(source, {**flat, **listed}) == pytest.approx(b)  # both given: counted once


def test_flat_form_fails_closed():
    with pytest.raises(RuleMissing):  # manure rate needs an N content factor; nothing is assumed
        total("n2o_fertilizer", {"synthetic_n": False, "manure": True, "manure_rate_t_ha": 2, "compost": False},
              factors={k: v for k, v in FACTORS.items() if k != "N_content_manure"})
    with pytest.raises(ValidationFailed):  # per-hectare values need the field area
        total("co2_liming", {"limestone": True, "limestone_t_ha": 0.5}, area=0)


def test_flat_amendment_with_named_exemption():
    base = {"imported": True, "amendment_type": "cattle_manure", "mass_t": 4.0, "carbon_content": 0.3}
    assert em.amendment_entries(base) == [{"type": "cattle_manure", "mass_t": 4.0, "carbon_content": 0.3}]
    assert em.amendment_entries({**base, "exemption": "Produced on site"})[0]["produced_on_site"] is True
    assert "produced_on_site" not in em.amendment_entries({**base, "exemption": "because"})[0]


def test_schema_accepts_both_forms():
    from app.modules.baseline.domain import validate_attributes as v
    assert v("n_fixing", {"n_fixing": True, "species": [{"name": "x", "dry_matter_t": 2, "n_content": 0.03}]}) == []
    assert v("n_fixing", {"n_fixing": True, "dry_matter_t_ha": 2, "n_content": 0.03}) == []
    assert v("n_fixing", {"n_fixing": True, "species": [{"name": "x"}]})  # items need numbers
    assert v("livestock", {"livestock": True, "animals": [{"type": "goat", "population": 4}]}) == []
    assert v("livestock", {"livestock": True, "animal_type": "goat", "population_head": 4, "awms": 0.4}) == []
    assert v("livestock", {"livestock": True, "animal_type": "goat", "population_head": 4, "awms": 2})
    assert v("fossil_fuel", {"fuel_used": True, "diesel_l": 40}) == []
    assert v("fossil_fuel", {"fuel_used": True, "fuels": [{"fuel": "lpg", "litres": 5}]}) == []
    assert v("liming", {"limestone": True, "limestone_t": 2, "dolomite": False}) == []
    assert v("biomass_burning", {"burning": True, "burns": [{"residue": "rice_straw", "mass_t": 1}]}) == []
    assert v("organic_amendment_import", {"imported": True, "amendments": [{"type": "fym", "mass_t": 3}]}) == []


def test_livestock_floor_option_a():
    """§8.3 p.48 / §8.4.2 (a) p.52: fewer animals without option (b) → project uses the look-back average."""
    cow = {"type": "dairy cattle", "population": 10, "weight_kg": 500, "awms": 0.5}
    acts = [act("baseline", 2019, "livestock", {"animals": [cow]}),
            act("baseline", 2020, "livestock", {"animals": [{**cow, "population": 14}]}),  # look-back average 12
            act("project", 2021, "livestock", {"animals": [{**cow, "population": 5}]})]
    res = run(acts, years=(2021,), start=2021)
    item = res.livestock_floor[0]
    assert item == {"field_id": "F1", "year": 2021, "type": "dairy_cattle", "lookback_average_head": 12.0,
                    "project_head": 5.0, "option": "a"}
    assert res.displacement_leakage_required and any("VMD0054" in w for w in res.warnings)
    assert res.reduction("ch4_enteric") <= 0  # the herd cut is not credited
    inp = em.EmissionsInput(tuple(acts), (em.QuantUnit("QU1", 10.0, ("F1",)),), {"F1": 10.0}, 2021, {2021: 1.0},
                            displacement_leakage_available=False)
    with pytest.raises(Blocked) as e:  # a calculation run without an approved LK_disp estimate
        em.quantify(inp, rules())
    assert e.value.code == "DISPLACEMENT_LEAKAGE_REQUIRED"
    ok = em.quantify(dataclasses.replace(inp, displacement_leakage_available=True), rules())
    assert ok.displacement_leakage_required
    same = run([act("baseline", 2020, "livestock", {"animals": [cow]}),
                act("project", 2021, "livestock", {"animals": [{**cow, "population": 12}]})])
    assert same.livestock_floor == ()  # no decline, nothing to do


def test_scalar_factor_with_conservative_end_is_flagged():
    """§8.6.3 p.81: the low/high end is required; a factor without a range is reported, not silently used."""
    acts = [act("baseline", 2020, "fossil_fuel", {"fuel_used": True, "fuels": [{"fuel": "lpg", "litres": 100}]}),
            act("project", 2021, "fossil_fuel", {"fuel_used": True, "fuels": [{"fuel": "lpg", "litres": 50}]})]
    res = run(acts, r=rules(emission_factors={"EF_CO2_lpg": 0.0016}))
    assert any(u.get("range_missing") for u in res.factors_used.values())
    assert any("EF_CO2_lpg" in w and "§8.6.3" in w for w in res.warnings)
    ranged = run(acts, r=rules(emission_factors={"EF_CO2_lpg": {"value": 0.0016, "low": 0.0015, "high": 0.0017}}))
    assert not any(u.get("range_missing") for u in ranged.factors_used.values())
