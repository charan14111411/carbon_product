import os
import tempfile
import uuid
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["ENVIRONMENT"] = "test"
os.environ["EVIDENCE_DIR"] = str(Path(tempfile.mkdtemp(prefix="vc-evidence-")))

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
    dbmod.configure("sqlite://")
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
