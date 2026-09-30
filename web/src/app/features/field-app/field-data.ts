import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { Bundle, OfflineStore } from '../../core/offline';

export interface Assignment {
  id: string;
  code: string;
  name: string;
  kind: string;
  design: string;
  status: string;
  planned_start: string;
  planned_end: string;
  depth_from_cm: number;
  depth_to_cm: number;
  points: { id: string; status: string }[];
  remaining: number;
}

export interface PracticeTypeLite {
  code: string;
  name: string;
  category: string;
  unit: string | null;
  requires_quantity: boolean;
  required_evidence: string[];
  fields: { key: string; label: string; type: 'text' | 'number' | 'choice'; required: boolean; choices: string[]; unit: string | null; min: number | null; max: number | null }[];
  is_active: boolean;
}

export interface FieldLite { id: string; code: string; name: string }

interface ServerBundle {
  campaign: { id: string; code: string; name: string; kind: string; design: string; depth_from_cm: number; depth_to_cm: number };
  project: { id: string; code: string; name: string };
  rules: { approved: boolean; gps_accuracy_max_m: number | null; max_distance_from_site_m: number | null; required_photos: number | null; shallow_soil_allowed: boolean | null };
  points: { id: string; site_code: string; latitude: number; longitude: number; field_code: string; field_id: string; status: string; sequence: number }[];
  fields: GeoJSON.FeatureCollection;
}

const A_KEY = 'vc.field.assignments';
const PT_KEY = 'vc.field.practiceTypes';
const F_KEY = 'vc.field.fields';

function readJson<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Server data the field app needs, cached on the phone so it keeps working without signal. */
@Injectable({ providedIn: 'root' })
export class FieldData {
  private api = inject(ApiService);
  private store = inject(OfflineStore);

  readonly assignments = signal<Assignment[]>(readJson<Assignment[]>(A_KEY, []));
  readonly assignmentsAt = signal<string | null>(localStorage.getItem(A_KEY + '.at'));
  readonly bundles = signal<Bundle[]>([]);

  async refreshBundles(): Promise<void> {
    this.bundles.set(await this.store.bundles());
  }

  async loadAssignments(): Promise<void> {
    const r = await firstValueFrom(this.api.get<Assignment[]>('/me/assignments'));
    const now = new Date().toISOString();
    localStorage.setItem(A_KEY, JSON.stringify(r));
    localStorage.setItem(A_KEY + '.at', now);
    this.assignments.set(r);
    this.assignmentsAt.set(now);
  }

  /** Download everything needed to work a campaign offline. */
  async download(campaignId: string): Promise<Bundle> {
    const b = await firstValueFrom(this.api.get<ServerBundle>(`/campaigns/${campaignId}/bundle`));
    const bundle: Omit<Bundle, 'savedAt'> = {
      campaignId: b.campaign.id,
      campaign: {
        id: b.campaign.id, code: b.campaign.code, name: b.campaign.name, kind: b.campaign.kind, design: b.campaign.design,
        depth_from_cm: b.campaign.depth_from_cm, depth_to_cm: b.campaign.depth_to_cm,
      },
      thresholds: {
        gps_accuracy_max_m: b.rules.gps_accuracy_max_m, max_distance_from_site_m: b.rules.max_distance_from_site_m,
        required_photos: b.rules.required_photos,
      },
      points: b.points.map(p => ({
        id: p.id, site_code: p.site_code, latitude: p.latitude, longitude: p.longitude, field_code: p.field_code,
        field_id: p.field_id, status: p.status, sequence: p.sequence,
      })),
      fields: b.fields,
      project: b.project,
      rulesApproved: b.rules.approved,
      shallowSoilAllowed: b.rules.shallow_soil_allowed,
    };
    await this.store.saveBundle(bundle);
    await this.refreshBundles();
    this.rememberFields(b.fields);
    return (await this.store.bundle(campaignId))!;
  }

  async bundle(campaignId: string, allowDownload = true): Promise<Bundle | undefined> {
    const b = await this.store.bundle(campaignId);
    if (b || !allowDownload || !navigator.onLine) return b;
    return this.download(campaignId);
  }

  /* ---------------------------------------------------------------- practice form data */
  practiceTypes(): PracticeTypeLite[] {
    return readJson<PracticeTypeLite[]>(PT_KEY, []);
  }

  async loadPracticeTypes(): Promise<PracticeTypeLite[]> {
    const r = await firstValueFrom(this.api.get<PracticeTypeLite[]>('/catalogue/practice-types'));
    const active = r.filter(t => t.is_active);
    localStorage.setItem(PT_KEY, JSON.stringify(active));
    return active;
  }

  fields(): FieldLite[] {
    const byId = new Map<string, FieldLite>();
    for (const f of readJson<FieldLite[]>(F_KEY, [])) byId.set(f.id, f);
    for (const b of this.bundles()) {
      for (const ft of b.fields.features) {
        const p = ft.properties ?? {};
        byId.set(String(p['id']), { id: String(p['id']), code: String(p['code'] ?? ''), name: String(p['name'] ?? '') });
      }
    }
    return [...byId.values()].sort((a, b) => a.code.localeCompare(b.code));
  }

  async loadFields(): Promise<void> {
    try {
      const r = await firstValueFrom(this.api.get<{ items: FieldLite[] }>('/fields', { limit: 500 }));
      localStorage.setItem(F_KEY, JSON.stringify(r.items.map(f => ({ id: f.id, code: f.code, name: f.name }))));
    } catch (e) {
      if ((e as ApiError).status !== 403) throw e;
    }
  }

  private rememberFields(fc: GeoJSON.FeatureCollection) {
    const list = readJson<FieldLite[]>(F_KEY, []);
    const byId = new Map(list.map(f => [f.id, f]));
    for (const ft of fc.features) {
      const p = ft.properties ?? {};
      byId.set(String(p['id']), { id: String(p['id']), code: String(p['code'] ?? ''), name: String(p['name'] ?? '') });
    }
    localStorage.setItem(F_KEY, JSON.stringify([...byId.values()]));
  }
}
