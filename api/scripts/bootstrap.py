"""Set up a database by hand, without the demo story. Run from the api folder:

    ..\\.venv\\Scripts\\python -m scripts.bootstrap empty-db
        Drops every app table in the database from DATABASE_URL and rebuilds the empty schema with the migrations.

    ..\\.venv\\Scripts\\python -m scripts.bootstrap create-org --name "My Programme Org" --slug my-org \\
        --admin-email admin@myorg.in --admin-name "Asha Rao" --password "Choose-A-Long-One-1"
        Creates the first organisation and its platform administrator. There is no public sign-up, so this is
        the only way in; the administrator then creates every other user in the app (Administration -> Users).

    ..\\.venv\\Scripts\\python -m scripts.bootstrap link-farmer --email farmer1@myorg.in --farmer-code F-00001
        Gives a farmer login access to that farmer's own portal. Create the user (role "farmer") and the farmer
        record in the app first. There is no screen for this link yet.
"""

from __future__ import annotations

import argparse
import sys

from sqlalchemy import func, select


def _models():
    from app.main import load_models

    load_models()


def empty_db(_: argparse.Namespace) -> None:
    from app.core import migrate
    from app.core.config import get_settings

    url = get_settings().database_url
    host = url.split("@")[-1].split("?")[0]
    answer = input(f"This deletes ALL app data in {host}. Type YES to continue: ")
    if answer.strip() != "YES":
        print("Cancelled.")
        return
    _models()
    migrate.drop_all_tables()
    migrate.upgrade_head()
    print("Empty schema ready (migrations applied). Next: create-org.")


def create_org(a: argparse.Namespace) -> None:
    from app.core import db as dbmod
    from app.core.security import hash_password
    from app.modules.identity.models import Organization, User

    if len(a.password) < 10:
        sys.exit("Use a password of at least 10 characters.")
    _models()
    with dbmod.session_factory()() as s:
        if s.scalar(select(Organization).where(Organization.slug == a.slug)):
            sys.exit(f"An organisation with slug '{a.slug}' already exists.")
        if s.scalar(select(User).where(func.lower(User.email) == a.admin_email.lower())):
            sys.exit(f"A user with email {a.admin_email} already exists.")
        org = Organization(name=a.name, slug=a.slug, country=a.country, default_language="en")
        s.add(org)
        s.flush()
        s.add(User(org_id=org.id, email=a.admin_email.lower(), full_name=a.admin_name, role="platform_admin",
                   password_hash=hash_password(a.password), language="en", scope={}))
        s.commit()
    print(f"Organisation '{a.name}' and administrator {a.admin_email} created. Sign in at http://localhost:4200.")


def link_farmer(a: argparse.Namespace) -> None:
    from app.core import db as dbmod
    from app.modules.farmers.models import Farmer
    from app.modules.identity.models import User

    _models()
    with dbmod.session_factory()() as s:
        user = s.scalar(select(User).where(func.lower(User.email) == a.email.lower()))
        if user is None or user.role != "farmer":
            sys.exit(f"No user with role 'farmer' and email {a.email}. Create it in Administration -> Users first.")
        farmer = s.scalar(select(Farmer).where(Farmer.org_id == user.org_id, Farmer.code == a.farmer_code))
        if farmer is None:
            sys.exit(f"No farmer with code {a.farmer_code} in that user's organisation.")
        user.scope = {**(user.scope or {}), "farmer_id": str(farmer.id)}
        farmer.user_id = user.id
        s.commit()
    print(f"{a.email} now opens the farmer portal for {farmer.code} ({farmer.full_name}).")


def main() -> None:
    p = argparse.ArgumentParser(prog="python -m scripts.bootstrap", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("empty-db", help="drop all app tables and rebuild the empty schema").set_defaults(fn=empty_db)
    c = sub.add_parser("create-org", help="create the first organisation and its administrator")
    c.add_argument("--name", required=True)
    c.add_argument("--slug", required=True, help="short id, e.g. my-org")
    c.add_argument("--country", default="India")
    c.add_argument("--admin-email", required=True)
    c.add_argument("--admin-name", required=True)
    c.add_argument("--password", required=True)
    c.set_defaults(fn=create_org)
    f = sub.add_parser("link-farmer", help="link a farmer login to a farmer record")
    f.add_argument("--email", required=True)
    f.add_argument("--farmer-code", required=True)
    f.set_defaults(fn=link_farmer)
    args = p.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
