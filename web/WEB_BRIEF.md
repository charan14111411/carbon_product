# Web app brief (for everyone building screens)

Product: **Varsapradaya Carbon** — soil-carbon measurement, verification and farmer benefit platform.
Users are programme managers, soil scientists, carbon analysts, field collectors, lab staff, finance,
verifiers, buyers and farmers in India. Tone: calm, precise, trustworthy, plain English (no jargon without
a short explanation). It must look like a mature commercial SaaS product built by a strong product
design team — never like a generic template or an AI demo.

## Stack & rules
* Angular 22, **standalone components, signals, `ChangeDetectionStrategy.OnPush`**, new control flow
  (`@if`, `@for`, `@switch`). Template-driven `FormsModule` is fine; keep forms tidy.
* HTTP only through `ApiService` (`src/app/core/api.service.ts`) — paths are relative to `/api`
  (e.g. `api.get('/farmers', {q})`). Errors arrive as `ApiError {status, code, message, details}`;
  show `message` (it's written for users). Validation errors carry `details.fields[]`.
* Auth: `AuthService` (`profile()`, `can(perm)`), permission strings in `api/app/core/permissions.py`.
  Hide actions the user can't perform (`auth.can('land.manage')`) — the API enforces anyway.
* Current project: `ProjectContext` (`current()`, `currentId()`) — MRV screens are scoped to it.
* Toasts: `ToastService.success/error/apiError`.
* Formatting pipes in `core/format.ts`: `num`, `tco2`, `inr`, `day`, `ago`, `human`.
* UI kit in `src/app/ui/`: `kit.ts` (Badge `<vc-badge [status]>`, DataClass `<vc-dc cls="MEASURED">`,
  PageHeader, Stat, Empty, Loading, ErrorBox, Callout, Modal (drawer mode too), Tabs, Hash (fingerprint),
  Progress, FileDrop, Timeline), `icon.ts` (`<vc-icon name="leaf">` — only names registered there; add
  new lucide icons to the registry if needed), `map-view.ts` (`<vc-map [polygons] [points]>` with
  feature properties `id`, `color`, `label` (HTML)), `chart.ts` (`<vc-chart [option]>` ECharts with product
  defaults; `PALETTE` export).
* Global CSS classes (see `src/styles.scss`): `.card .card-head .card-body .card-foot .card-pad`,
  `.btn .btn-primary|secondary|ghost|danger|accent .btn-sm .btn-icon`, `.input` (inputs/selects/textarea),
  `.field` (label + input + `.hint`/`.error`), `.form-grid` (+`.span-2`), `.table` inside `.table-wrap`
  (`tr.clickable`, `td.num`), `.kv` definition lists, `.grid .grid-2/3/4`, `.row .stack .spacer`,
  `.muted .subtle .small .mono .num`. Use tokens (`var(--forest-600)` etc.) — never raw ad-hoc colours.
* Reference pattern: `src/app/features/audit/audit.page.ts` (header → filters → card with
  loading / error / empty / table). Copy its structure and polish.
* Every list: loading, error and empty states; every destructive/irreversible action: confirmation
  modal; every approval shows *who* created it and why self-approval is refused (API code
  `SELF_APPROVAL_REJECTED`). Values carry their data class badge where meaningful (MEASURED lab values,
  MODELLED predictions, OBSERVED satellite, CALCULATED results).
* Numbers: tabular (`.num`), right-aligned in tables, units always shown. Dates via `day` pipe.
* Responsive: works from 1440px down to 768px (field app & farmer portal down to 360px).
* No emoji. No lorem ipsum. No placeholder “TODO” UI. Realistic copy.

## Structure
Each area lives in `src/app/features/<area>/` with `<area>.routes.ts` exporting default `Routes`
(already wired in `app.routes.ts` under `/app/<area>`, or top-level for `field-app`, `verifier`,
`farmer-portal`, `buyer-portal`). Replace the placeholder route. Sub-pages are child routes
(e.g. `''` list, `':id'` detail). Only edit files inside your own feature folders, plus adding icons
to `ui/icon.ts` (append only). If you need a shared helper, put it in your feature folder.

## Running & checking
* API: http://localhost:8000 (docs at /docs; spec in `../openapi.json`). Web dev server:
  http://localhost:4200 (proxy /api → :8000), live-reloads.
* Demo accounts (password `Demo-Pass-2026!`): admin@, programme@, scientist@, scientist2@, analyst@,
  collector@, collector2@, labtech@, labmanager@, buyer@, finance@, approver@, farmer@ — all `@example.com`.
  Demo data is being seeded; if a list is empty, that's expected until the seed finishes.
* Dev sign-in shortcut: `http://localhost:4200/dev-login?email=admin@example.com&next=/app/farmers`.
* Type-check/build (use your own output folder so parallel builds don't collide):
  `npx ng build --configuration development --output-path=../.builds/<yourname>` — must have **zero errors**.
* Visual check (do it for every screen and fix what looks off):
  `"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars
  --user-data-dir=<tmp dir unique per run> --window-size=1440,900 --virtual-time-budget=9000
  --screenshot=<out.png> "http://localhost:4200/dev-login?email=admin@example.com&next=/app/<area>"`
  then view the PNG. Use a scratch folder for screenshots, not the repo.
