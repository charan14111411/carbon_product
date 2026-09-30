import {
  Th,
  Um,
  Vm,
  wa
} from "./chunk-VJW22TG4.js";
import {
  AttrInputs,
  missingRequired
} from "./chunk-QDNHTXHD.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  Chip,
  LAND_USES,
  LAND_USE_COLOR,
  NO_CROP_COLOR,
  SOURCE_LABEL,
  cropColorMap,
  escapeHtml,
  evidenceForm
} from "./chunk-B3LTHGQM.js";
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
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  HumanPipe,
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
  DataClass,
  Empty,
  ErrorBox,
  FileDrop,
  Loading,
  Modal,
  PageHeader,
  Tabs,
  humanize
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
  firstValueFrom,
  forwardRef,
  inject,
  input,
  model,
  output,
  setClassMetadata,
  signal,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
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
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
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
  ɵɵtwoWayProperty,
  ɵɵviewQuerySignal
} from "./chunk-O2E4BMDK.js";

// src/app/features/fields/field-geo.ts
var R = 6378137;
var rad = (d) => d * Math.PI / 180;
function ringAreaHa(ring) {
  const pts = openRing(ring);
  if (pts.length < 3) return 0;
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    total += rad(x2 - x1) * (2 + Math.sin(rad(y1)) + Math.sin(rad(y2)));
  }
  return Math.abs(total * R * R / 2) / 1e4;
}
function perimeterM(ring) {
  const pts = openRing(ring);
  if (pts.length < 2) return 0;
  let m = 0;
  for (let i = 0; i < pts.length; i++) {
    const [lon1, lat1] = pts[i];
    const [lon2, lat2] = pts[(i + 1) % pts.length];
    if (i === pts.length - 1 && pts.length < 3) break;
    const dp = rad(lat2 - lat1), dl = rad(lon2 - lon1);
    const h = Math.sin(dp / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dl / 2) ** 2;
    m += 2 * 63710088e-1 * Math.asin(Math.sqrt(h));
  }
  return m;
}
function openRing(ring) {
  if (ring.length > 1) {
    const a = ring[0], b = ring[ring.length - 1];
    if (a[0] === b[0] && a[1] === b[1]) return ring.slice(0, -1);
  }
  return ring;
}
function toPolygon(vertices) {
  const r = openRing(vertices).map((v) => [round(v[0]), round(v[1])]);
  return { type: "Polygon", coordinates: [[...r, r[0]]] };
}
function outerRing(g) {
  if (!g) return [];
  if (g.type === "Polygon") return openRing(g.coordinates[0] ?? []);
  if (g.type === "MultiPolygon") return openRing(g.coordinates[0]?.[0] ?? []);
  return [];
}
var round = (v) => Math.round(v * 1e7) / 1e7;
function parseLatLonLines(text) {
  const vertices = [];
  const errors = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const parts = line.split(/[\s,;]+/).filter(Boolean).map(Number);
    if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) {
      errors.push(`Line ${i + 1}: expected \u201Clatitude, longitude\u201D.`);
      return;
    }
    const [lat, lon] = parts;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      errors.push(`Line ${i + 1}: ${lat}, ${lon} is outside the valid range.`);
      return;
    }
    vertices.push([lon, lat]);
  });
  return { vertices: openRing(vertices), errors };
}
function formatLatLonLines(vertices) {
  return openRing(vertices).map(([lon, lat]) => `${lat.toFixed(6)}, ${lon.toFixed(6)}`).join("\n");
}
function selfIntersects(ring) {
  const p = openRing(ring);
  const n = p.length;
  if (n < 4) return false;
  const seg = (i) => [p[i], p[(i + 1) % n]];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) <= 1 || i === 0 && j === n - 1) continue;
      const [a, b] = seg(i), [c, d] = seg(j);
      if (cross(a, b, c, d)) return true;
    }
  }
  return false;
}
function orient(a, b, c) {
  return Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
}
function cross(a, b, c, d) {
  return orient(a, b, c) !== orient(a, b, d) && orient(c, d, a) !== orient(c, d, b);
}
function svgPath(geoms, w, h, pad = 6) {
  const rings = geoms.map((g) => outerRing(g));
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of rings) for (const [x, y] of r) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  if (!Number.isFinite(minX)) return rings.map(() => "");
  const kx = Math.cos(rad((minY + maxY) / 2));
  const spanX = Math.max((maxX - minX) * kx, 1e-9), spanY = Math.max(maxY - minY, 1e-9);
  const s = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);
  const ox = (w - spanX * s) / 2, oy = (h - spanY * s) / 2;
  return rings.map(
    (r) => r.length ? "M" + r.map(([x, y]) => `${(ox + (x - minX) * kx * s).toFixed(1)},${(oy + (maxY - y) * s).toFixed(1)}`).join("L") + "Z" : ""
  );
}
function centroid(ring) {
  const p = openRing(ring);
  if (!p.length) return null;
  return [p.reduce((s, v) => s + v[0], 0) / p.length, p.reduce((s, v) => s + v[1], 0) / p.length];
}

