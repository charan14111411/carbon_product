# Engineering conventions

These rules apply to every module. Read before changing code.

## Backend (`api/`)

* **Module layout.** Each business area is a package in `app/modules/<name>/` with
  `models.py` (tables), `schemas.py` (Pydantic in/out), `service.py` (logic), `router.py`
  (FastAPI `router`), and optional `domain.py` (pure logic, no DB). `app/main.py`
  discovers `models.py` and `router.py` automatically — never edit `main.py` to register a module.
* **Tables.** Master data extends `TenantModel` (mutable, `updated_at`). Evidence extends
  `LedgerModel` (append-only: updates/deletes raise `ImmutableRecord`). Corrections are new
  rows with `supersedes_id` / `version`.
* **Tenancy.** Every table has `org_id`. Read with `scoped(Model, user)` or
  `get_owned(db, Model, id, user)`. A row from another org is **404**, never 403.
* **Auth.** Every route depends on `require(P.X)` (see `core/permissions.py`) or
  `current_user`. Four-eyes: call `ensure_not_author(approver, *authors, what=...)`.
* **Errors.** Raise subclasses of `AppError` (`ValidationFailed`, `NotFound`, `Conflict`,
  `RuleMissing`, `Blocked`, `IllegalTransition`, `SelfApproval`). Response shape is always
  `{code, message, details}`. Messages are written for end users.
* **Fail closed.** Never default a methodology value, factor or measurement. Missing ⇒ `RuleMissing`.
* **Audit.** Every create/update/approve of a business record calls `audit(db, user, "x.y", obj, before=...)`.
* **Data classes.** Values exposed to users carry `data_class`: MEASURED, OBSERVED, RECORDED,
  DERIVED, CALCULATED, MODELLED.
* **IDs** are UUIDs, serialised as strings. Dates ISO-8601. Money in minor units? No — `Numeric(14,2)`
  in INR with a `currency` column.
* **Tests** live in `api/tests/test_<module>.py`, run on in-memory SQLite, use fixtures in
  `tests/conftest.py` (`client`, `org`, `as_role(role)`). Every rule has a pass and a fail test.

## Web (`web/`)

* Angular standalone components, signals, lazy routes per feature in `src/app/features/<name>/`.
* Only the shared UI kit in `src/app/ui/` and design tokens in `src/styles/` — no ad-hoc colours.
* All HTTP goes through `ApiService` (`src/app/core/api.service.ts`).
* Copy is plain language, no jargon without a tooltip. Every list has an empty state, a loading
  state and an error state.
