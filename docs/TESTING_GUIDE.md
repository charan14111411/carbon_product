# Hands-on guide: test the whole product yourself

This guide is for learning the product by using it. Part 1 explains the ideas, Part 2 lists the people (roles)
and Part 3 the outside services. Part 4 sets up a database, Part 5 tours the finished demo, and Part 6 builds a
project from an empty database, one person at a time. Part 7 lists the safety rules to try to break.

Commands are for PowerShell on this machine. The API lives in `carbon-platform\api` and the web app in
`carbon-platform\web`.

---------------------------------------------------------------------------------------------------------------
## Part 1 — The idea in ten minutes

**What is sold.** A *carbon credit* (VCU, Verified Carbon Unit) is 1 tonne of CO₂e removed from the air or not
emitted. Farmers who change practices, such as cover crops, less tillage, compost, less synthetic nitrogen or
shade trees, store more carbon in their soil and emit less. A buyer pays for verified tonnes, and part of that
money goes back to the farmers.

**Who decides what counts.** Verra's methodology **VM0042 v2.2** (*Improved Agricultural Land Management*) is the
rulebook. It says which farms qualify (§4), how to set the "business as usual" baseline (§6), how to prove the
project is additional (§7), and how to measure soil carbon (§8.2). It also gives the formulas for net tonnes
(Eq. 37–47), the uncertainty deduction (Eq. 74) and the buffer pool (Eq. 75–79). The full extract is in
`docs/VM0042_v2.2_REQUIREMENTS.md`.

**The core principle of this product.** *The lab measures the carbon.* Credits come only from accepted laboratory
results on real soil cores. Sensors, satellites and models make the work cheaper and better targeted, but they
are labelled **MODELLED / DERIVED / OBSERVED** and never count as measurements. Badges on every screen show the
data class.

**How a tonne is produced, step by step:**

```
Farmers + consent ─▶ Fields (boundaries, Table 7 site data, land-use history, tenure) ─▶ Eligibility & enrolment
        │
        ▼
Baseline activity data (Table 4, 3+ look-back years) ─▶ Practice change > 5 % ─▶ Additionality (§7)
        │
        ▼
Zones/strata + control sites (Table 7) ─▶ Sample plan ─▶ Field app: cores + custody ─▶ Lab results (accepted)
        │                                                                           │
        └──────── same again at monitoring (same season, ≥ 2 depth increments) ─────┘
        ▼
Quality checks (34 rules) ─▶ Calculation run: ESM stocks, ΔSOC vs controls, emissions (QA3), leakage,
                              uncertainty, buffer, VCUs per vintage ─▶ second person approves
        ▼
Verification package (sealed) ─▶ verifier link ─▶ credit batch ─▶ registry issuance ─▶ sales / retirements
        ▼
Benefit pool ─▶ farmer entitlements ─▶ payout batch (maker / checker) ─▶ reconciliation
```

**Three quantification approaches (QA)**, chosen per pool or source in the rule pack:
* **QA2, measure and re-measure.** This is the demo's approach. Soil is sampled at the start and again at
  monitoring, and the project is compared with *control sites* that keep farming the old way.
* **QA3, default factors.** Emissions from fuel, liming, fertiliser and livestock are calculated with IPCC
  factors from activity data.
* **QA1, measure and model.** A validated process model such as DayCent predicts the change and is checked
  against re-measured soil at least every 5 years.

**Words you will see:**

| Word | Meaning |
|---|---|
| Stratum / zone | A group of similar fields sampled together (same crop, climate, soil, slope) |
| Quantification unit (QU) | One or more strata accounted together |
| Control site | A field that keeps baseline management; it stands in for "what would have happened" |
| ESM | Equivalent soil mass: carbon compared at the same soil mass, not the same depth (mandatory) |
| Campaign | One sampling round (baseline, monitoring) |
| Rule pack | The methodology values a project uses; nothing calculates until a second person approves it (Gate 0) |
| Four-eyes | The person who created something can never approve it |
| Term | A number calculated elsewhere (tree carbon, QA1 model result, leakage) that is approved and fed into a run |
| Buffer | A share (from the risk tool, 15 % in the demo) held back against future reversals |
| Vintage | The calendar year the credits belong to |

