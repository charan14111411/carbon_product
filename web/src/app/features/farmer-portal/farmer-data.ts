import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { PaymentProfile } from '../benefits/benefit-types';

export interface StatementItem {
  pool_id: string;
  sale_code: string;
  rule_version: number;
  inputs: { area_ha?: number; practices?: number; fields?: string[]; share?: number };
  amount: string;
  currency: string;
  payout_status: 'paid' | 'pending' | 'on_hold' | 'failed' | 'not_scheduled';
  lines: string[];
}
export interface Statement { farmer_id: string; farmer_name: string; items: StatementItem[]; total_entitled: string; total_paid: string }
export interface ConsentState { purpose: string; state: 'granted' | 'withdrawn' | 'not_given'; granted: boolean; effective_on: string | null; event_id: string | null; agreement_id: string | null }
export interface ConsentEvent { id: string; purpose: string; granted: boolean; effective_on: string; channel: string; notes: string; created_at: string }
export interface Consents { farmer_id: string; current: ConsentState[]; history: ConsentEvent[] }
export interface Overview {
  farmer: { full_name: string; village: string; district: string; code: string };
  fpo: { name: string } | null;
  farms: { id: string; name: string; village: string; fields: { id: string; code: string; name: string; area_ha: number; crop_code: string | null; status: string }[] }[];
  total_area_ha: number;
  enrolments: { id: string; project_code: string; field_code: string; status: string; enrolled_on: string | null }[];
  practice_records: number;
}
export interface Grievance {
  id: string; code: string; category: string; subject: string; description: string; status: string; priority: string;
  due_on: string; overdue: boolean; resolution: string | null; created_at: string; history: { status?: string; note?: string; at?: string }[];
}

type Load<T> = { data: T | null; error: string | null; loading: boolean; status?: number };

/** Everything the farmer portal shows, loaded once per session and refreshed on demand. */
@Injectable({ providedIn: 'root' })
export class FarmerData {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  readonly farmerId = computed(() => this.auth.profile()?.scope?.['farmer_id'] ?? null);
  readonly firstName = computed(() => (this.statement().data?.farmer_name ?? this.auth.profile()?.full_name ?? '').split(' ')[0]);

  readonly statement = signal<Load<Statement>>({ data: null, error: null, loading: false });
  readonly consents = signal<Load<Consents>>({ data: null, error: null, loading: false });
  readonly profile = signal<Load<PaymentProfile>>({ data: null, error: null, loading: false });
  readonly overview = signal<Load<Overview>>({ data: null, error: null, loading: false });
  readonly grievances = signal<Load<Grievance[]>>({ data: null, error: null, loading: false });
  private started = false;

  init() {
    if (this.started || !this.farmerId()) return;
    this.started = true;
    this.refresh();
  }

  refresh() {
    const fid = this.farmerId();
    if (!fid) return;
    this.fetch(this.statement, `/farmers/${fid}/statement`);
    this.fetch(this.consents, `/farmers/${fid}/consents`);
    this.fetch(this.profile, `/farmers/${fid}/payment-profile`);
    this.fetch(this.overview, `/farmers/${fid}/overview`);
    this.fetch(this.grievances, '/grievances');
  }

  fetch<T>(sig: WritableSignal<Load<T>>, path: string) {
    sig.update(s => ({ ...s, loading: true, error: null }));
    this.api.get<T>(path).subscribe({
      next: d => sig.set({ data: d, error: null, loading: false }),
      error: (e: ApiError) => sig.set({ data: null, error: e.message, loading: false, status: e.status }),
    });
  }

  reloadConsents() { const f = this.farmerId(); if (f) this.fetch(this.consents, `/farmers/${f}/consents`); }
  reloadGrievances() { this.fetch(this.grievances, '/grievances'); }
  setProfile(p: PaymentProfile) { this.profile.set({ data: p, error: null, loading: false }); }
}

export const PURPOSES: Record<string, { en: string; kn: string; what: string }> = {
  sampling: { en: 'Soil sampling on my fields', kn: 'ಮಣ್ಣಿನ ಮಾದರಿ ಸಂಗ್ರಹ', what: 'Field staff may visit to take small soil samples for lab testing.' },
  data_use: { en: 'Use of my farm data', kn: 'ನನ್ನ ಕೃಷಿ ಮಾಹಿತಿಯ ಬಳಕೆ', what: 'Your field boundaries and records are used to measure soil carbon.' },
  practice_monitoring: { en: 'Checking my farming practices', kn: 'ಕೃಷಿ ಪದ್ಧತಿಗಳ ಪರಿಶೀಲನೆ', what: 'Practices like mulching or cover crops are recorded and may be checked by satellite.' },
  share_with_buyers: { en: 'Sharing summaries with credit buyers', kn: 'ಖರೀದಿದಾರರೊಂದಿಗೆ ಹಂಚಿಕೆ', what: 'Buyers see project totals only — never your name, phone or exact location.' },
  payments: { en: 'Receiving payments', kn: 'ಹಣ ಪಾವತಿ', what: 'Your share of credit sales is paid to your UPI or bank account.' },
  sensor_installation: { en: 'Installing sensors on my land', kn: 'ಸಂವೇದಕ ಅಳವಡಿಕೆ', what: 'A small soil moisture or weather sensor may be placed on your field.' },
};

export const PAY_STATUS: Record<string, { label: string; kn: string; tone: string }> = {
  paid: { label: 'Paid', kn: 'ಪಾವತಿಯಾಗಿದೆ', tone: 'ok' },
  pending: { label: 'Scheduled', kn: 'ನಿಗದಿಯಾಗಿದೆ', tone: 'info' },
  on_hold: { label: 'On hold', kn: 'ತಡೆಹಿಡಿಯಲಾಗಿದೆ', tone: 'warn' },
  failed: { label: 'Did not go through', kn: 'ವಿಫಲವಾಗಿದೆ', tone: 'danger' },
  not_scheduled: { label: 'Being prepared', kn: 'ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ', tone: 'neutral' },
};
