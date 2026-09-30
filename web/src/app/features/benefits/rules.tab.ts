import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, InrPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { apiMessage, money } from '../credits/credit-ui';
import { BenefitRule, PeopleDirectory, WEIGHT_COLOR, WEIGHT_KEYS, WEIGHT_LABEL } from './benefit-types';

interface Programme { id: string; code: string; name: string }
interface Draft {
  id: string | null;
  programme_id: string;
  farmer_share_pct: number;
  weights: Record<string, number>; // percentages
  deductions: { name: string; pct: number }[];
  min_payout: number;
  notes: string;
}

const EXAMPLE_SALE = 100000;

@Component({
  selector: 'vcx-rules-tab',
  imports: [FormsModule, ...KIT, DayPipe, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">How sale revenue is shared with farmers. Each programme has one approved version at a time; approved versions are frozen and every payout records the version it used.</p>
      <span class="spacer"></span>
      @if (canPrepare) { <button class="btn btn-primary" (click)="newRule()"><vc-icon name="plus" />New rule</button> }
    </div>

    @if (loading()) { <div class="card"><vc-loading [rows]="5" /></div> }
    @else if (error()) { <vc-error title="Couldn't load benefit rules" [message]="error()!" /> }
    @else if (!rules().length) {
      <div class="card"><vc-empty icon="scale" title="No benefit rules yet"
        text="Set the farmer share, how it is split between farmers, and any deductions. A second person must approve it before money can be shared.">
        @if (canPrepare) { <button class="btn btn-primary" (click)="newRule()"><vc-icon name="plus" />New rule</button> }
      </vc-empty></div>
    } @else {
      @for (g of groups(); track g.programme.id) {
        <section class="prog">
          <h3>{{ g.programme.code }} · {{ g.programme.name }}</h3>
          <div class="rules">
            @for (r of g.rules; track r.id) {
              <article class="card rule" [class.current]="r.status === 'approved'" [class.old]="r.status === 'retired'">
                <header>
                  <div><strong>Version {{ r.version }}</strong>
                    @if (r.status === 'approved') { <span class="cur small">In use</span> }</div>
                  <vc-badge [status]="r.status" />
                </header>
                <div class="share"><span class="big num">{{ pct(r.farmer_share_pct) }}%</span><span class="muted small">of revenue after deductions goes to farmers</span></div>
                <div class="wbar" [attr.aria-label]="weightText(r)">
                  @for (k of wkeys; track k) { @if (r.weights[k]) { <span [style.flex-grow]="r.weights[k]" [style.background]="wcolor[k]"></span> } }
                </div>
                <div class="wl small">
                  @for (k of wkeys; track k) { @if (r.weights[k]) { <span><i [style.background]="wcolor[k]"></i>{{ wlabel[k] }} {{ (r.weights[k] * 100).toFixed(0) }}%</span> } }
                </div>
                <dl class="kv small">
                  <dt>Deductions</dt>
                  <dd>@for (d of r.deductions; track $index) { <div>{{ d.name }} · {{ d.pct }}%</div> } @empty { None }</dd>
                  <dt>Minimum payout</dt><dd>{{ r.min_payout | inr }}</dd>
                  <dt>Prepared by</dt><dd>{{ people.name(r.created_by) }} · {{ r.created_at | day }}</dd>
                  @if (r.approved_by) { <dt>Approved by</dt><dd>{{ people.name(r.approved_by) }} · {{ r.approved_at | day }}</dd> }
                </dl>
                @if (r.notes) { <p class="notes small">{{ r.notes }}</p> }
                <footer>
                  @if (r.status === 'draft' && canPrepare) { <button class="btn btn-secondary btn-sm" (click)="edit(r)"><vc-icon name="pencil" [size]="14" />Edit draft</button> }
                  @if (r.status !== 'draft' && canPrepare) { <button class="btn btn-ghost btn-sm" (click)="copy(r)"><vc-icon name="copy" [size]="14" />New version from this</button> }
                  <span class="spacer"></span>
                  @if (r.status === 'draft' && canApprove) {
                    @if (mine(r)) {
                      <span class="self small" title="Four-eyes rule">You prepared this — a colleague must approve it</span>
                    } @else {
                      <button class="btn btn-primary btn-sm" (click)="approveTarget.set(r)"><vc-icon name="check" [size]="14" />Approve</button>
                    }
                  }
                </footer>
              </article>
            }
          </div>
        </section>
      }
    }

    <!-- editor -->
    <vc-modal [open]="!!draft()" (closed)="draft.set(null)" [drawer]="true" width="560px"
      [title]="draft()?.id ? 'Edit draft rule' : 'New benefit rule'" subtitle="Saved as a draft. It takes effect only after a finance approver signs it off.">
      @if (draft(); as d) {
        <div class="stack">
          <div class="field"><label>Programme</label>
            <select class="input" [(ngModel)]="d.programme_id" [disabled]="!!d.id">
              @for (p of programmes(); track p.id) { <option [value]="p.id">{{ p.code }} · {{ p.name }}</option> }
            </select></div>

          <div class="field">
            <label>Farmer share of revenue after deductions</label>
            <div class="slide">
              <input type="range" min="0" max="100" step="1" [ngModel]="d.farmer_share_pct" (ngModelChange)="set('farmer_share_pct', $event)" />
              <div class="pin"><input class="input num" type="number" min="0" max="100" step="0.5" [ngModel]="d.farmer_share_pct" (ngModelChange)="set('farmer_share_pct', $event)" /><span>%</span></div>
            </div>
          </div>

          <div class="field">
            <div class="row"><label>How the farmer pool is split</label><span class="spacer"></span>
              <span class="sum small" [class.bad]="weightSum() !== 100">{{ weightSum() }}% of 100%</span></div>
            @for (k of wkeys; track k) {
              <div class="wrow">
                <span class="wk"><i [style.background]="wcolor[k]"></i>{{ wlabel[k] }}</span>
                <input type="range" min="0" max="100" step="5" [ngModel]="d.weights[k]" (ngModelChange)="setWeight(k, $event)" />
                <div class="pin"><input class="input num" type="number" min="0" max="100" [ngModel]="d.weights[k]" (ngModelChange)="setWeight(k, $event)" /><span>%</span></div>
              </div>
            }
            @if (weightSum() !== 100) {
              <span class="error">Weights must add up to 100%. <button type="button" class="link" (click)="balance()">Balance automatically</button></span>
            } @else {
              <span class="hint">Each farmer's share = weighted mix of their enrolled area, recorded practices and credit contribution, relative to all farmers.</span>
            }
          </div>

          <div class="field">
            <div class="row"><label>Deductions from gross revenue</label><span class="spacer"></span>
              <button type="button" class="btn btn-ghost btn-sm" (click)="addDeduction()"><vc-icon name="plus" [size]="14" />Add</button></div>
            @for (x of d.deductions; track $index; let i = $index) {
              <div class="drow">
                <input class="input" [(ngModel)]="x.name" placeholder="e.g. Verification & registry fees" (ngModelChange)="touch()" />
                <div class="pin"><input class="input num" type="number" min="0" max="100" step="0.5" [(ngModel)]="x.pct" (ngModelChange)="touch()" /><span>%</span></div>
                <button type="button" class="btn btn-ghost btn-icon btn-sm" (click)="removeDeduction(i)" aria-label="Remove"><vc-icon name="trash" [size]="14" /></button>
              </div>
            } @empty { <span class="hint">No deductions — the whole sale value is shared by the farmer share above.</span> }
            @if (dedSum() > 100) { <span class="error">Deductions can't add up to more than 100%.</span> }
          </div>

          <div class="form-grid">
            <div class="field"><label>Minimum payout (INR)</label>
              <input class="input num" type="number" min="0" step="1" [(ngModel)]="d.min_payout" (ngModelChange)="touch()" />
              <span class="hint">Smaller amounts are carried forward, not paid.</span></div>
          </div>
          <div class="field"><label>Notes</label><textarea class="input" [(ngModel)]="d.notes" placeholder="Why this version — e.g. agreed with FPO board on 12 Aug"></textarea></div>

          <div class="example">
            <div class="eh small">Example: a sale worth {{ example | inr }}</div>
            <div class="erow"><span>Deductions</span><span class="num">− {{ m(ex().ded) }}</span></div>
            <div class="erow"><span>Net revenue</span><span class="num">{{ m(ex().net) }}</span></div>
            <div class="erow tot"><span>Farmer pool ({{ d.farmer_share_pct }}%)</span><span class="num">{{ m(ex().pool) }}</span></div>
          </div>
          @if (formError()) { <vc-error title="Couldn't save" [message]="formError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="draft.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()">Save draft</button>
      </ng-container>
    </vc-modal>

    <!-- approve -->
    <vc-modal [open]="!!approveTarget()" (closed)="approveTarget.set(null)" title="Approve benefit rule" width="520px"
      [subtitle]="approveTarget() ? progName(approveTarget()!.programme_id) + ' · version ' + approveTarget()!.version : ''">
      @if (approveTarget(); as r) {
        <div class="stack">
          <p>Prepared by <strong>{{ people.name(r.created_by) }}</strong> on {{ r.created_at | day }}. Once approved, this version is frozen and
            replaces the current approved version for new benefit pools.</p>
          <vc-callout tone="info" icon="shield">Four-eyes rule: nobody can approve a rule they created or edited.</vc-callout>
          @if (approveError()) { <vc-error title="Not approved" [message]="approveError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="approveTarget.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="approve()">Approve version</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;align-items:flex-start;gap:16px;margin-bottom:18px} .bar p{max-width:720px} .spacer{flex:1}
    .prog{margin-bottom:24px} .prog h3{margin-bottom:12px}
    .rules{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
    .rule{padding:16px 18px 0;display:flex;flex-direction:column;gap:12px}
    .rule.current{border-color:var(--forest-300);box-shadow:0 0 0 3px var(--forest-50)}
    .rule.old{opacity:.8}
    .rule header{display:flex;justify-content:space-between;align-items:center}
    .cur{margin-left:8px;color:var(--forest-600);font-weight:600}
    .share{display:flex;align-items:baseline;gap:10px} .big{font-size:28px;font-weight:600;letter-spacing:-.02em}
    .wbar{display:flex;gap:2px;height:8px;border-radius:4px;overflow:hidden;background:var(--sand-200)} .wbar span{flex-basis:0}
    .wl{display:flex;flex-wrap:wrap;gap:4px 12px;color:var(--text-2)} .wl i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px}
    .rule .kv{grid-template-columns:112px 1fr}
    .notes{color:var(--text-2);padding:8px 10px;background:var(--surface-2);border-radius:6px}
    .rule footer{display:flex;align-items:center;gap:6px;margin:auto -18px 0;padding:10px 12px;border-top:1px solid var(--border);background:var(--surface-2);border-radius:0 0 var(--radius) var(--radius)}
    .self{color:var(--amber-600)}
    .slide,.wrow{display:flex;align-items:center;gap:12px}
    .slide input[type=range],.wrow input[type=range]{flex:1;accent-color:var(--primary)}
    .wk{width:150px;display:flex;align-items:center;gap:6px;font-size:13px} .wk i{width:8px;height:8px;border-radius:2px}
    .pin{display:flex;align-items:center;gap:4px;width:92px} .pin .input{text-align:right;padding:0 8px} .pin span{color:var(--text-3)}
    .sum{font-weight:600;color:var(--forest-600)} .sum.bad{color:var(--red-600)}
    .drow{display:flex;gap:8px;align-items:center}
    .link{border:0;background:none;padding:0;color:var(--primary);font:inherit;text-decoration:underline;cursor:pointer}
    .example{border:1px dashed var(--border-strong);border-radius:10px;padding:12px 14px;background:var(--surface-2)}
    .eh{color:var(--text-2);margin-bottom:6px}
    .erow{display:flex;justify-content:space-between;font-size:13px;padding:3px 0}
    .erow.tot{border-top:1px solid var(--border);margin-top:4px;padding-top:6px;font-weight:600;color:var(--forest-700)}
  `],
})
export class RulesTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  people = inject(PeopleDirectory);
  canPrepare = this.auth.can('payout.prepare');
  canApprove = this.auth.can('payout.approve');

  wkeys = WEIGHT_KEYS;
  wlabel = WEIGHT_LABEL;
  wcolor = WEIGHT_COLOR;
  example = EXAMPLE_SALE;

  rules = signal<BenefitRule[]>([]);
  programmes = signal<Programme[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);
  draft = signal<Draft | null>(null);
  rev = signal(0); // bump to recompute derived values while editing the draft object
  formError = signal<string | null>(null);
  approveTarget = signal<BenefitRule | null>(null);
  approveError = signal<string | null>(null);

  groups = computed(() => {
    const byProg = new Map<string, BenefitRule[]>();
    for (const r of this.rules()) byProg.set(r.programme_id, [...(byProg.get(r.programme_id) ?? []), r]);
    return [...byProg.entries()].map(([pid, rules]) => ({
      programme: this.programmes().find(p => p.id === pid) ?? { id: pid, code: 'Programme', name: pid.slice(0, 8) },
      rules: rules.sort((a, b) => b.version - a.version),
    }));
  });

  weightSum = computed(() => { this.rev(); const d = this.draft(); return d ? Math.round(WEIGHT_KEYS.reduce((a, k) => a + (Number(d.weights[k]) || 0), 0) * 100) / 100 : 0; });
  dedSum = computed(() => { this.rev(); return (this.draft()?.deductions ?? []).reduce((a, x) => a + (Number(x.pct) || 0), 0); });
  ex = computed(() => {
    this.rev();
    const d = this.draft();
    const ded = Math.round(EXAMPLE_SALE * this.dedSum()) / 100;
    const net = EXAMPLE_SALE - ded;
    return { ded, net, pool: Math.round(net * (Number(d?.farmer_share_pct) || 0)) / 100 };
  });
  valid = computed(() => {
    this.rev();
    const d = this.draft();
    return !!d && !!d.programme_id && this.weightSum() === 100 && this.dedSum() <= 100 &&
      d.deductions.every(x => x.name.trim().length >= 2) && d.farmer_share_pct >= 0 && d.farmer_share_pct <= 100;
  });

  constructor() {
    this.people.load();
    this.load();
    this.api.get<Programme[]>('/programmes').subscribe({ next: p => this.programmes.set(p), error: () => {} });
  }

  load() {
    this.loading.set(true);
    this.api.get<BenefitRule[]>('/benefit-rules').subscribe({
      next: r => { this.rules.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  pct(v: string) { return Number(v).toFixed(Number(v) % 1 ? 1 : 0); }
  m(v: number) { return money(v); }
  mine(r: BenefitRule) { return r.created_by === this.auth.profile()?.id; }
  progName(id: string) { const p = this.programmes().find(x => x.id === id); return p ? p.code : ''; }
  weightText(r: BenefitRule) { return WEIGHT_KEYS.filter(k => r.weights[k]).map(k => `${WEIGHT_LABEL[k]} ${(r.weights[k] * 100).toFixed(0)}%`).join(', '); }

  touch() { this.rev.update(v => v + 1); }

  newRule() {
    this.formError.set(null);
    this.draft.set({ id: null, programme_id: this.programmes()[0]?.id ?? '', farmer_share_pct: 60,
      weights: { area: 50, practices: 50, credits: 0 }, deductions: [{ name: 'Verification & registry fees', pct: 8 }],
      min_payout: 100, notes: '' });
  }
  edit(r: BenefitRule) { this.formError.set(null); this.draft.set({ ...this.fromRule(r), id: r.id }); }
  copy(r: BenefitRule) { this.formError.set(null); this.draft.set({ ...this.fromRule(r), id: null, notes: '' }); }

  private fromRule(r: BenefitRule): Draft {
    return {
      id: r.id, programme_id: r.programme_id, farmer_share_pct: Number(r.farmer_share_pct),
      weights: Object.fromEntries(WEIGHT_KEYS.map(k => [k, Math.round((r.weights[k] ?? 0) * 100)])),
      deductions: r.deductions.map(d => ({ name: d.name, pct: Number(d.pct) })), min_payout: Number(r.min_payout ?? 0), notes: r.notes ?? '',
    };
  }

  set(k: 'farmer_share_pct', v: number) { const d = this.draft(); if (d) { d[k] = Math.max(0, Math.min(100, Number(v) || 0)); this.touch(); } }
  setWeight(k: string, v: number) { const d = this.draft(); if (d) { d.weights[k] = Math.max(0, Math.min(100, Number(v) || 0)); this.touch(); } }
  balance() {
    const d = this.draft();
    if (!d) return;
    const sum = WEIGHT_KEYS.reduce((a, k) => a + d.weights[k], 0);
    if (sum <= 0) { d.weights = { area: 50, practices: 50, credits: 0 }; this.touch(); return; }
    const scaled = WEIGHT_KEYS.map(k => Math.floor((d.weights[k] / sum) * 100));
    const diff = 100 - scaled.reduce((a, v) => a + v, 0);
    const iMax = scaled.indexOf(Math.max(...scaled));
    scaled[iMax] += diff;
    WEIGHT_KEYS.forEach((k, i) => (d.weights[k] = scaled[i]));
    this.touch();
  }
  addDeduction() { this.draft()?.deductions.push({ name: '', pct: 0 }); this.touch(); }
  removeDeduction(i: number) { this.draft()?.deductions.splice(i, 1); this.touch(); }

  save() {
    const d = this.draft();
    if (!d) return;
    const weights: Record<string, number> = {};
    for (const k of WEIGHT_KEYS) if (d.weights[k] > 0) weights[k] = Math.round(d.weights[k] * 100) / 10000;
    const body = {
      farmer_share_pct: Number(d.farmer_share_pct).toFixed(2), weights,
      deductions: d.deductions.map(x => ({ name: x.name.trim(), pct: Number(x.pct).toFixed(2) })),
      min_payout: Number(d.min_payout || 0).toFixed(2), notes: d.notes.trim(),
    };
    this.busy.set(true);
    this.formError.set(null);
    const req = d.id ? this.api.patch<BenefitRule>(`/benefit-rules/${d.id}`, body)
      : this.api.post<BenefitRule>('/benefit-rules', { ...body, programme_id: d.programme_id });
    req.subscribe({
      next: r => {
        this.busy.set(false);
        this.draft.set(null);
        this.toast.success(`Version ${r.version} saved as draft`, 'Ask a finance approver to review it.');
        this.load();
      },
      error: e => { this.busy.set(false); this.formError.set(apiMessage(e)); },
    });
  }

  approve() {
    const r = this.approveTarget();
    if (!r) return;
    this.busy.set(true);
    this.approveError.set(null);
    this.api.post<BenefitRule>(`/benefit-rules/${r.id}/approve`).subscribe({
      next: nr => { this.busy.set(false); this.approveTarget.set(null); this.toast.success(`Version ${nr.version} approved`, 'New benefit pools will use it.'); this.load(); },
      error: (e: ApiError) => {
        this.busy.set(false);
        this.approveError.set(e.code === 'SELF_APPROVAL_REJECTED' ? `${e.message} This keeps every payout rule checked by two people.` : e.message);
      },
    });
  }
}