---------------------------------------------------------------------------------------------------------------
## Part 2 — The people (13 roles)

Each sign-in has exactly one role. Users belong to one organisation, and another organisation's data is
invisible (it returns "not found"). Roles that approve things must also pass two-step verification in production.

| # | Role (code) | Real-world person | Can | Cannot | Demo login |
|---|---|---|---|---|---|
| 1 | Platform administrator (`platform_admin`) | IT / system owner | Everything, including creating other admins | — | admin@example.com |
| 2 | Programme manager (`programme_admin`) | Runs the programme day to day | Programmes, projects, farmers, land, sampling plans, approve calculation runs, packages, credits, sales, risk, grievances, users, partners | Edit or approve methodology rules; enter lab results; approve payouts | programme@example.com |
| 3 | Carbon analyst (`mrv_analyst`) | MRV analyst | Run calculations, resolve quality findings, plan sampling, sync data | Approve their own runs; change rules | analyst@example.com |
| 4 | Methodology scientist (`methodology_owner`) | Soil scientist / methodology owner | Enter and approve rule packs, approve sample plans, manage and approve models (QA1, SOC model) | Approve their *own* rules, plans or models (two scientists exist for that) | scientist@ / scientist2@example.com |
| 5 | Field collector (`field_collector`) | Field staff with a phone | Offline field app: collect cores, custody, practices, land data | See calculations, money or rules | collector@ / collector2@example.com |
| 6 | Lab technician (`lab_technician`) | Lab staff | Enter or import results and certificates — **only for their own lab** | Accept results; see other labs | labtech@example.com |
| 7 | Lab manager (`lab_manager`) | Lab head | Review: accept or reject results | — | labmanager@example.com |
| 8 | Verifier (`verifier`) | Independent auditor (VVB) | Read one sealed package, raise queries, record a decision | Change anything | *link, not a login* (see `api\var\demo_accounts.txt`) |
| 9 | Buyer (`buyer`) | Company buying credits | See their purchases, serials and retirements (`/buyer`) | See farmers or other buyers | buyer@example.com |
| 10 | Finance (prepare) (`finance_maker`) | Accounts staff | Benefit rules, payout pools, payment batches | Approve them | finance@example.com |
| 11 | Finance (approve) (`finance_checker`) | Finance head | Approve what the maker prepared, release on-hold payouts | Prepare | approver@example.com |
| 12 | Farmer (`farmer`) | The farmer | Own portal (`/farmer`, English / ಕನ್ನಡ): fields, agreements, plan, payments, complaints | See anyone else | farmer@example.com |
| 13 | Client (read-only) (`client_viewer`) | The programme's corporate client | Portfolio, results, verification and credits, with farmer identities **masked** | Open any page outside an allowlist | client@example.com |

All demo passwords are `Demo-Pass-2026!`.

---------------------------------------------------------------------------------------------------------------
## Part 3 — Outside services: what is real, what is simulated

**By default no outside API is called by the backend.** Every integration is an *adapter* with a clearly named
simulated provider, so the product runs offline and without accounts. Data from a simulated provider is labelled as
such. Weather, soil map, terrain and satellite also have **real providers** for free public APIs (no account, no
key) — switch them on as described below. For the others, implement the same interface and switch with the
environment variable shown.

