import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Icon,
  Input,
  NgTemplateOutlet,
  Output,
  computed,
  input,
  model,
  output,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-O2E4BMDK.js";

// src/app/ui/kit.ts
var _c0 = ["*"];
function Badge_ProjectionFallback_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate(ctx_r0.label());
  }
}
var _c1 = [[["", "actions", ""]], "*"];
var _c2 = ["[actions]", "*"];
function PageHeader_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 0);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.eyebrow());
  }
}
function PageHeader_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 3);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.subtitle());
  }
}
function Stat_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 2);
    \u0275\u0275element(1, "vc-icon", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.icon())("size", 16);
  }
}
function Stat_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.hint());
  }
}
function Empty_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.text());
  }
}
function Loading_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElement(0, "div", 1);
  }
  if (rf & 2) {
    const r_r1 = ctx.$implicit;
    \u0275\u0275styleProp("width", r_r1, "%");
  }
}
var _c3 = ["*", [["", "footer", ""]]];
var _c4 = ["*", "[footer]"];
function Modal_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.subtitle());
  }
}
function Modal_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275listener("click", function Modal_Conditional_0_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "section", 1)(2, "header")(3, "div", 2)(4, "h2");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, Modal_Conditional_0_Conditional_6_Template, 2, 1, "p");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 3);
    \u0275\u0275listener("click", function Modal_Conditional_0_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275element(8, "vc-icon", 4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 5);
    \u0275\u0275projection(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "footer");
    \u0275\u0275projection(12, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r1.width());
    \u0275\u0275classProp("drawer", ctx_r1.drawer());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.title());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.subtitle() ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
  }
}
var _forTrack0 = ($index, $item) => $item.key;
function Tabs_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 2);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const t_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r2.count);
  }
}
function Tabs_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 1);
    \u0275\u0275domListener("click", function Tabs_For_1_Template_button_click_0_listener() {
      const t_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.active.set(t_r2.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, Tabs_For_1_Conditional_2_Template, 2, 1, "span", 2);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const t_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", t_r2.key === ctx_r2.active());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r2.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(t_r2.count !== void 0 && t_r2.count !== null ? 2 : -1);
  }
}
function Timeline_For_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const i_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(i_r1.at);
  }
}
function Timeline_For_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const i_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(i_r1.by);
  }
}
function Timeline_For_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const i_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(i_r1.note);
  }
}
function Timeline_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 2);
    \u0275\u0275domElement(1, "span", 3);
    \u0275\u0275domElementStart(2, "div", 4)(3, "div", 5)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(6, Timeline_For_1_Conditional_6_Template, 2, 1, "span", 6);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(7, Timeline_For_1_Conditional_7_Template, 2, 1, "div", 7);
    \u0275\u0275conditionalCreate(8, Timeline_For_1_Conditional_8_Template, 2, 1, "div", 8);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const i_r1 = ctx.$implicit;
    \u0275\u0275classMap("t-" + (i_r1.tone ?? "ok"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(i_r1.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(i_r1.at ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(i_r1.by ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(i_r1.note ? 8 : -1);
  }
}
function Timeline_ForEmpty_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 1);
    \u0275\u0275text(1, "No events yet.");
    \u0275\u0275domElementEnd();
  }
}
var TONES = {
  // positive
  active: "ok",
  approved: "ok",
  accepted: "ok",
  enrolled: "ok",
  eligible: "ok",
  verified: "ok",
  issued: "ok",
  complete: "ok",
  completed: "ok",
  paid: "ok",
  resolved: "ok",
  online: "ok",
  confirmed: "ok",
  published: "ok",
  delivered: "ok",
  retired: "neutral",
  collected: "ok",
  intact: "ok",
  ok: "ok",
  answered: "ok",
  // in progress
  draft: "neutral",
  planned: "neutral",
  pending: "warn",
  under_review: "info",
  calculated: "info",
  in_review: "info",
  fieldwork: "info",
  lab: "info",
  monitoring: "info",
  design: "neutral",
  reserved: "info",
  contracted: "info",
  in_progress: "info",
  assessing: "warn",
  submitted: "info",
  open: "warn",
  candidate: "info",
  provisional: "neutral",
  acknowledged: "info",
  inconclusive: "neutral",
  on_hold: "warn",
  warning: "warn",
  action: "warn",
  appealed: "warn",
  // negative
  rejected: "danger",
  ineligible: "danger",
  failed: "danger",
  voided: "neutral",
  withdrawn: "neutral",
  cancelled: "neutral",
  superseded: "neutral",
  offline: "danger",
  mismatch: "danger",
  blocking: "danger",
  error: "danger",
  partially_failed: "danger",
  findings: "danger",
  suspended: "warn",
  closed: "neutral",
  skipped: "neutral",
  exited: "neutral",
  inactive: "neutral",
  info: "info"
};
var Badge = class _Badge {
  status = input(
    "",
    ...ngDevMode ? [{ debugName: "status" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tone = computed(
    () => TONES[this.status()] ?? "neutral",
    ...ngDevMode ? [{ debugName: "tone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  label = computed(
    () => humanize(this.status()),
    ...ngDevMode ? [{ debugName: "label" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Badge_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Badge)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Badge, selectors: [["vc-badge"]], hostVars: 2, hostBindings: function Badge_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classMap("badge tone-" + ctx.tone());
    }
  }, inputs: { status: [1, "status"] }, ngContentSelectors: _c0, decls: 3, vars: 0, consts: [[1, "dot"]], template: function Badge_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElement(0, "span", 0);
      \u0275\u0275projection(1, 0, null, Badge_ProjectionFallback_1_Template, 1, 1);
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 22px;\n  padding: 0 9px;\n  border-radius: 999px;\n  font-size: 12px;\n  font-weight: 500;\n  white-space: nowrap;\n  line-height: 1;\n  border: 1px solid transparent;\n}\n.dot[_ngcontent-%COMP%] {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: currentColor;\n  opacity: 0.85;\n}\n.tone-ok[_nghost-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n  border-color: #cfe2d4;\n}\n.tone-warn[_nghost-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n  border-color: #f1dcae;\n}\n.tone-danger[_nghost-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  border-color: #f3c7c3;\n}\n.tone-info[_nghost-%COMP%] {\n  background: var(--%NS%info-soft);\n  color: var(--%NS%sky-600);\n  border-color: #c9dcf0;\n}\n.tone-neutral[_nghost-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n  border-color: var(--%NS%stone-200);\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Badge, [{
    type: Component,
    args: [{ selector: "vc-badge", changeDetection: ChangeDetectionStrategy.OnPush, template: `<span class="dot"></span><ng-content>{{ label() }}</ng-content>`, host: { "[class]": '"badge tone-" + tone()' }, styles: ["/* angular:styles/component:scss;e320506830f2d9d2;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 22px;\n  padding: 0 9px;\n  border-radius: 999px;\n  font-size: 12px;\n  font-weight: 500;\n  white-space: nowrap;\n  line-height: 1;\n  border: 1px solid transparent;\n}\n.dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: currentColor;\n  opacity: 0.85;\n}\n:host(.tone-ok) {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n  border-color: #cfe2d4;\n}\n:host(.tone-warn) {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n  border-color: #f1dcae;\n}\n:host(.tone-danger) {\n  background: var(--danger-soft);\n  color: var(--red-600);\n  border-color: #f3c7c3;\n}\n:host(.tone-info) {\n  background: var(--info-soft);\n  color: var(--sky-600);\n  border-color: #c9dcf0;\n}\n:host(.tone-neutral) {\n  background: var(--stone-100);\n  color: var(--stone-600);\n  border-color: var(--stone-200);\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { status: [{ type: Input, args: [{ isSignal: true, alias: "status", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Badge, { className: "Badge", filePath: "src/app/ui/kit.ts", lineNumber: 39 });
})();
function humanize(v) {
  if (!v)
    return "\u2014";
  const s = String(v).replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
var DC = {
  MEASURED: "measured",
  OBSERVED: "observed",
  RECORDED: "recorded",
  DERIVED: "derived",
  CALCULATED: "calculated",
  MODELLED: "modelled"
};
var DataClass = class _DataClass {
  cls = input(
    "MEASURED",
    ...ngDevMode ? [{ debugName: "cls" }] : (
      /* istanbul ignore next */
      []
    )
  );
  key = computed(
    () => DC[this.cls()?.toUpperCase()] ?? "recorded",
    ...ngDevMode ? [{ debugName: "key" }] : (
      /* istanbul ignore next */
      []
    )
  );
  title = computed(
    () => ({
      measured: "Measured by a lab or instrument",
      observed: "Observed by satellite or sensor",
      recorded: "Recorded by a person or system",
      derived: "Worked out from other data",
      calculated: "Produced by the calculation engine",
      modelled: "A model estimate \u2014 never a measurement"
    })[this.key()],
    ...ngDevMode ? [{ debugName: "title" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function DataClass_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DataClass)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DataClass, selectors: [["vc-dc"]], hostVars: 3, hostBindings: function DataClass_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("title", ctx.title());
      \u0275\u0275classMap("dc dc-" + ctx.key());
    }
  }, inputs: { cls: [1, "cls"] }, decls: 1, vars: 1, template: function DataClass_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275text(0);
    }
    if (rf & 2) {
      \u0275\u0275textInterpolate(ctx.cls());
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  height: 18px;\n  padding: 0 6px;\n  border-radius: 4px;\n  font: 600 10px/1 var(--%NS%mono);\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.dc-measured[_nghost-%COMP%] {\n  color: var(--%NS%dc-measured);\n  background: var(--%NS%dc-measured-bg);\n}\n.dc-observed[_nghost-%COMP%] {\n  color: var(--%NS%dc-observed);\n  background: var(--%NS%dc-observed-bg);\n}\n.dc-recorded[_nghost-%COMP%] {\n  color: var(--%NS%dc-recorded);\n  background: var(--%NS%dc-recorded-bg);\n}\n.dc-derived[_nghost-%COMP%] {\n  color: var(--%NS%dc-derived);\n  background: var(--%NS%dc-derived-bg);\n}\n.dc-calculated[_nghost-%COMP%] {\n  color: var(--%NS%dc-calculated);\n  background: var(--%NS%dc-calculated-bg);\n}\n.dc-modelled[_nghost-%COMP%] {\n  color: var(--%NS%dc-modelled);\n  background: var(--%NS%dc-modelled-bg);\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataClass, [{
    type: Component,
    args: [{ selector: "vc-dc", changeDetection: ChangeDetectionStrategy.OnPush, template: `{{ cls() }}`, host: { "[class]": '"dc dc-" + key()', "[attr.title]": "title()" }, styles: ["/* angular:styles/component:scss;2930ef5bbb5fb598;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: inline-flex;\n  align-items: center;\n  height: 18px;\n  padding: 0 6px;\n  border-radius: 4px;\n  font: 600 10px/1 var(--mono);\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n:host(.dc-measured) {\n  color: var(--dc-measured);\n  background: var(--dc-measured-bg);\n}\n:host(.dc-observed) {\n  color: var(--dc-observed);\n  background: var(--dc-observed-bg);\n}\n:host(.dc-recorded) {\n  color: var(--dc-recorded);\n  background: var(--dc-recorded-bg);\n}\n:host(.dc-derived) {\n  color: var(--dc-derived);\n  background: var(--dc-derived-bg);\n}\n:host(.dc-calculated) {\n  color: var(--dc-calculated);\n  background: var(--dc-calculated-bg);\n}\n:host(.dc-modelled) {\n  color: var(--dc-modelled);\n  background: var(--dc-modelled-bg);\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { cls: [{ type: Input, args: [{ isSignal: true, alias: "cls", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DataClass, { className: "DataClass", filePath: "src/app/ui/kit.ts", lineNumber: 73 });
})();
var PageHeader = class _PageHeader {
  title = input.required(
    ...ngDevMode ? [{ debugName: "title" }] : (
      /* istanbul ignore next */
      []
    )
  );
  subtitle = input(
    "",
    ...ngDevMode ? [{ debugName: "subtitle" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eyebrow = input(
    "",
    ...ngDevMode ? [{ debugName: "eyebrow" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function PageHeader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PageHeader)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PageHeader, selectors: [["vc-page-header"]], inputs: { title: [1, "title"], subtitle: [1, "subtitle"], eyebrow: [1, "eyebrow"] }, ngContentSelectors: _c2, decls: 9, vars: 3, consts: [[1, "eyebrow"], [1, "row-top"], [1, "titles"], [1, "sub"], [1, "actions"]], template: function PageHeader_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c1);
      \u0275\u0275conditionalCreate(0, PageHeader_Conditional_0_Template, 2, 1, "div", 0);
      \u0275\u0275domElementStart(1, "div", 1)(2, "div", 2)(3, "h1");
      \u0275\u0275text(4);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(5, PageHeader_Conditional_5_Template, 2, 1, "p", 3);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(6, "div", 4);
      \u0275\u0275projection(7);
      \u0275\u0275domElementEnd()();
      \u0275\u0275projection(8, 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.eyebrow() ? 0 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.title());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.subtitle() ? 5 : -1);
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  margin-bottom: 24px;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--%NS%forest-500);\n  margin-bottom: 6px;\n}\n.row-top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.titles[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 240px;\n}\n.sub[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  color: var(--%NS%text-2);\n  max-width: 760px;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PageHeader, [{
    type: Component,
    args: [{ selector: "vc-page-header", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (eyebrow()) { <div class="eyebrow">{{ eyebrow() }}</div> }
    <div class="row-top">
      <div class="titles">
        <h1>{{ title() }}</h1>
        @if (subtitle()) { <p class="sub">{{ subtitle() }}</p> }
      </div>
      <div class="actions"><ng-content select="[actions]" /></div>
    </div>
    <ng-content />
  `, styles: ["/* angular:styles/component:scss;a12334490c26030d;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: block;\n  margin-bottom: 24px;\n}\n.eyebrow {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--forest-500);\n  margin-bottom: 6px;\n}\n.row-top {\n  display: flex;\n  align-items: flex-end;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.titles {\n  flex: 1;\n  min-width: 240px;\n}\n.sub {\n  margin-top: 6px;\n  color: var(--text-2);\n  max-width: 760px;\n}\n.actions {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: true }] }], subtitle: [{ type: Input, args: [{ isSignal: true, alias: "subtitle", required: false }] }], eyebrow: [{ type: Input, args: [{ isSignal: true, alias: "eyebrow", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PageHeader, { className: "PageHeader", filePath: "src/app/ui/kit.ts", lineNumber: 108 });
})();
var Stat = class _Stat {
  label = input.required(
    ...ngDevMode ? [{ debugName: "label" }] : (
      /* istanbul ignore next */
      []
    )
  );
  value = input(
    "\u2014",
    ...ngDevMode ? [{ debugName: "value" }] : (
      /* istanbul ignore next */
      []
    )
  );
  unit = input(
    "",
    ...ngDevMode ? [{ debugName: "unit" }] : (
      /* istanbul ignore next */
      []
    )
  );
  hint = input(
    "",
    ...ngDevMode ? [{ debugName: "hint" }] : (
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
  accent = input(
    false,
    ...ngDevMode ? [{ debugName: "accent" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Stat_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Stat)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Stat, selectors: [["vc-stat"]], hostAttrs: [1, "card"], hostVars: 2, hostBindings: function Stat_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("accent", ctx.accent());
    }
  }, inputs: { label: [1, "label"], value: [1, "value"], unit: [1, "unit"], hint: [1, "hint"], icon: [1, "icon"], accent: [1, "accent"] }, decls: 9, vars: 5, consts: [[1, "top"], [1, "label"], [1, "ic"], [1, "value", "num"], [1, "unit"], [1, "hint"], [3, "name", "size"]], template: function Stat_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "span", 1);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, Stat_Conditional_3_Template, 2, 2, "span", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 3);
      \u0275\u0275text(5);
      \u0275\u0275elementStart(6, "span", 4);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(8, Stat_Conditional_8_Template, 2, 1, "div", 5);
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.label());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.icon() ? 3 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.value());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.unit());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hint() ? 8 : -1);
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  padding: 16px 18px;\n}\n.top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.label[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  font-weight: 500;\n}\n.ic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-600);\n}\n.value[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 8px;\n  color: var(--%NS%stone-900);\n}\n.unit[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--%NS%text-3);\n  margin-left: 5px;\n  letter-spacing: 0;\n}\n.hint[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.accent[_nghost-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--%NS%forest-800),\n      var(--%NS%forest-600));\n  border-color: var(--%NS%forest-700);\n}\n.accent[_nghost-%COMP%]   .label[_ngcontent-%COMP%], \n.accent[_nghost-%COMP%]   .hint[_ngcontent-%COMP%], \n.accent[_nghost-%COMP%]   .unit[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.72);\n}\n.accent[_nghost-%COMP%]   .value[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.accent[_nghost-%COMP%]   .ic[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Stat, [{
    type: Component,
    args: [{ selector: "vc-stat", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="top">
      <span class="label">{{ label() }}</span>
      @if (icon()) { <span class="ic"><vc-icon [name]="icon()" [size]="16" /></span> }
    </div>
    <div class="value num">{{ value() }}<span class="unit">{{ unit() }}</span></div>
    @if (hint()) { <div class="hint">{{ hint() }}</div> }
  `, host: { class: "card", "[class.accent]": "accent()" }, styles: ["/* angular:styles/component:scss;5011098a3f9b8e6b;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: block;\n  padding: 16px 18px;\n}\n.top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.label {\n  font-size: 12.5px;\n  color: var(--text-2);\n  font-weight: 500;\n}\n.ic {\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  background: var(--forest-50);\n  color: var(--forest-600);\n}\n.value {\n  font-size: 26px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 8px;\n  color: var(--stone-900);\n}\n.unit {\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--text-3);\n  margin-left: 5px;\n  letter-spacing: 0;\n}\n.hint {\n  margin-top: 4px;\n  font-size: 12px;\n  color: var(--text-3);\n}\n:host(.accent) {\n  background:\n    linear-gradient(\n      135deg,\n      var(--forest-800),\n      var(--forest-600));\n  border-color: var(--forest-700);\n}\n:host(.accent) .label,\n:host(.accent) .hint,\n:host(.accent) .unit {\n  color: rgba(255, 255, 255, 0.72);\n}\n:host(.accent) .value {\n  color: #fff;\n}\n:host(.accent) .ic {\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { label: [{ type: Input, args: [{ isSignal: true, alias: "label", required: true }] }], value: [{ type: Input, args: [{ isSignal: true, alias: "value", required: false }] }], unit: [{ type: Input, args: [{ isSignal: true, alias: "unit", required: false }] }], hint: [{ type: Input, args: [{ isSignal: true, alias: "hint", required: false }] }], icon: [{ type: Input, args: [{ isSignal: true, alias: "icon", required: false }] }], accent: [{ type: Input, args: [{ isSignal: true, alias: "accent", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Stat, { className: "Stat", filePath: "src/app/ui/kit.ts", lineNumber: 142 });
})();
var Empty = class _Empty {
  icon = input(
    "inbox",
    ...ngDevMode ? [{ debugName: "icon" }] : (
      /* istanbul ignore next */
      []
    )
  );
  title = input(
    "Nothing here yet",
    ...ngDevMode ? [{ debugName: "title" }] : (
      /* istanbul ignore next */
      []
    )
  );
  text = input(
    "",
    ...ngDevMode ? [{ debugName: "text" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Empty_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Empty)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Empty, selectors: [["vc-empty"]], inputs: { icon: [1, "icon"], title: [1, "title"], text: [1, "text"] }, ngContentSelectors: _c0, decls: 7, vars: 4, consts: [[1, "ic"], [3, "name", "size"], [1, "act"]], template: function Empty_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "h3");
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, Empty_Conditional_4_Template, 2, 1, "p");
      \u0275\u0275elementStart(5, "div", 2);
      \u0275\u0275projection(6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("name", ctx.icon())("size", 22);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.title());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.text() ? 4 : -1);
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  padding: 48px 24px;\n  gap: 8px;\n}\n.ic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-600);\n  margin-bottom: 6px;\n}\np[_ngcontent-%COMP%] {\n  color: var(--%NS%text-2);\n  max-width: 420px;\n}\n.act[_ngcontent-%COMP%] {\n  margin-top: 10px;\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Empty, [{
    type: Component,
    args: [{ selector: "vc-empty", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="ic"><vc-icon [name]="icon()" [size]="22" /></div>
    <h3>{{ title() }}</h3>
    @if (text()) { <p>{{ text() }}</p> }
    <div class="act"><ng-content /></div>
  `, styles: ["/* angular:styles/component:scss;b927292b6bd55a55;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  padding: 48px 24px;\n  gap: 8px;\n}\n.ic {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  background: var(--sand-200);\n  color: var(--stone-600);\n  margin-bottom: 6px;\n}\np {\n  color: var(--text-2);\n  max-width: 420px;\n}\n.act {\n  margin-top: 10px;\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { icon: [{ type: Input, args: [{ isSignal: true, alias: "icon", required: false }] }], title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: false }] }], text: [{ type: Input, args: [{ isSignal: true, alias: "text", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Empty, { className: "Empty", filePath: "src/app/ui/kit.ts", lineNumber: 169 });
})();
var Loading = class _Loading {
  rows = input(
    4,
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rowsArr = computed(
    () => Array.from({ length: this.rows() }, (_, i) => [92, 76, 84, 60, 70, 88][i % 6]),
    ...ngDevMode ? [{ debugName: "rowsArr" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Loading_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Loading)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Loading, selectors: [["vc-loading"]], inputs: { rows: [1, "rows"] }, decls: 2, vars: 0, consts: [[1, "bar", 3, "width"], [1, "bar"]], template: function Loading_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275repeaterCreate(0, Loading_For_1_Template, 1, 2, "div", 0, \u0275\u0275repeaterTrackByIndex);
    }
    if (rf & 2) {
      \u0275\u0275repeater(ctx.rowsArr());
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 20px;\n}\n.bar[_ngcontent-%COMP%] {\n  height: 12px;\n  border-radius: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      var(--%NS%sand-200),\n      var(--%NS%sand-100),\n      var(--%NS%sand-200));\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_sh 1.3s ease-in-out infinite;\n}\n@keyframes _ngcontent-%COMP%_sh {\n  0% {\n    background-position: 100% 0;\n  }\n  100% {\n    background-position: -100% 0;\n  }\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Loading, [{
    type: Component,
    args: [{ selector: "vc-loading", changeDetection: ChangeDetectionStrategy.OnPush, template: `@for (r of rowsArr(); track $index) { <div class="bar" [style.width.%]="r"></div> }`, styles: ["/* angular:styles/component:scss;734bd4737e53523a;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 20px;\n}\n.bar {\n  height: 12px;\n  border-radius: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      var(--sand-200),\n      var(--sand-100),\n      var(--sand-200));\n  background-size: 200% 100%;\n  animation: sh 1.3s ease-in-out infinite;\n}\n@keyframes sh {\n  0% {\n    background-position: 100% 0;\n  }\n  100% {\n    background-position: -100% 0;\n  }\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { rows: [{ type: Input, args: [{ isSignal: true, alias: "rows", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Loading, { className: "Loading", filePath: "src/app/ui/kit.ts", lineNumber: 186 });
})();
var ErrorBox = class _ErrorBox {
  title = input(
    "Something went wrong",
    ...ngDevMode ? [{ debugName: "title" }] : (
      /* istanbul ignore next */
      []
    )
  );
  message = input(
    "",
    ...ngDevMode ? [{ debugName: "message" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function ErrorBox_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorBox)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ErrorBox, selectors: [["vc-error"]], inputs: { title: [1, "title"], message: [1, "message"] }, ngContentSelectors: _c0, decls: 7, vars: 3, consts: [["name", "alert", 3, "size"], [1, "txt"]], template: function ErrorBox_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275element(0, "vc-icon", 0);
      \u0275\u0275elementStart(1, "div", 1)(2, "strong");
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "span");
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275projection(6);
    }
    if (rf & 2) {
      \u0275\u0275property("size", 18);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.title());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.message());
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  border: 1px solid #f3c7c3;\n}\n.txt[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  flex: 1;\n}\n.txt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorBox, [{
    type: Component,
    args: [{ selector: "vc-error", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-icon name="alert" [size]="18" />
    <div class="txt"><strong>{{ title() }}</strong><span>{{ message() }}</span></div>
    <ng-content />
  `, styles: ["/* angular:styles/component:scss;f0c249882b4927d7;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: var(--radius-sm);\n  background: var(--danger-soft);\n  color: var(--red-600);\n  border: 1px solid #f3c7c3;\n}\n.txt {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  flex: 1;\n}\n.txt span {\n  color: var(--stone-700);\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: false }] }], message: [{ type: Input, args: [{ isSignal: true, alias: "message", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ErrorBox, { className: "ErrorBox", filePath: "src/app/ui/kit.ts", lineNumber: 207 });
})();
var Callout = class _Callout {
  tone = input(
    "info",
    ...ngDevMode ? [{ debugName: "tone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  icon = input(
    "info",
    ...ngDevMode ? [{ debugName: "icon" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Callout_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Callout)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Callout, selectors: [["vc-callout"]], hostVars: 2, hostBindings: function Callout_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classMap("tone-" + ctx.tone());
    }
  }, inputs: { tone: [1, "tone"], icon: [1, "icon"] }, ngContentSelectors: _c0, decls: 3, vars: 2, consts: [[3, "name", "size"], [1, "c"]], template: function Callout_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275element(0, "vc-icon", 0);
      \u0275\u0275elementStart(1, "div", 1);
      \u0275\u0275projection(2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("name", ctx.icon())("size", 18);
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: var(--%NS%radius-sm);\n  border: 1px solid;\n  font-size: 13.5px;\n}\n.c[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.tone-info[_nghost-%COMP%] {\n  background: var(--%NS%info-soft);\n  border-color: #c9dcf0;\n  color: var(--%NS%stone-800);\n}\n.tone-info[_nghost-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%sky-600);\n}\n.tone-ok[_nghost-%COMP%] {\n  background: var(--%NS%ok-soft);\n  border-color: #cfe2d4;\n  color: var(--%NS%stone-800);\n}\n.tone-ok[_nghost-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n}\n.tone-warn[_nghost-%COMP%] {\n  background: var(--%NS%warn-soft);\n  border-color: #f1dcae;\n  color: var(--%NS%stone-800);\n}\n.tone-warn[_nghost-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.tone-danger[_nghost-%COMP%] {\n  background: var(--%NS%danger-soft);\n  border-color: #f3c7c3;\n  color: var(--%NS%stone-800);\n}\n.tone-danger[_nghost-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Callout, [{
    type: Component,
    args: [{ selector: "vc-callout", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `<vc-icon [name]="icon()" [size]="18" /><div class="c"><ng-content /></div>`, host: { "[class]": '"tone-" + tone()' }, styles: ["/* angular:styles/component:scss;dbd19205ec889729;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: flex;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: var(--radius-sm);\n  border: 1px solid;\n  font-size: 13.5px;\n}\n.c {\n  flex: 1;\n  min-width: 0;\n}\n:host(.tone-info) {\n  background: var(--info-soft);\n  border-color: #c9dcf0;\n  color: var(--stone-800);\n}\n:host(.tone-info) vc-icon {\n  color: var(--sky-600);\n}\n:host(.tone-ok) {\n  background: var(--ok-soft);\n  border-color: #cfe2d4;\n  color: var(--stone-800);\n}\n:host(.tone-ok) vc-icon {\n  color: var(--forest-600);\n}\n:host(.tone-warn) {\n  background: var(--warn-soft);\n  border-color: #f1dcae;\n  color: var(--stone-800);\n}\n:host(.tone-warn) vc-icon {\n  color: var(--amber-600);\n}\n:host(.tone-danger) {\n  background: var(--danger-soft);\n  border-color: #f3c7c3;\n  color: var(--stone-800);\n}\n:host(.tone-danger) vc-icon {\n  color: var(--red-600);\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { tone: [{ type: Input, args: [{ isSignal: true, alias: "tone", required: false }] }], icon: [{ type: Input, args: [{ isSignal: true, alias: "icon", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Callout, { className: "Callout", filePath: "src/app/ui/kit.ts", lineNumber: 227 });
})();
var Modal = class _Modal {
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  title = input(
    "",
    ...ngDevMode ? [{ debugName: "title" }] : (
      /* istanbul ignore next */
      []
    )
  );
  subtitle = input(
    "",
    ...ngDevMode ? [{ debugName: "subtitle" }] : (
      /* istanbul ignore next */
      []
    )
  );
  width = input(
    "560px",
    ...ngDevMode ? [{ debugName: "width" }] : (
      /* istanbul ignore next */
      []
    )
  );
  drawer = input(
    false,
    ...ngDevMode ? [{ debugName: "drawer" }] : (
      /* istanbul ignore next */
      []
    )
  );
  closed = output();
  close() {
    this.open.set(false);
    this.closed.emit();
  }
  esc() {
    if (this.open())
      this.close();
  }
  static \u0275fac = function Modal_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Modal)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Modal, selectors: [["vc-modal"]], hostBindings: function Modal_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function Modal_keydown_escape_HostBindingHandler() {
        return ctx.esc();
      }, \u0275\u0275resolveDocument);
    }
  }, inputs: { open: [1, "open"], title: [1, "title"], subtitle: [1, "subtitle"], width: [1, "width"], drawer: [1, "drawer"] }, outputs: { open: "openChange", closed: "closed" }, ngContentSelectors: _c4, decls: 1, vars: 1, consts: [[1, "scrim", 3, "click"], ["role", "dialog", "aria-modal", "true", 1, "panel"], [1, "t"], ["aria-label", "Close", 1, "btn", "btn-ghost", "btn-icon", 3, "click"], ["name", "x", 3, "size"], [1, "body"]], template: function Modal_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c3);
      \u0275\u0275conditionalCreate(0, Modal_Conditional_0_Template, 13, 7);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.open() ? 0 : -1);
    }
  }, dependencies: [Icon], styles: ["\n.scrim[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(16, 24, 20, 0.42);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n  z-index: 100;\n  animation: _ngcontent-%COMP%_f 0.15s;\n}\n.panel[_ngcontent-%COMP%] {\n  position: fixed;\n  z-index: 101;\n  left: 50%;\n  top: 8vh;\n  transform: translateX(-50%);\n  max-width: calc(100vw - 32px);\n  max-height: 84vh;\n  display: flex;\n  flex-direction: column;\n  background: var(--%NS%surface);\n  border-radius: var(--%NS%radius-lg);\n  box-shadow: var(--%NS%shadow-lg);\n  animation: _ngcontent-%COMP%_p 0.18s ease-out;\n}\n.panel.drawer[_ngcontent-%COMP%] {\n  left: auto;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  transform: none;\n  max-height: 100vh;\n  height: 100vh;\n  border-radius: 0;\n  animation: _ngcontent-%COMP%_d 0.2s ease-out;\n}\nheader[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 18px 20px 14px;\n  border-bottom: 1px solid var(--%NS%border);\n}\n.t[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.t[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  color: var(--%NS%text-2);\n  font-size: 13px;\n}\n.body[_ngcontent-%COMP%] {\n  padding: 20px;\n  overflow: auto;\n  flex: 1;\n}\nfooter[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  padding: 14px 20px;\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n  border-radius: 0 0 var(--%NS%radius-lg) var(--%NS%radius-lg);\n}\nfooter[_ngcontent-%COMP%]:empty {\n  display: none;\n}\n@keyframes _ngcontent-%COMP%_f {\n  from {\n    opacity: 0;\n  }\n}\n@keyframes _ngcontent-%COMP%_p {\n  from {\n    opacity: 0;\n    transform: translate(-50%, 8px);\n  }\n}\n@keyframes _ngcontent-%COMP%_d {\n  from {\n    transform: translateX(24px);\n    opacity: 0;\n  }\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Modal, [{
    type: Component,
    args: [{ selector: "vc-modal", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (open()) {
      <div class="scrim" (click)="close()"></div>
      <section class="panel" [class.drawer]="drawer()" [style.width]="width()" role="dialog" aria-modal="true">
        <header>
          <div class="t"><h2>{{ title() }}</h2>@if (subtitle()) { <p>{{ subtitle() }}</p> }</div>
          <button class="btn btn-ghost btn-icon" (click)="close()" aria-label="Close"><vc-icon name="x" [size]="18" /></button>
        </header>
        <div class="body"><ng-content /></div>
        <footer><ng-content select="[footer]" /></footer>
      </section>
    }
  `, styles: ["/* angular:styles/component:scss;8de5ee501debb811;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n.scrim {\n  position: fixed;\n  inset: 0;\n  background: rgba(16, 24, 20, 0.42);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n  z-index: 100;\n  animation: f 0.15s;\n}\n.panel {\n  position: fixed;\n  z-index: 101;\n  left: 50%;\n  top: 8vh;\n  transform: translateX(-50%);\n  max-width: calc(100vw - 32px);\n  max-height: 84vh;\n  display: flex;\n  flex-direction: column;\n  background: var(--surface);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-lg);\n  animation: p 0.18s ease-out;\n}\n.panel.drawer {\n  left: auto;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  transform: none;\n  max-height: 100vh;\n  height: 100vh;\n  border-radius: 0;\n  animation: d 0.2s ease-out;\n}\nheader {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 18px 20px 14px;\n  border-bottom: 1px solid var(--border);\n}\n.t {\n  flex: 1;\n}\n.t p {\n  margin-top: 4px;\n  color: var(--text-2);\n  font-size: 13px;\n}\n.body {\n  padding: 20px;\n  overflow: auto;\n  flex: 1;\n}\nfooter {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  padding: 14px 20px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n  border-radius: 0 0 var(--radius-lg) var(--radius-lg);\n}\nfooter:empty {\n  display: none;\n}\n@keyframes f {\n  from {\n    opacity: 0;\n  }\n}\n@keyframes p {\n  from {\n    opacity: 0;\n    transform: translate(-50%, 8px);\n  }\n}\n@keyframes d {\n  from {\n    transform: translateX(24px);\n    opacity: 0;\n  }\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: false }] }], subtitle: [{ type: Input, args: [{ isSignal: true, alias: "subtitle", required: false }] }], width: [{ type: Input, args: [{ isSignal: true, alias: "width", required: false }] }], drawer: [{ type: Input, args: [{ isSignal: true, alias: "drawer", required: false }] }], closed: [{ type: Output, args: ["closed"] }], esc: [{
    type: HostListener,
    args: ["document:keydown.escape"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Modal, { className: "Modal", filePath: "src/app/ui/kit.ts", lineNumber: 263 });
})();
var Tabs = class _Tabs {
  tabs = input.required(
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  active = model.required(
    ...ngDevMode ? [{ debugName: "active" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Tabs_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Tabs)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Tabs, selectors: [["vc-tabs"]], inputs: { tabs: [1, "tabs"], active: [1, "active"] }, outputs: { active: "activeChange" }, decls: 2, vars: 0, consts: [["type", "button", 3, "on"], ["type", "button", 3, "click"], [1, "c"]], template: function Tabs_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275repeaterCreate(0, Tabs_For_1_Template, 3, 4, "button", 0, _forTrack0);
    }
    if (rf & 2) {
      \u0275\u0275repeater(ctx.tabs());
    }
  }, styles: ['\n[_nghost-%COMP%] {\n  display: flex;\n  gap: 4px;\n  border-bottom: 1px solid var(--%NS%border);\n  margin-bottom: 20px;\n  overflow-x: auto;\n}\nbutton[_ngcontent-%COMP%] {\n  position: relative;\n  height: 40px;\n  padding: 0 14px;\n  border: 0;\n  background: none;\n  font: inherit;\n  font-weight: 500;\n  color: var(--%NS%text-2);\n  cursor: pointer;\n  white-space: nowrap;\n}\nbutton[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%text);\n}\nbutton.on[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\nbutton.on[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  left: 10px;\n  right: 10px;\n  bottom: -1px;\n  height: 2px;\n  border-radius: 2px;\n  background: var(--%NS%forest-600);\n}\n.c[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  min-width: 20px;\n  height: 18px;\n  padding: 0 6px;\n  margin-left: 4px;\n  border-radius: 9px;\n  background: var(--%NS%sand-200);\n  font-size: 11px;\n  color: var(--%NS%stone-600);\n}\n/*# sourceMappingURL=kit.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Tabs, [{
    type: Component,
    args: [{ selector: "vc-tabs", changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @for (t of tabs(); track t.key) {
      <button type="button" [class.on]="t.key === active()" (click)="active.set(t.key)">
        {{ t.label }} @if (t.count !== undefined && t.count !== null) { <span class="c">{{ t.count }}</span> }
      </button>
    }
  `, styles: ['/* angular:styles/component:scss;84cce7cefcabefa6;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: flex;\n  gap: 4px;\n  border-bottom: 1px solid var(--border);\n  margin-bottom: 20px;\n  overflow-x: auto;\n}\nbutton {\n  position: relative;\n  height: 40px;\n  padding: 0 14px;\n  border: 0;\n  background: none;\n  font: inherit;\n  font-weight: 500;\n  color: var(--text-2);\n  cursor: pointer;\n  white-space: nowrap;\n}\nbutton:hover {\n  color: var(--text);\n}\nbutton.on {\n  color: var(--forest-700);\n}\nbutton.on::after {\n  content: "";\n  position: absolute;\n  left: 10px;\n  right: 10px;\n  bottom: -1px;\n  height: 2px;\n  border-radius: 2px;\n  background: var(--forest-600);\n}\n.c {\n  display: inline-grid;\n  place-items: center;\n  min-width: 20px;\n  height: 18px;\n  padding: 0 6px;\n  margin-left: 4px;\n  border-radius: 9px;\n  background: var(--sand-200);\n  font-size: 11px;\n  color: var(--stone-600);\n}\n/*# sourceMappingURL=kit.css.map */\n'] }]
  }], null, { tabs: [{ type: Input, args: [{ isSignal: true, alias: "tabs", required: true }] }], active: [{ type: Input, args: [{ isSignal: true, alias: "active", required: true }] }, { type: Output, args: ["activeChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Tabs, { className: "Tabs", filePath: "src/app/ui/kit.ts", lineNumber: 301 });
})();
var Hash = class _Hash {
  value = input(
    "",
    ...ngDevMode ? [{ debugName: "value" }] : (
      /* istanbul ignore next */
      []
    )
  );
  full = input(
    false,
    ...ngDevMode ? [{ debugName: "full" }] : (
      /* istanbul ignore next */
      []
    )
  );
  copied = signal(
    false,
    ...ngDevMode ? [{ debugName: "copied" }] : (
      /* istanbul ignore next */
      []
    )
  );
  short = computed(
    () => this.full() ? this.value() : `${this.value().slice(0, 10)}\u2026${this.value().slice(-6)}`,
    ...ngDevMode ? [{ debugName: "short" }] : (
      /* istanbul ignore next */
      []
    )
  );
  copy(ev) {
    ev.stopPropagation();
    navigator.clipboard?.writeText(this.value());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1400);
  }
  static \u0275fac = function Hash_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Hash)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Hash, selectors: [["vc-hash"]], inputs: { value: [1, "value"], full: [1, "full"] }, decls: 5, vars: 6, consts: [["name", "fingerprint", 3, "size"], [3, "title"], ["type", "button", 3, "click"], [3, "name", "size"]], template: function Hash_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vc-icon", 0);
      \u0275\u0275elementStart(1, "code", 1);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "button", 2);
      \u0275\u0275listener("click", function Hash_Template_button_click_3_listener($event) {
        return ctx.copy($event);
      });
      \u0275\u0275element(4, "vc-icon", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("size", 14);
      \u0275\u0275advance();
      \u0275\u0275property("title", ctx.value());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.short());
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-label", "Copy fingerprint");
      \u0275\u0275advance();
      \u0275\u0275property("name", ctx.copied() ? "check" : "copy")("size", 13);
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 2px 4px 2px 8px;\n  border-radius: 6px;\n  background: var(--%NS%sand-100);\n  border: 1px solid var(--%NS%border);\n  color: var(--%NS%stone-600);\n  max-width: 100%;\n}\ncode[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%stone-800);\n}\nbutton[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border: 0;\n  border-radius: 4px;\n  background: none;\n  color: var(--%NS%stone-500);\n  cursor: pointer;\n}\nbutton[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-800);\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Hash, [{
    type: Component,
    args: [{ selector: "vc-hash", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-icon name="fingerprint" [size]="14" />
    <code [title]="value()">{{ short() }}</code>
    <button type="button" (click)="copy($event)" [attr.aria-label]="'Copy fingerprint'">
      <vc-icon [name]="copied() ? 'check' : 'copy'" [size]="13" />
    </button>
  `, styles: ["/* angular:styles/component:scss;18ebcc5c11def2bb;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 2px 4px 2px 8px;\n  border-radius: 6px;\n  background: var(--sand-100);\n  border: 1px solid var(--border);\n  color: var(--stone-600);\n  max-width: 100%;\n}\ncode {\n  font-size: 12px;\n  color: var(--stone-800);\n}\nbutton {\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border: 0;\n  border-radius: 4px;\n  background: none;\n  color: var(--stone-500);\n  cursor: pointer;\n}\nbutton:hover {\n  background: var(--sand-200);\n  color: var(--stone-800);\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { value: [{ type: Input, args: [{ isSignal: true, alias: "value", required: false }] }], full: [{ type: Input, args: [{ isSignal: true, alias: "full", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Hash, { className: "Hash", filePath: "src/app/ui/kit.ts", lineNumber: 326 });
})();
var Progress = class _Progress {
  value = input(
    0,
    ...ngDevMode ? [{ debugName: "value" }] : (
      /* istanbul ignore next */
      []
    )
  );
  max = input(
    100,
    ...ngDevMode ? [{ debugName: "max" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tone = input(
    "ok",
    ...ngDevMode ? [{ debugName: "tone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pct = computed(
    () => this.max() > 0 ? Math.max(0, Math.min(100, this.value() / this.max() * 100)) : 0,
    ...ngDevMode ? [{ debugName: "pct" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Progress_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Progress)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Progress, selectors: [["vc-progress"]], inputs: { value: [1, "value"], max: [1, "max"], tone: [1, "tone"] }, decls: 2, vars: 4, consts: [[1, "track"], [1, "fill"]], template: function Progress_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275domElement(1, "div", 1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275classMap(ctx.tone());
      \u0275\u0275styleProp("width", ctx.pct(), "%");
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.track[_ngcontent-%COMP%] {\n  height: 6px;\n  border-radius: 3px;\n  background: var(--%NS%sand-200);\n  overflow: hidden;\n}\n.fill[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: 3px;\n  background: var(--%NS%forest-500);\n  transition: width 0.4s ease;\n}\n.fill.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-600);\n}\n.fill.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%red-600);\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Progress, [{
    type: Component,
    args: [{ selector: "vc-progress", changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="track"><div class="fill" [style.width.%]="pct()" [class]="tone()"></div></div>`, styles: ["/* angular:styles/component:scss;87b338c437b56918;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: block;\n}\n.track {\n  height: 6px;\n  border-radius: 3px;\n  background: var(--sand-200);\n  overflow: hidden;\n}\n.fill {\n  height: 100%;\n  border-radius: 3px;\n  background: var(--forest-500);\n  transition: width 0.4s ease;\n}\n.fill.warn {\n  background: var(--amber-600);\n}\n.fill.danger {\n  background: var(--red-600);\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { value: [{ type: Input, args: [{ isSignal: true, alias: "value", required: false }] }], max: [{ type: Input, args: [{ isSignal: true, alias: "max", required: false }] }], tone: [{ type: Input, args: [{ isSignal: true, alias: "tone", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Progress, { className: "Progress", filePath: "src/app/ui/kit.ts", lineNumber: 351 });
})();
var FileDrop = class _FileDrop {
  accept = input(
    "",
    ...ngDevMode ? [{ debugName: "accept" }] : (
      /* istanbul ignore next */
      []
    )
  );
  label = input(
    "Choose a file or drop it here",
    ...ngDevMode ? [{ debugName: "label" }] : (
      /* istanbul ignore next */
      []
    )
  );
  hint = input(
    "PDF, JPG, PNG or CSV \xB7 up to 25 MB",
    ...ngDevMode ? [{ debugName: "hint" }] : (
      /* istanbul ignore next */
      []
    )
  );
  file = model(
    null,
    ...ngDevMode ? [{ debugName: "file" }] : (
      /* istanbul ignore next */
      []
    )
  );
  over = signal(
    false,
    ...ngDevMode ? [{ debugName: "over" }] : (
      /* istanbul ignore next */
      []
    )
  );
  size = computed(
    () => {
      const b = this.file()?.size ?? 0;
      return b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`;
    },
    ...ngDevMode ? [{ debugName: "size" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pick(e) {
    const f = e.target.files?.[0];
    if (f)
      this.file.set(f);
  }
  drop(e) {
    e.preventDefault();
    this.over.set(false);
    const f = e.dataTransfer?.files?.[0];
    if (f)
      this.file.set(f);
  }
  static \u0275fac = function FileDrop_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FileDrop)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FileDrop, selectors: [["vc-file-drop"]], inputs: { accept: [1, "accept"], label: [1, "label"], hint: [1, "hint"], file: [1, "file"] }, outputs: { file: "fileChange" }, decls: 8, vars: 6, consts: [["inp", ""], ["type", "file", "hidden", "", 3, "change", "accept"], ["type", "button", 1, "zone", 3, "click", "dragover", "dragleave", "drop"], ["name", "upload", 3, "size"], [1, "t"], [1, "s"]], template: function FileDrop_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "input", 1, 0);
      \u0275\u0275listener("change", function FileDrop_Template_input_change_0_listener($event) {
        return ctx.pick($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "button", 2);
      \u0275\u0275listener("click", function FileDrop_Template_button_click_2_listener() {
        \u0275\u0275restoreView(_r1);
        const inp_r2 = \u0275\u0275reference(1);
        return \u0275\u0275resetView(inp_r2.click());
      })("dragover", function FileDrop_Template_button_dragover_2_listener($event) {
        \u0275\u0275restoreView(_r1);
        $event.preventDefault();
        return \u0275\u0275resetView(ctx.over.set(true));
      })("dragleave", function FileDrop_Template_button_dragleave_2_listener() {
        return ctx.over.set(false);
      })("drop", function FileDrop_Template_button_drop_2_listener($event) {
        return ctx.drop($event);
      });
      \u0275\u0275element(3, "vc-icon", 3);
      \u0275\u0275elementStart(4, "span", 4);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 5);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275property("accept", ctx.accept());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("over", ctx.over());
      \u0275\u0275advance();
      \u0275\u0275property("size", 20);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.file()?.name ?? ctx.label());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.file() ? ctx.size() : ctx.hint());
    }
  }, dependencies: [Icon], styles: ["\n.zone[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 22px;\n  border: 1.5px dashed var(--%NS%border-strong);\n  border-radius: var(--%NS%radius);\n  background: var(--%NS%surface-2);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n  font: inherit;\n}\n.zone[_ngcontent-%COMP%]:hover, \n.zone.over[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-400);\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n}\n.t[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--%NS%stone-800);\n}\n.s[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n/*# sourceMappingURL=kit.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileDrop, [{
    type: Component,
    args: [{ selector: "vc-file-drop", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <input #inp type="file" [accept]="accept()" (change)="pick($event)" hidden />
    <button type="button" class="zone" [class.over]="over()" (click)="inp.click()"
      (dragover)="$event.preventDefault(); over.set(true)" (dragleave)="over.set(false)" (drop)="drop($event)">
      <vc-icon name="upload" [size]="20" />
      <span class="t">{{ file()?.name ?? label() }}</span>
      <span class="s">{{ file() ? size() : hint() }}</span>
    </button>
  `, styles: ["/* angular:styles/component:scss;210c6ca5ae2ab00c;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n.zone {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 22px;\n  border: 1.5px dashed var(--border-strong);\n  border-radius: var(--radius);\n  background: var(--surface-2);\n  color: var(--stone-600);\n  cursor: pointer;\n  font: inherit;\n}\n.zone:hover,\n.zone.over {\n  border-color: var(--forest-400);\n  background: var(--forest-50);\n  color: var(--forest-700);\n}\n.t {\n  font-weight: 500;\n  color: var(--stone-800);\n}\n.s {\n  font-size: 12px;\n  color: var(--text-3);\n}\n/*# sourceMappingURL=kit.css.map */\n"] }]
  }], null, { accept: [{ type: Input, args: [{ isSignal: true, alias: "accept", required: false }] }], label: [{ type: Input, args: [{ isSignal: true, alias: "label", required: false }] }], hint: [{ type: Input, args: [{ isSignal: true, alias: "hint", required: false }] }], file: [{ type: Input, args: [{ isSignal: true, alias: "file", required: false }] }, { type: Output, args: ["fileChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FileDrop, { className: "FileDrop", filePath: "src/app/ui/kit.ts", lineNumber: 379 });
})();
var Timeline = class _Timeline {
  items = input(
    [],
    ...ngDevMode ? [{ debugName: "items" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Timeline_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Timeline)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Timeline, selectors: [["vc-timeline"]], inputs: { items: [1, "items"] }, decls: 3, vars: 1, consts: [[1, "it", 3, "class"], [1, "muted", "small"], [1, "it"], [1, "pt"], [1, "c"], [1, "h"], [1, "at"], [1, "by"], [1, "n"]], template: function Timeline_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275repeaterCreate(0, Timeline_For_1_Template, 9, 6, "div", 0, \u0275\u0275repeaterTrackByIndex, false, Timeline_ForEmpty_2_Template, 2, 0, "p", 1);
    }
    if (rf & 2) {
      \u0275\u0275repeater(ctx.items());
    }
  }, styles: ['\n[_nghost-%COMP%] {\n  display: block;\n}\n.it[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  gap: 12px;\n  padding-bottom: 16px;\n}\n.it[_ngcontent-%COMP%]:not(:last-child)::before {\n  content: "";\n  position: absolute;\n  left: 5px;\n  top: 14px;\n  bottom: 0;\n  width: 2px;\n  background: var(--%NS%sand-200);\n}\n.pt[_ngcontent-%COMP%] {\n  flex: none;\n  width: 12px;\n  height: 12px;\n  margin-top: 4px;\n  border-radius: 50%;\n  border: 2px solid var(--%NS%forest-500);\n  background: var(--%NS%surface);\n}\n.t-warn[_ngcontent-%COMP%]   .pt[_ngcontent-%COMP%] {\n  border-color: var(--%NS%amber-600);\n}\n.t-danger[_ngcontent-%COMP%]   .pt[_ngcontent-%COMP%] {\n  border-color: var(--%NS%red-600);\n}\n.t-neutral[_ngcontent-%COMP%]   .pt[_ngcontent-%COMP%] {\n  border-color: var(--%NS%stone-400);\n}\n.c[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.h[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: baseline;\n  flex-wrap: wrap;\n}\n.at[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.by[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.n[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n}\n/*# sourceMappingURL=kit.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Timeline, [{
    type: Component,
    args: [{ selector: "vc-timeline", changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @for (i of items(); track $index) {
      <div class="it" [class]="'t-' + (i.tone ?? 'ok')">
        <span class="pt"></span>
        <div class="c">
          <div class="h"><strong>{{ i.title }}</strong>@if (i.at) { <span class="at">{{ i.at }}</span> }</div>
          @if (i.by) { <div class="by">{{ i.by }}</div> }
          @if (i.note) { <div class="n">{{ i.note }}</div> }
        </div>
      </div>
    } @empty { <p class="muted small">No events yet.</p> }
  `, styles: ['/* angular:styles/component:scss;7bbdd3a9aadb7040;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\kit.ts */\n:host {\n  display: block;\n}\n.it {\n  position: relative;\n  display: flex;\n  gap: 12px;\n  padding-bottom: 16px;\n}\n.it:not(:last-child)::before {\n  content: "";\n  position: absolute;\n  left: 5px;\n  top: 14px;\n  bottom: 0;\n  width: 2px;\n  background: var(--sand-200);\n}\n.pt {\n  flex: none;\n  width: 12px;\n  height: 12px;\n  margin-top: 4px;\n  border-radius: 50%;\n  border: 2px solid var(--forest-500);\n  background: var(--surface);\n}\n.t-warn .pt {\n  border-color: var(--amber-600);\n}\n.t-danger .pt {\n  border-color: var(--red-600);\n}\n.t-neutral .pt {\n  border-color: var(--stone-400);\n}\n.c {\n  flex: 1;\n  min-width: 0;\n}\n.h {\n  display: flex;\n  gap: 8px;\n  align-items: baseline;\n  flex-wrap: wrap;\n}\n.at {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.by {\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.n {\n  margin-top: 4px;\n  font-size: 13px;\n  color: var(--stone-700);\n}\n/*# sourceMappingURL=kit.css.map */\n'] }]
  }], null, { items: [{ type: Input, args: [{ isSignal: true, alias: "items", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Timeline, { className: "Timeline", filePath: "src/app/ui/kit.ts", lineNumber: 429 });
})();
var KIT = [Icon, Badge, DataClass, PageHeader, Stat, Empty, Loading, ErrorBox, Callout, Modal, Tabs, Hash, Progress, FileDrop, Timeline, NgTemplateOutlet];

export {
  Badge,
  humanize,
  DataClass,
  PageHeader,
  Stat,
  Empty,
  Loading,
  ErrorBox,
  Callout,
  Modal,
  Tabs,
  Hash,
  Progress,
  FileDrop,
  Timeline,
  KIT
};
//# debugId=0ecc1f0d-6c52-50ed-8a49-2fcfb09bd3ee
//# sourceMappingURL=chunk-3GJ7OF6Y.js.map
