import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { Steps, money } from '../credits/credit-ui';
import { PayoutBatch, PayoutLine, PeopleDirectory } from './benefit-types';
import { Attempt, ReconcilePanel } from './reconcile';

@Component({
  selector: 'vcx-payouts-tab',
  imports: [...KIT, DayPipe, Steps, ReconcilePanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">Payout batches pay each farmer their entitlement. A batch is prepared by one person and approved by another before it is sent. Payments are idempotent — a farmer is never paid twice.</p>
    </div>

    <section class="card">
      @if (loading()) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load payout batches" [message]="error()!" /></div> }
      @else if (!batches().length) {
        <vc-empty icon="wallet" title="No payout batches yet" text="Approve a benefit pool, then create its payout batch from the Benefit pools tab." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Batch</th><th>Progress</th><th class="num">Total</th><th class="num">Paid</th><th>Lines</th><th>Prepared by</th></tr></thead>
            <tbody>
              @for (b of batches(); track b.id) {
                <tr class="clickable" (click)="open(b.id)">
                  <td class="mono strong">{{ b.code }}</td>
                  <td><vcx-steps [steps]="steps" [current]="stepOf(b.status)" [compact]="true" [offPath]="[]" />
                    @if (b.status === 'partially_failed') { <vc-badge status="partially_failed" style="margin-top:4px" /> }</td>
                  <td class="num">{{ m(b.total_amount) }}</td>
                  <td class="num"><strong>{{ m(b.paid_amount) }}</strong></td>
                  <td class="counts small">
                    @for (c of countList(b); track c.k) { <span class="cnt" [class]="'t-' + c.k">{{ c.n }} {{ c.label }}</span> }
                  </td>
                  <td>{{ people.name(b.created_by) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [open]="!!detail() || detailLoading()" (closed)="detail.set(null); detailLoading.set(false)" [drawer]="true" width="min(900px, 100vw)"
      [title]="detail() ? 'Payout batch ' + detail()!.code : 'Payout batch'" [subtitle]="detail() ? 'Prepared by ' + people.name(detail()!.created_by) : ''">
      @if (detailLoading() && !detail()) { <vc-loading [rows]="8" /> }
      @if (detail(); as b) {
        <div class="stack">
          <vcx-steps [steps]="steps" [current]="stepOf(b.status)" [offPath]="[]" />
          <div class="grid grid-4">
            <vc-stat label="Batch total" [value]="m(b.total_amount)" [accent]="true" />
            <vc-stat label="Paid" [value]="m(b.paid_amount)" [hint]="plural(b.counts['paid'] ?? 0, 'farmer')" />
            <vc-stat label="On hold" [value]="m(sumBy(b, 'on_hold'))" [hint]="plural(b.counts['on_hold'] ?? 0, 'farmer') + ' · carried forward'" />
            <vc-stat label="Failed" [value]="m(sumBy(b, 'failed'))" [hint]="(b.counts['failed'] ?? 0) + ' to retry'" />
          </div>
          @if (b.status === 'draft') {
            <vc-callout tone="info" icon="shield">Waiting for approval. {{ people.name(b.created_by) }} prepared this batch, so a different finance approver must approve it.</vc-callout>
          } @else if (b.status === 'approved') {
            <vc-callout tone="ok" icon="check-circle">Approved by {{ people.name(b.approved_by) }}. Submit to send the pending payments to the payment provider.</vc-callout>
          } @else if (b.status === 'partially_failed') {
            <vc-callout tone="warn" icon="alert">Some payments didn't go through. Fix the farmer's payment details if needed, then retry each failed line.</vc-callout>
          }
          <vc-tabs [tabs]="subTabs()" [active]="sub()" (activeChange)="setSub($any($event))" />
          @if (sub() === 'lines') {
          <div class="card">
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Farmer</th><th class="num">Amount</th><th>Status</th><th>Details</th><th>Provider ref</th><th></th></tr></thead>
                <tbody>
                  @for (l of b.lines ?? []; track l.id) {
                    <tr>
                      <td>{{ l.farmer_name }}</td>
                      <td class="num"><strong>{{ m(l.amount) }}</strong></td>
                      <td><vc-badge [status]="l.status" /></td>
                      <td class="small reason">
                        @if (l.status === 'paid') { Paid {{ l.paid_at | day: true }} }
                        @else if (l.failure_reason) { {{ l.failure_reason }} }
                        @else { <span class="subtle">Will be paid on submit</span> }
                        @if (l.attempts > 1) { <span class="subtle"> · {{ l.attempts }} attempts</span> }
                      </td>
                      <td class="mono small nowrap">{{ l.provider_ref || '—' }}</td>
                      <td class="num">
                        @if (l.status === 'failed' && canRun) { <button class="btn btn-secondary btn-sm" [disabled]="busy()" (click)="retry(l)"><vc-icon name="refresh" [size]="13" />Retry</button> }
                        @if (l.status === 'on_hold' && canApprove) {
                          @if (b.created_by === me) { <span class="small subtle" title="You prepared this batch, so a colleague must release held payouts">Needs a colleague</span> }
                          @else { <button class="btn btn-secondary btn-sm" [disabled]="busy()" (click)="releasing.set(l)"><vc-icon name="unlock" [size]="13" />Release</button> }
                        }
                      </td>
                    </tr>
                  }
                </tbody>
                <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong>{{ m(b.total_amount) }}</strong></td><td colspan="4" class="subtle small">{{ b.lines?.length }} lines</td></tr></tfoot>
              </table>
            </div>
          </div>
          }
          @if (sub() === 'attempts') {
            <div class="card">
              @if (attemptsLoading()) { <vc-loading [rows]="4" /> }
              @else if (!attempts().length) { <vc-empty icon="history" title="No payment attempts yet" text="Every hand-over to the payment provider is logged here once the batch is submitted." /> }
              @else {
                <div class="table-wrap">
                  <table class="table">
                    <thead><tr><th>When</th><th>Farmer</th><th class="num">Try</th><th class="num">Amount</th><th>Result</th><th>Provider ref</th><th>Error</th></tr></thead>
                    <tbody>
                      @for (a of attempts(); track a.id) {
                        <tr><td class="nowrap small">{{ a.at | day: true }}</td><td class="nowrap">{{ lineName(a.payout_id) }}</td><td class="num">#{{ a.attempt_no }}</td>
                          <td class="num">{{ m(a.amount) }}</td><td><vc-badge [status]="a.status" /></td>
                          <td class="mono small nowrap">{{ a.provider_ref || '—' }}</td><td class="small reason">{{ a.error || '—' }}</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
                <p class="small subtle foot">Provider: {{ attempts()[0].provider }}. Each attempt reuses the payout's idempotency key, so the provider never pays the same line twice.</p>
              }
            </div>
          }
          @if (sub() === 'reconcile') { <vcx-reconcile [batch]="b" [names]="lineNames()" /> }
          @if (actionError()) { <vc-error title="Not done" [message]="actionError()!" /> }
        </div>
      }
      <ng-container footer>
        @if (detail(); as b) {
          @if (b.status === 'draft' && canApprove) {
            @if (b.created_by === me) {
              <span class="self small">You prepared this batch — a colleague must approve it.</span>
            } @else {
              <button class="btn btn-primary" [disabled]="busy()" (click)="approve(b)"><vc-icon name="check" [size]="15" />Approve batch</button>
            }
          }
          @if (b.status === 'approved' && canRun) {
            <button class="btn btn-primary" [disabled]="busy()" (click)="confirmSubmit.set(true)"><vc-icon name="send" [size]="15" />Submit for payment</button>
          }
          @if (b.status !== 'draft' && b.status !== 'approved') { <button class="btn btn-ghost" (click)="detail.set(null)">Close</button> }
        }
      </ng-container>
    </vc-modal>

    <vc-modal [open]="!!releasing()" (closed)="releasing.set(null)" title="Release this payout?" width="480px" [subtitle]="releasing()?.farmer_name ?? ''">
      @if (releasing(); as l) {
        <div class="stack">
          <p><strong>{{ m(l.amount) }}</strong> is on hold: {{ l.failure_reason || 'held back' }}</p>
          <p class="muted small">Releasing checks that the farmer's payment details are verified and the amount meets the minimum payout.
            @if (detail()?.status !== 'draft' && detail()?.status !== 'approved') { Because this batch has already been submitted, the payment is sent straight away. }</p>
          <vc-callout tone="info" icon="shield">A second person is required: you can't release a payout in a batch you prepared, or for payment details you verified.</vc-callout>
          @if (releaseError()) { <vc-error title="Not released" [message]="releaseError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="releasing.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="release()"><vc-icon name="unlock" [size]="15" />Release payout</button>
      </ng-container>
    </vc-modal>

    <vc-modal [(open)]="confirmSubmit" title="Send payments now?" width="480px" [subtitle]="detail()?.code ?? ''">
      <p>{{ pendingCount() }} payments totalling <strong>{{ m(pendingSum()) }}</strong> will be sent to farmers' verified UPI or bank accounts.
        Lines on hold are not paid.</p>
      <p class="muted small" style="margin-top:10px">This can't be undone. Each payment carries its own idempotency key, so retrying never pays twice.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="confirmSubmit.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="submit()">Send {{ pendingCount() }} payments</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{margin-bottom:18px} .bar p{max-width:760px}
    .strong{font-weight:600}
    .counts{display:flex;gap:6px;flex-wrap:wrap}
    .cnt{padding:1px 8px;border-radius:999px;background:var(--stone-100);color:var(--stone-700);white-space:nowrap}
    .cnt.t-paid{background:var(--ok-soft);color:var(--forest-700)} .cnt.t-failed{background:var(--danger-soft);color:var(--red-600)}
    .cnt.t-on_hold{background:var(--warn-soft);color:var(--amber-600)}
    .reason{max-width:300px;color:var(--text-2)}
    tfoot td{padding:12px 14px;border-top:1px solid var(--border);background:var(--surface-2)}
    .self{color:var(--amber-600);margin-right:auto}
    vc-stat{box-shadow:none}
    .foot{padding:10px 20px;border-top:1px solid var(--border)}
  `],
})
export class PayoutsTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  people = inject(PeopleDirectory);
  canApprove = this.auth.can('payout.approve');
  canRun = this.auth.can('payout.prepare', 'payout.approve');
  me = this.auth.profile()?.id;
  openId = input<string | null>(null);

  steps = ['draft', 'approved', 'submitted', 'completed'];
  batches = signal<PayoutBatch[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);
  detail = signal<PayoutBatch | null>(null);
  detailLoading = signal(false);
  actionError = signal<string | null>(null);
  confirmSubmit = signal(false);
  sub = signal<'lines' | 'attempts' | 'reconcile'>('lines');
  attempts = signal<Attempt[]>([]);
  attemptsLoading = signal(false);
  releasing = signal<PayoutLine | null>(null);
  releaseError = signal<string | null>(null);
  subTabs = computed(() => {
    const b = this.detail();
    const submitted = !!b && !['draft', 'approved'].includes(b.status);
    return [{ key: 'lines', label: 'Payout lines', count: b?.lines?.length ?? null },
      { key: 'attempts', label: 'Attempts log' }, ...(submitted ? [{ key: 'reconcile', label: 'Reconciliation' }] : [])];
  });
  lineNames = computed(() => Object.fromEntries((this.detail()?.lines ?? []).map(l => [l.id, l.farmer_name ?? 'Farmer'])));

  pendingCount = computed(() => (this.detail()?.lines ?? []).filter(l => l.status === 'pending').length);
  pendingSum = computed(() => (this.detail()?.lines ?? []).filter(l => l.status === 'pending').reduce((a, l) => a + Number(l.amount), 0));

  constructor() {
    this.people.load();
    this.load();
    effect(() => { const id = this.openId(); if (id) this.open(id); });
  }

  load() {
    this.loading.set(true);
    this.api.get<PayoutBatch[]>('/payout-batches').subscribe({
      next: r => { this.batches.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  m(v: string | number) { return money(v); }
  plural(n: number, w: string) { return `${n} ${w}${n === 1 ? '' : 's'}`; }
  stepOf(s: string) { return s === 'partially_failed' ? 'submitted' : s; }
  sumBy(b: PayoutBatch, st: string) { return (b.lines ?? []).filter(l => l.status === st).reduce((a, l) => a + Number(l.amount), 0); }
  countList(b: PayoutBatch) {
    const L: Record<string, string> = { paid: 'paid', pending: 'pending', on_hold: 'on hold', failed: 'failed' };
    return Object.entries(b.counts).filter(([, n]) => n).map(([k, n]) => ({ k, n, label: L[k] ?? k }));
  }

  lineName(id: string) { return this.lineNames()[id] ?? 'Farmer'; }
  setSub(t: 'lines' | 'attempts' | 'reconcile') {
    this.sub.set(t);
    if (t === 'attempts') this.loadAttempts();
  }
  loadAttempts() {
    const b = this.detail();
    if (!b) return;
    this.attemptsLoading.set(true);
    this.api.get<Attempt[]>(`/payout-batches/${b.id}/attempts`).subscribe({
      next: r => { this.attempts.set(r); this.attemptsLoading.set(false); },
      error: e => { this.attemptsLoading.set(false); this.attempts.set([]); this.toast.apiError(e, "Couldn't load the attempts log"); },
    });
  }
  release() {
    const l = this.releasing();
    if (!l) return;
    this.busy.set(true);
    this.releaseError.set(null);
    this.api.post<PayoutBatch>(`/payouts/${l.id}/release`).subscribe({
      next: nb => { this.releasing.set(null); this.after(nb, `Released payout for ${l.farmer_name}`); if (this.sub() === 'attempts') this.loadAttempts(); },
      error: (e: ApiError) => { this.busy.set(false); this.releaseError.set(e.code === 'SELF_APPROVAL_REJECTED' ? `${e.message} Releasing a held payout always needs a second person.` : e.message); },
    });
  }

  open(id: string) {
    this.sub.set('lines');
    this.releaseError.set(null);
    this.actionError.set(null);
    this.detailLoading.set(true);
    this.api.get<PayoutBatch>(`/payout-batches/${id}`).subscribe({
      next: b => { this.detail.set(b); this.detailLoading.set(false); },
      error: e => { this.detailLoading.set(false); this.toast.apiError(e, "Couldn't open the batch"); },
    });
  }

  private after(b: PayoutBatch, msg: string) {
    this.busy.set(false);
    this.detail.set(b);
    this.toast.success(msg);
    this.load();
  }
  private fail = (e: ApiError) => {
    this.busy.set(false);
    this.actionError.set(e.code === 'SELF_APPROVAL_REJECTED' ? `${e.message} Payout batches always need a second person.` : e.message);
  };

  approve(b: PayoutBatch) {
    this.busy.set(true);
    this.api.post<PayoutBatch>(`/payout-batches/${b.id}/approve`).subscribe({ next: nb => this.after(nb, `${nb.code} approved`), error: this.fail });
  }
  submit() {
    const b = this.detail();
    if (!b) return;
    this.busy.set(true);
    this.confirmSubmit.set(false);
    this.api.post<PayoutBatch>(`/payout-batches/${b.id}/submit`).subscribe({
      next: nb => this.after(nb, nb.status === 'completed' ? `${nb.code}: all payments sent` : `${nb.code}: some payments failed — see the lines`),
      error: this.fail,
    });
  }
  retry(l: PayoutLine) {
    this.busy.set(true);
    this.api.post<PayoutBatch>(`/payouts/${l.id}/retry`).subscribe({
      next: nb => this.after(nb, (nb.lines ?? []).find(x => x.id === l.id)?.status === 'paid' ? `Paid ${l.farmer_name}` : `Retry for ${l.farmer_name} failed again`),
      error: this.fail,
    });
  }
}