| Service | Used for | Today | Switch |
|---|---|---|---|
| **Varsapradaya member platform** (FarmFuture) | When adding a farmer, look up their phone to see if they're a member and import their farms | Simulated: a phone number ending in an **even digit** is a member (`VP-xxxxxx`); **real one available** | `VC_MEMBER_DIRECTORY=farmfuture` |
| **Varsapradaya devices** (SoilSync sensors, MicroClime stations) | Supporting data tier 1–2: soil moisture and temperature, on-farm weather | Simulated readings; **real one available**: latest values read every hour and kept, so the farm's own devices supply its daily data | `VC_DEVICE_PROVIDER=farmfuture` |
| Weather (NASA POWER) | Supporting data tier 3 when no device is near | Simulated NASA POWER; **real one available** | `VC_WEATHER_PROVIDER=nasa_power` |
| Soil map (ISRIC SoilGrids) | Texture and WRB soil-group *suggestions* for fields | Simulated; **real one available** | `VC_SOIL_PROVIDER=soilgrids` |
| Terrain (DEM: Copernicus GLO-30) | Slope, aspect and Appendix 5 slope class per field | Simulated DEM; **real one available** | `VC_TERRAIN_PROVIDER=copernicus_dem` |
| Satellite (Sentinel-2, Landsat) | NDVI/NDMI/NDWI/LST (+ LAI derived), practice detection (cover crop, tillage), alerts | Simulated Sentinel; **real one available** | `VC_SATELLITE_PROVIDER=planetary_computer` |
| SMS / WhatsApp | Farmer notifications, inbound replies | Simulated outbox | `VC_MESSAGING_PROVIDER` |
| UPI / bank payouts | Paying farmers | Simulated (some payments fail on purpose, to test retries) | `VC_PAYOUT_PROVIDER` |
| OTP signing (agreements, plans, attestations) | Farmer signs by SMS code | Demo code **123456** (refused in production) | — |
| Carbon registry (Verra) | Credit issuance and serials | Recorded by hand (registry name, reference); no API | — |

**Called from the browser:** map tiles (Esri ArcGIS World Imagery and Topo) and map label fonts (MapLibre demo
server). Without internet, the maps are blank but everything else works.

### Switching weather, soil map, terrain and satellite to the real public services

1. Open `api\.env` and remove the `#` in front of the lines you want (all four can be on at once):
   ```
   VC_WEATHER_PROVIDER=nasa_power
   VC_SOIL_PROVIDER=soilgrids
   VC_SATELLITE_PROVIDER=planetary_computer
   VC_TERRAIN_PROVIDER=copernicus_dem
   ```
   The choice is read on every request, so no restart is needed (a variable set in the terminal wins over
   `api\.env`). Put the `#` back to return to the simulations. The backend needs internet for these. Only
   coordinates, dates and public scene ids are sent — never farmer or user data.
2. Use a field with a real boundary (the demo fields around lat 12.4, lon 75.7 work). Values are real but they
   are **context, not measurements**: none of them is ever used for credits (`credit_eligible: false`).

What to expect on screen:

* **Supporting data** (menu) → *Sync project*, or a field's explorer → *Sync*: weather days with no device now
  show provider `nasa_power` with a source like `nasa_power daily point 12.400,75.700 (MERRA-2 …)`, data class
  **MODELLED**, tier 3. Rain, air temperature, humidity, solar radiation and wind come from NASA POWER. Soil
  moisture and soil temperature stay **not available** without a SoilSync device (POWER only has *relative*
  wetness 0–1, which is not % volume, and skin temperature, which is not soil temperature). The last ~5–7 days
  are often *not available* because POWER publishes with a delay. A first sync takes 1–3 s per field. If NASA
  POWER is down the sync still finishes; the days read "Not available: … external source unavailable (The NASA
  POWER service is unavailable right now …)". Days already synced from the simulation keep their simulated rows
  (records are never overwritten; the source says "(simulated)") — sync a window that was not synced before, or a
  new field, to see real values.
* **Field → Site characteristics → Soil map → Get suggestion**: provider `soilgrids`, source `soilgrids v2.0
  250 m, 0-30 cm mean …`, the texture class worked out from SoilGrids sand/silt/clay (0–30 cm depth-weighted) and
  the most probable WRB group with its probability (e.g. *Cambisols, 15 %* at the demo point). SoilGrids is slow:
  expect 10–40 s for the first lookup of a place (then cached). If it is down or has no value there (water,
  built-up land) you get a clear message instead of a suggestion. Soil pH in Supporting data (tier 3) also comes
  from SoilGrids.
* **Field → Site characteristics → Refresh terrain**: provider `copernicus_dem`, a few seconds; slope, aspect and
  elevation from the 30 m Copernicus DEM (a surface model, so tall tree canopy adds a little height).
* **Satellite & practices → field → Refresh** (last 365 days): source `sentinel-2-l2a (planetary computer)` for
  NDVI/NDMI/NDWI and `landsat-c2-l2 (planetary computer)` for land-surface temperature; LAI is derived from NDVI
  (DERIVED). Takes 10–60 s per field. Clouds are removed pixel by pixel inside the field; *cloud %* is the share
  of the field that was cloudy, and passes above 40 % are shown as excluded. Expect gaps in the monsoon. If the
  service is down the toast says "The Microsoft Planetary Computer service is unavailable right now"; nothing is
  written. NDVI alerts and practice detection then work on the real series.