// src/app/features/fields/field-map.ts
var _c0 = ["el"];
var _c1 = ["*"];
var EMPTY = { type: "FeatureCollection", features: [] };
function basemap(base) {
  const src = base === "streets" ? { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, maxzoom: 19, attribution: "\xA9 OpenStreetMap contributors" } : {
    type: "raster",
    tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
    tileSize: 256,
    attribution: "Imagery \xA9 Esri, Maxar, Earthstar Geographics"
  };
  return {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: { base: src },
    layers: [{ id: "base", type: "raster", source: "base" }]
  };
}
var FieldMap = class _FieldMap {
  polygons = input(
    null,
    ...ngDevMode ? [{ debugName: "polygons" }] : (
      /* istanbul ignore next */
      []
    )
  );
  height = input(
    "420px",
    ...ngDevMode ? [{ debugName: "height" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Id of a field to emphasise. */
  highlight = input(
    null,
    ...ngDevMode ? [{ debugName: "highlight" }] : (
      /* istanbul ignore next */
      []
    )
  );
  maxZoom = input(
    16,
    ...ngDevMode ? [{ debugName: "maxZoom" }] : (
      /* istanbul ignore next */
      []
    )
  );
  featureClick = output();
  el = viewChild.required(
    "el",
    ...ngDevMode ? [{ debugName: "el" }] : (
      /* istanbul ignore next */
      []
    )
  );
  base = signal(
    "satellite",
    ...ngDevMode ? [{ debugName: "base" }] : (
      /* istanbul ignore next */
      []
    )
  );
  map;
  ready = signal(
    false,
    ...ngDevMode ? [{ debugName: "ready" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fitted = false;
  constructor() {
    effect(() => {
      const p = this.polygons();
      const h = this.highlight();
      if (!this.ready())
        return;
      this.setData(p ?? EMPTY, h);
    });
  }
  ngAfterViewInit() {
    this.map = new Vm({
      container: this.el().nativeElement,
      style: basemap(this.base()),
      center: [76.2, 12.6],
      zoom: 7,
      attributionControl: { compact: true }
    });
    this.map.addControl(new Um({ showCompass: false }), "top-right");
    this.map.on("load", () => {
      this.addLayers();
      this.bind();
      this.ready.set(true);
    });
  }
  setBase(b) {
    if (!this.map || b === this.base())
      return;
    this.base.set(b);
    this.map.setStyle(basemap(b));
    this.map.once("styledata", () => {
      this.addLayers();
      this.setData(this.polygons() ?? EMPTY, this.highlight());
    });
  }
  fitAll() {
    const b = new wa();
    let any = false;
    for (const f of (this.polygons() ?? EMPTY).features)
      for (const p of outerRing(f.geometry)) {
        b.extend(p);
        any = true;
      }
    if (any)
      this.map?.fitBounds(b, { padding: 56, maxZoom: this.maxZoom(), duration: 400 });
  }
  addLayers() {
    const m = this.map;
    if (m.getSource("polys"))
      return;
    m.addSource("polys", { type: "geojson", data: EMPTY, promoteId: "id" });
    m.addSource("centres", { type: "geojson", data: EMPTY, promoteId: "id" });
    const sat = this.base() === "satellite";
    m.addLayer({ id: "poly-fill", type: "fill", source: "polys", paint: {
      "fill-color": ["coalesce", ["get", "color"], "#2f7249"],
      "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.55, ["boolean", ["get", "hl"], false], 0.5, sat ? 0.34 : 0.26]
    } });
    m.addLayer({ id: "poly-line", type: "line", source: "polys", paint: {
      "line-color": sat ? "#ffffff" : ["coalesce", ["get", "color"], "#1f4a32"],
      "line-width": ["case", ["boolean", ["get", "hl"], false], 3, 1.6],
      "line-opacity": 0.9
    } });
    m.addLayer({ id: "centre", type: "circle", source: "centres", maxzoom: 14.5, paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 4, 12, 6.5, 14.5, 5],
      "circle-color": ["coalesce", ["get", "color"], "#2f7249"],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 1.6,
      "circle-opacity": ["interpolate", ["linear"], ["zoom"], 13, 1, 14.5, 0],
      "circle-stroke-opacity": ["interpolate", ["linear"], ["zoom"], 13, 1, 14.5, 0]
    } });
    m.addLayer({ id: "code", type: "symbol", source: "centres", minzoom: 13.5, layout: {
      "text-field": ["get", "code"],
      "text-size": 11,
      "text-font": ["Noto Sans Regular"],
      "text-allow-overlap": false
    }, paint: { "text-color": "#ffffff", "text-halo-color": "rgba(16,41,28,.85)", "text-halo-width": 1.4 } });
  }
  bind() {
    const m = this.map;
    const popup = new Th({ closeButton: false, closeOnClick: false, offset: 10, maxWidth: "280px" });
    let hovered;
    for (const layer of ["poly-fill", "centre"]) {
      m.on("mousemove", layer, (e) => {
        m.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f)
          return;
        if (hovered !== void 0)
          m.setFeatureState({ source: "polys", id: hovered }, { hover: false });
        hovered = f.id;
        if (hovered !== void 0)
          m.setFeatureState({ source: "polys", id: hovered }, { hover: true });
        const label = f.properties?.["label"] ?? "";
        if (label)
          popup.setLngLat(e.lngLat).setHTML(label).addTo(m);
      });
      m.on("mouseleave", layer, () => {
        m.getCanvas().style.cursor = "";
        popup.remove();
        if (hovered !== void 0)
          m.setFeatureState({ source: "polys", id: hovered }, { hover: false });
        hovered = void 0;
      });
      m.on("click", layer, (e) => {
        const f = e.features?.[0];
        if (f)
          this.featureClick.emit(String(f.properties?.["id"] ?? f.id));
      });
    }
  }
  setData(polys, hl) {
    const m = this.map;
    if (!m)
      return;
    const withHl = __spreadProps(__spreadValues({}, polys), { features: polys.features.map((f) => __spreadProps(__spreadValues({}, f), { properties: __spreadProps(__spreadValues({}, f.properties), { hl: String(f.id) === hl }) })) });
    m.getSource("polys")?.setData(withHl);
    m.getSource("centres")?.setData({
      type: "FeatureCollection",
      features: polys.features.map((f) => ({
        type: "Feature",
        id: f.id,
        properties: f.properties,
        geometry: { type: "Point", coordinates: centroid(outerRing(f.geometry)) ?? [0, 0] }
      }))
    });
    if (!this.fitted && polys.features.length) {
      this.fitted = true;
      const b = new wa();
      for (const f of polys.features)
        for (const p of outerRing(f.geometry))
          b.extend(p);
      m.fitBounds(b, { padding: 56, maxZoom: this.maxZoom(), duration: 0 });
    }
  }
  ngOnDestroy() {
    this.map?.remove();
  }
  static \u0275fac = function FieldMap_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldMap)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldMap, selectors: [["vc-field-map"]], viewQuery: function FieldMap_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.el, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, hostVars: 2, hostBindings: function FieldMap_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275styleProp("height", ctx.height());
    }
  }, inputs: { polygons: [1, "polygons"], height: [1, "height"], highlight: [1, "highlight"], maxZoom: [1, "maxZoom"] }, outputs: { featureClick: "featureClick" }, ngContentSelectors: _c1, decls: 11, vars: 4, consts: [["el", ""], [1, "map"], [1, "switch"], ["type", "button", 3, "click"], ["type", "button", "title", "Zoom to all fields", "aria-label", "Zoom to all fields", 1, "fit", 3, "click"], ["width", "15", "height", "15", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round"], ["d", "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"]], template: function FieldMap_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElement(0, "div", 1, 0);
      \u0275\u0275domElementStart(2, "div", 2)(3, "button", 3);
      \u0275\u0275domListener("click", function FieldMap_Template_button_click_3_listener() {
        return ctx.setBase("satellite");
      });
      \u0275\u0275text(4, "Satellite");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(5, "button", 3);
      \u0275\u0275domListener("click", function FieldMap_Template_button_click_5_listener() {
        return ctx.setBase("streets");
      });
      \u0275\u0275text(6, "Map");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(7, "button", 4);
      \u0275\u0275domListener("click", function FieldMap_Template_button_click_7_listener() {
        return ctx.fitAll();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(8, "svg", 5);
      \u0275\u0275domElement(9, "path", 6);
      \u0275\u0275domElementEnd()();
      \u0275\u0275projection(10);
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275classProp("on", ctx.base() === "satellite");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("on", ctx.base() === "streets");
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  position: relative;\n  overflow: hidden;\n  background: #dcd8cc;\n}\n.map[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n}\n.switch[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  display: flex;\n  background: var(--%NS%surface);\n  border-radius: 8px;\n  box-shadow: var(--%NS%shadow);\n  padding: 3px;\n  gap: 2px;\n  z-index: 2;\n}\n.switch[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 12px var(--%NS%font);\n  padding: 5px 10px;\n  border-radius: 6px;\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.switch[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  color: #fff;\n}\n.fit[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 84px;\n  right: 10px;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  width: 29px;\n  height: 29px;\n  border: 0;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface);\n  box-shadow: var(--%NS%shadow);\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.fit[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-100);\n}\n/*# sourceMappingURL=field-map.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldMap, [{
    type: Component,
    args: [{ selector: "vc-field-map", changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div #el class="map"></div>
    <div class="switch">
      <button type="button" [class.on]="base() === 'satellite'" (click)="setBase('satellite')">Satellite</button>
      <button type="button" [class.on]="base() === 'streets'" (click)="setBase('streets')">Map</button>
    </div>
    <button type="button" class="fit" (click)="fitAll()" title="Zoom to all fields" aria-label="Zoom to all fields">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
    </button>
    <ng-content />
  `, host: { "[style.height]": "height()" }, styles: ["/* angular:styles/component:scss;5c277f832f743500;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\field-map.ts */\n:host {\n  display: block;\n  position: relative;\n  overflow: hidden;\n  background: #dcd8cc;\n}\n.map {\n  position: absolute;\n  inset: 0;\n}\n.switch {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  display: flex;\n  background: var(--surface);\n  border-radius: 8px;\n  box-shadow: var(--shadow);\n  padding: 3px;\n  gap: 2px;\n  z-index: 2;\n}\n.switch button {\n  border: 0;\n  background: none;\n  font: 500 12px var(--font);\n  padding: 5px 10px;\n  border-radius: 6px;\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.switch button.on {\n  background: var(--forest-600);\n  color: #fff;\n}\n.fit {\n  position: absolute;\n  top: 84px;\n  right: 10px;\n  z-index: 2;\n  display: grid;\n  place-items: center;\n  width: 29px;\n  height: 29px;\n  border: 0;\n  border-radius: var(--radius-sm);\n  background: var(--surface);\n  box-shadow: var(--shadow);\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.fit:hover {\n  background: var(--sand-100);\n}\n/*# sourceMappingURL=field-map.css.map */\n"] }]
  }], () => [], { polygons: [{ type: Input, args: [{ isSignal: true, alias: "polygons", required: false }] }], height: [{ type: Input, args: [{ isSignal: true, alias: "height", required: false }] }], highlight: [{ type: Input, args: [{ isSignal: true, alias: "highlight", required: false }] }], maxZoom: [{ type: Input, args: [{ isSignal: true, alias: "maxZoom", required: false }] }], featureClick: [{ type: Output, args: ["featureClick"] }], el: [{ type: ViewChild, args: ["el", { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldMap, { className: "FieldMap", filePath: "src/app/features/fields/field-map.ts", lineNumber: 55 });
})();

// src/app/features/fields/draw-map.ts
var _c02 = ["el"];
function DrawMap_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Click on the map to place the first corner of the field ");
  }
}
function DrawMap_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Keep clicking to add corners \u2014 at least 3 are needed ");
  }
}
function DrawMap_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Drag a corner to adjust it \xB7 click to add more ");
  }
}
var EMPTY2 = { type: "FeatureCollection", features: [] };
var baseStyle = basemap;
var DrawMap = class _DrawMap {
  vertices = model(
    [],
    ...ngDevMode ? [{ debugName: "vertices" }] : (
      /* istanbul ignore next */
      []
    )
  );
  context = input(
    null,
    ...ngDevMode ? [{ debugName: "context" }] : (
      /* istanbul ignore next */
      []
    )
  );
  height = input(
    "420px",
    ...ngDevMode ? [{ debugName: "height" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Where to look when there's nothing drawn yet: [lon, lat]. */
  center = input(
    null,
    ...ngDevMode ? [{ debugName: "center" }] : (
      /* istanbul ignore next */
      []
    )
  );
  el = viewChild.required(
    "el",
    ...ngDevMode ? [{ debugName: "el" }] : (
      /* istanbul ignore next */
      []
    )
  );
  base = signal(
    "satellite",
    ...ngDevMode ? [{ debugName: "base" }] : (
      /* istanbul ignore next */
      []
    )
  );
  map;
  ready = signal(
    false,
    ...ngDevMode ? [{ debugName: "ready" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fitted = false;
  dragIndex = null;
  constructor() {
    effect(() => {
      const v = this.vertices();
      const ctx = this.context();
      if (!this.ready())
        return;
      this.render(v, ctx ?? EMPTY2);
    });
  }
  ngAfterViewInit() {
    const c = this.center();
    this.map = new Vm({
      container: this.el().nativeElement,
      style: baseStyle(this.base()),
      center: c ?? [76.5, 13.2],
      zoom: c ? 15 : 6,
      attributionControl: { compact: true },
      doubleClickZoom: false
    });
    this.map.addControl(new Um({ showCompass: false }), "top-right");
    this.map.on("load", () => {
      this.addLayers();
      this.bind();
      this.ready.set(true);
    });
  }
  setBase(b) {
    if (!this.map || b === this.base())
      return;
    this.base.set(b);
    this.map.setStyle(baseStyle(b));
    this.map.once("styledata", () => {
      this.addLayers();
      this.render(this.vertices(), this.context() ?? EMPTY2);
    });
  }
  /** Zoom to the drawing (or to the context fields). */
  fit() {
    const m = this.map;
    if (!m)
      return;
    const b = new wa();
    let any = false;
    for (const v of this.vertices()) {
      b.extend(v);
      any = true;
    }
    if (!any) {
      for (const f of (this.context() ?? EMPTY2).features)
        walk(f.geometry?.coordinates, (p) => {
          b.extend(p);
          any = true;
        });
    }
    if (any)
      m.fitBounds(b, { padding: 60, maxZoom: 17, duration: 300 });
  }
  addLayers() {
    const m = this.map;
    if (m.getSource("ctx"))
      return;
    m.addSource("ctx", { type: "geojson", data: EMPTY2 });
    m.addSource("draft", { type: "geojson", data: EMPTY2 });
    m.addSource("verts", { type: "geojson", data: EMPTY2 });
    m.addLayer({ id: "ctx-fill", type: "fill", source: "ctx", paint: { "fill-color": "#ffffff", "fill-opacity": 0.12 } });
    m.addLayer({ id: "ctx-line", type: "line", source: "ctx", paint: { "line-color": "#ffffff", "line-width": 1.2, "line-dasharray": [2, 2], "line-opacity": 0.8 } });
    m.addLayer({
      id: "ctx-label",
      type: "symbol",
      source: "ctx",
      layout: { "text-field": ["get", "code"], "text-size": 11, "text-font": ["Noto Sans Regular"] },
      paint: { "text-color": "#ffffff", "text-halo-color": "rgba(0,0,0,.6)", "text-halo-width": 1.2 }
    });
    m.addLayer({
      id: "draft-fill",
      type: "fill",
      source: "draft",
      filter: ["==", "$type", "Polygon"],
      paint: { "fill-color": "#c76329", "fill-opacity": 0.28 }
    });
    m.addLayer({ id: "draft-line", type: "line", source: "draft", paint: { "line-color": "#f8e6d9", "line-width": 2.4 } });
    m.addLayer({ id: "verts", type: "circle", source: "verts", paint: {
      "circle-radius": ["case", ["get", "first"], 7, 5.5],
      "circle-color": ["case", ["get", "first"], "#c76329", "#ffffff"],
      "circle-stroke-color": "#c76329",
      "circle-stroke-width": 2.2
    } });
  }
  bind() {
    const m = this.map;
    m.on("click", (e) => {
      if (this.dragIndex !== null)
        return;
      const hit = m.queryRenderedFeatures(e.point, { layers: ["verts"] });
      if (hit.length)
        return;
      this.vertices.update((v) => [...v, [e.lngLat.lng, e.lngLat.lat]]);
    });
    m.on("mouseenter", "verts", () => m.getCanvas().style.cursor = "grab");
    m.on("mouseleave", "verts", () => m.getCanvas().style.cursor = "");
    m.on("mousedown", "verts", (e) => {
      const i = Number(e.features?.[0]?.properties?.["i"]);
      if (!Number.isFinite(i))
        return;
      e.preventDefault();
      this.dragIndex = i;
      m.getCanvas().style.cursor = "grabbing";
      const move = (ev) => {
        const idx = this.dragIndex;
        if (idx === null)
          return;
        this.vertices.update((v) => v.map((p, k) => k === idx ? [ev.lngLat.lng, ev.lngLat.lat] : p));
      };
      m.on("mousemove", move);
      m.once("mouseup", () => {
        m.off("mousemove", move);
        m.getCanvas().style.cursor = "";
        setTimeout(() => this.dragIndex = null, 0);
      });
    });
  }
  render(v, ctx) {
    const m = this.map;
    if (!m)
      return;
    const draft = [];
    if (v.length >= 3)
      draft.push({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[...v, v[0]]] } });
    else if (v.length === 2)
      draft.push({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: v } });
    m.getSource("draft")?.setData({ type: "FeatureCollection", features: draft });
    m.getSource("verts")?.setData({
      type: "FeatureCollection",
      features: v.map((p, i) => ({ type: "Feature", properties: { i, first: i === 0 }, geometry: { type: "Point", coordinates: p } }))
    });
    m.getSource("ctx")?.setData(ctx);
    if (!this.fitted && (v.length || ctx.features.length)) {
      this.fitted = true;
      this.fit();
    }
  }
  ngOnDestroy() {
    this.map?.remove();
  }
  static \u0275fac = function DrawMap_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DrawMap)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DrawMap, selectors: [["vc-draw-map"]], viewQuery: function DrawMap_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.el, _c02, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, hostVars: 2, hostBindings: function DrawMap_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275styleProp("height", ctx.height());
    }
  }, inputs: { vertices: [1, "vertices"], context: [1, "context"], height: [1, "height"], center: [1, "center"] }, outputs: { vertices: "verticesChange" }, decls: 11, vars: 5, consts: [["el", ""], [1, "map"], [1, "switch"], ["type", "button", 3, "click"], [1, "hint"]], template: function DrawMap_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElement(0, "div", 1, 0);
      \u0275\u0275domElementStart(2, "div", 2)(3, "button", 3);
      \u0275\u0275domListener("click", function DrawMap_Template_button_click_3_listener() {
        return ctx.setBase("satellite");
      });
      \u0275\u0275text(4, "Satellite");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(5, "button", 3);
      \u0275\u0275domListener("click", function DrawMap_Template_button_click_5_listener() {
        return ctx.setBase("streets");
      });
      \u0275\u0275text(6, "Map");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(7, "div", 4);
      \u0275\u0275conditionalCreate(8, DrawMap_Conditional_8_Template, 1, 0)(9, DrawMap_Conditional_9_Template, 1, 0)(10, DrawMap_Conditional_10_Template, 1, 0);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275classProp("on", ctx.base() === "satellite");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("on", ctx.base() === "streets");
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.vertices().length === 0 ? 8 : ctx.vertices().length < 3 ? 9 : 10);
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  position: relative;\n  border-radius: var(--%NS%radius);\n  overflow: hidden;\n  border: 1px solid var(--%NS%border);\n  background: #e8e6df;\n}\n.map[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n}\n.map[_ngcontent-%COMP%]     canvas {\n  cursor: crosshair;\n}\n.switch[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  display: flex;\n  background: var(--%NS%surface);\n  border-radius: 8px;\n  box-shadow: var(--%NS%shadow);\n  padding: 3px;\n  gap: 2px;\n  z-index: 2;\n}\n.switch[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 12px var(--%NS%font);\n  padding: 5px 10px;\n  border-radius: 6px;\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.switch[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  color: #fff;\n}\n.hint[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  bottom: 12px;\n  transform: translateX(-50%);\n  z-index: 2;\n  padding: 6px 12px;\n  border-radius: 999px;\n  background: rgba(16, 41, 28, 0.82);\n  color: #fff;\n  font-size: 12px;\n  white-space: nowrap;\n  pointer-events: none;\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n}\n/*# sourceMappingURL=draw-map.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DrawMap, [{
    type: Component,
    args: [{ selector: "vc-draw-map", changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div #el class="map"></div>
    <div class="switch">
      <button type="button" [class.on]="base() === 'satellite'" (click)="setBase('satellite')">Satellite</button>
      <button type="button" [class.on]="base() === 'streets'" (click)="setBase('streets')">Map</button>
    </div>
    <div class="hint">
      @if (vertices().length === 0) { Click on the map to place the first corner of the field }
      @else if (vertices().length < 3) { Keep clicking to add corners \u2014 at least 3 are needed }
      @else { Drag a corner to adjust it \xB7 click to add more }
    </div>
  `, host: { "[style.height]": "height()" }, styles: ["/* angular:styles/component:scss;4ebc9de979221ed4;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\draw-map.ts */\n:host {\n  display: block;\n  position: relative;\n  border-radius: var(--radius);\n  overflow: hidden;\n  border: 1px solid var(--border);\n  background: #e8e6df;\n}\n.map {\n  position: absolute;\n  inset: 0;\n}\n.map ::ng-deep canvas {\n  cursor: crosshair;\n}\n.switch {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  display: flex;\n  background: var(--surface);\n  border-radius: 8px;\n  box-shadow: var(--shadow);\n  padding: 3px;\n  gap: 2px;\n  z-index: 2;\n}\n.switch button {\n  border: 0;\n  background: none;\n  font: 500 12px var(--font);\n  padding: 5px 10px;\n  border-radius: 6px;\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.switch button.on {\n  background: var(--forest-600);\n  color: #fff;\n}\n.hint {\n  position: absolute;\n  left: 50%;\n  bottom: 12px;\n  transform: translateX(-50%);\n  z-index: 2;\n  padding: 6px 12px;\n  border-radius: 999px;\n  background: rgba(16, 41, 28, 0.82);\n  color: #fff;\n  font-size: 12px;\n  white-space: nowrap;\n  pointer-events: none;\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n}\n/*# sourceMappingURL=draw-map.css.map */\n"] }]
  }], () => [], { vertices: [{ type: Input, args: [{ isSignal: true, alias: "vertices", required: false }] }, { type: Output, args: ["verticesChange"] }], context: [{ type: Input, args: [{ isSignal: true, alias: "context", required: false }] }], height: [{ type: Input, args: [{ isSignal: true, alias: "height", required: false }] }], center: [{ type: Input, args: [{ isSignal: true, alias: "center", required: false }] }], el: [{ type: ViewChild, args: ["el", { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DrawMap, { className: "DrawMap", filePath: "src/app/features/fields/draw-map.ts", lineNumber: 44 });
})();
function walk(c, f) {
  if (Array.isArray(c) && typeof c[0] === "number")
    f(c);
  else if (Array.isArray(c))
    c.forEach((x) => walk(x, f));
}

// src/app/features/fields/boundary-editor.ts
function BoundaryEditor_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-draw-map", 27);
    \u0275\u0275twoWayListener("verticesChange", function BoundaryEditor_Conditional_9_Template_vc_draw_map_verticesChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.vertices, $event) || (ctx_r1.vertices = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275twoWayProperty("vertices", ctx_r1.vertices);
    \u0275\u0275property("context", ctx_r1.context())("center", ctx_r1.center())("height", ctx_r1.mapHeight());
  }
}
function BoundaryEditor_Conditional_10_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r4);
  }
}
function BoundaryEditor_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "label", 28);
    \u0275\u0275text(2, "One corner per line, as ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "latitude, longitude");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " (decimal degrees)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "textarea", 29);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function BoundaryEditor_Conditional_10_Template_textarea_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPaste($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, BoundaryEditor_Conditional_10_For_8_Template, 2, 1, "div", 30, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(9, "p", 31);
    \u0275\u0275text(10, "Tip: copy the corner points from a GPS walk or a spreadsheet. The shape is closed automatically.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r1.pasteText());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.pasteErrors());
  }
}
function BoundaryEditor_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "vc-icon", 32);
    \u0275\u0275text(2, "The outline crosses itself. Re-order or move corners so the edges don't intersect.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function BoundaryEditor_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function BoundaryEditor_Conditional_40_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.map()?.fit());
    });
    \u0275\u0275element(1, "vc-icon", 34);
    \u0275\u0275text(2, "Zoom");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function BoundaryEditor_For_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "span", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 36);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 37);
    \u0275\u0275listener("click", function BoundaryEditor_For_43_Template_button_click_5_listener() {
      const $index_r7 = \u0275\u0275restoreView(_r6).$index;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.remove($index_r7));
    });
    \u0275\u0275element(6, "vc-icon", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const v_r8 = ctx.$implicit;
    const $index_r7 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate($index_r7 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", v_r8[1].toFixed(6), ", ", v_r8[0].toFixed(6));
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Remove corner " + ($index_r7 + 1));
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function BoundaryEditor_ForEmpty_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 26);
    \u0275\u0275text(1, "No corners yet.");
    \u0275\u0275elementEnd();
  }
}
var BoundaryEditor = class _BoundaryEditor {
  vertices = model(
    [],
    ...ngDevMode ? [{ debugName: "vertices" }] : (
      /* istanbul ignore next */
      []
    )
  );
  context = input(
    null,
    ...ngDevMode ? [{ debugName: "context" }] : (
      /* istanbul ignore next */
      []
    )
  );
  center = input(
    null,
    ...ngDevMode ? [{ debugName: "center" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mapHeight = input(
    "400px",
    ...ngDevMode ? [{ debugName: "mapHeight" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mode = signal(
    "draw",
    ...ngDevMode ? [{ debugName: "mode" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pasteText = signal(
    "",
    ...ngDevMode ? [{ debugName: "pasteText" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pasteErrors = signal(
    [],
    ...ngDevMode ? [{ debugName: "pasteErrors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  map = viewChild(
    DrawMap,
    ...ngDevMode ? [{ debugName: "map" }] : (
      /* istanbul ignore next */
      []
    )
  );
  area = computed(
    () => ringAreaHa(this.vertices()),
    ...ngDevMode ? [{ debugName: "area" }] : (
      /* istanbul ignore next */
      []
    )
  );
  perimeter = computed(
    () => perimeterM(this.vertices()),
    ...ngDevMode ? [{ debugName: "perimeter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  crosses = computed(
    () => selfIntersects(this.vertices()),
    ...ngDevMode ? [{ debugName: "crosses" }] : (
      /* istanbul ignore next */
      []
    )
  );
  setMode(m) {
    if (m === "paste")
      this.pasteText.set(formatLatLonLines(this.vertices()));
    this.pasteErrors.set([]);
    this.mode.set(m);
  }
  onPaste(text) {
    this.pasteText.set(text);
    const r = parseLatLonLines(text);
    this.pasteErrors.set(r.errors);
    this.vertices.set(r.vertices);
  }
  undo() {
    this.vertices.update((v) => v.slice(0, -1));
    this.syncText();
  }
  clear() {
    this.vertices.set([]);
    this.syncText();
  }
  remove(i) {
    this.vertices.update((v) => v.filter((_, k) => k !== i));
    this.syncText();
  }
  syncText() {
    if (this.mode() === "paste")
      this.pasteText.set(formatLatLonLines(this.vertices()));
  }
  static \u0275fac = function BoundaryEditor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BoundaryEditor)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BoundaryEditor, selectors: [["vc-boundary-editor"]], viewQuery: function BoundaryEditor_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.map, DrawMap, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { vertices: [1, "vertices"], context: [1, "context"], center: [1, "center"], mapHeight: [1, "mapHeight"] }, outputs: { vertices: "verticesChange" }, decls: 45, vars: 24, consts: [["role", "tablist", 1, "modes"], ["type", "button", 3, "click"], ["name", "mouse-click", 3, "size"], ["name", "clipboard-paste", 3, "size"], [1, "wrap"], [1, "left"], [3, "vertices", "context", "center", "height"], [1, "paste"], [1, "side"], [1, "measure"], [1, "m-row"], [1, "m-lab"], [1, "m-val", "num"], [1, "m-sub"], [1, "num"], [1, "note"], ["name", "info", 3, "size"], [1, "warn", "small"], [1, "tools"], ["type", "button", 1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], ["name", "undo", 3, "size"], ["type", "button", 1, "btn", "btn-ghost", "btn-sm", 3, "click", "disabled"], ["name", "eraser", 3, "size"], ["type", "button", "title", "Zoom to drawing", 1, "btn", "btn-ghost", "btn-sm"], [1, "verts"], [1, "v"], [1, "subtle", "small", "empty"], [3, "verticesChange", "vertices", "context", "center", "height"], ["for", "coords", 1, "label"], ["id", "coords", "rows", "12", "placeholder", "13.340512, 75.771230\n13.341180, 75.772904\n13.339655, 75.773410\n13.339010, 75.771822", 1, "input", "mono", 3, "ngModelChange", "ngModel"], [1, "err", "small"], [1, "hint"], ["name", "alert", 3, "size"], ["type", "button", "title", "Zoom to drawing", 1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "crosshair", 3, "size"], [1, "i", "num"], [1, "c", "mono"], ["type", "button", 1, "x", 3, "click"], ["name", "x", 3, "size"]], template: function BoundaryEditor_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "button", 1);
      \u0275\u0275listener("click", function BoundaryEditor_Template_button_click_1_listener() {
        return ctx.setMode("draw");
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Draw on map");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 1);
      \u0275\u0275listener("click", function BoundaryEditor_Template_button_click_4_listener() {
        return ctx.setMode("paste");
      });
      \u0275\u0275element(5, "vc-icon", 3);
      \u0275\u0275text(6, "Paste coordinates");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 4)(8, "div", 5);
      \u0275\u0275conditionalCreate(9, BoundaryEditor_Conditional_9_Template, 1, 4, "vc-draw-map", 6)(10, BoundaryEditor_Conditional_10_Template, 11, 1, "div", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "aside", 8)(12, "div", 9)(13, "div", 10)(14, "span", 11);
      \u0275\u0275text(15, "Approx. area");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span", 12);
      \u0275\u0275text(17);
      \u0275\u0275pipe(18, "num");
      \u0275\u0275elementStart(19, "small");
      \u0275\u0275text(20, "ha");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "div", 13)(22, "span", 14);
      \u0275\u0275text(23);
      \u0275\u0275elementEnd();
      \u0275\u0275text(24, " corners \xB7 perimeter ");
      \u0275\u0275elementStart(25, "span", 14);
      \u0275\u0275text(26);
      \u0275\u0275pipe(27, "num");
      \u0275\u0275elementEnd();
      \u0275\u0275text(28, " m ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "p", 15);
      \u0275\u0275element(30, "vc-icon", 16);
      \u0275\u0275text(31, "Preview only. The official area is computed by the server from the saved boundary.");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(32, BoundaryEditor_Conditional_32_Template, 3, 1, "div", 17);
      \u0275\u0275elementStart(33, "div", 18)(34, "button", 19);
      \u0275\u0275listener("click", function BoundaryEditor_Template_button_click_34_listener() {
        return ctx.undo();
      });
      \u0275\u0275element(35, "vc-icon", 20);
      \u0275\u0275text(36, "Undo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "button", 21);
      \u0275\u0275listener("click", function BoundaryEditor_Template_button_click_37_listener() {
        return ctx.clear();
      });
      \u0275\u0275element(38, "vc-icon", 22);
      \u0275\u0275text(39, "Clear");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(40, BoundaryEditor_Conditional_40_Template, 3, 1, "button", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 24);
      \u0275\u0275repeaterCreate(42, BoundaryEditor_For_43_Template, 7, 5, "div", 25, \u0275\u0275repeaterTrackByIndex, false, BoundaryEditor_ForEmpty_44_Template, 2, 0, "p", 26);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275classProp("on", ctx.mode() === "draw");
      \u0275\u0275advance();
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("on", ctx.mode() === "paste");
      \u0275\u0275advance();
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.mode() === "draw" ? 9 : 10);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 18, ctx.area(), 2));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.vertices().length);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(27, 21, ctx.perimeter(), 0));
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 13);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.crosses() ? 32 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", !ctx.vertices().length);
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", !ctx.vertices().length);
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.mode() === "draw" ? 40 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.vertices());
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, Icon, DrawMap, NumPipe], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.modes[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 2px;\n  padding: 3px;\n  border-radius: 8px;\n  background: var(--%NS%sand-200);\n  margin-bottom: 12px;\n}\n.modes[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  border: 0;\n  background: none;\n  height: 30px;\n  padding: 0 12px;\n  border-radius: 6px;\n  font: 500 12.5px var(--%NS%font);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.modes[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%surface);\n  color: var(--%NS%stone-900);\n  box-shadow: var(--%NS%shadow-sm);\n}\n.wrap[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 260px;\n  gap: 14px;\n}\n@media (max-width: 900px) {\n  .wrap[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.paste[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.paste[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 260px;\n  font-size: 12.5px;\n}\n.err[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.hint[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.side[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  min-width: 0;\n}\n.measure[_ngcontent-%COMP%] {\n  padding: 14px;\n  border-radius: var(--%NS%radius);\n  background:\n    linear-gradient(\n      160deg,\n      var(--%NS%forest-800),\n      var(--%NS%forest-600));\n  color: #fff;\n}\n.m-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 8px;\n}\n.m-lab[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: rgba(255, 255, 255, 0.72);\n}\n.m-val[_ngcontent-%COMP%] {\n  font-size: 26px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.m-val[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 500;\n  margin-left: 4px;\n  color: rgba(255, 255, 255, 0.72);\n}\n.m-sub[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: rgba(255, 255, 255, 0.78);\n  margin-top: 2px;\n}\n.note[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: flex-start;\n  margin-top: 10px;\n  padding-top: 10px;\n  border-top: 1px solid rgba(255, 255, 255, 0.16);\n  font-size: 11.5px;\n  color: rgba(255, 255, 255, 0.78);\n  line-height: 1.4;\n}\n.note[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  margin-top: 2px;\n}\n.warn[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%stone-800);\n  border: 1px solid #f1dcae;\n}\n.warn[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n  margin-top: 2px;\n}\n.tools[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.verts[_ngcontent-%COMP%] {\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n  max-height: 220px;\n  overflow: auto;\n  background: var(--%NS%surface-2);\n}\n.v[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 8px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n  font-size: 12px;\n}\n.v[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.i[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  min-width: 20px;\n  height: 20px;\n  border-radius: 5px;\n  background: var(--%NS%clay-100);\n  color: var(--%NS%clay-700);\n  font-size: 11px;\n  font-weight: 600;\n}\n.c[_ngcontent-%COMP%] {\n  flex: 1;\n  color: var(--%NS%stone-700);\n  font-size: 11.5px;\n}\n.x[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  color: var(--%NS%stone-400);\n  cursor: pointer;\n  padding: 2px;\n  border-radius: 4px;\n  display: grid;\n  place-items: center;\n}\n.x[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%danger);\n  background: var(--%NS%danger-soft);\n}\n.empty[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n/*# sourceMappingURL=boundary-editor.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BoundaryEditor, [{
    type: Component,
    args: [{ selector: "vc-boundary-editor", imports: [FormsModule, Icon, DrawMap, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="modes" role="tablist">
      <button type="button" [class.on]="mode() === 'draw'" (click)="setMode('draw')"><vc-icon name="mouse-click" [size]="15" />Draw on map</button>
      <button type="button" [class.on]="mode() === 'paste'" (click)="setMode('paste')"><vc-icon name="clipboard-paste" [size]="15" />Paste coordinates</button>
    </div>

    <div class="wrap">
      <div class="left">
        @if (mode() === 'draw') {
          <vc-draw-map [(vertices)]="vertices" [context]="context()" [center]="center()" [height]="mapHeight()" />
        } @else {
          <div class="paste">
            <label class="label" for="coords">One corner per line, as <strong>latitude, longitude</strong> (decimal degrees)</label>
            <textarea id="coords" class="input mono" rows="12" [ngModel]="pasteText()" (ngModelChange)="onPaste($event)"
              placeholder="13.340512, 75.771230&#10;13.341180, 75.772904&#10;13.339655, 75.773410&#10;13.339010, 75.771822"></textarea>
            @for (e of pasteErrors(); track e) { <div class="err small">{{ e }}</div> }
            <p class="hint">Tip: copy the corner points from a GPS walk or a spreadsheet. The shape is closed automatically.</p>
          </div>
        }
      </div>

      <aside class="side">
        <div class="measure">
          <div class="m-row">
            <span class="m-lab">Approx. area</span>
            <span class="m-val num">{{ area() | num: 2 }}<small>ha</small></span>
          </div>
          <div class="m-sub">
            <span class="num">{{ vertices().length }}</span> corners \xB7 perimeter <span class="num">{{ perimeter() | num: 0 }}</span> m
          </div>
          <p class="note"><vc-icon name="info" [size]="13" />Preview only. The official area is computed by the server from the saved boundary.</p>
        </div>

        @if (crosses()) {
          <div class="warn small"><vc-icon name="alert" [size]="14" />The outline crosses itself. Re-order or move corners so the edges don't intersect.</div>
        }

        <div class="tools">
          <button type="button" class="btn btn-secondary btn-sm" (click)="undo()" [disabled]="!vertices().length"><vc-icon name="undo" [size]="14" />Undo</button>
          <button type="button" class="btn btn-ghost btn-sm" (click)="clear()" [disabled]="!vertices().length"><vc-icon name="eraser" [size]="14" />Clear</button>
          @if (mode() === 'draw') {
            <button type="button" class="btn btn-ghost btn-sm" (click)="map()?.fit()" title="Zoom to drawing"><vc-icon name="crosshair" [size]="14" />Zoom</button>
          }
        </div>

        <div class="verts">
          @for (v of vertices(); track $index) {
            <div class="v">
              <span class="i num">{{ $index + 1 }}</span>
              <span class="c mono">{{ v[1].toFixed(6) }}, {{ v[0].toFixed(6) }}</span>
              <button type="button" class="x" (click)="remove($index)" [attr.aria-label]="'Remove corner ' + ($index + 1)"><vc-icon name="x" [size]="13" /></button>
            </div>
          } @empty {
            <p class="subtle small empty">No corners yet.</p>
          }
        </div>
      </aside>
    </div>
  `, styles: ["/* angular:styles/component:scss;dd9ce67086cabe79;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\boundary-editor.ts */\n:host {\n  display: block;\n}\n.modes {\n  display: inline-flex;\n  gap: 2px;\n  padding: 3px;\n  border-radius: 8px;\n  background: var(--sand-200);\n  margin-bottom: 12px;\n}\n.modes button {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  border: 0;\n  background: none;\n  height: 30px;\n  padding: 0 12px;\n  border-radius: 6px;\n  font: 500 12.5px var(--font);\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.modes button.on {\n  background: var(--surface);\n  color: var(--stone-900);\n  box-shadow: var(--shadow-sm);\n}\n.wrap {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 260px;\n  gap: 14px;\n}\n@media (max-width: 900px) {\n  .wrap {\n    grid-template-columns: 1fr;\n  }\n}\n.paste {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.paste textarea {\n  min-height: 260px;\n  font-size: 12.5px;\n}\n.err {\n  color: var(--danger);\n}\n.hint {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.side {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  min-width: 0;\n}\n.measure {\n  padding: 14px;\n  border-radius: var(--radius);\n  background:\n    linear-gradient(\n      160deg,\n      var(--forest-800),\n      var(--forest-600));\n  color: #fff;\n}\n.m-row {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 8px;\n}\n.m-lab {\n  font-size: 12px;\n  color: rgba(255, 255, 255, 0.72);\n}\n.m-val {\n  font-size: 26px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n}\n.m-val small {\n  font-size: 13px;\n  font-weight: 500;\n  margin-left: 4px;\n  color: rgba(255, 255, 255, 0.72);\n}\n.m-sub {\n  font-size: 12px;\n  color: rgba(255, 255, 255, 0.78);\n  margin-top: 2px;\n}\n.note {\n  display: flex;\n  gap: 6px;\n  align-items: flex-start;\n  margin-top: 10px;\n  padding-top: 10px;\n  border-top: 1px solid rgba(255, 255, 255, 0.16);\n  font-size: 11.5px;\n  color: rgba(255, 255, 255, 0.78);\n  line-height: 1.4;\n}\n.note vc-icon {\n  margin-top: 2px;\n}\n.warn {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border-radius: var(--radius-sm);\n  background: var(--warn-soft);\n  color: var(--stone-800);\n  border: 1px solid #f1dcae;\n}\n.warn vc-icon {\n  color: var(--amber-600);\n  margin-top: 2px;\n}\n.tools {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.verts {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  max-height: 220px;\n  overflow: auto;\n  background: var(--surface-2);\n}\n.v {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 8px;\n  border-bottom: 1px solid var(--stone-100);\n  font-size: 12px;\n}\n.v:last-child {\n  border-bottom: 0;\n}\n.i {\n  display: grid;\n  place-items: center;\n  min-width: 20px;\n  height: 20px;\n  border-radius: 5px;\n  background: var(--clay-100);\n  color: var(--clay-700);\n  font-size: 11px;\n  font-weight: 600;\n}\n.c {\n  flex: 1;\n  color: var(--stone-700);\n  font-size: 11.5px;\n}\n.x {\n  border: 0;\n  background: none;\n  color: var(--stone-400);\n  cursor: pointer;\n  padding: 2px;\n  border-radius: 4px;\n  display: grid;\n  place-items: center;\n}\n.x:hover {\n  color: var(--danger);\n  background: var(--danger-soft);\n}\n.empty {\n  padding: 10px;\n}\n/*# sourceMappingURL=boundary-editor.css.map */\n"] }]
  }], null, { vertices: [{ type: Input, args: [{ isSignal: true, alias: "vertices", required: false }] }, { type: Output, args: ["verticesChange"] }], context: [{ type: Input, args: [{ isSignal: true, alias: "context", required: false }] }], center: [{ type: Input, args: [{ isSignal: true, alias: "center", required: false }] }], mapHeight: [{ type: Input, args: [{ isSignal: true, alias: "mapHeight", required: false }] }], map: [{ type: ViewChild, args: [forwardRef(() => DrawMap), { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BoundaryEditor, { className: "BoundaryEditor", filePath: "src/app/features/fields/boundary-editor.ts", lineNumber: 105 });
})();

// src/app/features/fields/boundary-history.ts
var _forTrack0 = ($index, $item) => $item.id;
function BoundaryHistory_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 0);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function BoundaryHistory_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "vc-error", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function BoundaryHistory_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 2);
  }
}
function BoundaryHistory_Conditional_3_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275element(0, "path", 10);
  }
  if (rf & 2) {
    const v_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275attribute("d", v_r2.prevPath);
  }
}
function BoundaryHistory_Conditional_3_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1, "Current");
    \u0275\u0275elementEnd();
  }
}
function BoundaryHistory_Conditional_3_For_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "num");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const v_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("up", v_r2.delta > 0)("down", v_r2.delta < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", v_r2.delta > 0 ? "+" : "", "", \u0275\u0275pipeBind2(2, 6, v_r2.delta, 2), " ha ");
  }
}
function BoundaryHistory_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 8);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 9);
    \u0275\u0275conditionalCreate(2, BoundaryHistory_Conditional_3_For_2_Conditional_2_Template, 1, 1, ":svg:path", 10);
    \u0275\u0275element(3, "path", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "div", 12)(5, "div", 13)(6, "span", 14);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, BoundaryHistory_Conditional_3_For_2_Conditional_8_Template, 2, 0, "span", 15);
    \u0275\u0275element(9, "span", 16);
    \u0275\u0275elementStart(10, "span", 17);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, BoundaryHistory_Conditional_3_For_2_Conditional_13_Template, 3, 9, "span", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 19);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 20);
    \u0275\u0275element(17, "vc-icon", 21);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "day");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const v_r2 = ctx.$implicit;
    const \u0275$index_15_r3 = ctx.$index;
    \u0275\u0275classProp("current", \u0275$index_15_r3 === 0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(v_r2.prevPath ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275attribute("d", v_r2.path);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Version ", v_r2.version);
    \u0275\u0275advance();
    \u0275\u0275conditional(\u0275$index_15_r3 === 0 ? 8 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(12, 11, v_r2.area_ha, 2), " ha");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(v_r2.delta !== null ? 13 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(v_r2.reason);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 12);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Saved ", \u0275\u0275pipeBind2(19, 14, v_r2.created_at, true));
  }
}
function BoundaryHistory_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ol", 4);
    \u0275\u0275repeaterCreate(1, BoundaryHistory_Conditional_3_For_2_Template, 20, 17, "li", 5, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 6);
    \u0275\u0275element(4, "vc-icon", 7);
    \u0275\u0275text(5, "Older versions are kept for the audit trail. Dashed outline = the version before.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.items());
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 13);
  }
}
var BoundaryHistory = class _BoundaryHistory {
  api = inject(ApiService);
  fieldId = input.required(
    ...ngDevMode ? [{ debugName: "fieldId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Bump to reload after a boundary edit. */
  refresh = input(
    0,
    ...ngDevMode ? [{ debugName: "refresh" }] : (
      /* istanbul ignore next */
      []
    )
  );
  raw = signal(
    [],
    ...ngDevMode ? [{ debugName: "raw" }] : (
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
  items = computed(
    () => {
      const list = this.raw();
      return list.map((v, i) => {
        const prev = list[i + 1];
        const [path, prevPath] = svgPath([v.boundary, prev?.boundary], 96, 72, 8);
        return __spreadProps(__spreadValues({}, v), { path, prevPath: prev ? prevPath : "", delta: prev ? v.area_ha - prev.area_ha : null });
      });
    },
    ...ngDevMode ? [{ debugName: "items" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const id = this.fieldId();
      this.refresh();
      this.loading.set(true);
      this.api.get(`/fields/${id}/history`).subscribe({
        next: (r) => {
          this.raw.set(r);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.message);
          this.loading.set(false);
        }
      });
    });
  }
  static \u0275fac = function BoundaryHistory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BoundaryHistory)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BoundaryHistory, selectors: [["vc-boundary-history"]], inputs: { fieldId: [1, "fieldId"], refresh: [1, "refresh"] }, decls: 4, vars: 1, consts: [[3, "rows"], [1, "card-body"], ["icon", "history", "title", "No boundary versions", "text", "The first boundary is recorded when the field is created."], ["title", "Couldn't load the boundary history", 3, "message"], [1, "versions"], [1, "v", 3, "current"], [1, "foot", "subtle", "small"], ["name", "info", 3, "size"], [1, "v"], ["viewBox", "0 0 96 72", "aria-hidden", "true", 1, "thumb"], [1, "prev"], [1, "cur"], [1, "body"], [1, "h"], [1, "ver"], [1, "tag"], [1, "spacer"], [1, "area", "num"], [1, "delta", "num", 3, "up", "down"], [1, "reason"], [1, "meta", "subtle", "small"], ["name", "clock", 3, "size"], [1, "delta", "num"]], template: function BoundaryHistory_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, BoundaryHistory_Conditional_0_Template, 1, 1, "vc-loading", 0)(1, BoundaryHistory_Conditional_1_Template, 2, 1, "div", 1)(2, BoundaryHistory_Conditional_2_Template, 1, 0, "vc-empty", 2)(3, BoundaryHistory_Conditional_3_Template, 6, 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.loading() ? 0 : ctx.error() ? 1 : !ctx.items().length ? 2 : 3);
    }
  }, dependencies: [Loading, ErrorBox, Empty, Icon, DayPipe, NumPipe], styles: ["\n.versions[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 8px 0;\n}\n.v[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.v[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.thumb[_ngcontent-%COMP%] {\n  flex: none;\n  width: 96px;\n  height: 72px;\n  border-radius: 8px;\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n}\n.cur[_ngcontent-%COMP%] {\n  fill: rgba(47, 114, 73, 0.18);\n  stroke: var(--%NS%forest-600);\n  stroke-width: 1.6;\n  stroke-linejoin: round;\n}\n.prev[_ngcontent-%COMP%] {\n  fill: none;\n  stroke: var(--%NS%clay-500);\n  stroke-width: 1.2;\n  stroke-dasharray: 3 2;\n}\n.v[_ngcontent-%COMP%]:not(.current)   .cur[_ngcontent-%COMP%] {\n  fill: rgba(115, 124, 118, 0.12);\n  stroke: var(--%NS%stone-500);\n}\n.body[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.h[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.ver[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.tag[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  padding: 2px 7px;\n  border-radius: 999px;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.area[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.delta[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 5px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.delta.up[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n}\n.delta.down[_ngcontent-%COMP%] {\n  background: var(--%NS%clay-50);\n  color: var(--%NS%clay-700);\n}\n.reason[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  color: var(--%NS%stone-800);\n}\n.meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n  margin-top: 6px;\n}\n.foot[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  padding: 10px 20px 14px;\n  border-top: 1px solid var(--%NS%border);\n}\n/*# sourceMappingURL=boundary-history.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BoundaryHistory, [{
    type: Component,
    args: [{ selector: "vc-boundary-history", imports: [Loading, ErrorBox, Empty, Icon, DayPipe, NumPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (loading()) { <vc-loading [rows]="4" /> }
    @else if (error()) { <div class="card-body"><vc-error title="Couldn't load the boundary history" [message]="error()!" /></div> }
    @else if (!items().length) { <vc-empty icon="history" title="No boundary versions" text="The first boundary is recorded when the field is created." /> }
    @else {
      <ol class="versions">
        @for (v of items(); track v.id) {
          <li class="v" [class.current]="$first">
            <svg class="thumb" viewBox="0 0 96 72" aria-hidden="true">
              @if (v.prevPath) { <path [attr.d]="v.prevPath" class="prev" /> }
              <path [attr.d]="v.path" class="cur" />
            </svg>
            <div class="body">
              <div class="h">
                <span class="ver">Version {{ v.version }}</span>
                @if ($first) { <span class="tag">Current</span> }
                <span class="spacer"></span>
                <span class="area num">{{ v.area_ha | num: 2 }} ha</span>
                @if (v.delta !== null) {
                  <span class="delta num" [class.up]="v.delta > 0" [class.down]="v.delta < 0">
                    {{ v.delta > 0 ? '+' : '' }}{{ v.delta | num: 2 }} ha
                  </span>
                }
              </div>
              <p class="reason">{{ v.reason }}</p>
              <div class="meta subtle small"><vc-icon name="clock" [size]="12" />Saved {{ v.created_at | day: true }}</div>
            </div>
          </li>
        }
      </ol>
      <p class="foot subtle small"><vc-icon name="info" [size]="13" />Older versions are kept for the audit trail. Dashed outline = the version before.</p>
    }
  `, styles: ["/* angular:styles/component:scss;c2f87a872357cb47;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\boundary-history.ts */\n.versions {\n  list-style: none;\n  margin: 0;\n  padding: 8px 0;\n}\n.v {\n  display: flex;\n  gap: 16px;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.v:last-child {\n  border-bottom: 0;\n}\n.thumb {\n  flex: none;\n  width: 96px;\n  height: 72px;\n  border-radius: 8px;\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n}\n.cur {\n  fill: rgba(47, 114, 73, 0.18);\n  stroke: var(--forest-600);\n  stroke-width: 1.6;\n  stroke-linejoin: round;\n}\n.prev {\n  fill: none;\n  stroke: var(--clay-500);\n  stroke-width: 1.2;\n  stroke-dasharray: 3 2;\n}\n.v:not(.current) .cur {\n  fill: rgba(115, 124, 118, 0.12);\n  stroke: var(--stone-500);\n}\n.body {\n  flex: 1;\n  min-width: 0;\n}\n.h {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.ver {\n  font-weight: 600;\n}\n.tag {\n  font-size: 11px;\n  font-weight: 600;\n  padding: 2px 7px;\n  border-radius: 999px;\n  background: var(--forest-100);\n  color: var(--forest-700);\n}\n.spacer {\n  flex: 1;\n}\n.area {\n  font-weight: 600;\n}\n.delta {\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 5px;\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.delta.up {\n  background: var(--forest-50);\n  color: var(--forest-700);\n}\n.delta.down {\n  background: var(--clay-50);\n  color: var(--clay-700);\n}\n.reason {\n  margin-top: 4px;\n  color: var(--stone-800);\n}\n.meta {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n  margin-top: 6px;\n}\n.foot {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  padding: 10px 20px 14px;\n  border-top: 1px solid var(--border);\n}\n/*# sourceMappingURL=boundary-history.css.map */\n"] }]
  }], () => [], { fieldId: [{ type: Input, args: [{ isSignal: true, alias: "fieldId", required: true }] }], refresh: [{ type: Input, args: [{ isSignal: true, alias: "refresh", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BoundaryHistory, { className: "BoundaryHistory", filePath: "src/app/features/fields/boundary-history.ts", lineNumber: 78 });
})();

// src/app/features/fields/field-create.ts
var _c03 = (a0) => ["/app/fields", a0];
var _forTrack02 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.code;
function FieldCreate_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", f_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", f_r1.name, " \u2014 ", ctx_r1.farmerName(f_r1.farmer_id), "", f_r1.village ? " \xB7 " + f_r1.village : "");
  }
}
function FieldCreate_ForEmpty_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 9);
    \u0275\u0275text(1, "No farms match");
    \u0275\u0275elementEnd();
  }
}
function FieldCreate_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r3 = ctx.$implicit;
    \u0275\u0275property("value", c_r3.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", c_r3.name, "", c_r3.local_name ? " (" + c_r3.local_name + ")" : "");
  }
}
function FieldCreate_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "vc-attr-inputs", 34);
    \u0275\u0275twoWayListener("valuesChange", function FieldCreate_Conditional_27_Template_vc_attr_inputs_valuesChange_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.attrs, $event) || (ctx_r1.attrs = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.crop().name, " details");
    \u0275\u0275advance();
    \u0275\u0275property("defs", ctx_r1.crop().attributes);
    \u0275\u0275twoWayProperty("values", ctx_r1.attrs);
  }
}
function FieldCreate_Conditional_48_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 35);
    \u0275\u0275text(1);
    \u0275\u0275element(2, "vc-icon", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r5 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(3, _c03, o_r5.fieldId));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Open ", o_r5.fieldCode, " ");
    \u0275\u0275advance();
    \u0275\u0275property("size", 12);
  }
}
function FieldCreate_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 27)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275conditionalCreate(4, FieldCreate_Conditional_48_Conditional_4_Template, 3, 5, "a", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r5 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("This boundary overlaps field ", o_r5.fieldCode, ".");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", o_r5.message, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(o_r5.fieldId ? 4 : -1);
  }
}
function FieldCreate_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function overlapOf(e) {
  if (e.code !== "OVERLAPPING_FIELD")
    return null;
  return { message: e.message, fieldId: e.details["field_id"], fieldCode: e.details["field_code"] };
}
var FieldCreate = class _FieldCreate {
  api = inject(ApiService);
  open = model(
    false,
    ...ngDevMode ? [{ debugName: "open" }] : (
      /* istanbul ignore next */
      []
    )
  );
  context = input(
    null,
    ...ngDevMode ? [{ debugName: "context" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Pre-select a farm, e.g. when opened from a farmer page. */
  presetFarmId = input(
    null,
    ...ngDevMode ? [{ debugName: "presetFarmId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  created = output();
  farms = signal(
    [],
    ...ngDevMode ? [{ debugName: "farms" }] : (
      /* istanbul ignore next */
      []
    )
  );
  farmers = signal(
    /* @__PURE__ */ new Map(),
    ...ngDevMode ? [{ debugName: "farmers" }] : (
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
  farmQ = signal(
    "",
    ...ngDevMode ? [{ debugName: "farmQ" }] : (
      /* istanbul ignore next */
      []
    )
  );
  farmId = signal(
    "",
    ...ngDevMode ? [{ debugName: "farmId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  name = signal(
    "",
    ...ngDevMode ? [{ debugName: "name" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropCode = signal(
    "",
    ...ngDevMode ? [{ debugName: "cropCode" }] : (
      /* istanbul ignore next */
      []
    )
  );
  attrs = signal(
    {},
    ...ngDevMode ? [{ debugName: "attrs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  soil = signal(
    "",
    ...ngDevMode ? [{ debugName: "soil" }] : (
      /* istanbul ignore next */
      []
    )
  );
  elev = signal(
    null,
    ...ngDevMode ? [{ debugName: "elev" }] : (
      /* istanbul ignore next */
      []
    )
  );
  vertices = signal(
    [],
    ...ngDevMode ? [{ debugName: "vertices" }] : (
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
  error = signal(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  overlap = signal(
    null,
    ...ngDevMode ? [{ debugName: "overlap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loaded = false;
  crop = computed(
    () => this.crops().find((c) => c.code === this.cropCode()) ?? null,
    ...ngDevMode ? [{ debugName: "crop" }] : (
      /* istanbul ignore next */
      []
    )
  );
  farmOptions = computed(
    () => {
      const q = this.farmQ().toLowerCase().trim();
      return this.farms().filter((f) => !q || `${f.name} ${f.village} ${this.farmerName(f.farmer_id)}`.toLowerCase().includes(q)).slice(0, 200);
    },
    ...ngDevMode ? [{ debugName: "farmOptions" }] : (
      /* istanbul ignore next */
      []
    )
  );
  problem = computed(
    () => {
      if (!this.farmId())
        return "Choose a farm";
      if (!this.name().trim())
        return "Give the field a name";
      if (this.vertices().length < 3)
        return "Draw at least 3 corners";
      if (selfIntersects(this.vertices()))
        return "The outline crosses itself";
      const miss = missingRequired(this.crop()?.attributes ?? [], this.attrs());
      if (miss.length)
        return `Fill in: ${miss.join(", ")}`;
      return null;
    },
    ...ngDevMode ? [{ debugName: "problem" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      if (this.open() && !this.loaded) {
        this.loaded = true;
        this.loadLookups();
      }
      if (this.open()) {
        const p = this.presetFarmId();
        if (p)
          this.farmId.set(p);
      }
    });
  }
  farmerName(id) {
    return this.farmers().get(id)?.full_name ?? "Unknown farmer";
  }
  loadLookups() {
    this.api.get("/farms").subscribe({ next: (r) => this.farms.set(r) });
    this.api.get("/farmers", { limit: 500 }).subscribe({
      next: (r) => this.farmers.set(new Map(r.items.map((f) => [f.id, f])))
    });
    this.api.get("/catalogue/crops").subscribe({ next: (r) => this.crops.set(r) });
  }
  save() {
    if (this.problem())
      return;
    this.saving.set(true);
    this.error.set(null);
    this.overlap.set(null);
    this.api.post("/fields", {
      farm_id: this.farmId(),
      name: this.name().trim(),
      boundary: toPolygon(this.vertices()),
      crop_code: this.cropCode() || null,
      crop_attributes: this.attrs(),
      soil_type: this.soil().trim() || null,
      elevation_m: this.elev() === null || this.elev() === "" ? null : Number(this.elev())
    }).subscribe({
      next: (f) => {
        this.saving.set(false);
        this.created.emit(f);
        this.reset();
        this.open.set(false);
      },
      error: (e) => {
        this.saving.set(false);
        const o = overlapOf(e);
        if (o)
          this.overlap.set(o);
        else
          this.error.set(e.message);
      }
    });
  }
  reset() {
    this.name.set("");
    this.cropCode.set("");
    this.attrs.set({});
    this.soil.set("");
    this.elev.set(null);
    this.vertices.set([]);
    this.farmQ.set("");
  }
  static \u0275fac = function FieldCreate_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldCreate)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldCreate, selectors: [["vc-field-create"]], inputs: { open: [1, "open"], context: [1, "context"], presetFarmId: [1, "presetFarmId"] }, outputs: { open: "openChange", created: "created" }, decls: 58, vars: 15, consts: [["title", "Add a field", "width", "1080px", "subtitle", "Map the boundary and link the field to a farm. The official area is computed from the boundary when you save.", 3, "openChange", "open"], [1, "layout"], [1, "details"], [1, "sec"], [1, "field"], ["for", "farm-q"], ["id", "farm-q", "placeholder", "Search farm, farmer or village\u2026", 1, "input", 3, "ngModelChange", "ngModel"], ["size", "5", "aria-label", "Farm", 1, "input", 3, "ngModelChange", "ngModel"], [3, "value"], ["disabled", ""], [1, "hint"], ["for", "f-name"], ["id", "f-name", "placeholder", "e.g. Upper terrace, east of the well", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "f-crop"], ["id", "f-crop", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [1, "attrs"], [1, "form-grid"], ["for", "f-soil"], [1, "subtle"], ["id", "f-soil", "placeholder", "e.g. Red laterite", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "f-elev"], [1, "unit-wrap"], ["id", "f-elev", "type", "number", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "unit"], [1, "boundary"], ["mapHeight", "440px", 3, "verticesChange", "vertices", "context"], ["tone", "danger", "icon", "alert", 1, "mt"], ["footer", "", 1, "ft"], [1, "foot-note", "subtle", "small"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "check"], [1, "label"], [3, "valuesChange", "defs", "values"], ["target", "_blank", 1, "lnk", 3, "routerLink"], ["name", "external-link", 3, "size"]], template: function FieldCreate_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-modal", 0);
      \u0275\u0275twoWayListener("openChange", function FieldCreate_Template_vc_modal_openChange_0_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.open, $event) || (ctx.open = $event);
        return $event;
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "h3", 3);
      \u0275\u0275text(4, "Field details");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "label", 5);
      \u0275\u0275text(7, "Farm");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "input", 6);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldCreate_Template_input_ngModelChange_8_listener($event) {
        return ctx.farmQ.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "select", 7);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldCreate_Template_select_ngModelChange_9_listener($event) {
        return ctx.farmId.set($event);
      });
      \u0275\u0275repeaterCreate(10, FieldCreate_For_11_Template, 2, 4, "option", 8, _forTrack02, false, FieldCreate_ForEmpty_12_Template, 2, 0, "option", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "span", 10);
      \u0275\u0275text(14, "Every field belongs to a farm. Add the farm on the farmer's page first if it isn't listed.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 4)(16, "label", 11);
      \u0275\u0275text(17, "Field name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "input", 12);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldCreate_Template_input_ngModelChange_18_listener($event) {
        return ctx.name.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div", 4)(20, "label", 13);
      \u0275\u0275text(21, "Main crop");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "select", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldCreate_Template_select_ngModelChange_22_listener($event) {
        ctx.cropCode.set($event);
        return ctx.attrs.set({});
      });
      \u0275\u0275elementStart(23, "option", 15);
      \u0275\u0275text(24, "Not set yet");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(25, FieldCreate_For_26_Template, 2, 3, "option", 8, _forTrack1);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(27, FieldCreate_Conditional_27_Template, 4, 3, "div", 16);
      \u0275\u0275elementStart(28, "div", 17)(29, "div", 4)(30, "label", 18);
      \u0275\u0275text(31, "Soil type ");
      \u0275\u0275elementStart(32, "span", 19);
      \u0275\u0275text(33, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "input", 20);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldCreate_Template_input_ngModelChange_34_listener($event) {
        return ctx.soil.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "div", 4)(36, "label", 21);
      \u0275\u0275text(37, "Elevation ");
      \u0275\u0275elementStart(38, "span", 19);
      \u0275\u0275text(39, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "div", 22)(41, "input", 23);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldCreate_Template_input_ngModelChange_41_listener($event) {
        return ctx.elev.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span", 24);
      \u0275\u0275text(43, "m");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(44, "div", 25)(45, "h3", 3);
      \u0275\u0275text(46, "Boundary");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "vc-boundary-editor", 26);
      \u0275\u0275twoWayListener("verticesChange", function FieldCreate_Template_vc_boundary_editor_verticesChange_47_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.vertices, $event) || (ctx.vertices = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(48, FieldCreate_Conditional_48_Template, 5, 3, "vc-callout", 27)(49, FieldCreate_Conditional_49_Template, 2, 1, "vc-callout", 27);
      \u0275\u0275elementStart(50, "div", 28)(51, "span", 29);
      \u0275\u0275text(52);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "button", 30);
      \u0275\u0275listener("click", function FieldCreate_Template_button_click_53_listener() {
        return ctx.open.set(false);
      });
      \u0275\u0275text(54, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "button", 31);
      \u0275\u0275listener("click", function FieldCreate_Template_button_click_55_listener() {
        return ctx.save();
      });
      \u0275\u0275element(56, "vc-icon", 32);
      \u0275\u0275text(57);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_18_0;
      \u0275\u0275twoWayProperty("open", ctx.open);
      \u0275\u0275advance(8);
      \u0275\u0275property("ngModel", ctx.farmQ());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.farmId());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.farmOptions());
      \u0275\u0275advance(8);
      \u0275\u0275property("ngModel", ctx.name());
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.cropCode());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.crops());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.crop()?.attributes?.length ? 27 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.soil());
      \u0275\u0275control();
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.elev());
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("vertices", ctx.vertices);
      \u0275\u0275property("context", ctx.context());
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_18_0 = ctx.overlap()) ? 48 : ctx.error() ? 49 : -1, tmp_18_0);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.problem() ?? "Ready to save");
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", !!ctx.problem() || ctx.saving());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.saving() ? "Saving\u2026" : "Save field", " ");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, RouterLink, Modal, Callout, Icon, BoundaryEditor, AttrInputs], styles: ["\n.layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 320px minmax(0, 1fr);\n  gap: 24px;\n}\n@media (max-width: 980px) {\n  .layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.sec[_ngcontent-%COMP%] {\n  font-size: 12px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n  margin-bottom: 2px;\n}\n.boundary[_ngcontent-%COMP%]   .sec[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n}\nselect[size][_ngcontent-%COMP%] {\n  height: auto;\n  padding: 4px;\n}\nselect[size][_ngcontent-%COMP%]   option[_ngcontent-%COMP%] {\n  padding: 6px 8px;\n  border-radius: 4px;\n}\n.attrs[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.unit-wrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n.unit-wrap[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-right: 36px;\n}\n.unit[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n.lnk[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  margin-left: 6px;\n  font-weight: 500;\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n}\n.foot-note[_ngcontent-%COMP%] {\n  margin-right: auto;\n}\n/*# sourceMappingURL=field-create.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldCreate, [{
    type: Component,
    args: [{ selector: "vc-field-create", imports: [FormsModule, RouterLink, Modal, Callout, Icon, BoundaryEditor, AttrInputs], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-modal [(open)]="open" title="Add a field" width="1080px"
      subtitle="Map the boundary and link the field to a farm. The official area is computed from the boundary when you save.">
      <div class="layout">
        <div class="details">
          <h3 class="sec">Field details</h3>
          <div class="field">
            <label for="farm-q">Farm</label>
            <input id="farm-q" class="input" placeholder="Search farm, farmer or village\u2026" [ngModel]="farmQ()" (ngModelChange)="farmQ.set($event)" />
            <select class="input" size="5" [ngModel]="farmId()" (ngModelChange)="farmId.set($event)" aria-label="Farm">
              @for (f of farmOptions(); track f.id) {
                <option [value]="f.id">{{ f.name }} \u2014 {{ farmerName(f.farmer_id) }}{{ f.village ? ' \xB7 ' + f.village : '' }}</option>
              } @empty { <option disabled>No farms match</option> }
            </select>
            <span class="hint">Every field belongs to a farm. Add the farm on the farmer's page first if it isn't listed.</span>
          </div>
          <div class="field">
            <label for="f-name">Field name</label>
            <input id="f-name" class="input" [ngModel]="name()" (ngModelChange)="name.set($event)" placeholder="e.g. Upper terrace, east of the well" />
          </div>
          <div class="field">
            <label for="f-crop">Main crop</label>
            <select id="f-crop" class="input" [ngModel]="cropCode()" (ngModelChange)="cropCode.set($event); attrs.set({})">
              <option value="">Not set yet</option>
              @for (c of crops(); track c.code) { <option [value]="c.code">{{ c.name }}{{ c.local_name ? ' (' + c.local_name + ')' : '' }}</option> }
            </select>
          </div>
          @if (crop()?.attributes?.length) {
            <div class="attrs">
              <div class="label">{{ crop()!.name }} details</div>
              <vc-attr-inputs [defs]="crop()!.attributes" [(values)]="attrs" />
            </div>
          }
          <div class="form-grid">
            <div class="field">
              <label for="f-soil">Soil type <span class="subtle">(optional)</span></label>
              <input id="f-soil" class="input" [ngModel]="soil()" (ngModelChange)="soil.set($event)" placeholder="e.g. Red laterite" />
            </div>
            <div class="field">
              <label for="f-elev">Elevation <span class="subtle">(optional)</span></label>
              <div class="unit-wrap"><input id="f-elev" type="number" class="input num" [ngModel]="elev()" (ngModelChange)="elev.set($event)" /><span class="unit">m</span></div>
            </div>
          </div>
        </div>

        <div class="boundary">
          <h3 class="sec">Boundary</h3>
          <vc-boundary-editor [(vertices)]="vertices" [context]="context()" mapHeight="440px" />
        </div>
      </div>

      @if (overlap(); as o) {
        <vc-callout tone="danger" icon="alert" class="mt">
          <strong>This boundary overlaps field {{ o.fieldCode }}.</strong> {{ o.message }}
          @if (o.fieldId) { <a [routerLink]="['/app/fields', o.fieldId]" target="_blank" class="lnk">Open {{ o.fieldCode }} <vc-icon name="external-link" [size]="12" /></a> }
        </vc-callout>
      } @else if (error()) {
        <vc-callout tone="danger" icon="alert" class="mt">{{ error() }}</vc-callout>
      }

      <div footer class="ft">
        <span class="foot-note subtle small">{{ problem() ?? 'Ready to save' }}</span>
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!problem() || saving()" (click)="save()">
          <vc-icon name="check" />{{ saving() ? 'Saving\u2026' : 'Save field' }}
        </button>
      </div>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;2369754e6996b529;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\field-create.ts */\n.layout {\n  display: grid;\n  grid-template-columns: 320px minmax(0, 1fr);\n  gap: 24px;\n}\n@media (max-width: 980px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}\n.details {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.sec {\n  font-size: 12px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--text-3);\n  margin-bottom: 2px;\n}\n.boundary .sec {\n  margin-bottom: 10px;\n}\nselect[size] {\n  height: auto;\n  padding: 4px;\n}\nselect[size] option {\n  padding: 6px 8px;\n  border-radius: 4px;\n}\n.attrs {\n  padding: 12px;\n  border-radius: var(--radius-sm);\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.unit-wrap {\n  position: relative;\n}\n.unit-wrap .input {\n  padding-right: 36px;\n}\n.unit {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 12px;\n  color: var(--text-3);\n}\n.mt {\n  margin-top: 16px;\n}\n.lnk {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  margin-left: 6px;\n  font-weight: 500;\n}\n.ft {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n}\n.foot-note {\n  margin-right: auto;\n}\n/*# sourceMappingURL=field-create.css.map */\n"] }]
  }], () => [], { open: [{ type: Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: Output, args: ["openChange"] }], context: [{ type: Input, args: [{ isSignal: true, alias: "context", required: false }] }], presetFarmId: [{ type: Input, args: [{ isSignal: true, alias: "presetFarmId", required: false }] }], created: [{ type: Output, args: ["created"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldCreate, { className: "FieldCreate", filePath: "src/app/features/fields/field-create.ts", lineNumber: 110 });
})();

// src/app/features/fields/land-use.ts
var _forTrack03 = ($index, $item) => $item.year;
var _forTrack12 = ($index, $item) => $item.id;
function LandUse_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function LandUse_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openAdd());
    });
    \u0275\u0275element(1, "vc-icon", 28);
    \u0275\u0275text(2, "Add land-use period");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function LandUse_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 3);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function LandUse_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "vc-error", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function LandUse_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 5);
  }
}
function LandUse_Conditional_7_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 39);
    \u0275\u0275pipe(1, "human");
  }
  if (rf & 2) {
    const y_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("background", y_r3.use ? ctx_r1.color(y_r3.use) : null);
    \u0275\u0275classProp("gap", !y_r3.use)("multi", y_r3.count > 1);
    \u0275\u0275property("title", y_r3.year + ": " + (y_r3.use ? \u0275\u0275pipeBind1(1, 7, y_r3.use) : "no record"));
  }
}
function LandUse_Conditional_7_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const y_r4 = ctx.$implicit;
    const \u0275$index_34_r5 = ctx.$index;
    const \u0275$count_34_r6 = ctx.$count;
    \u0275\u0275classProp("show", y_r4.year % 5 === 0 || \u0275$index_34_r5 === 0 || \u0275$index_34_r5 === \u0275$count_34_r6 - 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(y_r4.year);
  }
}
function LandUse_Conditional_7_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275element(1, "span", 40);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r1.color(u_r7));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 3, u_r7));
  }
}
function LandUse_Conditional_7_For_15_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r8.source);
  }
}
function LandUse_Conditional_7_For_15_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r8.notes);
  }
}
function LandUse_Conditional_7_For_15_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 49);
    \u0275\u0275listener("click", function LandUse_Conditional_7_For_15_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const r_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.viewEvidence(r_r8.evidence_id));
    });
    \u0275\u0275element(1, "vc-icon", 50);
    \u0275\u0275text(2, "Evidence");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function LandUse_Conditional_7_For_15_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275element(1, "vc-icon", 51);
    \u0275\u0275text(2, "No evidence");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function LandUse_Conditional_7_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "div", 41);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 42)(4, "div", 43)(5, "vc-chip", 44);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "human");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, LandUse_Conditional_7_For_15_Conditional_8_Template, 2, 1, "span", 1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, LandUse_Conditional_7_For_15_Conditional_9_Template, 2, 1, "p", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 46);
    \u0275\u0275conditionalCreate(11, LandUse_Conditional_7_For_15_Conditional_11_Template, 3, 1, "button", 47)(12, LandUse_Conditional_7_For_15_Conditional_12_Template, 3, 1, "span", 48);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", r_r8.from_year, "", r_r8.to_year !== r_r8.from_year ? " \u2013 " + r_r8.to_year : "");
    \u0275\u0275advance(3);
    \u0275\u0275property("swatch", ctx_r1.color(r_r8.land_use));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 7, r_r8.land_use));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r8.source ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r8.notes ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r8.evidence_id ? 11 : 12);
  }
}
function LandUse_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 31);
    \u0275\u0275repeaterCreate(2, LandUse_Conditional_7_For_3_Template, 2, 9, "div", 32, _forTrack03);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 33);
    \u0275\u0275repeaterCreate(5, LandUse_Conditional_7_For_6_Template, 2, 3, "span", 34, _forTrack03);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 35);
    \u0275\u0275repeaterCreate(8, LandUse_Conditional_7_For_9_Template, 4, 5, "span", 36, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(10, "span", 36);
    \u0275\u0275element(11, "span", 37);
    \u0275\u0275text(12, "No record");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "ul", 38);
    \u0275\u0275repeaterCreate(14, LandUse_Conditional_7_For_15_Template, 13, 9, "li", null, _forTrack12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.years());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.years());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.usedTypes());
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.sorted());
  }
}
function LandUse_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 52);
    \u0275\u0275listener("click", function LandUse_For_23_Template_button_click_0_listener() {
      const u_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.landUse.set(u_r11));
    });
    \u0275\u0275element(1, "span", 40);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "human");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.landUse() === u_r11);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r1.color(u_r11));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(3, 5, u_r11), " ");
  }
}
function LandUse_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.formError());
  }
}
var LandUse = class _LandUse {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  fieldId = input.required(
    ...ngDevMode ? [{ debugName: "fieldId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  uses = LAND_USES;
  items = signal(
    [],
    ...ngDevMode ? [{ debugName: "items" }] : (
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
  addOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "addOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fromYear = signal(
    (/* @__PURE__ */ new Date()).getFullYear() - 10,
    ...ngDevMode ? [{ debugName: "fromYear" }] : (
      /* istanbul ignore next */
      []
    )
  );
  toYear = signal(
    (/* @__PURE__ */ new Date()).getFullYear() - 1,
    ...ngDevMode ? [{ debugName: "toYear" }] : (
      /* istanbul ignore next */
      []
    )
  );
  landUse = signal(
    "",
    ...ngDevMode ? [{ debugName: "landUse" }] : (
      /* istanbul ignore next */
      []
    )
  );
  source = signal(
    "",
    ...ngDevMode ? [{ debugName: "source" }] : (
      /* istanbul ignore next */
      []
    )
  );
  notes = signal(
    "",
    ...ngDevMode ? [{ debugName: "notes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  file = signal(
    null,
    ...ngDevMode ? [{ debugName: "file" }] : (
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
  sorted = computed(
    () => [...this.items()].sort((a, b) => b.from_year - a.from_year),
    ...ngDevMode ? [{ debugName: "sorted" }] : (
      /* istanbul ignore next */
      []
    )
  );
  usedTypes = computed(
    () => [...new Set(this.items().map((i) => i.land_use))],
    ...ngDevMode ? [{ debugName: "usedTypes" }] : (
      /* istanbul ignore next */
      []
    )
  );
  years = computed(
    () => {
      const it = this.items();
      const now = (/* @__PURE__ */ new Date()).getFullYear();
      const min = Math.min(now - 10, ...it.map((i) => i.from_year));
      const out = [];
      for (let y = min; y <= now; y++) {
        const hits = it.filter((i) => i.from_year <= y && i.to_year >= y);
        out.push({ year: y, use: hits.length ? hits[hits.length - 1].land_use : null, count: hits.length });
      }
      return out;
    },
    ...ngDevMode ? [{ debugName: "years" }] : (
      /* istanbul ignore next */
      []
    )
  );
  valid = computed(
    () => !!this.landUse() && this.fromYear() >= 1900 && this.toYear() >= this.fromYear() && this.toYear() <= (/* @__PURE__ */ new Date()).getFullYear(),
    ...ngDevMode ? [{ debugName: "valid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      this.fieldId();
      this.load();
    });
  }
  color(u) {
    return LAND_USE_COLOR[u] ?? "var(--stone-400)";
  }
  load() {
    this.loading.set(true);
    this.api.get(`/fields/${this.fieldId()}/land-use`).subscribe({
      next: (r) => {
        this.items.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  openAdd() {
    this.formError.set(null);
    this.landUse.set("");
    this.source.set("");
    this.notes.set("");
    this.file.set(null);
    this.addOpen.set(true);
  }
  async save() {
    this.saving.set(true);
    this.formError.set(null);
    try {
      let evidenceId = null;
      const f = this.file();
      if (f) {
        const ev = await firstValueFrom(this.api.upload("/evidence", evidenceForm(f, "document", "field", this.fieldId())));
        evidenceId = ev.id;
      }
      await firstValueFrom(this.api.post(`/fields/${this.fieldId()}/land-use`, {
        from_year: this.fromYear(),
        to_year: this.toYear(),
        land_use: this.landUse(),
        evidence_id: evidenceId,
        source: this.source().trim(),
        notes: this.notes().trim()
      }));
      this.toast.success("Land-use period saved", `${this.fromYear()}\u2013${this.toYear()}${evidenceId ? ", with evidence" : ""}`);
      this.addOpen.set(false);
      this.load();
    } catch (e) {
      this.formError.set(e.message);
    } finally {
      this.saving.set(false);
    }
  }
  viewEvidence(id) {
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: (b) => window.open(URL.createObjectURL(b), "_blank"),
      error: (e) => this.toast.apiError(e, "Couldn't open the file")
    });
  }
  static \u0275fac = function LandUse_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LandUse)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LandUse, selectors: [["vc-land-use"]], inputs: { fieldId: [1, "fieldId"] }, decls: 46, vars: 11, consts: [[1, "head"], [1, "muted", "small"], [1, "btn", "btn-secondary", "btn-sm"], [3, "rows"], [1, "card-body"], ["icon", "calendar", "title", "No land-use history recorded", "text", "Record what the land was used for in past years, with a document or image as evidence where you have one."], ["title", "Add land-use period", "subtitle", "What was this land used for, and how do you know?", "width", "560px", 3, "openChange", "open"], [1, "form-grid"], [1, "field"], ["for", "lu-from"], ["id", "lu-from", "type", "number", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["for", "lu-to"], ["id", "lu-to", "type", "number", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "field", "span-2"], [1, "label"], [1, "uses"], ["type", "button", 1, "use", 3, "on"], ["for", "lu-src"], ["id", "lu-src", "placeholder", "e.g. Village land records (RTC), farmer interview, 2015 satellite image", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "lu-notes"], [1, "subtle"], ["id", "lu-notes", "rows", "2", 1, "input", 3, "ngModelChange", "ngModel"], ["label", "Attach a land record, photo or image", "hint", "PDF, JPG or PNG \xB7 stored with a tamper-evident fingerprint", 3, "fileChange", "file"], ["tone", "danger", "icon", "alert", 1, "mt"], ["footer", "", 1, "ft"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "plus", 3, "size"], ["title", "Couldn't load land-use history", 3, "message"], [1, "strip-wrap"], [1, "strip"], [1, "yr", 3, "gap", "background", "multi", "title"], [1, "axis"], [3, "show"], [1, "legend"], [1, "li"], [1, "sw", "gap"], [1, "list"], [1, "yr", 3, "title"], [1, "sw"], [1, "yrs", "num"], [1, "c"], [1, "row-a"], ["tone", "outline", 3, "swatch"], [1, "notes"], [1, "ev"], [1, "btn", "btn-ghost", "btn-sm"], ["title", "No supporting document attached", 1, "missing"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "file", 3, "size"], ["name", "file-warning", 3, "size"], ["type", "button", 1, "use", 3, "click"]], template: function LandUse_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "p", 1);
      \u0275\u0275text(2, "Eligibility checks look back over this history \u2014 for example, recent conversion from forest can disqualify a field.");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, LandUse_Conditional_3_Template, 3, 1, "button", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, LandUse_Conditional_4_Template, 1, 1, "vc-loading", 3)(5, LandUse_Conditional_5_Template, 2, 1, "div", 4)(6, LandUse_Conditional_6_Template, 1, 0, "vc-empty", 5)(7, LandUse_Conditional_7_Template, 16, 0);
      \u0275\u0275elementStart(8, "vc-modal", 6);
      \u0275\u0275twoWayListener("openChange", function LandUse_Template_vc_modal_openChange_8_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.addOpen, $event) || (ctx.addOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(9, "div", 7)(10, "div", 8)(11, "label", 9);
      \u0275\u0275text(12, "From year");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "input", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LandUse_Template_input_ngModelChange_13_listener($event) {
        return ctx.fromYear.set(+$event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 8)(15, "label", 11);
      \u0275\u0275text(16, "To year");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 12);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LandUse_Template_input_ngModelChange_17_listener($event) {
        return ctx.toYear.set(+$event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 13)(19, "span", 14);
      \u0275\u0275text(20, "Land use");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 15);
      \u0275\u0275repeaterCreate(22, LandUse_For_23_Template, 4, 7, "button", 16, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 13)(25, "label", 17);
      \u0275\u0275text(26, "Source");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "input", 18);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LandUse_Template_input_ngModelChange_27_listener($event) {
        return ctx.source.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div", 13)(29, "label", 19);
      \u0275\u0275text(30, "Notes ");
      \u0275\u0275elementStart(31, "span", 20);
      \u0275\u0275text(32, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "textarea", 21);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function LandUse_Template_textarea_ngModelChange_33_listener($event) {
        return ctx.notes.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "div", 13)(35, "span", 14);
      \u0275\u0275text(36, "Evidence ");
      \u0275\u0275elementStart(37, "span", 20);
      \u0275\u0275text(38, "(recommended)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "vc-file-drop", 22);
      \u0275\u0275twoWayListener("fileChange", function LandUse_Template_vc_file_drop_fileChange_39_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.file, $event) || (ctx.file = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(40, LandUse_Conditional_40_Template, 2, 1, "vc-callout", 23);
      \u0275\u0275elementStart(41, "div", 24)(42, "button", 25);
      \u0275\u0275listener("click", function LandUse_Template_button_click_42_listener() {
        return ctx.addOpen.set(false);
      });
      \u0275\u0275text(43, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "button", 26);
      \u0275\u0275listener("click", function LandUse_Template_button_click_44_listener() {
        return ctx.save();
      });
      \u0275\u0275text(45);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.auth.can("land.manage") ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 4 : ctx.error() ? 5 : !ctx.items().length ? 6 : 7);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.addOpen);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngModel", ctx.fromYear());
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.toYear());
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.uses);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngModel", ctx.source());
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275property("ngModel", ctx.notes());
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("file", ctx.file);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formError() ? 40 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.valid() || ctx.saving());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Saving\u2026" : "Save period");
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgModel, Loading, ErrorBox, Empty, Icon, Modal, FileDrop, Callout, Chip, HumanPipe], styles: ["\n.head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--%NS%border);\n}\n.head[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.strip-wrap[_ngcontent-%COMP%] {\n  padding: 18px 20px 10px;\n}\n.strip[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2px;\n  height: 28px;\n}\n.yr[_ngcontent-%COMP%] {\n  flex: 1;\n  border-radius: 3px;\n  min-width: 4px;\n}\n.yr.gap[_ngcontent-%COMP%] {\n  background:\n    repeating-linear-gradient(\n      135deg,\n      var(--%NS%sand-200),\n      var(--%NS%sand-200) 3px,\n      var(--%NS%sand-100) 3px,\n      var(--%NS%sand-100) 6px);\n}\n.yr.multi[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.55);\n}\n.axis[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2px;\n  margin-top: 6px;\n}\n.axis[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 4px;\n  font-size: 10.5px;\n  color: var(--%NS%text-3);\n  text-align: center;\n  visibility: hidden;\n  font-variant-numeric: tabular-nums;\n}\n.axis[_ngcontent-%COMP%]   span.show[_ngcontent-%COMP%] {\n  visibility: visible;\n}\n.legend[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 14px;\n  flex-wrap: wrap;\n  margin-top: 12px;\n}\n.li[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.sw[_ngcontent-%COMP%] {\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n  flex: none;\n}\n.sw.gap[_ngcontent-%COMP%] {\n  background:\n    repeating-linear-gradient(\n      135deg,\n      var(--%NS%sand-300),\n      var(--%NS%sand-300) 2px,\n      var(--%NS%sand-100) 2px,\n      var(--%NS%sand-100) 4px);\n}\n.list[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  border-top: 1px solid var(--%NS%border);\n}\n.list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  padding: 12px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.yrs[_ngcontent-%COMP%] {\n  width: 96px;\n  flex: none;\n  font-weight: 600;\n  padding-top: 2px;\n}\n.c[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.row-a[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.notes[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  font-size: 13px;\n  color: var(--%NS%stone-700);\n}\n.missing[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n  font-size: 12px;\n  color: var(--%NS%amber-600);\n  padding: 4px 8px;\n  border-radius: 6px;\n  background: var(--%NS%warn-soft);\n}\n.uses[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.use[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  height: 32px;\n  padding: 0 12px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 7px;\n  background: var(--%NS%surface);\n  font: inherit;\n  font-size: 13px;\n  cursor: pointer;\n  color: var(--%NS%stone-800);\n}\n.use[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.use.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  box-shadow: 0 0 0 1px var(--%NS%forest-500) inset;\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=land-use.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LandUse, [{
    type: Component,
    args: [{ selector: "vc-land-use", imports: [FormsModule, Loading, ErrorBox, Empty, Icon, Modal, FileDrop, Callout, Chip, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="head">
      <p class="muted small">Eligibility checks look back over this history \u2014 for example, recent conversion from forest can disqualify a field.</p>
      @if (auth.can('land.manage')) {
        <button class="btn btn-secondary btn-sm" (click)="openAdd()"><vc-icon name="plus" [size]="14" />Add land-use period</button>
      }
    </div>

    @if (loading()) { <vc-loading [rows]="3" /> }
    @else if (error()) { <div class="card-body"><vc-error title="Couldn't load land-use history" [message]="error()!" /></div> }
    @else if (!items().length) {
      <vc-empty icon="calendar" title="No land-use history recorded"
        text="Record what the land was used for in past years, with a document or image as evidence where you have one." />
    } @else {
      <div class="strip-wrap">
        <div class="strip">
          @for (y of years(); track y.year) {
            <div class="yr" [class.gap]="!y.use" [style.background]="y.use ? color(y.use) : null"
              [class.multi]="y.count > 1" [title]="y.year + ': ' + (y.use ? (y.use | human) : 'no record')"></div>
          }
        </div>
        <div class="axis">
          @for (y of years(); track y.year) { <span [class.show]="y.year % 5 === 0 || $first || $last">{{ y.year }}</span> }
        </div>
        <div class="legend">
          @for (u of usedTypes(); track u) { <span class="li"><span class="sw" [style.background]="color(u)"></span>{{ u | human }}</span> }
          <span class="li"><span class="sw gap"></span>No record</span>
        </div>
      </div>

      <ul class="list">
        @for (r of sorted(); track r.id) {
          <li>
            <div class="yrs num">{{ r.from_year }}{{ r.to_year !== r.from_year ? ' \u2013 ' + r.to_year : '' }}</div>
            <div class="c">
              <div class="row-a">
                <vc-chip [swatch]="color(r.land_use)" tone="outline">{{ r.land_use | human }}</vc-chip>
                @if (r.source) { <span class="muted small">{{ r.source }}</span> }
              </div>
              @if (r.notes) { <p class="notes">{{ r.notes }}</p> }
            </div>
            <div class="ev">
              @if (r.evidence_id) {
                <button class="btn btn-ghost btn-sm" (click)="viewEvidence(r.evidence_id)"><vc-icon name="file" [size]="14" />Evidence</button>
              } @else {
                <span class="missing" title="No supporting document attached"><vc-icon name="file-warning" [size]="13" />No evidence</span>
              }
            </div>
          </li>
        }
      </ul>
    }

    <vc-modal [(open)]="addOpen" title="Add land-use period" subtitle="What was this land used for, and how do you know?" width="560px">
      <div class="form-grid">
        <div class="field"><label for="lu-from">From year</label><input id="lu-from" type="number" class="input num" [ngModel]="fromYear()" (ngModelChange)="fromYear.set(+$event)" /></div>
        <div class="field"><label for="lu-to">To year</label><input id="lu-to" type="number" class="input num" [ngModel]="toYear()" (ngModelChange)="toYear.set(+$event)" /></div>
        <div class="field span-2">
          <span class="label">Land use</span>
          <div class="uses">
            @for (u of uses; track u) {
              <button type="button" class="use" [class.on]="landUse() === u" (click)="landUse.set(u)">
                <span class="sw" [style.background]="color(u)"></span>{{ u | human }}
              </button>
            }
          </div>
        </div>
        <div class="field span-2">
          <label for="lu-src">Source</label>
          <input id="lu-src" class="input" [ngModel]="source()" (ngModelChange)="source.set($event)" placeholder="e.g. Village land records (RTC), farmer interview, 2015 satellite image" />
        </div>
        <div class="field span-2">
          <label for="lu-notes">Notes <span class="subtle">(optional)</span></label>
          <textarea id="lu-notes" class="input" rows="2" [ngModel]="notes()" (ngModelChange)="notes.set($event)"></textarea>
        </div>
        <div class="field span-2">
          <span class="label">Evidence <span class="subtle">(recommended)</span></span>
          <vc-file-drop [(file)]="file" label="Attach a land record, photo or image" hint="PDF, JPG or PNG \xB7 stored with a tamper-evident fingerprint" />
        </div>
      </div>
      @if (formError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ formError() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="addOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!valid() || saving()" (click)="save()">{{ saving() ? 'Saving\u2026' : 'Save period' }}</button>
      </div>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;466198cd2e8542cf;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\land-use.ts */\n.head {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--border);\n}\n.head p {\n  flex: 1;\n}\n.strip-wrap {\n  padding: 18px 20px 10px;\n}\n.strip {\n  display: flex;\n  gap: 2px;\n  height: 28px;\n}\n.yr {\n  flex: 1;\n  border-radius: 3px;\n  min-width: 4px;\n}\n.yr.gap {\n  background:\n    repeating-linear-gradient(\n      135deg,\n      var(--sand-200),\n      var(--sand-200) 3px,\n      var(--sand-100) 3px,\n      var(--sand-100) 6px);\n}\n.yr.multi {\n  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.55);\n}\n.axis {\n  display: flex;\n  gap: 2px;\n  margin-top: 6px;\n}\n.axis span {\n  flex: 1;\n  min-width: 4px;\n  font-size: 10.5px;\n  color: var(--text-3);\n  text-align: center;\n  visibility: hidden;\n  font-variant-numeric: tabular-nums;\n}\n.axis span.show {\n  visibility: visible;\n}\n.legend {\n  display: flex;\n  gap: 14px;\n  flex-wrap: wrap;\n  margin-top: 12px;\n}\n.li {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--text-2);\n}\n.sw {\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n  flex: none;\n}\n.sw.gap {\n  background:\n    repeating-linear-gradient(\n      135deg,\n      var(--sand-300),\n      var(--sand-300) 2px,\n      var(--sand-100) 2px,\n      var(--sand-100) 4px);\n}\n.list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  border-top: 1px solid var(--border);\n}\n.list li {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  padding: 12px 20px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.list li:last-child {\n  border-bottom: 0;\n}\n.yrs {\n  width: 96px;\n  flex: none;\n  font-weight: 600;\n  padding-top: 2px;\n}\n.c {\n  flex: 1;\n  min-width: 0;\n}\n.row-a {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.notes {\n  margin-top: 4px;\n  font-size: 13px;\n  color: var(--stone-700);\n}\n.missing {\n  display: inline-flex;\n  gap: 5px;\n  align-items: center;\n  font-size: 12px;\n  color: var(--amber-600);\n  padding: 4px 8px;\n  border-radius: 6px;\n  background: var(--warn-soft);\n}\n.uses {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.use {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  height: 32px;\n  padding: 0 12px;\n  border: 1px solid var(--border-strong);\n  border-radius: 7px;\n  background: var(--surface);\n  font: inherit;\n  font-size: 13px;\n  cursor: pointer;\n  color: var(--stone-800);\n}\n.use:hover {\n  border-color: var(--stone-400);\n}\n.use.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  box-shadow: 0 0 0 1px var(--forest-500) inset;\n}\n.mt {\n  margin-top: 14px;\n}\n.ft {\n  display: flex;\n  gap: 8px;\n}\n/*# sourceMappingURL=land-use.css.map */\n"] }]
  }], () => [], { fieldId: [{ type: Input, args: [{ isSignal: true, alias: "fieldId", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LandUse, { className: "LandUse", filePath: "src/app/features/fields/land-use.ts", lineNumber: 149 });
})();

// src/app/features/fields/field-detail.page.ts
var _c04 = () => ["/app/supporting"];
var _c12 = (a0) => ({ field_id: a0 });
var _c2 = () => ["/app/satellite"];
var _c3 = (a0) => ["/app/farmers", a0];
var _c4 = (a0) => ({ field_id: a0, record: 1 });
var _c5 = () => ["/app/practices"];
var _c6 = (a0) => ({ record_id: a0 });
var _c7 = (a0) => ["/app/fields", a0];
var _forTrack04 = ($index, $item) => $item.key;
var _forTrack13 = ($index, $item) => $item.code;
var _forTrack2 = ($index, $item) => $item.id;
function FieldDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-loading", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function FieldDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function FieldDetailPage_Conditional_5_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(", ", ctx_r0.farm().village);
  }
}
function FieldDetailPage_Conditional_5_Conditional_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate1(", ", ctx_r0.farm().district);
  }
}
function FieldDetailPage_Conditional_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275conditionalCreate(1, FieldDetailPage_Conditional_5_Conditional_9_Conditional_1_Template, 1, 1);
    \u0275\u0275conditionalCreate(2, FieldDetailPage_Conditional_5_Conditional_9_Conditional_2_Template, 1, 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.farm().name);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.farm().village ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.farm().district ? 2 : -1);
  }
}
function FieldDetailPage_Conditional_5_Conditional_10_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 67);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Conditional_10_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openBoundary());
    });
    \u0275\u0275element(1, "vc-icon", 70);
    \u0275\u0275text(2, "Edit boundary");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 54);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Conditional_10_Conditional_4_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.statusOpen.set(true));
    });
    \u0275\u0275element(4, "vc-icon", 71);
    \u0275\u0275text(5, "Retire");
    \u0275\u0275elementEnd();
  }
}
function FieldDetailPage_Conditional_5_Conditional_10_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 67);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Conditional_10_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.statusOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 72);
    \u0275\u0275text(2, "Reactivate");
    \u0275\u0275elementEnd();
  }
}
function FieldDetailPage_Conditional_5_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "button", 67);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Conditional_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openEdit());
    });
    \u0275\u0275element(2, "vc-icon", 68);
    \u0275\u0275text(3, "Edit details");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, FieldDetailPage_Conditional_5_Conditional_10_Conditional_4_Template, 6, 0)(5, FieldDetailPage_Conditional_5_Conditional_10_Conditional_5_Template, 3, 0, "button", 69);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional(f_r6.status === "active" ? 4 : 5);
  }
}
function FieldDetailPage_Conditional_5_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-chip", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("swatch", ctx_r0.cropColor());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.crop().name);
  }
}
function FieldDetailPage_Conditional_5_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "code");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r6.crop_code);
  }
}
function FieldDetailPage_Conditional_5_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1, "Not set");
    \u0275\u0275elementEnd();
  }
}
function FieldDetailPage_Conditional_5_For_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r7.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r7.value);
  }
}
function FieldDetailPage_Conditional_5_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 73);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, "\xA0");
    \u0275\u0275elementStart(3, "span", 74);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(3, _c3, ctx_r0.farmer().id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.farmer().full_name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.farmer().code);
  }
}
function FieldDetailPage_Conditional_5_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2014 ");
  }
}
function FieldDetailPage_Conditional_5_Case_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-boundary-history", 35);
  }
  if (rf & 2) {
    const f_r6 = \u0275\u0275nextContext();
    \u0275\u0275property("fieldId", f_r6.id)("refresh", f_r6.version);
  }
}
function FieldDetailPage_Conditional_5_Case_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-land-use", 36);
  }
  if (rf & 2) {
    const f_r6 = \u0275\u0275nextContext();
    \u0275\u0275property("fieldId", f_r6.id);
  }
}
function FieldDetailPage_Conditional_5_Case_87_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function FieldDetailPage_Conditional_5_Case_87_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 75)(1, "a", 77);
    \u0275\u0275element(2, "vc-icon", 78);
    \u0275\u0275text(3, "Record a practice");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r6 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("queryParams", \u0275\u0275pureFunction1(1, _c4, f_r6.id));
  }
}
function FieldDetailPage_Conditional_5_Case_87_Conditional_2_For_19_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-badge", 85);
    \u0275\u0275text(1, "Missing");
    \u0275\u0275elementEnd();
  }
}
function FieldDetailPage_Conditional_5_Case_87_Conditional_2_For_19_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 86);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r8.evidence_ids.length, " file", p_r8.evidence_ids.length === 1 ? "" : "s");
  }
}
function FieldDetailPage_Conditional_5_Case_87_Conditional_2_For_19_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function FieldDetailPage_Conditional_5_Case_87_Conditional_2_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 80)(1, "td", 81);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td")(7, "vc-chip", 82);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td", 83);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 84);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275conditionalCreate(16, FieldDetailPage_Conditional_5_Case_87_Conditional_2_For_19_Conditional_16_Template, 2, 0, "vc-badge", 85)(17, FieldDetailPage_Conditional_5_Case_87_Conditional_2_For_19_Conditional_17_Template, 2, 2, "span", 86)(18, FieldDetailPage_Conditional_5_Case_87_Conditional_2_For_19_Conditional_18_Template, 2, 0, "span", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td", 24);
    \u0275\u0275element(20, "vc-icon", 30);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(17, _c5))("queryParams", \u0275\u0275pureFunction1(18, _c6, p_r8.record_id));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 10, p_r8.performed_on));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.ptName(p_r8.practice_code));
    \u0275\u0275advance(2);
    \u0275\u0275property("tone", p_r8.scenario === "baseline" ? "outline" : "forest");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 12, p_r8.scenario));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r8.quantity !== null ? \u0275\u0275pipeBind2(12, 14, p_r8.quantity, 2) + " " + (p_r8.unit ?? "") : "\u2014");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.source(p_r8.source));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(p_r8.missing_evidence ? 16 : p_r8.evidence_ids.length ? 17 : 18);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
  }
}
function FieldDetailPage_Conditional_5_Case_87_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 76)(1, "table", 79)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Practice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Scenario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 24);
    \u0275\u0275text(11, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Source");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Evidence");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, FieldDetailPage_Conditional_5_Case_87_Conditional_2_For_19_Template, 21, 20, "tr", 80, _forTrack2);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r0.practices());
  }
}
function FieldDetailPage_Conditional_5_Case_87_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FieldDetailPage_Conditional_5_Case_87_Conditional_0_Template, 1, 1, "vc-loading", 4)(1, FieldDetailPage_Conditional_5_Case_87_Conditional_1_Template, 4, 3, "vc-empty", 75)(2, FieldDetailPage_Conditional_5_Case_87_Conditional_2_Template, 20, 0, "div", 76);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.practicesLoading() ? 0 : !ctx_r0.practices().length ? 1 : 2);
  }
}
function FieldDetailPage_Conditional_5_For_101_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r9 = ctx.$implicit;
    \u0275\u0275property("value", c_r9.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r9.name);
  }
}
function FieldDetailPage_Conditional_5_Conditional_102_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 46)(1, "vc-attr-inputs", 87);
    \u0275\u0275twoWayListener("valuesChange", function FieldDetailPage_Conditional_5_Conditional_102_Template_vc_attr_inputs_valuesChange_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.eAttrs, $event) || (ctx_r0.eAttrs = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("defs", ctx_r0.eCropDef().attributes);
    \u0275\u0275twoWayProperty("values", ctx_r0.eAttrs);
  }
}
function FieldDetailPage_Conditional_5_Conditional_112_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.editError());
  }
}
function FieldDetailPage_Conditional_5_Conditional_128_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 88);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r11 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(2, _c7, o_r11.fieldId));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Open ", o_r11.fieldCode);
  }
}
function FieldDetailPage_Conditional_5_Conditional_128_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 52)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275conditionalCreate(4, FieldDetailPage_Conditional_5_Conditional_128_Conditional_4_Template, 2, 4, "a", 88);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r11 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("This boundary overlaps field ", o_r11.fieldCode, ".");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", o_r11.message, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(o_r11.fieldId ? 4 : -1);
  }
}
function FieldDetailPage_Conditional_5_Conditional_129_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.bError());
  }
}
function FieldDetailPage_Conditional_5_Conditional_138_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Retired fields stay in the records and audit trail but can't be enrolled or sampled. A field that is enrolled in a project must be withdrawn first.");
    \u0275\u0275elementEnd();
  }
}
function FieldDetailPage_Conditional_5_Conditional_139_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "The field becomes active again. Its boundary is checked for overlaps with other active fields.");
    \u0275\u0275elementEnd();
  }
}
function FieldDetailPage_Conditional_5_Conditional_140_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.statusError());
  }
}
function FieldDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "header", 5)(1, "div", 6)(2, "div", 7);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 8)(5, "h1");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "vc-badge", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 10);
    \u0275\u0275conditionalCreate(9, FieldDetailPage_Conditional_5_Conditional_9_Template, 3, 3);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(10, FieldDetailPage_Conditional_5_Conditional_10_Template, 6, 1, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 12)(12, "section", 13);
    \u0275\u0275element(13, "vc-field-map", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "section", 15)(15, "div", 16)(16, "div", 17)(17, "span");
    \u0275\u0275text(18, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "vc-dc", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 19);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "num");
    \u0275\u0275elementStart(23, "small");
    \u0275\u0275text(24, "ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 20);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "dl", 21)(28, "dt");
    \u0275\u0275text(29, "Crop");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "dd");
    \u0275\u0275conditionalCreate(31, FieldDetailPage_Conditional_5_Conditional_31_Template, 2, 2, "vc-chip", 22)(32, FieldDetailPage_Conditional_5_Conditional_32_Template, 2, 1, "code")(33, FieldDetailPage_Conditional_5_Conditional_33_Template, 2, 0, "span", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(34, FieldDetailPage_Conditional_5_For_35_Template, 4, 2, null, null, _forTrack04);
    \u0275\u0275elementStart(36, "dt");
    \u0275\u0275text(37, "Soil type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "dd");
    \u0275\u0275text(39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "dt");
    \u0275\u0275text(41, "Elevation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "dd", 24);
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "dt");
    \u0275\u0275text(46, "Centre point");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "dd", 25);
    \u0275\u0275text(48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "dt");
    \u0275\u0275text(50, "Farmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "dd");
    \u0275\u0275conditionalCreate(52, FieldDetailPage_Conditional_5_Conditional_52_Template, 5, 5)(53, FieldDetailPage_Conditional_5_Conditional_53_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "dt");
    \u0275\u0275text(55, "Farm");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "dd");
    \u0275\u0275text(57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "dt");
    \u0275\u0275text(59, "Last changed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "dd");
    \u0275\u0275text(61);
    \u0275\u0275pipe(62, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "div", 26)(64, "a", 27)(65, "span", 28);
    \u0275\u0275element(66, "vc-icon", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "span")(68, "strong");
    \u0275\u0275text(69, "Supporting data");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "small");
    \u0275\u0275text(71, "Weather, soil maps and terrain for this field");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(72, "vc-icon", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "a", 27)(74, "span", 28);
    \u0275\u0275element(75, "vc-icon", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "span")(77, "strong");
    \u0275\u0275text(78, "Satellite");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "small");
    \u0275\u0275text(80, "Vegetation index and practice detection");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(81, "vc-icon", 30);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(82, "section", 32)(83, "div", 33)(84, "vc-tabs", 34);
    \u0275\u0275twoWayListener("activeChange", function FieldDetailPage_Conditional_5_Template_vc_tabs_activeChange_84_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.tab, $event) || (ctx_r0.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(85, FieldDetailPage_Conditional_5_Case_85_Template, 1, 2, "vc-boundary-history", 35)(86, FieldDetailPage_Conditional_5_Case_86_Template, 1, 1, "vc-land-use", 36)(87, FieldDetailPage_Conditional_5_Case_87_Template, 3, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "vc-modal", 37);
    \u0275\u0275twoWayListener("openChange", function FieldDetailPage_Conditional_5_Template_vc_modal_openChange_88_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.editOpen, $event) || (ctx_r0.editOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(89, "div", 38)(90, "div", 39)(91, "label", 40);
    \u0275\u0275text(92, "Field name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(93, "input", 41);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldDetailPage_Conditional_5_Template_input_ngModelChange_93_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.eName.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(94, "div", 39)(95, "label", 42);
    \u0275\u0275text(96, "Main crop");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "select", 43);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldDetailPage_Conditional_5_Template_select_ngModelChange_97_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.eCrop.set($event);
      return \u0275\u0275resetView(ctx_r0.eAttrs.set({}));
    });
    \u0275\u0275elementStart(98, "option", 44);
    \u0275\u0275text(99, "Not set");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(100, FieldDetailPage_Conditional_5_For_101_Template, 2, 2, "option", 45, _forTrack13);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(102, FieldDetailPage_Conditional_5_Conditional_102_Template, 2, 2, "div", 46);
    \u0275\u0275elementStart(103, "div", 47)(104, "div", 39)(105, "label", 48);
    \u0275\u0275text(106, "Soil type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "input", 49);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldDetailPage_Conditional_5_Template_input_ngModelChange_107_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.eSoil.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(108, "div", 39)(109, "label", 50);
    \u0275\u0275text(110, "Elevation (m)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(111, "input", 51);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldDetailPage_Conditional_5_Template_input_ngModelChange_111_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.eElev.set($event));
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(112, FieldDetailPage_Conditional_5_Conditional_112_Template, 2, 1, "vc-callout", 52);
    \u0275\u0275elementStart(113, "div", 53)(114, "button", 54);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Template_button_click_114_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.editOpen.set(false));
    });
    \u0275\u0275text(115, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(116, "button", 55);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Template_button_click_116_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.saveEdit());
    });
    \u0275\u0275text(117);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(118, "vc-modal", 56);
    \u0275\u0275twoWayListener("openChange", function FieldDetailPage_Conditional_5_Template_vc_modal_openChange_118_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.boundaryOpen, $event) || (ctx_r0.boundaryOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(119, "vc-boundary-editor", 57);
    \u0275\u0275twoWayListener("verticesChange", function FieldDetailPage_Conditional_5_Template_vc_boundary_editor_verticesChange_119_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.bVerts, $event) || (ctx_r0.bVerts = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(120, "div", 58)(121, "label", 59);
    \u0275\u0275text(122, "Why is the boundary changing? ");
    \u0275\u0275elementStart(123, "span", 60);
    \u0275\u0275text(124, "*");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(125, "textarea", 61);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldDetailPage_Conditional_5_Template_textarea_ngModelChange_125_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.bReason.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(126, "span", 62);
    \u0275\u0275text(127, "Required \u2014 at least 5 characters. Shown in the boundary history.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(128, FieldDetailPage_Conditional_5_Conditional_128_Template, 5, 3, "vc-callout", 52)(129, FieldDetailPage_Conditional_5_Conditional_129_Template, 2, 1, "vc-callout", 52);
    \u0275\u0275elementStart(130, "div", 53)(131, "span", 63);
    \u0275\u0275text(132);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(133, "button", 54);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Template_button_click_133_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.boundaryOpen.set(false));
    });
    \u0275\u0275text(134, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(135, "button", 64);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Template_button_click_135_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.saveBoundary());
    });
    \u0275\u0275text(136);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(137, "vc-modal", 65);
    \u0275\u0275twoWayListener("openChange", function FieldDetailPage_Conditional_5_Template_vc_modal_openChange_137_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.statusOpen, $event) || (ctx_r0.statusOpen = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275conditionalCreate(138, FieldDetailPage_Conditional_5_Conditional_138_Template, 2, 0, "p")(139, FieldDetailPage_Conditional_5_Conditional_139_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(140, FieldDetailPage_Conditional_5_Conditional_140_Template, 2, 1, "vc-callout", 52);
    \u0275\u0275elementStart(141, "div", 53)(142, "button", 54);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Template_button_click_142_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.statusOpen.set(false));
    });
    \u0275\u0275text(143, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(144, "button", 66);
    \u0275\u0275listener("click", function FieldDetailPage_Conditional_5_Template_button_click_144_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleStatus());
    });
    \u0275\u0275text(145);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_29_0;
    let tmp_50_0;
    const f_r6 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r6.code);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r6.name);
    \u0275\u0275advance();
    \u0275\u0275property("status", f_r6.status);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.farm() ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.auth.can("land.manage") ? 10 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("polygons", ctx_r0.mapData())("maxZoom", 17);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(22, 56, f_r6.area_ha, 2));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Computed from the boundary (version ", f_r6.version, "), not entered by hand.");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.crop() ? 31 : f_r6.crop_code ? 32 : 33);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.attrRows());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(f_r6.soil_type || "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(f_r6.elevation_m !== null ? \u0275\u0275pipeBind2(44, 59, f_r6.elevation_m, 0) + " m" : "\u2014");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", f_r6.centroid_lat.toFixed(5), ", ", f_r6.centroid_lon.toFixed(5));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.farmer() ? 52 : 53);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.farm()?.name ?? "\u2014");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(62, 62, f_r6.updated_at, true));
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(65, _c04))("queryParams", \u0275\u0275pureFunction1(66, _c12, f_r6.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(68, _c2))("queryParams", \u0275\u0275pureFunction1(69, _c12, f_r6.id));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 15);
    \u0275\u0275advance(3);
    \u0275\u0275property("tabs", ctx_r0.tabs());
    \u0275\u0275twoWayProperty("active", ctx_r0.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_29_0 = ctx_r0.tab()) === "boundary" ? 85 : tmp_29_0 === "land" ? 86 : tmp_29_0 === "practices" ? 87 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("open", ctx_r0.editOpen);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r0.eName());
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r0.eCrop());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.activeCrops());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.eCropDef()?.attributes?.length ? 102 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r0.eSoil());
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r0.eElev());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.editError() ? 112 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !!ctx_r0.editProblem() || ctx_r0.saving())("title", ctx_r0.editProblem() ?? "");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.saving() ? "Saving\u2026" : "Save changes");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.boundaryOpen);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("vertices", ctx_r0.bVerts);
    \u0275\u0275property("context", ctx_r0.neighbours());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r0.bReason());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_50_0 = ctx_r0.bOverlap()) ? 128 : ctx_r0.bError() ? 129 : -1, tmp_50_0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.boundaryProblem() ?? "Ready to save as version " + (f_r6.version + 1));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !!ctx_r0.boundaryProblem() || ctx_r0.saving());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.saving() ? "Saving\u2026" : "Save new boundary");
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("open", ctx_r0.statusOpen);
    \u0275\u0275property("title", f_r6.status === "active" ? "Retire this field?" : "Reactivate this field?");
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r6.status === "active" ? 138 : 139);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.statusError() ? 140 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("btn-danger", f_r6.status === "active")("btn-primary", f_r6.status !== "active");
    \u0275\u0275property("disabled", ctx_r0.saving());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", f_r6.status === "active" ? "Retire field" : "Reactivate field", " ");
  }
}
var FieldDetailPage = class _FieldDetailPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  field = signal(
    null,
    ...ngDevMode ? [{ debugName: "field" }] : (
      /* istanbul ignore next */
      []
    )
  );
  farm = signal(
    null,
    ...ngDevMode ? [{ debugName: "farm" }] : (
      /* istanbul ignore next */
      []
    )
  );
  farmer = signal(
    null,
    ...ngDevMode ? [{ debugName: "farmer" }] : (
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
  pts = signal(
    [],
    ...ngDevMode ? [{ debugName: "pts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  practices = signal(
    [],
    ...ngDevMode ? [{ debugName: "practices" }] : (
      /* istanbul ignore next */
      []
    )
  );
  practicesLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "practicesLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  neighboursRaw = signal(
    null,
    ...ngDevMode ? [{ debugName: "neighboursRaw" }] : (
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
    "boundary",
    ...ngDevMode ? [{ debugName: "tab" }] : (
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
  crop = computed(
    () => this.crops().find((c) => c.code === this.field()?.crop_code) ?? null,
    ...ngDevMode ? [{ debugName: "crop" }] : (
      /* istanbul ignore next */
      []
    )
  );
  activeCrops = computed(
    () => this.crops().filter((c) => c.is_active || c.code === this.field()?.crop_code),
    ...ngDevMode ? [{ debugName: "activeCrops" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropColor = computed(
    () => cropColorMap(this.crops().map((c) => c.code)).get(this.field()?.crop_code ?? "") ?? "#737c76",
    ...ngDevMode ? [{ debugName: "cropColor" }] : (
      /* istanbul ignore next */
      []
    )
  );
  attrRows = computed(
    () => {
      const f = this.field();
      if (!f)
        return [];
      const defs = this.crop()?.attributes ?? [];
      const keys = /* @__PURE__ */ new Set([...defs.map((d) => d.key), ...Object.keys(f.crop_attributes ?? {})]);
      return [...keys].filter((k) => f.crop_attributes?.[k] !== void 0).map((k) => {
        const d = defs.find((x) => x.key === k);
        return { key: k, label: d?.label ?? k, value: `${humanize(String(f.crop_attributes[k]))}${d?.unit ? " " + d.unit : ""}` };
      });
    },
    ...ngDevMode ? [{ debugName: "attrRows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "boundary", label: "Boundary history", count: this.field()?.version ?? null },
      { key: "land", label: "Land-use history" },
      { key: "practices", label: "Practices", count: this.practicesLoading() ? null : this.practices().length }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mapData = computed(
    () => {
      const f = this.field();
      if (!f)
        return null;
      return { type: "FeatureCollection", features: [{ type: "Feature", id: f.id, geometry: f.boundary, properties: { id: f.id, color: this.cropColor(), label: `<strong>${f.code}</strong> \xB7 ${f.area_ha.toFixed(2)} ha` } }] };
    },
    ...ngDevMode ? [{ debugName: "mapData" }] : (
      /* istanbul ignore next */
      []
    )
  );
  neighbours = computed(
    () => {
      const n = this.neighboursRaw();
      return n ? __spreadProps(__spreadValues({}, n), { features: n.features.filter((x) => String(x.id) !== this.id()) }) : null;
    },
    ...ngDevMode ? [{ debugName: "neighbours" }] : (
      /* istanbul ignore next */
      []
    )
  );
  // edit details
  editOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "editOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eName = signal(
    "",
    ...ngDevMode ? [{ debugName: "eName" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eCrop = signal(
    "",
    ...ngDevMode ? [{ debugName: "eCrop" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eAttrs = signal(
    {},
    ...ngDevMode ? [{ debugName: "eAttrs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eSoil = signal(
    "",
    ...ngDevMode ? [{ debugName: "eSoil" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eElev = signal(
    null,
    ...ngDevMode ? [{ debugName: "eElev" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editError = signal(
    null,
    ...ngDevMode ? [{ debugName: "editError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  eCropDef = computed(
    () => this.crops().find((c) => c.code === this.eCrop()) ?? null,
    ...ngDevMode ? [{ debugName: "eCropDef" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editProblem = computed(
    () => {
      if (!this.eName().trim())
        return "Name is required";
      const miss = missingRequired(this.eCropDef()?.attributes ?? [], this.eAttrs());
      return miss.length ? `Fill in: ${miss.join(", ")}` : null;
    },
    ...ngDevMode ? [{ debugName: "editProblem" }] : (
      /* istanbul ignore next */
      []
    )
  );
  // boundary
  boundaryOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "boundaryOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bVerts = signal(
    [],
    ...ngDevMode ? [{ debugName: "bVerts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bReason = signal(
    "",
    ...ngDevMode ? [{ debugName: "bReason" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bError = signal(
    null,
    ...ngDevMode ? [{ debugName: "bError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bOverlap = signal(
    null,
    ...ngDevMode ? [{ debugName: "bOverlap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  boundaryProblem = computed(
    () => {
      if (this.bVerts().length < 3)
        return "At least 3 corners are needed";
      if (selfIntersects(this.bVerts()))
        return "The outline crosses itself";
      if (this.bReason().trim().length < 5)
        return "Say why the boundary is changing";
      return null;
    },
    ...ngDevMode ? [{ debugName: "boundaryProblem" }] : (
      /* istanbul ignore next */
      []
    )
  );
  statusOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "statusOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  statusError = signal(
    null,
    ...ngDevMode ? [{ debugName: "statusError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.api.get("/catalogue/crops", { include_inactive: true }).subscribe({ next: (r) => this.crops.set(r) });
    this.api.get("/catalogue/practice-types", { include_inactive: true }).subscribe({ next: (r) => this.pts.set(r) });
    effect(() => this.load(this.id()));
  }
  load(id) {
    this.loading.set(true);
    this.error.set(null);
    this.api.get(`/fields/${id}`).subscribe({
      next: (f) => {
        this.field.set(f);
        this.loading.set(false);
        this.api.get(`/farms/${f.farm_id}`).subscribe({
          next: (farm) => {
            this.farm.set(farm);
            this.api.get(`/farmers/${farm.farmer_id}`).subscribe({ next: (fr) => this.farmer.set(fr), error: () => {
            } });
          },
          error: () => {
          }
        });
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
    this.practicesLoading.set(true);
    this.api.get("/practices", { field_id: id, limit: 200 }).subscribe({
      next: (r) => {
        this.practices.set(r.items);
        this.practicesLoading.set(false);
      },
      error: () => this.practicesLoading.set(false)
    });
  }
  ptName(code) {
    return this.pts().find((p) => p.code === code)?.name ?? code;
  }
  source(s) {
    return SOURCE_LABEL[s] ?? s;
  }
  openEdit() {
    const f = this.field();
    this.eName.set(f.name);
    this.eCrop.set(f.crop_code ?? "");
    this.eAttrs.set(__spreadValues({}, f.crop_attributes ?? {}));
    this.eSoil.set(f.soil_type ?? "");
    this.eElev.set(f.elevation_m);
    this.editError.set(null);
    this.editOpen.set(true);
  }
  saveEdit() {
    this.saving.set(true);
    const elev = this.eElev();
    this.api.patch(`/fields/${this.id()}`, {
      name: this.eName().trim(),
      crop_code: this.eCrop() || null,
      crop_attributes: this.eAttrs(),
      soil_type: this.eSoil().trim() || null,
      elevation_m: elev === null || elev === "" ? null : Number(elev)
    }).subscribe({
      next: (f) => {
        this.field.set(f);
        this.saving.set(false);
        this.editOpen.set(false);
        this.toast.success("Field updated");
      },
      error: (e) => {
        this.saving.set(false);
        this.editError.set(e.message);
      }
    });
  }
  openBoundary() {
    this.bVerts.set(outerRing(this.field().boundary));
    this.bReason.set("");
    this.bError.set(null);
    this.bOverlap.set(null);
    if (!this.neighboursRaw()) {
      this.api.get("/fields/geojson").subscribe({ next: (r) => this.neighboursRaw.set(r) });
    }
    this.boundaryOpen.set(true);
  }
  saveBoundary() {
    this.saving.set(true);
    this.bError.set(null);
    this.bOverlap.set(null);
    this.api.patch(`/fields/${this.id()}`, { boundary: toPolygon(this.bVerts()), reason: this.bReason().trim() }).subscribe({
      next: (f) => {
        const before = this.field().area_ha;
        this.field.set(f);
        this.saving.set(false);
        this.boundaryOpen.set(false);
        this.tab.set("boundary");
        this.toast.success(`Boundary saved as version ${f.version}`, `Area ${before.toFixed(2)} \u2192 ${f.area_ha.toFixed(2)} ha`);
      },
      error: (e) => {
        this.saving.set(false);
        const o = overlapOf(e);
        if (o)
          this.bOverlap.set(o);
        else
          this.bError.set(e.message);
      }
    });
  }
  toggleStatus() {
    const next = this.field().status === "active" ? "retired" : "active";
    this.saving.set(true);
    this.statusError.set(null);
    this.api.patch(`/fields/${this.id()}`, { status: next }).subscribe({
      next: (f) => {
        this.field.set(f);
        this.saving.set(false);
        this.statusOpen.set(false);
        this.toast.success(next === "retired" ? "Field retired" : "Field reactivated");
      },
      error: (e) => {
        this.saving.set(false);
        this.statusError.set(e.message);
      }
    });
  }
  static \u0275fac = function FieldDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldDetailPage, selectors: [["vc-field-detail"]], inputs: { id: [1, "id"] }, decls: 6, vars: 2, consts: [["routerLink", "/app/fields", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this field", 3, "message"], [3, "rows"], [1, "hdr"], [1, "t"], [1, "eyebrow", "mono"], [1, "row-t"], [3, "status"], [1, "sub"], [1, "actions"], [1, "top"], [1, "card", "map-card"], ["height", "100%", 3, "polygons", "maxZoom"], [1, "card", "facts"], [1, "area-tile"], [1, "a-top"], ["cls", "CALCULATED"], [1, "a-val", "num"], [1, "a-note"], [1, "kv"], ["tone", "outline", 3, "swatch"], [1, "subtle"], [1, "num"], [1, "mono", "small"], [1, "links"], [1, "lk", 3, "routerLink", "queryParams"], [1, "li-ic"], ["name", "rain", 3, "size"], ["name", "chevron-right", 3, "size"], ["name", "satellite", 3, "size"], [1, "card", "tabs-card"], [1, "tabs-pad"], [3, "activeChange", "tabs", "active"], [3, "fieldId", "refresh"], [3, "fieldId"], ["title", "Edit field details", "subtitle", "Changes are recorded in the audit log.", "width", "560px", 3, "openChange", "open"], [1, "stack"], [1, "field"], ["for", "e-name"], ["id", "e-name", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "e-crop"], ["id", "e-crop", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "attrs"], [1, "form-grid"], ["for", "e-soil"], ["id", "e-soil", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "e-elev"], ["id", "e-elev", "type", "number", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["tone", "danger", "icon", "alert", 1, "mt"], ["footer", "", 1, "ft"], [1, "btn", "btn-ghost", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled", "title"], ["title", "Edit boundary", "width", "1040px", "subtitle", "Move, add or remove corners. The previous boundary is kept as a version; the area is recomputed on save.", 3, "openChange", "open"], ["mapHeight", "440px", 3, "verticesChange", "vertices", "context"], [1, "field", "reason"], ["for", "b-reason"], [1, "req"], ["id", "b-reason", "rows", "2", "placeholder", "e.g. Re-walked with GPS; the eastern edge follows the new fence line", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], [1, "subtle", "small", "grow"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["width", "480px", 3, "openChange", "open", "title"], [1, "btn", 3, "click", "disabled"], [1, "btn", "btn-secondary", 3, "click"], ["name", "pencil"], [1, "btn", "btn-secondary"], ["name", "pen-line"], ["name", "archive"], ["name", "undo"], [3, "routerLink"], [1, "subtle", "small", "mono"], ["icon", "sprout", "title", "No practices recorded", "text", "Practices recorded in the field app, by partners or here appear in this list."], [1, "table-wrap"], ["routerLink", "/app/practices", 1, "btn", "btn-secondary", 3, "queryParams"], ["name", "plus"], [1, "table"], [1, "clickable", 3, "routerLink", "queryParams"], [1, "nowrap"], [3, "tone"], [1, "num", "nowrap"], [1, "muted"], ["status", "warning"], [1, "muted", "small"], [3, "valuesChange", "defs", "values"], ["target", "_blank", 3, "routerLink"]], template: function FieldDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All fields");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, FieldDetailPage_Conditional_3_Template, 2, 1, "div", 2)(4, FieldDetailPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, FieldDetailPage_Conditional_5_Template, 146, 71);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.field()) ? 5 : -1, tmp_1_0);
    }
  }, dependencies: [
    FormsModule,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    NumberValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgModel,
    RouterLink,
    Icon,
    Badge,
    DataClass,
    Empty,
    ErrorBox,
    Loading,
    Modal,
    Tabs,
    Callout,
    FieldMap,
    Chip,
    AttrInputs,
    BoundaryEditor,
    BoundaryHistory,
    LandUse,
    NumPipe,
    DayPipe,
    HumanPipe
  ], styles: ["\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-bottom: 14px;\n}\n.back[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%forest-700);\n  text-decoration: none;\n}\n.hdr[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  gap: 16px;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n}\n.t[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 260px;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--%NS%forest-500);\n  letter-spacing: 0.04em;\n  margin-bottom: 4px;\n}\n.row-t[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.sub[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  color: var(--%NS%text-2);\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.top[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);\n  gap: 16px;\n  margin-bottom: 16px;\n}\n@media (max-width: 1100px) {\n  .top[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .map-card[_ngcontent-%COMP%] {\n    height: 380px;\n  }\n}\n.map-card[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  min-height: 440px;\n}\n.map-card[_ngcontent-%COMP%]   vc-field-map[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  border: 0;\n}\n.facts[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.area-tile[_ngcontent-%COMP%] {\n  margin: 16px 16px 4px;\n  padding: 16px;\n  border-radius: var(--%NS%radius);\n  background:\n    linear-gradient(\n      150deg,\n      var(--%NS%forest-800),\n      var(--%NS%forest-600));\n  color: #fff;\n}\n.a-top[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 12.5px;\n  color: rgba(255, 255, 255, 0.75);\n}\n.a-val[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 4px;\n}\n.a-val[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  margin-left: 5px;\n  color: rgba(255, 255, 255, 0.72);\n}\n.a-note[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: rgba(255, 255, 255, 0.75);\n  margin-top: 2px;\n}\n.kv[_ngcontent-%COMP%] {\n  padding: 16px 20px;\n  grid-template-columns: minmax(110px, 36%) 1fr;\n}\n.links[_ngcontent-%COMP%] {\n  margin-top: auto;\n  border-top: 1px solid var(--%NS%border);\n}\n.lk[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  color: var(--%NS%stone-800);\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.lk[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.lk[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%forest-50);\n  text-decoration: none;\n}\n.lk[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:nth-child(2) {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.lk[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-weight: 500;\n  font-size: 13.5px;\n}\n.lk[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.li-ic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  background: var(--%NS%sky-100);\n  color: var(--%NS%sky-600);\n}\n.lk[_ngcontent-%COMP%]:nth-child(2)   .li-ic[_ngcontent-%COMP%] {\n  background: var(--%NS%violet-100);\n  color: var(--%NS%violet-600);\n}\n.tabs-card[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.tabs-pad[_ngcontent-%COMP%] {\n  padding: 4px 12px 0;\n}\n.tabs-pad[_ngcontent-%COMP%]   vc-tabs[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n  border-bottom: 0;\n}\n.tabs-card[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:not(.tabs-pad) {\n  border-top: 1px solid var(--%NS%border);\n}\n.attrs[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-radius: var(--%NS%radius-sm);\n  background: var(--%NS%surface-2);\n  border: 1px solid var(--%NS%border);\n}\n.reason[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n.req[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n}\n.mt[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.ft[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  width: 100%;\n  justify-content: flex-end;\n}\n.grow[_ngcontent-%COMP%] {\n  margin-right: auto;\n}\n/*# sourceMappingURL=field-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldDetailPage, [{
    type: Component,
    args: [{ selector: "vc-field-detail", imports: [
      FormsModule,
      RouterLink,
      Icon,
      Badge,
      DataClass,
      Empty,
      ErrorBox,
      Loading,
      Modal,
      Tabs,
      Callout,
      FieldMap,
      Chip,
      AttrInputs,
      BoundaryEditor,
      BoundaryHistory,
      LandUse,
      NumPipe,
      DayPipe,
      HumanPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a routerLink="/app/fields" class="back"><vc-icon name="arrow-left" [size]="14" />All fields</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this field" [message]="error()!" />
    } @else if (field(); as f) {
      <header class="hdr">
        <div class="t">
          <div class="eyebrow mono">{{ f.code }}</div>
          <div class="row-t"><h1>{{ f.name }}</h1><vc-badge [status]="f.status" /></div>
          <p class="sub">
            @if (farm()) { {{ farm()!.name }}@if (farm()!.village) {, {{ farm()!.village }}}@if (farm()!.district) {, {{ farm()!.district }}} }
          </p>
        </div>
        @if (auth.can('land.manage')) {
          <div class="actions">
            <button class="btn btn-secondary" (click)="openEdit()"><vc-icon name="pencil" />Edit details</button>
            @if (f.status === 'active') {
              <button class="btn btn-secondary" (click)="openBoundary()"><vc-icon name="pen-line" />Edit boundary</button>
              <button class="btn btn-ghost" (click)="statusOpen.set(true)"><vc-icon name="archive" />Retire</button>
            } @else {
              <button class="btn btn-secondary" (click)="statusOpen.set(true)"><vc-icon name="undo" />Reactivate</button>
            }
          </div>
        }
      </header>

      <div class="top">
        <section class="card map-card">
          <vc-field-map [polygons]="mapData()" height="100%" [maxZoom]="17" />
        </section>
        <section class="card facts">
          <div class="area-tile">
            <div class="a-top"><span>Area</span><vc-dc cls="CALCULATED" /></div>
            <div class="a-val num">{{ f.area_ha | num: 2 }}<small>ha</small></div>
            <div class="a-note">Computed from the boundary (version {{ f.version }}), not entered by hand.</div>
          </div>
          <dl class="kv">
            <dt>Crop</dt>
            <dd>
              @if (crop()) { <vc-chip [swatch]="cropColor()" tone="outline">{{ crop()!.name }}</vc-chip> }
              @else if (f.crop_code) { <code>{{ f.crop_code }}</code> }
              @else { <span class="subtle">Not set</span> }
            </dd>
            @for (a of attrRows(); track a.key) { <dt>{{ a.label }}</dt><dd>{{ a.value }}</dd> }
            <dt>Soil type</dt><dd>{{ f.soil_type || '\u2014' }}</dd>
            <dt>Elevation</dt><dd class="num">{{ f.elevation_m !== null ? (f.elevation_m | num: 0) + ' m' : '\u2014' }}</dd>
            <dt>Centre point</dt><dd class="mono small">{{ f.centroid_lat.toFixed(5) }}, {{ f.centroid_lon.toFixed(5) }}</dd>
            <dt>Farmer</dt>
            <dd>@if (farmer()) { <a [routerLink]="['/app/farmers', farmer()!.id]">{{ farmer()!.full_name }}</a>&nbsp;<span class="subtle small mono">{{ farmer()!.code }}</span> } @else { \u2014 }</dd>
            <dt>Farm</dt><dd>{{ farm()?.name ?? '\u2014' }}</dd>
            <dt>Last changed</dt><dd>{{ f.updated_at | day: true }}</dd>
          </dl>
          <div class="links">
            <a class="lk" [routerLink]="['/app/supporting']" [queryParams]="{ field_id: f.id }">
              <span class="li-ic"><vc-icon name="rain" [size]="16" /></span>
              <span><strong>Supporting data</strong><small>Weather, soil maps and terrain for this field</small></span>
              <vc-icon name="chevron-right" [size]="15" />
            </a>
            <a class="lk" [routerLink]="['/app/satellite']" [queryParams]="{ field_id: f.id }">
              <span class="li-ic"><vc-icon name="satellite" [size]="16" /></span>
              <span><strong>Satellite</strong><small>Vegetation index and practice detection</small></span>
              <vc-icon name="chevron-right" [size]="15" />
            </a>
          </div>
        </section>
      </div>

      <section class="card tabs-card">
        <div class="tabs-pad"><vc-tabs [tabs]="tabs()" [(active)]="tab" /></div>
        @switch (tab()) {
          @case ('boundary') { <vc-boundary-history [fieldId]="f.id" [refresh]="f.version" /> }
          @case ('land') { <vc-land-use [fieldId]="f.id" /> }
          @case ('practices') {
            @if (practicesLoading()) { <vc-loading [rows]="4" /> }
            @else if (!practices().length) {
              <vc-empty icon="sprout" title="No practices recorded" text="Practices recorded in the field app, by partners or here appear in this list.">
                <a class="btn btn-secondary" routerLink="/app/practices" [queryParams]="{ field_id: f.id, record: 1 }"><vc-icon name="plus" />Record a practice</a>
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Date</th><th>Practice</th><th>Scenario</th><th class="num">Quantity</th><th>Source</th><th>Evidence</th><th></th></tr></thead>
                  <tbody>
                    @for (p of practices(); track p.id) {
                      <tr class="clickable" [routerLink]="['/app/practices']" [queryParams]="{ record_id: p.record_id }">
                        <td class="nowrap">{{ p.performed_on | day }}</td>
                        <td>{{ ptName(p.practice_code) }}</td>
                        <td><vc-chip [tone]="p.scenario === 'baseline' ? 'outline' : 'forest'">{{ p.scenario | human }}</vc-chip></td>
                        <td class="num nowrap">{{ p.quantity !== null ? (p.quantity | num: 2) + ' ' + (p.unit ?? '') : '\u2014' }}</td>
                        <td class="muted">{{ source(p.source) }}</td>
                        <td>@if (p.missing_evidence) { <vc-badge status="warning">Missing</vc-badge> } @else if (p.evidence_ids.length) { <span class="muted small">{{ p.evidence_ids.length }} file{{ p.evidence_ids.length === 1 ? '' : 's' }}</span> } @else { <span class="subtle">\u2014</span> }</td>
                        <td class="num"><vc-icon name="chevron-right" [size]="14" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          }
        }
      </section>

      <!-- edit details -->
      <vc-modal [(open)]="editOpen" title="Edit field details" subtitle="Changes are recorded in the audit log." width="560px">
        <div class="stack">
          <div class="field"><label for="e-name">Field name</label><input id="e-name" class="input" [ngModel]="eName()" (ngModelChange)="eName.set($event)" /></div>
          <div class="field">
            <label for="e-crop">Main crop</label>
            <select id="e-crop" class="input" [ngModel]="eCrop()" (ngModelChange)="eCrop.set($event); eAttrs.set({})">
              <option value="">Not set</option>
              @for (c of activeCrops(); track c.code) { <option [value]="c.code">{{ c.name }}</option> }
            </select>
          </div>
          @if (eCropDef()?.attributes?.length) {
            <div class="attrs"><vc-attr-inputs [defs]="eCropDef()!.attributes" [(values)]="eAttrs" /></div>
          }
          <div class="form-grid">
            <div class="field"><label for="e-soil">Soil type</label><input id="e-soil" class="input" [ngModel]="eSoil()" (ngModelChange)="eSoil.set($event)" /></div>
            <div class="field"><label for="e-elev">Elevation (m)</label><input id="e-elev" type="number" class="input num" [ngModel]="eElev()" (ngModelChange)="eElev.set($event)" /></div>
          </div>
        </div>
        @if (editError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ editError() }}</vc-callout> }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="editOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!!editProblem() || saving()" [title]="editProblem() ?? ''" (click)="saveEdit()">{{ saving() ? 'Saving\u2026' : 'Save changes' }}</button>
        </div>
      </vc-modal>

      <!-- edit boundary -->
      <vc-modal [(open)]="boundaryOpen" title="Edit boundary" width="1040px"
        subtitle="Move, add or remove corners. The previous boundary is kept as a version; the area is recomputed on save.">
        <vc-boundary-editor [(vertices)]="bVerts" [context]="neighbours()" mapHeight="440px" />
        <div class="field reason">
          <label for="b-reason">Why is the boundary changing? <span class="req">*</span></label>
          <textarea id="b-reason" class="input" rows="2" [ngModel]="bReason()" (ngModelChange)="bReason.set($event)"
            placeholder="e.g. Re-walked with GPS; the eastern edge follows the new fence line"></textarea>
          <span class="hint">Required \u2014 at least 5 characters. Shown in the boundary history.</span>
        </div>
        @if (bOverlap(); as o) {
          <vc-callout tone="danger" icon="alert" class="mt">
            <strong>This boundary overlaps field {{ o.fieldCode }}.</strong> {{ o.message }}
            @if (o.fieldId) { <a [routerLink]="['/app/fields', o.fieldId]" target="_blank">Open {{ o.fieldCode }}</a> }
          </vc-callout>
        } @else if (bError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ bError() }}</vc-callout> }
        <div footer class="ft">
          <span class="subtle small grow">{{ boundaryProblem() ?? 'Ready to save as version ' + (f.version + 1) }}</span>
          <button class="btn btn-ghost" (click)="boundaryOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!!boundaryProblem() || saving()" (click)="saveBoundary()">{{ saving() ? 'Saving\u2026' : 'Save new boundary' }}</button>
        </div>
      </vc-modal>

      <!-- retire / reactivate -->
      <vc-modal [(open)]="statusOpen" [title]="f.status === 'active' ? 'Retire this field?' : 'Reactivate this field?'" width="480px">
        @if (f.status === 'active') {
          <p>Retired fields stay in the records and audit trail but can't be enrolled or sampled. A field that is enrolled in a project must be withdrawn first.</p>
        } @else {
          <p>The field becomes active again. Its boundary is checked for overlaps with other active fields.</p>
        }
        @if (statusError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ statusError() }}</vc-callout> }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="statusOpen.set(false)">Cancel</button>
          <button class="btn" [class.btn-danger]="f.status === 'active'" [class.btn-primary]="f.status !== 'active'" [disabled]="saving()" (click)="toggleStatus()">
            {{ f.status === 'active' ? 'Retire field' : 'Reactivate field' }}
          </button>
        </div>
      </vc-modal>
    }
  `, styles: ["/* angular:styles/component:scss;fd40cd19566dfa50;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\field-detail.page.ts */\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n  margin-bottom: 14px;\n}\n.back:hover {\n  color: var(--forest-700);\n  text-decoration: none;\n}\n.hdr {\n  display: flex;\n  align-items: flex-end;\n  gap: 16px;\n  margin-bottom: 20px;\n  flex-wrap: wrap;\n}\n.t {\n  flex: 1;\n  min-width: 260px;\n}\n.eyebrow {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--forest-500);\n  letter-spacing: 0.04em;\n  margin-bottom: 4px;\n}\n.row-t {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.sub {\n  margin-top: 4px;\n  color: var(--text-2);\n}\n.actions {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.top {\n  display: grid;\n  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);\n  gap: 16px;\n  margin-bottom: 16px;\n}\n@media (max-width: 1100px) {\n  .top {\n    grid-template-columns: 1fr;\n  }\n  .map-card {\n    height: 380px;\n  }\n}\n.map-card {\n  position: relative;\n  overflow: hidden;\n  min-height: 440px;\n}\n.map-card vc-field-map {\n  position: absolute;\n  inset: 0;\n  border: 0;\n}\n.facts {\n  display: flex;\n  flex-direction: column;\n}\n.area-tile {\n  margin: 16px 16px 4px;\n  padding: 16px;\n  border-radius: var(--radius);\n  background:\n    linear-gradient(\n      150deg,\n      var(--forest-800),\n      var(--forest-600));\n  color: #fff;\n}\n.a-top {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 12.5px;\n  color: rgba(255, 255, 255, 0.75);\n}\n.a-val {\n  font-size: 32px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  margin-top: 4px;\n}\n.a-val small {\n  font-size: 14px;\n  font-weight: 500;\n  margin-left: 5px;\n  color: rgba(255, 255, 255, 0.72);\n}\n.a-note {\n  font-size: 12px;\n  color: rgba(255, 255, 255, 0.75);\n  margin-top: 2px;\n}\n.kv {\n  padding: 16px 20px;\n  grid-template-columns: minmax(110px, 36%) 1fr;\n}\n.links {\n  margin-top: auto;\n  border-top: 1px solid var(--border);\n}\n.lk {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  color: var(--stone-800);\n  border-bottom: 1px solid var(--stone-100);\n}\n.lk:last-child {\n  border-bottom: 0;\n}\n.lk:hover {\n  background: var(--forest-50);\n  text-decoration: none;\n}\n.lk > span:nth-child(2) {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.lk strong {\n  font-weight: 500;\n  font-size: 13.5px;\n}\n.lk small {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.li-ic {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  background: var(--sky-100);\n  color: var(--sky-600);\n}\n.lk:nth-child(2) .li-ic {\n  background: var(--violet-100);\n  color: var(--violet-600);\n}\n.tabs-card {\n  overflow: hidden;\n}\n.tabs-pad {\n  padding: 4px 12px 0;\n}\n.tabs-pad vc-tabs {\n  margin-bottom: 0;\n  border-bottom: 0;\n}\n.tabs-card > :not(.tabs-pad) {\n  border-top: 1px solid var(--border);\n}\n.attrs {\n  padding: 12px;\n  border-radius: var(--radius-sm);\n  background: var(--surface-2);\n  border: 1px solid var(--border);\n}\n.reason {\n  margin-top: 16px;\n}\n.req {\n  color: var(--danger);\n}\n.mt {\n  margin-top: 14px;\n}\n.ft {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  width: 100%;\n  justify-content: flex-end;\n}\n.grow {\n  margin-right: auto;\n}\n/*# sourceMappingURL=field-detail.page.css.map */\n"] }]
  }], () => [], { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldDetailPage, { className: "FieldDetailPage", filePath: "src/app/features/fields/field-detail.page.ts", lineNumber: 237 });
})();

// src/app/features/fields/fields.page.ts
var _forTrack05 = ($index, $item) => $item.code;
var _forTrack14 = ($index, $item) => $item.id;
function FieldsPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function FieldsPage_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 14);
    \u0275\u0275text(2, "Add field");
    \u0275\u0275elementEnd();
  }
}
function FieldsPage_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "span", 8);
    \u0275\u0275text(2, "Enrolled");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 9);
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.enrolledCount());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("of ", ctx_r1.rows().length);
  }
}
function FieldsPage_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-error", 10)(1, "button", 15);
    \u0275\u0275listener("click", function FieldsPage_Conditional_27_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.load());
    });
    \u0275\u0275text(2, "Try again");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function FieldsPage_Conditional_28_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-field-map", 32);
    \u0275\u0275listener("featureClick", function FieldsPage_Conditional_28_For_3_Template_vc_field_map_featureClick_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.open($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("polygons", ctx_r1.mapData());
  }
}
function FieldsPage_Conditional_28_Conditional_4_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 35);
    \u0275\u0275listener("click", function FieldsPage_Conditional_28_Conditional_4_For_4_Template_button_click_0_listener() {
      const l_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleCrop(l_r7.code));
    });
    \u0275\u0275element(1, "span", 36);
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "span", 37);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const l_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("off", ctx_r1.cropFilter() && ctx_r1.cropFilter() !== l_r7.code);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", l_r7.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r7.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(l_r7.count);
  }
}
function FieldsPage_Conditional_28_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 33);
    \u0275\u0275text(2, "Crop");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FieldsPage_Conditional_28_Conditional_4_For_4_Template, 5, 6, "button", 34, _forTrack05);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.legend());
  }
}
function FieldsPage_Conditional_28_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "vc-icon", 38);
    \u0275\u0275text(2, "Loading boundaries\u2026");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function FieldsPage_Conditional_28_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r8 = ctx.$implicit;
    \u0275\u0275property("value", l_r8.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r8.name);
  }
}
function FieldsPage_Conditional_28_Conditional_16_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r10 = ctx.$implicit;
    \u0275\u0275property("value", s_r10);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r10.replace("_", " "));
  }
}
function FieldsPage_Conditional_28_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 39);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldsPage_Conditional_28_Conditional_16_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.statusFilter.set($event));
    });
    \u0275\u0275elementStart(1, "option", 26);
    \u0275\u0275text(2, "Any enrolment");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FieldsPage_Conditional_28_Conditional_16_For_4_Template, 2, 2, "option", 27, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngModel", ctx_r1.statusFilter());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.enrolStatuses());
  }
}
function FieldsPage_Conditional_28_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 29);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function FieldsPage_Conditional_28_Conditional_18_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function FieldsPage_Conditional_28_Conditional_18_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.createOpen.set(true));
    });
    \u0275\u0275element(1, "vc-icon", 14);
    \u0275\u0275text(2, "Add field");
    \u0275\u0275elementEnd();
  }
}
function FieldsPage_Conditional_28_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 30);
    \u0275\u0275conditionalCreate(1, FieldsPage_Conditional_28_Conditional_18_Conditional_1_Template, 3, 0, "button", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("title", ctx_r1.allFields() ? "No fields yet" : "No fields in this project yet")("text", ctx_r1.allFields() ? "Add the first field by drawing its boundary on the map." : "Fields appear here once they are enrolled in the project. Switch on \u201CAll fields\u201D to see every field.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.auth.can("land.manage") ? 1 : -1);
  }
}
function FieldsPage_Conditional_28_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-empty", 31)(1, "button", 42);
    \u0275\u0275listener("click", function FieldsPage_Conditional_28_Conditional_19_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275text(2, "Clear filters");
    \u0275\u0275elementEnd()();
  }
}
function FieldsPage_Conditional_28_Conditional_20_For_14_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-badge", 56);
  }
  if (rf & 2) {
    const r_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("status", r_r14.enrolment_status);
  }
}
function FieldsPage_Conditional_28_Conditional_20_For_14_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-badge", 56);
  }
  if (rf & 2) {
    const r_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("status", r_r14.status);
  }
}
function FieldsPage_Conditional_28_Conditional_20_For_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 48);
    \u0275\u0275listener("click", function FieldsPage_Conditional_28_Conditional_20_For_14_Template_tr_click_0_listener() {
      const r_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.open(r_r14.id));
    });
    \u0275\u0275elementStart(1, "td")(2, "div", 49);
    \u0275\u0275element(3, "span", 36);
    \u0275\u0275elementStart(4, "div", 50)(5, "div", 51);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 52);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(9, "td", 53);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 54);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "num");
    \u0275\u0275elementStart(14, "span", 55);
    \u0275\u0275text(15, "ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275conditionalCreate(17, FieldsPage_Conditional_28_Conditional_20_For_14_Conditional_17_Template, 1, 1, "vc-badge", 56)(18, FieldsPage_Conditional_28_Conditional_20_For_14_Conditional_18_Template, 1, 1, "vc-badge", 56);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r14 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background", r_r14.color);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r14.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", r_r14.name, " \xB7 ", r_r14.cropName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r14.farmer);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(13, 8, r_r14.area_ha, 2), " ");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(r_r14.enrolment_status ? 17 : 18);
  }
}
function FieldsPage_Conditional_28_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "table", 44)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Farmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 45);
    \u0275\u0275text(9, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Status");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275repeaterCreate(13, FieldsPage_Conditional_28_Conditional_20_For_14_Template, 19, 11, "tr", 46, _forTrack14);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "div", 47);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r1.rows());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r1.rows().length, " of ", ctx_r1.all().length, " fields \xB7 area computed from boundaries");
  }
}
function FieldsPage_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "section", 16);
    \u0275\u0275repeaterCreate(2, FieldsPage_Conditional_28_For_3_Template, 1, 1, "vc-field-map", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(4, FieldsPage_Conditional_28_Conditional_4_Template, 5, 0, "div", 18);
    \u0275\u0275conditionalCreate(5, FieldsPage_Conditional_28_Conditional_5_Template, 3, 1, "div", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "section", 20)(7, "div", 21)(8, "div", 22);
    \u0275\u0275element(9, "vc-icon", 23);
    \u0275\u0275elementStart(10, "input", 24);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldsPage_Conditional_28_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.q.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "select", 25);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldsPage_Conditional_28_Template_select_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cropFilter.set($event));
    });
    \u0275\u0275elementStart(12, "option", 26);
    \u0275\u0275text(13, "All crops");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(14, FieldsPage_Conditional_28_For_15_Template, 2, 2, "option", 27, _forTrack05);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, FieldsPage_Conditional_28_Conditional_16_Template, 5, 1, "select", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, FieldsPage_Conditional_28_Conditional_17_Template, 1, 1, "vc-loading", 29)(18, FieldsPage_Conditional_28_Conditional_18_Template, 2, 3, "vc-empty", 30)(19, FieldsPage_Conditional_28_Conditional_19_Template, 3, 0, "vc-empty", 31)(20, FieldsPage_Conditional_28_Conditional_20_Template, 17, 2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.mapKey());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.legend().length ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loading() ? 5 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.q());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.cropFilter());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.legend());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.allFields() ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.loading() ? 17 : !ctx_r1.all().length ? 18 : !ctx_r1.rows().length ? 19 : 20);
  }
}
var FieldsPage = class _FieldsPage {
  api = inject(ApiService);
  router = inject(Router);
  toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  geo = signal(
    null,
    ...ngDevMode ? [{ debugName: "geo" }] : (
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
  farmers = signal(
    /* @__PURE__ */ new Map(),
    ...ngDevMode ? [{ debugName: "farmers" }] : (
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
  allFields = signal(
    false,
    ...ngDevMode ? [{ debugName: "allFields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  createOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "createOpen" }] : (
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
  cropFilter = signal(
    "",
    ...ngDevMode ? [{ debugName: "cropFilter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  statusFilter = signal(
    "",
    ...ngDevMode ? [{ debugName: "statusFilter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  colors = computed(
    () => cropColorMap((this.geo()?.features ?? []).map((f) => f.properties.crop_code)),
    ...ngDevMode ? [{ debugName: "colors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cropNames = computed(
    () => new Map(this.crops().map((c) => [c.code, c.name])),
    ...ngDevMode ? [{ debugName: "cropNames" }] : (
      /* istanbul ignore next */
      []
    )
  );
  all = computed(
    () => (this.geo()?.features ?? []).map((f) => {
      const p = f.properties;
      return __spreadProps(__spreadValues({}, p), {
        farmer: p.farmer_id && this.farmers().get(p.farmer_id)?.full_name || "\u2014",
        color: p.crop_code && this.colors().get(p.crop_code) || NO_CROP_COLOR,
        cropName: p.crop_code ? this.cropNames().get(p.crop_code) ?? p.crop_code : "Not set"
      });
    }),
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => {
      const q = this.q().toLowerCase().trim();
      return this.all().filter((r) => (!this.cropFilter() || r.crop_code === this.cropFilter()) && (!this.statusFilter() || r.enrolment_status === this.statusFilter()) && (!q || `${r.code} ${r.name} ${r.farmer}`.toLowerCase().includes(q)));
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  totalArea = computed(
    () => this.rows().reduce((s, r) => s + (r.area_ha || 0), 0),
    ...ngDevMode ? [{ debugName: "totalArea" }] : (
      /* istanbul ignore next */
      []
    )
  );
  farmerCount = computed(
    () => new Set(this.rows().map((r) => r.farmer_id).filter(Boolean)).size,
    ...ngDevMode ? [{ debugName: "farmerCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  enrolledCount = computed(
    () => this.rows().filter((r) => r.enrolment_status === "enrolled").length,
    ...ngDevMode ? [{ debugName: "enrolledCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  enrolStatuses = computed(
    () => [...new Set(this.all().map((r) => r.enrolment_status).filter((s) => !!s))].sort(),
    ...ngDevMode ? [{ debugName: "enrolStatuses" }] : (
      /* istanbul ignore next */
      []
    )
  );
  legend = computed(
    () => {
      const counts = /* @__PURE__ */ new Map();
      for (const r of this.all())
        counts.set(r.crop_code ?? "", (counts.get(r.crop_code ?? "") ?? 0) + 1);
      return [...counts.entries()].map(([code, count]) => ({
        code,
        count,
        name: code ? this.cropNames().get(code) ?? code : "Crop not set",
        color: code && this.colors().get(code) || NO_CROP_COLOR
      })).sort((a, b) => b.count - a.count);
    },
    ...ngDevMode ? [{ debugName: "legend" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mapData = computed(
    () => {
      const visible = new Set(this.rows().map((r) => r.id));
      const byId = new Map(this.all().map((r) => [r.id, r]));
      return {
        type: "FeatureCollection",
        features: (this.geo()?.features ?? []).filter((f) => visible.has(String(f.id))).map((f) => {
          const r = byId.get(String(f.id));
          return __spreadProps(__spreadValues({}, f), {
            properties: __spreadProps(__spreadValues({}, f.properties), {
              color: r.color,
              label: `<strong>${escapeHtml(r.code)}</strong> \xB7 ${escapeHtml(r.name)}<br><span style="color:#58625b">${escapeHtml(r.farmer)} \xB7 ${escapeHtml(r.cropName)} \xB7 ${r.area_ha.toFixed(2)} ha</span>`
            })
          });
        })
      };
    },
    ...ngDevMode ? [{ debugName: "mapData" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Re-create the map when the scope changes so it re-fits to the new fields. */
  mapKey = computed(
    () => [`${this.allFields()}-${this.ctx.currentId()}`],
    ...ngDevMode ? [{ debugName: "mapKey" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.api.get("/catalogue/crops", { include_inactive: true }).subscribe({ next: (r) => this.crops.set(r) });
    this.api.get("/farmers", { limit: 500 }).subscribe({
      next: (r) => this.farmers.set(new Map(r.items.map((f) => [f.id, f])))
    });
    effect(() => {
      const pid = this.ctx.currentId();
      const all = this.allFields();
      if (!all && !pid && !this.ctx.loaded())
        return;
      this.load(all ? null : pid);
    });
  }
  load(pid = this.allFields() ? null : this.ctx.currentId()) {
    this.loading.set(true);
    this.error.set(null);
    this.api.get("/fields/geojson", { project_id: pid }).subscribe({
      next: (r) => {
        this.geo.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  toggleCrop(code) {
    this.cropFilter.set(this.cropFilter() === code ? "" : code);
  }
  clearFilters() {
    this.q.set("");
    this.cropFilter.set("");
    this.statusFilter.set("");
  }
  open(id) {
    this.router.navigate(["/app/fields", id]);
  }
  onCreated(f) {
    this.toast.success(`Field ${f.code} added`, `${f.area_ha.toFixed(2)} ha, computed from the boundary.`);
    this.router.navigate(["/app/fields", f.id]);
  }
  static \u0275fac = function FieldsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldsPage, selectors: [["vc-fields-page"]], decls: 30, vars: 13, consts: [["title", "Fields & map", "eyebrow", "Land", 3, "subtitle"], ["actions", "", 1, "toggle"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "track"], [1, "knob"], ["actions", "", 1, "btn", "btn-primary"], [1, "kpis"], [1, "kpi"], [1, "k-l"], [1, "k-v", "num"], ["title", "Couldn't load fields", 3, "message"], [1, "split"], [3, "openChange", "created", "open", "context"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], [1, "map-card", "card"], ["height", "100%", 3, "polygons"], [1, "legend"], [1, "map-loading"], [1, "list", "card"], [1, "list-head"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search code, name or farmer\u2026", 1, "input", 3, "ngModelChange", "ngModel"], ["aria-label", "Crop", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["aria-label", "Enrolment", 1, "input", 3, "ngModel"], [3, "rows"], ["icon", "map", 3, "title", "text"], ["icon", "search", "title", "No matching fields", "text", "Try a different search or clear the filters."], ["height", "100%", 3, "featureClick", "polygons"], [1, "lg-h"], ["type", "button", 1, "lg", 3, "off"], ["type", "button", 1, "lg", 3, "click"], [1, "sw"], [1, "n", "num"], ["name", "refresh", 3, "size"], ["aria-label", "Enrolment", 1, "input", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "btn", "btn-secondary", 3, "click"], [1, "table-wrap", "scroll"], [1, "table"], [1, "num"], [1, "clickable"], [1, "list-foot", "subtle", "small"], [1, "clickable", 3, "click"], [1, "fc"], [1, "min0"], [1, "code", "mono"], [1, "nm", "truncate"], [1, "truncate", "farmer"], [1, "num", "nowrap"], [1, "subtle"], [3, "status"]], template: function FieldsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "label", 1)(2, "input", 2);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldsPage_Template_input_ngModelChange_2_listener($event) {
        return ctx.allFields.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "span", 3);
      \u0275\u0275element(4, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275text(5, " All fields ");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(6, FieldsPage_Conditional_6_Template, 3, 0, "button", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 6)(8, "div", 7)(9, "span", 8);
      \u0275\u0275text(10, "Fields");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "span", 9);
      \u0275\u0275text(12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 7)(14, "span", 8);
      \u0275\u0275text(15, "Total area");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span", 9);
      \u0275\u0275text(17);
      \u0275\u0275pipe(18, "num");
      \u0275\u0275elementStart(19, "small");
      \u0275\u0275text(20, "ha");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "div", 7)(22, "span", 8);
      \u0275\u0275text(23, "Farmers");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "span", 9);
      \u0275\u0275text(25);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(26, FieldsPage_Conditional_26_Template, 7, 2, "div", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(27, FieldsPage_Conditional_27_Template, 3, 1, "vc-error", 10)(28, FieldsPage_Conditional_28_Template, 21, 7, "div", 11);
      \u0275\u0275elementStart(29, "vc-field-create", 12);
      \u0275\u0275twoWayListener("openChange", function FieldsPage_Template_vc_field_create_openChange_29_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275listener("created", function FieldsPage_Template_vc_field_create_created_29_listener($event) {
        return ctx.onCreated($event);
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("subtitle", ctx.allFields() ? "Every active field in your organisation." : "Fields enrolled in " + (ctx.ctx.current()?.name ?? "the current project") + ". Areas are computed from each boundary.");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.allFields());
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.auth.can("land.manage") ? 6 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.rows().length);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 10, ctx.totalArea(), 1));
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.farmerCount());
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.allFields() ? 26 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 27 : 28);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275property("context", ctx.geo());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, PageHeader, Loading, ErrorBox, Empty, Badge, Icon, FieldMap, FieldCreate, NumPipe], styles: ["\n.toggle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n  margin-right: 6px;\n}\n.toggle[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n.track[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 18px;\n  border-radius: 9px;\n  background: var(--%NS%stone-300);\n  position: relative;\n  transition: background 0.15s;\n}\n.knob[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: var(--%NS%shadow-sm);\n  transition: transform 0.15s;\n}\n.toggle[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    + .track[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-500);\n}\n.toggle[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    + .track[_ngcontent-%COMP%]   .knob[_ngcontent-%COMP%] {\n  transform: translateX(14px);\n}\n.toggle[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus-visible    + .track[_ngcontent-%COMP%] {\n  box-shadow: var(--%NS%focus);\n}\n.kpis[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 28px;\n  margin: -6px 0 18px;\n  padding: 0 2px;\n  flex-wrap: wrap;\n}\n.kpi[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.k-l[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.k-v[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.k-v[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--%NS%text-3);\n  margin-left: 4px;\n}\n.split[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.35fr) minmax(380px, 1fr);\n  gap: 16px;\n  height: calc(100vh - 250px);\n  min-height: 560px;\n}\n@media (max-width: 1180px) {\n  .split[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    height: auto;\n  }\n  .map-card[_ngcontent-%COMP%] {\n    height: 460px;\n  }\n  .list[_ngcontent-%COMP%] {\n    max-height: none;\n  }\n}\n.map-card[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  padding: 0;\n}\n.map-card[_ngcontent-%COMP%]   vc-field-map[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  border: 0;\n  border-radius: var(--%NS%radius);\n}\n.legend[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  bottom: 28px;\n  z-index: 3;\n  background: rgba(255, 255, 255, 0.96);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius);\n  box-shadow: var(--%NS%shadow);\n  padding: 10px 10px 8px;\n  min-width: 170px;\n  max-height: calc(100% - 90px);\n  overflow: auto;\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n}\n.lg-h[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n  margin: 0 4px 6px;\n}\n.lg[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  border: 0;\n  background: none;\n  padding: 4px;\n  border-radius: 5px;\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--%NS%stone-800);\n  cursor: pointer;\n  text-align: left;\n}\n.lg[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-100);\n}\n.lg.off[_ngcontent-%COMP%] {\n  opacity: 0.42;\n}\n.lg[_ngcontent-%COMP%]   .n[_ngcontent-%COMP%] {\n  margin-left: auto;\n  color: var(--%NS%text-3);\n  font-size: 11.5px;\n}\n.sw[_ngcontent-%COMP%] {\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n  flex: none;\n}\n.map-loading[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 12px;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 3;\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  padding: 6px 12px;\n  border-radius: 999px;\n  background: var(--%NS%surface);\n  box-shadow: var(--%NS%shadow);\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  overflow: hidden;\n}\n.list-head[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  padding: 12px;\n  border-bottom: 1px solid var(--%NS%border);\n  flex-wrap: wrap;\n}\n.list-head[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 130px;\n  flex: 0 1 160px;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 180px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.scroll[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow: auto;\n}\n.fc[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n.fc[_ngcontent-%COMP%]   .sw[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 28px;\n  border-radius: 3px;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--%NS%stone-900);\n}\n.nm[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  max-width: 200px;\n}\n.min0[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.farmer[_ngcontent-%COMP%] {\n  max-width: 140px;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n}\n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 9px 12px;\n}\n.list-foot[_ngcontent-%COMP%] {\n  padding: 10px 14px;\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n}\n/*# sourceMappingURL=fields.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldsPage, [{
    type: Component,
    args: [{ selector: "vc-fields-page", imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Badge, Icon, FieldMap, NumPipe, FieldCreate], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Fields & map" eyebrow="Land"
      [subtitle]="allFields() ? 'Every active field in your organisation.' : 'Fields enrolled in ' + (ctx.current()?.name ?? 'the current project') + '. Areas are computed from each boundary.'">
      <label actions class="toggle">
        <input type="checkbox" [ngModel]="allFields()" (ngModelChange)="allFields.set($event)" />
        <span class="track"><span class="knob"></span></span>
        All fields
      </label>
      @if (auth.can('land.manage')) {
        <button actions class="btn btn-primary" (click)="createOpen.set(true)"><vc-icon name="plus" />Add field</button>
      }
    </vc-page-header>

    <div class="kpis">
      <div class="kpi"><span class="k-l">Fields</span><span class="k-v num">{{ rows().length }}</span></div>
      <div class="kpi"><span class="k-l">Total area</span><span class="k-v num">{{ totalArea() | num: 1 }}<small>ha</small></span></div>
      <div class="kpi"><span class="k-l">Farmers</span><span class="k-v num">{{ farmerCount() }}</span></div>
      @if (!allFields()) {
        <div class="kpi"><span class="k-l">Enrolled</span><span class="k-v num">{{ enrolledCount() }}<small>of {{ rows().length }}</small></span></div>
      }
    </div>

    @if (error()) {
      <vc-error title="Couldn't load fields" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else {
      <div class="split">
        <section class="map-card card">
          @for (k of mapKey(); track k) { <vc-field-map [polygons]="mapData()" height="100%" (featureClick)="open($event)" /> }
          @if (legend().length) {
            <div class="legend">
              <div class="lg-h">Crop</div>
              @for (l of legend(); track l.code) {
                <button type="button" class="lg" [class.off]="cropFilter() && cropFilter() !== l.code" (click)="toggleCrop(l.code)">
                  <span class="sw" [style.background]="l.color"></span>{{ l.name }}<span class="n num">{{ l.count }}</span>
                </button>
              }
            </div>
          }
          @if (loading()) { <div class="map-loading"><vc-icon name="refresh" [size]="14" />Loading boundaries\u2026</div> }
        </section>

        <section class="list card">
          <div class="list-head">
            <div class="search">
              <vc-icon name="search" [size]="15" />
              <input class="input" placeholder="Search code, name or farmer\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" />
            </div>
            <select class="input" [ngModel]="cropFilter()" (ngModelChange)="cropFilter.set($event)" aria-label="Crop">
              <option value="">All crops</option>
              @for (l of legend(); track l.code) { <option [value]="l.code">{{ l.name }}</option> }
            </select>
            @if (!allFields()) {
              <select class="input" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" aria-label="Enrolment">
                <option value="">Any enrolment</option>
                @for (s of enrolStatuses(); track s) { <option [value]="s">{{ s.replace('_', ' ') }}</option> }
              </select>
            }
          </div>
          @if (loading()) {
            <vc-loading [rows]="8" />
          } @else if (!all().length) {
            <vc-empty icon="map" [title]="allFields() ? 'No fields yet' : 'No fields in this project yet'"
              [text]="allFields() ? 'Add the first field by drawing its boundary on the map.' : 'Fields appear here once they are enrolled in the project. Switch on \u201CAll fields\u201D to see every field.'">
              @if (auth.can('land.manage')) { <button class="btn btn-primary" (click)="createOpen.set(true)"><vc-icon name="plus" />Add field</button> }
            </vc-empty>
          } @else if (!rows().length) {
            <vc-empty icon="search" title="No matching fields" text="Try a different search or clear the filters." >
              <button class="btn btn-secondary" (click)="clearFilters()">Clear filters</button>
            </vc-empty>
          } @else {
            <div class="table-wrap scroll">
              <table class="table">
                <thead><tr><th>Field</th><th>Farmer</th><th class="num">Area</th><th>Status</th></tr></thead>
                <tbody>
                  @for (r of rows(); track r.id) {
                    <tr class="clickable" (click)="open(r.id)">
                      <td>
                        <div class="fc"><span class="sw" [style.background]="r.color"></span>
                          <div class="min0"><div class="code mono">{{ r.code }}</div><div class="nm truncate">{{ r.name }} \xB7 {{ r.cropName }}</div></div>
                        </div>
                      </td>
                      <td class="truncate farmer">{{ r.farmer }}</td>
                      <td class="num nowrap">{{ r.area_ha | num: 2 }} <span class="subtle">ha</span></td>
                      <td>
                        @if (r.enrolment_status) { <vc-badge [status]="r.enrolment_status" /> }
                        @else { <vc-badge [status]="r.status" /> }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="list-foot subtle small">{{ rows().length }} of {{ all().length }} fields \xB7 area computed from boundaries</div>
          }
        </section>
      </div>
    }

    <vc-field-create [(open)]="createOpen" [context]="geo()" (created)="onCreated($event)" />
  `, styles: ["/* angular:styles/component:scss;c8766f28a9e3a093;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\fields.page.ts */\n.toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--stone-700);\n  cursor: pointer;\n  margin-right: 6px;\n}\n.toggle input {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n.track {\n  width: 32px;\n  height: 18px;\n  border-radius: 9px;\n  background: var(--stone-300);\n  position: relative;\n  transition: background 0.15s;\n}\n.knob {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: var(--shadow-sm);\n  transition: transform 0.15s;\n}\n.toggle input:checked + .track {\n  background: var(--forest-500);\n}\n.toggle input:checked + .track .knob {\n  transform: translateX(14px);\n}\n.toggle input:focus-visible + .track {\n  box-shadow: var(--focus);\n}\n.kpis {\n  display: flex;\n  gap: 28px;\n  margin: -6px 0 18px;\n  padding: 0 2px;\n  flex-wrap: wrap;\n}\n.kpi {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.k-l {\n  font-size: 12px;\n  color: var(--text-3);\n}\n.k-v {\n  font-size: 20px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.k-v small {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--text-3);\n  margin-left: 4px;\n}\n.split {\n  display: grid;\n  grid-template-columns: minmax(0, 1.35fr) minmax(380px, 1fr);\n  gap: 16px;\n  height: calc(100vh - 250px);\n  min-height: 560px;\n}\n@media (max-width: 1180px) {\n  .split {\n    grid-template-columns: 1fr;\n    height: auto;\n  }\n  .map-card {\n    height: 460px;\n  }\n  .list {\n    max-height: none;\n  }\n}\n.map-card {\n  position: relative;\n  overflow: hidden;\n  padding: 0;\n}\n.map-card vc-field-map {\n  position: absolute;\n  inset: 0;\n  border: 0;\n  border-radius: var(--radius);\n}\n.legend {\n  position: absolute;\n  left: 12px;\n  bottom: 28px;\n  z-index: 3;\n  background: rgba(255, 255, 255, 0.96);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n  padding: 10px 10px 8px;\n  min-width: 170px;\n  max-height: calc(100% - 90px);\n  overflow: auto;\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n}\n.lg-h {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--text-3);\n  margin: 0 4px 6px;\n}\n.lg {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  border: 0;\n  background: none;\n  padding: 4px;\n  border-radius: 5px;\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--stone-800);\n  cursor: pointer;\n  text-align: left;\n}\n.lg:hover {\n  background: var(--sand-100);\n}\n.lg.off {\n  opacity: 0.42;\n}\n.lg .n {\n  margin-left: auto;\n  color: var(--text-3);\n  font-size: 11.5px;\n}\n.sw {\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n  flex: none;\n}\n.map-loading {\n  position: absolute;\n  top: 12px;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 3;\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  padding: 6px 12px;\n  border-radius: 999px;\n  background: var(--surface);\n  box-shadow: var(--shadow);\n  font-size: 12px;\n  color: var(--text-2);\n}\n.list {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  overflow: hidden;\n}\n.list-head {\n  display: flex;\n  gap: 8px;\n  padding: 12px;\n  border-bottom: 1px solid var(--border);\n  flex-wrap: wrap;\n}\n.list-head select {\n  width: auto;\n  min-width: 130px;\n  flex: 0 1 160px;\n}\n.search {\n  position: relative;\n  flex: 1;\n  min-width: 180px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.scroll {\n  flex: 1;\n  overflow: auto;\n}\n.fc {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n.fc .sw {\n  width: 8px;\n  height: 28px;\n  border-radius: 3px;\n}\n.code {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--stone-900);\n}\n.nm {\n  font-size: 12.5px;\n  color: var(--text-2);\n  max-width: 200px;\n}\n.min0 {\n  min-width: 0;\n}\n.farmer {\n  max-width: 140px;\n}\n.table td {\n  padding: 10px 12px;\n}\n.table th {\n  padding: 9px 12px;\n}\n.list-foot {\n  padding: 10px 14px;\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n}\n/*# sourceMappingURL=fields.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldsPage, { className: "FieldsPage", filePath: "src/app/features/fields/fields.page.ts", lineNumber: 162 });
})();

// src/app/features/fields/fields.routes.ts
var fields_routes_default = [
  { path: "", component: FieldsPage, title: "Fields & map \xB7 Varsapradaya Carbon" },
  { path: ":id", component: FieldDetailPage, title: "Field \xB7 Varsapradaya Carbon" }
];
export {
  fields_routes_default as default
};
//# debugId=efd94238-53d2-52ad-8fe0-4f0826d5f29d
//# sourceMappingURL=chunk-JAELHY75.js.map
