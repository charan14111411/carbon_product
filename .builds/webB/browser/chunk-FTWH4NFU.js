import {
  Remote
} from "./chunk-ZC6I5JPU.js";
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
  AgoPipe,
  DayPipe,
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  ActivatedRoute,
  AuthService,
  Router,
  RouterLink,
  permissionGuard
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
  Tabs
} from "./chunk-PAXTZ3VZ.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  JsonPipe,
  ViewChild,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  effect,
  inject,
  of,
  setClassMetadata,
  signal,
  untracked,
  viewChild,
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
  ɵɵqueryAdvance,
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
  ɵɵtwoWayProperty,
  ɵɵviewQuerySignal
} from "./chunk-O2E4BMDK.js";

// src/app/features/partners/assistant.page.ts
var _c0 = ["thread"];
var _forTrack0 = ($index, $item) => $item.id;
function AssistantPage_Conditional_8_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function AssistantPage_Conditional_8_For_9_Template_button_click_0_listener() {
      const s_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.ask(s_r3));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r3);
  }
}
function AssistantPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "span", 20);
    \u0275\u0275element(2, "vc-icon", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "Ask about a calculation run");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 22);
    \u0275\u0275text(6, "Pick a run on the right, then ask in plain words. Each answer lists the records it came from.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 23);
    \u0275\u0275repeaterCreate(8, AssistantPage_Conditional_8_For_9_Template, 2, 1, "button", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.suggestions);
  }
}
function AssistantPage_For_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r5.runLabel);
  }
}
function AssistantPage_For_10_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const t_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", t_r5.error, " ");
  }
}
function AssistantPage_For_10_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275element(1, "i")(2, "i")(3, "i");
    \u0275\u0275elementEnd();
  }
}
function AssistantPage_For_10_Conditional_10_Conditional_2_For_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r6.source);
  }
}
function AssistantPage_For_10_Conditional_10_Conditional_2_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "code");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, AssistantPage_For_10_Conditional_10_Conditional_2_For_5_Conditional_5_Template, 2, 1, "span", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.citeLabel(c_r6));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.citeRef(c_r6));
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r6.source ? 5 : -1);
  }
}
function AssistantPage_For_10_Conditional_10_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function AssistantPage_For_10_Conditional_10_Conditional_2_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const $index_r8 = \u0275\u0275nextContext(3).$index;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.expand($index_r8));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r5 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Show all ", t_r5.a.citations.length);
  }
}
function AssistantPage_For_10_Conditional_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "span", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul");
    \u0275\u0275repeaterCreate(4, AssistantPage_For_10_Conditional_10_Conditional_2_For_5_Template, 6, 3, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, AssistantPage_For_10_Conditional_10_Conditional_2_Conditional_6_Template, 2, 1, "button", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r8 = \u0275\u0275nextContext(2);
    const t_r5 = ctx_r8.$implicit;
    const $index_r8 = ctx_r8.$index;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Sources \xB7 ", t_r5.a.citations.length);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(t_r5.a.citations.slice(0, ctx_r3.showAll()[$index_r8] ? 999 : 6));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(t_r5.a.citations.length > 6 && !ctx_r3.showAll()[$index_r8] ? 6 : -1);
  }
}
function AssistantPage_For_10_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, AssistantPage_For_10_Conditional_10_Conditional_2_Template, 7, 2, "div", 33);
    \u0275\u0275elementStart(3, "div", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r5.a.answer);
    \u0275\u0275advance();
    \u0275\u0275conditional(t_r5.a.citations.length ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r5.a.method);
  }
}
function AssistantPage_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 27);
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, AssistantPage_For_10_Conditional_3_Template, 2, 1, "span", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 29)(5, "span", 30);
    \u0275\u0275element(6, "vc-icon", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 27);
    \u0275\u0275conditionalCreate(8, AssistantPage_For_10_Conditional_8_Template, 1, 1)(9, AssistantPage_For_10_Conditional_9_Template, 4, 0, "span", 32)(10, AssistantPage_For_10_Conditional_10_Template, 5, 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r5.q);
    \u0275\u0275advance();
    \u0275\u0275conditional(t_r5.runLabel ? 3 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275classProp("na", t_r5.a && !t_r5.a.answered)("err", !!t_r5.error);
    \u0275\u0275advance();
    \u0275\u0275conditional(t_r5.error ? 8 : !t_r5.a ? 9 : 10);
  }
}
function AssistantPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1, "Choose a project in the top bar to list its runs.");
    \u0275\u0275elementEnd();
  }
}
function AssistantPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 17);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function AssistantPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1, "This project has no calculation runs yet. The assistant can still tell you what it can answer.");
    \u0275\u0275elementEnd();
  }
}
function AssistantPage_Conditional_25_For_2_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-badge", 46);
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("status", r_r11.status);
  }
}
function AssistantPage_Conditional_25_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 41)(1, "input", 42);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function AssistantPage_Conditional_25_For_2_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.runId.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 43)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 38);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "day");
    \u0275\u0275pipe(8, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 44)(10, "span", 45);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementStart(13, "small");
    \u0275\u0275text(14, "t");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(15, AssistantPage_Conditional_25_For_2_Conditional_15_Template, 1, 1, "vc-badge", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r11 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r3.runId() === r_r11.id);
    \u0275\u0275advance();
    \u0275\u0275property("value", r_r11.id)("ngModel", ctx_r3.runId());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r11.period_label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(7, 9, r_r11.period_start), " \u2013 ", \u0275\u0275pipeBind1(8, 11, r_r11.period_end));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(12, 13, r_r11.net_t_co2e, 1), " ");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(r_r11.status ? 15 : -1);
  }
}
function AssistantPage_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275repeaterCreate(1, AssistantPage_Conditional_25_For_2_Template, 16, 16, "label", 40, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.runs.data());
  }
}
var SUGGESTIONS = [
  "Where did the net result come from?",
  "Why was the buffer deducted?",
  "Which samples were used?",
  "Which rules applied?"
];
var CITE_LABEL = {
  calculation_run: "Calculation run",
  rule_pack: "Rule pack",
  campaign: "Sampling campaign",
  rule: "Rule",
  sample: "Sample"
};
var AssistantPage = class _AssistantPage {
  api = inject(ApiService);
  ctx = inject(ProjectContext);
  runs = new Remote();
  runId = signal(
    "",
    ...ngDevMode ? [{ debugName: "runId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  turns = signal(
    [],
    ...ngDevMode ? [{ debugName: "turns" }] : (
      /* istanbul ignore next */
      []
    )
  );
  showAll = signal(
    {},
    ...ngDevMode ? [{ debugName: "showAll" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pending = computed(
    () => this.turns().some((t) => !t.a && !t.error),
    ...ngDevMode ? [{ debugName: "pending" }] : (
      /* istanbul ignore next */
      []
    )
  );
  question = "";
  suggestions = SUGGESTIONS;
  thread = viewChild(
    "thread",
    ...ngDevMode ? [{ debugName: "thread" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => {
        if (!pid)
          return;
        this.runs.load(this.api.get(`/projects/${pid}/calculations`).pipe(catchError(() => of([]))));
      });
    });
    effect(() => {
      const r = this.runs.data();
      untracked(() => {
        if (r?.length && !r.find((x) => x.id === this.runId()))
          this.runId.set((r.find((x) => x.status === "approved") ?? r[0]).id);
      });
    });
    effect(() => {
      this.turns();
      const el = this.thread()?.nativeElement;
      if (el)
        setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 30);
    });
  }
  citeLabel(c) {
    return (CITE_LABEL[c.type] ?? c.type) + (c.role ? ` \xB7 ${c.role}` : "");
  }
  citeRef(c) {
    return c.key ?? c.ref ?? (c.id ? c.id.slice(0, 8) : "") + (c.snapshot_sha256 ? ` \xB7 sha256 ${c.snapshot_sha256.slice(0, 12)}\u2026` : "");
  }
  expand(i) {
    this.showAll.update((s) => __spreadProps(__spreadValues({}, s), { [i]: true }));
  }
  ask(q) {
    q = q.trim();
    if (q.length < 3 || this.pending())
      return;
    const run = this.runs.data()?.find((r) => r.id === this.runId()) ?? null;
    const idx = this.turns().length;
    this.turns.update((t) => [...t, { q, runLabel: run ? `About ${run.period_label}` : null, at: /* @__PURE__ */ new Date() }]);
    this.question = "";
    this.api.post("/assistant/ask", { question: q, run_id: run?.id ?? null }).subscribe({
      next: (a) => this.turns.update((t) => t.map((x, i) => i === idx ? __spreadProps(__spreadValues({}, x), { a }) : x)),
      error: (e) => this.turns.update((t) => t.map((x, i) => i === idx ? __spreadProps(__spreadValues({}, x), { error: e.message }) : x))
    });
  }
  static \u0275fac = function AssistantPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssistantPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AssistantPage, selectors: [["vc-assistant-page"]], viewQuery: function AssistantPage_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.thread, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, decls: 28, vars: 5, consts: [["thread", ""], ["routerLink", "/app/partners", 1, "back"], ["name", "arrow-left", 3, "size"], ["title", "Results assistant", "eyebrow", "Explain a calculation", "subtitle", "Ask where a number came from, why deductions were made, which samples and rules were used. Answers are looked up from the saved calculation record \u2014 no AI model is involved, and nothing is made up."], [1, "layout"], [1, "card", "chat"], [1, "thread"], [1, "intro"], [1, "composer", 3, "ngSubmit"], ["name", "q", "placeholder", "e.g. Why was an uncertainty deduction made?", "maxlength", "1000", "autocomplete", "off", 1, "input", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["name", "send"], [1, "side"], [1, "card"], [1, "card-head"], [1, "card-body"], [1, "muted", "small"], [3, "rows"], [1, "runs"], ["tone", "info", "icon", "info"], [1, "ii"], ["name", "message", 3, "size"], [1, "muted"], [1, "sugg"], ["type", "button", 1, "sg"], ["type", "button", 1, "sg", 3, "click"], [1, "msg", "me"], [1, "bub"], [1, "ctx"], [1, "msg", "bot"], [1, "av"], ["name", "calculator", 3, "size"], [1, "typing"], [1, "cites"], [1, "meth"], [1, "ch"], ["type", "button", 1, "more"], [1, "ct"], [1, "small", "subtle"], ["type", "button", 1, "more", 3, "click"], [1, "run", 3, "on"], [1, "run"], ["type", "radio", "name", "run", 3, "ngModelChange", "value", "ngModel"], [1, "rm"], [1, "rr"], [1, "num"], [3, "status"]], template: function AssistantPage_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "a", 1);
      \u0275\u0275element(1, "vc-icon", 2);
      \u0275\u0275text(2, "Partners & API");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "vc-page-header", 3);
      \u0275\u0275elementStart(4, "div", 4)(5, "section", 5)(6, "div", 6, 0);
      \u0275\u0275conditionalCreate(8, AssistantPage_Conditional_8_Template, 10, 1, "div", 7);
      \u0275\u0275repeaterCreate(9, AssistantPage_For_10_Template, 11, 8, null, null, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "form", 8);
      \u0275\u0275listener("ngSubmit", function AssistantPage_Template_form_ngSubmit_11_listener() {
        return ctx.ask(ctx.question);
      });
      \u0275\u0275elementStart(12, "input", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function AssistantPage_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.question, $event) || (ctx.question = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "button", 10);
      \u0275\u0275element(14, "vc-icon", 11);
      \u0275\u0275text(15, "Ask");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "aside", 12)(17, "section", 13)(18, "div", 14)(19, "h3");
      \u0275\u0275text(20, "Calculation run");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 15);
      \u0275\u0275conditionalCreate(22, AssistantPage_Conditional_22_Template, 2, 0, "p", 16)(23, AssistantPage_Conditional_23_Template, 1, 1, "vc-loading", 17)(24, AssistantPage_Conditional_24_Template, 2, 0, "p", 16)(25, AssistantPage_Conditional_25_Template, 3, 0, "div", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "vc-callout", 19);
      \u0275\u0275text(27, "The assistant answers four kinds of question: where a result came from, why deductions were made, which samples were used, and which rules applied.");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(7);
      \u0275\u0275conditional(!ctx.turns().length ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.turns());
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.question);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.question.trim().length < 3 || ctx.pending());
      \u0275\u0275advance(9);
      \u0275\u0275conditional(!ctx.ctx.currentId() ? 22 : ctx.runs.loading() ? 23 : !ctx.runs.data()?.length ? 24 : 25);
    }
  }, dependencies: [Icon, Badge, PageHeader, Loading, Callout, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, NgModel, NgForm, RouterLink, NumPipe, DayPipe], styles: ["\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  margin-bottom: 12px;\n  color: var(--%NS%text-2);\n}\n.layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 340px;\n  gap: 16px;\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.chat[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: calc(100vh - 260px);\n  min-height: 480px;\n}\n.thread[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow: auto;\n  padding: 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.intro[_ngcontent-%COMP%] {\n  margin: auto;\n  text-align: center;\n  max-width: 480px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.ii[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-600);\n}\n.sugg[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  justify-content: center;\n  margin-top: 10px;\n}\n.sg[_ngcontent-%COMP%] {\n  border: 1px solid var(--%NS%border-strong);\n  background: var(--%NS%surface);\n  border-radius: 999px;\n  padding: 7px 13px;\n  font: inherit;\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.sg[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%forest-400);\n  color: var(--%NS%forest-700);\n  background: var(--%NS%forest-50);\n}\n.msg[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.msg.me[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.bub[_ngcontent-%COMP%] {\n  max-width: 680px;\n  padding: 10px 14px;\n  border-radius: 12px;\n  font-size: 13.5px;\n  line-height: 1.55;\n}\n.me[_ngcontent-%COMP%]   .bub[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-700);\n  color: #fff;\n  border-bottom-right-radius: 4px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.ctx[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: rgba(255, 255, 255, 0.7);\n}\n.bot[_ngcontent-%COMP%]   .bub[_ngcontent-%COMP%] {\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  border-bottom-left-radius: 4px;\n  color: var(--%NS%stone-800);\n}\n.bot[_ngcontent-%COMP%]   .bub.na[_ngcontent-%COMP%] {\n  background: var(--%NS%sand-100);\n}\n.bot[_ngcontent-%COMP%]   .bub.err[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  border-color: #f3c7c3;\n  color: var(--%NS%red-600);\n}\n.av[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n}\n.cites[_ngcontent-%COMP%] {\n  margin-top: 10px;\n  padding-top: 10px;\n  border-top: 1px solid var(--%NS%border);\n}\n.ch[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n}\n.cites[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 6px 0 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.cites[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: baseline;\n  flex-wrap: wrap;\n  font-size: 12.5px;\n}\n.ct[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  padding: 1px 6px;\n  border-radius: 4px;\n  background: var(--%NS%dc-calculated-bg);\n  color: var(--%NS%dc-calculated);\n  font-weight: 500;\n}\n.cites[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%stone-700);\n  overflow-wrap: anywhere;\n}\n.more[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  color: var(--%NS%primary);\n  font: inherit;\n  font-size: 12.5px;\n  cursor: pointer;\n  padding: 4px 0 0;\n}\n.meth[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.typing[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 4px;\n}\n.typing[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--%NS%stone-400);\n  animation: _ngcontent-%COMP%_b 1s infinite ease-in-out;\n}\n.typing[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.15s;\n}\n.typing[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.3s;\n}\n@keyframes _ngcontent-%COMP%_b {\n  0%, 80%, 100% {\n    opacity: 0.3;\n  }\n  40% {\n    opacity: 1;\n  }\n}\n.composer[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  padding: 14px 16px;\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n  border-radius: 0 0 var(--%NS%radius) var(--%NS%radius);\n}\n.side[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.runs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-height: 420px;\n  overflow: auto;\n}\n.run[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.run[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n}\n.run.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-400);\n  background: var(--%NS%forest-50);\n}\n.rm[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.rr[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 3px;\n  font-size: 13px;\n}\n.rr[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n/*# sourceMappingURL=assistant.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssistantPage, [{
    type: Component,
    args: [{ selector: "vc-assistant-page", imports: [...KIT, FormsModule, RouterLink, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/partners" class="back"><vc-icon name="arrow-left" [size]="14" />Partners & API</a>
    <vc-page-header title="Results assistant" eyebrow="Explain a calculation"
      subtitle="Ask where a number came from, why deductions were made, which samples and rules were used. Answers are looked up from the saved calculation record \u2014 no AI model is involved, and nothing is made up." />

    <div class="layout">
      <section class="card chat">
        <div class="thread" #thread>
          @if (!turns().length) {
            <div class="intro">
              <span class="ii"><vc-icon name="message" [size]="20" /></span>
              <h3>Ask about a calculation run</h3>
              <p class="muted">Pick a run on the right, then ask in plain words. Each answer lists the records it came from.</p>
              <div class="sugg">@for (s of suggestions; track s) { <button type="button" class="sg" (click)="ask(s)">{{ s }}</button> }</div>
            </div>
          }
          @for (t of turns(); track $index) {
            <div class="msg me"><div class="bub">{{ t.q }}@if (t.runLabel) { <span class="ctx">{{ t.runLabel }}</span> }</div></div>
            <div class="msg bot">
              <span class="av"><vc-icon name="calculator" [size]="14" /></span>
              <div class="bub" [class.na]="t.a && !t.a.answered" [class.err]="!!t.error">
                @if (t.error) { {{ t.error }} }
                @else if (!t.a) { <span class="typing"><i></i><i></i><i></i></span> }
                @else {
                  <p>{{ t.a.answer }}</p>
                  @if (t.a.citations.length) {
                    <div class="cites">
                      <span class="ch">Sources \xB7 {{ t.a.citations.length }}</span>
                      <ul>
                        @for (c of t.a.citations.slice(0, showAll()[$index] ? 999 : 6); track $index) {
                          <li><span class="ct">{{ citeLabel(c) }}</span><code>{{ citeRef(c) }}</code>@if (c.source) { <span class="small subtle">{{ c.source }}</span> }</li>
                        }
                      </ul>
                      @if (t.a.citations.length > 6 && !showAll()[$index]) {
                        <button type="button" class="more" (click)="expand($index)">Show all {{ t.a.citations.length }}</button>
                      }
                    </div>
                  }
                  <div class="meth">{{ t.a.method }}</div>
                }
              </div>
            </div>
          }
        </div>
        <form class="composer" (ngSubmit)="ask(question)">
          <input class="input" name="q" [(ngModel)]="question" placeholder="e.g. Why was an uncertainty deduction made?" maxlength="1000" autocomplete="off" />
          <button class="btn btn-primary" type="submit" [disabled]="question.trim().length < 3 || pending()"><vc-icon name="send" />Ask</button>
        </form>
      </section>

      <aside class="side">
        <section class="card">
          <div class="card-head"><h3>Calculation run</h3></div>
          <div class="card-body">
            @if (!ctx.currentId()) { <p class="muted small">Choose a project in the top bar to list its runs.</p> }
            @else if (runs.loading()) { <vc-loading [rows]="3" /> }
            @else if (!runs.data()?.length) { <p class="muted small">This project has no calculation runs yet. The assistant can still tell you what it can answer.</p> }
            @else {
              <div class="runs">
                @for (r of runs.data(); track r.id) {
                  <label class="run" [class.on]="runId() === r.id">
                    <input type="radio" name="run" [value]="r.id" [ngModel]="runId()" (ngModelChange)="runId.set($event)" />
                    <span class="rm"><strong>{{ r.period_label }}</strong><span class="small subtle">{{ r.period_start | day }} \u2013 {{ r.period_end | day }}</span></span>
                    <span class="rr"><span class="num">{{ r.net_t_co2e | num: 1 }} <small>t</small></span>@if (r.status) { <vc-badge [status]="r.status" /> }</span>
                  </label>
                }
              </div>
            }
          </div>
        </section>
        <vc-callout tone="info" icon="info">The assistant answers four kinds of question: where a result came from, why deductions were made, which samples were used, and which rules applied.</vc-callout>
      </aside>
    </div>
  `, styles: ["/* angular:styles/component:scss;62be164a7cefa560;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\partners\\assistant.page.ts */\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  margin-bottom: 12px;\n  color: var(--text-2);\n}\n.layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 340px;\n  gap: 16px;\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}\n.chat {\n  display: flex;\n  flex-direction: column;\n  height: calc(100vh - 260px);\n  min-height: 480px;\n}\n.thread {\n  flex: 1;\n  overflow: auto;\n  padding: 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.intro {\n  margin: auto;\n  text-align: center;\n  max-width: 480px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.ii {\n  display: grid;\n  place-items: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  background: var(--forest-50);\n  color: var(--forest-600);\n}\n.sugg {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  justify-content: center;\n  margin-top: 10px;\n}\n.sg {\n  border: 1px solid var(--border-strong);\n  background: var(--surface);\n  border-radius: 999px;\n  padding: 7px 13px;\n  font: inherit;\n  font-size: 13px;\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.sg:hover {\n  border-color: var(--forest-400);\n  color: var(--forest-700);\n  background: var(--forest-50);\n}\n.msg {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.msg.me {\n  justify-content: flex-end;\n}\n.bub {\n  max-width: 680px;\n  padding: 10px 14px;\n  border-radius: 12px;\n  font-size: 13.5px;\n  line-height: 1.55;\n}\n.me .bub {\n  background: var(--forest-700);\n  color: #fff;\n  border-bottom-right-radius: 4px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.ctx {\n  font-size: 11.5px;\n  color: rgba(255, 255, 255, 0.7);\n}\n.bot .bub {\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  border-bottom-left-radius: 4px;\n  color: var(--stone-800);\n}\n.bot .bub.na {\n  background: var(--sand-100);\n}\n.bot .bub.err {\n  background: var(--danger-soft);\n  border-color: #f3c7c3;\n  color: var(--red-600);\n}\n.av {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 28px;\n  height: 28px;\n  border-radius: 8px;\n  background: var(--forest-100);\n  color: var(--forest-700);\n}\n.cites {\n  margin-top: 10px;\n  padding-top: 10px;\n  border-top: 1px solid var(--border);\n}\n.ch {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--text-3);\n}\n.cites ul {\n  list-style: none;\n  margin: 6px 0 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.cites li {\n  display: flex;\n  gap: 8px;\n  align-items: baseline;\n  flex-wrap: wrap;\n  font-size: 12.5px;\n}\n.ct {\n  font-size: 11.5px;\n  padding: 1px 6px;\n  border-radius: 4px;\n  background: var(--dc-calculated-bg);\n  color: var(--dc-calculated);\n  font-weight: 500;\n}\n.cites code {\n  font-size: 11.5px;\n  color: var(--stone-700);\n  overflow-wrap: anywhere;\n}\n.more {\n  border: 0;\n  background: none;\n  color: var(--primary);\n  font: inherit;\n  font-size: 12.5px;\n  cursor: pointer;\n  padding: 4px 0 0;\n}\n.meth {\n  margin-top: 8px;\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.typing {\n  display: inline-flex;\n  gap: 4px;\n}\n.typing i {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--stone-400);\n  animation: b 1s infinite ease-in-out;\n}\n.typing i:nth-child(2) {\n  animation-delay: 0.15s;\n}\n.typing i:nth-child(3) {\n  animation-delay: 0.3s;\n}\n@keyframes b {\n  0%, 80%, 100% {\n    opacity: 0.3;\n  }\n  40% {\n    opacity: 1;\n  }\n}\n.composer {\n  display: flex;\n  gap: 10px;\n  padding: 14px 16px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n  border-radius: 0 0 var(--radius) var(--radius);\n}\n.side {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.runs {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-height: 420px;\n  overflow: auto;\n}\n.run {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.run input {\n  accent-color: var(--primary);\n}\n.run.on {\n  border-color: var(--forest-400);\n  background: var(--forest-50);\n}\n.rm {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.rr {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 3px;\n  font-size: 13px;\n}\n.rr small {\n  color: var(--text-3);\n}\n/*# sourceMappingURL=assistant.page.css.map */\n"] }]
  }], () => [], { thread: [{ type: ViewChild, args: ["thread", { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AssistantPage, { className: "AssistantPage", filePath: "src/app/features/partners/assistant.page.ts", lineNumber: 145 });
})();

// src/app/features/partners/partners.page.ts
var _forTrack02 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.p;
var _forTrack2 = ($index, $item) => $item.key;
function PartnersPage_Case_5_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 16);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function PartnersPage_Case_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275element(1, "vc-error", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.keys.error().message);
  }
}
function PartnersPage_Case_5_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-empty", 27)(1, "button", 23);
    \u0275\u0275listener("click", function PartnersPage_Case_5_Conditional_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openKey());
    });
    \u0275\u0275element(2, "vc-icon", 24);
    \u0275\u0275text(3, "Create API key");
    \u0275\u0275elementEnd()();
  }
}
function PartnersPage_Case_5_Conditional_11_For_19_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.scopeLabel(s_r4));
  }
}
function PartnersPage_Case_5_Conditional_11_For_19_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function PartnersPage_Case_5_Conditional_11_For_19_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const k_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.revokeTarget.set(k_r6));
    });
    \u0275\u0275element(1, "vc-icon", 40);
    \u0275\u0275text(2, "Revoke");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function PartnersPage_Case_5_Conditional_11_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "code", 31);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "div", 32);
    \u0275\u0275repeaterCreate(9, PartnersPage_Case_5_Conditional_11_For_19_For_10_Template, 2, 1, "span", 33, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 34);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "ago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 35);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td")(18, "vc-badge", 36);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td", 37);
    \u0275\u0275conditionalCreate(21, PartnersPage_Case_5_Conditional_11_For_19_Conditional_21_Template, 3, 1, "button", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const k_r6 = ctx.$implicit;
    \u0275\u0275classProp("dim", !k_r6.is_active);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(k_r6.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("vcp_", k_r6.prefix, "_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(k_r6.scopes);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(k_r6.last_used_at ? \u0275\u0275pipeBind1(13, 9, k_r6.last_used_at) : "Never");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 11, k_r6.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275property("status", k_r6.is_active ? "active" : "inactive");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(k_r6.is_active ? "Active" : "Revoked");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(k_r6.is_active ? 21 : -1);
  }
}
function PartnersPage_Case_5_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "table", 29)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Key");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Scopes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Last used");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Created");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, PartnersPage_Case_5_Conditional_11_For_19_Template, 22, 13, "tr", 30, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r1.keys.data());
  }
}
function PartnersPage_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "p", 21);
    \u0275\u0275text(2, "Keys are shown once when created. Only a fingerprint is stored, so a lost key can't be recovered \u2014 revoke it and create a new one.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "span", 22);
    \u0275\u0275elementStart(4, "button", 23);
    \u0275\u0275listener("click", function PartnersPage_Case_5_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openKey());
    });
    \u0275\u0275element(5, "vc-icon", 24);
    \u0275\u0275text(6, "Create API key");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "section", 25);
    \u0275\u0275conditionalCreate(8, PartnersPage_Case_5_Conditional_8_Template, 1, 1, "vc-loading", 16)(9, PartnersPage_Case_5_Conditional_9_Template, 2, 1, "div", 26)(10, PartnersPage_Case_5_Conditional_10_Template, 4, 0, "vc-empty", 27)(11, PartnersPage_Case_5_Conditional_11_Template, 20, 0, "div", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r1.keys.loading() && !ctx_r1.keys.data() ? 8 : ctx_r1.keys.error() ? 9 : !ctx_r1.keys.data()?.length ? 10 : 11);
  }
}
function PartnersPage_Case_6_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "vc-loading", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 4);
  }
}
function PartnersPage_Case_6_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 44);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r1.hooks.error().message);
  }
}
function PartnersPage_Case_6_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "vc-empty", 46)(2, "button", 23);
    \u0275\u0275listener("click", function PartnersPage_Case_6_Conditional_15_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openHook());
    });
    \u0275\u0275element(3, "vc-icon", 43);
    \u0275\u0275text(4, "Add webhook");
    \u0275\u0275elementEnd()()();
  }
}
function PartnersPage_Case_6_Conditional_16_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(w_r10.description);
  }
}
function PartnersPage_Case_6_Conditional_16_For_2_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 61)(1, "code");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("title", ctx_r1.eventInfo(e_r11));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r11);
  }
}
function PartnersPage_Case_6_Conditional_16_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 48)(1, "div", 49)(2, "span", 50);
    \u0275\u0275element(3, "vc-icon", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 52)(5, "code", 53);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, PartnersPage_Case_6_Conditional_16_For_2_Conditional_7_Template, 2, 1, "span", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "label", 55)(9, "input", 56);
    \u0275\u0275listener("change", function PartnersPage_Case_6_Conditional_16_For_2_Template_input_change_9_listener($event) {
      const w_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleHook(w_r10, $event.target.checked));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 57);
    \u0275\u0275element(11, "span", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 59);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 60);
    \u0275\u0275repeaterCreate(15, PartnersPage_Case_6_Conditional_16_For_2_For_16_Template, 3, 2, "span", 61, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275element(17, "span", 22);
    \u0275\u0275elementStart(18, "span", 62);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 63);
    \u0275\u0275listener("click", function PartnersPage_Case_6_Conditional_16_For_2_Template_button_click_21_listener() {
      const w_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openDeliveries(w_r10));
    });
    \u0275\u0275element(22, "vc-icon", 64);
    \u0275\u0275text(23, "Deliveries");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const w_r10 = ctx.$implicit;
    \u0275\u0275classProp("dim", !w_r10.is_active);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(w_r10.url);
    \u0275\u0275advance();
    \u0275\u0275conditional(w_r10.description ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("title", w_r10.is_active ? "Disable" : "Enable");
    \u0275\u0275advance();
    \u0275\u0275property("checked", w_r10.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(w_r10.is_active ? "Enabled" : "Disabled");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(w_r10.events);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Added ", \u0275\u0275pipeBind1(20, 10, w_r10.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 14);
  }
}
function PartnersPage_Case_6_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275repeaterCreate(1, PartnersPage_Case_6_Conditional_16_For_2_Template, 24, 12, "section", 47, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.hooks.data());
  }
}
function PartnersPage_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "p", 21);
    \u0275\u0275text(2, "Each delivery is signed with HMAC-SHA256 in the ");
    \u0275\u0275elementStart(3, "code");
    \u0275\u0275text(4, "X-Signature");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " header. Failed deliveries are retried up to 8 times.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "span", 22);
    \u0275\u0275elementStart(7, "button", 41);
    \u0275\u0275listener("click", function PartnersPage_Case_6_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dispatch());
    });
    \u0275\u0275element(8, "vc-icon", 42);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 23);
    \u0275\u0275listener("click", function PartnersPage_Case_6_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openHook());
    });
    \u0275\u0275element(11, "vc-icon", 43);
    \u0275\u0275text(12, "Add webhook");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, PartnersPage_Case_6_Conditional_13_Template, 2, 1, "div", 25)(14, PartnersPage_Case_6_Conditional_14_Template, 1, 1, "vc-error", 44)(15, PartnersPage_Case_6_Conditional_15_Template, 5, 0, "div", 25)(16, PartnersPage_Case_6_Conditional_16_Template, 3, 0, "div", 45);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", ctx_r1.dispatching());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.dispatching() ? "Sending\u2026" : "Dispatch pending events");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.hooks.loading() && !ctx_r1.hooks.data() ? 13 : ctx_r1.hooks.error() ? 14 : !ctx_r1.hooks.data()?.length ? 15 : 16);
  }
}
function PartnersPage_Case_7_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r13 = ctx.$implicit;
    \u0275\u0275property("value", e_r13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r13);
  }
}
function PartnersPage_Case_7_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 16);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function PartnersPage_Case_7_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275element(1, "vc-error", 71);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.events.error().message);
  }
}
function PartnersPage_Case_7_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 70);
  }
}
function PartnersPage_Case_7_Conditional_16_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 34)(2, "span", 72);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td")(7, "code", 73);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 62);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 59)(12, "span", 74);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "code", 75);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td")(17, "code", 76);
    \u0275\u0275pipe(18, "json");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const e_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("title", \u0275\u0275pipeBind2(3, 8, e_r14.at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 11, e_r14.at));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(e_r14.event);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.eventInfo(e_r14.event));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(e_r14.entity_type);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r14.entity_id.slice(0, 8));
    \u0275\u0275advance(2);
    \u0275\u0275property("title", \u0275\u0275pipeBind1(18, 13, e_r14.payload));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.preview(e_r14.payload));
  }
}
function PartnersPage_Case_7_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "table", 29)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "When");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Record");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Payload");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275repeaterCreate(13, PartnersPage_Case_7_Conditional_16_For_14_Template, 20, 15, "tr", null, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r1.events.data());
  }
}
function PartnersPage_Case_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 20)(1, "select", 65);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PartnersPage_Case_7_Template_select_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.eventFilter.set($event));
    });
    \u0275\u0275elementStart(2, "option", 66);
    \u0275\u0275text(3, "All events");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, PartnersPage_Case_7_For_5_Template, 2, 2, "option", 67, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 54);
    \u0275\u0275text(7, "The outbox: every event raised in your organisation, newest first. Webhooks receive the ones they subscribe to.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "span", 22);
    \u0275\u0275elementStart(9, "button", 68);
    \u0275\u0275listener("click", function PartnersPage_Case_7_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadEvents());
    });
    \u0275\u0275element(10, "vc-icon", 69);
    \u0275\u0275text(11, "Refresh");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "section", 25);
    \u0275\u0275conditionalCreate(13, PartnersPage_Case_7_Conditional_13_Template, 1, 1, "vc-loading", 16)(14, PartnersPage_Case_7_Conditional_14_Template, 2, 1, "div", 26)(15, PartnersPage_Case_7_Conditional_15_Template, 1, 0, "vc-empty", 70)(16, PartnersPage_Case_7_Conditional_16_Template, 15, 0, "div", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.eventFilter());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.allowedEvents());
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.events.loading() && !ctx_r1.events.data() ? 13 : ctx_r1.events.error() ? 14 : !ctx_r1.events.data()?.length ? 15 : 16);
  }
}
function PartnersPage_Case_8_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 81);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "code");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "span", 33);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 54);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r16 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("post", e_r16.m === "POST");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r16.m);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(e_r16.p);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.scopeLabel(e_r16.scope));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r16.d);
  }
}
function PartnersPage_Case_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "section", 25)(2, "div", 77)(3, "h3");
    \u0275\u0275text(4, "Partner API \xB7 v1");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 62);
    \u0275\u0275text(6, "Base path ");
    \u0275\u0275elementStart(7, "code");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 19)(10, "table", 29)(11, "thead")(12, "tr")(13, "th");
    \u0275\u0275text(14, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Endpoint");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Scope");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "What it does");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, PartnersPage_Case_8_For_23_Template, 12, 6, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(24, "section", 25)(25, "div", 77)(26, "h3");
    \u0275\u0275text(27, "Authenticate with X-API-Key");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 63);
    \u0275\u0275listener("click", function PartnersPage_Case_8_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.copy(ctx_r1.curl));
    });
    \u0275\u0275element(29, "vc-icon", 78);
    \u0275\u0275text(30, "Copy");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "pre", 79);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 80)(34, "span", 54);
    \u0275\u0275text(35, "Errors use one shape: ");
    \u0275\u0275elementStart(36, "code");
    \u0275\u0275text(37);
    \u0275\u0275elementEnd();
    \u0275\u0275text(38, ". A missing or revoked key answers 401 ");
    \u0275\u0275elementStart(39, "code");
    \u0275\u0275text(40, "INVALID_API_KEY");
    \u0275\u0275elementEnd();
    \u0275\u0275text(41, "; a missing scope answers 403.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "section", 25)(43, "div", 77)(44, "h3");
    \u0275\u0275text(45, "Verify a webhook signature");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "pre", 79);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", ctx_r1.origin, "/api");
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r1.endpoints);
    \u0275\u0275advance(7);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.curl);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", "{", '"code", "message", "details"', "}");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.verify);
  }
}
function PartnersPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "vc-callout", 82)(2, "strong");
    \u0275\u0275text(3, "This is the only time the key is shown.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Store it in the partner's secret manager now. If it is lost, revoke it and create a new one.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 83)(6, "code");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 68);
    \u0275\u0275listener("click", function PartnersPage_Conditional_10_Template_button_click_8_listener() {
      const nk_r18 = \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.copy(nk_r18.key));
    });
    \u0275\u0275element(9, "vc-icon", 84);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "dl", 85)(12, "dt");
    \u0275\u0275text(13, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dt");
    \u0275\u0275text(17, "Scopes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const nk_r18 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(nk_r18.key);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r1.copied() ? "check" : "copy")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.copied() ? "Copied" : "Copy");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(nk_r18.name);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.scopesText(nk_r18.scopes));
  }
}
function PartnersPage_Conditional_11_For_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 93)(1, "input", 94);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PartnersPage_Conditional_11_For_11_Template_input_ngModelChange_1_listener($event) {
      const s_r21 = \u0275\u0275restoreView(_r20).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.keyScopes[s_r21.key], $event) || (ctx_r1.keyScopes[s_r21.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r21 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.keyScopes[s_r21.key]);
    \u0275\u0275advance();
    \u0275\u0275property("name", "s_" + s_r21.key);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.keyScopes[s_r21.key]);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r21.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r21.hint);
  }
}
function PartnersPage_Conditional_11_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 92);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function PartnersPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 86);
    \u0275\u0275listener("ngSubmit", function PartnersPage_Conditional_11_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createKey());
    });
    \u0275\u0275elementStart(1, "div", 87)(2, "label", 88);
    \u0275\u0275text(3, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 89);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PartnersPage_Conditional_11_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.keyName, $event) || (ctx_r1.keyName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 90);
    \u0275\u0275text(6, "Who or what will use this key.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 87)(8, "label");
    \u0275\u0275text(9, "Scopes");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, PartnersPage_Conditional_11_For_11_Template, 7, 6, "label", 91, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, PartnersPage_Conditional_11_Conditional_12_Template, 1, 1, "vc-error", 92);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.keyName);
    \u0275\u0275control();
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.scopes);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.formError() ? 12 : -1);
  }
}
function PartnersPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function PartnersPage_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r22);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.keyOpen.set(false);
      return \u0275\u0275resetView(ctx_r1.newKey.set(null));
    });
    \u0275\u0275text(1, "I've stored the key");
    \u0275\u0275elementEnd();
  }
}
function PartnersPage_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function PartnersPage_Conditional_14_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r23);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.keyOpen.set(false));
    });
    \u0275\u0275text(1, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 95);
    \u0275\u0275text(3, "Create key");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.busy() || ctx_r1.keyName.trim().length < 2 || !ctx_r1.chosenScopes().length);
  }
}
function PartnersPage_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "vc-callout", 82)(2, "strong");
    \u0275\u0275text(3, "Copy the signing secret now \u2014 it is shown only once.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " The receiver uses it to check the ");
    \u0275\u0275elementStart(5, "code");
    \u0275\u0275text(6, "X-Signature");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " header on every delivery.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 83)(9, "code");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 68);
    \u0275\u0275listener("click", function PartnersPage_Conditional_29_Template_button_click_11_listener() {
      const sec_r25 = \u0275\u0275restoreView(_r24);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.copy(sec_r25));
    });
    \u0275\u0275element(12, "vc-icon", 84);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r1.copied() ? "check" : "copy")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.copied() ? "Copied" : "Copy");
  }
}
function PartnersPage_Conditional_30_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 99);
    \u0275\u0275text(1, "Use an https:// address.");
    \u0275\u0275elementEnd();
  }
}
function PartnersPage_Conditional_30_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 90);
    \u0275\u0275text(1, "Must use https.");
    \u0275\u0275elementEnd();
  }
}
function PartnersPage_Conditional_30_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 103)(1, "input", 94);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PartnersPage_Conditional_30_For_18_Template_input_ngModelChange_1_listener($event) {
      const e_r28 = \u0275\u0275restoreView(_r27).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.hookEvents[e_r28], $event) || (ctx_r1.hookEvents[e_r28] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span")(3, "code");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const e_r28 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("name", "e_" + e_r28);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.hookEvents[e_r28]);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(e_r28);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.eventInfo(e_r28));
  }
}
function PartnersPage_Conditional_30_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 104);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function PartnersPage_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 96);
    \u0275\u0275listener("ngSubmit", function PartnersPage_Conditional_30_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createHook());
    });
    \u0275\u0275elementStart(1, "div", 87)(2, "label", 97);
    \u0275\u0275text(3, "Address");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 98);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PartnersPage_Conditional_30_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.hookUrl, $event) || (ctx_r1.hookUrl = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PartnersPage_Conditional_30_Conditional_5_Template, 2, 0, "span", 99)(6, PartnersPage_Conditional_30_Conditional_6_Template, 2, 0, "span", 90);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 87)(8, "label", 100);
    \u0275\u0275text(9, "Description ");
    \u0275\u0275elementStart(10, "span", 75);
    \u0275\u0275text(11, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "input", 101);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PartnersPage_Conditional_30_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.hookDesc, $event) || (ctx_r1.hookDesc = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 87)(14, "label");
    \u0275\u0275text(15, "Events");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 102);
    \u0275\u0275repeaterCreate(17, PartnersPage_Conditional_30_For_18_Template, 7, 4, "label", 103, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(19, PartnersPage_Conditional_30_Conditional_19_Template, 1, 1, "vc-error", 104);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275classProp("invalid", ctx_r1.hookUrl && !ctx_r1.urlOk());
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.hookUrl);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hookUrl && !ctx_r1.urlOk() ? 5 : 6);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.hookDesc);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.allowedEvents());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.formError() ? 19 : -1);
  }
}
function PartnersPage_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function PartnersPage_Conditional_32_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.hookOpen.set(false);
      return \u0275\u0275resetView(ctx_r1.newSecret.set(null));
    });
    \u0275\u0275text(1, "I've stored the secret");
    \u0275\u0275elementEnd();
  }
}
function PartnersPage_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function PartnersPage_Conditional_33_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r30);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.hookOpen.set(false));
    });
    \u0275\u0275text(1, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 105);
    \u0275\u0275text(3, "Add webhook");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.busy() || !ctx_r1.urlOk() || !ctx_r1.chosenEvents().length);
  }
}
function PartnersPage_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 16);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function PartnersPage_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 17);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.deliveries.error().message);
  }
}
function PartnersPage_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 18);
  }
}
function PartnersPage_Conditional_38_For_14_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 106);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r31 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r31.error);
  }
}
function PartnersPage_Conditional_38_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 35);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td")(5, "vc-badge", 36);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, PartnersPage_Conditional_38_For_14_Conditional_7_Template, 2, 1, "div", 106);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 37);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td")(11, "code", 107);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const d_r31 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 6, d_r31.at, true));
    \u0275\u0275advance(3);
    \u0275\u0275property("status", d_r31.ok ? "delivered" : "failed");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r31.ok ? "HTTP " + d_r31.status_code : d_r31.status_code ? "HTTP " + d_r31.status_code : "Failed");
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r31.error ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r31.attempt);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(d_r31.event_id.slice(0, 8));
  }
}
function PartnersPage_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "table", 29)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "When");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Result");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 37);
    \u0275\u0275text(9, "Attempt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Event");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275repeaterCreate(13, PartnersPage_Conditional_38_For_14_Template, 13, 9, "tr", null, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r1.deliveries.data());
  }
}
var SCOPES = [
  { key: "read", label: "Read results", hint: "List projects and approved results with their package fingerprints" },
  { key: "write_practices", label: "Record practices", hint: "Send practice records from a partner system (idempotent by client_ref)" }
];
var EVENT_INFO = {
  "result.approved": "A calculation result was approved",
  "result.superseded": "An approved result was replaced by a newer one",
  "package.issued": "A verification package was issued",
  "credits.issued": "Credits were issued into a batch",
  "sale.created": "A credit sale was recorded",
  "payout.completed": "A farmer payout was completed",
  "farmer.enrolled": "A farmer was enrolled in a project",
  "practice.recorded": "A practice was recorded"
};
var ENDPOINTS = [
  { m: "GET", p: "/partner/v1/projects", scope: "read", d: "Projects in your organisation" },
  { m: "GET", p: "/partner/v1/projects/{id}/results", scope: "read", d: "Approved results, with the verification package SHA-256" },
  { m: "POST", p: "/partner/v1/practices", scope: "write_practices", d: "Record a practice; repeat calls with the same client_ref are safe" }
];
var PartnersPage = class _PartnersPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  tab = signal(
    this.route.snapshot.queryParamMap.get("tab") ?? "keys",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  keys = new Remote();
  hooks = new Remote();
  events = new Remote();
  deliveries = new Remote();
  allowedEvents = signal(
    Object.keys(EVENT_INFO),
    ...ngDevMode ? [{ debugName: "allowedEvents" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eventFilter = signal(
    "",
    ...ngDevMode ? [{ debugName: "eventFilter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "keys", label: "API keys", count: this.keys.data()?.filter((k) => k.is_active).length ?? null },
      { key: "webhooks", label: "Webhooks", count: this.hooks.data()?.length ?? null },
      { key: "events", label: "Events feed" },
      { key: "reference", label: "Partner API reference" }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  scopes = SCOPES;
  endpoints = ENDPOINTS;
  origin = location.origin;
  curl = `curl ${location.origin}/api/partner/v1/projects \\
  -H "X-API-Key: vcp_1a2b3c4d_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"

# Record a practice (safe to retry with the same client_ref)
curl -X POST ${location.origin}/api/partner/v1/practices \\
  -H "X-API-Key: vcp_1a2b3c4d_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" -H "Content-Type: application/json" \\
  -d '{"field_id": "\u2026", "practice_code": "cover_crop",
       "performed_on": "2026-06-15", "client_ref": "erp-7781"}'`;
  verify = `# Python \u2014 compare against the X-Signature header
import hmac, hashlib

def valid(secret: str, body: bytes, header: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, header)`;
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  dispatching = signal(
    false,
    ...ngDevMode ? [{ debugName: "dispatching" }] : (
      /* istanbul ignore next */
      []
    )
  );
  copied = signal(
    false,
    ...ngDevMode ? [{ debugName: "copied" }] : (
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
  keyOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "keyOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  newKey = signal(
    null,
    ...ngDevMode ? [{ debugName: "newKey" }] : (
      /* istanbul ignore next */
      []
    )
  );
  revokeTarget = signal(
    null,
    ...ngDevMode ? [{ debugName: "revokeTarget" }] : (
      /* istanbul ignore next */
      []
    )
  );
  keyName = "";
  keyScopes = { read: true };
  chosenScopes = () => SCOPES.filter((s) => this.keyScopes[s.key]).map((s) => s.key);
  hookOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "hookOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  newSecret = signal(
    null,
    ...ngDevMode ? [{ debugName: "newSecret" }] : (
      /* istanbul ignore next */
      []
    )
  );
  hookUrl = "";
  hookDesc = "";
  hookEvents = {};
  chosenEvents = () => this.allowedEvents().filter((e) => this.hookEvents[e]);
  urlOk = () => /^https:\/\/[^\s/]+\.[^\s]+/.test(this.hookUrl.trim()) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(this.hookUrl.trim());
  delOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "delOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  delHook = signal(
    null,
    ...ngDevMode ? [{ debugName: "delHook" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.keys.load(this.api.get("/partners/api-keys"));
    this.hooks.load(this.api.get("/partners/webhooks"));
    this.api.get("/partners/webhook-events").subscribe({ next: (e) => this.allowedEvents.set(e), error: () => {
    } });
    effect(() => {
      const t = this.tab();
      untracked(() => this.router.navigate([], { queryParams: { tab: t === "keys" ? null : t }, replaceUrl: true }));
    });
    effect(() => {
      const f = this.eventFilter();
      untracked(() => this.events.load(this.api.get("/partners/events", { event: f, limit: 200 }), true));
    });
  }
  loadEvents() {
    this.events.load(this.api.get("/partners/events", { event: this.eventFilter(), limit: 200 }), true);
  }
  scopeLabel(s) {
    return SCOPES.find((x) => x.key === s)?.label ?? s;
  }
  scopesText(s) {
    return s.map((x) => this.scopeLabel(x)).join(", ");
  }
  eventInfo(e) {
    return EVENT_INFO[e] ?? "";
  }
  preview(p) {
    return Object.entries(p ?? {}).map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`).join(" \xB7 ");
  }
  copy(text) {
    navigator.clipboard?.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
  openKey() {
    this.keyName = "";
    this.keyScopes = { read: true };
    this.newKey.set(null);
    this.formError.set(null);
    this.keyOpen.set(true);
  }
  createKey() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post("/partners/api-keys", { name: this.keyName.trim(), scopes: this.chosenScopes() }).subscribe({
      next: (k) => {
        this.busy.set(false);
        this.newKey.set(k);
        this.keys.load(this.api.get("/partners/api-keys"), true);
      },
      error: (e) => {
        this.busy.set(false);
        this.formError.set(e.message);
      }
    });
  }
  revoke() {
    const k = this.revokeTarget();
    if (!k)
      return;
    this.busy.set(true);
    this.api.post(`/partners/api-keys/${k.id}/revoke`).subscribe({
      next: () => {
        this.busy.set(false);
        this.revokeTarget.set(null);
        this.toast.success("Key revoked", k.name);
        this.keys.load(this.api.get("/partners/api-keys"), true);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't revoke the key");
      }
    });
  }
  openHook() {
    this.hookUrl = "";
    this.hookDesc = "";
    this.hookEvents = { "result.approved": true };
    this.newSecret.set(null);
    this.formError.set(null);
    this.hookOpen.set(true);
  }
  createHook() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post("/partners/webhooks", { url: this.hookUrl.trim(), events: this.chosenEvents(), description: this.hookDesc.trim() }).subscribe({
      next: (w) => {
        this.busy.set(false);
        this.hooks.load(this.api.get("/partners/webhooks"), true);
        if (w.secret)
          this.newSecret.set(w.secret);
        else {
          this.hookOpen.set(false);
          this.toast.success("Webhook added", w.url);
        }
      },
      error: (e) => {
        this.busy.set(false);
        this.formError.set(e.message);
      }
    });
  }
  toggleHook(w, on) {
    this.api.patch(`/partners/webhooks/${w.id}`, { is_active: on }).subscribe({
      next: () => {
        this.toast.success(on ? "Webhook enabled" : "Webhook disabled", w.url);
        this.hooks.load(this.api.get("/partners/webhooks"), true);
      },
      error: (e) => {
        this.toast.apiError(e, "Couldn't change the webhook");
        this.hooks.load(this.api.get("/partners/webhooks"), true);
      }
    });
  }
  openDeliveries(w) {
    this.delHook.set(w);
    this.deliveries.load(this.api.get(`/partners/webhooks/${w.id}/deliveries`));
    this.delOpen.set(true);
  }
  dispatch() {
    this.dispatching.set(true);
    this.api.post("/partners/webhooks/dispatch").subscribe({
      next: (s) => {
        this.dispatching.set(false);
        if (!s.attempted)
          this.toast.info("Nothing to send", "All subscribed events have already been delivered.");
        else if (s.failed)
          this.toast.error(`${s.delivered} delivered, ${s.failed} failed`, "Failed deliveries are retried next time. Open a webhook's deliveries to see why.");
        else
          this.toast.success(`${s.delivered} events delivered`);
      },
      error: (e) => {
        this.dispatching.set(false);
        this.toast.apiError(e, "Couldn't dispatch events");
      }
    });
  }
  static \u0275fac = function PartnersPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PartnersPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PartnersPage, selectors: [["vc-partners-page"]], decls: 39, vars: 19, consts: [["title", "Partners & API", "eyebrow", "Administration", "subtitle", "Let partner systems read approved results and send practice records, and push events to them as they happen."], ["actions", "", "routerLink", "assistant", 1, "btn", "btn-secondary"], ["name", "message"], [3, "activeChange", "tabs", "active"], [1, "grid", "ref"], ["width", "520px", 3, "openChange", "closed", "open", "title"], [1, "stack", 2, "--gap", "14px"], ["id", "keyForm", 1, "stack", 2, "--gap", "14px"], ["footer", ""], [1, "btn", "btn-primary"], ["title", "Revoke this key?", "width", "440px", 3, "closed", "open"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-danger", 3, "click", "disabled"], ["width", "560px", 3, "openChange", "closed", "open", "title"], ["id", "hookForm", 1, "stack", 2, "--gap", "14px"], ["width", "560px", "title", "Deliveries", 3, "openChange", "open", "drawer", "subtitle"], [3, "rows"], ["title", "Couldn't load deliveries", 3, "message"], ["icon", "send", "title", "Nothing delivered yet", "text", "Use 'Dispatch pending events' to send events raised since this webhook was added."], [1, "table-wrap"], [1, "bar"], [1, "muted", "small"], [1, "spacer"], [1, "btn", "btn-primary", 3, "click"], ["name", "key"], [1, "card"], [1, "card-body"], ["icon", "key", "title", "No API keys yet", "text", "Create a key for each partner system, with only the scopes it needs."], ["title", "Couldn't load API keys", 3, "message"], [1, "table"], [3, "dim"], [1, "kp"], [1, "chips"], [1, "scope"], [1, "nowrap"], [1, "nowrap", "small"], [3, "status"], [1, "num"], [1, "btn", "btn-ghost", "btn-sm", "danger-t"], [1, "btn", "btn-ghost", "btn-sm", "danger-t", 3, "click"], ["name", "ban", 3, "size"], [1, "btn", "btn-secondary", 3, "click", "disabled"], ["name", "send"], ["name", "plus"], ["title", "Couldn't load webhooks", 3, "message"], [1, "hooks"], ["icon", "webhook", "title", "No webhooks yet", "text", "Add an https address to receive events such as approved results and completed payouts."], [1, "card", "hook", 3, "dim"], [1, "card", "hook"], [1, "hh"], [1, "hi"], ["name", "webhook", 3, "size"], [1, "hm"], [1, "url"], [1, "small", "muted"], [1, "toggle", 3, "title"], ["type", "checkbox", 3, "change", "checked"], [1, "tr"], [1, "th"], [1, "small"], [1, "he"], [1, "ev", 3, "title"], [1, "small", "subtle"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "history", 3, "size"], ["aria-label", "Event type", 1, "input", "evf", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "refresh", 3, "size"], ["icon", "activity", "title", "No events yet", "text", "Events appear as results are approved, credits issued, sales made and payouts completed."], ["title", "Couldn't load events", 3, "message"], [3, "title"], [1, "evc"], [1, "muted"], [1, "subtle"], [1, "payload", 3, "title"], [1, "card-head"], ["name", "copy", 3, "size"], [1, "code"], [1, "card-foot", "left"], [1, "m"], ["tone", "warn", "icon", "alert"], [1, "secret"], [3, "name", "size"], [1, "kv"], ["id", "keyForm", 1, "stack", 2, "--gap", "14px", 3, "ngSubmit"], [1, "field"], ["for", "kn"], ["id", "kn", "name", "kn", "placeholder", "e.g. FPO accounting system", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], [1, "scopt", 3, "on"], ["title", "Key not created", 3, "message"], [1, "scopt"], ["type", "checkbox", 3, "ngModelChange", "name", "ngModel"], ["type", "submit", "form", "keyForm", 1, "btn", "btn-primary", 3, "disabled"], ["id", "hookForm", 1, "stack", 2, "--gap", "14px", 3, "ngSubmit"], ["for", "hu"], ["id", "hu", "name", "hu", "placeholder", "https://partner.example.org/hooks/varsapradaya", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "error"], ["for", "hd"], ["id", "hd", "name", "hd", "placeholder", "What the partner does with these events", 1, "input", 3, "ngModelChange", "ngModel"], [1, "evgrid"], [1, "checkbox", "evopt"], ["title", "Webhook not added", 3, "message"], ["type", "submit", "form", "hookForm", 1, "btn", "btn-primary", 3, "disabled"], [1, "small", "muted", "err"], [1, "subtle", "small"]], template: function PartnersPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "a", 1);
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Results assistant");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "vc-tabs", 3);
      \u0275\u0275twoWayListener("activeChange", function PartnersPage_Template_vc_tabs_activeChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tab, $event) || (ctx.tab = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, PartnersPage_Case_5_Template, 12, 1)(6, PartnersPage_Case_6_Template, 17, 3)(7, PartnersPage_Case_7_Template, 17, 3)(8, PartnersPage_Case_8_Template, 48, 6, "div", 4);
      \u0275\u0275elementStart(9, "vc-modal", 5);
      \u0275\u0275twoWayListener("openChange", function PartnersPage_Template_vc_modal_openChange_9_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.keyOpen, $event) || (ctx.keyOpen = $event);
        return $event;
      });
      \u0275\u0275listener("closed", function PartnersPage_Template_vc_modal_closed_9_listener() {
        return ctx.newKey.set(null);
      });
      \u0275\u0275conditionalCreate(10, PartnersPage_Conditional_10_Template, 20, 6, "div", 6)(11, PartnersPage_Conditional_11_Template, 13, 2, "form", 7);
      \u0275\u0275elementContainerStart(12, 8);
      \u0275\u0275conditionalCreate(13, PartnersPage_Conditional_13_Template, 2, 0, "button", 9)(14, PartnersPage_Conditional_14_Template, 4, 1);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "vc-modal", 10);
      \u0275\u0275listener("closed", function PartnersPage_Template_vc_modal_closed_15_listener() {
        return ctx.revokeTarget.set(null);
      });
      \u0275\u0275elementStart(16, "p")(17, "strong");
      \u0275\u0275text(18);
      \u0275\u0275elementEnd();
      \u0275\u0275text(19, " (");
      \u0275\u0275elementStart(20, "code");
      \u0275\u0275text(21);
      \u0275\u0275elementEnd();
      \u0275\u0275text(22, ") will stop working immediately. Any system using it gets 401 errors. This can't be undone.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(23, 8);
      \u0275\u0275elementStart(24, "button", 11);
      \u0275\u0275listener("click", function PartnersPage_Template_button_click_24_listener() {
        return ctx.revokeTarget.set(null);
      });
      \u0275\u0275text(25, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "button", 12);
      \u0275\u0275listener("click", function PartnersPage_Template_button_click_26_listener() {
        return ctx.revoke();
      });
      \u0275\u0275text(27, "Revoke key");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "vc-modal", 13);
      \u0275\u0275twoWayListener("openChange", function PartnersPage_Template_vc_modal_openChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.hookOpen, $event) || (ctx.hookOpen = $event);
        return $event;
      });
      \u0275\u0275listener("closed", function PartnersPage_Template_vc_modal_closed_28_listener() {
        return ctx.newSecret.set(null);
      });
      \u0275\u0275conditionalCreate(29, PartnersPage_Conditional_29_Template, 14, 4, "div", 6)(30, PartnersPage_Conditional_30_Template, 20, 6, "form", 14);
      \u0275\u0275elementContainerStart(31, 8);
      \u0275\u0275conditionalCreate(32, PartnersPage_Conditional_32_Template, 2, 0, "button", 9)(33, PartnersPage_Conditional_33_Template, 4, 1);
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "vc-modal", 15);
      \u0275\u0275twoWayListener("openChange", function PartnersPage_Template_vc_modal_openChange_34_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.delOpen, $event) || (ctx.delOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(35, PartnersPage_Conditional_35_Template, 1, 1, "vc-loading", 16)(36, PartnersPage_Conditional_36_Template, 1, 1, "vc-error", 17)(37, PartnersPage_Conditional_37_Template, 1, 0, "vc-empty", 18)(38, PartnersPage_Conditional_38_Template, 15, 0, "div", 19);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_5_0;
      let tmp_13_0;
      \u0275\u0275advance(4);
      \u0275\u0275property("tabs", ctx.tabs());
      \u0275\u0275twoWayProperty("active", ctx.tab);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.tab()) === "keys" ? 5 : tmp_2_0 === "webhooks" ? 6 : tmp_2_0 === "events" ? 7 : tmp_2_0 === "reference" ? 8 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.keyOpen);
      \u0275\u0275property("title", ctx.newKey() ? "Copy your new key" : "Create an API key");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_5_0 = ctx.newKey()) ? 10 : 11, tmp_5_0);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.newKey() ? 13 : 14);
      \u0275\u0275advance(2);
      \u0275\u0275property("open", !!ctx.revokeTarget());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.revokeTarget()?.name);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("vcp_", ctx.revokeTarget()?.prefix);
      \u0275\u0275advance(5);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.hookOpen);
      \u0275\u0275property("title", ctx.newSecret() ? "Webhook added" : "Add a webhook");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_13_0 = ctx.newSecret()) ? 29 : 30, tmp_13_0);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.newSecret() ? 32 : 33);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.delOpen);
      \u0275\u0275property("drawer", true)("subtitle", ctx.delHook()?.url ?? "");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.deliveries.loading() ? 35 : ctx.deliveries.error() ? 36 : !ctx.deliveries.data()?.length ? 37 : 38);
    }
  }, dependencies: [Icon, Badge, PageHeader, Empty, Loading, ErrorBox, Callout, Modal, Tabs, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, RouterLink, DayPipe, AgoPipe, JsonPipe], styles: ["\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n}\n.bar[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 640px;\n}\n.kp[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n  background: var(--%NS%sand-100);\n  padding: 2px 6px;\n  border-radius: 4px;\n}\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.scope[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  border: 1px solid var(--%NS%forest-100);\n  white-space: nowrap;\n}\ntr.dim[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.dim[_ngcontent-%COMP%] {\n  opacity: 0.7;\n}\n.danger-t[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.hooks[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.hook[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.hh[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n}\n.hi[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-600);\n  flex: none;\n}\n.hm[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.url[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%stone-900);\n  overflow-wrap: anywhere;\n}\n.he[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  padding-top: 12px;\n  border-top: 1px solid var(--%NS%stone-100);\n}\n.ev[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  padding: 3px 7px;\n  border-radius: 4px;\n  background: var(--%NS%sky-100);\n  color: var(--%NS%sky-600);\n}\n.toggle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  flex: none;\n}\n.toggle[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: none;\n}\n.tr[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 20px;\n  border-radius: 10px;\n  background: var(--%NS%stone-300);\n  position: relative;\n  transition: background 0.15s;\n}\n.th[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: var(--%NS%shadow-sm);\n  transition: left 0.15s;\n}\n.toggle[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    + .tr[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n}\n.toggle[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    + .tr[_ngcontent-%COMP%]   .th[_ngcontent-%COMP%] {\n  left: 16px;\n}\n.evf[_ngcontent-%COMP%] {\n  width: 220px;\n}\n.evc[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%sky-600);\n}\n.payload[_ngcontent-%COMP%] {\n  display: block;\n  max-width: 440px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 11.5px;\n  color: var(--%NS%stone-600);\n}\n.ref[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  align-items: start;\n}\n.ref[_ngcontent-%COMP%]    > section[_ngcontent-%COMP%]:first-child {\n  grid-column: 1/-1;\n}\n@media (max-width: 1000px) {\n  .ref[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.m[_ngcontent-%COMP%] {\n  font: 600 11px var(--%NS%mono);\n  padding: 3px 7px;\n  border-radius: 4px;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n}\n.m.post[_ngcontent-%COMP%] {\n  background: var(--%NS%sky-100);\n  color: var(--%NS%sky-600);\n}\n.code[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 16px 20px;\n  background: var(--%NS%forest-950);\n  color: #dfe9e2;\n  font: 12.5px/1.6 var(--%NS%mono);\n  overflow-x: auto;\n  white-space: pre;\n  border-radius: 0 0 var(--%NS%radius) var(--%NS%radius);\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.secret[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: 8px;\n  background: var(--%NS%forest-950);\n}\n.secret[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  flex: 1;\n  color: #e3eee6;\n  font-size: 12.5px;\n  overflow-wrap: anywhere;\n}\n.scopt[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.scopt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n  width: 16px;\n  height: 16px;\n  margin-top: 2px;\n}\n.scopt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.scopt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 500;\n  font-size: 13.5px;\n}\n.scopt[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.scopt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-300);\n  background: var(--%NS%forest-50);\n}\n.evgrid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n.evopt[_ngcontent-%COMP%] {\n  align-items: flex-start;\n}\n.evopt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.evopt[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.evopt[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.err[_ngcontent-%COMP%] {\n  max-width: 320px;\n  margin-top: 3px;\n}\n/*# sourceMappingURL=partners.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PartnersPage, [{
    type: Component,
    args: [{ selector: "vc-partners-page", imports: [...KIT, FormsModule, RouterLink, DayPipe, AgoPipe, JsonPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Partners & API" eyebrow="Administration"
      subtitle="Let partner systems read approved results and send practice records, and push events to them as they happen.">
      <a actions class="btn btn-secondary" routerLink="assistant"><vc-icon name="message" />Results assistant</a>
    </vc-page-header>

    <vc-tabs [tabs]="tabs()" [(active)]="tab" />

    @switch (tab()) {
      <!-- ============================================================== keys -->
      @case ('keys') {
        <div class="bar">
          <p class="muted small">Keys are shown once when created. Only a fingerprint is stored, so a lost key can't be recovered \u2014 revoke it and create a new one.</p>
          <span class="spacer"></span>
          <button class="btn btn-primary" (click)="openKey()"><vc-icon name="key" />Create API key</button>
        </div>
        <section class="card">
          @if (keys.loading() && !keys.data()) { <vc-loading [rows]="4" /> }
          @else if (keys.error()) { <div class="card-body"><vc-error title="Couldn't load API keys" [message]="keys.error()!.message" /></div> }
          @else if (!keys.data()?.length) {
            <vc-empty icon="key" title="No API keys yet" text="Create a key for each partner system, with only the scopes it needs.">
              <button class="btn btn-primary" (click)="openKey()"><vc-icon name="key" />Create API key</button></vc-empty>
          } @else {
            <div class="table-wrap"><table class="table">
              <thead><tr><th>Name</th><th>Key</th><th>Scopes</th><th>Last used</th><th>Created</th><th>Status</th><th></th></tr></thead>
              <tbody>@for (k of keys.data(); track k.id) {
                <tr [class.dim]="!k.is_active">
                  <td><strong>{{ k.name }}</strong></td>
                  <td><code class="kp">vcp_{{ k.prefix }}_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022</code></td>
                  <td><div class="chips">@for (s of k.scopes; track s) { <span class="scope">{{ scopeLabel(s) }}</span> }</div></td>
                  <td class="nowrap">{{ k.last_used_at ? (k.last_used_at | ago) : 'Never' }}</td>
                  <td class="nowrap small">{{ k.created_at | day }}</td>
                  <td><vc-badge [status]="k.is_active ? 'active' : 'inactive'">{{ k.is_active ? 'Active' : 'Revoked' }}</vc-badge></td>
                  <td class="num">@if (k.is_active) { <button class="btn btn-ghost btn-sm danger-t" (click)="revokeTarget.set(k)"><vc-icon name="ban" [size]="14" />Revoke</button> }</td>
                </tr>
              }</tbody>
            </table></div>
          }
        </section>
      }

      <!-- ============================================================== webhooks -->
      @case ('webhooks') {
        <div class="bar">
          <p class="muted small">Each delivery is signed with HMAC-SHA256 in the <code>X-Signature</code> header. Failed deliveries are retried up to 8 times.</p>
          <span class="spacer"></span>
          <button class="btn btn-secondary" [disabled]="dispatching()" (click)="dispatch()"><vc-icon name="send" />{{ dispatching() ? 'Sending\u2026' : 'Dispatch pending events' }}</button>
          <button class="btn btn-primary" (click)="openHook()"><vc-icon name="plus" />Add webhook</button>
        </div>
        @if (hooks.loading() && !hooks.data()) { <div class="card"><vc-loading [rows]="4" /></div> }
        @else if (hooks.error()) { <vc-error title="Couldn't load webhooks" [message]="hooks.error()!.message" /> }
        @else if (!hooks.data()?.length) {
          <div class="card"><vc-empty icon="webhook" title="No webhooks yet" text="Add an https address to receive events such as approved results and completed payouts.">
            <button class="btn btn-primary" (click)="openHook()"><vc-icon name="plus" />Add webhook</button></vc-empty></div>
        } @else {
          <div class="hooks">
            @for (w of hooks.data(); track w.id) {
              <section class="card hook" [class.dim]="!w.is_active">
                <div class="hh">
                  <span class="hi"><vc-icon name="webhook" [size]="16" /></span>
                  <div class="hm"><code class="url">{{ w.url }}</code>@if (w.description) { <span class="small muted">{{ w.description }}</span> }</div>
                  <label class="toggle" [title]="w.is_active ? 'Disable' : 'Enable'">
                    <input type="checkbox" [checked]="w.is_active" (change)="toggleHook(w, $any($event.target).checked)" />
                    <span class="tr"><span class="th"></span></span><span class="small">{{ w.is_active ? 'Enabled' : 'Disabled' }}</span>
                  </label>
                </div>
                <div class="he">
                  @for (e of w.events; track e) { <span class="ev" [title]="eventInfo(e)"><code>{{ e }}</code></span> }
                  <span class="spacer"></span>
                  <span class="small subtle">Added {{ w.created_at | day }}</span>
                  <button class="btn btn-ghost btn-sm" (click)="openDeliveries(w)"><vc-icon name="history" [size]="14" />Deliveries</button>
                </div>
              </section>
            }
          </div>
        }
      }

      <!-- ============================================================== events -->
      @case ('events') {
        <div class="bar">
          <select class="input evf" [ngModel]="eventFilter()" (ngModelChange)="eventFilter.set($event)" aria-label="Event type">
            <option value="">All events</option>
            @for (e of allowedEvents(); track e) { <option [value]="e">{{ e }}</option> }
          </select>
          <span class="small muted">The outbox: every event raised in your organisation, newest first. Webhooks receive the ones they subscribe to.</span>
          <span class="spacer"></span>
          <button class="btn btn-secondary btn-sm" (click)="loadEvents()"><vc-icon name="refresh" [size]="14" />Refresh</button>
        </div>
        <section class="card">
          @if (events.loading() && !events.data()) { <vc-loading [rows]="6" /> }
          @else if (events.error()) { <div class="card-body"><vc-error title="Couldn't load events" [message]="events.error()!.message" /></div> }
          @else if (!events.data()?.length) { <vc-empty icon="activity" title="No events yet" text="Events appear as results are approved, credits issued, sales made and payouts completed." /> }
          @else {
            <div class="table-wrap"><table class="table">
              <thead><tr><th>When</th><th>Event</th><th>Record</th><th>Payload</th></tr></thead>
              <tbody>@for (e of events.data(); track e.id) {
                <tr>
                  <td class="nowrap"><span [title]="e.at | day: true">{{ e.at | ago }}</span></td>
                  <td><code class="evc">{{ e.event }}</code><div class="small subtle">{{ eventInfo(e.event) }}</div></td>
                  <td class="small"><span class="muted">{{ e.entity_type }}</span> <code class="subtle">{{ e.entity_id.slice(0, 8) }}</code></td>
                  <td><code class="payload" [title]="e.payload | json">{{ preview(e.payload) }}</code></td>
                </tr>
              }</tbody>
            </table></div>
          }
        </section>
      }

      <!-- ============================================================== reference -->
      @case ('reference') {
        <div class="grid ref">
          <section class="card">
            <div class="card-head"><h3>Partner API \xB7 v1</h3><span class="small subtle">Base path <code>{{ origin }}/api</code></span></div>
            <div class="table-wrap"><table class="table">
              <thead><tr><th>Method</th><th>Endpoint</th><th>Scope</th><th>What it does</th></tr></thead>
              <tbody>@for (e of endpoints; track e.p) {
                <tr><td><span class="m" [class.post]="e.m === 'POST'">{{ e.m }}</span></td><td><code>{{ e.p }}</code></td><td><span class="scope">{{ scopeLabel(e.scope) }}</span></td><td class="small muted">{{ e.d }}</td></tr>
              }</tbody>
            </table></div>
          </section>
          <section class="card">
            <div class="card-head"><h3>Authenticate with X-API-Key</h3><button class="btn btn-ghost btn-sm" (click)="copy(curl)"><vc-icon name="copy" [size]="14" />Copy</button></div>
            <pre class="code">{{ curl }}</pre>
            <div class="card-foot left"><span class="small muted">Errors use one shape: <code>{{ '{' }}"code", "message", "details"{{ '}' }}</code>. A missing or revoked key answers 401 <code>INVALID_API_KEY</code>; a missing scope answers 403.</span></div>
          </section>
          <section class="card">
            <div class="card-head"><h3>Verify a webhook signature</h3></div>
            <pre class="code">{{ verify }}</pre>
          </section>
        </div>
      }
    }

    <!-- create key -->
    <vc-modal [(open)]="keyOpen" [title]="newKey() ? 'Copy your new key' : 'Create an API key'" width="520px" (closed)="newKey.set(null)">
      @if (newKey(); as nk) {
        <div class="stack" style="--gap:14px">
          <vc-callout tone="warn" icon="alert"><strong>This is the only time the key is shown.</strong> Store it in the partner's secret manager now. If it is lost, revoke it and create a new one.</vc-callout>
          <div class="secret"><code>{{ nk.key }}</code><button class="btn btn-secondary btn-sm" (click)="copy(nk.key)"><vc-icon [name]="copied() ? 'check' : 'copy'" [size]="14" />{{ copied() ? 'Copied' : 'Copy' }}</button></div>
          <dl class="kv"><dt>Name</dt><dd>{{ nk.name }}</dd><dt>Scopes</dt><dd>{{ scopesText(nk.scopes) }}</dd></dl>
        </div>
      } @else {
        <form class="stack" style="--gap:14px" id="keyForm" (ngSubmit)="createKey()">
          <div class="field"><label for="kn">Name</label><input id="kn" class="input" name="kn" [(ngModel)]="keyName" placeholder="e.g. FPO accounting system" /><span class="hint">Who or what will use this key.</span></div>
          <div class="field"><label>Scopes</label>
            @for (s of scopes; track s.key) {
              <label class="scopt" [class.on]="keyScopes[s.key]"><input type="checkbox" [name]="'s_' + s.key" [(ngModel)]="keyScopes[s.key]" /><span><strong>{{ s.label }}</strong><small>{{ s.hint }}</small></span></label>
            }
          </div>
          @if (formError()) { <vc-error title="Key not created" [message]="formError()!" /> }
        </form>
      }
      <ng-container footer>
        @if (newKey()) { <button class="btn btn-primary" (click)="keyOpen.set(false); newKey.set(null)">I've stored the key</button> }
        @else {
          <button class="btn btn-ghost" (click)="keyOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" type="submit" form="keyForm" [disabled]="busy() || keyName.trim().length < 2 || !chosenScopes().length">Create key</button>
        }
      </ng-container>
    </vc-modal>

    <!-- revoke -->
    <vc-modal [open]="!!revokeTarget()" (closed)="revokeTarget.set(null)" title="Revoke this key?" width="440px">
      <p><strong>{{ revokeTarget()?.name }}</strong> (<code>vcp_{{ revokeTarget()?.prefix }}</code>) will stop working immediately. Any system using it gets 401 errors. This can't be undone.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="revokeTarget.set(null)">Cancel</button>
        <button class="btn btn-danger" [disabled]="busy()" (click)="revoke()">Revoke key</button>
      </ng-container>
    </vc-modal>

    <!-- create webhook -->
    <vc-modal [(open)]="hookOpen" [title]="newSecret() ? 'Webhook added' : 'Add a webhook'" width="560px" (closed)="newSecret.set(null)">
      @if (newSecret(); as sec) {
        <div class="stack" style="--gap:14px">
          <vc-callout tone="warn" icon="alert"><strong>Copy the signing secret now \u2014 it is shown only once.</strong> The receiver uses it to check the <code>X-Signature</code> header on every delivery.</vc-callout>
          <div class="secret"><code>{{ sec }}</code><button class="btn btn-secondary btn-sm" (click)="copy(sec)"><vc-icon [name]="copied() ? 'check' : 'copy'" [size]="14" />{{ copied() ? 'Copied' : 'Copy' }}</button></div>
        </div>
      } @else {
        <form class="stack" style="--gap:14px" id="hookForm" (ngSubmit)="createHook()">
          <div class="field"><label for="hu">Address</label>
            <input id="hu" class="input mono" name="hu" [(ngModel)]="hookUrl" placeholder="https://partner.example.org/hooks/varsapradaya" [class.invalid]="hookUrl && !urlOk()" />
            @if (hookUrl && !urlOk()) { <span class="error">Use an https:// address.</span> } @else { <span class="hint">Must use https.</span> }</div>
          <div class="field"><label for="hd">Description <span class="subtle">(optional)</span></label><input id="hd" class="input" name="hd" [(ngModel)]="hookDesc" placeholder="What the partner does with these events" /></div>
          <div class="field"><label>Events</label>
            <div class="evgrid">
              @for (e of allowedEvents(); track e) {
                <label class="checkbox evopt"><input type="checkbox" [name]="'e_' + e" [(ngModel)]="hookEvents[e]" /><span><code>{{ e }}</code><small>{{ eventInfo(e) }}</small></span></label>
              }
            </div>
          </div>
          @if (formError()) { <vc-error title="Webhook not added" [message]="formError()!" /> }
        </form>
      }
      <ng-container footer>
        @if (newSecret()) { <button class="btn btn-primary" (click)="hookOpen.set(false); newSecret.set(null)">I've stored the secret</button> }
        @else {
          <button class="btn btn-ghost" (click)="hookOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" type="submit" form="hookForm" [disabled]="busy() || !urlOk() || !chosenEvents().length">Add webhook</button>
        }
      </ng-container>
    </vc-modal>

    <!-- deliveries -->
    <vc-modal [(open)]="delOpen" [drawer]="true" width="560px" title="Deliveries" [subtitle]="delHook()?.url ?? ''">
      @if (deliveries.loading()) { <vc-loading [rows]="5" /> }
      @else if (deliveries.error()) { <vc-error title="Couldn't load deliveries" [message]="deliveries.error()!.message" /> }
      @else if (!deliveries.data()?.length) { <vc-empty icon="send" title="Nothing delivered yet" text="Use 'Dispatch pending events' to send events raised since this webhook was added." /> }
      @else {
        <div class="table-wrap"><table class="table">
          <thead><tr><th>When</th><th>Result</th><th class="num">Attempt</th><th>Event</th></tr></thead>
          <tbody>@for (d of deliveries.data(); track d.id) {
            <tr><td class="nowrap small">{{ d.at | day: true }}</td>
              <td><vc-badge [status]="d.ok ? 'delivered' : 'failed'">{{ d.ok ? 'HTTP ' + d.status_code : (d.status_code ? 'HTTP ' + d.status_code : 'Failed') }}</vc-badge>
                @if (d.error) { <div class="small muted err">{{ d.error }}</div> }</td>
              <td class="num">{{ d.attempt }}</td><td><code class="subtle small">{{ d.event_id.slice(0, 8) }}</code></td></tr>
          }</tbody>
        </table></div>
      }
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;ad9439997a2285a3;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\partners\\partners.page.ts */\n.bar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 14px;\n  flex-wrap: wrap;\n}\n.bar p {\n  max-width: 640px;\n}\n.kp {\n  font-size: 12.5px;\n  color: var(--stone-700);\n  background: var(--sand-100);\n  padding: 2px 6px;\n  border-radius: 4px;\n}\n.chips {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.scope {\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--forest-50);\n  color: var(--forest-700);\n  border: 1px solid var(--forest-100);\n  white-space: nowrap;\n}\ntr.dim td {\n  color: var(--text-3);\n}\n.dim {\n  opacity: 0.7;\n}\n.danger-t {\n  color: var(--red-600);\n}\n.hooks {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.hook {\n  padding: 16px 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.hh {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n}\n.hi {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  background: var(--forest-50);\n  color: var(--forest-600);\n  flex: none;\n}\n.hm {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.url {\n  font-size: 13px;\n  color: var(--stone-900);\n  overflow-wrap: anywhere;\n}\n.he {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  padding-top: 12px;\n  border-top: 1px solid var(--stone-100);\n}\n.ev code {\n  font-size: 11.5px;\n  padding: 3px 7px;\n  border-radius: 4px;\n  background: var(--sky-100);\n  color: var(--sky-600);\n}\n.toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  flex: none;\n}\n.toggle input {\n  display: none;\n}\n.tr {\n  width: 34px;\n  height: 20px;\n  border-radius: 10px;\n  background: var(--stone-300);\n  position: relative;\n  transition: background 0.15s;\n}\n.th {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: var(--shadow-sm);\n  transition: left 0.15s;\n}\n.toggle input:checked + .tr {\n  background: var(--forest-500);\n}\n.toggle input:checked + .tr .th {\n  left: 16px;\n}\n.evf {\n  width: 220px;\n}\n.evc {\n  font-size: 12px;\n  color: var(--sky-600);\n}\n.payload {\n  display: block;\n  max-width: 440px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 11.5px;\n  color: var(--stone-600);\n}\n.ref {\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  align-items: start;\n}\n.ref > section:first-child {\n  grid-column: 1/-1;\n}\n@media (max-width: 1000px) {\n  .ref {\n    grid-template-columns: 1fr;\n  }\n}\n.m {\n  font: 600 11px var(--mono);\n  padding: 3px 7px;\n  border-radius: 4px;\n  background: var(--forest-100);\n  color: var(--forest-700);\n}\n.m.post {\n  background: var(--sky-100);\n  color: var(--sky-600);\n}\n.code {\n  margin: 0;\n  padding: 16px 20px;\n  background: var(--forest-950);\n  color: #dfe9e2;\n  font: 12.5px/1.6 var(--mono);\n  overflow-x: auto;\n  white-space: pre;\n  border-radius: 0 0 var(--radius) var(--radius);\n}\n.card-foot.left {\n  justify-content: flex-start;\n}\n.secret {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: 8px;\n  background: var(--forest-950);\n}\n.secret code {\n  flex: 1;\n  color: #e3eee6;\n  font-size: 12.5px;\n  overflow-wrap: anywhere;\n}\n.scopt {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.scopt input {\n  accent-color: var(--primary);\n  width: 16px;\n  height: 16px;\n  margin-top: 2px;\n}\n.scopt span {\n  display: flex;\n  flex-direction: column;\n}\n.scopt strong {\n  font-weight: 500;\n  font-size: 13.5px;\n}\n.scopt small {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.scopt.on {\n  border-color: var(--forest-300);\n  background: var(--forest-50);\n}\n.evgrid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n.evopt {\n  align-items: flex-start;\n}\n.evopt span {\n  display: flex;\n  flex-direction: column;\n}\n.evopt code {\n  font-size: 12px;\n}\n.evopt small {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.err {\n  max-width: 320px;\n  margin-top: 3px;\n}\n/*# sourceMappingURL=partners.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PartnersPage, { className: "PartnersPage", filePath: "src/app/features/partners/partners.page.ts", lineNumber: 301 });
})();

// src/app/features/partners/partners.routes.ts
var partners_routes_default = [
  { path: "", component: PartnersPage, canActivate: [permissionGuard("partners.manage")], title: "Partners & API \xB7 Varsapradaya Carbon" },
  { path: "assistant", component: AssistantPage, canActivate: [permissionGuard("data.read", "verify.read")], title: "Results assistant \xB7 Varsapradaya Carbon" }
];
export {
  partners_routes_default as default
};
//# debugId=ca32d510-9f40-52df-a495-61b2a02bdb19
//# sourceMappingURL=chunk-FTWH4NFU.js.map