### Switching the Varsapradaya member platform and devices to the real FarmFuture API

The real client talks to `https://api.farmfuture.io/api` with four **read-only** calls: `ValidateMobileNumber`
(is this number a customer?), `GetUserEstatesAndFarmsList` (their estates and farms), `GetAllSensorsLatestData`
(SoilSync) and `GetAllWeatherData` (MicroClime). No key is needed: their token comes from the farmer's own phone
number, is kept **in memory only** (never in the database, a log or a response) and is re-validated after
`FARMFUTURE_TOKEN_TTL_S` seconds. Unlike the public services above, this sends the farmer's **phone number** to
Varsapradaya — only test with numbers you are entitled to look up.

1. **Check the connection first, from the terminal, with your own number** (writes nothing):
   ```powershell
   cd api
   ..\.venv\Scripts\python -m scripts.farmfuture_check +91XXXXXXXXXX            # all four calls
   ..\.venv\Scripts\python -m scripts.farmfuture_check +91XXXXXXXXXX --keys     # also print their field names
   ..\.venv\Scripts\python -m scripts.farmfuture_check +91XXXXXXXXXX --farm <farm GUID>   # one farm's devices
   ```
   One line per call (`DATA=yes`, `EMPTY` or `FAIL`; the phone shows as `+9198****5678`, the token as
   `...abc123 (len N)`), then a table and `OK` / `FAIL`. `EMPTY` on the sensor or weather call just means that
   farm has no such device.
2. In `api\.env` remove the `#` in front of:
   ```
   VC_MEMBER_DIRECTORY=farmfuture
   VC_DEVICE_PROVIDER=farmfuture
   ```
   and **restart the API** (the member-directory choice is read at start-up). Optional settings, with their
   defaults: `FARMFUTURE_BASE_URL`, `FARMFUTURE_TIMEOUT_S=30`, `FARMFUTURE_TOKEN_TTL_S=900`,
   `FARMFUTURE_VERIFY_TLS=true`, `FARMFUTURE_COUNTRY_CODE=+91` (added to numbers typed without a country code —
   their API only accepts E.164 and answers anything else with "user does not exist").
3. **Farmers → Add farmer → Check membership** with a customer's number. A member shows the member ID
   (`FF-<number>`), each farm with its estate, PIN code, crops, plants per hectare, SoilSync / MicroClime
   chips and a device-tier badge: **Full** (soil and weather readings arrived), **Partial** (one of them) or
   **No device data**. The tier comes from readings that actually arrived, never from their "has sensor" flags;
   weather *forecasts* and the firmware's `-1` "no reading" values never count. Three different answers:
   * *Not a Varsapradaya customer* — their real "no"; add the farmer as usual.
   * *Varsapradaya unavailable — Retry* (HTTP 503 `MEMBER_DIRECTORY_UNAVAILABLE`) — the platform could not be
     reached or rejected the request. Nothing is saved; the farmer is **not** marked as a non-member.
4. Open the farmer → **Varsapradaya farms** → tick farms → **Import farms**. Each becomes a farm record with
   the Varsapradaya farm ID, the PIN code and a note with the estate and crops. Already-imported farms are
   skipped (one farm per Varsapradaya farm per organisation). **No fields are created**: Varsapradaya holds no
   boundary, area or coordinates, so map each field under *Fields & map* before enrolment.
5. On the farm card, **Refresh devices from Varsapradaya** registers or updates the farm's devices (device ID =
   their MAC id, status *online* if the reading is at most 2 days old, else *offline*) and shows the latest
   values, labelled **MEASURED**. Their API returns the **latest value only**, so the platform **keeps every
   reading it fetches** (table `device_readings`). While `VC_DEVICE_PROVIDER=farmfuture` is on, the API also reads
   every member farm automatically every `VARSAPRADAYA_POLL_MINUTES` (default 60). From then on, *Supporting
   data* for that farm's fields uses **its own SoilSync / MicroClime first (tier 1, MEASURED)** for every day
   they reported, and falls back to a nearby station or NASA POWER (tier 2 / 3) only for days without a reading.
   History starts on the day reading begins; earlier days can't be filled because their API has none. Run one
   round by hand with `..\.venv\Scripts\python -m scripts.poll_varsapradaya`, or *POST
   /api/varsapradaya/devices/poll* from the API docs. Soil moisture is shown but not mapped to the 20 cm / 60 cm
   parameters (their probe reports no depth).

