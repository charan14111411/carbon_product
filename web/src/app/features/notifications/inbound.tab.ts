import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { apiMessage } from '../credits/credit-ui';
import { FarmerDirectory } from '../households/lookups';
import { PracticeCatalogue } from '../interventions/plan-types';
import { Inbound } from './notif-types';

interface FieldOpt { id: string; code: string; name: string; area_ha: number }

const STATUS_LABEL: Record<string, string> = {
  pending_review: 'Waiting for review', accepted: 'Accepted', rejected: 'Rejected', processed: 'Grievance opened',
  unrecognised: 'Not understood', unmatched: 'Unknown number',
};

@Component({
  selector: 'vcx-inbound-tab',
  imports: [...KIT, FormsModule, RouterLink, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">Messages farmers send to the programme's WhatsApp or SMS number. <code>PRACTICE mulching 2026-06-01</code> reports a practice — it is only recorded after staff review.
        <code>HELP …</code> opens a grievance straight away.</p>
      <span class="spacer"></span>
      @if (canLog) { <button class="btn btn-secondary" (click)="openLog()"><vc-icon name="inbox" />Log a received message</button> }
    </div>
    <div class="seg">
      @for (s of filters; track s.key) {
        <button type="button" [class.on]="status() === s.key" (click)="status.set(s.key)">{{ s.label }}<span class="c num">{{ count(s.key) }}</span></button>
      }
    </div>

    @if (loading() && !all().length) { <div class="card"><vc-loading [rows]="5" /></div> }
    @else if (error()) { <vc-error title="Couldn't load inbound messages" [message]="error()!" /> }
    @else if (!rows().length) {
      <div class="card"><vc-empty icon="inbox" [title]="status() === 'pending_review' ? 'Nothing waiting for review' : 'No messages'"
        [text]="status() === 'pending_review' ? 'Practice reports sent by farmers appear here until someone checks and accepts them.' : 'Try another filter.'" /></div>
    } @else {
      <div class="list">
        @for (m of rows(); track m.id) {
          <article class="card msg" [class.pending]="m.status === 'pending_review'">
            <header>
              <span class="av"><vc-icon [name]="m.command === 'HELP' ? 'help' : m.command === 'PRACTICE' ? 'sprout' : 'message'" [size]="16" /></span>
              <div class="who"><strong>{{ m.farmer_id ? farmers.name(m.farmer_id) : 'Unregistered number' }}</strong>
                <span class="small subtle"><span class="mono">{{ m.phone }}</span> · {{ m.channel === 'whatsapp' ? 'WhatsApp' : 'SMS' }} · <span [title]="m.created_at | day: true">{{ m.created_at | ago }}</span></span></div>
              <vc-badge [status]="tone(m.status)">{{ label(m.status) }}</vc-badge>
            </header>
            <p class="text mono">{{ m.text }}</p>
            @if (m.error) { <p class="small err"><vc-icon name="alert" [size]="13" />{{ m.error }}</p> }

            @if (m.command === 'PRACTICE' && !m.error) {
              <dl class="parsed">
                <div><dt>Practice</dt><dd>{{ cat.name(m.parsed.practice_code ?? '') }}
                  @if (m.parsed.known_practice === false) { <span class="warnb">Not in catalogue</span> }</dd></div>
                <div><dt>Done on</dt><dd>{{ m.parsed.performed_on | day }}</dd></div>
                <div><dt>Quantity</dt><dd class="num">{{ m.parsed.quantity ?? '—' }}</dd></div>
              </dl>
            }

            @if (m.status === 'pending_review' && canReview) {
              <div class="review">
                <div class="field"><label>Field</label>
                  <select class="input" [ngModel]="pick()[m.id]?.field ?? m.parsed.suggested_field_id ?? ''" (ngModelChange)="setPick(m.id, 'field', $event)" (focus)="loadFields(m)">
                    <option value="">Choose the farmer's field…</option>
                    @for (f of fieldsOf(m); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }} · {{ f.area_ha.toFixed(2) }} ha</option> }
                  </select></div>
                <div class="field qf"><label>Quantity</label><input class="input num" type="number" min="0" step="any" [ngModel]="pick()[m.id]?.qty ?? m.parsed.quantity ?? null" (ngModelChange)="setPick(m.id, 'qty', $event)" /></div>
                <div class="field nf"><label>Note</label><input class="input" [ngModel]="pick()[m.id]?.note ?? ''" (ngModelChange)="setPick(m.id, 'note', $event)" placeholder="Required when rejecting" /></div>
                <div class="ra">
                  <button class="btn btn-secondary" [disabled]="busy() === m.id || !(pick()[m.id]?.note ?? '').trim()" (click)="review(m, 'reject')" title="Say why in the note">Reject</button>
                  <button class="btn btn-primary" [disabled]="busy() === m.id || !(pick()[m.id]?.field ?? m.parsed.suggested_field_id)" (click)="review(m, 'accept')"><vc-icon name="check" [size]="14" />Accept and record</button>
                </div>
              </div>
            }
            @if (m.status === 'processed' && m.grievance_id) {
              <a routerLink="/app/grievances" class="glink"><vc-icon name="message" [size]="14" />Grievance opened from this message — open grievances<vc-icon name="arrow-right" [size]="14" /></a>
            }
            @if (m.status === 'accepted') { <p class="small ok"><vc-icon name="check-circle" [size]="13" />Recorded as a practice (source: WhatsApp).@if (m.review_note) { “{{ m.review_note }}” }</p> }
            @if (m.status === 'rejected' && m.review_note) { <p class="small muted">Rejected: {{ m.review_note }}</p> }
          </article>
        }
      </div>
    }

    <vc-modal [(open)]="logOpen" title="Log a received message" subtitle="For messages received outside the connected number, e.g. forwarded by a field officer." width="480px">
      <div class="stack">
        <div class="field"><label for="lp">Phone number</label><input id="lp" class="input mono" [(ngModel)]="lf.phone" placeholder="+91 98xxxxxxxx" /></div>
        <div class="field"><label for="lc">Channel</label><select id="lc" class="input" [(ngModel)]="lf.channel"><option value="whatsapp">WhatsApp</option><option value="sms">SMS</option></select></div>
        <div class="field"><label for="lt">Message exactly as received</label><textarea id="lt" class="input mono" rows="3" [(ngModel)]="lf.text" placeholder="PRACTICE mulching 2026-06-01 2"></textarea>
          <span class="hint">PRACTICE &lt;code&gt; &lt;date&gt; [quantity] or HELP &lt;question&gt;.</span></div>
        @if (logError()) { <vc-error title="Not logged" [message]="logError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="logOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!busy() || lf.phone.trim().length < 5 || !lf.text.trim()" (click)="log()">Log message</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:10px;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap} .bar p{max-width:760px}
    .bar code{font-size:12px;background:var(--sand-200);padding:1px 5px;border-radius:4px}
    .seg{display:inline-flex;flex-wrap:wrap;background:var(--surface);border:1px solid var(--border-strong);border-radius:8px;padding:3px;gap:2px;margin-bottom:14px}
    .seg button{border:0;background:none;font:500 13px var(--font);padding:6px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer;display:inline-flex;gap:6px;align-items:center}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{font-size:11px;color:var(--text-3)}
    .list{display:flex;flex-direction:column;gap:12px}
    .msg{padding:16px 18px;display:flex;flex-direction:column;gap:10px}
    .msg.pending{border-left:3px solid var(--amber-600)}
    header{display:flex;align-items:center;gap:12px}
    .av{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--forest-50);color:var(--forest-600);flex:none}
    .who{flex:1;display:flex;flex-direction:column;line-height:1.35}
    .text{padding:10px 12px;border-radius:10px 10px 10px 3px;background:var(--sand-100);font-size:13px;color:var(--stone-800);max-width:620px}
    .err{display:flex;gap:6px;align-items:center;color:var(--red-600)}
    .parsed{display:flex;gap:28px;margin:0;flex-wrap:wrap} .parsed dt{font-size:12px;color:var(--text-2)} .parsed dd{margin:0;font-weight:500}
    .warnb{margin-left:6px;font-size:11.5px;padding:1px 6px;border-radius:4px;background:var(--amber-100);color:var(--amber-600);font-weight:500}
    .review{display:grid;grid-template-columns:minmax(0,1.4fr) 110px minmax(0,1fr) auto;gap:10px;align-items:end;padding-top:12px;border-top:1px solid var(--border)}
    @media (max-width:980px){.review{grid-template-columns:1fr 1fr}}
    .ra{display:flex;gap:8px}
    .glink{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500}
    .ok{display:flex;gap:6px;align-items:center;color:var(--forest-700)}
  `],
})
export class InboundTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  farmers = inject(FarmerDirectory);
  cat = inject(PracticeCatalogue);
  private auth = inject(AuthService);
  canReview = this.auth.can('practice.record');
  canLog = this.auth.can('farmers.manage', 'grievance.handle');
  filters = [
    { key: 'pending_review', label: 'Waiting for review' }, { key: 'processed', label: 'Help requests' },
    { key: 'accepted', label: 'Accepted' }, { key: 'rejected', label: 'Rejected' },
    { key: 'problem', label: 'Not understood' }, { key: '', label: 'All' },
  ];

  all = signal<Inbound[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  status = signal('pending_review');
  busy = signal<string | null>(null);
  pick = signal<Record<string, { field?: string; qty?: number | null; note?: string }>>({});
  private fieldCache = signal<Record<string, FieldOpt[]>>({});
  rows = computed(() => this.all().filter(m => this.match(m, this.status())));

  logOpen = signal(false);
  logError = signal<string | null>(null);
  lf = { phone: '', channel: 'whatsapp', text: '' };

  constructor() { this.farmers.load(); this.cat.load(); this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<Inbound[]>('/notifications/inbound').subscribe({
      next: r => {
        this.all.set(r);
        this.loading.set(false);
        this.error.set(null);
        for (const m of r) if (m.status === 'pending_review') this.loadFields(m);
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  private match(m: Inbound, k: string) { return !k || (k === 'problem' ? ['unrecognised', 'unmatched'].includes(m.status) : m.status === k); }
  count(k: string) { return this.all().filter(m => this.match(m, k)).length; }
  label(s: string) { return STATUS_LABEL[s] ?? s; }
  tone(s: string) { return s === 'pending_review' ? 'pending' : s === 'accepted' ? 'accepted' : s === 'processed' ? 'info' : s === 'rejected' ? 'rejected' : 'warning'; }
  setPick(id: string, k: 'field' | 'qty' | 'note', v: unknown) { this.pick.update(p => ({ ...p, [id]: { ...p[id], [k]: v } })); }
  fieldsOf(m: Inbound) { return m.farmer_id ? this.fieldCache()[m.farmer_id] ?? [] : []; }
  loadFields(m: Inbound) {
    const fid = m.farmer_id;
    if (!fid || this.fieldCache()[fid]) return;
    this.fieldCache.update(c => ({ ...c, [fid]: [] }));
    this.api.get<{ items: FieldOpt[] }>('/fields', { farmer_id: fid, limit: 100 }).subscribe({
      next: r => this.fieldCache.update(c => ({ ...c, [fid]: r.items })), error: () => {},
    });
  }

  review(m: Inbound, decision: 'accept' | 'reject') {
    const p = this.pick()[m.id] ?? {};
    this.busy.set(m.id);
    this.api.post<Inbound>(`/notifications/inbound/${m.id}/review`, {
      decision, field_id: p.field ?? m.parsed.suggested_field_id ?? null,
      quantity: p.qty === undefined || p.qty === null || (p.qty as unknown) === '' ? null : Number(p.qty), note: (p.note ?? '').trim(),
    }).subscribe({
      next: r => {
        this.busy.set(null);
        this.all.update(xs => xs.map(x => (x.id === r.id ? r : x)));
        this.toast.success(decision === 'accept' ? 'Practice recorded' : 'Report rejected', decision === 'accept' ? `${this.cat.name(m.parsed.practice_code ?? '')} on ${m.parsed.performed_on}` : undefined);
      },
      error: (e: ApiError) => { this.busy.set(null); this.toast.error('Not reviewed', apiMessage(e)); },
    });
  }

  openLog() { this.lf = { phone: '', channel: 'whatsapp', text: '' }; this.logError.set(null); this.logOpen.set(true); }
  log() {
    this.busy.set('log');
    this.api.post<Inbound>('/notifications/inbound', { phone: this.lf.phone.trim(), channel: this.lf.channel, text: this.lf.text.trim() }).subscribe({
      next: r => {
        this.busy.set(null);
        this.logOpen.set(false);
        this.all.update(xs => [r, ...xs]);
        this.status.set(r.status === 'pending_review' ? 'pending_review' : '');
        if (r.status === 'pending_review') this.loadFields(r);
        this.toast.success('Message logged', this.label(r.status));
      },
      error: (e: ApiError) => { this.busy.set(null); this.logError.set(apiMessage(e)); },
    });
  }
}
