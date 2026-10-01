import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { apiMessage, money } from '../credits/credit-ui';
import { PayoutBatch, PeopleDirectory } from './benefit-types';

export interface Attempt {
  id: string; payout_id: string; attempt_no: number; provider: string; provider_ref: string | null; amount: string; currency: string;
  status: string; error: string | null; at: string;
}
interface Item {
  id: string; outcome: string; payout_id: string | null; provider_ref: string | null; row_no: number | null;
  expected_amount: string | null; statement_amount: string | null; statement_status: string | null; note: string | null;
}
interface Run {
  id: string; batch_id: string; statement_evidence_id: string; statement_sha256: string; rows: number; status: 'reconciled' | 'mismatches';
  counts: Record<string, number>; created_by: string | null; created_at: string; items?: Item[]; exceptions?: Item[];
}
interface Report { batch_id: string; batch_code: string; latest: Run; history: Run[] }

export const OUTCOMES: Record<string, { label: string; hint: string; tone: 'ok' | 'warn' | 'danger' }> = {
  matched: { label: 'Matched', hint: 'Reference, amount and status agree', tone: 'ok' },
  amount_mismatch: { label: 'Amount differs', hint: 'The statement amount is not what was paid', tone: 'danger' },
  status_mismatch: { label: 'Status differs', hint: 'Provider reports failed or returned; we recorded paid', tone: 'danger' },
  missing_in_statement: { label: 'Missing from statement', hint: 'Recorded as paid, but not on the statement', tone: 'warn' },
  unknown_ref: { label: 'Unknown reference', hint: 'On the statement, but no paid payout has it', tone: 'warn' },
  duplicate_in_statement: { label: 'Listed twice', hint: 'Same reference appears more than once', tone: 'warn' },
  duplicate_payment: { label: 'Paid twice', hint: 'More than one successful attempt for one payout', tone: 'danger' },
};
const ORDER = ['matched', 'amount_mismatch', 'status_mismatch', 'duplicate_payment', 'missing_in_statement', 'unknown_ref', 'duplicate_in_statement'];

