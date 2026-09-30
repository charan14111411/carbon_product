import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵstyleProp
} from "./chunk-O2E4BMDK.js";

// src/app/features/fields/field-data.ts
var CROP_COLORS = [
  "#2f7249",
  "#c76329",
  "#1f5f99",
  "#9a6200",
  "#5b47a8",
  "#0e7280",
  "#8f3f17",
  "#4f9168",
  "#2a4d8f",
  "#b3261e",
  "#86b797",
  "#e7a57b"
];
var NO_CROP_COLOR = "#737c76";
function cropColorMap(codes) {
  const uniq = [...new Set(codes.filter((c) => !!c))].sort();
  return new Map(uniq.map((c, i) => [c, CROP_COLORS[i % CROP_COLORS.length]]));
}
var CROP_CATEGORIES = ["field", "horticulture", "plantation", "agroforestry", "rice"];
var PRACTICE_CATEGORIES = ["soil", "nutrient", "water", "residue", "tillage", "trees", "livestock", "energy"];
var CATEGORY_TONE = {
  field: "amber",
  horticulture: "teal",
  plantation: "forest",
  agroforestry: "forest",
  rice: "sky",
  soil: "clay",
  nutrient: "forest",
  water: "sky",
  residue: "amber",
  tillage: "clay",
  trees: "forest",
  livestock: "violet",
  energy: "teal"
};
var SOURCE_LABEL = {
  field_app: "Field app",
  farmer_app: "Farmer app",
  whatsapp: "WhatsApp",
  import: "Import",
  partner: "Partner"
};
var LAND_USES = ["cropland", "grassland", "forest", "wetland", "settlement", "other"];
var LAND_USE_COLOR = {
  cropland: "var(--amber-600)",
  grassland: "var(--forest-400)",
  forest: "var(--forest-700)",
  wetland: "var(--sky-600)",
  settlement: "var(--stone-500)",
  other: "var(--violet-600)"
};
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function evidenceForm(file, kind, entityType, entityId) {
  const f = new FormData();
  f.append("file", file);
  f.append("kind", kind);
  if (entityType) f.append("entity_type", entityType);
  if (entityId) f.append("entity_id", entityId);
  return f;
}

