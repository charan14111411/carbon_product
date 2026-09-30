import {
  CROP_CATEGORIES,
  Chip,
  PRACTICE_CATEGORIES
} from "./chunk-B3LTHGQM.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  HumanPipe
} from "./chunk-E5UDMWWN.js";
import {
  AuthService
} from "./chunk-G6POHVBO.js";
import {
  Badge,
  Callout,
  Empty,
  ErrorBox,
  Loading,
  Modal,
  PageHeader,
  Tabs
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  input,
  model,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/catalogue/schema-editor.ts
function SchemaEditor_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function SchemaEditor_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r4.unit);
  }
}
function SchemaEditor_For_2_Conditional_18_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "label");
    \u0275\u0275text(2, "Unit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 33);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SchemaEditor_For_2_Conditional_18_Conditional_26_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const \u0275$index_3_r3 = \u0275\u0275nextContext(2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.patch(\u0275$index_3_r3, { unit: $event || null }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 21)(5, "label");
    \u0275\u0275text(6, "Minimum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 34);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SchemaEditor_For_2_Conditional_18_Conditional_26_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r6);
      const \u0275$index_3_r3 = \u0275\u0275nextContext(2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.patch(\u0275$index_3_r3, { min: $event === "" || $event === null ? null : +$event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 21)(9, "label");
    \u0275\u0275text(10, "Maximum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 34);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SchemaEditor_For_2_Conditional_18_Conditional_26_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r6);
      const \u0275$index_3_r3 = \u0275\u0275nextContext(2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.patch(\u0275$index_3_r3, { max: $event === "" || $event === null ? null : +$event }));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", d_r4.unit ?? "");
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", d_r4.min);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", d_r4.max);
    \u0275\u0275control();
  }
}
function SchemaEditor_For_2_Conditional_18_Conditional_27_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 38);
    \u0275\u0275listener("click", function SchemaEditor_For_2_Conditional_18_Conditional_27_For_5_Template_button_click_2_listener() {
      const c_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const \u0275$index_3_r3 = \u0275\u0275nextContext(3).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.removeChoice(\u0275$index_3_r3, c_r9));
    });
    \u0275\u0275element(3, "vc-icon", 39);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r9);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 11);
  }
}
function SchemaEditor_For_2_Conditional_18_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32)(1, "label");
    \u0275\u0275text(2, "Options");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 35);
    \u0275\u0275repeaterCreate(4, SchemaEditor_For_2_Conditional_18_Conditional_27_For_5_Template, 4, 2, "span", 36, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(6, "input", 37);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SchemaEditor_For_2_Conditional_18_Conditional_27_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.draft.set($event));
    })("keydown.enter", function SchemaEditor_For_2_Conditional_18_Conditional_27_Template_input_keydown_enter_6_listener($event) {
      \u0275\u0275restoreView(_r7);
      const \u0275$index_3_r3 = \u0275\u0275nextContext(2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.addChoice(\u0275$index_3_r3, $event));
    })("blur", function SchemaEditor_For_2_Conditional_18_Conditional_27_Template_input_blur_6_listener() {
      \u0275\u0275restoreView(_r7);
      const \u0275$index_3_r3 = \u0275\u0275nextContext(2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.addChoice(\u0275$index_3_r3));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const d_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(d_r4.choices);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r0.draft());
    \u0275\u0275control();
  }
}
function SchemaEditor_For_2_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 20)(2, "div", 21)(3, "label");
    \u0275\u0275text(4, "Label");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 22);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SchemaEditor_For_2_Conditional_18_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r5);
      const \u0275$index_3_r3 = \u0275\u0275nextContext().$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.setLabel(\u0275$index_3_r3, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 21)(7, "label");
    \u0275\u0275text(8, "Key ");
    \u0275\u0275elementStart(9, "span", 23);
    \u0275\u0275text(10, "(used in data)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "input", 24);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SchemaEditor_For_2_Conditional_18_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r5);
      const \u0275$index_3_r3 = \u0275\u0275nextContext().$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.patch(\u0275$index_3_r3, { key: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 21)(13, "label");
    \u0275\u0275text(14, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "select", 25);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SchemaEditor_For_2_Conditional_18_Template_select_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r5);
      const \u0275$index_3_r3 = \u0275\u0275nextContext().$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.patch(\u0275$index_3_r3, { type: $event }));
    });
    \u0275\u0275elementStart(16, "option", 26);
    \u0275\u0275text(17, "Text");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "option", 27);
    \u0275\u0275text(19, "Number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "option", 28);
    \u0275\u0275text(21, "Choice from a list");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 29)(23, "label", 30)(24, "input", 31);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SchemaEditor_For_2_Conditional_18_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r5);
      const \u0275$index_3_r3 = \u0275\u0275nextContext().$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.patch(\u0275$index_3_r3, { required: $event }));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(25, "Required");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(26, SchemaEditor_For_2_Conditional_18_Conditional_26_Template, 12, 3);
    \u0275\u0275conditionalCreate(27, SchemaEditor_For_2_Conditional_18_Conditional_27_Template, 7, 1, "div", 32);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", d_r4.label);
    \u0275\u0275control();
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", d_r4.key);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", d_r4.type);
    \u0275\u0275control();
    \u0275\u0275advance(9);
    \u0275\u0275property("ngModel", d_r4.required);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(d_r4.type === "number" ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r4.type === "choice" ? 27 : -1);
  }
}
function SchemaEditor_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 6);
    \u0275\u0275listener("click", function SchemaEditor_For_2_Template_div_click_1_listener() {
      const \u0275$index_3_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.expanded.set(ctx_r0.expanded() === \u0275$index_3_r3 ? -1 : \u0275$index_3_r3));
    });
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 7);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "code", 8);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, SchemaEditor_For_2_Conditional_8_Template, 2, 0, "span", 9);
    \u0275\u0275conditionalCreate(9, SchemaEditor_For_2_Conditional_9_Template, 2, 1, "span", 10);
    \u0275\u0275element(10, "span", 11);
    \u0275\u0275elementStart(11, "button", 12);
    \u0275\u0275listener("click", function SchemaEditor_For_2_Template_button_click_11_listener($event) {
      const \u0275$index_3_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.move(\u0275$index_3_r3, -1);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(12, "vc-icon", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 14);
    \u0275\u0275listener("click", function SchemaEditor_For_2_Template_button_click_13_listener($event) {
      const \u0275$index_3_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.move(\u0275$index_3_r3, 1);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(14, "vc-icon", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 16);
    \u0275\u0275listener("click", function SchemaEditor_For_2_Template_button_click_15_listener($event) {
      const \u0275$index_3_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.remove(\u0275$index_3_r3);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(16, "vc-icon", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "vc-icon", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, SchemaEditor_For_2_Conditional_18_Template, 28, 6, "div", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r4 = ctx.$implicit;
    const \u0275$index_3_r3 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("open", ctx_r0.expanded() === \u0275$index_3_r3);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("type t-" + d_r4.type);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r4.type === "number" ? "123" : d_r4.type === "choice" ? "\u2261" : "Aa");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r4.label || "Untitled " + ctx_r0.noun());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r4.key || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r4.required ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r4.unit ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", \u0275$index_3_r3 === 0);
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", \u0275$index_3_r3 === ctx_r0.defs().length - 1);
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.expanded() === \u0275$index_3_r3 ? "chevron-down" : "chevron-right")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.expanded() === \u0275$index_3_r3 ? 18 : -1);
  }
}
function SchemaEditor_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("No ", ctx_r0.noun(), "s yet. ", ctx_r0.emptyHint());
  }
}
function slugKey(label) {
  const s = label.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
  return /^[a-z]/.test(s) ? s : s ? `f_${s}`.slice(0, 40) : "";
}
function schemaProblems(defs) {
  const out = [];
  const keys = defs.map((d) => d.key);
  defs.forEach((d, i) => {
    const n = `Item ${i + 1}`;
    if (!d.label.trim())
      out.push(`${n}: add a label.`);
    if (!/^[a-z][a-z0-9_]{0,39}$/.test(d.key))
      out.push(`${n}: the key must start with a letter and use only a\u2013z, 0\u20139 and _.`);
    if (d.type === "choice" && !d.choices.length)
      out.push(`${d.label || n}: a choice needs at least one option.`);
    if (d.min !== null && d.min !== void 0 && d.max !== null && d.max !== void 0 && d.min > d.max)
      out.push(`${d.label || n}: minimum is greater than maximum.`);
  });
  const dupes = [...new Set(keys.filter((k, i) => k && keys.indexOf(k) !== i))];
  if (dupes.length)
    out.push(`Keys must be unique (repeated: ${dupes.join(", ")}).`);
  return out;
}
var SchemaEditor = class _SchemaEditor {
  defs = model(
    [],
    ...ngDevMode ? [{ debugName: "defs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  noun = input(
    "attribute",
    ...ngDevMode ? [{ debugName: "noun" }] : (
      /* istanbul ignore next */
      []
    )
  );
  emptyHint = input(
    "",
    ...ngDevMode ? [{ debugName: "emptyHint" }] : (
      /* istanbul ignore next */
      []
    )
  );
  expanded = signal(
    -1,
    ...ngDevMode ? [{ debugName: "expanded" }] : (
      /* istanbul ignore next */
      []
    )
  );
  draft = signal(
    "",
    ...ngDevMode ? [{ debugName: "draft" }] : (
      /* istanbul ignore next */
      []
    )
  );
  add() {
    this.defs.update((d) => [...d, { key: "", label: "", type: "text", required: false, choices: [], unit: null, min: null, max: null }]);
    this.expanded.set(this.defs().length - 1);
  }
  remove(i) {
    this.defs.update((d) => d.filter((_, k) => k !== i));
    this.expanded.set(-1);
  }
  move(i, dir) {
    const d = [...this.defs()];
    const j = i + dir;
    [d[i], d[j]] = [d[j], d[i]];
    this.defs.set(d);
    if (this.expanded() === i)
      this.expanded.set(j);
  }
  patch(i, p) {
    this.defs.update((d) => d.map((x, k) => {
      if (k !== i)
        return x;
      const n = __spreadValues(__spreadValues({}, x), p);
      if (p.type && p.type !== "choice")
        n.choices = [];
      if (p.type && p.type !== "number") {
        n.unit = null;
        n.min = null;
        n.max = null;
      }
      return n;
    }));
  }
  setLabel(i, label) {
    const d = this.defs()[i];
    const auto = !d.key || d.key === slugKey(d.label);
    this.patch(i, auto ? { label, key: slugKey(label) } : { label });
  }
  addChoice(i, ev) {
    ev?.preventDefault();
    const v = this.draft().trim().replace(/,$/, "");
    if (!v)
      return;
    const d = this.defs()[i];
    if (!d.choices.includes(v))
      this.patch(i, { choices: [...d.choices, v] });
    this.draft.set("");
  }
  removeChoice(i, c) {
    this.patch(i, { choices: this.defs()[i].choices.filter((x) => x !== c) });
  }
  static \u0275fac = function SchemaEditor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SchemaEditor)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SchemaEditor, selectors: [["vc-schema-editor"]], inputs: { defs: [1, "defs"], noun: [1, "noun"], emptyHint: [1, "emptyHint"] }, outputs: { defs: "defsChange" }, decls: 7, vars: 3, consts: [[1, "list"], [1, "item", 3, "open"], [1, "empty", "subtle", "small"], ["type", "button", 1, "btn", "btn-secondary", "btn-sm", "add", 3, "click"], ["name", "plus", 3, "size"], [1, "item"], [1, "head", 3, "click"], [1, "lbl"], [1, "key"], [1, "req"], [1, "unit"], [1, "grow"], ["type", "button", "aria-label", "Move up", 1, "ib", 3, "click", "disabled"], ["name", "arrow-up", 3, "size"], ["type", "button", "aria-label", "Move down", 1, "ib", 3, "click", "disabled"], ["name", "arrow-down", 3, "size"], ["type", "button", "aria-label", "Remove", 1, "ib", "del", 3, "click"], ["name", "trash", 3, "size"], [3, "name", "size"], [1, "body"], [1, "grid"], [1, "field"], ["placeholder", "e.g. Tree age", 1, "input", 3, "ngModelChange", "ngModel"], [1, "subtle"], [1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "input", 3, "ngModelChange", "ngModel"], ["value", "text"], ["value", "number"], ["value", "choice"], [1, "field", "chk"], [1, "checkbox"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "field", "wide"], ["placeholder", "e.g. years, kg/ha", 1, "input", 3, "ngModelChange", "ngModel"], ["type", "number", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "chips-in"], [1, "ch"], ["placeholder", "Type an option and press Enter", 1, "bare", 3, "ngModelChange", "keydown.enter", "blur", "ngModel"], ["type", "button", "aria-label", "Remove option", 3, "click"], ["name", "x", 3, "size"]], template: function SchemaEditor_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275repeaterCreate(1, SchemaEditor_For_2_Template, 19, 17, "div", 1, \u0275\u0275repeaterTrackByIndex, false, SchemaEditor_ForEmpty_3_Template, 2, 2, "div", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 3);
      \u0275\u0275listener("click", function SchemaEditor_Template_button_click_4_listener() {
        return ctx.add();
      });
      \u0275\u0275element(5, "vc-icon", 4);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.defs());
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 14);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1("Add ", ctx.noun());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, Icon], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.item[_ngcontent-%COMP%] {\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface);\n}\n.item.open[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-300);\n  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.08);\n}\n.head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  cursor: pointer;\n  min-width: 0;\n}\n.type[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 22px;\n  border-radius: 5px;\n  font: 600 10.5px var(--%NS%mono);\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n  flex: none;\n}\n.t-number[_ngcontent-%COMP%] {\n  background: var(--%NS%sky-100);\n  color: var(--%NS%sky-600);\n}\n.t-choice[_ngcontent-%COMP%] {\n  background: var(--%NS%violet-100);\n  color: var(--%NS%violet-600);\n}\n.lbl[_ngcontent-%COMP%] {\n  font-weight: 500;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.key[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.req[_ngcontent-%COMP%] {\n  font-size: 11px;\n  padding: 1px 6px;\n  border-radius: 4px;\n  background: var(--%NS%clay-50);\n  color: var(--%NS%clay-700);\n  border: 1px solid var(--%NS%clay-100);\n}\n.unit[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.grow[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.ib[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border: 0;\n  border-radius: 5px;\n  background: none;\n  color: var(--%NS%stone-500);\n  cursor: pointer;\n}\n.ib[_ngcontent-%COMP%]:hover:not([disabled]) {\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-800);\n}\n.ib[disabled][_ngcontent-%COMP%] {\n  opacity: 0.35;\n  cursor: default;\n}\n.ib.del[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%danger);\n}\n.body[_ngcontent-%COMP%] {\n  padding: 4px 12px 12px;\n  border-top: 1px solid var(--%NS%stone-100);\n}\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 10px 12px;\n  margin-top: 10px;\n}\n.grid[_ngcontent-%COMP%]   .wide[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.chk[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n  padding-bottom: 8px;\n}\n.chips-in[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n  min-height: 38px;\n  padding: 5px 8px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface);\n}\n.chips-in[_ngcontent-%COMP%]:focus-within {\n  border-color: var(--%NS%forest-500);\n  box-shadow: var(--%NS%focus);\n}\n.ch[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 24px;\n  padding: 0 4px 0 8px;\n  border-radius: 5px;\n  background: var(--%NS%violet-100);\n  color: var(--%NS%violet-600);\n  font-size: 12.5px;\n}\n.ch[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  border: 0;\n  background: none;\n  color: inherit;\n  cursor: pointer;\n  padding: 2px;\n  border-radius: 3px;\n  opacity: 0.7;\n}\n.ch[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n  background: rgba(91, 71, 168, 0.12);\n}\n.bare[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 140px;\n  border: 0;\n  outline: none;\n  font: inherit;\n  background: none;\n  height: 24px;\n}\n.empty[_ngcontent-%COMP%] {\n  padding: 14px;\n  border: 1px dashed var(--%NS%border-strong);\n  border-radius: var(--%NS%radius-sm);\n  text-align: center;\n}\n.add[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n/*# sourceMappingURL=schema-editor.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SchemaEditor, [{
    type: Component,
    args: [{ selector: "vc-schema-editor", imports: [FormsModule, Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="list">
      @for (d of defs(); track $index; let i = $index) {
        <div class="item" [class.open]="expanded() === i">
          <div class="head" (click)="expanded.set(expanded() === i ? -1 : i)">
            <span [class]="'type t-' + d.type">{{ d.type === 'number' ? '123' : d.type === 'choice' ? '\u2261' : 'Aa' }}</span>
            <span class="lbl">{{ d.label || 'Untitled ' + noun() }}</span>
            <code class="key">{{ d.key || '\u2014' }}</code>
            @if (d.required) { <span class="req">Required</span> }
            @if (d.unit) { <span class="unit">{{ d.unit }}</span> }
            <span class="grow"></span>
            <button type="button" class="ib" (click)="move(i, -1); $event.stopPropagation()" [disabled]="i === 0" aria-label="Move up"><vc-icon name="arrow-up" [size]="13" /></button>
            <button type="button" class="ib" (click)="move(i, 1); $event.stopPropagation()" [disabled]="i === defs().length - 1" aria-label="Move down"><vc-icon name="arrow-down" [size]="13" /></button>
            <button type="button" class="ib del" (click)="remove(i); $event.stopPropagation()" aria-label="Remove"><vc-icon name="trash" [size]="13" /></button>
            <vc-icon [name]="expanded() === i ? 'chevron-down' : 'chevron-right'" [size]="14" />
          </div>
          @if (expanded() === i) {
            <div class="body">
              <div class="grid">
                <div class="field"><label>Label</label><input class="input" [ngModel]="d.label" (ngModelChange)="setLabel(i, $event)" placeholder="e.g. Tree age" /></div>
                <div class="field"><label>Key <span class="subtle">(used in data)</span></label><input class="input mono" [ngModel]="d.key" (ngModelChange)="patch(i, { key: $event })" /></div>
                <div class="field">
                  <label>Type</label>
                  <select class="input" [ngModel]="d.type" (ngModelChange)="patch(i, { type: $event })">
                    <option value="text">Text</option><option value="number">Number</option><option value="choice">Choice from a list</option>
                  </select>
                </div>
                <div class="field chk"><label class="checkbox"><input type="checkbox" [ngModel]="d.required" (ngModelChange)="patch(i, { required: $event })" />Required</label></div>
                @if (d.type === 'number') {
                  <div class="field"><label>Unit</label><input class="input" [ngModel]="d.unit ?? ''" (ngModelChange)="patch(i, { unit: $event || null })" placeholder="e.g. years, kg/ha" /></div>
                  <div class="field"><label>Minimum</label><input type="number" class="input num" [ngModel]="d.min" (ngModelChange)="patch(i, { min: $event === '' || $event === null ? null : +$event })" /></div>
                  <div class="field"><label>Maximum</label><input type="number" class="input num" [ngModel]="d.max" (ngModelChange)="patch(i, { max: $event === '' || $event === null ? null : +$event })" /></div>
                }
                @if (d.type === 'choice') {
                  <div class="field wide">
                    <label>Options</label>
                    <div class="chips-in">
                      @for (c of d.choices; track c) { <span class="ch">{{ c }}<button type="button" (click)="removeChoice(i, c)" aria-label="Remove option"><vc-icon name="x" [size]="11" /></button></span> }
                      <input class="bare" [ngModel]="draft()" (ngModelChange)="draft.set($event)" (keydown.enter)="addChoice(i, $event)" (blur)="addChoice(i)" placeholder="Type an option and press Enter" />
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @empty {
        <div class="empty subtle small">No {{ noun() }}s yet. {{ emptyHint() }}</div>
      }
    </div>
    <button type="button" class="btn btn-secondary btn-sm add" (click)="add()"><vc-icon name="plus" [size]="14" />Add {{ noun() }}</button>
  `, styles: ["/* angular:styles/component:scss;3f12f6386098e640;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\catalogue\\schema-editor.ts */\n:host {\n  display: block;\n}\n.list {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.item {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  background: var(--surface);\n}\n.item.open {\n  border-color: var(--forest-300);\n  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.08);\n}\n.head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  cursor: pointer;\n  min-width: 0;\n}\n.type {\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 22px;\n  border-radius: 5px;\n  font: 600 10.5px var(--mono);\n  background: var(--stone-100);\n  color: var(--stone-600);\n  flex: none;\n}\n.t-number {\n  background: var(--sky-100);\n  color: var(--sky-600);\n}\n.t-choice {\n  background: var(--violet-100);\n  color: var(--violet-600);\n}\n.lbl {\n  font-weight: 500;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.key {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.req {\n  font-size: 11px;\n  padding: 1px 6px;\n  border-radius: 4px;\n  background: var(--clay-50);\n  color: var(--clay-700);\n  border: 1px solid var(--clay-100);\n}\n.unit {\n  font-size: 11px;\n  color: var(--text-3);\n}\n.grow {\n  flex: 1;\n}\n.ib {\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border: 0;\n  border-radius: 5px;\n  background: none;\n  color: var(--stone-500);\n  cursor: pointer;\n}\n.ib:hover:not([disabled]) {\n  background: var(--sand-200);\n  color: var(--stone-800);\n}\n.ib[disabled] {\n  opacity: 0.35;\n  cursor: default;\n}\n.ib.del:hover {\n  background: var(--danger-soft);\n  color: var(--danger);\n}\n.body {\n  padding: 4px 12px 12px;\n  border-top: 1px solid var(--stone-100);\n}\n.grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 10px 12px;\n  margin-top: 10px;\n}\n.grid .wide {\n  grid-column: 1/-1;\n}\n.chk {\n  justify-content: flex-end;\n  padding-bottom: 8px;\n}\n.chips-in {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n  min-height: 38px;\n  padding: 5px 8px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius-sm);\n  background: var(--surface);\n}\n.chips-in:focus-within {\n  border-color: var(--forest-500);\n  box-shadow: var(--focus);\n}\n.ch {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 24px;\n  padding: 0 4px 0 8px;\n  border-radius: 5px;\n  background: var(--violet-100);\n  color: var(--violet-600);\n  font-size: 12.5px;\n}\n.ch button {\n  display: grid;\n  place-items: center;\n  border: 0;\n  background: none;\n  color: inherit;\n  cursor: pointer;\n  padding: 2px;\n  border-radius: 3px;\n  opacity: 0.7;\n}\n.ch button:hover {\n  opacity: 1;\n  background: rgba(91, 71, 168, 0.12);\n}\n.bare {\n  flex: 1;\n  min-width: 140px;\n  border: 0;\n  outline: none;\n  font: inherit;\n  background: none;\n  height: 24px;\n}\n.empty {\n  padding: 14px;\n  border: 1px dashed var(--border-strong);\n  border-radius: var(--radius-sm);\n  text-align: center;\n}\n.add {\n  margin-top: 8px;\n}\n/*# sourceMappingURL=schema-editor.css.map */\n"] }]
  }], null, { defs: [{ type: Input, args: [{ isSignal: true, alias: "defs", required: false }] }, { type: Output, args: ["defsChange"] }], noun: [{ type: Input, args: [{ isSignal: true, alias: "noun", required: false }] }], emptyHint: [{ type: Input, args: [{ isSignal: true, alias: "emptyHint", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SchemaEditor, { className: "SchemaEditor", filePath: "src/app/features/catalogue/schema-editor.ts", lineNumber: 114 });
})();

// src/app/features/catalogue/catalogue.page.ts
var _forTrack0 = ($index, $item) => $item.code;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.key;
function CataloguePage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 62);
    \u0275\u0275listener("click", function CataloguePage_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.defaultsOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 61);
    \u0275\u0275text(2, "Install recommended defaults");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 63);
    \u0275\u0275listener("click", function CataloguePage_Conditional_2_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.tab() === "crops" ? ctx_r1.newCrop() : ctx_r1.newPt());
    });
    \u0275\u0275element(4, "vc-icon", 64);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.tab() === "crops" ? "Add crop" : "Add practice type");
  }
}
function CataloguePage_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function CataloguePage_For_12_Template_button_click_0_listener() {
      const c_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cat.set(ctx_r1.cat() === c_r4 ? "" : c_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.cat() === c_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 3, c_r4));
  }
}
function CataloguePage_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 13);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 7);
  }
}
function CataloguePage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "vc-error", 65)(2, "button", 66);
    \u0275\u0275listener("click", function CataloguePage_Conditional_18_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.load());
    });
    \u0275\u0275text(3, "Try again");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function CataloguePage_Conditional_19_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 63);
    \u0275\u0275listener("click", function CataloguePage_Conditional_19_Conditional_0_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.defaultsOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 61);
    \u0275\u0275text(2, "Install defaults");
    \u0275\u0275elementEnd();
  }
}
function CataloguePage_Conditional_19_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 67);
    \u0275\u0275conditionalCreate(1, CataloguePage_Conditional_19_Conditional_0_Conditional_1_Template, 3, 0, "button", 70);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage() ? 1 : -1);
  }
}
function CataloguePage_Conditional_19_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 68);
  }
}
function CataloguePage_Conditional_19_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "th");
  }
}
function CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 74);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r7.local_name);
  }
}
function CataloguePage_Conditional_19_Conditional_2_For_15_For_14_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 82);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function CataloguePage_Conditional_19_Conditional_2_For_15_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 78);
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, CataloguePage_Conditional_19_Conditional_2_For_15_For_14_Conditional_2_Template, 2, 0, "span", 82);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r8 = ctx.$implicit;
    \u0275\u0275property("title", a_r8.type + (a_r8.required ? ", required" : ""));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r8.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(a_r8.required ? 2 : -1);
  }
}
function CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 79);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+", c_r7.attributes.length - 4, " more");
  }
}
function CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 79);
    \u0275\u0275text(1, "None");
    \u0275\u0275elementEnd();
  }
}
function CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 81)(1, "button", 83);
    \u0275\u0275listener("click", function CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_19_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r9);
      const c_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.editCrop(c_r7));
    });
    \u0275\u0275element(2, "vc-icon", 84);
    \u0275\u0275text(3, "Edit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 83);
    \u0275\u0275listener("click", function CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_19_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r9);
      const c_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.askToggle("crop", c_r7));
    });
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r7.is_active ? "Deactivate" : "Activate");
  }
}
function CataloguePage_Conditional_19_Conditional_2_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 73);
    \u0275\u0275text(3);
    \u0275\u0275conditionalCreate(4, CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_4_Template, 2, 1, "span", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "code", 75);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "vc-chip", 76);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td")(12, "div", 77);
    \u0275\u0275repeaterCreate(13, CataloguePage_Conditional_19_Conditional_2_For_15_For_14_Template, 3, 3, "span", 78, _forTrack2);
    \u0275\u0275conditionalCreate(15, CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_15_Template, 2, 1, "span", 79);
    \u0275\u0275conditionalCreate(16, CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_16_Template, 2, 0, "span", 79);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275element(18, "vc-badge", 80);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(19, CataloguePage_Conditional_19_Conditional_2_For_15_Conditional_19_Template, 6, 2, "td", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("inactive", !c_r7.is_active);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r7.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r7.local_name ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r7.code);
    \u0275\u0275advance(2);
    \u0275\u0275property("cat", c_r7.category);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 11, c_r7.category));
    \u0275\u0275advance(4);
    \u0275\u0275repeater(c_r7.attributes.slice(0, 4));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r7.attributes.length > 4 ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!c_r7.attributes.length ? 16 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", c_r7.is_active ? "active" : "inactive");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage() ? 19 : -1);
  }
}
function CataloguePage_Conditional_19_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69)(1, "table", 71)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Crop");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Attributes asked in the field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, CataloguePage_Conditional_19_Conditional_2_Conditional_12_Template, 1, 0, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "tbody");
    \u0275\u0275repeaterCreate(14, CataloguePage_Conditional_19_Conditional_2_For_15_Template, 20, 13, "tr", 72, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(12);
    \u0275\u0275conditional(ctx_r1.canManage() ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.cropRows());
  }
}
function CataloguePage_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CataloguePage_Conditional_19_Conditional_0_Template, 2, 1, "vc-empty", 67)(1, CataloguePage_Conditional_19_Conditional_1_Template, 1, 0, "vc-empty", 68)(2, CataloguePage_Conditional_19_Conditional_2_Template, 16, 1, "div", 69);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.crops().length ? 0 : !ctx_r1.cropRows().length ? 1 : 2);
  }
}
function CataloguePage_Conditional_20_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 63);
    \u0275\u0275listener("click", function CataloguePage_Conditional_20_Conditional_0_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.defaultsOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 61);
    \u0275\u0275text(2, "Install defaults");
    \u0275\u0275elementEnd();
  }
}
function CataloguePage_Conditional_20_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 85);
    \u0275\u0275conditionalCreate(1, CataloguePage_Conditional_20_Conditional_0_Conditional_1_Template, 3, 0, "button", 70);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage() ? 1 : -1);
  }
}
function CataloguePage_Conditional_20_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 86);
  }
}
function CataloguePage_Conditional_20_Conditional_2_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "th");
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 89);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r11.description);
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 90);
    \u0275\u0275text(1, "All crops");
    \u0275\u0275elementEnd();
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 94);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.cropName(c_r12));
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_13_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 79);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r11 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+", p_r11.crop_codes.length - 3);
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 77);
    \u0275\u0275repeaterCreate(1, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_13_For_2_Template, 2, 1, "span", 94, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(3, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_13_Conditional_3_Template, 2, 1, "span", 79);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(p_r11.crop_codes.slice(0, 3));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r11.crop_codes.length > 3 ? 3 : -1);
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("\xB7 ", p_r11.unit);
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 92);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Optional \xB7 ", p_r11.unit);
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-chip", 93);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, e_r13));
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_ForEmpty_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 81)(1, "button", 83);
    \u0275\u0275listener("click", function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_26_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r14);
      const p_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.editPt(p_r11));
    });
    \u0275\u0275element(2, "vc-icon", 84);
    \u0275\u0275text(3, "Edit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 83);
    \u0275\u0275listener("click", function CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_26_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r14);
      const p_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.askToggle("pt", p_r11));
    });
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r11.is_active ? "Deactivate" : "Activate");
  }
}
function CataloguePage_Conditional_20_Conditional_2_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 88)(2, "div", 73);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "code", 75);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_6_Template, 2, 1, "div", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td")(8, "vc-chip", 76);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275conditionalCreate(12, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_12_Template, 2, 0, "span", 90)(13, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_13_Template, 4, 1, "div", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 91);
    \u0275\u0275conditionalCreate(15, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_15_Template, 4, 1)(16, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_16_Template, 2, 1, "span", 92)(17, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_17_Template, 2, 0, "span", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275repeaterCreate(19, CataloguePage_Conditional_20_Conditional_2_For_21_For_20_Template, 3, 3, "vc-chip", 93, \u0275\u0275repeaterTrackByIdentity, false, CataloguePage_Conditional_20_Conditional_2_For_21_ForEmpty_21_Template, 2, 0, "span", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 87);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td");
    \u0275\u0275element(25, "vc-badge", 80);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(26, CataloguePage_Conditional_20_Conditional_2_For_21_Conditional_26_Template, 6, 2, "td", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("inactive", !p_r11.is_active);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r11.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r11.code);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r11.description ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("cat", p_r11.category);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 13, p_r11.category));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!p_r11.crop_codes.length ? 12 : 13);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(p_r11.requires_quantity ? 15 : p_r11.unit ? 16 : 17);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(p_r11.required_evidence);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r11.fields.length || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r11.is_active ? "active" : "inactive");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage() ? 26 : -1);
  }
}
function CataloguePage_Conditional_20_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69)(1, "table", 71)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Practice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Applies to");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Evidence required");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 87);
    \u0275\u0275text(15, "Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, CataloguePage_Conditional_20_Conditional_2_Conditional_18_Template, 1, 0, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, CataloguePage_Conditional_20_Conditional_2_For_21_Template, 27, 15, "tr", 72, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275conditional(ctx_r1.canManage() ? 18 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.ptRows());
  }
}
function CataloguePage_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CataloguePage_Conditional_20_Conditional_0_Template, 2, 1, "vc-empty", 85)(1, CataloguePage_Conditional_20_Conditional_1_Template, 1, 0, "vc-empty", 86)(2, CataloguePage_Conditional_20_Conditional_2_Template, 22, 1, "div", 69);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.pts().length ? 0 : !ctx_r1.ptRows().length ? 1 : 2);
  }
}
function CataloguePage_For_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r15 = ctx.$implicit;
    \u0275\u0275property("value", c_r15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, c_r15));
  }
}
function CataloguePage_For_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r16 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r16);
  }
}
function CataloguePage_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.saveError());
  }
}
function CataloguePage_For_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r17 = ctx.$implicit;
    \u0275\u0275property("value", c_r17);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, c_r17));
  }
}
function CataloguePage_For_96_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 52);
    \u0275\u0275listener("click", function CataloguePage_For_96_Template_button_click_0_listener() {
      const c_r19 = \u0275\u0275restoreView(_r18).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleIn("crop_codes", c_r19.code));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r19 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.ptD().crop_codes.includes(c_r19.code));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r19.name);
  }
}
function CataloguePage_For_102_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 52);
    \u0275\u0275listener("click", function CataloguePage_For_102_Template_button_click_0_listener() {
      const e_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleIn("required_evidence", e_r21));
    });
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r21 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.ptD().required_evidence.includes(e_r21));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 3, e_r21));
  }
}
function CataloguePage_For_116_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r22 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r22);
  }
}
function CataloguePage_Conditional_117_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.saveError());
  }
}
function CataloguePage_Conditional_124_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("It will no longer be offered for new ", ctx_r1.toggleTarget()?.kind === "crop" ? "fields" : "practice records", ". Existing records keep it, and you can activate it again at any time.");
  }
}
function CataloguePage_Conditional_125_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("It becomes available again for new ", ctx_r1.toggleTarget()?.kind === "crop" ? "fields" : "practice records", ".");
  }
}
var CODE_RE = /^[a-z][a-z0-9_]{1,39}$/;
var EVIDENCE_KINDS = ["photo", "invoice", "receipt", "delivery_note", "geotagged_photo", "document"];
var CataloguePage = class _CataloguePage {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  cropCats = CROP_CATEGORIES;
  ptCats = PRACTICE_CATEGORIES;
  crops = signal(
    [],
    ...ngDevMode ? [{ debugName: "crops" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pts = signal(
    [],
    ...ngDevMode ? [{ debugName: "pts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loading = signal(
    true,
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
  tab = signal(
    "crops",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  q = signal(
    "",
    ...ngDevMode ? [{ debugName: "q" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cat = signal(
    "",
    ...ngDevMode ? [{ debugName: "cat" }] : (
      /* istanbul ignore next */
      []
    )
  );
  showInactive = signal(
    true,
    ...ngDevMode ? [{ debugName: "showInactive" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saving = signal(
    false,
    ...ngDevMode ? [{ debugName: "saving" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saveError = signal(
    null,
    ...ngDevMode ? [{ debugName: "saveError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canManage = computed(
    () => this.auth.can("catalogue.manage"),
    ...ngDevMode ? [{ debugName: "canManage" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabItems = computed(
    () => [
      { key: "crops", label: "Crops", count: this.crops().length },
      { key: "practices", label: "Practice types", count: this.pts().length }
    ],
    ...ngDevMode ? [{ debugName: "tabItems" }] : (
      /* istanbul ignore next */
      []
    )
  );
  activeCrops = computed(
    () => this.crops().filter((c) => c.is_active),
    ...ngDevMode ? [{ debugName: "activeCrops" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropRows = computed(
    () => {
      const q = this.q().toLowerCase().trim();
      return this.crops().filter((c) => (this.showInactive() || c.is_active) && (!this.cat() || c.category === this.cat()) && (!q || `${c.name} ${c.local_name ?? ""} ${c.code}`.toLowerCase().includes(q)));
    },
    ...ngDevMode ? [{ debugName: "cropRows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ptRows = computed(
    () => {
      const q = this.q().toLowerCase().trim();
      return this.pts().filter((p) => (this.showInactive() || p.is_active) && (!this.cat() || p.category === this.cat()) && (!q || `${p.name} ${p.code} ${p.description}`.toLowerCase().includes(q)));
    },
    ...ngDevMode ? [{ debugName: "ptRows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  evidenceKinds = computed(
    () => [.../* @__PURE__ */ new Set([...EVIDENCE_KINDS, ...this.pts().flatMap((p) => p.required_evidence), ...this.ptD().required_evidence])],
    ...ngDevMode ? [{ debugName: "evidenceKinds" }] : (
      /* istanbul ignore next */
      []
    )
  );
  // crop form
  cropOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "cropOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropD = signal(
    { code: "", name: "", local_name: "", category: "field", attributes: [] },
    ...ngDevMode ? [{ debugName: "cropD" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropProblems = computed(
    () => schemaProblems(this.cropD().attributes),
    ...ngDevMode ? [{ debugName: "cropProblems" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropValid = computed(
    () => !!this.cropD().name.trim() && CODE_RE.test(this.cropD().code) && !this.cropProblems().length,
    ...ngDevMode ? [{ debugName: "cropValid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  // practice type form
  ptOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "ptOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ptD = signal(
    this.blankPt(),
    ...ngDevMode ? [{ debugName: "ptD" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ptProblems = computed(
    () => {
      const p = schemaProblems(this.ptD().fields);
      if (this.ptD().requires_quantity && !this.ptD().unit.trim())
        p.unshift("A practice that needs a quantity must say which unit it is measured in.");
      return p;
    },
    ...ngDevMode ? [{ debugName: "ptProblems" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ptValid = computed(
    () => !!this.ptD().name.trim() && CODE_RE.test(this.ptD().code) && !this.ptProblems().length,
    ...ngDevMode ? [{ debugName: "ptValid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  toggleOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "toggleOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  toggleTarget = signal(
    null,
    ...ngDevMode ? [{ debugName: "toggleTarget" }] : (
      /* istanbul ignore next */
      []
    )
  );
  defaultsOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "defaultsOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    let pending = 2;
    const done = () => {
      if (--pending === 0)
        this.loading.set(false);
    };
    const fail = (e) => {
      this.error.set(e.message);
      done();
    };
    this.api.get("/catalogue/crops", { include_inactive: true }).subscribe({ next: (r) => {
      this.crops.set(r);
      done();
    }, error: fail });
    this.api.get("/catalogue/practice-types", { include_inactive: true }).subscribe({ next: (r) => {
      this.pts.set(r);
      done();
    }, error: fail });
  }
  cropName(code) {
    return this.crops().find((c) => c.code === code)?.name ?? code;
  }
  slug(s) {
    const k = s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
    return /^[a-z]/.test(k) ? k : "";
  }
  blankPt() {
    return { code: "", name: "", category: "soil", description: "", crop_codes: [], unit: "", requires_quantity: false, required_evidence: [], fields: [], emission_factor_keys: "" };
  }
  newCrop() {
    this.saveError.set(null);
    this.cropD.set({ code: "", name: "", local_name: "", category: "field", attributes: [] });
    this.cropOpen.set(true);
  }
  editCrop(c) {
    this.saveError.set(null);
    this.cropD.set({ id: c.id, code: c.code, name: c.name, local_name: c.local_name ?? "", category: c.category, attributes: c.attributes.map((a) => __spreadProps(__spreadValues({}, a), { choices: [...a.choices ?? []] })) });
    this.cropOpen.set(true);
  }
  setCrop(p, autoCode = false) {
    this.cropD.update((d) => {
      const n = __spreadValues(__spreadValues({}, d), p);
      if (autoCode && !d.id && (!d.code || d.code === this.slug(d.name)))
        n.code = this.slug(n.name);
      return n;
    });
  }
  saveCrop() {
    const d = this.cropD();
    const body = { name: d.name.trim(), local_name: d.local_name.trim() || null, category: d.category, attributes: d.attributes };
    this.saving.set(true);
    this.saveError.set(null);
    const req = d.id ? this.api.patch(`/catalogue/crops/${d.id}`, body) : this.api.post("/catalogue/crops", __spreadProps(__spreadValues({}, body), { code: d.code }));
    req.subscribe({
      next: (c) => {
        this.saving.set(false);
        this.cropOpen.set(false);
        this.toast.success(d.id ? `${c.name} updated` : `${c.name} added`);
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.saveError.set(e.message);
      }
    });
  }
  newPt() {
    this.saveError.set(null);
    this.ptD.set(this.blankPt());
    this.ptOpen.set(true);
  }
  editPt(p) {
    this.saveError.set(null);
    this.ptD.set({
      id: p.id,
      code: p.code,
      name: p.name,
      category: p.category,
      description: p.description ?? "",
      crop_codes: [...p.crop_codes],
      unit: p.unit ?? "",
      requires_quantity: p.requires_quantity,
      required_evidence: [...p.required_evidence],
      fields: p.fields.map((a) => __spreadProps(__spreadValues({}, a), { choices: [...a.choices ?? []] })),
      emission_factor_keys: p.emission_factor_keys.join(", ")
    });
    this.ptOpen.set(true);
  }
  setPt(p, autoCode = false) {
    this.ptD.update((d) => {
      const n = __spreadValues(__spreadValues({}, d), p);
      if (autoCode && !d.id && (!d.code || d.code === this.slug(d.name)))
        n.code = this.slug(n.name);
      return n;
    });
  }
  toggleIn(key, v) {
    const cur = this.ptD()[key];
    this.setPt({ [key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
  }
  savePt() {
    const d = this.ptD();
    const body = {
      name: d.name.trim(),
      category: d.category,
      description: d.description.trim(),
      crop_codes: d.crop_codes,
      unit: d.unit.trim() || null,
      requires_quantity: d.requires_quantity,
      required_evidence: d.required_evidence,
      fields: d.fields,
      emission_factor_keys: d.emission_factor_keys.split(",").map((s) => s.trim()).filter(Boolean)
    };
    this.saving.set(true);
    this.saveError.set(null);
    const req = d.id ? this.api.patch(`/catalogue/practice-types/${d.id}`, body) : this.api.post("/catalogue/practice-types", __spreadProps(__spreadValues({}, body), { code: d.code }));
    req.subscribe({
      next: (p) => {
        this.saving.set(false);
        this.ptOpen.set(false);
        this.toast.success(d.id ? `${p.name} updated` : `${p.name} added`);
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.saveError.set(e.message);
      }
    });
  }
  askToggle(kind, x) {
    this.toggleTarget.set({ kind, id: x.id, name: x.name, active: x.is_active });
    this.toggleOpen.set(true);
  }
  doToggle() {
    const t = this.toggleTarget();
    const path = t.kind === "crop" ? `/catalogue/crops/${t.id}` : `/catalogue/practice-types/${t.id}`;
    this.saving.set(true);
    this.api.patch(path, { is_active: !t.active }).subscribe({
      next: () => {
        this.saving.set(false);
        this.toggleOpen.set(false);
        this.toast.success(`${t.name} ${t.active ? "deactivated" : "activated"}`);
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.toggleOpen.set(false);
        this.toast.apiError(e);
      }
    });
  }
  installDefaults() {
    this.saving.set(true);
    this.api.post("/catalogue/install-defaults").subscribe({
      next: (r) => {
        this.saving.set(false);
        this.defaultsOpen.set(false);
        const n = r.crops_added.length + r.practice_types_added.length;
        if (n)
          this.toast.success("Defaults installed", `${r.crops_added.length} crop${r.crops_added.length === 1 ? "" : "s"} and ${r.practice_types_added.length} practice type${r.practice_types_added.length === 1 ? "" : "s"} added.`);
        else
          this.toast.info("Already up to date", "You already have every recommended crop and practice type.");
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.toast.apiError(e, "Couldn't install the defaults");
      }
    });
  }
  static \u0275fac = function CataloguePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CataloguePage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CataloguePage, selectors: [["vc-catalogue-page"]], decls: 145, vars: 50, consts: [["title", "Crops & practices catalogue", "eyebrow", "Land", "subtitle", "The crops you work with and the practices farmers can record. Attributes you define here become the questions asked in the field app."], ["actions", ""], [3, "activeChange", "tabs", "active"], [1, "filters"], [1, "search"], ["name", "search", 3, "size"], [1, "input", 3, "ngModelChange", "placeholder", "ngModel"], [1, "cats"], ["type", "button", 1, "cat", 3, "click"], ["type", "button", 1, "cat", 3, "on"], [1, "checkbox", "small"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "card"], [3, "rows"], [1, "card-body"], ["width", "680px", "subtitle", "Attributes are the details collected for every field growing this crop.", 3, "openChange", "open", "title"], [1, "stack"], [1, "form-grid"], [1, "field"], ["for", "c-name"], ["id", "c-name", "placeholder", "e.g. Finger millet", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "c-local"], [1, "subtle"], ["id", "c-local", "placeholder", "e.g. Ragi", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "c-code"], ["id", "c-code", 1, "input", "mono", 3, "ngModelChange", "ngModel", "disabled"], [1, "hint"], ["for", "c-cat"], ["id", "c-cat", 1, "input", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "label", "sec"], ["noun", "attribute", "emptyHint", "For example tree age, variety or irrigation.", 3, "defsChange", "defs"], [1, "err", "small"], ["tone", "danger", "icon", "alert"], ["footer", "", 1, "ft"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["width", "760px", "subtitle", "Defines what is asked when this practice is recorded, and which evidence proves it.", 3, "openChange", "open", "title"], ["for", "t-name"], ["id", "t-name", "placeholder", "e.g. Cover cropping", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "t-code"], ["id", "t-code", 1, "input", "mono", 3, "ngModelChange", "ngModel", "disabled"], ["for", "t-cat"], ["id", "t-cat", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "t-unit"], ["id", "t-unit", "placeholder", "e.g. kg, t/ha, L", 1, "input", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], [1, "checkbox"], ["for", "t-desc"], ["id", "t-desc", "rows", "2", "placeholder", "Plain-language explanation shown to field staff", 1, "input", 3, "ngModelChange", "ngModel"], [1, "label"], [1, "pick"], ["type", "button", 1, "pk", 3, "click"], ["type", "button", 1, "pk", 3, "on"], ["for", "t-ef"], ["id", "t-ef", "placeholder", "e.g. n2o_direct_synthetic", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["noun", "detail", "emptyHint", "For example the fertiliser product or the cover crop species.", 3, "defsChange", "defs"], ["width", "480px", 3, "openChange", "open", "title"], [1, "btn", 3, "click", "disabled"], ["title", "Install recommended defaults?", "width", "520px", 3, "openChange", "open"], [1, "bul"], ["name", "sparkles"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["title", "Couldn't load the catalogue", 3, "message"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["icon", "wheat", "title", "No crops yet", "text", "Install the recommended defaults for common Indian crops, or add your own."], ["icon", "search", "title", "No crops match", "text", "Try another search or category."], [1, "table-wrap"], [1, "btn", "btn-primary"], [1, "table"], [3, "inactive"], [1, "nm"], [1, "local"], [1, "code"], [3, "cat"], [1, "attrs"], [1, "attr", 3, "title"], [1, "subtle", "small"], [3, "status"], [1, "num", "nowrap"], [1, "star"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "pencil", 3, "size"], ["icon", "sprout", "title", "No practice types yet", "text", "Install the recommended defaults (tillage, residue, nutrients, water, trees\u2026) or add your own."], ["icon", "search", "title", "No practices match", "text", "Try another search or category."], [1, "num"], [1, "pcell"], [1, "desc"], [1, "muted", "small"], [1, "nowrap"], [1, "muted"], ["tone", "amber"], [1, "attr"]], template: function CataloguePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275elementContainerStart(1, 1);
      \u0275\u0275conditionalCreate(2, CataloguePage_Conditional_2_Template, 6, 1);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "vc-tabs", 2);
      \u0275\u0275twoWayListener("activeChange", function CataloguePage_Template_vc_tabs_activeChange_3_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tab, $event) || (ctx.tab = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 3)(5, "div", 4);
      \u0275\u0275element(6, "vc-icon", 5);
      \u0275\u0275elementStart(7, "input", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_7_listener($event) {
        return ctx.q.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 7)(9, "button", 8);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_9_listener() {
        return ctx.cat.set("");
      });
      \u0275\u0275text(10, "All");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(11, CataloguePage_For_12_Template, 3, 5, "button", 9, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "label", 10)(14, "input", 11);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_14_listener($event) {
        return ctx.showInactive.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275text(15, "Show inactive");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "section", 12);
      \u0275\u0275conditionalCreate(17, CataloguePage_Conditional_17_Template, 1, 1, "vc-loading", 13)(18, CataloguePage_Conditional_18_Template, 4, 1, "div", 14)(19, CataloguePage_Conditional_19_Template, 3, 1)(20, CataloguePage_Conditional_20_Template, 3, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "vc-modal", 15);
      \u0275\u0275twoWayListener("openChange", function CataloguePage_Template_vc_modal_openChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.cropOpen, $event) || (ctx.cropOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(22, "div", 16)(23, "div", 17)(24, "div", 18)(25, "label", 19);
      \u0275\u0275text(26, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "input", 20);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_27_listener($event) {
        return ctx.setCrop({ name: $event }, true);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div", 18)(29, "label", 21);
      \u0275\u0275text(30, "Local name ");
      \u0275\u0275elementStart(31, "span", 22);
      \u0275\u0275text(32, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "input", 23);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_33_listener($event) {
        return ctx.setCrop({ local_name: $event });
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "div", 18)(35, "label", 24);
      \u0275\u0275text(36, "Code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "input", 25);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_37_listener($event) {
        return ctx.setCrop({ code: $event });
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "span", 26);
      \u0275\u0275text(39);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "div", 18)(41, "label", 27);
      \u0275\u0275text(42, "Category");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "select", 28);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_select_ngModelChange_43_listener($event) {
        return ctx.setCrop({ category: $event });
      });
      \u0275\u0275repeaterCreate(44, CataloguePage_For_45_Template, 3, 4, "option", 29, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(46, "div")(47, "div", 30);
      \u0275\u0275text(48, "Field attributes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "vc-schema-editor", 31);
      \u0275\u0275listener("defsChange", function CataloguePage_Template_vc_schema_editor_defsChange_49_listener($event) {
        return ctx.setCrop({ attributes: $event });
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275repeaterCreate(50, CataloguePage_For_51_Template, 2, 1, "div", 32, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275conditionalCreate(52, CataloguePage_Conditional_52_Template, 2, 1, "vc-callout", 33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 34)(54, "button", 35);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_54_listener() {
        return ctx.cropOpen.set(false);
      });
      \u0275\u0275text(55, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "button", 36);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_56_listener() {
        return ctx.saveCrop();
      });
      \u0275\u0275text(57);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(58, "vc-modal", 37);
      \u0275\u0275twoWayListener("openChange", function CataloguePage_Template_vc_modal_openChange_58_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.ptOpen, $event) || (ctx.ptOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(59, "div", 16)(60, "div", 17)(61, "div", 18)(62, "label", 38);
      \u0275\u0275text(63, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "input", 39);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_64_listener($event) {
        return ctx.setPt({ name: $event }, true);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(65, "div", 18)(66, "label", 40);
      \u0275\u0275text(67, "Code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "input", 41);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_68_listener($event) {
        return ctx.setPt({ code: $event });
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(69, "div", 18)(70, "label", 42);
      \u0275\u0275text(71, "Category");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "select", 43);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_select_ngModelChange_72_listener($event) {
        return ctx.setPt({ category: $event });
      });
      \u0275\u0275repeaterCreate(73, CataloguePage_For_74_Template, 3, 4, "option", 29, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(75, "div", 18)(76, "label", 44);
      \u0275\u0275text(77, "Unit ");
      \u0275\u0275elementStart(78, "span", 22);
      \u0275\u0275text(79, "(if measured)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(80, "input", 45);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_80_listener($event) {
        return ctx.setPt({ unit: $event });
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(81, "div", 46)(82, "label", 47)(83, "input", 11);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_83_listener($event) {
        return ctx.setPt({ requires_quantity: $event });
      });
      \u0275\u0275elementEnd();
      \u0275\u0275text(84, "A quantity must be entered every time");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(85, "div", 46)(86, "label", 48);
      \u0275\u0275text(87, "Description");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "textarea", 49);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_textarea_ngModelChange_88_listener($event) {
        return ctx.setPt({ description: $event });
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(89, "div", 46)(90, "span", 50);
      \u0275\u0275text(91, "Applies to crops");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(92, "div", 51)(93, "button", 52);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_93_listener() {
        return ctx.setPt({ crop_codes: [] });
      });
      \u0275\u0275text(94, "All crops");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(95, CataloguePage_For_96_Template, 2, 3, "button", 53, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(97, "div", 46)(98, "span", 50);
      \u0275\u0275text(99, "Evidence required");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(100, "div", 51);
      \u0275\u0275repeaterCreate(101, CataloguePage_For_102_Template, 3, 5, "button", 53, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(103, "span", 26);
      \u0275\u0275text(104, "Records without these are flagged as missing evidence.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(105, "div", 46)(106, "label", 54);
      \u0275\u0275text(107, "Emission factor keys ");
      \u0275\u0275elementStart(108, "span", 22);
      \u0275\u0275text(109, "(optional, comma-separated)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(110, "input", 55);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CataloguePage_Template_input_ngModelChange_110_listener($event) {
        return ctx.setPt({ emission_factor_keys: $event });
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(111, "div")(112, "div", 30);
      \u0275\u0275text(113, "Details asked when recording");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(114, "vc-schema-editor", 56);
      \u0275\u0275listener("defsChange", function CataloguePage_Template_vc_schema_editor_defsChange_114_listener($event) {
        return ctx.setPt({ fields: $event });
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275repeaterCreate(115, CataloguePage_For_116_Template, 2, 1, "div", 32, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275conditionalCreate(117, CataloguePage_Conditional_117_Template, 2, 1, "vc-callout", 33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(118, "div", 34)(119, "button", 35);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_119_listener() {
        return ctx.ptOpen.set(false);
      });
      \u0275\u0275text(120, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(121, "button", 36);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_121_listener() {
        return ctx.savePt();
      });
      \u0275\u0275text(122);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(123, "vc-modal", 57);
      \u0275\u0275twoWayListener("openChange", function CataloguePage_Template_vc_modal_openChange_123_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.toggleOpen, $event) || (ctx.toggleOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(124, CataloguePage_Conditional_124_Template, 2, 1, "p")(125, CataloguePage_Conditional_125_Template, 2, 1, "p");
      \u0275\u0275elementStart(126, "div", 34)(127, "button", 35);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_127_listener() {
        return ctx.toggleOpen.set(false);
      });
      \u0275\u0275text(128, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(129, "button", 58);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_129_listener() {
        return ctx.doToggle();
      });
      \u0275\u0275text(130);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(131, "vc-modal", 59);
      \u0275\u0275twoWayListener("openChange", function CataloguePage_Template_vc_modal_openChange_131_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.defaultsOpen, $event) || (ctx.defaultsOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(132, "p");
      \u0275\u0275text(133, "Adds a starter set of common crops (field crops, horticulture, plantations, rice) and regenerative practice types with sensible attributes and evidence rules.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(134, "ul", 60)(135, "li");
      \u0275\u0275text(136, "Only items you don't already have are added \u2014 nothing existing is changed.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(137, "li");
      \u0275\u0275text(138, "You can edit or deactivate anything afterwards.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(139, "div", 34)(140, "button", 35);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_140_listener() {
        return ctx.defaultsOpen.set(false);
      });
      \u0275\u0275text(141, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(142, "button", 36);
      \u0275\u0275listener("click", function CataloguePage_Template_button_click_142_listener() {
        return ctx.installDefaults();
      });
      \u0275\u0275element(143, "vc-icon", 61);
      \u0275\u0275text(144);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.canManage() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("tabs", ctx.tabItems());
      \u0275\u0275twoWayProperty("active", ctx.tab);
      \u0275\u0275advance(3);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance();
      \u0275\u0275property("placeholder", ctx.tab() === "crops" ? "Search crops\u2026" : "Search practices\u2026")("ngModel", ctx.q());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275classProp("on", !ctx.cat());
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.tab() === "crops" ? ctx.cropCats : ctx.ptCats);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngModel", ctx.showInactive());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.loading() ? 17 : ctx.error() ? 18 : ctx.tab() === "crops" ? 19 : 20);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.cropOpen);
      \u0275\u0275property("title", ctx.cropD().id ? "Edit crop" : "Add a crop");
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.cropD().name);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.cropD().local_name);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.cropD().code)("disabled", !!ctx.cropD().id);
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.cropD().id ? "Codes can't change once records use them." : "Lower-case letters, digits and _.");
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.cropD().category);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.cropCats);
      \u0275\u0275advance(5);
      \u0275\u0275property("defs", ctx.cropD().attributes);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.cropProblems());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.saveError() ? 52 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.cropValid() || ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Saving\u2026" : ctx.cropD().id ? "Save changes" : "Add crop");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.ptOpen);
      \u0275\u0275property("title", ctx.ptD().id ? "Edit practice type" : "Add a practice type");
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.ptD().name);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.ptD().code)("disabled", !!ctx.ptD().id);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.ptD().category);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.ptCats);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.ptD().unit);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275property("ngModel", ctx.ptD().requires_quantity);
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275property("ngModel", ctx.ptD().description);
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275classProp("on", !ctx.ptD().crop_codes.length);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.activeCrops());
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.evidenceKinds());
      \u0275\u0275advance(9);
      \u0275\u0275property("ngModel", ctx.ptD().emission_factor_keys);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("defs", ctx.ptD().fields);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.ptProblems());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.saveError() ? 117 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.ptValid() || ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Saving\u2026" : ctx.ptD().id ? "Save changes" : "Add practice type");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.toggleOpen);
      \u0275\u0275property("title", ctx.toggleTarget()?.active ? "Deactivate " + ctx.toggleTarget()?.name + "?" : "Activate " + ctx.toggleTarget()?.name + "?");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.toggleTarget()?.active ? 124 : 125);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("btn-danger", ctx.toggleTarget()?.active)("btn-primary", !ctx.toggleTarget()?.active);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.toggleTarget()?.active ? "Deactivate" : "Activate", " ");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.defaultsOpen);
      \u0275\u0275advance(11);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.saving() ? "Installing\u2026" : "Install defaults");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, PageHeader, Tabs, Loading, ErrorBox, Empty, Badge, Modal, Callout, Icon, Chip, SchemaEditor, HumanPipe], styles: ["\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 0 1 300px;\n  min-width: 200px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.cats[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  flex: 1;\n}\n.cat[_ngcontent-%COMP%] {\n  height: 30px;\n  padding: 0 11px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 999px;\n  background: var(--%NS%surface);\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.cat[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.cat.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  border-color: var(--%NS%forest-600);\n  color: #fff;\n}\n.nm[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.local[_ngcontent-%COMP%] {\n  margin-left: 8px;\n  font-weight: 400;\n  color: var(--%NS%text-3);\n  font-size: 12.5px;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.desc[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n  margin-top: 3px;\n  max-width: 340px;\n  line-height: 1.4;\n}\n.pcell[_ngcontent-%COMP%] {\n  max-width: 360px;\n}\n.attrs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.attr[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 2px 7px;\n  border-radius: 5px;\n  background: var(--%NS%sand-100);\n  border: 1px solid var(--%NS%border);\n  color: var(--%NS%stone-700);\n}\n.star[_ngcontent-%COMP%] {\n  color: var(--%NS%clay-600);\n  margin-left: 1px;\n}\ntr.inactive[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  opacity: 0.6;\n}\ntr.inactive[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n  opacity: 1;\n}\ntd[_ngcontent-%COMP%]   vc-chip[_ngcontent-%COMP%]    + vc-chip[_ngcontent-%COMP%] {\n  margin-left: 4px;\n}\n.sec[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n  display: block;\n}\n.pick[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.pk[_ngcontent-%COMP%] {\n  height: 30px;\n  padding: 0 11px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 7px;\n  background: var(--%NS%surface);\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.pk[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.pk.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  box-shadow: 0 0 0 1px var(--%NS%forest-500) inset;\n}\n.err[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.bul[_ngcontent-%COMP%] {\n  margin: 10px 0 0;\n  padding-left: 18px;\n  color: var(--%NS%stone-700);\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=catalogue.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CataloguePage, [{
    type: Component,
    args: [{ selector: "vc-catalogue-page", imports: [FormsModule, PageHeader, Tabs, Loading, ErrorBox, Empty, Badge, Modal, Callout, Icon, Chip, SchemaEditor, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Crops & practices catalogue" eyebrow="Land"
      subtitle="The crops you work with and the practices farmers can record. Attributes you define here become the questions asked in the field app.">
 <ng-container actions>
      @if (canManage()) {
        <button class="btn btn-secondary" (click)="defaultsOpen.set(true)"><vc-icon name="sparkles" />Install recommended defaults</button>
        <button class="btn btn-primary" (click)="tab() === 'crops' ? newCrop() : newPt()"><vc-icon name="plus" />{{ tab() === 'crops' ? 'Add crop' : 'Add practice type' }}</button>
      }
      </ng-container>
    </vc-page-header>

    <vc-tabs [tabs]="tabItems()" [(active)]="tab" />

    <div class="filters">
      <div class="search"><vc-icon name="search" [size]="15" /><input class="input" [placeholder]="tab() === 'crops' ? 'Search crops\u2026' : 'Search practices\u2026'" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
      <div class="cats">
        <button type="button" class="cat" [class.on]="!cat()" (click)="cat.set('')">All</button>
        @for (c of tab() === 'crops' ? cropCats : ptCats; track c) {
          <button type="button" class="cat" [class.on]="cat() === c" (click)="cat.set(cat() === c ? '' : c)">{{ c | human }}</button>
        }
      </div>
      <label class="checkbox small"><input type="checkbox" [ngModel]="showInactive()" (ngModelChange)="showInactive.set($event)" />Show inactive</label>
    </div>

    <section class="card">
      @if (loading()) { <vc-loading [rows]="7" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load the catalogue" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div> }
      @else if (tab() === 'crops') {
        @if (!crops().length) {
          <vc-empty icon="wheat" title="No crops yet" text="Install the recommended defaults for common Indian crops, or add your own.">
            @if (canManage()) { <button class="btn btn-primary" (click)="defaultsOpen.set(true)"><vc-icon name="sparkles" />Install defaults</button> }
          </vc-empty>
        } @else if (!cropRows().length) {
          <vc-empty icon="search" title="No crops match" text="Try another search or category." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Crop</th><th>Category</th><th>Attributes asked in the field</th><th>Status</th>@if (canManage()) { <th></th> }</tr></thead>
              <tbody>
                @for (c of cropRows(); track c.id) {
                  <tr [class.inactive]="!c.is_active">
                    <td><div class="nm">{{ c.name }}@if (c.local_name) { <span class="local">{{ c.local_name }}</span> }</div><code class="code">{{ c.code }}</code></td>
                    <td><vc-chip [cat]="c.category">{{ c.category | human }}</vc-chip></td>
                    <td>
                      <div class="attrs">
                        @for (a of c.attributes.slice(0, 4); track a.key) { <span class="attr" [title]="a.type + (a.required ? ', required' : '')">{{ a.label }}@if (a.required) {<span class="star">*</span>}</span> }
                        @if (c.attributes.length > 4) { <span class="subtle small">+{{ c.attributes.length - 4 }} more</span> }
                        @if (!c.attributes.length) { <span class="subtle small">None</span> }
                      </div>
                    </td>
                    <td><vc-badge [status]="c.is_active ? 'active' : 'inactive'" /></td>
                    @if (canManage()) {
                      <td class="num nowrap">
                        <button class="btn btn-ghost btn-sm" (click)="editCrop(c)"><vc-icon name="pencil" [size]="14" />Edit</button>
                        <button class="btn btn-ghost btn-sm" (click)="askToggle('crop', c)">{{ c.is_active ? 'Deactivate' : 'Activate' }}</button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      } @else {
        @if (!pts().length) {
          <vc-empty icon="sprout" title="No practice types yet" text="Install the recommended defaults (tillage, residue, nutrients, water, trees\u2026) or add your own.">
            @if (canManage()) { <button class="btn btn-primary" (click)="defaultsOpen.set(true)"><vc-icon name="sparkles" />Install defaults</button> }
          </vc-empty>
        } @else if (!ptRows().length) {
          <vc-empty icon="search" title="No practices match" text="Try another search or category." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Practice</th><th>Category</th><th>Applies to</th><th>Quantity</th><th>Evidence required</th><th class="num">Details</th><th>Status</th>@if (canManage()) { <th></th> }</tr></thead>
              <tbody>
                @for (p of ptRows(); track p.id) {
                  <tr [class.inactive]="!p.is_active">
                    <td class="pcell"><div class="nm">{{ p.name }}</div><code class="code">{{ p.code }}</code>@if (p.description) { <div class="desc">{{ p.description }}</div> }</td>
                    <td><vc-chip [cat]="p.category">{{ p.category | human }}</vc-chip></td>
                    <td>
                      @if (!p.crop_codes.length) { <span class="muted small">All crops</span> }
                      @else { <div class="attrs">@for (c of p.crop_codes.slice(0, 3); track c) { <span class="attr">{{ cropName(c) }}</span> }@if (p.crop_codes.length > 3) { <span class="subtle small">+{{ p.crop_codes.length - 3 }}</span> }</div> }
                    </td>
                    <td class="nowrap">@if (p.requires_quantity) { <span>Required</span> <span class="subtle">\xB7 {{ p.unit }}</span> } @else if (p.unit) { <span class="muted">Optional \xB7 {{ p.unit }}</span> } @else { <span class="subtle">\u2014</span> }</td>
                    <td>@for (e of p.required_evidence; track e) { <vc-chip tone="amber">{{ e | human }}</vc-chip> } @empty { <span class="subtle">\u2014</span> }</td>
                    <td class="num">{{ p.fields.length || '\u2014' }}</td>
                    <td><vc-badge [status]="p.is_active ? 'active' : 'inactive'" /></td>
                    @if (canManage()) {
                      <td class="num nowrap">
                        <button class="btn btn-ghost btn-sm" (click)="editPt(p)"><vc-icon name="pencil" [size]="14" />Edit</button>
                        <button class="btn btn-ghost btn-sm" (click)="askToggle('pt', p)">{{ p.is_active ? 'Deactivate' : 'Activate' }}</button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </section>

    <!-- crop modal -->
    <vc-modal [(open)]="cropOpen" [title]="cropD().id ? 'Edit crop' : 'Add a crop'" width="680px"
      subtitle="Attributes are the details collected for every field growing this crop.">
      <div class="stack">
        <div class="form-grid">
          <div class="field"><label for="c-name">Name</label><input id="c-name" class="input" [ngModel]="cropD().name" (ngModelChange)="setCrop({ name: $event }, true)" placeholder="e.g. Finger millet" /></div>
          <div class="field"><label for="c-local">Local name <span class="subtle">(optional)</span></label><input id="c-local" class="input" [ngModel]="cropD().local_name" (ngModelChange)="setCrop({ local_name: $event })" placeholder="e.g. Ragi" /></div>
          <div class="field">
            <label for="c-code">Code</label>
            <input id="c-code" class="input mono" [ngModel]="cropD().code" (ngModelChange)="setCrop({ code: $event })" [disabled]="!!cropD().id" />
            <span class="hint">{{ cropD().id ? "Codes can't change once records use them." : 'Lower-case letters, digits and _.' }}</span>
          </div>
          <div class="field">
            <label for="c-cat">Category</label>
            <select id="c-cat" class="input" [ngModel]="cropD().category" (ngModelChange)="setCrop({ category: $event })">
              @for (c of cropCats; track c) { <option [value]="c">{{ c | human }}</option> }
            </select>
          </div>
        </div>
        <div>
          <div class="label sec">Field attributes</div>
          <vc-schema-editor [defs]="cropD().attributes" (defsChange)="setCrop({ attributes: $event })" noun="attribute" emptyHint="For example tree age, variety or irrigation." />
        </div>
        @for (p of cropProblems(); track p) { <div class="err small">{{ p }}</div> }
        @if (saveError()) { <vc-callout tone="danger" icon="alert">{{ saveError() }}</vc-callout> }
      </div>
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="cropOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!cropValid() || saving()" (click)="saveCrop()">{{ saving() ? 'Saving\u2026' : cropD().id ? 'Save changes' : 'Add crop' }}</button>
      </div>
    </vc-modal>

    <!-- practice type modal -->
    <vc-modal [(open)]="ptOpen" [title]="ptD().id ? 'Edit practice type' : 'Add a practice type'" width="760px"
      subtitle="Defines what is asked when this practice is recorded, and which evidence proves it.">
      <div class="stack">
        <div class="form-grid">
          <div class="field"><label for="t-name">Name</label><input id="t-name" class="input" [ngModel]="ptD().name" (ngModelChange)="setPt({ name: $event }, true)" placeholder="e.g. Cover cropping" /></div>
          <div class="field">
            <label for="t-code">Code</label>
            <input id="t-code" class="input mono" [ngModel]="ptD().code" (ngModelChange)="setPt({ code: $event })" [disabled]="!!ptD().id" />
          </div>
          <div class="field">
            <label for="t-cat">Category</label>
            <select id="t-cat" class="input" [ngModel]="ptD().category" (ngModelChange)="setPt({ category: $event })">
              @for (c of ptCats; track c) { <option [value]="c">{{ c | human }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="t-unit">Unit <span class="subtle">(if measured)</span></label>
            <input id="t-unit" class="input" [ngModel]="ptD().unit" (ngModelChange)="setPt({ unit: $event })" placeholder="e.g. kg, t/ha, L" />
          </div>
          <div class="field span-2">
            <label class="checkbox"><input type="checkbox" [ngModel]="ptD().requires_quantity" (ngModelChange)="setPt({ requires_quantity: $event })" />A quantity must be entered every time</label>
          </div>
          <div class="field span-2"><label for="t-desc">Description</label><textarea id="t-desc" class="input" rows="2" [ngModel]="ptD().description" (ngModelChange)="setPt({ description: $event })" placeholder="Plain-language explanation shown to field staff"></textarea></div>
          <div class="field span-2">
            <span class="label">Applies to crops</span>
            <div class="pick">
              <button type="button" class="pk" [class.on]="!ptD().crop_codes.length" (click)="setPt({ crop_codes: [] })">All crops</button>
              @for (c of activeCrops(); track c.code) {
                <button type="button" class="pk" [class.on]="ptD().crop_codes.includes(c.code)" (click)="toggleIn('crop_codes', c.code)">{{ c.name }}</button>
              }
            </div>
          </div>
          <div class="field span-2">
            <span class="label">Evidence required</span>
            <div class="pick">
              @for (e of evidenceKinds(); track e) {
                <button type="button" class="pk" [class.on]="ptD().required_evidence.includes(e)" (click)="toggleIn('required_evidence', e)">{{ e | human }}</button>
              }
            </div>
            <span class="hint">Records without these are flagged as missing evidence.</span>
          </div>
          <div class="field span-2">
            <label for="t-ef">Emission factor keys <span class="subtle">(optional, comma-separated)</span></label>
            <input id="t-ef" class="input mono" [ngModel]="ptD().emission_factor_keys" (ngModelChange)="setPt({ emission_factor_keys: $event })" placeholder="e.g. n2o_direct_synthetic" />
          </div>
        </div>
        <div>
          <div class="label sec">Details asked when recording</div>
          <vc-schema-editor [defs]="ptD().fields" (defsChange)="setPt({ fields: $event })" noun="detail" emptyHint="For example the fertiliser product or the cover crop species." />
        </div>
        @for (p of ptProblems(); track p) { <div class="err small">{{ p }}</div> }
        @if (saveError()) { <vc-callout tone="danger" icon="alert">{{ saveError() }}</vc-callout> }
      </div>
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="ptOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!ptValid() || saving()" (click)="savePt()">{{ saving() ? 'Saving\u2026' : ptD().id ? 'Save changes' : 'Add practice type' }}</button>
      </div>
    </vc-modal>

    <!-- activate / deactivate -->
    <vc-modal [(open)]="toggleOpen" [title]="toggleTarget()?.active ? 'Deactivate ' + toggleTarget()?.name + '?' : 'Activate ' + toggleTarget()?.name + '?'" width="480px">
      @if (toggleTarget()?.active) {
        <p>It will no longer be offered for new {{ toggleTarget()?.kind === 'crop' ? 'fields' : 'practice records' }}. Existing records keep it, and you can activate it again at any time.</p>
      } @else {
        <p>It becomes available again for new {{ toggleTarget()?.kind === 'crop' ? 'fields' : 'practice records' }}.</p>
      }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="toggleOpen.set(false)">Cancel</button>
        <button class="btn" [class.btn-danger]="toggleTarget()?.active" [class.btn-primary]="!toggleTarget()?.active" [disabled]="saving()" (click)="doToggle()">
          {{ toggleTarget()?.active ? 'Deactivate' : 'Activate' }}
        </button>
      </div>
    </vc-modal>

    <!-- defaults -->
    <vc-modal [(open)]="defaultsOpen" title="Install recommended defaults?" width="520px">
      <p>Adds a starter set of common crops (field crops, horticulture, plantations, rice) and regenerative practice types with sensible attributes and evidence rules.</p>
      <ul class="bul">
        <li>Only items you don't already have are added \u2014 nothing existing is changed.</li>
        <li>You can edit or deactivate anything afterwards.</li>
      </ul>
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="defaultsOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving()" (click)="installDefaults()"><vc-icon name="sparkles" />{{ saving() ? 'Installing\u2026' : 'Install defaults' }}</button>
      </div>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;a5f40b930b328fc7;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\catalogue\\catalogue.page.ts */\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.search {\n  position: relative;\n  flex: 0 1 300px;\n  min-width: 200px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.cats {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  flex: 1;\n}\n.cat {\n  height: 30px;\n  padding: 0 11px;\n  border: 1px solid var(--border-strong);\n  border-radius: 999px;\n  background: var(--surface);\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.cat:hover {\n  border-color: var(--stone-400);\n}\n.cat.on {\n  background: var(--forest-600);\n  border-color: var(--forest-600);\n  color: #fff;\n}\n.nm {\n  font-weight: 500;\n}\n.local {\n  margin-left: 8px;\n  font-weight: 400;\n  color: var(--text-3);\n  font-size: 12.5px;\n}\n.code {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.desc {\n  font-size: 12px;\n  color: var(--text-2);\n  margin-top: 3px;\n  max-width: 340px;\n  line-height: 1.4;\n}\n.pcell {\n  max-width: 360px;\n}\n.attrs {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.attr {\n  font-size: 12px;\n  padding: 2px 7px;\n  border-radius: 5px;\n  background: var(--sand-100);\n  border: 1px solid var(--border);\n  color: var(--stone-700);\n}\n.star {\n  color: var(--clay-600);\n  margin-left: 1px;\n}\ntr.inactive td {\n  opacity: 0.6;\n}\ntr.inactive td:last-child {\n  opacity: 1;\n}\ntd vc-chip + vc-chip {\n  margin-left: 4px;\n}\n.sec {\n  margin-bottom: 8px;\n  display: block;\n}\n.pick {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.pk {\n  height: 30px;\n  padding: 0 11px;\n  border: 1px solid var(--border-strong);\n  border-radius: 7px;\n  background: var(--surface);\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.pk:hover {\n  border-color: var(--stone-400);\n}\n.pk.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  color: var(--forest-700);\n  box-shadow: 0 0 0 1px var(--forest-500) inset;\n}\n.err {\n  color: var(--danger);\n}\n.bul {\n  margin: 10px 0 0;\n  padding-left: 18px;\n  color: var(--stone-700);\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.ft {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=catalogue.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CataloguePage, { className: "CataloguePage", filePath: "src/app/features/catalogue/catalogue.page.ts", lineNumber: 276 });
})();

// src/app/features/catalogue/catalogue.routes.ts
var catalogue_routes_default = [{ path: "", component: CataloguePage, title: "Crops & practices catalogue \xB7 Varsapradaya Carbon" }];
export {
  catalogue_routes_default as default
};
//# debugId=6587d2c5-2121-50db-b88a-c6bd8dc921f1
//# sourceMappingURL=chunk-EF5LNHY6.js.map
