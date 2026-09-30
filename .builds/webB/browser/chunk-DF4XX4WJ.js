import {
  TYPE_LABEL,
  apiMessage,
  money
} from "./chunk-W6OT2EF5.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgModel
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
  DataClass,
  Hash,
  KIT,
  Modal
} from "./chunk-PAXTZ3VZ.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
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
  ɵɵdeclareLet,
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
  ɵɵreadContextLet,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstoreLet,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/sales/sale-actions.ts
function SaleActions_Conditional_0_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function SaleActions_Conditional_0_Case_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.open("contract"));
    });
    \u0275\u0275element(1, "vc-icon", 21);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("btn-sm", ctx_r1.small());
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.small() ? "Contract" : "Record contract");
  }
}
function SaleActions_Conditional_0_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function SaleActions_Conditional_0_Case_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.open("deliver"));
    });
    \u0275\u0275element(1, "vc-icon", 22);
    \u0275\u0275text(2, "Deliver");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("btn-sm", ctx_r1.small());
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function SaleActions_Conditional_0_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function SaleActions_Conditional_0_Case_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.open("retire"));
    });
    \u0275\u0275element(1, "vc-icon", 23);
    \u0275\u0275text(2, "Retire");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("btn-sm", ctx_r1.small());
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function SaleActions_Conditional_0_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Cancel sale ");
  }
}
function SaleActions_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function SaleActions_Conditional_0_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.open("cancel"));
    });
    \u0275\u0275element(1, "vc-icon", 25);
    \u0275\u0275conditionalCreate(2, SaleActions_Conditional_0_Conditional_3_Conditional_2_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("btn-sm", ctx_r1.small());
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.small() ? 2 : -1);
  }
}
function SaleActions_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SaleActions_Conditional_0_Case_0_Template, 3, 4, "button", 18)(1, SaleActions_Conditional_0_Case_1_Template, 3, 3, "button", 18)(2, SaleActions_Conditional_0_Case_2_Template, 3, 3, "button", 18);
    \u0275\u0275conditionalCreate(3, SaleActions_Conditional_0_Conditional_3_Template, 3, 4, "button", 19);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r1.sale().status) === "reserved" ? 0 : tmp_1_0 === "contracted" ? 1 : tmp_1_0 === "delivered" ? 2 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.sale().status === "reserved" || ctx_r1.sale().status === "contracted" ? 3 : -1);
  }
}
var SALE_STEPS = ["reserved", "contracted", "delivered", "retired"];
var KIND_LABEL = { corporate: "Corporate", trader: "Trader", ngo: "NGO", government: "Government" };
var SaleActions = class _SaleActions {
  api = inject(ApiService);
  toast = inject(ToastService);
  canSell = inject(AuthService).can("sales.manage");
  sale = input.required(
    ...ngDevMode ? [{ debugName: "sale" }] : (
      /* istanbul ignore next */
      []
    )
  );
  small = input(
    false,
    ...ngDevMode ? [{ debugName: "small" }] : (
      /* istanbul ignore next */
      []
    )
  );
  changed = output();
  typeLabel = TYPE_LABEL;
  today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  act = signal(
    null,
    ...ngDevMode ? [{ debugName: "act" }] : (
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
  contractRef = "";
  tradeDate = this.today;
  beneficiary = "";
  reason = "";
  open(a) {
    this.contractRef = this.sale().contract_ref ?? "";
    this.tradeDate = this.today;
    this.beneficiary = this.sale().buyer_name ?? "";
    this.reason = "";
    this.act.set(a);
  }
  run(a, body) {
    this.busy.set(true);
    this.api.post(`/sales/${this.sale().id}/${a}`, body).subscribe({
      next: (s) => {
        this.busy.set(false);
        this.act.set(null);
        const msg = { contract: "Contract recorded", deliver: "Credits delivered", retire: "Credits retired", cancel: "Sale cancelled" }[a];
        this.toast.success(`${s.code}: ${msg}`, a === "deliver" ? `${money(s.total_amount, s.currency)} ready for benefit sharing.` : void 0);
        this.changed.emit(s);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.error("That didn't work", apiMessage(e));
      }
    });
  }
  static \u0275fac = function SaleActions_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SaleActions)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SaleActions, selectors: [["vcx-sale-actions"]], inputs: { sale: [1, "sale"], small: [1, "small"] }, outputs: { changed: "changed" }, decls: 71, vars: 35, consts: [["title", "Record the contract", "width", "500px", 3, "closed", "open", "subtitle"], [1, "stack"], [1, "field"], ["placeholder", "e.g. ERPA-2026-014", "maxlength", "120", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "hint"], ["type", "date", 1, "input", 3, "ngModelChange", "ngModel", "max"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["title", "Deliver credits to the buyer?", "width", "500px", 3, "closed", "open", "subtitle"], [1, "mono"], [1, "muted", "small", 2, "margin-top", "10px"], ["title", "Retire these credits", "width", "520px", 3, "closed", "open", "subtitle"], ["tone", "warn", "icon", "lock"], ["maxlength", "200", 1, "input", 3, "ngModelChange", "ngModel", "placeholder"], ["title", "Cancel this sale?", "width", "500px", 3, "closed", "open", "subtitle"], ["placeholder", "e.g. Buyer withdrew before contract", 1, "input", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-danger", 3, "click", "disabled"], [1, "btn", "btn-primary", 3, "btn-sm"], ["title", "Cancel sale", 1, "btn", "btn-ghost", 3, "btn-sm"], [1, "btn", "btn-primary", 3, "click"], ["name", "file-check", 3, "size"], ["name", "send", 3, "size"], ["name", "archive", 3, "size"], ["title", "Cancel sale", 1, "btn", "btn-ghost", 3, "click"], ["name", "ban", 3, "size"]], template: function SaleActions_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, SaleActions_Conditional_0_Template, 4, 2);
      \u0275\u0275elementStart(1, "vc-modal", 0);
      \u0275\u0275listener("closed", function SaleActions_Template_vc_modal_closed_1_listener() {
        return ctx.act.set(null);
      });
      \u0275\u0275elementStart(2, "div", 1)(3, "div", 2)(4, "label");
      \u0275\u0275text(5, "Contract reference");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "input", 3);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function SaleActions_Template_input_ngModelChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.contractRef, $event) || (ctx.contractRef = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "span", 4);
      \u0275\u0275text(8, "The buyer's purchase order or emission-reduction purchase agreement number.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 2)(10, "label");
      \u0275\u0275text(11, "Trade date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 5);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function SaleActions_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tradeDate, $event) || (ctx.tradeDate = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementContainerStart(13, 6);
      \u0275\u0275elementStart(14, "button", 7);
      \u0275\u0275listener("click", function SaleActions_Template_button_click_14_listener() {
        return ctx.act.set(null);
      });
      \u0275\u0275text(15, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "button", 8);
      \u0275\u0275listener("click", function SaleActions_Template_button_click_16_listener() {
        return ctx.run("contract", { contract_ref: ctx.contractRef.trim(), trade_date: ctx.tradeDate || null });
      });
      \u0275\u0275text(17, "Record contract");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "vc-modal", 9);
      \u0275\u0275listener("closed", function SaleActions_Template_vc_modal_closed_18_listener() {
        return ctx.act.set(null);
      });
      \u0275\u0275elementStart(19, "p");
      \u0275\u0275text(20);
      \u0275\u0275pipe(21, "num");
      \u0275\u0275elementStart(22, "span", 10);
      \u0275\u0275text(23);
      \u0275\u0275elementEnd();
      \u0275\u0275text(24, " move from ");
      \u0275\u0275elementStart(25, "strong");
      \u0275\u0275text(26, "reserved");
      \u0275\u0275elementEnd();
      \u0275\u0275text(27, " to ");
      \u0275\u0275elementStart(28, "strong");
      \u0275\u0275text(29, "sold");
      \u0275\u0275elementEnd();
      \u0275\u0275text(30);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "p", 11);
      \u0275\u0275text(32, "Once delivered, the sale can no longer be cancelled, and the farmer benefit pool can be prepared.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(33, 6);
      \u0275\u0275elementStart(34, "button", 7);
      \u0275\u0275listener("click", function SaleActions_Template_button_click_34_listener() {
        return ctx.act.set(null);
      });
      \u0275\u0275text(35, "Not yet");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "button", 8);
      \u0275\u0275listener("click", function SaleActions_Template_button_click_36_listener() {
        return ctx.run("deliver", {});
      });
      \u0275\u0275text(37, "Confirm delivery");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "vc-modal", 12);
      \u0275\u0275listener("closed", function SaleActions_Template_vc_modal_closed_38_listener() {
        return ctx.act.set(null);
      });
      \u0275\u0275elementStart(39, "div", 1)(40, "vc-callout", 13);
      \u0275\u0275text(41);
      \u0275\u0275pipe(42, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "div", 2)(44, "label");
      \u0275\u0275text(45, "Retired on behalf of");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "input", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function SaleActions_Template_input_ngModelChange_46_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.beneficiary, $event) || (ctx.beneficiary = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "span", 4);
      \u0275\u0275text(48, "Usually the buyer's legal entity. Shown on the retirement record.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementContainerStart(49, 6);
      \u0275\u0275elementStart(50, "button", 7);
      \u0275\u0275listener("click", function SaleActions_Template_button_click_50_listener() {
        return ctx.act.set(null);
      });
      \u0275\u0275text(51, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "button", 8);
      \u0275\u0275listener("click", function SaleActions_Template_button_click_52_listener() {
        return ctx.run("retire", { beneficiary: ctx.beneficiary.trim() });
      });
      \u0275\u0275text(53, "Retire permanently");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "vc-modal", 15);
      \u0275\u0275listener("closed", function SaleActions_Template_vc_modal_closed_54_listener() {
        return ctx.act.set(null);
      });
      \u0275\u0275elementStart(55, "div", 1)(56, "p");
      \u0275\u0275text(57);
      \u0275\u0275pipe(58, "num");
      \u0275\u0275elementStart(59, "strong");
      \u0275\u0275text(60, "available");
      \u0275\u0275elementEnd();
      \u0275\u0275text(61);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "div", 2)(63, "label");
      \u0275\u0275text(64, "Reason");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "textarea", 16);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function SaleActions_Template_textarea_ngModelChange_65_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.reason, $event) || (ctx.reason = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementContainerStart(66, 6);
      \u0275\u0275elementStart(67, "button", 7);
      \u0275\u0275listener("click", function SaleActions_Template_button_click_67_listener() {
        return ctx.act.set(null);
      });
      \u0275\u0275text(68, "Keep sale");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "button", 17);
      \u0275\u0275listener("click", function SaleActions_Template_button_click_69_listener() {
        return ctx.run("cancel", { reason: ctx.reason.trim() });
      });
      \u0275\u0275text(70, "Cancel sale");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.canSell ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("open", ctx.act() === "contract")("subtitle", ctx.sale().code + " \xB7 " + ctx.sale().buyer_name);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.contractRef);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.tradeDate);
      \u0275\u0275property("max", ctx.today);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || ctx.contractRef.trim().length < 2);
      \u0275\u0275advance(2);
      \u0275\u0275property("open", ctx.act() === "deliver")("subtitle", ctx.sale().code);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(21, 26, ctx.sale().quantity, 3), " t of ", ctx.typeLabel[ctx.sale().credit_type].toLowerCase(), " from ");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.sale().batch_code);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1(" for ", ctx.sale().buyer_name, ".");
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance(2);
      \u0275\u0275property("open", ctx.act() === "retire")("subtitle", ctx.sale().code);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("Retirement is permanent. The ", \u0275\u0275pipeBind2(42, 29, ctx.sale().quantity, 3), " t are claimed on behalf of the beneficiary and can never be sold or transferred again.");
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.beneficiary);
      \u0275\u0275property("placeholder", ctx.sale().buyer_name ?? "Beneficiary");
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.busy() || ctx.beneficiary.trim().length < 2);
      \u0275\u0275advance(2);
      \u0275\u0275property("open", ctx.act() === "cancel")("subtitle", ctx.sale().code + " \xB7 " + ctx.sale().buyer_name);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1("The ", \u0275\u0275pipeBind2(58, 32, ctx.sale().quantity, 3), " t reserved for this sale go back to ");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" in ", ctx.sale().batch_code, ". The sale is kept for the record.");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.reason);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || ctx.reason.trim().length < 3);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, Icon, Callout, Modal, NumPipe], styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n  justify-content: flex-end;\n}\n/*# sourceMappingURL=sale-actions.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SaleActions, [{
    type: Component,
    args: [{ selector: "vcx-sale-actions", imports: [FormsModule, ...KIT, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (canSell) {
      @switch (sale().status) {
        @case ('reserved') { <button class="btn btn-primary" [class.btn-sm]="small()" (click)="open('contract')"><vc-icon name="file-check" [size]="14" />{{ small() ? 'Contract' : 'Record contract' }}</button> }
        @case ('contracted') { <button class="btn btn-primary" [class.btn-sm]="small()" (click)="open('deliver')"><vc-icon name="send" [size]="14" />Deliver</button> }
        @case ('delivered') { <button class="btn btn-primary" [class.btn-sm]="small()" (click)="open('retire')"><vc-icon name="archive" [size]="14" />Retire</button> }
      }
      @if (sale().status === 'reserved' || sale().status === 'contracted') {
        <button class="btn btn-ghost" [class.btn-sm]="small()" (click)="open('cancel')" title="Cancel sale"><vc-icon name="ban" [size]="14" />@if (!small()) { Cancel sale }</button>
      }
    }

    <vc-modal [open]="act() === 'contract'" (closed)="act.set(null)" title="Record the contract" [subtitle]="sale().code + ' \xB7 ' + sale().buyer_name" width="500px">
      <div class="stack">
        <div class="field"><label>Contract reference</label>
          <input class="input mono" [(ngModel)]="contractRef" placeholder="e.g. ERPA-2026-014" maxlength="120" />
          <span class="hint">The buyer's purchase order or emission-reduction purchase agreement number.</span></div>
        <div class="field"><label>Trade date</label><input class="input" type="date" [(ngModel)]="tradeDate" [max]="today" /></div>
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="act.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || contractRef.trim().length < 2" (click)="run('contract', { contract_ref: contractRef.trim(), trade_date: tradeDate || null })">Record contract</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="act() === 'deliver'" (closed)="act.set(null)" title="Deliver credits to the buyer?" [subtitle]="sale().code" width="500px">
      <p>{{ sale().quantity | num: 3 }} t of {{ typeLabel[sale().credit_type].toLowerCase() }} from <span class="mono">{{ sale().batch_code }}</span>
        move from <strong>reserved</strong> to <strong>sold</strong> for {{ sale().buyer_name }}.</p>
      <p class="muted small" style="margin-top:10px">Once delivered, the sale can no longer be cancelled, and the farmer benefit pool can be prepared.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="act.set(null)">Not yet</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="run('deliver', {})">Confirm delivery</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="act() === 'retire'" (closed)="act.set(null)" title="Retire these credits" [subtitle]="sale().code" width="520px">
      <div class="stack">
        <vc-callout tone="warn" icon="lock">Retirement is permanent. The {{ sale().quantity | num: 3 }} t are claimed on behalf of the beneficiary and can never be sold or transferred again.</vc-callout>
        <div class="field"><label>Retired on behalf of</label>
          <input class="input" [(ngModel)]="beneficiary" [placeholder]="sale().buyer_name ?? 'Beneficiary'" maxlength="200" />
          <span class="hint">Usually the buyer's legal entity. Shown on the retirement record.</span></div>
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="act.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || beneficiary.trim().length < 2" (click)="run('retire', { beneficiary: beneficiary.trim() })">Retire permanently</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="act() === 'cancel'" (closed)="act.set(null)" title="Cancel this sale?" [subtitle]="sale().code + ' \xB7 ' + sale().buyer_name" width="500px">
      <div class="stack">
        <p>The {{ sale().quantity | num: 3 }} t reserved for this sale go back to <strong>available</strong> in {{ sale().batch_code }}. The sale is kept for the record.</p>
        <div class="field"><label>Reason</label><textarea class="input" [(ngModel)]="reason" placeholder="e.g. Buyer withdrew before contract"></textarea></div>
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="act.set(null)">Keep sale</button>
        <button class="btn btn-danger" [disabled]="busy() || reason.trim().length < 3" (click)="run('cancel', { reason: reason.trim() })">Cancel sale</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;39fb59538fdc275f;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sales\\sale-actions.ts */\n:host {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n  justify-content: flex-end;\n}\n/*# sourceMappingURL=sale-actions.css.map */\n"] }]
  }], null, { sale: [{ type: Input, args: [{ isSignal: true, alias: "sale", required: true }] }], small: [{ type: Input, args: [{ isSignal: true, alias: "small", required: false }] }], changed: [{ type: Output, args: ["changed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SaleActions, { className: "SaleActions", filePath: "src/app/features/sales/sale-actions.ts", lineNumber: 114 });
})();

// src/app/features/sales/sale-report.ts
function SaleReportCard_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275element(1, "br");
    \u0275\u0275text(2);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const r_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275textInterpolate1(" ", r_r1.batch.serial_start);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("to ", r_r1.batch.serial_end, " ");
  }
}
function SaleReportCard_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2014 ");
  }
}
function SaleReportCard_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Retired on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const r_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, r_r1.sale.retired_at));
  }
}
function SaleReportCard_Conditional_111_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "br")(3, "vc-hash", 15);
  }
  if (rf & 2) {
    const p_r2 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Version ", p_r2.version);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", p_r2.sha256);
  }
}
function SaleReportCard_Conditional_112_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1, "Not yet issued");
    \u0275\u0275elementEnd();
  }
}
var SaleReportCard = class _SaleReportCard {
  report = input.required(
    ...ngDevMode ? [{ debugName: "report" }] : (
      /* istanbul ignore next */
      []
    )
  );
  typeLabel = TYPE_LABEL;
  static \u0275fac = function SaleReportCard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SaleReportCard)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SaleReportCard, selectors: [["vcx-sale-report"]], inputs: { report: [1, "report"] }, decls: 117, vars: 57, consts: [[1, "rep"], [1, "rh"], [1, "eyebrow"], [1, "seal"], [3, "status"], [3, "cls"], [1, "band"], [1, "mono"], [1, "cols"], ["name", "landmark", 3, "size"], [1, "kv"], [1, "mono", "small"], ["name", "sprout", 3, "size"], [1, "num"], ["name", "fingerprint", 3, "size"], [3, "value"], [1, "subtle"], [1, "rf"], ["name", "shield", 3, "size"], [1, "small"]], template: function SaleReportCard_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275declareLet(0);
      \u0275\u0275elementStart(1, "article", 0)(2, "header", 1)(3, "div")(4, "div", 2);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "h2");
      \u0275\u0275text(7);
      \u0275\u0275pipe(8, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p");
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 3);
      \u0275\u0275element(12, "vc-badge", 4)(13, "vc-dc", 5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 6)(15, "div")(16, "span");
      \u0275\u0275text(17, "Sale");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "strong", 7);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div")(21, "span");
      \u0275\u0275text(22, "Contract");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "strong", 7);
      \u0275\u0275text(24);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div")(26, "span");
      \u0275\u0275text(27, "Trade date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "strong");
      \u0275\u0275text(29);
      \u0275\u0275pipe(30, "day");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div")(32, "span");
      \u0275\u0275text(33, "Retired for");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "strong");
      \u0275\u0275text(35);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "div", 8)(37, "section")(38, "h4");
      \u0275\u0275element(39, "vc-icon", 9);
      \u0275\u0275text(40, "Registry");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "dl", 10)(42, "dt");
      \u0275\u0275text(43, "Registry");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "dd");
      \u0275\u0275text(45);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "dt");
      \u0275\u0275text(47, "Project reference");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "dd", 11);
      \u0275\u0275text(49);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "dt");
      \u0275\u0275text(51, "Batch");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "dd", 11);
      \u0275\u0275text(53);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "dt");
      \u0275\u0275text(55, "Serials");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "dd", 11);
      \u0275\u0275conditionalCreate(57, SaleReportCard_Conditional_57_Template, 3, 2)(58, SaleReportCard_Conditional_58_Template, 1, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(59, SaleReportCard_Conditional_59_Template, 5, 3);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "section")(61, "h4");
      \u0275\u0275element(62, "vc-icon", 12);
      \u0275\u0275text(63, "Origin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "dl", 10)(65, "dt");
      \u0275\u0275text(66, "Project");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "dd");
      \u0275\u0275text(68);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "dt");
      \u0275\u0275text(70, "Methodology");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "dd");
      \u0275\u0275text(72);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "dt");
      \u0275\u0275text(74, "Farmland");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(75, "dd", 13);
      \u0275\u0275text(76);
      \u0275\u0275pipe(77, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "dt");
      \u0275\u0275text(79, "Monitoring period");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(80, "dd");
      \u0275\u0275text(81);
      \u0275\u0275pipe(82, "day");
      \u0275\u0275pipe(83, "day");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(84, "dt");
      \u0275\u0275text(85, "Batch composition");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "dd", 13);
      \u0275\u0275text(87);
      \u0275\u0275pipe(88, "num");
      \u0275\u0275pipe(89, "num");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(90, "section")(91, "h4");
      \u0275\u0275element(92, "vc-icon", 14);
      \u0275\u0275text(93, "Evidence trail");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(94, "dl", 10)(95, "dt");
      \u0275\u0275text(96, "Net result");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(97, "dd", 13);
      \u0275\u0275text(98);
      \u0275\u0275pipe(99, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(100, "dt");
      \u0275\u0275text(101, "Engine");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(102, "dd", 11);
      \u0275\u0275text(103);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(104, "dt");
      \u0275\u0275text(105, "Input snapshot");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(106, "dd");
      \u0275\u0275element(107, "vc-hash", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(108, "dt");
      \u0275\u0275text(109, "Verification package");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "dd");
      \u0275\u0275conditionalCreate(111, SaleReportCard_Conditional_111_Template, 4, 2)(112, SaleReportCard_Conditional_112_Template, 2, 0, "span", 16);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(113, "footer", 17);
      \u0275\u0275element(114, "vc-icon", 18);
      \u0275\u0275elementStart(115, "span");
      \u0275\u0275text(116);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_26_0;
      const r_r3 = \u0275\u0275storeLet(ctx.report());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(r_r3.report);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(8, 36, r_r3.sale.quantity_t_co2e, 3), " tCO\u2082e of soil-carbon ", ctx.typeLabel[r_r3.sale.credit_type]?.toLowerCase());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate2("", r_r3.project.name, " \xB7 vintage ", r_r3.batch.vintage);
      \u0275\u0275advance(2);
      \u0275\u0275property("status", r_r3.sale.status);
      \u0275\u0275advance();
      \u0275\u0275property("cls", r_r3.data_class);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(r_r3.sale.code);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(r_r3.sale.contract_ref || "\u2014");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(30, 39, r_r3.sale.trade_date));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(r_r3.sale.retirement_beneficiary || "Not retired yet");
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(r_r3.batch.registry || "Pending issuance");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(r_r3.batch.registry_project_ref || "\u2014");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(r_r3.batch.code);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(r_r3.batch.serial_start ? 57 : 58);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(r_r3.sale.retired_at ? 59 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate2("", r_r3.project.code, " \xB7 ", r_r3.project.name);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(r_r3.project.methodology);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(77, 41, r_r3.footprint.area_ha, 1), " ha across ", r_r3.footprint.fields, " fields");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(82, 44, r_r3.calculation.period_start), " \u2013 ", \u0275\u0275pipeBind1(83, 46, r_r3.calculation.period_end));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(88, 48, r_r3.batch.removals_t_co2e, 1), " t removals \xB7 ", \u0275\u0275pipeBind2(89, 51, r_r3.batch.reductions_t_co2e, 1), " t reductions");
      \u0275\u0275advance(5);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(99, 54, r_r3.calculation.net_t_co2e, 2), " tCO\u2082e");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(r_r3.calculation.engine_version);
      \u0275\u0275advance(4);
      \u0275\u0275property("value", r_r3.calculation.snapshot_sha256);
      \u0275\u0275advance(4);
      \u0275\u0275conditional((tmp_26_0 = r_r3.verification_package) ? 111 : 112, tmp_26_0);
      \u0275\u0275advance(3);
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate2("", r_r3.privacy, " Footprint basis: ", r_r3.footprint.basis, ".");
    }
  }, dependencies: [Icon, Badge, DataClass, Hash, NumPipe, DayPipe], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  container-type: inline-size;\n}\n.rep[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-lg);\n  box-shadow: var(--%NS%shadow);\n  overflow: hidden;\n}\n.rh[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 24px 26px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      var(--%NS%forest-900),\n      var(--%NS%forest-700));\n  color: #fff;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: var(--%NS%forest-300);\n  font-weight: 600;\n}\n.rh[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 22px;\n  margin-top: 6px;\n  letter-spacing: -0.015em;\n}\n.rh[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  color: rgba(255, 255, 255, 0.72);\n}\n.seal[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 8px;\n}\n.band[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  border-bottom: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n}\n.band[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  padding: 14px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  border-right: 1px solid var(--%NS%border);\n  min-width: 0;\n}\n.band[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:last-child {\n  border-right: 0;\n}\n.band[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.band[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 600;\n  overflow-wrap: anywhere;\n}\n.cols[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.cols[_ngcontent-%COMP%]   section[_ngcontent-%COMP%] {\n  padding: 18px 20px;\n  border-right: 1px solid var(--%NS%border);\n}\n.cols[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]:last-child {\n  border-right: 0;\n}\nh4[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  font-weight: 600;\n  margin: 0 0 12px;\n  color: var(--%NS%forest-700);\n}\n.kv[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(100px, 40%) 1fr;\n  font-size: 13px;\n}\n.rf[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 20px;\n  border-top: 1px solid var(--%NS%border);\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  background: var(--%NS%surface-2);\n}\n@container (max-width: 860px) {\n  .cols[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n  .cols[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]:nth-child(2) {\n    border-right: 0;\n  }\n  .cols[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]:last-child {\n    grid-column: 1/-1;\n    border-top: 1px solid var(--%NS%border);\n  }\n}\n@container (max-width: 560px) {\n  .cols[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .cols[_ngcontent-%COMP%]   section[_ngcontent-%COMP%] {\n    border-right: 0;\n    border-bottom: 1px solid var(--%NS%border);\n  }\n  .band[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n@media (max-width: 600px) {\n  .rh[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .seal[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    flex-direction: row;\n  }\n  .band[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n  .band[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:nth-child(2n) {\n    border-right: 0;\n  }\n}\n@media print {\n  .rep[_ngcontent-%COMP%] {\n    box-shadow: none;\n    border-color: #ccc;\n  }\n  .rh[_ngcontent-%COMP%] {\n    -webkit-print-color-adjust: exact;\n    print-color-adjust: exact;\n  }\n  .cols[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n/*# sourceMappingURL=sale-report.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SaleReportCard, [{
    type: Component,
    args: [{ selector: "vcx-sale-report", imports: [...KIT, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @let r = report();
    <article class="rep">
      <header class="rh">
        <div>
          <div class="eyebrow">{{ r.report }}</div>
          <h2>{{ r.sale.quantity_t_co2e | num: 3 }} tCO\u2082e of soil-carbon {{ typeLabel[r.sale.credit_type]?.toLowerCase() }}</h2>
          <p>{{ r.project.name }} \xB7 vintage {{ r.batch.vintage }}</p>
        </div>
        <div class="seal">
          <vc-badge [status]="r.sale.status" />
          <vc-dc [cls]="r.data_class" />
        </div>
      </header>

      <div class="band">
        <div><span>Sale</span><strong class="mono">{{ r.sale.code }}</strong></div>
        <div><span>Contract</span><strong class="mono">{{ r.sale.contract_ref || '\u2014' }}</strong></div>
        <div><span>Trade date</span><strong>{{ r.sale.trade_date | day }}</strong></div>
        <div><span>Retired for</span><strong>{{ r.sale.retirement_beneficiary || 'Not retired yet' }}</strong></div>
      </div>

      <div class="cols">
        <section>
          <h4><vc-icon name="landmark" [size]="15" />Registry</h4>
          <dl class="kv">
            <dt>Registry</dt><dd>{{ r.batch.registry || 'Pending issuance' }}</dd>
            <dt>Project reference</dt><dd class="mono small">{{ r.batch.registry_project_ref || '\u2014' }}</dd>
            <dt>Batch</dt><dd class="mono small">{{ r.batch.code }}</dd>
            <dt>Serials</dt><dd class="mono small">@if (r.batch.serial_start) { {{ r.batch.serial_start }}<br />to {{ r.batch.serial_end }} } @else { \u2014 }</dd>
            @if (r.sale.retired_at) { <dt>Retired on</dt><dd>{{ r.sale.retired_at | day }}</dd> }
          </dl>
        </section>
        <section>
          <h4><vc-icon name="sprout" [size]="15" />Origin</h4>
          <dl class="kv">
            <dt>Project</dt><dd>{{ r.project.code }} \xB7 {{ r.project.name }}</dd>
            <dt>Methodology</dt><dd>{{ r.project.methodology }}</dd>
            <dt>Farmland</dt><dd class="num">{{ r.footprint.area_ha | num: 1 }} ha across {{ r.footprint.fields }} fields</dd>
            <dt>Monitoring period</dt><dd>{{ r.calculation.period_start | day }} \u2013 {{ r.calculation.period_end | day }}</dd>
            <dt>Batch composition</dt><dd class="num">{{ r.batch.removals_t_co2e | num: 1 }} t removals \xB7 {{ r.batch.reductions_t_co2e | num: 1 }} t reductions</dd>
          </dl>
        </section>
        <section>
          <h4><vc-icon name="fingerprint" [size]="15" />Evidence trail</h4>
          <dl class="kv">
            <dt>Net result</dt><dd class="num">{{ r.calculation.net_t_co2e | num: 2 }} tCO\u2082e</dd>
            <dt>Engine</dt><dd class="mono small">{{ r.calculation.engine_version }}</dd>
            <dt>Input snapshot</dt><dd><vc-hash [value]="r.calculation.snapshot_sha256" /></dd>
            <dt>Verification package</dt>
            <dd>@if (r.verification_package; as p) { <span class="small">Version {{ p.version }}</span><br /><vc-hash [value]="p.sha256" /> } @else { <span class="subtle">Not yet issued</span> }</dd>
          </dl>
        </section>
      </div>

      <footer class="rf">
        <vc-icon name="shield" [size]="14" />
        <span>{{ r.privacy }} Footprint basis: {{ r.footprint.basis }}.</span>
      </footer>
    </article>
  `, styles: ["/* angular:styles/component:scss;537d2a4a2e857fb2;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sales\\sale-report.ts */\n:host {\n  display: block;\n  container-type: inline-size;\n}\n.rep {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow);\n  overflow: hidden;\n}\n.rh {\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 24px 26px 20px;\n  background:\n    linear-gradient(\n      135deg,\n      var(--forest-900),\n      var(--forest-700));\n  color: #fff;\n}\n.eyebrow {\n  font-size: 11.5px;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: var(--forest-300);\n  font-weight: 600;\n}\n.rh h2 {\n  color: #fff;\n  font-size: 22px;\n  margin-top: 6px;\n  letter-spacing: -0.015em;\n}\n.rh p {\n  margin-top: 4px;\n  color: rgba(255, 255, 255, 0.72);\n}\n.seal {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 8px;\n}\n.band {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  border-bottom: 1px solid var(--border);\n  background: var(--surface-2);\n}\n.band div {\n  padding: 14px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  border-right: 1px solid var(--border);\n  min-width: 0;\n}\n.band div:last-child {\n  border-right: 0;\n}\n.band span {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.band strong {\n  font-weight: 600;\n  overflow-wrap: anywhere;\n}\n.cols {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.cols section {\n  padding: 18px 20px;\n  border-right: 1px solid var(--border);\n}\n.cols section:last-child {\n  border-right: 0;\n}\nh4 {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  font-weight: 600;\n  margin: 0 0 12px;\n  color: var(--forest-700);\n}\n.kv {\n  grid-template-columns: minmax(100px, 40%) 1fr;\n  font-size: 13px;\n}\n.rf {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 20px;\n  border-top: 1px solid var(--border);\n  font-size: 12.5px;\n  color: var(--text-2);\n  background: var(--surface-2);\n}\n@container (max-width: 860px) {\n  .cols {\n    grid-template-columns: 1fr 1fr;\n  }\n  .cols section:nth-child(2) {\n    border-right: 0;\n  }\n  .cols section:last-child {\n    grid-column: 1/-1;\n    border-top: 1px solid var(--border);\n  }\n}\n@container (max-width: 560px) {\n  .cols {\n    grid-template-columns: 1fr;\n  }\n  .cols section {\n    border-right: 0;\n    border-bottom: 1px solid var(--border);\n  }\n  .band {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n@media (max-width: 600px) {\n  .rh {\n    flex-direction: column;\n  }\n  .seal {\n    align-items: flex-start;\n    flex-direction: row;\n  }\n  .band {\n    grid-template-columns: 1fr 1fr;\n  }\n  .band div:nth-child(2n) {\n    border-right: 0;\n  }\n}\n@media print {\n  .rep {\n    box-shadow: none;\n    border-color: #ccc;\n  }\n  .rh {\n    -webkit-print-color-adjust: exact;\n    print-color-adjust: exact;\n  }\n  .cols {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n/*# sourceMappingURL=sale-report.css.map */\n"] }]
  }], null, { report: [{ type: Input, args: [{ isSignal: true, alias: "report", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SaleReportCard, { className: "SaleReportCard", filePath: "src/app/features/sales/sale-report.ts", lineNumber: 109 });
})();

export {
  SALE_STEPS,
  KIND_LABEL,
  SaleActions,
  SaleReportCard
};
//# debugId=35bcbf33-acc5-5e1e-9794-1ecd7f8adf2a
//# sourceMappingURL=chunk-DF4XX4WJ.js.map
