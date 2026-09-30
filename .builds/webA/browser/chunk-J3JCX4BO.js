import {
  QualityBar,
  TierChip
} from "./chunk-SFBT26DL.js";
import {
  Remote,
  TIER_ORDER,
  daysAgo,
  esc,
  fieldsFC,
  isSimulated,
  isoDate,
  pointsFC,
  tierMeta
} from "./chunk-ZC6I5JPU.js";
import {
  MapView
} from "./chunk-BRFBPBND.js";
import {
  Chart
} from "./chunk-RHCCRMNI.js";
import "./chunk-VJW22TG4.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RadioControlValueAccessor,
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
  Router
} from "./chunk-G6POHVBO.js";
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
  Tabs
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  forkJoin,
  forwardRef,
  inject,
  input,
  map,
  model,
  output,
  setClassMetadata,
  signal,
  untracked,
  viewChild,
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
  ɵɵqueryAdvance,
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuerySignal
} from "./chunk-O2E4BMDK.js";

// src/app/features/supporting/coverage.tab.ts
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.field_id;
function CoverageTab_Conditional_0_Template(rf, ctx) {
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
function CoverageTab_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.cov.error().message);
  }
}
function CoverageTab_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "vc-empty", 3);
    \u0275\u0275elementEnd();
  }
}
function CoverageTab_Conditional_2_Conditional_1_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275element(1, "vc-tier", 20)(2, "span", 21);
    \u0275\u0275elementStart(3, "strong", 11);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 22);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r2 = ctx.$implicit;
    const c_r3 = \u0275\u0275nextContext(2);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("tier", t_r2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r3.by_best_tier[t_r2] ?? 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.share(c_r3.by_best_tier[t_r2] ?? 0, c_r3.fields));
  }
}
function CoverageTab_Conditional_2_Conditional_1_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 15);
  }
}
function CoverageTab_Conditional_2_Conditional_1_Conditional_29_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 24)(4, "div", 25)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 26);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 14);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "vc-quality", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const h_r4 = ctx.$implicit;
    const \u0275$index_79_r5 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_79_r5 + 1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(h_r4.field_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(9, 5, h_r4.area_ha, 2), " ha");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(h_r4.reason);
    \u0275\u0275advance();
    \u0275\u0275property("value", h_r4.avg_quality);
  }
}
function CoverageTab_Conditional_2_Conditional_1_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ol", 16);
    \u0275\u0275repeaterCreate(1, CoverageTab_Conditional_2_Conditional_1_Conditional_29_For_2_Template, 13, 8, "li", null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(c_r3.device_would_help_most);
  }
}
function CoverageTab_Conditional_2_Conditional_1_For_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r6.label);
  }
}
function CoverageTab_Conditional_2_Conditional_1_For_53_For_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275element(1, "vc-tier", 32);
    \u0275\u0275elementStart(2, "span", 33);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fp_r9 = ctx;
    \u0275\u0275advance();
    \u0275\u0275property("tier", fp_r9.tier)("compact", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fp_r9.provider || "\u2014");
  }
}
function CoverageTab_Conditional_2_Conditional_1_For_53_For_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function CoverageTab_Conditional_2_Conditional_1_For_53_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td");
    \u0275\u0275conditionalCreate(1, CoverageTab_Conditional_2_Conditional_1_For_53_For_10_Conditional_1_Template, 4, 3, "span", 30)(2, CoverageTab_Conditional_2_Conditional_1_For_53_For_10_Conditional_2_Template, 2, 0, "span", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_23_0;
    const p_r10 = ctx.$implicit;
    const f_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_23_0 = f_r8.parameters[p_r10.key]) ? 1 : 2, tmp_23_0);
  }
}
function CoverageTab_Conditional_2_Conditional_1_For_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 28);
    \u0275\u0275listener("click", function CoverageTab_Conditional_2_Conditional_1_For_53_Template_tr_click_0_listener() {
      const f_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openField.emit(f_r8.field_id));
    });
    \u0275\u0275elementStart(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 11);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275element(8, "vc-tier", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(9, CoverageTab_Conditional_2_Conditional_1_For_53_For_10_Template, 3, 1, "td", null, _forTrack0);
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275element(12, "vc-quality", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 11);
    \u0275\u0275element(14, "vc-icon", 29);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r8.field_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(6, 4, f_r8.area_ha, 2), " ha");
    \u0275\u0275advance(3);
    \u0275\u0275property("tier", f_r8.best_tier);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.params);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", f_r8.avg_quality);
  }
}
function CoverageTab_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "section", 0)(2, "div", 5)(3, "h3");
    \u0275\u0275text(4, "Fields by best data source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 6);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 7)(9, "div", 8);
    \u0275\u0275element(10, "vc-chart", 9);
    \u0275\u0275elementStart(11, "div", 10)(12, "strong", 11);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "fields");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "ul", 12);
    \u0275\u0275repeaterCreate(17, CoverageTab_Conditional_2_Conditional_1_For_18_Template, 7, 3, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 13)(20, "span", 14);
    \u0275\u0275text(21, '"Best" is the highest tier reached by rainfall, air temperature or soil moisture on that day.');
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "section", 0)(23, "div", 5)(24, "h3");
    \u0275\u0275text(25, "Where a device would help most");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 6);
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(28, CoverageTab_Conditional_2_Conditional_1_Conditional_28_Template, 1, 0, "vc-empty", 15)(29, CoverageTab_Conditional_2_Conditional_1_Conditional_29_Template, 3, 0, "ol", 16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "section", 0)(31, "div", 5)(32, "h3");
    \u0275\u0275text(33, "Field by field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 6);
    \u0275\u0275text(35, "Source chosen for each key parameter");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 17)(37, "table", 18)(38, "thead")(39, "tr")(40, "th");
    \u0275\u0275text(41, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "th", 11);
    \u0275\u0275text(43, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "th");
    \u0275\u0275text(45, "Best source");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(46, CoverageTab_Conditional_2_Conditional_1_For_47_Template, 2, 1, "th", null, _forTrack0);
    \u0275\u0275elementStart(48, "th");
    \u0275\u0275text(49, "Average quality");
    \u0275\u0275elementEnd();
    \u0275\u0275element(50, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "tbody");
    \u0275\u0275repeaterCreate(52, CoverageTab_Conditional_2_Conditional_1_For_53_Template, 15, 7, "tr", 19, _forTrack1);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const c_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("as of ", \u0275\u0275pipeBind1(7, 5, c_r3.as_of));
    \u0275\u0275advance(4);
    \u0275\u0275property("option", ctx_r0.donut());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r3.fields);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.tiers);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("", c_r3.device_would_help_most.length, " fields");
    \u0275\u0275advance();
    \u0275\u0275conditional(!c_r3.device_would_help_most.length ? 28 : 29);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r0.params);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r0.rows());
  }
}
function CoverageTab_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CoverageTab_Conditional_2_Conditional_0_Template, 2, 0, "div", 0)(1, CoverageTab_Conditional_2_Conditional_1_Template, 54, 7);
  }
  if (rf & 2) {
    \u0275\u0275conditional(!ctx.fields ? 0 : 1);
  }
}
var PARAM_COLS = [
  { key: "rain_mm", label: "Rainfall" },
  { key: "air_temp_c", label: "Air temp." },
  { key: "soil_moisture_20cm_pct", label: "Soil moisture" }
];
var CoverageTab = class _CoverageTab {
  api = inject(ApiService);
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  openField = output();
  cov = new Remote();
  tiers = TIER_ORDER;
  params = PARAM_COLS;
  rows = computed(
    () => [...this.cov.data()?.field_details ?? []].sort((a, b) => (a.best_tier || 9) - (b.best_tier || 9) || a.field_code.localeCompare(b.field_code)),
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  donut = computed(
    () => {
      const c = this.cov.data();
      const data = TIER_ORDER.map((t) => ({
        name: tierMeta(t).label,
        value: c?.by_best_tier[t] ?? 0,
        itemStyle: { color: tierMeta(t).color }
      })).filter((d) => d.value > 0);
      return {
        tooltip: { trigger: "item", formatter: "{b}: {c} fields ({d}%)" },
        xAxis: { show: false },
        yAxis: { show: false },
        grid: { show: false },
        legend: { show: false },
        series: [{
          type: "pie",
          radius: ["62%", "88%"],
          avoidLabelOverlap: false,
          label: { show: false },
          labelLine: { show: false },
          itemStyle: { borderColor: "#fff", borderWidth: 2 },
          data
        }]
      };
    },
    ...ngDevMode ? [{ debugName: "donut" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const pid = this.projectId();
      untracked(() => this.reload(pid));
    });
  }
  reload(pid = this.projectId()) {
    this.cov.load(this.api.get(`/projects/${pid}/supporting/coverage`));
  }
  share(n, total) {
    return total ? `${Math.round(n / total * 100)}%` : "\u2014";
  }
  static \u0275fac = function CoverageTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CoverageTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CoverageTab, selectors: [["vc-coverage-tab"]], inputs: { projectId: [1, "projectId"] }, outputs: { openField: "openField" }, decls: 3, vars: 1, consts: [[1, "card"], ["title", "Couldn't load coverage", 3, "message"], [3, "rows"], ["icon", "map", "title", "No enrolled fields yet", "text", "Coverage appears once fields are enrolled in this project. Each field is checked for the best available data source."], [1, "grid", "top"], [1, "card-head"], [1, "subtle", "small"], [1, "card-body", "donut-wrap"], [1, "donut"], ["height", "200px", 3, "option"], [1, "centre"], [1, "num"], [1, "legend"], [1, "card-foot", "left"], [1, "small", "muted"], ["icon", "check-circle", "title", "Every field has device-grade data", "text", "No field relies only on external regional sources. Good coverage."], [1, "help"], [1, "table-wrap"], [1, "table"], [1, "clickable"], [3, "tier"], [1, "spacer"], [1, "share", "num"], [1, "rank", "num"], [1, "h-main"], [1, "row", 2, "--gap", "8px"], [1, "subtle", "small", "num"], [3, "value"], [1, "clickable", 3, "click"], ["name", "chevron-right", 1, "subtle"], [1, "pcell"], [1, "subtle"], [3, "tier", "compact"], [1, "subtle", "small", "truncate"]], template: function CoverageTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, CoverageTab_Conditional_0_Template, 2, 1, "div", 0)(1, CoverageTab_Conditional_1_Template, 1, 1, "vc-error", 1)(2, CoverageTab_Conditional_2_Template, 2, 1);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional(ctx.cov.loading() ? 0 : ctx.cov.error() ? 1 : (tmp_0_0 = ctx.cov.data()) ? 2 : -1, tmp_0_0);
    }
  }, dependencies: [Icon, Empty, Loading, ErrorBox, Chart, TierChip, QualityBar, DayPipe, NumPipe], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.top[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);\n}\n@media (max-width: 1100px) {\n  .top[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.donut-wrap[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  gap: 24px;\n  align-items: center;\n}\n@media (max-width: 720px) {\n  .donut-wrap[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.donut[_ngcontent-%COMP%] {\n  position: relative;\n}\n.centre[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.centre[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.centre[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.legend[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.legend[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding-bottom: 10px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.legend[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n  padding-bottom: 0;\n}\n.share[_ngcontent-%COMP%] {\n  width: 44px;\n  text-align: right;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.help[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 6px 0;\n  max-height: 318px;\n  overflow: auto;\n}\n.help[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.help[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.rank[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  border-radius: 6px;\n  background: var(--%NS%amber-100);\n  color: var(--%NS%amber-600);\n  font-size: 12px;\n  font-weight: 600;\n}\n.h-main[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.h-main[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 2px;\n}\n.pcell[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  max-width: 170px;\n}\n/*# sourceMappingURL=coverage.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CoverageTab, [{
    type: Component,
    args: [{ selector: "vc-coverage-tab", imports: [...KIT, Chart, TierChip, QualityBar, DayPipe, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (cov.loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (cov.error()) {
      <vc-error title="Couldn't load coverage" [message]="cov.error()!.message" />
    } @else if (cov.data(); as c) {
      @if (!c.fields) {
        <div class="card"><vc-empty icon="map" title="No enrolled fields yet"
          text="Coverage appears once fields are enrolled in this project. Each field is checked for the best available data source." /></div>
      } @else {
        <div class="grid top">
          <section class="card">
            <div class="card-head"><h3>Fields by best data source</h3><span class="subtle small">as of {{ c.as_of | day }}</span></div>
            <div class="card-body donut-wrap">
              <div class="donut">
                <vc-chart [option]="donut()" height="200px" />
                <div class="centre"><strong class="num">{{ c.fields }}</strong><span>fields</span></div>
              </div>
              <ul class="legend">
                @for (t of tiers; track t) {
                  <li>
                    <vc-tier [tier]="t" />
                    <span class="spacer"></span>
                    <strong class="num">{{ c.by_best_tier[t] ?? 0 }}</strong>
                    <span class="share num">{{ share(c.by_best_tier[t] ?? 0, c.fields) }}</span>
                  </li>
                }
              </ul>
            </div>
            <div class="card-foot left">
              <span class="small muted">"Best" is the highest tier reached by rainfall, air temperature or soil moisture on that day.</span>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <h3>Where a device would help most</h3>
              <span class="subtle small">{{ c.device_would_help_most.length }} fields</span>
            </div>
            @if (!c.device_would_help_most.length) {
              <vc-empty icon="check-circle" title="Every field has device-grade data"
                text="No field relies only on external regional sources. Good coverage." />
            } @else {
              <ol class="help">
                @for (h of c.device_would_help_most; track h.field_id; let i = $index) {
                  <li>
                    <span class="rank num">{{ i + 1 }}</span>
                    <div class="h-main">
                      <div class="row" style="--gap:8px"><strong>{{ h.field_code }}</strong><span class="subtle small num">{{ h.area_ha | num: 2 }} ha</span></div>
                      <p class="small muted">{{ h.reason }}</p>
                    </div>
                    <vc-quality [value]="h.avg_quality" />
                  </li>
                }
              </ol>
            }
          </section>
        </div>

        <section class="card">
          <div class="card-head"><h3>Field by field</h3><span class="subtle small">Source chosen for each key parameter</span></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Field</th><th class="num">Area</th><th>Best source</th>
                @for (p of params; track p.key) { <th>{{ p.label }}</th> }
                <th>Average quality</th><th></th>
              </tr></thead>
              <tbody>
                @for (f of rows(); track f.field_id) {
                  <tr class="clickable" (click)="openField.emit(f.field_id)">
                    <td><strong>{{ f.field_code }}</strong></td>
                    <td class="num">{{ f.area_ha | num: 2 }} ha</td>
                    <td><vc-tier [tier]="f.best_tier" /></td>
                    @for (p of params; track p.key) {
                      <td>
                        @if (f.parameters[p.key]; as fp) {
                          <span class="pcell"><vc-tier [tier]="fp.tier" [compact]="true" /><span class="subtle small truncate">{{ fp.provider || '\u2014' }}</span></span>
                        } @else { <span class="subtle">\u2014</span> }
                      </td>
                    }
                    <td><vc-quality [value]="f.avg_quality" /></td>
                    <td class="num"><vc-icon name="chevron-right" class="subtle" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }
    }
  `, styles: ["/* angular:styles/component:scss;52292a212dc54b54;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\supporting\\coverage.tab.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.top {\n  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);\n}\n@media (max-width: 1100px) {\n  .top {\n    grid-template-columns: 1fr;\n  }\n}\n.donut-wrap {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  gap: 24px;\n  align-items: center;\n}\n@media (max-width: 720px) {\n  .donut-wrap {\n    grid-template-columns: 1fr;\n  }\n}\n.donut {\n  position: relative;\n}\n.centre {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.centre strong {\n  font-size: 28px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.centre span {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.legend {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.legend li {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding-bottom: 10px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.legend li:last-child {\n  border-bottom: 0;\n  padding-bottom: 0;\n}\n.share {\n  width: 44px;\n  text-align: right;\n  font-size: 12px;\n  color: var(--text-3);\n}\n.card-foot.left {\n  justify-content: flex-start;\n}\n.help {\n  list-style: none;\n  margin: 0;\n  padding: 6px 0;\n  max-height: 318px;\n  overflow: auto;\n}\n.help li {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px 20px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.help li:last-child {\n  border-bottom: 0;\n}\n.rank {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  border-radius: 6px;\n  background: var(--amber-100);\n  color: var(--amber-600);\n  font-size: 12px;\n  font-weight: 600;\n}\n.h-main {\n  flex: 1;\n  min-width: 0;\n}\n.h-main p {\n  margin-top: 2px;\n}\n.pcell {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  max-width: 170px;\n}\n/*# sourceMappingURL=coverage.tab.css.map */\n"] }]
  }], () => [], { projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }], openField: [{ type: Output, args: ["openField"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CoverageTab, { className: "CoverageTab", filePath: "src/app/features/supporting/coverage.tab.ts", lineNumber: 143 });
})();

// src/app/features/supporting/devices.tab.ts
var _forTrack02 = ($index, $item) => $item.key;
var _forTrack12 = ($index, $item) => $item.id;
function DevicesTab_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 45);
    \u0275\u0275listener("click", function DevicesTab_For_3_Template_button_click_0_listener() {
      const s_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.status.set(s_r2.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 46);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r2.status() === s_r2.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", s_r2.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.count(s_r2.key));
  }
}
function DevicesTab_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function DevicesTab_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 48);
    \u0275\u0275text(2, "Register device");
    \u0275\u0275elementEnd();
  }
}
function DevicesTab_For_7_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 52);
    \u0275\u0275listener("click", function DevicesTab_For_7_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const h_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.markOffline(h_r6.id));
    });
    \u0275\u0275text(1, "Mark offline");
    \u0275\u0275elementEnd();
  }
}
function DevicesTab_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 5)(1, "div", 49)(2, "span")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 50);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "span", 3);
    \u0275\u0275conditionalCreate(9, DevicesTab_For_7_Conditional_9_Template, 2, 0, "button", 51);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const h_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(h_r6.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(h_r6.external_id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u2014 ", h_r6.suggestion);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.canWrite() ? 9 : -1);
  }
}
function DevicesTab_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 8);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function DevicesTab_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "vc-error", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r2.list.error().message);
  }
}
function DevicesTab_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function DevicesTab_Conditional_12_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 48);
    \u0275\u0275text(2, "Register device");
    \u0275\u0275elementEnd();
  }
}
function DevicesTab_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 10);
    \u0275\u0275conditionalCreate(1, DevicesTab_Conditional_12_Conditional_1_Template, 3, 0, "button", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r2.status() ? "No devices with this status" : "No devices registered yet");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canWrite() && !ctx_r2.status() ? 1 : -1);
  }
}
function DevicesTab_Conditional_13_For_19_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275pipe(1, "day");
  }
  if (rf & 2) {
    const d_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(1, 1, d_r9.calibrated_on), " ");
  }
}
function DevicesTab_Conditional_13_For_19_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 64);
    \u0275\u0275text(1, "Not recorded");
    \u0275\u0275elementEnd();
  }
}
function DevicesTab_Conditional_13_For_19_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 67);
    \u0275\u0275listener("click", function DevicesTab_Conditional_13_For_19_Conditional_28_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const d_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      ctx_r2.openEdit(d_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(1, "vc-icon", 68);
    \u0275\u0275text(2, "Edit");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function DevicesTab_Conditional_13_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 56);
    \u0275\u0275listener("click", function DevicesTab_Conditional_13_For_19_Template_tr_click_0_listener() {
      const d_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selected.set(d_r9.id));
    });
    \u0275\u0275elementStart(1, "td")(2, "div", 57)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 50);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "td")(8, "span", 58);
    \u0275\u0275element(9, "vc-icon", 59);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td")(12, "div", 57)(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 60);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275element(18, "vc-badge", 61);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 62)(20, "span", 63);
    \u0275\u0275pipe(21, "day");
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "td", 62);
    \u0275\u0275conditionalCreate(25, DevicesTab_Conditional_13_For_19_Conditional_25_Template, 2, 3)(26, DevicesTab_Conditional_13_For_19_Conditional_26_Template, 2, 0, "span", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "td", 65);
    \u0275\u0275conditionalCreate(28, DevicesTab_Conditional_13_For_19_Conditional_28_Template, 3, 1, "button", 66);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r9 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("sel", ctx_r2.selected() === d_r9.id);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(d_r9.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r9.external_id);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("mc", d_r9.kind === "microclime");
    \u0275\u0275advance();
    \u0275\u0275property("name", d_r9.kind === "soilsync" ? "droplets" : "rain")("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.kindLabel(d_r9.kind));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.farmName(d_r9.farm_id));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.fieldCode(d_r9.field_id));
    \u0275\u0275advance(2);
    \u0275\u0275property("status", d_r9.status);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("stale", ctx_r2.isStale(d_r9.id));
    \u0275\u0275property("title", \u0275\u0275pipeBind2(21, 18, d_r9.last_seen_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r9.last_seen_at ? \u0275\u0275pipeBind1(23, 21, d_r9.last_seen_at) : "Never");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(d_r9.calibrated_on ? 25 : 26);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.canWrite() && d_r9.status !== "retired" ? 28 : -1);
  }
}
function DevicesTab_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "table", 54)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Device");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Kind");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Farm / field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Last seen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Calibrated");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, DevicesTab_Conditional_13_For_19_Template, 29, 23, "tr", 55, _forTrack12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r2.rows());
  }
}
function DevicesTab_Conditional_26_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.err("external_id"));
  }
}
function DevicesTab_Conditional_26_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "Printed on the device label");
    \u0275\u0275elementEnd();
  }
}
function DevicesTab_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "label");
    \u0275\u0275text(2, "Kind");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 69)(4, "label", 70)(5, "input", 71);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Conditional_26_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.kind, $event) || (ctx_r2.form.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "vc-icon", 72);
    \u0275\u0275elementStart(7, "span")(8, "strong");
    \u0275\u0275text(9, "SoilSync");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "small");
    \u0275\u0275text(11, "Soil moisture, temperature, EC, pH");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "label", 70)(13, "input", 73);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Conditional_26_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.kind, $event) || (ctx_r2.form.kind = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "vc-icon", 74);
    \u0275\u0275elementStart(15, "span")(16, "strong");
    \u0275\u0275text(17, "MicroClime");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "small");
    \u0275\u0275text(19, "Rainfall, air temperature, humidity, wind");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(20, "div", 20)(21, "label", 75);
    \u0275\u0275text(22, "Device ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "input", 76);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Conditional_26_Template_input_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.external_id, $event) || (ctx_r2.form.external_id = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(24, DevicesTab_Conditional_26_Conditional_24_Template, 2, 1, "span", 23)(25, DevicesTab_Conditional_26_Conditional_25_Template, 2, 0, "span", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275classProp("on", ctx_r2.form.kind === "soilsync");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.kind);
    \u0275\u0275control();
    \u0275\u0275advance(7);
    \u0275\u0275classProp("on", ctx_r2.form.kind === "microclime");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.kind);
    \u0275\u0275control();
    \u0275\u0275advance(10);
    \u0275\u0275classProp("invalid", ctx_r2.err("external_id"));
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.external_id);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.err("external_id") ? 24 : 25);
  }
}
function DevicesTab_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.err("name"));
  }
}
function DevicesTab_For_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r12 = ctx.$implicit;
    \u0275\u0275property("value", f_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r12.code, " \xB7 ", f_r12.name);
  }
}
function DevicesTab_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.err("latitude"));
  }
}
function DevicesTab_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.err("longitude"));
  }
}
function DevicesTab_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 40);
    \u0275\u0275text(1, "Retired (permanent)");
    \u0275\u0275elementEnd();
  }
}
function DevicesTab_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "vc-callout", 77);
    \u0275\u0275text(2, "A retired device can't be changed or brought back. Its past readings are kept.");
    \u0275\u0275elementEnd()();
  }
}
function DevicesTab_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275element(1, "vc-error", 78);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r2.formError());
  }
}
var KIND_LABEL = { soilsync: "SoilSync", microclime: "MicroClime" };
var DevicesTab = class _DevicesTab {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  fields = input(
    [],
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  list = new Remote();
  status = signal(
    "",
    ...ngDevMode ? [{ debugName: "status" }] : (
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
  formOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "formOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editing = signal(
    null,
    ...ngDevMode ? [{ debugName: "editing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saving = signal(
    false,
    ...ngDevMode ? [{ debugName: "saving" }] : (
      /* istanbul ignore next */
      []
    )
  );
  formError = signal(
    null,
    ...ngDevMode ? [{ debugName: "formError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldErrors = signal(
    {},
    ...ngDevMode ? [{ debugName: "fieldErrors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  form = this.blank();
  today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  statusOpts = [
    { key: "", label: "All" },
    { key: "online", label: "Online" },
    { key: "offline", label: "Offline" },
    { key: "retired", label: "Retired" }
  ];
  canWrite = computed(
    () => this.auth.can("data.sync"),
    ...ngDevMode ? [{ debugName: "canWrite" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldMap = computed(
    () => new Map(this.fields().map((f) => [f.id, f])),
    ...ngDevMode ? [{ debugName: "fieldMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  farmMap = computed(
    () => new Map((this.list.data()?.farms ?? []).map((f) => [f.id, f])),
    ...ngDevMode ? [{ debugName: "farmMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  healthMap = computed(
    () => new Map((this.list.data()?.health ?? []).map((h) => [h.id, h])),
    ...ngDevMode ? [{ debugName: "healthMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  all = computed(
    () => this.list.data()?.devices ?? [],
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => this.all().filter((d) => !this.status() || d.status === this.status()),
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  attention = computed(
    () => (this.list.data()?.health ?? []).filter((h) => h.suggest_offline).slice(0, 3),
    ...ngDevMode ? [{ debugName: "attention" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldPolys = computed(
    () => fieldsFC(this.fields(), (f) => ({ color: "#9aa29c", label: `<strong>${esc(f.code)}</strong><br>${esc(f.name)}` })),
    ...ngDevMode ? [{ debugName: "fieldPolys" }] : (
      /* istanbul ignore next */
      []
    )
  );
  devicePts = computed(
    () => pointsFC(this.all().filter((d) => d.status !== "retired").map((d) => ({
      id: d.id,
      lat: d.latitude,
      lon: d.longitude,
      color: d.status === "online" ? "#2f7249" : "#b3261e",
      label: `<strong>${esc(d.name)}</strong><br><span style="font-family:var(--mono);font-size:11px">${esc(d.external_id)}</span><br>${KIND_LABEL[d.kind]} \xB7 ${esc(d.status)}`
    }))),
    ...ngDevMode ? [{ debugName: "devicePts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.load();
  }
  load() {
    this.list.load(forkJoin({
      devices: this.api.get("/devices"),
      health: this.api.get("/devices/health"),
      farms: this.api.get("/farms")
    }), true);
  }
  count(s) {
    return this.all().filter((d) => !s || d.status === s).length;
  }
  kindLabel(k) {
    return KIND_LABEL[k] ?? k;
  }
  farmName(id) {
    return id ? this.farmMap().get(id)?.name ?? "Farm" : "\u2014";
  }
  fieldCode(id) {
    return id ? this.fieldMap().get(id)?.code ?? "Field outside this project" : "No field linked";
  }
  isStale(id) {
    return !!this.healthMap().get(id)?.stale;
  }
  pick(e) {
    if (e.layer === "point")
      this.selected.set(e.id);
  }
  err(k) {
    return this.fieldErrors()[k];
  }
  blank() {
    return { kind: "soilsync", external_id: "", name: "", field_id: "", latitude: "", longitude: "", calibrated_on: "", status: "online" };
  }
  openCreate() {
    this.editing.set(null);
    this.form = this.blank();
    this.formError.set(null);
    this.fieldErrors.set({});
    this.formOpen.set(true);
  }
  openEdit(d) {
    this.editing.set(d);
    this.form = {
      kind: d.kind,
      external_id: d.external_id,
      name: d.name,
      field_id: d.field_id ?? "",
      latitude: String(d.latitude),
      longitude: String(d.longitude),
      calibrated_on: d.calibrated_on ?? "",
      status: d.status
    };
    this.formError.set(null);
    this.fieldErrors.set({});
    this.formOpen.set(true);
  }
  save() {
    const f = this.form;
    const errs = {};
    if (!this.editing() && f.external_id.trim().length < 2)
      errs["external_id"] = "Enter the device ID (at least 2 characters).";
    if (f.name.trim().length < 2)
      errs["name"] = "Give the device a name (at least 2 characters).";
    const lat = f.latitude === "" ? null : Number(f.latitude);
    const lon = f.longitude === "" ? null : Number(f.longitude);
    if (lat !== null && (Number.isNaN(lat) || lat < -90 || lat > 90))
      errs["latitude"] = "Latitude must be between \u221290 and 90.";
    if (lon !== null && (Number.isNaN(lon) || lon < -180 || lon > 180))
      errs["longitude"] = "Longitude must be between \u2212180 and 180.";
    if (!this.editing() && !f.field_id && (lat === null || lon === null))
      errs["latitude"] = "Give a location, or link the device to a field.";
    this.fieldErrors.set(errs);
    if (Object.keys(errs).length)
      return;
    const body = {
      name: f.name.trim(),
      field_id: f.field_id || null,
      calibrated_on: f.calibrated_on || null,
      status: f.status
    };
    if (lat !== null && lon !== null) {
      body["latitude"] = lat;
      body["longitude"] = lon;
    }
    const ed = this.editing();
    if (!ed) {
      body["kind"] = f.kind;
      body["external_id"] = f.external_id.trim();
    } else if (ed.field_id === (f.field_id || null))
      delete body["field_id"];
    this.saving.set(true);
    this.formError.set(null);
    const req = ed ? this.api.patch(`/devices/${ed.id}`, body) : this.api.post("/devices", body);
    req.subscribe({
      next: (d) => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.toast.success(ed ? "Device updated" : "Device registered", `${d.name} \xB7 ${d.external_id}`);
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        const fields = e.details?.["fields"] ?? [];
        if (fields.length)
          this.fieldErrors.set(Object.fromEntries(fields.map((x) => [String(x.field).split(".").pop(), x.message])));
        this.formError.set(e.message);
      }
    });
  }
  markOffline(id) {
    this.api.patch(`/devices/${id}`, { status: "offline" }).subscribe({
      next: (d) => {
        this.toast.success("Marked offline", `${d.name} \u2014 its fields now use nearby or external data.`);
        this.load();
      },
      error: (e) => this.toast.apiError(e, "Couldn't update the device")
    });
  }
  static \u0275fac = function DevicesTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DevicesTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DevicesTab, selectors: [["vc-devices-tab"]], inputs: { fields: [1, "fields"] }, decls: 72, vars: 34, consts: [[1, "bar"], ["role", "group", "aria-label", "Status filter", 1, "seg"], ["type", "button", 3, "on"], [1, "spacer"], [1, "btn", "btn-primary"], ["tone", "warn", "icon", "wifi-off"], [1, "grid", "split"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "cpu", "text", "Register SoilSync soil sensors and MicroClime weather stations to give fields Tier 1 data \u2014 and their neighbours Tier 2.", 3, "title"], [1, "table-wrap"], [1, "card", "map-card"], [1, "card-head"], [1, "lg"], [1, "on"], [1, "off"], ["height", "440px", 3, "featureClick", "polygons", "points"], ["width", "480px", 3, "openChange", "open", "drawer", "title", "subtitle"], ["id", "devForm", 1, "form-grid", 3, "ngSubmit"], [1, "field"], ["for", "nm"], ["id", "nm", "name", "nm", "placeholder", "North plot sensor", 1, "input", 3, "ngModelChange", "ngModel"], [1, "error"], [1, "field", "span-2"], ["for", "fld"], ["id", "fld", "name", "fld", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "hint"], ["for", "lat"], ["id", "lat", "name", "lat", "inputmode", "decimal", 1, "input", "num", 3, "ngModelChange", "ngModel", "placeholder"], ["for", "lon"], ["id", "lon", "name", "lon", "inputmode", "decimal", 1, "input", "num", 3, "ngModelChange", "ngModel", "placeholder"], ["for", "cal"], ["id", "cal", "type", "date", "name", "cal", 1, "input", 3, "ngModelChange", "ngModel", "max"], ["for", "st"], ["id", "st", "name", "st", 1, "input", 3, "ngModelChange", "ngModel"], ["value", "online"], ["value", "offline"], ["value", "retired"], [1, "span-2"], ["footer", ""], ["type", "button", 1, "btn", "btn-ghost", 3, "click"], ["type", "submit", "form", "devForm", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 3, "click"], [1, "c", "num"], [1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [1, "row", "wrap", 2, "--gap", "10px"], [1, "mono", "small", "subtle"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["title", "Couldn't load devices", 3, "message"], [1, "table"], [1, "clickable", 3, "sel"], [1, "clickable", 3, "click"], [1, "dn"], [1, "kind"], [3, "name", "size"], [1, "small", "subtle"], [3, "status"], [1, "nowrap"], [3, "title"], [1, "subtle"], [1, "num"], [1, "btn", "btn-ghost", "btn-sm"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "pencil", 3, "size"], [1, "kinds"], [1, "kopt"], ["type", "radio", "name", "kind", "value", "soilsync", 3, "ngModelChange", "ngModel"], ["name", "droplets"], ["type", "radio", "name", "kind", "value", "microclime", 3, "ngModelChange", "ngModel"], ["name", "rain"], ["for", "ext"], ["id", "ext", "name", "ext", "placeholder", "SS-2041", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["tone", "warn", "icon", "alert"], ["title", "Not saved", 3, "message"]], template: function DevicesTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275repeaterCreate(2, DevicesTab_For_3_Template, 4, 4, "button", 2, _forTrack02);
      \u0275\u0275elementEnd();
      \u0275\u0275element(4, "span", 3);
      \u0275\u0275conditionalCreate(5, DevicesTab_Conditional_5_Template, 3, 0, "button", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(6, DevicesTab_For_7_Template, 10, 4, "vc-callout", 5, _forTrack12);
      \u0275\u0275elementStart(8, "div", 6)(9, "section", 7);
      \u0275\u0275conditionalCreate(10, DevicesTab_Conditional_10_Template, 1, 1, "vc-loading", 8)(11, DevicesTab_Conditional_11_Template, 2, 1, "div", 9)(12, DevicesTab_Conditional_12_Template, 2, 2, "vc-empty", 10)(13, DevicesTab_Conditional_13_Template, 20, 0, "div", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "section", 12)(15, "div", 13)(16, "h3");
      \u0275\u0275text(17, "Where devices are");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "span", 14);
      \u0275\u0275element(19, "i", 15);
      \u0275\u0275text(20, "Online ");
      \u0275\u0275element(21, "i", 16);
      \u0275\u0275text(22, "Offline");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "vc-map", 17);
      \u0275\u0275listener("featureClick", function DevicesTab_Template_vc_map_featureClick_23_listener($event) {
        return ctx.pick($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "vc-modal", 18);
      \u0275\u0275twoWayListener("openChange", function DevicesTab_Template_vc_modal_openChange_24_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.formOpen, $event) || (ctx.formOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(25, "form", 19);
      \u0275\u0275listener("ngSubmit", function DevicesTab_Template_form_ngSubmit_25_listener() {
        return ctx.save();
      });
      \u0275\u0275conditionalCreate(26, DevicesTab_Conditional_26_Template, 26, 10);
      \u0275\u0275elementStart(27, "div", 20)(28, "label", 21);
      \u0275\u0275text(29, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "input", 22);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Template_input_ngModelChange_30_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.name, $event) || (ctx.form.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(31, DevicesTab_Conditional_31_Template, 2, 1, "span", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 24)(33, "label", 25);
      \u0275\u0275text(34, "Field");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "select", 26);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Template_select_ngModelChange_35_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.field_id, $event) || (ctx.form.field_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(36, "option", 27);
      \u0275\u0275text(37, "Not linked to a field");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(38, DevicesTab_For_39_Template, 2, 3, "option", 28, _forTrack12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "span", 29);
      \u0275\u0275text(41, "The farm is taken from the field. Location defaults to the field centre.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(42, "div", 20)(43, "label", 30);
      \u0275\u0275text(44, "Latitude");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "input", 31);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Template_input_ngModelChange_45_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.latitude, $event) || (ctx.form.latitude = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(46, DevicesTab_Conditional_46_Template, 2, 1, "span", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "div", 20)(48, "label", 32);
      \u0275\u0275text(49, "Longitude");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "input", 33);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Template_input_ngModelChange_50_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.longitude, $event) || (ctx.form.longitude = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(51, DevicesTab_Conditional_51_Template, 2, 1, "span", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "div", 20)(53, "label", 34);
      \u0275\u0275text(54, "Last calibrated");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "input", 35);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Template_input_ngModelChange_55_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.calibrated_on, $event) || (ctx.form.calibrated_on = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(56, "div", 20)(57, "label", 36);
      \u0275\u0275text(58, "Status");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "select", 37);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function DevicesTab_Template_select_ngModelChange_59_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.status, $event) || (ctx.form.status = $event);
        return $event;
      });
      \u0275\u0275elementStart(60, "option", 38);
      \u0275\u0275text(61, "Online");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "option", 39);
      \u0275\u0275text(63, "Offline");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(64, DevicesTab_Conditional_64_Template, 2, 0, "option", 40);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(65, DevicesTab_Conditional_65_Template, 3, 0, "div", 41);
      \u0275\u0275conditionalCreate(66, DevicesTab_Conditional_66_Template, 2, 1, "div", 41);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(67, 42);
      \u0275\u0275elementStart(68, "button", 43);
      \u0275\u0275listener("click", function DevicesTab_Template_button_click_68_listener() {
        return ctx.formOpen.set(false);
      });
      \u0275\u0275text(69, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "button", 44);
      \u0275\u0275text(71);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.statusOpts);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.canWrite() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.attention());
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.list.loading() ? 10 : ctx.list.error() ? 11 : !ctx.rows().length ? 12 : 13);
      \u0275\u0275advance(13);
      \u0275\u0275property("polygons", ctx.fieldPolys())("points", ctx.devicePts());
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.formOpen);
      \u0275\u0275property("drawer", true)("title", ctx.editing() ? "Edit device" : "Register a device")("subtitle", ctx.editing() ? ctx.editing().external_id : "SoilSync soil sensor or MicroClime weather station");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.editing() ? 26 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("span-2", !!ctx.editing());
      \u0275\u0275advance(3);
      \u0275\u0275classProp("invalid", ctx.err("name"));
      \u0275\u0275twoWayProperty("ngModel", ctx.form.name);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.err("name") ? 31 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.field_id);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.fields());
      \u0275\u0275advance(7);
      \u0275\u0275classProp("invalid", ctx.err("latitude"));
      \u0275\u0275twoWayProperty("ngModel", ctx.form.latitude);
      \u0275\u0275property("placeholder", ctx.form.field_id ? "Field centre" : "12.9716");
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.err("latitude") ? 46 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("invalid", ctx.err("longitude"));
      \u0275\u0275twoWayProperty("ngModel", ctx.form.longitude);
      \u0275\u0275property("placeholder", ctx.form.field_id ? "Field centre" : "77.5946");
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.err("longitude") ? 51 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.calibrated_on);
      \u0275\u0275property("max", ctx.today);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.status);
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.editing() ? 64 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.form.status === "retired" ? 65 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formError() ? 66 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Saving\u2026" : ctx.editing() ? "Save changes" : "Register device");
    }
  }, dependencies: [Icon, Badge, Empty, Loading, ErrorBox, Callout, Modal, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, MapView, AgoPipe, DayPipe], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 13px var(--%NS%font);\n  padding: 6px 12px;\n  border-radius: 6px;\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-200);\n}\n.seg[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\n.split[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);\n  align-items: start;\n}\n@media (max-width: 1200px) {\n  .split[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.map-card[_ngcontent-%COMP%]   vc-map[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 0 0 var(--%NS%radius) var(--%NS%radius);\n}\n.dn[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.35;\n}\n.kind[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  color: var(--%NS%forest-700);\n}\n.kind.mc[_ngcontent-%COMP%] {\n  color: var(--%NS%sky-600);\n}\n.stale[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n  font-weight: 500;\n}\ntr.sel[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n}\n.lg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.lg[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 9px;\n  height: 9px;\n  border-radius: 50%;\n  display: inline-block;\n  margin-left: 6px;\n}\n.lg[_ngcontent-%COMP%]   i.on[_ngcontent-%COMP%] {\n  background: #2f7249;\n}\n.lg[_ngcontent-%COMP%]   i.off[_ngcontent-%COMP%] {\n  background: #b3261e;\n}\n.kinds[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.kopt[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 12px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 8px;\n  cursor: pointer;\n  color: var(--%NS%stone-600);\n}\n.kopt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: none;\n}\n.kopt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.kopt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n  font-size: 13.5px;\n}\n.kopt[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  line-height: 1.35;\n}\n.kopt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: var(--%NS%focus);\n  color: var(--%NS%forest-600);\n}\n/*# sourceMappingURL=devices.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DevicesTab, [{
    type: Component,
    args: [{ selector: "vc-devices-tab", imports: [...KIT, FormsModule, MapView, AgoPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <div class="seg" role="group" aria-label="Status filter">
        @for (s of statusOpts; track s.key) {
          <button type="button" [class.on]="status() === s.key" (click)="status.set(s.key)">{{ s.label }}
            <span class="c num">{{ count(s.key) }}</span></button>
        }
      </div>
      <span class="spacer"></span>
      @if (canWrite()) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Register device</button> }
    </div>

    @for (h of attention(); track h.id) {
      <vc-callout tone="warn" icon="wifi-off">
        <div class="row wrap" style="--gap:10px">
          <span><strong>{{ h.name }}</strong> <span class="mono small subtle">{{ h.external_id }}</span> \u2014 {{ h.suggestion }}</span>
          <span class="spacer"></span>
          @if (canWrite()) { <button class="btn btn-secondary btn-sm" (click)="markOffline(h.id)">Mark offline</button> }
        </div>
      </vc-callout>
    }

    <div class="grid split">
      <section class="card">
        @if (list.loading()) {
          <vc-loading [rows]="6" />
        } @else if (list.error()) {
          <div class="card-body"><vc-error title="Couldn't load devices" [message]="list.error()!.message" /></div>
        } @else if (!rows().length) {
          <vc-empty icon="cpu" [title]="status() ? 'No devices with this status' : 'No devices registered yet'"
            text="Register SoilSync soil sensors and MicroClime weather stations to give fields Tier 1 data \u2014 and their neighbours Tier 2.">
            @if (canWrite() && !status()) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Register device</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Device</th><th>Kind</th><th>Farm / field</th><th>Status</th><th>Last seen</th><th>Calibrated</th><th></th></tr></thead>
              <tbody>
                @for (d of rows(); track d.id) {
                  <tr class="clickable" [class.sel]="selected() === d.id" (click)="selected.set(d.id)">
                    <td><div class="dn"><strong>{{ d.name }}</strong><span class="mono small subtle">{{ d.external_id }}</span></div></td>
                    <td><span class="kind" [class.mc]="d.kind === 'microclime'"><vc-icon [name]="d.kind === 'soilsync' ? 'droplets' : 'rain'" [size]="13" />{{ kindLabel(d.kind) }}</span></td>
                    <td>
                      <div class="dn"><span>{{ farmName(d.farm_id) }}</span><span class="small subtle">{{ fieldCode(d.field_id) }}</span></div>
                    </td>
                    <td><vc-badge [status]="d.status" /></td>
                    <td class="nowrap"><span [title]="d.last_seen_at | day: true" [class.stale]="isStale(d.id)">{{ d.last_seen_at ? (d.last_seen_at | ago) : 'Never' }}</span></td>
                    <td class="nowrap">@if (d.calibrated_on) { {{ d.calibrated_on | day }} } @else { <span class="subtle">Not recorded</span> }</td>
                    <td class="num">
                      @if (canWrite() && d.status !== 'retired') {
                        <button class="btn btn-ghost btn-sm" (click)="openEdit(d); $event.stopPropagation()"><vc-icon name="pencil" [size]="14" />Edit</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
      <section class="card map-card">
        <div class="card-head"><h3>Where devices are</h3>
          <span class="lg"><i class="on"></i>Online <i class="off"></i>Offline</span>
        </div>
        <vc-map [polygons]="fieldPolys()" [points]="devicePts()" height="440px" (featureClick)="pick($event)" />
      </section>
    </div>

    <vc-modal [(open)]="formOpen" [drawer]="true" width="480px" [title]="editing() ? 'Edit device' : 'Register a device'"
      [subtitle]="editing() ? editing()!.external_id : 'SoilSync soil sensor or MicroClime weather station'">
      <form class="form-grid" (ngSubmit)="save()" id="devForm">
        @if (!editing()) {
          <div class="field span-2">
            <label>Kind</label>
            <div class="kinds">
              <label class="kopt" [class.on]="form.kind === 'soilsync'"><input type="radio" name="kind" value="soilsync" [(ngModel)]="form.kind" />
                <vc-icon name="droplets" /><span><strong>SoilSync</strong><small>Soil moisture, temperature, EC, pH</small></span></label>
              <label class="kopt" [class.on]="form.kind === 'microclime'"><input type="radio" name="kind" value="microclime" [(ngModel)]="form.kind" />
                <vc-icon name="rain" /><span><strong>MicroClime</strong><small>Rainfall, air temperature, humidity, wind</small></span></label>
            </div>
          </div>
          <div class="field">
            <label for="ext">Device ID</label>
            <input id="ext" class="input mono" name="ext" [(ngModel)]="form.external_id" placeholder="SS-2041" [class.invalid]="err('external_id')" />
            @if (err('external_id')) { <span class="error">{{ err('external_id') }}</span> } @else { <span class="hint">Printed on the device label</span> }
          </div>
        }
        <div class="field" [class.span-2]="!!editing()">
          <label for="nm">Name</label>
          <input id="nm" class="input" name="nm" [(ngModel)]="form.name" placeholder="North plot sensor" [class.invalid]="err('name')" />
          @if (err('name')) { <span class="error">{{ err('name') }}</span> }
        </div>
        <div class="field span-2">
          <label for="fld">Field</label>
          <select id="fld" class="input" name="fld" [(ngModel)]="form.field_id">
            <option value="">Not linked to a field</option>
            @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} \xB7 {{ f.name }}</option> }
          </select>
          <span class="hint">The farm is taken from the field. Location defaults to the field centre.</span>
        </div>
        <div class="field">
          <label for="lat">Latitude</label>
          <input id="lat" class="input num" name="lat" inputmode="decimal" [(ngModel)]="form.latitude" [placeholder]="form.field_id ? 'Field centre' : '12.9716'" [class.invalid]="err('latitude')" />
          @if (err('latitude')) { <span class="error">{{ err('latitude') }}</span> }
        </div>
        <div class="field">
          <label for="lon">Longitude</label>
          <input id="lon" class="input num" name="lon" inputmode="decimal" [(ngModel)]="form.longitude" [placeholder]="form.field_id ? 'Field centre' : '77.5946'" [class.invalid]="err('longitude')" />
          @if (err('longitude')) { <span class="error">{{ err('longitude') }}</span> }
        </div>
        <div class="field">
          <label for="cal">Last calibrated</label>
          <input id="cal" type="date" class="input" name="cal" [(ngModel)]="form.calibrated_on" [max]="today" />
        </div>
        <div class="field">
          <label for="st">Status</label>
          <select id="st" class="input" name="st" [(ngModel)]="form.status">
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            @if (editing()) { <option value="retired">Retired (permanent)</option> }
          </select>
        </div>
        @if (form.status === 'retired') {
          <div class="span-2"><vc-callout tone="warn" icon="alert">A retired device can't be changed or brought back. Its past readings are kept.</vc-callout></div>
        }
        @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="devForm" [disabled]="saving()">{{ saving() ? 'Saving\u2026' : editing() ? 'Save changes' : 'Register device' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;692056e0f164a7a1;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\supporting\\devices.tab.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.bar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.seg {\n  display: inline-flex;\n  background: var(--surface);\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg button {\n  border: 0;\n  background: none;\n  font: 500 13px var(--font);\n  padding: 6px 12px;\n  border-radius: 6px;\n  color: var(--stone-600);\n  cursor: pointer;\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n}\n.seg button.on {\n  background: var(--forest-50);\n  color: var(--forest-700);\n  box-shadow: inset 0 0 0 1px var(--forest-200);\n}\n.seg .c {\n  font-size: 11px;\n  color: var(--text-3);\n}\n.split {\n  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);\n  align-items: start;\n}\n@media (max-width: 1200px) {\n  .split {\n    grid-template-columns: 1fr;\n  }\n}\n.map-card vc-map {\n  border: 0;\n  border-radius: 0 0 var(--radius) var(--radius);\n}\n.dn {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.35;\n}\n.kind {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  color: var(--forest-700);\n}\n.kind.mc {\n  color: var(--sky-600);\n}\n.stale {\n  color: var(--amber-600);\n  font-weight: 500;\n}\ntr.sel td {\n  background: var(--forest-50);\n}\n.lg {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--text-2);\n}\n.lg i {\n  width: 9px;\n  height: 9px;\n  border-radius: 50%;\n  display: inline-block;\n  margin-left: 6px;\n}\n.lg i.on {\n  background: #2f7249;\n}\n.lg i.off {\n  background: #b3261e;\n}\n.kinds {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.kopt {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 12px;\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  cursor: pointer;\n  color: var(--stone-600);\n}\n.kopt input {\n  display: none;\n}\n.kopt span {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.kopt strong {\n  color: var(--stone-900);\n  font-size: 13.5px;\n}\n.kopt small {\n  font-size: 12px;\n  color: var(--text-3);\n  line-height: 1.35;\n}\n.kopt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: var(--focus);\n  color: var(--forest-600);\n}\n/*# sourceMappingURL=devices.tab.css.map */\n"] }]
  }], () => [], { fields: [{ type: Input, args: [{ isSignal: true, alias: "fields", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DevicesTab, { className: "DevicesTab", filePath: "src/app/features/supporting/devices.tab.ts", lineNumber: 192 });
})();

// src/app/features/supporting/explorer.tab.ts
var _forTrack03 = ($index, $item) => $item.id;
var _forTrack13 = ($index, $item) => $item.d;
var _forTrack2 = ($index, $item) => $item.parameter;
var _forTrack3 = ($index, $item) => $item.tier;
var _forTrack4 = ($index, $item) => $item.ref;
function ExplorerTab_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    \u0275\u0275property("value", f_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r1.code, " \xB7 ", f_r1.name);
  }
}
function ExplorerTab_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function ExplorerTab_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.syncField());
    });
    \u0275\u0275element(1, "vc-icon", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r2.syncing());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r2.syncing() ? "Syncing\u2026" : "Sync this field", " ");
  }
}
function ExplorerTab_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "vc-empty", 11);
    \u0275\u0275elementEnd();
  }
}
function ExplorerTab_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "vc-loading", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 4);
  }
}
function ExplorerTab_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 12);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r2.summary.error().message);
  }
}
function ExplorerTab_Conditional_12_Conditional_2_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Use ");
    \u0275\u0275elementStart(1, "strong");
    \u0275\u0275text(2, "Sync this field");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" to fetch the last ", ctx_r2.windowDays(), " days from the best available sources. ");
  }
}
function ExplorerTab_Conditional_12_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 22);
    \u0275\u0275text(1);
    \u0275\u0275conditionalCreate(2, ExplorerTab_Conditional_12_Conditional_2_Conditional_0_Conditional_2_Template, 4, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r4 = \u0275\u0275nextContext();
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" No supporting data has been synced for ", s_r4.field_code, " yet. ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canSync() ? 2 : -1);
  }
}
function ExplorerTab_Conditional_12_Conditional_2_For_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-tier", 28);
  }
  if (rf & 2) {
    const p_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("tier", p_r6.tier)("compact", true);
  }
}
function ExplorerTab_Conditional_12_Conditional_2_For_3_Conditional_5_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-dc", 33);
  }
  if (rf & 2) {
    const p_r6 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("cls", p_r6.data_class);
  }
}
function ExplorerTab_Conditional_12_Conditional_2_For_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementStart(3, "span", 30);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 31)(6, "span", 32);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, ExplorerTab_Conditional_12_Conditional_2_For_3_Conditional_5_Conditional_8_Template, 1, 1, "vc-dc", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "vc-quality", 5);
    \u0275\u0275elementStart(10, "div", 34);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r6.last_value === null ? "\u2014" : \u0275\u0275pipeBind2(2, 6, p_r6.last_value, 2));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r6.unit);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r6.provider);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r6.data_class ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("value", p_r6.avg_quality);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r6.last_date ? \u0275\u0275pipeBind1(12, 9, p_r6.last_date) : "");
  }
}
function ExplorerTab_Conditional_12_Conditional_2_For_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275text(1, "Not synced");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 34);
    \u0275\u0275text(3, "No readings stored yet");
    \u0275\u0275elementEnd();
  }
}
function ExplorerTab_Conditional_12_Conditional_2_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function ExplorerTab_Conditional_12_Conditional_2_For_3_Template_button_click_0_listener() {
      const p_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.parameter.set(p_r6.parameter));
    });
    \u0275\u0275elementStart(1, "div", 26)(2, "span", 27);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ExplorerTab_Conditional_12_Conditional_2_For_3_Conditional_4_Template, 1, 2, "vc-tier", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, ExplorerTab_Conditional_12_Conditional_2_For_3_Conditional_5_Template, 13, 11)(6, ExplorerTab_Conditional_12_Conditional_2_For_3_Conditional_6_Template, 4, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("on", p_r6.parameter === ctx_r2.parameter())("off", !p_r6.synced);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r6.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r6.synced ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(p_r6.synced ? 5 : 6);
  }
}
function ExplorerTab_Conditional_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ExplorerTab_Conditional_12_Conditional_2_Conditional_0_Template, 3, 2, "vc-callout", 22);
    \u0275\u0275elementStart(1, "div", 23);
    \u0275\u0275repeaterCreate(2, ExplorerTab_Conditional_12_Conditional_2_For_3_Template, 7, 7, "button", 24, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r2.syncedCount() ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.parameters);
  }
}
function ExplorerTab_Conditional_12_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", ctx_r2.series.data().unit);
  }
}
function ExplorerTab_Conditional_12_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function ExplorerTab_Conditional_12_For_13_Template_button_click_0_listener() {
      const w_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.windowDays.set(w_r8.d));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r2.windowDays() === w_r8.d);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(w_r8.l);
  }
}
function ExplorerTab_Conditional_12_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 19);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function ExplorerTab_Conditional_12_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "vc-error", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r2.series.error().message);
  }
}
function ExplorerTab_Conditional_12_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 21);
  }
}
function ExplorerTab_Conditional_12_Conditional_17_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "span", 45);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", t_r9.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", t_r9.short, " \xB7 ", t_r9.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", t_r9.n, " d");
  }
}
function ExplorerTab_Conditional_12_Conditional_17_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275element(1, "i", 46);
    \u0275\u0275text(2, "Bias-corrected ");
    \u0275\u0275elementStart(3, "span", 45);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r2.biasCount(), " d");
  }
}
function ExplorerTab_Conditional_12_Conditional_17_For_11_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1, "Simulated");
    \u0275\u0275elementEnd();
  }
}
function ExplorerTab_Conditional_12_Conditional_17_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 44);
    \u0275\u0275element(1, "vc-tier", 28);
    \u0275\u0275elementStart(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ExplorerTab_Conditional_12_Conditional_17_For_11_Conditional_4_Template, 2, 0, "span", 47);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("tier", s_r10.tier)("compact", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r10.ref);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r10.simulated ? 4 : -1);
  }
}
function ExplorerTab_Conditional_12_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275element(1, "vc-chart", 39);
    \u0275\u0275elementStart(2, "div", 40);
    \u0275\u0275repeaterCreate(3, ExplorerTab_Conditional_12_Conditional_17_For_4_Template, 5, 5, "span", 41, _forTrack3);
    \u0275\u0275conditionalCreate(5, ExplorerTab_Conditional_12_Conditional_17_Conditional_5_Template, 5, 1, "span", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 42)(7, "div", 43)(8, "span", 16);
    \u0275\u0275text(9, "Sources");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, ExplorerTab_Conditional_12_Conditional_17_For_11_Template, 5, 4, "span", 44, _forTrack4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("option", ctx_r2.chart());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.tiersPresent());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.biasCount() ? 5 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.sources());
  }
}
function ExplorerTab_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ExplorerTab_Conditional_12_Conditional_0_Template, 2, 1, "div", 8)(1, ExplorerTab_Conditional_12_Conditional_1_Template, 1, 1, "vc-error", 12)(2, ExplorerTab_Conditional_12_Conditional_2_Template, 4, 1);
    \u0275\u0275elementStart(3, "section", 8)(4, "div", 13)(5, "div", 14)(6, "h3");
    \u0275\u0275text(7);
    \u0275\u0275conditionalCreate(8, ExplorerTab_Conditional_12_Conditional_8_Template, 2, 1, "span", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 16);
    \u0275\u0275text(10, "Best value per day. Colour shows which source supplied it.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 17);
    \u0275\u0275repeaterCreate(12, ExplorerTab_Conditional_12_For_13_Template, 2, 3, "button", 18, _forTrack13);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, ExplorerTab_Conditional_12_Conditional_14_Template, 1, 1, "vc-loading", 19)(15, ExplorerTab_Conditional_12_Conditional_15_Template, 2, 1, "div", 20)(16, ExplorerTab_Conditional_12_Conditional_16_Template, 1, 0, "vc-empty", 21)(17, ExplorerTab_Conditional_12_Conditional_17_Template, 12, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.summary.loading() ? 0 : ctx_r2.summary.error() ? 1 : (tmp_1_0 = ctx_r2.summary.data()) ? 2 : -1, tmp_1_0);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r2.series.data()?.label ?? "History");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.series.data()?.unit ? 8 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.windows);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.series.loading() ? 14 : ctx_r2.series.error() ? 15 : !ctx_r2.points().length ? 16 : 17);
  }
}
var WINDOWS = [{ d: 30, l: "30 days" }, { d: 90, l: "90 days" }, { d: 180, l: "6 months" }, { d: 365, l: "1 year" }];
var ExplorerTab = class _ExplorerTab {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  fields = input(
    [],
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldId = model(
    "",
    ...ngDevMode ? [{ debugName: "fieldId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  parameter = signal(
    "rain_mm",
    ...ngDevMode ? [{ debugName: "parameter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  windowDays = signal(
    90,
    ...ngDevMode ? [{ debugName: "windowDays" }] : (
      /* istanbul ignore next */
      []
    )
  );
  windows = WINDOWS;
  syncing = signal(
    false,
    ...ngDevMode ? [{ debugName: "syncing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canSync = computed(
    () => this.auth.can("data.sync"),
    ...ngDevMode ? [{ debugName: "canSync" }] : (
      /* istanbul ignore next */
      []
    )
  );
  summary = new Remote();
  series = new Remote();
  syncedCount = computed(
    () => (this.summary.data()?.parameters ?? []).filter((p) => p.synced).length,
    ...ngDevMode ? [{ debugName: "syncedCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  points = computed(
    () => this.series.data()?.points ?? [],
    ...ngDevMode ? [{ debugName: "points" }] : (
      /* istanbul ignore next */
      []
    )
  );
  biasCount = computed(
    () => this.points().filter((p) => p.bias_corrected).length,
    ...ngDevMode ? [{ debugName: "biasCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tiersPresent = computed(
    () => TIER_ORDER.map((t) => __spreadProps(__spreadValues({}, tierMeta(t)), { n: this.points().filter((p) => p.tier === t).length })).filter((t) => t.n),
    ...ngDevMode ? [{ debugName: "tiersPresent" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sources = computed(
    () => {
      const m = /* @__PURE__ */ new Map();
      for (const p of this.points())
        if (p.source_ref && !m.has(p.source_ref))
          m.set(p.source_ref, p.tier);
      return [...m].map(([ref, tier]) => ({ ref, tier, simulated: isSimulated(ref) }));
    },
    ...ngDevMode ? [{ debugName: "sources" }] : (
      /* istanbul ignore next */
      []
    )
  );
  chart = computed(
    () => {
      const pts = this.points();
      const s = this.series.data();
      const unit = s?.unit ?? "";
      const dates = pts.map((p) => p.date);
      const isRain = s?.parameter === "rain_mm";
      const fmt = (i) => {
        const p = pts[i];
        if (!p)
          return "";
        const t = tierMeta(p.tier);
        return `<div style="font-weight:600;margin-bottom:4px">${p.date}</div><div style="font-size:16px;font-weight:600">${p.value === null ? "\u2014" : p.value.toFixed(2)} <span style="font-size:11px;color:#737c76">${unit}</span></div><div style="margin-top:4px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${t.color};margin-right:6px"></span>${t.short} \xB7 ${t.label}</div><div style="color:#58625b">${p.source_ref}${p.distance_km !== null ? ` \xB7 ${p.distance_km.toFixed(1)} km away` : ""}</div><div style="color:#58625b">Quality ${p.quality.toFixed(2)}${p.bias_corrected ? ' \xB7 <b style="color:#ad4f1f">bias-corrected</b>' : ""}</div>` + (p.note ? `<div style="color:#737c76;max-width:260px;white-space:normal">${p.note}</div>` : "");
      };
      const base = {
        grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
        tooltip: { trigger: "axis", formatter: (ps) => fmt(ps?.[0]?.dataIndex ?? -1) },
        legend: { show: false },
        xAxis: { type: "category", data: dates, boundaryGap: isRain, axisLabel: { formatter: (v) => v.slice(5) } },
        yAxis: { type: "value", name: unit, nameTextStyle: { color: "#737c76", fontSize: 11, align: "left" }, scale: !isRain }
      };
      if (isRain) {
        return __spreadProps(__spreadValues({}, base), {
          series: [{
            type: "bar",
            barMaxWidth: 10,
            data: pts.map((p) => ({ value: p.value, itemStyle: { color: tierMeta(p.tier).color, opacity: p.bias_corrected ? 0.65 : 1, borderRadius: [2, 2, 0, 0] } }))
          }]
        });
      }
      const lines = TIER_ORDER.filter((t) => t !== 0 && pts.some((p) => p.tier === t)).map((t) => ({
        type: "line",
        showSymbol: false,
        smooth: false,
        connectNulls: false,
        lineStyle: { width: 2, color: tierMeta(t).color },
        itemStyle: { color: tierMeta(t).color },
        emphasis: { disabled: true },
        data: pts.map((p, i) => p.tier === t || i > 0 && pts[i - 1].tier === t && p.tier !== 0 ? p.value : null)
      }));
      const bias = {
        type: "scatter",
        symbol: "diamond",
        symbolSize: 9,
        z: 5,
        itemStyle: { color: "#ffffff", borderColor: "#c76329", borderWidth: 2 },
        data: pts.map((p) => p.bias_corrected ? p.value : null)
      };
      return __spreadProps(__spreadValues({}, base), { series: [...lines, bias] });
    },
    ...ngDevMode ? [{ debugName: "chart" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const id = this.fieldId();
      untracked(() => {
        if (id)
          this.summary.load(this.api.get(`/fields/${id}/supporting/summary`));
        else
          this.summary.reset();
      });
    });
    effect(() => {
      const id = this.fieldId();
      const p = this.parameter();
      const d = this.windowDays();
      untracked(() => {
        if (!id) {
          this.series.reset();
          return;
        }
        this.series.load(this.api.get(`/fields/${id}/supporting`, { parameter: p, start: daysAgo(d), end: isoDate(/* @__PURE__ */ new Date()) }));
      });
    });
  }
  syncField() {
    const id = this.fieldId();
    if (!id)
      return;
    this.syncing.set(true);
    this.api.post(`/fields/${id}/supporting/sync`, {
      start: daysAgo(this.windowDays()),
      end: isoDate(/* @__PURE__ */ new Date())
    }).subscribe({
      next: (r) => {
        this.syncing.set(false);
        const written = Object.values(r.parameters ?? {}).reduce((a, p) => a + (p.written ?? 0), 0);
        this.toast.success("Field synced", written ? `${written} new daily readings stored.` : "Everything was already up to date.");
        this.summary.load(this.api.get(`/fields/${id}/supporting/summary`), true);
        this.series.load(this.api.get(`/fields/${id}/supporting`, { parameter: this.parameter(), start: daysAgo(this.windowDays()), end: isoDate(/* @__PURE__ */ new Date()) }), true);
      },
      error: (e) => {
        this.syncing.set(false);
        this.toast.apiError(e, "Couldn't sync the field");
      }
    });
  }
  static \u0275fac = function ExplorerTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ExplorerTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ExplorerTab, selectors: [["vc-explorer-tab"]], inputs: { fields: [1, "fields"], fieldId: [1, "fieldId"] }, outputs: { fieldId: "fieldIdChange" }, decls: 13, vars: 3, consts: [[1, "bar"], [1, "field", "picker"], ["for", "fp"], ["id", "fp", 1, "input", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", ""], [3, "value"], [1, "spacer"], [1, "btn", "btn-secondary", 3, "disabled"], [1, "card"], [1, "btn", "btn-secondary", 3, "click", "disabled"], ["name", "refresh"], ["icon", "pin", "title", "Pick a field to explore its data", "text", "See which source supplies each parameter today, how good it is, and the full daily history."], ["title", "Couldn't load the field summary", 3, "message"], [1, "card-head"], [1, "ct"], [1, "subtle"], [1, "small", "muted"], [1, "seg"], ["type", "button", 3, "on"], [3, "rows"], [1, "card-body"], ["icon", "chart", "title", "No readings in this window", "text", "Sync the field, or choose a longer window."], ["tone", "info", "icon", "info"], [1, "params"], ["type", "button", 1, "pcard", 3, "on", "off"], ["type", "button", 1, "pcard", 3, "click"], [1, "ph"], [1, "pl"], [3, "tier", "compact"], [1, "pv", "num"], [1, "u"], [1, "pm"], [1, "truncate"], [3, "cls"], [1, "pd", "subtle"], [1, "pv", "none"], ["type", "button", 3, "click"], ["title", "Couldn't load the history", 3, "message"], [1, "card-body", "chart-body"], ["height", "300px", 3, "option"], [1, "legend"], [1, "li"], [1, "card-foot", "left"], [1, "sources"], [1, "src"], [1, "subtle", "num"], [1, "dia"], ["title", "This provider returns simulated values for demonstration and testing", 1, "sim"]], template: function ExplorerTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "label", 2);
      \u0275\u0275text(3, "Field");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "select", 3);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function ExplorerTab_Template_select_ngModelChange_4_listener($event) {
        return ctx.fieldId.set($event);
      });
      \u0275\u0275elementStart(5, "option", 4);
      \u0275\u0275text(6, "Choose a field\u2026");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(7, ExplorerTab_For_8_Template, 2, 3, "option", 5, _forTrack03);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(9, "span", 6);
      \u0275\u0275conditionalCreate(10, ExplorerTab_Conditional_10_Template, 3, 2, "button", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(11, ExplorerTab_Conditional_11_Template, 2, 0, "div", 8)(12, ExplorerTab_Conditional_12_Template, 18, 4);
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.fieldId());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.fields());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.fieldId() && ctx.canSync() ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.fieldId() ? 11 : 12);
    }
  }, dependencies: [Icon, DataClass, Empty, Loading, ErrorBox, Callout, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, Chart, TierChip, QualityBar, NumPipe, DayPipe], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.picker[_ngcontent-%COMP%] {\n  width: min(420px, 100%);\n}\n.params[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 12px;\n}\n@media (max-width: 1280px) {\n  .params[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n@media (max-width: 980px) {\n  .params[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.pcard[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  text-align: left;\n  padding: 12px 14px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  box-shadow: var(--%NS%shadow-sm);\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.pcard[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-300);\n}\n.pcard.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  box-shadow: var(--%NS%focus);\n}\n.pcard.off[_ngcontent-%COMP%] {\n  background: var(--%NS%surface-2);\n}\n.ph[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.pl[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--%NS%text-2);\n}\n.pv[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.pv[_ngcontent-%COMP%]   .u[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--%NS%text-3);\n  margin-left: 4px;\n}\n.pv.none[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--%NS%text-3);\n  font-weight: 500;\n  padding: 4px 0;\n}\n.pm[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--%NS%text-2);\n  min-height: 18px;\n}\n.pd[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n}\n.ct[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  background: var(--%NS%sand-100);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 12.5px var(--%NS%font);\n  padding: 5px 10px;\n  border-radius: 6px;\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%stone-900);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.chart-body[_ngcontent-%COMP%] {\n  padding-top: 12px;\n}\n.legend[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-top: 10px;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n}\n.li[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.li[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 4px;\n  border-radius: 2px;\n  display: inline-block;\n}\n.li[_ngcontent-%COMP%]   i.dia[_ngcontent-%COMP%] {\n  width: 9px;\n  height: 9px;\n  border-radius: 1px;\n  transform: rotate(45deg);\n  background: var(--%NS%surface);\n  border: 2px solid var(--%NS%clay-500);\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.sources[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px 14px;\n  align-items: center;\n}\n.src[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.src[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%stone-700);\n}\n.sim[_ngcontent-%COMP%] {\n  font: 600 10px/1 var(--%NS%mono);\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  padding: 4px 6px;\n  border-radius: 4px;\n  background: var(--%NS%violet-100);\n  color: var(--%NS%violet-600);\n}\n/*# sourceMappingURL=explorer.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExplorerTab, [{
    type: Component,
    args: [{ selector: "vc-explorer-tab", imports: [...KIT, FormsModule, Chart, TierChip, QualityBar, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="bar">
      <div class="field picker">
        <label for="fp">Field</label>
        <select id="fp" class="input" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)">
          <option value="" disabled>Choose a field\u2026</option>
          @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} \xB7 {{ f.name }}</option> }
        </select>
      </div>
      <span class="spacer"></span>
      @if (fieldId() && canSync()) {
        <button class="btn btn-secondary" [disabled]="syncing()" (click)="syncField()">
          <vc-icon name="refresh" />{{ syncing() ? 'Syncing\u2026' : 'Sync this field' }}
        </button>
      }
    </div>

    @if (!fieldId()) {
      <div class="card"><vc-empty icon="pin" title="Pick a field to explore its data"
        text="See which source supplies each parameter today, how good it is, and the full daily history." /></div>
    } @else {
      @if (summary.loading()) {
        <div class="card"><vc-loading [rows]="4" /></div>
      } @else if (summary.error()) {
        <vc-error title="Couldn't load the field summary" [message]="summary.error()!.message" />
      } @else if (summary.data(); as s) {
        @if (!syncedCount()) {
          <vc-callout tone="info" icon="info">
            No supporting data has been synced for {{ s.field_code }} yet.
            @if (canSync()) { Use <strong>Sync this field</strong> to fetch the last {{ windowDays() }} days from the best available sources. }
          </vc-callout>
        }
        <div class="params">
          @for (p of s.parameters; track p.parameter) {
            <button type="button" class="pcard" [class.on]="p.parameter === parameter()" [class.off]="!p.synced" (click)="parameter.set(p.parameter)">
              <div class="ph"><span class="pl">{{ p.label }}</span>
                @if (p.synced) { <vc-tier [tier]="p.tier" [compact]="true" /> }
              </div>
              @if (p.synced) {
                <div class="pv num">{{ p.last_value === null ? '\u2014' : (p.last_value | num: 2) }}<span class="u">{{ p.unit }}</span></div>
                <div class="pm"><span class="truncate">{{ p.provider }}</span>@if (p.data_class) { <vc-dc [cls]="p.data_class" /> }</div>
                <vc-quality [value]="p.avg_quality" />
                <div class="pd subtle">{{ p.last_date ? (p.last_date | day) : '' }}</div>
              } @else {
                <div class="pv none">Not synced</div>
                <div class="pd subtle">No readings stored yet</div>
              }
            </button>
          }
        </div>
      }

      <section class="card">
        <div class="card-head">
          <div class="ct"><h3>{{ series.data()?.label ?? 'History' }}@if (series.data()?.unit) { <span class="subtle"> \xB7 {{ series.data()!.unit }}</span> }</h3>
            <span class="small muted">Best value per day. Colour shows which source supplied it.</span></div>
          <div class="seg">
            @for (w of windows; track w.d) { <button type="button" [class.on]="windowDays() === w.d" (click)="windowDays.set(w.d)">{{ w.l }}</button> }
          </div>
        </div>
        @if (series.loading()) {
          <vc-loading [rows]="5" />
        } @else if (series.error()) {
          <div class="card-body"><vc-error title="Couldn't load the history" [message]="series.error()!.message" /></div>
        } @else if (!points().length) {
          <vc-empty icon="chart" title="No readings in this window" text="Sync the field, or choose a longer window." />
        } @else {
          <div class="card-body chart-body">
            <vc-chart [option]="chart()" height="300px" />
            <div class="legend">
              @for (t of tiersPresent(); track t.tier) {
                <span class="li"><i [style.background]="t.color"></i>{{ t.short }} \xB7 {{ t.label }} <span class="subtle num">{{ t.n }} d</span></span>
              }
              @if (biasCount()) { <span class="li"><i class="dia"></i>Bias-corrected <span class="subtle num">{{ biasCount() }} d</span></span> }
            </div>
          </div>
          <div class="card-foot left">
            <div class="sources">
              <span class="small muted">Sources</span>
              @for (s of sources(); track s.ref) {
                <span class="src"><vc-tier [tier]="s.tier" [compact]="true" /><code>{{ s.ref }}</code>
                  @if (s.simulated) { <span class="sim" title="This provider returns simulated values for demonstration and testing">Simulated</span> }
                </span>
              }
            </div>
          </div>
        }
      </section>
    }
  `, styles: ["/* angular:styles/component:scss;2d7bc54652394a8e;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\supporting\\explorer.tab.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.bar {\n  display: flex;\n  align-items: flex-end;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n.picker {\n  width: min(420px, 100%);\n}\n.params {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(0, 1fr));\n  gap: 12px;\n}\n@media (max-width: 1280px) {\n  .params {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n@media (max-width: 980px) {\n  .params {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.pcard {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  text-align: left;\n  padding: 12px 14px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow-sm);\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.pcard:hover {\n  border-color: var(--stone-300);\n}\n.pcard.on {\n  border-color: var(--forest-500);\n  box-shadow: var(--focus);\n}\n.pcard.off {\n  background: var(--surface-2);\n}\n.ph {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.pl {\n  font-size: 12.5px;\n  font-weight: 500;\n  color: var(--text-2);\n}\n.pv {\n  font-size: 20px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.pv .u {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--text-3);\n  margin-left: 4px;\n}\n.pv.none {\n  font-size: 14px;\n  color: var(--text-3);\n  font-weight: 500;\n  padding: 4px 0;\n}\n.pm {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--text-2);\n  min-height: 18px;\n}\n.pd {\n  font-size: 11.5px;\n}\n.ct {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.seg {\n  display: inline-flex;\n  background: var(--sand-100);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg button {\n  border: 0;\n  background: none;\n  font: 500 12.5px var(--font);\n  padding: 5px 10px;\n  border-radius: 6px;\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--surface);\n  color: var(--stone-900);\n  box-shadow: var(--shadow-sm);\n}\n.chart-body {\n  padding-top: 12px;\n}\n.legend {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  margin-top: 10px;\n  font-size: 12.5px;\n  color: var(--stone-700);\n}\n.li {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.li i {\n  width: 12px;\n  height: 4px;\n  border-radius: 2px;\n  display: inline-block;\n}\n.li i.dia {\n  width: 9px;\n  height: 9px;\n  border-radius: 1px;\n  transform: rotate(45deg);\n  background: var(--surface);\n  border: 2px solid var(--clay-500);\n}\n.card-foot.left {\n  justify-content: flex-start;\n}\n.sources {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px 14px;\n  align-items: center;\n}\n.src {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.src code {\n  font-size: 12px;\n  color: var(--stone-700);\n}\n.sim {\n  font: 600 10px/1 var(--mono);\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  padding: 4px 6px;\n  border-radius: 4px;\n  background: var(--violet-100);\n  color: var(--violet-600);\n}\n/*# sourceMappingURL=explorer.tab.css.map */\n"] }]
  }], () => [], { fields: [{ type: Input, args: [{ isSignal: true, alias: "fields", required: false }] }], fieldId: [{ type: Input, args: [{ isSignal: true, alias: "fieldId", required: false }] }, { type: Output, args: ["fieldIdChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ExplorerTab, { className: "ExplorerTab", filePath: "src/app/features/supporting/explorer.tab.ts", lineNumber: 153 });
})();

// src/app/features/supporting/supporting.page.ts
var _c0 = () => [];
var _forTrack04 = ($index, $item) => $item.tier;
function SupportingPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function SupportingPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.syncOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 19);
    \u0275\u0275text(2, "Sync project");
    \u0275\u0275elementEnd();
  }
}
function SupportingPage_For_4_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275element(1, "vc-icon", 25);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "if missing");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function SupportingPage_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 21)(2, "span", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "div", 23);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(11, SupportingPage_For_4_Conditional_11_Template, 4, 1, "div", 24);
  }
  if (rf & 2) {
    const t_r3 = ctx.$implicit;
    const \u0275$index_11_r4 = ctx.$index;
    const \u0275$count_11_r5 = ctx.$count;
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", t_r3.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r3.tier || "\u2013");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(t_r3.tier ? t_r3.short : "Fallback");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r3.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r3.explain);
    \u0275\u0275advance();
    \u0275\u0275conditional(!(\u0275$index_11_r4 === \u0275$count_11_r5 - 1) ? 11 : -1);
  }
}
function SupportingPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "vc-empty", 26);
    \u0275\u0275elementEnd();
  }
}
function SupportingPage_Conditional_6_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-coverage-tab", 31);
    \u0275\u0275listener("openField", function SupportingPage_Conditional_6_Case_1_Template_vc_coverage_tab_openField_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openField($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("projectId", ctx_r1.ctx.currentId());
  }
}
function SupportingPage_Conditional_6_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-devices-tab", 29);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("fields", ctx_r1.fields.data() ?? \u0275\u0275pureFunction0(1, _c0));
  }
}
function SupportingPage_Conditional_6_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-explorer-tab", 32);
    \u0275\u0275twoWayListener("fieldIdChange", function SupportingPage_Conditional_6_Case_3_Template_vc_explorer_tab_fieldIdChange_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.fieldId, $event) || (ctx_r1.fieldId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("fields", ctx_r1.fields.data() ?? \u0275\u0275pureFunction0(2, _c0));
    \u0275\u0275twoWayProperty("fieldId", ctx_r1.fieldId);
  }
}
function SupportingPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-tabs", 27);
    \u0275\u0275twoWayListener("activeChange", function SupportingPage_Conditional_6_Template_vc_tabs_activeChange_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.tab, $event) || (ctx_r1.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, SupportingPage_Conditional_6_Case_1_Template, 1, 1, "vc-coverage-tab", 28)(2, SupportingPage_Conditional_6_Case_2_Template, 1, 2, "vc-devices-tab", 29)(3, SupportingPage_Conditional_6_Case_3_Template, 1, 3, "vc-explorer-tab", 30);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("tabs", ctx_r1.tabs());
    \u0275\u0275twoWayProperty("active", ctx_r1.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.tab()) === "coverage" ? 1 : tmp_3_0 === "devices" ? 2 : tmp_3_0 === "explorer" ? 3 : -1);
  }
}
function SupportingPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 14);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.syncError());
  }
}
var SupportingPage = class _SupportingPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  ctx = inject(ProjectContext);
  tab = signal(
    this.route.snapshot.queryParamMap.get("tab") ?? "coverage",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldId = signal(
    this.route.snapshot.queryParamMap.get("field") ?? "",
    ...ngDevMode ? [{ debugName: "fieldId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fields = new Remote();
  tierSteps = TIER_ORDER.map(tierMeta);
  canSync = computed(
    () => this.auth.can("data.sync"),
    ...ngDevMode ? [{ debugName: "canSync" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "coverage", label: "Project coverage" },
      { key: "devices", label: "Devices" },
      { key: "explorer", label: "Field data", count: this.fields.data()?.length ?? null }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  coverage = viewChild(
    CoverageTab,
    ...ngDevMode ? [{ debugName: "coverage" }] : (
      /* istanbul ignore next */
      []
    )
  );
  syncOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "syncOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  syncing = signal(
    false,
    ...ngDevMode ? [{ debugName: "syncing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  syncError = signal(
    null,
    ...ngDevMode ? [{ debugName: "syncError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  today = isoDate(/* @__PURE__ */ new Date());
  syncStart = daysAgo(30);
  syncEnd = this.today;
  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => {
        if (!pid)
          return;
        this.fields.load(this.api.get("/fields", { project_id: pid, limit: 500 }).pipe(map((r) => r.items)));
      });
    });
    effect(() => {
      const t = this.tab();
      const f = this.fieldId();
      untracked(() => this.router.navigate([], {
        queryParams: { tab: t === "coverage" ? null : t, field: t === "explorer" && f ? f : null },
        replaceUrl: true
      }));
    });
  }
  openField(id) {
    this.fieldId.set(id);
    this.tab.set("explorer");
  }
  syncProject() {
    const pid = this.ctx.currentId();
    if (!pid)
      return;
    this.syncing.set(true);
    this.syncError.set(null);
    this.api.post(`/projects/${pid}/supporting/sync`, {
      start: this.syncStart,
      end: this.syncEnd
    }).subscribe({
      next: (r) => {
        this.syncing.set(false);
        this.syncOpen.set(false);
        this.toast.success("Project synced", `${r.fields} fields \xB7 ${r.observations_written} new daily readings stored.`);
        this.coverage()?.reload();
      },
      error: (e) => {
        this.syncing.set(false);
        this.syncError.set(e.message);
      }
    });
  }
  static \u0275fac = function SupportingPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SupportingPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SupportingPage, selectors: [["vc-supporting-page"]], viewQuery: function SupportingPage_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.coverage, CoverageTab, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, decls: 28, vars: 11, consts: [["title", "Supporting data", "eyebrow", "Intelligence", "subtitle", "Weather and soil readings that support measurement \u2014 rainfall, temperature, soil moisture and more. For every field and every day, the platform uses the best source available."], ["actions", "", 1, "btn", "btn-primary"], ["aria-label", "How data sources are chosen", 1, "tiers", "card"], [1, "card"], ["title", "Sync supporting data", "width", "480px", 3, "openChange", "open", "subtitle"], [1, "stack", 2, "--gap", "14px"], [1, "muted"], [1, "form-grid"], [1, "field"], ["for", "ss"], ["id", "ss", "type", "date", 1, "input", 3, "ngModelChange", "ngModel", "max"], ["for", "se"], ["id", "se", "type", "date", 1, "input", 3, "ngModelChange", "ngModel", "max"], [1, "small", "subtle"], ["title", "Sync didn't run", 3, "message"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "refresh"], [1, "step"], [1, "sh"], [1, "badge-n"], [1, "st"], ["aria-hidden", "true", 1, "arrow"], ["name", "arrow-right", 3, "size"], ["icon", "briefcase", "title", "Choose a project", "text", "Supporting data is shown per project. Pick one in the top bar."], [3, "activeChange", "tabs", "active"], [3, "projectId"], [3, "fields"], [3, "fields", "fieldId"], [3, "openField", "projectId"], [3, "fieldIdChange", "fields", "fieldId"]], template: function SupportingPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, SupportingPage_Conditional_1_Template, 3, 0, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "section", 2);
      \u0275\u0275repeaterCreate(3, SupportingPage_For_4_Template, 12, 7, null, null, _forTrack04);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, SupportingPage_Conditional_5_Template, 2, 0, "div", 3)(6, SupportingPage_Conditional_6_Template, 4, 3);
      \u0275\u0275elementStart(7, "vc-modal", 4);
      \u0275\u0275twoWayListener("openChange", function SupportingPage_Template_vc_modal_openChange_7_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.syncOpen, $event) || (ctx.syncOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(8, "div", 5)(9, "p", 6);
      \u0275\u0275text(10, "Fetches daily readings for every enrolled field from the best available source, tier by tier. Days already stored are skipped, so it is safe to run again.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "label", 9);
      \u0275\u0275text(14, "From");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "input", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function SupportingPage_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.syncStart, $event) || (ctx.syncStart = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 8)(17, "label", 11);
      \u0275\u0275text(18, "To");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "input", 12);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function SupportingPage_Template_input_ngModelChange_19_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.syncEnd, $event) || (ctx.syncEnd = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(20, "span", 13);
      \u0275\u0275text(21, "At most 400 days at a time. Future dates can't be synced.");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(22, SupportingPage_Conditional_22_Template, 1, 1, "vc-error", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(23, 15);
      \u0275\u0275elementStart(24, "button", 16);
      \u0275\u0275listener("click", function SupportingPage_Template_button_click_24_listener() {
        return ctx.syncOpen.set(false);
      });
      \u0275\u0275text(25, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "button", 17);
      \u0275\u0275listener("click", function SupportingPage_Template_button_click_26_listener() {
        return ctx.syncProject();
      });
      \u0275\u0275text(27);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.canSync() && ctx.ctx.currentId() ? 1 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.tierSteps);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.ctx.currentId() ? 5 : 6);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.syncOpen);
      \u0275\u0275property("subtitle", (ctx.ctx.current()?.code ?? "") + " \xB7 all enrolled fields");
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.syncStart);
      \u0275\u0275property("max", ctx.syncEnd);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.syncEnd);
      \u0275\u0275property("max", ctx.today);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.syncError() ? 22 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.syncing());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.syncing() ? "Syncing\u2026" : "Start sync");
    }
  }, dependencies: [Icon, PageHeader, Empty, ErrorBox, Modal, Tabs, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, CoverageTab, DevicesTab, ExplorerTab], styles: ["\n.tiers[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  gap: 0;\n  padding: 14px 16px;\n  margin-bottom: 24px;\n  overflow-x: auto;\n}\n.step[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 170px;\n  padding: 4px 8px;\n}\n.sh[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.badge-n[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 26px;\n  height: 26px;\n  border-radius: 8px;\n  color: #fff;\n  font: 600 13px/1 var(--%NS%mono);\n}\n.st[_ngcontent-%COMP%] {\n  font-size: 10.5px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n}\n.sh[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n}\n.step[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  line-height: 1.45;\n}\n.arrow[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  padding: 0 4px;\n  color: var(--%NS%stone-400);\n  flex: none;\n}\n.arrow[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 10.5px;\n  white-space: nowrap;\n}\n/*# sourceMappingURL=supporting.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SupportingPage, [{
    type: Component,
    args: [{ selector: "vc-supporting-page", imports: [...KIT, FormsModule, CoverageTab, DevicesTab, ExplorerTab], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Supporting data" eyebrow="Intelligence"
      subtitle="Weather and soil readings that support measurement \u2014 rainfall, temperature, soil moisture and more. For every field and every day, the platform uses the best source available.">
      @if (canSync() && ctx.currentId()) {
        <button actions class="btn btn-primary" (click)="syncOpen.set(true)"><vc-icon name="refresh" />Sync project</button>
      }
    </vc-page-header>

    <section class="tiers card" aria-label="How data sources are chosen">
      @for (t of tierSteps; track t.tier; let last = $last) {
        <div class="step">
          <div class="sh"><span class="badge-n" [style.background]="t.color">{{ t.tier || '\u2013' }}</span>
            <div><div class="st">{{ t.tier ? t.short : 'Fallback' }}</div><strong>{{ t.label }}</strong></div></div>
          <p>{{ t.explain }}</p>
        </div>
        @if (!last) { <div class="arrow" aria-hidden="true"><vc-icon name="arrow-right" [size]="16" /><span>if missing</span></div> }
      }
    </section>

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Supporting data is shown per project. Pick one in the top bar." /></div>
    } @else {
      <vc-tabs [tabs]="tabs()" [(active)]="tab" />
      @switch (tab()) {
        @case ('coverage') { <vc-coverage-tab [projectId]="ctx.currentId()!" (openField)="openField($event)" /> }
        @case ('devices') { <vc-devices-tab [fields]="fields.data() ?? []" /> }
        @case ('explorer') { <vc-explorer-tab [fields]="fields.data() ?? []" [(fieldId)]="fieldId" /> }
      }
    }

    <vc-modal [(open)]="syncOpen" title="Sync supporting data" [subtitle]="(ctx.current()?.code ?? '') + ' \xB7 all enrolled fields'" width="480px">
      <div class="stack" style="--gap:14px">
        <p class="muted">Fetches daily readings for every enrolled field from the best available source, tier by tier. Days already stored are skipped, so it is safe to run again.</p>
        <div class="form-grid">
          <div class="field"><label for="ss">From</label><input id="ss" type="date" class="input" [(ngModel)]="syncStart" [max]="syncEnd" /></div>
          <div class="field"><label for="se">To</label><input id="se" type="date" class="input" [(ngModel)]="syncEnd" [max]="today" /></div>
        </div>
        <span class="small subtle">At most 400 days at a time. Future dates can't be synced.</span>
        @if (syncError()) { <vc-error title="Sync didn't run" [message]="syncError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="syncOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="syncing()" (click)="syncProject()">{{ syncing() ? 'Syncing\u2026' : 'Start sync' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;e48456be357e5bbb;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\supporting\\supporting.page.ts */\n.tiers {\n  display: flex;\n  align-items: stretch;\n  gap: 0;\n  padding: 14px 16px;\n  margin-bottom: 24px;\n  overflow-x: auto;\n}\n.step {\n  flex: 1;\n  min-width: 170px;\n  padding: 4px 8px;\n}\n.sh {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.badge-n {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 26px;\n  height: 26px;\n  border-radius: 8px;\n  color: #fff;\n  font: 600 13px/1 var(--mono);\n}\n.st {\n  font-size: 10.5px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: var(--text-3);\n}\n.sh strong {\n  font-size: 13.5px;\n}\n.step p {\n  margin-top: 6px;\n  font-size: 12.5px;\n  color: var(--text-2);\n  line-height: 1.45;\n}\n.arrow {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  padding: 0 4px;\n  color: var(--stone-400);\n  flex: none;\n}\n.arrow span {\n  font-size: 10.5px;\n  white-space: nowrap;\n}\n/*# sourceMappingURL=supporting.page.css.map */\n"] }]
  }], () => [], { coverage: [{ type: ViewChild, args: [forwardRef(() => CoverageTab), { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SupportingPage, { className: "SupportingPage", filePath: "src/app/features/supporting/supporting.page.ts", lineNumber: 77 });
})();

// src/app/features/supporting/supporting.routes.ts
var supporting_routes_default = [{ path: "", component: SupportingPage, title: "Supporting data \xB7 Varsapradaya Carbon" }];
export {
  supporting_routes_default as default
};
//# debugId=6c3a00ff-a451-551e-b276-9beb767b9ac2
//# sourceMappingURL=chunk-J3JCX4BO.js.map
