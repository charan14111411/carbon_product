# Build status

What is built, how it maps to Verra **VM0042 v2.2** (21 October 2025), and what still needs something
outside the software (real accounts, real data or expert sign-off). Updated 1 October 2026.

The engineering reference for every equation, constant and threshold is
[`docs/VM0042_v2.2_REQUIREMENTS.md`](docs/VM0042_v2.2_REQUIREMENTS.md).

## At a glance
* 114 tables, 457 API operations, 13 roles, 34 automatic quality rules. Works for any crop.
* The independent audit against the full VM0042 PDF is in `docs/VM0042_v2.2_REQUIREMENTS.md` (corrections section).
  Every place where the platform does not apply an equation literally is listed in
  [`docs/METHODOLOGY_DEVIATIONS.md`](docs/METHODOLOGY_DEVIATIONS.md).
  `api/tests/test_vm0042_worked_examples.py` reproduces the PDF's numeric examples.
* The demo seed builds the whole story through the real API: about 9,100 calls, every approval made by a
  second person. The demo project ends with an approved run of **1,019.65 t CO2e net**, including shade-tree
  carbon, split by vintage and into reductions and removals.
* Production web build: zero errors, zero warnings.

## Phases
**Phase 0 — Foundations.** Multi-tenant data model. Other organisations' records return 404. Sign-in with
bcrypt, JWT and two-step verification for privileged roles. Permission matrix. Append-only ledger tables:
edits are refused before they reach the database. Four-eyes approvals, audit trail, SHA-256 evidence store,
one error format, event outbox, PostgreSQL + PostGIS.

**Phase 1 — MRV core.**
* Programmes, projects, farmers, FPOs and households.
* Fields with boundaries, and Table 7 site characteristics: slope, aspect, texture, WRB group, ecoregion,
  climate zone, precipitation.
* Land-use history, land tenure with verification, eligibility and enrolment.
* Crop and practice catalogue, Table 4 activity data with Box 1 data tiers and farmer attestations.
* Methodology rule packs with Gate 0 approval.
* Sampling: strata and quantification units, campaigns, power analysis, reproducible point placement.
* Offline field app with GPS, photos, QR labels and a sync queue; chain of custody.
* Lab batches, results, certificates and review.

**Phase 2 — Calculate, verify, farmers.**
* VM0042 calculation engine, run review and approval, claims register (no double counting), readiness.
* Sealed verification package (JSON, PDF and spreadsheet annex); verifier portal.
* Consent and OTP agreements (English and Kannada), intervention plans, farmer portal.

**Phase 3 — Intelligence.** These inputs inform the work and never count towards credits.
* Satellite indices and practice detection; SOC model with drift checks; SOC map.
* Feature sets, spectroscopy check, supporting data with station checks.

**Phase 4 — Credits and payments.** Credit batches with a move ledger, registry issuance, buyers, offers,
offtake agreements and sales. Benefit pools, payouts with maker/checker and reconciliation. Risk and
non-permanence (NPR) worksheet, monitoring obligations, grievances. Buyer portal and client portfolio.

**Phase 5 — Advanced.** Partner API with keys and scopes, signed webhooks, events feed, credit
forecast, calculation assistant, notifications (templates, outbox, inbound messages), documents and
retention.

## VM0042 v2.2 conformance

