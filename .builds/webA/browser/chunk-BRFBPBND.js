import {
  Th,
  Um,
  Vm
} from "./chunk-VJW22TG4.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewChild,
  effect,
  input,
  output,
  setClassMetadata,
  signal,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryAdvance,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵviewQuerySignal
} from "./chunk-O2E4BMDK.js";

// src/app/ui/map-view.ts
var _c0 = ["el"];
var _c1 = ["*"];
var EMPTY = { type: "FeatureCollection", features: [] };
function style(base) {
  const streets = {
    type: "raster",
    tiles: ["a", "b", "c", "d"].map((s) => `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png`),
    tileSize: 256,
    attribution: "\xA9 OpenStreetMap contributors \xA9 CARTO"
  };
  const sat = {
    type: "raster",
    tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
    tileSize: 256,
    attribution: "Imagery \xA9 Esri, Maxar, Earthstar Geographics"
  };
  return {
    version: 8,
    sources: { base: base === "streets" ? streets : sat },
    layers: [{ id: "base", type: "raster", source: "base" }]
  };
}
var MapView = class _MapView {
  polygons = input(
    null,
    ...ngDevMode ? [{ debugName: "polygons" }] : (
      /* istanbul ignore next */
      []
    )
  );
  points = input(
    null,
    ...ngDevMode ? [{ debugName: "points" }] : (
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
  fit = input(
    true,
    ...ngDevMode ? [{ debugName: "fit" }] : (
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
    "streets",
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
      const polys = this.polygons();
      const pts = this.points();
      if (!this.ready())
        return;
      this.setData(polys ?? EMPTY, pts ?? EMPTY);
    });
  }
  ngAfterViewInit() {
    this.map = new Vm({
      container: this.el().nativeElement,
      style: style(this.base()),
      center: [76.5, 13.2],
      zoom: 6,
      attributionControl: { compact: true }
    });
    this.map.addControl(new Um({ showCompass: false }), "top-right");
    this.map.on("load", () => {
      this.addLayers();
      this.ready.set(true);
    });
  }
  setBase(b) {
    if (!this.map || b === this.base())
      return;
    this.base.set(b);
    const polys = this.polygons() ?? EMPTY;
    const pts = this.points() ?? EMPTY;
    this.map.setStyle(style(b));
    this.map.once("styledata", () => {
      this.addLayers();
      this.setData(polys, pts);
    });
  }
  addLayers() {
    const m = this.map;
    if (m.getSource("polys"))
      return;
    m.addSource("polys", { type: "geojson", data: EMPTY, promoteId: "id" });
    m.addSource("pts", { type: "geojson", data: EMPTY, promoteId: "id" });
    m.addLayer({
      id: "poly-fill",
      type: "fill",
      source: "polys",
      paint: { "fill-color": ["coalesce", ["get", "color"], "#2f7249"], "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.42, 0.26] }
    });
    m.addLayer({
      id: "poly-line",
      type: "line",
      source: "polys",
      paint: { "line-color": ["coalesce", ["get", "color"], "#1f4a32"], "line-width": 1.6 }
    });
    m.addLayer({
      id: "pt",
      type: "circle",
      source: "pts",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 3.5, 15, 7],
        "circle-color": ["coalesce", ["get", "color"], "#c76329"],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1.5
      }
    });
    const popup = new Th({ closeButton: false, closeOnClick: false, offset: 8 });
    let hovered;
    for (const layer of ["poly-fill", "pt"]) {
      m.on("mousemove", layer, (e) => {
        m.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f)
          return;
        if (layer === "poly-fill") {
          if (hovered !== void 0)
            m.setFeatureState({ source: "polys", id: hovered }, { hover: false });
          hovered = f.id;
          if (hovered !== void 0)
            m.setFeatureState({ source: "polys", id: hovered }, { hover: true });
        }
        const label = f.properties?.["label"] ?? "";
        if (label)
          popup.setLngLat(e.lngLat).setHTML(label).addTo(m);
      });
      m.on("mouseleave", layer, () => {
        m.getCanvas().style.cursor = "";
        popup.remove();
        if (layer === "poly-fill" && hovered !== void 0) {
          m.setFeatureState({ source: "polys", id: hovered }, { hover: false });
          hovered = void 0;
        }
      });
      m.on("click", layer, (e) => {
        const f = e.features?.[0];
        if (f)
          this.featureClick.emit({ layer: layer === "pt" ? "point" : "polygon", id: String(f.properties?.["id"] ?? f.id), properties: f.properties ?? {} });
      });
    }
  }
  setData(polys, pts) {
    const m = this.map;
    if (!m)
      return;
    m.getSource("polys")?.setData(polys);
    m.getSource("pts")?.setData(pts);
    if (this.fit() && !this.fitted) {
      const b = bounds([...polys.features, ...pts.features]);
      if (b) {
        m.fitBounds(b, { padding: 48, maxZoom: 16, duration: 0 });
        this.fitted = true;
      }
    }
  }
  ngOnDestroy() {
    this.map?.remove();
  }
  static \u0275fac = function MapView_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MapView)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MapView, selectors: [["vc-map"]], viewQuery: function MapView_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.el, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, hostVars: 2, hostBindings: function MapView_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275styleProp("height", ctx.height());
    }
  }, inputs: { polygons: [1, "polygons"], points: [1, "points"], height: [1, "height"], fit: [1, "fit"] }, outputs: { featureClick: "featureClick" }, ngContentSelectors: _c1, decls: 8, vars: 4, consts: [["el", ""], [1, "map"], [1, "switch"], ["type", "button", 3, "click"]], template: function MapView_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElement(0, "div", 1, 0);
      \u0275\u0275domElementStart(2, "div", 2)(3, "button", 3);
      \u0275\u0275domListener("click", function MapView_Template_button_click_3_listener() {
        return ctx.setBase("streets");
      });
      \u0275\u0275text(4, "Map");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(5, "button", 3);
      \u0275\u0275domListener("click", function MapView_Template_button_click_5_listener() {
        return ctx.setBase("satellite");
      });
      \u0275\u0275text(6, "Satellite");
      \u0275\u0275domElementEnd()();
      \u0275\u0275projection(7);
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275classProp("on", ctx.base() === "streets");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("on", ctx.base() === "satellite");
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  position: relative;\n  border-radius: var(--%NS%radius);\n  overflow: hidden;\n  border: 1px solid var(--%NS%border);\n  background: #e8e6df;\n}\n.map[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n}\n.switch[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  display: flex;\n  background: var(--%NS%surface);\n  border-radius: 8px;\n  box-shadow: var(--%NS%shadow);\n  padding: 3px;\n  gap: 2px;\n  z-index: 2;\n}\n.switch[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 12px var(--%NS%font);\n  padding: 5px 10px;\n  border-radius: 6px;\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n}\n.switch[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  color: #fff;\n}\n/*# sourceMappingURL=map-view.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MapView, [{
    type: Component,
    args: [{ selector: "vc-map", changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div #el class="map"></div>
    <div class="switch">
      <button type="button" [class.on]="base() === 'streets'" (click)="setBase('streets')">Map</button>
      <button type="button" [class.on]="base() === 'satellite'" (click)="setBase('satellite')">Satellite</button>
    </div>
    <ng-content />
  `, host: { "[style.height]": "height()" }, styles: ["/* angular:styles/component:scss;983e4bca728a8968;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\map-view.ts */\n:host {\n  display: block;\n  position: relative;\n  border-radius: var(--radius);\n  overflow: hidden;\n  border: 1px solid var(--border);\n  background: #e8e6df;\n}\n.map {\n  position: absolute;\n  inset: 0;\n}\n.switch {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  display: flex;\n  background: var(--surface);\n  border-radius: 8px;\n  box-shadow: var(--shadow);\n  padding: 3px;\n  gap: 2px;\n  z-index: 2;\n}\n.switch button {\n  border: 0;\n  background: none;\n  font: 500 12px var(--font);\n  padding: 5px 10px;\n  border-radius: 6px;\n  color: var(--stone-600);\n  cursor: pointer;\n}\n.switch button.on {\n  background: var(--forest-600);\n  color: #fff;\n}\n/*# sourceMappingURL=map-view.css.map */\n"] }]
  }], () => [], { polygons: [{ type: Input, args: [{ isSignal: true, alias: "polygons", required: false }] }], points: [{ type: Input, args: [{ isSignal: true, alias: "points", required: false }] }], height: [{ type: Input, args: [{ isSignal: true, alias: "height", required: false }] }], fit: [{ type: Input, args: [{ isSignal: true, alias: "fit", required: false }] }], featureClick: [{ type: Output, args: ["featureClick"] }], el: [{ type: ViewChild, args: ["el", { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MapView, { className: "MapView", filePath: "src/app/ui/map-view.ts", lineNumber: 54 });
})();
function bounds(features) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const walk = (c) => {
    if (Array.isArray(c) && typeof c[0] === "number") {
      const [x, y] = c;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    } else if (Array.isArray(c))
      c.forEach(walk);
  };
  for (const f of features)
    if (f.geometry && "coordinates" in f.geometry)
      walk(f.geometry.coordinates);
  return Number.isFinite(minX) ? [[minX, minY], [maxX, maxY]] : null;
}

export {
  MapView
};
//# debugId=605b206e-084e-5153-ad95-5c9e6d9c8576
//# sourceMappingURL=chunk-BRFBPBND.js.map
