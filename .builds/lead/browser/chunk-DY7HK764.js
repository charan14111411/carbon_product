import {
  TierChip
} from "./chunk-SFBT26DL.js";
import {
  Remote,
  daysAgo,
  esc,
  fieldsFC,
  isoDate
} from "./chunk-ZC6I5JPU.js";
import {
  MapView
} from "./chunk-M3VDEKV5.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  RangeValueAccessor,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  AgoPipe,
  DayPipe,
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  ActivatedRoute,
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
  KIT,
  Loading,
  Modal,
  PageHeader,
  Stat,
  Tabs
} from "./chunk-PAXTZ3VZ.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  effect,
  forkJoin,
  inject,
  input,
  map,
  of,
  setClassMetadata,
  signal,
  throwError,
  untracked,
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

// src/app/features/models/types.ts
var FEATURES = [
  { key: "ndvi_mean", label: "Mean NDVI (12 months)", hint: "Average greenness from clear satellite passes" },
  { key: "ndmi_mean", label: "Mean NDMI (12 months)", hint: "Average surface moisture from satellite" },
  { key: "rain_365d", label: "Rainfall, last 365 days", hint: "From supporting data \u2014 needs 180+ days" },
  { key: "temp_mean", label: "Mean air temperature", hint: "From supporting data \u2014 needs 180+ days" },
  { key: "elevation_m", label: "Elevation", hint: "From the field record" },
  { key: "clay_pct", label: "Clay content", hint: "Lab texture where measured, else SoilGrids (modelled)" },
  { key: "practice_count", label: "Practices adopted", hint: "Number of project practices recorded" }
];
function featureLabel(k) {
  return FEATURES.find((f) => f.key === k)?.label ?? k.replace(/_/g, " ");
}
function algorithmLabel(a) {
  return { ridge_regression_closed_form: "Ridge regression" }[a] ?? a.replace(/_/g, " ");
}
function validationLabel(v, k) {
  if (v === "grouped_kfold_by_farm") return `Held-out farms${k ? ` \xB7 ${k} folds` : ""}`;
  return v.replace(/_/g, " ");
}
function ramp(t, stops) {
  const x = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = hex(stops[i]), b = hex(stops[i + 1]);
  const c = a.map((v, j) => Math.round(v + (b[j] - v) * f));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}
function hex(h) {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}
var GREEN_RAMP = ["#e3eee6", "#86b797", "#2f7249", "#173826"];
var CLAY_RAMP = ["#fcf3ec", "#e7a57b", "#c76329", "#8f3f17"];
function humanReason(s) {
  return s.replace(/\b(ndvi_mean|ndmi_mean|rain_365d|temp_mean|elevation_m|clay_pct|practice_count)\b/g, (k) => featureLabel(k).toLowerCase());
}

