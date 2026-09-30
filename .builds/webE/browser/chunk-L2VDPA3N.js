import {
  Remote,
  addDays,
  isoDate
} from "./chunk-ZC6I5JPU.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RadioControlValueAccessor,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  HumanPipe
} from "./chunk-E5UDMWWN.js";
import {
  ActivatedRoute,
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
  PageHeader,
  Timeline
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  effect,
  inject,
  map,
  of,
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
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/grievances/grievances.page.ts
var _c0 = () => ["high", "normal", "low"];
var _c1 = () => [];
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.to;
function GrievancesPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 50);
    \u0275\u0275listener("click", function GrievancesPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 51);
    \u0275\u0275text(2, "New case");
    \u0275\u0275elementEnd();
  }
}
function GrievancesPage_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 12);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r3 = ctx.$implicit;
    \u0275\u0275property("value", s_r3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, s_r3));
  }
}
function GrievancesPage_For_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    \u0275\u0275property("value", c_r4.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r4.label);
  }
}
function GrievancesPage_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 19);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function GrievancesPage_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "vc-error", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.list.error().message);
  }
}
function GrievancesPage_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r1.filtered() ? "No cases match these filters" : "No grievances recorded")("text", ctx_r1.filtered() ? "Try clearing a filter." : "When a farmer raises a concern, record it here so it is answered on time and in writing.");
  }
}
function GrievancesPage_Conditional_50_For_20_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 62)(1, "span", 66);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.initials(g_r6.assigned_to));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.userName(g_r6.assigned_to));
  }
}
function GrievancesPage_Conditional_50_For_20_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 63);
    \u0275\u0275text(1, "Unassigned");
    \u0275\u0275elementEnd();
  }
}
function GrievancesPage_Conditional_50_For_20_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 65);
    \u0275\u0275element(1, "vc-icon", 67);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Overdue \xB7 ", \u0275\u0275pipeBind1(3, 2, g_r6.due_on));
  }
}
function GrievancesPage_Conditional_50_For_20_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 63);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, g_r6.due_on));
  }
}
function GrievancesPage_Conditional_50_For_20_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "day");
    \u0275\u0275elementStart(2, "span", 59);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(1, 2, g_r6.due_on), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.dueIn(g_r6.due_on));
  }
}
function GrievancesPage_Conditional_50_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 55);
    \u0275\u0275listener("click", function GrievancesPage_Conditional_50_For_20_Template_tr_click_0_listener() {
      const g_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openDetail(g_r6));
    });
    \u0275\u0275elementStart(1, "td", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "div", 57)(5, "strong", 58);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 59);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td")(12, "span", 60);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275element(16, "vc-badge", 61);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275conditionalCreate(18, GrievancesPage_Conditional_50_For_20_Conditional_18_Template, 4, 2, "span", 62)(19, GrievancesPage_Conditional_50_For_20_Conditional_19_Template, 2, 0, "span", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 64);
    \u0275\u0275conditionalCreate(21, GrievancesPage_Conditional_50_For_20_Conditional_21_Template, 4, 4, "span", 65)(22, GrievancesPage_Conditional_50_For_20_Conditional_22_Template, 3, 3, "span", 63)(23, GrievancesPage_Conditional_50_For_20_Conditional_23_Template, 4, 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const g_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("od", g_r6.overdue);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(g_r6.code);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(g_r6.subject);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.farmerName(g_r6.farmer_id), " \xB7 ", ctx_r1.channelLabel(g_r6.channel));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.catLabel(g_r6.category));
    \u0275\u0275advance(2);
    \u0275\u0275classMap("p-" + g_r6.priority);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 13, g_r6.priority));
    \u0275\u0275advance(3);
    \u0275\u0275property("status", g_r6.status);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(g_r6.assigned_to ? 18 : 19);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(g_r6.overdue ? 21 : g_r6.status === "resolved" || g_r6.status === "closed" ? 22 : 23);
  }
}
function GrievancesPage_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "table", 53)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Case");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Subject");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Priority");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Assigned");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Due");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, GrievancesPage_Conditional_50_For_20_Template, 24, 15, "tr", 54, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r1.rows());
  }
}
function GrievancesPage_Conditional_52_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 65);
    \u0275\u0275element(1, "vc-icon", 67);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Overdue since ", \u0275\u0275pipeBind1(3, 2, g_r7.due_on));
  }
}
function GrievancesPage_Conditional_52_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 69);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Due ", \u0275\u0275pipeBind1(2, 1, g_r7.due_on));
  }
}
function GrievancesPage_Conditional_52_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 71)(1, "strong");
    \u0275\u0275text(2, "Resolution");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 59);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 75);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const g_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 2, g_r7.resolved_at, true));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(g_r7.resolution);
  }
}
function GrievancesPage_Conditional_52_Conditional_15_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r9 = ctx.$implicit;
    \u0275\u0275property("value", u_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", u_r9.full_name, " \xB7 ", u_r9.role_label);
  }
}
function GrievancesPage_Conditional_52_Conditional_15_Conditional_12_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34)(1, "label", 86);
    \u0275\u0275text(2, "Resolution");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 87);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function GrievancesPage_Conditional_52_Conditional_15_Conditional_12_Conditional_5_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(4);
      \u0275\u0275twoWayBindingSet(ctx_r1.resolution, $event) || (ctx_r1.resolution = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 88);
    \u0275\u0275text(5, "Required to resolve. The farmer sees this.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.resolution);
    \u0275\u0275control();
  }
}
function GrievancesPage_Conditional_52_Conditional_15_Conditional_12_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 83);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("message", ctx_r1.actionError());
  }
}
function GrievancesPage_Conditional_52_Conditional_15_Conditional_12_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 89);
    \u0275\u0275listener("click", function GrievancesPage_Conditional_52_Conditional_15_Conditional_12_For_9_Template_button_click_0_listener() {
      const t_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const g_r7 = \u0275\u0275nextContext(3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(t_r13.to === "closed" ? ctx_r1.closeConfirm.set(true) : ctx_r1.move(g_r7, t_r13.to));
    });
    \u0275\u0275element(1, "vc-icon", 90);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classMap("btn-" + t_r13.kind);
    \u0275\u0275property("disabled", ctx_r1.busy() || t_r13.to === "resolved" && !ctx_r1.resolution.trim() || t_r13.to === "appealed" && !ctx_r1.note.trim());
    \u0275\u0275advance();
    \u0275\u0275property("name", t_r13.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r13.label);
  }
}
function GrievancesPage_Conditional_52_Conditional_15_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "hr", 80);
    \u0275\u0275elementStart(1, "div", 34)(2, "label", 81);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 82);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function GrievancesPage_Conditional_52_Conditional_15_Conditional_12_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.note, $event) || (ctx_r1.note = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, GrievancesPage_Conditional_52_Conditional_15_Conditional_12_Conditional_5_Template, 6, 1, "div", 34);
    \u0275\u0275conditionalCreate(6, GrievancesPage_Conditional_52_Conditional_15_Conditional_12_Conditional_6_Template, 1, 1, "vc-error", 83);
    \u0275\u0275elementStart(7, "div", 84);
    \u0275\u0275repeaterCreate(8, GrievancesPage_Conditional_52_Conditional_15_Conditional_12_For_9_Template, 3, 5, "button", 85, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r7 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Note ", ctx_r1.needsNote(g_r7) ? "" : "(optional)");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.note);
    \u0275\u0275property("placeholder", g_r7.status === "resolved" ? "Required for an appeal: why is the farmer appealing?" : "Added to the case history");
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(g_r7.status === "in_progress" ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.actionError() ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.transitions(g_r7));
  }
}
function GrievancesPage_Conditional_52_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 72)(1, "div", 34)(2, "label", 76);
    \u0275\u0275text(3, "Assigned to");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 77)(5, "select", 78);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function GrievancesPage_Conditional_52_Conditional_15_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.assignee, $event) || (ctx_r1.assignee = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(6, "option", 11);
    \u0275\u0275text(7, "Choose a person\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(8, GrievancesPage_Conditional_52_Conditional_15_For_9_Template, 2, 3, "option", 12, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 79);
    \u0275\u0275listener("click", function GrievancesPage_Conditional_52_Conditional_15_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r8);
      const g_r7 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.assign(g_r7));
    });
    \u0275\u0275text(11, "Assign");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, GrievancesPage_Conditional_52_Conditional_15_Conditional_12_Template, 10, 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r7 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.assignee);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.activeUsers());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r1.assignee || ctx_r1.assignee === g_r7.assigned_to || ctx_r1.busy());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.transitions(g_r7).length ? 12 : -1);
  }
}
function GrievancesPage_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 68);
    \u0275\u0275element(2, "vc-badge", 61);
    \u0275\u0275elementStart(3, "span", 60);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 69);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 69);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, GrievancesPage_Conditional_52_Conditional_10_Template, 4, 4, "span", 65)(11, GrievancesPage_Conditional_52_Conditional_11_Template, 3, 3, "span", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 70);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, GrievancesPage_Conditional_52_Conditional_14_Template, 8, 5, "vc-callout", 71);
    \u0275\u0275conditionalCreate(15, GrievancesPage_Conditional_52_Conditional_15_Template, 13, 3, "section", 72);
    \u0275\u0275elementStart(16, "section")(17, "h3", 73);
    \u0275\u0275text(18, "History");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "vc-timeline", 74);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const g_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("status", g_r7.status);
    \u0275\u0275advance();
    \u0275\u0275classMap("p-" + g_r7.priority);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(5, 11, g_r7.priority), " priority");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.catLabel(g_r7.category));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.channelLabel(g_r7.channel));
    \u0275\u0275advance();
    \u0275\u0275conditional(g_r7.overdue ? 10 : 11);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(g_r7.description);
    \u0275\u0275advance();
    \u0275\u0275conditional(g_r7.resolution ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canHandle() && g_r7.status !== "closed" ? 15 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("items", ctx_r1.timeline(g_r7));
  }
}
function GrievancesPage_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "span", 66);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 59);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(8, "span", 91);
    \u0275\u0275elementStart(9, "button", 92);
    \u0275\u0275listener("click", function GrievancesPage_Conditional_66_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.pickedFarmer.set(null));
    });
    \u0275\u0275text(10, "Change");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r15 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r15.full_name.slice(0, 1));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r15.full_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", f_r15.code, " \xB7 ", f_r15.village, ", ", f_r15.district);
  }
}
function GrievancesPage_Conditional_67_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 96);
    \u0275\u0275listener("click", function GrievancesPage_Conditional_67_Conditional_1_For_2_Template_li_click_0_listener() {
      const f_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.pickedFarmer.set(f_r18));
    });
    \u0275\u0275elementStart(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 59);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r18 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r18.full_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", f_r18.code, " \xB7 ", f_r18.village);
  }
}
function GrievancesPage_Conditional_67_Conditional_1_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 95);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.farmerHits.loading() ? "Searching\u2026" : "No farmer found.");
  }
}
function GrievancesPage_Conditional_67_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 94);
    \u0275\u0275repeaterCreate(1, GrievancesPage_Conditional_67_Conditional_1_For_2_Template, 5, 3, "li", null, _forTrack1, false, GrievancesPage_Conditional_67_Conditional_1_ForEmpty_3_Template, 2, 1, "li", 95);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.farmerHits.data() ?? \u0275\u0275pureFunction0(1, _c1));
  }
}
function GrievancesPage_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 93);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function GrievancesPage_Conditional_67_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.farmerQ.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, GrievancesPage_Conditional_67_Conditional_1_Template, 4, 2, "ul", 94);
    \u0275\u0275elementStart(2, "span", 88);
    \u0275\u0275text(3, "Leave empty for a concern that isn't about one farmer.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngModel", ctx_r1.farmerQ());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.farmerQ().trim().length >= 2 ? 1 : -1);
  }
}
function GrievancesPage_For_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r19 = ctx.$implicit;
    \u0275\u0275property("value", c_r19.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r19.label);
  }
}
function GrievancesPage_For_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r20 = ctx.$implicit;
    \u0275\u0275property("value", c_r20.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r20.label);
  }
}
function GrievancesPage_For_93_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 97)(1, "input", 98);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function GrievancesPage_For_93_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.nf.priority, $event) || (ctx_r1.nf.priority = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r22 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.nf.priority === p_r22);
    \u0275\u0275advance();
    \u0275\u0275property("value", p_r22);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.nf.priority);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 6, p_r22));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Answer within ", ctx_r1.dueDays[p_r22], " days");
  }
}
function GrievancesPage_Conditional_100_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275element(1, "vc-error", 99);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
var CATEGORIES = [
  { key: "payment", label: "Payment" },
  { key: "enrolment", label: "Enrolment" },
  { key: "sampling", label: "Sampling" },
  { key: "data", label: "Data & records" },
  { key: "other", label: "Other" }
];
var CHANNELS = [
  { key: "app", label: "Farmer app" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "ivr", label: "IVR call line" },
  { key: "phone", label: "Phone call" },
  { key: "paper", label: "Paper form" },
  { key: "field_officer", label: "Field officer" },
  { key: "email", label: "Email" }
];
var DUE_DAYS = { high: 3, normal: 7, low: 14 };
var FLOW = {
  open: [{ to: "in_progress", label: "Start working on it", icon: "play", kind: "primary" }],
  in_progress: [{ to: "resolved", label: "Resolve", icon: "check-circle", kind: "primary" }],
  resolved: [{ to: "closed", label: "Close case", icon: "lock", kind: "secondary" }, { to: "appealed", label: "Record an appeal", icon: "undo", kind: "secondary" }],
  appealed: [{ to: "in_progress", label: "Reopen for review", icon: "play", kind: "primary" }],
  closed: []
};
var GrievancesPage = class _GrievancesPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  route = inject(ActivatedRoute);
  list = new Remote();
  users = new Remote();
  farmers = new Remote();
  farmerHits = new Remote();
  status = signal(
    this.route.snapshot.queryParamMap.get("status") ?? "",
    ...ngDevMode ? [{ debugName: "status" }] : (
      /* istanbul ignore next */
      []
    )
  );
  category = signal(
    "",
    ...ngDevMode ? [{ debugName: "category" }] : (
      /* istanbul ignore next */
      []
    )
  );
  priority = signal(
    "",
    ...ngDevMode ? [{ debugName: "priority" }] : (
      /* istanbul ignore next */
      []
    )
  );
  overdueOnly = signal(
    false,
    ...ngDevMode ? [{ debugName: "overdueOnly" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mine = signal(
    false,
    ...ngDevMode ? [{ debugName: "mine" }] : (
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
  statuses = ["open", "in_progress", "resolved", "appealed", "closed"];
  categories = CATEGORIES;
  channels = CHANNELS;
  dueDays = DUE_DAYS;
  canHandle = computed(
    () => this.auth.can("grievance.handle"),
    ...ngDevMode ? [{ debugName: "canHandle" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canCreate = computed(
    () => this.auth.can("grievance.handle", "risk.manage"),
    ...ngDevMode ? [{ debugName: "canCreate" }] : (
      /* istanbul ignore next */
      []
    )
  );
  userMap = computed(
    () => new Map((this.users.data() ?? []).map((u) => [u.id, u])),
    ...ngDevMode ? [{ debugName: "userMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  farmerMap = computed(
    () => new Map((this.farmers.data() ?? []).map((f) => [f.id, f])),
    ...ngDevMode ? [{ debugName: "farmerMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  activeUsers = computed(
    () => (this.users.data() ?? []).filter((u) => u.is_active),
    ...ngDevMode ? [{ debugName: "activeUsers" }] : (
      /* istanbul ignore next */
      []
    )
  );
  all = computed(
    () => this.list.data() ?? [],
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  filtered = computed(
    () => !!(this.status() || this.category() || this.priority() || this.overdueOnly() || this.mine() || this.q().trim()),
    ...ngDevMode ? [{ debugName: "filtered" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => {
      const q = this.q().trim().toLowerCase();
      const me = this.auth.profile()?.id;
      return this.all().filter((g) => (!this.overdueOnly() || g.overdue) && (!this.mine() || g.assigned_to === me) && (!q || g.code.toLowerCase().includes(q) || g.subject.toLowerCase().includes(q) || this.farmerName(g.farmer_id).toLowerCase().includes(q)));
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  openCount = computed(
    () => this.all().filter((g) => g.status !== "closed" && g.status !== "resolved").length,
    ...ngDevMode ? [{ debugName: "openCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  overdueCount = computed(
    () => this.all().filter((g) => g.overdue).length,
    ...ngDevMode ? [{ debugName: "overdueCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mineCount = computed(
    () => this.all().filter((g) => g.assigned_to === this.auth.profile()?.id && g.status !== "closed").length,
    ...ngDevMode ? [{ debugName: "mineCount" }] : (
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
  closeConfirm = signal(
    false,
    ...ngDevMode ? [{ debugName: "closeConfirm" }] : (
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
  sel = signal(
    null,
    ...ngDevMode ? [{ debugName: "sel" }] : (
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
  actionError = signal(
    null,
    ...ngDevMode ? [{ debugName: "actionError" }] : (
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
  assignee = "";
  note = "";
  resolution = "";
  farmerQ = signal(
    "",
    ...ngDevMode ? [{ debugName: "farmerQ" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pickedFarmer = signal(
    null,
    ...ngDevMode ? [{ debugName: "pickedFarmer" }] : (
      /* istanbul ignore next */
      []
    )
  );
  nf = this.blank();
  dueDate = () => addDays(isoDate(/* @__PURE__ */ new Date()), DUE_DAYS[this.nf.priority] ?? 7);
  searchTimer;
  constructor() {
    this.users.load(this.api.get("/users").pipe(catchError(() => of([]))));
    this.farmers.load(this.api.get("/farmers", { limit: 500 }).pipe(map((r) => r.items), catchError(() => of([]))));
    effect(() => {
      const params = { status: this.status(), category: this.category(), priority: this.priority() };
      untracked(() => this.list.load(this.api.get("/grievances", params), true));
    });
    effect(() => {
      const q = this.farmerQ().trim();
      untracked(() => {
        clearTimeout(this.searchTimer);
        if (q.length < 2)
          return;
        this.searchTimer = setTimeout(() => this.farmerHits.load(this.api.get("/farmers", { q, limit: 8 }).pipe(map((r) => r.items))), 220);
      });
    });
  }
  reload() {
    this.list.load(this.api.get("/grievances", { status: this.status(), category: this.category(), priority: this.priority() }), true);
  }
  countBy(s) {
    return this.all().filter((g) => g.status === s).length;
  }
  userName(id) {
    return id === this.auth.profile()?.id ? "You" : this.userMap().get(id)?.full_name ?? "Team member";
  }
  initials(id) {
    return (this.userMap().get(id)?.full_name ?? "?").split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }
  farmerName(id) {
    return id ? this.farmerMap().get(id)?.full_name ?? "Farmer" : "No farmer linked";
  }
  catLabel(k) {
    return CATEGORIES.find((c) => c.key === k)?.label ?? k;
  }
  channelLabel(k) {
    return CHANNELS.find((c) => c.key === k)?.label ?? k;
  }
  transitions(g) {
    return FLOW[g.status] ?? [];
  }
  needsNote(g) {
    return g.status === "resolved";
  }
  dueIn(d) {
    const days = Math.round(((/* @__PURE__ */ new Date(d + "T00:00:00")).getTime() - (/* @__PURE__ */ new Date(isoDate(/* @__PURE__ */ new Date()) + "T00:00:00")).getTime()) / 864e5);
    return days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;
  }
  timeline(g) {
    return [...g.history ?? []].reverse().map((h) => ({
      title: h.assigned_to ? `Assigned to ${this.userName(h.assigned_to)}` : this.statusTitle(h.status),
      at: new Date(h.at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      by: h.by_name,
      note: h.note || null,
      tone: h.status === "appealed" ? "warn" : h.status === "closed" ? "neutral" : h.status === "open" ? "neutral" : "ok"
    }));
  }
  statusTitle(s) {
    return { open: "Case opened", in_progress: "Work started", resolved: "Resolved", appealed: "Appealed by farmer", closed: "Closed" }[s] ?? s;
  }
  openDetail(g) {
    this.sel.set(g);
    this.assignee = g.assigned_to ?? "";
    this.note = "";
    this.resolution = "";
    this.actionError.set(null);
    this.detailOpen.set(true);
  }
  adopt(g, msg) {
    this.busy.set(false);
    this.sel.set(g);
    this.note = "";
    this.resolution = "";
    this.toast.success(msg, `${g.code} \xB7 ${g.subject}`);
    this.reload();
  }
  assign(g) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post(`/grievances/${g.id}/assign`, { user_id: this.assignee, note: this.note.trim() }).subscribe({
      next: (r) => this.adopt(r, `Assigned to ${this.userName(this.assignee)}`),
      error: (e) => {
        this.busy.set(false);
        this.actionError.set(e.message);
      }
    });
  }
  move(g, to) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post(`/grievances/${g.id}/status`, {
      status: to,
      note: this.note.trim(),
      resolution: to === "resolved" ? this.resolution.trim() : null
    }).subscribe({
      next: (r) => this.adopt(r, this.statusTitle(to)),
      error: (e) => {
        this.busy.set(false);
        this.actionError.set(e.message);
      }
    });
  }
  blank() {
    return { category: "payment", channel: "phone", subject: "", description: "", priority: "normal" };
  }
  openCreate() {
    this.nf = this.blank();
    this.pickedFarmer.set(null);
    this.farmerQ.set("");
    this.formError.set(null);
    this.createOpen.set(true);
  }
  create() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post("/grievances", __spreadProps(__spreadValues({}, this.nf), {
      subject: this.nf.subject.trim(),
      description: this.nf.description.trim(),
      farmer_id: this.pickedFarmer()?.id ?? null
    })).subscribe({
      next: (g) => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.toast.success(`Case ${g.code} created`, `Response due by ${(/* @__PURE__ */ new Date(g.due_on + "T00:00:00")).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`);
        this.reload();
        this.openDetail(g);
      },
      error: (e) => {
        this.busy.set(false);
        this.formError.set(e.message);
      }
    });
  }
  static \u0275fac = function GrievancesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GrievancesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GrievancesPage, selectors: [["vc-grievances-page"]], decls: 106, vars: 40, consts: [["title", "Grievances", "eyebrow", "Care", "subtitle", "Every concern a farmer raises \u2014 by app, WhatsApp, phone or in person \u2014 tracked to a written resolution within the promised time."], ["actions", "", 1, "btn", "btn-primary"], [1, "stats"], ["type", "button", 1, "st", 3, "click"], [1, "num"], ["type", "button", 1, "st", "danger", 3, "click"], [1, "filters"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search by case number, subject or farmer\u2026", 1, "input", 3, "ngModelChange", "ngModel"], ["aria-label", "Status", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["aria-label", "Category", 1, "input", 3, "ngModelChange", "ngModel"], ["aria-label", "Priority", 1, "input", 3, "ngModelChange", "ngModel"], ["value", "high"], ["value", "normal"], ["value", "low"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "message", 3, "title", "text"], [1, "table-wrap"], ["width", "560px", 3, "openChange", "open", "drawer", "title", "subtitle"], [1, "stack", 2, "--gap", "20px"], ["title", "Close this case?", "width", "440px", 3, "openChange", "open"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["title", "New grievance", "subtitle", "Record the farmer's concern in their words", "width", "600px", 3, "openChange", "open"], ["id", "gForm", 1, "form-grid", 3, "ngSubmit"], [1, "field", "span-2"], ["for", "fq"], [1, "picked"], [1, "field"], ["for", "gc"], ["id", "gc", "name", "gc", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "gch"], ["id", "gch", "name", "gch", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "gs"], ["id", "gs", "name", "gs", "placeholder", "e.g. Second payout instalment not received", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "gd"], ["id", "gd", "name", "gd", "rows", "4", "placeholder", "What the farmer said, dates, amounts, who they spoke to.", 1, "input", 3, "ngModelChange", "ngModel"], [1, "prio"], [1, "popt", 3, "on"], [1, "span-2", "due"], ["name", "calendar", 3, "size"], [1, "span-2"], ["type", "button", 1, "btn", "btn-ghost", 3, "click"], ["type", "submit", "form", "gForm", 1, "btn", "btn-primary", 3, "disabled"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["title", "Couldn't load grievances", 3, "message"], [1, "table"], [1, "clickable", 3, "od"], [1, "clickable", 3, "click"], [1, "mono", "small", "nowrap"], [1, "sj"], [1, "truncate"], [1, "small", "subtle"], [1, "pri"], [3, "status"], [1, "as"], [1, "subtle"], [1, "nowrap"], [1, "ovd"], [1, "av"], ["name", "clock", 3, "size"], [1, "chips"], [1, "chip"], [1, "desc"], ["tone", "ok", "icon", "check-circle"], [1, "act", "card", "card-pad"], [1, "hh"], [3, "items"], [2, "margin-top", "4px"], ["for", "as"], [1, "row", 2, "--gap", "8px"], ["id", "as", 1, "input", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-secondary", 3, "click", "disabled"], [2, "margin", "4px 0"], ["for", "nt"], ["id", "nt", 1, "input", 3, "ngModelChange", "ngModel", "placeholder"], ["title", "Not changed", 3, "message"], [1, "row", "wrap", 2, "--gap", "8px", "justify-content", "flex-end"], [1, "btn", 3, "class", "disabled"], ["for", "rs"], ["id", "rs", "rows", "3", "placeholder", "Explain what was done, in words the farmer will understand.", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], [1, "btn", 3, "click", "disabled"], [3, "name"], [1, "spacer"], ["type", "button", 1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["id", "fq", "name", "fq", "placeholder", "Search by name, code or phone\u2026", "autocomplete", "off", 1, "input", 3, "ngModelChange", "ngModel"], [1, "fres"], [1, "muted", "small"], [3, "click"], [1, "popt"], ["type", "radio", "name", "gp", 3, "ngModelChange", "value", "ngModel"], ["title", "Not saved", 3, "message"]], template: function GrievancesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, GrievancesPage_Conditional_1_Template, 3, 0, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "div", 2)(3, "button", 3);
      \u0275\u0275listener("click", function GrievancesPage_Template_button_click_3_listener() {
        ctx.status.set("");
        return ctx.overdueOnly.set(false);
      });
      \u0275\u0275elementStart(4, "span");
      \u0275\u0275text(5, "All open work");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "strong", 4);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "button", 5);
      \u0275\u0275listener("click", function GrievancesPage_Template_button_click_8_listener() {
        return ctx.overdueOnly.set(!ctx.overdueOnly());
      });
      \u0275\u0275elementStart(9, "span");
      \u0275\u0275text(10, "Overdue");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "strong", 4);
      \u0275\u0275text(12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "button", 3);
      \u0275\u0275listener("click", function GrievancesPage_Template_button_click_13_listener() {
        return ctx.mine.set(!ctx.mine());
      });
      \u0275\u0275elementStart(14, "span");
      \u0275\u0275text(15, "Assigned to me");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "strong", 4);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "button", 3);
      \u0275\u0275listener("click", function GrievancesPage_Template_button_click_18_listener() {
        return ctx.status.set(ctx.status() === "appealed" ? "" : "appealed");
      });
      \u0275\u0275elementStart(19, "span");
      \u0275\u0275text(20, "Appealed");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "strong", 4);
      \u0275\u0275text(22);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(23, "div", 6)(24, "div", 7);
      \u0275\u0275element(25, "vc-icon", 8);
      \u0275\u0275elementStart(26, "input", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function GrievancesPage_Template_input_ngModelChange_26_listener($event) {
        return ctx.q.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function GrievancesPage_Template_select_ngModelChange_27_listener($event) {
        return ctx.status.set($event);
      });
      \u0275\u0275elementStart(28, "option", 11);
      \u0275\u0275text(29, "Any status");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(30, GrievancesPage_For_31_Template, 3, 4, "option", 12, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "select", 13);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function GrievancesPage_Template_select_ngModelChange_32_listener($event) {
        return ctx.category.set($event);
      });
      \u0275\u0275elementStart(33, "option", 11);
      \u0275\u0275text(34, "Any category");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(35, GrievancesPage_For_36_Template, 2, 2, "option", 12, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "select", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function GrievancesPage_Template_select_ngModelChange_37_listener($event) {
        return ctx.priority.set($event);
      });
      \u0275\u0275elementStart(38, "option", 11);
      \u0275\u0275text(39, "Any priority");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "option", 15);
      \u0275\u0275text(41, "High");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "option", 16);
      \u0275\u0275text(43, "Normal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "option", 17);
      \u0275\u0275text(45, "Low");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(46, "section", 18);
      \u0275\u0275conditionalCreate(47, GrievancesPage_Conditional_47_Template, 1, 1, "vc-loading", 19)(48, GrievancesPage_Conditional_48_Template, 2, 1, "div", 20)(49, GrievancesPage_Conditional_49_Template, 1, 2, "vc-empty", 21)(50, GrievancesPage_Conditional_50_Template, 21, 0, "div", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "vc-modal", 23);
      \u0275\u0275twoWayListener("openChange", function GrievancesPage_Template_vc_modal_openChange_51_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.detailOpen, $event) || (ctx.detailOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(52, GrievancesPage_Conditional_52_Template, 20, 13, "div", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "vc-modal", 25);
      \u0275\u0275twoWayListener("openChange", function GrievancesPage_Template_vc_modal_openChange_53_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.closeConfirm, $event) || (ctx.closeConfirm = $event);
        return $event;
      });
      \u0275\u0275elementStart(54, "p");
      \u0275\u0275text(55, "A closed case can't be reopened or reassigned. Close it only when the farmer has accepted the resolution or the appeal period has passed.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(56, 26);
      \u0275\u0275elementStart(57, "button", 27);
      \u0275\u0275listener("click", function GrievancesPage_Template_button_click_57_listener() {
        return ctx.closeConfirm.set(false);
      });
      \u0275\u0275text(58, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "button", 28);
      \u0275\u0275listener("click", function GrievancesPage_Template_button_click_59_listener() {
        ctx.move(ctx.sel(), "closed");
        return ctx.closeConfirm.set(false);
      });
      \u0275\u0275text(60, "Close case");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "vc-modal", 29);
      \u0275\u0275twoWayListener("openChange", function GrievancesPage_Template_vc_modal_openChange_61_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(62, "form", 30);
      \u0275\u0275listener("ngSubmit", function GrievancesPage_Template_form_ngSubmit_62_listener() {
        return ctx.create();
      });
      \u0275\u0275elementStart(63, "div", 31)(64, "label", 32);
      \u0275\u0275text(65, "Farmer");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(66, GrievancesPage_Conditional_66_Template, 11, 5, "div", 33)(67, GrievancesPage_Conditional_67_Template, 4, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "div", 34)(69, "label", 35);
      \u0275\u0275text(70, "Category");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "select", 36);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function GrievancesPage_Template_select_ngModelChange_71_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nf.category, $event) || (ctx.nf.category = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(72, GrievancesPage_For_73_Template, 2, 2, "option", 12, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(74, "div", 34)(75, "label", 37);
      \u0275\u0275text(76, "Received by");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(77, "select", 38);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function GrievancesPage_Template_select_ngModelChange_77_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nf.channel, $event) || (ctx.nf.channel = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(78, GrievancesPage_For_79_Template, 2, 2, "option", 12, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(80, "div", 31)(81, "label", 39);
      \u0275\u0275text(82, "Subject");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(83, "input", 40);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function GrievancesPage_Template_input_ngModelChange_83_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nf.subject, $event) || (ctx.nf.subject = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(84, "div", 31)(85, "label", 41);
      \u0275\u0275text(86, "Description");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "textarea", 42);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function GrievancesPage_Template_textarea_ngModelChange_87_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.nf.description, $event) || (ctx.nf.description = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(88, "div", 31)(89, "label");
      \u0275\u0275text(90, "Priority");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "div", 43);
      \u0275\u0275repeaterCreate(92, GrievancesPage_For_93_Template, 7, 8, "label", 44, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(94, "div", 45);
      \u0275\u0275element(95, "vc-icon", 46);
      \u0275\u0275text(96, "Response due by ");
      \u0275\u0275elementStart(97, "strong");
      \u0275\u0275text(98);
      \u0275\u0275pipe(99, "day");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(100, GrievancesPage_Conditional_100_Template, 2, 1, "div", 47);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(101, 26);
      \u0275\u0275elementStart(102, "button", 48);
      \u0275\u0275listener("click", function GrievancesPage_Template_button_click_102_listener() {
        return ctx.createOpen.set(false);
      });
      \u0275\u0275text(103, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(104, "button", 49);
      \u0275\u0275text(105);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_25_0;
      let tmp_29_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.canCreate() ? 1 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("on", !ctx.status() && !ctx.overdueOnly());
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.openCount());
      \u0275\u0275advance();
      \u0275\u0275classProp("on", ctx.overdueOnly());
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.overdueCount());
      \u0275\u0275advance();
      \u0275\u0275classProp("on", ctx.mine());
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.mineCount());
      \u0275\u0275advance();
      \u0275\u0275classProp("on", ctx.status() === "appealed");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.countBy("appealed"));
      \u0275\u0275advance(3);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.q());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.status());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.statuses);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.category());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.categories);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.priority());
      \u0275\u0275control();
      \u0275\u0275advance(10);
      \u0275\u0275conditional(ctx.list.loading() && !ctx.list.data() ? 47 : ctx.list.error() ? 48 : !ctx.rows().length ? 49 : 50);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.detailOpen);
      \u0275\u0275property("drawer", true)("title", ctx.sel()?.subject ?? "")("subtitle", ctx.sel() ? ctx.sel().code + " \xB7 " + ctx.farmerName(ctx.sel().farmer_id) : "");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_25_0 = ctx.sel()) ? 52 : -1, tmp_25_0);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.closeConfirm);
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275advance(5);
      \u0275\u0275conditional((tmp_29_0 = ctx.pickedFarmer()) ? 66 : 67, tmp_29_0);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.nf.category);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.categories);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.nf.channel);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.channels);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.nf.subject);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.nf.description);
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275repeater(\u0275\u0275pureFunction0(39, _c0));
      \u0275\u0275advance(3);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(99, 37, ctx.dueDate()));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.formError() ? 100 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || ctx.nf.subject.trim().length < 3 || ctx.nf.description.trim().length < 5);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.busy() ? "Saving\u2026" : "Create case");
    }
  }, dependencies: [Icon, Badge, PageHeader, Empty, Loading, ErrorBox, Callout, Modal, Timeline, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, DayPipe, HumanPipe], styles: ["\n.stats[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n@media (max-width: 900px) {\n  .stats[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.st[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  align-items: flex-start;\n  padding: 14px 16px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  box-shadow: var(--%NS%shadow-sm);\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  text-align: left;\n}\n.st[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  font-weight: 500;\n}\n.st[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.st.danger[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.st.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  box-shadow: var(--%NS%focus);\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 420px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 170px;\n}\n.sj[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  max-width: 380px;\n  min-width: 0;\n}\n.pri[_ngcontent-%COMP%] {\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 500;\n  padding: 2px 8px;\n  border-radius: 4px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.pri.p-high[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n  color: var(--%NS%red-600);\n}\n.pri.p-normal[_ngcontent-%COMP%] {\n  background: var(--%NS%sky-100);\n  color: var(--%NS%sky-600);\n}\n.as[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n}\n.av[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n  font-size: 10px;\n  font-weight: 600;\n  flex: none;\n}\n.ovd[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--%NS%red-600);\n  background: var(--%NS%red-100);\n  padding: 2px 8px;\n  border-radius: 999px;\n}\ntr.od[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  box-shadow: inset 3px 0 0 var(--%NS%red-600);\n}\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.chip[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.desc[_ngcontent-%COMP%] {\n  white-space: pre-wrap;\n  padding: 14px 16px;\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  font-size: 13.5px;\n  color: var(--%NS%stone-800);\n}\n.act[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.hh[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n.picked[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 10px;\n  border: 1px solid var(--%NS%forest-200);\n  background: var(--%NS%forest-50);\n  border-radius: 8px;\n}\n.picked[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.picked[_ngcontent-%COMP%]   .av[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  font-size: 12px;\n}\n.fres[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 4px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  max-height: 180px;\n  overflow: auto;\n  background: var(--%NS%surface);\n  box-shadow: var(--%NS%shadow);\n}\n.fres[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  padding: 7px 10px;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.fres[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%forest-50);\n}\n.prio[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n.popt[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.popt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: none;\n}\n.popt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  font-weight: 500;\n}\n.popt[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.popt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: var(--%NS%focus);\n}\n.due[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--%NS%sand-100);\n  font-size: 13.5px;\n  color: var(--%NS%stone-700);\n}\n/*# sourceMappingURL=grievances.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GrievancesPage, [{
    type: Component,
    args: [{ selector: "vc-grievances-page", imports: [...KIT, FormsModule, DayPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Grievances" eyebrow="Care"
      subtitle="Every concern a farmer raises \u2014 by app, WhatsApp, phone or in person \u2014 tracked to a written resolution within the promised time.">
      @if (canCreate()) { <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New case</button> }
    </vc-page-header>

    <div class="stats">
      <button type="button" class="st" [class.on]="!status() && !overdueOnly()" (click)="status.set(''); overdueOnly.set(false)"><span>All open work</span><strong class="num">{{ openCount() }}</strong></button>
      <button type="button" class="st danger" [class.on]="overdueOnly()" (click)="overdueOnly.set(!overdueOnly())"><span>Overdue</span><strong class="num">{{ overdueCount() }}</strong></button>
      <button type="button" class="st" [class.on]="mine()" (click)="mine.set(!mine())"><span>Assigned to me</span><strong class="num">{{ mineCount() }}</strong></button>
      <button type="button" class="st" [class.on]="status() === 'appealed'" (click)="status.set(status() === 'appealed' ? '' : 'appealed')"><span>Appealed</span><strong class="num">{{ countBy('appealed') }}</strong></button>
    </div>

    <div class="filters">
      <div class="search"><vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Search by case number, subject or farmer\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
      <select class="input" [ngModel]="status()" (ngModelChange)="status.set($event)" aria-label="Status">
        <option value="">Any status</option>
        @for (s of statuses; track s) { <option [value]="s">{{ s | human }}</option> }
      </select>
      <select class="input" [ngModel]="category()" (ngModelChange)="category.set($event)" aria-label="Category">
        <option value="">Any category</option>
        @for (c of categories; track c.key) { <option [value]="c.key">{{ c.label }}</option> }
      </select>
      <select class="input" [ngModel]="priority()" (ngModelChange)="priority.set($event)" aria-label="Priority">
        <option value="">Any priority</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option>
      </select>
    </div>

    <section class="card">
      @if (list.loading() && !list.data()) {
        <vc-loading [rows]="6" />
      } @else if (list.error()) {
        <div class="card-body"><vc-error title="Couldn't load grievances" [message]="list.error()!.message" /></div>
      } @else if (!rows().length) {
        <vc-empty icon="message" [title]="filtered() ? 'No cases match these filters' : 'No grievances recorded'"
          [text]="filtered() ? 'Try clearing a filter.' : 'When a farmer raises a concern, record it here so it is answered on time and in writing.'" />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Case</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Due</th></tr></thead>
            <tbody>
              @for (g of rows(); track g.id) {
                <tr class="clickable" (click)="openDetail(g)" [class.od]="g.overdue">
                  <td class="mono small nowrap">{{ g.code }}</td>
                  <td><div class="sj"><strong class="truncate">{{ g.subject }}</strong><span class="small subtle">{{ farmerName(g.farmer_id) }} \xB7 {{ channelLabel(g.channel) }}</span></div></td>
                  <td>{{ catLabel(g.category) }}</td>
                  <td><span class="pri" [class]="'p-' + g.priority">{{ g.priority | human }}</span></td>
                  <td><vc-badge [status]="g.status" /></td>
                  <td>@if (g.assigned_to) { <span class="as"><span class="av">{{ initials(g.assigned_to) }}</span>{{ userName(g.assigned_to) }}</span> } @else { <span class="subtle">Unassigned</span> }</td>
                  <td class="nowrap">
                    @if (g.overdue) { <span class="ovd"><vc-icon name="clock" [size]="12" />Overdue \xB7 {{ g.due_on | day }}</span> }
                    @else if (g.status === 'resolved' || g.status === 'closed') { <span class="subtle">{{ g.due_on | day }}</span> }
                    @else { {{ g.due_on | day }} <span class="small subtle">{{ dueIn(g.due_on) }}</span> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- detail drawer -->
    <vc-modal [(open)]="detailOpen" [drawer]="true" width="560px" [title]="sel()?.subject ?? ''" [subtitle]="sel() ? sel()!.code + ' \xB7 ' + farmerName(sel()!.farmer_id) : ''">
      @if (sel(); as g) {
        <div class="stack" style="--gap:20px">
          <div class="chips">
            <vc-badge [status]="g.status" />
            <span class="pri" [class]="'p-' + g.priority">{{ g.priority | human }} priority</span>
            <span class="chip">{{ catLabel(g.category) }}</span>
            <span class="chip">{{ channelLabel(g.channel) }}</span>
            @if (g.overdue) { <span class="ovd"><vc-icon name="clock" [size]="12" />Overdue since {{ g.due_on | day }}</span> }
            @else { <span class="chip">Due {{ g.due_on | day }}</span> }
          </div>
          <div class="desc">{{ g.description }}</div>
          @if (g.resolution) {
            <vc-callout tone="ok" icon="check-circle"><strong>Resolution</strong> <span class="small subtle">{{ g.resolved_at | day: true }}</span><p style="margin-top:4px">{{ g.resolution }}</p></vc-callout>
          }

          @if (canHandle() && g.status !== 'closed') {
            <section class="act card card-pad">
              <div class="field">
                <label for="as">Assigned to</label>
                <div class="row" style="--gap:8px">
                  <select id="as" class="input" [(ngModel)]="assignee"><option value="">Choose a person\u2026</option>
                    @for (u of activeUsers(); track u.id) { <option [value]="u.id">{{ u.full_name }} \xB7 {{ u.role_label }}</option> }</select>
                  <button class="btn btn-secondary" [disabled]="!assignee || assignee === g.assigned_to || busy()" (click)="assign(g)">Assign</button>
                </div>
              </div>
              @if (transitions(g).length) {
                <hr style="margin:4px 0" />
                <div class="field">
                  <label for="nt">Note {{ needsNote(g) ? '' : '(optional)' }}</label>
                  <input id="nt" class="input" [(ngModel)]="note" [placeholder]="g.status === 'resolved' ? 'Required for an appeal: why is the farmer appealing?' : 'Added to the case history'" />
                </div>
                @if (g.status === 'in_progress') {
                  <div class="field"><label for="rs">Resolution</label>
                    <textarea id="rs" class="input" rows="3" [(ngModel)]="resolution" placeholder="Explain what was done, in words the farmer will understand."></textarea>
                    <span class="hint">Required to resolve. The farmer sees this.</span></div>
                }
                @if (actionError()) { <vc-error title="Not changed" [message]="actionError()!" /> }
                <div class="row wrap" style="--gap:8px;justify-content:flex-end">
                  @for (t of transitions(g); track t.to) {
                    <button class="btn" [class]="'btn-' + t.kind" [disabled]="busy() || (t.to === 'resolved' && !resolution.trim()) || (t.to === 'appealed' && !note.trim())"
                      (click)="t.to === 'closed' ? closeConfirm.set(true) : move(g, t.to)"><vc-icon [name]="t.icon" />{{ t.label }}</button>
                  }
                </div>
              }
            </section>
          }

          <section>
            <h3 class="hh">History</h3>
            <vc-timeline [items]="timeline(g)" />
          </section>
        </div>
      }
    </vc-modal>

    <vc-modal [(open)]="closeConfirm" title="Close this case?" width="440px">
      <p>A closed case can't be reopened or reassigned. Close it only when the farmer has accepted the resolution or the appeal period has passed.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="closeConfirm.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="move(sel()!, 'closed'); closeConfirm.set(false)">Close case</button>
      </ng-container>
    </vc-modal>

    <!-- create -->
    <vc-modal [(open)]="createOpen" title="New grievance" subtitle="Record the farmer's concern in their words" width="600px">
      <form class="form-grid" id="gForm" (ngSubmit)="create()">
        <div class="field span-2">
          <label for="fq">Farmer</label>
          @if (pickedFarmer(); as f) {
            <div class="picked"><span class="av">{{ f.full_name.slice(0, 1) }}</span><div><strong>{{ f.full_name }}</strong><span class="small subtle">{{ f.code }} \xB7 {{ f.village }}, {{ f.district }}</span></div>
              <span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" (click)="pickedFarmer.set(null)">Change</button></div>
          } @else {
            <input id="fq" class="input" name="fq" [ngModel]="farmerQ()" (ngModelChange)="farmerQ.set($event)" placeholder="Search by name, code or phone\u2026" autocomplete="off" />
            @if (farmerQ().trim().length >= 2) {
              <ul class="fres">
                @for (f of farmerHits.data() ?? []; track f.id) {
                  <li (click)="pickedFarmer.set(f)"><strong>{{ f.full_name }}</strong><span class="small subtle">{{ f.code }} \xB7 {{ f.village }}</span></li>
                } @empty { <li class="muted small">{{ farmerHits.loading() ? 'Searching\u2026' : 'No farmer found.' }}</li> }
              </ul>
            }
            <span class="hint">Leave empty for a concern that isn't about one farmer.</span>
          }
        </div>
        <div class="field"><label for="gc">Category</label>
          <select id="gc" class="input" name="gc" [(ngModel)]="nf.category">@for (c of categories; track c.key) { <option [value]="c.key">{{ c.label }}</option> }</select></div>
        <div class="field"><label for="gch">Received by</label>
          <select id="gch" class="input" name="gch" [(ngModel)]="nf.channel">@for (c of channels; track c.key) { <option [value]="c.key">{{ c.label }}</option> }</select></div>
        <div class="field span-2"><label for="gs">Subject</label><input id="gs" class="input" name="gs" [(ngModel)]="nf.subject" placeholder="e.g. Second payout instalment not received" /></div>
        <div class="field span-2"><label for="gd">Description</label><textarea id="gd" class="input" name="gd" rows="4" [(ngModel)]="nf.description" placeholder="What the farmer said, dates, amounts, who they spoke to."></textarea></div>
        <div class="field span-2">
          <label>Priority</label>
          <div class="prio">
            @for (p of ['high', 'normal', 'low']; track p) {
              <label class="popt" [class.on]="nf.priority === p"><input type="radio" name="gp" [value]="p" [(ngModel)]="nf.priority" />
                <strong>{{ p | human }}</strong><small>Answer within {{ dueDays[p] }} days</small></label>
            }
          </div>
        </div>
        <div class="span-2 due"><vc-icon name="calendar" [size]="15" />Response due by <strong>{{ dueDate() | day }}</strong></div>
        @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="gForm" [disabled]="busy() || nf.subject.trim().length < 3 || nf.description.trim().length < 5">{{ busy() ? 'Saving\u2026' : 'Create case' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;216f74d9d858dd53;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\grievances\\grievances.page.ts */\n.stats {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n@media (max-width: 900px) {\n  .stats {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.st {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  align-items: flex-start;\n  padding: 14px 16px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow-sm);\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  text-align: left;\n}\n.st span {\n  font-size: 12.5px;\n  color: var(--text-2);\n  font-weight: 500;\n}\n.st strong {\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.st.danger strong {\n  color: var(--red-600);\n}\n.st.on {\n  border-color: var(--forest-500);\n  box-shadow: var(--focus);\n}\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 420px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.filters select {\n  width: 170px;\n}\n.sj {\n  display: flex;\n  flex-direction: column;\n  max-width: 380px;\n  min-width: 0;\n}\n.pri {\n  display: inline-block;\n  font-size: 12px;\n  font-weight: 500;\n  padding: 2px 8px;\n  border-radius: 4px;\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.pri.p-high {\n  background: var(--red-100);\n  color: var(--red-600);\n}\n.pri.p-normal {\n  background: var(--sky-100);\n  color: var(--sky-600);\n}\n.as {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n}\n.av {\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: var(--forest-100);\n  color: var(--forest-700);\n  font-size: 10px;\n  font-weight: 600;\n  flex: none;\n}\n.ovd {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--red-600);\n  background: var(--red-100);\n  padding: 2px 8px;\n  border-radius: 999px;\n}\ntr.od td:first-child {\n  box-shadow: inset 3px 0 0 var(--red-600);\n}\n.chips {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.chip {\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.desc {\n  white-space: pre-wrap;\n  padding: 14px 16px;\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  font-size: 13.5px;\n  color: var(--stone-800);\n}\n.act {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.hh {\n  margin-bottom: 12px;\n}\n.picked {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 10px;\n  border: 1px solid var(--forest-200);\n  background: var(--forest-50);\n  border-radius: 8px;\n}\n.picked div {\n  display: flex;\n  flex-direction: column;\n}\n.picked .av {\n  width: 30px;\n  height: 30px;\n  font-size: 12px;\n}\n.fres {\n  list-style: none;\n  margin: 0;\n  padding: 4px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  max-height: 180px;\n  overflow: auto;\n  background: var(--surface);\n  box-shadow: var(--shadow);\n}\n.fres li {\n  display: flex;\n  flex-direction: column;\n  padding: 7px 10px;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.fres li:hover {\n  background: var(--forest-50);\n}\n.prio {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n.popt {\n  display: flex;\n  flex-direction: column;\n  padding: 10px 12px;\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.popt input {\n  display: none;\n}\n.popt strong {\n  font-size: 13.5px;\n  font-weight: 500;\n}\n.popt small {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.popt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: var(--focus);\n}\n.due {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--sand-100);\n  font-size: 13.5px;\n  color: var(--stone-700);\n}\n/*# sourceMappingURL=grievances.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GrievancesPage, { className: "GrievancesPage", filePath: "src/app/features/grievances/grievances.page.ts", lineNumber: 250 });
})();

// src/app/features/grievances/grievances.routes.ts
var grievances_routes_default = [{ path: "", component: GrievancesPage, title: "Grievances \xB7 Varsapradaya Carbon" }];
export {
  grievances_routes_default as default
};
//# debugId=e2ec7dd4-9526-5f92-88a3-72961628a97d
//# sourceMappingURL=chunk-L2VDPA3N.js.map
