from app.modules.catalogue.defaults import DEFAULT_CROPS, DEFAULT_PRACTICES
from app.modules.catalogue.domain import validate_attributes, validate_schema
from tests.conftest import login, make_org, make_user

SCHEMA = [
    {"key": "variety", "label": "Variety", "type": "choice", "required": True, "choices": ["arabica", "robusta"]},
    {"key": "age", "label": "Age", "type": "number", "min": 0, "max": 100},
    {"key": "note", "label": "Note", "type": "text"},
]


# ------------------------------------------------------------------ validate_attributes (pure)
def test_validate_attributes_accepts_valid_values():
    assert validate_attributes(SCHEMA, {"variety": "arabica", "age": 12, "note": "ok"}) == []
    assert validate_attributes(SCHEMA, {"variety": "robusta"}) == []


def test_validate_attributes_required_missing():
    assert validate_attributes(SCHEMA, {}) == ["Variety is required."]
    assert validate_attributes(SCHEMA, {"variety": "  "}) == ["Variety is required."]


def test_validate_attributes_types_and_ranges():
    errs = validate_attributes(SCHEMA, {"variety": "liberica", "age": "ten", "note": 5})
    assert "Variety must be one of: arabica, robusta." in errs
    assert "Age must be a number." in errs
    assert "Note must be text." in errs
    assert validate_attributes(SCHEMA, {"variety": "arabica", "age": True}) == ["Age must be a number."]
    assert validate_attributes(SCHEMA, {"variety": "arabica", "age": 101}) == ["Age must be at most 100."]
    assert validate_attributes(SCHEMA, {"variety": "arabica", "age": -1}) == ["Age must be at least 0."]


def test_validate_attributes_rejects_unknown_keys():
    assert validate_attributes(SCHEMA, {"variety": "arabica", "colour": "red"}) == ["'colour' is not a recognised field."]


def test_validate_schema():
    assert validate_schema(SCHEMA) == []
    errs = validate_schema([{"key": "a", "type": "choice"}, {"key": "a"}, {"key": "Bad Key"}, {"key": "b", "type": "x"}])
    assert len(errs) == 4


def test_defaults_are_self_consistent():
    crops = {c["code"] for c in DEFAULT_CROPS}
    assert {"rice", "wheat", "maize", "sugarcane", "cotton", "coffee", "tea", "banana", "mango", "pulses",
            "millets", "vegetables", "agroforestry"} <= crops
    for c in DEFAULT_CROPS:
        assert 1 <= len(c["attributes"]) <= 3 and validate_schema(c["attributes"]) == []
    for p in DEFAULT_PRACTICES:
        assert validate_schema(p.get("fields", [])) == []
        assert set(p.get("crop_codes", [])) <= crops
        if p.get("requires_quantity"):
            assert p.get("unit")
    synth = next(p for p in DEFAULT_PRACTICES if p["code"] == "synthetic_fertiliser")
    assert synth["emission_factor_keys"] == ["synthetic_n_kg"] and synth["unit"] == "kg" and synth["requires_quantity"]


# ------------------------------------------------------------------ API
def test_install_defaults_is_idempotent(client, as_role):
    h = as_role("programme_admin")
    first = client.post("/api/catalogue/install-defaults", headers=h)
    assert first.status_code == 200, first.text
    assert len(first.json()["crops_added"]) == len(DEFAULT_CROPS)
    assert len(first.json()["practice_types_added"]) == len(DEFAULT_PRACTICES)
    again = client.post("/api/catalogue/install-defaults", headers=h).json()
    assert again == {"crops_added": [], "practice_types_added": []}
    crops = client.get("/api/catalogue/crops", headers=h).json()
    assert len(crops) == len(DEFAULT_CROPS)
    coffee = next(c for c in crops if c["code"] == "coffee")
    assert coffee["category"] == "plantation" and coffee["attributes"][0]["choices"] == ["arabica", "robusta"]


def test_install_defaults_only_adds_missing(client, as_role):
    h = as_role("programme_admin")
    client.post("/api/catalogue/crops", headers=h, json={"code": "rice", "name": "Paddy (custom)", "category": "rice"})
    added = client.post("/api/catalogue/install-defaults", headers=h).json()["crops_added"]
    assert "rice" not in added
    rice = next(c for c in client.get("/api/catalogue/crops", headers=h).json() if c["code"] == "rice")
    assert rice["name"] == "Paddy (custom)"


