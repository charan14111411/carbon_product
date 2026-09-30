import {
  CalcBlocker
} from "./chunk-MSGBQL24.js";
import {
  People,
  saveBlob
} from "./chunk-5SRO2YLJ.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NumberValueAccessor
} from "./chunk-WOW2CD4M.js";
import {
  AgoPipe,
  DayPipe,
  HumanPipe,
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
  Hash,
  Loading,
  Modal,
  PageHeader,
  Tabs
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  inject,
  input,
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
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/verification/verification.types.ts
var PACKAGE_SECTIONS = [
  { key: "metadata", label: "Metadata", text: "Schema, versions, period and the two fingerprints." },
  { key: "project", label: "Project and programme", text: "The project record and the programme it belongs to." },
  { key: "methodology", label: "Methodology rules", text: "The approved rule pack and every rule with its source section and page." },
  { key: "fields", label: "Fields", text: "Boundaries, areas, crops and soil types of every field in scope." },
  { key: "enrolments", label: "Enrolments", text: "Eligibility and enrolment decisions for each field." },
  { key: "land_use", label: "Land-use history", text: "Prior land use with supporting evidence." },
  { key: "practices", label: "Practices", text: "Latest version of every recorded management practice." },
  { key: "strata", label: "Zones", text: "Stratification in effect for the monitoring campaign." },
  { key: "campaigns", label: "Sampling campaigns", text: "Baseline and monitoring campaigns and their design." },
  { key: "sites", label: "Sampling sites", text: "Permanent sites and their locations." },
  { key: "samples", label: "Samples", text: "Every core with GPS, depth and photo fingerprints." },
  { key: "soil_layers", label: "Soil layers", text: "Depth increments of each core." },
  { key: "custody_events", label: "Chain of custody", text: "Every hand-over from field to lab, with seal checks." },
  { key: "labs", label: "Laboratories", text: "Labs that analysed the samples." },
  { key: "lab_results", label: "Lab results", text: "All results, marking the exact versions used in the calculation." },
  { key: "terms", label: "Decided terms", text: "Project-level estimates with variance and source." },
  { key: "calculation", label: "Calculation", text: "Frozen inputs, rules, full results and status history." },
  { key: "qa_findings", label: "Quality findings", text: "Every quality finding raised for the project, open or resolved." },
  { key: "document_index", label: "Document index", text: "Every referenced file with its SHA-256 fingerprint." }
];

// src/app/features/verification/package-detail.page.ts
var _c0 = (a0) => ["/app/calculations", a0];
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.id;
function PackageDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2);
    \u0275\u0275element(1, "vc-loading", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function PackageDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function PackageDetailPage_Conditional_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.download("pdf"));
    });
    \u0275\u0275element(1, "vc-icon", 39);
    \u0275\u0275text(2, "PDF report");
    \u0275\u0275elementEnd();
  }
}
function PackageDetailPage_Conditional_5_Case_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "vc-icon", 40);
    \u0275\u0275elementStart(2, "div")(3, "strong");
    \u0275\u0275text(4, "Intact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "ago");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("The stored JSON and PDF match the fingerprint recorded at issue. Checked ", \u0275\u0275pipeBind1(7, 2, ctx_r0.checkedAt()), ".");
  }
}
function PackageDetailPage_Conditional_5_Case_17_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(", PDF ", ctx_r0.integrity()?.pdf_file_intact ? "intact" : "altered");
  }
}
function PackageDetailPage_Conditional_5_Case_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "vc-icon", 41);
    \u0275\u0275elementStart(2, "div")(3, "strong");
    \u0275\u0275text(4, "Tamper alert");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275conditionalCreate(7, PackageDetailPage_Conditional_5_Case_17_Conditional_7_Template, 1, 1);
    \u0275\u0275text(8, ". Recomputed: ");
    \u0275\u0275elementStart(9, "code");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("The stored package does not match its fingerprint. JSON file ", ctx_r0.integrity()?.json_file_intact ? "intact" : "altered");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.integrity()?.pdf_file_intact !== null ? 7 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", (ctx_r0.integrity()?.recomputed_sha256 ?? "unreadable").slice(0, 16), "\u2026");
  }
}
function PackageDetailPage_Conditional_5_Case_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 19);
    \u0275\u0275text(1, "Recompute the fingerprint from the stored files to prove nothing has changed since the package was issued.");
    \u0275\u0275elementEnd();
  }
}
function PackageDetailPage_Conditional_5_Case_61_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275element(1, "vc-error", 46);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.contentsError());
  }
}
function PackageDetailPage_Conditional_5_Case_61_For_9_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const s_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", ctx[s_r4.key] ?? "\u2014", " ");
  }
}
function PackageDetailPage_Conditional_5_Case_61_For_9_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 50);
    \u0275\u0275text(1, "\u2026");
    \u0275\u0275elementEnd();
  }
}
function PackageDetailPage_Conditional_5_Case_61_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 47);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 48)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 49);
    \u0275\u0275conditionalCreate(9, PackageDetailPage_Conditional_5_Case_61_For_9_Conditional_9_Template, 1, 1)(10, PackageDetailPage_Conditional_5_Case_61_For_9_Conditional_10_Template, 2, 0, "span", 50);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_17_0;
    const s_r4 = ctx.$implicit;
    const \u0275$index_166_r5 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_166_r5 + 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r4.text);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_17_0 = ctx_r0.sectionCounts()) ? 9 : 10, tmp_17_0);
  }
}
function PackageDetailPage_Conditional_5_Case_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 42)(2, "h3");
    \u0275\u0275text(3, "What the package contains");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 43);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(6, PackageDetailPage_Conditional_5_Case_61_Conditional_6_Template, 2, 1, "div", 44);
    \u0275\u0275elementStart(7, "ol", 45);
    \u0275\u0275repeaterCreate(8, PackageDetailPage_Conditional_5_Case_61_For_9_Template, 11, 4, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r6 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate3("", p_r6.summary.samples, " samples \xB7 ", p_r6.summary.lab_results, " lab results \xB7 ", p_r6.summary.documents, " referenced files");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.contentsError() ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.sections);
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 54);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Case_62_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.startGrant());
    });
    \u0275\u0275element(1, "vc-icon", 55);
    \u0275\u0275text(2, "Give access");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275element(1, "vc-error", 56);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.accessError());
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 57);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Case_62_Conditional_9_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.startGrant());
    });
    \u0275\u0275element(1, "vc-icon", 58);
    \u0275\u0275text(2, "Give access");
    \u0275\u0275elementEnd();
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 52);
    \u0275\u0275conditionalCreate(1, PackageDetailPage_Conditional_5_Case_62_Conditional_9_Conditional_1_Template, 3, 0, "button", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canIssue() ? 1 : -1);
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 62);
    \u0275\u0275pipe(1, "day");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "ago");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("title", \u0275\u0275pipeBind2(1, 2, a_r9.last_opened_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 5, a_r9.last_opened_at));
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 50);
    \u0275\u0275text(1, "Never");
    \u0275\u0275elementEnd();
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 64);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const a_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.revoking.set(a_r9));
    });
    \u0275\u0275element(1, "vc-icon", 65);
    \u0275\u0275text(2, "Revoke");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 43);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "vc-badge", 60);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 61);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 61);
    \u0275\u0275conditionalCreate(16, PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Conditional_16_Template, 4, 7, "span", 62)(17, PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Conditional_17_Template, 2, 0, "span", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275element(19, "vc-badge", 60);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 28);
    \u0275\u0275conditionalCreate(21, PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Conditional_21_Template, 3, 1, "button", 63);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r9 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r9.verifier_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r9.verifier_email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r9.organisation || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275property("status", ctx_r0.linkTone(a_r9.link_status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 9, a_r9.link_status));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(14, 11, a_r9.expires_at, true));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(a_r9.last_opened_at ? 16 : 17);
    \u0275\u0275advance(3);
    \u0275\u0275property("status", a_r9.review_status);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.canIssue() && a_r9.link_status === "active" ? 21 : -1);
  }
}
function PackageDetailPage_Conditional_5_Case_62_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "table", 59)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Verifier");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Organisation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Link");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Expires");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Last opened");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Review");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, PackageDetailPage_Conditional_5_Case_62_Conditional_10_For_19_Template, 22, 14, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r0.access());
  }
}
function PackageDetailPage_Conditional_5_Case_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 42)(2, "h3");
    \u0275\u0275text(3, "Verifier access");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 43);
    \u0275\u0275text(5, "Time-limited, read-only links. No sign-in needed; every opening is logged.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PackageDetailPage_Conditional_5_Case_62_Conditional_6_Template, 3, 1, "button", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, PackageDetailPage_Conditional_5_Case_62_Conditional_7_Template, 1, 1, "vc-loading", 4)(8, PackageDetailPage_Conditional_5_Case_62_Conditional_8_Template, 2, 1, "div", 44)(9, PackageDetailPage_Conditional_5_Case_62_Conditional_9_Template, 2, 1, "vc-empty", 52)(10, PackageDetailPage_Conditional_5_Case_62_Conditional_10_Template, 20, 0, "div", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r0.canIssue() ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.accessLoading() ? 7 : ctx_r0.accessError() ? 8 : !ctx_r0.access().length ? 9 : 10);
  }
}
function PackageDetailPage_Conditional_5_Case_63_For_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 69);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u201C", d_r11.question, "\u201D");
  }
}
function PackageDetailPage_Conditional_5_Case_63_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 66)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, PackageDetailPage_Conditional_5_Case_63_For_1_Conditional_6_Template, 2, 1, "p", 69);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r11 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("tone", d_r11.subject_id === "verified" ? "ok" : "warn")("icon", d_r11.subject_id === "verified" ? "verified" : "flag");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r0.accessName(d_r11.access_id), " concluded the review: ", d_r11.subject_id === "verified" ? "verified" : "findings raised");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" \xB7 ", \u0275\u0275pipeBind2(5, 6, d_r11.created_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(d_r11.question && d_r11.question !== d_r11.subject_id ? 6 : -1);
  }
}
function PackageDetailPage_Conditional_5_Case_63_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function PackageDetailPage_Conditional_5_Case_63_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275element(1, "vc-error", 70);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.queriesError());
  }
}
function PackageDetailPage_Conditional_5_Case_63_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 67);
  }
}
function PackageDetailPage_Conditional_5_Case_63_Conditional_11_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 76);
    \u0275\u0275element(1, "vc-icon", 78);
    \u0275\u0275elementStart(2, "div")(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 43);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "day");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const q_r12 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(q_r12.answer);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", q_r12.answered_by ?? "Project team", " \xB7 ", \u0275\u0275pipeBind2(7, 4, q_r12.answered_at, true));
  }
}
function PackageDetailPage_Conditional_5_Case_63_Conditional_11_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 77)(1, "textarea", 79);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function PackageDetailPage_Conditional_5_Case_63_Conditional_11_For_2_Conditional_12_Template_textarea_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r13);
      const q_r12 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.setDraft(q_r12.id, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 80);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Case_63_Conditional_11_For_2_Conditional_12_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r13);
      const q_r12 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.answer(q_r12));
    });
    \u0275\u0275element(3, "vc-icon", 81);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const q_r12 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.drafts()[q_r12.id] ?? "");
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", (ctx_r0.drafts()[q_r12.id] ?? "").trim().length < 2 || ctx_r0.answering() === q_r12.id);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.answering() === q_r12.id ? "Sending\u2026" : "Send answer", " ");
  }
}
function PackageDetailPage_Conditional_5_Case_63_Conditional_11_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "div", 72);
    \u0275\u0275element(2, "vc-badge", 60);
    \u0275\u0275elementStart(3, "span", 73);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "span", 74);
    \u0275\u0275elementStart(6, "span", 43);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p", 75);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, PackageDetailPage_Conditional_5_Case_63_Conditional_11_For_2_Conditional_11_Template, 8, 7, "div", 76)(12, PackageDetailPage_Conditional_5_Case_63_Conditional_11_For_2_Conditional_12_Template, 5, 4, "div", 77);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const q_r12 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("open", q_r12.status === "open");
    \u0275\u0275advance(2);
    \u0275\u0275property("status", q_r12.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.subject(q_r12));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r0.accessName(q_r12.access_id), " \xB7 ", \u0275\u0275pipeBind1(8, 8, q_r12.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(q_r12.question);
    \u0275\u0275advance();
    \u0275\u0275conditional(q_r12.answer ? 11 : ctx_r0.canAnswer() ? 12 : -1);
  }
}
function PackageDetailPage_Conditional_5_Case_63_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 68);
    \u0275\u0275repeaterCreate(1, PackageDetailPage_Conditional_5_Case_63_Conditional_11_For_2_Template, 13, 10, "li", 71, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.questions());
  }
}
function PackageDetailPage_Conditional_5_Case_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, PackageDetailPage_Conditional_5_Case_63_For_1_Template, 7, 9, "vc-callout", 66, _forTrack1);
    \u0275\u0275elementStart(2, "section", 2)(3, "div", 42)(4, "h3");
    \u0275\u0275text(5, "Questions from verifiers");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 43);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(8, PackageDetailPage_Conditional_5_Case_63_Conditional_8_Template, 1, 1, "vc-loading", 4)(9, PackageDetailPage_Conditional_5_Case_63_Conditional_9_Template, 2, 1, "div", 44)(10, PackageDetailPage_Conditional_5_Case_63_Conditional_10_Template, 1, 0, "vc-empty", 67)(11, PackageDetailPage_Conditional_5_Case_63_Conditional_11_Template, 3, 0, "ul", 68);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r0.decisions());
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r0.openCount(), " open");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.queriesLoading() ? 8 : ctx_r0.queriesError() ? 9 : !ctx_r0.questions().length ? 10 : 11);
  }
}
function PackageDetailPage_Conditional_5_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-callout", 82)(1, "strong");
    \u0275\u0275text(2, "This link is shown only once.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 83)(5, "code");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 54);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Conditional_65_Template_button_click_7_listener() {
      const g_r15 = \u0275\u0275restoreView(_r14);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.copy(g_r15.link));
    });
    \u0275\u0275element(8, "vc-icon", 84);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 85);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r15 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" We store only a fingerprint of it, so it can't be recovered. Copy it and send it to ", g_r15.name, " through a secure channel.");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(g_r15.link);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", ctx_r0.copied() ? "check" : "copy")("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.copied() ? "Copied" : "Copy link");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Valid until ", \u0275\u0275pipeBind2(12, 6, g_r15.expires, true), ". You can revoke it at any time from this page.");
  }
}
function PackageDetailPage_Conditional_5_Conditional_66_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 92);
    \u0275\u0275element(1, "vc-error", 93);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.grantError());
  }
}
function PackageDetailPage_Conditional_5_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 86)(2, "label");
    \u0275\u0275text(3, "Verifier name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 87);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PackageDetailPage_Conditional_5_Conditional_66_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.g.verifier_name, $event) || (ctx_r0.g.verifier_name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 86)(6, "label");
    \u0275\u0275text(7, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 88);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PackageDetailPage_Conditional_5_Conditional_66_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.g.verifier_email, $event) || (ctx_r0.g.verifier_email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 86)(10, "label");
    \u0275\u0275text(11, "Organisation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 89);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PackageDetailPage_Conditional_5_Conditional_66_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.g.organisation, $event) || (ctx_r0.g.organisation = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 86)(14, "label");
    \u0275\u0275text(15, "Access for (days)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 90);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function PackageDetailPage_Conditional_5_Conditional_66_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.g.days, $event) || (ctx_r0.g.days = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 91);
    \u0275\u0275text(18, "1 to 90 days.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(19, PackageDetailPage_Conditional_5_Conditional_66_Conditional_19_Template, 2, 1, "div", 92);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.g.verifier_name);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.g.verifier_email);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.g.organisation);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.g.days);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.grantError() ? 19 : -1);
  }
}
function PackageDetailPage_Conditional_5_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 57);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Conditional_68_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r0 = \u0275\u0275nextContext(2);
      ctx_r0.grantOpen.set(false);
      return \u0275\u0275resetView(ctx_r0.afterGrantClose());
    });
    \u0275\u0275text(1, "Done");
    \u0275\u0275elementEnd();
  }
}
function PackageDetailPage_Conditional_5_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Conditional_69_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.grantOpen.set(false));
    });
    \u0275\u0275text(1, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 94);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Conditional_69_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.grant());
    });
    \u0275\u0275element(3, "vc-icon", 95);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.busy() || !ctx_r0.grantValid());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.busy() ? "Creating\u2026" : "Create link");
  }
}
function PackageDetailPage_Conditional_5_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 96);
    \u0275\u0275text(3, "This can't be undone; you can create a new link later if needed.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r19 = ctx;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", a_r19.verifier_name, " (", a_r19.organisation || a_r19.verifier_email, ") will lose access immediately. Their questions and any decision stay on record.");
  }
}
function PackageDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-page-header", 5);
    \u0275\u0275pipe(1, "day");
    \u0275\u0275elementStart(2, "button", 6);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.download("json"));
    });
    \u0275\u0275element(3, "vc-icon", 7);
    \u0275\u0275text(4, "Package JSON");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, PackageDetailPage_Conditional_5_Conditional_5_Template, 3, 0, "button", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 9)(7, "section", 10)(8, "div", 11)(9, "span", 12);
    \u0275\u0275element(10, "vc-icon", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div")(12, "div", 14);
    \u0275\u0275text(13, "Package fingerprint (SHA-256)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "vc-hash", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 16);
    \u0275\u0275conditionalCreate(16, PackageDetailPage_Conditional_5_Case_16_Template, 8, 4, "div", 17)(17, PackageDetailPage_Conditional_5_Case_17_Template, 11, 4, "div", 18)(18, PackageDetailPage_Conditional_5_Case_18_Template, 2, 0, "p", 19);
    \u0275\u0275elementStart(19, "button", 20);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.check());
    });
    \u0275\u0275element(20, "vc-icon", 21);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 22);
    \u0275\u0275text(23, " Content fingerprint ");
    \u0275\u0275elementStart(24, "code");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275text(26, " \u2014 identical evidence always gives the same content fingerprint, whichever version it is in. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "section", 23)(28, "div", 24)(29, "span");
    \u0275\u0275text(30, "Net credits");
    \u0275\u0275elementEnd();
    \u0275\u0275element(31, "vc-dc", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 26);
    \u0275\u0275text(33);
    \u0275\u0275pipe(34, "num");
    \u0275\u0275elementStart(35, "small");
    \u0275\u0275text(36, "tCO\u2082e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "dl", 27)(38, "dt");
    \u0275\u0275text(39, "Reductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "dd", 28);
    \u0275\u0275text(41);
    \u0275\u0275pipe(42, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "dt");
    \u0275\u0275text(44, "Removals");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "dd", 28);
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "dt");
    \u0275\u0275text(49, "Uncertainty deduction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "dd", 28);
    \u0275\u0275text(51);
    \u0275\u0275pipe(52, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "dt");
    \u0275\u0275text(54, "Buffer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "dd", 28);
    \u0275\u0275text(56);
    \u0275\u0275pipe(57, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(58, "a", 29);
    \u0275\u0275text(59, "Open the calculation run \u2192");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(60, "vc-tabs", 30);
    \u0275\u0275twoWayListener("activeChange", function PackageDetailPage_Conditional_5_Template_vc_tabs_activeChange_60_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.tab, $event) || (ctx_r0.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(61, PackageDetailPage_Conditional_5_Case_61_Template, 10, 4, "section", 2)(62, PackageDetailPage_Conditional_5_Case_62_Template, 11, 2, "section", 2)(63, PackageDetailPage_Conditional_5_Case_63_Template, 12, 2);
    \u0275\u0275elementStart(64, "vc-modal", 31);
    \u0275\u0275twoWayListener("openChange", function PackageDetailPage_Conditional_5_Template_vc_modal_openChange_64_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.grantOpen, $event) || (ctx_r0.grantOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("closed", function PackageDetailPage_Conditional_5_Template_vc_modal_closed_64_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.afterGrantClose());
    });
    \u0275\u0275conditionalCreate(65, PackageDetailPage_Conditional_5_Conditional_65_Template, 13, 9)(66, PackageDetailPage_Conditional_5_Conditional_66_Template, 20, 5, "div", 32);
    \u0275\u0275elementContainerStart(67, 33);
    \u0275\u0275conditionalCreate(68, PackageDetailPage_Conditional_5_Conditional_68_Template, 2, 0, "button", 34)(69, PackageDetailPage_Conditional_5_Conditional_69_Template, 5, 2);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "vc-modal", 35);
    \u0275\u0275listener("closed", function PackageDetailPage_Conditional_5_Template_vc_modal_closed_70_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.revoking.set(null));
    });
    \u0275\u0275conditionalCreate(71, PackageDetailPage_Conditional_5_Conditional_71_Template, 4, 2);
    \u0275\u0275elementContainerStart(72, 33);
    \u0275\u0275elementStart(73, "button", 36);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Template_button_click_73_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.revoking.set(null));
    });
    \u0275\u0275text(74, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "button", 37);
    \u0275\u0275listener("click", function PackageDetailPage_Conditional_5_Template_button_click_75_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.revoke());
    });
    \u0275\u0275element(76, "vc-icon", 38);
    \u0275\u0275text(77, "Revoke access");
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_21_0;
    let tmp_25_0;
    let tmp_28_0;
    const p_r6 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("title", "Verification package v" + p_r6.version)("subtitle", p_r6.summary.project_code + " \xB7 period " + p_r6.summary.period_label + " \xB7 issued by " + p_r6.summary.generated_by + " on " + \u0275\u0275pipeBind1(1, 28, p_r6.created_at));
    \u0275\u0275advance(5);
    \u0275\u0275conditional(p_r6.pdf_file_id ? 5 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", p_r6.sha256)("full", true);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_8_0 = ctx_r0.integrityState()) === "intact" ? 16 : tmp_8_0 === "tampered" ? 17 : 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.integrityState() === "checking");
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.integrityState() === "checking" ? "Checking\u2026" : "Check integrity", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", p_r6.summary.content_sha256.slice(0, 16), "\u2026");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(34, 30, p_r6.summary.net_credits_t_co2e, 1));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(42, 33, p_r6.summary.reductions_t_co2e, 1), " t");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(47, 36, p_r6.summary.removals_t_co2e, 1), " t");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(52, 39, p_r6.summary.uncertainty_deduction_t_co2e, 1), " t");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(57, 42, p_r6.summary.buffer_t_co2e, 1), " t");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(45, _c0, p_r6.run_id));
    \u0275\u0275advance(2);
    \u0275\u0275property("tabs", ctx_r0.tabs());
    \u0275\u0275twoWayProperty("active", ctx_r0.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_21_0 = ctx_r0.tab()) === "contents" ? 61 : tmp_21_0 === "access" ? 62 : tmp_21_0 === "queries" ? 63 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("open", ctx_r0.grantOpen);
    \u0275\u0275property("title", ctx_r0.granted() ? "Share this link now" : "Give a verifier access")("subtitle", ctx_r0.granted() ? "" : "The verifier gets a read-only workspace for this package only.");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_25_0 = ctx_r0.granted()) ? 65 : 66, tmp_25_0);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.granted() ? 68 : 69);
    \u0275\u0275advance(2);
    \u0275\u0275property("open", !!ctx_r0.revoking());
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_28_0 = ctx_r0.revoking()) ? 71 : -1, tmp_28_0);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.busy());
  }
}
var PackageDetailPage = class _PackageDetailPage {
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  people = inject(People);
  pkg = signal(
    null,
    ...ngDevMode ? [{ debugName: "pkg" }] : (
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
  tab = signal(
    "contents",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sections = PACKAGE_SECTIONS;
  integrity = signal(
    null,
    ...ngDevMode ? [{ debugName: "integrity" }] : (
      /* istanbul ignore next */
      []
    )
  );
  integrityState = signal(
    "idle",
    ...ngDevMode ? [{ debugName: "integrityState" }] : (
      /* istanbul ignore next */
      []
    )
  );
  checkedAt = signal(
    null,
    ...ngDevMode ? [{ debugName: "checkedAt" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sectionCounts = signal(
    null,
    ...ngDevMode ? [{ debugName: "sectionCounts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  contentsError = signal(
    null,
    ...ngDevMode ? [{ debugName: "contentsError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  access = signal(
    [],
    ...ngDevMode ? [{ debugName: "access" }] : (
      /* istanbul ignore next */
      []
    )
  );
  accessLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "accessLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  accessError = signal(
    null,
    ...ngDevMode ? [{ debugName: "accessError" }] : (
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
  queriesLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "queriesLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  queriesError = signal(
    null,
    ...ngDevMode ? [{ debugName: "queriesError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  drafts = signal(
    {},
    ...ngDevMode ? [{ debugName: "drafts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  answering = signal(
    null,
    ...ngDevMode ? [{ debugName: "answering" }] : (
      /* istanbul ignore next */
      []
    )
  );
  grantOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "grantOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  granted = signal(
    null,
    ...ngDevMode ? [{ debugName: "granted" }] : (
      /* istanbul ignore next */
      []
    )
  );
  grantError = signal(
    null,
    ...ngDevMode ? [{ debugName: "grantError" }] : (
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
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  revoking = signal(
    null,
    ...ngDevMode ? [{ debugName: "revoking" }] : (
      /* istanbul ignore next */
      []
    )
  );
  g = { verifier_name: "", verifier_email: "", organisation: "", days: 30 };
  canIssue = computed(
    () => this.auth.can("package.issue"),
    ...ngDevMode ? [{ debugName: "canIssue" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canAnswer = computed(
    () => this.auth.can("package.issue", "calc.run"),
    ...ngDevMode ? [{ debugName: "canAnswer" }] : (
      /* istanbul ignore next */
      []
    )
  );
  questions = computed(
    () => this.queries().filter((q) => q.subject_type !== "decision"),
    ...ngDevMode ? [{ debugName: "questions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  decisions = computed(
    () => this.queries().filter((q) => q.subject_type === "decision"),
    ...ngDevMode ? [{ debugName: "decisions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  openCount = computed(
    () => this.questions().filter((q) => q.status === "open").length,
    ...ngDevMode ? [{ debugName: "openCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "contents", label: "Contents" },
      { key: "access", label: "Verifier access", count: this.accessLoading() ? null : this.access().length },
      { key: "queries", label: "Queries", count: this.queriesLoading() ? null : this.openCount() }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.people.load();
    effect(() => {
      if (this.id())
        this.load();
    });
  }
  load() {
    const id = this.id();
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/packages/${id}`).subscribe({
      next: (p) => {
        this.pkg.set(p);
        this.loading.set(false);
        this.loadContents(p);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
    this.loadAccess();
    this.loadQueries();
  }
  loadContents(p) {
    this.api.blob(`/evidence/${p.json_file_id}/content`).subscribe({
      next: async (b) => {
        try {
          const doc = JSON.parse(await b.text());
          const c = {};
          for (const s of PACKAGE_SECTIONS) {
            const v = doc[s.key];
            c[s.key] = Array.isArray(v) ? v.length : v && typeof v === "object" ? Object.keys(v).length : 0;
          }
          const meth = doc["methodology"];
          if (meth?.rules)
            c["methodology"] = meth.rules.length;
          this.sectionCounts.set(c);
        } catch {
          this.contentsError.set("The package file could not be parsed.");
        }
      },
      error: (e) => this.contentsError.set(e.message)
    });
  }
  loadAccess() {
    this.accessLoading.set(true);
    this.accessError.set(null);
    this.api.get(`/packages/${this.id()}/verifier-access`).subscribe({
      next: (a) => {
        this.access.set(a);
        this.accessLoading.set(false);
      },
      error: (e) => {
        this.accessError.set(e.message);
        this.accessLoading.set(false);
      }
    });
  }
  loadQueries() {
    this.queriesLoading.set(true);
    this.queriesError.set(null);
    this.api.get(`/packages/${this.id()}/queries`).subscribe({
      next: (q) => {
        this.queries.set([...q].reverse());
        this.queriesLoading.set(false);
      },
      error: (e) => {
        this.queriesError.set(e.message);
        this.queriesLoading.set(false);
      }
    });
  }
  check() {
    this.integrityState.set("checking");
    this.api.get(`/packages/${this.id()}/verify`).subscribe({
      next: (r) => {
        this.integrity.set(r);
        this.integrityState.set(r.intact ? "intact" : "tampered");
        this.checkedAt.set((/* @__PURE__ */ new Date()).toISOString());
      },
      error: (e) => {
        this.integrityState.set("idle");
        this.toast.apiError(e, "Couldn't check integrity");
      }
    });
  }
  download(kind) {
    const p = this.pkg();
    const id = kind === "json" ? p?.json_file_id : p?.pdf_file_id;
    if (!p || !id)
      return;
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: (b) => saveBlob(b, `${p.summary.project_code}_${p.summary.period_label}_v${p.version}.${kind}`),
      error: (e) => this.toast.apiError(e, "Couldn't download")
    });
  }
  /**
   * The shared auth interceptor skips every URL starting with /api/verifier (meant for the token portal),
   * which also matches the team endpoints /api/verifier-access and /api/verifier-queries. Send the
   * session token explicitly for those.
   */
  bearer() {
    const t = this.auth.token;
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
  linkTone(s) {
    return s === "active" ? "active" : s === "revoked" ? "rejected" : "closed";
  }
  accessName(id) {
    const a = this.access().find((x) => x.id === id);
    return a ? `${a.verifier_name}${a.organisation ? " (" + a.organisation + ")" : ""}` : "Verifier";
  }
  subject(q) {
    if (!q.subject_type || q.subject_type === "package")
      return "On the package as a whole";
    const t = q.subject_type.replace(/_/g, " ");
    return `On ${t}${q.subject_id ? " \xB7 " + q.subject_id.slice(0, 12) : ""}`;
  }
  setDraft(id, v) {
    this.drafts.update((d) => __spreadProps(__spreadValues({}, d), { [id]: v }));
  }
  answer(q) {
    const text = (this.drafts()[q.id] ?? "").trim();
    this.answering.set(q.id);
    this.api.post(`/verifier-queries/${q.id}/answer`, { answer: text }, this.bearer()).subscribe({
      next: (res) => {
        this.answering.set(null);
        this.setDraft(q.id, "");
        this.queries.update((l) => l.map((x) => x.id === res.id ? __spreadProps(__spreadValues({}, res), { answered_by: res.answered_by ?? this.auth.profile()?.full_name ?? null }) : x));
        this.toast.success("Answer sent", "The verifier sees it next time they open the workspace.");
      },
      error: (e) => {
        this.answering.set(null);
        this.toast.apiError(e, "Couldn't send the answer");
      }
    });
  }
  startGrant() {
    this.g = { verifier_name: "", verifier_email: "", organisation: "", days: 30 };
    this.granted.set(null);
    this.grantError.set(null);
    this.copied.set(false);
    this.grantOpen.set(true);
  }
  grantValid() {
    return this.g.verifier_name.trim().length >= 2 && /.+@.+\..+/.test(this.g.verifier_email) && this.g.days >= 1 && this.g.days <= 90;
  }
  grant() {
    this.busy.set(true);
    this.grantError.set(null);
    this.api.post(`/packages/${this.id()}/verifier-access`, __spreadProps(__spreadValues({}, this.g), { days: Number(this.g.days) })).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.granted.set({ link: `${location.origin}/verify#token=${r.token}`, name: r.access.verifier_name, expires: r.access.expires_at });
        this.access.update((l) => [...l.filter((x) => x.id !== r.access.id), r.access]);
      },
      error: (e) => {
        this.busy.set(false);
        const f = e.details?.["fields"] ?? [];
        this.grantError.set(f.length ? f.map((x) => `${x.field.replace(/_/g, " ")}: ${x.message}`).join(". ") : e.message);
      }
    });
  }
  afterGrantClose() {
    if (this.granted())
      this.tab.set("access");
    this.granted.set(null);
  }
  copy(text) {
    navigator.clipboard?.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }
  revoke() {
    const a = this.revoking();
    if (!a)
      return;
    this.busy.set(true);
    this.api.post(`/verifier-access/${a.id}/revoke`, {}, this.bearer()).subscribe({
      next: (res) => {
        this.busy.set(false);
        this.revoking.set(null);
        this.access.update((l) => l.map((x) => x.id === res.id ? res : x));
        this.toast.success("Access revoked", `${a.verifier_name}'s link no longer works.`);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't revoke");
      }
    });
  }
  static \u0275fac = function PackageDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PackageDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PackageDetailPage, selectors: [["vc-package-detail"]], inputs: { id: [1, "id"] }, decls: 6, vars: 2, consts: [["routerLink", "/app/verification", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this package", 3, "message"], [3, "rows"], ["eyebrow", "Verification", 3, "title", "subtitle"], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "file-json"], ["actions", "", 1, "btn", "btn-secondary"], [1, "top"], [1, "card", "seal"], [1, "seal-h"], [1, "si"], ["name", "stamp", 3, "size"], [1, "ey"], [3, "value", "full"], [1, "seal-b"], [1, "res", "ok"], [1, "res", "bad"], [1, "muted", "small"], [1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], ["name", "shield", 3, "size"], [1, "seal-f", "small", "subtle"], [1, "card", "head"], [1, "hl"], ["cls", "CALCULATED"], [1, "hv", "num"], [1, "kv", "small"], [1, "num"], [1, "small", 3, "routerLink"], [3, "activeChange", "tabs", "active"], ["width", "600px", 3, "openChange", "closed", "open", "title", "subtitle"], [1, "form-grid"], ["footer", ""], [1, "btn", "btn-primary"], ["title", "Revoke verifier access", "width", "480px", 3, "closed", "open"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-danger", 3, "click", "disabled"], ["name", "ban"], ["name", "download"], ["name", "shield-check", 3, "size"], ["name", "shield-alert", 3, "size"], [1, "card-head"], [1, "subtle", "small"], [1, "card-body"], [1, "secs"], ["title", "Couldn't read the package file", 3, "message"], [1, "sn", "num"], [1, "st"], [1, "sc", "num"], [1, "subtle"], [1, "btn", "btn-primary", "btn-sm"], ["icon", "key", "title", "No verifier has access yet", "text", "Create a link for the validation and verification body. You'll see it once, so copy it before closing."], [1, "table-wrap"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["name", "user-plus", 3, "size"], ["title", "Couldn't load access", 3, "message"], [1, "btn", "btn-primary", 3, "click"], ["name", "user-plus"], [1, "table"], [3, "status"], [1, "nowrap"], [3, "title"], [1, "btn", "btn-ghost", "btn-sm", "dang"], [1, "btn", "btn-ghost", "btn-sm", "dang", 3, "click"], ["name", "ban", 3, "size"], [1, "dec", 3, "tone", "icon"], ["icon", "message", "title", "No questions yet", "text", "Questions a verifier raises on any item in the package appear here for your team to answer."], [1, "qs"], [1, "dq"], ["title", "Couldn't load questions", 3, "message"], [3, "open"], [1, "qh"], [1, "qsubj"], [1, "spacer"], [1, "qq"], [1, "qa"], [1, "qf"], ["name", "reply", 3, "size"], ["rows", "2", "placeholder", "Write an answer the verifier will see\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-primary", "btn-sm", 3, "click", "disabled"], ["name", "send", 3, "size"], ["tone", "warn", "icon", "alert"], [1, "link"], [3, "name", "size"], [1, "small", "muted"], [1, "field"], ["placeholder", "Full name", 1, "input", 3, "ngModelChange", "ngModel"], ["type", "email", "placeholder", "name@vvb.example", 1, "input", 3, "ngModelChange", "ngModel"], ["placeholder", "Validation and verification body", 1, "input", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "1", "max", "90", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "hint"], [1, "span-2"], ["title", "Couldn't create the link", 3, "message"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "key"], [1, "small", "muted", "mt"]], template: function PackageDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All packages");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, PackageDetailPage_Conditional_3_Template, 2, 1, "section", 2)(4, PackageDetailPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, PackageDetailPage_Conditional_5_Template, 78, 47);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.pkg()) ? 5 : -1, tmp_1_0);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, RouterLink, PageHeader, Icon, Badge, DataClass, Hash, Empty, ErrorBox, Loading, Modal, Callout, Tabs, NumPipe, DayPipe, AgoPipe, HumanPipe], styles: ["\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-bottom: 12px;\n}\n.top[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr);\n  gap: 16px;\n  margin-bottom: 20px;\n  align-items: start;\n}\n@media (max-width: 1000px) {\n  .top[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.seal[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.seal-h[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 14px;\n  align-items: flex-start;\n  padding: 18px 20px;\n}\n.seal-h[_ngcontent-%COMP%]   vc-hash[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  word-break: break-all;\n}\n.si[_ngcontent-%COMP%] {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 40px;\n  height: 40px;\n  border-radius: 10px;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n}\n.ey[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n}\n.seal-b[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  padding: 0 20px 16px;\n}\n.seal-b[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:first-child {\n  flex: 1;\n}\n.res[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border-radius: var(--%NS%radius-sm);\n  flex: 1;\n}\n.res[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  font-size: 13px;\n}\n.res[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n}\n.res.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.res.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.seal-f[_ngcontent-%COMP%] {\n  margin-top: auto;\n  padding: 12px 20px;\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n  border-radius: 0 0 var(--%NS%radius) var(--%NS%radius);\n}\n.head[_ngcontent-%COMP%] {\n  padding: 18px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.hl[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  font-weight: 500;\n}\n.hv[_ngcontent-%COMP%] {\n  font-size: 30px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.hv[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%text-3);\n  margin-left: 6px;\n  font-weight: 500;\n}\n.secs[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 6px 20px 14px;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0 28px;\n}\n@media (max-width: 1000px) {\n  .secs[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.secs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 10px 0;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.sn[_ngcontent-%COMP%] {\n  flex: none;\n  width: 24px;\n  height: 24px;\n  border-radius: 6px;\n  background: var(--%NS%sand-100);\n  display: grid;\n  place-items: center;\n  font-size: 11.5px;\n  color: var(--%NS%stone-600);\n}\n.st[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.st[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.st[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.sc[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--%NS%stone-700);\n}\n.dang[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.dec[_ngcontent-%COMP%] {\n  display: flex;\n  margin-bottom: 12px;\n}\n.dq[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  color: var(--%NS%stone-700);\n}\n.qs[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.qs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.qs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.qs[_ngcontent-%COMP%]   li.open[_ngcontent-%COMP%] {\n  box-shadow: inset 3px 0 0 var(--%NS%amber-600);\n}\n.qh[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}\n.qsubj[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  font-family: var(--%NS%mono);\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.qq[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  font-size: 14px;\n  color: var(--%NS%text);\n  white-space: pre-wrap;\n}\n.qa[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  margin-top: 10px;\n  padding: 10px 12px;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  color: var(--%NS%text-3);\n}\n.qa[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-800);\n  white-space: pre-wrap;\n}\n.qf[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-end;\n  margin-top: 10px;\n}\n.qf[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 60px;\n}\n.link[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  margin: 16px 0 10px;\n  padding: 10px 12px;\n  border: 1px dashed var(--%NS%forest-400);\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%forest-50);\n}\n.link[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  flex: 1;\n  word-break: break-all;\n  font-size: 12px;\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n/*# sourceMappingURL=package-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PackageDetailPage, [{
    type: Component,
    args: [{ selector: "vc-package-detail", imports: [FormsModule, RouterLink, PageHeader, Icon, Badge, DataClass, Hash, Empty, ErrorBox, Loading, Modal, Callout, Tabs, NumPipe, DayPipe, AgoPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/verification" class="back"><vc-icon name="arrow-left" [size]="14" />All packages</a>

    @if (loading()) {
      <section class="card"><vc-loading [rows]="6" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load this package" [message]="error()!" />
    } @else if (pkg(); as p) {
      <vc-page-header [title]="'Verification package v' + p.version" eyebrow="Verification"
        [subtitle]="p.summary.project_code + ' \xB7 period ' + p.summary.period_label + ' \xB7 issued by ' + p.summary.generated_by + ' on ' + (p.created_at | day)">
        <button actions class="btn btn-secondary" (click)="download('json')"><vc-icon name="file-json" />Package JSON</button>
        @if (p.pdf_file_id) { <button actions class="btn btn-secondary" (click)="download('pdf')"><vc-icon name="download" />PDF report</button> }
      </vc-page-header>

      <div class="top">
        <section class="card seal">
          <div class="seal-h">
            <span class="si"><vc-icon name="stamp" [size]="20" /></span>
            <div>
              <div class="ey">Package fingerprint (SHA-256)</div>
              <vc-hash [value]="p.sha256" [full]="true" />
            </div>
          </div>
          <div class="seal-b">
            @switch (integrityState()) {
              @case ('intact') {
                <div class="res ok"><vc-icon name="shield-check" [size]="18" /><div><strong>Intact</strong><span>The stored JSON and PDF match the fingerprint recorded at issue. Checked {{ checkedAt() | ago }}.</span></div></div>
              }
              @case ('tampered') {
                <div class="res bad"><vc-icon name="shield-alert" [size]="18" /><div><strong>Tamper alert</strong>
                  <span>The stored package does not match its fingerprint.
                    JSON file {{ integrity()?.json_file_intact ? 'intact' : 'altered' }}@if (integrity()?.pdf_file_intact !== null) {, PDF {{ integrity()?.pdf_file_intact ? 'intact' : 'altered' }}}.
                    Recomputed: <code>{{ (integrity()?.recomputed_sha256 ?? 'unreadable').slice(0, 16) }}\u2026</code></span></div></div>
              }
              @default {
                <p class="muted small">Recompute the fingerprint from the stored files to prove nothing has changed since the package was issued.</p>
              }
            }
            <button class="btn btn-secondary btn-sm" [disabled]="integrityState() === 'checking'" (click)="check()">
              <vc-icon name="shield" [size]="14" />{{ integrityState() === 'checking' ? 'Checking\u2026' : 'Check integrity' }}
            </button>
          </div>
          <div class="seal-f small subtle">
            Content fingerprint <code>{{ p.summary.content_sha256.slice(0, 16) }}\u2026</code> \u2014 identical evidence always gives the same content fingerprint, whichever version it is in.
          </div>
        </section>

        <section class="card head">
          <div class="hl"><span>Net credits</span><vc-dc cls="CALCULATED" /></div>
          <div class="hv num">{{ p.summary.net_credits_t_co2e | num: 1 }}<small>tCO\u2082e</small></div>
          <dl class="kv small">
            <dt>Reductions</dt><dd class="num">{{ p.summary.reductions_t_co2e | num: 1 }} t</dd>
            <dt>Removals</dt><dd class="num">{{ p.summary.removals_t_co2e | num: 1 }} t</dd>
            <dt>Uncertainty deduction</dt><dd class="num">{{ p.summary.uncertainty_deduction_t_co2e | num: 1 }} t</dd>
            <dt>Buffer</dt><dd class="num">{{ p.summary.buffer_t_co2e | num: 1 }} t</dd>
          </dl>
          <a class="small" [routerLink]="['/app/calculations', p.run_id]">Open the calculation run \u2192</a>
        </section>
      </div>

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @switch (tab()) {
        @case ('contents') {
          <section class="card">
            <div class="card-head"><h3>What the package contains</h3>
              <span class="subtle small">{{ p.summary.samples }} samples \xB7 {{ p.summary.lab_results }} lab results \xB7 {{ p.summary.documents }} referenced files</span>
            </div>
            @if (contentsError()) { <div class="card-body"><vc-error title="Couldn't read the package file" [message]="contentsError()!" /></div> }
            <ol class="secs">
              @for (s of sections; track s.key; let i = $index) {
                <li>
                  <span class="sn num">{{ i + 1 }}</span>
                  <div class="st"><strong>{{ s.label }}</strong><span>{{ s.text }}</span></div>
                  <span class="sc num">
                    @if (sectionCounts(); as c) { {{ c[s.key] ?? '\u2014' }} } @else { <span class="subtle">\u2026</span> }
                  </span>
                </li>
              }
            </ol>
          </section>
        }

        @case ('access') {
          <section class="card">
            <div class="card-head">
              <h3>Verifier access</h3>
              <span class="subtle small">Time-limited, read-only links. No sign-in needed; every opening is logged.</span>
              @if (canIssue()) { <button class="btn btn-primary btn-sm" (click)="startGrant()"><vc-icon name="user-plus" [size]="14" />Give access</button> }
            </div>
            @if (accessLoading()) { <vc-loading [rows]="3" /> }
            @else if (accessError()) { <div class="card-body"><vc-error title="Couldn't load access" [message]="accessError()!" /></div> }
            @else if (!access().length) {
              <vc-empty icon="key" title="No verifier has access yet" text="Create a link for the validation and verification body. You'll see it once, so copy it before closing.">
                @if (canIssue()) { <button class="btn btn-primary" (click)="startGrant()"><vc-icon name="user-plus" />Give access</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Verifier</th><th>Organisation</th><th>Link</th><th>Expires</th><th>Last opened</th><th>Review</th><th></th></tr></thead>
                  <tbody>
                    @for (a of access(); track a.id) {
                      <tr>
                        <td><strong>{{ a.verifier_name }}</strong><div class="subtle small">{{ a.verifier_email }}</div></td>
                        <td>{{ a.organisation || '\u2014' }}</td>
                        <td><vc-badge [status]="linkTone(a.link_status)">{{ a.link_status | human }}</vc-badge></td>
                        <td class="nowrap">{{ a.expires_at | day: true }}</td>
                        <td class="nowrap">@if (a.last_opened_at) { <span [title]="a.last_opened_at | day: true">{{ a.last_opened_at | ago }}</span> } @else { <span class="subtle">Never</span> }</td>
                        <td><vc-badge [status]="a.review_status" /></td>
                        <td class="num">
                          @if (canIssue() && a.link_status === 'active') {
                            <button class="btn btn-ghost btn-sm dang" (click)="revoking.set(a)"><vc-icon name="ban" [size]="14" />Revoke</button>
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

        @case ('queries') {
          @for (d of decisions(); track d.id) {
            <vc-callout [tone]="d.subject_id === 'verified' ? 'ok' : 'warn'" [icon]="d.subject_id === 'verified' ? 'verified' : 'flag'" class="dec">
              <strong>{{ accessName(d.access_id) }} concluded the review: {{ d.subject_id === 'verified' ? 'verified' : 'findings raised' }}</strong>
              <span class="subtle small"> \xB7 {{ d.created_at | day: true }}</span>
              @if (d.question && d.question !== d.subject_id) { <p class="dq">\u201C{{ d.question }}\u201D</p> }
            </vc-callout>
          }
          <section class="card">
            <div class="card-head"><h3>Questions from verifiers</h3><span class="subtle small">{{ openCount() }} open</span></div>
            @if (queriesLoading()) { <vc-loading [rows]="4" /> }
            @else if (queriesError()) { <div class="card-body"><vc-error title="Couldn't load questions" [message]="queriesError()!" /></div> }
            @else if (!questions().length) {
              <vc-empty icon="message" title="No questions yet" text="Questions a verifier raises on any item in the package appear here for your team to answer." />
            } @else {
              <ul class="qs">
                @for (q of questions(); track q.id) {
                  <li [class.open]="q.status === 'open'">
                    <div class="qh">
                      <vc-badge [status]="q.status" />
                      <span class="qsubj">{{ subject(q) }}</span>
                      <span class="spacer"></span>
                      <span class="subtle small">{{ accessName(q.access_id) }} \xB7 {{ q.created_at | ago }}</span>
                    </div>
                    <p class="qq">{{ q.question }}</p>
                    @if (q.answer) {
                      <div class="qa"><vc-icon name="reply" [size]="14" /><div><p>{{ q.answer }}</p><span class="subtle small">{{ q.answered_by ?? 'Project team' }} \xB7 {{ q.answered_at | day: true }}</span></div></div>
                    } @else if (canAnswer()) {
                      <div class="qf">
                        <textarea class="input" rows="2" [ngModel]="drafts()[q.id] ?? ''" (ngModelChange)="setDraft(q.id, $event)" placeholder="Write an answer the verifier will see\u2026"></textarea>
                        <button class="btn btn-primary btn-sm" [disabled]="(drafts()[q.id] ?? '').trim().length < 2 || answering() === q.id" (click)="answer(q)">
                          <vc-icon name="send" [size]="14" />{{ answering() === q.id ? 'Sending\u2026' : 'Send answer' }}
                        </button>
                      </div>
                    }
                  </li>
                }
              </ul>
            }
          </section>
        }
      }

      <!-- grant -->
      <vc-modal [(open)]="grantOpen" [title]="granted() ? 'Share this link now' : 'Give a verifier access'"
        [subtitle]="granted() ? '' : 'The verifier gets a read-only workspace for this package only.'" width="600px" (closed)="afterGrantClose()">
        @if (granted(); as g) {
          <vc-callout tone="warn" icon="alert"><strong>This link is shown only once.</strong> We store only a fingerprint of it, so it can't be recovered. Copy it and send it to {{ g.name }} through a secure channel.</vc-callout>
          <div class="link">
            <code>{{ g.link }}</code>
            <button class="btn btn-primary btn-sm" (click)="copy(g.link)"><vc-icon [name]="copied() ? 'check' : 'copy'" [size]="14" />{{ copied() ? 'Copied' : 'Copy link' }}</button>
          </div>
          <p class="small muted">Valid until {{ g.expires | day: true }}. You can revoke it at any time from this page.</p>
        } @else {
          <div class="form-grid">
            <div class="field"><label>Verifier name</label><input class="input" [(ngModel)]="g.verifier_name" placeholder="Full name" /></div>
            <div class="field"><label>Email</label><input class="input" type="email" [(ngModel)]="g.verifier_email" placeholder="name@vvb.example" /></div>
            <div class="field"><label>Organisation</label><input class="input" [(ngModel)]="g.organisation" placeholder="Validation and verification body" /></div>
            <div class="field"><label>Access for (days)</label><input class="input num" type="number" min="1" max="90" [(ngModel)]="g.days" /><span class="hint">1 to 90 days.</span></div>
            @if (grantError()) { <div class="span-2"><vc-error title="Couldn't create the link" [message]="grantError()!" /></div> }
          </div>
        }
        <ng-container footer>
          @if (granted()) {
            <button class="btn btn-primary" (click)="grantOpen.set(false); afterGrantClose()">Done</button>
          } @else {
            <button class="btn btn-ghost" (click)="grantOpen.set(false)">Cancel</button>
            <button class="btn btn-primary" [disabled]="busy() || !grantValid()" (click)="grant()"><vc-icon name="key" />{{ busy() ? 'Creating\u2026' : 'Create link' }}</button>
          }
        </ng-container>
      </vc-modal>

      <!-- revoke -->
      <vc-modal [open]="!!revoking()" (closed)="revoking.set(null)" title="Revoke verifier access" width="480px">
        @if (revoking(); as a) {
          <p>{{ a.verifier_name }} ({{ a.organisation || a.verifier_email }}) will lose access immediately. Their questions and any decision stay on record.</p>
          <p class="small muted mt">This can't be undone; you can create a new link later if needed.</p>
        }
        <ng-container footer>
          <button class="btn btn-ghost" (click)="revoking.set(null)">Cancel</button>
          <button class="btn btn-danger" [disabled]="busy()" (click)="revoke()"><vc-icon name="ban" />Revoke access</button>
        </ng-container>
      </vc-modal>
    }
  `, styles: ["/* angular:styles/component:scss;ee60258196969b3a;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\verification\\package-detail.page.ts */\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n  margin-bottom: 12px;\n}\n.top {\n  display: grid;\n  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr);\n  gap: 16px;\n  margin-bottom: 20px;\n  align-items: start;\n}\n@media (max-width: 1000px) {\n  .top {\n    grid-template-columns: 1fr;\n  }\n}\n.seal {\n  display: flex;\n  flex-direction: column;\n}\n.seal-h {\n  display: flex;\n  gap: 14px;\n  align-items: flex-start;\n  padding: 18px 20px;\n}\n.seal-h vc-hash {\n  margin-top: 6px;\n  word-break: break-all;\n}\n.si {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 40px;\n  height: 40px;\n  border-radius: 10px;\n  background: var(--forest-100);\n  color: var(--forest-700);\n}\n.ey {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  color: var(--text-3);\n}\n.seal-b {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  padding: 0 20px 16px;\n}\n.seal-b > :first-child {\n  flex: 1;\n}\n.res {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border-radius: var(--radius-sm);\n  flex: 1;\n}\n.res div {\n  display: flex;\n  flex-direction: column;\n  font-size: 13px;\n}\n.res span {\n  color: var(--stone-700);\n}\n.res.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.res.bad {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.seal-f {\n  margin-top: auto;\n  padding: 12px 20px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n  border-radius: 0 0 var(--radius) var(--radius);\n}\n.head {\n  padding: 18px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.hl {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 13px;\n  color: var(--text-2);\n  font-weight: 500;\n}\n.hv {\n  font-size: 30px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.hv small {\n  font-size: 13px;\n  color: var(--text-3);\n  margin-left: 6px;\n  font-weight: 500;\n}\n.secs {\n  list-style: none;\n  margin: 0;\n  padding: 6px 20px 14px;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0 28px;\n}\n@media (max-width: 1000px) {\n  .secs {\n    grid-template-columns: 1fr;\n  }\n}\n.secs li {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 10px 0;\n  border-bottom: 1px solid var(--stone-100);\n}\n.sn {\n  flex: none;\n  width: 24px;\n  height: 24px;\n  border-radius: 6px;\n  background: var(--sand-100);\n  display: grid;\n  place-items: center;\n  font-size: 11.5px;\n  color: var(--stone-600);\n}\n.st {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.st strong {\n  font-weight: 500;\n}\n.st span {\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.sc {\n  font-weight: 500;\n  color: var(--stone-700);\n}\n.dang {\n  color: var(--red-600);\n}\n.dec {\n  display: flex;\n  margin-bottom: 12px;\n}\n.dq {\n  margin-top: 6px;\n  color: var(--stone-700);\n}\n.qs {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.qs li {\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.qs li:last-child {\n  border-bottom: 0;\n}\n.qs li.open {\n  box-shadow: inset 3px 0 0 var(--amber-600);\n}\n.qh {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}\n.qsubj {\n  font-size: 12.5px;\n  color: var(--text-2);\n  font-family: var(--mono);\n}\n.spacer {\n  flex: 1;\n}\n.qq {\n  margin-top: 8px;\n  font-size: 14px;\n  color: var(--text);\n  white-space: pre-wrap;\n}\n.qa {\n  display: flex;\n  gap: 10px;\n  margin-top: 10px;\n  padding: 10px 12px;\n  border-radius: var(--radius-sm);\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  color: var(--text-3);\n}\n.qa p {\n  color: var(--stone-800);\n  white-space: pre-wrap;\n}\n.qf {\n  display: flex;\n  gap: 10px;\n  align-items: flex-end;\n  margin-top: 10px;\n}\n.qf textarea {\n  min-height: 60px;\n}\n.link {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  margin: 16px 0 10px;\n  padding: 10px 12px;\n  border: 1px dashed var(--forest-400);\n  border-radius: var(--radius-sm);\n  background: var(--forest-50);\n}\n.link code {\n  flex: 1;\n  word-break: break-all;\n  font-size: 12px;\n}\n.mt {\n  margin-top: 8px;\n}\n/*# sourceMappingURL=package-detail.page.css.map */\n"] }]
  }], () => [], { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PackageDetailPage, { className: "PackageDetailPage", filePath: "src/app/features/verification/package-detail.page.ts", lineNumber: 269 });
})();

// src/app/features/verification/verification.page.ts
var _forTrack02 = ($index, $item) => $item.id;
function VerificationPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function VerificationPage_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openIssue());
    });
    \u0275\u0275element(1, "vc-icon", 12);
    \u0275\u0275text(2, "Issue package");
    \u0275\u0275elementEnd();
  }
}
function VerificationPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4);
    \u0275\u0275element(1, "vc-empty", 14);
    \u0275\u0275elementEnd();
  }
}
function VerificationPage_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 6);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function VerificationPage_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "vc-error", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function VerificationPage_Conditional_6_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function VerificationPage_Conditional_6_Conditional_3_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openIssue());
    });
    \u0275\u0275element(1, "vc-icon", 12);
    \u0275\u0275text(2, "Issue package");
    \u0275\u0275elementEnd();
  }
}
function VerificationPage_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 16);
    \u0275\u0275conditionalCreate(1, VerificationPage_Conditional_6_Conditional_3_Conditional_1_Template, 3, 0, "button", 20);
    \u0275\u0275elementStart(2, "a", 21);
    \u0275\u0275text(3, "Go to calculations");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.auth.can("package.issue") ? 1 : -1);
  }
}
function VerificationPage_Conditional_6_Conditional_4_For_20_Case_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "Checking\u2026");
    \u0275\u0275elementEnd();
  }
}
function VerificationPage_Conditional_6_Conditional_4_For_20_Case_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275element(1, "vc-icon", 42);
    \u0275\u0275text(2, "Intact");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function VerificationPage_Conditional_6_Conditional_4_For_20_Case_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275element(1, "vc-icon", 43);
    \u0275\u0275text(2, "Tamper alert");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function VerificationPage_Conditional_6_Conditional_4_For_20_Case_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275listener("click", function VerificationPage_Conditional_6_Conditional_4_For_20_Case_33_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const p_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.check(p_r5));
    });
    \u0275\u0275element(1, "vc-icon", 45);
    \u0275\u0275text(2, "Check");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function VerificationPage_Conditional_6_Conditional_4_For_20_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 46);
    \u0275\u0275listener("click", function VerificationPage_Conditional_6_Conditional_4_For_20_Conditional_37_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const p_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.download(p_r5, "pdf"));
    });
    \u0275\u0275element(1, "vc-icon", 47);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function VerificationPage_Conditional_6_Conditional_4_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 26);
    \u0275\u0275listener("click", function VerificationPage_Conditional_6_Conditional_4_For_20_Template_tr_click_0_listener() {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.open(p_r5));
    });
    \u0275\u0275elementStart(1, "td", 27)(2, "span", 28);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 29);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td")(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, "\xA0");
    \u0275\u0275elementStart(10, "span", 29);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "day");
    \u0275\u0275pipe(13, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 29);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 30);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "num");
    \u0275\u0275elementStart(19, "span", 31);
    \u0275\u0275text(20, "tCO\u2082e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "td", 32);
    \u0275\u0275listener("click", function VerificationPage_Conditional_6_Conditional_4_For_20_Template_td_click_21_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275element(22, "vc-hash", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "td", 27);
    \u0275\u0275text(24);
    \u0275\u0275elementStart(25, "div", 34);
    \u0275\u0275pipe(26, "day");
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "td", 32);
    \u0275\u0275listener("click", function VerificationPage_Conditional_6_Conditional_4_For_20_Template_td_click_29_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275conditionalCreate(30, VerificationPage_Conditional_6_Conditional_4_For_20_Case_30_Template, 2, 0, "span", 29)(31, VerificationPage_Conditional_6_Conditional_4_For_20_Case_31_Template, 3, 1, "span", 35)(32, VerificationPage_Conditional_6_Conditional_4_For_20_Case_32_Template, 3, 1, "span", 36)(33, VerificationPage_Conditional_6_Conditional_4_For_20_Case_33_Template, 3, 1, "button", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "td", 38);
    \u0275\u0275listener("click", function VerificationPage_Conditional_6_Conditional_4_For_20_Template_td_click_34_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(35, "button", 39);
    \u0275\u0275listener("click", function VerificationPage_Conditional_6_Conditional_4_For_20_Template_button_click_35_listener() {
      const p_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.download(p_r5, "json"));
    });
    \u0275\u0275element(36, "vc-icon", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(37, VerificationPage_Conditional_6_Conditional_4_For_20_Conditional_37_Template, 2, 1, "button", 41);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_22_0;
    const p_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("v", p_r5.version);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.summary.project_code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r5.summary.period_label);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind1(12, 16, p_r5.summary.period_start), " \u2013 ", \u0275\u0275pipeBind1(13, 18, p_r5.summary.period_end));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3("", p_r5.summary.samples, " samples \xB7 ", p_r5.summary.lab_results, " lab results \xB7 ", p_r5.summary.documents, " files");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(18, 20, p_r5.summary.net_credits_t_co2e, 1), " ");
    \u0275\u0275advance(5);
    \u0275\u0275property("value", p_r5.sha256);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r5.summary.generated_by || ctx_r1.people.name(p_r5.created_by));
    \u0275\u0275advance();
    \u0275\u0275property("title", \u0275\u0275pipeBind2(26, 23, p_r5.created_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(28, 26, p_r5.created_at));
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_22_0 = ctx_r1.checks()[p_r5.id]) === "checking" ? 30 : tmp_22_0 === "intact" ? 31 : tmp_22_0 === "tampered" ? 32 : 33);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r5.pdf_file_id ? 37 : -1);
  }
}
function VerificationPage_Conditional_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "table", 23)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Package");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Period and contents");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 24);
    \u0275\u0275text(9, "Net credits");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Fingerprint");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Issued");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Integrity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 24);
    \u0275\u0275text(17, "Download");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, VerificationPage_Conditional_6_Conditional_4_For_20_Template, 38, 28, "tr", 25, _forTrack02);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r1.packages());
  }
}
function VerificationPage_Conditional_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 18)(1, "strong");
    \u0275\u0275text(2, "A package failed its integrity check.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " The stored file no longer matches the fingerprint recorded when it was issued. Do not share it; issue a new version and tell the platform administrator. ");
    \u0275\u0275elementEnd();
  }
}
function VerificationPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4);
    \u0275\u0275conditionalCreate(1, VerificationPage_Conditional_6_Conditional_1_Template, 1, 1, "vc-loading", 6)(2, VerificationPage_Conditional_6_Conditional_2_Template, 2, 1, "div", 15)(3, VerificationPage_Conditional_6_Conditional_3_Template, 4, 1, "vc-empty", 16)(4, VerificationPage_Conditional_6_Conditional_4_Template, 21, 0, "div", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, VerificationPage_Conditional_6_Conditional_5_Template, 4, 0, "vc-callout", 18);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loading() ? 1 : ctx_r1.error() ? 2 : !ctx_r1.packages().length ? 3 : 4);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.tampered() ? 5 : -1);
  }
}
function VerificationPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 6);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function VerificationPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 7);
  }
}
function VerificationPage_Conditional_10_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275element(1, "vc-icon", 58);
    \u0275\u0275text(2, "You created this run, so a colleague must package it.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
  }
}
function VerificationPage_Conditional_10_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 51)(1, "input", 52);
    \u0275\u0275listener("change", function VerificationPage_Conditional_10_For_2_Template_input_change_1_listener() {
      const r_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.pick.set(r_r9.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 53)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 54);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "day");
    \u0275\u0275pipe(8, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, VerificationPage_Conditional_10_For_2_Conditional_9_Template, 3, 1, "span", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 56)(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, "\xA0");
    \u0275\u0275elementStart(15, "span", 31);
    \u0275\u0275text(16, "tCO\u2082e");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, "\xA0");
    \u0275\u0275element(18, "vc-dc", 57);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.pick() === r_r9.id)("dis", ctx_r1.isMine(r_r9));
    \u0275\u0275advance();
    \u0275\u0275property("value", r_r9.id)("checked", ctx_r1.pick() === r_r9.id)("disabled", ctx_r1.isMine(r_r9));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Period ", r_r9.period_label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", \u0275\u0275pipeBind1(7, 13, r_r9.period_start), " \u2013 ", \u0275\u0275pipeBind1(8, 15, r_r9.period_end), " \xB7 created by ", ctx_r1.people.name(r_r9.created_by, "Unknown"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.isMine(r_r9) ? 9 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(13, 17, r_r9.net_t_co2e, 1));
  }
}
function VerificationPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275repeaterCreate(1, VerificationPage_Conditional_10_For_2_Template, 19, 20, "label", 49, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "vc-callout", 50);
    \u0275\u0275text(4, "Four-eyes rule: the person who created a calculation can't issue its package. Re-issuing creates a new version; earlier versions stay available.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.approved());
  }
}
function VerificationPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "vc-calc-blocker", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("error", ctx_r1.issueError());
  }
}
var VerificationPage = class _VerificationPage {
  api = inject(ApiService);
  router = inject(Router);
  toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  people = inject(People);
  packages = signal(
    [],
    ...ngDevMode ? [{ debugName: "packages" }] : (
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
  checks = signal(
    {},
    ...ngDevMode ? [{ debugName: "checks" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tampered = computed(
    () => Object.values(this.checks()).includes("tampered"),
    ...ngDevMode ? [{ debugName: "tampered" }] : (
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
  pick = signal(
    null,
    ...ngDevMode ? [{ debugName: "pick" }] : (
      /* istanbul ignore next */
      []
    )
  );
  issuing = signal(
    false,
    ...ngDevMode ? [{ debugName: "issuing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  issueError = signal(
    null,
    ...ngDevMode ? [{ debugName: "issueError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approved = computed(
    () => this.runs().filter((r) => r.status === "approved"),
    ...ngDevMode ? [{ debugName: "approved" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.people.load();
    effect(() => {
      if (this.ctx.currentId())
        this.load();
    });
  }
  isMine(r) {
    return r.created_by === this.auth.profile()?.id;
  }
  open(p) {
    this.router.navigate(["/app/verification", p.id]);
  }
  load() {
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/projects/${pid}/packages`).subscribe({
      next: (r) => {
        this.packages.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  check(p) {
    this.checks.update((c) => __spreadProps(__spreadValues({}, c), { [p.id]: "checking" }));
    this.api.get(`/packages/${p.id}/verify`).subscribe({
      next: (r) => this.checks.update((c) => __spreadProps(__spreadValues({}, c), { [p.id]: r.intact ? "intact" : "tampered" })),
      error: (e) => {
        this.checks.update((c) => {
          const n = __spreadValues({}, c);
          delete n[p.id];
          return n;
        });
        this.toast.apiError(e, "Couldn't check integrity");
      }
    });
  }
  download(p, kind) {
    const id = kind === "json" ? p.json_file_id : p.pdf_file_id;
    if (!id)
      return;
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: (b) => saveBlob(b, `${p.summary.project_code}_${p.summary.period_label}_v${p.version}.${kind}`),
      error: (e) => this.toast.apiError(e, "Couldn't download")
    });
  }
  openIssue() {
    this.issueError.set(null);
    this.pick.set(null);
    this.issueOpen.set(true);
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.runsLoading.set(true);
    this.api.get(`/projects/${pid}/calculations`).subscribe({
      next: (r) => {
        this.runs.set(r);
        this.runsLoading.set(false);
        const first = r.find((x) => x.status === "approved" && !this.isMine(x));
        if (first)
          this.pick.set(first.id);
      },
      error: (e) => {
        this.runsLoading.set(false);
        this.issueError.set(e);
      }
    });
  }
  issue() {
    const id = this.pick();
    if (!id)
      return;
    this.issuing.set(true);
    this.issueError.set(null);
    this.api.post(`/calculations/${id}/package`).subscribe({
      next: (p) => {
        this.issuing.set(false);
        this.issueOpen.set(false);
        this.toast.success(`Package v${p.version} issued`, "It is sealed. Grant a verifier access next.");
        this.router.navigate(["/app/verification", p.id]);
      },
      error: (e) => {
        this.issuing.set(false);
        this.issueError.set(e);
      }
    });
  }
  static \u0275fac = function VerificationPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerificationPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerificationPage, selectors: [["vc-verification-page"]], decls: 18, vars: 7, consts: [["title", "Verification", "eyebrow", "Carbon", "subtitle", "Sealed evidence packages for independent verifiers. Each package is built from an approved calculation and carries a SHA-256 fingerprint that shows if anything was changed."], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], ["actions", "", 1, "btn", "btn-primary"], [1, "card"], ["title", "Issue a verification package", "subtitle", "Choose an approved calculation. The package is sealed as soon as it is issued.", "width", "640px", 3, "openChange", "open"], [3, "rows"], ["icon", "calculator", "title", "No approved calculation", "text", "A package can only be built from an approved calculation run."], [1, "mt"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "package"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["icon", "briefcase", "title", "Choose a project", "text", "Pick a project in the top bar to see its verification packages."], [1, "card-body"], ["icon", "package", "title", "No packages issued yet", "text", "Once a calculation is approved, issue a sealed package and give the verifier a time-limited, read-only link."], [1, "table-wrap"], ["tone", "danger", "icon", "shield-alert", 1, "mt"], ["title", "Couldn't load packages", 3, "message"], [1, "btn", "btn-primary"], ["routerLink", "/app/calculations", 1, "btn", "btn-secondary"], [1, "btn", "btn-primary", 3, "click"], [1, "table"], [1, "num"], [1, "clickable"], [1, "clickable", 3, "click"], [1, "nowrap"], [1, "ver"], [1, "subtle", "small"], [1, "num", "nowrap"], [1, "u"], [3, "click"], [3, "value"], [1, "subtle", "small", 3, "title"], [1, "ok"], [1, "bad"], [1, "btn", "btn-ghost", "btn-sm"], [1, "num", "nowrap", 3, "click"], ["title", "Download package JSON", "aria-label", "Download package JSON", 1, "btn", "btn-ghost", "btn-sm", "btn-icon", 3, "click"], ["name", "file-json", 3, "size"], ["title", "Download PDF report", "aria-label", "Download PDF report", 1, "btn", "btn-ghost", "btn-sm", "btn-icon"], ["name", "shield-check", 3, "size"], ["name", "shield-alert", 3, "size"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "shield", 3, "size"], ["title", "Download PDF report", "aria-label", "Download PDF report", 1, "btn", "btn-ghost", "btn-sm", "btn-icon", 3, "click"], ["name", "file", 3, "size"], [1, "runs"], [1, "run", 3, "on", "dis"], ["tone", "info", "icon", "users", 1, "mt"], [1, "run"], ["type", "radio", "name", "run", 3, "change", "value", "checked", "disabled"], [1, "rt"], [1, "small", "muted"], [1, "small", "own"], [1, "rv", "num"], ["cls", "CALCULATED"], ["name", "lock", 3, "size"], [3, "error"]], template: function VerificationPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "button", 1);
      \u0275\u0275listener("click", function VerificationPage_Template_button_click_1_listener() {
        return ctx.load();
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, VerificationPage_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, VerificationPage_Conditional_5_Template, 2, 0, "section", 4)(6, VerificationPage_Conditional_6_Template, 6, 2);
      \u0275\u0275elementStart(7, "vc-modal", 5);
      \u0275\u0275twoWayListener("openChange", function VerificationPage_Template_vc_modal_openChange_7_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.issueOpen, $event) || (ctx.issueOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(8, VerificationPage_Conditional_8_Template, 1, 1, "vc-loading", 6)(9, VerificationPage_Conditional_9_Template, 1, 0, "vc-empty", 7)(10, VerificationPage_Conditional_10_Template, 5, 0);
      \u0275\u0275conditionalCreate(11, VerificationPage_Conditional_11_Template, 2, 1, "div", 8);
      \u0275\u0275elementContainerStart(12, 9);
      \u0275\u0275elementStart(13, "button", 10);
      \u0275\u0275listener("click", function VerificationPage_Template_button_click_13_listener() {
        return ctx.issueOpen.set(false);
      });
      \u0275\u0275text(14, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "button", 11);
      \u0275\u0275listener("click", function VerificationPage_Template_button_click_15_listener() {
        return ctx.issue();
      });
      \u0275\u0275element(16, "vc-icon", 12);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.auth.can("package.issue") ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.ctx.currentId() ? 5 : 6);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.issueOpen);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.runsLoading() ? 8 : !ctx.approved().length ? 9 : 10);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.issueError() ? 11 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.pick() || ctx.issuing());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.issuing() ? "Sealing\u2026" : "Issue package");
    }
  }, dependencies: [RouterLink, PageHeader, Icon, DataClass, Hash, Empty, ErrorBox, Loading, Modal, Callout, CalcBlocker, NumPipe, DayPipe, AgoPipe], styles: ["\n.u[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n  margin-left: 3px;\n}\n.ver[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  min-width: 30px;\n  height: 24px;\n  padding: 0 6px;\n  border-radius: 6px;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n  font-weight: 600;\n  font-size: 12.5px;\n}\nvc-hash[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.ok[_ngcontent-%COMP%], \n.bad[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  font-weight: 500;\n  padding: 3px 9px;\n  border-radius: 999px;\n}\n.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  display: flex;\n}\n.runs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.run[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  cursor: pointer;\n}\n.run[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.run.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: var(--%NS%focus);\n}\n.run.dis[_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.75;\n}\n.run[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n}\n.rt[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n.own[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  color: var(--%NS%amber-600);\n}\n.rv[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n/*# sourceMappingURL=verification.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VerificationPage, [{
    type: Component,
    args: [{ selector: "vc-verification-page", imports: [RouterLink, PageHeader, Icon, DataClass, Hash, Empty, ErrorBox, Loading, Modal, Callout, CalcBlocker, NumPipe, DayPipe, AgoPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Verification" eyebrow="Carbon"
      subtitle="Sealed evidence packages for independent verifiers. Each package is built from an approved calculation and carries a SHA-256 fingerprint that shows if anything was changed.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (auth.can('package.issue')) {
        <button actions class="btn btn-primary" (click)="openIssue()"><vc-icon name="package" />Issue package</button>
      }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Pick a project in the top bar to see its verification packages." /></section>
    } @else {
      <section class="card">
        @if (loading()) {
          <vc-loading [rows]="5" />
        } @else if (error()) {
          <div class="card-body"><vc-error title="Couldn't load packages" [message]="error()!" /></div>
        } @else if (!packages().length) {
          <vc-empty icon="package" title="No packages issued yet"
            text="Once a calculation is approved, issue a sealed package and give the verifier a time-limited, read-only link.">
            @if (auth.can('package.issue')) { <button class="btn btn-primary" (click)="openIssue()"><vc-icon name="package" />Issue package</button> }
            <a class="btn btn-secondary" routerLink="/app/calculations">Go to calculations</a>
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Package</th><th>Period and contents</th><th class="num">Net credits</th><th>Fingerprint</th>
                <th>Issued</th><th>Integrity</th><th class="num">Download</th>
              </tr></thead>
              <tbody>
                @for (p of packages(); track p.id) {
                  <tr class="clickable" (click)="open(p)">
                    <td class="nowrap"><span class="ver">v{{ p.version }}</span><div class="subtle small">{{ p.summary.project_code }}</div></td>
                    <td><strong>{{ p.summary.period_label }}</strong>&nbsp;<span class="subtle small">{{ p.summary.period_start | day }} \u2013 {{ p.summary.period_end | day }}</span>
                      <div class="subtle small">{{ p.summary.samples }} samples \xB7 {{ p.summary.lab_results }} lab results \xB7 {{ p.summary.documents }} files</div></td>
                    <td class="num nowrap">{{ p.summary.net_credits_t_co2e | num: 1 }} <span class="u">tCO\u2082e</span></td>
                    <td (click)="$event.stopPropagation()"><vc-hash [value]="p.sha256" /></td>
                    <td class="nowrap">{{ p.summary.generated_by || people.name(p.created_by) }}<div class="subtle small" [title]="p.created_at | day: true">{{ p.created_at | ago }}</div></td>
                    <td (click)="$event.stopPropagation()">
                      @switch (checks()[p.id]) {
                        @case ('checking') { <span class="subtle small">Checking\u2026</span> }
                        @case ('intact') { <span class="ok"><vc-icon name="shield-check" [size]="14" />Intact</span> }
                        @case ('tampered') { <span class="bad"><vc-icon name="shield-alert" [size]="14" />Tamper alert</span> }
                        @default { <button class="btn btn-ghost btn-sm" (click)="check(p)"><vc-icon name="shield" [size]="14" />Check</button> }
                      }
                    </td>
                    <td class="num nowrap" (click)="$event.stopPropagation()">
                      <button class="btn btn-ghost btn-sm btn-icon" (click)="download(p, 'json')" title="Download package JSON" aria-label="Download package JSON"><vc-icon name="file-json" [size]="15" /></button>
                      @if (p.pdf_file_id) { <button class="btn btn-ghost btn-sm btn-icon" (click)="download(p, 'pdf')" title="Download PDF report" aria-label="Download PDF report"><vc-icon name="file" [size]="15" /></button> }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
      @if (tampered()) {
        <vc-callout tone="danger" icon="shield-alert" class="mt">
          <strong>A package failed its integrity check.</strong> The stored file no longer matches the fingerprint recorded when it was issued.
          Do not share it; issue a new version and tell the platform administrator.
        </vc-callout>
      }
    }

    <vc-modal [(open)]="issueOpen" title="Issue a verification package" subtitle="Choose an approved calculation. The package is sealed as soon as it is issued." width="640px">
      @if (runsLoading()) { <vc-loading [rows]="3" /> }
      @else if (!approved().length) {
        <vc-empty icon="calculator" title="No approved calculation" text="A package can only be built from an approved calculation run." />
      } @else {
        <div class="runs">
          @for (r of approved(); track r.id) {
            <label class="run" [class.on]="pick() === r.id" [class.dis]="isMine(r)">
              <input type="radio" name="run" [value]="r.id" [checked]="pick() === r.id" [disabled]="isMine(r)" (change)="pick.set(r.id)" />
              <div class="rt">
                <strong>Period {{ r.period_label }}</strong>
                <span class="small muted">{{ r.period_start | day }} \u2013 {{ r.period_end | day }} \xB7 created by {{ people.name(r.created_by, 'Unknown') }}</span>
                @if (isMine(r)) { <span class="small own"><vc-icon name="lock" [size]="12" />You created this run, so a colleague must package it.</span> }
              </div>
              <div class="rv num"><strong>{{ r.net_t_co2e | num: 1 }}</strong>&nbsp;<span class="u">tCO\u2082e</span>&nbsp;<vc-dc cls="CALCULATED" /></div>
            </label>
          }
        </div>
        <vc-callout tone="info" icon="users" class="mt">Four-eyes rule: the person who created a calculation can't issue its package. Re-issuing creates a new version; earlier versions stay available.</vc-callout>
      }
      @if (issueError()) { <div class="mt"><vc-calc-blocker [error]="issueError()" /></div> }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="issueOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!pick() || issuing()" (click)="issue()"><vc-icon name="package" />{{ issuing() ? 'Sealing\u2026' : 'Issue package' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;47c764aa49eea8b1;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\verification\\verification.page.ts */\n.u {\n  font-size: 11.5px;\n  color: var(--text-3);\n  margin-left: 3px;\n}\n.ver {\n  display: inline-grid;\n  place-items: center;\n  min-width: 30px;\n  height: 24px;\n  padding: 0 6px;\n  border-radius: 6px;\n  background: var(--forest-100);\n  color: var(--forest-700);\n  font-weight: 600;\n  font-size: 12.5px;\n}\nvc-hash {\n  white-space: nowrap;\n}\n.ok,\n.bad {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  font-weight: 500;\n  padding: 3px 9px;\n  border-radius: 999px;\n}\n.ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.bad {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.mt {\n  margin-top: 14px;\n  display: flex;\n}\n.runs {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.run {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  padding: 12px 14px;\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  cursor: pointer;\n}\n.run:hover {\n  border-color: var(--stone-400);\n}\n.run.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: var(--focus);\n}\n.run.dis {\n  cursor: not-allowed;\n  opacity: 0.75;\n}\n.run input {\n  accent-color: var(--primary);\n}\n.rt {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n.own {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  color: var(--amber-600);\n}\n.rv {\n  white-space: nowrap;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n/*# sourceMappingURL=verification.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerificationPage, { className: "VerificationPage", filePath: "src/app/features/verification/verification.page.ts", lineNumber: 129 });
})();

// src/app/features/verification/verification.routes.ts
var verification_routes_default = [
  { path: "", component: VerificationPage, title: "Verification \xB7 Varsapradaya Carbon" },
  { path: ":id", component: PackageDetailPage, title: "Verification package \xB7 Varsapradaya Carbon" }
];
export {
  verification_routes_default as default
};
//# debugId=48206dc5-d4be-5973-bd02-2d479c4f6889
//# sourceMappingURL=chunk-W44VXKZL.js.map
