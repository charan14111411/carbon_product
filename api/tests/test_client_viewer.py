from tests.conftest import login, make_user


def test_client_viewer_is_limited_to_result_endpoints(client, org):
    h = login(client, make_user(org, "client_viewer"))
    assert client.get("/api/auth/me", headers=h).status_code == 200
    assert client.get("/api/portfolio/overview", headers=h).status_code == 200
    assert client.get("/api/projects", headers=h).status_code == 200
    for path in ("/api/farmers", "/api/fields", "/api/grievances", "/api/users", "/api/audit", "/api/practices"):
        r = client.get(path, headers=h)
        assert r.status_code == 403, (path, r.status_code)
    assert client.post("/api/programmes", headers=h, json={}).status_code == 403
