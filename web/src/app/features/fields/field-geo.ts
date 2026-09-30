/** Client-side geometry helpers for drawing and previewing field boundaries.
 *  Coordinates follow GeoJSON order: [lon, lat]. The server's area is always authoritative. */

export type LngLat = [number, number];

const R = 6_378_137; // WGS84 equatorial radius, as used by common planar-area approximations
const rad = (d: number) => (d * Math.PI) / 180;

/** Approximate geodesic area of a ring in hectares (spherical excess method). */
export function ringAreaHa(ring: LngLat[]): number {
  const pts = openRing(ring);
  if (pts.length < 3) return 0;
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    total += rad(x2 - x1) * (2 + Math.sin(rad(y1)) + Math.sin(rad(y2)));
  }
  return Math.abs((total * R * R) / 2) / 10_000;
}

/** Area of a GeoJSON Polygon / MultiPolygon in hectares (outer rings minus holes). */
export function geometryAreaHa(g: GeoJSON.Geometry | null | undefined): number {
  if (!g) return 0;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  let a = 0;
  for (const p of polys) {
    p.forEach((ring, i) => (a += (i === 0 ? 1 : -1) * ringAreaHa(ring as LngLat[])));
  }
  return a;
}

export function perimeterM(ring: LngLat[]): number {
  const pts = openRing(ring);
  if (pts.length < 2) return 0;
  let m = 0;
  for (let i = 0; i < pts.length; i++) {
    const [lon1, lat1] = pts[i];
    const [lon2, lat2] = pts[(i + 1) % pts.length];
    if (i === pts.length - 1 && pts.length < 3) break;
    const dp = rad(lat2 - lat1), dl = rad(lon2 - lon1);
    const h = Math.sin(dp / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dl / 2) ** 2;
    m += 2 * 6_371_008.8 * Math.asin(Math.sqrt(h));
  }
  return m;
}

/** Drop the closing vertex if the ring is closed. */
export function openRing(ring: LngLat[]): LngLat[] {
  if (ring.length > 1) {
    const a = ring[0], b = ring[ring.length - 1];
    if (a[0] === b[0] && a[1] === b[1]) return ring.slice(0, -1);
  }
  return ring;
}

export function toPolygon(vertices: LngLat[]): GeoJSON.Polygon {
  const r = openRing(vertices).map(v => [round(v[0]), round(v[1])] as LngLat);
  return { type: 'Polygon', coordinates: [[...r, r[0]]] };
}

/** Outer ring of the first polygon, open (no repeated closing vertex). */
export function outerRing(g: GeoJSON.Geometry | null | undefined): LngLat[] {
  if (!g) return [];
  if (g.type === 'Polygon') return openRing((g.coordinates[0] ?? []) as LngLat[]);
  if (g.type === 'MultiPolygon') return openRing((g.coordinates[0]?.[0] ?? []) as LngLat[]);
  return [];
}

const round = (v: number) => Math.round(v * 1e7) / 1e7;

export interface ParsedCoords { vertices: LngLat[]; errors: string[] }

/** Parse pasted coordinates, one "lat, lon" pair per line (commas, spaces or tabs). */
export function parseLatLonLines(text: string): ParsedCoords {
  const vertices: LngLat[] = [];
  const errors: string[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const parts = line.split(/[\s,;]+/).filter(Boolean).map(Number);
    if (parts.length !== 2 || parts.some(n => !Number.isFinite(n))) {
      errors.push(`Line ${i + 1}: expected “latitude, longitude”.`);
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

export function formatLatLonLines(vertices: LngLat[]): string {
  return openRing(vertices).map(([lon, lat]) => `${lat.toFixed(6)}, ${lon.toFixed(6)}`).join('\n');
}

/** Does the ring cross itself? (simple O(n²) segment test, enough for hand-drawn fields) */
export function selfIntersects(ring: LngLat[]): boolean {
  const p = openRing(ring);
  const n = p.length;
  if (n < 4) return false;
  const seg = (i: number): [LngLat, LngLat] => [p[i], p[(i + 1) % n]];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) continue;
      const [a, b] = seg(i), [c, d] = seg(j);
      if (cross(a, b, c, d)) return true;
    }
  }
  return false;
}

function orient(a: LngLat, b: LngLat, c: LngLat) {
  return Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
}
function cross(a: LngLat, b: LngLat, c: LngLat, d: LngLat) {
  return orient(a, b, c) !== orient(a, b, d) && orient(c, d, a) !== orient(c, d, b);
}

/** SVG path of a geometry's outer rings, fitted into a w×h box (for thumbnails). */
export function svgPath(geoms: (GeoJSON.Geometry | null | undefined)[], w: number, h: number, pad = 6): string[] {
  const rings = geoms.map(g => outerRing(g));
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of rings) for (const [x, y] of r) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  if (!Number.isFinite(minX)) return rings.map(() => '');
  const kx = Math.cos(rad((minY + maxY) / 2));
  const spanX = Math.max((maxX - minX) * kx, 1e-9), spanY = Math.max(maxY - minY, 1e-9);
  const s = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);
  const ox = (w - spanX * s) / 2, oy = (h - spanY * s) / 2;
  return rings.map(r =>
    r.length
      ? 'M' + r.map(([x, y]) => `${(ox + (x - minX) * kx * s).toFixed(1)},${(oy + (maxY - y) * s).toFixed(1)}`).join('L') + 'Z'
      : '',
  );
}

export function centroid(ring: LngLat[]): LngLat | null {
  const p = openRing(ring);
  if (!p.length) return null;
  return [p.reduce((s, v) => s + v[0], 0) / p.length, p.reduce((s, v) => s + v[1], 0) / p.length];
}
