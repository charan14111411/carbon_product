import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';

export interface BenefitRule {
  id: string;
  programme_id: string;
  version: number;
  farmer_share_pct: string;
  weights: Record<string, number>;
  deductions: { name: string; pct: number }[];
  min_payout: string | null;
  status: 'draft' | 'approved' | 'retired';
  approved_by: string | null;
  approved_at: string | null;
  notes: string;
  created_by: string | null;
  created_at: string;
}

export interface Entitlement {
  id: string;
  farmer_id: string;
  farmer_name: string | null;
  amount: string;
  calc_version: number;
  inputs: {
    area_ha?: number; practices?: number; credits_proxy_area_ha?: number; fields?: string[]; share?: number;
    component_shares?: Record<string, number>; rule_version?: number; sale_code?: string;
  };
}

export interface BenefitPool {
  id: string;
  sale_id: string;
  rule_id: string;
  gross_amount: string;
  deductions_amount: string;
  farmer_pool_amount: string;
  currency: string;
  status: 'calculated' | 'approved' | 'paid';
  created_at: string;
  data_class: string;
  breakdown: {
    sale_code?: string; quantity_t?: number; unit_price?: string; gross?: string;
    deductions?: { name: string; pct: string; amount: string }[]; net_after_deductions?: string; farmer_share_pct?: number;
    farmer_pool?: string; rule_version?: number; weights?: Record<string, number>; period?: [string, string]; farmers?: number;
    totals?: Record<string, number>; weights_used?: Record<string, number>; rounding?: string;
  };
  entitlements?: Entitlement[];
}

export interface PayoutLine {
  id: string;
  farmer_id: string;
  farmer_name: string | null;
  amount: string;
  status: 'pending' | 'paid' | 'failed' | 'on_hold';
  provider_ref: string | null;
  failure_reason: string | null;
  paid_at: string | null;
  attempts: number;
}

export interface PayoutBatch {
  id: string;
  code: string;
  pool_id: string;
  total_amount: string;
  status: string;
  approved_by: string | null;
  created_by: string | null;
  counts: Record<string, number>;
  paid_amount: string;
  lines?: PayoutLine[];
}

export interface PaymentProfile {
  id: string;
  farmer_id: string;
  method: 'upi' | 'bank';
  upi_id: string | null;
  account_masked: string | null;
  ifsc: string | null;
  account_name: string;
  verified: boolean;
  verified_on: string | null;
  updated_at: string;
}

export const WEIGHT_KEYS = ['area', 'practices', 'credits'] as const;
export const WEIGHT_LABEL: Record<string, string> = { area: 'Enrolled area', practices: 'Recorded practices', credits: 'Credit contribution' };
export const WEIGHT_COLOR: Record<string, string> = { area: '#2f7249', practices: '#c76329', credits: '#1f5f99' };

/** Staff names for "who did it". Needs data.read or users.manage; silently empty otherwise. */
@Injectable({ providedIn: 'root' })
export class PeopleDirectory {
  private api = inject(ApiService);
  private loaded = false;
  readonly names = signal<Record<string, string>>({});
  load() {
    if (this.loaded) return;
    this.loaded = true;
    this.api.get<{ id: string; full_name: string }[]>('/users').subscribe({
      next: us => this.names.set(Object.fromEntries(us.map(u => [u.id, u.full_name]))),
      error: () => {},
    });
  }
  name(id: string | null | undefined): string {
    if (!id) return 'System';
    return this.names()[id] ?? 'A colleague';
  }
}
