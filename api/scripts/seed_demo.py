"""Build a complete, realistic demo dataset by driving the real API.

Run from the ``api`` directory::

    ../.venv/Scripts/python -m scripts.seed_demo --reset

Only the organisation and the user accounts are written directly (there is no public
sign-up). Everything else goes through the HTTP API in-process (``TestClient``), signed in
as the person who would really do each step, so every business rule — four-eyes approval,
quality checks, fail-closed methodology rules — is exercised exactly as in production.

``--reset`` drops and recreates every table first. Without it the script refuses to run
if the demo organisation already exists. It never runs against a production environment.
"""

from __future__ import annotations

import argparse
import io
import math
import random
import sys
import time
from collections import Counter, defaultdict
from datetime import UTC, date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from app.core.config import API_ROOT, get_settings

PASSWORD = "Demo-Pass-2026!"
ORG_NAME = "Varsapradaya Agri Carbon"
ORG_SLUG = "varsapradaya"
WEB_URL = "http://localhost:4200"
SEED = 20221101
IST = timezone(timedelta(hours=5, minutes=30))
PERIOD_LABEL = "2022–2026"

ACCOUNTS: list[tuple[str, str, str]] = [
    ("admin@example.com", "platform_admin", "Anita Rao"),
    ("programme@example.com", "programme_admin", "Karthik Gowda"),
    ("scientist@example.com", "methodology_owner", "Dr. Meera Iyer"),
    ("scientist2@example.com", "methodology_owner", "Dr. Suresh Hegde"),
    ("analyst@example.com", "mrv_analyst", "Divya Shetty"),
    ("collector@example.com", "field_collector", "Ravi Kumar"),
    ("collector2@example.com", "field_collector", "Manjunath B."),
    ("labtech@example.com", "lab_technician", "Lakshmi Nair"),
    ("labmanager@example.com", "lab_manager", "Arun Prakash"),
    ("buyer@example.com", "buyer", "Sarah Thomas"),
    ("finance@example.com", "finance_maker", "Nisha Menon"),
    ("approver@example.com", "finance_checker", "Rahul Desai"),
    ("farmer@example.com", "farmer", "Basavaraj Patil"),
]

# Short handles used throughout the story.
ADMIN, PROG, SCI, SCI2, ANALYST = ("admin@example.com", "programme@example.com", "scientist@example.com",
                                   "scientist2@example.com", "analyst@example.com")
COL1, COL2, LABTECH, LABMGR = ("collector@example.com", "collector2@example.com", "labtech@example.com",
                               "labmanager@example.com")
BUYER, FIN, APPROVER, FARMER = ("buyer@example.com", "finance@example.com", "approver@example.com",
                                "farmer@example.com")

# name, village, district, crop, number of fields, FPO key, Varsapradaya member?
FARMERS: list[tuple[str, str, str, str, int, str | None, bool]] = [
    ("Chengappa K. M.", "Madikeri", "Kodagu", "coffee", 2, "kodagu", True),
    ("Poovamma Ponnappa", "Virajpet", "Kodagu", "coffee", 2, "kodagu", False),
    ("Muthanna B. S.", "Virajpet", "Kodagu", "coffee", 2, "kodagu", True),
    ("Somaiah P. K.", "Somwarpet", "Kodagu", "coffee", 2, "kodagu", False),
    ("Kaveramma Uthappa", "Madikeri", "Kodagu", "coffee", 2, "kodagu", True),
    ("Nanjappa C. B.", "Somwarpet", "Kodagu", "coffee", 1, "kodagu", False),
    ("Belliappa M. D.", "Madikeri", "Kodagu", "coffee", 1, "kodagu", False),
    ("Basavaraj Patil", "Arsikere", "Hassan", "maize", 2, None, True),
    ("Channegowda H. R.", "Belur", "Hassan", "maize", 2, None, False),
    ("Lakshmamma Siddegowda", "Belur", "Hassan", "maize", 2, None, True),
    ("Mallikarjuna S.", "Arsikere", "Hassan", "maize", 2, None, False),
    ("Puttaswamy K.", "Belur", "Hassan", "maize", 2, None, False),
    ("Shivalingaiah M.", "Maddur", "Mandya", "rice", 2, "mandya", True),
    ("Gowramma Ningegowda", "Maddur", "Mandya", "rice", 2, "mandya", False),
    ("Krishnegowda B.", "Malavalli", "Mandya", "rice", 2, "mandya", True),
    ("Siddaraju T.", "Malavalli", "Mandya", "rice", 2, "mandya", False),
    ("Jayamma Boregowda", "Maddur", "Mandya", "rice", 1, "mandya", True),
    ("Ramesh Honnegowda", "Malavalli", "Mandya", "rice", 1, "mandya", False),
]
FAIL_UPI_FARMER = "Siddaraju T."        # UPI id contains "fail" -> simulated failed payout
NO_PROFILE_FARMER = "Ramesh Honnegowda"  # no payment details -> payout on hold

REGIONS = {  # crop: (base lat, base lon, stratum code, stratum name, elevation range m, soil type)
    "coffee": (12.42, 75.74, "S-COF", "Coffee — Kodagu uplands", (880, 1150), "red laterite"),
    "maize": (13.00, 76.10, "S-MAZ", "Maize — Hassan plains", (880, 980), "red sandy loam"),
    "rice": (12.52, 76.90, "S-RIC", "Rice — Mandya irrigated", (640, 700), "alluvial clay loam"),
}
FIELD_NAMES = {
    "coffee": ["Upper block", "Lower block", "Stream-side block", "Silver-oak block"],
    "maize": ["North plot", "Tank-side plot", "Road-side plot", "South plot"],
    "rice": ["Canal field", "Low field", "Tank-bed field", "Temple field"],
}


class SeedError(RuntimeError):
    pass


# ====================================================================== output helpers
_step = {"n": 0}
_notes: list[str] = []


def step(title: str) -> None:
    _step["n"] += 1
    print(f"\n[{_step['n']:>2}] {title}", flush=True)


def log(msg: str) -> None:
    print(f"     - {msg}", flush=True)


def note(msg: str) -> None:
    _notes.append(msg)
    log(f"NOTE: {msg}")


# ====================================================================== file makers
def jpeg_bytes(rng: random.Random, label: str) -> bytes:
    """A small but valid JPEG (soil-coloured frame with a label)."""
    try:
        from PIL import Image, ImageDraw

        base = (rng.randint(90, 150), rng.randint(55, 95), rng.randint(25, 55))
        img = Image.new("RGB", (120, 90), base)
        d = ImageDraw.Draw(img)
        for _ in range(12):
            x, y = rng.randint(0, 110), rng.randint(0, 80)
            shade = tuple(max(0, min(255, c + rng.randint(-30, 30))) for c in base)
            d.ellipse([x, y, x + rng.randint(4, 14), y + rng.randint(4, 14)], fill=shade)
        d.text((4, 76), label[:20], fill=(240, 240, 240))
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=70)
        return buf.getvalue()
    except ImportError:  # minimal JPEG markers; still accepted as image/jpeg evidence
        return b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00" + label.encode() + b"\xff\xd9"


def pdf_bytes(title: str, lines: list[str]) -> bytes:
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4, invariant=1)
    c.setTitle(title)
    y = 800
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, title)
    c.setFont("Helvetica", 9)
    y -= 14
    c.drawString(50, y, "DEMO DOCUMENT — generated for the Varsapradaya Carbon demo dataset")
    y -= 22
    c.setFont("Helvetica", 10)
    for line in lines:
        c.drawString(50, y, line)
        y -= 14
        if y < 60:
            c.showPage()
            c.setFont("Helvetica", 10)
            y = 800
    c.showPage()
    c.save()
    return buf.getvalue()


# ====================================================================== API client
class Api:
    def __init__(self, client) -> None:
        self.c = client
        self.tokens: dict[str, str] = {}
        self.calls = 0

    def login(self, email: str) -> None:
        r = self.c.post("/api/auth/login", json={"email": email, "password": PASSWORD})
        if r.status_code != 200:
            raise SeedError(f"Sign-in failed for {email}: {r.status_code} {r.text}")
        body = r.json()
        if body["status"] != "ok":  # second factor enforced: enrol TOTP the way the app does
            import pyotp

            challenge = body["challenge"]
            setup = self.c.post("/api/auth/mfa/setup", json={"challenge": challenge}).json()
            code = pyotp.TOTP(setup["secret"]).now()
            body = self.c.post("/api/auth/mfa/verify", json={"challenge": challenge, "code": code}).json()
        self.tokens[email] = body["access_token"]

    def req(self, who: str | None, method: str, path: str, *, json: Any = None, files: Any = None,
            data: Any = None, headers: dict | None = None, ok: tuple[int, ...] = (200, 201)) -> Any:
        h = dict(headers or {})
        if who is not None:
            if who not in self.tokens:
                self.login(who)
            h["Authorization"] = f"Bearer {self.tokens[who]}"
        self.calls += 1
        r = self.c.request(method, "/api" + path, json=json, files=files, data=data, headers=h)
        if r.status_code not in ok:
            raise SeedError(f"{who or 'anonymous'} {method} {path} -> {r.status_code}\n{r.text[:3000]}")
        if not r.content:
            return None
        try:
            return r.json()
        except ValueError:
            return r.content

    def get(self, who, path, **kw):
        return self.req(who, "GET", path, **kw)

    def post(self, who, path, **kw):
        return self.req(who, "POST", path, **kw)

    def put(self, who, path, **kw):
        return self.req(who, "PUT", path, **kw)

    def patch(self, who, path, **kw):
        return self.req(who, "PATCH", path, **kw)

    def upload(self, who: str, filename: str, content: bytes, mime: str, kind: str,
               lat: float | None = None, lon: float | None = None, entity_type: str | None = None) -> str:
        data = {"kind": kind}
        if lat is not None and lon is not None:
            data.update(latitude=f"{lat:.7f}", longitude=f"{lon:.7f}")
        if entity_type:
            data["entity_type"] = entity_type
        return self.post(who, "/evidence", files={"file": (filename, content, mime)}, data=data)["id"]


