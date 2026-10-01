import os
import tempfile
import uuid
from pathlib import Path

# Tests run on in-memory SQLite. Set TEST_DATABASE_URL to run them on a scratch SQL Server database instead
# (never your real one: every test drops and recreates all tables).
TEST_DB = os.environ.get("TEST_DATABASE_URL", "sqlite://")
os.environ["DATABASE_URL"] = TEST_DB
os.environ["ENVIRONMENT"] = "test"
os.environ["EVIDENCE_DIR"] = str(Path(tempfile.mkdtemp(prefix="vc-evidence-")))
# Tests never call public APIs: pin the outside-data providers to the simulations even if api/.env switches them.
for _env, _sim in (("VC_WEATHER_PROVIDER", "simulated_nasa_power"), ("VC_SOIL_PROVIDER", "simulated_soilgrids"),
                   ("VC_SATELLITE_PROVIDER", "simulated_sentinel"), ("VC_TERRAIN_PROVIDER", "simulated_dem")):
    os.environ[_env] = _sim
# Never the live Varsapradaya / FarmFuture API either (its recorded test number belongs to a real customer).
os.environ["VC_MEMBER_DIRECTORY"] = "simulated"
os.environ["VC_DEVICE_PROVIDER"] = "simulated"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.core import db as dbmod  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.main import app, load_models  # noqa: E402
from app.modules.identity.models import Organization, User  # noqa: E402

PASSWORD = "Test-Password-123"
ROLES = [
    "platform_admin", "programme_admin", "mrv_analyst", "methodology_owner", "field_collector",
    "lab_technician", "lab_manager", "verifier", "buyer", "finance_maker", "finance_checker", "farmer",
]


@pytest.fixture()
def client():
    dbmod.configure(TEST_DB)
    load_models()
    dbmod.Base.metadata.create_all(dbmod.engine())
    with TestClient(app) as c:
        yield c
    dbmod.Base.metadata.drop_all(dbmod.engine())


def make_org(name: str = "Demo Org") -> uuid.UUID:
    with dbmod.session_factory()() as s:
        org = Organization(name=name, slug=f"{name.lower().replace(' ', '-')}-{uuid.uuid4().hex[:6]}")
        s.add(org)
        s.commit()
        return org.id


def make_user(org_id: uuid.UUID, role: str, email: str | None = None, scope: dict | None = None) -> str:
    email = email or f"{role}-{uuid.uuid4().hex[:6]}@example.com"
    with dbmod.session_factory()() as s:
        s.add(User(org_id=org_id, email=email, full_name=role.replace("_", " ").title(), role=role,
                   password_hash=hash_password(PASSWORD), scope=scope or {}))
        s.commit()
    return email


def login(client: TestClient, email: str) -> dict:
    r = client.post("/api/auth/login", json={"email": email, "password": PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


@pytest.fixture()
def org(client):
    return make_org()


@pytest.fixture()
def as_role(client, org):
    """as_role('programme_admin') -> auth headers for a fresh user of that role."""
    cache: dict[str, dict] = {}

    def _get(role: str, fresh: bool = False) -> dict:
        if fresh or role not in cache:
            cache[role] = login(client, make_user(org, role))
        return cache[role]

    return _get
