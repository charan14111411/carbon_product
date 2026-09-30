import {
  apiMessage
} from "./chunk-W6OT2EF5.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgModel
} from "./chunk-WOW2CD4M.js";
import {
  Callout,
  ErrorBox,
  KIT
} from "./chunk-PAXTZ3VZ.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
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
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-O2E4BMDK.js";

// src/app/features/benefits/profile-form.ts
function ProfileForm_Conditional_25_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.upiErr());
  }
}
function ProfileForm_Conditional_25_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1, "Looks like ");
    \u0275\u0275elementStart(2, "span", 16);
    \u0275\u0275text(3, "ramesh@oksbi");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ".");
    \u0275\u0275elementEnd();
  }
}
function ProfileForm_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "label");
    \u0275\u0275text(2, "UPI ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 14);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function ProfileForm_Conditional_25_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.upi.set($event.trim()));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProfileForm_Conditional_25_Conditional_4_Template, 2, 1, "span", 15)(5, ProfileForm_Conditional_25_Conditional_5_Template, 5, 0, "span", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275classProp("invalid", !!ctx_r1.upiErr());
    \u0275\u0275property("ngModel", ctx_r1.upi());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.upiErr() ? 4 : 5);
  }
}
function ProfileForm_Conditional_26_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.acctErr());
  }
}
function ProfileForm_Conditional_26_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1, "Only the last 4 digits are kept on screen after saving.");
    \u0275\u0275elementEnd();
  }
}
function ProfileForm_Conditional_26_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.ifscErr());
  }
}
function ProfileForm_Conditional_26_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1, "11 characters, printed on the cheque book or passbook.");
    \u0275\u0275elementEnd();
  }
}
function ProfileForm_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "label");
    \u0275\u0275text(2, "Account number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 17);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function ProfileForm_Conditional_26_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.acct.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProfileForm_Conditional_26_Conditional_4_Template, 2, 1, "span", 15)(5, ProfileForm_Conditional_26_Conditional_5_Template, 2, 0, "span", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 1)(7, "label");
    \u0275\u0275text(8, "IFSC code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 18);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function ProfileForm_Conditional_26_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.ifsc.set($event.toUpperCase().trim()));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, ProfileForm_Conditional_26_Conditional_10_Template, 2, 1, "span", 15)(11, ProfileForm_Conditional_26_Conditional_11_Template, 2, 0, "span", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275classProp("invalid", !!ctx_r1.acctErr());
    \u0275\u0275property("ngModel", ctx_r1.acct())("placeholder", ctx_r1.current()?.account_masked ? "Re-enter to change (" + ctx_r1.current().account_masked + ")" : "9 to 18 digits");
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.acctErr() ? 4 : 5);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("invalid", !!ctx_r1.ifscErr());
    \u0275\u0275property("ngModel", ctx_r1.ifsc());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.ifscErr() ? 10 : 11);
  }
}
function ProfileForm_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 8);
    \u0275\u0275text(1, "Saving changes removes the verified status until the new details are checked again.");
    \u0275\u0275elementEnd();
  }
}
function ProfileForm_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 9);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
var UPI_RE = /^[A-Za-z0-9._-]{2,256}@[A-Za-z][A-Za-z0-9]{1,63}$/;
var IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
var ProfileForm = class _ProfileForm {
  api = inject(ApiService);
  farmerId = input.required(
    ...ngDevMode ? [{ debugName: "farmerId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  current = input(
    null,
    ...ngDevMode ? [{ debugName: "current" }] : (
      /* istanbul ignore next */
      []
    )
  );
  large = input(
    false,
    ...ngDevMode ? [{ debugName: "large" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saved = output();
  cancelled = output();
  method = signal(
    "upi",
    ...ngDevMode ? [{ debugName: "method" }] : (
      /* istanbul ignore next */
      []
    )
  );
  name = signal(
    "",
    ...ngDevMode ? [{ debugName: "name" }] : (
      /* istanbul ignore next */
      []
    )
  );
  upi = signal(
    "",
    ...ngDevMode ? [{ debugName: "upi" }] : (
      /* istanbul ignore next */
      []
    )
  );
  acct = signal(
    "",
    ...ngDevMode ? [{ debugName: "acct" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ifsc = signal(
    "",
    ...ngDevMode ? [{ debugName: "ifsc" }] : (
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
  error = signal(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  upiErr = computed(
    () => this.upi() && !UPI_RE.test(this.upi()) ? "Enter a UPI ID like name@bank." : "",
    ...ngDevMode ? [{ debugName: "upiErr" }] : (
      /* istanbul ignore next */
      []
    )
  );
  acctDigits = computed(
    () => this.acct().replace(/\s/g, ""),
    ...ngDevMode ? [{ debugName: "acctDigits" }] : (
      /* istanbul ignore next */
      []
    )
  );
  acctErr = computed(
    () => this.acct() && !/^\d{9,18}$/.test(this.acctDigits()) ? "The account number must be 9 to 18 digits." : "",
    ...ngDevMode ? [{ debugName: "acctErr" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ifscErr = computed(
    () => this.ifsc() && !IFSC_RE.test(this.ifsc()) ? "Enter a valid IFSC code, e.g. SBIN0001234 (5th character is zero)." : "",
    ...ngDevMode ? [{ debugName: "ifscErr" }] : (
      /* istanbul ignore next */
      []
    )
  );
  valid = computed(
    () => this.name().trim().length >= 2 && (this.method() === "upi" ? UPI_RE.test(this.upi()) : /^\d{9,18}$/.test(this.acctDigits()) && IFSC_RE.test(this.ifsc())),
    ...ngDevMode ? [{ debugName: "valid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const p = this.current();
      this.method.set(p?.method ?? "upi");
      this.name.set(p?.account_name ?? "");
      this.upi.set(p?.upi_id ?? "");
      this.ifsc.set(p?.ifsc ?? "");
      this.acct.set("");
    });
  }
  save() {
    const body = this.method() === "upi" ? { method: "upi", upi_id: this.upi(), account_name: this.name().trim() } : { method: "bank", account_number: this.acctDigits(), ifsc: this.ifsc(), account_name: this.name().trim() };
    this.busy.set(true);
    this.error.set(null);
    this.api.put(`/farmers/${this.farmerId()}/payment-profile`, body).subscribe({
      next: (p) => {
        this.busy.set(false);
        this.acct.set("");
        this.saved.emit(p);
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(apiMessage(e));
      }
    });
  }
  static \u0275fac = function ProfileForm_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileForm)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileForm, selectors: [["vcx-profile-form"]], inputs: { farmerId: [1, "farmerId"], current: [1, "current"], large: [1, "large"] }, outputs: { saved: "saved", cancelled: "cancelled" }, decls: 35, vars: 17, consts: [[1, "stack"], [1, "field"], [1, "methods"], ["type", "button", 3, "click"], ["name", "zap", 3, "size"], ["name", "landmark", 3, "size"], ["maxlength", "200", "autocomplete", "name", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], ["tone", "warn", "icon", "info"], ["title", "Couldn't save payment details", 3, "message"], [1, "row", "acts"], [1, "spacer"], ["type", "button", 1, "btn", "btn-ghost", 3, "click"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], ["placeholder", "name@okbank", "autocomplete", "off", "inputmode", "email", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "error"], [1, "mono"], ["inputmode", "numeric", "autocomplete", "off", 1, "input", "mono", 3, "ngModelChange", "ngModel", "placeholder"], ["maxlength", "11", "placeholder", "SBIN0001234", "autocomplete", "off", 1, "input", "mono", 3, "ngModelChange", "ngModel"]], template: function ProfileForm_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "label");
      \u0275\u0275text(3, "How should the money be paid?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 2)(5, "button", 3);
      \u0275\u0275listener("click", function ProfileForm_Template_button_click_5_listener() {
        return ctx.method.set("upi");
      });
      \u0275\u0275element(6, "vc-icon", 4);
      \u0275\u0275elementStart(7, "span")(8, "strong");
      \u0275\u0275text(9, "UPI");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "small");
      \u0275\u0275text(11, "Instant, to a UPI ID");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "button", 3);
      \u0275\u0275listener("click", function ProfileForm_Template_button_click_12_listener() {
        return ctx.method.set("bank");
      });
      \u0275\u0275element(13, "vc-icon", 5);
      \u0275\u0275elementStart(14, "span")(15, "strong");
      \u0275\u0275text(16, "Bank account");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "small");
      \u0275\u0275text(18, "NEFT/IMPS transfer");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(19, "div", 1)(20, "label");
      \u0275\u0275text(21, "Account holder name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "input", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function ProfileForm_Template_input_ngModelChange_22_listener($event) {
        return ctx.name.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "span", 7);
      \u0275\u0275text(24, "As it appears with the bank.");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(25, ProfileForm_Conditional_25_Template, 6, 4, "div", 1)(26, ProfileForm_Conditional_26_Template, 12, 9);
      \u0275\u0275conditionalCreate(27, ProfileForm_Conditional_27_Template, 2, 0, "vc-callout", 8);
      \u0275\u0275conditionalCreate(28, ProfileForm_Conditional_28_Template, 1, 1, "vc-error", 9);
      \u0275\u0275elementStart(29, "div", 10);
      \u0275\u0275element(30, "span", 11);
      \u0275\u0275elementStart(31, "button", 12);
      \u0275\u0275listener("click", function ProfileForm_Template_button_click_31_listener() {
        return ctx.cancelled.emit();
      });
      \u0275\u0275text(32, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "button", 13);
      \u0275\u0275listener("click", function ProfileForm_Template_button_click_33_listener() {
        return ctx.save();
      });
      \u0275\u0275text(34, "Save details");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("big", ctx.large());
      \u0275\u0275advance(5);
      \u0275\u0275classProp("on", ctx.method() === "upi");
      \u0275\u0275advance();
      \u0275\u0275property("size", 16);
      \u0275\u0275advance(6);
      \u0275\u0275classProp("on", ctx.method() === "bank");
      \u0275\u0275advance();
      \u0275\u0275property("size", 16);
      \u0275\u0275advance(9);
      \u0275\u0275property("ngModel", ctx.name());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.method() === "upi" ? 25 : 26);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.current()?.verified ? 27 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 28 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275classProp("btn-lg", ctx.large());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("btn-lg", ctx.large());
      \u0275\u0275property("disabled", !ctx.valid() || ctx.busy());
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, Icon, ErrorBox, Callout], styles: ["\n.methods[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.methods[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 10px;\n  background: var(--%NS%surface);\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n  color: var(--%NS%stone-700);\n}\n.methods[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-500);\n}\n.methods[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.methods[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.big[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  height: 46px;\n  font-size: 16px;\n}\n.big[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\n/*# sourceMappingURL=profile-form.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileForm, [{
    type: Component,
    args: [{ selector: "vcx-profile-form", imports: [FormsModule, ...KIT], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="stack" [class.big]="large()">
      <div class="field">
        <label>How should the money be paid?</label>
        <div class="methods">
          <button type="button" [class.on]="method() === 'upi'" (click)="method.set('upi')"><vc-icon name="zap" [size]="16" /><span><strong>UPI</strong><small>Instant, to a UPI ID</small></span></button>
          <button type="button" [class.on]="method() === 'bank'" (click)="method.set('bank')"><vc-icon name="landmark" [size]="16" /><span><strong>Bank account</strong><small>NEFT/IMPS transfer</small></span></button>
        </div>
      </div>
      <div class="field">
        <label>Account holder name</label>
        <input class="input" [ngModel]="name()" (ngModelChange)="name.set($event)" maxlength="200" autocomplete="name" />
        <span class="hint">As it appears with the bank.</span>
      </div>
      @if (method() === 'upi') {
        <div class="field">
          <label>UPI ID</label>
          <input class="input mono" [ngModel]="upi()" (ngModelChange)="upi.set($event.trim())" placeholder="name@okbank" autocomplete="off" inputmode="email" [class.invalid]="!!upiErr()" />
          @if (upiErr()) { <span class="error">{{ upiErr() }}</span> } @else { <span class="hint">Looks like <span class="mono">ramesh@oksbi</span>.</span> }
        </div>
      } @else {
        <div class="field">
          <label>Account number</label>
          <input class="input mono" [ngModel]="acct()" (ngModelChange)="acct.set($event)" inputmode="numeric" autocomplete="off"
            [placeholder]="current()?.account_masked ? 'Re-enter to change (' + current()!.account_masked + ')' : '9 to 18 digits'" [class.invalid]="!!acctErr()" />
          @if (acctErr()) { <span class="error">{{ acctErr() }}</span> } @else { <span class="hint">Only the last 4 digits are kept on screen after saving.</span> }
        </div>
        <div class="field">
          <label>IFSC code</label>
          <input class="input mono" [ngModel]="ifsc()" (ngModelChange)="ifsc.set($event.toUpperCase().trim())" maxlength="11" placeholder="SBIN0001234" autocomplete="off" [class.invalid]="!!ifscErr()" />
          @if (ifscErr()) { <span class="error">{{ ifscErr() }}</span> } @else { <span class="hint">11 characters, printed on the cheque book or passbook.</span> }
        </div>
      }
      @if (current()?.verified) { <vc-callout tone="warn" icon="info">Saving changes removes the verified status until the new details are checked again.</vc-callout> }
      @if (error()) { <vc-error title="Couldn't save payment details" [message]="error()!" /> }
      <div class="row acts">
        <span class="spacer"></span>
        <button type="button" class="btn btn-ghost" [class.btn-lg]="large()" (click)="cancelled.emit()">Cancel</button>
        <button type="button" class="btn btn-primary" [class.btn-lg]="large()" [disabled]="!valid() || busy()" (click)="save()">Save details</button>
      </div>
    </div>
  `, styles: ["/* angular:styles/component:scss;4e9edee0d1e25004;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\benefits\\profile-form.ts */\n.methods {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.methods button {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  border: 1px solid var(--border-strong);\n  border-radius: 10px;\n  background: var(--surface);\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n  color: var(--stone-700);\n}\n.methods button.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  color: var(--forest-700);\n  box-shadow: inset 0 0 0 1px var(--forest-500);\n}\n.methods span {\n  display: flex;\n  flex-direction: column;\n}\n.methods small {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.big .input {\n  height: 46px;\n  font-size: 16px;\n}\n.big label {\n  font-size: 14px;\n}\n/*# sourceMappingURL=profile-form.css.map */\n"] }]
  }], () => [], { farmerId: [{ type: Input, args: [{ isSignal: true, alias: "farmerId", required: true }] }], current: [{ type: Input, args: [{ isSignal: true, alias: "current", required: false }] }], large: [{ type: Input, args: [{ isSignal: true, alias: "large", required: false }] }], saved: [{ type: Output, args: ["saved"] }], cancelled: [{ type: Output, args: ["cancelled"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileForm, { className: "ProfileForm", filePath: "src/app/features/benefits/profile-form.ts", lineNumber: 67 });
})();

export {
  ProfileForm
};
//# debugId=fb2adfd7-e8ff-5095-8f43-a271abee0ae4
//# sourceMappingURL=chunk-W3DBHZTN.js.map