// src/app/features/fields/chip.ts
var _c0 = ["*"];
function Chip_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElement(0, "span", 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background", ctx_r0.swatch());
  }
}
var Chip = class _Chip {
  tone = input(
    "",
    ...ngDevMode ? [{ debugName: "tone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cat = input(
    "",
    ...ngDevMode ? [{ debugName: "cat" }] : (
      /* istanbul ignore next */
      []
    )
  );
  swatch = input(
    "",
    ...ngDevMode ? [{ debugName: "swatch" }] : (
      /* istanbul ignore next */
      []
    )
  );
  t = computed(
    () => this.tone() || CATEGORY_TONE[this.cat()] || "neutral",
    ...ngDevMode ? [{ debugName: "t" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Chip_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Chip)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Chip, selectors: [["vc-chip"]], hostVars: 2, hostBindings: function Chip_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classMap("chip t-" + ctx.t());
    }
  }, inputs: { tone: [1, "tone"], cat: [1, "cat"], swatch: [1, "swatch"] }, ngContentSelectors: _c0, decls: 2, vars: 1, consts: [[1, "sw", 3, "background"], [1, "sw"]], template: function Chip_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275conditionalCreate(0, Chip_Conditional_0_Template, 1, 2, "span", 0);
      \u0275\u0275projection(1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.swatch() ? 0 : -1);
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 22px;\n  padding: 0 8px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 500;\n  white-space: nowrap;\n  line-height: 1;\n  border: 1px solid var(--%NS%stone-200);\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-700);\n}\n.sw[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n  flex: none;\n}\n.t-forest[_nghost-%COMP%] {\n  background: var(--%NS%forest-50);\n  border-color: var(--%NS%forest-200);\n  color: var(--%NS%forest-700);\n}\n.t-clay[_nghost-%COMP%] {\n  background: var(--%NS%clay-50);\n  border-color: var(--%NS%clay-100);\n  color: var(--%NS%clay-700);\n}\n.t-amber[_nghost-%COMP%] {\n  background: var(--%NS%amber-100);\n  border-color: #f1dcae;\n  color: var(--%NS%amber-600);\n}\n.t-sky[_nghost-%COMP%] {\n  background: var(--%NS%sky-100);\n  border-color: #c9dcf0;\n  color: var(--%NS%sky-600);\n}\n.t-teal[_nghost-%COMP%] {\n  background: var(--%NS%teal-100);\n  border-color: #bfe3e6;\n  color: var(--%NS%teal-600);\n}\n.t-violet[_nghost-%COMP%] {\n  background: var(--%NS%violet-100);\n  border-color: #d8d0f0;\n  color: var(--%NS%violet-600);\n}\n.t-red[_nghost-%COMP%] {\n  background: var(--%NS%red-100);\n  border-color: #f3c7c3;\n  color: var(--%NS%red-600);\n}\n.t-outline[_nghost-%COMP%] {\n  background: var(--%NS%surface);\n  border-color: var(--%NS%border-strong);\n  color: var(--%NS%stone-700);\n}\n/*# sourceMappingURL=chip.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Chip, [{
    type: Component,
    args: [{ selector: "vc-chip", changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (swatch()) { <span class="sw" [style.background]="swatch()"></span> }<ng-content />`, host: { "[class]": '"chip t-" + t()' }, styles: ["/* angular:styles/component:scss;7c0c64d812223348;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\chip.ts */\n:host {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 22px;\n  padding: 0 8px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 500;\n  white-space: nowrap;\n  line-height: 1;\n  border: 1px solid var(--stone-200);\n  background: var(--stone-100);\n  color: var(--stone-700);\n}\n.sw {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n  flex: none;\n}\n:host(.t-forest) {\n  background: var(--forest-50);\n  border-color: var(--forest-200);\n  color: var(--forest-700);\n}\n:host(.t-clay) {\n  background: var(--clay-50);\n  border-color: var(--clay-100);\n  color: var(--clay-700);\n}\n:host(.t-amber) {\n  background: var(--amber-100);\n  border-color: #f1dcae;\n  color: var(--amber-600);\n}\n:host(.t-sky) {\n  background: var(--sky-100);\n  border-color: #c9dcf0;\n  color: var(--sky-600);\n}\n:host(.t-teal) {\n  background: var(--teal-100);\n  border-color: #bfe3e6;\n  color: var(--teal-600);\n}\n:host(.t-violet) {\n  background: var(--violet-100);\n  border-color: #d8d0f0;\n  color: var(--violet-600);\n}\n:host(.t-red) {\n  background: var(--red-100);\n  border-color: #f3c7c3;\n  color: var(--red-600);\n}\n:host(.t-outline) {\n  background: var(--surface);\n  border-color: var(--border-strong);\n  color: var(--stone-700);\n}\n/*# sourceMappingURL=chip.css.map */\n"] }]
  }], null, { tone: [{ type: Input, args: [{ isSignal: true, alias: "tone", required: false }] }], cat: [{ type: Input, args: [{ isSignal: true, alias: "cat", required: false }] }], swatch: [{ type: Input, args: [{ isSignal: true, alias: "swatch", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Chip, { className: "Chip", filePath: "src/app/features/fields/chip.ts", lineNumber: 24 });
})();

export {
  NO_CROP_COLOR,
  cropColorMap,
  CROP_CATEGORIES,
  PRACTICE_CATEGORIES,
  SOURCE_LABEL,
  LAND_USES,
  LAND_USE_COLOR,
  escapeHtml,
  evidenceForm,
  Chip
};
//# debugId=176a5257-6a9c-5e14-a3e8-127cceb942d4
//# sourceMappingURL=chunk-B3LTHGQM.js.map
