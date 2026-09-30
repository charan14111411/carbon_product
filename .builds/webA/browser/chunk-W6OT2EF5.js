import {
  fmtNum
} from "./chunk-E5UDMWWN.js";
import {
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  __spreadValues,
  computed,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-O2E4BMDK.js";

// src/app/features/credits/credit-ui.ts
var _forTrack0 = ($index, $item) => $item.key;
function Steps_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 3);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 11)("stroke", 2.5);
  }
}
function Steps_For_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 6);
  }
  if (rf & 2) {
    const s_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("done", s_r1.state === "done");
  }
}
function Steps_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "span", 2);
    \u0275\u0275conditionalCreate(2, Steps_For_1_Conditional_2_Template, 1, 2, "vc-icon", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 4);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, Steps_For_1_Conditional_5_Template, 1, 2, "span", 5);
  }
  if (rf & 2) {
    const s_r1 = ctx.$implicit;
    const \u0275$index_1_r2 = ctx.$index;
    const \u0275$count_1_r3 = ctx.$count;
    \u0275\u0275classProp("done", s_r1.state === "done")("cur", s_r1.state === "cur");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(s_r1.state === "done" ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r1.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(!(\u0275$index_1_r2 === \u0275$count_1_r3 - 1) ? 5 : -1);
  }
}
function Steps_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 0);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.stopped());
  }
}
function BalanceBar_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("name", ctx_r0.icon())("size", 14);
  }
}
function BalanceBar_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 9);
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("flex-grow", s_r2.v)("background", s_r2.color);
    \u0275\u0275property("title", s_r2.label + ": " + ctx_r0.fmt(s_r2.v) + " tCO\u2082e");
  }
}
function BalanceBar_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 7);
  }
}
function BalanceBar_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275element(1, "span", 12);
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "b", 13);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("zero", !s_r3.v);
    \u0275\u0275property("title", s_r3.hint);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", s_r3.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", s_r3.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.fmt(s_r3.v));
  }
}
function BalanceBar_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275repeaterCreate(1, BalanceBar_Conditional_13_For_2_Template, 5, 7, "span", 10, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.legend());
  }
}
var CREDIT_TYPES = ["reduction", "removal"];
var STATES = ["available", "reserved", "sold", "retired", "buffer"];
var TYPE_LABEL = { reduction: "Reductions", removal: "Removals" };
var TYPE_HINT = {
  reduction: "Emissions avoided compared with the baseline (e.g. less fertiliser, less burning).",
  removal: "Carbon drawn down from the air and stored in the soil."
};
var TYPE_COLOR = { reduction: "#1f5f99", removal: "#c76329" };
var TYPE_ICON = { reduction: "trend-down", removal: "leaf" };
var STATE_META = {
  available: { label: "Available", color: "var(--forest-500)", hint: "Free to reserve for a buyer" },
  reserved: { label: "Reserved", color: "var(--sky-600)", hint: "Held for a sale that is not delivered yet" },
  sold: { label: "Sold", color: "var(--clay-500)", hint: "Delivered to a buyer" },
  retired: { label: "Retired", color: "var(--stone-600)", hint: "Used by the buyer; can never be sold again" },
  buffer: { label: "Buffer", color: "var(--amber-600)", hint: "Set aside against reversals (fire, land-use change)" },
  cancelled: { label: "Cancelled", color: "var(--stone-300)", hint: "Withdrawn from the inventory" },
  none: { label: "Created", color: "var(--stone-300)", hint: "Entered the inventory" }
};
function money(v, currency = "INR") {
  if (v === null || v === void 0 || v === "")
    return "\u2014";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(v));
  } catch {
    return `${fmtNum(Number(v), 2)} ${currency}`;
  }
}
var Steps = class _Steps {
  steps = input.required(
    ...ngDevMode ? [{ debugName: "steps" }] : (
      /* istanbul ignore next */
      []
    )
  );
  current = input(
    "",
    ...ngDevMode ? [{ debugName: "current" }] : (
      /* istanbul ignore next */
      []
    )
  );
  labels = input(
    {},
    ...ngDevMode ? [{ debugName: "labels" }] : (
      /* istanbul ignore next */
      []
    )
  );
  compact = input(
    false,
    ...ngDevMode ? [{ debugName: "compact" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Terminal off-path states (e.g. cancelled) shown as a chip instead of a step. */
  offPath = input(
    ["cancelled"],
    ...ngDevMode ? [{ debugName: "offPath" }] : (
      /* istanbul ignore next */
      []
    )
  );
  stopped = computed(
    () => this.offPath().includes(this.current()) ? cap(this.current()) : "",
    ...ngDevMode ? [{ debugName: "stopped" }] : (
      /* istanbul ignore next */
      []
    )
  );
  view = computed(
    () => {
      const idx = this.steps().indexOf(this.current());
      return this.steps().map((k, i) => ({
        key: k,
        label: this.labels()[k] ?? cap(k),
        state: idx < 0 ? "todo" : i < idx ? "done" : i === idx ? i === this.steps().length - 1 ? "done" : "cur" : "todo"
      }));
    },
    ...ngDevMode ? [{ debugName: "view" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Steps_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Steps)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Steps, selectors: [["vcx-steps"]], hostVars: 4, hostBindings: function Steps_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("compact", ctx.compact())("halted", !!ctx.stopped());
    }
  }, inputs: { steps: [1, "steps"], current: [1, "current"], labels: [1, "labels"], compact: [1, "compact"], offPath: [1, "offPath"] }, decls: 3, vars: 1, consts: [[1, "stop"], [1, "st"], [1, "pt"], ["name", "check", 3, "size", "stroke"], [1, "lb"], [1, "ln", 3, "done"], [1, "ln"]], template: function Steps_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275repeaterCreate(0, Steps_For_1_Template, 6, 7, null, null, _forTrack0);
      \u0275\u0275conditionalCreate(2, Steps_Conditional_2_Template, 2, 1, "span", 0);
    }
    if (rf & 2) {
      \u0275\u0275repeater(ctx.view());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.stopped() ? 2 : -1);
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n}\n.st[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--%NS%text-3);\n  font-size: 12.5px;\n  white-space: nowrap;\n}\n.pt[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: 1.5px solid var(--%NS%stone-300);\n  background: var(--%NS%surface);\n  color: #fff;\n  flex: none;\n}\n.st.done[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n}\n.st.done[_ngcontent-%COMP%]   .pt[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n  border-color: var(--%NS%forest-500);\n}\n.st.cur[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n  font-weight: 600;\n}\n.st.cur[_ngcontent-%COMP%]   .pt[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  box-shadow: inset 0 0 0 3px var(--%NS%surface);\n  background: var(--%NS%forest-500);\n}\n.ln[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 10px;\n  max-width: 40px;\n  height: 1.5px;\n  background: var(--%NS%stone-200);\n}\n.ln.done[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-400);\n}\n.compact[_nghost-%COMP%]   .lb[_ngcontent-%COMP%] {\n  display: none;\n}\n.compact[_nghost-%COMP%]   .st.cur[_ngcontent-%COMP%]   .lb[_ngcontent-%COMP%] {\n  display: inline;\n}\n.halted[_nghost-%COMP%]   .st[_ngcontent-%COMP%], \n.halted[_nghost-%COMP%]   .ln[_ngcontent-%COMP%] {\n  opacity: 0.45;\n}\n.stop[_ngcontent-%COMP%] {\n  margin-left: 6px;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--%NS%stone-600);\n  background: var(--%NS%stone-100);\n  border: 1px solid var(--%NS%stone-200);\n  padding: 1px 8px;\n  border-radius: 999px;\n}\n/*# sourceMappingURL=credit-ui.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Steps, [{
    type: Component,
    args: [{ selector: "vcx-steps", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @for (s of view(); track s.key; let last = $last) {
      <div class="st" [class.done]="s.state === 'done'" [class.cur]="s.state === 'cur'">
        <span class="pt">@if (s.state === 'done') { <vc-icon name="check" [size]="11" [stroke]="2.5" /> }</span>
        <span class="lb">{{ s.label }}</span>
      </div>
      @if (!last) { <span class="ln" [class.done]="s.state === 'done'"></span> }
    }
    @if (stopped()) { <span class="stop">{{ stopped() }}</span> }
  `, host: { "[class.compact]": "compact()", "[class.halted]": "!!stopped()" }, styles: ["/* angular:styles/component:scss;b32922a659495d36;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\credits\\credit-ui.ts */\n:host {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n}\n.st {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--text-3);\n  font-size: 12.5px;\n  white-space: nowrap;\n}\n.pt {\n  display: grid;\n  place-items: center;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: 1.5px solid var(--stone-300);\n  background: var(--surface);\n  color: #fff;\n  flex: none;\n}\n.st.done {\n  color: var(--stone-700);\n}\n.st.done .pt {\n  background: var(--forest-500);\n  border-color: var(--forest-500);\n}\n.st.cur {\n  color: var(--forest-700);\n  font-weight: 600;\n}\n.st.cur .pt {\n  border-color: var(--forest-500);\n  box-shadow: inset 0 0 0 3px var(--surface);\n  background: var(--forest-500);\n}\n.ln {\n  flex: 1;\n  min-width: 10px;\n  max-width: 40px;\n  height: 1.5px;\n  background: var(--stone-200);\n}\n.ln.done {\n  background: var(--forest-400);\n}\n:host(.compact) .lb {\n  display: none;\n}\n:host(.compact) .st.cur .lb {\n  display: inline;\n}\n:host(.halted) .st,\n:host(.halted) .ln {\n  opacity: 0.45;\n}\n.stop {\n  margin-left: 6px;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--stone-600);\n  background: var(--stone-100);\n  border: 1px solid var(--stone-200);\n  padding: 1px 8px;\n  border-radius: 999px;\n}\n/*# sourceMappingURL=credit-ui.css.map */\n"] }]
  }], null, { steps: [{ type: Input, args: [{ isSignal: true, alias: "steps", required: true }] }], current: [{ type: Input, args: [{ isSignal: true, alias: "current", required: false }] }], labels: [{ type: Input, args: [{ isSignal: true, alias: "labels", required: false }] }], compact: [{ type: Input, args: [{ isSignal: true, alias: "compact", required: false }] }], offPath: [{ type: Input, args: [{ isSignal: true, alias: "offPath", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Steps, { className: "Steps", filePath: "src/app/features/credits/credit-ui.ts", lineNumber: 102 });
})();
function cap(s) {
  const t = s.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
var BalanceBar = class _BalanceBar {
  balances = input.required(
    ...ngDevMode ? [{ debugName: "balances" }] : (
      /* istanbul ignore next */
      []
    )
  );
  label = input(
    "",
    ...ngDevMode ? [{ debugName: "label" }] : (
      /* istanbul ignore next */
      []
    )
  );
  icon = input(
    "",
    ...ngDevMode ? [{ debugName: "icon" }] : (
      /* istanbul ignore next */
      []
    )
  );
  showLegend = input(
    true,
    ...ngDevMode ? [{ debugName: "showLegend" }] : (
      /* istanbul ignore next */
      []
    )
  );
  segs = computed(
    () => this.legend().filter((s) => s.v > 1e-9),
    ...ngDevMode ? [{ debugName: "segs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  legend = computed(
    () => STATES.map((k) => __spreadValues({ key: k, v: Math.max(0, this.balances()?.[k] ?? 0) }, STATE_META[k])),
    ...ngDevMode ? [{ debugName: "legend" }] : (
      /* istanbul ignore next */
      []
    )
  );
  total = computed(
    () => this.legend().reduce((a, s) => a + s.v, 0),
    ...ngDevMode ? [{ debugName: "total" }] : (
      /* istanbul ignore next */
      []
    )
  );
  aria = computed(
    () => this.legend().map((s) => `${s.label} ${this.fmt(s.v)} t`).join(", "),
    ...ngDevMode ? [{ debugName: "aria" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fmt(v) {
    return fmtNum(v, v >= 100 ? 0 : 2);
  }
  static \u0275fac = function BalanceBar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BalanceBar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BalanceBar, selectors: [["vcx-balance-bar"]], inputs: { balances: [1, "balances"], label: [1, "label"], icon: [1, "icon"], showLegend: [1, "showLegend"] }, decls: 14, vars: 6, consts: [[1, "head"], [1, "ti", 3, "name", "size"], [1, "spacer"], [1, "num", "tot"], [1, "u"], ["role", "img", 1, "bar"], [1, "seg", 3, "flex-grow", "background", "title"], [1, "seg", "empty"], [1, "legend"], [1, "seg", 3, "title"], [1, "li", 3, "zero", "title"], [1, "li", 3, "title"], [1, "dot"], [1, "num"]], template: function BalanceBar_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, BalanceBar_Conditional_1_Template, 1, 2, "vc-icon", 1);
      \u0275\u0275elementStart(2, "strong");
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275element(4, "span", 2);
      \u0275\u0275elementStart(5, "span", 3);
      \u0275\u0275text(6);
      \u0275\u0275elementStart(7, "span", 4);
      \u0275\u0275text(8, "tCO\u2082e");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(9, "div", 5);
      \u0275\u0275repeaterCreate(10, BalanceBar_For_11_Template, 1, 5, "span", 6, _forTrack0);
      \u0275\u0275conditionalCreate(12, BalanceBar_Conditional_12_Template, 1, 0, "span", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(13, BalanceBar_Conditional_13_Template, 3, 0, "div", 8);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.icon() ? 1 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.label());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("", ctx.fmt(ctx.total()), " ");
      \u0275\u0275advance(3);
      \u0275\u0275attribute("aria-label", ctx.aria());
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.segs());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.total() ? 12 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showLegend() ? 13 : -1);
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  margin-bottom: 8px;\n}\n.ti[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-500);\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.tot[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--%NS%stone-800);\n}\n.u[_ngcontent-%COMP%] {\n  font-weight: 400;\n  color: var(--%NS%text-3);\n  font-size: 12px;\n}\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2px;\n  height: 10px;\n  border-radius: 5px;\n  overflow: hidden;\n  background: var(--%NS%sand-200);\n}\n.seg[_ngcontent-%COMP%] {\n  flex-basis: 0;\n  min-width: 3px;\n}\n.seg.empty[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  background: var(--%NS%sand-200);\n}\n.legend[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 14px;\n  margin-top: 10px;\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.li[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.li[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--%NS%stone-800);\n}\n.li.zero[_ngcontent-%COMP%] {\n  opacity: 0.55;\n}\n.dot[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n/*# sourceMappingURL=credit-ui.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BalanceBar, [{
    type: Component,
    args: [{ selector: "vcx-balance-bar", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="head">
      @if (icon()) { <vc-icon class="ti" [name]="icon()" [size]="14" /> }
      <strong>{{ label() }}</strong>
      <span class="spacer"></span>
      <span class="num tot">{{ fmt(total()) }} <span class="u">tCO\u2082e</span></span>
    </div>
    <div class="bar" role="img" [attr.aria-label]="aria()">
      @for (s of segs(); track s.key) {
        <span class="seg" [style.flex-grow]="s.v" [style.background]="s.color" [title]="s.label + ': ' + fmt(s.v) + ' tCO\u2082e'"></span>
      }
      @if (!total()) { <span class="seg empty"></span> }
    </div>
    @if (showLegend()) {
      <div class="legend">
        @for (s of legend(); track s.key) {
          <span class="li" [class.zero]="!s.v" [title]="s.hint"><span class="dot" [style.background]="s.color"></span>{{ s.label }} <b class="num">{{ fmt(s.v) }}</b></span>
        }
      </div>
    }
  `, styles: ["/* angular:styles/component:scss;f7e865c4f2cf82c9;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\credits\\credit-ui.ts */\n:host {\n  display: block;\n}\n.head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  margin-bottom: 8px;\n}\n.ti {\n  color: var(--stone-500);\n}\n.spacer {\n  flex: 1;\n}\n.tot {\n  font-weight: 600;\n  color: var(--stone-800);\n}\n.u {\n  font-weight: 400;\n  color: var(--text-3);\n  font-size: 12px;\n}\n.bar {\n  display: flex;\n  gap: 2px;\n  height: 10px;\n  border-radius: 5px;\n  overflow: hidden;\n  background: var(--sand-200);\n}\n.seg {\n  flex-basis: 0;\n  min-width: 3px;\n}\n.seg.empty {\n  flex-grow: 1;\n  background: var(--sand-200);\n}\n.legend {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 14px;\n  margin-top: 10px;\n  font-size: 12px;\n  color: var(--text-2);\n}\n.li {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.li b {\n  font-weight: 600;\n  color: var(--stone-800);\n}\n.li.zero {\n  opacity: 0.55;\n}\n.dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n/*# sourceMappingURL=credit-ui.css.map */\n"] }]
  }], null, { balances: [{ type: Input, args: [{ isSignal: true, alias: "balances", required: true }] }], label: [{ type: Input, args: [{ isSignal: true, alias: "label", required: false }] }], icon: [{ type: Input, args: [{ isSignal: true, alias: "icon", required: false }] }], showLegend: [{ type: Input, args: [{ isSignal: true, alias: "showLegend", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BalanceBar, { className: "BalanceBar", filePath: "src/app/features/credits/credit-ui.ts", lineNumber: 163 });
})();
function apiFieldErrors(e) {
  const out = {};
  for (const f of e?.details?.["fields"] ?? []) {
    const k = (f.field ?? "").split(".").pop() ?? "";
    const msg = String(f.message ?? "Check this value.").replace(/^Value error, /, "");
    out[k] = out[k] ? `${out[k]} ${msg}` : msg;
  }
  return out;
}
function apiMessage(e) {
  const fe = apiFieldErrors(e);
  return fe[""] || Object.values(fe)[0] || e?.message || "Something went wrong.";
}

export {
  CREDIT_TYPES,
  TYPE_LABEL,
  TYPE_HINT,
  TYPE_COLOR,
  TYPE_ICON,
  STATE_META,
  money,
  Steps,
  BalanceBar,
  apiFieldErrors,
  apiMessage
};
//# debugId=59eebead-1d9f-5fe9-9023-021e3c9dc0b7
//# sourceMappingURL=chunk-W6OT2EF5.js.map