Automated tests (`api/tests/test_farmfuture.py`) replay responses recorded from the live API through a mock
transport and never call it. Put the `#` back in `api\.env` (and restart) to return to the simulation.

---------------------------------------------------------------------------------------------------------------
## Part 4 — Get a database ready (pick A or B)

Both use the database in `api\.env` (`DATABASE_URL`, now `carbon_latest` on `localhost\SQL_LOCAL`).

**A. The finished demo** (fastest way to see everything, about 5 minutes):
```powershell
cd "D:\Desktop\organic carbon\carbon-platform\api"
..\.venv\Scripts\python -m scripts.seed_demo --reset
```
**B. Truly from scratch** (empty, your own organisation):
```powershell
cd "D:\Desktop\organic carbon\carbon-platform\api"
..\.venv\Scripts\python -m scripts.bootstrap empty-db            # type YES — wipes the app's tables
..\.venv\Scripts\python -m scripts.bootstrap create-org --name "My Test Org" --slug mytest `
    --admin-email admin@mytest.in --admin-name "Your Name" --password "Your-Long-Password-1"
```

Then start the app (two terminals):
```powershell
# terminal 1
cd "D:\Desktop\organic carbon\carbon-platform\api"; ..\.venv\Scripts\python -m uvicorn app.main:app --port 8000
# terminal 2
cd "D:\Desktop\organic carbon\carbon-platform\web"; npx ng serve
```
Open http://localhost:4200. API documentation, where every endpoint can be tried: http://localhost:8000/docs.

**Tip:** use two browsers, or a normal and a private window, so you can be signed in as two people at once. You
need that for every "second person approves" step.

---------------------------------------------------------------------------------------------------------------
## Part 5 — Tour the finished demo first (option A, about 1 hour)

Sign in as each person and look at the screens below. This shows what "done" looks like before you build
it yourself.

| Login | Open | Look for |
|---|---|---|
| programme@ | Overview | 100 % readiness, 1,019.6 t CO₂e net, the journey bar |
| programme@ | Fields & map → any field | Site characteristics (Table 7), tenure, eligibility checks |
| programme@ | Baseline & activity data | Schedule, records with Box 1 tiers, attestations, practice change (> 5 %) with the yield check |
| programme@ | Additionality | The 3-step result, F = 12.5 % for the compost stack |
| programme@ | Control sites | 3 links passing every Table 7 criterion; the map with distance lines |
| programme@ | Sampling → BL22 / MON25 | Plans, points, samples with custody |
| labmanager@ | Laboratory | Accepted results and certificates |
| analyst@ | Quality checks | 0 open findings |
| analyst@ | Calculations → the approved run | Every equation row (Eq. 3 … 79), uncertainty, buffer, VCUs per vintage |
| analyst@ | Emissions & leakage | QA3 sources, factors used, conservative end |
| analyst@ | Trees & shrubs | Plots, measurements, published tree terms |
| scientist@ | Methodology rules | The rule pack with VM0042 references; tab "Interpretations & deviations" |
| scientist@ | Process model (QA1) | One draft model listing what blocks its approval |
| programme@ | Verification | Sealed package; open the verifier link from `api\var\demo_accounts.txt` in a private window |
| programme@ | Credits / Buyers & sales | Batch CB-2026-001, sales, offtake agreement |
| finance@ / approver@ | Farmer benefits | Pool, entitlements, payout batch with a failed and an on-hold payment, reconciliation |
| farmer@ | /farmer | Switch to ಕನ್ನಡ; fields, agreement, my plan, payments |
| buyer@ | /buyer | Purchases and serials |
| client@ | Client portfolio | Farmer identities masked; try typing `/app/farmers` in the address bar: you're sent back |
| collector@ | /field | The offline field app (try it at phone width) |

---------------------------------------------------------------------------------------------------------------
## Part 6 — Build a project from scratch (option B)

Follow the phases in order. Each step says **who** does it, **where**, **what to enter** and **what you should
see**. Keep a notebook of what you created.

### Phase 0 — People
**Admin → Administration → Users & roles.** Create one user per role from Part 2: two methodology scientists, one
collector, one lab technician, one lab manager, an analyst, a programme manager, finance maker and checker, a
farmer, a buyer and a client. Use any emails, for example `p1@mytest.in`.
* Expect: each user appears with its role. Sign in as one in the other browser to check.
* Lab technician: you will link them to a lab in Phase 5. Until then they see nothing; this is deliberate
  ("fail closed").

### Phase 1 — Catalogue and programme
1. **Programme manager → Crops & practices catalogue** → *Install defaults* (13 crops, 14 practices). The product
   is crop-agnostic, so add your own crop if you like.
2. **Programmes & projects** → create a programme, then a project:
   * methodology VM0042 v2.2;
   * project start in the past, e.g. **1 Nov 2022**, so 2017–2021 can be the look-back and 2022–2025 project
     years;
   * crediting period of 10 years.
   * Expect: status *draft*, then *active* once you activate it.

### Phase 2 — Rules (Gate 0)
1. **Scientist A → Methodology rules** → new rule pack for the project → **Apply VM0042 defaults** (fixed values
   with section and page).
2. Fill the owner decisions:
   * qa_soc = qa2;
   * QA3 for emissions;
   * emission factors (use the example table);
   * non-permanence buffer % (15);
   * ESM interpolation = cubic_spline;
   * woody biomass included yes or no.
   * Expect: the answered/required counter goes up; choosing `pchip` shows a conformance warning.
3. **Scientist A** tries to approve their own pack. Expect: refused ("another person must approve").
4. **Scientist B** approves it. Expect: status *approved*; calculations are now possible.

### Phase 3 — Farmers, consent, land
1. **Programme manager → Farmers** → add 6 farmers.
   * Give at least one a phone ending in an even digit, e.g. +91 98450 00012. Expect: *Varsapradaya member
     found*, and their farms can be imported (simulated).
   * An odd last digit gives "not a member".
2. **Agreements & consent** → create a participation agreement (English + Kannada) → publish → for each farmer,
   **sign by OTP** with code **123456**. Expect: a signed agreement with a fingerprint. A wrong code is refused.
3. **Fields & map** → for each farmer, add a farm and a field by drawing the boundary on the map.
   * Expect: the area is computed. Drawing over an existing field is refused (overlap).
   * Fill the *Site characteristics* (Table 7): slope, texture class, WRB group, ecoregion, climate zone,
     precipitation. Or press *Refresh terrain* and *Apply* the soil suggestion (simulated).
4. **Land-use history** for each field, e.g. cropland 2012–2026, with a document as evidence.
   * Try forest 2018–2020. Expect: the eligibility check fails (§4: no native clearing within 10 years).
5. **Land tenure** → a collector records the tenure document; the programme manager verifies it (four-eyes).
6. **Enrol** each field in the project. Expect: every eligibility check is listed (tenure, land use, consent,
   cropland/grassland); failing ones block.
7. **Households** (optional) → group farmers into a household.

### Phase 4 — Baseline, additionality, zones, control sites
Use a small design: **3 project fields** with the same crop in one zone, plus **3 control fields** (VM0042 needs at
least 3 control sites in the project, and at least 1 per zone).

1. **Baseline & activity data → Activity records.** For *every* field (control fields too), enter look-back
   years **2017–2021** for the Table 4 categories: crop, N fertiliser, tillage and residue, water, grazing,
   liming. Then add project years 2022–2025.
   * Pick a Box 1 tier for each record. Tier 1–2 needs an evidence file; tier 3 needs a farmer attestation,
     signed by OTP on the *Attestations* tab; tier 4 needs a census name, its year and how often it's published.
   * Expect on *Schedule*: each field "ready" once 3+ unbroken look-back years with a full rotation exist.
   * Expect on *Practice change*: a field qualifies only if a practice changes by **more than 5 %**, starts or
     stops. Try a 4 % change and see it refused; a 30 % cut in synthetic N qualifies.
   * The yield strip warns if yields fall more than 5 % over 2+ project years (§4 condition 6).
2. **Additionality** → Step 1 regulatory surplus, Step 2 barriers, Step 3 common practice (< 20 %). If the
   adoption is ≥ 20 %, Step 3.2 computes F = 1 − N_diff/N_all live. Submit, then a different person approves.
3. **Sampling → zones:** create the project zone (stratification factors, quantification unit). Create **3
   control zones** (role *control*), each with one control field, each controlling the project zone.
4. **Control sites → Link control site** for each control zone, with a management plan document. Press **Run
   similarity assessment**.
   * Expect: every Table 7 criterion — distance ≤ 250 km, slope class, aspect, texture, WRB group, SOC (needs
     lab data later), 5-year management, historical land cover, ecoregion, climate, precipitation ±100 mm.
   * Change one control field's precipitation by 150 mm and re-run: that link fails.

### Phase 5 — Lab and baseline sampling
1. **Laboratory → Labs** → create the lab (ISO 17025 yes, proficiency programme, error report document).
   **Admin → Users** → set the lab technician's scope to this lab.
2. **Sampling → Campaign** → baseline campaign, e.g. *BL22*, Nov–Dec 2022, depth 0–50 cm.
   * Make a **sample plan** per zone: at least 3 composite samples; the power analysis is shown.
   * A different scientist approves the plan. Place points; they're reproducible from the seed. Assign them to
     the collector. Open the campaign for fieldwork.
3. **Collector → /field** (use the phone width in the browser dev tools).
   * Download the campaign, then switch the browser *offline* (DevTools → Network → Offline).
   * At each point, record GPS, photos, probe diameter, cores composited, and depth layers (0–30 and 30–50 cm).
     Print or scan the QR label.
   * Go online again and **sync**. Expect: nothing lost, no duplicates.
   * Record custody steps: collected → prepared (dried) → shipped → received by the lab.
4. **Lab technician → Laboratory → Results:** enter SOC %, bulk density, coarse fraction and fine-soil mass for
   each layer.
   * The CSV import is quickest; the screen offers a template. Attach the lab certificate.
5. **Lab manager** accepts the results, or rejects one with a reason. Expect: the technician can't accept their
   own results.

### Phase 6 — Monitoring and calculation
1. Repeat Phase 5 for a **monitoring campaign** in the **same season**, e.g. *MON25*, Nov–Dec 2025, with at least
   **2 depth increments**.
   * Try a different season. Expect: refused unless you give an override reason.
2. **Quality checks** (analyst) → run them. Expect findings such as GPS too far, shipped late, storage too long or
   missing increments. Resolve each with a note, or fix the data.
3. **Emissions & leakage** → check the QA3 breakdown for the period: fuel, liming, fertiliser N₂O and any
   livestock.
   * If livestock numbers fell in project years, expect the §8.4.2 floor message.
4. **Trees & shrubs** (if woody biomass is included) → allometric equation; a second person approves it → plots
   → two campaigns → measurements → *Compute & publish* → a second person approves the term (Calculations →
   Decided terms).
5. **Leakage records** → residues (TOOL16) ruled out with a reason, and one "no decrease" record per project year.
6. **Calculations → New run** (analyst): period 2022-11-01 to 2025-12-31, baseline BL22 against monitoring MON25.
   * Expect: the full equation trail — ESM stocks, Eq. 70–71 variance, Eq. 74 uncertainty, Eq. 37/40 reductions
     and removals, Eq. 75–76 buffer (stock changes only), Eq. 77–79 VCUs per vintage. Negative results are never
     raised to zero.
   * The analyst tries to approve their own run: refused. The **programme manager** approves it.

### Phase 7 — Verification, credits, money
1. **Verification** (programme manager) → build the package (JSON + PDF + CSV annex, sealed with a fingerprint)
   → give the verifier access (name, email, days).
   * Open the link in a private window: evidence explorer, provenance tree; raise a query; answer it as the
     programme manager; record the decision.
2. **Credits** → create a batch from the approved run → **issue** (registry name and reference) → serials.
   * Try issuing more than the run allows. Expect: refused.
3. **Buyers & sales** → create the buyer, linked to the buyer login → offer → offtake agreement (four-eyes
   signing) → sale → deliver.
   * Sign in as the buyer: the purchase shows at `/buyer`.
   * Try selling more than is available. Expect: refused (balances can't go negative).
4. **Farmer benefits** → finance maker: benefit rule, pool from the sale, entitlements.
   * Expect the entitlements to add up exactly to the pool; control-site farmers are excluded.
   * Payment profiles (UPI is masked) → payout batch.
   * **Finance checker** approves it. The simulated provider fails some payments on purpose: retry them, release
     the on-hold one, then upload a bank CSV in *Reconciliation*.
5. **Farmer link:** create the farmer login in Users, then run (in the api folder)
   `..\.venv\Scripts\python -m scripts.bootstrap link-farmer --email <farmer login> --farmer-code <F-00001>`.
   * Sign in as the farmer: `/farmer` shows their fields, agreement, plan and payment, in English or ಕನ್ನಡ.

### Phase 8 — Care, risk and the rest
* **Intervention plans:** a plan per farmer, agreed by OTP and activated by a second person; *Detect
  deviations*.
* **Risk & permanence:** NPR worksheet → approval by a second person; *Generate obligations* (SOC re-measure ≤ 5
  years, baseline reassessment ≤ 10 years, retention); risk events with remediation.
* **Grievances:** the farmer raises one in the portal; it is handled with a due date; an appeal.
* **Notifications:** install the templates (English and Kannada, a second person approves), dispatch, and look at
  the outbox (simulated).
* **Supporting data / Satellite / Soil-carbon models:** simulated sources, all labelled *informing only*.
* **Documents & retention:** versions and the retention report.
* **Partners & API:** an API key with scopes, and a webhook with signed deliveries.
* **Client portfolio:** sign in as the client and confirm farmer names are masked.
* **Audit log** (admin): every create, approve and change you made is listed, with who and when.

### How much data the calculation needs (minimum)

| Item | Minimum |
|---|---|
| Project zone | 1 (3 fields) |
| Control sites | 3 (one field each), each linked to the zone |
| Look-back years | 3+ unbroken years before the start, covering a full rotation (the demo uses 5) |
| Activity records | 6 Table 4 categories × every year × every field (≈ 6 × 9 × 6 ≈ 320) |
| Composite samples per zone per campaign | 3 (≥ 2 depth layers at monitoring) |
| Campaigns | 2 (baseline and monitoring, same season) |
| Lab results | SOC, bulk density, coarse fraction (and fine-soil mass) for every layer |

That is a lot to type by hand. Phases 0–5 can be done fully by hand to learn every screen and rule. For Phase 6
onwards, the CSV import for lab results helps, and the demo (option A) shows a complete calculation with real
volumes.

---------------------------------------------------------------------------------------------------------------
## Part 7 — Things to try to break (they should all be refused)

| Try | Expected |
|---|---|
| Approve something you created (rules, plan, run, payout, model, tenure, additionality) | "You created this, so another person must approve it" |
| Sign in to organisation A and open an id from organisation B (`/api/...` in /docs) | 404 Not found |
| Edit an accepted lab result, an approved run or a signed agreement | Refused: append-only; a correction is a new version |
| Run a calculation before the rule pack is approved | Blocked: the rule pack isn't approved (Gate 0) |
| Remove a required rule value | Fails closed: "the rule pack doesn't include …" — nothing is assumed |
| Record a baseline year after the project start | Refused |
| A practice change of 4 % | Doesn't qualify (> 5 % needed) |
| A control site 300 km away | Fails the 250 km criterion |
| Sell more credits than are available | Refused |
| A wrong OTP | Refused |
| client@ opens `/app/farmers` | Sent back to the portfolio |
| A lab technician enters results for another lab | Not found |
| Draw a field overlapping another | Refused |

---------------------------------------------------------------------------------------------------------------
## Where to read more
* `STATUS.md`: what is built, the VM0042 conformance table, and what needs work outside the software.
* `docs/VM0042_v2.2_REQUIREMENTS.md`: every rule, with section and page.
* `docs/METHODOLOGY_DEVIATIONS.md`: where the platform interprets the text (for the verifier).
* `CONVENTIONS.md`: the safety rules every module follows.
* http://localhost:8000/docs: every API endpoint, which you can call from the browser.