// src/app/features/models/model-detail.page.ts
var _c0 = () => [];
var _forTrack0 = ($index, $item) => $item.fold;
var _forTrack1 = ($index, $item) => $item.key;
var _forTrack2 = ($index, $item) => $item.sample_code;
function ModelDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-loading", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 8);
  }
}
function ModelDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.st.error().message);
  }
}
function ModelDetailPage_Conditional_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function ModelDetailPage_Conditional_5_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.confirmOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 39);
    \u0275\u0275text(2, "Approve model");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.isAuthor())("title", ctx_r0.isAuthor() ? "You trained this model, so someone else must approve it" : "");
  }
}
function ModelDetailPage_Conditional_5_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 19);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.name(m_r3.approved_by));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 2, m_r3.approved_at, true));
  }
}
function ModelDetailPage_Conditional_5_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong", 40);
    \u0275\u0275text(1, "Not yet approved");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 19);
    \u0275\u0275text(3, "A second person must approve");
    \u0275\u0275elementEnd();
  }
}
function ModelDetailPage_Conditional_5_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 23);
    \u0275\u0275text(1, "You trained this model, so you can't approve it yourself. Four-eyes review: another person with approval rights must check the validation below and approve it.");
    \u0275\u0275elementEnd();
  }
}
function ModelDetailPage_Conditional_5_For_99_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 41)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 21);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 42)(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 43);
    \u0275\u0275element(14, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Fold ", f_r4.fold + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", f_r4.farms.length, " farm", f_r4.farms.length === 1 ? "" : "s", " \xB7 ", f_r4.n_test, " samples held out");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("RMSE ", \u0275\u0275pipeBind2(9, 8, f_r4.rmse, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("MAE ", \u0275\u0275pipeBind2(12, 11, f_r4.mae, 3));
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx_r0.foldW(f_r4.rmse), "%");
  }
}
function ModelDetailPage_Conditional_5_For_108_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "span", 44);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 45);
    \u0275\u0275element(4, "span", 46)(5, "span", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 48);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "num");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r5.label);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", c_r5.w / 2, "%")("left", c_r5.v < 0 ? 50 - c_r5.w / 2 : 50, "%");
    \u0275\u0275classProp("neg", c_r5.v < 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", c_r5.v > 0 ? "+" : "", "", \u0275\u0275pipeBind2(8, 9, c_r5.v, 3));
  }
}
function ModelDetailPage_Conditional_5_ForEmpty_109_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1, "Coefficients aren't available for this model.");
    \u0275\u0275elementEnd();
  }
}
function ModelDetailPage_Conditional_5_Conditional_112_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 52);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 6);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r6.sample_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.feats(e_r6.missing_features));
  }
}
function ModelDetailPage_Conditional_5_Conditional_112_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51)(1, "span", 53);
    \u0275\u0275text(2, "These samples had a feature value missing on their collection date, so they couldn't be used.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 54);
    \u0275\u0275listener("click", function ModelDetailPage_Conditional_5_Conditional_112_Conditional_17_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.showAllEx.set(!ctx_r0.showAllEx()));
    });
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r3 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.showAllEx() ? "Show fewer" : "Show all " + m_r3.training_summary.excluded.length);
  }
}
function ModelDetailPage_Conditional_5_Conditional_112_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 27)(2, "h3");
    \u0275\u0275text(3, "Samples left out of training");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 19);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 49)(7, "table", 50)(8, "thead")(9, "tr")(10, "th");
    \u0275\u0275text(11, "Sample");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Missing");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, ModelDetailPage_Conditional_5_Conditional_112_For_16_Template, 5, 2, "tr", null, _forTrack2);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(17, ModelDetailPage_Conditional_5_Conditional_112_Conditional_17_Template, 5, 1, "div", 51);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(m_r3.training_summary.excluded.length);
    \u0275\u0275advance(10);
    \u0275\u0275repeater(m_r3.training_summary.excluded.slice(0, ctx_r0.showAllEx() ? 200 : 6));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(m_r3.training_summary.excluded.length > 6 ? 17 : -1);
  }
}
function ModelDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-page-header", 12)(1, "div", 13);
    \u0275\u0275element(2, "vc-dc", 14)(3, "vc-badge", 15);
    \u0275\u0275conditionalCreate(4, ModelDetailPage_Conditional_5_Conditional_4_Template, 3, 2, "button", 16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 17)(6, "div")(7, "span", 18);
    \u0275\u0275text(8, "Trained by");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 19);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div")(15, "span", 18);
    \u0275\u0275text(16, "Approved by");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, ModelDetailPage_Conditional_5_Conditional_17_Template, 5, 5)(18, ModelDetailPage_Conditional_5_Conditional_18_Template, 4, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div")(20, "span", 18);
    \u0275\u0275text(21, "Training data");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "strong", 20);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 21);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div")(27, "span", 18);
    \u0275\u0275text(28, "Target");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "strong");
    \u0275\u0275text(30, "Top-layer SOC %");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 19);
    \u0275\u0275text(32, "Accepted lab results \xB7 ");
    \u0275\u0275element(33, "vc-dc", 22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(34, ModelDetailPage_Conditional_5_Conditional_34_Template, 2, 0, "vc-callout", 23);
    \u0275\u0275elementStart(35, "div", 24)(36, "div", 25)(37, "span", 18);
    \u0275\u0275text(38, "RMSE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "strong", 20);
    \u0275\u0275text(40);
    \u0275\u0275pipe(41, "num");
    \u0275\u0275elementStart(42, "small");
    \u0275\u0275text(43, "% SOC");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "p");
    \u0275\u0275text(45, "Typical size of an error, with large misses weighted more.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 25)(47, "span", 18);
    \u0275\u0275text(48, "MAE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "strong", 20);
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "num");
    \u0275\u0275elementStart(52, "small");
    \u0275\u0275text(53, "% SOC");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(54, "p");
    \u0275\u0275text(55, "Average absolute difference from the lab value.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div", 25)(57, "span", 18);
    \u0275\u0275text(58, "Bias");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "strong", 20);
    \u0275\u0275text(60);
    \u0275\u0275pipe(61, "num");
    \u0275\u0275elementStart(62, "small");
    \u0275\u0275text(63, "% SOC");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "p");
    \u0275\u0275text(65);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "div", 25)(67, "span", 18);
    \u0275\u0275text(68, "R\xB2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "strong", 20);
    \u0275\u0275text(70);
    \u0275\u0275pipe(71, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "p");
    \u0275\u0275text(73, "Share of the variation between samples the model explains (1 = all).");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "div", 25)(75, "span", 18);
    \u0275\u0275text(76, "90% interval coverage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "strong", 20);
    \u0275\u0275text(78);
    \u0275\u0275elementStart(79, "small");
    \u0275\u0275text(80, "%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(81, "p");
    \u0275\u0275text(82, "How often the lab value fell inside the predicted range. The aim is about 90%.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(83, "div", 26)(84, "section", 2)(85, "div", 27)(86, "h3");
    \u0275\u0275text(87, "How it was validated");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "span", 28);
    \u0275\u0275element(89, "vc-icon", 29);
    \u0275\u0275text(90);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(91, "div", 30)(92, "p", 31);
    \u0275\u0275text(93, "Samples from the same farm are alike, so testing on them would flatter the model. Instead, ");
    \u0275\u0275elementStart(94, "strong");
    \u0275\u0275text(95, "whole farms are held out");
    \u0275\u0275elementEnd();
    \u0275\u0275text(96);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "div", 32);
    \u0275\u0275repeaterCreate(98, ModelDetailPage_Conditional_5_For_99_Template, 15, 14, "div", 33, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(100, "section", 2)(101, "div", 27)(102, "h3");
    \u0275\u0275text(103, "What drives the prediction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "span", 34);
    \u0275\u0275text(105, "Standardised coefficients");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(106, "div", 35);
    \u0275\u0275repeaterCreate(107, ModelDetailPage_Conditional_5_For_108_Template, 9, 12, "div", 36, _forTrack1, false, ModelDetailPage_Conditional_5_ForEmpty_109_Template, 2, 0, "p", 6);
    \u0275\u0275elementStart(110, "p", 37);
    \u0275\u0275text(111);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(112, ModelDetailPage_Conditional_5_Conditional_112_Template, 18, 2, "section", 2);
  }
  if (rf & 2) {
    const m_r3 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("title", m_r3.name + " \xB7 version " + m_r3.version)("subtitle", ctx_r0.alg(m_r3.algorithm) + " \xB7 " + m_r3.features.length + " features \xB7 " + (m_r3.notes ?? ""));
    \u0275\u0275advance(3);
    \u0275\u0275property("status", m_r3.status);
    \u0275\u0275advance();
    \u0275\u0275conditional(m_r3.status === "candidate" && ctx_r0.canApprove() ? 4 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.name(m_r3.created_by));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(13, 27, m_r3.created_at, true));
    \u0275\u0275advance(5);
    \u0275\u0275conditional(m_r3.approved_by ? 17 : 18);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", m_r3.training_summary?.rows ?? m_r3.training_rows, " lab results");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", m_r3.training_summary?.farms, " farms \xB7 ", m_r3.training_summary?.fields, " fields");
    \u0275\u0275advance(9);
    \u0275\u0275conditional(m_r3.status === "candidate" && ctx_r0.isAuthor() && ctx_r0.canApprove() ? 34 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(41, 30, m_r3.metrics.rmse, 3));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(51, 33, m_r3.metrics.mae, 3));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate2("", m_r3.metrics.bias > 0 ? "+" : "", "", \u0275\u0275pipeBind2(61, 36, m_r3.metrics.bias, 3));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", m_r3.metrics.bias > 0 ? "Tends to over-predict" : m_r3.metrics.bias < 0 ? "Tends to under-predict" : "No systematic lean", " \u2014 closer to zero is better.");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(71, 39, m_r3.metrics.r2, 2));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("warn", m_r3.metrics.coverage_90 < 0.8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((m_r3.metrics.coverage_90 * 100).toFixed(0));
    \u0275\u0275advance(11);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.val(m_r3.validation, m_r3.metrics.k));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2(": the farms are split into ", m_r3.metrics.k, " groups; the model is trained ", m_r3.metrics.k, " times, each time without one group, and tested on the farms it never saw. Every metric above comes from those held-out predictions.");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(m_r3.metrics.folds ?? \u0275\u0275pureFunction0(42, _c0));
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx_r0.coefs());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Positive means higher values of the feature go with higher predicted SOC. Ridge \u03BB = ", m_r3.params?.lambda, ".");
    \u0275\u0275advance();
    \u0275\u0275conditional(m_r3.training_summary?.excluded?.length ? 112 : -1);
  }
}
function ModelDetailPage_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 7);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.approveError());
  }
}
var ModelDetailPage = class _ModelDetailPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  st = new Remote();
  m = computed(
    () => this.st.data()?.model ?? null,
    ...ngDevMode ? [{ debugName: "m" }] : (
      /* istanbul ignore next */
      []
    )
  );
  users = computed(
    () => new Map((this.st.data()?.users ?? []).map((u) => [u.id, u])),
    ...ngDevMode ? [{ debugName: "users" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canApprove = computed(
    () => this.auth.can("models.approve"),
    ...ngDevMode ? [{ debugName: "canApprove" }] : (
      /* istanbul ignore next */
      []
    )
  );
  isAuthor = computed(
    () => !!this.m() && this.m().created_by === this.auth.profile()?.id,
    ...ngDevMode ? [{ debugName: "isAuthor" }] : (
      /* istanbul ignore next */
      []
    )
  );
  alg = algorithmLabel;
  val = validationLabel;
  coefs = computed(
    () => {
      const p = this.m()?.params;
      if (!p?.coefficients_standardised)
        return [];
      const vals = p.features.map((k, i) => ({ key: k, label: featureLabel(k), v: p.coefficients_standardised[i] }));
      const max = Math.max(...vals.map((v) => Math.abs(v.v)), 1e-9);
      return vals.map((v) => __spreadProps(__spreadValues({}, v), { w: Math.abs(v.v) / max * 100 })).sort((a, b) => Math.abs(b.v) - Math.abs(a.v));
    },
    ...ngDevMode ? [{ debugName: "coefs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  maxFold = computed(
    () => Math.max(...(this.m()?.metrics.folds ?? []).map((f) => f.rmse ?? 0), 1e-9),
    ...ngDevMode ? [{ debugName: "maxFold" }] : (
      /* istanbul ignore next */
      []
    )
  );
  showAllEx = signal(
    false,
    ...ngDevMode ? [{ debugName: "showAllEx" }] : (
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
  approving = signal(
    false,
    ...ngDevMode ? [{ debugName: "approving" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approveError = signal(
    null,
    ...ngDevMode ? [{ debugName: "approveError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.load(id));
    });
  }
  load(id = this.id(), keep = false) {
    this.st.load(forkJoin({
      model: this.api.get(`/models/${id}`),
      users: this.api.get("/users").pipe(catchError(() => of([])))
    }), keep);
  }
  name(id) {
    if (!id)
      return "System";
    if (id === this.auth.profile()?.id)
      return "You";
    return this.users().get(id)?.full_name ?? "Another team member";
  }
  foldW(v) {
    return (v ?? 0) / this.maxFold() * 100;
  }
  feats(f) {
    return f.map(featureLabel).join(", ");
  }
  approve() {
    this.approving.set(true);
    this.approveError.set(null);
    this.api.post(`/models/${this.id()}/approve`).subscribe({
      next: (m) => {
        this.approving.set(false);
        this.confirmOpen.set(false);
        this.toast.success("Model approved", `${m.name} v${m.version} can now be used for soil-carbon maps.`);
        this.load(this.id(), true);
      },
      error: (e) => {
        this.approving.set(false);
        this.approveError.set(e.code === "SELF_APPROVAL_REJECTED" ? `${e.message} Four-eyes rule: the person who trained a model can't approve it.` : e.message);
      }
    });
  }
  static \u0275fac = function ModelDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ModelDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ModelDetailPage, selectors: [["vc-model-detail"]], inputs: { id: [1, "id"] }, decls: 21, vars: 8, consts: [["routerLink", "/app/models", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load the model", 3, "message"], ["title", "Approve this model?", "width", "480px", 3, "openChange", "open"], [1, "stack", 2, "--gap", "12px"], [1, "muted", "small"], ["title", "Not approved", 3, "message"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], [3, "rows"], [3, "title", "subtitle"], ["actions", "", 1, "row", 2, "--gap", "8px"], ["cls", "MODELLED"], [3, "status"], [1, "btn", "btn-primary", 3, "disabled", "title"], [1, "who", "card"], [1, "k"], [1, "subtle", "small"], [1, "num"], [1, "subtle", "small", "num"], ["cls", "MEASURED"], ["tone", "info", "icon", "users"], [1, "metrics"], [1, "mc"], [1, "grid", "split"], [1, "card-head"], [1, "hold"], ["name", "shield", 3, "size"], [1, "card-body", "stack", 2, "--gap", "14px"], [1, "expl"], [1, "folds"], [1, "fold"], [1, "small", "subtle"], [1, "card-body"], [1, "co"], [1, "small", "subtle", 2, "margin-top", "12px"], [1, "btn", "btn-primary", 3, "click", "disabled", "title"], ["name", "check-circle"], [1, "muted"], [1, "fh"], [1, "fm", "num"], [1, "fb"], [1, "cl"], [1, "cb"], [1, "mid"], [1, "fill"], [1, "cv", "num"], [1, "table-wrap"], [1, "table"], [1, "card-foot"], [1, "mono", "small"], [1, "small", "muted", 2, "margin-right", "auto"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"]], template: function ModelDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All models");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, ModelDetailPage_Conditional_3_Template, 2, 1, "div", 2)(4, ModelDetailPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, ModelDetailPage_Conditional_5_Template, 113, 43);
      \u0275\u0275elementStart(6, "vc-modal", 4);
      \u0275\u0275twoWayListener("openChange", function ModelDetailPage_Template_vc_modal_openChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.confirmOpen, $event) || (ctx.confirmOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(7, "div", 5)(8, "p");
      \u0275\u0275text(9, "Approving ");
      \u0275\u0275elementStart(10, "strong");
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275text(12, " lets it be used for soil-carbon maps and sampling plans. Any previously approved version of this model is retired.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p", 6);
      \u0275\u0275text(14, "Its predictions stay MODELLED \u2014 they never feed a carbon calculation.");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(15, ModelDetailPage_Conditional_15_Template, 1, 1, "vc-error", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(16, 8);
      \u0275\u0275elementStart(17, "button", 9);
      \u0275\u0275listener("click", function ModelDetailPage_Template_button_click_17_listener() {
        return ctx.confirmOpen.set(false);
      });
      \u0275\u0275text(18, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "button", 10);
      \u0275\u0275listener("click", function ModelDetailPage_Template_button_click_19_listener() {
        return ctx.approve();
      });
      \u0275\u0275text(20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.st.loading() ? 3 : ctx.st.error() ? 4 : (tmp_1_0 = ctx.m()) ? 5 : -1, tmp_1_0);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("open", ctx.confirmOpen);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate2("", ctx.m()?.name, " v", ctx.m()?.version);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.approveError() ? 15 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.approving());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.approving() ? "Approving\u2026" : "Approve model");
    }
  }, dependencies: [Icon, Badge, DataClass, PageHeader, Loading, ErrorBox, Callout, Modal, RouterLink, NumPipe, DayPipe], styles: ["\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  margin-bottom: 12px;\n  color: var(--%NS%text-2);\n}\n.who[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  margin-bottom: 16px;\n}\n.who[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 14px 18px;\n  border-right: 1px solid var(--%NS%border);\n}\n.who[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child {\n  border-right: 0;\n}\n.who[_ngcontent-%COMP%]   .k[_ngcontent-%COMP%], \n.mc[_ngcontent-%COMP%]   .k[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n  font-weight: 500;\n}\n@media (max-width: 1000px) {\n  .who[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\nvc-callout[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.metrics[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n@media (max-width: 1200px) {\n  .metrics[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n.mc[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  padding: 14px 16px;\n  box-shadow: var(--%NS%shadow-sm);\n}\n.mc[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin: 6px 0 4px;\n}\n.mc[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  font-weight: 500;\n  margin-left: 4px;\n  letter-spacing: 0;\n}\n.mc[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  line-height: 1.4;\n}\n.mc.warn[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--%NS%amber-600);\n}\n.split[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  align-items: start;\n  margin-bottom: 16px;\n}\n@media (max-width: 1100px) {\n  .split[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.hold[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  color: var(--%NS%forest-700);\n  font-weight: 500;\n}\n.expl[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-700);\n  font-size: 13.5px;\n}\n.folds[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.fold[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  background: var(--%NS%surface-2);\n}\n.fh[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.fm[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 14px;\n  font-size: 12px;\n  color: var(--%NS%stone-700);\n  margin-top: 4px;\n}\n.fb[_ngcontent-%COMP%] {\n  height: 4px;\n  border-radius: 2px;\n  background: var(--%NS%sand-200);\n  margin-top: 6px;\n  overflow: hidden;\n}\n.fb[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  background: var(--%NS%forest-400);\n}\n.co[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 180px 1fr 64px;\n  gap: 12px;\n  align-items: center;\n  padding: 6px 0;\n}\n.cl[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%stone-800);\n}\n.cb[_ngcontent-%COMP%] {\n  position: relative;\n  height: 10px;\n  border-radius: 5px;\n  background: var(--%NS%sand-100);\n}\n.cb[_ngcontent-%COMP%]   .mid[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: -3px;\n  bottom: -3px;\n  width: 1px;\n  background: var(--%NS%stone-300);\n}\n.cb[_ngcontent-%COMP%]   .fill[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border-radius: 5px;\n  background: var(--%NS%forest-500);\n}\n.cb[_ngcontent-%COMP%]   .fill.neg[_ngcontent-%COMP%] {\n  background: var(--%NS%clay-500);\n}\n.cv[_ngcontent-%COMP%] {\n  text-align: right;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n}\n/*# sourceMappingURL=model-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModelDetailPage, [{
    type: Component,
    args: [{ selector: "vc-model-detail", imports: [...KIT, RouterLink, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/models" class="back"><vc-icon name="arrow-left" [size]="14" />All models</a>
    @if (st.loading()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (st.error()) {
      <vc-error title="Couldn't load the model" [message]="st.error()!.message" />
    } @else if (m(); as m) {
      <vc-page-header [title]="m.name + ' \xB7 version ' + m.version" [subtitle]="alg(m.algorithm) + ' \xB7 ' + m.features.length + ' features \xB7 ' + (m.notes ?? '')">
        <div actions class="row" style="--gap:8px">
          <vc-dc cls="MODELLED" />
          <vc-badge [status]="m.status" />
          @if (m.status === 'candidate' && canApprove()) {
            <button class="btn btn-primary" [disabled]="isAuthor()" [title]="isAuthor() ? 'You trained this model, so someone else must approve it' : ''" (click)="confirmOpen.set(true)">
              <vc-icon name="check-circle" />Approve model</button>
          }
        </div>
      </vc-page-header>

      <div class="who card">
        <div><span class="k">Trained by</span><strong>{{ name(m.created_by) }}</strong><span class="subtle small">{{ m.created_at | day: true }}</span></div>
        <div><span class="k">Approved by</span>
          @if (m.approved_by) { <strong>{{ name(m.approved_by) }}</strong><span class="subtle small">{{ m.approved_at | day: true }}</span> }
          @else { <strong class="muted">Not yet approved</strong><span class="subtle small">A second person must approve</span> }
        </div>
        <div><span class="k">Training data</span><strong class="num">{{ m.training_summary?.rows ?? m.training_rows }} lab results</strong>
          <span class="subtle small num">{{ m.training_summary?.farms }} farms \xB7 {{ m.training_summary?.fields }} fields</span></div>
        <div><span class="k">Target</span><strong>Top-layer SOC %</strong><span class="subtle small">Accepted lab results \xB7 <vc-dc cls="MEASURED" /></span></div>
      </div>
      @if (m.status === 'candidate' && isAuthor() && canApprove()) {
        <vc-callout tone="info" icon="users">You trained this model, so you can't approve it yourself. Four-eyes review: another person with approval rights must check the validation below and approve it.</vc-callout>
      }

      <div class="metrics">
        <div class="mc"><span class="k">RMSE</span><strong class="num">{{ m.metrics.rmse | num: 3 }}<small>% SOC</small></strong><p>Typical size of an error, with large misses weighted more.</p></div>
        <div class="mc"><span class="k">MAE</span><strong class="num">{{ m.metrics.mae | num: 3 }}<small>% SOC</small></strong><p>Average absolute difference from the lab value.</p></div>
        <div class="mc"><span class="k">Bias</span><strong class="num">{{ m.metrics.bias > 0 ? '+' : '' }}{{ m.metrics.bias | num: 3 }}<small>% SOC</small></strong><p>{{ m.metrics.bias > 0 ? 'Tends to over-predict' : m.metrics.bias < 0 ? 'Tends to under-predict' : 'No systematic lean' }} \u2014 closer to zero is better.</p></div>
        <div class="mc"><span class="k">R\xB2</span><strong class="num">{{ m.metrics.r2 | num: 2 }}</strong><p>Share of the variation between samples the model explains (1 = all).</p></div>
        <div class="mc" [class.warn]="m.metrics.coverage_90 < 0.8">
          <span class="k">90% interval coverage</span><strong class="num">{{ (m.metrics.coverage_90 * 100).toFixed(0) }}<small>%</small></strong>
          <p>How often the lab value fell inside the predicted range. The aim is about 90%.</p>
        </div>
      </div>

      <div class="grid split">
        <section class="card">
          <div class="card-head"><h3>How it was validated</h3><span class="hold"><vc-icon name="shield" [size]="14" />{{ val(m.validation, m.metrics.k) }}</span></div>
          <div class="card-body stack" style="--gap:14px">
            <p class="expl">Samples from the same farm are alike, so testing on them would flatter the model. Instead, <strong>whole farms are held out</strong>:
              the farms are split into {{ m.metrics.k }} groups; the model is trained {{ m.metrics.k }} times, each time without one group, and tested on the farms it never saw.
              Every metric above comes from those held-out predictions.</p>
            <div class="folds">
              @for (f of m.metrics.folds ?? []; track f.fold) {
                <div class="fold">
                  <div class="fh"><strong>Fold {{ f.fold + 1 }}</strong><span class="subtle small num">{{ f.farms.length }} farm{{ f.farms.length === 1 ? '' : 's' }} \xB7 {{ f.n_test }} samples held out</span></div>
                  <div class="fm num"><span>RMSE {{ f.rmse | num: 3 }}</span><span>MAE {{ f.mae | num: 3 }}</span></div>
                  <div class="fb"><span [style.width.%]="foldW(f.rmse)"></span></div>
                </div>
              }
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><h3>What drives the prediction</h3><span class="small subtle">Standardised coefficients</span></div>
          <div class="card-body">
            @for (c of coefs(); track c.key) {
              <div class="co">
                <span class="cl">{{ c.label }}</span>
                <span class="cb"><span class="mid"></span><span class="fill" [class.neg]="c.v < 0" [style.width.%]="c.w / 2" [style.left.%]="c.v < 0 ? 50 - c.w / 2 : 50"></span></span>
                <span class="cv num">{{ c.v > 0 ? '+' : '' }}{{ c.v | num: 3 }}</span>
              </div>
            } @empty { <p class="muted small">Coefficients aren't available for this model.</p> }
            <p class="small subtle" style="margin-top:12px">Positive means higher values of the feature go with higher predicted SOC. Ridge \u03BB = {{ m.params?.lambda }}.</p>
          </div>
        </section>
      </div>

      @if (m.training_summary?.excluded?.length) {
        <section class="card">
          <div class="card-head"><h3>Samples left out of training</h3><span class="subtle small">{{ m.training_summary!.excluded.length }}</span></div>
          <div class="table-wrap">
            <table class="table"><thead><tr><th>Sample</th><th>Missing</th></tr></thead>
              <tbody>@for (e of m.training_summary!.excluded.slice(0, showAllEx() ? 200 : 6); track e.sample_code) {
                <tr><td class="mono small">{{ e.sample_code }}</td><td class="muted small">{{ feats(e.missing_features) }}</td></tr>
              }</tbody></table>
          </div>
          @if (m.training_summary!.excluded.length > 6) {
            <div class="card-foot"><span class="small muted" style="margin-right:auto">These samples had a feature value missing on their collection date, so they couldn't be used.</span>
              <button class="btn btn-ghost btn-sm" (click)="showAllEx.set(!showAllEx())">{{ showAllEx() ? 'Show fewer' : 'Show all ' + m.training_summary!.excluded.length }}</button></div>
          }
        </section>
      }
    }

    <vc-modal [(open)]="confirmOpen" title="Approve this model?" width="480px">
      <div class="stack" style="--gap:12px">
        <p>Approving <strong>{{ m()?.name }} v{{ m()?.version }}</strong> lets it be used for soil-carbon maps and sampling plans. Any previously approved version of this model is retired.</p>
        <p class="muted small">Its predictions stay MODELLED \u2014 they never feed a carbon calculation.</p>
        @if (approveError()) { <vc-error title="Not approved" [message]="approveError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="confirmOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="approving()" (click)="approve()">{{ approving() ? 'Approving\u2026' : 'Approve model' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;7edbc9c14075cf50;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\models\\model-detail.page.ts */\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  margin-bottom: 12px;\n  color: var(--text-2);\n}\n.who {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  margin-bottom: 16px;\n}\n.who > div {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 14px 18px;\n  border-right: 1px solid var(--border);\n}\n.who > div:last-child {\n  border-right: 0;\n}\n.who .k,\n.mc .k {\n  font-size: 12px;\n  color: var(--text-2);\n  font-weight: 500;\n}\n@media (max-width: 1000px) {\n  .who {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\nvc-callout {\n  margin-bottom: 16px;\n}\n.metrics {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 12px;\n  margin-bottom: 16px;\n}\n@media (max-width: 1200px) {\n  .metrics {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n.mc {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  padding: 14px 16px;\n  box-shadow: var(--shadow-sm);\n}\n.mc strong {\n  display: block;\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin: 6px 0 4px;\n}\n.mc strong small {\n  font-size: 12px;\n  color: var(--text-3);\n  font-weight: 500;\n  margin-left: 4px;\n  letter-spacing: 0;\n}\n.mc p {\n  font-size: 12px;\n  color: var(--text-3);\n  line-height: 1.4;\n}\n.mc.warn {\n  border-top: 3px solid var(--amber-600);\n}\n.split {\n  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);\n  align-items: start;\n  margin-bottom: 16px;\n}\n@media (max-width: 1100px) {\n  .split {\n    grid-template-columns: 1fr;\n  }\n}\n.hold {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  color: var(--forest-700);\n  font-weight: 500;\n}\n.expl {\n  color: var(--stone-700);\n  font-size: 13.5px;\n}\n.folds {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.fold {\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  background: var(--surface-2);\n}\n.fh {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.fm {\n  display: flex;\n  gap: 14px;\n  font-size: 12px;\n  color: var(--stone-700);\n  margin-top: 4px;\n}\n.fb {\n  height: 4px;\n  border-radius: 2px;\n  background: var(--sand-200);\n  margin-top: 6px;\n  overflow: hidden;\n}\n.fb span {\n  display: block;\n  height: 100%;\n  background: var(--forest-400);\n}\n.co {\n  display: grid;\n  grid-template-columns: 180px 1fr 64px;\n  gap: 12px;\n  align-items: center;\n  padding: 6px 0;\n}\n.cl {\n  font-size: 13px;\n  color: var(--stone-800);\n}\n.cb {\n  position: relative;\n  height: 10px;\n  border-radius: 5px;\n  background: var(--sand-100);\n}\n.cb .mid {\n  position: absolute;\n  left: 50%;\n  top: -3px;\n  bottom: -3px;\n  width: 1px;\n  background: var(--stone-300);\n}\n.cb .fill {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border-radius: 5px;\n  background: var(--forest-500);\n}\n.cb .fill.neg {\n  background: var(--clay-500);\n}\n.cv {\n  text-align: right;\n  font-size: 12.5px;\n  color: var(--stone-700);\n}\n/*# sourceMappingURL=model-detail.page.css.map */\n"] }]
  }], () => [], { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ModelDetailPage, { className: "ModelDetailPage", filePath: "src/app/features/models/model-detail.page.ts", lineNumber: 157 });
})();

// src/app/features/models/emissions.tab.ts
var _forTrack02 = ($index, $item) => $item.key;
function EmissionsTab_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "vc-loading", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 4);
  }
}
function EmissionsTab_Conditional_15_Conditional_0_Conditional_8_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "code");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const k_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(k_r1);
  }
}
function EmissionsTab_Conditional_15_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "span", 19);
    \u0275\u0275text(2, "Needed");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, EmissionsTab_Conditional_15_Conditional_0_Conditional_8_For_4_Template, 2, 1, "code", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r2 = \u0275\u0275nextContext(2);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.factorKeys(e_r2));
  }
}
function EmissionsTab_Conditional_15_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 18);
    \u0275\u0275element(1, "vc-icon", 13);
    \u0275\u0275text(2, "Open methodology rules");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function EmissionsTab_Conditional_15_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10)(1, "div", 12);
    \u0275\u0275element(2, "vc-icon", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 14)(4, "h3");
    \u0275\u0275text(5, "Emission factors not configured in the rule pack");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 15);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, EmissionsTab_Conditional_15_Conditional_0_Conditional_8_Template, 5, 0, "div", 16);
    \u0275\u0275elementStart(9, "ol", 17)(10, "li");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "li");
    \u0275\u0275text(13, "A second reviewer approves the new rule-pack version.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "li");
    \u0275\u0275text(15, "Come back here \u2014 the estimate is worked out from the approved values.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, EmissionsTab_Conditional_15_Conditional_0_Conditional_16_Template, 3, 1, "a", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r2 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 22);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(e_r2.message);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.factorKeys(e_r2).length ? 8 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("A methodology scientist adds the factor", ctx_r2.factorKeys(e_r2).length === 1 ? "" : "s", " with a cited source to the project's rule pack.");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.canRules() ? 16 : -1);
  }
}
function EmissionsTab_Conditional_15_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 11);
  }
  if (rf & 2) {
    const e_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("message", e_r2.message);
  }
}
function EmissionsTab_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EmissionsTab_Conditional_15_Conditional_0_Template, 17, 5, "section", 10)(1, EmissionsTab_Conditional_15_Conditional_1_Template, 1, 1, "vc-error", 11);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.code === "RULE_MISSING" ? 0 : 1);
  }
}
function EmissionsTab_Conditional_16_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 28)(2, "span", 29);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "span", 30)(5, "vc-dc", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 32);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "num");
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "tCO\u2082e");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 33);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "num");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r5 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r5.key === "baseline" ? "Baseline scenario" : "Project scenario");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 5, s_r5.v.t_co2e, 3));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate3("", \u0275\u0275pipeBind2(13, 8, s_r5.v.n_kg, 1), " kg N from ", s_r5.v.records, " record", s_r5.v.records === 1 ? "" : "s");
  }
}
function EmissionsTab_Conditional_16_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "span", 29);
    \u0275\u0275text(2, "No fertiliser records");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 34);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "day");
    \u0275\u0275pipe(6, "day");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("No synthetic fertiliser was recorded between ", \u0275\u0275pipeBind1(5, 2, d_r4.start), " and ", \u0275\u0275pipeBind1(6, 4, d_r4.end), ".");
  }
}
function EmissionsTab_Conditional_16_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 29);
    \u0275\u0275text(2, "Records left out");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 32);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 2);
    \u0275\u0275text(6, "These fertiliser records don't state nitrogen (kg N or % N), so they can't be estimated.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(d_r4.records_missing_n.length);
  }
}
function EmissionsTab_Conditional_16_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 26);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 35);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r6 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r6.key);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r6.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r6.source || "\u2014");
  }
}
function EmissionsTab_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275repeaterCreate(1, EmissionsTab_Conditional_16_For_2_Template, 14, 11, "div", 21, _forTrack02, false, EmissionsTab_Conditional_16_ForEmpty_3_Template, 7, 6, "div", 21);
    \u0275\u0275conditionalCreate(4, EmissionsTab_Conditional_16_Conditional_4_Template, 7, 1, "div", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "section", 8)(6, "div", 23)(7, "h3");
    \u0275\u0275text(8, "Factors used");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 19);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 24)(12, "table", 25)(13, "thead")(14, "tr")(15, "th");
    \u0275\u0275text(16, "Factor");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 26);
    \u0275\u0275text(18, "Value");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Source");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody");
    \u0275\u0275repeaterCreate(22, EmissionsTab_Conditional_16_For_23_Template, 8, 3, "tr", null, _forTrack02);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 27)(25, "span", 2);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const d_r4 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.scenarios());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(d_r4.records_missing_n.length ? 4 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(d_r4.rule_pack);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r2.factors());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(d_r4.note);
  }
}
var EmissionsTab = class _EmissionsTab {
  api = inject(ApiService);
  auth = inject(AuthService);
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  start = signal(
    daysAgo(365),
    ...ngDevMode ? [{ debugName: "start" }] : (
      /* istanbul ignore next */
      []
    )
  );
  end = signal(
    isoDate(/* @__PURE__ */ new Date()),
    ...ngDevMode ? [{ debugName: "end" }] : (
      /* istanbul ignore next */
      []
    )
  );
  est = new Remote();
  canRules = computed(
    () => this.auth.can("rules.edit", "data.read"),
    ...ngDevMode ? [{ debugName: "canRules" }] : (
      /* istanbul ignore next */
      []
    )
  );
  scenarios = computed(
    () => Object.entries(this.est.data()?.by_scenario ?? {}).map(([key, v]) => ({ key, v })).sort((a, b) => a.key.localeCompare(b.key)),
    ...ngDevMode ? [{ debugName: "scenarios" }] : (
      /* istanbul ignore next */
      []
    )
  );
  factors = computed(
    () => Object.entries(this.est.data()?.factors ?? {}).map(([key, f]) => __spreadValues({ key }, f)),
    ...ngDevMode ? [{ debugName: "factors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const pid = this.projectId(), s = this.start(), e = this.end();
      untracked(() => {
        if (s && e)
          this.est.load(this.api.get(`/projects/${pid}/emissions-estimate`, { start: s, end: e }));
      });
    });
  }
  factorKeys(e) {
    const k = e.details?.["factor_keys"];
    return Array.isArray(k) ? k.map(String) : [];
  }
  static \u0275fac = function EmissionsTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EmissionsTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmissionsTab, selectors: [["vc-emissions-tab"]], inputs: { projectId: [1, "projectId"] }, decls: 17, vars: 3, consts: [[1, "card", "win"], [1, "wl"], [1, "small", "muted"], [1, "field"], ["for", "es"], ["id", "es", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "ee"], ["id", "ee", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], [1, "card"], [3, "rows"], [1, "card", "missing"], ["title", "Couldn't make an estimate", 3, "message"], [1, "mi"], ["name", "scale", 3, "size"], [1, "mb"], [1, "muted"], [1, "keys"], [1, "steps", "small"], ["routerLink", "/app/methodology", 1, "btn", "btn-secondary", "btn-sm"], [1, "small", "subtle"], [1, "grid", "grid-3"], [1, "card", "card-pad", "sc"], [1, "card", "card-pad", "sc", "warnc"], [1, "card-head"], [1, "table-wrap"], [1, "table"], [1, "num"], [1, "card-foot", "left"], [1, "row"], [1, "label"], [1, "spacer"], ["cls", "MODELLED"], [1, "big", "num"], [1, "small", "muted", "num"], [1, "small", "muted", 2, "margin-top", "6px"], [1, "muted", "small"]], template: function EmissionsTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "h3");
      \u0275\u0275text(3, "Fertiliser nitrous-oxide estimate");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 2);
      \u0275\u0275text(5, "Estimates N\u2082O emissions from synthetic fertiliser records, using only emission factors from the approved rule pack. Nothing is assumed when a factor is missing.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 3)(7, "label", 4);
      \u0275\u0275text(8, "From");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "input", 5);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function EmissionsTab_Template_input_ngModelChange_9_listener($event) {
        return ctx.start.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 3)(11, "label", 6);
      \u0275\u0275text(12, "To");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "input", 7);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function EmissionsTab_Template_input_ngModelChange_13_listener($event) {
        return ctx.end.set($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(14, EmissionsTab_Conditional_14_Template, 2, 1, "div", 8)(15, EmissionsTab_Conditional_15_Template, 2, 1)(16, EmissionsTab_Conditional_16_Template, 27, 4);
    }
    if (rf & 2) {
      let tmp_4_0;
      \u0275\u0275advance(9);
      \u0275\u0275property("ngModel", ctx.start());
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.end());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.est.loading() ? 14 : (tmp_4_0 = ctx.est.error()) ? 15 : (tmp_4_0 = ctx.est.data()) ? 16 : -1, tmp_4_0);
    }
  }, dependencies: [Icon, DataClass, Loading, ErrorBox, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, RouterLink, NumPipe, DayPipe], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.win[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: flex-end;\n  padding: 18px 20px;\n  flex-wrap: wrap;\n}\n.wl[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 280px;\n}\n.wl[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  max-width: 620px;\n}\n.win[_ngcontent-%COMP%]   .field[_ngcontent-%COMP%] {\n  width: 170px;\n}\n.missing[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  padding: 22px 24px;\n  border-left: 3px solid var(--%NS%amber-600);\n}\n.mi[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 44px;\n  height: 44px;\n  border-radius: 10px;\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n}\n.mb[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  align-items: flex-start;\n}\n.keys[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.keys[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 12px;\n  background: var(--%NS%sand-100);\n  padding: 2px 6px;\n  border-radius: 4px;\n  border: 1px solid var(--%NS%border);\n}\n.steps[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 18px;\n  color: var(--%NS%stone-700);\n}\n.steps[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]    + li[_ngcontent-%COMP%] {\n  margin-top: 3px;\n}\n.sc[_ngcontent-%COMP%]   .big[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: 600;\n  margin: 8px 0 2px;\n  letter-spacing: -0.02em;\n}\n.sc[_ngcontent-%COMP%]   .big[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%text-3);\n  margin-left: 5px;\n  font-weight: 500;\n}\n.warnc[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--%NS%amber-600);\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=emissions.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmissionsTab, [{
    type: Component,
    args: [{ selector: "vc-emissions-tab", imports: [...KIT, FormsModule, RouterLink, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <section class="card win">
      <div class="wl">
        <h3>Fertiliser nitrous-oxide estimate</h3>
        <p class="small muted">Estimates N\u2082O emissions from synthetic fertiliser records, using only emission factors from the approved rule pack. Nothing is assumed when a factor is missing.</p>
      </div>
      <div class="field"><label for="es">From</label><input id="es" type="date" class="input" [ngModel]="start()" (ngModelChange)="start.set($event)" /></div>
      <div class="field"><label for="ee">To</label><input id="ee" type="date" class="input" [ngModel]="end()" (ngModelChange)="end.set($event)" /></div>
    </section>

    @if (est.loading()) {
      <div class="card"><vc-loading [rows]="4" /></div>
    } @else if (est.error(); as e) {
      @if (e.code === 'RULE_MISSING') {
        <section class="card missing">
          <div class="mi"><vc-icon name="scale" [size]="22" /></div>
          <div class="mb">
            <h3>Emission factors not configured in the rule pack</h3>
            <p class="muted">{{ e.message }}</p>
            @if (factorKeys(e).length) {
              <div class="keys"><span class="small subtle">Needed</span>@for (k of factorKeys(e); track k) { <code>{{ k }}</code> }</div>
            }
            <ol class="steps small">
              <li>A methodology scientist adds the factor{{ factorKeys(e).length === 1 ? '' : 's' }} with a cited source to the project's rule pack.</li>
              <li>A second reviewer approves the new rule-pack version.</li>
              <li>Come back here \u2014 the estimate is worked out from the approved values.</li>
            </ol>
            @if (canRules()) { <a class="btn btn-secondary btn-sm" routerLink="/app/methodology"><vc-icon name="scale" [size]="14" />Open methodology rules</a> }
          </div>
        </section>
      } @else {
        <vc-error title="Couldn't make an estimate" [message]="e.message" />
      }
    } @else if (est.data(); as d) {
      <div class="grid grid-3">
        @for (s of scenarios(); track s.key) {
          <div class="card card-pad sc">
            <div class="row"><span class="label">{{ s.key === 'baseline' ? 'Baseline scenario' : 'Project scenario' }}</span><span class="spacer"></span><vc-dc cls="MODELLED" /></div>
            <div class="big num">{{ s.v.t_co2e | num: 3 }}<span>tCO\u2082e</span></div>
            <div class="small muted num">{{ s.v.n_kg | num: 1 }} kg N from {{ s.v.records }} record{{ s.v.records === 1 ? '' : 's' }}</div>
          </div>
        } @empty {
          <div class="card card-pad sc"><span class="label">No fertiliser records</span>
            <p class="small muted" style="margin-top:6px">No synthetic fertiliser was recorded between {{ d.start | day }} and {{ d.end | day }}.</p></div>
        }
        @if (d.records_missing_n.length) {
          <div class="card card-pad sc warnc">
            <span class="label">Records left out</span>
            <div class="big num">{{ d.records_missing_n.length }}</div>
            <div class="small muted">These fertiliser records don't state nitrogen (kg N or % N), so they can't be estimated.</div>
          </div>
        }
      </div>
      <section class="card">
        <div class="card-head"><h3>Factors used</h3><span class="small subtle">{{ d.rule_pack }}</span></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Factor</th><th class="num">Value</th><th>Source</th></tr></thead>
            <tbody>
              @for (f of factors(); track f.key) {
                <tr><td><code>{{ f.key }}</code></td><td class="num">{{ f.value }}</td><td class="muted small">{{ f.source || '\u2014' }}</td></tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot left"><span class="small muted">{{ d.note }}</span></div>
      </section>
    }
  `, styles: ["/* angular:styles/component:scss;6f93a7467966f296;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\models\\emissions.tab.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.win {\n  display: flex;\n  gap: 16px;\n  align-items: flex-end;\n  padding: 18px 20px;\n  flex-wrap: wrap;\n}\n.wl {\n  flex: 1;\n  min-width: 280px;\n}\n.wl p {\n  margin-top: 4px;\n  max-width: 620px;\n}\n.win .field {\n  width: 170px;\n}\n.missing {\n  display: flex;\n  gap: 16px;\n  padding: 22px 24px;\n  border-left: 3px solid var(--amber-600);\n}\n.mi {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 44px;\n  height: 44px;\n  border-radius: 10px;\n  background: var(--amber-100);\n  color: var(--amber-600);\n}\n.mb {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  align-items: flex-start;\n}\n.keys {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.keys code {\n  font-size: 12px;\n  background: var(--sand-100);\n  padding: 2px 6px;\n  border-radius: 4px;\n  border: 1px solid var(--border);\n}\n.steps {\n  margin: 0;\n  padding-left: 18px;\n  color: var(--stone-700);\n}\n.steps li + li {\n  margin-top: 3px;\n}\n.sc .big {\n  font-size: 26px;\n  font-weight: 600;\n  margin: 8px 0 2px;\n  letter-spacing: -0.02em;\n}\n.sc .big span {\n  font-size: 13px;\n  color: var(--text-3);\n  margin-left: 5px;\n  font-weight: 500;\n}\n.warnc {\n  border-top: 3px solid var(--amber-600);\n}\n.card-foot.left {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=emissions.tab.css.map */\n"] }]
  }], () => [], { projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmissionsTab, { className: "EmissionsTab", filePath: "src/app/features/models/emissions.tab.ts", lineNumber: 105 });
})();

// src/app/features/models/optimiser.tab.ts
var _forTrack03 = ($index, $item) => $item.stratum;
var _forTrack12 = ($index, $item) => $item.field_id;
function OptimiserTab_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "vc-loading", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function OptimiserTab_Conditional_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "vc-empty", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("text", e_r1.message);
  }
}
function OptimiserTab_Conditional_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 9);
  }
  if (rf & 2) {
    const e_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", e_r1.message);
  }
}
function OptimiserTab_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, OptimiserTab_Conditional_10_Conditional_0_Template, 2, 1, "div", 7)(1, OptimiserTab_Conditional_10_Conditional_1_Template, 1, 1, "vc-error", 9);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.code === "NO_SOC_MAP" ? 0 : 1);
  }
}
function OptimiserTab_Conditional_11_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1, "Updating\u2026");
    \u0275\u0275elementEnd();
  }
}
function OptimiserTab_Conditional_11_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 20);
  }
}
function OptimiserTab_Conditional_11_Conditional_13_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Stratum ", r_r2.stratum);
  }
}
function OptimiserTab_Conditional_11_Conditional_13_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1, "Outside training data");
    \u0275\u0275elementEnd();
  }
}
function OptimiserTab_Conditional_11_Conditional_13_For_2_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.hr(w_r3));
  }
}
function OptimiserTab_Conditional_11_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 27)(4, "div", 28)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, OptimiserTab_Conditional_11_Conditional_13_For_2_Conditional_7_Template, 2, 1, "span", 29);
    \u0275\u0275element(8, "vc-tier", 30);
    \u0275\u0275conditionalCreate(9, OptimiserTab_Conditional_11_Conditional_13_For_2_Conditional_9_Template, 2, 0, "span", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "ul", 32);
    \u0275\u0275repeaterCreate(11, OptimiserTab_Conditional_11_Conditional_13_For_2_For_12_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 33)(14, "strong", 24);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 34);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "num");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r2 = ctx.$implicit;
    const \u0275$index_63_r5 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_63_r5 + 1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r2.field_code);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.stratum ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("tier", r_r2.supporting_tier);
    \u0275\u0275advance();
    \u0275\u0275conditional(!r_r2.in_domain ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(r_r2.reasons);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(r_r2.suggested_samples);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("sample", r_r2.suggested_samples > 1 ? "s" : "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r2.predicted_soc_pct === null ? "no prediction" : \u0275\u0275pipeBind2(20, 8, r_r2.predicted_soc_pct, 2) + "% SOC");
  }
}
function OptimiserTab_Conditional_11_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ol", 21);
    \u0275\u0275repeaterCreate(1, OptimiserTab_Conditional_11_Conditional_13_For_2_Template, 21, 11, "li", null, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(o_r6.recommendations);
  }
}
function OptimiserTab_Conditional_11_For_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 24);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 24);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r7.stratum === "unstratified" ? "Not stratified" : s_r7.stratum);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r7.fields);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r7.suggested_samples);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r7.extra_samples);
  }
}
function OptimiserTab_Conditional_11_ForEmpty_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 35);
    \u0275\u0275text(2, "Nothing selected.");
    \u0275\u0275elementEnd()();
  }
}
function OptimiserTab_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275element(1, "vc-stat", 12)(2, "vc-stat", 13)(3, "vc-stat", 14)(4, "vc-stat", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 16)(6, "section", 7)(7, "div", 17)(8, "h3");
    \u0275\u0275text(9, "Ranked recommendations");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "vc-dc", 18);
    \u0275\u0275conditionalCreate(11, OptimiserTab_Conditional_11_Conditional_11_Template, 2, 0, "span", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, OptimiserTab_Conditional_11_Conditional_12_Template, 1, 0, "vc-empty", 20)(13, OptimiserTab_Conditional_11_Conditional_13_Template, 3, 0, "ol", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "section", 7)(15, "div", 17)(16, "h3");
    \u0275\u0275text(17, "By stratum");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 22)(19, "table", 23)(20, "thead")(21, "tr")(22, "th");
    \u0275\u0275text(23, "Stratum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "th", 24);
    \u0275\u0275text(25, "Fields");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "th", 24);
    \u0275\u0275text(27, "Samples");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "th", 24);
    \u0275\u0275text(29, "Extra");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "tbody");
    \u0275\u0275repeaterCreate(31, OptimiserTab_Conditional_11_For_32_Template, 9, 4, "tr", null, _forTrack03, false, OptimiserTab_Conditional_11_ForEmpty_33_Template, 3, 0, "tr");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div", 25)(35, "span", 3);
    \u0275\u0275text(36, `"Extra" samples are added where only regional data is available or the field sits outside the model's training range.`);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const o_r6 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("value", o_r6.recommendations.length)("hint", "of a budget of " + o_r6.budget);
    \u0275\u0275advance();
    \u0275\u0275property("value", o_r6.total_suggested_samples)("accent", true);
    \u0275\u0275advance();
    \u0275\u0275property("value", o_r6.per_stratum.length);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r3.outside(o_r6));
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r3.opt.loading() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!o_r6.recommendations.length ? 12 : 13);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(o_r6.per_stratum);
  }
}
var OptimiserTab = class _OptimiserTab {
  api = inject(ApiService);
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  budget = signal(
    10,
    ...ngDevMode ? [{ debugName: "budget" }] : (
      /* istanbul ignore next */
      []
    )
  );
  opt = new Remote();
  timer;
  constructor() {
    effect(() => {
      const pid = this.projectId();
      const b = this.budget();
      untracked(() => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.opt.load(this.api.get(`/projects/${pid}/sampling-optimiser`, { budget: b }), true), 250);
      });
    });
  }
  setBudget(v) {
    const n = Math.round(Number(v));
    if (Number.isFinite(n) && n >= 1 && n <= 1e4)
      this.budget.set(n);
  }
  hr = humanReason;
  outside(o) {
    return o.recommendations.filter((r) => !r.in_domain).length;
  }
  static \u0275fac = function OptimiserTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OptimiserTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OptimiserTab, selectors: [["vc-optimiser-tab"]], inputs: { projectId: [1, "projectId"] }, decls: 12, vars: 3, consts: [[1, "card", "budget"], [1, "bl"], ["for", "bud", 1, "label"], [1, "small", "muted"], [1, "br"], ["id", "bud", "type", "range", "min", "1", "max", "60", 3, "ngModelChange", "ngModel"], ["type", "number", "min", "1", "max", "10000", "aria-label", "Budget", 1, "input", "num", "bn", 3, "ngModelChange", "ngModel"], [1, "card"], [3, "rows"], ["title", "Couldn't run the optimiser", 3, "message"], ["icon", "map", "title", "Generate a soil-carbon map first", 3, "text"], [1, "grid", "grid-4"], ["label", "Fields chosen", "icon", "target", 3, "value", "hint"], ["label", "Samples suggested", "hint", "Includes extra samples where data is weak", "icon", "flask", 3, "value", "accent"], ["label", "Strata covered", "icon", "layers", 3, "value"], ["label", "Outside training data", "hint", "Sampling these extends the model", "icon", "alert", 3, "value"], [1, "grid", "split"], [1, "card-head"], ["cls", "MODELLED"], [1, "small", "subtle"], ["icon", "target", "title", "No fields to recommend", "text", "The latest map has no fields that belong to this project."], [1, "recs"], [1, "table-wrap"], [1, "table"], [1, "num"], [1, "card-foot", "left"], [1, "rk", "num"], [1, "rm"], [1, "row", "wrap", 2, "--gap", "8px"], [1, "chip"], [3, "tier"], [1, "chip", "warn"], [1, "why"], [1, "rs"], [1, "subtle", "small", "num"], ["colspan", "4", 1, "muted"]], template: function OptimiserTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "label", 2);
      \u0275\u0275text(3, "Fields you can sample this round");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "The optimiser picks the fields where one more lab result would reduce uncertainty the most, using the latest soil-carbon map.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "input", 5);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function OptimiserTab_Template_input_ngModelChange_7_listener($event) {
        return ctx.setBudget($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "input", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function OptimiserTab_Template_input_ngModelChange_8_listener($event) {
        return ctx.setBudget($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(9, OptimiserTab_Conditional_9_Template, 2, 1, "div", 7)(10, OptimiserTab_Conditional_10_Template, 2, 1)(11, OptimiserTab_Conditional_11_Template, 37, 9);
    }
    if (rf & 2) {
      let tmp_4_0;
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.budget());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.budget());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.opt.loading() && !ctx.opt.data() ? 9 : (tmp_4_0 = ctx.opt.error()) ? 10 : (tmp_4_0 = ctx.opt.data()) ? 11 : -1, tmp_4_0);
    }
  }, dependencies: [DataClass, Stat, Empty, Loading, ErrorBox, FormsModule, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, TierChip, NumPipe], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.budget[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 24px;\n  align-items: center;\n  padding: 18px 20px;\n  flex-wrap: wrap;\n}\n.bl[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 260px;\n}\n.bl[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  max-width: 560px;\n}\n.br[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.br[_ngcontent-%COMP%]   input[type=range][_ngcontent-%COMP%] {\n  width: 260px;\n  accent-color: var(--%NS%primary);\n}\n.bn[_ngcontent-%COMP%] {\n  width: 84px;\n}\n.split[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .split[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.recs[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.recs[_ngcontent-%COMP%]    > li[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 14px;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n  align-items: flex-start;\n}\n.recs[_ngcontent-%COMP%]    > li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.rk[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 26px;\n  height: 26px;\n  border-radius: 7px;\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  font-size: 12px;\n  font-weight: 600;\n}\n.rm[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.why[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  padding-left: 16px;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n}\n.why[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]    + li[_ngcontent-%COMP%] {\n  margin-top: 2px;\n}\n.rs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  flex: none;\n  min-width: 90px;\n}\n.rs[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 1.1;\n}\n.rs[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.chip[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.chip.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=optimiser.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OptimiserTab, [{
    type: Component,
    args: [{ selector: "vc-optimiser-tab", imports: [...KIT, FormsModule, NumPipe, TierChip], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <section class="card budget">
      <div class="bl">
        <label for="bud" class="label">Fields you can sample this round</label>
        <p class="small muted">The optimiser picks the fields where one more lab result would reduce uncertainty the most, using the latest soil-carbon map.</p>
      </div>
      <div class="br">
        <input id="bud" type="range" min="1" max="60" [ngModel]="budget()" (ngModelChange)="setBudget($event)" />
        <input type="number" class="input num bn" min="1" max="10000" [ngModel]="budget()" (ngModelChange)="setBudget($event)" aria-label="Budget" />
      </div>
    </section>

    @if (opt.loading() && !opt.data()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (opt.error(); as e) {
      @if (e.code === 'NO_SOC_MAP') {
        <div class="card"><vc-empty icon="map" title="Generate a soil-carbon map first" [text]="e.message" /></div>
      } @else {
        <vc-error title="Couldn't run the optimiser" [message]="e.message" />
      }
    } @else if (opt.data(); as o) {
      <div class="grid grid-4">
        <vc-stat label="Fields chosen" [value]="o.recommendations.length" [hint]="'of a budget of ' + o.budget" icon="target" />
        <vc-stat label="Samples suggested" [value]="o.total_suggested_samples" hint="Includes extra samples where data is weak" icon="flask" [accent]="true" />
        <vc-stat label="Strata covered" [value]="o.per_stratum.length" icon="layers" />
        <vc-stat label="Outside training data" [value]="outside(o)" hint="Sampling these extends the model" icon="alert" />
      </div>

      <div class="grid split">
        <section class="card">
          <div class="card-head"><h3>Ranked recommendations</h3><vc-dc cls="MODELLED" />@if (opt.loading()) { <span class="small subtle">Updating\u2026</span> }</div>
          @if (!o.recommendations.length) {
            <vc-empty icon="target" title="No fields to recommend" text="The latest map has no fields that belong to this project." />
          } @else {
            <ol class="recs">
              @for (r of o.recommendations; track r.field_id; let i = $index) {
                <li>
                  <span class="rk num">{{ i + 1 }}</span>
                  <div class="rm">
                    <div class="row wrap" style="--gap:8px">
                      <strong>{{ r.field_code }}</strong>
                      @if (r.stratum) { <span class="chip">Stratum {{ r.stratum }}</span> }
                      <vc-tier [tier]="r.supporting_tier" />
                      @if (!r.in_domain) { <span class="chip warn">Outside training data</span> }
                    </div>
                    <ul class="why">@for (w of r.reasons; track $index) { <li>{{ hr(w) }}</li> }</ul>
                  </div>
                  <div class="rs">
                    <strong class="num">{{ r.suggested_samples }}</strong><span>sample{{ r.suggested_samples > 1 ? 's' : '' }}</span>
                    <span class="subtle small num">{{ r.predicted_soc_pct === null ? 'no prediction' : (r.predicted_soc_pct | num: 2) + '% SOC' }}</span>
                  </div>
                </li>
              }
            </ol>
          }
        </section>
        <section class="card">
          <div class="card-head"><h3>By stratum</h3></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Stratum</th><th class="num">Fields</th><th class="num">Samples</th><th class="num">Extra</th></tr></thead>
              <tbody>
                @for (s of o.per_stratum; track s.stratum) {
                  <tr><td>{{ s.stratum === 'unstratified' ? 'Not stratified' : s.stratum }}</td><td class="num">{{ s.fields }}</td>
                    <td class="num">{{ s.suggested_samples }}</td><td class="num">{{ s.extra_samples }}</td></tr>
                } @empty { <tr><td colspan="4" class="muted">Nothing selected.</td></tr> }
              </tbody>
            </table>
          </div>
          <div class="card-foot left"><span class="small muted">"Extra" samples are added where only regional data is available or the field sits outside the model's training range.</span></div>
        </section>
      </div>
    }
  `, styles: ["/* angular:styles/component:scss;1c4c7c4e745090d6;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\models\\optimiser.tab.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.budget {\n  display: flex;\n  gap: 24px;\n  align-items: center;\n  padding: 18px 20px;\n  flex-wrap: wrap;\n}\n.bl {\n  flex: 1;\n  min-width: 260px;\n}\n.bl p {\n  margin-top: 4px;\n  max-width: 560px;\n}\n.br {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n}\n.br input[type=range] {\n  width: 260px;\n  accent-color: var(--primary);\n}\n.bn {\n  width: 84px;\n}\n.split {\n  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .split {\n    grid-template-columns: 1fr;\n  }\n}\n.recs {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.recs > li {\n  display: flex;\n  gap: 14px;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--stone-100);\n  align-items: flex-start;\n}\n.recs > li:last-child {\n  border-bottom: 0;\n}\n.rk {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 26px;\n  height: 26px;\n  border-radius: 7px;\n  background: var(--forest-50);\n  color: var(--forest-700);\n  font-size: 12px;\n  font-weight: 600;\n}\n.rm {\n  flex: 1;\n  min-width: 0;\n}\n.why {\n  margin: 6px 0 0;\n  padding-left: 16px;\n  font-size: 12.5px;\n  color: var(--stone-700);\n}\n.why li + li {\n  margin-top: 2px;\n}\n.rs {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  flex: none;\n  min-width: 90px;\n}\n.rs strong {\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 1.1;\n}\n.rs span {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.chip {\n  font-size: 11.5px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.chip.warn {\n  background: var(--amber-100);\n  color: var(--amber-600);\n}\n.card-foot.left {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=optimiser.tab.css.map */\n"] }]
  }], () => [], { projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OptimiserTab, { className: "OptimiserTab", filePath: "src/app/features/models/optimiser.tab.ts", lineNumber: 120 });
})();

// src/app/features/models/soc-map.tab.ts
var _forTrack04 = ($index, $item) => $item.field_id;
var _forTrack13 = ($index, $item) => $item.id;
function SocMapTab_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "vc-loading", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function SocMapTab_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.state.error().message);
  }
}
function SocMapTab_Conditional_2_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function SocMapTab_Conditional_2_Conditional_0_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openGen());
    });
    \u0275\u0275element(1, "vc-icon", 13);
    \u0275\u0275text(2, "Generate map");
    \u0275\u0275elementEnd();
  }
}
function SocMapTab_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "vc-empty", 10);
    \u0275\u0275conditionalCreate(2, SocMapTab_Conditional_2_Conditional_0_Conditional_2_Template, 3, 0, "button", 11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.canGenerate() ? 2 : -1);
  }
}
function SocMapTab_Conditional_2_Conditional_1_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const m_r4 = \u0275\u0275readContextLet(0);
    \u0275\u0275textInterpolate1(" \xB7 ", m_r4.summary.out_of_domain, " outside the training data ");
  }
}
function SocMapTab_Conditional_2_Conditional_1_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function SocMapTab_Conditional_2_Conditional_1_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openGen());
    });
    \u0275\u0275element(1, "vc-icon", 34);
    \u0275\u0275text(2, "Regenerate");
    \u0275\u0275elementEnd();
  }
}
function SocMapTab_Conditional_2_Conditional_1_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 35);
    \u0275\u0275element(1, "i", 36);
    \u0275\u0275text(2, "Sample next");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 35);
    \u0275\u0275element(4, "i", 37);
    \u0275\u0275text(5, "Lower priority");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 35);
    \u0275\u0275element(7, "i", 38);
    \u0275\u0275text(8, "No prediction");
    \u0275\u0275elementEnd();
  }
}
function SocMapTab_Conditional_2_Conditional_1_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "span", 40);
    \u0275\u0275elementStart(4, "span", 39);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(2, 7, ctx_r0.rangeLo(), 2), "", ctx_r0.layer() === "prediction" ? "%" : "");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", ctx_r0.gradient());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(6, 10, ctx_r0.rangeHi(), 2), "", ctx_r0.layer() === "prediction" ? "%" : "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.layer() === "prediction" ? "SOC %" : "Interval width, % SOC");
  }
}
function SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 43);
    \u0275\u0275element(1, "vc-icon", 49);
    \u0275\u0275text(2, "Sample next");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
  }
}
function SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 50);
    \u0275\u0275text(4, "%");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, c_r7.predicted_soc_pct, 2));
  }
}
function SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 44);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275pipe(1, "num");
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementStart(3, "span", 51);
    \u0275\u0275element(4, "span", 52)(5, "span", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 54);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "num");
    \u0275\u0275pipe(9, "num");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("title", \u0275\u0275pipeBind2(1, 9, c_r7.lower, 2) + "\u2013" + \u0275\u0275pipeBind2(2, 12, c_r7.upper, 2) + " %");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("left", ctx_r0.pos(c_r7.lower), "%")("width", ctx_r0.pos(c_r7.upper) - ctx_r0.pos(c_r7.lower), "%");
    \u0275\u0275advance();
    \u0275\u0275styleProp("left", ctx_r0.pos(c_r7.predicted_soc_pct), "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275\u0275pipeBind2(8, 15, c_r7.lower, 2), "\u2013", \u0275\u0275pipeBind2(9, 18, c_r7.upper, 2));
  }
}
function SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Missing ", ctx_r0.missing(c_r7));
  }
}
function SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 46);
    \u0275\u0275text(1, "Within range");
    \u0275\u0275elementEnd();
  }
}
function SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1, "Outside");
    \u0275\u0275elementEnd();
  }
}
function SocMapTab_Conditional_2_Conditional_1_For_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 41);
    \u0275\u0275listener("click", function SocMapTab_Conditional_2_Conditional_1_For_62_Template_tr_click_0_listener() {
      const c_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.selected.set(c_r7.field_id));
    });
    \u0275\u0275elementStart(1, "td", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "div", 42)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_7_Template, 3, 1, "span", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td", 20);
    \u0275\u0275conditionalCreate(9, SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_9_Template, 5, 4)(10, SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_10_Template, 2, 0, "span", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275conditionalCreate(12, SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_12_Template, 10, 21, "div", 45)(13, SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_13_Template, 2, 1, "span", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 20);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275conditionalCreate(18, SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_18_Template, 2, 0, "span", 46)(19, SocMapTab_Conditional_2_Conditional_1_For_62_Conditional_19_Template, 2, 0, "span", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 48);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("sel", ctx_r0.selected() === c_r7.field_id)("next", c_r7.sample_next);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r7.rank);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r7.field_code);
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r7.sample_next ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r7.predicted_soc_pct !== null ? 9 : 10);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(c_r7.lower !== null && c_r7.upper !== null ? 12 : 13);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r7.interval_width === null ? "\u2014" : \u0275\u0275pipeBind2(16, 12, c_r7.interval_width, 3));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(c_r7.in_domain ? 18 : 19);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.why(c_r7));
  }
}
function SocMapTab_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "div", 14)(2, "div", 15)(3, "span");
    \u0275\u0275text(4, "MODELLED");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 16)(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 17);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "day");
    \u0275\u0275conditionalCreate(11, SocMapTab_Conditional_2_Conditional_1_Conditional_11_Template, 1, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "div", 18);
    \u0275\u0275elementStart(13, "div", 19)(14, "span");
    \u0275\u0275text(15, "Mean predicted SOC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "strong", 20);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "num");
    \u0275\u0275elementStart(19, "small");
    \u0275\u0275text(20, "%");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(21, SocMapTab_Conditional_2_Conditional_1_Conditional_21_Template, 3, 0, "button", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "section", 0)(23, "div", 22)(24, "div", 23)(25, "button", 24);
    \u0275\u0275listener("click", function SocMapTab_Conditional_2_Conditional_1_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.layer.set("prediction"));
    });
    \u0275\u0275text(26, "Predicted SOC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "button", 24);
    \u0275\u0275listener("click", function SocMapTab_Conditional_2_Conditional_1_Template_button_click_27_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.layer.set("uncertainty"));
    });
    \u0275\u0275text(28, "Uncertainty");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 24);
    \u0275\u0275listener("click", function SocMapTab_Conditional_2_Conditional_1_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.layer.set("priority"));
    });
    \u0275\u0275text(30, "Sampling priority");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(31, "div", 18);
    \u0275\u0275elementStart(32, "div", 25);
    \u0275\u0275conditionalCreate(33, SocMapTab_Conditional_2_Conditional_1_Conditional_33_Template, 9, 0)(34, SocMapTab_Conditional_2_Conditional_1_Conditional_34_Template, 9, 13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "vc-map", 26);
    \u0275\u0275listener("featureClick", function SocMapTab_Conditional_2_Conditional_1_Template_vc_map_featureClick_35_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.selected.set($event.id));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "section", 0)(37, "div", 22)(38, "h3");
    \u0275\u0275text(39, "Fields ranked by sampling priority");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span", 27);
    \u0275\u0275text(41, "Widest uncertainty first");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 28)(43, "table", 29)(44, "thead")(45, "tr")(46, "th", 20);
    \u0275\u0275text(47, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "th");
    \u0275\u0275text(49, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "th", 20);
    \u0275\u0275text(51, "Predicted SOC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "th");
    \u0275\u0275text(53, "90% range");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "th", 20);
    \u0275\u0275text(55, "Width");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "th");
    \u0275\u0275text(57, "Training data");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "th");
    \u0275\u0275text(59, "Why");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(60, "tbody");
    \u0275\u0275repeaterCreate(61, SocMapTab_Conditional_2_Conditional_1_For_62_Template, 22, 15, "tr", 30, _forTrack04);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(63, "div", 31);
    \u0275\u0275element(64, "vc-dc", 32);
    \u0275\u0275elementStart(65, "span", 17);
    \u0275\u0275text(66);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    const m_r8 = \u0275\u0275storeLet(ctx_r0.socMap());
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(m_r8.summary.model);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("Generated ", \u0275\u0275pipeBind1(10, 17, m_r8.generated_on), " \xB7 ", m_r8.summary.predicted, " of ", m_r8.summary.fields, " fields predicted ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(m_r8.summary.out_of_domain ? 11 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 19, m_r8.summary.mean_predicted_soc_pct, 2));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.canGenerate() ? 21 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("on", ctx_r0.layer() === "prediction");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r0.layer() === "uncertainty");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", ctx_r0.layer() === "priority");
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.layer() === "priority" ? 33 : 34);
    \u0275\u0275advance(2);
    \u0275\u0275property("polygons", ctx_r0.polys());
    \u0275\u0275advance(26);
    \u0275\u0275repeater(m_r8.cells);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(m_r8.summary.note);
  }
}
function SocMapTab_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SocMapTab_Conditional_2_Conditional_0_Template, 3, 1, "div", 0)(1, SocMapTab_Conditional_2_Conditional_1_Template, 67, 22);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r0.socMap() ? 0 : 1);
  }
}
function SocMapTab_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 4);
    \u0275\u0275text(1, "There is no approved model yet. Train a model, then ask a second person to approve it \u2014 only approved models can be used for mapping.");
    \u0275\u0275elementEnd();
  }
}
function SocMapTab_Conditional_6_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 58);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r10 = ctx.$implicit;
    \u0275\u0275property("value", m_r10.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", m_r10.name, " v", m_r10.version, " \xB7 RMSE ", \u0275\u0275pipeBind2(2, 4, m_r10.metrics.rmse, 3));
  }
}
function SocMapTab_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55)(1, "label", 56);
    \u0275\u0275text(2, "Approved model");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 57);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function SocMapTab_Conditional_6_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.genModel, $event) || (ctx_r0.genModel = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(4, SocMapTab_Conditional_6_For_5_Template, 3, 7, "option", 58, _forTrack13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 55)(7, "label", 59);
    \u0275\u0275text(8, 'Fields to flag "sample next"');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 60);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function SocMapTab_Conditional_6_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.genTop, $event) || (ctx_r0.genTop = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 61);
    \u0275\u0275text(11, "The fields with the widest uncertainty are flagged.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.genModel);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.approved());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.genTop);
    \u0275\u0275control();
  }
}
function SocMapTab_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.genError());
  }
}
var SocMapTab = class _SocMapTab {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  models = input(
    [],
    ...ngDevMode ? [{ debugName: "models" }] : (
      /* istanbul ignore next */
      []
    )
  );
  state = new Remote();
  socMap = computed(
    () => this.state.data()?.map ?? null,
    ...ngDevMode ? [{ debugName: "socMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  layer = signal(
    "prediction",
    ...ngDevMode ? [{ debugName: "layer" }] : (
      /* istanbul ignore next */
      []
    )
  );
  selected = signal(
    null,
    ...ngDevMode ? [{ debugName: "selected" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canGenerate = computed(
    () => this.auth.can("models.manage", "sampling.plan"),
    ...ngDevMode ? [{ debugName: "canGenerate" }] : (
      /* istanbul ignore next */
      []
    )
  );
  approved = computed(
    () => this.models().filter((m) => m.status === "approved"),
    ...ngDevMode ? [{ debugName: "approved" }] : (
      /* istanbul ignore next */
      []
    )
  );
  preds = computed(
    () => (this.socMap()?.cells ?? []).map((c) => c.predicted_soc_pct).filter((v) => v !== null),
    ...ngDevMode ? [{ debugName: "preds" }] : (
      /* istanbul ignore next */
      []
    )
  );
  widths = computed(
    () => (this.socMap()?.cells ?? []).map((c) => c.interval_width).filter((v) => v !== null),
    ...ngDevMode ? [{ debugName: "widths" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rangeLo = computed(
    () => Math.min(...this.layer() === "prediction" ? this.preds() : this.widths(), Infinity),
    ...ngDevMode ? [{ debugName: "rangeLo" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rangeHi = computed(
    () => Math.max(...this.layer() === "prediction" ? this.preds() : this.widths(), -Infinity),
    ...ngDevMode ? [{ debugName: "rangeHi" }] : (
      /* istanbul ignore next */
      []
    )
  );
  gradient = computed(
    () => `linear-gradient(90deg, ${(this.layer() === "prediction" ? GREEN_RAMP : CLAY_RAMP).join(", ")})`,
    ...ngDevMode ? [{ debugName: "gradient" }] : (
      /* istanbul ignore next */
      []
    )
  );
  // Range bar scale for the table, spanning all lower/upper values.
  scale = computed(
    () => {
      const cells = this.socMap()?.cells ?? [];
      const lo = Math.min(...cells.map((c) => c.lower ?? Infinity));
      const hi = Math.max(...cells.map((c) => c.upper ?? -Infinity));
      return Number.isFinite(lo) && Number.isFinite(hi) && hi > lo ? { lo, hi } : { lo: 0, hi: 1 };
    },
    ...ngDevMode ? [{ debugName: "scale" }] : (
      /* istanbul ignore next */
      []
    )
  );
  polys = computed(
    () => {
      const cells = new Map((this.socMap()?.cells ?? []).map((c) => [c.field_id, c]));
      const layer = this.layer();
      const lo = this.rangeLo(), hi = this.rangeHi();
      const t = (v) => hi > lo ? (v - lo) / (hi - lo) : 0.5;
      return fieldsFC(this.state.data()?.fields ?? [], (f) => {
        const c = cells.get(f.id);
        if (!c)
          return null;
        let color = "#dfe3df";
        if (layer === "prediction" && c.predicted_soc_pct !== null)
          color = ramp(t(c.predicted_soc_pct), GREEN_RAMP);
        if (layer === "uncertainty" && c.interval_width !== null)
          color = ramp(t(c.interval_width), CLAY_RAMP);
        if (layer === "priority")
          color = c.sample_next ? "#c76329" : c.predicted_soc_pct === null ? "#dfe3df" : "#86b797";
        return { color, label: this.label(c) };
      });
    },
    ...ngDevMode ? [{ debugName: "polys" }] : (
      /* istanbul ignore next */
      []
    )
  );
  genOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "genOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  generating = signal(
    false,
    ...ngDevMode ? [{ debugName: "generating" }] : (
      /* istanbul ignore next */
      []
    )
  );
  genError = signal(
    null,
    ...ngDevMode ? [{ debugName: "genError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  genModel = "";
  genTop = 5;
  constructor() {
    effect(() => {
      const pid = this.projectId();
      untracked(() => this.load(pid));
    });
  }
  load(pid = this.projectId(), keep = false) {
    this.state.load(forkJoin({
      // A project without a map answers 404; that is the empty state, not an error.
      map: this.api.get(`/projects/${pid}/soc-maps/latest`).pipe(catchError((e) => e.status === 404 ? of(null) : throwError(() => e))),
      fields: this.api.get("/fields", { project_id: pid, limit: 500 }).pipe(map((r) => r.items))
    }), keep);
  }
  pos(v) {
    const s = this.scale();
    return Math.max(0, Math.min(100, (v - s.lo) / (s.hi - s.lo) * 100));
  }
  why(c) {
    return c.reasons.join(" \xB7 ").replace(/(ndvi_mean|ndmi_mean|rain_365d|temp_mean|elevation_m|clay_pct|practice_count)/g, (k) => featureLabel(k).toLowerCase());
  }
  missing(c) {
    return c.missing_features.map(featureLabel).join(", ").toLowerCase();
  }
  label(c) {
    const pred = c.predicted_soc_pct === null ? "No prediction" : `${c.predicted_soc_pct.toFixed(2)}% SOC`;
    const rng = c.lower !== null && c.upper !== null ? `<br><span style="color:#737c76">90% range ${c.lower.toFixed(2)}\u2013${c.upper.toFixed(2)}%</span>` : "";
    return `<strong>${esc(c.field_code)}</strong> <span style="font:600 9px var(--mono);color:#9a6200;background:#fbefd6;padding:2px 4px;border-radius:3px">MODELLED</span><br>${pred}${rng}<br><span style="color:#737c76">Priority #${c.rank}${c.sample_next ? ' \xB7 <b style="color:#ad4f1f">sample next</b>' : ""}</span>`;
  }
  openGen() {
    this.genError.set(null);
    this.genModel = this.approved()[0]?.id ?? "";
    this.genOpen.set(true);
  }
  generate() {
    this.generating.set(true);
    this.genError.set(null);
    this.api.post(`/projects/${this.projectId()}/soc-map`, { model_id: this.genModel, top_n: Number(this.genTop) || 0 }).subscribe({
      next: (m) => {
        this.generating.set(false);
        this.genOpen.set(false);
        this.toast.success("Soil-carbon map generated", `${m.summary.predicted} of ${m.summary.fields} fields predicted.`);
        this.load(this.projectId(), true);
      },
      error: (e) => {
        this.generating.set(false);
        this.genError.set(e.message);
      }
    });
  }
  static \u0275fac = function SocMapTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SocMapTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SocMapTab, selectors: [["vc-soc-map-tab"]], inputs: { projectId: [1, "projectId"], models: [1, "models"] }, decls: 13, vars: 6, consts: [[1, "card"], ["title", "Couldn't load the soil-carbon map", 3, "message"], ["title", "Generate a soil-carbon map", "subtitle", "Predicts SOC for every enrolled field in this project", "width", "480px", 3, "openChange", "open"], [1, "stack", 2, "--gap", "14px"], ["tone", "warn", "icon", "lock"], ["title", "Map not generated", 3, "message"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], [3, "rows"], ["icon", "map", "title", "No soil-carbon map for this project yet", "text", "Generate one with an approved model. Each enrolled field gets a predicted SOC %, an uncertainty range and a sampling priority."], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], ["name", "sparkles"], [1, "head"], [1, "big-dc"], [1, "hm"], [1, "small", "muted"], [1, "spacer"], [1, "mstat"], [1, "num"], [1, "btn", "btn-secondary"], [1, "card-head"], ["role", "group", "aria-label", "Map layer", 1, "seg"], ["type", "button", 3, "click"], [1, "legend"], ["height", "460px", 1, "flat", 3, "featureClick", "polygons"], [1, "subtle", "small"], [1, "table-wrap"], [1, "table"], [3, "sel", "next"], [1, "card-foot", "left"], ["cls", "MODELLED"], [1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], [1, "li"], [2, "background", "#c76329"], [2, "background", "#c3dbca"], [2, "background", "#dfe3df"], [1, "small", "subtle", "num"], [1, "bar"], [3, "click"], [1, "fc"], [1, "flag"], [1, "subtle"], [1, "rng", 3, "title"], [1, "small", "ok"], [1, "small", "warn"], [1, "small", "muted", "why"], ["name", "target", 3, "size"], [1, "u"], [1, "track"], [1, "span"], [1, "pt"], [1, "small", "num", "subtle"], [1, "field"], ["for", "gm"], ["id", "gm", 1, "input", 3, "ngModelChange", "ngModel"], [3, "value"], ["for", "tn"], ["id", "tn", "type", "number", "min", "0", "max", "500", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "hint"]], template: function SocMapTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, SocMapTab_Conditional_0_Template, 2, 1, "div", 0)(1, SocMapTab_Conditional_1_Template, 1, 1, "vc-error", 1)(2, SocMapTab_Conditional_2_Template, 2, 1);
      \u0275\u0275elementStart(3, "vc-modal", 2);
      \u0275\u0275twoWayListener("openChange", function SocMapTab_Template_vc_modal_openChange_3_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.genOpen, $event) || (ctx.genOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(4, "div", 3);
      \u0275\u0275conditionalCreate(5, SocMapTab_Conditional_5_Template, 2, 0, "vc-callout", 4)(6, SocMapTab_Conditional_6_Template, 12, 2);
      \u0275\u0275conditionalCreate(7, SocMapTab_Conditional_7_Template, 1, 1, "vc-error", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(8, 6);
      \u0275\u0275elementStart(9, "button", 7);
      \u0275\u0275listener("click", function SocMapTab_Template_button_click_9_listener() {
        return ctx.genOpen.set(false);
      });
      \u0275\u0275text(10, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "button", 8);
      \u0275\u0275listener("click", function SocMapTab_Template_button_click_11_listener() {
        return ctx.generate();
      });
      \u0275\u0275text(12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.state.loading() ? 0 : ctx.state.error() ? 1 : 2);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("open", ctx.genOpen);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.approved().length ? 5 : 6);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.genError() ? 7 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.generating() || !ctx.genModel);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.generating() ? "Generating\u2026" : "Generate map");
    }
  }, dependencies: [Icon, DataClass, Empty, Loading, ErrorBox, Callout, Modal, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, MapView, NumPipe, DayPipe], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.big-dc[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  height: 44px;\n  padding: 0 16px;\n  border-radius: 10px;\n  background: var(--%NS%dc-modelled-bg);\n  color: var(--%NS%dc-modelled);\n  font: 700 14px/1 var(--%NS%mono);\n  letter-spacing: 0.12em;\n  border: 1px solid #f1dcae;\n}\n.hm[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.mstat[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n}\n.mstat[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.mstat[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 22px;\n  font-weight: 600;\n}\n.mstat[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%text-3);\n  margin-left: 2px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  background: var(--%NS%sand-100);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 12.5px var(--%NS%font);\n  padding: 6px 12px;\n  border-radius: 6px;\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%stone-900);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.legend[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.legend[_ngcontent-%COMP%]   .bar[_ngcontent-%COMP%] {\n  width: 140px;\n  height: 8px;\n  border-radius: 4px;\n}\n.li[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n  margin-left: 8px;\n}\n.li[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  border-radius: 3px;\n  display: inline-block;\n}\nvc-map.flat[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 0 0 var(--%NS%radius) var(--%NS%radius);\n}\n.fc[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  align-items: flex-start;\n}\n.flag[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 11.5px;\n  font-weight: 600;\n  color: var(--%NS%clay-600);\n  background: var(--%NS%clay-50);\n  padding: 2px 7px;\n  border-radius: 999px;\n  border: 1px solid var(--%NS%clay-100);\n}\n.u[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n  margin-left: 2px;\n}\ntr.sel[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n}\ntr.next[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  box-shadow: inset 3px 0 0 var(--%NS%clay-500);\n}\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.rng[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 190px;\n}\n.track[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  height: 8px;\n  border-radius: 4px;\n  background: var(--%NS%sand-200);\n}\n.span[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border-radius: 4px;\n  background: var(--%NS%amber-100);\n  box-shadow: inset 0 0 0 1px #e8c98a;\n}\n.pt[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -2px;\n  width: 3px;\n  height: 12px;\n  border-radius: 2px;\n  background: var(--%NS%forest-700);\n  transform: translateX(-1px);\n}\n.ok[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.warn[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n  font-weight: 500;\n}\n.why[_ngcontent-%COMP%] {\n  max-width: 340px;\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=soc-map.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SocMapTab, [{
    type: Component,
    args: [{ selector: "vc-soc-map-tab", imports: [...KIT, FormsModule, MapView, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (state.loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (state.error()) {
      <vc-error title="Couldn't load the soil-carbon map" [message]="state.error()!.message" />
    } @else {
      @if (!socMap()) {
        <div class="card">
          <vc-empty icon="map" title="No soil-carbon map for this project yet"
            text="Generate one with an approved model. Each enrolled field gets a predicted SOC %, an uncertainty range and a sampling priority.">
            @if (canGenerate()) { <button class="btn btn-primary" (click)="openGen()"><vc-icon name="sparkles" />Generate map</button> }
          </vc-empty>
        </div>
      } @else {
        @let m = socMap()!;
        <div class="head">
          <div class="big-dc"><span>MODELLED</span></div>
          <div class="hm">
            <strong>{{ m.summary.model }}</strong>
            <span class="small muted">Generated {{ m.generated_on | day }} \xB7 {{ m.summary.predicted }} of {{ m.summary.fields }} fields predicted
              @if (m.summary.out_of_domain) { \xB7 {{ m.summary.out_of_domain }} outside the training data }</span>
          </div>
          <div class="spacer"></div>
          <div class="mstat"><span>Mean predicted SOC</span><strong class="num">{{ m.summary.mean_predicted_soc_pct | num: 2 }}<small>%</small></strong></div>
          @if (canGenerate()) { <button class="btn btn-secondary" (click)="openGen()"><vc-icon name="refresh" />Regenerate</button> }
        </div>

        <section class="card">
          <div class="card-head">
            <div class="seg" role="group" aria-label="Map layer">
              <button type="button" [class.on]="layer() === 'prediction'" (click)="layer.set('prediction')">Predicted SOC</button>
              <button type="button" [class.on]="layer() === 'uncertainty'" (click)="layer.set('uncertainty')">Uncertainty</button>
              <button type="button" [class.on]="layer() === 'priority'" (click)="layer.set('priority')">Sampling priority</button>
            </div>
            <div class="spacer"></div>
            <div class="legend">
              @if (layer() === 'priority') {
                <span class="li"><i style="background:#c76329"></i>Sample next</span>
                <span class="li"><i style="background:#c3dbca"></i>Lower priority</span>
                <span class="li"><i style="background:#dfe3df"></i>No prediction</span>
              } @else {
                <span class="small subtle num">{{ rangeLo() | num: 2 }}{{ layer() === 'prediction' ? '%' : '' }}</span>
                <span class="bar" [style.background]="gradient()"></span>
                <span class="small subtle num">{{ rangeHi() | num: 2 }}{{ layer() === 'prediction' ? '%' : '' }}</span>
                <span class="small muted">{{ layer() === 'prediction' ? 'SOC %' : 'Interval width, % SOC' }}</span>
              }
            </div>
          </div>
          <vc-map [polygons]="polys()" height="460px" (featureClick)="selected.set($event.id)" class="flat" />
        </section>

        <section class="card">
          <div class="card-head"><h3>Fields ranked by sampling priority</h3><span class="subtle small">Widest uncertainty first</span></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th class="num">#</th><th>Field</th><th class="num">Predicted SOC</th><th>90% range</th><th class="num">Width</th><th>Training data</th><th>Why</th></tr></thead>
              <tbody>
                @for (c of m.cells; track c.field_id) {
                  <tr [class.sel]="selected() === c.field_id" [class.next]="c.sample_next" (click)="selected.set(c.field_id)">
                    <td class="num">{{ c.rank }}</td>
                    <td><div class="fc"><strong>{{ c.field_code }}</strong>@if (c.sample_next) { <span class="flag"><vc-icon name="target" [size]="12" />Sample next</span> }</div></td>
                    <td class="num">@if (c.predicted_soc_pct !== null) { <strong>{{ c.predicted_soc_pct | num: 2 }}</strong><span class="u">%</span> } @else { <span class="subtle">\u2014</span> }</td>
                    <td>
                      @if (c.lower !== null && c.upper !== null) {
                        <div class="rng" [title]="(c.lower | num: 2) + '\u2013' + (c.upper | num: 2) + ' %'">
                          <span class="track"><span class="span" [style.left.%]="pos(c.lower)" [style.width.%]="pos(c.upper) - pos(c.lower)"></span>
                            <span class="pt" [style.left.%]="pos(c.predicted_soc_pct!)"></span></span>
                          <span class="small num subtle">{{ c.lower | num: 2 }}\u2013{{ c.upper | num: 2 }}</span>
                        </div>
                      } @else { <span class="subtle small">Missing {{ missing(c) }}</span> }
                    </td>
                    <td class="num">{{ c.interval_width === null ? '\u2014' : (c.interval_width | num: 3) }}</td>
                    <td>@if (c.in_domain) { <span class="small ok">Within range</span> } @else { <span class="small warn">Outside</span> }</td>
                    <td class="small muted why">{{ why(c) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="card-foot left"><vc-dc cls="MODELLED" /><span class="small muted">{{ m.summary.note }}</span></div>
        </section>
      }
    }

    <vc-modal [(open)]="genOpen" title="Generate a soil-carbon map" subtitle="Predicts SOC for every enrolled field in this project" width="480px">
      <div class="stack" style="--gap:14px">
        @if (!approved().length) {
          <vc-callout tone="warn" icon="lock">There is no approved model yet. Train a model, then ask a second person to approve it \u2014 only approved models can be used for mapping.</vc-callout>
        } @else {
          <div class="field">
            <label for="gm">Approved model</label>
            <select id="gm" class="input" [(ngModel)]="genModel">
              @for (m of approved(); track m.id) { <option [value]="m.id">{{ m.name }} v{{ m.version }} \xB7 RMSE {{ m.metrics.rmse | num: 3 }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="tn">Fields to flag "sample next"</label>
            <input id="tn" type="number" class="input num" min="0" max="500" [(ngModel)]="genTop" />
            <span class="hint">The fields with the widest uncertainty are flagged.</span>
          </div>
        }
        @if (genError()) { <vc-error title="Map not generated" [message]="genError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="genOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="generating() || !genModel" (click)="generate()">{{ generating() ? 'Generating\u2026' : 'Generate map' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;cbd7a06c11c076ad;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\models\\soc-map.tab.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.head {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.big-dc {\n  display: grid;\n  place-items: center;\n  height: 44px;\n  padding: 0 16px;\n  border-radius: 10px;\n  background: var(--dc-modelled-bg);\n  color: var(--dc-modelled);\n  font: 700 14px/1 var(--mono);\n  letter-spacing: 0.12em;\n  border: 1px solid #f1dcae;\n}\n.hm {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.mstat {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n}\n.mstat span {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.mstat strong {\n  font-size: 22px;\n  font-weight: 600;\n}\n.mstat small {\n  font-size: 13px;\n  color: var(--text-3);\n  margin-left: 2px;\n}\n.seg {\n  display: inline-flex;\n  background: var(--sand-100);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg button {\n  border: 0;\n  background: none;\n  font: 500 12.5px var(--font);\n  padding: 6px 12px;\n  border-radius: 6px;\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--surface);\n  color: var(--stone-900);\n  box-shadow: var(--shadow-sm);\n}\n.legend {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.legend .bar {\n  width: 140px;\n  height: 8px;\n  border-radius: 4px;\n}\n.li {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  color: var(--stone-700);\n  margin-left: 8px;\n}\n.li i {\n  width: 12px;\n  height: 12px;\n  border-radius: 3px;\n  display: inline-block;\n}\nvc-map.flat {\n  border: 0;\n  border-radius: 0 0 var(--radius) var(--radius);\n}\n.fc {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  align-items: flex-start;\n}\n.flag {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 11.5px;\n  font-weight: 600;\n  color: var(--clay-600);\n  background: var(--clay-50);\n  padding: 2px 7px;\n  border-radius: 999px;\n  border: 1px solid var(--clay-100);\n}\n.u {\n  font-size: 11px;\n  color: var(--text-3);\n  margin-left: 2px;\n}\ntr.sel td {\n  background: var(--forest-50);\n}\ntr.next td:first-child {\n  box-shadow: inset 3px 0 0 var(--clay-500);\n}\ntbody tr {\n  cursor: pointer;\n}\n.rng {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 190px;\n}\n.track {\n  position: relative;\n  flex: 1;\n  height: 8px;\n  border-radius: 4px;\n  background: var(--sand-200);\n}\n.span {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border-radius: 4px;\n  background: var(--amber-100);\n  box-shadow: inset 0 0 0 1px #e8c98a;\n}\n.pt {\n  position: absolute;\n  top: -2px;\n  width: 3px;\n  height: 12px;\n  border-radius: 2px;\n  background: var(--forest-700);\n  transform: translateX(-1px);\n}\n.ok {\n  color: var(--forest-700);\n}\n.warn {\n  color: var(--amber-600);\n  font-weight: 500;\n}\n.why {\n  max-width: 340px;\n}\n.card-foot.left {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=soc-map.tab.css.map */\n"] }]
  }], () => [], { projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }], models: [{ type: Input, args: [{ isSignal: true, alias: "models", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SocMapTab, { className: "SocMapTab", filePath: "src/app/features/models/soc-map.tab.ts", lineNumber: 159 });
})();

// src/app/features/models/models.page.ts
var _c02 = (a0) => [a0];
var _c1 = () => [];
var _forTrack05 = ($index, $item) => $item.key;
var _forTrack14 = ($index, $item) => $item.id;
function ModelsPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function ModelsPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openTrain());
    });
    \u0275\u0275element(1, "vc-icon", 28);
    \u0275\u0275text(2, "Train a model");
    \u0275\u0275elementEnd();
  }
}
function ModelsPage_Case_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 29);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function ModelsPage_Case_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275element(1, "vc-error", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.models.error().message);
  }
}
function ModelsPage_Case_10_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function ModelsPage_Case_10_Conditional_3_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openTrain());
    });
    \u0275\u0275element(1, "vc-icon", 28);
    \u0275\u0275text(2, "Train a model");
    \u0275\u0275elementEnd();
  }
}
function ModelsPage_Case_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 31);
    \u0275\u0275conditionalCreate(1, ModelsPage_Case_10_Conditional_3_Conditional_1_Template, 3, 0, "button", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage() ? 1 : -1);
  }
}
function ModelsPage_Case_10_Conditional_4_For_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 40)(1, "td")(2, "div", 43)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275element(8, "vc-badge", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 46);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 46)(12, "span", 47);
    \u0275\u0275element(13, "vc-icon", 48);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td", 37);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 37);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "num");
    \u0275\u0275elementStart(20, "span", 49);
    \u0275\u0275text(21, "% SOC");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td", 37);
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "td", 37);
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "td", 37);
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "td", 37)(32, "span");
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "td", 50)(35, "span", 51);
    \u0275\u0275pipe(36, "day");
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "ago");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const m_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(36, _c02, m_r4.id));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(m_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Version ", m_r4.version, " \xB7 ", m_r4.features.length, " features");
    \u0275\u0275advance(2);
    \u0275\u0275property("status", m_r4.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.alg(m_r4.algorithm));
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.val(m_r4.validation, m_r4.metrics.k));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r4.training_rows ?? "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(19, 19, m_r4.metrics.rmse, 3));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(24, 22, m_r4.metrics.mae, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", m_r4.metrics.bias > 0 ? "+" : "", "", \u0275\u0275pipeBind2(27, 25, m_r4.metrics.bias, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(30, 28, m_r4.metrics.r2, 2));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("warn", m_r4.metrics.coverage_90 < 0.8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", (m_r4.metrics.coverage_90 * 100).toFixed(0), "%");
    \u0275\u0275advance(2);
    \u0275\u0275property("title", \u0275\u0275pipeBind2(36, 31, m_r4.created_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 34, m_r4.created_at));
  }
}
function ModelsPage_Case_10_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "table", 36)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Model");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Algorithm");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Validation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 37);
    \u0275\u0275text(13, "Rows");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 38);
    \u0275\u0275text(15, "RMSE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 37);
    \u0275\u0275text(17, "MAE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 37);
    \u0275\u0275text(19, "Bias");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th", 37);
    \u0275\u0275text(21, "R\xB2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th", 39);
    \u0275\u0275text(23, "90% interval");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "th");
    \u0275\u0275text(25, "Trained");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "tbody");
    \u0275\u0275repeaterCreate(27, ModelsPage_Case_10_Conditional_4_For_28_Template, 39, 38, "tr", 40, _forTrack14);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "div", 41)(30, "span", 42);
    \u0275\u0275text(31, "All metrics are measured on farms the model never saw during training. Lower RMSE and MAE are better; bias near zero; interval coverage near 90%.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(27);
    \u0275\u0275repeater(ctx_r1.models.data());
  }
}
function ModelsPage_Case_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 6);
    \u0275\u0275conditionalCreate(1, ModelsPage_Case_10_Conditional_1_Template, 1, 1, "vc-loading", 29)(2, ModelsPage_Case_10_Conditional_2_Template, 2, 1, "div", 30)(3, ModelsPage_Case_10_Conditional_3_Template, 2, 1, "vc-empty", 31)(4, ModelsPage_Case_10_Conditional_4_Template, 32, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.models.loading() ? 1 : ctx_r1.models.error() ? 2 : !ctx_r1.models.data()?.length ? 3 : 4);
  }
}
function ModelsPage_Case_11_Conditional_0_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-soc-map-tab", 52);
  }
  if (rf & 2) {
    const pid_r5 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("projectId", pid_r5)("models", ctx_r1.models.data() ?? \u0275\u0275pureFunction0(2, _c1));
  }
}
function ModelsPage_Case_11_Conditional_0_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-optimiser-tab", 53);
  }
  if (rf & 2) {
    const pid_r5 = \u0275\u0275nextContext();
    \u0275\u0275property("projectId", pid_r5);
  }
}
function ModelsPage_Case_11_Conditional_0_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-emissions-tab", 53);
  }
  if (rf & 2) {
    const pid_r5 = \u0275\u0275nextContext();
    \u0275\u0275property("projectId", pid_r5);
  }
}
function ModelsPage_Case_11_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ModelsPage_Case_11_Conditional_0_Case_0_Template, 1, 3, "vc-soc-map-tab", 52)(1, ModelsPage_Case_11_Conditional_0_Case_1_Template, 1, 1, "vc-optimiser-tab", 53)(2, ModelsPage_Case_11_Conditional_0_Case_2_Template, 1, 1, "vc-emissions-tab", 53);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.tab()) === "map" ? 0 : tmp_3_0 === "optimiser" ? 1 : tmp_3_0 === "emissions" ? 2 : -1);
  }
}
function ModelsPage_Case_11_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "vc-empty", 54);
    \u0275\u0275elementEnd();
  }
}
function ModelsPage_Case_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ModelsPage_Case_11_Conditional_0_Template, 3, 1)(1, ModelsPage_Case_11_Conditional_1_Template, 2, 0, "div", 6);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r1.ctx.currentId()) ? 0 : 1, tmp_1_0);
  }
}
function ModelsPage_For_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 55)(1, "input", 56);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function ModelsPage_For_25_Template_input_ngModelChange_1_listener($event) {
      const f_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.tFeatures[f_r7.key], $event) || (ctx_r1.tFeatures[f_r7.key] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const f_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.tFeatures[f_r7.key]);
    \u0275\u0275advance();
    \u0275\u0275property("name", "f_" + f_r7.key);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.tFeatures[f_r7.key]);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r7.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r7.hint);
  }
}
function ModelsPage_Conditional_41_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 59);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ne_r8 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ne_r8.excluded.length, " sample", ne_r8.excluded.length > 1 ? "s were" : " was", " left out because a feature was missing, e.g. ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ne_r8.excluded[0].sample_code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u2014 ", ne_r8.excluded[0].missing_features.join(", "), ". Syncing supporting data or satellite passes may help.");
  }
}
function ModelsPage_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 22)(1, "strong");
    \u0275\u0275text(2, "Not enough lab data to train and validate yet.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 57);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 58)(6, "div")(7, "span");
    \u0275\u0275text(8, "Usable results");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "strong", 37);
    \u0275\u0275text(10);
    \u0275\u0275elementStart(11, "small");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div")(14, "span");
    \u0275\u0275text(15, "Farms");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "strong", 37);
    \u0275\u0275text(17);
    \u0275\u0275elementStart(18, "small");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(20, ModelsPage_Conditional_41_Conditional_20_Template, 5, 4, "p", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ne_r8 = ctx;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("Validation holds out whole farms, so the model needs at least ", ne_r8.min_rows, " usable lab results from ", ne_r8.min_farms, " different farms.");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ne_r8.rows, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("of ", ne_r8.min_rows);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ne_r8.farms, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("of ", ne_r8.min_farms);
    \u0275\u0275advance();
    \u0275\u0275conditional(ne_r8.excluded.length ? 20 : -1);
  }
}
function ModelsPage_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 23);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.trainError());
  }
}
var ModelsPage = class _ModelsPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  ctx = inject(ProjectContext);
  tab = signal(
    this.route.snapshot.queryParamMap.get("tab") ?? "models",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  models = new Remote();
  canManage = computed(
    () => this.auth.can("models.manage"),
    ...ngDevMode ? [{ debugName: "canManage" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "models", label: "Models", count: this.models.data()?.length ?? null },
      { key: "map", label: "Soil-carbon map" },
      { key: "optimiser", label: "Sampling optimiser" },
      { key: "emissions", label: "Emissions estimate" }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  features = FEATURES;
  alg = algorithmLabel;
  val = validationLabel;
  trainOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "trainOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  training = signal(
    false,
    ...ngDevMode ? [{ debugName: "training" }] : (
      /* istanbul ignore next */
      []
    )
  );
  trainError = signal(
    null,
    ...ngDevMode ? [{ debugName: "trainError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  notEnough = signal(
    null,
    ...ngDevMode ? [{ debugName: "notEnough" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tName = "soc-topsoil";
  tScope = "project";
  tLambda = 1;
  tFeatures = { ndvi_mean: true, rain_365d: true, elevation_m: true, clay_pct: true };
  chosen = () => FEATURES.filter((f) => this.tFeatures[f.key]).map((f) => f.key);
  constructor() {
    this.load();
    effect(() => {
      const t = this.tab();
      untracked(() => this.router.navigate([], { queryParams: { tab: t === "models" ? null : t }, replaceUrl: true }));
    });
  }
  load() {
    this.models.load(this.api.get("/models"), true);
  }
  openTrain() {
    this.trainError.set(null);
    this.notEnough.set(null);
    this.trainOpen.set(true);
  }
  train() {
    this.training.set(true);
    this.trainError.set(null);
    this.notEnough.set(null);
    this.api.post("/models/soc/train", {
      name: this.tName.trim(),
      features: this.chosen(),
      ridge_lambda: Number(this.tLambda) || 1,
      project_id: this.tScope === "project" ? this.ctx.currentId() : null
    }).subscribe({
      next: (m) => {
        this.training.set(false);
        this.trainOpen.set(false);
        this.toast.success(`${m.name} v${m.version} trained`, `RMSE ${m.metrics.rmse.toFixed(3)} % SOC on held-out farms. It now needs approval.`);
        this.router.navigate(["/app/models", m.id]);
      },
      error: (e) => {
        this.training.set(false);
        if (e.code === "NOT_ENOUGH_DATA")
          this.notEnough.set(e.details);
        else
          this.trainError.set(e.message);
      }
    });
  }
  static \u0275fac = function ModelsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ModelsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ModelsPage, selectors: [["vc-models-page"]], decls: 48, vars: 12, consts: [["title", "Soil-carbon models", "eyebrow", "Intelligence", "subtitle", "Models that estimate soil organic carbon from satellite, weather and soil data. They guide where to sample next \u2014 credits always come from lab results."], ["actions", "", 1, "btn", "btn-primary"], ["tone", "warn", "icon", "info", 1, "mod-note"], [1, "row", "wrap", 2, "--gap", "10px"], ["cls", "MODELLED"], [3, "activeChange", "tabs", "active"], [1, "card"], ["width", "520px", "title", "Train a soil-carbon model", "subtitle", "Ridge regression on accepted lab results, validated on held-out farms", 3, "openChange", "open", "drawer"], ["id", "trainForm", 1, "stack", 2, "--gap", "18px", 3, "ngSubmit"], [1, "field"], ["for", "mn"], ["id", "mn", "name", "mn", "placeholder", "soc-topsoil", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], [1, "feats"], [1, "feat", 3, "on"], [1, "form-grid"], ["for", "sc"], ["id", "sc", "name", "sc", 1, "input", 3, "ngModelChange", "ngModel"], ["value", "project"], ["value", "all"], ["for", "lam"], ["id", "lam", "name", "lam", "type", "number", "min", "0.01", "max", "1000", "step", "0.1", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["tone", "warn", "icon", "alert"], ["title", "Model not trained", 3, "message"], ["footer", ""], ["type", "button", 1, "btn", "btn-ghost", 3, "click"], ["type", "submit", "form", "trainForm", 1, "btn", "btn-primary", 3, "disabled"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "sparkles"], [3, "rows"], [1, "card-body"], ["icon", "layers", "title", "No models trained yet", "text", "Train a model from accepted lab results. It is validated by holding out whole farms, then needs a second person to approve it."], ["title", "Couldn't load models", 3, "message"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "table-wrap"], [1, "table"], [1, "num"], ["title", "Root mean squared error on held-out farms", 1, "num"], ["title", "Share of held-out results inside the 90% interval", 1, "num"], [1, "clickable", 3, "routerLink"], [1, "card-foot", "left"], [1, "small", "muted"], [1, "mn"], [1, "small", "subtle"], [3, "status"], [1, "small"], [1, "hold"], ["name", "shield", 3, "size"], [1, "u"], [1, "nowrap", "small"], [3, "title"], [3, "projectId", "models"], [3, "projectId"], ["icon", "briefcase", "title", "Choose a project", "text", "Maps, sampling plans and estimates are made per project. Pick one in the top bar."], [1, "feat"], ["type", "checkbox", 3, "ngModelChange", "name", "ngModel"], [1, "ne"], [1, "ne-grid"], [1, "ne", "small"]], template: function ModelsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, ModelsPage_Conditional_1_Template, 3, 0, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "vc-callout", 2)(3, "div", 3);
      \u0275\u0275element(4, "vc-dc", 4);
      \u0275\u0275elementStart(5, "span")(6, "strong");
      \u0275\u0275text(7, "Modelled values support decisions; credits come only from lab results.");
      \u0275\u0275elementEnd();
      \u0275\u0275text(8, " Predictions here are never used in a carbon calculation.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(9, "vc-tabs", 5);
      \u0275\u0275twoWayListener("activeChange", function ModelsPage_Template_vc_tabs_activeChange_9_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tab, $event) || (ctx.tab = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(10, ModelsPage_Case_10_Template, 5, 1, "section", 6)(11, ModelsPage_Case_11_Template, 2, 1);
      \u0275\u0275elementStart(12, "vc-modal", 7);
      \u0275\u0275twoWayListener("openChange", function ModelsPage_Template_vc_modal_openChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.trainOpen, $event) || (ctx.trainOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(13, "form", 8);
      \u0275\u0275listener("ngSubmit", function ModelsPage_Template_form_ngSubmit_13_listener() {
        return ctx.train();
      });
      \u0275\u0275elementStart(14, "div", 9)(15, "label", 10);
      \u0275\u0275text(16, "Model name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 11);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ModelsPage_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tName, $event) || (ctx.tName = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "span", 12);
      \u0275\u0275text(19, "Training again with the same name creates a new version.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 9)(21, "label");
      \u0275\u0275text(22, "Features");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 13);
      \u0275\u0275repeaterCreate(24, ModelsPage_For_25_Template, 7, 6, "label", 14, _forTrack05);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 15)(27, "div", 9)(28, "label", 16);
      \u0275\u0275text(29, "Training data");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "select", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ModelsPage_Template_select_ngModelChange_30_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tScope, $event) || (ctx.tScope = $event);
        return $event;
      });
      \u0275\u0275elementStart(31, "option", 18);
      \u0275\u0275text(32, "This project only");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "option", 19);
      \u0275\u0275text(34, "All projects");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(35, "div", 9)(36, "label", 20);
      \u0275\u0275text(37, "Regularisation (\u03BB)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "input", 21);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function ModelsPage_Template_input_ngModelChange_38_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tLambda, $event) || (ctx.tLambda = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "span", 12);
      \u0275\u0275text(40, "Higher is simpler and steadier.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(41, ModelsPage_Conditional_41_Template, 21, 7, "vc-callout", 22)(42, ModelsPage_Conditional_42_Template, 1, 1, "vc-error", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(43, 24);
      \u0275\u0275elementStart(44, "button", 25);
      \u0275\u0275listener("click", function ModelsPage_Template_button_click_44_listener() {
        return ctx.trainOpen.set(false);
      });
      \u0275\u0275text(45, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "button", 26);
      \u0275\u0275text(47);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_13_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.tab() === "models" && ctx.canManage() ? 1 : -1);
      \u0275\u0275advance(8);
      \u0275\u0275property("tabs", ctx.tabs());
      \u0275\u0275twoWayProperty("active", ctx.tab);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_3_0 = ctx.tab()) === "models" ? 10 : 11);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.trainOpen);
      \u0275\u0275property("drawer", true);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.tName);
      \u0275\u0275control();
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.features);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.tScope);
      \u0275\u0275control();
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.tLambda);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275conditional((tmp_13_0 = ctx.notEnough()) ? 41 : ctx.trainError() ? 42 : -1, tmp_13_0);
      \u0275\u0275advance(5);
      \u0275\u0275property("disabled", ctx.training() || !ctx.chosen().length || ctx.tName.trim().length < 2);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.training() ? "Training\u2026" : "Train and validate");
    }
  }, dependencies: [Icon, Badge, DataClass, PageHeader, Empty, Loading, ErrorBox, Callout, Modal, Tabs, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, NgModel, NgForm, RouterLink, SocMapTab, OptimiserTab, EmissionsTab, NumPipe, DayPipe, AgoPipe], styles: ["\n.mod-note[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.mn[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.35;\n}\n.u[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n  margin-left: 3px;\n}\n.hold[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  color: var(--%NS%forest-700);\n}\n.warn[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n  font-weight: 500;\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.feats[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.feat[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.feat[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n  width: 16px;\n  height: 16px;\n  margin-top: 2px;\n}\n.feat[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.feat[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  font-weight: 500;\n}\n.feat[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.feat.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-300);\n  background: var(--%NS%forest-50);\n}\n.ne[_ngcontent-%COMP%] {\n  margin-top: 6px;\n}\n.ne-grid[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 28px;\n  margin-top: 10px;\n}\n.ne-grid[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.ne-grid[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.ne-grid[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.ne-grid[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  font-weight: 500;\n}\n/*# sourceMappingURL=models.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModelsPage, [{
    type: Component,
    args: [{ selector: "vc-models-page", imports: [...KIT, FormsModule, RouterLink, NumPipe, DayPipe, AgoPipe, SocMapTab, OptimiserTab, EmissionsTab], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Soil-carbon models" eyebrow="Intelligence"
      subtitle="Models that estimate soil organic carbon from satellite, weather and soil data. They guide where to sample next \u2014 credits always come from lab results.">
      @if (tab() === 'models' && canManage()) {
        <button actions class="btn btn-primary" (click)="openTrain()"><vc-icon name="sparkles" />Train a model</button>
      }
    </vc-page-header>

    <vc-callout tone="warn" icon="info" class="mod-note">
      <div class="row wrap" style="--gap:10px"><vc-dc cls="MODELLED" />
        <span><strong>Modelled values support decisions; credits come only from lab results.</strong>
        Predictions here are never used in a carbon calculation.</span></div>
    </vc-callout>

    <vc-tabs [tabs]="tabs()" [(active)]="tab" />

    @switch (tab()) {
      @case ('models') {
        <section class="card">
          @if (models.loading()) {
            <vc-loading [rows]="5" />
          } @else if (models.error()) {
            <div class="card-body"><vc-error title="Couldn't load models" [message]="models.error()!.message" /></div>
          } @else if (!models.data()?.length) {
            <vc-empty icon="layers" title="No models trained yet"
              text="Train a model from accepted lab results. It is validated by holding out whole farms, then needs a second person to approve it.">
              @if (canManage()) { <button class="btn btn-primary" (click)="openTrain()"><vc-icon name="sparkles" />Train a model</button> }
            </vc-empty>
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr>
                  <th>Model</th><th>Status</th><th>Algorithm</th><th>Validation</th><th class="num">Rows</th>
                  <th class="num" title="Root mean squared error on held-out farms">RMSE</th><th class="num">MAE</th><th class="num">Bias</th>
                  <th class="num">R\xB2</th><th class="num" title="Share of held-out results inside the 90% interval">90% interval</th><th>Trained</th>
                </tr></thead>
                <tbody>
                  @for (m of models.data(); track m.id) {
                    <tr class="clickable" [routerLink]="[m.id]">
                      <td><div class="mn"><strong>{{ m.name }}</strong><span class="small subtle">Version {{ m.version }} \xB7 {{ m.features.length }} features</span></div></td>
                      <td><vc-badge [status]="m.status" /></td>
                      <td class="small">{{ alg(m.algorithm) }}</td>
                      <td class="small"><span class="hold"><vc-icon name="shield" [size]="13" />{{ val(m.validation, m.metrics.k) }}</span></td>
                      <td class="num">{{ m.training_rows ?? '\u2014' }}</td>
                      <td class="num">{{ m.metrics.rmse | num: 3 }}<span class="u">% SOC</span></td>
                      <td class="num">{{ m.metrics.mae | num: 3 }}</td>
                      <td class="num">{{ m.metrics.bias > 0 ? '+' : '' }}{{ m.metrics.bias | num: 3 }}</td>
                      <td class="num">{{ m.metrics.r2 | num: 2 }}</td>
                      <td class="num"><span [class.warn]="m.metrics.coverage_90 < 0.8">{{ (m.metrics.coverage_90 * 100).toFixed(0) }}%</span></td>
                      <td class="nowrap small"><span [title]="m.created_at | day: true">{{ m.created_at | ago }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="card-foot left"><span class="small muted">All metrics are measured on farms the model never saw during training. Lower RMSE and MAE are better; bias near zero; interval coverage near 90%.</span></div>
          }
        </section>
      }
      @default {
        @if (ctx.currentId(); as pid) {
          @switch (tab()) {
            @case ('map') { <vc-soc-map-tab [projectId]="pid" [models]="models.data() ?? []" /> }
            @case ('optimiser') { <vc-optimiser-tab [projectId]="pid" /> }
            @case ('emissions') { <vc-emissions-tab [projectId]="pid" /> }
          }
        } @else {
          <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Maps, sampling plans and estimates are made per project. Pick one in the top bar." /></div>
        }
      }
    }

    <vc-modal [(open)]="trainOpen" [drawer]="true" width="520px" title="Train a soil-carbon model"
      subtitle="Ridge regression on accepted lab results, validated on held-out farms">
      <form class="stack" style="--gap:18px" id="trainForm" (ngSubmit)="train()">
        <div class="field">
          <label for="mn">Model name</label>
          <input id="mn" class="input" name="mn" [(ngModel)]="tName" placeholder="soc-topsoil" />
          <span class="hint">Training again with the same name creates a new version.</span>
        </div>
        <div class="field">
          <label>Features</label>
          <div class="feats">
            @for (f of features; track f.key) {
              <label class="feat" [class.on]="tFeatures[f.key]">
                <input type="checkbox" [name]="'f_' + f.key" [(ngModel)]="tFeatures[f.key]" />
                <span><strong>{{ f.label }}</strong><small>{{ f.hint }}</small></span>
              </label>
            }
          </div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="sc">Training data</label>
            <select id="sc" class="input" name="sc" [(ngModel)]="tScope">
              <option value="project">This project only</option>
              <option value="all">All projects</option>
            </select>
          </div>
          <div class="field">
            <label for="lam">Regularisation (\u03BB)</label>
            <input id="lam" class="input num" name="lam" type="number" min="0.01" max="1000" step="0.1" [(ngModel)]="tLambda" />
            <span class="hint">Higher is simpler and steadier.</span>
          </div>
        </div>
        @if (notEnough(); as ne) {
          <vc-callout tone="warn" icon="alert">
            <strong>Not enough lab data to train and validate yet.</strong>
            <p class="ne">Validation holds out whole farms, so the model needs at least {{ ne.min_rows }} usable lab results from {{ ne.min_farms }} different farms.</p>
            <div class="ne-grid">
              <div><span>Usable results</span><strong class="num">{{ ne.rows }} <small>of {{ ne.min_rows }}</small></strong></div>
              <div><span>Farms</span><strong class="num">{{ ne.farms }} <small>of {{ ne.min_farms }}</small></strong></div>
            </div>
            @if (ne.excluded.length) {
              <p class="ne small">{{ ne.excluded.length }} sample{{ ne.excluded.length > 1 ? 's were' : ' was' }} left out because a feature was missing, e.g.
                <code>{{ ne.excluded[0].sample_code }}</code> \u2014 {{ ne.excluded[0].missing_features.join(', ') }}. Syncing supporting data or satellite passes may help.</p>
            }
          </vc-callout>
        } @else if (trainError()) {
          <vc-error title="Model not trained" [message]="trainError()!" />
        }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="trainOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="trainForm" [disabled]="training() || !chosen().length || tName.trim().length < 2">
          {{ training() ? 'Training\u2026' : 'Train and validate' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;69069306bbc0587d;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\models\\models.page.ts */\n.mod-note {\n  margin-bottom: 20px;\n}\n.mn {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.35;\n}\n.u {\n  font-size: 11px;\n  color: var(--text-3);\n  margin-left: 3px;\n}\n.hold {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  color: var(--forest-700);\n}\n.warn {\n  color: var(--amber-600);\n  font-weight: 500;\n}\n.card-foot.left {\n  justify-content: flex-start;\n}\n.feats {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.feat {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.feat input {\n  accent-color: var(--primary);\n  width: 16px;\n  height: 16px;\n  margin-top: 2px;\n}\n.feat span {\n  display: flex;\n  flex-direction: column;\n}\n.feat strong {\n  font-size: 13.5px;\n  font-weight: 500;\n}\n.feat small {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.feat.on {\n  border-color: var(--forest-300);\n  background: var(--forest-50);\n}\n.ne {\n  margin-top: 6px;\n}\n.ne-grid {\n  display: flex;\n  gap: 28px;\n  margin-top: 10px;\n}\n.ne-grid div {\n  display: flex;\n  flex-direction: column;\n}\n.ne-grid span {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.ne-grid strong {\n  font-size: 20px;\n}\n.ne-grid small {\n  font-size: 12px;\n  color: var(--text-3);\n  font-weight: 500;\n}\n/*# sourceMappingURL=models.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ModelsPage, { className: "ModelsPage", filePath: "src/app/features/models/models.page.ts", lineNumber: 169 });
})();

// src/app/features/models/models.routes.ts
var models_routes_default = [
  { path: "", component: ModelsPage, title: "Soil-carbon models \xB7 Varsapradaya Carbon" },
  { path: ":id", component: ModelDetailPage, title: "Model \xB7 Varsapradaya Carbon" }
];
export {
  models_routes_default as default
};
//# debugId=ed81a4e6-4ba6-594b-83c1-2279168bbabf
//# sourceMappingURL=chunk-DY7HK764.js.map
