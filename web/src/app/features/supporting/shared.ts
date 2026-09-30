import { signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiError } from '../../core/api.service';

/* Shared helpers for the intelligence screens (supporting, satellite, models, risk, grievances, partners). */

/** A tiny async state holder: data + loading + error, driven by one observable at a time. */
export class Remote<T> {
  readonly data = signal<T | null>(null);
  readonly loading = signal(false);
  readonly error = signal<ApiError | null>(null);
  private seq = 0;

  load(obs: Observable<T>, keep = false): void {
    const n = ++this.seq;
    this.loading.set(true);
    this.error.set(null);
    if (!keep) this.data.set(null);
    obs.subscribe({
      next: v => { if (n === this.seq) { this.data.set(v); this.loading.set(false); } },
      error: (e: ApiError) => { if (n === this.seq) { this.error.set(e); this.loading.set(false); } },
    });
  }

  reset(): void {
    this.seq++;
    this.data.set(null);
    this.error.set(null);
    this.loading.set(false);
  }
}

/* ------------------------------------------------------------------ data-source tiers */
export interface TierMeta { tier: number; label: string; short: string; color: string; soft: string; text: string; explain: string }

/** Colours mirror the design tokens (forest / teal / amber / stone) so charts and chips match. */
export const TIERS: Record<number, TierMeta> = {
  1: { tier: 1, label: 'Own device', short: 'Tier 1', color: '#275e3f', soft: 'var(--forest-100)', text: 'var(--forest-700)',
    explain: 'A SoilSync or MicroClime device on the field itself. Highest quality.' },
  2: { tier: 2, label: 'Nearby station', short: 'Tier 2', color: '#0e7280', soft: 'var(--teal-100)', text: 'var(--teal-600)',
    explain: 'A Varsapradaya device on a neighbouring farm, adjusted for distance and elevation.' },
  3: { tier: 3, label: 'External source', short: 'Tier 3', color: '#9a6200', soft: 'var(--amber-100)', text: 'var(--amber-600)',
    explain: 'Regional gridded data (weather reanalysis, soil maps). Useful, but coarse.' },
  0: { tier: 0, label: 'Not available', short: 'None', color: '#9aa29c', soft: 'var(--stone-100)', text: 'var(--stone-600)',
    explain: 'No source could supply a value for this day.' },
};
export const TIER_ORDER = [1, 2, 3, 0];
export function tierMeta(t: number | null | undefined): TierMeta {
  return TIERS[t ?? 0] ?? TIERS[0];
}

/* ------------------------------------------------------------------ dates */
export function isoDate(d: Date): string {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
}
export function daysAgo(n: number): string {
  return isoDate(new Date(Date.now() - n * 86400000));
}
export function addDays(iso: string, n: number): string {
  return isoDate(new Date(new Date(iso + 'T00:00:00').getTime() + n * 86400000));
}

/* ------------------------------------------------------------------ fields */
export interface FieldLite {
  id: string;
  farm_id: string;
  code: string;
  name: string;
  boundary: GeoJSON.Geometry;
  area_ha: number;
  centroid_lat: number;
  centroid_lon: number;
  crop_code: string | null;
  elevation_m: number | null;
  status: string;
}

export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Build a polygon collection from fields; `props` adds colour / label per field. */
export function fieldsFC(
  fields: FieldLite[], props: (f: FieldLite) => { color?: string; label?: string } | null,
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (const f of fields) {
    if (!f.boundary) continue;
    const p = props(f);
    if (p === null) continue;
    const geometry = (f.boundary as unknown as GeoJSON.Feature).type === 'Feature'
      ? (f.boundary as unknown as GeoJSON.Feature).geometry : f.boundary;
    features.push({ type: 'Feature', id: f.id, geometry, properties: { id: f.id, ...p } });
  }
  return { type: 'FeatureCollection', features };
}

export function pointsFC(items: { id: string; lat: number; lon: number; color?: string; label?: string }[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: items.map(i => ({
      type: 'Feature', id: i.id, geometry: { type: 'Point', coordinates: [i.lon, i.lat] },
      properties: { id: i.id, color: i.color, label: i.label },
    })),
  };
}

/** Simulated providers say so in their source reference; surface it as a label. */
export function isSimulated(ref: string | null | undefined): boolean {
  return !!ref && /simulated/i.test(ref);
}

export function pct(v: number | null | undefined, digits = 0): string {
  return v === null || v === undefined ? '—' : `${(v * 100).toFixed(digits)}%`;
}
