# Build status

What is built for each phase, and what still needs something outside the software
(real accounts, real data or a signed-off methodology). Updated 30 September 2026.

## Phase 0 — Foundations ✅
Multi-tenant data model (64 tables), organisation isolation on every query (other organisations' records
are 404), sign-in with bcrypt + JWT, two-step verification (TOTP) for privileged roles (enforced in
production), 12 roles with a permission matrix, append-only ledger tables (edits refused before they reach
the database), four-eyes approvals, audit trail, SHA-256 fingerprinted evidence store, one error format,
event outbox, Docker PostgreSQL + PostGIS.

## Phase 1 — MRV core ✅
Programmes and projects with status workflows · farmers, FPOs, Varsapradaya member lookup · farms and fields
with drawn boundaries, computed area, overlap refusal and boundary history · land-use history · eligibility
checks and enrolment · crop and practice catalogue (any crop) · versioned practice ledger · methodology rule
packs with sources and Gate 0 approval · zones, campaigns, sample-size plans, reproducible point placement,
permanent site codes · offline field app (PWA) with GPS, photos, QR labels and a safe sync queue · chain of
custody · lab batches, results, CSV import, certificates, review · 16 automatic quality checks.

## Phase 2 — Calculate, verify, farmers ✅
Calculation engine (fixed depth and equivalent soil mass, stones, paired / independent designs, control
sites, VM0042-style uncertainty deduction, buffer, reductions vs removals, negative results never floored) ·
decided terms · run review and approval · claims register (no double counting) · readiness · sealed
verification package (JSON + PDF) · verifier portal with time-limited links, evidence explorer, provenance
tree, queries and decision · consent and agreements (English + Kannada, OTP signing) · farmer portal ·
supporting-data tiers (own device → nearby station → external) with bias correction and device health.

## Phase 3 — Scale & intelligence ✅ (simulated data sources)
Satellite indices and alerts · practice verification from satellite · SOC prediction model with held-out-farm
validation and approval · SOC map with uncertainty and sampling priority · sampling optimiser · spectral
calibrations · emissions estimate from default factors.

## Phase 4 — Credits & payments ✅ (simulated registry and payout provider)
Credit batches with a move ledger (balances can't go negative or be double-sold) · registry issuance ·
buyers and sales · supply-chain (Scope 3) report · benefit rules, pools and entitlements (sum exactly to the
pool) · payment profiles (masked) · payout batches with maker/checker, failures and retries · risk and
permanence · grievances with due dates and appeals · buyer portal.

## Phase 5 — Advanced ✅ (first version)
Partner API with keys and scopes · signed webhooks with delivery log · events feed · credit forecast ·
calculation assistant (rule-based, cites its sources).

## Needs something outside the software before real use
| Item | Why |
|---|---|
| Methodology values | The demo rule pack uses illustrative values. The methodology owner must enter each from the published VM0042 text (with page) and a second person must approve. The uncertainty equation should be checked against Verra's worked example. |
| Real providers | Weather, soil, satellite, device, registry, payout and eSign adapters ship with clearly labelled simulated providers. Plug in real ones with credentials. |
| SMS / WhatsApp / IVR | Farmer messaging channels are not connected yet (no provider account). The farmer portal works on the web. |
| Database migrations | The schema is created from the models on start-up. Add Alembic migrations before the first production deployment. |
| Deployment | Runs locally with Docker. Production hosting, backups, monitoring and a penetration test are still to do. |
| Field testing | The field app has been tested in a browser with simulated GPS. Test on real phones in the field before a campaign. |
| Native language review | Kannada text should be reviewed by a native speaker. |

## Quality
* Backend: 311 automated tests (in-memory SQLite) — every rule has a pass and a fail case.
* Demo seed: builds the whole story through the real API (≈3,100 calls) with every approval done by a second person.
* Web: production build with zero errors and zero warnings; every screen checked in a browser.
