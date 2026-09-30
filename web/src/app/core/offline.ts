import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { firstValueFrom } from 'rxjs';
import { ApiError, ApiService } from './api.service';

/* ------------------------------------------------------------------ stored shapes */
export interface BundlePoint {
  id: string;
  site_code: string;
  latitude: number;
  longitude: number;
  field_code?: string;
  field_id?: string;
  status: string;
  sequence?: number;
}

export interface Bundle {
  campaignId: string;
  savedAt: string;
  campaign: { id: string; code: string; name: string; kind: string; design: string; depth_from_cm: number; depth_to_cm: number };
  thresholds: { gps_accuracy_max_m: number | null; max_distance_from_site_m: number | null; required_photos: number | null };
  points: BundlePoint[];
  fields: GeoJSON.FeatureCollection;
  /** Extra context from the server bundle (optional for bundles saved by older builds). */
  project?: { id: string; code: string; name: string };
  rulesApproved?: boolean;
  shallowSoilAllowed?: boolean | null;
}

export interface QueuedPhoto {
  kind: 'hole' | 'core' | 'surroundings' | 'extra';
  blob: Blob;
  name: string;
  type: string;
  takenAt: string;
  lat: number | null;
  lon: number | null;
  serverId?: string;
}

export type SyncState = 'queued' | 'syncing' | 'synced' | 'rejected';

export interface QueuedSample {
  localId: string;           // also the idempotency key sent to the server
  campaignId: string;
  pointId: string;
  siteCode: string;
  createdAt: string;
  payload: {
    collected_at: string;
    latitude: number;
    longitude: number;
    gps_accuracy_m: number | null;
    depth_reached_cm: number;
    layers: { depth_from_cm: number; depth_to_cm: number; label_qr: string }[];
    deviation_reason: string | null;
    device_id: string;
  };
  photos: QueuedPhoto[];
  state: SyncState;
  attempts: number;
  error?: string;
  serverId?: string;
  serverCode?: string;
  findings?: { rule_code: string; severity: string; message: string }[];
}

export interface QueuedPractice {
  localId: string;
  createdAt: string;
  payload: Record<string, unknown>;
  photos: QueuedPhoto[];
  state: SyncState;
  attempts: number;
  error?: string;
  serverId?: string;
  label: string;
}

class FieldDb extends Dexie {
  bundles!: Table<Bundle, string>;
  samples!: Table<QueuedSample, string>;
  practices!: Table<QueuedPractice, string>;
  constructor() {
    super('vc-field');
    this.version(1).stores({
      bundles: 'campaignId, savedAt',
      samples: 'localId, campaignId, pointId, state, createdAt',
      practices: 'localId, state, createdAt',
    });
  }
}

/** Errors that will never succeed on retry. */
function permanent(e: ApiError): boolean {
  return e.status >= 400 && e.status < 500 && ![401, 408, 425, 429].includes(e.status);
}