# ====================================================================== geometry helpers
def offset(lat: float, lon: float, north_m: float, east_m: float) -> tuple[float, float]:
    return (lat + north_m / 111_320.0, lon + east_m / (111_320.0 * math.cos(math.radians(lat))))


def near_site(rng: random.Random, lat: float, lon: float, boundary: dict) -> tuple[float, float]:
    """A GPS fix 0.5–3 m from the planned site that is still inside the field."""
    from app.core import geo

    for attempt in range(40):
        dist = rng.uniform(0.5, 3.0) * (0.85 ** attempt)
        bearing = rng.uniform(0, 2 * math.pi)
        la, lo = offset(lat, lon, dist * math.cos(bearing), dist * math.sin(bearing))
        la, lo = round(la, 7), round(lo, 7)
        if geo.contains(boundary, la, lo):
            return la, lo
    return lat, lon


# ====================================================================== database bootstrap
def bootstrap(reset: bool) -> dict[str, Any]:
    from sqlalchemy import select

    from app.core import db as dbmod
    from app.core.security import hash_password
    from app.main import load_models
    from app.modules.identity.models import Organization, User

    load_models()
    engine = dbmod.engine()
    if reset:
        step("Resetting the database (drop and recreate every table)")
        dbmod.Base.metadata.drop_all(engine)
        dbmod.Base.metadata.create_all(engine)
        log(f"{len(dbmod.Base.metadata.tables)} tables recreated")
    else:
        dbmod.Base.metadata.create_all(engine)
        with dbmod.session_factory()() as s:
            if s.scalar(select(Organization).where(Organization.slug == ORG_SLUG)):
                raise SeedError(f"The demo organisation '{ORG_SLUG}' already exists. Re-run with --reset to rebuild it.")

    step("Creating the organisation and user accounts (direct insert: there is no public sign-up)")
    ids: dict[str, Any] = {}
    with dbmod.session_factory()() as s:
        taken = [e for e, _, _ in ACCOUNTS if s.scalar(select(User).where(User.email == e))]
        if taken:
            raise SeedError(f"These accounts already exist in another organisation: {', '.join(taken)}. Use --reset.")
        org = Organization(name=ORG_NAME, slug=ORG_SLUG, country="India", default_language="en")
        s.add(org)
        s.flush()
        pw = hash_password(PASSWORD)
        for email, role, name in ACCOUNTS:
            u = User(org_id=org.id, email=email, full_name=name, role=role, password_hash=pw,
                     language="kn" if role == "farmer" else "en", scope={})
            s.add(u)
            s.flush()
            ids[email] = str(u.id)
        s.commit()
        ids["org_id"] = str(org.id)
    log(f"organisation '{ORG_NAME}' ({ORG_SLUG}) and {len(ACCOUNTS)} accounts")
    return ids


def link_farmer_user(farmer_id: str, user_id: str) -> None:
    """Farmer.user_id has no API (account linking is an admin/database task)."""
    import uuid

    from app.core import db as dbmod
    from app.modules.farmers.models import Farmer

    with dbmod.session_factory()() as s:
        s.get(Farmer, uuid.UUID(farmer_id)).user_id = uuid.UUID(user_id)
        s.commit()


