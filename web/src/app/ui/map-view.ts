import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, input, output, signal, viewChild,
} from '@angular/core';
import { GeoJSONSource, LngLatBoundsLike, Map as MlMap, NavigationControl, Popup, StyleSpecification, setWorkerUrl } from 'maplibre-gl';

// MapLibre v6 runs its tile worker from a separate module file, served as a static asset.
setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

type FC = GeoJSON.FeatureCollection;

const EMPTY: FC = { type: 'FeatureCollection', features: [] };

function style(base: 'streets' | 'satellite'): StyleSpecification {
  const streets = {
    type: 'raster' as const,
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
    attribution: 'Basemap © Esri, HERE, Garmin, OpenStreetMap contributors',
  };
  const sat = {
    type: 'raster' as const,
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
    attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
  };
  return {
    version: 8,
    sources: { base: base === 'streets' ? streets : sat },
    layers: [{ id: 'base', type: 'raster', source: 'base' }],
  };
}

/**
 * Map of fields (polygons) and points. Feature property `color` sets the colour,
 * `label` the hover text, `id` is emitted on click.
 */
@Component({
  selector: 'vc-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #el class="map"></div>
    <div class="switch">
      <button type="button" [class.on]="base() === 'streets'" (click)="setBase('streets')">Map</button>
      <button type="button" [class.on]="base() === 'satellite'" (click)="setBase('satellite')">Satellite</button>
    </div>
    <ng-content />
  `,
  styles: [`
    :host{display:block;position:relative;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);background:#e8e6df}
    .map{position:absolute;inset:0}
    .switch{position:absolute;top:10px;left:10px;display:flex;background:var(--surface);border-radius:8px;box-shadow:var(--shadow);padding:3px;gap:2px;z-index:2}
    .switch button{border:0;background:none;font:500 12px var(--font);padding:5px 10px;border-radius:6px;color:var(--stone-600);cursor:pointer}
    .switch button.on{background:var(--forest-600);color:#fff}
  `],
  host: { '[style.height]': 'height()' },
})
export class MapView implements AfterViewInit, OnDestroy {
  polygons = input<FC | null>(null);
  points = input<FC | null>(null);
  height = input<string>('420px');
  fit = input<boolean>(true);
  featureClick = output<{ layer: 'polygon' | 'point'; id: string; properties: Record<string, unknown> }>();

  private el = viewChild.required<ElementRef<HTMLDivElement>>('el');
  base = signal<'streets' | 'satellite'>('streets');
  private map?: MlMap;
  private ready = signal(false);
  private fitted = false;

  constructor() {
    effect(() => {
      const polys = this.polygons();
      const pts = this.points();
      if (!this.ready()) return;
      this.setData(polys ?? EMPTY, pts ?? EMPTY);
    });
  }

  ngAfterViewInit(): void {
    this.map = new MlMap({
      container: this.el().nativeElement,
      style: style(this.base()),
      center: [76.5, 13.2],
      zoom: 6,
      attributionControl: { compact: true },
    });
    this.map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    this.map.on('load', () => {
      this.addLayers();
      this.ready.set(true);
    });
  }

  setBase(b: 'streets' | 'satellite') {
    if (!this.map || !this.ready() || b === this.base()) return;
    this.base.set(b);
    const polys = this.polygons() ?? EMPTY;
    const pts = this.points() ?? EMPTY;
    this.map.setStyle(style(b));
    this.map.once('styledata', () => {
      this.addLayers();
      this.setData(polys, pts);
    });
  }

  private addLayers() {
    const m = this.map!;
    if (m.getSource('polys')) return;
    m.addSource('polys', { type: 'geojson', data: EMPTY, promoteId: 'id' });
    m.addSource('pts', { type: 'geojson', data: EMPTY, promoteId: 'id' });
    m.addLayer({
      id: 'poly-fill', type: 'fill', source: 'polys',
      paint: { 'fill-color': ['coalesce', ['get', 'color'], '#2f7249'], 'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.42, 0.26] },
    });
    m.addLayer({
      id: 'poly-line', type: 'line', source: 'polys',
      paint: { 'line-color': ['coalesce', ['get', 'color'], '#1f4a32'], 'line-width': 1.6 },
    });
    m.addLayer({
      id: 'pt', type: 'circle', source: 'pts',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 3.5, 15, 7],
        'circle-color': ['coalesce', ['get', 'color'], '#c76329'],
        'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1.5,
      },
    });
    const popup = new Popup({ closeButton: false, closeOnClick: false, offset: 8 });
    let hovered: string | number | undefined;
    for (const layer of ['poly-fill', 'pt'] as const) {
      m.on('mousemove', layer, e => {
        m.getCanvas().style.cursor = 'pointer';
        const f = e.features?.[0];
        if (!f) return;
        if (layer === 'poly-fill') {
          if (hovered !== undefined) m.setFeatureState({ source: 'polys', id: hovered }, { hover: false });
          hovered = f.id;
          if (hovered !== undefined) m.setFeatureState({ source: 'polys', id: hovered }, { hover: true });
        }
        const label = (f.properties?.['label'] as string) ?? '';
        if (label) popup.setLngLat(e.lngLat).setHTML(label).addTo(m);
      });
      m.on('mouseleave', layer, () => {
        m.getCanvas().style.cursor = '';
        popup.remove();
        if (layer === 'poly-fill' && hovered !== undefined) {
          m.setFeatureState({ source: 'polys', id: hovered }, { hover: false });
          hovered = undefined;
        }
      });
      m.on('click', layer, e => {
        const f = e.features?.[0];
        if (f) this.featureClick.emit({ layer: layer === 'pt' ? 'point' : 'polygon', id: String(f.properties?.['id'] ?? f.id), properties: f.properties ?? {} });
      });
    }
  }

  private setData(polys: FC, pts: FC) {
    const m = this.map;
    if (!m) return;
    (m.getSource('polys') as GeoJSONSource | undefined)?.setData(polys);
    (m.getSource('pts') as GeoJSONSource | undefined)?.setData(pts);
    if (this.fit() && !this.fitted) {
      const b = bounds([...polys.features, ...pts.features]);
      if (b) {
        m.fitBounds(b, { padding: 48, maxZoom: 16, duration: 0 });
        this.fitted = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}

function bounds(features: GeoJSON.Feature[]): LngLatBoundsLike | null {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const walk = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === 'number') {
      const [x, y] = c as number[];
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    } else if (Array.isArray(c)) c.forEach(walk);
  };
  for (const f of features) if (f.geometry && 'coordinates' in f.geometry) walk(f.geometry.coordinates);
  return Number.isFinite(minX) ? [[minX, minY], [maxX, maxY]] : null;
}
