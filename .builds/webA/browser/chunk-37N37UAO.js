import {
  ProvenanceTree
} from "./chunk-4SQEW4QH.js";
import {
  openBlob,
  saveBlob
} from "./chunk-5SRO2YLJ.js";
import {
  Brand
} from "./chunk-PLD4FPAY.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  RadioControlValueAccessor
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  HumanPipe,
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  Badge,
  Callout,
  DataClass,
  Empty,
  ErrorBox,
  Hash,
  Loading,
  Modal
} from "./chunk-3GJ7OF6Y.js";
import {
  ChangeDetectionStrategy,
  Component,
  HttpClient,
  HttpHeaders,
  Icon,
  Injectable,
  Input,
  NgTemplateOutlet,
  Output,
  __spreadProps,
  __spreadValues,
  asApiError,
  catchError,
  computed,
  effect,
  inject,
  input,
  output,
  setClassMetadata,
  signal,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementContainer,
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
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate4,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/verifier/evidence-explorer.ts
var _c0 = (a0, a1) => ({ type: "field", id: a0, label: a1 });
var _c1 = (a0) => ({ $implicit: a0 });
var _c2 = () => [];
var _c3 = (a0, a1) => ({ type: "sample", id: a0, label: a1 });
var _c4 = (a0, a1) => ({ type: "custody_event", id: a0, label: a1 });
var _c5 = (a0, a1) => ({ type: "lab_result", id: a0, label: a1 });
var _c6 = (a0, a1) => ({ type: "evidence", id: a0, label: a1 });
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item["id"];
var _forTrack2 = ($index, $item) => $item.id;
function EvidenceExplorer_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function EvidenceExplorer_For_3_Template_button_click_0_listener() {
      const s_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.sec.set(s_r2.key);
      return \u0275\u0275resetView(ctx_r2.q.set(""));
    });
    \u0275\u0275element(1, "vc-icon", 15);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 16);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r2.sec() === s_r2.key);
    \u0275\u0275advance();
    \u0275\u0275property("name", s_r2.icon)("size", 15);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r2.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.count(s_r2.key));
  }
}
function EvidenceExplorer_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 11);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("text", ctx_r2.q() ? "No records match your search." : "This section of the package is empty.");
  }
}
function EvidenceExplorer_Conditional_16_Case_1_For_17_ng_container_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EvidenceExplorer_Conditional_16_Case_1_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 18);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td", 19);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "num");
    \u0275\u0275elementStart(9, "span", 20);
    \u0275\u0275text(10, "ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 17);
    \u0275\u0275template(22, EvidenceExplorer_Conditional_16_Case_1_For_17_ng_container_22_Template, 1, 0, "ng-container", 21);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r4 = ctx.$implicit;
    \u0275\u0275nextContext(3);
    const askBtn_r5 = \u0275\u0275reference(19);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r4["code"]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r4["name"]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(8, 9, r_r4["area_ha"], 2), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r4["crop_code"] || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 12, r_r4["soil_type"]));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("v", r_r4["version"]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 14, r_r4["status"]));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngTemplateOutlet", askBtn_r5)("ngTemplateOutletContext", \u0275\u0275pureFunction1(19, _c1, \u0275\u0275pureFunction2(16, _c0, r_r4["id"], "Field " + r_r4["code"])));
  }
}
function EvidenceExplorer_Conditional_16_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "thead")(1, "tr")(2, "th");
    \u0275\u0275text(3, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 17);
    \u0275\u0275text(5, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Crop");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Soil type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Version");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "tbody");
    \u0275\u0275repeaterCreate(16, EvidenceExplorer_Conditional_16_Case_1_For_17_Template, 23, 21, "tr", null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(16);
    \u0275\u0275repeater(ctx_r2.rows());
  }
}
function EvidenceExplorer_Conditional_16_Case_2_For_21_For_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function EvidenceExplorer_Conditional_16_Case_2_For_21_For_30_Template_button_click_0_listener() {
      const ctx_r6 = \u0275\u0275restoreView(_r6);
      const p_r8 = ctx_r6.$implicit;
      const \u0275$index_185_r9 = ctx_r6.$index;
      const r_r10 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.open.emit({ id: p_r8.id, filename: r_r10["code"] + "-photo-" + (\u0275$index_185_r9 + 1) }));
    });
    \u0275\u0275element(1, "vc-icon", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = ctx.$implicit;
    const \u0275$index_185_r9 = ctx.$index;
    \u0275\u0275property("title", p_r8.sha256);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275$index_185_r9 + 1);
  }
}
function EvidenceExplorer_Conditional_16_Case_2_For_21_ForEmpty_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function EvidenceExplorer_Conditional_16_Case_2_For_21_ng_container_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EvidenceExplorer_Conditional_16_Case_2_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, "\xA0");
    \u0275\u0275element(5, "vc-dc", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 24);
    \u0275\u0275text(7);
    \u0275\u0275elementStart(8, "div", 18);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 25);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 24);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 25);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 19);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "num");
    \u0275\u0275elementStart(20, "span", 20);
    \u0275\u0275text(21, "m");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td", 19);
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "num");
    \u0275\u0275elementStart(25, "span", 20);
    \u0275\u0275text(26, "cm");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "td")(28, "div", 26);
    \u0275\u0275repeaterCreate(29, EvidenceExplorer_Conditional_16_Case_2_For_21_For_30_Template, 3, 3, "button", 27, _forTrack2, false, EvidenceExplorer_Conditional_16_Case_2_For_21_ForEmpty_31_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "td", 17);
    \u0275\u0275template(33, EvidenceExplorer_Conditional_16_Case_2_For_21_ng_container_33_Template, 1, 0, "ng-container", 21);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r10 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    const askBtn_r5 = \u0275\u0275reference(19);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r10["code"]);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.campaignCode(r_r10["campaign_id"]));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.campaignKindOnly(r_r10["campaign_id"]));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.siteCode(r_r10["site_id"]));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(14, 11, r_r10["collected_at"], true));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.gps(r_r10));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\xB1 ", \u0275\u0275pipeBind2(19, 14, r_r10["gps_accuracy_m"], 1), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(24, 17, r_r10["depth_reached_cm"], 0), " ");
    \u0275\u0275advance(6);
    \u0275\u0275repeater(r_r10["photos"] ?? \u0275\u0275pureFunction0(20, _c2));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngTemplateOutlet", askBtn_r5)("ngTemplateOutletContext", \u0275\u0275pureFunction1(24, _c1, \u0275\u0275pureFunction2(21, _c3, r_r10["id"], "Core " + r_r10["code"])));
  }
}
function EvidenceExplorer_Conditional_16_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "thead")(1, "tr")(2, "th");
    \u0275\u0275text(3, "Core");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th");
    \u0275\u0275text(5, "Campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Site");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Collected");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "GPS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 17);
    \u0275\u0275text(13, "Accuracy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 17);
    \u0275\u0275text(15, "Depth");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Photos");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, EvidenceExplorer_Conditional_16_Case_2_For_21_Template, 34, 26, "tr", null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(20);
    \u0275\u0275repeater(ctx_r2.rows());
  }
}
function EvidenceExplorer_Conditional_16_Case_3_For_19_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1, "correction");
    \u0275\u0275elementEnd();
  }
}
function EvidenceExplorer_Conditional_16_Case_3_For_19_ng_container_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EvidenceExplorer_Conditional_16_Case_3_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "human");
    \u0275\u0275conditionalCreate(6, EvidenceExplorer_Conditional_16_Case_3_For_19_Conditional_6_Template, 2, 0, "span", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 24);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td")(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td")(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td", 6);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 17);
    \u0275\u0275template(21, EvidenceExplorer_Conditional_16_Case_3_For_19_ng_container_21_Template, 1, 0, "ng-container", 21);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r11 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    const askBtn_r5 = \u0275\u0275reference(19);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.sampleCode(r_r11["sample_id"]));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 14, r_r11["event"]));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r11["corrects_event_id"] ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 16, r_r11["occurred_at"], true));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r11["location"] || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r2.yn(r_r11["seal_intact"]));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.ynText(r_r11["seal_intact"], "Intact", "Broken"));
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r2.yn(r_r11["count_matches"]));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.ynText(r_r11["count_matches"], "Matches", "Mismatch"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r11["notes"] || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", askBtn_r5)("ngTemplateOutletContext", \u0275\u0275pureFunction1(22, _c1, \u0275\u0275pureFunction2(19, _c4, r_r11["id"], "Custody event for " + ctx_r2.sampleCode(r_r11["sample_id"]))));
  }
}
function EvidenceExplorer_Conditional_16_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "thead")(1, "tr")(2, "th");
    \u0275\u0275text(3, "Core");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th");
    \u0275\u0275text(5, "Event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "When");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Where");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Seal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Count");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, EvidenceExplorer_Conditional_16_Case_3_For_19_Template, 22, 24, "tr", null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r2.rows());
  }
}
function EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("v", r_r12["version"]);
  }
}
function EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275element(1, "vc-icon", 37);
    \u0275\u0275text(2, "Used");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1, "No");
    \u0275\u0275elementEnd();
  }
}
function EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_27_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-hash", 38);
  }
  if (rf & 2) {
    \u0275\u0275property("value", ctx);
  }
}
function EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275conditionalCreate(1, EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_27_Conditional_1_Template, 1, 1, "vc-hash", 38);
    \u0275\u0275elementStart(2, "button", 39);
    \u0275\u0275listener("click", function EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_27_Template_button_click_2_listener() {
      const cid_r14 = \u0275\u0275restoreView(_r13);
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.open.emit({ id: cid_r14, filename: ctx_r2.doc(cid_r14)?.filename ?? "certificate" }));
    });
    \u0275\u0275element(3, "vc-icon", 40);
    \u0275\u0275text(4, "Open");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_15_0;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_15_0 = ctx_r2.doc(ctx)?.sha256) ? 1 : -1, tmp_15_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
  }
}
function EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function EvidenceExplorer_Conditional_16_Case_4_For_21_ng_container_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EvidenceExplorer_Conditional_16_Case_4_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275conditionalCreate(5, EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_5_Template, 2, 1, "span", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 19)(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, "\xA0");
    \u0275\u0275elementStart(11, "span", 20);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275text(13, "\xA0");
    \u0275\u0275element(14, "vc-dc", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 34);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 24);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td");
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td");
    \u0275\u0275conditionalCreate(24, EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_24_Template, 3, 1, "span", 35)(25, EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_25_Template, 2, 0, "span", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "td");
    \u0275\u0275conditionalCreate(27, EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_27_Template, 5, 2, "div", 36)(28, EvidenceExplorer_Conditional_16_Case_4_For_21_Conditional_28_Template, 2, 0, "span", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "td", 17);
    \u0275\u0275template(30, EvidenceExplorer_Conditional_16_Case_4_For_21_ng_container_30_Template, 1, 0, "ng-container", 21);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_23_0;
    const r_r12 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    const askBtn_r5 = \u0275\u0275reference(19);
    \u0275\u0275classProp("unused", !r_r12["used_in_calculation"]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r12["layer_code"]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.analyte(r_r12["analyte"]), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r12["version"] > 1 ? 5 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 14, r_r12["value"], 3));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r12["unit"]);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r12["method"] || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 17, r_r12["analysed_on"]));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(22, 19, r_r12["status"]));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(r_r12["used_in_calculation"] ? 24 : 25);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_23_0 = r_r12["certificate_id"]) ? 27 : 28, tmp_23_0);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngTemplateOutlet", askBtn_r5)("ngTemplateOutletContext", \u0275\u0275pureFunction1(24, _c1, \u0275\u0275pureFunction2(21, _c5, r_r12["id"], ctx_r2.analyte(r_r12["analyte"]) + " for layer " + r_r12["layer_code"])));
  }
}
function EvidenceExplorer_Conditional_16_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "thead")(1, "tr")(2, "th");
    \u0275\u0275text(3, "Layer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th");
    \u0275\u0275text(5, "Analyte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 17);
    \u0275\u0275text(7, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Analysed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Used");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Certificate");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275repeaterCreate(20, EvidenceExplorer_Conditional_16_Case_4_For_21_Template, 31, 26, "tr", 32, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(20);
    \u0275\u0275repeater(ctx_r2.rows());
  }
}
function EvidenceExplorer_Conditional_16_Case_5_For_15_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-hash", 38);
  }
  if (rf & 2) {
    const r_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", r_r15["sha256"]);
  }
}
function EvidenceExplorer_Conditional_16_Case_5_For_15_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275text(1, "Missing");
    \u0275\u0275elementEnd();
  }
}
function EvidenceExplorer_Conditional_16_Case_5_For_15_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function EvidenceExplorer_Conditional_16_Case_5_For_15_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const r_r15 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.open.emit({ id: r_r15["id"], filename: r_r15["filename"] }));
    });
    \u0275\u0275element(1, "vc-icon", 40);
    \u0275\u0275text(2, "Open");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function EvidenceExplorer_Conditional_16_Case_5_For_15_ng_container_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EvidenceExplorer_Conditional_16_Case_5_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 18);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 19);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275conditionalCreate(12, EvidenceExplorer_Conditional_16_Case_5_For_15_Conditional_12_Template, 1, 1, "vc-hash", 38)(13, EvidenceExplorer_Conditional_16_Case_5_For_15_Conditional_13_Template, 2, 0, "span", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 6);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 19);
    \u0275\u0275conditionalCreate(17, EvidenceExplorer_Conditional_16_Case_5_For_15_Conditional_17_Template, 3, 1, "button", 42);
    \u0275\u0275template(18, EvidenceExplorer_Conditional_16_Case_5_For_15_ng_container_18_Template, 1, 0, "ng-container", 21);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r15 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    const askBtn_r5 = \u0275\u0275reference(19);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r15["filename"] ?? "Missing file");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r15["mime_type"]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 9, r_r15["kind"]));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.kb(r_r15["size_bytes"]));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r15["sha256"] ? 12 : 13);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", (r_r15["referenced_by"] ?? \u0275\u0275pureFunction0(11, _c2)).length, " record(s)");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!r_r15["missing"] ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", askBtn_r5)("ngTemplateOutletContext", \u0275\u0275pureFunction1(15, _c1, \u0275\u0275pureFunction2(12, _c6, r_r15["id"], "File " + (r_r15["filename"] ?? r_r15["id"]))));
  }
}
function EvidenceExplorer_Conditional_16_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "thead")(1, "tr")(2, "th");
    \u0275\u0275text(3, "File");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th");
    \u0275\u0275text(5, "Kind");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 17);
    \u0275\u0275text(7, "Size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Fingerprint (SHA-256)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Referenced by");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "tbody");
    \u0275\u0275repeaterCreate(14, EvidenceExplorer_Conditional_16_Case_5_For_15_Template, 19, 17, "tr", null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r2.rows());
  }
}
function EvidenceExplorer_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 12);
    \u0275\u0275conditionalCreate(1, EvidenceExplorer_Conditional_16_Case_1_Template, 18, 0)(2, EvidenceExplorer_Conditional_16_Case_2_Template, 22, 0)(3, EvidenceExplorer_Conditional_16_Case_3_Template, 20, 0)(4, EvidenceExplorer_Conditional_16_Case_4_Template, 22, 0)(5, EvidenceExplorer_Conditional_16_Case_5_Template, 16, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_2_0 = ctx_r2.sec()) === "fields" ? 1 : tmp_2_0 === "samples" ? 2 : tmp_2_0 === "custody_events" ? 3 : tmp_2_0 === "lab_results" ? 4 : tmp_2_0 === "document_index" ? 5 : -1);
  }
}
function EvidenceExplorer_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Showing the first ", ctx_r2.limit, " of ", ctx_r2.total(), " records. Refine the search to narrow the list; the downloaded JSON holds every record.");
  }
}
function EvidenceExplorer_ng_template_18_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275listener("click", function EvidenceExplorer_ng_template_18_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const s_r18 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.ask.emit(s_r18));
    });
    \u0275\u0275element(1, "vc-icon", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function EvidenceExplorer_ng_template_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EvidenceExplorer_ng_template_18_Conditional_0_Template, 2, 1, "button", 43);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.askable() ? 0 : -1);
  }
}
var SECTIONS = [
  { key: "fields", label: "Fields", icon: "map", text: "Every field in scope, with area, crop and soil type." },
  { key: "samples", label: "Samples", icon: "target", text: "Soil cores with GPS, depth reached and field photos." },
  { key: "custody_events", label: "Chain of custody", icon: "truck", text: "Every hand-over from field to laboratory." },
  { key: "lab_results", label: "Lab results", icon: "flask", text: "All results, with the versions used in the calculation marked." },
  { key: "document_index", label: "Documents", icon: "file", text: "Every referenced file and its SHA-256 fingerprint." }
];
var ANALYTE = { soc_pct: "Soil organic carbon", bulk_density_g_cm3: "Bulk density", coarse_fraction: "Coarse fraction" };
var EvidenceExplorer = class _EvidenceExplorer {
  pkg = input.required(
    ...ngDevMode ? [{ debugName: "pkg" }] : (
      /* istanbul ignore next */
      []
    )
  );
  askable = input(
    true,
    ...ngDevMode ? [{ debugName: "askable" }] : (
      /* istanbul ignore next */
      []
    )
  );
  open = output();
  ask = output();
  sections = SECTIONS;
  sec = signal(
    "samples",
    ...ngDevMode ? [{ debugName: "sec" }] : (
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
  limit = 300;
  meta = computed(
    () => SECTIONS.find((s) => s.key === this.sec()),
    ...ngDevMode ? [{ debugName: "meta" }] : (
      /* istanbul ignore next */
      []
    )
  );
  maps = computed(
    () => {
      const p = this.pkg();
      return {
        campaigns: new Map((p["campaigns"] ?? []).map((c) => [c["id"], c])),
        sites: new Map((p["sites"] ?? []).map((c) => [c["id"], c])),
        samples: new Map((p["samples"] ?? []).map((c) => [c["id"], c])),
        docs: new Map((p["document_index"] ?? []).map((c) => [c["id"], c]))
      };
    },
    ...ngDevMode ? [{ debugName: "maps" }] : (
      /* istanbul ignore next */
      []
    )
  );
  filtered = computed(
    () => {
      const list = this.pkg()[this.sec()] ?? [];
      const q = this.q().trim().toLowerCase();
      if (!q)
        return list;
      return list.filter((r) => {
        const extra = this.sec() === "custody_events" ? this.sampleCode(r["sample_id"]) : "";
        return (JSON.stringify(r) + extra).toLowerCase().includes(q);
      });
    },
    ...ngDevMode ? [{ debugName: "filtered" }] : (
      /* istanbul ignore next */
      []
    )
  );
  total = computed(
    () => this.filtered().length,
    ...ngDevMode ? [{ debugName: "total" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => this.filtered().slice(0, this.limit),
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  count(k) {
    return (this.pkg()[k] ?? []).length;
  }
  campaignCode(id) {
    return this.maps().campaigns.get(id)?.["code"] ?? "\u2014";
  }
  campaignKindOnly(id) {
    const k = this.maps().campaigns.get(id)?.["kind"];
    return k ? k.charAt(0).toUpperCase() + k.slice(1) : "";
  }
  siteCode(id) {
    return this.maps().sites.get(id)?.["code"] ?? "\u2014";
  }
  sampleCode(id) {
    return this.maps().samples.get(id)?.["code"] ?? String(id ?? "").slice(0, 8);
  }
  doc(id) {
    return this.maps().docs.get(id);
  }
  analyte(a) {
    return ANALYTE[a] ?? a;
  }
  gps(r) {
    return r["latitude"] != null && r["longitude"] != null ? `${Number(r["latitude"]).toFixed(5)}, ${Number(r["longitude"]).toFixed(5)}` : "\u2014";
  }
  yn(v) {
    return v === true ? "y" : v === false ? "n" : "na";
  }
  ynText(v, y, n) {
    return v === true ? y : v === false ? n : "\u2014";
  }
  kb(b) {
    return !b ? "\u2014" : b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`;
  }
  static \u0275fac = function EvidenceExplorer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EvidenceExplorer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EvidenceExplorer, selectors: [["vc-evidence-explorer"]], inputs: { pkg: [1, "pkg"], askable: [1, "askable"] }, outputs: { open: "open", ask: "ask" }, decls: 20, vars: 7, consts: [["askBtn", ""], [1, "ex"], ["aria-label", "Evidence sections", 1, "secs"], [3, "on"], [1, "main", "card"], [1, "head"], [1, "small", "muted"], [1, "search"], ["name", "search", 3, "size"], [1, "input", 3, "ngModelChange", "placeholder", "ngModel"], [1, "table-wrap", "tw"], ["icon", "search", "title", "Nothing to show", 3, "text"], [1, "table"], [1, "card-foot", "foot", "small", "muted"], [3, "click"], [3, "name", "size"], [1, "c", "num"], [1, "num"], [1, "subtle", "small"], [1, "num", "nowrap"], [1, "u"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "mono"], ["cls", "RECORDED"], [1, "nowrap"], [1, "mono", "small", "nowrap"], [1, "ph"], [1, "btn", "btn-ghost", "btn-sm", 3, "title"], [1, "subtle"], [1, "btn", "btn-ghost", "btn-sm", 3, "click", "title"], ["name", "image", 3, "size"], [1, "tag"], [3, "unused"], ["cls", "MEASURED"], [1, "small"], [1, "yes"], [1, "cert"], ["name", "check", 3, "size"], [3, "value"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "external", 3, "size"], [1, "bad"], [1, "btn", "btn-ghost", "btn-sm"], ["title", "Raise a question on this item", "aria-label", "Raise a question", 1, "btn", "btn-ghost", "btn-sm", "btn-icon", "ask"], ["title", "Raise a question on this item", "aria-label", "Raise a question", 1, "btn", "btn-ghost", "btn-sm", "btn-icon", "ask", 3, "click"], ["name", "question", 3, "size"]], template: function EvidenceExplorer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "nav", 2);
      \u0275\u0275repeaterCreate(2, EvidenceExplorer_For_3_Template, 6, 6, "button", 3, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div")(7, "h3");
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 6);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 7);
      \u0275\u0275element(12, "vc-icon", 8);
      \u0275\u0275elementStart(13, "input", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function EvidenceExplorer_Template_input_ngModelChange_13_listener($event) {
        return ctx.q.set($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(14, "div", 10);
      \u0275\u0275conditionalCreate(15, EvidenceExplorer_Conditional_15_Template, 1, 1, "vc-empty", 11)(16, EvidenceExplorer_Conditional_16_Template, 6, 1, "table", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(17, EvidenceExplorer_Conditional_17_Template, 2, 2, "div", 13);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(18, EvidenceExplorer_ng_template_18_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.sections);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.meta().label);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.meta().text);
      \u0275\u0275advance(2);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance();
      \u0275\u0275property("placeholder", "Search " + ctx.meta().label.toLowerCase() + "\u2026")("ngModel", ctx.q());
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.rows().length ? 15 : 16);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.total() > ctx.limit ? 17 : -1);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, NgTemplateOutlet, Icon, DataClass, Hash, Empty, DayPipe, NumPipe, HumanPipe], styles: ["\n.ex[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 220px minmax(0, 1fr);\n  gap: 16px;\n  align-items: start;\n}\n@media (max-width: 900px) {\n  .ex[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .secs[_ngcontent-%COMP%] {\n    flex-direction: row !important;\n    overflow-x: auto;\n  }\n}\n.secs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  position: sticky;\n  top: 84px;\n}\n.secs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  height: 38px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 8px;\n  background: none;\n  font: inherit;\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n  text-align: left;\n  white-space: nowrap;\n}\n.secs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-200);\n}\n.secs[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  box-shadow: var(--%NS%shadow-sm);\n  color: var(--%NS%forest-700);\n  font-weight: 500;\n}\n.secs[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2) {\n  flex: 1;\n}\n.c[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.head[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--%NS%border);\n  flex-wrap: wrap;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  width: 300px;\n  max-width: 100%;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.tw[_ngcontent-%COMP%] {\n  max-height: 620px;\n}\n.u[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n  margin-left: 3px;\n}\n.tag[_ngcontent-%COMP%] {\n  font-size: 10.5px;\n  padding: 1px 6px;\n  border-radius: 999px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n  margin-left: 4px;\n}\n.y[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.n[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n  font-weight: 500;\n}\n.na[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.yes[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12.5px;\n  color: var(--%NS%forest-700);\n}\ntr.unused[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2px;\n  flex-wrap: nowrap;\n}\n.ph[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  padding: 0 6px;\n  gap: 4px;\n}\n.cert[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.bad[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n  font-weight: 500;\n}\n.ask[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.ask[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%forest-700);\n}\n.foot[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=evidence-explorer.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EvidenceExplorer, [{
    type: Component,
    args: [{ selector: "vc-evidence-explorer", imports: [FormsModule, NgTemplateOutlet, Icon, DataClass, Hash, Empty, DayPipe, NumPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="ex">
      <nav class="secs" aria-label="Evidence sections">
        @for (s of sections; track s.key) {
          <button [class.on]="sec() === s.key" (click)="sec.set(s.key); q.set('')">
            <vc-icon [name]="s.icon" [size]="15" /><span>{{ s.label }}</span><span class="c num">{{ count(s.key) }}</span>
          </button>
        }
      </nav>
      <div class="main card">
        <div class="head">
          <div><h3>{{ meta().label }}</h3><p class="small muted">{{ meta().text }}</p></div>
          <div class="search">
            <vc-icon name="search" [size]="15" />
            <input class="input" [placeholder]="'Search ' + meta().label.toLowerCase() + '\u2026'" [ngModel]="q()" (ngModelChange)="q.set($event)" />
          </div>
        </div>
        <div class="table-wrap tw">
          @if (!rows().length) {
            <vc-empty icon="search" title="Nothing to show" [text]="q() ? 'No records match your search.' : 'This section of the package is empty.'" />
          } @else {
            <table class="table">
              @switch (sec()) {
                @case ('fields') {
                  <thead><tr><th>Field</th><th class="num">Area</th><th>Crop</th><th>Soil type</th><th>Version</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr>
                        <td><strong>{{ r['code'] }}</strong><div class="subtle small">{{ r['name'] }}</div></td>
                        <td class="num nowrap">{{ r['area_ha'] | num: 2 }} <span class="u">ha</span></td>
                        <td>{{ r['crop_code'] || '\u2014' }}</td><td>{{ r['soil_type'] | human }}</td>
                        <td>v{{ r['version'] }}</td><td>{{ r['status'] | human }}</td>
                        <td class="num"><ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'field', id: r['id'], label: 'Field ' + r['code'] } }" /></td>
                      </tr>
                    }
                  </tbody>
                }
                @case ('samples') {
                  <thead><tr><th>Core</th><th>Campaign</th><th>Site</th><th>Collected</th><th>GPS</th><th class="num">Accuracy</th><th class="num">Depth</th><th>Photos</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr>
                        <td><strong class="mono">{{ r['code'] }}</strong>&nbsp;<vc-dc cls="RECORDED" /></td>
                        <td class="nowrap">{{ campaignCode(r['campaign_id']) }}<div class="subtle small">{{ campaignKindOnly(r['campaign_id']) }}</div></td>
                        <td class="mono small nowrap">{{ siteCode(r['site_id']) }}</td>
                        <td class="nowrap">{{ r['collected_at'] | day: true }}</td>
                        <td class="mono small nowrap">{{ gps(r) }}</td>
                        <td class="num nowrap">\xB1 {{ r['gps_accuracy_m'] | num: 1 }} <span class="u">m</span></td>
                        <td class="num nowrap">{{ r['depth_reached_cm'] | num: 0 }} <span class="u">cm</span></td>
                        <td><div class="ph">
                          @for (p of r['photos'] ?? []; track p.id; let i = $index) {
                            <button class="btn btn-ghost btn-sm" (click)="open.emit({ id: p.id, filename: r['code'] + '-photo-' + (i + 1) })" [title]="p.sha256"><vc-icon name="image" [size]="14" />{{ i + 1 }}</button>
                          } @empty { <span class="subtle">\u2014</span> }
                        </div></td>
                        <td class="num"><ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'sample', id: r['id'], label: 'Core ' + r['code'] } }" /></td>
                      </tr>
                    }
                  </tbody>
                }
                @case ('custody_events') {
                  <thead><tr><th>Core</th><th>Event</th><th>When</th><th>Where</th><th>Seal</th><th>Count</th><th>Notes</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr>
                        <td class="mono">{{ sampleCode(r['sample_id']) }}</td>
                        <td>{{ r['event'] | human }}@if (r['corrects_event_id']) { <span class="tag">correction</span> }</td>
                        <td class="nowrap">{{ r['occurred_at'] | day: true }}</td>
                        <td>{{ r['location'] || '\u2014' }}</td>
                        <td><span [class]="yn(r['seal_intact'])">{{ ynText(r['seal_intact'], 'Intact', 'Broken') }}</span></td>
                        <td><span [class]="yn(r['count_matches'])">{{ ynText(r['count_matches'], 'Matches', 'Mismatch') }}</span></td>
                        <td class="small muted">{{ r['notes'] || '\u2014' }}</td>
                        <td class="num"><ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'custody_event', id: r['id'], label: 'Custody event for ' + sampleCode(r['sample_id']) } }" /></td>
                      </tr>
                    }
                  </tbody>
                }
                @case ('lab_results') {
                  <thead><tr><th>Layer</th><th>Analyte</th><th class="num">Value</th><th>Method</th><th>Analysed</th><th>Status</th><th>Used</th><th>Certificate</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr [class.unused]="!r['used_in_calculation']">
                        <td class="mono">{{ r['layer_code'] }}</td>
                        <td>{{ analyte(r['analyte']) }} @if (r['version'] > 1) { <span class="tag">v{{ r['version'] }}</span> }</td>
                        <td class="num nowrap"><strong>{{ r['value'] | num: 3 }}</strong>&nbsp;<span class="u">{{ r['unit'] }}</span>&nbsp;<vc-dc cls="MEASURED" /></td>
                        <td class="small">{{ r['method'] || '\u2014' }}</td>
                        <td class="nowrap">{{ r['analysed_on'] | day }}</td>
                        <td>{{ r['status'] | human }}</td>
                        <td>@if (r['used_in_calculation']) { <span class="yes"><vc-icon name="check" [size]="13" />Used</span> } @else { <span class="subtle small">No</span> }</td>
                        <td>
                          @if (r['certificate_id']; as cid) {
                            <div class="cert">
                              @if (doc(cid)?.sha256; as sh) { <vc-hash [value]="sh" /> }
                              <button class="btn btn-ghost btn-sm" (click)="open.emit({ id: cid, filename: doc(cid)?.filename ?? 'certificate' })"><vc-icon name="external" [size]="13" />Open</button>
                            </div>
                          } @else { <span class="subtle">\u2014</span> }
                        </td>
                        <td class="num"><ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'lab_result', id: r['id'], label: analyte(r['analyte']) + ' for layer ' + r['layer_code'] } }" /></td>
                      </tr>
                    }
                  </tbody>
                }
                @case ('document_index') {
                  <thead><tr><th>File</th><th>Kind</th><th class="num">Size</th><th>Fingerprint (SHA-256)</th><th>Referenced by</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr>
                        <td><strong>{{ r['filename'] ?? 'Missing file' }}</strong><div class="subtle small">{{ r['mime_type'] }}</div></td>
                        <td>{{ r['kind'] | human }}</td>
                        <td class="num nowrap">{{ kb(r['size_bytes']) }}</td>
                        <td>@if (r['sha256']) { <vc-hash [value]="r['sha256']" /> } @else { <span class="bad">Missing</span> }</td>
                        <td class="small muted">{{ (r['referenced_by'] ?? []).length }} record(s)</td>
                        <td class="num nowrap">
                          @if (!r['missing']) { <button class="btn btn-ghost btn-sm" (click)="open.emit({ id: r['id'], filename: r['filename'] })"><vc-icon name="external" [size]="13" />Open</button> }
                          <ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'evidence', id: r['id'], label: 'File ' + (r['filename'] ?? r['id']) } }" />
                        </td>
                      </tr>
                    }
                  </tbody>
                }
              }
            </table>
          }
        </div>
        @if (total() > limit) {
          <div class="card-foot foot small muted">Showing the first {{ limit }} of {{ total() }} records. Refine the search to narrow the list; the downloaded JSON holds every record.</div>
        }
      </div>
    </div>

    <ng-template #askBtn let-s>
      @if (askable()) {
        <button class="btn btn-ghost btn-sm btn-icon ask" (click)="ask.emit(s)" title="Raise a question on this item" aria-label="Raise a question"><vc-icon name="question" [size]="15" /></button>
      }
    </ng-template>
  `, styles: ["/* angular:styles/component:scss;c9fa91549b58638f;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\verifier\\evidence-explorer.ts */\n.ex {\n  display: grid;\n  grid-template-columns: 220px minmax(0, 1fr);\n  gap: 16px;\n  align-items: start;\n}\n@media (max-width: 900px) {\n  .ex {\n    grid-template-columns: 1fr;\n  }\n  .secs {\n    flex-direction: row !important;\n    overflow-x: auto;\n  }\n}\n.secs {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  position: sticky;\n  top: 84px;\n}\n.secs button {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  height: 38px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 8px;\n  background: none;\n  font: inherit;\n  color: var(--stone-700);\n  cursor: pointer;\n  text-align: left;\n  white-space: nowrap;\n}\n.secs button:hover {\n  background: var(--sand-200);\n}\n.secs button.on {\n  background: var(--surface);\n  box-shadow: var(--shadow-sm);\n  color: var(--forest-700);\n  font-weight: 500;\n}\n.secs span:nth-child(2) {\n  flex: 1;\n}\n.c {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.head {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--border);\n  flex-wrap: wrap;\n}\n.search {\n  position: relative;\n  width: 300px;\n  max-width: 100%;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.tw {\n  max-height: 620px;\n}\n.u {\n  font-size: 11.5px;\n  color: var(--text-3);\n  margin-left: 3px;\n}\n.tag {\n  font-size: 10.5px;\n  padding: 1px 6px;\n  border-radius: 999px;\n  background: var(--stone-100);\n  color: var(--stone-600);\n  margin-left: 4px;\n}\n.y {\n  color: var(--forest-700);\n}\n.n {\n  color: var(--red-600);\n  font-weight: 500;\n}\n.na {\n  color: var(--text-3);\n}\n.yes {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12.5px;\n  color: var(--forest-700);\n}\ntr.unused td {\n  color: var(--text-3);\n}\n.ph {\n  display: flex;\n  gap: 2px;\n  flex-wrap: nowrap;\n}\n.ph .btn {\n  padding: 0 6px;\n  gap: 4px;\n}\n.cert {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.bad {\n  color: var(--red-600);\n  font-weight: 500;\n}\n.ask {\n  color: var(--text-3);\n}\n.ask:hover {\n  color: var(--forest-700);\n}\n.foot {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=evidence-explorer.css.map */\n"] }]
  }], null, { pkg: [{ type: Input, args: [{ isSignal: true, alias: "pkg", required: true }] }], askable: [{ type: Input, args: [{ isSignal: true, alias: "askable", required: false }] }], open: [{ type: Output, args: ["open"] }], ask: [{ type: Output, args: ["ask"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EvidenceExplorer, { className: "EvidenceExplorer", filePath: "src/app/features/verifier/evidence-explorer.ts", lineNumber: 191 });
})();

// src/app/features/verifier/verifier.service.ts
var KEY = "vc.verifier.token";
var VerifierApi = class _VerifierApi {
  http = inject(HttpClient);
  base = "/api/verifier";
  /** Read the token from the fragment (then scrub it) or from this tab's storage. */
  captureToken() {
    const m = /(?:^|[#&])token=([^&]+)/.exec(location.hash);
    if (m) {
      const t = decodeURIComponent(m[1]);
      try {
        sessionStorage.setItem(KEY, t);
      } catch {
      }
      history.replaceState(history.state, "", location.pathname + location.search);
      return t;
    }
    try {
      return sessionStorage.getItem(KEY);
    } catch {
      return null;
    }
  }
  forget() {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
    }
  }
  headers() {
    let t = null;
    try {
      t = sessionStorage.getItem(KEY);
    } catch {
    }
    return new HttpHeaders(t ? { "X-Verifier-Token": t } : {});
  }
  fail = (err) => throwError(() => asApiError(err));
  get(path) {
    return this.http.get(this.base + path, { headers: this.headers() }).pipe(catchError(this.fail));
  }
  post(path, body = {}) {
    return this.http.post(this.base + path, body, { headers: this.headers() }).pipe(catchError(this.fail));
  }
  blob(path) {
    return this.http.get(this.base + path, { headers: this.headers(), responseType: "blob" }).pipe(catchError(this.fail));
  }
  static \u0275fac = function VerifierApi_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerifierApi)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _VerifierApi, factory: _VerifierApi.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VerifierApi, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/verifier/verifier.page.ts
var _forTrack02 = ($index, $item) => $item.key;
var _forTrack12 = ($index, $item) => $item.id;
function VerifierPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "span", 18);
    \u0275\u0275element(2, "vc-icon", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 20);
    \u0275\u0275element(9, "vc-icon", 21);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r1.verifier.verifier_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r1.verifier.organisation || s_r1.verifier.verifier_email);
    \u0275\u0275advance();
    \u0275\u0275classProp("soon", ctx_r1.expiresSoon());
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Access until ", \u0275\u0275pipeBind2(11, 7, s_r1.verifier.expires_at, true));
  }
}
function VerifierPage_Conditional_11_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r4.count);
  }
}
function VerifierPage_Conditional_11_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function VerifierPage_Conditional_11_For_2_Template_button_click_0_listener() {
      const t_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.go(t_r4.key));
    });
    \u0275\u0275element(1, "vc-icon", 24);
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, VerifierPage_Conditional_11_For_2_Conditional_3_Template, 2, 1, "span", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.section() === t_r4.key);
    \u0275\u0275advance();
    \u0275\u0275property("name", t_r4.icon)("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", t_r4.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(t_r4.count ? 3 : -1);
  }
}
function VerifierPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "nav", 5);
    \u0275\u0275repeaterCreate(1, VerifierPage_Conditional_11_For_2_Template, 4, 6, "button", 22, _forTrack02);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.nav());
  }
}
function VerifierPage_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 7);
    \u0275\u0275element(1, "vc-loading", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function VerifierPage_Conditional_14_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.errorMsg());
  }
}
function VerifierPage_Conditional_14_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function VerifierPage_Conditional_14_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.start());
    });
    \u0275\u0275element(1, "vc-icon", 33);
    \u0275\u0275text(2, "Try again");
    \u0275\u0275elementEnd();
  }
}
function VerifierPage_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 8)(1, "span", 27);
    \u0275\u0275element(2, "vc-icon", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h1");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, VerifierPage_Conditional_14_Conditional_7_Template, 2, 1, "p", 28);
    \u0275\u0275elementStart(8, "div", 29);
    \u0275\u0275conditionalCreate(9, VerifierPage_Conditional_14_Conditional_9_Template, 3, 0, "button", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 31);
    \u0275\u0275text(11, "Review links are personal, time-limited and can be withdrawn by the project team. Contact the person who sent you the link for a new one.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classMap("gi " + ctx_r1.gate().tone);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r1.gate().icon)("size", 26);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.gate().title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.gate().text);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.errorMsg() ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.gate().retry ? 9 : -1);
  }
}
function VerifierPage_Conditional_15_Case_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 37);
    \u0275\u0275text(1, " You concluded this review: ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ". The workspace stays open, read-only, until the link expires. ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275property("tone", s_r7.status === "verified" ? "ok" : "warn")("icon", s_r7.status === "verified" ? "verified" : "flag");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r7.status === "verified" ? "verified" : "findings raised");
  }
}
function VerifierPage_Conditional_15_Case_0_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 47)(1, "dt");
    \u0275\u0275text(2, "Methodology");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "dd");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "dt");
    \u0275\u0275text(6, "Rules applied");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "dd", 60);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "dt");
    \u0275\u0275text(10, "Fields \xB7 zones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "dd", 60);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "dt");
    \u0275\u0275text(14, "Soil cores \xB7 layers");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "dd", 60);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "dt");
    \u0275\u0275text(18, "Lab results");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "dd", 60);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dt");
    \u0275\u0275text(22, "Custody events");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "dd", 60);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "dt");
    \u0275\u0275text(26, "Referenced files");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dd", 60);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "dt");
    \u0275\u0275text(30, "Quality findings");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dd", 60);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dt");
    \u0275\u0275text(34, "Engine version");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "dd");
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r8 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.methodology());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r8["methodology"]?.rules?.length ?? 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", p_r8["fields"]?.length ?? 0, " \xB7 ", p_r8["strata"]?.length ?? 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", p_r8["samples"]?.length ?? 0, " \xB7 ", p_r8["soil_layers"]?.length ?? 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", p_r8["lab_results"]?.length ?? 0, " (", ctx_r1.usedResults(), " used in the calculation)");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r8["custody_events"]?.length ?? 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r8["document_index"]?.length ?? 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", p_r8["qa_findings"]?.length ?? 0, " recorded");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(p_r8["metadata"]?.engine_version);
  }
}
function VerifierPage_Conditional_15_Case_0_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 48);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("message", ctx_r1.pkgError());
  }
}
function VerifierPage_Conditional_15_Case_0_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function VerifierPage_Conditional_15_Case_0_Conditional_77_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 50);
    \u0275\u0275listener("click", function VerifierPage_Conditional_15_Case_0_Conditional_77_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.download("pdf"));
    });
    \u0275\u0275element(1, "vc-icon", 61);
    \u0275\u0275text(2, "PDF report");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function VerifierPage_Conditional_15_Case_0_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275element(1, "vc-icon", 62);
    \u0275\u0275text(2, "Intact");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function VerifierPage_Conditional_15_Case_0_Conditional_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275element(1, "vc-icon", 63);
    \u0275\u0275text(2, "Does not match");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function VerifierPage_Conditional_15_Case_0_Conditional_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 56);
    \u0275\u0275text(1, "The stored package no longer matches the fingerprint recorded at issue. Raise this as a finding.");
    \u0275\u0275elementEnd();
  }
}
function VerifierPage_Conditional_15_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34)(1, "div", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h1");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 36);
    \u0275\u0275text(6, "Monitoring period ");
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "day");
    \u0275\u0275pipe(11, "day");
    \u0275\u0275pipe(12, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, VerifierPage_Conditional_15_Case_0_Conditional_13_Template, 5, 3, "vc-callout", 37);
    \u0275\u0275elementStart(14, "div", 38)(15, "div", 39)(16, "div", 40);
    \u0275\u0275text(17, "Net credits claimed ");
    \u0275\u0275element(18, "vc-dc", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 42);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "num");
    \u0275\u0275elementStart(22, "small");
    \u0275\u0275text(23, "tCO\u2082e");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 43)(25, "div", 40);
    \u0275\u0275text(26, "Emission reductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 42);
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "num");
    \u0275\u0275elementStart(30, "small");
    \u0275\u0275text(31, "t");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 43)(33, "div", 40);
    \u0275\u0275text(34, "Carbon removals");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 42);
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "num");
    \u0275\u0275elementStart(38, "small");
    \u0275\u0275text(39, "t");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(40, "div", 43)(41, "div", 40);
    \u0275\u0275text(42, "Result before uncertainty");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div", 42);
    \u0275\u0275text(44);
    \u0275\u0275pipe(45, "num");
    \u0275\u0275elementStart(46, "small");
    \u0275\u0275text(47, "t");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(48, "div", 43)(49, "div", 40);
    \u0275\u0275text(50, "Uncertainty deduction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 42);
    \u0275\u0275text(52);
    \u0275\u0275pipe(53, "num");
    \u0275\u0275elementStart(54, "small");
    \u0275\u0275text(55, "t");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(56, "div", 43)(57, "div", 40);
    \u0275\u0275text(58, "Non-permanence buffer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "div", 42);
    \u0275\u0275text(60);
    \u0275\u0275pipe(61, "num");
    \u0275\u0275elementStart(62, "small");
    \u0275\u0275text(63, "t");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(64, "div", 44)(65, "section", 7)(66, "div", 45)(67, "h3");
    \u0275\u0275text(68, "Scope and methodology");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "div", 46);
    \u0275\u0275conditionalCreate(70, VerifierPage_Conditional_15_Case_0_Conditional_70_Template, 37, 12, "dl", 47)(71, VerifierPage_Conditional_15_Case_0_Conditional_71_Template, 1, 1, "vc-error", 48)(72, VerifierPage_Conditional_15_Case_0_Conditional_72_Template, 1, 1, "vc-loading", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "div", 49)(74, "button", 50);
    \u0275\u0275listener("click", function VerifierPage_Conditional_15_Case_0_Template_button_click_74_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.download("json"));
    });
    \u0275\u0275element(75, "vc-icon", 51);
    \u0275\u0275text(76, "Download package JSON");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(77, VerifierPage_Conditional_15_Case_0_Conditional_77_Template, 3, 1, "button", 52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(78, "section", 7)(79, "div", 45)(80, "h3");
    \u0275\u0275text(81, "Package fingerprint");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(82, VerifierPage_Conditional_15_Case_0_Conditional_82_Template, 3, 1, "span", 53)(83, VerifierPage_Conditional_15_Case_0_Conditional_83_Template, 3, 1, "span", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "div", 46);
    \u0275\u0275element(85, "vc-hash", 55);
    \u0275\u0275conditionalCreate(86, VerifierPage_Conditional_15_Case_0_Conditional_86_Template, 2, 0, "vc-callout", 56);
    \u0275\u0275elementStart(87, "p", 16);
    \u0275\u0275text(88, "This SHA-256 fingerprint is printed on every page of the PDF. To confirm independently that the JSON you downloaded is the one that was issued:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "ol", 57)(90, "li");
    \u0275\u0275text(91, "Download the package JSON.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "li");
    \u0275\u0275text(93, "Remove the single field ");
    \u0275\u0275elementStart(94, "code");
    \u0275\u0275text(95, "metadata.sha256");
    \u0275\u0275elementEnd();
    \u0275\u0275text(96, ".");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "li");
    \u0275\u0275text(98, "Serialise with sorted keys and no spaces (");
    \u0275\u0275elementStart(99, "code");
    \u0275\u0275text(100, '","');
    \u0275\u0275elementEnd();
    \u0275\u0275text(101, " and ");
    \u0275\u0275elementStart(102, "code");
    \u0275\u0275text(103, '":"');
    \u0275\u0275elementEnd();
    \u0275\u0275text(104, " separators), UTF-8.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "li");
    \u0275\u0275text(106, "Compute SHA-256. It must equal the fingerprint above.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(107, "div", 58)(108, "pre");
    \u0275\u0275text(109);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "button", 59);
    \u0275\u0275listener("click", function VerifierPage_Conditional_15_Case_0_Template_button_click_110_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.copy(ctx_r1.snippet));
    });
    \u0275\u0275element(111, "vc-icon", 24);
    \u0275\u0275text(112);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_14_0;
    const s_r7 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Verification package v", s_r7.package.version, " \xB7 ", s_r7.package.summary.project_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.projectName());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r7.package.summary.period_label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate4(", ", \u0275\u0275pipeBind1(10, 26, s_r7.package.summary.period_start), " \u2013 ", \u0275\u0275pipeBind1(11, 28, s_r7.package.summary.period_end), ". Issued by ", s_r7.package.summary.generated_by, " on ", \u0275\u0275pipeBind1(12, 30, s_r7.package.created_at), ".");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(s_r7.status !== "in_review" ? 13 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(21, 32, s_r7.package.summary.net_credits_t_co2e, 1));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(29, 35, s_r7.package.summary.reductions_t_co2e, 1));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(37, 38, s_r7.package.summary.removals_t_co2e, 1));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(45, 41, s_r7.package.summary.net_before_uncertainty_t_co2e, 1));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(53, 44, s_r7.package.summary.uncertainty_deduction_t_co2e, 1));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(61, 47, s_r7.package.summary.buffer_t_co2e, 1));
    \u0275\u0275advance(10);
    \u0275\u0275conditional((tmp_14_0 = ctx_r1.pkg()) ? 70 : ctx_r1.pkgError() ? 71 : 72, tmp_14_0);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(s_r7.package.pdf_file_id ? 77 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(s_r7.integrity.intact ? 82 : 83);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", s_r7.package.sha256)("full", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(!s_r7.integrity.intact ? 86 : -1);
    \u0275\u0275advance(23);
    \u0275\u0275textInterpolate(ctx_r1.snippet);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r1.copied() ? "check" : "copy")("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.copied() ? "Copied" : "Copy");
  }
}
function VerifierPage_Conditional_15_Case_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-evidence-explorer", 66);
    \u0275\u0275listener("open", function VerifierPage_Conditional_15_Case_1_Conditional_5_Template_vc_evidence_explorer_open_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openFile($event));
    })("ask", function VerifierPage_Conditional_15_Case_1_Conditional_5_Template_vc_evidence_explorer_ask_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.startAsk($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275property("pkg", ctx)("askable", s_r7.status === "in_review");
  }
}
function VerifierPage_Conditional_15_Case_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 48);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("message", ctx_r1.pkgError());
  }
}
function VerifierPage_Conditional_15_Case_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 7);
    \u0275\u0275element(1, "vc-loading", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function VerifierPage_Conditional_15_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "h2");
    \u0275\u0275text(2, "Evidence explorer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 64);
    \u0275\u0275text(4, "Browse the sealed records. Open certificates and photos, and raise a question on any item.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, VerifierPage_Conditional_15_Case_1_Conditional_5_Template, 1, 2, "vc-evidence-explorer", 65)(6, VerifierPage_Conditional_15_Case_1_Conditional_6_Template, 1, 1, "vc-error", 48)(7, VerifierPage_Conditional_15_Case_1_Conditional_7_Template, 2, 1, "section", 7);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.pkg()) ? 5 : ctx_r1.pkgError() ? 6 : 7, tmp_3_0);
  }
}
function VerifierPage_Conditional_15_Case_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function VerifierPage_Conditional_15_Case_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275element(1, "vc-error", 68);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.provError());
  }
}
function VerifierPage_Conditional_15_Case_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-provenance-tree", 69);
    \u0275\u0275listener("openFile", function VerifierPage_Conditional_15_Case_2_Conditional_8_Template_vc_provenance_tree_openFile_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openFile({ id: $event.id, filename: $event.filename ?? "file" }));
    })("ask", function VerifierPage_Conditional_15_Case_2_Conditional_8_Template_vc_provenance_tree_ask_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.startAsk($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275property("data", ctx)("askable", s_r7.status === "in_review");
  }
}
function VerifierPage_Conditional_15_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "h2");
    \u0275\u0275text(2, "Provenance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 64);
    \u0275\u0275text(4, "How the claimed figure was built: every rule, term, zone, site, core, layer, lab result, certificate and custody event behind it.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "section", 7);
    \u0275\u0275conditionalCreate(6, VerifierPage_Conditional_15_Case_2_Conditional_6_Template, 1, 1, "vc-loading", 26)(7, VerifierPage_Conditional_15_Case_2_Conditional_7_Template, 2, 1, "div", 46)(8, VerifierPage_Conditional_15_Case_2_Conditional_8_Template, 1, 2, "vc-provenance-tree", 67);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.provLoading() ? 6 : ctx_r1.provError() ? 7 : (tmp_3_0 = ctx_r1.prov()) ? 8 : -1, tmp_3_0);
  }
}
function VerifierPage_Conditional_15_Case_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 74);
    \u0275\u0275listener("click", function VerifierPage_Conditional_15_Case_3_Conditional_7_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.startAsk({ type: "package", id: "", label: "The package as a whole" }));
    });
    \u0275\u0275element(1, "vc-icon", 75);
    \u0275\u0275text(2, "Ask a question");
    \u0275\u0275elementEnd();
  }
}
function VerifierPage_Conditional_15_Case_3_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 26);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function VerifierPage_Conditional_15_Case_3_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275element(1, "vc-error", 76);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.qError());
  }
}
function VerifierPage_Conditional_15_Case_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 72);
  }
}
function VerifierPage_Conditional_15_Case_3_Conditional_12_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275element(1, "vc-icon", 84);
    \u0275\u0275elementStart(2, "div")(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 80);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "day");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const q_r13 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(q_r13.answer);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Project team \xB7 ", \u0275\u0275pipeBind2(7, 3, q_r13.answered_at, true));
  }
}
function VerifierPage_Conditional_15_Case_3_Conditional_12_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 83);
    \u0275\u0275element(1, "vc-icon", 85);
    \u0275\u0275text(2, "Waiting for the project team");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function VerifierPage_Conditional_15_Case_3_Conditional_12_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "div", 77);
    \u0275\u0275element(2, "vc-badge", 78);
    \u0275\u0275elementStart(3, "span", 79);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "span", 4);
    \u0275\u0275elementStart(6, "span", 80);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p", 81);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, VerifierPage_Conditional_15_Case_3_Conditional_12_For_2_Conditional_11_Template, 8, 6, "div", 82)(12, VerifierPage_Conditional_15_Case_3_Conditional_12_For_2_Conditional_12_Template, 3, 1, "p", 83);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const q_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", q_r13.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.subject(q_r13));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 5, q_r13.created_at, true));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(q_r13.question);
    \u0275\u0275advance();
    \u0275\u0275conditional(q_r13.answer ? 11 : 12);
  }
}
function VerifierPage_Conditional_15_Case_3_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 73);
    \u0275\u0275repeaterCreate(1, VerifierPage_Conditional_15_Case_3_Conditional_12_For_2_Template, 13, 8, "li", null, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.questions());
  }
}
function VerifierPage_Conditional_15_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "div")(2, "h2");
    \u0275\u0275text(3, "Queries");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 64);
    \u0275\u0275text(5, "Questions go to the project team. Their answers appear here.");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "span", 4);
    \u0275\u0275conditionalCreate(7, VerifierPage_Conditional_15_Case_3_Conditional_7_Template, 3, 0, "button", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "section", 7);
    \u0275\u0275conditionalCreate(9, VerifierPage_Conditional_15_Case_3_Conditional_9_Template, 1, 1, "vc-loading", 26)(10, VerifierPage_Conditional_15_Case_3_Conditional_10_Template, 2, 1, "div", 46)(11, VerifierPage_Conditional_15_Case_3_Conditional_11_Template, 1, 0, "vc-empty", 72)(12, VerifierPage_Conditional_15_Case_3_Conditional_12_Template, 3, 0, "ul", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275conditional(s_r7.status === "in_review" ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.qLoading() ? 9 : ctx_r1.qError() ? 10 : !ctx_r1.questions().length ? 11 : 12);
  }
}
function VerifierPage_Conditional_15_Case_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 86)(1, "span", 27);
    \u0275\u0275element(2, "vc-icon", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 36);
    \u0275\u0275text(6, "You concluded this review. The project team has been informed.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap("gi " + (s_r7.status === "verified" ? "ok" : "warn"));
    \u0275\u0275advance();
    \u0275\u0275property("name", s_r7.status === "verified" ? "verified" : "flag")("size", 24);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r7.status === "verified" ? "Verified" : "Findings raised");
  }
}
function VerifierPage_Conditional_15_Case_4_Conditional_6_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 95);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.openQuestions(), " of your questions ", ctx_r1.openQuestions() === 1 ? "is" : "are", " still unanswered.");
  }
}
function VerifierPage_Conditional_15_Case_4_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 7)(1, "div", 87)(2, "label", 88)(3, "input", 89);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function VerifierPage_Conditional_15_Case_4_Conditional_6_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.decision, $event) || (ctx_r1.decision = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "vc-icon", 90);
    \u0275\u0275elementStart(5, "div")(6, "strong");
    \u0275\u0275text(7, "Verified");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "The claim is supported by the evidence, within the methodology's requirements.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "label", 88)(11, "input", 91);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function VerifierPage_Conditional_15_Case_4_Conditional_6_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.decision, $event) || (ctx_r1.decision = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "vc-icon", 92);
    \u0275\u0275elementStart(13, "div")(14, "strong");
    \u0275\u0275text(15, "Findings");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17, "Issues must be corrected or clarified before the claim can be verified.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 93)(19, "label");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "textarea", 94);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function VerifierPage_Conditional_15_Case_4_Conditional_6_Template_textarea_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.decisionNote, $event) || (ctx_r1.decisionNote = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(22, VerifierPage_Conditional_15_Case_4_Conditional_6_Conditional_22_Template, 2, 2, "vc-callout", 95);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 49)(24, "button", 13);
    \u0275\u0275listener("click", function VerifierPage_Conditional_15_Case_4_Conditional_6_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.confirmOpen.set(true));
    });
    \u0275\u0275text(25, "Record decision");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r1.decision === "verified");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.decision);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("on", ctx_r1.decision === "findings");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.decision);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.decision === "findings" ? "Describe the findings" : "Note (optional)");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.decisionNote);
    \u0275\u0275property("placeholder", ctx_r1.decision === "findings" ? "e.g. Zone Z3: two cores have no lab-received custody event; certificate for layer L-104 is unsigned." : "Any remarks for the record");
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.openQuestions() > 0 ? 22 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r1.decisionValid());
  }
}
function VerifierPage_Conditional_15_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "h2");
    \u0275\u0275text(2, "Decision");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 64);
    \u0275\u0275text(4, "Record the outcome of your review. This is final for this link and is added to the audit trail.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, VerifierPage_Conditional_15_Case_4_Conditional_5_Template, 7, 5, "section", 86)(6, VerifierPage_Conditional_15_Case_4_Conditional_6_Template, 26, 13, "section", 7);
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275conditional(s_r7.status !== "in_review" ? 5 : 6);
  }
}
function VerifierPage_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, VerifierPage_Conditional_15_Case_0_Template, 113, 50)(1, VerifierPage_Conditional_15_Case_1_Template, 8, 1)(2, VerifierPage_Conditional_15_Case_2_Template, 9, 1)(3, VerifierPage_Conditional_15_Case_3_Template, 13, 2)(4, VerifierPage_Conditional_15_Case_4_Template, 7, 1);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.section()) === "summary" ? 0 : tmp_2_0 === "evidence" ? 1 : tmp_2_0 === "provenance" ? 2 : tmp_2_0 === "queries" ? 3 : tmp_2_0 === "decision" ? 4 : -1);
  }
}
function VerifierPage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    \u0275\u0275textInterpolate1(" verification package ", ctx.package.sha256.slice(0, 12), " \xB7 ");
  }
}
function VerifierPage_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 96);
    \u0275\u0275element(1, "vc-icon", 97);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 93)(4, "label");
    \u0275\u0275text(5, "Your question");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "textarea", 98);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function VerifierPage_Conditional_21_Template_textarea_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.question, $event) || (ctx_r1.question = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 99);
    \u0275\u0275text(8, "At least 5 characters.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx.label);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.question);
    \u0275\u0275control();
  }
}
var SNIPPET = `import hashlib, json

pkg = json.load(open("package.json", encoding="utf-8"))
meta = {k: v for k, v in pkg["metadata"].items() if k != "sha256"}
doc = {**pkg, "metadata": meta}
text = json.dumps(doc, sort_keys=True, separators=(",", ":"), default=str)
print(hashlib.sha256(text.encode("utf-8")).hexdigest())`;
var VerifierPage = class _VerifierPage {
  api = inject(VerifierApi);
  toast = inject(ToastService);
  state = signal(
    "loading",
    ...ngDevMode ? [{ debugName: "state" }] : (
      /* istanbul ignore next */
      []
    )
  );
  errorCode = signal(
    "",
    ...ngDevMode ? [{ debugName: "errorCode" }] : (
      /* istanbul ignore next */
      []
    )
  );
  errorMsg = signal(
    "",
    ...ngDevMode ? [{ debugName: "errorMsg" }] : (
      /* istanbul ignore next */
      []
    )
  );
  session = signal(
    null,
    ...ngDevMode ? [{ debugName: "session" }] : (
      /* istanbul ignore next */
      []
    )
  );
  section = signal(
    new URLSearchParams(location.search).get("section") || "summary",
    ...ngDevMode ? [{ debugName: "section" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pkg = signal(
    null,
    ...ngDevMode ? [{ debugName: "pkg" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pkgError = signal(
    null,
    ...ngDevMode ? [{ debugName: "pkgError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  prov = signal(
    null,
    ...ngDevMode ? [{ debugName: "prov" }] : (
      /* istanbul ignore next */
      []
    )
  );
  provLoading = signal(
    false,
    ...ngDevMode ? [{ debugName: "provLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  provError = signal(
    null,
    ...ngDevMode ? [{ debugName: "provError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  queries = signal(
    [],
    ...ngDevMode ? [{ debugName: "queries" }] : (
      /* istanbul ignore next */
      []
    )
  );
  qLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "qLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  qError = signal(
    null,
    ...ngDevMode ? [{ debugName: "qError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  asking = signal(
    null,
    ...ngDevMode ? [{ debugName: "asking" }] : (
      /* istanbul ignore next */
      []
    )
  );
  question = "";
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  copied = signal(
    false,
    ...ngDevMode ? [{ debugName: "copied" }] : (
      /* istanbul ignore next */
      []
    )
  );
  confirmOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "confirmOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  decision = "verified";
  decisionNote = "";
  snippet = SNIPPET;
  questions = computed(
    () => this.queries().filter((q) => q.subject_type !== "decision").reverse(),
    ...ngDevMode ? [{ debugName: "questions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  openQuestions = computed(
    () => this.questions().filter((q) => q.status === "open").length,
    ...ngDevMode ? [{ debugName: "openQuestions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  nav = computed(
    () => [
      { key: "summary", label: "Summary", icon: "dashboard", count: 0 },
      { key: "evidence", label: "Evidence", icon: "file-search", count: 0 },
      { key: "provenance", label: "Provenance", icon: "network", count: 0 },
      { key: "queries", label: "Queries", icon: "message", count: this.openQuestions() },
      { key: "decision", label: "Decision", icon: "stamp", count: 0 }
    ],
    ...ngDevMode ? [{ debugName: "nav" }] : (
      /* istanbul ignore next */
      []
    )
  );
  expiresSoon = computed(
    () => {
      const e = this.session()?.verifier.expires_at;
      return !!e && new Date(e).getTime() - Date.now() < 3 * 864e5;
    },
    ...ngDevMode ? [{ debugName: "expiresSoon" }] : (
      /* istanbul ignore next */
      []
    )
  );
  projectName = computed(
    () => {
      const p = this.pkg();
      return p?.["metadata"]?.["project_name"] ?? this.session()?.package.summary.project_code ?? "Verification package";
    },
    ...ngDevMode ? [{ debugName: "projectName" }] : (
      /* istanbul ignore next */
      []
    )
  );
  methodology = computed(
    () => {
      const pk = this.pkg()?.["methodology"]?.["pack"];
      return pk ? `${pk["methodology_code"]} v${pk["methodology_version"]} rev ${pk["revision"]}${pk["title"] ? " \u2014 " + pk["title"] : ""}` : "\u2014";
    },
    ...ngDevMode ? [{ debugName: "methodology" }] : (
      /* istanbul ignore next */
      []
    )
  );
  usedResults = computed(
    () => (this.pkg()?.["lab_results"] ?? []).filter((r) => r["used_in_calculation"]).length,
    ...ngDevMode ? [{ debugName: "usedResults" }] : (
      /* istanbul ignore next */
      []
    )
  );
  gate = computed(
    () => {
      switch (this.errorCode()) {
        case "VERIFIER_LINK_EXPIRED":
          return { icon: "hourglass", tone: "warn", title: "This review link has expired", text: "Access to this package was time-limited and the period has ended. Ask the project team for a new link if your review is still in progress.", retry: false };
        case "VERIFIER_LINK_REVOKED":
          return { icon: "ban", tone: "danger", title: "Access has been withdrawn", text: "The project team has revoked this link. Your questions and any decision you recorded remain on the record.", retry: false };
        case "VERIFIER_TOKEN_REQUIRED":
        case "NO_TOKEN":
          return { icon: "key", tone: "neutral", title: "Open your review link", text: "This workspace opens from the personal link the project team sent you. Open that link again in this browser tab.", retry: false };
        case "VERIFIER_LINK_INVALID":
          return { icon: "link-off", tone: "danger", title: "This link isn't valid", text: "The link may be incomplete or mistyped. Copy the whole link from the message you received and open it again.", retry: false };
        case "OFFLINE":
          return { icon: "wifi-off", tone: "neutral", title: "Can't reach the server", text: "Check your connection and try again.", retry: true };
        default:
          return { icon: "alert", tone: "neutral", title: "The workspace could not be opened", text: "Something went wrong on our side. Please try again in a moment.", retry: true };
      }
    },
    ...ngDevMode ? [{ debugName: "gate" }] : (
      /* istanbul ignore next */
      []
    )
  );
  decisionValid = () => this.decision === "verified" || this.decisionNote.trim().length >= 5;
  constructor() {
    this.start();
    effect(() => {
      if (this.section() === "provenance" && this.session() && !this.prov() && !this.provLoading() && !this.provError())
        this.loadProv();
    });
  }
  start() {
    const t = this.api.captureToken();
    if (!t) {
      this.fail({ status: 401, code: "NO_TOKEN", message: "", details: {} });
      return;
    }
    this.state.set("loading");
    this.api.get("/session").subscribe({
      next: (s) => {
        this.session.set(s);
        this.state.set("ready");
        this.loadPackage();
        this.loadQueries();
      },
      error: (e) => this.fail(e)
    });
  }
  fail(e) {
    const code = e.status === 401 && !e.code.startsWith("VERIFIER") && e.code !== "NO_TOKEN" ? "VERIFIER_LINK_INVALID" : e.code;
    this.errorCode.set(code);
    this.errorMsg.set(code.startsWith("VERIFIER") || code === "NO_TOKEN" ? "" : e.message);
    this.session.set(null);
    this.state.set("error");
  }
  /** A 401 mid-session means the link expired or was revoked: show the gate. */
  handle(e, fallback, set) {
    if (e.status === 401) {
      this.fail(e);
      return;
    }
    if (set)
      set(e.message);
    else
      this.toast.apiError(e, fallback);
  }
  go(s) {
    this.section.set(s);
    window.scrollTo({ top: 0 });
  }
  loadPackage() {
    this.pkgError.set(null);
    this.api.get("/package").subscribe({
      next: (p) => this.pkg.set(p),
      error: (e) => this.handle(e, "", (m) => this.pkgError.set(m))
    });
  }
  loadQueries() {
    this.qLoading.set(true);
    this.qError.set(null);
    this.api.get("/queries").subscribe({
      next: (q) => {
        this.queries.set(q);
        this.qLoading.set(false);
      },
      error: (e) => {
        this.qLoading.set(false);
        this.handle(e, "", (m) => this.qError.set(m));
      }
    });
  }
  loadProv() {
    const s = this.session();
    if (!s)
      return;
    this.provLoading.set(true);
    this.provError.set(null);
    this.api.get(`/provenance/${s.package.run_id}`).subscribe({
      next: (p) => {
        this.prov.set(p);
        this.provLoading.set(false);
      },
      error: (e) => {
        this.provLoading.set(false);
        this.handle(e, "", (m) => this.provError.set(m));
      }
    });
  }
  openFile(f) {
    this.api.blob(`/files/${f.id}`).subscribe({
      next: (b) => openBlob(b),
      error: (e) => this.handle(e, "Couldn't open the file")
    });
  }
  download(kind) {
    const p = this.session()?.package;
    const id = kind === "json" ? p?.json_file_id : p?.pdf_file_id;
    if (!p || !id)
      return;
    this.api.blob(`/files/${id}`).subscribe({
      next: (b) => saveBlob(b, `${p.summary.project_code}_${p.summary.period_label}_v${p.version}.${kind}`),
      error: (e) => this.handle(e, "Couldn't download")
    });
  }
  copy(t) {
    navigator.clipboard?.writeText(t);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
  startAsk(s) {
    this.question = "";
    this.asking.set(s);
  }
  sendQuestion() {
    const a = this.asking();
    if (!a)
      return;
    this.busy.set(true);
    this.api.post("/queries", { question: this.question.trim(), subject_type: a.type, subject_id: (a.id ?? "").slice(0, 64) }).subscribe({
      next: () => {
        this.busy.set(false);
        this.asking.set(null);
        this.toast.success("Question sent", "The project team will answer in the Queries section.");
        this.loadQueries();
      },
      error: (e) => {
        this.busy.set(false);
        this.handle(e, "Couldn't send the question");
      }
    });
  }
  subject(q) {
    if (!q.subject_type || q.subject_type === "package")
      return "The package as a whole";
    return `${q.subject_type.replace(/_/g, " ")}${q.subject_id ? " \xB7 " + q.subject_id.slice(0, 12) : ""}`;
  }
  decide() {
    this.busy.set(true);
    this.api.post("/decision", { status: this.decision, note: this.decisionNote.trim() }).subscribe({
      next: (acc) => {
        this.busy.set(false);
        this.confirmOpen.set(false);
        const s = this.session();
        if (s)
          this.session.set(__spreadProps(__spreadValues({}, s), { status: acc.review_status, verifier: acc }));
        this.toast.success("Decision recorded", this.decision === "verified" ? "The package is marked verified." : "Your findings have been sent to the project team.");
      },
      error: (e) => {
        this.busy.set(false);
        this.handle(e, "Couldn't record the decision");
      }
    });
  }
  static \u0275fac = function VerifierPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerifierPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerifierPage, selectors: [["vc-verifier-page"]], decls: 44, vars: 14, consts: [[1, "top"], [1, "in"], [1, "div"], [1, "ws"], [1, "spacer"], ["aria-label", "Workspace sections", 1, "tabs", "in"], [1, "in", "body"], [1, "card"], [1, "card", "gate"], [1, "in", "pf", "small", "subtle"], ["title", "Raise a question", "subtitle", "The project team is notified and answers here.", "width", "560px", 3, "closed", "open"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "send"], ["title", "Confirm your decision", "width", "500px", 3, "openChange", "open"], [1, "small", "muted", "mt"], [1, "who"], [1, "av"], ["name", "user-check", 3, "size"], [1, "exp"], ["name", "hourglass", 3, "size"], [3, "on"], [3, "click"], [3, "name", "size"], [1, "c"], [3, "rows"], [1, "gi"], [1, "small", "subtle"], [1, "ga"], [1, "btn", "btn-secondary"], [1, "small", "subtle", "foot"], [1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], [1, "intro"], [1, "ey"], [1, "muted"], [1, "mb", 3, "tone", "icon"], [1, "figs"], [1, "card", "fig", "acc"], [1, "fl"], ["cls", "CALCULATED"], [1, "fv", "num"], [1, "card", "fig"], [1, "grid", "grid-2", "two"], [1, "card-head"], [1, "card-body"], [1, "kv"], ["title", "Couldn't read the package", 3, "message"], [1, "card-foot"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "file-json", 3, "size"], [1, "btn", "btn-secondary", "btn-sm"], [1, "ok"], [1, "bad"], [1, "fh", 3, "value", "full"], ["tone", "danger", "icon", "shield-alert", 1, "mt"], [1, "how", "small"], [1, "code"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [1, "num"], ["name", "download", 3, "size"], ["name", "shield-check", 3, "size"], ["name", "shield-alert", 3, "size"], [1, "muted", "small"], [3, "pkg", "askable"], [3, "open", "ask", "pkg", "askable"], [3, "data", "askable"], ["title", "Couldn't load provenance", 3, "message"], [3, "openFile", "ask", "data", "askable"], [1, "intro", "row"], [1, "btn", "btn-primary"], ["icon", "message", "title", "No questions raised", "text", "Use \u201CRaise a question\u201D on any record in the evidence explorer or provenance tree, or ask about the package as a whole."], [1, "qs"], [1, "btn", "btn-primary", 3, "click"], ["name", "question"], ["title", "Couldn't load your queries", 3, "message"], [1, "qh"], [3, "status"], [1, "qsubj"], [1, "subtle", "small"], [1, "qq"], [1, "qa"], [1, "small", "subtle", "wait"], ["name", "reply", 3, "size"], ["name", "clock", 3, "size"], [1, "card", "concluded"], [1, "card-body", "dec"], [1, "opt"], ["type", "radio", "name", "d", "value", "verified", 3, "ngModelChange", "ngModel"], ["name", "verified", 3, "size"], ["type", "radio", "name", "d", "value", "findings", 3, "ngModelChange", "ngModel"], ["name", "flag", 3, "size"], [1, "field"], ["rows", "4", 1, "input", 3, "ngModelChange", "ngModel", "placeholder"], ["tone", "warn", "icon", "alert"], [1, "subj"], ["name", "corner-down-right", 3, "size"], ["rows", "5", "placeholder", "Be specific: what you checked, what you expected, and what evidence would resolve it.", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"]], template: function VerifierPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "div", 1);
      \u0275\u0275element(2, "vc-brand")(3, "span", 2);
      \u0275\u0275elementStart(4, "div", 3)(5, "strong");
      \u0275\u0275text(6, "Independent verification workspace");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "span");
      \u0275\u0275text(8, "Read-only \xB7 every action is logged");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(9, "span", 4);
      \u0275\u0275conditionalCreate(10, VerifierPage_Conditional_10_Template, 12, 10);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(11, VerifierPage_Conditional_11_Template, 3, 0, "nav", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "main", 6);
      \u0275\u0275conditionalCreate(13, VerifierPage_Conditional_13_Template, 2, 1, "section", 7)(14, VerifierPage_Conditional_14_Template, 12, 8, "section", 8)(15, VerifierPage_Conditional_15_Template, 5, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "footer", 9);
      \u0275\u0275text(17, " Varsapradaya Carbon \xB7 ");
      \u0275\u0275conditionalCreate(18, VerifierPage_Conditional_18_Template, 1, 1);
      \u0275\u0275text(19, "You are viewing a read-only copy; nothing you do here changes the project's records. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "vc-modal", 10);
      \u0275\u0275listener("closed", function VerifierPage_Template_vc_modal_closed_20_listener() {
        return ctx.asking.set(null);
      });
      \u0275\u0275conditionalCreate(21, VerifierPage_Conditional_21_Template, 9, 3);
      \u0275\u0275elementContainerStart(22, 11);
      \u0275\u0275elementStart(23, "button", 12);
      \u0275\u0275listener("click", function VerifierPage_Template_button_click_23_listener() {
        return ctx.asking.set(null);
      });
      \u0275\u0275text(24, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "button", 13);
      \u0275\u0275listener("click", function VerifierPage_Template_button_click_25_listener() {
        return ctx.sendQuestion();
      });
      \u0275\u0275element(26, "vc-icon", 14);
      \u0275\u0275text(27);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "vc-modal", 15);
      \u0275\u0275twoWayListener("openChange", function VerifierPage_Template_vc_modal_openChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.confirmOpen, $event) || (ctx.confirmOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(29, "p");
      \u0275\u0275text(30, "You are recording ");
      \u0275\u0275elementStart(31, "strong");
      \u0275\u0275text(32);
      \u0275\u0275elementEnd();
      \u0275\u0275text(33);
      \u0275\u0275elementStart(34, "code");
      \u0275\u0275text(35);
      \u0275\u0275elementEnd();
      \u0275\u0275text(36, ").");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "p", 16);
      \u0275\u0275text(38, "After this you can no longer raise questions with this link. The decision is added to the project's audit trail under your name.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(39, 11);
      \u0275\u0275elementStart(40, "button", 12);
      \u0275\u0275listener("click", function VerifierPage_Template_button_click_40_listener() {
        return ctx.confirmOpen.set(false);
      });
      \u0275\u0275text(41, "Go back");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "button", 13);
      \u0275\u0275listener("click", function VerifierPage_Template_button_click_42_listener() {
        return ctx.decide();
      });
      \u0275\u0275text(43);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_5_0;
      \u0275\u0275advance(10);
      \u0275\u0275conditional((tmp_0_0 = ctx.session()) ? 10 : -1, tmp_0_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.session() ? 11 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.state() === "loading" ? 13 : ctx.state() === "error" ? 14 : (tmp_2_0 = ctx.session()) ? 15 : -1, tmp_2_0);
      \u0275\u0275advance(5);
      \u0275\u0275conditional((tmp_3_0 = ctx.session()) ? 18 : -1, tmp_3_0);
      \u0275\u0275advance(2);
      \u0275\u0275property("open", !!ctx.asking());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_5_0 = ctx.asking()) ? 21 : -1, tmp_5_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || ctx.question.trim().length < 5);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.busy() ? "Sending\u2026" : "Send question");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.confirmOpen);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.decision === "verified" ? "Verified" : "Findings");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" for package v", ctx.session()?.package?.version, " (fingerprint ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.session()?.package?.sha256?.slice(0, 12), "\u2026");
      \u0275\u0275advance(7);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.busy() ? "Recording\u2026" : "Confirm decision");
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, RadioControlValueAccessor, NgControlStatus, NgModel, Brand, Icon, Badge, DataClass, Hash, Loading, ErrorBox, Empty, Callout, Modal, ProvenanceTree, EvidenceExplorer, NumPipe, DayPipe], styles: ['\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  background: var(--%NS%bg);\n}\n.in[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1320px;\n  margin: 0 auto;\n  padding-left: 32px;\n  padding-right: 32px;\n}\n@media (max-width: 800px) {\n  .in[_ngcontent-%COMP%] {\n    padding-left: 16px;\n    padding-right: 16px;\n  }\n}\n.top[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 40;\n  background: var(--%NS%surface);\n  border-top: 3px solid var(--%NS%forest-600);\n  border-bottom: 1px solid var(--%NS%border);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.top[_ngcontent-%COMP%]    > .in[_ngcontent-%COMP%]:first-child {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  height: 64px;\n}\n.div[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 28px;\n  background: var(--%NS%border);\n}\n.ws[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.ws[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--%NS%stone-900);\n}\n.ws[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.who[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.who[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.who[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13px;\n}\n.who[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.av[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n}\n.exp[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--%NS%stone-600);\n  padding: 5px 10px;\n  border-radius: 999px;\n  background: var(--%NS%sand-100);\n  border: 1px solid var(--%NS%border);\n}\n.exp.soon[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n  border-color: #f1dcae;\n}\n@media (max-width: 900px) {\n  .ws[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n   .who[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], \n   .div[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.tabs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  overflow-x: auto;\n}\n.tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  height: 44px;\n  padding: 0 14px;\n  border: 0;\n  background: none;\n  font: inherit;\n  font-weight: 500;\n  color: var(--%NS%text-2);\n  cursor: pointer;\n  white-space: nowrap;\n}\n.tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%text);\n}\n.tabs[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.tabs[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  left: 10px;\n  right: 10px;\n  bottom: 0;\n  height: 2px;\n  border-radius: 2px;\n  background: var(--%NS%forest-600);\n}\n.tabs[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n  font-size: 11px;\n}\n.body[_ngcontent-%COMP%] {\n  flex: 1;\n  padding-top: 28px;\n  padding-bottom: 40px;\n}\n.intro[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.intro.row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n}\n.ey[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--%NS%forest-500);\n  margin-bottom: 6px;\n}\n.intro[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 26px;\n}\n.intro[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 6px;\n}\n.mb[_ngcontent-%COMP%] {\n  display: flex;\n  margin-bottom: 16px;\n}\n.figs[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.4fr repeat(5, minmax(0, 1fr));\n  gap: 12px;\n}\n@media (max-width: 1200px) {\n  .figs[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n@media (max-width: 700px) {\n  .figs[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n.fig[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n}\n.fl[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  font-weight: 500;\n}\n.fv[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 6px;\n}\n.fv[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  margin-left: 5px;\n  font-weight: 500;\n}\n.fig.acc[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--%NS%forest-800),\n      var(--%NS%forest-600));\n  border-color: var(--%NS%forest-700);\n}\n.fig.acc[_ngcontent-%COMP%]   .fl[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.78);\n}\n.fig.acc[_ngcontent-%COMP%]   .fv[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 30px;\n}\n.fig.acc[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.7);\n}\n.two[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n.ok[_ngcontent-%COMP%], \n.bad[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  font-weight: 500;\n  padding: 3px 9px;\n  border-radius: 999px;\n}\n.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.fh[_ngcontent-%COMP%] {\n  word-break: break-all;\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  display: block;\n}\n.how[_ngcontent-%COMP%] {\n  margin: 8px 0 12px;\n  padding-left: 18px;\n  color: var(--%NS%stone-700);\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n}\n.code[_ngcontent-%COMP%] {\n  position: relative;\n  background: var(--%NS%forest-950);\n  border-radius: var(--%NS%radius-sm);\n  padding: 12px 14px;\n}\n.code[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%] {\n  margin: 0;\n  font: 12px/1.55 var(--%NS%mono);\n  color: #dfe9e2;\n  white-space: pre;\n  overflow-x: auto;\n}\n.code[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  color: #c3dbca;\n}\n.code[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.08) !important;\n}\n.gate[_ngcontent-%COMP%] {\n  max-width: 560px;\n  margin: 48px auto;\n  padding: 40px 36px;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n}\n.gate[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 22px;\n}\n.gate[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--%NS%text-2);\n  max-width: 440px;\n}\n.gi[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 60px;\n  height: 60px;\n  border-radius: 16px;\n  margin-bottom: 6px;\n}\n.gi.danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.gi.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.gi.neutral[_ngcontent-%COMP%] {\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-600);\n}\n.gi.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-600);\n}\n.ga[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.gate[_ngcontent-%COMP%]   .foot[_ngcontent-%COMP%] {\n  margin-top: 18px;\n  padding-top: 16px;\n  border-top: 1px solid var(--%NS%border);\n}\n.qs[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.qs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.qs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.qh[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}\n.qsubj[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.qq[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  white-space: pre-wrap;\n}\n.qa[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  margin-top: 10px;\n  padding: 10px 12px;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%forest-50);\n  border: 1px solid var(--%NS%forest-200);\n  color: var(--%NS%forest-600);\n}\n.qa[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-800);\n  white-space: pre-wrap;\n}\n.wait[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: 8px;\n}\n.dec[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  max-width: 760px;\n}\n.opt[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n  padding: 14px 16px;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  cursor: pointer;\n}\n.opt[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.opt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: var(--%NS%focus);\n}\n.opt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin-top: 3px;\n  accent-color: var(--%NS%primary);\n}\n.opt[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n  margin-top: 1px;\n}\n.opt[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.opt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%text-2);\n}\n.concluded[_ngcontent-%COMP%] {\n  padding: 40px;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.subj[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 12px;\n  margin-bottom: 14px;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%sand-100);\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n}\n.pf[_ngcontent-%COMP%] {\n  padding-top: 16px;\n  padding-bottom: 24px;\n  border-top: 1px solid var(--%NS%border);\n}\n/*# sourceMappingURL=verifier.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VerifierPage, [{
    type: Component,
    args: [{ selector: "vc-verifier-page", imports: [FormsModule, Brand, Icon, Badge, DataClass, Hash, Loading, ErrorBox, Empty, Callout, Modal, ProvenanceTree, EvidenceExplorer, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <header class="top">
      <div class="in">
        <vc-brand />
        <span class="div"></span>
        <div class="ws"><strong>Independent verification workspace</strong><span>Read-only \xB7 every action is logged</span></div>
        <span class="spacer"></span>
        @if (session(); as s) {
          <div class="who">
            <span class="av"><vc-icon name="user-check" [size]="16" /></span>
            <div><strong>{{ s.verifier.verifier_name }}</strong><span>{{ s.verifier.organisation || s.verifier.verifier_email }}</span></div>
          </div>
          <div class="exp" [class.soon]="expiresSoon()"><vc-icon name="hourglass" [size]="14" />Access until {{ s.verifier.expires_at | day: true }}</div>
        }
      </div>
      @if (session()) {
        <nav class="tabs in" aria-label="Workspace sections">
          @for (t of nav(); track t.key) {
            <button [class.on]="section() === t.key" (click)="go(t.key)">
              <vc-icon [name]="t.icon" [size]="15" />{{ t.label }}
              @if (t.count) { <span class="c">{{ t.count }}</span> }
            </button>
          }
        </nav>
      }
    </header>

    <main class="in body">
      @if (state() === 'loading') {
        <section class="card"><vc-loading [rows]="6" /></section>
      } @else if (state() === 'error') {
        <section class="card gate">
          <span class="gi" [class]="'gi ' + gate().tone"><vc-icon [name]="gate().icon" [size]="26" /></span>
          <h1>{{ gate().title }}</h1>
          <p>{{ gate().text }}</p>
          @if (errorMsg()) { <p class="small subtle">{{ errorMsg() }}</p> }
          <div class="ga">
            @if (gate().retry) { <button class="btn btn-secondary" (click)="start()"><vc-icon name="refresh" />Try again</button> }
          </div>
          <p class="small subtle foot">Review links are personal, time-limited and can be withdrawn by the project team. Contact the person who sent you the link for a new one.</p>
        </section>
      } @else if (session(); as s) {
        @switch (section()) {
          @case ('summary') {
            <div class="intro">
              <div class="ey">Verification package v{{ s.package.version }} \xB7 {{ s.package.summary.project_code }}</div>
              <h1>{{ projectName() }}</h1>
              <p class="muted">Monitoring period <strong>{{ s.package.summary.period_label }}</strong>, {{ s.package.summary.period_start | day }} \u2013 {{ s.package.summary.period_end | day }}.
                Issued by {{ s.package.summary.generated_by }} on {{ s.package.created_at | day }}.</p>
            </div>

            @if (s.status !== 'in_review') {
              <vc-callout [tone]="s.status === 'verified' ? 'ok' : 'warn'" [icon]="s.status === 'verified' ? 'verified' : 'flag'" class="mb">
                You concluded this review: <strong>{{ s.status === 'verified' ? 'verified' : 'findings raised' }}</strong>. The workspace stays open, read-only, until the link expires.
              </vc-callout>
            }

            <div class="figs">
              <div class="card fig acc">
                <div class="fl">Net credits claimed <vc-dc cls="CALCULATED" /></div>
                <div class="fv num">{{ s.package.summary.net_credits_t_co2e | num: 1 }}<small>tCO\u2082e</small></div>
              </div>
              <div class="card fig"><div class="fl">Emission reductions</div><div class="fv num">{{ s.package.summary.reductions_t_co2e | num: 1 }}<small>t</small></div></div>
              <div class="card fig"><div class="fl">Carbon removals</div><div class="fv num">{{ s.package.summary.removals_t_co2e | num: 1 }}<small>t</small></div></div>
              <div class="card fig"><div class="fl">Result before uncertainty</div><div class="fv num">{{ s.package.summary.net_before_uncertainty_t_co2e | num: 1 }}<small>t</small></div></div>
              <div class="card fig"><div class="fl">Uncertainty deduction</div><div class="fv num">{{ s.package.summary.uncertainty_deduction_t_co2e | num: 1 }}<small>t</small></div></div>
              <div class="card fig"><div class="fl">Non-permanence buffer</div><div class="fv num">{{ s.package.summary.buffer_t_co2e | num: 1 }}<small>t</small></div></div>
            </div>

            <div class="grid grid-2 two">
              <section class="card">
                <div class="card-head"><h3>Scope and methodology</h3></div>
                <div class="card-body">
                  @if (pkg(); as p) {
                    <dl class="kv">
                      <dt>Methodology</dt><dd>{{ methodology() }}</dd>
                      <dt>Rules applied</dt><dd class="num">{{ p['methodology']?.rules?.length ?? 0 }}</dd>
                      <dt>Fields \xB7 zones</dt><dd class="num">{{ p['fields']?.length ?? 0 }} \xB7 {{ p['strata']?.length ?? 0 }}</dd>
                      <dt>Soil cores \xB7 layers</dt><dd class="num">{{ p['samples']?.length ?? 0 }} \xB7 {{ p['soil_layers']?.length ?? 0 }}</dd>
                      <dt>Lab results</dt><dd class="num">{{ p['lab_results']?.length ?? 0 }} ({{ usedResults() }} used in the calculation)</dd>
                      <dt>Custody events</dt><dd class="num">{{ p['custody_events']?.length ?? 0 }}</dd>
                      <dt>Referenced files</dt><dd class="num">{{ p['document_index']?.length ?? 0 }}</dd>
                      <dt>Quality findings</dt><dd class="num">{{ p['qa_findings']?.length ?? 0 }} recorded</dd>
                      <dt>Engine version</dt><dd>{{ p['metadata']?.engine_version }}</dd>
                    </dl>
                  } @else if (pkgError()) {
                    <vc-error title="Couldn't read the package" [message]="pkgError()!" />
                  } @else { <vc-loading [rows]="5" /> }
                </div>
                <div class="card-foot">
                  <button class="btn btn-secondary btn-sm" (click)="download('json')"><vc-icon name="file-json" [size]="14" />Download package JSON</button>
                  @if (s.package.pdf_file_id) { <button class="btn btn-secondary btn-sm" (click)="download('pdf')"><vc-icon name="download" [size]="14" />PDF report</button> }
                </div>
              </section>

              <section class="card">
                <div class="card-head"><h3>Package fingerprint</h3>
                  @if (s.integrity.intact) { <span class="ok"><vc-icon name="shield-check" [size]="14" />Intact</span> }
                  @else { <span class="bad"><vc-icon name="shield-alert" [size]="14" />Does not match</span> }
                </div>
                <div class="card-body">
                  <vc-hash [value]="s.package.sha256" [full]="true" class="fh" />
                  @if (!s.integrity.intact) {
                    <vc-callout tone="danger" icon="shield-alert" class="mt">The stored package no longer matches the fingerprint recorded at issue. Raise this as a finding.</vc-callout>
                  }
                  <p class="small muted mt">This SHA-256 fingerprint is printed on every page of the PDF. To confirm independently that the JSON you downloaded is the one that was issued:</p>
                  <ol class="how small">
                    <li>Download the package JSON.</li>
                    <li>Remove the single field <code>metadata.sha256</code>.</li>
                    <li>Serialise with sorted keys and no spaces (<code>","</code> and <code>":"</code> separators), UTF-8.</li>
                    <li>Compute SHA-256. It must equal the fingerprint above.</li>
                  </ol>
                  <div class="code">
                    <pre>{{ snippet }}</pre>
                    <button class="btn btn-ghost btn-sm" (click)="copy(snippet)"><vc-icon [name]="copied() ? 'check' : 'copy'" [size]="13" />{{ copied() ? 'Copied' : 'Copy' }}</button>
                  </div>
                </div>
              </section>
            </div>
          }

          @case ('evidence') {
            <div class="intro"><h2>Evidence explorer</h2><p class="muted small">Browse the sealed records. Open certificates and photos, and raise a question on any item.</p></div>
            @if (pkg(); as p) {
              <vc-evidence-explorer [pkg]="p" [askable]="s.status === 'in_review'" (open)="openFile($event)" (ask)="startAsk($event)" />
            } @else if (pkgError()) { <vc-error title="Couldn't read the package" [message]="pkgError()!" /> }
            @else { <section class="card"><vc-loading [rows]="6" /></section> }
          }

          @case ('provenance') {
            <div class="intro"><h2>Provenance</h2><p class="muted small">How the claimed figure was built: every rule, term, zone, site, core, layer, lab result, certificate and custody event behind it.</p></div>
            <section class="card">
              @if (provLoading()) { <vc-loading [rows]="8" /> }
              @else if (provError()) { <div class="card-body"><vc-error title="Couldn't load provenance" [message]="provError()!" /></div> }
              @else if (prov(); as p) {
                <vc-provenance-tree [data]="p" [askable]="s.status === 'in_review'" (openFile)="openFile({ id: $event.id, filename: $event.filename ?? 'file' })" (ask)="startAsk($event)" />
              }
            </section>
          }

          @case ('queries') {
            <div class="intro row">
              <div><h2>Queries</h2><p class="muted small">Questions go to the project team. Their answers appear here.</p></div>
              <span class="spacer"></span>
              @if (s.status === 'in_review') { <button class="btn btn-primary" (click)="startAsk({ type: 'package', id: '', label: 'The package as a whole' })"><vc-icon name="question" />Ask a question</button> }
            </div>
            <section class="card">
              @if (qLoading()) { <vc-loading [rows]="4" /> }
              @else if (qError()) { <div class="card-body"><vc-error title="Couldn't load your queries" [message]="qError()!" /></div> }
              @else if (!questions().length) {
                <vc-empty icon="message" title="No questions raised" text="Use \u201CRaise a question\u201D on any record in the evidence explorer or provenance tree, or ask about the package as a whole." />
              } @else {
                <ul class="qs">
                  @for (q of questions(); track q.id) {
                    <li>
                      <div class="qh"><vc-badge [status]="q.status" /><span class="qsubj">{{ subject(q) }}</span><span class="spacer"></span><span class="subtle small">{{ q.created_at | day: true }}</span></div>
                      <p class="qq">{{ q.question }}</p>
                      @if (q.answer) {
                        <div class="qa"><vc-icon name="reply" [size]="14" /><div><p>{{ q.answer }}</p><span class="subtle small">Project team \xB7 {{ q.answered_at | day: true }}</span></div></div>
                      } @else { <p class="small subtle wait"><vc-icon name="clock" [size]="13" />Waiting for the project team</p> }
                    </li>
                  }
                </ul>
              }
            </section>
          }

          @case ('decision') {
            <div class="intro"><h2>Decision</h2><p class="muted small">Record the outcome of your review. This is final for this link and is added to the audit trail.</p></div>
            @if (s.status !== 'in_review') {
              <section class="card concluded">
                <span class="gi" [class]="'gi ' + (s.status === 'verified' ? 'ok' : 'warn')"><vc-icon [name]="s.status === 'verified' ? 'verified' : 'flag'" [size]="24" /></span>
                <h2>{{ s.status === 'verified' ? 'Verified' : 'Findings raised' }}</h2>
                <p class="muted">You concluded this review. The project team has been informed.</p>
              </section>
            } @else {
              <section class="card">
                <div class="card-body dec">
                  <label class="opt" [class.on]="decision === 'verified'">
                    <input type="radio" name="d" value="verified" [(ngModel)]="decision" />
                    <vc-icon name="verified" [size]="20" />
                    <div><strong>Verified</strong><span>The claim is supported by the evidence, within the methodology's requirements.</span></div>
                  </label>
                  <label class="opt" [class.on]="decision === 'findings'">
                    <input type="radio" name="d" value="findings" [(ngModel)]="decision" />
                    <vc-icon name="flag" [size]="20" />
                    <div><strong>Findings</strong><span>Issues must be corrected or clarified before the claim can be verified.</span></div>
                  </label>
                  <div class="field">
                    <label>{{ decision === 'findings' ? 'Describe the findings' : 'Note (optional)' }}</label>
                    <textarea class="input" rows="4" [(ngModel)]="decisionNote" [placeholder]="decision === 'findings' ? 'e.g. Zone Z3: two cores have no lab-received custody event; certificate for layer L-104 is unsigned.' : 'Any remarks for the record'"></textarea>
                  </div>
                  @if (openQuestions() > 0) {
                    <vc-callout tone="warn" icon="alert">{{ openQuestions() }} of your questions {{ openQuestions() === 1 ? 'is' : 'are' }} still unanswered.</vc-callout>
                  }
                </div>
                <div class="card-foot">
                  <button class="btn btn-primary" [disabled]="!decisionValid()" (click)="confirmOpen.set(true)">Record decision</button>
                </div>
              </section>
            }
          }
        }
      }
    </main>

    <footer class="in pf small subtle">
      Varsapradaya Carbon \xB7 @if (session(); as s) { verification package {{ s.package.sha256.slice(0, 12) }} \xB7 }You are viewing a read-only copy; nothing you do here changes the project's records.
    </footer>

    <!-- ask -->
    <vc-modal [open]="!!asking()" (closed)="asking.set(null)" title="Raise a question" subtitle="The project team is notified and answers here." width="560px">
      @if (asking(); as a) {
        <div class="subj"><vc-icon name="corner-down-right" [size]="14" />{{ a.label }}</div>
        <div class="field"><label>Your question</label>
          <textarea class="input" rows="5" [(ngModel)]="question" placeholder="Be specific: what you checked, what you expected, and what evidence would resolve it."></textarea>
          <span class="hint">At least 5 characters.</span>
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="asking.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || question.trim().length < 5" (click)="sendQuestion()"><vc-icon name="send" />{{ busy() ? 'Sending\u2026' : 'Send question' }}</button>
      </ng-container>
    </vc-modal>

    <!-- confirm decision -->
    <vc-modal [(open)]="confirmOpen" title="Confirm your decision" width="500px">
      <p>You are recording <strong>{{ decision === 'verified' ? 'Verified' : 'Findings' }}</strong> for package v{{ session()?.package?.version }}
        (fingerprint <code>{{ session()?.package?.sha256?.slice(0, 12) }}\u2026</code>).</p>
      <p class="small muted mt">After this you can no longer raise questions with this link. The decision is added to the project's audit trail under your name.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="confirmOpen.set(false)">Go back</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="decide()">{{ busy() ? 'Recording\u2026' : 'Confirm decision' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ['/* angular:styles/component:scss;6d5f3e5c0bdd77e1;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\verifier\\verifier.page.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  background: var(--bg);\n}\n.in {\n  width: 100%;\n  max-width: 1320px;\n  margin: 0 auto;\n  padding-left: 32px;\n  padding-right: 32px;\n}\n@media (max-width: 800px) {\n  .in {\n    padding-left: 16px;\n    padding-right: 16px;\n  }\n}\n.top {\n  position: sticky;\n  top: 0;\n  z-index: 40;\n  background: var(--surface);\n  border-top: 3px solid var(--forest-600);\n  border-bottom: 1px solid var(--border);\n  box-shadow: var(--shadow-sm);\n}\n.top > .in:first-child {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  height: 64px;\n}\n.div {\n  width: 1px;\n  height: 28px;\n  background: var(--border);\n}\n.ws {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.ws strong {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--stone-900);\n}\n.ws span {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.spacer {\n  flex: 1;\n}\n.who {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.who div {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.who strong {\n  font-size: 13px;\n}\n.who span {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.av {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--forest-100);\n  color: var(--forest-700);\n}\n.exp {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--stone-600);\n  padding: 5px 10px;\n  border-radius: 999px;\n  background: var(--sand-100);\n  border: 1px solid var(--border);\n}\n.exp.soon {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n  border-color: #f1dcae;\n}\n@media (max-width: 900px) {\n  .ws span,\n  .who div,\n  .div {\n    display: none;\n  }\n}\n.tabs {\n  display: flex;\n  gap: 4px;\n  overflow-x: auto;\n}\n.tabs button {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  height: 44px;\n  padding: 0 14px;\n  border: 0;\n  background: none;\n  font: inherit;\n  font-weight: 500;\n  color: var(--text-2);\n  cursor: pointer;\n  white-space: nowrap;\n}\n.tabs button:hover {\n  color: var(--text);\n}\n.tabs button.on {\n  color: var(--forest-700);\n}\n.tabs button.on::after {\n  content: "";\n  position: absolute;\n  left: 10px;\n  right: 10px;\n  bottom: 0;\n  height: 2px;\n  border-radius: 2px;\n  background: var(--forest-600);\n}\n.tabs .c {\n  display: inline-grid;\n  place-items: center;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: var(--amber-100);\n  color: var(--amber-600);\n  font-size: 11px;\n}\n.body {\n  flex: 1;\n  padding-top: 28px;\n  padding-bottom: 40px;\n}\n.intro {\n  margin-bottom: 20px;\n}\n.intro.row {\n  display: flex;\n  align-items: flex-end;\n}\n.ey {\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--forest-500);\n  margin-bottom: 6px;\n}\n.intro h1 {\n  font-size: 26px;\n}\n.intro p {\n  margin-top: 6px;\n}\n.mb {\n  display: flex;\n  margin-bottom: 16px;\n}\n.figs {\n  display: grid;\n  grid-template-columns: 1.4fr repeat(5, minmax(0, 1fr));\n  gap: 12px;\n}\n@media (max-width: 1200px) {\n  .figs {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n@media (max-width: 700px) {\n  .figs {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n.fig {\n  padding: 16px 18px;\n}\n.fl {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 12.5px;\n  color: var(--text-2);\n  font-weight: 500;\n}\n.fv {\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 6px;\n}\n.fv small {\n  font-size: 12px;\n  color: var(--text-3);\n  margin-left: 5px;\n  font-weight: 500;\n}\n.fig.acc {\n  background:\n    linear-gradient(\n      135deg,\n      var(--forest-800),\n      var(--forest-600));\n  border-color: var(--forest-700);\n}\n.fig.acc .fl {\n  color: rgba(255, 255, 255, 0.78);\n}\n.fig.acc .fv {\n  color: #fff;\n  font-size: 30px;\n}\n.fig.acc small {\n  color: rgba(255, 255, 255, 0.7);\n}\n.two {\n  margin-top: 16px;\n}\n.ok,\n.bad {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  font-weight: 500;\n  padding: 3px 9px;\n  border-radius: 999px;\n}\n.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.bad {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.fh {\n  word-break: break-all;\n}\n.mt {\n  margin-top: 12px;\n  display: block;\n}\n.how {\n  margin: 8px 0 12px;\n  padding-left: 18px;\n  color: var(--stone-700);\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n}\n.code {\n  position: relative;\n  background: var(--forest-950);\n  border-radius: var(--radius-sm);\n  padding: 12px 14px;\n}\n.code pre {\n  margin: 0;\n  font: 12px/1.55 var(--mono);\n  color: #dfe9e2;\n  white-space: pre;\n  overflow-x: auto;\n}\n.code button {\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  color: #c3dbca;\n}\n.code button:hover {\n  background: rgba(255, 255, 255, 0.08) !important;\n}\n.gate {\n  max-width: 560px;\n  margin: 48px auto;\n  padding: 40px 36px;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n}\n.gate h1 {\n  font-size: 22px;\n}\n.gate p {\n  color: var(--text-2);\n  max-width: 440px;\n}\n.gi {\n  display: grid;\n  place-items: center;\n  width: 60px;\n  height: 60px;\n  border-radius: 16px;\n  margin-bottom: 6px;\n}\n.gi.danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.gi.warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.gi.neutral {\n  background: var(--sand-200);\n  color: var(--stone-600);\n}\n.gi.ok {\n  background: var(--ok-soft);\n  color: var(--forest-600);\n}\n.ga {\n  margin-top: 8px;\n}\n.gate .foot {\n  margin-top: 18px;\n  padding-top: 16px;\n  border-top: 1px solid var(--border);\n}\n.qs {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.qs li {\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.qs li:last-child {\n  border-bottom: 0;\n}\n.qh {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}\n.qsubj {\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.qq {\n  margin-top: 8px;\n  white-space: pre-wrap;\n}\n.qa {\n  display: flex;\n  gap: 10px;\n  margin-top: 10px;\n  padding: 10px 12px;\n  border-radius: var(--radius-sm);\n  background: var(--forest-50);\n  border: 1px solid var(--forest-200);\n  color: var(--forest-600);\n}\n.qa p {\n  color: var(--stone-800);\n  white-space: pre-wrap;\n}\n.wait {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: 8px;\n}\n.dec {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  max-width: 760px;\n}\n.opt {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n  padding: 14px 16px;\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  cursor: pointer;\n}\n.opt:hover {\n  border-color: var(--stone-400);\n}\n.opt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: var(--focus);\n}\n.opt input {\n  margin-top: 3px;\n  accent-color: var(--primary);\n}\n.opt vc-icon {\n  color: var(--forest-600);\n  margin-top: 1px;\n}\n.opt div {\n  display: flex;\n  flex-direction: column;\n}\n.opt span {\n  font-size: 13px;\n  color: var(--text-2);\n}\n.concluded {\n  padding: 40px;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.subj {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 12px;\n  margin-bottom: 14px;\n  border-radius: var(--radius-sm);\n  background: var(--sand-100);\n  font-size: 13px;\n  color: var(--stone-700);\n}\n.pf {\n  padding-top: 16px;\n  padding-bottom: 24px;\n  border-top: 1px solid var(--border);\n}\n/*# sourceMappingURL=verifier.page.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerifierPage, { className: "VerifierPage", filePath: "src/app/features/verifier/verifier.page.ts", lineNumber: 342 });
})();

// src/app/features/verifier/verifier.routes.ts
var verifier_routes_default = [{ path: "", component: VerifierPage, title: "Independent verification \xB7 Varsapradaya Carbon" }];
export {
  verifier_routes_default as default
};
//# debugId=e52c4bb7-68d2-50c9-9d63-bdfa66ae9a04
//# sourceMappingURL=chunk-37N37UAO.js.map
