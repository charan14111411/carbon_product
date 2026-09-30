import {
  SALE_STEPS,
  SaleReportCard
} from "./chunk-7DVV6XRX.js";
import {
  Steps,
  TYPE_COLOR,
  TYPE_LABEL,
  money
} from "./chunk-W6OT2EF5.js";
import {
  Brand
} from "./chunk-PLD4FPAY.js";
import {
  Chart
} from "./chunk-RHCCRMNI.js";
import "./chunk-KR7EHQN4.js";
import "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  AuthService,
  RouterLink,
  RouterOutlet
} from "./chunk-G6POHVBO.js";
import {
  Badge,
  Empty,
  ErrorBox,
  KIT,
  Loading,
  PageHeader,
  Stat
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Injectable,
  Input,
  computed,
  inject,
  input,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-O2E4BMDK.js";

// src/app/features/buyer-portal/buyer-portal.ts
function BuyerShell_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \xB7 ");
    \u0275\u0275elementStart(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.name);
  }
}
var _c0 = (a0) => ["sales", a0];
var _forTrack0 = ($index, $item) => $item.sale_code;
var _forTrack1 = ($index, $item) => $item.vintage;
function BuyerPortfolio_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "vc-loading", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 8);
  }
}
function BuyerPortfolio_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-error", 1)(1, "button", 3);
    \u0275\u0275listener("click", function BuyerPortfolio_Conditional_1_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.store.load(true));
    });
    \u0275\u0275text(2, "Try again");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.store.error());
  }
}
function BuyerPortfolio_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "vc-empty", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("text", p_r3.message ?? "");
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-chart", 19);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("option", ctx_r1.chart());
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 20);
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_25_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 29);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 29);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 29)(10, "strong");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const v_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r5.vintage);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 4, v_r5.removal, 2));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 7, v_r5.reduction, 2));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(12, 10, v_r5.removal + v_r5.reduction, 2));
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "table", 28)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Vintage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 29);
    \u0275\u0275text(7, "Removals");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 29);
    \u0275\u0275text(9, "Reductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 29);
    \u0275\u0275text(11, "Total");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275repeaterCreate(13, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_25_For_14_Template, 13, 13, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r1.byVintage());
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_For_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 30);
    \u0275\u0275element(2, "vc-icon", 31);
    \u0275\u0275elementStart(3, "strong", 29);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "span", 32);
    \u0275\u0275elementStart(7, "span", 17);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 33);
    \u0275\u0275text(11, "On behalf of ");
    \u0275\u0275elementStart(12, "strong");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 34);
    \u0275\u0275text(15);
    \u0275\u0275elementStart(16, "span", 35);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 36);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "a", 37);
    \u0275\u0275text(21, "View report ");
    \u0275\u0275element(22, "vc-icon", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const h_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(5, 10, h_r6.retirement.quantity, 2), " tCO\u2082e");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 13, h_r6.retirement.retired_at));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(h_r6.retirement.beneficiary);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", h_r6.retirement.registry, " \xB7 certificate ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(h_r6.retirement.certificate_ref);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", h_r6.retirement.serials[0], " \u2192 ", h_r6.retirement.serials[1]);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(15, _c0, ctx_r1.saleId(h_r6)));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_ForEmpty_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 24);
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 25);
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_For_21_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(h_r7.contract_ref);
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_For_21_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 49);
    \u0275\u0275text(3);
    \u0275\u0275element(4, "br");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(h_r7.registry);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(h_r7.serial_start);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(h_r7.serial_end);
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_For_21_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 44);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 41);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_For_21_Conditional_4_Template, 2, 1, "div", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementStart(7, "div", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td")(12, "span", 43);
    \u0275\u0275element(13, "i");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td", 29)(16, "strong");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19, " t");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 33);
    \u0275\u0275conditionalCreate(21, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_For_21_Conditional_21_Template, 6, 3)(22, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_For_21_Conditional_22_Template, 2, 0, "span", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td");
    \u0275\u0275element(24, "vcx-steps", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "td", 46)(26, "a", 47);
    \u0275\u0275text(27, "Report");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const h_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("cancel", h_r7.status === "cancelled");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(h_r7.sale_code);
    \u0275\u0275advance();
    \u0275\u0275conditional(h_r7.contract_ref ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(h_r7.project?.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(h_r7.project?.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(h_r7.vintage);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background", ctx_r1.color[h_r7.credit_type]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.typeLabel[h_r7.credit_type]);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 16, h_r7.quantity, 2));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(h_r7.serial_start ? 21 : 22);
    \u0275\u0275advance(3);
    \u0275\u0275property("steps", ctx_r1.steps)("current", h_r7.status)("compact", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(19, _c0, ctx_r1.saleId(h_r7)));
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "table", 28)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Purchase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Project");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Vintage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 29);
    \u0275\u0275text(13, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Batch serial range");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "th", 39);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_For_21_Template, 28, 21, "tr", 40, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(20);
    \u0275\u0275repeater(p_r3.sales.slice().reverse());
  }
}
function BuyerPortfolio_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-page-header", 5)(1, "button", 6);
    \u0275\u0275listener("click", function BuyerPortfolio_Conditional_2_Conditional_1_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.store.load(true));
    });
    \u0275\u0275element(2, "vc-icon", 7);
    \u0275\u0275text(3, "Refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 8);
    \u0275\u0275listener("click", function BuyerPortfolio_Conditional_2_Conditional_1_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.print());
    });
    \u0275\u0275element(5, "vc-icon", 9);
    \u0275\u0275text(6, "Download summary");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 10);
    \u0275\u0275element(8, "vc-stat", 11);
    \u0275\u0275pipe(9, "num");
    \u0275\u0275element(10, "vc-stat", 12);
    \u0275\u0275pipe(11, "num");
    \u0275\u0275element(12, "vc-stat", 13);
    \u0275\u0275pipe(13, "num");
    \u0275\u0275element(14, "vc-stat", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 15)(16, "section", 0)(17, "div", 16)(18, "h3");
    \u0275\u0275text(19, "Holdings by vintage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 17);
    \u0275\u0275text(21, "tCO\u2082e, excluding cancelled");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 18);
    \u0275\u0275conditionalCreate(23, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_23_Template, 1, 1, "vc-chart", 19)(24, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_24_Template, 1, 0, "vc-empty", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_25_Template, 15, 0, "div", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "section", 0)(27, "div", 16)(28, "h3");
    \u0275\u0275text(29, "Retirement records");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span", 17);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 22);
    \u0275\u0275repeaterCreate(33, BuyerPortfolio_Conditional_2_Conditional_1_For_34_Template, 23, 17, "div", 23, _forTrack0, false, BuyerPortfolio_Conditional_2_Conditional_1_ForEmpty_35_Template, 1, 0, "vc-empty", 24);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "section", 0)(37, "div", 16)(38, "h3");
    \u0275\u0275text(39, "Purchases & deliveries");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(40, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_40_Template, 1, 0, "vc-empty", 25)(41, BuyerPortfolio_Conditional_2_Conditional_1_Conditional_41_Template, 22, 0, "div", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "p", 27);
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r3 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("title", "Carbon portfolio")("eyebrow", p_r3.buyer.name);
    \u0275\u0275advance(8);
    \u0275\u0275property("value", \u0275\u0275pipeBind2(9, 14, ctx_r1.purchased(), 1))("accent", true)("hint", ctx_r1.live().length + " purchases");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", \u0275\u0275pipeBind2(11, 17, ctx_r1.delivered(), 1));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", \u0275\u0275pipeBind2(13, 20, p_r3.totals["retired"] ?? 0, 1));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.value());
    \u0275\u0275advance(9);
    \u0275\u0275conditional(ctx_r1.live().length ? 23 : 24);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.live().length ? 25 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.retired().length);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.retired());
    \u0275\u0275advance(7);
    \u0275\u0275conditional(!p_r3.sales.length ? 40 : 41);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Figures are calculated by the Varsapradaya Carbon engine from lab-measured soil samples and verified before issuance. Generated ", \u0275\u0275pipeBind2(44, 23, ctx_r1.now, true), ".");
  }
}
function BuyerPortfolio_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, BuyerPortfolio_Conditional_2_Conditional_0_Template, 2, 1, "div", 0)(1, BuyerPortfolio_Conditional_2_Conditional_1_Template, 45, 26);
  }
  if (rf & 2) {
    \u0275\u0275conditional(!ctx.buyer ? 0 : 1);
  }
}
function BuyerSale_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vcx-sale-report", 6);
  }
  if (rf & 2) {
    \u0275\u0275property("report", ctx);
  }
}
function BuyerSale_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "vc-loading", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 8);
  }
}
function BuyerSale_Conditional_10_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1, "Retired");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275pipe(5, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const rt_r1 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3("", \u0275\u0275pipeBind2(4, 3, rt_r1.quantity, 2), " t for ", rt_r1.beneficiary, " \xB7 ", \u0275\u0275pipeBind1(5, 6, rt_r1.retired_at));
  }
}
function BuyerSale_Conditional_10_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("The detailed supply-chain report isn't available right now: ", ctx_r1.error());
  }
}
function BuyerSale_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 7)(1, "div", 10)(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "vc-badge", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 12)(7, "dl", 13)(8, "dt");
    \u0275\u0275text(9, "Purchase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "dd", 14);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dt");
    \u0275\u0275text(13, "Project");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "dd");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dt");
    \u0275\u0275text(17, "Vintage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "dd");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "dt");
    \u0275\u0275text(21, "Contract");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dd", 14);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "dt");
    \u0275\u0275text(25, "Registry");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "dd");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "dt");
    \u0275\u0275text(29, "Serials");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "dd", 15);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(32, BuyerSale_Conditional_10_Conditional_32_Template, 6, 8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(33, BuyerSale_Conditional_10_Conditional_33_Template, 2, 1, "p", 16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_10_0;
    const h_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(4, 14, h_r3.quantity, 3), " tCO\u2082e \xB7 ", ctx_r1.typeLabel[h_r3.credit_type].toLowerCase());
    \u0275\u0275advance(2);
    \u0275\u0275property("status", h_r3.status);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(h_r3.sale_code);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", h_r3.project?.code, " \xB7 ", h_r3.project?.name);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(h_r3.vintage);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(h_r3.contract_ref || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", h_r3.registry || "\u2014", " ", h_r3.registry_project_ref ? "\xB7 " + h_r3.registry_project_ref : "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", h_r3.serial_start || "\u2014", " \u2192 ", h_r3.serial_end || "\u2014");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = h_r3.retirement) ? 32 : -1, tmp_10_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.error() ? 33 : -1);
  }
}
function BuyerSale_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 8);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error() ?? "Not found.");
  }
}
function saleIdOf(h) {
  return h.report_url.split("/").slice(-2, -1)[0] ?? "";
}
var PortfolioStore = class _PortfolioStore {
  api = inject(ApiService);
  data = signal(
    null,
    ...ngDevMode ? [{ debugName: "data" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loading = signal(
    false,
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
  load(force = false) {
    if (this.data() && !force)
      return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get("/buyer/portfolio").subscribe({
      next: (p) => {
        this.data.set(p);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  static \u0275fac = function PortfolioStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PortfolioStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PortfolioStore, factory: _PortfolioStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortfolioStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();
var BuyerShell = class _BuyerShell {
  auth = inject(AuthService);
  store = inject(PortfolioStore);
  constructor() {
    this.store.load();
  }
  static \u0275fac = function BuyerShell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BuyerShell)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BuyerShell, selectors: [["vcb-shell"]], decls: 15, vars: 3, consts: [[1, "top", "no-print"], ["routerLink", "/buyer", 1, "bl"], [1, "sep"], [1, "ctx"], [1, "spacer"], [1, "who"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "logout", 3, "size"]], template: function BuyerShell_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "a", 1);
      \u0275\u0275element(2, "vc-brand");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "span", 2);
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5, "Buyer portal");
      \u0275\u0275conditionalCreate(6, BuyerShell_Conditional_6_Template, 3, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275element(7, "span", 4);
      \u0275\u0275elementStart(8, "span", 5);
      \u0275\u0275text(9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "button", 6);
      \u0275\u0275listener("click", function BuyerShell_Template_button_click_10_listener() {
        return ctx.auth.logout();
      });
      \u0275\u0275element(11, "vc-icon", 7);
      \u0275\u0275text(12, "Sign out");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "main");
      \u0275\u0275element(14, "router-outlet");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(6);
      \u0275\u0275conditional((tmp_0_0 = ctx.store.data()?.buyer) ? 6 : -1, tmp_0_0);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.auth.profile()?.full_name);
      \u0275\u0275advance(2);
      \u0275\u0275property("size", 14);
    }
  }, dependencies: [RouterOutlet, RouterLink, Brand, Icon], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background: var(--%NS%sand-100);\n}\n.top[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  height: 64px;\n  padding: 0 32px;\n  background: var(--%NS%surface);\n  border-bottom: 1px solid var(--%NS%border);\n}\n.bl[_ngcontent-%COMP%] {\n  text-decoration: none !important;\n}\n.sep[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 26px;\n  background: var(--%NS%border);\n}\n.ctx[_ngcontent-%COMP%] {\n  color: var(--%NS%text-2);\n  font-size: 13.5px;\n}\n.ctx[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n  font-weight: 600;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.who[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%text-2);\n}\nmain[_ngcontent-%COMP%] {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 28px 32px 56px;\n}\n@media (max-width: 720px) {\n  .top[_ngcontent-%COMP%] {\n    padding: 0 16px;\n  }\n  .who[_ngcontent-%COMP%], \n   .sep[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .ctx[_ngcontent-%COMP%] {\n    display: none;\n  }\n  main[_ngcontent-%COMP%] {\n    padding: 20px 16px 40px;\n  }\n}\n/*# sourceMappingURL=buyer-portal.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuyerShell, [{
    type: Component,
    args: [{ selector: "vcb-shell", imports: [RouterOutlet, RouterLink, Brand, ...KIT], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <header class="top no-print">
      <a routerLink="/buyer" class="bl"><vc-brand /></a>
      <span class="sep"></span>
      <span class="ctx">Buyer portal@if (store.data()?.buyer; as b) { \xB7 <strong>{{ b.name }}</strong> }</span>
      <span class="spacer"></span>
      <span class="who">{{ auth.profile()?.full_name }}</span>
      <button class="btn btn-secondary btn-sm" (click)="auth.logout()"><vc-icon name="logout" [size]="14" />Sign out</button>
    </header>
    <main><router-outlet /></main>
  `, styles: ["/* angular:styles/component:scss;75462a08c5dd260a;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\buyer-portal\\buyer-portal.ts */\n:host {\n  display: block;\n  min-height: 100vh;\n  background: var(--sand-100);\n}\n.top {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  height: 64px;\n  padding: 0 32px;\n  background: var(--surface);\n  border-bottom: 1px solid var(--border);\n}\n.bl {\n  text-decoration: none !important;\n}\n.sep {\n  width: 1px;\n  height: 26px;\n  background: var(--border);\n}\n.ctx {\n  color: var(--text-2);\n  font-size: 13.5px;\n}\n.ctx strong {\n  color: var(--stone-900);\n  font-weight: 600;\n}\n.spacer {\n  flex: 1;\n}\n.who {\n  font-size: 13px;\n  color: var(--text-2);\n}\nmain {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 28px 32px 56px;\n}\n@media (max-width: 720px) {\n  .top {\n    padding: 0 16px;\n  }\n  .who,\n  .sep {\n    display: none;\n  }\n  .ctx {\n    display: none;\n  }\n  main {\n    padding: 20px 16px 40px;\n  }\n}\n/*# sourceMappingURL=buyer-portal.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BuyerShell, { className: "BuyerShell", filePath: "src/app/features/buyer-portal/buyer-portal.ts", lineNumber: 68 });
})();
var BuyerPortfolio = class _BuyerPortfolio {
  store = inject(PortfolioStore);
  steps = SALE_STEPS;
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  now = (/* @__PURE__ */ new Date()).toISOString();
  live = computed(
    () => (this.store.data()?.sales ?? []).filter((s) => s.status !== "cancelled"),
    ...ngDevMode ? [{ debugName: "live" }] : (
      /* istanbul ignore next */
      []
    )
  );
  retired = computed(
    () => this.live().filter((s) => s.retirement).reverse(),
    ...ngDevMode ? [{ debugName: "retired" }] : (
      /* istanbul ignore next */
      []
    )
  );
  purchased = computed(
    () => this.live().reduce((a, s) => a + s.quantity, 0),
    ...ngDevMode ? [{ debugName: "purchased" }] : (
      /* istanbul ignore next */
      []
    )
  );
  delivered = computed(
    () => this.live().filter((s) => s.status === "delivered" || s.status === "retired").reduce((a, s) => a + s.quantity, 0),
    ...ngDevMode ? [{ debugName: "delivered" }] : (
      /* istanbul ignore next */
      []
    )
  );
  value = computed(
    () => {
      const l = this.live();
      const cur = l[0]?.currency ?? "INR";
      return money(l.filter((s) => s.currency === cur).reduce((a, s) => a + s.quantity * Number(s.unit_price), 0), cur);
    },
    ...ngDevMode ? [{ debugName: "value" }] : (
      /* istanbul ignore next */
      []
    )
  );
  byVintage = computed(
    () => {
      const m = /* @__PURE__ */ new Map();
      for (const s of this.live()) {
        const v = m.get(s.vintage) ?? { vintage: s.vintage, removal: 0, reduction: 0 };
        v[s.credit_type] += s.quantity;
        m.set(s.vintage, v);
      }
      return [...m.values()].sort((a, b) => a.vintage - b.vintage);
    },
    ...ngDevMode ? [{ debugName: "byVintage" }] : (
      /* istanbul ignore next */
      []
    )
  );
  chart = computed(
    () => {
      const rows = this.byVintage();
      const series = ["removal", "reduction"].map((t, i) => ({
        name: TYPE_LABEL[t],
        type: "bar",
        stack: "v",
        barMaxWidth: 48,
        data: rows.map((r) => Math.round(r[t] * 100) / 100),
        itemStyle: { color: TYPE_COLOR[t], borderRadius: i === 1 ? [4, 4, 0, 0] : 0, borderColor: "#fff", borderWidth: 1 },
        emphasis: { focus: "series" }
      }));
      return {
        grid: { top: 36 },
        legend: { data: series.map((s) => s.name) },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v) => `${v.toLocaleString("en-IN")} tCO\u2082e` },
        xAxis: { type: "category", data: rows.map((r) => String(r.vintage)) },
        yAxis: { type: "value", name: "tCO\u2082e", nameTextStyle: { color: "#737c76", fontSize: 11, align: "left" } },
        series
      };
    },
    ...ngDevMode ? [{ debugName: "chart" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saleId = saleIdOf;
  print() {
    window.print();
  }
  static \u0275fac = function BuyerPortfolio_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BuyerPortfolio)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BuyerPortfolio, selectors: [["vcb-portfolio"]], decls: 3, vars: 1, consts: [[1, "card"], ["title", "Couldn't load your portfolio", 3, "message"], [3, "rows"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["icon", "link", "title", "Account not linked yet", 3, "text"], ["subtitle", "Soil-carbon credits you have bought from smallholder farms, with registry serials and retirement records. Aggregated project data only \u2014 no farmer personal data.", 3, "title", "eyebrow"], ["actions", "", 1, "btn", "btn-secondary", "no-print", 3, "click"], ["name", "refresh"], ["actions", "", 1, "btn", "btn-primary", "no-print", 3, "click"], ["name", "download"], [1, "grid", "grid-4", "stats"], ["label", "Total purchased", "unit", "tCO\u2082e", "icon", "package", 3, "value", "accent", "hint"], ["label", "Delivered to you", "unit", "tCO\u2082e", "icon", "send", "hint", "Transferred on the registry", 3, "value"], ["label", "Retired", "unit", "tCO\u2082e", "icon", "archive", "hint", "Claimed permanently for your inventory", 3, "value"], ["label", "Order value", "icon", "banknote", "hint", "Reserved, contracted and delivered; excludes cancelled", 3, "value"], [1, "grid", "g2"], [1, "card-head"], [1, "subtle", "small"], [1, "card-body"], ["height", "260px", 3, "option"], ["icon", "chart", "title", "No holdings yet"], [1, "vt", "table-wrap"], [1, "card-body", "rets"], [1, "ret"], ["icon", "archive", "title", "Nothing retired yet", "text", "When you retire credits against your emissions, the record appears here with its registry serials."], ["icon", "handshake", "title", "No purchases yet", "text", "Your purchases will appear here once the programme reserves credits for you."], [1, "table-wrap"], [1, "foot", "small", "subtle"], [1, "table"], [1, "num"], [1, "rt"], ["name", "verified", 3, "size"], [1, "spacer"], [1, "small"], [1, "small", "muted"], [1, "mono"], [1, "small", "mono", "subtle"], [1, "small", "no-print", 3, "routerLink"], ["name", "arrow-right", 3, "size"], [1, "no-print"], [3, "cancel"], [1, "mono", "strong"], [1, "subtle", "small", "mono"], [1, "tchip"], [1, "subtle"], [3, "steps", "current", "compact"], [1, "num", "no-print"], [1, "btn", "btn-ghost", "btn-sm", 3, "routerLink"], [1, "muted"], [1, "mono", "ser"]], template: function BuyerPortfolio_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, BuyerPortfolio_Conditional_0_Template, 2, 1, "div", 0)(1, BuyerPortfolio_Conditional_1_Template, 3, 1, "vc-error", 1)(2, BuyerPortfolio_Conditional_2_Template, 2, 1);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional(ctx.store.loading() && !ctx.store.data() ? 0 : ctx.store.error() ? 1 : (tmp_0_0 = ctx.store.data()) ? 2 : -1, tmp_0_0);
    }
  }, dependencies: [RouterLink, Icon, PageHeader, Stat, Empty, Loading, ErrorBox, Chart, Steps, NumPipe, DayPipe], styles: ["\n.stats[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.g2[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);\n  margin-bottom: 20px;\n}\n.vt[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--%NS%border);\n}\n.rets[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  max-height: 460px;\n  overflow: auto;\n}\n.ret[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%forest-200);\n  border-radius: 10px;\n  background: var(--%NS%forest-50);\n}\n.rt[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: var(--%NS%forest-700);\n}\n.rt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.strong[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.tchip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n.tchip[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.ser[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%stone-700);\n}\ntr.cancel[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  opacity: 0.55;\n}\n.foot[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n@media (max-width: 1100px) {\n  .g2[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n@media print {\n  .g2[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n  .rets[_ngcontent-%COMP%] {\n    max-height: none;\n  }\n}\n/*# sourceMappingURL=buyer-portal.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuyerPortfolio, [{
    type: Component,
    args: [{ selector: "vcb-portfolio", imports: [RouterLink, ...KIT, NumPipe, DayPipe, Chart, Steps], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (store.loading() && !store.data()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (store.error()) {
      <vc-error title="Couldn't load your portfolio" [message]="store.error()!"><button class="btn btn-secondary btn-sm" (click)="store.load(true)">Try again</button></vc-error>
    } @else if (store.data(); as p) {
      @if (!p.buyer) {
        <div class="card"><vc-empty icon="link" title="Account not linked yet" [text]="p.message ?? ''" /></div>
      } @else {
        <vc-page-header [title]="'Carbon portfolio'" [eyebrow]="p.buyer.name"
          subtitle="Soil-carbon credits you have bought from smallholder farms, with registry serials and retirement records. Aggregated project data only \u2014 no farmer personal data.">
          <button actions class="btn btn-secondary no-print" (click)="store.load(true)"><vc-icon name="refresh" />Refresh</button>
          <button actions class="btn btn-primary no-print" (click)="print()"><vc-icon name="download" />Download summary</button>
        </vc-page-header>

        <div class="grid grid-4 stats">
          <vc-stat label="Total purchased" [value]="purchased() | num: 1" unit="tCO\u2082e" icon="package" [accent]="true" [hint]="live().length + ' purchases'" />
          <vc-stat label="Delivered to you" [value]="delivered() | num: 1" unit="tCO\u2082e" icon="send" hint="Transferred on the registry" />
          <vc-stat label="Retired" [value]="(p.totals['retired'] ?? 0) | num: 1" unit="tCO\u2082e" icon="archive" hint="Claimed permanently for your inventory" />
          <vc-stat label="Order value" [value]="value()" icon="banknote" hint="Reserved, contracted and delivered; excludes cancelled" />
        </div>

        <div class="grid g2">
          <section class="card">
            <div class="card-head"><h3>Holdings by vintage</h3><span class="subtle small">tCO\u2082e, excluding cancelled</span></div>
            <div class="card-body">
              @if (live().length) { <vc-chart [option]="chart()" height="260px" /> }
              @else { <vc-empty icon="chart" title="No holdings yet" /> }
            </div>
            @if (live().length) {
              <div class="vt table-wrap">
                <table class="table">
                  <thead><tr><th>Vintage</th><th class="num">Removals</th><th class="num">Reductions</th><th class="num">Total</th></tr></thead>
                  <tbody>@for (v of byVintage(); track v.vintage) {
                    <tr><td>{{ v.vintage }}</td><td class="num">{{ v.removal | num: 2 }}</td><td class="num">{{ v.reduction | num: 2 }}</td><td class="num"><strong>{{ v.removal + v.reduction | num: 2 }}</strong></td></tr>
                  }</tbody>
                </table>
              </div>
            }
          </section>

          <section class="card">
            <div class="card-head"><h3>Retirement records</h3><span class="subtle small">{{ retired().length }}</span></div>
            <div class="card-body rets">
              @for (h of retired(); track h.sale_code) {
                <div class="ret">
                  <div class="rt"><vc-icon name="verified" [size]="18" /><strong class="num">{{ h.retirement!.quantity | num: 2 }} tCO\u2082e</strong>
                    <span class="spacer"></span><span class="subtle small">{{ h.retirement!.retired_at | day }}</span></div>
                  <div class="small">On behalf of <strong>{{ h.retirement!.beneficiary }}</strong></div>
                  <div class="small muted">{{ h.retirement!.registry }} \xB7 certificate <span class="mono">{{ h.retirement!.certificate_ref }}</span></div>
                  <div class="small mono subtle">{{ h.retirement!.serials[0] }} \u2192 {{ h.retirement!.serials[1] }}</div>
                  <a class="small no-print" [routerLink]="['sales', saleId(h)]">View report <vc-icon name="arrow-right" [size]="12" /></a>
                </div>
              } @empty {
                <vc-empty icon="archive" title="Nothing retired yet" text="When you retire credits against your emissions, the record appears here with its registry serials." />
              }
            </div>
          </section>
        </div>

        <section class="card">
          <div class="card-head"><h3>Purchases & deliveries</h3></div>
          @if (!p.sales.length) {
            <vc-empty icon="handshake" title="No purchases yet" text="Your purchases will appear here once the programme reserves credits for you." />
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Purchase</th><th>Project</th><th>Vintage</th><th>Type</th><th class="num">Quantity</th><th>Batch serial range</th><th>Status</th><th class="no-print"></th></tr></thead>
                <tbody>
                  @for (h of p.sales.slice().reverse(); track h.sale_code) {
                    <tr [class.cancel]="h.status === 'cancelled'">
                      <td><span class="mono strong">{{ h.sale_code }}</span>@if (h.contract_ref) { <div class="subtle small mono">{{ h.contract_ref }}</div> }</td>
                      <td>{{ h.project?.name }}<div class="subtle small">{{ h.project?.code }}</div></td>
                      <td>{{ h.vintage }}</td>
                      <td><span class="tchip"><i [style.background]="color[h.credit_type]"></i>{{ typeLabel[h.credit_type] }}</span></td>
                      <td class="num"><strong>{{ h.quantity | num: 2 }}</strong> t</td>
                      <td class="small">@if (h.serial_start) { <span class="muted">{{ h.registry }}</span><div class="mono ser">{{ h.serial_start }}<br />{{ h.serial_end }}</div> } @else { <span class="subtle">\u2014</span> }</td>
                      <td><vcx-steps [steps]="steps" [current]="h.status" [compact]="true" /></td>
                      <td class="num no-print"><a class="btn btn-ghost btn-sm" [routerLink]="['sales', saleId(h)]">Report</a></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
        <p class="foot small subtle">Figures are calculated by the Varsapradaya Carbon engine from lab-measured soil samples and verified before issuance. Generated {{ now | day: true }}.</p>
      }
    }
  `, styles: ["/* angular:styles/component:scss;44ac95badda2ac58;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\buyer-portal\\buyer-portal.ts */\n.stats {\n  margin-bottom: 20px;\n}\n.g2 {\n  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);\n  margin-bottom: 20px;\n}\n.vt {\n  border-top: 1px solid var(--border);\n}\n.rets {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  max-height: 460px;\n  overflow: auto;\n}\n.ret {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  padding: 12px 14px;\n  border: 1px solid var(--forest-200);\n  border-radius: 10px;\n  background: var(--forest-50);\n}\n.rt {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: var(--forest-700);\n}\n.rt strong {\n  color: var(--stone-900);\n}\n.spacer {\n  flex: 1;\n}\n.strong {\n  font-weight: 600;\n}\n.tchip {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n.tchip i {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n.ser {\n  font-size: 11.5px;\n  color: var(--stone-700);\n}\ntr.cancel td {\n  opacity: 0.55;\n}\n.foot {\n  margin-top: 16px;\n}\n@media (max-width: 1100px) {\n  .g2 {\n    grid-template-columns: 1fr;\n  }\n}\n@media print {\n  .g2 {\n    grid-template-columns: 1fr 1fr;\n  }\n  .rets {\n    max-height: none;\n  }\n}\n/*# sourceMappingURL=buyer-portal.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BuyerPortfolio, { className: "BuyerPortfolio", filePath: "src/app/features/buyer-portal/buyer-portal.ts", lineNumber: 186 });
})();
var BuyerSale = class _BuyerSale {
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  store = inject(PortfolioStore);
  typeLabel = TYPE_LABEL;
  report = signal(
    null,
    ...ngDevMode ? [{ debugName: "report" }] : (
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
  holding = computed(
    () => (this.store.data()?.sales ?? []).find((h) => saleIdOf(h) === this.id()) ?? null,
    ...ngDevMode ? [{ debugName: "holding" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ngOnInit() {
    this.store.load();
    this.api.get(`/sales/${this.id()}/report`).subscribe({
      next: (r) => {
        this.report.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  print() {
    window.print();
  }
  static \u0275fac = function BuyerSale_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BuyerSale)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BuyerSale, selectors: [["vcb-sale"]], inputs: { id: [1, "id"] }, decls: 12, vars: 2, consts: [[1, "row", "no-print", "top"], ["routerLink", "/buyer", 1, "back", "small"], ["name", "arrow-left", 3, "size"], [1, "spacer"], [1, "btn", "btn-primary", 3, "click"], ["name", "download"], [3, "report"], [1, "card"], ["title", "Couldn't load this purchase", 3, "message"], [3, "rows"], [1, "card-head"], [3, "status"], [1, "card-body"], [1, "kv"], [1, "mono"], [1, "mono", "small"], [1, "subtle", "small", 2, "margin-top", "14px"]], template: function BuyerSale_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "a", 1);
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Portfolio");
      \u0275\u0275elementEnd();
      \u0275\u0275element(4, "span", 3);
      \u0275\u0275elementStart(5, "button", 4);
      \u0275\u0275listener("click", function BuyerSale_Template_button_click_5_listener() {
        return ctx.print();
      });
      \u0275\u0275element(6, "vc-icon", 5);
      \u0275\u0275text(7, "Download summary");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(8, BuyerSale_Conditional_8_Template, 1, 1, "vcx-sale-report", 6)(9, BuyerSale_Conditional_9_Template, 2, 1, "div", 7)(10, BuyerSale_Conditional_10_Template, 34, 17, "article", 7)(11, BuyerSale_Conditional_11_Template, 1, 1, "vc-error", 8);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance(2);
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(6);
      \u0275\u0275conditional((tmp_1_0 = ctx.report()) ? 8 : ctx.loading() ? 9 : (tmp_1_0 = ctx.holding()) ? 10 : 11, tmp_1_0);
    }
  }, dependencies: [RouterLink, Icon, Badge, Loading, ErrorBox, SaleReportCard, NumPipe, DayPipe], styles: ["\n.top[_ngcontent-%COMP%] {\n  margin-bottom: 18px;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--%NS%text-2);\n}\n/*# sourceMappingURL=buyer-portal.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuyerSale, [{
    type: Component,
    args: [{ selector: "vcb-sale", imports: [RouterLink, ...KIT, NumPipe, DayPipe, SaleReportCard], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="row no-print top">
      <a routerLink="/buyer" class="back small"><vc-icon name="arrow-left" [size]="14" />Portfolio</a>
      <span class="spacer"></span>
      <button class="btn btn-primary" (click)="print()"><vc-icon name="download" />Download summary</button>
    </div>
    @if (report(); as r) {
      <vcx-sale-report [report]="r" />
    } @else if (loading()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (holding(); as h) {
      <!-- report not available to this account: summarise from the portfolio -->
      <article class="card">
        <div class="card-head"><h2>{{ h.quantity | num: 3 }} tCO\u2082e \xB7 {{ typeLabel[h.credit_type].toLowerCase() }}</h2><vc-badge [status]="h.status" /></div>
        <div class="card-body">
          <dl class="kv">
            <dt>Purchase</dt><dd class="mono">{{ h.sale_code }}</dd>
            <dt>Project</dt><dd>{{ h.project?.code }} \xB7 {{ h.project?.name }}</dd>
            <dt>Vintage</dt><dd>{{ h.vintage }}</dd>
            <dt>Contract</dt><dd class="mono">{{ h.contract_ref || '\u2014' }}</dd>
            <dt>Registry</dt><dd>{{ h.registry || '\u2014' }} {{ h.registry_project_ref ? '\xB7 ' + h.registry_project_ref : '' }}</dd>
            <dt>Serials</dt><dd class="mono small">{{ h.serial_start || '\u2014' }} \u2192 {{ h.serial_end || '\u2014' }}</dd>
            @if (h.retirement; as rt) { <dt>Retired</dt><dd>{{ rt.quantity | num: 2 }} t for {{ rt.beneficiary }} \xB7 {{ rt.retired_at | day }}</dd> }
          </dl>
          @if (error()) { <p class="subtle small" style="margin-top:14px">The detailed supply-chain report isn't available right now: {{ error() }}</p> }
        </div>
      </article>
    } @else {
      <vc-error title="Couldn't load this purchase" [message]="error() ?? 'Not found.'" />
    }
  `, styles: ["/* angular:styles/component:scss;8c713b698094f9b9;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\buyer-portal\\buyer-portal.ts */\n.top {\n  margin-bottom: 18px;\n}\n.spacer {\n  flex: 1;\n}\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--text-2);\n}\n/*# sourceMappingURL=buyer-portal.css.map */\n"] }]
  }], null, { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BuyerSale, { className: "BuyerSale", filePath: "src/app/features/buyer-portal/buyer-portal.ts", lineNumber: 272 });
})();

// src/app/features/buyer-portal/buyer-portal.routes.ts
var buyer_portal_routes_default = [
  {
    path: "",
    component: BuyerShell,
    children: [
      { path: "", component: BuyerPortfolio, title: "Carbon portfolio \xB7 Varsapradaya Carbon" },
      { path: "sales/:id", component: BuyerSale, title: "Purchase report \xB7 Varsapradaya Carbon" }
    ]
  }
];
export {
  buyer_portal_routes_default as default
};
//# debugId=c3f5309d-aafb-5cf7-b64e-9320f67e4afb
//# sourceMappingURL=chunk-RBJ3K6RX.js.map
