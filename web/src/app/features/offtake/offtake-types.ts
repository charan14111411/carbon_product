import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';

export interface Offer {
  id: string; code: string; seller_name: string; buyer_id: string; buyer_name: string | null; batch_id: string; batch_code: string | null;
  vintage: number | null; credit_type: 'reduction' | 'removal'; quantity: number; unit_price: string; value: string; currency: string;
  valid_until: string; terms: string; status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
  sent_at: string | null; responded_at: string | null; response_note: string | null; created_at: string;
}
export interface ScheduleLine { due_date: string; quantity: number }
export interface DeliveryReport {
  agreement_code: string; total_volume_t: number; delivered_t: number; remaining_t: number; due_to_date_t: number; shortfall_t: number;
  on_track: boolean; by_sale_status: Record<string, number>;
  schedule: { due_date: string; quantity: number; cumulative_due: number; status: 'covered' | 'overdue' | 'due_soon' | 'upcoming' }[];
  sales: { sale_id: string; sale_code: string; status: string; quantity: number; credit_type: string; vintage: number | null; unit_price: string; currency: string; trade_date: string | null; issues: string[] }[];
  sales_with_issues: number; basis: string;
}
export interface Agreement {
  id: string; code: string; title: string; seller_name: string; buyer_id: string; buyer_name: string | null; offer_id: string | null;
  credit_type: 'reduction' | 'removal' | 'any'; total_volume_t: number; vintages: number[]; price_type: 'fixed' | 'floor'; price: string;
  currency: string; delivery_schedule: ScheduleLine[]; status: 'draft' | 'signed' | 'active' | 'completed' | 'terminated';
  contract_evidence_id: string | null; signed_on: string | null; effective_from: string | null; effective_to: string | null;
  closed_on: string | null; close_reason: string | null; notes: string; created_by: string | null; created_at: string;
  deliveries?: DeliveryReport;
}
export interface BuyerLite { id: string; name: string; kind: string; country: string }
export interface BatchLite {
  id: string; code: string; vintage: number; status: string; project_id: string;
  balances: Record<'reduction' | 'removal', Record<string, number>>;
}

export const OFFER_STEPS = ['draft', 'sent', 'accepted'];
export const AGREEMENT_STEPS = ['draft', 'signed', 'active', 'completed'];
export const SCHEDULE_STATUS: Record<string, { label: string; badge: string }> = {
  covered: { label: 'Covered', badge: 'complete' }, overdue: { label: 'Overdue', badge: 'failed' },
  due_soon: { label: 'Due within 30 days', badge: 'warning' }, upcoming: { label: 'Upcoming', badge: 'planned' },
};

/** Buyers and credit batches, loaded once for the offtake screens. */
@Injectable({ providedIn: 'root' })
export class MarketLookups {
  private api = inject(ApiService);
  readonly buyers = signal<BuyerLite[]>([]);
  readonly batches = signal<BatchLite[]>([]);
  load() {
    this.api.get<BuyerLite[]>('/buyers').subscribe({ next: r => this.buyers.set([...r].sort((a, b) => a.name.localeCompare(b.name))), error: () => {} });
    this.api.get<BatchLite[]>('/credit-batches').subscribe({ next: r => this.batches.set(r.filter(b => b.status !== 'cancelled')), error: () => {} });
  }
}
