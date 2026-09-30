import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  AgoPipe,
  DayPipe,
  HumanPipe
} from "./chunk-E5UDMWWN.js";
import {
  AuthService,
  RouterLink
} from "./chunk-PNIM44LI.js";
import {
  Badge,
  Callout,
  Empty,
  ErrorBox,
  Loading,
  Modal,
  PageHeader
} from "./chunk-PAXTZ3VZ.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  computed,
  effect,
  forkJoin,
  inject,
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
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/quality/quality.page.ts
var _c0 = () => [];
var _forTrack0 = ($index, $item) => $item.code;
var _forTrack1 = ($index, $item) => $item.key;
var _forTrack2 = ($index, $item) => $item.id;
var _forTrack3 = ($index, $item) => $item.k;
function QualityPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 16);
    \u0275\u0275listener("click", function QualityPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.run());
    });
    \u0275\u0275element(1, "vc-icon", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.running() || !ctx_r1.ctx.currentId());
    \u0275\u0275advance();
    \u0275\u0275classProp("spin", ctx_r1.running());
    \u0275\u0275property("name", ctx_r1.running() ? "refresh" : "play");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.running() ? "Running checks\u2026" : "Run checks now", " ");
  }
}
function QualityPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-empty", 18);
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_3_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "No blocking findings \u2014 the calculation can proceed.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Warnings and errors should still be reviewed before the results are submitted for verification.");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_3_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Fix the underlying data (for example re-take a sample or correct a lab entry) and run the checks again.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", s_r4.blocking, " blocking finding", s_r4.blocking === 1 ? "" : "s", " stop the calculation.");
  }
}
function QualityPage_Conditional_3_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 43);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "ago");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Last run ", \u0275\u0275pipeBind1(2, 1, ctx_r1.lastRun()));
  }
}
function QualityPage_Conditional_3_Conditional_0_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 46);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Conditional_0_For_8_Template_button_click_0_listener() {
      const k_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.sev.set(ctx_r1.sev() === k_r6 ? "" : k_r6));
    });
    \u0275\u0275elementStart(1, "div", 47)(2, "span", 48);
    \u0275\u0275element(3, "vc-icon", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 49);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 50);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 51);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const k_r6 = ctx.$implicit;
    const s_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap("tile s-" + k_r6);
    \u0275\u0275classProp("on", ctx_r1.sev() === k_r6);
    \u0275\u0275advance(3);
    \u0275\u0275property("name", ctx_r1.meta[k_r6].icon)("size", 15);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.meta[k_r6].label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r4.open_by_severity[k_r6] ?? 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("open \xB7 ", ctx_r1.meta[k_r6].hint);
  }
}
function QualityPage_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275element(1, "vc-icon", 41);
    \u0275\u0275elementStart(2, "div", 42);
    \u0275\u0275conditionalCreate(3, QualityPage_Conditional_3_Conditional_0_Conditional_3_Template, 4, 0)(4, QualityPage_Conditional_3_Conditional_0_Conditional_4_Template, 4, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, QualityPage_Conditional_3_Conditional_0_Conditional_5_Template, 3, 3, "span", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 44);
    \u0275\u0275repeaterCreate(7, QualityPage_Conditional_3_Conditional_0_For_8_Template, 10, 9, "button", 45, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("ok", s_r4.can_calculate);
    \u0275\u0275advance();
    \u0275\u0275property("name", s_r4.can_calculate ? "check-circle" : "ban")("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(s_r4.can_calculate ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.lastRun() ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.sevs);
  }
}
function QualityPage_Conditional_3_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = ctx.$implicit;
    \u0275\u0275property("value", r_r7.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.title);
  }
}
function QualityPage_Conditional_3_For_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", e_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.entityLabel(e_r8));
  }
}
function QualityPage_Conditional_3_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 36);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function QualityPage_Conditional_3_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37)(1, "vc-error", 52)(2, "button", 53);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Conditional_34_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.load());
    });
    \u0275\u0275text(3, "Try again");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function QualityPage_Conditional_3_Conditional_35_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 55);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Conditional_35_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.run());
    });
    \u0275\u0275element(1, "vc-icon", 56);
    \u0275\u0275text(2, "Run checks now");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_3_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 38);
    \u0275\u0275conditionalCreate(1, QualityPage_Conditional_3_Conditional_35_Conditional_1_Template, 3, 0, "button", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canRun() ? 1 : -1);
  }
}
function QualityPage_Conditional_3_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-empty", 39)(1, "button", 57);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Conditional_36_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clear());
    });
    \u0275\u0275text(2, "Clear filters");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("text", ctx_r1.status() === "active" ? "No open findings for these filters." : "Try different filters.");
  }
}
function QualityPage_Conditional_3_Conditional_37_For_17_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 63)(1, "td", 65)(2, "span");
    \u0275\u0275element(3, "vc-icon", 41);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 66);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const g_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("gl s-" + g_r12.key);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.meta[g_r12.key].icon)("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.meta[g_r12.key].label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(g_r12.items.length);
  }
}
function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 75);
    \u0275\u0275text(1, "still blocking");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_23_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 80);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_23_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const f_r14 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      ctx_r1.ask("acknowledge", f_r14);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275text(1, "Acknowledge");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_23_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 53);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_23_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const f_r14 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      ctx_r1.ask("resolve", f_r14);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275text(1, "Resolve");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_23_Conditional_0_Template, 2, 0, "button", 78);
    \u0275\u0275conditionalCreate(1, QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_23_Conditional_1_Template, 2, 0, "button", 79);
  }
  if (rf & 2) {
    const f_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(f_r14.status === "open" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r14.severity !== "blocking" ? 1 : -1);
  }
}
function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 67);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Template_tr_click_0_listener() {
      const f_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.openFinding(f_r14));
    });
    \u0275\u0275elementStart(1, "td", 60);
    \u0275\u0275element(2, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "div", 68);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "code", 69);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 70);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 71)(11, "a", 72);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Conditional_37_For_17_For_3_Template_a_click_11_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275text(12);
    \u0275\u0275elementStart(13, "span", 73);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275element(16, "vc-badge", 74);
    \u0275\u0275conditionalCreate(17, QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_17_Template, 2, 0, "div", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td", 76);
    \u0275\u0275pipe(19, "day");
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "ago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 77);
    \u0275\u0275conditionalCreate(23, QualityPage_Conditional_3_Conditional_37_For_17_For_3_Conditional_23_Template, 2, 2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("bar s-" + f_r14.severity);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.ruleTitle(f_r14.rule_code));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r14.rule_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r14.message);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", ctx_r1.entityRoute(f_r14))("queryParams", ctx_r1.entityParams(f_r14));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.entityLabel(f_r14.entity_type), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r14.entity_id.slice(0, 8));
    \u0275\u0275advance(2);
    \u0275\u0275property("status", f_r14.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r14.blocks_calculation && f_r14.status === "acknowledged" ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("title", \u0275\u0275pipeBind2(19, 14, f_r14.created_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 17, f_r14.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.canResolve() && f_r14.status !== "resolved" ? 23 : -1);
  }
}
function QualityPage_Conditional_3_Conditional_37_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tbody");
    \u0275\u0275conditionalCreate(1, QualityPage_Conditional_3_Conditional_37_For_17_Conditional_1_Template, 7, 6, "tr", 63);
    \u0275\u0275repeaterCreate(2, QualityPage_Conditional_3_Conditional_37_For_17_For_3_Template, 24, 19, "tr", 64, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.sort() === "severity" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(g_r12.items);
  }
}
function QualityPage_Conditional_3_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "table", 59)(2, "thead")(3, "tr");
    \u0275\u0275element(4, "th", 60);
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Check");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Finding");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Record");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Found");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(16, QualityPage_Conditional_3_Conditional_37_For_17_Template, 4, 1, "tbody", null, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 61)(19, "span", 62);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(16);
    \u0275\u0275repeater(ctx_r1.grouped());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r1.rows().length, " finding", ctx_r1.rows().length === 1 ? "" : "s");
  }
}
function QualityPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, QualityPage_Conditional_3_Conditional_0_Template, 9, 6);
    \u0275\u0275elementStart(1, "div", 19)(2, "div", 20);
    \u0275\u0275element(3, "vc-icon", 21);
    \u0275\u0275elementStart(4, "input", 22);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function QualityPage_Conditional_3_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.q.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "select", 23);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function QualityPage_Conditional_3_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.status.set($event));
    });
    \u0275\u0275elementStart(6, "option", 24);
    \u0275\u0275text(7, "Open & acknowledged");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "option", 25);
    \u0275\u0275text(9, "Open");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 26);
    \u0275\u0275text(11, "Acknowledged");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 27);
    \u0275\u0275text(13, "Resolved");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "option", 28);
    \u0275\u0275text(15, "All statuses");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "select", 29);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function QualityPage_Conditional_3_Template_select_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.rule.set($event));
    });
    \u0275\u0275elementStart(17, "option", 30);
    \u0275\u0275text(18, "All checks");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(19, QualityPage_Conditional_3_For_20_Template, 2, 2, "option", 31, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "select", 32);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function QualityPage_Conditional_3_Template_select_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.entity.set($event));
    });
    \u0275\u0275elementStart(22, "option", 30);
    \u0275\u0275text(23, "All records");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(24, QualityPage_Conditional_3_For_25_Template, 2, 2, "option", 31, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "span", 33);
    \u0275\u0275elementStart(27, "div", 34)(28, "button", 35);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sort.set("severity"));
    });
    \u0275\u0275text(29, "By severity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 35);
    \u0275\u0275listener("click", function QualityPage_Conditional_3_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sort.set("newest"));
    });
    \u0275\u0275text(31, "Newest");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "section", 2);
    \u0275\u0275conditionalCreate(33, QualityPage_Conditional_3_Conditional_33_Template, 1, 1, "vc-loading", 36)(34, QualityPage_Conditional_3_Conditional_34_Template, 4, 1, "div", 37)(35, QualityPage_Conditional_3_Conditional_35_Template, 2, 1, "vc-empty", 38)(36, QualityPage_Conditional_3_Conditional_36_Template, 3, 1, "vc-empty", 39)(37, QualityPage_Conditional_3_Conditional_37_Template, 21, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r1.summary()) ? 0 : -1, tmp_1_0);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.q());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.status());
    \u0275\u0275control();
    \u0275\u0275advance(11);
    \u0275\u0275property("ngModel", ctx_r1.rule());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.summary()?.rules ?? \u0275\u0275pureFunction0(11, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r1.entity());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.entityTypes());
    \u0275\u0275advance(4);
    \u0275\u0275classProp("on", ctx_r1.sort() === "severity");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r1.sort() === "newest");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.loading() ? 33 : ctx_r1.error() ? 34 : !ctx_r1.all().length ? 35 : !ctx_r1.rows().length ? 36 : 37);
  }
}
function QualityPage_Conditional_5_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 82);
    \u0275\u0275element(1, "vc-icon", 88);
    \u0275\u0275text(2, "Blocks calculation");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
  }
}
function QualityPage_Conditional_5_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd", 89);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, d_r17.k));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(d_r17.v);
  }
}
function QualityPage_Conditional_5_Conditional_24_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r18 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r18.resolved_by, " \xB7 ", \u0275\u0275pipeBind2(2, 2, f_r18.resolved_at, true));
  }
}
function QualityPage_Conditional_5_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275conditionalCreate(4, QualityPage_Conditional_5_Conditional_24_Conditional_4_Template, 3, 5, "div", 66);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r18 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r18.status === "resolved" ? "Resolution" : "Note");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u201C", f_r18.resolution_note, "\u201D");
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r18.resolved_by ? 4 : -1);
  }
}
function QualityPage_Conditional_5_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 87)(1, "strong");
    \u0275\u0275text(2, "Blocking findings can't be resolved by hand.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Fix the data it points to and run the checks again \u2014 it resolves itself once the check passes. Acknowledging it records that you've seen it, but it keeps blocking the calculation. ");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 81)(2, "span");
    \u0275\u0275element(3, "vc-icon", 41);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "vc-badge", 74);
    \u0275\u0275conditionalCreate(6, QualityPage_Conditional_5_Conditional_6_Template, 3, 1, "span", 82);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 83);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dl", 84)(10, "dt");
    \u0275\u0275text(11, "Record");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dd")(13, "a", 85);
    \u0275\u0275text(14);
    \u0275\u0275elementStart(15, "span", 86);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "dt");
    \u0275\u0275text(18, "Found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(22, QualityPage_Conditional_5_For_23_Template, 5, 4, null, null, _forTrack3);
    \u0275\u0275conditionalCreate(24, QualityPage_Conditional_5_Conditional_24_Template, 5, 3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, QualityPage_Conditional_5_Conditional_25_Template, 4, 0, "vc-callout", 87);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r18 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275classMap("sevpill s-" + f_r18.severity);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.meta[f_r18.severity].icon)("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.sevOne(f_r18.severity));
    \u0275\u0275advance();
    \u0275\u0275property("status", f_r18.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r18.blocks_calculation ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r18.message);
    \u0275\u0275advance(5);
    \u0275\u0275property("routerLink", ctx_r1.entityRoute(f_r18))("queryParams", ctx_r1.entityParams(f_r18));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.entityLabel(f_r18.entity_type), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r18.entity_id.slice(0, 8));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(21, 15, f_r18.created_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.detailRows(f_r18));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(f_r18.resolution_note ? 24 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r18.severity === "blocking" && f_r18.status !== "resolved" ? 25 : -1);
  }
}
function QualityPage_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 57);
    \u0275\u0275listener("click", function QualityPage_Conditional_6_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.ask("acknowledge", ctx_r1.current()));
    });
    \u0275\u0275text(1, "Acknowledge");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 55);
    \u0275\u0275listener("click", function QualityPage_Conditional_6_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.ask("resolve", ctx_r1.current()));
    });
    \u0275\u0275element(1, "vc-icon", 91);
    \u0275\u0275text(2, "Resolve");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275conditionalCreate(1, QualityPage_Conditional_6_Conditional_1_Template, 2, 0, "button", 90);
    \u0275\u0275conditionalCreate(2, QualityPage_Conditional_6_Conditional_2_Template, 3, 0, "button", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.current().status === "open" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.current().severity !== "blocking" ? 2 : -1);
  }
}
function QualityPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, "Explain why this is acceptable or what was done. The note is kept in the audit trail and shown to verifiers.");
    \u0275\u0275elementEnd();
  }
}
function QualityPage_Conditional_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "It stays blocking");
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " until the data is fixed and the checks pass. ");
  }
}
function QualityPage_Conditional_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " It stays visible until it is resolved. ");
  }
}
function QualityPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, "Acknowledging records that someone has reviewed the finding. ");
    \u0275\u0275conditionalCreate(2, QualityPage_Conditional_9_Conditional_2_Template, 3, 0)(3, QualityPage_Conditional_9_Conditional_3_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.target()?.severity === "blocking" ? 2 : 3);
  }
}
function QualityPage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.actError());
  }
}
var SEV = ["blocking", "error", "warning", "info"];
var SEV_META = {
  blocking: { label: "Blocking", icon: "ban", hint: "Stops the calculation" },
  error: { label: "Errors", icon: "x-circle", hint: "Must be reviewed" },
  warning: { label: "Warnings", icon: "alert", hint: "Worth a look" },
  info: { label: "Info", icon: "info", hint: "For the record" }
};
var ENTITY = {
  sample: { label: "Sample", route: "/app/sampling", param: "sample" },
  soil_layer: { label: "Soil layer", route: "/app/lab", param: "layer" },
  lab_result: { label: "Lab result", route: "/app/lab", param: "result" },
  sample_plan: { label: "Sampling plan", route: "/app/sampling", param: "plan" },
  sampling_point: { label: "Sampling point", route: "/app/sampling", param: "point" }
};
var QualityPage = class _QualityPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  sevs = SEV;
  meta = SEV_META;
  all = signal(
    [],
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  summary = signal(
    null,
    ...ngDevMode ? [{ debugName: "summary" }] : (
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
  running = signal(
    false,
    ...ngDevMode ? [{ debugName: "running" }] : (
      /* istanbul ignore next */
      []
    )
  );
  lastRun = signal(
    null,
    ...ngDevMode ? [{ debugName: "lastRun" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sev = signal(
    "",
    ...ngDevMode ? [{ debugName: "sev" }] : (
      /* istanbul ignore next */
      []
    )
  );
  status = signal(
    "active",
    ...ngDevMode ? [{ debugName: "status" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rule = signal(
    "",
    ...ngDevMode ? [{ debugName: "rule" }] : (
      /* istanbul ignore next */
      []
    )
  );
  entity = signal(
    "",
    ...ngDevMode ? [{ debugName: "entity" }] : (
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
  sort = signal(
    "severity",
    ...ngDevMode ? [{ debugName: "sort" }] : (
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
  current = signal(
    null,
    ...ngDevMode ? [{ debugName: "current" }] : (
      /* istanbul ignore next */
      []
    )
  );
  actOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "actOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  act = signal(
    "resolve",
    ...ngDevMode ? [{ debugName: "act" }] : (
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
  note = signal(
    "",
    ...ngDevMode ? [{ debugName: "note" }] : (
      /* istanbul ignore next */
      []
    )
  );
  actError = signal(
    null,
    ...ngDevMode ? [{ debugName: "actError" }] : (
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
  canRun = computed(
    () => this.auth.can("qa.resolve", "calc.run", "sampling.plan"),
    ...ngDevMode ? [{ debugName: "canRun" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canResolve = computed(
    () => this.auth.can("qa.resolve"),
    ...ngDevMode ? [{ debugName: "canResolve" }] : (
      /* istanbul ignore next */
      []
    )
  );
  entityTypes = computed(
    () => [...new Set(this.all().map((f) => f.entity_type))].sort(),
    ...ngDevMode ? [{ debugName: "entityTypes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => {
      const q = this.q().toLowerCase().trim();
      const st = this.status();
      return this.all().filter((f) => (!this.sev() || f.severity === this.sev()) && (st === "all" || (st === "active" ? f.status !== "resolved" : f.status === st)) && (!this.rule() || f.rule_code === this.rule()) && (!this.entity() || f.entity_type === this.entity()) && (!q || f.message.toLowerCase().includes(q) || f.rule_code.toLowerCase().includes(q)));
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  grouped = computed(
    () => {
      const rows = this.rows();
      if (this.sort() === "newest") {
        return [{ key: "info", items: [...rows].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")) }];
      }
      return SEV.map((k) => ({ key: k, items: rows.filter((f) => f.severity === k) })).filter((g) => g.items.length);
    },
    ...ngDevMode ? [{ debugName: "grouped" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      if (pid)
        this.load(pid);
    });
  }
  load(pid = this.ctx.currentId()) {
    if (!pid)
      return;
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      f: this.api.get(`/projects/${pid}/qa/findings`, { limit: 2e3 }),
      s: this.api.get(`/projects/${pid}/qa/summary`)
    }).subscribe({
      next: ({ f, s }) => {
        this.all.set(f);
        this.summary.set(s);
        this.loading.set(false);
        const cur = this.current();
        if (cur)
          this.current.set(f.find((x) => x.id === cur.id) ?? cur);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  run() {
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.running.set(true);
    this.api.post(`/projects/${pid}/qa/run`).subscribe({
      next: (r) => {
        this.running.set(false);
        this.lastRun.set(r.checked_at);
        const parts = SEV.filter((s) => r.counts[s]).map((s) => `${r.counts[s]} ${SEV_META[s].label.toLowerCase()}`);
        this.toast.success("Checks complete", r.total_open ? `${r.total_open} open: ${parts.join(", ")}.` : "Everything passes \u2014 no open findings.");
        this.load(pid);
      },
      error: (e) => {
        this.running.set(false);
        this.toast.apiError(e, "Couldn't run the checks");
      }
    });
  }
  clear() {
    this.sev.set("");
    this.status.set("active");
    this.rule.set("");
    this.entity.set("");
    this.q.set("");
  }
  ruleTitle(code) {
    return this.summary()?.rules.find((r) => r.code === code)?.title ?? code.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
  }
  entityLabel(t) {
    return ENTITY[t]?.label ?? t.replace(/_/g, " ");
  }
  entityRoute(f) {
    return ENTITY[f.entity_type]?.route ?? "/app/sampling";
  }
  entityParams(f) {
    return { [ENTITY[f.entity_type]?.param ?? "id"]: f.entity_id };
  }
  detailRows(f) {
    return Object.entries(f.details ?? {}).filter(([, v]) => v !== null && typeof v !== "object").map(([k, v]) => ({ k, v: String(v) }));
  }
  sevOne(s) {
    return { blocking: "Blocking", error: "Error", warning: "Warning", info: "Info" }[s];
  }
  openFinding(f) {
    this.current.set(f);
    this.detailOpen.set(true);
  }
  ask(a, f) {
    this.act.set(a);
    this.target.set(f);
    this.note.set("");
    this.actError.set(null);
    this.actOpen.set(true);
  }
  doAct() {
    const f = this.target();
    this.busy.set(true);
    this.actError.set(null);
    this.api.post(`/qa/findings/${f.id}/${this.act()}`, { note: this.note().trim() }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.actOpen.set(false);
        this.all.update((list) => list.map((x) => x.id === r.id ? r : x));
        if (this.current()?.id === r.id)
          this.current.set(r);
        this.toast.success(this.act() === "resolve" ? "Finding resolved" : "Finding acknowledged", r.blocks_calculation ? "It still blocks the calculation until the data is fixed." : void 0);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.actError.set(e.message);
      }
    });
  }
  static \u0275fac = function QualityPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _QualityPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _QualityPage, selectors: [["vc-quality-page"]], decls: 24, vars: 18, consts: [["title", "Quality checks", "eyebrow", "Measurement", 3, "subtitle"], ["actions", "", 1, "btn", "btn-primary", 3, "disabled"], [1, "card"], ["width", "520px", 3, "openChange", "open", "drawer", "title", "subtitle"], [1, "stack"], ["footer", "", 1, "ft"], ["width", "520px", 3, "openChange", "open", "title", "subtitle"], [1, "muted"], [1, "field", "mt"], ["for", "q-note"], [1, "req"], ["id", "q-note", "rows", "3", 1, "input", 3, "ngModelChange", "ngModel", "placeholder"], [1, "hint"], ["tone", "danger", "icon", "alert", 1, "mt"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["actions", "", 1, "btn", "btn-primary", 3, "click", "disabled"], [3, "name"], ["icon", "briefcase", "title", "Choose a project", "text", "Quality checks are run per project. Pick one from the project menu at the top."], [1, "filters"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search messages\u2026", 1, "input", 3, "ngModelChange", "ngModel"], ["aria-label", "Status", 1, "input", 3, "ngModelChange", "ngModel"], ["value", "active"], ["value", "open"], ["value", "acknowledged"], ["value", "resolved"], ["value", "all"], ["aria-label", "Check", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["aria-label", "Record type", 1, "input", "sm", 3, "ngModelChange", "ngModel"], [1, "spacer"], [1, "seg"], ["type", "button", 3, "click"], [3, "rows"], [1, "card-body"], ["icon", "shield-check", "title", "No findings yet", "text", "Checks run automatically when samples and lab results arrive. You can also run them now."], ["icon", "check-circle", "title", "Nothing matches", 3, "text"], [1, "gate"], [3, "name", "size"], [1, "g-t"], [1, "g-last", "small"], [1, "tiles"], ["type", "button", 1, "tile", 3, "class", "on"], ["type", "button", 1, "tile", 3, "click"], [1, "t-top"], [1, "t-ic"], [1, "t-l"], [1, "t-v", "num"], [1, "t-h"], ["title", "Couldn't load quality findings", 3, "message"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], ["name", "play"], [1, "btn", "btn-secondary", 3, "click"], [1, "table-wrap"], [1, "table"], [1, "sev-col"], [1, "card-foot"], [1, "subtle", "small", "grow"], [1, "grp"], [1, "clickable"], ["colspan", "7"], [1, "subtle", "small"], [1, "clickable", 3, "click"], [1, "rt"], [1, "rc"], [1, "msg"], [1, "nowrap"], [1, "ent", 3, "click", "routerLink", "queryParams"], [1, "mono"], [3, "status"], [1, "still", "small"], [1, "nowrap", "subtle", "small", 3, "title"], [1, "num", "nowrap"], [1, "btn", "btn-ghost", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [1, "row", "wrap"], [1, "blk", "small"], [1, "big-msg"], [1, "kv"], [3, "routerLink", "queryParams"], [1, "mono", "small"], ["tone", "danger", "icon", "ban"], ["name", "lock", 3, "size"], [1, "num"], [1, "btn", "btn-secondary"], ["name", "check"]], template: function QualityPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, QualityPage_Conditional_1_Template, 3, 5, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(2, QualityPage_Conditional_2_Template, 2, 0, "div", 2)(3, QualityPage_Conditional_3_Template, 38, 12);
      \u0275\u0275elementStart(4, "vc-modal", 3);
      \u0275\u0275twoWayListener("openChange", function QualityPage_Template_vc_modal_openChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.detailOpen, $event) || (ctx.detailOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(5, QualityPage_Conditional_5_Template, 26, 18, "div", 4);
      \u0275\u0275conditionalCreate(6, QualityPage_Conditional_6_Template, 3, 2, "div", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "vc-modal", 6);
      \u0275\u0275twoWayListener("openChange", function QualityPage_Template_vc_modal_openChange_7_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.actOpen, $event) || (ctx.actOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(8, QualityPage_Conditional_8_Template, 2, 0, "p", 7)(9, QualityPage_Conditional_9_Template, 4, 1, "p", 7);
      \u0275\u0275elementStart(10, "div", 8)(11, "label", 9);
      \u0275\u0275text(12, "Note ");
      \u0275\u0275elementStart(13, "span", 10);
      \u0275\u0275text(14, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "textarea", 11);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function QualityPage_Template_textarea_ngModelChange_15_listener($event) {
        return ctx.note.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span", 12);
      \u0275\u0275text(17, "At least 5 characters.");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(18, QualityPage_Conditional_18_Template, 2, 1, "vc-callout", 13);
      \u0275\u0275elementStart(19, "div", 5)(20, "button", 14);
      \u0275\u0275listener("click", function QualityPage_Template_button_click_20_listener() {
        return ctx.actOpen.set(false);
      });
      \u0275\u0275text(21, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "button", 15);
      \u0275\u0275listener("click", function QualityPage_Template_button_click_22_listener() {
        return ctx.doAct();
      });
      \u0275\u0275text(23);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_7_0;
      \u0275\u0275property("subtitle", "Automatic checks on samples, lab results and sampling plans for " + (ctx.ctx.current()?.name ?? "the current project") + ". Blocking findings stop the carbon calculation until the data is fixed.");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.canRun() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.ctx.currentId() && ctx.ctx.loaded() ? 2 : 3);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.detailOpen);
      \u0275\u0275property("drawer", true)("title", ctx.current() ? ctx.ruleTitle(ctx.current().rule_code) : "")("subtitle", ctx.current()?.rule_code ?? "");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_7_0 = ctx.current()) ? 5 : -1, tmp_7_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.current() && ctx.canResolve() && ctx.current().status !== "resolved" ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.actOpen);
      \u0275\u0275property("title", ctx.act() === "resolve" ? "Resolve finding" : "Acknowledge finding")("subtitle", ctx.target()?.message ?? "");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.act() === "resolve" ? 8 : 9);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.note())("placeholder", ctx.act() === "resolve" ? "e.g. GPS accuracy was 6 m under tree canopy; position confirmed against the site photo" : "e.g. Re-sampling scheduled with the field team for next week");
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.actError() ? 18 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.note().trim().length < 5 || ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.busy() ? "Saving\u2026" : ctx.act() === "resolve" ? "Resolve" : "Acknowledge");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, RouterLink, PageHeader, Loading, ErrorBox, Empty, Badge, Callout, Modal, Icon, DayPipe, AgoPipe, HumanPipe], styles: ['\n.spin[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.gate[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n  padding: 14px 18px;\n  border-radius: var(--%NS%radius);\n  margin-bottom: 16px;\n  background: var(--%NS%danger-soft);\n  border: 1px solid #f3c7c3;\n  color: var(--%NS%red-600);\n}\n.gate.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  border-color: #cfe2d4;\n  color: var(--%NS%forest-600);\n}\n.g-t[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.g-t[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n}\n.g-t[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n  font-size: 13px;\n}\n.g-last[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n  white-space: nowrap;\n}\n.tiles[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n@media (max-width: 900px) {\n  .tiles[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.tile[_ngcontent-%COMP%] {\n  position: relative;\n  text-align: left;\n  padding: 14px 16px;\n  border-radius: var(--%NS%radius);\n  border: 1px solid var(--%NS%border);\n  background: var(--%NS%surface);\n  box-shadow: var(--%NS%shadow-sm);\n  cursor: pointer;\n  font: inherit;\n  overflow: hidden;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.tile[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 3px;\n  background: var(--%NS%c);\n}\n.tile[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-300);\n}\n.tile.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%c);\n  box-shadow: 0 0 0 1px var(--%NS%c) inset;\n}\n.t-top[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.t-ic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 26px;\n  height: 26px;\n  border-radius: 7px;\n  background: var(--%NS%cs);\n  color: var(--%NS%c);\n}\n.t-l[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--%NS%stone-700);\n}\n.t-v[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 8px;\n  color: var(--%NS%stone-900);\n}\n.t-h[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.s-blocking[_ngcontent-%COMP%] {\n  --%NS%c:var(--%NS%red-600);\n  --%NS%cs:var(--%NS%red-100);\n}\n.s-error[_ngcontent-%COMP%] {\n  --%NS%c:var(--%NS%clay-600);\n  --%NS%cs:var(--%NS%clay-100);\n}\n.s-warning[_ngcontent-%COMP%] {\n  --%NS%c:var(--%NS%amber-600);\n  --%NS%cs:var(--%NS%amber-100);\n}\n.s-info[_ngcontent-%COMP%] {\n  --%NS%c:var(--%NS%sky-600);\n  --%NS%cs:var(--%NS%sky-100);\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 0 1 280px;\n  min-width: 200px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 200px;\n}\n.filters[_ngcontent-%COMP%]   select.sm[_ngcontent-%COMP%] {\n  width: 160px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  padding: 3px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: 500 12.5px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%stone-900);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.sev-col[_ngcontent-%COMP%] {\n  width: 6px;\n  padding: 0 0 0 10px !important;\n}\n.bar[_ngcontent-%COMP%] {\n  display: block;\n  width: 4px;\n  height: 30px;\n  border-radius: 2px;\n  background: var(--%NS%c);\n}\n.grp[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%surface-2);\n  padding: 8px 14px;\n  border-bottom: 1px solid var(--%NS%border);\n}\n.gl[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--%NS%c);\n  margin-right: 8px;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.rt[_ngcontent-%COMP%] {\n  font-weight: 500;\n  white-space: nowrap;\n}\n.rc[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.msg[_ngcontent-%COMP%] {\n  max-width: 460px;\n  color: var(--%NS%stone-800);\n}\n.ent[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n}\n.ent[_ngcontent-%COMP%]   .mono[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.still[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n  margin-top: 3px;\n}\n.grow[_ngcontent-%COMP%] {\n  margin-right: auto;\n}\n.sevpill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n  height: 24px;\n  padding: 0 9px;\n  border-radius: 999px;\n  background: var(--%NS%cs);\n  color: var(--%NS%c);\n  font-size: 12px;\n  font-weight: 600;\n}\n.blk[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  color: var(--%NS%red-600);\n}\n.big-msg[_ngcontent-%COMP%] {\n  font-size: 15px;\n  line-height: 1.5;\n  color: var(--%NS%stone-900);\n}\n.req[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=quality.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QualityPage, [{
    type: Component,
    args: [{ selector: "vc-quality-page", imports: [FormsModule, RouterLink, PageHeader, Loading, ErrorBox, Empty, Badge, Callout, Modal, Icon, DayPipe, AgoPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Quality checks" eyebrow="Measurement"
      [subtitle]="'Automatic checks on samples, lab results and sampling plans for ' + (ctx.current()?.name ?? 'the current project') + '. Blocking findings stop the carbon calculation until the data is fixed.'">
      @if (canRun()) {
        <button actions class="btn btn-primary" [disabled]="running() || !ctx.currentId()" (click)="run()">
          <vc-icon [name]="running() ? 'refresh' : 'play'" [class.spin]="running()" />{{ running() ? 'Running checks\u2026' : 'Run checks now' }}
        </button>
      }
    </vc-page-header>

    @if (!ctx.currentId() && ctx.loaded()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Quality checks are run per project. Pick one from the project menu at the top." /></div>
    } @else {
      @if (summary(); as s) {
        <div class="gate" [class.ok]="s.can_calculate">
          <vc-icon [name]="s.can_calculate ? 'check-circle' : 'ban'" [size]="20" />
          <div class="g-t">
            @if (s.can_calculate) {
              <strong>No blocking findings \u2014 the calculation can proceed.</strong>
              <span>Warnings and errors should still be reviewed before the results are submitted for verification.</span>
            } @else {
              <strong>{{ s.blocking }} blocking finding{{ s.blocking === 1 ? '' : 's' }} stop the calculation.</strong>
              <span>Fix the underlying data (for example re-take a sample or correct a lab entry) and run the checks again.</span>
            }
          </div>
          @if (lastRun()) { <span class="g-last small">Last run {{ lastRun() | ago }}</span> }
        </div>

        <div class="tiles">
          @for (k of sevs; track k) {
            <button type="button" class="tile" [class]="'tile s-' + k" [class.on]="sev() === k" (click)="sev.set(sev() === k ? '' : k)">
              <div class="t-top"><span class="t-ic"><vc-icon [name]="meta[k].icon" [size]="15" /></span><span class="t-l">{{ meta[k].label }}</span></div>
              <div class="t-v num">{{ s.open_by_severity[k] ?? 0 }}</div>
              <div class="t-h">open \xB7 {{ meta[k].hint }}</div>
            </button>
          }
        </div>
      }

      <div class="filters">
        <div class="search"><vc-icon name="search" [size]="15" /><input class="input" placeholder="Search messages\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
        <select class="input" [ngModel]="status()" (ngModelChange)="status.set($event)" aria-label="Status">
          <option value="active">Open & acknowledged</option><option value="open">Open</option><option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option><option value="all">All statuses</option>
        </select>
        <select class="input" [ngModel]="rule()" (ngModelChange)="rule.set($event)" aria-label="Check">
          <option value="">All checks</option>
          @for (r of summary()?.rules ?? []; track r.code) { <option [value]="r.code">{{ r.title }}</option> }
        </select>
        <select class="input sm" [ngModel]="entity()" (ngModelChange)="entity.set($event)" aria-label="Record type">
          <option value="">All records</option>
          @for (e of entityTypes(); track e) { <option [value]="e">{{ entityLabel(e) }}</option> }
        </select>
        <span class="spacer"></span>
        <div class="seg">
          <button type="button" [class.on]="sort() === 'severity'" (click)="sort.set('severity')">By severity</button>
          <button type="button" [class.on]="sort() === 'newest'" (click)="sort.set('newest')">Newest</button>
        </div>
      </div>

      <section class="card">
        @if (loading()) { <vc-loading [rows]="8" /> }
        @else if (error()) { <div class="card-body"><vc-error title="Couldn't load quality findings" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div> }
        @else if (!all().length) {
          <vc-empty icon="shield-check" title="No findings yet" text="Checks run automatically when samples and lab results arrive. You can also run them now.">
            @if (canRun()) { <button class="btn btn-primary" (click)="run()"><vc-icon name="play" />Run checks now</button> }
          </vc-empty>
        } @else if (!rows().length) {
          <vc-empty icon="check-circle" title="Nothing matches" [text]="status() === 'active' ? 'No open findings for these filters.' : 'Try different filters.'">
            <button class="btn btn-secondary" (click)="clear()">Clear filters</button>
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th class="sev-col"></th><th>Check</th><th>Finding</th><th>Record</th><th>Status</th><th>Found</th><th></th></tr></thead>
              @for (g of grouped(); track g.key) {
                <tbody>
                  @if (sort() === 'severity') {
                    <tr class="grp"><td colspan="7"><span [class]="'gl s-' + g.key"><vc-icon [name]="meta[g.key].icon" [size]="13" />{{ meta[g.key].label }}</span><span class="subtle small">{{ g.items.length }}</span></td></tr>
                  }
                  @for (f of g.items; track f.id) {
                    <tr class="clickable" (click)="openFinding(f)">
                      <td class="sev-col"><span [class]="'bar s-' + f.severity"></span></td>
                      <td><div class="rt">{{ ruleTitle(f.rule_code) }}</div><code class="rc">{{ f.rule_code }}</code></td>
                      <td class="msg">{{ f.message }}</td>
                      <td class="nowrap">
                        <a [routerLink]="entityRoute(f)" [queryParams]="entityParams(f)" (click)="$event.stopPropagation()" class="ent">
                          {{ entityLabel(f.entity_type) }} <span class="mono">{{ f.entity_id.slice(0, 8) }}</span>
                        </a>
                      </td>
                      <td>
                        <vc-badge [status]="f.status" />
                        @if (f.blocks_calculation && f.status === 'acknowledged') { <div class="still small">still blocking</div> }
                      </td>
                      <td class="nowrap subtle small" [title]="f.created_at | day: true">{{ f.created_at | ago }}</td>
                      <td class="num nowrap">
                        @if (canResolve() && f.status !== 'resolved') {
                          @if (f.status === 'open') { <button class="btn btn-ghost btn-sm" (click)="ask('acknowledge', f); $event.stopPropagation()">Acknowledge</button> }
                          @if (f.severity !== 'blocking') { <button class="btn btn-secondary btn-sm" (click)="ask('resolve', f); $event.stopPropagation()">Resolve</button> }
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              }
            </table>
          </div>
          <div class="card-foot"><span class="subtle small grow">{{ rows().length }} finding{{ rows().length === 1 ? '' : 's' }}</span></div>
        }
      </section>
    }

    <!-- detail drawer -->
    <vc-modal [(open)]="detailOpen" [drawer]="true" width="520px" [title]="current() ? ruleTitle(current()!.rule_code) : ''" [subtitle]="current()?.rule_code ?? ''">
      @if (current(); as f) {
        <div class="stack">
          <div class="row wrap">
            <span [class]="'sevpill s-' + f.severity"><vc-icon [name]="meta[f.severity].icon" [size]="13" />{{ sevOne(f.severity) }}</span>
            <vc-badge [status]="f.status" />
            @if (f.blocks_calculation) { <span class="blk small"><vc-icon name="lock" [size]="12" />Blocks calculation</span> }
          </div>
          <p class="big-msg">{{ f.message }}</p>
          <dl class="kv">
            <dt>Record</dt><dd><a [routerLink]="entityRoute(f)" [queryParams]="entityParams(f)">{{ entityLabel(f.entity_type) }} <span class="mono small">{{ f.entity_id.slice(0, 8) }}</span></a></dd>
            <dt>Found</dt><dd>{{ f.created_at | day: true }}</dd>
            @for (d of detailRows(f); track d.k) { <dt>{{ d.k | human }}</dt><dd class="num">{{ d.v }}</dd> }
            @if (f.resolution_note) { <dt>{{ f.status === 'resolved' ? 'Resolution' : 'Note' }}</dt><dd>\u201C{{ f.resolution_note }}\u201D@if (f.resolved_by) { <div class="subtle small">{{ f.resolved_by }} \xB7 {{ f.resolved_at | day: true }}</div> }</dd> }
          </dl>
          @if (f.severity === 'blocking' && f.status !== 'resolved') {
            <vc-callout tone="danger" icon="ban">
              <strong>Blocking findings can't be resolved by hand.</strong> Fix the data it points to and run the checks again \u2014 it resolves itself once the check passes.
              Acknowledging it records that you've seen it, but it keeps blocking the calculation.
            </vc-callout>
          }
        </div>
      }
      @if (current() && canResolve() && current()!.status !== 'resolved') {
        <div footer class="ft">
          @if (current()!.status === 'open') { <button class="btn btn-secondary" (click)="ask('acknowledge', current()!)">Acknowledge</button> }
          @if (current()!.severity !== 'blocking') { <button class="btn btn-primary" (click)="ask('resolve', current()!)"><vc-icon name="check" />Resolve</button> }
        </div>
      }
    </vc-modal>

    <!-- resolve / acknowledge -->
    <vc-modal [(open)]="actOpen" [title]="act() === 'resolve' ? 'Resolve finding' : 'Acknowledge finding'" width="520px"
      [subtitle]="target()?.message ?? ''">
      @if (act() === 'resolve') {
        <p class="muted">Explain why this is acceptable or what was done. The note is kept in the audit trail and shown to verifiers.</p>
      } @else {
        <p class="muted">Acknowledging records that someone has reviewed the finding. @if (target()?.severity === 'blocking') { <strong>It stays blocking</strong> until the data is fixed and the checks pass. } @else { It stays visible until it is resolved. }</p>
      }
      <div class="field mt">
        <label for="q-note">Note <span class="req">*</span></label>
        <textarea id="q-note" class="input" rows="3" [ngModel]="note()" (ngModelChange)="note.set($event)"
          [placeholder]="act() === 'resolve' ? 'e.g. GPS accuracy was 6 m under tree canopy; position confirmed against the site photo' : 'e.g. Re-sampling scheduled with the field team for next week'"></textarea>
        <span class="hint">At least 5 characters.</span>
      </div>
      @if (actError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ actError() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="actOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="note().trim().length < 5 || busy()" (click)="doAct()">{{ busy() ? 'Saving\u2026' : act() === 'resolve' ? 'Resolve' : 'Acknowledge' }}</button>
      </div>
    </vc-modal>
  `, styles: ['/* angular:styles/component:scss;0f66a2f281616853;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\quality\\quality.page.ts */\n.spin {\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.gate {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n  padding: 14px 18px;\n  border-radius: var(--radius);\n  margin-bottom: 16px;\n  background: var(--danger-soft);\n  border: 1px solid #f3c7c3;\n  color: var(--red-600);\n}\n.gate.ok {\n  background: var(--ok-soft);\n  border-color: #cfe2d4;\n  color: var(--forest-600);\n}\n.g-t {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.g-t strong {\n  color: var(--stone-900);\n}\n.g-t span {\n  color: var(--stone-700);\n  font-size: 13px;\n}\n.g-last {\n  color: var(--text-3);\n  white-space: nowrap;\n}\n.tiles {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n@media (max-width: 900px) {\n  .tiles {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.tile {\n  position: relative;\n  text-align: left;\n  padding: 14px 16px;\n  border-radius: var(--radius);\n  border: 1px solid var(--border);\n  background: var(--surface);\n  box-shadow: var(--shadow-sm);\n  cursor: pointer;\n  font: inherit;\n  overflow: hidden;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.tile::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 3px;\n  background: var(--c);\n}\n.tile:hover {\n  border-color: var(--stone-300);\n}\n.tile.on {\n  border-color: var(--c);\n  box-shadow: 0 0 0 1px var(--c) inset;\n}\n.t-top {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.t-ic {\n  display: grid;\n  place-items: center;\n  width: 26px;\n  height: 26px;\n  border-radius: 7px;\n  background: var(--cs);\n  color: var(--c);\n}\n.t-l {\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--stone-700);\n}\n.t-v {\n  font-size: 28px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 8px;\n  color: var(--stone-900);\n}\n.t-h {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.s-blocking {\n  --c:var(--red-600);\n  --cs:var(--red-100);\n}\n.s-error {\n  --c:var(--clay-600);\n  --cs:var(--clay-100);\n}\n.s-warning {\n  --c:var(--amber-600);\n  --cs:var(--amber-100);\n}\n.s-info {\n  --c:var(--sky-600);\n  --cs:var(--sky-100);\n}\n.filters {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.search {\n  position: relative;\n  flex: 0 1 280px;\n  min-width: 200px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.filters select {\n  width: 200px;\n}\n.filters select.sm {\n  width: 160px;\n}\n.seg {\n  display: inline-flex;\n  padding: 3px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  gap: 2px;\n}\n.seg button {\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: 500 12.5px var(--font);\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--surface);\n  color: var(--stone-900);\n  box-shadow: var(--shadow-sm);\n}\n.sev-col {\n  width: 6px;\n  padding: 0 0 0 10px !important;\n}\n.bar {\n  display: block;\n  width: 4px;\n  height: 30px;\n  border-radius: 2px;\n  background: var(--c);\n}\n.grp td {\n  background: var(--surface-2);\n  padding: 8px 14px;\n  border-bottom: 1px solid var(--border);\n}\n.gl {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--c);\n  margin-right: 8px;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.rt {\n  font-weight: 500;\n  white-space: nowrap;\n}\n.rc {\n  font-size: 11px;\n  color: var(--text-3);\n}\n.msg {\n  max-width: 460px;\n  color: var(--stone-800);\n}\n.ent {\n  font-size: 12.5px;\n}\n.ent .mono {\n  color: var(--text-3);\n}\n.still {\n  color: var(--red-600);\n  margin-top: 3px;\n}\n.grow {\n  margin-right: auto;\n}\n.sevpill {\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n  height: 24px;\n  padding: 0 9px;\n  border-radius: 999px;\n  background: var(--cs);\n  color: var(--c);\n  font-size: 12px;\n  font-weight: 600;\n}\n.blk {\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  color: var(--red-600);\n}\n.big-msg {\n  font-size: 15px;\n  line-height: 1.5;\n  color: var(--stone-900);\n}\n.req {\n  color: var(--danger);\n}\n.mt {\n  margin-top: 12px;\n}\n.ft {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=quality.page.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(QualityPage, { className: "QualityPage", filePath: "src/app/features/quality/quality.page.ts", lineNumber: 266 });
})();

// src/app/features/quality/quality.routes.ts
var quality_routes_default = [{ path: "", component: QualityPage, title: "Quality checks \xB7 Varsapradaya Carbon" }];
export {
  quality_routes_default as default
};
//# debugId=891bc39a-71e3-5d8c-9993-fb87a03a86b3
//# sourceMappingURL=chunk-M2Q5DI64.js.map
