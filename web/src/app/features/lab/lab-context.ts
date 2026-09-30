import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Calibration, Lab } from './types';

export interface BagMatch {
  layerId: string;
  bagCode: string;
  labelQr: string;
  depth: string;
  sampleCode: string;
  collectedAt: string;
  campaignCode: string;
}

/** Shared state for the lab screens: which labs the user sees and approved calibrations. */
@Injectable()
export class LabContext {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  readonly labs = signal<Lab[]>([]);
  readonly labsLoaded = signal(false);
  readonly labsError = signal<string | null>(null);
  readonly calibrations = signal<Calibration[]>([]);

  /** A lab technician is tied to exactly one lab through their account scope. */
  readonly scopedLabId = computed(() => this.auth.profile()?.scope?.['lab_id'] ?? null);
  readonly isTechnician = computed(() => this.auth.profile()?.role === 'lab_technician');
  readonly myLab = computed(() => {
    const id = this.scopedLabId();
    return id ? this.labs().find(l => l.id === id) ?? null : null;
  });
  readonly unscopedTech = computed(() => this.isTechnician() && !this.scopedLabId());

  loadLabs(): void {
    this.api.get<Lab[]>('/labs').subscribe({
      next: l => { this.labs.set(l); this.labsLoaded.set(true); this.labsError.set(null); },
      error: (e: ApiError) => { this.labsError.set(e.message); this.labsLoaded.set(true); },
    });
  }

  loadCalibrations(): void {
    this.api.get<Calibration[]>('/spectral-calibrations').subscribe({
      next: c => this.calibrations.set(c),
      error: () => this.calibrations.set([]),
    });
  }

  labName(id: string | null | undefined): string {
    return this.labs().find(l => l.id === id)?.name ?? '—';
  }

  /** Resolve a bag code or label to its soil layer(s), via the traceability endpoint. */
  findBag(code: string): Observable<BagMatch[]> {
    const c = code.trim();
    if (!c) return of([]);
    return this.api.get<{
      matched: string; bag: { id: string } | null; campaign: { code: string };
      sample: { code: string; collected_at: string; layers: { id: string; code: string; label_qr: string; depth_from_cm: number; depth_to_cm: number }[] };
    }>(`/samples/by-code/${encodeURIComponent(c)}/trace`).pipe(
      map(t => t.sample.layers
        .filter(l => !t.bag || l.id === t.bag.id)
        .map(l => ({
          layerId: l.id, bagCode: l.code, labelQr: l.label_qr, depth: `${l.depth_from_cm}–${l.depth_to_cm} cm`,
          sampleCode: t.sample.code, collectedAt: t.sample.collected_at, campaignCode: t.campaign.code,
        }))),
    );
  }
}
