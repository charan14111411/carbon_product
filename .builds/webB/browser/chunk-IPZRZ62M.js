import {
  ConfirmDialog
} from "./chunk-KNF3QYXO.js";
import {
  MapView
} from "./chunk-M3VDEKV5.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  HumanPipe,
  NumPipe,
  fmtDate
} from "./chunk-E5UDMWWN.js";
import {
  AuthService,
  Router,
  RouterLink
} from "./chunk-PNIM44LI.js";
import {
  Badge,
  Callout,
  DataClass,
  Empty,
  ErrorBox,
  Hash,
  Loading,
  Modal,
  PageHeader,
  Progress,
  Tabs,
  Timeline
} from "./chunk-PAXTZ3VZ.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  effect,
  forkJoin,
  inject,
  input,
  model,
  of,
  output,
  setClassMetadata,
  signal,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdeclareLet,
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
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate4,
  ɵɵtextInterpolate5,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/sampling/types.ts
var STATUS_COLOR = {
  planned: "#737c76",
  collected: "#2f7249",
  skipped: "#c76329"
};
var CUSTODY_LABEL = {
  collected: "Collected in the field",
  packed: "Packed and sealed",
  dispatched: "Dispatched",
  courier_received: "Received by courier",
  lab_received: "Received at the lab",
  opened: "Opened at the lab",
  analysed: "Analysed",
  archived: "Archived",
  correction: "Correction"
};
var ANALYTE_LABEL = {
  soc_pct: "Soil organic carbon",
  bulk_density_g_cm3: "Bulk density",
  coarse_fraction: "Coarse fraction",
  ph: "pH",
  texture_clay_pct: "Clay content"
};
function zFor(confidence) {
  const p = (1 + confidence) / 2;
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let q, r;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= 1 - pl) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}
function sampleSize(mean, sd, errPct, confidence) {
  if (!(mean > 0) || !(sd >= 0) || !(errPct > 0 && errPct <= 100) || !(confidence > 0 && confidence < 1)) return null;
  const z = zFor(confidence);
  const raw = (z * sd / (errPct / 100 * mean)) ** 2;
  return { n: Math.max(1, Math.ceil(Math.round(raw * 1e9) / 1e9)), z, raw };
}

