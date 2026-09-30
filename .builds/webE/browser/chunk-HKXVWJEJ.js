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
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe
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
  Loading,
  Modal,
  PageHeader,
  Progress
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
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
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
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
  ɵɵsanitizeUrl,
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

// src/app/features/methodology/create-pack.ts
var _forTrack0 = ($index, $item) => $item.id;
function CreatePack_For_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r1 = ctx.$implicit;
    \u0275\u0275property("value", p_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Copy ", p_r1.label, " (", p_r1.status, ")");
  }
}
function CreatePack_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1, "All values and their sources are copied. You'll count as an editor, so a colleague must approve the new revision.");
    \u0275\u0275elementEnd();
  }
}
function CreatePack_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
var CreatePack = class _CreatePack {
  api = inject(ApiService);
  ctx = inject(ProjectContext);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  packs = input(
    [],
    ...ngDevMode ? [{ debugName: "packs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Pre-fill as a new revision of this pack. */
  from = input(
    null,
    ...ngDevMode ? [{ debugName: "from" }] : (
      /* istanbul ignore next */
      []
    )
  );
  created = output();
  code = signal(
    "",
    ...ngDevMode ? [{ debugName: "code" }] : (
      /* istanbul ignore next */
      []
    )
  );
  version = signal(
    "",
    ...ngDevMode ? [{ debugName: "version" }] : (
      /* istanbul ignore next */
      []
    )
  );
  title = signal(
    "",
    ...ngDevMode ? [{ debugName: "title" }] : (
      /* istanbul ignore next */
      []
    )
  );
  url = signal(
    "",
    ...ngDevMode ? [{ debugName: "url" }] : (
      /* istanbul ignore next */
      []
    )
  );
  basedOn = signal(
    "",
    ...ngDevMode ? [{ debugName: "basedOn" }] : (
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
  basedOnLabel = computed(
    () => this.packs().find((p) => p.id === this.basedOn())?.label ?? "",
    ...ngDevMode ? [{ debugName: "basedOnLabel" }] : (
      /* istanbul ignore next */
      []
    )
  );
  valid = computed(
    () => this.code().trim().length >= 2 && this.version().trim().length >= 1 && this.title().trim().length >= 3,
    ...ngDevMode ? [{ debugName: "valid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (!this.open())
        return;
      const f = this.from();
      const proj = this.ctx.current();
      this.error.set(null);
      if (f) {
        this.code.set(f.methodology_code);
        this.version.set(f.methodology_version);
        this.title.set(f.title);
        this.url.set(f.source_url ?? "");
        this.basedOn.set(f.id);
      } else {
        this.code.set(proj?.methodology_code ?? "");
        this.version.set(proj?.methodology_version ?? "");
        this.title.set("");
        this.url.set("");
        this.basedOn.set("");
      }
    });
  }
  save() {
    this.saving.set(true);
    this.error.set(null);
    this.api.post("/rule-packs", {
      methodology_code: this.code().trim(),
      methodology_version: this.version().trim(),
      title: this.title().trim(),
      source_url: this.url().trim() || null,
      based_on_id: this.basedOn() || null
    }).subscribe({
      next: (p) => {
        this.saving.set(false);
        this.open.set(false);
        this.created.emit(p);
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(e.message);
      }
    });
  }
  static \u0275fac = function CreatePack_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CreatePack)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CreatePack, selectors: [["vc-create-pack"]], inputs: { open: [1, "open"], packs: [1, "packs"], from: [1, "from"] }, outputs: { open: "openChange", created: "created" }, decls: 36, vars: 11, consts: [["width", "600px", "subtitle", "A rule pack holds every methodology value the platform uses \u2014 each with its source. It starts as a draft.", 3, "openChange", "open", "title"], [1, "form-grid"], [1, "field"], ["for", "m-code"], ["id", "m-code", "placeholder", "e.g. VM0042", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["for", "m-ver"], ["id", "m-ver", "placeholder", "e.g. 2.2", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], ["for", "m-title"], ["id", "m-title", "placeholder", "e.g. VM0042 v2.2 rules for Karnataka coffee & millet project", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "m-url"], ["id", "m-url", "placeholder", "https://verra.org/methodologies/\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], ["for", "m-base"], ["id", "m-base", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["tone", "danger", "icon", "alert", 1, "mt"], ["footer", "", 1, "ft"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "plus"]], template: function CreatePack_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function CreatePack_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "label", 3);
      \u0275\u0275text(4, "Methodology code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "input", 4);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CreatePack_Template_input_ngModelChange_5_listener($event) {
        return ctx.code.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 2)(7, "label", 5);
      \u0275\u0275text(8, "Methodology version");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "input", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CreatePack_Template_input_ngModelChange_9_listener($event) {
        return ctx.version.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 7)(11, "label", 8);
      \u0275\u0275text(12, "Title");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "input", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CreatePack_Template_input_ngModelChange_13_listener($event) {
        return ctx.title.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 7)(15, "label", 10);
      \u0275\u0275text(16, "Published methodology (URL)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 11);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CreatePack_Template_input_ngModelChange_17_listener($event) {
        return ctx.url.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "span", 12);
      \u0275\u0275text(19, "Link to the official document the values are taken from.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 7)(21, "label", 13);
      \u0275\u0275text(22, "Start from");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "select", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CreatePack_Template_select_ngModelChange_23_listener($event) {
        return ctx.basedOn.set($event);
      });
      \u0275\u0275elementStart(24, "option", 15);
      \u0275\u0275text(25, "An empty pack \u2014 enter every value");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(26, CreatePack_For_27_Template, 2, 3, "option", 16, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(28, CreatePack_Conditional_28_Template, 2, 0, "span", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(29, CreatePack_Conditional_29_Template, 2, 1, "vc-callout", 17);
      \u0275\u0275elementStart(30, "div", 18)(31, "button", 19);
      \u0275\u0275listener("click", function CreatePack_Template_button_click_31_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(32, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "button", 20);
      \u0275\u0275listener("click", function CreatePack_Template_button_click_33_listener() {
        return ctx.save();
      });
      \u0275\u0275element(34, "vc-icon", 21);
      \u0275\u0275text(35);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275property("title", ctx.basedOn() ? "New revision of " + ctx.basedOnLabel() : "New rule pack");
      \u0275\u0275advance(5);
      \u0275\u0275property("ngModel", ctx.code());
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.version());
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.title());
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.url());
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.basedOn());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.packs());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.basedOn() ? 28 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 29 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.valid() || ctx.saving());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.saving() ? "Creating\u2026" : "Create draft");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, Modal, Callout, Icon], styles: ["\n.mt[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=create-pack.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreatePack, [{
    type: Component,
    args: [{ selector: "vc-create-pack", imports: [FormsModule, Modal, Callout, Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" [title]="basedOn() ? 'New revision of ' + basedOnLabel() : 'New rule pack'" width="600px"
      subtitle="A rule pack holds every methodology value the platform uses \u2014 each with its source. It starts as a draft.">
      <div class="form-grid">
        <div class="field">
          <label for="m-code">Methodology code</label>
          <input id="m-code" class="input mono" [ngModel]="code()" (ngModelChange)="code.set($event)" placeholder="e.g. VM0042" />
        </div>
        <div class="field">
          <label for="m-ver">Methodology version</label>
          <input id="m-ver" class="input mono" [ngModel]="version()" (ngModelChange)="version.set($event)" placeholder="e.g. 2.2" />
        </div>
        <div class="field span-2">
          <label for="m-title">Title</label>
          <input id="m-title" class="input" [ngModel]="title()" (ngModelChange)="title.set($event)" placeholder="e.g. VM0042 v2.2 rules for Karnataka coffee & millet project" />
        </div>
        <div class="field span-2">
          <label for="m-url">Published methodology (URL)</label>
          <input id="m-url" class="input" [ngModel]="url()" (ngModelChange)="url.set($event)" placeholder="https://verra.org/methodologies/\u2026" />
          <span class="hint">Link to the official document the values are taken from.</span>
        </div>
        <div class="field span-2">
          <label for="m-base">Start from</label>
          <select id="m-base" class="input" [ngModel]="basedOn()" (ngModelChange)="basedOn.set($event)">
            <option value="">An empty pack \u2014 enter every value</option>
            @for (p of packs(); track p.id) { <option [value]="p.id">Copy {{ p.label }} ({{ p.status }})</option> }
          </select>
          @if (basedOn()) { <span class="hint">All values and their sources are copied. You'll count as an editor, so a colleague must approve the new revision.</span> }
        </div>
      </div>
      @if (error()) { <vc-callout tone="danger" icon="alert" class="mt">{{ error() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!valid() || saving()" (click)="save()"><vc-icon name="plus" />{{ saving() ? 'Creating\u2026' : 'Create draft' }}</button>
      </div>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;e54e3308321498e1;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\methodology\\create-pack.ts */\n.mt {\n  margin-top: 14px;\n}\n.ft {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=create-pack.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], packs: [{ type: Input, args: [{ isSignal: true, alias: "packs", required: false }] }], from: [{ type: Input, args: [{ isSignal: true, alias: "from", required: false }] }], created: [{ type: Output, args: ["created"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CreatePack, { className: "CreatePack", filePath: "src/app/features/methodology/create-pack.ts", lineNumber: 53 });
})();

// src/app/features/methodology/methodology-data.ts
function humanValue(v) {
  const s = v.split("_").map((w) => /\d/.test(w) ? w.toUpperCase() : w).join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function formatRuleValue(value, kind, unit = "") {
  if (value === null || value === void 0) return "";
  if (kind === "boolean") return value ? "Yes" : "No";
  if (kind === "choice") return humanValue(String(value));
  if (kind === "factors" && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).map(([k, v]) => `${k} = ${v}`).join(", ");
  }
  if (kind === "list") return Array.isArray(value) ? value.map((v) => humanValue(String(v))).join(", ") : String(value);
  if (kind === "number" || kind === "integer") {
    const n = Number(value);
    const s = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 }).format(n);
    return unit ? `${s} ${unit}` : s;
  }
  return String(value);
}
function isDemo(p) {
  if (!p) return false;
  return (p.rules ?? []).some((r) => /demo/i.test(r.source_document ?? ""));
}
function factorEntries(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? Object.entries(v).map(([key, value]) => ({ key, value })) : [];
}

// src/app/features/methodology/rule-editor.ts
function RuleEditor_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1, "Required for approval");
    \u0275\u0275elementEnd();
  }
}
function RuleEditor_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Required when ", ctx_r2.labelOf(d_r2.required_if.key), " is ", ctx_r2.fmtEq(d_r2.required_if.equals));
  }
}
function RuleEditor_Conditional_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1, "Optional");
    \u0275\u0275elementEnd();
  }
}
function RuleEditor_Conditional_1_Case_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "button", 34);
    \u0275\u0275listener("click", function RuleEditor_Conditional_1_Case_12_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.value.set(true));
    });
    \u0275\u0275text(2, "Yes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 34);
    \u0275\u0275listener("click", function RuleEditor_Conditional_1_Case_12_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.value.set(false));
    });
    \u0275\u0275text(4, "No");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("on", ctx_r2.value() === true);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r2.value() === false);
  }
}
function RuleEditor_Conditional_1_Case_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 36)(1, "input", 37);
    \u0275\u0275listener("change", function RuleEditor_Conditional_1_Case_13_For_2_Template_input_change_1_listener() {
      const c_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.value.set(c_r6));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "span", 38);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "code");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("on", ctx_r2.value() === c_r6);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r2.value() === c_r6);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.human(c_r6));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r6);
  }
}
function RuleEditor_Conditional_1_Case_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275repeaterCreate(1, RuleEditor_Conditional_1_Case_13_For_2_Template, 7, 5, "label", 35, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(d_r2.choices);
  }
}
function RuleEditor_Conditional_1_Case_14_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 42);
    \u0275\u0275listener("click", function RuleEditor_Conditional_1_Case_14_For_2_Template_button_click_2_listener() {
      const c_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.removeItem(c_r9));
    });
    \u0275\u0275element(3, "vc-icon", 43);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r9);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 11);
  }
}
function RuleEditor_Conditional_1_Case_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275repeaterCreate(1, RuleEditor_Conditional_1_Case_14_For_2_Template, 4, 2, "span", 40, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(3, "input", 41);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Case_14_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.draft.set($event));
    })("keydown.enter", function RuleEditor_Conditional_1_Case_14_Template_input_keydown_enter_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.addItem($event));
    })("blur", function RuleEditor_Conditional_1_Case_14_Template_input_blur_3_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.addItem());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 20);
    \u0275\u0275text(5, "Use the codes the platform records, e.g. ");
    \u0275\u0275elementStart(6, "code");
    \u0275\u0275text(7, "dry_combustion");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, ", ");
    \u0275\u0275elementStart(9, "code");
    \u0275\u0275text(10, "forest");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, ".");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.listValue());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r2.draft());
    \u0275\u0275control();
  }
}
function RuleEditor_Conditional_1_Case_15_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 46)(1, "input", 49);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Case_15_For_8_Template_input_ngModelChange_1_listener($event) {
      const \u0275$index_93_r12 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.setFactor(\u0275$index_93_r12, { key: $event }));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "input", 50);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Case_15_For_8_Template_input_ngModelChange_2_listener($event) {
      const \u0275$index_93_r12 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.setFactor(\u0275$index_93_r12, { value: $event === "" || $event === null ? null : +$event }));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 51);
    \u0275\u0275listener("click", function RuleEditor_Conditional_1_Case_15_For_8_Template_button_click_3_listener() {
      const \u0275$index_93_r12 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.removeFactor(\u0275$index_93_r12));
    });
    \u0275\u0275element(4, "vc-icon", 52);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r13 = ctx.$implicit;
    const \u0275$index_93_r12 = ctx.$index;
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", r_r13.key);
    \u0275\u0275attribute("aria-label", "Factor key " + (\u0275$index_93_r12 + 1));
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", r_r13.value);
    \u0275\u0275attribute("aria-label", "Factor value " + (\u0275$index_93_r12 + 1));
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
  }
}
function RuleEditor_Conditional_1_Case_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 44)(1, "div", 45)(2, "span");
    \u0275\u0275text(3, "Factor key");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Value (tCO\u2082e per unit)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, RuleEditor_Conditional_1_Case_15_For_8_Template, 5, 5, "div", 46, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementStart(9, "button", 47);
    \u0275\u0275listener("click", function RuleEditor_Conditional_1_Case_15_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.addFactor());
    });
    \u0275\u0275element(10, "vc-icon", 48);
    \u0275\u0275text(11, "Add factor");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "span", 20);
    \u0275\u0275text(13, "Use the factor keys that practice types reference (the catalogue's emission factor keys). Each value must be a positive number.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r2.factorRows());
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 14);
  }
}
function RuleEditor_Conditional_1_Case_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "textarea", 53);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Case_16_Template_textarea_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.value.set($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngModel", ctx_r2.value() ?? "");
    \u0275\u0275control();
  }
}
function RuleEditor_Conditional_1_Case_17_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r2.unit);
  }
}
function RuleEditor_Conditional_1_Case_17_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate3(" \xB7 allowed range ", d_r2.min ?? "\u2014", " to ", d_r2.max ?? "\u2014", "", d_r2.unit ? " " + d_r2.unit : "", " ");
  }
}
function RuleEditor_Conditional_1_Case_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 54)(1, "input", 55);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Case_17_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.value.set($event === "" || $event === null ? null : +$event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, RuleEditor_Conditional_1_Case_17_Conditional_2_Template, 2, 1, "span", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 20);
    \u0275\u0275text(4);
    \u0275\u0275conditionalCreate(5, RuleEditor_Conditional_1_Case_17_Conditional_5_Template, 1, 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r2.value());
    \u0275\u0275attribute("min", d_r2.min)("max", d_r2.max)("step", d_r2.kind === "integer" ? 1 : "any");
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r2.unit ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", d_r2.kind === "integer" ? "Whole number" : "Number");
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r2.min !== null || d_r2.max !== null ? 5 : -1);
  }
}
function RuleEditor_Conditional_1_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.valueError());
  }
}
function RuleEditor_Conditional_1_Conditional_45_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const r_r16 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(", last changed by ", r_r16.last_modified_by);
  }
}
function RuleEditor_Conditional_1_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "vc-icon", 57);
    \u0275\u0275text(2, " Currently ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275conditionalCreate(6, RuleEditor_Conditional_1_Conditional_45_Conditional_6_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r16 = ctx;
    const d_r2 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.fmt(r_r16.value, d_r2.kind, d_r2.unit));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 entered by ", r_r16.entered_by ?? "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r16.last_modified_by && r_r16.last_modified_by !== r_r16.entered_by ? 6 : -1);
  }
}
function RuleEditor_Conditional_1_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.error());
  }
}
function RuleEditor_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 7)(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 8);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, RuleEditor_Conditional_1_Conditional_6_Template, 2, 0, "span", 9)(7, RuleEditor_Conditional_1_Conditional_7_Template, 2, 2, "span", 10)(8, RuleEditor_Conditional_1_Conditional_8_Template, 2, 0, "span", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "section", 12)(10, "div", 13);
    \u0275\u0275text(11, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, RuleEditor_Conditional_1_Case_12_Template, 5, 4, "div", 14)(13, RuleEditor_Conditional_1_Case_13_Template, 3, 0, "div", 15)(14, RuleEditor_Conditional_1_Case_14_Template, 12, 1)(15, RuleEditor_Conditional_1_Case_15_Template, 14, 1)(16, RuleEditor_Conditional_1_Case_16_Template, 1, 1, "textarea", 16)(17, RuleEditor_Conditional_1_Case_17_Template, 6, 7);
    \u0275\u0275conditionalCreate(18, RuleEditor_Conditional_1_Conditional_18_Template, 2, 1, "span", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "section", 18)(20, "div", 13);
    \u0275\u0275text(21, "Source ");
    \u0275\u0275elementStart(22, "span", 19);
    \u0275\u0275text(23, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "p", 20);
    \u0275\u0275text(25, "Where in the published methodology this value comes from. Verifiers check it.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 21)(27, "label", 22);
    \u0275\u0275text(28, "Document");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "input", 23);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Template_input_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.doc.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 24)(31, "div", 21)(32, "label", 25);
    \u0275\u0275text(33, "Section");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "input", 26);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Template_input_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.section.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 21)(36, "label", 27);
    \u0275\u0275text(37, "Page");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "input", 28);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Template_input_ngModelChange_38_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.page.set($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(39, "div", 21)(40, "label", 29);
    \u0275\u0275text(41, "Notes ");
    \u0275\u0275elementStart(42, "span", 30);
    \u0275\u0275text(43, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "textarea", 31);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function RuleEditor_Conditional_1_Template_textarea_ngModelChange_44_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.notes.set($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(45, RuleEditor_Conditional_1_Conditional_45_Template, 7, 4, "div", 32);
    \u0275\u0275conditionalCreate(46, RuleEditor_Conditional_1_Conditional_46_Template, 2, 1, "vc-callout", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_15_0;
    const d_r2 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(d_r2.key);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.kindLabel(d_r2.kind));
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r2.required ? 6 : d_r2.required_if ? 7 : 8);
    \u0275\u0275advance(6);
    \u0275\u0275conditional((tmp_5_0 = d_r2.kind) === "boolean" ? 12 : tmp_5_0 === "choice" ? 13 : tmp_5_0 === "list" ? 14 : tmp_5_0 === "factors" ? 15 : tmp_5_0 === "text" ? 16 : 17);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r2.valueError() ? 18 : -1);
    \u0275\u0275advance(11);
    \u0275\u0275property("ngModel", ctx_r2.doc());
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r2.section());
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r2.page());
    \u0275\u0275control();
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r2.notes());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_15_0 = ctx_r2.rule()) ? 45 : -1, tmp_15_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.error() ? 46 : -1);
  }
}
function RuleEditor_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function RuleEditor_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.clear());
    });
    \u0275\u0275element(1, "vc-icon", 59);
    \u0275\u0275text(2, "Remove value");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.saving());
  }
}
var RuleEditor = class _RuleEditor {
  api = inject(ApiService);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  packId = input(
    "",
    ...ngDevMode ? [{ debugName: "packId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  def = input(
    null,
    ...ngDevMode ? [{ debugName: "def" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rule = input(
    null,
    ...ngDevMode ? [{ debugName: "rule" }] : (
      /* istanbul ignore next */
      []
    )
  );
  allDefs = input(
    [],
    ...ngDevMode ? [{ debugName: "allDefs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Suggest the source document used by other rules in the pack. */
  defaultDoc = input(
    "",
    ...ngDevMode ? [{ debugName: "defaultDoc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saved = output();
  value = signal(
    null,
    ...ngDevMode ? [{ debugName: "value" }] : (
      /* istanbul ignore next */
      []
    )
  );
  doc = signal(
    "",
    ...ngDevMode ? [{ debugName: "doc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  section = signal(
    "",
    ...ngDevMode ? [{ debugName: "section" }] : (
      /* istanbul ignore next */
      []
    )
  );
  page = signal(
    "",
    ...ngDevMode ? [{ debugName: "page" }] : (
      /* istanbul ignore next */
      []
    )
  );
  notes = signal(
    "",
    ...ngDevMode ? [{ debugName: "notes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  draft = signal(
    "",
    ...ngDevMode ? [{ debugName: "draft" }] : (
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
  factorRows = signal(
    [],
    ...ngDevMode ? [{ debugName: "factorRows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  listValue = computed(
    () => Array.isArray(this.value()) ? this.value() : [],
    ...ngDevMode ? [{ debugName: "listValue" }] : (
      /* istanbul ignore next */
      []
    )
  );
  valueError = computed(
    () => {
      const d = this.def();
      const v = this.value();
      if (!d || v === null || v === void 0 || v === "")
        return null;
      if (d.kind === "number" || d.kind === "integer") {
        const n = Number(v);
        if (!Number.isFinite(n))
          return "Enter a number.";
        if (d.kind === "integer" && !Number.isInteger(n))
          return "Enter a whole number.";
        if (d.min !== null && n < d.min)
          return `Must be at least ${d.min}.`;
        if (d.max !== null && n > d.max)
          return `Must be at most ${d.max}.`;
      }
      if (d.kind === "text" && String(v).trim().length < 3)
        return "Enter at least 3 characters.";
      if (d.kind === "factors") {
        const rows = this.factorRows();
        const keys = rows.map((r) => r.key.trim());
        if (rows.some((r) => !r.key.trim()))
          return "Every factor needs a key.";
        if (new Set(keys).size !== keys.length)
          return "Each factor key can appear only once.";
        const bad = rows.find((r) => r.value === null || !(Number(r.value) > 0));
        if (bad)
          return `Factor \u201C${bad.key}\u201D must be a positive number.`;
      }
      return null;
    },
    ...ngDevMode ? [{ debugName: "valueError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  problem = computed(
    () => {
      const v = this.value();
      if (v === null || v === void 0 || v === "" || Array.isArray(v) && !v.length)
        return "Enter a value";
      if (this.valueError())
        return this.valueError();
      if (this.doc().trim().length < 3)
        return "Enter the source document";
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
      const r = this.rule();
      const d = this.def();
      untracked(() => this.reset(r, d));
    });
  }
  reset(r, d) {
    {
      this.error.set(null);
      this.draft.set("");
      this.value.set(r ? Array.isArray(r.value) ? [...r.value] : r.value : null);
      if (d?.kind === "factors") {
        const fv = r && r.value && typeof r.value === "object" && !Array.isArray(r.value) ? r.value : null;
        this.factorRows.set(fv ? Object.entries(fv).map(([key, value]) => ({ key, value })) : [{ key: "", value: null }]);
        this.syncFactors();
      }
      this.doc.set(r?.source_document ?? this.defaultDoc());
      this.section.set(r?.source_section ?? "");
      this.page.set(r?.source_page ?? "");
      this.notes.set(r?.notes ?? "");
    }
  }
  human = humanValue;
  fmt = formatRuleValue;
  kindLabel(k) {
    return { number: "Number", integer: "Whole number", factors: "Factor table", boolean: "Yes / No", choice: "One of a list", list: "List of values", text: "Text" }[k] ?? k;
  }
  labelOf(key) {
    return this.allDefs().find((d) => d.key === key)?.label ?? key;
  }
  fmtEq(v) {
    return typeof v === "string" ? humanValue(v) : v === true ? "Yes" : v === false ? "No" : String(v);
  }
  addItem(ev) {
    ev?.preventDefault();
    const v = this.draft().trim();
    if (!v)
      return;
    if (!this.listValue().includes(v))
      this.value.set([...this.listValue(), v]);
    this.draft.set("");
  }
  addFactor() {
    this.factorRows.update((r) => [...r, { key: "", value: null }]);
    this.syncFactors();
  }
  removeFactor(i) {
    this.factorRows.update((r) => r.filter((_, k) => k !== i));
    this.syncFactors();
  }
  setFactor(i, p) {
    this.factorRows.update((r) => r.map((x, k) => k === i ? __spreadValues(__spreadValues({}, x), p) : x));
    this.syncFactors();
  }
  /** Mirror the rows into the value object sent to the API. */
  syncFactors() {
    const rows = this.factorRows();
    this.value.set(rows.length ? Object.fromEntries(rows.map((r) => [r.key.trim(), r.value])) : null);
  }
  removeItem(c) {
    this.value.set(this.listValue().filter((x) => x !== c));
  }
  save() {
    const d = this.def();
    let v = this.value();
    if (d.kind === "number" || d.kind === "integer")
      v = Number(v);
    if (d.kind === "text")
      v = String(v).trim();
    this.saving.set(true);
    this.error.set(null);
    this.api.put(`/rule-packs/${this.packId()}/rules/${d.key}`, {
      value: v,
      source_document: this.doc().trim(),
      source_section: this.section().trim() || null,
      source_page: this.page().trim() || null,
      notes: this.notes().trim() || null
    }).subscribe({
      next: (p) => {
        this.saving.set(false);
        this.open.set(false);
        this.saved.emit(p);
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(e.message);
      }
    });
  }
  clear() {
    const d = this.def();
    this.saving.set(true);
    this.api.delete(`/rule-packs/${this.packId()}/rules/${d.key}`).subscribe({
      next: (p) => {
        this.saving.set(false);
        this.open.set(false);
        this.saved.emit(p);
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(e.message);
      }
    });
  }
  static \u0275fac = function RuleEditor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RuleEditor)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RuleEditor, selectors: [["vc-rule-editor"]], inputs: { open: [1, "open"], packId: [1, "packId"], def: [1, "def"], rule: [1, "rule"], allDefs: [1, "allDefs"], defaultDoc: [1, "defaultDoc"] }, outputs: { open: "openChange", saved: "saved" }, decls: 9, vars: 9, consts: [["width", "520px", 3, "openChange", "open", "drawer", "title", "subtitle"], [1, "stack"], ["footer", "", 1, "ft"], [1, "btn", "btn-ghost", "danger", 3, "disabled"], [1, "grow"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled", "title"], [1, "meta"], [1, "kind"], [1, "req-tag"], [1, "req-tag", "soft"], [1, "opt-tag"], [1, "val"], [1, "label"], [1, "seg"], [1, "choices"], ["rows", "4", "placeholder", "Quote or summarise the methodology text", 1, "input", 3, "ngModel"], [1, "err", "small"], [1, "src"], [1, "req"], [1, "hint"], [1, "field"], ["for", "r-doc"], ["id", "r-doc", "placeholder", "e.g. VM0042 v2.2 Improved Agricultural Land Management", 1, "input", 3, "ngModelChange", "ngModel"], [1, "form-grid"], ["for", "r-sec"], ["id", "r-sec", "placeholder", "e.g. \xA78.2.1", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "r-page"], ["id", "r-page", "placeholder", "e.g. 47", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "r-notes"], [1, "subtle"], ["id", "r-notes", "rows", "2", 1, "input", 3, "ngModelChange", "ngModel"], [1, "prev", "small"], ["tone", "danger", "icon", "alert"], ["type", "button", 3, "click"], [1, "choice", 3, "on"], [1, "choice"], ["type", "radio", "name", "rule-choice", 3, "change", "checked"], [1, "dot"], [1, "chips-in"], [1, "ch"], ["placeholder", "Type a value and press Enter", 1, "bare", 3, "ngModelChange", "keydown.enter", "blur", "ngModel"], ["type", "button", "aria-label", "Remove", 3, "click"], ["name", "x", 3, "size"], [1, "fac"], [1, "fac-h"], [1, "fac-r"], ["type", "button", 1, "btn", "btn-secondary", "btn-sm", "add-f", 3, "click"], ["name", "plus", 3, "size"], ["placeholder", "e.g. synthetic_n_kg", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "0", "step", "any", "placeholder", "0.00598", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["type", "button", "aria-label", "Remove factor", 1, "fx", 3, "click"], ["name", "trash", 3, "size"], ["rows", "4", "placeholder", "Quote or summarise the methodology text", 1, "input", 3, "ngModelChange", "ngModel"], [1, "unit-wrap"], ["type", "number", 1, "input", "num", "big", 3, "ngModelChange", "ngModel"], [1, "unit"], ["name", "history", 3, "size"], [1, "btn", "btn-ghost", "danger", 3, "click", "disabled"], ["name", "trash"]], template: function RuleEditor_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function RuleEditor_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(1, RuleEditor_Conditional_1_Template, 47, 11, "div", 1);
      \u0275\u0275elementStart(2, "div", 2);
      \u0275\u0275conditionalCreate(3, RuleEditor_Conditional_3_Template, 3, 1, "button", 3);
      \u0275\u0275element(4, "span", 4);
      \u0275\u0275elementStart(5, "button", 5);
      \u0275\u0275listener("click", function RuleEditor_Template_button_click_5_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(6, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "button", 6);
      \u0275\u0275listener("click", function RuleEditor_Template_button_click_7_listener() {
        return ctx.save();
      });
      \u0275\u0275text(8);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_4_0;
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275property("drawer", true)("title", ctx.def()?.label ?? "Rule")("subtitle", ctx.def()?.help ?? "");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.def()) ? 1 : -1, tmp_4_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.rule() ? 3 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !!ctx.problem() || ctx.saving())("title", ctx.problem() ?? "");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Saving\u2026" : "Save rule");
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, NgModel, Modal, Callout, Icon], styles: ["\n.meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.meta[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  background: var(--%NS%sand-100);\n  color: var(--%NS%stone-700);\n}\n.kind[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.req-tag[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--%NS%clay-50);\n  color: var(--%NS%clay-700);\n  border: 1px solid var(--%NS%clay-100);\n}\n.req-tag.soft[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n  border-color: #f1dcae;\n}\n.opt-tag[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.val[_ngcontent-%COMP%], \n.src[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 14px;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  background: var(--%NS%surface-2);\n}\n.src[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%] {\n  gap: 5px;\n}\n.hint[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.req[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.err[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  padding: 3px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  gap: 2px;\n  align-self: flex-start;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  height: 34px;\n  min-width: 80px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: 500 13.5px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%forest-700);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.choices[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.choice[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface);\n  cursor: pointer;\n}\n.choice[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n.choice.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  box-shadow: 0 0 0 1px var(--%NS%forest-500) inset;\n  background: var(--%NS%forest-50);\n}\n.choice[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: 2px solid var(--%NS%stone-300);\n  flex: none;\n}\n.choice.on[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-600);\n  background: var(--%NS%forest-600);\n  box-shadow: inset 0 0 0 3px var(--%NS%surface);\n}\n.choice[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-of-type(2) {\n  flex: 1;\n}\n.choice[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.unit-wrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n.unit-wrap[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-right: 64px;\n}\n.big[_ngcontent-%COMP%] {\n  height: 44px;\n  font-size: 18px;\n  font-weight: 600;\n}\n.unit[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 13px;\n  color: var(--%NS%text-3);\n}\n.chips-in[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n  min-height: 40px;\n  padding: 6px 8px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface);\n}\n.chips-in[_ngcontent-%COMP%]:focus-within {\n  border-color: var(--%NS%forest-500);\n  box-shadow: var(--%NS%focus);\n}\n.ch[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 26px;\n  padding: 0 4px 0 9px;\n  border-radius: 6px;\n  background: var(--%NS%forest-50);\n  border: 1px solid var(--%NS%forest-200);\n  color: var(--%NS%forest-700);\n  font: 500 12.5px var(--%NS%mono);\n}\n.ch[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  border: 0;\n  background: none;\n  color: inherit;\n  cursor: pointer;\n  padding: 2px;\n  border-radius: 3px;\n}\n.bare[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 160px;\n  border: 0;\n  outline: none;\n  font: inherit;\n  background: none;\n  height: 26px;\n}\n.fac[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.fac-h[_ngcontent-%COMP%], \n.fac-r[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) 32px;\n  gap: 6px;\n  align-items: center;\n}\n.fac-h[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n  padding: 0 2px;\n}\n.fx[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 38px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  color: var(--%NS%stone-400);\n  cursor: pointer;\n}\n.fx[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%danger);\n  background: var(--%NS%danger-soft);\n}\n.add-f[_ngcontent-%COMP%] {\n  align-self: flex-start;\n}\n.prev[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  color: var(--%NS%text-2);\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  width: 100%;\n}\n.grow[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.danger[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n/*# sourceMappingURL=rule-editor.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RuleEditor, [{
    type: Component,
    args: [{ selector: "vc-rule-editor", imports: [FormsModule, Modal, Callout, Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" [drawer]="true" width="520px" [title]="def()?.label ?? 'Rule'" [subtitle]="def()?.help ?? ''">
      @if (def(); as d) {
        <div class="stack">
          <div class="meta">
            <code>{{ d.key }}</code>
            <span class="kind">{{ kindLabel(d.kind) }}</span>
            @if (d.required) { <span class="req-tag">Required for approval</span> }
            @else if (d.required_if) { <span class="req-tag soft">Required when {{ labelOf(d.required_if.key) }} is {{ fmtEq(d.required_if.equals) }}</span> }
            @else { <span class="opt-tag">Optional</span> }
          </div>

          <section class="val">
            <div class="label">Value</div>
            @switch (d.kind) {
              @case ('boolean') {
                <div class="seg">
                  <button type="button" [class.on]="value() === true" (click)="value.set(true)">Yes</button>
                  <button type="button" [class.on]="value() === false" (click)="value.set(false)">No</button>
                </div>
              }
              @case ('choice') {
                <div class="choices">
                  @for (c of d.choices; track c) {
                    <label class="choice" [class.on]="value() === c">
                      <input type="radio" name="rule-choice" [checked]="value() === c" (change)="value.set(c)" />
                      <span class="dot"></span><span>{{ human(c) }}</span><code>{{ c }}</code>
                    </label>
                  }
                </div>
              }
              @case ('list') {
                <div class="chips-in">
                  @for (c of listValue(); track c) { <span class="ch">{{ c }}<button type="button" (click)="removeItem(c)" aria-label="Remove"><vc-icon name="x" [size]="11" /></button></span> }
                  <input class="bare" [ngModel]="draft()" (ngModelChange)="draft.set($event)" (keydown.enter)="addItem($event)" (blur)="addItem()" placeholder="Type a value and press Enter" />
                </div>
                <span class="hint">Use the codes the platform records, e.g. <code>dry_combustion</code>, <code>forest</code>.</span>
              }
              @case ('factors') {
                <div class="fac">
                  <div class="fac-h"><span>Factor key</span><span>Value (tCO\u2082e per unit)</span><span></span></div>
                  @for (r of factorRows(); track $index; let i = $index) {
                    <div class="fac-r">
                      <input class="input mono" [ngModel]="r.key" (ngModelChange)="setFactor(i, { key: $event })" placeholder="e.g. synthetic_n_kg" [attr.aria-label]="'Factor key ' + (i + 1)" />
                      <input class="input num" type="number" min="0" step="any" [ngModel]="r.value" (ngModelChange)="setFactor(i, { value: $event === '' || $event === null ? null : +$event })" placeholder="0.00598" [attr.aria-label]="'Factor value ' + (i + 1)" />
                      <button type="button" class="fx" (click)="removeFactor(i)" aria-label="Remove factor"><vc-icon name="trash" [size]="14" /></button>
                    </div>
                  }
                  <button type="button" class="btn btn-secondary btn-sm add-f" (click)="addFactor()"><vc-icon name="plus" [size]="14" />Add factor</button>
                </div>
                <span class="hint">Use the factor keys that practice types reference (the catalogue's emission factor keys). Each value must be a positive number.</span>
              }
              @case ('text') {
                <textarea class="input" rows="4" [ngModel]="value() ?? ''" (ngModelChange)="value.set($event)" placeholder="Quote or summarise the methodology text"></textarea>
              }
              @default {
                <div class="unit-wrap">
                  <input type="number" class="input num big" [ngModel]="value()" (ngModelChange)="value.set($event === '' || $event === null ? null : +$event)"
                    [attr.min]="d.min" [attr.max]="d.max" [attr.step]="d.kind === 'integer' ? 1 : 'any'" />
                  @if (d.unit) { <span class="unit">{{ d.unit }}</span> }
                </div>
                <span class="hint">
                  {{ d.kind === 'integer' ? 'Whole number' : 'Number' }}@if (d.min !== null || d.max !== null) { \xB7 allowed range {{ d.min ?? '\u2014' }} to {{ d.max ?? '\u2014' }}{{ d.unit ? ' ' + d.unit : '' }} }
                </span>
              }
            }
            @if (valueError()) { <span class="err small">{{ valueError() }}</span> }
          </section>

          <section class="src">
            <div class="label">Source <span class="req">*</span></div>
            <p class="hint">Where in the published methodology this value comes from. Verifiers check it.</p>
            <div class="field"><label for="r-doc">Document</label><input id="r-doc" class="input" [ngModel]="doc()" (ngModelChange)="doc.set($event)" placeholder="e.g. VM0042 v2.2 Improved Agricultural Land Management" /></div>
            <div class="form-grid">
              <div class="field"><label for="r-sec">Section</label><input id="r-sec" class="input" [ngModel]="section()" (ngModelChange)="section.set($event)" placeholder="e.g. \xA78.2.1" /></div>
              <div class="field"><label for="r-page">Page</label><input id="r-page" class="input" [ngModel]="page()" (ngModelChange)="page.set($event)" placeholder="e.g. 47" /></div>
            </div>
            <div class="field"><label for="r-notes">Notes <span class="subtle">(optional)</span></label><textarea id="r-notes" class="input" rows="2" [ngModel]="notes()" (ngModelChange)="notes.set($event)"></textarea></div>
          </section>

          @if (rule(); as r) {
            <div class="prev small">
              <vc-icon name="history" [size]="13" />
              Currently <strong>{{ fmt(r.value, d.kind, d.unit) }}</strong> \xB7 entered by {{ r.entered_by ?? '\u2014' }}@if (r.last_modified_by && r.last_modified_by !== r.entered_by) {, last changed by {{ r.last_modified_by }}}
            </div>
          }
          @if (error()) { <vc-callout tone="danger" icon="alert">{{ error() }}</vc-callout> }
        </div>
      }
      <div footer class="ft">
        @if (rule()) { <button class="btn btn-ghost danger" [disabled]="saving()" (click)="clear()"><vc-icon name="trash" />Remove value</button> }
        <span class="grow"></span>
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!problem() || saving()" [title]="problem() ?? ''" (click)="save()">{{ saving() ? 'Saving\u2026' : 'Save rule' }}</button>
      </div>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;4a15b3938d1d7f0b;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\methodology\\rule-editor.ts */\n.meta {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.meta code {\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  background: var(--sand-100);\n  color: var(--stone-700);\n}\n.kind {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.req-tag {\n  font-size: 11.5px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--clay-50);\n  color: var(--clay-700);\n  border: 1px solid var(--clay-100);\n}\n.req-tag.soft {\n  background: var(--amber-100);\n  color: var(--amber-600);\n  border-color: #f1dcae;\n}\n.opt-tag {\n  font-size: 11.5px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.val,\n.src {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 14px;\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  background: var(--surface-2);\n}\n.src .field {\n  gap: 5px;\n}\n.hint {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.req {\n  color: var(--danger);\n}\n.err {\n  color: var(--danger);\n}\n.seg {\n  display: inline-flex;\n  padding: 3px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  gap: 2px;\n  align-self: flex-start;\n}\n.seg button {\n  height: 34px;\n  min-width: 80px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: 500 13.5px var(--font);\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--surface);\n  color: var(--forest-700);\n  box-shadow: var(--shadow-sm);\n}\n.choices {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.choice {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius-sm);\n  background: var(--surface);\n  cursor: pointer;\n}\n.choice input {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n.choice.on {\n  border-color: var(--forest-500);\n  box-shadow: 0 0 0 1px var(--forest-500) inset;\n  background: var(--forest-50);\n}\n.choice .dot {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: 2px solid var(--stone-300);\n  flex: none;\n}\n.choice.on .dot {\n  border-color: var(--forest-600);\n  background: var(--forest-600);\n  box-shadow: inset 0 0 0 3px var(--surface);\n}\n.choice span:nth-of-type(2) {\n  flex: 1;\n}\n.choice code {\n  font-size: 11px;\n  color: var(--text-3);\n}\n.unit-wrap {\n  position: relative;\n}\n.unit-wrap .input {\n  padding-right: 64px;\n}\n.big {\n  height: 44px;\n  font-size: 18px;\n  font-weight: 600;\n}\n.unit {\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 13px;\n  color: var(--text-3);\n}\n.chips-in {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n  min-height: 40px;\n  padding: 6px 8px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius-sm);\n  background: var(--surface);\n}\n.chips-in:focus-within {\n  border-color: var(--forest-500);\n  box-shadow: var(--focus);\n}\n.ch {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 26px;\n  padding: 0 4px 0 9px;\n  border-radius: 6px;\n  background: var(--forest-50);\n  border: 1px solid var(--forest-200);\n  color: var(--forest-700);\n  font: 500 12.5px var(--mono);\n}\n.ch button {\n  display: grid;\n  place-items: center;\n  border: 0;\n  background: none;\n  color: inherit;\n  cursor: pointer;\n  padding: 2px;\n  border-radius: 3px;\n}\n.bare {\n  flex: 1;\n  min-width: 160px;\n  border: 0;\n  outline: none;\n  font: inherit;\n  background: none;\n  height: 26px;\n}\n.fac {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.fac-h,\n.fac-r {\n  display: grid;\n  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) 32px;\n  gap: 6px;\n  align-items: center;\n}\n.fac-h {\n  font-size: 11.5px;\n  color: var(--text-3);\n  padding: 0 2px;\n}\n.fx {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 38px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  color: var(--stone-400);\n  cursor: pointer;\n}\n.fx:hover {\n  color: var(--danger);\n  background: var(--danger-soft);\n}\n.add-f {\n  align-self: flex-start;\n}\n.prev {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  color: var(--text-2);\n}\n.ft {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  width: 100%;\n}\n.grow {\n  flex: 1;\n}\n.danger {\n  color: var(--danger);\n}\n/*# sourceMappingURL=rule-editor.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], packId: [{ type: Input, args: [{ isSignal: true, alias: "packId", required: false }] }], def: [{ type: Input, args: [{ isSignal: true, alias: "def", required: false }] }], rule: [{ type: Input, args: [{ isSignal: true, alias: "rule", required: false }] }], allDefs: [{ type: Input, args: [{ isSignal: true, alias: "allDefs", required: false }] }], defaultDoc: [{ type: Input, args: [{ isSignal: true, alias: "defaultDoc", required: false }] }], saved: [{ type: Output, args: ["saved"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RuleEditor, { className: "RuleEditor", filePath: "src/app/features/methodology/rule-editor.ts", lineNumber: 153 });
})();

// src/app/features/methodology/pack-detail.page.ts
var _c0 = (a0) => [a0];
var _forTrack02 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.def.key;
function PackDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-loading", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 8);
  }
}
function PackDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function PackDetailPage_Conditional_5_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275element(1, "vc-icon", 59);
    \u0275\u0275text(2, "Published methodology");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("href", p_r3.source_url, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function PackDetailPage_Conditional_5_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275element(1, "vc-icon", 60);
    \u0275\u0275text(2, "No source link");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function PackDetailPage_Conditional_5_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span")(1, "span", 14);
    \u0275\u0275text(2, "Approved by");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", p_r3.approved_by, " \xB7 ", \u0275\u0275pipeBind2(4, 2, p_r3.approved_at, true));
  }
}
function PackDetailPage_Conditional_5_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 61);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Conditional_22_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.assignOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 62);
    \u0275\u0275text(2, "Assign to project");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 61);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Conditional_23_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.revisionOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 63);
    \u0275\u0275text(2, "New revision");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Conditional_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.retireOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 64);
    \u0275\u0275text(2, "Retire");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 18)(1, "strong");
    \u0275\u0275text(2, "Demonstration values.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Some rules in this pack cite a ");
    \u0275\u0275elementStart(4, "em");
    \u0275\u0275text(5, "DEMO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " source. They are placeholders for trying the platform \u2014 replace every one with the value from the published methodology, with its section and page, before any real calculation or credit issuance. ");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "vc-icon", 65);
    \u0275\u0275elementStart(2, "div")(3, "strong");
    \u0275\u0275text(4, "Approved and frozen.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Values can't be changed, so every calculation that used this pack stays reproducible. To change something, create a new revision based on it.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function PackDetailPage_Conditional_5_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "vc-icon", 66);
    \u0275\u0275elementStart(2, "div")(3, "strong");
    \u0275\u0275text(4, "Retired.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Kept for the record; it can't be assigned to projects.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function PackDetailPage_Conditional_5_Conditional_45_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Conditional_45_For_5_Template_button_click_0_listener() {
      const k_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.editKey(k_r8));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const k_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.labelOf(k_r8));
  }
}
function PackDetailPage_Conditional_5_Conditional_45_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 71);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+", ctx_r0.readiness().outstanding.length - 6, " more");
  }
}
function PackDetailPage_Conditional_5_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 67);
    \u0275\u0275element(1, "vc-icon", 68);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 69);
    \u0275\u0275repeaterCreate(4, PackDetailPage_Conditional_5_Conditional_45_For_5_Template, 2, 1, "button", 70, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(6, PackDetailPage_Conditional_5_Conditional_45_Conditional_6_Template, 2, 1, "span", 71);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r0.readiness().outstanding.length, " required rule", ctx_r0.readiness().outstanding.length === 1 ? "" : "s", " still missing");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.readiness().outstanding.slice(0, 6));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.readiness().outstanding.length > 6 ? 6 : -1);
  }
}
function PackDetailPage_Conditional_5_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 31);
    \u0275\u0275element(1, "vc-icon", 73);
    \u0275\u0275text(2, "Every required rule is answered");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function PackDetailPage_Conditional_5_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Approved by ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r3.approved_by);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" on ", \u0275\u0275pipeBind2(5, 3, p_r3.approved_at, true), ". Created by ", p_r3.created_by, ".");
  }
}
function PackDetailPage_Conditional_5_Conditional_53_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 76);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Conditional_53_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.approveOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 47);
    \u0275\u0275text(2, "Approve pack");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("disabled", ctx_r0.busy());
  }
}
function PackDetailPage_Conditional_5_Conditional_53_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 71);
    \u0275\u0275text(1, "Only methodology owners can approve rule packs.");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1, "Four-eyes rule: the person who approves must not have created the pack or entered or changed any of its values. Ask a colleague who wasn't involved to review the sources and approve.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dl", 74)(3, "dt");
    \u0275\u0275text(4, "Created by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dd");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dt");
    \u0275\u0275text(8, "Values entered by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dd");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(11, PackDetailPage_Conditional_5_Conditional_53_Conditional_11_Template, 3, 1, "button", 75)(12, PackDetailPage_Conditional_5_Conditional_53_Conditional_12_Template, 2, 0, "p", 71);
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(p_r3.created_by ?? "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.editors().join(", ") || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth.can("rules.approve") ? 11 : 12);
  }
}
function PackDetailPage_Conditional_5_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35);
    \u0275\u0275text(1, "This pack is retired.");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 86);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 87);
    \u0275\u0275text(1, "Optional");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_9_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 95);
    \u0275\u0275text(1, "\xB7");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r11.rule.source_section);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 95);
    \u0275\u0275text(1, "\xB7");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("p. ", r_r11.rule.source_page);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_9_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275textInterpolate1(", changed by ", r_r11.rule.last_modified_by);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 89);
    \u0275\u0275element(1, "vc-icon", 93);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_9_Conditional_4_Template, 4, 1);
    \u0275\u0275conditionalCreate(5, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_9_Conditional_5_Template, 4, 1);
    \u0275\u0275elementStart(6, "span", 94);
    \u0275\u0275text(7);
    \u0275\u0275conditionalCreate(8, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_9_Conditional_8_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
    \u0275\u0275advance();
    \u0275\u0275classProp("demo-src", ctx_r0.isDemoSrc(r_r11.rule));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r11.rule.source_document);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.rule.source_section ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.rule.source_page ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("entered by ", r_r11.rule.entered_by ?? "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.rule.last_modified_by && r_r11.rule.last_modified_by !== r_r11.rule.entered_by ? 8 : -1);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 101);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275classProp("yes", r_r11.rule.value === true);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r11.rule.value ? "Yes" : "No");
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 102);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r12 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.human(v_r12));
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 97);
    \u0275\u0275repeaterCreate(1, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_1_For_2_Template, 2, 1, "span", 102, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.asList(r_r11.rule.value));
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 98);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r11.rule.value);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 103)(1, "code");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 105);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r13 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r13.key);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r13.value);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 99);
    \u0275\u0275repeaterCreate(1, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_3_For_2_Template, 5, 2, "span", 103, _forTrack02);
    \u0275\u0275elementStart(3, "span", 104);
    \u0275\u0275text(4, "tCO\u2082e per unit");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.factors(r_r11.rule.value));
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 104);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r11.def.unit);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 106);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_4_Conditional_2_Template, 2, 1, "span", 104);
  }
  if (rf & 2) {
    const r_r11 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.fmt(r_r11.rule.value, r_r11.def.kind, ""));
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.def.unit ? 2 : -1);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_0_Template, 2, 3, "span", 96)(1, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_1_Template, 3, 0, "div", 97)(2, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_2_Template, 2, 1, "span", 98)(3, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_3_Template, 5, 0, "div", 99)(4, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Case_4_Template, 3, 2);
    \u0275\u0275element(5, "vc-dc", 100);
  }
  if (rf & 2) {
    let tmp_24_0;
    const r_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional((tmp_24_0 = r_r11.def.kind) === "boolean" ? 0 : tmp_24_0 === "list" ? 1 : tmp_24_0 === "text" ? 2 : tmp_24_0 === "factors" ? 3 : 4);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 91);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.editable() ? "Enter value" : "Not entered");
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 92);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 15);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 82);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Template_li_click_0_listener() {
      const r_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.edit(r_r11.def));
    });
    \u0275\u0275elementStart(1, "div", 83)(2, "div", 84)(3, "span", 85);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_5_Template, 2, 0, "span", 86)(6, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_6_Template, 2, 0, "span", 87);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 88);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_9_Template, 9, 8, "div", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 90);
    \u0275\u0275conditionalCreate(11, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_11_Template, 6, 1)(12, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_12_Template, 2, 1, "span", 91);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Conditional_13_Template, 1, 1, "vc-icon", 92);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r11 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("missing", r_r11.missing)("clickable", ctx_r0.editable());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r11.def.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.missing ? 5 : !r_r11.def.required && !r_r11.def.required_if && !r_r11.rule ? 6 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r11.def.help);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r11.rule ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r11.rule ? 11 : 12);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.editable() ? 13 : -1);
  }
}
function PackDetailPage_Conditional_5_For_66_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 77)(1, "div", 78)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 79);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "ul", 80);
    \u0275\u0275repeaterCreate(7, PackDetailPage_Conditional_5_For_66_Conditional_0_For_8_Template, 14, 10, "li", 81, _forTrack2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const g_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(g_r14.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", g_r14.answered, " / ", g_r14.total);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(g_r14.rows);
  }
}
function PackDetailPage_Conditional_5_For_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PackDetailPage_Conditional_5_For_66_Conditional_0_Template, 9, 3, "section", 77);
  }
  if (rf & 2) {
    const g_r14 = ctx.$implicit;
    \u0275\u0275conditional(g_r14.rows.length ? 0 : -1);
  }
}
function PackDetailPage_Conditional_5_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 42);
    \u0275\u0275text(1, "This pack still cites DEMO sources. Approving it is fine for trying the platform, not for real credits.");
    \u0275\u0275elementEnd();
  }
}
function PackDetailPage_Conditional_5_Conditional_72_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "You can't approve this pack.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " You created it or entered or changed at least one of its values. The four-eyes rule needs someone else to check it \u2014 ask another methodology owner to approve. ");
  }
}
function PackDetailPage_Conditional_5_Conditional_72_Conditional_2_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r15);
  }
}
function PackDetailPage_Conditional_5_Conditional_72_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul", 107);
    \u0275\u0275repeaterCreate(3, PackDetailPage_Conditional_5_Conditional_72_Conditional_2_For_4_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ap_r16 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ap_r16.message);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ap_r16.labels);
  }
}
function PackDetailPage_Conditional_5_Conditional_72_Conditional_3_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r17);
  }
}
function PackDetailPage_Conditional_5_Conditional_72_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 107);
    \u0275\u0275repeaterCreate(1, PackDetailPage_Conditional_5_Conditional_72_Conditional_3_Conditional_1_For_2_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ap_r16 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ap_r16.labels);
  }
}
function PackDetailPage_Conditional_5_Conditional_72_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275conditionalCreate(1, PackDetailPage_Conditional_5_Conditional_72_Conditional_3_Conditional_1_Template, 3, 0, "ul", 107);
  }
  if (rf & 2) {
    const ap_r16 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", ap_r16.message, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ap_r16.labels.length ? 1 : -1);
  }
}
function PackDetailPage_Conditional_5_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 43);
    \u0275\u0275conditionalCreate(1, PackDetailPage_Conditional_5_Conditional_72_Conditional_1_Template, 3, 0)(2, PackDetailPage_Conditional_5_Conditional_72_Conditional_2_Template, 5, 1)(3, PackDetailPage_Conditional_5_Conditional_72_Conditional_3_Template, 2, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ap_r16 = ctx;
    \u0275\u0275property("tone", ap_r16.code === "SELF_APPROVAL_REJECTED" ? "warn" : "danger")("icon", ap_r16.code === "SELF_APPROVAL_REJECTED" ? "users" : "alert");
    \u0275\u0275advance();
    \u0275\u0275conditional(ap_r16.code === "SELF_APPROVAL_REJECTED" ? 1 : ap_r16.code === "RULE_MISSING" ? 2 : 3);
  }
}
function PackDetailPage_Conditional_5_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.retireError());
  }
}
function PackDetailPage_Conditional_5_For_96_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pr_r18 = ctx.$implicit;
    const p_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("value", pr_r18.id)("disabled", pr_r18.methodology_code !== p_r3.methodology_code || pr_r18.methodology_version !== p_r3.methodology_version);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate4(" ", pr_r18.code, " \xB7 ", pr_r18.name, " (", pr_r18.methodology_code, " v", pr_r18.methodology_version, ") ");
  }
}
function PackDetailPage_Conditional_5_Conditional_99_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.assignError());
  }
}
function PackDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "header", 5)(1, "div", 6)(2, "div", 7);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 8)(5, "h1")(6, "span", 9);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "vc-badge", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 11);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 12);
    \u0275\u0275conditionalCreate(13, PackDetailPage_Conditional_5_Conditional_13_Template, 3, 2, "a", 13)(14, PackDetailPage_Conditional_5_Conditional_14_Template, 3, 1, "span", 14);
    \u0275\u0275elementStart(15, "span")(16, "span", 14);
    \u0275\u0275text(17, "Created by");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(20, PackDetailPage_Conditional_5_Conditional_20_Template, 5, 5, "span");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 15);
    \u0275\u0275conditionalCreate(22, PackDetailPage_Conditional_5_Conditional_22_Template, 3, 0, "button", 16);
    \u0275\u0275conditionalCreate(23, PackDetailPage_Conditional_5_Conditional_23_Template, 3, 0, "button", 16);
    \u0275\u0275conditionalCreate(24, PackDetailPage_Conditional_5_Conditional_24_Template, 3, 0, "button", 17);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(25, PackDetailPage_Conditional_5_Conditional_25_Template, 7, 0, "vc-callout", 18);
    \u0275\u0275conditionalCreate(26, PackDetailPage_Conditional_5_Conditional_26_Template, 6, 1, "div", 19)(27, PackDetailPage_Conditional_5_Conditional_27_Template, 6, 1, "div", 20);
    \u0275\u0275elementStart(28, "div", 21)(29, "section", 22);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(30, "svg", 23);
    \u0275\u0275element(31, "circle", 24)(32, "circle", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(33, "div", 26)(34, "div", 27);
    \u0275\u0275text(35);
    \u0275\u0275elementStart(36, "small");
    \u0275\u0275text(37, "%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div", 28);
    \u0275\u0275text(39, "answered");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 29)(41, "div", 30)(42, "strong");
    \u0275\u0275text(43);
    \u0275\u0275elementEnd();
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(45, PackDetailPage_Conditional_5_Conditional_45_Template, 7, 4)(46, PackDetailPage_Conditional_5_Conditional_46_Template, 3, 1, "p", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "section", 32)(48, "div", 33);
    \u0275\u0275element(49, "vc-icon", 34);
    \u0275\u0275elementStart(50, "h3");
    \u0275\u0275text(51, "Approval");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(52, PackDetailPage_Conditional_5_Conditional_52_Template, 6, 6, "p")(53, PackDetailPage_Conditional_5_Conditional_53_Template, 13, 3)(54, PackDetailPage_Conditional_5_Conditional_54_Template, 2, 0, "p", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "div", 36)(56, "div", 37)(57, "button", 38);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.show.set("all"));
    });
    \u0275\u0275text(58, "All rules");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "button", 38);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_59_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.show.set("missing"));
    });
    \u0275\u0275text(60, "Missing ");
    \u0275\u0275elementStart(61, "span", 39);
    \u0275\u0275text(62);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "button", 38);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_63_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.show.set("entered"));
    });
    \u0275\u0275text(64, "Entered");
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(65, PackDetailPage_Conditional_5_For_66_Template, 1, 1, null, null, _forTrack02);
    \u0275\u0275elementStart(67, "vc-rule-editor", 40);
    \u0275\u0275twoWayListener("openChange", function PackDetailPage_Conditional_5_Template_vc_rule_editor_openChange_67_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.editorOpen, $event) || (ctx_r0.editorOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("saved", function PackDetailPage_Conditional_5_Template_vc_rule_editor_saved_67_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSaved($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "vc-modal", 41);
    \u0275\u0275twoWayListener("openChange", function PackDetailPage_Conditional_5_Template_vc_modal_openChange_68_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.approveOpen, $event) || (ctx_r0.approveOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(69, "p");
    \u0275\u0275text(70, "Once approved, the pack is frozen: no value can change, and projects can use it for calculations. Please confirm you have checked each value against the published methodology.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(71, PackDetailPage_Conditional_5_Conditional_71_Template, 2, 0, "vc-callout", 42);
    \u0275\u0275conditionalCreate(72, PackDetailPage_Conditional_5_Conditional_72_Template, 4, 3, "vc-callout", 43);
    \u0275\u0275elementStart(73, "div", 44)(74, "button", 45);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_74_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.approveOpen.set(false));
    });
    \u0275\u0275text(75, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "button", 46);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_76_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.approve());
    });
    \u0275\u0275element(77, "vc-icon", 47);
    \u0275\u0275text(78);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(79, "vc-modal", 48);
    \u0275\u0275twoWayListener("openChange", function PackDetailPage_Conditional_5_Template_vc_modal_openChange_79_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.retireOpen, $event) || (ctx_r0.retireOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(80, "p");
    \u0275\u0275text(81, "A retired pack is kept for the record but can't be edited or assigned. Projects using it must be moved to another pack first. This can't be undone.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(82, PackDetailPage_Conditional_5_Conditional_82_Template, 2, 1, "vc-callout", 49);
    \u0275\u0275elementStart(83, "div", 44)(84, "button", 45);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_84_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.retireOpen.set(false));
    });
    \u0275\u0275text(85, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "button", 50);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_86_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.retire());
    });
    \u0275\u0275text(87, "Retire pack");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(88, "vc-modal", 51);
    \u0275\u0275twoWayListener("openChange", function PackDetailPage_Conditional_5_Template_vc_modal_openChange_88_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.assignOpen, $event) || (ctx_r0.assignOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(89, "div", 52)(90, "label", 53);
    \u0275\u0275text(91, "Project");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "select", 54);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PackDetailPage_Conditional_5_Template_select_ngModelChange_92_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.assignTo.set($event));
    });
    \u0275\u0275elementStart(93, "option", 55);
    \u0275\u0275text(94, "Choose a project\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(95, PackDetailPage_Conditional_5_For_96_Template, 2, 6, "option", 56, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "span", 57);
    \u0275\u0275text(98);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(99, PackDetailPage_Conditional_5_Conditional_99_Template, 2, 1, "vc-callout", 49);
    \u0275\u0275elementStart(100, "div", 44)(101, "button", 45);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_101_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.assignOpen.set(false));
    });
    \u0275\u0275text(102, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(103, "button", 46);
    \u0275\u0275listener("click", function PackDetailPage_Conditional_5_Template_button_click_103_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.assign());
    });
    \u0275\u0275text(104, "Assign pack");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(105, "vc-create-pack", 58);
    \u0275\u0275twoWayListener("openChange", function PackDetailPage_Conditional_5_Template_vc_create_pack_openChange_105_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.revisionOpen, $event) || (ctx_r0.revisionOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("created", function PackDetailPage_Conditional_5_Template_vc_create_pack_created_105_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onRevision($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_36_0;
    const p_r3 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Rule pack \xB7 revision ", p_r3.revision);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r3.methodology_code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" v", p_r3.methodology_version);
    \u0275\u0275advance();
    \u0275\u0275property("status", p_r3.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r3.source_url ? 13 : 14);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", p_r3.created_by ?? "\u2014", " \xB7 ", \u0275\u0275pipeBind1(19, 53, p_r3.created_at));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r3.approved_by ? 20 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r3.status === "approved" && ctx_r0.canAssign() ? 22 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r3.status !== "draft" && ctx_r0.auth.can("rules.edit") ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r3.status !== "retired" && ctx_r0.auth.can("rules.approve") ? 24 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.demo() ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r3.status === "approved" ? 26 : p_r3.status === "retired" ? 27 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("done", !ctx_r0.readiness()?.outstanding?.length);
    \u0275\u0275attribute("stroke-dasharray", ctx_r0.dash());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.pct());
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.readiness()?.answered ?? 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" of ", ctx_r0.readiness()?.total ?? 0, " rules entered");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.readiness()?.outstanding?.length ? 45 : 46);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(p_r3.status === "approved" ? 52 : p_r3.status === "draft" ? 53 : 54);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("on", ctx_r0.show() === "all");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r0.show() === "missing");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.readiness()?.outstanding?.length ?? 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("on", ctx_r0.show() === "entered");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.groups());
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("open", ctx_r0.editorOpen);
    \u0275\u0275property("packId", p_r3.id)("def", ctx_r0.editing())("rule", ctx_r0.editingRule())("allDefs", ctx_r0.allDefs())("defaultDoc", ctx_r0.commonDoc());
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.approveOpen);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.demo() ? 71 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_36_0 = ctx_r0.approveProblem()) ? 72 : -1, tmp_36_0);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.busy());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.busy() ? "Approving\u2026" : "Approve and freeze");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.retireOpen);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.retireError() ? 82 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.busy());
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("open", ctx_r0.assignOpen);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r0.assignTo());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.ctx.projects());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Only projects following ", p_r3.methodology_code, " v", p_r3.methodology_version, " can use this pack.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.assignError() ? 99 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r0.assignTo() || ctx_r0.busy());
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("open", ctx_r0.revisionOpen);
    \u0275\u0275property("packs", \u0275\u0275pureFunction1(55, _c0, p_r3))("from", p_r3);
  }
}
var PackDetailPage = class _PackDetailPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  router = inject(Router);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
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
  readiness = signal(
    null,
    ...ngDevMode ? [{ debugName: "readiness" }] : (
      /* istanbul ignore next */
      []
    )
  );
  defs = signal(
    null,
    ...ngDevMode ? [{ debugName: "defs" }] : (
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
  show = signal(
    "all",
    ...ngDevMode ? [{ debugName: "show" }] : (
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
  editorOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "editorOpen" }] : (
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
  approveOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "approveOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approveProblem = signal(
    null,
    ...ngDevMode ? [{ debugName: "approveProblem" }] : (
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
  retireError = signal(
    null,
    ...ngDevMode ? [{ debugName: "retireError" }] : (
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
  assignTo = signal(
    "",
    ...ngDevMode ? [{ debugName: "assignTo" }] : (
      /* istanbul ignore next */
      []
    )
  );
  assignError = signal(
    null,
    ...ngDevMode ? [{ debugName: "assignError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  revisionOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "revisionOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editable = computed(
    () => this.pack()?.status === "draft" && this.auth.can("rules.edit"),
    ...ngDevMode ? [{ debugName: "editable" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canAssign = computed(
    () => this.auth.can("rules.edit", "programmes.manage"),
    ...ngDevMode ? [{ debugName: "canAssign" }] : (
      /* istanbul ignore next */
      []
    )
  );
  demo = computed(
    () => isDemo(this.pack()),
    ...ngDevMode ? [{ debugName: "demo" }] : (
      /* istanbul ignore next */
      []
    )
  );
  allDefs = computed(
    () => (this.defs()?.groups ?? []).flatMap((g) => g.rules),
    ...ngDevMode ? [{ debugName: "allDefs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editingRule = computed(
    () => this.pack()?.rules.find((r) => r.key === this.editing()?.key) ?? null,
    ...ngDevMode ? [{ debugName: "editingRule" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editors = computed(
    () => [...new Set((this.pack()?.rules ?? []).flatMap((r) => [r.entered_by, r.last_modified_by]).filter((x) => !!x))],
    ...ngDevMode ? [{ debugName: "editors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  commonDoc = computed(
    () => {
      const counts = /* @__PURE__ */ new Map();
      for (const r of this.pack()?.rules ?? [])
        counts.set(r.source_document, (counts.get(r.source_document) ?? 0) + 1);
      return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
    },
    ...ngDevMode ? [{ debugName: "commonDoc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pct = computed(
    () => {
      const r = this.readiness();
      return r && r.total ? Math.round(r.answered / r.total * 100) : 0;
    },
    ...ngDevMode ? [{ debugName: "pct" }] : (
      /* istanbul ignore next */
      []
    )
  );
  dash = computed(
    () => {
      const c = 2 * Math.PI * 50;
      return `${c * this.pct() / 100} ${c}`;
    },
    ...ngDevMode ? [{ debugName: "dash" }] : (
      /* istanbul ignore next */
      []
    )
  );
  groups = computed(
    () => {
      const byKey = new Map((this.pack()?.rules ?? []).map((r) => [r.key, r]));
      const out = new Set(this.readiness()?.outstanding ?? []);
      return (this.defs()?.groups ?? []).map((g) => {
        const all = g.rules.map((def) => ({ def, rule: byKey.get(def.key) ?? null, missing: out.has(def.key) }));
        const rows = all.filter((r) => this.show() === "all" || (this.show() === "missing" ? r.missing : !!r.rule));
        return { key: g.key, label: g.label, rows, total: all.length, answered: all.filter((r) => r.rule).length };
      });
    },
    ...ngDevMode ? [{ debugName: "groups" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.api.get("/methodology/definitions").subscribe({ next: (d) => this.defs.set(d), error: (e) => this.error.set(e.message) });
    effect(() => {
      const id = this.id();
      untracked(() => this.load(id));
    });
  }
  load(id) {
    this.loading.set(!this.pack());
    this.api.get(`/rule-packs/${id}`).subscribe({
      next: (p) => {
        this.pack.set(p);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
    this.loadReadiness(id);
  }
  loadReadiness(id = this.id()) {
    this.api.get(`/rule-packs/${id}/readiness`).subscribe({ next: (r) => this.readiness.set(r) });
  }
  labelOf(k) {
    return this.allDefs().find((d) => d.key === k)?.label ?? k;
  }
  human = humanValue;
  fmt = formatRuleValue;
  factors = factorEntries;
  asList(v) {
    return Array.isArray(v) ? v.map(String) : [String(v)];
  }
  isDemoSrc(r) {
    return /demo/i.test(r.source_document ?? "");
  }
  edit(d) {
    if (!this.editable())
      return;
    this.editing.set(d);
    this.editorOpen.set(true);
  }
  editKey(k) {
    const d = this.allDefs().find((x) => x.key === k);
    if (d)
      this.edit(d);
  }
  onSaved(p) {
    this.pack.set(p);
    this.loadReadiness();
    this.toast.success("Rule saved", this.editing()?.label);
  }
  approve() {
    this.busy.set(true);
    this.approveProblem.set(null);
    this.api.post(`/rule-packs/${this.id()}/approve`).subscribe({
      next: (p) => {
        this.busy.set(false);
        this.pack.set(p);
        this.approveOpen.set(false);
        this.loadReadiness();
        this.toast.success(`${p.label} approved`, "The pack is now frozen and can be assigned to projects.");
      },
      error: (e) => {
        this.busy.set(false);
        const labels = e.details["labels"] ?? Object.entries(e.details["invalid"] ?? {}).map(([k, m]) => `${this.labelOf(k)}: ${m}`);
        this.approveProblem.set({ code: e.code, message: e.message, labels });
      }
    });
  }
  retire() {
    this.busy.set(true);
    this.retireError.set(null);
    this.api.post(`/rule-packs/${this.id()}/retire`).subscribe({
      next: (p) => {
        this.busy.set(false);
        this.pack.set(p);
        this.retireOpen.set(false);
        this.toast.success(`${p.label} retired`);
      },
      error: (e) => {
        this.busy.set(false);
        const projects = e.details["projects"];
        this.retireError.set(projects?.length ? `${e.message} (${projects.join(", ")})` : e.message);
      }
    });
  }
  assign() {
    this.busy.set(true);
    this.assignError.set(null);
    this.api.post(`/projects/${this.assignTo()}/rule-pack`, { pack_id: this.id() }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.assignOpen.set(false);
        const pr = this.ctx.projects().find((x) => x.id === this.assignTo());
        this.toast.success("Rule pack assigned", `${pr?.code ?? "The project"} now uses ${r.label}.`);
      },
      error: (e) => {
        this.busy.set(false);
        this.assignError.set(e.message);
      }
    });
  }
  onRevision(p) {
    this.toast.success(`${p.label} created`, "Values were copied. Update what changed, then ask a colleague to approve.");
    this.router.navigate(["/app/methodology", p.id]);
  }
  static \u0275fac = function PackDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PackDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PackDetailPage, selectors: [["vc-pack-detail"]], inputs: { id: [1, "id"] }, decls: 6, vars: 2, consts: [["routerLink", "/app/methodology", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this rule pack", 3, "message"], [3, "rows"], [1, "hdr"], [1, "t"], [1, "eyebrow"], [1, "row-t"], [1, "mono"], [3, "status"], [1, "sub"], [1, "facts", "small"], ["target", "_blank", "rel", "noopener", 3, "href"], [1, "subtle"], [1, "actions"], [1, "btn", "btn-secondary"], [1, "btn", "btn-ghost"], ["tone", "danger", "icon", "alert", 1, "demo"], [1, "lock"], [1, "lock", "retired"], [1, "top"], [1, "card", "meter"], ["viewBox", "0 0 120 120", "aria-hidden", "true", 1, "ring"], ["cx", "60", "cy", "60", "r", "50", 1, "bg"], ["cx", "60", "cy", "60", "r", "50", "transform", "rotate(-90 60 60)", 1, "fg"], [1, "ring-c"], [1, "pct", "num"], [1, "small", "subtle"], [1, "m-txt"], [1, "m-h", "num"], [1, "m-s", "ok"], [1, "card", "approve"], [1, "ap-h"], ["name", "shield-check", 3, "size"], [1, "muted"], [1, "filters"], [1, "seg"], ["type", "button", 3, "click"], [1, "c"], [3, "openChange", "saved", "open", "packId", "def", "rule", "allDefs", "defaultDoc"], ["title", "Approve this rule pack?", "width", "540px", 3, "openChange", "open"], ["tone", "warn", "icon", "alert", 1, "mt"], [1, "mt", 3, "tone", "icon"], ["footer", "", 1, "ft"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "verified"], ["title", "Retire this rule pack?", "width", "480px", 3, "openChange", "open"], ["tone", "danger", "icon", "alert", 1, "mt"], [1, "btn", "btn-danger", 3, "click", "disabled"], ["title", "Assign to a project", "width", "520px", "subtitle", "The project's calculations, sampling checks and quality rules will use this pack's values.", 3, "openChange", "open"], [1, "field"], ["for", "as-p"], ["id", "as-p", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value", "disabled"], [1, "hint"], [3, "openChange", "created", "open", "packs", "from"], ["name", "external-link", 3, "size"], ["name", "link", 3, "size"], [1, "btn", "btn-secondary", 3, "click"], ["name", "briefcase"], ["name", "branch"], ["name", "archive"], ["name", "lock", 3, "size"], ["name", "archive", 3, "size"], [1, "m-s", "warn"], ["name", "alert", 3, "size"], [1, "miss"], ["type", "button", 1, "mk"], [1, "subtle", "small"], ["type", "button", 1, "mk", 3, "click"], ["name", "check-circle", 3, "size"], [1, "kv", "small"], [1, "btn", "btn-primary", "full", 3, "disabled"], [1, "btn", "btn-primary", "full", 3, "click", "disabled"], [1, "card", "group"], [1, "card-head"], [1, "subtle", "small", "num"], [1, "rules"], [1, "rule", 3, "missing", "clickable"], [1, "rule", 3, "click"], [1, "r-main"], [1, "r-l"], [1, "r-label"], [1, "need"], [1, "optl"], [1, "r-help"], [1, "r-src", "small"], [1, "r-val"], [1, "empty"], ["name", "chevron-right", 1, "chev", 3, "size"], ["name", "book", 3, "size"], [1, "by"], [1, "sep"], [1, "bool", 3, "yes"], [1, "lst"], [1, "txt"], [1, "facs"], ["cls", "RECORDED"], [1, "bool"], [1, "li"], [1, "fc"], [1, "u"], [1, "num"], [1, "v", "num"], [1, "ml"]], template: function PackDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All rule packs");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, PackDetailPage_Conditional_3_Template, 2, 1, "div", 2)(4, PackDetailPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, PackDetailPage_Conditional_5_Template, 106, 57);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.pack()) ? 5 : -1, tmp_1_0);
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, RouterLink, Icon, Badge, Callout, DataClass, ErrorBox, Loading, Modal, RuleEditor, CreatePack, DayPipe], styles: ["\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-bottom: 14px;\n}\n.back[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%forest-700);\n  text-decoration: none;\n}\n.hdr[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  gap: 16px;\n  margin-bottom: 18px;\n  flex-wrap: wrap;\n}\n.t[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 280px;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--%NS%forest-500);\n  margin-bottom: 6px;\n}\n.row-t[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.sub[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  color: var(--%NS%text-2);\n}\n.facts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n  margin-top: 10px;\n  color: var(--%NS%stone-700);\n}\n.facts[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.facts[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.demo[_ngcontent-%COMP%] {\n  margin-bottom: 14px;\n}\n.lock[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n  padding: 12px 16px;\n  border-radius: var(--%NS%radius);\n  background: var(--%NS%forest-800);\n  color: #e6efe9;\n  margin-bottom: 16px;\n  font-size: 13.5px;\n}\n.lock[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-300);\n  margin-top: 2px;\n}\n.lock.retired[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-700);\n}\n.top[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);\n  gap: 16px;\n  margin-bottom: 18px;\n}\n@media (max-width: 1000px) {\n  .top[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.meter[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  padding: 22px 24px;\n}\n.ring[_ngcontent-%COMP%] {\n  width: 128px;\n  height: 128px;\n  flex: none;\n}\n.ring[_ngcontent-%COMP%]   .bg[_ngcontent-%COMP%] {\n  fill: none;\n  stroke: var(--%NS%sand-200);\n  stroke-width: 10;\n}\n.ring[_ngcontent-%COMP%]   .fg[_ngcontent-%COMP%] {\n  fill: none;\n  stroke: var(--%NS%amber-600);\n  stroke-width: 10;\n  stroke-linecap: round;\n  transition: stroke-dasharray 0.6s ease;\n}\n.ring[_ngcontent-%COMP%]   .fg.done[_ngcontent-%COMP%] {\n  stroke: var(--%NS%forest-500);\n}\n.ring-c[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 24px;\n  width: 128px;\n  text-align: center;\n}\n.pct[_ngcontent-%COMP%] {\n  font-size: 30px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  line-height: 1;\n}\n.pct[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--%NS%text-3);\n}\n.m-txt[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.m-h[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.m-s[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  margin-top: 6px;\n  font-size: 13px;\n}\n.m-s.warn[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.m-s.ok[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n}\n.miss[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  margin-top: 10px;\n}\n.mk[_ngcontent-%COMP%] {\n  height: 26px;\n  padding: 0 9px;\n  border-radius: 6px;\n  border: 1px solid #f1dcae;\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%stone-800);\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n}\n.mk[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%amber-600);\n}\n.approve[_ngcontent-%COMP%] {\n  padding: 18px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.ap-h[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  color: var(--%NS%forest-600);\n}\n.ap-h[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n}\n.approve[_ngcontent-%COMP%]   .kv[_ngcontent-%COMP%] {\n  grid-template-columns: auto 1fr;\n}\n.full[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: auto;\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  padding: 3px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: 500 12.5px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%stone-900);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.seg[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  font-size: 11px;\n  padding: 0 6px;\n  border-radius: 9px;\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n}\n.group[_ngcontent-%COMP%] {\n  margin-bottom: 14px;\n  overflow: hidden;\n}\n.rules[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.rule[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.rule[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.rule.clickable[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.rule.clickable[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%forest-50);\n}\n.rule.missing[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      var(--%NS%warn-soft),\n      transparent 40%);\n}\n.rule.missing.clickable[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      90deg,\n      #f7e5bd,\n      var(--%NS%forest-50) 40%);\n}\n.r-main[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.r-l[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.r-label[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.need[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  padding: 1px 7px;\n  border-radius: 999px;\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n}\n.optl[_ngcontent-%COMP%] {\n  font-size: 11px;\n  padding: 1px 7px;\n  border-radius: 999px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-500);\n}\n.r-help[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  margin-top: 2px;\n}\n.r-src[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n  flex-wrap: wrap;\n  margin-top: 6px;\n  color: var(--%NS%stone-600);\n}\n.r-src[_ngcontent-%COMP%]   .sep[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-300);\n}\n.r-src[_ngcontent-%COMP%]   .by[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n  margin-left: 6px;\n}\n.demo-src[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n  font-weight: 500;\n}\n.r-val[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  justify-content: flex-end;\n  min-width: 180px;\n  max-width: 320px;\n  flex-wrap: wrap;\n}\n.v[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 600;\n}\n.u[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-3);\n}\n.bool[_ngcontent-%COMP%] {\n  font-weight: 600;\n  padding: 3px 10px;\n  border-radius: 6px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-700);\n}\n.bool.yes[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n}\n.lst[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n.li[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 5px;\n  background: var(--%NS%sand-100);\n  border: 1px solid var(--%NS%border);\n}\n.facs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  align-items: flex-end;\n}\n.fc[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 8px;\n  align-items: center;\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 5px;\n  background: var(--%NS%sand-100);\n  border: 1px solid var(--%NS%border);\n}\n.fc[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%stone-600);\n}\n.fc[_ngcontent-%COMP%]   .num[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.txt[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n  text-align: right;\n}\n.empty[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-3);\n  font-style: italic;\n}\n.chev[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-400);\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ml[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  padding-left: 18px;\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=pack-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PackDetailPage, [{
    type: Component,
    args: [{ selector: "vc-pack-detail", imports: [FormsModule, RouterLink, Icon, Badge, Callout, DataClass, ErrorBox, Loading, Modal, RuleEditor, CreatePack, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/methodology" class="back"><vc-icon name="arrow-left" [size]="14" />All rule packs</a>

    @if (loading()) { <div class="card"><vc-loading [rows]="8" /></div> }
    @else if (error()) { <vc-error title="Couldn't load this rule pack" [message]="error()!" /> }
    @else if (pack(); as p) {
      <header class="hdr">
        <div class="t">
          <div class="eyebrow">Rule pack \xB7 revision {{ p.revision }}</div>
          <div class="row-t"><h1><span class="mono">{{ p.methodology_code }}</span> v{{ p.methodology_version }}</h1><vc-badge [status]="p.status" /></div>
          <p class="sub">{{ p.title }}</p>
          <div class="facts small">
            @if (p.source_url) { <a [href]="p.source_url" target="_blank" rel="noopener"><vc-icon name="external-link" [size]="13" />Published methodology</a> }
            @else { <span class="subtle"><vc-icon name="link" [size]="13" />No source link</span> }
            <span><span class="subtle">Created by</span> {{ p.created_by ?? '\u2014' }} \xB7 {{ p.created_at | day }}</span>
            @if (p.approved_by) { <span><span class="subtle">Approved by</span> {{ p.approved_by }} \xB7 {{ p.approved_at | day: true }}</span> }
          </div>
        </div>
        <div class="actions">
          @if (p.status === 'approved' && canAssign()) {
            <button class="btn btn-secondary" (click)="assignOpen.set(true)"><vc-icon name="briefcase" />Assign to project</button>
          }
          @if (p.status !== 'draft' && auth.can('rules.edit')) {
            <button class="btn btn-secondary" (click)="revisionOpen.set(true)"><vc-icon name="branch" />New revision</button>
          }
          @if (p.status !== 'retired' && auth.can('rules.approve')) {
            <button class="btn btn-ghost" (click)="retireOpen.set(true)"><vc-icon name="archive" />Retire</button>
          }
        </div>
      </header>

      @if (demo()) {
        <vc-callout tone="danger" icon="alert" class="demo">
          <strong>Demonstration values.</strong> Some rules in this pack cite a <em>DEMO</em> source. They are placeholders for trying the platform \u2014
          replace every one with the value from the published methodology, with its section and page, before any real calculation or credit issuance.
        </vc-callout>
      }
      @if (p.status === 'approved') {
        <div class="lock"><vc-icon name="lock" [size]="16" />
          <div><strong>Approved and frozen.</strong> Values can't be changed, so every calculation that used this pack stays reproducible. To change something, create a new revision based on it.</div>
        </div>
      } @else if (p.status === 'retired') {
        <div class="lock retired"><vc-icon name="archive" [size]="16" /><div><strong>Retired.</strong> Kept for the record; it can't be assigned to projects.</div></div>
      }

      <div class="top">
        <section class="card meter">
          <svg viewBox="0 0 120 120" class="ring" aria-hidden="true">
            <circle cx="60" cy="60" r="50" class="bg" />
            <circle cx="60" cy="60" r="50" class="fg" [class.done]="!readiness()?.outstanding?.length"
              [attr.stroke-dasharray]="dash()" transform="rotate(-90 60 60)" />
          </svg>
          <div class="ring-c">
            <div class="pct num">{{ pct() }}<small>%</small></div>
            <div class="small subtle">answered</div>
          </div>
          <div class="m-txt">
            <div class="m-h num"><strong>{{ readiness()?.answered ?? 0 }}</strong> of {{ readiness()?.total ?? 0 }} rules entered</div>
            @if (readiness()?.outstanding?.length) {
              <p class="m-s warn"><vc-icon name="alert" [size]="14" />{{ readiness()!.outstanding.length }} required rule{{ readiness()!.outstanding.length === 1 ? '' : 's' }} still missing</p>
              <div class="miss">
                @for (k of readiness()!.outstanding.slice(0, 6); track k) { <button type="button" class="mk" (click)="editKey(k)">{{ labelOf(k) }}</button> }
                @if (readiness()!.outstanding.length > 6) { <span class="subtle small">+{{ readiness()!.outstanding.length - 6 }} more</span> }
              </div>
            } @else {
              <p class="m-s ok"><vc-icon name="check-circle" [size]="14" />Every required rule is answered</p>
            }
          </div>
        </section>

        <section class="card approve">
          <div class="ap-h"><vc-icon name="shield-check" [size]="18" /><h3>Approval</h3></div>
          @if (p.status === 'approved') {
            <p>Approved by <strong>{{ p.approved_by }}</strong> on {{ p.approved_at | day: true }}. Created by {{ p.created_by }}.</p>
          } @else if (p.status === 'draft') {
            <p class="muted">Four-eyes rule: the person who approves must not have created the pack or entered or changed any of its values. Ask a colleague who wasn't involved to review the sources and approve.</p>
            <dl class="kv small">
              <dt>Created by</dt><dd>{{ p.created_by ?? '\u2014' }}</dd>
              <dt>Values entered by</dt><dd>{{ editors().join(', ') || '\u2014' }}</dd>
            </dl>
            @if (auth.can('rules.approve')) {
              <button class="btn btn-primary full" [disabled]="busy()" (click)="approveOpen.set(true)"><vc-icon name="verified" />Approve pack</button>
            } @else {
              <p class="subtle small">Only methodology owners can approve rule packs.</p>
            }
          } @else { <p class="muted">This pack is retired.</p> }
        </section>
      </div>

      <div class="filters">
        <div class="seg">
          <button type="button" [class.on]="show() === 'all'" (click)="show.set('all')">All rules</button>
          <button type="button" [class.on]="show() === 'missing'" (click)="show.set('missing')">Missing <span class="c">{{ readiness()?.outstanding?.length ?? 0 }}</span></button>
          <button type="button" [class.on]="show() === 'entered'" (click)="show.set('entered')">Entered</button>
        </div>
      </div>

      @for (g of groups(); track g.key) {
        @if (g.rows.length) {
          <section class="card group">
            <div class="card-head"><h3>{{ g.label }}</h3><span class="subtle small num">{{ g.answered }} / {{ g.total }}</span></div>
            <ul class="rules">
              @for (r of g.rows; track r.def.key) {
                <li class="rule" [class.missing]="r.missing" [class.clickable]="editable()" (click)="edit(r.def)">
                  <div class="r-main">
                    <div class="r-l">
                      <span class="r-label">{{ r.def.label }}</span>
                      @if (r.missing) { <span class="need">Required</span> }
                      @else if (!r.def.required && !r.def.required_if && !r.rule) { <span class="optl">Optional</span> }
                    </div>
                    <p class="r-help">{{ r.def.help }}</p>
                    @if (r.rule) {
                      <div class="r-src small">
                        <vc-icon name="book" [size]="12" />
                        <span [class.demo-src]="isDemoSrc(r.rule)">{{ r.rule.source_document }}</span>
                        @if (r.rule.source_section) { <span class="sep">\xB7</span><span>{{ r.rule.source_section }}</span> }
                        @if (r.rule.source_page) { <span class="sep">\xB7</span><span>p. {{ r.rule.source_page }}</span> }
                        <span class="by">entered by {{ r.rule.entered_by ?? '\u2014' }}@if (r.rule.last_modified_by && r.rule.last_modified_by !== r.rule.entered_by) {, changed by {{ r.rule.last_modified_by }}}</span>
                      </div>
                    }
                  </div>
                  <div class="r-val">
                    @if (r.rule) {
                      @switch (r.def.kind) {
                        @case ('boolean') { <span class="bool" [class.yes]="r.rule.value === true">{{ r.rule.value ? 'Yes' : 'No' }}</span> }
                        @case ('list') { <div class="lst">@for (v of asList(r.rule.value); track v) { <span class="li">{{ human(v) }}</span> }</div> }
                        @case ('text') { <span class="txt">{{ r.rule.value }}</span> }
                        @case ('factors') {
                          <div class="facs">@for (f of factors(r.rule.value); track f.key) { <span class="fc"><code>{{ f.key }}</code><span class="num">{{ f.value }}</span></span> }<span class="u">tCO\u2082e per unit</span></div>
                        }
                        @default { <span class="v num">{{ fmt(r.rule.value, r.def.kind, '') }}</span>@if (r.def.unit) { <span class="u">{{ r.def.unit }}</span> } }
                      }
                      <vc-dc cls="RECORDED" />
                    } @else {
                      <span class="empty">{{ editable() ? 'Enter value' : 'Not entered' }}</span>
                    }
                  </div>
                  @if (editable()) { <vc-icon name="chevron-right" [size]="15" class="chev" /> }
                </li>
              }
            </ul>
          </section>
        }
      }

      <vc-rule-editor [(open)]="editorOpen" [packId]="p.id" [def]="editing()" [rule]="editingRule()" [allDefs]="allDefs()" [defaultDoc]="commonDoc()" (saved)="onSaved($event)" />

      <!-- approve -->
      <vc-modal [(open)]="approveOpen" title="Approve this rule pack?" width="540px">
        <p>Once approved, the pack is frozen: no value can change, and projects can use it for calculations. Please confirm you have checked each value against the published methodology.</p>
        @if (demo()) { <vc-callout tone="warn" icon="alert" class="mt">This pack still cites DEMO sources. Approving it is fine for trying the platform, not for real credits.</vc-callout> }
        @if (approveProblem(); as ap) {
          <vc-callout [tone]="ap.code === 'SELF_APPROVAL_REJECTED' ? 'warn' : 'danger'" [icon]="ap.code === 'SELF_APPROVAL_REJECTED' ? 'users' : 'alert'" class="mt">
            @if (ap.code === 'SELF_APPROVAL_REJECTED') {
              <strong>You can't approve this pack.</strong> You created it or entered or changed at least one of its values. The four-eyes rule needs someone else to check it \u2014 ask another methodology owner to approve.
            } @else if (ap.code === 'RULE_MISSING') {
              <strong>{{ ap.message }}</strong>
              <ul class="ml">@for (l of ap.labels; track l) { <li>{{ l }}</li> }</ul>
            } @else { {{ ap.message }} @if (ap.labels.length) { <ul class="ml">@for (l of ap.labels; track l) { <li>{{ l }}</li> }</ul> } }
          </vc-callout>
        }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="approveOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="busy()" (click)="approve()"><vc-icon name="verified" />{{ busy() ? 'Approving\u2026' : 'Approve and freeze' }}</button>
        </div>
      </vc-modal>

      <!-- retire -->
      <vc-modal [(open)]="retireOpen" title="Retire this rule pack?" width="480px">
        <p>A retired pack is kept for the record but can't be edited or assigned. Projects using it must be moved to another pack first. This can't be undone.</p>
        @if (retireError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ retireError() }}</vc-callout> }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="retireOpen.set(false)">Cancel</button>
          <button class="btn btn-danger" [disabled]="busy()" (click)="retire()">Retire pack</button>
        </div>
      </vc-modal>

      <!-- assign -->
      <vc-modal [(open)]="assignOpen" title="Assign to a project" width="520px"
        subtitle="The project's calculations, sampling checks and quality rules will use this pack's values.">
        <div class="field">
          <label for="as-p">Project</label>
          <select id="as-p" class="input" [ngModel]="assignTo()" (ngModelChange)="assignTo.set($event)">
            <option value="">Choose a project\u2026</option>
            @for (pr of ctx.projects(); track pr.id) {
              <option [value]="pr.id" [disabled]="pr.methodology_code !== p.methodology_code || pr.methodology_version !== p.methodology_version">
                {{ pr.code }} \xB7 {{ pr.name }} ({{ pr.methodology_code }} v{{ pr.methodology_version }})
              </option>
            }
          </select>
          <span class="hint">Only projects following {{ p.methodology_code }} v{{ p.methodology_version }} can use this pack.</span>
        </div>
        @if (assignError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ assignError() }}</vc-callout> }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="assignOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!assignTo() || busy()" (click)="assign()">Assign pack</button>
        </div>
      </vc-modal>

      <vc-create-pack [(open)]="revisionOpen" [packs]="[p]" [from]="p" (created)="onRevision($event)" />
    }
  `, styles: ["/* angular:styles/component:scss;3e896a61d65e7727;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\methodology\\pack-detail.page.ts */\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n  margin-bottom: 14px;\n}\n.back:hover {\n  color: var(--forest-700);\n  text-decoration: none;\n}\n.hdr {\n  display: flex;\n  align-items: flex-end;\n  gap: 16px;\n  margin-bottom: 18px;\n  flex-wrap: wrap;\n}\n.t {\n  flex: 1;\n  min-width: 280px;\n}\n.eyebrow {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--forest-500);\n  margin-bottom: 6px;\n}\n.row-t {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.sub {\n  margin-top: 4px;\n  color: var(--text-2);\n}\n.facts {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n  margin-top: 10px;\n  color: var(--stone-700);\n}\n.facts a,\n.facts > span {\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n}\n.actions {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.demo {\n  margin-bottom: 14px;\n}\n.lock {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n  padding: 12px 16px;\n  border-radius: var(--radius);\n  background: var(--forest-800);\n  color: #e6efe9;\n  margin-bottom: 16px;\n  font-size: 13.5px;\n}\n.lock vc-icon {\n  color: var(--forest-300);\n  margin-top: 2px;\n}\n.lock.retired {\n  background: var(--stone-700);\n}\n.top {\n  display: grid;\n  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);\n  gap: 16px;\n  margin-bottom: 18px;\n}\n@media (max-width: 1000px) {\n  .top {\n    grid-template-columns: 1fr;\n  }\n}\n.meter {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  padding: 22px 24px;\n}\n.ring {\n  width: 128px;\n  height: 128px;\n  flex: none;\n}\n.ring .bg {\n  fill: none;\n  stroke: var(--sand-200);\n  stroke-width: 10;\n}\n.ring .fg {\n  fill: none;\n  stroke: var(--amber-600);\n  stroke-width: 10;\n  stroke-linecap: round;\n  transition: stroke-dasharray 0.6s ease;\n}\n.ring .fg.done {\n  stroke: var(--forest-500);\n}\n.ring-c {\n  position: absolute;\n  left: 24px;\n  width: 128px;\n  text-align: center;\n}\n.pct {\n  font-size: 30px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  line-height: 1;\n}\n.pct small {\n  font-size: 14px;\n  color: var(--text-3);\n}\n.m-txt {\n  flex: 1;\n  min-width: 0;\n}\n.m-h {\n  font-size: 16px;\n}\n.m-s {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  margin-top: 6px;\n  font-size: 13px;\n}\n.m-s.warn {\n  color: var(--amber-600);\n}\n.m-s.ok {\n  color: var(--forest-600);\n}\n.miss {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  margin-top: 10px;\n}\n.mk {\n  height: 26px;\n  padding: 0 9px;\n  border-radius: 6px;\n  border: 1px solid #f1dcae;\n  background: var(--warn-soft);\n  color: var(--stone-800);\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n}\n.mk:hover {\n  border-color: var(--amber-600);\n}\n.approve {\n  padding: 18px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.ap-h {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  color: var(--forest-600);\n}\n.ap-h h3 {\n  color: var(--stone-900);\n}\n.approve .kv {\n  grid-template-columns: auto 1fr;\n}\n.full {\n  width: 100%;\n  margin-top: auto;\n}\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.seg {\n  display: inline-flex;\n  padding: 3px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  gap: 2px;\n}\n.seg button {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: 500 12.5px var(--font);\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--surface);\n  color: var(--stone-900);\n  box-shadow: var(--shadow-sm);\n}\n.seg .c {\n  font-size: 11px;\n  padding: 0 6px;\n  border-radius: 9px;\n  background: var(--amber-100);\n  color: var(--amber-600);\n}\n.group {\n  margin-bottom: 14px;\n  overflow: hidden;\n}\n.rules {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.rule {\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.rule:last-child {\n  border-bottom: 0;\n}\n.rule.clickable {\n  cursor: pointer;\n}\n.rule.clickable:hover {\n  background: var(--forest-50);\n}\n.rule.missing {\n  background:\n    linear-gradient(\n      90deg,\n      var(--warn-soft),\n      transparent 40%);\n}\n.rule.missing.clickable:hover {\n  background:\n    linear-gradient(\n      90deg,\n      #f7e5bd,\n      var(--forest-50) 40%);\n}\n.r-main {\n  flex: 1;\n  min-width: 0;\n}\n.r-l {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.r-label {\n  font-weight: 500;\n}\n.need {\n  font-size: 11px;\n  font-weight: 600;\n  padding: 1px 7px;\n  border-radius: 999px;\n  background: var(--amber-100);\n  color: var(--amber-600);\n}\n.optl {\n  font-size: 11px;\n  padding: 1px 7px;\n  border-radius: 999px;\n  background: var(--stone-100);\n  color: var(--stone-500);\n}\n.r-help {\n  font-size: 12.5px;\n  color: var(--text-2);\n  margin-top: 2px;\n}\n.r-src {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n  flex-wrap: wrap;\n  margin-top: 6px;\n  color: var(--stone-600);\n}\n.r-src .sep {\n  color: var(--stone-300);\n}\n.r-src .by {\n  color: var(--text-3);\n  margin-left: 6px;\n}\n.demo-src {\n  color: var(--red-600);\n  font-weight: 500;\n}\n.r-val {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  justify-content: flex-end;\n  min-width: 180px;\n  max-width: 320px;\n  flex-wrap: wrap;\n}\n.v {\n  font-size: 16px;\n  font-weight: 600;\n}\n.u {\n  font-size: 12.5px;\n  color: var(--text-3);\n}\n.bool {\n  font-weight: 600;\n  padding: 3px 10px;\n  border-radius: 6px;\n  background: var(--stone-100);\n  color: var(--stone-700);\n}\n.bool.yes {\n  background: var(--forest-100);\n  color: var(--forest-700);\n}\n.lst {\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n}\n.li {\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 5px;\n  background: var(--sand-100);\n  border: 1px solid var(--border);\n}\n.facs {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  align-items: flex-end;\n}\n.fc {\n  display: inline-flex;\n  gap: 8px;\n  align-items: center;\n  font-size: 12px;\n  padding: 2px 8px;\n  border-radius: 5px;\n  background: var(--sand-100);\n  border: 1px solid var(--border);\n}\n.fc code {\n  font-size: 11.5px;\n  color: var(--stone-600);\n}\n.fc .num {\n  font-weight: 600;\n}\n.txt {\n  font-size: 12.5px;\n  color: var(--stone-700);\n  text-align: right;\n}\n.empty {\n  font-size: 12.5px;\n  color: var(--text-3);\n  font-style: italic;\n}\n.chev {\n  color: var(--stone-400);\n}\n.mt {\n  margin-top: 14px;\n}\n.ml {\n  margin: 6px 0 0;\n  padding-left: 18px;\n}\n.ft {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=pack-detail.page.css.map */\n"] }]
  }], () => [], { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PackDetailPage, { className: "PackDetailPage", filePath: "src/app/features/methodology/pack-detail.page.ts", lineNumber: 298 });
})();

// src/app/features/methodology/packs.page.ts
var _forTrack03 = ($index, $item) => $item.id;
function PacksPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function PacksPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 10);
    \u0275\u0275text(2, "New rule pack");
    \u0275\u0275elementEnd();
  }
}
function PacksPage_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1, "Uses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 17);
    \u0275\u0275listener("click", function PacksPage_Conditional_2_Conditional_12_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r3);
      const pp_r4 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.open(pp_r4.pack.id));
    });
    \u0275\u0275element(3, "vc-icon", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pp_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(pp_r4.pack.label);
  }
}
function PacksPage_Conditional_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-badge", 15);
    \u0275\u0275text(1, "No approved pack assigned");
    \u0275\u0275elementEnd();
  }
}
function PacksPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "span", 11);
    \u0275\u0275element(2, "vc-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 13)(4, "div", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " follows ");
    \u0275\u0275elementStart(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, PacksPage_Conditional_2_Conditional_12_Template, 5, 2)(13, PacksPage_Conditional_2_Conditional_13_Template, 2, 0, "vc-badge", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Current project \xB7 ", ctx_r1.ctx.current()?.code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.ctx.current()?.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r1.ctx.current()?.methodology_code, " v", ctx_r1.ctx.current()?.methodology_version);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.pack ? 12 : 13);
  }
}
function PacksPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function PacksPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "vc-error", 19)(2, "button", 17);
    \u0275\u0275listener("click", function PacksPage_Conditional_5_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r5);
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
function PacksPage_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function PacksPage_Conditional_6_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.createOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 10);
    \u0275\u0275text(2, "New rule pack");
    \u0275\u0275elementEnd();
  }
}
function PacksPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 6);
    \u0275\u0275conditionalCreate(1, PacksPage_Conditional_6_Conditional_1_Template, 3, 0, "button", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.auth.can("rules.edit") ? 1 : -1);
  }
}
function PacksPage_Conditional_7_For_2_Conditional_14_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r9 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", r_r9.outstanding.length, " required outstanding");
  }
}
function PacksPage_Conditional_7_For_2_Conditional_14_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1, "All required answered");
    \u0275\u0275elementEnd();
  }
}
function PacksPage_Conditional_7_For_2_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "span", 38)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PacksPage_Conditional_7_For_2_Conditional_14_Conditional_5_Template, 2, 1, "span", 39)(6, PacksPage_Conditional_7_For_2_Conditional_14_Conditional_6_Template, 2, 0, "span", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "vc-progress", 41);
  }
  if (rf & 2) {
    const r_r9 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r9.answered);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" / ", r_r9.total, " answered");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r9.outstanding.length ? 5 : 6);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", r_r9.answered)("max", r_r9.total)("tone", r_r9.outstanding.length ? "warn" : "ok");
  }
}
function PacksPage_Conditional_7_For_2_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", p_r8.outstanding_count ?? "\u2014", " required outstanding");
  }
}
function PacksPage_Conditional_7_For_2_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 34);
    \u0275\u0275text(2, "Approved by");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", p_r8.approved_by, " \xB7 ", \u0275\u0275pipeBind1(4, 2, p_r8.approved_at));
  }
}
function PacksPage_Conditional_7_For_2_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, p_r8.created_at));
  }
}
function PacksPage_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 23);
    \u0275\u0275listener("click", function PacksPage_Conditional_7_For_2_Template_li_click_0_listener() {
      const p_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.open(p_r8.id));
    })("keydown.enter", function PacksPage_Conditional_7_For_2_Template_li_keydown_enter_0_listener() {
      const p_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.open(p_r8.id));
    });
    \u0275\u0275elementStart(1, "div", 24)(2, "span", 25);
    \u0275\u0275element(3, "vc-icon", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "div", 27)(6, "span", 28);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementStart(9, "span", 29);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 30);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 31);
    \u0275\u0275conditionalCreate(14, PacksPage_Conditional_7_For_2_Conditional_14_Template, 8, 6)(15, PacksPage_Conditional_7_For_2_Conditional_15_Template, 2, 1, "div", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 33)(17, "div")(18, "span", 34);
    \u0275\u0275text(19, "Created by");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(21, PacksPage_Conditional_7_For_2_Conditional_21_Template, 5, 4, "div")(22, PacksPage_Conditional_7_For_2_Conditional_22_Template, 3, 3, "div", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "vc-badge", 35)(24, "vc-icon", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_18_0;
    const p_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("st " + p_r8.status);
    \u0275\u0275advance();
    \u0275\u0275property("name", p_r8.status === "approved" ? "lock" : p_r8.status === "retired" ? "archive" : "pencil")("size", 15);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r8.methodology_code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" v", p_r8.methodology_version, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("rev ", p_r8.revision);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r8.title);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_18_0 = ctx_r1.ready()[p_r8.id]) ? 14 : 15, tmp_18_0);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", p_r8.created_by ?? "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r8.approved_by ? 21 : 22);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r8.status);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function PacksPage_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 7);
    \u0275\u0275repeaterCreate(1, PacksPage_Conditional_7_For_2_Template, 25, 13, "li", 22, _forTrack03);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.sorted());
  }
}
var PacksPage = class _PacksPage {
  api = inject(ApiService);
  router = inject(Router);
  toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  packs = signal(
    [],
    ...ngDevMode ? [{ debugName: "packs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ready = signal(
    {},
    ...ngDevMode ? [{ debugName: "ready" }] : (
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
  createOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "createOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projectRulePackId = signal(
    void 0,
    ...ngDevMode ? [{ debugName: "projectRulePackId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sorted = computed(
    () => {
      const rank = { draft: 0, approved: 1, retired: 2 };
      return [...this.packs()].sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3) || b.created_at.localeCompare(a.created_at));
    },
    ...ngDevMode ? [{ debugName: "sorted" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projectPack = computed(
    () => {
      const id = this.projectRulePackId();
      if (id === void 0 || !this.ctx.current())
        return null;
      return { pack: this.packs().find((p) => p.id === id) ?? null };
    },
    ...ngDevMode ? [{ debugName: "projectPack" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.load();
    const pid = this.ctx.currentId();
    if (pid) {
      this.api.get(`/projects/${pid}`).subscribe({
        next: (p) => this.projectRulePackId.set(p.rule_pack_id),
        error: () => {
        }
      });
    }
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get("/rule-packs").subscribe({
      next: (r) => {
        this.packs.set(r);
        this.loading.set(false);
        if (r.length) {
          forkJoin(r.map((p) => this.api.get(`/rule-packs/${p.id}/readiness`).pipe(catchError(() => of(null))))).subscribe((list) => {
            const m = {};
            list.forEach((x, i) => {
              if (x)
                m[r[i].id] = x;
            });
            this.ready.set(m);
          });
        }
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  open(id) {
    this.router.navigate(["/app/methodology", id]);
  }
  onCreated(p) {
    this.toast.success(`${p.label} created`, "Enter each value with its source, then ask a colleague to approve.");
    this.open(p.id);
  }
  static \u0275fac = function PacksPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PacksPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PacksPage, selectors: [["vc-packs-page"]], decls: 9, vars: 5, consts: [["title", "Methodology rules", "eyebrow", "Measurement \xB7 Gate 0", "subtitle", "Nothing is calculated until the methodology's rules are entered with their sources and approved by a second person. Values are never assumed."], ["actions", "", 1, "btn", "btn-primary"], [1, "assigned", "card"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "scale", "title", "No rule packs yet", "text", "Create a rule pack for the methodology your project follows, then enter each value from the published document."], [1, "packs"], [3, "openChange", "created", "open", "packs"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [1, "ic"], ["name", "briefcase", 3, "size"], [1, "grow"], [1, "small", "subtle"], ["status", "warning"], [1, "muted", "small"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "lock", 3, "size"], ["title", "Couldn't load rule packs", 3, "message"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], ["tabindex", "0", 1, "pack"], ["tabindex", "0", 1, "pack", 3, "click", "keydown.enter"], [1, "id"], [1, "st"], [3, "name", "size"], [1, "lbl"], [1, "mono"], [1, "rev"], [1, "ttl"], [1, "prog"], [1, "subtle", "small"], [1, "who", "small"], [1, "subtle"], [3, "status"], ["name", "chevron-right", 1, "chev", 3, "size"], [1, "pl"], [1, "num"], [1, "out"], [1, "okk"], [3, "value", "max", "tone"]], template: function PacksPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, PacksPage_Conditional_1_Template, 3, 0, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(2, PacksPage_Conditional_2_Template, 14, 6, "div", 2);
      \u0275\u0275elementStart(3, "section", 3);
      \u0275\u0275conditionalCreate(4, PacksPage_Conditional_4_Template, 1, 1, "vc-loading", 4)(5, PacksPage_Conditional_5_Template, 4, 1, "div", 5)(6, PacksPage_Conditional_6_Template, 2, 1, "vc-empty", 6)(7, PacksPage_Conditional_7_Template, 3, 0, "ul", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "vc-create-pack", 8);
      \u0275\u0275twoWayListener("openChange", function PacksPage_Template_vc_create_pack_openChange_8_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275listener("created", function PacksPage_Template_vc_create_pack_created_8_listener($event) {
        return ctx.onCreated($event);
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.auth.can("rules.edit") ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.projectPack()) ? 2 : -1, tmp_1_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 4 : ctx.error() ? 5 : !ctx.packs().length ? 6 : 7);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275property("packs", ctx.packs());
    }
  }, dependencies: [PageHeader, Loading, ErrorBox, Empty, Badge, Progress, Icon, CreatePack, DayPipe], styles: ["\n.assigned[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  margin-bottom: 16px;\n}\n.assigned[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 9px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-600);\n}\n.grow[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.packs[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.pack[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(260px, 1.4fr) minmax(200px, 1fr) minmax(170px, 0.8fr) 90px 20px;\n  gap: 20px;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n  cursor: pointer;\n}\n.pack[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.pack[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%forest-50);\n}\n.pack[_ngcontent-%COMP%]:focus-visible {\n  outline: none;\n  box-shadow: inset var(--%NS%focus);\n}\n@media (max-width: 1000px) {\n  .pack[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n  .who[_ngcontent-%COMP%], \n   .chev[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.id[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  min-width: 0;\n}\n.st[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  flex: none;\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-600);\n}\n.st.approved[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n}\n.st.draft[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n}\n.lbl[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.rev[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--%NS%text-3);\n  font-size: 12.5px;\n  margin-left: 2px;\n}\n.ttl[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-top: 1px;\n}\n.prog[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.pl[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  font-size: 12.5px;\n}\n.out[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n.okk[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n}\n.who[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  color: var(--%NS%stone-700);\n}\n.chev[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-400);\n}\n/*# sourceMappingURL=packs.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PacksPage, [{
    type: Component,
    args: [{ selector: "vc-packs-page", imports: [PageHeader, Loading, ErrorBox, Empty, Badge, Progress, Icon, CreatePack, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Methodology rules" eyebrow="Measurement \xB7 Gate 0"
      subtitle="Nothing is calculated until the methodology's rules are entered with their sources and approved by a second person. Values are never assumed.">
      @if (auth.can('rules.edit')) {
        <button actions class="btn btn-primary" (click)="createOpen.set(true)"><vc-icon name="plus" />New rule pack</button>
      }
    </vc-page-header>

    @if (projectPack(); as pp) {
      <div class="assigned card">
        <span class="ic"><vc-icon name="briefcase" [size]="16" /></span>
        <div class="grow">
          <div class="small subtle">Current project \xB7 {{ ctx.current()?.code }}</div>
          <div><strong>{{ ctx.current()?.name }}</strong> follows <strong>{{ ctx.current()?.methodology_code }} v{{ ctx.current()?.methodology_version }}</strong></div>
        </div>
        @if (pp.pack) {
          <span class="muted small">Uses</span>
          <button class="btn btn-secondary btn-sm" (click)="open(pp.pack.id)"><vc-icon name="lock" [size]="13" />{{ pp.pack.label }}</button>
        } @else {
          <vc-badge status="warning">No approved pack assigned</vc-badge>
        }
      </div>
    }

    <section class="card">
      @if (loading()) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load rule packs" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div> }
      @else if (!packs().length) {
        <vc-empty icon="scale" title="No rule packs yet"
          text="Create a rule pack for the methodology your project follows, then enter each value from the published document.">
          @if (auth.can('rules.edit')) { <button class="btn btn-primary" (click)="createOpen.set(true)"><vc-icon name="plus" />New rule pack</button> }
        </vc-empty>
      } @else {
        <ul class="packs">
          @for (p of sorted(); track p.id) {
            <li class="pack" (click)="open(p.id)" tabindex="0" (keydown.enter)="open(p.id)">
              <div class="id">
                <span class="st" [class]="'st ' + p.status"><vc-icon [name]="p.status === 'approved' ? 'lock' : p.status === 'retired' ? 'archive' : 'pencil'" [size]="15" /></span>
                <div>
                  <div class="lbl"><span class="mono">{{ p.methodology_code }}</span> v{{ p.methodology_version }} <span class="rev">rev {{ p.revision }}</span></div>
                  <div class="ttl">{{ p.title }}</div>
                </div>
              </div>
              <div class="prog">
                @if (ready()[p.id]; as r) {
                  <div class="pl"><span class="num"><strong>{{ r.answered }}</strong> / {{ r.total }} answered</span>
                    @if (r.outstanding.length) { <span class="out">{{ r.outstanding.length }} required outstanding</span> } @else { <span class="okk">All required answered</span> }
                  </div>
                  <vc-progress [value]="r.answered" [max]="r.total" [tone]="r.outstanding.length ? 'warn' : 'ok'" />
                } @else { <div class="subtle small">{{ p.outstanding_count ?? '\u2014' }} required outstanding</div> }
              </div>
              <div class="who small">
                <div><span class="subtle">Created by</span> {{ p.created_by ?? '\u2014' }}</div>
                @if (p.approved_by) { <div><span class="subtle">Approved by</span> {{ p.approved_by }} \xB7 {{ p.approved_at | day }}</div> }
                @else { <div class="subtle">{{ p.created_at | day }}</div> }
              </div>
              <vc-badge [status]="p.status" />
              <vc-icon name="chevron-right" [size]="16" class="chev" />
            </li>
          }
        </ul>
      }
    </section>

    <vc-create-pack [(open)]="createOpen" [packs]="packs()" (created)="onCreated($event)" />
  `, styles: ["/* angular:styles/component:scss;bfc0885acd013fa0;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\methodology\\packs.page.ts */\n.assigned {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  margin-bottom: 16px;\n}\n.assigned .ic {\n  display: grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 9px;\n  background: var(--forest-50);\n  color: var(--forest-600);\n}\n.grow {\n  flex: 1;\n  min-width: 0;\n}\n.packs {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.pack {\n  display: grid;\n  grid-template-columns: minmax(260px, 1.4fr) minmax(200px, 1fr) minmax(170px, 0.8fr) 90px 20px;\n  gap: 20px;\n  align-items: center;\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--stone-100);\n  cursor: pointer;\n}\n.pack:last-child {\n  border-bottom: 0;\n}\n.pack:hover {\n  background: var(--forest-50);\n}\n.pack:focus-visible {\n  outline: none;\n  box-shadow: inset var(--focus);\n}\n@media (max-width: 1000px) {\n  .pack {\n    grid-template-columns: 1fr 1fr;\n  }\n  .who,\n  .chev {\n    display: none;\n  }\n}\n.id {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  min-width: 0;\n}\n.st {\n  display: grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  flex: none;\n  background: var(--sand-200);\n  color: var(--stone-600);\n}\n.st.approved {\n  background: var(--forest-100);\n  color: var(--forest-700);\n}\n.st.draft {\n  background: var(--amber-100);\n  color: var(--amber-600);\n}\n.lbl {\n  font-weight: 600;\n}\n.rev {\n  font-weight: 500;\n  color: var(--text-3);\n  font-size: 12.5px;\n  margin-left: 2px;\n}\n.ttl {\n  font-size: 13px;\n  color: var(--text-2);\n  margin-top: 1px;\n}\n.prog {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.pl {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  font-size: 12.5px;\n}\n.out {\n  color: var(--amber-600);\n}\n.okk {\n  color: var(--forest-600);\n}\n.who {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  color: var(--stone-700);\n}\n.chev {\n  color: var(--stone-400);\n}\n/*# sourceMappingURL=packs.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PacksPage, { className: "PacksPage", filePath: "src/app/features/methodology/packs.page.ts", lineNumber: 106 });
})();

// src/app/features/methodology/methodology.routes.ts
var methodology_routes_default = [
  { path: "", component: PacksPage, title: "Methodology rules \xB7 Varsapradaya Carbon" },
  { path: ":id", component: PackDetailPage, title: "Rule pack \xB7 Varsapradaya Carbon" }
];
export {
  methodology_routes_default as default
};
//# debugId=17e82715-16f5-5bac-a7b0-7292a7dac423
//# sourceMappingURL=chunk-HKXVWJEJ.js.map
