import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-WOW2CD4M.js";
import {
  Modal
} from "./chunk-3GJ7OF6Y.js";
import {
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
  effect,
  input,
  model,
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
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/sampling/confirm.ts
var _c0 = ["*"];
function ConfirmDialog_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.message());
  }
}
function ConfirmDialog_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1, "(optional)");
    \u0275\u0275elementEnd();
  }
}
function ConfirmDialog_Conditional_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("At least ", ctx_r0.minReason(), " characters. Kept in the audit log.");
  }
}
function ConfirmDialog_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "label", 7);
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, ConfirmDialog_Conditional_4_Conditional_3_Template, 2, 0, "span", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "textarea", 9);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function ConfirmDialog_Conditional_4_Template_textarea_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.text.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ConfirmDialog_Conditional_4_Conditional_5_Template, 2, 1, "span", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.reasonLabel(), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.reason() === "optional" ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", ctx_r0.reasonPlaceholder())("ngModel", ctx_r0.text());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.reason() === "required" ? 5 : -1);
  }
}
function ConfirmDialog_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Working\u2026 ");
  }
}
function ConfirmDialog_Conditional_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 11);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("name", ctx_r0.icon());
  }
}
function ConfirmDialog_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ConfirmDialog_Conditional_10_Conditional_0_Template, 1, 1, "vc-icon", 11);
    \u0275\u0275text(1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.icon() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.confirmLabel(), " ");
  }
}
var ConfirmDialog = class _ConfirmDialog {
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  title = input(
    "Are you sure?",
    ...ngDevMode ? [{ debugName: "title" }] : (
      /* istanbul ignore next */
      []
    )
  );
  message = input(
    "",
    ...ngDevMode ? [{ debugName: "message" }] : (
      /* istanbul ignore next */
      []
    )
  );
  confirmLabel = input(
    "Confirm",
    ...ngDevMode ? [{ debugName: "confirmLabel" }] : (
      /* istanbul ignore next */
      []
    )
  );
  icon = input(
    "",
    ...ngDevMode ? [{ debugName: "icon" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tone = input(
    "primary",
    ...ngDevMode ? [{ debugName: "tone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  reason = input(
    "none",
    ...ngDevMode ? [{ debugName: "reason" }] : (
      /* istanbul ignore next */
      []
    )
  );
  reasonLabel = input(
    "Reason",
    ...ngDevMode ? [{ debugName: "reasonLabel" }] : (
      /* istanbul ignore next */
      []
    )
  );
  reasonPlaceholder = input(
    "",
    ...ngDevMode ? [{ debugName: "reasonPlaceholder" }] : (
      /* istanbul ignore next */
      []
    )
  );
  minReason = input(
    5,
    ...ngDevMode ? [{ debugName: "minReason" }] : (
      /* istanbul ignore next */
      []
    )
  );
  busy = input(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  confirmed = output();
  text = signal(
    "",
    ...ngDevMode ? [{ debugName: "text" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (this.open())
        this.text.set("");
    });
  }
  valid() {
    return this.reason() !== "required" || this.text().trim().length >= this.minReason();
  }
  go() {
    if (this.valid())
      this.confirmed.emit(this.text().trim());
  }
  static \u0275fac = function ConfirmDialog_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConfirmDialog)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConfirmDialog, selectors: [["vc-s-confirm"]], inputs: { open: [1, "open"], title: [1, "title"], message: [1, "message"], confirmLabel: [1, "confirmLabel"], icon: [1, "icon"], tone: [1, "tone"], reason: [1, "reason"], reasonLabel: [1, "reasonLabel"], reasonPlaceholder: [1, "reasonPlaceholder"], minReason: [1, "minReason"], busy: [1, "busy"] }, outputs: { open: "openChange", confirmed: "confirmed" }, ngContentSelectors: _c0, decls: 11, vars: 10, consts: [["width", "500px", 3, "openChange", "open", "title"], [1, "stack", 2, "--gap", "14px"], [1, "msg"], [1, "field"], ["footer", ""], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "button", 1, "btn", 3, "click", "disabled"], ["for", "sc-reason"], [1, "subtle"], ["id", "sc-reason", "rows", "3", 1, "input", 3, "ngModelChange", "placeholder", "ngModel"], [1, "hint"], [3, "name"]], template: function ConfirmDialog_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function ConfirmDialog_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(1, "div", 1);
      \u0275\u0275conditionalCreate(2, ConfirmDialog_Conditional_2_Template, 2, 1, "p", 2);
      \u0275\u0275projection(3);
      \u0275\u0275conditionalCreate(4, ConfirmDialog_Conditional_4_Template, 6, 5, "div", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(5, 4);
      \u0275\u0275elementStart(6, "button", 5);
      \u0275\u0275listener("click", function ConfirmDialog_Template_button_click_6_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(7, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "button", 6);
      \u0275\u0275listener("click", function ConfirmDialog_Template_button_click_8_listener() {
        return ctx.go();
      });
      \u0275\u0275conditionalCreate(9, ConfirmDialog_Conditional_9_Template, 1, 0)(10, ConfirmDialog_Conditional_10_Template, 2, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275property("title", ctx.title());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.message() ? 2 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.reason() !== "none" ? 4 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("btn-danger", ctx.tone() === "danger")("btn-primary", ctx.tone() !== "danger");
      \u0275\u0275property("disabled", ctx.busy() || !ctx.valid());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.busy() ? 9 : 10);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, Modal, Icon], styles: ["\n.msg[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n  line-height: 1.55;\n}\n/*# sourceMappingURL=confirm.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfirmDialog, [{
    type: Component,
    args: [{ selector: "vc-s-confirm", imports: [FormsModule, Modal, Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" [title]="title()" width="500px">
      <div class="stack" style="--gap:14px">
        @if (message()) { <p class="msg">{{ message() }}</p> }
        <ng-content />
        @if (reason() !== 'none') {
          <div class="field">
            <label for="sc-reason">{{ reasonLabel() }} @if (reason() === 'optional') { <span class="subtle">(optional)</span> }</label>
            <textarea id="sc-reason" class="input" rows="3" [placeholder]="reasonPlaceholder()"
              [ngModel]="text()" (ngModelChange)="text.set($event)"></textarea>
            @if (reason() === 'required') { <span class="hint">At least {{ minReason() }} characters. Kept in the audit log.</span> }
          </div>
        }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="open.set(false)">Cancel</button>
        <button class="btn" type="button" [class.btn-danger]="tone() === 'danger'" [class.btn-primary]="tone() !== 'danger'"
          [disabled]="busy() || !valid()" (click)="go()">
          @if (busy()) { Working\u2026 } @else { @if (icon()) { <vc-icon [name]="icon()" /> } {{ confirmLabel() }} }
        </button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;f9be3d819081cbb2;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sampling\\confirm.ts */\n.msg {\n  color: var(--stone-700);\n  line-height: 1.55;\n}\n/*# sourceMappingURL=confirm.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: false }] }], message: [{ type: Input, args: [{ isSignal: true, alias: "message", required: false }] }], confirmLabel: [{ type: Input, args: [{ isSignal: true, alias: "confirmLabel", required: false }] }], icon: [{ type: Input, args: [{ isSignal: true, alias: "icon", required: false }] }], tone: [{ type: Input, args: [{ isSignal: true, alias: "tone", required: false }] }], reason: [{ type: Input, args: [{ isSignal: true, alias: "reason", required: false }] }], reasonLabel: [{ type: Input, args: [{ isSignal: true, alias: "reasonLabel", required: false }] }], reasonPlaceholder: [{ type: Input, args: [{ isSignal: true, alias: "reasonPlaceholder", required: false }] }], minReason: [{ type: Input, args: [{ isSignal: true, alias: "minReason", required: false }] }], busy: [{ type: Input, args: [{ isSignal: true, alias: "busy", required: false }] }], confirmed: [{ type: Output, args: ["confirmed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConfirmDialog, { className: "ConfirmDialog", filePath: "src/app/features/sampling/confirm.ts", lineNumber: 36 });
})();

export {
  ConfirmDialog
};
//# debugId=ce9a77a6-05f0-50b0-a18a-d1794a35126a
//# sourceMappingURL=chunk-VEJVYJ44.js.map