# ====================================================================== the story
class Story:
    def __init__(self, api: Api, uid: dict[str, Any]) -> None:
        self.api = api
        self.uid = uid
        self.rng = random.Random(SEED)
        self.today = date.today()
        self.farmers: list[dict] = []           # api rows + our metadata
        self.fields: list[dict] = []            # api rows + crop, farmer
        self.field_by_id: dict[str, dict] = {}
        self.strata: dict[str, dict] = {}
        self.counts: Counter = Counter()
        self.site_props: dict[str, dict] = {}   # site_id -> baseline lab values per layer
        self.site_field: dict[str, str] = {}
        self.decliners: set[str] = set()

    # ------------------------------------------------------------------ 1–2 catalogue, programme, project
    def catalogue_and_programme(self) -> None:
        a = self.api
        step("Catalogue defaults")
        out = a.post(PROG, "/catalogue/install-defaults")
        log(f"{len(out['crops_added'])} crops and {len(out['practice_types_added'])} practice types installed")

        step("Programme and project")
        prog = a.post(PROG, "/programmes", json={
            "code": "KRS", "name": "Kaveri Regenerative Soils", "region": "Karnataka, India",
            "description": "Regenerative soil-carbon programme for smallholder coffee, maize and paddy growers "
                           "in the Kaveri basin (Kodagu, Hassan and Mandya districts).",
            "eligible_crops": ["coffee", "maize", "rice"], "start_date": "2022-10-01", "end_date": "2032-09-30",
            "commercial_terms": {"lookback_years": 10},
        })
        a.post(PROG, f"/programmes/{prog['id']}/status", json={"status": "active", "reason": "Programme launched"})
        proj = a.post(PROG, "/projects", json={
            "programme_id": prog["id"], "code": "KRS-P1", "name": "Kaveri Soils — Phase 1",
            "methodology_code": "VM0042", "methodology_version": "2.2", "baseline_start": "2022-10-01",
            "crediting_start": "2022-11-01", "crediting_end": "2026-10-31",
        })
        a.post(PROG, f"/projects/{proj['id']}/status", json={"status": "active", "reason": "Validated design"})
        self.programme, self.project = prog, proj
        self.pid = proj["id"]
        log(f"programme {prog['code']} and project {proj['code']} active")

    # ------------------------------------------------------------------ 3 rule pack
    def rule_pack(self) -> None:
        from app.modules.methodology.definitions import GROUPS, RULES

        a = self.api
        step("Methodology rule pack (entered by one scientist, approved by another)")
        pack = a.post(SCI, "/rule-packs", json={
            "methodology_code": "VM0042", "methodology_version": "2.2", "title": "Kaveri Soils rule pack",
            "source_url": "https://verra.org/methodologies/vm0042-methodology-for-improved-agricultural-land-management-v2-2/",
        })
        group_no = {g: i for i, g in enumerate(GROUPS, start=1)}
        within: Counter = Counter()
        entered = 0
        for r in RULES:
            if r.example is None:
                continue
            if r.key == "esm_reference_mass_t_ha":
                continue  # only needed for equivalent-soil-mass; this pack uses fixed depth
            value = "fixed_depth" if r.key == "stock_method" else r.example
            within[r.group] += 1
            a.put(SCI, f"/rule-packs/{pack['id']}/rules/{r.key}", json={
                "value": value,
                "source_document": "DEMO — illustrative value. Replace with VM0042 v2.2 text before real use",
                "source_section": f"§8.{group_no[r.group]}.{within[r.group]}",
                "source_page": str(30 + 3 * group_no[r.group] + within[r.group]),
                "notes": f"{r.label}: demo value taken from the definition example.",
            })
            entered += 1
        # Emission factors: try the rule key the emissions estimate reads; the API only accepts defined rules.
        ef = a.put(SCI, f"/rule-packs/{pack['id']}/rules/emission_factors", ok=(200, 404), json={
            "value": {"synthetic_n_kg": 0.0059},
            "source_document": "DEMO — illustrative value. Replace with VM0042 v2.2 text before real use",
            "source_section": "§8.5.9", "source_page": "58"})
        if isinstance(ef, dict) and ef.get("code") == "NOT_FOUND":
            note("Emission factors can't be entered in a rule pack (no 'emission_factors' rule definition); "
                 "skipped, so the emissions-estimate screen reports the factor as missing (fail closed).")
        ready = a.get(SCI, f"/rule-packs/{pack['id']}/readiness")
        if not ready["can_approve"]:
            raise SeedError(f"Rule pack not ready: {ready}")
        a.post(SCI2, f"/rule-packs/{pack['id']}/approve")
        a.post(SCI, f"/projects/{self.pid}/rule-pack", json={"pack_id": pack["id"]})
        self.pack = pack
        log(f"{entered} rules entered by Dr. Meera Iyer, approved by Dr. Suresh Hegde, assigned to KRS-P1")

    # ------------------------------------------------------------------ 4 FPOs, farmers, consent
    def farmers_and_consent(self) -> None:
        a, rng = self.api, self.rng
        step("FPOs, farmers, member lookup")
        fpos = {
            "kodagu": a.post(PROG, "/fpos", json={
                "name": "Kodagu Coffee Growers FPO", "registration_no": "FPO-KA-KDG-2019-0112", "district": "Kodagu",
                "state": "Karnataka", "contact_name": "B. K. Subbaiah", "contact_phone": "9448012346"}),
            "mandya": a.post(PROG, "/fpos", json={
                "name": "Mandya Paddy Producers FPO", "registration_no": "FPO-KA-MND-2018-0457", "district": "Mandya",
                "state": "Karnataka", "contact_name": "H. S. Nagaraju", "contact_phone": "9845023418"}),
        }
        members = 0
        for name, village, district, crop, n_fields, fpo, member in FARMERS:
            digits = rng.choice("6789") + "".join(rng.choice("0123456789") for _ in range(8))
            last = rng.choice("02468" if member else "13579")
            phone = digits + last
            f = a.post(PROG, "/farmers", json={
                "full_name": name, "phone": phone, "village": village, "district": district, "state": "Karnataka",
                "language": "kn", "fpo_id": fpos[fpo]["id"] if fpo else None,
                "meta": {"landholding_class": "small" if n_fields == 1 else "marginal-to-small",
                         "primary_crop": crop},
            })
            look = a.post(PROG, "/farmers/member-lookup", json={"phone": phone})
            member_farms = []
            if look["is_member"]:
                look = a.post(PROG, "/farmers/member-lookup", json={"phone": phone, "farmer_id": f["id"]})
                member_farms = look["farms"]
                members += 1
            self.farmers.append({**f, "crop": crop, "n_fields": n_fields, "member_farms": member_farms})
        self.fpos = fpos
        self.farmer_by_name = {f["full_name"]: f for f in self.farmers}
        log(f"{len(fpos)} FPOs, {len(self.farmers)} farmers, {members} linked to Varsapradaya membership")

        # the farmer account signs in as Basavaraj Patil
        basavaraj = self.farmer_by_name["Basavaraj Patil"]
        a.patch(ADMIN, f"/users/{self.uid[FARMER]}", json={"scope": {"farmer_id": basavaraj["id"]}})
        link_farmer_user(basavaraj["id"], self.uid[FARMER])
        log("farmer@example.com linked to Basavaraj Patil (scope + Farmer.user_id)")

        step("Participation agreement (en + kn) signed by every farmer via OTP")
        tpl = a.post(PROG, "/agreement-templates", json={
            "programme_id": self.programme["id"], "code": "KRS-PA", "title": "Kaveri Regenerative Soils — "
            "participation agreement",
            "purposes": ["sampling", "data_use", "practice_monitoring", "share_with_buyers", "payments"],
            "body": {
                "en": ("I agree to take part in the Kaveri Regenerative Soils programme. I allow the programme team "
                       "to take soil samples from my enrolled fields, to use my farm and practice data to measure "
                       "soil carbon, to monitor the practices I report, to share anonymised results with credit "
                       "buyers, and to pay my share of carbon revenue to the account I provide. I can withdraw "
                       "any of these permissions at any time."),
                "kn": ("ನಾನು ಕಾವೇರಿ ಪುನರುತ್ಪಾದಕ ಮಣ್ಣು ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಭಾಗವಹಿಸಲು ಒಪ್ಪುತ್ತೇನೆ. ನನ್ನ ನೋಂದಾಯಿತ ಹೊಲಗಳಿಂದ ಮಣ್ಣಿನ "
                       "ಮಾದರಿ ತೆಗೆದುಕೊಳ್ಳಲು, ಮಣ್ಣಿನ ಇಂಗಾಲ ಅಳೆಯಲು ನನ್ನ ಕೃಷಿ ಮತ್ತು ಪದ್ಧತಿಗಳ ಮಾಹಿತಿಯನ್ನು ಬಳಸಲು, ನಾನು "
                       "ವರದಿ ಮಾಡುವ ಪದ್ಧತಿಗಳನ್ನು ಗಮನಿಸಲು, ಅನಾಮಧೇಯ ಫಲಿತಾಂಶಗಳನ್ನು ಖರೀದಿದಾರರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ಮತ್ತು "
                       "ಇಂಗಾಲ ಆದಾಯದ ನನ್ನ ಪಾಲನ್ನು ನಾನು ನೀಡುವ ಖಾತೆಗೆ ಪಾವತಿಸಲು ಅನುಮತಿ ನೀಡುತ್ತೇನೆ. ಈ ಅನುಮತಿಗಳನ್ನು "
                       "ಯಾವಾಗ ಬೇಕಾದರೂ ಹಿಂಪಡೆಯಬಹುದು."),
            },
        })
        a.post(PROG, f"/agreement-templates/{tpl['id']}/publish")
        for f in self.farmers:
            who = FARMER if f["full_name"] == "Basavaraj Patil" else PROG
            a.post(who, f"/farmers/{f['id']}/agreements", json={
                "template_id": tpl["id"], "language": "kn", "method": "otp", "otp_code": "123456"})
        self.counts["agreements"] = len(self.farmers)
        log(f"template KRS-PA v1 published; {len(self.farmers)} agreements signed (Basavaraj signed himself)")

    # ------------------------------------------------------------------ 5 farms, fields, land use, enrolment
    def land(self) -> None:
        a, rng = self.api, self.rng
        step("Farms, fields, land-use history and enrolment")
        by_crop: dict[str, list[dict]] = defaultdict(list)
        for f in self.farmers:
            by_crop[f["crop"]].append(f)
        for crop, farmers in by_crop.items():
            base_lat, base_lon, _code, _name, (elo, ehi), soil = REGIONS[crop]
            mapper = COL2 if crop == "rice" else COL1
            slot = 0
            for fr in farmers:
                ext = fr["member_farms"][0] if fr["member_farms"] else None
                surname = fr["full_name"].split()[0]
                farm_name = ext["name"] if ext else {
                    "coffee": f"{surname} Estate", "maize": f"{surname}'s dry-land farm",
                    "rice": f"{surname}'s paddy land"}[crop]
                farm = a.post(PROG, "/farms", json={
                    "farmer_id": fr["id"], "name": farm_name, "village": fr["village"], "district": fr["district"],
                    "state": "Karnataka", "external_farm_id": ext["external_farm_id"] if ext else None})
                fr["farm"] = farm
                for j in range(fr["n_fields"]):
                    row, col = divmod(slot, 4)
                    slot += 1
                    lat, lon = offset(base_lat, base_lon, (row - 1) * 700 + rng.uniform(-45, 45),
                                      (col - 1.5) * 700 + rng.uniform(-45, 45))
                    side = rng.uniform(140, 260)
                    from app.core.geo import square

                    attrs: dict[str, Any]
                    if crop == "coffee":
                        attrs = {"variety": "robusta" if fr["village"] == "Virajpet" or rng.random() < 0.3 else "arabica",
                                 "shade_type": rng.choice(["native_shade", "silver_oak", "mixed"]),
                                 "plant_age_years": rng.randint(8, 35)}
                    elif crop == "maize":
                        attrs = {"variety": rng.choice(["NAH-1137 (Hema)", "NK-6240", "Pioneer 3396"]),
                                 "season": "kharif"}
                    else:
                        attrs = {"water_regime": rng.choice(["continuous", "continuous", "awd"]),
                                 "variety": rng.choice(["MTU-1001", "KRH-4", "Jaya", "IR-64"])}
                    fld = a.post(mapper, "/fields", json={
                        "farm_id": farm["id"], "name": FIELD_NAMES[crop][j % 4],
                        "boundary": square(round(lat, 6), round(lon, 6), round(side, 1)), "crop_code": crop,
                        "crop_attributes": attrs, "soil_type": soil,
                        "elevation_m": round(rng.uniform(elo, ehi)),
                    })
                    fld.update(crop=crop, farmer_id=fr["id"], farmer_name=fr["full_name"], mapper=mapper)
                    self.fields.append(fld)
                    self.field_by_id[fld["id"]] = fld
        log(f"{len(self.farmers)} farms, {len(self.fields)} fields "
            f"({', '.join(f'{c}: {sum(1 for x in self.fields if x['crop'] == c)}' for c in REGIONS)}), "
            f"{sum(f['area_ha'] for f in self.fields):.1f} ha")

        with_evidence = 0
        for i, fld in enumerate(self.fields):
            ev = None
            if i % 5 == 0:
                ev = a.upload(fld["mapper"], f"RTC-{fld['code']}.pdf", pdf_bytes(
                    f"RTC (Pahani) extract — {fld['code']}", [
                        f"Field: {fld['code']} ({fld['name']}), {fld['area_ha']:.2f} ha",
                        f"Holder: {fld['farmer_name']}",
                        "Land use recorded 2012-2026: agricultural (cropland), no conversion from forest or wetland.",
                        f"Crop recorded: {fld['crop']}",
                        "Issued by: Revenue Department, Government of Karnataka (demo copy)",
                    ]), "application/pdf", "document", entity_type="land_use")
                with_evidence += 1
            a.post(fld["mapper"], f"/fields/{fld['id']}/land-use", json={
                "from_year": 2012, "to_year": 2026, "land_use": "cropland", "evidence_id": ev,
                "source": "RTC (Pahani) extract" if ev else "Farmer declaration, verified by field officer",
                "notes": f"Continuously under {fld['crop']} cultivation since at least 2012."})
        log(f"land-use 2012–2026 recorded for every field ({with_evidence} with an RTC extract PDF)")

        enrolled = 0
        for fld in self.fields:
            e = a.post(PROG, f"/projects/{self.pid}/enrolments", json={"field_id": fld["id"]})
            if e["status"] != "eligible":
                failed = [c["message"] for c in e["eligibility"]["checks"] if not c["passed"]]
                raise SeedError(f"Field {fld['code']} not eligible: {failed}")
            a.post(PROG, f"/projects/{self.pid}/enrolments/{e['id']}/confirm")
            enrolled += 1
        log(f"{enrolled} fields checked for eligibility and enrolled in KRS-P1")

    # ------------------------------------------------------------------ 6 strata
    def make_strata(self) -> None:
        step("Strata (zones) by crop")
        for crop, (_la, _lo, code, name, _e, _s) in REGIONS.items():
            ids = [f["id"] for f in self.fields if f["crop"] == crop]
            st = self.api.post(ANALYST, f"/projects/{self.pid}/strata", json={
                "code": code, "name": name, "field_ids": ids, "effective_from": "2022-10-01",
                "criteria": {"crop": crop, "district": {"coffee": "Kodagu", "maize": "Hassan", "rice": "Mandya"}[crop]},
            })
            st["crop"] = crop
            self.strata[crop] = st
            log(f"{code} {name}: {len(ids)} fields, {st['area_ha']:.1f} ha")

    # ------------------------------------------------------------------ lab
    def make_lab(self) -> None:
        a = self.api
        step("Laboratory")
        self.lab = a.post(PROG, "/labs", json={
            "code": "SHL-BLR", "name": "Soil Health Laboratory, Bengaluru", "accreditation": "NABL (ISO/IEC 17025)",
            "accreditation_valid_until": "2027-12-31", "city": "Bengaluru", "contact_email": "lab@example.com"})
        a.patch(ADMIN, f"/users/{self.uid[LABTECH]}", json={"scope": {"lab_id": self.lab["id"]}})
        log(f"{self.lab['name']} (NABL, valid to 2027-12-31); labtech@ scoped to it")

    # ------------------------------------------------------------------ 7–9 campaigns
    def campaign(self, *, code: str, name: str, kind: str, start: str, end: str, seed: int,
                 revisits: str | None, collect_from: date, collect_to: date, analysed_from: date,
                 analysed_to: date) -> dict:
        a, rng = self.api, self.rng
        step(f"Campaign {code} — {name}")
        body = {"code": code, "name": name, "kind": kind, "design": "paired", "planned_start": start,
                "planned_end": end, "depth_from_cm": 0, "depth_to_cm": 30, "placement_seed": seed}
        if revisits:
            body["revisits_campaign_id"] = revisits
        camp = a.post(ANALYST, f"/projects/{self.pid}/campaigns", json=body)
        floor = 5  # min_samples_per_stratum in the approved pack
        for crop, st in self.strata.items():
            n = min(12, max(floor, len(st["field_ids"])))
            plan = a.post(ANALYST, f"/campaigns/{camp['id']}/sample-plans", json={
                "stratum_id": st["id"], "n_required": n, "method": "manual",
                "justification": (f"One core per enrolled field in {st['code']} ({len(st['field_ids'])} fields), "
                                  f"at least the methodology floor of {floor} and capped at 12 for budget; prior "
                                  "pilot CV of ~18% gives an expected 90% CI within ±10% of the mean."
                                  if kind == "baseline" else
                                  f"Paired re-visit of every {st['code']} baseline site (VM0042 paired design)."),
            })
            a.post(SCI, f"/sample-plans/{plan['id']}/approve")
            log(f"plan {st['code']}: n={n} by Divya Shetty, approved by Dr. Meera Iyer")
        placed = a.post(ANALYST, f"/campaigns/{camp['id']}/place-points")
        points = a.get(ANALYST, f"/campaigns/{camp['id']}/points")
        split = {COL1: [p["id"] for p in points if p["stratum_code"] != "S-RIC"],
                 COL2: [p["id"] for p in points if p["stratum_code"] == "S-RIC"]}
        for who, ids in split.items():
            if ids:
                a.post(ANALYST, f"/campaigns/{camp['id']}/assign", json={"user_id": self.uid[who], "point_ids": ids})
        a.post(ANALYST, f"/campaigns/{camp['id']}/status", json={"status": "fieldwork"})
        log(f"{placed['points_created']} points placed (seed {placed['seed']}); "
            f"{len(split[COL1])} to Ravi Kumar, {len(split[COL2])} to Manjunath B.")

        # ---- field collection
        points = sorted(points, key=lambda p: (["S-COF", "S-MAZ", "S-RIC"].index(p["stratum_code"]), p["sequence"]))
        span = (collect_to - collect_from).days
        samples: list[dict] = []
        for i, p in enumerate(points):
            who = COL2 if p["stratum_code"] == "S-RIC" else COL1
            fld = self.field_by_id[p["field_id"]]
            self.site_field[p["site_id"]] = p["field_id"]
            day = collect_from + timedelta(days=round(i * span / max(1, len(points) - 1)))
            collected = datetime(day.year, day.month, day.day, 8, 30, tzinfo=IST) + timedelta(
                minutes=75 * (i % 5) + rng.randint(0, 20))
            lat, lon = near_site(rng, p["latitude"], p["longitude"], fld["boundary"])
            photos = [a.upload(who, f"{p['site_code']}-{code}-{k + 1}.jpg",
                               jpeg_bytes(rng, f"{p['site_code']} {k + 1}"), "image/jpeg", "photo", lat, lon,
                               entity_type="sample") for k in range(3)]
            layers = [{"depth_from_cm": d0, "depth_to_cm": d0 + 10,
                       "label_qr": f"QR-{code}-{p['site_code']}-D{n + 1}"} for n, d0 in enumerate((0, 10, 20))]
            res = a.post(who, "/samples", json={
                "client_ref": f"fieldapp-{who.split('@')[0]}-{code}-{p['sequence']:03d}",
                "point_id": p["id"], "collected_at": collected.isoformat(), "latitude": lat, "longitude": lon,
                "gps_accuracy_m": round(rng.uniform(2.5, 4.5), 1), "depth_reached_cm": 30, "layers": layers,
                "photo_ids": photos, "device_id": "tab-ravi-01" if who == COL1 else "tab-manju-02",
            })
            smp = res["sample"]
            blocking = [f for f in res["findings"] if f["severity"] == "blocking"]
            if blocking:
                raise SeedError(f"Sample {smp['code']} has blocking findings: {blocking}")
            samples.append({"id": smp["id"], "code": smp["code"], "who": who, "collected": collected,
                            "site_id": p["site_id"], "site_code": p["site_code"], "crop": fld["crop"],
                            "field_id": fld["id"],
                            "layers": sorted(smp["layers"], key=lambda x: x["depth_from_cm"])})
        self.counts["photos"] += 3 * len(samples)
        log(f"{len(samples)} cores collected {collect_from:%d %b}–{collect_to:%d %b %Y}, 3 photos each, "
            "3 layers (0–10, 10–20, 20–30 cm)")

        # ---- custody (field side) and shipment
        for s in samples:
            t = s["collected"]
            for ev, dt, loc in (("packed", timedelta(hours=3), "Field camp"),
                                ("dispatched", timedelta(days=1, hours=2), "Taluk office, courier pick-up"),
                                ("courier_received", timedelta(days=2), "Courier hub, Bengaluru")):
                a.post(s["who"], f"/samples/{s['id']}/custody", json={
                    "event": ev, "occurred_at": (t + dt).isoformat(), "location": loc})
        batch = a.post(ANALYST, "/lab-batches", json={
            "lab_id": self.lab["id"], "campaign_id": camp["id"],
            "layer_ids": [lay["id"] for s in samples for lay in s["layers"]]})
        a.post(ANALYST, f"/lab-batches/{batch['id']}/dispatch",
               json={"dispatched_on": (collect_to + timedelta(days=1)).isoformat()})

        # ---- lab side: receipt, analysis, results
        results: list[tuple[str, str]] = []
        a_span = (analysed_to - analysed_from).days
        for i, s in enumerate(samples):
            t = s["collected"]
            analysed_on = analysed_from + timedelta(days=round(i * a_span / max(1, len(samples) - 1)))
            received = t + timedelta(days=2, hours=5)
            opened = max(received + timedelta(days=1), datetime(analysed_on.year, analysed_on.month,
                                                                analysed_on.day, 9, 0, tzinfo=IST) - timedelta(days=2))
            analysed = datetime(analysed_on.year, analysed_on.month, analysed_on.day, 15, 0, tzinfo=IST)
            a.post(LABTECH, f"/samples/{s['id']}/custody", json={
                "event": "lab_received", "occurred_at": received.isoformat(), "location": self.lab["name"],
                "seal_intact": True, "count_matches": True, "notes": "3 bags, seals intact"})
            a.post(LABTECH, f"/samples/{s['id']}/custody", json={
                "event": "opened", "occurred_at": opened.isoformat(), "location": self.lab["name"],
                "notes": "Air-dried and sieved (2 mm)"})
            a.post(LABTECH, f"/samples/{s['id']}/custody", json={
                "event": "analysed", "occurred_at": analysed.isoformat(), "location": self.lab["name"]})

            values = self.lab_values(s, kind)
            cert = pdf_bytes(f"Test certificate {s['code']}", [
                f"Laboratory: {self.lab['name']} — NABL accredited", f"Sample: {s['code']}  Site: {s['site_code']}",
                f"Campaign: {code}   Collected: {t:%d %b %Y}   Analysed: {analysed_on:%d %b %Y}",
                "Methods: SOC by dry combustion (elemental analyser); bulk density by core ring;",
                "         coarse fraction gravimetric (>2 mm).", "",
                *[f"{lay['code']} ({lay['depth_from_cm']:g}-{lay['depth_to_cm']:g} cm): SOC {v['soc']:.2f} %, "
                  f"BD {v['bd']:.2f} g/cm3, coarse {v['cf']:.3f}" for lay, v in zip(s["layers"], values)],
                "", "Authorised signatory: Lakshmi Nair (demo)"])
            for lay, v in zip(s["layers"], values):
                for analyte, value, unit, method in (("soc_pct", v["soc"], "%", "dry_combustion"),
                                                     ("bulk_density_g_cm3", v["bd"], "g/cm3", "core_ring"),
                                                     ("coarse_fraction", v["cf"], "fraction", "gravimetric")):
                    r = a.post(LABTECH, "/lab-results", json={
                        "layer_id": lay["id"], "analyte": analyte, "value": value, "unit": unit, "method": method,
                        "analysed_on": analysed_on.isoformat()})
                    a.post(LABTECH, f"/lab-results/{r['id']}/certificate",
                           files={"file": (f"certificate-{s['code']}.pdf", cert, "application/pdf")})
                    results.append((r["id"], analyte))
        a.post(ANALYST, f"/campaigns/{camp['id']}/status", json={"status": "lab"})
        for rid, _ in results:
            a.post(LABMGR, f"/lab-results/{rid}/accept", json={"note": "Checked against the signed certificate."})
        a.post(ANALYST, f"/campaigns/{camp['id']}/status", json={"status": "complete"})
        self.counts["samples"] += len(samples)
        self.counts["layers"] += sum(len(s["layers"]) for s in samples)
        self.counts["lab_results"] += len(results)
        self.counts["certificates"] += len(results)
        log(f"custody chain collected→packed→dispatched→courier_received→lab_received→opened→analysed; "
            f"batch {batch['code']} ({batch['bag_count']} bags)")
        log(f"{len(results)} lab results entered by Lakshmi Nair with PDF certificates, accepted by Arun Prakash")
        camp["samples"] = samples
        return camp

    def lab_values(self, s: dict, kind: str) -> list[dict]:
        """Per-layer SOC / bulk density / coarse fraction. Site properties are stable between campaigns;
        monitoring SOC shows the practice effect (coffee most, maize least, a couple of fields slightly down)."""
        rng = self.rng
        site = s["site_id"]
        if kind == "baseline":
            crop = s["crop"]
            top = {"coffee": rng.uniform(1.6, 2.4), "maize": rng.uniform(0.8, 1.3), "rice": rng.uniform(1.0, 1.5)}[crop]
            mid = top * rng.uniform(0.72, 0.82)
            deep = mid * rng.uniform(0.70, 0.80)
            bd0 = rng.uniform(1.15, 1.33)
            cf0 = rng.uniform(0.02, 0.09)
            props = [{"soc": round(x, 2), "bd": round(min(1.45, bd0 + k * rng.uniform(0.03, 0.06)), 2),
                      "cf": round(min(0.12, cf0 + k * rng.uniform(0.0, 0.015)), 3)}
                     for k, x in enumerate((top, mid, deep))]
            self.site_props[site] = {"crop": crop, "layers": props}
            return props
        base = self.site_props[site]
        crop = base["crop"]
        if self.site_field[site] in self.decliners:
            delta = rng.uniform(-0.06, -0.02)
        else:
            mean, sd = {"coffee": (0.24, 0.05), "rice": (0.16, 0.04), "maize": (0.10, 0.035)}[crop]
            delta = max(0.03, rng.gauss(mean, sd))
        out = []
        for k, lay in enumerate(base["layers"]):
            share = (1.0, 0.5, 0.25)[k]
            out.append({"soc": round(max(0.2, lay["soc"] + delta * share + rng.gauss(0, 0.01)), 2),
                        "bd": round(min(1.45, max(1.15, lay["bd"] + rng.gauss(0, 0.008))), 2),
                        "cf": round(min(0.12, max(0.02, lay["cf"] + rng.gauss(0, 0.003))), 3)})
        return out

    # ------------------------------------------------------------------ 10 practices
    def practices(self) -> None:
        a, rng = self.api, self.rng
        step("Practice records (project 2023–2025, baseline 2021)")
        n = 0

        def record(fld: dict, code: str, scenario: str, performed: date, *, ended: date | None = None,
                   quantity: float | None = None, extra: dict | None = None, invoice: bytes | None = None) -> None:
            nonlocal n
            lat, lon = fld["centroid_lat"], fld["centroid_lon"]
            ev = [a.upload(COL1, f"{code}-{fld['code']}-{performed:%Y%m%d}.jpg",
                           jpeg_bytes(rng, f"{code} {fld['code']}"), "image/jpeg", "photo", lat, lon,
                           entity_type="practice")]
            if invoice:
                ev.append(a.upload(COL1, f"invoice-{fld['code']}-{performed:%Y%m%d}.pdf", invoice,
                                   "application/pdf", "invoice", entity_type="practice"))
            body = {"field_id": fld["id"], "practice_code": code, "scenario": scenario,
                    "performed_on": performed.isoformat(), "extra": extra or {}, "evidence_ids": ev,
                    "source": "field_app", "client_ref": f"prc-{fld['code']}-{code}-{performed:%Y%m%d}"}
            if ended:
                body["ended_on"] = ended.isoformat()
            if quantity is not None:
                body["quantity"] = quantity
            a.post(COL1, "/practices", json=body)
            n += 1

        def d(y: int, m: int, day: int) -> date:
            return date(y, m, day)

        by_crop = defaultdict(list)
        for f in self.fields:
            by_crop[f["crop"]].append(f)
        for i, f in enumerate(by_crop["coffee"]):
            for y in (2023, 2024):
                record(f, "compost", "project", d(y, 6, 10 + i), quantity=round(rng.uniform(2.0, 4.5), 1),
                       extra={"source": rng.choice(["On-farm compost pit", "Coffee pulp compost", "FPO vermicompost"])})
            record(f, "mulching", "project", d(2024, 1, 8 + i), quantity=round(rng.uniform(1.0, 2.5), 1),
                   extra={"material": "Coffee husk and pruned shade-tree leaves"})
            if i % 2 == 0:
                record(f, "cover_crop", "project", d(2025, 6, 12 + i // 2), ended=d(2025, 10, 20),
                       extra={"species": "Calopogonium mucunoides"})
        for i, f in enumerate(by_crop["maize"]):
            record(f, "reduced_tillage", "project", d(2023, 6, 5 + i), extra={"passes": 1})
            for y in (2023, 2024):
                record(f, "residue_retention", "project", d(y, 11, 3 + i),
                       extra={"retained_pct": rng.choice([70, 75, 80, 85])})
            if i % 2 == 0:
                record(f, "zero_tillage", "project", d(2025, 6, 8 + i))
            else:
                record(f, "cover_crop", "project", d(2025, 10, 22), ended=d(2025, 12, 20),
                       extra={"species": "Horse gram (Macrotyloma uniflorum)"})
        for i, f in enumerate(by_crop["rice"]):
            for y in (2023, 2024):
                record(f, "residue_retention", "project", d(y, 12, 2 + i),
                       extra={"retained_pct": rng.choice([60, 65, 70])})
            record(f, "compost", "project", d(2024, 6, 14 + i), quantity=round(rng.uniform(1.5, 3.0), 1),
                   extra={"source": "FPO vermicompost unit, Maddur"})
            if (f.get("crop_attributes") or {}).get("water_regime") == "awd" or i % 3 == 0:
                record(f, "awd_irrigation", "project", d(2025, 7, 5), ended=d(2025, 10, 25),
                       extra={"dry_events": rng.randint(3, 6)})
        # baseline scenario (pre-project practice), 2021
        for f in by_crop["coffee"][:2] + by_crop["rice"][:2]:
            record(f, "farmyard_manure", "baseline", d(2021, 6, 20), quantity=round(rng.uniform(0.5, 1.2), 1),
                   extra={"animal": "cattle"})
        for f in by_crop["maize"][:2]:
            record(f, "residue_retention", "baseline", d(2021, 11, 15), extra={"retained_pct": 15})
        # one fertiliser record with quantity (and its invoice)
        f = by_crop["maize"][2]
        record(f, "synthetic_fertiliser", "project", d(2024, 7, 12), quantity=125.0,
               extra={"product": "Urea (46% N)", "n_content_pct": 46},
               invoice=pdf_bytes("Tax invoice — Arsikere Raitha Seva Kendra", [
                   f"Buyer: {f['farmer_name']}", "Item: Urea 46% N, 2.5 bags x 50 kg = 125 kg",
                   "Invoice no: RSK-ARS-2024-0718  Date: 12 Jul 2024", "Amount: Rs 667.50 (subsidised)"]))
        self.counts["practices"] = n
        self.counts["photos"] += n
        log(f"{n} practice records by Ravi Kumar, each with a photo")

    # ------------------------------------------------------------------ 11 terms
    def terms(self) -> None:
        a = self.api
        step("Project terms for 2022–2026 (entered by the analyst, approved by a scientist)")
        entries = [
            ("baseline_scenario", -38.5, 90.0, 20,
             "Modelled SOC change under continued conventional practice (DEMO): the baseline scenario loses "
             "38.5 tCO2e over the period (RothC runs on district soil survey data, 2022–2026)."),
            ("project_emissions", 21.4, 12.0, 20,
             "Project N2O from fertiliser and organic inputs plus diesel for mulching logistics (DEMO), "
             "IPCC 2019 Tier 1 factors applied to recorded practice quantities."),
            ("leakage", 6.2, 3.0, 20,
             "Displaced livestock feed and manure from off-farm sources (DEMO), VM0042 leakage module estimate."),
        ]
        for term, value, var, df, source in entries:
            t = a.post(ANALYST, f"/projects/{self.pid}/terms", json={
                "period_label": PERIOD_LABEL, "term": term, "value_t_co2e": value, "variance": var, "df": df,
                "source": source})
            a.post(SCI, f"/terms/{t['id']}/approve")
            log(f"{term}: {value:+g} tCO2e (variance {var:g}) — approved by Dr. Meera Iyer")
        log("baseline_emissions not entered: the pack says it is not required")

    # ------------------------------------------------------------------ 12 QA and calculation
    def resolve_warnings(self, why: str) -> int:
        a = self.api
        findings = a.get(ANALYST, f"/projects/{self.pid}/qa/findings?status=open")
        n = 0
        for f in findings:
            if f["severity"] == "blocking":
                continue
            reason = {
                "HIGH_UNCERTAINTY": "Reviewed: deduction is applied in full; more cores planned for MON-2028.",
                "GPS_ACCURACY_LOW": "Reviewed with the collector; position cross-checked against the field boundary.",
            }.get(f["rule_code"], f"Reviewed by the analyst ({why}); no data change needed.")
            a.post(ANALYST, f"/qa/findings/{f['id']}/resolve", json={"note": reason})
            n += 1
        return n

    def qa_and_calculation(self, base: dict, mon: dict) -> None:
        a = self.api
        step("Quality checks")
        qa = a.post(ANALYST, f"/projects/{self.pid}/qa/run")
        log(f"QA run: {qa['counts']}")
        resolved = self.resolve_warnings("pre-calculation review")
        summary = a.get(ANALYST, f"/projects/{self.pid}/qa/summary")
        if summary["blocking"]:
            blocking = a.get(ANALYST, f"/projects/{self.pid}/qa/findings?severity=blocking&status=open")
            raise SeedError(f"Blocking QA findings remain: {[b['message'] for b in blocking][:10]}")
        log(f"{resolved} non-blocking finding(s) resolved with notes; blocking = 0, can_calculate = "
            f"{summary['can_calculate']}")

        step("Calculation 2022–2026 (BL22 vs MON26)")
        run = a.post(ANALYST, f"/projects/{self.pid}/calculations", json={
            "period_label": PERIOD_LABEL, "period_start": "2022-11-01", "period_end": "2026-10-31",
            "baseline_campaign_id": base["id"], "monitoring_campaign_id": mon["id"]})
        post = self.resolve_warnings("post-calculation review")
        a.post(ANALYST, f"/calculations/{run['id']}/submit")
        a.post(PROG, f"/calculations/{run['id']}/approve",
               json={"note": "Reviewed provenance and QA; approved for verification."})
        self.run = a.get(PROG, f"/calculations/{run['id']}")
        r = self.run
        if r["net_t_co2e"] <= 0:
            raise SeedError(f"Net credits are not positive: {r['net_t_co2e']}")
        log(f"run by Divya Shetty, approved by Karthik Gowda ({post} post-run finding(s) resolved)")
        log(f"gross {r['gross_t_co2e']:.1f} − uncertainty {r['uncertainty_deduction_t_co2e']:.1f} − buffer "
            f"{r['buffer_t_co2e']:.1f} = net {r['net_t_co2e']:.1f} tCO2e "
            f"(reductions {r['reductions_t_co2e']:.1f}, removals {r['removals_t_co2e']:.1f})")

    # ------------------------------------------------------------------ 13 verification
    def verification(self) -> None:
        a = self.api
        step("Verification package and verifier access")
        pkg = a.post(PROG, f"/calculations/{self.run['id']}/package")
        acc = a.post(PROG, f"/packages/{pkg['id']}/verifier-access", json={
            "verifier_name": "Priya Sharma", "verifier_email": "priya.sharma@example.com",
            "organisation": "Bureau Veritas (demo)", "days": 30})
        self.package, self.token = pkg, acc["token"]
        vh = {"X-Verifier-Token": self.token}
        a.get(None, "/verifier/session", headers=vh)
        q = a.post(None, "/verifier/queries", headers=vh, json={
            "question": "For S-COF, please confirm the bulk-density cores for the baseline and monitoring visits "
                        "were taken with the same ring volume, and share the ring calibration record.",
            "subject_type": "package", "subject_id": pkg["id"]})
        a.post(ANALYST, f"/verifier-queries/{q['id']}/answer", json={
            "answer": "Yes — both campaigns used the same 100 cm³ stainless core rings (set SHL-CR-07). The "
                      "calibration record is attached to each lab certificate; see the document index."})
        log(f"package v{pkg.get('version', 1)} issued by Karthik Gowda; 30-day access for Priya Sharma "
            "(Bureau Veritas, demo); 1 query raised and answered")

    # ------------------------------------------------------------------ 14 devices, supporting data, satellite
    def sensing(self) -> None:
        a, rng = self.api, self.rng
        step("Devices, supporting data, satellite, practice detection")
        prefix = {"coffee": "KDG", "maize": "HSN", "rice": "MND"}
        chosen: list[dict] = []
        for crop in REGIONS:
            fl = [f for f in self.fields if f["crop"] == crop]
            member_first = sorted(fl, key=lambda f: 0 if self.farmer_by_name[f["farmer_name"]]["member_farms"] else 1)
            chosen += member_first[:2]
        devices = 0
        for i, f in enumerate(chosen):
            ext = f"SS-{prefix[f['crop']]}-{11 + 3 * i:03d}"
            status = "offline" if i == len(chosen) - 1 else "online"
            dv = a.post(PROG, "/devices", json={
                "kind": "soilsync", "external_id": ext, "name": f"SoilSync {ext} — {f['name']}",
                "field_id": f["id"], "status": status, "calibrated_on": "2025-11-15"})
            if status == "online":
                a.post(PROG, f"/devices/{dv['id']}/heartbeat")
            devices += 1
        for crop in REGIONS:
            f = next(x for x in chosen if x["crop"] == crop)
            ext = f"MC-{prefix[crop]}-{rng.randint(101, 199):03d}"
            dv = a.post(PROG, "/devices", json={
                "kind": "microclime", "external_id": ext, "name": f"MicroClime {ext} — {f['farmer_name']}",
                "farm_id": self.farmer_by_name[f["farmer_name"]]["farm"]["id"],
                "latitude": round(f["centroid_lat"] + 0.0004, 6), "longitude": round(f["centroid_lon"] + 0.0004, 6),
                "elevation_m": f.get("elevation_m"), "status": "online", "calibrated_on": "2025-10-01"})
            a.post(PROG, f"/devices/{dv['id']}/heartbeat")
            devices += 1
        self.counts["devices"] = devices
        log(f"{devices} devices (6 SoilSync, 3 MicroClime); 1 offline")

        start = self.today - timedelta(days=119)
        sync = a.post(ANALYST, f"/projects/{self.pid}/supporting/sync",
                      json={"start": start.isoformat(), "end": self.today.isoformat()})
        self.counts["observations"] = sync["observations_written"]
        log(f"supporting data {start}..{self.today}: {sync['observations_written']} observations for "
            f"{sync['fields']} fields")

        written = 0
        windows = [(date(2025, 1, 1), date(2025, 12, 31)), (date(2026, 1, 1), self.today)]
        for f in self.fields:
            for ws, we in windows:
                out = a.post(ANALYST, f"/fields/{f['id']}/satellite/refresh",
                             json={"start": ws.isoformat(), "end": we.isoformat()})
                written += sum(out["written"].values())
        self.counts["satellite"] = written
        log(f"satellite indices 2025-01-01..{self.today}: {written} observations (two windows ≤ 400 days)")

        det = a.post(ANALYST, f"/projects/{self.pid}/practice-detection/run", json={
            "season_start": "2025-06-01", "season_end": "2025-12-31",
            "fallow_start": "2025-01-15", "fallow_end": "2025-04-30"})
        self.counts["detections"] = det["detections"]
        log(f"practice detection 2025 season: {det['detections']} checks {det['by_outcome']}")

    # ------------------------------------------------------------------ 15 SOC model
    def soc_model(self) -> None:
        a = self.api
        step("SOC prediction model and map")
        feature_sets = [["ndvi_mean", "elevation_m", "clay_pct", "practice_count"],
                        ["elevation_m", "clay_pct", "practice_count"]]
        model = None
        for feats in feature_sets:
            r = a.post(SCI, "/models/soc/train", ok=(201, 422), json={
                "name": "SOC topsoil Kaveri", "features": feats, "project_id": self.pid, "ridge_lambda": 1.0})
            if r.get("code") == "NOT_ENOUGH_DATA":
                log(f"features {feats}: not enough data ({r['details'].get('rows')} rows)")
                continue
            if "id" not in r:
                raise SeedError(f"Model training failed: {r}")
            model = r
            break
        if model is None:
            note("SOC model training reported NOT_ENOUGH_DATA for every feature set; model and map skipped.")
            return
        a.post(SCI2, f"/models/{model['id']}/approve")
        sm = a.post(SCI, f"/projects/{self.pid}/soc-map", json={"model_id": model["id"], "top_n": 5})
        self.model = model
        m = model.get("metrics", {})
        log(f"trained by Dr. Meera Iyer on {model['training_summary']['rows']} rows / "
            f"{model['training_summary']['farms']} farms, features {model['features']}; "
            f"CV RMSE {m.get('rmse', float('nan')):.3f}, R² {m.get('r2', float('nan')):.2f}")
        log(f"approved by Dr. Suresh Hegde; SOC map for {sm['summary']['fields']} fields "
            f"(sample next: {', '.join(sm['summary']['sample_next'])})")

    # ------------------------------------------------------------------ 16 credits and sales
    def credits(self) -> None:
        a = self.api
        step("Credit batch, issuance, buyer and sales")
        b = a.post(PROG, f"/calculations/{self.run['id']}/credit-batch")
        a.post(PROG, f"/credit-batches/{b['id']}/verify")
        total = int(math.floor(b["reductions_t"] + b["removals_t"]))
        year = int(self.run["period_end"][:4])
        b = a.post(PROG, f"/credit-batches/{b['id']}/issue", json={
            "registry_name": "Verra", "registry_project_ref": "VCS-DEMO-4821",
            "serial_start": f"VCS-DEMO-4821-{year}-{1:04d}", "serial_end": f"VCS-DEMO-4821-{year}-{total:04d}",
            "issued_on": self.today.isoformat()})
        self.batch = b
        log(f"batch {b['code']} (vintage {b['vintage']}): {b['reductions_t']:.2f} t reductions + "
            f"{b['removals_t']:.2f} t removals, issued on Verra VCS-DEMO-4821 serials "
            f"...-0001 to ...-{total:04d}")

        buyer = a.post(PROG, "/buyers", json={
            "name": "GreenLeaf Foods Pvt Ltd", "kind": "corporate", "country": "India", "contact_name": "Sarah Thomas",
            "contact_email": "buyer@example.com", "user_id": self.uid[BUYER],
            "requirements": {"credit_type": "removal", "vintage_min": 2025, "co_benefits": ["smallholder income"]}})
        qty1 = math.floor(b["removals_t"] * 0.60)
        s1 = a.post(PROG, "/sales", json={"buyer_id": buyer["id"], "batch_id": b["id"], "credit_type": "removal",
                                           "quantity": qty1, "unit_price": "1650.00", "currency": "INR",
                                           "notes": "Offtake for GreenLeaf supply-chain (inset) programme."})
        a.post(PROG, f"/sales/{s1['id']}/contract", json={"contract_ref": "GLF-OFT-2026-07",
                                                          "trade_date": self.today.isoformat()})
        s1 = a.post(PROG, f"/sales/{s1['id']}/deliver")
        qty2 = max(1, math.floor(b["removals_t"] * 0.08))
        s2 = a.post(PROG, "/sales", json={"buyer_id": buyer["id"], "batch_id": b["id"], "credit_type": "removal",
                                           "quantity": qty2, "unit_price": "1700.00", "currency": "INR",
                                           "notes": "Option for FY27 top-up; reserved pending board approval."})
        self.buyer, self.sale, self.sale2 = buyer, s1, s2
        log(f"buyer {buyer['name']} linked to buyer@; sale {s1['code']} {qty1} t × ₹1,650 contracted "
            f"(GLF-OFT-2026-07) and delivered; sale {s2['code']} {qty2} t reserved")

    # ------------------------------------------------------------------ 17 payments
    def payments(self) -> None:
        a = self.api
        step("Benefit sharing and payouts")
        rule = a.post(FIN, "/benefit-rules", json={
            "programme_id": self.programme["id"], "farmer_share_pct": "60", "weights": {"area": 0.5, "practices": 0.5},
            "deductions": [{"name": "Verification & registry fees", "pct": "6"},
                           {"name": "Programme operations", "pct": "4"}],
            "min_payout": "100", "notes": "KRS benefit-sharing rule v1 as agreed with both FPOs."})
        a.post(APPROVER, f"/benefit-rules/{rule['id']}/approve")
        pool = a.post(FIN, f"/sales/{self.sale['id']}/benefit-pool")
        a.post(APPROVER, f"/benefit-pools/{pool['id']}/approve")
        log(f"rule v{rule.get('version', 1)} by Nisha Menon, approved by Rahul Desai; pool on {self.sale['code']}")

        profiles = 0
        for f in self.farmers:
            if f["full_name"] == NO_PROFILE_FARMER:
                continue
            tokens = f["full_name"].replace(".", "").split()
            first, last = tokens[0].lower(), "".join(tokens[1:]).lower()
            upi = f"{first}.fail@okaxis" if f["full_name"] == FAIL_UPI_FARMER else f"{first}.{last}@okaxis"
            a.put(FIN, f"/farmers/{f['id']}/payment-profile", json={
                "method": "upi", "upi_id": upi, "account_name": f["full_name"]})
            a.post(FIN, f"/farmers/{f['id']}/payment-profile/verify")
            profiles += 1
        log(f"{profiles} UPI payment profiles verified ({FAIL_UPI_FARMER} has a failing UPI id; "
            f"{NO_PROFILE_FARMER} has none)")
        pb = a.post(FIN, f"/benefit-pools/{pool['id']}/payout-batch")
        a.post(APPROVER, f"/payout-batches/{pb['id']}/approve")
        pb = a.post(FIN, f"/payout-batches/{pb['id']}/submit")
        self.payout = pb
        st = Counter(x["status"] for x in pb.get("lines", []))
        log(f"payout batch {pb['code']} approved by Rahul Desai and submitted: {dict(st)}; "
            f"paid ₹{pb.get('paid_amount')}")

    # ------------------------------------------------------------------ 18 risk and grievances
    def risk(self) -> None:
        a = self.api
        step("Risk events and grievances")
        exit_field = next(f for f in self.fields if f["farmer_name"] == "Puttaswamy K.")
        a.post(PROG, "/risk-events", json={
            "project_id": self.pid, "field_id": exit_field["id"], "kind": "farmer_exit", "severity": "medium",
            "occurred_on": (self.today - timedelta(days=12)).isoformat(),
            "description": "Farmer indicated he may lease the plot to a sugarcane grower next season; FPO "
                           "facilitator to follow up on continuing the practices.",
            "estimated_impact_t": 18.0})
        flood_field = next(f for f in self.fields if f["crop"] == "rice")
        flood = a.post(PROG, "/risk-events", json={
            "project_id": self.pid, "field_id": flood_field["id"], "kind": "flood", "severity": "high",
            "occurred_on": "2025-08-21",
            "description": "Shimsha river overflow inundated paddy fields near Malavalli for 4 days.",
            "estimated_impact_t": 6.5})
        for status, n in (("assessing", "Site visit scheduled"), ("action", "Bunds repaired with FPO support")):
            a.post(PROG, f"/risk-events/{flood['id']}/status", json={"status": status, "note": n})
        a.post(PROG, f"/risk-events/{flood['id']}/status", json={
            "status": "resolved", "note": "Closed after re-inspection",
            "resolution": "Water receded within a week; residue and soil cover intact on re-inspection. No SOC "
                          "reversal expected; no buffer claim needed."})

        payer = self.farmer_by_name["Shivalingaiah M."]
        g1 = a.post(PROG, "/grievances", json={
            "farmer_id": payer["id"], "category": "payment", "subject": "When will my carbon payment arrive?",
            "description": "Farmer called the FPO office asking about the timing and amount of the first payout.",
            "channel": "phone", "priority": "normal"})
        a.post(PROG, f"/grievances/{g1['id']}/assign", json={"user_id": self.uid[FIN],
                                                             "note": "Finance to explain the statement"})
        a.post(PROG, f"/grievances/{g1['id']}/status", json={"status": "in_progress", "note": "Statement shared"})
        a.post(PROG, f"/grievances/{g1['id']}/status", json={
            "status": "resolved", "note": "Explained by phone in Kannada",
            "resolution": "Explained the benefit statement: share is based on enrolled area and recorded "
                          "practices; payout was sent to the verified UPI id."})
        a.post(PROG, "/grievances", json={
            "farmer_id": self.farmer_by_name["Ramesh Honnegowda"]["id"], "category": "enrolment",
            "subject": "Second paddy field not enrolled",
            "description": "Farmer says his second paddy field (survey no. 212/3) was mapped but is not in the "
                           "project. Needs a field visit to map and check land records.",
            "channel": "field_officer", "priority": "high"})
        a.post(FARMER, "/grievances", json={
            "category": "sampling", "subject": "Soil sample results",
            "description": "ನನ್ನ ಹೊಲದ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶ ಯಾವಾಗ ಸಿಗುತ್ತದೆ? (When will I get my soil test results?)",
            "channel": "app", "priority": "normal"})
        log("risk: 1 open (farmer_exit, medium), 1 resolved (flood); grievances: 3 (1 resolved, 1 open high, "
            "1 from the farmer app)")

    # ------------------------------------------------------------------ 19 partners
    def partners(self) -> None:
        a = self.api
        step("Partner integration")
        a.post(PROG, "/partners/api-keys", json={"name": "FarmFuture integration", "scopes": ["read"]})
        a.post(PROG, "/partners/webhooks", json={
            "url": "https://example.com/hooks/vcarbon", "events": ["result.approved", "payout.completed"],
            "description": "FarmFuture: approved results and completed payouts (not dispatched in the demo)."})
        log("API key 'FarmFuture integration' (read) and webhook https://example.com/hooks/vcarbon")

    # ------------------------------------------------------------------ verification of screens
    # ------------------------------------------------------------------ 20 live fieldwork (field-app demo)
    def pilot_fieldwork(self) -> None:
        """A second project with a baseline campaign in progress, so the field app has live work."""
        a, rng = self.api, self.rng
        from app.core.geo import square

        step("Millets pilot (KRS-P2): baseline campaign in fieldwork for the field app")
        a.patch(PROG, f"/programmes/{self.programme['id']}",
                json={"eligible_crops": ["coffee", "maize", "rice", "millets"]})
        proj = a.post(PROG, "/projects", json={
            "programme_id": self.programme["id"], "code": "KRS-P2", "name": "Millets pilot — Chitradurga",
            "methodology_code": "VM0042", "methodology_version": "2.2", "baseline_start": "2026-06-01",
            "crediting_start": "2026-10-01", "crediting_end": "2031-09-30"})
        a.post(PROG, f"/projects/{proj['id']}/status", json={"status": "active", "reason": "Pilot approved"})
        a.post(SCI, f"/projects/{proj['id']}/rule-pack", json={"pack_id": self.pack["id"]})
        hosts = [f for f in self.farmers if f["crop"] == "maize"][:5]
        base_lat, base_lon = 14.1062, 76.2795  # farmland south-west of Chitradurga town
        fields = []
        for i, fr in enumerate(hosts):
            lat, lon = offset(base_lat, base_lon, (i // 3) * 750.0, (i % 3) * 750.0)
            fld = a.post(COL1, "/fields", json={
                "farm_id": fr["farm"]["id"], "name": f"Ragi plot {i + 1}",
                "boundary": square(round(lat, 6), round(lon, 6), round(rng.uniform(150, 220), 1)),
                "crop_code": "millets", "crop_attributes": {"millet_type": "ragi"}, "soil_type": "red sandy loam",
                "elevation_m": round(rng.uniform(720, 780))})
            a.post(COL1, f"/fields/{fld['id']}/land-use", json={
                "from_year": 2012, "to_year": 2026, "land_use": "cropland",
                "source": "Farmer declaration, verified by field officer",
                "notes": "Rain-fed ragi and horse gram rotation since at least 2012."})
            e = a.post(PROG, f"/projects/{proj['id']}/enrolments", json={"field_id": fld["id"]})
            a.post(PROG, f"/projects/{proj['id']}/enrolments/{e['id']}/confirm")
            fields.append(fld)
        st = a.post(ANALYST, f"/projects/{proj['id']}/strata", json={
            "code": "S-MIL", "name": "Millets — Chitradurga red soils", "field_ids": [f["id"] for f in fields],
            "effective_from": "2026-06-01", "criteria": {"crop": "millets", "district": "Chitradurga"}})
        camp = a.post(ANALYST, f"/projects/{proj['id']}/campaigns", json={
            "code": "BL26-MIL", "name": "Baseline 2026 — millets pilot", "kind": "baseline", "design": "paired",
            "planned_start": "2026-09-15", "planned_end": "2026-11-15", "depth_from_cm": 0, "depth_to_cm": 30,
            "placement_seed": 260_915})
        plan = a.post(ANALYST, f"/campaigns/{camp['id']}/sample-plans", json={
            "stratum_id": st["id"], "n_required": 6, "method": "manual",
            "justification": "Pilot baseline: six cores across five fields, above the methodology floor of 5."})
        a.post(SCI, f"/sample-plans/{plan['id']}/approve")
        a.post(ANALYST, f"/campaigns/{camp['id']}/place-points")
        points = sorted(a.get(ANALYST, f"/campaigns/{camp['id']}/points"), key=lambda p: p["sequence"])
        a.post(ANALYST, f"/campaigns/{camp['id']}/assign",
               json={"user_id": self.uid[COL1], "point_ids": [p["id"] for p in points]})
        a.post(ANALYST, f"/campaigns/{camp['id']}/status", json={"status": "fieldwork"})
        boundary = {f["id"]: f["boundary"] for f in fields}
        for k, p in enumerate(points[:2]):
            lat, lon = near_site(rng, p["latitude"], p["longitude"], boundary[p["field_id"]])
            photos = [a.upload(COL1, f"{p['site_code']}-BL26-{j + 1}.jpg", jpeg_bytes(rng, p["site_code"]),
                               "image/jpeg", "photo", lat, lon, entity_type="sample") for j in range(3)]
            when = datetime(2026, 9, 22 + k, 9, 10, tzinfo=IST)
            res = a.post(COL1, "/samples", json={
                "client_ref": f"fieldapp-collector-BL26-{p['sequence']:03d}", "point_id": p["id"],
                "collected_at": when.isoformat(), "latitude": lat, "longitude": lon,
                "gps_accuracy_m": 3.2, "depth_reached_cm": 30, "photo_ids": photos, "device_id": "tab-ravi-01",
                "layers": [{"depth_from_cm": d, "depth_to_cm": d + 10, "label_qr": f"QR-BL26-{p['site_code']}-D{n + 1}"}
                           for n, d in enumerate((0, 10, 20))]})
            a.post(COL1, f"/samples/{res['sample']['id']}/custody", json={
                "event": "packed", "occurred_at": (when + timedelta(hours=3)).isoformat(), "location": "Field camp"})
        log(f"KRS-P2 with {len(fields)} millet fields; BL26-MIL in fieldwork, {len(points)} points assigned to "
            "Ravi Kumar, 2 collected")

    def check_screens(self) -> dict[str, Any]:
        a = self.api
        step("Checking key screens through GET calls")
        farmers = a.get(PROG, "/farmers?limit=1")["total"]
        fields = a.get(PROG, "/fields?limit=1")["total"]
        runs = a.get(PROG, f"/projects/{self.pid}/calculations")
        packages = a.get(PROG, f"/projects/{self.pid}/packages")
        batches = a.get(PROG, f"/credit-batches?project_id={self.pid}")
        payouts = a.get(FIN, "/payout-batches")
        samples = a.get(ANALYST, "/samples?limit=5000")
        portfolio = a.get(BUYER, "/buyer/portfolio")
        statement = a.get(FARMER, f"/farmers/{self.farmer_by_name['Basavaraj Patil']['id']}/statement")
        vp = a.get(None, "/verifier/package", headers={"X-Verifier-Token": self.token})
        checks = {
            "farmers >= 18": farmers >= 18,
            "fields >= 30": fields >= 30,
            "approved run": any(r["status"] == "approved" for r in runs),
            "verification package": len(packages) >= 1,
            "issued credit batch": any(b["status"] == "issued" for b in batches),
            "payout batch submitted": any(p["status"] in ("completed", "partially_failed") for p in payouts),
            "samples": len(samples) >= 60,
            "buyer portfolio": bool(portfolio),
            "farmer statement": bool(statement),
            "verifier portal": bool(vp),
        }
        for k, v in checks.items():
            log(f"{'ok ' if v else 'FAIL'} {k}")
        if not all(checks.values()):
            raise SeedError(f"Screen checks failed: {[k for k, v in checks.items() if not v]}")
        return {"farmers": farmers, "fields": fields, "samples": len(samples)}

    # ------------------------------------------------------------------ run everything
    def run_all(self) -> dict[str, Any]:
        self.catalogue_and_programme()
        self.rule_pack()
        self.farmers_and_consent()
        self.land()
        self.make_strata()
        self.make_lab()
        base = self.campaign(code="BL22", name="Baseline 2022", kind="baseline", start="2022-11-01",
                             end="2022-12-20", seed=220_1101, revisits=None, collect_from=date(2022, 11, 3),
                             collect_to=date(2022, 12, 16), analysed_from=date(2023, 1, 9),
                             analysed_to=date(2023, 1, 27))
        # two fields that come out slightly lower at monitoring (realism)
        maize = [f["id"] for f in self.fields if f["crop"] == "maize"]
        rice = [f["id"] for f in self.fields if f["crop"] == "rice"]
        sampled = set(self.site_field.values())
        self.decliners = {next(f for f in maize[3:] if f in sampled), next(f for f in rice[5:] if f in sampled)}
        mon = self.campaign(code="MON26", name="Monitoring 2026", kind="monitoring", start="2026-02-02",
                            end="2026-03-15", seed=260_0202, revisits=base["id"], collect_from=date(2026, 2, 3),
                            collect_to=date(2026, 3, 13), analysed_from=date(2026, 4, 6),
                            analysed_to=date(2026, 4, 24))
        self.practices()
        self.terms()
        self.qa_and_calculation(base, mon)
        self.verification()
        self.sensing()
        self.soc_model()
        self.credits()
        self.payments()
        self.risk()
        self.partners()
        self.pilot_fieldwork()
        return self.check_screens()


# ====================================================================== summary
def summary(story: Story, screens: dict[str, Any], elapsed: float, calls: int) -> str:
    r = story.run
    link = f"{WEB_URL}/verify#token={story.token}"
    lines = [
        "=" * 96,
        f"Varsapradaya Carbon demo dataset — {ORG_NAME} ({ORG_SLUG})",
        "=" * 96,
        "",
        f"All accounts use the password: {PASSWORD}",
        "",
        f"  {'Email':<26}{'Role':<20}Name",
        f"  {'-' * 26}{'-' * 20}{'-' * 24}",
        *[f"  {e:<26}{role:<20}{name}" for e, role, name in ACCOUNTS],
        "",
        "Key counts",
        f"  farmers {screens['farmers']} · fields {screens['fields']} "
        f"({sum(f['area_ha'] for f in story.fields):.1f} ha) · strata {len(story.strata)} · "
        f"agreements {story.counts['agreements']}",
        f"  campaigns 2 · samples {story.counts['samples']} · layers {story.counts['layers']} · "
        f"lab results {story.counts['lab_results']} (all accepted, each with a PDF certificate)",
        f"  practice records {story.counts['practices']} · photos {story.counts['photos']} · devices "
        f"{story.counts['devices']} · supporting observations {story.counts['observations']} · satellite "
        f"{story.counts['satellite']} · detections {story.counts['detections']}",
        "",
        f"Headline credits — run {r['id']} ({PERIOD_LABEL}, {r['status']})",
        f"  gross                 {r['gross_t_co2e']:>10.2f} tCO2e",
        f"  uncertainty deduction {r['uncertainty_deduction_t_co2e']:>10.2f} tCO2e",
        f"  buffer (15%)          {r['buffer_t_co2e']:>10.2f} tCO2e",
        f"  NET CREDITS           {r['net_t_co2e']:>10.2f} tCO2e",
        f"    reductions          {r['reductions_t_co2e']:>10.2f} tCO2e",
        f"    removals            {r['removals_t_co2e']:>10.2f} tCO2e",
        f"  credit batch {story.batch['code']} issued; sale {story.sale['code']} delivered "
        f"({story.sale['quantity']:g} t × ₹1,650), sale {story.sale2['code']} reserved "
        f"({story.sale2['quantity']:g} t)",
        f"  payout batch {story.payout['code']}: {story.payout['status']}",
        "",
        "Verifier link (valid 30 days, shown only once):",
        f"  {link}",
    ]
    if _notes:
        lines += ["", "Notes", *[f"  - {n}" for n in _notes]]
    lines += ["", f"Built in {elapsed:.0f} s with {calls} API calls.", "=" * 96]
    return "\n".join(lines)


def write_accounts_file(story: Story) -> Path:
    out = API_ROOT / "var" / "demo_accounts.txt"
    out.parent.mkdir(parents=True, exist_ok=True)
    text = [
        f"Varsapradaya Carbon demo — {ORG_NAME} ({ORG_SLUG})",
        f"Generated {datetime.now(UTC):%Y-%m-%d %H:%M} UTC",
        "",
        f"Password for every account: {PASSWORD}",
        "",
        *[f"{e:<26} {role:<20} {name}" for e, role, name in ACCOUNTS],
        "",
        "Verifier link (Priya Sharma, Bureau Veritas (demo), 30 days):",
        f"{WEB_URL}/verify#token={story.token}",
        "",
    ]
    out.write_text("\n".join(text), encoding="utf-8")
    return out


# ====================================================================== entry point
def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--reset", action="store_true", help="drop and recreate all tables first")
    args = parser.parse_args(argv)

    settings = get_settings()
    if settings.is_production:
        print("Refusing to seed demo data: ENVIRONMENT is production.", file=sys.stderr)
        return 2
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    t0 = time.time()
    print(f"Seeding demo data into {settings.database_url.split('@')[-1]} (environment: {settings.environment})")
    try:
        uid = bootstrap(args.reset)
        from fastapi.testclient import TestClient

        from app.main import app

        with TestClient(app) as client:
            api = Api(client)
            story = Story(api, uid)
            screens = story.run_all()
            path = write_accounts_file(story)
            print("\n" + summary(story, screens, time.time() - t0, api.calls))
            print(f"\nAccounts and verifier link written to {path}")
    except SeedError as exc:
        print(f"\nSEED FAILED: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
