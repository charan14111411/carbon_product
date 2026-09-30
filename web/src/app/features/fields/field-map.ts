import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, input, output, signal, viewChild,
} from '@angular/core';
import { GeoJSONSource, LngLatBounds, Map as MlMap, NavigationControl, Popup, StyleSpecification } from 'maplibre-gl';
import '../../ui/map-view'; // registers the MapLibre worker URL (shared setup)
import { centroid, outerRing } from './field-geo';

type FC = GeoJSON.FeatureCollection;
const EMPTY: FC = { type: 'FeatureCollection', features: [] };

export function basemap(base: 'streets' | 'satellite'): StyleSpecification {
  const src = base === 'streets'
    ? {
        type: 'raster' as const, tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256, attribution: 'Basemap © Esri, HERE, Garmin, OpenStreetMap contributors',
      }
    : {
        type: 'raster' as const,
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
      };
  return {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: { base: src },
    layers: [{ id: 'base', type: 'raster', source: 'base' }],
  };
}

/**
 * Field boundaries coloured by `properties.color`, with a centre marker so small fields stay visible
 * when zoomed out, and code labels when zoomed in. `properties.label` (HTML) is the hover card.
 */
@Component({
  selector: 'vc-field-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #el class="map"></div>
    <div class="switch">
      <button type="button" [class.on]="base() === 'satellite'" (click)="setBase('satellite')">Satellite</button>
      <button type="button" [class.on]="base() === 'streets'" (click)="setBase('streets')">Map</button>
    </div>
    <button type="button" class="fit" (click)="fitAll()" title="Zoom to all fields" aria-label="Zoom to all fields">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
    </button>
    <ng-content />
  `,
  styles: [`
    :host{display:block;position:relative;overflow:hidden;background:#dcd8cc}
    .map{position:absolute;inset:0}
    .switch{position:absolute;top:10px;left:10px;display:flex;background:var(--surface);border-radius:8px;box-shadow:var(--shadow);padding:3px;gap:2px;z-index:2}
    .switch button{border:0;background:none;font:500 12px var(--font);padding:5px 10px;border-radius:6px;color:var(--stone-600);cursor:pointer}
    .switch button.on{background:var(--forest-600);color:#fff}
    .fit{position:absolute;top:84px;right:10px;z-index:2;display:grid;place-items:center;width:29px;height:29px;border:0;border-radius:var(--radius-sm);background:var(--surface);box-shadow:var(--shadow);color:var(--stone-700);cursor:pointer}
    .fit:hover{background:var(--sand-100)}
  `],
  host: { '[style.height]': 'height()' },
})
export class FieldMap implements AfterViewInit, OnDestroy {
  polygons = input<FC | null>(null);
  height = input<string>('420px');
  /** Id of a field to emphasise. */
  highlight = input<string | null>(null);
  maxZoom = input<number>(16);
  featureClick = output<string>();

  private el = viewChild.required<ElementRef<HTMLDivElement>>('el');
  base = signal<'streets' | 'satellite'>('satellite');
  private map?: MlMap;
  private ready = signal(false);
  private fitted = false;

  constructor() {
    effect(() => {
      const p = this.polygons();
      const h = this.highlight();
      if (!this.ready()) return;
      this.setData(p ?? EMPTY, h);
    });
  }

  ngAfterViewInit(): void {
    this.map = new MlMap({
      container: this.el().nativeElement, style: basemap(this.base()), center: [76.2, 12.6], zoom: 7,
      attributionControl: { compact: true },
    });
    this.map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    this.map.on('load', () => { this.addLayers(); this.bind(); this.ready.set(true); });
  }

  setBase(b: 'streets' | 'satellite') {
    if (!this.map || b === this.base()) return;
    this.base.set(b);
    this.map.setStyle(basemap(b));
    this.map.once('styledata', () => { this.addLayers(); this.setData(this.polygons() ?? EMPTY, this.highlight()); });
  }

  fitAll() {
    const b = new LngLatBounds();
    let any = false;
    for (const f of (this.polygons() ?? EMPTY).features) for (const p of outerRing(f.geometry)) { b.extend(p); any = true; }
    if (any) this.map?.fitBounds(b, { padding: 56, maxZoom: this.maxZoom(), duration: 400 });
  }

  private addLayers() {
    const m = this.map!;
    if (m.getSource('polys')) return;
    m.addSource('polys', { type: 'geojson', data: EMPTY, promoteId: 'id' });
    m.addSource('centres', { type: 'geojson', data: EMPTY, promoteId: 'id' });
    const sat = this.base() === 'satellite';
    m.addLayer({ id: 'poly-fill', type: 'fill', source: 'polys', paint: {
      'fill-color': ['coalesce', ['get', 'color'], '#2f7249'],
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.55, ['boolean', ['get', 'hl'], false], 0.5, sat ? 0.34 : 0.26],
    } });
    m.addLayer({ id: 'poly-line', type: 'line', source: 'polys', paint: {
      'line-color': sat ? '#ffffff' : ['coalesce', ['get', 'color'], '#1f4a32'],
      'line-width': ['case', ['boolean', ['get', 'hl'], false], 3, 1.6], 'line-opacity': 0.9,
    } });
    m.addLayer({ id: 'centre', type: 'circle', source: 'centres', maxzoom: 14.5, paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 4, 12, 6.5, 14.5, 5],
      'circle-color': ['coalesce', ['get', 'color'], '#2f7249'],
      'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1.6,
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 13, 1, 14.5, 0],
      'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 13, 1, 14.5, 0],
    } });
    m.addLayer({ id: 'code', type: 'symbol', source: 'centres', minzoom: 13.5, layout: {
      'text-field': ['get', 'code'], 'text-size': 11, 'text-font': ['Noto Sans Regular'], 'text-allow-overlap': false,
    }, paint: { 'text-color': '#ffffff', 'text-halo-color': 'rgba(16,41,28,.85)', 'text-halo-width': 1.4 } });
  }

  private bind() {
    const m = this.map!;
    const popup = new Popup({ closeButton: false, closeOnClick: false, offset: 10, maxWidth: '280px' });
    let hovered: string | number | undefined;
    for (const layer of ['poly-fill', 'centre'] as const) {
      m.on('mousemove', layer, e => {
        m.getCanvas().style.cursor = 'pointer';
        const f = e.features?.[0];
        if (!f) return;
        if (hovered !== undefined) m.setFeatureState({ source: 'polys', id: hovered }, { hover: false });
        hovered = f.id;
        if (hovered !== undefined) m.setFeatureState({ source: 'polys', id: hovered }, { hover: true });
        const label = (f.properties?.['label'] as string) ?? '';
        if (label) popup.setLngLat(e.lngLat).setHTML(label).addTo(m);
      });
      m.on('mouseleave', layer, () => {
        m.getCanvas().style.cursor = '';
        popup.remove();
        if (hovered !== undefined) m.setFeatureState({ source: 'polys', id: hovered }, { hover: false });
        hovered = undefined;
      });
      m.on('click', layer, e => {
        const f = e.features?.[0];
        if (f) this.featureClick.emit(String(f.properties?.['id'] ?? f.id));
      });
    }
  }

  private setData(polys: FC, hl: string | null) {
    const m = this.map;
    if (!m) return;
    const withHl: FC = { ...polys, features: polys.features.map(f => ({ ...f, properties: { ...f.properties, hl: String(f.id) === hl } })) };
    (m.getSource('polys') as GeoJSONSource | undefined)?.setData(withHl);
    (m.getSource('centres') as GeoJSONSource | undefined)?.setData({
      type: 'FeatureCollection',
      features: polys.features.map(f => ({
        type: 'Feature', id: f.id, properties: f.properties,
        geometry: { type: 'Point', coordinates: centroid(outerRing(f.geometry)) ?? [0, 0] },
      })),
    });
    if (!this.fitted && polys.features.length) {
      this.fitted = true;
      const b = new LngLatBounds();
      for (const f of polys.features) for (const p of outerRing(f.geometry)) b.extend(p);
      m.fitBounds(b, { padding: 56, maxZoom: this.maxZoom(), duration: 0 });
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
