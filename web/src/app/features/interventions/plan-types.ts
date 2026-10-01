import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { FarmerPublic } from '../households/lookups';

export interface Commitment {
  id?: string; practice_code: string; start_year: number; start_season: string | null; end_year: number | null;
  end_season: string | null; times_per_year: number; expected_quantity: number | null; unit: string | null; notes: string;
}
export interface PlanVersion { id: string; version: number; status: string; change_reason: string }
export interface Plan {
  id: string; plan_id: string; code: string; version: number; status: PlanStatus; project_id: string; enrolment_id: string;
  field_id: string; field_code: string | null; farmer_id: string; farmer: FarmerPublic | null; supersedes_id: string | null;
  change_reason: string; notes: string; agreed_at: string | null; agreed_method: 'otp' | 'assisted' | null;
  agreed_text_sha256: string | null; activated_by: string | null; activated_at: string | null; closed_on: string | null;
  close_reason: string | null; created_by: string | null; created_at: string;
  commitments?: Commitment[]; versions?: PlanVersion[];
}
export type PlanStatus = 'draft' | 'agreed' | 'active' | 'completed' | 'withdrawn' | 'superseded';
export type YearStatus = 'met' | 'partially' | 'not_met' | 'upcoming';

export interface YearRow {
  year: number; expected_times: number; recorded_times: number; expected_quantity: number | null; recorded_quantity: number;
  unit: string | null; record_ids: string[]; status: YearStatus;
}
export interface CommitmentCompliance { commitment: Commitment; status: YearStatus; years: YearRow[]; data_class: string }
export interface PlanCompliance {
  plan_row_id: string; code: string; version: number; status: string; counts: Record<string, number>;
  commitments: CommitmentCompliance[]; basis: string;
}
export interface ProjectCompliance {
  project_id: string; plans_by_status: Record<string, number>; commitments_by_status: Record<string, number>;
  plans_with_not_met: number; open_deviations: number; data_class: string;
  plans: { plan_row_id: string; code: string; version: number; status: string; field_code: string | null; farmer: FarmerPublic | null; overall: YearStatus; counts: Record<string, number> }[];
}
export interface Deviation {
  id: string; plan_id: string; plan_row_id: string; commitment_id: string | null; year: number | null; source: 'auto' | 'manual';
  kind: 'missed' | 'partial' | 'changed' | 'other'; reason: string; corrective_action: string;
  impact: 'unassessed' | 'none' | 'minor' | 'major'; status: 'open' | 'acknowledged' | 'closed';
  detail: Record<string, unknown>; history: { at: string; by: string; status: string; note: string }[]; created_at: string;
}
export interface PracticeType { id: string; code: string; name: string; category: string; crop_codes: string[]; unit: string | null; requires_quantity: boolean; is_active: boolean }

export const COMPLIANCE: Record<YearStatus, { label: string; kn: string; color: string; soft: string; text: string; icon: string }> = {
  met: { label: 'Met', kn: 'ಪೂರೈಸಲಾಗಿದೆ', color: 'var(--forest-500)', soft: 'var(--forest-100)', text: 'var(--forest-700)', icon: 'check' },
  partially: { label: 'Partly met', kn: 'ಭಾಗಶಃ', color: 'var(--amber-600)', soft: 'var(--amber-100)', text: 'var(--amber-600)', icon: 'minus' },
  not_met: { label: 'Not met', kn: 'ಪೂರೈಸಿಲ್ಲ', color: 'var(--red-600)', soft: 'var(--red-100)', text: 'var(--red-600)', icon: 'x' },
  upcoming: { label: 'Upcoming', kn: 'ಮುಂಬರುವ', color: 'var(--stone-300)', soft: 'var(--stone-100)', text: 'var(--stone-600)', icon: 'clock' },
};
export const COMPLIANCE_ORDER: YearStatus[] = ['met', 'partially', 'not_met', 'upcoming'];

export const PLAN_STEPS = ['draft', 'agreed', 'active', 'completed'];
export const PLAN_STEP_LABELS: Record<string, string> = { draft: 'Draft', agreed: 'Agreed by farmer', active: 'Active', completed: 'Completed' };

export const IMPACT: Record<string, string> = { unassessed: 'Not assessed', none: 'No impact', minor: 'Minor', major: 'Major' };
export const DEV_KIND: Record<string, string> = { missed: 'Missed', partial: 'Partly done', changed: 'Plan changed', other: 'Other' };

/** Practice catalogue (names and units), shared across plan screens. */
@Injectable({ providedIn: 'root' })
export class PracticeCatalogue {
  private api = inject(ApiService);
  readonly list = signal<PracticeType[]>([]);
  private started = false;
  readonly byCode = computed(() => new Map(this.list().map(p => [p.code, p])));
  load() {
    if (this.started) return;
    this.started = true;
    this.api.get<PracticeType[]>('/catalogue/practice-types').subscribe({ next: r => this.list.set(r), error: () => (this.started = false) });
  }
  name(code: string) { return this.byCode().get(code)?.name ?? code.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()); }
}

export function period(c: Commitment): string {
  const s = `${c.start_season ? c.start_season + ' ' : ''}${c.start_year}`;
  if (c.end_year === null || c.end_year === undefined) return `From ${s}, ongoing`;
  const e = `${c.end_season ? c.end_season + ' ' : ''}${c.end_year}`;
  return c.end_year === c.start_year && !c.end_season ? `${c.start_year}` : `${s} – ${e}`;
}
export function frequency(c: Commitment): string {
  const t = c.times_per_year === 1 ? 'Once a year' : c.times_per_year === 2 ? 'Twice a year' : `${c.times_per_year} times a year`;
  return c.expected_quantity ? `${t} · ${c.expected_quantity} ${c.unit ?? ''} per year`.trim() : t;
}
