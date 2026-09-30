import {
  Remote,
  daysAgo,
  isSimulated,
  isoDate
} from "./chunk-ZC6I5JPU.js";
import {
  Chart
} from "./chunk-RHCCRMNI.js";
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
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
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
  Progress,
  Tabs
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
  computed,
  effect,
  inject,
  input,
  map,
  model,
  setClassMetadata,
  signal,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/satellite/indices.tab.ts
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.key;
var _forTrack2 = ($index, $item) => $item.field_id;
function IndicesTab_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function IndicesTab_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "vc-error", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.alerts.error().message);
  }
}
function IndicesTab_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 6);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("text", "No field's latest clear pass is more than " + (ctx_r0.alerts.data()?.threshold_pct ?? 25) + "% below its 60-day median.");
  }
}
function IndicesTab_Conditional_9_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 22);
    \u0275\u0275listener("click", function IndicesTab_Conditional_9_For_5_Template_li_click_0_listener() {
      const a_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.fieldId.set(a_r3.field_id));
    });
    \u0275\u0275elementStart(1, "div", 23);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "num");
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 24)(7, "div", 25)(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 26);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 27);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "num");
    \u0275\u0275pipe(16, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(17, "vc-icon", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", a_r3.field_id === ctx_r0.fieldId());
    \u0275\u0275advance();
    \u0275\u0275classProp("big", a_r3.drop_pct >= 50);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u2212", \u0275\u0275pipeBind2(3, 9, a_r3.drop_pct, 0));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(a_r3.field_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 12, a_r3.latest_date));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("NDVI ", \u0275\u0275pipeBind2(15, 14, a_r3.latest_ndvi, 2), " now vs ", \u0275\u0275pipeBind2(16, 17, a_r3.median_60d, 2), " median");
  }
}
function IndicesTab_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 19);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 20);
    \u0275\u0275repeaterCreate(4, IndicesTab_Conditional_9_For_5_Template, 18, 20, "li", 21, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Fields whose latest clear NDVI fell more than ", \u0275\u0275pipeBind2(2, 1, ctx_r0.alerts.data().threshold_pct, 0), "% below their 60-day median. Often harvest \u2014 sometimes damage or a change of land use.");
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.alerts.data().alerts);
  }
}
function IndicesTab_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r4 = ctx.$implicit;
    \u0275\u0275property("value", f_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r4.code, " \xB7 ", f_r4.name);
  }
}
function IndicesTab_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function IndicesTab_For_20_Template_button_click_0_listener() {
      const i_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.index.set(i_r6.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const i_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r0.index() === i_r6.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(i_r6.label);
  }
}
function IndicesTab_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function IndicesTab_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.refresh());
    });
    \u0275\u0275element(1, "vc-icon", 31);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r0.refreshing());
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.refreshing() ? "Fetching\u2026" : "Refresh");
  }
}
function IndicesTab_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 16);
  }
}
function IndicesTab_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function IndicesTab_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "vc-error", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.series.error().message);
  }
}
function IndicesTab_Conditional_25_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function IndicesTab_Conditional_25_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.refresh());
    });
    \u0275\u0275element(1, "vc-icon", 35);
    \u0275\u0275text(2, "Fetch passes");
    \u0275\u0275elementEnd();
  }
}
function IndicesTab_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 17);
    \u0275\u0275conditionalCreate(1, IndicesTab_Conditional_25_Conditional_1_Template, 3, 0, "button", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canRefresh() ? 1 : -1);
  }
}
function IndicesTab_Conditional_26_For_36_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 49);
    \u0275\u0275text(1, "Simulated");
    \u0275\u0275elementEnd();
  }
}
function IndicesTab_Conditional_26_For_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "code", 48);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, IndicesTab_Conditional_26_For_36_Conditional_2_Template, 2, 0, "span", 49);
  }
  if (rf & 2) {
    const s_r9 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r9);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.sim(s_r9) ? 2 : -1);
  }
}
function IndicesTab_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 36)(2, "div")(3, "span", 37);
    \u0275\u0275text(4, "Clear passes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong", 38);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div")(8, "span", 37);
    \u0275\u0275text(9, "Cloudy, excluded");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "strong", 38);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "span", 37);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "strong", 38);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "num");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(19, "div", 39)(20, "vc-dc", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "vc-chart", 40);
    \u0275\u0275elementStart(22, "div", 41)(23, "span", 42);
    \u0275\u0275element(24, "i", 43);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 42);
    \u0275\u0275element(28, "i", 44);
    \u0275\u0275text(29, "Cloudy pass \u2014 not used in any check");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span", 45);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 46)(33, "span", 47);
    \u0275\u0275text(34, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(35, IndicesTab_Conditional_26_For_36_Template, 3, 2, null, null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.clearCount());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.series.data().cloudy_excluded);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Latest \xB7 ", \u0275\u0275pipeBind1(15, 7, ctx_r0.latest()?.date));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 9, ctx_r0.latest()?.value, 3));
    \u0275\u0275advance(4);
    \u0275\u0275property("option", ctx_r0.chart());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Clear pass (cloud \u2264 ", \u0275\u0275pipeBind2(26, 12, ctx_r0.series.data().cloud_limit_pct, 0), "%)");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.indexMeta().hint);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.sources());
  }
}
var INDICES = [
  { key: "ndvi", label: "NDVI", long: "Vegetation (NDVI)", hint: "Greenness of the canopy. Bare soil \u2248 0.1, dense crop \u2248 0.8." },
  { key: "ndmi", label: "NDMI", long: "Moisture (NDMI)", hint: "Water in leaves and surface. Higher is wetter." }
];
var IndicesTab = class _IndicesTab {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
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
  index = signal(
    "ndvi",
    ...ngDevMode ? [{ debugName: "index" }] : (
      /* istanbul ignore next */
      []
    )
  );
  indices = INDICES;
  refreshing = signal(
    false,
    ...ngDevMode ? [{ debugName: "refreshing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canRefresh = computed(
    () => this.auth.can("data.sync"),
    ...ngDevMode ? [{ debugName: "canRefresh" }] : (
      /* istanbul ignore next */
      []
    )
  );
  alerts = new Remote();
  series = new Remote();
  indexMeta = computed(
    () => INDICES.find((i) => i.key === this.index()),
    ...ngDevMode ? [{ debugName: "indexMeta" }] : (
      /* istanbul ignore next */
      []
    )
  );
  clear = computed(
    () => (this.series.data()?.points ?? []).filter((p) => !p.excluded),
    ...ngDevMode ? [{ debugName: "clear" }] : (
      /* istanbul ignore next */
      []
    )
  );
  clearCount = computed(
    () => this.clear().length,
    ...ngDevMode ? [{ debugName: "clearCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  latest = computed(
    () => this.clear().at(-1) ?? null,
    ...ngDevMode ? [{ debugName: "latest" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sources = computed(
    () => [...new Set((this.series.data()?.points ?? []).map((p) => p.source))],
    ...ngDevMode ? [{ debugName: "sources" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sim = isSimulated;
  chart = computed(
    () => {
      const pts = this.series.data()?.points ?? [];
      const name = this.indexMeta().label;
      const byDate = new Map(pts.map((p) => [p.date, p]));
      return {
        grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
        legend: { show: false },
        tooltip: {
          trigger: "item",
          formatter: (p) => {
            const d = byDate.get(p.value[0]);
            if (!d)
              return "";
            return `<div style="font-weight:600">${d.date}</div><div style="font-size:15px;font-weight:600">${name} ${d.value.toFixed(3)}</div><div style="color:#58625b">Cloud cover ${d.cloud_pct.toFixed(0)}%${d.excluded ? ' \xB7 <b style="color:#737c76">excluded</b>' : ""}</div>`;
          }
        },
        xAxis: { type: "time", axisLabel: { formatter: "{MMM} {yy}" } },
        yAxis: { type: "value", scale: true },
        series: [
          {
            type: "line",
            name,
            smooth: 0.25,
            symbol: "circle",
            symbolSize: 5,
            lineStyle: { width: 2, color: "#2f7249" },
            itemStyle: { color: "#2f7249" },
            areaStyle: { color: "rgba(47,114,73,0.08)" },
            data: pts.filter((p) => !p.excluded).map((p) => [p.date, p.value])
          },
          {
            type: "scatter",
            name: "Cloudy",
            symbolSize: 7,
            itemStyle: { color: "#dfe3df", borderColor: "#9aa29c", borderWidth: 1 },
            data: pts.filter((p) => p.excluded).map((p) => [p.date, p.value])
          }
        ]
      };
    },
    ...ngDevMode ? [{ debugName: "chart" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const pid = this.projectId();
      untracked(() => this.alerts.load(this.api.get(`/projects/${pid}/satellite/alerts`)));
    });
    effect(() => {
      const id = this.fieldId();
      const idx = this.index();
      untracked(() => id ? this.loadSeries(id, idx) : this.series.reset());
    });
  }
  loadSeries(id, idx, keep = false) {
    this.series.load(this.api.get(`/fields/${id}/satellite`, { index: idx, include_cloudy: true, start: daysAgo(400) }), keep);
  }
  refresh() {
    const id = this.fieldId();
    if (!id)
      return;
    this.refreshing.set(true);
    this.api.post(`/fields/${id}/satellite/refresh`, {
      start: daysAgo(365),
      end: isoDate(/* @__PURE__ */ new Date())
    }).subscribe({
      next: (r) => {
        this.refreshing.set(false);
        const n = Object.values(r.written ?? {}).reduce((a, b) => a + b, 0);
        this.toast.success("Satellite passes fetched", n ? `${n} new index values from ${r.provider}.` : "Already up to date.");
        this.loadSeries(id, this.index(), true);
        this.alerts.load(this.api.get(`/projects/${this.projectId()}/satellite/alerts`), true);
      },
      error: (e) => {
        this.refreshing.set(false);
        this.toast.apiError(e, "Couldn't fetch satellite data");
      }
    });
  }
  static \u0275fac = function IndicesTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IndicesTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IndicesTab, selectors: [["vc-indices-tab"]], inputs: { projectId: [1, "projectId"], fields: [1, "fields"], fieldId: [1, "fieldId"] }, outputs: { fieldId: "fieldIdChange" }, decls: 27, vars: 4, consts: [[1, "grid", "split"], [1, "card", "alerts"], [1, "card-head"], ["cls", "OBSERVED"], [3, "rows"], [1, "card-body"], ["icon", "check-circle", "title", "No sudden vegetation drops", 3, "text"], [1, "card"], [1, "card-head", "wrap"], [1, "ct"], ["aria-label", "Field", 1, "input", "fsel", 3, "ngModelChange", "ngModel"], ["value", "", "disabled", ""], [3, "value"], [1, "seg"], ["type", "button", 3, "on"], [1, "btn", "btn-secondary", "btn-sm", 3, "disabled"], ["icon", "satellite", "title", "Pick a field", "text", "Choose a field, or an alert on the left, to see its satellite history."], ["icon", "satellite", "title", "No satellite passes stored", "text", "Refresh to fetch the last 12 months of passes for this field."], ["title", "Couldn't load alerts", 3, "message"], [1, "lead", "small", "muted"], [1, "alist"], [3, "on"], [3, "click"], [1, "drop", "num"], [1, "am"], [1, "row", 2, "--gap", "8px"], [1, "subtle", "small"], [1, "small", "muted", "num"], ["name", "chevron-right", 1, "subtle"], ["type", "button", 3, "click"], [1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], ["name", "refresh", 3, "size"], ["title", "Couldn't load satellite data", 3, "message"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], ["name", "refresh"], [1, "meta"], [1, "k"], [1, "num"], [1, "spacer"], ["height", "300px", 3, "option"], [1, "legend"], [1, "li"], [1, "ln"], [1, "cl"], [1, "small", "subtle"], [1, "card-foot", "left"], [1, "small", "muted"], [1, "small"], [1, "sim"]], template: function IndicesTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "h3");
      \u0275\u0275text(4, "Vegetation alerts");
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "vc-dc", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(6, IndicesTab_Conditional_6_Template, 1, 1, "vc-loading", 4)(7, IndicesTab_Conditional_7_Template, 2, 1, "div", 5)(8, IndicesTab_Conditional_8_Template, 1, 1, "vc-empty", 6)(9, IndicesTab_Conditional_9_Template, 6, 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "section", 7)(11, "div", 8)(12, "div", 9)(13, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function IndicesTab_Template_select_ngModelChange_13_listener($event) {
        return ctx.fieldId.set($event);
      });
      \u0275\u0275elementStart(14, "option", 11);
      \u0275\u0275text(15, "Choose a field\u2026");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(16, IndicesTab_For_17_Template, 2, 3, "option", 12, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 13);
      \u0275\u0275repeaterCreate(19, IndicesTab_For_20_Template, 2, 3, "button", 14, _forTrack1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(21, IndicesTab_Conditional_21_Template, 3, 3, "button", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(22, IndicesTab_Conditional_22_Template, 1, 0, "vc-empty", 16)(23, IndicesTab_Conditional_23_Template, 1, 1, "vc-loading", 4)(24, IndicesTab_Conditional_24_Template, 2, 1, "div", 5)(25, IndicesTab_Conditional_25_Template, 2, 1, "vc-empty", 17)(26, IndicesTab_Conditional_26_Template, 37, 15);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.alerts.loading() ? 6 : ctx.alerts.error() ? 7 : !ctx.alerts.data()?.alerts?.length ? 8 : 9);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.fieldId());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.fields());
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.indices);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.fieldId() && ctx.canRefresh() ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.fieldId() ? 22 : ctx.series.loading() ? 23 : ctx.series.error() ? 24 : !ctx.series.data()?.points?.length ? 25 : 26);
    }
  }, dependencies: [Icon, DataClass, Empty, Loading, ErrorBox, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, NgControlStatus, NgModel, Chart, NumPipe, DayPipe], styles: ["\n.split[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .split[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.lead[_ngcontent-%COMP%] {\n  padding: 12px 20px 4px;\n}\n.alist[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 6px 0 8px;\n  max-height: 460px;\n  overflow: auto;\n}\n.alist[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px 20px;\n  cursor: pointer;\n  border-left: 3px solid transparent;\n}\n.alist[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-50);\n}\n.alist[_ngcontent-%COMP%]   li.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  border-left-color: var(--%NS%forest-500);\n}\n.drop[_ngcontent-%COMP%] {\n  flex: none;\n  width: 62px;\n  font-size: 20px;\n  font-weight: 600;\n  color: var(--%NS%amber-600);\n  letter-spacing: -0.02em;\n}\n.drop.big[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.drop[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  margin-left: 1px;\n}\n.am[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.card-head.wrap[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n}\n.ct[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 220px;\n}\n.fsel[_ngcontent-%COMP%] {\n  max-width: 360px;\n  height: 34px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: inline-flex;\n  background: var(--%NS%sand-100);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 12.5px var(--%NS%font);\n  padding: 5px 12px;\n  border-radius: 6px;\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%stone-900);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 28px;\n  align-items: center;\n  margin-bottom: 10px;\n  flex-wrap: wrap;\n}\n.meta[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:not(.spacer) {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.meta[_ngcontent-%COMP%]   .k[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n}\n.legend[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 18px;\n  margin-top: 8px;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n  align-items: center;\n}\n.li[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.li[_ngcontent-%COMP%]   i.ln[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 3px;\n  border-radius: 2px;\n  background: #2f7249;\n}\n.li[_ngcontent-%COMP%]   i.cl[_ngcontent-%COMP%] {\n  width: 9px;\n  height: 9px;\n  border-radius: 50%;\n  background: #dfe3df;\n  border: 1px solid #9aa29c;\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  gap: 10px;\n}\n.sim[_ngcontent-%COMP%] {\n  font: 600 10px/1 var(--%NS%mono);\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  padding: 4px 6px;\n  border-radius: 4px;\n  background: var(--%NS%violet-100);\n  color: var(--%NS%violet-600);\n}\n/*# sourceMappingURL=indices.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IndicesTab, [{
    type: Component,
    args: [{ selector: "vc-indices-tab", imports: [...KIT, FormsModule, Chart, NumPipe, DayPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="grid split">
      <section class="card alerts">
        <div class="card-head">
          <h3>Vegetation alerts</h3>
          <vc-dc cls="OBSERVED" />
        </div>
        @if (alerts.loading()) {
          <vc-loading [rows]="5" />
        } @else if (alerts.error()) {
          <div class="card-body"><vc-error title="Couldn't load alerts" [message]="alerts.error()!.message" /></div>
        } @else if (!alerts.data()?.alerts?.length) {
          <vc-empty icon="check-circle" title="No sudden vegetation drops"
            [text]="'No field\\'s latest clear pass is more than ' + (alerts.data()?.threshold_pct ?? 25) + '% below its 60-day median.'" />
        } @else {
          <p class="lead small muted">Fields whose latest clear NDVI fell more than {{ alerts.data()!.threshold_pct | num: 0 }}% below their 60-day median. Often harvest \u2014 sometimes damage or a change of land use.</p>
          <ul class="alist">
            @for (a of alerts.data()!.alerts; track a.field_id) {
              <li [class.on]="a.field_id === fieldId()" (click)="fieldId.set(a.field_id)">
                <div class="drop num" [class.big]="a.drop_pct >= 50">\u2212{{ a.drop_pct | num: 0 }}<span>%</span></div>
                <div class="am">
                  <div class="row" style="--gap:8px"><strong>{{ a.field_code }}</strong><span class="subtle small">{{ a.latest_date | day }}</span></div>
                  <div class="small muted num">NDVI {{ a.latest_ndvi | num: 2 }} now vs {{ a.median_60d | num: 2 }} median</div>
                </div>
                <vc-icon name="chevron-right" class="subtle" />
              </li>
            }
          </ul>
        }
      </section>

      <section class="card">
        <div class="card-head wrap">
          <div class="ct">
            <select class="input fsel" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)" aria-label="Field">
              <option value="" disabled>Choose a field\u2026</option>
              @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} \xB7 {{ f.name }}</option> }
            </select>
          </div>
          <div class="seg">
            @for (i of indices; track i.key) { <button type="button" [class.on]="index() === i.key" (click)="index.set(i.key)">{{ i.label }}</button> }
          </div>
          @if (fieldId() && canRefresh()) {
            <button class="btn btn-secondary btn-sm" [disabled]="refreshing()" (click)="refresh()"><vc-icon name="refresh" [size]="14" />{{ refreshing() ? 'Fetching\u2026' : 'Refresh' }}</button>
          }
        </div>
        @if (!fieldId()) {
          <vc-empty icon="satellite" title="Pick a field" text="Choose a field, or an alert on the left, to see its satellite history." />
        } @else if (series.loading()) {
          <vc-loading [rows]="6" />
        } @else if (series.error()) {
          <div class="card-body"><vc-error title="Couldn't load satellite data" [message]="series.error()!.message" /></div>
        } @else if (!series.data()?.points?.length) {
          <vc-empty icon="satellite" title="No satellite passes stored" text="Refresh to fetch the last 12 months of passes for this field.">
            @if (canRefresh()) { <button class="btn btn-primary" (click)="refresh()"><vc-icon name="refresh" />Fetch passes</button> }
          </vc-empty>
        } @else {
          <div class="card-body">
            <div class="meta">
              <div><span class="k">Clear passes</span><strong class="num">{{ clearCount() }}</strong></div>
              <div><span class="k">Cloudy, excluded</span><strong class="num">{{ series.data()!.cloudy_excluded }}</strong></div>
              <div><span class="k">Latest \xB7 {{ latest()?.date | day }}</span><strong class="num">{{ latest()?.value | num: 3 }}</strong></div>
              <div class="spacer"></div>
              <vc-dc cls="OBSERVED" />
            </div>
            <vc-chart [option]="chart()" height="300px" />
            <div class="legend">
              <span class="li"><i class="ln"></i>Clear pass (cloud \u2264 {{ series.data()!.cloud_limit_pct | num: 0 }}%)</span>
              <span class="li"><i class="cl"></i>Cloudy pass \u2014 not used in any check</span>
              <span class="small subtle">{{ indexMeta().hint }}</span>
            </div>
          </div>
          <div class="card-foot left">
            <span class="small muted">Source</span>
            @for (s of sources(); track s) {
              <code class="small">{{ s }}</code>
              @if (sim(s)) { <span class="sim">Simulated</span> }
            }
          </div>
        }
      </section>
    </div>
  `, styles: ["/* angular:styles/component:scss;f0737cfefedd8358;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\satellite\\indices.tab.ts */\n.split {\n  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .split {\n    grid-template-columns: 1fr;\n  }\n}\n.lead {\n  padding: 12px 20px 4px;\n}\n.alist {\n  list-style: none;\n  margin: 0;\n  padding: 6px 0 8px;\n  max-height: 460px;\n  overflow: auto;\n}\n.alist li {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px 20px;\n  cursor: pointer;\n  border-left: 3px solid transparent;\n}\n.alist li:hover {\n  background: var(--sand-50);\n}\n.alist li.on {\n  background: var(--forest-50);\n  border-left-color: var(--forest-500);\n}\n.drop {\n  flex: none;\n  width: 62px;\n  font-size: 20px;\n  font-weight: 600;\n  color: var(--amber-600);\n  letter-spacing: -0.02em;\n}\n.drop.big {\n  color: var(--red-600);\n}\n.drop span {\n  font-size: 12px;\n  margin-left: 1px;\n}\n.am {\n  flex: 1;\n  min-width: 0;\n}\n.card-head.wrap {\n  flex-wrap: wrap;\n}\n.ct {\n  flex: 1;\n  min-width: 220px;\n}\n.fsel {\n  max-width: 360px;\n  height: 34px;\n}\n.seg {\n  display: inline-flex;\n  background: var(--sand-100);\n  border-radius: 8px;\n  padding: 3px;\n  gap: 2px;\n}\n.seg button {\n  border: 0;\n  background: none;\n  font: 500 12.5px var(--font);\n  padding: 5px 12px;\n  border-radius: 6px;\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--surface);\n  color: var(--stone-900);\n  box-shadow: var(--shadow-sm);\n}\n.meta {\n  display: flex;\n  gap: 28px;\n  align-items: center;\n  margin-bottom: 10px;\n  flex-wrap: wrap;\n}\n.meta > div:not(.spacer) {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.meta .k {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.meta strong {\n  font-size: 18px;\n  font-weight: 600;\n}\n.legend {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 18px;\n  margin-top: 8px;\n  font-size: 12.5px;\n  color: var(--stone-700);\n  align-items: center;\n}\n.li {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.li i.ln {\n  width: 14px;\n  height: 3px;\n  border-radius: 2px;\n  background: #2f7249;\n}\n.li i.cl {\n  width: 9px;\n  height: 9px;\n  border-radius: 50%;\n  background: #dfe3df;\n  border: 1px solid #9aa29c;\n}\n.card-foot.left {\n  justify-content: flex-start;\n  gap: 10px;\n}\n.sim {\n  font: 600 10px/1 var(--mono);\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  padding: 4px 6px;\n  border-radius: 4px;\n  background: var(--violet-100);\n  color: var(--violet-600);\n}\n/*# sourceMappingURL=indices.tab.css.map */\n"] }]
  }], () => [], { projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }], fields: [{ type: Input, args: [{ isSignal: true, alias: "fields", required: false }] }], fieldId: [{ type: Input, args: [{ isSignal: true, alias: "fieldId", required: false }] }, { type: Output, args: ["fieldIdChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IndicesTab, { className: "IndicesTab", filePath: "src/app/features/satellite/indices.tab.ts", lineNumber: 138 });
})();

// src/app/features/satellite/verification.tab.ts
var _forTrack02 = ($index, $item) => $item.key;
var _forTrack12 = ($index, $item) => $item.id;
function VerificationTab_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function VerificationTab_For_7_Template_button_click_0_listener() {
      const o_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.filter.set(ctx_r2.filter() === o_r2.key ? "" : o_r2.key));
    });
    \u0275\u0275elementStart(1, "span", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong", 25);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 26);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const o_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap("t-" + o_r2.key);
    \u0275\u0275classProp("on", ctx_r2.filter() === o_r2.key);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(o_r2.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.count(o_r2.key));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(o_r2.hint);
  }
}
function VerificationTab_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1, "Check a season");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 27);
    \u0275\u0275listener("click", function VerificationTab_Conditional_9_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.runOpen.set(true));
    });
    \u0275\u0275element(3, "vc-icon", 28);
    \u0275\u0275text(4, "Run checks");
    \u0275\u0275elementEnd();
  }
}
function VerificationTab_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1, "Last run");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "strong", 29);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "ago");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.lastRun() ? \u0275\u0275pipeBind1(4, 1, ctx_r2.lastRun()) : "Never");
  }
}
function VerificationTab_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 6);
  }
}
function VerificationTab_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "vc-error", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r2.list.error().message);
  }
}
function VerificationTab_Conditional_14_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function VerificationTab_Conditional_14_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.runOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 28);
    \u0275\u0275text(2, "Run checks");
    \u0275\u0275elementEnd();
  }
}
function VerificationTab_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 7);
    \u0275\u0275conditionalCreate(1, VerificationTab_Conditional_14_Conditional_1_Template, 3, 0, "button", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("title", ctx_r2.filter() ? "Nothing with this outcome" : "No practice checks yet");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canRun() && !ctx_r2.filter() ? 1 : -1);
  }
}
function VerificationTab_Conditional_15_For_16_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 42);
    \u0275\u0275element(1, "vc-icon", 49);
    \u0275\u0275text(2, "Needs a person to review");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
  }
}
function VerificationTab_Conditional_15_For_16_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 43);
    \u0275\u0275text(1, "Not enough clear passes");
    \u0275\u0275elementEnd();
  }
}
function VerificationTab_Conditional_15_For_16_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(w_r6);
  }
}
function VerificationTab_Conditional_15_For_16_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 48)(1, "span");
    \u0275\u0275text(2, "Test");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "code");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(d_r7.evidence["rule"]);
  }
}
function VerificationTab_Conditional_15_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 37)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "div", 38)(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 39);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "td")(11, "div", 40);
    \u0275\u0275element(12, "vc-badge", 41);
    \u0275\u0275conditionalCreate(13, VerificationTab_Conditional_15_For_16_Conditional_13_Template, 3, 1, "span", 42)(14, VerificationTab_Conditional_15_For_16_Conditional_14_Template, 2, 0, "span", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td")(16, "div", 44);
    \u0275\u0275element(17, "vc-progress", 45);
    \u0275\u0275elementStart(18, "span", 46);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "td", 47);
    \u0275\u0275repeaterCreate(21, VerificationTab_Conditional_15_For_16_For_22_Template, 2, 1, "p", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275conditionalCreate(23, VerificationTab_Conditional_15_For_16_Conditional_23_Template, 5, 1, "p", 48);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("review", d_r7.outcome === "mismatch");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.fieldCode(d_r7.field_id));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.practiceName(d_r7.practice_code));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", d_r7.practice_record_id ? "Reported" : "Not reported", " \xB7 ", ctx_r2.season(d_r7.season));
    \u0275\u0275advance(3);
    \u0275\u0275property("status", d_r7.outcome);
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r7.outcome === "mismatch" ? 13 : d_r7.outcome === "inconclusive" ? 14 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", d_r7.confidence)("max", 1)("tone", d_r7.confidence >= 0.75 ? "ok" : "warn");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", (d_r7.confidence * 100).toFixed(0), "%");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.words(d_r7));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(d_r7.evidence["rule"] ? 23 : -1);
  }
}
function VerificationTab_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "table", 33)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Practice \xB7 season");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Outcome");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Confidence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "What the imagery shows");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, VerificationTab_Conditional_15_For_16_Template, 24, 13, "tr", 34, _forTrack12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 35);
    \u0275\u0275element(18, "vc-dc", 36);
    \u0275\u0275elementStart(19, "span", 18);
    \u0275\u0275text(20, "Worked out from OBSERVED satellite indices. Latest check per field and practice.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx_r2.rows());
  }
}
function VerificationTab_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11)(2, "label", 50);
    \u0275\u0275text(3, "Fallow starts");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 51);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function VerificationTab_Conditional_30_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.fallowStart, $event) || (ctx_r2.fallowStart = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 11)(6, "label", 52);
    \u0275\u0275text(7, "Fallow ends");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 53);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function VerificationTab_Conditional_30_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.fallowEnd, $event) || (ctx_r2.fallowEnd = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fallowStart);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.fallowEnd);
    \u0275\u0275control();
  }
}
function VerificationTab_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 19);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r2.runError());
  }
}
var PRACTICE = {
  cover_crop: "Cover crop",
  residue_retention: "Residue retention",
  awd_irrigation: "Alternate wetting & drying",
  zero_tillage: "Zero tillage",
  reduced_tillage: "Reduced tillage"
};
function fmtD(iso) {
  const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function evidenceWords(d) {
  const e = d.evidence ?? {};
  const out = [];
  if (e["note"])
    out.push(String(e["note"]));
  else if (e["unreported"])
    out.push("Not in the practice records \u2014 the satellite suggests it happened anyway.");
  if (Array.isArray(e["window"])) {
    out.push(`${e["clear_observations"] ?? 0} clear satellite passes between ${fmtD(e["window"][0])} and ${fmtD(e["window"][1])}.`);
  }
  if (typeof e["min_ndvi"] === "number")
    out.push(`Lowest greenness (NDVI) in the window was ${e["min_ndvi"].toFixed(2)}.`);
  if (Array.isArray(e["bare_soil_dips"])) {
    const n = e["bare_soil_dips"].length;
    out.push(n ? `${n} sharp drop${n > 1 ? "s" : ""} to bare soil \u2014 typical of ploughing (first on ${fmtD(e["bare_soil_dips"][0].date)}).` : "No sharp drop to bare soil, which is what untilled land looks like.");
  }
  if (typeof e["min_ndmi"] === "number")
    out.push(`Lowest surface moisture (NDMI) was ${e["min_ndmi"].toFixed(2)}.`);
  if (typeof e["amplitude"] === "number") {
    out.push(`Moisture swung by ${e["amplitude"].toFixed(2)} NDMI${typeof e["direction_changes"] === "number" ? ` with ${e["direction_changes"]} wet/dry turns` : ""}.`);
  }
  if (typeof e["median_ndvi"] === "number")
    out.push(`Median greenness (NDVI) was ${e["median_ndvi"].toFixed(2)}.`);
  if (e["reason"])
    out.push(String(e["reason"]));
  return out;
}
var VerificationTab = class _VerificationTab {
  api = inject(ApiService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  projectId = input.required(
    ...ngDevMode ? [{ debugName: "projectId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fields = input(
    [],
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  list = new Remote();
  filter = signal(
    "",
    ...ngDevMode ? [{ debugName: "filter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  canRun = computed(
    () => this.auth.can("data.sync", "calc.run"),
    ...ngDevMode ? [{ debugName: "canRun" }] : (
      /* istanbul ignore next */
      []
    )
  );
  outcomes = [
    { key: "confirmed", label: "Confirmed", hint: "Imagery agrees with the record" },
    { key: "mismatch", label: "Mismatch", hint: "Needs a person to review" },
    { key: "inconclusive", label: "Inconclusive", hint: "Too few clear passes" }
  ];
  fieldMap = computed(
    () => new Map(this.fields().map((f) => [f.id, f.code])),
    ...ngDevMode ? [{ debugName: "fieldMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => {
      const order = { mismatch: 0, inconclusive: 1, confirmed: 2 };
      return (this.list.data() ?? []).filter((d) => !this.filter() || d.outcome === this.filter()).sort((a, b) => order[a.outcome] - order[b.outcome] || this.fieldCode(a.field_id).localeCompare(this.fieldCode(b.field_id)));
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  lastRun = computed(
    () => (this.list.data() ?? []).map((d) => d.created_at).sort().at(-1) ?? null,
    ...ngDevMode ? [{ debugName: "lastRun" }] : (
      /* istanbul ignore next */
      []
    )
  );
  runOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "runOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  running = signal(
    false,
    ...ngDevMode ? [{ debugName: "running" }] : (
      /* istanbul ignore next */
      []
    )
  );
  runError = signal(
    null,
    ...ngDevMode ? [{ debugName: "runError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  seasonStart = daysAgo(180);
  seasonEnd = isoDate(/* @__PURE__ */ new Date());
  useFallow = false;
  fallowStart = daysAgo(90);
  fallowEnd = daysAgo(30);
  constructor() {
    effect(() => {
      const pid = this.projectId();
      untracked(() => this.list.load(this.api.get(`/projects/${pid}/practice-detection`)));
    });
  }
  count(o) {
    return (this.list.data() ?? []).filter((d) => d.outcome === o).length;
  }
  fieldCode(id) {
    return this.fieldMap().get(id) ?? id.slice(0, 8);
  }
  practiceName(c) {
    return PRACTICE[c] ?? c.replace(/_/g, " ");
  }
  words = evidenceWords;
  season(s) {
    const m = /^(\d{4})(\d{2})(\d{2})-(\d{4})(\d{2})(\d{2})$/.exec(s);
    return m ? `${fmtD(`${m[1]}-${m[2]}-${m[3]}`)} \u2013 ${fmtD(`${m[4]}-${m[5]}-${m[6]}`)}` : s;
  }
  run() {
    this.running.set(true);
    this.runError.set(null);
    const body = { season_start: this.seasonStart, season_end: this.seasonEnd };
    if (this.useFallow) {
      body["fallow_start"] = this.fallowStart;
      body["fallow_end"] = this.fallowEnd;
    }
    this.api.post(`/projects/${this.projectId()}/practice-detection/run`, body).subscribe({
      next: (r) => {
        this.running.set(false);
        this.runOpen.set(false);
        const mm = r.by_outcome?.["mismatch"] ?? 0;
        this.toast.success(`${r.detections} checks completed`, mm ? `${mm} mismatch${mm > 1 ? "es" : ""} need a person to review.` : "No mismatches found.");
        this.list.load(this.api.get(`/projects/${this.projectId()}/practice-detection`), true);
      },
      error: (e) => {
        this.running.set(false);
        this.runError.set(e.message);
      }
    });
  }
  static \u0275fac = function VerificationTab_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerificationTab)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerificationTab, selectors: [["vc-verification-tab"]], inputs: { projectId: [1, "projectId"], fields: [1, "fields"] }, decls: 39, vars: 10, consts: [["tone", "info", "icon", "shield-check"], [1, "stats"], ["type", "button", 1, "st", 3, "on", "class"], [1, "st", "run"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "satellite", "text", "Run checks for a season to compare reported cover crops, tillage, residue retention and water management with satellite imagery.", 3, "title"], ["title", "Run practice checks", "subtitle", "Compares every reported practice in the season with the satellite record", "width", "520px", 3, "openChange", "open"], [1, "stack", 2, "--gap", "14px"], [1, "form-grid"], [1, "field"], ["for", "s1"], ["id", "s1", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "s2"], ["id", "s2", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], [1, "checkbox"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "small", "muted"], ["title", "Checks didn't run", 3, "message"], ["footer", ""], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["type", "button", 1, "st", 3, "click"], [1, "lbl"], [1, "num"], [1, "hint"], [1, "btn", "btn-primary", 3, "click"], ["name", "play"], [1, "small"], ["title", "Couldn't load practice checks", 3, "message"], [1, "btn", "btn-primary"], [1, "table-wrap"], [1, "table"], [3, "review"], [1, "card-foot", "left"], ["cls", "DERIVED"], [1, "nowrap"], [1, "pr"], [1, "small", "subtle", "nowrap"], [1, "oc"], [3, "status"], [1, "nr"], [1, "small", "subtle"], [1, "conf"], [3, "value", "max", "tone"], [1, "num", "small"], [1, "ev"], [1, "rule"], ["name", "user", 3, "size"], ["for", "f1"], ["id", "f1", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "f2"], ["id", "f2", "type", "date", 1, "input", 3, "ngModelChange", "ngModel"]], template: function VerificationTab_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-callout", 0);
      \u0275\u0275text(1, " Satellite checks compare what farmers reported with what the imagery shows. They ");
      \u0275\u0275elementStart(2, "strong");
      \u0275\u0275text(3, "never change practice records");
      \u0275\u0275elementEnd();
      \u0275\u0275text(4, ". A mismatch or an inconclusive result is passed to a person to review with the farmer. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 1);
      \u0275\u0275repeaterCreate(6, VerificationTab_For_7_Template, 7, 7, "button", 2, _forTrack02);
      \u0275\u0275elementStart(8, "div", 3);
      \u0275\u0275conditionalCreate(9, VerificationTab_Conditional_9_Template, 5, 0)(10, VerificationTab_Conditional_10_Template, 5, 3);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "section", 4);
      \u0275\u0275conditionalCreate(12, VerificationTab_Conditional_12_Template, 1, 1, "vc-loading", 5)(13, VerificationTab_Conditional_13_Template, 2, 1, "div", 6)(14, VerificationTab_Conditional_14_Template, 2, 2, "vc-empty", 7)(15, VerificationTab_Conditional_15_Template, 21, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "vc-modal", 8);
      \u0275\u0275twoWayListener("openChange", function VerificationTab_Template_vc_modal_openChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.runOpen, $event) || (ctx.runOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(17, "div", 9)(18, "div", 10)(19, "div", 11)(20, "label", 12);
      \u0275\u0275text(21, "Season starts");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "input", 13);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function VerificationTab_Template_input_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.seasonStart, $event) || (ctx.seasonStart = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 11)(24, "label", 14);
      \u0275\u0275text(25, "Season ends");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "input", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function VerificationTab_Template_input_ngModelChange_26_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.seasonEnd, $event) || (ctx.seasonEnd = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(27, "label", 16)(28, "input", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function VerificationTab_Template_input_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.useFallow, $event) || (ctx.useFallow = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275text(29, "Also look for unreported cover crops in a fallow window");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(30, VerificationTab_Conditional_30_Template, 9, 2, "div", 10);
      \u0275\u0275elementStart(31, "p", 18);
      \u0275\u0275text(32, "Results are added alongside earlier checks. Practice records are not changed.");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(33, VerificationTab_Conditional_33_Template, 1, 1, "vc-error", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(34, 20);
      \u0275\u0275elementStart(35, "button", 21);
      \u0275\u0275listener("click", function VerificationTab_Template_button_click_35_listener() {
        return ctx.runOpen.set(false);
      });
      \u0275\u0275text(36, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "button", 22);
      \u0275\u0275listener("click", function VerificationTab_Template_button_click_37_listener() {
        return ctx.run();
      });
      \u0275\u0275text(38);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.outcomes);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.canRun() ? 9 : 10);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.list.loading() ? 12 : ctx.list.error() ? 13 : !ctx.rows().length ? 14 : 15);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.runOpen);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.seasonStart);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.seasonEnd);
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.useFallow);
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.useFallow ? 30 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.runError() ? 33 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.running());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.running() ? "Checking\u2026" : "Run checks");
    }
  }, dependencies: [Icon, Badge, DataClass, Empty, Loading, ErrorBox, Callout, Modal, Progress, FormsModule, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel, AgoPipe], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.stats[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n}\n@media (max-width: 980px) {\n  .stats[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.st[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  align-items: flex-start;\n  text-align: left;\n  padding: 14px 16px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  box-shadow: var(--%NS%shadow-sm);\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  border-top: 3px solid var(--%NS%stone-300);\n}\n.st.t-confirmed[_ngcontent-%COMP%] {\n  border-top-color: var(--%NS%forest-500);\n}\n.st.t-mismatch[_ngcontent-%COMP%] {\n  border-top-color: var(--%NS%red-600);\n}\n.st.t-inconclusive[_ngcontent-%COMP%] {\n  border-top-color: var(--%NS%stone-400);\n}\n.st.on[_ngcontent-%COMP%] {\n  box-shadow: var(--%NS%focus);\n}\n.st.run[_ngcontent-%COMP%] {\n  cursor: default;\n  border-top-color: var(--%NS%forest-700);\n  justify-content: space-between;\n}\n.lbl[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  font-weight: 500;\n}\n.st[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.hint[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\ntr.review[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: #fdf6f5;\n}\ntr.review[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  box-shadow: inset 3px 0 0 var(--%NS%red-600);\n}\n.pr[_ngcontent-%COMP%], \n.oc[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  align-items: flex-start;\n}\n.nr[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--%NS%red-600);\n}\n.conf[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 120px;\n}\n.conf[_ngcontent-%COMP%]   vc-progress[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.ev[_ngcontent-%COMP%] {\n  min-width: 360px;\n  max-width: 560px;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n}\n.ev[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]    + p[_ngcontent-%COMP%] {\n  margin-top: 3px;\n}\n.rule[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: baseline;\n  color: var(--%NS%text-3);\n}\n.rule[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}\n.rule[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n}\n.card-foot.left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=verification.tab.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VerificationTab, [{
    type: Component,
    args: [{ selector: "vc-verification-tab", imports: [...KIT, FormsModule, AgoPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-callout tone="info" icon="shield-check">
      Satellite checks compare what farmers reported with what the imagery shows. They <strong>never change practice records</strong>.
      A mismatch or an inconclusive result is passed to a person to review with the farmer.
    </vc-callout>

    <div class="stats">
      @for (o of outcomes; track o.key) {
        <button type="button" class="st" [class.on]="filter() === o.key" [class]="'t-' + o.key" (click)="filter.set(filter() === o.key ? '' : o.key)">
          <span class="lbl">{{ o.label }}</span><strong class="num">{{ count(o.key) }}</strong><span class="hint">{{ o.hint }}</span>
        </button>
      }
      <div class="st run">
        @if (canRun()) {
          <span class="lbl">Check a season</span>
          <button class="btn btn-primary" (click)="runOpen.set(true)"><vc-icon name="play" />Run checks</button>
        } @else {
          <span class="lbl">Last run</span><strong class="small">{{ lastRun() ? (lastRun()! | ago) : 'Never' }}</strong>
        }
      </div>
    </div>

    <section class="card">
      @if (list.loading()) {
        <vc-loading [rows]="6" />
      } @else if (list.error()) {
        <div class="card-body"><vc-error title="Couldn't load practice checks" [message]="list.error()!.message" /></div>
      } @else if (!rows().length) {
        <vc-empty icon="satellite" [title]="filter() ? 'Nothing with this outcome' : 'No practice checks yet'"
          text="Run checks for a season to compare reported cover crops, tillage, residue retention and water management with satellite imagery.">
          @if (canRun() && !filter()) { <button class="btn btn-primary" (click)="runOpen.set(true)"><vc-icon name="play" />Run checks</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Field</th><th>Practice \xB7 season</th><th>Outcome</th><th>Confidence</th><th>What the imagery shows</th></tr></thead>
            <tbody>
              @for (d of rows(); track d.id) {
                <tr [class.review]="d.outcome === 'mismatch'">
                  <td class="nowrap"><strong>{{ fieldCode(d.field_id) }}</strong></td>
                  <td>
                    <div class="pr"><span>{{ practiceName(d.practice_code) }}</span>
                      <span class="small subtle nowrap">{{ d.practice_record_id ? 'Reported' : 'Not reported' }} \xB7 {{ season(d.season) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="oc"><vc-badge [status]="d.outcome" />
                      @if (d.outcome === 'mismatch') { <span class="nr"><vc-icon name="user" [size]="12" />Needs a person to review</span> }
                      @else if (d.outcome === 'inconclusive') { <span class="small subtle">Not enough clear passes</span> }
                    </div>
                  </td>
                  <td>
                    <div class="conf"><vc-progress [value]="d.confidence" [max]="1" [tone]="d.confidence >= 0.75 ? 'ok' : 'warn'" /><span class="num small">{{ (d.confidence * 100).toFixed(0) }}%</span></div>
                  </td>
                  <td class="ev">
                    @for (w of words(d); track $index) { <p>{{ w }}</p> }
                    @if (d.evidence['rule']) { <p class="rule"><span>Test</span><code>{{ d.evidence['rule'] }}</code></p> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot left"><vc-dc cls="DERIVED" /><span class="small muted">Worked out from OBSERVED satellite indices. Latest check per field and practice.</span></div>
      }
    </section>

    <vc-modal [(open)]="runOpen" title="Run practice checks" subtitle="Compares every reported practice in the season with the satellite record" width="520px">
      <div class="stack" style="--gap:14px">
        <div class="form-grid">
          <div class="field"><label for="s1">Season starts</label><input id="s1" type="date" class="input" [(ngModel)]="seasonStart" /></div>
          <div class="field"><label for="s2">Season ends</label><input id="s2" type="date" class="input" [(ngModel)]="seasonEnd" /></div>
        </div>
        <label class="checkbox"><input type="checkbox" [(ngModel)]="useFallow" />Also look for unreported cover crops in a fallow window</label>
        @if (useFallow) {
          <div class="form-grid">
            <div class="field"><label for="f1">Fallow starts</label><input id="f1" type="date" class="input" [(ngModel)]="fallowStart" /></div>
            <div class="field"><label for="f2">Fallow ends</label><input id="f2" type="date" class="input" [(ngModel)]="fallowEnd" /></div>
          </div>
        }
        <p class="small muted">Results are added alongside earlier checks. Practice records are not changed.</p>
        @if (runError()) { <vc-error title="Checks didn't run" [message]="runError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="runOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="running()" (click)="run()">{{ running() ? 'Checking\u2026' : 'Run checks' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;0a8028de682d3c41;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\satellite\\verification.tab.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.stats {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n}\n@media (max-width: 980px) {\n  .stats {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n.st {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  align-items: flex-start;\n  text-align: left;\n  padding: 14px 16px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow-sm);\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  border-top: 3px solid var(--stone-300);\n}\n.st.t-confirmed {\n  border-top-color: var(--forest-500);\n}\n.st.t-mismatch {\n  border-top-color: var(--red-600);\n}\n.st.t-inconclusive {\n  border-top-color: var(--stone-400);\n}\n.st.on {\n  box-shadow: var(--focus);\n}\n.st.run {\n  cursor: default;\n  border-top-color: var(--forest-700);\n  justify-content: space-between;\n}\n.lbl {\n  font-size: 12.5px;\n  color: var(--text-2);\n  font-weight: 500;\n}\n.st strong {\n  font-size: 24px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.hint {\n  font-size: 12px;\n  color: var(--text-3);\n}\ntr.review td {\n  background: #fdf6f5;\n}\ntr.review td:first-child {\n  box-shadow: inset 3px 0 0 var(--red-600);\n}\n.pr,\n.oc {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  align-items: flex-start;\n}\n.nr {\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--red-600);\n}\n.conf {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 120px;\n}\n.conf vc-progress {\n  flex: 1;\n}\n.ev {\n  min-width: 360px;\n  max-width: 560px;\n  font-size: 12.5px;\n  color: var(--stone-700);\n}\n.ev p + p {\n  margin-top: 3px;\n}\n.rule {\n  display: flex;\n  gap: 6px;\n  align-items: baseline;\n  color: var(--text-3);\n}\n.rule span {\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}\n.rule code {\n  font-size: 11.5px;\n}\n.card-foot.left {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=verification.tab.css.map */\n"] }]
  }], () => [], { projectId: [{ type: Input, args: [{ isSignal: true, alias: "projectId", required: true }] }], fields: [{ type: Input, args: [{ isSignal: true, alias: "fields", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerificationTab, { className: "VerificationTab", filePath: "src/app/features/satellite/verification.tab.ts", lineNumber: 165 });
})();

// src/app/features/satellite/satellite.page.ts
var _c0 = () => [];
function SatellitePage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "vc-empty", 2);
    \u0275\u0275elementEnd();
  }
}
function SatellitePage_Conditional_2_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-indices-tab", 6);
    \u0275\u0275twoWayListener("fieldIdChange", function SatellitePage_Conditional_2_Case_1_Template_vc_indices_tab_fieldIdChange_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.fieldId, $event) || (ctx_r1.fieldId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("projectId", ctx_r1.ctx.currentId())("fields", ctx_r1.fields.data() ?? \u0275\u0275pureFunction0(3, _c0));
    \u0275\u0275twoWayProperty("fieldId", ctx_r1.fieldId);
  }
}
function SatellitePage_Conditional_2_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-verification-tab", 5);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("projectId", ctx_r1.ctx.currentId())("fields", ctx_r1.fields.data() ?? \u0275\u0275pureFunction0(2, _c0));
  }
}
function SatellitePage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-tabs", 3);
    \u0275\u0275twoWayListener("activeChange", function SatellitePage_Conditional_2_Template_vc_tabs_activeChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.tab, $event) || (ctx_r1.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(1, SatellitePage_Conditional_2_Case_1_Template, 1, 4, "vc-indices-tab", 4)(2, SatellitePage_Conditional_2_Case_2_Template, 1, 3, "vc-verification-tab", 5);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("tabs", ctx_r1.tabs);
    \u0275\u0275twoWayProperty("active", ctx_r1.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.tab()) === "indices" ? 1 : tmp_3_0 === "practices" ? 2 : -1);
  }
}
var SatellitePage = class _SatellitePage {
  api = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  ctx = inject(ProjectContext);
  tab = signal(
    this.route.snapshot.queryParamMap.get("tab") ?? "indices",
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
  tabs = [
    { key: "indices", label: "Alerts & indices" },
    { key: "practices", label: "Practice verification" }
  ];
  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => {
        if (pid)
          this.fields.load(this.api.get("/fields", { project_id: pid, limit: 500 }).pipe(map((r) => r.items)));
      });
    });
    effect(() => {
      const t = this.tab();
      const f = this.fieldId();
      untracked(() => this.router.navigate([], { queryParams: { tab: t === "indices" ? null : t, field: t === "indices" && f ? f : null }, replaceUrl: true }));
    });
  }
  static \u0275fac = function SatellitePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SatellitePage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SatellitePage, selectors: [["vc-satellite-page"]], decls: 3, vars: 1, consts: [["title", "Satellite & practices", "eyebrow", "Intelligence", "subtitle", "Vegetation and moisture indices from satellite passes, alerts when a field changes suddenly, and independent checks of reported practices."], [1, "card"], ["icon", "briefcase", "title", "Choose a project", "text", "Satellite data is shown per project. Pick one in the top bar."], [3, "activeChange", "tabs", "active"], [3, "projectId", "fields", "fieldId"], [3, "projectId", "fields"], [3, "fieldIdChange", "projectId", "fields", "fieldId"]], template: function SatellitePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, SatellitePage_Conditional_1_Template, 2, 0, "div", 1)(2, SatellitePage_Conditional_2_Template, 3, 3);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.ctx.currentId() ? 1 : 2);
    }
  }, dependencies: [PageHeader, Empty, Tabs, IndicesTab, VerificationTab], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SatellitePage, [{
    type: Component,
    args: [{
      selector: "vc-satellite-page",
      imports: [...KIT, IndicesTab, VerificationTab],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <vc-page-header title="Satellite & practices" eyebrow="Intelligence"
      subtitle="Vegetation and moisture indices from satellite passes, alerts when a field changes suddenly, and independent checks of reported practices." />

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Satellite data is shown per project. Pick one in the top bar." /></div>
    } @else {
      <vc-tabs [tabs]="tabs" [(active)]="tab" />
      @switch (tab()) {
        @case ('indices') { <vc-indices-tab [projectId]="ctx.currentId()!" [fields]="fields.data() ?? []" [(fieldId)]="fieldId" /> }
        @case ('practices') { <vc-verification-tab [projectId]="ctx.currentId()!" [fields]="fields.data() ?? []" /> }
      }
    }
  `
    }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SatellitePage, { className: "SatellitePage", filePath: "src/app/features/satellite/satellite.page.ts", lineNumber: 30 });
})();

// src/app/features/satellite/satellite.routes.ts
var satellite_routes_default = [{ path: "", component: SatellitePage, title: "Satellite & practices \xB7 Varsapradaya Carbon" }];
export {
  satellite_routes_default as default
};
//# debugId=70fe6a26-8f15-5798-9031-a7ff1ba21b26
//# sourceMappingURL=chunk-CQFVZQ2S.js.map
