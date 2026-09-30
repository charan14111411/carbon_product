import {
  ProfileForm
} from "./chunk-UKJ32EPU.js";
import {
  Steps,
  apiMessage,
  money
} from "./chunk-W6OT2EF5.js";
import {
  Chart
} from "./chunk-RHCCRMNI.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  RangeValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  InrPipe,
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  ActivatedRoute,
  AuthService,
  Router
} from "./chunk-G6POHVBO.js";
import {
  Badge,
  Callout,
  DataClass,
  Empty,
  ErrorBox,
  KIT,
  Loading,
  Modal,
  PageHeader,
  Stat,
  Tabs
} from "./chunk-3GJ7OF6Y.js";
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
  input,
  map,
  of,
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
  ɵɵcontrol,
  ɵɵcontrolCreate,
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
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/benefits/benefit-types.ts
var WEIGHT_KEYS = ["area", "practices", "credits"];
var WEIGHT_LABEL = { area: "Enrolled area", practices: "Recorded practices", credits: "Credit contribution" };
var WEIGHT_COLOR = { area: "#2f7249", practices: "#c76329", credits: "#1f5f99" };
var PeopleDirectory = class _PeopleDirectory {
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
      next: (us) => this.names.set(Object.fromEntries(us.map((u) => [u.id, u.full_name]))),
      error: () => {
      }
    });
  }
  name(id) {
    if (!id)
      return "System";
    return this.names()[id] ?? "A colleague";
  }
  static \u0275fac = function PeopleDirectory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PeopleDirectory)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PeopleDirectory, factory: _PeopleDirectory.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PeopleDirectory, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/benefits/payouts.tab.ts
