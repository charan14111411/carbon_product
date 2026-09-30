import {
  tierMeta
} from "./chunk-ZC6I5JPU.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵnextContext,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-O2E4BMDK.js";

// src/app/features/supporting/tier-chip.ts
function TierChip_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 1);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.meta().label);
  }
}
var TierChip = class _TierChip {
  tier = input(
    0,
    ...ngDevMode ? [{ debugName: "tier" }] : (
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
  meta = computed(
    () => tierMeta(this.tier()),
    ...ngDevMode ? [{ debugName: "meta" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function TierChip_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TierChip)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TierChip, selectors: [["vc-tier"]], hostVars: 7, hostBindings: function TierChip_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("title", ctx.meta().short + " \xB7 " + ctx.meta().label + " \u2014 " + ctx.meta().explain);
      \u0275\u0275styleProp("--%NS%c", ctx.meta().color)("--%NS%s", ctx.meta().soft)("--%NS%t", ctx.meta().text);
    }
  }, inputs: { tier: [1, "tier"], compact: [1, "compact"] }, decls: 3, vars: 2, consts: [[1, "n"], [1, "l"]], template: function TierChip_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "span", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(2, TierChip_Conditional_2_Template, 2, 1, "span", 1);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.meta().tier || "\u2013");
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.compact() ? 2 : -1);
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 22px;\n  padding: 0 8px 0 3px;\n  border-radius: 999px;\n  background: var(--%NS%s);\n  color: var(--%NS%t);\n  font-size: 12px;\n  font-weight: 500;\n  white-space: nowrap;\n  line-height: 1;\n}\n.n[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: var(--%NS%c);\n  color: #fff;\n  font: 600 10px/1 var(--%NS%mono);\n}\n[_nghost-%COMP%]:not(:has(.l)) {\n  padding: 0 3px;\n}\n/*# sourceMappingURL=tier-chip.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TierChip, [{
    type: Component,
    args: [{ selector: "vc-tier", changeDetection: ChangeDetectionStrategy.OnPush, template: `<span class="n">{{ meta().tier || '\u2013' }}</span>@if (!compact()) {<span class="l">{{ meta().label }}</span>}`, host: {
      "[style.--c]": "meta().color",
      "[style.--s]": "meta().soft",
      "[style.--t]": "meta().text",
      "[attr.title]": 'meta().short + " \xB7 " + meta().label + " \u2014 " + meta().explain'
    }, styles: ["/* angular:styles/component:scss;95e5e7dcf39e953e;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\supporting\\tier-chip.ts */\n:host {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 22px;\n  padding: 0 8px 0 3px;\n  border-radius: 999px;\n  background: var(--s);\n  color: var(--t);\n  font-size: 12px;\n  font-weight: 500;\n  white-space: nowrap;\n  line-height: 1;\n}\n.n {\n  display: grid;\n  place-items: center;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: var(--c);\n  color: #fff;\n  font: 600 10px/1 var(--mono);\n}\n:host(:not(:has(.l))) {\n  padding: 0 3px;\n}\n/*# sourceMappingURL=tier-chip.css.map */\n"] }]
  }], null, { tier: [{ type: Input, args: [{ isSignal: true, alias: "tier", required: false }] }], compact: [{ type: Input, args: [{ isSignal: true, alias: "compact", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TierChip, { className: "TierChip", filePath: "src/app/features/supporting/tier-chip.ts", lineNumber: 20 });
})();
var QualityBar = class _QualityBar {
  value = input(
    null,
    ...ngDevMode ? [{ debugName: "value" }] : (
      /* istanbul ignore next */
      []
    )
  );
  w = computed(
    () => Math.max(0, Math.min(1, this.value() ?? 0)) * 100,
    ...ngDevMode ? [{ debugName: "w" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tone = computed(
    () => (this.value() ?? 0) >= 0.8 ? "hi" : (this.value() ?? 0) >= 0.55 ? "mid" : "low",
    ...ngDevMode ? [{ debugName: "tone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function QualityBar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _QualityBar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _QualityBar, selectors: [["vc-quality"]], hostVars: 1, hostBindings: function QualityBar_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("title", "Quality score " + (ctx.value() ?? "\u2014") + " (0 = unusable, 1 = best)");
    }
  }, inputs: { value: [1, "value"] }, decls: 4, vars: 5, consts: [[1, "track"], [1, "fill"], [1, "v", "num"]], template: function QualityBar_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "span", 0);
      \u0275\u0275domElement(1, "span", 1);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(2, "span", 2);
      \u0275\u0275text(3);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275classMap(ctx.tone());
      \u0275\u0275styleProp("width", ctx.w(), "%");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.value() === null || ctx.value() === void 0 ? "\u2014" : ctx.value().toFixed(2));
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 96px;\n}\n.track[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--%NS%sand-200);\n  overflow: hidden;\n  min-width: 48px;\n}\n.fill[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: 3px;\n  background: var(--%NS%forest-500);\n}\n.fill.mid[_ngcontent-%COMP%] {\n  background: var(--%NS%teal-600);\n}\n.fill.low[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-600);\n}\n.v[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%stone-700);\n  min-width: 30px;\n  text-align: right;\n}\n/*# sourceMappingURL=tier-chip.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QualityBar, [{
    type: Component,
    args: [{ selector: "vc-quality", changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <span class="track"><span class="fill" [class]="tone()" [style.width.%]="w()"></span></span>
    <span class="v num">{{ value() === null || value() === undefined ? '\u2014' : value()!.toFixed(2) }}</span>
  `, host: { "[attr.title]": '"Quality score " + (value() ?? "\u2014") + " (0 = unusable, 1 = best)"' }, styles: ["/* angular:styles/component:scss;a4f507e1d79faef1;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\supporting\\tier-chip.ts */\n:host {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 96px;\n}\n.track {\n  flex: 1;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--sand-200);\n  overflow: hidden;\n  min-width: 48px;\n}\n.fill {\n  display: block;\n  height: 100%;\n  border-radius: 3px;\n  background: var(--forest-500);\n}\n.fill.mid {\n  background: var(--teal-600);\n}\n.fill.low {\n  background: var(--amber-600);\n}\n.v {\n  font-size: 12px;\n  color: var(--stone-700);\n  min-width: 30px;\n  text-align: right;\n}\n/*# sourceMappingURL=tier-chip.css.map */\n"] }]
  }], null, { value: [{ type: Input, args: [{ isSignal: true, alias: "value", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(QualityBar, { className: "QualityBar", filePath: "src/app/features/supporting/tier-chip.ts", lineNumber: 43 });
})();

export {
  TierChip,
  QualityBar
};
//# debugId=cabe9c26-0393-5261-983f-c639c90f624d
//# sourceMappingURL=chunk-SFBT26DL.js.map
