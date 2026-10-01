from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user


def test_household_membership_rules(client, org, as_role):
    w = fx.world(org, n_farmers=4)
    f0, f1, f2, f3 = (str(x) for x in w["farmer_ids"])
    h = as_role("programme_admin")
    assert client.post("/api/households", headers=as_role("field_collector"),
                       json={"head_farmer_id": f0}).status_code == 403
    both = client.post("/api/households", headers=h, json={
        "head_farmer_id": f0, "members": [{"farmer_id": f1, "name": "Also a name", "relation": "son"}]})
    assert both.status_code == 422
    r = client.post("/api/households", headers=h, json={
        "head_farmer_id": f0, "name": "Gowda family",
        "members": [{"farmer_id": f1, "relation": "spouse"}, {"name": "Kavya", "relation": "daughter"}]})
    assert r.status_code == 201, r.text
    hh = r.json()
    assert hh["code"] == "HH-00001" and hh["village"] == "Hosahalli" and hh["member_count"] == 3
    assert {m["relation"] for m in hh["members"]} == {"head", "spouse", "daughter"}

    taken = client.post("/api/households", headers=h, json={"head_farmer_id": f1})
    assert taken.status_code == 409 and taken.json()["code"] == "FARMER_IN_HOUSEHOLD"
    other = client.post("/api/households", headers=h, json={"head_farmer_id": f2}).json()
    moved = client.post(f"/api/households/{other['id']}/members", headers=h, json={"farmer_id": f1, "relation": "son"})
    assert moved.status_code == 409 and moved.json()["code"] == "FARMER_IN_HOUSEHOLD"
    dup = client.post(f"/api/households/{hh['id']}/members", headers=h, json={"farmer_id": f1, "relation": "son"})
    assert dup.status_code == 409 and dup.json()["code"] == "ALREADY_MEMBER"

    head = next(m for m in hh["members"] if m["relation"] == "head")
    assert client.delete(f"/api/households/{hh['id']}/members/{head['id']}", headers=h).json()["code"] == "HEAD_REQUIRED"
    new_head = client.patch(f"/api/households/{hh['id']}", headers=h, json={"head_farmer_id": f1}).json()
    rel = {m["farmer_id"]: m["relation"] for m in new_head["members"] if m["farmer_id"]}
    assert new_head["head_farmer_id"] == f1 and rel == {f0: "other", f1: "head"}
    old = next(m for m in new_head["members"] if m["farmer_id"] == f0)
    left = client.delete(f"/api/households/{hh['id']}/members/{old['id']}", headers=h).json()
    assert left["member_count"] == 2
    joined = client.post(f"/api/households/{other['id']}/members", headers=h, json={"farmer_id": f0, "relation": "parent"})
    assert joined.status_code == 201  # free again after leaving

    assert client.get(f"/api/farmers/{f1}/household", headers=h).json()["id"] == hh["id"]
    assert client.get(f"/api/farmers/{f3}/household", headers=h).status_code == 404
    assert [x["code"] for x in client.get(f"/api/households?farmer_id={f0}", headers=h).json()] == [other["code"]]
    assert len(client.get("/api/households?village=hosahalli", headers=h).json()) == 2

    viewer = login(client, make_user(org, "client_viewer"))
    masked = client.get(f"/api/households/{hh['id']}", headers=viewer).json()
    assert masked["name"] == "" and masked["head"]["phone"] is None
    assert masked["head"]["name"] == f"Farmer {masked['head']['code']}"
    assert {m["name"] for m in masked["members"]} == {masked["head"]["name"], "Household member"}
    assert client.patch(f"/api/households/{hh['id']}", headers=viewer, json={"name": "x"}).status_code == 403
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/households/{hh['id']}", headers=rival).status_code == 404
    assert client.post("/api/households", headers=rival, json={"head_farmer_id": f3}).status_code == 404
    actions = {a["action"] for a in client.get("/api/audit", headers=h).json()}
    assert {"household.create", "household.update", "household.member_add", "household.member_remove"} <= actions


def test_farmer_reads_only_own_household(client, org, as_role):
    w = fx.world(org, n_farmers=2)
    f0, f1 = (str(x) for x in w["farmer_ids"])
    hh = client.post("/api/households", headers=as_role("programme_admin"),
                     json={"head_farmer_id": f0, "members": [{"name": "Kavya", "relation": "daughter"}]}).json()
    me = login(client, make_user(org, "farmer", scope={"farmer_id": f0}))
    r = client.get(f"/api/farmers/{f0}/household", headers=me)
    assert r.status_code == 200 and r.json()["id"] == hh["id"]
    assert client.get(f"/api/farmers/{f1}/household", headers=me).status_code == 404
    assert client.get(f"/api/households/{hh['id']}", headers=me).status_code == 403
