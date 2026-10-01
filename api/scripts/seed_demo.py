"""Build a complete, realistic VM0042 v2.2 demo dataset by driving the real API.

Run from the ``api`` directory::

    ../.venv/Scripts/python -m scripts.seed_demo --reset

Only the organisation and the user accounts are written directly (there is no public
sign-up). Everything else goes through the HTTP API in-process (``TestClient``), signed in
as the person who would really do each step, so every business rule — four-eyes approval,
quality checks, fail-closed methodology rules, VM0042 v2.2 gates — is exercised exactly as
in production.

The story (KRS-P1, QA2 measure & re-measure with baseline control sites):
rule pack (VM0042 fixed values + owner choices) → farmers, consent, fields with Table 7
attributes, verified land tenure → enrolment → DEM terrain and soil-map suggestions →
partner-farm control sites (Table 7 matched, ≤ 250 km) → strata → Table 4 baseline activity
records 2017–2021 (Box 1 tiers, farmer attestations) and project records 2022–2025 →
additionality (§7) → lab with QC evidence, monitoring plan → baseline BL22 (Nov 2022) and
same-season monitoring MON25 (Nov 2025), 0–50 cm in four increments, Eq. 3 soil mass →
control-site assessment (Table 7 with measured texture) → shade-tree woody biomass (permanent
plots in the coffee stratum and on its control plots, WB-BL22 / WB-MON25, Eq. 48/49 terms
approved) → leakage records (TOOL16 residues ruled out, §8.4.2(b) no production decline) →
QA → calculation 2022-11-01..2025-12-31 → package → credits → offtake → sale → benefit
sharing → payouts → reconciliation, plus risk (obligations from the rule pack), notifications,
interventions, households, intelligence data and a draft QA1 model (register illustration
only). A millets pilot (KRS-P2) is left in fieldwork for the field app, with a VM0042
Appendix 6 multi-stage design (fields drawn by PPS).

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
OTP = "123456"  # the demo OTP accepted outside production

PERIOD_LABEL = "2022–2025"
PERIOD_START, PERIOD_END = "2022-11-01", "2025-12-31"
CREDITING_START, CREDITING_END = "2022-11-01", "2032-10-31"
LOOKBACK_YEARS = (2017, 2018, 2019, 2020, 2021)   # ≥ 3 years + rotation; Table 7 needs 5 years of history
PROJECT_YEARS = (2022, 2023, 2024, 2025)          # every calendar year (vintage) of the calculation period
PROBE_MM, CORES = 21.5, 4                         # Eq. 3: probe inner diameter and cores per composite
DEPTHS = ((0, 10), (10, 20), (20, 30), (30, 50))  # ESM increments, sampled to 50 cm, reported to 30 cm
DEMO_SRC = "DEMO — replace before real use"

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
    ("client@example.com", "client_viewer", "Kavya Reddy (GreenLeaf ESG)"),
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
# Varsapradaya partner farms that host the baseline control sites (managed per the baseline schedule).
PARTNERS: list[tuple[str, str, str, str]] = [
    ("Appachu K. S.", "Suntikoppa", "Kodagu", "coffee"),
    ("Honnappa D. R.", "Channarayapatna", "Hassan", "maize"),
    ("Puttamadamma S.", "Maddur", "Mandya", "rice"),
]
FAIL_UPI_FARMER = "Siddaraju T."        # UPI id contains "fail" -> simulated failed payout
NO_PROFILE_FARMER = "Ramesh Honnegowda"  # no payment details -> payout on hold

REGIONS: dict[str, dict[str, Any]] = {
    "coffee": dict(lat=12.42, lon=75.74, code="S-COF", ctrl="C-COF", name="Coffee — Kodagu uplands",
                   soil="red laterite", texture="clay_loam", wrb="Nitisols", climate="tropical_moist",
                   ecoregion="South Western Ghats moist deciduous forests", precip=1920, district="Kodagu",
                   management="shade-grown perennial coffee, no tillage"),
    "maize": dict(lat=13.00, lon=76.10, code="S-MAZ", ctrl="C-MAZ", name="Maize — Hassan plains",
                  soil="red sandy loam", texture="sandy_loam", wrb="Luvisols", climate="tropical_dry",
                  ecoregion="South Deccan Plateau dry deciduous forests", precip=870, district="Hassan",
                  management="rain-fed kharif maize, conventional tillage"),
    "rice": dict(lat=12.52, lon=76.90, code="S-RIC", ctrl="C-RIC", name="Rice — Mandya irrigated",
                 soil="alluvial clay loam", texture="clay_loam", wrb="Vertisols", climate="tropical_dry",
                 ecoregion="South Deccan Plateau dry deciduous forests", precip=730, district="Mandya",
                 management="canal-irrigated transplanted paddy"),
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
               lat: float | None = None, lon: float | None = None, entity_type: str | None = None,
               entity_id: str | None = None) -> str:
        data = {"kind": kind}
        if lat is not None and lon is not None:
            data.update(latitude=f"{lat:.7f}", longitude=f"{lon:.7f}")
        if entity_type:
            data["entity_type"] = entity_type
        if entity_id:
            data["entity_id"] = entity_id
        return self.post(who, "/evidence", files={"file": (filename, content, mime)}, data=data)["id"]

    def pdf(self, who: str, filename: str, title: str, lines: list[str], kind: str = "document",
            entity_type: str | None = None, entity_id: str | None = None) -> str:
        return self.upload(who, filename, pdf_bytes(title, lines), "application/pdf", kind,
                           entity_type=entity_type, entity_id=entity_id)


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


def fine_soil_mass_g(bd: float, thickness_cm: float, cf: float) -> float:
    """Eq. 3 inverse: the oven-dry < 2 mm mass of a composite of CORES cores of diameter PROBE_MM.

    mass (t/ha) = BD (g/cm³) × thickness (cm) × 100 × (1 − coarse fraction); Eq. 3 gives
    mass (t/ha) = M (g) / (π (D/2)² N) (mm²) × 10 000, so M (g) = mass × π (D/2)² N / 10 000."""
    mass_t_ha = bd * thickness_cm * 100.0 * (1.0 - cf)
    return round(mass_t_ha * math.pi * (PROBE_MM / 2.0) ** 2 * CORES / 10_000.0, 2)


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


# ====================================================================== Table 4 activity data
def _wiggle(year: int, idx: int, amp: float = 0.04) -> float:
    """A deterministic ±amp year-to-year variation."""
    return 1.0 + amp * (((year * 7 + idx * 3) % 5) - 2) / 2.0


def activity_rows(crop: str, scenario: str, year: int, area: float, fk: dict[str, Any]) -> list[tuple[str, dict]]:
    """Table 4 categories (+ fossil fuel, amendments) for one field and year.

    Rates per hectare are stored for Table 4 (``*_rate_*``, ``*_t_ha``); the QA3 engine reads field
    totals (fertiliser ``mass_t``, ``limestone_t``/``dolomite_t``, ``diesel_l``/``gasoline_l``)."""
    w = _wiggle(year, fk["idx"]) * fk["factor"]
    project = scenario == "project" and year >= 2023  # the project started 1 Nov 2022: 2022 is still baseline practice
    # yields: the 2022 harvest followed an above-normal monsoon; from 2023 the practices lift yields a little, so
    # every crop's production stays at or above its 2017–2021 average (VMD0054 / §8.4.2(b): no production decline)
    yf = 1.06 if project else 1.05 if scenario == "project" else 1.0
    rot = {} if scenario == "project" else {"rotation_length_years": 1}  # continuous crop, stated with the records
    rows: list[tuple[str, dict]] = []

    def fert(urea_t_ha: float, organic: list[tuple[str, float, float]]) -> dict:
        urea = round(urea_t_ha * w, 4)
        d: dict[str, Any] = {"synthetic_n": True, "synthetic_n_rate_kg_n_ha": round(urea * 0.46 * 1000, 1),
                             "synthetic_fertilizers": [{"type": "urea", "mass_t": round(urea * area, 4),
                                                        "n_content": 0.46}],
                             "manure": False, "compost": False}
        orgs = []
        for kind, rate, n in organic:
            d[kind] = True
            d[f"{kind}_rate_t_ha"] = round(rate, 2)
            orgs.append({"type": kind, "mass_t": round(rate * area, 3), "n_content": n})
        if orgs:
            d["organic_fertilizers"] = orgs
        return d

    if crop == "coffee":
        rows.append(("crop", {"crop_type": "coffee", "planting_date": f"{year}-03-10",
                              "harvest_date": f"{year}-12-18", "yield_t_ha": round(1.05 * w * yf, 2), **rot,
                              **({"cover_crop": True, "cover_crop_type": "Calopogonium mucunoides (inter-row)"}
                                 if project else {"cover_crop": False})}))
        organic = [("manure", 2.0, 0.005)] if fk["manure"] else []
        if project:
            organic.append(("compost", 2.5, 0.012))
        rows.append(("n_fertilizer", fert(0.18 if project else 0.26, organic)))
        rows.append(("tillage_residue", {"tillage": False, "residue_removal": False}))
        rows.append(("water", {"irrigation": True, "irrigation_rate_mm": round(60 * w), "irrigation_method":
                               "sprinkler (blossom and backing showers)", "flooding": False}))
        rows.append(("liming", {"limestone": False, "dolomite": True, "dolomite_t_ha": 0.4,
                                "dolomite_t": round(0.4 * area, 3)}))
        diesel, petrol = (34 if project else 45), 8
    elif crop == "maize":
        rows.append(("crop", {"crop_type": "maize", "planting_date": f"{year}-06-15",
                              "harvest_date": f"{year}-10-12", "yield_t_ha": round(4.2 * w * yf, 2), **rot,
                              **({"cover_crop": True, "cover_crop_type": "Horse gram after harvest"}
                                 if project else {"cover_crop": False})}))
        rows.append(("n_fertilizer", fert(0.24 if project else 0.30, [("manure", 3.0, 0.005)])))
        if project:
            rows.append(("tillage_residue", {"tillage": True, "tillage_type": "tine (reduced) tillage",
                                             "tillage_depth_cm": 10, "tillage_frequency_per_yr": 1,
                                             "soil_disturbed_pct": 40, "residue_removal": True,
                                             "residue_removed_pct": 25}))
        else:
            rows.append(("tillage_residue", {"tillage": True, "tillage_type": "mouldboard plough and harrow",
                                             "tillage_depth_cm": 20, "tillage_frequency_per_yr": 3,
                                             "soil_disturbed_pct": 100, "residue_removal": True,
                                             "residue_removed_pct": 80}))
        rows.append(("water", {"irrigation": False, "flooding": False}))
        rows.append(("liming", {"limestone": False, "dolomite": False}))
        diesel, petrol = (40 if project else 62), 0
    else:  # rice
        rows.append(("crop", {"crop_type": "rice", "planting_date": f"{year}-07-20",
                              "harvest_date": f"{year}-11-28", "yield_t_ha": round(5.2 * w * yf, 2), **rot}))
        rows.append(("n_fertilizer", fert(0.23 if project else 0.28, [("compost", 1.5, 0.015)] if project else [])))
        rows.append(("tillage_residue", {"tillage": True, "tillage_type": "wet puddling", "tillage_depth_cm": 15,
                                         "tillage_frequency_per_yr": 2, "soil_disturbed_pct": 100,
                                         "residue_removal": True, "residue_removed_pct": 30 if project else 70}))
        rows.append(("water", {"irrigation": True, "irrigation_rate_mm": round((980 if project else 1250) * w),
                               "irrigation_method": "canal, alternate wetting and drying" if project
                               else "canal, continuous flooding", "flooding": True,
                               "flooded_days": 70 if project else 105}))
        rows.append(("liming", {"limestone": False, "dolomite": False}))
        diesel, petrol = (58 if project else 72), 6
        if project:  # FPO vermicompost brought in from outside the project: Eq. 33 leakage
            mass = round(1.5 * area, 3)
            rows.append(("organic_amendment_import", {
                "imported": True, "amendment_type": "vermicompost", "mass_t": mass, "carbon_content": 0.22,
                "amendments": [{"type": "vermicompost", "mass_t": mass, "carbon_content": 0.22,
                                "produced_on_site": False}]}))
    rows.append(("grazing", {"grazing": False, "harvesting_mowing": False}))
    rows.append(("fossil_fuel", {"fuel_used": True, "diesel_l": round(diesel * w * area, 1),
                                 "gasoline_l": round(petrol * w * area, 1)}))
    return rows


# ====================================================================== the story
class Story:
    def __init__(self, api: Api, uid: dict[str, Any]) -> None:
        self.api = api
        self.uid = uid
        self.rng = random.Random(SEED)
        self.trng = random.Random(SEED + 7)  # texture, woody biomass, design draws: keeps the main sequence stable
        self.today = datetime.now(UTC).date()  # the API checks dates against UTC
        self.farmers: list[dict] = []           # api rows + our metadata
        self.fields: list[dict] = []            # project fields (api rows + crop, farmer)
        self.controls: list[dict] = []          # control-site fields
        self.field_by_id: dict[str, dict] = {}
        self.strata: dict[str, dict] = {}       # project strata by crop
        self.ctrl_strata: dict[str, dict] = {}  # control strata by crop
        self.counts: Counter = Counter()
        self.site_props: dict[str, dict] = {}   # site_id -> baseline lab values per layer
        self.site_field: dict[str, str] = {}
        self.decliners: set[str] = set()

    # ------------------------------------------------------------------ catalogue, programme, project
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
            "eligible_crops": ["coffee", "maize", "rice"], "start_date": "2022-10-01", "end_date": "2032-10-31",
            "commercial_terms": {"lookback_years": 10},
        })
        a.post(PROG, f"/programmes/{prog['id']}/status", json={"status": "active", "reason": "Programme launched"})
        proj = a.post(PROG, "/projects", json={
            "programme_id": prog["id"], "code": "KRS-P1", "name": "Kaveri Soils — Phase 1",
            "methodology_code": "VM0042", "methodology_version": "2.2", "baseline_start": "2022-10-01",
            "crediting_start": CREDITING_START, "crediting_end": CREDITING_END,
        })
        a.post(PROG, f"/projects/{proj['id']}/status", json={"status": "active", "reason": "Validated design"})
        self.programme, self.project = prog, proj
        self.pid = proj["id"]
        log(f"programme {prog['code']} and project {proj['code']} active; crediting period "
            f"{CREDITING_START} to {CREDITING_END}")

    # ------------------------------------------------------------------ rule pack
    def rule_pack(self) -> None:
        from app.modules.methodology.definitions import BY_KEY, EXAMPLE_FACTORS

        a = self.api
        step("VM0042 v2.2 rule pack (entered by one scientist, approved by another)")
        pack = a.post(SCI, "/rule-packs", json={
            "methodology_code": "VM0042", "methodology_version": "2.2", "title": "Kaveri Soils rule pack",
            "source_url": "https://verra.org/wp-content/uploads/2024/09/VM0042v2.2.pdf",
        })
        out = a.post(SCI, f"/rule-packs/{pack['id']}/apply-vm0042-defaults")
        applied = out["vm0042_defaults"]["applied"]
        log(f"{len(applied)} methodology-fixed values entered with their VM0042 section and page")

        vm = "Verra VM0042 v2.2 (21 Oct 2025)"
        owner: list[tuple[str, Any, str, str, str | None]] = [
            # key, value, source_document, section, page
            ("qa_soc", "qa2", vm, "§8.1 Table 5", "21"),
            ("qa_n2o_soil", "qa3", vm, "§8.1 Table 5; §8.2.9 Eq. 16–23", "21"),
            ("qa_ch4_soil", "not_applicable", DEMO_SRC + " (project design: soil methanogenesis not modelled)",
             "§8.1 Table 5", "21"),
            ("modelled_soc_permitted", False, vm, "§4 cond. 4; §8.1", "10"),
            ("esm_interpolation", "cubic_spline", vm, "§8.2.1.6 (Wendt & Hauser 2013 cubic spline)", "36–37"),
            ("shallow_soil_allowed", False, DEMO_SRC, "§8.2.1.3(7b)", "32"),
            ("min_samples_per_stratum", 5, DEMO_SRC + " (project sampling design)", "§8.2.1.2", "30"),
            ("sample_size_procedure", "VM0042 v2.2 §8.2.1.2 Eq. 2 with pre-sampling variance, α 0.05, power 90 %; "
                                      "at least 5 composites per stratum", vm, "§8.2.1.2 Eq. 1–2", "30"),
            ("sampling_design", "paired", vm, "§8.6.2.1 Eq. 71", "77"),
            ("unpaired_points_policy", "exclude_and_report", DEMO_SRC, "§8.6.2.1", "77"),
            ("monitoring_interval_min_years", 3, DEMO_SRC + " (project monitoring plan)", "§8.1", "20"),
            ("monitoring_interval_max_years", 5, vm, "§8.1; §9.2", "20"),
            ("excluded_conversions", ["forest", "wetland"], vm, "§4 cond. 3, 5, 8", "9–11"),
            ("permitted_soc_methods", ["dry_combustion"], vm, "§8.2.1.4", "33"),
            ("permitted_bd_methods", ["core_ring"], vm, "§8.2.1.5 (ISO 11272:2017)", "34"),
            ("emission_factors", EXAMPLE_FACTORS,
             DEMO_SRC + " — IPCC 2019 Refinement Vol 4 Table 11.1/11.3 aggregated defaults",
             "§8.1; §8.3; §8.6.3", "21–22, 81"),
            ("de_minimis_exclude", False, DEMO_SRC + " (all sources reported and counted)", "§5", "12"),
            ("baseline_scenario_required", False, vm + " — QA2 baseline measured at control sites",
             "§8.2; §8.5 Eq. 44", "25, 60"),
            ("project_emissions_required", False, vm + " — project emissions from QA3 activity data",
             "§8.2.3–8.2.11", "38–47"),
            ("baseline_emissions_required", False, vm + " — baseline emissions from QA3 activity data",
             "§8.2.3–8.2.11", "38–47"),
            ("leakage_required", False, vm + " — organic-amendment leakage via Eq. 33 from activity data",
             "§8.4.1 Eq. 33", "51–52"),
            # woody biomass: shade trees in the coffee stratum (silver oak, jackfruit, native figs)
            ("woody_biomass_included", True, vm + " — shade-tree stocks in the coffee stratum are inventoried on "
             "permanent plots (project and control sites) and reported with Eq. 48–51", "§5 Table 2", "12"),
            ("woody_belowground_included", True, vm + " — optional; roots of the retained shade trees included "
             "via the root:shoot ratio of the approved allometric model", "§5 Table 2", "12"),
            ("woody_shrubs_included", False, DEMO_SRC + " (coffee bushes are the crop, pruned and stumped on a "
             "cycle; no shrub stock gain is claimed)", "§8.5.1 Eq. 50–51", "60"),
            ("tree_carbon_fraction", 0.47, DEMO_SRC + " — CDM AR-TOOL14 default carbon fraction CF_TREE 0.47 "
             "(IPCC 2006 Vol 4 Table 4.3)", "§8.2.2", "38"),
            ("non_permanence_risk_pct", 15, "VCS AFOLU Non-Permanence Risk Tool v4.0 — demo assessment",
             "§8.7 Eq. 75–76", "84"),
            ("gps_accuracy_max_m", 5, DEMO_SRC + " (field SOP)", "§8.2.1.2", "30"),
            ("max_distance_from_site_m", 15, DEMO_SRC + " (field SOP)", "§8.2.1.2", "30"),
            ("required_photos", 3, DEMO_SRC + " (field SOP)", "§8.2.1.2", "30"),
        ]
        for key, value, doc, section, page in owner:
            a.put(SCI, f"/rule-packs/{pack['id']}/rules/{key}", json={
                "value": value, "source_document": doc, "source_section": section, "source_page": page,
                "notes": f"{BY_KEY[key].label}: entered by the methodology owner."})
        ready = a.get(SCI, f"/rule-packs/{pack['id']}/readiness")
        if not ready["can_approve"]:
            raise SeedError(f"Rule pack not ready: {ready}")
        a.post(SCI2, f"/rule-packs/{pack['id']}/approve")
        a.post(SCI, f"/projects/{self.pid}/rule-pack", json={"pack_id": pack["id"]})
        self.pack = pack
        for key in ("soc_remeasurement_interval_years", "baseline_reassessment_interval_years",
                    "woody_remeasure_max_years"):
            if key not in applied:
                raise SeedError(f"apply-vm0042-defaults did not enter {key}")
        log(f"{len(owner)} owner values (QA2 SOC, QA3 N2O, ESM cubic spline, woody biomass with roots, NPR 15 %, "
            f"IPCC factors) by Dr. Meera Iyer; {ready['answered']}/{ready['total']} rules answered; approved by "
            "Dr. Suresh Hegde; assigned to KRS-P1")

    # ------------------------------------------------------------------ FPOs, farmers, consent
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
        people = [(*f, False) for f in FARMERS] + [(n, v, d, c, 0, None, True, True) for n, v, d, c in PARTNERS]
        for name, village, district, crop, n_fields, fpo, member, partner in people:
            digits = rng.choice("6789") + "".join(rng.choice("0123456789") for _ in range(8))
            last = rng.choice("02468" if member else "13579")
            phone = digits + last
            meta = {"landholding_class": "small" if n_fields == 1 else "marginal-to-small", "primary_crop": crop}
            if partner:
                meta = {"primary_crop": crop, "role": "Varsapradaya partner farm (baseline control sites)"}
            f = a.post(PROG, "/farmers", json={
                "full_name": name, "phone": phone, "village": village, "district": district, "state": "Karnataka",
                "language": "kn", "fpo_id": fpos[fpo]["id"] if fpo else None, "meta": meta,
            })
            look = a.post(PROG, "/farmers/member-lookup", json={"phone": phone})
            member_farms = []
            if look["is_member"]:
                look = a.post(PROG, "/farmers/member-lookup", json={"phone": phone, "farmer_id": f["id"]})
                member_farms = look["farms"]
                members += 1
            self.farmers.append({**f, "crop": crop, "n_fields": n_fields, "member_farms": member_farms,
                                 "partner": partner})
        self.fpos = fpos
        self.farmer_by_name = {f["full_name"]: f for f in self.farmers}
        self.growers = [f for f in self.farmers if not f["partner"]]
        log(f"{len(fpos)} FPOs, {len(self.growers)} farmers + {len(PARTNERS)} partner farms, {members} linked to "
            "Varsapradaya membership")

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
                "template_id": tpl["id"], "language": "kn", "method": "otp", "otp_code": OTP})
        self.counts["agreements"] = len(self.farmers)
        log(f"template KRS-PA v1 published; {len(self.farmers)} agreements signed (Basavaraj signed himself)")

    # ------------------------------------------------------------------ farms, fields, land use, tenure
    def _site_attrs(self, crop: str, rng: random.Random, *, soil: bool = True) -> dict[str, Any]:
        r = REGIONS[crop]
        out = {"ecoregion": r["ecoregion"], "climate_zone": r["climate"], "land_cover": "cropland",
               "mean_annual_precip_mm": round(r["precip"] + rng.uniform(-35, 35))}
        if soil:
            out.update(soil_texture_class=r["texture"], wrb_soil_group=r["wrb"])
        return out

    def _land_use_and_tenure(self, fld: dict, holder: dict, mapper: str, *, kind: str = "owned",
                             valid_from: str = "2008-04-01", valid_to: str | None = None,
                             note_text: str = "") -> None:
        """Land-use history 2012–2026 and a tenure record with an RTC extract, verified by the programme."""
        a = self.api
        rtc = a.pdf(mapper, f"RTC-{fld['code']}.pdf", f"RTC (Pahani) extract — {fld['code']}", [
            f"Field: {fld['code']} ({fld['name']}), {fld['area_ha']:.2f} ha",
            f"Khatedar (holder): {holder['full_name']}",
            f"Tenure: {kind}" + (f" (lease valid {valid_from} to {valid_to})" if kind == "leased" else ""),
            "Land use recorded 2012-2026: agricultural (cropland), no conversion from forest or wetland.",
            f"Crop recorded: {fld.get('crop_code')}",
            "Issued by: Revenue Department, Government of Karnataka (Bhoomi) — demo copy",
        ], entity_type="field", entity_id=fld["id"])
        a.post(mapper, f"/fields/{fld['id']}/land-use", json={
            "from_year": 2012, "to_year": 2026, "land_use": "cropland", "evidence_id": rtc,
            "source": "RTC (Pahani) extract, Bhoomi", "notes": f"Continuously under {fld.get('crop_code')} since "
                                                              "at least 2012."})
        t = a.post(mapper, f"/fields/{fld['id']}/tenure", json={
            "holder_farmer_id": holder["id"], "kind": kind, "document_evidence_ids": [rtc],
            "valid_from": valid_from, "valid_to": valid_to, "notes": note_text})
        a.post(PROG, f"/tenure/{t['id']}/verify", json={
            "decision": "verified", "note": "RTC extract checked against Bhoomi; holder matches the farmer."})
        self.counts["tenure"] += 1

    def land(self) -> None:
        a, rng = self.api, self.rng
        from app.core.geo import square

        step("Farms, fields (Table 7 attributes), land-use history, verified tenure")
        by_crop: dict[str, list[dict]] = defaultdict(list)
        for f in self.growers:
            by_crop[f["crop"]].append(f)
        for crop, farmers in by_crop.items():
            r = REGIONS[crop]
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
                    lat, lon = offset(r["lat"], r["lon"], (row - 1) * 700 + rng.uniform(-45, 45),
                                      (col - 1.5) * 700 + rng.uniform(-45, 45))
                    side = rng.uniform(140, 260)
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
                    # two fields (coffee, paddy) take texture/WRB from the soil map later (suggestion applied by a
                    # person); every maize field has a Soil Health Card texture, so none relies on the map there
                    soil_from_map = slot == 2 and crop != "maize"
                    fld = a.post(mapper, "/fields", json={
                        "farm_id": farm["id"], "name": FIELD_NAMES[crop][j % 4],
                        "boundary": square(round(lat, 6), round(lon, 6), round(side, 1)), "crop_code": crop,
                        "crop_attributes": attrs, "soil_type": r["soil"],
                        **self._site_attrs(crop, rng, soil=not soil_from_map),
                    })
                    fld.update(crop=crop, farmer_id=fr["id"], farmer_name=fr["full_name"], mapper=mapper,
                               soil_from_map=soil_from_map)
                    self.fields.append(fld)
                    self.field_by_id[fld["id"]] = fld
        log(f"{len(self.growers)} farms, {len(self.fields)} fields "
            f"({', '.join(f'{c}: {sum(1 for x in self.fields if x['crop'] == c)}' for c in REGIONS)}), "
            f"{sum(f['area_ha'] for f in self.fields):.1f} ha; texture, WRB group, ecoregion, IPCC climate zone, "
            "precipitation and land cover recorded (Table 7)")

        leased = {"Gowramma Ningegowda", "Mallikarjuna S."}
        for fld in self.fields:
            holder = self.farmer_by_name[fld["farmer_name"]]
            if fld["farmer_name"] in leased:
                self._land_use_and_tenure(fld, holder, fld["mapper"], kind="leased", valid_from="2021-06-01",
                                          valid_to="2034-05-31", note_text="Registered 13-year lease from the "
                                          "family trust; covers the whole crediting period.")
            else:
                self._land_use_and_tenure(fld, holder, fld["mapper"], valid_from=f"{rng.randint(1995, 2015)}-04-01")
        log(f"land-use 2012–2026 with an RTC extract for every field; tenure recorded by the collectors and "
            f"verified by Karthik Gowda (four-eyes); {len(leased)} farmers on registered leases")

        enrolled = 0
        for fld in self.fields:
            self._enrol(self.pid, fld)
            enrolled += 1
        log(f"{enrolled} fields checked for eligibility (tenure, §4 applicability, consent) and enrolled in KRS-P1")

    def _enrol(self, project_id: str, fld: dict) -> None:
        e = self.api.post(PROG, f"/projects/{project_id}/enrolments", json={"field_id": fld["id"]})
        if e["status"] != "eligible":
            failed = [c["message"] for c in e["eligibility"]["checks"] if not c["passed"]]
            raise SeedError(f"Field {fld['code']} not eligible: {failed}")
        self.api.post(PROG, f"/projects/{project_id}/enrolments/{e['id']}/confirm")

    # ------------------------------------------------------------------ terrain and soil map
    def site_context(self) -> None:
        a = self.api
        step("DEM terrain (slope, aspect, Appendix 5 slope class) and soil-map suggestions")
        t = a.post(ANALYST, f"/projects/{self.pid}/terrain/refresh", json={"force": False})
        log(f"terrain for {t['fields']} fields ({t['fields_updated']} updated): {t['by_slope_class']}")
        applied = 0
        for fld in self.fields:
            if not fld["soil_from_map"]:
                continue
            s = a.post(ANALYST, f"/fields/{fld['id']}/soil-properties/refresh")
            a.post(fld["mapper"], f"/fields/{fld['id']}/soil-properties/apply", json={
                "suggestion_id": s["id"], "note": "No soil survey for this plot; soil-map value applied after a "
                                                  "texture-by-feel check in the field."})
            log(f"{fld['code']}: soil map suggests {s['soil_texture_class']} / {s['wrb_soil_group']} "
                f"(p={s['wrb_probability']}); refreshed by the analyst, applied by the collector")
            applied += 1
        for fld in self.fields[::5]:
            if not fld["soil_from_map"]:
                a.post(ANALYST, f"/fields/{fld['id']}/soil-properties/refresh")
        self.counts["soil_suggestions_applied"] = applied
        # reload field rows (terrain and soil columns)
        for fld in self.fields:
            fresh = a.get(ANALYST, f"/fields/{fld['id']}")
            fld.update({k: fresh[k] for k in ("slope_pct", "aspect_deg", "elevation_m", "slope_class",
                                              "soil_texture_class", "wrb_soil_group")})

    # ------------------------------------------------------------------ control sites
    def _qu_topography(self, crop: str) -> tuple[str, float | None]:
        from app.modules.controlsites import domain as cs

        flds = [f for f in self.fields if f["crop"] == crop]
        mode = cs.most_frequent([f["slope_class"] for f in flds], [f["area_ha"] for f in flds])
        aspects = [f["aspect_deg"] for f in flds if f["aspect_deg"] is not None]
        return mode, (cs.circular_mean(aspects) if aspects else None)

    def _find_control_plots(self, crop: str, side: float = 120.0) -> list[tuple[float, float]]:
        """Pick two plots on a partner farm 6–40 km from the QU whose DEM terrain matches Table 7."""
        from app.core.geo import square
        from app.modules.controlsites import domain as cs
        from app.modules.land.domain import HILLY_OR_STEEPER, slope_class
        from app.modules.supporting.terrain import SimulatedDEM, compute_terrain

        dem = SimulatedDEM()
        mode, aspect = self._qu_topography(crop)
        flds = [f for f in self.fields if f["crop"] == crop]
        clat = sum(f["centroid_lat"] for f in flds) / len(flds)
        clon = sum(f["centroid_lon"] for f in flds) / len(flds)

        def ok(lat: float, lon: float) -> bool:
            t = compute_terrain(square(round(lat, 6), round(lon, 6), side), dem)
            if slope_class(t.slope_mean_pct) != mode:
                return False
            if mode in HILLY_OR_STEEPER:
                return t.aspect_deg is not None and aspect is not None and cs.angle_diff(t.aspect_deg, aspect) <= 20
            return True

        for km in (6, 9, 12, 16, 20, 25, 30, 40):
            for bearing in range(0, 360, 20):
                lat, lon = offset(clat, clon, km * 1000 * math.cos(math.radians(bearing)),
                                  km * 1000 * math.sin(math.radians(bearing)))
                if not ok(lat, lon):
                    continue
                for dn, de in ((320, 0), (0, 320), (-320, 0), (0, -320), (230, 230), (-230, 230)):
                    lat2, lon2 = offset(lat, lon, dn, de)
                    if ok(lat2, lon2):
                        return [(lat, lon), (lat2, lon2)]
        raise SeedError(f"No partner-farm location matches the {crop} stratum terrain ({mode}).")

    def control_sites(self) -> None:
        a, rng = self.api, self.rng
        from app.core.geo import square

        step("Baseline control sites on Varsapradaya partner farms (Table 7 matched, ≤ 250 km)")
        for name, village, district, crop in PARTNERS:
            fr = self.farmer_by_name[name]
            r = REGIONS[crop]
            mapper = COL2 if crop == "rice" else COL1
            ext = fr["member_farms"][0] if fr["member_farms"] else None
            farm = a.post(PROG, "/farms", json={
                "farmer_id": fr["id"], "name": f"Varsapradaya partner farm, {village}", "village": village,
                "district": district, "state": "Karnataka", "external_farm_id": ext["external_farm_id"] if ext else None})
            fr["farm"] = farm
            qu = [f for f in self.fields if f["crop"] == crop]
            qu_precip = sum(f["mean_annual_precip_mm"] for f in qu) / len(qu)
            mode, _ = self._qu_topography(crop)
            attrs = {"variety": "robusta"} if crop == "coffee" else {"season": "kharif", "variety": "NAH-1137 (Hema)"} \
                if crop == "maize" else {"water_regime": "continuous", "variety": "MTU-1001"}
            if crop == "coffee":
                attrs.update(shade_type="silver_oak", plant_age_years=22)
            for k, (lat, lon) in enumerate(self._find_control_plots(crop)):
                fld = a.post(mapper, "/fields", json={
                    "farm_id": farm["id"], "name": f"Control plot {k + 1}",
                    "boundary": square(round(lat, 6), round(lon, 6), 120.0), "crop_code": crop,
                    "crop_attributes": attrs, "soil_type": r["soil"],
                    "ecoregion": r["ecoregion"], "climate_zone": r["climate"], "land_cover": "cropland",
                    "soil_texture_class": r["texture"], "wrb_soil_group": r["wrb"],
                    "mean_annual_precip_mm": round(qu_precip + rng.uniform(-25, 25)),
                })
                fld.update(crop=crop, farmer_id=fr["id"], farmer_name=fr["full_name"], mapper=mapper,
                           soil_from_map=False, control=True)
                self._land_use_and_tenure(fld, fr, mapper, valid_from="2004-04-01")
                self._enrol(self.pid, fld)
                a.post(ANALYST, f"/fields/{fld['id']}/terrain/refresh", json={"force": False})
                fresh = a.get(ANALYST, f"/fields/{fld['id']}")
                fld.update({k: fresh[k] for k in ("slope_pct", "aspect_deg", "elevation_m", "slope_class",
                                                  "centroid_lat", "centroid_lon")})
                self.controls.append(fld)
                self.field_by_id[fld["id"]] = fld
            qlat = sum(f["centroid_lat"] for f in qu) / len(qu)
            qlon = sum(f["centroid_lon"] for f in qu) / len(qu)
            from app.core.geo import distance_m

            ctl = [f for f in self.controls if f["crop"] == crop]
            km = distance_m(qlat, qlon, ctl[0]["centroid_lat"], ctl[0]["centroid_lon"]) / 1000
            log(f"{crop}: 2 control plots on {name}'s partner farm at {village}, {km:.1f} km from the QU; slope "
                f"class {ctl[0]['slope_class']} (QU {mode}); tenure verified; enrolled for stratification")

    # ------------------------------------------------------------------ strata
    def make_strata(self) -> None:
        step("Strata (project) and control strata (role control, control_for_code)")
        for crop, r in REGIONS.items():
            mode, _ = self._qu_topography(crop)
            criteria = {"crop": crop, "climate": r["climate"], "soil_type": r["wrb"], "soil_texture": r["texture"],
                        "slope_class": mode, "management": r["management"]}
            ids = [f["id"] for f in self.fields if f["crop"] == crop]
            st = self.api.post(ANALYST, f"/projects/{self.pid}/strata", json={
                "code": r["code"], "name": r["name"], "field_ids": ids, "effective_from": "2022-10-01",
                "criteria": criteria})
            st["crop"] = crop
            self.strata[crop] = st
            cids = [f["id"] for f in self.controls if f["crop"] == crop]
            ct = self.api.post(ANALYST, f"/projects/{self.pid}/strata", json={
                "code": r["ctrl"], "name": f"Control — {r['name']}", "role": "control", "control_for_code": r["code"],
                "field_ids": cids, "effective_from": "2022-10-01", "criteria": criteria})
            ct["crop"] = crop
            self.ctrl_strata[crop] = ct
            log(f"{r['code']} {r['name']}: {len(ids)} fields, {st['area_ha']:.1f} ha; {r['ctrl']}: {len(cids)} "
                f"control plots, {ct['area_ha']:.2f} ha; factors {sorted(criteria)}")

    # ------------------------------------------------------------------ Table 4 activity data
    def activity_data(self) -> None:
        a = self.api
        step("Table 4 activity data: look-back 2017–2021 (Box 1 tiers, attestations) and project 2022–2025")
        tiers: Counter = Counter()
        n_base = n_proj = n_att = 0
        all_fields = self.fields + self.controls
        for i, fld in enumerate(all_fields):
            is_ctrl = fld.get("control", False)
            tier = 2 if is_ctrl else (1, 2, 3)[i % 3]
            fk = {"idx": i, "factor": 1.0 if is_ctrl else round(self.rng.uniform(0.9, 1.1), 3),
                  "manure": (not is_ctrl) and fld["crop"] == "coffee" and i % 4 == 1}
            fld["fk"] = fk
            who = fld["mapper"]
            base_rows = {y: activity_rows(fld["crop"], "baseline", y, fld["area_ha"], fk) for y in LOOKBACK_YEARS}
            att_id = None
            evidence: list[str] = []
            source = ""
            if tier == 3:
                att = a.post(who, f"/projects/{self.pid}/fields/{fld['id']}/attestations", json={
                    "years": list(LOOKBACK_YEARS), "statement_lang": "kn", "method": "otp", "otp_code": OTP,
                    "declarations": [{"year": y, "category": c, "attributes": at}
                                     for y, rows in base_rows.items() for c, at in rows]})
                att_id = att["evidence_id"]
                n_att += 1
                source = "Farmer attestation (Box 1 tier 3), read out in Kannada; cross-checked with FPO input sales"
            else:
                label = ("Farm diary and input purchase receipts (RSK / FPO)" if tier == 1 else
                         "Estate / farm management plan (conservative value where a range is given)")
                evidence = [a.pdf(who, f"records-{fld['code']}-2017-2021.pdf", f"{label} — {fld['code']}", [
                    f"Field {fld['code']} ({fld['name']}), holder {fld['farmer_name']}",
                    "Years 2017–2021: crop, fertiliser (urea bags), tillage passes, irrigation, lime, diesel.",
                    "Box 1 tier " + str(tier) + (" — historical records with receipts" if tier == 1
                                                 else " — historical management plan"),
                ], entity_type="field", entity_id=fld["id"])]
                source = label + ", 2017–2021"
            for y, rows in base_rows.items():
                for cat, attrs in rows:
                    a.post(who, "/activity-records", json={
                        "project_id": self.pid, "field_id": fld["id"], "scenario": "baseline", "year": y,
                        "category": cat, "attributes": attrs, "data_tier": tier, "source_note": source,
                        "evidence_ids": evidence, "attestation_id": att_id})
                    n_base += 1
                    tiers[tier] += 1
            if tier != 3:  # the farmer still signs the qualitative answers (Box 1)
                a.post(who, f"/projects/{self.pid}/fields/{fld['id']}/attestations", json={
                    "years": list(LOOKBACK_YEARS), "statement_lang": "kn", "method": "otp", "otp_code": OTP})
                n_att += 1
            if is_ctrl:
                continue
            for y in PROJECT_YEARS:
                ev = a.pdf(who, f"project-{fld['code']}-{y}.pdf", f"Farm diary and input invoices {y} — {fld['code']}",
                           [f"Field {fld['code']}, {fld['farmer_name']}", f"Season {y}: fertiliser invoices, diesel "
                            "log, field-app practice photos.", "Recorded by the programme field officer."],
                           entity_type="field", entity_id=fld["id"])
                for cat, attrs in activity_rows(fld["crop"], "project", y, fld["area_ha"], fk):
                    a.post(who, "/activity-records", json={
                        "project_id": self.pid, "field_id": fld["id"], "scenario": "project", "year": y,
                        "category": cat, "attributes": attrs, "data_tier": 1, "evidence_ids": [ev],
                        "source_note": f"Project records {y}: invoices, diesel log and field-app photos"})
                    n_proj += 1
        self.counts.update(activity_baseline=n_base, activity_project=n_proj, attestations=n_att)
        log(f"{n_base} baseline records (Box 1 tiers {dict(sorted(tiers.items()))}) for {len(all_fields)} fields incl. 6 control plots; {n_proj} project records; "
            f"{n_att} farmer attestations signed by OTP")
        sched = a.get(ANALYST, f"/projects/{self.pid}/baseline-schedule")
        pc = a.get(ANALYST, f"/projects/{self.pid}/practice-change")
        log(f"baseline schedule: {sched['fields_ready']} of {len(sched['fields'])} fields ready (5-year look-back, "
            f"continuous crop); practice change (> 5 %): {pc['fields_qualifying']} fields qualify")
        if sched["fields_ready"] != len(sched["fields"]):
            bad = [(f["field_code"], f["warnings"], f["missing_items"][:3]) for f in sched["fields"] if not f["ready"]]
            raise SeedError(f"Baseline schedule not ready: {bad[:5]}")

    # ------------------------------------------------------------------ additionality
    def additionality(self) -> None:
        a = self.api
        step("Additionality (VM0042 §7): regulatory surplus, barriers, common practice")
        legal = a.pdf(PROG, "KRS-legal-review.pdf", "Regulatory surplus review — KRS-P1", [
            "No Indian, Karnataka or district law requires cover crops, compost, reduced tillage, residue",
            "retention or AWD on private farmland. Soil Health Card and PKVY schemes are voluntary.",
            "Reviewed by: legal counsel (demo)."], entity_type="project", entity_id=self.pid)
        invest = a.pdf(PROG, "KRS-barrier-investment.pdf", "Investment barrier — smallholder cash flow", [
            "Compost and cover-crop seed cost Rs 6,000–9,000/ha in the first two years; farmers fear a year-1 yield dip.",
            "Smallholders have no access to credit for soil-health practices (NABARD district credit plan)."],
            entity_type="project", entity_id=self.pid)
        know = a.pdf(PROG, "KRS-barrier-knowledge.pdf", "Technological / knowledge barrier", [
            "Fewer than 1 in 10 farmers in the three districts had any training in reduced tillage, AWD or",
            "compost quality (KVK survey 2021, demo)."], entity_type="project", entity_id=self.pid)
        census = a.pdf(PROG, "KA-cover-crop-adoption.pdf", "Adoption of cover crops, Karnataka", [
            "Agricultural Census 2015-16 and Karnataka Dept. of Agriculture input survey 2019-20:",
            "cover crops on 8 % of net sown area (demo figure)."], entity_type="project", entity_id=self.pid)
        compost = a.pdf(PROG, "KA-compost-adoption.pdf", "Compost use and essential distinction, Karnataka", [
            "Peer-reviewed study (demo): 26 % of holdings apply some compost or FYM.",
            "Only 1.3 M ha of 10.4 M ha net sown area receive >= 2.5 t/ha compost every year together with",
            "a >= 15 % cut in synthetic N — the project's essential distinction."],
            entity_type="project", entity_id=self.pid)
        body = {
            "regulatory_surplus": {
                "statement": "No law or regulation in India or Karnataka requires the project practices (cover crops, "
                             "compost, reduced tillage, residue retention, AWD) on private farmland; national and "
                             "state schemes (Soil Health Card, PKVY) are voluntary.",
                "legally_required": False, "evidence_ids": [legal]},
            "barriers": [
                {"type": "investment", "description": "Up-front cost of compost and cover-crop seed and the risk of a first-year "
                                                      "yield dip that smallholders cannot finance without carbon "
                                                      "revenue.", "evidence_ids": [invest]},
                {"type": "technological", "description": "Lack of know-how: few farmers have been trained in reduced "
                                                         "tillage, AWD or compost quality; the project funds FPO "
                                                         "facilitators.", "evidence_ids": [know]},
            ],
            "common_practice": [
                {"practice": "Cover crops", "region": "Karnataka", "adoption_pct": 8.0, "source_type": "census",
                 "source_reference": "Agricultural Census 2015-16; Karnataka input survey 2019-20 (demo)",
                 "evidence_ids": [census]},
                {"practice": "Compost + reduced synthetic N (stacked)", "region": "Karnataka", "adoption_pct": 26.0,
                 "source_type": "peer_reviewed", "source_reference": "Peer-reviewed survey of Karnataka holdings "
                                                                    "(demo)",
                 "evidence_ids": [compost],
                 "essential_distinction": {
                     "n_all_ha": 10_400_000, "n_diff_ha": 9_100_000, "evidence_ids": [compost],
                     "description": "Annual compost of at least 2.5 t/ha combined with a cut of at least 15 % in "
                                    "synthetic N; most compost users apply FYM irregularly and do not reduce urea."}},
            ],
        }
        ad = a.post(PROG, f"/projects/{self.pid}/additionality", json=body)
        ad = a.post(PROG, f"/projects/{self.pid}/additionality/{ad['id']}/submit")
        ad = a.post(SCI2, f"/projects/{self.pid}/additionality/{ad['id']}/approve",
                    json={"note": "Checked the census and survey sources; F = 12.5 % for the stacked practice."})
        steps = {s["code"]: s["status"] for s in ad["result"]["steps"]}
        log(f"version {ad['version']} submitted by Karthik Gowda, approved by Dr. Suresh Hegde: additional = "
            f"{ad['result']['additional']} {steps}; cover crops 8 % (step 3.1), compost stack 26 % → step 3.2 F = 12.5 %")

    # ------------------------------------------------------------------ lab, documents
    def make_lab(self) -> None:
        a = self.api
        step("Laboratory with VM0042 QC evidence")
        err = a.pdf(PROG, "SHL-BLR-analytical-error-2022.pdf", "Analytical error and internal QC report — SHL-BLR", [
            "Dry combustion (elemental analyser): repeatability 0.03 % SOC (n = 40 duplicates).",
            "Certified reference soil recovered at 99.2 %; NAPT round-robin 2022: z-score 0.4.",
            "Bulk density by core ring (ISO 11272:2017); ring volume 100 cm3, calibration SHL-CR-07."])
        self.lab = a.post(PROG, "/labs", json={
            "code": "SHL-BLR", "name": "Soil Health Laboratory, Bengaluru", "accreditation": "NABL (ISO/IEC 17025)",
            "accreditation_valid_until": "2027-12-31", "city": "Bengaluru", "contact_email": "lab@example.com",
            "iso17025": True, "proficiency_program": "NAPT", "analytical_error_report_id": err})
        a.patch(ADMIN, f"/users/{self.uid[LABTECH]}", json={"scope": {"lab_id": self.lab["id"]}})
        log(f"{self.lab['name']} (NABL ISO/IEC 17025, NAPT, error report attached; QC gaps: "
            f"{self.lab['qc_evidence_missing'] or 'none'}); labtech@ scoped to it")

    def documents(self) -> None:
        a = self.api
        step("Monitoring plan (§9) and data retention policies")
        pol = a.post(PROG, "/documents/retention-policies/install-defaults")
        plan_pdf = a.pdf(PROG, "KRS-P1-monitoring-plan-v1.pdf", "KRS-P1 Monitoring plan v1 (VM0042 v2.2 §9)", [
            "1 Tasks and roles: programme manager, MRV analyst, field collectors, lab, methodology owners.",
            "2 Accounting boundary: SOC (QA2, control sites), N2O fertiliser, fossil fuel and liming CO2 (QA3).",
            "3 Parameters: Table 4 activity data per field and year; SOC %, bulk density, coarse fraction and",
            "  fine-soil mass per increment (0-10, 10-20, 20-30, 30-50 cm); probe 21.5 mm, 4 cores/composite.",
            "4 Sample design: stratified random, paired re-visits in the same season (Nov-Dec), >= 5 per stratum.",
            "5 Control sites: 6 plots on 3 Varsapradaya partner farms, Table 7 demonstration, managed per the",
            "  baseline schedule of activities; location fixed for the project lifetime.",
            "6 Baseline re-evaluation every 10 years (recommended 5): due 2032-10-01.",
            "7 QA/QC: custody chain, 5-day shipping, dried storage, NABL lab, four-eyes approvals.",
            "8 Archiving: all records kept >= 2 years after the end of the last crediting period.",
        ], entity_type="project", entity_id=self.pid)
        doc = a.post(PROG, "/documents", json={
            "title": "KRS-P1 Monitoring plan", "kind": "monitoring_plan", "code": "KRS-P1-MP",
            "project_id": self.pid, "entity_type": "project", "entity_id": self.pid, "evidence_id": plan_pdf,
            "description": "VM0042 v2.2 §9 monitoring plan for Kaveri Soils — Phase 1.",
            "change_note": "First version for validation"})
        a.post(SCI, f"/documents/{doc['id']}/versions/1/approve",
               json={"decision": "approved", "note": "Covers every §9 item; archiving meets §9.3."})
        log(f"retention: {pol.get('installed', pol)}; monitoring plan {doc['code']} v1 by Karthik Gowda, approved by "
            "Dr. Meera Iyer")

    # ------------------------------------------------------------------ campaigns
    def campaign(self, *, code: str, name: str, kind: str, start: str, end: str, seed: int,
                 revisits: str | None, collect_from: date, collect_to: date, analysed_from: date,
                 analysed_to: date) -> dict:
        a, rng = self.api, self.rng
        step(f"Campaign {code} — {name}")
        body = {"code": code, "name": name, "kind": kind, "design": "paired", "planned_start": start,
                "planned_end": end, "depth_from_cm": 0, "depth_to_cm": 50, "placement_seed": seed,
                "season": "post-monsoon (Nov–Dec)"}
        if revisits:
            body["revisits_campaign_id"] = revisits
        camp = a.post(ANALYST, f"/projects/{self.pid}/campaigns", json=body)
        order: list[tuple[str, dict, bool]] = []
        for crop in REGIONS:
            order += [(crop, self.strata[crop], False), (crop, self.ctrl_strata[crop], True)]
        for crop, st, ctrl in order:
            n = 5 if ctrl else min(12, max(5, len(st["field_ids"])))
            just = (f"Control stratum {st['code']}: 5 composites across the two partner-farm plots (VM0042 §8.2: "
                    "at least one control site per stratum; 3–5 composites)." if ctrl else
                    f"One core per enrolled field in {st['code']} ({len(st['field_ids'])} fields), at least 5 and "
                    "capped at 12; Eq. 2 with pilot CV ~18 % gives MDD ≈ 0.12 % SOC at 90 % power.")
            if kind == "monitoring":
                just = f"Paired re-visit of every {st['code']} baseline site in the same season (VM0042 Eq. 71)."
            plan = a.post(ANALYST, f"/campaigns/{camp['id']}/sample-plans", json={
                "stratum_id": st["id"], "n_required": n, "method": "manual", "justification": just})
            a.post(SCI, f"/sample-plans/{plan['id']}/approve")
        placed = a.post(ANALYST, f"/campaigns/{camp['id']}/place-points")
        points = a.get(ANALYST, f"/campaigns/{camp['id']}/points")
        rice_codes = {REGIONS["rice"]["code"], REGIONS["rice"]["ctrl"]}
        split = {COL1: [p["id"] for p in points if p["stratum_code"] not in rice_codes],
                 COL2: [p["id"] for p in points if p["stratum_code"] in rice_codes]}
        for who, ids in split.items():
            if ids:
                a.post(ANALYST, f"/campaigns/{camp['id']}/assign", json={"user_id": self.uid[who], "point_ids": ids})
        a.post(ANALYST, f"/campaigns/{camp['id']}/status", json={"status": "fieldwork"})
        log(f"{len(order)} plans by Divya Shetty approved by Dr. Meera Iyer; {placed['points_created']} points "
            f"(seed {placed['seed']}); {len(split[COL1])} to Ravi Kumar, {len(split[COL2])} to Manjunath B.")

        # ---- field collection, region by region (project then its control stratum)
        stratum_order = [st["code"] for _, st, _ in order]
        points = sorted(points, key=lambda p: (stratum_order.index(p["stratum_code"]), p["sequence"]))
        crop_of = {st["code"]: crop for crop, st, _ in order}
        span = (collect_to - collect_from).days
        samples: list[dict] = []
        groups: dict[str, list[dict]] = defaultdict(list)
        for i, p in enumerate(points):
            crop = crop_of[p["stratum_code"]]
            who = COL2 if crop == "rice" else COL1
            fld = self.field_by_id[p["field_id"]]
            self.site_field[p["site_id"]] = p["field_id"]
            day = collect_from + timedelta(days=round(i * span / max(1, len(points) - 1)))
            collected = datetime(day.year, day.month, day.day, 8, 30, tzinfo=IST) + timedelta(
                minutes=75 * (i % 5) + rng.randint(0, 20))
            lat, lon = near_site(rng, p["latitude"], p["longitude"], fld["boundary"])
            photos = [a.upload(who, f"{p['site_code']}-{code}-{k + 1}.jpg",
                               jpeg_bytes(rng, f"{p['site_code']} {k + 1}"), "image/jpeg", "photo", lat, lon,
                               entity_type="sample") for k in range(3)]
            layers = [{"depth_from_cm": d0, "depth_to_cm": d1, "label_qr": f"QR-{code}-{p['site_code']}-D{n + 1}"}
                      for n, (d0, d1) in enumerate(DEPTHS)]
            res = a.post(who, "/samples", json={
                "client_ref": f"fieldapp-{who.split('@')[0]}-{code}-{p['sequence']:03d}",
                "point_id": p["id"], "collected_at": collected.isoformat(), "latitude": lat, "longitude": lon,
                "gps_accuracy_m": round(rng.uniform(2.5, 4.5), 1), "depth_reached_cm": 50, "layers": layers,
                "photo_ids": photos, "device_id": "tab-ravi-01" if who == COL1 else "tab-manju-02",
                "probe_diameter_mm": PROBE_MM, "cores_composited": CORES,
                "core_depths_reached_cm": [50.0] * CORES,
            })
            smp = res["sample"]
            blocking = [f for f in res["findings"] if f["severity"] == "blocking"]
            if blocking:
                raise SeedError(f"Sample {smp['code']} has blocking findings: {blocking}")
            s = {"id": smp["id"], "code": smp["code"], "who": who, "collected": collected,
                 "site_id": p["site_id"], "site_code": p["site_code"], "crop": crop, "field_id": fld["id"],
                 "control": fld.get("control", False),
                 "layers": sorted(smp["layers"], key=lambda x: x["depth_from_cm"])}
            samples.append(s)
            groups[crop].append(s)
        self.counts["photos"] += 3 * len(samples)
        log(f"{len(samples)} composite cores ({CORES} cores, {PROBE_MM} mm probe) collected "
            f"{collect_from:%d %b}–{collect_to:%d %b %Y} to 50 cm in 4 increments, 3 photos each")

        # ---- custody (field side) and shipment: one lab batch per district, shipped the day after its last core
        batches = []
        for crop, ss in groups.items():
            last = max(s["collected"] for s in ss)
            ship = datetime(last.year, last.month, last.day, 10, 0, tzinfo=IST) + timedelta(days=1)
            for s in ss:
                t = s["collected"]
                s["shipped"] = ship
                for ev, dt, loc in (("packed", t + timedelta(hours=3), "Field camp"),
                                    ("dispatched", ship, f"{REGIONS[crop]['district']} taluk office, courier pick-up"),
                                    ("courier_received", ship + timedelta(hours=20), "Courier hub, Bengaluru")):
                    a.post(s["who"], f"/samples/{s['id']}/custody", json={
                        "event": ev, "occurred_at": dt.isoformat(), "location": loc})
            b = a.post(ANALYST, "/lab-batches", json={
                "lab_id": self.lab["id"], "campaign_id": camp["id"],
                "layer_ids": [lay["id"] for s in ss for lay in s["layers"]]})
            a.post(ANALYST, f"/lab-batches/{b['id']}/dispatch", json={"dispatched_on": ship.date().isoformat()})
            batches.append(b)

        # ---- lab side: receipt, preparation, analysis, results
        results: list[tuple[str, str]] = []
        a_span = (analysed_to - analysed_from).days
        for i, s in enumerate(samples):
            received = s["shipped"] + timedelta(days=1, hours=4)
            analysed_on = analysed_from + timedelta(days=round(i * a_span / max(1, len(samples) - 1)))
            analysed_on = max(analysed_on, (received + timedelta(days=5)).date())
            analysed = datetime(analysed_on.year, analysed_on.month, analysed_on.day, 15, 0, tzinfo=IST)
            opened = max(received + timedelta(hours=2), analysed - timedelta(days=4))
            prepared = opened + timedelta(days=2)
            for ev, when, extra in (
                ("lab_received", received, {"seal_intact": True, "count_matches": True, "notes": "4 bags, seals "
                                            "intact", "storage": {"condition": "dried"}}),
                ("opened", opened, {"notes": "Bags opened; air-drying at 40 °C"}),
                ("prepared", prepared, {"notes": "Air-dried, 2 mm sieved (stones and roots removed), ground"}),
                ("analysed", analysed, {}),
            ):
                a.post(LABTECH, f"/samples/{s['id']}/custody", json={
                    "event": ev, "occurred_at": when.isoformat(), "location": self.lab["name"], **extra})
            values = self.lab_values(s, kind)
            cert = pdf_bytes(f"Test certificate {s['code']}", [
                f"Laboratory: {self.lab['name']} — NABL (ISO/IEC 17025), NAPT participant",
                f"Sample: {s['code']}  Site: {s['site_code']}  Composite of {CORES} cores, probe {PROBE_MM} mm",
                f"Campaign: {code}   Collected: {s['collected']:%d %b %Y}   Analysed: {analysed_on:%d %b %Y}",
                "Methods: SOC by dry combustion (elemental analyser); bulk density by core ring;",
                "         coarse fraction and fine-soil mass (< 2 mm, oven-dry) gravimetric.", "",
                *[f"{lay['code']} ({lay['depth_from_cm']:g}-{lay['depth_to_cm']:g} cm): SOC {v['soc']:.2f} %, "
                  f"BD {v['bd']:.2f} g/cm3, coarse {v['cf']:.3f}, fine mass {v['fsm']:.1f} g"
                  for lay, v in zip(s["layers"], values)],
                "", "Authorised signatory: Lakshmi Nair (demo)"])
            for lay, v in zip(s["layers"], values):
                for analyte, value, unit, method in (("soc_pct", v["soc"], "%", "dry_combustion"),
                                                     ("bulk_density_g_cm3", v["bd"], "g/cm3", "core_ring"),
                                                     ("coarse_fraction", v["cf"], "fraction", "gravimetric"),
                                                     ("fine_soil_mass_g", v["fsm"], "g", "oven_dry_sieved")):
                    r = a.post(LABTECH, "/lab-results", json={
                        "layer_id": lay["id"], "analyte": analyte, "value": value, "unit": unit, "method": method,
                        "analysed_on": analysed_on.isoformat(), "purpose": "primary"})
                    a.post(LABTECH, f"/lab-results/{r['id']}/certificate",
                           files={"file": (f"certificate-{s['code']}.pdf", cert, "application/pdf")})
                    results.append((r["id"], analyte))
            if kind == "baseline":  # particle size once, at baseline, for the Table 7 average texture (0–30 cm)
                for lay, (sand, clay) in zip(s["layers"], self.texture_values(s["field_id"])):
                    for analyte, value in (("texture_sand_pct", sand), ("texture_clay_pct", clay)):
                        r = a.post(LABTECH, "/lab-results", json={
                            "layer_id": lay["id"], "analyte": analyte, "value": value, "unit": "%",
                            "method": "pipette_iso11277", "analysed_on": analysed_on.isoformat(),
                            "purpose": "primary"})
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
        log("custody collected→packed→dispatched (district batch, day after its last core)→courier_received→"
            "lab_received (seal/count, dried)→opened→prepared→analysed; batches "
            + ", ".join(f"{b['code']} ({b['bag_count']} bags)" for b in batches))
        log(f"{len(results)} lab results (SOC, BD, coarse fraction, fine-soil mass) by Lakshmi Nair with PDF "
            "certificates, accepted by Arun Prakash")
        camp["samples"] = samples
        return camp

    # sand / clay (%) at the centre of each recorded FAO/USDA class; clay rises a little with depth
    TEXTURE_CENTRES = {"clay_loam": (32.0, 33.0), "sandy_loam": (65.0, 12.0), "loam": (41.0, 20.0),
                       "sandy_clay_loam": (56.0, 26.0), "clay": (25.0, 50.0), "silty_clay_loam": (10.0, 33.0)}

    def texture_values(self, field_id: str) -> list[tuple[float, float]]:
        """Particle-size results (sand %, clay %) for 0–10, 10–20 and 20–30 cm, consistent with the field's
        recorded texture class (stable per field, so every sample of a field agrees)."""
        cache = self.__dict__.setdefault("_texture", {})
        if field_id not in cache:
            cls = (self.field_by_id[field_id].get("soil_texture_class") or "").strip().lower().replace(" ", "_")
            if cls not in self.TEXTURE_CENTRES:
                raise SeedError(f"No texture centre for class {cls!r}")
            sand0, clay0 = self.TEXTURE_CENTRES[cls]
            sand0 += self.trng.uniform(-2.0, 2.0)
            clay0 += self.trng.uniform(-1.5, 1.5)
            cache[field_id] = [(round(sand0 - k * 1.0, 1), round(clay0 + k * 1.5, 1)) for k in range(3)]
        return cache[field_id]

    def lab_values(self, s: dict, kind: str) -> list[dict]:
        """Per-layer SOC / bulk density / coarse fraction / Eq. 3 fine-soil mass.

        Site properties are stable between campaigns. Control plots start at the project stratum mean
        (Table 7: SOC not significantly different) and stay flat or decline slightly (baseline practice);
        project sites gain with the practices (coffee most, maize least, two fields slightly down)."""
        rng = self.rng
        site = s["site_id"]
        if kind == "baseline":
            crop = s["crop"]
            if s["control"]:
                proj = [p["layers"][0]["soc"] for p in self.site_props.values() if p["crop"] == crop and not p["control"]]
                top = sum(proj) / len(proj) * rng.uniform(0.95, 1.05)
            else:
                top = {"coffee": rng.uniform(1.6, 2.4), "maize": rng.uniform(0.8, 1.3), "rice": rng.uniform(1.0, 1.5)}[crop]
            socs = [top, top * rng.uniform(0.74, 0.82)]
            socs.append(socs[-1] * rng.uniform(0.74, 0.82))
            socs.append(socs[-1] * rng.uniform(0.62, 0.72))
            bd0 = rng.uniform(1.15, 1.30)
            cf0 = rng.uniform(0.02, 0.08)
            props = []
            for k, x in enumerate(socs):
                bd = round(min(1.48, bd0 + k * rng.uniform(0.03, 0.05)), 2)
                cf = round(min(0.14, cf0 + k * rng.uniform(0.0, 0.015)), 3)
                d0, d1 = DEPTHS[k]
                props.append({"soc": round(x, 2), "bd": bd, "cf": cf, "fsm": fine_soil_mass_g(bd, d1 - d0, cf)})
            self.site_props[site] = {"crop": crop, "control": s["control"], "layers": props}
            return props
        base = self.site_props[site]
        crop = base["crop"]
        if base["control"]:
            delta = rng.gauss(-0.015, 0.012)
        elif self.site_field[site] in self.decliners:
            delta = rng.uniform(-0.05, -0.02)
        else:
            mean, sd = {"coffee": (0.11, 0.03), "rice": (0.08, 0.025), "maize": (0.055, 0.02)}[crop]
            delta = max(0.02, rng.gauss(mean, sd))
        out = []
        for k, lay in enumerate(base["layers"]):
            share = (1.0, 0.55, 0.3, 0.1)[k]
            bd = round(min(1.48, max(1.10, lay["bd"] + rng.gauss(0, 0.006))), 2)
            cf = round(min(0.14, max(0.02, lay["cf"] + rng.gauss(0, 0.002))), 3)
            d0, d1 = DEPTHS[k]
            out.append({"soc": round(max(0.15, lay["soc"] + delta * share + rng.gauss(0, 0.008)), 2), "bd": bd,
                        "cf": cf, "fsm": fine_soil_mass_g(bd, d1 - d0, cf)})
        return out

    # ------------------------------------------------------------------ control-site links and assessment
    def control_links(self) -> None:
        a = self.api
        step("Control-site links (management plans) and Table 7 assessment")
        existing = {(lk["control_stratum_id"], lk["project_stratum_id"])
                    for lk in a.get(PROG, f"/projects/{self.pid}/control-sites") if lk["status"] == "active"}
        if existing:
            note(f"{len(existing)} control-site link(s) already existed before the seed linked them "
                 "(created by another session); duplicates were not re-created.")
        for crop, ct in self.ctrl_strata.items():
            if (ct["id"], self.strata[crop]["id"]) in existing:
                continue
            partner = next(f for f in self.controls if f["crop"] == crop)
            plan = a.pdf(PROG, f"control-plan-{ct['code']}.pdf", f"Control-site management plan — {ct['code']}", [
                f"Partner farm: {partner['farmer_name']} (Varsapradaya); plots {', '.join(f['code'] for f in self.controls if f['crop'] == crop)}",
                f"Managed per the baseline schedule of activities of {REGIONS[crop]['code']} (2017–2021 practices):",
                f"  {REGIONS[crop]['management']}; no project practices introduced.",
                "Boundaries fixed and GPS-marked for the project lifetime; 120 x 120 m plots avoid edge effects.",
                "Table 7 demonstration: slope class, FAO texture, WRB group, SOC (Welch t-test), 5-year ALM,",
                "ecoregion, IPCC climate zone and precipitation (+/- 100 mm) — see the platform assessment."],
                entity_type="stratum", entity_id=ct["id"])
            a.post(PROG, f"/projects/{self.pid}/control-sites", json={
                "control_stratum_id": ct["id"], "project_stratum_id": self.strata[crop]["id"],
                "managed_by": f"Varsapradaya Agri Carbon — partner farm of {partner['farmer_name']}",
                "management_plan_evidence_id": plan,
                "notes": "Location fixed at linking; plots managed per the baseline schedule of activities."})
        res = a.post(PROG, f"/projects/{self.pid}/control-sites/assess")
        per_link = []
        for lk in res["links"]:
            bad = [f"{c['code']}={c['status']}" for c in lk["criteria"] if c["status"] not in ("pass", "not_applicable")]
            per_link.append(f"{lk.get('control_stratum')}: {lk['overall']}" + (f" ({', '.join(bad)})" if bad else ""))
        log(f"assessment {res['overall']}: " + "; ".join(per_link))
        for c in res["project_checks"]:
            log(f"{c['code']}: {c['status']} — {c['message']}")
        if res["overall"] != "pass" or any(lk["overall"] != "pass" for lk in res["links"]):
            raise SeedError(f"Control-site assessment is '{res['overall']}': {per_link}")
        tex = {lk.get("control_stratum"): next(c for c in lk["criteria"] if c["code"] == "soil_texture")
               for lk in res["links"]}
        log("texture basis: " + ", ".join(f"{k} {v['details'].get('basis')} ({v['details'].get('control')})"
                                          for k, v in tex.items()))
        self.control_assessment = res

    # ------------------------------------------------------------------ woody biomass (shade trees, Eq. 48–51)
    # species, share of trees, DBH range at BL22 (cm), height = h0 + hk × DBH (m), DBH growth (cm/yr)
    SHADE_TREES = (("Grevillea robusta (silver oak)", 0.62, (16.0, 38.0), (6.0, 0.36), (0.35, 0.55)),
                   ("Artocarpus heterophyllus (jackfruit)", 0.18, (18.0, 42.0), (5.0, 0.22), (0.25, 0.40)),
                   ("Ficus racemosa (cluster fig)", 0.20, (24.0, 60.0), (7.0, 0.20), (0.30, 0.50)))
    WOODY_BL, WOODY_MON = date(2022, 12, 6), date(2025, 12, 4)

    def _shade_inventory(self) -> list[dict]:
        rng = self.trng
        trees = []
        for _ in range(rng.randint(3, 5)):
            r, acc = rng.random(), 0.0
            for sp, share, (d0, d1), (h0, hk), growth in self.SHADE_TREES:
                acc += share
                if r <= acc:
                    break
            dbh = round(rng.uniform(d0, d1), 1)
            trees.append({"species": sp, "dbh_cm": dbh, "height_m": round(h0 + hk * dbh + rng.uniform(-1.2, 1.2), 1),
                          "count": 1, "_growth": growth})
        return trees

    def _regrow(self, trees: list[dict], years: float, factor: float) -> list[dict]:
        rng = self.trng
        return [{"species": t["species"], "dbh_cm": round(t["dbh_cm"] + rng.uniform(*t["_growth"]) * years * factor, 1),
                 "height_m": round(t["height_m"] + rng.uniform(0.10, 0.20) * years * factor, 1), "count": 1}
                for t in trees]

    def woody_biomass(self) -> None:
        a, rng = self.api, self.trng
        step("Woody biomass: shade-tree permanent plots in the coffee stratum (AR-TOOL14, Eq. 48–51)")
        pub = a.pdf(SCI, "Chave-2014-pantropical-allometry.pdf", "Allometric equation — Chave et al. (2014)", [
            "Chave J., Rejou-Mechain M., Burquez A. et al. (2014) Improved allometric models to estimate the",
            "aboveground biomass of tropical trees. Global Change Biology 20: 3177-3190.",
            "Eq. 4 (pan-tropical, with height): AGB = 0.0673 x (rho D^2 H)^0.976  [kg; D cm, H m, rho g/cm3].",
            "Project inputs (DEMO - replace before real use): wood density 0.55 g/cm3 for all shade species;",
            "root:shoot 0.20 (IPCC 2006 Vol 4 Table 4.4, tropical moist deciduous forest, AGB < 125 t/ha).",
        ], entity_type="project", entity_id=self.pid)
        model = a.post(ANALYST, f"/projects/{self.pid}/allometric-models", json={
            "species": "*", "form": "rho_d2h", "params": {"a": 0.0673, "b": 0.976, "wood_density": 0.55},
            "output_unit": "kg", "dbh_min_cm": 5, "dbh_max_cm": 150, "root_shoot_ratio": 0.20,
            "source": "Chave et al. (2014) Global Change Biology 20: 3177–3190, Eq. 4 pan-tropical model "
                      "AGB = 0.0673 × (ρD²H)^0.976 (kg; D cm, H m). Generic equation for every shade species. "
                      f"Wood density 0.55 g/cm³ and root:shoot 0.20 (IPCC 2006 Vol 4 Table 4.4): {DEMO_SRC}.",
            "evidence_ids": [pub]})
        a.post(SCI2, f"/allometric-models/{model['id']}/approve")
        log("generic allometric model (Chave et al. 2014 Eq. 4, ρD²H form, roots via R = 0.20) entered by Divya "
            "Shetty, approved by Dr. Suresh Hegde")

        camps = {}
        for code, when, txt in (("WB-BL22", self.WOODY_BL, "Shade-tree inventory with the BL22 soil campaign"),
                                ("WB-MON25", self.WOODY_MON, "Shade-tree re-measurement with MON25 (same plots)")):
            camps[code] = a.post(ANALYST, f"/projects/{self.pid}/biomass/campaigns",
                                 json={"code": code, "measured_on": when.isoformat(), "note": txt})
        years = (self.WOODY_MON - self.WOODY_BL).days / 365.25
        coffee = [f for f in self.fields if f["crop"] == "coffee"]
        plots: list[tuple[dict, dict, float]] = []  # (plot, field, growth factor)
        for k, fld in enumerate(sorted(rng.sample(coffee, 8), key=lambda f: f["code"])):
            lat, lon = offset(fld["centroid_lat"], fld["centroid_lon"], rng.uniform(-20, 20), rng.uniform(-20, 20))
            p = a.post(ANALYST, f"/projects/{self.pid}/biomass/plots", json={
                "stratum_id": self.strata["coffee"]["id"], "field_id": fld["id"], "code": f"WB-S{k + 1:02d}",
                "scenario": "project", "area_m2": 500, "latitude": round(lat, 7), "longitude": round(lon, 7)})
            plots.append((p, fld, 1.0))  # project: shade trees retained, light lopping only
        ctrl = [f for f in self.controls if f["crop"] == "coffee"]
        for k in range(4):
            fld = ctrl[k % 2]
            lat, lon = offset(fld["centroid_lat"], fld["centroid_lon"], (-25 if k < 2 else 25), rng.uniform(-15, 15))
            p = a.post(ANALYST, f"/projects/{self.pid}/biomass/plots", json={
                "stratum_id": self.ctrl_strata["coffee"]["id"], "field_id": fld["id"], "code": f"WB-C{k + 1:02d}",
                "scenario": "baseline", "area_m2": 500, "latitude": round(lat, 7), "longitude": round(lon, 7)})
            plots.append((p, fld, 0.7))  # baseline practice: silver oak lopped hard every year before the monsoon
        n_trees = 0
        for p, fld, factor in plots:
            t0 = self._shade_inventory()
            t1 = self._regrow(t0, years, factor)
            for code, trees in (("WB-BL22", t0), ("WB-MON25", t1)):
                when = camps[code]["measured_on"]
                sheet = a.pdf(COL1, f"tree-sheet-{p['code']}-{code}.pdf", f"Shade-tree field sheet {p['code']} - {code}",
                              [f"Plot {p['code']} ({p['scenario']}), 500 m2 circular plot (r 12.6 m), field "
                               f"{fld['code']} ({fld['farmer_name']}); measured {when}.",
                               "DBH at 1.3 m with a diameter tape; height with a clinometer; trees >= 5 cm DBH.",
                               *[f"  {i + 1}. {t['species']}: DBH {t['dbh_cm']:.1f} cm, H {t['height_m']:.1f} m"
                                 for i, t in enumerate(trees)],
                               "Recorded by Ravi Kumar; no tree felled or harvested on the plot."],
                              entity_type="field", entity_id=fld["id"])
                a.post(ANALYST, "/biomass/measurements", json={
                    "campaign_id": camps[code]["id"], "plot_id": p["id"], "evidence_ids": [sheet],
                    "trees": [{k: v for k, v in t.items() if not k.startswith("_")} for t in trees],
                    "note": f"Entered from Ravi Kumar's field sheet by Divya Shetty ({code})."})
                n_trees += len(trees)
        log(f"campaigns WB-BL22 ({self.WOODY_BL}) and WB-MON25 ({self.WOODY_MON}), {years:.2f} years apart (≤ 5, "
            f"§9.2); 8 project plots in S-COF and 4 baseline plots on the C-COF control plots; {n_trees} tree "
            "measurements from field sheets")

        self.woody = {}
        for scenario in ("project", "baseline"):
            body = {"scenario": scenario, "from_campaign_id": camps["WB-BL22"]["id"],
                    "to_campaign_id": camps["WB-MON25"]["id"], "period_label": PERIOD_LABEL,
                    "period_start": PERIOD_START, "period_end": PERIOD_END}
            out = a.post(ANALYST, f"/projects/{self.pid}/biomass/publish-term", json=body)
            term = a.post(SCI2, f"/terms/{out['term']['id']}/approve")
            res = out["result"]
            self.woody[scenario] = term["value_t_co2e"]
            st = res["strata"][0]
            log(f"{res['term']} ({'/'.join(res['equations'])}): {st['stratum_code']} trees "
                f"{st['tree_t_co2e_ha_start']:.1f} → {st['tree_t_co2e_ha_end']:.1f} t CO2e/ha, scaled to "
                f"{st['area_ha']:.1f} ha → {res['annual_t_co2e']:.1f} t CO2e/yr × {res['credited_years']:.2f} yr = "
                f"{term['value_t_co2e']:.1f} t CO2e; published by Divya Shetty, approved by Dr. Suresh Hegde")
        if self.woody["project"] <= self.woody["baseline"]:
            raise SeedError(f"Woody biomass: project gain not above baseline: {self.woody}")
        link = next(lk for lk in a.get(PROG, f"/projects/{self.pid}/control-sites")
                    if lk["control_stratum_id"] == self.ctrl_strata["coffee"]["id"] and lk["status"] == "active")
        a.patch(PROG, f"/projects/{self.pid}/control-sites/{link['id']}", json={
            "notes": ((link.get("notes") or "") + " Shade-tree permanent plots WB-C01–WB-C04 on these plots give the "
                      "woody-biomass baseline (Eq. 48); silver oak is lopped every year as in the baseline "
                      "schedule.").strip()})
        log("C-COF control-site link updated (PATCH) to record the shade-tree baseline plots")

    # ------------------------------------------------------------------ leakage records (§8.4.2–8.4.4)
    def leakage(self) -> None:
        a = self.api
        step("Leakage records: biomass residues (TOOL16) ruled out; no production decline (§8.4.2(b))")
        coffee_ha = sum(f["area_ha"] for f in self.fields if f["crop"] == "coffee")
        rice_ha = sum(f["area_ha"] for f in self.fields if f["crop"] == "rice")
        years = len(PROJECT_YEARS) - 1  # 2023–2025: project practices
        att = a.pdf(PROG, "KRS-residue-use-attestation.pdf", "Residue use before the project - farmer attestations", [
            "Kodagu Coffee Growers FPO meeting, 14 Jan 2023: all 7 coffee growers attest that coffee prunings and",
            "shade-tree loppings were mulched or left in the inter-rows before the project and were never sold or",
            "burnt for energy; household cooking uses LPG and purchased firewood.",
            "Mandya Paddy Producers FPO: paddy straw was baled for cattle fodder or sold as fodder; no straw is",
            "used for energy (no biomass boiler or brick-kiln buyer in the taluk). Signed attestations attached.",
        ], entity_type="project", entity_id=self.pid)
        survey = a.pdf(PROG, "KRS-household-energy-survey-2022.pdf", "FPO household energy survey 2022 (demo)", [
            "21 households surveyed (Oct 2022): cooking fuel LPG 18, LPG + purchased firewood 3; crop residues",
            "used as fuel: none reported. Coffee prunings: mulch 100 %. Paddy straw: fodder 82 %, sold 18 %.",
        ], entity_type="project", entity_id=self.pid)
        rows = [
            ("Coffee prunings and shade-tree loppings", round(1.2 * coffee_ha * years * 0.85, 1),
             "Not used for energy: mulched or left in the inter-rows before the project (FPO attestation).",
             "TOOL16 leakage ruled out: the residue had no energy use in the baseline, so retaining it as mulch "
             "displaces no fuel. Farmer attestations and the 2022 household energy survey are attached."),
            ("Paddy straw retained in the field", round(5.2 * rice_ha * 0.40 * years * 0.88, 1),
             "Baled for cattle fodder or sold as fodder; never used as fuel in Mandya (FPO attestation, survey).",
             "TOOL16 covers residues diverted from energy applications only. The straw went to fodder, not energy, "
             "so no fossil fuel replaces it; leakage is ruled out (fodder supply is unaffected at FPO scale)."),
        ]
        for rtype, qty, use, reason in rows:
            a.post(ANALYST, f"/projects/{self.pid}/leakage/residues", json={
                "period_label": PERIOD_LABEL, "residue_type": rtype, "baseline_energy_use": use,
                "quantity_t_dry": qty, "leakage_ruled_out": True, "ruled_out_reason": reason,
                "evidence_ids": [att, survey], "note": "Quantity: residue retained 2023–2025 (t dry matter)."})
        le = a.post(ANALYST, f"/projects/{self.pid}/leakage/residues/compute", json={"period_label": PERIOD_LABEL})
        log(f"{len(rows)} residue records ({', '.join(f'{q:g} t' for _, q, _, _ in rows)}), both ruled out with "
            f"attestations and a survey: LE_BR preview = {le['value_t_co2e']:.2f} t CO2e")

        # production per commodity from the activity data (yield × area of every enrolled field)
        units = {"coffee": "t green coffee", "maize": "t maize grain", "rice": "t paddy"}

        def production(crop: str, scenario: str, year: int) -> float:
            tot = 0.0
            for f in (x for x in self.fields if x["crop"] == crop):
                row = dict(activity_rows(crop, scenario, year, f["area_ha"], f["fk"]))["crop"]
                tot += row["yield_t_ha"] * f["area_ha"]
            return tot

        base = {c: sum(production(c, "baseline", y) for y in LOOKBACK_YEARS) / len(LOOKBACK_YEARS) for c in units}
        for y in PROJECT_YEARS:
            comm = [{"commodity": c, "unit": units[c], "baseline_production": round(base[c], 2),
                     "project_production": round(production(c, "project", y), 2)} for c in units]
            ev = a.pdf(ANALYST, f"KRS-production-{y}.pdf", f"Production summary {y} - KRS-P1", [
                f"Season {y}: production of the enrolled fields from farm diaries and FPO procurement records.",
                *[f"  {c['commodity']}: {c['project_production']:.1f} {c['unit']} (2017-2021 average "
                  f"{c['baseline_production']:.1f})" for c in comm],
                "Livestock: none kept on enrolled fields in the baseline or the project (no grazing; Table 4).",
            ], entity_type="project", entity_id=self.pid)
            a.post(ANALYST, f"/projects/{self.pid}/leakage/displacement", json={
                "year": y, "mode": "no_decrease", "commodities": comm, "livestock": [],
                "statement": f"{y}: production of coffee, maize and paddy at or above the 2017–2021 average "
                             "(farm diaries, FPO procurement); no livestock on enrolled fields, so none displaced.",
                "evidence_ids": [ev]})
        lk = a.post(ANALYST, f"/projects/{self.pid}/leakage/displacement/compute", json={
            "period_label": PERIOD_LABEL, "period_start": PERIOD_START, "period_end": PERIOD_END})
        log(f"displacement records {PROJECT_YEARS[0]}–{PROJECT_YEARS[-1]} (mode no_decrease, no livestock): "
            f"LK_disp preview = {lk['value_t_co2e']:.2f} t CO2e (all years no decrease: {lk['all_no_decrease']})")
        log("terms not published: the rule pack does not require LE_BR / LK_disp terms and both previews are zero; "
            "Eq. 33 organic-amendment leakage comes from the activity data")

    # ------------------------------------------------------------------ QA1 model register (illustration)
    def qa1_illustration(self) -> None:
        a = self.api
        step("QA1 model register: one draft model (illustration only — KRS-P1 stays QA2)")
        m = a.post(SCI, "/qa1/models", json={
            "name": "DEMO — DayCent illustration (not used by KRS-P1)", "version": "illustration-1",
            "public_source": "DayCent ecosystem model, Natural Resource Ecology Laboratory, Colorado State University "
                             "(publicly documented; access details to be completed)",
            "publicly_available": True,
            "peer_review_refs": ["Parton W.J., Hartman M., Ojima D., Schimel D. (1998) DAYCENT and its land surface "
                                 "submodel: description and testing. Global and Planetary Change 19: 35–48."],
            "parameter_set": {"status": "placeholder — not calibrated (DEMO)"},
            "parameter_sources": DEMO_SRC + ": no calibration has been done; parameters to be documented.",
            "validation_domain": {"crop_functional_groups": ["grasses_cereals"],
                                  "practice_categories": ["fertilizer_management", "tillage_residue"],
                                  "climate_zones": ["tropical_dry"], "soil_textures": ["sandy_loam"]},
            "pools": ["soc", "n2o_soil"],
            "notes": "Illustration for the QA1 model register screen only. KRS-P1 quantifies SOC with QA2 (measure "
                     "and re-measure with control sites) and soil N2O with QA3; this model is a draft, has no "
                     "validation report or IME assessment, and no QA1 runs or terms exist for any project."})
        log(f"draft model '{m['name']}' by Dr. Meera Iyer; {len(m['approval_problems'])} item(s) block approval "
            "(validation report, IME assessment, prediction errors) — left as a draft on purpose")

    # ------------------------------------------------------------------ practices (field app)
    def practices(self) -> None:
        a, rng = self.api, self.rng
        step("Practice records from the field app (project 2023–2025, baseline 2021)")
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

        d = date
        by_crop = defaultdict(list)
        for f in self.fields:
            by_crop[f["crop"]].append(f)
        for i, f in enumerate(by_crop["coffee"]):
            for y in (2023, 2024, 2025):
                if y == 2025 and i % 5 == 4:
                    continue  # one grower skipped compost in 2025 (shows up as a deviation)
                record(f, "compost", "project", d(y, 6, 10 + i), quantity=round(rng.uniform(2.0, 4.5), 1),
                       extra={"source": rng.choice(["On-farm compost pit", "Coffee pulp compost"])})
            record(f, "mulching", "project", d(2024, 1, 8 + i), quantity=round(rng.uniform(1.0, 2.5), 1),
                   extra={"material": "Coffee husk and pruned shade-tree leaves"})
            if i % 2 == 0:
                record(f, "cover_crop", "project", d(2025, 6, 12 + i // 2), ended=d(2025, 10, 20),
                       extra={"species": "Calopogonium mucunoides"})
        for i, f in enumerate(by_crop["maize"]):
            record(f, "reduced_tillage", "project", d(2023, 6, 5 + i), extra={"passes": 1})
            for y in (2023, 2024, 2025):
                record(f, "residue_retention", "project", d(y, 11, 3 + i),
                       extra={"retained_pct": rng.choice([70, 75, 80, 85])})
            if i % 2 == 0:
                record(f, "zero_tillage", "project", d(2025, 6, 8 + i))
            else:
                record(f, "cover_crop", "project", d(2025, 10, 22), ended=d(2025, 12, 20),
                       extra={"species": "Horse gram (Macrotyloma uniflorum)"})
        for i, f in enumerate(by_crop["rice"]):
            for y in (2023, 2024, 2025):
                record(f, "residue_retention", "project", d(y, 12, 2 + i),
                       extra={"retained_pct": rng.choice([60, 65, 70])})
            record(f, "compost", "project", d(2024, 6, 14 + i), quantity=round(rng.uniform(1.5, 3.0), 1),
                   extra={"source": "FPO vermicompost unit, Maddur"})
            if (f.get("crop_attributes") or {}).get("water_regime") == "awd" or i % 3 == 0:
                record(f, "awd_irrigation", "project", d(2025, 7, 5), ended=d(2025, 10, 25),
                       extra={"dry_events": rng.randint(3, 6)})
        for f in by_crop["coffee"][:2] + by_crop["rice"][:2]:
            record(f, "farmyard_manure", "baseline", d(2021, 6, 20), quantity=round(rng.uniform(0.5, 1.2), 1),
                   extra={"animal": "cattle"})
        for f in by_crop["maize"][:2]:
            record(f, "residue_retention", "baseline", d(2021, 11, 15), extra={"retained_pct": 15})
        f = by_crop["maize"][2]
        record(f, "synthetic_fertiliser", "project", d(2024, 7, 12), quantity=125.0,
               extra={"product": "Urea (46% N)", "n_content_pct": 46},
               invoice=pdf_bytes("Tax invoice — Arsikere Raitha Seva Kendra", [
                   f"Buyer: {f['farmer_name']}", "Item: Urea 46% N, 2.5 bags x 50 kg = 125 kg",
                   "Invoice no: RSK-ARS-2024-0718  Date: 12 Jul 2024", "Amount: Rs 667.50 (subsidised)"]))
        self.counts["practices"] = n
        self.counts["photos"] += n
        log(f"{n} practice records by Ravi Kumar, each with a photo")

    # ------------------------------------------------------------------ intervention plans
    def interventions(self) -> None:
        a = self.api
        step("Intervention plans (agreed by OTP, activated by the programme)")
        picks = []
        for crop in REGIONS:
            picks += [f for f in self.fields if f["crop"] == crop][:2]
        commitments = {
            "coffee": [{"practice_code": "compost", "start_year": 2023, "end_year": 2027, "times_per_year": 1,
                        "expected_quantity": 2.0, "unit": "t", "notes": "On-farm compost before the monsoon"},
                       {"practice_code": "cover_crop", "start_year": 2024, "end_year": 2027, "times_per_year": 1,
                        "notes": "Inter-row Calopogonium"}],
            "maize": [{"practice_code": "residue_retention", "start_year": 2023, "end_year": 2027, "times_per_year": 1},
                      {"practice_code": "reduced_tillage", "start_year": 2023, "end_year": 2027, "times_per_year": 1}],
            "rice": [{"practice_code": "residue_retention", "start_year": 2023, "end_year": 2027, "times_per_year": 1},
                     {"practice_code": "compost", "start_year": 2024, "end_year": 2027, "times_per_year": 1,
                      "expected_quantity": 1.5, "unit": "t"}],
        }
        plans = []
        for f in picks:
            p = a.post(COL1, "/intervention-plans", json={
                "project_id": self.pid, "field_id": f["id"], "commitments": commitments[f["crop"]],
                "notes": f"Agreed at the FPO meeting with {f['farmer_name']}."})
            who = FARMER if f["farmer_name"] == "Basavaraj Patil" else COL1
            a.post(who, f"/intervention-plans/{p['id']}/agree", json={"method": "otp", "otp_code": OTP})
            a.post(PROG, f"/intervention-plans/{p['id']}/activate")
            plans.append(p)
        det = a.post(PROG, f"/projects/{self.pid}/interventions/detect-deviations")
        comp = a.get(PROG, f"/projects/{self.pid}/interventions/compliance")
        self.counts["intervention_plans"] = len(plans)
        log(f"{len(plans)} plans drafted by Ravi Kumar, agreed by OTP (Basavaraj himself), activated by Karthik "
            f"Gowda; commitments {comp['commitments_by_status']}; {det['created']} deviation(s) detected")

    # ------------------------------------------------------------------ QA and calculation
    def resolve_warnings(self, why: str) -> int:
        a = self.api
        findings = a.get(ANALYST, f"/projects/{self.pid}/qa/findings?status=open")
        n = 0
        for f in findings:
            if f["severity"] in ("blocking", "info"):
                continue
            reason = {
                "HIGH_UNCERTAINTY": "Reviewed: deduction is applied in full; more cores planned for MON-2028.",
                "GPS_ACCURACY_LOW": "Reviewed with the collector; position cross-checked against the field boundary.",
                "UNPAIRED_SITE": "Reviewed: site excluded and reported per the rule pack.",
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
        log(f"{resolved} warning(s) resolved with notes; blocking = 0; open by rule {summary['open_by_rule']}")

        step(f"Calculation {PERIOD_LABEL} ({PERIOD_START} to {PERIOD_END}, BL22 vs MON25)")
        em = a.get(ANALYST, f"/projects/{self.pid}/emissions?start={PERIOD_START}&end={PERIOD_END}")
        by_src = ", ".join(f"{k} {v['reduction_t_co2e']:.1f}" for k, v in em["sources"].items() if v["reduction_t_co2e"])
        log(f"QA3 emissions (Eq. 6–32, conservative EF ends): reduction {em['total_reduction_t_co2e']:.2f} t CO2e "
            f"({by_src}); Eq. 33 organic-amendment leakage {em['leakage_oa_t_co2e']:.2f} t")
        est = a.get(ANALYST, f"/projects/{self.pid}/emissions-estimate?start={PERIOD_START}&end={PERIOD_END}",
                    ok=(200, 409, 422))
        if isinstance(est, dict) and est.get("code"):
            log(f"practice-record emissions estimate: {est['code']}")
        run = a.post(ANALYST, f"/projects/{self.pid}/calculations", json={
            "period_label": PERIOD_LABEL, "period_start": PERIOD_START, "period_end": PERIOD_END,
            "baseline_campaign_id": base["id"], "monitoring_campaign_id": mon["id"]})
        post = self.resolve_warnings("post-calculation review")
        a.post(ANALYST, f"/calculations/{run['id']}/submit")
        a.post(PROG, f"/calculations/{run['id']}/approve",
               json={"note": "Reviewed provenance, control-site netting and QA; approved for verification."})
        self.run = a.get(PROG, f"/calculations/{run['id']}")
        r = self.run
        if r["net_t_co2e"] <= 0:
            raise SeedError(f"Net credits are not positive: {r['net_t_co2e']}")
        log(f"run by Divya Shetty, approved by Karthik Gowda ({post} post-run warning(s) resolved)")
        log(f"gross {r['gross_t_co2e']:.1f} − uncertainty {r['uncertainty_deduction_t_co2e']:.1f} − buffer "
            f"{r['buffer_t_co2e']:.1f} = net {r['net_t_co2e']:.1f} tCO2e "
            f"(reductions {r['reductions_t_co2e']:.1f}, removals {r['removals_t_co2e']:.1f})")

    # ------------------------------------------------------------------ verification
    def verification(self) -> None:
        a = self.api
        step("Verification package and verifier access")
        pkg = a.post(PROG, f"/calculations/{self.run['id']}/package")
        acc = a.post(PROG, f"/packages/{pkg['id']}/verifier-access", json={
            "verifier_name": "Priya Sharma", "verifier_email": "priya.sharma@example.com",
            "organisation": "Northstar Assurance (demo)", "days": 30})
        self.package, self.token = pkg, acc["token"]
        vh = {"X-Verifier-Token": self.token}
        a.get(None, "/verifier/session", headers=vh)
        q = a.post(None, "/verifier/queries", headers=vh, json={
            "question": "For C-COF, please confirm the control plots were managed per the baseline schedule between "
                        "BL22 and MON25, and share the partner-farm diary.",
            "subject_type": "package", "subject_id": pkg["id"]})
        a.post(ANALYST, f"/verifier-queries/{q['id']}/answer", json={
            "answer": "Yes — the control-site management plan is attached to the control-site link and the partner "
                      "farm's diary is in the document index; no project practices were introduced."})
        log(f"package v{pkg.get('version', 1)} issued by Karthik Gowda; 30-day access for Priya Sharma "
            "(Northstar Assurance, demo); 1 query raised and answered")

    # ------------------------------------------------------------------ devices, supporting data, satellite
    def sensing(self) -> None:
        a, rng = self.api, self.rng
        step("Devices, supporting data, satellite, practice detection, weather-station check")
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

        ws = a.get(ANALYST, f"/projects/{self.pid}/weather-station-check")
        log(f"weather-station check (≤ 50 km, Table 6/7): {ws['with_station']} fields with a continuous station, "
            f"{ws['synthetic_station']} use a synthetic station")
        f0 = self.fields[0]
        der = a.get(ANALYST, f"/fields/{f0['id']}/derived-features?start={start.isoformat()}&end="
                             f"{self.today.isoformat()}&window=monthly")
        n_win = max((len(v) for v in der.values() if isinstance(v, list)), default=0) if isinstance(der, dict) else 0
        log(f"derived features for {f0['code']}: {n_win} monthly row(s)")

    # ------------------------------------------------------------------ SOC model, feature store, drift
    def soc_model(self) -> None:
        """Trained on the baseline campaign only, so the monitoring results are new data for the drift check."""
        a = self.api
        step("SOC prediction model (trained on BL22) and feature set")
        feature_sets = [["elevation_m", "clay_pct", "practice_count"], ["elevation_m", "clay_pct"]]
        self.model = None
        for feats in feature_sets:
            r = a.post(SCI, "/models/soc/train", ok=(201, 422), json={
                "name": "SOC topsoil Kaveri", "features": feats, "project_id": self.pid, "ridge_lambda": 1.0})
            if r.get("code") == "NOT_ENOUGH_DATA":
                log(f"features {feats}: not enough data ({r['details'].get('rows')} rows)")
                continue
            if "id" not in r:
                raise SeedError(f"Model training failed: {r}")
            self.model = r
            break
        if self.model is None:
            note("SOC model training reported NOT_ENOUGH_DATA for every feature set; model, map and drift skipped.")
            return
        model = self.model
        a.post(SCI2, f"/models/{model['id']}/approve")
        m = model.get("metrics", {})
        log(f"trained by Dr. Meera Iyer on {model['training_summary']['rows']} rows, features {model['features']}; "
            f"CV RMSE {m.get('rmse', float('nan')):.3f}, R² {m.get('r2', float('nan')):.2f}; approved by "
            "Dr. Suresh Hegde")

    def intelligence_after_monitoring(self) -> None:
        a = self.api
        step("Feature store, SOC map and model drift check")
        fs = a.post(SCI, "/feature-sets", json={
            "name": "kaveri-site-v1", "description": "Static site attributes plus recent weather and NDVI.",
            "definition": {"features": [
                {"feature": "elevation_m"}, {"feature": "slope_pct"}, {"feature": "clay_pct"},
                {"feature": "mean_annual_precip_mm"}, {"feature": "rain_total", "window_days": 90},
                {"feature": "ndvi_mean", "window_days": 120}, {"feature": "practice_count", "window_days": 365}]}})
        mat = a.post(SCI, f"/feature-sets/{fs['id']}/materialize", json={
            "project_id": self.pid, "as_of_date": self.today.isoformat()})
        n = mat.get("fields", mat.get("rows", mat.get("count")))
        log(f"feature set {fs['name']} v{fs.get('version', 1)} materialised as of {self.today}: "
            f"{n if not isinstance(n, list) else len(n)} field vector(s)")
        if self.model is None:
            return
        sm = a.post(SCI, f"/projects/{self.pid}/soc-map", json={"model_id": self.model["id"], "top_n": 5})
        log(f"SOC map for {sm['summary']['fields']} fields (sample next: {', '.join(sm['summary']['sample_next'])})")
        dr = a.post(SCI, f"/models/{self.model['id']}/drift-check", json={})
        log(f"drift check on MON25 results: {dr.get('status')} — {'; '.join(dr.get('reasons', [])[:2])}")

    # ------------------------------------------------------------------ non-permanence risk
    def permanence(self) -> None:
        a = self.api
        step("Non-permanence risk profile, monitoring obligations")
        inputs = {"internal": {"project_management": 2, "financial_viability": 2, "opportunity_cost": 2,
                               "project_longevity": 2},
                  "external": {"land_tenure": 2, "community_engagement": 0, "political": 1},
                  "natural": [{"hazard": "flood (Shimsha/Kaveri)", "likelihood": "once every 10–25 years",
                               "significance": "minor", "score": 2, "mitigation": 1},
                              {"hazard": "drought", "likelihood": "once every 10–25 years",
                               "significance": "minor", "score": 2, "mitigation": 1}]}
        p = a.post(PROG, f"/projects/{self.pid}/risk-profiles", json={
            "inputs": inputs, "notes": "Scores read from the VCS AFOLU Non-Permanence Risk Tool v4.0 tables "
                                       "(demo assessment)."})
        a.post(PROG, f"/risk-profiles/{p['id']}/submit")
        final = 15.0
        p = a.post(SCI2, f"/risk-profiles/{p['id']}/approve", json={
            "final_npr_pct": final, "justification": "" if abs(p["computed_rating_pct"] - final) < 1e-6 else
            "Rounded up to the 15 % used in the approved rule pack (conservative)."})
        # intervals come from the approved rule pack (VM0042-fixed values entered with apply-vm0042-defaults)
        ob = a.post(PROG, f"/projects/{self.pid}/monitoring-obligations/generate", json={})
        if ob["skipped"] or len(ob["created"]) != 3:
            raise SeedError(f"Monitoring obligations not generated from the rule pack: {ob}")
        log(f"worksheet {p['computed_rating_pct']:g} % (advisory), final NPR {p['final_npr_pct']:g} % approved by "
            f"Dr. Suresh Hegde; obligations: " + ", ".join(f"{o['kind']} due {o['due_on']}" for o in ob["created"]))
        if ob["skipped"]:
            log(f"obligations skipped: {ob['skipped']}")

    # ------------------------------------------------------------------ credits, offtake and sales
    def credits(self) -> None:
        a = self.api
        step("Credit batch, issuance, offtake agreement, sales and an offer")
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
            f"{b['removals_t']:.2f} t removals, issued on Verra VCS-DEMO-4821 serials ...-0001 to ...-{total:04d}")

        buyer = a.post(PROG, "/buyers", json={
            "name": "GreenLeaf Foods Pvt Ltd", "kind": "corporate", "country": "India", "contact_name": "Sarah Thomas",
            "contact_email": "buyer@example.com", "user_id": self.uid[BUYER],
            "requirements": {"credit_type": "removal", "vintage_min": 2025, "co_benefits": ["smallholder income"]}})
        qty1 = math.floor(b["removals_t"] * 0.60)
        qty_later = max(1, math.floor(b["removals_t"] * 0.25))
        contract = a.pdf(PROG, "GLF-OFT-2026-07.pdf", "Offtake agreement GLF-OFT-2026-07", [
            "Seller: Varsapradaya Agri Carbon. Buyer: GreenLeaf Foods Pvt Ltd.",
            f"Removal credits from KRS-P1, vintage 2025 onwards: {qty1 + qty_later} t at Rs 1,650/t (fixed).",
            f"Deliveries: {qty1} t on issuance of the first verified batch; {qty_later} t by 30 Sep 2027.",
            "Signed for Varsapradaya by Anita Rao (demo)."])
        ag = a.post(PROG, "/offtake-agreements", json={
            "buyer_id": buyer["id"], "title": "GreenLeaf supply-chain insetting offtake 2026–2027",
            "code": "GLF-OFT-2026-07", "credit_type": "removal", "total_volume_t": qty1 + qty_later,
            "vintages": [2025, 2026], "price_type": "fixed", "price": "1650.00", "currency": "INR",
            "delivery_schedule": [{"due_date": self.today.isoformat(), "quantity": qty1},
                                  {"due_date": "2027-09-30", "quantity": qty_later}],
            "effective_from": "2026-07-01", "effective_to": "2027-12-31",
            "notes": "Insetting programme; farmer co-benefit reporting each season."})
        a.post(ADMIN, f"/offtake-agreements/{ag['id']}/sign", json={
            "contract_evidence_id": contract, "signed_on": (self.today - timedelta(days=60)).isoformat()})
        a.post(PROG, f"/offtake-agreements/{ag['id']}/activate")
        s1 = a.post(PROG, "/sales", json={"buyer_id": buyer["id"], "batch_id": b["id"], "credit_type": "removal",
                                           "quantity": qty1, "unit_price": "1650.00", "currency": "INR",
                                           "notes": "First delivery under GLF-OFT-2026-07 (insetting)."})
        a.post(PROG, f"/sales/{s1['id']}/contract", json={"contract_ref": "GLF-OFT-2026-07",
                                                          "trade_date": self.today.isoformat()})
        s1 = a.post(PROG, f"/sales/{s1['id']}/deliver")
        qty2 = max(1, math.floor(b["removals_t"] * 0.08))
        s2 = a.post(PROG, "/sales", json={"buyer_id": buyer["id"], "batch_id": b["id"], "credit_type": "removal",
                                           "quantity": qty2, "unit_price": "1700.00", "currency": "INR",
                                           "notes": "Option for FY27 top-up; reserved pending board approval."})
        offer_qty = max(1, math.floor(b["reductions_t"] * 0.5)) if b["reductions_t"] >= 1 else 1
        ctype = "reduction" if b["reductions_t"] >= 1 else "removal"
        of = a.post(PROG, "/offers", json={
            "buyer_id": buyer["id"], "batch_id": b["id"], "credit_type": ctype, "quantity": offer_qty,
            "unit_price": "1400.00", "currency": "INR", "valid_until": (self.today + timedelta(days=30)).isoformat(),
            "terms": "Emission-reduction credits (fertiliser N2O and diesel), vintage 2025; 30-day validity."})
        a.post(PROG, f"/offers/{of['id']}/send")
        deliv = a.get(PROG, f"/offtake-agreements/{ag['id']}/deliveries")
        self.buyer, self.sale, self.sale2, self.agreement = buyer, s1, s2, ag
        log(f"offtake GLF-OFT-2026-07 ({qty1 + qty_later} t) drafted by Karthik Gowda, signed by Anita Rao, active; "
            f"delivered {deliv.get('delivered_t')} t so far")
        log(f"sale {s1['code']} {qty1} t × ₹1,650 delivered; sale {s2['code']} {qty2} t reserved; offer "
            f"{of['code']} ({offer_qty} t {ctype}) sent to GreenLeaf")

    # ------------------------------------------------------------------ payments
    def payments(self) -> None:
        a = self.api
        step("Benefit sharing, payouts and reconciliation")
        rule = a.post(FIN, "/benefit-rules", json={
            "programme_id": self.programme["id"], "farmer_share_pct": "60", "weights": {"area": 0.5, "practices": 0.5},
            "deductions": [{"name": "Verification & registry fees", "pct": "6"},
                           {"name": "Programme operations", "pct": "4"}],
            "min_payout": "100", "notes": "KRS benefit-sharing rule v1 as agreed with both FPOs."})
        a.post(APPROVER, f"/benefit-rules/{rule['id']}/approve")
        pool = a.post(FIN, f"/sales/{self.sale['id']}/benefit-pool")
        a.post(APPROVER, f"/benefit-pools/{pool['id']}/approve")
        log(f"rule v{rule.get('version', 1)} by Nisha Menon, approved by Rahul Desai; pool on {self.sale['code']} "
            f"(₹{pool.get('farmer_pool_amount')} to {pool.get('breakdown', {}).get('farmers')} farmers)")

        profiles = 0
        for f in self.growers:
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
        log(f"payout batch {pb['code']} approved by Rahul Desai and submitted: {dict(st)}; paid ₹{pb.get('paid_amount')}")

        # settlement statement from the payment provider, with one amount mismatch to investigate
        lines = [x for x in pb.get("lines", []) if x.get("provider_ref")]
        rows = ["provider_ref,amount,status,settled_on"]
        for k, x in enumerate(lines):
            amount = float(x["amount"])
            status = "paid" if x["status"] == "paid" else "failed"
            if k == 0 and x["status"] == "paid":
                amount = round(amount - 10.0, 2)  # the bank settled ₹10 less
            rows.append(f"{x['provider_ref']},{amount:.2f},{status},{self.today.isoformat()}")
        rec = a.post(FIN, f"/payout-batches/{pb['id']}/reconcile",
                     files={"file": (f"settlement-{pb['code']}.csv", ("\n".join(rows) + "\n").encode(), "text/csv")})
        log(f"reconciled against settlement CSV ({len(lines)} lines): {rec.get('summary', rec.get('counts'))}")

    # ------------------------------------------------------------------ notifications
    def notifications(self) -> None:
        a = self.api
        step("Notifications: default templates, event dispatch, inbound WhatsApp")
        t = a.post(PROG, "/notifications/templates/install-defaults")
        d = a.post(PROG, "/notifications/dispatch-events")
        log(f"{t['installed']} default templates (en + kn); {d['events_processed']} events → {d['notifications']} "
            f"notifications {d['by_status']}")
        maize = self.farmer_by_name["Channegowda H. R."]
        m1 = a.post(PROG, "/notifications/inbound", json={
            "phone": maize["phone"], "channel": "whatsapp", "text": "PRACTICE residue_retention 2026-09-12"})
        rice = self.farmer_by_name["Krishnegowda B."]
        m2 = a.post(PROG, "/notifications/inbound", json={
            "phone": rice["phone"], "channel": "whatsapp",
            "text": "HELP My second payment has not come to my UPI. Please check."})
        log(f"inbound WhatsApp: PRACTICE report {m1['status']} (awaiting review); HELP → {m2['status']} grievance")

    # ------------------------------------------------------------------ households
    def households(self) -> None:
        a = self.api
        step("Households")
        pairs = [("Chengappa K. M.", [("Kaveramma Uthappa", "spouse")], ["Dechamma C. (daughter)"]),
                 ("Shivalingaiah M.", [("Jayamma Boregowda", "sibling")], []),
                 ("Basavaraj Patil", [], ["Shantamma Patil (spouse)", "Mahesh Patil (son)"])]
        n = 0
        for head, reg, others in pairs:
            h = self.farmer_by_name[head]
            members = [{"farmer_id": self.farmer_by_name[m]["id"], "relation": rel} for m, rel in reg]
            for o in others:
                nm, rel = o.split(" (")
                members.append({"name": nm, "relation": rel.rstrip(")")})
            a.post(PROG, "/households", json={
                "head_farmer_id": h["id"], "name": f"{head.split()[0]} household", "village": h["village"],
                "district": h["district"], "state": "Karnataka", "members": members,
                "notes": "Recorded at the FPO household survey."})
            n += 1
        self.counts["households"] = n
        log(f"{n} households (registered farmers linked as members where they farm together)")

    # ------------------------------------------------------------------ risk events and grievances
    def risk(self) -> None:
        a = self.api
        step("Risk events, remediation and grievances")
        exit_field = next(f for f in self.fields if f["farmer_name"] == "Puttaswamy K.")
        ex = a.post(PROG, "/risk-events", json={
            "project_id": self.pid, "field_id": exit_field["id"], "kind": "farmer_exit", "severity": "medium",
            "occurred_on": (self.today - timedelta(days=12)).isoformat(),
            "description": "Farmer indicated he may lease the plot to a sugarcane grower next season; FPO "
                           "facilitator to follow up on continuing the practices.",
            "estimated_impact_t": 18.0})
        a.post(PROG, f"/risk-events/{ex['id']}/remediation-actions", json={
            "title": "Farm visit with the FPO facilitator", "owner_user_id": self.uid[PROG],
            "description": "Explain the lease options that keep the practices; offer the intervention-plan support.",
            "due_on": (self.today + timedelta(days=21)).isoformat()})
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
        log("risk: 1 open (farmer_exit, medium, 1 remediation action), 1 resolved (flood); grievances: 3 "
            "(1 resolved, 1 open high, 1 from the farmer app) + 1 from WhatsApp HELP")

    # ------------------------------------------------------------------ partners
    def partners(self) -> None:
        a = self.api
        step("Partner integration")
        a.post(PROG, "/partners/api-keys", json={"name": "FarmFuture integration", "scopes": ["read"]})
        a.post(PROG, "/partners/webhooks", json={
            "url": "https://example.com/hooks/vcarbon", "events": ["result.approved", "payout.completed"],
            "description": "FarmFuture: approved results and completed payouts (not dispatched in the demo)."})
        log("API key 'FarmFuture integration' (read) and webhook https://example.com/hooks/vcarbon")

    # ------------------------------------------------------------------ live fieldwork (field-app demo)
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
        hosts = [f for f in self.growers if f["crop"] == "maize"][:5]
        base_lat, base_lon = 14.1062, 76.2795  # farmland south-west of Chitradurga town
        fields = []
        for i, fr in enumerate(hosts):
            lat, lon = offset(base_lat, base_lon, (i // 3) * 750.0, (i % 3) * 750.0)
            fld = a.post(COL1, "/fields", json={
                "farm_id": fr["farm"]["id"], "name": f"Ragi plot {i + 1}",
                "boundary": square(round(lat, 6), round(lon, 6), round(rng.uniform(150, 220), 1)),
                "crop_code": "millets", "crop_attributes": {"millet_type": "ragi"}, "soil_type": "red sandy loam",
                "soil_texture_class": "sandy_loam", "wrb_soil_group": "Luvisols", "climate_zone": "tropical_dry",
                "ecoregion": "South Deccan Plateau dry deciduous forests", "land_cover": "cropland",
                "mean_annual_precip_mm": round(rng.uniform(560, 600))})
            fld["crop_code"] = "millets"
            fld["name"] = f"Ragi plot {i + 1}"
            self._land_use_and_tenure(fld, fr, COL1, kind="leased", valid_from="2025-06-01", valid_to="2032-05-31",
                                      note_text="Seven-year lease of a ragi plot near Chitradurga for the pilot.")
            self._enrol(proj["id"], fld)
            fields.append(fld)
        a.post(ANALYST, f"/projects/{proj['id']}/terrain/refresh", json={"force": False})
        st = a.post(ANALYST, f"/projects/{proj['id']}/strata", json={
            "code": "S-MIL", "name": "Millets — Chitradurga red soils", "field_ids": [f["id"] for f in fields],
            "effective_from": "2026-06-01",
            "criteria": {"crop": "millets", "soil_type": "Luvisols", "soil_texture": "sandy_loam",
                         "climate": "tropical_dry", "management": "rain-fed ragi / horse gram"}})
        camp = a.post(ANALYST, f"/projects/{proj['id']}/campaigns", json={
            "code": "BL26-MIL", "name": "Baseline 2026 — millets pilot", "kind": "baseline", "design": "paired",
            "planned_start": "2026-09-15", "planned_end": "2026-11-15", "depth_from_cm": 0, "depth_to_cm": 50,
            "placement_seed": 260_915, "season": "post-monsoon (Sep–Nov)"})
        plan = a.post(ANALYST, f"/campaigns/{camp['id']}/sample-plans", json={
            "stratum_id": st["id"], "n_required": 6, "method": "manual",
            "justification": "Pilot baseline: six composites across five fields, above the methodology floor of 5."})
        a.post(SCI, f"/sample-plans/{plan['id']}/approve")
        # VM0042 Appendix 6 multi-stage design while the campaign is still planned: stage 1 = fields drawn with
        # probability proportional to area, with replacement (3 draws); points then go only into the drawn fields
        pop = a.get(ANALYST, f"/projects/{proj['id']}/sampling-design/population?stage1_unit=field")
        units = pop["units"]
        drawn = Counter(self.trng.choices([u["unit_id"] for u in units], weights=[u["area_ha"] for u in units], k=3))
        design = a.post(ANALYST, f"/campaigns/{camp['id']}/sampling-design", json={
            "stage1_unit": "field", "stage1_selection": "pps_wr",
            "units": [{"unit_id": u["unit_id"], "draws": drawn[u["unit_id"]],
                       "selection_probability": round(u["pps_probability"], 9)}
                      for u in units if drawn[u["unit_id"]]],
            "justification": "Pilot baseline: 3 PPS draws (with replacement) of fields by area from the 5 enrolled "
                             "ragi plots (VM0042 Appendix 6), so travel is concentrated while every hectare keeps a "
                             "known inclusion probability; 6 composites spread over the drawn fields."})
        picked = ", ".join(f"{u['label']} ×{u['draws']}" for u in design["units"])
        log(f"Appendix 6 design v{design['version']}: stage 1 = field, PPS with replacement, {design['stage1_draws']} "
            f"draws → {design['stage1_selected']} distinct field(s) of {pop['unit_count']} ({picked})")
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
                "gps_accuracy_m": 3.2, "depth_reached_cm": 50, "photo_ids": photos, "device_id": "tab-ravi-01",
                "probe_diameter_mm": PROBE_MM, "cores_composited": CORES,
                "layers": [{"depth_from_cm": d0, "depth_to_cm": d1, "label_qr": f"QR-BL26-{p['site_code']}-D{n + 1}"}
                           for n, (d0, d1) in enumerate(DEPTHS)]})
            a.post(COL1, f"/samples/{res['sample']['id']}/custody", json={
                "event": "packed", "occurred_at": (when + timedelta(hours=3)).isoformat(), "location": "Field camp"})
        log(f"KRS-P2 with {len(fields)} millet fields (tenure verified); BL26-MIL (0–50 cm, 4 increments) in "
            f"fieldwork, {len(points)} points assigned to Ravi Kumar, 2 collected")

    # ------------------------------------------------------------------ checks
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
        client = a.get("client@example.com", "/portfolio/overview")
        ready = a.get(PROG, f"/projects/{self.pid}/readiness?period_label={PERIOD_LABEL}")
        self.readiness = ready
        assessment = a.get(PROG, f"/projects/{self.pid}/control-sites/assessment")
        run_terms = {t["term"]: t for t in (self.run.get("results") or {}).get("terms", [])}
        qa = a.get(ANALYST, f"/projects/{self.pid}/qa/summary")
        biomass_plots = a.get(PROG, f"/projects/{self.pid}/biomass/plots")
        residues = a.get(PROG, f"/projects/{self.pid}/leakage/residues")
        displacement = a.get(PROG, f"/projects/{self.pid}/leakage/displacement")
        qa1_models = a.get(PROG, "/qa1/models")
        checks = {
            "farmers >= 18": farmers >= 18,
            "fields >= 30": fields >= 30,
            "approved run": any(r["status"] == "approved" for r in runs),
            "verification package": len(packages) >= 1,
            "issued credit batch": any(b["status"] == "issued" for b in batches),
            "payout batch submitted": any(p["status"] in ("completed", "partially_failed") for p in payouts),
            "samples": len(samples) >= 90,
            "buyer portfolio": bool(portfolio),
            "farmer statement": bool(statement),
            "verifier portal": bool(vp),
            "client portfolio": bool(client),
            "readiness has no blocking dimension": ready["ready"],
            "readiness 100 %": ready["score_pct"] >= 100,
            "control-site assessment pass (all links)": assessment["overall"] == "pass"
            and all(lk["overall"] == "pass" for lk in assessment["links"]),
            "run includes woody biomass terms": all(
                abs((run_terms.get(k) or {}).get("value_t_co2e") or 0) > 0
                for k in ("woody_biomass_project", "woody_biomass_baseline")),
            "no blocking QA findings": not qa["blocking"],
            "biomass plots": len(biomass_plots) >= 12,
            "leakage records": len(residues) >= 2 and len(displacement) == len(PROJECT_YEARS),
            "QA1 model register": len(qa1_models) >= 1,
        }
        for k, v in checks.items():
            log(f"{'ok ' if v else 'FAIL'} {k}")
        log(f"readiness KRS-P1: {ready['score_pct']} % — " + ", ".join(
            f"{d['key']}={d['status']}" for d in ready["dimensions"] if d["status"] != "ok") or "all ok")
        if not all(checks.values()):
            raise SeedError(f"Screen checks failed: {[k for k, v in checks.items() if not v]}")
        return {"farmers": farmers, "fields": fields, "samples": len(samples)}

    # ------------------------------------------------------------------ run everything
    def run_all(self) -> dict[str, Any]:
        self.catalogue_and_programme()
        self.rule_pack()
        self.farmers_and_consent()
        self.land()
        self.site_context()
        self.control_sites()
        self.make_strata()
        self.activity_data()
        self.additionality()
        self.make_lab()
        self.documents()
        base = self.campaign(code="BL22", name="Baseline 2022", kind="baseline", start="2022-11-01",
                             end="2022-12-20", seed=220_1101, revisits=None, collect_from=date(2022, 11, 3),
                             collect_to=date(2022, 12, 16), analysed_from=date(2023, 1, 9),
                             analysed_to=date(2023, 2, 10))
        self.soc_model()
        maize = [f["id"] for f in self.fields if f["crop"] == "maize"]
        rice = [f["id"] for f in self.fields if f["crop"] == "rice"]
        sampled = set(self.site_field.values())
        self.decliners = {next(f for f in maize[3:] if f in sampled), next(f for f in rice[5:] if f in sampled)}
        mon = self.campaign(code="MON25", name="Monitoring 2025 (same season)", kind="monitoring",
                            start="2025-11-03", end="2025-12-15", seed=251_103, revisits=base["id"],
                            collect_from=date(2025, 11, 4), collect_to=date(2025, 12, 12),
                            analysed_from=date(2026, 1, 12), analysed_to=date(2026, 2, 13))
        self.control_links()
        self.woody_biomass()
        self.practices()
        self.interventions()
        self.leakage()
        self.qa1_illustration()
        self.permanence()
        self.qa_and_calculation(base, mon)
        self.verification()
        self.sensing()
        self.intelligence_after_monitoring()
        self.credits()
        self.payments()
        self.notifications()
        self.households()
        self.risk()
        self.partners()
        self.pilot_fieldwork()
        return self.check_screens()


# ====================================================================== summary
def summary(story: Story, screens: dict[str, Any], elapsed: float, calls: int) -> str:
    r = story.run
    res = r.get("results") or {}
    link = f"{WEB_URL}/verify#token={story.token}"
    vint = res.get("vintages") or []
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
        f"  farmers {screens['farmers']} · fields {screens['fields']} (KRS-P1 project "
        f"{sum(f['area_ha'] for f in story.fields):.1f} ha + {len(story.controls)} control plots) · strata "
        f"{len(story.strata)} + {len(story.ctrl_strata)} control · agreements {story.counts['agreements']} · "
        f"tenure {story.counts['tenure']}",
        f"  campaigns 2 (+ BL26-MIL with an Appendix 6 design) · samples {story.counts['samples']} · layers {story.counts['layers']} · "
        f"lab results {story.counts['lab_results']} (all accepted, each with a PDF certificate)",
        f"  activity records {story.counts['activity_baseline']} baseline + {story.counts['activity_project']} project "
        f"· attestations {story.counts['attestations']} · practice records {story.counts['practices']}",
        f"  photos {story.counts['photos']} · devices {story.counts['devices']} · supporting observations "
        f"{story.counts['observations']} · satellite {story.counts['satellite']} · detections "
        f"{story.counts['detections']}",
        "",
        f"Headline credits — run {r['id']} ({PERIOD_LABEL}, {r['status']})",
        f"  gross                 {r['gross_t_co2e']:>10.2f} tCO2e",
        f"  uncertainty deduction {r['uncertainty_deduction_t_co2e']:>10.2f} tCO2e",
        f"  buffer (NPR 15%)      {r['buffer_t_co2e']:>10.2f} tCO2e",
        f"  NET CREDITS           {r['net_t_co2e']:>10.2f} tCO2e",
        f"    reductions          {r['reductions_t_co2e']:>10.2f} tCO2e",
        f"    removals            {r['removals_t_co2e']:>10.2f} tCO2e",
        f"  woody biomass (approved terms, Eq. 48/49): project {story.woody['project']:.2f}, baseline "
        f"{story.woody['baseline']:.2f} tCO2e (net {story.woody['project'] - story.woody['baseline']:.2f})",
    ]
    for v in vint:
        if isinstance(v, dict):
            lines.append(f"    vintage {v.get('year')}: VCU {v.get('vcu', v.get('vcu_t_co2e', 0)) or 0:.2f} "
                         f"(ER {v.get('vcu_er', 0) or 0:.2f}, CR {v.get('vcu_cr', 0) or 0:.2f})")
    lines += [
        f"  credit batch {story.batch['code']} issued; sale {story.sale['code']} delivered "
        f"({story.sale['quantity']:g} t × ₹1,650, GLF-OFT-2026-07), sale {story.sale2['code']} reserved "
        f"({story.sale2['quantity']:g} t)",
        f"  payout batch {story.payout['code']}: {story.payout['status']}",
        f"  readiness KRS-P1: {story.readiness['score_pct']} %",
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
        "Verifier link (Priya Sharma, Northstar Assurance (demo), 30 days):",
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
