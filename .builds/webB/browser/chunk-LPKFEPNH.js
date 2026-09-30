import {
  ConfirmDialog
} from "./chunk-KNF3QYXO.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
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
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  AuthService
} from "./chunk-PNIM44LI.js";
import {
  Badge,
  Callout,
  DataClass,
  Empty,
  ErrorBox,
  FileDrop,
  Hash,
  Loading,
  Modal,
  PageHeader,
  Tabs
} from "./chunk-PAXTZ3VZ.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Injectable,
  Input,
  Output,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  effect,
  forkJoin,
  inject,
  map,
  model,
  of,
  output,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
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
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstoreLet,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/lab/lab-context.ts
var LabContext = class _LabContext {
  api = inject(ApiService);
  auth = inject(AuthService);
  labs = signal(
    [],
    ...ngDevMode ? [{ debugName: "labs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  labsLoaded = signal(
    false,
    ...ngDevMode ? [{ debugName: "labsLoaded" }] : (
      /* istanbul ignore next */
      []
    )
  );
  labsError = signal(
    null,
    ...ngDevMode ? [{ debugName: "labsError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  calibrations = signal(
    [],
    ...ngDevMode ? [{ debugName: "calibrations" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** A lab technician is tied to exactly one lab through their account scope. */
  scopedLabId = computed(
    () => this.auth.profile()?.scope?.["lab_id"] ?? null,
    ...ngDevMode ? [{ debugName: "scopedLabId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  isTechnician = computed(
    () => this.auth.profile()?.role === "lab_technician",
    ...ngDevMode ? [{ debugName: "isTechnician" }] : (
      /* istanbul ignore next */
      []
    )
  );
  myLab = computed(
    () => {
      const id = this.scopedLabId();
      return id ? this.labs().find((l) => l.id === id) ?? null : null;
    },
    ...ngDevMode ? [{ debugName: "myLab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  unscopedTech = computed(
    () => this.isTechnician() && !this.scopedLabId(),
    ...ngDevMode ? [{ debugName: "unscopedTech" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loadLabs() {
    this.api.get("/labs").subscribe({
      next: (l) => {
        this.labs.set(l);
        this.labsLoaded.set(true);
        this.labsError.set(null);
      },
      error: (e) => {
        this.labsError.set(e.message);
        this.labsLoaded.set(true);
      }
    });
  }
  loadCalibrations() {
    this.api.get("/spectral-calibrations").subscribe({
      next: (c) => this.calibrations.set(c),
      error: () => this.calibrations.set([])
    });
  }
  labName(id) {
    return this.labs().find((l) => l.id === id)?.name ?? "\u2014";
  }
  /** Resolve a bag code or label to its soil layer(s), via the traceability endpoint. */
  findBag(code) {
    const c = code.trim();
    if (!c)
      return of([]);
    return this.api.get(`/samples/by-code/${encodeURIComponent(c)}/trace`).pipe(map((t) => t.sample.layers.filter((l) => !t.bag || l.id === t.bag.id).map((l) => ({
      layerId: l.id,
      bagCode: l.code,
      labelQr: l.label_qr,
      depth: `${l.depth_from_cm}\u2013${l.depth_to_cm} cm`,
      sampleCode: t.sample.code,
      collectedAt: t.sample.collected_at,
      campaignCode: t.campaign.code
    }))));
  }
  static \u0275fac = function LabContext_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LabContext)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LabContext, factory: _LabContext.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LabContext, [{
    type: Injectable
  }], null, null);
})();

// src/app/features/lab/lab-batches.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.layer_id;
function LabBatches_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function LabBatches_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 31);
    \u0275\u0275text(2, "New batch");
    \u0275\u0275elementEnd();
  }
}
function LabBatches_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function LabBatches_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "vc-error", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function LabBatches_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 7);
  }
}
function LabBatches_Conditional_9_For_19_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function LabBatches_Conditional_9_For_19_Conditional_18_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const b_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      ctx_r1.dispatchTarget.set(b_r4);
      return \u0275\u0275resetView(ctx_r1.dispatchOn = ctx_r1.today);
    });
    \u0275\u0275element(1, "vc-icon", 40);
    \u0275\u0275text(2, "Dispatch");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function LabBatches_Conditional_9_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 36);
    \u0275\u0275listener("click", function LabBatches_Conditional_9_For_19_Template_tr_click_0_listener() {
      const b_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openManifest(b_r4));
    });
    \u0275\u0275elementStart(1, "td")(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 34);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "vc-badge", 37);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td", 34);
    \u0275\u0275conditionalCreate(18, LabBatches_Conditional_9_For_19_Conditional_18_Template, 3, 1, "button", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const b_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r4.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r4.campaign_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r4.lab_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r4.bag_count);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r4.dispatched_on ? \u0275\u0275pipeBind1(12, 8, b_r4.dispatched_on) : "\u2014");
    \u0275\u0275advance(3);
    \u0275\u0275property("status", b_r4.status === "open" ? "draft" : b_r4.status);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 10, b_r4.status));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(b_r4.status === "open" && ctx_r1.canCreate() ? 18 : -1);
  }
}
function LabBatches_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "table", 33)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Batch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Lab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 34);
    \u0275\u0275text(11, "Bags");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Dispatched");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, LabBatches_Conditional_9_For_19_Template, 19, 12, "tr", 35, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r1.batches());
  }
}
function LabBatches_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r6 = ctx.$implicit;
    \u0275\u0275property("value", c_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", c_r6.code, " \xB7 ", c_r6.name);
  }
}
function LabBatches_For_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r7 = ctx.$implicit;
    \u0275\u0275property("value", l_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r7.name);
  }
}
function LabBatches_Conditional_29_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function LabBatches_Conditional_29_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 45);
    \u0275\u0275text(1, "No bags recorded for this campaign yet.");
    \u0275\u0275elementEnd();
  }
}
function LabBatches_Conditional_29_Conditional_12_For_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const taken_r11 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("in ", taken_r11);
  }
}
function LabBatches_Conditional_29_Conditional_12_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "label", 47)(2, "input", 48);
    \u0275\u0275listener("change", function LabBatches_Conditional_29_Conditional_12_For_1_Template_input_change_2_listener() {
      const l_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggle(l_r10.layer_id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "code");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "span", 2);
    \u0275\u0275conditionalCreate(6, LabBatches_Conditional_29_Conditional_12_For_1_Conditional_6_Template, 2, 1, "span", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    const taken_r12 = \u0275\u0275storeLet(ctx_r1.takenBy().get(l_r10.layer_id));
    \u0275\u0275advance();
    \u0275\u0275classProp("dis", !!taken_r12);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !!taken_r12)("checked", ctx_r1.picked().has(l_r10.layer_id));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(l_r10.bag_code);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(taken_r12 ? 6 : -1);
  }
}
function LabBatches_Conditional_29_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, LabBatches_Conditional_29_Conditional_12_For_1_Template, 7, 7, "label", 46, _forTrack1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.layers());
  }
}
function LabBatches_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 41)(2, "strong");
    \u0275\u0275text(3, "Bags");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 42);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "div", 2);
    \u0275\u0275elementStart(7, "button", 43);
    \u0275\u0275listener("click", function LabBatches_Conditional_29_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.pickAllFree());
    });
    \u0275\u0275text(8, "Select all not yet batched");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 44);
    \u0275\u0275conditionalCreate(10, LabBatches_Conditional_29_Conditional_10_Template, 1, 1, "vc-loading", 5)(11, LabBatches_Conditional_29_Conditional_11_Template, 2, 0, "p", 45)(12, LabBatches_Conditional_29_Conditional_12_Template, 2, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r1.picked().size, " selected");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.layersLoading() ? 10 : !ctx_r1.layers().length ? 11 : 12);
  }
}
function LabBatches_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.createErr());
  }
}
function LabBatches_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function LabBatches_Conditional_53_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 49);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 34);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "num");
    \u0275\u0275pipe(9, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "day");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r13 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r13.bag_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r13.label_qr);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(8, 6, m_r13.depth_from_cm, 0), "\u2013", \u0275\u0275pipeBind2(9, 9, m_r13.depth_to_cm, 0), " cm");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(m_r13.sample_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 12, m_r13.collected_at));
  }
}
function LabBatches_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "table", 33)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Bag");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Label");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 34);
    \u0275\u0275text(9, "Depth");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Sample");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Collected");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, LabBatches_Conditional_53_For_16_Template, 15, 14, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx);
  }
}
var LabBatches = class _LabBatches {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  project = inject(ProjectContext);
  lab = inject(LabContext);
  today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  batches = signal(
    [],
    ...ngDevMode ? [{ debugName: "batches" }] : (
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
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  createOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "createOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  createErr = signal(
    null,
    ...ngDevMode ? [{ debugName: "createErr" }] : (
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
  campId = signal(
    "",
    ...ngDevMode ? [{ debugName: "campId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  labId = "";
  layers = signal(
    [],
    ...ngDevMode ? [{ debugName: "layers" }] : (
      /* istanbul ignore next */
      []
    )
  );
  layersLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "layersLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  takenBy = signal(
    /* @__PURE__ */ new Map(),
    ...ngDevMode ? [{ debugName: "takenBy" }] : (
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
  dispatchTarget = signal(
    null,
    ...ngDevMode ? [{ debugName: "dispatchTarget" }] : (
      /* istanbul ignore next */
      []
    )
  );
  dispatchOn = this.today;
  manifest = signal(
    null,
    ...ngDevMode ? [{ debugName: "manifest" }] : (
      /* istanbul ignore next */
      []
    )
  );
  manifestLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "manifestLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canCreate = computed(
    () => this.auth.can("sampling.plan", "custody.record") && this.auth.can("data.read"),
    ...ngDevMode ? [{ debugName: "canCreate" }] : (
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
    this.api.get("/lab-batches").subscribe({
      next: (b) => {
        this.batches.set([...b].reverse());
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  openCreate() {
    this.createErr.set(null);
    this.campId.set("");
    this.layers.set([]);
    this.picked.set(/* @__PURE__ */ new Set());
    this.labId = this.lab.labs().length === 1 ? this.lab.labs()[0].id : "";
    this.createOpen.set(true);
    const pid = this.project.currentId();
    if (pid) {
      this.api.get(`/projects/${pid}/campaigns`).subscribe({ next: (c) => this.campaigns.set(c), error: () => this.campaigns.set([]) });
    }
  }
  pickCampaign(id) {
    this.campId.set(id);
    this.picked.set(/* @__PURE__ */ new Set());
    if (!id)
      return;
    this.layersLoading.set(true);
    const existing = this.batches().filter((b) => b.campaign_id === id);
    forkJoin({
      prog: this.api.get(`/campaigns/${id}/lab-progress`),
      details: existing.length ? forkJoin(existing.map((b) => this.api.get(`/lab-batches/${b.id}`).pipe(catchError(() => of(b))))) : of([])
    }).subscribe({
      next: ({ prog, details }) => {
        const m = /* @__PURE__ */ new Map();
        for (const b of details)
          for (const x of b.manifest ?? [])
            m.set(x.layer_id, b.code);
        this.takenBy.set(m);
        this.layers.set(prog.matrix);
        this.layersLoading.set(false);
      },
      error: (e) => {
        this.layersLoading.set(false);
        this.createErr.set(e.message);
      }
    });
  }
  toggle(id) {
    const s = new Set(this.picked());
    s.has(id) ? s.delete(id) : s.add(id);
    this.picked.set(s);
  }
  pickAllFree() {
    this.picked.set(new Set(this.layers().filter((l) => !this.takenBy().has(l.layer_id)).map((l) => l.layer_id)));
  }
  create() {
    this.busy.set(true);
    this.createErr.set(null);
    this.api.post("/lab-batches", { lab_id: this.labId, campaign_id: this.campId(), layer_ids: [...this.picked()] }).subscribe({
      next: (b) => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.toast.success(`Batch ${b.code} created`, `${b.bag_count} bags`);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.createErr.set(e.message);
      }
    });
  }
  dispatch() {
    const b = this.dispatchTarget();
    if (!b)
      return;
    this.busy.set(true);
    this.api.post(`/lab-batches/${b.id}/dispatch`, { dispatched_on: this.dispatchOn || null }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.dispatchTarget.set(null);
        this.toast.success(`Batch ${r.code} dispatched`);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't dispatch the batch");
      }
    });
  }
  openManifest(b) {
    this.manifest.set(b);
    this.manifestLoading.set(true);
    this.api.get(`/lab-batches/${b.id}`).subscribe({
      next: (r) => {
        this.manifest.set(r);
        this.manifestLoading.set(false);
      },
      error: (e) => {
        this.manifestLoading.set(false);
        this.toast.apiError(e, "Couldn't load the manifest");
      }
    });
  }
  static \u0275fac = function LabBatches_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LabBatches)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LabBatches, selectors: [["vc-lab-batches"]], decls: 54, vars: 20, consts: [[1, "bar"], [1, "muted", "small"], [1, "spacer"], [1, "btn", "btn-primary"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "package", "title", "No batches yet", "text", "Group collected bags from a campaign into a batch, then dispatch it to the lab."], [1, "table-wrap"], ["title", "New lab batch", "width", "640px", "subtitle", "Choose the campaign and lab, then the bags going into this box.", 3, "openChange", "open"], [1, "stack", 2, "--gap", "14px"], [1, "form-grid"], [1, "field"], ["for", "b-camp"], ["id", "b-camp", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["for", "b-lab"], ["id", "b-lab", 1, "input", 3, "ngModelChange", "ngModel"], ["tone", "danger", "icon", "alert"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "package"], ["width", "460px", 3, "closed", "open", "title"], [1, "muted"], ["for", "d-on"], ["id", "d-on", "type", "date", 1, "input", 3, "ngModelChange", "ngModel", "max"], ["name", "truck"], ["width", "620px", 3, "closed", "open", "drawer", "title", "subtitle"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["title", "Couldn't load batches", 3, "message"], [1, "table"], [1, "num"], [1, "clickable"], [1, "clickable", 3, "click"], [3, "status"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "truck", 3, "size"], [1, "row", "lh"], [1, "subtle", "small"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [1, "blist"], [1, "muted", "small", 2, "padding", "14px"], [1, "br", 3, "dis"], [1, "br"], ["type", "checkbox", 3, "change", "disabled", "checked"], [1, "mono", "small"]], template: function LabBatches_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "p", 1);
      \u0275\u0275text(2, "A batch is one shipment of bags to one lab \u2014 its manifest travels with the box.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "div", 2);
      \u0275\u0275conditionalCreate(4, LabBatches_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "section", 4);
      \u0275\u0275conditionalCreate(6, LabBatches_Conditional_6_Template, 1, 1, "vc-loading", 5)(7, LabBatches_Conditional_7_Template, 2, 1, "div", 6)(8, LabBatches_Conditional_8_Template, 1, 0, "vc-empty", 7)(9, LabBatches_Conditional_9_Template, 20, 0, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "vc-modal", 9);
      \u0275\u0275twoWayListener("openChange", function LabBatches_Template_vc_modal_openChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(11, "div", 10)(12, "div", 11)(13, "div", 12)(14, "label", 13);
      \u0275\u0275text(15, "Campaign");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "select", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabBatches_Template_select_ngModelChange_16_listener($event) {
        return ctx.pickCampaign($event);
      });
      \u0275\u0275elementStart(17, "option", 15);
      \u0275\u0275text(18, "Choose\u2026");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(19, LabBatches_For_20_Template, 2, 3, "option", 16, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 12)(22, "label", 17);
      \u0275\u0275text(23, "Lab");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "select", 18);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabBatches_Template_select_ngModelChange_24_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.labId, $event) || (ctx.labId = $event);
        return $event;
      });
      \u0275\u0275elementStart(25, "option", 15);
      \u0275\u0275text(26, "Choose\u2026");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(27, LabBatches_For_28_Template, 2, 2, "option", 16, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(29, LabBatches_Conditional_29_Template, 13, 2, "div");
      \u0275\u0275conditionalCreate(30, LabBatches_Conditional_30_Template, 2, 1, "vc-callout", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(31, 20);
      \u0275\u0275elementStart(32, "button", 21);
      \u0275\u0275listener("click", function LabBatches_Template_button_click_32_listener() {
        return ctx.createOpen.set(false);
      });
      \u0275\u0275text(33, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "button", 22);
      \u0275\u0275listener("click", function LabBatches_Template_button_click_34_listener() {
        return ctx.create();
      });
      \u0275\u0275element(35, "vc-icon", 23);
      \u0275\u0275text(36, "Create batch");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "vc-modal", 24);
      \u0275\u0275listener("closed", function LabBatches_Template_vc_modal_closed_37_listener() {
        return ctx.dispatchTarget.set(null);
      });
      \u0275\u0275elementStart(38, "div", 10)(39, "p", 25);
      \u0275\u0275text(40);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 12)(42, "label", 26);
      \u0275\u0275text(43, "Dispatched on");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "input", 27);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabBatches_Template_input_ngModelChange_44_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dispatchOn, $event) || (ctx.dispatchOn = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementContainerStart(45, 20);
      \u0275\u0275elementStart(46, "button", 21);
      \u0275\u0275listener("click", function LabBatches_Template_button_click_46_listener() {
        return ctx.dispatchTarget.set(null);
      });
      \u0275\u0275text(47, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "button", 22);
      \u0275\u0275listener("click", function LabBatches_Template_button_click_48_listener() {
        return ctx.dispatch();
      });
      \u0275\u0275element(49, "vc-icon", 28);
      \u0275\u0275text(50, "Dispatch");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "vc-modal", 29);
      \u0275\u0275listener("closed", function LabBatches_Template_vc_modal_closed_51_listener() {
        return ctx.manifest.set(null);
      });
      \u0275\u0275conditionalCreate(52, LabBatches_Conditional_52_Template, 1, 1, "vc-loading", 5)(53, LabBatches_Conditional_53_Template, 17, 0, "div", 8);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_23_0;
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canCreate() ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 6 : ctx.error() ? 7 : !ctx.batches().length ? 8 : 9);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.campId());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.campaigns());
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.labId);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.lab.labs());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.campId() ? 29 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.createErr() ? 30 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.labId || !ctx.picked().size || ctx.busy());
      \u0275\u0275advance(3);
      \u0275\u0275property("open", !!ctx.dispatchTarget())("title", "Dispatch " + (ctx.dispatchTarget()?.code ?? "") + "?");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate2("", ctx.dispatchTarget()?.bag_count, " bags go to ", ctx.dispatchTarget()?.lab_name, ". After dispatch the batch can't be changed; the lab records receipt, seal and bag count on arrival.");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.dispatchOn);
      \u0275\u0275property("max", ctx.today);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance(3);
      \u0275\u0275property("open", !!ctx.manifest())("drawer", true)("title", "Manifest " + (ctx.manifest()?.code ?? ""))("subtitle", (ctx.manifest()?.lab_name ?? "") + " \xB7 " + (ctx.manifest()?.bag_count ?? 0) + " bags");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.manifestLoading() ? 52 : (tmp_23_0 = ctx.manifest()?.manifest) ? 53 : -1, tmp_23_0);
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, Icon, Badge, Callout, Empty, ErrorBox, Loading, Modal, DayPipe, NumPipe, HumanPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n.lh[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n}\n.blist[_ngcontent-%COMP%] {\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  max-height: 280px;\n  overflow: auto;\n}\n.br[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 7px 12px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n  cursor: pointer;\n  font-size: 13px;\n}\n.br[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.br.dis[_ngcontent-%COMP%] {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.br[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n  width: 16px;\n  height: 16px;\n}\n/*# sourceMappingURL=lab-batches.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LabBatches, [{
    type: Component,
    args: [{ selector: "vc-lab-batches", imports: [FormsModule, Icon, Badge, Callout, Empty, ErrorBox, Loading, Modal, DayPipe, NumPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <p class="muted small">A batch is one shipment of bags to one lab \u2014 its manifest travels with the box.</p>
      <div class="spacer"></div>
      @if (canCreate()) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New batch</button> }
    </div>
    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="5" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load batches" [message]="error()!" /></div>
      } @else if (!batches().length) {
        <vc-empty icon="package" title="No batches yet" text="Group collected bags from a campaign into a batch, then dispatch it to the lab." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Batch</th><th>Campaign</th><th>Lab</th><th class="num">Bags</th><th>Dispatched</th><th>Status</th><th></th></tr></thead>
            <tbody>
              @for (b of batches(); track b.id) {
                <tr class="clickable" (click)="openManifest(b)">
                  <td><code>{{ b.code }}</code></td>
                  <td>{{ b.campaign_code }}</td>
                  <td>{{ b.lab_name }}</td>
                  <td class="num">{{ b.bag_count }}</td>
                  <td>{{ b.dispatched_on ? (b.dispatched_on | day) : '\u2014' }}</td>
                  <td><vc-badge [status]="b.status === 'open' ? 'draft' : b.status">{{ b.status | human }}</vc-badge></td>
                  <td class="num">
                    @if (b.status === 'open' && canCreate()) {
                      <button class="btn btn-secondary btn-sm" (click)="$event.stopPropagation(); dispatchTarget.set(b); dispatchOn = today"><vc-icon name="truck" [size]="14" />Dispatch</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- create -->
    <vc-modal [(open)]="createOpen" title="New lab batch" width="640px" subtitle="Choose the campaign and lab, then the bags going into this box.">
      <div class="stack" style="--gap:14px">
        <div class="form-grid">
          <div class="field">
            <label for="b-camp">Campaign</label>
            <select id="b-camp" class="input" [ngModel]="campId()" (ngModelChange)="pickCampaign($event)">
              <option value="">Choose\u2026</option>
              @for (c of campaigns(); track c.id) { <option [value]="c.id">{{ c.code }} \xB7 {{ c.name }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="b-lab">Lab</label>
            <select id="b-lab" class="input" [(ngModel)]="labId">
              <option value="">Choose\u2026</option>
              @for (l of lab.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
            </select>
          </div>
        </div>
        @if (campId()) {
          <div>
            <div class="row lh">
              <strong>Bags</strong><span class="subtle small">{{ picked().size }} selected</span><div class="spacer"></div>
              <button class="btn btn-ghost btn-sm" (click)="pickAllFree()">Select all not yet batched</button>
            </div>
            <div class="blist">
              @if (layersLoading()) { <vc-loading [rows]="4" /> }
              @else if (!layers().length) { <p class="muted small" style="padding:14px">No bags recorded for this campaign yet.</p> }
              @else {
                @for (l of layers(); track l.layer_id) {
                  @let taken = takenBy().get(l.layer_id);
                  <label class="br" [class.dis]="!!taken">
                    <input type="checkbox" [disabled]="!!taken" [checked]="picked().has(l.layer_id)" (change)="toggle(l.layer_id)" />
                    <code>{{ l.bag_code }}</code><span class="spacer"></span>
                    @if (taken) { <span class="subtle small">in {{ taken }}</span> }
                  </label>
                }
              }
            </div>
          </div>
        }
        @if (createErr()) { <vc-callout tone="danger" icon="alert">{{ createErr() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!labId || !picked().size || busy()" (click)="create()"><vc-icon name="package" />Create batch</button>
      </ng-container>
    </vc-modal>

    <!-- dispatch -->
    <vc-modal [open]="!!dispatchTarget()" (closed)="dispatchTarget.set(null)" [title]="'Dispatch ' + (dispatchTarget()?.code ?? '') + '?'" width="460px">
      <div class="stack" style="--gap:14px">
        <p class="muted">{{ dispatchTarget()?.bag_count }} bags go to {{ dispatchTarget()?.lab_name }}. After dispatch the batch can't be changed; the lab records receipt, seal and bag count on arrival.</p>
        <div class="field"><label for="d-on">Dispatched on</label><input id="d-on" type="date" class="input" [(ngModel)]="dispatchOn" [max]="today" /></div>
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="dispatchTarget.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="dispatch()"><vc-icon name="truck" />Dispatch</button>
      </ng-container>
    </vc-modal>

    <!-- manifest -->
    <vc-modal [open]="!!manifest()" (closed)="manifest.set(null)" [drawer]="true" width="620px"
      [title]="'Manifest ' + (manifest()?.code ?? '')" [subtitle]="(manifest()?.lab_name ?? '') + ' \xB7 ' + (manifest()?.bag_count ?? 0) + ' bags'">
      @if (manifestLoading()) { <vc-loading [rows]="6" /> }
      @else if (manifest()?.manifest; as rows) {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Bag</th><th>Label</th><th class="num">Depth</th><th>Sample</th><th>Collected</th></tr></thead>
            <tbody>
              @for (m of rows; track m.layer_id) {
                <tr><td><code>{{ m.bag_code }}</code></td><td class="mono small">{{ m.label_qr }}</td>
                  <td class="num">{{ m.depth_from_cm | num: 0 }}\u2013{{ m.depth_to_cm | num: 0 }} cm</td><td>{{ m.sample_code }}</td><td>{{ m.collected_at | day }}</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;3a2817dc70d6e4ce;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\lab\\lab-batches.ts */\n.bar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n.lh {\n  margin-bottom: 8px;\n}\n.blist {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  max-height: 280px;\n  overflow: auto;\n}\n.br {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 7px 12px;\n  border-bottom: 1px solid var(--stone-100);\n  cursor: pointer;\n  font-size: 13px;\n}\n.br:last-child {\n  border-bottom: 0;\n}\n.br.dis {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.br input {\n  accent-color: var(--primary);\n  width: 16px;\n  height: 16px;\n}\n/*# sourceMappingURL=lab-batches.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LabBatches, { className: "LabBatches", filePath: "src/app/features/lab/lab-batches.ts", lineNumber: 150 });
})();

// src/app/features/lab/types.ts
var ANALYTES = [
  { key: "soc_pct", label: "Soil organic carbon", unit: "%", min: 0, max: 60, methods: ["dry_combustion", "walkley_black", "mir_spectroscopy"] },
  { key: "bulk_density_g_cm3", label: "Bulk density", unit: "g/cm3", min: 0.1, max: 2.65, methods: ["core_ring", "clod", "excavation", "mir_spectroscopy"] },
  { key: "coarse_fraction", label: "Coarse fraction", unit: "fraction", min: 0, max: 0.95, methods: ["gravimetric", "sieving", "mir_spectroscopy"] },
  { key: "ph", label: "pH", unit: "pH", min: 0, max: 14, methods: ["ph_water_1_2_5", "ph_cacl2", "mir_spectroscopy"] },
  { key: "texture_clay_pct", label: "Clay content", unit: "%", min: 0, max: 100, methods: ["hydrometer", "pipette", "laser_diffraction", "mir_spectroscopy"] }
];
var analyteLabel = (k) => ANALYTES.find((a) => a.key === k)?.label ?? k;
var MIR = "mir_spectroscopy";
var CSV_TEMPLATE = [
  "bag_code,analyte,value,unit,method,analysed_on,uncertainty",
  "ST-Z1-001-BL-D1,soc_pct,1.42,%,dry_combustion,2026-09-18,0.05",
  "ST-Z1-001-BL-D1,bulk_density_g_cm3,1.31,g/cm3,core_ring,2026-09-18,",
  "ST-Z1-001-BL-D2,soc_pct,0.98,%,dry_combustion,2026-09-18,0.04"
].join("\n");

// src/app/features/lab/lab-calibrations.ts
var _forTrack02 = ($index, $item) => $item.key;
var _forTrack12 = ($index, $item) => $item.id;
function LabCalibrations_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "div", 40);
    \u0275\u0275elementStart(2, "button", 41);
    \u0275\u0275listener("click", function LabCalibrations_Conditional_4_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openNew());
    });
    \u0275\u0275element(3, "vc-icon", 42);
    \u0275\u0275text(4, "New calibration");
    \u0275\u0275elementEnd()();
  }
}
function LabCalibrations_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 4);
  }
}
function LabCalibrations_Conditional_7_For_27_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 approved by ", c_r3.approved_by);
  }
}
function LabCalibrations_Conditional_7_For_27_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 50);
    \u0275\u0275listener("click", function LabCalibrations_Conditional_7_For_27_Conditional_28_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const c_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.target.set(c_r3);
      return \u0275\u0275resetView(ctx_r1.approveOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 51);
    \u0275\u0275text(2, "Approve");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function LabCalibrations_Conditional_7_For_27_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 52);
    \u0275\u0275listener("click", function LabCalibrations_Conditional_7_For_27_Conditional_29_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const c_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.target.set(c_r3);
      return \u0275\u0275resetView(ctx_r1.retireOpen.set(true));
    });
    \u0275\u0275text(1, "Retire");
    \u0275\u0275elementEnd();
  }
}
function LabCalibrations_Conditional_7_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 44);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 44);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 44);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 44);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 45);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td");
    \u0275\u0275element(23, "vc-badge", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td", 47);
    \u0275\u0275text(25);
    \u0275\u0275conditionalCreate(26, LabCalibrations_Conditional_7_For_27_Conditional_26_Template, 2, 1, "span", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "td", 45);
    \u0275\u0275conditionalCreate(28, LabCalibrations_Conditional_7_For_27_Conditional_28_Template, 3, 1, "button", 48);
    \u0275\u0275conditionalCreate(29, LabCalibrations_Conditional_7_For_27_Conditional_29_Template, 2, 0, "button", 49);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r3.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.label(c_r3.analyte));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 14, c_r3.reference_method));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r3.n_samples);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(13, 16, c_r3.rmse, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(16, 19, c_r3.r2, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(19, 22, c_r3.bias, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", c_r3.valid_range.min, "\u2013", c_r3.valid_range.max);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", c_r3.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r3.created_by || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r3.approved_by ? 26 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r3.status === "draft" && ctx_r1.auth.can("lab.review") ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r3.status !== "retired" && ctx_r1.auth.can("lab.review") ? 29 : -1);
  }
}
function LabCalibrations_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "table", 43)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Analyte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Reference method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 44);
    \u0275\u0275text(11, "Samples");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 44);
    \u0275\u0275text(13, "RMSE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 44);
    \u0275\u0275text(15, "R\xB2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 44);
    \u0275\u0275text(17, "Bias");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Valid range");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th");
    \u0275\u0275text(23, "Created / approved");
    \u0275\u0275elementEnd();
    \u0275\u0275element(24, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "tbody");
    \u0275\u0275repeaterCreate(26, LabCalibrations_Conditional_7_For_27_Template, 30, 25, "tr", null, _forTrack12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(26);
    \u0275\u0275repeater(ctx_r1.ctx.calibrations());
  }
}
function LabCalibrations_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r6 = ctx.$implicit;
    \u0275\u0275property("value", a_r6.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r6.label);
  }
}
function LabCalibrations_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.err());
  }
}
function LabCalibrations_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " You created this calibration, so you can't approve it. A second reviewer must check the fit statistics \u2014 the four-eyes rule. ");
  }
}
function LabCalibrations_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" Created by ", ctx_r1.target()?.created_by || "someone else", ". Four-eyes rule: the author can't approve their own calibration. Once approved, it can't be edited, only retired. ");
  }
}
var LabCalibrations = class _LabCalibrations {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(LabContext);
  analytes = ANALYTES;
  open = signal(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
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
  retireOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "retireOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  target = signal(
    null,
    ...ngDevMode ? [{ debugName: "target" }] : (
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
  err = signal(
    null,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  f = this.blank();
  canCreate = computed(
    () => this.auth.can("lab.review", "models.manage"),
    ...ngDevMode ? [{ debugName: "canCreate" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mine = computed(
    () => !!this.target()?.created_by && this.target().created_by === this.auth.profile()?.full_name,
    ...ngDevMode ? [{ debugName: "mine" }] : (
      /* istanbul ignore next */
      []
    )
  );
  blank() {
    return { code: "", analyte: "soc_pct", reference_method: "dry_combustion", n_samples: 60, rmse: 0.18, r2: 0.86, bias: 0, min: 0.2, max: 4.5, notes: "" };
  }
  label(a) {
    return analyteLabel(a);
  }
  valid() {
    const f = this.f;
    return f.code.trim().length >= 2 && f.reference_method.trim().length >= 2 && f.n_samples >= 10 && f.r2 >= 0 && f.r2 <= 1 && f.min < f.max;
  }
  openNew() {
    this.f = this.blank();
    this.err.set(null);
    this.open.set(true);
  }
  save() {
    const f = this.f;
    this.busy.set(true);
    this.err.set(null);
    this.api.post("/spectral-calibrations", {
      code: f.code.trim(),
      analyte: f.analyte,
      reference_method: f.reference_method.trim(),
      n_samples: Number(f.n_samples),
      rmse: Number(f.rmse),
      r2: Number(f.r2),
      bias: Number(f.bias),
      valid_range: { min: Number(f.min), max: Number(f.max) },
      notes: f.notes
    }).subscribe({
      next: (c) => {
        this.busy.set(false);
        this.open.set(false);
        this.toast.success(`Calibration ${c.code} saved as draft`);
        this.ctx.loadCalibrations();
      },
      error: (e) => {
        this.busy.set(false);
        this.err.set(e.message);
      }
    });
  }
  act(kind) {
    const c = this.target();
    if (!c)
      return;
    this.busy.set(true);
    this.api.post(`/spectral-calibrations/${c.id}/${kind}`).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.approveOpen.set(false);
        this.retireOpen.set(false);
        this.toast.success(`Calibration ${r.code} ${r.status}`);
        this.ctx.loadCalibrations();
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.error(e.code === "SELF_APPROVAL_REJECTED" ? "You can\u2019t approve your own calibration" : "That didn't work", e.message);
      }
    });
  }
  static \u0275fac = function LabCalibrations_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LabCalibrations)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LabCalibrations, selectors: [["vc-lab-calibrations"]], decls: 66, vars: 23, consts: [["tone", "info", "icon", "info", 2, "margin-bottom", "14px"], ["cls", "MODELLED"], [1, "bar"], [1, "card"], ["icon", "microscope", "title", "No calibrations", "text", "A calibration links infrared spectra to a reference method, fitted on at least 10 samples."], [1, "table-wrap"], ["title", "New spectral calibration", "width", "600px", "subtitle", "Saved as a draft. Someone else approves it.", 3, "openChange", "open"], [1, "form-grid"], [1, "field"], ["for", "k-code"], ["id", "k-code", "placeholder", "MIR-SOC-2026", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["for", "k-an"], ["id", "k-an", 1, "input", 3, "ngModelChange", "ngModel"], [3, "value"], ["for", "k-ref"], ["id", "k-ref", "placeholder", "dry_combustion", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "k-n"], ["id", "k-n", "type", "number", "min", "10", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "hint"], ["for", "k-rmse"], ["id", "k-rmse", "type", "number", "step", "any", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "k-r2"], ["id", "k-r2", "type", "number", "step", "any", "min", "0", "max", "1", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "k-bias"], ["id", "k-bias", "type", "number", "step", "any", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "row", 2, "--gap", "6px"], ["type", "number", "step", "any", "aria-label", "Minimum", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "subtle"], ["type", "number", "step", "any", "aria-label", "Maximum", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], ["for", "k-notes"], ["id", "k-notes", "rows", "2", 1, "input", 3, "ngModelChange", "ngModel"], ["tone", "danger", "icon", "alert", 2, "margin-top", "14px"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], ["confirmLabel", "Approve", "icon", "check", 3, "openChange", "confirmed", "open", "title", "busy"], ["icon", "users", 3, "tone"], ["tone", "danger", "confirmLabel", "Retire", "message", "New infrared results can no longer use this calibration. Results already recorded keep their link to it.", 3, "openChange", "confirmed", "open", "title", "busy"], [1, "spacer"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [1, "table"], [1, "num"], [1, "num", "nowrap"], [3, "status"], [1, "small"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-ghost", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "check", 3, "size"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"]], template: function LabCalibrations_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-callout", 0);
      \u0275\u0275text(1, " Infrared (MIR) results are predictions from a calibration, so they carry the ");
      \u0275\u0275element(2, "vc-dc", 1);
      \u0275\u0275text(3, " badge, never MEASURED. Only approved calibrations can be used, and only for values inside their valid range. ");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, LabCalibrations_Conditional_4_Template, 5, 0, "div", 2);
      \u0275\u0275elementStart(5, "section", 3);
      \u0275\u0275conditionalCreate(6, LabCalibrations_Conditional_6_Template, 1, 0, "vc-empty", 4)(7, LabCalibrations_Conditional_7_Template, 28, 0, "div", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "vc-modal", 6);
      \u0275\u0275twoWayListener("openChange", function LabCalibrations_Template_vc_modal_openChange_8_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(9, "div", 7)(10, "div", 8)(11, "label", 9);
      \u0275\u0275text(12, "Code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "input", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_input_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.code, $event) || (ctx.f.code = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 8)(15, "label", 11);
      \u0275\u0275text(16, "Analyte");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "select", 12);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_select_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.analyte, $event) || (ctx.f.analyte = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(18, LabCalibrations_For_19_Template, 2, 2, "option", 13, _forTrack02);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 8)(21, "label", 14);
      \u0275\u0275text(22, "Reference method");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "input", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_input_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.reference_method, $event) || (ctx.f.reference_method = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 8)(25, "label", 16);
      \u0275\u0275text(26, "Calibration samples");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "input", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_input_ngModelChange_27_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.n_samples, $event) || (ctx.f.n_samples = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "span", 18);
      \u0275\u0275text(29, "At least 10.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "div", 8)(31, "label", 19);
      \u0275\u0275text(32, "RMSE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "input", 20);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_input_ngModelChange_33_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.rmse, $event) || (ctx.f.rmse = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "div", 8)(35, "label", 21);
      \u0275\u0275text(36, "R\xB2");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "input", 22);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_input_ngModelChange_37_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.r2, $event) || (ctx.f.r2 = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "div", 8)(39, "label", 23);
      \u0275\u0275text(40, "Bias");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "input", 24);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_input_ngModelChange_41_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.bias, $event) || (ctx.f.bias = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(42, "div", 8)(43, "label");
      \u0275\u0275text(44, "Valid range");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "div", 25)(46, "input", 26);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_input_ngModelChange_46_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.min, $event) || (ctx.f.min = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "span", 27);
      \u0275\u0275text(48, "to");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "input", 28);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_input_ngModelChange_49_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.max, $event) || (ctx.f.max = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(50, "div", 29)(51, "label", 30);
      \u0275\u0275text(52, "Notes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "textarea", 31);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabCalibrations_Template_textarea_ngModelChange_53_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.notes, $event) || (ctx.f.notes = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(54, LabCalibrations_Conditional_54_Template, 2, 1, "vc-callout", 32);
      \u0275\u0275elementContainerStart(55, 33);
      \u0275\u0275elementStart(56, "button", 34);
      \u0275\u0275listener("click", function LabCalibrations_Template_button_click_56_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(57, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "button", 35);
      \u0275\u0275listener("click", function LabCalibrations_Template_button_click_58_listener() {
        return ctx.save();
      });
      \u0275\u0275element(59, "vc-icon", 36);
      \u0275\u0275text(60, "Save draft");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "vc-s-confirm", 37);
      \u0275\u0275twoWayListener("openChange", function LabCalibrations_Template_vc_s_confirm_openChange_61_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.approveOpen, $event) || (ctx.approveOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function LabCalibrations_Template_vc_s_confirm_confirmed_61_listener() {
        return ctx.act("approve");
      });
      \u0275\u0275elementStart(62, "vc-callout", 38);
      \u0275\u0275conditionalCreate(63, LabCalibrations_Conditional_63_Template, 1, 0)(64, LabCalibrations_Conditional_64_Template, 1, 1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(65, "vc-s-confirm", 39);
      \u0275\u0275twoWayListener("openChange", function LabCalibrations_Template_vc_s_confirm_openChange_65_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.retireOpen, $event) || (ctx.retireOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function LabCalibrations_Template_vc_s_confirm_confirmed_65_listener() {
        return ctx.act("retire");
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canCreate() ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.ctx.calibrations().length ? 6 : 7);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.code);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.analyte);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.analytes);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.reference_method);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.n_samples);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.rmse);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.r2);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.bias);
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.min);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.max);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.notes);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.err() ? 54 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.valid());
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("open", ctx.approveOpen);
      \u0275\u0275property("title", "Approve " + (ctx.target()?.code ?? "") + "?")("busy", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275property("tone", ctx.mine() ? "warn" : "info");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.mine() ? 63 : 64);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.retireOpen);
      \u0275\u0275property("title", "Retire " + (ctx.target()?.code ?? "") + "?")("busy", ctx.busy());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, Icon, Badge, Callout, DataClass, Empty, Modal, ConfirmDialog, NumPipe, HumanPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n/*# sourceMappingURL=lab-calibrations.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LabCalibrations, [{
    type: Component,
    args: [{ selector: "vc-lab-calibrations", imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Modal, ConfirmDialog, NumPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-callout tone="info" icon="info" style="margin-bottom:14px">
      Infrared (MIR) results are predictions from a calibration, so they carry the <vc-dc cls="MODELLED" /> badge, never MEASURED.
      Only approved calibrations can be used, and only for values inside their valid range.
    </vc-callout>
    @if (canCreate()) {
      <div class="bar"><div class="spacer"></div><button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New calibration</button></div>
    }
    <section class="card">
      @if (!ctx.calibrations().length) {
        <vc-empty icon="microscope" title="No calibrations" text="A calibration links infrared spectra to a reference method, fitted on at least 10 samples." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Code</th><th>Analyte</th><th>Reference method</th><th class="num">Samples</th><th class="num">RMSE</th><th class="num">R\xB2</th><th class="num">Bias</th><th>Valid range</th><th>Status</th><th>Created / approved</th><th></th></tr></thead>
            <tbody>
              @for (c of ctx.calibrations(); track c.id) {
                <tr>
                  <td><code>{{ c.code }}</code></td>
                  <td>{{ label(c.analyte) }}</td>
                  <td>{{ c.reference_method | human }}</td>
                  <td class="num">{{ c.n_samples }}</td>
                  <td class="num">{{ c.rmse | num: 3 }}</td>
                  <td class="num">{{ c.r2 | num: 3 }}</td>
                  <td class="num">{{ c.bias | num: 3 }}</td>
                  <td class="num nowrap">{{ c.valid_range.min }}\u2013{{ c.valid_range.max }}</td>
                  <td><vc-badge [status]="c.status" /></td>
                  <td class="small">{{ c.created_by || '\u2014' }}@if (c.approved_by) { <span class="subtle"> \xB7 approved by {{ c.approved_by }}</span> }</td>
                  <td class="num nowrap">
                    @if (c.status === 'draft' && auth.can('lab.review')) {
                      <button class="btn btn-secondary btn-sm" (click)="target.set(c); approveOpen.set(true)"><vc-icon name="check" [size]="14" />Approve</button>
                    }
                    @if (c.status !== 'retired' && auth.can('lab.review')) {
                      <button class="btn btn-ghost btn-sm" (click)="target.set(c); retireOpen.set(true)">Retire</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="open" title="New spectral calibration" width="600px" subtitle="Saved as a draft. Someone else approves it.">
      <div class="form-grid">
        <div class="field"><label for="k-code">Code</label><input id="k-code" class="input mono" [(ngModel)]="f.code" placeholder="MIR-SOC-2026" /></div>
        <div class="field"><label for="k-an">Analyte</label>
          <select id="k-an" class="input" [(ngModel)]="f.analyte">@for (a of analytes; track a.key) { <option [value]="a.key">{{ a.label }}</option> }</select></div>
        <div class="field"><label for="k-ref">Reference method</label><input id="k-ref" class="input" [(ngModel)]="f.reference_method" placeholder="dry_combustion" /></div>
        <div class="field"><label for="k-n">Calibration samples</label><input id="k-n" type="number" min="10" class="input num" [(ngModel)]="f.n_samples" />
          <span class="hint">At least 10.</span></div>
        <div class="field"><label for="k-rmse">RMSE</label><input id="k-rmse" type="number" step="any" min="0" class="input num" [(ngModel)]="f.rmse" /></div>
        <div class="field"><label for="k-r2">R\xB2</label><input id="k-r2" type="number" step="any" min="0" max="1" class="input num" [(ngModel)]="f.r2" /></div>
        <div class="field"><label for="k-bias">Bias</label><input id="k-bias" type="number" step="any" class="input num" [(ngModel)]="f.bias" /></div>
        <div class="field"><label>Valid range</label>
          <div class="row" style="--gap:6px"><input type="number" step="any" class="input num" [(ngModel)]="f.min" aria-label="Minimum" /><span class="subtle">to</span><input type="number" step="any" class="input num" [(ngModel)]="f.max" aria-label="Maximum" /></div></div>
        <div class="field span-2"><label for="k-notes">Notes</label><textarea id="k-notes" class="input" rows="2" [(ngModel)]="f.notes"></textarea></div>
      </div>
      @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()"><vc-icon name="check" />Save draft</button>
      </ng-container>
    </vc-modal>

    <vc-s-confirm [(open)]="approveOpen" [title]="'Approve ' + (target()?.code ?? '') + '?'" confirmLabel="Approve" icon="check" [busy]="busy()" (confirmed)="act('approve')">
      <vc-callout [tone]="mine() ? 'warn' : 'info'" icon="users">
        @if (mine()) { You created this calibration, so you can't approve it. A second reviewer must check the fit statistics \u2014 the four-eyes rule. }
        @else { Created by {{ target()?.created_by || 'someone else' }}. Four-eyes rule: the author can't approve their own calibration. Once approved, it can't be edited, only retired. }
      </vc-callout>
    </vc-s-confirm>
    <vc-s-confirm [(open)]="retireOpen" [title]="'Retire ' + (target()?.code ?? '') + '?'" tone="danger" confirmLabel="Retire"
      message="New infrared results can no longer use this calibration. Results already recorded keep their link to it." [busy]="busy()" (confirmed)="act('retire')" />
  `, styles: ["/* angular:styles/component:scss;6df3dbf747363168;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\lab\\lab-calibrations.ts */\n.bar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n/*# sourceMappingURL=lab-calibrations.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LabCalibrations, { className: "LabCalibrations", filePath: "src/app/features/lab/lab-calibrations.ts", lineNumber: 95 });
})();

// src/app/features/lab/lab-entry.ts
var _forTrack03 = ($index, $item) => $item.key;
var _forTrack13 = ($index, $item) => $item.layerId;
var _forTrack2 = ($index, $item) => $item.id;
function LabEntry_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.findError());
  }
}
function LabEntry_Conditional_17_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 43);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 18);
  }
}
function LabEntry_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 40);
    \u0275\u0275listener("click", function LabEntry_Conditional_17_For_2_Template_button_click_0_listener() {
      const m_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.bag.set(m_r3));
    });
    \u0275\u0275elementStart(1, "span", 41);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 42)(4, "code");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "em");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, LabEntry_Conditional_17_For_2_Conditional_9_Template, 1, 1, "vc-icon", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r0.bag()?.layerId === m_r3.layerId);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r3.depth);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r3.bagCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("label ", m_r3.labelQr, " \xB7 ", m_r3.campaignCode, " \xB7 collected ", \u0275\u0275pipeBind1(8, 8, m_r3.collectedAt));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.bag()?.layerId === m_r3.layerId ? 9 : -1);
  }
}
function LabEntry_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275repeaterCreate(1, LabEntry_Conditional_17_For_2_Template, 10, 10, "button", 39, _forTrack13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.matches());
  }
}
function LabEntry_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "code", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.bag().bagCode);
  }
}
function LabEntry_For_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r4 = ctx.$implicit;
    \u0275\u0275property("value", a_r4.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r4.label);
  }
}
function LabEntry_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.valueError());
  }
}
function LabEntry_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("Allowed ", ctx_r0.def().min, "\u2013", ctx_r0.def().max, " ", ctx_r0.def().unit);
  }
}
function LabEntry_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.unitError());
  }
}
function LabEntry_For_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r5 = ctx.$implicit;
    \u0275\u0275property("value", m_r5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, m_r5));
  }
}
function LabEntry_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.dateError());
  }
}
function LabEntry_Conditional_57_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r7 = ctx.$implicit;
    \u0275\u0275property("value", l_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r7.name);
  }
}
function LabEntry_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "label", 44);
    \u0275\u0275text(2, "Lab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 45);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function LabEntry_Conditional_57_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.labId.set($event));
    });
    \u0275\u0275elementStart(4, "option", 46);
    \u0275\u0275text(5, "The lab the bag was sent to");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, LabEntry_Conditional_57_For_7_Template, 2, 2, "option", 19, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r0.labId())("disabled", !ctx_r0.bag());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.ctx.labs());
  }
}
function LabEntry_Conditional_58_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r9 = ctx.$implicit;
    \u0275\u0275property("value", c_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", c_r9.code, " \xB7 valid ", c_r9.valid_range.min, "\u2013", c_r9.valid_range.max);
  }
}
function LabEntry_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32)(1, "label", 47);
    \u0275\u0275text(2, "Spectral calibration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 48);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function LabEntry_Conditional_58_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.calId.set($event));
    });
    \u0275\u0275elementStart(4, "option", 46);
    \u0275\u0275text(5, "Choose an approved calibration\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, LabEntry_Conditional_58_For_7_Template, 2, 4, "option", 19, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 8);
    \u0275\u0275text(9, "Infrared results are model estimates, recorded as ");
    \u0275\u0275element(10, "vc-dc", 49);
    \u0275\u0275text(11, " and only valid inside the calibration's range.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r0.calId());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.cals());
  }
}
function LabEntry_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.err());
  }
}
var LabEntry = class _LabEntry {
  api = inject(ApiService);
  toast = inject(ToastService);
  ctx = inject(LabContext);
  created = output();
  analytes = ANALYTES;
  mir = MIR;
  today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  code = "";
  finding = signal(
    false,
    ...ngDevMode ? [{ debugName: "finding" }] : (
      /* istanbul ignore next */
      []
    )
  );
  findError = signal(
    null,
    ...ngDevMode ? [{ debugName: "findError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  matches = signal(
    [],
    ...ngDevMode ? [{ debugName: "matches" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bag = signal(
    null,
    ...ngDevMode ? [{ debugName: "bag" }] : (
      /* istanbul ignore next */
      []
    )
  );
  analyte = signal(
    "soc_pct",
    ...ngDevMode ? [{ debugName: "analyte" }] : (
      /* istanbul ignore next */
      []
    )
  );
  value = signal(
    null,
    ...ngDevMode ? [{ debugName: "value" }] : (
      /* istanbul ignore next */
      []
    )
  );
  unit = signal(
    "%",
    ...ngDevMode ? [{ debugName: "unit" }] : (
      /* istanbul ignore next */
      []
    )
  );
  method = signal(
    "dry_combustion",
    ...ngDevMode ? [{ debugName: "method" }] : (
      /* istanbul ignore next */
      []
    )
  );
  date = signal(
    this.today,
    ...ngDevMode ? [{ debugName: "date" }] : (
      /* istanbul ignore next */
      []
    )
  );
  unc = signal(
    null,
    ...ngDevMode ? [{ debugName: "unc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  labId = signal(
    "",
    ...ngDevMode ? [{ debugName: "labId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  calId = signal(
    "",
    ...ngDevMode ? [{ debugName: "calId" }] : (
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
  err = signal(
    null,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  def = computed(
    () => ANALYTES.find((a) => a.key === this.analyte()),
    ...ngDevMode ? [{ debugName: "def" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cals = computed(
    () => this.ctx.calibrations().filter((c) => c.status === "approved" && c.analyte === this.analyte()),
    ...ngDevMode ? [{ debugName: "cals" }] : (
      /* istanbul ignore next */
      []
    )
  );
  valueError = computed(
    () => {
      const v = this.value();
      if (v === null || `${v}` === "")
        return null;
      const d = this.def();
      return v < d.min || v > d.max ? `${d.label} must be between ${d.min} and ${d.max} ${d.unit}.` : null;
    },
    ...ngDevMode ? [{ debugName: "valueError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  unitError = computed(
    () => {
      const u = this.unit().trim().toLowerCase();
      const d = this.def();
      const ok = {
        soc_pct: ["%", "pct", "percent", "% w/w"],
        bulk_density_g_cm3: ["g/cm3", "g/cm\xB3", "g cm-3", "g/cc", "mg/m3", "t/m3"],
        coarse_fraction: ["fraction", "g/g", "ratio", "0-1"],
        ph: ["ph", "", "unitless", "-"],
        texture_clay_pct: ["%", "pct", "percent"]
      };
      return ok[d.key].includes(u) ? null : `${d.label} must be reported in ${d.unit}.`;
    },
    ...ngDevMode ? [{ debugName: "unitError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  dateError = computed(
    () => {
      const d = this.date();
      if (!d)
        return "Enter the analysis date.";
      if (d > this.today)
        return "The analysis date is in the future.";
      const b = this.bag();
      if (b && d < b.collectedAt.slice(0, 10))
        return `The bag was collected on ${b.collectedAt.slice(0, 10)}; analysis can't be earlier.`;
      return null;
    },
    ...ngDevMode ? [{ debugName: "dateError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  valid = computed(
    () => !!this.bag() && this.value() !== null && `${this.value()}` !== "" && !this.valueError() && !this.unitError() && !this.dateError() && (this.method() !== MIR || !!this.calId()),
    ...ngDevMode ? [{ debugName: "valid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  setAnalyte(a) {
    this.analyte.set(a);
    const d = this.def();
    this.unit.set(d.unit);
    this.method.set(d.methods[0]);
    this.calId.set("");
  }
  lookup() {
    this.finding.set(true);
    this.findError.set(null);
    this.matches.set([]);
    this.bag.set(null);
    this.ctx.findBag(this.code).subscribe({
      next: (m) => {
        this.finding.set(false);
        this.matches.set(m);
        if (m.length === 1)
          this.bag.set(m[0]);
        if (!m.length)
          this.findError.set("No bag has this code.");
      },
      error: (e) => {
        this.finding.set(false);
        this.findError.set(e.message);
      }
    });
  }
  save() {
    const b = this.bag();
    if (!b)
      return;
    this.busy.set(true);
    this.err.set(null);
    this.api.post("/lab-results", {
      layer_id: b.layerId,
      analyte: this.analyte(),
      value: Number(this.value()),
      unit: this.unit().trim() || "-",
      method: this.method(),
      analysed_on: this.date(),
      uncertainty: this.unc() === null || `${this.unc()}` === "" ? null : Number(this.unc()),
      lab_id: this.labId() || null,
      calibration_id: this.method() === MIR ? this.calId() || null : null
    }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.toast.success(`Saved ${r.bag_code} \xB7 ${this.def().label}`, "Attach the certificate from the Results tab.");
        this.value.set(null);
        this.unc.set(null);
        this.created.emit(r);
      },
      error: (e) => {
        this.busy.set(false);
        this.err.set(e.message);
      }
    });
  }
  static \u0275fac = function LabEntry_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LabEntry)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LabEntry, selectors: [["vc-lab-entry"]], outputs: { created: "created" }, decls: 67, vars: 33, consts: [[1, "wrap"], [1, "card"], [1, "card-head"], [1, "card-body", "stack", 2, "--gap", "12px"], [1, "look", 3, "submit"], [1, "field", "grow"], ["for", "e-bag"], ["id", "e-bag", "name", "code", "placeholder", "ST-Z1-001-BL-D1", "autocomplete", "off", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "hint"], ["type", "submit", 1, "btn", "btn-secondary", 3, "disabled"], ["name", "search"], ["tone", "danger", "icon", "alert"], [1, "bags"], [1, "small"], [1, "card-body"], [1, "form-grid"], [1, "field"], ["for", "e-an"], ["id", "e-an", 1, "input", 3, "ngModelChange", "ngModel", "disabled"], [3, "value"], ["for", "e-val"], [1, "unitbox"], ["id", "e-val", "type", "number", "step", "any", 1, "input", "num", 3, "ngModelChange", "ngModel", "disabled"], ["aria-label", "Unit", 1, "input", "unit", 3, "ngModelChange", "ngModel", "disabled"], [1, "error"], ["for", "e-m"], ["id", "e-m", 1, "input", 3, "ngModelChange", "ngModel", "disabled"], ["for", "e-d"], ["id", "e-d", "type", "date", 1, "input", 3, "ngModelChange", "max", "ngModel", "disabled"], ["for", "e-u"], [1, "subtle"], ["id", "e-u", "type", "number", "step", "any", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel", "disabled"], [1, "field", "span-2"], ["tone", "danger", "icon", "alert", 2, "margin-top", "14px"], [1, "card-foot"], [1, "subtle", "small"], [1, "spacer"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], ["type", "button", 1, "bag", 3, "on"], ["type", "button", 1, "bag", 3, "click"], [1, "d"], [1, "c"], ["name", "check-circle", 3, "size"], ["for", "e-lab"], ["id", "e-lab", 1, "input", 3, "ngModelChange", "ngModel", "disabled"], ["value", ""], ["for", "e-cal"], ["id", "e-cal", 1, "input", 3, "ngModelChange", "ngModel"], ["cls", "MODELLED"]], template: function LabEntry_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "h3");
      \u0275\u0275text(4, "1 \xB7 Find the bag");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 3)(6, "form", 4);
      \u0275\u0275listener("submit", function LabEntry_Template_form_submit_6_listener($event) {
        $event.preventDefault();
        return ctx.lookup();
      });
      \u0275\u0275elementStart(7, "div", 5)(8, "label", 6);
      \u0275\u0275text(9, "Bag code or label");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "input", 7);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabEntry_Template_input_ngModelChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.code, $event) || (ctx.code = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "span", 8);
      \u0275\u0275text(12, "Scan or type the code printed on the bag. A sample code lists all its bags.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "button", 9);
      \u0275\u0275element(14, "vc-icon", 10);
      \u0275\u0275text(15);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(16, LabEntry_Conditional_16_Template, 2, 1, "vc-callout", 11);
      \u0275\u0275conditionalCreate(17, LabEntry_Conditional_17_Template, 3, 0, "div", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "section", 1)(19, "div", 2)(20, "h3");
      \u0275\u0275text(21, "2 \xB7 Enter the result");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(22, LabEntry_Conditional_22_Template, 2, 1, "code", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 14)(24, "div", 15)(25, "div", 16)(26, "label", 17);
      \u0275\u0275text(27, "Analyte");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "select", 18);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabEntry_Template_select_ngModelChange_28_listener($event) {
        return ctx.setAnalyte($event);
      });
      \u0275\u0275repeaterCreate(29, LabEntry_For_30_Template, 2, 2, "option", 19, _forTrack03);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div", 16)(32, "label", 20);
      \u0275\u0275text(33, "Value");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 21)(35, "input", 22);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabEntry_Template_input_ngModelChange_35_listener($event) {
        return ctx.value.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "input", 23);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabEntry_Template_input_ngModelChange_36_listener($event) {
        return ctx.unit.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(37, LabEntry_Conditional_37_Template, 2, 1, "span", 24)(38, LabEntry_Conditional_38_Template, 2, 3, "span", 8);
      \u0275\u0275conditionalCreate(39, LabEntry_Conditional_39_Template, 2, 1, "span", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div", 16)(41, "label", 25);
      \u0275\u0275text(42, "Method");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "select", 26);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabEntry_Template_select_ngModelChange_43_listener($event) {
        return ctx.method.set($event);
      });
      \u0275\u0275repeaterCreate(44, LabEntry_For_45_Template, 3, 4, "option", 19, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "div", 16)(47, "label", 27);
      \u0275\u0275text(48, "Analysed on");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "input", 28);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabEntry_Template_input_ngModelChange_49_listener($event) {
        return ctx.date.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(50, LabEntry_Conditional_50_Template, 2, 1, "span", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "div", 16)(52, "label", 29);
      \u0275\u0275text(53, "Uncertainty ");
      \u0275\u0275elementStart(54, "span", 30);
      \u0275\u0275text(55, "(optional, \xB1)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(56, "input", 31);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabEntry_Template_input_ngModelChange_56_listener($event) {
        return ctx.unc.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(57, LabEntry_Conditional_57_Template, 8, 2, "div", 16);
      \u0275\u0275conditionalCreate(58, LabEntry_Conditional_58_Template, 12, 1, "div", 32);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(59, LabEntry_Conditional_59_Template, 2, 1, "vc-callout", 33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "div", 34)(61, "span", 35);
      \u0275\u0275text(62, "Saved as pending. A lab manager accepts it once the certificate is attached.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(63, "div", 36);
      \u0275\u0275elementStart(64, "button", 37);
      \u0275\u0275listener("click", function LabEntry_Template_button_click_64_listener() {
        return ctx.save();
      });
      \u0275\u0275element(65, "vc-icon", 38);
      \u0275\u0275text(66);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.code);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", !ctx.code.trim() || ctx.finding());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.finding() ? "Looking\u2026" : "Look up");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.findError() ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.matches().length ? 17 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("dim", !ctx.bag());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.bag() ? 22 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.analyte())("disabled", !ctx.bag());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.analytes);
      \u0275\u0275advance(6);
      \u0275\u0275classProp("invalid", !!ctx.valueError());
      \u0275\u0275property("ngModel", ctx.value())("disabled", !ctx.bag());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.unit())("disabled", !ctx.bag());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.valueError() ? 37 : 38);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.unitError() ? 39 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.method())("disabled", !ctx.bag());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.def().methods);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("invalid", !!ctx.dateError());
      \u0275\u0275property("max", ctx.today)("ngModel", ctx.date())("disabled", !ctx.bag());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.dateError() ? 50 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.unc())("disabled", !ctx.bag());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.ctx.scopedLabId() ? 57 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.method() === ctx.mir ? 58 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.err() ? 59 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275property("disabled", !ctx.valid() || ctx.busy());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.busy() ? "Saving\u2026" : "Save result");
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, NgModel, NgForm, Icon, Callout, DataClass, DayPipe, HumanPipe], styles: ["\n.wrap[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);\n  gap: 16px;\n  align-items: start;\n}\n.look[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.look[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  margin-top: 24px;\n  height: 38px;\n}\n.grow[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.bags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.bag[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 10px 12px;\n  border: 1.5px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface);\n  text-align: left;\n  font: inherit;\n  cursor: pointer;\n}\n.bag[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%forest-300);\n}\n.bag.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n}\n.bag[_ngcontent-%COMP%]   .d[_ngcontent-%COMP%] {\n  font-weight: 600;\n  min-width: 72px;\n}\n.bag[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n.bag[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.bag[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n}\n.dim[_ngcontent-%COMP%] {\n  opacity: 0.6;\n}\n.unitbox[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n}\n.unit[_ngcontent-%COMP%] {\n  width: 96px;\n  flex: none;\n}\n@media (max-width: 1100px) {\n  .wrap[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=lab-entry.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LabEntry, [{
    type: Component,
    args: [{ selector: "vc-lab-entry", imports: [FormsModule, Icon, Callout, DataClass, DayPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="wrap">
      <section class="card">
        <div class="card-head"><h3>1 \xB7 Find the bag</h3></div>
        <div class="card-body stack" style="--gap:12px">
          <form class="look" (submit)="$event.preventDefault(); lookup()">
            <div class="field grow">
              <label for="e-bag">Bag code or label</label>
              <input id="e-bag" class="input mono" [(ngModel)]="code" name="code" placeholder="ST-Z1-001-BL-D1" autocomplete="off" />
              <span class="hint">Scan or type the code printed on the bag. A sample code lists all its bags.</span>
            </div>
            <button class="btn btn-secondary" type="submit" [disabled]="!code.trim() || finding()"><vc-icon name="search" />{{ finding() ? 'Looking\u2026' : 'Look up' }}</button>
          </form>
          @if (findError()) { <vc-callout tone="danger" icon="alert">{{ findError() }}</vc-callout> }
          @if (matches().length) {
            <div class="bags">
              @for (m of matches(); track m.layerId) {
                <button type="button" class="bag" [class.on]="bag()?.layerId === m.layerId" (click)="bag.set(m)">
                  <span class="d">{{ m.depth }}</span>
                  <span class="c"><code>{{ m.bagCode }}</code><em>label {{ m.labelQr }} \xB7 {{ m.campaignCode }} \xB7 collected {{ m.collectedAt | day }}</em></span>
                  @if (bag()?.layerId === m.layerId) { <vc-icon name="check-circle" [size]="18" /> }
                </button>
              }
            </div>
          }
        </div>
      </section>

      <section class="card" [class.dim]="!bag()">
        <div class="card-head"><h3>2 \xB7 Enter the result</h3>@if (bag()) { <code class="small">{{ bag()!.bagCode }}</code> }</div>
        <div class="card-body">
          <div class="form-grid">
            <div class="field">
              <label for="e-an">Analyte</label>
              <select id="e-an" class="input" [ngModel]="analyte()" (ngModelChange)="setAnalyte($event)" [disabled]="!bag()">
                @for (a of analytes; track a.key) { <option [value]="a.key">{{ a.label }}</option> }
              </select>
            </div>
            <div class="field">
              <label for="e-val">Value</label>
              <div class="unitbox">
                <input id="e-val" type="number" step="any" class="input num" [class.invalid]="!!valueError()" [ngModel]="value()" (ngModelChange)="value.set($event)" [disabled]="!bag()" />
                <input class="input unit" [ngModel]="unit()" (ngModelChange)="unit.set($event)" aria-label="Unit" [disabled]="!bag()" />
              </div>
              @if (valueError()) { <span class="error">{{ valueError() }}</span> } @else { <span class="hint">Allowed {{ def().min }}\u2013{{ def().max }} {{ def().unit }}</span> }
              @if (unitError()) { <span class="error">{{ unitError() }}</span> }
            </div>
            <div class="field">
              <label for="e-m">Method</label>
              <select id="e-m" class="input" [ngModel]="method()" (ngModelChange)="method.set($event)" [disabled]="!bag()">
                @for (m of def().methods; track m) { <option [value]="m">{{ m | human }}</option> }
              </select>
            </div>
            <div class="field">
              <label for="e-d">Analysed on</label>
              <input id="e-d" type="date" class="input" [class.invalid]="!!dateError()" [max]="today" [ngModel]="date()" (ngModelChange)="date.set($event)" [disabled]="!bag()" />
              @if (dateError()) { <span class="error">{{ dateError() }}</span> }
            </div>
            <div class="field">
              <label for="e-u">Uncertainty <span class="subtle">(optional, \xB1)</span></label>
              <input id="e-u" type="number" step="any" min="0" class="input num" [ngModel]="unc()" (ngModelChange)="unc.set($event)" [disabled]="!bag()" />
            </div>
            @if (!ctx.scopedLabId()) {
              <div class="field">
                <label for="e-lab">Lab</label>
                <select id="e-lab" class="input" [ngModel]="labId()" (ngModelChange)="labId.set($event)" [disabled]="!bag()">
                  <option value="">The lab the bag was sent to</option>
                  @for (l of ctx.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
                </select>
              </div>
            }
            @if (method() === mir) {
              <div class="field span-2">
                <label for="e-cal">Spectral calibration</label>
                <select id="e-cal" class="input" [ngModel]="calId()" (ngModelChange)="calId.set($event)">
                  <option value="">Choose an approved calibration\u2026</option>
                  @for (c of cals(); track c.id) { <option [value]="c.id">{{ c.code }} \xB7 valid {{ c.valid_range.min }}\u2013{{ c.valid_range.max }}</option> }
                </select>
                <span class="hint">Infrared results are model estimates, recorded as <vc-dc cls="MODELLED" /> and only valid inside the calibration's range.</span>
              </div>
            }
          </div>
          @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
        </div>
        <div class="card-foot">
          <span class="subtle small">Saved as pending. A lab manager accepts it once the certificate is attached.</span>
          <div class="spacer"></div>
          <button class="btn btn-primary" [disabled]="!valid() || busy()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Saving\u2026' : 'Save result' }}</button>
        </div>
      </section>
    </div>
  `, styles: ["/* angular:styles/component:scss;434796b4d97ee55e;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\lab\\lab-entry.ts */\n.wrap {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);\n  gap: 16px;\n  align-items: start;\n}\n.look {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.look .btn {\n  margin-top: 24px;\n  height: 38px;\n}\n.grow {\n  flex: 1;\n}\n.bags {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.bag {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 10px 12px;\n  border: 1.5px solid var(--border);\n  border-radius: var(--radius-sm);\n  background: var(--surface);\n  text-align: left;\n  font: inherit;\n  cursor: pointer;\n}\n.bag:hover {\n  border-color: var(--forest-300);\n}\n.bag.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n}\n.bag .d {\n  font-weight: 600;\n  min-width: 72px;\n}\n.bag .c {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n.bag em {\n  font-style: normal;\n  font-size: 12px;\n  color: var(--text-3);\n}\n.bag vc-icon {\n  color: var(--forest-600);\n}\n.dim {\n  opacity: 0.6;\n}\n.unitbox {\n  display: flex;\n  gap: 6px;\n}\n.unit {\n  width: 96px;\n  flex: none;\n}\n@media (max-width: 1100px) {\n  .wrap {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=lab-entry.css.map */\n"] }]
  }], null, { created: [{ type: Output, args: ["created"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LabEntry, { className: "LabEntry", filePath: "src/app/features/lab/lab-entry.ts", lineNumber: 127 });
})();

// src/app/features/lab/lab-import.ts
var _forTrack04 = ($index, $item) => $item.id;
var _forTrack14 = ($index, $item) => $item.row;
function LabImport_Conditional_8_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r3 = ctx.$implicit;
    \u0275\u0275property("value", l_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r3.name);
  }
}
function LabImport_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "label", 18);
    \u0275\u0275text(2, "Lab that produced these results");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 19);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function LabImport_Conditional_8_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.labId, $event) || (ctx_r1.labId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(4, "option", 20);
    \u0275\u0275text(5, "The lab each bag was sent to");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, LabImport_Conditional_8_For_7_Template, 2, 2, "option", 21, _forTrack04);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.labId);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.ctx.labs());
  }
}
function LabImport_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function LabImport_Conditional_14_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.file.set(null));
    });
    \u0275\u0275text(1, "Clear");
    \u0275\u0275elementEnd();
  }
}
function LabImport_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.err());
  }
}
function LabImport_Conditional_77_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-badge", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rep_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", rep_r6.errors, " with problems");
  }
}
function LabImport_Conditional_77_For_30_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "code", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.code);
  }
}
function LabImport_Conditional_77_For_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "code");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "vc-badge", 32);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275conditionalCreate(13, LabImport_Conditional_77_For_30_Conditional_13_Template, 2, 1, "code", 33);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bad", r_r7.status === "error");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r7.row);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r7.bag_code || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.label(r_r7.analyte));
    \u0275\u0275advance(2);
    \u0275\u0275property("status", r_r7.status === "created" ? "accepted" : "error");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.status === "created" ? "Created" : "Not saved");
    \u0275\u0275advance();
    \u0275\u0275classProp("muted", r_r7.status === "created");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", r_r7.message, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r7.code ? 13 : -1);
  }
}
function LabImport_Conditional_77_ForEmpty_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 34);
    \u0275\u0275text(2, "No rows with problems.");
    \u0275\u0275elementEnd()();
  }
}
function LabImport_Conditional_77_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 17)(1, "div", 2)(2, "h3");
    \u0275\u0275text(3, "Import report");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "vc-badge", 23);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, LabImport_Conditional_77_Conditional_6_Template, 2, 1, "vc-badge", 24);
    \u0275\u0275element(7, "vc-hash", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 25)(9, "div", 26)(10, "button", 27);
    \u0275\u0275listener("click", function LabImport_Conditional_77_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.show.set("all"));
    });
    \u0275\u0275text(11, "All rows");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 27);
    \u0275\u0275listener("click", function LabImport_Conditional_77_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.show.set("error"));
    });
    \u0275\u0275text(13, "Problems only");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 28)(15, "table", 29)(16, "thead")(17, "tr")(18, "th", 30);
    \u0275\u0275text(19, "Row");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Bag");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th");
    \u0275\u0275text(23, "Analyte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "th");
    \u0275\u0275text(25, "Outcome");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "th");
    \u0275\u0275text(27, "Message");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "tbody");
    \u0275\u0275repeaterCreate(29, LabImport_Conditional_77_For_30_Template, 14, 11, "tr", 31, _forTrack14, false, LabImport_Conditional_77_ForEmpty_31_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const rep_r6 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", rep_r6.created, " created");
    \u0275\u0275advance();
    \u0275\u0275conditional(rep_r6.errors ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("value", rep_r6.sha256);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("on", ctx_r1.show() === "all");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r1.show() === "error");
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r1.rows());
  }
}
var LabImport = class _LabImport {
  api = inject(ApiService);
  toast = inject(ToastService);
  ctx = inject(LabContext);
  template = CSV_TEMPLATE;
  file = signal(
    null,
    ...ngDevMode ? [{ debugName: "file" }] : (
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
  err = signal(
    null,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  report = signal(
    null,
    ...ngDevMode ? [{ debugName: "report" }] : (
      /* istanbul ignore next */
      []
    )
  );
  show = signal(
    "all",
    ...ngDevMode ? [{ debugName: "show" }] : (
      /* istanbul ignore next */
      []
    )
  );
  labId = "";
  rows = computed(
    () => (this.report()?.rows ?? []).filter((r) => this.show() === "all" || r.status === "error"),
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  label(a) {
    return a ? analyteLabel(a) : "\u2014";
  }
  download() {
    const u = URL.createObjectURL(new Blob([CSV_TEMPLATE + "\n"], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = u;
    a.download = "lab-results-template.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 5e3);
  }
  upload() {
    const f = this.file();
    if (!f)
      return;
    const form = new FormData();
    form.append("file", new File([f], f.name, { type: "text/csv" }));
    if (this.labId)
      form.append("lab_id", this.labId);
    this.busy.set(true);
    this.err.set(null);
    this.api.upload("/lab-results/import", form).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.report.set(r);
        this.show.set(r.errors ? "error" : "all");
        this.file.set(null);
        r.errors ? this.toast.info(`${r.created} created, ${r.errors} rows need attention`) : this.toast.success(`${r.created} results imported`);
      },
      error: (e) => {
        this.busy.set(false);
        const missing = e.details?.["missing"]?.join(", ");
        this.err.set(missing ? `${e.message} Missing: ${missing}.` : e.message);
      }
    });
  }
  static \u0275fac = function LabImport_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LabImport)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LabImport, selectors: [["vc-lab-import"]], decls: 78, vars: 9, consts: [[1, "wrap"], [1, "card"], [1, "card-head"], [1, "card-body", "stack", 2, "--gap", "16px"], [1, "muted"], [1, "field"], ["accept", ".csv,text/csv", "label", "Choose a CSV file or drop it here", "hint", "UTF-8 CSV with the columns shown \xB7 up to 25 MB", 3, "fileChange", "file"], [1, "row"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "upload"], [1, "btn", "btn-ghost"], ["tone", "danger", "icon", "alert"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "download", 3, "size"], [1, "card-body", "stack", 2, "--gap", "12px"], [1, "tpl"], [1, "kv", "small"], [1, "card", 2, "margin-top", "16px"], ["for", "i-lab"], ["id", "i-lab", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "btn", "btn-ghost", 3, "click"], ["status", "accepted"], ["status", "rejected"], [1, "card-head", "sub"], [1, "seg"], [3, "click"], [1, "table-wrap"], [1, "table"], [1, "num"], [3, "bad"], [3, "status"], [1, "subtle", "small"], ["colspan", "5", 1, "muted"]], template: function LabImport_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "h3");
      \u0275\u0275text(4, "Upload a results file");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 3)(6, "p", 4);
      \u0275\u0275text(7, "Each row is checked on its own: good rows are saved as pending results, rows with a problem are listed with the reason and nothing is saved for them. The file itself is kept as evidence.");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(8, LabImport_Conditional_8_Template, 8, 1, "div", 5);
      \u0275\u0275elementStart(9, "vc-file-drop", 6);
      \u0275\u0275twoWayListener("fileChange", function LabImport_Template_vc_file_drop_fileChange_9_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.file, $event) || (ctx.file = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 7)(11, "button", 8);
      \u0275\u0275listener("click", function LabImport_Template_button_click_11_listener() {
        return ctx.upload();
      });
      \u0275\u0275element(12, "vc-icon", 9);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(14, LabImport_Conditional_14_Template, 2, 0, "button", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(15, LabImport_Conditional_15_Template, 2, 1, "vc-callout", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "section", 1)(17, "div", 2)(18, "h3");
      \u0275\u0275text(19, "File format");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "button", 12);
      \u0275\u0275listener("click", function LabImport_Template_button_click_20_listener() {
        return ctx.download();
      });
      \u0275\u0275element(21, "vc-icon", 13);
      \u0275\u0275text(22, "Download template");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 14)(24, "pre", 15);
      \u0275\u0275text(25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "dl", 16)(27, "dt")(28, "code");
      \u0275\u0275text(29, "bag_code");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "dd");
      \u0275\u0275text(31, "The code or label printed on the bag.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "dt")(33, "code");
      \u0275\u0275text(34, "analyte");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "dd")(36, "code");
      \u0275\u0275text(37, "soc_pct");
      \u0275\u0275elementEnd();
      \u0275\u0275text(38, ", ");
      \u0275\u0275elementStart(39, "code");
      \u0275\u0275text(40, "bulk_density_g_cm3");
      \u0275\u0275elementEnd();
      \u0275\u0275text(41, ", ");
      \u0275\u0275elementStart(42, "code");
      \u0275\u0275text(43, "coarse_fraction");
      \u0275\u0275elementEnd();
      \u0275\u0275text(44, ", ");
      \u0275\u0275elementStart(45, "code");
      \u0275\u0275text(46, "ph");
      \u0275\u0275elementEnd();
      \u0275\u0275text(47, " or ");
      \u0275\u0275elementStart(48, "code");
      \u0275\u0275text(49, "texture_clay_pct");
      \u0275\u0275elementEnd();
      \u0275\u0275text(50, ".");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "dt")(52, "code");
      \u0275\u0275text(53, "unit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(54, "dd")(55, "code");
      \u0275\u0275text(56, "%");
      \u0275\u0275elementEnd();
      \u0275\u0275text(57, ", ");
      \u0275\u0275elementStart(58, "code");
      \u0275\u0275text(59, "g/cm3");
      \u0275\u0275elementEnd();
      \u0275\u0275text(60, ", ");
      \u0275\u0275elementStart(61, "code");
      \u0275\u0275text(62, "fraction");
      \u0275\u0275elementEnd();
      \u0275\u0275text(63, " or ");
      \u0275\u0275elementStart(64, "code");
      \u0275\u0275text(65, "pH");
      \u0275\u0275elementEnd();
      \u0275\u0275text(66, ", matching the analyte.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "dt")(68, "code");
      \u0275\u0275text(69, "analysed_on");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(70, "dd");
      \u0275\u0275text(71, "Date as YYYY-MM-DD. Not before collection, not in the future.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "dt")(73, "code");
      \u0275\u0275text(74, "uncertainty");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(75, "dd");
      \u0275\u0275text(76, "Optional, same unit as the value.");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275conditionalCreate(77, LabImport_Conditional_77_Template, 32, 8, "section", 17);
    }
    if (rf & 2) {
      let tmp_8_0;
      \u0275\u0275advance(8);
      \u0275\u0275conditional(!ctx.ctx.scopedLabId() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("file", ctx.file);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", !ctx.file() || ctx.busy());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.busy() ? "Importing\u2026" : "Import results");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.file() ? 14 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.err() ? 15 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.template);
      \u0275\u0275advance(52);
      \u0275\u0275conditional((tmp_8_0 = ctx.report()) ? 77 : -1, tmp_8_0);
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, Icon, Badge, Callout, FileDrop, Hash], styles: ["\n.wrap[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  gap: 16px;\n  align-items: start;\n}\n.tpl[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 12px 14px;\n  background: var(--%NS%forest-950);\n  color: #d7e6dc;\n  border-radius: var(--%NS%radius-sm);\n  font: 12px/1.6 var(--%NS%mono);\n  overflow-x: auto;\n}\n.kv.small[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  grid-template-columns: 120px 1fr;\n}\n.sub[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--%NS%surface-2);\n}\n.seg[_ngcontent-%COMP%] {\n  display: flex;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: var(--%NS%radius-sm);\n  padding: 3px;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 12.5px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  padding: 0 10px;\n  height: 26px;\n  border-radius: 5px;\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  color: #fff;\n}\ntr.bad[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n}\n@media (max-width: 1100px) {\n  .wrap[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=lab-import.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LabImport, [{
    type: Component,
    args: [{ selector: "vc-lab-import", imports: [FormsModule, Icon, Badge, Callout, FileDrop, Hash], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="wrap">
      <section class="card">
        <div class="card-head"><h3>Upload a results file</h3></div>
        <div class="card-body stack" style="--gap:16px">
          <p class="muted">Each row is checked on its own: good rows are saved as pending results, rows with a problem are listed with the reason and nothing is saved for them. The file itself is kept as evidence.</p>
          @if (!ctx.scopedLabId()) {
            <div class="field">
              <label for="i-lab">Lab that produced these results</label>
              <select id="i-lab" class="input" [(ngModel)]="labId">
                <option value="">The lab each bag was sent to</option>
                @for (l of ctx.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
              </select>
            </div>
          }
          <vc-file-drop accept=".csv,text/csv" [(file)]="file" label="Choose a CSV file or drop it here" hint="UTF-8 CSV with the columns shown \xB7 up to 25 MB" />
          <div class="row">
            <button class="btn btn-primary" [disabled]="!file() || busy()" (click)="upload()"><vc-icon name="upload" />{{ busy() ? 'Importing\u2026' : 'Import results' }}</button>
            @if (file()) { <button class="btn btn-ghost" (click)="file.set(null)">Clear</button> }
          </div>
          @if (err()) { <vc-callout tone="danger" icon="alert">{{ err() }}</vc-callout> }
        </div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>File format</h3>
          <button class="btn btn-secondary btn-sm" (click)="download()"><vc-icon name="download" [size]="14" />Download template</button>
        </div>
        <div class="card-body stack" style="--gap:12px">
          <pre class="tpl">{{ template }}</pre>
          <dl class="kv small">
            <dt><code>bag_code</code></dt><dd>The code or label printed on the bag.</dd>
            <dt><code>analyte</code></dt><dd><code>soc_pct</code>, <code>bulk_density_g_cm3</code>, <code>coarse_fraction</code>, <code>ph</code> or <code>texture_clay_pct</code>.</dd>
            <dt><code>unit</code></dt><dd><code>%</code>, <code>g/cm3</code>, <code>fraction</code> or <code>pH</code>, matching the analyte.</dd>
            <dt><code>analysed_on</code></dt><dd>Date as YYYY-MM-DD. Not before collection, not in the future.</dd>
            <dt><code>uncertainty</code></dt><dd>Optional, same unit as the value.</dd>
          </dl>
        </div>
      </section>
    </div>

    @if (report(); as rep) {
      <section class="card" style="margin-top:16px">
        <div class="card-head">
          <h3>Import report</h3>
          <vc-badge status="accepted">{{ rep.created }} created</vc-badge>
          @if (rep.errors) { <vc-badge status="rejected">{{ rep.errors }} with problems</vc-badge> }
          <vc-hash [value]="rep.sha256" />
        </div>
        <div class="card-head sub">
          <div class="seg">
            <button [class.on]="show() === 'all'" (click)="show.set('all')">All rows</button>
            <button [class.on]="show() === 'error'" (click)="show.set('error')">Problems only</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th class="num">Row</th><th>Bag</th><th>Analyte</th><th>Outcome</th><th>Message</th></tr></thead>
            <tbody>
              @for (r of rows(); track r.row) {
                <tr [class.bad]="r.status === 'error'">
                  <td class="num">{{ r.row }}</td>
                  <td><code>{{ r.bag_code || '\u2014' }}</code></td>
                  <td>{{ label(r.analyte) }}</td>
                  <td><vc-badge [status]="r.status === 'created' ? 'accepted' : 'error'">{{ r.status === 'created' ? 'Created' : 'Not saved' }}</vc-badge></td>
                  <td [class.muted]="r.status === 'created'">{{ r.message }} @if (r.code) { <code class="subtle small">{{ r.code }}</code> }</td>
                </tr>
              } @empty {
                <tr><td colspan="5" class="muted">No rows with problems.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    }
  `, styles: ["/* angular:styles/component:scss;45150c5f5dbeef1c;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\lab\\lab-import.ts */\n.wrap {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  gap: 16px;\n  align-items: start;\n}\n.tpl {\n  margin: 0;\n  padding: 12px 14px;\n  background: var(--forest-950);\n  color: #d7e6dc;\n  border-radius: var(--radius-sm);\n  font: 12px/1.6 var(--mono);\n  overflow-x: auto;\n}\n.kv.small {\n  font-size: 12.5px;\n  grid-template-columns: 120px 1fr;\n}\n.sub {\n  padding: 10px 20px;\n  background: var(--surface-2);\n}\n.seg {\n  display: flex;\n  background: var(--surface);\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius-sm);\n  padding: 3px;\n  gap: 2px;\n}\n.seg button {\n  border: 0;\n  background: none;\n  font: 500 12.5px var(--font);\n  color: var(--stone-600);\n  padding: 0 10px;\n  height: 26px;\n  border-radius: 5px;\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--forest-600);\n  color: #fff;\n}\ntr.bad td {\n  background: var(--danger-soft);\n}\n@media (max-width: 1100px) {\n  .wrap {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=lab-import.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LabImport, { className: "LabImport", filePath: "src/app/features/lab/lab-import.ts", lineNumber: 104 });
})();

// src/app/features/lab/lab-labs.ts
var _forTrack05 = ($index, $item) => $item.id;
function LabLabs_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function LabLabs_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openNew());
    });
    \u0275\u0275element(1, "vc-icon", 30);
    \u0275\u0275text(2, "Add lab");
    \u0275\u0275elementEnd();
  }
}
function LabLabs_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function LabLabs_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "vc-error", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.ctx.labsError());
  }
}
function LabLabs_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 7);
  }
}
function LabLabs_Conditional_9_For_18_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-badge", 33);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("status", l_r3.accreditation_current ? "active" : "failed");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, l_r3.accreditation_valid_until));
  }
}
function LabLabs_Conditional_9_For_18_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function LabLabs_Conditional_9_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275conditionalCreate(12, LabLabs_Conditional_9_For_18_Conditional_12_Template, 3, 4, "vc-badge", 33)(13, LabLabs_Conditional_9_For_18_Conditional_13_Template, 2, 0, "span", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 35);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const l_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(l_r3.code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(l_r3.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(l_r3.city || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(l_r3.accreditation || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(l_r3.accreditation_valid_until ? 12 : 13);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(l_r3.contact_email || "\u2014");
  }
}
function LabLabs_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "table", 32)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "City");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Accreditation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Valid until");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Contact");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody");
    \u0275\u0275repeaterCreate(17, LabLabs_Conditional_9_For_18_Template, 16, 6, "tr", null, _forTrack05);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r1.ctx.labs());
  }
}
function LabLabs_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.err());
  }
}
var LabLabs = class _LabLabs {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(LabContext);
  open = signal(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
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
  err = signal(
    null,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  f = this.blank();
  canManage = computed(
    () => this.auth.can("sampling.plan", "programmes.manage"),
    ...ngDevMode ? [{ debugName: "canManage" }] : (
      /* istanbul ignore next */
      []
    )
  );
  blank() {
    return { code: "", name: "", city: "", contact_email: "", accreditation: "", accreditation_valid_until: "" };
  }
  openNew() {
    this.f = this.blank();
    this.err.set(null);
    this.open.set(true);
  }
  save() {
    this.busy.set(true);
    this.err.set(null);
    const f = this.f;
    this.api.post("/labs", {
      code: f.code.trim(),
      name: f.name.trim(),
      city: f.city.trim(),
      contact_email: f.contact_email.trim() || null,
      accreditation: f.accreditation.trim() || null,
      accreditation_valid_until: f.accreditation_valid_until || null
    }).subscribe({
      next: (l) => {
        this.busy.set(false);
        this.open.set(false);
        this.toast.success(`${l.name} added`);
        this.ctx.loadLabs();
      },
      error: (e) => {
        this.busy.set(false);
        this.err.set(e.message);
      }
    });
  }
  static \u0275fac = function LabLabs_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LabLabs)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LabLabs, selectors: [["vc-lab-labs"]], decls: 43, vars: 11, consts: [[1, "bar"], [1, "muted", "small"], [1, "spacer"], [1, "btn", "btn-primary"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "flask", "title", "No labs yet", "text", "Add the laboratory that will receive your soil bags."], [1, "table-wrap"], ["title", "Add a lab", "width", "560px", 3, "openChange", "open"], [1, "form-grid"], [1, "field"], ["for", "l-code"], ["id", "l-code", "placeholder", "SOILTEST-BLR", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["for", "l-name"], ["id", "l-name", "placeholder", "Soil Test Laboratory, Bengaluru", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "l-city"], ["id", "l-city", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "l-mail"], ["id", "l-mail", "type", "email", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "l-acc"], ["id", "l-acc", "placeholder", "NABL TC-1234", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "l-until"], ["id", "l-until", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], ["tone", "danger", "icon", "alert", 2, "margin-top", "14px"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["title", "Couldn't load labs", 3, "message"], [1, "table"], [3, "status"], [1, "subtle"], [1, "muted"]], template: function LabLabs_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "p", 1);
      \u0275\u0275text(2, "Laboratories that analyse this organisation's soil. Accreditation is shown with its expiry.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "div", 2);
      \u0275\u0275conditionalCreate(4, LabLabs_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "section", 4);
      \u0275\u0275conditionalCreate(6, LabLabs_Conditional_6_Template, 1, 1, "vc-loading", 5)(7, LabLabs_Conditional_7_Template, 2, 1, "div", 6)(8, LabLabs_Conditional_8_Template, 1, 0, "vc-empty", 7)(9, LabLabs_Conditional_9_Template, 19, 0, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "vc-modal", 9);
      \u0275\u0275twoWayListener("openChange", function LabLabs_Template_vc_modal_openChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(11, "div", 10)(12, "div", 11)(13, "label", 12);
      \u0275\u0275text(14, "Code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "input", 13);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabLabs_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.code, $event) || (ctx.f.code = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 11)(17, "label", 14);
      \u0275\u0275text(18, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "input", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabLabs_Template_input_ngModelChange_19_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.name, $event) || (ctx.f.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 11)(21, "label", 16);
      \u0275\u0275text(22, "City");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "input", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabLabs_Template_input_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.city, $event) || (ctx.f.city = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 11)(25, "label", 18);
      \u0275\u0275text(26, "Contact email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "input", 19);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabLabs_Template_input_ngModelChange_27_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.contact_email, $event) || (ctx.f.contact_email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div", 11)(29, "label", 20);
      \u0275\u0275text(30, "Accreditation");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "input", 21);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabLabs_Template_input_ngModelChange_31_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.accreditation, $event) || (ctx.f.accreditation = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 11)(33, "label", 22);
      \u0275\u0275text(34, "Valid until");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "input", 23);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function LabLabs_Template_input_ngModelChange_35_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.accreditation_valid_until, $event) || (ctx.f.accreditation_valid_until = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(36, LabLabs_Conditional_36_Template, 2, 1, "vc-callout", 24);
      \u0275\u0275elementContainerStart(37, 25);
      \u0275\u0275elementStart(38, "button", 26);
      \u0275\u0275listener("click", function LabLabs_Template_button_click_38_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(39, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "button", 27);
      \u0275\u0275listener("click", function LabLabs_Template_button_click_40_listener() {
        return ctx.save();
      });
      \u0275\u0275element(41, "vc-icon", 28);
      \u0275\u0275text(42, "Add lab");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canManage() ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.ctx.labsLoaded() ? 6 : ctx.ctx.labsError() ? 7 : !ctx.ctx.labs().length ? 8 : 9);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.code);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.name);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.city);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.contact_email);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.accreditation);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.accreditation_valid_until);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.err() ? 36 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || ctx.f.code.length < 2 || ctx.f.name.length < 2);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, Icon, Badge, Callout, Empty, ErrorBox, Loading, Modal, DayPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n/*# sourceMappingURL=lab-labs.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LabLabs, [{
    type: Component,
    args: [{ selector: "vc-lab-labs", imports: [FormsModule, Icon, Badge, Callout, Empty, ErrorBox, Loading, Modal, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <p class="muted small">Laboratories that analyse this organisation's soil. Accreditation is shown with its expiry.</p>
      <div class="spacer"></div>
      @if (canManage()) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />Add lab</button> }
    </div>
    <section class="card">
      @if (!ctx.labsLoaded()) {
        <vc-loading [rows]="4" />
      } @else if (ctx.labsError()) {
        <div class="card-body"><vc-error title="Couldn't load labs" [message]="ctx.labsError()!" /></div>
      } @else if (!ctx.labs().length) {
        <vc-empty icon="flask" title="No labs yet" text="Add the laboratory that will receive your soil bags." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Code</th><th>Name</th><th>City</th><th>Accreditation</th><th>Valid until</th><th>Contact</th></tr></thead>
            <tbody>
              @for (l of ctx.labs(); track l.id) {
                <tr>
                  <td><code>{{ l.code }}</code></td>
                  <td><strong>{{ l.name }}</strong></td>
                  <td>{{ l.city || '\u2014' }}</td>
                  <td>{{ l.accreditation || '\u2014' }}</td>
                  <td>
                    @if (l.accreditation_valid_until) {
                      <vc-badge [status]="l.accreditation_current ? 'active' : 'failed'">{{ l.accreditation_valid_until | day }}</vc-badge>
                    } @else { <span class="subtle">\u2014</span> }
                  </td>
                  <td class="muted">{{ l.contact_email || '\u2014' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="open" title="Add a lab" width="560px">
      <div class="form-grid">
        <div class="field"><label for="l-code">Code</label><input id="l-code" class="input mono" [(ngModel)]="f.code" placeholder="SOILTEST-BLR" /></div>
        <div class="field"><label for="l-name">Name</label><input id="l-name" class="input" [(ngModel)]="f.name" placeholder="Soil Test Laboratory, Bengaluru" /></div>
        <div class="field"><label for="l-city">City</label><input id="l-city" class="input" [(ngModel)]="f.city" /></div>
        <div class="field"><label for="l-mail">Contact email</label><input id="l-mail" type="email" class="input" [(ngModel)]="f.contact_email" /></div>
        <div class="field"><label for="l-acc">Accreditation</label><input id="l-acc" class="input" [(ngModel)]="f.accreditation" placeholder="NABL TC-1234" /></div>
        <div class="field"><label for="l-until">Valid until</label><input id="l-until" type="date" class="input" [(ngModel)]="f.accreditation_valid_until" /></div>
      </div>
      @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || f.code.length < 2 || f.name.length < 2" (click)="save()"><vc-icon name="check" />Add lab</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;6df3dbf747363168;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\lab\\lab-labs.ts */\n.bar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n}\n/*# sourceMappingURL=lab-labs.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LabLabs, { className: "LabLabs", filePath: "src/app/features/lab/lab-labs.ts", lineNumber: 72 });
})();

// src/app/features/lab/result-drawer.ts
var _forTrack06 = ($index, $item) => $item.key;
var _forTrack15 = ($index, $item) => $item.id;
function ResultDrawer_Conditional_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275element(1, "vc-icon", 21);
    \u0275\u0275text(2, "Frozen");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function ResultDrawer_Conditional_1_Conditional_12_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u201C", r_r1.review_note, "\u201D");
  }
}
function ResultDrawer_Conditional_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 14);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275pipe(3, "day");
    \u0275\u0275conditionalCreate(4, ResultDrawer_Conditional_1_Conditional_12_Conditional_4_Template, 2, 1, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", \u0275\u0275pipeBind1(2, 4, r_r1.status), " by ", r_r1.reviewed_by || "a reviewer", " on ", \u0275\u0275pipeBind2(3, 6, r_r1.reviewed_at, true), ". Its values can no longer change \u2014 a correction is recorded as a new version that supersedes this one. ");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(r_r1.review_note ? 4 : -1);
  }
}
function ResultDrawer_Conditional_1_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Calibration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.calibrationCode());
  }
}
function ResultDrawer_Conditional_1_Conditional_49_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-hash", 25);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", ctx_r1.certSha());
  }
}
function ResultDrawer_Conditional_1_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "vc-icon", 23);
    \u0275\u0275elementStart(2, "div", 24)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ResultDrawer_Conditional_1_Conditional_49_Conditional_5_Template, 1, 1, "vc-hash", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 26);
    \u0275\u0275listener("click", function ResultDrawer_Conditional_1_Conditional_49_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openCert());
    });
    \u0275\u0275element(7, "vc-icon", 27);
    \u0275\u0275text(8, "Open");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.certName() || "Certificate (PDF)");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.certSha() ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
  }
}
function ResultDrawer_Conditional_1_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 19);
    \u0275\u0275text(1, "No certificate yet. A result can't be accepted without the signed lab certificate.");
    \u0275\u0275elementEnd();
  }
}
function ResultDrawer_Conditional_1_Conditional_51_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function ResultDrawer_Conditional_1_Conditional_51_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.uploadCert());
    });
    \u0275\u0275element(1, "vc-icon", 31);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r1.busy());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.busy() ? "Uploading\u2026" : "Attach certificate");
  }
}
function ResultDrawer_Conditional_1_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "vc-file-drop", 28);
    \u0275\u0275twoWayListener("fileChange", function ResultDrawer_Conditional_1_Conditional_51_Template_vc_file_drop_fileChange_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.certFile, $event) || (ctx_r1.certFile = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, ResultDrawer_Conditional_1_Conditional_51_Conditional_2_Template, 3, 2, "button", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r1 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("file", ctx_r1.certFile);
    \u0275\u0275property("label", r_r1.certificate_id ? "Replace with another PDF" : "Choose the certificate PDF");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.certFile() ? 2 : -1);
  }
}
function ResultDrawer_Conditional_1_Conditional_52_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function ResultDrawer_Conditional_1_Conditional_52_For_5_Template_button_click_0_listener() {
      const a_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.startAction(a_r7.key));
    });
    \u0275\u0275element(1, "vc-icon", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r7 = ctx.$implicit;
    \u0275\u0275classProp("btn-primary", a_r7.key === "accept")("btn-secondary", a_r7.key === "supersede")("btn-danger", a_r7.key === "reject" || a_r7.key === "void");
    \u0275\u0275advance();
    \u0275\u0275property("name", a_r7.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r7.label);
  }
}
function ResultDrawer_Conditional_1_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section")(1, "h3", 17);
    \u0275\u0275text(2, "Decision");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 32);
    \u0275\u0275repeaterCreate(4, ResultDrawer_Conditional_1_Conditional_52_For_5_Template, 3, 8, "button", 33, _forTrack06);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.actions());
  }
}
function ResultDrawer_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 7)(2, "div", 8)(3, "strong", 9);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 10);
    \u0275\u0275element(9, "vc-dc", 11)(10, "vc-badge", 12);
    \u0275\u0275conditionalCreate(11, ResultDrawer_Conditional_1_Conditional_11_Template, 3, 1, "span", 13);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(12, ResultDrawer_Conditional_1_Conditional_12_Template, 5, 9, "vc-callout", 14);
    \u0275\u0275elementStart(13, "dl", 15)(14, "dt");
    \u0275\u0275text(15, "Bag");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd")(17, "code");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275text(19, " ");
    \u0275\u0275elementStart(20, "span", 16);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "dt");
    \u0275\u0275text(23, "Lab");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dd");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "dt");
    \u0275\u0275text(27, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "dd");
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dt");
    \u0275\u0275text(32, "Analysed on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dd");
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "dt");
    \u0275\u0275text(37, "Uncertainty");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "dd", 9);
    \u0275\u0275text(39);
    \u0275\u0275pipe(40, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(41, ResultDrawer_Conditional_1_Conditional_41_Template, 4, 1);
    \u0275\u0275elementStart(42, "dt");
    \u0275\u0275text(43, "Entered by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "dd");
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "section")(47, "h3", 17);
    \u0275\u0275text(48, "Lab certificate");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(49, ResultDrawer_Conditional_1_Conditional_49_Template, 9, 4, "div", 18)(50, ResultDrawer_Conditional_1_Conditional_50_Template, 2, 0, "vc-callout", 19);
    \u0275\u0275conditionalCreate(51, ResultDrawer_Conditional_1_Conditional_51_Template, 3, 3, "div", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(52, ResultDrawer_Conditional_1_Conditional_52_Template, 6, 0, "section");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 17, r_r1.value, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r1.unit);
    \u0275\u0275advance(2);
    \u0275\u0275property("cls", r_r1.data_class);
    \u0275\u0275advance();
    \u0275\u0275property("status", r_r1.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.frozen() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.frozen() ? 12 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(r_r1.bag_code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("label ", r_r1.label_qr);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.ctx.labName(r_r1.lab_id));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(30, 20, r_r1.method));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(35, 22, r_r1.analysed_on));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r1.uncertainty === null ? "\u2014" : "\xB1 " + \u0275\u0275pipeBind2(40, 24, r_r1.uncertainty, 3) + " " + r_r1.unit);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r1.calibration_id ? 41 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r1.entered_by || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(r_r1.certificate_id ? 49 : 50);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r1.status === "pending" && ctx_r1.auth.can("lab.submit", "lab.review") ? 51 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.actions().length ? 52 : -1);
  }
}
function ResultDrawer_Conditional_3_Case_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " You entered or edited this result, so you can't accept it. A second person must review it \u2014 the four-eyes rule. ");
  }
}
function ResultDrawer_Conditional_3_Case_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const r_r9 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" Four-eyes rule: the person who entered or edited a result (", r_r9.entered_by || "unknown", ") can't accept it. ");
  }
}
function ResultDrawer_Conditional_3_Case_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 36);
    \u0275\u0275text(1, "Attach the certificate first \u2014 acceptance is refused without it.");
    \u0275\u0275elementEnd();
  }
}
function ResultDrawer_Conditional_3_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1, "Accepting freezes this value. It becomes the measured value used in carbon calculations.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "vc-callout", 38);
    \u0275\u0275conditionalCreate(3, ResultDrawer_Conditional_3_Case_1_Conditional_3_Template, 1, 0)(4, ResultDrawer_Conditional_3_Case_1_Conditional_4_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ResultDrawer_Conditional_3_Case_1_Conditional_5_Template, 2, 0, "vc-callout", 36);
    \u0275\u0275elementStart(6, "div", 39)(7, "label", 40);
    \u0275\u0275text(8, "Review note ");
    \u0275\u0275elementStart(9, "span", 41);
    \u0275\u0275text(10, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "textarea", 42);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_1_Template_textarea_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.note, $event) || (ctx_r1.note = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r9 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("tone", ctx_r1.mine() ? "warn" : "info");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.mine() ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!r_r9.certificate_id ? 5 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.note);
    \u0275\u0275control();
  }
}
function ResultDrawer_Conditional_3_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1, "A rejected result stays on record but is not used. The lab can submit a corrected value as a new version.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 39)(3, "label", 43);
    \u0275\u0275text(4, "Why is it rejected?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "textarea", 44);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_2_Template_textarea_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.note, $event) || (ctx_r1.note = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 45);
    \u0275\u0275text(7, "At least 5 characters. Kept in the audit log.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.note);
    \u0275\u0275control();
  }
}
function ResultDrawer_Conditional_3_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1, "Voiding withdraws an accepted value from calculations. Use Supersede instead if you have the correct value.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 39)(3, "label", 46);
    \u0275\u0275text(4, "Reason");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "textarea", 47);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_3_Template_textarea_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.note, $event) || (ctx_r1.note = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 45);
    \u0275\u0275text(7, "At least 5 characters. Kept in the audit log.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.note);
    \u0275\u0275control();
  }
}
function ResultDrawer_Conditional_3_Case_4_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 25);
  }
  if (rf & 2) {
    const m_r13 = ctx.$implicit;
    \u0275\u0275property("value", m_r13);
  }
}
function ResultDrawer_Conditional_3_Case_4_Conditional_28_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r15 = ctx.$implicit;
    \u0275\u0275property("value", c_r15.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r15.code);
  }
}
function ResultDrawer_Conditional_3_Case_4_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 39)(1, "label", 63);
    \u0275\u0275text(2, "Calibration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 64);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_4_Conditional_28_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.sCal, $event) || (ctx_r1.sCal = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(4, "option", 65);
    \u0275\u0275text(5, "Choose\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(6, ResultDrawer_Conditional_3_Case_4_Conditional_28_For_7_Template, 2, 2, "option", 25, _forTrack15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sCal);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.approvedCals());
  }
}
function ResultDrawer_Conditional_3_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 48)(3, "div", 39)(4, "label", 49);
    \u0275\u0275text(5, "Correct value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 50);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_4_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.sValue, $event) || (ctx_r1.sValue = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 39)(8, "label", 51);
    \u0275\u0275text(9, "Unit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "input", 52);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_4_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.sUnit, $event) || (ctx_r1.sUnit = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 39)(12, "label", 53);
    \u0275\u0275text(13, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 54);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_4_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.sMethod, $event) || (ctx_r1.sMethod = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "datalist", 55);
    \u0275\u0275repeaterCreate(16, ResultDrawer_Conditional_3_Case_4_For_17_Template, 1, 1, "option", 25, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 39)(19, "label", 56);
    \u0275\u0275text(20, "Analysed on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 57);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_4_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.sDate, $event) || (ctx_r1.sDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 39)(23, "label", 58);
    \u0275\u0275text(24, "Uncertainty ");
    \u0275\u0275elementStart(25, "span", 41);
    \u0275\u0275text(26, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "input", 59);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_4_Template_input_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.sUnc, $event) || (ctx_r1.sUnc = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(28, ResultDrawer_Conditional_3_Case_4_Conditional_28_Template, 8, 1, "div", 39);
    \u0275\u0275elementStart(29, "div", 60)(30, "label", 61);
    \u0275\u0275text(31, "Reason for the correction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "textarea", 62);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ResultDrawer_Conditional_3_Case_4_Template_textarea_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.note, $event) || (ctx_r1.note = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r9 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("The current value (v", r_r9.version, ") is voided and a new pending version is created. It needs its own certificate and review.");
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sValue);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sUnit);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sMethod);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.methods());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sDate);
    \u0275\u0275property("max", ctx_r1.today);
    \u0275\u0275control();
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sUnc);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.sMethod === ctx_r1.mir ? 28 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.note);
    \u0275\u0275control();
  }
}
function ResultDrawer_Conditional_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 36);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.err());
  }
}
function ResultDrawer_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275conditionalCreate(1, ResultDrawer_Conditional_3_Case_1_Template, 12, 4)(2, ResultDrawer_Conditional_3_Case_2_Template, 8, 1)(3, ResultDrawer_Conditional_3_Case_3_Template, 8, 1)(4, ResultDrawer_Conditional_3_Case_4_Template, 33, 9);
    \u0275\u0275conditionalCreate(5, ResultDrawer_Conditional_3_Conditional_5_Template, 2, 1, "vc-callout", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.action()) === "accept" ? 1 : tmp_2_0 === "reject" ? 2 : tmp_2_0 === "void" ? 3 : tmp_2_0 === "supersede" ? 4 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.err() ? 5 : -1);
  }
}
var ResultDrawer = class _ResultDrawer {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(LabContext);
  result = model(
    null,
    ...ngDevMode ? [{ debugName: "result" }] : (
      /* istanbul ignore next */
      []
    )
  );
  changed = output();
  r = computed(
    () => this.result(),
    ...ngDevMode ? [{ debugName: "r" }] : (
      /* istanbul ignore next */
      []
    )
  );
  action = signal(
    null,
    ...ngDevMode ? [{ debugName: "action" }] : (
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
  err = signal(
    null,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  certFile = signal(
    null,
    ...ngDevMode ? [{ debugName: "certFile" }] : (
      /* istanbul ignore next */
      []
    )
  );
  certSha = signal(
    null,
    ...ngDevMode ? [{ debugName: "certSha" }] : (
      /* istanbul ignore next */
      []
    )
  );
  certName = signal(
    null,
    ...ngDevMode ? [{ debugName: "certName" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mir = MIR;
  today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  note = "";
  sValue = null;
  sUnit = "";
  sMethod = "";
  sDate = "";
  sUnc = null;
  sCal = "";
  frozen = computed(
    () => !!this.r() && this.r().status !== "pending",
    ...ngDevMode ? [{ debugName: "frozen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  analyte = computed(
    () => analyteLabel(this.r()?.analyte ?? ""),
    ...ngDevMode ? [{ debugName: "analyte" }] : (
      /* istanbul ignore next */
      []
    )
  );
  methods = computed(
    () => ANALYTES.find((a) => a.key === this.r()?.analyte)?.methods ?? [],
    ...ngDevMode ? [{ debugName: "methods" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approvedCals = computed(
    () => this.ctx.calibrations().filter((c) => c.status === "approved" && c.analyte === this.r()?.analyte),
    ...ngDevMode ? [{ debugName: "approvedCals" }] : (
      /* istanbul ignore next */
      []
    )
  );
  calibrationCode = computed(
    () => this.ctx.calibrations().find((c) => c.id === this.r()?.calibration_id)?.code ?? "Linked calibration",
    ...ngDevMode ? [{ debugName: "calibrationCode" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mine = computed(
    () => !!this.r()?.entered_by && this.r().entered_by === this.auth.profile()?.full_name,
    ...ngDevMode ? [{ debugName: "mine" }] : (
      /* istanbul ignore next */
      []
    )
  );
  actions = computed(
    () => {
      const r = this.r();
      if (!r)
        return [];
      const review = this.auth.can("lab.review");
      const out = [];
      if (r.status === "pending" && review)
        out.push({ key: "accept", label: "Accept", icon: "check" }, { key: "reject", label: "Reject", icon: "x" });
      if (r.status === "accepted" && review)
        out.push({ key: "void", label: "Void", icon: "ban" });
      if (r.status === "pending" && this.auth.can("lab.submit") || (r.status === "accepted" || r.status === "rejected") && review) {
        out.push({ key: "supersede", label: "Supersede with correct value", icon: "undo" });
      }
      return out;
    },
    ...ngDevMode ? [{ debugName: "actions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  actionTitle = computed(
    () => ({ accept: "Accept result", reject: "Reject result", void: "Void result", supersede: "Create corrected version" })[this.action() ?? ""] ?? "",
    ...ngDevMode ? [{ debugName: "actionTitle" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const r = this.r();
      this.certFile.set(null);
      this.certSha.set(null);
      this.certName.set(null);
      if (r?.certificate_id) {
        this.api.get(`/evidence/${r.certificate_id}`).subscribe({
          next: (e) => {
            this.certSha.set(e.sha256);
            this.certName.set(e.filename);
          },
          error: () => {
          }
        });
      }
    });
  }
  startAction(a) {
    const r = this.r();
    this.err.set(null);
    this.note = "";
    if (a === "supersede") {
      this.sValue = r.value;
      this.sUnit = r.unit;
      this.sMethod = r.method;
      this.sDate = r.analysed_on;
      this.sUnc = r.uncertainty;
      this.sCal = r.calibration_id ?? "";
    }
    this.action.set(a);
  }
  actionValid() {
    const a = this.action();
    if (a === "accept")
      return true;
    if (a === "supersede")
      return this.sValue !== null && `${this.sValue}` !== "" && this.sMethod.trim().length >= 2 && !!this.sDate && this.note.trim().length >= 5;
    return this.note.trim().length >= 5;
  }
  submit() {
    const r = this.r();
    const a = this.action();
    this.busy.set(true);
    this.err.set(null);
    const req = a === "accept" ? this.api.post(`/lab-results/${r.id}/accept`, { note: this.note.trim() || null }) : a === "reject" ? this.api.post(`/lab-results/${r.id}/reject`, { note: this.note.trim() }) : a === "void" ? this.api.post(`/lab-results/${r.id}/void`, { note: this.note.trim() }) : this.api.post(`/lab-results/${r.id}/supersede`, {
      value: Number(this.sValue),
      method: this.sMethod.trim(),
      analysed_on: this.sDate,
      reason: this.note.trim(),
      unit: this.sUnit.trim() || null,
      uncertainty: this.sUnc === null || `${this.sUnc}` === "" ? null : Number(this.sUnc),
      calibration_id: this.sMethod === MIR && this.sCal ? this.sCal : null
    });
    req.subscribe({
      next: (res) => {
        this.busy.set(false);
        this.action.set(null);
        this.toast.success(a === "supersede" ? `Version ${res.version} created \u2014 it needs a certificate and review` : `Result ${res.status}`);
        this.result.set(res);
        this.changed.emit(res);
      },
      error: (e) => {
        this.busy.set(false);
        this.err.set(e.code === "SELF_APPROVAL_REJECTED" ? "You entered or edited this result, so you can\u2019t accept it. Another lab manager must review it." : e.message);
      }
    });
  }
  uploadCert() {
    const f = this.certFile();
    const r = this.r();
    if (!f || !r)
      return;
    const form = new FormData();
    form.append("file", f);
    this.busy.set(true);
    this.api.upload(`/lab-results/${r.id}/certificate`, form).subscribe({
      next: (res) => {
        this.busy.set(false);
        this.toast.success("Certificate attached");
        this.result.set(res);
        this.changed.emit(res);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't attach the certificate");
      }
    });
  }
  openCert() {
    const id = this.r()?.certificate_id;
    if (!id)
      return;
    const w = window.open("", "_blank");
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: (b) => {
        const u = URL.createObjectURL(b);
        if (w)
          w.location.href = u;
        else
          window.open(u, "_blank");
        setTimeout(() => URL.revokeObjectURL(u), 6e4);
      },
      error: (e) => {
        w?.close();
        this.toast.apiError(e, "Couldn't open the certificate");
      }
    });
  }
  static \u0275fac = function ResultDrawer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResultDrawer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResultDrawer, selectors: [["vc-result-drawer"]], inputs: { result: [1, "result"] }, outputs: { result: "resultChange", changed: "changed" }, decls: 9, vars: 14, consts: [["width", "560px", 3, "closed", "open", "drawer", "title", "subtitle"], [1, "stack", 2, "--gap", "20px"], ["width", "520px", 3, "closed", "open", "title"], [1, "stack", 2, "--gap", "14px"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", 3, "click", "disabled"], [1, "hero"], [1, "val"], [1, "num"], [1, "tags"], [3, "cls"], [3, "status"], [1, "lock"], ["tone", "info", "icon", "lock"], [1, "kv"], [1, "subtle", "small"], [1, "sh"], [1, "cert"], ["tone", "warn", "icon", "alert"], [1, "up"], ["name", "lock", 3, "size"], [1, "note"], ["name", "file-check", 3, "size"], [1, "ci"], [3, "value"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "eye", 3, "size"], ["accept", "application/pdf", "hint", "PDF only \xB7 up to 25 MB", 3, "fileChange", "file", "label"], [1, "btn", "btn-primary", 3, "disabled"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "upload"], [1, "acts"], [1, "btn", 3, "btn-primary", "btn-secondary", "btn-danger"], [1, "btn", 3, "click"], [3, "name"], ["tone", "danger", "icon", "alert"], [1, "muted"], ["icon", "users", 3, "tone"], [1, "field"], ["for", "a-note"], [1, "subtle"], ["id", "a-note", "rows", "2", "placeholder", "Checked against the signed certificate.", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "r-note"], ["id", "r-note", "rows", "3", "placeholder", "Value does not match the certificate.", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], ["for", "v-note"], ["id", "v-note", "rows", "3", 1, "input", 3, "ngModelChange", "ngModel"], [1, "form-grid"], ["for", "s-val"], ["id", "s-val", "type", "number", "step", "any", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "s-unit"], ["id", "s-unit", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "s-method"], ["id", "s-method", "list", "s-methods", 1, "input", 3, "ngModelChange", "ngModel"], ["id", "s-methods"], ["for", "s-date"], ["id", "s-date", "type", "date", 1, "input", 3, "ngModelChange", "ngModel", "max"], ["for", "s-unc"], ["id", "s-unc", "type", "number", "step", "any", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], ["for", "s-reason"], ["id", "s-reason", "rows", "2", "placeholder", "Transcription error \u2014 certificate shows 1.24.", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "s-cal"], ["id", "s-cal", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""]], template: function ResultDrawer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275listener("closed", function ResultDrawer_Template_vc_modal_closed_0_listener() {
        return ctx.result.set(null);
      });
      \u0275\u0275conditionalCreate(1, ResultDrawer_Conditional_1_Template, 53, 27, "div", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "vc-modal", 2);
      \u0275\u0275listener("closed", function ResultDrawer_Template_vc_modal_closed_2_listener() {
        return ctx.action.set(null);
      });
      \u0275\u0275conditionalCreate(3, ResultDrawer_Conditional_3_Template, 6, 2, "div", 3);
      \u0275\u0275elementContainerStart(4, 4);
      \u0275\u0275elementStart(5, "button", 5);
      \u0275\u0275listener("click", function ResultDrawer_Template_button_click_5_listener() {
        return ctx.action.set(null);
      });
      \u0275\u0275text(6, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "button", 6);
      \u0275\u0275listener("click", function ResultDrawer_Template_button_click_7_listener() {
        return ctx.submit();
      });
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_4_0;
      let tmp_7_0;
      \u0275\u0275property("open", !!ctx.result())("drawer", true)("title", (ctx.r()?.bag_code ?? "Result") + " \xB7 " + ctx.analyte())("subtitle", "Version " + (ctx.r()?.version ?? 1) + (ctx.r()?.supersedes_id ? " \u2014 supersedes an earlier value" : ""));
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.r()) ? 1 : -1, tmp_4_0);
      \u0275\u0275advance();
      \u0275\u0275property("open", !!ctx.action())("title", ctx.actionTitle());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_7_0 = ctx.r()) ? 3 : -1, tmp_7_0);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("btn-primary", ctx.action() === "accept" || ctx.action() === "supersede")("btn-danger", ctx.action() === "reject" || ctx.action() === "void");
      \u0275\u0275property("disabled", ctx.busy() || !ctx.actionValid());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.busy() ? "Working\u2026" : ctx.actionTitle());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, NgModel, Modal, Icon, Badge, Callout, DataClass, FileDrop, Hash, DayPipe, NumPipe, HumanPipe], styles: ["\n.hero[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 16px 18px;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  background: var(--%NS%surface-2);\n}\n.val[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  line-height: 1;\n}\n.val[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-left: 6px;\n  color: var(--%NS%text-2);\n  font-size: 15px;\n}\n.tags[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n.lock[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--%NS%stone-600);\n  background: var(--%NS%stone-100);\n  border: 1px solid var(--%NS%stone-200);\n  border-radius: 999px;\n  padding: 2px 8px;\n}\n.note[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  color: var(--%NS%stone-700);\n  font-style: italic;\n}\n.sh[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n}\n.cert[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  color: var(--%NS%forest-600);\n}\n.ci[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n  color: var(--%NS%text);\n}\n.up[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin-top: 10px;\n  align-items: flex-start;\n}\n.up[_ngcontent-%COMP%]   vc-file-drop[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.acts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n/*# sourceMappingURL=result-drawer.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResultDrawer, [{
    type: Component,
    args: [{ selector: "vc-result-drawer", imports: [FormsModule, Modal, Icon, Badge, Callout, DataClass, FileDrop, Hash, DayPipe, NumPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [open]="!!result()" (closed)="result.set(null)" [drawer]="true" width="560px"
      [title]="(r()?.bag_code ?? 'Result') + ' \xB7 ' + analyte()" [subtitle]="'Version ' + (r()?.version ?? 1) + (r()?.supersedes_id ? ' \u2014 supersedes an earlier value' : '')">
      @if (r(); as r) {
        <div class="stack" style="--gap:20px">
          <div class="hero">
            <div class="val"><strong class="num">{{ r.value | num: 3 }}</strong><span>{{ r.unit }}</span></div>
            <div class="tags">
              <vc-dc [cls]="r.data_class" />
              <vc-badge [status]="r.status" />
              @if (frozen()) { <span class="lock"><vc-icon name="lock" [size]="13" />Frozen</span> }
            </div>
          </div>

          @if (frozen()) {
            <vc-callout tone="info" icon="lock">
              {{ r.status | human }} by {{ r.reviewed_by || 'a reviewer' }} on {{ r.reviewed_at | day: true }}. Its values can no longer change \u2014
              a correction is recorded as a new version that supersedes this one.
              @if (r.review_note) { <div class="note">\u201C{{ r.review_note }}\u201D</div> }
            </vc-callout>
          }

          <dl class="kv">
            <dt>Bag</dt><dd><code>{{ r.bag_code }}</code>&ngsp;<span class="subtle small">label {{ r.label_qr }}</span></dd>
            <dt>Lab</dt><dd>{{ ctx.labName(r.lab_id) }}</dd>
            <dt>Method</dt><dd>{{ r.method | human }}</dd>
            <dt>Analysed on</dt><dd>{{ r.analysed_on | day }}</dd>
            <dt>Uncertainty</dt><dd class="num">{{ r.uncertainty === null ? '\u2014' : '\xB1 ' + (r.uncertainty | num: 3) + ' ' + r.unit }}</dd>
            @if (r.calibration_id) { <dt>Calibration</dt><dd>{{ calibrationCode() }}</dd> }
            <dt>Entered by</dt><dd>{{ r.entered_by || '\u2014' }}</dd>
          </dl>

          <section>
            <h3 class="sh">Lab certificate</h3>
            @if (r.certificate_id) {
              <div class="cert">
                <vc-icon name="file-check" [size]="20" />
                <div class="ci">
                  <strong>{{ certName() || 'Certificate (PDF)' }}</strong>
                  @if (certSha()) { <vc-hash [value]="certSha()!" /> }
                </div>
                <button class="btn btn-secondary btn-sm" (click)="openCert()"><vc-icon name="eye" [size]="14" />Open</button>
              </div>
            } @else {
              <vc-callout tone="warn" icon="alert">No certificate yet. A result can't be accepted without the signed lab certificate.</vc-callout>
            }
            @if (r.status === 'pending' && auth.can('lab.submit', 'lab.review')) {
              <div class="up">
                <vc-file-drop accept="application/pdf" [(file)]="certFile" [label]="r.certificate_id ? 'Replace with another PDF' : 'Choose the certificate PDF'" hint="PDF only \xB7 up to 25 MB" />
                @if (certFile()) {
                  <button class="btn btn-primary" [disabled]="busy()" (click)="uploadCert()"><vc-icon name="upload" />{{ busy() ? 'Uploading\u2026' : 'Attach certificate' }}</button>
                }
              </div>
            }
          </section>

          @if (actions().length) {
            <section>
              <h3 class="sh">Decision</h3>
              <div class="acts">
                @for (a of actions(); track a.key) {
                  <button class="btn" [class.btn-primary]="a.key === 'accept'" [class.btn-secondary]="a.key === 'supersede'"
                    [class.btn-danger]="a.key === 'reject' || a.key === 'void'" (click)="startAction(a.key)"><vc-icon [name]="a.icon" />{{ a.label }}</button>
                }
              </div>
            </section>
          }
        </div>
      }
    </vc-modal>

    <vc-modal [open]="!!action()" (closed)="action.set(null)" width="520px" [title]="actionTitle()">
      @if (r(); as r) {
        <div class="stack" style="--gap:14px">
          @switch (action()) {
            @case ('accept') {
              <p class="muted">Accepting freezes this value. It becomes the measured value used in carbon calculations.</p>
              <vc-callout [tone]="mine() ? 'warn' : 'info'" icon="users">
                @if (mine()) {
                  You entered or edited this result, so you can't accept it. A second person must review it \u2014 the four-eyes rule.
                } @else {
                  Four-eyes rule: the person who entered or edited a result ({{ r.entered_by || 'unknown' }}) can't accept it.
                }
              </vc-callout>
              @if (!r.certificate_id) { <vc-callout tone="danger" icon="alert">Attach the certificate first \u2014 acceptance is refused without it.</vc-callout> }
              <div class="field"><label for="a-note">Review note <span class="subtle">(optional)</span></label>
                <textarea id="a-note" class="input" rows="2" [(ngModel)]="note" placeholder="Checked against the signed certificate."></textarea></div>
            }
            @case ('reject') {
              <p class="muted">A rejected result stays on record but is not used. The lab can submit a corrected value as a new version.</p>
              <div class="field"><label for="r-note">Why is it rejected?</label>
                <textarea id="r-note" class="input" rows="3" [(ngModel)]="note" placeholder="Value does not match the certificate."></textarea>
                <span class="hint">At least 5 characters. Kept in the audit log.</span></div>
            }
            @case ('void') {
              <p class="muted">Voiding withdraws an accepted value from calculations. Use Supersede instead if you have the correct value.</p>
              <div class="field"><label for="v-note">Reason</label>
                <textarea id="v-note" class="input" rows="3" [(ngModel)]="note"></textarea>
                <span class="hint">At least 5 characters. Kept in the audit log.</span></div>
            }
            @case ('supersede') {
              <p class="muted">The current value (v{{ r.version }}) is voided and a new pending version is created. It needs its own certificate and review.</p>
              <div class="form-grid">
                <div class="field"><label for="s-val">Correct value</label>
                  <input id="s-val" type="number" step="any" class="input num" [(ngModel)]="sValue" /></div>
                <div class="field"><label for="s-unit">Unit</label>
                  <input id="s-unit" class="input" [(ngModel)]="sUnit" /></div>
                <div class="field"><label for="s-method">Method</label>
                  <input id="s-method" class="input" [(ngModel)]="sMethod" list="s-methods" />
                  <datalist id="s-methods">@for (m of methods(); track m) { <option [value]="m"></option> }</datalist></div>
                <div class="field"><label for="s-date">Analysed on</label>
                  <input id="s-date" type="date" class="input" [(ngModel)]="sDate" [max]="today" /></div>
                <div class="field"><label for="s-unc">Uncertainty <span class="subtle">(optional)</span></label>
                  <input id="s-unc" type="number" step="any" min="0" class="input num" [(ngModel)]="sUnc" /></div>
                @if (sMethod === mir) {
                  <div class="field"><label for="s-cal">Calibration</label>
                    <select id="s-cal" class="input" [(ngModel)]="sCal">
                      <option value="">Choose\u2026</option>
                      @for (c of approvedCals(); track c.id) { <option [value]="c.id">{{ c.code }}</option> }
                    </select></div>
                }
                <div class="field span-2"><label for="s-reason">Reason for the correction</label>
                  <textarea id="s-reason" class="input" rows="2" [(ngModel)]="note" placeholder="Transcription error \u2014 certificate shows 1.24."></textarea></div>
              </div>
            }
          }
          @if (err()) { <vc-callout tone="danger" icon="alert">{{ err() }}</vc-callout> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="action.set(null)">Cancel</button>
        <button class="btn" [class.btn-primary]="action() === 'accept' || action() === 'supersede'" [class.btn-danger]="action() === 'reject' || action() === 'void'"
          [disabled]="busy() || !actionValid()" (click)="submit()">{{ busy() ? 'Working\u2026' : actionTitle() }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;6cff3a8c5189fc72;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\lab\\result-drawer.ts */\n.hero {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 16px 18px;\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  background: var(--surface-2);\n}\n.val strong {\n  font-size: 32px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  line-height: 1;\n}\n.val span {\n  margin-left: 6px;\n  color: var(--text-2);\n  font-size: 15px;\n}\n.tags {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n.lock {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--stone-600);\n  background: var(--stone-100);\n  border: 1px solid var(--stone-200);\n  border-radius: 999px;\n  padding: 2px 8px;\n}\n.note {\n  margin-top: 6px;\n  color: var(--stone-700);\n  font-style: italic;\n}\n.sh {\n  margin-bottom: 10px;\n}\n.cert {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 14px;\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  color: var(--forest-600);\n}\n.ci {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n  color: var(--text);\n}\n.up {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin-top: 10px;\n  align-items: flex-start;\n}\n.up vc-file-drop {\n  width: 100%;\n}\n.acts {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n/*# sourceMappingURL=result-drawer.css.map */\n"] }]
  }], () => [], { result: [{ type: Input, args: [{ isSignal: true, alias: "result", required: false }] }, { type: Output, args: ["resultChange"] }], changed: [{ type: Output, args: ["changed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResultDrawer, { className: "ResultDrawer", filePath: "src/app/features/lab/result-drawer.ts", lineNumber: 170 });
})();

// src/app/features/lab/lab-results.ts
var _forTrack07 = ($index, $item) => $item.key;
var _forTrack16 = ($index, $item) => $item.id;
function LabResults_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function LabResults_For_3_Template_button_click_0_listener() {
      const s_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.setStatus(s_r2.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r2.status() === s_r2.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r2.label);
  }
}
function LabResults_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r4 = ctx.$implicit;
    \u0275\u0275property("value", a_r4.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r4.label);
  }
}
function LabResults_Conditional_9_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r6 = ctx.$implicit;
    \u0275\u0275property("value", l_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r6.name);
  }
}
function LabResults_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 19);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function LabResults_Conditional_9_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.labId.set($event);
      return \u0275\u0275resetView(ctx_r2.page.set(1));
    });
    \u0275\u0275elementStart(1, "option", 4);
    \u0275\u0275text(2, "All labs");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, LabResults_Conditional_9_For_4_Template, 2, 2, "option", 5, _forTrack16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngModel", ctx_r2.labId());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.ctx.labs());
  }
}
function LabResults_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 14);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function LabResults_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "vc-error", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r2.error());
  }
}
function LabResults_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 16);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r2.status() === "pending" ? "Nothing awaiting review" : "No results match")("text", ctx_r2.status() === "pending" ? "Every submitted result has been reviewed." : "Results appear here as the lab enters or imports them.");
  }
}
function LabResults_Conditional_21_For_20_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("v", r_r9.version);
  }
}
function LabResults_Conditional_21_For_20_Conditional_23_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-hash", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("value", ctx);
  }
}
function LabResults_Conditional_21_For_20_Conditional_23_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275element(1, "vc-icon", 39);
    \u0275\u0275text(2, " Attached");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function LabResults_Conditional_21_For_20_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, LabResults_Conditional_21_For_20_Conditional_23_Conditional_0_Template, 1, 1, "vc-hash", 5)(1, LabResults_Conditional_21_For_20_Conditional_23_Conditional_1_Template, 3, 1, "span", 26);
  }
  if (rf & 2) {
    let tmp_12_0;
    const r_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_12_0 = ctx_r2.shas()[r_r9.certificate_id]) ? 0 : 1, tmp_12_0);
  }
}
function LabResults_Conditional_21_For_20_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275element(1, "vc-icon", 40);
    \u0275\u0275text(2, "Missing");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function LabResults_Conditional_21_For_20_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 38);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 13);
    \u0275\u0275attribute("title", "Frozen");
  }
}
function LabResults_Conditional_21_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 30);
    \u0275\u0275listener("click", function LabResults_Conditional_21_For_20_Template_tr_click_0_listener() {
      const r_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.open.set(r_r9));
    });
    \u0275\u0275elementStart(1, "td", 31)(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 31);
    \u0275\u0275text(5);
    \u0275\u0275conditionalCreate(6, LabResults_Conditional_21_For_20_Conditional_6_Template, 2, 1, "span", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 32)(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " ");
    \u0275\u0275elementStart(12, "span", 33);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, " ");
    \u0275\u0275element(15, "vc-dc", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 35);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 31);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td");
    \u0275\u0275conditionalCreate(23, LabResults_Conditional_21_For_20_Conditional_23_Template, 2, 1)(24, LabResults_Conditional_21_For_20_Conditional_24_Template, 3, 1, "span", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "td", 31)(26, "vc-badge", 37);
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(29, LabResults_Conditional_21_For_20_Conditional_29_Template, 1, 2, "vc-icon", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r9 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r9.bag_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.label(r_r9.analyte), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r9.version > 1 ? 6 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 12, r_r9.value, 3));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r9.unit);
    \u0275\u0275advance(2);
    \u0275\u0275property("cls", r_r9.data_class);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 15, r_r9.method));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 17, r_r9.analysed_on));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(r_r9.certificate_id ? 23 : 24);
    \u0275\u0275advance(3);
    \u0275\u0275property("status", r_r9.status);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r9.status === "pending" ? "Awaiting review" : \u0275\u0275pipeBind1(28, 19, r_r9.status));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r9.status !== "pending" ? 29 : -1);
  }
}
function LabResults_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "table", 22)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Bag");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Analyte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 23);
    \u0275\u0275text(9, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Analysed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Certificate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Status");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, LabResults_Conditional_21_For_20_Template, 30, 21, "tr", 24, _forTrack16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 25)(22, "span", 26);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275element(24, "div", 10);
    \u0275\u0275elementStart(25, "button", 27);
    \u0275\u0275listener("click", function LabResults_Conditional_21_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.page.set(ctx_r2.page() - 1));
    });
    \u0275\u0275element(26, "vc-icon", 28);
    \u0275\u0275text(27, "Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 27);
    \u0275\u0275listener("click", function LabResults_Conditional_21_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.page.set(ctx_r2.page() + 1));
    });
    \u0275\u0275text(29, "Next");
    \u0275\u0275element(30, "vc-icon", 29);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r2.rows());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3("", (ctx_r2.page() - 1) * ctx_r2.pageSize + 1, "\u2013", (ctx_r2.page() - 1) * ctx_r2.pageSize + ctx_r2.all().length, " of ", ctx_r2.total());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.page() === 1);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.page() * ctx_r2.pageSize >= ctx_r2.total());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
  }
}
var PAGE = 100;
var LabResults = class _LabResults {
  api = inject(ApiService);
  auth = inject(AuthService);
  ctx = inject(LabContext);
  analytes = ANALYTES;
  pageSize = PAGE;
  statuses = [
    { key: "pending", label: "Awaiting review" },
    { key: "", label: "All" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
    { key: "voided", label: "Voided" }
  ];
  status = signal(
    this.auth.can("lab.review") ? "pending" : "",
    ...ngDevMode ? [{ debugName: "status" }] : (
      /* istanbul ignore next */
      []
    )
  );
  analyte = signal(
    "",
    ...ngDevMode ? [{ debugName: "analyte" }] : (
      /* istanbul ignore next */
      []
    )
  );
  labId = signal(
    "",
    ...ngDevMode ? [{ debugName: "labId" }] : (
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
  page = signal(
    1,
    ...ngDevMode ? [{ debugName: "page" }] : (
      /* istanbul ignore next */
      []
    )
  );
  all = signal(
    [],
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  total = signal(
    0,
    ...ngDevMode ? [{ debugName: "total" }] : (
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
  shas = signal(
    {},
    ...ngDevMode ? [{ debugName: "shas" }] : (
      /* istanbul ignore next */
      []
    )
  );
  open = signal(
    null,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => {
      const q = this.q().trim().toLowerCase();
      return this.all().filter((r) => !q || (r.bag_code ?? "").toLowerCase().includes(q) || (r.label_qr ?? "").toLowerCase().includes(q));
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      this.status();
      this.analyte();
      this.labId();
      this.page();
      this.load();
    });
  }
  setStatus(s) {
    this.status.set(s);
    this.page.set(1);
  }
  label(a) {
    return analyteLabel(a);
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get("/lab-results", {
      status: this.status(),
      analyte: this.analyte(),
      lab_id: this.labId(),
      page: this.page(),
      page_size: PAGE
    }).subscribe({
      next: (r) => {
        this.all.set(r.items);
        this.total.set(r.total);
        this.loading.set(false);
        this.fetchShas(r.items);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  fetchShas(items) {
    const known = this.shas();
    const ids = [...new Set(items.map((i) => i.certificate_id).filter((x) => !!x && !known[x]))].slice(0, 60);
    for (const id of ids) {
      this.api.get(`/evidence/${id}`).subscribe({
        next: (e) => this.shas.update((m) => __spreadProps(__spreadValues({}, m), { [id]: e.sha256 })),
        error: () => {
        }
      });
    }
  }
  onChanged(r) {
    if (r.certificate_id)
      this.fetchShas([r]);
    this.load();
  }
  static \u0275fac = function LabResults_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LabResults)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LabResults, selectors: [["vc-lab-results"]], decls: 23, vars: 6, consts: [[1, "filters"], [1, "seg"], ["type", "button", 3, "on"], ["aria-label", "Analyte", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["aria-label", "Lab", 1, "input", 3, "ngModel"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Filter this page by bag code\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "spacer"], [1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "flask", 3, "title", "text"], [3, "resultChange", "changed", "result"], ["type", "button", 3, "click"], ["aria-label", "Lab", 1, "input", 3, "ngModelChange", "ngModel"], ["title", "Couldn't load lab results", 3, "message"], [1, "table-wrap"], [1, "table"], [1, "num"], [1, "clickable"], [1, "card-foot", "pager"], [1, "subtle", "small"], [1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], ["name", "chevron-left", 3, "size"], ["name", "chevron-right", 3, "size"], [1, "clickable", 3, "click"], [1, "nowrap"], [1, "num", "nowrap"], [1, "subtle"], [3, "cls"], [1, "muted", "nowrap"], [1, "missing"], [3, "status"], ["name", "lock", 1, "lk", 3, "size"], ["name", "file-check", 3, "size"], ["name", "alert", 3, "size"]], template: function LabResults_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275repeaterCreate(2, LabResults_For_3_Template, 2, 3, "button", 2, _forTrack07);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "select", 3);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabResults_Template_select_ngModelChange_4_listener($event) {
        ctx.analyte.set($event);
        return ctx.page.set(1);
      });
      \u0275\u0275elementStart(5, "option", 4);
      \u0275\u0275text(6, "All analytes");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(7, LabResults_For_8_Template, 2, 2, "option", 5, _forTrack07);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, LabResults_Conditional_9_Template, 5, 1, "select", 6);
      \u0275\u0275elementStart(10, "div", 7);
      \u0275\u0275element(11, "vc-icon", 8);
      \u0275\u0275elementStart(12, "input", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LabResults_Template_input_ngModelChange_12_listener($event) {
        return ctx.q.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275element(13, "div", 10);
      \u0275\u0275elementStart(14, "button", 11);
      \u0275\u0275listener("click", function LabResults_Template_button_click_14_listener() {
        return ctx.load();
      });
      \u0275\u0275element(15, "vc-icon", 12);
      \u0275\u0275text(16, "Refresh");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "section", 13);
      \u0275\u0275conditionalCreate(18, LabResults_Conditional_18_Template, 1, 1, "vc-loading", 14)(19, LabResults_Conditional_19_Template, 2, 1, "div", 15)(20, LabResults_Conditional_20_Template, 1, 2, "vc-empty", 16)(21, LabResults_Conditional_21_Template, 31, 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "vc-result-drawer", 17);
      \u0275\u0275twoWayListener("resultChange", function LabResults_Template_vc_result_drawer_resultChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275listener("changed", function LabResults_Template_vc_result_drawer_changed_22_listener($event) {
        return ctx.onChanged($event);
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.statuses);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.analyte());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.analytes);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.ctx.scopedLabId() && ctx.ctx.labs().length > 1 ? 9 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.q());
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.loading() ? 18 : ctx.error() ? 19 : !ctx.rows().length ? 20 : 21);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("result", ctx.open);
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, Icon, Badge, DataClass, Empty, ErrorBox, Hash, Loading, ResultDrawer, DayPipe, NumPipe, HumanPipe], styles: ["\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 190px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: flex;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: var(--%NS%radius-sm);\n  padding: 3px;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 13px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  padding: 0 12px;\n  height: 30px;\n  border-radius: 5px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  color: #fff;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 220px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\nvc-hash[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.missing[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12.5px;\n  color: var(--%NS%amber-600);\n}\n.lk[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-500);\n  margin-left: 6px;\n  vertical-align: middle;\n}\ntd[_ngcontent-%COMP%]   .subtle.small[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.pager[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=lab-results.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LabResults, [{
    type: Component,
    args: [{ selector: "vc-lab-results", imports: [FormsModule, Icon, Badge, DataClass, Empty, ErrorBox, Hash, Loading, ResultDrawer, DayPipe, NumPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="filters">
      <div class="seg">
        @for (s of statuses; track s.key) {
          <button type="button" [class.on]="status() === s.key" (click)="setStatus(s.key)">{{ s.label }}</button>
        }
      </div>
      <select class="input" [ngModel]="analyte()" (ngModelChange)="analyte.set($event); page.set(1)" aria-label="Analyte">
        <option value="">All analytes</option>
        @for (a of analytes; track a.key) { <option [value]="a.key">{{ a.label }}</option> }
      </select>
      @if (!ctx.scopedLabId() && ctx.labs().length > 1) {
        <select class="input" [ngModel]="labId()" (ngModelChange)="labId.set($event); page.set(1)" aria-label="Lab">
          <option value="">All labs</option>
          @for (l of ctx.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
        </select>
      }
      <div class="search">
        <vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Filter this page by bag code\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" />
      </div>
      <div class="spacer"></div>
      <button class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
    </div>

    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="8" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load lab results" [message]="error()!" /></div>
      } @else if (!rows().length) {
        <vc-empty icon="flask" [title]="status() === 'pending' ? 'Nothing awaiting review' : 'No results match'"
          [text]="status() === 'pending' ? 'Every submitted result has been reviewed.' : 'Results appear here as the lab enters or imports them.'" />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>Bag</th><th>Analyte</th><th class="num">Value</th><th>Method</th><th>Analysed</th><th>Certificate</th><th>Status</th>
            </tr></thead>
            <tbody>
              @for (r of rows(); track r.id) {
                <tr class="clickable" (click)="open.set(r)">
                  <td class="nowrap"><code>{{ r.bag_code }}</code></td>
                  <td class="nowrap">{{ label(r.analyte) }} @if (r.version > 1) { <span class="subtle small">v{{ r.version }}</span> }</td>
                  <td class="num nowrap"><strong>{{ r.value | num: 3 }}</strong>&ngsp;<span class="subtle">{{ r.unit }}</span>&ngsp;<vc-dc [cls]="r.data_class" /></td>
                  <td class="muted nowrap">{{ r.method | human }}</td>
                  <td class="nowrap">{{ r.analysed_on | day }}</td>
                  <td>
                    @if (r.certificate_id) {
                      @if (shas()[r.certificate_id]; as sha) { <vc-hash [value]="sha" /> } @else { <span class="subtle small"><vc-icon name="file-check" [size]="14" /> Attached</span> }
                    } @else { <span class="missing"><vc-icon name="alert" [size]="13" />Missing</span> }
                  </td>
                  <td class="nowrap">
                    <vc-badge [status]="r.status">{{ r.status === 'pending' ? 'Awaiting review' : (r.status | human) }}</vc-badge>
                    @if (r.status !== 'pending') { <vc-icon class="lk" name="lock" [size]="13" [attr.title]="'Frozen'" /> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot pager">
          <span class="subtle small">{{ (page() - 1) * pageSize + 1 }}\u2013{{ (page() - 1) * pageSize + all().length }} of {{ total() }}</span>
          <div class="spacer"></div>
          <button class="btn btn-secondary btn-sm" [disabled]="page() === 1" (click)="page.set(page() - 1)"><vc-icon name="chevron-left" [size]="14" />Previous</button>
          <button class="btn btn-secondary btn-sm" [disabled]="page() * pageSize >= total()" (click)="page.set(page() + 1)">Next<vc-icon name="chevron-right" [size]="14" /></button>
        </div>
      }
    </section>

    <vc-result-drawer [(result)]="open" (changed)="onChanged($event)" />
  `, styles: ["/* angular:styles/component:scss;86ad4d491d6ae5eb;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\lab\\lab-results.ts */\n.filters {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.filters select {\n  width: 190px;\n}\n.seg {\n  display: flex;\n  background: var(--surface);\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius-sm);\n  padding: 3px;\n  gap: 2px;\n}\n.seg button {\n  border: 0;\n  background: none;\n  font: 500 13px var(--font);\n  color: var(--stone-600);\n  padding: 0 12px;\n  height: 30px;\n  border-radius: 5px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.seg button.on {\n  background: var(--forest-600);\n  color: #fff;\n}\n.search {\n  position: relative;\n  min-width: 220px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\nvc-hash {\n  white-space: nowrap;\n}\n.missing {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12.5px;\n  color: var(--amber-600);\n}\n.lk {\n  color: var(--stone-500);\n  margin-left: 6px;\n  vertical-align: middle;\n}\ntd .subtle.small {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.pager {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=lab-results.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LabResults, { className: "LabResults", filePath: "src/app/features/lab/lab-results.ts", lineNumber: 106 });
})();

// src/app/features/lab/lab.page.ts
function LabPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "vc-icon", 4);
    \u0275\u0275elementStart(2, "span")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "em");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const l_r1 = ctx;
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(l_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", l_r1.accreditation || "Your lab", "", l_r1.city ? " \xB7 " + l_r1.city : "");
  }
}
function LabPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 2);
    \u0275\u0275text(1, " Your account is not linked to a lab yet, so no batches or results are shown. Ask an administrator to set your lab. ");
    \u0275\u0275elementEnd();
  }
}
function LabPage_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-lab-results");
  }
}
function LabPage_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-lab-entry");
  }
}
function LabPage_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-lab-import");
  }
}
function LabPage_Case_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-lab-batches");
  }
}
function LabPage_Case_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-lab-labs");
  }
}
function LabPage_Case_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-lab-calibrations");
  }
}
var LabPage = class _LabPage {
  auth = inject(AuthService);
  lab = inject(LabContext);
  tab = signal(
    "results",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => {
      const t = [{ key: "results", label: "Results" }];
      if (this.auth.can("lab.submit"))
        t.push({ key: "enter", label: "Enter results" }, { key: "import", label: "Import CSV" });
      t.push({ key: "batches", label: "Batches" }, { key: "labs", label: "Labs" }, { key: "calibrations", label: "Calibrations" });
      return t;
    },
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.lab.loadLabs();
    this.lab.loadCalibrations();
  }
  static \u0275fac = function LabPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LabPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LabPage, selectors: [["vc-lab-page"]], features: [\u0275\u0275ProvidersFeature([LabContext])], decls: 10, vars: 5, consts: [["title", "Laboratory", "eyebrow", "Measurement", "subtitle", "Results for every bag, with the lab's certificate. A reviewed result is frozen; a correction is a new version that supersedes it."], ["actions", "", 1, "mylab"], ["tone", "warn", "icon", "alert", 2, "margin-bottom", "16px"], [3, "activeChange", "tabs", "active"], ["name", "flask", 3, "size"]], template: function LabPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, LabPage_Conditional_1_Template, 7, 4, "div", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(2, LabPage_Conditional_2_Template, 2, 0, "vc-callout", 2);
      \u0275\u0275elementStart(3, "vc-tabs", 3);
      \u0275\u0275twoWayListener("activeChange", function LabPage_Template_vc_tabs_activeChange_3_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tab, $event) || (ctx.tab = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, LabPage_Case_4_Template, 1, 0, "vc-lab-results")(5, LabPage_Case_5_Template, 1, 0, "vc-lab-entry")(6, LabPage_Case_6_Template, 1, 0, "vc-lab-import")(7, LabPage_Case_7_Template, 1, 0, "vc-lab-batches")(8, LabPage_Case_8_Template, 1, 0, "vc-lab-labs")(9, LabPage_Case_9_Template, 1, 0, "vc-lab-calibrations");
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_4_0;
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_0_0 = ctx.lab.myLab()) ? 1 : -1, tmp_0_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.lab.unscopedTech() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("tabs", ctx.tabs());
      \u0275\u0275twoWayProperty("active", ctx.tab);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.tab()) === "results" ? 4 : tmp_4_0 === "enter" ? 5 : tmp_4_0 === "import" ? 6 : tmp_4_0 === "batches" ? 7 : tmp_4_0 === "labs" ? 8 : tmp_4_0 === "calibrations" ? 9 : -1);
    }
  }, dependencies: [PageHeader, Tabs, Icon, Callout, LabResults, LabEntry, LabImport, LabBatches, LabLabs, LabCalibrations], styles: ["\n.mylab[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 14px;\n  border: 1px solid var(--%NS%forest-200);\n  background: var(--%NS%forest-50);\n  border-radius: var(--%NS%radius);\n  color: var(--%NS%forest-700);\n}\n.mylab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.mylab[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%stone-900);\n}\n.mylab[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n/*# sourceMappingURL=lab.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LabPage, [{
    type: Component,
    args: [{ selector: "vc-lab-page", imports: [PageHeader, Tabs, Icon, Callout, LabResults, LabEntry, LabImport, LabBatches, LabLabs, LabCalibrations], providers: [LabContext], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Laboratory" eyebrow="Measurement"
      subtitle="Results for every bag, with the lab's certificate. A reviewed result is frozen; a correction is a new version that supersedes it.">
      @if (lab.myLab(); as l) {
        <div actions class="mylab">
          <vc-icon name="flask" [size]="16" />
          <span><strong>{{ l.name }}</strong><em>{{ l.accreditation || 'Your lab' }}{{ l.city ? ' \xB7 ' + l.city : '' }}</em></span>
        </div>
      }
    </vc-page-header>

    @if (lab.unscopedTech()) {
      <vc-callout tone="warn" icon="alert" style="margin-bottom:16px">
        Your account is not linked to a lab yet, so no batches or results are shown. Ask an administrator to set your lab.
      </vc-callout>
    }

    <vc-tabs [tabs]="tabs()" [(active)]="tab" />

    @switch (tab()) {
      @case ('results') { <vc-lab-results /> }
      @case ('enter') { <vc-lab-entry /> }
      @case ('import') { <vc-lab-import /> }
      @case ('batches') { <vc-lab-batches /> }
      @case ('labs') { <vc-lab-labs /> }
      @case ('calibrations') { <vc-lab-calibrations /> }
    }
  `, styles: ["/* angular:styles/component:scss;1cd30982309100ec;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\lab\\lab.page.ts */\n.mylab {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 14px;\n  border: 1px solid var(--forest-200);\n  background: var(--forest-50);\n  border-radius: var(--radius);\n  color: var(--forest-700);\n}\n.mylab span {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.mylab strong {\n  font-size: 13.5px;\n  color: var(--stone-900);\n}\n.mylab em {\n  font-style: normal;\n  font-size: 12px;\n  color: var(--text-2);\n}\n/*# sourceMappingURL=lab.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LabPage, { className: "LabPage", filePath: "src/app/features/lab/lab.page.ts", lineNumber: 52 });
})();

// src/app/features/lab/lab.routes.ts
var lab_routes_default = [{ path: "", component: LabPage, title: "Laboratory \xB7 Varsapradaya Carbon" }];
export {
  lab_routes_default as default
};
//# debugId=ea38ebb9-757b-5498-a740-7a1af88bceba
//# sourceMappingURL=chunk-LPKFEPNH.js.map
