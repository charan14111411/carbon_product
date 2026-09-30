import {
  MapView
} from "./chunk-RDYPAIRM.js";
import {
  Chart,
  PALETTE
} from "./chunk-RHCCRMNI.js";
import "./chunk-2EYLJUAJ.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  HumanPipe,
  NumPipe,
  fmtNum
} from "./chunk-E5UDMWWN.js";
import {
  AuthService,
  Router,
  RouterLink
} from "./chunk-G6POHVBO.js";
import {
  Badge,
  DataClass,
  Empty,
  Loading
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  effect,
  forkJoin,
  inject,
  of,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-O2E4BMDK.js";

// src/app/features/overview/overview.page.ts
var _c0 = (a0) => ["/app/programmes/projects", a0];
var _c1 = (a0) => ["/app/programmes", a0];
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.code;
var _forTrack2 = ($index, $item) => $item.title;
function OverviewPage_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "vc-loading", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function OverviewPage_Conditional_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 6);
    \u0275\u0275element(1, "vc-icon", 9);
    \u0275\u0275text(2, "Create a programme");
    \u0275\u0275elementEnd();
  }
}
function OverviewPage_Conditional_1_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 7);
    \u0275\u0275text(1, "View programmes");
    \u0275\u0275elementEnd();
  }
}
function OverviewPage_Conditional_1_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "vc-icon", 11);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r1 = ctx.$implicit;
    const \u0275$index_34_r2 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_34_r2 + 1);
    \u0275\u0275advance();
    \u0275\u0275property("name", s_r1.icon)("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r1.label);
  }
}
function OverviewPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "div", 3)(2, "span", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h1");
    \u0275\u0275text(5, "Start by creating a programme");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "A programme sets the region, eligible crops and commercial terms. Inside it, a project follows one methodology \u2014 from enrolling fields to paying farmers.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 5);
    \u0275\u0275conditionalCreate(9, OverviewPage_Conditional_1_Conditional_9_Template, 3, 0, "a", 6)(10, OverviewPage_Conditional_1_Conditional_10_Template, 2, 0, "a", 7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "ol", 8);
    \u0275\u0275repeaterCreate(12, OverviewPage_Conditional_1_For_13_Template, 5, 4, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Welcome, ", ctx_r2.firstName());
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r2.auth.can("programmes.manage") ? 9 : 10);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.journeyDef);
  }
}
function OverviewPage_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 47);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "vc-icon", 48);
  }
  if (rf & 2) {
    const prog_r4 = ctx;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(3, _c1, prog_r4.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(prog_r4.name);
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function OverviewPage_Conditional_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275element(1, "vc-icon", 49);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.programme().region);
  }
}
function OverviewPage_Conditional_2_Conditional_18_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 56);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "a", 57);
    \u0275\u0275text(5, "Resolve");
    \u0275\u0275element(6, "vc-icon", 58);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r5 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Next: ", b_r5.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r5.detail);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", ctx_r2.dimLink(b_r5.key));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
  }
}
function OverviewPage_Conditional_2_Conditional_18_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1, "Ready for verification");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 56);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r6 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("No blocking items. ", ctx_r2.okCount(), " of ", r_r6.dimensions.length, " checks fully complete.");
  }
}
function OverviewPage_Conditional_2_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 51);
    \u0275\u0275element(2, "circle", 52)(3, "circle", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "span", 54);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "num");
    \u0275\u0275elementStart(7, "small");
    \u0275\u0275text(8, "%");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 22)(10, "span", 55);
    \u0275\u0275text(11, "Verification readiness");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, OverviewPage_Conditional_2_Conditional_18_Conditional_12_Template, 7, 4)(13, OverviewPage_Conditional_2_Conditional_18_Conditional_13_Template, 4, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_8_0;
    const r_r6 = ctx;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", "Readiness " + r_r6.score_pct + "%");
    \u0275\u0275advance(3);
    \u0275\u0275attribute("stroke", r_r6.ready ? "#86b797" : "#e7a57b")("stroke-dasharray", ctx_r2.ringDash(r_r6.score_pct));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(6, 5, r_r6.score_pct, 0));
    \u0275\u0275advance(7);
    \u0275\u0275conditional((tmp_8_0 = ctx_r2.nextBlocker()) ? 12 : 13, tmp_8_0);
  }
}
function OverviewPage_Conditional_2_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 55);
    \u0275\u0275text(2, "Verification readiness");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 56);
    \u0275\u0275text(4, "Not available for your role.");
    \u0275\u0275elementEnd()();
  }
}
function OverviewPage_Conditional_2_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 55);
    \u0275\u0275text(2, "Verification readiness");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 56);
    \u0275\u0275text(4, "Working it out\u2026");
    \u0275\u0275elementEnd()();
  }
}
function OverviewPage_Conditional_2_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementStart(3, "small");
    \u0275\u0275text(4, "tCO\u2082e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "span", 27);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const run_r7 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 2, run_r7.net_t_co2e, 1));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Approved \xB7 ", run_r7.period_label);
  }
}
function OverviewPage_Conditional_2_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 27);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.runs().length ? "No approved calculation yet" : "No calculation run yet");
  }
}
function OverviewPage_Conditional_2_For_74_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 61);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 15)("stroke", 2.4);
  }
}
function OverviewPage_Conditional_2_For_74_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 11);
  }
  if (rf & 2) {
    const s_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("name", s_r8.icon)("size", 15);
  }
}
function OverviewPage_Conditional_2_For_74_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 66);
  }
  if (rf & 2) {
    const s_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("full", s_r8.state === "done");
  }
}
function OverviewPage_Conditional_2_For_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 47)(2, "span", 59)(3, "span", 60);
    \u0275\u0275conditionalCreate(4, OverviewPage_Conditional_2_For_74_Case_4_Template, 1, 2, "vc-icon", 61)(5, OverviewPage_Conditional_2_For_74_Case_5_Template, 1, 2, "vc-icon", 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 62);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 63);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 64);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(12, OverviewPage_Conditional_2_For_74_Conditional_12_Template, 1, 2, "span", 65);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_16_0;
    const s_r8 = ctx.$implicit;
    const \u0275$index_237_r9 = ctx.$index;
    const \u0275$count_237_r10 = ctx.$count;
    const p_r11 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(s_r8.state);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", s_r8.link === "project" ? \u0275\u0275pureFunction1(8, _c0, p_r11.id) : s_r8.link);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_16_0 = s_r8.state) === "done" ? 4 : 5);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r8.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.stateLabel(s_r8.state));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r8.detail);
    \u0275\u0275advance();
    \u0275\u0275conditional(!(\u0275$index_237_r9 === \u0275$count_237_r10 - 1) ? 12 : -1);
  }
}
function OverviewPage_Conditional_2_Conditional_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 2);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function OverviewPage_Conditional_2_Conditional_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 39)(1, "a", 67);
    \u0275\u0275text(2, "Enrol fields");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r11 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c0, p_r11.id));
  }
}
function OverviewPage_Conditional_2_Conditional_85_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "b", 70);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const l_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", l_r13.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", l_r13.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(l_r13.count);
  }
}
function OverviewPage_Conditional_2_Conditional_85_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40)(1, "vc-map", 68);
    \u0275\u0275listener("featureClick", function OverviewPage_Conditional_2_Conditional_85_Template_vc_map_featureClick_1_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openField($event.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 69);
    \u0275\u0275repeaterCreate(3, OverviewPage_Conditional_2_Conditional_85_For_4_Template, 5, 4, "span", null, _forTrack1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("polygons", ctx_r2.coloured())("points", ctx_r2.centroids());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.cropLegend());
  }
}
function OverviewPage_Conditional_2_Conditional_90_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41)(1, "button", 71);
    \u0275\u0275listener("click", function OverviewPage_Conditional_2_Conditional_90_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.chartMode.set("strata"));
    });
    \u0275\u0275text(2, "By zone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 71);
    \u0275\u0275listener("click", function OverviewPage_Conditional_2_Conditional_90_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.chartMode.set("period"));
    });
    \u0275\u0275text(4, "By period");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("on", ctx_r2.chartMode() === "strata");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r2.chartMode() === "period");
  }
}
function OverviewPage_Conditional_2_Conditional_92_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 73);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r15 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Change in soil organic carbon, tonnes of carbon per hectare, from run ", d_r15.period_label, " (", \u0275\u0275pipeBind1(2, 2, d_r15.status), "). Whiskers show \xB11 standard error.");
  }
}
function OverviewPage_Conditional_2_Conditional_92_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 73);
    \u0275\u0275text(1, "Net credits after uncertainty and buffer deductions, latest run per period.");
    \u0275\u0275elementEnd();
  }
}
function OverviewPage_Conditional_2_Conditional_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "vc-chart", 72);
    \u0275\u0275conditionalCreate(2, OverviewPage_Conditional_2_Conditional_92_Conditional_2_Template, 3, 4, "p", 73)(3, OverviewPage_Conditional_2_Conditional_92_Conditional_3_Template, 2, 0, "p", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("option", ctx);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_5_0 = ctx_r2.chartMode() === "strata" && ctx_r2.latestDetail()) ? 2 : 3, tmp_5_0);
  }
}
function OverviewPage_Conditional_2_Conditional_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 43)(1, "a", 74);
    \u0275\u0275text(2, "Go to calculations");
    \u0275\u0275elementEnd()();
  }
}
function OverviewPage_Conditional_2_Conditional_98_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.attention().length);
  }
}
function OverviewPage_Conditional_2_Conditional_99_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275element(1, "vc-icon", 75);
    \u0275\u0275text(2, "Nothing needs your attention right now.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function OverviewPage_Conditional_2_Conditional_100_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 76);
    \u0275\u0275element(2, "vc-icon", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 77)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "a", 78);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r16 = ctx.$implicit;
    const p_r11 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(a_r16.tone);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", a_r16.icon)("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r16.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r16.text);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", a_r16.link === "project" ? \u0275\u0275pureFunction1(8, _c0, p_r11.id) : a_r16.link);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r16.action);
  }
}
function OverviewPage_Conditional_2_Conditional_100_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 46);
    \u0275\u0275repeaterCreate(1, OverviewPage_Conditional_2_Conditional_100_For_2_Template, 10, 10, "li", 36, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.attention());
  }
}
function OverviewPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 12)(1, "div", 13)(2, "div", 14);
    \u0275\u0275conditionalCreate(3, OverviewPage_Conditional_2_Conditional_3_Template, 3, 5);
    \u0275\u0275elementStart(4, "span", 15);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "h1");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 16);
    \u0275\u0275element(9, "vc-badge", 17);
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275element(11, "vc-icon", 18);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, OverviewPage_Conditional_2_Conditional_13_Template, 3, 2, "span");
    \u0275\u0275elementStart(14, "a", 19);
    \u0275\u0275text(15, "Project details");
    \u0275\u0275element(16, "vc-icon", 20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 21);
    \u0275\u0275conditionalCreate(18, OverviewPage_Conditional_2_Conditional_18_Template, 14, 8)(19, OverviewPage_Conditional_2_Conditional_19_Template, 5, 0, "div", 22)(20, OverviewPage_Conditional_2_Conditional_20_Template, 5, 0, "div", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 23)(22, "a", 24)(23, "span", 25);
    \u0275\u0275text(24, "Farmers enrolled");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "span", 26);
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span", 27);
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "a", 24)(32, "span", 25);
    \u0275\u0275text(33, "Area enrolled");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 26);
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "num");
    \u0275\u0275elementStart(37, "small");
    \u0275\u0275text(38, "ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "span", 27);
    \u0275\u0275text(40);
    \u0275\u0275pipe(41, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "a", 28)(43, "span", 25);
    \u0275\u0275text(44, "Soil cores collected");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "span", 26);
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "num");
    \u0275\u0275elementStart(48, "small");
    \u0275\u0275text(49);
    \u0275\u0275pipe(50, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "span", 27);
    \u0275\u0275text(52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "a", 29)(54, "span", 25);
    \u0275\u0275text(55, "Net credits ");
    \u0275\u0275element(56, "vc-dc", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(57, OverviewPage_Conditional_2_Conditional_57_Template, 7, 5)(58, OverviewPage_Conditional_2_Conditional_58_Template, 4, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "a", 31)(60, "span", 25);
    \u0275\u0275text(61, "Open blocking issues");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "span", 26);
    \u0275\u0275text(63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "span", 27);
    \u0275\u0275text(65);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(66, "section", 32)(67, "div", 33)(68, "h3");
    \u0275\u0275text(69, "Journey");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "span", 34);
    \u0275\u0275text(71, "From enrolment to farmer payment. Each step reflects this project\u2019s live readiness checks.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(72, "ol", 35);
    \u0275\u0275repeaterCreate(73, OverviewPage_Conditional_2_For_74_Template, 13, 10, "li", 36, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(75, "div", 37)(76, "section", 0)(77, "div", 33)(78, "h3");
    \u0275\u0275text(79, "Enrolled fields");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "a", 38);
    \u0275\u0275text(81, "Open map");
    \u0275\u0275element(82, "vc-icon", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(83, OverviewPage_Conditional_2_Conditional_83_Template, 1, 1, "vc-loading", 2)(84, OverviewPage_Conditional_2_Conditional_84_Template, 3, 3, "vc-empty", 39)(85, OverviewPage_Conditional_2_Conditional_85_Template, 5, 2, "div", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "section", 0)(87, "div", 33)(88, "h3");
    \u0275\u0275text(89);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(90, OverviewPage_Conditional_2_Conditional_90_Template, 5, 4, "div", 41);
    \u0275\u0275element(91, "vc-dc", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(92, OverviewPage_Conditional_2_Conditional_92_Template, 4, 2, "div", 42)(93, OverviewPage_Conditional_2_Conditional_93_Template, 3, 0, "vc-empty", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(94, "section", 0)(95, "div", 33)(96, "h3");
    \u0275\u0275text(97, "Needs attention");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(98, OverviewPage_Conditional_2_Conditional_98_Template, 2, 1, "span", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(99, OverviewPage_Conditional_2_Conditional_99_Template, 3, 1, "div", 45)(100, OverviewPage_Conditional_2_Conditional_100_Template, 3, 0, "ul", 46);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_11_0;
    let tmp_21_0;
    let tmp_30_0;
    const p_r11 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_2_0 = ctx_r2.programme()) ? 3 : -1, tmp_2_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r11.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r11.name);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", p_r11.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r11.methodology_code, " v", p_r11.methodology_version);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.programme()?.region ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(52, _c0, p_r11.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_11_0 = ctx_r2.readiness()) ? 18 : ctx_r2.readinessFailed() ? 19 : 20, tmp_11_0);
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(54, _c0, p_r11.id));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(27, 34, ctx_r2.enrolStats().farmers, 0));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(30, 37, ctx_r2.enrolStats().fields, 0), " fields \xB7 ", ctx_r2.enrolStats().pending, " awaiting decision");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(56, _c0, p_r11.id));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(36, 40, ctx_r2.enrolStats().area, 1));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Programme-wide ", ctx_r2.summary() ? \u0275\u0275pipeBind2(41, 43, ctx_r2.summary().hectares_enrolled, 1) + " ha" : "\u2014");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(47, 46, ctx_r2.sampling().collected, 0));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("of ", \u0275\u0275pipeBind2(50, 49, ctx_r2.sampling().planned, 0));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r2.sampling().campaigns, " campaign", ctx_r2.sampling().campaigns === 1 ? "" : "s");
    \u0275\u0275advance(5);
    \u0275\u0275conditional((tmp_21_0 = ctx_r2.latestApproved()) ? 57 : 58, tmp_21_0);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("alarm", (ctx_r2.qa()?.blocking ?? 0) > 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.qa() ? ctx_r2.qa().blocking : "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.qaHint());
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r2.steps());
    \u0275\u0275advance(9);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.fields() === null ? 83 : !ctx_r2.fields().features.length ? 84 : 85);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r2.chartMode() === "strata" ? "Soil-carbon change by zone" : "Net credits by period");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.strataOption() && ctx_r2.periodOption() ? 90 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_30_0 = ctx_r2.chartOption()) ? 92 : 93, tmp_30_0);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r2.attention().length ? 98 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.attention().length ? 99 : 100);
  }
}
var JOURNEY = [
  { key: "enrol", label: "Enrol", icon: "users", link: "project", dims: ["fields_enrolled"] },
  { key: "plan", label: "Plan", icon: "target", link: "/app/sampling", dims: ["rules_approved", "strata_defined", "sample_plans_approved"] },
  { key: "sample", label: "Sample", icon: "pin", link: "/app/sampling", dims: ["baseline_samples_collected", "custody_complete", "monitoring_campaign"] },
  { key: "lab", label: "Lab", icon: "flask", link: "/app/lab", dims: ["lab_results_accepted", "certificates_attached"] },
  { key: "calc", label: "Calculate", icon: "calculator", link: "/app/calculations", dims: ["open_blocking_qa", "terms_approved", "calculation_approved"] },
  { key: "verify", label: "Verify", icon: "file-check", link: "/app/verification", dims: ["package_issued"] },
  { key: "sell", label: "Sell", icon: "receipt", link: "/app/sales", dims: [] },
  { key: "pay", label: "Pay", icon: "hand-coins", link: "/app/benefits", dims: [] }
];
var DIM_LINK = {
  rules_approved: "/app/methodology",
  fields_enrolled: "project",
  strata_defined: "/app/sampling",
  sample_plans_approved: "/app/sampling",
  baseline_samples_collected: "/app/sampling",
  lab_results_accepted: "/app/lab",
  certificates_attached: "/app/lab",
  custody_complete: "/app/sampling",
  open_blocking_qa: "/app/quality",
  monitoring_campaign: "/app/sampling",
  terms_approved: "/app/calculations",
  calculation_approved: "/app/calculations",
  package_issued: "/app/verification"
};
var safe = (o, fallback) => o.pipe(catchError(() => of(fallback)));
var OverviewPage = class _OverviewPage {
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  api = inject(ApiService);
  router = inject(Router);
  journeyDef = JOURNEY;
  project = this.ctx.current;
  programme = signal(
    null,
    ...ngDevMode ? [{ debugName: "programme" }] : (
      /* istanbul ignore next */
      []
    )
  );
  summary = signal(
    null,
    ...ngDevMode ? [{ debugName: "summary" }] : (
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
  readinessFailed = signal(
    false,
    ...ngDevMode ? [{ debugName: "readinessFailed" }] : (
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
  latestDetail = signal(
    null,
    ...ngDevMode ? [{ debugName: "latestDetail" }] : (
      /* istanbul ignore next */
      []
    )
  );
  qa = signal(
    null,
    ...ngDevMode ? [{ debugName: "qa" }] : (
      /* istanbul ignore next */
      []
    )
  );
  enrolments = signal(
    [],
    ...ngDevMode ? [{ debugName: "enrolments" }] : (
      /* istanbul ignore next */
      []
    )
  );
  campaigns = signal(
    [],
    ...ngDevMode ? [{ debugName: "campaigns" }] : (
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
  sales = signal(
    [],
    ...ngDevMode ? [{ debugName: "sales" }] : (
      /* istanbul ignore next */
      []
    )
  );
  payouts = signal(
    [],
    ...ngDevMode ? [{ debugName: "payouts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  packs = signal(
    [],
    ...ngDevMode ? [{ debugName: "packs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  crops = signal(
    [],
    ...ngDevMode ? [{ debugName: "crops" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fields = signal(
    null,
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  chartMode = signal(
    "strata",
    ...ngDevMode ? [{ debugName: "chartMode" }] : (
      /* istanbul ignore next */
      []
    )
  );
  firstName = computed(
    () => (this.auth.profile()?.full_name ?? "").split(" ")[0],
    ...ngDevMode ? [{ debugName: "firstName" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.api.get("/catalogue/crops").pipe(catchError(() => of([]))).subscribe((c) => this.crops.set(c));
    let last = null;
    effect(() => {
      const p = this.project();
      if (p && p.id !== last) {
        last = p.id;
        this.load(p.id, p.programme_id);
      }
    });
  }
  load(pid, progId) {
    this.readiness.set(null);
    this.readinessFailed.set(false);
    this.latestDetail.set(null);
    this.fields.set(null);
    this.programme.set(null);
    this.summary.set(null);
    const can = (p) => this.auth.can(p);
    safe(this.api.get(`/programmes/${progId}`), null).subscribe((x) => this.programme.set(x));
    safe(this.api.get(`/programmes/${progId}/summary`), null).subscribe((x) => this.summary.set(x));
    this.api.get(`/projects/${pid}/readiness`).subscribe({
      next: (r) => this.readiness.set(r),
      error: () => this.readinessFailed.set(true)
    });
    safe(this.api.get(`/projects/${pid}/qa/summary`), null).subscribe((x) => this.qa.set(x));
    safe(this.api.get(`/projects/${pid}/enrolments`), []).subscribe((x) => this.enrolments.set(x));
    safe(this.api.get(`/projects/${pid}/campaigns`), []).subscribe((x) => this.campaigns.set(Array.isArray(x) ? x : []));
    safe(this.api.get("/fields/geojson", { project_id: pid }), { type: "FeatureCollection", features: [] }).subscribe((fc) => this.fields.set(__spreadProps(__spreadValues({}, fc), { features: fc.features.filter((f) => f.properties?.["enrolment_status"] && f.properties["enrolment_status"] !== "withdrawn") })));
    safe(this.api.get(`/projects/${pid}/calculations`), []).subscribe((runs) => {
      this.runs.set(runs);
      const pick = runs.find((r) => r.status === "approved") ?? runs[0];
      if (pick)
        safe(this.api.get(`/calculations/${pick.id}`), null).subscribe((d) => this.latestDetail.set(d));
    });
    forkJoin({
      batches: safe(this.api.get("/credit-batches", { project_id: pid }), []),
      sales: can("sales.manage") || can("data.read") ? safe(this.api.get("/sales"), []) : of([]),
      payouts: safe(this.api.get("/payout-batches"), []),
      packs: can("rules.approve") ? safe(this.api.get("/rule-packs", { status: "draft" }), []) : of([])
    }).subscribe((r) => {
      this.batches.set(r.batches);
      const ids = new Set(r.batches.map((b) => b.id));
      this.sales.set(r.sales.filter((s) => ids.has(s.batch_id)));
      this.payouts.set(r.payouts);
      this.packs.set(r.packs);
    });
  }
  /* ------------------------------------------------------------ derived */
  enrolStats = computed(
    () => {
      const es = this.enrolments();
      const on = es.filter((e) => e.status === "enrolled");
      return {
        farmers: new Set(on.map((e) => e.farmer_id)).size,
        fields: on.length,
        area: on.reduce((a, e) => a + (e.field_area_ha || 0), 0),
        pending: es.filter((e) => e.status === "eligible" || e.status === "pending").length
      };
    },
    ...ngDevMode ? [{ debugName: "enrolStats" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sampling = computed(
    () => {
      const cs = this.campaigns();
      return {
        campaigns: cs.length,
        planned: cs.reduce((a, c) => a + (c.progress?.points_total ?? 0), 0),
        collected: cs.reduce((a, c) => a + (c.progress?.points_collected ?? 0), 0)
      };
    },
    ...ngDevMode ? [{ debugName: "sampling" }] : (
      /* istanbul ignore next */
      []
    )
  );
  latestApproved = computed(
    () => this.runs().find((r) => r.status === "approved") ?? null,
    ...ngDevMode ? [{ debugName: "latestApproved" }] : (
      /* istanbul ignore next */
      []
    )
  );
  qaHint = computed(
    () => {
      const q = this.qa();
      if (!q)
        return "Quality checks";
      const w = q.open_by_severity?.["warning"] ?? 0;
      return q.blocking ? "Calculations are blocked until resolved" : w ? `${w} open warning${w === 1 ? "" : "s"}` : "All clear";
    },
    ...ngDevMode ? [{ debugName: "qaHint" }] : (
      /* istanbul ignore next */
      []
    )
  );
  nextBlocker = computed(
    () => this.readiness()?.dimensions.find((d) => d.status === "blocking") ?? null,
    ...ngDevMode ? [{ debugName: "nextBlocker" }] : (
      /* istanbul ignore next */
      []
    )
  );
  okCount = computed(
    () => this.readiness()?.dimensions.filter((d) => d.status === "ok").length ?? 0,
    ...ngDevMode ? [{ debugName: "okCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  steps = computed(
    () => {
      const dims = new Map((this.readiness()?.dimensions ?? []).map((d) => [d.key, d]));
      const raw = JOURNEY.map((j) => {
        let status = "none";
        let detail = "";
        if (j.dims.length) {
          const ds = j.dims.map((k) => dims.get(k)).filter((d) => !!d);
          if (ds.length) {
            const worst = ds.find((d) => d.status === "blocking") ?? ds.find((d) => d.status === "warning");
            status = worst ? worst.status : "ok";
            detail = (worst ?? ds[0]).detail;
          }
        } else if (j.key === "sell") {
          const sold = this.sales().length, b = this.batches().length;
          status = sold ? "ok" : b ? "warning" : "blocking";
          detail = sold ? `${sold} sale${sold === 1 ? "" : "s"} recorded` : b ? `${b} credit batch${b === 1 ? "" : "es"}, none sold` : "No credits issued yet";
        } else if (j.key === "pay") {
          const done = this.payouts().filter((p) => p.status === "completed").length, any = this.payouts().length;
          status = done ? "ok" : any ? "warning" : "blocking";
          detail = done ? `${done} payout batch${done === 1 ? "" : "es"} paid` : any ? `${any} batch${any === 1 ? "" : "es"} in progress` : "No payouts yet";
        }
        return __spreadProps(__spreadValues({}, j), { status, detail });
      });
      let nextGiven = false;
      return raw.map((r) => {
        let state = r.status === "ok" ? "done" : r.status === "warning" ? "progress" : "todo";
        if (state !== "done" && !nextGiven) {
          if (state === "todo")
            state = "next";
          nextGiven = true;
        }
        return { key: r.key, label: r.label, icon: r.icon, link: r.link, state, detail: r.detail || "Waiting on earlier steps" };
      });
    },
    ...ngDevMode ? [{ debugName: "steps" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropColors = computed(
    () => {
      const codes = [...new Set((this.fields()?.features ?? []).map((f) => f.properties?.["crop_code"] ?? ""))].sort();
      return new Map(codes.map((c, i) => [c, c ? PALETTE[i % PALETTE.length] : "#9aa29c"]));
    },
    ...ngDevMode ? [{ debugName: "cropColors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  coloured = computed(
    () => {
      const fc = this.fields();
      if (!fc)
        return null;
      const colors = this.cropColors();
      const names = new Map(this.crops().map((c) => [c.code, c.name]));
      return __spreadProps(__spreadValues({}, fc), {
        features: fc.features.map((f) => {
          const p = f.properties ?? {};
          const crop = p["crop_code"] ?? "";
          return __spreadProps(__spreadValues({}, f), {
            properties: __spreadProps(__spreadValues({}, p), {
              color: colors.get(crop),
              label: `<strong>${esc(String(p["name"] ?? ""))}</strong><br><span style="color:#58625b">${esc(String(p["code"] ?? ""))} \xB7 ${esc(names.get(crop) ?? (crop || "No crop"))} \xB7 ${fmtNum(Number(p["area_ha"]), 2)} ha</span>`
            })
          });
        })
      });
    },
    ...ngDevMode ? [{ debugName: "coloured" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Field centres, so small fields stay visible at district zoom. */
  centroids = computed(
    () => {
      const fc = this.coloured();
      if (!fc)
        return null;
      return {
        type: "FeatureCollection",
        features: fc.features.map((f) => {
          const g = f.geometry;
          const ring = (g.type === "Polygon" ? g.coordinates[0] : g.coordinates[0]?.[0]) ?? [];
          const pts = ring.slice(0, Math.max(1, ring.length - 1));
          const x = pts.reduce((a, c) => a + c[0], 0) / (pts.length || 1);
          const y = pts.reduce((a, c) => a + c[1], 0) / (pts.length || 1);
          return { type: "Feature", id: f.id, geometry: { type: "Point", coordinates: [x, y] }, properties: f.properties };
        })
      };
    },
    ...ngDevMode ? [{ debugName: "centroids" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropLegend = computed(
    () => {
      const names = new Map(this.crops().map((c) => [c.code, c.name]));
      const counts = /* @__PURE__ */ new Map();
      for (const f of this.fields()?.features ?? []) {
        const c = f.properties?.["crop_code"] ?? "";
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
      return [...this.cropColors().entries()].map(([code, color]) => ({
        code,
        color,
        name: names.get(code) ?? (code || "No crop recorded"),
        count: counts.get(code) ?? 0
      }));
    },
    ...ngDevMode ? [{ debugName: "cropLegend" }] : (
      /* istanbul ignore next */
      []
    )
  );
  strataOption = computed(
    () => {
      const st = this.latestDetail()?.results?.strata ?? [];
      if (!st.length)
        return null;
      const cats = st.map((s) => s.code);
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (ps) => {
            const s = st[ps[0].dataIndex];
            return `<strong>${esc(s.code)}</strong><br>\u0394SOC ${fmtNum(s.delta_t_c_ha, 2)} t C/ha \xB1 ${fmtNum(s.se, 2)}<br>${fmtNum(s.area_ha, 1)} ha \xB7 ${s.n_used} sites`;
          }
        },
        grid: { left: 8, right: 16, top: 32, bottom: 8, containLabel: true },
        xAxis: { type: "category", data: cats },
        yAxis: { type: "value", name: "t C/ha", nameTextStyle: { color: "#737c76", fontSize: 11, align: "left" } },
        series: [
          {
            type: "bar",
            barMaxWidth: 36,
            data: st.map((s) => ({ value: round(s.delta_t_c_ha), itemStyle: { color: s.delta_t_c_ha >= 0 ? PALETTE[0] : PALETTE[1], borderRadius: s.delta_t_c_ha >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4] } })),
            label: { show: st.length <= 8, position: "insideBottom", distance: 8, fontSize: 11, fontWeight: 600, color: "#ffffff", formatter: (p) => fmtNum(p.value, 2) }
          },
          {
            type: "line",
            silent: true,
            symbol: "none",
            lineStyle: { width: 0 },
            tooltip: { show: false },
            data: [],
            markLine: {
              silent: true,
              symbol: "none",
              lineStyle: { color: "#58625b", width: 1.2, type: "solid" },
              label: { show: false },
              data: st.map((s, i) => [{ coord: [i, round(s.delta_t_c_ha - s.se)] }, { coord: [i, round(s.delta_t_c_ha + s.se)] }])
            }
          }
        ]
      };
    },
    ...ngDevMode ? [{ debugName: "strataOption" }] : (
      /* istanbul ignore next */
      []
    )
  );
  periodOption = computed(
    () => {
      const by = /* @__PURE__ */ new Map();
      for (const r of [...this.runs()].reverse()) {
        const cur = by.get(r.period_label);
        if (!cur || r.status === "approved" || cur.status !== "approved")
          by.set(r.period_label, r);
      }
      const rows = [...by.values()].filter((r) => r.net_t_co2e !== null).sort((a, b) => a.period_start.localeCompare(b.period_start));
      if (!rows.length)
        return null;
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (ps) => {
            const r = rows[ps[0].dataIndex];
            return `<strong>${esc(r.period_label)}</strong><br>${fmtNum(r.net_t_co2e, 1)} tCO\u2082e \xB7 ${esc(r.status.replace(/_/g, " "))}`;
          }
        },
        grid: { left: 8, right: 16, top: 32, bottom: 8, containLabel: true },
        xAxis: { type: "category", data: rows.map((r) => r.period_label) },
        yAxis: { type: "value", name: "tCO\u2082e", nameTextStyle: { color: "#737c76", fontSize: 11, align: "left" } },
        series: [{
          type: "bar",
          barMaxWidth: 40,
          data: rows.map((r) => ({ value: round(r.net_t_co2e ?? 0), itemStyle: { color: r.status === "approved" ? PALETTE[0] : "#86b797", borderRadius: [4, 4, 0, 0] } })),
          label: { show: rows.length <= 8, position: "top", fontSize: 11, color: "#414b45", formatter: (p) => fmtNum(p.value, 1) }
        }]
      };
    },
    ...ngDevMode ? [{ debugName: "periodOption" }] : (
      /* istanbul ignore next */
      []
    )
  );
  chartOption = computed(
    () => {
      const s = this.strataOption(), p = this.periodOption();
      if (this.chartMode() === "period" && p)
        return p;
      return s ?? p;
    },
    ...ngDevMode ? [{ debugName: "chartOption" }] : (
      /* istanbul ignore next */
      []
    )
  );
  attention = computed(
    () => {
      const out = [];
      const me = this.auth.profile()?.id;
      const q = this.qa();
      if (q?.blocking) {
        out.push({
          tone: "danger",
          icon: "shield",
          title: `${q.blocking} blocking quality issue${q.blocking === 1 ? "" : "s"}`,
          text: "Calculations can\u2019t run until these are resolved or acknowledged with a reason.",
          link: "/app/quality",
          action: "Review issues"
        });
      }
      if (this.auth.can("calc.approve")) {
        for (const r of this.runs().filter((r2) => r2.status === "submitted")) {
          const own = r.created_by === me;
          out.push({
            tone: own ? "info" : "warn",
            icon: "calculator",
            title: `Calculation ${r.period_label} awaiting approval`,
            text: own ? "You ran this calculation, so someone else must approve it." : `${fmtNum(r.net_t_co2e, 1)} tCO\u2082e net \xB7 submitted for approval.`,
            link: "/app/calculations",
            action: own ? "View" : "Review"
          });
        }
      }
      const waiting = this.enrolments().filter((e) => e.status === "eligible").length;
      if (waiting && this.auth.can("land.manage")) {
        out.push({
          tone: "warn",
          icon: "users",
          title: `${waiting} eligible field${waiting === 1 ? "" : "s"} awaiting confirmation`,
          text: "They passed every eligibility check. Confirm them to count towards the project.",
          link: "project",
          action: "Confirm"
        });
      }
      if (this.auth.can("rules.approve")) {
        for (const p of this.packs().filter((p2) => (p2.outstanding_count ?? 0) === 0)) {
          out.push({
            tone: "warn",
            icon: "scale",
            title: `Rule pack ready to approve: ${p.title}`,
            text: `${p.methodology_code} v${p.methodology_version} rev ${p.revision}${p.created_by ? " \xB7 drafted by " + p.created_by : ""}.`,
            link: "/app/methodology",
            action: "Review"
          });
        }
      }
      if (this.auth.can("payout.approve")) {
        for (const b of this.payouts().filter((b2) => b2.status === "submitted")) {
          const own = b.created_by === me;
          out.push({
            tone: own ? "info" : "warn",
            icon: "hand-coins",
            title: `Payout batch ${b.code} awaiting approval`,
            text: own ? "You prepared this batch, so a different person must approve it." : "Check the farmer lines, then approve.",
            link: "/app/benefits",
            action: own ? "View" : "Review"
          });
        }
      }
      for (const d of (this.readiness()?.dimensions ?? []).filter((d2) => d2.status === "blocking" && d2.key !== "open_blocking_qa").slice(0, 3)) {
        out.push({ tone: "info", icon: "alert", title: d.label, text: d.detail, link: DIM_LINK[d.key] ?? "/app/overview", action: "Open" });
      }
      return out;
    },
    ...ngDevMode ? [{ debugName: "attention" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ringDash(pct) {
    const c = 2 * Math.PI * 27;
    return `${Math.max(0, Math.min(100, pct)) / 100 * c} ${c}`;
  }
  stateLabel(s) {
    return { done: "Done", progress: "In progress", next: "Up next", todo: "Not started" }[s];
  }
  dimLink(key) {
    const l = DIM_LINK[key] ?? "/app/overview";
    return l === "project" ? ["/app/programmes/projects", this.project()?.id] : l;
  }
  openField(id) {
    this.router.navigate(["/app/fields", id]);
  }
  static \u0275fac = function OverviewPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OverviewPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OverviewPage, selectors: [["vc-overview-page"]], decls: 3, vars: 1, consts: [[1, "card"], [1, "welcome", "card"], [3, "rows"], [1, "wtext"], [1, "eyebrow"], [1, "row", 2, "margin-top", "18px"], ["routerLink", "/app/programmes", 1, "btn", "btn-primary", "btn-lg"], ["routerLink", "/app/programmes", 1, "btn", "btn-secondary", "btn-lg"], [1, "wsteps"], ["name", "plus"], [1, "n", "num"], [3, "name", "size"], [1, "hero"], [1, "hl"], [1, "crumbs"], [1, "mono"], [1, "facts"], [3, "status"], ["name", "scale", 3, "size"], [1, "open", 3, "routerLink"], ["name", "arrow-up-right", 3, "size"], [1, "ready"], [1, "rt"], [1, "tiles"], [1, "tile", 3, "routerLink"], [1, "tl"], [1, "tv", "num"], [1, "th"], ["routerLink", "/app/sampling", 1, "tile"], ["routerLink", "/app/calculations", 1, "tile", "accent"], ["cls", "CALCULATED"], ["routerLink", "/app/quality", 1, "tile"], [1, "card", "journey"], [1, "card-head"], [1, "small", "subtle"], [1, "steps"], [3, "class"], [1, "split"], ["routerLink", "/app/fields", 1, "small"], ["icon", "map", "title", "No fields in this project yet", "text", "Enrol mapped fields from the project page to see them here, coloured by crop."], [1, "mapwrap"], [1, "seg"], [1, "card-body", "chartbody"], ["icon", "chart", "title", "No results yet", "text", "Once a calculation has run, the measured change in soil carbon per zone appears here."], [1, "count", "num"], [1, "allclear"], [1, "att"], [3, "routerLink"], ["name", "chevron-right", 3, "size"], ["name", "pin", 3, "size"], [1, "ring"], ["viewBox", "0 0 64 64", "width", "84", "height", "84"], ["cx", "32", "cy", "32", "r", "27", "fill", "none", "stroke", "rgba(255,255,255,.14)", "stroke-width", "6"], ["cx", "32", "cy", "32", "r", "27", "fill", "none", "stroke-width", "6", "stroke-linecap", "round", "transform", "rotate(-90 32 32)"], [1, "pct", "num"], [1, "rl"], [1, "rd"], [1, "rgo", 3, "routerLink"], ["name", "arrow-right", 3, "size"], [1, "dotw"], [1, "dot"], ["name", "check", 3, "size", "stroke"], [1, "sl"], [1, "ss"], [1, "sd"], [1, "bar", 3, "full"], [1, "bar"], [1, "btn", "btn-secondary", 3, "routerLink"], ["height", "360px", 3, "featureClick", "polygons", "points"], [1, "legend"], [1, "num"], [3, "click"], ["height", "300px", 3, "option"], [1, "small", "subtle", "cap"], ["routerLink", "/app/calculations", 1, "btn", "btn-secondary"], ["name", "check-circle", 3, "size"], [1, "ai"], [1, "at"], [1, "btn", "btn-secondary", "btn-sm", 3, "routerLink"]], template: function OverviewPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, OverviewPage_Conditional_0_Template, 2, 1, "div", 0)(1, OverviewPage_Conditional_1_Template, 14, 2, "section", 1)(2, OverviewPage_Conditional_2_Template, 101, 58);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional(!ctx.ctx.loaded() ? 0 : !ctx.ctx.projects().length ? 1 : (tmp_0_0 = ctx.project()) ? 2 : -1, tmp_0_0);
    }
  }, dependencies: [RouterLink, Icon, Badge, DataClass, Empty, Loading, Chart, MapView, NumPipe, HumanPipe], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.welcome[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);\n  gap: 24px;\n  padding: 36px 40px;\n  background:\n    radial-gradient(\n      120% 140% at 0% 0%,\n      var(--%NS%forest-50),\n      #fff 60%);\n}\n@media (max-width: 900px) {\n  .welcome[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.eyebrow[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--%NS%forest-500);\n}\n.welcome[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 28px;\n  margin-top: 8px;\n}\n.welcome[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 10px;\n  color: var(--%NS%text-2);\n  max-width: 520px;\n  font-size: 15px;\n  line-height: 1.6;\n}\n.wsteps[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n  align-content: center;\n}\n.wsteps[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  background: #fff;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  color: var(--%NS%stone-700);\n  font-weight: 500;\n}\n.wsteps[_ngcontent-%COMP%]   .n[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: var(--%NS%sand-200);\n  font-size: 11.5px;\n  color: var(--%NS%stone-600);\n}\n.wsteps[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-500);\n}\n.hero[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 24px;\n  align-items: stretch;\n  padding: 24px 28px;\n  border-radius: var(--%NS%radius-lg);\n  color: #fff;\n  background:\n    radial-gradient(\n      120% 160% at 0% 0%,\n      var(--%NS%forest-600) 0%,\n      var(--%NS%forest-800) 55%,\n      var(--%NS%forest-900) 100%);\n  box-shadow: var(--%NS%shadow);\n}\n.hl[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.crumbs[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  color: rgba(255, 255, 255, 0.66);\n}\n.crumbs[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.8);\n}\n.crumbs[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #fff;\n}\n.hero[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 26px;\n  margin-top: 6px;\n}\n.facts[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px 18px;\n  margin-top: 12px;\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.8);\n}\n.facts[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.facts[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  opacity: 0.75;\n}\n.open[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  color: var(--%NS%forest-200) !important;\n}\n.ready[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 18px;\n  align-items: center;\n  padding: 16px 20px;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.07);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  min-width: 380px;\n  max-width: 460px;\n}\n.ring[_ngcontent-%COMP%] {\n  position: relative;\n  flex: none;\n  width: 84px;\n  height: 84px;\n}\n.ring[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  transition: stroke-dasharray 0.6s ease;\n}\n.pct[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 22px;\n  font-weight: 600;\n}\n.pct[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  opacity: 0.7;\n  margin-left: 1px;\n}\n.rt[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  min-width: 0;\n}\n.rl[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: rgba(255, 255, 255, 0.6);\n}\n.rt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 15px;\n  color: #fff;\n}\n.rd[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: rgba(255, 255, 255, 0.74);\n  line-height: 1.45;\n}\n.rgo[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  margin-top: 4px;\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--%NS%clay-300) !important;\n}\n@media (max-width: 1100px) {\n  .hero[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .ready[_ngcontent-%COMP%] {\n    max-width: none;\n    min-width: 0;\n  }\n}\n.tiles[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 12px;\n}\n@media (max-width: 1200px) {\n  .tiles[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n@media (max-width: 760px) {\n  .tiles[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.tile[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 16px 18px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  box-shadow: var(--%NS%shadow-sm);\n  color: inherit;\n  text-decoration: none !important;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.tile[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%forest-300);\n  box-shadow: var(--%NS%shadow);\n}\n.tl[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--%NS%text-2);\n}\n.tv[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  color: var(--%NS%stone-900);\n  margin-top: 2px;\n}\n.tv[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--%NS%text-3);\n  margin-left: 5px;\n  letter-spacing: 0;\n}\n.th[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.tile.accent[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--%NS%sand-50),\n      var(--%NS%forest-50));\n  border-color: var(--%NS%forest-200);\n}\n.tile.accent[_ngcontent-%COMP%]   .tv[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-800);\n}\n.tile.alarm[_ngcontent-%COMP%] {\n  border-color: #f3c7c3;\n  background:\n    linear-gradient(\n      180deg,\n      #fff,\n      var(--%NS%red-100));\n}\n.tile.alarm[_ngcontent-%COMP%]   .tv[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.steps[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 22px 20px 20px;\n  display: grid;\n  grid-template-columns: repeat(8, minmax(0, 1fr));\n}\n@media (max-width: 1000px) {\n  .steps[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n    row-gap: 22px;\n  }\n}\n.steps[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  position: relative;\n}\n.steps[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 3px;\n  padding: 0 6px;\n  color: inherit;\n  text-decoration: none !important;\n}\n.dotw[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  padding: 0 6px;\n  background: var(--%NS%surface);\n}\n.dot[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  border: 2px solid var(--%NS%stone-200);\n  background: var(--%NS%surface);\n  color: var(--%NS%stone-400);\n  transition: transform 0.12s;\n}\n.steps[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   .dot[_ngcontent-%COMP%] {\n  transform: scale(1.06);\n}\n.bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 18px;\n  left: calc(50% + 24px);\n  right: calc(-50% + 24px);\n  height: 2px;\n  background: var(--%NS%stone-200);\n  border-radius: 1px;\n}\n.bar.full[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-400);\n}\n@media (max-width: 1000px) {\n  .steps[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(4)   .bar[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.sl[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  font-weight: 600;\n  font-size: 13.5px;\n  color: var(--%NS%stone-800);\n}\n.ss[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n}\n.sd[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  line-height: 1.35;\n  max-width: 150px;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\nli.done[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  border-color: var(--%NS%forest-600);\n  color: #fff;\n}\nli.done[_ngcontent-%COMP%]   .ss[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n}\nli.progress[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  border-color: var(--%NS%amber-600);\n  color: var(--%NS%amber-600);\n  background: var(--%NS%amber-100);\n}\nli.progress[_ngcontent-%COMP%]   .ss[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\nli.next[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  border-color: var(--%NS%clay-500);\n  color: var(--%NS%clay-600);\n  background: var(--%NS%clay-50);\n  box-shadow: 0 0 0 4px var(--%NS%clay-100);\n}\nli.next[_ngcontent-%COMP%]   .ss[_ngcontent-%COMP%] {\n  color: var(--%NS%clay-600);\n}\n.split[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);\n  gap: 16px;\n}\n@media (max-width: 1100px) {\n  .split[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.card-head[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.mapwrap[_ngcontent-%COMP%] {\n  position: relative;\n  padding: 12px;\n}\n.legend[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px 14px;\n  margin-top: 10px;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n}\n.legend[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.legend[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n}\n.legend[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--%NS%text-3);\n}\n.chartbody[_ngcontent-%COMP%] {\n  padding-top: 12px;\n}\n.cap[_ngcontent-%COMP%] {\n  margin-top: 6px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  padding: 2px;\n  gap: 2px;\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  height: 26px;\n  padding: 0 10px;\n  border: 0;\n  background: none;\n  border-radius: 6px;\n  font: 500 12.5px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%forest-700);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.count[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  min-width: 22px;\n  height: 20px;\n  padding: 0 6px;\n  border-radius: 10px;\n  background: var(--%NS%clay-100);\n  color: var(--%NS%clay-700);\n  font-size: 12px;\n  font-weight: 600;\n}\n.allclear[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 18px 20px;\n  color: var(--%NS%forest-700);\n}\n.att[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.att[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 12px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.att[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.ai[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  flex: none;\n}\n.danger[_ngcontent-%COMP%]   .ai[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n  color: var(--%NS%red-600);\n}\n.warn[_ngcontent-%COMP%]   .ai[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n}\n.info[_ngcontent-%COMP%]   .ai[_ngcontent-%COMP%] {\n  background: var(--%NS%sky-100);\n  color: var(--%NS%sky-600);\n}\n.at[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  min-width: 0;\n}\n.at[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n}\n.at[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n/*# sourceMappingURL=overview.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverviewPage, [{
    type: Component,
    args: [{ selector: "vc-overview-page", imports: [RouterLink, Icon, Badge, DataClass, Empty, Loading, Chart, MapView, NumPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (!ctx.loaded()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (!ctx.projects().length) {
      <section class="welcome card">
        <div class="wtext">
          <span class="eyebrow">Welcome, {{ firstName() }}</span>
          <h1>Start by creating a programme</h1>
          <p>A programme sets the region, eligible crops and commercial terms. Inside it, a project follows one methodology \u2014 from enrolling fields to paying farmers.</p>
          <div class="row" style="margin-top:18px">
            @if (auth.can('programmes.manage')) { <a class="btn btn-primary btn-lg" routerLink="/app/programmes"><vc-icon name="plus" />Create a programme</a> }
            @else { <a class="btn btn-secondary btn-lg" routerLink="/app/programmes">View programmes</a> }
          </div>
        </div>
        <ol class="wsteps">
          @for (s of journeyDef; track s.key; let i = $index) {
            <li><span class="n num">{{ i + 1 }}</span><vc-icon [name]="s.icon" [size]="16" />{{ s.label }}</li>
          }
        </ol>
      </section>
    } @else if (project(); as p) {
      <!-- hero -->
      <section class="hero">
        <div class="hl">
          <div class="crumbs">
            @if (programme(); as prog) { <a [routerLink]="['/app/programmes', prog.id]">{{ prog.name }}</a><vc-icon name="chevron-right" [size]="13" /> }
            <span class="mono">{{ p.code }}</span>
          </div>
          <h1>{{ p.name }}</h1>
          <div class="facts">
            <vc-badge [status]="p.status" />
            <span><vc-icon name="scale" [size]="14" />{{ p.methodology_code }} v{{ p.methodology_version }}</span>
            @if (programme()?.region) { <span><vc-icon name="pin" [size]="14" />{{ programme()!.region }}</span> }
            <a [routerLink]="['/app/programmes/projects', p.id]" class="open">Project details<vc-icon name="arrow-up-right" [size]="13" /></a>
          </div>
        </div>
        <div class="ready">
          @if (readiness(); as r) {
            <div class="ring" [attr.aria-label]="'Readiness ' + r.score_pct + '%'">
              <svg viewBox="0 0 64 64" width="84" height="84">
                <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="6" />
                <circle cx="32" cy="32" r="27" fill="none" [attr.stroke]="r.ready ? '#86b797' : '#e7a57b'" stroke-width="6" stroke-linecap="round"
                  [attr.stroke-dasharray]="ringDash(r.score_pct)" transform="rotate(-90 32 32)" />
              </svg>
              <span class="pct num">{{ r.score_pct | num: 0 }}<small>%</small></span>
            </div>
            <div class="rt">
              <span class="rl">Verification readiness</span>
              @if (nextBlocker(); as b) {
                <strong>Next: {{ b.label }}</strong>
                <span class="rd">{{ b.detail }}</span>
                <a [routerLink]="dimLink(b.key)" class="rgo">Resolve<vc-icon name="arrow-right" [size]="13" /></a>
              } @else {
                <strong>Ready for verification</strong>
                <span class="rd">No blocking items. {{ okCount() }} of {{ r.dimensions.length }} checks fully complete.</span>
              }
            </div>
          } @else if (readinessFailed()) {
            <div class="rt"><span class="rl">Verification readiness</span><span class="rd">Not available for your role.</span></div>
          } @else {
            <div class="rt"><span class="rl">Verification readiness</span><span class="rd">Working it out\u2026</span></div>
          }
        </div>
      </section>

      <!-- stats -->
      <div class="tiles">
        <a class="tile" [routerLink]="['/app/programmes/projects', p.id]">
          <span class="tl">Farmers enrolled</span>
          <span class="tv num">{{ enrolStats().farmers | num: 0 }}</span>
          <span class="th">{{ enrolStats().fields | num: 0 }} fields \xB7 {{ enrolStats().pending }} awaiting decision</span>
        </a>
        <a class="tile" [routerLink]="['/app/programmes/projects', p.id]">
          <span class="tl">Area enrolled</span>
          <span class="tv num">{{ enrolStats().area | num: 1 }}<small>ha</small></span>
          <span class="th">Programme-wide {{ summary() ? (summary()!.hectares_enrolled | num: 1) + ' ha' : '\u2014' }}</span>
        </a>
        <a class="tile" routerLink="/app/sampling">
          <span class="tl">Soil cores collected</span>
          <span class="tv num">{{ sampling().collected | num: 0 }}<small>of {{ sampling().planned | num: 0 }}</small></span>
          <span class="th">{{ sampling().campaigns }} campaign{{ sampling().campaigns === 1 ? '' : 's' }}</span>
        </a>
        <a class="tile accent" routerLink="/app/calculations">
          <span class="tl">Net credits <vc-dc cls="CALCULATED" /></span>
          @if (latestApproved(); as run) {
            <span class="tv num">{{ run.net_t_co2e | num: 1 }}<small>tCO\u2082e</small></span>
            <span class="th">Approved \xB7 {{ run.period_label }}</span>
          } @else {
            <span class="tv num">\u2014</span>
            <span class="th">{{ runs().length ? 'No approved calculation yet' : 'No calculation run yet' }}</span>
          }
        </a>
        <a class="tile" routerLink="/app/quality" [class.alarm]="(qa()?.blocking ?? 0) > 0">
          <span class="tl">Open blocking issues</span>
          <span class="tv num">{{ qa() ? qa()!.blocking : '\u2014' }}</span>
          <span class="th">{{ qaHint() }}</span>
        </a>
      </div>

      <!-- journey -->
      <section class="card journey">
        <div class="card-head"><h3>Journey</h3><span class="small subtle">From enrolment to farmer payment. Each step reflects this project\u2019s live readiness checks.</span></div>
        <ol class="steps">
          @for (s of steps(); track s.key; let i = $index; let last = $last) {
            <li [class]="s.state">
              <a [routerLink]="s.link === 'project' ? ['/app/programmes/projects', p.id] : s.link">
                <span class="dotw"><span class="dot">
                  @switch (s.state) {
                    @case ('done') { <vc-icon name="check" [size]="15" [stroke]="2.4" /> }
                    @default { <vc-icon [name]="s.icon" [size]="15" /> }
                  }
                </span></span>
                <span class="sl">{{ s.label }}</span>
                <span class="ss">{{ stateLabel(s.state) }}</span>
                <span class="sd">{{ s.detail }}</span>
              </a>
              @if (!last) { <span class="bar" [class.full]="s.state === 'done'"></span> }
            </li>
          }
        </ol>
      </section>

      <div class="split">
        <!-- map -->
        <section class="card">
          <div class="card-head">
            <h3>Enrolled fields</h3>
            <a class="small" routerLink="/app/fields">Open map<vc-icon name="arrow-up-right" [size]="12" /></a>
          </div>
          @if (fields() === null) {
            <vc-loading [rows]="5" />
          } @else if (!fields()!.features.length) {
            <vc-empty icon="map" title="No fields in this project yet" text="Enrol mapped fields from the project page to see them here, coloured by crop.">
              <a class="btn btn-secondary" [routerLink]="['/app/programmes/projects', p.id]">Enrol fields</a>
            </vc-empty>
          } @else {
            <div class="mapwrap">
              <vc-map [polygons]="coloured()" [points]="centroids()" height="360px" (featureClick)="openField($event.id)" />
              <div class="legend">
                @for (l of cropLegend(); track l.code) {
                  <span><i [style.background]="l.color"></i>{{ l.name }} <b class="num">{{ l.count }}</b></span>
                }
              </div>
            </div>
          }
        </section>

        <!-- chart -->
        <section class="card">
          <div class="card-head">
            <h3>{{ chartMode() === 'strata' ? 'Soil-carbon change by zone' : 'Net credits by period' }}</h3>
            @if (strataOption() && periodOption()) {
              <div class="seg">
                <button [class.on]="chartMode() === 'strata'" (click)="chartMode.set('strata')">By zone</button>
                <button [class.on]="chartMode() === 'period'" (click)="chartMode.set('period')">By period</button>
              </div>
            }
            <vc-dc cls="CALCULATED" />
          </div>
          @if (chartOption(); as opt) {
            <div class="card-body chartbody">
              <vc-chart [option]="opt" height="300px" />
              @if (chartMode() === 'strata' && latestDetail(); as d) {
                <p class="small subtle cap">Change in soil organic carbon, tonnes of carbon per hectare, from run {{ d.period_label }} ({{ d.status | human }}). Whiskers show \xB11 standard error.</p>
              } @else {
                <p class="small subtle cap">Net credits after uncertainty and buffer deductions, latest run per period.</p>
              }
            </div>
          } @else {
            <vc-empty icon="chart" title="No results yet" text="Once a calculation has run, the measured change in soil carbon per zone appears here." >
              <a class="btn btn-secondary" routerLink="/app/calculations">Go to calculations</a>
            </vc-empty>
          }
        </section>
      </div>

      <!-- attention -->
      <section class="card">
        <div class="card-head"><h3>Needs attention</h3>@if (attention().length) { <span class="count num">{{ attention().length }}</span> }</div>
        @if (!attention().length) {
          <div class="allclear"><vc-icon name="check-circle" [size]="18" />Nothing needs your attention right now.</div>
        } @else {
          <ul class="att">
            @for (a of attention(); track a.title) {
              <li [class]="a.tone">
                <span class="ai"><vc-icon [name]="a.icon" [size]="16" /></span>
                <div class="at"><strong>{{ a.title }}</strong><span>{{ a.text }}</span></div>
                <a class="btn btn-secondary btn-sm" [routerLink]="a.link === 'project' ? ['/app/programmes/projects', p.id] : a.link">{{ a.action }}</a>
              </li>
            }
          </ul>
        }
      </section>
    }
  `, styles: ["/* angular:styles/component:scss;10881b6f6956448c;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\overview\\overview.page.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.welcome {\n  display: grid;\n  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);\n  gap: 24px;\n  padding: 36px 40px;\n  background:\n    radial-gradient(\n      120% 140% at 0% 0%,\n      var(--forest-50),\n      #fff 60%);\n}\n@media (max-width: 900px) {\n  .welcome {\n    grid-template-columns: 1fr;\n  }\n}\n.eyebrow {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--forest-500);\n}\n.welcome h1 {\n  font-size: 28px;\n  margin-top: 8px;\n}\n.welcome p {\n  margin-top: 10px;\n  color: var(--text-2);\n  max-width: 520px;\n  font-size: 15px;\n  line-height: 1.6;\n}\n.wsteps {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n  align-content: center;\n}\n.wsteps li {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  background: #fff;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  color: var(--stone-700);\n  font-weight: 500;\n}\n.wsteps .n {\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: var(--sand-200);\n  font-size: 11.5px;\n  color: var(--stone-600);\n}\n.wsteps vc-icon {\n  color: var(--forest-500);\n}\n.hero {\n  display: flex;\n  gap: 24px;\n  align-items: stretch;\n  padding: 24px 28px;\n  border-radius: var(--radius-lg);\n  color: #fff;\n  background:\n    radial-gradient(\n      120% 160% at 0% 0%,\n      var(--forest-600) 0%,\n      var(--forest-800) 55%,\n      var(--forest-900) 100%);\n  box-shadow: var(--shadow);\n}\n.hl {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.crumbs {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  color: rgba(255, 255, 255, 0.66);\n}\n.crumbs a {\n  color: rgba(255, 255, 255, 0.8);\n}\n.crumbs a:hover {\n  color: #fff;\n}\n.hero h1 {\n  color: #fff;\n  font-size: 26px;\n  margin-top: 6px;\n}\n.facts {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px 18px;\n  margin-top: 12px;\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.8);\n}\n.facts span {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.facts vc-icon {\n  opacity: 0.75;\n}\n.open {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  color: var(--forest-200) !important;\n}\n.ready {\n  display: flex;\n  gap: 18px;\n  align-items: center;\n  padding: 16px 20px;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.07);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  min-width: 380px;\n  max-width: 460px;\n}\n.ring {\n  position: relative;\n  flex: none;\n  width: 84px;\n  height: 84px;\n}\n.ring circle {\n  transition: stroke-dasharray 0.6s ease;\n}\n.pct {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 22px;\n  font-weight: 600;\n}\n.pct small {\n  font-size: 12px;\n  opacity: 0.7;\n  margin-left: 1px;\n}\n.rt {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  min-width: 0;\n}\n.rl {\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: rgba(255, 255, 255, 0.6);\n}\n.rt strong {\n  font-size: 15px;\n  color: #fff;\n}\n.rd {\n  font-size: 12.5px;\n  color: rgba(255, 255, 255, 0.74);\n  line-height: 1.45;\n}\n.rgo {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  margin-top: 4px;\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--clay-300) !important;\n}\n@media (max-width: 1100px) {\n  .hero {\n    flex-direction: column;\n  }\n  .ready {\n    max-width: none;\n    min-width: 0;\n  }\n}\n.tiles {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 12px;\n}\n@media (max-width: 1200px) {\n  .tiles {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n@media (max-width: 760px) {\n  .tiles {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.tile {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 16px 18px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow-sm);\n  color: inherit;\n  text-decoration: none !important;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.tile:hover {\n  border-color: var(--forest-300);\n  box-shadow: var(--shadow);\n}\n.tl {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--text-2);\n}\n.tv {\n  font-size: 26px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  color: var(--stone-900);\n  margin-top: 2px;\n}\n.tv small {\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--text-3);\n  margin-left: 5px;\n  letter-spacing: 0;\n}\n.th {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.tile.accent {\n  background:\n    linear-gradient(\n      135deg,\n      var(--sand-50),\n      var(--forest-50));\n  border-color: var(--forest-200);\n}\n.tile.accent .tv {\n  color: var(--forest-800);\n}\n.tile.alarm {\n  border-color: #f3c7c3;\n  background:\n    linear-gradient(\n      180deg,\n      #fff,\n      var(--red-100));\n}\n.tile.alarm .tv {\n  color: var(--red-600);\n}\n.steps {\n  list-style: none;\n  margin: 0;\n  padding: 22px 20px 20px;\n  display: grid;\n  grid-template-columns: repeat(8, minmax(0, 1fr));\n}\n@media (max-width: 1000px) {\n  .steps {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n    row-gap: 22px;\n  }\n}\n.steps li {\n  position: relative;\n}\n.steps a {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 3px;\n  padding: 0 6px;\n  color: inherit;\n  text-decoration: none !important;\n}\n.dotw {\n  position: relative;\n  z-index: 1;\n  padding: 0 6px;\n  background: var(--surface);\n}\n.dot {\n  display: grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  border: 2px solid var(--stone-200);\n  background: var(--surface);\n  color: var(--stone-400);\n  transition: transform 0.12s;\n}\n.steps a:hover .dot {\n  transform: scale(1.06);\n}\n.bar {\n  position: absolute;\n  top: 18px;\n  left: calc(50% + 24px);\n  right: calc(-50% + 24px);\n  height: 2px;\n  background: var(--stone-200);\n  border-radius: 1px;\n}\n.bar.full {\n  background: var(--forest-400);\n}\n@media (max-width: 1000px) {\n  .steps li:nth-child(4) .bar {\n    display: none;\n  }\n}\n.sl {\n  margin-top: 6px;\n  font-weight: 600;\n  font-size: 13.5px;\n  color: var(--stone-800);\n}\n.ss {\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  color: var(--text-3);\n}\n.sd {\n  font-size: 12px;\n  color: var(--text-3);\n  line-height: 1.35;\n  max-width: 150px;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\nli.done .dot {\n  background: var(--forest-600);\n  border-color: var(--forest-600);\n  color: #fff;\n}\nli.done .ss {\n  color: var(--forest-600);\n}\nli.progress .dot {\n  border-color: var(--amber-600);\n  color: var(--amber-600);\n  background: var(--amber-100);\n}\nli.progress .ss {\n  color: var(--amber-600);\n}\nli.next .dot {\n  border-color: var(--clay-500);\n  color: var(--clay-600);\n  background: var(--clay-50);\n  box-shadow: 0 0 0 4px var(--clay-100);\n}\nli.next .ss {\n  color: var(--clay-600);\n}\n.split {\n  display: grid;\n  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);\n  gap: 16px;\n}\n@media (max-width: 1100px) {\n  .split {\n    grid-template-columns: 1fr;\n  }\n}\n.card-head a {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.mapwrap {\n  position: relative;\n  padding: 12px;\n}\n.legend {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px 14px;\n  margin-top: 10px;\n  font-size: 12.5px;\n  color: var(--stone-700);\n}\n.legend span {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.legend i {\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n}\n.legend b {\n  font-weight: 500;\n  color: var(--text-3);\n}\n.chartbody {\n  padding-top: 12px;\n}\n.cap {\n  margin-top: 6px;\n}\n.seg {\n  display: inline-flex;\n  padding: 2px;\n  gap: 2px;\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n}\n.seg button {\n  height: 26px;\n  padding: 0 10px;\n  border: 0;\n  background: none;\n  border-radius: 6px;\n  font: 500 12.5px var(--font);\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--surface);\n  color: var(--forest-700);\n  box-shadow: var(--shadow-sm);\n}\n.count {\n  display: inline-grid;\n  place-items: center;\n  min-width: 22px;\n  height: 20px;\n  padding: 0 6px;\n  border-radius: 10px;\n  background: var(--clay-100);\n  color: var(--clay-700);\n  font-size: 12px;\n  font-weight: 600;\n}\n.allclear {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 18px 20px;\n  color: var(--forest-700);\n}\n.att {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.att li {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 12px 20px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.att li:last-child {\n  border-bottom: 0;\n}\n.ai {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  flex: none;\n}\n.danger .ai {\n  background: var(--red-100);\n  color: var(--red-600);\n}\n.warn .ai {\n  background: var(--amber-100);\n  color: var(--amber-600);\n}\n.info .ai {\n  background: var(--sky-100);\n  color: var(--sky-600);\n}\n.at {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  min-width: 0;\n}\n.at strong {\n  font-size: 13.5px;\n}\n.at span {\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n/*# sourceMappingURL=overview.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OverviewPage, { className: "OverviewPage", filePath: "src/app/features/overview/overview.page.ts", lineNumber: 351 });
})();
function round(v) {
  return Math.round(v * 1e3) / 1e3;
}
function esc(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

// src/app/features/overview/overview.routes.ts
var overview_routes_default = [{ path: "", component: OverviewPage, title: "Overview \xB7 Varsapradaya Carbon" }];
export {
  overview_routes_default as default
};
//# debugId=3467be62-00ea-5c57-8fed-e9494b4b523a
//# sourceMappingURL=chunk-BG3PRNF4.js.map
