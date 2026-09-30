import {
  ApiService,
  Injectable,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-O2E4BMDK.js";

// src/app/features/calculations/calc.types.ts
var TERM_LABELS = {
  baseline_scenario: "Baseline-scenario change",
  baseline_emissions: "Baseline emissions",
  project_emissions: "Project emissions",
  leakage: "Leakage"
};
var TERM_HELP = {
  baseline_scenario: "Soil-carbon change that would have happened anyway without the project. Subtracted.",
  baseline_emissions: "Emissions (fertiliser N\u2082O, fuel, burning) that the old practice would have caused. Added back.",
  project_emissions: "Emissions the new practice causes, such as extra machinery passes. Subtracted.",
  leakage: "Emissions pushed outside the project area, for example displaced grazing. Subtracted."
};
var TERM_STATUS = {
  supplied: "Approved estimate used",
  not_required_by_rules: "Not required by the rules",
  measured_at_control_sites: "Measured at control sites"
};
function termLabel(t) {
  return TERM_LABELS[t] ?? t.replace(/_/g, " ");
}
function ruleValue(v) {
  if (v === null || v === void 0)
    return "\u2014";
  if (typeof v === "boolean")
    return v ? "Yes" : "No";
  if (Array.isArray(v))
    return v.map((x) => String(x).replace(/_/g, " ")).join(", ");
  if (typeof v === "object")
    return JSON.stringify(v);
  return String(v).replace(/_/g, " ");
}
function ruleSource(v) {
  if (v === null || v === void 0 || v === "")
    return "\u2014";
  if (typeof v === "string")
    return v;
  if (typeof v === "object") {
    const o = v;
    const parts = [
      o["document"] ?? o["source_document"],
      o["section"] ?? o["source_section"],
      o["page"] ?? o["source_page"] ? `p. ${o["page"] ?? o["source_page"]}` : null
    ].filter(Boolean);
    return parts.length ? parts.join(" \xB7 ") : JSON.stringify(v);
  }
  return String(v);
}
function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function openBlob(blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 6e4);
}
var People = class _People {
  api = inject(ApiService);
  loaded = false;
  names = signal(
    {},
    ...ngDevMode ? [{ debugName: "names" }] : (
      /* istanbul ignore next */
      []
    )
  );
  load() {
    if (this.loaded)
      return;
    this.loaded = true;
    this.api.get("/users").subscribe({
      next: (list) => this.names.set(Object.fromEntries(list.map((u) => [u.id, u.full_name]))),
      error: () => this.loaded = false
    });
  }
  name(id, fallback = "\u2014") {
    if (!id)
      return fallback;
    return this.names()[id] ?? fallback;
  }
  static \u0275fac = function People_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _People)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _People, factory: _People.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(People, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  TERM_LABELS,
  TERM_HELP,
  TERM_STATUS,
  termLabel,
  ruleValue,
  ruleSource,
  saveBlob,
  openBlob,
  People
};
//# debugId=512cd48f-b245-5b0f-8775-becc851699bb
//# sourceMappingURL=chunk-5SRO2YLJ.js.map
