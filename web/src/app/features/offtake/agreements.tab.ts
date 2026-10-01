import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe, fmtDate, fmtNum } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Chart } from '../../ui/chart';
import { KIT } from '../../ui/kit';
import { PeopleDirectory } from '../benefits/benefit-types';
import { Steps, TYPE_LABEL, apiMessage, money } from '../credits/credit-ui';
import { isoToday, openEvidence, selfApprovalMessage, uploadEvidence } from '../households/lookups';
import { ConfirmDialog } from '../programmes/confirm';
import { AGREEMENT_STEPS, Agreement, MarketLookups, Offer, SCHEDULE_STATUS } from './offtake-types';

const SKY = '#1f5f99';
const CLAY = '#c76329';

@Component({
  selector: 'vcx-agreements-tab',
  imports: [...KIT, FormsModule, DayPipe, NumPipe, Steps, Chart, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">Contracts with buyers for a volume of credits over time. Sales whose contract reference is the agreement code count as deliveries.</p>
      <span class="spacer"></span>
      @if (canManage) { <button class="btn btn-primary" (click)="openCreate(null)"><vc-icon name="plus" />New agreement</button> }
    </div>

    <section class="card">
      @if (loading() && !all().length) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load agreements" [message]="error()!" /></div> }
      @else if (!all().length) {
        <vc-empty icon="handshake" title="No offtake agreements yet" text="Record a multi-year purchase commitment from a buyer, with its delivery schedule, price and signed contract.">
          @if (canManage) { <button class="btn btn-primary" (click)="openCreate(null)"><vc-icon name="plus" />New agreement</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Agreement</th><th>Buyer</th><th>Credits</th><th class="num">Volume</th><th>Price</th><th>Term</th><th>Progress</th></tr></thead>
            <tbody>
              @for (a of all(); track a.id) {
                <tr class="clickable" (click)="open(a)">
                  <td><div class="ag"><span class="mono small subtle">{{ a.code }}</span><strong>{{ a.title }}</strong></div></td>
                  <td>{{ a.buyer_name }}</td>
                  <td class="small">{{ a.credit_type === 'any' ? 'Any type' : tl(a.credit_type) }}@if (a.vintages.length) { · {{ a.vintages.join(', ') }} }</td>
                  <td class="num">{{ a.total_volume_t | num: 0 }} <span class="u">t</span></td>
                  <td class="nowrap">{{ m(a.price, a.currency) }} <span class="subtle small">{{ a.price_type === 'fixed' ? 'fixed' : 'floor' }}</span></td>
                  <td class="small nowrap">{{ a.effective_from ? (a.effective_from | day) : '—' }} – {{ a.effective_to ? (a.effective_to | day) : '—' }}</td>
                  <td>@if (a.status === 'terminated') { <vc-badge status="terminated">Terminated</vc-badge> } @else { <vcx-steps [steps]="steps" [current]="a.status" [compact]="true" [offPath]="[]" /> }</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- detail -->
    <vc-modal [open]="!!sel() || detailLoading()" (closed)="sel.set(null); detailLoading.set(false)" [drawer]="true" width="min(880px, 100vw)"
      [title]="sel() ? sel()!.title : 'Offtake agreement'" [subtitle]="sel() ? sel()!.code + ' · ' + sel()!.buyer_name : ''">
      @if (detailLoading() && !sel()) { <vc-loading [rows]="8" /> }
      @if (sel(); as a) {
        <div class="stack">
          @if (a.status === 'terminated') { <div class="row"><vc-badge status="terminated">Terminated</vc-badge><span class="muted small">{{ a.closed_on | day }}@if (a.close_reason) { — {{ a.close_reason }} }</span></div> }
          @else { <vcx-steps [steps]="steps" [current]="a.status" [offPath]="[]" /> }
          @if (a.status === 'draft') {
            <vc-callout tone="info" icon="shield">Next: upload the signed contract. Someone other than {{ people.name(a.created_by) }}, who prepared this agreement, must record the signing.</vc-callout>
          }

          @if (a.deliveries; as d) {
            <div class="grid grid-4">
              <vc-stat label="Contracted" [value]="fmt(d.total_volume_t)" unit="t" [accent]="true" />
              <vc-stat label="Delivered" [value]="fmt(d.delivered_t)" unit="t" [hint]="pct(d.delivered_t, d.total_volume_t) + ' of the volume'" />
              <vc-stat label="Due to date" [value]="fmt(d.due_to_date_t)" unit="t" [hint]="'Remaining ' + fmt(d.remaining_t) + ' t'" />
              <vc-stat label="Shortfall" [value]="fmt(d.shortfall_t)" unit="t" [hint]="d.on_track ? 'On track' : 'Behind schedule'" />
            </div>
            <section class="card">
              <div class="card-head"><h3>Scheduled vs delivered</h3>
                <vc-badge [status]="d.on_track ? 'ok' : 'warning'">{{ d.on_track ? 'On track' : 'Behind schedule' }}</vc-badge>
                @if (d.sales_with_issues) { <vc-badge status="mismatch">{{ d.sales_with_issues }} sale{{ d.sales_with_issues === 1 ? '' : 's' }} flagged</vc-badge> }</div>
              <div class="card-body">
                @if (d.schedule.length) { <vc-chart [option]="chart()" height="240px" /> }
                <p class="small subtle">{{ d.basis }}</p>
              </div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Due</th><th class="num">Quantity</th><th class="num">Cumulative</th><th>Status</th></tr></thead>
                  <tbody>@for (l of d.schedule; track l.due_date) {
                    <tr><td>{{ l.due_date | day }}</td><td class="num">{{ l.quantity | num: 2 }} t</td><td class="num">{{ l.cumulative_due | num: 2 }} t</td>
                      <td><vc-badge [status]="ss(l.status).badge">{{ ss(l.status).label }}</vc-badge></td></tr>
                  }</tbody>
                </table>
              </div>
            </section>
            <section class="card">
              <div class="card-head"><h3>Deliveries (sales)</h3><span class="small subtle">Sales with contract reference {{ a.code }}</span></div>
              @if (!d.sales.length) { <vc-empty icon="receipt" title="No deliveries yet" [text]="'Record a sale in Buyers & sales with contract reference ' + a.code + ' to count it here.'" /> }
              @else {
                <div class="table-wrap">
                  <table class="table">
                    <thead><tr><th>Sale</th><th>Trade date</th><th>Credits</th><th class="num">Quantity</th><th class="num">Unit price</th><th>Status</th><th>Checks</th></tr></thead>
                    <tbody>@for (s of d.sales; track s.sale_id) {
                      <tr [class.flag]="s.issues.length">
                        <td class="mono">{{ s.sale_code }}</td><td>{{ s.trade_date | day }}</td>
                        <td class="small">{{ tl(s.credit_type) }} · {{ s.vintage }}</td>
                        <td class="num">{{ s.quantity | num: 2 }} t</td><td class="num">{{ m(s.unit_price, s.currency) }}</td>
                        <td><vc-badge [status]="s.status" /></td>
                        <td class="small">@for (i of s.issues; track i) { <div class="iss"><vc-icon name="alert" [size]="12" />{{ i }}</div> } @empty { <span class="okc"><vc-icon name="check" [size]="12" />Matches</span> }</td>
                      </tr>
                    }</tbody>
                  </table>
                </div>
              }
            </section>
          }

          <dl class="kv">
            <dt>Seller</dt><dd>{{ a.seller_name }}</dd>
            <dt>Credits</dt><dd>{{ a.credit_type === 'any' ? 'Reductions or removals' : tl(a.credit_type) }}@if (a.vintages.length) { · vintages {{ a.vintages.join(', ') }} } @else { · any vintage }</dd>
            <dt>Price</dt><dd>{{ m(a.price, a.currency) }} per tonne · {{ a.price_type === 'fixed' ? 'fixed price' : 'floor price (at least)' }}</dd>
            <dt>Term</dt><dd>{{ a.effective_from ? (a.effective_from | day) : 'Not set' }} – {{ a.effective_to ? (a.effective_to | day) : 'Not set' }}</dd>
            <dt>Contract</dt><dd>@if (a.contract_evidence_id) { <button class="btn btn-ghost btn-sm" (click)="openFile(a.contract_evidence_id!)"><vc-icon name="file" [size]="14" />Signed contract</button> · signed {{ a.signed_on | day }} } @else { <span class="subtle">Not signed yet</span> }</dd>
            <dt>Prepared by</dt><dd>{{ people.name(a.created_by) }} · {{ a.created_at | day }}</dd>
          </dl>
          @if (a.notes) { <p class="notes">{{ a.notes }}</p> }

          @if (a.status === 'draft' && canManage) {
            <section class="card card-pad sign">
              <h3>Record signing</h3>
              @if (a.created_by === me) {
                <vc-callout tone="warn" icon="shield">You prepared this agreement, so a colleague must record the signing. Contracts always need a second person.</vc-callout>
              } @else {
                <vc-file-drop [(file)]="contract" accept=".pdf,.jpg,.jpeg,.png" label="Signed contract (PDF or scan)" hint="Stored as immutable evidence with a fingerprint" />
                <div class="row"><div class="field"><label for="so">Signed on</label><input id="so" type="date" class="input" [max]="today" [(ngModel)]="signedOn" /></div><span class="spacer"></span>
                  <button class="btn btn-primary" [disabled]="busy() || !contract() || !signedOn" (click)="sign(a)"><vc-icon name="pen-line" />{{ busy() ? 'Uploading…' : 'Record signed contract' }}</button></div>
              }
            </section>
          }
          @if (actionError()) { <vc-error title="Not done" [message]="actionError()!" /> }
        </div>
      }
      <ng-container footer>
        @if (sel(); as a) {
          @if (canManage && (a.status === 'signed' || a.status === 'active')) { <button class="btn btn-ghost dangerlink" (click)="terminateOpen.set(true)">Terminate</button> }
          <span class="spacer"></span>
          @if (canManage && a.status === 'signed') { <button class="btn btn-primary" [disabled]="busy()" (click)="move(a, 'activate', '')"><vc-icon name="play" />Activate</button> }
          @if (canManage && a.status === 'active') { <button class="btn btn-primary" [disabled]="busy()" (click)="completeOpen.set(true)"><vc-icon name="check-circle" />Mark completed</button> }
        }
      </ng-container>
    </vc-modal>

    <vc-confirm [(open)]="completeOpen" title="Mark the agreement completed?" confirmLabel="Mark completed" reason="optional" [busy]="busy()"
      message="Only possible once the full contracted volume has been delivered. If the rest will not be delivered, terminate the agreement instead."
      (confirmed)="move(sel()!, 'complete', $event)" />
    <vc-confirm [(open)]="terminateOpen" title="Terminate this agreement?" tone="danger" confirmLabel="Terminate" reason="required" reasonLabel="Why is it terminated?" [busy]="busy()"
      message="Deliveries already made stay on record. A terminated agreement can't be reactivated." (confirmed)="move(sel()!, 'terminate', $event)" />

    <!-- create -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="640px" title="New offtake agreement" [subtitle]="fromOffer() ? 'From accepted offer ' + fromOffer()!.code : 'Starts as a draft until the signed contract is recorded.'">
      <div class="form-grid">
        <div class="field span-2"><label for="at">Title</label><input id="at" class="input" [(ngModel)]="f.title" placeholder="e.g. 2026–2028 removals for Tata Agro" /></div>
        <div class="field"><label for="ab">Buyer</label><select id="ab" class="input" [(ngModel)]="f.buyer_id" [disabled]="!!fromOffer()"><option value="">Choose a buyer…</option>@for (b of lk.buyers(); track b.id) { <option [value]="b.id">{{ b.name }}</option> }</select></div>
        <div class="field"><label for="ac">Agreement code <span class="subtle">(optional)</span></label><input id="ac" class="input mono" [(ngModel)]="f.code" placeholder="Generated, e.g. OA-2026-001" />
          <span class="hint">Use this as the contract reference on each sale.</span></div>
        <div class="field"><label for="act">Credit type</label><select id="act" class="input" [(ngModel)]="f.credit_type"><option value="any">Reductions or removals</option><option value="reduction">Reductions only</option><option value="removal">Removals only</option></select></div>
        <div class="field"><label for="av">Vintages <span class="subtle">(optional)</span></label><input id="av" class="input num" [(ngModel)]="f.vintages" placeholder="2025, 2026" /></div>
        <div class="field"><label for="apt">Price</label><div class="unit">
          <select id="apt" class="input pt" [(ngModel)]="f.price_type" aria-label="Price type"><option value="fixed">Fixed</option><option value="floor">Floor</option></select>
          <input type="number" min="0" step="0.01" class="input num" [(ngModel)]="f.price" aria-label="Price per tonne" />
          <select class="input cur" [(ngModel)]="f.currency" aria-label="Currency"><option>INR</option><option>USD</option><option>EUR</option></select></div>
          <span class="hint">Per tonne. A floor price means each sale must be at least this.</span></div>
        <div class="field"><label for="atv">Total volume (tCO₂e)</label><input id="atv" type="number" min="0" step="0.01" class="input num" [(ngModel)]="f.total" /></div>
        <div class="field"><label for="aef">Effective from</label><input id="aef" type="date" class="input" [(ngModel)]="f.effective_from" /></div>
        <div class="field"><label for="aet">Effective to</label><input id="aet" type="date" class="input" [(ngModel)]="f.effective_to" /></div>

        <div class="span-2 sh"><h3>Delivery schedule</h3><span class="spacer"></span>
          <button type="button" class="btn btn-ghost btn-sm" [disabled]="!f.total || f.schedule.length < 1" (click)="splitEven()"><vc-icon name="split" [size]="14" />Split evenly</button>
          <button type="button" class="btn btn-secondary btn-sm" (click)="addLine()"><vc-icon name="plus" [size]="14" />Add delivery</button></div>
        <div class="span-2 sched">
          @for (l of f.schedule; track $index; let i = $index) {
            <div class="sl"><span class="n num">{{ i + 1 }}</span>
              <input type="date" class="input" [(ngModel)]="l.due_date" aria-label="Due date" />
              <div class="unit"><input type="number" min="0" step="0.01" class="input num" [(ngModel)]="l.quantity" aria-label="Quantity" /><span>t</span></div>
              <button type="button" class="btn btn-ghost btn-icon" [disabled]="f.schedule.length === 1" (click)="f.schedule.splice(i, 1)" aria-label="Remove delivery"><vc-icon name="trash" [size]="15" /></button></div>
          }
          <div class="ssum" [class.bad]="!scheduleOk()"><span>Scheduled</span><strong class="num">{{ sum() | num: 2 }} of {{ (f.total || 0) | num: 2 }} t</strong>
            @if (!scheduleOk()) { <span class="small">{{ scheduleMsg() }}</span> } @else { <vc-icon name="check" [size]="14" /> }</div>
        </div>
        <div class="field span-2"><label for="an">Notes</label><textarea id="an" class="input" rows="3" [(ngModel)]="f.notes"></textarea></div>
        @if (formError()) { <div class="span-2"><vc-error title="Agreement not created" [message]="formError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !f.buyer_id || f.title.trim().length < 3 || !f.price || !scheduleOk()" (click)="create()">Create draft agreement</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:10px;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap} .bar p{max-width:720px}
    .ag{display:flex;flex-direction:column;line-height:1.35} .u{font-size:11px;color:var(--text-3)}
    vc-stat{box-shadow:none}
    tr.flag td{background:var(--danger-soft)}
    .iss{display:flex;gap:4px;align-items:flex-start;color:var(--red-600)} .okc{display:inline-flex;gap:4px;align-items:center;color:var(--forest-700)}
    .notes{padding:12px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);white-space:pre-wrap;font-size:13.5px}
    .sign{display:flex;flex-direction:column;gap:12px;background:var(--surface-2)} .sign .row{align-items:flex-end}
    .dangerlink{color:var(--red-600)}
    .unit{display:flex;gap:6px;align-items:center} .unit span{color:var(--text-2);font-size:13px} .pt{width:100px;flex:none} .cur{width:86px;flex:none}
    .sh{display:flex;gap:8px;align-items:center;margin-top:6px;padding-top:14px;border-top:1px solid var(--border)}
    .sched{display:flex;flex-direction:column;gap:8px}
    .sl{display:grid;grid-template-columns:24px 1fr 1fr 36px;gap:8px;align-items:center}
    .n{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--sky-100);color:var(--sky-600);font-size:11.5px;font-weight:600}
    .ssum{display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:8px;background:var(--forest-50);color:var(--forest-800)}
    .ssum.bad{background:var(--warn-soft);color:var(--amber-600)} .ssum strong{margin-left:auto}
  `],
})
export class AgreementsTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  people = inject(PeopleDirectory);
  lk = inject(MarketLookups);
  canManage = this.auth.can('sales.manage');
  me = this.auth.profile()?.id;
  steps = AGREEMENT_STEPS;
  today = isoToday();

  all = signal<Agreement[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);
  sel = signal<Agreement | null>(null);
  detailLoading = signal(false);
  actionError = signal<string | null>(null);
  completeOpen = signal(false);
  terminateOpen = signal(false);
  contract = signal<File | null>(null);
  signedOn = isoToday();

  createOpen = signal(false);
  formError = signal<string | null>(null);
  fromOffer = signal<Offer | null>(null);
  f = this.blank();

  chart = computed(() => {
    const d = this.sel()?.deliveries;
    if (!d) return {};
    return {
      grid: { left: 8, right: 120, top: 40, bottom: 8, containLabel: true },
      legend: { data: ['Due by this date (cumulative, t)', 'Delivered to date'], left: 0 },
      tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${fmtNum(v, 2)} t` },
      xAxis: { type: 'category', data: d.schedule.map(s => fmtDate(s.due_date)) },
      yAxis: { type: 'value', max: (v: { max: number }) => Math.ceil(Math.max(v.max, d.delivered_t) * 1.1) },
      series: [
        { name: 'Due by this date (cumulative, t)', type: 'bar', barMaxWidth: 56, data: d.schedule.map(s => s.cumulative_due), color: SKY,
          itemStyle: { borderRadius: [4, 4, 0, 0] } },
        { name: 'Delivered to date', type: 'line', data: [], color: CLAY,
          markLine: { symbol: 'none', silent: true, lineStyle: { color: CLAY, width: 2, type: 'solid' },
            label: { formatter: `Delivered ${fmtNum(d.delivered_t, 1)} t`, color: '#1d2420', fontSize: 11, position: 'end' },
            data: [{ yAxis: d.delivered_t }] } },
      ],
    };
  });

  constructor() { this.people.load(); this.lk.load(); this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<Agreement[]>('/offtake-agreements').subscribe({
      next: r => { this.all.set(r); this.loading.set(false); this.error.set(null); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  m(v: string | number, c = 'INR') { return money(v, c); }
  tl(t: string) { return TYPE_LABEL[t] ?? t; }
  fmt(v: number) { return fmtNum(v, v >= 100 ? 0 : 2); }
  pct(a: number, b: number) { return b ? `${Math.round((a / b) * 100)}%` : '—'; }
  ss(s: string) { return SCHEDULE_STATUS[s] ?? { label: s, badge: s }; }
  openFile(id: string) { openEvidence(this.api, id).catch(e => this.toast.apiError(e, "Couldn't open the file")); }

  open(a: Agreement) {
    this.actionError.set(null);
    this.contract.set(null);
    this.detailLoading.set(true);
    this.api.get<Agreement>(`/offtake-agreements/${a.id}`).subscribe({
      next: r => { this.sel.set(r); this.detailLoading.set(false); },
      error: (e: ApiError) => { this.detailLoading.set(false); this.toast.apiError(e, "Couldn't open the agreement"); },
    });
  }
  private refresh(a: Agreement, msg: string) {
    this.busy.set(false);
    this.toast.success(msg);
    this.load();
    this.open(a);
  }
  sign(a: Agreement) {
    const file = this.contract();
    if (!file) return;
    this.busy.set(true);
    this.actionError.set(null);
    uploadEvidence(this.api, file, 'offtake_agreement', a.id).subscribe({
      next: ev => this.api.post<Agreement>(`/offtake-agreements/${a.id}/sign`, { contract_evidence_id: ev.id, signed_on: this.signedOn }).subscribe({
        next: r => this.refresh(r, `${r.code} signed`),
        error: (e: ApiError) => { this.busy.set(false); this.actionError.set(selfApprovalMessage(e, 'Recording a signed contract')); },
      }),
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(e.message); },
    });
  }
  move(a: Agreement, verb: 'activate' | 'complete' | 'terminate', reason: string) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<Agreement>(`/offtake-agreements/${a.id}/${verb}`, verb === 'activate' ? {} : { reason }).subscribe({
      next: r => { this.completeOpen.set(false); this.terminateOpen.set(false); this.refresh(r, `${r.code} ${verb === 'activate' ? 'is active' : verb === 'complete' ? 'completed' : 'terminated'}`); },
      error: (e: ApiError) => { this.busy.set(false); this.completeOpen.set(false); this.terminateOpen.set(false); this.actionError.set(apiMessage(e)); },
    });
  }

  private blank() {
    return { title: '', buyer_id: '', code: '', credit_type: 'any', vintages: '', price_type: 'fixed', price: null as number | null, currency: 'INR',
      total: null as number | null, effective_from: '', effective_to: '', notes: '', schedule: [{ due_date: '', quantity: null as number | null }] };
  }
  openCreate(o: Offer | null) {
    this.f = this.blank();
    this.fromOffer.set(o);
    if (o) {
      Object.assign(this.f, { buyer_id: o.buyer_id, credit_type: o.credit_type, vintages: o.vintage ? String(o.vintage) : '', price: Number(o.unit_price),
        currency: o.currency, total: o.quantity, title: `${o.buyer_name} · ${o.code}`, notes: o.terms, schedule: [{ due_date: '', quantity: o.quantity }] });
    }
    this.formError.set(null);
    this.createOpen.set(true);
  }
  addLine() { this.f.schedule.push({ due_date: '', quantity: null }); }
  splitEven() {
    const n = this.f.schedule.length;
    const tot = Number(this.f.total) || 0;
    const each = Math.floor((tot / n) * 100) / 100;
    this.f.schedule.forEach((l, i) => (l.quantity = i === n - 1 ? Math.round((tot - each * (n - 1)) * 100) / 100 : each));
  }
  sum() { return this.f.schedule.reduce((a, l) => a + (Number(l.quantity) || 0), 0); }
  scheduleMsg() {
    if (this.f.schedule.some(l => !l.due_date || !l.quantity)) return 'Give each delivery a date and quantity.';
    const ds = this.f.schedule.map(l => l.due_date);
    if (new Set(ds).size !== ds.length) return 'Each date can appear only once.';
    if (Math.abs(this.sum() - (Number(this.f.total) || 0)) > 1e-6) return 'Must add up to the total volume.';
    return '';
  }
  scheduleOk() { return !!this.f.total && !this.scheduleMsg(); }

  create() {
    this.busy.set(true);
    this.formError.set(null);
    const vintages = this.f.vintages.split(/[,\s]+/).map(v => parseInt(v, 10)).filter(v => !Number.isNaN(v));
    this.api.post<Agreement>('/offtake-agreements', {
      buyer_id: this.f.buyer_id, title: this.f.title.trim(), code: this.f.code.trim() || null, offer_id: this.fromOffer()?.id ?? null,
      credit_type: this.f.credit_type, total_volume_t: Number(this.f.total), vintages, price_type: this.f.price_type,
      price: Number(this.f.price).toFixed(2), currency: this.f.currency,
      delivery_schedule: this.f.schedule.map(l => ({ due_date: l.due_date, quantity: Number(l.quantity) })),
      effective_from: this.f.effective_from || null, effective_to: this.f.effective_to || null, notes: this.f.notes,
    }).subscribe({
      next: a => { this.busy.set(false); this.createOpen.set(false); this.toast.success(`Agreement ${a.code} created`, 'Upload the signed contract when it arrives.'); this.load(); this.open(a); },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(apiMessage(e)); },
    });
  }
}