// src/app/features/sampling/plan-modal.ts
function PlanModal_Conditional_17_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275pipe(3, "num");
    \u0275\u0275pipe(4, "num");
    \u0275\u0275pipe(5, "num");
    \u0275\u0275pipe(6, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate5("= \u2308(", \u0275\u0275pipeBind2(2, 5, c_r3.z, 3), " \xD7 ", \u0275\u0275pipeBind2(3, 8, ctx_r1.sd(), 2), " / (", \u0275\u0275pipeBind2(4, 11, ctx_r1.err() / 100, 2), " \xD7 ", \u0275\u0275pipeBind2(5, 14, ctx_r1.mean(), 2), "))\xB2\u2309 = \u2308", \u0275\u0275pipeBind2(6, 17, c_r3.raw, 2), "\u2309");
  }
}
function PlanModal_Conditional_17_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "Enter a mean above zero, a spread, and a target error between 1 and 100.");
    \u0275\u0275elementEnd();
  }
}
function PlanModal_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 6)(2, "label", 16);
    \u0275\u0275text(3, "Prior mean soil carbon (%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 17);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PlanModal_Conditional_17_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.mean.set(+$event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 9);
    \u0275\u0275text(6, "From earlier sampling or published data for this soil.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 6)(8, "label", 18);
    \u0275\u0275text(9, "Prior standard deviation (%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "input", 19);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PlanModal_Conditional_17_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sd.set(+$event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 9);
    \u0275\u0275text(12, "How much soil carbon varies between cores.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 6)(14, "label", 20);
    \u0275\u0275text(15, "Target error (% of the mean)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 21);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PlanModal_Conditional_17_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.err.set(+$event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 6)(18, "label", 22);
    \u0275\u0275text(19, "Confidence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "select", 23);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PlanModal_Conditional_17_Template_select_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.conf.set(+$event));
    });
    \u0275\u0275elementStart(21, "option", 24);
    \u0275\u0275text(22, "80%");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "option", 24);
    \u0275\u0275text(24, "90%");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "option", 24);
    \u0275\u0275text(26, "95%");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "option", 24);
    \u0275\u0275text(28, "99%");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(29, "div", 25)(30, "div", 26)(31, "span", 27);
    \u0275\u0275text(32, "n = \u2308(z \xB7 sd / (e \xB7 mean))\xB2\u2309");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(33, PlanModal_Conditional_17_Conditional_33_Template, 7, 20, "span", 28)(34, PlanModal_Conditional_17_Conditional_34_Template, 2, 0, "span", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 30)(36, "span", 31);
    \u0275\u0275text(37, "Cores needed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "strong", 32);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd();
    \u0275\u0275element(40, "vc-dc", 33);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 6)(42, "label", 34);
    \u0275\u0275text(43, "Minimum to take ");
    \u0275\u0275elementStart(44, "span", 35);
    \u0275\u0275text(45, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "input", 36);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PlanModal_Conditional_17_Template_input_ngModelChange_46_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.minN, $event) || (ctx_r1.minN = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "span", 9);
    \u0275\u0275text(48, "The plan uses whichever is larger. The methodology's minimum per zone is also applied by the server.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_13_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r1.mean());
    \u0275\u0275control();
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r1.sd());
    \u0275\u0275control();
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r1.err());
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r1.conf());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", 0.8);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", 0.9);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", 0.95);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngValue", 0.99);
    \u0275\u0275advance(6);
    \u0275\u0275conditional((tmp_13_0 = ctx_r1.calc()) ? 33 : 34, tmp_13_0);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.calc()?.n ?? "\u2014");
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.minN);
    \u0275\u0275control();
  }
}
function PlanModal_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "label", 37);
    \u0275\u0275text(2, "Cores required");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 38);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PlanModal_Conditional_18_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.manualN, $event) || (ctx_r1.manualN = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.manualN);
    \u0275\u0275control();
  }
}
function PlanModal_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
var PlanModal = class _PlanModal {
  api = inject(ApiService);
  toast = inject(ToastService);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  campaignId = input.required(
    ...ngDevMode ? [{ debugName: "campaignId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  zone = input(
    null,
    ...ngDevMode ? [{ debugName: "zone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saved = output();
  method = signal(
    "variance_formula",
    ...ngDevMode ? [{ debugName: "method" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mean = signal(
    1.2,
    ...ngDevMode ? [{ debugName: "mean" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sd = signal(
    0.35,
    ...ngDevMode ? [{ debugName: "sd" }] : (
      /* istanbul ignore next */
      []
    )
  );
  err = signal(
    10,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  conf = signal(
    0.9,
    ...ngDevMode ? [{ debugName: "conf" }] : (
      /* istanbul ignore next */
      []
    )
  );
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
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
  manualN = null;
  minN = null;
  justification = "";
  calc = computed(
    () => sampleSize(this.mean(), this.sd(), this.err(), this.conf()),
    ...ngDevMode ? [{ debugName: "calc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (!this.open())
        return;
      this.error.set(null);
      this.justification = "";
      this.manualN = null;
      this.minN = null;
    });
  }
  valid() {
    if (this.justification.trim().length < 5)
      return false;
    return this.method() === "manual" ? !!this.manualN && this.manualN >= 1 : !!this.calc();
  }
  save() {
    const z = this.zone();
    if (!z)
      return;
    this.busy.set(true);
    this.error.set(null);
    const formula = this.method() === "variance_formula";
    this.api.post(`/campaigns/${this.campaignId()}/sample-plans`, {
      stratum_id: z.id,
      method: this.method(),
      n_required: formula ? this.minN ? Number(this.minN) : null : Number(this.manualN),
      inputs: formula ? { prior_mean: this.mean(), prior_sd: this.sd(), target_error_pct: this.err(), confidence: this.conf() } : {},
      justification: this.justification.trim()
    }).subscribe({
      next: (p) => {
        this.busy.set(false);
        this.toast.success(`Draft plan saved: ${p.n_required} cores for ${p.stratum_code}`, p.warnings[0]?.message);
        this.saved.emit(p);
        this.open.set(false);
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(e.message);
      }
    });
  }
  static \u0275fac = function PlanModal_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlanModal)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PlanModal, selectors: [["vc-plan-modal"]], inputs: { open: [1, "open"], campaignId: [1, "campaignId"], zone: [1, "zone"] }, outputs: { open: "openChange", saved: "saved" }, decls: 32, vars: 13, consts: [["width", "640px", "subtitle", "How many cores this zone needs in this campaign. Someone else must approve it before points are placed.", 3, "openChange", "open", "title"], [1, "stack", 2, "--gap", "18px"], ["role", "radiogroup", "aria-label", "Method", 1, "seg"], ["type", "button", 3, "click"], ["name", "sigma", 3, "size"], ["name", "pencil", 3, "size"], [1, "field"], ["for", "p-just"], ["id", "p-just", "rows", "3", "placeholder", "Prior values from the 2023 district soil survey for red laterite, 0\u201330 cm.", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], ["tone", "danger", "icon", "alert"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], [1, "form-grid"], ["for", "p-mean"], ["id", "p-mean", "type", "number", "step", "0.01", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "p-sd"], ["id", "p-sd", "type", "number", "step", "0.01", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "p-err"], ["id", "p-err", "type", "number", "step", "1", "min", "1", "max", "100", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "p-conf"], ["id", "p-conf", 1, "input", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "calc"], [1, "formula"], [1, "f"], [1, "sub", "mono"], [1, "sub"], [1, "res"], [1, "subtle", "small"], [1, "num"], ["cls", "CALCULATED"], ["for", "p-min"], [1, "subtle"], ["id", "p-min", "type", "number", "min", "1", "placeholder", "\u2014", 1, "input", "num", 2, "max-width", "180px", 3, "ngModelChange", "ngModel"], ["for", "p-n"], ["id", "p-n", "type", "number", "min", "1", "max", "10000", 1, "input", "num", 2, "max-width", "180px", 3, "ngModelChange", "ngModel"]], template: function PlanModal_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function PlanModal_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "button", 3);
      \u0275\u0275listener("click", function PlanModal_Template_button_click_3_listener() {
        return ctx.method.set("variance_formula");
      });
      \u0275\u0275element(4, "vc-icon", 4);
      \u0275\u0275elementStart(5, "span")(6, "strong");
      \u0275\u0275text(7, "Calculate from variability");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "em");
      \u0275\u0275text(9, "Use a prior mean and spread of soil carbon");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "button", 3);
      \u0275\u0275listener("click", function PlanModal_Template_button_click_10_listener() {
        return ctx.method.set("manual");
      });
      \u0275\u0275element(11, "vc-icon", 5);
      \u0275\u0275elementStart(12, "span")(13, "strong");
      \u0275\u0275text(14, "Enter a number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "em");
      \u0275\u0275text(16, "For example, a count set by the methodology");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(17, PlanModal_Conditional_17_Template, 49, 11)(18, PlanModal_Conditional_18_Template, 4, 1, "div", 6);
      \u0275\u0275elementStart(19, "div", 6)(20, "label", 7);
      \u0275\u0275text(21, "Justification");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "textarea", 8);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function PlanModal_Template_textarea_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.justification, $event) || (ctx.justification = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "span", 9);
      \u0275\u0275text(24, "The approver reads this. At least 5 characters.");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(25, PlanModal_Conditional_25_Template, 2, 1, "vc-callout", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(26, 11);
      \u0275\u0275elementStart(27, "button", 12);
      \u0275\u0275listener("click", function PlanModal_Template_button_click_27_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(28, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "button", 13);
      \u0275\u0275listener("click", function PlanModal_Template_button_click_29_listener() {
        return ctx.save();
      });
      \u0275\u0275element(30, "vc-icon", 14);
      \u0275\u0275text(31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275property("title", "Sample plan \xB7 zone " + (ctx.zone()?.code ?? ""));
      \u0275\u0275advance(3);
      \u0275\u0275classProp("on", ctx.method() === "variance_formula");
      \u0275\u0275advance();
      \u0275\u0275property("size", 16);
      \u0275\u0275advance(6);
      \u0275\u0275classProp("on", ctx.method() === "manual");
      \u0275\u0275advance();
      \u0275\u0275property("size", 16);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.method() === "variance_formula" ? 17 : 18);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.justification);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.error() ? 25 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.valid());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.busy() ? "Saving\u2026" : "Save draft plan");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, Modal, Icon, Callout, DataClass, NumPipe], styles: ["\n.seg[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 12px 14px;\n  border: 1.5px solid var(--%NS%border-strong);\n  border-radius: var(--%NS%radius);\n  background: var(--%NS%surface);\n  text-align: left;\n  font: inherit;\n  cursor: pointer;\n  color: var(--%NS%stone-700);\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n}\n.seg[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.calc[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  gap: 0;\n  border: 1px solid var(--%NS%forest-200);\n  border-radius: var(--%NS%radius);\n  overflow: hidden;\n  background: var(--%NS%forest-50);\n}\n.formula[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 14px 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  min-width: 0;\n}\n.f[_ngcontent-%COMP%] {\n  font: 600 15px var(--%NS%mono);\n  color: var(--%NS%forest-800);\n}\n.sub[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%stone-600);\n  overflow-wrap: anywhere;\n}\n.res[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  padding: 10px 22px;\n  background: var(--%NS%surface);\n  border-left: 1px solid var(--%NS%forest-200);\n}\n.res[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 30px;\n  font-weight: 600;\n  line-height: 1;\n  color: var(--%NS%forest-700);\n}\n@media (max-width: 600px) {\n  .seg[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .calc[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .res[_ngcontent-%COMP%] {\n    border-left: 0;\n    border-top: 1px solid var(--%NS%forest-200);\n  }\n}\n/*# sourceMappingURL=plan-modal.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlanModal, [{
    type: Component,
    args: [{ selector: "vc-plan-modal", imports: [FormsModule, Modal, Icon, Callout, DataClass, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" width="640px" [title]="'Sample plan \xB7 zone ' + (zone()?.code ?? '')"
      subtitle="How many cores this zone needs in this campaign. Someone else must approve it before points are placed.">
      <div class="stack" style="--gap:18px">
        <div class="seg" role="radiogroup" aria-label="Method">
          <button type="button" [class.on]="method() === 'variance_formula'" (click)="method.set('variance_formula')">
            <vc-icon name="sigma" [size]="16" /><span><strong>Calculate from variability</strong><em>Use a prior mean and spread of soil carbon</em></span>
          </button>
          <button type="button" [class.on]="method() === 'manual'" (click)="method.set('manual')">
            <vc-icon name="pencil" [size]="16" /><span><strong>Enter a number</strong><em>For example, a count set by the methodology</em></span>
          </button>
        </div>

        @if (method() === 'variance_formula') {
          <div class="form-grid">
            <div class="field">
              <label for="p-mean">Prior mean soil carbon (%)</label>
              <input id="p-mean" type="number" step="0.01" min="0" class="input num" [ngModel]="mean()" (ngModelChange)="mean.set(+$event)" />
              <span class="hint">From earlier sampling or published data for this soil.</span>
            </div>
            <div class="field">
              <label for="p-sd">Prior standard deviation (%)</label>
              <input id="p-sd" type="number" step="0.01" min="0" class="input num" [ngModel]="sd()" (ngModelChange)="sd.set(+$event)" />
              <span class="hint">How much soil carbon varies between cores.</span>
            </div>
            <div class="field">
              <label for="p-err">Target error (% of the mean)</label>
              <input id="p-err" type="number" step="1" min="1" max="100" class="input num" [ngModel]="err()" (ngModelChange)="err.set(+$event)" />
            </div>
            <div class="field">
              <label for="p-conf">Confidence</label>
              <select id="p-conf" class="input" [ngModel]="conf()" (ngModelChange)="conf.set(+$event)">
                <option [ngValue]="0.8">80%</option><option [ngValue]="0.9">90%</option>
                <option [ngValue]="0.95">95%</option><option [ngValue]="0.99">99%</option>
              </select>
            </div>
          </div>
          <div class="calc">
            <div class="formula">
              <span class="f">n = \u2308(z \xB7 sd / (e \xB7 mean))\xB2\u2309</span>
              @if (calc(); as c) {
                <span class="sub mono">= \u2308({{ c.z | num: 3 }} \xD7 {{ sd() | num: 2 }} / ({{ err() / 100 | num: 2 }} \xD7 {{ mean() | num: 2 }}))\xB2\u2309 = \u2308{{ c.raw | num: 2 }}\u2309</span>
              } @else {
                <span class="sub">Enter a mean above zero, a spread, and a target error between 1 and 100.</span>
              }
            </div>
            <div class="res">
              <span class="subtle small">Cores needed</span>
              <strong class="num">{{ calc()?.n ?? '\u2014' }}</strong>
              <vc-dc cls="CALCULATED" />
            </div>
          </div>
          <div class="field">
            <label for="p-min">Minimum to take <span class="subtle">(optional)</span></label>
            <input id="p-min" type="number" min="1" class="input num" style="max-width:180px" [(ngModel)]="minN" placeholder="\u2014" />
            <span class="hint">The plan uses whichever is larger. The methodology's minimum per zone is also applied by the server.</span>
          </div>
        } @else {
          <div class="field">
            <label for="p-n">Cores required</label>
            <input id="p-n" type="number" min="1" max="10000" class="input num" style="max-width:180px" [(ngModel)]="manualN" />
          </div>
        }

        <div class="field">
          <label for="p-just">Justification</label>
          <textarea id="p-just" class="input" rows="3" [(ngModel)]="justification"
            placeholder="Prior values from the 2023 district soil survey for red laterite, 0\u201330 cm."></textarea>
          <span class="hint">The approver reads this. At least 5 characters.</span>
        </div>
        @if (error()) { <vc-callout tone="danger" icon="alert">{{ error() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Saving\u2026' : 'Save draft plan' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;b07f7574efea24a1;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sampling\\plan-modal.ts */\n.seg {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.seg button {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 12px 14px;\n  border: 1.5px solid var(--border-strong);\n  border-radius: var(--radius);\n  background: var(--surface);\n  text-align: left;\n  font: inherit;\n  cursor: pointer;\n  color: var(--stone-700);\n}\n.seg button.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  color: var(--forest-700);\n}\n.seg span {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.seg em {\n  font-style: normal;\n  font-size: 12px;\n  color: var(--text-3);\n}\n.calc {\n  display: flex;\n  align-items: stretch;\n  gap: 0;\n  border: 1px solid var(--forest-200);\n  border-radius: var(--radius);\n  overflow: hidden;\n  background: var(--forest-50);\n}\n.formula {\n  flex: 1;\n  padding: 14px 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  min-width: 0;\n}\n.f {\n  font: 600 15px var(--mono);\n  color: var(--forest-800);\n}\n.sub {\n  font-size: 12.5px;\n  color: var(--stone-600);\n  overflow-wrap: anywhere;\n}\n.res {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  padding: 10px 22px;\n  background: var(--surface);\n  border-left: 1px solid var(--forest-200);\n}\n.res strong {\n  font-size: 30px;\n  font-weight: 600;\n  line-height: 1;\n  color: var(--forest-700);\n}\n@media (max-width: 600px) {\n  .seg {\n    grid-template-columns: 1fr;\n  }\n  .calc {\n    flex-direction: column;\n  }\n  .res {\n    border-left: 0;\n    border-top: 1px solid var(--forest-200);\n  }\n}\n/*# sourceMappingURL=plan-modal.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], campaignId: [{ type: Input, args: [{ isSignal: true, alias: "campaignId", required: true }] }], zone: [{ type: Input, args: [{ isSignal: true, alias: "zone", required: false }] }], saved: [{ type: Output, args: ["saved"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PlanModal, { className: "PlanModal", filePath: "src/app/features/sampling/plan-modal.ts", lineNumber: 108 });
})();

// src/app/features/sampling/sample-view.ts
var _c0 = () => [];
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.key;
function SampleView_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 4)(1, "strong");
    \u0275\u0275text(2, "Deviation recorded:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const s_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", s_r1.deviation_reason);
  }
}
function SampleView_Conditional_39_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 19)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r2 = ctx.$implicit;
    \u0275\u0275property("tone", f_r2.severity === "blocking" ? "danger" : "warn");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r2.rule_code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", f_r2.message, " ");
  }
}
function SampleView_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275repeaterCreate(1, SampleView_Conditional_39_For_2_Template, 4, 3, "vc-callout", 19, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.findings());
  }
}
function SampleView_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, "No photos were attached to this core.");
    \u0275\u0275elementEnd();
  }
}
function SampleView_Conditional_46_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 21);
  }
  if (rf & 2) {
    const p_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r2.urls()[p_r4.id], \u0275\u0275sanitizeUrl)("alt", p_r4.filename);
  }
}
function SampleView_Conditional_46_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275element(1, "vc-icon", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
  }
}
function SampleView_Conditional_46_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275pipe(3, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(2, 2, p_r4.latitude, 5), ", ", \u0275\u0275pipeBind2(3, 5, p_r4.longitude, 5));
  }
}
function SampleView_Conditional_46_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 20);
    \u0275\u0275conditionalCreate(1, SampleView_Conditional_46_For_2_Conditional_1_Template, 1, 2, "img", 21)(2, SampleView_Conditional_46_For_2_Conditional_2_Template, 2, 1, "span", 22);
    \u0275\u0275elementStart(3, "span", 23)(4, "span", 24);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, SampleView_Conditional_46_For_2_Conditional_6_Template, 4, 8, "span", 25);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("href", ctx_r2.urls()[p_r4.id] || null, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.urls()[p_r4.id] ? 1 : 2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r4.filename);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r4.latitude !== null ? 6 : -1);
  }
}
function SampleView_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275repeaterCreate(1, SampleView_Conditional_46_For_2_Template, 7, 4, "a", 20, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const s_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275repeater(s_r1.photos);
  }
}
function SampleView_For_52_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 32);
    \u0275\u0275text(1, "No lab results yet.");
    \u0275\u0275elementEnd();
  }
}
function SampleView_For_52_Conditional_13_For_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("v", r_r5.version);
  }
}
function SampleView_For_52_Conditional_13_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, SampleView_For_52_Conditional_13_For_3_Conditional_3_Template, 2, 1, "span", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 2)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " ");
    \u0275\u0275elementStart(9, "span", 7);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275element(12, "vc-dc", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 8);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275element(17, "vc-badge", 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("old", r_r5.status === "voided" || r_r5.status === "rejected");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.analyte(r_r5.analyte), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r5.version > 1 ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 9, r_r5.value, 3));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r5.unit);
    \u0275\u0275advance(2);
    \u0275\u0275property("cls", r_r5.data_class);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 12, r_r5.method));
    \u0275\u0275advance(3);
    \u0275\u0275property("status", r_r5.status);
  }
}
function SampleView_For_52_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 33)(1, "tbody");
    \u0275\u0275repeaterCreate(2, SampleView_For_52_Conditional_13_For_3_Template, 18, 14, "tr", 34, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const l_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275repeater(l_r6.lab_results);
  }
}
function SampleView_For_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 27)(2, "span", 28);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275pipe(5, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "code");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "span", 29);
    \u0275\u0275elementStart(9, "span", 30);
    \u0275\u0275element(10, "vc-icon", 31);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(12, SampleView_For_52_Conditional_12_Template, 2, 0, "p", 32)(13, SampleView_For_52_Conditional_13_Template, 4, 0, "table", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r6 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(4, 6, l_r6.depth_from_cm, 0), "\u2013", \u0275\u0275pipeBind2(5, 9, l_r6.depth_to_cm, 0), " cm");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(l_r6.code);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", l_r6.label_qr);
    \u0275\u0275advance();
    \u0275\u0275conditional(!l_r6.lab_results.length ? 12 : 13);
  }
}
function SampleView_For_64_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "strong", 2);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", v_r7["parameter"] || v_r7["index"], " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 3, v_r7["value"], 2));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", v_r7["unit"] || "");
  }
}
function SampleView_For_64_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275repeaterCreate(1, SampleView_For_64_Conditional_4_For_2_Template, 6, 6, "span", 40, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275element(3, "vc-dc", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(c_r8.block.values ?? \u0275\u0275pureFunction0(1, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275property("cls", c_r8.block.values?.[0]?.["data_class"] || "OBSERVED");
  }
}
function SampleView_For_64_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Not available \xB7 ", c_r8.block?.reason || "not recorded");
  }
}
function SampleView_For_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 36);
    \u0275\u0275element(2, "vc-icon", 37);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, SampleView_For_64_Conditional_4_Template, 4, 2, "div", 38)(5, SampleView_For_64_Conditional_5_Template, 2, 1, "span", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r8 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("name", c_r8.icon)("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r8.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r8.block?.status === "available" ? 4 : 5);
  }
}
function SampleView_Conditional_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "First photo fingerprint");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275element(3, "vc-hash", 41);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const s_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", s_r1.photos[0].sha256);
  }
}
var SampleView = class _SampleView {
  api = inject(ApiService);
  sample = input.required(
    ...ngDevMode ? [{ debugName: "sample" }] : (
      /* istanbul ignore next */
      []
    )
  );
  findings = input(
    [],
    ...ngDevMode ? [{ debugName: "findings" }] : (
      /* istanbul ignore next */
      []
    )
  );
  urls = signal(
    {},
    ...ngDevMode ? [{ debugName: "urls" }] : (
      /* istanbul ignore next */
      []
    )
  );
  made = [];
  asked = /* @__PURE__ */ new Set();
  custody = computed(
    () => this.sample().custody.map((e) => ({
      title: CUSTODY_LABEL[e.event] ?? e.event,
      at: fmtDate(e.occurred_at, true),
      by: [e.recorded_by, e.location].filter(Boolean).join(" \xB7 "),
      note: [
        e.seal_intact === false ? "Seal was broken" : e.seal_intact ? "Seal intact" : "",
        e.count_matches === false ? "bag count did not match" : e.count_matches ? "bag count matched" : "",
        e.notes
      ].filter(Boolean).join(" \xB7 ") || null,
      tone: e.event === "correction" || e.seal_intact === false || e.count_matches === false ? "warn" : "ok"
    })),
    ...ngDevMode ? [{ debugName: "custody" }] : (
      /* istanbul ignore next */
      []
    )
  );
  contextRows = computed(
    () => {
      const c = this.sample().context ?? {};
      return [
        { key: "weather", label: "Weather", icon: "rain", block: c.weather },
        { key: "sensor", label: "Soil sensor", icon: "thermometer", block: c.sensor },
        { key: "satellite", label: "Satellite", icon: "satellite", block: c.satellite }
      ];
    },
    ...ngDevMode ? [{ debugName: "contextRows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const s = this.sample();
      for (const p of s.photos) {
        if (this.asked.has(p.id))
          continue;
        this.asked.add(p.id);
        this.api.blob(`/evidence/${p.id}/content`).subscribe({
          next: (b) => {
            const u = URL.createObjectURL(b);
            this.made.push(u);
            this.urls.update((m) => __spreadProps(__spreadValues({}, m), { [p.id]: u }));
          },
          error: () => {
          }
        });
      }
    });
  }
  analyte(a) {
    return ANALYTE_LABEL[a] ?? a;
  }
  ngOnDestroy() {
    this.made.forEach((u) => URL.revokeObjectURL(u));
  }
  static \u0275fac = function SampleView_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SampleView)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SampleView, selectors: [["vc-sample-view"]], inputs: { sample: [1, "sample"], findings: [1, "findings"] }, decls: 89, vars: 39, consts: [[1, "stack", 2, "--gap", "22px"], [1, "facts"], [1, "num"], [3, "status"], ["tone", "warn", "icon", "alert"], [1, "stack", 2, "--gap", "8px"], [1, "sh"], [1, "subtle"], [1, "muted", "small"], [1, "photos"], [1, "layers"], [1, "layer"], [3, "items"], [1, "subtle", "small", 2, "margin-bottom", "10px"], [1, "ctx"], [1, "ctx-row"], [1, "kv"], [1, "mono"], [1, "mono", "small"], ["icon", "shield", 3, "tone"], ["target", "_blank", "rel", "noopener", 1, "ph", 3, "href"], [3, "src", "alt"], [1, "ph-load"], [1, "cap"], [1, "truncate"], [1, "mono", "subtle"], ["name", "image", 3, "size"], [1, "lh"], [1, "depth", "num"], [1, "spacer"], [1, "subtle", "small"], ["name", "qr", 3, "size"], [1, "subtle", "small", "lr-empty"], [1, "table", "lr"], [3, "old"], [3, "cls"], [1, "ck"], [3, "name", "size"], [1, "cv"], [1, "na"], [1, "chip"], [3, "value"]], template: function SampleView_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275declareLet(0);
      \u0275\u0275elementStart(1, "div", 0)(2, "div", 1)(3, "div")(4, "span");
      \u0275\u0275text(5, "Collected");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "strong");
      \u0275\u0275text(7);
      \u0275\u0275pipe(8, "day");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div")(10, "span");
      \u0275\u0275text(11, "By");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "strong");
      \u0275\u0275text(13);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div")(15, "span");
      \u0275\u0275text(16, "GPS accuracy");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "strong", 2);
      \u0275\u0275text(18);
      \u0275\u0275pipe(19, "num");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div")(21, "span");
      \u0275\u0275text(22, "From site");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "strong", 2);
      \u0275\u0275text(24);
      \u0275\u0275pipe(25, "num");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div")(27, "span");
      \u0275\u0275text(28, "Depth reached");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "strong", 2);
      \u0275\u0275text(30);
      \u0275\u0275pipe(31, "num");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div")(33, "span");
      \u0275\u0275text(34, "Custody");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "vc-badge", 3);
      \u0275\u0275text(36);
      \u0275\u0275pipe(37, "human");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(38, SampleView_Conditional_38_Template, 4, 1, "vc-callout", 4);
      \u0275\u0275conditionalCreate(39, SampleView_Conditional_39_Template, 3, 0, "div", 5);
      \u0275\u0275elementStart(40, "section")(41, "h3", 6);
      \u0275\u0275text(42, "Photos ");
      \u0275\u0275elementStart(43, "span", 7);
      \u0275\u0275text(44);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(45, SampleView_Conditional_45_Template, 2, 0, "p", 8)(46, SampleView_Conditional_46_Template, 3, 0, "div", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "section")(48, "h3", 6);
      \u0275\u0275text(49, "Layers and lab results");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "div", 10);
      \u0275\u0275repeaterCreate(51, SampleView_For_52_Template, 14, 12, "div", 11, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(53, "section")(54, "h3", 6);
      \u0275\u0275text(55, "Chain of custody");
      \u0275\u0275elementEnd();
      \u0275\u0275element(56, "vc-timeline", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "section")(58, "h3", 6);
      \u0275\u0275text(59, "Conditions at collection");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "p", 13);
      \u0275\u0275text(61, "A snapshot taken when the core was recorded. Missing sources are stated, never guessed.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "div", 14);
      \u0275\u0275repeaterCreate(63, SampleView_For_64_Template, 6, 4, "div", 15, _forTrack1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(65, "section")(66, "h3", 6);
      \u0275\u0275text(67, "Record");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "dl", 16)(69, "dt");
      \u0275\u0275text(70, "Sample code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "dd")(72, "code");
      \u0275\u0275text(73);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(74, "dt");
      \u0275\u0275text(75, "Location");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "dd", 17);
      \u0275\u0275text(77);
      \u0275\u0275pipe(78, "num");
      \u0275\u0275pipe(79, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(80, "dt");
      \u0275\u0275text(81, "Device");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "dd", 17);
      \u0275\u0275text(83);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(84, "dt");
      \u0275\u0275text(85, "Sync reference");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "dd", 18);
      \u0275\u0275text(87);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(88, SampleView_Conditional_88_Template, 4, 1);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      const s_r9 = \u0275\u0275storeLet(ctx.sample());
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 19, s_r9.collected_at, true));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(s_r9.collected_by || "\u2014");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(s_r9.gps_accuracy_m === null ? "\u2014" : \u0275\u0275pipeBind2(19, 22, s_r9.gps_accuracy_m, 1) + " m");
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(25, 25, s_r9.distance_from_site_m, 1), " m");
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(31, 28, s_r9.depth_reached_cm, 0), " cm");
      \u0275\u0275advance(5);
      \u0275\u0275property("status", s_r9.status === "none" ? "pending" : "active");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(37, 31, s_r9.status));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(s_r9.deviation_reason ? 38 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.findings().length ? 39 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(s_r9.photos.length);
      \u0275\u0275advance();
      \u0275\u0275conditional(!s_r9.photos.length ? 45 : 46);
      \u0275\u0275advance(6);
      \u0275\u0275repeater(s_r9.layers);
      \u0275\u0275advance(5);
      \u0275\u0275property("items", ctx.custody());
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.contextRows());
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(s_r9.code);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(78, 33, s_r9.latitude, 6), ", ", \u0275\u0275pipeBind2(79, 36, s_r9.longitude, 6));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(s_r9.device_id || "\u2014");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(s_r9.client_ref);
      \u0275\u0275advance();
      \u0275\u0275conditional(s_r9.photos[0] ? 88 : -1);
    }
  }, dependencies: [Icon, Badge, DataClass, Hash, Timeline, Callout, DayPipe, NumPipe, HumanPipe], styles: ["\n.facts[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1px;\n  background: var(--%NS%border);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  overflow: hidden;\n}\n.facts[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  align-items: flex-start;\n}\n.facts[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.facts[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 14px;\n}\n.sh[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n  display: flex;\n  gap: 6px;\n  align-items: baseline;\n}\n.photos[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 10px;\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  overflow: hidden;\n  text-decoration: none !important;\n  color: inherit;\n  background: var(--%NS%surface-2);\n}\n.ph[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  aspect-ratio: 4/3;\n  object-fit: cover;\n  display: block;\n  background: var(--%NS%sand-200);\n}\n.ph-load[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  aspect-ratio: 4/3;\n  color: var(--%NS%stone-400);\n  background: var(--%NS%sand-200);\n}\n.cap[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  padding: 6px 8px;\n  font-size: 11.5px;\n  min-width: 0;\n}\n.layers[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.layer[_ngcontent-%COMP%] {\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  overflow: hidden;\n}\n.lh[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 12px;\n  background: var(--%NS%surface-2);\n  border-bottom: 1px solid var(--%NS%border);\n}\n.lh[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.lh[_ngcontent-%COMP%]   .subtle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.depth[_ngcontent-%COMP%] {\n  font-weight: 600;\n  min-width: 74px;\n}\n.lr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n}\n.lr[_ngcontent-%COMP%]   tr.old[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  opacity: 0.55;\n}\n.lr-empty[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n}\n.ctx[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n}\n.ctx-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  padding: 10px 12px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n  align-items: center;\n  flex-wrap: wrap;\n}\n.ctx-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.ck[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 8px;\n  align-items: center;\n  min-width: 130px;\n  font-weight: 500;\n  color: var(--%NS%stone-700);\n}\n.cv[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n}\n.chip[_ngcontent-%COMP%] {\n  font-size: 12px;\n  background: var(--%NS%sand-100);\n  border: 1px solid var(--%NS%border);\n  border-radius: 999px;\n  padding: 2px 8px;\n}\n.na[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-3);\n  font-style: italic;\n}\n@media (max-width: 640px) {\n  .facts[_ngcontent-%COMP%], \n   .photos[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n/*# sourceMappingURL=sample-view.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SampleView, [{
    type: Component,
    args: [{ selector: "vc-sample-view", imports: [Icon, Badge, DataClass, Hash, Timeline, Callout, DayPipe, NumPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @let s = sample();
    <div class="stack" style="--gap:22px">
      <div class="facts">
        <div><span>Collected</span><strong>{{ s.collected_at | day: true }}</strong></div>
        <div><span>By</span><strong>{{ s.collected_by || '\u2014' }}</strong></div>
        <div><span>GPS accuracy</span><strong class="num">{{ s.gps_accuracy_m === null ? '\u2014' : (s.gps_accuracy_m | num: 1) + ' m' }}</strong></div>
        <div><span>From site</span><strong class="num">{{ s.distance_from_site_m | num: 1 }} m</strong></div>
        <div><span>Depth reached</span><strong class="num">{{ s.depth_reached_cm | num: 0 }} cm</strong></div>
        <div><span>Custody</span><vc-badge [status]="s.status === 'none' ? 'pending' : 'active'">{{ s.status | human }}</vc-badge></div>
      </div>

      @if (s.deviation_reason) {
        <vc-callout tone="warn" icon="alert"><strong>Deviation recorded:</strong> {{ s.deviation_reason }}</vc-callout>
      }
      @if (findings().length) {
        <div class="stack" style="--gap:8px">
          @for (f of findings(); track f.id) {
            <vc-callout [tone]="f.severity === 'blocking' ? 'danger' : 'warn'" icon="shield">
              <strong>{{ f.rule_code }}</strong> \xB7 {{ f.message }}
            </vc-callout>
          }
        </div>
      }

      <section>
        <h3 class="sh">Photos <span class="subtle">{{ s.photos.length }}</span></h3>
        @if (!s.photos.length) {
          <p class="muted small">No photos were attached to this core.</p>
        } @else {
          <div class="photos">
            @for (p of s.photos; track p.id) {
              <a class="ph" [href]="urls()[p.id] || null" target="_blank" rel="noopener">
                @if (urls()[p.id]) { <img [src]="urls()[p.id]" [alt]="p.filename" /> } @else { <span class="ph-load"><vc-icon name="image" [size]="20" /></span> }
                <span class="cap">
                  <span class="truncate">{{ p.filename }}</span>
                  @if (p.latitude !== null) { <span class="mono subtle">{{ p.latitude | num: 5 }}, {{ p.longitude | num: 5 }}</span> }
                </span>
              </a>
            }
          </div>
        }
      </section>

      <section>
        <h3 class="sh">Layers and lab results</h3>
        <div class="layers">
          @for (l of s.layers; track l.id) {
            <div class="layer">
              <div class="lh">
                <span class="depth num">{{ l.depth_from_cm | num: 0 }}\u2013{{ l.depth_to_cm | num: 0 }} cm</span>
                <code>{{ l.code }}</code>
                <span class="spacer"></span>
                <span class="subtle small"><vc-icon name="qr" [size]="13" /> {{ l.label_qr }}</span>
              </div>
              @if (!l.lab_results.length) {
                <p class="subtle small lr-empty">No lab results yet.</p>
              } @else {
                <table class="table lr">
                  <tbody>
                    @for (r of l.lab_results; track r.id) {
                      <tr [class.old]="r.status === 'voided' || r.status === 'rejected'">
                        <td>{{ analyte(r.analyte) }} @if (r.version > 1) { <span class="subtle small">v{{ r.version }}</span> }</td>
                        <td class="num"><strong>{{ r.value | num: 3 }}</strong>&ngsp;<span class="subtle">{{ r.unit }}</span></td>
                        <td><vc-dc [cls]="r.data_class" /></td>
                        <td class="muted small">{{ r.method | human }}</td>
                        <td><vc-badge [status]="r.status" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          }
        </div>
      </section>

      <section>
        <h3 class="sh">Chain of custody</h3>
        <vc-timeline [items]="custody()" />
      </section>

      <section>
        <h3 class="sh">Conditions at collection</h3>
        <p class="subtle small" style="margin-bottom:10px">A snapshot taken when the core was recorded. Missing sources are stated, never guessed.</p>
        <div class="ctx">
          @for (c of contextRows(); track c.key) {
            <div class="ctx-row">
              <span class="ck"><vc-icon [name]="c.icon" [size]="15" />{{ c.label }}</span>
              @if (c.block?.status === 'available') {
                <div class="cv">
                  @for (v of c.block!.values ?? []; track $index) {
                    <span class="chip">{{ v['parameter'] || v['index'] }} <strong class="num">{{ $any(v['value']) | num: 2 }}</strong> {{ v['unit'] || '' }}</span>
                  }
                  <vc-dc [cls]="$any(c.block!.values?.[0]?.['data_class']) || 'OBSERVED'" />
                </div>
              } @else {
                <span class="na">Not available \xB7 {{ c.block?.reason || 'not recorded' }}</span>
              }
            </div>
          }
        </div>
      </section>

      <section>
        <h3 class="sh">Record</h3>
        <dl class="kv">
          <dt>Sample code</dt><dd><code>{{ s.code }}</code></dd>
          <dt>Location</dt><dd class="mono">{{ s.latitude | num: 6 }}, {{ s.longitude | num: 6 }}</dd>
          <dt>Device</dt><dd class="mono">{{ s.device_id || '\u2014' }}</dd>
          <dt>Sync reference</dt><dd class="mono small">{{ s.client_ref }}</dd>
          @if (s.photos[0]) { <dt>First photo fingerprint</dt><dd><vc-hash [value]="s.photos[0].sha256" /></dd> }
        </dl>
      </section>
    </div>
  `, styles: ["/* angular:styles/component:scss;fd8ec9486274aed4;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sampling\\sample-view.ts */\n.facts {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1px;\n  background: var(--border);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  overflow: hidden;\n}\n.facts > div {\n  background: var(--surface);\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  align-items: flex-start;\n}\n.facts span {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.facts strong {\n  font-weight: 600;\n  font-size: 14px;\n}\n.sh {\n  margin-bottom: 10px;\n  display: flex;\n  gap: 6px;\n  align-items: baseline;\n}\n.photos {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 10px;\n}\n.ph {\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  overflow: hidden;\n  text-decoration: none !important;\n  color: inherit;\n  background: var(--surface-2);\n}\n.ph img {\n  width: 100%;\n  aspect-ratio: 4/3;\n  object-fit: cover;\n  display: block;\n  background: var(--sand-200);\n}\n.ph-load {\n  display: grid;\n  place-items: center;\n  aspect-ratio: 4/3;\n  color: var(--stone-400);\n  background: var(--sand-200);\n}\n.cap {\n  display: flex;\n  flex-direction: column;\n  padding: 6px 8px;\n  font-size: 11.5px;\n  min-width: 0;\n}\n.layers {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.layer {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  overflow: hidden;\n}\n.lh {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 12px;\n  background: var(--surface-2);\n  border-bottom: 1px solid var(--border);\n}\n.lh code {\n  font-size: 12px;\n}\n.lh .subtle {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.depth {\n  font-weight: 600;\n  min-width: 74px;\n}\n.lr td {\n  padding: 8px 12px;\n}\n.lr tr.old td {\n  opacity: 0.55;\n}\n.lr-empty {\n  padding: 10px 12px;\n}\n.ctx {\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n}\n.ctx-row {\n  display: flex;\n  gap: 12px;\n  padding: 10px 12px;\n  border-bottom: 1px solid var(--stone-100);\n  align-items: center;\n  flex-wrap: wrap;\n}\n.ctx-row:last-child {\n  border-bottom: 0;\n}\n.ck {\n  display: inline-flex;\n  gap: 8px;\n  align-items: center;\n  min-width: 130px;\n  font-weight: 500;\n  color: var(--stone-700);\n}\n.cv {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n}\n.chip {\n  font-size: 12px;\n  background: var(--sand-100);\n  border: 1px solid var(--border);\n  border-radius: 999px;\n  padding: 2px 8px;\n}\n.na {\n  font-size: 12.5px;\n  color: var(--text-3);\n  font-style: italic;\n}\n@media (max-width: 640px) {\n  .facts,\n  .photos {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n/*# sourceMappingURL=sample-view.css.map */\n"] }]
  }], () => [], { sample: [{ type: Input, args: [{ isSignal: true, alias: "sample", required: true }] }], findings: [{ type: Input, args: [{ isSignal: true, alias: "findings", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SampleView, { className: "SampleView", filePath: "src/app/features/sampling/sample-view.ts", lineNumber: 159 });
})();

// src/app/features/sampling/campaign.page.ts
var _forTrack02 = ($index, $item) => $item.id;
var _forTrack12 = ($index, $item) => $item.zone.id;
function CampaignPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-loading", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 7);
  }
}
function CampaignPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function CampaignPage_Conditional_5_For_28_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 44);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 14);
  }
}
function CampaignPage_Conditional_5_For_28_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const \u0275$index_56_r3 = \u0275\u0275nextContext().$index;
    \u0275\u0275textInterpolate1(" ", \u0275$index_56_r3 + 1, " ");
  }
}
function CampaignPage_Conditional_5_For_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 43);
    \u0275\u0275conditionalCreate(2, CampaignPage_Conditional_5_For_28_Conditional_2_Template, 1, 1, "vc-icon", 44)(3, CampaignPage_Conditional_5_For_28_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 45)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "em");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r4 = ctx.$implicit;
    const \u0275$index_56_r3 = ctx.$index;
    const c_r5 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("done", \u0275$index_56_r3 < ctx_r0.stepIndex() || c_r5.status === "complete")("cur", \u0275$index_56_r3 === ctx_r0.stepIndex() && c_r5.status !== "complete");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(\u0275$index_56_r3 < ctx_r0.stepIndex() || c_r5.status === "complete" ? 2 : 3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 7, s_r4));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.stepText[s_r4]);
  }
}
function CampaignPage_Conditional_5_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "span", 46);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 47);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Conditional_29_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.advanceOpen.set(true));
    });
    \u0275\u0275element(4, "vc-icon", 48);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "human");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r5 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.nextText[c_r5.next_status]);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Move to ", \u0275\u0275pipeBind1(6, 2, c_r5.next_status));
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 51);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "br");
    \u0275\u0275elementStart(1, "span", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pl_r8 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("raised to methodology minimum ", pl_r8.inputs["floor_applied"]);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275conditionalCreate(1, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_6_Conditional_1_Template, 3, 1);
  }
  if (rf & 2) {
    const pl_r8 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate4(" mean ", pl_r8.inputs["prior_mean"], " \xB7 sd ", pl_r8.inputs["prior_sd"], " \xB7 e ", pl_r8.inputs["target_error_pct"], "% \xB7 ", (pl_r8.inputs["confidence"] || 0.9) * 100, "% ");
    \u0275\u0275advance();
    \u0275\u0275conditional(pl_r8.inputs["floor_applied"] ? 1 : -1);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2014 ");
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pl_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("by ", pl_r8.approved_by);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const pl_r8 = \u0275\u0275nextContext();
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.openApprove(pl_r8));
    });
    \u0275\u0275element(1, "vc-icon", 44);
    \u0275\u0275text(2, "Approve");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 16)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 54);
    \u0275\u0275conditionalCreate(6, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_6_Template, 2, 5)(7, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_7_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275element(9, "vc-badge", 9);
    \u0275\u0275conditionalCreate(10, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_10_Template, 2, 1, "div", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 16)(14, "button", 55);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Template_button_click_14_listener() {
      const pl_r8 = \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r0.viewPlan.set(pl_r8));
    });
    \u0275\u0275text(15, "Details");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Conditional_16_Template, 3, 1, "button", 56);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pl_r8 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pl_r8.n_required);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pl_r8.method === "manual" ? "Entered" : "Variance formula");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(pl_r8.method === "variance_formula" ? 6 : 7);
    \u0275\u0275advance(3);
    \u0275\u0275property("status", pl_r8.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(pl_r8.approved_by ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pl_r8.created_by || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(pl_r8.status === "draft" && ctx_r0.auth.can("sampling.approve") ? 16 : -1);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_8_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_8_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const row_r11 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openPlan(row_r11.zone));
    });
    \u0275\u0275element(1, "vc-icon", 61);
    \u0275\u0275text(2, "Create plan");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 59);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "td", 60);
    \u0275\u0275text(3, "No plan yet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 16);
    \u0275\u0275conditionalCreate(5, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_8_Conditional_5_Template, 3, 1, "button", 56);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r5 = \u0275\u0275nextContext(4);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") && c_r5.status === "planned" ? 5 : -1);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " ");
    \u0275\u0275elementStart(5, "span", 22);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_7_Template, 17, 7)(8, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Conditional_8_Template, 6, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_17_0;
    const row_r11 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(row_r11.zone.code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(row_r11.zone.name);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_17_0 = row_r11.plan) ? 7 : 8, tmp_17_0);
  }
}
function CampaignPage_Conditional_5_Conditional_54_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52)(1, "table", 53)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Zone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 16);
    \u0275\u0275text(7, "Cores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Inputs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Created by");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, CampaignPage_Conditional_5_Conditional_54_Conditional_7_For_19_Template, 9, 3, "tr", null, _forTrack12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r0.planRows());
  }
}
function CampaignPage_Conditional_5_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 49)(2, "h3");
    \u0275\u0275text(3, "Sample plans per zone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 50);
    \u0275\u0275text(5, "Created by one person, approved by another.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(6, CampaignPage_Conditional_5_Conditional_54_Conditional_6_Template, 1, 0, "vc-empty", 51)(7, CampaignPage_Conditional_5_Conditional_54_Conditional_7_Template, 20, 0, "div", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(!ctx_r0.zones().length ? 6 : 7);
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Conditional_55_Conditional_0_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.placeOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 65);
    \u0275\u0275text(2, "Place points");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", !ctx_r0.allApproved());
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "vc-empty", 63);
    \u0275\u0275conditionalCreate(2, CampaignPage_Conditional_5_Conditional_55_Conditional_0_Conditional_2_Template, 3, 1, "button", 64);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r5 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("text", ctx_r0.allApproved() ? "Every zone has an approved plan. Place the points to create the sites collectors will visit." : "Every zone needs an approved sample plan before points can be placed.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") && c_r5.status === "planned" ? 2 : -1);
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r14 = ctx.$implicit;
    \u0275\u0275property("value", a_r14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r14);
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_1_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 84);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Conditional_55_Conditional_1_Conditional_31_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openAssign());
    });
    \u0275\u0275element(1, "vc-icon", 85);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", !ctx_r0.selected().size);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Assign ", ctx_r0.selected().size || "", " ");
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_1_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "th", 82)(1, "input", 86);
    \u0275\u0275listener("change", function CampaignPage_Conditional_5_Conditional_55_Conditional_1_Conditional_36_Template_input_change_1_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.toggleAll());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r0.allShownSelected());
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_47_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td")(1, "input", 88);
    \u0275\u0275listener("change", function CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_47_Conditional_1_Template_input_change_1_listener() {
      \u0275\u0275restoreView(_r17);
      const p_r18 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.toggle(p_r18.id));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", p_r18.status !== "planned")("checked", ctx_r0.selected().has(p_r18.id));
    \u0275\u0275attribute("aria-label", "Select " + p_r18.site_code);
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_47_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r18 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r18.skip_reason);
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275conditionalCreate(1, CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_47_Conditional_1_Template, 2, 3, "td");
    \u0275\u0275elementStart(2, "td", 87)(3, "code");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "td", 87);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275element(10, "vc-badge", 9);
    \u0275\u0275conditionalCreate(11, CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_47_Conditional_11_Template, 2, 1, "div", 50);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r18 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("hl", p_r18.id === ctx_r0.focusPoint());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") ? 1 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r18.site_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r18.field_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r18.assigned_to_name || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r18.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r18.skip_reason ? 11 : -1);
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_1_ForEmpty_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 89);
    \u0275\u0275text(2, "No points match these filters.");
    \u0275\u0275elementEnd()();
  }
}
function CampaignPage_Conditional_5_Conditional_55_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 62)(1, "vc-map", 66);
    \u0275\u0275listener("featureClick", function CampaignPage_Conditional_5_Conditional_55_Conditional_1_Template_vc_map_featureClick_1_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onMapClick($event));
    });
    \u0275\u0275elementStart(2, "div", 67)(3, "span");
    \u0275\u0275element(4, "i", 68);
    \u0275\u0275text(5, "Planned");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275element(7, "i", 69);
    \u0275\u0275text(8, "Collected");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275element(10, "i", 70);
    \u0275\u0275text(11, "Skipped");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "section", 71)(13, "div", 72)(14, "select", 73);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function CampaignPage_Conditional_5_Conditional_55_Conditional_1_Template_select_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.pStatus.set($event));
    });
    \u0275\u0275elementStart(15, "option", 33);
    \u0275\u0275text(16, "All statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 74);
    \u0275\u0275text(18, "Planned");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "option", 75);
    \u0275\u0275text(20, "Collected");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "option", 76);
    \u0275\u0275text(22, "Skipped");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "select", 77);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function CampaignPage_Conditional_5_Conditional_55_Conditional_1_Template_select_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.pAssignee.set($event));
    });
    \u0275\u0275elementStart(24, "option", 33);
    \u0275\u0275text(25, "Anyone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "option", 78);
    \u0275\u0275text(27, "Unassigned");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(28, CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_29_Template, 2, 2, "option", 34, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "div", 79);
    \u0275\u0275conditionalCreate(31, CampaignPage_Conditional_5_Conditional_55_Conditional_1_Conditional_31_Template, 3, 3, "button", 80);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 81)(33, "table", 53)(34, "thead")(35, "tr");
    \u0275\u0275conditionalCreate(36, CampaignPage_Conditional_5_Conditional_55_Conditional_1_Conditional_36_Template, 2, 1, "th", 82);
    \u0275\u0275elementStart(37, "th");
    \u0275\u0275text(38, "Site");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "th");
    \u0275\u0275text(40, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "th");
    \u0275\u0275text(42, "Assigned to");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "th");
    \u0275\u0275text(44, "Status");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(45, "tbody");
    \u0275\u0275repeaterCreate(46, CampaignPage_Conditional_5_Conditional_55_Conditional_1_For_47_Template, 12, 8, "tr", 83, _forTrack02, false, CampaignPage_Conditional_5_Conditional_55_Conditional_1_ForEmpty_48_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("polygons", ctx_r0.fieldsFc())("points", ctx_r0.pointsFc());
    \u0275\u0275advance(13);
    \u0275\u0275property("ngModel", ctx_r0.pStatus());
    \u0275\u0275control();
    \u0275\u0275advance(9);
    \u0275\u0275property("ngModel", ctx_r0.pAssignee());
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r0.assignees());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") ? 31 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") ? 36 : -1);
    \u0275\u0275advance(10);
    \u0275\u0275repeater(ctx_r0.shownPoints());
  }
}
function CampaignPage_Conditional_5_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CampaignPage_Conditional_5_Conditional_55_Conditional_0_Template, 3, 2, "section", 2)(1, CampaignPage_Conditional_5_Conditional_55_Conditional_1_Template, 49, 7, "div", 62);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r0.points().length ? 0 : 1);
  }
}
function CampaignPage_Conditional_5_Conditional_56_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function CampaignPage_Conditional_5_Conditional_56_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 90);
    \u0275\u0275element(1, "vc-error", 92);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.sError());
  }
}
function CampaignPage_Conditional_5_Conditional_56_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 91);
  }
}
function CampaignPage_Conditional_5_Conditional_56_Conditional_4_For_24_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 95);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const fc_r21 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fc_r21);
  }
}
function CampaignPage_Conditional_5_Conditional_56_Conditional_4_For_24_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 96);
    \u0275\u0275text(1, "0");
    \u0275\u0275elementEnd();
  }
}
function CampaignPage_Conditional_5_Conditional_56_Conditional_4_For_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "tr", 94);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Conditional_56_Conditional_4_For_24_Template_tr_click_1_listener() {
      const s_r20 = \u0275\u0275restoreView(_r19).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openSample(s_r20));
    });
    \u0275\u0275elementStart(2, "td")(3, "code");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 87);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 16);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 16);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 16);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 16);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 16);
    \u0275\u0275conditionalCreate(22, CampaignPage_Conditional_5_Conditional_56_Conditional_4_For_24_Conditional_22_Template, 2, 1, "span", 95)(23, CampaignPage_Conditional_5_Conditional_56_Conditional_4_For_24_Conditional_23_Template, 2, 0, "span", 96);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td")(25, "vc-badge", 9);
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "human");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r20 = ctx.$implicit;
    const fc_r22 = \u0275\u0275storeLet(\u0275\u0275nextContext(4).findingCount().get(s_r20.id) ?? 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r20.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r20.site_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 11, s_r20.collected_at, true));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r20.gps_accuracy_m === null ? "\u2014" : \u0275\u0275pipeBind2(12, 14, s_r20.gps_accuracy_m, 1) + " m");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(15, 17, s_r20.distance_from_site_m, 1), " m");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(18, 20, s_r20.depth_reached_cm, 0), " cm");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r20.photo_ids.length);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(fc_r22 ? 22 : 23);
    \u0275\u0275advance(3);
    \u0275\u0275property("status", s_r20.status === "none" ? "pending" : "active");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(27, 23, s_r20.status));
  }
}
function CampaignPage_Conditional_5_Conditional_56_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52)(1, "table", 53)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Sample");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Site");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Collected");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 16);
    \u0275\u0275text(11, "GPS accuracy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 16);
    \u0275\u0275text(13, "From site");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 16);
    \u0275\u0275text(15, "Depth");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 16);
    \u0275\u0275text(17, "Photos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 16);
    \u0275\u0275text(19, "QA findings");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Custody");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "tbody");
    \u0275\u0275repeaterCreate(23, CampaignPage_Conditional_5_Conditional_56_Conditional_4_For_24_Template, 28, 25, "tr", 93, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(23);
    \u0275\u0275repeater(ctx_r0.samples());
  }
}
function CampaignPage_Conditional_5_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2);
    \u0275\u0275conditionalCreate(1, CampaignPage_Conditional_5_Conditional_56_Conditional_1_Template, 1, 1, "vc-loading", 4)(2, CampaignPage_Conditional_5_Conditional_56_Conditional_2_Template, 2, 1, "div", 90)(3, CampaignPage_Conditional_5_Conditional_56_Conditional_3_Template, 1, 0, "vc-empty", 91)(4, CampaignPage_Conditional_5_Conditional_56_Conditional_4_Template, 25, 0, "div", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.sLoading() ? 1 : ctx_r0.sError() ? 2 : !ctx_r0.samples().length ? 3 : 4);
  }
}
function CampaignPage_Conditional_5_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " This paired campaign re-visits every site of its baseline campaign, in the same order. ");
  }
}
function CampaignPage_Conditional_5_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Random points are placed inside each zone's fields, using the approved number of cores per zone. ");
  }
}
function CampaignPage_Conditional_5_Conditional_71_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, ` You created or edited this plan, so you can't approve it. A second person must check it \u2014 this "four-eyes" rule stops one person deciding alone how much the zone is sampled. `);
  }
}
function CampaignPage_Conditional_5_Conditional_71_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Four-eyes rule: the person who created or edited a plan can't approve it. Once approved, the plan can't be changed. ");
  }
}
function CampaignPage_Conditional_5_Conditional_71_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 98);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pl_r23 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(pl_r23.warnings[0].message);
  }
}
function CampaignPage_Conditional_5_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 26)(1, "dt");
    \u0275\u0275text(2, "Zone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd")(4, "code");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "dt");
    \u0275\u0275text(7, "Cores required");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "dd")(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dt");
    \u0275\u0275text(13, "Created by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dt");
    \u0275\u0275text(17, "Justification");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "vc-callout", 97);
    \u0275\u0275conditionalCreate(21, CampaignPage_Conditional_5_Conditional_71_Conditional_21_Template, 1, 0)(22, CampaignPage_Conditional_5_Conditional_71_Conditional_22_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(23, CampaignPage_Conditional_5_Conditional_71_Conditional_23_Template, 2, 1, "vc-callout", 98);
  }
  if (rf & 2) {
    const pl_r23 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(pl_r23.stratum_code);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(pl_r23.n_required);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" (", pl_r23.method === "manual" ? "entered" : "variance formula", ")");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(pl_r23.created_by || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(pl_r23.justification);
    \u0275\u0275advance();
    \u0275\u0275property("tone", ctx_r0.isMine(pl_r23) ? "warn" : "info");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isMine(pl_r23) ? 21 : 22);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(pl_r23.warnings.length ? 23 : -1);
  }
}
function CampaignPage_Conditional_5_Conditional_73_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd", 16);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const k_r24 = ctx.$implicit;
    const pl_r25 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, k_r24));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(pl_r25.inputs[k_r24]);
  }
}
function CampaignPage_Conditional_5_Conditional_73_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "day");
  }
  if (rf & 2) {
    const pl_r25 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate2(" by ", pl_r25.approved_by, " on ", \u0275\u0275pipeBind2(1, 2, pl_r25.approved_at, true), " ");
  }
}
function CampaignPage_Conditional_5_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 26)(1, "dt");
    \u0275\u0275text(2, "Cores required");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " ");
    \u0275\u0275element(7, "vc-dc", 99);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "dt");
    \u0275\u0275text(9, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "dd");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(12, CampaignPage_Conditional_5_Conditional_73_For_13_Template, 5, 4, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(14, "dt");
    \u0275\u0275text(15, "Justification");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dt");
    \u0275\u0275text(19, "Created by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dd");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dt");
    \u0275\u0275text(23, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dd");
    \u0275\u0275element(25, "vc-badge", 9);
    \u0275\u0275conditionalCreate(26, CampaignPage_Conditional_5_Conditional_73_Conditional_26_Template, 2, 5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pl_r25 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(pl_r25.n_required);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(pl_r25.method === "manual" ? "Entered by hand" : "n = \u2308(z\xB7sd/(e\xB7mean))\xB2\u2309");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.inputKeys(pl_r25));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(pl_r25.justification);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(pl_r25.created_by || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275property("status", pl_r25.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(pl_r25.approved_by ? 26 : -1);
  }
}
function CampaignPage_Conditional_5_Conditional_76_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 29);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r0.collectorsError());
  }
}
function CampaignPage_Conditional_5_For_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r26 = ctx.$implicit;
    \u0275\u0275property("value", u_r26.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", u_r26.full_name, " \xB7 ", u_r26.email);
  }
}
function CampaignPage_Conditional_5_Conditional_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1, "No active field collectors in your organisation yet.");
    \u0275\u0275elementEnd();
  }
}
function CampaignPage_Conditional_5_Conditional_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function CampaignPage_Conditional_5_Conditional_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 41);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r0.detailError());
  }
}
function CampaignPage_Conditional_5_Conditional_95_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-sample-view", 42);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("sample", ctx)("findings", ctx_r0.detailFindings());
  }
}
function CampaignPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "header", 5)(1, "div", 6)(2, "div", 7)(3, "code", 8);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "vc-badge", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h1");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 10)(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "human");
    \u0275\u0275pipe(12, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "day");
    \u0275\u0275pipe(16, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "num");
    \u0275\u0275pipe(20, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span");
    \u0275\u0275text(22, "Placement seed ");
    \u0275\u0275elementStart(23, "code");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(25, "section", 11)(26, "ol");
    \u0275\u0275repeaterCreate(27, CampaignPage_Conditional_5_For_28_Template, 10, 9, "li", 12, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(29, CampaignPage_Conditional_5_Conditional_29_Template, 7, 4, "div", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 14)(31, "div", 15)(32, "span");
    \u0275\u0275text(33, "Zones with approved plans");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "strong", 16);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 15)(37, "span");
    \u0275\u0275text(38, "Points");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "strong", 16);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 15)(42, "span");
    \u0275\u0275text(43, "Collected");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "strong", 16);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd();
    \u0275\u0275element(46, "vc-progress", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 15)(48, "span");
    \u0275\u0275text(49, "Bags with accepted soil carbon");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "strong", 16);
    \u0275\u0275text(51);
    \u0275\u0275elementEnd();
    \u0275\u0275element(52, "vc-progress", 17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "vc-tabs", 18);
    \u0275\u0275twoWayListener("activeChange", function CampaignPage_Conditional_5_Template_vc_tabs_activeChange_53_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.tab, $event) || (ctx_r0.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(54, CampaignPage_Conditional_5_Conditional_54_Template, 8, 1, "section", 2);
    \u0275\u0275conditionalCreate(55, CampaignPage_Conditional_5_Conditional_55_Template, 2, 1);
    \u0275\u0275conditionalCreate(56, CampaignPage_Conditional_5_Conditional_56_Template, 5, 1, "section", 2);
    \u0275\u0275elementStart(57, "vc-plan-modal", 19);
    \u0275\u0275twoWayListener("openChange", function CampaignPage_Conditional_5_Template_vc_plan_modal_openChange_57_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.planOpen, $event) || (ctx_r0.planOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("saved", function CampaignPage_Conditional_5_Template_vc_plan_modal_saved_57_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.reload());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "vc-s-confirm", 20);
    \u0275\u0275pipe(59, "human");
    \u0275\u0275pipe(60, "human");
    \u0275\u0275twoWayListener("openChange", function CampaignPage_Conditional_5_Template_vc_s_confirm_openChange_58_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.advanceOpen, $event) || (ctx_r0.advanceOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("confirmed", function CampaignPage_Conditional_5_Template_vc_s_confirm_confirmed_58_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.advance());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "vc-s-confirm", 21);
    \u0275\u0275twoWayListener("openChange", function CampaignPage_Conditional_5_Template_vc_s_confirm_openChange_61_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.placeOpen, $event) || (ctx_r0.placeOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("confirmed", function CampaignPage_Conditional_5_Template_vc_s_confirm_confirmed_61_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.place());
    });
    \u0275\u0275elementStart(62, "p", 22);
    \u0275\u0275conditionalCreate(63, CampaignPage_Conditional_5_Conditional_63_Template, 1, 0)(64, CampaignPage_Conditional_5_Conditional_64_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "vc-callout", 23);
    \u0275\u0275text(66, " Placement uses seed ");
    \u0275\u0275elementStart(67, "code");
    \u0275\u0275text(68);
    \u0275\u0275elementEnd();
    \u0275\u0275text(69, ", combined with each zone's code. The same seed and zones always give the same points, so an auditor can reproduce them exactly. Points can be placed only once per campaign. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "vc-s-confirm", 24);
    \u0275\u0275twoWayListener("openChange", function CampaignPage_Conditional_5_Template_vc_s_confirm_openChange_70_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.approveOpen, $event) || (ctx_r0.approveOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("confirmed", function CampaignPage_Conditional_5_Template_vc_s_confirm_confirmed_70_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.approve());
    });
    \u0275\u0275conditionalCreate(71, CampaignPage_Conditional_5_Conditional_71_Template, 24, 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "vc-modal", 25);
    \u0275\u0275listener("closed", function CampaignPage_Conditional_5_Template_vc_modal_closed_72_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.viewPlan.set(null));
    });
    \u0275\u0275conditionalCreate(73, CampaignPage_Conditional_5_Conditional_73_Template, 27, 6, "dl", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "vc-modal", 27);
    \u0275\u0275twoWayListener("openChange", function CampaignPage_Conditional_5_Template_vc_modal_openChange_74_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.assignOpen, $event) || (ctx_r0.assignOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(75, "div", 28);
    \u0275\u0275conditionalCreate(76, CampaignPage_Conditional_5_Conditional_76_Template, 1, 1, "vc-error", 29);
    \u0275\u0275elementStart(77, "div", 30)(78, "label", 31);
    \u0275\u0275text(79, "Field collector");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "select", 32);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function CampaignPage_Conditional_5_Template_select_ngModelChange_80_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.assignUser, $event) || (ctx_r0.assignUser = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(81, "option", 33);
    \u0275\u0275text(82, "Choose a collector\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(83, CampaignPage_Conditional_5_For_84_Template, 2, 3, "option", 34, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(85, CampaignPage_Conditional_5_Conditional_85_Template, 2, 0, "span", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerStart(86, 36);
    \u0275\u0275elementStart(87, "button", 37);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Template_button_click_87_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.assignOpen.set(false));
    });
    \u0275\u0275text(88, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "button", 38);
    \u0275\u0275listener("click", function CampaignPage_Conditional_5_Template_button_click_89_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.assign());
    });
    \u0275\u0275element(90, "vc-icon", 39);
    \u0275\u0275text(91, "Assign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "vc-modal", 40);
    \u0275\u0275listener("closed", function CampaignPage_Conditional_5_Template_vc_modal_closed_92_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.sampleOpen.set(null));
    });
    \u0275\u0275conditionalCreate(93, CampaignPage_Conditional_5_Conditional_93_Template, 1, 1, "vc-loading", 4)(94, CampaignPage_Conditional_5_Conditional_94_Template, 1, 1, "vc-error", 41)(95, CampaignPage_Conditional_5_Conditional_95_Template, 1, 2, "vc-sample-view", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_39_0;
    let tmp_42_0;
    let tmp_55_0;
    const c_r5 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r5.code);
    \u0275\u0275advance();
    \u0275\u0275property("status", c_r5.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r5.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(11, 55, c_r5.kind), " \xB7 ", \u0275\u0275pipeBind1(12, 57, c_r5.design), " design");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(15, 59, c_r5.planned_start), " \u2013 ", \u0275\u0275pipeBind1(16, 61, c_r5.planned_end));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("Depth ", \u0275\u0275pipeBind2(19, 63, c_r5.depth_from_cm, 0), "\u2013", \u0275\u0275pipeBind2(20, 66, c_r5.depth_to_cm, 0), " cm");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(c_r5.placement_seed);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.flow);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r5.next_status && ctx_r0.auth.can("sampling.plan") ? 29 : -1);
    const p_r27 = c_r5.progress;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", ctx_r0.approvedCount(), " / ", ctx_r0.zones().length);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(p_r27?.points_total ?? 0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(p_r27?.points_collected ?? 0);
    \u0275\u0275advance();
    \u0275\u0275property("value", p_r27?.points_collected ?? 0)("max", p_r27?.points_total || 1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", p_r27?.layers_with_accepted_soc ?? 0, " / ", p_r27?.layers_total ?? 0);
    \u0275\u0275advance();
    \u0275\u0275property("value", p_r27?.layers_with_accepted_soc ?? 0)("max", p_r27?.layers_total || 1);
    \u0275\u0275advance();
    \u0275\u0275property("tabs", ctx_r0.tabs());
    \u0275\u0275twoWayProperty("active", ctx_r0.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.tab() === "plans" ? 54 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.tab() === "points" ? 55 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.tab() === "samples" ? 56 : -1);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.planOpen);
    \u0275\u0275property("campaignId", c_r5.id)("zone", ctx_r0.planZone());
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.advanceOpen);
    \u0275\u0275property("title", "Move campaign to " + \u0275\u0275pipeBind1(59, 69, c_r5.next_status) + "?")("message", ctx_r0.nextText[c_r5.next_status ?? ""] ?? "")("confirmLabel", "Move to " + \u0275\u0275pipeBind1(60, 71, c_r5.next_status))("busy", ctx_r0.busy());
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("open", ctx_r0.placeOpen);
    \u0275\u0275property("busy", ctx_r0.busy());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r5.kind === "monitoring" && c_r5.design === "paired" ? 63 : 64);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(c_r5.placement_seed);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("open", ctx_r0.approveOpen);
    \u0275\u0275property("busy", ctx_r0.busy());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_39_0 = ctx_r0.approveTarget()) ? 71 : -1, tmp_39_0);
    \u0275\u0275advance();
    \u0275\u0275property("open", !!ctx_r0.viewPlan())("title", "Plan for zone " + (ctx_r0.viewPlan()?.stratum_code ?? ""));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_42_0 = ctx_r0.viewPlan()) ? 73 : -1, tmp_42_0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.assignOpen);
    \u0275\u0275property("subtitle", ctx_r0.selected().size + " planned point(s) selected. Collectors see only the points assigned to them.");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.collectorsError() ? 76 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.assignUser);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.collectors());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.collectors().length && !ctx_r0.collectorsError() ? 85 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r0.assignUser || ctx_r0.busy());
    \u0275\u0275advance(3);
    \u0275\u0275property("open", !!ctx_r0.sampleOpen())("drawer", true)("title", "Sample " + (ctx_r0.sampleOpen()?.code ?? ""))("subtitle", "Site " + (ctx_r0.sampleOpen()?.site_code ?? "") + " \xB7 a core as collected; never edited.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.detailLoading() ? 93 : ctx_r0.detailError() ? 94 : (tmp_55_0 = ctx_r0.detail()) ? 95 : -1, tmp_55_0);
  }
}
var FLOW = ["planned", "fieldwork", "lab", "complete"];
var STEP_TEXT = {
  planned: "Plans and points",
  fieldwork: "Cores collected",
  lab: "Bags analysed",
  complete: "Closed"
};
var NEXT_TEXT = {
  fieldwork: "Collectors can start recording cores. Points must already be placed.",
  lab: "Fieldwork ends. Remaining cores can still sync, and bags go to the lab.",
  complete: "The campaign closes. No more cores are accepted."
};
var CampaignPage = class _CampaignPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  flow = FLOW;
  stepText = STEP_TEXT;
  nextText = NEXT_TEXT;
  c = signal(
    null,
    ...ngDevMode ? [{ debugName: "c" }] : (
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
  zones = signal(
    [],
    ...ngDevMode ? [{ debugName: "zones" }] : (
      /* istanbul ignore next */
      []
    )
  );
  plans = signal(
    [],
    ...ngDevMode ? [{ debugName: "plans" }] : (
      /* istanbul ignore next */
      []
    )
  );
  points = signal(
    [],
    ...ngDevMode ? [{ debugName: "points" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fields = signal(
    null,
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  samples = signal(
    [],
    ...ngDevMode ? [{ debugName: "samples" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "sLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sError = signal(
    null,
    ...ngDevMode ? [{ debugName: "sError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  findings = signal(
    [],
    ...ngDevMode ? [{ debugName: "findings" }] : (
      /* istanbul ignore next */
      []
    )
  );
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tab = signal(
    "plans",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  planOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "planOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  planZone = signal(
    null,
    ...ngDevMode ? [{ debugName: "planZone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  advanceOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "advanceOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  placeOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "placeOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approveTarget = signal(
    null,
    ...ngDevMode ? [{ debugName: "approveTarget" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approveOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "approveOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  viewPlan = signal(
    null,
    ...ngDevMode ? [{ debugName: "viewPlan" }] : (
      /* istanbul ignore next */
      []
    )
  );
  assignOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "assignOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  collectors = signal(
    [],
    ...ngDevMode ? [{ debugName: "collectors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  collectorsError = signal(
    null,
    ...ngDevMode ? [{ debugName: "collectorsError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  assignUser = "";
  selected = signal(
    /* @__PURE__ */ new Set(),
    ...ngDevMode ? [{ debugName: "selected" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pStatus = signal(
    "",
    ...ngDevMode ? [{ debugName: "pStatus" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pAssignee = signal(
    "",
    ...ngDevMode ? [{ debugName: "pAssignee" }] : (
      /* istanbul ignore next */
      []
    )
  );
  focusPoint = signal(
    null,
    ...ngDevMode ? [{ debugName: "focusPoint" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sampleOpen = signal(
    null,
    ...ngDevMode ? [{ debugName: "sampleOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  detail = signal(
    null,
    ...ngDevMode ? [{ debugName: "detail" }] : (
      /* istanbul ignore next */
      []
    )
  );
  detailLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "detailLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  detailError = signal(
    null,
    ...ngDevMode ? [{ debugName: "detailError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  stepIndex = computed(
    () => FLOW.indexOf(this.c()?.status ?? "planned"),
    ...ngDevMode ? [{ debugName: "stepIndex" }] : (
      /* istanbul ignore next */
      []
    )
  );
  planRows = computed(
    () => this.zones().map((z) => ({ zone: z, plan: this.plans().find((p) => p.stratum_id === z.id) ?? null })),
    ...ngDevMode ? [{ debugName: "planRows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approvedCount = computed(
    () => this.planRows().filter((r) => r.plan?.status === "approved").length,
    ...ngDevMode ? [{ debugName: "approvedCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  allApproved = computed(
    () => this.zones().length > 0 && this.approvedCount() === this.zones().length,
    ...ngDevMode ? [{ debugName: "allApproved" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "plans", label: "Sample plans", count: this.plans().length },
      { key: "points", label: "Points", count: this.points().length },
      { key: "samples", label: "Samples", count: this.c()?.progress?.points_collected ?? null }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  assignees = computed(
    () => [...new Set(this.points().map((p) => p.assigned_to_name).filter((x) => !!x))].sort(),
    ...ngDevMode ? [{ debugName: "assignees" }] : (
      /* istanbul ignore next */
      []
    )
  );
  shownPoints = computed(
    () => this.points().filter((p) => (!this.pStatus() || p.status === this.pStatus()) && (!this.pAssignee() || (this.pAssignee() === "__none" ? !p.assigned_to : p.assigned_to_name === this.pAssignee()))),
    ...ngDevMode ? [{ debugName: "shownPoints" }] : (
      /* istanbul ignore next */
      []
    )
  );
  allShownSelected = computed(
    () => {
      const planned = this.shownPoints().filter((p) => p.status === "planned");
      return planned.length > 0 && planned.every((p) => this.selected().has(p.id));
    },
    ...ngDevMode ? [{ debugName: "allShownSelected" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pointsFc = computed(
    () => ({
      type: "FeatureCollection",
      features: this.points().map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
        properties: {
          id: p.id,
          color: STATUS_COLOR[p.status] ?? "#737c76",
          label: `<strong>${p.site_code}</strong><br>${p.field_code} \xB7 ${p.status}${p.assigned_to_name ? "<br>" + p.assigned_to_name : ""}`
        }
      }))
    }),
    ...ngDevMode ? [{ debugName: "pointsFc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldsFc = computed(
    () => {
      const f = this.fields();
      if (!f)
        return null;
      const inZone = new Set(this.zones().flatMap((z) => z.field_ids));
      return __spreadProps(__spreadValues({}, f), {
        features: f.features.filter((x) => inZone.has(String(x.properties?.["id"]))).map((x) => __spreadProps(__spreadValues({}, x), {
          properties: __spreadProps(__spreadValues({}, x.properties), { color: "#2f7249", label: `<strong>${x.properties?.["code"]}</strong><br>${x.properties?.["name"] ?? ""}` })
        }))
      });
    },
    ...ngDevMode ? [{ debugName: "fieldsFc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  findingCount = computed(
    () => {
      const m = /* @__PURE__ */ new Map();
      for (const f of this.findings())
        if (f.status === "open" || f.status === "acknowledged")
          m.set(f.entity_id, (m.get(f.entity_id) ?? 0) + 1);
      return m;
    },
    ...ngDevMode ? [{ debugName: "findingCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  detailFindings = computed(
    () => this.findings().filter((f) => f.entity_id === this.detail()?.id && (f.status === "open" || f.status === "acknowledged")),
    ...ngDevMode ? [{ debugName: "detailFindings" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      this.id();
      untracked(() => this.load());
    });
    effect(() => {
      if (this.tab() === "samples" && this.c())
        untracked(() => this.loadSamples());
    });
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/campaigns/${this.id()}`).subscribe({
      next: (c) => {
        this.c.set(c);
        this.plans.set(c.plans ?? []);
        this.loading.set(false);
        this.loadSide(c);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  reload() {
    this.api.get(`/campaigns/${this.id()}`).subscribe({
      next: (c) => {
        this.c.set(c);
        this.plans.set(c.plans ?? []);
        this.loadPoints();
      },
      error: (e) => this.toast.apiError(e, "Couldn't refresh the campaign")
    });
  }
  loadSide(c) {
    forkJoin({
      zones: this.api.get(`/projects/${c.project_id}/strata`).pipe(catchError(() => of([]))),
      fields: this.api.get("/fields/geojson", { project_id: c.project_id }).pipe(catchError(() => of(null)))
    }).subscribe((r) => {
      this.zones.set(r.zones);
      this.fields.set(r.fields);
    });
    this.loadPoints();
  }
  loadPoints() {
    this.api.get(`/campaigns/${this.id()}/points`).subscribe({
      next: (p) => this.points.set(p),
      error: () => this.points.set([])
    });
  }
  loadSamples() {
    const c = this.c();
    if (!c)
      return;
    this.sLoading.set(true);
    this.sError.set(null);
    this.api.get("/samples", { campaign_id: c.id }).subscribe({
      next: (s) => {
        this.samples.set(s);
        this.sLoading.set(false);
      },
      error: (e) => {
        this.sError.set(e.message);
        this.sLoading.set(false);
      }
    });
    if (this.auth.can("data.read")) {
      this.api.get(`/projects/${c.project_id}/qa/findings`, { entity_type: "sample", limit: 2e3 }).subscribe({
        next: (f) => this.findings.set(f),
        error: () => this.findings.set([])
      });
    }
  }
  openApprove(pl) {
    this.approveTarget.set(pl);
    this.approveOpen.set(true);
  }
  openPlan(z) {
    this.planZone.set(z);
    this.planOpen.set(true);
  }
  isMine(pl) {
    return !!pl.created_by && pl.created_by === this.auth.profile()?.full_name;
  }
  inputKeys(pl) {
    return Object.keys(pl.inputs ?? {});
  }
  advance() {
    const c = this.c();
    if (!c?.next_status)
      return;
    this.busy.set(true);
    this.api.post(`/campaigns/${c.id}/status`, { status: c.next_status }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.advanceOpen.set(false);
        this.c.set(__spreadProps(__spreadValues({}, r), { plans: this.plans() }));
        this.toast.success(`Campaign moved to ${r.status}`);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't change the campaign status");
      }
    });
  }
  place() {
    this.busy.set(true);
    this.api.post(`/campaigns/${this.id()}/place-points`).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.placeOpen.set(false);
        this.toast.success(`${r.points_created} points placed`, `Seed ${r.seed} \u2014 anyone can reproduce this placement.`);
        this.reload();
      },
      error: (e) => {
        this.busy.set(false);
        const missing = e.details?.["strata"]?.join(", ");
        this.toast.error("Couldn't place points", missing ? `${e.message} Missing: ${missing}.` : e.message);
      }
    });
  }
  approve() {
    const pl = this.approveTarget();
    if (!pl)
      return;
    this.busy.set(true);
    this.api.post(`/sample-plans/${pl.id}/approve`).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.approveOpen.set(false);
        this.plans.update((ps) => ps.map((p) => p.id === r.id ? r : p));
        this.toast.success(`Plan for ${r.stratum_code} approved`);
      },
      error: (e) => {
        this.busy.set(false);
        if (e.code === "SELF_APPROVAL_REJECTED") {
          this.toast.error("You can\u2019t approve your own plan", "Someone who did not create or edit this plan must approve it.");
        } else
          this.toast.apiError(e, "Couldn't approve the plan");
      }
    });
  }
  toggle(id) {
    const s = new Set(this.selected());
    s.has(id) ? s.delete(id) : s.add(id);
    this.selected.set(s);
  }
  toggleAll() {
    const planned = this.shownPoints().filter((p) => p.status === "planned").map((p) => p.id);
    const s = new Set(this.selected());
    if (this.allShownSelected())
      planned.forEach((id) => s.delete(id));
    else
      planned.forEach((id) => s.add(id));
    this.selected.set(s);
  }
  onMapClick(e) {
    if (e.layer !== "point")
      return;
    this.focusPoint.set(e.id);
  }
  openAssign() {
    this.assignUser = "";
    this.collectorsError.set(null);
    this.assignOpen.set(true);
    this.api.get("/users", { role: "field_collector" }).subscribe({
      next: (u) => this.collectors.set(u.filter((x) => x.role === "field_collector" && x.is_active)),
      error: (e) => this.collectorsError.set(e.message)
    });
  }
  assign() {
    this.busy.set(true);
    this.api.post(`/campaigns/${this.id()}/assign`, {
      user_id: this.assignUser,
      point_ids: [...this.selected()]
    }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.assignOpen.set(false);
        this.selected.set(/* @__PURE__ */ new Set());
        this.toast.success(`${r.assigned} point(s) assigned to ${r.user_name}`);
        this.loadPoints();
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't assign the points");
      }
    });
  }
  openSample(s) {
    this.sampleOpen.set(s);
    this.detail.set(null);
    this.detailLoading.set(true);
    this.detailError.set(null);
    this.api.get(`/samples/${s.id}`).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.detailLoading.set(false);
      },
      error: (e) => {
        this.detailError.set(e.message);
        this.detailLoading.set(false);
      }
    });
  }
  static \u0275fac = function CampaignPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CampaignPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CampaignPage, selectors: [["vc-campaign-page"]], inputs: { id: [1, "id"] }, decls: 6, vars: 2, consts: [["routerLink", "/app/sampling", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this campaign", 3, "message"], [3, "rows"], [1, "hd"], [1, "titles"], [1, "row", 2, "--gap", "10px"], [1, "code"], [3, "status"], [1, "meta"], [1, "card", "stepper"], [3, "done", "cur"], [1, "next"], [1, "kpis"], [1, "kpi"], [1, "num"], [3, "value", "max"], [3, "activeChange", "tabs", "active"], [3, "openChange", "saved", "open", "campaignId", "zone"], ["icon", "arrow-right", 3, "openChange", "confirmed", "open", "title", "message", "confirmLabel", "busy"], ["title", "Place sampling points?", "confirmLabel", "Place points", "icon", "shuffle", 3, "openChange", "confirmed", "open", "busy"], [1, "muted"], ["tone", "info", "icon", "fingerprint"], ["title", "Approve this sample plan?", "confirmLabel", "Approve plan", "icon", "check", 3, "openChange", "confirmed", "open", "busy"], ["width", "520px", 3, "closed", "open", "title"], [1, "kv"], ["title", "Assign points to a collector", "width", "480px", 3, "openChange", "open", "subtitle"], [1, "stack", 2, "--gap", "14px"], ["title", "Couldn't load collectors", 3, "message"], [1, "field"], ["for", "as-user"], ["id", "as-user", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "hint"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "user-plus"], ["width", "680px", 3, "closed", "open", "drawer", "title", "subtitle"], ["title", "Couldn't load the sample", 3, "message"], [3, "sample", "findings"], [1, "dot"], ["name", "check", 3, "size"], [1, "lbl"], [1, "muted", "small"], [1, "btn", "btn-primary", 3, "click"], ["name", "arrow-right"], [1, "card-head"], [1, "subtle", "small"], ["icon", "layers", "title", "This project has no zones", "text", "Draw the zones on the Sampling page first \u2014 each zone needs its own plan."], [1, "table-wrap"], [1, "table"], [1, "small", "muted"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [1, "btn", "btn-secondary", "btn-sm"], [1, "warn"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], [1, "num", "subtle"], ["colspan", "4", 1, "subtle"], ["name", "plus", 3, "size"], [1, "pgrid"], ["icon", "pin", "title", "No points placed yet", 3, "text"], [1, "btn", "btn-primary", 3, "disabled"], ["name", "shuffle"], ["height", "520px", 1, "map", 3, "featureClick", "polygons", "points"], [1, "legend-map"], [2, "background", "#737c76"], [2, "background", "#2f7249"], [2, "background", "#c76329"], [1, "card", "ptable"], [1, "card-head", "wrap"], ["aria-label", "Status", 1, "input", "sel", 3, "ngModelChange", "ngModel"], ["value", "planned"], ["value", "collected"], ["value", "skipped"], ["aria-label", "Assignee", 1, "input", "sel", 3, "ngModelChange", "ngModel"], ["value", "__none"], [1, "spacer"], [1, "btn", "btn-primary", "btn-sm", 3, "disabled"], [1, "table-wrap", "scroll"], [2, "width", "36px"], [3, "hl"], [1, "btn", "btn-primary", "btn-sm", 3, "click", "disabled"], ["name", "user-plus", 3, "size"], ["type", "checkbox", "aria-label", "Select all planned", 1, "cb", 3, "change", "checked"], [1, "nowrap"], ["type", "checkbox", 1, "cb", 3, "change", "disabled", "checked"], ["colspan", "5", 1, "muted"], [1, "card-body"], ["icon", "shovel", "title", "No cores recorded yet", "text", "Samples appear here as soon as collectors sync them from the field app."], ["title", "Couldn't load samples", 3, "message"], [1, "clickable"], [1, "clickable", 3, "click"], [1, "fcount"], [1, "subtle"], ["icon", "users", 3, "tone"], ["tone", "warn", "icon", "alert"], ["cls", "CALCULATED"]], template: function CampaignPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All campaigns");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, CampaignPage_Conditional_3_Template, 2, 1, "div", 2)(4, CampaignPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, CampaignPage_Conditional_5_Template, 96, 73);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.c()) ? 5 : -1, tmp_1_0);
    }
  }, dependencies: [
    FormsModule,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    SelectControlValueAccessor,
    NgControlStatus,
    NgModel,
    RouterLink,
    Icon,
    Badge,
    Callout,
    DataClass,
    Empty,
    ErrorBox,
    Loading,
    Modal,
    Progress,
    Tabs,
    MapView,
    ConfirmDialog,
    PlanModal,
    SampleView,
    DayPipe,
    NumPipe,
    HumanPipe
  ], styles: ['\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-bottom: 14px;\n}\n.hd[_ngcontent-%COMP%] {\n  margin-bottom: 18px;\n}\n.titles[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin-top: 6px;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%stone-600);\n}\n.meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 18px;\n  margin-top: 8px;\n  color: var(--%NS%text-2);\n  font-size: 13px;\n}\n.stepper[_ngcontent-%COMP%] {\n  padding: 18px 20px;\n  margin-bottom: 16px;\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  flex-wrap: wrap;\n}\n.stepper[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  gap: 0;\n  min-width: 520px;\n}\n.stepper[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  position: relative;\n  padding-right: 14px;\n}\n.stepper[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(:last-child)::after {\n  content: "";\n  flex: 1;\n  height: 2px;\n  background: var(--%NS%sand-200);\n  margin-left: 4px;\n}\n.stepper[_ngcontent-%COMP%]   li.done[_ngcontent-%COMP%]:not(:last-child)::after {\n  background: var(--%NS%forest-400);\n}\n.dot[_ngcontent-%COMP%] {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  border: 2px solid var(--%NS%sand-300);\n  background: var(--%NS%surface);\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--%NS%stone-500);\n}\nli.done[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n  border-color: var(--%NS%forest-500);\n  color: #fff;\n}\nli.cur[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-600);\n  color: var(--%NS%forest-700);\n  box-shadow: 0 0 0 4px var(--%NS%forest-100);\n}\n.lbl[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n  white-space: nowrap;\n}\n.lbl[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13px;\n}\n.lbl[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\nli.cur[_ngcontent-%COMP%]   .lbl[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.next[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  max-width: 460px;\n}\n.kpis[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.kpi[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  padding: 12px 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.kpi[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.kpi[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n}\n.warn[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.pgrid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);\n  gap: 16px;\n  align-items: start;\n}\n.ptable[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  max-height: 520px;\n}\n.card-head.wrap[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.sel[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 130px;\n  height: 32px;\n}\n.scroll[_ngcontent-%COMP%] {\n  overflow: auto;\n  flex: 1;\n}\n.cb[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n  width: 16px;\n  height: 16px;\n}\ntr.hl[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n}\n.legend-map[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 10px;\n  bottom: 10px;\n  z-index: 2;\n  display: flex;\n  gap: 12px;\n  padding: 6px 10px;\n  background: var(--%NS%surface);\n  border-radius: 8px;\n  box-shadow: var(--%NS%shadow);\n  font-size: 12px;\n}\n.legend-map[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n}\n.legend-map[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  border: 1.5px solid #fff;\n  box-shadow: 0 0 0 1px var(--%NS%stone-300);\n}\n.fcount[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  min-width: 22px;\n  height: 20px;\n  padding: 0 6px;\n  border-radius: 10px;\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n  font-weight: 600;\n  font-size: 12px;\n}\n@media (max-width: 1100px) {\n  .pgrid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .kpis[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .stepper[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%] {\n    min-width: 0;\n    flex-wrap: wrap;\n  }\n}\n/*# sourceMappingURL=campaign.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignPage, [{
    type: Component,
    args: [{ selector: "vc-campaign-page", imports: [
      FormsModule,
      RouterLink,
      Icon,
      Badge,
      Callout,
      DataClass,
      Empty,
      ErrorBox,
      Loading,
      Modal,
      Progress,
      Tabs,
      MapView,
      ConfirmDialog,
      PlanModal,
      SampleView,
      DayPipe,
      NumPipe,
      HumanPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/sampling" class="back"><vc-icon name="arrow-left" [size]="15" />All campaigns</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="7" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this campaign" [message]="error()!" />
    } @else if (c(); as c) {
      <header class="hd">
        <div class="titles">
          <div class="row" style="--gap:10px"><code class="code">{{ c.code }}</code><vc-badge [status]="c.status" /></div>
          <h1>{{ c.name }}</h1>
          <div class="meta">
            <span>{{ c.kind | human }} \xB7 {{ c.design | human }} design</span>
            <span>{{ c.planned_start | day }} \u2013 {{ c.planned_end | day }}</span>
            <span>Depth {{ c.depth_from_cm | num: 0 }}\u2013{{ c.depth_to_cm | num: 0 }} cm</span>
            <span>Placement seed <code>{{ c.placement_seed }}</code></span>
          </div>
        </div>
      </header>

      <section class="card stepper">
        <ol>
          @for (s of flow; track s; let i = $index) {
            <li [class.done]="i < stepIndex() || c.status === 'complete'" [class.cur]="i === stepIndex() && c.status !== 'complete'">
              <span class="dot">@if (i < stepIndex() || c.status === 'complete') { <vc-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span>
              <span class="lbl"><strong>{{ s | human }}</strong><em>{{ stepText[s] }}</em></span>
            </li>
          }
        </ol>
        @if (c.next_status && auth.can('sampling.plan')) {
          <div class="next">
            <span class="muted small">{{ nextText[c.next_status] }}</span>
            <button class="btn btn-primary" (click)="advanceOpen.set(true)"><vc-icon name="arrow-right" />Move to {{ c.next_status | human }}</button>
          </div>
        }
      </section>

      <div class="kpis">
        @let p = c.progress;
        <div class="kpi"><span>Zones with approved plans</span><strong class="num">{{ approvedCount() }} / {{ zones().length }}</strong></div>
        <div class="kpi"><span>Points</span><strong class="num">{{ p?.points_total ?? 0 }}</strong></div>
        <div class="kpi"><span>Collected</span><strong class="num">{{ p?.points_collected ?? 0 }}</strong>
          <vc-progress [value]="p?.points_collected ?? 0" [max]="p?.points_total || 1" /></div>
        <div class="kpi"><span>Bags with accepted soil carbon</span><strong class="num">{{ p?.layers_with_accepted_soc ?? 0 }} / {{ p?.layers_total ?? 0 }}</strong>
          <vc-progress [value]="p?.layers_with_accepted_soc ?? 0" [max]="p?.layers_total || 1" /></div>
      </div>

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      <!-- ------------------------------------------------------------ plans -->
      @if (tab() === 'plans') {
        <section class="card">
          <div class="card-head">
            <h3>Sample plans per zone</h3>
            <span class="subtle small">Created by one person, approved by another.</span>
          </div>
          @if (!zones().length) {
            <vc-empty icon="layers" title="This project has no zones" text="Draw the zones on the Sampling page first \u2014 each zone needs its own plan." />
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Zone</th><th class="num">Cores</th><th>Method</th><th>Inputs</th><th>Status</th><th>Created by</th><th></th></tr></thead>
                <tbody>
                  @for (row of planRows(); track row.zone.id) {
                    <tr>
                      <td><code>{{ row.zone.code }}</code>&ngsp;<span class="muted">{{ row.zone.name }}</span></td>
                      @if (row.plan; as pl) {
                        <td class="num"><strong>{{ pl.n_required }}</strong></td>
                        <td>{{ pl.method === 'manual' ? 'Entered' : 'Variance formula' }}</td>
                        <td class="small muted">
                          @if (pl.method === 'variance_formula') {
                            mean {{ pl.inputs['prior_mean'] }} \xB7 sd {{ pl.inputs['prior_sd'] }} \xB7 e {{ pl.inputs['target_error_pct'] }}% \xB7 {{ (pl.inputs['confidence'] || 0.9) * 100 }}%
                            @if (pl.inputs['floor_applied']) { <br /><span class="warn">raised to methodology minimum {{ pl.inputs['floor_applied'] }}</span> }
                          } @else { \u2014 }
                        </td>
                        <td>
                          <vc-badge [status]="pl.status" />
                          @if (pl.approved_by) { <div class="subtle small">by {{ pl.approved_by }}</div> }
                        </td>
                        <td>{{ pl.created_by || '\u2014' }}</td>
                        <td class="num">
                          <button class="btn btn-ghost btn-sm" (click)="viewPlan.set(pl)">Details</button>
                          @if (pl.status === 'draft' && auth.can('sampling.approve')) {
                            <button class="btn btn-secondary btn-sm" (click)="openApprove(pl)"><vc-icon name="check" [size]="14" />Approve</button>
                          }
                        </td>
                      } @else {
                        <td class="num subtle">\u2014</td><td class="subtle" colspan="4">No plan yet</td>
                        <td class="num">
                          @if (auth.can('sampling.plan') && c.status === 'planned') {
                            <button class="btn btn-secondary btn-sm" (click)="openPlan(row.zone)"><vc-icon name="plus" [size]="14" />Create plan</button>
                          }
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }

      <!-- ------------------------------------------------------------ points -->
      @if (tab() === 'points') {
        @if (!points().length) {
          <section class="card">
            <vc-empty icon="pin" title="No points placed yet"
              [text]="allApproved() ? 'Every zone has an approved plan. Place the points to create the sites collectors will visit.' : 'Every zone needs an approved sample plan before points can be placed.'">
              @if (auth.can('sampling.plan') && c.status === 'planned') {
                <button class="btn btn-primary" [disabled]="!allApproved()" (click)="placeOpen.set(true)"><vc-icon name="shuffle" />Place points</button>
              }
            </vc-empty>
          </section>
        } @else {
          <div class="pgrid">
            <vc-map class="map" height="520px" [polygons]="fieldsFc()" [points]="pointsFc()" (featureClick)="onMapClick($event)">
              <div class="legend-map">
                <span><i style="background:#737c76"></i>Planned</span>
                <span><i style="background:#2f7249"></i>Collected</span>
                <span><i style="background:#c76329"></i>Skipped</span>
              </div>
            </vc-map>
            <section class="card ptable">
              <div class="card-head wrap">
                <select class="input sel" [ngModel]="pStatus()" (ngModelChange)="pStatus.set($event)" aria-label="Status">
                  <option value="">All statuses</option><option value="planned">Planned</option>
                  <option value="collected">Collected</option><option value="skipped">Skipped</option>
                </select>
                <select class="input sel" [ngModel]="pAssignee()" (ngModelChange)="pAssignee.set($event)" aria-label="Assignee">
                  <option value="">Anyone</option><option value="__none">Unassigned</option>
                  @for (a of assignees(); track a) { <option [value]="a">{{ a }}</option> }
                </select>
                <div class="spacer"></div>
                @if (auth.can('sampling.plan')) {
                  <button class="btn btn-primary btn-sm" [disabled]="!selected().size" (click)="openAssign()">
                    <vc-icon name="user-plus" [size]="14" />Assign {{ selected().size || '' }}
                  </button>
                }
              </div>
              <div class="table-wrap scroll">
                <table class="table">
                  <thead><tr>
                    @if (auth.can('sampling.plan')) {
                      <th style="width:36px"><input type="checkbox" class="cb" [checked]="allShownSelected()" (change)="toggleAll()" aria-label="Select all planned" /></th>
                    }
                    <th>Site</th><th>Field</th><th>Assigned to</th><th>Status</th>
                  </tr></thead>
                  <tbody>
                    @for (p of shownPoints(); track p.id) {
                      <tr [class.hl]="p.id === focusPoint()">
                        @if (auth.can('sampling.plan')) {
                          <td><input type="checkbox" class="cb" [disabled]="p.status !== 'planned'" [checked]="selected().has(p.id)" (change)="toggle(p.id)" [attr.aria-label]="'Select ' + p.site_code" /></td>
                        }
                        <td class="nowrap"><code>{{ p.site_code }}</code></td>
                        <td class="nowrap">{{ p.field_code }}</td>
                        <td>{{ p.assigned_to_name || '\u2014' }}</td>
                        <td>
                          <vc-badge [status]="p.status" />
                          @if (p.skip_reason) { <div class="subtle small">{{ p.skip_reason }}</div> }
                        </td>
                      </tr>
                    } @empty {
                      <tr><td colspan="5" class="muted">No points match these filters.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        }
      }

      <!-- ------------------------------------------------------------ samples -->
      @if (tab() === 'samples') {
        <section class="card">
          @if (sLoading()) {
            <vc-loading [rows]="6" />
          } @else if (sError()) {
            <div class="card-body"><vc-error title="Couldn't load samples" [message]="sError()!" /></div>
          } @else if (!samples().length) {
            <vc-empty icon="shovel" title="No cores recorded yet" text="Samples appear here as soon as collectors sync them from the field app." />
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr>
                  <th>Sample</th><th>Site</th><th>Collected</th><th class="num">GPS accuracy</th><th class="num">From site</th>
                  <th class="num">Depth</th><th class="num">Photos</th><th class="num">QA findings</th><th>Custody</th>
                </tr></thead>
                <tbody>
                  @for (s of samples(); track s.id) {
                    @let fc = findingCount().get(s.id) ?? 0;
                    <tr class="clickable" (click)="openSample(s)">
                      <td><code>{{ s.code }}</code></td>
                      <td>{{ s.site_code }}</td>
                      <td class="nowrap">{{ s.collected_at | day: true }}</td>
                      <td class="num">{{ s.gps_accuracy_m === null ? '\u2014' : (s.gps_accuracy_m | num: 1) + ' m' }}</td>
                      <td class="num">{{ s.distance_from_site_m | num: 1 }} m</td>
                      <td class="num">{{ s.depth_reached_cm | num: 0 }} cm</td>
                      <td class="num">{{ s.photo_ids.length }}</td>
                      <td class="num">@if (fc) { <span class="fcount">{{ fc }}</span> } @else { <span class="subtle">0</span> }</td>
                      <td><vc-badge [status]="s.status === 'none' ? 'pending' : 'active'">{{ s.status | human }}</vc-badge></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }

      <!-- ------------------------------------------------------------ dialogs -->
      <vc-plan-modal [(open)]="planOpen" [campaignId]="c.id" [zone]="planZone()" (saved)="reload()" />

      <vc-s-confirm [(open)]="advanceOpen" [title]="'Move campaign to ' + (c.next_status | human) + '?'"
        [message]="nextText[c.next_status ?? ''] ?? ''" [confirmLabel]="'Move to ' + (c.next_status | human)" icon="arrow-right"
        [busy]="busy()" (confirmed)="advance()" />

      <vc-s-confirm [(open)]="placeOpen" title="Place sampling points?" confirmLabel="Place points" icon="shuffle" [busy]="busy()" (confirmed)="place()">
        <p class="muted">
          @if (c.kind === 'monitoring' && c.design === 'paired') {
            This paired campaign re-visits every site of its baseline campaign, in the same order.
          } @else {
            Random points are placed inside each zone's fields, using the approved number of cores per zone.
          }
        </p>
        <vc-callout tone="info" icon="fingerprint">
          Placement uses seed <code>{{ c.placement_seed }}</code>, combined with each zone's code. The same seed and zones always give
          the same points, so an auditor can reproduce them exactly. Points can be placed only once per campaign.
        </vc-callout>
      </vc-s-confirm>

      <vc-s-confirm [(open)]="approveOpen" title="Approve this sample plan?" confirmLabel="Approve plan" icon="check" [busy]="busy()" (confirmed)="approve()">
        @if (approveTarget(); as pl) {
          <dl class="kv">
            <dt>Zone</dt><dd><code>{{ pl.stratum_code }}</code></dd>
            <dt>Cores required</dt><dd><strong>{{ pl.n_required }}</strong> ({{ pl.method === 'manual' ? 'entered' : 'variance formula' }})</dd>
            <dt>Created by</dt><dd>{{ pl.created_by || '\u2014' }}</dd>
            <dt>Justification</dt><dd>{{ pl.justification }}</dd>
          </dl>
          <vc-callout [tone]="isMine(pl) ? 'warn' : 'info'" icon="users">
            @if (isMine(pl)) {
              You created or edited this plan, so you can't approve it. A second person must check it \u2014 this "four-eyes" rule stops one person deciding alone how much the zone is sampled.
            } @else {
              Four-eyes rule: the person who created or edited a plan can't approve it. Once approved, the plan can't be changed.
            }
          </vc-callout>
          @if (pl.warnings.length) { <vc-callout tone="warn" icon="alert">{{ pl.warnings[0].message }}</vc-callout> }
        }
      </vc-s-confirm>

      <vc-modal [open]="!!viewPlan()" (closed)="viewPlan.set(null)" [title]="'Plan for zone ' + (viewPlan()?.stratum_code ?? '')" width="520px">
        @if (viewPlan(); as pl) {
          <dl class="kv">
            <dt>Cores required</dt><dd><strong>{{ pl.n_required }}</strong>&ngsp;<vc-dc cls="CALCULATED" /></dd>
            <dt>Method</dt><dd>{{ pl.method === 'manual' ? 'Entered by hand' : 'n = \u2308(z\xB7sd/(e\xB7mean))\xB2\u2309' }}</dd>
            @for (k of inputKeys(pl); track k) { <dt>{{ k | human }}</dt><dd class="num">{{ pl.inputs[k] }}</dd> }
            <dt>Justification</dt><dd>{{ pl.justification }}</dd>
            <dt>Created by</dt><dd>{{ pl.created_by || '\u2014' }}</dd>
            <dt>Status</dt><dd><vc-badge [status]="pl.status" /> @if (pl.approved_by) { by {{ pl.approved_by }} on {{ pl.approved_at | day: true }} }</dd>
          </dl>
        }
      </vc-modal>

      <vc-modal [(open)]="assignOpen" title="Assign points to a collector" width="480px"
        [subtitle]="selected().size + ' planned point(s) selected. Collectors see only the points assigned to them.'">
        <div class="stack" style="--gap:14px">
          @if (collectorsError()) { <vc-error title="Couldn't load collectors" [message]="collectorsError()!" /> }
          <div class="field">
            <label for="as-user">Field collector</label>
            <select id="as-user" class="input" [(ngModel)]="assignUser">
              <option value="">Choose a collector\u2026</option>
              @for (u of collectors(); track u.id) { <option [value]="u.id">{{ u.full_name }} \xB7 {{ u.email }}</option> }
            </select>
            @if (!collectors().length && !collectorsError()) { <span class="hint">No active field collectors in your organisation yet.</span> }
          </div>
        </div>
        <ng-container footer>
          <button class="btn btn-secondary" (click)="assignOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!assignUser || busy()" (click)="assign()"><vc-icon name="user-plus" />Assign</button>
        </ng-container>
      </vc-modal>

      <vc-modal [open]="!!sampleOpen()" (closed)="sampleOpen.set(null)" [drawer]="true" width="680px"
        [title]="'Sample ' + (sampleOpen()?.code ?? '')" [subtitle]="'Site ' + (sampleOpen()?.site_code ?? '') + ' \xB7 a core as collected; never edited.'">
        @if (detailLoading()) { <vc-loading [rows]="8" /> }
        @else if (detailError()) { <vc-error title="Couldn't load the sample" [message]="detailError()!" /> }
        @else if (detail(); as d) { <vc-sample-view [sample]="d" [findings]="detailFindings()" /> }
      </vc-modal>
    }
  `, styles: ['/* angular:styles/component:scss;d4217cef06dcf664;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sampling\\campaign.page.ts */\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n  margin-bottom: 14px;\n}\n.hd {\n  margin-bottom: 18px;\n}\n.titles h1 {\n  margin-top: 6px;\n}\n.code {\n  font-size: 12.5px;\n  color: var(--stone-600);\n}\n.meta {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 18px;\n  margin-top: 8px;\n  color: var(--text-2);\n  font-size: 13px;\n}\n.stepper {\n  padding: 18px 20px;\n  margin-bottom: 16px;\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  flex-wrap: wrap;\n}\n.stepper ol {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  gap: 0;\n  min-width: 520px;\n}\n.stepper li {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  position: relative;\n  padding-right: 14px;\n}\n.stepper li:not(:last-child)::after {\n  content: "";\n  flex: 1;\n  height: 2px;\n  background: var(--sand-200);\n  margin-left: 4px;\n}\n.stepper li.done:not(:last-child)::after {\n  background: var(--forest-400);\n}\n.dot {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  border: 2px solid var(--sand-300);\n  background: var(--surface);\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--stone-500);\n}\nli.done .dot {\n  background: var(--forest-500);\n  border-color: var(--forest-500);\n  color: #fff;\n}\nli.cur .dot {\n  border-color: var(--forest-600);\n  color: var(--forest-700);\n  box-shadow: 0 0 0 4px var(--forest-100);\n}\n.lbl {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n  white-space: nowrap;\n}\n.lbl strong {\n  font-size: 13px;\n}\n.lbl em {\n  font-style: normal;\n  font-size: 11.5px;\n  color: var(--text-3);\n}\nli.cur .lbl strong {\n  color: var(--forest-700);\n}\n.next {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  max-width: 460px;\n}\n.kpis {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.kpi {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  padding: 12px 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.kpi span {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.kpi strong {\n  font-size: 20px;\n  font-weight: 600;\n}\n.warn {\n  color: var(--amber-600);\n}\n.pgrid {\n  display: grid;\n  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);\n  gap: 16px;\n  align-items: start;\n}\n.ptable {\n  display: flex;\n  flex-direction: column;\n  max-height: 520px;\n}\n.card-head.wrap {\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.sel {\n  width: auto;\n  min-width: 130px;\n  height: 32px;\n}\n.scroll {\n  overflow: auto;\n  flex: 1;\n}\n.cb {\n  accent-color: var(--primary);\n  width: 16px;\n  height: 16px;\n}\ntr.hl td {\n  background: var(--forest-50);\n}\n.legend-map {\n  position: absolute;\n  left: 10px;\n  bottom: 10px;\n  z-index: 2;\n  display: flex;\n  gap: 12px;\n  padding: 6px 10px;\n  background: var(--surface);\n  border-radius: 8px;\n  box-shadow: var(--shadow);\n  font-size: 12px;\n}\n.legend-map span {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n}\n.legend-map i {\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  border: 1.5px solid #fff;\n  box-shadow: 0 0 0 1px var(--stone-300);\n}\n.fcount {\n  display: inline-grid;\n  place-items: center;\n  min-width: 22px;\n  height: 20px;\n  padding: 0 6px;\n  border-radius: 10px;\n  background: var(--warn-soft);\n  color: var(--amber-600);\n  font-weight: 600;\n  font-size: 12px;\n}\n@media (max-width: 1100px) {\n  .pgrid {\n    grid-template-columns: 1fr;\n  }\n  .kpis {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  .stepper ol {\n    min-width: 0;\n    flex-wrap: wrap;\n  }\n}\n/*# sourceMappingURL=campaign.page.css.map */\n'] }]
  }], () => [], { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CampaignPage, { className: "CampaignPage", filePath: "src/app/features/sampling/campaign.page.ts", lineNumber: 365 });
})();

// src/app/features/sampling/campaign-modal.ts
var _forTrack03 = ($index, $item) => $item.id;
function CampaignModal_Conditional_27_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275text(1, "(optional)");
    \u0275\u0275elementEnd();
  }
}
function CampaignModal_Conditional_27_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r3 = ctx.$implicit;
    \u0275\u0275property("value", b_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", b_r3.code, " \xB7 ", b_r3.name);
  }
}
function CampaignModal_Conditional_27_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "Paired designs sample the exact sites of the baseline again.");
    \u0275\u0275elementEnd();
  }
}
function CampaignModal_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "label", 34);
    \u0275\u0275text(2, "Re-visits baseline campaign ");
    \u0275\u0275conditionalCreate(3, CampaignModal_Conditional_27_Conditional_3_Template, 2, 0, "span", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 35);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function CampaignModal_Conditional_27_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.revisits, $event) || (ctx_r1.revisits = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "option", 36);
    \u0275\u0275text(6, "None");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, CampaignModal_Conditional_27_For_8_Template, 2, 3, "option", 37, _forTrack03);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, CampaignModal_Conditional_27_Conditional_9_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.design() !== "paired" ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.revisits);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.baselines());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.design() === "paired" ? 9 : -1);
  }
}
function CampaignModal_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.err());
  }
}
var CampaignModal = class _CampaignModal {
  api = inject(ApiService);
  toast = inject(ToastService);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  campaigns = input(
    [],
    ...ngDevMode ? [{ debugName: "campaigns" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saved = output();
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  err = signal(
    null,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  kind = signal(
    "baseline",
    ...ngDevMode ? [{ debugName: "kind" }] : (
      /* istanbul ignore next */
      []
    )
  );
  design = signal(
    "independent",
    ...ngDevMode ? [{ debugName: "design" }] : (
      /* istanbul ignore next */
      []
    )
  );
  baselines = computed(
    () => this.campaigns().filter((c) => c.kind === "baseline"),
    ...ngDevMode ? [{ debugName: "baselines" }] : (
      /* istanbul ignore next */
      []
    )
  );
  code = "";
  name = "";
  revisits = "";
  start = "";
  end = "";
  depthFrom = 0;
  depthTo = 30;
  seed = null;
  constructor() {
    effect(() => {
      if (!this.open())
        return;
      this.err.set(null);
      this.code = "";
      this.name = "";
      this.revisits = "";
      this.seed = null;
      this.start = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      this.end = new Date(Date.now() + 45 * 864e5).toISOString().slice(0, 10);
    });
  }
  valid() {
    return this.code.trim().length >= 2 && this.name.trim().length >= 2 && !!this.start && !!this.end && this.depthTo > this.depthFrom;
  }
  save() {
    this.busy.set(true);
    this.err.set(null);
    this.api.post(`/projects/${this.projectId()}/campaigns`, {
      code: this.code.trim(),
      name: this.name.trim(),
      kind: this.kind(),
      design: this.design(),
      revisits_campaign_id: this.kind() === "monitoring" && this.revisits ? this.revisits : null,
      planned_start: this.start,
      planned_end: this.end,
      depth_from_cm: Number(this.depthFrom),
      depth_to_cm: Number(this.depthTo),
      placement_seed: this.seed === null || this.seed === "" ? null : Number(this.seed)
    }).subscribe({
      next: (c) => {
        this.busy.set(false);
        this.toast.success(`Campaign ${c.code} planned`);
        this.saved.emit(c);
        this.open.set(false);
      },
      error: (e) => {
        this.busy.set(false);
        this.err.set(e.message);
      }
    });
  }
  static \u0275fac = function CampaignModal_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CampaignModal)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CampaignModal, selectors: [["vc-campaign-modal"]], inputs: { open: [1, "open"], projectId: [1, "projectId"], campaigns: [1, "campaigns"] }, outputs: { open: "openChange", saved: "saved" }, decls: 59, vars: 14, consts: [["title", "Plan a campaign", "width", "640px", "subtitle", "A campaign is one round of soil sampling. The methodology rules are checked when you save.", 3, "openChange", "open"], [1, "stack", 2, "--gap", "16px"], [1, "form-grid"], [1, "field"], ["for", "c-code"], ["id", "c-code", "placeholder", "BL-2026", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["for", "c-name"], ["id", "c-name", "placeholder", "Baseline sampling, post-monsoon 2026", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "c-kind"], ["id", "c-kind", 1, "input", 3, "ngModelChange", "ngModel"], ["value", "baseline"], ["value", "monitoring"], ["for", "c-design"], ["id", "c-design", 1, "input", 3, "ngModelChange", "ngModel"], ["value", "independent"], ["value", "paired"], [1, "field", "span-2"], ["for", "c-start"], ["id", "c-start", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "c-end"], ["id", "c-end", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "c-df"], ["id", "c-df", "type", "number", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "c-dt"], ["id", "c-dt", "type", "number", "min", "1", "max", "300", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "c-seed"], [1, "subtle"], ["id", "c-seed", "type", "number", "min", "0", "placeholder", "Chosen at random if left empty", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "hint"], ["tone", "danger", "icon", "alert"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], ["for", "c-rev"], ["id", "c-rev", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"]], template: function CampaignModal_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function CampaignModal_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "label", 4);
      \u0275\u0275text(5, "Campaign code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "input", 5);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function CampaignModal_Template_input_ngModelChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.code, $event) || (ctx.code = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 3)(8, "label", 6);
      \u0275\u0275text(9, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "input", 7);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function CampaignModal_Template_input_ngModelChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.name, $event) || (ctx.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 3)(12, "label", 8);
      \u0275\u0275text(13, "Kind");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "select", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CampaignModal_Template_select_ngModelChange_14_listener($event) {
        return ctx.kind.set($event);
      });
      \u0275\u0275elementStart(15, "option", 10);
      \u0275\u0275text(16, "Baseline \u2014 the starting point");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "option", 11);
      \u0275\u0275text(18, "Monitoring \u2014 a later re-measurement");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "div", 3)(20, "label", 12);
      \u0275\u0275text(21, "Design");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "select", 13);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CampaignModal_Template_select_ngModelChange_22_listener($event) {
        return ctx.design.set($event);
      });
      \u0275\u0275elementStart(23, "option", 14);
      \u0275\u0275text(24, "Independent \u2014 new random points");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "option", 15);
      \u0275\u0275text(26, "Paired \u2014 re-visit the same sites");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(27, CampaignModal_Conditional_27_Template, 10, 3, "div", 16);
      \u0275\u0275elementStart(28, "div", 3)(29, "label", 17);
      \u0275\u0275text(30, "Planned start");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "input", 18);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function CampaignModal_Template_input_ngModelChange_31_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.start, $event) || (ctx.start = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 3)(33, "label", 19);
      \u0275\u0275text(34, "Planned end");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "input", 20);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function CampaignModal_Template_input_ngModelChange_35_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.end, $event) || (ctx.end = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(36, "div", 3)(37, "label", 21);
      \u0275\u0275text(38, "Depth from (cm)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "input", 22);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function CampaignModal_Template_input_ngModelChange_39_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.depthFrom, $event) || (ctx.depthFrom = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "div", 3)(41, "label", 23);
      \u0275\u0275text(42, "Depth to (cm)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "input", 24);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function CampaignModal_Template_input_ngModelChange_43_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.depthTo, $event) || (ctx.depthTo = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 16)(45, "label", 25);
      \u0275\u0275text(46, "Placement seed ");
      \u0275\u0275elementStart(47, "span", 26);
      \u0275\u0275text(48, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "input", 27);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function CampaignModal_Template_input_ngModelChange_49_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.seed, $event) || (ctx.seed = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "span", 28);
      \u0275\u0275text(51, "The seed makes point placement reproducible: the same seed and zones always give the same points, so a verifier can re-create them.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(52, CampaignModal_Conditional_52_Template, 2, 1, "vc-callout", 29);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(53, 30);
      \u0275\u0275elementStart(54, "button", 31);
      \u0275\u0275listener("click", function CampaignModal_Template_button_click_54_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(55, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "button", 32);
      \u0275\u0275listener("click", function CampaignModal_Template_button_click_56_listener() {
        return ctx.save();
      });
      \u0275\u0275element(57, "vc-icon", 33);
      \u0275\u0275text(58);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.code);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.name);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.kind());
      \u0275\u0275control();
      \u0275\u0275advance(8);
      \u0275\u0275property("ngModel", ctx.design());
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.kind() === "monitoring" ? 27 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.start);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.end);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.depthFrom);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.depthTo);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.seed);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.err() ? 52 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.valid());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.busy() ? "Saving\u2026" : "Create campaign");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, Modal, Icon, Callout], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CampaignModal, [{
    type: Component,
    args: [{
      selector: "vc-campaign-modal",
      imports: [FormsModule, Modal, Icon, Callout],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <vc-modal [(open)]="open" title="Plan a campaign" width="640px"
      subtitle="A campaign is one round of soil sampling. The methodology rules are checked when you save.">
      <div class="stack" style="--gap:16px">
        <div class="form-grid">
          <div class="field">
            <label for="c-code">Campaign code</label>
            <input id="c-code" class="input mono" [(ngModel)]="code" placeholder="BL-2026" />
          </div>
          <div class="field">
            <label for="c-name">Name</label>
            <input id="c-name" class="input" [(ngModel)]="name" placeholder="Baseline sampling, post-monsoon 2026" />
          </div>
          <div class="field">
            <label for="c-kind">Kind</label>
            <select id="c-kind" class="input" [ngModel]="kind()" (ngModelChange)="kind.set($event)">
              <option value="baseline">Baseline \u2014 the starting point</option>
              <option value="monitoring">Monitoring \u2014 a later re-measurement</option>
            </select>
          </div>
          <div class="field">
            <label for="c-design">Design</label>
            <select id="c-design" class="input" [ngModel]="design()" (ngModelChange)="design.set($event)">
              <option value="independent">Independent \u2014 new random points</option>
              <option value="paired">Paired \u2014 re-visit the same sites</option>
            </select>
          </div>
          @if (kind() === 'monitoring') {
            <div class="field span-2">
              <label for="c-rev">Re-visits baseline campaign @if (design() !== 'paired') { <span class="subtle">(optional)</span> }</label>
              <select id="c-rev" class="input" [(ngModel)]="revisits">
                <option value="">None</option>
                @for (b of baselines(); track b.id) { <option [value]="b.id">{{ b.code }} \xB7 {{ b.name }}</option> }
              </select>
              @if (design() === 'paired') { <span class="hint">Paired designs sample the exact sites of the baseline again.</span> }
            </div>
          }
          <div class="field">
            <label for="c-start">Planned start</label>
            <input id="c-start" type="date" class="input" [(ngModel)]="start" />
          </div>
          <div class="field">
            <label for="c-end">Planned end</label>
            <input id="c-end" type="date" class="input" [(ngModel)]="end" />
          </div>
          <div class="field">
            <label for="c-df">Depth from (cm)</label>
            <input id="c-df" type="number" min="0" class="input num" [(ngModel)]="depthFrom" />
          </div>
          <div class="field">
            <label for="c-dt">Depth to (cm)</label>
            <input id="c-dt" type="number" min="1" max="300" class="input num" [(ngModel)]="depthTo" />
          </div>
          <div class="field span-2">
            <label for="c-seed">Placement seed <span class="subtle">(optional)</span></label>
            <input id="c-seed" type="number" min="0" class="input num" [(ngModel)]="seed" placeholder="Chosen at random if left empty" />
            <span class="hint">The seed makes point placement reproducible: the same seed and zones always give the same points, so a verifier can re-create them.</span>
          </div>
        </div>
        @if (err()) { <vc-callout tone="danger" icon="alert">{{ err() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Saving\u2026' : 'Create campaign' }}</button>
      </ng-container>
    </vc-modal>
  `
    }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }], campaigns: [{ type: Input, args: [{ isSignal: true, alias: "campaigns", required: false }] }], saved: [{ type: Output, args: ["saved"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CampaignModal, { className: "CampaignModal", filePath: "src/app/features/sampling/campaign-modal.ts", lineNumber: 82 });
})();

// src/app/features/sampling/trace.ts
var _c02 = (a0) => ["/app/sampling", a0];
var _forTrack04 = ($index, $item) => $item.id;
function TraceDrawer_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 1);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function TraceDrawer_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 2);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function TraceDrawer_Conditional_3_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span");
    \u0275\u0275text(2, "Zone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "em");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(t_r3.stratum.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r3.stratum.name);
  }
}
function TraceDrawer_Conditional_3_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 8)(1, "span");
    \u0275\u0275text(2, "Bag");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong", 7);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "em");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(t_r3.bag.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("label ", t_r3.bag.label_qr);
  }
}
function TraceDrawer_Conditional_3_For_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span");
    \u0275\u0275text(2, "Lab batch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong", 7);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "vc-badge", 6);
    \u0275\u0275elementStart(6, "em");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const b_r4 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(b_r4.code);
    \u0275\u0275advance();
    \u0275\u0275property("status", b_r4.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", b_r4.layer_ids.length, " bag(s) of this sample");
  }
}
function TraceDrawer_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "ol", 4)(2, "li")(3, "span");
    \u0275\u0275text(4, "Project");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "em");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "li")(10, "span");
    \u0275\u0275text(11, "Campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "a", 5);
    \u0275\u0275listener("click", function TraceDrawer_Conditional_3_Template_a_click_12_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.open.set(false));
    });
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(15, "vc-badge", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, TraceDrawer_Conditional_3_Conditional_16_Template, 7, 2, "li");
    \u0275\u0275elementStart(17, "li")(18, "span");
    \u0275\u0275text(19, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "strong");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "em");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "li")(25, "span");
    \u0275\u0275text(26, "Site");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "strong", 7);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "em");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "li")(32, "span");
    \u0275\u0275text(33, "Sample");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "strong", 7);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(36, TraceDrawer_Conditional_3_Conditional_36_Template, 7, 2, "li", 8);
    \u0275\u0275repeaterCreate(37, TraceDrawer_Conditional_3_For_38_Template, 8, 3, "li", null, _forTrack04);
    \u0275\u0275elementEnd();
    \u0275\u0275element(39, "vc-sample-view", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r3 = ctx;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(t_r3.project.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r3.project.name);
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(13, _c02, t_r3.campaign.id));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r3.campaign.code);
    \u0275\u0275advance();
    \u0275\u0275property("status", t_r3.campaign.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(t_r3.stratum ? 16 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(t_r3.field.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r3.field.name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(t_r3.site.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r3.point.assigned_to ? "Assigned to " + t_r3.point.assigned_to : "Unassigned");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(t_r3.sample.code);
    \u0275\u0275advance();
    \u0275\u0275conditional(t_r3.bag ? 36 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(t_r3.lab_batches);
    \u0275\u0275advance(2);
    \u0275\u0275property("sample", t_r3.sample);
  }
}
var TraceDrawer = class _TraceDrawer {
  api = inject(ApiService);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  code = input(
    "",
    ...ngDevMode ? [{ debugName: "code" }] : (
      /* istanbul ignore next */
      []
    )
  );
  t = signal(
    null,
    ...ngDevMode ? [{ debugName: "t" }] : (
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
  constructor() {
    effect(() => {
      const c = this.code().trim();
      if (!this.open() || !c)
        return;
      this.loading.set(true);
      this.error.set(null);
      this.t.set(null);
      this.api.get(`/samples/by-code/${encodeURIComponent(c)}/trace`).subscribe({
        next: (r) => {
          this.t.set(r);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.message);
          this.loading.set(false);
        }
      });
    });
  }
  static \u0275fac = function TraceDrawer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TraceDrawer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TraceDrawer, selectors: [["vc-trace-drawer"]], inputs: { open: [1, "open"], code: [1, "code"] }, outputs: { open: "openChange" }, decls: 4, vars: 4, consts: [["width", "680px", "subtitle", "From project and zone down to the bag on the lab bench.", 3, "openChange", "open", "drawer", "title"], [3, "rows"], ["title", "Nothing found", 3, "message"], [1, "stack", 2, "--gap", "20px"], [1, "chain"], [3, "click", "routerLink"], [3, "status"], [1, "mono"], [1, "hit"], [3, "sample"]], template: function TraceDrawer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function TraceDrawer_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(1, TraceDrawer_Conditional_1_Template, 1, 1, "vc-loading", 1)(2, TraceDrawer_Conditional_2_Template, 1, 1, "vc-error", 2)(3, TraceDrawer_Conditional_3_Template, 40, 15, "div", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_3_0;
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275property("drawer", true)("title", "Trace " + ctx.code());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 1 : ctx.error() ? 2 : (tmp_3_0 = ctx.t()) ? 3 : -1, tmp_3_0);
    }
  }, dependencies: [Modal, Loading, ErrorBox, Badge, SampleView, RouterLink], styles: ["\n.chain[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  overflow: hidden;\n}\n.chain[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 9px 14px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n  font-size: 13.5px;\n  flex-wrap: wrap;\n}\n.chain[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.chain[_ngcontent-%COMP%]   li.hit[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n}\n.chain[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 84px;\n  color: var(--%NS%text-3);\n  font-size: 12px;\n}\n.chain[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  color: var(--%NS%text-2);\n  font-size: 12.5px;\n}\n/*# sourceMappingURL=trace.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TraceDrawer, [{
    type: Component,
    args: [{ selector: "vc-trace-drawer", imports: [Modal, Loading, ErrorBox, Badge, SampleView, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" [drawer]="true" width="680px" [title]="'Trace ' + code()"
      subtitle="From project and zone down to the bag on the lab bench.">
      @if (loading()) {
        <vc-loading [rows]="8" />
      } @else if (error()) {
        <vc-error title="Nothing found" [message]="error()!" />
      } @else if (t(); as t) {
        <div class="stack" style="--gap:20px">
          <ol class="chain">
            <li><span>Project</span><strong>{{ t.project.code }}</strong><em>{{ t.project.name }}</em></li>
            <li><span>Campaign</span><a [routerLink]="['/app/sampling', t.campaign.id]" (click)="open.set(false)"><strong>{{ t.campaign.code }}</strong></a><vc-badge [status]="t.campaign.status" /></li>
            @if (t.stratum) { <li><span>Zone</span><strong>{{ t.stratum.code }}</strong><em>{{ t.stratum.name }}</em></li> }
            <li><span>Field</span><strong>{{ t.field.code }}</strong><em>{{ t.field.name }}</em></li>
            <li><span>Site</span><strong class="mono">{{ t.site.code }}</strong><em>{{ t.point.assigned_to ? 'Assigned to ' + t.point.assigned_to : 'Unassigned' }}</em></li>
            <li><span>Sample</span><strong class="mono">{{ t.sample.code }}</strong></li>
            @if (t.bag) { <li class="hit"><span>Bag</span><strong class="mono">{{ t.bag.code }}</strong><em>label {{ t.bag.label_qr }}</em></li> }
            @for (b of t.lab_batches; track b.id) {
              <li><span>Lab batch</span><strong class="mono">{{ b.code }}</strong><vc-badge [status]="b.status" /><em>{{ b.layer_ids.length }} bag(s) of this sample</em></li>
            }
          </ol>
          <vc-sample-view [sample]="t.sample" />
        </div>
      }
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;f1936a782e38cf86;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sampling\\trace.ts */\n.chain {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  overflow: hidden;\n}\n.chain li {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 9px 14px;\n  border-bottom: 1px solid var(--stone-100);\n  font-size: 13.5px;\n  flex-wrap: wrap;\n}\n.chain li:last-child {\n  border-bottom: 0;\n}\n.chain li.hit {\n  background: var(--forest-50);\n}\n.chain span {\n  width: 84px;\n  color: var(--text-3);\n  font-size: 12px;\n}\n.chain em {\n  font-style: normal;\n  color: var(--text-2);\n  font-size: 12.5px;\n}\n/*# sourceMappingURL=trace.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], code: [{ type: Input, args: [{ isSignal: true, alias: "code", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TraceDrawer, { className: "TraceDrawer", filePath: "src/app/features/sampling/trace.ts", lineNumber: 48 });
})();

// src/app/features/sampling/zone-modal.ts
var _forTrack05 = ($index, $item) => $item.id;
var _forTrack13 = ($index, $item) => $item.field_id;
function ZoneModal_Conditional_21_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r3 = ctx.$implicit;
    \u0275\u0275property("value", s_r3.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", s_r3.code, " \xB7 ", s_r3.name);
  }
}
function ZoneModal_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "label", 36);
    \u0275\u0275text(2, "Control for zone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 37);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ZoneModal_Conditional_21_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.controlFor, $event) || (ctx_r1.controlFor = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(4, "option", 38);
    \u0275\u0275text(5, "Not linked");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, ZoneModal_Conditional_21_For_7_Template, 2, 3, "option", 39, _forTrack05);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.controlFor);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.projectZones());
  }
}
function ZoneModal_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 3);
  }
}
function ZoneModal_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Must be after ", ctx_r1.base().effective_from, ".");
  }
}
function ZoneModal_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 25);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function ZoneModal_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275element(1, "vc-error", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function ZoneModal_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 27);
    \u0275\u0275text(1, "No fields are enrolled in this project yet. Enrol fields before drawing zones.");
    \u0275\u0275elementEnd();
  }
}
function ZoneModal_Conditional_52_For_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const owner_r6 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("in zone ", owner_r6);
  }
}
function ZoneModal_Conditional_52_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "label", 42)(2, "input", 43);
    \u0275\u0275listener("change", function ZoneModal_Conditional_52_For_1_Template_input_change_2_listener() {
      const e_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggle(e_r5.field_id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 45);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "span", 22);
    \u0275\u0275conditionalCreate(8, ZoneModal_Conditional_52_For_1_Conditional_8_Template, 2, 1, "span", 21);
    \u0275\u0275elementStart(9, "span", 46);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "num");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    const owner_r7 = \u0275\u0275storeLet(ctx_r1.takenBy().get(e_r5.field_id));
    \u0275\u0275advance();
    \u0275\u0275classProp("dis", !!owner_r7);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.picked().has(e_r5.field_id))("disabled", !!owner_r7);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r5.field_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r5.farmer_name);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(owner_r7 ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(11, 9, e_r5.field_area_ha, 2), " ha");
  }
}
function ZoneModal_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ZoneModal_Conditional_52_For_1_Template, 12, 12, "label", 41, _forTrack13);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.shown());
  }
}
function ZoneModal_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.formError());
  }
}
var ZoneModal = class _ZoneModal {
  api = inject(ApiService);
  toast = inject(ToastService);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  strata = input(
    [],
    ...ngDevMode ? [{ debugName: "strata" }] : (
      /* istanbul ignore next */
      []
    )
  );
  base = input(
    null,
    ...ngDevMode ? [{ debugName: "base" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saved = output();
  enrolments = signal(
    [],
    ...ngDevMode ? [{ debugName: "enrolments" }] : (
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
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  formError = signal(
    null,
    ...ngDevMode ? [{ debugName: "formError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  picked = signal(
    /* @__PURE__ */ new Set(),
    ...ngDevMode ? [{ debugName: "picked" }] : (
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
  code = "";
  name = "";
  role = "project";
  controlFor = "";
  soil = "";
  landUse = "";
  from = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  projectZones = computed(
    () => this.strata().filter((s) => s.role === "project" && s.code !== this.base()?.code),
    ...ngDevMode ? [{ debugName: "projectZones" }] : (
      /* istanbul ignore next */
      []
    )
  );
  takenBy = computed(
    () => {
      const m = /* @__PURE__ */ new Map();
      for (const s of this.strata()) {
        if (s.code === this.base()?.code)
          continue;
        for (const f of s.field_ids)
          m.set(f, s.code);
      }
      return m;
    },
    ...ngDevMode ? [{ debugName: "takenBy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  shown = computed(
    () => {
      const q = this.q().toLowerCase().trim();
      return this.enrolments().filter((e) => !q || e.field_code.toLowerCase().includes(q) || e.farmer_name.toLowerCase().includes(q));
    },
    ...ngDevMode ? [{ debugName: "shown" }] : (
      /* istanbul ignore next */
      []
    )
  );
  area = computed(
    () => {
      const p = this.picked();
      return this.enrolments().filter((e) => p.has(e.field_id)).reduce((a, e) => a + (e.field_area_ha || 0), 0);
    },
    ...ngDevMode ? [{ debugName: "area" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (!this.open())
        return;
      const b = this.base();
      this.formError.set(null);
      this.q.set("");
      this.code = b?.code ?? "";
      this.name = b?.name ?? "";
      this.role = b?.role ?? "project";
      this.controlFor = b?.control_for_code ?? "";
      this.soil = String(b?.criteria?.["soil_type"] ?? "");
      this.landUse = String(b?.criteria?.["crop_code"] ?? b?.criteria?.["land_use"] ?? "");
      this.from = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      this.picked.set(new Set(b?.field_ids ?? []));
      this.loadEnrolments();
    });
  }
  valid() {
    return /^[A-Za-z0-9_.-]+$/.test(this.code) && this.name.trim().length >= 2 && !!this.from && this.picked().size > 0;
  }
  toggle(id) {
    const s = new Set(this.picked());
    s.has(id) ? s.delete(id) : s.add(id);
    this.picked.set(s);
  }
  loadEnrolments() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/projects/${this.projectId()}/enrolments`, { status: "enrolled" }).subscribe({
      next: (r) => {
        this.enrolments.set(r.filter((e) => e.status === "enrolled"));
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  save() {
    this.busy.set(true);
    this.formError.set(null);
    const criteria = {};
    if (this.soil.trim())
      criteria["soil_type"] = this.soil.trim();
    if (this.landUse.trim())
      criteria["crop_code"] = this.landUse.trim();
    this.api.post(`/projects/${this.projectId()}/strata`, {
      code: this.code.trim(),
      name: this.name.trim(),
      role: this.role,
      control_for_code: this.role === "control" && this.controlFor ? this.controlFor : null,
      criteria,
      field_ids: [...this.picked()],
      effective_from: this.from
    }).subscribe({
      next: (s) => {
        this.busy.set(false);
        this.toast.success(this.base() ? `Zone ${s.code} is now version ${s.version}` : `Zone ${s.code} created`);
        this.saved.emit(s);
        this.open.set(false);
      },
      error: (e) => {
        this.busy.set(false);
        const clashes = e.details?.["clashes"]?.map((c) => c.stratum).join(", ");
        this.formError.set(clashes ? `${e.message} Already in: ${clashes}.` : e.message);
      }
    });
  }
  static \u0275fac = function ZoneModal_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ZoneModal)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ZoneModal, selectors: [["vc-zone-modal"]], inputs: { open: [1, "open"], projectId: [1, "projectId"], strata: [1, "strata"], base: [1, "base"] }, outputs: { open: "openChange", saved: "saved" }, decls: 69, vars: 24, consts: [["width", "720px", 3, "openChange", "open", "title", "subtitle"], [1, "stack", 2, "--gap", "18px"], [1, "form-grid"], [1, "field"], ["for", "z-code"], ["id", "z-code", "placeholder", "Z1-RED", "maxlength", "40", 1, "input", "mono", 3, "ngModelChange", "ngModel", "disabled"], [1, "hint"], ["for", "z-name"], ["id", "z-name", "placeholder", "Red laterite, upper slopes", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "z-role"], ["id", "z-role", 1, "input", 3, "ngModelChange", "ngModel", "disabled"], ["value", "project"], ["value", "control"], ["for", "z-soil"], [1, "subtle"], ["id", "z-soil", "placeholder", "Red sandy loam", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "z-use"], ["id", "z-use", "placeholder", "Rice\u2013pulse rotation", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "z-from"], ["id", "z-from", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], [1, "row", "fhead"], [1, "subtle", "small"], [1, "spacer"], ["placeholder", "Filter by field or farmer\u2026", 1, "input", "search", 3, "ngModelChange", "ngModel"], [1, "flist"], [3, "rows"], [2, "padding", "12px"], [1, "muted", "small", 2, "padding", "16px"], [1, "sum"], [1, "num"], ["cls", "DERIVED"], ["tone", "danger", "icon", "alert"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], ["for", "z-ctl"], ["id", "z-ctl", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["title", "Couldn't load enrolled fields", 3, "message"], [1, "fr", 3, "dis"], [1, "fr"], ["type", "checkbox", 3, "change", "checked", "disabled"], [1, "mono"], [1, "muted", "truncate"], [1, "num", "small"]], template: function ZoneModal_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function ZoneModal_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "label", 4);
      \u0275\u0275text(5, "Zone code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "input", 5);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ZoneModal_Template_input_ngModelChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.code, $event) || (ctx.code = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "span", 6);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 3)(10, "label", 7);
      \u0275\u0275text(11, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 8);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ZoneModal_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.name, $event) || (ctx.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 3)(14, "label", 9);
      \u0275\u0275text(15, "Role");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ZoneModal_Template_select_ngModelChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.role, $event) || (ctx.role = $event);
        return $event;
      });
      \u0275\u0275elementStart(17, "option", 11);
      \u0275\u0275text(18, "Project zone \u2014 practices change here");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "option", 12);
      \u0275\u0275text(20, "Control zone \u2014 business as usual");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(21, ZoneModal_Conditional_21_Template, 8, 1, "div", 3)(22, ZoneModal_Conditional_22_Template, 1, 0, "div", 3);
      \u0275\u0275elementStart(23, "div", 3)(24, "label", 13);
      \u0275\u0275text(25, "Soil type ");
      \u0275\u0275elementStart(26, "span", 14);
      \u0275\u0275text(27, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "input", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ZoneModal_Template_input_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.soil, $event) || (ctx.soil = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 3)(30, "label", 16);
      \u0275\u0275text(31, "Crop or land use ");
      \u0275\u0275elementStart(32, "span", 14);
      \u0275\u0275text(33, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "input", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ZoneModal_Template_input_ngModelChange_34_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.landUse, $event) || (ctx.landUse = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "div", 3)(36, "label", 18);
      \u0275\u0275text(37, "Effective from");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "input", 19);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ZoneModal_Template_input_ngModelChange_38_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.from, $event) || (ctx.from = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(39, ZoneModal_Conditional_39_Template, 2, 1, "span", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "div")(41, "div", 20)(42, "strong");
      \u0275\u0275text(43, "Enrolled fields");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "span", 21);
      \u0275\u0275text(45);
      \u0275\u0275elementEnd();
      \u0275\u0275element(46, "div", 22);
      \u0275\u0275elementStart(47, "input", 23);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function ZoneModal_Template_input_ngModelChange_47_listener($event) {
        return ctx.q.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(48, "div", 24);
      \u0275\u0275conditionalCreate(49, ZoneModal_Conditional_49_Template, 1, 1, "vc-loading", 25)(50, ZoneModal_Conditional_50_Template, 2, 1, "div", 26)(51, ZoneModal_Conditional_51_Template, 2, 0, "p", 27)(52, ZoneModal_Conditional_52_Template, 2, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 28)(54, "span");
      \u0275\u0275text(55, "Zone area");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "strong", 29);
      \u0275\u0275text(57);
      \u0275\u0275pipe(58, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275element(59, "vc-dc", 30);
      \u0275\u0275elementStart(60, "span", 21);
      \u0275\u0275text(61, "Sum of selected field areas");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(62, ZoneModal_Conditional_62_Template, 2, 1, "vc-callout", 31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(63, 32);
      \u0275\u0275elementStart(64, "button", 33);
      \u0275\u0275listener("click", function ZoneModal_Template_button_click_64_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(65, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "button", 34);
      \u0275\u0275listener("click", function ZoneModal_Template_button_click_66_listener() {
        return ctx.save();
      });
      \u0275\u0275element(67, "vc-icon", 35);
      \u0275\u0275text(68);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275property("title", ctx.base() ? "New version of zone " + ctx.base().code : "New zone")("subtitle", ctx.base() ? "The current version closes the day before the new one starts. History is kept." : "A zone groups enrolled fields with similar soil and land use. Each zone gets its own sample plan.");
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.code);
      \u0275\u0275property("disabled", !!ctx.base());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("Letters, numbers, dot, dash or underscore. Used in site codes (ST-", ctx.code || "CODE", "-001).");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.name);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.role);
      \u0275\u0275property("disabled", !!ctx.base());
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.role === "control" ? 21 : 22);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.soil);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.landUse);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.from);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.base() ? 39 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("", ctx.picked().size, " selected");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.q());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 49 : ctx.error() ? 50 : !ctx.enrolments().length ? 51 : 52);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(58, 21, ctx.area(), 2), " ha");
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.formError() ? 62 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.valid());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.busy() ? "Saving\u2026" : ctx.base() ? "Save new version" : "Create zone", " ");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, Modal, Icon, Loading, ErrorBox, Callout, DataClass, NumPipe], styles: ["\n.fhead[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n}\n.search[_ngcontent-%COMP%] {\n  width: 240px;\n  height: 32px;\n}\n.flist[_ngcontent-%COMP%] {\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  max-height: 260px;\n  overflow: auto;\n  background: var(--%NS%surface);\n}\n.fr[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 12px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n  cursor: pointer;\n  font-size: 13.5px;\n}\n.fr[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.fr[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%forest-50);\n}\n.fr.dis[_ngcontent-%COMP%] {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.fr[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n  width: 16px;\n  height: 16px;\n}\n.sum[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 10px;\n  padding: 10px 12px;\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n}\n.sum[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n/*# sourceMappingURL=zone-modal.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ZoneModal, [{
    type: Component,
    args: [{ selector: "vc-zone-modal", imports: [FormsModule, Modal, Icon, Loading, ErrorBox, Callout, DataClass, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" width="720px"
      [title]="base() ? 'New version of zone ' + base()!.code : 'New zone'"
      [subtitle]="base() ? 'The current version closes the day before the new one starts. History is kept.' : 'A zone groups enrolled fields with similar soil and land use. Each zone gets its own sample plan.'">
      <div class="stack" style="--gap:18px">
        <div class="form-grid">
          <div class="field">
            <label for="z-code">Zone code</label>
            <input id="z-code" class="input mono" [(ngModel)]="code" [disabled]="!!base()" placeholder="Z1-RED" maxlength="40" />
            <span class="hint">Letters, numbers, dot, dash or underscore. Used in site codes (ST-{{ code || 'CODE' }}-001).</span>
          </div>
          <div class="field">
            <label for="z-name">Name</label>
            <input id="z-name" class="input" [(ngModel)]="name" placeholder="Red laterite, upper slopes" />
          </div>
          <div class="field">
            <label for="z-role">Role</label>
            <select id="z-role" class="input" [(ngModel)]="role" [disabled]="!!base()">
              <option value="project">Project zone \u2014 practices change here</option>
              <option value="control">Control zone \u2014 business as usual</option>
            </select>
          </div>
          @if (role === 'control') {
            <div class="field">
              <label for="z-ctl">Control for zone</label>
              <select id="z-ctl" class="input" [(ngModel)]="controlFor">
                <option value="">Not linked</option>
                @for (s of projectZones(); track s.id) { <option [value]="s.code">{{ s.code }} \xB7 {{ s.name }}</option> }
              </select>
            </div>
          } @else {
            <div class="field"></div>
          }
          <div class="field">
            <label for="z-soil">Soil type <span class="subtle">(optional)</span></label>
            <input id="z-soil" class="input" [(ngModel)]="soil" placeholder="Red sandy loam" />
          </div>
          <div class="field">
            <label for="z-use">Crop or land use <span class="subtle">(optional)</span></label>
            <input id="z-use" class="input" [(ngModel)]="landUse" placeholder="Rice\u2013pulse rotation" />
          </div>
          <div class="field">
            <label for="z-from">Effective from</label>
            <input id="z-from" type="date" class="input" [(ngModel)]="from" />
            @if (base()) { <span class="hint">Must be after {{ base()!.effective_from }}.</span> }
          </div>
        </div>

        <div>
          <div class="row fhead">
            <strong>Enrolled fields</strong>
            <span class="subtle small">{{ picked().size }} selected</span>
            <div class="spacer"></div>
            <input class="input search" placeholder="Filter by field or farmer\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" />
          </div>
          <div class="flist">
            @if (loading()) {
              <vc-loading [rows]="4" />
            } @else if (error()) {
              <div style="padding:12px"><vc-error title="Couldn't load enrolled fields" [message]="error()!" /></div>
            } @else if (!enrolments().length) {
              <p class="muted small" style="padding:16px">No fields are enrolled in this project yet. Enrol fields before drawing zones.</p>
            } @else {
              @for (e of shown(); track e.field_id) {
                @let owner = takenBy().get(e.field_id);
                <label class="fr" [class.dis]="!!owner">
                  <input type="checkbox" [checked]="picked().has(e.field_id)" [disabled]="!!owner" (change)="toggle(e.field_id)" />
                  <span class="mono">{{ e.field_code }}</span>
                  <span class="muted truncate">{{ e.farmer_name }}</span>
                  <span class="spacer"></span>
                  @if (owner) { <span class="subtle small">in zone {{ owner }}</span> }
                  <span class="num small">{{ e.field_area_ha | num: 2 }} ha</span>
                </label>
              }
            }
          </div>
          <div class="sum">
            <span>Zone area</span>
            <strong class="num">{{ area() | num: 2 }} ha</strong>
            <vc-dc cls="DERIVED" />
            <span class="subtle small">Sum of selected field areas</span>
          </div>
        </div>

        @if (formError()) { <vc-callout tone="danger" icon="alert">{{ formError() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()">
          <vc-icon name="check" />{{ busy() ? 'Saving\u2026' : base() ? 'Save new version' : 'Create zone' }}
        </button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;9847abf5cc1356dc;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sampling\\zone-modal.ts */\n.fhead {\n  margin-bottom: 8px;\n}\n.search {\n  width: 240px;\n  height: 32px;\n}\n.flist {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  max-height: 260px;\n  overflow: auto;\n  background: var(--surface);\n}\n.fr {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 12px;\n  border-bottom: 1px solid var(--stone-100);\n  cursor: pointer;\n  font-size: 13.5px;\n}\n.fr:last-child {\n  border-bottom: 0;\n}\n.fr:hover {\n  background: var(--forest-50);\n}\n.fr.dis {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.fr input {\n  accent-color: var(--primary);\n  width: 16px;\n  height: 16px;\n}\n.sum {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 10px;\n  padding: 10px 12px;\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n}\n.sum strong {\n  font-size: 16px;\n}\n/*# sourceMappingURL=zone-modal.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }], strata: [{ type: Input, args: [{ isSignal: true, alias: "strata", required: false }] }], base: [{ type: Input, args: [{ isSignal: true, alias: "base", required: false }] }], saved: [{ type: Output, args: ["saved"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ZoneModal, { className: "ZoneModal", filePath: "src/app/features/sampling/zone-modal.ts", lineNumber: 122 });
})();

// src/app/features/sampling/sampling.page.ts
var _c03 = () => [];
var _forTrack06 = ($index, $item) => $item.id;
function SamplingPage_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 7);
  }
}
function SamplingPage_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 8);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function SamplingPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 5);
    \u0275\u0275conditionalCreate(1, SamplingPage_Conditional_6_Conditional_1_Template, 1, 0, "vc-empty", 7)(2, SamplingPage_Conditional_6_Conditional_2_Template, 1, 1, "vc-loading", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.ctx.loaded() ? 1 : 2);
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function SamplingPage_Conditional_7_Conditional_1_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.campOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 19);
    \u0275\u0275text(2, "Plan campaign");
    \u0275\u0275elementEnd();
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "vc-loading", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 5);
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-error", 16)(1, "button", 20);
    \u0275\u0275listener("click", function SamplingPage_Conditional_7_Conditional_1_Conditional_6_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.loadCampaigns());
    });
    \u0275\u0275text(2, "Try again");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("message", ctx_r0.cError());
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function SamplingPage_Conditional_7_Conditional_1_Conditional_7_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.campOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 19);
    \u0275\u0275text(2, "Plan campaign");
    \u0275\u0275elementEnd();
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 5)(1, "vc-empty", 21);
    \u0275\u0275conditionalCreate(2, SamplingPage_Conditional_7_Conditional_1_Conditional_7_Conditional_2_Template, 3, 0, "button", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") ? 2 : -1);
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_8_For_2_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "div", 36)(2, "span");
    \u0275\u0275text(3, "Field collection");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 37);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 38);
    \u0275\u0275element(7, "i", 39)(8, "i", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 41)(10, "span");
    \u0275\u0275element(11, "i", 39);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275element(14, "i", 40);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275element(17, "i", 42);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 43)(20, "span");
    \u0275\u0275text(21, "Lab: accepted soil carbon");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 37);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(24, "vc-progress", 44);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const p_r8 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", p_r8.points_collected, " of ", p_r8.points_total, " collected");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", 100 * p_r8.points_collected / p_r8.points_total, "%");
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", 100 * p_r8.points_skipped / p_r8.points_total, "%");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Collected ", p_r8.points_collected);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Skipped ", p_r8.points_skipped);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Planned ", p_r8.points_planned);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", p_r8.layers_with_accepted_soc, " of ", p_r8.layers_total, " bags");
    \u0275\u0275advance();
    \u0275\u0275property("value", p_r8.layers_with_accepted_soc)("max", p_r8.layers_total || 1);
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_8_For_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1, "No points placed yet. Approve a sample plan for every zone, then place points.");
    \u0275\u0275elementEnd();
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_8_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "button", 23);
    \u0275\u0275listener("click", function SamplingPage_Conditional_7_Conditional_1_Conditional_8_For_2_Template_button_click_1_listener() {
      const c_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.router.navigate(["/app/sampling", c_r7.id]));
    });
    \u0275\u0275elementStart(2, "div", 24)(3, "div", 25)(4, "div", 26)(5, "code", 27);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "vc-badge", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h3");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(10, "vc-icon", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 30)(12, "span");
    \u0275\u0275element(13, "vc-icon", 31);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "human");
    \u0275\u0275pipe(16, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275element(18, "vc-icon", 32);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "day");
    \u0275\u0275pipe(21, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span");
    \u0275\u0275element(23, "vc-icon", 33);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "num");
    \u0275\u0275pipe(26, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(27, SamplingPage_Conditional_7_Conditional_1_Conditional_8_For_2_Conditional_27_Template, 25, 13, "div", 34)(28, SamplingPage_Conditional_7_Conditional_1_Conditional_8_For_2_Conditional_28_Template, 2, 0, "p", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = ctx.$implicit;
    const p_r9 = \u0275\u0275storeLet(c_r7.progress);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(c_r7.code);
    \u0275\u0275advance();
    \u0275\u0275property("status", c_r7.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r7.name);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(15, 15, c_r7.kind), " \xB7 ", \u0275\u0275pipeBind1(16, 17, c_r7.design));
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(20, 19, c_r7.planned_start), " \u2013 ", \u0275\u0275pipeBind1(21, 21, c_r7.planned_end));
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(25, 23, c_r7.depth_from_cm, 0), "\u2013", \u0275\u0275pipeBind2(26, 26, c_r7.depth_to_cm, 0), " cm");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(p_r9 && p_r9.points_total ? 27 : 28);
  }
}
function SamplingPage_Conditional_7_Conditional_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275repeaterCreate(1, SamplingPage_Conditional_7_Conditional_1_Conditional_8_For_2_Template, 29, 29, "button", 22, _forTrack06);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.campaigns());
  }
}
function SamplingPage_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "p", 13);
    \u0275\u0275text(2, "A campaign moves from planned, to fieldwork, to the lab, to complete.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "div", 14);
    \u0275\u0275conditionalCreate(4, SamplingPage_Conditional_7_Conditional_1_Conditional_4_Template, 3, 0, "button", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, SamplingPage_Conditional_7_Conditional_1_Conditional_5_Template, 2, 1, "div", 5)(6, SamplingPage_Conditional_7_Conditional_1_Conditional_6_Template, 3, 1, "vc-error", 16)(7, SamplingPage_Conditional_7_Conditional_1_Conditional_7_Template, 3, 1, "section", 5)(8, SamplingPage_Conditional_7_Conditional_1_Conditional_8_Template, 3, 0, "div", 17);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.cLoading() ? 5 : ctx_r0.cError() ? 6 : !ctx_r0.campaigns().length ? 7 : 8);
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function SamplingPage_Conditional_7_Conditional_2_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openZone(null));
    });
    \u0275\u0275element(1, "vc-icon", 19);
    \u0275\u0275text(2, "New zone");
    \u0275\u0275elementEnd();
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 8);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275element(1, "vc-error", 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.sError());
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function SamplingPage_Conditional_7_Conditional_2_Conditional_9_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openZone(null));
    });
    \u0275\u0275element(1, "vc-icon", 19);
    \u0275\u0275text(2, "New zone");
    \u0275\u0275elementEnd();
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 48);
    \u0275\u0275conditionalCreate(1, SamplingPage_Conditional_7_Conditional_2_Conditional_9_Conditional_1_Template, 3, 0, "button", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") ? 1 : -1);
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r13 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" for ", s_r13.control_for_code);
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "closed");
    \u0275\u0275elementEnd();
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 59);
    \u0275\u0275listener("click", function SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_26_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const s_r13 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openZone(s_r13));
    });
    \u0275\u0275element(1, "vc-icon", 60);
    \u0275\u0275text(2, "New version");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "div");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_7_Template, 2, 1, "div", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "vc-badge", 28);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_11_Template, 2, 1, "span", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 54);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 55);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "num");
    \u0275\u0275element(17, "vc-dc", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275text(19);
    \u0275\u0275conditionalCreate(20, SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_20_Template, 2, 0, "span", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 57);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "day");
    \u0275\u0275pipe(24, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "td", 37);
    \u0275\u0275conditionalCreate(26, SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Conditional_26_Template, 3, 1, "button", 58);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_16_0;
    const s_r13 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("hist", !s_r13.is_current);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r13.code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r13.name);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_16_0 = ctx_r0.criteria(s_r13)) ? 7 : -1, tmp_16_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", s_r13.role === "project" ? "active" : "info");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r13.role === "project" ? "Project" : "Control");
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r13.control_for_code ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("title", (s_r13.field_codes ?? \u0275\u0275pureFunction0(24, _c03)).join(", "));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r13.field_ids.length);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(16, 17, s_r13.area_ha, 2), " ha ");
    \u0275\u0275advance(2);
    \u0275\u0275property("cls", s_r13.area_data_class);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("v", s_r13.version, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(!s_r13.is_current ? 20 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(23, 20, s_r13.effective_from), " \u2013 ", s_r13.effective_to ? \u0275\u0275pipeBind1(24, 22, s_r13.effective_to) : "now");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(s_r13.is_current && ctx_r0.auth.can("sampling.plan") ? 26 : -1);
  }
}
function SamplingPage_Conditional_7_Conditional_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "table", 51)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Role");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 37);
    \u0275\u0275text(11, "Fields");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 37);
    \u0275\u0275text(13, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Version");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Effective");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, SamplingPage_Conditional_7_Conditional_2_Conditional_10_For_21_Template, 27, 25, "tr", 52, _forTrack06);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(20);
    \u0275\u0275repeater(ctx_r0.strata());
  }
}
function SamplingPage_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "label", 45)(2, "input", 46);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SamplingPage_Conditional_7_Conditional_2_Template_input_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      ctx_r0.history.set($event);
      return \u0275\u0275resetView(ctx_r0.loadStrata());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Show earlier versions");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "div", 14);
    \u0275\u0275conditionalCreate(5, SamplingPage_Conditional_7_Conditional_2_Conditional_5_Template, 3, 0, "button", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "section", 5);
    \u0275\u0275conditionalCreate(7, SamplingPage_Conditional_7_Conditional_2_Conditional_7_Template, 1, 1, "vc-loading", 8)(8, SamplingPage_Conditional_7_Conditional_2_Conditional_8_Template, 2, 1, "div", 47)(9, SamplingPage_Conditional_7_Conditional_2_Conditional_9_Template, 2, 1, "vc-empty", 48)(10, SamplingPage_Conditional_7_Conditional_2_Conditional_10_Template, 22, 0, "div", 49);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r0.history());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.auth.can("sampling.plan") ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.sLoading() ? 7 : ctx_r0.sError() ? 8 : !ctx_r0.strata().length ? 9 : 10);
  }
}
function SamplingPage_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-tabs", 9);
    \u0275\u0275twoWayListener("activeChange", function SamplingPage_Conditional_7_Template_vc_tabs_activeChange_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.tab, $event) || (ctx_r0.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, SamplingPage_Conditional_7_Conditional_1_Template, 9, 2);
    \u0275\u0275conditionalCreate(2, SamplingPage_Conditional_7_Conditional_2_Template, 11, 3);
    \u0275\u0275elementStart(3, "vc-zone-modal", 10);
    \u0275\u0275twoWayListener("openChange", function SamplingPage_Conditional_7_Template_vc_zone_modal_openChange_3_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.zoneOpen, $event) || (ctx_r0.zoneOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("saved", function SamplingPage_Conditional_7_Template_vc_zone_modal_saved_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.loadStrata());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "vc-campaign-modal", 11);
    \u0275\u0275twoWayListener("openChange", function SamplingPage_Conditional_7_Template_vc_campaign_modal_openChange_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.campOpen, $event) || (ctx_r0.campOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("saved", function SamplingPage_Conditional_7_Template_vc_campaign_modal_saved_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onCampaign($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("tabs", ctx_r0.tabs());
    \u0275\u0275twoWayProperty("active", ctx_r0.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.tab() === "campaigns" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.tab() === "zones" ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.zoneOpen);
    \u0275\u0275property("projectId", ctx_r0.ctx.currentId())("strata", ctx_r0.currentStrata())("base", ctx_r0.zoneBase());
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.campOpen);
    \u0275\u0275property("projectId", ctx_r0.ctx.currentId())("campaigns", ctx_r0.campaigns());
  }
}
var SamplingPage = class _SamplingPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  router = inject(Router);
  tab = signal(
    "campaigns",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  campaigns = signal(
    [],
    ...ngDevMode ? [{ debugName: "campaigns" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "cLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cError = signal(
    null,
    ...ngDevMode ? [{ debugName: "cError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  strata = signal(
    [],
    ...ngDevMode ? [{ debugName: "strata" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "sLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sError = signal(
    null,
    ...ngDevMode ? [{ debugName: "sError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  history = signal(
    false,
    ...ngDevMode ? [{ debugName: "history" }] : (
      /* istanbul ignore next */
      []
    )
  );
  zoneOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "zoneOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  zoneBase = signal(
    null,
    ...ngDevMode ? [{ debugName: "zoneBase" }] : (
      /* istanbul ignore next */
      []
    )
  );
  campOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "campOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  traceOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "traceOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  traceCode = signal(
    "",
    ...ngDevMode ? [{ debugName: "traceCode" }] : (
      /* istanbul ignore next */
      []
    )
  );
  traceInput = "";
  currentStrata = computed(
    () => this.strata().filter((s) => s.is_current),
    ...ngDevMode ? [{ debugName: "currentStrata" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "campaigns", label: "Campaigns", count: this.cLoading() ? null : this.campaigns().length },
      { key: "zones", label: "Zones", count: this.sLoading() ? null : this.currentStrata().length }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (!this.ctx.currentId())
        return;
      untracked(() => {
        this.loadCampaigns();
        this.loadStrata();
      });
    });
  }
  loadCampaigns() {
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.cLoading.set(true);
    this.cError.set(null);
    this.api.get(`/projects/${pid}/campaigns`).subscribe({
      next: (r) => {
        this.campaigns.set(r);
        this.cLoading.set(false);
      },
      error: (e) => {
        this.cError.set(e.message);
        this.cLoading.set(false);
      }
    });
  }
  loadStrata() {
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.sLoading.set(true);
    this.sError.set(null);
    this.api.get(`/projects/${pid}/strata`, { all: this.history() }).subscribe({
      next: (r) => {
        this.strata.set(r);
        this.sLoading.set(false);
      },
      error: (e) => {
        this.sError.set(e.message);
        this.sLoading.set(false);
      }
    });
  }
  openZone(s) {
    this.zoneBase.set(s);
    this.zoneOpen.set(true);
  }
  onCampaign(c) {
    this.loadCampaigns();
    this.router.navigate(["/app/sampling", c.id]);
  }
  runTrace() {
    const c = this.traceInput.trim();
    if (!c)
      return;
    this.traceCode.set(c);
    this.traceOpen.set(true);
  }
  criteria(s) {
    return Object.entries(s.criteria ?? {}).map(([, v]) => String(v)).filter(Boolean).join(" \xB7 ");
  }
  static \u0275fac = function SamplingPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SamplingPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SamplingPage, selectors: [["vc-sampling-page"]], decls: 9, vars: 7, consts: [["title", "Sampling", "eyebrow", "Measurement", 3, "subtitle"], ["actions", "", 1, "trace", 3, "submit"], ["name", "scan", 3, "size"], ["placeholder", "Trace a sample or bag code\u2026", "name", "trace", "aria-label", "Sample or bag code", 1, "input", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "btn", "btn-secondary", "btn-sm", 3, "disabled"], [1, "card"], [3, "openChange", "open", "code"], ["icon", "briefcase", "title", "No project selected", "text", "Choose a project in the top bar. Sampling is always planned for one project."], [3, "rows"], [3, "activeChange", "tabs", "active"], [3, "openChange", "saved", "open", "projectId", "strata", "base"], [3, "openChange", "saved", "open", "projectId", "campaigns"], [1, "bar"], [1, "muted", "small"], [1, "spacer"], [1, "btn", "btn-primary"], ["title", "Couldn't load campaigns", 3, "message"], [1, "cards"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["icon", "target", "title", "No campaigns yet", "text", "Plan the baseline campaign first. Monitoring campaigns re-measure the same zones later."], [1, "card", "camp"], [1, "card", "camp", 3, "click"], [1, "ch"], [1, "ct"], [1, "row", 2, "--gap", "8px"], [1, "code"], [3, "status"], ["name", "chevron-right", 3, "size"], [1, "meta"], ["name", "target", 3, "size"], ["name", "calendar", 3, "size"], ["name", "ruler", 3, "size"], [1, "prog"], [1, "subtle", "small", "noprog"], [1, "pl"], [1, "num"], [1, "stackbar"], [1, "s-col"], [1, "s-skip"], [1, "legend"], [1, "s-plan"], [1, "pl", 2, "margin-top", "10px"], [3, "value", "max"], [1, "checkbox"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "card-body"], ["icon", "layers", "title", "No zones drawn", "text", "Group the enrolled fields into zones of similar soil and land use. Each zone gets its own sample size."], [1, "table-wrap"], ["title", "Couldn't load zones", 3, "message"], [1, "table"], [3, "hist"], [1, "subtle", "small"], [1, "num", 3, "title"], [1, "num", "nowrap"], [3, "cls"], [1, "nowrap"], [1, "btn", "btn-ghost", "btn-sm"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "branch", 3, "size"]], template: function SamplingPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "form", 1);
      \u0275\u0275listener("submit", function SamplingPage_Template_form_submit_1_listener($event) {
        $event.preventDefault();
        return ctx.runTrace();
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275elementStart(3, "input", 3);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function SamplingPage_Template_input_ngModelChange_3_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.traceInput, $event) || (ctx.traceInput = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 4);
      \u0275\u0275text(5, "Trace");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(6, SamplingPage_Conditional_6_Template, 3, 1, "section", 5)(7, SamplingPage_Conditional_7_Template, 5, 11);
      \u0275\u0275elementStart(8, "vc-trace-drawer", 6);
      \u0275\u0275twoWayListener("openChange", function SamplingPage_Template_vc_trace_drawer_openChange_8_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.traceOpen, $event) || (ctx.traceOpen = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("subtitle", "Zones, campaigns and soil cores for " + (ctx.ctx.current()?.name ?? "the current project") + ". Every point is placed reproducibly and every core is traceable to the bag on the lab bench.");
      \u0275\u0275advance(2);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("ngModel", ctx.traceInput);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("disabled", !ctx.traceInput.trim());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.ctx.currentId() ? 6 : 7);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.traceOpen);
      \u0275\u0275property("code", ctx.traceCode());
    }
  }, dependencies: [
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    CheckboxControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    NgModel,
    NgForm,
    PageHeader,
    Tabs,
    Loading,
    ErrorBox,
    Empty,
    Badge,
    DataClass,
    Progress,
    Icon,
    ZoneModal,
    CampaignModal,
    TraceDrawer,
    DayPipe,
    NumPipe,
    HumanPipe
  ], styles: ["\n.trace[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.trace[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 11px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.trace[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 32px;\n  width: 260px;\n}\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n}\n.cards[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));\n  gap: 16px;\n}\n.camp[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  padding: 18px 20px;\n  text-align: left;\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.camp[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%forest-300);\n  box-shadow: var(--%NS%shadow);\n}\n.ch[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n}\n.ct[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.ch[_ngcontent-%COMP%]    > vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n  margin-top: 2px;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%stone-600);\n}\n.meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px 16px;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.prog[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--%NS%stone-100);\n  padding-top: 12px;\n}\n.pl[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  margin-bottom: 6px;\n}\n.stackbar[_ngcontent-%COMP%] {\n  display: flex;\n  height: 8px;\n  border-radius: 4px;\n  background: var(--%NS%sand-200);\n  overflow: hidden;\n}\n.stackbar[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n}\n.s-col[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n}\n.s-skip[_ngcontent-%COMP%] {\n  background: var(--%NS%clay-300);\n}\n.s-plan[_ngcontent-%COMP%] {\n  background: var(--%NS%sand-300);\n}\n.legend[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 14px;\n  margin-top: 6px;\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.legend[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.legend[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n  display: inline-block;\n}\n.noprog[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--%NS%stone-100);\n  padding-top: 12px;\n}\ntr.hist[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n  background: var(--%NS%surface-2);\n}\n@media (max-width: 760px) {\n  .cards[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .trace[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=sampling.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SamplingPage, [{
    type: Component,
    args: [{ selector: "vc-sampling-page", imports: [
      FormsModule,
      PageHeader,
      Tabs,
      Loading,
      ErrorBox,
      Empty,
      Badge,
      DataClass,
      Progress,
      Icon,
      DayPipe,
      NumPipe,
      HumanPipe,
      ZoneModal,
      CampaignModal,
      TraceDrawer
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Sampling" eyebrow="Measurement"
      [subtitle]="'Zones, campaigns and soil cores for ' + (ctx.current()?.name ?? 'the current project') + '. Every point is placed reproducibly and every core is traceable to the bag on the lab bench.'">
      <form actions class="trace" (submit)="$event.preventDefault(); runTrace()">
        <vc-icon name="scan" [size]="15" />
        <input class="input" placeholder="Trace a sample or bag code\u2026" [(ngModel)]="traceInput" name="trace" aria-label="Sample or bag code" />
        <button class="btn btn-secondary btn-sm" type="submit" [disabled]="!traceInput.trim()">Trace</button>
      </form>
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card">
        @if (ctx.loaded()) {
          <vc-empty icon="briefcase" title="No project selected" text="Choose a project in the top bar. Sampling is always planned for one project." />
        } @else { <vc-loading [rows]="4" /> }
      </section>
    } @else {
      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @if (tab() === 'campaigns') {
        <div class="bar">
          <p class="muted small">A campaign moves from planned, to fieldwork, to the lab, to complete.</p>
          <div class="spacer"></div>
          @if (auth.can('sampling.plan')) {
            <button class="btn btn-primary" (click)="campOpen.set(true)"><vc-icon name="plus" />Plan campaign</button>
          }
        </div>
        @if (cLoading()) {
          <div class="card"><vc-loading [rows]="5" /></div>
        } @else if (cError()) {
          <vc-error title="Couldn't load campaigns" [message]="cError()!"><button class="btn btn-secondary btn-sm" (click)="loadCampaigns()">Try again</button></vc-error>
        } @else if (!campaigns().length) {
          <section class="card">
            <vc-empty icon="target" title="No campaigns yet" text="Plan the baseline campaign first. Monitoring campaigns re-measure the same zones later.">
              @if (auth.can('sampling.plan')) { <button class="btn btn-primary" (click)="campOpen.set(true)"><vc-icon name="plus" />Plan campaign</button> }
            </vc-empty>
          </section>
        } @else {
          <div class="cards">
            @for (c of campaigns(); track c.id) {
              @let p = c.progress;
              <button class="card camp" (click)="router.navigate(['/app/sampling', c.id])">
                <div class="ch">
                  <div class="ct">
                    <div class="row" style="--gap:8px"><code class="code">{{ c.code }}</code><vc-badge [status]="c.status" /></div>
                    <h3>{{ c.name }}</h3>
                  </div>
                  <vc-icon name="chevron-right" [size]="18" />
                </div>
                <div class="meta">
                  <span><vc-icon name="target" [size]="14" />{{ c.kind | human }} \xB7 {{ c.design | human }}</span>
                  <span><vc-icon name="calendar" [size]="14" />{{ c.planned_start | day }} \u2013 {{ c.planned_end | day }}</span>
                  <span><vc-icon name="ruler" [size]="14" />{{ c.depth_from_cm | num: 0 }}\u2013{{ c.depth_to_cm | num: 0 }} cm</span>
                </div>
                @if (p && p.points_total) {
                  <div class="prog">
                    <div class="pl"><span>Field collection</span><span class="num">{{ p.points_collected }} of {{ p.points_total }} collected</span></div>
                    <div class="stackbar">
                      <i class="s-col" [style.width.%]="100 * p.points_collected / p.points_total"></i>
                      <i class="s-skip" [style.width.%]="100 * p.points_skipped / p.points_total"></i>
                    </div>
                    <div class="legend">
                      <span><i class="s-col"></i>Collected {{ p.points_collected }}</span>
                      <span><i class="s-skip"></i>Skipped {{ p.points_skipped }}</span>
                      <span><i class="s-plan"></i>Planned {{ p.points_planned }}</span>
                    </div>
                    <div class="pl" style="margin-top:10px"><span>Lab: accepted soil carbon</span><span class="num">{{ p.layers_with_accepted_soc }} of {{ p.layers_total }} bags</span></div>
                    <vc-progress [value]="p.layers_with_accepted_soc" [max]="p.layers_total || 1" />
                  </div>
                } @else {
                  <p class="subtle small noprog">No points placed yet. Approve a sample plan for every zone, then place points.</p>
                }
              </button>
            }
          </div>
        }
      }

      @if (tab() === 'zones') {
        <div class="bar">
          <label class="checkbox"><input type="checkbox" [ngModel]="history()" (ngModelChange)="history.set($event); loadStrata()" />Show earlier versions</label>
          <div class="spacer"></div>
          @if (auth.can('sampling.plan')) {
            <button class="btn btn-primary" (click)="openZone(null)"><vc-icon name="plus" />New zone</button>
          }
        </div>
        <section class="card">
          @if (sLoading()) {
            <vc-loading [rows]="5" />
          } @else if (sError()) {
            <div class="card-body"><vc-error title="Couldn't load zones" [message]="sError()!" /></div>
          } @else if (!strata().length) {
            <vc-empty icon="layers" title="No zones drawn" text="Group the enrolled fields into zones of similar soil and land use. Each zone gets its own sample size.">
              @if (auth.can('sampling.plan')) { <button class="btn btn-primary" (click)="openZone(null)"><vc-icon name="plus" />New zone</button> }
            </vc-empty>
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr>
                  <th>Code</th><th>Name</th><th>Role</th><th class="num">Fields</th><th class="num">Area</th><th>Version</th><th>Effective</th><th></th>
                </tr></thead>
                <tbody>
                  @for (s of strata(); track s.id) {
                    <tr [class.hist]="!s.is_current">
                      <td><code>{{ s.code }}</code></td>
                      <td>
                        <div>{{ s.name }}</div>
                        @if (criteria(s); as c) { <div class="subtle small">{{ c }}</div> }
                      </td>
                      <td>
                        <vc-badge [status]="s.role === 'project' ? 'active' : 'info'">{{ s.role === 'project' ? 'Project' : 'Control' }}</vc-badge>
                        @if (s.control_for_code) { <span class="subtle small"> for {{ s.control_for_code }}</span> }
                      </td>
                      <td class="num" [title]="(s.field_codes ?? []).join(', ')">{{ s.field_ids.length }}</td>
                      <td class="num nowrap">{{ s.area_ha | num: 2 }} ha <vc-dc [cls]="s.area_data_class" /></td>
                      <td>v{{ s.version }} @if (!s.is_current) { <span class="subtle small">closed</span> }</td>
                      <td class="nowrap">{{ s.effective_from | day }} \u2013 {{ s.effective_to ? (s.effective_to | day) : 'now' }}</td>
                      <td class="num">
                        @if (s.is_current && auth.can('sampling.plan')) {
                          <button class="btn btn-ghost btn-sm" (click)="openZone(s)"><vc-icon name="branch" [size]="14" />New version</button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }

      <vc-zone-modal [(open)]="zoneOpen" [projectId]="ctx.currentId()!" [strata]="currentStrata()" [base]="zoneBase()" (saved)="loadStrata()" />
      <vc-campaign-modal [(open)]="campOpen" [projectId]="ctx.currentId()!" [campaigns]="campaigns()" (saved)="onCampaign($event)" />
    }
    <vc-trace-drawer [(open)]="traceOpen" [code]="traceCode()" />
  `, styles: ["/* angular:styles/component:scss;6aa18673aa7e978a;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sampling\\sampling.page.ts */\n.trace {\n  position: relative;\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.trace vc-icon {\n  position: absolute;\n  left: 11px;\n  top: 11px;\n  color: var(--text-3);\n}\n.trace .input {\n  padding-left: 32px;\n  width: 260px;\n}\n.bar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n}\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));\n  gap: 16px;\n}\n.camp {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  padding: 18px 20px;\n  text-align: left;\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.camp:hover {\n  border-color: var(--forest-300);\n  box-shadow: var(--shadow);\n}\n.ch {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n}\n.ct {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.ch > vc-icon {\n  color: var(--text-3);\n  margin-top: 2px;\n}\n.code {\n  font-size: 12px;\n  color: var(--stone-600);\n}\n.meta {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px 16px;\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.meta span {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.prog {\n  border-top: 1px solid var(--stone-100);\n  padding-top: 12px;\n}\n.pl {\n  display: flex;\n  justify-content: space-between;\n  font-size: 12.5px;\n  color: var(--text-2);\n  margin-bottom: 6px;\n}\n.stackbar {\n  display: flex;\n  height: 8px;\n  border-radius: 4px;\n  background: var(--sand-200);\n  overflow: hidden;\n}\n.stackbar i {\n  display: block;\n  height: 100%;\n}\n.s-col {\n  background: var(--forest-500);\n}\n.s-skip {\n  background: var(--clay-300);\n}\n.s-plan {\n  background: var(--sand-300);\n}\n.legend {\n  display: flex;\n  gap: 14px;\n  margin-top: 6px;\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.legend span {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.legend i {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n  display: inline-block;\n}\n.noprog {\n  border-top: 1px solid var(--stone-100);\n  padding-top: 12px;\n}\ntr.hist td {\n  color: var(--text-3);\n  background: var(--surface-2);\n}\n@media (max-width: 760px) {\n  .cards {\n    grid-template-columns: 1fr;\n  }\n  .trace .input {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=sampling.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SamplingPage, { className: "SamplingPage", filePath: "src/app/features/sampling/sampling.page.ts", lineNumber: 185 });
})();

// src/app/features/sampling/sampling.routes.ts
var sampling_routes_default = [
  { path: "", component: SamplingPage, title: "Sampling \xB7 Varsapradaya Carbon" },
  { path: ":id", component: CampaignPage, title: "Campaign \xB7 Varsapradaya Carbon" }
];
export {
  sampling_routes_default as default
};
//# debugId=c077d5ff-5c9b-5974-abb7-4663108e4380
//# sourceMappingURL=chunk-IPZRZ62M.js.map
