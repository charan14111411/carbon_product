import {
  ProfileForm
} from "./chunk-UKJ32EPU.js";
import {
  money
} from "./chunk-W6OT2EF5.js";
import {
  Brand
} from "./chunk-PLD4FPAY.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  CheckboxControlValueAccessor,
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
  AuthService,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from "./chunk-G6POHVBO.js";
import {
  KIT,
  Modal
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Injectable,
  Input,
  __spreadProps,
  __spreadValues,
  computed,
  inject,
  input,
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
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
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
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
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

// src/app/features/farmer-portal/farmer-data.ts
var FarmerData = class _FarmerData {
  api = inject(ApiService);
  auth = inject(AuthService);
  farmerId = computed(
    () => this.auth.profile()?.scope?.["farmer_id"] ?? null,
    ...ngDevMode ? [{ debugName: "farmerId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  firstName = computed(
    () => (this.statement().data?.farmer_name ?? this.auth.profile()?.full_name ?? "").split(" ")[0],
    ...ngDevMode ? [{ debugName: "firstName" }] : (
      /* istanbul ignore next */
      []
    )
  );
  statement = signal(
    { data: null, error: null, loading: false },
    ...ngDevMode ? [{ debugName: "statement" }] : (
      /* istanbul ignore next */
      []
    )
  );
  consents = signal(
    { data: null, error: null, loading: false },
    ...ngDevMode ? [{ debugName: "consents" }] : (
      /* istanbul ignore next */
      []
    )
  );
  profile = signal(
    { data: null, error: null, loading: false },
    ...ngDevMode ? [{ debugName: "profile" }] : (
      /* istanbul ignore next */
      []
    )
  );
  overview = signal(
    { data: null, error: null, loading: false },
    ...ngDevMode ? [{ debugName: "overview" }] : (
      /* istanbul ignore next */
      []
    )
  );
  grievances = signal(
    { data: null, error: null, loading: false },
    ...ngDevMode ? [{ debugName: "grievances" }] : (
      /* istanbul ignore next */
      []
    )
  );
  started = false;
  init() {
    if (this.started || !this.farmerId())
      return;
    this.started = true;
    this.refresh();
  }
  refresh() {
    const fid = this.farmerId();
    if (!fid)
      return;
    this.fetch(this.statement, `/farmers/${fid}/statement`);
    this.fetch(this.consents, `/farmers/${fid}/consents`);
    this.fetch(this.profile, `/farmers/${fid}/payment-profile`);
    this.fetch(this.overview, `/farmers/${fid}/overview`);
    this.fetch(this.grievances, "/grievances");
  }
  fetch(sig, path) {
    sig.update((s) => __spreadProps(__spreadValues({}, s), { loading: true, error: null }));
    this.api.get(path).subscribe({
      next: (d) => sig.set({ data: d, error: null, loading: false }),
      error: (e) => sig.set({ data: null, error: e.message, loading: false, status: e.status })
    });
  }
  reloadConsents() {
    const f = this.farmerId();
    if (f)
      this.fetch(this.consents, `/farmers/${f}/consents`);
  }
  reloadGrievances() {
    this.fetch(this.grievances, "/grievances");
  }
  setProfile(p) {
    this.profile.set({ data: p, error: null, loading: false });
  }
  static \u0275fac = function FarmerData_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerData)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FarmerData, factory: _FarmerData.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerData, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();
var PURPOSES = {
  sampling: { en: "Soil sampling on my fields", kn: "\u0CAE\u0CA3\u0CCD\u0CA3\u0CBF\u0CA8 \u0CAE\u0CBE\u0CA6\u0CB0\u0CBF \u0CB8\u0C82\u0C97\u0CCD\u0CB0\u0CB9", what: "Field staff may visit to take small soil samples for lab testing." },
  data_use: { en: "Use of my farm data", kn: "\u0CA8\u0CA8\u0CCD\u0CA8 \u0C95\u0CC3\u0CB7\u0CBF \u0CAE\u0CBE\u0CB9\u0CBF\u0CA4\u0CBF\u0CAF \u0CAC\u0CB3\u0C95\u0CC6", what: "Your field boundaries and records are used to measure soil carbon." },
  practice_monitoring: { en: "Checking my farming practices", kn: "\u0C95\u0CC3\u0CB7\u0CBF \u0CAA\u0CA6\u0CCD\u0CA7\u0CA4\u0CBF\u0C97\u0CB3 \u0CAA\u0CB0\u0CBF\u0CB6\u0CC0\u0CB2\u0CA8\u0CC6", what: "Practices like mulching or cover crops are recorded and may be checked by satellite." },
  share_with_buyers: { en: "Sharing summaries with credit buyers", kn: "\u0C96\u0CB0\u0CC0\u0CA6\u0CBF\u0CA6\u0CBE\u0CB0\u0CB0\u0CCA\u0C82\u0CA6\u0CBF\u0C97\u0CC6 \u0CB9\u0C82\u0C9A\u0CBF\u0C95\u0CC6", what: "Buyers see project totals only \u2014 never your name, phone or exact location." },
  payments: { en: "Receiving payments", kn: "\u0CB9\u0CA3 \u0CAA\u0CBE\u0CB5\u0CA4\u0CBF", what: "Your share of credit sales is paid to your UPI or bank account." },
  sensor_installation: { en: "Installing sensors on my land", kn: "\u0CB8\u0C82\u0CB5\u0CC7\u0CA6\u0C95 \u0C85\u0CB3\u0CB5\u0CA1\u0CBF\u0C95\u0CC6", what: "A small soil moisture or weather sensor may be placed on your field." }
};
var PAY_STATUS = {
  paid: { label: "Paid", kn: "\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6", tone: "ok" },
  pending: { label: "Scheduled", kn: "\u0CA8\u0CBF\u0C97\u0CA6\u0CBF\u0CAF\u0CBE\u0C97\u0CBF\u0CA6\u0CC6", tone: "info" },
  on_hold: { label: "On hold", kn: "\u0CA4\u0CA1\u0CC6\u0CB9\u0CBF\u0CA1\u0CBF\u0CAF\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6", tone: "warn" },
  failed: { label: "Did not go through", kn: "\u0CB5\u0CBF\u0CAB\u0CB2\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CC6", tone: "danger" },
  not_scheduled: { label: "Being prepared", kn: "\u0CB8\u0CBF\u0CA6\u0CCD\u0CA7\u0CAA\u0CA1\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CC1\u0CA4\u0CCD\u0CA4\u0CBF\u0CA6\u0CC6", tone: "neutral" }
};

// src/app/features/farmer-portal/farmer-shell.ts
function FarmerTitle_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 0);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.kn());
  }
}
function FarmerTitle_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.sub());
  }
}
var _c0 = (a0) => ({ exact: a0 });
var _forTrack0 = ($index, $item) => $item.path;
function FarmerShell_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const n_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", n_r1.path)("routerLinkActiveOptions", \u0275\u0275pureFunction1(3, _c0, n_r1.exact));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(n_r1.en);
  }
}
function FarmerShell_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 6)(1, "h1");
    \u0275\u0275text(2, "This page is for farmers");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Your account isn't linked to a farmer record. Programme staff use the main workspace.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 10);
    \u0275\u0275text(6, "Go to workspace");
    \u0275\u0275elementEnd()();
  }
}
function FarmerShell_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "router-outlet");
  }
}
function FarmerShell_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 2);
    \u0275\u0275element(1, "vc-icon", 11);
    \u0275\u0275elementStart(2, "span", 12);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 13);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const n_r2 = ctx.$implicit;
    \u0275\u0275property("routerLink", n_r2.path)("routerLinkActiveOptions", \u0275\u0275pureFunction1(6, _c0, n_r2.exact));
    \u0275\u0275advance();
    \u0275\u0275property("name", n_r2.icon)("size", 22);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(n_r2.en);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(n_r2.kn);
  }
}
var FarmerTitle = class _FarmerTitle {
  en = input.required(
    ...ngDevMode ? [{ debugName: "en" }] : (
      /* istanbul ignore next */
      []
    )
  );
  kn = input(
    "",
    ...ngDevMode ? [{ debugName: "kn" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sub = input(
    "",
    ...ngDevMode ? [{ debugName: "sub" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function FarmerTitle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerTitle)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerTitle, selectors: [["vcf-title"]], inputs: { en: [1, "en"], kn: [1, "kn"], sub: [1, "sub"] }, decls: 4, vars: 3, consts: [["lang", "kn", 1, "kn"]], template: function FarmerTitle_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "h1");
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(2, FarmerTitle_Conditional_2_Template, 2, 1, "span", 0);
      \u0275\u0275conditionalCreate(3, FarmerTitle_Conditional_3_Template, 2, 1, "p");
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.en());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.kn() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.sub() ? 3 : -1);
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  margin: 4px 0 18px;\n}\nh1[_ngcontent-%COMP%] {\n  font-size: 26px;\n  line-height: 1.2;\n  letter-spacing: -0.015em;\n  color: var(--%NS%forest-900);\n}\n.kn[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 2px;\n  font-size: 16px;\n  color: var(--%NS%clay-600);\n  font-weight: 500;\n}\np[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  font-size: 15.5px;\n  color: var(--%NS%stone-600);\n  line-height: 1.5;\n}\n/*# sourceMappingURL=farmer-shell.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerTitle, [{
    type: Component,
    args: [{ selector: "vcf-title", changeDetection: ChangeDetectionStrategy.OnPush, template: `<h1>{{ en() }}</h1>@if (kn()) { <span class="kn" lang="kn">{{ kn() }}</span> }@if (sub()) { <p>{{ sub() }}</p> }`, styles: ["/* angular:styles/component:scss;f2fd695f3ea23b6f;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmer-portal\\farmer-shell.ts */\n:host {\n  display: block;\n  margin: 4px 0 18px;\n}\nh1 {\n  font-size: 26px;\n  line-height: 1.2;\n  letter-spacing: -0.015em;\n  color: var(--forest-900);\n}\n.kn {\n  display: block;\n  margin-top: 2px;\n  font-size: 16px;\n  color: var(--clay-600);\n  font-weight: 500;\n}\np {\n  margin-top: 8px;\n  font-size: 15.5px;\n  color: var(--stone-600);\n  line-height: 1.5;\n}\n/*# sourceMappingURL=farmer-shell.css.map */\n"] }]
  }], null, { en: [{ type: Input, args: [{ isSignal: true, alias: "en", required: true }] }], kn: [{ type: Input, args: [{ isSignal: true, alias: "kn", required: false }] }], sub: [{ type: Input, args: [{ isSignal: true, alias: "sub", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerTitle, { className: "FarmerTitle", filePath: "src/app/features/farmer-portal/farmer-shell.ts", lineNumber: 20 });
})();
var NAV = [
  { path: "/farmer", exact: true, icon: "sun", en: "Home", kn: "\u0CAE\u0CC1\u0C96\u0CAA\u0CC1\u0C9F" },
  { path: "/farmer/fields", exact: false, icon: "sprout", en: "Fields", kn: "\u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1" },
  { path: "/farmer/payments", exact: false, icon: "wallet", en: "Payments", kn: "\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF" },
  { path: "/farmer/consents", exact: false, icon: "shield-check", en: "Consents", kn: "\u0C92\u0CAA\u0CCD\u0CAA\u0CBF\u0C97\u0CC6" },
  { path: "/farmer/help", exact: false, icon: "help", en: "Help", kn: "\u0CB8\u0CB9\u0CBE\u0CAF" }
];
var FarmerShell = class _FarmerShell {
  auth = inject(AuthService);
  data = inject(FarmerData);
  nav = NAV;
  constructor() {
    this.data.init();
  }
  static \u0275fac = function FarmerShell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerShell)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerShell, selectors: [["vcf-shell"]], decls: 22, vars: 2, consts: [[1, "top"], ["aria-label", "Sections", 1, "deskNav"], ["routerLinkActive", "on", 3, "routerLink", "routerLinkActiveOptions"], [1, "spacer"], ["aria-label", "Sign out", 1, "out", 3, "click"], ["name", "logout", 3, "size"], [1, "notice"], [1, "foot"], ["routerLink", "/farmer/help"], ["aria-label", "Sections", 1, "bottom"], ["routerLink", "/app/overview", 1, "btn", "btn-primary", "btn-lg"], [3, "name", "size"], [1, "en"], ["lang", "kn", 1, "kn"]], template: function FarmerShell_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0);
      \u0275\u0275element(1, "vc-brand");
      \u0275\u0275elementStart(2, "nav", 1);
      \u0275\u0275repeaterCreate(3, FarmerShell_For_4_Template, 2, 5, "a", 2, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "span", 3);
      \u0275\u0275elementStart(6, "button", 4);
      \u0275\u0275listener("click", function FarmerShell_Template_button_click_6_listener() {
        return ctx.auth.logout();
      });
      \u0275\u0275element(7, "vc-icon", 5);
      \u0275\u0275elementStart(8, "span");
      \u0275\u0275text(9, "Sign out");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "main");
      \u0275\u0275conditionalCreate(11, FarmerShell_Conditional_11_Template, 7, 0, "section", 6)(12, FarmerShell_Conditional_12_Template, 1, 0, "router-outlet");
      \u0275\u0275elementStart(13, "footer", 7)(14, "p");
      \u0275\u0275text(15, "Questions about your fields or money? Talk to your field officer, or ");
      \u0275\u0275elementStart(16, "a", 8);
      \u0275\u0275text(17, "raise it under Help");
      \u0275\u0275elementEnd();
      \u0275\u0275text(18, " \u2014 every complaint gets a reference number and a reply date.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "nav", 9);
      \u0275\u0275repeaterCreate(20, FarmerShell_For_21_Template, 6, 8, "a", 2, _forTrack0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.nav);
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 18);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(!ctx.data.farmerId() ? 11 : 12);
      \u0275\u0275advance(9);
      \u0275\u0275repeater(ctx.nav);
    }
  }, dependencies: [RouterOutlet, RouterLink, RouterLinkActive, Brand, Icon], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      180deg,\n      var(--%NS%clay-50) 0,\n      var(--%NS%sand-100) 260px);\n  font-size: 16px;\n}\n.top[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  height: 60px;\n  padding: 0 16px;\n  background: rgba(252, 243, 236, 0.92);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  border-bottom: 1px solid var(--%NS%border);\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.deskNav[_ngcontent-%COMP%] {\n  display: none;\n  gap: 4px;\n  margin-left: 24px;\n}\n.deskNav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  height: 38px;\n  display: flex;\n  align-items: center;\n  padding: 0 14px;\n  border-radius: 8px;\n  color: var(--%NS%stone-700);\n  font-weight: 500;\n  text-decoration: none;\n}\n.deskNav[_ngcontent-%COMP%]   a.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-800);\n}\n.out[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 40px;\n  padding: 0 12px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 10px;\n  background: var(--%NS%surface);\n  font: inherit;\n  font-size: 14px;\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.out[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: none;\n}\nmain[_ngcontent-%COMP%] {\n  max-width: 760px;\n  margin: 0 auto;\n  padding: 20px 16px 112px;\n}\n.foot[_ngcontent-%COMP%] {\n  margin-top: 32px;\n  padding-top: 16px;\n  border-top: 1px solid var(--%NS%border);\n  font-size: 14px;\n  color: var(--%NS%text-2);\n}\n.notice[_ngcontent-%COMP%] {\n  padding: 32px 0;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  align-items: flex-start;\n}\n.bottom[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 30;\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  background: var(--%NS%surface);\n  border-top: 1px solid var(--%NS%border);\n  box-shadow: 0 -4px 16px rgba(16, 41, 28, 0.06);\n  padding-bottom: env(safe-area-inset-bottom);\n}\n.bottom[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1px;\n  min-height: 66px;\n  color: var(--%NS%stone-500);\n  text-decoration: none;\n  position: relative;\n}\n.bottom[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   .en[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 600;\n  margin-top: 3px;\n}\n.bottom[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   .kn[_ngcontent-%COMP%] {\n  font-size: 10.5px;\n}\n.bottom[_ngcontent-%COMP%]   a.on[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.bottom[_ngcontent-%COMP%]   a.on[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 22%;\n  right: 22%;\n  height: 3px;\n  border-radius: 0 0 3px 3px;\n  background: var(--%NS%forest-600);\n}\n@media (min-width: 900px) {\n  .bottom[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .deskNav[_ngcontent-%COMP%] {\n    display: flex;\n  }\n  .out[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    display: inline;\n  }\n  main[_ngcontent-%COMP%] {\n    padding-bottom: 48px;\n  }\n  .top[_ngcontent-%COMP%] {\n    padding: 0 32px;\n  }\n}\n/*# sourceMappingURL=farmer-shell.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerShell, [{
    type: Component,
    args: [{ selector: "vcf-shell", imports: [RouterOutlet, RouterLink, RouterLinkActive, Brand, Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <header class="top">
      <vc-brand />
      <nav class="deskNav" aria-label="Sections">
        @for (n of nav; track n.path) {
          <a [routerLink]="n.path" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: n.exact }">{{ n.en }}</a>
        }
      </nav>
      <span class="spacer"></span>
      <button class="out" (click)="auth.logout()" aria-label="Sign out"><vc-icon name="logout" [size]="18" /><span>Sign out</span></button>
    </header>

    <main>
      @if (!data.farmerId()) {
        <section class="notice">
          <h1>This page is for farmers</h1>
          <p>Your account isn't linked to a farmer record. Programme staff use the main workspace.</p>
          <a class="btn btn-primary btn-lg" routerLink="/app/overview">Go to workspace</a>
        </section>
      } @else {
        <router-outlet />
      }
      <footer class="foot">
        <p>Questions about your fields or money? Talk to your field officer, or <a routerLink="/farmer/help">raise it under Help</a> \u2014 every complaint gets a reference number and a reply date.</p>
      </footer>
    </main>

    <nav class="bottom" aria-label="Sections">
      @for (n of nav; track n.path) {
        <a [routerLink]="n.path" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: n.exact }">
          <vc-icon [name]="n.icon" [size]="22" /><span class="en">{{ n.en }}</span><span class="kn" lang="kn">{{ n.kn }}</span>
        </a>
      }
    </nav>
  `, styles: ['/* angular:styles/component:scss;679bf4ad5d12ef18;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmer-portal\\farmer-shell.ts */\n:host {\n  display: block;\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      180deg,\n      var(--clay-50) 0,\n      var(--sand-100) 260px);\n  font-size: 16px;\n}\n.top {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  height: 60px;\n  padding: 0 16px;\n  background: rgba(252, 243, 236, 0.92);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  border-bottom: 1px solid var(--border);\n}\n.spacer {\n  flex: 1;\n}\n.deskNav {\n  display: none;\n  gap: 4px;\n  margin-left: 24px;\n}\n.deskNav a {\n  height: 38px;\n  display: flex;\n  align-items: center;\n  padding: 0 14px;\n  border-radius: 8px;\n  color: var(--stone-700);\n  font-weight: 500;\n  text-decoration: none;\n}\n.deskNav a.on {\n  background: var(--forest-100);\n  color: var(--forest-800);\n}\n.out {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 40px;\n  padding: 0 12px;\n  border: 1px solid var(--border-strong);\n  border-radius: 10px;\n  background: var(--surface);\n  font: inherit;\n  font-size: 14px;\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.out span {\n  display: none;\n}\nmain {\n  max-width: 760px;\n  margin: 0 auto;\n  padding: 20px 16px 112px;\n}\n.foot {\n  margin-top: 32px;\n  padding-top: 16px;\n  border-top: 1px solid var(--border);\n  font-size: 14px;\n  color: var(--text-2);\n}\n.notice {\n  padding: 32px 0;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  align-items: flex-start;\n}\n.bottom {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 30;\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  background: var(--surface);\n  border-top: 1px solid var(--border);\n  box-shadow: 0 -4px 16px rgba(16, 41, 28, 0.06);\n  padding-bottom: env(safe-area-inset-bottom);\n}\n.bottom a {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1px;\n  min-height: 66px;\n  color: var(--stone-500);\n  text-decoration: none;\n  position: relative;\n}\n.bottom a .en {\n  font-size: 12.5px;\n  font-weight: 600;\n  margin-top: 3px;\n}\n.bottom a .kn {\n  font-size: 10.5px;\n}\n.bottom a.on {\n  color: var(--forest-700);\n}\n.bottom a.on::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 22%;\n  right: 22%;\n  height: 3px;\n  border-radius: 0 0 3px 3px;\n  background: var(--forest-600);\n}\n@media (min-width: 900px) {\n  .bottom {\n    display: none;\n  }\n  .deskNav {\n    display: flex;\n  }\n  .out span {\n    display: inline;\n  }\n  main {\n    padding-bottom: 48px;\n  }\n  .top {\n    padding: 0 32px;\n  }\n}\n/*# sourceMappingURL=farmer-shell.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerShell, { className: "FarmerShell", filePath: "src/app/features/farmer-portal/farmer-shell.ts", lineNumber: 98 });
})();

// src/app/features/farmer-portal/farmer-pages.ts
var _forTrack02 = ($index, $item) => $item.title;
function FarmerHome_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 4);
  }
}
function FarmerHome_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.m(ctx_r0.st().data?.total_paid ?? "0"));
  }
}
function FarmerHome_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.m(ctx_r0.waiting()), " more is on its way");
  }
}
function FarmerHome_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("From ", ctx_r0.st().data?.items?.length ?? 0, " credit sale", ctx_r0.st().data?.items?.length === 1 ? "" : "s", " so far");
  }
}
function FarmerHome_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 23)(1, "span", 24);
    \u0275\u0275element(2, "vc-icon", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 26)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(8, "vc-icon", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    \u0275\u0275classMap("t-" + s_r2.tone);
    \u0275\u0275property("routerLink", s_r2.link);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", s_r2.icon)("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r2.text);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function FarmerHome_ForEmpty_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275element(1, "vc-icon", 28);
    \u0275\u0275elementStart(2, "span", 29);
    \u0275\u0275text(3, "You're all set. Nothing needs your attention right now.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 22);
  }
}
var _forTrack1 = ($index, $item) => $item.id;
function FarmerFields_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1);
    \u0275\u0275element(1, "div", 2)(2, "div", 3);
    \u0275\u0275elementEnd();
  }
}
function FarmerFields_Conditional_2_For_18_For_7_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const fl_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" \xB7 ", fl_r1.crop_code, " ");
  }
}
function FarmerFields_Conditional_2_For_18_For_7_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("In ", ctx.project_code);
  }
}
function FarmerFields_Conditional_2_For_18_For_7_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1, "Not enrolled");
    \u0275\u0275elementEnd();
  }
}
function FarmerFields_Conditional_2_For_18_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "span", 9);
    \u0275\u0275element(2, "vc-icon", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 11)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275conditionalCreate(8, FarmerFields_Conditional_2_For_18_For_7_Conditional_8_Template, 1, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 12)(10, "strong", 5);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, FarmerFields_Conditional_2_For_18_For_7_Conditional_13_Template, 2, 1, "span", 13)(14, FarmerFields_Conditional_2_For_18_For_7_Conditional_14_Template, 2, 0, "span", 14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_28_0;
    const fl_r1 = ctx.$implicit;
    const o_r2 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(fl_r1.name || fl_r1.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fl_r1.code);
    \u0275\u0275advance();
    \u0275\u0275conditional(fl_r1.crop_code ? 8 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(12, 6, fl_r1.area_ha, 2), " ha");
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_28_0 = ctx_r2.enrolled(o_r2, fl_r1.code)) ? 13 : 14, tmp_28_0);
  }
}
function FarmerFields_Conditional_2_For_18_ForEmpty_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, "No fields mapped on this farm yet.");
    \u0275\u0275elementEnd();
  }
}
function FarmerFields_Conditional_2_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "div", 6)(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 7);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(6, FarmerFields_Conditional_2_For_18_For_7_Template, 15, 9, "div", 8, _forTrack1, false, FarmerFields_Conditional_2_For_18_ForEmpty_8_Template, 2, 0, "p", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r4 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r4.village);
    \u0275\u0275advance();
    \u0275\u0275repeater(f_r4.fields);
  }
}
function FarmerFields_Conditional_2_ForEmpty_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "p", 15);
    \u0275\u0275text(2, "No farms are registered to you yet. Your field officer maps your fields with you on the first visit.");
    \u0275\u0275elementEnd()();
  }
}
function FarmerFields_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div")(2, "strong", 5);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "hectares \xB7 \u0CB9\u0CC6\u0C95\u0CCD\u0C9F\u0CC7\u0CB0\u0CCD");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div")(8, "strong", 5);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "fields \xB7 \u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "strong", 5);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16, "practices recorded");
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(17, FarmerFields_Conditional_2_For_18_Template, 9, 3, "section", 1, _forTrack1, false, FarmerFields_Conditional_2_ForEmpty_19_Template, 3, 0, "section", 1);
  }
  if (rf & 2) {
    const o_r2 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 4, o_r2.total_area_ha, 2));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r2.fieldCount(o_r2));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(o_r2.practice_records);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(o_r2.farms);
  }
}
function FarmerFields_Conditional_3_Conditional_0_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "span", 9);
    \u0275\u0275element(2, "vc-icon", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 11)(4, "strong", 17);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7, "Counted in your latest payment");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 13);
    \u0275\u0275text(9, "Enrolled");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r5);
  }
}
function FarmerFields_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div")(2, "strong", 5);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "hectares enrolled \xB7 \u0CB9\u0CC6\u0C95\u0CCD\u0C9F\u0CC7\u0CB0\u0CCD");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div")(8, "strong", 5);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "fields \xB7 \u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "strong", 5);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16, "practices counted");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "section", 1)(18, "div", 6)(19, "h2");
    \u0275\u0275text(20, "Enrolled fields");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(21, FarmerFields_Conditional_3_Conditional_0_For_22_Template, 10, 2, "div", 8, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "p", 16);
    \u0275\u0275text(24, "These are the fields counted in your latest payment. To see the mapped boundaries or correct a field, ask your field officer or raise it under Help.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 3, ctx_r2.area(), 2));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r2.fromStatement().length);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.practices());
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r2.fromStatement());
  }
}
function FarmerFields_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "p", 15);
    \u0275\u0275text(2, "Your field details will appear here after your field officer has mapped and enrolled your land.");
    \u0275\u0275elementEnd()();
  }
}
function FarmerFields_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FarmerFields_Conditional_3_Conditional_0_Template, 25, 6)(1, FarmerFields_Conditional_3_Conditional_1_Template, 3, 0, "section", 1);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.fromStatement().length ? 0 : 1);
  }
}
var _forTrack2 = ($index, $item) => $item.pool_id;
function FarmerPayments_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1);
    \u0275\u0275element(1, "div", 8)(2, "div", 8);
    \u0275\u0275elementEnd();
  }
}
function FarmerPayments_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const st_r1 = \u0275\u0275readContextLet(1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(st_r1.error);
  }
}
function FarmerPayments_Conditional_4_For_12_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.pretty(l_r2));
  }
}
function FarmerPayments_Conditional_4_For_12_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const i_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", i_r4.inputs.area_ha.toFixed(2), " ha counted");
  }
}
function FarmerPayments_Conditional_4_For_12_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const i_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Your share ", (i_r4.inputs.share * 100).toFixed(2), "%");
  }
}
function FarmerPayments_Conditional_4_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 11)(1, "header")(2, "div")(3, "span", 12);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong", 10);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 13);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "ol", 14);
    \u0275\u0275repeaterCreate(10, FarmerPayments_Conditional_4_For_12_For_11_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 15)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, FarmerPayments_Conditional_4_For_12_Conditional_15_Template, 2, 1, "span");
    \u0275\u0275conditionalCreate(16, FarmerPayments_Conditional_4_For_12_Conditional_16_Template, 2, 1, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const i_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Credit sale ", i_r4.sale_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.m(i_r4.amount, i_r4.currency));
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r2.meta(i_r4.payout_status).tone);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.meta(i_r4.payout_status).label);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(i_r4.lines);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Rule version ", i_r4.rule_version);
    \u0275\u0275advance();
    \u0275\u0275conditional(i_r4.inputs.area_ha ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(i_r4.inputs.share ? 16 : -1);
  }
}
function FarmerPayments_Conditional_4_ForEmpty_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "p", 5);
    \u0275\u0275text(2, "No payments yet. When carbon credits from your fields are sold, your share will appear here with a full explanation.");
    \u0275\u0275elementEnd()();
  }
}
function FarmerPayments_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div")(2, "span");
    \u0275\u0275text(3, "Paid to you");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong", 10);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "span");
    \u0275\u0275text(8, "Your total share");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "strong", 10);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(11, FarmerPayments_Conditional_4_For_12_Template, 17, 8, "article", 11, _forTrack2, false, FarmerPayments_Conditional_4_ForEmpty_13_Template, 3, 0, "section", 1);
  }
  if (rf & 2) {
    const s_r5 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.m(s_r5.total_paid));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.m(s_r5.total_entitled));
    \u0275\u0275advance();
    \u0275\u0275repeater(s_r5.items.slice().reverse());
  }
}
function FarmerPaymentDetails_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 1)(1, "vcx-profile-form", 5);
    \u0275\u0275listener("saved", function FarmerPaymentDetails_Conditional_2_Template_vcx_profile_form_saved_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saved($event));
    })("cancelled", function FarmerPaymentDetails_Conditional_2_Template_vcx_profile_form_cancelled_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.editing.set(false));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const p_r3 = \u0275\u0275readContextLet(1);
    \u0275\u0275advance();
    \u0275\u0275property("farmerId", ctx_r1.d.farmerId())("current", p_r3.data)("large", true);
  }
}
function FarmerPaymentDetails_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1);
    \u0275\u0275element(1, "div", 6);
    \u0275\u0275elementEnd();
  }
}
function FarmerPaymentDetails_Conditional_4_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pr_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("IFSC ", pr_r5.ifsc);
  }
}
function FarmerPaymentDetails_Conditional_4_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "vc-icon", 18);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "day");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pr_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Verified on ", \u0275\u0275pipeBind1(4, 2, pr_r5.verified_on), ". Payments go here.");
  }
}
function FarmerPaymentDetails_Conditional_4_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "vc-icon", 19);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Being checked with the bank. Payments start once this is confirmed.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
  }
}
function FarmerPaymentDetails_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 7)(2, "span", 8);
    \u0275\u0275element(3, "vc-icon", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 10)(5, "span", 11);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong", 12);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, FarmerPaymentDetails_Conditional_4_Conditional_9_Template, 2, 1, "span", 13);
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, FarmerPaymentDetails_Conditional_4_Conditional_12_Template, 5, 4, "div", 14)(13, FarmerPaymentDetails_Conditional_4_Conditional_13_Template, 4, 1, "div", 15);
    \u0275\u0275elementStart(14, "button", 16);
    \u0275\u0275listener("click", function FarmerPaymentDetails_Conditional_4_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.editing.set(true));
    });
    \u0275\u0275element(15, "vc-icon", 17);
    \u0275\u0275text(16, "Change details");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pr_r5 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275property("name", pr_r5.method === "upi" ? "zap" : "landmark")("size", 24);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(pr_r5.method === "upi" ? "UPI" : "Bank account");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pr_r5.method === "upi" ? pr_r5.upi_id : pr_r5.account_masked);
    \u0275\u0275advance();
    \u0275\u0275conditional(pr_r5.ifsc ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pr_r5.account_name);
    \u0275\u0275advance();
    \u0275\u0275conditional(pr_r5.verified ? 12 : 13);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
  }
}
function FarmerPaymentDetails_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 1)(1, "p", 20);
    \u0275\u0275text(2, "You haven't added payment details yet. Add your UPI ID or bank account so we can pay your share.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 21);
    \u0275\u0275listener("click", function FarmerPaymentDetails_Conditional_5_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.editing.set(true));
    });
    \u0275\u0275element(4, "vc-icon", 22);
    \u0275\u0275text(5, "Add payment details");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
  }
}
var _forTrack3 = ($index, $item) => $item.purpose;
function FarmerConsents_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1);
    \u0275\u0275element(1, "div", 8)(2, "div", 8);
    \u0275\u0275elementEnd();
  }
}
function FarmerConsents_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const c_r1 = \u0275\u0275readContextLet(1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r1.error);
  }
}
function FarmerConsents_Conditional_4_For_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "day");
  }
  if (rf & 2) {
    const x_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" Since ", \u0275\u0275pipeBind1(1, 1, x_r2.effective_on), " ");
  }
}
function FarmerConsents_Conditional_4_For_1_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Not asked yet ");
  }
}
function FarmerConsents_Conditional_4_For_1_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function FarmerConsents_Conditional_4_For_1_Conditional_15_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const x_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.ask(x_r2, false));
    });
    \u0275\u0275text(1, "Withdraw");
    \u0275\u0275elementEnd();
  }
}
function FarmerConsents_Conditional_4_For_1_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function FarmerConsents_Conditional_4_For_1_Conditional_16_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const x_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.ask(x_r2, true));
    });
    \u0275\u0275text(1, "Give consent");
    \u0275\u0275elementEnd();
  }
}
function FarmerConsents_Conditional_4_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 9)(1, "div", 10)(2, "div", 11)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 12);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 13);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p", 14);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 15)(12, "span", 16);
    \u0275\u0275conditionalCreate(13, FarmerConsents_Conditional_4_For_1_Conditional_13_Template, 2, 3)(14, FarmerConsents_Conditional_4_For_1_Conditional_14_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, FarmerConsents_Conditional_4_For_1_Conditional_15_Template, 2, 0, "button", 17)(16, FarmerConsents_Conditional_4_For_1_Conditional_16_Template, 2, 0, "button", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const x_r2 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r3.p(x_r2).en);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.p(x_r2).kn);
    \u0275\u0275advance();
    \u0275\u0275classMap(x_r2.state === "granted" ? "ok" : x_r2.state === "withdrawn" ? "neutral" : "warn");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", x_r2.state === "granted" ? "Given" : x_r2.state === "withdrawn" ? "Withdrawn" : "Not given");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.p(x_r2).what);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(x_r2.effective_on ? 13 : 14);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(x_r2.state === "granted" ? 15 : 16);
  }
}
function FarmerConsents_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, FarmerConsents_Conditional_4_For_1_Template, 17, 8, "article", 9, _forTrack3);
  }
  if (rf & 2) {
    \u0275\u0275repeater(ctx.current);
  }
}
function FarmerConsents_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r6 = \u0275\u0275nextContext();
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("You agree that: ", ctx_r3.p(t_r6.c).what);
  }
}
function FarmerConsents_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 22);
    \u0275\u0275text(3, "Anything already done before today stays on record. You can give consent again later.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r6 = \u0275\u0275nextContext();
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("From today, the programme will stop this. ", ctx_r3.withdrawEffect(t_r6.c.purpose));
  }
}
function FarmerConsents_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.err());
  }
}
function FarmerConsents_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275conditionalCreate(1, FarmerConsents_Conditional_6_Conditional_1_Template, 2, 1, "p", 21)(2, FarmerConsents_Conditional_6_Conditional_2_Template, 4, 1);
    \u0275\u0275conditionalCreate(3, FarmerConsents_Conditional_6_Conditional_3_Template, 2, 1, "div", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.grant ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r3.err() ? 3 : -1);
  }
}
var _c02 = () => [];
var _c1 = () => ["resolved", "closed"];
var _forTrack4 = ($index, $item) => $item.k;
function FarmerHelp_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275listener("click", function FarmerHelp_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.formOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 7);
    \u0275\u0275text(2, "Raise a new complaint");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function FarmerHelp_Conditional_2_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function FarmerHelp_Conditional_2_For_12_Template_button_click_0_listener() {
      const c_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cat = c_r5.k);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "small", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.cat === c_r5.k);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r5.en);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r5.kn);
  }
}
function FarmerHelp_Conditional_2_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.err());
  }
}
function FarmerHelp_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 8)(2, "h2");
    \u0275\u0275text(3, "New complaint");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 4);
    \u0275\u0275text(5, "\u0CB9\u0CCA\u0CB8 \u0CA6\u0CC2\u0CB0\u0CC1");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 9)(7, "div", 10)(8, "label");
    \u0275\u0275text(9, "What is it about?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 11);
    \u0275\u0275repeaterCreate(11, FarmerHelp_Conditional_2_For_12_Template, 4, 4, "button", 12, _forTrack4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 10)(14, "label");
    \u0275\u0275text(15, "Short title");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 13);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function FarmerHelp_Conditional_2_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.subject, $event) || (ctx_r1.subject = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 10)(18, "label");
    \u0275\u0275text(19, "Tell us what happened");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "textarea", 14);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function FarmerHelp_Conditional_2_Template_textarea_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.desc, $event) || (ctx_r1.desc = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "label", 15)(22, "input", 16);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function FarmerHelp_Conditional_2_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.urgent, $event) || (ctx_r1.urgent = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(23, "This is urgent (reply within 3 days)");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(24, FarmerHelp_Conditional_2_Conditional_24_Template, 2, 1, "div", 5);
    \u0275\u0275elementStart(25, "div", 17)(26, "button", 18);
    \u0275\u0275listener("click", function FarmerHelp_Conditional_2_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.formOpen.set(false));
    });
    \u0275\u0275text(27, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "span", 19);
    \u0275\u0275elementStart(29, "button", 20);
    \u0275\u0275listener("click", function FarmerHelp_Conditional_2_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.send());
    });
    \u0275\u0275text(30, "Send");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275repeater(ctx_r1.cats);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.subject);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.desc);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.urgent);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.err() ? 24 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.busy() || ctx_r1.subject.trim().length < 3 || ctx_r1.desc.trim().length < 5);
  }
}
function FarmerHelp_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2);
    \u0275\u0275element(1, "div", 23);
    \u0275\u0275elementEnd();
  }
}
function FarmerHelp_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const g_r6 = \u0275\u0275readContextLet(7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(g_r6.error);
  }
}
function FarmerHelp_Conditional_10_For_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "strong");
    \u0275\u0275text(2, "Our answer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const x_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(x_r7.resolution);
  }
}
function FarmerHelp_Conditional_10_For_1_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "day");
  }
  if (rf & 2) {
    const x_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" \xB7 reply by ", \u0275\u0275pipeBind1(1, 1, x_r7.due_on), " ");
  }
}
function FarmerHelp_Conditional_10_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 24)(1, "div", 25)(2, "span", 26);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 27);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "strong", 28);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 29);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, FarmerHelp_Conditional_10_For_1_Conditional_10_Template, 5, 1, "div", 30);
    \u0275\u0275elementStart(11, "span", 31);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "day");
    \u0275\u0275conditionalCreate(14, FarmerHelp_Conditional_10_For_1_Conditional_14_Template, 2, 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const x_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(x_r7.code);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.tone(x_r7));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.label(x_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(x_r7.subject);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(x_r7.description);
    \u0275\u0275advance();
    \u0275\u0275conditional(x_r7.resolution ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Sent ", \u0275\u0275pipeBind1(13, 9, x_r7.created_at));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!\u0275\u0275pureFunction0(11, _c1).includes(x_r7.status) ? 14 : -1);
  }
}
function FarmerHelp_Conditional_10_ForEmpty_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "p", 32);
    \u0275\u0275text(2, "You haven't raised any complaints.");
    \u0275\u0275elementEnd()();
  }
}
function FarmerHelp_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, FarmerHelp_Conditional_10_For_1_Template, 15, 12, "article", 24, _forTrack1, false, FarmerHelp_Conditional_10_ForEmpty_2_Template, 3, 0, "section", 2);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const g_r6 = \u0275\u0275readContextLet(7);
    \u0275\u0275repeater(g_r6.data ?? \u0275\u0275pureFunction0(1, _c02));
  }
}
var FarmerHome = class _FarmerHome {
  d = inject(FarmerData);
  st = this.d.statement;
  m = (v) => money(v);
  waiting = computed(
    () => (this.st().data?.items ?? []).filter((i) => i.payout_status !== "paid").reduce((a, i) => a + Number(i.amount), 0),
    ...ngDevMode ? [{ debugName: "waiting" }] : (
      /* istanbul ignore next */
      []
    )
  );
  steps = computed(
    () => {
      const out = [];
      const p = this.d.profile();
      if (!p.loading && !p.data)
        out.push({ title: "Add your payment details", text: "We need your UPI ID or bank account to pay you.", icon: "wallet", link: "/farmer/payment-details", tone: "warn" });
      else if (p.data && !p.data.verified)
        out.push({ title: "Payment details are being checked", text: "We are confirming your account with the bank. No action needed.", icon: "clock", link: "/farmer/payment-details", tone: "info" });
      for (const i of this.st().data?.items ?? []) {
        if (i.payout_status === "on_hold")
          out.push({ title: `Payment for ${i.sale_code} is on hold`, text: i.lines[i.lines.length - 1]?.replace(/^On hold: /, "") ?? "", icon: "alert", link: "/farmer/payments", tone: "warn" });
        if (i.payout_status === "failed")
          out.push({ title: `Payment for ${i.sale_code} didn't go through`, text: "It will be tried again. Check your payment details are correct.", icon: "alert", link: "/farmer/payment-details", tone: "danger" });
      }
      const missing = (this.d.consents().data?.current ?? []).filter((c) => c.state !== "granted" && (c.purpose === "payments" || c.purpose === "sampling"));
      for (const c of missing)
        out.push({ title: `Consent needed: ${PURPOSES[c.purpose]?.en ?? c.purpose}`, text: "Without it, this part of the programme is paused for you.", icon: "shield", link: "/farmer/consents", tone: "warn" });
      const open = (this.d.grievances().data ?? []).filter((g) => !["resolved", "closed"].includes(g.status));
      if (open.length)
        out.push({ title: `${open.length} open complaint${open.length > 1 ? "s" : ""}`, text: `We will reply by ${new Date(open[0].due_on).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`, icon: "message", link: "/farmer/help", tone: "info" });
      return out;
    },
    ...ngDevMode ? [{ debugName: "steps" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function FarmerHome_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerHome)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerHome, selectors: [["vcf-home"]], decls: 47, vars: 9, consts: [["kn", "\u0CA8\u0CAE\u0CB8\u0CCD\u0C95\u0CBE\u0CB0", "sub", "Here is how your soil-carbon work is going.", 3, "en"], [1, "hero"], [1, "lbl"], ["lang", "kn"], [1, "skel", "light"], [1, "amt", "num"], [1, "sub"], ["routerLink", "/farmer/payments", 1, "heroLink"], ["name", "arrow-right", 3, "size"], [1, "panel"], [1, "ph"], ["lang", "kn", 1, "kn"], [1, "step", 3, "routerLink", "class"], [1, "allgood"], [1, "quick"], ["routerLink", "/farmer/fields", 1, "q"], ["name", "sprout", 3, "size"], ["routerLink", "/farmer/payment-details", 1, "q"], ["name", "landmark", 3, "size"], ["routerLink", "/farmer/consents", 1, "q"], ["name", "shield-check", 3, "size"], ["routerLink", "/farmer/help", 1, "q"], ["name", "message", 3, "size"], [1, "step", 3, "routerLink"], [1, "si"], [3, "name", "size"], [1, "sb"], ["name", "chevron-right", 3, "size"], ["name", "check-circle", 3, "size"], [1, "big"]], template: function FarmerHome_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vcf-title", 0);
      \u0275\u0275elementStart(1, "section", 1)(2, "span", 2);
      \u0275\u0275text(3, "Total paid to you ");
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5, "\xB7 \u0CA8\u0CBF\u0CAE\u0C97\u0CC6 \u0CAA\u0CBE\u0CB5\u0CA4\u0CBF\u0CB8\u0CBF\u0CA6 \u0C92\u0C9F\u0CCD\u0C9F\u0CC1 \u0CAE\u0CCA\u0CA4\u0CCD\u0CA4");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(6, FarmerHome_Conditional_6_Template, 1, 0, "div", 4)(7, FarmerHome_Conditional_7_Template, 2, 1, "strong", 5);
      \u0275\u0275conditionalCreate(8, FarmerHome_Conditional_8_Template, 2, 1, "span", 6)(9, FarmerHome_Conditional_9_Template, 2, 2, "span", 6);
      \u0275\u0275elementStart(10, "a", 7);
      \u0275\u0275text(11, "See how it was worked out ");
      \u0275\u0275element(12, "vc-icon", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "section", 9)(14, "div", 10)(15, "h2");
      \u0275\u0275text(16, "Next steps");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "span", 11);
      \u0275\u0275text(18, "\u0CAE\u0CC1\u0C82\u0CA6\u0CBF\u0CA8 \u0CB9\u0CC6\u0C9C\u0CCD\u0C9C\u0CC6\u0C97\u0CB3\u0CC1");
      \u0275\u0275elementEnd()();
      \u0275\u0275repeaterCreate(19, FarmerHome_For_20_Template, 9, 8, "a", 12, _forTrack02, false, FarmerHome_ForEmpty_21_Template, 4, 1, "div", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 14)(23, "a", 15);
      \u0275\u0275element(24, "vc-icon", 16);
      \u0275\u0275elementStart(25, "strong");
      \u0275\u0275text(26, "My fields");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "span", 3);
      \u0275\u0275text(28, "\u0CA8\u0CA8\u0CCD\u0CA8 \u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "a", 17);
      \u0275\u0275element(30, "vc-icon", 18);
      \u0275\u0275elementStart(31, "strong");
      \u0275\u0275text(32, "Payment details");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "span", 3);
      \u0275\u0275text(34, "\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF \u0CB5\u0CBF\u0CB5\u0CB0\u0C97\u0CB3\u0CC1");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "a", 19);
      \u0275\u0275element(36, "vc-icon", 20);
      \u0275\u0275elementStart(37, "strong");
      \u0275\u0275text(38, "My consents");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "span", 3);
      \u0275\u0275text(40, "\u0CA8\u0CA8\u0CCD\u0CA8 \u0C92\u0CAA\u0CCD\u0CAA\u0CBF\u0C97\u0CC6\u0C97\u0CB3\u0CC1");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "a", 21);
      \u0275\u0275element(42, "vc-icon", 22);
      \u0275\u0275elementStart(43, "strong");
      \u0275\u0275text(44, "Help");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "span", 3);
      \u0275\u0275text(46, "\u0CB8\u0CB9\u0CBE\u0CAF");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("en", "Namaskara, " + ctx.d.firstName());
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.st().loading && !ctx.st().data ? 6 : 7);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.waiting() > 0 ? 8 : 9);
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 16);
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.steps());
      \u0275\u0275advance(5);
      \u0275\u0275property("size", 22);
      \u0275\u0275advance(6);
      \u0275\u0275property("size", 22);
      \u0275\u0275advance(6);
      \u0275\u0275property("size", 22);
      \u0275\u0275advance(6);
      \u0275\u0275property("size", 22);
    }
  }, dependencies: [RouterLink, Icon, FarmerTitle], styles: ["\n.panel[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 16px;\n  box-shadow: var(--%NS%shadow-sm);\n  padding: 18px;\n}\n.panel[_ngcontent-%COMP%]    + .panel[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 18px;\n  flex: 1;\n}\n.kn[_ngcontent-%COMP%] {\n  color: var(--%NS%clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-600);\n}\n.btn-lg[_ngcontent-%COMP%] {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.pill.info[_ngcontent-%COMP%] {\n  background: var(--%NS%info-soft);\n  color: var(--%NS%sky-600);\n}\n.pill.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.pill.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.pill.neutral[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.skel[_ngcontent-%COMP%] {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  margin: 10px 0;\n}\n.err[_ngcontent-%COMP%] {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  font-size: 15px;\n}\n.hero[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 22px 20px;\n  border-radius: 18px;\n  color: #fff;\n  margin-bottom: 16px;\n  background:\n    radial-gradient(\n      120% 140% at 100% 0%,\n      #4f9168 0%,\n      #275e3f 45%,\n      #173826 100%);\n  box-shadow: 0 12px 30px rgba(23, 56, 38, 0.22);\n}\n.lbl[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: rgba(255, 255, 255, 0.8);\n}\n.amt[_ngcontent-%COMP%] {\n  font-size: 40px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  line-height: 1.15;\n  margin-top: 4px;\n}\n.sub[_ngcontent-%COMP%] {\n  font-size: 15px;\n  color: rgba(255, 255, 255, 0.82);\n}\n.heroLink[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  color: #fff;\n  font-weight: 600;\n  font-size: 15px;\n}\n.skel.light[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.2);\n  height: 40px;\n  width: 60%;\n}\n.step[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 14px 4px;\n  border-top: 1px solid var(--%NS%stone-100);\n  color: var(--%NS%stone-800);\n  text-decoration: none !important;\n}\n.step[_ngcontent-%COMP%]:first-of-type {\n  border-top: 0;\n}\n.si[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 42px;\n  height: 42px;\n  border-radius: 12px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-600);\n  flex: none;\n}\n.t-warn[_ngcontent-%COMP%]   .si[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.t-danger[_ngcontent-%COMP%]   .si[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.sb[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.sb[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.sb[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 14.5px;\n  color: var(--%NS%stone-600);\n}\n.allgood[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  color: var(--%NS%forest-700);\n}\n.quick[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n  margin-top: 16px;\n}\n.q[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 16px;\n  border-radius: 16px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  color: var(--%NS%stone-800);\n  text-decoration: none !important;\n}\n.q[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n  margin-bottom: 6px;\n}\n.q[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.q[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%clay-600);\n}\n/*# sourceMappingURL=farmer-pages.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerHome, [{
    type: Component,
    args: [{ selector: "vcf-home", imports: [RouterLink, ...KIT, FarmerTitle], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vcf-title [en]="'Namaskara, ' + d.firstName()" kn="\u0CA8\u0CAE\u0CB8\u0CCD\u0C95\u0CBE\u0CB0" sub="Here is how your soil-carbon work is going." />

    <section class="hero">
      <span class="lbl">Total paid to you <span lang="kn">\xB7 \u0CA8\u0CBF\u0CAE\u0C97\u0CC6 \u0CAA\u0CBE\u0CB5\u0CA4\u0CBF\u0CB8\u0CBF\u0CA6 \u0C92\u0C9F\u0CCD\u0C9F\u0CC1 \u0CAE\u0CCA\u0CA4\u0CCD\u0CA4</span></span>
      @if (st().loading && !st().data) { <div class="skel light"></div> }
      @else { <strong class="amt num">{{ m(st().data?.total_paid ?? '0') }}</strong> }
      @if (waiting() > 0) { <span class="sub">{{ m(waiting()) }} more is on its way</span> }
      @else { <span class="sub">From {{ st().data?.items?.length ?? 0 }} credit sale{{ st().data?.items?.length === 1 ? '' : 's' }} so far</span> }
      <a routerLink="/farmer/payments" class="heroLink">See how it was worked out <vc-icon name="arrow-right" [size]="16" /></a>
    </section>

    <section class="panel">
      <div class="ph"><h2>Next steps</h2><span class="kn" lang="kn">\u0CAE\u0CC1\u0C82\u0CA6\u0CBF\u0CA8 \u0CB9\u0CC6\u0C9C\u0CCD\u0C9C\u0CC6\u0C97\u0CB3\u0CC1</span></div>
      @for (s of steps(); track s.title) {
        <a class="step" [routerLink]="s.link" [class]="'t-' + s.tone">
          <span class="si"><vc-icon [name]="s.icon" [size]="20" /></span>
          <span class="sb"><strong>{{ s.title }}</strong><span>{{ s.text }}</span></span>
          <vc-icon name="chevron-right" [size]="18" />
        </a>
      } @empty {
        <div class="allgood"><vc-icon name="check-circle" [size]="22" /><span class="big">You're all set. Nothing needs your attention right now.</span></div>
      }
    </section>

    <div class="quick">
      <a routerLink="/farmer/fields" class="q"><vc-icon name="sprout" [size]="22" /><strong>My fields</strong><span lang="kn">\u0CA8\u0CA8\u0CCD\u0CA8 \u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1</span></a>
      <a routerLink="/farmer/payment-details" class="q"><vc-icon name="landmark" [size]="22" /><strong>Payment details</strong><span lang="kn">\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF \u0CB5\u0CBF\u0CB5\u0CB0\u0C97\u0CB3\u0CC1</span></a>
      <a routerLink="/farmer/consents" class="q"><vc-icon name="shield-check" [size]="22" /><strong>My consents</strong><span lang="kn">\u0CA8\u0CA8\u0CCD\u0CA8 \u0C92\u0CAA\u0CCD\u0CAA\u0CBF\u0C97\u0CC6\u0C97\u0CB3\u0CC1</span></a>
      <a routerLink="/farmer/help" class="q"><vc-icon name="message" [size]="22" /><strong>Help</strong><span lang="kn">\u0CB8\u0CB9\u0CBE\u0CAF</span></a>
    </div>
  `, styles: ["/* angular:styles/component:scss;b7dfbb001d9bdcb2;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmer-portal\\farmer-pages.ts */\n.panel {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  box-shadow: var(--shadow-sm);\n  padding: 18px;\n}\n.panel + .panel {\n  margin-top: 14px;\n}\n.ph {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph h2 {\n  font-size: 18px;\n  flex: 1;\n}\n.kn {\n  color: var(--clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted {\n  color: var(--stone-600);\n}\n.btn-lg {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.pill.info {\n  background: var(--info-soft);\n  color: var(--sky-600);\n}\n.pill.warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.pill.danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.pill.neutral {\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.skel {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  margin: 10px 0;\n}\n.err {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--danger-soft);\n  color: var(--red-600);\n  font-size: 15px;\n}\n.hero {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 22px 20px;\n  border-radius: 18px;\n  color: #fff;\n  margin-bottom: 16px;\n  background:\n    radial-gradient(\n      120% 140% at 100% 0%,\n      #4f9168 0%,\n      #275e3f 45%,\n      #173826 100%);\n  box-shadow: 0 12px 30px rgba(23, 56, 38, 0.22);\n}\n.lbl {\n  font-size: 14px;\n  color: rgba(255, 255, 255, 0.8);\n}\n.amt {\n  font-size: 40px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  line-height: 1.15;\n  margin-top: 4px;\n}\n.sub {\n  font-size: 15px;\n  color: rgba(255, 255, 255, 0.82);\n}\n.heroLink {\n  margin-top: 12px;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  color: #fff;\n  font-weight: 600;\n  font-size: 15px;\n}\n.skel.light {\n  background: rgba(255, 255, 255, 0.2);\n  height: 40px;\n  width: 60%;\n}\n.step {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 14px 4px;\n  border-top: 1px solid var(--stone-100);\n  color: var(--stone-800);\n  text-decoration: none !important;\n}\n.step:first-of-type {\n  border-top: 0;\n}\n.si {\n  display: grid;\n  place-items: center;\n  width: 42px;\n  height: 42px;\n  border-radius: 12px;\n  background: var(--forest-50);\n  color: var(--forest-600);\n  flex: none;\n}\n.t-warn .si {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.t-danger .si {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.sb {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.sb strong {\n  font-size: 16px;\n}\n.sb span {\n  font-size: 14.5px;\n  color: var(--stone-600);\n}\n.allgood {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  color: var(--forest-700);\n}\n.quick {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n  margin-top: 16px;\n}\n.q {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 16px;\n  border-radius: 16px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  color: var(--stone-800);\n  text-decoration: none !important;\n}\n.q vc-icon {\n  color: var(--forest-600);\n  margin-bottom: 6px;\n}\n.q strong {\n  font-size: 16px;\n}\n.q span {\n  font-size: 13.5px;\n  color: var(--clay-600);\n}\n/*# sourceMappingURL=farmer-pages.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerHome, { className: "FarmerHome", filePath: "src/app/features/farmer-portal/farmer-pages.ts", lineNumber: 86 });
})();
var FarmerFields = class _FarmerFields {
  d = inject(FarmerData);
  fieldCount(o) {
    return o.farms.reduce((a, f) => a + f.fields.length, 0);
  }
  enrolled(o, code) {
    return o.enrolments.find((e) => e.field_code === code && e.status === "enrolled") ?? null;
  }
  latest = computed(
    () => {
      const it = this.d.statement().data?.items ?? [];
      return it[it.length - 1] ?? null;
    },
    ...ngDevMode ? [{ debugName: "latest" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fromStatement = computed(
    () => this.latest()?.inputs.fields ?? [],
    ...ngDevMode ? [{ debugName: "fromStatement" }] : (
      /* istanbul ignore next */
      []
    )
  );
  area = computed(
    () => this.latest()?.inputs.area_ha ?? 0,
    ...ngDevMode ? [{ debugName: "area" }] : (
      /* istanbul ignore next */
      []
    )
  );
  practices = computed(
    () => this.latest()?.inputs.practices ?? 0,
    ...ngDevMode ? [{ debugName: "practices" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function FarmerFields_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerFields)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerFields, selectors: [["vcf-fields"]], decls: 4, vars: 1, consts: [["en", "My fields", "kn", "\u0CA8\u0CA8\u0CCD\u0CA8 \u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1", "sub", "The land you have enrolled in the soil-carbon programme."], [1, "panel"], [1, "skel"], [1, "skel", 2, "width", "60%"], [1, "tot"], [1, "num"], [1, "ph"], [1, "muted"], [1, "fld"], [1, "fi"], ["name", "sprout", 3, "size"], [1, "fb"], [1, "fa"], [1, "pill", "ok"], [1, "pill", "neutral"], [1, "big"], [1, "note"], [1, "mono"]], template: function FarmerFields_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vcf-title", 0);
      \u0275\u0275conditionalCreate(1, FarmerFields_Conditional_1_Template, 3, 0, "section", 1)(2, FarmerFields_Conditional_2_Template, 20, 7)(3, FarmerFields_Conditional_3_Template, 2, 1);
    }
    if (rf & 2) {
      let tmp_1_0;
      const ov_r6 = ctx.d.overview();
      \u0275\u0275advance();
      \u0275\u0275conditional(ov_r6.loading && !ov_r6.data ? 1 : (tmp_1_0 = ov_r6.data) ? 2 : 3, tmp_1_0);
    }
  }, dependencies: [Icon, FarmerTitle, NumPipe], styles: ["\n.panel[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 16px;\n  box-shadow: var(--%NS%shadow-sm);\n  padding: 18px;\n}\n.panel[_ngcontent-%COMP%]    + .panel[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 18px;\n  flex: 1;\n}\n.kn[_ngcontent-%COMP%] {\n  color: var(--%NS%clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-600);\n}\n.btn-lg[_ngcontent-%COMP%] {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.pill.info[_ngcontent-%COMP%] {\n  background: var(--%NS%info-soft);\n  color: var(--%NS%sky-600);\n}\n.pill.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.pill.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.pill.neutral[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.skel[_ngcontent-%COMP%] {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  margin: 10px 0;\n}\n.err[_ngcontent-%COMP%] {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  font-size: 15px;\n}\n.tot[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.tot[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 14px;\n  padding: 14px 12px;\n  display: flex;\n  flex-direction: column;\n}\n.tot[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  color: var(--%NS%forest-800);\n}\n.tot[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%stone-600);\n}\n.fld[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 0;\n  border-top: 1px solid var(--%NS%stone-100);\n}\n.fld[_ngcontent-%COMP%]:first-of-type {\n  border-top: 0;\n}\n.fi[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 40px;\n  height: 40px;\n  border-radius: 12px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-600);\n  flex: none;\n}\n.fb[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.fb[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.fb[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%stone-600);\n}\n.fa[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 4px;\n}\n.fa[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.fa[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 2px 10px;\n}\n.note[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  font-size: 14.5px;\n  color: var(--%NS%stone-600);\n}\n/*# sourceMappingURL=farmer-pages.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerFields, [{
    type: Component,
    args: [{ selector: "vcf-fields", imports: [...KIT, NumPipe, FarmerTitle], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vcf-title en="My fields" kn="\u0CA8\u0CA8\u0CCD\u0CA8 \u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1" sub="The land you have enrolled in the soil-carbon programme." />
    @let ov = d.overview();
    @if (ov.loading && !ov.data) {
      <section class="panel"><div class="skel"></div><div class="skel" style="width:60%"></div></section>
    } @else if (ov.data; as o) {
      <div class="tot">
        <div><strong class="num">{{ o.total_area_ha | num: 2 }}</strong><span>hectares \xB7 \u0CB9\u0CC6\u0C95\u0CCD\u0C9F\u0CC7\u0CB0\u0CCD</span></div>
        <div><strong class="num">{{ fieldCount(o) }}</strong><span>fields \xB7 \u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1</span></div>
        <div><strong class="num">{{ o.practice_records }}</strong><span>practices recorded</span></div>
      </div>
      @for (f of o.farms; track f.id) {
        <section class="panel">
          <div class="ph"><h2>{{ f.name }}</h2><span class="muted">{{ f.village }}</span></div>
          @for (fl of f.fields; track fl.id) {
            <div class="fld">
              <span class="fi"><vc-icon name="sprout" [size]="20" /></span>
              <div class="fb"><strong>{{ fl.name || fl.code }}</strong><span>{{ fl.code }}@if (fl.crop_code) { \xB7 {{ fl.crop_code }} }</span></div>
              <div class="fa"><strong class="num">{{ fl.area_ha | num: 2 }} ha</strong>
                @if (enrolled(o, fl.code); as e) { <span class="pill ok">In {{ e.project_code }}</span> } @else { <span class="pill neutral">Not enrolled</span> }</div>
            </div>
          } @empty { <p class="muted">No fields mapped on this farm yet.</p> }
        </section>
      } @empty {
        <section class="panel"><p class="big">No farms are registered to you yet. Your field officer maps your fields with you on the first visit.</p></section>
      }
    } @else {
      <!-- The overview API is staff-only today; fall back to what the statement tells us. -->
      @if (fromStatement().length) {
        <div class="tot">
          <div><strong class="num">{{ area() | num: 2 }}</strong><span>hectares enrolled \xB7 \u0CB9\u0CC6\u0C95\u0CCD\u0C9F\u0CC7\u0CB0\u0CCD</span></div>
          <div><strong class="num">{{ fromStatement().length }}</strong><span>fields \xB7 \u0CB9\u0CCA\u0CB2\u0C97\u0CB3\u0CC1</span></div>
          <div><strong class="num">{{ practices() }}</strong><span>practices counted</span></div>
        </div>
        <section class="panel">
          <div class="ph"><h2>Enrolled fields</h2></div>
          @for (c of fromStatement(); track c) {
            <div class="fld"><span class="fi"><vc-icon name="sprout" [size]="20" /></span>
              <div class="fb"><strong class="mono">{{ c }}</strong><span>Counted in your latest payment</span></div>
              <span class="pill ok">Enrolled</span></div>
          }
        </section>
        <p class="note">These are the fields counted in your latest payment. To see the mapped boundaries or correct a field, ask your field officer or raise it under Help.</p>
      } @else {
        <section class="panel"><p class="big">Your field details will appear here after your field officer has mapped and enrolled your land.</p></section>
      }
    }
  `, styles: ["/* angular:styles/component:scss;c300d1200b95b7d8;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmer-portal\\farmer-pages.ts */\n.panel {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  box-shadow: var(--shadow-sm);\n  padding: 18px;\n}\n.panel + .panel {\n  margin-top: 14px;\n}\n.ph {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph h2 {\n  font-size: 18px;\n  flex: 1;\n}\n.kn {\n  color: var(--clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted {\n  color: var(--stone-600);\n}\n.btn-lg {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.pill.info {\n  background: var(--info-soft);\n  color: var(--sky-600);\n}\n.pill.warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.pill.danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.pill.neutral {\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.skel {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  margin: 10px 0;\n}\n.err {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--danger-soft);\n  color: var(--red-600);\n  font-size: 15px;\n}\n.tot {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.tot div {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  padding: 14px 12px;\n  display: flex;\n  flex-direction: column;\n}\n.tot strong {\n  font-size: 24px;\n  font-weight: 600;\n  color: var(--forest-800);\n}\n.tot span {\n  font-size: 13px;\n  color: var(--stone-600);\n}\n.fld {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 0;\n  border-top: 1px solid var(--stone-100);\n}\n.fld:first-of-type {\n  border-top: 0;\n}\n.fi {\n  display: grid;\n  place-items: center;\n  width: 40px;\n  height: 40px;\n  border-radius: 12px;\n  background: var(--forest-50);\n  color: var(--forest-600);\n  flex: none;\n}\n.fb {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.fb strong {\n  font-size: 16px;\n}\n.fb span {\n  font-size: 13.5px;\n  color: var(--stone-600);\n}\n.fa {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 4px;\n}\n.fa strong {\n  font-size: 16px;\n}\n.fa .pill {\n  font-size: 12px;\n  padding: 2px 10px;\n}\n.note {\n  margin-top: 14px;\n  font-size: 14.5px;\n  color: var(--stone-600);\n}\n/*# sourceMappingURL=farmer-pages.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerFields, { className: "FarmerFields", filePath: "src/app/features/farmer-portal/farmer-pages.ts", lineNumber: 175 });
})();
var FarmerPayments = class _FarmerPayments {
  d = inject(FarmerData);
  m = (v, c = "INR") => money(v, c);
  meta(s) {
    return PAY_STATUS[s] ?? PAY_STATUS["not_scheduled"];
  }
  /** Make the API's plain-language lines friendlier: "1303500.00 INR" -> "₹13,03,500", ISO dates -> "30 Sept 2026". */
  pretty(l) {
    return l.replace(/(\d+(?:\.\d{1,2})?) INR/g, (_, n) => money(Number(n)).replace(/\.00$/, "")).replace(/(\d+\.\d{3,})( ha)/g, (_, n, u) => `${Number(n).toFixed(2)}${u}`).replace(/(\d{4}-\d{2}-\d{2})/g, (d) => (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));
  }
  static \u0275fac = function FarmerPayments_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerPayments)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerPayments, selectors: [["vcf-payments"]], decls: 12, vars: 4, consts: [["en", "My payments", "kn", "\u0CA8\u0CA8\u0CCD\u0CA8 \u0CAA\u0CBE\u0CB5\u0CA4\u0CBF\u0C97\u0CB3\u0CC1", "sub", "Every payment, and exactly how your share was worked out."], [1, "panel"], [1, "err"], ["routerLink", "/farmer/payment-details", 1, "panel", "link"], ["name", "landmark", 3, "size"], [1, "big"], ["lang", "kn", 1, "kn"], ["name", "chevron-right", 3, "size"], [1, "skel"], [1, "sum"], [1, "num"], [1, "panel", "pay"], [1, "subtle"], [1, "pill"], [1, "lines"], [1, "chips"]], template: function FarmerPayments_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vcf-title", 0);
      \u0275\u0275declareLet(1);
      \u0275\u0275conditionalCreate(2, FarmerPayments_Conditional_2_Template, 3, 0, "section", 1)(3, FarmerPayments_Conditional_3_Template, 2, 1, "div", 2)(4, FarmerPayments_Conditional_4_Template, 14, 3);
      \u0275\u0275elementStart(5, "a", 3);
      \u0275\u0275element(6, "vc-icon", 4);
      \u0275\u0275elementStart(7, "span", 5);
      \u0275\u0275text(8, "Where we pay you");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "span", 6);
      \u0275\u0275text(10, "\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF \u0CB5\u0CBF\u0CB5\u0CB0\u0C97\u0CB3\u0CC1");
      \u0275\u0275elementEnd();
      \u0275\u0275element(11, "vc-icon", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      const st_r6 = \u0275\u0275storeLet(ctx.d.statement());
      \u0275\u0275advance();
      \u0275\u0275conditional(st_r6.loading && !st_r6.data ? 2 : st_r6.error ? 3 : (tmp_1_0 = st_r6.data) ? 4 : -1, tmp_1_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 20);
      \u0275\u0275advance(5);
      \u0275\u0275property("size", 18);
    }
  }, dependencies: [RouterLink, Icon, FarmerTitle], styles: ["\n.panel[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 16px;\n  box-shadow: var(--%NS%shadow-sm);\n  padding: 18px;\n}\n.panel[_ngcontent-%COMP%]    + .panel[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 18px;\n  flex: 1;\n}\n.kn[_ngcontent-%COMP%] {\n  color: var(--%NS%clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-600);\n}\n.btn-lg[_ngcontent-%COMP%] {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.pill.info[_ngcontent-%COMP%] {\n  background: var(--%NS%info-soft);\n  color: var(--%NS%sky-600);\n}\n.pill.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.pill.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.pill.neutral[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.skel[_ngcontent-%COMP%] {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  margin: 10px 0;\n}\n.err[_ngcontent-%COMP%] {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  font-size: 15px;\n}\n.sum[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.sum[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 14px;\n  padding: 14px;\n  display: flex;\n  flex-direction: column;\n}\n.sum[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%stone-600);\n}\n.sum[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 600;\n  color: var(--%NS%forest-800);\n}\n.pay[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.pay[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.pay[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.subtle[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--%NS%stone-500);\n}\n.lines[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 22px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  font-size: 15.5px;\n  line-height: 1.5;\n  color: var(--%NS%stone-800);\n}\n.lines[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]::marker {\n  color: var(--%NS%forest-500);\n  font-weight: 600;\n}\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 12px;\n}\n.chips[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13px;\n  padding: 3px 10px;\n  border-radius: 999px;\n  background: var(--%NS%sand-100);\n  color: var(--%NS%stone-700);\n}\n.link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-top: 14px;\n  color: var(--%NS%stone-800);\n  text-decoration: none !important;\n}\n.link[_ngcontent-%COMP%]   .big[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: 600;\n}\n.link[_ngcontent-%COMP%]    > vc-icon[_ngcontent-%COMP%]:first-child {\n  color: var(--%NS%forest-600);\n}\n/*# sourceMappingURL=farmer-pages.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerPayments, [{
    type: Component,
    args: [{ selector: "vcf-payments", imports: [RouterLink, ...KIT, FarmerTitle], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vcf-title en="My payments" kn="\u0CA8\u0CA8\u0CCD\u0CA8 \u0CAA\u0CBE\u0CB5\u0CA4\u0CBF\u0C97\u0CB3\u0CC1" sub="Every payment, and exactly how your share was worked out." />
    @let st = d.statement();
    @if (st.loading && !st.data) { <section class="panel"><div class="skel"></div><div class="skel"></div></section> }
    @else if (st.error) { <div class="err">{{ st.error }}</div> }
    @else if (st.data; as s) {
      <div class="sum">
        <div><span>Paid to you</span><strong class="num">{{ m(s.total_paid) }}</strong></div>
        <div><span>Your total share</span><strong class="num">{{ m(s.total_entitled) }}</strong></div>
      </div>
      @for (i of s.items.slice().reverse(); track i.pool_id) {
        <article class="panel pay">
          <header>
            <div><span class="subtle">Credit sale {{ i.sale_code }}</span><strong class="num">{{ m(i.amount, i.currency) }}</strong></div>
            <span class="pill" [class]="meta(i.payout_status).tone">{{ meta(i.payout_status).label }}</span>
          </header>
          <ol class="lines">
            @for (l of i.lines; track $index) { <li>{{ pretty(l) }}</li> }
          </ol>
          <div class="chips">
            <span>Rule version {{ i.rule_version }}</span>
            @if (i.inputs.area_ha) { <span>{{ i.inputs.area_ha.toFixed(2) }} ha counted</span> }
            @if (i.inputs.share) { <span>Your share {{ (i.inputs.share * 100).toFixed(2) }}%</span> }
          </div>
        </article>
      } @empty {
        <section class="panel"><p class="big">No payments yet. When carbon credits from your fields are sold, your share will appear here with a full explanation.</p></section>
      }
    }
    <a routerLink="/farmer/payment-details" class="panel link">
      <vc-icon name="landmark" [size]="20" /><span class="big">Where we pay you</span><span class="kn" lang="kn">\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF \u0CB5\u0CBF\u0CB5\u0CB0\u0C97\u0CB3\u0CC1</span><vc-icon name="chevron-right" [size]="18" />
    </a>
  `, styles: ["/* angular:styles/component:scss;bf0235b11ac5b4c4;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmer-portal\\farmer-pages.ts */\n.panel {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  box-shadow: var(--shadow-sm);\n  padding: 18px;\n}\n.panel + .panel {\n  margin-top: 14px;\n}\n.ph {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph h2 {\n  font-size: 18px;\n  flex: 1;\n}\n.kn {\n  color: var(--clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted {\n  color: var(--stone-600);\n}\n.btn-lg {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.pill.info {\n  background: var(--info-soft);\n  color: var(--sky-600);\n}\n.pill.warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.pill.danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.pill.neutral {\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.skel {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  margin: 10px 0;\n}\n.err {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--danger-soft);\n  color: var(--red-600);\n  font-size: 15px;\n}\n.sum {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.sum div {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  padding: 14px;\n  display: flex;\n  flex-direction: column;\n}\n.sum span {\n  font-size: 13.5px;\n  color: var(--stone-600);\n}\n.sum strong {\n  font-size: 22px;\n  font-weight: 600;\n  color: var(--forest-800);\n}\n.pay header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.pay header div {\n  display: flex;\n  flex-direction: column;\n}\n.pay header strong {\n  font-size: 26px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.subtle {\n  font-size: 14px;\n  color: var(--stone-500);\n}\n.lines {\n  margin: 0;\n  padding-left: 22px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  font-size: 15.5px;\n  line-height: 1.5;\n  color: var(--stone-800);\n}\n.lines li::marker {\n  color: var(--forest-500);\n  font-weight: 600;\n}\n.chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 12px;\n}\n.chips span {\n  font-size: 13px;\n  padding: 3px 10px;\n  border-radius: 999px;\n  background: var(--sand-100);\n  color: var(--stone-700);\n}\n.link {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-top: 14px;\n  color: var(--stone-800);\n  text-decoration: none !important;\n}\n.link .big {\n  flex: 1;\n  font-weight: 600;\n}\n.link > vc-icon:first-child {\n  color: var(--forest-600);\n}\n/*# sourceMappingURL=farmer-pages.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerPayments, { className: "FarmerPayments", filePath: "src/app/features/farmer-portal/farmer-pages.ts", lineNumber: 240 });
})();
var FarmerPaymentDetails = class _FarmerPaymentDetails {
  d = inject(FarmerData);
  toast = inject(ToastService);
  editing = signal(
    false,
    ...ngDevMode ? [{ debugName: "editing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saved(p) {
    this.d.setProfile(p);
    this.editing.set(false);
    this.toast.success("Payment details saved", "We will check them with your bank.");
  }
  static \u0275fac = function FarmerPaymentDetails_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerPaymentDetails)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerPaymentDetails, selectors: [["vcf-payment-details"]], decls: 9, vars: 3, consts: [["en", "Payment details", "kn", "\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF \u0CB5\u0CBF\u0CB5\u0CB0\u0C97\u0CB3\u0CC1", "sub", "Where your money is sent. We only ever show the last few digits."], [1, "panel"], [1, "panel", "card"], [1, "note"], ["name", "lock", 3, "size"], [3, "saved", "cancelled", "farmerId", "current", "large"], [1, "skel"], [1, "acct"], [1, "ic"], [3, "name", "size"], [1, "ab"], [1, "subtle"], [1, "mono"], [1, "subtle", "mono"], [1, "ver", "ok"], [1, "ver", "wait"], [1, "btn", "btn-secondary", "btn-lg", 3, "click"], ["name", "pencil", 3, "size"], ["name", "check-circle", 3, "size"], ["name", "clock", 3, "size"], [1, "big"], [1, "btn", "btn-primary", "btn-lg", 2, "margin-top", "14px", "width", "100%", 3, "click"], ["name", "plus", 3, "size"]], template: function FarmerPaymentDetails_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vcf-title", 0);
      \u0275\u0275declareLet(1);
      \u0275\u0275conditionalCreate(2, FarmerPaymentDetails_Conditional_2_Template, 2, 3, "section", 1)(3, FarmerPaymentDetails_Conditional_3_Template, 2, 0, "section", 1)(4, FarmerPaymentDetails_Conditional_4_Template, 17, 8, "section", 2)(5, FarmerPaymentDetails_Conditional_5_Template, 6, 1, "section", 1);
      \u0275\u0275elementStart(6, "p", 3);
      \u0275\u0275element(7, "vc-icon", 4);
      \u0275\u0275text(8, "Nobody from the programme will ever ask for your UPI PIN or OTP.");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      const p_r7 = \u0275\u0275storeLet(ctx.d.profile());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.editing() ? 2 : p_r7.loading && !p_r7.data ? 3 : (tmp_1_0 = p_r7.data) ? 4 : 5, tmp_1_0);
      \u0275\u0275advance(5);
      \u0275\u0275property("size", 15);
    }
  }, dependencies: [Icon, FarmerTitle, ProfileForm, DayPipe], styles: ["\n.panel[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 16px;\n  box-shadow: var(--%NS%shadow-sm);\n  padding: 18px;\n}\n.panel[_ngcontent-%COMP%]    + .panel[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 18px;\n  flex: 1;\n}\n.kn[_ngcontent-%COMP%] {\n  color: var(--%NS%clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-600);\n}\n.btn-lg[_ngcontent-%COMP%] {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.pill.info[_ngcontent-%COMP%] {\n  background: var(--%NS%info-soft);\n  color: var(--%NS%sky-600);\n}\n.pill.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.pill.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.pill.neutral[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.skel[_ngcontent-%COMP%] {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  margin: 10px 0;\n}\n.err[_ngcontent-%COMP%] {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  font-size: 15px;\n}\n.card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.acct[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 14px;\n  align-items: flex-start;\n}\n.ic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 52px;\n  height: 52px;\n  border-radius: 14px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-600);\n  flex: none;\n}\n.ab[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  font-size: 15.5px;\n  min-width: 0;\n}\n.ab[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 20px;\n  overflow-wrap: anywhere;\n}\n.subtle[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%stone-500);\n}\n.ver[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  padding: 12px 14px;\n  border-radius: 12px;\n  font-size: 15px;\n}\n.ver.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.ver.wait[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.note[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin-top: 16px;\n  font-size: 14px;\n  color: var(--%NS%stone-600);\n}\n/*# sourceMappingURL=farmer-pages.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerPaymentDetails, [{
    type: Component,
    args: [{ selector: "vcf-payment-details", imports: [...KIT, DayPipe, FarmerTitle, ProfileForm], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vcf-title en="Payment details" kn="\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF \u0CB5\u0CBF\u0CB5\u0CB0\u0C97\u0CB3\u0CC1" sub="Where your money is sent. We only ever show the last few digits." />
    @let p = d.profile();
    @if (editing()) {
      <section class="panel">
        <vcx-profile-form [farmerId]="d.farmerId()!" [current]="p.data" [large]="true" (saved)="saved($event)" (cancelled)="editing.set(false)" />
      </section>
    } @else if (p.loading && !p.data) {
      <section class="panel"><div class="skel"></div></section>
    } @else if (p.data; as pr) {
      <section class="panel card">
        <div class="acct">
          <span class="ic"><vc-icon [name]="pr.method === 'upi' ? 'zap' : 'landmark'" [size]="24" /></span>
          <div class="ab">
            <span class="subtle">{{ pr.method === 'upi' ? 'UPI' : 'Bank account' }}</span>
            <strong class="mono">{{ pr.method === 'upi' ? pr.upi_id : pr.account_masked }}</strong>
            @if (pr.ifsc) { <span class="subtle mono">IFSC {{ pr.ifsc }}</span> }
            <span>{{ pr.account_name }}</span>
          </div>
        </div>
        @if (pr.verified) {
          <div class="ver ok"><vc-icon name="check-circle" [size]="20" /><span>Verified on {{ pr.verified_on | day }}. Payments go here.</span></div>
        } @else {
          <div class="ver wait"><vc-icon name="clock" [size]="20" /><span>Being checked with the bank. Payments start once this is confirmed.</span></div>
        }
        <button class="btn btn-secondary btn-lg" (click)="editing.set(true)"><vc-icon name="pencil" [size]="18" />Change details</button>
      </section>
    } @else {
      <section class="panel">
        <p class="big">You haven't added payment details yet. Add your UPI ID or bank account so we can pay your share.</p>
        <button class="btn btn-primary btn-lg" style="margin-top:14px;width:100%" (click)="editing.set(true)"><vc-icon name="plus" [size]="18" />Add payment details</button>
      </section>
    }
    <p class="note"><vc-icon name="lock" [size]="15" />Nobody from the programme will ever ask for your UPI PIN or OTP.</p>
  `, styles: ["/* angular:styles/component:scss;2582607b5cfc66fa;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmer-portal\\farmer-pages.ts */\n.panel {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  box-shadow: var(--shadow-sm);\n  padding: 18px;\n}\n.panel + .panel {\n  margin-top: 14px;\n}\n.ph {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph h2 {\n  font-size: 18px;\n  flex: 1;\n}\n.kn {\n  color: var(--clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted {\n  color: var(--stone-600);\n}\n.btn-lg {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.pill.info {\n  background: var(--info-soft);\n  color: var(--sky-600);\n}\n.pill.warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.pill.danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.pill.neutral {\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.skel {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  margin: 10px 0;\n}\n.err {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--danger-soft);\n  color: var(--red-600);\n  font-size: 15px;\n}\n.card {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.acct {\n  display: flex;\n  gap: 14px;\n  align-items: flex-start;\n}\n.ic {\n  display: grid;\n  place-items: center;\n  width: 52px;\n  height: 52px;\n  border-radius: 14px;\n  background: var(--forest-50);\n  color: var(--forest-600);\n  flex: none;\n}\n.ab {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  font-size: 15.5px;\n  min-width: 0;\n}\n.ab strong {\n  font-size: 20px;\n  overflow-wrap: anywhere;\n}\n.subtle {\n  font-size: 13.5px;\n  color: var(--stone-500);\n}\n.ver {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  padding: 12px 14px;\n  border-radius: 12px;\n  font-size: 15px;\n}\n.ver.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.ver.wait {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.note {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin-top: 16px;\n  font-size: 14px;\n  color: var(--stone-600);\n}\n/*# sourceMappingURL=farmer-pages.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerPaymentDetails, { className: "FarmerPaymentDetails", filePath: "src/app/features/farmer-portal/farmer-pages.ts", lineNumber: 304 });
})();
var FarmerConsents = class _FarmerConsents {
  d = inject(FarmerData);
  api = inject(ApiService);
  toast = inject(ToastService);
  target = signal(
    null,
    ...ngDevMode ? [{ debugName: "target" }] : (
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
  err = signal(
    null,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  p(c) {
    return PURPOSES[c.purpose] ?? { en: c.purpose, kn: "", what: "" };
  }
  ask(c, grant) {
    this.err.set(null);
    this.target.set({ c, grant });
  }
  withdrawEffect(purpose) {
    return {
      sampling: "Nobody will take soil samples from your fields.",
      payments: "Payments to you will be put on hold until you give consent again.",
      share_with_buyers: "Your fields will not be counted in summaries shared with buyers.",
      sensor_installation: "No new sensors will be placed, and existing ones will be collected."
    }[purpose] ?? "";
  }
  confirm() {
    const t = this.target();
    const fid = this.d.farmerId();
    if (!t || !fid)
      return;
    this.busy.set(true);
    this.api.post(`/farmers/${fid}/consents`, { purpose: t.c.purpose, granted: t.grant, channel: "app", notes: "Changed by the farmer in the farmer portal." }).subscribe({
      next: () => {
        this.busy.set(false);
        this.target.set(null);
        this.toast.success(t.grant ? "Consent given" : "Consent withdrawn", this.p(t.c).en);
        this.d.reloadConsents();
      },
      error: (e) => {
        this.busy.set(false);
        this.err.set(e.message);
      }
    });
  }
  static \u0275fac = function FarmerConsents_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerConsents)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerConsents, selectors: [["vcf-consents"]], decls: 12, vars: 12, consts: [["en", "My consents", "kn", "\u0CA8\u0CA8\u0CCD\u0CA8 \u0C92\u0CAA\u0CCD\u0CAA\u0CBF\u0C97\u0CC6\u0C97\u0CB3\u0CC1", "sub", "You decide what the programme may do. You can change your mind at any time."], [1, "panel"], [1, "err"], ["width", "460px", 3, "closed", "open", "title", "subtitle"], [1, "stack"], ["footer", ""], [1, "btn", "btn-ghost", "btn-lg", 3, "click"], [1, "btn", "btn-lg", 3, "click", "disabled"], [1, "skel"], [1, "panel", "cons"], [1, "ch"], [1, "ct"], ["lang", "kn", 1, "kn"], [1, "pill"], [1, "what"], [1, "cf"], [1, "subtle"], [1, "btn", "btn-secondary"], [1, "btn", "btn-primary"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click"], [1, "big"], [1, "muted"]], template: function FarmerConsents_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vcf-title", 0);
      \u0275\u0275declareLet(1);
      \u0275\u0275conditionalCreate(2, FarmerConsents_Conditional_2_Template, 3, 0, "section", 1)(3, FarmerConsents_Conditional_3_Template, 2, 1, "div", 2)(4, FarmerConsents_Conditional_4_Template, 2, 0);
      \u0275\u0275elementStart(5, "vc-modal", 3);
      \u0275\u0275listener("closed", function FarmerConsents_Template_vc_modal_closed_5_listener() {
        return ctx.target.set(null);
      });
      \u0275\u0275conditionalCreate(6, FarmerConsents_Conditional_6_Template, 4, 2, "div", 4);
      \u0275\u0275elementContainerStart(7, 5);
      \u0275\u0275elementStart(8, "button", 6);
      \u0275\u0275listener("click", function FarmerConsents_Template_button_click_8_listener() {
        return ctx.target.set(null);
      });
      \u0275\u0275text(9, "Go back");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "button", 7);
      \u0275\u0275listener("click", function FarmerConsents_Template_button_click_10_listener() {
        return ctx.confirm();
      });
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_5_0;
      \u0275\u0275advance();
      const c_r7 = \u0275\u0275storeLet(ctx.d.consents());
      \u0275\u0275advance();
      \u0275\u0275conditional(c_r7.loading && !c_r7.data ? 2 : c_r7.error ? 3 : (tmp_1_0 = c_r7.data) ? 4 : -1, tmp_1_0);
      \u0275\u0275advance(3);
      \u0275\u0275property("open", !!ctx.target())("title", ctx.target()?.grant ? "Give consent?" : "Withdraw consent?")("subtitle", ctx.target() ? ctx.p(ctx.target().c).en + " \xB7 " + ctx.p(ctx.target().c).kn : "");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_5_0 = ctx.target()) ? 6 : -1, tmp_5_0);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("btn-primary", ctx.target()?.grant)("btn-danger", !ctx.target()?.grant);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.target()?.grant ? "Yes, I agree" : "Yes, withdraw");
    }
  }, dependencies: [Modal, FarmerTitle, DayPipe], styles: ["\n.panel[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 16px;\n  box-shadow: var(--%NS%shadow-sm);\n  padding: 18px;\n}\n.panel[_ngcontent-%COMP%]    + .panel[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 18px;\n  flex: 1;\n}\n.kn[_ngcontent-%COMP%] {\n  color: var(--%NS%clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-600);\n}\n.btn-lg[_ngcontent-%COMP%] {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.pill.info[_ngcontent-%COMP%] {\n  background: var(--%NS%info-soft);\n  color: var(--%NS%sky-600);\n}\n.pill.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.pill.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.pill.neutral[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.skel[_ngcontent-%COMP%] {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  margin: 10px 0;\n}\n.err[_ngcontent-%COMP%] {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  font-size: 15px;\n}\n.ch[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 10px;\n}\n.ct[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.ct[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 17px;\n}\n.what[_ngcontent-%COMP%] {\n  margin: 10px 0 12px;\n  font-size: 15px;\n  line-height: 1.5;\n  color: var(--%NS%stone-700);\n}\n.cf[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n.cf[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  height: 44px;\n  padding: 0 18px;\n  font-size: 15px;\n  border-radius: 10px;\n}\n.subtle[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--%NS%stone-500);\n}\n/*# sourceMappingURL=farmer-pages.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerConsents, [{
    type: Component,
    args: [{ selector: "vcf-consents", imports: [...KIT, DayPipe, FarmerTitle], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vcf-title en="My consents" kn="\u0CA8\u0CA8\u0CCD\u0CA8 \u0C92\u0CAA\u0CCD\u0CAA\u0CBF\u0C97\u0CC6\u0C97\u0CB3\u0CC1" sub="You decide what the programme may do. You can change your mind at any time." />
    @let c = d.consents();
    @if (c.loading && !c.data) { <section class="panel"><div class="skel"></div><div class="skel"></div></section> }
    @else if (c.error) { <div class="err">{{ c.error }}</div> }
    @else if (c.data; as cs) {
      @for (x of cs.current; track x.purpose) {
        <article class="panel cons">
          <div class="ch">
            <div class="ct"><strong>{{ p(x).en }}</strong><span class="kn" lang="kn">{{ p(x).kn }}</span></div>
            <span class="pill" [class]="x.state === 'granted' ? 'ok' : x.state === 'withdrawn' ? 'neutral' : 'warn'">
              {{ x.state === 'granted' ? 'Given' : x.state === 'withdrawn' ? 'Withdrawn' : 'Not given' }}</span>
          </div>
          <p class="what">{{ p(x).what }}</p>
          <div class="cf">
            <span class="subtle">@if (x.effective_on) { Since {{ x.effective_on | day }} } @else { Not asked yet }</span>
            @if (x.state === 'granted') {
              <button class="btn btn-secondary" (click)="ask(x, false)">Withdraw</button>
            } @else {
              <button class="btn btn-primary" (click)="ask(x, true)">Give consent</button>
            }
          </div>
        </article>
      }
    }

    <vc-modal [open]="!!target()" (closed)="target.set(null)" [title]="target()?.grant ? 'Give consent?' : 'Withdraw consent?'"
      [subtitle]="target() ? p(target()!.c).en + ' \xB7 ' + p(target()!.c).kn : ''" width="460px">
      @if (target(); as t) {
        <div class="stack">
          @if (t.grant) {
            <p class="big">You agree that: {{ p(t.c).what }}</p>
          } @else {
            <p class="big">From today, the programme will stop this. {{ withdrawEffect(t.c.purpose) }}</p>
            <p class="muted">Anything already done before today stays on record. You can give consent again later.</p>
          }
          @if (err()) { <div class="err">{{ err() }}</div> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost btn-lg" (click)="target.set(null)">Go back</button>
        <button class="btn btn-lg" [class.btn-primary]="target()?.grant" [class.btn-danger]="!target()?.grant" [disabled]="busy()" (click)="confirm()">
          {{ target()?.grant ? 'Yes, I agree' : 'Yes, withdraw' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;be2a7d379fa15e31;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmer-portal\\farmer-pages.ts */\n.panel {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  box-shadow: var(--shadow-sm);\n  padding: 18px;\n}\n.panel + .panel {\n  margin-top: 14px;\n}\n.ph {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph h2 {\n  font-size: 18px;\n  flex: 1;\n}\n.kn {\n  color: var(--clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted {\n  color: var(--stone-600);\n}\n.btn-lg {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.pill.info {\n  background: var(--info-soft);\n  color: var(--sky-600);\n}\n.pill.warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.pill.danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.pill.neutral {\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.skel {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  margin: 10px 0;\n}\n.err {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--danger-soft);\n  color: var(--red-600);\n  font-size: 15px;\n}\n.ch {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 10px;\n}\n.ct {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.ct strong {\n  font-size: 17px;\n}\n.what {\n  margin: 10px 0 12px;\n  font-size: 15px;\n  line-height: 1.5;\n  color: var(--stone-700);\n}\n.cf {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n.cf .btn {\n  height: 44px;\n  padding: 0 18px;\n  font-size: 15px;\n  border-radius: 10px;\n}\n.subtle {\n  font-size: 14px;\n  color: var(--stone-500);\n}\n/*# sourceMappingURL=farmer-pages.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerConsents, { className: "FarmerConsents", filePath: "src/app/features/farmer-portal/farmer-pages.ts", lineNumber: 375 });
})();
var FarmerHelp = class _FarmerHelp {
  d = inject(FarmerData);
  api = inject(ApiService);
  toast = inject(ToastService);
  cats = [
    { k: "payment", en: "Payment", kn: "\u0CAA\u0CBE\u0CB5\u0CA4\u0CBF" },
    { k: "sampling", en: "Soil sampling", kn: "\u0CAE\u0CA3\u0CCD\u0CA3\u0CBF\u0CA8 \u0CAE\u0CBE\u0CA6\u0CB0\u0CBF" },
    { k: "enrolment", en: "Enrolment", kn: "\u0CA8\u0CCB\u0C82\u0CA6\u0CA3\u0CBF" },
    { k: "data", en: "My information", kn: "\u0CA8\u0CA8\u0CCD\u0CA8 \u0CAE\u0CBE\u0CB9\u0CBF\u0CA4\u0CBF" },
    { k: "other", en: "Something else", kn: "\u0C87\u0CA4\u0CB0\u0CC6" }
  ];
  formOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "formOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cat = "payment";
  subject = "";
  desc = "";
  urgent = false;
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  err = signal(
    null,
    ...ngDevMode ? [{ debugName: "err" }] : (
      /* istanbul ignore next */
      []
    )
  );
  label(g) {
    return { open: "Received", in_progress: "Being looked at", resolved: "Answered", appealed: "Reopened", closed: "Closed" }[g.status] ?? g.status;
  }
  tone(g) {
    return g.status === "resolved" || g.status === "closed" ? "ok" : g.overdue ? "warn" : "info";
  }
  send() {
    this.busy.set(true);
    this.err.set(null);
    this.api.post("/grievances", {
      farmer_id: this.d.farmerId(),
      category: this.cat,
      subject: this.subject.trim(),
      description: this.desc.trim(),
      channel: "app",
      priority: this.urgent ? "high" : "normal"
    }).subscribe({
      next: (g) => {
        this.busy.set(false);
        this.formOpen.set(false);
        this.subject = "";
        this.desc = "";
        this.urgent = false;
        this.toast.success(`Complaint ${g.code} sent`, `We will reply by ${new Date(g.due_on).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}.`);
        this.d.reloadGrievances();
      },
      error: (e) => {
        this.busy.set(false);
        this.err.set(e.message);
      }
    });
  }
  static \u0275fac = function FarmerHelp_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerHelp)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerHelp, selectors: [["vcf-help"]], decls: 11, vars: 3, consts: [["en", "Help & complaints", "kn", "\u0CB8\u0CB9\u0CBE\u0CAF \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CA6\u0CC2\u0CB0\u0CC1\u0C97\u0CB3\u0CC1", "sub", "Tell us about any problem. You will get a reference number and a date by which we reply."], [1, "btn", "btn-primary", "btn-lg", "wide"], [1, "panel"], [1, "lh"], ["lang", "kn", 1, "kn"], [1, "err"], [1, "btn", "btn-primary", "btn-lg", "wide", 3, "click"], ["name", "plus", 3, "size"], [1, "ph"], [1, "stack"], [1, "field"], [1, "cats"], ["type", "button", 3, "on"], ["maxlength", "200", "placeholder", "e.g. Payment not received", 1, "input", "lg", 3, "ngModelChange", "ngModel"], ["rows", "5", "maxlength", "5000", "placeholder", "You can write in Kannada or English.", 1, "input", "lg", 3, "ngModelChange", "ngModel"], [1, "checkbox"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "row"], [1, "btn", "btn-ghost", "btn-lg", 3, "click"], [1, "spacer"], [1, "btn", "btn-primary", "btn-lg", 3, "click", "disabled"], ["type", "button", 3, "click"], ["lang", "kn"], [1, "skel"], [1, "panel", "gr"], [1, "gh"], [1, "mono", "subtle"], [1, "pill"], [1, "gs"], [1, "gd"], [1, "res"], [1, "subtle"], [1, "big", "muted"]], template: function FarmerHelp_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vcf-title", 0);
      \u0275\u0275conditionalCreate(1, FarmerHelp_Conditional_1_Template, 3, 1, "button", 1)(2, FarmerHelp_Conditional_2_Template, 31, 5, "section", 2);
      \u0275\u0275elementStart(3, "h2", 3);
      \u0275\u0275text(4, "My complaints ");
      \u0275\u0275elementStart(5, "span", 4);
      \u0275\u0275text(6, "\u0CA8\u0CA8\u0CCD\u0CA8 \u0CA6\u0CC2\u0CB0\u0CC1\u0C97\u0CB3\u0CC1");
      \u0275\u0275elementEnd()();
      \u0275\u0275declareLet(7);
      \u0275\u0275conditionalCreate(8, FarmerHelp_Conditional_8_Template, 2, 0, "section", 2)(9, FarmerHelp_Conditional_9_Template, 2, 1, "div", 5)(10, FarmerHelp_Conditional_10_Template, 3, 2);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.formOpen() ? 1 : 2);
      \u0275\u0275advance(6);
      const g_r8 = \u0275\u0275storeLet(ctx.d.grievances());
      \u0275\u0275advance();
      \u0275\u0275conditional(g_r8.loading && !g_r8.data ? 8 : g_r8.error ? 9 : 10);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, Icon, FarmerTitle, DayPipe], styles: ["\n.panel[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 16px;\n  box-shadow: var(--%NS%shadow-sm);\n  padding: 18px;\n}\n.panel[_ngcontent-%COMP%]    + .panel[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 18px;\n  flex: 1;\n}\n.kn[_ngcontent-%COMP%] {\n  color: var(--%NS%clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-600);\n}\n.btn-lg[_ngcontent-%COMP%] {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.pill.info[_ngcontent-%COMP%] {\n  background: var(--%NS%info-soft);\n  color: var(--%NS%sky-600);\n}\n.pill.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.pill.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.pill.neutral[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.skel[_ngcontent-%COMP%] {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  margin: 10px 0;\n}\n.err[_ngcontent-%COMP%] {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  font-size: 15px;\n}\n.wide[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-bottom: 8px;\n}\n.cats[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n.cats[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 2px;\n  padding: 12px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 12px;\n  background: var(--%NS%surface);\n  font: inherit;\n  font-size: 15px;\n  font-weight: 500;\n  cursor: pointer;\n  text-align: left;\n  color: var(--%NS%stone-800);\n}\n.cats[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-500);\n}\n.cats[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%clay-600);\n  font-weight: 400;\n}\n.input.lg[_ngcontent-%COMP%] {\n  height: 48px;\n  font-size: 16px;\n}\ntextarea.input.lg[_ngcontent-%COMP%] {\n  height: auto;\n}\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 15px;\n}\n.checkbox[_ngcontent-%COMP%] {\n  font-size: 15px;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.lh[_ngcontent-%COMP%] {\n  font-size: 19px;\n  margin: 24px 0 12px;\n}\n.lh[_ngcontent-%COMP%]   .kn[_ngcontent-%COMP%] {\n  margin-left: 6px;\n}\n.gr[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.gh[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.gs[_ngcontent-%COMP%] {\n  font-size: 17px;\n}\n.gd[_ngcontent-%COMP%] {\n  font-size: 15px;\n  color: var(--%NS%stone-700);\n  line-height: 1.5;\n}\n.res[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-radius: 12px;\n  background: var(--%NS%ok-soft);\n  font-size: 15px;\n}\n.res[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 4px;\n}\n.subtle[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%stone-500);\n}\n/*# sourceMappingURL=farmer-pages.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerHelp, [{
    type: Component,
    args: [{ selector: "vcf-help", imports: [FormsModule, ...KIT, DayPipe, FarmerTitle], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vcf-title en="Help & complaints" kn="\u0CB8\u0CB9\u0CBE\u0CAF \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CA6\u0CC2\u0CB0\u0CC1\u0C97\u0CB3\u0CC1" sub="Tell us about any problem. You will get a reference number and a date by which we reply." />

    @if (!formOpen()) {
      <button class="btn btn-primary btn-lg wide" (click)="formOpen.set(true)"><vc-icon name="plus" [size]="18" />Raise a new complaint</button>
    } @else {
      <section class="panel">
        <div class="ph"><h2>New complaint</h2><span class="kn" lang="kn">\u0CB9\u0CCA\u0CB8 \u0CA6\u0CC2\u0CB0\u0CC1</span></div>
        <div class="stack">
          <div class="field"><label>What is it about?</label>
            <div class="cats">
              @for (c of cats; track c.k) { <button type="button" [class.on]="cat === c.k" (click)="cat = c.k">{{ c.en }}<small lang="kn">{{ c.kn }}</small></button> }
            </div></div>
          <div class="field"><label>Short title</label><input class="input lg" [(ngModel)]="subject" maxlength="200" placeholder="e.g. Payment not received" /></div>
          <div class="field"><label>Tell us what happened</label>
            <textarea class="input lg" [(ngModel)]="desc" rows="5" maxlength="5000" placeholder="You can write in Kannada or English."></textarea></div>
          <label class="checkbox"><input type="checkbox" [(ngModel)]="urgent" />This is urgent (reply within 3 days)</label>
          @if (err()) { <div class="err">{{ err() }}</div> }
          <div class="row">
            <button class="btn btn-ghost btn-lg" (click)="formOpen.set(false)">Cancel</button>
            <span class="spacer"></span>
            <button class="btn btn-primary btn-lg" [disabled]="busy() || subject.trim().length < 3 || desc.trim().length < 5" (click)="send()">Send</button>
          </div>
        </div>
      </section>
    }

    <h2 class="lh">My complaints <span class="kn" lang="kn">\u0CA8\u0CA8\u0CCD\u0CA8 \u0CA6\u0CC2\u0CB0\u0CC1\u0C97\u0CB3\u0CC1</span></h2>
    @let g = d.grievances();
    @if (g.loading && !g.data) { <section class="panel"><div class="skel"></div></section> }
    @else if (g.error) { <div class="err">{{ g.error }}</div> }
    @else {
      @for (x of g.data ?? []; track x.id) {
        <article class="panel gr">
          <div class="gh"><span class="mono subtle">{{ x.code }}</span><span class="pill" [class]="tone(x)">{{ label(x) }}</span></div>
          <strong class="gs">{{ x.subject }}</strong>
          <p class="gd">{{ x.description }}</p>
          @if (x.resolution) { <div class="res"><strong>Our answer</strong><p>{{ x.resolution }}</p></div> }
          <span class="subtle">Sent {{ x.created_at | day }}@if (!['resolved', 'closed'].includes(x.status)) { \xB7 reply by {{ x.due_on | day }} }</span>
        </article>
      } @empty {
        <section class="panel"><p class="big muted">You haven't raised any complaints.</p></section>
      }
    }
  `, styles: ["/* angular:styles/component:scss;e1520c3d42f01b57;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmer-portal\\farmer-pages.ts */\n.panel {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  box-shadow: var(--shadow-sm);\n  padding: 18px;\n}\n.panel + .panel {\n  margin-top: 14px;\n}\n.ph {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.ph h2 {\n  font-size: 18px;\n  flex: 1;\n}\n.kn {\n  color: var(--clay-600);\n  font-size: 14px;\n  font-weight: 500;\n}\n.big {\n  font-size: 17px;\n  line-height: 1.55;\n}\n.muted {\n  color: var(--stone-600);\n}\n.btn-lg {\n  height: 48px;\n  font-size: 16px;\n  border-radius: 12px;\n}\n.pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.pill.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.pill.info {\n  background: var(--info-soft);\n  color: var(--sky-600);\n}\n.pill.warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.pill.danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.pill.neutral {\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.skel {\n  height: 18px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  margin: 10px 0;\n}\n.err {\n  padding: 14px;\n  border-radius: 12px;\n  background: var(--danger-soft);\n  color: var(--red-600);\n  font-size: 15px;\n}\n.wide {\n  width: 100%;\n  margin-bottom: 8px;\n}\n.cats {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n}\n.cats button {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 2px;\n  padding: 12px;\n  border: 1px solid var(--border-strong);\n  border-radius: 12px;\n  background: var(--surface);\n  font: inherit;\n  font-size: 15px;\n  font-weight: 500;\n  cursor: pointer;\n  text-align: left;\n  color: var(--stone-800);\n}\n.cats button.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: inset 0 0 0 1px var(--forest-500);\n}\n.cats small {\n  font-size: 12.5px;\n  color: var(--clay-600);\n  font-weight: 400;\n}\n.input.lg {\n  height: 48px;\n  font-size: 16px;\n}\ntextarea.input.lg {\n  height: auto;\n}\n.field label {\n  font-size: 15px;\n}\n.checkbox {\n  font-size: 15px;\n}\n.spacer {\n  flex: 1;\n}\n.lh {\n  font-size: 19px;\n  margin: 24px 0 12px;\n}\n.lh .kn {\n  margin-left: 6px;\n}\n.gr {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.gh {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.gs {\n  font-size: 17px;\n}\n.gd {\n  font-size: 15px;\n  color: var(--stone-700);\n  line-height: 1.5;\n}\n.res {\n  padding: 12px;\n  border-radius: 12px;\n  background: var(--ok-soft);\n  font-size: 15px;\n}\n.res p {\n  margin-top: 4px;\n}\n.subtle {\n  font-size: 13.5px;\n  color: var(--stone-500);\n}\n/*# sourceMappingURL=farmer-pages.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerHelp, { className: "FarmerHelp", filePath: "src/app/features/farmer-portal/farmer-pages.ts", lineNumber: 478 });
})();

// src/app/features/farmer-portal/farmer-portal.routes.ts
var T = " \xB7 Varsapradaya Carbon";
var farmer_portal_routes_default = [
  {
    path: "",
    component: FarmerShell,
    children: [
      { path: "", component: FarmerHome, title: "Home" + T },
      { path: "fields", component: FarmerFields, title: "My fields" + T },
      { path: "payments", component: FarmerPayments, title: "My payments" + T },
      { path: "payment-details", component: FarmerPaymentDetails, title: "Payment details" + T },
      { path: "consents", component: FarmerConsents, title: "My consents" + T },
      { path: "help", component: FarmerHelp, title: "Help & complaints" + T }
    ]
  }
];
export {
  farmer_portal_routes_default as default
};
//# debugId=3f6ae135-3088-5c95-ad42-eae4497728dd
//# sourceMappingURL=chunk-TJAKRF4Z.js.map
