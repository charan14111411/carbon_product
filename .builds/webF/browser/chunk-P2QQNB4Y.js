import {
  ConfirmDialog
} from "./chunk-VLAABCYZ.js";
import {
  fieldMap,
  formMessage
} from "./chunk-NPXRRJEC.js";
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
  RequiredValidator,
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
  PageHeader,
  Stat,
  Tabs
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Subject,
  catchError,
  computed,
  debounceTime,
  forkJoin,
  inject,
  input,
  of,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate5,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/programmes/types.ts
var PROGRAMME_NEXT = {
  draft: [{
    to: "active",
    label: "Activate",
    icon: "play",
    tone: "primary",
    reason: "optional",
    text: "Activating opens the programme for projects and farmer enrolment."
  }],
  active: [
    {
      to: "suspended",
      label: "Suspend",
      icon: "ban",
      tone: "danger",
      reason: "required",
      text: "Suspending pauses new enrolments and field activity until the programme is reactivated."
    },
    {
      to: "closed",
      label: "Close",
      icon: "archive",
      tone: "danger",
      reason: "required",
      text: "Closing is permanent. A closed programme can\u2019t be reopened; its records stay available for audit."
    }
  ],
  suspended: [
    {
      to: "active",
      label: "Reactivate",
      icon: "play",
      tone: "primary",
      reason: "optional",
      text: "Reactivating resumes enrolment and field activity."
    },
    {
      to: "closed",
      label: "Close",
      icon: "archive",
      tone: "danger",
      reason: "required",
      text: "Closing is permanent. A closed programme can\u2019t be reopened; its records stay available for audit."
    }
  ],
  closed: []
};
var PROJECT_NEXT = {
  design: [{
    to: "active",
    label: "Activate project",
    icon: "play",
    tone: "primary",
    reason: "optional",
    text: "An active project accepts enrolments, sampling campaigns and calculations."
  }],
  active: [
    {
      to: "monitoring",
      label: "Move to monitoring",
      icon: "activity",
      tone: "primary",
      reason: "optional",
      text: "Monitoring marks the start of the re-measurement phase for this crediting period."
    },
    {
      to: "closed",
      label: "Close project",
      icon: "archive",
      tone: "danger",
      reason: "required",
      text: "Closing is permanent. No further enrolments or calculations can be added."
    }
  ],
  monitoring: [{
    to: "closed",
    label: "Close project",
    icon: "archive",
    tone: "danger",
    reason: "required",
    text: "Closing is permanent. No further enrolments or calculations can be added."
  }],
  closed: []
};
var CHECK_LABELS = {
  inside_programme_boundary: "Inside programme area",
  crop_eligible: "Eligible crop",
  land_use_history: "Land-use history",
  not_double_enrolled: "Not enrolled elsewhere",
  farmer_consent: "Farmer consent"
};

