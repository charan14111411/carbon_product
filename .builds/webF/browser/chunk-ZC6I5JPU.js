import {
  __spreadValues,
  signal
} from "./chunk-O2E4BMDK.js";

// src/app/features/supporting/shared.ts
var Remote = class {
  data = signal(
    null,
    ...ngDevMode ? [{ debugName: "data" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loading = signal(
    false,
    ...ngDevMode ? [{ debugName: "loading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  error = signal(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  seq = 0;
  load(obs, keep = false) {
    const n = ++this.seq;
    this.loading.set(true);
    this.error.set(null);
    if (!keep)
      this.data.set(null);
    obs.subscribe({
      next: (v) => {
        if (n === this.seq) {
          this.data.set(v);
          this.loading.set(false);
        }
      },
      error: (e) => {
        if (n === this.seq) {
          this.error.set(e);
          this.loading.set(false);
        }
      }
    });
  }
  reset() {
    this.seq++;
    this.data.set(null);
    this.error.set(null);
    this.loading.set(false);
  }
};
var TIERS = {
  1: {
    tier: 1,
    label: "Own device",
    short: "Tier 1",
    color: "#275e3f",
    soft: "var(--forest-100)",
    text: "var(--forest-700)",
    explain: "A SoilSync or MicroClime device on the field itself. Highest quality."
  },
  2: {
    tier: 2,
    label: "Nearby station",
    short: "Tier 2",
    color: "#0e7280",
    soft: "var(--teal-100)",
    text: "var(--teal-600)",
    explain: "A Varsapradaya device on a neighbouring farm, adjusted for distance and elevation."
  },
  3: {
    tier: 3,
    label: "External source",
    short: "Tier 3",
    color: "#9a6200",
    soft: "var(--amber-100)",
    text: "var(--amber-600)",
    explain: "Regional gridded data (weather reanalysis, soil maps). Useful, but coarse."
  },
  0: {
    tier: 0,
    label: "Not available",
    short: "None",
    color: "#9aa29c",
    soft: "var(--stone-100)",
    text: "var(--stone-600)",
    explain: "No source could supply a value for this day."
  }
};
var TIER_ORDER = [1, 2, 3, 0];
function tierMeta(t) {
  return TIERS[t ?? 0] ?? TIERS[0];
}
function isoDate(d) {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 6e4);
  return z.toISOString().slice(0, 10);
}
function daysAgo(n) {
  return isoDate(new Date(Date.now() - n * 864e5));
}
function addDays(iso, n) {
  return isoDate(new Date((/* @__PURE__ */ new Date(iso + "T00:00:00")).getTime() + n * 864e5));
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function fieldsFC(fields, props) {
  const features = [];
  for (const f of fields) {
    if (!f.boundary)
      continue;
    const p = props(f);
    if (p === null)
      continue;
    const geometry = f.boundary.type === "Feature" ? f.boundary.geometry : f.boundary;
    features.push({ type: "Feature", id: f.id, geometry, properties: __spreadValues({ id: f.id }, p) });
  }
  return { type: "FeatureCollection", features };
}
function pointsFC(items) {
  return {
    type: "FeatureCollection",
    features: items.map((i) => ({
      type: "Feature",
      id: i.id,
      geometry: { type: "Point", coordinates: [i.lon, i.lat] },
      properties: { id: i.id, color: i.color, label: i.label }
    }))
  };
}
function isSimulated(ref) {
  return !!ref && /simulated/i.test(ref);
}

export {
  Remote,
  TIER_ORDER,
  tierMeta,
  isoDate,
  daysAgo,
  addDays,
  esc,
  fieldsFC,
  pointsFC,
  isSimulated
};
//# debugId=121fec9b-713c-5f77-8149-6a8b1b340091
//# sourceMappingURL=chunk-ZC6I5JPU.js.map