export function deviceId(): string {
  const k = 'vc.device';
  let v = localStorage.getItem(k);
  if (!v) {
    v = `web-${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem(k, v);
  }
  return v;
}

/**
 * Offline-first store for the field app. Everything is saved on the device first;
 * `sync()` uploads when there is a connection. Safe to call repeatedly.
 */
@Injectable({ providedIn: 'root' })
export class OfflineStore {
  private api = inject(ApiService);
  private zone = inject(NgZone);
  private db = new FieldDb();

  readonly online = signal(navigator.onLine);
  readonly syncing = signal(false);
  readonly queued = signal(0);
  readonly rejected = signal(0);
  readonly lastSync = signal<string | null>(localStorage.getItem('vc.lastSync'));
  /** Bumped whenever the local queue changes, so screens can re-read it. */
  readonly changed = signal(0);
  readonly status = computed(() => (!this.online() ? 'offline' : this.syncing() ? 'syncing' : this.queued() ? 'pending' : 'ok'));

  constructor() {
    window.addEventListener('online', () => this.zone.run(() => { this.online.set(true); void this.sync(); }));
    window.addEventListener('offline', () => this.zone.run(() => this.online.set(false)));
    void this.recover().then(() => this.refreshCounts());
  }

  /* ---------------------------------------------------------------- bundles */
  async saveBundle(b: Omit<Bundle, 'savedAt'>): Promise<void> {
    await this.db.bundles.put({ ...b, savedAt: new Date().toISOString() });
  }
  bundle(campaignId: string) { return this.db.bundles.get(campaignId); }
  bundles() { return this.db.bundles.toArray(); }
  async removeBundle(campaignId: string) { await this.db.bundles.delete(campaignId); }

  /* ---------------------------------------------------------------- samples */
  async queueSample(s: Omit<QueuedSample, 'state' | 'attempts' | 'createdAt'>): Promise<void> {
    await this.db.samples.put({ ...s, state: 'queued', attempts: 0, createdAt: new Date().toISOString() });
    await this.refreshCounts();
    if (this.online()) void this.sync();
  }
  samplesFor(campaignId: string) { return this.db.samples.where('campaignId').equals(campaignId).toArray(); }
  allSamples() { return this.db.samples.orderBy('createdAt').reverse().toArray(); }
  async discardSample(localId: string) { await this.db.samples.delete(localId); await this.refreshCounts(); }

  /* ---------------------------------------------------------------- practices */
  async queuePractice(p: Omit<QueuedPractice, 'state' | 'attempts' | 'createdAt'>): Promise<void> {
    await this.db.practices.put({ ...p, state: 'queued', attempts: 0, createdAt: new Date().toISOString() });
    await this.refreshCounts();
    if (this.online()) void this.sync();
  }
  allPractices() { return this.db.practices.orderBy('createdAt').reverse().toArray(); }
  async discardPractice(localId: string) { await this.db.practices.delete(localId); await this.refreshCounts(); }

  /* ---------------------------------------------------------------- sync */
  async sync(): Promise<void> {
    if (this.syncing() || !navigator.onLine) return;
    this.syncing.set(true);
    try {
      for (const s of await this.db.samples.where('state').equals('queued').sortBy('createdAt')) {
        await this.pushSample(s);
        await this.refreshCounts();
      }
      for (const p of await this.db.practices.where('state').equals('queued').sortBy('createdAt')) {
        await this.pushPractice(p);
        await this.refreshCounts();
      }
      const now = new Date().toISOString();
      localStorage.setItem('vc.lastSync', now);
      this.lastSync.set(now);
    } finally {
      this.syncing.set(false);
      await this.refreshCounts();
    }
  }

  private async uploadPhotos(
    photos: QueuedPhoto[], entity: string, save: (p: QueuedPhoto[]) => Promise<unknown>,
  ): Promise<QueuedPhoto[]> {
    const out: QueuedPhoto[] = [];
    for (const [i, ph] of photos.entries()) {
      if (ph.serverId) { out.push(ph); continue; }
      const form = new FormData();
      form.append('file', new File([ph.blob], ph.name, { type: ph.type }));
      form.append('kind', 'photo');
      form.append('entity_type', entity);
      if (ph.lat !== null) form.append('latitude', String(ph.lat));
      if (ph.lon !== null) form.append('longitude', String(ph.lon));
      const r = await firstValueFrom(this.api.upload<{ id: string }>('/evidence', form));
      out.push({ ...ph, serverId: r.id });
      // Keep each uploaded id straight away, so a dropped connection doesn't re-upload earlier photos.
      await save([...out, ...photos.slice(i + 1)]);
    }
    return out;
  }

  private async pushSample(s: QueuedSample): Promise<void> {
    await this.db.samples.update(s.localId, { state: 'syncing' });
    try {
      const photos = await this.uploadPhotos(s.photos, 'sample', ph => this.db.samples.update(s.localId, { photos: ph }));
      // Save uploaded ids before posting, so a retry sends an identical request.
      await this.db.samples.update(s.localId, { photos });
      const res = await firstValueFrom(
        // POST /samples answers { replayed, sample: {id, code, …}, findings } (200 when replayed).
        this.api.post<{ replayed: boolean; sample: { id: string; code: string }; findings?: QueuedSample['findings'] }>('/samples', {
          ...s.payload,
          client_ref: s.localId,
          point_id: s.pointId,
          photo_ids: photos.map(p => p.serverId),
        }, { 'Idempotency-Key': s.localId }),
      );
      await this.db.samples.update(s.localId, {
        state: 'synced', serverId: res.sample?.id, serverCode: res.sample?.code, findings: res.findings ?? [], error: undefined,
      });
    } catch (err) {
      const e = err as ApiError;
      await this.db.samples.update(s.localId, {
        state: permanent(e) ? 'rejected' : 'queued', attempts: s.attempts + 1, error: e.message,
      });
    }
  }

  private async pushPractice(p: QueuedPractice): Promise<void> {
    await this.db.practices.update(p.localId, { state: 'syncing' });
    try {
      const photos = await this.uploadPhotos(p.photos, 'practice', ph => this.db.practices.update(p.localId, { photos: ph }));
      await this.db.practices.update(p.localId, { photos });
      const res = await firstValueFrom(
        this.api.post<{ record_id?: string; id?: string }>('/practices', {
          ...p.payload,
          client_ref: p.localId,
          evidence_ids: photos.map(ph => ph.serverId),
        }, { 'Idempotency-Key': p.localId }),
      );
      await this.db.practices.update(p.localId, { state: 'synced', serverId: res.record_id ?? res.id, error: undefined });
    } catch (err) {
      const e = err as ApiError;
      await this.db.practices.update(p.localId, {
        state: permanent(e) ? 'rejected' : 'queued', attempts: p.attempts + 1, error: e.message,
      });
    }
  }

  /** A tab closed mid-upload leaves records in 'syncing'; put them back in the queue. */
  private async recover(): Promise<void> {
    await this.db.samples.where('state').equals('syncing').modify({ state: 'queued' });
    await this.db.practices.where('state').equals('syncing').modify({ state: 'queued' });
  }

  async requeue(localId: string, kind: 'sample' | 'practice'): Promise<void> {
    const t = kind === 'sample' ? this.db.samples : this.db.practices;
    await t.update(localId, { state: 'queued', error: undefined });
    await this.refreshCounts();
    void this.sync();
  }

  async refreshCounts(): Promise<void> {
    const [q1, q2, r1, r2] = await Promise.all([
      this.db.samples.where('state').anyOf('queued', 'syncing').count(),
      this.db.practices.where('state').anyOf('queued', 'syncing').count(),
      this.db.samples.where('state').equals('rejected').count(),
      this.db.practices.where('state').equals('rejected').count(),
    ]);
    this.zone.run(() => {
      this.queued.set(q1 + q2);
      this.rejected.set(r1 + r2);
      this.changed.update(v => v + 1);
    });
  }

  /** Remove synced records older than 30 days (photos included) to free space. */
  async prune(days = 30): Promise<void> {
    const cutoff = new Date(Date.now() - days * 86400_000).toISOString();
    await this.db.samples.where('state').equals('synced').and(s => s.createdAt < cutoff).delete();
    await this.db.practices.where('state').equals('synced').and(p => p.createdAt < cutoff).delete();
  }
}