var _c0 = () => [];
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.k;
function PayoutsTab_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 3);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function PayoutsTab_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "vc-error", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function PayoutsTab_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 5);
  }
}
function PayoutsTab_Conditional_7_For_18_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-badge", 21);
  }
}
function PayoutsTab_Conditional_7_For_18_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    \u0275\u0275classMap("t-" + c_r4.k);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", c_r4.n, " ", c_r4.label);
  }
}
function PayoutsTab_Conditional_7_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 18);
    \u0275\u0275listener("click", function PayoutsTab_Conditional_7_For_18_Template_tr_click_0_listener() {
      const b_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.open(b_r3.id));
    });
    \u0275\u0275elementStart(1, "td", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275element(4, "vcx-steps", 20);
    \u0275\u0275conditionalCreate(5, PayoutsTab_Conditional_7_For_18_Conditional_5_Template, 1, 0, "vc-badge", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 16);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 16)(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 22);
    \u0275\u0275repeaterCreate(12, PayoutsTab_Conditional_7_For_18_For_13_Template, 2, 4, "span", 23, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const b_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r3.code);
    \u0275\u0275advance(2);
    \u0275\u0275property("steps", ctx_r0.steps)("current", ctx_r0.stepOf(b_r3.status))("compact", true)("offPath", \u0275\u0275pureFunction0(9, _c0));
    \u0275\u0275advance();
    \u0275\u0275conditional(b_r3.status === "partially_failed" ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.m(b_r3.total_amount));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.m(b_r3.paid_amount));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.countList(b_r3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.people.name(b_r3.created_by));
  }
}
function PayoutsTab_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "table", 15)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Batch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Progress");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 16);
    \u0275\u0275text(9, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 16);
    \u0275\u0275text(11, "Paid");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Lines");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Prepared by");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody");
    \u0275\u0275repeaterCreate(17, PayoutsTab_Conditional_7_For_18_Template, 16, 10, "tr", 17, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r0.batches());
  }
}
function PayoutsTab_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 3);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function PayoutsTab_Conditional_10_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r5 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Waiting for approval. ", ctx_r0.people.name(b_r5.created_by), " prepared this batch, so a different finance approver must approve it.");
  }
}
function PayoutsTab_Conditional_10_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r5 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Approved by ", ctx_r0.people.name(b_r5.approved_by), ". Submit to send the pending payments to the payment provider.");
  }
}
function PayoutsTab_Conditional_10_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 33);
    \u0275\u0275text(1, "Some payments didn't go through. Fix the farmer's payment details if needed, then retry each failed line.");
    \u0275\u0275elementEnd();
  }
}
function PayoutsTab_Conditional_10_For_28_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "day");
  }
  if (rf & 2) {
    const l_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" Paid ", \u0275\u0275pipeBind2(1, 1, l_r6.paid_at, true), " ");
  }
}
function PayoutsTab_Conditional_10_For_28_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const l_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", l_r6.failure_reason, " ");
  }
}
function PayoutsTab_Conditional_10_For_28_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275text(1, "Will be paid on submit");
    \u0275\u0275elementEnd();
  }
}
function PayoutsTab_Conditional_10_For_28_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", l_r6.attempts, " attempts");
  }
}
function PayoutsTab_Conditional_10_For_28_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function PayoutsTab_Conditional_10_For_28_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const l_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.retry(l_r6));
    });
    \u0275\u0275element(1, "vc-icon", 42);
    \u0275\u0275text(2, "Retry");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r0.busy());
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function PayoutsTab_Conditional_10_For_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 16)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275element(7, "vc-badge", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 37);
    \u0275\u0275conditionalCreate(9, PayoutsTab_Conditional_10_For_28_Conditional_9_Template, 2, 4)(10, PayoutsTab_Conditional_10_For_28_Conditional_10_Template, 1, 1)(11, PayoutsTab_Conditional_10_For_28_Conditional_11_Template, 2, 0, "span", 38);
    \u0275\u0275conditionalCreate(12, PayoutsTab_Conditional_10_For_28_Conditional_12_Template, 2, 1, "span", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 39);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 16);
    \u0275\u0275conditionalCreate(16, PayoutsTab_Conditional_10_For_28_Conditional_16_Template, 3, 2, "button", 40);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const l_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(l_r6.farmer_name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.m(l_r6.amount));
    \u0275\u0275advance(2);
    \u0275\u0275property("status", l_r6.status);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(l_r6.status === "paid" ? 9 : l_r6.failure_reason ? 10 : 11);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(l_r6.attempts > 1 ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(l_r6.provider_ref || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(l_r6.status === "failed" && ctx_r0.canRun ? 16 : -1);
  }
}
function PayoutsTab_Conditional_10_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 35);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r0.actionError());
  }
}
function PayoutsTab_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "vcx-steps", 25);
    \u0275\u0275elementStart(2, "div", 26);
    \u0275\u0275element(3, "vc-stat", 27)(4, "vc-stat", 28)(5, "vc-stat", 29)(6, "vc-stat", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, PayoutsTab_Conditional_10_Conditional_7_Template, 2, 1, "vc-callout", 31)(8, PayoutsTab_Conditional_10_Conditional_8_Template, 2, 1, "vc-callout", 32)(9, PayoutsTab_Conditional_10_Conditional_9_Template, 2, 0, "vc-callout", 33);
    \u0275\u0275elementStart(10, "div", 2)(11, "div", 6)(12, "table", 15)(13, "thead")(14, "tr")(15, "th");
    \u0275\u0275text(16, "Farmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 16);
    \u0275\u0275text(18, "Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Provider ref");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "tbody");
    \u0275\u0275repeaterCreate(27, PayoutsTab_Conditional_10_For_28_Template, 17, 7, "tr", null, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "tfoot")(30, "tr")(31, "td")(32, "strong");
    \u0275\u0275text(33, "Total");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "td", 16)(35, "strong");
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "td", 34);
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275conditionalCreate(39, PayoutsTab_Conditional_10_Conditional_39_Template, 1, 1, "vc-error", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r5 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("steps", ctx_r0.steps)("current", ctx_r0.stepOf(b_r5.status))("offPath", \u0275\u0275pureFunction0(15, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.m(b_r5.total_amount))("accent", true);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.m(b_r5.paid_amount))("hint", ctx_r0.plural(b_r5.counts["paid"] ?? 0, "farmer"));
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.m(ctx_r0.sumBy(b_r5, "on_hold")))("hint", ctx_r0.plural(b_r5.counts["on_hold"] ?? 0, "farmer") + " \xB7 carried forward");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.m(ctx_r0.sumBy(b_r5, "failed")))("hint", (b_r5.counts["failed"] ?? 0) + " to retry");
    \u0275\u0275advance();
    \u0275\u0275conditional(b_r5.status === "draft" ? 7 : b_r5.status === "approved" ? 8 : b_r5.status === "partially_failed" ? 9 : -1);
    \u0275\u0275advance(20);
    \u0275\u0275repeater(b_r5.lines ?? \u0275\u0275pureFunction0(16, _c0));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.m(b_r5.total_amount));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", b_r5.lines?.length, " lines");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actionError() ? 39 : -1);
  }
}
function PayoutsTab_Conditional_12_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 45);
    \u0275\u0275text(1, "You prepared this batch \u2014 a colleague must approve it.");
    \u0275\u0275elementEnd();
  }
}
function PayoutsTab_Conditional_12_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function PayoutsTab_Conditional_12_Conditional_0_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const b_r9 = \u0275\u0275nextContext(2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.approve(b_r9));
    });
    \u0275\u0275element(1, "vc-icon", 46);
    \u0275\u0275text(2, "Approve batch");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r0.busy());
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function PayoutsTab_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PayoutsTab_Conditional_12_Conditional_0_Conditional_0_Template, 2, 0, "span", 45)(1, PayoutsTab_Conditional_12_Conditional_0_Conditional_1_Template, 3, 2, "button", 43);
  }
  if (rf & 2) {
    const b_r9 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(b_r9.created_by === ctx_r0.me ? 0 : 1);
  }
}
function PayoutsTab_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function PayoutsTab_Conditional_12_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.confirmSubmit.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 47);
    \u0275\u0275text(2, "Submit for payment");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.busy());
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function PayoutsTab_Conditional_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function PayoutsTab_Conditional_12_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.detail.set(null));
    });
    \u0275\u0275text(1, "Close");
    \u0275\u0275elementEnd();
  }
}
function PayoutsTab_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PayoutsTab_Conditional_12_Conditional_0_Template, 2, 1);
    \u0275\u0275conditionalCreate(1, PayoutsTab_Conditional_12_Conditional_1_Template, 3, 2, "button", 43);
    \u0275\u0275conditionalCreate(2, PayoutsTab_Conditional_12_Conditional_2_Template, 2, 0, "button", 44);
  }
  if (rf & 2) {
    const b_r9 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(b_r9.status === "draft" && ctx_r0.canApprove ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(b_r9.status === "approved" && ctx_r0.canRun ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(b_r9.status !== "draft" && b_r9.status !== "approved" ? 2 : -1);
  }
}
var PayoutsTab = class _PayoutsTab {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  people = inject(PeopleDirectory);
  canApprove = this.auth.can("payout.approve");
  canRun = this.auth.can("payout.prepare", "payout.approve");
  me = this.auth.profile()?.id;
  openId = input(
    null,
    ...ngDevMode ? [{ debugName: "openId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  steps = ["draft", "approved", "submitted", "completed"];
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
  actionError = signal(
    null,
    ...ngDevMode ? [{ debugName: "actionError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  confirmSubmit = signal(
    false,
    ...ngDevMode ? [{ debugName: "confirmSubmit" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pendingCount = computed(
    () => (this.detail()?.lines ?? []).filter((l) => l.status === "pending").length,
    ...ngDevMode ? [{ debugName: "pendingCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pendingSum = computed(
    () => (this.detail()?.lines ?? []).filter((l) => l.status === "pending").reduce((a, l) => a + Number(l.amount), 0),
    ...ngDevMode ? [{ debugName: "pendingSum" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.people.load();
    this.load();
    effect(() => {
      const id = this.openId();
      if (id)
        this.open(id);
    });
  }
  load() {
    this.loading.set(true);
    this.api.get("/payout-batches").subscribe({
      next: (r) => {
        this.batches.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  m(v) {
    return money(v);
  }
  plural(n, w) {
    return `${n} ${w}${n === 1 ? "" : "s"}`;
  }
  stepOf(s) {
    return s === "partially_failed" ? "submitted" : s;
  }
  sumBy(b, st) {
    return (b.lines ?? []).filter((l) => l.status === st).reduce((a, l) => a + Number(l.amount), 0);
  }
  countList(b) {
    const L = { paid: "paid", pending: "pending", on_hold: "on hold", failed: "failed" };
    return Object.entries(b.counts).filter(([, n]) => n).map(([k, n]) => ({ k, n, label: L[k] ?? k }));
  }
  open(id) {
    this.actionError.set(null);
    this.detailLoading.set(true);
    this.api.get(`/payout-batches/${id}`).subscribe({
      next: (b) => {
        this.detail.set(b);
        this.detailLoading.set(false);
      },
      error: (e) => {
        this.detailLoading.set(false);
        this.toast.apiError(e, "Couldn't open the batch");
      }
    });
  }
  after(b, msg) {
    this.busy.set(false);
    this.detail.set(b);
    this.toast.success(msg);
    this.load();
  }
  fail = (e) => {
    this.busy.set(false);
    this.actionError.set(e.code === "SELF_APPROVAL_REJECTED" ? `${e.message} Payout batches always need a second person.` : e.message);
  };
  approve(b) {
    this.busy.set(true);
    this.api.post(`/payout-batches/${b.id}/approve`).subscribe({ next: (nb) => this.after(nb, `${nb.code} approved`), error: this.fail });
  }
  submit() {
    const b = this.detail();
    if (!b)
      return;
    this.busy.set(true);
    this.confirmSubmit.set(false);
    this.api.post(`/payout-batches/${b.id}/submit`).subscribe({
      next: (nb) => this.after(nb, nb.status === "completed" ? `${nb.code}: all payments sent` : `${nb.code}: some payments failed \u2014 see the lines`),
      error: this.fail
    });
  }
  retry(l) {
    this.busy.set(true);
    this.api.post(`/payouts/${l.id}/retry`).subscribe({
      next: (nb) => this.after(nb, (nb.lines ?? []).find((x) => x.id === l.id)?.status === "paid" ? `Paid ${l.farmer_name}` : `Retry for ${l.farmer_name} failed again`),
      error: this.fail
    });
  }
  static \u0275fac = function PayoutsTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PayoutsTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PayoutsTab, selectors: [["vcx-payouts-tab"]], inputs: { openId: [1, "openId"] }, decls: 26, vars: 14, consts: [[1, "bar"], [1, "muted"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "wallet", "title", "No payout batches yet", "text", "Approve a benefit pool, then create its payout batch from the Benefit pools tab."], [1, "table-wrap"], ["width", "min(900px, 100vw)", 3, "closed", "open", "drawer", "title", "subtitle"], [1, "stack"], ["footer", ""], ["title", "Send payments now?", "width", "480px", 3, "openChange", "open", "subtitle"], [1, "muted", "small", 2, "margin-top", "10px"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["title", "Couldn't load payout batches", 3, "message"], [1, "table"], [1, "num"], [1, "clickable"], [1, "clickable", 3, "click"], [1, "mono", "strong"], [3, "steps", "current", "compact", "offPath"], ["status", "partially_failed", 2, "margin-top", "4px"], [1, "counts", "small"], [1, "cnt", 3, "class"], [1, "cnt"], [3, "steps", "current", "offPath"], [1, "grid", "grid-4"], ["label", "Batch total", 3, "value", "accent"], ["label", "Paid", 3, "value", "hint"], ["label", "On hold", 3, "value", "hint"], ["label", "Failed", 3, "value", "hint"], ["tone", "info", "icon", "shield"], ["tone", "ok", "icon", "check-circle"], ["tone", "warn", "icon", "alert"], ["colspan", "4", 1, "subtle", "small"], ["title", "Not done", 3, "message"], [3, "status"], [1, "small", "reason"], [1, "subtle"], [1, "mono", "small", "nowrap"], [1, "btn", "btn-secondary", "btn-sm", 3, "disabled"], [1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], ["name", "refresh", 3, "size"], [1, "btn", "btn-primary", 3, "disabled"], [1, "btn", "btn-ghost"], [1, "self", "small"], ["name", "check", 3, "size"], ["name", "send", 3, "size"]], template: function PayoutsTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "p", 1);
      \u0275\u0275text(2, "Payout batches pay each farmer their entitlement. A batch is prepared by one person and approved by another before it is sent. Payments are idempotent \u2014 a farmer is never paid twice.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(3, "section", 2);
      \u0275\u0275conditionalCreate(4, PayoutsTab_Conditional_4_Template, 1, 1, "vc-loading", 3)(5, PayoutsTab_Conditional_5_Template, 2, 1, "div", 4)(6, PayoutsTab_Conditional_6_Template, 1, 0, "vc-empty", 5)(7, PayoutsTab_Conditional_7_Template, 19, 0, "div", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "vc-modal", 7);
      \u0275\u0275listener("closed", function PayoutsTab_Template_vc_modal_closed_8_listener() {
        ctx.detail.set(null);
        return ctx.detailLoading.set(false);
      });
      \u0275\u0275conditionalCreate(9, PayoutsTab_Conditional_9_Template, 1, 1, "vc-loading", 3);
      \u0275\u0275conditionalCreate(10, PayoutsTab_Conditional_10_Template, 40, 17, "div", 8);
      \u0275\u0275elementContainerStart(11, 9);
      \u0275\u0275conditionalCreate(12, PayoutsTab_Conditional_12_Template, 3, 3);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "vc-modal", 10);
      \u0275\u0275twoWayListener("openChange", function PayoutsTab_Template_vc_modal_openChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.confirmSubmit, $event) || (ctx.confirmSubmit = $event);
        return $event;
      });
      \u0275\u0275elementStart(14, "p");
      \u0275\u0275text(15);
      \u0275\u0275elementStart(16, "strong");
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275text(18, " will be sent to farmers' verified UPI or bank accounts. Lines on hold are not paid.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "p", 11);
      \u0275\u0275text(20, "This can't be undone. Each payment carries its own idempotency key, so retrying never pays twice.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(21, 9);
      \u0275\u0275elementStart(22, "button", 12);
      \u0275\u0275listener("click", function PayoutsTab_Template_button_click_22_listener() {
        return ctx.confirmSubmit.set(false);
      });
      \u0275\u0275text(23, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "button", 13);
      \u0275\u0275listener("click", function PayoutsTab_Template_button_click_24_listener() {
        return ctx.submit();
      });
      \u0275\u0275text(25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_6_0;
      let tmp_7_0;
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.loading() ? 4 : ctx.error() ? 5 : !ctx.batches().length ? 6 : 7);
      \u0275\u0275advance(4);
      \u0275\u0275property("open", !!ctx.detail() || ctx.detailLoading())("drawer", true)("title", ctx.detail() ? "Payout batch " + ctx.detail().code : "Payout batch")("subtitle", ctx.detail() ? "Prepared by " + ctx.people.name(ctx.detail().created_by) : "");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.detailLoading() && !ctx.detail() ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_6_0 = ctx.detail()) ? 10 : -1, tmp_6_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_7_0 = ctx.detail()) ? 12 : -1, tmp_7_0);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.confirmSubmit);
      \u0275\u0275property("subtitle", ctx.detail()?.code ?? "");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.pendingCount(), " payments totalling ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.m(ctx.pendingSum()));
      \u0275\u0275advance(7);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1("Send ", ctx.pendingCount(), " payments");
    }
  }, dependencies: [Icon, Badge, Stat, Empty, Loading, ErrorBox, Callout, Modal, Steps, DayPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  margin-bottom: 18px;\n}\n.bar[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 760px;\n}\n.strong[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.counts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.cnt[_ngcontent-%COMP%] {\n  padding: 1px 8px;\n  border-radius: 999px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-700);\n  white-space: nowrap;\n}\n.cnt.t-paid[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.cnt.t-failed[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.cnt.t-on_hold[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.reason[_ngcontent-%COMP%] {\n  max-width: 300px;\n  color: var(--%NS%text-2);\n}\ntfoot[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 14px;\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n}\n.self[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n  margin-right: auto;\n}\nvc-stat[_ngcontent-%COMP%] {\n  box-shadow: none;\n}\n/*# sourceMappingURL=payouts.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PayoutsTab, [{
    type: Component,
    args: [{ selector: "vcx-payouts-tab", imports: [...KIT, DayPipe, Steps], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <p class="muted">Payout batches pay each farmer their entitlement. A batch is prepared by one person and approved by another before it is sent. Payments are idempotent \u2014 a farmer is never paid twice.</p>
    </div>

    <section class="card">
      @if (loading()) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load payout batches" [message]="error()!" /></div> }
      @else if (!batches().length) {
        <vc-empty icon="wallet" title="No payout batches yet" text="Approve a benefit pool, then create its payout batch from the Benefit pools tab." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Batch</th><th>Progress</th><th class="num">Total</th><th class="num">Paid</th><th>Lines</th><th>Prepared by</th></tr></thead>
            <tbody>
              @for (b of batches(); track b.id) {
                <tr class="clickable" (click)="open(b.id)">
                  <td class="mono strong">{{ b.code }}</td>
                  <td><vcx-steps [steps]="steps" [current]="stepOf(b.status)" [compact]="true" [offPath]="[]" />
                    @if (b.status === 'partially_failed') { <vc-badge status="partially_failed" style="margin-top:4px" /> }</td>
                  <td class="num">{{ m(b.total_amount) }}</td>
                  <td class="num"><strong>{{ m(b.paid_amount) }}</strong></td>
                  <td class="counts small">
                    @for (c of countList(b); track c.k) { <span class="cnt" [class]="'t-' + c.k">{{ c.n }} {{ c.label }}</span> }
                  </td>
                  <td>{{ people.name(b.created_by) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [open]="!!detail() || detailLoading()" (closed)="detail.set(null); detailLoading.set(false)" [drawer]="true" width="min(900px, 100vw)"
      [title]="detail() ? 'Payout batch ' + detail()!.code : 'Payout batch'" [subtitle]="detail() ? 'Prepared by ' + people.name(detail()!.created_by) : ''">
      @if (detailLoading() && !detail()) { <vc-loading [rows]="8" /> }
      @if (detail(); as b) {
        <div class="stack">
          <vcx-steps [steps]="steps" [current]="stepOf(b.status)" [offPath]="[]" />
          <div class="grid grid-4">
            <vc-stat label="Batch total" [value]="m(b.total_amount)" [accent]="true" />
            <vc-stat label="Paid" [value]="m(b.paid_amount)" [hint]="plural(b.counts['paid'] ?? 0, 'farmer')" />
            <vc-stat label="On hold" [value]="m(sumBy(b, 'on_hold'))" [hint]="plural(b.counts['on_hold'] ?? 0, 'farmer') + ' \xB7 carried forward'" />
            <vc-stat label="Failed" [value]="m(sumBy(b, 'failed'))" [hint]="(b.counts['failed'] ?? 0) + ' to retry'" />
          </div>
          @if (b.status === 'draft') {
            <vc-callout tone="info" icon="shield">Waiting for approval. {{ people.name(b.created_by) }} prepared this batch, so a different finance approver must approve it.</vc-callout>
          } @else if (b.status === 'approved') {
            <vc-callout tone="ok" icon="check-circle">Approved by {{ people.name(b.approved_by) }}. Submit to send the pending payments to the payment provider.</vc-callout>
          } @else if (b.status === 'partially_failed') {
            <vc-callout tone="warn" icon="alert">Some payments didn't go through. Fix the farmer's payment details if needed, then retry each failed line.</vc-callout>
          }
          <div class="card">
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Farmer</th><th class="num">Amount</th><th>Status</th><th>Details</th><th>Provider ref</th><th></th></tr></thead>
                <tbody>
                  @for (l of b.lines ?? []; track l.id) {
                    <tr>
                      <td>{{ l.farmer_name }}</td>
                      <td class="num"><strong>{{ m(l.amount) }}</strong></td>
                      <td><vc-badge [status]="l.status" /></td>
                      <td class="small reason">
                        @if (l.status === 'paid') { Paid {{ l.paid_at | day: true }} }
                        @else if (l.failure_reason) { {{ l.failure_reason }} }
                        @else { <span class="subtle">Will be paid on submit</span> }
                        @if (l.attempts > 1) { <span class="subtle"> \xB7 {{ l.attempts }} attempts</span> }
                      </td>
                      <td class="mono small nowrap">{{ l.provider_ref || '\u2014' }}</td>
                      <td class="num">
                        @if (l.status === 'failed' && canRun) { <button class="btn btn-secondary btn-sm" [disabled]="busy()" (click)="retry(l)"><vc-icon name="refresh" [size]="13" />Retry</button> }
                      </td>
                    </tr>
                  }
                </tbody>
                <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong>{{ m(b.total_amount) }}</strong></td><td colspan="4" class="subtle small">{{ b.lines?.length }} lines</td></tr></tfoot>
              </table>
            </div>
          </div>
          @if (actionError()) { <vc-error title="Not done" [message]="actionError()!" /> }
        </div>
      }
      <ng-container footer>
        @if (detail(); as b) {
          @if (b.status === 'draft' && canApprove) {
            @if (b.created_by === me) {
              <span class="self small">You prepared this batch \u2014 a colleague must approve it.</span>
            } @else {
              <button class="btn btn-primary" [disabled]="busy()" (click)="approve(b)"><vc-icon name="check" [size]="15" />Approve batch</button>
            }
          }
          @if (b.status === 'approved' && canRun) {
            <button class="btn btn-primary" [disabled]="busy()" (click)="confirmSubmit.set(true)"><vc-icon name="send" [size]="15" />Submit for payment</button>
          }
          @if (b.status !== 'draft' && b.status !== 'approved') { <button class="btn btn-ghost" (click)="detail.set(null)">Close</button> }
        }
      </ng-container>
    </vc-modal>

    <vc-modal [(open)]="confirmSubmit" title="Send payments now?" width="480px" [subtitle]="detail()?.code ?? ''">
      <p>{{ pendingCount() }} payments totalling <strong>{{ m(pendingSum()) }}</strong> will be sent to farmers' verified UPI or bank accounts.
        Lines on hold are not paid.</p>
      <p class="muted small" style="margin-top:10px">This can't be undone. Each payment carries its own idempotency key, so retrying never pays twice.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="confirmSubmit.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="submit()">Send {{ pendingCount() }} payments</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;339c731bae612ff1;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\benefits\\payouts.tab.ts */\n.bar {\n  margin-bottom: 18px;\n}\n.bar p {\n  max-width: 760px;\n}\n.strong {\n  font-weight: 600;\n}\n.counts {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.cnt {\n  padding: 1px 8px;\n  border-radius: 999px;\n  background: var(--stone-100);\n  color: var(--stone-700);\n  white-space: nowrap;\n}\n.cnt.t-paid {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.cnt.t-failed {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.cnt.t-on_hold {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.reason {\n  max-width: 300px;\n  color: var(--text-2);\n}\ntfoot td {\n  padding: 12px 14px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n}\n.self {\n  color: var(--amber-600);\n  margin-right: auto;\n}\nvc-stat {\n  box-shadow: none;\n}\n/*# sourceMappingURL=payouts.tab.css.map */\n"] }]
  }], () => [], { openId: [{ type: Input, args: [{ isSignal: true, alias: "openId", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PayoutsTab, { className: "PayoutsTab", filePath: "src/app/features/benefits/payouts.tab.ts", lineNumber: 137 });
})();

// src/app/features/benefits/pools.tab.ts
var _c02 = () => [];
var _forTrack02 = ($index, $item) => $item.id;
function PoolsTab_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function PoolsTab_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 19);
    \u0275\u0275text(2, "New pool from a sale");
    \u0275\u0275elementEnd();
  }
}
function PoolsTab_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function PoolsTab_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "vc-error", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function PoolsTab_Conditional_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function PoolsTab_Conditional_8_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 19);
    \u0275\u0275text(2, "New pool from a sale");
    \u0275\u0275elementEnd();
  }
}
function PoolsTab_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 7);
    \u0275\u0275conditionalCreate(1, PoolsTab_Conditional_8_Conditional_1_Template, 3, 0, "button", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canPrepare ? 1 : -1);
  }
}
function PoolsTab_Conditional_9_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 24);
    \u0275\u0275listener("click", function PoolsTab_Conditional_9_For_22_Template_tr_click_0_listener() {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPool(p_r5.id));
    });
    \u0275\u0275elementStart(1, "td", 25);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 22);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 26);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 22)(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 22);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275element(15, "vc-badge", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 28);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "day");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.breakdown.sale_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.m(p_r5.gross_amount, p_r5.currency));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u2212 ", ctx_r1.m(p_r5.deductions_amount, p_r5.currency));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.m(p_r5.farmer_pool_amount, p_r5.currency));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.breakdown.farmers);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("v", p_r5.breakdown.rule_version, " \xB7 ", p_r5.breakdown.farmer_share_pct, "%");
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r5.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 9, p_r5.created_at));
  }
}
function PoolsTab_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "table", 21)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Sale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 22);
    \u0275\u0275text(7, "Gross");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 22);
    \u0275\u0275text(9, "Deductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 22);
    \u0275\u0275text(11, "Farmer pool");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 22);
    \u0275\u0275text(13, "Farmers");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Rule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Created");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "tbody");
    \u0275\u0275repeaterCreate(21, PoolsTab_Conditional_9_For_22_Template, 19, 11, "tr", 23, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(21);
    \u0275\u0275repeater(ctx_r1.pools());
  }
}
function PoolsTab_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function PoolsTab_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 10);
  }
}
function PoolsTab_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 30)(1, "input", 31);
    \u0275\u0275listener("change", function PoolsTab_Conditional_13_For_2_Template_input_change_1_listener() {
      const s_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.pick.set(s_r7.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 32)(3, "strong", 33);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 34);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "strong", 22);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.pick() === s_r7.id);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.pick() === s_r7.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r7.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", s_r7.buyer_name, " \xB7 ", \u0275\u0275pipeBind2(7, 8, s_r7.quantity, 2), " t \xB7 vintage ", s_r7.vintage);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.m(s_r7.total_amount, s_r7.currency));
  }
}
function PoolsTab_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275repeaterCreate(1, PoolsTab_Conditional_13_For_2_Template, 10, 11, "label", 29, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.eligible());
  }
}
function PoolsTab_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 12);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.createError());
  }
}
function PoolsTab_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function PoolsTab_Conditional_22_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 22);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r8 = ctx.$implicit;
    const p_r9 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("\u2212 ", d_r8.name, " (", d_r8.pct, "%)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u2212 ", ctx_r1.m(d_r8.amount, p_r9.currency));
  }
}
function PoolsTab_Conditional_22_For_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 46);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 22);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 22);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 22);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 22)(14, "strong");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const e_r10 = ctx.$implicit;
    const p_r9 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r10.farmer_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((e_r10.inputs.fields ?? \u0275\u0275pureFunction0(12, _c02)).join(", "));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 6, e_r10.inputs.area_ha, 2), " ha");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(e_r10.inputs.practices ?? 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(12, 9, (e_r10.inputs.share ?? 0) * 100, 2), "%");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.m(e_r10.amount, p_r9.currency));
  }
}
function PoolsTab_Conditional_22_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 45);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r1.actionError());
  }
}
function PoolsTab_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 35);
    \u0275\u0275element(2, "vc-badge", 27)(3, "vc-dc", 36);
    \u0275\u0275elementStart(4, "span", 37);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "section", 4)(8, "div", 38)(9, "h3");
    \u0275\u0275text(10, "From sale value to farmer pool");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 6);
    \u0275\u0275element(12, "vc-chart", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 40)(14, "div", 41)(15, "span");
    \u0275\u0275text(16, "Gross sale value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 22);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(19, PoolsTab_Conditional_22_For_20_Template, 5, 3, "div", 42, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementStart(21, "div", 41)(22, "span");
    \u0275\u0275text(23, "Net after deductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 22);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 42)(27, "span");
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 22);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 43)(32, "span");
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 22);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(36, "section", 4)(37, "div", 38)(38, "h3");
    \u0275\u0275text(39, "Entitlements");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span", 37);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 8)(43, "table", 21)(44, "thead")(45, "tr")(46, "th");
    \u0275\u0275text(47, "Farmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "th");
    \u0275\u0275text(49, "Fields");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "th", 22);
    \u0275\u0275text(51, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "th", 22);
    \u0275\u0275text(53, "Practices");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "th", 22);
    \u0275\u0275text(55, "Share");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "th", 22);
    \u0275\u0275text(57, "Amount");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(58, "tbody");
    \u0275\u0275repeaterCreate(59, PoolsTab_Conditional_22_For_60_Template, 16, 13, "tr", null, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "tfoot")(62, "tr")(63, "td", 44)(64, "strong");
    \u0275\u0275text(65, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "span", 37);
    \u0275\u0275text(67);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(68, "td", 22)(69, "strong");
    \u0275\u0275text(70);
    \u0275\u0275elementEnd()()()()()()();
    \u0275\u0275conditionalCreate(71, PoolsTab_Conditional_22_Conditional_71_Template, 1, 1, "vc-error", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r9 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r9.status);
    \u0275\u0275advance();
    \u0275\u0275property("cls", p_r9.data_class);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(6, 16, p_r9.breakdown.quantity_t, 3), " t \xD7 ", ctx_r1.m(p_r9.breakdown.unit_price ?? "0", p_r9.currency), " per tonne");
    \u0275\u0275advance(7);
    \u0275\u0275property("option", ctx_r1.waterfall());
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.m(p_r9.gross_amount, p_r9.currency));
    \u0275\u0275advance();
    \u0275\u0275repeater(p_r9.breakdown.deductions ?? \u0275\u0275pureFunction0(19, _c02));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.m(p_r9.breakdown.net_after_deductions ?? "0", p_r9.currency));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Retained by the programme (", 100 - (p_r9.breakdown.farmer_share_pct ?? 0), "%)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u2212 ", ctx_r1.m(ctx_r1.retained(p_r9), p_r9.currency));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Farmer pool (", p_r9.breakdown.farmer_share_pct, "%)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.m(p_r9.farmer_pool_amount, p_r9.currency));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", p_r9.entitlements?.length, " farmers \xB7 weights ", ctx_r1.weightsText(p_r9));
    \u0275\u0275advance(18);
    \u0275\u0275repeater(p_r9.entitlements ?? \u0275\u0275pureFunction0(20, _c02));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("\u2014 ", p_r9.breakdown.rounding);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.m(ctx_r1.entSum(p_r9), p_r9.currency));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.actionError() ? 71 : -1);
  }
}
function PoolsTab_Conditional_24_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function PoolsTab_Conditional_24_Conditional_0_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const p_r12 = \u0275\u0275nextContext(2);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.approve(p_r12));
    });
    \u0275\u0275element(1, "vc-icon", 50);
    \u0275\u0275text(2, "Approve pool");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r1.busy());
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function PoolsTab_Conditional_24_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1, "Four-eyes rule: the person who calculated the pool can't approve it.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, PoolsTab_Conditional_24_Conditional_0_Conditional_2_Template, 3, 2, "button", 49);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canApprove ? 2 : -1);
  }
}
function PoolsTab_Conditional_24_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 51);
    \u0275\u0275listener("click", function PoolsTab_Conditional_24_Conditional_1_Template_button_click_2_listener() {
      const pb_r14 = \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.detail.set(null);
      return \u0275\u0275resetView(ctx_r1.batchCreated.emit(pb_r14));
    });
    \u0275\u0275element(3, "vc-icon", 52);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pb_r14 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Payout batch ", pb_r14.code, " was prepared from this pool.");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Open ", pb_r14.code);
  }
}
function PoolsTab_Conditional_24_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1, "Approved. Prepare the payout batch to pay each farmer.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 15);
    \u0275\u0275listener("click", function PoolsTab_Conditional_24_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r15);
      const p_r12 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.makeBatch(p_r12));
    });
    \u0275\u0275element(3, "vc-icon", 52);
    \u0275\u0275text(4, "Create payout batch");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.busy());
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function PoolsTab_Conditional_24_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function PoolsTab_Conditional_24_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.detail.set(null));
    });
    \u0275\u0275text(1, "Close");
    \u0275\u0275elementEnd();
  }
}
function PoolsTab_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PoolsTab_Conditional_24_Conditional_0_Template, 3, 1)(1, PoolsTab_Conditional_24_Conditional_1_Template, 5, 3)(2, PoolsTab_Conditional_24_Conditional_2_Template, 5, 2)(3, PoolsTab_Conditional_24_Conditional_3_Template, 2, 0, "button", 47);
  }
  if (rf & 2) {
    let tmp_2_0;
    const p_r12 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(p_r12.status === "calculated" ? 0 : (tmp_2_0 = ctx_r1.batchFor(p_r12)) ? 1 : p_r12.status === "approved" && ctx_r1.canPrepare ? 2 : 3, tmp_2_0);
  }
}
var PoolsTab = class _PoolsTab {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  canPrepare = this.auth.can("payout.prepare");
  canApprove = this.auth.can("payout.approve");
  batchCreated = output();
  openId = input(
    null,
    ...ngDevMode ? [{ debugName: "openId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pools = signal(
    [],
    ...ngDevMode ? [{ debugName: "pools" }] : (
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
  sales = signal(
    [],
    ...ngDevMode ? [{ debugName: "sales" }] : (
      /* istanbul ignore next */
      []
    )
  );
  salesLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "salesLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pick = signal(
    null,
    ...ngDevMode ? [{ debugName: "pick" }] : (
      /* istanbul ignore next */
      []
    )
  );
  createError = signal(
    null,
    ...ngDevMode ? [{ debugName: "createError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eligible = computed(
    () => {
      const used = new Set(this.pools().map((p) => p.sale_id));
      return this.sales().filter((s) => (s.status === "delivered" || s.status === "retired") && !used.has(s.id));
    },
    ...ngDevMode ? [{ debugName: "eligible" }] : (
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
  actionError = signal(
    null,
    ...ngDevMode ? [{ debugName: "actionError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  waterfall = computed(
    () => {
      const p = this.detail();
      if (!p)
        return {};
      const gross = Number(p.gross_amount);
      const steps = [{ name: "Gross sale", value: gross, kind: "total" }];
      let run = gross;
      for (const d of p.breakdown.deductions ?? []) {
        steps.push({ name: d.name, value: Number(d.amount), kind: "minus" });
        run -= Number(d.amount);
      }
      steps.push({ name: "Net", value: run, kind: "total" });
      const retained = run - Number(p.farmer_pool_amount);
      steps.push({ name: "Programme share", value: retained, kind: "minus" });
      steps.push({ name: "Farmer pool", value: Number(p.farmer_pool_amount), kind: "total" });
      const base = [];
      let level = gross;
      for (const s of steps) {
        if (s.kind === "total") {
          base.push(0);
          level = s.value;
        } else {
          level -= s.value;
          base.push(level);
        }
      }
      const fmt = (v) => money(v, p.currency).replace(/\.00$/, "");
      return {
        grid: { left: 8, right: 8, top: 24, bottom: 8, containLabel: true },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (ps) => `${steps[ps[0].dataIndex].name}<br/><b>${steps[ps[0].dataIndex].kind === "minus" ? "\u2212 " : ""}${fmt(steps[ps[0].dataIndex].value)}</b>`
        },
        xAxis: { type: "category", data: steps.map((s) => s.name), axisLabel: { interval: 0, fontSize: 11, width: 90, overflow: "break" } },
        yAxis: { type: "value", axisLabel: { formatter: (v) => v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : `${v}` } },
        series: [
          { type: "bar", stack: "w", data: base, itemStyle: { color: "transparent" }, emphasis: { disabled: true }, tooltip: { show: false } },
          {
            type: "bar",
            stack: "w",
            barMaxWidth: 56,
            data: steps.map((s, i) => ({ value: s.value, itemStyle: {
              color: i === steps.length - 1 ? "#275e3f" : s.kind === "minus" ? "#c76329" : "#86b797",
              borderRadius: [4, 4, 0, 0]
            } })),
            label: { show: true, position: "top", fontSize: 11, color: "#414b45", formatter: (x) => (steps[x.dataIndex].kind === "minus" ? "\u2212 " : "") + fmt(steps[x.dataIndex].value) }
          }
        ]
      };
    },
    ...ngDevMode ? [{ debugName: "waterfall" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.load();
  }
  ngOnInit() {
    const id = this.openId();
    if (id)
      this.openPool(id);
  }
  payoutBatches = signal(
    [],
    ...ngDevMode ? [{ debugName: "payoutBatches" }] : (
      /* istanbul ignore next */
      []
    )
  );
  batchFor(p) {
    return this.payoutBatches().find((b) => b.pool_id === p.id) ?? null;
  }
  load() {
    this.loading.set(true);
    this.api.get("/payout-batches").subscribe({ next: (b) => this.payoutBatches.set(b), error: () => {
    } });
    this.api.get("/benefit-pools").subscribe({
      next: (r) => {
        this.pools.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  m(v, c) {
    return money(v, c);
  }
  period(p) {
    const x = p.breakdown.period;
    return x ? `${x[0]} \u2013 ${x[1]}` : "\u2014";
  }
  retained(p) {
    return Number(p.breakdown.net_after_deductions ?? 0) - Number(p.farmer_pool_amount);
  }
  entSum(p) {
    return (p.entitlements ?? []).reduce((a, e) => a + Number(e.amount), 0);
  }
  weightsText(p) {
    const w = p.breakdown.weights_used ?? p.breakdown.weights ?? {};
    return Object.entries(w).map(([k, v]) => `${(WEIGHT_LABEL[k] ?? k).toLowerCase()} ${(v * 100).toFixed(0)}%`).join(", ");
  }
  openCreate() {
    this.createOpen.set(true);
    this.pick.set(null);
    this.createError.set(null);
    this.salesLoading.set(true);
    this.api.get("/sales").subscribe({
      next: (s) => {
        this.sales.set(s);
        this.salesLoading.set(false);
      },
      error: () => this.salesLoading.set(false)
    });
  }
  create() {
    this.busy.set(true);
    this.createError.set(null);
    this.api.post(`/sales/${this.pick()}/benefit-pool`).subscribe({
      next: (p) => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.toast.success("Benefit pool calculated", `${money(p.farmer_pool_amount, p.currency)} shared between ${p.breakdown.farmers} farmers.`);
        this.load();
        this.detail.set(p);
      },
      error: (e) => {
        this.busy.set(false);
        this.createError.set(e.message);
      }
    });
  }
  openPool(id) {
    this.actionError.set(null);
    this.detail.set(null);
    this.detailLoading.set(true);
    this.api.get(`/benefit-pools/${id}`).subscribe({
      next: (p) => {
        this.detail.set(p);
        this.detailLoading.set(false);
      },
      error: (e) => {
        this.detailLoading.set(false);
        this.toast.apiError(e, "Couldn't open the pool");
      }
    });
  }
  approve(p) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post(`/benefit-pools/${p.id}/approve`).subscribe({
      next: (np) => {
        this.busy.set(false);
        this.detail.set(np);
        this.toast.success("Pool approved");
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.actionError.set(e.code === "SELF_APPROVAL_REJECTED" ? `${e.message} A second finance approver must sign off every pool.` : e.message);
      }
    });
  }
  makeBatch(p) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post(`/benefit-pools/${p.id}/payout-batch`).subscribe({
      next: (b) => {
        this.busy.set(false);
        this.detail.set(null);
        this.toast.success(`Payout batch ${b.code} prepared`, "It needs approval before it can be sent.");
        this.batchCreated.emit(b);
      },
      error: (e) => {
        this.busy.set(false);
        this.actionError.set(e.message);
      }
    });
  }
  static \u0275fac = function PoolsTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PoolsTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PoolsTab, selectors: [["vcx-pools-tab"]], inputs: { openId: [1, "openId"] }, outputs: { batchCreated: "batchCreated" }, decls: 25, vars: 13, consts: [[1, "bar"], [1, "muted"], [1, "spacer"], [1, "btn", "btn-primary"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "hand-coins", "title", "No benefit pools yet", "text", "When credits are delivered to a buyer, create a pool from that sale to work out each farmer's share."], [1, "table-wrap"], ["title", "New benefit pool", "subtitle", "Choose a delivered sale. The current approved rule for its programme is applied.", "width", "600px", 3, "openChange", "open"], ["icon", "send", "title", "No delivered sales waiting", "text", "Every delivered sale already has a pool, or no sale has been delivered yet."], [1, "opts"], ["title", "Couldn't create the pool", 2, "margin-top", "12px", 3, "message"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["width", "min(920px, 100vw)", 3, "closed", "open", "drawer", "title", "subtitle"], [1, "stack"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["title", "Couldn't load benefit pools", 3, "message"], [1, "table"], [1, "num"], [1, "clickable"], [1, "clickable", 3, "click"], [1, "mono", "strong"], [1, "num", "muted"], [3, "status"], [1, "subtle"], [1, "opt", 3, "on"], [1, "opt"], ["type", "radio", "name", "sale", 3, "change", "checked"], [1, "ob"], [1, "mono"], [1, "small", "muted"], [1, "row", "wrap"], [3, "cls"], [1, "subtle", "small"], [1, "card-head"], ["height", "260px", 3, "option"], [1, "wf-table"], [1, "wl"], [1, "wl", "sub"], [1, "wl", "tot"], ["colspan", "5"], ["title", "Not done", 3, "message"], [1, "small", "mono"], [1, "btn", "btn-ghost"], [1, "subtle", "small", "grow"], [1, "btn", "btn-primary", 3, "disabled"], ["name", "check", 3, "size"], [1, "btn", "btn-secondary", 3, "click"], ["name", "wallet", 3, "size"]], template: function PoolsTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "p", 1);
      \u0275\u0275text(2, "A benefit pool sets aside the farmers' share of one delivered sale and splits it between enrolled farmers using the approved rule. Amounts are exact to the paisa.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "span", 2);
      \u0275\u0275conditionalCreate(4, PoolsTab_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "section", 4);
      \u0275\u0275conditionalCreate(6, PoolsTab_Conditional_6_Template, 1, 1, "vc-loading", 5)(7, PoolsTab_Conditional_7_Template, 2, 1, "div", 6)(8, PoolsTab_Conditional_8_Template, 2, 1, "vc-empty", 7)(9, PoolsTab_Conditional_9_Template, 23, 0, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "vc-modal", 9);
      \u0275\u0275twoWayListener("openChange", function PoolsTab_Template_vc_modal_openChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(11, PoolsTab_Conditional_11_Template, 1, 1, "vc-loading", 5)(12, PoolsTab_Conditional_12_Template, 1, 0, "vc-empty", 10)(13, PoolsTab_Conditional_13_Template, 3, 0, "div", 11);
      \u0275\u0275conditionalCreate(14, PoolsTab_Conditional_14_Template, 1, 1, "vc-error", 12);
      \u0275\u0275elementContainerStart(15, 13);
      \u0275\u0275elementStart(16, "button", 14);
      \u0275\u0275listener("click", function PoolsTab_Template_button_click_16_listener() {
        return ctx.createOpen.set(false);
      });
      \u0275\u0275text(17, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "button", 15);
      \u0275\u0275listener("click", function PoolsTab_Template_button_click_18_listener() {
        return ctx.create();
      });
      \u0275\u0275text(19, "Calculate pool");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "vc-modal", 16);
      \u0275\u0275listener("closed", function PoolsTab_Template_vc_modal_closed_20_listener() {
        ctx.detail.set(null);
        return ctx.detailLoading.set(false);
      });
      \u0275\u0275conditionalCreate(21, PoolsTab_Conditional_21_Template, 1, 1, "vc-loading", 5);
      \u0275\u0275conditionalCreate(22, PoolsTab_Conditional_22_Template, 72, 21, "div", 17);
      \u0275\u0275elementContainerStart(23, 13);
      \u0275\u0275conditionalCreate(24, PoolsTab_Conditional_24_Template, 4, 1);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_11_0;
      let tmp_12_0;
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canPrepare ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 6 : ctx.error() ? 7 : !ctx.pools().length ? 8 : 9);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.salesLoading() ? 11 : !ctx.eligible().length ? 12 : 13);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.createError() ? 14 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.pick() || ctx.busy());
      \u0275\u0275advance(2);
      \u0275\u0275property("open", !!ctx.detail() || ctx.detailLoading())("drawer", true)("title", ctx.detail() ? "Benefit pool \xB7 " + ctx.detail().breakdown.sale_code : "Benefit pool")("subtitle", ctx.detail() ? "Rule version " + ctx.detail().breakdown.rule_version + " \xB7 period " + ctx.period(ctx.detail()) : "");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.detailLoading() && !ctx.detail() ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_11_0 = ctx.detail()) ? 22 : -1, tmp_11_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_12_0 = ctx.detail()) ? 24 : -1, tmp_12_0);
    }
  }, dependencies: [Icon, Badge, DataClass, Empty, Loading, ErrorBox, Modal, Chart, NumPipe, DayPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 16px;\n  margin-bottom: 18px;\n}\n.bar[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 720px;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.strong[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.opts[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.opt[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 10px;\n  cursor: pointer;\n}\n.opt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n}\n.opt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n}\n.ob[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.wf-table[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--%NS%border);\n  padding: 8px 20px 14px;\n}\n.wl[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  padding: 6px 0;\n  font-size: 13.5px;\n}\n.wl.sub[_ngcontent-%COMP%] {\n  color: var(--%NS%text-2);\n  padding-left: 14px;\n  font-size: 13px;\n}\n.wl.tot[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--%NS%border);\n  margin-top: 4px;\n  padding-top: 10px;\n  font-weight: 600;\n  color: var(--%NS%forest-700);\n  font-size: 15px;\n}\ntfoot[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 12px 14px;\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n}\n.grow[_ngcontent-%COMP%] {\n  flex: 1;\n}\n/*# sourceMappingURL=pools.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PoolsTab, [{
    type: Component,
    args: [{ selector: "vcx-pools-tab", imports: [...KIT, NumPipe, DayPipe, Chart], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <p class="muted">A benefit pool sets aside the farmers' share of one delivered sale and splits it between enrolled farmers using the approved rule. Amounts are exact to the paisa.</p>
      <span class="spacer"></span>
      @if (canPrepare) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New pool from a sale</button> }
    </div>

    <section class="card">
      @if (loading()) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load benefit pools" [message]="error()!" /></div> }
      @else if (!pools().length) {
        <vc-empty icon="hand-coins" title="No benefit pools yet" text="When credits are delivered to a buyer, create a pool from that sale to work out each farmer's share.">
          @if (canPrepare) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New pool from a sale</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Sale</th><th class="num">Gross</th><th class="num">Deductions</th><th class="num">Farmer pool</th><th class="num">Farmers</th><th>Rule</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              @for (p of pools(); track p.id) {
                <tr class="clickable" (click)="openPool(p.id)">
                  <td class="mono strong">{{ p.breakdown.sale_code }}</td>
                  <td class="num">{{ m(p.gross_amount, p.currency) }}</td>
                  <td class="num muted">\u2212 {{ m(p.deductions_amount, p.currency) }}</td>
                  <td class="num"><strong>{{ m(p.farmer_pool_amount, p.currency) }}</strong></td>
                  <td class="num">{{ p.breakdown.farmers }}</td>
                  <td>v{{ p.breakdown.rule_version }} \xB7 {{ p.breakdown.farmer_share_pct }}%</td>
                  <td><vc-badge [status]="p.status" /></td>
                  <td class="subtle">{{ p.created_at | day }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- create -->
    <vc-modal [(open)]="createOpen" title="New benefit pool" subtitle="Choose a delivered sale. The current approved rule for its programme is applied." width="600px">
      @if (salesLoading()) { <vc-loading [rows]="3" /> }
      @else if (!eligible().length) {
        <vc-empty icon="send" title="No delivered sales waiting" text="Every delivered sale already has a pool, or no sale has been delivered yet." />
      } @else {
        <div class="opts">
          @for (s of eligible(); track s.id) {
            <label class="opt" [class.on]="pick() === s.id">
              <input type="radio" name="sale" [checked]="pick() === s.id" (change)="pick.set(s.id)" />
              <div class="ob"><strong class="mono">{{ s.code }}</strong><span class="small muted">{{ s.buyer_name }} \xB7 {{ s.quantity | num: 2 }} t \xB7 vintage {{ s.vintage }}</span></div>
              <strong class="num">{{ m(s.total_amount, s.currency) }}</strong>
            </label>
          }
        </div>
      }
      @if (createError()) { <vc-error title="Couldn't create the pool" [message]="createError()!" style="margin-top:12px" /> }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!pick() || busy()" (click)="create()">Calculate pool</button>
      </ng-container>
    </vc-modal>

    <!-- detail -->
    <vc-modal [open]="!!detail() || detailLoading()" (closed)="detail.set(null); detailLoading.set(false)" [drawer]="true" width="min(920px, 100vw)"
      [title]="detail() ? 'Benefit pool \xB7 ' + detail()!.breakdown.sale_code : 'Benefit pool'"
      [subtitle]="detail() ? 'Rule version ' + detail()!.breakdown.rule_version + ' \xB7 period ' + period(detail()!) : ''">
      @if (detailLoading() && !detail()) { <vc-loading [rows]="8" /> }
      @if (detail(); as p) {
        <div class="stack">
          <div class="row wrap">
            <vc-badge [status]="p.status" /><vc-dc [cls]="p.data_class" />
            <span class="subtle small">{{ p.breakdown.quantity_t | num: 3 }} t \xD7 {{ m(p.breakdown.unit_price ?? '0', p.currency) }} per tonne</span>
          </div>

          <section class="card">
            <div class="card-head"><h3>From sale value to farmer pool</h3></div>
            <div class="card-body"><vc-chart [option]="waterfall()" height="260px" /></div>
            <div class="wf-table">
              <div class="wl"><span>Gross sale value</span><span class="num">{{ m(p.gross_amount, p.currency) }}</span></div>
              @for (d of p.breakdown.deductions ?? []; track $index) {
                <div class="wl sub"><span>\u2212 {{ d.name }} ({{ d.pct }}%)</span><span class="num">\u2212 {{ m(d.amount, p.currency) }}</span></div>
              }
              <div class="wl"><span>Net after deductions</span><span class="num">{{ m(p.breakdown.net_after_deductions ?? '0', p.currency) }}</span></div>
              <div class="wl sub"><span>Retained by the programme ({{ 100 - (p.breakdown.farmer_share_pct ?? 0) }}%)</span><span class="num">\u2212 {{ m(retained(p), p.currency) }}</span></div>
              <div class="wl tot"><span>Farmer pool ({{ p.breakdown.farmer_share_pct }}%)</span><span class="num">{{ m(p.farmer_pool_amount, p.currency) }}</span></div>
            </div>
          </section>

          <section class="card">
            <div class="card-head"><h3>Entitlements</h3><span class="subtle small">{{ p.entitlements?.length }} farmers \xB7 weights {{ weightsText(p) }}</span></div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Farmer</th><th>Fields</th><th class="num">Area</th><th class="num">Practices</th><th class="num">Share</th><th class="num">Amount</th></tr></thead>
                <tbody>
                  @for (e of p.entitlements ?? []; track e.id) {
                    <tr>
                      <td>{{ e.farmer_name }}</td>
                      <td class="small mono">{{ (e.inputs.fields ?? []).join(', ') }}</td>
                      <td class="num">{{ e.inputs.area_ha | num: 2 }} ha</td>
                      <td class="num">{{ e.inputs.practices ?? 0 }}</td>
                      <td class="num">{{ ((e.inputs.share ?? 0) * 100) | num: 2 }}%</td>
                      <td class="num"><strong>{{ m(e.amount, p.currency) }}</strong></td>
                    </tr>
                  }
                </tbody>
                <tfoot><tr><td colspan="5"><strong>Total</strong> <span class="subtle small">\u2014 {{ p.breakdown.rounding }}</span></td>
                  <td class="num"><strong>{{ m(entSum(p), p.currency) }}</strong></td></tr></tfoot>
              </table>
            </div>
          </section>
          @if (actionError()) { <vc-error title="Not done" [message]="actionError()!" /> }
        </div>
      }
      <ng-container footer>
        @if (detail(); as p) {
          @if (p.status === 'calculated') {
            <span class="subtle small grow">Four-eyes rule: the person who calculated the pool can't approve it.</span>
            @if (canApprove) { <button class="btn btn-primary" [disabled]="busy()" (click)="approve(p)"><vc-icon name="check" [size]="15" />Approve pool</button> }
          } @else if (batchFor(p); as pb) {
            <span class="subtle small grow">Payout batch {{ pb.code }} was prepared from this pool.</span>
            <button class="btn btn-secondary" (click)="detail.set(null); batchCreated.emit(pb)"><vc-icon name="wallet" [size]="15" />Open {{ pb.code }}</button>
          } @else if (p.status === 'approved' && canPrepare) {
            <span class="subtle small grow">Approved. Prepare the payout batch to pay each farmer.</span>
            <button class="btn btn-primary" [disabled]="busy()" (click)="makeBatch(p)"><vc-icon name="wallet" [size]="15" />Create payout batch</button>
          } @else {
            <button class="btn btn-ghost" (click)="detail.set(null)">Close</button>
          }
        }
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;b4fc727ff40c9e84;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\benefits\\pools.tab.ts */\n.bar {\n  display: flex;\n  align-items: flex-start;\n  gap: 16px;\n  margin-bottom: 18px;\n}\n.bar p {\n  max-width: 720px;\n}\n.spacer {\n  flex: 1;\n}\n.strong {\n  font-weight: 600;\n}\n.opts {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.opt {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 14px;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  cursor: pointer;\n}\n.opt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n}\n.opt input {\n  accent-color: var(--primary);\n}\n.ob {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.wf-table {\n  border-top: 1px solid var(--border);\n  padding: 8px 20px 14px;\n}\n.wl {\n  display: flex;\n  justify-content: space-between;\n  padding: 6px 0;\n  font-size: 13.5px;\n}\n.wl.sub {\n  color: var(--text-2);\n  padding-left: 14px;\n  font-size: 13px;\n}\n.wl.tot {\n  border-top: 1px solid var(--border);\n  margin-top: 4px;\n  padding-top: 10px;\n  font-weight: 600;\n  color: var(--forest-700);\n  font-size: 15px;\n}\ntfoot td {\n  padding: 12px 14px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n}\n.grow {\n  flex: 1;\n}\n/*# sourceMappingURL=pools.tab.css.map */\n"] }]
  }], () => [], { batchCreated: [{ type: Output, args: ["batchCreated"] }], openId: [{ type: Input, args: [{ isSignal: true, alias: "openId", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PoolsTab, { className: "PoolsTab", filePath: "src/app/features/benefits/pools.tab.ts", lineNumber: 160 });
})();

// src/app/features/benefits/profiles.tab.ts
var _forTrack03 = ($index, $item) => $item.k;
var _forTrack12 = ($index, $item) => $item.farmer.id;
function ProfilesTab_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function ProfilesTab_For_9_Template_button_click_0_listener() {
      const o_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.f.set(o_r2.k));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 16);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const o_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r2.f() === o_r2.k);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", o_r2.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.count(o_r2.k));
  }
}
function ProfilesTab_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function ProfilesTab_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "vc-error", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r2.error());
  }
}
function ProfilesTab_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 11);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r2.rows().length ? "No farmers match" : "No farmers yet")("text", ctx_r2.rows().length ? "Try another filter." : "Farmers appear here once they are registered.");
  }
}
function ProfilesTab_Conditional_14_For_17_Conditional_6_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-badge", 24);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Verified ", \u0275\u0275pipeBind1(2, 1, p_r4.verified_on));
  }
}
function ProfilesTab_Conditional_14_For_17_Conditional_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-badge", 25);
    \u0275\u0275text(1, "Not verified");
    \u0275\u0275elementEnd();
  }
}
function ProfilesTab_Conditional_14_For_17_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "span", 21);
    \u0275\u0275element(2, "vc-icon", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 23);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275conditionalCreate(9, ProfilesTab_Conditional_14_For_17_Conditional_6_Conditional_9_Template, 3, 3, "vc-badge", 24)(10, ProfilesTab_Conditional_14_For_17_Conditional_6_Conditional_10_Template, 2, 0, "vc-badge", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r4 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275property("name", p_r4.method === "upi" ? "zap" : "landmark")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r4.method === "upi" ? "UPI" : "Bank");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r4.method === "upi" ? p_r4.upi_id : p_r4.account_masked + " \xB7 " + p_r4.ifsc);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r4.account_name);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r4.verified ? 9 : 10);
  }
}
function ProfilesTab_Conditional_14_For_17_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 26);
    \u0275\u0275text(1, "No payment details yet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "td")(3, "vc-badge", 27);
    \u0275\u0275text(4, "Missing");
    \u0275\u0275elementEnd()();
  }
}
function ProfilesTab_Conditional_14_For_17_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function ProfilesTab_Conditional_14_For_17_Conditional_9_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const r_r7 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.verify(r_r7));
    });
    \u0275\u0275element(1, "vc-icon", 31);
    \u0275\u0275text(2, "Verify");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r2.busyId() === r_r7.farmer.id);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function ProfilesTab_Conditional_14_For_17_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, ProfilesTab_Conditional_14_For_17_Conditional_9_Conditional_0_Template, 3, 2, "button", 28);
    \u0275\u0275elementStart(1, "button", 29);
    \u0275\u0275listener("click", function ProfilesTab_Conditional_14_For_17_Conditional_9_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r5);
      const r_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.editing.set(r_r7));
    });
    \u0275\u0275element(2, "vc-icon", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(r_r7.profile && !r_r7.profile.verified ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", r_r7.profile ? "pencil" : "plus")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.profile ? "Edit" : "Add");
  }
}
function ProfilesTab_Conditional_14_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 19);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(6, ProfilesTab_Conditional_14_For_17_Conditional_6_Template, 11, 6)(7, ProfilesTab_Conditional_14_For_17_Conditional_7_Template, 5, 0);
    \u0275\u0275elementStart(8, "td", 20);
    \u0275\u0275conditionalCreate(9, ProfilesTab_Conditional_14_For_17_Conditional_9_Template, 4, 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_13_0;
    const r_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r7.farmer.full_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", r_r7.farmer.code, " \xB7 ", r_r7.farmer.village || r_r7.farmer.district);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_13_0 = r_r7.profile) ? 6 : 7, tmp_13_0);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.canPrepare ? 9 : -1);
  }
}
function ProfilesTab_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "table", 18)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Farmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Account");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Name on account");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "tbody");
    \u0275\u0275repeaterCreate(16, ProfilesTab_Conditional_14_For_17_Template, 10, 5, "tr", null, _forTrack12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(16);
    \u0275\u0275repeater(ctx_r2.filtered());
  }
}
function ProfilesTab_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vcx-profile-form", 32);
    \u0275\u0275listener("saved", function ProfilesTab_Conditional_16_Template_vcx_profile_form_saved_0_listener($event) {
      const r_r9 = \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onSaved(r_r9, $event));
    })("cancelled", function ProfilesTab_Conditional_16_Template_vcx_profile_form_cancelled_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.editing.set(null));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r9 = ctx;
    \u0275\u0275property("farmerId", r_r9.farmer.id)("current", r_r9.profile);
  }
}
var ProfilesTab = class _ProfilesTab {
  api = inject(ApiService);
  toast = inject(ToastService);
  canPrepare = inject(AuthService).can("payout.prepare");
  opts = [{ k: "all", label: "All" }, { k: "unverified", label: "Needs verification" }, { k: "missing", label: "Missing" }, { k: "verified", label: "Verified" }];
  rows = signal(
    [],
    ...ngDevMode ? [{ debugName: "rows" }] : (
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
  q = signal(
    "",
    ...ngDevMode ? [{ debugName: "q" }] : (
      /* istanbul ignore next */
      []
    )
  );
  f = signal(
    "all",
    ...ngDevMode ? [{ debugName: "f" }] : (
      /* istanbul ignore next */
      []
    )
  );
  busyId = signal(
    null,
    ...ngDevMode ? [{ debugName: "busyId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editing = signal(
    null,
    ...ngDevMode ? [{ debugName: "editing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  filtered = computed(
    () => {
      const q = this.q().trim().toLowerCase();
      return this.rows().filter((r) => this.match(r, this.f()) && (!q || [r.farmer.full_name, r.farmer.village, r.farmer.code].some((x) => (x ?? "").toLowerCase().includes(q))));
    },
    ...ngDevMode ? [{ debugName: "filtered" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.load();
  }
  match(r, k) {
    return k === "all" || k === "missing" && !r.profile || k === "verified" && !!r.profile?.verified || k === "unverified" && !!r.profile && !r.profile.verified;
  }
  count(k) {
    return this.rows().filter((r) => this.match(r, k)).length;
  }
  load() {
    this.loading.set(true);
    this.api.get("/farmers", { limit: 200 }).subscribe({
      next: (page) => {
        if (!page.items.length) {
          this.rows.set([]);
          this.loading.set(false);
          return;
        }
        forkJoin(page.items.map((fm) => this.api.get(`/farmers/${fm.id}/payment-profile`).pipe(map((p) => ({ farmer: fm, profile: p })), catchError(() => of({ farmer: fm, profile: null }))))).subscribe((rows) => {
          this.rows.set(rows);
          this.loading.set(false);
        });
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  verify(r) {
    this.busyId.set(r.farmer.id);
    this.api.post(`/farmers/${r.farmer.id}/payment-profile/verify`).subscribe({
      next: (p) => {
        this.busyId.set(null);
        this.patch(r.farmer.id, p);
        this.toast.success("Payment details verified", r.farmer.full_name);
      },
      error: (e) => {
        this.busyId.set(null);
        this.toast.error("Couldn't verify", e.message);
      }
    });
  }
  onSaved(r, p) {
    this.editing.set(null);
    this.patch(r.farmer.id, p);
    this.toast.success("Payment details saved", "Verify them before the next payout.");
  }
  patch(fid, p) {
    this.rows.update((rs) => rs.map((x) => x.farmer.id === fid ? __spreadProps(__spreadValues({}, x), { profile: p }) : x));
  }
  static \u0275fac = function ProfilesTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfilesTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfilesTab, selectors: [["vcx-profiles-tab"]], decls: 17, vars: 7, consts: [[1, "bar"], [1, "muted"], [1, "filters"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search farmer or village\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "seg"], ["type", "button", 3, "on"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "wallet", 3, "title", "text"], [1, "table-wrap"], ["width", "480px", "title", "Payment details", 3, "closed", "open", "drawer", "subtitle"], [3, "farmerId", "current"], ["type", "button", 3, "click"], [1, "c"], ["title", "Couldn't load farmers", 3, "message"], [1, "table"], [1, "subtle", "small"], [1, "acts"], [1, "meth"], [3, "name", "size"], [1, "mono", "small"], ["status", "verified"], ["status", "pending"], ["colspan", "3", 1, "subtle"], ["status", "on_hold"], [1, "btn", "btn-secondary", "btn-sm", 3, "disabled"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], ["name", "shield-check", 3, "size"], [3, "saved", "cancelled", "farmerId", "current"]], template: function ProfilesTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "p", 1);
      \u0275\u0275text(2, "Where each farmer is paid. Details must be verified with the payment provider before money can be sent; unverified farmers are put on hold, not skipped.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3);
      \u0275\u0275element(5, "vc-icon", 4);
      \u0275\u0275elementStart(6, "input", 5);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function ProfilesTab_Template_input_ngModelChange_6_listener($event) {
        return ctx.q.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 6);
      \u0275\u0275repeaterCreate(8, ProfilesTab_For_9_Template, 4, 4, "button", 7, _forTrack03);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "section", 8);
      \u0275\u0275conditionalCreate(11, ProfilesTab_Conditional_11_Template, 1, 1, "vc-loading", 9)(12, ProfilesTab_Conditional_12_Template, 2, 1, "div", 10)(13, ProfilesTab_Conditional_13_Template, 1, 2, "vc-empty", 11)(14, ProfilesTab_Conditional_14_Template, 18, 0, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "vc-modal", 13);
      \u0275\u0275listener("closed", function ProfilesTab_Template_vc_modal_closed_15_listener() {
        return ctx.editing.set(null);
      });
      \u0275\u0275conditionalCreate(16, ProfilesTab_Conditional_16_Template, 1, 2, "vcx-profile-form", 14);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_8_0;
      \u0275\u0275advance(5);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.q());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.opts);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.loading() ? 11 : ctx.error() ? 12 : !ctx.filtered().length ? 13 : 14);
      \u0275\u0275advance(4);
      \u0275\u0275property("open", !!ctx.editing())("drawer", true)("subtitle", ctx.editing()?.farmer?.full_name ?? "");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_8_0 = ctx.editing()) ? 16 : -1, tmp_8_0);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, Icon, Badge, Empty, Loading, ErrorBox, Modal, ProfileForm, DayPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  margin-bottom: 14px;\n}\n.bar[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 760px;\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 380px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 8px;\n  background: var(--%NS%surface);\n  padding: 3px;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: inherit;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--%NS%text-2);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-200);\n}\n.seg[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  margin-left: 4px;\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.meth[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.acts[_ngcontent-%COMP%] {\n  text-align: right;\n  white-space: nowrap;\n}\n/*# sourceMappingURL=profiles.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfilesTab, [{
    type: Component,
    args: [{ selector: "vcx-profiles-tab", imports: [FormsModule, ...KIT, DayPipe, ProfileForm], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <p class="muted">Where each farmer is paid. Details must be verified with the payment provider before money can be sent; unverified farmers are put on hold, not skipped.</p>
    </div>
    <div class="filters">
      <div class="search"><vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Search farmer or village\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
      <div class="seg">
        @for (o of opts; track o.k) { <button type="button" [class.on]="f() === o.k" (click)="f.set(o.k)">{{ o.label }} <span class="c">{{ count(o.k) }}</span></button> }
      </div>
    </div>
    <section class="card">
      @if (loading()) { <vc-loading [rows]="6" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load farmers" [message]="error()!" /></div> }
      @else if (!filtered().length) {
        <vc-empty icon="wallet" [title]="rows().length ? 'No farmers match' : 'No farmers yet'" [text]="rows().length ? 'Try another filter.' : 'Farmers appear here once they are registered.'" />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Farmer</th><th>Method</th><th>Account</th><th>Name on account</th><th>Status</th><th></th></tr></thead>
            <tbody>
              @for (r of filtered(); track r.farmer.id) {
                <tr>
                  <td><strong>{{ r.farmer.full_name }}</strong><div class="subtle small">{{ r.farmer.code }} \xB7 {{ r.farmer.village || r.farmer.district }}</div></td>
                  @if (r.profile; as p) {
                    <td><span class="meth"><vc-icon [name]="p.method === 'upi' ? 'zap' : 'landmark'" [size]="14" />{{ p.method === 'upi' ? 'UPI' : 'Bank' }}</span></td>
                    <td class="mono small">{{ p.method === 'upi' ? p.upi_id : p.account_masked + ' \xB7 ' + p.ifsc }}</td>
                    <td>{{ p.account_name }}</td>
                    <td>@if (p.verified) { <vc-badge status="verified">Verified {{ p.verified_on | day }}</vc-badge> } @else { <vc-badge status="pending">Not verified</vc-badge> }</td>
                  } @else {
                    <td colspan="3" class="subtle">No payment details yet</td>
                    <td><vc-badge status="on_hold">Missing</vc-badge></td>
                  }
                  <td class="acts">
                    @if (canPrepare) {
                      @if (r.profile && !r.profile.verified) {
                        <button class="btn btn-secondary btn-sm" [disabled]="busyId() === r.farmer.id" (click)="verify(r)"><vc-icon name="shield-check" [size]="14" />Verify</button>
                      }
                      <button class="btn btn-ghost btn-sm" (click)="editing.set(r)"><vc-icon [name]="r.profile ? 'pencil' : 'plus'" [size]="14" />{{ r.profile ? 'Edit' : 'Add' }}</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [open]="!!editing()" (closed)="editing.set(null)" [drawer]="true" width="480px" title="Payment details" [subtitle]="editing()?.farmer?.full_name ?? ''">
      @if (editing(); as r) {
        <vcx-profile-form [farmerId]="r.farmer.id" [current]="r.profile" (saved)="onSaved(r, $event)" (cancelled)="editing.set(null)" />
      }
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;7e639ac299c82673;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\benefits\\profiles.tab.ts */\n.bar {\n  margin-bottom: 14px;\n}\n.bar p {\n  max-width: 760px;\n}\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 380px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.seg {\n  display: inline-flex;\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  background: var(--surface);\n  padding: 3px;\n  gap: 2px;\n}\n.seg button {\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: inherit;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--text-2);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--forest-50);\n  color: var(--forest-700);\n  box-shadow: inset 0 0 0 1px var(--forest-200);\n}\n.seg .c {\n  margin-left: 4px;\n  font-size: 11px;\n  color: var(--text-3);\n}\n.meth {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.acts {\n  text-align: right;\n  white-space: nowrap;\n}\n/*# sourceMappingURL=profiles.tab.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfilesTab, { className: "ProfilesTab", filePath: "src/app/features/benefits/profiles.tab.ts", lineNumber: 87 });
})();

// src/app/features/benefits/rules.tab.ts
var _forTrack04 = ($index, $item) => $item.programme.id;
var _forTrack13 = ($index, $item) => $item.id;
function RulesTab_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function RulesTab_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.newRule());
    });
    \u0275\u0275element(1, "vc-icon", 13);
    \u0275\u0275text(2, "New rule");
    \u0275\u0275elementEnd();
  }
}
function RulesTab_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "vc-loading", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 5);
  }
}
function RulesTab_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 5);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function RulesTab_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function RulesTab_Conditional_7_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.newRule());
    });
    \u0275\u0275element(1, "vc-icon", 13);
    \u0275\u0275text(2, "New rule");
    \u0275\u0275elementEnd();
  }
}
function RulesTab_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "vc-empty", 15);
    \u0275\u0275conditionalCreate(2, RulesTab_Conditional_7_Conditional_2_Template, 3, 0, "button", 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canPrepare ? 2 : -1);
  }
}
function RulesTab_Conditional_8_For_1_For_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1, "In use");
    \u0275\u0275elementEnd();
  }
}
function RulesTab_Conditional_8_For_1_For_5_For_14_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span");
  }
  if (rf & 2) {
    const k_r4 = \u0275\u0275nextContext().$implicit;
    const r_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275styleProp("flex-grow", r_r5.weights[k_r4])("background", ctx_r1.wcolor[k_r4]);
  }
}
function RulesTab_Conditional_8_For_1_For_5_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, RulesTab_Conditional_8_For_1_For_5_For_14_Conditional_0_Template, 1, 4, "span", 31);
  }
  if (rf & 2) {
    const k_r4 = ctx.$implicit;
    const r_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(r_r5.weights[k_r4] ? 0 : -1);
  }
}
function RulesTab_Conditional_8_For_1_For_5_For_17_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const k_r6 = \u0275\u0275nextContext().$implicit;
    const r_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r1.wcolor[k_r6]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.wlabel[k_r6], " ", (r_r5.weights[k_r6] * 100).toFixed(0), "%");
  }
}
function RulesTab_Conditional_8_For_1_For_5_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, RulesTab_Conditional_8_For_1_For_5_For_17_Conditional_0_Template, 3, 4, "span");
  }
  if (rf & 2) {
    const k_r6 = ctx.$implicit;
    const r_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(r_r5.weights[k_r6] ? 0 : -1);
  }
}
function RulesTab_Conditional_8_For_1_For_5_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", d_r7.name, " \xB7 ", d_r7.pct, "%");
  }
}
function RulesTab_Conditional_8_For_1_For_5_ForEmpty_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " None ");
  }
}
function RulesTab_Conditional_8_For_1_For_5_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Approved by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r1.people.name(r_r5.approved_by), " \xB7 ", \u0275\u0275pipeBind1(4, 2, r_r5.approved_at));
  }
}
function RulesTab_Conditional_8_For_1_For_5_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r5.notes);
  }
}
function RulesTab_Conditional_8_For_1_For_5_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function RulesTab_Conditional_8_For_1_For_5_Conditional_38_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const r_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.edit(r_r5));
    });
    \u0275\u0275element(1, "vc-icon", 33);
    \u0275\u0275text(2, "Edit draft");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function RulesTab_Conditional_8_For_1_For_5_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function RulesTab_Conditional_8_For_1_For_5_Conditional_39_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const r_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.copy(r_r5));
    });
    \u0275\u0275element(1, "vc-icon", 35);
    \u0275\u0275text(2, "New version from this");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function RulesTab_Conditional_8_For_1_For_5_Conditional_41_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275text(1, "You prepared this \u2014 a colleague must approve it");
    \u0275\u0275elementEnd();
  }
}
function RulesTab_Conditional_8_For_1_For_5_Conditional_41_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function RulesTab_Conditional_8_For_1_For_5_Conditional_41_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const r_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.approveTarget.set(r_r5));
    });
    \u0275\u0275element(1, "vc-icon", 39);
    \u0275\u0275text(2, "Approve");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function RulesTab_Conditional_8_For_1_For_5_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, RulesTab_Conditional_8_For_1_For_5_Conditional_41_Conditional_0_Template, 2, 0, "span", 36)(1, RulesTab_Conditional_8_For_1_For_5_Conditional_41_Conditional_1_Template, 3, 1, "button", 37);
  }
  if (rf & 2) {
    const r_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.mine(r_r5) ? 0 : 1);
  }
}
function RulesTab_Conditional_8_For_1_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 19)(1, "header")(2, "div")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, RulesTab_Conditional_8_For_1_For_5_Conditional_5_Template, 2, 0, "span", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "vc-badge", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 22)(8, "span", 23);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 24);
    \u0275\u0275text(11, "of revenue after deductions goes to farmers");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 25);
    \u0275\u0275repeaterCreate(13, RulesTab_Conditional_8_For_1_For_5_For_14_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 26);
    \u0275\u0275repeaterCreate(16, RulesTab_Conditional_8_For_1_For_5_For_17_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dl", 27)(19, "dt");
    \u0275\u0275text(20, "Deductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dd");
    \u0275\u0275repeaterCreate(22, RulesTab_Conditional_8_For_1_For_5_For_23_Template, 2, 2, "div", null, \u0275\u0275repeaterTrackByIndex, false, RulesTab_Conditional_8_For_1_For_5_ForEmpty_24_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dt");
    \u0275\u0275text(26, "Minimum payout");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dd");
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "inr");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "dt");
    \u0275\u0275text(31, "Prepared by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "dd");
    \u0275\u0275text(33);
    \u0275\u0275pipe(34, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(35, RulesTab_Conditional_8_For_1_For_5_Conditional_35_Template, 5, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(36, RulesTab_Conditional_8_For_1_For_5_Conditional_36_Template, 2, 1, "p", 28);
    \u0275\u0275elementStart(37, "footer");
    \u0275\u0275conditionalCreate(38, RulesTab_Conditional_8_For_1_For_5_Conditional_38_Template, 3, 1, "button", 29);
    \u0275\u0275conditionalCreate(39, RulesTab_Conditional_8_For_1_For_5_Conditional_39_Template, 3, 1, "button", 30);
    \u0275\u0275element(40, "span", 2);
    \u0275\u0275conditionalCreate(41, RulesTab_Conditional_8_For_1_For_5_Conditional_41_Template, 2, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("current", r_r5.status === "approved")("old", r_r5.status === "retired");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Version ", r_r5.version);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r5.status === "approved" ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("status", r_r5.status);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r1.pct(r_r5.farmer_share_pct), "%");
    \u0275\u0275advance(3);
    \u0275\u0275attribute("aria-label", ctx_r1.weightText(r_r5));
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.wkeys);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.wkeys);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(r_r5.deductions);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 18, r_r5.min_payout));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r1.people.name(r_r5.created_by), " \xB7 ", \u0275\u0275pipeBind1(34, 20, r_r5.created_at));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r5.approved_by ? 35 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r5.notes ? 36 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r5.status === "draft" && ctx_r1.canPrepare ? 38 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r5.status !== "draft" && ctx_r1.canPrepare ? 39 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r5.status === "draft" && ctx_r1.canApprove ? 41 : -1);
  }
}
function RulesTab_Conditional_8_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 16)(1, "h3");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 17);
    \u0275\u0275repeaterCreate(4, RulesTab_Conditional_8_For_1_For_5_Template, 42, 22, "article", 18, _forTrack13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const g_r11 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", g_r11.programme.code, " \xB7 ", g_r11.programme.name);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(g_r11.rules);
  }
}
function RulesTab_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, RulesTab_Conditional_8_For_1_Template, 6, 2, "section", 16, _forTrack04);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.groups());
  }
}
function RulesTab_Conditional_10_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r14 = ctx.$implicit;
    \u0275\u0275property("value", p_r14.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r14.code, " \xB7 ", p_r14.name);
  }
}
function RulesTab_Conditional_10_For_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 49)(1, "span", 64);
    \u0275\u0275element(2, "i");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 65);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RulesTab_Conditional_10_For_24_Template_input_ngModelChange_4_listener($event) {
      const k_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setWeight(k_r16, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 45)(6, "input", 66);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RulesTab_Conditional_10_For_24_Template_input_ngModelChange_6_listener($event) {
      const k_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setWeight(k_r16, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8, "%");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const k_r16 = ctx.$implicit;
    const d_r13 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", ctx_r1.wcolor[k_r16]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.wlabel[k_r16]);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", d_r13.weights[k_r16]);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", d_r13.weights[k_r16]);
    \u0275\u0275control();
  }
}
function RulesTab_Conditional_10_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 50);
    \u0275\u0275text(1, "Weights must add up to 100%. ");
    \u0275\u0275elementStart(2, "button", 67);
    \u0275\u0275listener("click", function RulesTab_Conditional_10_Conditional_25_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.balance());
    });
    \u0275\u0275text(3, "Balance automatically");
    \u0275\u0275elementEnd()();
  }
}
function RulesTab_Conditional_10_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1, "Each farmer's share = weighted mix of their enrolled area, recorded practices and credit contribution, relative to all farmers.");
    \u0275\u0275elementEnd();
  }
}
function RulesTab_Conditional_10_For_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 54)(1, "input", 68);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RulesTab_Conditional_10_For_36_Template_input_ngModelChange_1_listener($event) {
      const x_r19 = \u0275\u0275restoreView(_r18).$implicit;
      \u0275\u0275twoWayBindingSet(x_r19.name, $event) || (x_r19.name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RulesTab_Conditional_10_For_36_Template_input_ngModelChange_1_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.touch());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 45)(3, "input", 46);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RulesTab_Conditional_10_For_36_Template_input_ngModelChange_3_listener($event) {
      const x_r19 = \u0275\u0275restoreView(_r18).$implicit;
      \u0275\u0275twoWayBindingSet(x_r19.pct, $event) || (x_r19.pct = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RulesTab_Conditional_10_For_36_Template_input_ngModelChange_3_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.touch());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 69);
    \u0275\u0275listener("click", function RulesTab_Conditional_10_For_36_Template_button_click_6_listener() {
      const \u0275$index_233_r20 = \u0275\u0275restoreView(_r18).$index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeDeduction(\u0275$index_233_r20));
    });
    \u0275\u0275element(7, "vc-icon", 70);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const x_r19 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", x_r19.name);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", x_r19.pct);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
  }
}
function RulesTab_Conditional_10_ForEmpty_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1, "No deductions \u2014 the whole sale value is shared by the farmer share above.");
    \u0275\u0275elementEnd();
  }
}
function RulesTab_Conditional_10_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 50);
    \u0275\u0275text(1, "Deductions can't add up to more than 100%.");
    \u0275\u0275elementEnd();
  }
}
function RulesTab_Conditional_10_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 63);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function RulesTab_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 40)(2, "label");
    \u0275\u0275text(3, "Programme");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 41);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RulesTab_Conditional_10_Template_select_ngModelChange_4_listener($event) {
      const d_r13 = \u0275\u0275restoreView(_r12);
      \u0275\u0275twoWayBindingSet(d_r13.programme_id, $event) || (d_r13.programme_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(5, RulesTab_Conditional_10_For_6_Template, 2, 3, "option", 42, _forTrack13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 40)(8, "label");
    \u0275\u0275text(9, "Farmer share of revenue after deductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 43)(11, "input", 44);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RulesTab_Conditional_10_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.set("farmer_share_pct", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 45)(13, "input", 46);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RulesTab_Conditional_10_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.set("farmer_share_pct", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "%");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(16, "div", 40)(17, "div", 47)(18, "label");
    \u0275\u0275text(19, "How the farmer pool is split");
    \u0275\u0275elementEnd();
    \u0275\u0275element(20, "span", 2);
    \u0275\u0275elementStart(21, "span", 48);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(23, RulesTab_Conditional_10_For_24_Template, 9, 5, "div", 49, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(25, RulesTab_Conditional_10_Conditional_25_Template, 4, 0, "span", 50)(26, RulesTab_Conditional_10_Conditional_26_Template, 2, 0, "span", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 40)(28, "div", 47)(29, "label");
    \u0275\u0275text(30, "Deductions from gross revenue");
    \u0275\u0275elementEnd();
    \u0275\u0275element(31, "span", 2);
    \u0275\u0275elementStart(32, "button", 52);
    \u0275\u0275listener("click", function RulesTab_Conditional_10_Template_button_click_32_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addDeduction());
    });
    \u0275\u0275element(33, "vc-icon", 53);
    \u0275\u0275text(34, "Add");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(35, RulesTab_Conditional_10_For_36_Template, 8, 3, "div", 54, \u0275\u0275repeaterTrackByIndex, false, RulesTab_Conditional_10_ForEmpty_37_Template, 2, 0, "span", 51);
    \u0275\u0275conditionalCreate(38, RulesTab_Conditional_10_Conditional_38_Template, 2, 0, "span", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 55)(40, "div", 40)(41, "label");
    \u0275\u0275text(42, "Minimum payout (INR)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "input", 56);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RulesTab_Conditional_10_Template_input_ngModelChange_43_listener($event) {
      const d_r13 = \u0275\u0275restoreView(_r12);
      \u0275\u0275twoWayBindingSet(d_r13.min_payout, $event) || (d_r13.min_payout = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function RulesTab_Conditional_10_Template_input_ngModelChange_43_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.touch());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 51);
    \u0275\u0275text(45, "Smaller amounts are carried forward, not paid.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(46, "div", 40)(47, "label");
    \u0275\u0275text(48, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "textarea", 57);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RulesTab_Conditional_10_Template_textarea_ngModelChange_49_listener($event) {
      const d_r13 = \u0275\u0275restoreView(_r12);
      \u0275\u0275twoWayBindingSet(d_r13.notes, $event) || (d_r13.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 58)(51, "div", 59);
    \u0275\u0275text(52);
    \u0275\u0275pipe(53, "inr");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 60)(55, "span");
    \u0275\u0275text(56, "Deductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "span", 61);
    \u0275\u0275text(58);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "div", 60)(60, "span");
    \u0275\u0275text(61, "Net revenue");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "span", 61);
    \u0275\u0275text(63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 62)(65, "span");
    \u0275\u0275text(66);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "span", 61);
    \u0275\u0275text(68);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(69, RulesTab_Conditional_10_Conditional_69_Template, 1, 1, "vc-error", 63);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r13 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", d_r13.programme_id);
    \u0275\u0275property("disabled", !!d_r13.id);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.programmes());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", d_r13.farmer_share_pct);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", d_r13.farmer_share_pct);
    \u0275\u0275control();
    \u0275\u0275advance(8);
    \u0275\u0275classProp("bad", ctx_r1.weightSum() !== 100);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.weightSum(), "% of 100%");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.wkeys);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.weightSum() !== 100 ? 25 : 26);
    \u0275\u0275advance(8);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(d_r13.deductions);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.dedSum() > 100 ? 38 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", d_r13.min_payout);
    \u0275\u0275control();
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", d_r13.notes);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Example: a sale worth ", \u0275\u0275pipeBind1(53, 19, ctx_r1.example));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("\u2212 ", ctx_r1.m(ctx_r1.ex().ded));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.m(ctx_r1.ex().net));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Farmer pool (", d_r13.farmer_share_pct, "%)");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.m(ctx_r1.ex().pool));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.formError() ? 69 : -1);
  }
}
function RulesTab_Conditional_17_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 72);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r1.approveError());
  }
}
function RulesTab_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "p");
    \u0275\u0275text(2, "Prepared by ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "vc-callout", 71);
    \u0275\u0275text(8, "Four-eyes rule: nobody can approve a rule they created or edited.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, RulesTab_Conditional_17_Conditional_9_Template, 1, 1, "vc-error", 72);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r21 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.people.name(r_r21.created_by));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" on ", \u0275\u0275pipeBind1(6, 3, r_r21.created_at), ". Once approved, this version is frozen and replaces the current approved version for new benefit pools.");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.approveError() ? 9 : -1);
  }
}
var EXAMPLE_SALE = 1e5;
var RulesTab = class _RulesTab {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  people = inject(PeopleDirectory);
  canPrepare = this.auth.can("payout.prepare");
  canApprove = this.auth.can("payout.approve");
  wkeys = WEIGHT_KEYS;
  wlabel = WEIGHT_LABEL;
  wcolor = WEIGHT_COLOR;
  example = EXAMPLE_SALE;
  rules = signal(
    [],
    ...ngDevMode ? [{ debugName: "rules" }] : (
      /* istanbul ignore next */
      []
    )
  );
  programmes = signal(
    [],
    ...ngDevMode ? [{ debugName: "programmes" }] : (
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
  draft = signal(
    null,
    ...ngDevMode ? [{ debugName: "draft" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rev = signal(
    0,
    ...ngDevMode ? [{ debugName: "rev" }] : (
      /* istanbul ignore next */
      []
    )
  );
  // bump to recompute derived values while editing the draft object
  formError = signal(
    null,
    ...ngDevMode ? [{ debugName: "formError" }] : (
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
  approveError = signal(
    null,
    ...ngDevMode ? [{ debugName: "approveError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  groups = computed(
    () => {
      const byProg = /* @__PURE__ */ new Map();
      for (const r of this.rules())
        byProg.set(r.programme_id, [...byProg.get(r.programme_id) ?? [], r]);
      return [...byProg.entries()].map(([pid, rules]) => ({
        programme: this.programmes().find((p) => p.id === pid) ?? { id: pid, code: "Programme", name: pid.slice(0, 8) },
        rules: rules.sort((a, b) => b.version - a.version)
      }));
    },
    ...ngDevMode ? [{ debugName: "groups" }] : (
      /* istanbul ignore next */
      []
    )
  );
  weightSum = computed(
    () => {
      this.rev();
      const d = this.draft();
      return d ? Math.round(WEIGHT_KEYS.reduce((a, k) => a + (Number(d.weights[k]) || 0), 0) * 100) / 100 : 0;
    },
    ...ngDevMode ? [{ debugName: "weightSum" }] : (
      /* istanbul ignore next */
      []
    )
  );
  dedSum = computed(
    () => {
      this.rev();
      return (this.draft()?.deductions ?? []).reduce((a, x) => a + (Number(x.pct) || 0), 0);
    },
    ...ngDevMode ? [{ debugName: "dedSum" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ex = computed(
    () => {
      this.rev();
      const d = this.draft();
      const ded = Math.round(EXAMPLE_SALE * this.dedSum()) / 100;
      const net = EXAMPLE_SALE - ded;
      return { ded, net, pool: Math.round(net * (Number(d?.farmer_share_pct) || 0)) / 100 };
    },
    ...ngDevMode ? [{ debugName: "ex" }] : (
      /* istanbul ignore next */
      []
    )
  );
  valid = computed(
    () => {
      this.rev();
      const d = this.draft();
      return !!d && !!d.programme_id && this.weightSum() === 100 && this.dedSum() <= 100 && d.deductions.every((x) => x.name.trim().length >= 2) && d.farmer_share_pct >= 0 && d.farmer_share_pct <= 100;
    },
    ...ngDevMode ? [{ debugName: "valid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.people.load();
    this.load();
    this.api.get("/programmes").subscribe({ next: (p) => this.programmes.set(p), error: () => {
    } });
  }
  load() {
    this.loading.set(true);
    this.api.get("/benefit-rules").subscribe({
      next: (r) => {
        this.rules.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  pct(v) {
    return Number(v).toFixed(Number(v) % 1 ? 1 : 0);
  }
  m(v) {
    return money(v);
  }
  mine(r) {
    return r.created_by === this.auth.profile()?.id;
  }
  progName(id) {
    const p = this.programmes().find((x) => x.id === id);
    return p ? p.code : "";
  }
  weightText(r) {
    return WEIGHT_KEYS.filter((k) => r.weights[k]).map((k) => `${WEIGHT_LABEL[k]} ${(r.weights[k] * 100).toFixed(0)}%`).join(", ");
  }
  touch() {
    this.rev.update((v) => v + 1);
  }
  newRule() {
    this.formError.set(null);
    this.draft.set({
      id: null,
      programme_id: this.programmes()[0]?.id ?? "",
      farmer_share_pct: 60,
      weights: { area: 50, practices: 50, credits: 0 },
      deductions: [{ name: "Verification & registry fees", pct: 8 }],
      min_payout: 100,
      notes: ""
    });
  }
  edit(r) {
    this.formError.set(null);
    this.draft.set(__spreadProps(__spreadValues({}, this.fromRule(r)), { id: r.id }));
  }
  copy(r) {
    this.formError.set(null);
    this.draft.set(__spreadProps(__spreadValues({}, this.fromRule(r)), { id: null, notes: "" }));
  }
  fromRule(r) {
    return {
      id: r.id,
      programme_id: r.programme_id,
      farmer_share_pct: Number(r.farmer_share_pct),
      weights: Object.fromEntries(WEIGHT_KEYS.map((k) => [k, Math.round((r.weights[k] ?? 0) * 100)])),
      deductions: r.deductions.map((d) => ({ name: d.name, pct: Number(d.pct) })),
      min_payout: Number(r.min_payout ?? 0),
      notes: r.notes ?? ""
    };
  }
  set(k, v) {
    const d = this.draft();
    if (d) {
      d[k] = Math.max(0, Math.min(100, Number(v) || 0));
      this.touch();
    }
  }
  setWeight(k, v) {
    const d = this.draft();
    if (d) {
      d.weights[k] = Math.max(0, Math.min(100, Number(v) || 0));
      this.touch();
    }
  }
  balance() {
    const d = this.draft();
    if (!d)
      return;
    const sum = WEIGHT_KEYS.reduce((a, k) => a + d.weights[k], 0);
    if (sum <= 0) {
      d.weights = { area: 50, practices: 50, credits: 0 };
      this.touch();
      return;
    }
    const scaled = WEIGHT_KEYS.map((k) => Math.floor(d.weights[k] / sum * 100));
    const diff = 100 - scaled.reduce((a, v) => a + v, 0);
    const iMax = scaled.indexOf(Math.max(...scaled));
    scaled[iMax] += diff;
    WEIGHT_KEYS.forEach((k, i) => d.weights[k] = scaled[i]);
    this.touch();
  }
  addDeduction() {
    this.draft()?.deductions.push({ name: "", pct: 0 });
    this.touch();
  }
  removeDeduction(i) {
    this.draft()?.deductions.splice(i, 1);
    this.touch();
  }
  save() {
    const d = this.draft();
    if (!d)
      return;
    const weights = {};
    for (const k of WEIGHT_KEYS)
      if (d.weights[k] > 0)
        weights[k] = Math.round(d.weights[k] * 100) / 1e4;
    const body = {
      farmer_share_pct: Number(d.farmer_share_pct).toFixed(2),
      weights,
      deductions: d.deductions.map((x) => ({ name: x.name.trim(), pct: Number(x.pct).toFixed(2) })),
      min_payout: Number(d.min_payout || 0).toFixed(2),
      notes: d.notes.trim()
    };
    this.busy.set(true);
    this.formError.set(null);
    const req = d.id ? this.api.patch(`/benefit-rules/${d.id}`, body) : this.api.post("/benefit-rules", __spreadProps(__spreadValues({}, body), { programme_id: d.programme_id }));
    req.subscribe({
      next: (r) => {
        this.busy.set(false);
        this.draft.set(null);
        this.toast.success(`Version ${r.version} saved as draft`, "Ask a finance approver to review it.");
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.formError.set(apiMessage(e));
      }
    });
  }
  approve() {
    const r = this.approveTarget();
    if (!r)
      return;
    this.busy.set(true);
    this.approveError.set(null);
    this.api.post(`/benefit-rules/${r.id}/approve`).subscribe({
      next: (nr) => {
        this.busy.set(false);
        this.approveTarget.set(null);
        this.toast.success(`Version ${nr.version} approved`, "New benefit pools will use it.");
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.approveError.set(e.code === "SELF_APPROVAL_REJECTED" ? `${e.message} This keeps every payout rule checked by two people.` : e.message);
      }
    });
  }
  static \u0275fac = function RulesTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RulesTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RulesTab, selectors: [["vcx-rules-tab"]], decls: 23, vars: 11, consts: [[1, "bar"], [1, "muted"], [1, "spacer"], [1, "btn", "btn-primary"], [1, "card"], ["title", "Couldn't load benefit rules", 3, "message"], ["width", "560px", "subtitle", "Saved as a draft. It takes effect only after a finance approver signs it off.", 3, "closed", "open", "drawer", "title"], [1, "stack"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["title", "Approve benefit rule", "width", "520px", 3, "closed", "open", "subtitle"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [3, "rows"], ["icon", "scale", "title", "No benefit rules yet", "text", "Set the farmer share, how it is split between farmers, and any deductions. A second person must approve it before money can be shared."], [1, "prog"], [1, "rules"], [1, "card", "rule", 3, "current", "old"], [1, "card", "rule"], [1, "cur", "small"], [3, "status"], [1, "share"], [1, "big", "num"], [1, "muted", "small"], [1, "wbar"], [1, "wl", "small"], [1, "kv", "small"], [1, "notes", "small"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-ghost", "btn-sm"], [3, "flex-grow", "background"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "pencil", 3, "size"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "copy", 3, "size"], ["title", "Four-eyes rule", 1, "self", "small"], [1, "btn", "btn-primary", "btn-sm"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["name", "check", 3, "size"], [1, "field"], [1, "input", 3, "ngModelChange", "ngModel", "disabled"], [3, "value"], [1, "slide"], ["type", "range", "min", "0", "max", "100", "step", "1", 3, "ngModelChange", "ngModel"], [1, "pin"], ["type", "number", "min", "0", "max", "100", "step", "0.5", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "row"], [1, "sum", "small"], [1, "wrow"], [1, "error"], [1, "hint"], ["type", "button", 1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "plus", 3, "size"], [1, "drow"], [1, "form-grid"], ["type", "number", "min", "0", "step", "1", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["placeholder", "Why this version \u2014 e.g. agreed with FPO board on 12 Aug", 1, "input", 3, "ngModelChange", "ngModel"], [1, "example"], [1, "eh", "small"], [1, "erow"], [1, "num"], [1, "erow", "tot"], ["title", "Couldn't save", 3, "message"], [1, "wk"], ["type", "range", "min", "0", "max", "100", "step", "5", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "max", "100", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "link", 3, "click"], ["placeholder", "e.g. Verification & registry fees", 1, "input", 3, "ngModelChange", "ngModel"], ["type", "button", "aria-label", "Remove", 1, "btn", "btn-ghost", "btn-icon", "btn-sm", 3, "click"], ["name", "trash", 3, "size"], ["tone", "info", "icon", "shield"], ["title", "Not approved", 3, "message"]], template: function RulesTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "p", 1);
      \u0275\u0275text(2, "How sale revenue is shared with farmers. Each programme has one approved version at a time; approved versions are frozen and every payout records the version it used.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "span", 2);
      \u0275\u0275conditionalCreate(4, RulesTab_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, RulesTab_Conditional_5_Template, 2, 1, "div", 4)(6, RulesTab_Conditional_6_Template, 1, 1, "vc-error", 5)(7, RulesTab_Conditional_7_Template, 3, 1, "div", 4)(8, RulesTab_Conditional_8_Template, 2, 0);
      \u0275\u0275elementStart(9, "vc-modal", 6);
      \u0275\u0275listener("closed", function RulesTab_Template_vc_modal_closed_9_listener() {
        return ctx.draft.set(null);
      });
      \u0275\u0275conditionalCreate(10, RulesTab_Conditional_10_Template, 70, 21, "div", 7);
      \u0275\u0275elementContainerStart(11, 8);
      \u0275\u0275elementStart(12, "button", 9);
      \u0275\u0275listener("click", function RulesTab_Template_button_click_12_listener() {
        return ctx.draft.set(null);
      });
      \u0275\u0275text(13, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "button", 10);
      \u0275\u0275listener("click", function RulesTab_Template_button_click_14_listener() {
        return ctx.save();
      });
      \u0275\u0275text(15, "Save draft");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "vc-modal", 11);
      \u0275\u0275listener("closed", function RulesTab_Template_vc_modal_closed_16_listener() {
        return ctx.approveTarget.set(null);
      });
      \u0275\u0275conditionalCreate(17, RulesTab_Conditional_17_Template, 10, 5, "div", 7);
      \u0275\u0275elementContainerStart(18, 8);
      \u0275\u0275elementStart(19, "button", 9);
      \u0275\u0275listener("click", function RulesTab_Template_button_click_19_listener() {
        return ctx.approveTarget.set(null);
      });
      \u0275\u0275text(20, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "button", 10);
      \u0275\u0275listener("click", function RulesTab_Template_button_click_21_listener() {
        return ctx.approve();
      });
      \u0275\u0275text(22, "Approve version");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_5_0;
      let tmp_9_0;
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canPrepare ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 5 : ctx.error() ? 6 : !ctx.rules().length ? 7 : 8);
      \u0275\u0275advance(4);
      \u0275\u0275property("open", !!ctx.draft())("drawer", true)("title", ctx.draft()?.id ? "Edit draft rule" : "New benefit rule");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_5_0 = ctx.draft()) ? 10 : -1, tmp_5_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.valid());
      \u0275\u0275advance(2);
      \u0275\u0275property("open", !!ctx.approveTarget())("subtitle", ctx.approveTarget() ? ctx.progName(ctx.approveTarget().programme_id) + " \xB7 version " + ctx.approveTarget().version : "");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_9_0 = ctx.approveTarget()) ? 17 : -1, tmp_9_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, Icon, Badge, Empty, Loading, ErrorBox, Callout, Modal, DayPipe, InrPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 16px;\n  margin-bottom: 18px;\n}\n.bar[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 720px;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.prog[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.prog[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n.rules[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));\n  gap: 14px;\n}\n.rule[_ngcontent-%COMP%] {\n  padding: 16px 18px 0;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.rule.current[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-300);\n  box-shadow: 0 0 0 3px var(--%NS%forest-50);\n}\n.rule.old[_ngcontent-%COMP%] {\n  opacity: 0.8;\n}\n.rule[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.cur[_ngcontent-%COMP%] {\n  margin-left: 8px;\n  color: var(--%NS%forest-600);\n  font-weight: 600;\n}\n.share[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  gap: 10px;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.wbar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2px;\n  height: 8px;\n  border-radius: 4px;\n  overflow: hidden;\n  background: var(--%NS%sand-200);\n}\n.wbar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  flex-basis: 0;\n}\n.wl[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 12px;\n  color: var(--%NS%text-2);\n}\n.wl[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n  margin-right: 5px;\n}\n.rule[_ngcontent-%COMP%]   .kv[_ngcontent-%COMP%] {\n  grid-template-columns: 112px 1fr;\n}\n.notes[_ngcontent-%COMP%] {\n  color: var(--%NS%text-2);\n  padding: 8px 10px;\n  background: var(--%NS%surface-2);\n  border-radius: 6px;\n}\n.rule[_ngcontent-%COMP%]   footer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin: auto -18px 0;\n  padding: 10px 12px;\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n  border-radius: 0 0 var(--%NS%radius) var(--%NS%radius);\n}\n.self[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.slide[_ngcontent-%COMP%], \n.wrow[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.slide[_ngcontent-%COMP%]   input[type=range][_ngcontent-%COMP%], \n.wrow[_ngcontent-%COMP%]   input[type=range][_ngcontent-%COMP%] {\n  flex: 1;\n  accent-color: var(--%NS%primary);\n}\n.wk[_ngcontent-%COMP%] {\n  width: 150px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n}\n.wk[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.pin[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  width: 92px;\n}\n.pin[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  text-align: right;\n  padding: 0 8px;\n}\n.pin[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.sum[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--%NS%forest-600);\n}\n.sum.bad[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.drow[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.link[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  padding: 0;\n  color: var(--%NS%primary);\n  font: inherit;\n  text-decoration: underline;\n  cursor: pointer;\n}\n.example[_ngcontent-%COMP%] {\n  border: 1px dashed var(--%NS%border-strong);\n  border-radius: 10px;\n  padding: 12px 14px;\n  background: var(--%NS%surface-2);\n}\n.eh[_ngcontent-%COMP%] {\n  color: var(--%NS%text-2);\n  margin-bottom: 6px;\n}\n.erow[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-size: 13px;\n  padding: 3px 0;\n}\n.erow.tot[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--%NS%border);\n  margin-top: 4px;\n  padding-top: 6px;\n  font-weight: 600;\n  color: var(--%NS%forest-700);\n}\n/*# sourceMappingURL=rules.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RulesTab, [{
    type: Component,
    args: [{ selector: "vcx-rules-tab", imports: [FormsModule, ...KIT, DayPipe, InrPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <p class="muted">How sale revenue is shared with farmers. Each programme has one approved version at a time; approved versions are frozen and every payout records the version it used.</p>
      <span class="spacer"></span>
      @if (canPrepare) { <button class="btn btn-primary" (click)="newRule()"><vc-icon name="plus" />New rule</button> }
    </div>

    @if (loading()) { <div class="card"><vc-loading [rows]="5" /></div> }
    @else if (error()) { <vc-error title="Couldn't load benefit rules" [message]="error()!" /> }
    @else if (!rules().length) {
      <div class="card"><vc-empty icon="scale" title="No benefit rules yet"
        text="Set the farmer share, how it is split between farmers, and any deductions. A second person must approve it before money can be shared.">
        @if (canPrepare) { <button class="btn btn-primary" (click)="newRule()"><vc-icon name="plus" />New rule</button> }
      </vc-empty></div>
    } @else {
      @for (g of groups(); track g.programme.id) {
        <section class="prog">
          <h3>{{ g.programme.code }} \xB7 {{ g.programme.name }}</h3>
          <div class="rules">
            @for (r of g.rules; track r.id) {
              <article class="card rule" [class.current]="r.status === 'approved'" [class.old]="r.status === 'retired'">
                <header>
                  <div><strong>Version {{ r.version }}</strong>
                    @if (r.status === 'approved') { <span class="cur small">In use</span> }</div>
                  <vc-badge [status]="r.status" />
                </header>
                <div class="share"><span class="big num">{{ pct(r.farmer_share_pct) }}%</span><span class="muted small">of revenue after deductions goes to farmers</span></div>
                <div class="wbar" [attr.aria-label]="weightText(r)">
                  @for (k of wkeys; track k) { @if (r.weights[k]) { <span [style.flex-grow]="r.weights[k]" [style.background]="wcolor[k]"></span> } }
                </div>
                <div class="wl small">
                  @for (k of wkeys; track k) { @if (r.weights[k]) { <span><i [style.background]="wcolor[k]"></i>{{ wlabel[k] }} {{ (r.weights[k] * 100).toFixed(0) }}%</span> } }
                </div>
                <dl class="kv small">
                  <dt>Deductions</dt>
                  <dd>@for (d of r.deductions; track $index) { <div>{{ d.name }} \xB7 {{ d.pct }}%</div> } @empty { None }</dd>
                  <dt>Minimum payout</dt><dd>{{ r.min_payout | inr }}</dd>
                  <dt>Prepared by</dt><dd>{{ people.name(r.created_by) }} \xB7 {{ r.created_at | day }}</dd>
                  @if (r.approved_by) { <dt>Approved by</dt><dd>{{ people.name(r.approved_by) }} \xB7 {{ r.approved_at | day }}</dd> }
                </dl>
                @if (r.notes) { <p class="notes small">{{ r.notes }}</p> }
                <footer>
                  @if (r.status === 'draft' && canPrepare) { <button class="btn btn-secondary btn-sm" (click)="edit(r)"><vc-icon name="pencil" [size]="14" />Edit draft</button> }
                  @if (r.status !== 'draft' && canPrepare) { <button class="btn btn-ghost btn-sm" (click)="copy(r)"><vc-icon name="copy" [size]="14" />New version from this</button> }
                  <span class="spacer"></span>
                  @if (r.status === 'draft' && canApprove) {
                    @if (mine(r)) {
                      <span class="self small" title="Four-eyes rule">You prepared this \u2014 a colleague must approve it</span>
                    } @else {
                      <button class="btn btn-primary btn-sm" (click)="approveTarget.set(r)"><vc-icon name="check" [size]="14" />Approve</button>
                    }
                  }
                </footer>
              </article>
            }
          </div>
        </section>
      }
    }

    <!-- editor -->
    <vc-modal [open]="!!draft()" (closed)="draft.set(null)" [drawer]="true" width="560px"
      [title]="draft()?.id ? 'Edit draft rule' : 'New benefit rule'" subtitle="Saved as a draft. It takes effect only after a finance approver signs it off.">
      @if (draft(); as d) {
        <div class="stack">
          <div class="field"><label>Programme</label>
            <select class="input" [(ngModel)]="d.programme_id" [disabled]="!!d.id">
              @for (p of programmes(); track p.id) { <option [value]="p.id">{{ p.code }} \xB7 {{ p.name }}</option> }
            </select></div>

          <div class="field">
            <label>Farmer share of revenue after deductions</label>
            <div class="slide">
              <input type="range" min="0" max="100" step="1" [ngModel]="d.farmer_share_pct" (ngModelChange)="set('farmer_share_pct', $event)" />
              <div class="pin"><input class="input num" type="number" min="0" max="100" step="0.5" [ngModel]="d.farmer_share_pct" (ngModelChange)="set('farmer_share_pct', $event)" /><span>%</span></div>
            </div>
          </div>

          <div class="field">
            <div class="row"><label>How the farmer pool is split</label><span class="spacer"></span>
              <span class="sum small" [class.bad]="weightSum() !== 100">{{ weightSum() }}% of 100%</span></div>
            @for (k of wkeys; track k) {
              <div class="wrow">
                <span class="wk"><i [style.background]="wcolor[k]"></i>{{ wlabel[k] }}</span>
                <input type="range" min="0" max="100" step="5" [ngModel]="d.weights[k]" (ngModelChange)="setWeight(k, $event)" />
                <div class="pin"><input class="input num" type="number" min="0" max="100" [ngModel]="d.weights[k]" (ngModelChange)="setWeight(k, $event)" /><span>%</span></div>
              </div>
            }
            @if (weightSum() !== 100) {
              <span class="error">Weights must add up to 100%. <button type="button" class="link" (click)="balance()">Balance automatically</button></span>
            } @else {
              <span class="hint">Each farmer's share = weighted mix of their enrolled area, recorded practices and credit contribution, relative to all farmers.</span>
            }
          </div>

          <div class="field">
            <div class="row"><label>Deductions from gross revenue</label><span class="spacer"></span>
              <button type="button" class="btn btn-ghost btn-sm" (click)="addDeduction()"><vc-icon name="plus" [size]="14" />Add</button></div>
            @for (x of d.deductions; track $index; let i = $index) {
              <div class="drow">
                <input class="input" [(ngModel)]="x.name" placeholder="e.g. Verification & registry fees" (ngModelChange)="touch()" />
                <div class="pin"><input class="input num" type="number" min="0" max="100" step="0.5" [(ngModel)]="x.pct" (ngModelChange)="touch()" /><span>%</span></div>
                <button type="button" class="btn btn-ghost btn-icon btn-sm" (click)="removeDeduction(i)" aria-label="Remove"><vc-icon name="trash" [size]="14" /></button>
              </div>
            } @empty { <span class="hint">No deductions \u2014 the whole sale value is shared by the farmer share above.</span> }
            @if (dedSum() > 100) { <span class="error">Deductions can't add up to more than 100%.</span> }
          </div>

          <div class="form-grid">
            <div class="field"><label>Minimum payout (INR)</label>
              <input class="input num" type="number" min="0" step="1" [(ngModel)]="d.min_payout" (ngModelChange)="touch()" />
              <span class="hint">Smaller amounts are carried forward, not paid.</span></div>
          </div>
          <div class="field"><label>Notes</label><textarea class="input" [(ngModel)]="d.notes" placeholder="Why this version \u2014 e.g. agreed with FPO board on 12 Aug"></textarea></div>

          <div class="example">
            <div class="eh small">Example: a sale worth {{ example | inr }}</div>
            <div class="erow"><span>Deductions</span><span class="num">\u2212 {{ m(ex().ded) }}</span></div>
            <div class="erow"><span>Net revenue</span><span class="num">{{ m(ex().net) }}</span></div>
            <div class="erow tot"><span>Farmer pool ({{ d.farmer_share_pct }}%)</span><span class="num">{{ m(ex().pool) }}</span></div>
          </div>
          @if (formError()) { <vc-error title="Couldn't save" [message]="formError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="draft.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()">Save draft</button>
      </ng-container>
    </vc-modal>

    <!-- approve -->
    <vc-modal [open]="!!approveTarget()" (closed)="approveTarget.set(null)" title="Approve benefit rule" width="520px"
      [subtitle]="approveTarget() ? progName(approveTarget()!.programme_id) + ' \xB7 version ' + approveTarget()!.version : ''">
      @if (approveTarget(); as r) {
        <div class="stack">
          <p>Prepared by <strong>{{ people.name(r.created_by) }}</strong> on {{ r.created_at | day }}. Once approved, this version is frozen and
            replaces the current approved version for new benefit pools.</p>
          <vc-callout tone="info" icon="shield">Four-eyes rule: nobody can approve a rule they created or edited.</vc-callout>
          @if (approveError()) { <vc-error title="Not approved" [message]="approveError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="approveTarget.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="approve()">Approve version</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;496d052ebb9db622;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\benefits\\rules.tab.ts */\n.bar {\n  display: flex;\n  align-items: flex-start;\n  gap: 16px;\n  margin-bottom: 18px;\n}\n.bar p {\n  max-width: 720px;\n}\n.spacer {\n  flex: 1;\n}\n.prog {\n  margin-bottom: 24px;\n}\n.prog h3 {\n  margin-bottom: 12px;\n}\n.rules {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));\n  gap: 14px;\n}\n.rule {\n  padding: 16px 18px 0;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.rule.current {\n  border-color: var(--forest-300);\n  box-shadow: 0 0 0 3px var(--forest-50);\n}\n.rule.old {\n  opacity: 0.8;\n}\n.rule header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.cur {\n  margin-left: 8px;\n  color: var(--forest-600);\n  font-weight: 600;\n}\n.share {\n  display: flex;\n  align-items: baseline;\n  gap: 10px;\n}\n.big {\n  font-size: 28px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.wbar {\n  display: flex;\n  gap: 2px;\n  height: 8px;\n  border-radius: 4px;\n  overflow: hidden;\n  background: var(--sand-200);\n}\n.wbar span {\n  flex-basis: 0;\n}\n.wl {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 12px;\n  color: var(--text-2);\n}\n.wl i {\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n  margin-right: 5px;\n}\n.rule .kv {\n  grid-template-columns: 112px 1fr;\n}\n.notes {\n  color: var(--text-2);\n  padding: 8px 10px;\n  background: var(--surface-2);\n  border-radius: 6px;\n}\n.rule footer {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin: auto -18px 0;\n  padding: 10px 12px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n  border-radius: 0 0 var(--radius) var(--radius);\n}\n.self {\n  color: var(--amber-600);\n}\n.slide,\n.wrow {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.slide input[type=range],\n.wrow input[type=range] {\n  flex: 1;\n  accent-color: var(--primary);\n}\n.wk {\n  width: 150px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n}\n.wk i {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.pin {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  width: 92px;\n}\n.pin .input {\n  text-align: right;\n  padding: 0 8px;\n}\n.pin span {\n  color: var(--text-3);\n}\n.sum {\n  font-weight: 600;\n  color: var(--forest-600);\n}\n.sum.bad {\n  color: var(--red-600);\n}\n.drow {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.link {\n  border: 0;\n  background: none;\n  padding: 0;\n  color: var(--primary);\n  font: inherit;\n  text-decoration: underline;\n  cursor: pointer;\n}\n.example {\n  border: 1px dashed var(--border-strong);\n  border-radius: 10px;\n  padding: 12px 14px;\n  background: var(--surface-2);\n}\n.eh {\n  color: var(--text-2);\n  margin-bottom: 6px;\n}\n.erow {\n  display: flex;\n  justify-content: space-between;\n  font-size: 13px;\n  padding: 3px 0;\n}\n.erow.tot {\n  border-top: 1px solid var(--border);\n  margin-top: 4px;\n  padding-top: 6px;\n  font-weight: 600;\n  color: var(--forest-700);\n}\n/*# sourceMappingURL=rules.tab.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RulesTab, { className: "RulesTab", filePath: "src/app/features/benefits/rules.tab.ts", lineNumber: 204 });
})();

// src/app/features/benefits/benefits.page.ts
function BenefitsPage_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vcx-rules-tab");
  }
}
function BenefitsPage_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vcx-pools-tab", 3);
    \u0275\u0275listener("batchCreated", function BenefitsPage_Case_3_Template_vcx_pools_tab_batchCreated_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBatch($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("openId", ctx_r1.openPool);
  }
}
function BenefitsPage_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vcx-payouts-tab", 2);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("openId", ctx_r1.openBatch());
  }
}
function BenefitsPage_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vcx-profiles-tab");
  }
}
var BenefitsPage = class _BenefitsPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  tabs = [
    { key: "rules", label: "Benefit rules" },
    { key: "pools", label: "Benefit pools" },
    { key: "payouts", label: "Payout batches" },
    { key: "profiles", label: "Payment profiles" }
  ];
  tab = signal(
    this.route.snapshot.queryParamMap.get("tab") || "rules",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Deep links: /app/benefits?tab=pools&open=<id> opens that pool or payout batch. */
  deep = this.route.snapshot.queryParamMap.get("open");
  openPool = this.tab() === "pools" ? this.deep : null;
  openBatch = signal(
    this.tab() === "payouts" ? this.deep : null,
    ...ngDevMode ? [{ debugName: "openBatch" }] : (
      /* istanbul ignore next */
      []
    )
  );
  setTab(t) {
    this.tab.set(t);
    this.router.navigate([], { queryParams: { tab: t }, replaceUrl: true });
  }
  onBatch(b) {
    this.openBatch.set(b.id);
    this.setTab("payouts");
  }
  static \u0275fac = function BenefitsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BenefitsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BenefitsPage, selectors: [["vc-benefits-page"]], decls: 6, vars: 3, consts: [["title", "Farmer benefits", "eyebrow", "Money", "subtitle", "Share credit revenue with farmers transparently: an approved rule, a pool per sale, and payout batches checked by two people."], [3, "activeChange", "tabs", "active"], [3, "openId"], [3, "batchCreated", "openId"]], template: function BenefitsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vc-page-header", 0);
      \u0275\u0275elementStart(1, "vc-tabs", 1);
      \u0275\u0275listener("activeChange", function BenefitsPage_Template_vc_tabs_activeChange_1_listener($event) {
        return ctx.setTab($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(2, BenefitsPage_Case_2_Template, 1, 0, "vcx-rules-tab")(3, BenefitsPage_Case_3_Template, 1, 1, "vcx-pools-tab", 2)(4, BenefitsPage_Case_4_Template, 1, 1, "vcx-payouts-tab", 2)(5, BenefitsPage_Case_5_Template, 1, 0, "vcx-profiles-tab");
    }
    if (rf & 2) {
      let tmp_2_0;
      \u0275\u0275advance();
      \u0275\u0275property("tabs", ctx.tabs)("active", ctx.tab());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.tab()) === "rules" ? 2 : tmp_2_0 === "pools" ? 3 : tmp_2_0 === "payouts" ? 4 : tmp_2_0 === "profiles" ? 5 : -1);
    }
  }, dependencies: [PageHeader, Tabs, RulesTab, PoolsTab, PayoutsTab, ProfilesTab], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BenefitsPage, [{
    type: Component,
    args: [{
      selector: "vc-benefits-page",
      imports: [...KIT, RulesTab, PoolsTab, PayoutsTab, ProfilesTab],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <vc-page-header title="Farmer benefits" eyebrow="Money"
      subtitle="Share credit revenue with farmers transparently: an approved rule, a pool per sale, and payout batches checked by two people." />
    <vc-tabs [tabs]="tabs" [active]="tab()" (activeChange)="setTab($any($event))" />
    @switch (tab()) {
      @case ('rules') { <vcx-rules-tab /> }
      @case ('pools') { <vcx-pools-tab [openId]="openPool" (batchCreated)="onBatch($event)" /> }
      @case ('payouts') { <vcx-payouts-tab [openId]="openBatch()" /> }
      @case ('profiles') { <vcx-profiles-tab /> }
    }
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BenefitsPage, { className: "BenefitsPage", filePath: "src/app/features/benefits/benefits.page.ts", lineNumber: 28 });
})();

// src/app/features/benefits/benefits.routes.ts
var benefits_routes_default = [{ path: "", component: BenefitsPage, title: "Farmer benefits \xB7 Varsapradaya Carbon" }];
export {
  benefits_routes_default as default
};
//# debugId=e27f4cda-e8f6-5065-a19a-ccb65e5678ab
//# sourceMappingURL=chunk-U6PCGCLD.js.map