| VM0042 | What the platform does | State |
|---|---|---|
| §1, §8.1 structure | Quantification approach per pool/source (Table 5), quantification units, strata, results per vintage | Built |
| §4 applicability | Practice change of more than 5 % in an Appendix 1 category; cropland/grassland; no native clearing or wetland in 10 years; biochar carbon subtracted; **sustained yield decline of more than 5 % flagged** (condition 6) | Built (the yield check warns; the verifier judges "sustained") |
| §5 boundary, de minimis | Sources per Table 3; de minimis below 5 % reported, or excluded when the rule pack says so | Built |
| §6 baseline | Look-back of at least 3 years with a full rotation, repeating schedule, 10-year reassessment date, Table 4 minimum data, Box 1 tiers 1–4 with attestations | Built |
| §7 additionality | Regulatory surplus, barrier analysis, common practice below 20 %, Step 3.2 F = 1 − N_diff/N_all, four-eyes approval | Built |
| §8.2 control sites (QA2) | Within 250 km, at least 3 in the project, at least 1 per stratum, fixed location, management plan, all Table 7 criteria (slope class, aspect, texture, WRB, SOC Welch test at 90 %, 5-year management, **historical land cover**, ecoregion, climate zone, precipitation ±100 mm) | Built |
| §8.2.1 sampling | Stratified random design, intended and actual location, same season, probe diameter and cores, ESM mandatory at 30 cm or deeper, at least 2 increments at re-sampling, Eq. 1–3, shipping and storage limits, lab method and lab-change justification | Built |
| §8.2.3–8.2.11 QA3 emissions | Eq. 6–32 from Table 4 activity data (flat per-hectare form or itemised entries), conservative factor end (§8.6.3), GWP 28/265 | Built |
| §8.4 leakage | Eq. 33 organic amendments with the three exemptions | Built |
| | Biomass-residue leakage (TOOL16, §8.4.4) and displacement / production-decline leakage (VMD0054, Eq. 34–36), plus the §8.3/§8.4.2 livestock floor | Built (the VMD0054 land-area and emission-factor steps are entered from the proponent's worksheet; see D9) |
| §8.5 net ERR | Eq. 37–47, indicator I and I_soil, annualised over the period, negative results never floored | Built |
| | Tree and shrub biomass (Eq. 48–51): permanent plots, approved allometric equations (AR-TOOL14 structure), sampling variance | Built (review against AR-TOOL14; see D10) |
| §8.6 uncertainty | QA2 Eq. 70–71 with covariance, Eq. 73 spectroscopy check, Eq. 74 with t at 0.667 | Built |
| | QA1 model error (Eq. 60–64), Monte Carlo (Eq. 65–69), Appendix 6 multi-stage estimators (A6.1–A6.9) | Built |
| §8.7 VCUs | Buffer on stock changes only (Eq. 75–76), Eq. 77–79 by vintage | Built |
| §9 monitoring | Parameter provenance, monitoring plan, SOC re-measurement every 5 years and baseline reassessment every 10 as obligations, retention at least 2 years after crediting | Built |
| Appendix 4 | Calibration metrics (RMSE, R², RPIQ, bias, Lin's CCC); 10–15 % dry-combustion check | Built |
| QA1 process models (VMD0053) | Model register with §4 cond. 4 checks and four-eyes approval; run imports with Eq. 4; uncertainty; true-up every 5 years. The model itself (e.g. DayCent) runs outside the platform, and VMD0053's validation steps are recorded as evidence | Built (VMD0053 isn't part of VM0042; its validation is evidenced, not computed) |

## Needs something outside the software before real use
| Item | Why |
|---|---|
| Expert review of interpretations | The deviation register (D1–D12) and the VMD0053/VMD0054/AR-TOOL14 parts need a VM0042 expert or the verifier to confirm them. |
| Methodology owner sign-off | Fixed VM0042 values are entered with their section and page. Emission factors, buffer % and quantification approaches are project decisions; in the demo they are marked "DEMO — replace before real use". An expert should check the engine against a Verra worked example before the first verification. |
| Verra templates | The package and CSV annex carry the data. The official Verra ERR spreadsheet and monitoring-report templates still have to be filled from them. |
| NPR score | The worksheet records the VCS AFOLU Non-Permanence Risk Tool result; the tool itself is completed outside the platform. |
| Real providers | Weather, soil, DEM, satellite, registry, payout, eSign and WhatsApp/SMS adapters ship with clearly labelled simulated providers. Plug in real ones with credentials. |
| Database migrations | The schema is created from the models on start-up. Add Alembic migrations before the first production deployment. |
| Deployment | Runs locally with Docker. Production hosting, backups, monitoring and a penetration test are still to do. |
| Field and language testing | Test the field app on real phones in the field; have a native speaker review the Kannada. |

## Quality
* Backend: automated tests on in-memory SQLite, with a pass and a fail case for every rule, including
  four-eyes, tenancy and the client-viewer allowlist.
* Web: production build with zero errors and zero warnings. Screens checked in a browser for each role,
  including client@ and farmer@ at phone width.
