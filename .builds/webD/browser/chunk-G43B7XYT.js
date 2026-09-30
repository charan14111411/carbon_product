import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  AgoPipe,
  DayPipe,
  HumanPipe
} from "./chunk-E5UDMWWN.js";
import {
  Empty,
  ErrorBox,
  Loading,
  PageHeader
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-O2E4BMDK.js";

// src/app/features/audit/audit.page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AuditPage_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r1 = ctx.$implicit;
    \u0275\u0275property("value", t_r1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r1);
  }
}
function AuditPage_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 11);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function AuditPage_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "vc-error", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function AuditPage_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 13);
  }
}
function AuditPage_Conditional_17_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 17)(2, "span", 18);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td")(7, "code", 19);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td")(10, "span", 20);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "code", 21);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 20);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("title", \u0275\u0275pipeBind2(3, 7, r_r3.at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 10, r_r3.at));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r3.action);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 12, r_r3.entity_type));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r3.entity_id.slice(0, 8));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r3.by);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r3.reason || "\u2014");
  }
}
function AuditPage_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "table", 16)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "When");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Action");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Record");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "By");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Reason");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, AuditPage_Conditional_17_For_16_Template, 19, 14, "tr", null, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx_r1.rows());
  }
}
var AuditPage = class _AuditPage {
  api = inject(ApiService);
  all = signal(
    [],
    ...ngDevMode ? [{ debugName: "all" }] : (
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
  type = signal(
    "",
    ...ngDevMode ? [{ debugName: "type" }] : (
      /* istanbul ignore next */
      []
    )
  );
  types = computed(
    () => [...new Set(this.all().map((r) => r.entity_type))].sort(),
    ...ngDevMode ? [{ debugName: "types" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => {
      const q = this.q().toLowerCase().trim();
      return this.all().filter((r) => (!this.type() || r.entity_type === this.type()) && (!q || r.action.toLowerCase().includes(q) || r.by.toLowerCase().includes(q)));
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
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
    this.api.get("/audit", { limit: 500 }).subscribe({
      next: (r) => {
        this.all.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function AuditPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuditPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuditPage, selectors: [["vc-audit-page"]], decls: 18, vars: 4, consts: [["title", "Audit log", "eyebrow", "Administration", "subtitle", "Every create, change and approval in your organisation \u2014 who did it and when. Entries can never be edited or deleted."], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], [1, "filters"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Filter by action or person\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "history", "title", "No matching entries", "text", "Try a different filter."], [1, "table-wrap"], ["title", "Couldn't load the audit log", 3, "message"], [1, "table"], [1, "nowrap"], [3, "title"], [1, "act"], [1, "muted"], [1, "subtle", "small"]], template: function AuditPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "button", 1);
      \u0275\u0275listener("click", function AuditPage_Template_button_click_1_listener() {
        return ctx.load();
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Refresh");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 3)(5, "div", 4);
      \u0275\u0275element(6, "vc-icon", 5);
      \u0275\u0275elementStart(7, "input", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function AuditPage_Template_input_ngModelChange_7_listener($event) {
        return ctx.q.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "select", 7);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function AuditPage_Template_select_ngModelChange_8_listener($event) {
        return ctx.type.set($event);
      });
      \u0275\u0275elementStart(9, "option", 8);
      \u0275\u0275text(10, "All record types");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(11, AuditPage_For_12_Template, 2, 2, "option", 9, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "section", 10);
      \u0275\u0275conditionalCreate(14, AuditPage_Conditional_14_Template, 1, 1, "vc-loading", 11)(15, AuditPage_Conditional_15_Template, 2, 1, "div", 12)(16, AuditPage_Conditional_16_Template, 1, 0, "vc-empty", 13)(17, AuditPage_Conditional_17_Template, 17, 0, "div", 14);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.q());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.type());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.types());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.loading() ? 14 : ctx.error() ? 15 : !ctx.rows().length ? 16 : 17);
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, PageHeader, Loading, ErrorBox, Empty, Icon, DayPipe, AgoPipe, HumanPipe], styles: ["\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 420px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.filters[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: 220px;\n}\n.act[_ngcontent-%COMP%] {\n  font-size: 12px;\n  background: var(--%NS%sand-100);\n  padding: 2px 6px;\n  border-radius: 4px;\n  color: var(--%NS%stone-800);\n}\n/*# sourceMappingURL=audit.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuditPage, [{
    type: Component,
    args: [{ selector: "vc-audit-page", imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Icon, DayPipe, AgoPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Audit log" eyebrow="Administration"
      subtitle="Every create, change and approval in your organisation \u2014 who did it and when. Entries can never be edited or deleted.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
    </vc-page-header>

    <div class="filters">
      <div class="search">
        <vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Filter by action or person\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" />
      </div>
      <select class="input" [ngModel]="type()" (ngModelChange)="type.set($event)">
        <option value="">All record types</option>
        @for (t of types(); track t) { <option [value]="t">{{ t }}</option> }
      </select>
    </div>

    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="6" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load the audit log" [message]="error()!" /></div>
      } @else if (!rows().length) {
        <vc-empty icon="history" title="No matching entries" text="Try a different filter." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>When</th><th>Action</th><th>Record</th><th>By</th><th>Reason</th></tr></thead>
            <tbody>
              @for (r of rows(); track r.id) {
                <tr>
                  <td class="nowrap"><span [title]="r.at | day: true">{{ r.at | ago }}</span></td>
                  <td><code class="act">{{ r.action }}</code></td>
                  <td><span class="muted">{{ r.entity_type | human }}</span> <code class="subtle small">{{ r.entity_id.slice(0, 8) }}</code></td>
                  <td>{{ r.by }}</td>
                  <td class="muted">{{ r.reason || '\u2014' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `, styles: ["/* angular:styles/component:scss;bfc6860c03053d75;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\audit\\audit.page.ts */\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 420px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.filters select {\n  width: 220px;\n}\n.act {\n  font-size: 12px;\n  background: var(--sand-100);\n  padding: 2px 6px;\n  border-radius: 4px;\n  color: var(--stone-800);\n}\n/*# sourceMappingURL=audit.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuditPage, { className: "AuditPage", filePath: "src/app/features/audit/audit.page.ts", lineNumber: 79 });
})();

// src/app/features/audit/audit.routes.ts
var audit_routes_default = [{ path: "", component: AuditPage, title: "Audit log \xB7 Varsapradaya Carbon" }];
export {
  audit_routes_default as default
};
//# debugId=abb011b8-05be-5b3e-b3eb-24fd94d030a9
//# sourceMappingURL=chunk-G43B7XYT.js.map
