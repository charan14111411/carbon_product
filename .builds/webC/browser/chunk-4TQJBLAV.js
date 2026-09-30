import {
  BalanceBar,
  CREDIT_TYPES,
  STATE_META,
  Steps,
  TYPE_COLOR,
  TYPE_HINT,
  TYPE_ICON,
  TYPE_LABEL,
  apiFieldErrors
} from "./chunk-W6OT2EF5.js";
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
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  NumPipe
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
  KIT,
  Loading,
  Modal,
  PageHeader,
  Stat
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
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

// src/app/features/credits/issue-drawer.ts
function IssueDrawer_Conditional_1_For_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function IssueDrawer_Conditional_1_For_21_Template_button_click_0_listener() {
      const r_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.registry = r_r3);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r3.registry === r_r3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r3);
  }
}
function IssueDrawer_Conditional_1_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 21);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function IssueDrawer_Conditional_1_Conditional_24_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.registry, $event) || (ctx_r3.registry = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.registry);
    \u0275\u0275control();
  }
}
function IssueDrawer_Conditional_1_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.err("registry_name"));
  }
}
function IssueDrawer_Conditional_1_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.err("registry_project_ref"));
  }
}
function IssueDrawer_Conditional_1_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.err("serial_start") || ctx_r3.err("serial_end"));
  }
}
function IssueDrawer_Conditional_1_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 20);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r3.error());
  }
}
function IssueDrawer_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "vc-callout", 5);
    \u0275\u0275text(2, " Enter the details exactly as they appear on the registry's issuance record. The serial range is shown to buyers on their retirement records. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 6)(4, "div")(5, "span");
    \u0275\u0275text(6, "Reductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong", 7);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div")(11, "span");
    \u0275\u0275text(12, "Removals");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "strong", 7);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "num");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 8)(17, "label");
    \u0275\u0275text(18, "Registry");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 9);
    \u0275\u0275repeaterCreate(20, IssueDrawer_Conditional_1_For_21_Template, 2, 3, "button", 10, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(22, "button", 11);
    \u0275\u0275listener("click", function IssueDrawer_Conditional_1_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      ctx_r3.registry = "";
      return \u0275\u0275resetView(ctx_r3.other = true);
    });
    \u0275\u0275text(23, "Other");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(24, IssueDrawer_Conditional_1_Conditional_24_Template, 1, 1, "input", 12);
    \u0275\u0275conditionalCreate(25, IssueDrawer_Conditional_1_Conditional_25_Template, 2, 1, "span", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 8)(27, "label");
    \u0275\u0275text(28, "Registry project reference");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "input", 14);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function IssueDrawer_Conditional_1_Template_input_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.projectRef, $event) || (ctx_r3.projectRef = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(30, IssueDrawer_Conditional_1_Conditional_30_Template, 2, 1, "span", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 15)(32, "div", 8)(33, "label");
    \u0275\u0275text(34, "First serial");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "input", 16);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function IssueDrawer_Conditional_1_Template_input_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.serialStart, $event) || (ctx_r3.serialStart = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 8)(37, "label");
    \u0275\u0275text(38, "Last serial");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "input", 17);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function IssueDrawer_Conditional_1_Template_input_ngModelChange_39_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.serialEnd, $event) || (ctx_r3.serialEnd = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(40, IssueDrawer_Conditional_1_Conditional_40_Template, 2, 1, "span", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 8)(42, "label");
    \u0275\u0275text(43, "Issued on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "input", 19);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function IssueDrawer_Conditional_1_Template_input_ngModelChange_44_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.issuedOn, $event) || (ctx_r3.issuedOn = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(45, IssueDrawer_Conditional_1_Conditional_45_Template, 1, 1, "vc-error", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r6 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(9, 14, b_r6.reductions_t, 2), " t");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(15, 17, b_r6.removals_t, 2), " t");
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.registries);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", !ctx_r3.registries.includes(ctx_r3.registry));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r3.registries.includes(ctx_r3.registry) ? 24 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.err("registry_name") ? 25 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.projectRef);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.err("registry_project_ref") ? 30 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.serialStart);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.serialEnd);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.err("serial_start") || ctx_r3.err("serial_end") ? 40 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.issuedOn);
    \u0275\u0275property("max", ctx_r3.today);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.error() ? 45 : -1);
  }
}
var REGISTRIES = ["Verra", "Gold Standard"];
var IssueDrawer = class _IssueDrawer {
  api = inject(ApiService);
  toast = inject(ToastService);
  batch = input(
    null,
    ...ngDevMode ? [{ debugName: "batch" }] : (
      /* istanbul ignore next */
      []
    )
  );
  done = output();
  closed = output();
  registries = REGISTRIES;
  today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  registry = "Verra";
  other = false;
  projectRef = "";
  serialStart = "";
  serialEnd = "";
  issuedOn = this.today;
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
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
  fieldErrors = signal(
    {},
    ...ngDevMode ? [{ debugName: "fieldErrors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (this.batch()) {
        this.registry = "Verra";
        this.projectRef = "";
        this.serialStart = "";
        this.serialEnd = "";
        this.issuedOn = this.today;
        this.error.set(null);
        this.fieldErrors.set({});
      }
    });
  }
  valid() {
    return this.registry.trim().length >= 2 && this.projectRef.trim() && this.serialStart.trim() && this.serialEnd.trim() && this.issuedOn;
  }
  err(k) {
    return this.fieldErrors()[k] ?? "";
  }
  submit() {
    const b = this.batch();
    if (!b)
      return;
    this.busy.set(true);
    this.error.set(null);
    this.api.post(`/credit-batches/${b.id}/issue`, {
      registry_name: this.registry.trim(),
      registry_project_ref: this.projectRef.trim(),
      serial_start: this.serialStart.trim(),
      serial_end: this.serialEnd.trim(),
      issued_on: this.issuedOn
    }).subscribe({
      next: (nb) => {
        this.busy.set(false);
        this.toast.success(`${nb.code} issued`, `Recorded on ${nb.registry_name}. Credits can now be sold.`);
        this.done.emit(nb);
      },
      error: (e) => {
        this.busy.set(false);
        const fe = apiFieldErrors(e);
        this.fieldErrors.set(fe);
        this.error.set(e.message);
      }
    });
  }
  static \u0275fac = function IssueDrawer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IssueDrawer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IssueDrawer, selectors: [["vcx-issue-drawer"]], inputs: { batch: [1, "batch"] }, outputs: { done: "done", closed: "closed" }, decls: 7, vars: 5, consts: [["width", "480px", "title", "Record registry issuance", 3, "closed", "open", "drawer", "subtitle"], [1, "stack"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["tone", "info", "icon", "landmark"], [1, "sum"], [1, "num"], [1, "field"], [1, "reg"], ["type", "button", 1, "opt", 3, "on"], ["type", "button", 1, "opt", 3, "click"], ["name", "regname", "placeholder", "Registry name, e.g. Isometric", "maxlength", "40", 1, "input", 3, "ngModel"], [1, "error"], ["placeholder", "e.g. VCS-4821", "maxlength", "80", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "form-grid"], ["placeholder", "\u2026-00001", "maxlength", "120", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["placeholder", "\u2026-01250", "maxlength", "120", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "error", "span-2"], ["type", "date", 1, "input", 3, "ngModelChange", "ngModel", "max"], ["title", "Couldn't record issuance", 3, "message"], ["name", "regname", "placeholder", "Registry name, e.g. Isometric", "maxlength", "40", 1, "input", 3, "ngModelChange", "ngModel"]], template: function IssueDrawer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275listener("closed", function IssueDrawer_Template_vc_modal_closed_0_listener() {
        return ctx.closed.emit();
      });
      \u0275\u0275conditionalCreate(1, IssueDrawer_Conditional_1_Template, 46, 20, "div", 1);
      \u0275\u0275elementContainerStart(2, 2);
      \u0275\u0275elementStart(3, "button", 3);
      \u0275\u0275listener("click", function IssueDrawer_Template_button_click_3_listener() {
        return ctx.closed.emit();
      });
      \u0275\u0275text(4, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "button", 4);
      \u0275\u0275listener("click", function IssueDrawer_Template_button_click_5_listener() {
        return ctx.submit();
      });
      \u0275\u0275text(6, "Record issuance");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_3_0;
      \u0275\u0275property("open", !!ctx.batch())("drawer", true)("subtitle", ctx.batch() ? ctx.batch().code + " \xB7 vintage " + ctx.batch().vintage : "");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_3_0 = ctx.batch()) ? 1 : -1, tmp_3_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.valid());
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, ErrorBox, Callout, Modal, NumPipe], styles: ["\n.sum[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.sum[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  background: var(--%NS%surface-2);\n  display: flex;\n  flex-direction: column;\n}\n.sum[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.sum[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.reg[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.opt[_ngcontent-%COMP%] {\n  height: 34px;\n  padding: 0 14px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 8px;\n  background: var(--%NS%surface);\n  font: inherit;\n  font-weight: 500;\n  cursor: pointer;\n  color: var(--%NS%stone-700);\n}\n.opt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n}\n/*# sourceMappingURL=issue-drawer.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IssueDrawer, [{
    type: Component,
    args: [{ selector: "vcx-issue-drawer", imports: [FormsModule, ...KIT, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [open]="!!batch()" (closed)="closed.emit()" [drawer]="true" width="480px" title="Record registry issuance"
      [subtitle]="batch() ? batch()!.code + ' \xB7 vintage ' + batch()!.vintage : ''">
      @if (batch(); as b) {
        <div class="stack">
          <vc-callout tone="info" icon="landmark">
            Enter the details exactly as they appear on the registry's issuance record. The serial range is shown to buyers on
            their retirement records.
          </vc-callout>
          <div class="sum">
            <div><span>Reductions</span><strong class="num">{{ b.reductions_t | num: 2 }} t</strong></div>
            <div><span>Removals</span><strong class="num">{{ b.removals_t | num: 2 }} t</strong></div>
          </div>

          <div class="field">
            <label>Registry</label>
            <div class="reg">
              @for (r of registries; track r) {
                <button type="button" class="opt" [class.on]="registry === r" (click)="registry = r">{{ r }}</button>
              }
              <button type="button" class="opt" [class.on]="!registries.includes(registry)" (click)="registry = ''; other = true">Other</button>
            </div>
            @if (!registries.includes(registry)) {
              <input class="input" name="regname" placeholder="Registry name, e.g. Isometric" [(ngModel)]="registry" maxlength="40" />
            }
            @if (err('registry_name')) { <span class="error">{{ err('registry_name') }}</span> }
          </div>
          <div class="field">
            <label>Registry project reference</label>
            <input class="input mono" [(ngModel)]="projectRef" placeholder="e.g. VCS-4821" maxlength="80" />
            @if (err('registry_project_ref')) { <span class="error">{{ err('registry_project_ref') }}</span> }
          </div>
          <div class="form-grid">
            <div class="field">
              <label>First serial</label>
              <input class="input mono" [(ngModel)]="serialStart" placeholder="\u2026-00001" maxlength="120" />
            </div>
            <div class="field">
              <label>Last serial</label>
              <input class="input mono" [(ngModel)]="serialEnd" placeholder="\u2026-01250" maxlength="120" />
            </div>
            @if (err('serial_start') || err('serial_end')) { <span class="error span-2">{{ err('serial_start') || err('serial_end') }}</span> }
          </div>
          <div class="field">
            <label>Issued on</label>
            <input class="input" type="date" [(ngModel)]="issuedOn" [max]="today" />
          </div>
          @if (error()) { <vc-error title="Couldn't record issuance" [message]="error()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="closed.emit()">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="submit()">Record issuance</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;68c71f936f1d9a96;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\credits\\issue-drawer.ts */\n.sum {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.sum div {\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  background: var(--surface-2);\n  display: flex;\n  flex-direction: column;\n}\n.sum span {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.sum strong {\n  font-size: 16px;\n}\n.reg {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.opt {\n  height: 34px;\n  padding: 0 14px;\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  background: var(--surface);\n  font: inherit;\n  font-weight: 500;\n  cursor: pointer;\n  color: var(--stone-700);\n}\n.opt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  color: var(--forest-700);\n}\n/*# sourceMappingURL=issue-drawer.css.map */\n"] }]
  }], () => [], { batch: [{ type: Input, args: [{ isSignal: true, alias: "batch", required: false }] }], done: [{ type: Output, args: ["done"] }], closed: [{ type: Output, args: ["closed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IssueDrawer, { className: "IssueDrawer", filePath: "src/app/features/credits/issue-drawer.ts", lineNumber: 81 });
})();

// src/app/features/credits/batch-detail.page.ts
var _c0 = () => ["provisional", "verified", "issued"];
var _c1 = (a0) => ["/app/calculations", a0];
var _c2 = (a0) => ["/app/sales", a0];
var _forTrack0 = ($index, $item) => $item.id;
function BatchDetailPage_Conditional_3_Template(rf, ctx) {
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
function BatchDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-error", 3)(1, "button", 5);
    \u0275\u0275listener("click", function BatchDetailPage_Conditional_4_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
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
function BatchDetailPage_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function BatchDetailPage_Conditional_5_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.verifyOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 42);
    \u0275\u0275text(2, "Mark verified");
    \u0275\u0275elementEnd();
  }
}
function BatchDetailPage_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function BatchDetailPage_Conditional_5_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.issueOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 43);
    \u0275\u0275text(2, "Record issuance");
    \u0275\u0275elementEnd();
  }
}
function BatchDetailPage_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275listener("click", function BatchDetailPage_Conditional_5_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cancelOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 45);
    \u0275\u0275text(2, "Cancel batch");
    \u0275\u0275elementEnd();
  }
}
function BatchDetailPage_Conditional_5_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "vcx-balance-bar", 46);
    \u0275\u0275elementStart(2, "p", 23);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r7 = ctx.$implicit;
    const b_r8 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("balances", b_r8.balances[t_r7])("label", ctx_r1.typeLabel[t_r7])("icon", ctx_r1.ticon[t_r7]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.typeHint[t_r7]);
  }
}
function BatchDetailPage_Conditional_5_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Registry project");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd", 47);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r8.registry_project_ref);
  }
}
function BatchDetailPage_Conditional_5_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Serial range");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd", 47);
    \u0275\u0275text(3);
    \u0275\u0275element(4, "br");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r8.serial_start);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r8.serial_end);
  }
}
function BatchDetailPage_Conditional_5_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Issued on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, b_r8.issued_on));
  }
}
function BatchDetailPage_Conditional_5_For_73_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 49);
    \u0275\u0275element(1, "vc-icon", 50);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "num");
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r9 = \u0275\u0275nextContext().$implicit;
    const b_r8 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("bad", !ctx_r1.balanced(t_r9));
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.balanced(t_r9) ? "check-circle" : "alert")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", ctx_r1.typeLabel[t_r9], ": ", \u0275\u0275pipeBind2(3, 7, b_r8.issued_total[t_r9], 3), " t created = ", \u0275\u0275pipeBind2(4, 10, ctx_r1.stateSum(t_r9), 3), " t across states ");
  }
}
function BatchDetailPage_Conditional_5_For_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, BatchDetailPage_Conditional_5_For_73_Conditional_0_Template, 5, 13, "span", 48);
  }
  if (rf & 2) {
    const t_r9 = ctx.$implicit;
    const b_r8 = \u0275\u0275nextContext();
    \u0275\u0275conditional(b_r8.issued_total[t_r9] > 0 ? 0 : -1);
  }
}
function BatchDetailPage_Conditional_5_Conditional_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 27);
  }
}
function BatchDetailPage_Conditional_5_Conditional_75_For_18_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(2, _c2, m_r10.sale_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.saleCode(m_r10.sale_id));
  }
}
function BatchDetailPage_Conditional_5_Conditional_75_For_18_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 57);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function BatchDetailPage_Conditional_5_Conditional_75_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 52);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td")(5, "span", 53);
    \u0275\u0275element(6, "vc-icon", 54);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 52)(9, "span", 55);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "vc-icon", 56);
    \u0275\u0275elementStart(12, "span", 55);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 20)(15, "strong");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " t");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td");
    \u0275\u0275conditionalCreate(20, BatchDetailPage_Conditional_5_Conditional_75_For_18_Conditional_20_Template, 2, 4, "a", 21)(21, BatchDetailPage_Conditional_5_Conditional_75_For_18_Conditional_21_Template, 2, 0, "span", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 58);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(3, 14, m_r10.at, true));
    \u0275\u0275advance(4);
    \u0275\u0275property("name", ctx_r1.ticon[m_r10.credit_type])("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.typeLabel[m_r10.credit_type]);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("--%NS%c", ctx_r1.meta(m_r10.from).color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.meta(m_r10.from).label);
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275styleProp("--%NS%c", ctx_r1.meta(m_r10.to).color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.meta(m_r10.to).label);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(17, 17, m_r10.quantity, 3));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(m_r10.sale_id ? 20 : 21);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r10.reason);
  }
}
function BatchDetailPage_Conditional_5_Conditional_75_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "table", 51)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "When");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Movement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 20);
    \u0275\u0275text(11, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Sale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Reason");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody");
    \u0275\u0275repeaterCreate(17, BatchDetailPage_Conditional_5_Conditional_75_For_18_Template, 24, 20, "tr", null, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const b_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275repeater(b_r8.moves);
  }
}
function BatchDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-page-header", 6);
    \u0275\u0275conditionalCreate(1, BatchDetailPage_Conditional_5_Conditional_1_Template, 3, 0, "button", 7);
    \u0275\u0275conditionalCreate(2, BatchDetailPage_Conditional_5_Conditional_2_Template, 3, 0, "button", 7);
    \u0275\u0275conditionalCreate(3, BatchDetailPage_Conditional_5_Conditional_3_Template, 3, 0, "button", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "section", 9);
    \u0275\u0275element(5, "vcx-steps", 10);
    \u0275\u0275elementStart(6, "p", 11);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 12)(9, "section", 2)(10, "div", 13)(11, "h3");
    \u0275\u0275text(12, "Balances by credit type");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "vc-dc", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 15);
    \u0275\u0275repeaterCreate(15, BatchDetailPage_Conditional_5_For_16_Template, 4, 4, "div", 16, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "section", 2)(18, "div", 13)(19, "h3");
    \u0275\u0275text(20, "Batch details");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 17)(22, "dl", 18)(23, "dt");
    \u0275\u0275text(24, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dd");
    \u0275\u0275element(26, "vc-badge", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dt");
    \u0275\u0275text(28, "Vintage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dd");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dt");
    \u0275\u0275text(32, "Reductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dd", 20);
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "dt");
    \u0275\u0275text(37, "Removals");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "dd", 20);
    \u0275\u0275text(39);
    \u0275\u0275pipe(40, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "dt");
    \u0275\u0275text(42, "Calculation run");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "dd")(44, "a", 21);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "dt");
    \u0275\u0275text(47, "Registry");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "dd");
    \u0275\u0275text(49);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(50, BatchDetailPage_Conditional_5_Conditional_50_Template, 4, 1);
    \u0275\u0275conditionalCreate(51, BatchDetailPage_Conditional_5_Conditional_51_Template, 6, 2);
    \u0275\u0275conditionalCreate(52, BatchDetailPage_Conditional_5_Conditional_52_Template, 5, 3);
    \u0275\u0275elementStart(53, "dt");
    \u0275\u0275text(54, "Created");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "dd");
    \u0275\u0275text(56);
    \u0275\u0275pipe(57, "day");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(58, "section", 22)(59, "div", 13)(60, "h3");
    \u0275\u0275text(61, "Inventory ledger");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "span", 23);
    \u0275\u0275text(63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 24);
    \u0275\u0275element(65, "vc-icon", 25);
    \u0275\u0275elementStart(66, "div")(67, "strong");
    \u0275\u0275text(68, "Balances are never typed in \u2014 they are added up from these moves.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "p");
    \u0275\u0275text(70, "Each row moves a quantity from one state to another. A sale can only reserve what is available, and each tonne is in exactly one state at a time, so credits can't be lost or sold twice. Moves are append-only.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "div", 26);
    \u0275\u0275repeaterCreate(72, BatchDetailPage_Conditional_5_For_73_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(74, BatchDetailPage_Conditional_5_Conditional_74_Template, 1, 0, "vc-empty", 27)(75, BatchDetailPage_Conditional_5_Conditional_75_Template, 19, 0, "div", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "vc-modal", 29);
    \u0275\u0275twoWayListener("openChange", function BatchDetailPage_Conditional_5_Template_vc_modal_openChange_76_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.verifyOpen, $event) || (ctx_r1.verifyOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(77, "p");
    \u0275\u0275text(78, "Confirm that an independent verifier has reviewed the verification package for this batch and accepted the result.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerStart(79, 30);
    \u0275\u0275elementStart(80, "button", 31);
    \u0275\u0275listener("click", function BatchDetailPage_Conditional_5_Template_button_click_80_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.verifyOpen.set(false));
    });
    \u0275\u0275text(81, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "button", 32);
    \u0275\u0275listener("click", function BatchDetailPage_Conditional_5_Template_button_click_82_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.verify());
    });
    \u0275\u0275text(83, "Mark verified");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "vc-modal", 33);
    \u0275\u0275twoWayListener("openChange", function BatchDetailPage_Conditional_5_Template_vc_modal_openChange_84_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.cancelOpen, $event) || (ctx_r1.cancelOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(85, "div", 34)(86, "vc-callout", 35);
    \u0275\u0275text(87, "All available credits move to ");
    \u0275\u0275elementStart(88, "strong");
    \u0275\u0275text(89, "cancelled");
    \u0275\u0275elementEnd();
    \u0275\u0275text(90, " and can never be sold. This can't be undone.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "div", 36)(92, "label");
    \u0275\u0275text(93, "Reason");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "textarea", 37);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function BatchDetailPage_Conditional_5_Template_textarea_ngModelChange_94_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.cancelReason, $event) || (ctx_r1.cancelReason = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "span", 38);
    \u0275\u0275text(96, "Recorded in the ledger and the audit log.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementContainerStart(97, 30);
    \u0275\u0275elementStart(98, "button", 31);
    \u0275\u0275listener("click", function BatchDetailPage_Conditional_5_Template_button_click_98_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelOpen.set(false));
    });
    \u0275\u0275text(99, "Keep batch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "button", 39);
    \u0275\u0275listener("click", function BatchDetailPage_Conditional_5_Template_button_click_100_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancel());
    });
    \u0275\u0275text(101, "Cancel batch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "vcx-issue-drawer", 40);
    \u0275\u0275listener("done", function BatchDetailPage_Conditional_5_Template_vcx_issue_drawer_done_102_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.issueOpen.set(false);
      return \u0275\u0275resetView(ctx_r1.load());
    })("closed", function BatchDetailPage_Conditional_5_Template_vcx_issue_drawer_closed_102_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.issueOpen.set(false));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r8 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", b_r8.code)("eyebrow", "Credit batch \xB7 vintage " + b_r8.vintage)("subtitle", ctx_r1.projectName(b_r8.project_id));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage && b_r8.status === "provisional" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage && b_r8.status === "verified" ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage && b_r8.status !== "cancelled" && !ctx_r1.committed() ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("steps", \u0275\u0275pureFunction0(40, _c0))("current", b_r8.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.stepText(b_r8.status));
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r1.types);
    \u0275\u0275advance(11);
    \u0275\u0275property("status", b_r8.status);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(b_r8.vintage);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(35, 31, b_r8.reductions_t, 3), " tCO\u2082e");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(40, 34, b_r8.removals_t, 3), " tCO\u2082e");
    \u0275\u0275advance(5);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(41, _c1, b_r8.run_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(b_r8.run_id.slice(0, 8));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(b_r8.registry_name || "Not issued yet");
    \u0275\u0275advance();
    \u0275\u0275conditional(b_r8.registry_project_ref ? 50 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(b_r8.serial_start ? 51 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(b_r8.issued_on ? 52 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(57, 37, b_r8.created_at, true));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", b_r8.moves?.length ?? 0, " moves");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.types);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!b_r8.moves?.length ? 74 : 75);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("open", ctx_r1.verifyOpen);
    \u0275\u0275property("subtitle", b_r8.code);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.busy());
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("open", ctx_r1.cancelOpen);
    \u0275\u0275property("subtitle", b_r8.code);
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.cancelReason);
    \u0275\u0275control();
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.busy() || ctx_r1.cancelReason.trim().length < 3);
    \u0275\u0275advance(2);
    \u0275\u0275property("batch", ctx_r1.issueOpen() ? b_r8 : null);
  }
}
var BatchDetailPage = class _BatchDetailPage {
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  toast = inject(ToastService);
  ctx = inject(ProjectContext);
  canManage = inject(AuthService).can("credits.manage");
  types = CREDIT_TYPES;
  typeLabel = TYPE_LABEL;
  typeHint = TYPE_HINT;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;
  b = signal(
    null,
    ...ngDevMode ? [{ debugName: "b" }] : (
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
  verifyOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "verifyOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cancelOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "cancelOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  issueOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "issueOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cancelReason = "";
  committed = computed(
    () => {
      const t = this.b()?.totals;
      return !!t && (t["reserved"] ?? 0) + (t["sold"] ?? 0) + (t["retired"] ?? 0) > 1e-9;
    },
    ...ngDevMode ? [{ debugName: "committed" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading.set(!this.b());
    this.error.set(null);
    this.api.get(`/credit-batches/${this.id()}`).subscribe({
      next: (r) => {
        this.b.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
    this.api.get("/sales", { batch_id: this.id() }).subscribe({ next: (s) => this.sales.set(s), error: () => {
    } });
  }
  meta(s) {
    return STATE_META[s] ?? { label: s, color: "var(--stone-400)", hint: "" };
  }
  saleCode(id) {
    return this.sales().find((s) => s.id === id)?.code ?? id.slice(0, 8);
  }
  stateSum(t) {
    const bal = this.b()?.balances[t];
    return bal ? Object.values(bal).reduce((a, v) => a + v, 0) : 0;
  }
  balanced(t) {
    return Math.abs(this.stateSum(t) - (this.b()?.issued_total[t] ?? 0)) < 1e-6;
  }
  projectName(id) {
    const p = this.ctx.projects().find((x) => x.id === id);
    return p ? `${p.code} \xB7 ${p.name}` : "";
  }
  stepText(s) {
    return {
      provisional: "Provisional: created from an approved calculation. Waiting for independent verification before it can be issued.",
      verified: "Verified: accepted by the verifier. Record the registry issuance to make these credits saleable.",
      issued: "Issued: listed on the registry with a serial range. Available credits can be reserved for buyers.",
      cancelled: "Cancelled: withdrawn from the inventory. Nothing in this batch can be sold."
    }[s] ?? "";
  }
  verify() {
    this.busy.set(true);
    this.api.post(`/credit-batches/${this.id()}/verify`).subscribe({
      next: () => {
        this.busy.set(false);
        this.verifyOpen.set(false);
        this.toast.success("Batch marked verified");
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't verify the batch");
      }
    });
  }
  cancel() {
    this.busy.set(true);
    this.api.post(`/credit-batches/${this.id()}/cancel`, { reason: this.cancelReason.trim() }).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.cancelOpen.set(false);
        this.b.set(r);
        this.toast.success("Batch cancelled");
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't cancel the batch");
      }
    });
  }
  static \u0275fac = function BatchDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BatchDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BatchDetailPage, selectors: [["vc-batch-detail"]], inputs: { id: [1, "id"] }, decls: 6, vars: 2, consts: [["routerLink", "/app/credits", 1, "back", "small"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this batch", 3, "message"], [3, "rows"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], [3, "title", "eyebrow", "subtitle"], ["actions", "", 1, "btn", "btn-primary"], ["actions", "", 1, "btn", "btn-secondary"], [1, "card", "card-pad", "steps-card"], [3, "steps", "current"], [1, "small", "muted"], [1, "grid", "top"], [1, "card-head"], ["cls", "CALCULATED"], [1, "card-body", "stack"], [1, "type"], [1, "card-body"], [1, "kv"], [3, "status"], [1, "num"], [1, "mono", "small", 3, "routerLink"], [1, "card", "ledger-card"], [1, "subtle", "small"], [1, "explain"], ["name", "scale", 3, "size"], [1, "recon"], ["icon", "list", "title", "No moves yet", "text", "Moves appear when the batch is created, reserved, delivered or retired."], [1, "table-wrap"], ["title", "Mark batch as verified", "width", "500px", 3, "openChange", "open", "subtitle"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["title", "Cancel this batch?", "width", "520px", 3, "openChange", "open", "subtitle"], [1, "stack"], ["tone", "warn", "icon", "alert"], [1, "field"], ["placeholder", "e.g. Calculation superseded after lab re-run", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], [1, "btn", "btn-danger", 3, "click", "disabled"], [3, "done", "closed", "batch"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "shield-check"], ["name", "verified"], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "ban"], [3, "balances", "label", "icon"], [1, "mono", "small"], [1, "eq", 3, "bad"], [1, "eq"], [3, "name", "size"], [1, "table"], [1, "nowrap"], [1, "tchip"], [1, "tic", 3, "name", "size"], [1, "st"], ["name", "arrow-right", 1, "subtle", 3, "size"], [1, "subtle"], [1, "muted", "small", "reason"]], template: function BatchDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All credit batches");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, BatchDetailPage_Conditional_3_Template, 2, 1, "div", 2)(4, BatchDetailPage_Conditional_4_Template, 3, 1, "vc-error", 3)(5, BatchDetailPage_Conditional_5_Template, 103, 43);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.b()) ? 5 : -1, tmp_1_0);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, RouterLink, Icon, Badge, DataClass, PageHeader, Empty, Loading, ErrorBox, Callout, Modal, Steps, BalanceBar, IssueDrawer, NumPipe, DayPipe], styles: ['\n.tic[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-500);\n  vertical-align: -2px;\n}\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  margin-bottom: 14px;\n  color: var(--%NS%text-2);\n}\n.steps-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  flex-wrap: wrap;\n  margin-bottom: 16px;\n}\n.steps-card[_ngcontent-%COMP%]   vcx-steps[_ngcontent-%COMP%] {\n  flex: 0 1 420px;\n}\n.top[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);\n  margin-bottom: 16px;\n}\n.type[_ngcontent-%COMP%] {\n  padding-bottom: 14px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.type[_ngcontent-%COMP%]:last-child {\n  border: 0;\n  padding-bottom: 0;\n}\n.type[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.explain[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  padding: 14px 20px;\n  background: var(--%NS%forest-50);\n  border-bottom: 1px solid var(--%NS%border);\n  color: var(--%NS%forest-700);\n}\n.explain[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n  font-weight: 600;\n}\n.explain[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n  max-width: 820px;\n}\n.recon[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-top: 10px;\n}\n.eq[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  padding: 3px 10px;\n  border-radius: 999px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%forest-200);\n  color: var(--%NS%forest-700);\n}\n.eq.bad[_ngcontent-%COMP%] {\n  border-color: #f3c7c3;\n  color: var(--%NS%red-600);\n}\n.tchip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.tchip[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.st[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  font-weight: 500;\n}\n.st[_ngcontent-%COMP%]::before {\n  content: "";\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--%NS%c);\n}\ntd[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  margin: 0 6px;\n  vertical-align: middle;\n}\n.reason[_ngcontent-%COMP%] {\n  max-width: 360px;\n}\n@media (max-width: 1100px) {\n  .top[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=batch-detail.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BatchDetailPage, [{
    type: Component,
    args: [{ selector: "vc-batch-detail", imports: [FormsModule, RouterLink, ...KIT, NumPipe, DayPipe, Steps, BalanceBar, IssueDrawer], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/credits" class="back small"><vc-icon name="arrow-left" [size]="14" />All credit batches</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this batch" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else if (b(); as b) {
      <vc-page-header [title]="b.code" [eyebrow]="'Credit batch \xB7 vintage ' + b.vintage" [subtitle]="projectName(b.project_id)">
        @if (canManage && b.status === 'provisional') {
          <button actions class="btn btn-primary" (click)="verifyOpen.set(true)"><vc-icon name="shield-check" />Mark verified</button>
        }
        @if (canManage && b.status === 'verified') {
          <button actions class="btn btn-primary" (click)="issueOpen.set(true)"><vc-icon name="verified" />Record issuance</button>
        }
        @if (canManage && b.status !== 'cancelled' && !committed()) {
          <button actions class="btn btn-secondary" (click)="cancelOpen.set(true)"><vc-icon name="ban" />Cancel batch</button>
        }
      </vc-page-header>

      <section class="card card-pad steps-card">
        <vcx-steps [steps]="['provisional', 'verified', 'issued']" [current]="b.status" />
        <p class="small muted">{{ stepText(b.status) }}</p>
      </section>

      <div class="grid top">
        <section class="card">
          <div class="card-head"><h3>Balances by credit type</h3><vc-dc cls="CALCULATED" /></div>
          <div class="card-body stack">
            @for (t of types; track t) {
              <div class="type">
                <vcx-balance-bar [balances]="b.balances[t]" [label]="typeLabel[t]" [icon]="ticon[t]" />
                <p class="subtle small">{{ typeHint[t] }}</p>
              </div>
            }
          </div>
        </section>

        <section class="card">
          <div class="card-head"><h3>Batch details</h3></div>
          <div class="card-body">
            <dl class="kv">
              <dt>Status</dt><dd><vc-badge [status]="b.status" /></dd>
              <dt>Vintage</dt><dd>{{ b.vintage }}</dd>
              <dt>Reductions</dt><dd class="num">{{ b.reductions_t | num: 3 }} tCO\u2082e</dd>
              <dt>Removals</dt><dd class="num">{{ b.removals_t | num: 3 }} tCO\u2082e</dd>
              <dt>Calculation run</dt><dd><a [routerLink]="['/app/calculations', b.run_id]" class="mono small">{{ b.run_id.slice(0, 8) }}</a></dd>
              <dt>Registry</dt><dd>{{ b.registry_name || 'Not issued yet' }}</dd>
              @if (b.registry_project_ref) { <dt>Registry project</dt><dd class="mono small">{{ b.registry_project_ref }}</dd> }
              @if (b.serial_start) { <dt>Serial range</dt><dd class="mono small">{{ b.serial_start }}<br />{{ b.serial_end }}</dd> }
              @if (b.issued_on) { <dt>Issued on</dt><dd>{{ b.issued_on | day }}</dd> }
              <dt>Created</dt><dd>{{ b.created_at | day: true }}</dd>
            </dl>
          </div>
        </section>
      </div>

      <section class="card ledger-card">
        <div class="card-head">
          <h3>Inventory ledger</h3>
          <span class="subtle small">{{ b.moves?.length ?? 0 }} moves</span>
        </div>
        <div class="explain">
          <vc-icon name="scale" [size]="18" />
          <div>
            <strong>Balances are never typed in \u2014 they are added up from these moves.</strong>
            <p>Each row moves a quantity from one state to another. A sale can only reserve what is available, and each
              tonne is in exactly one state at a time, so credits can't be lost or sold twice. Moves are append-only.</p>
            <div class="recon">
              @for (t of types; track t) {
                @if (b.issued_total[t] > 0) {
                  <span class="eq" [class.bad]="!balanced(t)">
                    <vc-icon [name]="balanced(t) ? 'check-circle' : 'alert'" [size]="14" />
                    {{ typeLabel[t] }}: {{ b.issued_total[t] | num: 3 }} t created =
                    {{ stateSum(t) | num: 3 }} t across states
                  </span>
                }
              }
            </div>
          </div>
        </div>
        @if (!b.moves?.length) {
          <vc-empty icon="list" title="No moves yet" text="Moves appear when the batch is created, reserved, delivered or retired." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>When</th><th>Type</th><th>Movement</th><th class="num">Quantity</th><th>Sale</th><th>Reason</th></tr></thead>
              <tbody>
                @for (m of b.moves; track m.id) {
                  <tr>
                    <td class="nowrap">{{ m.at | day: true }}</td>
                    <td><span class="tchip"><vc-icon class="tic" [name]="ticon[m.credit_type]" [size]="13" />{{ typeLabel[m.credit_type] }}</span></td>
                    <td class="nowrap">
                      <span class="st" [style.--c]="meta(m.from).color">{{ meta(m.from).label }}</span>
                      <vc-icon name="arrow-right" [size]="13" class="subtle" />
                      <span class="st" [style.--c]="meta(m.to).color">{{ meta(m.to).label }}</span>
                    </td>
                    <td class="num"><strong>{{ m.quantity | num: 3 }}</strong> t</td>
                    <td>
                      @if (m.sale_id) {
                        <a [routerLink]="['/app/sales', m.sale_id]" class="mono small">{{ saleCode(m.sale_id) }}</a>
                      } @else { <span class="subtle">\u2014</span> }
                    </td>
                    <td class="muted small reason">{{ m.reason }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <vc-modal [(open)]="verifyOpen" title="Mark batch as verified" [subtitle]="b.code" width="500px">
        <p>Confirm that an independent verifier has reviewed the verification package for this batch and accepted the result.</p>
        <ng-container footer>
          <button class="btn btn-ghost" (click)="verifyOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="busy()" (click)="verify()">Mark verified</button>
        </ng-container>
      </vc-modal>

      <vc-modal [(open)]="cancelOpen" title="Cancel this batch?" [subtitle]="b.code" width="520px">
        <div class="stack">
          <vc-callout tone="warn" icon="alert">All available credits move to <strong>cancelled</strong> and can never be sold. This can't be undone.</vc-callout>
          <div class="field">
            <label>Reason</label>
            <textarea class="input" [(ngModel)]="cancelReason" placeholder="e.g. Calculation superseded after lab re-run"></textarea>
            <span class="hint">Recorded in the ledger and the audit log.</span>
          </div>
        </div>
        <ng-container footer>
          <button class="btn btn-ghost" (click)="cancelOpen.set(false)">Keep batch</button>
          <button class="btn btn-danger" [disabled]="busy() || cancelReason.trim().length < 3" (click)="cancel()">Cancel batch</button>
        </ng-container>
      </vc-modal>

      <vcx-issue-drawer [batch]="issueOpen() ? b : null" (done)="issueOpen.set(false); load()" (closed)="issueOpen.set(false)" />
    }
  `, styles: ['/* angular:styles/component:scss;e5e3d01b06a888da;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\credits\\batch-detail.page.ts */\n.tic {\n  color: var(--stone-500);\n  vertical-align: -2px;\n}\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  margin-bottom: 14px;\n  color: var(--text-2);\n}\n.steps-card {\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  flex-wrap: wrap;\n  margin-bottom: 16px;\n}\n.steps-card vcx-steps {\n  flex: 0 1 420px;\n}\n.top {\n  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);\n  margin-bottom: 16px;\n}\n.type {\n  padding-bottom: 14px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.type:last-child {\n  border: 0;\n  padding-bottom: 0;\n}\n.type p {\n  margin-top: 8px;\n}\n.explain {\n  display: flex;\n  gap: 12px;\n  padding: 14px 20px;\n  background: var(--forest-50);\n  border-bottom: 1px solid var(--border);\n  color: var(--forest-700);\n}\n.explain strong {\n  color: var(--stone-900);\n  font-weight: 600;\n}\n.explain p {\n  margin-top: 4px;\n  font-size: 13px;\n  color: var(--stone-700);\n  max-width: 820px;\n}\n.recon {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-top: 10px;\n}\n.eq {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  padding: 3px 10px;\n  border-radius: 999px;\n  background: var(--surface);\n  border: 1px solid var(--forest-200);\n  color: var(--forest-700);\n}\n.eq.bad {\n  border-color: #f3c7c3;\n  color: var(--red-600);\n}\n.tchip {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.tchip i {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.st {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  font-weight: 500;\n}\n.st::before {\n  content: "";\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--c);\n}\ntd vc-icon {\n  margin: 0 6px;\n  vertical-align: middle;\n}\n.reason {\n  max-width: 360px;\n}\n@media (max-width: 1100px) {\n  .top {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=batch-detail.page.css.map */\n'] }]
  }], null, { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BatchDetailPage, { className: "BatchDetailPage", filePath: "src/app/features/credits/batch-detail.page.ts", lineNumber: 179 });
})();

// src/app/features/credits/credits.page.ts
var _c02 = (a0) => [a0];
var _c12 = () => ["provisional", "verified", "issued"];
var _forTrack02 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.key;
function CreditsPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function CreditsPage_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 30);
    \u0275\u0275text(2, "Create batch");
    \u0275\u0275elementEnd();
  }
}
function CreditsPage_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r3 = ctx.$implicit;
    \u0275\u0275property("value", p_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r3.code, " \xB7 ", p_r3.name);
  }
}
function CreditsPage_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function CreditsPage_For_22_Template_button_click_0_listener() {
      const s_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.statusF.set(s_r5.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 32);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.statusF() === s_r5.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", s_r5.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.count(s_r5.key));
  }
}
function CreditsPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "vc-loading", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function CreditsPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-error", 16)(1, "button", 33);
    \u0275\u0275listener("click", function CreditsPage_Conditional_24_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
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
function CreditsPage_Conditional_25_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function CreditsPage_Conditional_25_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 30);
    \u0275\u0275text(2, "Create batch");
    \u0275\u0275elementEnd();
  }
}
function CreditsPage_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "vc-empty", 34);
    \u0275\u0275conditionalCreate(2, CreditsPage_Conditional_25_Conditional_2_Template, 3, 0, "button", 35);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.batches().length ? "No batches match these filters" : "No credit batches yet")("text", ctx_r1.batches().length ? "Try another status or project." : "Once a calculation run is approved, create a credit batch from it. The batch starts as provisional until it is verified and issued by a registry.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage && !ctx_r1.batches().length ? 2 : -1);
  }
}
function CreditsPage_Conditional_26_For_2_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "span", 57);
    \u0275\u0275element(2, "vc-icon", 58);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 59);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "num");
    \u0275\u0275elementStart(7, "span", 60);
    \u0275\u0275text(8, "t");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const t_r8 = ctx.$implicit;
    const b_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r1.ticon[t_r8])("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.typeLabel[t_r8]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(6, 4, t_r8 === "reduction" ? b_r9.reductions_t : b_r9.removals_t, 2), " ");
  }
}
function CreditsPage_Conditional_26_For_2_For_17_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vcx-balance-bar", 61);
  }
  if (rf & 2) {
    const t_r10 = \u0275\u0275nextContext().$implicit;
    const b_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("balances", b_r9.balances[t_r10])("label", ctx_r1.typeLabel[t_r10])("icon", ctx_r1.ticon[t_r10])("showLegend", false);
  }
}
function CreditsPage_Conditional_26_For_2_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CreditsPage_Conditional_26_For_2_For_17_Conditional_0_Template, 1, 4, "vcx-balance-bar", 61);
  }
  if (rf & 2) {
    const t_r10 = ctx.$implicit;
    const b_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional((t_r10 === "reduction" ? b_r9.reductions_t : b_r9.removals_t) > 0 ? 0 : -1);
  }
}
function CreditsPage_Conditional_26_For_2_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "b", 62);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "num");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const k_r11 = ctx.$implicit;
    const b_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", k_r11.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", k_r11.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 4, b_r9.totals[k_r11.key], 0));
  }
}
function CreditsPage_Conditional_26_For_2_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275element(1, "vc-icon", 63);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 64);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const b_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", b_r9.registry_name, " \xB7 ", b_r9.registry_project_ref);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", b_r9.serial_start, " \u2192 ", b_r9.serial_end);
  }
}
function CreditsPage_Conditional_26_For_2_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function CreditsPage_Conditional_26_For_2_Conditional_27_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const b_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.verifyTarget.set(b_r9));
    });
    \u0275\u0275element(1, "vc-icon", 65);
    \u0275\u0275text(2, "Mark verified");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function CreditsPage_Conditional_26_For_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 66);
    \u0275\u0275listener("click", function CreditsPage_Conditional_26_For_2_Conditional_28_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r13);
      const b_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.issueTarget.set(b_r9));
    });
    \u0275\u0275element(1, "vc-icon", 67);
    \u0275\u0275text(2, "Record issuance");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function CreditsPage_Conditional_26_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 37)(1, "header", 38)(2, "div", 39)(3, "a", 40);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 41);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(7, "vc-badge", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 43);
    \u0275\u0275element(9, "vc-icon", 44);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "vcx-steps", 45);
    \u0275\u0275elementStart(12, "div", 46);
    \u0275\u0275repeaterCreate(13, CreditsPage_Conditional_26_For_2_For_14_Template, 9, 7, "div", 47, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 48);
    \u0275\u0275repeaterCreate(16, CreditsPage_Conditional_26_For_2_For_17_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(18, "div", 49);
    \u0275\u0275repeaterCreate(19, CreditsPage_Conditional_26_For_2_For_20_Template, 6, 7, "span", null, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(21, CreditsPage_Conditional_26_For_2_Conditional_21_Template, 6, 5, "div", 50);
    \u0275\u0275elementStart(22, "footer", 51)(23, "a", 52);
    \u0275\u0275element(24, "vc-icon", 53);
    \u0275\u0275text(25, "Ledger");
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "span", 54);
    \u0275\u0275conditionalCreate(27, CreditsPage_Conditional_26_For_2_Conditional_27_Template, 3, 1, "button", 55);
    \u0275\u0275conditionalCreate(28, CreditsPage_Conditional_26_For_2_Conditional_28_Template, 3, 1, "button", 56);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const b_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(13, _c02, b_r9.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(b_r9.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Vintage ", b_r9.vintage);
    \u0275\u0275advance();
    \u0275\u0275property("status", b_r9.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.projectName(b_r9.project_id));
    \u0275\u0275advance();
    \u0275\u0275property("steps", \u0275\u0275pureFunction0(15, _c12))("current", b_r9.status);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.types);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.types);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.legendKeys);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(b_r9.status === "issued" ? 21 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(16, _c02, b_r9.id));
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.canManage && b_r9.status === "provisional" ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage && b_r9.status === "verified" ? 28 : -1);
  }
}
function CreditsPage_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275repeaterCreate(1, CreditsPage_Conditional_26_For_2_Template, 29, 18, "article", 37, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.rows());
  }
}
function CreditsPage_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 19);
    \u0275\u0275text(1, "Choose a project in the top bar first.");
    \u0275\u0275elementEnd();
  }
}
function CreditsPage_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 20);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function CreditsPage_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 21);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.runsError());
  }
}
function CreditsPage_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 22);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("text", "Every approved calculation in " + ctx_r1.ctx.current().code + " already has a batch, or none has been approved yet.");
  }
}
function CreditsPage_Conditional_32_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 71)(1, "input", 72);
    \u0275\u0275listener("change", function CreditsPage_Conditional_32_For_6_Template_input_change_1_listener() {
      const r_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.pickRun.set(r_r15.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 73)(3, "div", 74)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "day");
    \u0275\u0275pipe(7, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "vc-dc", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 76);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 77)(13, "span");
    \u0275\u0275element(14, "vc-icon", 58);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275element(18, "vc-icon", 58);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "strong");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "num");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.pickRun() === r_r15.id);
    \u0275\u0275advance();
    \u0275\u0275property("value", r_r15.id)("checked", ctx_r1.pickRun() === r_r15.id);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r15.period_label || \u0275\u0275pipeBind1(6, 15, r_r15.period_start) + " \u2013 " + \u0275\u0275pipeBind1(7, 17, r_r15.period_end));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate3("Engine ", r_r15.engine_version, " \xB7 run ", r_r15.id.slice(0, 8), " \xB7 ", \u0275\u0275pipeBind1(11, 19, r_r15.created_at));
    \u0275\u0275advance(4);
    \u0275\u0275property("name", ctx_r1.ticon["reduction"])("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(16, 21, r_r15.reductions_t_co2e, 2), " t");
    \u0275\u0275advance(3);
    \u0275\u0275property("name", ctx_r1.ticon["removal"])("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(20, 24, r_r15.removals_t_co2e, 2), " t");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(23, 27, r_r15.net_t_co2e, 2), " t net");
  }
}
function CreditsPage_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 68);
    \u0275\u0275text(1, "Project ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 69);
    \u0275\u0275repeaterCreate(5, CreditsPage_Conditional_32_For_6_Template, 24, 30, "label", 70, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r1.ctx.current().code, " \xB7 ", ctx_r1.ctx.current().name);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.eligibleRuns());
  }
}
var CreditsPage = class _CreditsPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  router = inject(Router);
  ctx = inject(ProjectContext);
  canManage = inject(AuthService).can("credits.manage");
  types = CREDIT_TYPES;
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;
  legendKeys = [
    { key: "available", label: "Available", color: "var(--forest-500)" },
    { key: "reserved", label: "Reserved", color: "var(--sky-600)" },
    { key: "sold", label: "Sold", color: "var(--clay-500)" },
    { key: "retired", label: "Retired", color: "var(--stone-600)" },
    { key: "buffer", label: "Buffer", color: "var(--amber-600)" }
  ];
  statusOpts = [
    { key: "", label: "All" },
    { key: "provisional", label: "Provisional" },
    { key: "verified", label: "Verified" },
    { key: "issued", label: "Issued" },
    { key: "cancelled", label: "Cancelled" }
  ];
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
  projectF = signal(
    "",
    ...ngDevMode ? [{ debugName: "projectF" }] : (
      /* istanbul ignore next */
      []
    )
  );
  statusF = signal(
    "",
    ...ngDevMode ? [{ debugName: "statusF" }] : (
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
  rows = computed(
    () => this.batches().filter((b) => (!this.projectF() || b.project_id === this.projectF()) && (!this.statusF() || b.status === this.statusF())),
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
  runs = signal(
    [],
    ...ngDevMode ? [{ debugName: "runs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  runsLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "runsLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  runsError = signal(
    null,
    ...ngDevMode ? [{ debugName: "runsError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pickRun = signal(
    null,
    ...ngDevMode ? [{ debugName: "pickRun" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eligibleRuns = computed(
    () => {
      const used = new Set(this.batches().map((b) => b.run_id));
      return this.runs().filter((r) => r.status === "approved" && !used.has(r.id));
    },
    ...ngDevMode ? [{ debugName: "eligibleRuns" }] : (
      /* istanbul ignore next */
      []
    )
  );
  verifyTarget = signal(
    null,
    ...ngDevMode ? [{ debugName: "verifyTarget" }] : (
      /* istanbul ignore next */
      []
    )
  );
  issueTarget = signal(
    null,
    ...ngDevMode ? [{ debugName: "issueTarget" }] : (
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
    this.api.get("/credit-batches").subscribe({
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
  count(status) {
    const list = this.batches().filter((b) => !this.projectF() || b.project_id === this.projectF());
    return status ? list.filter((b) => b.status === status).length : list.length;
  }
  sum(state) {
    const live = this.rows().filter((b) => b.status !== "cancelled");
    if (state === "all")
      return live.reduce((a, b) => a + ["available", "reserved", "sold", "retired", "buffer"].reduce((x, k) => x + (b.totals[k] ?? 0), 0), 0);
    return live.reduce((a, b) => a + (b.totals[state] ?? 0), 0);
  }
  projectName(id) {
    const p = this.ctx.projects().find((x) => x.id === id);
    return p ? `${p.code} \xB7 ${p.name}` : "Project " + id.slice(0, 8);
  }
  openCreate() {
    this.createOpen.set(true);
    this.pickRun.set(null);
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.runsLoading.set(true);
    this.runsError.set(null);
    this.api.get(`/projects/${pid}/calculations`).subscribe({
      next: (r) => {
        this.runs.set(r);
        this.runsLoading.set(false);
        if (this.eligibleRuns().length === 1)
          this.pickRun.set(this.eligibleRuns()[0].id);
      },
      error: (e) => {
        this.runsError.set(e.message);
        this.runsLoading.set(false);
      }
    });
  }
  create() {
    const id = this.pickRun();
    if (!id)
      return;
    this.busy.set(true);
    this.api.post(`/calculations/${id}/credit-batch`).subscribe({
      next: (b) => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.toast.success(`Batch ${b.code} created`, "It is provisional until verified and issued.");
        this.router.navigate(["/app/credits", b.id]);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't create the batch");
      }
    });
  }
  verify() {
    const b = this.verifyTarget();
    if (!b)
      return;
    this.busy.set(true);
    this.api.post(`/credit-batches/${b.id}/verify`).subscribe({
      next: (nb) => {
        this.busy.set(false);
        this.verifyTarget.set(null);
        this.replace(nb);
        this.toast.success(`${nb.code} marked verified`);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't verify the batch");
      }
    });
  }
  onIssued(b) {
    this.issueTarget.set(null);
    this.replace(b);
  }
  replace(b) {
    this.batches.update((list) => list.map((x) => x.id === b.id ? __spreadValues(__spreadValues({}, x), b) : x));
  }
  static \u0275fac = function CreditsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CreditsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CreditsPage, selectors: [["vc-credits-page"]], decls: 49, vars: 28, consts: [["title", "Credit inventory", "eyebrow", "Credits & sales", "subtitle", "Credit batches created from approved calculations. Every tonne moves through a ledger \u2014 available, reserved, sold, retired \u2014 so nothing can be lost or sold twice."], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], ["actions", "", 1, "btn", "btn-primary"], [1, "grid", "grid-4", "stats"], ["label", "Credits in inventory", "unit", "tCO\u2082e", "icon", "boxes", 3, "value", "accent", "hint"], ["label", "Available to sell", "unit", "tCO\u2082e", "icon", "package", "hint", "Issued and not yet reserved", 3, "value"], ["label", "Reserved or sold", "unit", "tCO\u2082e", "icon", "handshake", "hint", "Committed to buyers", 3, "value"], ["label", "Retired", "unit", "tCO\u2082e", "icon", "archive", "hint", "Claimed by buyers, permanently", 3, "value"], [1, "filters"], ["aria-label", "Project", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "seg"], ["type", "button", 3, "on"], [1, "card"], ["title", "Couldn't load credit batches", 3, "message"], [1, "cards"], ["title", "Create a credit batch", "width", "640px", "subtitle", "Choose an approved calculation run. Its reductions and removals enter the inventory as a provisional batch.", 3, "openChange", "open"], ["tone", "warn", "icon", "briefcase"], [3, "rows"], ["title", "Couldn't load calculation runs", 3, "message"], ["icon", "calculator", "title", "No approved runs waiting", 3, "text"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["title", "Mark batch as verified", "width", "500px", 3, "closed", "open", "subtitle"], [1, "muted", "small", 2, "margin-top", "10px"], [3, "done", "closed", "batch"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["type", "button", 3, "click"], [1, "c"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["icon", "boxes", 3, "title", "text"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "card", "batch"], [1, "bh"], [1, "bt"], [1, "code", "mono", 3, "routerLink"], [1, "vint"], [3, "status"], [1, "proj", "muted", "small"], ["name", "briefcase", 3, "size"], [3, "steps", "current"], [1, "split"], [1, "tq"], [1, "bars"], [1, "legend", "small"], [1, "reg", "small"], [1, "bf"], [1, "btn", "btn-ghost", "btn-sm", 3, "routerLink"], ["name", "list", 3, "size"], [1, "spacer"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-primary", "btn-sm"], [1, "k"], [1, "tic", 3, "name", "size"], [1, "v", "num"], [1, "u"], [3, "balances", "label", "icon", "showLegend"], [1, "num"], ["name", "landmark", 3, "size"], [1, "subtle", "mono"], ["name", "shield-check", 3, "size"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["name", "verified", 3, "size"], [1, "muted", "small", 2, "margin-bottom", "12px"], [1, "runs"], [1, "run", 3, "on"], [1, "run"], ["type", "radio", "name", "run", 3, "change", "value", "checked"], [1, "rb"], [1, "row"], ["cls", "CALCULATED"], [1, "small", "muted"], [1, "rq", "num"]], template: function CreditsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "button", 1);
      \u0275\u0275listener("click", function CreditsPage_Template_button_click_1_listener() {
        return ctx.load();
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, CreditsPage_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4);
      \u0275\u0275element(6, "vc-stat", 5);
      \u0275\u0275pipe(7, "num");
      \u0275\u0275element(8, "vc-stat", 6);
      \u0275\u0275pipe(9, "num");
      \u0275\u0275element(10, "vc-stat", 7);
      \u0275\u0275pipe(11, "num");
      \u0275\u0275element(12, "vc-stat", 8);
      \u0275\u0275pipe(13, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 9)(15, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function CreditsPage_Template_select_ngModelChange_15_listener($event) {
        return ctx.projectF.set($event);
      });
      \u0275\u0275elementStart(16, "option", 11);
      \u0275\u0275text(17, "All projects");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(18, CreditsPage_For_19_Template, 2, 3, "option", 12, _forTrack02);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "div", 13);
      \u0275\u0275repeaterCreate(21, CreditsPage_For_22_Template, 4, 4, "button", 14, _forTrack1);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(23, CreditsPage_Conditional_23_Template, 2, 1, "div", 15)(24, CreditsPage_Conditional_24_Template, 3, 1, "vc-error", 16)(25, CreditsPage_Conditional_25_Template, 3, 3, "div", 15)(26, CreditsPage_Conditional_26_Template, 3, 0, "div", 17);
      \u0275\u0275elementStart(27, "vc-modal", 18);
      \u0275\u0275twoWayListener("openChange", function CreditsPage_Template_vc_modal_openChange_27_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(28, CreditsPage_Conditional_28_Template, 2, 0, "vc-callout", 19)(29, CreditsPage_Conditional_29_Template, 1, 1, "vc-loading", 20)(30, CreditsPage_Conditional_30_Template, 1, 1, "vc-error", 21)(31, CreditsPage_Conditional_31_Template, 1, 1, "vc-empty", 22)(32, CreditsPage_Conditional_32_Template, 7, 2);
      \u0275\u0275elementContainerStart(33, 23);
      \u0275\u0275elementStart(34, "button", 24);
      \u0275\u0275listener("click", function CreditsPage_Template_button_click_34_listener() {
        return ctx.createOpen.set(false);
      });
      \u0275\u0275text(35, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "button", 25);
      \u0275\u0275listener("click", function CreditsPage_Template_button_click_36_listener() {
        return ctx.create();
      });
      \u0275\u0275text(37, "Create provisional batch");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "vc-modal", 26);
      \u0275\u0275listener("closed", function CreditsPage_Template_vc_modal_closed_38_listener() {
        return ctx.verifyTarget.set(null);
      });
      \u0275\u0275elementStart(39, "p");
      \u0275\u0275text(40, "Confirm that an independent verifier has reviewed the verification package for this batch and accepted the result.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "p", 27);
      \u0275\u0275text(42, "After this, the batch can be issued on a registry. This step is recorded in the audit log.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(43, 23);
      \u0275\u0275elementStart(44, "button", 24);
      \u0275\u0275listener("click", function CreditsPage_Template_button_click_44_listener() {
        return ctx.verifyTarget.set(null);
      });
      \u0275\u0275text(45, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "button", 25);
      \u0275\u0275listener("click", function CreditsPage_Template_button_click_46_listener() {
        return ctx.verify();
      });
      \u0275\u0275text(47, "Mark verified");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "vcx-issue-drawer", 28);
      \u0275\u0275listener("done", function CreditsPage_Template_vcx_issue_drawer_done_48_listener($event) {
        return ctx.onIssued($event);
      })("closed", function CreditsPage_Template_vcx_issue_drawer_closed_48_listener() {
        return ctx.issueTarget.set(null);
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canManage ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("value", \u0275\u0275pipeBind2(7, 16, ctx.sum("all"), 0))("accent", true)("hint", ctx.batches().length + " batch" + (ctx.batches().length === 1 ? "" : "es"));
      \u0275\u0275advance(2);
      \u0275\u0275property("value", \u0275\u0275pipeBind2(9, 19, ctx.sum("available"), 0));
      \u0275\u0275advance(2);
      \u0275\u0275property("value", \u0275\u0275pipeBind2(11, 22, ctx.sum("reserved") + ctx.sum("sold"), 0));
      \u0275\u0275advance(2);
      \u0275\u0275property("value", \u0275\u0275pipeBind2(13, 25, ctx.sum("retired"), 0));
      \u0275\u0275advance(3);
      \u0275\u0275property("ngModel", ctx.projectF());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.ctx.projects());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.statusOpts);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 23 : ctx.error() ? 24 : !ctx.rows().length ? 25 : 26);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.ctx.current() ? 28 : ctx.runsLoading() ? 29 : ctx.runsError() ? 30 : !ctx.eligibleRuns().length ? 31 : 32);
      \u0275\u0275advance(8);
      \u0275\u0275property("disabled", !ctx.pickRun() || ctx.busy());
      \u0275\u0275advance(2);
      \u0275\u0275property("open", !!ctx.verifyTarget())("subtitle", ctx.verifyTarget()?.code ?? "");
      \u0275\u0275advance(8);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance(2);
      \u0275\u0275property("batch", ctx.issueTarget());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, RouterLink, Icon, Badge, DataClass, PageHeader, Stat, Empty, Loading, ErrorBox, Callout, Modal, Steps, BalanceBar, IssueDrawer, NumPipe, DayPipe], styles: ["\n.tic[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-500);\n  vertical-align: -2px;\n}\n.stats[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 280px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 8px;\n  background: var(--%NS%surface);\n  padding: 3px;\n  gap: 2px;\n  flex-wrap: wrap;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: inherit;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--%NS%text-2);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-200);\n}\n.seg[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  margin-left: 4px;\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.cards[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));\n  gap: 16px;\n}\n.batch[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  padding: 18px 18px 0;\n}\n.bh[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  justify-content: space-between;\n}\n.bt[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 15px;\n  font-weight: 600;\n  color: var(--%NS%stone-900);\n}\n.vint[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.proj[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: -8px;\n}\n.split[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.tq[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.tq[_ngcontent-%COMP%]   .k[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.sw[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.tq[_ngcontent-%COMP%]   .v[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n}\n.tq[_ngcontent-%COMP%]   .u[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  font-weight: 400;\n}\n.bars[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.legend[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 12px;\n  color: var(--%NS%text-2);\n}\n.legend[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n  margin-right: 5px;\n}\n.legend[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--%NS%stone-800);\n}\n.reg[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex-wrap: wrap;\n  color: var(--%NS%stone-700);\n}\n.bf[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: auto -18px 0;\n  padding: 10px 12px;\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n  border-radius: 0 0 var(--%NS%radius) var(--%NS%radius);\n}\n.runs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.run[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 10px;\n  cursor: pointer;\n}\n.run[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%forest-300);\n}\n.run.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n}\n.run[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n}\n.rb[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.rq[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 1px;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.rq[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 7px;\n  height: 7px;\n  border-radius: 2px;\n  margin-right: 5px;\n}\n.rq[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n}\n@media (max-width: 720px) {\n  .cards[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=credits.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreditsPage, [{
    type: Component,
    args: [{ selector: "vc-credits-page", imports: [FormsModule, RouterLink, ...KIT, NumPipe, DayPipe, Steps, BalanceBar, IssueDrawer], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Credit inventory" eyebrow="Credits & sales"
      subtitle="Credit batches created from approved calculations. Every tonne moves through a ledger \u2014 available, reserved, sold, retired \u2014 so nothing can be lost or sold twice.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (canManage) {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Create batch</button>
      }
    </vc-page-header>

    <div class="grid grid-4 stats">
      <vc-stat label="Credits in inventory" [value]="sum('all') | num: 0" unit="tCO\u2082e" icon="boxes" [accent]="true"
        [hint]="batches().length + ' batch' + (batches().length === 1 ? '' : 'es')" />
      <vc-stat label="Available to sell" [value]="sum('available') | num: 0" unit="tCO\u2082e" icon="package" hint="Issued and not yet reserved" />
      <vc-stat label="Reserved or sold" [value]="(sum('reserved') + sum('sold')) | num: 0" unit="tCO\u2082e" icon="handshake" hint="Committed to buyers" />
      <vc-stat label="Retired" [value]="sum('retired') | num: 0" unit="tCO\u2082e" icon="archive" hint="Claimed by buyers, permanently" />
    </div>

    <div class="filters">
      <select class="input" [ngModel]="projectF()" (ngModelChange)="projectF.set($event)" aria-label="Project">
        <option value="">All projects</option>
        @for (p of ctx.projects(); track p.id) { <option [value]="p.id">{{ p.code }} \xB7 {{ p.name }}</option> }
      </select>
      <div class="seg">
        @for (s of statusOpts; track s.key) {
          <button type="button" [class.on]="statusF() === s.key" (click)="statusF.set(s.key)">{{ s.label }}
            <span class="c">{{ count(s.key) }}</span></button>
        }
      </div>
    </div>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load credit batches" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else if (!rows().length) {
      <div class="card">
        <vc-empty icon="boxes" [title]="batches().length ? 'No batches match these filters' : 'No credit batches yet'"
          [text]="batches().length ? 'Try another status or project.' : 'Once a calculation run is approved, create a credit batch from it. The batch starts as provisional until it is verified and issued by a registry.'">
          @if (canManage && !batches().length) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Create batch</button> }
        </vc-empty>
      </div>
    } @else {
      <div class="cards">
        @for (b of rows(); track b.id) {
          <article class="card batch">
            <header class="bh">
              <div class="bt">
                <a class="code mono" [routerLink]="[b.id]">{{ b.code }}</a>
                <span class="vint">Vintage {{ b.vintage }}</span>
              </div>
              <vc-badge [status]="b.status" />
            </header>
            <div class="proj muted small"><vc-icon name="briefcase" [size]="13" />{{ projectName(b.project_id) }}</div>
            <vcx-steps [steps]="['provisional', 'verified', 'issued']" [current]="b.status" />

            <div class="split">
              @for (t of types; track t) {
                <div class="tq">
                  <span class="k"><vc-icon class="tic" [name]="ticon[t]" [size]="13" />{{ typeLabel[t] }}</span>
                  <span class="v num">{{ (t === 'reduction' ? b.reductions_t : b.removals_t) | num: 2 }} <span class="u">t</span></span>
                </div>
              }
            </div>

            <div class="bars">
              @for (t of types; track t) {
                @if ((t === 'reduction' ? b.reductions_t : b.removals_t) > 0) {
                  <vcx-balance-bar [balances]="b.balances[t]" [label]="typeLabel[t]" [icon]="ticon[t]" [showLegend]="false" />
                }
              }
              <div class="legend small">
                @for (k of legendKeys; track k.key) { <span><i [style.background]="k.color"></i>{{ k.label }} <b class="num">{{ b.totals[k.key] | num: 0 }}</b></span> }
              </div>
            </div>

            @if (b.status === 'issued') {
              <div class="reg small"><vc-icon name="landmark" [size]="13" /><span>{{ b.registry_name }} \xB7 {{ b.registry_project_ref }}</span>
                <span class="subtle mono">{{ b.serial_start }} \u2192 {{ b.serial_end }}</span></div>
            }

            <footer class="bf">
              <a class="btn btn-ghost btn-sm" [routerLink]="[b.id]"><vc-icon name="list" [size]="14" />Ledger</a>
              <span class="spacer"></span>
              @if (canManage && b.status === 'provisional') {
                <button class="btn btn-secondary btn-sm" (click)="verifyTarget.set(b)"><vc-icon name="shield-check" [size]="14" />Mark verified</button>
              }
              @if (canManage && b.status === 'verified') {
                <button class="btn btn-primary btn-sm" (click)="issueTarget.set(b)"><vc-icon name="verified" [size]="14" />Record issuance</button>
              }
            </footer>
          </article>
        }
      </div>
    }

    <!-- create batch -->
    <vc-modal [(open)]="createOpen" title="Create a credit batch" width="640px"
      subtitle="Choose an approved calculation run. Its reductions and removals enter the inventory as a provisional batch.">
      @if (!ctx.current()) {
        <vc-callout tone="warn" icon="briefcase">Choose a project in the top bar first.</vc-callout>
      } @else if (runsLoading()) {
        <vc-loading [rows]="3" />
      } @else if (runsError()) {
        <vc-error title="Couldn't load calculation runs" [message]="runsError()!" />
      } @else if (!eligibleRuns().length) {
        <vc-empty icon="calculator" title="No approved runs waiting"
          [text]="'Every approved calculation in ' + ctx.current()!.code + ' already has a batch, or none has been approved yet.'" />
      } @else {
        <p class="muted small" style="margin-bottom:12px">Project <strong>{{ ctx.current()!.code }} \xB7 {{ ctx.current()!.name }}</strong></p>
        <div class="runs">
          @for (r of eligibleRuns(); track r.id) {
            <label class="run" [class.on]="pickRun() === r.id">
              <input type="radio" name="run" [value]="r.id" [checked]="pickRun() === r.id" (change)="pickRun.set(r.id)" />
              <div class="rb">
                <div class="row"><strong>{{ r.period_label || ((r.period_start | day) + ' \u2013 ' + (r.period_end | day)) }}</strong><vc-dc cls="CALCULATED" /></div>
                <div class="small muted">Engine {{ r.engine_version }} \xB7 run {{ r.id.slice(0, 8) }} \xB7 {{ r.created_at | day }}</div>
              </div>
              <div class="rq num">
                <span><vc-icon class="tic" [name]="ticon['reduction']" [size]="13" />{{ r.reductions_t_co2e | num: 2 }} t</span>
                <span><vc-icon class="tic" [name]="ticon['removal']" [size]="13" />{{ r.removals_t_co2e | num: 2 }} t</span>
                <strong>{{ r.net_t_co2e | num: 2 }} t net</strong>
              </div>
            </label>
          }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!pickRun() || busy()" (click)="create()">Create provisional batch</button>
      </ng-container>
    </vc-modal>

    <!-- verify -->
    <vc-modal [open]="!!verifyTarget()" (closed)="verifyTarget.set(null)" title="Mark batch as verified"
      [subtitle]="verifyTarget()?.code ?? ''" width="500px">
      <p>Confirm that an independent verifier has reviewed the verification package for this batch and accepted the result.</p>
      <p class="muted small" style="margin-top:10px">After this, the batch can be issued on a registry. This step is recorded in the audit log.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="verifyTarget.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="verify()">Mark verified</button>
      </ng-container>
    </vc-modal>

    <vcx-issue-drawer [batch]="issueTarget()" (done)="onIssued($event)" (closed)="issueTarget.set(null)" />
  `, styles: ["/* angular:styles/component:scss;272624251dc59034;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\credits\\credits.page.ts */\n.tic {\n  color: var(--stone-500);\n  vertical-align: -2px;\n}\n.stats {\n  margin-bottom: 20px;\n}\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.filters select {\n  width: 280px;\n}\n.seg {\n  display: inline-flex;\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  background: var(--surface);\n  padding: 3px;\n  gap: 2px;\n  flex-wrap: wrap;\n}\n.seg button {\n  height: 30px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: inherit;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--text-2);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--forest-50);\n  color: var(--forest-700);\n  box-shadow: inset 0 0 0 1px var(--forest-200);\n}\n.seg .c {\n  margin-left: 4px;\n  font-size: 11px;\n  color: var(--text-3);\n}\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));\n  gap: 16px;\n}\n.batch {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  padding: 18px 18px 0;\n}\n.bh {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  justify-content: space-between;\n}\n.bt {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.code {\n  font-size: 15px;\n  font-weight: 600;\n  color: var(--stone-900);\n}\n.vint {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.proj {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: -8px;\n}\n.split {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.tq {\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.tq .k {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--text-2);\n}\n.sw {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.tq .v {\n  font-size: 18px;\n  font-weight: 600;\n}\n.tq .u {\n  font-size: 12px;\n  color: var(--text-3);\n  font-weight: 400;\n}\n.bars {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.legend {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px 12px;\n  color: var(--text-2);\n}\n.legend i {\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n  margin-right: 5px;\n}\n.legend b {\n  font-weight: 600;\n  color: var(--stone-800);\n}\n.reg {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex-wrap: wrap;\n  color: var(--stone-700);\n}\n.bf {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: auto -18px 0;\n  padding: 10px 12px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n  border-radius: 0 0 var(--radius) var(--radius);\n}\n.runs {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.run {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 14px;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  cursor: pointer;\n}\n.run:hover {\n  border-color: var(--forest-300);\n}\n.run.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n}\n.run input {\n  accent-color: var(--primary);\n}\n.rb {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.rq {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 1px;\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.rq i {\n  display: inline-block;\n  width: 7px;\n  height: 7px;\n  border-radius: 2px;\n  margin-right: 5px;\n}\n.rq strong {\n  color: var(--stone-900);\n}\n@media (max-width: 720px) {\n  .cards {\n    grid-template-columns: 1fr;\n  }\n  .filters select {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=credits.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CreditsPage, { className: "CreditsPage", filePath: "src/app/features/credits/credits.page.ts", lineNumber: 213 });
})();

// src/app/features/credits/credits.routes.ts
var credits_routes_default = [
  { path: "", component: CreditsPage, title: "Credits \xB7 Varsapradaya Carbon" },
  { path: ":id", component: BatchDetailPage, title: "Credit batch \xB7 Varsapradaya Carbon" }
];
export {
  credits_routes_default as default
};
//# debugId=29fcb011-380d-5b0d-9afe-094276af077d
//# sourceMappingURL=chunk-4TQJBLAV.js.map