// src/app/features/programmes/programme-detail.page.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.to;
function ProgrammeDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-loading", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function ProgrammeDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function ProgrammeDetailPage_Conditional_5_Conditional_3_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 40);
    \u0275\u0275listener("click", function ProgrammeDetailPage_Conditional_5_Conditional_3_For_1_Template_button_click_0_listener() {
      const t_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.ask(t_r4));
    });
    \u0275\u0275element(1, "vc-icon", 41);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r4 = ctx.$implicit;
    \u0275\u0275classProp("btn-primary", t_r4.tone === "primary")("btn-secondary", t_r4.tone === "danger");
    \u0275\u0275advance();
    \u0275\u0275property("name", t_r4.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r4.label);
  }
}
function ProgrammeDetailPage_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ProgrammeDetailPage_Conditional_5_Conditional_3_For_1_Template, 3, 6, "button", 39, _forTrack1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r0.transitions());
  }
}
function ProgrammeDetailPage_Conditional_5_Case_5_Conditional_47_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275element(1, "vc-icon", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.cropName(c_r5));
  }
}
function ProgrammeDetailPage_Conditional_5_Case_5_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275repeaterCreate(1, ProgrammeDetailPage_Conditional_5_Case_5_Conditional_47_For_2_Template, 3, 2, "span", 55, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 56);
    \u0275\u0275text(4, "Fields growing any other crop fail the \u201CEligible crop\u201D check at enrolment.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r6 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(p_r6.eligible_crops);
  }
}
function ProgrammeDetailPage_Conditional_5_Case_5_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 53);
    \u0275\u0275text(1, "Every crop is eligible. Add crops to restrict enrolment.");
    \u0275\u0275elementEnd();
  }
}
function ProgrammeDetailPage_Conditional_5_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "vc-stat", 43)(2, "vc-stat", 44);
    \u0275\u0275pipe(3, "num");
    \u0275\u0275element(4, "vc-stat", 45);
    \u0275\u0275pipe(5, "num");
    \u0275\u0275element(6, "vc-stat", 46);
    \u0275\u0275pipe(7, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 47)(9, "section", 2)(10, "div", 48)(11, "h3");
    \u0275\u0275text(12, "Programme details");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 49)(14, "dl", 50)(15, "dt");
    \u0275\u0275text(16, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "dd", 51);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dt");
    \u0275\u0275text(20, "Region");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dd");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "dt");
    \u0275\u0275text(24, "Runs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dd");
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "day");
    \u0275\u0275pipe(28, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dt");
    \u0275\u0275text(30, "Land-use look-back");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dd", 52);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dt");
    \u0275\u0275text(34, "Area limit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "dd");
    \u0275\u0275text(36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "dt");
    \u0275\u0275text(38, "Created");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "dd");
    \u0275\u0275text(40);
    \u0275\u0275pipe(41, "day");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(42, "section", 2)(43, "div", 48)(44, "h3");
    \u0275\u0275text(45, "Eligible crops");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 49);
    \u0275\u0275conditionalCreate(47, ProgrammeDetailPage_Conditional_5_Case_5_Conditional_47_Template, 5, 0)(48, ProgrammeDetailPage_Conditional_5_Case_5_Conditional_48_Template, 2, 0, "p", 53);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r6 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.summary()?.projects ?? "\u2014")("hint", ctx_r0.projectsHint());
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.summary() ? \u0275\u0275pipeBind2(3, 14, ctx_r0.summary().farmers_enrolled, 0) : "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.summary() ? \u0275\u0275pipeBind2(5, 17, ctx_r0.summary().fields_enrolled, 0) : "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.summary() ? \u0275\u0275pipeBind2(7, 20, ctx_r0.summary().hectares_enrolled, 1) : "\u2014")("accent", true);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(p_r6.code);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r6.region || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(27, 23, p_r6.start_date), " \u2013 ", p_r6.end_date ? \u0275\u0275pipeBind1(28, 25, p_r6.end_date) : "no end date");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r0.lookback(), " years");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r6.boundary ? "Boundary set \u2014 fields outside it are ineligible" : "No area limit");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(41, 27, p_r6.created_at));
    \u0275\u0275advance(7);
    \u0275\u0275conditional(p_r6.eligible_crops.length ? 47 : 48);
  }
}
function ProgrammeDetailPage_Conditional_5_Case_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 61);
    \u0275\u0275listener("click", function ProgrammeDetailPage_Conditional_5_Case_6_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openProject());
    });
    \u0275\u0275element(1, "vc-icon", 62);
    \u0275\u0275text(2, "New project");
    \u0275\u0275elementEnd();
  }
}
function ProgrammeDetailPage_Conditional_5_Case_6_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 64);
    \u0275\u0275listener("click", function ProgrammeDetailPage_Conditional_5_Case_6_Conditional_5_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openProject());
    });
    \u0275\u0275element(1, "vc-icon", 62);
    \u0275\u0275text(2, "New project");
    \u0275\u0275elementEnd();
  }
}
function ProgrammeDetailPage_Conditional_5_Case_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 59);
    \u0275\u0275conditionalCreate(1, ProgrammeDetailPage_Conditional_5_Case_6_Conditional_5_Conditional_1_Template, 3, 0, "button", 63);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r6 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canManage && p_r6.status !== "closed" ? 1 : -1);
  }
}
function ProgrammeDetailPage_Conditional_5_Case_6_Conditional_6_For_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 67);
    \u0275\u0275listener("click", function ProgrammeDetailPage_Conditional_5_Case_6_Conditional_6_For_17_Template_tr_click_0_listener() {
      const pr_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openProjectDetail(pr_r10));
    });
    \u0275\u0275elementStart(1, "td")(2, "div", 68)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 69);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "td")(8, "span", 70);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 71);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 71);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "day");
    \u0275\u0275pipe(16, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275element(18, "vc-badge", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 52);
    \u0275\u0275element(20, "vc-icon", 72);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pr_r10 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(pr_r10.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pr_r10.code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", pr_r10.methodology_code, " v", pr_r10.methodology_version);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 9, pr_r10.baseline_start));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(15, 11, pr_r10.crediting_start), " \u2013 ", \u0275\u0275pipeBind1(16, 13, pr_r10.crediting_end));
    \u0275\u0275advance(4);
    \u0275\u0275property("status", pr_r10.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
  }
}
function ProgrammeDetailPage_Conditional_5_Case_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60)(1, "table", 65)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Project");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Methodology");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Baseline from");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Crediting period");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "tbody");
    \u0275\u0275repeaterCreate(16, ProgrammeDetailPage_Conditional_5_Case_6_Conditional_6_For_17_Template, 21, 15, "tr", 66, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(16);
    \u0275\u0275repeater(ctx_r0.projects());
  }
}
function ProgrammeDetailPage_Conditional_5_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 48)(2, "h3");
    \u0275\u0275text(3, "Projects");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProgrammeDetailPage_Conditional_5_Case_6_Conditional_4_Template, 3, 0, "button", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ProgrammeDetailPage_Conditional_5_Case_6_Conditional_5_Template, 2, 1, "vc-empty", 59)(6, ProgrammeDetailPage_Conditional_5_Case_6_Conditional_6_Template, 18, 0, "div", 60);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r6 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.canManage && p_r6.status !== "closed" ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.projects().length ? 5 : 6);
  }
}
function ProgrammeDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-page-header", 35)(1, "div", 36);
    \u0275\u0275element(2, "vc-badge", 37);
    \u0275\u0275conditionalCreate(3, ProgrammeDetailPage_Conditional_5_Conditional_3_Template, 2, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "vc-tabs", 38);
    \u0275\u0275twoWayListener("activeChange", function ProgrammeDetailPage_Conditional_5_Template_vc_tabs_activeChange_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.tab, $event) || (ctx_r0.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ProgrammeDetailPage_Conditional_5_Case_5_Template, 49, 29)(6, ProgrammeDetailPage_Conditional_5_Case_6_Template, 7, 2, "section", 2);
  }
  if (rf & 2) {
    let tmp_9_0;
    const p_r6 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("title", p_r6.name)("eyebrow", p_r6.code)("subtitle", p_r6.description || p_r6.region);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r6.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canManage ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("tabs", ctx_r0.tabs());
    \u0275\u0275twoWayProperty("active", ctx_r0.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_9_0 = ctx_r0.tab()) === "overview" ? 5 : tmp_9_0 === "projects" ? 6 : -1);
  }
}
function ProgrammeDetailPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.fe()["code"]);
  }
}
function ProgrammeDetailPage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.fe()["name"]);
  }
}
function ProgrammeDetailPage_For_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 23);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = ctx.$implicit;
    \u0275\u0275property("value", r_r11.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate5("", r_r11.methodology_code, " v", r_r11.methodology_version, " rev ", r_r11.revision, " \xB7 ", r_r11.title, " (", \u0275\u0275pipeBind1(2, 6, r_r11.status), ")");
  }
}
function ProgrammeDetailPage_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1, "The crediting period can't end before it starts.");
    \u0275\u0275elementEnd();
  }
}
function ProgrammeDetailPage_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275element(1, "vc-error", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.projError());
  }
}
var ProgrammeDetailPage = class _ProgrammeDetailPage {
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  toast = inject(ToastService);
  router = inject(Router);
  ctx = inject(ProjectContext);
  canManage = inject(AuthService).can("programmes.manage");
  p = signal(
    null,
    ...ngDevMode ? [{ debugName: "p" }] : (
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
  projects = signal(
    [],
    ...ngDevMode ? [{ debugName: "projects" }] : (
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
  packs = signal(
    [],
    ...ngDevMode ? [{ debugName: "packs" }] : (
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
    "overview",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "overview", label: "Overview" },
      { key: "projects", label: "Projects", count: this.projects().length }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  transitions = computed(
    () => PROGRAMME_NEXT[this.p()?.status ?? ""] ?? [],
    ...ngDevMode ? [{ debugName: "transitions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  lookback = computed(
    () => Number(this.p()?.commercial_terms?.["lookback_years"] ?? 10),
    ...ngDevMode ? [{ debugName: "lookback" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projectsHint = computed(
    () => {
      const by = this.summary()?.projects_by_status ?? {};
      return Object.entries(by).map(([k, v]) => `${v} ${k}`).join(" \xB7 ");
    },
    ...ngDevMode ? [{ debugName: "projectsHint" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropMap = computed(
    () => new Map(this.crops().map((c) => [c.code, c.name])),
    ...ngDevMode ? [{ debugName: "cropMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  confirmOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "confirmOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pending = signal(
    null,
    ...ngDevMode ? [{ debugName: "pending" }] : (
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
  projectOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "projectOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projError = signal(
    null,
    ...ngDevMode ? [{ debugName: "projError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fe = signal(
    {},
    ...ngDevMode ? [{ debugName: "fe" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pf = this.blankProject();
  ngOnInit() {
    this.load();
    this.api.get("/catalogue/crops").subscribe({ next: (c) => this.crops.set(c), error: () => {
    } });
  }
  cropName(c) {
    return this.cropMap().get(c) ?? c;
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/programmes/${this.id()}`).subscribe({
      next: (p) => {
        this.p.set(p);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
    this.api.get(`/programmes/${this.id()}/summary`).pipe(catchError(() => of(null))).subscribe((s) => this.summary.set(s));
    this.api.get("/projects", { programme_id: this.id() }).pipe(catchError(() => of([]))).subscribe((r) => this.projects.set(r));
  }
  ask(t) {
    this.pending.set(t);
    this.confirmOpen.set(true);
  }
  applyStatus(reason) {
    const t = this.pending();
    if (!t)
      return;
    this.busy.set(true);
    this.api.post(`/programmes/${this.id()}/status`, { status: t.to, reason: reason || null }).subscribe({
      next: (p) => {
        this.busy.set(false);
        this.confirmOpen.set(false);
        this.p.set(p);
        this.toast.success(`Programme ${p.status}`, `${p.code} is now ${p.status}.`);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't change the status");
      }
    });
  }
  blankProject() {
    return {
      code: "",
      name: "",
      methodology_code: "VM0042",
      methodology_version: "2.2",
      rule_pack_id: "",
      baseline_start: "",
      crediting_start: "",
      crediting_end: ""
    };
  }
  openProject() {
    this.pf = this.blankProject();
    this.projError.set(null);
    this.fe.set({});
    this.projectOpen.set(true);
    if (!this.packs().length) {
      this.api.get("/rule-packs").pipe(catchError(() => of([]))).subscribe((r) => this.packs.set(r.filter((x) => x.status !== "retired")));
    }
  }
  openProjectDetail(pr) {
    this.router.navigate(["/app/programmes/projects", pr.id]);
  }
  createProject() {
    const f = this.pf;
    this.busy.set(true);
    this.projError.set(null);
    this.api.post("/projects", {
      programme_id: this.id(),
      code: f.code.trim(),
      name: f.name.trim(),
      methodology_code: f.methodology_code.trim(),
      methodology_version: f.methodology_version.trim(),
      rule_pack_id: f.rule_pack_id || null,
      baseline_start: f.baseline_start || null,
      crediting_start: f.crediting_start || null,
      crediting_end: f.crediting_end || null
    }).subscribe({
      next: (pr) => {
        this.busy.set(false);
        this.projectOpen.set(false);
        this.toast.success("Project created", `${pr.code} is in design. Enrol fields and activate it when ready.`);
        this.ctx.load();
        this.router.navigate(["/app/programmes/projects", pr.id]);
      },
      error: (e) => {
        this.busy.set(false);
        const m = fieldMap(e);
        this.fe.set(m);
        this.projError.set(formMessage(e, m));
      }
    });
  }
  static \u0275fac = function ProgrammeDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProgrammeDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProgrammeDetailPage, selectors: [["vc-programme-detail"]], inputs: { id: [1, "id"] }, decls: 61, vars: 31, consts: [["routerLink", "/app/programmes", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this programme", 3, "message"], ["reasonPlaceholder", "Why is the status changing?", 3, "openChange", "confirmed", "open", "title", "message", "confirmLabel", "tone", "icon", "reason", "busy"], ["title", "New project", "subtitle", "The methodology and crediting period decide how credits are calculated.", "width", "620px", 3, "openChange", "open"], ["id", "proj-form", 1, "form-grid", 3, "ngSubmit"], [1, "field"], ["for", "jc"], ["id", "jc", "name", "code", "placeholder", "KA-REGEN-01", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "error"], ["for", "jn"], ["id", "jn", "name", "name", "placeholder", "Hassan cohort 2026", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "jm"], ["id", "jm", "name", "mc", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "hint"], ["for", "jv"], ["id", "jv", "name", "mv", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], ["for", "jr"], [1, "subtle"], ["id", "jr", "name", "rp", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["for", "jb"], ["id", "jb", "type", "date", "name", "bs", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "jcs"], ["id", "jcs", "type", "date", "name", "cs", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "jce"], ["id", "jce", "type", "date", "name", "ce", 1, "input", 3, "ngModelChange", "ngModel"], [1, "span-2"], ["footer", ""], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "submit", "form", "proj-form", 1, "btn", "btn-primary", 3, "disabled"], [3, "rows"], [3, "title", "eyebrow", "subtitle"], ["actions", "", 1, "hacts"], [3, "status"], [3, "activeChange", "tabs", "active"], [1, "btn", 3, "btn-primary", "btn-secondary"], [1, "btn", 3, "click"], [3, "name"], [1, "grid", "grid-4", "stats"], ["label", "Projects", "icon", "briefcase", 3, "value", "hint"], ["label", "Farmers enrolled", "icon", "users", 3, "value"], ["label", "Fields enrolled", "icon", "map", 3, "value"], ["label", "Area enrolled", "unit", "ha", "icon", "layers", 3, "value", "accent"], [1, "grid", "grid-2"], [1, "card-head"], [1, "card-body"], [1, "kv"], [1, "mono"], [1, "num"], [1, "muted"], [1, "crops"], [1, "crop"], [1, "small", "subtle", "note"], ["name", "sprout", 3, "size"], [1, "btn", "btn-primary", "btn-sm"], ["icon", "briefcase", "title", "No projects yet", "text", "A project follows one methodology and crediting period. Create one to start enrolling fields."], [1, "table-wrap"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["name", "plus"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "table"], [1, "clickable"], [1, "clickable", 3, "click"], [1, "pname"], [1, "mono", "subtle", "small"], [1, "mono", "small"], [1, "nowrap"], ["name", "chevron-right", 1, "subtle", 3, "size"], ["title", "Couldn't create the project", 3, "message"]], template: function ProgrammeDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All programmes");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, ProgrammeDetailPage_Conditional_3_Template, 2, 1, "div", 2)(4, ProgrammeDetailPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, ProgrammeDetailPage_Conditional_5_Template, 7, 8);
      \u0275\u0275elementStart(6, "vc-confirm", 4);
      \u0275\u0275twoWayListener("openChange", function ProgrammeDetailPage_Template_vc_confirm_openChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.confirmOpen, $event) || (ctx.confirmOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function ProgrammeDetailPage_Template_vc_confirm_confirmed_6_listener($event) {
        return ctx.applyStatus($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "vc-modal", 5);
      \u0275\u0275twoWayListener("openChange", function ProgrammeDetailPage_Template_vc_modal_openChange_7_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.projectOpen, $event) || (ctx.projectOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(8, "form", 6);
      \u0275\u0275listener("ngSubmit", function ProgrammeDetailPage_Template_form_ngSubmit_8_listener() {
        return ctx.createProject();
      });
      \u0275\u0275elementStart(9, "div", 7)(10, "label", 8);
      \u0275\u0275text(11, "Code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammeDetailPage_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.pf.code, $event) || (ctx.pf.code = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(13, ProgrammeDetailPage_Conditional_13_Template, 2, 1, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 7)(15, "label", 11);
      \u0275\u0275text(16, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 12);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammeDetailPage_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.pf.name, $event) || (ctx.pf.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(18, ProgrammeDetailPage_Conditional_18_Template, 2, 1, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 7)(20, "label", 13);
      \u0275\u0275text(21, "Methodology code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "input", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammeDetailPage_Template_input_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.pf.methodology_code, $event) || (ctx.pf.methodology_code = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "span", 15);
      \u0275\u0275text(24, "For example VM0042 (Verra improved agricultural land management).");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 7)(26, "label", 16);
      \u0275\u0275text(27, "Methodology version");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "input", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammeDetailPage_Template_input_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.pf.methodology_version, $event) || (ctx.pf.methodology_version = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 18)(30, "label", 19);
      \u0275\u0275text(31, "Rule pack ");
      \u0275\u0275elementStart(32, "span", 20);
      \u0275\u0275text(33, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "select", 21);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammeDetailPage_Template_select_ngModelChange_34_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.pf.rule_pack_id, $event) || (ctx.pf.rule_pack_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(35, "option", 22);
      \u0275\u0275text(36, "Assign later");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(37, ProgrammeDetailPage_For_38_Template, 3, 8, "option", 23, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "span", 15);
      \u0275\u0275text(40, "The rule pack holds the approved methodology parameters. Calculations need an approved one.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "div", 7)(42, "label", 24);
      \u0275\u0275text(43, "Baseline start");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "input", 25);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammeDetailPage_Template_input_ngModelChange_44_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.pf.baseline_start, $event) || (ctx.pf.baseline_start = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275element(45, "div", 7);
      \u0275\u0275elementStart(46, "div", 7)(47, "label", 26);
      \u0275\u0275text(48, "Crediting start");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "input", 27);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammeDetailPage_Template_input_ngModelChange_49_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.pf.crediting_start, $event) || (ctx.pf.crediting_start = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(50, "div", 7)(51, "label", 28);
      \u0275\u0275text(52, "Crediting end");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "input", 29);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammeDetailPage_Template_input_ngModelChange_53_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.pf.crediting_end, $event) || (ctx.pf.crediting_end = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(54, ProgrammeDetailPage_Conditional_54_Template, 2, 0, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(55, ProgrammeDetailPage_Conditional_55_Template, 2, 1, "div", 30);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(56, 31);
      \u0275\u0275elementStart(57, "button", 32);
      \u0275\u0275listener("click", function ProgrammeDetailPage_Template_button_click_57_listener() {
        return ctx.projectOpen.set(false);
      });
      \u0275\u0275text(58, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "button", 33);
      \u0275\u0275text(60);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.p()) ? 5 : -1, tmp_1_0);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("open", ctx.confirmOpen);
      \u0275\u0275property("title", ctx.pending()?.label + " programme")("message", ctx.pending()?.text ?? "")("confirmLabel", ctx.pending()?.label ?? "Confirm")("tone", ctx.pending()?.tone ?? "primary")("icon", ctx.pending()?.icon ?? "")("reason", ctx.pending()?.reason ?? "none")("busy", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.projectOpen);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("invalid", ctx.fe()["code"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.pf.code);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["code"] ? 13 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("invalid", ctx.fe()["name"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.pf.name);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["name"] ? 18 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.pf.methodology_code);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.pf.methodology_version);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.pf.rule_pack_id);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.packs());
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.pf.baseline_start);
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.pf.crediting_start);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275classProp("invalid", ctx.pf.crediting_start && ctx.pf.crediting_end && ctx.pf.crediting_end < ctx.pf.crediting_start);
      \u0275\u0275twoWayProperty("ngModel", ctx.pf.crediting_end);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pf.crediting_start && ctx.pf.crediting_end && ctx.pf.crediting_end < ctx.pf.crediting_start ? 54 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.projError() ? 55 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.pf.code || !ctx.pf.name);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.busy() ? "Creating\u2026" : "Create project", " ");
    }
  }, dependencies: [
    FormsModule,
    \u0275NgNoValidate,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    NgModel,
    NgForm,
    RouterLink,
    PageHeader,
    Loading,
    ErrorBox,
    Empty,
    Badge,
    Modal,
    Tabs,
    Stat,
    Icon,
    ConfirmDialog,
    NumPipe,
    DayPipe,
    HumanPipe
  ], styles: ["\n.hacts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-bottom: 14px;\n}\n.back[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%forest-700);\n  text-decoration: none;\n}\n.stats[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.crops[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.crop[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 30px;\n  padding: 0 10px;\n  border-radius: 7px;\n  background: var(--%NS%forest-50);\n  border: 1px solid var(--%NS%forest-100);\n  color: var(--%NS%forest-800);\n  font-size: 13px;\n}\n.crop[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%forest-500);\n}\n.note[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.pname[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n/*# sourceMappingURL=programme-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgrammeDetailPage, [{
    type: Component,
    args: [{ selector: "vc-programme-detail", imports: [
      FormsModule,
      RouterLink,
      PageHeader,
      Loading,
      ErrorBox,
      Empty,
      Badge,
      Modal,
      Tabs,
      Stat,
      Icon,
      ConfirmDialog,
      NumPipe,
      DayPipe,
      HumanPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a class="back" routerLink="/app/programmes"><vc-icon name="arrow-left" [size]="15" />All programmes</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this programme" [message]="error()!" />
    } @else if (p(); as p) {
      <vc-page-header [title]="p.name" [eyebrow]="p.code" [subtitle]="p.description || p.region">
        <div actions class="hacts">
          <vc-badge [status]="p.status" />
          @if (canManage) {
            @for (t of transitions(); track t.to) {
              <button class="btn" [class.btn-primary]="t.tone === 'primary'" [class.btn-secondary]="t.tone === 'danger'"
                (click)="ask(t)"><vc-icon [name]="t.icon" />{{ t.label }}</button>
            }
          }
        </div>
      </vc-page-header>

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @switch (tab()) {
        @case ('overview') {
          <div class="grid grid-4 stats">
            <vc-stat label="Projects" [value]="summary()?.projects ?? '\u2014'" icon="briefcase"
              [hint]="projectsHint()" />
            <vc-stat label="Farmers enrolled" [value]="summary() ? (summary()!.farmers_enrolled | num: 0) : '\u2014'" icon="users" />
            <vc-stat label="Fields enrolled" [value]="summary() ? (summary()!.fields_enrolled | num: 0) : '\u2014'" icon="map" />
            <vc-stat label="Area enrolled" [value]="summary() ? (summary()!.hectares_enrolled | num: 1) : '\u2014'" unit="ha" icon="layers" [accent]="true" />
          </div>
          <div class="grid grid-2">
            <section class="card">
              <div class="card-head"><h3>Programme details</h3></div>
              <div class="card-body">
                <dl class="kv">
                  <dt>Code</dt><dd class="mono">{{ p.code }}</dd>
                  <dt>Region</dt><dd>{{ p.region || '\u2014' }}</dd>
                  <dt>Runs</dt><dd>{{ p.start_date | day }} \u2013 {{ p.end_date ? (p.end_date | day) : 'no end date' }}</dd>
                  <dt>Land-use look-back</dt><dd class="num">{{ lookback() }} years</dd>
                  <dt>Area limit</dt><dd>{{ p.boundary ? 'Boundary set \u2014 fields outside it are ineligible' : 'No area limit' }}</dd>
                  <dt>Created</dt><dd>{{ p.created_at | day }}</dd>
                </dl>
              </div>
            </section>
            <section class="card">
              <div class="card-head"><h3>Eligible crops</h3></div>
              <div class="card-body">
                @if (p.eligible_crops.length) {
                  <div class="crops">
                    @for (c of p.eligible_crops; track c) {
                      <span class="crop"><vc-icon name="sprout" [size]="14" />{{ cropName(c) }}</span>
                    }
                  </div>
                  <p class="small subtle note">Fields growing any other crop fail the \u201CEligible crop\u201D check at enrolment.</p>
                } @else {
                  <p class="muted">Every crop is eligible. Add crops to restrict enrolment.</p>
                }
              </div>
            </section>
          </div>
        }
        @case ('projects') {
          <section class="card">
            <div class="card-head">
              <h3>Projects</h3>
              @if (canManage && p.status !== 'closed') {
                <button class="btn btn-primary btn-sm" (click)="openProject()"><vc-icon name="plus" />New project</button>
              }
            </div>
            @if (!projects().length) {
              <vc-empty icon="briefcase" title="No projects yet"
                text="A project follows one methodology and crediting period. Create one to start enrolling fields.">
                @if (canManage && p.status !== 'closed') { <button class="btn btn-primary" (click)="openProject()"><vc-icon name="plus" />New project</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Project</th><th>Methodology</th><th>Baseline from</th><th>Crediting period</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    @for (pr of projects(); track pr.id) {
                      <tr class="clickable" (click)="openProjectDetail(pr)">
                        <td><div class="pname"><strong>{{ pr.name }}</strong><span class="mono subtle small">{{ pr.code }}</span></div></td>
                        <td><span class="mono small">{{ pr.methodology_code }} v{{ pr.methodology_version }}</span></td>
                        <td class="nowrap">{{ pr.baseline_start | day }}</td>
                        <td class="nowrap">{{ pr.crediting_start | day }} \u2013 {{ pr.crediting_end | day }}</td>
                        <td><vc-badge [status]="pr.status" /></td>
                        <td class="num"><vc-icon name="chevron-right" [size]="16" class="subtle" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        }
      }
    }

    <vc-confirm [(open)]="confirmOpen" [title]="pending()?.label + ' programme'" [message]="pending()?.text ?? ''"
      [confirmLabel]="pending()?.label ?? 'Confirm'" [tone]="pending()?.tone ?? 'primary'" [icon]="pending()?.icon ?? ''"
      [reason]="pending()?.reason ?? 'none'" reasonPlaceholder="Why is the status changing?" [busy]="busy()"
      (confirmed)="applyStatus($event)" />

    <vc-modal [(open)]="projectOpen" title="New project" subtitle="The methodology and crediting period decide how credits are calculated." width="620px">
      <form class="form-grid" id="proj-form" (ngSubmit)="createProject()">
        <div class="field">
          <label for="jc">Code</label>
          <input id="jc" class="input mono" name="code" [(ngModel)]="pf.code" placeholder="KA-REGEN-01" [class.invalid]="fe()['code']" />
          @if (fe()['code']) { <span class="error">{{ fe()['code'] }}</span> }
        </div>
        <div class="field">
          <label for="jn">Name</label>
          <input id="jn" class="input" name="name" [(ngModel)]="pf.name" placeholder="Hassan cohort 2026" [class.invalid]="fe()['name']" />
          @if (fe()['name']) { <span class="error">{{ fe()['name'] }}</span> }
        </div>
        <div class="field">
          <label for="jm">Methodology code</label>
          <input id="jm" class="input mono" name="mc" [(ngModel)]="pf.methodology_code" />
          <span class="hint">For example VM0042 (Verra improved agricultural land management).</span>
        </div>
        <div class="field">
          <label for="jv">Methodology version</label>
          <input id="jv" class="input mono" name="mv" [(ngModel)]="pf.methodology_version" />
        </div>
        <div class="field span-2">
          <label for="jr">Rule pack <span class="subtle">(optional)</span></label>
          <select id="jr" class="input" name="rp" [(ngModel)]="pf.rule_pack_id">
            <option value="">Assign later</option>
            @for (r of packs(); track r.id) {
              <option [value]="r.id">{{ r.methodology_code }} v{{ r.methodology_version }} rev {{ r.revision }} \xB7 {{ r.title }} ({{ r.status | human }})</option>
            }
          </select>
          <span class="hint">The rule pack holds the approved methodology parameters. Calculations need an approved one.</span>
        </div>
        <div class="field">
          <label for="jb">Baseline start</label>
          <input id="jb" class="input" type="date" name="bs" [(ngModel)]="pf.baseline_start" />
        </div>
        <div class="field"></div>
        <div class="field">
          <label for="jcs">Crediting start</label>
          <input id="jcs" class="input" type="date" name="cs" [(ngModel)]="pf.crediting_start" />
        </div>
        <div class="field">
          <label for="jce">Crediting end</label>
          <input id="jce" class="input" type="date" name="ce" [(ngModel)]="pf.crediting_end"
            [class.invalid]="pf.crediting_start && pf.crediting_end && pf.crediting_end < pf.crediting_start" />
          @if (pf.crediting_start && pf.crediting_end && pf.crediting_end < pf.crediting_start) {
            <span class="error">The crediting period can't end before it starts.</span>
          }
        </div>
        @if (projError()) { <div class="span-2"><vc-error title="Couldn't create the project" [message]="projError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="projectOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="proj-form" [disabled]="busy() || !pf.code || !pf.name">
          {{ busy() ? 'Creating\u2026' : 'Create project' }}
        </button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;6e0ae66c4603f816;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\programmes\\programme-detail.page.ts */\n.hacts {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n  margin-bottom: 14px;\n}\n.back:hover {\n  color: var(--forest-700);\n  text-decoration: none;\n}\n.stats {\n  margin-bottom: 16px;\n}\n.crops {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.crop {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 30px;\n  padding: 0 10px;\n  border-radius: 7px;\n  background: var(--forest-50);\n  border: 1px solid var(--forest-100);\n  color: var(--forest-800);\n  font-size: 13px;\n}\n.crop code {\n  font-size: 11px;\n  color: var(--forest-500);\n}\n.note {\n  margin-top: 14px;\n}\n.pname {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n/*# sourceMappingURL=programme-detail.page.css.map */\n"] }]
  }], null, { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProgrammeDetailPage, { className: "ProgrammeDetailPage", filePath: "src/app/features/programmes/programme-detail.page.ts", lineNumber: 197 });
})();

// src/app/features/programmes/programmes.page.ts
var _c0 = (a0) => [a0];
var _forTrack02 = ($index, $item) => $item.key;
var _forTrack12 = ($index, $item) => $item.code;
var _forTrack2 = ($index, $item) => $item.id;
function ProgrammesPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function ProgrammesPage_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 40);
    \u0275\u0275text(2, "New programme");
    \u0275\u0275elementEnd();
  }
}
function ProgrammesPage_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function ProgrammesPage_For_8_Template_button_click_0_listener() {
      const s_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.status.set(s_r4.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 42);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.status() === s_r4.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", s_r4.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.count(s_r4.key));
  }
}
function ProgrammesPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "vc-loading", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 5);
  }
}
function ProgrammesPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-error", 8)(1, "button", 44);
    \u0275\u0275listener("click", function ProgrammesPage_Conditional_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.load());
    });
    \u0275\u0275text(2, "Try again");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function ProgrammesPage_Conditional_11_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function ProgrammesPage_Conditional_11_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 40);
    \u0275\u0275text(2, "New programme");
    \u0275\u0275elementEnd();
  }
}
function ProgrammesPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "vc-empty", 45);
    \u0275\u0275conditionalCreate(2, ProgrammesPage_Conditional_11_Conditional_2_Template, 3, 0, "button", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canManage ? 2 : -1);
  }
}
function ProgrammesPage_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "vc-empty", 48);
    \u0275\u0275elementEnd();
  }
}
function ProgrammesPage_Conditional_13_For_2_Conditional_32_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 61);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.cropName(c_r7));
  }
}
function ProgrammesPage_Conditional_13_For_2_Conditional_32_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 62);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+", p_r8.eligible_crops.length - 3);
  }
}
function ProgrammesPage_Conditional_13_For_2_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ProgrammesPage_Conditional_13_For_2_Conditional_32_For_1_Template, 2, 1, "span", 61, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(2, ProgrammesPage_Conditional_13_For_2_Conditional_32_Conditional_2_Template, 2, 1, "span", 62);
  }
  if (rf & 2) {
    const p_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275repeater(p_r8.eligible_crops.slice(0, 3));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r8.eligible_crops.length > 3 ? 2 : -1);
  }
}
function ProgrammesPage_Conditional_13_For_2_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1, "All crops eligible");
    \u0275\u0275elementEnd();
  }
}
function ProgrammesPage_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 49)(1, "div", 50)(2, "span", 51);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "vc-badge", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h3");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 53);
    \u0275\u0275element(8, "vc-icon", 54);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 55)(11, "div")(12, "span", 56);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 57);
    \u0275\u0275text(15, "Projects");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "span", 56);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 57);
    \u0275\u0275text(21, "Farmers");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div")(23, "span", 56);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "num");
    \u0275\u0275elementStart(26, "small");
    \u0275\u0275text(27, "ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "span", 57);
    \u0275\u0275text(29, "Enrolled");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 58)(31, "span", 59);
    \u0275\u0275conditionalCreate(32, ProgrammesPage_Conditional_13_For_2_Conditional_32_Template, 3, 1)(33, ProgrammesPage_Conditional_13_For_2_Conditional_33_Template, 2, 0, "span", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 60);
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "day");
    \u0275\u0275pipe(37, "day");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r8 = ctx.$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(22, _c0, p_r8.id));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r8.code);
    \u0275\u0275advance();
    \u0275\u0275property("status", p_r8.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r8.name);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r8.region || "No region set");
    const s_r9 = \u0275\u0275nextContext(2).summaries()[p_r8.id];
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r9 ? s_r9.projects : "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(s_r9 ? \u0275\u0275pipeBind2(19, 12, s_r9.farmers_enrolled, 0) : "\u2014");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(s_r9 ? \u0275\u0275pipeBind2(25, 15, s_r9.hectares_enrolled, 1) : "\u2014");
    \u0275\u0275advance(8);
    \u0275\u0275conditional(p_r8.eligible_crops.length ? 32 : 33);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(36, 18, p_r8.start_date), " \u2013 ", p_r8.end_date ? \u0275\u0275pipeBind1(37, 20, p_r8.end_date) : "open");
  }
}
function ProgrammesPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275repeaterCreate(1, ProgrammesPage_Conditional_13_For_2_Template, 38, 24, "a", 49, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.rows());
  }
}
function ProgrammesPage_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fieldErr("code"));
  }
}
function ProgrammesPage_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1, "Letters, numbers, - and _. 2\u201340 characters.");
    \u0275\u0275elementEnd();
  }
}
function ProgrammesPage_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fieldErr("name"));
  }
}
function ProgrammesPage_For_36_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 64);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 13);
  }
}
function ProgrammesPage_For_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 63);
    \u0275\u0275listener("click", function ProgrammesPage_For_36_Template_button_click_0_listener() {
      const c_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleCrop(c_r11.code));
    });
    \u0275\u0275conditionalCreate(1, ProgrammesPage_For_36_Conditional_1_Template, 1, 1, "vc-icon", 64);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.form.crops.includes(c_r11.code));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.form.crops.includes(c_r11.code) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", c_r11.name, " ");
  }
}
function ProgrammesPage_ForEmpty_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1, "No crops in the catalogue yet. Add them under Crops & practices catalogue.");
    \u0275\u0275elementEnd();
  }
}
function ProgrammesPage_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1, "The end date can't be before the start date.");
    \u0275\u0275elementEnd();
  }
}
function ProgrammesPage_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275element(1, "vc-error", 65);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
var blank = () => ({
  code: "",
  name: "",
  region: "",
  description: "",
  start_date: "",
  end_date: "",
  lookback_years: 10,
  crops: []
});
var ProgrammesPage = class _ProgrammesPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  router = inject(Router);
  canManage = inject(AuthService).can("programmes.manage");
  all = signal(
    [],
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  summaries = signal(
    {},
    ...ngDevMode ? [{ debugName: "summaries" }] : (
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
  status = signal(
    "all",
    ...ngDevMode ? [{ debugName: "status" }] : (
      /* istanbul ignore next */
      []
    )
  );
  statusTabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "draft", label: "Draft" },
    { key: "suspended", label: "Suspended" },
    { key: "closed", label: "Closed" }
  ];
  rows = computed(
    () => this.status() === "all" ? this.all() : this.all().filter((p) => p.status === this.status()),
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropMap = computed(
    () => new Map(this.crops().map((c) => [c.code, c.name])),
    ...ngDevMode ? [{ debugName: "cropMap" }] : (
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
  saving = signal(
    false,
    ...ngDevMode ? [{ debugName: "saving" }] : (
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
  fieldErrors = signal(
    {},
    ...ngDevMode ? [{ debugName: "fieldErrors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  form = blank();
  constructor() {
    this.load();
    this.api.get("/catalogue/crops").subscribe({ next: (c) => this.crops.set(c), error: () => {
    } });
  }
  count(key) {
    return key === "all" ? this.all().length : this.all().filter((p) => p.status === key).length;
  }
  cropName(code) {
    return this.cropMap().get(code) ?? code;
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get("/programmes").subscribe({
      next: (list) => {
        this.all.set(list);
        this.loading.set(false);
        if (!list.length)
          return;
        forkJoin(list.map((p) => this.api.get(`/programmes/${p.id}/summary`).pipe(catchError(() => of(null))))).subscribe((res) => {
          const m = {};
          res.forEach((s, i) => {
            if (s)
              m[list[i].id] = s;
          });
          this.summaries.set(m);
        });
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  openCreate() {
    this.form = blank();
    this.formError.set(null);
    this.fieldErrors.set({});
    this.createOpen.set(true);
  }
  toggleCrop(code) {
    const c = this.form.crops;
    this.form.crops = c.includes(code) ? c.filter((x) => x !== code) : [...c, code];
  }
  dateErr() {
    return !!(this.form.start_date && this.form.end_date && this.form.end_date < this.form.start_date);
  }
  fieldErr(name) {
    return this.fieldErrors()[name];
  }
  create() {
    const f = this.form;
    this.saving.set(true);
    this.formError.set(null);
    this.fieldErrors.set({});
    const terms = {};
    if (f.lookback_years)
      terms["lookback_years"] = Number(f.lookback_years);
    this.api.post("/programmes", {
      code: f.code.trim(),
      name: f.name.trim(),
      region: f.region.trim(),
      description: f.description.trim() || null,
      eligible_crops: f.crops,
      start_date: f.start_date || null,
      end_date: f.end_date || null,
      commercial_terms: terms
    }).subscribe({
      next: (p) => {
        this.saving.set(false);
        this.createOpen.set(false);
        this.toast.success("Programme created", `${p.code} \xB7 ${p.name} is in draft. Activate it when ready.`);
        this.router.navigate(["/app/programmes", p.id]);
      },
      error: (e) => {
        this.saving.set(false);
        const m = fieldMap(e);
        this.fieldErrors.set(m);
        this.formError.set(formMessage(e, m));
      }
    });
  }
  static \u0275fac = function ProgrammesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProgrammesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProgrammesPage, selectors: [["vc-programmes-page"]], decls: 72, vars: 23, consts: [["title", "Programmes & projects", "eyebrow", "Programmes", "subtitle", "A programme sets the region, eligible crops and commercial terms. Projects inside it follow one methodology and crediting period."], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], ["actions", "", 1, "btn", "btn-primary"], [1, "filters"], ["role", "tablist", 1, "seg"], ["type", "button", 3, "on"], [1, "card"], ["title", "Couldn't load programmes", 3, "message"], [1, "cards"], ["title", "New programme", "subtitle", "You can change the name, region and terms later. The code is permanent.", "width", "640px", 3, "openChange", "open"], ["id", "prog-form", 1, "form-grid", 3, "ngSubmit"], [1, "field"], ["for", "pc"], ["id", "pc", "name", "code", "placeholder", "KA-REGEN", "required", "", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "error"], [1, "hint"], ["for", "pn"], ["id", "pn", "name", "name", "placeholder", "Karnataka Regenerative Soils", "required", "", 1, "input", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], ["for", "pr"], ["id", "pr", "name", "region", "placeholder", "Chikkamagaluru and Hassan districts, Karnataka", 1, "input", 3, "ngModelChange", "ngModel"], [1, "croppick"], ["type", "button", 1, "pick", 3, "on"], [1, "subtle", "small"], ["for", "psd"], ["id", "psd", "type", "date", "name", "start_date", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "ped"], [1, "subtle"], ["id", "ped", "type", "date", "name", "end_date", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "plb"], [1, "suffix"], ["id", "plb", "type", "number", "min", "1", "max", "30", "name", "lookback", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "pdsc"], ["id", "pdsc", "name", "description", "rows", "3", "placeholder", "Who the programme is for and what it pays for.", 1, "input", 3, "ngModelChange", "ngModel"], [1, "span-2"], ["footer", ""], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "submit", "form", "prog-form", 1, "btn", "btn-primary", 3, "disabled"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["type", "button", 3, "click"], [1, "c", "num"], [3, "rows"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["icon", "briefcase", "title", "Start by creating a programme", "text", "A programme groups the farmers, fields and projects in one region under shared terms. You can add projects once it exists."], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], ["icon", "filter", "title", "No programmes with this status", "text", "Choose another status to see more."], [1, "pcard", "card", 3, "routerLink"], [1, "top"], [1, "code", "mono"], [3, "status"], [1, "region"], ["name", "pin", 3, "size"], [1, "nums"], [1, "v", "num"], [1, "l"], [1, "foot"], [1, "crops"], [1, "dates", "small", "subtle"], [1, "chip"], [1, "chip", "more"], ["type", "button", 1, "pick", 3, "click"], ["name", "check", 3, "size"], ["title", "Couldn't create the programme", 3, "message"]], template: function ProgrammesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "button", 1);
      \u0275\u0275listener("click", function ProgrammesPage_Template_button_click_1_listener() {
        return ctx.load();
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, ProgrammesPage_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "div", 5);
      \u0275\u0275repeaterCreate(7, ProgrammesPage_For_8_Template, 4, 4, "button", 6, _forTrack02);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(9, ProgrammesPage_Conditional_9_Template, 2, 1, "div", 7)(10, ProgrammesPage_Conditional_10_Template, 3, 1, "vc-error", 8)(11, ProgrammesPage_Conditional_11_Template, 3, 1, "div", 7)(12, ProgrammesPage_Conditional_12_Template, 2, 0, "div", 7)(13, ProgrammesPage_Conditional_13_Template, 3, 0, "div", 9);
      \u0275\u0275elementStart(14, "vc-modal", 10);
      \u0275\u0275twoWayListener("openChange", function ProgrammesPage_Template_vc_modal_openChange_14_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(15, "form", 11);
      \u0275\u0275listener("ngSubmit", function ProgrammesPage_Template_form_ngSubmit_15_listener() {
        return ctx.create();
      });
      \u0275\u0275elementStart(16, "div", 12)(17, "label", 13);
      \u0275\u0275text(18, "Code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "input", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammesPage_Template_input_ngModelChange_19_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.code, $event) || (ctx.form.code = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(20, ProgrammesPage_Conditional_20_Template, 2, 1, "span", 15)(21, ProgrammesPage_Conditional_21_Template, 2, 0, "span", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 12)(23, "label", 17);
      \u0275\u0275text(24, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "input", 18);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammesPage_Template_input_ngModelChange_25_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.name, $event) || (ctx.form.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(26, ProgrammesPage_Conditional_26_Template, 2, 1, "span", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 19)(28, "label", 20);
      \u0275\u0275text(29, "Region");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "input", 21);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammesPage_Template_input_ngModelChange_30_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.region, $event) || (ctx.form.region = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div", 19)(32, "label");
      \u0275\u0275text(33, "Eligible crops");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 22);
      \u0275\u0275repeaterCreate(35, ProgrammesPage_For_36_Template, 3, 4, "button", 23, _forTrack12, false, ProgrammesPage_ForEmpty_37_Template, 2, 0, "span", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "span", 16);
      \u0275\u0275text(39, "Leave empty to accept every crop. Fields with other crops fail the eligibility check.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "div", 12)(41, "label", 25);
      \u0275\u0275text(42, "Start date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "input", 26);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammesPage_Template_input_ngModelChange_43_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.start_date, $event) || (ctx.form.start_date = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 12)(45, "label", 27);
      \u0275\u0275text(46, "End date ");
      \u0275\u0275elementStart(47, "span", 28);
      \u0275\u0275text(48, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "input", 29);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammesPage_Template_input_ngModelChange_49_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.end_date, $event) || (ctx.form.end_date = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(50, ProgrammesPage_Conditional_50_Template, 2, 0, "span", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "div", 12)(52, "label", 30);
      \u0275\u0275text(53, "Land-use look-back");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "div", 31)(55, "input", 32);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammesPage_Template_input_ngModelChange_55_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.lookback_years, $event) || (ctx.form.lookback_years = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "span");
      \u0275\u0275text(57, "years");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "span", 16);
      \u0275\u0275text(59, "Fields must show no forest or wetland conversion in this window.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "div", 19)(61, "label", 33);
      \u0275\u0275text(62, "Description ");
      \u0275\u0275elementStart(63, "span", 28);
      \u0275\u0275text(64, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(65, "textarea", 34);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ProgrammesPage_Template_textarea_ngModelChange_65_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.description, $event) || (ctx.form.description = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(66, ProgrammesPage_Conditional_66_Template, 2, 1, "div", 35);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(67, 36);
      \u0275\u0275elementStart(68, "button", 37);
      \u0275\u0275listener("click", function ProgrammesPage_Template_button_click_68_listener() {
        return ctx.createOpen.set(false);
      });
      \u0275\u0275text(69, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "button", 38);
      \u0275\u0275text(71);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canManage ? 4 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.statusTabs);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 9 : ctx.error() ? 10 : !ctx.all().length ? 11 : !ctx.rows().length ? 12 : 13);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("invalid", ctx.fieldErr("code"));
      \u0275\u0275twoWayProperty("ngModel", ctx.form.code);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fieldErr("code") ? 20 : 21);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("invalid", ctx.fieldErr("name"));
      \u0275\u0275twoWayProperty("ngModel", ctx.form.name);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fieldErr("name") ? 26 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.region);
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.crops());
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.start_date);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275classProp("invalid", ctx.dateErr());
      \u0275\u0275twoWayProperty("ngModel", ctx.form.end_date);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.dateErr() ? 50 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.lookback_years);
      \u0275\u0275control();
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.description);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formError() ? 66 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving() || !ctx.form.code || !ctx.form.name || ctx.dateErr());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.saving() ? "Creating\u2026" : "Create programme", " ");
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinValidator, MaxValidator, NgModel, NgForm, RouterLink, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Icon, NumPipe, DayPipe], styles: ["\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  padding: 3px;\n  gap: 2px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 9px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  background: none;\n  border-radius: 6px;\n  font: 500 13px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%stone-900);\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-200);\n}\n.seg[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.cards[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));\n  gap: 16px;\n}\n.pcard[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 18px 20px 16px;\n  color: inherit;\n  text-decoration: none !important;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.pcard[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%forest-300);\n  box-shadow: var(--%NS%shadow);\n}\n.top[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  letter-spacing: 0.02em;\n}\n.pcard[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 16px;\n  margin-top: 2px;\n}\n.region[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--%NS%text-2);\n  font-size: 13px;\n}\n.region[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.nums[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  margin: 12px 0 4px;\n  padding: 12px 0;\n  border-top: 1px solid var(--%NS%stone-100);\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.nums[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.nums[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]    + div[_ngcontent-%COMP%] {\n  padding-left: 14px;\n  border-left: 1px solid var(--%NS%stone-100);\n}\n.v[_ngcontent-%COMP%] {\n  font-size: 19px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n  color: var(--%NS%stone-900);\n}\n.v[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--%NS%text-3);\n  margin-left: 3px;\n}\n.l[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.foot[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  margin-top: 6px;\n}\n.crops[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  min-width: 0;\n}\n.chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  height: 22px;\n  padding: 0 8px;\n  border-radius: 5px;\n  background: var(--%NS%sand-100);\n  border: 1px solid var(--%NS%border);\n  font-size: 12px;\n  color: var(--%NS%stone-700);\n}\n.chip.more[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.dates[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.croppick[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.pick[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  height: 30px;\n  padding: 0 11px;\n  border-radius: 999px;\n  border: 1px solid var(--%NS%border-strong);\n  background: var(--%NS%surface);\n  font: 500 13px var(--%NS%font);\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.pick[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.pick.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  border-color: var(--%NS%forest-400);\n  color: var(--%NS%forest-700);\n}\n.suffix[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.suffix[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  width: 100px;\n}\n.suffix[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--%NS%text-2);\n  font-size: 13px;\n}\n/*# sourceMappingURL=programmes.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgrammesPage, [{
    type: Component,
    args: [{ selector: "vc-programmes-page", imports: [FormsModule, RouterLink, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Icon, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Programmes & projects" eyebrow="Programmes"
      subtitle="A programme sets the region, eligible crops and commercial terms. Projects inside it follow one methodology and crediting period.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (canManage) {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New programme</button>
      }
    </vc-page-header>

    <div class="filters">
      <div class="seg" role="tablist">
        @for (s of statusTabs; track s.key) {
          <button type="button" [class.on]="status() === s.key" (click)="status.set(s.key)">
            {{ s.label }} <span class="c num">{{ count(s.key) }}</span>
          </button>
        }
      </div>
    </div>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="5" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load programmes" [message]="error()!">
        <button class="btn btn-secondary btn-sm" (click)="load()">Try again</button>
      </vc-error>
    } @else if (!all().length) {
      <div class="card">
        <vc-empty icon="briefcase" title="Start by creating a programme"
          text="A programme groups the farmers, fields and projects in one region under shared terms. You can add projects once it exists.">
          @if (canManage) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New programme</button> }
        </vc-empty>
      </div>
    } @else if (!rows().length) {
      <div class="card"><vc-empty icon="filter" title="No programmes with this status" text="Choose another status to see more." /></div>
    } @else {
      <div class="cards">
        @for (p of rows(); track p.id) {
          <a class="pcard card" [routerLink]="[p.id]">
            <div class="top">
              <span class="code mono">{{ p.code }}</span>
              <vc-badge [status]="p.status" />
            </div>
            <h3>{{ p.name }}</h3>
            <p class="region"><vc-icon name="pin" [size]="14" />{{ p.region || 'No region set' }}</p>
            <div class="nums">
              @let s = summaries()[p.id];
              <div><span class="v num">{{ s ? s.projects : '\u2014' }}</span><span class="l">Projects</span></div>
              <div><span class="v num">{{ s ? (s.farmers_enrolled | num: 0) : '\u2014' }}</span><span class="l">Farmers</span></div>
              <div><span class="v num">{{ s ? (s.hectares_enrolled | num: 1) : '\u2014' }}<small>ha</small></span><span class="l">Enrolled</span></div>
            </div>
            <div class="foot">
              <span class="crops">
                @if (p.eligible_crops.length) {
                  @for (c of p.eligible_crops.slice(0, 3); track c) { <span class="chip">{{ cropName(c) }}</span> }
                  @if (p.eligible_crops.length > 3) { <span class="chip more">+{{ p.eligible_crops.length - 3 }}</span> }
                } @else { <span class="subtle small">All crops eligible</span> }
              </span>
              <span class="dates small subtle">{{ p.start_date | day }} \u2013 {{ p.end_date ? (p.end_date | day) : 'open' }}</span>
            </div>
          </a>
        }
      </div>
    }

    <vc-modal [(open)]="createOpen" title="New programme" subtitle="You can change the name, region and terms later. The code is permanent." width="640px">
      <form class="form-grid" (ngSubmit)="create()" id="prog-form">
        <div class="field">
          <label for="pc">Code</label>
          <input id="pc" class="input mono" name="code" [(ngModel)]="form.code" placeholder="KA-REGEN" required
            [class.invalid]="fieldErr('code')" />
          @if (fieldErr('code')) { <span class="error">{{ fieldErr('code') }}</span> }
          @else { <span class="hint">Letters, numbers, - and _. 2\u201340 characters.</span> }
        </div>
        <div class="field">
          <label for="pn">Name</label>
          <input id="pn" class="input" name="name" [(ngModel)]="form.name" placeholder="Karnataka Regenerative Soils" required
            [class.invalid]="fieldErr('name')" />
          @if (fieldErr('name')) { <span class="error">{{ fieldErr('name') }}</span> }
        </div>
        <div class="field span-2">
          <label for="pr">Region</label>
          <input id="pr" class="input" name="region" [(ngModel)]="form.region" placeholder="Chikkamagaluru and Hassan districts, Karnataka" />
        </div>
        <div class="field span-2">
          <label>Eligible crops</label>
          <div class="croppick">
            @for (c of crops(); track c.code) {
              <button type="button" class="pick" [class.on]="form.crops.includes(c.code)" (click)="toggleCrop(c.code)">
                @if (form.crops.includes(c.code)) { <vc-icon name="check" [size]="13" /> }
                {{ c.name }}
              </button>
            } @empty { <span class="subtle small">No crops in the catalogue yet. Add them under Crops & practices catalogue.</span> }
          </div>
          <span class="hint">Leave empty to accept every crop. Fields with other crops fail the eligibility check.</span>
        </div>
        <div class="field">
          <label for="psd">Start date</label>
          <input id="psd" class="input" type="date" name="start_date" [(ngModel)]="form.start_date" />
        </div>
        <div class="field">
          <label for="ped">End date <span class="subtle">(optional)</span></label>
          <input id="ped" class="input" type="date" name="end_date" [(ngModel)]="form.end_date" [class.invalid]="dateErr()" />
          @if (dateErr()) { <span class="error">The end date can't be before the start date.</span> }
        </div>
        <div class="field">
          <label for="plb">Land-use look-back</label>
          <div class="suffix">
            <input id="plb" class="input num" type="number" min="1" max="30" name="lookback" [(ngModel)]="form.lookback_years" />
            <span>years</span>
          </div>
          <span class="hint">Fields must show no forest or wetland conversion in this window.</span>
        </div>
        <div class="field span-2">
          <label for="pdsc">Description <span class="subtle">(optional)</span></label>
          <textarea id="pdsc" class="input" name="description" rows="3" [(ngModel)]="form.description"
            placeholder="Who the programme is for and what it pays for."></textarea>
        </div>
        @if (formError()) { <div class="span-2"><vc-error title="Couldn't create the programme" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="prog-form" [disabled]="saving() || !form.code || !form.name || dateErr()">
          {{ saving() ? 'Creating\u2026' : 'Create programme' }}
        </button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;76bb86dcb6db14ac;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\programmes\\programmes.page.ts */\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.seg {\n  display: inline-flex;\n  padding: 3px;\n  gap: 2px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 9px;\n}\n.seg button {\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  background: none;\n  border-radius: 6px;\n  font: 500 13px var(--font);\n  color: var(--stone-600);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.seg button:hover {\n  color: var(--stone-900);\n}\n.seg button.on {\n  background: var(--forest-50);\n  color: var(--forest-700);\n  box-shadow: inset 0 0 0 1px var(--forest-200);\n}\n.seg .c {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));\n  gap: 16px;\n}\n.pcard {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 18px 20px 16px;\n  color: inherit;\n  text-decoration: none !important;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.pcard:hover {\n  border-color: var(--forest-300);\n  box-shadow: var(--shadow);\n}\n.top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.code {\n  font-size: 12px;\n  color: var(--text-3);\n  letter-spacing: 0.02em;\n}\n.pcard h3 {\n  font-size: 16px;\n  margin-top: 2px;\n}\n.region {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--text-2);\n  font-size: 13px;\n}\n.region vc-icon {\n  color: var(--text-3);\n}\n.nums {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  margin: 12px 0 4px;\n  padding: 12px 0;\n  border-top: 1px solid var(--stone-100);\n  border-bottom: 1px solid var(--stone-100);\n}\n.nums div {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.nums div + div {\n  padding-left: 14px;\n  border-left: 1px solid var(--stone-100);\n}\n.v {\n  font-size: 19px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n  color: var(--stone-900);\n}\n.v small {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--text-3);\n  margin-left: 3px;\n}\n.l {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.foot {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  margin-top: 6px;\n}\n.crops {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  min-width: 0;\n}\n.chip {\n  display: inline-flex;\n  align-items: center;\n  height: 22px;\n  padding: 0 8px;\n  border-radius: 5px;\n  background: var(--sand-100);\n  border: 1px solid var(--border);\n  font-size: 12px;\n  color: var(--stone-700);\n}\n.chip.more {\n  color: var(--text-3);\n}\n.dates {\n  white-space: nowrap;\n}\n.croppick {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.pick {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  height: 30px;\n  padding: 0 11px;\n  border-radius: 999px;\n  border: 1px solid var(--border-strong);\n  background: var(--surface);\n  font: 500 13px var(--font);\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.pick:hover {\n  border-color: var(--stone-400);\n}\n.pick.on {\n  background: var(--forest-50);\n  border-color: var(--forest-400);\n  color: var(--forest-700);\n}\n.suffix {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.suffix .input {\n  width: 100px;\n}\n.suffix span {\n  color: var(--text-2);\n  font-size: 13px;\n}\n/*# sourceMappingURL=programmes.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProgrammesPage, { className: "ProgrammesPage", filePath: "src/app/features/programmes/programmes.page.ts", lineNumber: 190 });
})();

// src/app/features/programmes/project-detail.page.ts
var _forTrack03 = ($index, $item) => $item.code;
function Checks_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "span", 3);
    \u0275\u0275element(2, "vc-icon", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const c_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("bad", !c_r1.passed);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", c_r1.passed ? "check" : "x")("size", 13)("stroke", 2.4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.label(c_r1.code));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r1.message);
  }
}
function Checks_ForEmpty_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 1);
    \u0275\u0275text(1, "No eligibility checks recorded.");
    \u0275\u0275elementEnd();
  }
}
var _c02 = (a0) => ["/app/programmes", a0];
var _c1 = (a0) => ["/app/fields", a0];
var _c2 = (a0) => ["/app/farmers", a0];
var _c3 = () => [];
var _forTrack13 = ($index, $item) => $item.to;
var _forTrack22 = ($index, $item) => $item.id;
function ProjectDetailPage_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 0);
    \u0275\u0275element(1, "vc-icon", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const prog_r1 = ctx;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(3, _c02, prog_r1.id));
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(prog_r1.name);
  }
}
function ProjectDetailPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 1);
    \u0275\u0275element(1, "vc-icon", 10);
    \u0275\u0275text(2, "Programmes");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function ProjectDetailPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-loading", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function ProjectDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function ProjectDetailPage_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const p_r4 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.ctx.select(p_r4.id));
    });
    \u0275\u0275element(1, "vc-icon", 37);
    \u0275\u0275text(2, "Work on this project");
    \u0275\u0275elementEnd();
  }
}
function ProjectDetailPage_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275element(1, "vc-icon", 38);
    \u0275\u0275text(2, "Current project");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_5_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 40);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_5_For_1_Template_button_click_0_listener() {
      const t_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.askStatus(t_r6));
    });
    \u0275\u0275element(1, "vc-icon", 41);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r6 = ctx.$implicit;
    \u0275\u0275classProp("btn-primary", t_r6.tone === "primary")("btn-secondary", t_r6.tone === "danger");
    \u0275\u0275advance();
    \u0275\u0275property("name", t_r6.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r6.label);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ProjectDetailPage_Conditional_4_Conditional_5_For_1_Template, 3, 6, "button", 39, _forTrack13);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.transitions());
  }
}
function ProjectDetailPage_Conditional_4_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const prog_r7 = ctx;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(2, _c02, prog_r7.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(prog_r7.name);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2014 ");
  }
}
function ProjectDetailPage_Conditional_4_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 42)(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "vc-badge", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rp_r8 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(rp_r8.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("rev ", rp_r8.revision);
    \u0275\u0275advance();
    \u0275\u0275property("status", rp_r8.status);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 24);
    \u0275\u0275text(1, "View rule pack");
    \u0275\u0275elementEnd();
  }
}
function ProjectDetailPage_Conditional_4_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 44);
    \u0275\u0275text(1, "Not assigned");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "a", 45);
    \u0275\u0275text(3, "Choose in Methodology");
    \u0275\u0275elementEnd();
  }
}
function ProjectDetailPage_Conditional_4_For_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 46);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_For_56_Template_button_click_0_listener() {
      const s_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.filter.set(s_r10));
    });
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.filter() === s_r10);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r10 === "all" ? "All" : \u0275\u0275pipeBind1(2, 3, s_r10));
  }
}
function ProjectDetailPage_Conditional_4_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_57_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openEnrol());
    });
    \u0275\u0275element(1, "vc-icon", 48);
    \u0275\u0275text(2, "Enrol a field");
    \u0275\u0275elementEnd();
  }
}
function ProjectDetailPage_Conditional_4_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 11);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "vc-error", 49);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.enrolError());
  }
}
function ProjectDetailPage_Conditional_4_Conditional_60_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 51);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_60_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openEnrol());
    });
    \u0275\u0275element(1, "vc-icon", 48);
    \u0275\u0275text(2, "Enrol a field");
    \u0275\u0275elementEnd();
  }
}
function ProjectDetailPage_Conditional_4_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 33);
    \u0275\u0275conditionalCreate(1, ProjectDetailPage_Conditional_4_Conditional_60_Conditional_1_Template, 3, 0, "button", 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canEnrol && p_r4.status !== "closed" ? 1 : -1);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 34);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const e_r14 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.askConfirm(e_r14));
    });
    \u0275\u0275text(1, "Confirm");
    \u0275\u0275elementEnd();
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 66);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const e_r14 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.recheck(e_r14));
    });
    \u0275\u0275element(1, "vc-icon", 67);
    \u0275\u0275text(2, "Re-check");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275property("disabled", ctx_r1.busy());
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 68);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const e_r14 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.askWithdraw(e_r14));
    });
    \u0275\u0275text(1, "Withdraw");
    \u0275\u0275elementEnd();
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_0_Template, 2, 0, "button", 32);
    \u0275\u0275conditionalCreate(1, ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_1_Template, 3, 2, "button", 64);
    \u0275\u0275conditionalCreate(2, ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Conditional_2_Template, 2, 0, "button", 65);
  }
  if (rf & 2) {
    const e_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(e_r14.status === "eligible" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(e_r14.status === "ineligible" || e_r14.status === "pending" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(e_r14.status === "enrolled" || e_r14.status === "eligible" ? 2 : -1);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_22_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 72);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r14 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Checked ", \u0275\u0275pipeBind2(2, 1, e_r14.eligibility.decided_at, true));
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_22_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 75);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r18 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Withdrawn on ", \u0275\u0275pipeBind1(2, 2, w_r18.on), ": ", w_r18.reason);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 63);
    \u0275\u0275element(1, "td");
    \u0275\u0275elementStart(2, "td", 69)(3, "div", 70)(4, "div", 71)(5, "span");
    \u0275\u0275text(6, "Eligibility checks");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_22_Conditional_7_Template, 3, 4, "span", 72);
    \u0275\u0275element(8, "vc-dc", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "vc-checks", 74);
    \u0275\u0275conditionalCreate(10, ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_22_Conditional_10_Template, 3, 4, "vc-callout", 75);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_17_0;
    const e_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(7);
    \u0275\u0275conditional(e_r14.eligibility.decided_at ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("checks", e_r14.eligibility.checks ?? \u0275\u0275pureFunction0(3, _c3));
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_17_0 = e_r14.eligibility.withdrawal) ? 10 : -1, tmp_17_0);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 55);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Template_tr_click_0_listener() {
      const e_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggle(e_r14.id));
    });
    \u0275\u0275elementStart(1, "td");
    \u0275\u0275element(2, "vc-icon", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "a", 57);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Template_a_click_4_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td")(7, "a", 58);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Template_a_click_7_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td", 59);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td")(13, "span", 60);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275element(16, "vc-badge", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 61);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 62);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_4_Conditional_62_For_20_Template_td_click_20_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275conditionalCreate(21, ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_21_Template, 3, 3);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(22, ProjectDetailPage_Conditional_4_Conditional_62_For_20_Conditional_22_Template, 11, 4, "tr", 63);
  }
  if (rf & 2) {
    const e_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r1.open() === e_r14.id ? "chevron-down" : "chevron-right")("size", 15);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(20, _c1, e_r14.field_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r14.field_code);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(22, _c2, e_r14.farmer_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r14.farmer_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(11, 15, e_r14.field_area_ha, 2), " ha");
    const c_r19 = ctx_r1.checkCount(e_r14);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("bad", c_r19.failed > 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", c_r19.passed, "/", c_r19.total, " passed");
    \u0275\u0275advance(2);
    \u0275\u0275property("status", e_r14.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 18, e_r14.enrolled_on));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.canEnrol ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.open() === e_r14.id ? 22 : -1);
  }
}
function ProjectDetailPage_Conditional_4_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "table", 52)(2, "thead")(3, "tr");
    \u0275\u0275element(4, "th", 53);
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Farmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 54);
    \u0275\u0275text(10, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Checks");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Enrolled");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, ProjectDetailPage_Conditional_4_Conditional_62_For_20_Template, 23, 24, null, null, _forTrack22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r1.shown());
  }
}
function ProjectDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-page-header", 12)(1, "div", 13);
    \u0275\u0275element(2, "vc-badge", 14);
    \u0275\u0275conditionalCreate(3, ProjectDetailPage_Conditional_4_Conditional_3_Template, 3, 0, "button", 15)(4, ProjectDetailPage_Conditional_4_Conditional_4_Template, 3, 1, "span", 16);
    \u0275\u0275conditionalCreate(5, ProjectDetailPage_Conditional_4_Conditional_5_Template, 2, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 17)(7, "section", 18)(8, "div", 19)(9, "h3");
    \u0275\u0275text(10, "Key facts");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 20)(12, "dl", 21)(13, "dt");
    \u0275\u0275text(14, "Programme");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "dd");
    \u0275\u0275conditionalCreate(16, ProjectDetailPage_Conditional_4_Conditional_16_Template, 2, 4, "a", 22)(17, ProjectDetailPage_Conditional_4_Conditional_17_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dt");
    \u0275\u0275text(19, "Methodology");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dd", 23);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dt");
    \u0275\u0275text(23, "Rule pack");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dd");
    \u0275\u0275conditionalCreate(25, ProjectDetailPage_Conditional_4_Conditional_25_Template, 6, 3)(26, ProjectDetailPage_Conditional_4_Conditional_26_Template, 2, 0, "a", 24)(27, ProjectDetailPage_Conditional_4_Conditional_27_Template, 4, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "dt");
    \u0275\u0275text(29, "Baseline from");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "dd");
    \u0275\u0275text(31);
    \u0275\u0275pipe(32, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dt");
    \u0275\u0275text(34, "Crediting period");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "dd");
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "day");
    \u0275\u0275pipe(38, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "dt");
    \u0275\u0275text(40, "Created");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "dd");
    \u0275\u0275text(42);
    \u0275\u0275pipe(43, "day");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(44, "div", 25);
    \u0275\u0275element(45, "vc-stat", 26)(46, "vc-stat", 27);
    \u0275\u0275pipe(47, "num");
    \u0275\u0275element(48, "vc-stat", 28)(49, "vc-stat", 29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "section", 2)(51, "div", 19)(52, "h3");
    \u0275\u0275text(53, "Enrolments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 30);
    \u0275\u0275repeaterCreate(55, ProjectDetailPage_Conditional_4_For_56_Template, 3, 5, "button", 31, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(57, ProjectDetailPage_Conditional_4_Conditional_57_Template, 3, 0, "button", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(58, ProjectDetailPage_Conditional_4_Conditional_58_Template, 1, 1, "vc-loading", 11)(59, ProjectDetailPage_Conditional_4_Conditional_59_Template, 2, 1, "div", 20)(60, ProjectDetailPage_Conditional_4_Conditional_60_Template, 2, 1, "vc-empty", 33)(61, ProjectDetailPage_Conditional_4_Conditional_61_Template, 1, 0, "vc-empty", 34)(62, ProjectDetailPage_Conditional_4_Conditional_62_Template, 21, 0, "div", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_9_0;
    const p_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", p_r4.name)("eyebrow", "Project \xB7 " + p_r4.code);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r4.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.ctx.currentId() !== p_r4.id ? 3 : 4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canStatus ? 5 : -1);
    \u0275\u0275advance(11);
    \u0275\u0275conditional((tmp_7_0 = ctx_r1.programme()) ? 16 : 17, tmp_7_0);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", p_r4.methodology_code, " v", p_r4.methodology_version);
    \u0275\u0275advance(4);
    \u0275\u0275conditional((tmp_9_0 = ctx_r1.pack()) ? 25 : p_r4.rule_pack_id ? 26 : 27, tmp_9_0);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(32, 20, p_r4.baseline_start));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(37, 22, p_r4.crediting_start), " \u2013 ", \u0275\u0275pipeBind1(38, 24, p_r4.crediting_end));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(43, 26, p_r4.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r1.counts().enrolled)("hint", ctx_r1.counts().farmers + " farmers");
    \u0275\u0275advance();
    \u0275\u0275property("value", \u0275\u0275pipeBind2(47, 28, ctx_r1.counts().area, 1));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.counts().eligible);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.counts().ineligible);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.statusTabs);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canEnrol && p_r4.status !== "closed" ? 57 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.enrolLoading() ? 58 : ctx_r1.enrolError() ? 59 : !ctx_r1.enrolments().length ? 60 : !ctx_r1.shown().length ? 61 : 62);
  }
}
function ProjectDetailPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 76);
    \u0275\u0275element(2, "vc-icon", 77);
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(8, "vc-checks", 74);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r20 = ctx;
    \u0275\u0275advance();
    \u0275\u0275classProp("ok", r_r20.status === "eligible");
    \u0275\u0275advance();
    \u0275\u0275property("name", r_r20.status === "eligible" ? "check-circle" : "x-circle")("size", 22);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", r_r20.field_code, " is ", r_r20.status === "eligible" ? "eligible" : "not eligible");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r20.status === "eligible" ? "Confirm the enrolment to count it towards this project." : "Fix the failed checks, then re-check it from the enrolments table.");
    \u0275\u0275advance();
    \u0275\u0275property("checks", r_r20.eligibility.checks ?? \u0275\u0275pureFunction0(8, _c3));
  }
}
function ProjectDetailPage_Conditional_10_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 11);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function ProjectDetailPage_Conditional_10_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 82);
  }
}
function ProjectDetailPage_Conditional_10_Conditional_6_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 84);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_10_Conditional_6_For_1_Template_button_click_0_listener() {
      const f_r23 = \u0275\u0275restoreView(_r22).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.pick.set(f_r23));
    });
    \u0275\u0275element(1, "span", 85);
    \u0275\u0275elementStart(2, "span", 86)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 87);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 88);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 89);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "num");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r23 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("on", ctx_r1.pick()?.id === f_r23.id);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(f_r23.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r23.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r23.crop_code ?? "No crop");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(11, 6, f_r23.area_ha, 2), " ha");
  }
}
function ProjectDetailPage_Conditional_10_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ProjectDetailPage_Conditional_10_Conditional_6_For_1_Template, 12, 9, "button", 83, _forTrack22);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.candidates());
  }
}
function ProjectDetailPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 78);
    \u0275\u0275element(1, "vc-icon", 79);
    \u0275\u0275elementStart(2, "input", 80);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function ProjectDetailPage_Conditional_10_Template_input_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r21);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.search($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "div", 81);
    \u0275\u0275conditionalCreate(4, ProjectDetailPage_Conditional_10_Conditional_4_Template, 1, 1, "vc-loading", 11)(5, ProjectDetailPage_Conditional_10_Conditional_5_Template, 1, 0, "vc-empty", 82)(6, ProjectDetailPage_Conditional_10_Conditional_6_Template, 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.q());
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.fieldsLoading() ? 4 : !ctx_r1.candidates().length ? 5 : 6);
  }
}
function ProjectDetailPage_Conditional_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 51);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_12_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r25);
      const r_r26 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.enrolOpen.set(false);
      return \u0275\u0275resetView(ctx_r1.askConfirm(r_r26));
    });
    \u0275\u0275element(1, "vc-icon", 90);
    \u0275\u0275text(2, "Confirm enrolment");
    \u0275\u0275elementEnd();
  }
}
function ProjectDetailPage_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.enrolOpen.set(false));
    });
    \u0275\u0275text(1, "Close");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, ProjectDetailPage_Conditional_12_Conditional_2_Template, 3, 0, "button", 50);
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.status === "eligible" ? 2 : -1);
  }
}
function ProjectDetailPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.enrolOpen.set(false));
    });
    \u0275\u0275text(1, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 91);
    \u0275\u0275listener("click", function ProjectDetailPage_Conditional_13_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r27);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.enrol());
    });
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r1.pick() || ctx_r1.busy());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.busy() ? "Checking\u2026" : "Check eligibility");
  }
}
var Checks = class _Checks {
  checks = input(
    [],
    ...ngDevMode ? [{ debugName: "checks" }] : (
      /* istanbul ignore next */
      []
    )
  );
  label(c) {
    return CHECK_LABELS[c] ?? c.replace(/_/g, " ");
  }
  static \u0275fac = function Checks_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Checks)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Checks, selectors: [["vc-checks"]], inputs: { checks: [1, "checks"] }, decls: 3, vars: 1, consts: [[1, "chk", 3, "bad"], [1, "subtle", "small"], [1, "chk"], [1, "ic"], [3, "name", "size", "stroke"]], template: function Checks_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275repeaterCreate(0, Checks_For_1_Template, 8, 7, "div", 0, _forTrack03, false, Checks_ForEmpty_2_Template, 2, 0, "p", 1);
    }
    if (rf & 2) {
      \u0275\u0275repeater(ctx.checks());
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n  gap: 8px;\n}\n.chk[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n}\n.ic[_ngcontent-%COMP%] {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n  margin-top: 1px;\n}\n.bad[_ngcontent-%COMP%] {\n  border-color: #f3c7c3;\n  background: #fffafa;\n}\n.bad[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n  color: var(--%NS%red-600);\n}\nstrong[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n}\np[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%stone-600);\n  margin-top: 2px;\n  line-height: 1.45;\n}\n/*# sourceMappingURL=project-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Checks, [{
    type: Component,
    args: [{ selector: "vc-checks", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @for (c of checks(); track c.code) {
      <div class="chk" [class.bad]="!c.passed">
        <span class="ic"><vc-icon [name]="c.passed ? 'check' : 'x'" [size]="13" [stroke]="2.4" /></span>
        <div><strong>{{ label(c.code) }}</strong><p>{{ c.message }}</p></div>
      </div>
    } @empty { <p class="subtle small">No eligibility checks recorded.</p> }
  `, styles: ["/* angular:styles/component:scss;2fdc2ffefbb7f44f;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\programmes\\project-detail.page.ts */\n:host {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n  gap: 8px;\n}\n.chk {\n  display: flex;\n  gap: 10px;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n}\n.ic {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: var(--forest-100);\n  color: var(--forest-700);\n  margin-top: 1px;\n}\n.bad {\n  border-color: #f3c7c3;\n  background: #fffafa;\n}\n.bad .ic {\n  background: var(--red-100);\n  color: var(--red-600);\n}\nstrong {\n  font-size: 13px;\n  font-weight: 600;\n}\np {\n  font-size: 12.5px;\n  color: var(--stone-600);\n  margin-top: 2px;\n  line-height: 1.45;\n}\n/*# sourceMappingURL=project-detail.page.css.map */\n"] }]
  }], null, { checks: [{ type: Input, args: [{ isSignal: true, alias: "checks", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Checks, { className: "Checks", filePath: "src/app/features/programmes/project-detail.page.ts", lineNumber: 38 });
})();
var ProjectDetailPage = class _ProjectDetailPage {
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  canStatus = this.auth.can("programmes.manage");
  canEnrol = this.auth.can("land.manage");
  p = signal(
    null,
    ...ngDevMode ? [{ debugName: "p" }] : (
      /* istanbul ignore next */
      []
    )
  );
  programme = signal(
    null,
    ...ngDevMode ? [{ debugName: "programme" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pack = signal(
    null,
    ...ngDevMode ? [{ debugName: "pack" }] : (
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
  enrolments = signal(
    [],
    ...ngDevMode ? [{ debugName: "enrolments" }] : (
      /* istanbul ignore next */
      []
    )
  );
  enrolLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "enrolLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  enrolError = signal(
    null,
    ...ngDevMode ? [{ debugName: "enrolError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  filter = signal(
    "all",
    ...ngDevMode ? [{ debugName: "filter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  statusTabs = ["all", "enrolled", "eligible", "ineligible", "withdrawn"];
  shown = computed(
    () => this.filter() === "all" ? this.enrolments() : this.enrolments().filter((e) => e.status === this.filter()),
    ...ngDevMode ? [{ debugName: "shown" }] : (
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
  transitions = computed(
    () => PROJECT_NEXT[this.p()?.status ?? ""] ?? [],
    ...ngDevMode ? [{ debugName: "transitions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  counts = computed(
    () => {
      const es = this.enrolments();
      const enrolled = es.filter((e) => e.status === "enrolled");
      return {
        enrolled: enrolled.length,
        farmers: new Set(enrolled.map((e) => e.farmer_id)).size,
        area: enrolled.reduce((a, e) => a + (e.field_area_ha || 0), 0),
        eligible: es.filter((e) => e.status === "eligible").length,
        ineligible: es.filter((e) => e.status === "ineligible").length
      };
    },
    ...ngDevMode ? [{ debugName: "counts" }] : (
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
  statusOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "statusOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pendingStatus = signal(
    null,
    ...ngDevMode ? [{ debugName: "pendingStatus" }] : (
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
  confirmOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "confirmOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  withdrawOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "withdrawOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  enrolOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "enrolOpen" }] : (
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
  fields = signal(
    [],
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldsLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "fieldsLoading" }] : (
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
  result = signal(
    null,
    ...ngDevMode ? [{ debugName: "result" }] : (
      /* istanbul ignore next */
      []
    )
  );
  search$ = new Subject();
  candidates = computed(
    () => {
      const taken = new Set(this.enrolments().filter((e) => e.status !== "withdrawn").map((e) => e.field_id));
      return this.fields().filter((f) => !taken.has(f.id) && f.status === "active");
    },
    ...ngDevMode ? [{ debugName: "candidates" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.search$.pipe(debounceTime(250), switchMap((q) => {
      this.fieldsLoading.set(true);
      return this.api.get("/fields", { q, limit: 100 }).pipe(catchError(() => of({ items: [], total: 0 })));
    })).subscribe((r) => {
      this.fields.set(r.items);
      this.fieldsLoading.set(false);
    });
  }
  ngOnInit() {
    this.load();
    this.loadEnrolments();
  }
  load() {
    this.loading.set(true);
    this.api.get(`/projects/${this.id()}`).subscribe({
      next: (p) => {
        this.p.set(p);
        this.loading.set(false);
        this.api.get(`/programmes/${p.programme_id}`).pipe(catchError(() => of(null))).subscribe((x) => this.programme.set(x));
        if (p.rule_pack_id) {
          this.api.get(`/rule-packs/${p.rule_pack_id}`).pipe(catchError(() => of(null))).subscribe((x) => this.pack.set(x));
        }
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  loadEnrolments() {
    this.enrolError.set(null);
    this.api.get(`/projects/${this.id()}/enrolments`).subscribe({
      next: (r) => {
        this.enrolments.set(r);
        this.enrolLoading.set(false);
      },
      error: (e) => {
        this.enrolError.set(e.message);
        this.enrolLoading.set(false);
      }
    });
  }
  toggle(id) {
    this.open.set(this.open() === id ? null : id);
  }
  checkCount(e) {
    const c = e.eligibility?.checks ?? [];
    const passed = c.filter((x) => x.passed).length;
    return { passed, failed: c.length - passed, total: c.length };
  }
  askStatus(t) {
    this.pendingStatus.set(t);
    this.statusOpen.set(true);
  }
  applyStatus(reason) {
    const t = this.pendingStatus();
    if (!t)
      return;
    this.busy.set(true);
    this.api.post(`/projects/${this.id()}/status`, { status: t.to, reason: reason || null }).subscribe({
      next: (p) => {
        this.busy.set(false);
        this.statusOpen.set(false);
        this.p.set(p);
        this.ctx.load();
        this.toast.success("Project status changed", `${p.code} is now ${p.status}.`);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't change the status");
      }
    });
  }
  upsert(e) {
    const list = this.enrolments();
    this.enrolments.set(list.some((x) => x.id === e.id) ? list.map((x) => x.id === e.id ? e : x) : [e, ...list]);
  }
  askConfirm(e) {
    this.target.set(e);
    this.confirmOpen.set(true);
  }
  askWithdraw(e) {
    this.target.set(e);
    this.withdrawOpen.set(true);
  }
  confirmEnrolment() {
    const e = this.target();
    if (!e)
      return;
    this.busy.set(true);
    this.api.post(`/projects/${this.id()}/enrolments/${e.id}/confirm`).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.confirmOpen.set(false);
        this.upsert(r);
        this.toast.success("Field enrolled", `${r.field_code} now counts towards this project.`);
      },
      error: (err) => {
        this.busy.set(false);
        this.confirmOpen.set(false);
        this.toast.apiError(err, "Couldn't confirm the enrolment");
        this.loadEnrolments();
      }
    });
  }
  withdraw(reason) {
    const e = this.target();
    if (!e)
      return;
    this.busy.set(true);
    this.api.post(`/projects/${this.id()}/enrolments/${e.id}/withdraw`, { reason }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.withdrawOpen.set(false);
        this.upsert(r);
        this.toast.success("Field withdrawn", `${r.field_code} was withdrawn.`);
      },
      error: (err) => {
        this.busy.set(false);
        this.toast.apiError(err, "Couldn't withdraw the field");
      }
    });
  }
  recheck(e) {
    this.busy.set(true);
    this.api.post(`/projects/${this.id()}/enrolments`, { field_id: e.field_id }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.upsert(r);
        this.open.set(r.id);
        if (r.status === "eligible")
          this.toast.success("Now eligible", `${r.field_code} passes every check. Confirm to enrol it.`);
        else
          this.toast.info("Still not eligible", `${r.field_code} fails at least one check.`);
      },
      error: (err) => {
        this.busy.set(false);
        this.toast.apiError(err, "Couldn't re-check the field");
      }
    });
  }
  openEnrol() {
    this.result.set(null);
    this.pick.set(null);
    this.q.set("");
    this.enrolOpen.set(true);
    this.search$.next("");
  }
  search(q) {
    this.q.set(q);
    this.search$.next(q.trim());
  }
  enrol() {
    const f = this.pick();
    if (!f)
      return;
    this.busy.set(true);
    this.api.post(`/projects/${this.id()}/enrolments`, { field_id: f.id }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.result.set(r);
        this.upsert(r);
      },
      error: (err) => {
        this.busy.set(false);
        this.toast.apiError(err, "Couldn't check this field");
      }
    });
  }
  static \u0275fac = function ProjectDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProjectDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProjectDetailPage, selectors: [["vc-project-detail"]], inputs: { id: [1, "id"] }, decls: 14, vars: 20, consts: [[1, "back", 3, "routerLink"], ["routerLink", "/app/programmes", 1, "back"], [1, "card"], ["title", "Couldn't load this project", 3, "message"], ["reasonPlaceholder", "Why is the status changing?", 3, "openChange", "confirmed", "open", "title", "message", "confirmLabel", "tone", "icon", "reason", "busy"], ["title", "Confirm enrolment", "confirmLabel", "Confirm enrolment", "icon", "check", 3, "openChange", "confirmed", "open", "busy", "message"], ["title", "Withdraw field", "confirmLabel", "Withdraw", "tone", "danger", "icon", "undo", "reason", "required", "reasonLabel", "Reason for withdrawal", "reasonPlaceholder", "For example: farmer sold the land, or the crop changed.", 3, "openChange", "confirmed", "open", "busy", "message"], ["title", "Enrol a field", "width", "680px", 3, "openChange", "open", "subtitle"], [1, "stack", 2, "--gap", "14px"], ["footer", ""], ["name", "arrow-left", 3, "size"], [3, "rows"], [3, "title", "eyebrow"], ["actions", "", 1, "hacts"], [3, "status"], [1, "btn", "btn-secondary"], [1, "current"], [1, "layout"], [1, "card", "facts"], [1, "card-head"], [1, "card-body"], [1, "kv"], [3, "routerLink"], [1, "mono"], ["routerLink", "/app/methodology"], [1, "grid", "grid-2", "kpis"], ["label", "Fields enrolled", "icon", "check-circle", 3, "value", "hint"], ["label", "Area enrolled", "unit", "ha", "icon", "layers", 3, "value"], ["label", "Awaiting confirmation", "icon", "clock", "hint", "Passed every check", 3, "value"], ["label", "Ineligible", "icon", "x-circle", "hint", "At least one check failed", 3, "value"], [1, "seg"], ["type", "button", 3, "on"], [1, "btn", "btn-primary", "btn-sm"], ["icon", "map", "title", "No fields enrolled yet", "text", "Enrolling runs every eligibility check \u2014 area, crop, land-use history, double enrolment and farmer consent \u2014 and records the result."], ["icon", "filter", "title", "Nothing with this status"], [1, "table-wrap"], [1, "btn", "btn-secondary", 3, "click"], ["name", "target"], ["name", "check-circle", 3, "size"], [1, "btn", 3, "btn-primary", "btn-secondary"], [1, "btn", 3, "click"], [3, "name"], [1, "row", 2, "--gap", "6px", "margin-top", "4px"], [1, "small", "subtle"], [1, "warnText"], ["routerLink", "/app/methodology", 1, "small"], ["type", "button", 3, "click"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["name", "plus"], ["title", "Couldn't load enrolments", 3, "message"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "table"], [2, "width", "28px"], [1, "num"], [1, "clickable", 3, "click"], [1, "subtle", 3, "name", "size"], [1, "mono", 3, "click", "routerLink"], [3, "click", "routerLink"], [1, "num", "nowrap"], [1, "pill"], [1, "nowrap"], [1, "num", "nowrap", 3, "click"], [1, "expand"], [1, "btn", "btn-secondary", "btn-sm", 3, "disabled"], [1, "btn", "btn-ghost", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], ["name", "refresh", 3, "size"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["colspan", "7"], [1, "exp"], [1, "exp-h"], [1, "subtle", "small"], ["cls", "DERIVED"], [3, "checks"], ["tone", "info", "icon", "undo"], [1, "res"], [3, "name", "size"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search by field code or name\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "fieldlist"], ["icon", "map", "title", "No fields available", "text", "Every matching field is already in this project, or no fields have been mapped yet. Map fields under Fields & map."], ["type", "button", 1, "fopt", 3, "on"], ["type", "button", 1, "fopt", 3, "click"], [1, "radio"], [1, "fl"], [1, "mono", "small", "subtle"], [1, "small", "muted"], [1, "num", "small"], ["name", "check"], [1, "btn", "btn-primary", 3, "click", "disabled"]], template: function ProjectDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ProjectDetailPage_Conditional_0_Template, 3, 5, "a", 0)(1, ProjectDetailPage_Conditional_1_Template, 3, 1, "a", 1);
      \u0275\u0275conditionalCreate(2, ProjectDetailPage_Conditional_2_Template, 2, 1, "div", 2)(3, ProjectDetailPage_Conditional_3_Template, 1, 1, "vc-error", 3)(4, ProjectDetailPage_Conditional_4_Template, 63, 31);
      \u0275\u0275elementStart(5, "vc-confirm", 4);
      \u0275\u0275twoWayListener("openChange", function ProjectDetailPage_Template_vc_confirm_openChange_5_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.statusOpen, $event) || (ctx.statusOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function ProjectDetailPage_Template_vc_confirm_confirmed_5_listener($event) {
        return ctx.applyStatus($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "vc-confirm", 5);
      \u0275\u0275twoWayListener("openChange", function ProjectDetailPage_Template_vc_confirm_openChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.confirmOpen, $event) || (ctx.confirmOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function ProjectDetailPage_Template_vc_confirm_confirmed_6_listener() {
        return ctx.confirmEnrolment();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "vc-confirm", 6);
      \u0275\u0275twoWayListener("openChange", function ProjectDetailPage_Template_vc_confirm_openChange_7_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.withdrawOpen, $event) || (ctx.withdrawOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function ProjectDetailPage_Template_vc_confirm_confirmed_7_listener($event) {
        return ctx.withdraw($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "vc-modal", 7);
      \u0275\u0275twoWayListener("openChange", function ProjectDetailPage_Template_vc_modal_openChange_8_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.enrolOpen, $event) || (ctx.enrolOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(9, ProjectDetailPage_Conditional_9_Template, 9, 9, "div", 8)(10, ProjectDetailPage_Conditional_10_Template, 7, 3);
      \u0275\u0275elementContainerStart(11, 9);
      \u0275\u0275conditionalCreate(12, ProjectDetailPage_Conditional_12_Template, 3, 1)(13, ProjectDetailPage_Conditional_13_Template, 4, 2);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      let tmp_18_0;
      let tmp_19_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.programme()) ? 0 : 1, tmp_0_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 2 : ctx.error() ? 3 : (tmp_1_0 = ctx.p()) ? 4 : -1, tmp_1_0);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("open", ctx.statusOpen);
      \u0275\u0275property("title", ctx.pendingStatus()?.label ?? "")("message", ctx.pendingStatus()?.text ?? "")("confirmLabel", ctx.pendingStatus()?.label ?? "Confirm")("tone", ctx.pendingStatus()?.tone ?? "primary")("icon", ctx.pendingStatus()?.icon ?? "")("reason", ctx.pendingStatus()?.reason ?? "none")("busy", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.confirmOpen);
      \u0275\u0275property("busy", ctx.busy())("message", "Every eligibility check is run again before confirming. " + (ctx.target()?.field_code ?? "") + " (" + (ctx.target()?.farmer_name ?? "") + ") will count towards this project from today.");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.withdrawOpen);
      \u0275\u0275property("busy", ctx.busy())("message", (ctx.target()?.field_code ?? "") + " will stop counting towards this project. Its history stays on record.");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.enrolOpen);
      \u0275\u0275property("subtitle", ctx.result() ? "Eligibility result" : "Pick a field that isn\u2019t in this project yet. Every eligibility check runs straight away.");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_18_0 = ctx.result()) ? 9 : 10, tmp_18_0);
      \u0275\u0275advance(3);
      \u0275\u0275conditional((tmp_19_0 = ctx.result()) ? 12 : 13, tmp_19_0);
    }
  }, dependencies: [
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    RouterLink,
    PageHeader,
    Loading,
    ErrorBox,
    Empty,
    Badge,
    Modal,
    Stat,
    Icon,
    Callout,
    DataClass,
    ConfirmDialog,
    Checks,
    NumPipe,
    DayPipe,
    HumanPipe
  ], styles: ["\n.hacts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-bottom: 14px;\n}\n.back[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%forest-700);\n  text-decoration: none;\n}\n.current[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 36px;\n  padding: 0 12px;\n  border-radius: 6px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  font-size: 13px;\n  font-weight: 500;\n}\n.layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);\n  gap: 16px;\n  margin-bottom: 16px;\n}\n@media (max-width: 1100px) {\n  .layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.kpis[_ngcontent-%COMP%] {\n  align-content: start;\n}\n.warnText[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n  font-weight: 500;\n  margin-right: 6px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  padding: 2px;\n  gap: 2px;\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  height: 26px;\n  padding: 0 10px;\n  border: 0;\n  background: none;\n  border-radius: 6px;\n  font: 500 12.5px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%forest-700);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  height: 22px;\n  align-items: center;\n  padding: 0 8px;\n  border-radius: 5px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  font-size: 12px;\n  font-variant-numeric: tabular-nums;\n}\n.pill.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n  color: var(--%NS%red-600);\n}\ntr.expand[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%surface-2);\n  padding-top: 4px;\n}\n.exp[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 4px 0 8px;\n}\n.exp-h[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--%NS%stone-600);\n}\ntd[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]    + .btn[_ngcontent-%COMP%] {\n  margin-left: 6px;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  margin-bottom: 12px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.fieldlist[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-height: 48vh;\n  overflow: auto;\n}\n.fopt[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 18px 1fr auto 80px;\n  align-items: center;\n  gap: 12px;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  background: var(--%NS%surface);\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.fopt[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.fopt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-500);\n}\n.fopt[_ngcontent-%COMP%]   .num[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.radio[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: 1.5px solid var(--%NS%stone-400);\n}\n.fopt.on[_ngcontent-%COMP%]   .radio[_ngcontent-%COMP%] {\n  border: 5px solid var(--%NS%forest-600);\n}\n.fl[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.res[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n  padding: 14px 16px;\n  border-radius: 10px;\n  background: var(--%NS%red-100);\n  color: var(--%NS%red-600);\n  border: 1px solid #f3c7c3;\n}\n.res.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-600);\n  border-color: var(--%NS%forest-200);\n}\n.res[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n  font-size: 15px;\n}\n.res[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n  font-size: 13px;\n  margin-top: 2px;\n}\n/*# sourceMappingURL=project-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProjectDetailPage, [{
    type: Component,
    args: [{ selector: "vc-project-detail", imports: [
      FormsModule,
      RouterLink,
      PageHeader,
      Loading,
      ErrorBox,
      Empty,
      Badge,
      Modal,
      Stat,
      Icon,
      Callout,
      DataClass,
      ConfirmDialog,
      Checks,
      NumPipe,
      DayPipe,
      HumanPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (programme(); as prog) {
      <a class="back" [routerLink]="['/app/programmes', prog.id]"><vc-icon name="arrow-left" [size]="15" />{{ prog.name }}</a>
    } @else { <a class="back" routerLink="/app/programmes"><vc-icon name="arrow-left" [size]="15" />Programmes</a> }

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this project" [message]="error()!" />
    } @else if (p(); as p) {
      <vc-page-header [title]="p.name" [eyebrow]="'Project \xB7 ' + p.code">
        <div actions class="hacts">
          <vc-badge [status]="p.status" />
          @if (ctx.currentId() !== p.id) {
            <button class="btn btn-secondary" (click)="ctx.select(p.id)"><vc-icon name="target" />Work on this project</button>
          } @else {
            <span class="current"><vc-icon name="check-circle" [size]="15" />Current project</span>
          }
          @if (canStatus) {
            @for (t of transitions(); track t.to) {
              <button class="btn" [class.btn-primary]="t.tone === 'primary'" [class.btn-secondary]="t.tone === 'danger'"
                (click)="askStatus(t)"><vc-icon [name]="t.icon" />{{ t.label }}</button>
            }
          }
        </div>
      </vc-page-header>

      <div class="layout">
        <section class="card facts">
          <div class="card-head"><h3>Key facts</h3></div>
          <div class="card-body">
            <dl class="kv">
              <dt>Programme</dt>
              <dd>@if (programme(); as prog) { <a [routerLink]="['/app/programmes', prog.id]">{{ prog.name }}</a> } @else { \u2014 }</dd>
              <dt>Methodology</dt><dd class="mono">{{ p.methodology_code }} v{{ p.methodology_version }}</dd>
              <dt>Rule pack</dt>
              <dd>
                @if (pack(); as rp) {
                  <a routerLink="/app/methodology">{{ rp.title }}</a>
                  <div class="row" style="--gap:6px;margin-top:4px"><span class="small subtle">rev {{ rp.revision }}</span><vc-badge [status]="rp.status" /></div>
                } @else if (p.rule_pack_id) { <a routerLink="/app/methodology">View rule pack</a> }
                @else { <span class="warnText">Not assigned</span> <a class="small" routerLink="/app/methodology">Choose in Methodology</a> }
              </dd>
              <dt>Baseline from</dt><dd>{{ p.baseline_start | day }}</dd>
              <dt>Crediting period</dt><dd>{{ p.crediting_start | day }} \u2013 {{ p.crediting_end | day }}</dd>
              <dt>Created</dt><dd>{{ p.created_at | day }}</dd>
            </dl>
          </div>
        </section>
        <div class="grid grid-2 kpis">
          <vc-stat label="Fields enrolled" [value]="counts().enrolled" icon="check-circle" [hint]="(counts().farmers) + ' farmers'" />
          <vc-stat label="Area enrolled" [value]="counts().area | num: 1" unit="ha" icon="layers" />
          <vc-stat label="Awaiting confirmation" [value]="counts().eligible" icon="clock" hint="Passed every check" />
          <vc-stat label="Ineligible" [value]="counts().ineligible" icon="x-circle" hint="At least one check failed" />
        </div>
      </div>

      <section class="card">
        <div class="card-head">
          <h3>Enrolments</h3>
          <div class="seg">
            @for (s of statusTabs; track s) {
              <button type="button" [class.on]="filter() === s" (click)="filter.set(s)">{{ s === 'all' ? 'All' : (s | human) }}</button>
            }
          </div>
          @if (canEnrol && p.status !== 'closed') {
            <button class="btn btn-primary btn-sm" (click)="openEnrol()"><vc-icon name="plus" />Enrol a field</button>
          }
        </div>
        @if (enrolLoading()) {
          <vc-loading [rows]="4" />
        } @else if (enrolError()) {
          <div class="card-body"><vc-error title="Couldn't load enrolments" [message]="enrolError()!" /></div>
        } @else if (!enrolments().length) {
          <vc-empty icon="map" title="No fields enrolled yet"
            text="Enrolling runs every eligibility check \u2014 area, crop, land-use history, double enrolment and farmer consent \u2014 and records the result.">
            @if (canEnrol && p.status !== 'closed') { <button class="btn btn-primary" (click)="openEnrol()"><vc-icon name="plus" />Enrol a field</button> }
          </vc-empty>
        } @else if (!shown().length) {
          <vc-empty icon="filter" title="Nothing with this status" />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th style="width:28px"></th><th>Field</th><th>Farmer</th><th class="num">Area</th><th>Checks</th><th>Status</th><th>Enrolled</th><th></th></tr></thead>
              <tbody>
                @for (e of shown(); track e.id) {
                  <tr class="clickable" (click)="toggle(e.id)">
                    <td><vc-icon [name]="open() === e.id ? 'chevron-down' : 'chevron-right'" [size]="15" class="subtle" /></td>
                    <td><a class="mono" [routerLink]="['/app/fields', e.field_id]" (click)="$event.stopPropagation()">{{ e.field_code }}</a></td>
                    <td><a [routerLink]="['/app/farmers', e.farmer_id]" (click)="$event.stopPropagation()">{{ e.farmer_name }}</a></td>
                    <td class="num nowrap">{{ e.field_area_ha | num: 2 }} ha</td>
                    <td>
                      @let c = checkCount(e);
                      <span class="pill" [class.bad]="c.failed > 0">{{ c.passed }}/{{ c.total }} passed</span>
                    </td>
                    <td><vc-badge [status]="e.status" /></td>
                    <td class="nowrap">{{ e.enrolled_on | day }}</td>
                    <td class="num nowrap" (click)="$event.stopPropagation()">
                      @if (canEnrol) {
                        @if (e.status === 'eligible') {
                          <button class="btn btn-primary btn-sm" (click)="askConfirm(e)">Confirm</button>
                        }
                        @if (e.status === 'ineligible' || e.status === 'pending') {
                          <button class="btn btn-secondary btn-sm" (click)="recheck(e)" [disabled]="busy()"><vc-icon name="refresh" [size]="14" />Re-check</button>
                        }
                        @if (e.status === 'enrolled' || e.status === 'eligible') {
                          <button class="btn btn-ghost btn-sm" (click)="askWithdraw(e)">Withdraw</button>
                        }
                      }
                    </td>
                  </tr>
                  @if (open() === e.id) {
                    <tr class="expand"><td></td><td colspan="7">
                      <div class="exp">
                        <div class="exp-h"><span>Eligibility checks</span>
                          @if (e.eligibility.decided_at) { <span class="subtle small">Checked {{ e.eligibility.decided_at | day: true }}</span> }
                          <vc-dc cls="DERIVED" />
                        </div>
                        <vc-checks [checks]="e.eligibility.checks ?? []" />
                        @if (e.eligibility.withdrawal; as w) {
                          <vc-callout tone="info" icon="undo">Withdrawn on {{ w.on | day }}: {{ w.reason }}</vc-callout>
                        }
                      </div>
                    </td></tr>
                  }
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <!-- status change -->
    <vc-confirm [(open)]="statusOpen" [title]="pendingStatus()?.label ?? ''" [message]="pendingStatus()?.text ?? ''"
      [confirmLabel]="pendingStatus()?.label ?? 'Confirm'" [tone]="pendingStatus()?.tone ?? 'primary'" [icon]="pendingStatus()?.icon ?? ''"
      [reason]="pendingStatus()?.reason ?? 'none'" reasonPlaceholder="Why is the status changing?" [busy]="busy()"
      (confirmed)="applyStatus($event)" />

    <!-- confirm enrolment -->
    <vc-confirm [(open)]="confirmOpen" title="Confirm enrolment" confirmLabel="Confirm enrolment" icon="check" [busy]="busy()"
      [message]="'Every eligibility check is run again before confirming. ' + (target()?.field_code ?? '') + ' (' + (target()?.farmer_name ?? '') + ') will count towards this project from today.'"
      (confirmed)="confirmEnrolment()" />

    <!-- withdraw -->
    <vc-confirm [(open)]="withdrawOpen" title="Withdraw field" confirmLabel="Withdraw" tone="danger" icon="undo" reason="required"
      reasonLabel="Reason for withdrawal" reasonPlaceholder="For example: farmer sold the land, or the crop changed." [busy]="busy()"
      [message]="(target()?.field_code ?? '') + ' will stop counting towards this project. Its history stays on record.'"
      (confirmed)="withdraw($event)" />

    <!-- enrol a field -->
    <vc-modal [(open)]="enrolOpen" title="Enrol a field" [subtitle]="result() ? 'Eligibility result' : 'Pick a field that isn\u2019t in this project yet. Every eligibility check runs straight away.'" width="680px">
      @if (result(); as r) {
        <div class="stack" style="--gap:14px">
          <div class="res" [class.ok]="r.status === 'eligible'">
            <vc-icon [name]="r.status === 'eligible' ? 'check-circle' : 'x-circle'" [size]="22" />
            <div>
              <strong>{{ r.field_code }} is {{ r.status === 'eligible' ? 'eligible' : 'not eligible' }}</strong>
              <p>{{ r.status === 'eligible' ? 'Confirm the enrolment to count it towards this project.' : 'Fix the failed checks, then re-check it from the enrolments table.' }}</p>
            </div>
          </div>
          <vc-checks [checks]="r.eligibility.checks ?? []" />
        </div>
      } @else {
        <div class="search">
          <vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search by field code or name\u2026" [ngModel]="q()" (ngModelChange)="search($event)" />
        </div>
        <div class="fieldlist">
          @if (fieldsLoading()) { <vc-loading [rows]="4" /> }
          @else if (!candidates().length) {
            <vc-empty icon="map" title="No fields available" text="Every matching field is already in this project, or no fields have been mapped yet. Map fields under Fields & map." />
          } @else {
            @for (f of candidates(); track f.id) {
              <button type="button" class="fopt" [class.on]="pick()?.id === f.id" (click)="pick.set(f)">
                <span class="radio"></span>
                <span class="fl"><strong>{{ f.name }}</strong><span class="mono small subtle">{{ f.code }}</span></span>
                <span class="small muted">{{ f.crop_code ?? 'No crop' }}</span>
                <span class="num small">{{ f.area_ha | num: 2 }} ha</span>
              </button>
            }
          }
        </div>
      }
      <ng-container footer>
        @if (result(); as r) {
          <button class="btn btn-secondary" (click)="enrolOpen.set(false)">Close</button>
          @if (r.status === 'eligible') { <button class="btn btn-primary" (click)="enrolOpen.set(false); askConfirm(r)"><vc-icon name="check" />Confirm enrolment</button> }
        } @else {
          <button class="btn btn-secondary" (click)="enrolOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!pick() || busy()" (click)="enrol()">{{ busy() ? 'Checking\u2026' : 'Check eligibility' }}</button>
        }
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;2e8bef5b043b4a5d;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\programmes\\project-detail.page.ts */\n.hacts {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n  margin-bottom: 14px;\n}\n.back:hover {\n  color: var(--forest-700);\n  text-decoration: none;\n}\n.current {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 36px;\n  padding: 0 12px;\n  border-radius: 6px;\n  background: var(--forest-50);\n  color: var(--forest-700);\n  font-size: 13px;\n  font-weight: 500;\n}\n.layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);\n  gap: 16px;\n  margin-bottom: 16px;\n}\n@media (max-width: 1100px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}\n.kpis {\n  align-content: start;\n}\n.warnText {\n  color: var(--amber-600);\n  font-weight: 500;\n  margin-right: 6px;\n}\n.seg {\n  display: inline-flex;\n  padding: 2px;\n  gap: 2px;\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n}\n.seg button {\n  height: 26px;\n  padding: 0 10px;\n  border: 0;\n  background: none;\n  border-radius: 6px;\n  font: 500 12.5px var(--font);\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--surface);\n  color: var(--forest-700);\n  box-shadow: var(--shadow-sm);\n}\n.pill {\n  display: inline-flex;\n  height: 22px;\n  align-items: center;\n  padding: 0 8px;\n  border-radius: 5px;\n  background: var(--forest-50);\n  color: var(--forest-700);\n  font-size: 12px;\n  font-variant-numeric: tabular-nums;\n}\n.pill.bad {\n  background: var(--red-100);\n  color: var(--red-600);\n}\ntr.expand td {\n  background: var(--surface-2);\n  padding-top: 4px;\n}\n.exp {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 4px 0 8px;\n}\n.exp-h {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--stone-600);\n}\ntd .btn + .btn {\n  margin-left: 6px;\n}\n.search {\n  position: relative;\n  margin-bottom: 12px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.fieldlist {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-height: 48vh;\n  overflow: auto;\n}\n.fopt {\n  display: grid;\n  grid-template-columns: 18px 1fr auto 80px;\n  align-items: center;\n  gap: 12px;\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  background: var(--surface);\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.fopt:hover {\n  border-color: var(--stone-400);\n}\n.fopt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: inset 0 0 0 1px var(--forest-500);\n}\n.fopt .num {\n  text-align: right;\n}\n.radio {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: 1.5px solid var(--stone-400);\n}\n.fopt.on .radio {\n  border: 5px solid var(--forest-600);\n}\n.fl {\n  display: flex;\n  flex-direction: column;\n}\n.res {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n  padding: 14px 16px;\n  border-radius: 10px;\n  background: var(--red-100);\n  color: var(--red-600);\n  border: 1px solid #f3c7c3;\n}\n.res.ok {\n  background: var(--forest-50);\n  color: var(--forest-600);\n  border-color: var(--forest-200);\n}\n.res strong {\n  color: var(--stone-900);\n  font-size: 15px;\n}\n.res p {\n  color: var(--stone-700);\n  font-size: 13px;\n  margin-top: 2px;\n}\n/*# sourceMappingURL=project-detail.page.css.map */\n"] }]
  }], () => [], { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProjectDetailPage, { className: "ProjectDetailPage", filePath: "src/app/features/programmes/project-detail.page.ts", lineNumber: 277 });
})();

// src/app/features/programmes/programmes.routes.ts
var programmes_routes_default = [
  { path: "", component: ProgrammesPage, title: "Programmes \xB7 Varsapradaya Carbon" },
  { path: "projects/:id", component: ProjectDetailPage, title: "Project \xB7 Varsapradaya Carbon" },
  { path: ":id", component: ProgrammeDetailPage, title: "Programme \xB7 Varsapradaya Carbon" }
];
export {
  programmes_routes_default as default
};
//# debugId=d8650b40-deeb-5498-9d02-bfdaedc08f6f
//# sourceMappingURL=chunk-P2QQNB4Y.js.map
