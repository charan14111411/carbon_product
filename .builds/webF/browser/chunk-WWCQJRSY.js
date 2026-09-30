import {
  AttrInputs,
  missingRequired
} from "./chunk-QDNHTXHD.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  Chip,
  SOURCE_LABEL,
  evidenceForm
} from "./chunk-B3LTHGQM.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  HumanPipe,
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  ActivatedRoute,
  AuthService,
  Router,
  RouterLink
} from "./chunk-G6POHVBO.js";
import {
  Badge,
  Callout,
  DataClass,
  Empty,
  ErrorBox,
  Loading,
  Modal,
  PageHeader
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
  effect,
  firstValueFrom,
  inject,
  input,
  model,
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
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
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
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/practices/practice-drawer.ts
var _c0 = (a0) => ["/app/fields", a0];
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.k;
function PracticeDrawer_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 1);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function PracticeDrawer_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 2);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function PracticeDrawer_Conditional_4_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 21)(1, "strong");
    \u0275\u0275text(2, "Evidence missing.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" This practice type needs ", ctx_r0.requiredEvidence(p_r2.practice_code), ". Add it with a correction so verifiers can confirm the record. ");
  }
}
function PracticeDrawer_Conditional_4_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 22)(1, "strong");
    \u0275\u0275text(2, "Voided:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", p_r2.reason, ". It no longer counts in any calculation.");
  }
}
function PracticeDrawer_Conditional_4_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
  }
  if (rf & 2) {
    const f_r3 = ctx;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(3, _c0, f_r3.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r3.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", f_r3.name, " ");
  }
}
function PracticeDrawer_Conditional_4_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r2.field_id.slice(0, 8));
  }
}
function PracticeDrawer_Conditional_4_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "day");
  }
  if (rf & 2) {
    const p_r2 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" \u2013 ", \u0275\u0275pipeBind1(1, 1, p_r2.ended_on), " ");
  }
}
function PracticeDrawer_Conditional_4_For_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r4.value);
  }
}
function PracticeDrawer_Conditional_4_Conditional_42_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function PracticeDrawer_Conditional_4_Conditional_42_For_2_Template_button_click_0_listener() {
      const id_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.view(id_r6));
    });
    \u0275\u0275element(1, "vc-icon", 34);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_101_r7 = ctx.$index;
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("File ", \u0275$index_101_r7 + 1);
  }
}
function PracticeDrawer_Conditional_4_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275repeaterCreate(1, PracticeDrawer_Conditional_4_Conditional_42_For_2_Template, 3, 2, "button", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(p_r2.evidence_ids);
  }
}
function PracticeDrawer_Conditional_4_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "None attached");
    \u0275\u0275elementEnd();
  }
}
function PracticeDrawer_Conditional_4_For_49_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u201C", v_r8.reason, "\u201D");
  }
}
function PracticeDrawer_Conditional_4_For_49_Conditional_12_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 42);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "vc-icon", 44);
    \u0275\u0275elementStart(6, "span", 45);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r9.k);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r9.from);
    \u0275\u0275advance();
    \u0275\u0275property("size", 11);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r9.to);
  }
}
function PracticeDrawer_Conditional_4_For_49_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 41);
    \u0275\u0275repeaterCreate(1, PracticeDrawer_Conditional_4_For_49_Conditional_12_Conditional_0_For_2_Template, 8, 4, "li", null, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ch_r10 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ch_r10);
  }
}
function PracticeDrawer_Conditional_4_For_49_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PracticeDrawer_Conditional_4_For_49_Conditional_12_Conditional_0_Template, 3, 0, "ul", 41);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length ? 0 : -1);
  }
}
function PracticeDrawer_Conditional_4_For_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275element(1, "span", 35);
    \u0275\u0275elementStart(2, "div", 36)(3, "div", 37)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 38);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 39);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(11, PracticeDrawer_Conditional_4_For_49_Conditional_11_Template, 2, 1, "p", 40);
    \u0275\u0275conditionalCreate(12, PracticeDrawer_Conditional_4_For_49_Conditional_12_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_18_0;
    const v_r8 = ctx.$implicit;
    const \u0275$index_118_r11 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("void", v_r8.status === "voided")("cur", \u0275$index_118_r11 === 0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(v_r8.version === 1 ? "Recorded" : v_r8.status === "voided" ? "Voided" : "Corrected");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("v", v_r8.version);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 9, v_r8.created_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(v_r8.version > 1 ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_18_0 = ctx_r0.changes(v_r8)) ? 12 : -1, tmp_18_0);
  }
}
function PracticeDrawer_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 14)(2, "vc-badge", 15);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "vc-chip", 16);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "vc-chip", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "vc-dc", 18)(10, "span", 19);
    \u0275\u0275elementStart(11, "span", 20);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, PracticeDrawer_Conditional_4_Conditional_13_Template, 4, 1, "vc-callout", 21);
    \u0275\u0275conditionalCreate(14, PracticeDrawer_Conditional_4_Conditional_14_Template, 4, 1, "vc-callout", 22);
    \u0275\u0275elementStart(15, "dl", 23)(16, "dt");
    \u0275\u0275text(17, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275conditionalCreate(19, PracticeDrawer_Conditional_4_Conditional_19_Template, 3, 5)(20, PracticeDrawer_Conditional_4_Conditional_20_Template, 2, 1, "span", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dt");
    \u0275\u0275text(22, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "dd");
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "day");
    \u0275\u0275conditionalCreate(26, PracticeDrawer_Conditional_4_Conditional_26_Template, 2, 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dt");
    \u0275\u0275text(28, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dd", 25);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "dt");
    \u0275\u0275text(33, "Area covered");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "dd", 25);
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(37, PracticeDrawer_Conditional_4_For_38_Template, 4, 2, null, null, _forTrack0);
    \u0275\u0275elementStart(39, "dt");
    \u0275\u0275text(40, "Evidence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "dd");
    \u0275\u0275conditionalCreate(42, PracticeDrawer_Conditional_4_Conditional_42_Template, 3, 0, "div", 26)(43, PracticeDrawer_Conditional_4_Conditional_43_Template, 2, 0, "span", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div")(45, "h3", 28);
    \u0275\u0275text(46, "History");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "ol", 29);
    \u0275\u0275repeaterCreate(48, PracticeDrawer_Conditional_4_For_49_Template, 13, 12, "li", 30, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_11_0;
    const p_r2 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r2.status === "voided" ? "voided" : "active");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r2.status === "voided" ? "Voided" : "Current");
    \u0275\u0275advance();
    \u0275\u0275property("tone", p_r2.scenario === "baseline" ? "outline" : "forest");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(6, 15, p_r2.scenario), " scenario");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.src(p_r2.source));
    \u0275\u0275advance();
    \u0275\u0275property("cls", p_r2.data_class);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Version ", p_r2.version);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r2.missing_evidence ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r2.status === "voided" ? 14 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional((tmp_11_0 = ctx_r0.fieldOf(p_r2.field_id)) ? 19 : 20, tmp_11_0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 17, p_r2.performed_on));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r2.ended_on && p_r2.ended_on !== p_r2.performed_on ? 26 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r2.quantity !== null ? \u0275\u0275pipeBind2(31, 19, p_r2.quantity, 2) + " " + (p_r2.unit ?? "") : "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(p_r2.area_ha !== null ? \u0275\u0275pipeBind2(36, 22, p_r2.area_ha, 2) + " ha" : "Whole field");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.detailRows());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(p_r2.evidence_ids.length ? 42 : 43);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r0.versions());
  }
}
function PracticeDrawer_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "button", 46);
    \u0275\u0275listener("click", function PracticeDrawer_Conditional_5_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.voidOpen.set(true));
    });
    \u0275\u0275element(2, "vc-icon", 47);
    \u0275\u0275text(3, "Void");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "span", 48);
    \u0275\u0275elementStart(5, "button", 49);
    \u0275\u0275listener("click", function PracticeDrawer_Conditional_5_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.correct.emit(ctx_r0.latest()));
    });
    \u0275\u0275element(6, "vc-icon", 50);
    \u0275\u0275text(7, "Correct");
    \u0275\u0275elementEnd()();
  }
}
function PracticeDrawer_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.voidError());
  }
}
var PracticeDrawer = class _PracticeDrawer {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  recordId = input(
    null,
    ...ngDevMode ? [{ debugName: "recordId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fields = input(
    [],
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  types = input(
    [],
    ...ngDevMode ? [{ debugName: "types" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Bump to reload (after a correction). */
  refresh = input(
    0,
    ...ngDevMode ? [{ debugName: "refresh" }] : (
      /* istanbul ignore next */
      []
    )
  );
  correct = output();
  changed = output();
  versions = signal(
    [],
    ...ngDevMode ? [{ debugName: "versions" }] : (
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
  voidOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "voidOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  voidReason = signal(
    "",
    ...ngDevMode ? [{ debugName: "voidReason" }] : (
      /* istanbul ignore next */
      []
    )
  );
  voidError = signal(
    null,
    ...ngDevMode ? [{ debugName: "voidError" }] : (
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
  latest = computed(
    () => this.versions()[0] ?? null,
    ...ngDevMode ? [{ debugName: "latest" }] : (
      /* istanbul ignore next */
      []
    )
  );
  detailRows = computed(
    () => {
      const p = this.latest();
      if (!p)
        return [];
      const defs = this.types().find((t) => t.code === p.practice_code)?.fields ?? [];
      return Object.entries(p.details ?? {}).filter(([k]) => k !== "client_ref").map(([k, v]) => {
        const d = defs.find((x) => x.key === k);
        return { key: k, label: d?.label ?? k, value: `${v}${d?.unit ? " " + d.unit : ""}` };
      });
    },
    ...ngDevMode ? [{ debugName: "detailRows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const id = this.recordId();
      this.refresh();
      if (!id || !this.open())
        return;
      this.load(id);
    });
  }
  load(id) {
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/practices/${id}/versions`).subscribe({
      next: (r) => {
        this.versions.set([...r].sort((a, b) => b.version - a.version));
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  typeName(code) {
    return this.types().find((t) => t.code === code)?.name ?? code;
  }
  fieldOf(id) {
    return this.fields().find((f) => f.id === id) ?? null;
  }
  src(s) {
    return SOURCE_LABEL[s] ?? s;
  }
  requiredEvidence(code) {
    return (this.types().find((t) => t.code === code)?.required_evidence ?? []).map((e) => e.replace(/_/g, " ")).join(", ") || "evidence";
  }
  /** What changed between a version and the one before it. */
  changes(v) {
    const prev = this.versions().find((x) => x.version === v.version - 1);
    if (!prev || v.status === "voided")
      return [];
    const out = [];
    const cmp = (k, a, b) => {
      const s = (x) => x === null || x === void 0 || x === "" ? "\u2014" : typeof x === "object" ? JSON.stringify(x) : String(x);
      if (s(a) !== s(b))
        out.push({ k, from: s(a), to: s(b) });
    };
    cmp("Field", this.fieldOf(prev.field_id)?.code ?? prev.field_id, this.fieldOf(v.field_id)?.code ?? v.field_id);
    cmp("Practice", this.typeName(prev.practice_code), this.typeName(v.practice_code));
    cmp("Scenario", prev.scenario, v.scenario);
    cmp("Date", prev.performed_on, v.performed_on);
    cmp("End date", prev.ended_on, v.ended_on);
    cmp("Quantity", prev.quantity, v.quantity);
    cmp("Area (ha)", prev.area_ha, v.area_ha);
    cmp("Evidence files", prev.evidence_ids.length, v.evidence_ids.length);
    const keys = /* @__PURE__ */ new Set([...Object.keys(prev.details ?? {}), ...Object.keys(v.details ?? {})]);
    keys.delete("client_ref");
    for (const k of keys)
      cmp(k, prev.details?.[k], v.details?.[k]);
    return out;
  }
  view(id) {
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: (b) => window.open(URL.createObjectURL(b), "_blank"),
      error: (e) => this.toast.apiError(e, "Couldn't open the file")
    });
  }
  doVoid() {
    const p = this.latest();
    this.busy.set(true);
    this.voidError.set(null);
    this.api.post(`/practices/${p.record_id}/void`, { reason: this.voidReason().trim() }).subscribe({
      next: () => {
        this.busy.set(false);
        this.voidOpen.set(false);
        this.voidReason.set("");
        this.toast.success("Practice record voided");
        this.load(p.record_id);
        this.changed.emit();
      },
      error: (e) => {
        this.busy.set(false);
        this.voidError.set(e.message);
      }
    });
  }
  static \u0275fac = function PracticeDrawer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PracticeDrawer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PracticeDrawer, selectors: [["vc-practice-drawer"]], inputs: { open: [1, "open"], recordId: [1, "recordId"], fields: [1, "fields"], types: [1, "types"], refresh: [1, "refresh"] }, outputs: { open: "openChange", correct: "correct", changed: "changed" }, decls: 23, vars: 13, consts: [["width", "560px", 3, "openChange", "open", "drawer", "title", "subtitle"], [3, "rows"], ["title", "Couldn't load this record", 3, "message"], [1, "stack"], ["footer", "", 1, "ft"], ["title", "Void this practice record?", "width", "480px", 3, "openChange", "open"], [1, "field", "mt"], ["for", "v-reason"], [1, "req"], ["id", "v-reason", "rows", "3", "placeholder", "e.g. Recorded twice \u2014 duplicate of the 12 June entry", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], ["tone", "danger", "icon", "alert", 1, "mt"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-danger", 3, "click", "disabled"], [1, "chips"], [3, "status"], [3, "tone"], ["tone", "outline"], [3, "cls"], [1, "spacer"], [1, "subtle", "small"], ["tone", "warn", "icon", "file-warning"], ["tone", "info", "icon", "ban"], [1, "kv"], [1, "mono", "small"], [1, "num"], [1, "ev"], [1, "subtle"], [1, "sec"], [1, "tl"], [3, "void", "cur"], [3, "routerLink"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "file", 3, "size"], [1, "pt"], [1, "c"], [1, "h"], [1, "vn", "mono"], [1, "at"], [1, "why"], [1, "diff"], [1, "k"], [1, "from"], ["name", "arrow-right", 3, "size"], [1, "to"], [1, "btn", "btn-ghost", "danger-txt", 3, "click"], ["name", "ban"], [1, "grow"], [1, "btn", "btn-primary", 3, "click"], ["name", "pencil"]], template: function PracticeDrawer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275pipe(1, "day");
      \u0275\u0275twoWayListener("openChange", function PracticeDrawer_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(2, PracticeDrawer_Conditional_2_Template, 1, 1, "vc-loading", 1)(3, PracticeDrawer_Conditional_3_Template, 1, 1, "vc-error", 2)(4, PracticeDrawer_Conditional_4_Template, 50, 25, "div", 3);
      \u0275\u0275conditionalCreate(5, PracticeDrawer_Conditional_5_Template, 8, 0, "div", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "vc-modal", 5);
      \u0275\u0275twoWayListener("openChange", function PracticeDrawer_Template_vc_modal_openChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.voidOpen, $event) || (ctx.voidOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "A voided record stays in the history for the audit trail but no longer counts in any calculation. This can't be undone.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 6)(10, "label", 7);
      \u0275\u0275text(11, "Reason ");
      \u0275\u0275elementStart(12, "span", 8);
      \u0275\u0275text(13, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "textarea", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticeDrawer_Template_textarea_ngModelChange_14_listener($event) {
        return ctx.voidReason.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "span", 10);
      \u0275\u0275text(16, "At least 5 characters.");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(17, PracticeDrawer_Conditional_17_Template, 2, 1, "vc-callout", 11);
      \u0275\u0275elementStart(18, "div", 4)(19, "button", 12);
      \u0275\u0275listener("click", function PracticeDrawer_Template_button_click_19_listener() {
        return ctx.voidOpen.set(false);
      });
      \u0275\u0275text(20, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "button", 13);
      \u0275\u0275listener("click", function PracticeDrawer_Template_button_click_21_listener() {
        return ctx.doVoid();
      });
      \u0275\u0275text(22);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_4_0;
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275property("drawer", true)("title", ctx.latest() ? ctx.typeName(ctx.latest().practice_code) : "Practice record")("subtitle", ctx.latest() ? (ctx.fieldOf(ctx.latest().field_id)?.code ?? "") + " \xB7 " + \u0275\u0275pipeBind1(1, 11, ctx.latest().performed_on) : "");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 2 : ctx.error() ? 3 : (tmp_4_0 = ctx.latest()) ? 4 : -1, tmp_4_0);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.latest() && ctx.latest().status !== "voided" && ctx.auth.can("practice.record") ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.voidOpen);
      \u0275\u0275advance(8);
      \u0275\u0275property("ngModel", ctx.voidReason());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.voidError() ? 17 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.voidReason().trim().length < 5 || ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.busy() ? "Voiding\u2026" : "Void record");
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, RouterLink, Modal, Loading, ErrorBox, Callout, Badge, DataClass, Icon, Chip, DayPipe, HumanPipe, NumPipe], styles: ['\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.ev[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.sec[_ngcontent-%COMP%] {\n  font-size: 12px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n  margin: 6px 0 10px;\n}\n.tl[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.tl[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  gap: 12px;\n  padding-bottom: 16px;\n}\n.tl[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(:last-child)::before {\n  content: "";\n  position: absolute;\n  left: 5px;\n  top: 14px;\n  bottom: 0;\n  width: 2px;\n  background: var(--%NS%sand-200);\n}\n.pt[_ngcontent-%COMP%] {\n  flex: none;\n  width: 12px;\n  height: 12px;\n  margin-top: 4px;\n  border-radius: 50%;\n  border: 2px solid var(--%NS%stone-400);\n  background: var(--%NS%surface);\n}\n.cur[_ngcontent-%COMP%]   .pt[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-500);\n}\n.void[_ngcontent-%COMP%]   .pt[_ngcontent-%COMP%] {\n  border-color: var(--%NS%red-600);\n}\n.c[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.h[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: baseline;\n}\n.vn[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.at[_ngcontent-%COMP%] {\n  margin-left: auto;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.why[_ngcontent-%COMP%] {\n  margin-top: 3px;\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n}\n.diff[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 6px 0 0;\n  padding: 8px 10px;\n  border-radius: 6px;\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.diff[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 12px;\n  flex-wrap: wrap;\n}\n.k[_ngcontent-%COMP%] {\n  color: var(--%NS%text-2);\n  min-width: 90px;\n}\n.from[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-500);\n  text-decoration: line-through;\n}\n.to[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n  font-weight: 500;\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  width: 100%;\n}\n.grow[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.danger-txt[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.req[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n/*# sourceMappingURL=practice-drawer.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PracticeDrawer, [{
    type: Component,
    args: [{ selector: "vc-practice-drawer", imports: [FormsModule, RouterLink, Modal, Loading, ErrorBox, Callout, Badge, DataClass, Icon, Chip, DayPipe, HumanPipe, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" [drawer]="true" width="560px" [title]="latest() ? typeName(latest()!.practice_code) : 'Practice record'"
      [subtitle]="latest() ? (fieldOf(latest()!.field_id)?.code ?? '') + ' \xB7 ' + (latest()!.performed_on | day) : ''">
      @if (loading()) { <vc-loading [rows]="6" /> }
      @else if (error()) { <vc-error title="Couldn't load this record" [message]="error()!" /> }
      @else if (latest(); as p) {
        <div class="stack">
          <div class="chips">
            <vc-badge [status]="p.status === 'voided' ? 'voided' : 'active'">{{ p.status === 'voided' ? 'Voided' : 'Current' }}</vc-badge>
            <vc-chip [tone]="p.scenario === 'baseline' ? 'outline' : 'forest'">{{ p.scenario | human }} scenario</vc-chip>
            <vc-chip tone="outline">{{ src(p.source) }}</vc-chip>
            <vc-dc [cls]="p.data_class" />
            <span class="spacer"></span>
            <span class="subtle small">Version {{ p.version }}</span>
          </div>

          @if (p.missing_evidence) {
            <vc-callout tone="warn" icon="file-warning">
              <strong>Evidence missing.</strong> This practice type needs {{ requiredEvidence(p.practice_code) }}. Add it with a correction so verifiers can confirm the record.
            </vc-callout>
          }
          @if (p.status === 'voided') {
            <vc-callout tone="info" icon="ban"><strong>Voided:</strong> {{ p.reason }}. It no longer counts in any calculation.</vc-callout>
          }

          <dl class="kv">
            <dt>Field</dt>
            <dd>@if (fieldOf(p.field_id); as f) { <a [routerLink]="['/app/fields', f.id]">{{ f.code }}</a> \xB7 {{ f.name }} } @else { <span class="mono small">{{ p.field_id.slice(0, 8) }}</span> }</dd>
            <dt>Date</dt><dd>{{ p.performed_on | day }}@if (p.ended_on && p.ended_on !== p.performed_on) { \u2013 {{ p.ended_on | day }} }</dd>
            <dt>Quantity</dt><dd class="num">{{ p.quantity !== null ? (p.quantity | num: 2) + ' ' + (p.unit ?? '') : '\u2014' }}</dd>
            <dt>Area covered</dt><dd class="num">{{ p.area_ha !== null ? (p.area_ha | num: 2) + ' ha' : 'Whole field' }}</dd>
            @for (d of detailRows(); track d.key) { <dt>{{ d.label }}</dt><dd>{{ d.value }}</dd> }
            <dt>Evidence</dt>
            <dd>
              @if (p.evidence_ids.length) {
                <div class="ev">
                  @for (id of p.evidence_ids; track id; let i = $index) {
                    <button class="btn btn-secondary btn-sm" (click)="view(id)"><vc-icon name="file" [size]="13" />File {{ i + 1 }}</button>
                  }
                </div>
              } @else { <span class="subtle">None attached</span> }
            </dd>
          </dl>

          <div>
            <h3 class="sec">History</h3>
            <ol class="tl">
              @for (v of versions(); track v.id) {
                <li [class.void]="v.status === 'voided'" [class.cur]="$first">
                  <span class="pt"></span>
                  <div class="c">
                    <div class="h">
                      <strong>{{ v.version === 1 ? 'Recorded' : v.status === 'voided' ? 'Voided' : 'Corrected' }}</strong>
                      <span class="vn mono">v{{ v.version }}</span>
                      <span class="at">{{ v.created_at | day: true }}</span>
                    </div>
                    @if (v.version > 1) { <p class="why">\u201C{{ v.reason }}\u201D</p> }
                    @if (changes(v); as ch) {
                      @if (ch.length) {
                        <ul class="diff">@for (c of ch; track c.k) { <li><span class="k">{{ c.k }}</span><span class="from">{{ c.from }}</span><vc-icon name="arrow-right" [size]="11" /><span class="to">{{ c.to }}</span></li> }</ul>
                      }
                    }
                  </div>
                </li>
              }
            </ol>
          </div>
        </div>
      }

      @if (latest() && latest()!.status !== 'voided' && auth.can('practice.record')) {
        <div footer class="ft">
          <button class="btn btn-ghost danger-txt" (click)="voidOpen.set(true)"><vc-icon name="ban" />Void</button>
          <span class="grow"></span>
          <button class="btn btn-primary" (click)="correct.emit(latest()!)"><vc-icon name="pencil" />Correct</button>
        </div>
      }
    </vc-modal>

    <vc-modal [(open)]="voidOpen" title="Void this practice record?" width="480px">
      <p>A voided record stays in the history for the audit trail but no longer counts in any calculation. This can't be undone.</p>
      <div class="field mt">
        <label for="v-reason">Reason <span class="req">*</span></label>
        <textarea id="v-reason" class="input" rows="3" [ngModel]="voidReason()" (ngModelChange)="voidReason.set($event)" placeholder="e.g. Recorded twice \u2014 duplicate of the 12 June entry"></textarea>
        <span class="hint">At least 5 characters.</span>
      </div>
      @if (voidError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ voidError() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="voidOpen.set(false)">Cancel</button>
        <button class="btn btn-danger" [disabled]="voidReason().trim().length < 5 || busy()" (click)="doVoid()">{{ busy() ? 'Voiding\u2026' : 'Void record' }}</button>
      </div>
    </vc-modal>
  `, styles: ['/* angular:styles/component:scss;d7624d451948298f;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\practices\\practice-drawer.ts */\n.chips {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.spacer {\n  flex: 1;\n}\n.ev {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.sec {\n  font-size: 12px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--text-3);\n  margin: 6px 0 10px;\n}\n.tl {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.tl li {\n  position: relative;\n  display: flex;\n  gap: 12px;\n  padding-bottom: 16px;\n}\n.tl li:not(:last-child)::before {\n  content: "";\n  position: absolute;\n  left: 5px;\n  top: 14px;\n  bottom: 0;\n  width: 2px;\n  background: var(--sand-200);\n}\n.pt {\n  flex: none;\n  width: 12px;\n  height: 12px;\n  margin-top: 4px;\n  border-radius: 50%;\n  border: 2px solid var(--stone-400);\n  background: var(--surface);\n}\n.cur .pt {\n  border-color: var(--forest-500);\n  background: var(--forest-500);\n}\n.void .pt {\n  border-color: var(--red-600);\n}\n.c {\n  flex: 1;\n  min-width: 0;\n}\n.h {\n  display: flex;\n  gap: 8px;\n  align-items: baseline;\n}\n.vn {\n  font-size: 11px;\n  color: var(--text-3);\n}\n.at {\n  margin-left: auto;\n  font-size: 12px;\n  color: var(--text-3);\n}\n.why {\n  margin-top: 3px;\n  font-size: 13px;\n  color: var(--stone-700);\n}\n.diff {\n  list-style: none;\n  margin: 6px 0 0;\n  padding: 8px 10px;\n  border-radius: 6px;\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.diff li {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 12px;\n  flex-wrap: wrap;\n}\n.k {\n  color: var(--text-2);\n  min-width: 90px;\n}\n.from {\n  color: var(--stone-500);\n  text-decoration: line-through;\n}\n.to {\n  color: var(--stone-900);\n  font-weight: 500;\n}\n.ft {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  width: 100%;\n}\n.grow {\n  flex: 1;\n}\n.danger-txt {\n  color: var(--danger);\n}\n.req {\n  color: var(--danger);\n}\n.mt {\n  margin-top: 14px;\n}\n/*# sourceMappingURL=practice-drawer.css.map */\n'] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], recordId: [{ type: Input, args: [{ isSignal: true, alias: "recordId", required: false }] }], fields: [{ type: Input, args: [{ isSignal: true, alias: "fields", required: false }] }], types: [{ type: Input, args: [{ isSignal: true, alias: "types", required: false }] }], refresh: [{ type: Input, args: [{ isSignal: true, alias: "refresh", required: false }] }], correct: [{ type: Output, args: ["correct"] }], changed: [{ type: Output, args: ["changed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PracticeDrawer, { className: "PracticeDrawer", filePath: "src/app/features/practices/practice-drawer.ts", lineNumber: 137 });
})();

// src/app/features/practices/practice-form.ts
var _forTrack02 = ($index, $item) => $item.id;
var _forTrack12 = ($index, $item) => $item.cat;
var _forTrack22 = ($index, $item) => $item.code;
var _forTrack3 = ($index, $item) => $item[0];
function PracticeForm_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", f_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", f_r1.code, " \xB7 ", f_r1.name, "", f_r1.crop_code ? " \xB7 " + ctx_r1.cropName(f_r1.crop_code) : "");
  }
}
function PracticeForm_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r3.area_ha.toFixed(2), " ha \xB7 crop: ", f_r3.crop_code ? ctx_r1.cropName(f_r3.crop_code) : "not set \u2014 all practice types are shown");
  }
}
function PracticeForm_For_21_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r4 = ctx.$implicit;
    \u0275\u0275property("value", t_r4.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r4.name);
  }
}
function PracticeForm_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "optgroup", 13);
    \u0275\u0275pipe(1, "human");
    \u0275\u0275repeaterCreate(2, PracticeForm_For_21_For_3_Template, 2, 2, "option", 9, _forTrack22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r5 = ctx.$implicit;
    \u0275\u0275property("label", \u0275\u0275pipeBind1(1, 1, g_r5.cat));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(g_r5.items);
  }
}
function PracticeForm_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.pt().description);
  }
}
function PracticeForm_Conditional_55_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function PracticeForm_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "label", 43);
    \u0275\u0275text(2, "Quantity ");
    \u0275\u0275conditionalCreate(3, PracticeForm_Conditional_55_Conditional_3_Template, 2, 0, "span", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 26)(5, "input", 44);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PracticeForm_Conditional_55_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.quantity.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 28);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.pt().requires_quantity ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r1.quantity());
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.pt().unit);
  }
}
function PracticeForm_Conditional_67_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r8 = ctx.$implicit;
    \u0275\u0275property("value", s_r8[0]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r8[1]);
  }
}
function PracticeForm_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "label", 45);
    \u0275\u0275text(2, "Reported via");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 46);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PracticeForm_Conditional_67_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.source.set($event));
    });
    \u0275\u0275repeaterCreate(4, PracticeForm_Conditional_67_For_5_Template, 2, 2, "option", 9, _forTrack3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r1.source());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.sources);
  }
}
function PracticeForm_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 14);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "vc-attr-inputs", 47);
    \u0275\u0275twoWayListener("valuesChange", function PracticeForm_Conditional_68_Template_vc_attr_inputs_valuesChange_3_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.extra, $event) || (ctx_r1.extra = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.pt().name, " details");
    \u0275\u0275advance();
    \u0275\u0275property("defs", ctx_r1.pt().fields);
    \u0275\u0275twoWayProperty("values", ctx_r1.extra);
  }
}
function PracticeForm_Conditional_72_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-chip", 48);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, e_r10));
  }
}
function PracticeForm_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1, "required: ");
    \u0275\u0275repeaterCreate(2, PracticeForm_Conditional_72_For_3_Template, 3, 3, "vc-chip", 48, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.pt().required_evidence);
  }
}
function PracticeForm_For_75_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "vc-icon", 49);
    \u0275\u0275elementStart(2, "span", 50);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 51);
    \u0275\u0275text(5, "already attached");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 52);
    \u0275\u0275listener("click", function PracticeForm_For_75_Template_button_click_6_listener() {
      const id_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.keptEvidence.set(ctx_r1.keptEvidence().filter((k) => k !== id_r12)));
    });
    \u0275\u0275element(7, "vc-icon", 53);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const id_r12 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(id_r12.slice(0, 8));
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 13);
  }
}
function PracticeForm_For_77_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "vc-icon", 54);
    \u0275\u0275elementStart(2, "span", 55);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 51);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 52);
    \u0275\u0275listener("click", function PracticeForm_For_77_Template_button_click_6_listener() {
      const $index_r14 = \u0275\u0275restoreView(_r13).$index;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.removeFile($index_r14));
    });
    \u0275\u0275element(7, "vc-icon", 53);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r15.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", (f_r15.size / 1024).toFixed(0), " KB");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
  }
}
function PracticeForm_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275element(1, "vc-icon", 56);
    \u0275\u0275text(2, "You can save without evidence, but the record will be flagged as missing evidence.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function PracticeForm_Conditional_83_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "label", 57);
    \u0275\u0275text(2, "Reason for the correction ");
    \u0275\u0275elementStart(3, "span", 15);
    \u0275\u0275text(4, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "textarea", 58);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PracticeForm_Conditional_83_Template_textarea_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.reason.set($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r1.reason());
    \u0275\u0275control();
  }
}
function PracticeForm_Conditional_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
var PracticeForm = class _PracticeForm {
  api = inject(ApiService);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fields = input(
    [],
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropNames = input(
    /* @__PURE__ */ new Map(),
    ...ngDevMode ? [{ debugName: "cropNames" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** When set, the form saves a correction of this record. */
  record = input(
    null,
    ...ngDevMode ? [{ debugName: "record" }] : (
      /* istanbul ignore next */
      []
    )
  );
  presetFieldId = input(
    null,
    ...ngDevMode ? [{ debugName: "presetFieldId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saved = output();
  sources = Object.entries(SOURCE_LABEL);
  today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  fieldQ = signal(
    "",
    ...ngDevMode ? [{ debugName: "fieldQ" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldId = signal(
    "",
    ...ngDevMode ? [{ debugName: "fieldId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  code = signal(
    "",
    ...ngDevMode ? [{ debugName: "code" }] : (
      /* istanbul ignore next */
      []
    )
  );
  scenario = signal(
    "",
    ...ngDevMode ? [{ debugName: "scenario" }] : (
      /* istanbul ignore next */
      []
    )
  );
  performedOn = signal(
    "",
    ...ngDevMode ? [{ debugName: "performedOn" }] : (
      /* istanbul ignore next */
      []
    )
  );
  endedOn = signal(
    "",
    ...ngDevMode ? [{ debugName: "endedOn" }] : (
      /* istanbul ignore next */
      []
    )
  );
  quantity = signal(
    null,
    ...ngDevMode ? [{ debugName: "quantity" }] : (
      /* istanbul ignore next */
      []
    )
  );
  area = signal(
    null,
    ...ngDevMode ? [{ debugName: "area" }] : (
      /* istanbul ignore next */
      []
    )
  );
  source = signal(
    "field_app",
    ...ngDevMode ? [{ debugName: "source" }] : (
      /* istanbul ignore next */
      []
    )
  );
  extra = signal(
    {},
    ...ngDevMode ? [{ debugName: "extra" }] : (
      /* istanbul ignore next */
      []
    )
  );
  files = signal(
    [],
    ...ngDevMode ? [{ debugName: "files" }] : (
      /* istanbul ignore next */
      []
    )
  );
  keptEvidence = signal(
    [],
    ...ngDevMode ? [{ debugName: "keptEvidence" }] : (
      /* istanbul ignore next */
      []
    )
  );
  reason = signal(
    "",
    ...ngDevMode ? [{ debugName: "reason" }] : (
      /* istanbul ignore next */
      []
    )
  );
  types = signal(
    [],
    ...ngDevMode ? [{ debugName: "types" }] : (
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
  error = signal(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  clientRef = "";
  correcting = computed(
    () => !!this.record(),
    ...ngDevMode ? [{ debugName: "correcting" }] : (
      /* istanbul ignore next */
      []
    )
  );
  field = computed(
    () => this.fields().find((f) => f.id === this.fieldId()) ?? null,
    ...ngDevMode ? [{ debugName: "field" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pt = computed(
    () => this.types().find((t) => t.code === this.code()) ?? null,
    ...ngDevMode ? [{ debugName: "pt" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldOptions = computed(
    () => {
      const q = this.fieldQ().toLowerCase().trim();
      return this.fields().filter((f) => f.id === this.fieldId() || !q || `${f.code} ${f.name}`.toLowerCase().includes(q)).slice(0, 300);
    },
    ...ngDevMode ? [{ debugName: "fieldOptions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  typeGroups = computed(
    () => {
      const m = /* @__PURE__ */ new Map();
      for (const t of this.types()) {
        if (!t.is_active && t.code !== this.code())
          continue;
        m.set(t.category, [...m.get(t.category) ?? [], t]);
      }
      return [...m.entries()].map(([cat, items]) => ({ cat, items }));
    },
    ...ngDevMode ? [{ debugName: "typeGroups" }] : (
      /* istanbul ignore next */
      []
    )
  );
  problem = computed(
    () => {
      if (!this.fieldId())
        return "Choose a field";
      if (!this.code())
        return "Choose a practice";
      if (!this.scenario())
        return "Choose baseline or project";
      if (!this.performedOn())
        return "Enter the date performed";
      if (this.endedOn() && this.endedOn() < this.performedOn())
        return "The end date can't be before the start";
      const q = this.quantity();
      if (this.pt()?.requires_quantity && (q === null || q === "" || q === void 0))
        return "Enter the quantity";
      const miss = missingRequired(this.pt()?.fields ?? [], this.extra());
      if (miss.length)
        return `Fill in: ${miss.join(", ")}`;
      if (this.correcting() && this.reason().trim().length < 5)
        return "Say why the record is being corrected";
      return null;
    },
    ...ngDevMode ? [{ debugName: "problem" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (!this.open())
        return;
      const r = this.record();
      this.error.set(null);
      this.files.set([]);
      this.reason.set("");
      this.clientRef = crypto.randomUUID();
      if (r) {
        this.fieldId.set(r.field_id);
        this.code.set(r.practice_code);
        this.scenario.set(r.scenario);
        this.performedOn.set(r.performed_on);
        this.endedOn.set(r.ended_on ?? "");
        this.quantity.set(r.quantity);
        this.area.set(r.area_ha);
        this.keptEvidence.set([...r.evidence_ids]);
        this.extra.set(Object.fromEntries(Object.entries(r.details ?? {}).filter(([k]) => k !== "client_ref")));
      } else {
        this.fieldId.set(this.presetFieldId() ?? "");
        this.code.set("");
        this.scenario.set("");
        this.performedOn.set("");
        this.endedOn.set("");
        this.quantity.set(null);
        this.area.set(null);
        this.keptEvidence.set([]);
        this.extra.set({});
      }
      this.loadTypes();
    });
  }
  cropName(code) {
    return this.cropNames().get(code) ?? code;
  }
  pickField(id) {
    this.fieldId.set(id);
    this.loadTypes();
  }
  pickType(code) {
    this.code.set(code);
    this.extra.set({});
    if (!this.pt()?.unit && !this.pt()?.requires_quantity)
      this.quantity.set(null);
  }
  loadTypes() {
    const crop = this.field()?.crop_code;
    this.api.get("/catalogue/practice-types", { crop_code: crop ?? void 0 }).subscribe({
      next: (r) => {
        const cur = this.code();
        this.types.set(r);
        if (cur && !r.some((t) => t.code === cur) && !this.correcting())
          this.code.set("");
        if (cur && this.correcting() && !r.some((t) => t.code === cur)) {
          this.api.get("/catalogue/practice-types", { include_inactive: true }).subscribe({
            next: (all) => {
              const t = all.find((x) => x.code === cur);
              if (t)
                this.types.set([...r, t]);
            }
          });
        }
      }
    });
  }
  addFiles(e) {
    const list = Array.from(e.target.files ?? []);
    this.files.update((f) => [...f, ...list]);
    e.target.value = "";
  }
  removeFile(i) {
    this.files.update((f) => f.filter((_, k) => k !== i));
  }
  async save() {
    if (this.problem())
      return;
    this.saving.set(true);
    this.error.set(null);
    try {
      const ids = [...this.keptEvidence()];
      for (const f of this.files()) {
        const ev = await firstValueFrom(this.api.upload("/evidence", evidenceForm(f, f.type.startsWith("image/") ? "photo" : "document", "practice")));
        ids.push(ev.id);
      }
      this.files.set([]);
      this.keptEvidence.set(ids);
      const num = (v) => v === null || v === "" || v === void 0 ? null : Number(v);
      const body = {
        field_id: this.fieldId(),
        practice_code: this.code(),
        scenario: this.scenario(),
        performed_on: this.performedOn(),
        ended_on: this.endedOn() || null,
        quantity: num(this.quantity()),
        unit: num(this.quantity()) !== null ? this.pt()?.unit ?? null : null,
        area_ha: num(this.area()),
        extra: this.extra(),
        evidence_ids: ids
      };
      let out;
      if (this.correcting()) {
        out = await firstValueFrom(this.api.post(`/practices/${this.record().record_id}/versions`, __spreadProps(__spreadValues({}, body), { reason: this.reason().trim() })));
      } else {
        out = await firstValueFrom(this.api.post("/practices", __spreadProps(__spreadValues({}, body), { source: this.source(), client_ref: this.clientRef }), { "Idempotency-Key": this.clientRef }));
      }
      this.saved.emit(out);
      this.open.set(false);
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  static \u0275fac = function PracticeForm_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PracticeForm)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PracticeForm, selectors: [["vc-practice-form"]], inputs: { open: [1, "open"], fields: [1, "fields"], cropNames: [1, "cropNames"], record: [1, "record"], presetFieldId: [1, "presetFieldId"] }, outputs: { open: "openChange", saved: "saved" }, decls: 93, vars: 33, consts: [["width", "720px", 3, "openChange", "open", "title", "subtitle"], [1, "stack"], [1, "form-grid"], [1, "field", "span-2"], ["for", "p-field"], [1, "picker"], ["placeholder", "Search by field code or name\u2026", "aria-label", "Search fields", 1, "input", 3, "ngModelChange", "ngModel"], ["id", "p-field", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "hint"], ["for", "p-type"], ["id", "p-type", 1, "input", 3, "ngModelChange", "ngModel", "disabled"], [3, "label"], [1, "label"], [1, "req"], ["role", "radiogroup", "aria-label", "Scenario", 1, "scen"], ["type", "button", "role", "radio", 3, "click"], [1, "dot"], [1, "field"], ["for", "p-on"], ["id", "p-on", "type", "date", 1, "input", 3, "ngModelChange", "ngModel", "max"], ["for", "p-end"], [1, "subtle"], ["id", "p-end", "type", "date", 1, "input", 3, "ngModelChange", "ngModel", "min"], ["for", "p-area"], [1, "unit-wrap"], ["id", "p-area", "type", "number", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel", "placeholder"], [1, "unit"], [1, "extra"], [1, "req-ev"], [1, "files"], [1, "file"], [1, "add"], ["type", "file", "multiple", "", "hidden", "", "accept", "image/*,application/pdf", 3, "change"], ["name", "upload", 3, "size"], [1, "warn-hint"], ["tone", "danger", "icon", "alert"], ["footer", "", 1, "ft"], [1, "subtle", "small", "grow"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], ["for", "p-q"], ["id", "p-q", "type", "number", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "p-src"], ["id", "p-src", 1, "input", 3, "ngModelChange", "ngModel"], [3, "valuesChange", "defs", "values"], ["tone", "amber"], ["name", "file-check", 3, "size"], [1, "mono", "small"], [1, "subtle", "small"], ["type", "button", "aria-label", "Remove", 1, "x", 3, "click"], ["name", "x", 3, "size"], ["name", "file", 3, "size"], [1, "truncate"], ["name", "alert", 3, "size"], ["for", "p-reason"], ["id", "p-reason", "rows", "2", "placeholder", "e.g. Quantity was entered in bags instead of kg", 1, "input", 3, "ngModelChange", "ngModel"]], template: function PracticeForm_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function PracticeForm_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "label", 4);
      \u0275\u0275text(5, "Field");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 5)(7, "input", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticeForm_Template_input_ngModelChange_7_listener($event) {
        return ctx.fieldQ.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "select", 7);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticeForm_Template_select_ngModelChange_8_listener($event) {
        return ctx.pickField($event);
      });
      \u0275\u0275elementStart(9, "option", 8);
      \u0275\u0275text(10, "Choose a field\u2026");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(11, PracticeForm_For_12_Template, 2, 4, "option", 9, _forTrack02);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(13, PracticeForm_Conditional_13_Template, 2, 2, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 3)(15, "label", 11);
      \u0275\u0275text(16, "Practice");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "select", 12);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticeForm_Template_select_ngModelChange_17_listener($event) {
        return ctx.pickType($event);
      });
      \u0275\u0275elementStart(18, "option", 8);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(20, PracticeForm_For_21_Template, 4, 3, "optgroup", 13, _forTrack12);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(22, PracticeForm_Conditional_22_Template, 2, 1, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 3)(24, "span", 14);
      \u0275\u0275text(25, "Scenario ");
      \u0275\u0275elementStart(26, "span", 15);
      \u0275\u0275text(27, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div", 16)(29, "button", 17);
      \u0275\u0275listener("click", function PracticeForm_Template_button_click_29_listener() {
        return ctx.scenario.set("baseline");
      });
      \u0275\u0275element(30, "span", 18);
      \u0275\u0275elementStart(31, "span")(32, "strong");
      \u0275\u0275text(33, "Baseline");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "small");
      \u0275\u0275text(35, "What was done before the project, or would have happened without it");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "button", 17);
      \u0275\u0275listener("click", function PracticeForm_Template_button_click_36_listener() {
        return ctx.scenario.set("project");
      });
      \u0275\u0275element(37, "span", 18);
      \u0275\u0275elementStart(38, "span")(39, "strong");
      \u0275\u0275text(40, "Project");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "small");
      \u0275\u0275text(42, "A practice carried out as part of this carbon project");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(43, "span", 10);
      \u0275\u0275text(44, "Never assumed \u2014 choose one so the record is counted in the right scenario.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div", 19)(46, "label", 20);
      \u0275\u0275text(47, "Date performed");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "input", 21);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticeForm_Template_input_ngModelChange_48_listener($event) {
        return ctx.performedOn.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 19)(50, "label", 22);
      \u0275\u0275text(51, "End date ");
      \u0275\u0275elementStart(52, "span", 23);
      \u0275\u0275text(53, "(if it ran over several days)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(54, "input", 24);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticeForm_Template_input_ngModelChange_54_listener($event) {
        return ctx.endedOn.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(55, PracticeForm_Conditional_55_Template, 8, 3, "div", 19);
      \u0275\u0275elementStart(56, "div", 19)(57, "label", 25);
      \u0275\u0275text(58, "Area covered ");
      \u0275\u0275elementStart(59, "span", 23);
      \u0275\u0275text(60, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(61, "div", 26)(62, "input", 27);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticeForm_Template_input_ngModelChange_62_listener($event) {
        return ctx.area.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "span", 28);
      \u0275\u0275text(64, "ha");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(65, "span", 10);
      \u0275\u0275text(66, "Leave empty if the whole field was covered.");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(67, PracticeForm_Conditional_67_Template, 6, 1, "div", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(68, PracticeForm_Conditional_68_Template, 4, 3, "div", 29);
      \u0275\u0275elementStart(69, "div", 19)(70, "span", 14);
      \u0275\u0275text(71, "Evidence ");
      \u0275\u0275conditionalCreate(72, PracticeForm_Conditional_72_Template, 4, 0, "span", 30);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "div", 31);
      \u0275\u0275repeaterCreate(74, PracticeForm_For_75_Template, 8, 3, "div", 32, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275repeaterCreate(76, PracticeForm_For_77_Template, 8, 4, "div", 32, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementStart(78, "label", 33)(79, "input", 34);
      \u0275\u0275listener("change", function PracticeForm_Template_input_change_79_listener($event) {
        return ctx.addFiles($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(80, "vc-icon", 35);
      \u0275\u0275text(81, "Add photos or documents");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(82, PracticeForm_Conditional_82_Template, 3, 1, "span", 36);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(83, PracticeForm_Conditional_83_Template, 6, 1, "div", 19);
      \u0275\u0275conditionalCreate(84, PracticeForm_Conditional_84_Template, 2, 1, "vc-callout", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "div", 38)(86, "span", 39);
      \u0275\u0275text(87);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "button", 40);
      \u0275\u0275listener("click", function PracticeForm_Template_button_click_88_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(89, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(90, "button", 41);
      \u0275\u0275listener("click", function PracticeForm_Template_button_click_90_listener() {
        return ctx.save();
      });
      \u0275\u0275element(91, "vc-icon", 42);
      \u0275\u0275text(92);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_8_0;
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275property("title", ctx.correcting() ? "Correct practice record" : "Record a practice")("subtitle", ctx.correcting() ? "Saves version " + (ctx.record().version + 1) + ". The earlier version stays in the history." : "Recorded practices feed the baseline and project scenarios in the carbon calculation.");
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.fieldQ());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.fieldId());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.fieldOptions());
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_8_0 = ctx.field()) ? 13 : -1, tmp_8_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.code())("disabled", !ctx.fieldId());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.fieldId() ? "Choose a practice\u2026" : "Choose a field first");
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.typeGroups());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.pt()?.description ? 22 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275classProp("on", ctx.scenario() === "baseline");
      \u0275\u0275attribute("aria-checked", ctx.scenario() === "baseline");
      \u0275\u0275advance(7);
      \u0275\u0275classProp("on", ctx.scenario() === "project");
      \u0275\u0275attribute("aria-checked", ctx.scenario() === "project");
      \u0275\u0275advance(12);
      \u0275\u0275property("ngModel", ctx.performedOn())("max", ctx.today);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.endedOn())("min", ctx.performedOn());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pt()?.requires_quantity || ctx.pt()?.unit ? 55 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.area())("placeholder", ctx.field() ? ctx.field().area_ha.toFixed(2) : "");
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275conditional(!ctx.correcting() ? 67 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pt()?.fields?.length ? 68 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.pt()?.required_evidence?.length ? 72 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.keptEvidence());
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.files());
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.pt()?.required_evidence?.length && !ctx.files().length && !ctx.keptEvidence().length ? 82 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.correcting() ? 83 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 84 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.problem() ?? "");
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", !!ctx.problem() || ctx.saving());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.saving() ? "Saving\u2026" : ctx.correcting() ? "Save correction" : "Record practice", " ");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, NgModel, Modal, Callout, Icon, AttrInputs, Chip, HumanPipe], styles: ["\n.req[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.picker[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);\n  gap: 8px;\n}\n@media (max-width: 720px) {\n  .picker[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.scen[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.scen[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  text-align: left;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: var(--%NS%radius);\n  background: var(--%NS%surface);\n  cursor: pointer;\n  font: inherit;\n  color: var(--%NS%stone-800);\n}\n.scen[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.scen[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: 0 0 0 1px var(--%NS%forest-500) inset;\n}\n.scen[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  flex: none;\n  width: 16px;\n  height: 16px;\n  margin-top: 2px;\n  border-radius: 50%;\n  border: 2px solid var(--%NS%stone-300);\n  background: var(--%NS%surface);\n}\n.scen[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-600);\n  box-shadow: inset 0 0 0 3px var(--%NS%surface);\n  background: var(--%NS%forest-600);\n}\n.scen[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n}\n.scen[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 12px;\n  color: var(--%NS%text-2);\n  margin-top: 2px;\n  line-height: 1.4;\n}\n.unit-wrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n.unit-wrap[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-right: 56px;\n}\n.unit[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.extra[_ngcontent-%COMP%] {\n  padding: 14px;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.req-ev[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  margin-left: 8px;\n  font-weight: 400;\n  color: var(--%NS%text-3);\n}\n.files[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.file[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface-2);\n}\n.file[_ngcontent-%COMP%]   .truncate[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.file[_ngcontent-%COMP%]   .mono[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.x[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  color: var(--%NS%stone-400);\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  padding: 2px;\n  border-radius: 4px;\n}\n.x[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%danger);\n  background: var(--%NS%danger-soft);\n}\n.add[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 12px;\n  border: 1.5px dashed var(--%NS%border-strong);\n  border-radius: var(--%NS%radius-sm);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n  font-size: 13px;\n}\n.add[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%forest-400);\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n}\n.warn-hint[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 12px;\n  color: var(--%NS%amber-600);\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  width: 100%;\n  justify-content: flex-end;\n}\n.grow[_ngcontent-%COMP%] {\n  margin-right: auto;\n}\n/*# sourceMappingURL=practice-form.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PracticeForm, [{
    type: Component,
    args: [{ selector: "vc-practice-form", imports: [FormsModule, Modal, Callout, Icon, AttrInputs, Chip, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" [title]="correcting() ? 'Correct practice record' : 'Record a practice'" width="720px"
      [subtitle]="correcting() ? 'Saves version ' + (record()!.version + 1) + '. The earlier version stays in the history.' : 'Recorded practices feed the baseline and project scenarios in the carbon calculation.'">
      <div class="stack">
        <div class="form-grid">
          <div class="field span-2">
            <label for="p-field">Field</label>
            <div class="picker">
              <input class="input" placeholder="Search by field code or name\u2026" [ngModel]="fieldQ()" (ngModelChange)="fieldQ.set($event)" aria-label="Search fields" />
              <select id="p-field" class="input" [ngModel]="fieldId()" (ngModelChange)="pickField($event)">
                <option value="">Choose a field\u2026</option>
                @for (f of fieldOptions(); track f.id) { <option [value]="f.id">{{ f.code }} \xB7 {{ f.name }}{{ f.crop_code ? ' \xB7 ' + cropName(f.crop_code) : '' }}</option> }
              </select>
            </div>
            @if (field(); as f) {
              <span class="hint">{{ f.area_ha.toFixed(2) }} ha \xB7 crop: {{ f.crop_code ? cropName(f.crop_code) : 'not set \u2014 all practice types are shown' }}</span>
            }
          </div>

          <div class="field span-2">
            <label for="p-type">Practice</label>
            <select id="p-type" class="input" [ngModel]="code()" (ngModelChange)="pickType($event)" [disabled]="!fieldId()">
              <option value="">{{ fieldId() ? 'Choose a practice\u2026' : 'Choose a field first' }}</option>
              @for (g of typeGroups(); track g.cat) {
                <optgroup [label]="g.cat | human">
                  @for (t of g.items; track t.code) { <option [value]="t.code">{{ t.name }}</option> }
                </optgroup>
              }
            </select>
            @if (pt()?.description) { <span class="hint">{{ pt()!.description }}</span> }
          </div>

          <div class="field span-2">
            <span class="label">Scenario <span class="req">*</span></span>
            <div class="scen" role="radiogroup" aria-label="Scenario">
              <button type="button" role="radio" [attr.aria-checked]="scenario() === 'baseline'" [class.on]="scenario() === 'baseline'" (click)="scenario.set('baseline')">
                <span class="dot"></span><span><strong>Baseline</strong><small>What was done before the project, or would have happened without it</small></span>
              </button>
              <button type="button" role="radio" [attr.aria-checked]="scenario() === 'project'" [class.on]="scenario() === 'project'" (click)="scenario.set('project')">
                <span class="dot"></span><span><strong>Project</strong><small>A practice carried out as part of this carbon project</small></span>
              </button>
            </div>
            <span class="hint">Never assumed \u2014 choose one so the record is counted in the right scenario.</span>
          </div>

          <div class="field"><label for="p-on">Date performed</label><input id="p-on" type="date" class="input" [ngModel]="performedOn()" (ngModelChange)="performedOn.set($event)" [max]="today" /></div>
          <div class="field"><label for="p-end">End date <span class="subtle">(if it ran over several days)</span></label><input id="p-end" type="date" class="input" [ngModel]="endedOn()" (ngModelChange)="endedOn.set($event)" [min]="performedOn()" /></div>

          @if (pt()?.requires_quantity || pt()?.unit) {
            <div class="field">
              <label for="p-q">Quantity @if (pt()!.requires_quantity) { <span class="req">*</span> }</label>
              <div class="unit-wrap"><input id="p-q" type="number" min="0" class="input num" [ngModel]="quantity()" (ngModelChange)="quantity.set($event)" /><span class="unit">{{ pt()!.unit }}</span></div>
            </div>
          }
          <div class="field">
            <label for="p-area">Area covered <span class="subtle">(optional)</span></label>
            <div class="unit-wrap"><input id="p-area" type="number" min="0" class="input num" [ngModel]="area()" (ngModelChange)="area.set($event)" [placeholder]="field() ? field()!.area_ha.toFixed(2) : ''" /><span class="unit">ha</span></div>
            <span class="hint">Leave empty if the whole field was covered.</span>
          </div>
          @if (!correcting()) {
            <div class="field">
              <label for="p-src">Reported via</label>
              <select id="p-src" class="input" [ngModel]="source()" (ngModelChange)="source.set($event)">
                @for (s of sources; track s[0]) { <option [value]="s[0]">{{ s[1] }}</option> }
              </select>
            </div>
          }
        </div>

        @if (pt()?.fields?.length) {
          <div class="extra">
            <div class="label">{{ pt()!.name }} details</div>
            <vc-attr-inputs [defs]="pt()!.fields" [(values)]="extra" />
          </div>
        }

        <div class="field">
          <span class="label">Evidence
            @if (pt()?.required_evidence?.length) { <span class="req-ev">required: @for (e of pt()!.required_evidence; track e) { <vc-chip tone="amber">{{ e | human }}</vc-chip> }</span> }
          </span>
          <div class="files">
            @for (id of keptEvidence(); track id) {
              <div class="file"><vc-icon name="file-check" [size]="15" /><span class="mono small">{{ id.slice(0, 8) }}</span><span class="subtle small">already attached</span>
                <button type="button" class="x" (click)="keptEvidence.set(keptEvidence().filter(k => k !== id))" aria-label="Remove"><vc-icon name="x" [size]="13" /></button></div>
            }
            @for (f of files(); track $index) {
              <div class="file"><vc-icon name="file" [size]="15" /><span class="truncate">{{ f.name }}</span><span class="subtle small">{{ (f.size / 1024).toFixed(0) }} KB</span>
                <button type="button" class="x" (click)="removeFile($index)" aria-label="Remove"><vc-icon name="x" [size]="13" /></button></div>
            }
            <label class="add"><input type="file" multiple hidden (change)="addFiles($event)" accept="image/*,application/pdf" /><vc-icon name="upload" [size]="15" />Add photos or documents</label>
          </div>
          @if (pt()?.required_evidence?.length && !files().length && !keptEvidence().length) {
            <span class="warn-hint"><vc-icon name="alert" [size]="13" />You can save without evidence, but the record will be flagged as missing evidence.</span>
          }
        </div>

        @if (correcting()) {
          <div class="field">
            <label for="p-reason">Reason for the correction <span class="req">*</span></label>
            <textarea id="p-reason" class="input" rows="2" [ngModel]="reason()" (ngModelChange)="reason.set($event)" placeholder="e.g. Quantity was entered in bags instead of kg"></textarea>
          </div>
        }

        @if (error()) { <vc-callout tone="danger" icon="alert">{{ error() }}</vc-callout> }
      </div>

      <div footer class="ft">
        <span class="subtle small grow">{{ problem() ?? '' }}</span>
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!problem() || saving()" (click)="save()">
          <vc-icon name="check" />{{ saving() ? 'Saving\u2026' : correcting() ? 'Save correction' : 'Record practice' }}
        </button>
      </div>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;61b4fa856a6f32f8;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\practices\\practice-form.ts */\n.req {\n  color: var(--danger);\n}\n.picker {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);\n  gap: 8px;\n}\n@media (max-width: 720px) {\n  .picker {\n    grid-template-columns: 1fr;\n  }\n}\n.scen {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.scen button {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  text-align: left;\n  padding: 12px 14px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius);\n  background: var(--surface);\n  cursor: pointer;\n  font: inherit;\n  color: var(--stone-800);\n}\n.scen button:hover {\n  border-color: var(--stone-400);\n}\n.scen button.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: 0 0 0 1px var(--forest-500) inset;\n}\n.scen .dot {\n  flex: none;\n  width: 16px;\n  height: 16px;\n  margin-top: 2px;\n  border-radius: 50%;\n  border: 2px solid var(--stone-300);\n  background: var(--surface);\n}\n.scen button.on .dot {\n  border-color: var(--forest-600);\n  box-shadow: inset 0 0 0 3px var(--surface);\n  background: var(--forest-600);\n}\n.scen strong {\n  display: block;\n  font-weight: 600;\n}\n.scen small {\n  display: block;\n  font-size: 12px;\n  color: var(--text-2);\n  margin-top: 2px;\n  line-height: 1.4;\n}\n.unit-wrap {\n  position: relative;\n}\n.unit-wrap .input {\n  padding-right: 56px;\n}\n.unit {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 12px;\n  color: var(--text-3);\n}\n.extra {\n  padding: 14px;\n  border-radius: var(--radius-sm);\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.req-ev {\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  margin-left: 8px;\n  font-weight: 400;\n  color: var(--text-3);\n}\n.files {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.file {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  background: var(--surface-2);\n}\n.file .truncate {\n  flex: 1;\n  min-width: 0;\n}\n.file .mono {\n  flex: 1;\n}\n.x {\n  border: 0;\n  background: none;\n  color: var(--stone-400);\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  padding: 2px;\n  border-radius: 4px;\n}\n.x:hover {\n  color: var(--danger);\n  background: var(--danger-soft);\n}\n.add {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 12px;\n  border: 1.5px dashed var(--border-strong);\n  border-radius: var(--radius-sm);\n  color: var(--stone-600);\n  cursor: pointer;\n  font-size: 13px;\n}\n.add:hover {\n  border-color: var(--forest-400);\n  background: var(--forest-50);\n  color: var(--forest-700);\n}\n.warn-hint {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 12px;\n  color: var(--amber-600);\n}\n.ft {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  width: 100%;\n  justify-content: flex-end;\n}\n.grow {\n  margin-right: auto;\n}\n/*# sourceMappingURL=practice-form.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], fields: [{ type: Input, args: [{ isSignal: true, alias: "fields", required: false }] }], cropNames: [{ type: Input, args: [{ isSignal: true, alias: "cropNames", required: false }] }], record: [{ type: Input, args: [{ isSignal: true, alias: "record", required: false }] }], presetFieldId: [{ type: Input, args: [{ isSignal: true, alias: "presetFieldId", required: false }] }], saved: [{ type: Output, args: ["saved"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PracticeForm, { className: "PracticeForm", filePath: "src/app/features/practices/practice-form.ts", lineNumber: 162 });
})();

// src/app/features/practices/practices.page.ts
var _forTrack03 = ($index, $item) => $item.id;
var _forTrack13 = ($index, $item) => $item.code;
function PracticesPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function PracticesPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 29);
    \u0275\u0275text(2, "Record a practice");
    \u0275\u0275elementEnd();
  }
}
function PracticesPage_For_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r3 = ctx.$implicit;
    \u0275\u0275property("value", f_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r3.code, " \xB7 ", f_r3.name);
  }
}
function PracticesPage_For_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r4 = ctx.$implicit;
    \u0275\u0275property("value", t_r4.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r4.name);
  }
}
function PracticesPage_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function PracticesPage_Conditional_53_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clear());
    });
    \u0275\u0275element(1, "vc-icon", 31);
    \u0275\u0275text(2, "Clear");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function PracticesPage_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 24);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function PracticesPage_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "vc-error", 32)(2, "button", 33);
    \u0275\u0275listener("click", function PracticesPage_Conditional_56_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
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
function PracticesPage_Conditional_57_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-empty", 34)(1, "button", 36);
    \u0275\u0275listener("click", function PracticesPage_Conditional_57_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clear());
    });
    \u0275\u0275text(2, "Clear filters");
    \u0275\u0275elementEnd()();
  }
}
function PracticesPage_Conditional_57_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function PracticesPage_Conditional_57_Conditional_1_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 29);
    \u0275\u0275text(2, "Record a practice");
    \u0275\u0275elementEnd();
  }
}
function PracticesPage_Conditional_57_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 35);
    \u0275\u0275conditionalCreate(1, PracticesPage_Conditional_57_Conditional_1_Conditional_1_Template, 3, 0, "button", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.auth.can("practice.record") ? 1 : -1);
  }
}
function PracticesPage_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PracticesPage_Conditional_57_Conditional_0_Template, 3, 0, "vc-empty", 34)(1, PracticesPage_Conditional_57_Conditional_1_Template, 2, 1, "vc-empty", 35);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.hasFilters() || ctx_r1.missingOnly() ? 0 : 1);
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 46);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u2013 ", \u0275\u0275pipeBind1(2, 1, p_r10.ended_on));
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 57);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r11 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r11.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r11.name);
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r10.field_id.slice(0, 8));
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-chip", 49);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r12 = ctx;
    \u0275\u0275property("cat", t_r12.category);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, t_r12.category));
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r10.unit);
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-badge", 52);
    \u0275\u0275text(1, "Missing");
    \u0275\u0275elementEnd();
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275element(1, "vc-icon", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r10.evidence_ids.length);
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-badge", 54);
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("v", p_r10.version, " \xB7 corrected");
  }
}
function PracticesPage_Conditional_58_For_22_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 46);
    \u0275\u0275text(1, "v1");
    \u0275\u0275elementEnd();
  }
}
function PracticesPage_Conditional_58_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 44);
    \u0275\u0275listener("click", function PracticesPage_Conditional_58_For_22_Template_tr_click_0_listener() {
      const p_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openRecord(p_r10.record_id));
    });
    \u0275\u0275elementStart(1, "td", 45);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275conditionalCreate(4, PracticesPage_Conditional_58_For_22_Conditional_4_Template, 3, 3, "span", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275conditionalCreate(6, PracticesPage_Conditional_58_For_22_Conditional_6_Template, 4, 2)(7, PracticesPage_Conditional_58_For_22_Conditional_7_Template, 2, 1, "span", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "div", 48);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, PracticesPage_Conditional_58_For_22_Conditional_11_Template, 3, 4, "vc-chip", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td")(13, "vc-chip", 50);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 51);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "num");
    \u0275\u0275conditionalCreate(19, PracticesPage_Conditional_58_For_22_Conditional_19_Template, 2, 1, "span", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td")(21, "vc-chip", 50);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "td");
    \u0275\u0275conditionalCreate(24, PracticesPage_Conditional_58_For_22_Conditional_24_Template, 2, 0, "vc-badge", 52)(25, PracticesPage_Conditional_58_For_22_Conditional_25_Template, 3, 2, "span", 53)(26, PracticesPage_Conditional_58_For_22_Conditional_26_Template, 2, 0, "span", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "td");
    \u0275\u0275conditionalCreate(28, PracticesPage_Conditional_58_For_22_Conditional_28_Template, 1, 0, "vc-badge", 54)(29, PracticesPage_Conditional_58_For_22_Conditional_29_Template, 2, 1, "span", 55)(30, PracticesPage_Conditional_58_For_22_Conditional_30_Template, 2, 0, "span", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_14_0;
    let tmp_16_0;
    const p_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("voided", p_r10.status === "voided");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 15, p_r10.performed_on));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r10.ended_on && p_r10.ended_on !== p_r10.performed_on ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_14_0 = ctx_r1.fieldOf(p_r10.field_id)) ? 6 : 7, tmp_14_0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.typeOf(p_r10.practice_code)?.name ?? p_r10.practice_code);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_16_0 = ctx_r1.typeOf(p_r10.practice_code)) ? 11 : -1, tmp_16_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("tone", p_r10.scenario === "baseline" ? "outline" : "forest");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 17, p_r10.scenario));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", p_r10.quantity !== null ? \u0275\u0275pipeBind2(18, 19, p_r10.quantity, 2) : "\u2014", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r10.quantity !== null ? 19 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("tone", p_r10.source === "partner" ? "violet" : p_r10.source === "import" ? "sky" : "outline");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.src(p_r10.source));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r10.missing_evidence ? 24 : p_r10.evidence_ids.length ? 25 : 26);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(p_r10.status === "voided" ? 28 : p_r10.version > 1 ? 29 : 30);
  }
}
function PracticesPage_Conditional_58_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 43)(1, "span", 59);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 33);
    \u0275\u0275listener("click", function PracticesPage_Conditional_58_Conditional_23_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.more());
    });
    \u0275\u0275text(4, "Load more");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Showing ", ctx_r1.rows().length, " of ", ctx_r1.total());
  }
}
function PracticesPage_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "table", 40)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Practice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Scenario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 41);
    \u0275\u0275text(13, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Evidence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Version");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "tbody");
    \u0275\u0275repeaterCreate(21, PracticesPage_Conditional_58_For_22_Template, 31, 22, "tr", 42, _forTrack03);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(23, PracticesPage_Conditional_58_Conditional_23_Template, 5, 2, "div", 43);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(21);
    \u0275\u0275repeater(ctx_r1.rows());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.total() > ctx_r1.rows().length && !ctx_r1.missingOnly() ? 23 : -1);
  }
}
var PracticesPage = class _PracticesPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  items = signal(
    [],
    ...ngDevMode ? [{ debugName: "items" }] : (
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
  allFields = signal(
    [],
    ...ngDevMode ? [{ debugName: "allFields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projectFieldIds = signal(
    null,
    ...ngDevMode ? [{ debugName: "projectFieldIds" }] : (
      /* istanbul ignore next */
      []
    )
  );
  types = signal(
    [],
    ...ngDevMode ? [{ debugName: "types" }] : (
      /* istanbul ignore next */
      []
    )
  );
  crops = signal(
    [],
    ...ngDevMode ? [{ debugName: "crops" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projectOnly = signal(
    true,
    ...ngDevMode ? [{ debugName: "projectOnly" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldId = signal(
    "",
    ...ngDevMode ? [{ debugName: "fieldId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  code = signal(
    "",
    ...ngDevMode ? [{ debugName: "code" }] : (
      /* istanbul ignore next */
      []
    )
  );
  scenario = signal(
    "",
    ...ngDevMode ? [{ debugName: "scenario" }] : (
      /* istanbul ignore next */
      []
    )
  );
  from = signal(
    "",
    ...ngDevMode ? [{ debugName: "from" }] : (
      /* istanbul ignore next */
      []
    )
  );
  to = signal(
    "",
    ...ngDevMode ? [{ debugName: "to" }] : (
      /* istanbul ignore next */
      []
    )
  );
  voided = signal(
    false,
    ...ngDevMode ? [{ debugName: "voided" }] : (
      /* istanbul ignore next */
      []
    )
  );
  missingOnly = signal(
    false,
    ...ngDevMode ? [{ debugName: "missingOnly" }] : (
      /* istanbul ignore next */
      []
    )
  );
  limit = signal(
    200,
    ...ngDevMode ? [{ debugName: "limit" }] : (
      /* istanbul ignore next */
      []
    )
  );
  formOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "formOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  correcting = signal(
    null,
    ...ngDevMode ? [{ debugName: "correcting" }] : (
      /* istanbul ignore next */
      []
    )
  );
  presetField = signal(
    null,
    ...ngDevMode ? [{ debugName: "presetField" }] : (
      /* istanbul ignore next */
      []
    )
  );
  drawerOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "drawerOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  recordId = signal(
    null,
    ...ngDevMode ? [{ debugName: "recordId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  refreshN = signal(
    0,
    ...ngDevMode ? [{ debugName: "refreshN" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropNames = computed(
    () => new Map(this.crops().map((c) => [c.code, c.name])),
    ...ngDevMode ? [{ debugName: "cropNames" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fields = computed(
    () => {
      const ids = this.projectFieldIds();
      return this.projectOnly() && ids ? this.allFields().filter((f) => ids.has(f.id)) : this.allFields();
    },
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => this.missingOnly() ? this.items().filter((p) => p.missing_evidence) : this.items(),
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  missingCount = computed(
    () => this.items().filter((p) => p.missing_evidence).length,
    ...ngDevMode ? [{ debugName: "missingCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  hasFilters = computed(
    () => !!(this.fieldId() || this.code() || this.scenario() || this.from() || this.to() || this.voided()),
    ...ngDevMode ? [{ debugName: "hasFilters" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.api.get("/fields", { limit: 500 }).subscribe({ next: (r) => this.allFields.set(r.items) });
    this.api.get("/catalogue/practice-types", { include_inactive: true }).subscribe({ next: (r) => this.types.set(r) });
    this.api.get("/catalogue/crops", { include_inactive: true }).subscribe({ next: (r) => this.crops.set(r) });
    const qp = this.route.snapshot.queryParamMap;
    if (qp.get("field_id")) {
      this.fieldId.set(qp.get("field_id"));
      this.projectOnly.set(false);
    }
    if (qp.get("record_id"))
      this.openRecord(qp.get("record_id"));
    if (qp.get("record")) {
      this.presetField.set(qp.get("field_id"));
      this.formOpen.set(true);
    }
    effect(() => {
      if (this.drawerOpen())
        return;
      untracked(() => {
        if (this.route.snapshot.queryParamMap.has("record_id")) {
          this.router.navigate([], { queryParams: { record_id: null }, queryParamsHandling: "merge", replaceUrl: true });
        }
      });
    });
    effect(() => {
      const pid = this.ctx.currentId();
      if (!pid)
        return;
      this.api.get("/fields", { project_id: pid, limit: 500 }).subscribe({
        next: (r) => this.projectFieldIds.set(new Set(r.items.map((f) => f.id)))
      });
    });
    effect(() => {
      this.projectOnly();
      this.fieldId();
      this.code();
      this.scenario();
      this.from();
      this.to();
      this.voided();
      this.limit();
      this.ctx.currentId();
      this.load();
    });
  }
  load() {
    const pid = this.projectOnly() ? this.ctx.currentId() : null;
    if (this.projectOnly() && !pid && !this.ctx.loaded())
      return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get("/practices", {
      project_id: pid,
      field_id: this.fieldId(),
      practice_code: this.code(),
      scenario: this.scenario(),
      date_from: this.from(),
      date_to: this.to(),
      include_voided: this.voided() || void 0,
      limit: this.limit()
    }).subscribe({
      next: (r) => {
        this.items.set(r.items);
        this.total.set(r.total);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  more() {
    this.limit.set(Math.min(500, this.limit() + 200));
  }
  countBy(s) {
    return this.items().filter((p) => p.scenario === s && p.status !== "voided").length;
  }
  fieldOf(id) {
    return this.allFields().find((f) => f.id === id) ?? null;
  }
  typeOf(code) {
    return this.types().find((t) => t.code === code) ?? null;
  }
  src(s) {
    return SOURCE_LABEL[s] ?? s;
  }
  clear() {
    this.fieldId.set("");
    this.code.set("");
    this.scenario.set("");
    this.from.set("");
    this.to.set("");
    this.voided.set(false);
    this.missingOnly.set(false);
  }
  openCreate() {
    this.correcting.set(null);
    this.presetField.set(this.fieldId() || null);
    this.formOpen.set(true);
  }
  openRecord(id) {
    this.recordId.set(id);
    this.drawerOpen.set(true);
    this.router.navigate([], { queryParams: { record_id: id }, queryParamsHandling: "merge", replaceUrl: true });
  }
  startCorrect(p) {
    this.correcting.set(p);
    this.drawerOpen.set(false);
    this.formOpen.set(true);
  }
  onSaved(p) {
    const corr = !!this.correcting();
    this.toast.success(corr ? `Correction saved as version ${p.version}` : "Practice recorded", p.missing_evidence ? "Flagged: required evidence is missing." : void 0);
    this.correcting.set(null);
    this.load();
    this.refreshN.update((n) => n + 1);
    this.openRecord(p.record_id);
  }
  static \u0275fac = function PracticesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PracticesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PracticesPage, selectors: [["vc-practices-page"]], decls: 61, vars: 29, consts: [["title", "Practices", "eyebrow", "Land", "subtitle", "The practice ledger: what was done on each field, when, and in which scenario. Corrections create a new version \u2014 nothing is overwritten."], ["actions", "", 1, "btn", "btn-primary"], [1, "summary"], [1, "s"], [1, "l"], [1, "v", "num"], ["type", "button", 1, "s", "warn", 3, "click", "disabled"], ["name", "file-warning", 3, "size"], [1, "filters"], [1, "scope"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], ["aria-label", "Field", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["aria-label", "Practice", 1, "input", 3, "ngModelChange", "ngModel"], ["aria-label", "Scenario", 1, "input", "sm", 3, "ngModelChange", "ngModel"], ["value", "baseline"], ["value", "project"], [1, "dates"], ["type", "date", "aria-label", "From date", 1, "input", 3, "ngModelChange", "ngModel"], [1, "subtle"], ["type", "date", "aria-label", "To date", 1, "input", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-ghost", "btn-sm"], [1, "card"], [3, "rows"], [1, "card-body"], [3, "openChange", "saved", "open", "fields", "cropNames", "record", "presetFieldId"], [3, "openChange", "correct", "changed", "open", "recordId", "fields", "types", "refresh"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "x", 3, "size"], ["title", "Couldn't load practices", 3, "message"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["icon", "filter", "title", "No records match these filters", "text", "Try widening the date range or clearing the filters."], ["icon", "sprout", "title", "No practices recorded yet", "text", "Practices come in from the field app, farmer app, WhatsApp and partners \u2014 or record one here."], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "table-wrap"], [1, "table"], [1, "num"], [1, "clickable", 3, "voided"], [1, "card-foot"], [1, "clickable", 3, "click"], [1, "nowrap"], [1, "subtle", "small"], [1, "subtle", "mono", "small"], [1, "pn"], [3, "cat"], [3, "tone"], [1, "num", "nowrap"], ["status", "warning"], [1, "ev"], ["status", "voided"], ["title", "Corrected", 1, "ver"], [1, "mono", "code"], [1, "subtle", "small", "truncate", "nm"], ["name", "file-check", 3, "size"], [1, "subtle", "small", "grow"]], template: function PracticesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, PracticesPage_Conditional_1_Template, 3, 0, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "div", 2)(3, "div", 3)(4, "span", 4);
      \u0275\u0275text(5, "Records");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 5);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 3)(9, "span", 4);
      \u0275\u0275text(10, "Project scenario");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "span", 5);
      \u0275\u0275text(12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 3)(14, "span", 4);
      \u0275\u0275text(15, "Baseline scenario");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span", 5);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "button", 6);
      \u0275\u0275listener("click", function PracticesPage_Template_button_click_18_listener() {
        return ctx.missingOnly.set(!ctx.missingOnly());
      });
      \u0275\u0275elementStart(19, "span", 4);
      \u0275\u0275element(20, "vc-icon", 7);
      \u0275\u0275text(21, "Missing evidence");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "span", 5);
      \u0275\u0275text(23);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "div", 8)(25, "label", 9)(26, "input", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticesPage_Template_input_ngModelChange_26_listener($event) {
        return ctx.projectOnly.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275text(27);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "select", 11);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticesPage_Template_select_ngModelChange_28_listener($event) {
        return ctx.fieldId.set($event);
      });
      \u0275\u0275elementStart(29, "option", 12);
      \u0275\u0275text(30, "All fields");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(31, PracticesPage_For_32_Template, 2, 3, "option", 13, _forTrack03);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "select", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticesPage_Template_select_ngModelChange_33_listener($event) {
        return ctx.code.set($event);
      });
      \u0275\u0275elementStart(34, "option", 12);
      \u0275\u0275text(35, "All practices");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(36, PracticesPage_For_37_Template, 2, 2, "option", 13, _forTrack13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "select", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticesPage_Template_select_ngModelChange_38_listener($event) {
        return ctx.scenario.set($event);
      });
      \u0275\u0275elementStart(39, "option", 12);
      \u0275\u0275text(40, "Both scenarios");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "option", 16);
      \u0275\u0275text(42, "Baseline");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "option", 17);
      \u0275\u0275text(44, "Project");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div", 18)(46, "input", 19);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticesPage_Template_input_ngModelChange_46_listener($event) {
        return ctx.from.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "span", 20);
      \u0275\u0275text(48, "to");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "input", 21);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticesPage_Template_input_ngModelChange_49_listener($event) {
        return ctx.to.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(50, "label", 9)(51, "input", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function PracticesPage_Template_input_ngModelChange_51_listener($event) {
        return ctx.voided.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275text(52, "Show voided");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(53, PracticesPage_Conditional_53_Template, 3, 1, "button", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "section", 23);
      \u0275\u0275conditionalCreate(55, PracticesPage_Conditional_55_Template, 1, 1, "vc-loading", 24)(56, PracticesPage_Conditional_56_Template, 4, 1, "div", 25)(57, PracticesPage_Conditional_57_Template, 2, 1)(58, PracticesPage_Conditional_58_Template, 24, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "vc-practice-form", 26);
      \u0275\u0275twoWayListener("openChange", function PracticesPage_Template_vc_practice_form_openChange_59_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formOpen, $event) || (ctx.formOpen = $event);
        return $event;
      });
      \u0275\u0275listener("saved", function PracticesPage_Template_vc_practice_form_saved_59_listener($event) {
        return ctx.onSaved($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "vc-practice-drawer", 27);
      \u0275\u0275twoWayListener("openChange", function PracticesPage_Template_vc_practice_drawer_openChange_60_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.drawerOpen, $event) || (ctx.drawerOpen = $event);
        return $event;
      });
      \u0275\u0275listener("correct", function PracticesPage_Template_vc_practice_drawer_correct_60_listener($event) {
        return ctx.startCorrect($event);
      })("changed", function PracticesPage_Template_vc_practice_drawer_changed_60_listener() {
        return ctx.load();
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.auth.can("practice.record") ? 1 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.total());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.countBy("project"));
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.countBy("baseline"));
      \u0275\u0275advance();
      \u0275\u0275classProp("on", ctx.missingOnly());
      \u0275\u0275property("disabled", !ctx.missingCount());
      \u0275\u0275advance(2);
      \u0275\u0275property("size", 13);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.missingCount());
      \u0275\u0275advance(3);
      \u0275\u0275property("ngModel", ctx.projectOnly());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" Only fields enrolled in ", ctx.ctx.current()?.code ?? "this project", " ");
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.fieldId());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.fields());
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.code());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.types());
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.scenario());
      \u0275\u0275control();
      \u0275\u0275advance(8);
      \u0275\u0275property("ngModel", ctx.from());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275property("ngModel", ctx.to());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.voided());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.hasFilters() ? 53 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 55 : ctx.error() ? 56 : !ctx.rows().length ? 57 : 58);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.formOpen);
      \u0275\u0275property("fields", ctx.allFields())("cropNames", ctx.cropNames())("record", ctx.correcting())("presetFieldId", ctx.presetField());
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.drawerOpen);
      \u0275\u0275property("recordId", ctx.recordId())("fields", ctx.allFields())("types", ctx.types())("refresh", ctx.refreshN());
    }
  }, dependencies: [
    FormsModule,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgModel,
    PageHeader,
    Loading,
    ErrorBox,
    Empty,
    Badge,
    Icon,
    Chip,
    PracticeForm,
    PracticeDrawer,
    DayPipe,
    HumanPipe,
    NumPipe
  ], styles: ["\n.summary[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n@media (max-width: 900px) {\n  .summary[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.s[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 14px 16px;\n  border-radius: var(--%NS%radius);\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  box-shadow: var(--%NS%shadow-sm);\n  text-align: left;\n  font: inherit;\n}\n.s[_ngcontent-%COMP%]   .l[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.s[_ngcontent-%COMP%]   .v[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\nbutton.s[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\nbutton.s[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n}\n.s.warn[_ngcontent-%COMP%]   .v[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.s.warn[_ngcontent-%COMP%]   .l[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.s.warn.on[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  border-color: #f1dcae;\n  box-shadow: 0 0 0 1px #e6c47c inset;\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 200px;\n}\n.filters[_ngcontent-%COMP%]   select.sm[_ngcontent-%COMP%] {\n  width: 150px;\n}\n.dates[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n}\n.dates[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 150px;\n}\n.scope[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n  white-space: nowrap;\n}\n.scope[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n  width: 15px;\n  height: 15px;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n}\n.nm[_ngcontent-%COMP%] {\n  max-width: 160px;\n}\n.pn[_ngcontent-%COMP%] {\n  font-weight: 500;\n  margin-bottom: 3px;\n}\n.ev[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  color: var(--%NS%forest-600);\n  font-size: 12.5px;\n}\n.ver[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%sky-600);\n  white-space: nowrap;\n}\ntr.voided[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\ntr.voided[_ngcontent-%COMP%]   .pn[_ngcontent-%COMP%] {\n  text-decoration: line-through;\n}\n.grow[_ngcontent-%COMP%] {\n  margin-right: auto;\n}\n/*# sourceMappingURL=practices.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PracticesPage, [{
    type: Component,
    args: [{ selector: "vc-practices-page", imports: [
      FormsModule,
      PageHeader,
      Loading,
      ErrorBox,
      Empty,
      Badge,
      Icon,
      Chip,
      PracticeForm,
      PracticeDrawer,
      DayPipe,
      HumanPipe,
      NumPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Practices" eyebrow="Land"
      subtitle="The practice ledger: what was done on each field, when, and in which scenario. Corrections create a new version \u2014 nothing is overwritten.">
      @if (auth.can('practice.record')) {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Record a practice</button>
      }
    </vc-page-header>

    <div class="summary">
      <div class="s"><span class="l">Records</span><span class="v num">{{ total() }}</span></div>
      <div class="s"><span class="l">Project scenario</span><span class="v num">{{ countBy('project') }}</span></div>
      <div class="s"><span class="l">Baseline scenario</span><span class="v num">{{ countBy('baseline') }}</span></div>
      <button type="button" class="s warn" [class.on]="missingOnly()" (click)="missingOnly.set(!missingOnly())" [disabled]="!missingCount()">
        <span class="l"><vc-icon name="file-warning" [size]="13" />Missing evidence</span><span class="v num">{{ missingCount() }}</span>
      </button>
    </div>

    <div class="filters">
      <label class="scope">
        <input type="checkbox" [ngModel]="projectOnly()" (ngModelChange)="projectOnly.set($event)" />
        Only fields enrolled in {{ ctx.current()?.code ?? 'this project' }}
      </label>
      <select class="input" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)" aria-label="Field">
        <option value="">All fields</option>
        @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} \xB7 {{ f.name }}</option> }
      </select>
      <select class="input" [ngModel]="code()" (ngModelChange)="code.set($event)" aria-label="Practice">
        <option value="">All practices</option>
        @for (t of types(); track t.code) { <option [value]="t.code">{{ t.name }}</option> }
      </select>
      <select class="input sm" [ngModel]="scenario()" (ngModelChange)="scenario.set($event)" aria-label="Scenario">
        <option value="">Both scenarios</option><option value="baseline">Baseline</option><option value="project">Project</option>
      </select>
      <div class="dates">
        <input type="date" class="input" [ngModel]="from()" (ngModelChange)="from.set($event)" aria-label="From date" />
        <span class="subtle">to</span>
        <input type="date" class="input" [ngModel]="to()" (ngModelChange)="to.set($event)" aria-label="To date" />
      </div>
      <label class="scope"><input type="checkbox" [ngModel]="voided()" (ngModelChange)="voided.set($event)" />Show voided</label>
      @if (hasFilters()) { <button class="btn btn-ghost btn-sm" (click)="clear()"><vc-icon name="x" [size]="14" />Clear</button> }
    </div>

    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="8" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load practices" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div>
      } @else if (!rows().length) {
        @if (hasFilters() || missingOnly()) {
          <vc-empty icon="filter" title="No records match these filters" text="Try widening the date range or clearing the filters."><button class="btn btn-secondary" (click)="clear()">Clear filters</button></vc-empty>
        } @else {
          <vc-empty icon="sprout" title="No practices recorded yet"
            text="Practices come in from the field app, farmer app, WhatsApp and partners \u2014 or record one here.">
            @if (auth.can('practice.record')) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Record a practice</button> }
          </vc-empty>
        }
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>Date</th><th>Field</th><th>Practice</th><th>Scenario</th><th class="num">Quantity</th><th>Source</th><th>Evidence</th><th>Version</th>
            </tr></thead>
            <tbody>
              @for (p of rows(); track p.id) {
                <tr class="clickable" [class.voided]="p.status === 'voided'" (click)="openRecord(p.record_id)">
                  <td class="nowrap">{{ p.performed_on | day }}@if (p.ended_on && p.ended_on !== p.performed_on) { <span class="subtle small"> \u2013 {{ p.ended_on | day }}</span> }</td>
                  <td>@if (fieldOf(p.field_id); as f) { <span class="mono code">{{ f.code }}</span><div class="subtle small truncate nm">{{ f.name }}</div> } @else { <span class="subtle mono small">{{ p.field_id.slice(0, 8) }}</span> }</td>
                  <td><div class="pn">{{ typeOf(p.practice_code)?.name ?? p.practice_code }}</div>@if (typeOf(p.practice_code); as t) { <vc-chip [cat]="t.category">{{ t.category | human }}</vc-chip> }</td>
                  <td><vc-chip [tone]="p.scenario === 'baseline' ? 'outline' : 'forest'">{{ p.scenario | human }}</vc-chip></td>
                  <td class="num nowrap">{{ p.quantity !== null ? (p.quantity | num: 2) : '\u2014' }} @if (p.quantity !== null) { <span class="subtle">{{ p.unit }}</span> }</td>
                  <td><vc-chip [tone]="p.source === 'partner' ? 'violet' : p.source === 'import' ? 'sky' : 'outline'">{{ src(p.source) }}</vc-chip></td>
                  <td>
                    @if (p.missing_evidence) { <vc-badge status="warning">Missing</vc-badge> }
                    @else if (p.evidence_ids.length) { <span class="ev"><vc-icon name="file-check" [size]="14" />{{ p.evidence_ids.length }}</span> }
                    @else { <span class="subtle">\u2014</span> }
                  </td>
                  <td>
                    @if (p.status === 'voided') { <vc-badge status="voided" /> }
                    @else if (p.version > 1) { <span class="ver" title="Corrected">v{{ p.version }} \xB7 corrected</span> }
                    @else { <span class="subtle small">v1</span> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (total() > rows().length && !missingOnly()) {
          <div class="card-foot"><span class="subtle small grow">Showing {{ rows().length }} of {{ total() }}</span><button class="btn btn-secondary btn-sm" (click)="more()">Load more</button></div>
        }
      }
    </section>

    <vc-practice-form [(open)]="formOpen" [fields]="allFields()" [cropNames]="cropNames()" [record]="correcting()" [presetFieldId]="presetField()" (saved)="onSaved($event)" />
    <vc-practice-drawer [(open)]="drawerOpen" [recordId]="recordId()" [fields]="allFields()" [types]="types()" [refresh]="refreshN()"
      (correct)="startCorrect($event)" (changed)="load()" />
  `, styles: ["/* angular:styles/component:scss;8b7c179a45c36f6f;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\practices\\practices.page.ts */\n.summary {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n@media (max-width: 900px) {\n  .summary {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.s {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 14px 16px;\n  border-radius: var(--radius);\n  background: var(--surface);\n  border: 1px solid var(--border);\n  box-shadow: var(--shadow-sm);\n  text-align: left;\n  font: inherit;\n}\n.s .l {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.s .v {\n  font-size: 22px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\nbutton.s {\n  cursor: pointer;\n}\nbutton.s:disabled {\n  cursor: default;\n}\n.s.warn .v {\n  color: var(--amber-600);\n}\n.s.warn .l {\n  color: var(--amber-600);\n}\n.s.warn.on {\n  background: var(--warn-soft);\n  border-color: #f1dcae;\n  box-shadow: 0 0 0 1px #e6c47c inset;\n}\n.filters {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.filters select {\n  width: 200px;\n}\n.filters select.sm {\n  width: 150px;\n}\n.dates {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n}\n.dates .input {\n  width: 150px;\n}\n.scope {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  font-size: 13px;\n  color: var(--stone-700);\n  cursor: pointer;\n  white-space: nowrap;\n}\n.scope input {\n  accent-color: var(--primary);\n  width: 15px;\n  height: 15px;\n}\n.code {\n  font-size: 12px;\n  font-weight: 600;\n}\n.nm {\n  max-width: 160px;\n}\n.pn {\n  font-weight: 500;\n  margin-bottom: 3px;\n}\n.ev {\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  color: var(--forest-600);\n  font-size: 12.5px;\n}\n.ver {\n  font-size: 12px;\n  color: var(--sky-600);\n  white-space: nowrap;\n}\ntr.voided td {\n  color: var(--text-3);\n}\ntr.voided .pn {\n  text-decoration: line-through;\n}\n.grow {\n  margin-right: auto;\n}\n/*# sourceMappingURL=practices.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PracticesPage, { className: "PracticesPage", filePath: "src/app/features/practices/practices.page.ts", lineNumber: 140 });
})();

// src/app/features/practices/practices.routes.ts
var practices_routes_default = [{ path: "", component: PracticesPage, title: "Practices \xB7 Varsapradaya Carbon" }];
export {
  practices_routes_default as default
};
//# debugId=ef8c2718-3da1-5c38-a84d-2fb4cb3dbb57
//# sourceMappingURL=chunk-WWCQJRSY.js.map
