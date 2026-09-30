import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, input, model, signal, viewChild,
} from '@angular/core';
import { GeoJSONSource, LngLatBounds, Map as MlMap, NavigationControl } from 'maplibre-gl';
import { basemap } from './field-map';
import { LngLat } from './field-geo';

type FC = GeoJSON.FeatureCollection;
const EMPTY: FC = { type: 'FeatureCollection', features: [] };

const baseStyle = basemap;

/**
 * Click-to-add-vertex polygon drawing. `vertices` is two-way bound ([lon, lat] pairs, ring left open).
 * Vertices can be dragged to adjust them. `context` shows neighbouring fields for reference.
 */
@Component({
  selector: 'vc-draw-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #el class="map"></div>
    <div class="switch">
      <button type="button" [class.on]="base() === 'satellite'" (click)="setBase('satellite')">Satellite</button>
      <button type="button" [class.on]="base() === 'streets'" (click)="setBase('streets')">Map</button>
    </div>
    <div class="hint">
      @if (vertices().length === 0) { Click on the map to place the first corner of the field }
      @else if (vertices().length < 3) { Keep clicking to add corners — at least 3 are needed }
      @else { Drag a corner to adjust it · click to add more }
    </div>
  `,
  styles: [`
    :host{display:block;position:relative;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);background:#e8e6df}
    .map{position:absolute;inset:0}
    .map ::ng-deep canvas{cursor:crosshair}
    .switch{position:absolute;top:10px;left:10px;display:flex;background:var(--surface);border-radius:8px;box-shadow:var(--shadow);padding:3px;gap:2px;z-index:2}
    .switch button{border:0;background:none;font:500 12px var(--font);padding:5px 10px;border-radius:6px;color:var(--stone-600);cursor:pointer}
    .switch button.on{background:var(--forest-600);color:#fff}
    .hint{position:absolute;left:50%;top:12px;transform:translateX(-50%);z-index:2;padding:6px 12px;border-radius:999px;
      background:rgba(16,41,28,.82);color:#fff;font-size:12px;white-space:nowrap;pointer-events:none;backdrop-filter:blur(4px)}
  `],
  host: { '[style.height]': 'height()' },
})
export class DrawMap implements AfterViewInit, OnDestroy {
  vertices = model<LngLat[]>([]);
  context = input<FC | null>(null);
  height = input<string>('420px');
  /** Where to look when there's nothing drawn yet: [lon, lat]. */
  center = input<LngLat | null>(null);

  private el = viewChild.required<ElementRef<HTMLDivElement>>('el');
  base = signal<'streets' | 'satellite'>('satellite');
  private map?: MlMap;
  private ready = signal(false);
  private fitted = false;
  private dragIndex: number | null = null;

  constructor() {
    effect(() => {
      const v = this.vertices();
      const ctx = this.context();
      if (!this.ready()) return;
      this.render(v, ctx ?? EMPTY);
    });
  }

  ngAfterViewInit(): void {
    const c = this.center();
    this.map = new MlMap({
      container: this.el().nativeElement,
      style: baseStyle(this.base()),
      center: c ?? [76.5, 13.2],
      zoom: c ? 15 : 6,
      attributionControl: { compact: true },
      doubleClickZoom: false,
    });
    this.map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    this.map.on('load', () => { this.addLayers(); this.bind(); this.ready.set(true); });
  }

  setBase(b: 'streets' | 'satellite') {
    if (!this.map || b === this.base()) return;
    this.base.set(b);
    this.map.setStyle(baseStyle(b));
    this.map.once('styledata', () => { this.addLayers(); this.render(this.vertices(), this.context() ?? EMPTY); });
  }

  /** Zoom to the drawing (or to the context fields). */
  fit() {
    const m = this.map;
    if (!m) return;
    const b = new LngLatBounds();
    let any = false;
    for (const v of this.vertices()) { b.extend(v); any = true; }
    if (!any) {
      for (const f of (this.context() ?? EMPTY).features) walk((f.geometry as GeoJSON.Polygon)?.coordinates, p => { b.extend(p); any = true; });
    }
    if (any) m.fitBounds(b, { padding: 60, maxZoom: 17, duration: 300 });
  }

  private addLayers() {
    const m = this.map!;
    if (m.getSource('ctx')) return;
    m.addSource('ctx', { type: 'geojson', data: EMPTY });
    m.addSource('draft', { type: 'geojson', data: EMPTY });
    m.addSource('verts', { type: 'geojson', data: EMPTY });
    m.addLayer({ id: 'ctx-fill', type: 'fill', source: 'ctx', paint: { 'fill-color': '#ffffff', 'fill-opacity': 0.12 } });
    m.addLayer({ id: 'ctx-line', type: 'line', source: 'ctx', paint: { 'line-color': '#ffffff', 'line-width': 1.2, 'line-dasharray': [2, 2], 'line-opacity': 0.8 } });
    m.addLayer({ id: 'ctx-label', type: 'symbol', source: 'ctx', layout: { 'text-field': ['get', 'code'], 'text-size': 11, 'text-font': ['Noto Sans Regular'] },
      paint: { 'text-color': '#ffffff', 'text-halo-color': 'rgba(0,0,0,.6)', 'text-halo-width': 1.2 } });
    m.addLayer({ id: 'draft-fill', type: 'fill', source: 'draft', filter: ['==', '$type', 'Polygon'],
      paint: { 'fill-color': '#c76329', 'fill-opacity': 0.28 } });
    m.addLayer({ id: 'draft-line', type: 'line', source: 'draft', paint: { 'line-color': '#f8e6d9', 'line-width': 2.4 } });
    m.addLayer({ id: 'verts', type: 'circle', source: 'verts', paint: {
      'circle-radius': ['case', ['get', 'first'], 7, 5.5], 'circle-color': ['case', ['get', 'first'], '#c76329', '#ffffff'],
      'circle-stroke-color': '#c76329', 'circle-stroke-width': 2.2,
    } });
  }

  private bind() {
    const m = this.map!;
    m.on('click', e => {
      if (this.dragIndex !== null) return;
      const hit = m.queryRenderedFeatures(e.point, { layers: ['verts'] });
      if (hit.length) return; // clicking an existing corner doesn't add a new one
      this.vertices.update(v => [...v, [e.lngLat.lng, e.lngLat.lat]]);
    });
    m.on('mouseenter', 'verts', () => (m.getCanvas().style.cursor = 'grab'));
    m.on('mouseleave', 'verts', () => (m.getCanvas().style.cursor = ''));
    m.on('mousedown', 'verts', e => {
      const i = Number(e.features?.[0]?.properties?.['i']);
      if (!Number.isFinite(i)) return;
      e.preventDefault();
      this.dragIndex = i;
      m.getCanvas().style.cursor = 'grabbing';
      const move = (ev: { lngLat: { lng: number; lat: number } }) => {
        const idx = this.dragIndex;
        if (idx === null) return;
        this.vertices.update(v => v.map((p, k) => (k === idx ? [ev.lngLat.lng, ev.lngLat.lat] as LngLat : p)));
      };
      m.on('mousemove', move);
      m.once('mouseup', () => {
        m.off('mousemove', move);
        m.getCanvas().style.cursor = '';
        setTimeout(() => (this.dragIndex = null), 0);
      });
    });
  }

  private render(v: LngLat[], ctx: FC) {
    const m = this.map;
    if (!m) return;
    const draft: GeoJSON.Feature[] = [];
    if (v.length >= 3) draft.push({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[...v, v[0]]] } });
    else if (v.length === 2) draft.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: v } });
    (m.getSource('draft') as GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: draft });
    (m.getSource('verts') as GeoJSONSource | undefined)?.setData({
      type: 'FeatureCollection',
      features: v.map((p, i) => ({ type: 'Feature', properties: { i, first: i === 0 }, geometry: { type: 'Point', coordinates: p } })),
    });
    (m.getSource('ctx') as GeoJSONSource | undefined)?.setData(ctx);
    if (!this.fitted && (v.length || ctx.features.length)) {
      this.fitted = true;
      // the modal may still be animating in: measure again before fitting
      setTimeout(() => { m.resize(); this.fit(); }, 250);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}

function walk(c: unknown, f: (p: [number, number]) => void): void {
  if (Array.isArray(c) && typeof c[0] === 'number') f(c as [number, number]);
  else if (Array.isArray(c)) c.forEach(x => walk(x, f));
}