def test_create_crop_and_duplicate(client, as_role):
    h = as_role("methodology_owner")
    body = {"code": "cardamom", "name": "Cardamom", "category": "plantation",
            "attributes": [{"key": "variety", "label": "Variety", "type": "choice", "choices": ["malabar", "mysore"]}]}
    r = client.post("/api/catalogue/crops", headers=h, json=body)
    assert r.status_code == 201, r.text
    assert r.json()["attributes"][0]["type"] == "choice"
    dup = client.post("/api/catalogue/crops", headers=h, json=body)
    assert dup.status_code == 409 and dup.json()["code"] == "DUPLICATE_CODE"
    audit = client.get("/api/audit", headers=as_role("programme_admin")).json()
    assert any(a["action"] == "crop.create" for a in audit)


def test_crop_attribute_schema_is_validated(client, as_role):
    h = as_role("programme_admin")
    no_choices = client.post("/api/catalogue/crops", headers=h, json={
        "code": "x_crop", "name": "X", "attributes": [{"key": "v", "label": "V", "type": "choice"}]})
    assert no_choices.status_code == 422
    dupes = client.post("/api/catalogue/crops", headers=h, json={
        "code": "y_crop", "name": "Y", "attributes": [{"key": "v", "label": "V"}, {"key": "v", "label": "V2"}]})
    assert dupes.status_code == 422
    bad_code = client.post("/api/catalogue/crops", headers=h, json={"code": "Bad Code", "name": "Z"})
    assert bad_code.status_code == 422


def test_update_and_deactivate_crop(client, as_role):
    h = as_role("programme_admin")
    cid = client.post("/api/catalogue/crops", headers=h, json={"code": "jute", "name": "Jute"}).json()["id"]
    r = client.patch(f"/api/catalogue/crops/{cid}", headers=h, json={"name": "Jute (white)", "is_active": False})
    assert r.status_code == 200 and r.json()["is_active"] is False
    assert all(c["code"] != "jute" for c in client.get("/api/catalogue/crops", headers=h).json())
    everything = client.get("/api/catalogue/crops?include_inactive=true", headers=h).json()
    assert any(c["code"] == "jute" for c in everything)


def test_practice_type_rules(client, as_role):
    h = as_role("programme_admin")
    client.post("/api/catalogue/install-defaults", headers=h)
    no_unit = client.post("/api/catalogue/practice-types", headers=h, json={
        "code": "lime", "name": "Liming", "requires_quantity": True})
    assert no_unit.status_code == 422
    unknown_crop = client.post("/api/catalogue/practice-types", headers=h, json={
        "code": "lime", "name": "Liming", "crop_codes": ["kiwi"]})
    assert unknown_crop.status_code == 422 and unknown_crop.json()["code"] == "UNKNOWN_CROP"
    ok = client.post("/api/catalogue/practice-types", headers=h, json={
        "code": "lime", "name": "Liming", "unit": "t", "requires_quantity": True, "crop_codes": ["coffee"]})
    assert ok.status_code == 201, ok.text
    for_rice = client.get("/api/catalogue/practice-types?crop_code=rice", headers=h).json()
    codes = {p["code"] for p in for_rice}
    assert "awd_irrigation" in codes and "lime" not in codes and "compost" in codes
    pid = ok.json()["id"]
    bad = client.patch(f"/api/catalogue/practice-types/{pid}", headers=h, json={"unit": None})
    assert bad.status_code == 422


def test_catalogue_permissions(client, as_role):
    for role in ("field_collector", "mrv_analyst", "farmer"):
        r = client.post("/api/catalogue/crops", headers=as_role(role), json={"code": "oats", "name": "Oats"})
        assert r.status_code == 403, role
        assert client.post("/api/catalogue/install-defaults", headers=as_role(role)).status_code == 403
    # any signed-in user can read
    assert client.get("/api/catalogue/crops", headers=as_role("field_collector")).status_code == 200
    assert client.get("/api/catalogue/practice-types", headers=as_role("lab_technician")).status_code == 200
    assert client.get("/api/catalogue/crops").status_code == 401


def test_catalogue_tenant_isolation(client, as_role):
    h = as_role("programme_admin")
    cid = client.post("/api/catalogue/crops", headers=h, json={"code": "sesame", "name": "Sesame"}).json()["id"]
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/catalogue/crops/{cid}", headers=other).status_code == 404
    assert client.patch(f"/api/catalogue/crops/{cid}", headers=other, json={"name": "Hijack"}).status_code == 404
    assert client.get("/api/catalogue/crops", headers=other).json() == []
    # the same code can exist in another organisation
    assert client.post("/api/catalogue/crops", headers=other, json={"code": "sesame", "name": "Til"}).status_code == 201
