import {
  KIND_LABEL,
  SALE_STEPS,
  SaleActions,
  SaleReportCard
} from "./chunk-YB42EZS5.js";
import {
  CREDIT_TYPES,
  Steps,
  TYPE_COLOR,
  TYPE_ICON,
  TYPE_LABEL,
  apiFieldErrors,
  money
} from "./chunk-W6OT2EF5.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
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
} from "./chunk-G6POHVBO.js";
import {
  Badge,
  Callout,
  Empty,
  ErrorBox,
  KIT,
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
  ɵɵpureFunction2,
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

// src/app/features/sales/sale-detail.page.ts
var _c0 = (a0) => ["/app/credits", a0];
function SaleDetailPage_Conditional_3_Template(rf, ctx) {
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
function SaleDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function SaleDetailPage_Conditional_5_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 21);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r0.reportError());
  }
}
function SaleDetailPage_Conditional_5_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vcx-sale-report", 22);
  }
  if (rf & 2) {
    \u0275\u0275property("report", ctx);
  }
}
function SaleDetailPage_Conditional_5_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-loading", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 5);
  }
}
function SaleDetailPage_Conditional_5_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 33);
    \u0275\u0275text(1, " Delivered revenue can now be shared with farmers. Finance prepares the benefit pool under ");
    \u0275\u0275elementStart(2, "a", 34);
    \u0275\u0275text(3, "Benefits");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ". ");
    \u0275\u0275elementEnd();
  }
}
function SaleDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-page-header", 5)(1, "button", 6);
    \u0275\u0275listener("click", function SaleDetailPage_Conditional_5_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.print());
    });
    \u0275\u0275element(2, "vc-icon", 7);
    \u0275\u0275text(3, "Print summary");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "vcx-sale-actions", 8);
    \u0275\u0275listener("changed", function SaleDetailPage_Conditional_5_Template_vcx_sale_actions_changed_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.s$.set($event);
      return \u0275\u0275resetView(ctx_r0.loadReport());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "section", 9);
    \u0275\u0275element(6, "vcx-steps", 10);
    \u0275\u0275elementStart(7, "p", 11);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 12);
    \u0275\u0275element(10, "vc-stat", 13);
    \u0275\u0275pipe(11, "num");
    \u0275\u0275element(12, "vc-stat", 14)(13, "vc-stat", 15)(14, "vc-stat", 16);
    \u0275\u0275pipe(15, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 17)(17, "div", 18)(18, "h3", 19);
    \u0275\u0275text(19, "Supply-chain report ");
    \u0275\u0275elementStart(20, "span", 20);
    \u0275\u0275text(21, "\u2014 what the buyer sees");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(22, SaleDetailPage_Conditional_5_Conditional_22_Template, 1, 1, "vc-error", 21)(23, SaleDetailPage_Conditional_5_Conditional_23_Template, 1, 1, "vcx-sale-report", 22)(24, SaleDetailPage_Conditional_5_Conditional_24_Template, 2, 1, "div", 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "section", 23)(26, "div", 24)(27, "h3");
    \u0275\u0275text(28, "Sale record");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 25)(30, "dl", 26)(31, "dt");
    \u0275\u0275text(32, "Buyer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dd");
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "dt");
    \u0275\u0275text(36, "Batch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "dd")(38, "a", 27);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "dt");
    \u0275\u0275text(41, "Credit type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "dd")(43, "span", 28);
    \u0275\u0275element(44, "vc-icon", 29);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "dt");
    \u0275\u0275text(47, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "dd");
    \u0275\u0275element(49, "vc-badge", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "dt");
    \u0275\u0275text(51, "Contract");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "dd", 31);
    \u0275\u0275text(53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "dt");
    \u0275\u0275text(55, "Trade date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "dd");
    \u0275\u0275text(57);
    \u0275\u0275pipe(58, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "dt");
    \u0275\u0275text(60, "Retired for");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "dd");
    \u0275\u0275text(62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "dt");
    \u0275\u0275text(64, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "dd", 32);
    \u0275\u0275text(66);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(67, SaleDetailPage_Conditional_5_Conditional_67_Template, 5, 0, "vc-callout", 33);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_16_0;
    const s_r3 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("title", s_r3.code)("eyebrow", "Sale \xB7 " + s_r3.buyer_name)("subtitle", ctx_r0.subtitle(s_r3));
    \u0275\u0275advance(4);
    \u0275\u0275property("sale", s_r3);
    \u0275\u0275advance(2);
    \u0275\u0275property("steps", ctx_r0.steps)("current", s_r3.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.stepText(s_r3.status));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", \u0275\u0275pipeBind2(11, 27, s_r3.quantity, 3))("hint", ctx_r0.typeLabel[s_r3.credit_type] + " \xB7 vintage " + s_r3.vintage);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.m(s_r3.unit_price, s_r3.currency));
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.m(s_r3.total_amount, s_r3.currency))("accent", true);
    \u0275\u0275advance();
    \u0275\u0275property("value", s_r3.batch_code)("hint", "Created " + \u0275\u0275pipeBind1(15, 30, s_r3.created_at));
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r0.reportError() ? 22 : (tmp_16_0 = ctx_r0.report()) ? 23 : 24, tmp_16_0);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(s_r3.buyer_name);
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(34, _c0, s_r3.batch_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r3.batch_code);
    \u0275\u0275advance(5);
    \u0275\u0275property("name", ctx_r0.ticon[s_r3.credit_type])("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.typeLabel[s_r3.credit_type]);
    \u0275\u0275advance(4);
    \u0275\u0275property("status", s_r3.status);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r3.contract_ref || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(58, 32, s_r3.trade_date));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(s_r3.retirement_beneficiary || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r3.notes || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r3.status === "delivered" || s_r3.status === "retired" ? 67 : -1);
  }
}
var SaleDetailPage = class _SaleDetailPage {
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  steps = SALE_STEPS;
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;
  s$ = signal(
    null,
    ...ngDevMode ? [{ debugName: "s$" }] : (
      /* istanbul ignore next */
      []
    )
  );
  s = this.s$.asReadonly();
  report = signal(
    null,
    ...ngDevMode ? [{ debugName: "report" }] : (
      /* istanbul ignore next */
      []
    )
  );
  reportError = signal(
    null,
    ...ngDevMode ? [{ debugName: "reportError" }] : (
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
  ngOnInit() {
    this.api.get(`/sales/${this.id()}`).subscribe({
      next: (r) => {
        this.s$.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
    this.loadReport();
  }
  loadReport() {
    this.reportError.set(null);
    this.api.get(`/sales/${this.id()}/report`).subscribe({
      next: (r) => this.report.set(r),
      error: (e) => this.reportError.set(e.message)
    });
  }
  m(v, c) {
    return money(v, c);
  }
  subtitle(s) {
    return `${s.quantity} t of ${TYPE_LABEL[s.credit_type].toLowerCase()} from ${s.batch_code} (vintage ${s.vintage}).`;
  }
  print() {
    window.print();
  }
  stepText(st) {
    return {
      reserved: "Reserved: the tonnes are held for this buyer and can no longer be sold to anyone else. Record the contract next.",
      contracted: "Contracted: the deal is signed. Deliver when the registry transfer to the buyer is complete.",
      delivered: "Delivered: the credits belong to the buyer. Retire them when the buyer makes their claim.",
      retired: "Retired: permanently claimed on behalf of the beneficiary. Nothing more to do.",
      cancelled: "Cancelled: the reserved tonnes went back to the available balance."
    }[st] ?? "";
  }
  static \u0275fac = function SaleDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SaleDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SaleDetailPage, selectors: [["vc-sale-detail"]], inputs: { id: [1, "id"] }, decls: 6, vars: 2, consts: [["routerLink", "/app/sales", 1, "back", "small", "no-print"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this sale", 3, "message"], [3, "rows"], [3, "title", "eyebrow", "subtitle"], ["actions", "", 1, "btn", "btn-secondary", "no-print", 3, "click"], ["name", "download"], ["actions", "", 1, "no-print", 3, "changed", "sale"], [1, "card", "card-pad", "progress", "no-print"], [3, "steps", "current"], [1, "small", "muted"], [1, "grid", "grid-4", "facts"], ["label", "Quantity", "unit", "tCO\u2082e", 3, "value", "hint"], ["label", "Unit price", "hint", "per tonne", 3, "value"], ["label", "Sale value", "hint", "Quantity \xD7 unit price", 3, "value", "accent"], ["label", "From batch", 3, "value", "hint"], [1, "grid", "side"], [1, "stack"], [1, "h"], [1, "subtle", "small"], ["title", "Couldn't build the report", 3, "message"], [3, "report"], [1, "card", "no-print"], [1, "card-head"], [1, "card-body"], [1, "kv"], [1, "mono", "small", 3, "routerLink"], [1, "tchip"], [1, "tic", 3, "name", "size"], [3, "status"], [1, "mono", "small"], [1, "muted"], ["tone", "ok", "icon", "hand-coins", 2, "margin-top", "16px"], ["routerLink", "/app/benefits"]], template: function SaleDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All sales");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, SaleDetailPage_Conditional_3_Template, 2, 1, "div", 2)(4, SaleDetailPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, SaleDetailPage_Conditional_5_Template, 68, 36);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.s()) ? 5 : -1, tmp_1_0);
    }
  }, dependencies: [RouterLink, Icon, Badge, PageHeader, Stat, Loading, ErrorBox, Callout, Steps, SaleActions, SaleReportCard, NumPipe, DayPipe], styles: ["\n.tic[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-500);\n  vertical-align: -2px;\n}\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  margin-bottom: 14px;\n  color: var(--%NS%text-2);\n}\n.progress[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  flex-wrap: wrap;\n  margin-bottom: 16px;\n}\n.progress[_ngcontent-%COMP%]   vcx-steps[_ngcontent-%COMP%] {\n  flex: 0 1 520px;\n}\n.facts[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.side[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) 340px;\n  align-items: start;\n}\n.h[_ngcontent-%COMP%] {\n  font-size: 15px;\n}\n.tchip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.tchip[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n@media (max-width: 1180px) {\n  .side[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n@media print {\n  .facts[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .side[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=sale-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SaleDetailPage, [{
    type: Component,
    args: [{ selector: "vc-sale-detail", imports: [RouterLink, ...KIT, NumPipe, DayPipe, Steps, SaleActions, SaleReportCard], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/sales" class="back small no-print"><vc-icon name="arrow-left" [size]="14" />All sales</a>
    @if (loading()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this sale" [message]="error()!" />
    } @else if (s(); as s) {
      <vc-page-header [title]="s.code" [eyebrow]="'Sale \xB7 ' + s.buyer_name" [subtitle]="subtitle(s)">
        <button actions class="btn btn-secondary no-print" (click)="print()"><vc-icon name="download" />Print summary</button>
        <vcx-sale-actions actions class="no-print" [sale]="s" (changed)="s$.set($event); loadReport()" />
      </vc-page-header>

      <section class="card card-pad progress no-print">
        <vcx-steps [steps]="steps" [current]="s.status" />
        <p class="small muted">{{ stepText(s.status) }}</p>
      </section>

      <div class="grid grid-4 facts">
        <vc-stat label="Quantity" [value]="s.quantity | num: 3" unit="tCO\u2082e" [hint]="typeLabel[s.credit_type] + ' \xB7 vintage ' + s.vintage" />
        <vc-stat label="Unit price" [value]="m(s.unit_price, s.currency)" hint="per tonne" />
        <vc-stat label="Sale value" [value]="m(s.total_amount, s.currency)" [accent]="true" hint="Quantity \xD7 unit price" />
        <vc-stat label="From batch" [value]="s.batch_code" [hint]="'Created ' + (s.created_at | day)" />
      </div>

      <div class="grid side">
        <div class="stack">
          <h3 class="h">Supply-chain report <span class="subtle small">\u2014 what the buyer sees</span></h3>
          @if (reportError()) {
            <vc-error title="Couldn't build the report" [message]="reportError()!" />
          } @else if (report(); as r) {
            <vcx-sale-report [report]="r" />
          } @else { <div class="card"><vc-loading [rows]="5" /></div> }
        </div>
        <section class="card no-print">
          <div class="card-head"><h3>Sale record</h3></div>
          <div class="card-body">
            <dl class="kv">
              <dt>Buyer</dt><dd>{{ s.buyer_name }}</dd>
              <dt>Batch</dt><dd><a [routerLink]="['/app/credits', s.batch_id]" class="mono small">{{ s.batch_code }}</a></dd>
              <dt>Credit type</dt><dd><span class="tchip"><vc-icon class="tic" [name]="ticon[s.credit_type]" [size]="13" />{{ typeLabel[s.credit_type] }}</span></dd>
              <dt>Status</dt><dd><vc-badge [status]="s.status" /></dd>
              <dt>Contract</dt><dd class="mono small">{{ s.contract_ref || '\u2014' }}</dd>
              <dt>Trade date</dt><dd>{{ s.trade_date | day }}</dd>
              <dt>Retired for</dt><dd>{{ s.retirement_beneficiary || '\u2014' }}</dd>
              <dt>Notes</dt><dd class="muted">{{ s.notes || '\u2014' }}</dd>
            </dl>
            @if (s.status === 'delivered' || s.status === 'retired') {
              <vc-callout tone="ok" icon="hand-coins" style="margin-top:16px">
                Delivered revenue can now be shared with farmers. Finance prepares the benefit pool under
                <a routerLink="/app/benefits">Benefits</a>.
              </vc-callout>
            }
          </div>
        </section>
      </div>
    }
  `, styles: ["/* angular:styles/component:scss;33e48d075570b1a9;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sales\\sale-detail.page.ts */\n.tic {\n  color: var(--stone-500);\n  vertical-align: -2px;\n}\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  margin-bottom: 14px;\n  color: var(--text-2);\n}\n.progress {\n  display: flex;\n  align-items: center;\n  gap: 24px;\n  flex-wrap: wrap;\n  margin-bottom: 16px;\n}\n.progress vcx-steps {\n  flex: 0 1 520px;\n}\n.facts {\n  margin-bottom: 24px;\n}\n.side {\n  grid-template-columns: minmax(0, 1fr) 340px;\n  align-items: start;\n}\n.h {\n  font-size: 15px;\n}\n.tchip {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.tchip i {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n@media (max-width: 1180px) {\n  .side {\n    grid-template-columns: 1fr;\n  }\n}\n@media print {\n  .facts {\n    display: none;\n  }\n  .side {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=sale-detail.page.css.map */\n"] }]
  }], null, { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SaleDetailPage, { className: "SaleDetailPage", filePath: "src/app/features/sales/sale-detail.page.ts", lineNumber: 84 });
})();

// src/app/features/sales/buyer-form.ts
var _forTrack0 = ($index, $item) => $item.id;
function BuyerForm_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.fe()["name"]);
  }
}
function BuyerForm_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const k_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("value", k_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.kindLabel[k_r2]);
  }
}
function BuyerForm_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.fe()["contact_email"]);
  }
}
function BuyerForm_For_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r3 = ctx.$implicit;
    \u0275\u0275property("value", u_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", u_r3.full_name, " \xB7 ", u_r3.email);
  }
}
function BuyerForm_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.fe()["user_id"]);
  }
}
function BuyerForm_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 20);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
var BuyerForm = class _BuyerForm {
  api = inject(ApiService);
  toast = inject(ToastService);
  open = input(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  buyer = input(
    null,
    ...ngDevMode ? [{ debugName: "buyer" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saved = output();
  closed = output();
  kinds = ["corporate", "trader", "ngo", "government"];
  kindLabel = KIND_LABEL;
  users = signal(
    [],
    ...ngDevMode ? [{ debugName: "users" }] : (
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
  fe = signal(
    {},
    ...ngDevMode ? [{ debugName: "fe" }] : (
      /* istanbul ignore next */
      []
    )
  );
  f = this.blank();
  constructor() {
    this.api.get("/users").subscribe({ next: (u) => this.users.set(u.filter((x) => x.role === "buyer")), error: () => {
    } });
    effect(() => {
      if (!this.open())
        return;
      const b = this.buyer();
      this.error.set(null);
      this.fe.set({});
      if (!b) {
        this.f = this.blank();
        return;
      }
      const r = b.requirements ?? {};
      const types = r["credit_types"] ?? ["removal", "reduction"];
      this.f = {
        name: b.name,
        kind: b.kind,
        country: b.country ?? "",
        contact_name: b.contact_name ?? "",
        contact_email: b.contact_email ?? "",
        removal: types.includes("removal"),
        reduction: types.includes("reduction"),
        min_vintage: r["min_vintage"] ?? null,
        registry: r["registry"] ?? "",
        notes: r["notes"] ?? "",
        user_id: b.user_id ?? ""
      };
    });
  }
  blank() {
    return {
      name: "",
      kind: "corporate",
      country: "India",
      contact_name: "",
      contact_email: "",
      removal: true,
      reduction: true,
      min_vintage: null,
      registry: "",
      notes: "",
      user_id: ""
    };
  }
  save() {
    const f = this.f;
    const requirements = __spreadProps(__spreadValues({}, this.buyer()?.requirements ?? {}), {
      credit_types: [f.removal && "removal", f.reduction && "reduction"].filter(Boolean),
      min_vintage: f.min_vintage ? Number(f.min_vintage) : null,
      registry: f.registry || null,
      notes: f.notes.trim()
    });
    const body = {
      name: f.name.trim(),
      kind: f.kind,
      country: f.country.trim(),
      contact_name: f.contact_name.trim() || null,
      contact_email: f.contact_email.trim() || null,
      requirements,
      user_id: f.user_id || null
    };
    this.busy.set(true);
    this.error.set(null);
    const b = this.buyer();
    const req = b ? this.api.patch(`/buyers/${b.id}`, body) : this.api.post("/buyers", body);
    req.subscribe({
      next: (r) => {
        this.busy.set(false);
        this.toast.success(b ? "Buyer updated" : "Buyer created", r.name);
        this.saved.emit(r);
      },
      error: (e) => {
        this.busy.set(false);
        this.fe.set(apiFieldErrors(e));
        this.error.set(e.message);
      }
    });
  }
  static \u0275fac = function BuyerForm_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BuyerForm)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BuyerForm, selectors: [["vcx-buyer-form"]], inputs: { open: [1, "open"], buyer: [1, "buyer"] }, outputs: { saved: "saved", closed: "closed" }, decls: 75, vars: 25, consts: [["width", "520px", 3, "closed", "open", "drawer", "title", "subtitle"], [1, "stack"], [1, "field"], ["maxlength", "200", "placeholder", "e.g. Tata Consumer Products", 1, "input", 3, "ngModelChange", "ngModel"], [1, "error"], [1, "form-grid"], [1, "input", 3, "ngModelChange", "ngModel"], [3, "value"], ["maxlength", "80", "placeholder", "India", 1, "input", 3, "ngModelChange", "ngModel"], ["maxlength", "200", 1, "input", 3, "ngModelChange", "ngModel"], ["type", "email", 1, "input", 3, "ngModelChange", "ngModel"], [1, "sec"], [1, "row"], [1, "checkbox"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "2000", "max", "2100", "placeholder", "e.g. 2024", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["value", ""], [1, "field", "span-2"], ["placeholder", "e.g. Needs Scope 3 insetting report; smallholder co-benefits; delivery by March", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], ["title", "Couldn't save the buyer", 3, "message"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"]], template: function BuyerForm_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275listener("closed", function BuyerForm_Template_vc_modal_closed_0_listener() {
        return ctx.closed.emit();
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "label");
      \u0275\u0275text(4, "Organisation name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "input", 3);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_input_ngModelChange_5_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.name, $event) || (ctx.f.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(6, BuyerForm_Conditional_6_Template, 2, 1, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 5)(8, "div", 2)(9, "label");
      \u0275\u0275text(10, "Type");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "select", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_select_ngModelChange_11_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.kind, $event) || (ctx.f.kind = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(12, BuyerForm_For_13_Template, 2, 2, "option", 7, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 2)(15, "label");
      \u0275\u0275text(16, "Country");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 8);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.country, $event) || (ctx.f.country = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 2)(19, "label");
      \u0275\u0275text(20, "Contact person");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "input", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_input_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.contact_name, $event) || (ctx.f.contact_name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 2)(23, "label");
      \u0275\u0275text(24, "Contact email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "input", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_input_ngModelChange_25_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.contact_email, $event) || (ctx.f.contact_email = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(26, BuyerForm_Conditional_26_Template, 2, 1, "span", 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "h3", 11);
      \u0275\u0275text(28, "Purchasing requirements");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "div", 2)(30, "label");
      \u0275\u0275text(31, "Credit types accepted");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 12)(33, "label", 13)(34, "input", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_input_ngModelChange_34_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.removal, $event) || (ctx.f.removal = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275text(35, "Removals");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "label", 13)(37, "input", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_input_ngModelChange_37_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.reduction, $event) || (ctx.f.reduction = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275text(38, "Reductions");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(39, "div", 5)(40, "div", 2)(41, "label");
      \u0275\u0275text(42, "Earliest vintage");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "input", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_input_ngModelChange_43_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.min_vintage, $event) || (ctx.f.min_vintage = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 2)(45, "label");
      \u0275\u0275text(46, "Registry preference");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "select", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_select_ngModelChange_47_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.registry, $event) || (ctx.f.registry = $event);
        return $event;
      });
      \u0275\u0275elementStart(48, "option", 16);
      \u0275\u0275text(49, "Any registry");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "option");
      \u0275\u0275text(51, "Verra");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "option");
      \u0275\u0275text(53, "Gold Standard");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(54, "div", 17)(55, "label");
      \u0275\u0275text(56, "Other requirements");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "textarea", 18);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_textarea_ngModelChange_57_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.notes, $event) || (ctx.f.notes = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(58, "div", 2)(59, "label");
      \u0275\u0275text(60, "Buyer portal access");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "select", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function BuyerForm_Template_select_ngModelChange_61_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.user_id, $event) || (ctx.f.user_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(62, "option", 16);
      \u0275\u0275text(63, "No portal login linked");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(64, BuyerForm_For_65_Template, 2, 3, "option", 7, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "span", 19);
      \u0275\u0275text(67, "Link a user with the Buyer role so they can see this buyer's portfolio and retirement records.");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(68, BuyerForm_Conditional_68_Template, 2, 1, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(69, BuyerForm_Conditional_69_Template, 1, 1, "vc-error", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(70, 21);
      \u0275\u0275elementStart(71, "button", 22);
      \u0275\u0275listener("click", function BuyerForm_Template_button_click_71_listener() {
        return ctx.closed.emit();
      });
      \u0275\u0275text(72, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "button", 23);
      \u0275\u0275listener("click", function BuyerForm_Template_button_click_73_listener() {
        return ctx.save();
      });
      \u0275\u0275text(74);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("open", ctx.open())("drawer", true)("title", ctx.buyer() ? "Edit buyer" : "New buyer")("subtitle", ctx.buyer()?.name ?? "An organisation that buys credits from this programme.");
      \u0275\u0275advance(5);
      \u0275\u0275classProp("invalid", !!ctx.fe()["name"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.name);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["name"] ? 6 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.kind);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.kinds);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.country);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.contact_name);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275classProp("invalid", !!ctx.fe()["contact_email"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.contact_email);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["contact_email"] ? 26 : -1);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.removal);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.reduction);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.min_vintage);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.registry);
      \u0275\u0275control();
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.notes);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.user_id);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.users());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.fe()["user_id"] ? 68 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 69 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || ctx.f.name.trim().length < 2);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.buyer() ? "Save changes" : "Create buyer");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxLengthValidator, MinValidator, MaxValidator, NgModel, ErrorBox, Modal], styles: ["\n.sec[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  padding-top: 14px;\n  border-top: 1px solid var(--%NS%border);\n  font-size: 14px;\n}\n/*# sourceMappingURL=buyer-form.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuyerForm, [{
    type: Component,
    args: [{ selector: "vcx-buyer-form", imports: [FormsModule, ...KIT], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [open]="open()" (closed)="closed.emit()" [drawer]="true" width="520px"
      [title]="buyer() ? 'Edit buyer' : 'New buyer'" [subtitle]="buyer()?.name ?? 'An organisation that buys credits from this programme.'">
      <div class="stack">
        <div class="field"><label>Organisation name</label>
          <input class="input" [(ngModel)]="f.name" maxlength="200" placeholder="e.g. Tata Consumer Products" [class.invalid]="!!fe()['name']" />
          @if (fe()['name']) { <span class="error">{{ fe()['name'] }}</span> }</div>
        <div class="form-grid">
          <div class="field"><label>Type</label>
            <select class="input" [(ngModel)]="f.kind">
              @for (k of kinds; track k) { <option [value]="k">{{ kindLabel[k] }}</option> }
            </select></div>
          <div class="field"><label>Country</label><input class="input" [(ngModel)]="f.country" maxlength="80" placeholder="India" /></div>
          <div class="field"><label>Contact person</label><input class="input" [(ngModel)]="f.contact_name" maxlength="200" /></div>
          <div class="field"><label>Contact email</label>
            <input class="input" type="email" [(ngModel)]="f.contact_email" [class.invalid]="!!fe()['contact_email']" />
            @if (fe()['contact_email']) { <span class="error">{{ fe()['contact_email'] }}</span> }</div>
        </div>

        <h3 class="sec">Purchasing requirements</h3>
        <div class="field"><label>Credit types accepted</label>
          <div class="row">
            <label class="checkbox"><input type="checkbox" [(ngModel)]="f.removal" />Removals</label>
            <label class="checkbox"><input type="checkbox" [(ngModel)]="f.reduction" />Reductions</label>
          </div></div>
        <div class="form-grid">
          <div class="field"><label>Earliest vintage</label><input class="input num" type="number" min="2000" max="2100" [(ngModel)]="f.min_vintage" placeholder="e.g. 2024" /></div>
          <div class="field"><label>Registry preference</label>
            <select class="input" [(ngModel)]="f.registry">
              <option value="">Any registry</option><option>Verra</option><option>Gold Standard</option>
            </select></div>
          <div class="field span-2"><label>Other requirements</label>
            <textarea class="input" [(ngModel)]="f.notes" placeholder="e.g. Needs Scope 3 insetting report; smallholder co-benefits; delivery by March"></textarea></div>
        </div>

        <div class="field"><label>Buyer portal access</label>
          <select class="input" [(ngModel)]="f.user_id">
            <option value="">No portal login linked</option>
            @for (u of users(); track u.id) { <option [value]="u.id">{{ u.full_name }} \xB7 {{ u.email }}</option> }
          </select>
          <span class="hint">Link a user with the Buyer role so they can see this buyer's portfolio and retirement records.</span>
          @if (fe()['user_id']) { <span class="error">{{ fe()['user_id'] }}</span> }
        </div>
        @if (error()) { <vc-error title="Couldn't save the buyer" [message]="error()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="closed.emit()">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || f.name.trim().length < 2" (click)="save()">{{ buyer() ? 'Save changes' : 'Create buyer' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;7eef0e126c41a1db;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sales\\buyer-form.ts */\n.sec {\n  margin-top: 6px;\n  padding-top: 14px;\n  border-top: 1px solid var(--border);\n  font-size: 14px;\n}\n/*# sourceMappingURL=buyer-form.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }], buyer: [{ type: Input, args: [{ isSignal: true, alias: "buyer", required: false }] }], saved: [{ type: Output, args: ["saved"] }], closed: [{ type: Output, args: ["closed"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BuyerForm, { className: "BuyerForm", filePath: "src/app/features/sales/buyer-form.ts", lineNumber: 69 });
})();

// src/app/features/sales/new-sale.ts
var _forTrack02 = ($index, $item) => $item.id;
function NewSale_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 1);
  }
}
function NewSale_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 2);
  }
}
function NewSale_Conditional_3_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r3 = ctx.$implicit;
    \u0275\u0275property("value", b_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", b_r3.name, "", b_r3.country ? " \xB7 " + b_r3.country : "");
  }
}
function NewSale_Conditional_3_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 14);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r4 = ctx.$implicit;
    \u0275\u0275property("value", b_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", b_r4.code, " \xB7 vintage ", b_r4.vintage, " \xB7 ", \u0275\u0275pipeBind2(2, 4, b_r4.balances.reduction.available + b_r4.balances.removal.available, 1), " t available");
  }
}
function NewSale_Conditional_3_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function NewSale_Conditional_3_For_22_Template_button_click_0_listener() {
      const t_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.ctype.set(t_r6);
      return \u0275\u0275resetView(ctx_r1.conflict.set(null));
    });
    \u0275\u0275elementStart(1, "span", 29);
    \u0275\u0275element(2, "vc-icon", 30);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 31);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "num");
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8, "t available");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const t_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.ctype() === t_r6);
    \u0275\u0275property("disabled", !ctx_r1.batch());
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r1.ticon[t_r6])("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.typeLabel[t_r6]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(6, 7, ctx_r1.avail(t_r6), 3), " ");
  }
}
function NewSale_Conditional_3_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Only ", \u0275\u0275pipeBind2(2, 1, ctx_r1.available(), 3), " t available.");
  }
}
function NewSale_Conditional_3_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["quantity"]);
  }
}
function NewSale_Conditional_3_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["unit_price"]);
  }
}
function NewSale_Conditional_3_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 32)(2, "span");
    \u0275\u0275text(3, "After this sale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong", 6);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 33);
    \u0275\u0275element(8, "span", 34);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate3("", \u0275\u0275pipeBind2(6, 7, ctx_r1.remaining(), 3), " t ", ctx_r1.typeLabel[ctx_r1.ctype()].toLowerCase(), " left in ", ctx_r1.batch().code);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx_r1.usePct(), "%");
    \u0275\u0275classProp("bad", ctx_r1.over());
  }
}
function NewSale_Conditional_3_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-callout", 26)(1, "strong");
    \u0275\u0275text(2, "Not enough credits.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementStart(4, "div", 35)(5, "button", 36);
    \u0275\u0275listener("click", function NewSale_Conditional_3_Conditional_44_Template_button_click_5_listener() {
      const c_r8 = \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.useAvailable(c_r8.available));
    });
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "num");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const c_r8 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", c_r8.message, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Reserve ", \u0275\u0275pipeBind2(7, 2, c_r8.available, 3), " t instead");
  }
}
function NewSale_Conditional_3_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 27);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function NewSale_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11)(2, "label");
    \u0275\u0275text(3, "Buyer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 12);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function NewSale_Conditional_3_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.buyerId, $event) || (ctx_r1.buyerId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "option", 13);
    \u0275\u0275text(6, "Choose a buyer\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, NewSale_Conditional_3_For_8_Template, 2, 3, "option", 14, _forTrack02);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 11)(10, "label");
    \u0275\u0275text(11, "Credit batch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "select", 12);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function NewSale_Conditional_3_Template_select_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.batchId.set($event);
      return \u0275\u0275resetView(ctx_r1.conflict.set(null));
    });
    \u0275\u0275elementStart(13, "option", 13);
    \u0275\u0275text(14, "Choose an issued batch\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(15, NewSale_Conditional_3_For_16_Template, 3, 7, "option", 14, _forTrack02);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 11)(18, "label");
    \u0275\u0275text(19, "Credit type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 15);
    \u0275\u0275repeaterCreate(21, NewSale_Conditional_3_For_22_Template, 9, 10, "button", 16, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 17)(24, "label");
    \u0275\u0275text(25, "Quantity (tCO\u2082e)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 18)(27, "input", 19);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function NewSale_Conditional_3_Template_input_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.qty.set($event);
      return \u0275\u0275resetView(ctx_r1.conflict.set(null));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 20);
    \u0275\u0275listener("click", function NewSale_Conditional_3_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.qty.set(ctx_r1.available()));
    });
    \u0275\u0275text(29, "Max");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(30, NewSale_Conditional_3_Conditional_30_Template, 3, 4, "span", 21)(31, NewSale_Conditional_3_Conditional_31_Template, 2, 1, "span", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 17)(33, "label");
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "input", 22);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function NewSale_Conditional_3_Template_input_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.price.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(36, NewSale_Conditional_3_Conditional_36_Template, 2, 1, "span", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(37, NewSale_Conditional_3_Conditional_37_Template, 9, 10, "div", 23);
    \u0275\u0275elementStart(38, "div", 11)(39, "label");
    \u0275\u0275text(40, "Notes ");
    \u0275\u0275elementStart(41, "span", 24);
    \u0275\u0275text(42, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "textarea", 25);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function NewSale_Conditional_3_Template_textarea_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.notes, $event) || (ctx_r1.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(44, NewSale_Conditional_3_Conditional_44_Template, 8, 5, "vc-callout", 26)(45, NewSale_Conditional_3_Conditional_45_Template, 1, 1, "vc-error", 27);
  }
  if (rf & 2) {
    let tmp_20_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.buyerId);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.buyers());
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r1.batchId());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.issued());
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.types);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("invalid", ctx_r1.over());
    \u0275\u0275property("ngModel", ctx_r1.qty());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.available());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.over() ? 30 : ctx_r1.fe()["quantity"] ? 31 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Unit price (", ctx_r1.currency, " per tonne)");
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.price());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.fe()["unit_price"] ? 36 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.batch() ? 37 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.notes);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_20_0 = ctx_r1.conflict()) ? 44 : ctx_r1.error() ? 45 : -1, tmp_20_0);
  }
}
var NewSale = class _NewSale {
  api = inject(ApiService);
  toast = inject(ToastService);
  open = input(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  buyers = input(
    [],
    ...ngDevMode ? [{ debugName: "buyers" }] : (
      /* istanbul ignore next */
      []
    )
  );
  batches = input(
    [],
    ...ngDevMode ? [{ debugName: "batches" }] : (
      /* istanbul ignore next */
      []
    )
  );
  presetBuyer = input(
    "",
    ...ngDevMode ? [{ debugName: "presetBuyer" }] : (
      /* istanbul ignore next */
      []
    )
  );
  created = output();
  closed = output();
  inventoryChanged = output();
  types = CREDIT_TYPES;
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;
  currency = "INR";
  buyerId = "";
  batchId = signal(
    "",
    ...ngDevMode ? [{ debugName: "batchId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ctype = signal(
    "removal",
    ...ngDevMode ? [{ debugName: "ctype" }] : (
      /* istanbul ignore next */
      []
    )
  );
  qty = signal(
    null,
    ...ngDevMode ? [{ debugName: "qty" }] : (
      /* istanbul ignore next */
      []
    )
  );
  price = signal(
    null,
    ...ngDevMode ? [{ debugName: "price" }] : (
      /* istanbul ignore next */
      []
    )
  );
  notes = "";
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
  conflict = signal(
    null,
    ...ngDevMode ? [{ debugName: "conflict" }] : (
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
  issued = computed(
    () => this.batches().filter((b) => b.status === "issued"),
    ...ngDevMode ? [{ debugName: "issued" }] : (
      /* istanbul ignore next */
      []
    )
  );
  batch = computed(
    () => this.issued().find((b) => b.id === this.batchId()) ?? null,
    ...ngDevMode ? [{ debugName: "batch" }] : (
      /* istanbul ignore next */
      []
    )
  );
  available = computed(
    () => this.avail(this.ctype()),
    ...ngDevMode ? [{ debugName: "available" }] : (
      /* istanbul ignore next */
      []
    )
  );
  over = computed(
    () => (this.qty() ?? 0) > this.available() + 1e-9,
    ...ngDevMode ? [{ debugName: "over" }] : (
      /* istanbul ignore next */
      []
    )
  );
  remaining = computed(
    () => Math.max(0, this.available() - (Number(this.qty()) || 0)),
    ...ngDevMode ? [{ debugName: "remaining" }] : (
      /* istanbul ignore next */
      []
    )
  );
  usePct = computed(
    () => this.available() > 0 ? Math.min(100, (Number(this.qty()) || 0) / this.available() * 100) : 0,
    ...ngDevMode ? [{ debugName: "usePct" }] : (
      /* istanbul ignore next */
      []
    )
  );
  value = computed(
    () => {
      const q = Number(this.qty()) || 0, p = Number(this.price()) || 0;
      return q && p ? money(Math.round(q * p * 100) / 100, this.currency) : "\u2014";
    },
    ...ngDevMode ? [{ debugName: "value" }] : (
      /* istanbul ignore next */
      []
    )
  );
  valid = computed(
    () => !!this.batch() && (Number(this.qty()) || 0) > 0 && !this.over() && (Number(this.price()) || 0) > 0,
    ...ngDevMode ? [{ debugName: "valid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (this.open()) {
        this.buyerId = this.presetBuyer() || "";
        this.error.set(null);
        this.conflict.set(null);
        this.fe.set({});
        this.qty.set(null);
        this.notes = "";
        const first = this.issued().find((b) => b.balances.removal.available + b.balances.reduction.available > 0);
        if (!this.batchId() && first) {
          this.batchId.set(first.id);
          this.ctype.set(first.balances.removal.available > 0 ? "removal" : "reduction");
        }
      }
    });
  }
  avail(t) {
    return this.batch()?.balances[t]?.available ?? 0;
  }
  useAvailable(v) {
    this.qty.set(v);
    this.conflict.set(null);
  }
  submit() {
    if (!this.buyerId) {
      this.error.set("Choose a buyer.");
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.conflict.set(null);
    this.fe.set({});
    this.api.post("/sales", {
      buyer_id: this.buyerId,
      batch_id: this.batchId(),
      credit_type: this.ctype(),
      quantity: Number(this.qty()),
      unit_price: Number(this.price()).toFixed(2),
      currency: this.currency,
      notes: this.notes.trim()
    }).subscribe({
      next: (s) => {
        this.busy.set(false);
        this.toast.success(`Sale ${s.code} reserved`, `${s.quantity} t for ${s.buyer_name}.`);
        this.created.emit(s);
      },
      error: (e) => {
        this.busy.set(false);
        if (e.code === "INVENTORY_INSUFFICIENT") {
          this.conflict.set({ message: e.message, available: Number(e.details?.["available"] ?? 0) });
          this.inventoryChanged.emit();
        } else {
          this.fe.set(apiFieldErrors(e));
          this.error.set(e.message);
        }
      }
    });
  }
  static \u0275fac = function NewSale_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NewSale)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NewSale, selectors: [["vcx-new-sale"]], inputs: { open: [1, "open"], buyers: [1, "buyers"], batches: [1, "batches"], presetBuyer: [1, "presetBuyer"] }, outputs: { created: "created", closed: "closed", inventoryChanged: "inventoryChanged" }, decls: 15, vars: 4, consts: [["title", "New sale", "width", "640px", "subtitle", "Reserving credits takes them out of the available balance straight away, so two sales can never claim the same tonnes.", 3, "closed", "open"], ["icon", "boxes", "title", "No issued batches", "text", "Credits can only be sold after a batch is issued on a registry."], ["icon", "building", "title", "Add a buyer first", "text", "Create the buyer on the Buyers tab, then come back to reserve credits."], ["footer", ""], [1, "value"], [1, "subtle", "small"], [1, "num"], [1, "spacer"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], [1, "form-grid"], [1, "field", "span-2"], [1, "input", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", ""], [3, "value"], [1, "types"], ["type", "button", 1, "type", 3, "on", "disabled"], [1, "field"], [1, "with-btn"], ["type", "number", "min", "0", "step", "0.001", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "btn", "btn-ghost", "btn-sm", 3, "click", "disabled"], [1, "error"], ["type", "number", "min", "0", "step", "0.01", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "span-2", "meter"], [1, "subtle"], ["maxlength", "2000", "placeholder", "Delivery schedule, co-benefit claims agreed, etc.", 1, "input", 3, "ngModelChange", "ngModel"], ["tone", "danger", "icon", "alert", 2, "margin-top", "14px"], ["title", "Couldn't create the sale", 2, "margin-top", "14px", 3, "message"], ["type", "button", 1, "type", 3, "click", "disabled"], [1, "k"], [1, "tic", 3, "name", "size"], [1, "v", "num"], [1, "mh"], [1, "track"], [1, "use"], [1, "row", 2, "margin-top", "8px"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"]], template: function NewSale_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275listener("closed", function NewSale_Template_vc_modal_closed_0_listener() {
        return ctx.closed.emit();
      });
      \u0275\u0275conditionalCreate(1, NewSale_Conditional_1_Template, 1, 0, "vc-empty", 1)(2, NewSale_Conditional_2_Template, 1, 0, "vc-empty", 2)(3, NewSale_Conditional_3_Template, 46, 13);
      \u0275\u0275elementContainerStart(4, 3);
      \u0275\u0275elementStart(5, "div", 4)(6, "span", 5);
      \u0275\u0275text(7, "Sale value");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "strong", 6);
      \u0275\u0275text(9);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(10, "span", 7);
      \u0275\u0275elementStart(11, "button", 8);
      \u0275\u0275listener("click", function NewSale_Template_button_click_11_listener() {
        return ctx.closed.emit();
      });
      \u0275\u0275text(12, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "button", 9);
      \u0275\u0275listener("click", function NewSale_Template_button_click_13_listener() {
        return ctx.submit();
      });
      \u0275\u0275text(14, "Reserve credits");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("open", ctx.open());
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.issued().length ? 1 : !ctx.buyers().length ? 2 : 3);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.value());
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.valid() || ctx.busy());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxLengthValidator, MinValidator, NgModel, Icon, Empty, ErrorBox, Callout, Modal, NumPipe], styles: ["\n.tic[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-500);\n  vertical-align: -2px;\n}\n.types[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.type[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 4px;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 10px;\n  background: var(--%NS%surface);\n  cursor: pointer;\n  font: inherit;\n  text-align: left;\n}\n.type[_ngcontent-%COMP%]:hover:not([disabled]) {\n  border-color: var(--%NS%forest-300);\n}\n.type.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-500);\n}\n.type[disabled][_ngcontent-%COMP%] {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.type[_ngcontent-%COMP%]   .k[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--%NS%stone-800);\n}\n.type[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.type[_ngcontent-%COMP%]   .v[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n}\n.type[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  font-weight: 400;\n}\n.with-btn[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n}\n.meter[_ngcontent-%COMP%] {\n  padding: 12px 14px;\n  border-radius: 10px;\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n}\n.mh[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  margin-bottom: 8px;\n  flex-wrap: wrap;\n}\n.mh[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-800);\n  font-weight: 600;\n}\n.track[_ngcontent-%COMP%] {\n  height: 8px;\n  border-radius: 4px;\n  background: var(--%NS%forest-100);\n  overflow: hidden;\n}\n.use[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  background: var(--%NS%sky-600);\n  border-radius: 4px;\n  transition: width 0.2s;\n}\n.use.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%red-600);\n}\n.value[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.2;\n}\n.value[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n/*# sourceMappingURL=new-sale.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NewSale, [{
    type: Component,
    args: [{ selector: "vcx-new-sale", imports: [FormsModule, ...KIT, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [open]="open()" (closed)="closed.emit()" title="New sale" width="640px"
      subtitle="Reserving credits takes them out of the available balance straight away, so two sales can never claim the same tonnes.">
      @if (!issued().length) {
        <vc-empty icon="boxes" title="No issued batches" text="Credits can only be sold after a batch is issued on a registry." />
      } @else if (!buyers().length) {
        <vc-empty icon="building" title="Add a buyer first" text="Create the buyer on the Buyers tab, then come back to reserve credits." />
      } @else {
        <div class="form-grid">
          <div class="field span-2">
            <label>Buyer</label>
            <select class="input" [(ngModel)]="buyerId">
              <option value="" disabled>Choose a buyer\u2026</option>
              @for (b of buyers(); track b.id) { <option [value]="b.id">{{ b.name }}{{ b.country ? ' \xB7 ' + b.country : '' }}</option> }
            </select>
          </div>
          <div class="field span-2">
            <label>Credit batch</label>
            <select class="input" [ngModel]="batchId()" (ngModelChange)="batchId.set($event); conflict.set(null)">
              <option value="" disabled>Choose an issued batch\u2026</option>
              @for (b of issued(); track b.id) {
                <option [value]="b.id">{{ b.code }} \xB7 vintage {{ b.vintage }} \xB7 {{ (b.balances.reduction.available + b.balances.removal.available) | num: 1 }} t available</option>
              }
            </select>
          </div>
          <div class="field span-2">
            <label>Credit type</label>
            <div class="types">
              @for (t of types; track t) {
                <button type="button" class="type" [class.on]="ctype() === t" [disabled]="!batch()" (click)="ctype.set(t); conflict.set(null)">
                  <span class="k"><vc-icon class="tic" [name]="ticon[t]" [size]="13" />{{ typeLabel[t] }}</span>
                  <span class="v num">{{ avail(t) | num: 3 }} <small>t available</small></span>
                </button>
              }
            </div>
          </div>
          <div class="field">
            <label>Quantity (tCO\u2082e)</label>
            <div class="with-btn">
              <input class="input num" type="number" min="0" step="0.001" [ngModel]="qty()" (ngModelChange)="qty.set($event); conflict.set(null)" [class.invalid]="over()" />
              <button type="button" class="btn btn-ghost btn-sm" [disabled]="!available()" (click)="qty.set(available())">Max</button>
            </div>
            @if (over()) { <span class="error">Only {{ available() | num: 3 }} t available.</span> }
            @else if (fe()['quantity']) { <span class="error">{{ fe()['quantity'] }}</span> }
          </div>
          <div class="field">
            <label>Unit price ({{ currency }} per tonne)</label>
            <input class="input num" type="number" min="0" step="0.01" [ngModel]="price()" (ngModelChange)="price.set($event)" />
            @if (fe()['unit_price']) { <span class="error">{{ fe()['unit_price'] }}</span> }
          </div>

          @if (batch()) {
            <div class="span-2 meter">
              <div class="mh"><span>After this sale</span><strong class="num">{{ remaining() | num: 3 }} t {{ typeLabel[ctype()].toLowerCase() }} left in {{ batch()!.code }}</strong></div>
              <div class="track"><span class="use" [style.width.%]="usePct()" [class.bad]="over()"></span></div>
            </div>
          }

          <div class="field span-2">
            <label>Notes <span class="subtle">(optional)</span></label>
            <textarea class="input" [(ngModel)]="notes" maxlength="2000" placeholder="Delivery schedule, co-benefit claims agreed, etc."></textarea>
          </div>
        </div>

        @if (conflict(); as c) {
          <vc-callout tone="danger" icon="alert" style="margin-top:14px">
            <strong>Not enough credits.</strong> {{ c.message }}
            <div class="row" style="margin-top:8px">
              <button class="btn btn-secondary btn-sm" (click)="useAvailable(c.available)">Reserve {{ c.available | num: 3 }} t instead</button>
            </div>
          </vc-callout>
        } @else if (error()) {
          <vc-error title="Couldn't create the sale" [message]="error()!" style="margin-top:14px" />
        }
      }
      <ng-container footer>
        <div class="value">
          <span class="subtle small">Sale value</span>
          <strong class="num">{{ value() }}</strong>
        </div>
        <span class="spacer"></span>
        <button class="btn btn-ghost" (click)="closed.emit()">Cancel</button>
        <button class="btn btn-primary" [disabled]="!valid() || busy()" (click)="submit()">Reserve credits</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;eaccd783499df344;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sales\\new-sale.ts */\n.tic {\n  color: var(--stone-500);\n  vertical-align: -2px;\n}\n.types {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.type {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 4px;\n  padding: 12px 14px;\n  border: 1px solid var(--border-strong);\n  border-radius: 10px;\n  background: var(--surface);\n  cursor: pointer;\n  font: inherit;\n  text-align: left;\n}\n.type:hover:not([disabled]) {\n  border-color: var(--forest-300);\n}\n.type.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: inset 0 0 0 1px var(--forest-500);\n}\n.type[disabled] {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.type .k {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--stone-800);\n}\n.type i {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.type .v {\n  font-size: 18px;\n  font-weight: 600;\n}\n.type small {\n  font-size: 12px;\n  color: var(--text-3);\n  font-weight: 400;\n}\n.with-btn {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n}\n.meter {\n  padding: 12px 14px;\n  border-radius: 10px;\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n}\n.mh {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  font-size: 12.5px;\n  color: var(--text-2);\n  margin-bottom: 8px;\n  flex-wrap: wrap;\n}\n.mh strong {\n  color: var(--stone-800);\n  font-weight: 600;\n}\n.track {\n  height: 8px;\n  border-radius: 4px;\n  background: var(--forest-100);\n  overflow: hidden;\n}\n.use {\n  display: block;\n  height: 100%;\n  background: var(--sky-600);\n  border-radius: 4px;\n  transition: width 0.2s;\n}\n.use.bad {\n  background: var(--red-600);\n}\n.value {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.2;\n}\n.value strong {\n  font-size: 16px;\n}\n.spacer {\n  flex: 1;\n}\n/*# sourceMappingURL=new-sale.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }], buyers: [{ type: Input, args: [{ isSignal: true, alias: "buyers", required: false }] }], batches: [{ type: Input, args: [{ isSignal: true, alias: "batches", required: false }] }], presetBuyer: [{ type: Input, args: [{ isSignal: true, alias: "presetBuyer", required: false }] }], created: [{ type: Output, args: ["created"] }], closed: [{ type: Output, args: ["closed"] }], inventoryChanged: [{ type: Output, args: ["inventoryChanged"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NewSale, { className: "NewSale", filePath: "src/app/features/sales/new-sale.ts", lineNumber: 122 });
})();

// src/app/features/sales/sales.page.ts
var _c02 = () => ["contracted", "delivered", "retired"];
var _c1 = () => ["reserved"];
var _c2 = () => ["delivered", "retired"];
var _c3 = () => ["retired"];
var _c4 = (a0) => ({ key: "sales", label: "Sales", count: a0 });
var _c5 = (a0) => ({ key: "buyers", label: "Buyers", count: a0 });
var _c6 = (a0, a1) => [a0, a1];
var _c7 = (a0) => [a0];
var _forTrack03 = ($index, $item) => $item.id;
function SalesPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function SalesPage_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.editBuyer.set(null);
      return \u0275\u0275resetView(ctx_r1.buyerOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 14);
    \u0275\u0275text(2, "New buyer");
    \u0275\u0275elementEnd();
  }
}
function SalesPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function SalesPage_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saleOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 14);
    \u0275\u0275text(2, "New sale");
    \u0275\u0275elementEnd();
  }
}
function SalesPage_Conditional_15_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r5 = ctx.$implicit;
    \u0275\u0275property("value", s_r5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r5.charAt(0).toUpperCase() + s_r5.slice(1));
  }
}
function SalesPage_Conditional_15_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 22);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function SalesPage_Conditional_15_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "vc-error", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function SalesPage_Conditional_15_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function SalesPage_Conditional_15_Conditional_12_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.saleOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 14);
    \u0275\u0275text(2, "New sale");
    \u0275\u0275elementEnd();
  }
}
function SalesPage_Conditional_15_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 24);
    \u0275\u0275conditionalCreate(1, SalesPage_Conditional_15_Conditional_12_Conditional_1_Template, 3, 0, "button", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.sales().length ? "No matching sales" : "No sales yet")("text", ctx_r1.sales().length ? "Try a different search or status." : "Reserve issued credits for a buyer to start a sale.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canSell && !ctx_r1.sales().length ? 1 : -1);
  }
}
function SalesPage_Conditional_15_Conditional_13_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 32);
    \u0275\u0275listener("click", function SalesPage_Conditional_15_Conditional_13_For_23_Template_tr_click_0_listener() {
      const s_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.go(s_r8));
    });
    \u0275\u0275elementStart(1, "td", 33)(2, "a", 34);
    \u0275\u0275listener("click", function SalesPage_Conditional_15_Conditional_13_For_23_Template_a_click_2_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 35);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 36);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 33)(10, "span", 37);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 35);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td")(15, "span", 38);
    \u0275\u0275element(16, "vc-icon", 39);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td", 30);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 30);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td", 30)(24, "strong");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "td");
    \u0275\u0275element(27, "vcx-steps", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "td", 41);
    \u0275\u0275listener("click", function SalesPage_Conditional_15_Conditional_13_For_23_Template_td_click_28_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(29, "vcx-sale-actions", 42);
    \u0275\u0275listener("changed", function SalesPage_Conditional_15_Conditional_13_For_23_Template_vcx_sale_actions_changed_29_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.replace($event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(22, _c7, s_r8.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r8.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 17, s_r8.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r8.buyer_name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r8.batch_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Vintage ", s_r8.vintage);
    \u0275\u0275advance(3);
    \u0275\u0275property("name", ctx_r1.ticon[s_r8.credit_type])("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.typeLabel[s_r8.credit_type]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(20, 19, s_r8.quantity, 3), " t");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.fmt(s_r8.unit_price, s_r8.currency));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.fmt(s_r8.total_amount, s_r8.currency));
    \u0275\u0275advance(2);
    \u0275\u0275property("steps", ctx_r1.steps)("current", s_r8.status)("compact", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("sale", s_r8)("small", true);
  }
}
function SalesPage_Conditional_15_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "table", 29)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Sale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Buyer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Batch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 30);
    \u0275\u0275text(13, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 30);
    \u0275\u0275text(15, "Unit price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 30);
    \u0275\u0275text(17, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Progress");
    \u0275\u0275elementEnd();
    \u0275\u0275element(20, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, SalesPage_Conditional_15_Conditional_13_For_23_Template, 30, 24, "tr", 31, _forTrack03);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(22);
    \u0275\u0275repeater(ctx_r1.filtered());
  }
}
function SalesPage_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 16);
    \u0275\u0275element(2, "vc-icon", 17);
    \u0275\u0275elementStart(3, "input", 18);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SalesPage_Conditional_15_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.q.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "select", 19);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function SalesPage_Conditional_15_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.statusF.set($event));
    });
    \u0275\u0275elementStart(5, "option", 20);
    \u0275\u0275text(6, "All statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, SalesPage_Conditional_15_For_8_Template, 2, 2, "option", 21, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "section", 10);
    \u0275\u0275conditionalCreate(10, SalesPage_Conditional_15_Conditional_10_Template, 1, 1, "vc-loading", 22)(11, SalesPage_Conditional_15_Conditional_11_Template, 2, 1, "div", 23)(12, SalesPage_Conditional_15_Conditional_12_Template, 2, 3, "vc-empty", 24)(13, SalesPage_Conditional_15_Conditional_13_Template, 24, 0, "div", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.q());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.statusF());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.statuses);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.loading() ? 10 : ctx_r1.error() ? 11 : !ctx_r1.filtered().length ? 12 : 13);
  }
}
function SalesPage_Conditional_16_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 22);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function SalesPage_Conditional_16_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function SalesPage_Conditional_16_Conditional_2_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      ctx_r1.editBuyer.set(null);
      return \u0275\u0275resetView(ctx_r1.buyerOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 14);
    \u0275\u0275text(2, "New buyer");
    \u0275\u0275elementEnd();
  }
}
function SalesPage_Conditional_16_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 43);
    \u0275\u0275conditionalCreate(1, SalesPage_Conditional_16_Conditional_2_Conditional_1_Template, 3, 0, "button", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canSell ? 1 : -1);
  }
}
function SalesPage_Conditional_16_Conditional_3_For_21_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(b_r10.contact_email);
  }
}
function SalesPage_Conditional_16_Conditional_3_For_21_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-badge", 45);
    \u0275\u0275text(1, "Linked");
    \u0275\u0275elementEnd();
  }
}
function SalesPage_Conditional_16_Conditional_3_For_21_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275text(1, "Not linked");
    \u0275\u0275elementEnd();
  }
}
function SalesPage_Conditional_16_Conditional_3_For_21_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function SalesPage_Conditional_16_Conditional_3_For_21_Conditional_20_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const b_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      ctx_r1.editBuyer.set(b_r10);
      return \u0275\u0275resetView(ctx_r1.buyerOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 48);
    \u0275\u0275text(2, "Edit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 49);
    \u0275\u0275listener("click", function SalesPage_Conditional_16_Conditional_3_For_21_Conditional_20_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r11);
      const b_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      ctx_r1.presetBuyer.set(b_r10.id);
      return \u0275\u0275resetView(ctx_r1.saleOpen.set(true));
    });
    \u0275\u0275text(4, "Sell");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function SalesPage_Conditional_16_Conditional_3_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275conditionalCreate(10, SalesPage_Conditional_16_Conditional_3_For_21_Conditional_10_Template, 2, 1, "div", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 44);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 30);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275conditionalCreate(17, SalesPage_Conditional_16_Conditional_3_For_21_Conditional_17_Template, 2, 0, "vc-badge", 45)(18, SalesPage_Conditional_16_Conditional_3_For_21_Conditional_18_Template, 2, 0, "span", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 46);
    \u0275\u0275conditionalCreate(20, SalesPage_Conditional_16_Conditional_3_For_21_Conditional_20_Template, 5, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const b_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r10.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.kindLabel[b_r10.kind]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r10.country || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r10.contact_name || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional(b_r10.contact_email ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.reqText(b_r10));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(15, 9, ctx_r1.bought(b_r10.id), 1), " t");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(b_r10.user_id ? 17 : 18);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.canSell ? 20 : -1);
  }
}
function SalesPage_Conditional_16_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "table", 29)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Buyer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Country");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Contact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Requirements");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 30);
    \u0275\u0275text(15, "Purchased");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Portal");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, SalesPage_Conditional_16_Conditional_3_For_21_Template, 21, 12, "tr", null, _forTrack03);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(20);
    \u0275\u0275repeater(ctx_r1.buyers());
  }
}
function SalesPage_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10);
    \u0275\u0275conditionalCreate(1, SalesPage_Conditional_16_Conditional_1_Template, 1, 1, "vc-loading", 22)(2, SalesPage_Conditional_16_Conditional_2_Template, 2, 1, "vc-empty", 43)(3, SalesPage_Conditional_16_Conditional_3_Template, 22, 0, "div", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loading() ? 1 : !ctx_r1.buyers().length ? 2 : 3);
  }
}
var SalesPage = class _SalesPage {
  api = inject(ApiService);
  router = inject(Router);
  canSell = inject(AuthService).can("sales.manage");
  steps = SALE_STEPS;
  statuses = [...SALE_STEPS, "cancelled"];
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;
  kindLabel = KIND_LABEL;
  tab = signal(
    "sales",
    ...ngDevMode ? [{ debugName: "tab" }] : (
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
  buyers = signal(
    [],
    ...ngDevMode ? [{ debugName: "buyers" }] : (
      /* istanbul ignore next */
      []
    )
  );
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
  q = signal(
    "",
    ...ngDevMode ? [{ debugName: "q" }] : (
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
  saleOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "saleOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  buyerOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "buyerOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editBuyer = signal(
    null,
    ...ngDevMode ? [{ debugName: "editBuyer" }] : (
      /* istanbul ignore next */
      []
    )
  );
  presetBuyer = signal(
    "",
    ...ngDevMode ? [{ debugName: "presetBuyer" }] : (
      /* istanbul ignore next */
      []
    )
  );
  filtered = computed(
    () => {
      const q = this.q().trim().toLowerCase();
      return this.sales().filter((s) => (!this.statusF() || s.status === this.statusF()) && (!q || [s.code, s.buyer_name, s.batch_code].some((x) => (x ?? "").toLowerCase().includes(q))));
    },
    ...ngDevMode ? [{ debugName: "filtered" }] : (
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
    this.api.get("/sales").subscribe({
      next: (r) => {
        this.sales.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
    this.api.get("/buyers").subscribe({ next: (r) => this.buyers.set(r), error: () => {
    } });
    this.loadBatches();
  }
  loadBatches() {
    this.api.get("/credit-batches", { status: "issued" }).subscribe({ next: (r) => this.batches.set(r), error: () => {
    } });
  }
  live(st) {
    return this.sales().filter((s) => st.includes(s.status));
  }
  qtyOf(st) {
    return this.live(st).reduce((a, s) => a + s.quantity, 0);
  }
  countOf(st) {
    return this.live(st).length;
  }
  valueOf(st) {
    const list = this.live(st);
    const cur = list[0]?.currency ?? "INR";
    return money(list.filter((s) => s.currency === cur).reduce((a, s) => a + Number(s.total_amount), 0), cur);
  }
  bought(buyerId) {
    return this.sales().filter((s) => s.buyer_id === buyerId && s.status !== "cancelled").reduce((a, s) => a + s.quantity, 0);
  }
  fmt(v, c) {
    return money(v, c);
  }
  reqText(b) {
    const r = b.requirements ?? {};
    const parts = [];
    const t = r["credit_types"];
    if (t?.length === 1)
      parts.push(`${TYPE_LABEL[t[0]]} only`);
    if (r["min_vintage"])
      parts.push(`Vintage ${r["min_vintage"]}+`);
    if (r["registry"])
      parts.push(String(r["registry"]));
    if (r["notes"])
      parts.push(String(r["notes"]));
    for (const [k, v] of Object.entries(r)) {
      if (!["credit_types", "min_vintage", "registry", "notes"].includes(k) && v !== null && v !== "" && typeof v !== "object")
        parts.push(`${k.replace(/_/g, " ")}: ${v}`);
    }
    return parts.join(" \xB7 ") || "\u2014";
  }
  go(s) {
    this.router.navigate(["/app/sales", s.id]);
  }
  replace(s) {
    this.sales.update((list) => list.map((x) => x.id === s.id ? s : x));
    this.loadBatches();
  }
  onCreated(s) {
    this.saleOpen.set(false);
    this.presetBuyer.set("");
    this.tab.set("sales");
    this.sales.update((list) => [s, ...list]);
    this.loadBatches();
  }
  onBuyerSaved(b) {
    this.buyerOpen.set(false);
    this.buyers.update((list) => list.some((x) => x.id === b.id) ? list.map((x) => x.id === b.id ? b : x) : [...list, b].sort((a, c) => a.name.localeCompare(c.name)));
  }
  static \u0275fac = function SalesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SalesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SalesPage, selectors: [["vc-sales-page"]], decls: 19, vars: 38, consts: [["title", "Sales", "eyebrow", "Credits & sales", "subtitle", "Reserve issued credits for buyers, record contracts, deliver and retire. Each step moves tonnes in the inventory ledger."], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], ["actions", "", 1, "btn", "btn-primary"], [1, "grid", "grid-4", "stats"], ["label", "Contracted value", "icon", "banknote", "hint", "Contracted, delivered and retired sales", 3, "value", "accent"], ["label", "Reserved", "unit", "tCO\u2082e", "icon", "clock", 3, "value", "hint"], ["label", "Delivered", "unit", "tCO\u2082e", "icon", "send", "hint", "Transferred to buyers", 3, "value"], ["label", "Retired", "unit", "tCO\u2082e", "icon", "archive", "hint", "Claimed permanently", 3, "value"], [3, "activeChange", "tabs", "active"], [1, "card"], [3, "closed", "created", "inventoryChanged", "open", "buyers", "batches", "presetBuyer"], [3, "closed", "saved", "open", "buyer"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [1, "filters"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search sale, buyer or batch\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [3, "rows"], [1, "card-body"], ["icon", "handshake", 3, "title", "text"], [1, "table-wrap"], ["title", "Couldn't load sales", 3, "message"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "table"], [1, "num"], [1, "clickable"], [1, "clickable", 3, "click"], [1, "nowrap"], [1, "mono", "strong", 3, "click", "routerLink"], [1, "subtle", "small"], [1, "buyer"], [1, "mono", "small"], [1, "tchip"], [1, "tic", 3, "name", "size"], [3, "steps", "current", "compact"], [1, "acts", 3, "click"], [3, "changed", "sale", "small"], ["icon", "building", "title", "No buyers yet", "text", "Add the companies and traders who buy credits from this programme."], [1, "req", "small"], ["status", "active"], [1, "acts"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "pencil", 3, "size"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"]], template: function SalesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "button", 1);
      \u0275\u0275listener("click", function SalesPage_Template_button_click_1_listener() {
        return ctx.load();
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, SalesPage_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275conditionalCreate(5, SalesPage_Conditional_5_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 4);
      \u0275\u0275element(7, "vc-stat", 5)(8, "vc-stat", 6);
      \u0275\u0275pipe(9, "num");
      \u0275\u0275element(10, "vc-stat", 7);
      \u0275\u0275pipe(11, "num");
      \u0275\u0275element(12, "vc-stat", 8);
      \u0275\u0275pipe(13, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "vc-tabs", 9);
      \u0275\u0275listener("activeChange", function SalesPage_Template_vc_tabs_activeChange_14_listener($event) {
        return ctx.tab.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(15, SalesPage_Conditional_15_Template, 14, 4)(16, SalesPage_Conditional_16_Template, 4, 1, "section", 10);
      \u0275\u0275elementStart(17, "vcx-new-sale", 11);
      \u0275\u0275listener("closed", function SalesPage_Template_vcx_new_sale_closed_17_listener() {
        ctx.saleOpen.set(false);
        return ctx.presetBuyer.set("");
      })("created", function SalesPage_Template_vcx_new_sale_created_17_listener($event) {
        return ctx.onCreated($event);
      })("inventoryChanged", function SalesPage_Template_vcx_new_sale_inventoryChanged_17_listener() {
        return ctx.loadBatches();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "vcx-buyer-form", 12);
      \u0275\u0275listener("closed", function SalesPage_Template_vcx_buyer_form_closed_18_listener() {
        return ctx.buyerOpen.set(false);
      })("saved", function SalesPage_Template_vcx_buyer_form_saved_18_listener($event) {
        return ctx.onBuyerSaved($event);
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canSell && ctx.tab() === "buyers" ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.canSell && ctx.tab() !== "buyers" ? 5 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("value", ctx.valueOf(\u0275\u0275pureFunction0(26, _c02)))("accent", true);
      \u0275\u0275advance();
      \u0275\u0275property("value", \u0275\u0275pipeBind2(9, 17, ctx.qtyOf(\u0275\u0275pureFunction0(27, _c1)), 1))("hint", ctx.countOf(\u0275\u0275pureFunction0(28, _c1)) + " awaiting contract");
      \u0275\u0275advance(2);
      \u0275\u0275property("value", \u0275\u0275pipeBind2(11, 20, ctx.qtyOf(\u0275\u0275pureFunction0(29, _c2)), 1));
      \u0275\u0275advance(2);
      \u0275\u0275property("value", \u0275\u0275pipeBind2(13, 23, ctx.qtyOf(\u0275\u0275pureFunction0(30, _c3)), 1));
      \u0275\u0275advance(2);
      \u0275\u0275property("tabs", \u0275\u0275pureFunction2(35, _c6, \u0275\u0275pureFunction1(31, _c4, ctx.sales().length), \u0275\u0275pureFunction1(33, _c5, ctx.buyers().length)))("active", ctx.tab());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.tab() === "sales" ? 15 : 16);
      \u0275\u0275advance(2);
      \u0275\u0275property("open", ctx.saleOpen())("buyers", ctx.buyers())("batches", ctx.batches())("presetBuyer", ctx.presetBuyer());
      \u0275\u0275advance();
      \u0275\u0275property("open", ctx.buyerOpen())("buyer", ctx.editBuyer());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, RouterLink, Icon, Badge, PageHeader, Stat, Empty, Loading, ErrorBox, Tabs, Steps, SaleActions, NewSale, BuyerForm, NumPipe, DayPipe], styles: ["\n.tic[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-500);\n  vertical-align: -2px;\n}\n.stats[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 420px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 200px;\n}\n.strong[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--%NS%stone-900);\n}\n.tchip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n.tchip[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.acts[_ngcontent-%COMP%] {\n  text-align: right;\n  white-space: nowrap;\n}\n.req[_ngcontent-%COMP%] {\n  max-width: 280px;\n  color: var(--%NS%text-2);\n}\n.buyer[_ngcontent-%COMP%] {\n  min-width: 120px;\n  max-width: 180px;\n}\n.table[_ngcontent-%COMP%]   td.acts[_ngcontent-%COMP%] {\n  padding-left: 6px;\n  padding-right: 10px;\n}\n/*# sourceMappingURL=sales.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SalesPage, [{
    type: Component,
    args: [{ selector: "vc-sales-page", imports: [FormsModule, RouterLink, ...KIT, NumPipe, DayPipe, Steps, SaleActions, NewSale, BuyerForm], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Sales" eyebrow="Credits & sales"
      subtitle="Reserve issued credits for buyers, record contracts, deliver and retire. Each step moves tonnes in the inventory ledger.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (canSell && tab() === 'buyers') {
        <button actions class="btn btn-primary" (click)="editBuyer.set(null); buyerOpen.set(true)"><vc-icon name="plus" />New buyer</button>
      }
      @if (canSell && tab() !== 'buyers') {
        <button actions class="btn btn-primary" (click)="saleOpen.set(true)"><vc-icon name="plus" />New sale</button>
      }
    </vc-page-header>

    <div class="grid grid-4 stats">
      <vc-stat label="Contracted value" [value]="valueOf(['contracted', 'delivered', 'retired'])" icon="banknote" [accent]="true" hint="Contracted, delivered and retired sales" />
      <vc-stat label="Reserved" [value]="qtyOf(['reserved']) | num: 1" unit="tCO\u2082e" icon="clock" [hint]="countOf(['reserved']) + ' awaiting contract'" />
      <vc-stat label="Delivered" [value]="qtyOf(['delivered', 'retired']) | num: 1" unit="tCO\u2082e" icon="send" hint="Transferred to buyers" />
      <vc-stat label="Retired" [value]="qtyOf(['retired']) | num: 1" unit="tCO\u2082e" icon="archive" hint="Claimed permanently" />
    </div>

    <vc-tabs [tabs]="[{ key: 'sales', label: 'Sales', count: sales().length }, { key: 'buyers', label: 'Buyers', count: buyers().length }]"
      [active]="tab()" (activeChange)="tab.set($any($event))" />

    @if (tab() === 'sales') {
      <div class="filters">
        <div class="search"><vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search sale, buyer or batch\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
        <select class="input" [ngModel]="statusF()" (ngModelChange)="statusF.set($event)">
          <option value="">All statuses</option>
          @for (s of statuses; track s) { <option [value]="s">{{ s.charAt(0).toUpperCase() + s.slice(1) }}</option> }
        </select>
      </div>
      <section class="card">
        @if (loading()) { <vc-loading [rows]="6" /> }
        @else if (error()) { <div class="card-body"><vc-error title="Couldn't load sales" [message]="error()!" /></div> }
        @else if (!filtered().length) {
          <vc-empty icon="handshake" [title]="sales().length ? 'No matching sales' : 'No sales yet'"
            [text]="sales().length ? 'Try a different search or status.' : 'Reserve issued credits for a buyer to start a sale.'">
            @if (canSell && !sales().length) { <button class="btn btn-primary" (click)="saleOpen.set(true)"><vc-icon name="plus" />New sale</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Sale</th><th>Buyer</th><th>Batch</th><th>Type</th><th class="num">Quantity</th><th class="num">Unit price</th>
                <th class="num">Value</th><th>Progress</th><th></th>
              </tr></thead>
              <tbody>
                @for (s of filtered(); track s.id) {
                  <tr class="clickable" (click)="go(s)">
                    <td class="nowrap"><a class="mono strong" [routerLink]="[s.id]" (click)="$event.stopPropagation()">{{ s.code }}</a>
                      <div class="subtle small">{{ s.created_at | day }}</div></td>
                    <td class="buyer">{{ s.buyer_name }}</td>
                    <td class="nowrap"><span class="mono small">{{ s.batch_code }}</span><div class="subtle small">Vintage {{ s.vintage }}</div></td>
                    <td><span class="tchip"><vc-icon class="tic" [name]="ticon[s.credit_type]" [size]="13" />{{ typeLabel[s.credit_type] }}</span></td>
                    <td class="num">{{ s.quantity | num: 3 }} t</td>
                    <td class="num">{{ fmt(s.unit_price, s.currency) }}</td>
                    <td class="num"><strong>{{ fmt(s.total_amount, s.currency) }}</strong></td>
                    <td><vcx-steps [steps]="steps" [current]="s.status" [compact]="true" /></td>
                    <td class="acts" (click)="$event.stopPropagation()"><vcx-sale-actions [sale]="s" [small]="true" (changed)="replace($event)" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    } @else {
      <section class="card">
        @if (loading()) { <vc-loading [rows]="5" /> }
        @else if (!buyers().length) {
          <vc-empty icon="building" title="No buyers yet" text="Add the companies and traders who buy credits from this programme.">
            @if (canSell) { <button class="btn btn-primary" (click)="editBuyer.set(null); buyerOpen.set(true)"><vc-icon name="plus" />New buyer</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Buyer</th><th>Type</th><th>Country</th><th>Contact</th><th>Requirements</th><th class="num">Purchased</th><th>Portal</th><th></th></tr></thead>
              <tbody>
                @for (b of buyers(); track b.id) {
                  <tr>
                    <td><strong>{{ b.name }}</strong></td>
                    <td>{{ kindLabel[b.kind] }}</td>
                    <td>{{ b.country || '\u2014' }}</td>
                    <td>{{ b.contact_name || '\u2014' }}@if (b.contact_email) { <div class="subtle small">{{ b.contact_email }}</div> }</td>
                    <td class="req small">{{ reqText(b) }}</td>
                    <td class="num">{{ bought(b.id) | num: 1 }} t</td>
                    <td>@if (b.user_id) { <vc-badge status="active">Linked</vc-badge> } @else { <span class="subtle small">Not linked</span> }</td>
                    <td class="acts">
                      @if (canSell) {
                        <button class="btn btn-ghost btn-sm" (click)="editBuyer.set(b); buyerOpen.set(true)"><vc-icon name="pencil" [size]="14" />Edit</button>
                        <button class="btn btn-secondary btn-sm" (click)="presetBuyer.set(b.id); saleOpen.set(true)">Sell</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <vcx-new-sale [open]="saleOpen()" [buyers]="buyers()" [batches]="batches()" [presetBuyer]="presetBuyer()"
      (closed)="saleOpen.set(false); presetBuyer.set('')" (created)="onCreated($event)" (inventoryChanged)="loadBatches()" />
    <vcx-buyer-form [open]="buyerOpen()" [buyer]="editBuyer()" (closed)="buyerOpen.set(false)" (saved)="onBuyerSaved($event)" />
  `, styles: ["/* angular:styles/component:scss;3b4d139d5329a5ae;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\sales\\sales.page.ts */\n.tic {\n  color: var(--stone-500);\n  vertical-align: -2px;\n}\n.stats {\n  margin-bottom: 24px;\n}\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 420px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.filters select {\n  width: 200px;\n}\n.strong {\n  font-weight: 600;\n  color: var(--stone-900);\n}\n.tchip {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n.tchip i {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.acts {\n  text-align: right;\n  white-space: nowrap;\n}\n.req {\n  max-width: 280px;\n  color: var(--text-2);\n}\n.buyer {\n  min-width: 120px;\n  max-width: 180px;\n}\n.table td.acts {\n  padding-left: 6px;\n  padding-right: 10px;\n}\n/*# sourceMappingURL=sales.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SalesPage, { className: "SalesPage", filePath: "src/app/features/sales/sales.page.ts", lineNumber: 139 });
})();

// src/app/features/sales/sales.routes.ts
var sales_routes_default = [
  { path: "", component: SalesPage, title: "Sales \xB7 Varsapradaya Carbon" },
  { path: ":id", component: SaleDetailPage, title: "Sale \xB7 Varsapradaya Carbon" }
];
export {
  sales_routes_default as default
};
//# debugId=6f5b3598-810a-5e81-a6ba-2b0684c1d894
//# sourceMappingURL=chunk-QDBZZTKH.js.map
