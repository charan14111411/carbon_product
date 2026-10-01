# Varsapradaya Carbon

Soil-carbon measurement, reporting and verification (dMRV) with the full carbon-programme
layer on top: farmers and consent, fields and practices, sampling and labs, a calculation engine
built to **Verra VM0042 v2.2** (improved agricultural land management), verification packages,
credits, buyers and farmer payouts. Works for any crop.

> **The lab measures the carbon. Sensors, satellites and models make it affordable.**
> Credits come only from accepted laboratory results. Everything else is labelled and kept
> behind the “informing wall”.

## What's inside

| Folder | What it is |
|---|---|
| `api/` | FastAPI backend. One package per business area under `app/modules/`. |
| `web/` | Angular 22 web app: operations console, offline field app, farmer, buyer and verifier portals. |
| `api/migrations/` | Alembic database migrations, plus ready-to-run SQL scripts for SSMS in `api/migrations/sql/`. |
| `CONVENTIONS.md` | Rules every module follows (tenancy, append-only, four-eyes, fail-closed). |
| `docs/VM0042_v2.2_REQUIREMENTS.md` | Every VM0042 v2.2 equation, constant and threshold the code implements, with section and page. |
| `docs/TESTING_GUIDE.md` | Hands-on guide: concepts, the 13 roles, outside services, and testing every flow from an empty database. |
| `STATUS.md` | What is built, how it maps to VM0042, and what still needs something outside the software. |

## Run it locally

Prerequisites: **SQL Server** (2019 or later) with an empty database, **ODBC Driver 18 for SQL Server**,
Python 3.12+ and Node 20+. No Docker.

### 1. Point the API at your database

```powershell
copy api\.env.example api\.env
```

Edit `DATABASE_URL` in `api\.env`. With Windows authentication on the named instance `SQL_LOCAL` and the
database `carbon_latest`:

```
DATABASE_URL=mssql+pyodbc://@localhost\SQL_LOCAL/carbon_latest?driver=ODBC+Driver+18+for+SQL+Server&trusted_connection=yes&TrustServerCertificate=yes
```

With a SQL login, use `mssql+pyodbc://user:password@localhost\SQL_LOCAL/carbon_latest?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes`.
Every part of the app (API, migrations, demo seed) reads the database from this one setting. `api\.env` is
committed to git, so use Windows authentication or keep real passwords out of it.

### 2. Create the tables (pick one)

* **From the terminal (recommended):**
  ```powershell
  cd api
  ..\.venv\Scripts\python -m alembic upgrade head
  ```
* **From SSMS:** open `api\migrations\sql\0001_initial_schema.sql`, select the `carbon_latest` database and
  press Execute. The script also records the migration version, so `alembic upgrade head` keeps working later.

### 3. Run

```powershell
python -m venv .venv
.venv\Scripts\pip install -r api\requirements.txt
cd api
..\.venv\Scripts\python -m scripts.seed_demo --reset     # optional: demo data (~6 min, wipes the app's tables)
..\.venv\Scripts\python -m uvicorn app.main:app --port 8000
```

In a second terminal:

```powershell
cd web
npm install
npx ng serve                                             # http://localhost:4200
```

Or run everything with one command: `.\start-dev.ps1` (add `-Seed` to rebuild the demo data first).

Then open http://localhost:4200. Demo accounts (password `Demo-Pass-2026!`) and a verifier link are
printed at the end of the seed and saved to `api/var/demo_accounts.txt`.

| Account | Sees |
|---|---|
| admin@example.com | Everything (platform administrator) |
| programme@example.com | Programmes, farmers, land, approvals, credits, sales |
| scientist@example.com / scientist2@example.com | Methodology rules, sample plans, models (approve each other's work) |
| analyst@example.com | Calculations and quality checks |
| collector@example.com / collector2@example.com | The offline field app (`/field`) |
| labtech@example.com / labmanager@example.com | Lab entry / lab review |
| finance@example.com / approver@example.com | Farmer benefits and payouts (maker / checker) |
| buyer@example.com | Buyer portal (`/buyer`) |
| farmer@example.com | Farmer portal (`/farmer`, English + Kannada) |
| client@example.com | Client portfolio (read-only, farmer details masked) |

## Database migrations

The schema is owned by Alembic (`api/migrations`). Run these from the `api` folder:

| Task | Command |
|---|---|
| Apply all migrations | `..\.venv\Scripts\python -m alembic upgrade head` |
| See the current version | `..\.venv\Scripts\python -m alembic current` |
| After changing a model, create a migration | `..\.venv\Scripts\python -m alembic revision --autogenerate -m "what changed"` |
| Check the models and database match | `..\.venv\Scripts\python -m alembic check` |
| Write an SSMS script for a new migration | `..\.venv\Scripts\python -m alembic upgrade 0001:head --sql > migrations\sql\0002_what_changed.sql` |
| Undo the last migration | `..\.venv\Scripts\python -m alembic downgrade -1` |

Text columns are created as `NVARCHAR`, so Kannada and other non-Latin text is stored correctly.

## Tests

```bash
cd api && ../.venv/Scripts/python -m pytest      # backend (in-memory SQLite; set TEST_DATABASE_URL to use a
                                                 # scratch SQL Server database — never the real one)
cd web && npx ng build                           # type-checks and builds the web app
```

## External services

Registries, UPI payouts, eSign, WhatsApp, weather and satellite providers are **adapters**.
Each ships with a clearly named simulated provider so the whole product runs end to end without
credentials. Data from simulated providers is labelled as such and never presented as measured.
Replace them with real providers by implementing the same adapter interface.

## Methodology values

Values that VM0042 v2.2 itself fixes (GWPs, fuel and liming factors, the 0.667 uncertainty t-value,
ESM at 30 cm, at least 3 control sites, the 5 % practice-change threshold, monitoring intervals) are
entered with one click ("Apply VM0042 defaults") and cite their section and page. Everything
project-specific (emission factors, buffer %, quantification approaches) is left to the methodology
owner; in the demo those are marked "DEMO — replace before real use". A second person must approve
the pack (Gate 0) before anything calculates.
