import {
  Remote,
  isoDate
} from "./chunk-ZC6I5JPU.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  RadioControlValueAccessor,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  AuthService
} from "./chunk-PNIM44LI.js";
import {
  Badge,
  Callout,
  Empty,
  ErrorBox,
  KIT,
  Loading,
  Modal,
  PageHeader
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  TitleCasePipe,
  computed,
  effect,
  inject,
  map,
  setClassMetadata,
  signal,
  untracked,
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
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/risk/risk.page.ts
var _c0 = () => [];
var _c1 = () => ["high", "medium", "low"];
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.id;
function RiskPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function RiskPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 33);
    \u0275\u0275text(2, "Record risk event");
    \u0275\u0275elementEnd();
  }
}
function RiskPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-empty", 34);
    \u0275\u0275elementEnd();
  }
}
function RiskPage_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 35);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r1.summary.error().message);
  }
}
function RiskPage_Conditional_3_Conditional_1_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
  }
  if (rf & 2) {
    const s_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", s_r4.events_without_estimate, " open event", s_r4.events_without_estimate === 1 ? " has" : "s have", " no impact estimate yet");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" and ", s_r4.events_without_estimate === 1 ? "is" : "are", " not counted. ");
  }
}
function RiskPage_Conditional_3_Conditional_1_For_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "titlecase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong", 53);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const sv_r5 = ctx.$implicit;
    const s_r4 = \u0275\u0275nextContext();
    \u0275\u0275classMap("s-" + sv_r5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 4, sv_r5));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r4.open_by_severity[sv_r5] ?? 0);
  }
}
function RiskPage_Conditional_3_Conditional_1_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275element(1, "vc-icon", 56);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 65);
    \u0275\u0275element(5, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong", 53);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const k_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("name", k_r6.icon)("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(k_r6.label);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", k_r6.w, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(k_r6.n);
  }
}
function RiskPage_Conditional_3_Conditional_1_ForEmpty_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 62);
    \u0275\u0275text(1, "No open events.");
    \u0275\u0275elementEnd();
  }
}
function RiskPage_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "section", 45)(2, "div", 46)(3, "h3");
    \u0275\u0275text(4, "Open risk vs buffer pool");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "vc-badge", 47);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 42)(8, "div", 48)(9, "div", 49)(10, "span", 50);
    \u0275\u0275text(11, "Estimated impact of open events");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 51);
    \u0275\u0275element(13, "span", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "strong", 53);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "num");
    \u0275\u0275elementStart(17, "small");
    \u0275\u0275text(18, "tCO\u2082e");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 49)(20, "span", 50);
    \u0275\u0275text(21, "Buffer pool from approved results");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 51);
    \u0275\u0275element(23, "span", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "strong", 53);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "num");
    \u0275\u0275elementStart(27, "small");
    \u0275\u0275text(28, "tCO\u2082e");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(29, "p", 55);
    \u0275\u0275element(30, "vc-icon", 56);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "p", 57);
    \u0275\u0275text(33);
    \u0275\u0275conditionalCreate(34, RiskPage_Conditional_3_Conditional_1_Conditional_34_Template, 3, 3);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "section", 2)(36, "div", 46)(37, "h3");
    \u0275\u0275text(38, "Open events");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "strong", 58);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 42)(42, "div", 59);
    \u0275\u0275repeaterCreate(43, RiskPage_Conditional_3_Conditional_1_For_44_Template, 6, 6, "div", 60, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "ul", 61);
    \u0275\u0275repeaterCreate(46, RiskPage_Conditional_3_Conditional_1_For_47_Template, 8, 6, "li", null, _forTrack0, false, RiskPage_Conditional_3_Conditional_1_ForEmpty_48_Template, 2, 0, "li", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "p", 63);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const s_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("status", s_r4.estimated_impact_t === 0 ? "ok" : s_r4.buffer_sufficient ? "ok" : "blocking");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r4.estimated_impact_t === 0 ? "No exposure" : s_r4.buffer_sufficient ? "Buffer covers it" : "Buffer exceeded");
    \u0275\u0275advance(7);
    \u0275\u0275styleProp("width", ctx_r1.w(s_r4.estimated_impact_t, s_r4), "%");
    \u0275\u0275classProp("over", !s_r4.buffer_sufficient);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(16, 21, s_r4.estimated_impact_t, 2), " ");
    \u0275\u0275advance(8);
    \u0275\u0275styleProp("width", ctx_r1.w(s_r4.buffer_t_co2e, s_r4), "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(26, 24, s_r4.buffer_t_co2e, 2), " ");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("bad", !s_r4.buffer_sufficient);
    \u0275\u0275advance();
    \u0275\u0275property("name", s_r4.buffer_sufficient ? "info" : "alert")("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r4.message);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("The buffer is a share of every verified result that is held back, never sold, to cover carbon that might be lost later. It comes from ", s_r4.approved_runs, " approved calculation", s_r4.approved_runs === 1 ? "" : "s", ". ");
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r4.events_without_estimate ? 34 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(s_r4.open);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(27, _c1));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.kindRows(s_r4));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", s_r4.resolved, " resolved to date.");
  }
}
function RiskPage_Conditional_3_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 66);
    \u0275\u0275listener("click", function RiskPage_Conditional_3_For_5_Template_button_click_0_listener() {
      const f_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.status.set(f_r8.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 67);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.status() === f_r8.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r8.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.countStatus(f_r8.key));
  }
}
function RiskPage_Conditional_3_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const k_r9 = ctx.$implicit;
    \u0275\u0275property("value", k_r9.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(k_r9.label);
  }
}
function RiskPage_Conditional_3_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 41);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function RiskPage_Conditional_3_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "vc-error", 68);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.events.error().message);
  }
}
function RiskPage_Conditional_3_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 43);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.status() || ctx_r1.kind() ? "No matching events" : "No risk events recorded");
  }
}
function RiskPage_Conditional_3_Conditional_15_For_19_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "num");
    \u0275\u0275elementStart(2, "span", 82);
    \u0275\u0275text(3, "t");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(1, 1, e_r11.estimated_impact_t, 2), " ");
  }
}
function RiskPage_Conditional_3_Conditional_15_For_19_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 77);
    \u0275\u0275text(1, "Not estimated");
    \u0275\u0275elementEnd();
  }
}
function RiskPage_Conditional_3_Conditional_15_For_19_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 83);
  }
  if (rf & 2) {
    const st_r12 = ctx.$implicit;
    const $index_r13 = ctx.$index;
    const e_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("done", ctx_r1.idx(e_r11.status) >= $index_r13);
    \u0275\u0275property("title", ctx_r1.step(st_r12).label);
  }
}
function RiskPage_Conditional_3_Conditional_15_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 71);
    \u0275\u0275listener("click", function RiskPage_Conditional_3_Conditional_15_For_19_Template_tr_click_0_listener() {
      const e_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openDetail(e_r11));
    });
    \u0275\u0275elementStart(1, "td", 72);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td")(5, "div", 73)(6, "span", 74);
    \u0275\u0275element(7, "vc-icon", 56);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 75);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "span", 76);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "titlecase");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td", 53);
    \u0275\u0275conditionalCreate(18, RiskPage_Conditional_3_Conditional_15_For_19_Conditional_18_Template, 4, 4)(19, RiskPage_Conditional_3_Conditional_15_For_19_Conditional_19_Template, 2, 0, "span", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td")(21, "div", 78);
    \u0275\u0275repeaterCreate(22, RiskPage_Conditional_3_Conditional_15_For_19_For_23_Template, 1, 3, "span", 79, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(24, "span", 80);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "td", 53);
    \u0275\u0275element(27, "vc-icon", 81);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 11, e_r11.occurred_on));
    \u0275\u0275advance(5);
    \u0275\u0275property("name", ctx_r1.kindIcon(e_r11.kind))("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.kindLabel(e_r11.kind));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r11.description);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.fieldCode(e_r11.field_id));
    \u0275\u0275advance(2);
    \u0275\u0275classMap("s-" + e_r11.severity);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 13, e_r11.severity));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(e_r11.estimated_impact_t !== null ? 18 : 19);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.flow);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.step(e_r11.status).label);
  }
}
function RiskPage_Conditional_3_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44)(1, "table", 69)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Occurred");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 53);
    \u0275\u0275text(13, "Est. impact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Progress");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, RiskPage_Conditional_3_Conditional_15_For_19_Template, 28, 15, "tr", 70, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r1.rows());
  }
}
function RiskPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, RiskPage_Conditional_3_Conditional_0_Template, 1, 1, "vc-error", 35)(1, RiskPage_Conditional_3_Conditional_1_Template, 51, 28, "div", 36);
    \u0275\u0275elementStart(2, "div", 37)(3, "div", 38);
    \u0275\u0275repeaterCreate(4, RiskPage_Conditional_3_For_5_Template, 4, 4, "button", 39, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "select", 40);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RiskPage_Conditional_3_Template_select_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.kind.set($event));
    });
    \u0275\u0275elementStart(7, "option", 18);
    \u0275\u0275text(8, "All kinds");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(9, RiskPage_Conditional_3_For_10_Template, 2, 2, "option", 19, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "section", 2);
    \u0275\u0275conditionalCreate(12, RiskPage_Conditional_3_Conditional_12_Template, 1, 1, "vc-loading", 41)(13, RiskPage_Conditional_3_Conditional_13_Template, 2, 1, "div", 42)(14, RiskPage_Conditional_3_Conditional_14_Template, 1, 1, "vc-empty", 43)(15, RiskPage_Conditional_3_Conditional_15_Template, 20, 0, "div", 44);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.summary.error() ? 0 : (tmp_1_0 = ctx_r1.summary.data()) ? 1 : -1, tmp_1_0);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.statusFilters);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r1.kind());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.kinds);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.events.loading() ? 12 : ctx_r1.events.error() ? 13 : !ctx_r1.rows().length ? 14 : 15);
  }
}
function RiskPage_For_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 84)(1, "input", 85);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RiskPage_For_11_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.cf.kind, $event) || (ctx_r1.cf.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "vc-icon", 56);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const k_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.cf.kind === k_r15.key);
    \u0275\u0275advance();
    \u0275\u0275property("value", k_r15.key);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.cf.kind);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("name", k_r15.icon)("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(k_r15.label);
  }
}
function RiskPage_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r16 = ctx.$implicit;
    \u0275\u0275property("value", f_r16.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r16.code, " \xB7 ", f_r16.name);
  }
}
function RiskPage_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275element(1, "vc-error", 86);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function RiskPage_Conditional_55_For_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 93);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 12);
  }
}
function RiskPage_Conditional_55_For_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const $index_r17 = \u0275\u0275nextContext().$index;
    \u0275\u0275textInterpolate1(" ", $index_r17 + 1, " ");
  }
}
function RiskPage_Conditional_55_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 92);
    \u0275\u0275conditionalCreate(2, RiskPage_Conditional_55_For_3_Conditional_2_Template, 1, 1, "vc-icon", 93)(3, RiskPage_Conditional_55_For_3_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 94);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const st_r18 = ctx.$implicit;
    const $index_r17 = ctx.$index;
    const e_r19 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("done", ctx_r1.idx(e_r19.status) > $index_r17)("cur", e_r19.status === st_r18);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.idx(e_r19.status) > $index_r17 ? 2 : 3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.step(st_r18).label);
  }
}
function RiskPage_Conditional_55_Conditional_4_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "label", 103);
    \u0275\u0275text(2, "Resolution");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 104);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Conditional_55_Conditional_4_Conditional_13_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.moveResolution, $event) || (ctx_r1.moveResolution = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 23);
    \u0275\u0275text(5, "Required. Resolved events can't be edited afterwards.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.moveResolution);
    \u0275\u0275control();
  }
}
function RiskPage_Conditional_55_Conditional_4_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 99);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("message", ctx_r1.moveError());
  }
}
function RiskPage_Conditional_55_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 89)(1, "div", 95)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "span", 96);
    \u0275\u0275elementStart(5, "span", 63);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 8)(8, "label", 97);
    \u0275\u0275text(9, "Note for the audit trail ");
    \u0275\u0275elementStart(10, "span", 77);
    \u0275\u0275text(11, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "input", 98);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Conditional_55_Conditional_4_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.moveNote, $event) || (ctx_r1.moveNote = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, RiskPage_Conditional_55_Conditional_4_Conditional_13_Template, 6, 1, "div", 8);
    \u0275\u0275conditionalCreate(14, RiskPage_Conditional_55_Conditional_4_Conditional_14_Template, 1, 1, "vc-error", 99);
    \u0275\u0275elementStart(15, "div", 100)(16, "button", 101);
    \u0275\u0275listener("click", function RiskPage_Conditional_55_Conditional_4_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r20);
      const e_r19 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.move(e_r19));
    });
    \u0275\u0275element(17, "vc-icon", 102);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const e_r19 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Next step: ", ctx_r1.step(ctx_r1.next(e_r19)).label);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.step(ctx_r1.next(e_r19)).hint);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.moveNote);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.next(e_r19) === "resolved" ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.moveError() ? 14 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.moving() || ctx_r1.next(e_r19) === "resolved" && !ctx_r1.moveResolution.trim());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.step(ctx_r1.next(e_r19)).verb);
  }
}
function RiskPage_Conditional_55_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 90)(1, "strong");
    \u0275\u0275text(2, "Resolution");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 105);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r19 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(e_r19.resolution);
  }
}
function RiskPage_Conditional_55_Conditional_6_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275element(1, "vc-error", 86);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function RiskPage_Conditional_55_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 106);
    \u0275\u0275listener("ngSubmit", function RiskPage_Conditional_55_Conditional_6_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r22);
      const e_r19 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveEdit(e_r19));
    });
    \u0275\u0275elementStart(1, "div", 8)(2, "label", 107);
    \u0275\u0275text(3, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 108);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Conditional_55_Conditional_6_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.ef.severity, $event) || (ctx_r1.ef.severity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "option", 13);
    \u0275\u0275text(6, "Low");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 14);
    \u0275\u0275text(8, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 15);
    \u0275\u0275text(10, "High");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 8)(12, "label", 109);
    \u0275\u0275text(13, "Estimated impact (tCO\u2082e)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 110);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Conditional_55_Conditional_6_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.ef.impact, $event) || (ctx_r1.ef.impact = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 5)(16, "label", 111);
    \u0275\u0275text(17, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "textarea", 112);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Conditional_55_Conditional_6_Template_textarea_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.ef.description, $event) || (ctx_r1.ef.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(19, RiskPage_Conditional_55_Conditional_6_Conditional_19_Template, 2, 1, "div", 26);
    \u0275\u0275elementStart(20, "div", 113)(21, "button", 28);
    \u0275\u0275listener("click", function RiskPage_Conditional_55_Conditional_6_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editing.set(false));
    });
    \u0275\u0275text(22, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 114);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.ef.severity);
    \u0275\u0275control();
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.ef.impact);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.ef.description);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.formError() ? 19 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r1.saving());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.saving() ? "Saving\u2026" : "Save changes");
  }
}
function RiskPage_Conditional_55_Conditional_7_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "button", 116);
    \u0275\u0275listener("click", function RiskPage_Conditional_55_Conditional_7_Conditional_30_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r23);
      const e_r19 = \u0275\u0275nextContext(2);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.startEdit(e_r19));
    });
    \u0275\u0275element(2, "vc-icon", 117);
    \u0275\u0275text(3, "Edit details");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
  }
}
function RiskPage_Conditional_55_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 115)(1, "dt");
    \u0275\u0275text(2, "Severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd")(4, "span", 76);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "titlecase");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "dt");
    \u0275\u0275text(8, "Estimated impact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd", 53);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dt");
    \u0275\u0275text(13, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dt");
    \u0275\u0275text(17, "Evidence files");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dt");
    \u0275\u0275text(21, "Recorded");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dd");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dt");
    \u0275\u0275text(26, "Last change");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dd");
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(30, RiskPage_Conditional_55_Conditional_7_Conditional_30_Template, 4, 1, "div");
  }
  if (rf & 2) {
    const e_r19 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275classMap("s-" + e_r19.severity);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 9, e_r19.severity));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r19.estimated_impact_t === null ? "Not estimated yet" : \u0275\u0275pipeBind2(11, 11, e_r19.estimated_impact_t, 2) + " tCO\u2082e");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r19.description);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(e_r19.evidence_ids.length || "None attached");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(24, 14, e_r19.created_at, true));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(29, 17, e_r19.updated_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canManage() && e_r19.status !== "resolved" ? 30 : -1);
  }
}
function RiskPage_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "ol", 87);
    \u0275\u0275repeaterCreate(2, RiskPage_Conditional_55_For_3_Template, 6, 6, "li", 88, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, RiskPage_Conditional_55_Conditional_4_Template, 19, 7, "div", 89);
    \u0275\u0275conditionalCreate(5, RiskPage_Conditional_55_Conditional_5_Template, 5, 1, "vc-callout", 90);
    \u0275\u0275conditionalCreate(6, RiskPage_Conditional_55_Conditional_6_Template, 25, 6, "form", 91)(7, RiskPage_Conditional_55_Conditional_7_Template, 31, 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r19 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.flow);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(e_r19.status !== "resolved" && ctx_r1.canManage() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(e_r19.status === "resolved" && e_r19.resolution ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.editing() ? 6 : 7);
  }
}
var KINDS = [
  { key: "farmer_exit", label: "Farmer exit", icon: "logout" },
  { key: "land_use_change", label: "Land-use change", icon: "map" },
  { key: "fire", label: "Fire", icon: "zap" },
  { key: "flood", label: "Flood", icon: "droplets" },
  { key: "drought", label: "Drought", icon: "sun" },
  { key: "practice_reversal", label: "Practice reversal", icon: "undo" },
  { key: "other", label: "Other", icon: "alert" }
];
var FLOW = ["open", "assessing", "action", "resolved"];
var STEP = {
  open: { label: "Open", verb: "Reopen", hint: "Reported, not yet looked at" },
  assessing: { label: "Assessing", verb: "Start assessing", hint: "Working out the extent and impact" },
  action: { label: "Action", verb: "Move to action", hint: "Mitigation under way with the farmer" },
  resolved: { label: "Resolved", verb: "Resolve", hint: "Closed with a written resolution" }
};
var RiskPage = class _RiskPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  ctx = inject(ProjectContext);
  summary = new Remote();
  events = new Remote();
  fields = new Remote();
  status = signal(
    "active",
    ...ngDevMode ? [{ debugName: "status" }] : (
      /* istanbul ignore next */
      []
    )
  );
  kind = signal(
    "",
    ...ngDevMode ? [{ debugName: "kind" }] : (
      /* istanbul ignore next */
      []
    )
  );
  kinds = KINDS;
  flow = FLOW;
  today = isoDate(/* @__PURE__ */ new Date());
  canManage = computed(
    () => this.auth.can("risk.manage"),
    ...ngDevMode ? [{ debugName: "canManage" }] : (
      /* istanbul ignore next */
      []
    )
  );
  statusFilters = [
    { key: "active", label: "Not resolved" },
    { key: "open", label: "Open" },
    { key: "assessing", label: "Assessing" },
    { key: "action", label: "Action" },
    { key: "resolved", label: "Resolved" },
    { key: "", label: "All" }
  ];
  fieldMap = computed(
    () => new Map((this.fields.data() ?? []).map((f) => [f.id, f.code])),
    ...ngDevMode ? [{ debugName: "fieldMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => (this.events.data() ?? []).filter((e) => (this.status() === "" || (this.status() === "active" ? e.status !== "resolved" : e.status === this.status())) && (!this.kind() || e.kind === this.kind())),
    ...ngDevMode ? [{ debugName: "rows" }] : (
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
  detailOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "detailOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sel = signal(
    null,
    ...ngDevMode ? [{ debugName: "sel" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editing = signal(
    false,
    ...ngDevMode ? [{ debugName: "editing" }] : (
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
  moving = signal(
    false,
    ...ngDevMode ? [{ debugName: "moving" }] : (
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
  moveError = signal(
    null,
    ...ngDevMode ? [{ debugName: "moveError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cf = this.blank();
  ef = { severity: "medium", impact: null, description: "" };
  moveNote = "";
  moveResolution = "";
  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => {
        if (pid)
          this.load(pid);
      });
    });
  }
  load(pid = this.ctx.currentId(), keep = false) {
    this.summary.load(this.api.get(`/projects/${pid}/risk/summary`), keep);
    this.events.load(this.api.get("/risk-events", { project_id: pid }), keep);
    if (!keep)
      this.fields.load(this.api.get("/fields", { project_id: pid, limit: 500 }).pipe(map((r) => r.items)));
  }
  blank() {
    return { kind: "drought", occurred_on: isoDate(/* @__PURE__ */ new Date()), severity: "medium", field_id: "", impact: null, description: "" };
  }
  w(v, s) {
    const max = Math.max(s.estimated_impact_t, s.buffer_t_co2e, 1e-9);
    return v / max * 100;
  }
  kindRows(s) {
    const entries = Object.entries(s.open_by_kind).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map((e) => e[1]), 1);
    return entries.map(([k, n]) => ({ key: k, n, w: n / max * 100, label: this.kindLabel(k), icon: this.kindIcon(k) }));
  }
  countStatus(k) {
    const all = this.events.data() ?? [];
    return all.filter((e) => k === "" || (k === "active" ? e.status !== "resolved" : e.status === k)).length;
  }
  kindLabel(k) {
    return KINDS.find((x) => x.key === k)?.label ?? k;
  }
  kindIcon(k) {
    return KINDS.find((x) => x.key === k)?.icon ?? "alert";
  }
  fieldCode(id) {
    return id ? this.fieldMap().get(id) ?? "Field" : "Whole project";
  }
  idx(s) {
    return FLOW.indexOf(s);
  }
  step(s) {
    return STEP[s];
  }
  next(e) {
    return FLOW[this.idx(e.status) + 1] ?? null;
  }
  openCreate() {
    this.cf = this.blank();
    this.formError.set(null);
    this.createOpen.set(true);
  }
  create() {
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.saving.set(true);
    this.formError.set(null);
    this.api.post("/risk-events", {
      project_id: pid,
      kind: this.cf.kind,
      occurred_on: this.cf.occurred_on,
      severity: this.cf.severity,
      field_id: this.cf.field_id || null,
      description: this.cf.description.trim(),
      estimated_impact_t: this.cf.impact === null || this.cf.impact === "" ? null : Number(this.cf.impact)
    }).subscribe({
      next: (e) => {
        this.saving.set(false);
        this.createOpen.set(false);
        this.toast.success("Risk event recorded", `${this.kindLabel(e.kind)} on ${this.fieldCode(e.field_id)}.`);
        this.load(pid, true);
      },
      error: (e) => {
        this.saving.set(false);
        this.formError.set(e.message);
      }
    });
  }
  openDetail(e) {
    this.sel.set(e);
    this.editing.set(false);
    this.moveNote = "";
    this.moveResolution = "";
    this.moveError.set(null);
    this.formError.set(null);
    this.detailOpen.set(true);
  }
  startEdit(e) {
    this.ef = { severity: e.severity, impact: e.estimated_impact_t, description: e.description };
    this.formError.set(null);
    this.editing.set(true);
  }
  saveEdit(e) {
    this.saving.set(true);
    this.formError.set(null);
    const impact = this.ef.impact === null || this.ef.impact === "" ? null : Number(this.ef.impact);
    this.api.patch(`/risk-events/${e.id}`, { severity: this.ef.severity, description: this.ef.description.trim(), estimated_impact_t: impact }).subscribe({
      next: (r) => {
        this.saving.set(false);
        this.editing.set(false);
        this.sel.set(r);
        this.toast.success("Risk event updated");
        this.load(void 0, true);
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(err.message);
      }
    });
  }
  move(e) {
    const to = this.next(e);
    if (!to)
      return;
    this.moving.set(true);
    this.moveError.set(null);
    this.api.post(`/risk-events/${e.id}/status`, {
      status: to,
      note: this.moveNote.trim(),
      resolution: to === "resolved" ? this.moveResolution.trim() : null
    }).subscribe({
      next: (r) => {
        this.moving.set(false);
        this.sel.set(r);
        this.moveNote = "";
        this.moveResolution = "";
        this.toast.success(`Moved to ${STEP[to].label.toLowerCase()}`);
        this.load(void 0, true);
      },
      error: (err) => {
        this.moving.set(false);
        this.moveError.set(err.message);
      }
    });
  }
  static \u0275fac = function RiskPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RiskPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RiskPage, selectors: [["vc-risk-page"]], decls: 56, vars: 22, consts: [["title", "Risk & permanence", "eyebrow", "Care", "subtitle", "Events that could reverse stored carbon \u2014 a farmer leaving, land-use change, fire, flood or practices being dropped \u2014 and how they compare with the buffer pool held back from credits."], ["actions", "", 1, "btn", "btn-primary"], [1, "card"], ["width", "500px", "title", "Record a risk event", 3, "openChange", "open", "drawer", "subtitle"], ["id", "riskCreate", 1, "form-grid", 3, "ngSubmit"], [1, "field", "span-2"], [1, "kgrid"], [1, "kopt", 3, "on"], [1, "field"], ["for", "co"], ["id", "co", "type", "date", "name", "co", 1, "input", 3, "ngModelChange", "ngModel", "max"], ["for", "cs"], ["id", "cs", "name", "cs", 1, "input", 3, "ngModelChange", "ngModel"], ["value", "low"], ["value", "medium"], ["value", "high"], ["for", "cfld"], ["id", "cfld", "name", "cfld", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["for", "ci"], [1, "unit"], ["id", "ci", "type", "number", "min", "0", "step", "0.01", "name", "ci", "placeholder", "Leave blank if not yet known", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "hint"], ["for", "cd"], ["id", "cd", "name", "cd", "rows", "4", "placeholder", "What was seen, by whom, and what is known so far.", 1, "input", 3, "ngModelChange", "ngModel"], [1, "span-2"], ["footer", ""], ["type", "button", 1, "btn", "btn-ghost", 3, "click"], ["type", "submit", "form", "riskCreate", 1, "btn", "btn-primary", 3, "disabled"], ["width", "540px", 3, "openChange", "open", "drawer", "title", "subtitle"], [1, "stack", 2, "--gap", "20px"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["icon", "briefcase", "title", "Choose a project", "text", "Risk is tracked per project. Pick one in the top bar."], ["title", "Couldn't load the risk summary", 3, "message"], [1, "sum"], [1, "filters"], [1, "seg"], ["type", "button", 3, "on"], ["aria-label", "Kind", 1, "input", "kf", 3, "ngModelChange", "ngModel"], [3, "rows"], [1, "card-body"], ["icon", "radar", "text", "Record anything that could reverse soil carbon on an enrolled field, so its impact can be weighed against the buffer.", 3, "title"], [1, "table-wrap"], [1, "card", "buffer"], [1, "card-head"], [3, "status"], [1, "bars"], [1, "br"], [1, "bl"], [1, "bt"], [1, "bf", "imp"], [1, "num"], [1, "bf", "buf"], [1, "msg"], [3, "name", "size"], [1, "small", "muted", "expl"], [1, "num", "big"], [1, "sev"], [1, "sv", 3, "class"], [1, "kinds"], [1, "muted", "small"], [1, "small", "subtle"], [1, "sv"], [1, "kb"], ["type", "button", 3, "click"], [1, "c", "num"], ["title", "Couldn't load risk events", 3, "message"], [1, "table"], [1, "clickable"], [1, "clickable", 3, "click"], [1, "nowrap"], [1, "ev"], [1, "ki"], [1, "small", "muted", "truncate"], [1, "sevb"], [1, "subtle"], [1, "flow"], [1, "fd", 3, "done", "title"], [1, "small"], ["name", "chevron-right", 1, "subtle"], [1, "u"], [1, "fd", 3, "title"], [1, "kopt"], ["type", "radio", "name", "kind", 3, "ngModelChange", "value", "ngModel"], ["title", "Not saved", 3, "message"], [1, "stepper"], [3, "done", "cur"], [1, "next", "card", "card-pad"], ["tone", "ok", "icon", "check-circle"], ["id", "riskEdit", 1, "form-grid"], [1, "dot"], ["name", "check", 3, "size"], [1, "sl"], [1, "row"], [1, "spacer"], ["for", "mn"], ["id", "mn", "placeholder", "e.g. Visited the field with the farmer on 12 Sep", 1, "input", 3, "ngModelChange", "ngModel"], ["title", "Status not changed", 3, "message"], [1, "row", 2, "justify-content", "flex-end"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "arrow-right"], ["for", "mr"], ["id", "mr", "rows", "3", "placeholder", "How was the risk resolved? What changed on the ground?", 1, "input", 3, "ngModelChange", "ngModel"], [2, "margin-top", "4px"], ["id", "riskEdit", 1, "form-grid", 3, "ngSubmit"], ["for", "es"], ["id", "es", "name", "es", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "ei"], ["id", "ei", "type", "number", "min", "0", "step", "0.01", "name", "ei", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "ed"], ["id", "ed", "name", "ed", "rows", "4", 1, "input", 3, "ngModelChange", "ngModel"], [1, "span-2", "row", 2, "justify-content", "flex-end"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "kv"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "pencil", 3, "size"]], template: function RiskPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, RiskPage_Conditional_1_Template, 3, 0, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(2, RiskPage_Conditional_2_Template, 2, 0, "div", 2)(3, RiskPage_Conditional_3_Template, 16, 3);
      \u0275\u0275elementStart(4, "vc-modal", 3);
      \u0275\u0275twoWayListener("openChange", function RiskPage_Template_vc_modal_openChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(5, "form", 4);
      \u0275\u0275listener("ngSubmit", function RiskPage_Template_form_ngSubmit_5_listener() {
        return ctx.create();
      });
      \u0275\u0275elementStart(6, "div", 5)(7, "label");
      \u0275\u0275text(8, "What happened");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 6);
      \u0275\u0275repeaterCreate(10, RiskPage_For_11_Template, 4, 7, "label", 7, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div", 8)(13, "label", 9);
      \u0275\u0275text(14, "Occurred on");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "input", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.cf.occurred_on, $event) || (ctx.cf.occurred_on = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 8)(17, "label", 11);
      \u0275\u0275text(18, "Severity");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "select", 12);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Template_select_ngModelChange_19_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.cf.severity, $event) || (ctx.cf.severity = $event);
        return $event;
      });
      \u0275\u0275elementStart(20, "option", 13);
      \u0275\u0275text(21, "Low");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "option", 14);
      \u0275\u0275text(23, "Medium");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "option", 15);
      \u0275\u0275text(25, "High");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(26, "div", 5)(27, "label", 16);
      \u0275\u0275text(28, "Field");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "select", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Template_select_ngModelChange_29_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.cf.field_id, $event) || (ctx.cf.field_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(30, "option", 18);
      \u0275\u0275text(31, "Whole project / not field-specific");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(32, RiskPage_For_33_Template, 2, 3, "option", 19, _forTrack1);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "div", 5)(35, "label", 20);
      \u0275\u0275text(36, "Estimated impact");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "div", 21)(38, "input", 22);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Template_input_ngModelChange_38_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.cf.impact, $event) || (ctx.cf.impact = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "span");
      \u0275\u0275text(40, "tCO\u2082e");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "span", 23);
      \u0275\u0275text(42, "Carbon that could be lost if this is not reversed. You can add or change it later.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(43, "div", 5)(44, "label", 24);
      \u0275\u0275text(45, "Description");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "textarea", 25);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function RiskPage_Template_textarea_ngModelChange_46_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.cf.description, $event) || (ctx.cf.description = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(47, RiskPage_Conditional_47_Template, 2, 1, "div", 26);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(48, 27);
      \u0275\u0275elementStart(49, "button", 28);
      \u0275\u0275listener("click", function RiskPage_Template_button_click_49_listener() {
        return ctx.createOpen.set(false);
      });
      \u0275\u0275text(50, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "button", 29);
      \u0275\u0275text(52);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "vc-modal", 30);
      \u0275\u0275pipe(54, "day");
      \u0275\u0275twoWayListener("openChange", function RiskPage_Template_vc_modal_openChange_53_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.detailOpen, $event) || (ctx.detailOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(55, RiskPage_Conditional_55_Template, 8, 3, "div", 31);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_25_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.canManage() && ctx.ctx.currentId() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.ctx.currentId() ? 2 : 3);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275property("drawer", true)("subtitle", ctx.ctx.current()?.name ?? "");
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.kinds);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.cf.occurred_on);
      \u0275\u0275property("max", ctx.today);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.cf.severity);
      \u0275\u0275control();
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.cf.field_id);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.fields.data() ?? \u0275\u0275pureFunction0(21, _c0));
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.cf.impact);
      \u0275\u0275control();
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.cf.description);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formError() ? 47 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving() || ctx.cf.description.trim().length < 5);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Saving\u2026" : "Record event");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.detailOpen);
      \u0275\u0275property("drawer", true)("title", ctx.sel() ? ctx.kindLabel(ctx.sel().kind) : "")("subtitle", ctx.sel() ? \u0275\u0275pipeBind1(54, 19, ctx.sel().occurred_on) + " \xB7 " + ctx.fieldCode(ctx.sel().field_id) : "");
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_25_0 = ctx.sel()) ? 55 : -1, tmp_25_0);
    }
  }, dependencies: [Icon, Badge, PageHeader, Empty, Loading, ErrorBox, Callout, Modal, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, NgModel, NgForm, NumPipe, DayPipe, TitleCasePipe], styles: ['\n.sum[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);\n  gap: 16px;\n  margin-bottom: 20px;\n}\n@media (max-width: 1100px) {\n  .sum[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.bars[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.br[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 220px 1fr 130px;\n  gap: 14px;\n  align-items: center;\n}\n@media (max-width: 800px) {\n  .br[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.bl[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n}\n.bt[_ngcontent-%COMP%] {\n  height: 14px;\n  border-radius: 7px;\n  background: var(--%NS%sand-100);\n  overflow: hidden;\n}\n.bf[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: 7px;\n  transition: width 0.4s;\n}\n.bf.imp[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-600);\n}\n.bf.imp.over[_ngcontent-%COMP%] {\n  background: var(--%NS%red-600);\n}\n.bf.buf[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n}\n.br[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  text-align: right;\n  font-size: 16px;\n}\n.br[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n  font-weight: 500;\n}\n.msg[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin-top: 16px;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-800);\n  font-weight: 500;\n  font-size: 13.5px;\n}\n.msg.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.expl[_ngcontent-%COMP%] {\n  margin-top: 10px;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n}\n.sev[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n  margin-bottom: 16px;\n}\n.sv[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  padding: 8px 12px;\n  border-radius: 8px;\n  background: var(--%NS%stone-100);\n}\n.sv[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.sv[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 18px;\n}\n.sv.s-high[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n}\n.sv.s-high[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.sv.s-medium[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n}\n.sv.s-medium[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.kinds[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0 0 10px;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.kinds[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 16px 130px 1fr 28px;\n  gap: 8px;\n  align-items: center;\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n}\n.kb[_ngcontent-%COMP%] {\n  height: 6px;\n  border-radius: 3px;\n  background: var(--%NS%sand-100);\n  overflow: hidden;\n}\n.kb[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  background: var(--%NS%stone-400);\n  border-radius: 3px;\n}\n.kinds[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 13px var(--%NS%font);\n  padding: 6px 12px;\n  border-radius: 6px;\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-200);\n}\n.seg[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.kf[_ngcontent-%COMP%] {\n  width: 200px;\n}\n.ev[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  max-width: 420px;\n}\n.ki[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-weight: 500;\n}\n.sevb[_ngcontent-%COMP%] {\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 500;\n  padding: 2px 8px;\n  border-radius: 4px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.sevb.s-high[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n  color: var(--%NS%red-600);\n}\n.sevb.s-medium[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n}\n.u[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.flow[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.fd[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 5px;\n  border-radius: 3px;\n  background: var(--%NS%sand-200);\n}\n.fd.done[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n}\n.flow[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%] {\n  margin-left: 6px;\n  color: var(--%NS%stone-700);\n}\n.kgrid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 6px;\n}\n.kopt[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 7px;\n  cursor: pointer;\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n}\n.kopt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: none;\n}\n.kopt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-800);\n}\n.unit[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.unit[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%text-2);\n}\n.stepper[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  gap: 0;\n}\n.stepper[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  position: relative;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.stepper[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(:last-child)::after {\n  content: "";\n  position: absolute;\n  top: 12px;\n  left: calc(50% + 16px);\n  right: calc(-50% + 16px);\n  height: 2px;\n  background: var(--%NS%sand-200);\n}\n.stepper[_ngcontent-%COMP%]   li.done[_ngcontent-%COMP%]:not(:last-child)::after {\n  background: var(--%NS%forest-400);\n}\n.stepper[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  border: 2px solid var(--%NS%sand-300);\n  background: var(--%NS%surface);\n  font: 600 11px var(--%NS%mono);\n  color: var(--%NS%text-3);\n}\n.stepper[_ngcontent-%COMP%]   li.done[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n  border-color: var(--%NS%forest-500);\n  color: #fff;\n}\n.stepper[_ngcontent-%COMP%]   li.cur[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-600);\n  color: var(--%NS%forest-700);\n  box-shadow: var(--%NS%focus);\n}\n.stepper[_ngcontent-%COMP%]   li.cur[_ngcontent-%COMP%]   .sl[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n  font-weight: 600;\n}\n.next[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  background: var(--%NS%surface-2);\n}\n/*# sourceMappingURL=risk.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RiskPage, [{
    type: Component,
    args: [{ selector: "vc-risk-page", imports: [...KIT, FormsModule, NumPipe, DayPipe, TitleCasePipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Risk & permanence" eyebrow="Care"
      subtitle="Events that could reverse stored carbon \u2014 a farmer leaving, land-use change, fire, flood or practices being dropped \u2014 and how they compare with the buffer pool held back from credits.">
      @if (canManage() && ctx.currentId()) { <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Record risk event</button> }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Risk is tracked per project. Pick one in the top bar." /></div>
    } @else {
      @if (summary.error()) {
        <vc-error title="Couldn't load the risk summary" [message]="summary.error()!.message" />
      } @else if (summary.data(); as s) {
        <div class="sum">
          <section class="card buffer">
            <div class="card-head"><h3>Open risk vs buffer pool</h3>
              <vc-badge [status]="s.estimated_impact_t === 0 ? 'ok' : s.buffer_sufficient ? 'ok' : 'blocking'">{{ s.estimated_impact_t === 0 ? 'No exposure' : s.buffer_sufficient ? 'Buffer covers it' : 'Buffer exceeded' }}</vc-badge>
            </div>
            <div class="card-body">
              <div class="bars">
                <div class="br">
                  <span class="bl">Estimated impact of open events</span>
                  <div class="bt"><span class="bf imp" [class.over]="!s.buffer_sufficient" [style.width.%]="w(s.estimated_impact_t, s)"></span></div>
                  <strong class="num">{{ s.estimated_impact_t | num: 2 }} <small>tCO\u2082e</small></strong>
                </div>
                <div class="br">
                  <span class="bl">Buffer pool from approved results</span>
                  <div class="bt"><span class="bf buf" [style.width.%]="w(s.buffer_t_co2e, s)"></span></div>
                  <strong class="num">{{ s.buffer_t_co2e | num: 2 }} <small>tCO\u2082e</small></strong>
                </div>
              </div>
              <p class="msg" [class.bad]="!s.buffer_sufficient"><vc-icon [name]="s.buffer_sufficient ? 'info' : 'alert'" [size]="15" />{{ s.message }}</p>
              <p class="small muted expl">The buffer is a share of every verified result that is held back, never sold, to cover carbon that might be lost later.
                It comes from {{ s.approved_runs }} approved calculation{{ s.approved_runs === 1 ? '' : 's' }}.
                @if (s.events_without_estimate) { <strong>{{ s.events_without_estimate }} open event{{ s.events_without_estimate === 1 ? ' has' : 's have' }} no impact estimate yet</strong> and {{ s.events_without_estimate === 1 ? 'is' : 'are' }} not counted. }</p>
            </div>
          </section>
          <section class="card">
            <div class="card-head"><h3>Open events</h3><strong class="num big">{{ s.open }}</strong></div>
            <div class="card-body">
              <div class="sev">
                @for (sv of ['high', 'medium', 'low']; track sv) {
                  <div class="sv" [class]="'s-' + sv"><span>{{ sv | titlecase }}</span><strong class="num">{{ s.open_by_severity[sv] ?? 0 }}</strong></div>
                }
              </div>
              <ul class="kinds">
                @for (k of kindRows(s); track k.key) {
                  <li><vc-icon [name]="k.icon" [size]="14" /><span>{{ k.label }}</span><span class="kb"><span [style.width.%]="k.w"></span></span><strong class="num">{{ k.n }}</strong></li>
                } @empty { <li class="muted small">No open events.</li> }
              </ul>
              <p class="small subtle">{{ s.resolved }} resolved to date.</p>
            </div>
          </section>
        </div>
      }

      <div class="filters">
        <div class="seg">
          @for (f of statusFilters; track f.key) {
            <button type="button" [class.on]="status() === f.key" (click)="status.set(f.key)">{{ f.label }}<span class="c num">{{ countStatus(f.key) }}</span></button>
          }
        </div>
        <select class="input kf" [ngModel]="kind()" (ngModelChange)="kind.set($event)" aria-label="Kind">
          <option value="">All kinds</option>
          @for (k of kinds; track k.key) { <option [value]="k.key">{{ k.label }}</option> }
        </select>
      </div>

      <section class="card">
        @if (events.loading()) {
          <vc-loading [rows]="5" />
        } @else if (events.error()) {
          <div class="card-body"><vc-error title="Couldn't load risk events" [message]="events.error()!.message" /></div>
        } @else if (!rows().length) {
          <vc-empty icon="radar" [title]="status() || kind() ? 'No matching events' : 'No risk events recorded'"
            text="Record anything that could reverse soil carbon on an enrolled field, so its impact can be weighed against the buffer." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Occurred</th><th>Event</th><th>Field</th><th>Severity</th><th class="num">Est. impact</th><th>Progress</th><th></th></tr></thead>
              <tbody>
                @for (e of rows(); track e.id) {
                  <tr class="clickable" (click)="openDetail(e)">
                    <td class="nowrap">{{ e.occurred_on | day }}</td>
                    <td><div class="ev"><span class="ki"><vc-icon [name]="kindIcon(e.kind)" [size]="14" />{{ kindLabel(e.kind) }}</span><span class="small muted truncate">{{ e.description }}</span></div></td>
                    <td>{{ fieldCode(e.field_id) }}</td>
                    <td><span class="sevb" [class]="'s-' + e.severity">{{ e.severity | titlecase }}</span></td>
                    <td class="num">@if (e.estimated_impact_t !== null) { {{ e.estimated_impact_t | num: 2 }} <span class="u">t</span> } @else { <span class="subtle">Not estimated</span> }</td>
                    <td><div class="flow">@for (st of flow; track st) { <span class="fd" [class.done]="idx(e.status) >= $index" [title]="step(st).label"></span> }<span class="small">{{ step(e.status).label }}</span></div></td>
                    <td class="num"><vc-icon name="chevron-right" class="subtle" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <!-- create -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="500px" title="Record a risk event" [subtitle]="ctx.current()?.name ?? ''">
      <form class="form-grid" id="riskCreate" (ngSubmit)="create()">
        <div class="field span-2">
          <label>What happened</label>
          <div class="kgrid">
            @for (k of kinds; track k.key) {
              <label class="kopt" [class.on]="cf.kind === k.key"><input type="radio" name="kind" [value]="k.key" [(ngModel)]="cf.kind" /><vc-icon [name]="k.icon" [size]="15" />{{ k.label }}</label>
            }
          </div>
        </div>
        <div class="field"><label for="co">Occurred on</label><input id="co" type="date" class="input" name="co" [(ngModel)]="cf.occurred_on" [max]="today" /></div>
        <div class="field"><label for="cs">Severity</label>
          <select id="cs" class="input" name="cs" [(ngModel)]="cf.severity"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
        <div class="field span-2"><label for="cfld">Field</label>
          <select id="cfld" class="input" name="cfld" [(ngModel)]="cf.field_id"><option value="">Whole project / not field-specific</option>
            @for (f of fields.data() ?? []; track f.id) { <option [value]="f.id">{{ f.code }} \xB7 {{ f.name }}</option> }</select></div>
        <div class="field span-2"><label for="ci">Estimated impact</label>
          <div class="unit"><input id="ci" type="number" min="0" step="0.01" class="input num" name="ci" [(ngModel)]="cf.impact" placeholder="Leave blank if not yet known" /><span>tCO\u2082e</span></div>
          <span class="hint">Carbon that could be lost if this is not reversed. You can add or change it later.</span></div>
        <div class="field span-2"><label for="cd">Description</label>
          <textarea id="cd" class="input" name="cd" rows="4" [(ngModel)]="cf.description" placeholder="What was seen, by whom, and what is known so far."></textarea></div>
        @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="riskCreate" [disabled]="saving() || cf.description.trim().length < 5">{{ saving() ? 'Saving\u2026' : 'Record event' }}</button>
      </ng-container>
    </vc-modal>

    <!-- detail -->
    <vc-modal [(open)]="detailOpen" [drawer]="true" width="540px" [title]="sel() ? kindLabel(sel()!.kind) : ''" [subtitle]="sel() ? (sel()!.occurred_on | day) + ' \xB7 ' + fieldCode(sel()!.field_id) : ''">
      @if (sel(); as e) {
        <div class="stack" style="--gap:20px">
          <ol class="stepper">
            @for (st of flow; track st) {
              <li [class.done]="idx(e.status) > $index" [class.cur]="e.status === st">
                <span class="dot">@if (idx(e.status) > $index) { <vc-icon name="check" [size]="12" /> } @else { {{ $index + 1 }} }</span>
                <span class="sl">{{ step(st).label }}</span>
              </li>
            }
          </ol>

          @if (e.status !== 'resolved' && canManage()) {
            <div class="next card card-pad">
              <div class="row"><strong>Next step: {{ step(next(e)!).label }}</strong><span class="spacer"></span><span class="small subtle">{{ step(next(e)!).hint }}</span></div>
              <div class="field"><label for="mn">Note for the audit trail <span class="subtle">(optional)</span></label>
                <input id="mn" class="input" [(ngModel)]="moveNote" placeholder="e.g. Visited the field with the farmer on 12 Sep" /></div>
              @if (next(e) === 'resolved') {
                <div class="field"><label for="mr">Resolution</label>
                  <textarea id="mr" class="input" rows="3" [(ngModel)]="moveResolution" placeholder="How was the risk resolved? What changed on the ground?"></textarea>
                  <span class="hint">Required. Resolved events can't be edited afterwards.</span></div>
              }
              @if (moveError()) { <vc-error title="Status not changed" [message]="moveError()!" /> }
              <div class="row" style="justify-content:flex-end"><button class="btn btn-primary" [disabled]="moving() || (next(e) === 'resolved' && !moveResolution.trim())" (click)="move(e)">
                <vc-icon name="arrow-right" />{{ step(next(e)!).verb }}</button></div>
            </div>
          }

          @if (e.status === 'resolved' && e.resolution) {
            <vc-callout tone="ok" icon="check-circle"><strong>Resolution</strong><p style="margin-top:4px">{{ e.resolution }}</p></vc-callout>
          }

          @if (editing()) {
            <form class="form-grid" (ngSubmit)="saveEdit(e)" id="riskEdit">
              <div class="field"><label for="es">Severity</label>
                <select id="es" class="input" name="es" [(ngModel)]="ef.severity"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              <div class="field"><label for="ei">Estimated impact (tCO\u2082e)</label><input id="ei" type="number" min="0" step="0.01" class="input num" name="ei" [(ngModel)]="ef.impact" /></div>
              <div class="field span-2"><label for="ed">Description</label><textarea id="ed" class="input" name="ed" rows="4" [(ngModel)]="ef.description"></textarea></div>
              @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
              <div class="span-2 row" style="justify-content:flex-end">
                <button class="btn btn-ghost" type="button" (click)="editing.set(false)">Cancel</button>
                <button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Saving\u2026' : 'Save changes' }}</button>
              </div>
            </form>
          } @else {
            <dl class="kv">
              <dt>Severity</dt><dd><span class="sevb" [class]="'s-' + e.severity">{{ e.severity | titlecase }}</span></dd>
              <dt>Estimated impact</dt><dd class="num">{{ e.estimated_impact_t === null ? 'Not estimated yet' : (e.estimated_impact_t | num: 2) + ' tCO\u2082e' }}</dd>
              <dt>Description</dt><dd>{{ e.description }}</dd>
              <dt>Evidence files</dt><dd>{{ e.evidence_ids.length || 'None attached' }}</dd>
              <dt>Recorded</dt><dd>{{ e.created_at | day: true }}</dd>
              <dt>Last change</dt><dd>{{ e.updated_at | day: true }}</dd>
            </dl>
            @if (canManage() && e.status !== 'resolved') {
              <div><button class="btn btn-secondary btn-sm" (click)="startEdit(e)"><vc-icon name="pencil" [size]="14" />Edit details</button></div>
            }
          }
        </div>
      }
    </vc-modal>
  `, styles: ['/* angular:styles/component:scss;9b175e63fbe46fe8;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\risk\\risk.page.ts */\n.sum {\n  display: grid;\n  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);\n  gap: 16px;\n  margin-bottom: 20px;\n}\n@media (max-width: 1100px) {\n  .sum {\n    grid-template-columns: 1fr;\n  }\n}\n.bars {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.br {\n  display: grid;\n  grid-template-columns: 220px 1fr 130px;\n  gap: 14px;\n  align-items: center;\n}\n@media (max-width: 800px) {\n  .br {\n    grid-template-columns: 1fr;\n  }\n}\n.bl {\n  font-size: 13px;\n  color: var(--stone-700);\n}\n.bt {\n  height: 14px;\n  border-radius: 7px;\n  background: var(--sand-100);\n  overflow: hidden;\n}\n.bf {\n  display: block;\n  height: 100%;\n  border-radius: 7px;\n  transition: width 0.4s;\n}\n.bf.imp {\n  background: var(--amber-600);\n}\n.bf.imp.over {\n  background: var(--red-600);\n}\n.bf.buf {\n  background: var(--forest-500);\n}\n.br strong {\n  text-align: right;\n  font-size: 16px;\n}\n.br small {\n  font-size: 11.5px;\n  color: var(--text-3);\n  font-weight: 500;\n}\n.msg {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin-top: 16px;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--forest-50);\n  color: var(--forest-800);\n  font-weight: 500;\n  font-size: 13.5px;\n}\n.msg.bad {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.expl {\n  margin-top: 10px;\n}\n.big {\n  font-size: 24px;\n  font-weight: 600;\n}\n.sev {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n  margin-bottom: 16px;\n}\n.sv {\n  display: flex;\n  flex-direction: column;\n  padding: 8px 12px;\n  border-radius: 8px;\n  background: var(--stone-100);\n}\n.sv span {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.sv strong {\n  font-size: 18px;\n}\n.sv.s-high {\n  background: var(--red-100);\n}\n.sv.s-high strong {\n  color: var(--red-600);\n}\n.sv.s-medium {\n  background: var(--amber-100);\n}\n.sv.s-medium strong {\n  color: var(--amber-600);\n}\n.kinds {\n  list-style: none;\n  margin: 0 0 10px;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.kinds li {\n  display: grid;\n  grid-template-columns: 16px 130px 1fr 28px;\n  gap: 8px;\n  align-items: center;\n  font-size: 13px;\n  color: var(--stone-700);\n}\n.kb {\n  height: 6px;\n  border-radius: 3px;\n  background: var(--sand-100);\n  overflow: hidden;\n}\n.kb span {\n  display: block;\n  height: 100%;\n  background: var(--stone-400);\n  border-radius: 3px;\n}\n.kinds strong {\n  text-align: right;\n}\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n}\n.seg {\n  display: inline-flex;\n  background: var(--surface);\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg button {\n  border: 0;\n  background: none;\n  font: 500 13px var(--font);\n  padding: 6px 12px;\n  border-radius: 6px;\n  color: var(--stone-600);\n  cursor: pointer;\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n}\n.seg button.on {\n  background: var(--forest-50);\n  color: var(--forest-700);\n  box-shadow: inset 0 0 0 1px var(--forest-200);\n}\n.seg .c {\n  font-size: 11px;\n  color: var(--text-3);\n}\n.kf {\n  width: 200px;\n}\n.ev {\n  display: flex;\n  flex-direction: column;\n  max-width: 420px;\n}\n.ki {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-weight: 500;\n}\n.sevb {\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 500;\n  padding: 2px 8px;\n  border-radius: 4px;\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.sevb.s-high {\n  background: var(--red-100);\n  color: var(--red-600);\n}\n.sevb.s-medium {\n  background: var(--amber-100);\n  color: var(--amber-600);\n}\n.u {\n  font-size: 11px;\n  color: var(--text-3);\n}\n.flow {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.fd {\n  width: 18px;\n  height: 5px;\n  border-radius: 3px;\n  background: var(--sand-200);\n}\n.fd.done {\n  background: var(--forest-500);\n}\n.flow .small {\n  margin-left: 6px;\n  color: var(--stone-700);\n}\n.kgrid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 6px;\n}\n.kopt {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  border: 1px solid var(--border-strong);\n  border-radius: 7px;\n  cursor: pointer;\n  font-size: 13px;\n  color: var(--stone-700);\n}\n.kopt input {\n  display: none;\n}\n.kopt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  color: var(--forest-800);\n}\n.unit {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.unit span {\n  font-size: 13px;\n  color: var(--text-2);\n}\n.stepper {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  gap: 0;\n}\n.stepper li {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  position: relative;\n  font-size: 12px;\n  color: var(--text-3);\n}\n.stepper li:not(:last-child)::after {\n  content: "";\n  position: absolute;\n  top: 12px;\n  left: calc(50% + 16px);\n  right: calc(-50% + 16px);\n  height: 2px;\n  background: var(--sand-200);\n}\n.stepper li.done:not(:last-child)::after {\n  background: var(--forest-400);\n}\n.stepper .dot {\n  display: grid;\n  place-items: center;\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  border: 2px solid var(--sand-300);\n  background: var(--surface);\n  font: 600 11px var(--mono);\n  color: var(--text-3);\n}\n.stepper li.done .dot {\n  background: var(--forest-500);\n  border-color: var(--forest-500);\n  color: #fff;\n}\n.stepper li.cur .dot {\n  border-color: var(--forest-600);\n  color: var(--forest-700);\n  box-shadow: var(--focus);\n}\n.stepper li.cur .sl {\n  color: var(--stone-900);\n  font-weight: 600;\n}\n.next {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  background: var(--surface-2);\n}\n/*# sourceMappingURL=risk.page.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RiskPage, { className: "RiskPage", filePath: "src/app/features/risk/risk.page.ts", lineNumber: 288 });
})();

// src/app/features/risk/risk.routes.ts
var risk_routes_default = [{ path: "", component: RiskPage, title: "Risk & permanence \xB7 Varsapradaya Carbon" }];
export {
  risk_routes_default as default
};
//# debugId=6703c272-2e23-59bf-9cb7-12c0a366dcb5
//# sourceMappingURL=chunk-A5QI4UUN.js.map
