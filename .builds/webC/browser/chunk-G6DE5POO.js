import {
  ProvenanceTree
} from "./chunk-IFTYMWQK.js";
import {
  CalcBlocker
} from "./chunk-MSGBQL24.js";
import {
  People,
  TERM_HELP,
  TERM_LABELS,
  TERM_STATUS,
  openBlob,
  ruleSource,
  ruleValue,
  termLabel
} from "./chunk-5SRO2YLJ.js";
import {
  toSignal
} from "./chunk-OZDQGELJ.js";
import {
  Chart
} from "./chunk-RHCCRMNI.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  AgoPipe,
  DayPipe,
  HumanPipe,
  NumPipe,
  fmtDate,
  fmtNum
} from "./chunk-E5UDMWWN.js";
import {
  ActivatedRoute,
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
  Tabs,
  Timeline
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Icon,
  Input,
  Output,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  inject,
  input,
  output,
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
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
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
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate4,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/calculations/new-run.ts
var _forTrack0 = ($index, $item) => $item.id;
function NewRun_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 0);
    \u0275\u0275element(1, "vc-empty", 2);
    \u0275\u0275elementEnd();
  }
}
function NewRun_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function NewRun_Conditional_1_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1, "The period must end after it starts.");
    \u0275\u0275elementEnd();
  }
}
function NewRun_Conditional_1_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    \u0275\u0275property("value", c_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", c_r3.code, " \xB7 ", c_r3.name, " (", c_r3.design, ")");
  }
}
function NewRun_Conditional_1_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1, "This project has no baseline campaign.");
    \u0275\u0275elementEnd();
  }
}
function NewRun_Conditional_1_For_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    \u0275\u0275property("value", c_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", c_r4.code, " \xB7 ", c_r4.name, " (", c_r4.design, ")");
  }
}
function NewRun_Conditional_1_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1, "No monitoring campaign yet \u2014 a re-measurement is needed to calculate a change.");
    \u0275\u0275elementEnd();
  }
}
function NewRun_Conditional_1_For_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 19);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275pipe(3, "num");
    \u0275\u0275pipe(4, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = ctx.$implicit;
    \u0275\u0275property("value", r_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate4("", r_r5.period_label, " \xB7 ", \u0275\u0275pipeBind1(2, 5, r_r5.status), " \xB7 ", \u0275\u0275pipeBind2(3, 7, r_r5.net_t_co2e, 1), " tCO\u2082e \xB7 ", \u0275\u0275pipeBind1(4, 10, r_r5.created_at));
  }
}
function NewRun_Conditional_1_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-calc-blocker", 31);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("error", ctx_r1.error());
  }
}
function NewRun_Conditional_1_Conditional_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 32)(1, "strong");
    \u0275\u0275text(2, "What happens when you run");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ol")(4, "li");
    \u0275\u0275text(5, "Project quality checks run. Any open blocking issue stops the run.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "li");
    \u0275\u0275text(7, "Every sample, layer and accepted lab result for both campaigns is read and frozen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "li");
    \u0275\u0275text(9, "The approved methodology rules decide the stock method, uncertainty and buffer.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "li");
    \u0275\u0275text(11, "The result gets a fingerprint of its inputs, so anyone can check it was not changed.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "vc-callout", 33);
    \u0275\u0275text(13, " A run you create must be approved by a colleague with approval rights \u2014 never by you. ");
    \u0275\u0275elementEnd();
  }
}
function NewRun_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "section", 0)(2, "div", 3)(3, "h3");
    \u0275\u0275text(4, "New calculation run");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 4);
    \u0275\u0275conditionalCreate(6, NewRun_Conditional_1_Conditional_6_Template, 1, 1, "vc-loading", 5);
    \u0275\u0275elementStart(7, "div", 6)(8, "div", 7)(9, "label", 8);
    \u0275\u0275text(10, "Monitoring period label");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 9);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function NewRun_Conditional_1_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.f.period_label, $event) || (ctx_r1.f.period_label = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 10);
    \u0275\u0275text(13, "Approved term estimates with the same label are used.");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(14, "div", 7);
    \u0275\u0275elementStart(15, "div", 7)(16, "label", 11);
    \u0275\u0275text(17, "Period start");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 12);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function NewRun_Conditional_1_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.f.period_start, $event) || (ctx_r1.f.period_start = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 7)(20, "label", 13);
    \u0275\u0275text(21, "Period end");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 14);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function NewRun_Conditional_1_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.f.period_end, $event) || (ctx_r1.f.period_end = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(23, NewRun_Conditional_1_Conditional_23_Template, 2, 0, "span", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 7)(25, "label", 16);
    \u0275\u0275text(26, "Baseline campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "select", 17);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function NewRun_Conditional_1_Template_select_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.f.baseline_campaign_id, $event) || (ctx_r1.f.baseline_campaign_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(28, "option", 18);
    \u0275\u0275text(29, "Choose\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(30, NewRun_Conditional_1_For_31_Template, 2, 4, "option", 19, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(32, NewRun_Conditional_1_Conditional_32_Template, 2, 0, "span", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 7)(34, "label", 20);
    \u0275\u0275text(35, "Monitoring campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "select", 21);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function NewRun_Conditional_1_Template_select_ngModelChange_36_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.f.monitoring_campaign_id, $event) || (ctx_r1.f.monitoring_campaign_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(37, "option", 18);
    \u0275\u0275text(38, "Choose\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(39, NewRun_Conditional_1_For_40_Template, 2, 4, "option", 19, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(41, NewRun_Conditional_1_Conditional_41_Template, 2, 0, "span", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 22)(43, "label", 23);
    \u0275\u0275text(44, "Replaces an earlier run ");
    \u0275\u0275elementStart(45, "span", 24);
    \u0275\u0275text(46, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "select", 25);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function NewRun_Conditional_1_Template_select_ngModelChange_47_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.f.supersedes_run_id, $event) || (ctx_r1.f.supersedes_run_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(48, "option", 18);
    \u0275\u0275text(49, "No \u2014 this is the first run for the period");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(50, NewRun_Conditional_1_For_51_Template, 5, 12, "option", 19, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "span", 10);
    \u0275\u0275text(53, "Only runs for the same period label can be replaced. When approved, the old run is marked superseded and its field claims are released.");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(54, "div", 26)(55, "span", 27);
    \u0275\u0275text(56, "Quality checks run first. The engine reads only accepted, versioned data and freezes every input.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "button", 28);
    \u0275\u0275listener("click", function NewRun_Conditional_1_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.run());
    });
    \u0275\u0275element(58, "vc-icon", 29);
    \u0275\u0275text(59);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(60, "aside", 30);
    \u0275\u0275conditionalCreate(61, NewRun_Conditional_1_Conditional_61_Template, 1, 1, "vc-calc-blocker", 31)(62, NewRun_Conditional_1_Conditional_62_Template, 14, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.loadingCampaigns() ? 6 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.f.period_label);
    \u0275\u0275control();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.f.period_start);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275classProp("invalid", ctx_r1.badPeriod());
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.f.period_end);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.badPeriod() ? 23 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.f.baseline_campaign_id);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.baselines());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.loadingCampaigns() && !ctx_r1.baselines().length ? 32 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.f.monitoring_campaign_id);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.monitorings());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.loadingCampaigns() && !ctx_r1.monitorings().length ? 41 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.f.supersedes_run_id);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.supersedable());
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", !ctx_r1.valid() || ctx_r1.running());
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.running() ? "refresh" : "play");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r1.running() ? "Calculating\u2026" : "Run calculation", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.error() ? 61 : 62);
  }
}
var NewRun = class _NewRun {
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  runs = input(
    [],
    ...ngDevMode ? [{ debugName: "runs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  supersedes = input(
    null,
    ...ngDevMode ? [{ debugName: "supersedes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  created = output();
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  campaigns = signal(
    [],
    ...ngDevMode ? [{ debugName: "campaigns" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loadingCampaigns = signal(
    true,
    ...ngDevMode ? [{ debugName: "loadingCampaigns" }] : (
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
  error = signal(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  f = { period_label: "", period_start: "", period_end: "", baseline_campaign_id: "", monitoring_campaign_id: "", supersedes_run_id: "" };
  canRun = computed(
    () => this.auth.can("calc.run"),
    ...ngDevMode ? [{ debugName: "canRun" }] : (
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
  monitorings = computed(
    () => this.campaigns().filter((c) => c.kind === "monitoring"),
    ...ngDevMode ? [{ debugName: "monitorings" }] : (
      /* istanbul ignore next */
      []
    )
  );
  supersedable = computed(
    () => this.runs().filter((r) => ["approved", "calculated", "rejected", "under_review"].includes(r.status)),
    ...ngDevMode ? [{ debugName: "supersedable" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const pid = this.projectId();
      if (!pid)
        return;
      this.loadingCampaigns.set(true);
      this.api.get(`/projects/${pid}/campaigns`).subscribe({
        next: (c) => {
          this.campaigns.set(c);
          this.loadingCampaigns.set(false);
          const b = c.filter((x) => x.kind === "baseline");
          const m = c.filter((x) => x.kind === "monitoring");
          if (!this.f.baseline_campaign_id && b.length)
            this.f.baseline_campaign_id = b[b.length - 1].id;
          if (!this.f.monitoring_campaign_id && m.length) {
            const last = m[m.length - 1];
            this.f.monitoring_campaign_id = last.id;
            if (!this.f.period_end && last.planned_end)
              this.f.period_end = last.planned_end.slice(0, 10);
          }
          this.cdr.markForCheck();
        },
        error: () => this.loadingCampaigns.set(false)
      });
    });
    effect(() => {
      const s = this.supersedes();
      const r = this.runs().find((x) => x.id === s);
      if (r) {
        this.f.supersedes_run_id = r.id;
        this.f.period_label = r.period_label;
        this.f.period_start = r.period_start;
        this.f.period_end = r.period_end;
        this.cdr.markForCheck();
      }
    });
  }
  badPeriod() {
    return !!(this.f.period_start && this.f.period_end && this.f.period_end <= this.f.period_start);
  }
  valid() {
    const f = this.f;
    return !!(f.period_label.trim() && f.period_start && f.period_end && !this.badPeriod() && f.baseline_campaign_id && f.monitoring_campaign_id);
  }
  run() {
    this.running.set(true);
    this.error.set(null);
    const body = __spreadProps(__spreadValues({}, this.f), { period_label: this.f.period_label.trim(), supersedes_run_id: this.f.supersedes_run_id || null });
    this.api.post(`/projects/${this.projectId()}/calculations`, body).subscribe({
      next: (r) => {
        this.running.set(false);
        this.toast.success("Calculation complete", `Net result ${r.net_t_co2e.toFixed(1)} tCO\u2082e. Review it, then send it for approval.`);
        this.created.emit(r);
        this.router.navigate(["/app/calculations", r.id]);
      },
      error: (e) => {
        this.running.set(false);
        this.error.set(e);
      }
    });
  }
  static \u0275fac = function NewRun_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NewRun)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NewRun, selectors: [["vc-new-run"]], inputs: { projectId: [1, "projectId"], runs: [1, "runs"], supersedes: [1, "supersedes"] }, outputs: { created: "created" }, decls: 2, vars: 1, consts: [[1, "card"], [1, "wrap"], ["icon", "lock", "title", "You can't start calculations", "text", "Carbon analysts run calculations. You can still review runs and their provenance."], [1, "card-head"], [1, "card-body"], [3, "rows"], [1, "form-grid"], [1, "field"], ["for", "pl"], ["id", "pl", "maxlength", "40", "placeholder", "e.g. 2025-26", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], ["for", "ps"], ["id", "ps", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "pe"], ["id", "pe", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], [1, "error"], ["for", "bc"], ["id", "bc", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["for", "mc"], ["id", "mc", 1, "input", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], ["for", "sr"], [1, "subtle"], ["id", "sr", 1, "input", 3, "ngModelChange", "ngModel"], [1, "card-foot"], [1, "subtle", "small", "grow"], [1, "btn", "btn-primary", 3, "click", "disabled"], [3, "name"], [1, "stack", "side"], [3, "error"], ["tone", "info", "icon", "info"], ["tone", "warn", "icon", "users"]], template: function NewRun_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, NewRun_Conditional_0_Template, 2, 0, "section", 0)(1, NewRun_Conditional_1_Template, 63, 16, "div", 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(!ctx.canRun() ? 0 : 1);
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, Icon, Callout, Empty, Loading, CalcBlocker, DayPipe, HumanPipe, NumPipe], styles: ["\n.wrap[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 1fr);\n  gap: 20px;\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .wrap[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.grow[_ngcontent-%COMP%] {\n  flex: 1;\n}\nol[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  padding-left: 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  color: var(--%NS%stone-700);\n}\n.side[_ngcontent-%COMP%] {\n  --%NS%gap:12px;\n}\n/*# sourceMappingURL=new-run.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NewRun, [{
    type: Component,
    args: [{ selector: "vc-new-run", imports: [FormsModule, Icon, Callout, Empty, Loading, CalcBlocker, DayPipe, HumanPipe, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (!canRun()) {
      <section class="card"><vc-empty icon="lock" title="You can't start calculations"
        text="Carbon analysts run calculations. You can still review runs and their provenance." /></section>
    } @else {
      <div class="wrap">
        <section class="card">
          <div class="card-head"><h3>New calculation run</h3></div>
          <div class="card-body">
            @if (loadingCampaigns()) { <vc-loading [rows]="3" /> }
            <div class="form-grid">
              <div class="field">
                <label for="pl">Monitoring period label</label>
                <input id="pl" class="input" [(ngModel)]="f.period_label" maxlength="40" placeholder="e.g. 2025-26" />
                <span class="hint">Approved term estimates with the same label are used.</span>
              </div>
              <div class="field"></div>
              <div class="field">
                <label for="ps">Period start</label>
                <input id="ps" class="input" type="date" [(ngModel)]="f.period_start" />
              </div>
              <div class="field">
                <label for="pe">Period end</label>
                <input id="pe" class="input" type="date" [(ngModel)]="f.period_end" [class.invalid]="badPeriod()" />
                @if (badPeriod()) { <span class="error">The period must end after it starts.</span> }
              </div>
              <div class="field">
                <label for="bc">Baseline campaign</label>
                <select id="bc" class="input" [(ngModel)]="f.baseline_campaign_id">
                  <option value="">Choose\u2026</option>
                  @for (c of baselines(); track c.id) { <option [value]="c.id">{{ c.code }} \xB7 {{ c.name }} ({{ c.design }})</option> }
                </select>
                @if (!loadingCampaigns() && !baselines().length) { <span class="error">This project has no baseline campaign.</span> }
              </div>
              <div class="field">
                <label for="mc">Monitoring campaign</label>
                <select id="mc" class="input" [(ngModel)]="f.monitoring_campaign_id">
                  <option value="">Choose\u2026</option>
                  @for (c of monitorings(); track c.id) { <option [value]="c.id">{{ c.code }} \xB7 {{ c.name }} ({{ c.design }})</option> }
                </select>
                @if (!loadingCampaigns() && !monitorings().length) { <span class="hint">No monitoring campaign yet \u2014 a re-measurement is needed to calculate a change.</span> }
              </div>
              <div class="field span-2">
                <label for="sr">Replaces an earlier run <span class="subtle">(optional)</span></label>
                <select id="sr" class="input" [(ngModel)]="f.supersedes_run_id">
                  <option value="">No \u2014 this is the first run for the period</option>
                  @for (r of supersedable(); track r.id) {
                    <option [value]="r.id">{{ r.period_label }} \xB7 {{ r.status | human }} \xB7 {{ r.net_t_co2e | num: 1 }} tCO\u2082e \xB7 {{ r.created_at | day }}</option>
                  }
                </select>
                <span class="hint">Only runs for the same period label can be replaced. When approved, the old run is marked superseded and its field claims are released.</span>
              </div>
            </div>
          </div>
          <div class="card-foot">
            <span class="subtle small grow">Quality checks run first. The engine reads only accepted, versioned data and freezes every input.</span>
            <button class="btn btn-primary" [disabled]="!valid() || running()" (click)="run()">
              <vc-icon [name]="running() ? 'refresh' : 'play'" />{{ running() ? 'Calculating\u2026' : 'Run calculation' }}
            </button>
          </div>
        </section>

        <aside class="stack side">
          @if (error()) {
            <vc-calc-blocker [error]="error()" />
          } @else {
            <vc-callout tone="info" icon="info">
              <strong>What happens when you run</strong>
              <ol>
                <li>Project quality checks run. Any open blocking issue stops the run.</li>
                <li>Every sample, layer and accepted lab result for both campaigns is read and frozen.</li>
                <li>The approved methodology rules decide the stock method, uncertainty and buffer.</li>
                <li>The result gets a fingerprint of its inputs, so anyone can check it was not changed.</li>
              </ol>
            </vc-callout>
            <vc-callout tone="warn" icon="users">
              A run you create must be approved by a colleague with approval rights \u2014 never by you.
            </vc-callout>
          }
        </aside>
      </div>
    }
  `, styles: ["/* angular:styles/component:scss;905b0915c806b130;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\calculations\\new-run.ts */\n.wrap {\n  display: grid;\n  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 1fr);\n  gap: 20px;\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .wrap {\n    grid-template-columns: 1fr;\n  }\n}\n.grow {\n  flex: 1;\n}\nol {\n  margin: 8px 0 0;\n  padding-left: 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  color: var(--stone-700);\n}\n.side {\n  --gap:12px;\n}\n/*# sourceMappingURL=new-run.css.map */\n"] }]
  }], () => [], { projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }], runs: [{ type: Input, args: [{ isSignal: true, alias: "runs", required: false }] }], supersedes: [{ type: Input, args: [{ isSignal: true, alias: "supersedes", required: false }] }], created: [{ type: Output, args: ["created"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NewRun, { className: "NewRun", filePath: "src/app/features/calculations/new-run.ts", lineNumber: 108 });
})();

// src/app/features/calculations/readiness-panel.ts
var _forTrack02 = ($index, $item) => $item.key;
function ReadinessPanel_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 1);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function ReadinessPanel_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-error", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function ReadinessPanel_Conditional_3_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 14);
    \u0275\u0275element(2, "vc-icon", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 16)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 17);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const dm_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(dm_r3.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r0.icon(dm_r3.status))("size", 15)("stroke", 2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(dm_r3.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dm_r3.detail);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.statusLabel(dm_r3.status));
  }
}
function ReadinessPanel_Conditional_3_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 12);
    \u0275\u0275repeaterCreate(1, ReadinessPanel_Conditional_3_Conditional_17_For_2_Template, 10, 8, "li", 13, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(d_r4.dimensions);
  }
}
function ReadinessPanel_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 5)(2, "span", 6);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6, "%");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 7)(8, "div", 8);
    \u0275\u0275text(9, "Calculation readiness");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "h2");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 9);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "button", 10);
    \u0275\u0275listener("click", function ReadinessPanel_Conditional_3_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.manual.set(!ctx_r0.open()));
    });
    \u0275\u0275text(15);
    \u0275\u0275element(16, "vc-icon", 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(17, ReadinessPanel_Conditional_3_Conditional_17_Template, 3, 0, "ul", 12);
  }
  if (rf & 2) {
    const d_r4 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r0.tone());
    \u0275\u0275styleProp("--%NS%p", d_r4.score_pct);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 13, d_r4.score_pct, 0));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.headline());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3(" ", ctx_r0.counts().ok, " ready \xB7 ", ctx_r0.counts().warning, " need attention \xB7 ", ctx_r0.counts().blocking, " blocking. A calculation refuses to run while any blocking quality issue is open; warnings are allowed but will be visible to the verifier. ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.open() ? "Hide checklist" : "Show checklist", " ");
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.open() ? "chevron-down" : "chevron-right")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.open() ? 17 : -1);
  }
}
var ReadinessPanel = class _ReadinessPanel {
  data = input(
    null,
    ...ngDevMode ? [{ debugName: "data" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loading = input(
    false,
    ...ngDevMode ? [{ debugName: "loading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  error = input(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  manual = signal(
    null,
    ...ngDevMode ? [{ debugName: "manual" }] : (
      /* istanbul ignore next */
      []
    )
  );
  open = computed(
    () => this.manual() ?? this.counts().blocking + this.counts().warning > 0,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  counts = computed(
    () => {
      const c = { ok: 0, warning: 0, blocking: 0 };
      for (const d of this.data()?.dimensions ?? [])
        c[d.status]++;
      return c;
    },
    ...ngDevMode ? [{ debugName: "counts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tone = computed(
    () => this.counts().blocking ? "danger" : this.counts().warning ? "warn" : "ok",
    ...ngDevMode ? [{ debugName: "tone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  headline = computed(
    () => {
      const c = this.counts();
      if (c.blocking)
        return `${c.blocking} item${c.blocking > 1 ? "s" : ""} must be resolved before credits can be issued`;
      if (c.warning)
        return "Ready to calculate, with items to tidy up";
      return "Everything is in place";
    },
    ...ngDevMode ? [{ debugName: "headline" }] : (
      /* istanbul ignore next */
      []
    )
  );
  icon(s) {
    return s === "ok" ? "check" : s === "warning" ? "alert" : "x";
  }
  statusLabel(s) {
    return s === "ok" ? "Ready" : s === "warning" ? "Attention" : "Blocking";
  }
  static \u0275fac = function ReadinessPanel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReadinessPanel)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReadinessPanel, selectors: [["vc-readiness-panel"]], inputs: { data: [1, "data"], loading: [1, "loading"], error: [1, "error"] }, decls: 4, vars: 1, consts: [[1, "card"], [3, "rows"], [1, "card-body"], ["title", "Couldn't check readiness", 3, "message"], [1, "head"], [1, "ring"], [1, "num"], [1, "t"], [1, "eyebrow"], [1, "muted", "small"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [3, "name", "size"], [1, "dims"], [3, "class"], [1, "ic"], [3, "name", "size", "stroke"], [1, "txt"], [1, "st"]], template: function ReadinessPanel_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0);
      \u0275\u0275conditionalCreate(1, ReadinessPanel_Conditional_1_Template, 1, 1, "vc-loading", 1)(2, ReadinessPanel_Conditional_2_Template, 2, 1, "div", 2)(3, ReadinessPanel_Conditional_3_Template, 18, 16);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 1 : ctx.error() ? 2 : (tmp_0_0 = ctx.data()) ? 3 : -1, tmp_0_0);
    }
  }, dependencies: [Icon, Loading, ErrorBox, NumPipe], styles: ["\n.head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 18px;\n  padding: 18px 20px;\n}\n.t[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n}\nh2[_ngcontent-%COMP%] {\n  margin: 2px 0 4px;\n}\n.ring[_ngcontent-%COMP%] {\n  --%NS%c:var(--%NS%forest-500);\n  flex: none;\n  width: 64px;\n  height: 64px;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  background: conic-gradient(var(--%NS%c) calc(var(--%NS%p) * 1%), var(--%NS%sand-200) 0);\n}\n.ring.warn[_ngcontent-%COMP%] {\n  --%NS%c:var(--%NS%amber-600);\n}\n.ring.danger[_ngcontent-%COMP%] {\n  --%NS%c:var(--%NS%red-600);\n}\n.ring[_ngcontent-%COMP%]   .num[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 52px;\n  height: 52px;\n  border-radius: 50%;\n  background: var(--%NS%surface);\n  font-weight: 600;\n  font-size: 16px;\n}\n.ring[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 10px;\n  color: var(--%NS%text-3);\n  margin-left: 1px;\n  margin-top: 3px;\n}\n.dims[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 4px 20px 16px;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0 28px;\n  border-top: 1px solid var(--%NS%border);\n}\n@media (max-width: 1000px) {\n  .dims[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\nli[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  padding: 11px 0;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.ic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  margin-top: 1px;\n}\nli.ok[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-600);\n}\nli.warning[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\nli.blocking[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.txt[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n.txt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 500;\n  font-size: 13.5px;\n}\n.txt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.st[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  font-weight: 500;\n  color: var(--%NS%text-3);\n  white-space: nowrap;\n  padding-top: 3px;\n}\nli.blocking[_ngcontent-%COMP%]   .st[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\nli.warning[_ngcontent-%COMP%]   .st[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n/*# sourceMappingURL=readiness-panel.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReadinessPanel, [{
    type: Component,
    args: [{ selector: "vc-readiness-panel", imports: [Icon, Loading, ErrorBox, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="3" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't check readiness" [message]="error()!" /></div>
      } @else if (data(); as d) {
        <div class="head">
          <div class="ring" [style.--p]="d.score_pct" [class]="tone()">
            <span class="num">{{ d.score_pct | num: 0 }}<small>%</small></span>
          </div>
          <div class="t">
            <div class="eyebrow">Calculation readiness</div>
            <h2>{{ headline() }}</h2>
            <p class="muted small">
              {{ counts().ok }} ready \xB7 {{ counts().warning }} need attention \xB7 {{ counts().blocking }} blocking.
              A calculation refuses to run while any blocking quality issue is open; warnings are allowed but will be visible to the verifier.
            </p>
          </div>
          <button class="btn btn-ghost btn-sm" (click)="manual.set(!open())">
            {{ open() ? 'Hide checklist' : 'Show checklist' }}
            <vc-icon [name]="open() ? 'chevron-down' : 'chevron-right'" [size]="14" />
          </button>
        </div>
        @if (open()) {
          <ul class="dims">
            @for (dm of d.dimensions; track dm.key) {
              <li [class]="dm.status">
                <span class="ic"><vc-icon [name]="icon(dm.status)" [size]="15" [stroke]="2" /></span>
                <div class="txt"><strong>{{ dm.label }}</strong><span>{{ dm.detail }}</span></div>
                <span class="st">{{ statusLabel(dm.status) }}</span>
              </li>
            }
          </ul>
        }
      }
    </section>
  `, styles: ["/* angular:styles/component:scss;321b115985fc27cc;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\calculations\\readiness-panel.ts */\n.head {\n  display: flex;\n  align-items: center;\n  gap: 18px;\n  padding: 18px 20px;\n}\n.t {\n  flex: 1;\n  min-width: 0;\n}\n.eyebrow {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--text-3);\n}\nh2 {\n  margin: 2px 0 4px;\n}\n.ring {\n  --c:var(--forest-500);\n  flex: none;\n  width: 64px;\n  height: 64px;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  background: conic-gradient(var(--c) calc(var(--p) * 1%), var(--sand-200) 0);\n}\n.ring.warn {\n  --c:var(--amber-600);\n}\n.ring.danger {\n  --c:var(--red-600);\n}\n.ring .num {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 52px;\n  height: 52px;\n  border-radius: 50%;\n  background: var(--surface);\n  font-weight: 600;\n  font-size: 16px;\n}\n.ring small {\n  font-size: 10px;\n  color: var(--text-3);\n  margin-left: 1px;\n  margin-top: 3px;\n}\n.dims {\n  list-style: none;\n  margin: 0;\n  padding: 4px 20px 16px;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0 28px;\n  border-top: 1px solid var(--border);\n}\n@media (max-width: 1000px) {\n  .dims {\n    grid-template-columns: 1fr;\n  }\n}\nli {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  padding: 11px 0;\n  border-bottom: 1px solid var(--stone-100);\n}\n.ic {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  margin-top: 1px;\n}\nli.ok .ic {\n  background: var(--ok-soft);\n  color: var(--forest-600);\n}\nli.warning .ic {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\nli.blocking .ic {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.txt {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n.txt strong {\n  font-weight: 500;\n  font-size: 13.5px;\n}\n.txt span {\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.st {\n  font-size: 11.5px;\n  font-weight: 500;\n  color: var(--text-3);\n  white-space: nowrap;\n  padding-top: 3px;\n}\nli.blocking .st {\n  color: var(--red-600);\n}\nli.warning .st {\n  color: var(--amber-600);\n}\n/*# sourceMappingURL=readiness-panel.css.map */\n"] }]
  }], null, { data: [{ type: Input, args: [{ isSignal: true, alias: "data", required: false }] }], loading: [{ type: Input, args: [{ isSignal: true, alias: "loading", required: false }] }], error: [{ type: Input, args: [{ isSignal: true, alias: "error", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReadinessPanel, { className: "ReadinessPanel", filePath: "src/app/features/calculations/readiness-panel.ts", lineNumber: 74 });
})();

// src/app/features/calculations/terms-tab.ts
var _forTrack03 = ($index, $item) => $item.period;
var _forTrack1 = ($index, $item) => $item.current.id;
var _forTrack2 = ($index, $item) => $item.id;
function TermsTab_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function TermsTab_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.startNew());
    });
    \u0275\u0275element(1, "vc-icon", 25);
    \u0275\u0275text(2, "Record estimate");
    \u0275\u0275elementEnd();
  }
}
function TermsTab_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 3);
    \u0275\u0275element(1, "vc-loading", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 5);
  }
}
function TermsTab_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 4);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function TermsTab_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function TermsTab_Conditional_6_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.startNew());
    });
    \u0275\u0275element(1, "vc-icon", 25);
    \u0275\u0275text(2, "Record estimate");
    \u0275\u0275elementEnd();
  }
}
function TermsTab_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 3)(1, "vc-empty", 27);
    \u0275\u0275conditionalCreate(2, TermsTab_Conditional_6_Conditional_2_Template, 3, 0, "button", 2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canCreate() ? 2 : -1);
  }
}
function TermsTab_Conditional_7_For_1_For_31_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function TermsTab_Conditional_7_For_1_For_31_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const r_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggle(r_r5.current.id));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.expanded().has(r_r5.current.id) ? "hide" : r_r5.older.length + " earlier");
  }
}
function TermsTab_Conditional_7_For_1_For_31_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275elementStart(1, "div", 16);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.people.name(r_r5.current.approved_by, "Unknown"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 2, r_r5.current.approved_at));
  }
}
function TermsTab_Conditional_7_For_1_For_31_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function TermsTab_Conditional_7_For_1_For_31_Conditional_38_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 46);
    \u0275\u0275element(1, "vc-icon", 48);
    \u0275\u0275text(2, "Needs a colleague");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function TermsTab_Conditional_7_For_1_For_31_Conditional_38_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 49);
    \u0275\u0275listener("click", function TermsTab_Conditional_7_For_1_For_31_Conditional_38_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const r_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.approving.set(r_r5.current));
    });
    \u0275\u0275element(1, "vc-icon", 50);
    \u0275\u0275text(2, "Approve");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function TermsTab_Conditional_7_For_1_For_31_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TermsTab_Conditional_7_For_1_For_31_Conditional_38_Conditional_0_Template, 3, 1, "span", 46)(1, TermsTab_Conditional_7_For_1_For_31_Conditional_38_Conditional_1_Template, 3, 1, "button", 47);
  }
  if (rf & 2) {
    const r_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.isMine(r_r5.current) ? 0 : 1);
  }
}
function TermsTab_Conditional_7_For_1_For_31_Conditional_39_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 51)(1, "td", 30);
    \u0275\u0275text(2, "\u21B3 earlier version");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 33);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "num");
    \u0275\u0275elementStart(8, "span", 40);
    \u0275\u0275text(9, "tCO\u2082e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 33);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 33);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 41)(17, "span", 42);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td");
    \u0275\u0275element(20, "vc-badge", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 52);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td", 52);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "td");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("v", o_r7.version);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 9, o_r7.value_t_co2e, 2), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(12, 12, o_r7.variance, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(o_r7.df === null ? "\u2014" : \u0275\u0275pipeBind2(15, 15, o_r7.df, 1));
    \u0275\u0275advance(3);
    \u0275\u0275property("title", o_r7.source);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(o_r7.source);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", o_r7.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.people.name(o_r7.created_by, "Unknown"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 18, o_r7.approved_at));
  }
}
function TermsTab_Conditional_7_For_1_For_31_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, TermsTab_Conditional_7_For_1_For_31_Conditional_39_For_1_Template, 27, 20, "tr", 51, _forTrack2);
  }
  if (rf & 2) {
    const r_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275repeater(r_r5.older);
  }
}
function TermsTab_Conditional_7_For_1_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 34)(2, "strong", 35);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 36);
    \u0275\u0275element(5, "vc-icon", 37);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 34);
    \u0275\u0275text(7);
    \u0275\u0275conditionalCreate(8, TermsTab_Conditional_7_For_1_For_31_Conditional_8_Template, 2, 1, "button", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 39)(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(13, "\xA0");
    \u0275\u0275elementStart(14, "span", 40);
    \u0275\u0275text(15, "tCO\u2082e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 39);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "num");
    \u0275\u0275elementStart(19, "span", 40);
    \u0275\u0275text(20, "(tCO\u2082e)\xB2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "td", 33);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td", 41)(25, "span", 42);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "td");
    \u0275\u0275element(28, "vc-badge", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "td", 44);
    \u0275\u0275text(30);
    \u0275\u0275elementStart(31, "div", 16);
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "td", 44);
    \u0275\u0275conditionalCreate(35, TermsTab_Conditional_7_For_1_For_31_Conditional_35_Template, 4, 4)(36, TermsTab_Conditional_7_For_1_For_31_Conditional_36_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "td", 34);
    \u0275\u0275conditionalCreate(38, TermsTab_Conditional_7_For_1_For_31_Conditional_38_Template, 2, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(39, TermsTab_Conditional_7_For_1_For_31_Conditional_39_Template, 2, 0);
  }
  if (rf & 2) {
    const r_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.label(r_r5.current.term));
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.help(r_r5.current.term));
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" v", r_r5.current.version, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r5.older.length ? 8 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(12, 16, r_r5.current.value_t_co2e, 2));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(18, 19, r_r5.current.variance, 3), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r5.current.df === null ? "\u2014" : \u0275\u0275pipeBind2(23, 22, r_r5.current.df, 1));
    \u0275\u0275advance(3);
    \u0275\u0275property("title", r_r5.current.source);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r5.current.source);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", r_r5.current.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.people.name(r_r5.current.created_by, "Unknown"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(33, 25, r_r5.current.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(r_r5.current.approved_by ? 35 : 36);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(r_r5.current.status === "draft" && ctx_r1.canApprove() ? 38 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.expanded().has(r_r5.current.id) ? 39 : -1);
  }
}
function TermsTab_Conditional_7_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 28)(1, "div", 29)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 30);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 31)(7, "table", 32)(8, "thead")(9, "tr")(10, "th");
    \u0275\u0275text(11, "Term");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Version");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 33);
    \u0275\u0275text(15, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 33);
    \u0275\u0275text(17, "Variance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 33);
    \u0275\u0275text(19, "df");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th");
    \u0275\u0275text(23, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "th");
    \u0275\u0275text(25, "Recorded");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "th");
    \u0275\u0275text(27, "Approved");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "tbody");
    \u0275\u0275repeaterCreate(30, TermsTab_Conditional_7_For_1_For_31_Template, 40, 27, null, null, _forTrack1);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const g_r8 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Period ", g_r8.period);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", g_r8.rows.length, " term(s)");
    \u0275\u0275advance(25);
    \u0275\u0275repeater(g_r8.rows);
  }
}
function TermsTab_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, TermsTab_Conditional_7_For_1_Template, 32, 2, "section", 28, _forTrack03);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.groups());
  }
}
function TermsTab_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", t_r9);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.label(t_r9));
  }
}
function TermsTab_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "vc-error", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function TermsTab_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 54)(1, "dt");
    \u0275\u0275text(2, "Term");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dt");
    \u0275\u0275text(6, "Period");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dd");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dt");
    \u0275\u0275text(10, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dd", 33);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "num");
    \u0275\u0275element(14, "vc-dc", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "dt");
    \u0275\u0275text(16, "Variance \xB7 df");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "dd", 33);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dt");
    \u0275\u0275text(21, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dd");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dt");
    \u0275\u0275text(25, "Recorded by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "dd");
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "vc-callout", 56);
    \u0275\u0275text(30, " Four-eyes rule: you can approve this because someone else recorded it. Approving replaces any earlier approved version for this period. ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r10 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r1.label(a_r10.term), " \xB7 v", a_r10.version);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(a_r10.period_label);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(13, 9, a_r10.value_t_co2e, 2), " tCO\u2082e ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(19, 12, a_r10.variance, 3), " \xB7 ", a_r10.df ?? "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(a_r10.source);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r1.people.name(a_r10.created_by, "Unknown"), " on ", \u0275\u0275pipeBind1(28, 15, a_r10.created_at));
  }
}
var TermsTab = class _TermsTab {
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  people = inject(People);
  terms = signal(
    [],
    ...ngDevMode ? [{ debugName: "terms" }] : (
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
  expanded = signal(
    /* @__PURE__ */ new Set(),
    ...ngDevMode ? [{ debugName: "expanded" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approving = signal(
    null,
    ...ngDevMode ? [{ debugName: "approving" }] : (
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
  termKeys = Object.keys(TERM_LABELS);
  f = this.blank();
  canCreate = computed(
    () => this.auth.can("calc.run", "rules.edit"),
    ...ngDevMode ? [{ debugName: "canCreate" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canApprove = computed(
    () => this.auth.can("rules.approve"),
    ...ngDevMode ? [{ debugName: "canApprove" }] : (
      /* istanbul ignore next */
      []
    )
  );
  groups = computed(
    () => {
      const by = /* @__PURE__ */ new Map();
      for (const t of this.terms()) {
        if (!by.has(t.period_label))
          by.set(t.period_label, /* @__PURE__ */ new Map());
        const m = by.get(t.period_label);
        if (!m.has(t.term))
          m.set(t.term, []);
        m.get(t.term).push(t);
      }
      return [...by.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([period, m]) => ({
        period,
        rows: [...m.values()].map((list) => {
          const sorted = [...list].sort((a, b) => b.version - a.version);
          return { current: sorted[0], older: sorted.slice(1) };
        })
      }));
    },
    ...ngDevMode ? [{ debugName: "groups" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.people.load();
    effect(() => {
      if (this.projectId())
        this.load();
    });
  }
  label = termLabel;
  help(t) {
    return TERM_HELP[t] ?? "";
  }
  isMine(t) {
    return t.created_by === this.auth.profile()?.id;
  }
  toggle(id) {
    const s = new Set(this.expanded());
    s.has(id) ? s.delete(id) : s.add(id);
    this.expanded.set(s);
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/projects/${this.projectId()}/terms`).subscribe({
      next: (r) => {
        this.terms.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  blank() {
    return { period_label: "", term: "baseline_emissions", value_t_co2e: null, variance: 0, df: null, source: "" };
  }
  startNew() {
    this.f = this.blank();
    const latest = this.groups()[0]?.period;
    if (latest)
      this.f.period_label = latest;
    this.formError.set(null);
    this.formOpen.set(true);
  }
  formValid() {
    return this.f.period_label.trim() && this.f.value_t_co2e !== null && this.f.variance !== null && this.f.variance >= 0 && this.f.source.trim().length >= 5;
  }
  save() {
    this.saving.set(true);
    this.formError.set(null);
    const body = __spreadProps(__spreadValues({}, this.f), { period_label: this.f.period_label.trim(), df: this.f.df || null });
    this.api.post(`/projects/${this.projectId()}/terms`, body).subscribe({
      next: (t) => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.terms.update((l) => [...l, t]);
        this.toast.success("Estimate saved as draft", `${termLabel(t.term)} v${t.version} is waiting for approval.`);
      },
      error: (e) => {
        this.saving.set(false);
        const fields = e.details?.["fields"] ?? [];
        this.formError.set(fields.length ? fields.map((x) => `${x.field.replace(/_/g, " ")}: ${x.message}`).join(". ") : e.message);
      }
    });
  }
  approve() {
    const a = this.approving();
    if (!a)
      return;
    this.saving.set(true);
    this.api.post(`/terms/${a.id}/approve`).subscribe({
      next: (t) => {
        this.saving.set(false);
        this.approving.set(null);
        this.terms.update((l) => l.map((x) => x.id === t.id ? t : x.period_label === t.period_label && x.term === t.term && x.status === "approved" ? __spreadProps(__spreadValues({}, x), { status: "superseded" }) : x));
        this.toast.success("Estimate approved");
      },
      error: (e) => {
        this.saving.set(false);
        this.toast.apiError(e, e.code === "SELF_APPROVAL_REJECTED" ? "You recorded this estimate" : "Couldn't approve");
      }
    });
  }
  static \u0275fac = function TermsTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TermsTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TermsTab, selectors: [["vc-terms-tab"]], inputs: { projectId: [1, "projectId"] }, decls: 61, vars: 16, consts: [[1, "bar"], [1, "muted", "small", "intro"], [1, "btn", "btn-primary"], [1, "card"], ["title", "Couldn't load decided terms", 3, "message"], ["title", "Record a term estimate", "subtitle", "The estimate is saved as a draft and must be approved by a methodology scientist.", "width", "620px", 3, "openChange", "open"], [1, "form-grid"], [1, "field"], ["placeholder", "e.g. 2025-26", "maxlength", "40", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], [1, "input", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "span-2"], ["tone", "info", "icon", "info"], ["type", "number", "step", "any", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["type", "number", "step", "any", "min", "0", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "subtle"], [1, "field", "span-2"], ["rows", "3", "placeholder", "e.g. IPCC 2019 Tier 1 N\u2082O factors applied to farm fertiliser records, 42 farms; see calculation workbook v3", 1, "input", 3, "ngModelChange", "ngModel"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["title", "Approve term estimate", "width", "520px", 3, "closed", "open"], ["name", "check"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [3, "rows"], ["icon", "sigma", "title", "No term estimates yet", "text", "If the methodology rules require baseline emissions, project emissions or leakage, record the estimates here before running a calculation."], [1, "card", "grp"], [1, "card-head"], [1, "subtle", "small"], [1, "table-wrap"], [1, "table"], [1, "num"], [1, "nowrap"], [1, "tn"], [1, "hi", 3, "title"], ["name", "info", 3, "size"], [1, "lnk"], [1, "num", "nowrap"], [1, "u"], [1, "src"], [3, "title"], [3, "status"], [1, "nowrap", "small"], [1, "lnk", 3, "click"], ["title", "You recorded this estimate, so a colleague must approve it.", 1, "own"], [1, "btn", "btn-secondary", "btn-sm"], ["name", "lock", 3, "size"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "check", 3, "size"], [1, "old"], [1, "small"], ["title", "Couldn't save", 3, "message"], [1, "kv"], ["cls", "RECORDED"], ["tone", "info", "icon", "users", 2, "margin-top", "16px"]], template: function TermsTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "p", 1);
      \u0275\u0275text(2, " Project-level terms are decided outside the soil sampling \u2014 from activity data, emission factors or models \u2014 and entered here with their variance and source. One person records an estimate and a methodology scientist approves it. Each change is a new version; the newest approved version is used. ");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, TermsTab_Conditional_3_Template, 3, 0, "button", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, TermsTab_Conditional_4_Template, 2, 1, "section", 3)(5, TermsTab_Conditional_5_Template, 1, 1, "vc-error", 4)(6, TermsTab_Conditional_6_Template, 3, 1, "section", 3)(7, TermsTab_Conditional_7_Template, 2, 0);
      \u0275\u0275elementStart(8, "vc-modal", 5);
      \u0275\u0275twoWayListener("openChange", function TermsTab_Template_vc_modal_openChange_8_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formOpen, $event) || (ctx.formOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(9, "div", 6)(10, "div", 7)(11, "label");
      \u0275\u0275text(12, "Monitoring period");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "input", 8);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function TermsTab_Template_input_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.period_label, $event) || (ctx.f.period_label = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "span", 9);
      \u0275\u0275text(15, "Must match the period label of the calculation.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 7)(17, "label");
      \u0275\u0275text(18, "Term");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function TermsTab_Template_select_ngModelChange_19_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.term, $event) || (ctx.f.term = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(20, TermsTab_For_21_Template, 2, 2, "option", 11, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 12)(23, "vc-callout", 13);
      \u0275\u0275text(24);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 7)(26, "label");
      \u0275\u0275text(27, "Value (tCO\u2082e for the period)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "input", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function TermsTab_Template_input_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.value_t_co2e, $event) || (ctx.f.value_t_co2e = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 7)(30, "label");
      \u0275\u0275text(31, "Variance ((tCO\u2082e)\xB2)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "input", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function TermsTab_Template_input_ngModelChange_32_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.variance, $event) || (ctx.f.variance = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "span", 9);
      \u0275\u0275text(34, "Square of the standard error. Use 0 only if the value is exact.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "div", 7)(36, "label");
      \u0275\u0275text(37, "Degrees of freedom ");
      \u0275\u0275elementStart(38, "span", 16);
      \u0275\u0275text(39, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "input", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function TermsTab_Template_input_ngModelChange_40_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.df, $event) || (ctx.f.df = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "span", 9);
      \u0275\u0275text(42, "Needed if the variance is above zero, for the uncertainty deduction.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(43, "div", 17)(44, "label");
      \u0275\u0275text(45, "Source and method");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "textarea", 18);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function TermsTab_Template_textarea_ngModelChange_46_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.source, $event) || (ctx.f.source = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(47, TermsTab_Conditional_47_Template, 2, 1, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(48, 19);
      \u0275\u0275elementStart(49, "button", 20);
      \u0275\u0275listener("click", function TermsTab_Template_button_click_49_listener() {
        return ctx.formOpen.set(false);
      });
      \u0275\u0275text(50, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "button", 21);
      \u0275\u0275listener("click", function TermsTab_Template_button_click_51_listener() {
        return ctx.save();
      });
      \u0275\u0275text(52);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "vc-modal", 22);
      \u0275\u0275listener("closed", function TermsTab_Template_vc_modal_closed_53_listener() {
        return ctx.approving.set(null);
      });
      \u0275\u0275conditionalCreate(54, TermsTab_Conditional_54_Template, 31, 17);
      \u0275\u0275elementContainerStart(55, 19);
      \u0275\u0275elementStart(56, "button", 20);
      \u0275\u0275listener("click", function TermsTab_Template_button_click_56_listener() {
        return ctx.approving.set(null);
      });
      \u0275\u0275text(57, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "button", 21);
      \u0275\u0275listener("click", function TermsTab_Template_button_click_58_listener() {
        return ctx.approve();
      });
      \u0275\u0275element(59, "vc-icon", 23);
      \u0275\u0275text(60, "Approve estimate");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_21_0;
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.canCreate() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 4 : ctx.error() ? 5 : !ctx.groups().length ? 6 : 7);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.formOpen);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.period_label);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.term);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.termKeys);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.help(ctx.f.term));
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.value_t_co2e);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.variance);
      \u0275\u0275control();
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.df);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.source);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formError() ? 47 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving() || !ctx.formValid());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Saving\u2026" : "Save as draft");
      \u0275\u0275advance();
      \u0275\u0275property("open", !!ctx.approving());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_21_0 = ctx.approving()) ? 54 : -1, tmp_21_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxLengthValidator, MinValidator, NgModel, Icon, Badge, DataClass, Empty, ErrorBox, Loading, Modal, Callout, NumPipe, DayPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  margin-bottom: 16px;\n}\n.intro[_ngcontent-%COMP%] {\n  flex: 1;\n  max-width: 820px;\n}\n.grp[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.tn[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.hi[_ngcontent-%COMP%] {\n  display: inline-flex;\n  vertical-align: -2px;\n  margin-left: 6px;\n  color: var(--%NS%text-3);\n  cursor: help;\n}\n.u[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n  margin-left: 3px;\n}\n.src[_ngcontent-%COMP%] {\n  max-width: 260px;\n}\n.src[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--%NS%text-2);\n  font-size: 13px;\n}\n.lnk[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  color: var(--%NS%primary);\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n  margin-left: 6px;\n  padding: 0;\n}\n.lnk[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\ntr.old[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%surface-2);\n  color: var(--%NS%text-2);\n}\n.own[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n/*# sourceMappingURL=terms-tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TermsTab, [{
    type: Component,
    args: [{ selector: "vc-terms-tab", imports: [FormsModule, Icon, Badge, DataClass, Empty, ErrorBox, Loading, Modal, Callout, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <p class="muted small intro">
        Project-level terms are decided outside the soil sampling \u2014 from activity data, emission factors or models \u2014 and
        entered here with their variance and source. One person records an estimate and a methodology scientist approves it.
        Each change is a new version; the newest approved version is used.
      </p>
      @if (canCreate()) {
        <button class="btn btn-primary" (click)="startNew()"><vc-icon name="plus" />Record estimate</button>
      }
    </div>

    @if (loading()) {
      <section class="card"><vc-loading [rows]="5" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load decided terms" [message]="error()!" />
    } @else if (!groups().length) {
      <section class="card">
        <vc-empty icon="sigma" title="No term estimates yet"
          text="If the methodology rules require baseline emissions, project emissions or leakage, record the estimates here before running a calculation.">
          @if (canCreate()) { <button class="btn btn-primary" (click)="startNew()"><vc-icon name="plus" />Record estimate</button> }
        </vc-empty>
      </section>
    } @else {
      @for (g of groups(); track g.period) {
        <section class="card grp">
          <div class="card-head"><h3>Period {{ g.period }}</h3><span class="subtle small">{{ g.rows.length }} term(s)</span></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Term</th><th>Version</th><th class="num">Value</th><th class="num">Variance</th><th class="num">df</th>
                <th>Source</th><th>Status</th><th>Recorded</th><th>Approved</th><th></th>
              </tr></thead>
              <tbody>
                @for (r of g.rows; track r.current.id) {
                  <tr>
                    <td class="nowrap"><strong class="tn">{{ label(r.current.term) }}</strong><span class="hi" [title]="help(r.current.term)"><vc-icon name="info" [size]="13" /></span></td>
                    <td class="nowrap">
                      v{{ r.current.version }}
                      @if (r.older.length) {
                        <button class="lnk" (click)="toggle(r.current.id)">{{ expanded().has(r.current.id) ? 'hide' : r.older.length + ' earlier' }}</button>
                      }
                    </td>
                    <td class="num nowrap"><strong>{{ r.current.value_t_co2e | num: 2 }}</strong>&nbsp;<span class="u">tCO\u2082e</span></td>
                    <td class="num nowrap">{{ r.current.variance | num: 3 }} <span class="u">(tCO\u2082e)\xB2</span></td>
                    <td class="num">{{ r.current.df === null ? '\u2014' : (r.current.df | num: 1) }}</td>
                    <td class="src"><span [title]="r.current.source">{{ r.current.source }}</span></td>
                    <td><vc-badge [status]="r.current.status" /></td>
                    <td class="nowrap small">{{ people.name(r.current.created_by, 'Unknown') }}<div class="subtle">{{ r.current.created_at | day }}</div></td>
                    <td class="nowrap small">
                      @if (r.current.approved_by) { {{ people.name(r.current.approved_by, 'Unknown') }}<div class="subtle">{{ r.current.approved_at | day }}</div> }
                      @else { <span class="subtle">\u2014</span> }
                    </td>
                    <td class="nowrap">
                      @if (r.current.status === 'draft' && canApprove()) {
                        @if (isMine(r.current)) {
                          <span class="own" title="You recorded this estimate, so a colleague must approve it."><vc-icon name="lock" [size]="13" />Needs a colleague</span>
                        } @else {
                          <button class="btn btn-secondary btn-sm" (click)="approving.set(r.current)"><vc-icon name="check" [size]="14" />Approve</button>
                        }
                      }
                    </td>
                  </tr>
                  @if (expanded().has(r.current.id)) {
                    @for (o of r.older; track o.id) {
                      <tr class="old">
                        <td class="subtle small">\u21B3 earlier version</td>
                        <td>v{{ o.version }}</td>
                        <td class="num">{{ o.value_t_co2e | num: 2 }} <span class="u">tCO\u2082e</span></td>
                        <td class="num">{{ o.variance | num: 3 }}</td>
                        <td class="num">{{ o.df === null ? '\u2014' : (o.df | num: 1) }}</td>
                        <td class="src"><span [title]="o.source">{{ o.source }}</span></td>
                        <td><vc-badge [status]="o.status" /></td>
                        <td class="small">{{ people.name(o.created_by, 'Unknown') }}</td>
                        <td class="small">{{ o.approved_at | day }}</td>
                        <td></td>
                      </tr>
                    }
                  }
                }
              </tbody>
            </table>
          </div>
        </section>
      }
    }

    <!-- record estimate -->
    <vc-modal [(open)]="formOpen" title="Record a term estimate" subtitle="The estimate is saved as a draft and must be approved by a methodology scientist." width="620px">
      <div class="form-grid">
        <div class="field">
          <label>Monitoring period</label>
          <input class="input" [(ngModel)]="f.period_label" placeholder="e.g. 2025-26" maxlength="40" />
          <span class="hint">Must match the period label of the calculation.</span>
        </div>
        <div class="field">
          <label>Term</label>
          <select class="input" [(ngModel)]="f.term">
            @for (t of termKeys; track t) { <option [value]="t">{{ label(t) }}</option> }
          </select>
        </div>
        <div class="span-2"><vc-callout tone="info" icon="info">{{ help(f.term) }}</vc-callout></div>
        <div class="field">
          <label>Value (tCO\u2082e for the period)</label>
          <input class="input num" type="number" step="any" [(ngModel)]="f.value_t_co2e" />
        </div>
        <div class="field">
          <label>Variance ((tCO\u2082e)\xB2)</label>
          <input class="input num" type="number" step="any" min="0" [(ngModel)]="f.variance" />
          <span class="hint">Square of the standard error. Use 0 only if the value is exact.</span>
        </div>
        <div class="field">
          <label>Degrees of freedom <span class="subtle">(optional)</span></label>
          <input class="input num" type="number" step="any" min="0" [(ngModel)]="f.df" />
          <span class="hint">Needed if the variance is above zero, for the uncertainty deduction.</span>
        </div>
        <div class="field span-2">
          <label>Source and method</label>
          <textarea class="input" [(ngModel)]="f.source" rows="3" placeholder="e.g. IPCC 2019 Tier 1 N\u2082O factors applied to farm fertiliser records, 42 farms; see calculation workbook v3"></textarea>
        </div>
        @if (formError()) { <div class="span-2"><vc-error title="Couldn't save" [message]="formError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving() || !formValid()" (click)="save()">{{ saving() ? 'Saving\u2026' : 'Save as draft' }}</button>
      </ng-container>
    </vc-modal>

    <!-- approve -->
    <vc-modal [open]="!!approving()" (closed)="approving.set(null)" title="Approve term estimate" width="520px">
      @if (approving(); as a) {
        <dl class="kv">
          <dt>Term</dt><dd>{{ label(a.term) }} \xB7 v{{ a.version }}</dd>
          <dt>Period</dt><dd>{{ a.period_label }}</dd>
          <dt>Value</dt><dd class="num">{{ a.value_t_co2e | num: 2 }} tCO\u2082e <vc-dc cls="RECORDED" /></dd>
          <dt>Variance \xB7 df</dt><dd class="num">{{ a.variance | num: 3 }} \xB7 {{ a.df ?? '\u2014' }}</dd>
          <dt>Source</dt><dd>{{ a.source }}</dd>
          <dt>Recorded by</dt><dd>{{ people.name(a.created_by, 'Unknown') }} on {{ a.created_at | day }}</dd>
        </dl>
        <vc-callout tone="info" icon="users" style="margin-top:16px">
          Four-eyes rule: you can approve this because someone else recorded it. Approving replaces any earlier approved version for this period.
        </vc-callout>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="approving.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving()" (click)="approve()"><vc-icon name="check" />Approve estimate</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;6f71a947c4d87b4b;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\calculations\\terms-tab.ts */\n.bar {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  margin-bottom: 16px;\n}\n.intro {\n  flex: 1;\n  max-width: 820px;\n}\n.grp {\n  margin-bottom: 16px;\n}\n.tn {\n  font-weight: 500;\n}\n.hi {\n  display: inline-flex;\n  vertical-align: -2px;\n  margin-left: 6px;\n  color: var(--text-3);\n  cursor: help;\n}\n.u {\n  font-size: 11.5px;\n  color: var(--text-3);\n  margin-left: 3px;\n}\n.src {\n  max-width: 260px;\n}\n.src span {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-2);\n  font-size: 13px;\n}\n.lnk {\n  border: 0;\n  background: none;\n  color: var(--primary);\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n  margin-left: 6px;\n  padding: 0;\n}\n.lnk:hover {\n  text-decoration: underline;\n}\ntr.old td {\n  background: var(--surface-2);\n  color: var(--text-2);\n}\n.own {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12px;\n  color: var(--text-3);\n}\n/*# sourceMappingURL=terms-tab.css.map */\n"] }]
  }], () => [], { projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TermsTab, { className: "TermsTab", filePath: "src/app/features/calculations/terms-tab.ts", lineNumber: 180 });
})();

// src/app/features/calculations/calculations.page.ts
var _forTrack04 = ($index, $item) => $item.id;
function CalculationsPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 5);
    \u0275\u0275listener("click", function CalculationsPage_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setTab("new"));
    });
    \u0275\u0275element(1, "vc-icon", 6);
    \u0275\u0275text(2, "New calculation");
    \u0275\u0275elementEnd();
  }
}
function CalculationsPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4);
    \u0275\u0275element(1, "vc-empty", 7);
    \u0275\u0275elementEnd();
  }
}
function CalculationsPage_Conditional_6_Case_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 13);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function CalculationsPage_Conditional_6_Case_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "vc-error", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function CalculationsPage_Conditional_6_Case_3_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function CalculationsPage_Conditional_6_Case_3_Conditional_3_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.setTab("new"));
    });
    \u0275\u0275element(1, "vc-icon", 6);
    \u0275\u0275text(2, "New calculation");
    \u0275\u0275elementEnd();
  }
}
function CalculationsPage_Conditional_6_Case_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 15);
    \u0275\u0275conditionalCreate(1, CalculationsPage_Conditional_6_Case_3_Conditional_3_Conditional_1_Template, 3, 0, "button", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.auth.can("calc.run") ? 1 : -1);
  }
}
function CalculationsPage_Conditional_6_Case_3_Conditional_4_For_25_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275element(1, "vc-icon", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function CalculationsPage_Conditional_6_Case_3_Conditional_4_For_25_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275element(1, "vc-icon", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function CalculationsPage_Conditional_6_Case_3_Conditional_4_For_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 26);
    \u0275\u0275listener("click", function CalculationsPage_Conditional_6_Case_3_Conditional_4_For_25_Template_tr_click_0_listener() {
      const r_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.open(r_r6));
    });
    \u0275\u0275elementStart(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 27);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "day");
    \u0275\u0275pipe(7, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275element(9, "vc-badge", 28);
    \u0275\u0275conditionalCreate(10, CalculationsPage_Conditional_6_Case_3_Conditional_4_For_25_Conditional_10_Template, 2, 1, "span", 29);
    \u0275\u0275conditionalCreate(11, CalculationsPage_Conditional_6_Case_3_Conditional_4_For_25_Conditional_11_Template, 2, 1, "span", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 31)(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, "\xA0");
    \u0275\u0275elementStart(17, "span", 32);
    \u0275\u0275text(18, "tCO\u2082e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 31);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "num");
    \u0275\u0275elementStart(22, "span", 32);
    \u0275\u0275text(23, "t");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "td", 31);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "num");
    \u0275\u0275elementStart(27, "span", 32);
    \u0275\u0275text(28, "t");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "td", 31);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "num");
    \u0275\u0275elementStart(32, "span", 32);
    \u0275\u0275text(33, "t");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "td", 31);
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "num");
    \u0275\u0275elementStart(37, "span", 32);
    \u0275\u0275text(38, "t");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "td", 33);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "td", 33)(42, "span", 34);
    \u0275\u0275pipe(43, "day");
    \u0275\u0275text(44);
    \u0275\u0275pipe(45, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "td", 35);
    \u0275\u0275element(47, "vc-icon", 36);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r6.period_label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(6, 17, r_r6.period_start), " \u2013 ", \u0275\u0275pipeBind1(7, 19, r_r6.period_end));
    \u0275\u0275advance(4);
    \u0275\u0275property("status", r_r6.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r6.flags["carbon_lost"] ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r6.flags["high_uncertainty"] ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("neg", r_r6.net_t_co2e < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(15, 21, r_r6.net_t_co2e, 1));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(21, 24, r_r6.reductions_t_co2e, 1), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(26, 27, r_r6.removals_t_co2e, 1), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(31, 30, r_r6.uncertainty_deduction_t_co2e, 1), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(36, 33, r_r6.buffer_t_co2e, 1), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.people.name(r_r6.created_by, "System"));
    \u0275\u0275advance(2);
    \u0275\u0275property("title", \u0275\u0275pipeBind2(43, 36, r_r6.created_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(45, 39, r_r6.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
  }
}
function CalculationsPage_Conditional_6_Case_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "table", 20)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Period");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 21);
    \u0275\u0275text(9, "Net credits");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 21);
    \u0275\u0275text(11, "Reductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 21);
    \u0275\u0275text(13, "Removals");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 21);
    \u0275\u0275text(15, "Uncertainty deduction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 21);
    \u0275\u0275text(17, "Buffer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Created by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Created");
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "tbody");
    \u0275\u0275repeaterCreate(24, CalculationsPage_Conditional_6_Case_3_Conditional_4_For_25_Template, 48, 41, "tr", 22, _forTrack04);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 23);
    \u0275\u0275element(27, "vc-dc", 24);
    \u0275\u0275elementStart(28, "span", 25);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(24);
    \u0275\u0275repeater(ctx_r1.runs());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("All figures are produced by the calculation engine (v", ctx_r1.runs()[0].engine_version, ") from frozen inputs. Negative results are shown as measured, never floored.");
  }
}
function CalculationsPage_Conditional_6_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4);
    \u0275\u0275conditionalCreate(1, CalculationsPage_Conditional_6_Case_3_Conditional_1_Template, 1, 1, "vc-loading", 13)(2, CalculationsPage_Conditional_6_Case_3_Conditional_2_Template, 2, 1, "div", 14)(3, CalculationsPage_Conditional_6_Case_3_Conditional_3_Template, 2, 1, "vc-empty", 15)(4, CalculationsPage_Conditional_6_Case_3_Conditional_4_Template, 30, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loading() ? 1 : ctx_r1.error() ? 2 : !ctx_r1.runs().length ? 3 : 4);
  }
}
function CalculationsPage_Conditional_6_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-terms-tab", 11);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("projectId", ctx_r1.ctx.currentId());
  }
}
function CalculationsPage_Conditional_6_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-new-run", 12);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("projectId", ctx_r1.ctx.currentId())("runs", ctx_r1.runs())("supersedes", ctx_r1.supersedes());
  }
}
function CalculationsPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "vc-readiness-panel", 8);
    \u0275\u0275elementStart(1, "div", 9)(2, "vc-tabs", 10);
    \u0275\u0275listener("activeChange", function CalculationsPage_Conditional_6_Template_vc_tabs_activeChange_2_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setTab($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(3, CalculationsPage_Conditional_6_Case_3_Template, 5, 1, "section", 4)(4, CalculationsPage_Conditional_6_Case_4_Template, 1, 1, "vc-terms-tab", 11)(5, CalculationsPage_Conditional_6_Case_5_Template, 1, 3, "vc-new-run", 12);
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("data", ctx_r1.readiness())("loading", ctx_r1.rLoading())("error", ctx_r1.rError());
    \u0275\u0275advance(2);
    \u0275\u0275property("tabs", ctx_r1.tabs())("active", ctx_r1.tab());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r1.tab()) === "runs" ? 3 : tmp_6_0 === "terms" ? 4 : tmp_6_0 === "new" ? 5 : -1);
  }
}
var CalculationsPage = class _CalculationsPage {
  api = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  people = inject(People);
  runs = signal(
    [],
    ...ngDevMode ? [{ debugName: "runs" }] : (
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
  readiness = signal(
    null,
    ...ngDevMode ? [{ debugName: "readiness" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "rLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rError = signal(
    null,
    ...ngDevMode ? [{ debugName: "rError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  qp = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  tab = computed(
    () => this.qp().get("tab") ?? "runs",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  supersedes = computed(
    () => this.qp().get("supersedes"),
    ...ngDevMode ? [{ debugName: "supersedes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "runs", label: "Runs", count: this.loading() ? null : this.runs().length },
      { key: "terms", label: "Decided terms" },
      ...this.auth.can("calc.run") ? [{ key: "new", label: "New calculation" }] : []
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.people.load();
    effect(() => {
      if (this.ctx.currentId())
        this.reload();
    });
  }
  setTab(t) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: t === "runs" ? null : t, supersedes: null }, queryParamsHandling: "merge" });
  }
  open(r) {
    this.router.navigate(["/app/calculations", r.id]);
  }
  reload() {
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/projects/${pid}/calculations`).subscribe({
      next: (r) => {
        this.runs.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
    this.rLoading.set(true);
    this.rError.set(null);
    this.api.get(`/projects/${pid}/readiness`).subscribe({
      next: (r) => {
        this.readiness.set(r);
        this.rLoading.set(false);
      },
      error: (e) => {
        this.rError.set(e.message);
        this.rLoading.set(false);
      }
    });
  }
  static \u0275fac = function CalculationsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CalculationsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CalculationsPage, selectors: [["vc-calculations-page"]], decls: 7, vars: 3, consts: [["title", "Calculations", "eyebrow", "Carbon", 3, "subtitle"], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], ["actions", "", 1, "btn", "btn-primary"], [1, "card"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "play"], ["icon", "briefcase", "title", "Choose a project", "text", "Pick a project in the top bar to see its calculations."], [3, "data", "loading", "error"], [1, "tabs"], [3, "activeChange", "tabs", "active"], [3, "projectId"], [3, "projectId", "runs", "supersedes"], [3, "rows"], [1, "card-body"], ["icon", "calculator", "title", "No calculations yet", "text", "When baseline and monitoring samples have accepted lab results, run the first calculation for a monitoring period."], ["title", "Couldn't load calculation runs", 3, "message"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "table-wrap"], [1, "table"], [1, "num"], [1, "clickable"], [1, "card-foot", "foot"], ["cls", "CALCULATED"], [1, "subtle", "small"], [1, "clickable", 3, "click"], [1, "subtle", "small", "nowrap"], [3, "status"], ["title", "Soil carbon did not increase", 1, "flag", "danger"], ["title", "High uncertainty", 1, "flag", "warn"], [1, "num", "nowrap"], [1, "u"], [1, "nowrap"], [3, "title"], [1, "go"], ["name", "chevron-right", 3, "size"], ["name", "trend-down", 3, "size"], ["name", "alert", 3, "size"]], template: function CalculationsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "button", 1);
      \u0275\u0275listener("click", function CalculationsPage_Template_button_click_1_listener() {
        return ctx.reload();
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, CalculationsPage_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, CalculationsPage_Conditional_5_Template, 2, 0, "section", 4)(6, CalculationsPage_Conditional_6_Template, 6, 6);
    }
    if (rf & 2) {
      \u0275\u0275property("subtitle", "Soil-carbon change, deductions and credits for " + (ctx.ctx.current()?.name ?? "the current project") + ". Every run freezes its inputs and rules, and needs a second person to approve it.");
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.auth.can("calc.run") ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.ctx.currentId() ? 5 : 6);
    }
  }, dependencies: [PageHeader, Tabs, Icon, Badge, DataClass, Empty, ErrorBox, Loading, ReadinessPanel, TermsTab, NewRun, NumPipe, DayPipe, AgoPipe], styles: ["\n.tabs[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n.u[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n  margin-left: 3px;\n}\n.neg[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.flag[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  margin-left: 4px;\n  vertical-align: middle;\n}\n.flag.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.flag.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.go[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n  width: 32px;\n}\n.foot[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=calculations.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalculationsPage, [{
    type: Component,
    args: [{ selector: "vc-calculations-page", imports: [PageHeader, Tabs, Icon, Badge, DataClass, Empty, ErrorBox, Loading, ReadinessPanel, TermsTab, NewRun, NumPipe, DayPipe, AgoPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Calculations" eyebrow="Carbon"
      [subtitle]="'Soil-carbon change, deductions and credits for ' + (ctx.current()?.name ?? 'the current project') + '. Every run freezes its inputs and rules, and needs a second person to approve it.'">
      <button actions class="btn btn-secondary" (click)="reload()"><vc-icon name="refresh" />Refresh</button>
      @if (auth.can('calc.run')) {
        <button actions class="btn btn-primary" (click)="setTab('new')"><vc-icon name="play" />New calculation</button>
      }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Pick a project in the top bar to see its calculations." /></section>
    } @else {
      <vc-readiness-panel [data]="readiness()" [loading]="rLoading()" [error]="rError()" />

      <div class="tabs"><vc-tabs [tabs]="tabs()" [active]="tab()" (activeChange)="setTab($event)" /></div>

      @switch (tab()) {
        @case ('runs') {
          <section class="card">
            @if (loading()) {
              <vc-loading [rows]="6" />
            } @else if (error()) {
              <div class="card-body"><vc-error title="Couldn't load calculation runs" [message]="error()!" /></div>
            } @else if (!runs().length) {
              <vc-empty icon="calculator" title="No calculations yet"
                text="When baseline and monitoring samples have accepted lab results, run the first calculation for a monitoring period.">
                @if (auth.can('calc.run')) { <button class="btn btn-primary" (click)="setTab('new')"><vc-icon name="play" />New calculation</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr>
                    <th>Period</th><th>Status</th>
                    <th class="num">Net credits</th><th class="num">Reductions</th><th class="num">Removals</th>
                    <th class="num">Uncertainty deduction</th><th class="num">Buffer</th>
                    <th>Created by</th><th>Created</th><th></th>
                  </tr></thead>
                  <tbody>
                    @for (r of runs(); track r.id) {
                      <tr class="clickable" (click)="open(r)">
                        <td>
                          <strong>{{ r.period_label }}</strong>
                          <div class="subtle small nowrap">{{ r.period_start | day }} \u2013 {{ r.period_end | day }}</div>
                        </td>
                        <td>
                          <vc-badge [status]="r.status" />
                          @if (r.flags['carbon_lost']) { <span class="flag danger" title="Soil carbon did not increase"><vc-icon name="trend-down" [size]="13" /></span> }
                          @if (r.flags['high_uncertainty']) { <span class="flag warn" title="High uncertainty"><vc-icon name="alert" [size]="13" /></span> }
                        </td>
                        <td class="num nowrap"><strong [class.neg]="r.net_t_co2e < 0">{{ r.net_t_co2e | num: 1 }}</strong>&nbsp;<span class="u">tCO\u2082e</span></td>
                        <td class="num nowrap">{{ r.reductions_t_co2e | num: 1 }} <span class="u">t</span></td>
                        <td class="num nowrap">{{ r.removals_t_co2e | num: 1 }} <span class="u">t</span></td>
                        <td class="num nowrap">{{ r.uncertainty_deduction_t_co2e | num: 1 }} <span class="u">t</span></td>
                        <td class="num nowrap">{{ r.buffer_t_co2e | num: 1 }} <span class="u">t</span></td>
                        <td class="nowrap">{{ people.name(r.created_by, 'System') }}</td>
                        <td class="nowrap"><span [title]="r.created_at | day: true">{{ r.created_at | ago }}</span></td>
                        <td class="go"><vc-icon name="chevron-right" [size]="16" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div class="card-foot foot">
                <vc-dc cls="CALCULATED" /><span class="subtle small">All figures are produced by the calculation engine (v{{ runs()[0].engine_version }}) from frozen inputs. Negative results are shown as measured, never floored.</span>
              </div>
            }
          </section>
        }
        @case ('terms') { <vc-terms-tab [projectId]="ctx.currentId()!" /> }
        @case ('new') { <vc-new-run [projectId]="ctx.currentId()!" [runs]="runs()" [supersedes]="supersedes()" /> }
      }
    }
  `, styles: ["/* angular:styles/component:scss;4abf02b2282b8de2;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\calculations\\calculations.page.ts */\n.tabs {\n  margin-top: 24px;\n}\n.u {\n  font-size: 11.5px;\n  color: var(--text-3);\n  margin-left: 3px;\n}\n.neg {\n  color: var(--red-600);\n}\n.flag {\n  display: inline-grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  margin-left: 4px;\n  vertical-align: middle;\n}\n.flag.danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.flag.warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.go {\n  color: var(--text-3);\n  width: 32px;\n}\n.foot {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=calculations.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CalculationsPage, { className: "CalculationsPage", filePath: "src/app/features/calculations/calculations.page.ts", lineNumber: 102 });
})();

// src/app/features/calculations/waterfall.ts
var C = { total: "#2a4d8f", up: "#2f7249", down: "#c76329", neg: "#b3261e" };
function waterfallSteps(r) {
  const tv = Object.fromEntries((r.terms ?? []).map((t) => [t.term, t.value_t_co2e]));
  const steps = [];
  let run = r.dsoc_t_co2e;
  steps.push({
    key: "dsoc",
    label: "Soil-carbon change",
    short: "SOC change",
    delta: run,
    total: run,
    kind: "start",
    help: "Measured change in soil organic carbon across all project zones, area-weighted and converted to CO\u2082 (\xD7 44/12)."
  });
  const add = (key, label, short, delta, help) => {
    run += delta;
    steps.push({ key, label, short, delta, total: run, kind: delta >= 0 ? "up" : "down", help });
  };
  add("bs", "Baseline-scenario change", "Baseline scenario", -(tv["baseline_scenario"] ?? 0), "What would have happened anyway. Subtracted.");
  add("be", "Baseline emissions", "Baseline emissions", tv["baseline_emissions"] ?? 0, "Emissions the old practice would have caused. Added back.");
  add("pe", "Project emissions", "Project emissions", -(tv["project_emissions"] ?? 0), "Emissions the new practice causes. Subtracted.");
  add("lk", "Leakage", "Leakage", -(tv["leakage"] ?? 0), "Emissions displaced outside the project. Subtracted.");
  add("ud", "Uncertainty deduction", "Uncertainty", -r.uncertainty_deduction_t_co2e, "A conservative deduction so the credited figure is very likely not an over-estimate.");
  add("bf", "Non-permanence buffer", "Buffer", -r.buffer_t_co2e, `${fmtNum(r.non_permanence_risk_pct, 1)}% of the result set aside against future reversal.`);
  steps.push({
    key: "net",
    label: "Net credits",
    short: "Net credits",
    delta: r.credits_t_co2e,
    total: r.credits_t_co2e,
    kind: "end",
    help: "Credits that can be issued for this period: reductions plus removals."
  });
  return steps;
}
function waterfallOption(steps) {
  const basePos = [], baseNeg = [], visPos = [], visNeg = [];
  let prev = 0;
  steps.forEach((s, i) => {
    let lo, hi;
    if (s.kind === "start" || s.kind === "end") {
      lo = Math.min(0, s.total);
      hi = Math.max(0, s.total);
    } else {
      lo = Math.min(prev, s.total);
      hi = Math.max(prev, s.total);
    }
    prev = s.total;
    const color = s.kind === "end" ? s.total < 0 ? C.neg : C.total : s.kind === "start" ? s.total < 0 ? C.neg : C.total : s.kind === "up" ? C.up : C.down;
    const bp = lo > 0 ? lo : 0;
    const bn = hi < 0 ? hi : 0;
    const vp = hi > 0 ? hi - bp : 0;
    const vn = lo < 0 ? lo - bn : 0;
    basePos.push(bp);
    baseNeg.push(bn);
    const labelOnPos = hi > 0 || lo >= 0;
    const text = s.kind === "start" || s.kind === "end" ? fmtNum(s.total, 1) : (s.delta >= 0 ? "+" : "\u2212") + fmtNum(Math.abs(s.delta), 1);
    visPos.push({ value: vp, itemStyle: { color, borderRadius: [3, 3, 0, 0] }, label: { show: labelOnPos, formatter: text } });
    visNeg.push({ value: vn, itemStyle: { color, borderRadius: [0, 0, 3, 3] }, label: { show: !labelOnPos, formatter: text } });
    void i;
  });
  const ghost = { type: "bar", stack: "w", silent: true, itemStyle: { color: "transparent" }, emphasis: { disabled: true }, tooltip: { show: false } };
  const vis = { type: "bar", stack: "w", barMaxWidth: 46, label: { fontSize: 11.5, color: "#414b45", fontWeight: 500 } };
  return {
    grid: { left: 8, right: 16, top: 30, bottom: 8, containLabel: true },
    legend: { show: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow", shadowStyle: { color: "rgba(47,114,73,.06)" } },
      formatter: (ps) => {
        const s = steps[ps[0]?.dataIndex ?? 0];
        const change = s.kind === "start" || s.kind === "end" ? "" : `<div style="margin-top:4px">Change <b>${s.delta >= 0 ? "+" : "\u2212"}${fmtNum(Math.abs(s.delta), 2)} tCO\u2082e</b></div>`;
        return `<div style="max-width:260px;white-space:normal"><b>${s.label}</b>${change}<div>Running total <b>${fmtNum(s.total, 2)} tCO\u2082e</b></div><div style="color:#737c76;margin-top:4px">${s.help}</div></div>`;
      }
    },
    xAxis: { type: "category", data: steps.map((s) => s.short), axisLabel: { interval: 0, fontSize: 11, color: "#58625b", width: 80, overflow: "break" } },
    yAxis: { type: "value", name: "tCO\u2082e", nameTextStyle: { color: "#737c76", fontSize: 11, align: "right" }, axisLabel: { formatter: (v) => fmtNum(v, 0) } },
    series: [
      __spreadProps(__spreadValues({}, ghost), { data: basePos }),
      __spreadProps(__spreadValues({}, ghost), { data: baseNeg }),
      __spreadProps(__spreadValues({}, vis), { data: visPos, label: __spreadProps(__spreadValues({}, vis.label), { position: "top" }) }),
      __spreadProps(__spreadValues({}, vis), { data: visNeg, label: __spreadProps(__spreadValues({}, vis.label), { position: "bottom" }) })
    ]
  };
}

// src/app/features/calculations/run-detail.page.ts
var _c0 = (a0) => ["/app/calculations", a0];
var _forTrack05 = ($index, $item) => $item.key;
var _forTrack12 = ($index, $item) => $item.term;
var _forTrack22 = ($index, $item) => $item.code;
function RunDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2);
    \u0275\u0275element(1, "vc-loading", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 8);
  }
}
function RunDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function RunDetailPage_Conditional_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.replace());
    });
    \u0275\u0275element(1, "vc-icon", 26);
    \u0275\u0275text(2, "Recalculate as replacement");
    \u0275\u0275elementEnd();
  }
}
function RunDetailPage_Conditional_5_For_8_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 29);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 12)("stroke", 2.5);
  }
}
function RunDetailPage_Conditional_5_For_8_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 30);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 12)("stroke", 2.5);
  }
}
function RunDetailPage_Conditional_5_For_8_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 33);
  }
  if (rf & 2) {
    const s_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("done", s_r4.state === "done");
  }
}
function RunDetailPage_Conditional_5_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "span", 28);
    \u0275\u0275conditionalCreate(2, RunDetailPage_Conditional_5_For_8_Conditional_2_Template, 1, 2, "vc-icon", 29)(3, RunDetailPage_Conditional_5_For_8_Conditional_3_Template, 1, 2, "vc-icon", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 31)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(9, RunDetailPage_Conditional_5_For_8_Conditional_9_Template, 1, 2, "span", 32);
  }
  if (rf & 2) {
    const s_r4 = ctx.$implicit;
    const \u0275$index_31_r5 = ctx.$index;
    const \u0275$count_31_r6 = ctx.$count;
    \u0275\u0275classMap("step s-" + s_r4.state);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(s_r4.state === "done" ? 2 : s_r4.state === "bad" ? 3 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r4.meta);
    \u0275\u0275advance();
    \u0275\u0275conditional(!(\u0275$index_31_r5 === \u0275$count_31_r6 - 1) ? 9 : -1);
  }
}
function RunDetailPage_Conditional_5_Conditional_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275element(1, "vc-icon", 42);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.fourEyes());
  }
}
function RunDetailPage_Conditional_5_Conditional_9_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 43);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Conditional_9_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.startAction("submit"));
    });
    \u0275\u0275element(1, "vc-icon", 44);
    \u0275\u0275text(2, "Send for review");
    \u0275\u0275elementEnd();
  }
}
function RunDetailPage_Conditional_5_Conditional_9_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Conditional_9_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.startAction("reject"));
    });
    \u0275\u0275element(1, "vc-icon", 46);
    \u0275\u0275text(2, "Reject");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r0.mine());
  }
}
function RunDetailPage_Conditional_5_Conditional_9_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Conditional_9_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.startAction("approve"));
    });
    \u0275\u0275element(1, "vc-icon", 48);
    \u0275\u0275text(2, "Approve");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r0.mine());
  }
}
function RunDetailPage_Conditional_5_Conditional_9_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 49);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Conditional_9_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.startAction("package"));
    });
    \u0275\u0275element(1, "vc-icon", 50);
    \u0275\u0275text(2, "Issue verification package");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r0.mine());
  }
}
function RunDetailPage_Conditional_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10)(1, "div", 34)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 35);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(6, RunDetailPage_Conditional_5_Conditional_9_Conditional_6_Template, 3, 2, "span", 36);
    \u0275\u0275elementStart(7, "div", 37);
    \u0275\u0275conditionalCreate(8, RunDetailPage_Conditional_5_Conditional_9_Conditional_8_Template, 3, 0, "button", 38);
    \u0275\u0275conditionalCreate(9, RunDetailPage_Conditional_5_Conditional_9_Conditional_9_Template, 3, 1, "button", 39);
    \u0275\u0275conditionalCreate(10, RunDetailPage_Conditional_5_Conditional_9_Conditional_10_Template, 3, 1, "button", 40);
    \u0275\u0275conditionalCreate(11, RunDetailPage_Conditional_5_Conditional_9_Conditional_11_Template, 3, 1, "button", 41);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.actionTitle());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.actionText());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.fourEyes() ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.actions().includes("submit") ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actions().includes("reject") ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actions().includes("approve") ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actions().includes("package") ? 11 : -1);
  }
}
function RunDetailPage_Conditional_5_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 11)(1, "strong");
    \u0275\u0275text(2, "Soil carbon did not increase over this period.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" The net result before uncertainty is ", \u0275\u0275pipeBind2(4, 1, r_r11.results.net_before_uncertainty_t_co2e, 1), " tCO\u2082e. It is reported exactly as measured \u2014 never rounded up to zero \u2014 and no credits arise. No uncertainty deduction or buffer is applied to a loss. ");
  }
}
function RunDetailPage_Conditional_5_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 12)(1, "strong");
    \u0275\u0275text(2, "High uncertainty.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" The uncertainty deduction is ", \u0275\u0275pipeBind2(4, 1, ctx_r0.deductionPct(), 1), "% of the result before uncertainty (the review threshold is 15%). More sampling sites per zone would narrow it and release more credits. ");
  }
}
function RunDetailPage_Conditional_5_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 13);
    \u0275\u0275text(1, "Some sites were sampled in only one campaign and were excluded from the paired comparison, as the rules require. They are listed per zone below.");
    \u0275\u0275elementEnd();
  }
}
function RunDetailPage_Conditional_5_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 14);
    \u0275\u0275text(1, "This run replaces ");
    \u0275\u0275elementStart(2, "a", 51);
    \u0275\u0275text(3, "an earlier run");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " for the same period. When approved, the earlier run is marked superseded.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c0, r_r11.supersedes_run_id));
  }
}
function RunDetailPage_Conditional_5_Case_15_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "span", 74)(2, "span", 75);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("flex-grow", r_r11.reductions_t_co2e);
    \u0275\u0275advance();
    \u0275\u0275styleProp("flex-grow", r_r11.removals_t_co2e);
  }
}
function RunDetailPage_Conditional_5_Case_15_For_51_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, s_r12.total, 1));
  }
}
function RunDetailPage_Conditional_5_Case_15_For_51_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "num");
  }
  if (rf & 2) {
    const s_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate2(" ", s_r12.delta >= 0 ? "+" : "\u2212", "", \u0275\u0275pipeBind2(1, 2, ctx_r0.abs(s_r12.delta), 1), " ");
  }
}
function RunDetailPage_Conditional_5_Case_15_For_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275element(2, "span", 76);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 77);
    \u0275\u0275conditionalCreate(5, RunDetailPage_Conditional_5_Case_15_For_51_Conditional_5_Template, 3, 4, "strong")(6, RunDetailPage_Conditional_5_Case_15_For_51_Conditional_6_Template, 2, 5);
    \u0275\u0275elementStart(7, "span", 78);
    \u0275\u0275text(8, "t");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r12 = ctx.$implicit;
    \u0275\u0275classProp("tot", s_r12.kind === "start" || s_r12.kind === "end");
    \u0275\u0275advance(2);
    \u0275\u0275classMap("sw w-" + s_r12.kind);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r12.label);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(s_r12.kind === "start" || s_r12.kind === "end" ? 5 : 6);
  }
}
function RunDetailPage_Conditional_5_Case_15_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, " The measured result carries sampling error. Combining the variance of every zone and every decided term gives a ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, ", with ");
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, ". ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16, ", and deducts t \xD7 SE = ");
    \u0275\u0275elementStart(17, "strong");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "num");
    \u0275\u0275pipe(22, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "dl", 79)(24, "dt");
    \u0275\u0275text(25, "Total variance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "dd", 19);
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dt");
    \u0275\u0275text(30, "Standard error (SE)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dd", 19);
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "dt");
    \u0275\u0275text(35, "Degrees of freedom");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "dd", 19);
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "dt");
    \u0275\u0275text(40, "Confidence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "dd", 19);
    \u0275\u0275text(42);
    \u0275\u0275pipe(43, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "dt");
    \u0275\u0275text(45, "t value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "dd", 19);
    \u0275\u0275text(47);
    \u0275\u0275pipe(48, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "dt");
    \u0275\u0275text(50, "Deduction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "dd", 19)(52, "strong");
    \u0275\u0275text(53);
    \u0275\u0275pipe(54, "num");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("standard error of ", \u0275\u0275pipeBind2(4, 13, r_r11.results.se_t_co2e, 1), " tCO\u2082e");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(8, 16, r_r11.results.df_effective, 1), " effective degrees of freedom");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" To be ", \u0275\u0275pipeBind2(12, 19, r_r11.results.confidence * 100, 0), "% confident that credits are not over-stated, the engine uses the one-sided Student-t value for those degrees of freedom, ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("t = ", \u0275\u0275pipeBind2(15, 22, r_r11.results.t_value, 3));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(19, 25, r_r11.results.uncertainty_deduction_t_co2e, 1), " tCO\u2082e");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" (", \u0275\u0275pipeBind2(21, 28, ctx_r0.deductionPct(), 1), "% of the ", \u0275\u0275pipeBind2(22, 31, r_r11.results.net_before_uncertainty_t_co2e, 1), " t result before uncertainty). ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(28, 34, r_r11.results.total_variance, 1), " (tCO\u2082e)\xB2");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(33, 37, r_r11.results.se_t_co2e, 2), " tCO\u2082e");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(38, 40, r_r11.results.df_effective, 2), " (Welch\u2013Satterthwaite)");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(43, 43, r_r11.results.confidence * 100, 1), "% one-sided");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(48, 46, r_r11.results.t_value, 4));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(54, 49, r_r11.results.uncertainty_deduction_t_co2e, 2), " tCO\u2082e");
  }
}
function RunDetailPage_Conditional_5_Case_15_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No uncertainty deduction applies: the result is not positive, so there is nothing to over-state. The loss is reported as measured.");
    \u0275\u0275elementEnd();
  }
}
function RunDetailPage_Conditional_5_Case_15_For_78_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 77);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "num");
    \u0275\u0275elementStart(6, "span", 78);
    \u0275\u0275text(7, "t");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 19);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 80);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r13 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.termLabel(t_r13.term));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(5, 4, t_r13.value_t_co2e, 2), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 7, t_r13.variance, 2));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.termStatus(t_r13.status));
  }
}
function RunDetailPage_Conditional_5_Case_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52)(1, "div", 53)(2, "div", 54);
    \u0275\u0275text(3, "Net credits ");
    \u0275\u0275element(4, "vc-dc", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 56);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "num");
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "tCO\u2082e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 57);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275pipe(13, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 58)(15, "div", 59)(16, "span");
    \u0275\u0275text(17, "Reductions vs removals");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "vc-dc", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(19, RunDetailPage_Conditional_5_Case_15_Conditional_19_Template, 3, 4, "div", 60);
    \u0275\u0275elementStart(20, "div", 61)(21, "div");
    \u0275\u0275element(22, "span", 62);
    \u0275\u0275elementStart(23, "div")(24, "strong", 19);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span");
    \u0275\u0275text(28, "Emission reductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "small");
    \u0275\u0275text(30, "Avoided emissions and prevented losses");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "div");
    \u0275\u0275element(32, "span", 63);
    \u0275\u0275elementStart(33, "div")(34, "strong", 19);
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "span");
    \u0275\u0275text(38, "Carbon removals");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "small");
    \u0275\u0275text(40, "New carbon stored in the soil");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(41, "section", 2)(42, "div", 64)(43, "h3");
    \u0275\u0275text(44, "From measured change to credits");
    \u0275\u0275elementEnd();
    \u0275\u0275element(45, "vc-dc", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 65);
    \u0275\u0275element(47, "vc-chart", 66);
    \u0275\u0275elementStart(48, "table", 67)(49, "tbody");
    \u0275\u0275repeaterCreate(50, RunDetailPage_Conditional_5_Case_15_For_51_Template, 9, 6, "tr", 68, _forTrack05);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(52, "div", 69)(53, "section", 2)(54, "div", 64)(55, "h3");
    \u0275\u0275text(56, "How the uncertainty deduction was set");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div", 70);
    \u0275\u0275conditionalCreate(58, RunDetailPage_Conditional_5_Case_15_Conditional_58_Template, 55, 52)(59, RunDetailPage_Conditional_5_Case_15_Conditional_59_Template, 2, 0, "p");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "section", 2)(61, "div", 64)(62, "h3");
    \u0275\u0275text(63, "Decided terms used");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 71)(65, "table", 72)(66, "thead")(67, "tr")(68, "th");
    \u0275\u0275text(69, "Term");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "th", 19);
    \u0275\u0275text(71, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "th", 19);
    \u0275\u0275text(73, "Variance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "th");
    \u0275\u0275text(75, "How used");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(76, "tbody");
    \u0275\u0275repeaterCreate(77, RunDetailPage_Conditional_5_Case_15_For_78_Template, 13, 10, "tr", null, _forTrack12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(79, "div", 73);
    \u0275\u0275text(80);
    \u0275\u0275pipe(81, "num");
    \u0275\u0275pipe(82, "num");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275classProp("neg", r_r11.net_t_co2e < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 12, r_r11.net_t_co2e, 1));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("After a ", \u0275\u0275pipeBind2(12, 15, r_r11.uncertainty_deduction_t_co2e, 1), " t uncertainty deduction and a ", \u0275\u0275pipeBind2(13, 18, r_r11.buffer_t_co2e, 1), " t buffer contribution.");
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r0.splitTotal() > 0 ? 19 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(26, 21, r_r11.reductions_t_co2e, 1), " t");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(36, 24, r_r11.removals_t_co2e, 1), " t");
    \u0275\u0275advance(12);
    \u0275\u0275property("option", ctx_r0.wfOption());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.wfSteps());
    \u0275\u0275advance(8);
    \u0275\u0275conditional(r_r11.results.t_value !== null ? 58 : 59);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(r_r11.results.terms);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" Non-permanence buffer: ", \u0275\u0275pipeBind2(81, 27, r_r11.results.non_permanence_risk_pct, 1), "% of the result after uncertainty is held back in the pooled buffer against future reversal (", \u0275\u0275pipeBind2(82, 30, r_r11.buffer_t_co2e, 1), " tCO\u2082e). ");
  }
}
function RunDetailPage_Conditional_5_Case_16_For_41_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("netted against ", s_r14.control_code);
  }
}
function RunDetailPage_Conditional_5_Case_16_For_41_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 84);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("title", s_r14.excluded_sites.join(", "));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", s_r14.excluded_sites.length, " site(s)");
  }
}
function RunDetailPage_Conditional_5_Case_16_For_41_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 85);
    \u0275\u0275text(1, "None");
    \u0275\u0275elementEnd();
  }
}
function RunDetailPage_Conditional_5_Case_16_For_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 81);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "human");
    \u0275\u0275conditionalCreate(9, RunDetailPage_Conditional_5_Case_16_For_41_Conditional_9_Template, 2, 1, "div", 81);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 77);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementStart(13, "span", 78);
    \u0275\u0275text(14, "ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td", 19);
    \u0275\u0275text(16);
    \u0275\u0275elementStart(17, "div", 81);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 77);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 77);
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "td", 77)(26, "strong");
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "td", 19);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "td", 19);
    \u0275\u0275text(33);
    \u0275\u0275pipe(34, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "td", 19);
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "td");
    \u0275\u0275conditionalCreate(39, RunDetailPage_Conditional_5_Case_16_For_41_Conditional_39_Template, 2, 2, "span", 84)(40, RunDetailPage_Conditional_5_Case_16_For_41_Conditional_40_Template, 2, 0, "span", 85);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r14 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r14.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.zoneName(s_r14.code));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(8, 18, s_r14.role), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(s_r14.control_code ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(12, 20, s_r14.area_ha, 1), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(s_r14.n_used);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", s_r14.n_baseline, " / ", s_r14.n_monitoring);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(21, 23, s_r14.mean_baseline_t_c_ha, 2));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(24, 26, s_r14.mean_monitoring_t_c_ha, 2));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("neg", s_r14.delta_t_c_ha < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", s_r14.delta_t_c_ha >= 0 ? "+" : "", "", \u0275\u0275pipeBind2(28, 29, s_r14.delta_t_c_ha, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(31, 32, s_r14.variance, 4));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(34, 35, s_r14.se, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(37, 38, s_r14.df, 1));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(s_r14.excluded_sites.length ? 39 : 40);
  }
}
function RunDetailPage_Conditional_5_Case_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 64)(2, "h3");
    \u0275\u0275text(3, "Result per zone");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "vc-dc", 55);
    \u0275\u0275elementStart(5, "span", 81);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 71)(8, "table", 72)(9, "thead")(10, "tr")(11, "th");
    \u0275\u0275text(12, "Zone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Role");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 19);
    \u0275\u0275text(16, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 19);
    \u0275\u0275text(18, "n used");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 19);
    \u0275\u0275text(20, "Baseline ");
    \u0275\u0275elementStart(21, "span", 82);
    \u0275\u0275text(22, "t C/ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "th", 19);
    \u0275\u0275text(24, "Monitoring ");
    \u0275\u0275elementStart(25, "span", 82);
    \u0275\u0275text(26, "t C/ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "th", 19);
    \u0275\u0275text(28, "Change ");
    \u0275\u0275elementStart(29, "span", 82);
    \u0275\u0275text(30, "t C/ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "th", 19);
    \u0275\u0275text(32, "Variance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "th", 19);
    \u0275\u0275text(34, "SE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "th", 19);
    \u0275\u0275text(36, "df");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "th");
    \u0275\u0275text(38, "Excluded sites");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(39, "tbody");
    \u0275\u0275repeaterCreate(40, RunDetailPage_Conditional_5_Case_16_For_41_Template, 41, 41, "tr", null, _forTrack22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "div", 83);
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "num");
    \u0275\u0275pipe(45, "num");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Stocks in t C/ha to the required depth (", ctx_r0.stockMethod(), ")");
    \u0275\u0275advance(34);
    \u0275\u0275repeater(ctx_r0.zones());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" n used counts paired sites (paired design) or all cores (independent design); the small figures show baseline / monitoring cores. Area-weighted total: ", \u0275\u0275pipeBind2(44, 3, r_r11.results.dsoc_t_c, 1), " t C = ", \u0275\u0275pipeBind2(45, 6, r_r11.results.dsoc_t_co2e, 1), " tCO\u2082e. ");
  }
}
function RunDetailPage_Conditional_5_Case_17_For_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "code", 94);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 35);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const x_r16 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(x_r16.key);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(x_r16.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(x_r16.source);
  }
}
function RunDetailPage_Conditional_5_Case_17_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 93)(1, "button", 91);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Case_17_Conditional_51_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.rulesOpen.set(true));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Show ", ctx_r0.rules().length - 6, " more rules");
  }
}
function RunDetailPage_Conditional_5_Case_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 64)(2, "h3");
    \u0275\u0275text(3, "Inputs fingerprint");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 86)(5, "p", 87);
    \u0275\u0275text(6, " Every input (samples, layers, accepted lab results, zones, terms) and every rule was frozen when this run was created. The SHA-256 fingerprint below is computed over that snapshot. Re-running the engine on the same snapshot always gives the same result. ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "vc-hash", 88);
    \u0275\u0275elementStart(8, "dl", 89)(9, "dt");
    \u0275\u0275text(10, "Methodology");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dd");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "dt");
    \u0275\u0275text(14, "Baseline campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "dd");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "dt");
    \u0275\u0275text(18, "Monitoring campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dt");
    \u0275\u0275text(22, "Samples \xB7 layers frozen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "dd", 19);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dt");
    \u0275\u0275text(26, "Engine version");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dd");
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(29, "section", 90)(30, "div", 64)(31, "h3");
    \u0275\u0275text(32, "Rules snapshot");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 81);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "button", 91);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Case_17_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.rulesOpen.set(!ctx_r0.rulesOpen()));
    });
    \u0275\u0275text(36);
    \u0275\u0275element(37, "vc-icon", 92);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div", 71)(39, "table", 72)(40, "thead")(41, "tr")(42, "th");
    \u0275\u0275text(43, "Rule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "th");
    \u0275\u0275text(45, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "th");
    \u0275\u0275text(47, "Source");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(48, "tbody");
    \u0275\u0275repeaterCreate(49, RunDetailPage_Conditional_5_Case_17_For_50_Template, 8, 3, "tr", null, _forTrack05);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(51, RunDetailPage_Conditional_5_Case_17_Conditional_51_Template, 3, 1, "div", 93);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("value", r_r11.snapshot_sha256)("full", true);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r11.rules_snapshot.methodology);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", r_r11.inputs_snapshot.sources.campaigns.baseline.code, " (", r_r11.inputs_snapshot.sources.campaigns.baseline.design, ")");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", r_r11.inputs_snapshot.sources.campaigns.monitoring.code, " (", r_r11.inputs_snapshot.sources.campaigns.monitoring.design, ")");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r0.count(r_r11.inputs_snapshot.sources.samples), " \xB7 ", ctx_r0.count(r_r11.inputs_snapshot.sources.layers));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r11.engine_version);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r0.rules().length, " rules");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.rulesOpen() ? "Collapse" : "Show all");
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r0.rulesOpen() ? "chevron-down" : "chevron-right")("size", 14);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r0.rulesOpen() ? ctx_r0.rules() : ctx_r0.rules().slice(0, 6));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.rulesOpen() && ctx_r0.rules().length > 6 ? 51 : -1);
  }
}
function RunDetailPage_Conditional_5_Case_18_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function RunDetailPage_Conditional_5_Case_18_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 86);
    \u0275\u0275element(1, "vc-error", 96);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.provError());
  }
}
function RunDetailPage_Conditional_5_Case_18_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-provenance-tree", 97);
    \u0275\u0275listener("openFile", function RunDetailPage_Conditional_5_Case_18_Conditional_8_Template_vc_provenance_tree_openFile_0_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openFile($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("data", ctx);
  }
}
function RunDetailPage_Conditional_5_Case_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 16)(1, "div", 64)(2, "h3");
    \u0275\u0275text(3, "Provenance explorer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 81);
    \u0275\u0275text(5, "Every number traced back to the rule, sample, lab result and certificate it came from.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(6, RunDetailPage_Conditional_5_Case_18_Conditional_6_Template, 1, 1, "vc-loading", 4)(7, RunDetailPage_Conditional_5_Case_18_Conditional_7_Template, 2, 1, "div", 86)(8, RunDetailPage_Conditional_5_Case_18_Conditional_8_Template, 1, 1, "vc-provenance-tree", 95);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r0.provLoading() ? 6 : ctx_r0.provError() ? 7 : (tmp_3_0 = ctx_r0.prov()) ? 8 : -1, tmp_3_0);
  }
}
function RunDetailPage_Conditional_5_Case_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 64)(2, "h3");
    \u0275\u0275text(3, "Status history");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 86);
    \u0275\u0275element(5, "vc-timeline", 98);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("items", ctx_r0.timeline());
  }
}
function RunDetailPage_Conditional_5_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "The run will be locked for review. A colleague with approval rights then approves or rejects it.");
    \u0275\u0275elementEnd();
  }
}
function RunDetailPage_Conditional_5_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275pipe(3, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 99)(5, "label");
    \u0275\u0275text(6, "Note ");
    \u0275\u0275elementStart(7, "span", 85);
    \u0275\u0275text(8, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "textarea", 100);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RunDetailPage_Conditional_5_Conditional_22_Template_textarea_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r19);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.note, $event) || (ctx_r0.note = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Approving creates field claims for ", \u0275\u0275pipeBind1(2, 3, r_r11.period_start), " \u2013 ", \u0275\u0275pipeBind1(3, 5, r_r11.period_end), ", so the same fields can't be credited twice for an overlapping period.");
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.note);
    \u0275\u0275control();
  }
}
function RunDetailPage_Conditional_5_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Say what needs to change so the analyst can fix it and recalculate.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 99)(3, "label");
    \u0275\u0275text(4, "Reason");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "textarea", 101);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function RunDetailPage_Conditional_5_Conditional_23_Template_textarea_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.note, $event) || (ctx_r0.note = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.note);
    \u0275\u0275control();
  }
}
function RunDetailPage_Conditional_5_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "A sealed verification package is built from this approved run: every rule, zone, sample, custody event, lab result, certificate and the full calculation, with a SHA-256 fingerprint on every page.");
    \u0275\u0275elementEnd();
  }
}
function RunDetailPage_Conditional_5_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 20);
    \u0275\u0275text(1, "Four-eyes rule: the person who created a run can't approve it, reject it or package it.");
    \u0275\u0275elementEnd();
  }
}
function RunDetailPage_Conditional_5_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "vc-calc-blocker", 102);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("error", ctx_r0.actionError());
  }
}
function RunDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-page-header", 5);
    \u0275\u0275pipe(1, "day");
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementStart(3, "span", 6);
    \u0275\u0275element(4, "vc-badge", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, RunDetailPage_Conditional_5_Conditional_5_Template, 3, 0, "button", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "section", 9);
    \u0275\u0275repeaterCreate(7, RunDetailPage_Conditional_5_For_8_Template, 10, 6, null, null, _forTrack05);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, RunDetailPage_Conditional_5_Conditional_9_Template, 12, 7, "section", 10);
    \u0275\u0275conditionalCreate(10, RunDetailPage_Conditional_5_Conditional_10_Template, 5, 4, "vc-callout", 11);
    \u0275\u0275conditionalCreate(11, RunDetailPage_Conditional_5_Conditional_11_Template, 5, 4, "vc-callout", 12);
    \u0275\u0275conditionalCreate(12, RunDetailPage_Conditional_5_Conditional_12_Template, 2, 0, "vc-callout", 13);
    \u0275\u0275conditionalCreate(13, RunDetailPage_Conditional_5_Conditional_13_Template, 5, 3, "vc-callout", 14);
    \u0275\u0275elementStart(14, "vc-tabs", 15);
    \u0275\u0275twoWayListener("activeChange", function RunDetailPage_Conditional_5_Template_vc_tabs_activeChange_14_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.tab, $event) || (ctx_r0.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, RunDetailPage_Conditional_5_Case_15_Template, 83, 33)(16, RunDetailPage_Conditional_5_Case_16_Template, 46, 9, "section", 2)(17, RunDetailPage_Conditional_5_Case_17_Template, 52, 15)(18, RunDetailPage_Conditional_5_Case_18_Template, 9, 1, "section", 16)(19, RunDetailPage_Conditional_5_Case_19_Template, 6, 1, "section", 2);
    \u0275\u0275elementStart(20, "vc-modal", 17);
    \u0275\u0275listener("closed", function RunDetailPage_Conditional_5_Template_vc_modal_closed_20_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.action.set(null));
    });
    \u0275\u0275conditionalCreate(21, RunDetailPage_Conditional_5_Conditional_21_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(22, RunDetailPage_Conditional_5_Conditional_22_Template, 10, 7);
    \u0275\u0275conditionalCreate(23, RunDetailPage_Conditional_5_Conditional_23_Template, 6, 1);
    \u0275\u0275conditionalCreate(24, RunDetailPage_Conditional_5_Conditional_24_Template, 2, 0, "p");
    \u0275\u0275elementStart(25, "dl", 18)(26, "dt");
    \u0275\u0275text(27, "Run created by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "dd");
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dt");
    \u0275\u0275text(32, "Net result");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dd", 19);
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(36, RunDetailPage_Conditional_5_Conditional_36_Template, 2, 0, "vc-callout", 20);
    \u0275\u0275conditionalCreate(37, RunDetailPage_Conditional_5_Conditional_37_Template, 2, 1, "div", 21);
    \u0275\u0275elementContainerStart(38, 22);
    \u0275\u0275elementStart(39, "button", 23);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.action.set(null));
    });
    \u0275\u0275text(40, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "button", 24);
    \u0275\u0275listener("click", function RunDetailPage_Conditional_5_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirm());
    });
    \u0275\u0275text(42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_14_0;
    const r_r11 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("title", "Period " + r_r11.period_label)("subtitle", \u0275\u0275pipeBind1(1, 29, r_r11.period_start) + " \u2013 " + \u0275\u0275pipeBind1(2, 31, r_r11.period_end) + " \xB7 " + r_r11.results.design + " design \xB7 " + ctx_r0.stockMethod() + " \xB7 engine v" + r_r11.engine_version);
    \u0275\u0275advance(4);
    \u0275\u0275property("status", r_r11.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canReplace() ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.steps());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.actions().length || ctx_r0.fourEyes() ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.results.flags["carbon_lost"] ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.results.flags["high_uncertainty"] ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.results.flags["unpaired_sites_excluded"] ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.supersedes_run_id ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("tabs", ctx_r0.tabs);
    \u0275\u0275twoWayProperty("active", ctx_r0.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_14_0 = ctx_r0.tab()) === "result" ? 15 : tmp_14_0 === "zones" ? 16 : tmp_14_0 === "inputs" ? 17 : tmp_14_0 === "provenance" ? 18 : tmp_14_0 === "history" ? 19 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("open", !!ctx_r0.action())("title", ctx_r0.modalTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.action() === "submit" ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.action() === "approve" ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.action() === "reject" ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.action() === "package" ? 24 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", r_r11.created_by_name, " on ", \u0275\u0275pipeBind2(30, 33, r_r11.created_at, true));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(35, 36, r_r11.net_t_co2e, 2), " tCO\u2082e");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.action() !== "submit" ? 36 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.actionError() ? 37 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("btn-primary", ctx_r0.action() !== "reject")("btn-danger", ctx_r0.action() === "reject");
    \u0275\u0275property("disabled", ctx_r0.busy() || ctx_r0.action() === "reject" && ctx_r0.note.trim().length < 5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.busy() ? "Working\u2026" : ctx_r0.confirmLabel(), " ");
  }
}
var RunDetailPage = class _RunDetailPage {
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  router = inject(Router);
  toast = inject(ToastService);
  auth = inject(AuthService);
  run = signal(
    null,
    ...ngDevMode ? [{ debugName: "run" }] : (
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
    inject(ActivatedRoute).snapshot.queryParamMap.get("tab") ?? "result",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rulesOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "rulesOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  prov = signal(
    null,
    ...ngDevMode ? [{ debugName: "prov" }] : (
      /* istanbul ignore next */
      []
    )
  );
  provLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "provLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  provError = signal(
    null,
    ...ngDevMode ? [{ debugName: "provError" }] : (
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
  actionError = signal(
    null,
    ...ngDevMode ? [{ debugName: "actionError" }] : (
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
  note = "";
  tabs = [
    { key: "result", label: "Result" },
    { key: "zones", label: "Zones" },
    { key: "inputs", label: "Rules & inputs" },
    { key: "provenance", label: "Provenance" },
    { key: "history", label: "History" }
  ];
  mine = computed(
    () => !!this.run() && this.run().created_by === this.auth.profile()?.id,
    ...ngDevMode ? [{ debugName: "mine" }] : (
      /* istanbul ignore next */
      []
    )
  );
  stockMethod = computed(
    () => this.run()?.results.stock_method === "esm" ? "equivalent soil mass" : "fixed depth",
    ...ngDevMode ? [{ debugName: "stockMethod" }] : (
      /* istanbul ignore next */
      []
    )
  );
  wfSteps = computed(
    () => this.run() ? waterfallSteps(this.run().results) : [],
    ...ngDevMode ? [{ debugName: "wfSteps" }] : (
      /* istanbul ignore next */
      []
    )
  );
  wfOption = computed(
    () => waterfallOption(this.wfSteps()),
    ...ngDevMode ? [{ debugName: "wfOption" }] : (
      /* istanbul ignore next */
      []
    )
  );
  splitTotal = computed(
    () => Math.max(0, this.run()?.reductions_t_co2e ?? 0) + Math.max(0, this.run()?.removals_t_co2e ?? 0),
    ...ngDevMode ? [{ debugName: "splitTotal" }] : (
      /* istanbul ignore next */
      []
    )
  );
  deductionPct = computed(
    () => {
      const r = this.run()?.results;
      return r && r.net_before_uncertainty_t_co2e > 0 ? 100 * r.uncertainty_deduction_t_co2e / r.net_before_uncertainty_t_co2e : 0;
    },
    ...ngDevMode ? [{ debugName: "deductionPct" }] : (
      /* istanbul ignore next */
      []
    )
  );
  zones = computed(
    () => [...this.run()?.results.strata ?? [], ...this.run()?.results.control_strata ?? []],
    ...ngDevMode ? [{ debugName: "zones" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rules = computed(
    () => {
      const s = this.run()?.rules_snapshot;
      if (!s)
        return [];
      return Object.keys(s.values ?? {}).sort().map((k) => ({ key: k, value: ruleValue(s.values[k]), source: ruleSource(s.sources?.[k]) }));
    },
    ...ngDevMode ? [{ debugName: "rules" }] : (
      /* istanbul ignore next */
      []
    )
  );
  actions = computed(
    () => {
      const r = this.run();
      if (!r)
        return [];
      const a = [];
      if (r.status === "calculated" && this.auth.can("calc.run"))
        a.push("submit");
      if (r.status === "under_review" && this.auth.can("calc.approve"))
        a.push("reject", "approve");
      if (r.status === "approved" && this.auth.can("package.issue"))
        a.push("package");
      return a;
    },
    ...ngDevMode ? [{ debugName: "actions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fourEyes = computed(
    () => {
      const a = this.actions();
      if (!this.mine() || !(a.includes("approve") || a.includes("package")))
        return "";
      return a.includes("package") ? "You created this run, so a colleague must issue its package" : "You created this run, so a colleague must approve it";
    },
    ...ngDevMode ? [{ debugName: "fourEyes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  actionTitle = computed(
    () => {
      const s = this.run()?.status;
      return s === "calculated" ? "Ready for review" : s === "under_review" ? "Waiting for approval" : s === "approved" ? "Approved \u2014 ready for verification" : "";
    },
    ...ngDevMode ? [{ debugName: "actionTitle" }] : (
      /* istanbul ignore next */
      []
    )
  );
  actionText = computed(
    () => {
      const r = this.run();
      if (!r)
        return "";
      if (r.status === "calculated")
        return "Check the result, zones and provenance, then send it to a colleague for approval.";
      if (r.status === "under_review")
        return `Created by ${r.created_by_name}. An approver checks the figures and either approves or rejects with a reason.`;
      if (r.status === "approved")
        return "Issue a sealed package for the independent verifier.";
      return "";
    },
    ...ngDevMode ? [{ debugName: "actionText" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canReplace = computed(
    () => {
      const s = this.run()?.status;
      return this.auth.can("calc.run") && (s === "approved" || s === "rejected" || s === "calculated");
    },
    ...ngDevMode ? [{ debugName: "canReplace" }] : (
      /* istanbul ignore next */
      []
    )
  );
  steps = computed(
    () => {
      const r = this.run();
      if (!r)
        return [];
      const last = (st) => [...r.status_history].reverse().find((e) => e.status === st);
      const meta = (e) => e ? `${e.by} \xB7 ${fmtDate(e.at, true)}` : "";
      const calc = last("calculated"), rev = last("under_review"), app = last("approved"), rej = last("rejected"), sup = last("superseded");
      const s = r.status;
      const out = [
        { key: "calc", label: "Calculated", state: "done", meta: meta(calc) },
        { key: "rev", label: "Under review", state: s === "calculated" ? "pending" : s === "under_review" ? "current" : "done", meta: rev ? meta(rev) : "Not yet sent" }
      ];
      if (s === "rejected")
        out.push({ key: "fin", label: "Rejected", state: "bad", meta: meta(rej) });
      else
        out.push({ key: "fin", label: "Approved", state: s === "approved" || s === "superseded" ? "done" : "pending", meta: app ? meta(app) : "Needs a second person" });
      if (s === "superseded")
        out.push({ key: "sup", label: "Superseded", state: "muted", meta: meta(sup) });
      return out;
    },
    ...ngDevMode ? [{ debugName: "steps" }] : (
      /* istanbul ignore next */
      []
    )
  );
  timeline = computed(
    () => [...this.run()?.status_history ?? []].reverse().map((e) => ({
      title: { calculated: "Calculated", under_review: "Sent for review", approved: "Approved", rejected: "Rejected", superseded: "Superseded" }[e.status] ?? e.status,
      at: fmtDate(e.at, true),
      by: e.by,
      note: e.note || null,
      tone: e.status === "rejected" ? "danger" : e.status === "superseded" ? "neutral" : e.status === "under_review" ? "warn" : "ok"
    })),
    ...ngDevMode ? [{ debugName: "timeline" }] : (
      /* istanbul ignore next */
      []
    )
  );
  modalTitle = computed(
    () => ({ submit: "Send for review", approve: "Approve calculation", reject: "Reject calculation", package: "Issue verification package" })[this.action() ?? ""] ?? "",
    ...ngDevMode ? [{ debugName: "modalTitle" }] : (
      /* istanbul ignore next */
      []
    )
  );
  confirmLabel = computed(
    () => ({ submit: "Send for review", approve: "Approve", reject: "Reject run", package: "Issue package" })[this.action() ?? ""] ?? "Confirm",
    ...ngDevMode ? [{ debugName: "confirmLabel" }] : (
      /* istanbul ignore next */
      []
    )
  );
  termLabel = termLabel;
  termStatus(s) {
    return TERM_STATUS[s] ?? s;
  }
  abs(v) {
    return Math.abs(v);
  }
  count(o) {
    return Object.keys(o ?? {}).length;
  }
  zoneName(code) {
    return this.run()?.inputs_snapshot.sources.strata.find((s) => s.code === code)?.name ?? "";
  }
  constructor() {
    effect(() => {
      if (this.id())
        this.load();
    });
    effect(() => {
      if (this.tab() === "provenance" && !this.prov() && !this.provLoading())
        this.loadProv();
    });
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.prov.set(null);
    this.api.get(`/calculations/${this.id()}`).subscribe({
      next: (r) => {
        this.run.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  /** Re-read the run (status history) without the loading skeleton. */
  refresh() {
    this.api.get(`/calculations/${this.id()}`).subscribe({ next: (r) => this.run.set(r), error: () => void 0 });
  }
  loadProv() {
    this.provLoading.set(true);
    this.provError.set(null);
    this.api.get(`/calculations/${this.id()}/provenance`).subscribe({
      next: (p) => {
        this.prov.set(p);
        this.provLoading.set(false);
      },
      error: (e) => {
        this.provError.set(e.message);
        this.provLoading.set(false);
      }
    });
  }
  openFile(f) {
    this.api.blob(`/evidence/${f.id}/content`).subscribe({
      next: (b) => openBlob(b),
      error: (e) => this.toast.apiError(e, "Couldn't open the file")
    });
  }
  replace() {
    this.router.navigate(["/app/calculations"], { queryParams: { tab: "new", supersedes: this.id() } });
  }
  startAction(a) {
    this.note = "";
    this.actionError.set(null);
    this.action.set(a);
  }
  confirm() {
    const a = this.action();
    const id = this.id();
    if (!a)
      return;
    this.busy.set(true);
    this.actionError.set(null);
    const req = a === "submit" ? this.api.post(`/calculations/${id}/submit`) : a === "approve" ? this.api.post(`/calculations/${id}/approve`, { note: this.note.trim() }) : a === "reject" ? this.api.post(`/calculations/${id}/reject`, { note: this.note.trim() }) : this.api.post(`/calculations/${id}/package`);
    req.subscribe({
      next: (res) => {
        this.busy.set(false);
        this.action.set(null);
        if (a === "package") {
          const p = res;
          this.toast.success(`Package v${p.version} issued`, "Grant a verifier access from the package page.");
          this.router.navigate(["/app/verification", p.id]);
          return;
        }
        this.toast.success({ submit: "Sent for review", approve: "Calculation approved", reject: "Calculation rejected" }[a]);
        const st = res.status;
        if (st)
          this.run.update((r) => r ? __spreadProps(__spreadValues({}, r), { status: st }) : r);
        setTimeout(() => this.refresh(), 600);
      },
      error: (e) => {
        this.busy.set(false);
        this.actionError.set(e);
      }
    });
  }
  static \u0275fac = function RunDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RunDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RunDetailPage, selectors: [["vc-run-detail"]], inputs: { id: [1, "id"] }, decls: 6, vars: 2, consts: [["routerLink", "/app/calculations", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this calculation", 3, "message"], [3, "rows"], ["eyebrow", "Calculation run", 3, "title", "subtitle"], ["actions", "", 1, "hdr-badge"], [3, "status"], ["actions", "", 1, "btn", "btn-secondary"], [1, "card", "stepper"], [1, "card", "actionbar"], ["tone", "danger", "icon", "trend-down", 1, "flag"], ["tone", "warn", "icon", "alert", 1, "flag"], ["tone", "info", "icon", "info", 1, "flag"], ["tone", "info", "icon", "history", 1, "flag"], [3, "activeChange", "tabs", "active"], [1, "card", "prov"], ["width", "560px", 3, "closed", "open", "title"], [1, "kv", "mt", "small"], [1, "num"], ["tone", "info", "icon", "users", 1, "mt"], [1, "mt"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", 3, "click", "disabled"], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], [1, "step"], [1, "dot"], ["name", "check", 3, "size", "stroke"], ["name", "x", 3, "size", "stroke"], [1, "st"], [1, "bar", 3, "done"], [1, "bar"], [1, "ab-t"], [1, "muted", "small"], [1, "fe"], [1, "ab-a"], [1, "btn", "btn-primary"], [1, "btn", "btn-secondary", 3, "disabled"], [1, "btn", "btn-primary", 3, "disabled"], [1, "btn", "btn-accent", 3, "disabled"], ["name", "users", 3, "size"], [1, "btn", "btn-primary", 3, "click"], ["name", "send"], [1, "btn", "btn-secondary", 3, "click", "disabled"], ["name", "x"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], [1, "btn", "btn-accent", 3, "click", "disabled"], ["name", "package"], [3, "routerLink"], [1, "hero"], [1, "net", "card"], [1, "nl"], ["cls", "CALCULATED"], [1, "nv", "num"], [1, "ns"], [1, "card", "split"], [1, "sh"], [1, "sbar"], [1, "sg"], [1, "sw", "er"], [1, "sw", "cr"], [1, "card-head"], [1, "wf"], ["height", "320px", 3, "option"], [1, "table", "steps"], [3, "tot"], [1, "grid", "grid-2", "two"], [1, "card-body", "unc"], [1, "table-wrap"], [1, "table"], [1, "card-body", "buf", "small", "muted"], [1, "er"], [1, "cr"], [1, "sw"], [1, "num", "nowrap"], [1, "u"], [1, "kv"], [1, "small", "muted"], [1, "subtle", "small"], [1, "thu"], [1, "card-foot", "foot", "small", "muted"], [1, "exc", 3, "title"], [1, "subtle"], [1, "card-body"], [1, "muted", "small", "fp"], [3, "value", "full"], [1, "kv", "fpkv"], [1, "card", "rules"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [3, "name", "size"], [1, "card-foot"], [1, "rk"], [3, "data"], ["title", "Couldn't load provenance", 3, "message"], [3, "openFile", "data"], [3, "items"], [1, "field", "mt"], ["rows", "3", "placeholder", "e.g. Checked zone Z2 outlier core against the lab re-run; accepted.", 1, "input", 3, "ngModelChange", "ngModel"], ["rows", "3", "placeholder", "At least 5 characters", 1, "input", 3, "ngModelChange", "ngModel"], [3, "error"]], template: function RunDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All calculations");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, RunDetailPage_Conditional_3_Template, 2, 1, "section", 2)(4, RunDetailPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, RunDetailPage_Conditional_5_Template, 43, 39);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.run()) ? 5 : -1, tmp_1_0);
    }
  }, dependencies: [
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    RouterLink,
    PageHeader,
    Icon,
    Badge,
    DataClass,
    Hash,
    Loading,
    ErrorBox,
    Callout,
    Modal,
    Tabs,
    Timeline,
    Chart,
    ProvenanceTree,
    CalcBlocker,
    NumPipe,
    DayPipe,
    HumanPipe
  ], styles: ["\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-bottom: 12px;\n}\n.hdr-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  margin-right: 4px;\n}\n.stepper[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n  padding: 16px 20px;\n  margin-bottom: 16px;\n}\n.step[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n.dot[_ngcontent-%COMP%] {\n  flex: none;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  border: 2px solid var(--%NS%stone-300);\n  background: var(--%NS%surface);\n  color: #fff;\n}\n.s-done[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n  border-color: var(--%NS%forest-500);\n}\n.s-current[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  border-color: var(--%NS%sky-600);\n  box-shadow: 0 0 0 4px var(--%NS%sky-100);\n}\n.s-bad[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  background: var(--%NS%red-600);\n  border-color: var(--%NS%red-600);\n}\n.s-muted[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-400);\n  border-color: var(--%NS%stone-400);\n}\n.st[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.3;\n  min-width: 0;\n}\n.st[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  font-weight: 600;\n}\n.st[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.s-pending[_ngcontent-%COMP%]   .st[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n  font-weight: 500;\n}\n.bar[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 2px;\n  min-width: 24px;\n  margin: 0 14px;\n  background: var(--%NS%sand-300);\n  border-radius: 1px;\n}\n.bar.done[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-400);\n}\n.actionbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 14px 20px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n  border-left: 3px solid var(--%NS%forest-500);\n}\n.ab-t[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 240px;\n  display: flex;\n  flex-direction: column;\n}\n.fe[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  color: var(--%NS%amber-600);\n  background: var(--%NS%warn-soft);\n  padding: 5px 10px;\n  border-radius: 6px;\n}\n.ab-a[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.flag[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n  display: flex;\n}\nvc-tabs[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.hero[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);\n  gap: 16px;\n  margin-bottom: 16px;\n}\n@media (max-width: 1000px) {\n  .hero[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.net[_ngcontent-%COMP%] {\n  padding: 20px 22px;\n  background:\n    linear-gradient(\n      135deg,\n      var(--%NS%forest-800),\n      var(--%NS%forest-600));\n  border-color: var(--%NS%forest-700);\n  color: #fff;\n}\n.nl[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.78);\n  font-weight: 500;\n}\n.nv[_ngcontent-%COMP%] {\n  font-size: 40px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 6px;\n}\n.nv[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 15px;\n  font-weight: 500;\n  margin-left: 8px;\n  color: rgba(255, 255, 255, 0.7);\n}\n.nv.neg[_ngcontent-%COMP%] {\n  color: #ffd7d3;\n}\n.ns[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: rgba(255, 255, 255, 0.72);\n  margin-top: 4px;\n}\n.split[_ngcontent-%COMP%] {\n  padding: 18px 20px;\n}\n.sh[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--%NS%text-2);\n}\n.sbar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2px;\n  height: 10px;\n  margin: 14px 0;\n  border-radius: 5px;\n  overflow: hidden;\n  background: var(--%NS%sand-200);\n}\n.sbar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  flex-basis: 0;\n  min-width: 2px;\n}\n.er[_ngcontent-%COMP%] {\n  background: var(--%NS%sky-600);\n}\n.cr[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n}\n.sg[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n  margin-top: 10px;\n}\n.sg[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.sg[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.sg[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n}\n.sg[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n}\n.sg[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.sw[_ngcontent-%COMP%] {\n  flex: none;\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n  margin-top: 6px;\n}\n.wf[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 280px;\n  gap: 8px;\n  padding: 12px 12px 12px 16px;\n  align-items: center;\n}\n@media (max-width: 1100px) {\n  .wf[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.steps[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 7px 10px;\n  font-size: 13px;\n}\n.steps[_ngcontent-%COMP%]   tr.tot[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  font-weight: 500;\n  background: var(--%NS%surface-2);\n}\n.steps[_ngcontent-%COMP%]   .sw[_ngcontent-%COMP%] {\n  margin: 0 8px 0 0;\n  vertical-align: -1px;\n}\n.w-start[_ngcontent-%COMP%], \n.w-end[_ngcontent-%COMP%] {\n  background: #2a4d8f;\n}\n.w-up[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n}\n.w-down[_ngcontent-%COMP%] {\n  background: var(--%NS%clay-500);\n}\n.two[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n.unc[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n  margin-bottom: 10px;\n  line-height: 1.6;\n}\n.unc[_ngcontent-%COMP%]   .kv[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  padding-top: 14px;\n  border-top: 1px solid var(--%NS%border);\n}\n.buf[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--%NS%border);\n}\n.u[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n  margin-left: 3px;\n}\n.neg[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.thu[_ngcontent-%COMP%] {\n  font-weight: 400;\n  color: var(--%NS%text-3);\n  margin-left: 2px;\n}\n.exc[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.foot[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.fp[_ngcontent-%COMP%] {\n  max-width: 760px;\n  margin-bottom: 12px;\n}\n.fpkv[_ngcontent-%COMP%] {\n  margin-top: 18px;\n  max-width: 640px;\n}\n.rules[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n.rk[_ngcontent-%COMP%] {\n  font-size: 12px;\n  background: var(--%NS%sand-100);\n  padding: 2px 6px;\n  border-radius: 4px;\n}\n.prov[_ngcontent-%COMP%]   .card-head[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n}\n.prov[_ngcontent-%COMP%]   .card-head[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  flex: none;\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  display: block;\n}\n/*# sourceMappingURL=run-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RunDetailPage, [{
    type: Component,
    args: [{ selector: "vc-run-detail", imports: [
      FormsModule,
      RouterLink,
      PageHeader,
      Icon,
      Badge,
      DataClass,
      Hash,
      Loading,
      ErrorBox,
      Callout,
      Modal,
      Tabs,
      Timeline,
      Chart,
      ProvenanceTree,
      CalcBlocker,
      NumPipe,
      DayPipe,
      HumanPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/calculations" class="back"><vc-icon name="arrow-left" [size]="14" />All calculations</a>

    @if (loading()) {
      <section class="card"><vc-loading [rows]="8" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load this calculation" [message]="error()!" />
    } @else if (run(); as r) {
      <vc-page-header [title]="'Period ' + r.period_label" eyebrow="Calculation run"
        [subtitle]="(r.period_start | day) + ' \u2013 ' + (r.period_end | day) + ' \xB7 ' + r.results.design + ' design \xB7 ' + stockMethod() + ' \xB7 engine v' + r.engine_version">
        <span actions class="hdr-badge"><vc-badge [status]="r.status" /></span>
        @if (canReplace()) {
          <button actions class="btn btn-secondary" (click)="replace()"><vc-icon name="refresh" />Recalculate as replacement</button>
        }
      </vc-page-header>

      <!-- status stepper -->
      <section class="card stepper">
        @for (s of steps(); track s.key; let last = $last) {
          <div class="step" [class]="'step s-' + s.state">
            <span class="dot">@if (s.state === 'done') { <vc-icon name="check" [size]="12" [stroke]="2.5" /> } @else if (s.state === 'bad') { <vc-icon name="x" [size]="12" [stroke]="2.5" /> }</span>
            <div class="st">
              <strong>{{ s.label }}</strong>
              <span>{{ s.meta }}</span>
            </div>
          </div>
          @if (!last) { <span class="bar" [class.done]="s.state === 'done'"></span> }
        }
      </section>

      <!-- action bar -->
      @if (actions().length || fourEyes()) {
        <section class="card actionbar">
          <div class="ab-t">
            <strong>{{ actionTitle() }}</strong>
            <span class="muted small">{{ actionText() }}</span>
          </div>
          @if (fourEyes()) {
            <span class="fe"><vc-icon name="users" [size]="14" />{{ fourEyes() }}</span>
          }
          <div class="ab-a">
            @if (actions().includes('submit')) { <button class="btn btn-primary" (click)="startAction('submit')"><vc-icon name="send" />Send for review</button> }
            @if (actions().includes('reject')) { <button class="btn btn-secondary" [disabled]="mine()" (click)="startAction('reject')"><vc-icon name="x" />Reject</button> }
            @if (actions().includes('approve')) { <button class="btn btn-primary" [disabled]="mine()" (click)="startAction('approve')"><vc-icon name="check" />Approve</button> }
            @if (actions().includes('package')) { <button class="btn btn-accent" [disabled]="mine()" (click)="startAction('package')"><vc-icon name="package" />Issue verification package</button> }
          </div>
        </section>
      }

      <!-- flags -->
      @if (r.results.flags['carbon_lost']) {
        <vc-callout tone="danger" icon="trend-down" class="flag">
          <strong>Soil carbon did not increase over this period.</strong>
          The net result before uncertainty is {{ r.results.net_before_uncertainty_t_co2e | num: 1 }} tCO\u2082e. It is reported exactly as measured \u2014 never
          rounded up to zero \u2014 and no credits arise. No uncertainty deduction or buffer is applied to a loss.
        </vc-callout>
      }
      @if (r.results.flags['high_uncertainty']) {
        <vc-callout tone="warn" icon="alert" class="flag">
          <strong>High uncertainty.</strong> The uncertainty deduction is {{ deductionPct() | num: 1 }}% of the result before uncertainty (the review threshold is 15%).
          More sampling sites per zone would narrow it and release more credits.
        </vc-callout>
      }
      @if (r.results.flags['unpaired_sites_excluded']) {
        <vc-callout tone="info" icon="info" class="flag">Some sites were sampled in only one campaign and were excluded from the paired comparison, as the rules require. They are listed per zone below.</vc-callout>
      }
      @if (r.supersedes_run_id) {
        <vc-callout tone="info" icon="history" class="flag">This run replaces <a [routerLink]="['/app/calculations', r.supersedes_run_id]">an earlier run</a> for the same period. When approved, the earlier run is marked superseded.</vc-callout>
      }

      <vc-tabs [tabs]="tabs" [(active)]="tab" />

      @switch (tab()) {
        @case ('result') {
          <div class="hero">
            <div class="net card">
              <div class="nl">Net credits <vc-dc cls="CALCULATED" /></div>
              <div class="nv num" [class.neg]="r.net_t_co2e < 0">{{ r.net_t_co2e | num: 1 }}<span>tCO\u2082e</span></div>
              <div class="ns">After a {{ r.uncertainty_deduction_t_co2e | num: 1 }} t uncertainty deduction and a {{ r.buffer_t_co2e | num: 1 }} t buffer contribution.</div>
            </div>
            <div class="card split">
              <div class="sh"><span>Reductions vs removals</span><vc-dc cls="CALCULATED" /></div>
              @if (splitTotal() > 0) {
                <div class="sbar">
                  <span class="er" [style.flex-grow]="r.reductions_t_co2e"></span>
                  <span class="cr" [style.flex-grow]="r.removals_t_co2e"></span>
                </div>
              }
              <div class="sg">
                <div><span class="sw er"></span><div><strong class="num">{{ r.reductions_t_co2e | num: 1 }} t</strong><span>Emission reductions</span><small>Avoided emissions and prevented losses</small></div></div>
                <div><span class="sw cr"></span><div><strong class="num">{{ r.removals_t_co2e | num: 1 }} t</strong><span>Carbon removals</span><small>New carbon stored in the soil</small></div></div>
              </div>
            </div>
          </div>

          <section class="card">
            <div class="card-head"><h3>From measured change to credits</h3><vc-dc cls="CALCULATED" /></div>
            <div class="wf">
              <vc-chart [option]="wfOption()" height="320px" />
              <table class="table steps">
                <tbody>
                  @for (s of wfSteps(); track s.key) {
                    <tr [class.tot]="s.kind === 'start' || s.kind === 'end'">
                      <td><span class="sw" [class]="'sw w-' + s.kind"></span>{{ s.label }}</td>
                      <td class="num nowrap">
                        @if (s.kind === 'start' || s.kind === 'end') { <strong>{{ s.total | num: 1 }}</strong> }
                        @else { {{ s.delta >= 0 ? '+' : '\u2212' }}{{ abs(s.delta) | num: 1 }} }
                        <span class="u">t</span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <div class="grid grid-2 two">
            <section class="card">
              <div class="card-head"><h3>How the uncertainty deduction was set</h3></div>
              <div class="card-body unc">
                @if (r.results.t_value !== null) {
                  <p>
                    The measured result carries sampling error. Combining the variance of every zone and every decided term gives a
                    <strong>standard error of {{ r.results.se_t_co2e | num: 1 }} tCO\u2082e</strong>, with
                    <strong>{{ r.results.df_effective | num: 1 }} effective degrees of freedom</strong>.
                  </p>
                  <p>
                    To be {{ r.results.confidence * 100 | num: 0 }}% confident that credits are not over-stated, the engine uses the one-sided
                    Student-t value for those degrees of freedom, <strong>t = {{ r.results.t_value | num: 3 }}</strong>, and deducts
                    t \xD7 SE = <strong>{{ r.results.uncertainty_deduction_t_co2e | num: 1 }} tCO\u2082e</strong>
                    ({{ deductionPct() | num: 1 }}% of the {{ r.results.net_before_uncertainty_t_co2e | num: 1 }} t result before uncertainty).
                  </p>
                  <dl class="kv">
                    <dt>Total variance</dt><dd class="num">{{ r.results.total_variance | num: 1 }} (tCO\u2082e)\xB2</dd>
                    <dt>Standard error (SE)</dt><dd class="num">{{ r.results.se_t_co2e | num: 2 }} tCO\u2082e</dd>
                    <dt>Degrees of freedom</dt><dd class="num">{{ r.results.df_effective | num: 2 }} (Welch\u2013Satterthwaite)</dd>
                    <dt>Confidence</dt><dd class="num">{{ r.results.confidence * 100 | num: 1 }}% one-sided</dd>
                    <dt>t value</dt><dd class="num">{{ r.results.t_value | num: 4 }}</dd>
                    <dt>Deduction</dt><dd class="num"><strong>{{ r.results.uncertainty_deduction_t_co2e | num: 2 }} tCO\u2082e</strong></dd>
                  </dl>
                } @else {
                  <p>No uncertainty deduction applies: the result is not positive, so there is nothing to over-state. The loss is reported as measured.</p>
                }
              </div>
            </section>
            <section class="card">
              <div class="card-head"><h3>Decided terms used</h3></div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Term</th><th class="num">Value</th><th class="num">Variance</th><th>How used</th></tr></thead>
                  <tbody>
                    @for (t of r.results.terms; track t.term) {
                      <tr>
                        <td>{{ termLabel(t.term) }}</td>
                        <td class="num nowrap">{{ t.value_t_co2e | num: 2 }} <span class="u">t</span></td>
                        <td class="num">{{ t.variance | num: 2 }}</td>
                        <td class="small muted">{{ termStatus(t.status) }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div class="card-body buf small muted">
                Non-permanence buffer: {{ r.results.non_permanence_risk_pct | num: 1 }}% of the result after uncertainty is held back in the pooled buffer
                against future reversal ({{ r.buffer_t_co2e | num: 1 }} tCO\u2082e).
              </div>
            </section>
          </div>
        }

        @case ('zones') {
          <section class="card">
            <div class="card-head"><h3>Result per zone</h3><vc-dc cls="CALCULATED" /><span class="subtle small">Stocks in t C/ha to the required depth ({{ stockMethod() }})</span></div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr>
                  <th>Zone</th><th>Role</th><th class="num">Area</th><th class="num">n used</th>
                  <th class="num">Baseline <span class="thu">t C/ha</span></th><th class="num">Monitoring <span class="thu">t C/ha</span></th><th class="num">Change <span class="thu">t C/ha</span></th>
                  <th class="num">Variance</th><th class="num">SE</th><th class="num">df</th><th>Excluded sites</th>
                </tr></thead>
                <tbody>
                  @for (s of zones(); track s.code) {
                    <tr>
                      <td><strong>{{ s.code }}</strong><div class="subtle small">{{ zoneName(s.code) }}</div></td>
                      <td>
                        {{ s.role | human }}
                        @if (s.control_code) { <div class="subtle small">netted against {{ s.control_code }}</div> }
                      </td>
                      <td class="num nowrap">{{ s.area_ha | num: 1 }} <span class="u">ha</span></td>
                      <td class="num">{{ s.n_used }}<div class="subtle small">{{ s.n_baseline }} / {{ s.n_monitoring }}</div></td>
                      <td class="num nowrap">{{ s.mean_baseline_t_c_ha | num: 2 }}</td>
                      <td class="num nowrap">{{ s.mean_monitoring_t_c_ha | num: 2 }}</td>
                      <td class="num nowrap"><strong [class.neg]="s.delta_t_c_ha < 0">{{ s.delta_t_c_ha >= 0 ? '+' : '' }}{{ s.delta_t_c_ha | num: 3 }}</strong></td>
                      <td class="num">{{ s.variance | num: 4 }}</td>
                      <td class="num">{{ s.se | num: 3 }}</td>
                      <td class="num">{{ s.df | num: 1 }}</td>
                      <td>@if (s.excluded_sites.length) { <span class="exc" [title]="s.excluded_sites.join(', ')">{{ s.excluded_sites.length }} site(s)</span> } @else { <span class="subtle">None</span> }</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="card-foot foot small muted">
              n used counts paired sites (paired design) or all cores (independent design); the small figures show baseline / monitoring cores.
              Area-weighted total: {{ r.results.dsoc_t_c | num: 1 }} t C = {{ r.results.dsoc_t_co2e | num: 1 }} tCO\u2082e.
            </div>
          </section>
        }

        @case ('inputs') {
          <section class="card">
            <div class="card-head"><h3>Inputs fingerprint</h3></div>
            <div class="card-body">
              <p class="muted small fp">
                Every input (samples, layers, accepted lab results, zones, terms) and every rule was frozen when this run was created.
                The SHA-256 fingerprint below is computed over that snapshot. Re-running the engine on the same snapshot always gives the same result.
              </p>
              <vc-hash [value]="r.snapshot_sha256" [full]="true" />
              <dl class="kv fpkv">
                <dt>Methodology</dt><dd>{{ r.rules_snapshot.methodology }}</dd>
                <dt>Baseline campaign</dt><dd>{{ r.inputs_snapshot.sources.campaigns.baseline.code }} ({{ r.inputs_snapshot.sources.campaigns.baseline.design }})</dd>
                <dt>Monitoring campaign</dt><dd>{{ r.inputs_snapshot.sources.campaigns.monitoring.code }} ({{ r.inputs_snapshot.sources.campaigns.monitoring.design }})</dd>
                <dt>Samples \xB7 layers frozen</dt><dd class="num">{{ count(r.inputs_snapshot.sources.samples) }} \xB7 {{ count(r.inputs_snapshot.sources.layers) }}</dd>
                <dt>Engine version</dt><dd>{{ r.engine_version }}</dd>
              </dl>
            </div>
          </section>
          <section class="card rules">
            <div class="card-head">
              <h3>Rules snapshot</h3>
              <span class="subtle small">{{ rules().length }} rules</span>
              <button class="btn btn-ghost btn-sm" (click)="rulesOpen.set(!rulesOpen())">{{ rulesOpen() ? 'Collapse' : 'Show all' }}<vc-icon [name]="rulesOpen() ? 'chevron-down' : 'chevron-right'" [size]="14" /></button>
            </div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Rule</th><th>Value</th><th>Source</th></tr></thead>
                <tbody>
                  @for (x of (rulesOpen() ? rules() : rules().slice(0, 6)); track x.key) {
                    <tr><td><code class="rk">{{ x.key }}</code></td><td>{{ x.value }}</td><td class="muted small">{{ x.source }}</td></tr>
                  }
                </tbody>
              </table>
            </div>
            @if (!rulesOpen() && rules().length > 6) {
              <div class="card-foot"><button class="btn btn-ghost btn-sm" (click)="rulesOpen.set(true)">Show {{ rules().length - 6 }} more rules</button></div>
            }
          </section>
        }

        @case ('provenance') {
          <section class="card prov">
            <div class="card-head">
              <h3>Provenance explorer</h3>
              <span class="subtle small">Every number traced back to the rule, sample, lab result and certificate it came from.</span>
            </div>
            @if (provLoading()) { <vc-loading [rows]="8" /> }
            @else if (provError()) { <div class="card-body"><vc-error title="Couldn't load provenance" [message]="provError()!" /></div> }
            @else if (prov(); as p) { <vc-provenance-tree [data]="p" (openFile)="openFile($event)" /> }
          </section>
        }

        @case ('history') {
          <section class="card">
            <div class="card-head"><h3>Status history</h3></div>
            <div class="card-body"><vc-timeline [items]="timeline()" /></div>
          </section>
        }
      }

      <!-- action modal -->
      <vc-modal [open]="!!action()" (closed)="action.set(null)" [title]="modalTitle()" width="560px">
        @if (action() === 'submit') {
          <p>The run will be locked for review. A colleague with approval rights then approves or rejects it.</p>
        }
        @if (action() === 'approve') {
          <p>Approving creates field claims for {{ r.period_start | day }} \u2013 {{ r.period_end | day }}, so the same fields can't be credited twice for an overlapping period.</p>
          <div class="field mt"><label>Note <span class="subtle">(optional)</span></label>
            <textarea class="input" [(ngModel)]="note" rows="3" placeholder="e.g. Checked zone Z2 outlier core against the lab re-run; accepted."></textarea></div>
        }
        @if (action() === 'reject') {
          <p>Say what needs to change so the analyst can fix it and recalculate.</p>
          <div class="field mt"><label>Reason</label>
            <textarea class="input" [(ngModel)]="note" rows="3" placeholder="At least 5 characters"></textarea></div>
        }
        @if (action() === 'package') {
          <p>A sealed verification package is built from this approved run: every rule, zone, sample, custody event, lab result, certificate and the full calculation, with a SHA-256 fingerprint on every page.</p>
        }
        <dl class="kv mt small">
          <dt>Run created by</dt><dd>{{ r.created_by_name }} on {{ r.created_at | day: true }}</dd>
          <dt>Net result</dt><dd class="num">{{ r.net_t_co2e | num: 2 }} tCO\u2082e</dd>
        </dl>
        @if (action() !== 'submit') {
          <vc-callout tone="info" icon="users" class="mt">Four-eyes rule: the person who created a run can't approve it, reject it or package it.</vc-callout>
        }
        @if (actionError()) { <div class="mt"><vc-calc-blocker [error]="actionError()" /></div> }
        <ng-container footer>
          <button class="btn btn-ghost" (click)="action.set(null)">Cancel</button>
          <button class="btn" [class.btn-primary]="action() !== 'reject'" [class.btn-danger]="action() === 'reject'"
            [disabled]="busy() || (action() === 'reject' && note.trim().length < 5)" (click)="confirm()">
            {{ busy() ? 'Working\u2026' : confirmLabel() }}
          </button>
        </ng-container>
      </vc-modal>
    }
  `, styles: ["/* angular:styles/component:scss;5f336bc7af2bd52c;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\calculations\\run-detail.page.ts */\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n  margin-bottom: 12px;\n}\n.hdr-badge {\n  display: inline-flex;\n  align-items: center;\n  margin-right: 4px;\n}\n.stepper {\n  display: flex;\n  align-items: center;\n  gap: 0;\n  padding: 16px 20px;\n  margin-bottom: 16px;\n}\n.step {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n.dot {\n  flex: none;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  border: 2px solid var(--stone-300);\n  background: var(--surface);\n  color: #fff;\n}\n.s-done .dot {\n  background: var(--forest-500);\n  border-color: var(--forest-500);\n}\n.s-current .dot {\n  border-color: var(--sky-600);\n  box-shadow: 0 0 0 4px var(--sky-100);\n}\n.s-bad .dot {\n  background: var(--red-600);\n  border-color: var(--red-600);\n}\n.s-muted .dot {\n  background: var(--stone-400);\n  border-color: var(--stone-400);\n}\n.st {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.3;\n  min-width: 0;\n}\n.st strong {\n  font-size: 13.5px;\n  font-weight: 600;\n}\n.st span {\n  font-size: 12px;\n  color: var(--text-3);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.s-pending .st strong {\n  color: var(--text-3);\n  font-weight: 500;\n}\n.bar {\n  flex: 1;\n  height: 2px;\n  min-width: 24px;\n  margin: 0 14px;\n  background: var(--sand-300);\n  border-radius: 1px;\n}\n.bar.done {\n  background: var(--forest-400);\n}\n.actionbar {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 14px 20px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n  border-left: 3px solid var(--forest-500);\n}\n.ab-t {\n  flex: 1;\n  min-width: 240px;\n  display: flex;\n  flex-direction: column;\n}\n.fe {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  color: var(--amber-600);\n  background: var(--warn-soft);\n  padding: 5px 10px;\n  border-radius: 6px;\n}\n.ab-a {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.flag {\n  margin-bottom: 12px;\n  display: flex;\n}\nvc-tabs {\n  margin-top: 8px;\n}\n.hero {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);\n  gap: 16px;\n  margin-bottom: 16px;\n}\n@media (max-width: 1000px) {\n  .hero {\n    grid-template-columns: 1fr;\n  }\n}\n.net {\n  padding: 20px 22px;\n  background:\n    linear-gradient(\n      135deg,\n      var(--forest-800),\n      var(--forest-600));\n  border-color: var(--forest-700);\n  color: #fff;\n}\n.nl {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.78);\n  font-weight: 500;\n}\n.nv {\n  font-size: 40px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 6px;\n}\n.nv span {\n  font-size: 15px;\n  font-weight: 500;\n  margin-left: 8px;\n  color: rgba(255, 255, 255, 0.7);\n}\n.nv.neg {\n  color: #ffd7d3;\n}\n.ns {\n  font-size: 12.5px;\n  color: rgba(255, 255, 255, 0.72);\n  margin-top: 4px;\n}\n.split {\n  padding: 18px 20px;\n}\n.sh {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--text-2);\n}\n.sbar {\n  display: flex;\n  gap: 2px;\n  height: 10px;\n  margin: 14px 0;\n  border-radius: 5px;\n  overflow: hidden;\n  background: var(--sand-200);\n}\n.sbar span {\n  flex-basis: 0;\n  min-width: 2px;\n}\n.er {\n  background: var(--sky-600);\n}\n.cr {\n  background: var(--forest-500);\n}\n.sg {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n  margin-top: 10px;\n}\n.sg > div {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.sg > div > div {\n  display: flex;\n  flex-direction: column;\n}\n.sg strong {\n  font-size: 20px;\n  font-weight: 600;\n}\n.sg span {\n  font-size: 13px;\n  color: var(--stone-700);\n}\n.sg small {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.sw {\n  flex: none;\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n  margin-top: 6px;\n}\n.wf {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 280px;\n  gap: 8px;\n  padding: 12px 12px 12px 16px;\n  align-items: center;\n}\n@media (max-width: 1100px) {\n  .wf {\n    grid-template-columns: 1fr;\n  }\n}\n.steps td {\n  padding: 7px 10px;\n  font-size: 13px;\n}\n.steps tr.tot td {\n  font-weight: 500;\n  background: var(--surface-2);\n}\n.steps .sw {\n  margin: 0 8px 0 0;\n  vertical-align: -1px;\n}\n.w-start,\n.w-end {\n  background: #2a4d8f;\n}\n.w-up {\n  background: var(--forest-500);\n}\n.w-down {\n  background: var(--clay-500);\n}\n.two {\n  margin-top: 16px;\n}\n.unc p {\n  color: var(--stone-700);\n  margin-bottom: 10px;\n  line-height: 1.6;\n}\n.unc .kv {\n  margin-top: 14px;\n  padding-top: 14px;\n  border-top: 1px solid var(--border);\n}\n.buf {\n  border-top: 1px solid var(--border);\n}\n.u {\n  font-size: 11.5px;\n  color: var(--text-3);\n  margin-left: 3px;\n}\n.neg {\n  color: var(--red-600);\n}\n.thu {\n  font-weight: 400;\n  color: var(--text-3);\n  margin-left: 2px;\n}\n.exc {\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.foot {\n  justify-content: flex-start;\n}\n.fp {\n  max-width: 760px;\n  margin-bottom: 12px;\n}\n.fpkv {\n  margin-top: 18px;\n  max-width: 640px;\n}\n.rules {\n  margin-top: 16px;\n}\n.rk {\n  font-size: 12px;\n  background: var(--sand-100);\n  padding: 2px 6px;\n  border-radius: 4px;\n}\n.prov .card-head {\n  flex-wrap: wrap;\n}\n.prov .card-head h3 {\n  flex: none;\n}\n.mt {\n  margin-top: 14px;\n  display: block;\n}\n/*# sourceMappingURL=run-detail.page.css.map */\n"] }]
  }], () => [], { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RunDetailPage, { className: "RunDetailPage", filePath: "src/app/features/calculations/run-detail.page.ts", lineNumber: 395 });
})();

// src/app/features/calculations/calculations.routes.ts
var calculations_routes_default = [
  { path: "", component: CalculationsPage, title: "Calculations \xB7 Varsapradaya Carbon" },
  { path: ":id", component: RunDetailPage, title: "Calculation run \xB7 Varsapradaya Carbon" }
];
export {
  calculations_routes_default as default
};
//# debugId=7f98a3f1-9667-5225-b25f-75ef6584df4f
//# sourceMappingURL=chunk-G6DE5POO.js.map
