import {
  RouterLink
} from "./chunk-PNIM44LI.js";
import {
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  computed,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-O2E4BMDK.js";

// src/app/features/calculations/blocker.ts
var _c0 = () => [];
function CalcBlocker_Conditional_0_Conditional_11_For_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const i_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(i_r1.sub);
  }
}
function CalcBlocker_Conditional_0_Conditional_11_For_7_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r2);
  }
}
function CalcBlocker_Conditional_0_Conditional_11_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275element(1, "vc-icon", 12);
    \u0275\u0275elementStart(2, "div", 13)(3, "span", 14);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, CalcBlocker_Conditional_0_Conditional_11_For_7_Conditional_5_Template, 2, 1, "span", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, CalcBlocker_Conditional_0_Conditional_11_For_7_For_7_Template, 2, 1, "span", 16, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const i_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(i_r1.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(i_r1.sub ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(i_r1.chips ?? \u0275\u0275pureFunction0(3, _c0));
  }
}
function CalcBlocker_Conditional_0_Conditional_11_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("and ", v_r3.items.length - 40, " more\u2026");
  }
}
function CalcBlocker_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 9);
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "ul");
    \u0275\u0275repeaterCreate(6, CalcBlocker_Conditional_0_Conditional_11_For_7_Template, 8, 4, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, CalcBlocker_Conditional_0_Conditional_11_Conditional_8_Template, 2, 1, "p", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", v_r3.what, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r3.items.length);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(v_r3.items.slice(0, 40));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(v_r3.items.length > 40 ? 8 : -1);
  }
}
function CalcBlocker_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "a", 17);
    \u0275\u0275text(2);
    \u0275\u0275element(3, "vc-icon", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", v_r3.link.path)("queryParams", v_r3.link.query ?? null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(v_r3.link.label);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function CalcBlocker_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
    \u0275\u0275element(3, "vc-icon", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 5)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "code", 6);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(11, CalcBlocker_Conditional_0_Conditional_11_Template, 9, 3, "div", 7);
    \u0275\u0275conditionalCreate(12, CalcBlocker_Conditional_0_Conditional_12_Template, 4, 4, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r3 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275classMap(v_r3.tone);
    \u0275\u0275advance(3);
    \u0275\u0275property("name", v_r3.tone === "danger" ? "octagon" : "alert")("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(v_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r3.lead);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.error().code);
    \u0275\u0275advance();
    \u0275\u0275conditional(v_r3.items.length ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(v_r3.link ? 12 : -1);
  }
}
var ANALYTE = {
  soc_pct: "Soil organic carbon (%)",
  bulk_density_g_cm3: "Bulk density",
  coarse_fraction: "Stone (coarse) fraction"
};
var CalcBlocker = class _CalcBlocker {
  error = input(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  view = computed(
    () => {
      const e = this.error();
      if (!e)
        return null;
      const d = e.details ?? {};
      switch (e.code) {
        case "QA_BLOCKING": {
          const f = d["findings"] ?? [];
          return {
            tone: "danger",
            title: "Blocking quality issues must be resolved first",
            lead: e.message,
            what: "Open blocking issues",
            items: f.map((x) => ({ title: x.message, sub: `${humanize(x.entity_type)} \xB7 ${x.entity_id.slice(0, 8)}`, chips: [x.rule_code] })),
            link: { label: "Go to quality checks", path: "/app/quality" }
          };
        }
        case "MISSING_LAB_RESULT": {
          const l = d["layers"] ?? [];
          return {
            tone: "danger",
            title: "Some soil layers have no accepted lab results",
            lead: e.message,
            what: "Layers waiting for results",
            items: l.map((x) => ({ title: `Layer ${x.layer}`, chips: x.analytes.map((a) => ANALYTE[a] ?? a) })),
            link: { label: "Go to laboratory", path: "/app/lab" }
          };
        }
        case "RULE_MISSING": {
          const items = [];
          if (d["term"])
            items.push({ title: humanize(String(d["term"])), sub: "No approved estimate exists for this period label" });
          else if (d["rule_key"])
            items.push({ title: humanize(String(d["rule_key"])), sub: "Missing rule or input" });
          for (const k of ["layer", "stratum"])
            if (d[k])
              items.push({ title: `${humanize(k)} ${String(d[k])}` });
          return {
            tone: "danger",
            title: "A required rule or approved input is missing",
            lead: e.message + " Nothing is assumed in its place.",
            what: "What is missing",
            items,
            link: d["term"] ? { label: "Go to decided terms", path: "/app/calculations", query: { tab: "terms" } } : { label: "Review methodology rules", path: "/app/methodology" }
          };
        }
        case "VALIDATION_ERROR": {
          const f = d["fields"] ?? [];
          return { tone: "warn", title: "Some fields need attention", lead: e.message, what: "Fields", items: f.map((x) => ({ title: humanize(x.field), sub: x.message })) };
        }
        default: {
          const items = [];
          for (const [k, v] of Object.entries(d)) {
            if (Array.isArray(v))
              v.forEach((x) => items.push({ title: typeof x === "object" ? Object.values(x).join(" \xB7 ") : String(x), sub: humanize(k) }));
            else
              items.push({ title: humanize(k), sub: typeof v === "object" ? JSON.stringify(v) : String(v) });
          }
          return { tone: e.status >= 500 ? "danger" : "warn", title: "The calculation could not run", lead: e.message, what: "Details", items };
        }
      }
    },
    ...ngDevMode ? [{ debugName: "view" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function CalcBlocker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CalcBlocker)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CalcBlocker, selectors: [["vc-calc-blocker"]], inputs: { error: [1, "error"] }, decls: 1, vars: 1, consts: [["role", "alert", 1, "box", 3, "class"], ["role", "alert", 1, "box"], [1, "top"], [1, "ic"], [3, "name", "size"], [1, "t"], [1, "code"], [1, "list"], [1, "foot"], [1, "lh"], [1, "n"], [1, "more"], ["name", "corner-down-right", 3, "size"], [1, "it"], [1, "it-t"], [1, "it-s"], [1, "chip"], [1, "btn", "btn-secondary", "btn-sm", 3, "routerLink", "queryParams"], ["name", "arrow-right", 3, "size"]], template: function CalcBlocker_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, CalcBlocker_Conditional_0_Template, 13, 9, "div", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.view()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [Icon, RouterLink], styles: ["\n.box[_ngcontent-%COMP%] {\n  border: 1px solid;\n  border-radius: var(--%NS%radius);\n  overflow: hidden;\n}\n.box.danger[_ngcontent-%COMP%] {\n  border-color: #f3c7c3;\n  background: var(--%NS%surface);\n}\n.box.warn[_ngcontent-%COMP%] {\n  border-color: #f1dcae;\n  background: var(--%NS%surface);\n}\n.top[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  padding: 14px 16px;\n  align-items: flex-start;\n}\n.danger[_ngcontent-%COMP%]   .top[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n}\n.warn[_ngcontent-%COMP%]   .top[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n}\n.ic[_ngcontent-%COMP%] {\n  flex: none;\n  color: var(--%NS%red-600);\n  margin-top: 1px;\n}\n.warn[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.t[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.t[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n}\n.t[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n  font-size: 13.5px;\n  margin-top: 2px;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 11px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.7);\n  color: var(--%NS%stone-600);\n  white-space: nowrap;\n}\n.list[_ngcontent-%COMP%] {\n  padding: 10px 16px 12px;\n}\n.lh[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n  margin-bottom: 4px;\n}\n.n[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-700);\n  font-size: 11px;\n  margin-left: 4px;\n}\nul[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  max-height: 280px;\n  overflow: auto;\n}\nli[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 7px 0;\n  border-bottom: 1px solid var(--%NS%stone-100);\n  color: var(--%NS%text-3);\n}\nli[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.it[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.it-t[_ngcontent-%COMP%] {\n  color: var(--%NS%text);\n  font-size: 13.5px;\n  font-weight: 500;\n}\n.it-s[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.chip[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--%NS%sand-100);\n  border: 1px solid var(--%NS%border);\n  color: var(--%NS%stone-700);\n  white-space: nowrap;\n}\n.more[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-3);\n  margin-top: 6px;\n}\n.foot[_ngcontent-%COMP%] {\n  padding: 0 16px 14px;\n}\n/*# sourceMappingURL=blocker.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalcBlocker, [{
    type: Component,
    args: [{ selector: "vc-calc-blocker", imports: [Icon, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (view(); as v) {
      <div class="box" [class]="v.tone" role="alert">
        <div class="top">
          <span class="ic"><vc-icon [name]="v.tone === 'danger' ? 'octagon' : 'alert'" [size]="18" /></span>
          <div class="t">
            <strong>{{ v.title }}</strong>
            <p>{{ v.lead }}</p>
          </div>
          <code class="code">{{ error()!.code }}</code>
        </div>
        @if (v.items.length) {
          <div class="list">
            <div class="lh">{{ v.what }} <span class="n">{{ v.items.length }}</span></div>
            <ul>
              @for (i of v.items.slice(0, 40); track $index) {
                <li>
                  <vc-icon name="corner-down-right" [size]="14" />
                  <div class="it">
                    <span class="it-t">{{ i.title }}</span>
                    @if (i.sub) { <span class="it-s">{{ i.sub }}</span> }
                  </div>
                  @for (c of i.chips ?? []; track c) { <span class="chip">{{ c }}</span> }
                </li>
              }
            </ul>
            @if (v.items.length > 40) { <p class="more">and {{ v.items.length - 40 }} more\u2026</p> }
          </div>
        }
        @if (v.link) {
          <div class="foot"><a class="btn btn-secondary btn-sm" [routerLink]="v.link.path" [queryParams]="v.link.query ?? null">{{ v.link.label }}<vc-icon name="arrow-right" [size]="14" /></a></div>
        }
      </div>
    }
  `, styles: ["/* angular:styles/component:scss;9256b2b8db7ba159;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\calculations\\blocker.ts */\n.box {\n  border: 1px solid;\n  border-radius: var(--radius);\n  overflow: hidden;\n}\n.box.danger {\n  border-color: #f3c7c3;\n  background: var(--surface);\n}\n.box.warn {\n  border-color: #f1dcae;\n  background: var(--surface);\n}\n.top {\n  display: flex;\n  gap: 12px;\n  padding: 14px 16px;\n  align-items: flex-start;\n}\n.danger .top {\n  background: var(--danger-soft);\n}\n.warn .top {\n  background: var(--warn-soft);\n}\n.ic {\n  flex: none;\n  color: var(--red-600);\n  margin-top: 1px;\n}\n.warn .ic {\n  color: var(--amber-600);\n}\n.t {\n  flex: 1;\n  min-width: 0;\n}\n.t strong {\n  display: block;\n  font-weight: 600;\n}\n.t p {\n  color: var(--stone-700);\n  font-size: 13.5px;\n  margin-top: 2px;\n}\n.code {\n  font-size: 11px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.7);\n  color: var(--stone-600);\n  white-space: nowrap;\n}\n.list {\n  padding: 10px 16px 12px;\n}\n.lh {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--text-3);\n  margin-bottom: 4px;\n}\n.n {\n  display: inline-grid;\n  place-items: center;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: var(--sand-200);\n  color: var(--stone-700);\n  font-size: 11px;\n  margin-left: 4px;\n}\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  max-height: 280px;\n  overflow: auto;\n}\nli {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 7px 0;\n  border-bottom: 1px solid var(--stone-100);\n  color: var(--text-3);\n}\nli:last-child {\n  border-bottom: 0;\n}\n.it {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.it-t {\n  color: var(--text);\n  font-size: 13.5px;\n  font-weight: 500;\n}\n.it-s {\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.chip {\n  font-size: 11.5px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--sand-100);\n  border: 1px solid var(--border);\n  color: var(--stone-700);\n  white-space: nowrap;\n}\n.more {\n  font-size: 12.5px;\n  color: var(--text-3);\n  margin-top: 6px;\n}\n.foot {\n  padding: 0 16px 14px;\n}\n/*# sourceMappingURL=blocker.css.map */\n"] }]
  }], null, { error: [{ type: Input, args: [{ isSignal: true, alias: "error", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CalcBlocker, { className: "CalcBlocker", filePath: "src/app/features/calculations/blocker.ts", lineNumber: 74 });
})();
function humanize(s) {
  const t = s.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export {
  CalcBlocker
};
//# debugId=e585d0c4-523d-5a6f-8055-ffed0f1183ab
//# sourceMappingURL=chunk-MSGBQL24.js.map