@Component({
  selector: 'vcx-reconcile',
  imports: [...KIT, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-callout tone="info" icon="scale">Upload the payment provider's settlement statement (CSV with columns <code>provider_ref</code>, <code>amount</code>, <code>status</code>).
      Each row is compared with what the platform recorded. <strong>Reconciliation never changes a payout</strong> — it only lists differences for finance to investigate.</vc-callout>

    @if (canRun) {
      <div class="up">
        <vc-file-drop [(file)]="file" accept=".csv,text/csv" label="Settlement statement (CSV)" hint="Stored as evidence with its fingerprint" />
        <button class="btn btn-primary" [disabled]="busy() || !file()" (click)="run()"><vc-icon name="scale" [size]="15" />{{ busy() ? 'Comparing…' : 'Reconcile' }}</button>
      </div>
    }
    @if (err()) { <vc-error title="Statement not reconciled" [message]="err()!">@if (rowErrors().length) { <ul class="re">@for (r of rowErrors(); track $index) { <li>Row {{ r.row }}: {{ r.message }}</li> }</ul> }</vc-error> }

    @if (loading()) { <div class="card"><vc-loading [rows]="4" /></div> }
    @else if (report(); as rep) {
      @let r = rep.latest;
      <section class="card">
        <div class="card-head">
          <h3>Latest reconciliation</h3>
          <vc-badge [status]="r.status === 'reconciled' ? 'ok' : 'mismatch'">{{ r.status === 'reconciled' ? 'All matched' : exceptions(r).length + ' to investigate' }}</vc-badge>
          <span class="small subtle">{{ r.rows }} rows · {{ r.created_at | day: true }} · {{ people.name(r.created_by) }}</span>
        </div>
        <div class="card-body stack">
          <div class="chips">
            @for (o of outcomesOf(r); track o.k) {
              <button type="button" class="chip" [class]="'t-' + o.tone" [class.on]="filter() === o.k" (click)="filter.set(filter() === o.k ? '' : o.k)" [title]="o.hint">
                <strong class="num">{{ o.n }}</strong>{{ o.label }}</button>
            }
          </div>
          <div class="row small subtle"><vc-icon name="fingerprint" [size]="13" />Statement <vc-hash [value]="r.statement_sha256" /></div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th class="num">Row</th><th>Result</th><th>Farmer</th><th>Provider ref</th><th class="num">Expected</th><th class="num">Statement</th><th>Status on statement</th></tr></thead>
            <tbody>
              @for (i of shown(r); track i.id) {
                <tr [class.bad]="i.outcome !== 'matched'">
                  <td class="num subtle">{{ i.row_no ?? '—' }}</td>
                  <td class="rc"><span class="oc" [class]="'t-' + meta(i.outcome).tone">{{ meta(i.outcome).label }}</span>@if (i.note) { <span class="small note">{{ i.note }}</span> }</td>
                  <td>{{ i.payout_id ? (names()[i.payout_id] ?? 'Farmer') : '—' }}</td>
                  <td class="mono small nowrap">{{ i.provider_ref || '—' }}</td>
                  <td class="num">{{ i.expected_amount ? m(i.expected_amount) : '—' }}</td>
                  <td class="num">{{ i.statement_amount ? m(i.statement_amount) : '—' }}</td>
                  <td class="small">{{ i.statement_status || '—' }}</td>
                </tr>
              } @empty { <tr><td colspan="7" class="subtle">No rows in this category.</td></tr> }
            </tbody>
          </table>
        </div>
      </section>
      @if (rep.history.length > 1) {
        <section class="card card-pad">
          <h3 style="margin-bottom:10px">Earlier runs</h3>
          @for (h of rep.history.slice(1); track h.id) {
            <div class="hr small"><span>{{ h.created_at | day: true }}</span><vc-badge [status]="h.status === 'reconciled' ? 'ok' : 'mismatch'">{{ h.status === 'reconciled' ? 'All matched' : 'Mismatches' }}</vc-badge><span class="subtle">{{ h.rows }} rows · {{ people.name(h.created_by) }}</span></div>
          }
        </section>
      }
    } @else if (!err()) {
      <div class="card"><vc-empty icon="scale" title="Not reconciled yet" text="Once the provider settles this batch, upload their statement to confirm every payment landed." /></div>
    }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:14px}
    code{font-size:12px;background:rgba(255,255,255,.6);padding:0 4px;border-radius:3px}
    .up{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center}
    .re{margin:6px 0 0;padding-left:18px;color:var(--stone-700);font-size:12.5px}
    .chips{display:flex;flex-wrap:wrap;gap:8px}
    .chip{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;border:1px solid var(--border);background:var(--surface);font:500 13px var(--font);cursor:pointer;color:var(--stone-700)}
    .chip strong{font-size:14px}
    .chip.t-ok strong{color:var(--forest-700)} .chip.t-warn strong{color:var(--amber-600)} .chip.t-danger strong{color:var(--red-600)}
    .chip.on{border-color:var(--forest-400);box-shadow:inset 0 0 0 1px var(--forest-400)}
    tr.bad td{background:var(--sand-50)}
    .oc{font-size:12px;font-weight:500;padding:2px 8px;border-radius:4px;white-space:nowrap}
    .oc.t-ok{background:var(--ok-soft);color:var(--forest-700)} .oc.t-warn{background:var(--warn-soft);color:var(--amber-600)} .oc.t-danger{background:var(--danger-soft);color:var(--red-600)}
    .rc{min-width:220px;max-width:300px} .note{display:block;margin-top:4px;color:var(--text-2)}
    .hr{display:flex;gap:10px;align-items:center;padding:6px 0;border-top:1px solid var(--stone-100)}
  `],
})
export class ReconcilePanel {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  people = inject(PeopleDirectory);
  batch = input.required<PayoutBatch>();
  names = input<Record<string, string>>({});
  canRun = inject(AuthService).can('payout.prepare', 'payout.approve');

  report = signal<Report | null>(null);
  loading = signal(true);
  busy = signal(false);
  err = signal<string | null>(null);
  rowErrors = signal<{ row: number; message: string }[]>([]);
  file = signal<File | null>(null);
  filter = signal('');

  constructor() {
    effect(() => { const b = this.batch(); untracked(() => this.load(b.id)); });
  }
  load(id: string) {
    this.loading.set(true);
    this.api.get<Report>(`/payout-batches/${id}/reconciliation`).subscribe({
      next: r => { this.report.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.report.set(null); this.loading.set(false); if (e.status !== 404) this.err.set(e.message); },
    });
  }
  m(v: string) { return money(v); }
  meta(k: string) { return OUTCOMES[k] ?? { label: k, hint: '', tone: 'warn' as const }; }
  exceptions(r: Run) { return r.exceptions ?? (r.items ?? []).filter(i => i.outcome !== 'matched'); }
  outcomesOf(r: Run) { return ORDER.filter(k => r.counts[k]).map(k => ({ k, n: r.counts[k], ...this.meta(k) })); }
  shown(r: Run) {
    const f = this.filter();
    const items = r.items ?? [];
    return f ? items.filter(i => i.outcome === f) : [...items].sort((a, b) => Number(a.outcome === 'matched') - Number(b.outcome === 'matched'));
  }
  run() {
    const f = this.file();
    if (!f) return;
    this.busy.set(true);
    this.err.set(null);
    this.rowErrors.set([]);
    const form = new FormData();
    form.append('file', f);
    this.api.upload<Run>(`/payout-batches/${this.batch().id}/reconcile`, form).subscribe({
      next: r => {
        this.busy.set(false);
        this.file.set(null);
        this.filter.set('');
        r.status === 'reconciled' ? this.toast.success('Every payment matched', `${r.rows} statement rows checked.`) : this.toast.info('Differences found', `${this.exceptions(r).length} to investigate. Payouts were not changed.`);
        this.load(this.batch().id);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        this.err.set(apiMessage(e));
        this.rowErrors.set(((e.details?.['errors'] as { row: number; message: string }[] | undefined) ?? []).slice(0, 10));
      },
    });
  }
}
