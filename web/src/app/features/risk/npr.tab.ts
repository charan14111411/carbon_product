import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { PeopleDirectory } from '../benefits/benefit-types';
import { apiMessage } from '../credits/credit-ui';
import { selfApprovalMessage } from '../households/lookups';
import { Remote } from '../supporting/shared';

export interface Hazard { hazard: string; likelihood: string; significance: string; score: number | null; mitigation: number | null }
export interface NprInputs { internal: Record<string, number | null>; external: Record<string, number | null>; natural: Hazard[] }
export interface RiskProfile {
  id: string; project_id: string; version: number; tool_version: string; inputs: NprInputs;
  computed: { internal: { total: number }; external: { total: number }; natural: { total: number; hazards: (Hazard & { weighted: number })[] };
    overall_score: number; advisory_rating_pct: number; minimum_rating_pct: number; fail_above: number; fails: boolean; note: string };
  computed_rating_pct: number; final_npr_pct: number | null; justification: string; status: 'draft' | 'submitted' | 'approved' | 'superseded';
  submitted_by: string | null; approved_by: string | null; approved_at: string | null; notes: string; created_by: string | null; created_at: string;
}
export interface Permanence {
  npr: { approved_pct: number | null; version: number | null; pending_review: number; message: string | null };
  obligations: { by_status: Record<string, number>; next: { title: string; due_on: string; status: string } | null };
  risk_events: { open: number; total: number }; remediation: { open: number; overdue: number };
}

const INTERNAL = [
  { k: 'project_management', label: 'Project management', hint: 'Track record, management team, monitoring capacity' },
  { k: 'financial_viability', label: 'Financial viability', hint: 'Funding secured and break-even point' },
  { k: 'opportunity_cost', label: 'Opportunity cost', hint: 'Net present value of alternative land uses (can be negative)' },
  { k: 'project_longevity', label: 'Project longevity', hint: 'Legal protection and project life' },
];
const EXTERNAL = [
  { k: 'land_tenure', label: 'Land and resource tenure', hint: 'Ownership, access rights, disputes' },
  { k: 'community_engagement', label: 'Community engagement', hint: 'Consultation and benefit sharing with farmers' },
  { k: 'political', label: 'Political risk', hint: 'Governance scores for the host country' },
];
export const MIN_RATING = 10;
export const FAIL_ABOVE = 60;

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Mirrors api/app/modules/risk/npr.py so the analyst sees the result while typing. The server recalculates. */
export function preview(i: NprInputs) {
  const sum = (o: Record<string, number | null>, keys: string[]) => keys.reduce((a, k) => a + (num(o[k]) ?? 0), 0);
  const it = Math.max(0, sum(i.internal, INTERNAL.map(x => x.k)));
  const et = Math.max(0, sum(i.external, EXTERNAL.map(x => x.k)));
  const nt = Math.max(0, i.natural.reduce((a, h) => a + (num(h.score) ?? 0) * (num(h.mitigation) ?? 1), 0));
  const overall = it + et + nt;
  const missing = [...INTERNAL, ...EXTERNAL].filter(x => num((x.k in i.internal ? i.internal : i.external)[x.k]) === null).length +
    i.natural.filter(h => !h.hazard.trim() || !h.likelihood || !h.significance || num(h.score) === null).length + (i.natural.length ? 0 : 1);
  return { it, et, nt, overall, rating: Math.max(MIN_RATING, overall), fails: overall > FAIL_ABOVE, missing };
}

@Component({
  selector: 'vcx-npr-tab',
  imports: [...KIT, FormsModule, DayPipe, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-callout tone="info" icon="book" class="tool">
      <strong>Structured worksheet following the VCS AFOLU Non-Permanence Risk Tool (v4.0).</strong>
      Enter each factor's score exactly as read from the tool's tables — nothing is defaulted. The worksheet adds them the way the tool does
      (category totals never below zero; overall below {{ min }} is raised to {{ min }}; above {{ fail }} fails). The result is advisory: a methodology
      owner who did not prepare the worksheet sets and approves the final NPR, which becomes the buffer contribution.
    </vc-callout>

    <div class="top">
      <section class="card hero">
        <span class="l">Approved non-permanence risk rating</span>
        @if (approved(); as a) {
          <strong class="num">{{ a.final_npr_pct | num: 1 }}<small>%</small></strong>
          <span class="s">Version {{ a.version }} · approved {{ a.approved_at | day }} by {{ people.name(a.approved_by) }}</span>
        } @else {
          <strong class="none">Not set</strong><span class="s">No approved rating yet. Credits can't be buffered correctly without one.</span>
        }
      </section>
      @if (perm(); as p) {
        <section class="card mini"><span class="l">Waiting for approval</span><strong class="num">{{ p.npr.pending_review }}</strong><span class="s">worksheet{{ p.npr.pending_review === 1 ? '' : 's' }} submitted</span></section>
        <section class="card mini"><span class="l">Open remediation</span><strong class="num">{{ p.remediation.open }}</strong><span class="s">{{ p.remediation.overdue }} overdue</span></section>
      }
      <span class="spacer"></span>
      @if (canManage) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New worksheet</button> }
    </div>

    <section class="card">
      <div class="card-head"><h3>Worksheet versions</h3></div>
      @if (profiles.loading() && !profiles.data()) { <vc-loading [rows]="4" /> }
      @else if (profiles.error()) { <div class="card-body"><vc-error title="Couldn't load risk profiles" [message]="profiles.error()!.message" /></div> }
      @else if (!(profiles.data() ?? []).length) {
        <vc-empty icon="scale" title="No risk worksheet yet" text="Complete the internal, external and natural risk sections from the tool, then submit it for approval.">
          @if (canManage) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New worksheet</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Version</th><th class="num">Internal</th><th class="num">External</th><th class="num">Natural</th><th class="num">Worksheet rating</th><th class="num">Final NPR</th><th>Status</th><th>Prepared by</th><th></th></tr></thead>
            <tbody>
              @for (p of profiles.data(); track p.id) {
                <tr class="clickable" (click)="openProfile(p)">
                  <td class="mono">v{{ p.version }}</td>
                  <td class="num">{{ p.computed.internal.total | num: 1 }}</td>
                  <td class="num">{{ p.computed.external.total | num: 1 }}</td>
                  <td class="num">{{ p.computed.natural.total | num: 1 }}</td>
                  <td class="num"><strong>{{ p.computed_rating_pct | num: 1 }}%</strong> <vc-dc cls="CALCULATED" />@if (p.computed.fails) { <vc-badge status="failed" style="margin-left:4px">Fails</vc-badge> }</td>
                  <td class="num">@if (p.final_npr_pct !== null) { <strong>{{ p.final_npr_pct | num: 1 }}%</strong> } @else { <span class="subtle">—</span> }</td>
                  <td><vc-badge [status]="p.status" /></td>
                  <td>{{ people.name(p.created_by) }} <span class="subtle small">· {{ p.created_at | day }}</span></td>
                  <td class="num"><vc-icon name="chevron-right" class="subtle" /></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- worksheet -->
    <vc-modal [(open)]="open" [drawer]="true" width="min(820px, 100vw)" [title]="sel() ? 'NPR worksheet v' + sel()!.version : 'New NPR worksheet'"
      [subtitle]="sel() ? statusLine(sel()!) : 'Draft — you can save and come back to it.'">
      <div class="ws">
        <div class="sheet">
          <fieldset [disabled]="!editable()">
            <section class="sec">
              <div class="sh"><h3>Internal risk</h3><span class="tot num">{{ pv().it | num: 1 }}</span></div>
              @for (x of internal; track x.k) {
                <div class="fr"><div class="fl"><label [for]="'i-' + x.k">{{ x.label }}</label><span class="small subtle">{{ x.hint }}</span></div>
                  <input [id]="'i-' + x.k" type="number" step="any" class="input num sc" [(ngModel)]="w.internal[x.k]" (ngModelChange)="touch()" placeholder="Score" /></div>
              }
            </section>
            <section class="sec">
              <div class="sh"><h3>External risk</h3><span class="tot num">{{ pv().et | num: 1 }}</span></div>
              @for (x of external; track x.k) {
                <div class="fr"><div class="fl"><label [for]="'e-' + x.k">{{ x.label }}</label><span class="small subtle">{{ x.hint }}</span></div>
                  <input [id]="'e-' + x.k" type="number" step="any" class="input num sc" [(ngModel)]="w.external[x.k]" (ngModelChange)="touch()" placeholder="Score" /></div>
              }
            </section>
            <section class="sec">
              <div class="sh"><h3>Natural risk</h3><span class="tot num">{{ pv().nt | num: 1 }}</span></div>
              <p class="small subtle">One row per hazard (drought, flood, fire, pests…). Score is the tool's value for the likelihood and significance; mitigation is a multiplier from 0 to 1 (1 = no mitigation).</p>
              <div class="hz hh small"><span>Hazard</span><span>Likelihood</span><span>Significance</span><span>Score</span><span>Mitigation</span><span></span></div>
              @for (h of w.natural; track $index; let i = $index) {
                <div class="hz">
                  <input class="input" [(ngModel)]="h.hazard" (ngModelChange)="touch()" placeholder="e.g. Drought" aria-label="Hazard" />
                  <select class="input" [(ngModel)]="h.likelihood" (ngModelChange)="touch()" aria-label="Likelihood"><option value="">—</option>@for (o of opts(likelihoods, h.likelihood); track o) { <option [value]="o">{{ o }}</option> }</select>
                  <select class="input" [(ngModel)]="h.significance" (ngModelChange)="touch()" aria-label="Significance"><option value="">—</option>@for (o of opts(significances, h.significance); track o) { <option [value]="o">{{ o }}</option> }</select>
                  <input type="number" step="any" class="input num" [(ngModel)]="h.score" (ngModelChange)="touch()" aria-label="Score" />
                  <input type="number" step="0.05" min="0" max="1" class="input num" [(ngModel)]="h.mitigation" (ngModelChange)="touch()" aria-label="Mitigation multiplier" />
                  @if (editable()) { <button type="button" class="btn btn-ghost btn-icon" [disabled]="w.natural.length === 1" (click)="w.natural.splice(i, 1); touch()" aria-label="Remove hazard"><vc-icon name="trash" [size]="15" /></button> } @else { <span></span> }
                </div>
              }
              @if (editable()) { <button type="button" class="btn btn-secondary btn-sm" (click)="addHazard()"><vc-icon name="plus" [size]="14" />Add hazard</button> }
            </section>
            <div class="field"><label for="nn">Notes and sources</label><textarea id="nn" class="input" rows="3" [(ngModel)]="notes" placeholder="Which tables and evidence each score comes from."></textarea></div>
          </fieldset>
        </div>

        <aside class="res">
          <div class="rc" [class.fail]="pv().fails">
            <span class="l">Worksheet rating <vc-dc cls="CALCULATED" /></span>
            <strong class="num">{{ pv().rating | num: 1 }}<small>%</small></strong>
            <div class="bars">
              @for (b of barRows(); track b.k) { <div class="br"><span>{{ b.label }}</span><div class="bt"><span [style.width.%]="b.w" [style.background]="b.c"></span></div><b class="num">{{ b.v | num: 1 }}</b></div> }
            </div>
            <p class="small">Overall {{ pv().overall | num: 1 }}@if (pv().overall < min) { · raised to the tool minimum of {{ min }}% }</p>
            @if (pv().fails) { <p class="small failt"><vc-icon name="alert" [size]="13" />Above {{ fail }} — the project fails the risk analysis and can't be credited on this profile.</p> }
            @if (pv().missing) { <p class="small warnt">{{ pv().missing }} value{{ pv().missing === 1 ? '' : 's' }} still missing.</p> }
            <p class="small subtle">Preview while you type. The server recalculates when you save.</p>
          </div>

          @if (sel(); as p) {
            @if (p.status === 'submitted' && canApprove) {
              <div class="approve">
                <h3>Approve final NPR</h3>
                @if (p.created_by === me || p.submitted_by === me) {
                  <vc-callout tone="warn" icon="shield">You prepared or submitted this worksheet, so a different methodology owner must approve it.</vc-callout>
                } @else {
                  <div class="field"><label for="fn">Final NPR (%)</label><input id="fn" type="number" step="0.1" [min]="min" [max]="fail" class="input num" [(ngModel)]="finalPct" />
                    <span class="hint">Between {{ min }} and {{ fail }}. Worksheet says {{ p.computed_rating_pct | num: 1 }}%.</span></div>
                  <div class="field"><label for="fj">Justification @if (differs(p)) { <span class="req">required</span> }</label><textarea id="fj" class="input" rows="3" [(ngModel)]="justification" placeholder="Why the final rating differs from the worksheet, if it does."></textarea></div>
                  <button class="btn btn-primary" [disabled]="busy() || p.computed.fails || finalPct === null || finalPct < min || finalPct > fail || (differs(p) && justification.trim().length < 10)" (click)="approve(p)"><vc-icon name="stamp" />Approve {{ finalPct ?? '' }}%</button>
                  <p class="small subtle">Prepared by {{ people.name(p.created_by) }}@if (p.submitted_by) { · submitted by {{ people.name(p.submitted_by) }} }. Approving supersedes the current approved version.</p>
                }
              </div>
            }
            @if (p.status === 'approved' || p.status === 'superseded') {
              <div class="approve"><h3>Final NPR {{ p.final_npr_pct | num: 1 }}%</h3><p class="small">Approved by {{ people.name(p.approved_by) }} on {{ p.approved_at | day }}.</p>
                @if (p.justification) { <p class="small muted">“{{ p.justification }}”</p> }</div>
            }
          }
          @if (err()) { <vc-error title="Not saved" [message]="err()!" /> }
        </aside>
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="open.set(false)">Close</button>
        @if (editable()) {
          <button class="btn btn-secondary" [disabled]="busy()" (click)="save(false)">Save draft</button>
          @if (sel()) { <button class="btn btn-primary" [disabled]="busy() || pv().missing > 0 || dirty()" [title]="dirty() ? 'Save your changes first' : ''" (click)="submit()"><vc-icon name="send" />Submit for approval</button> }
          @else { <button class="btn btn-primary" [disabled]="busy() || pv().missing > 0" (click)="save(true)"><vc-icon name="send" />Save and submit</button> }
        }
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .tool{margin-bottom:16px}
    .top{display:flex;gap:12px;align-items:stretch;margin-bottom:16px;flex-wrap:wrap}
    .hero{padding:16px 20px;min-width:300px;display:flex;flex-direction:column;background:linear-gradient(135deg,var(--forest-800),var(--forest-600));border-color:var(--forest-700);color:#fff}
    .hero .l{font-size:12.5px;color:rgba(255,255,255,.75)} .hero strong{font-size:34px;font-weight:600;letter-spacing:-.02em} .hero small{font-size:16px;margin-left:2px}
    .hero .none{font-size:24px} .hero .s{font-size:12px;color:rgba(255,255,255,.75)}
    .mini{padding:16px 18px;display:flex;flex-direction:column;min-width:160px} .mini .l{font-size:12.5px;color:var(--text-2)} .mini strong{font-size:26px;font-weight:600} .mini .s{font-size:12px;color:var(--text-3)}
    .top .spacer{flex:1} .top > .btn{align-self:flex-end}
    .ws{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px;align-items:start}
    @media (max-width:860px){.ws{grid-template-columns:1fr}}
    fieldset{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:18px;min-width:0}
    .sec{display:flex;flex-direction:column;gap:8px}
    .sh{display:flex;align-items:center;justify-content:space-between;padding-bottom:6px;border-bottom:1px solid var(--border)}
    .tot{font-weight:600;font-size:16px;color:var(--forest-700)}
    .fr{display:grid;grid-template-columns:1fr 110px;gap:12px;align-items:center}
    .fl{display:flex;flex-direction:column} .fl label{font-weight:500;font-size:13.5px}
    .hz{display:grid;grid-template-columns:minmax(96px,1.2fr) minmax(0,1fr) minmax(0,1fr) 64px 72px 32px;gap:6px;align-items:center}
    .hz .input{padding:0 8px} .hz select.input{padding-right:24px;background-position:right 8px center}
    .hh{color:var(--text-2);font-weight:500}
    @media (max-width:720px){.hz{grid-template-columns:1fr 1fr}.hh{display:none}}
    .res{position:sticky;top:0;display:flex;flex-direction:column;gap:14px}
    .rc{display:flex;flex-direction:column;gap:8px;padding:16px;border-radius:12px;background:var(--forest-50);border:1px solid var(--forest-100)}
    .rc.fail{background:var(--danger-soft);border-color:#f3c7c3}
    .rc .l{font-size:12.5px;color:var(--text-2);display:flex;gap:6px;align-items:center} .rc strong{font-size:34px;font-weight:600;letter-spacing:-.02em;color:var(--stone-900)} .rc small{font-size:16px}
    .bars{display:flex;flex-direction:column;gap:6px}
    .br{display:grid;grid-template-columns:64px 1fr 36px;gap:8px;align-items:center;font-size:12px;color:var(--text-2)}
    .bt{height:8px;border-radius:4px;background:var(--surface);overflow:hidden} .bt span{display:block;height:100%;border-radius:4px}
    .br b{text-align:right;color:var(--stone-800);font-weight:600}
    .failt{display:flex;gap:6px;color:var(--red-600)} .warnt{color:var(--amber-600)}
    .approve{display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2)}
    .req{font-size:11px;color:var(--amber-600);margin-left:4px}
  `],
})
export class NprTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  people = inject(PeopleDirectory);
  projectId = input.required<string>();
  canManage = this.auth.can('risk.manage');
  canApprove = this.auth.can('rules.approve');
  me = this.auth.profile()?.id;
  internal = INTERNAL;
  external = EXTERNAL;
  min = MIN_RATING;
  fail = FAIL_ABOVE;
  likelihoods = ['Less than every 10 years', 'Every 10 to 25 years', 'Every 25 to 50 years', 'Every 50 to 100 years', 'Once every 100 years or more'];
  significances = ['Catastrophic (70–100% loss)', 'Devastating (50–70%)', 'Major (25–50%)', 'Moderate (5–25%)', 'Minor (<5%)', 'Insignificant'];

  profiles = new Remote<RiskProfile[]>();
  perm = signal<Permanence | null>(null);
  approved = computed(() => (this.profiles.data() ?? []).find(p => p.status === 'approved') ?? null);

  open = signal(false);
  sel = signal<RiskProfile | null>(null);
  busy = signal(false);
  err = signal<string | null>(null);
  dirty = signal(false);
  private rev = signal(0);
  w: NprInputs = this.blank();
  notes = '';
  finalPct: number | null = null;
  justification = '';
  editable = computed(() => this.canManage && (!this.sel() || this.sel()!.status === 'draft'));
  pv = computed(() => { this.rev(); return preview(this.w); });
  barRows = computed(() => {
    const p = this.pv();
    const max = Math.max(p.it, p.et, p.nt, 1);
    return [
      { k: 'i', label: 'Internal', v: p.it, w: (p.it / max) * 100, c: 'var(--forest-500)' },
      { k: 'e', label: 'External', v: p.et, w: (p.et / max) * 100, c: 'var(--sky-600)' },
      { k: 'n', label: 'Natural', v: p.nt, w: (p.nt / max) * 100, c: 'var(--clay-500)' },
    ];
  });

  constructor() {
    this.people.load();
    effect(() => { const pid = this.projectId(); untracked(() => this.load(pid)); });
  }

  load(pid = this.projectId(), keep = false) {
    this.profiles.load(this.api.get<RiskProfile[]>(`/projects/${pid}/risk-profiles`), keep);
    this.api.get<Permanence>(`/projects/${pid}/risk/permanence`).subscribe({ next: p => this.perm.set(p), error: () => this.perm.set(null) });
  }

  private blank(): NprInputs {
    return {
      internal: Object.fromEntries(INTERNAL.map(x => [x.k, null])), external: Object.fromEntries(EXTERNAL.map(x => [x.k, null])),
      natural: [{ hazard: 'Drought', likelihood: '', significance: '', score: null, mitigation: 1 }],
    };
  }
  opts(list: string[], cur: string) { return cur && !list.includes(cur) ? [cur, ...list] : list; }
  touch() { this.dirty.set(true); this.rev.update(v => v + 1); }
  addHazard() { this.w.natural.push({ hazard: '', likelihood: '', significance: '', score: null, mitigation: 1 }); this.touch(); }
  statusLine(p: RiskProfile) { return `${p.status.charAt(0).toUpperCase() + p.status.slice(1)} · prepared by ${this.people.name(p.created_by)} · ${p.tool_version}`; }
  differs(p: RiskProfile) { return this.finalPct !== null && Math.abs(Number(this.finalPct) - p.computed_rating_pct) > 1e-6; }

  openNew() {
    const a = this.approved() ?? (this.profiles.data() ?? [])[0];
    this.sel.set(null);
    this.w = a ? structuredClone(a.inputs) : this.blank();
    this.notes = '';
    this.err.set(null);
    this.dirty.set(false);
    this.rev.update(v => v + 1);
    this.open.set(true);
  }
  openProfile(p: RiskProfile) {
    this.sel.set(p);
    this.w = structuredClone(p.inputs);
    this.notes = p.notes;
    this.finalPct = p.final_npr_pct ?? p.computed_rating_pct;
    this.justification = p.justification ?? '';
    this.err.set(null);
    this.dirty.set(false);
    this.rev.update(v => v + 1);
    this.open.set(true);
  }
  private payload() {
    const n = (v: unknown) => num(v);
    return {
      internal: Object.fromEntries(INTERNAL.map(x => [x.k, n(this.w.internal[x.k])])),
      external: Object.fromEntries(EXTERNAL.map(x => [x.k, n(this.w.external[x.k])])),
      natural: this.w.natural.map(h => ({ hazard: h.hazard.trim(), likelihood: h.likelihood, significance: h.significance, score: n(h.score), mitigation: n(h.mitigation) ?? 1 })),
    };
  }
  save(andSubmit: boolean) {
    this.busy.set(true);
    this.err.set(null);
    const p = this.sel();
    const req = p ? this.api.patch<RiskProfile>(`/risk-profiles/${p.id}`, { inputs: this.payload(), notes: this.notes })
      : this.api.post<RiskProfile>(`/projects/${this.projectId()}/risk-profiles`, { inputs: this.payload(), notes: this.notes });
    req.subscribe({
      next: r => {
        this.sel.set(r);
        this.dirty.set(false);
        if (andSubmit) { this.submit(); return; }
        this.busy.set(false);
        this.toast.success(`Worksheet v${r.version} saved`, `Worksheet rating ${r.computed_rating_pct}%.`);
        this.load(undefined, true);
      },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(apiMessage(e)); },
    });
  }
  submit() {
    const p = this.sel();
    if (!p) return;
    this.busy.set(true);
    this.api.post<RiskProfile>(`/risk-profiles/${p.id}/submit`).subscribe({
      next: r => { this.busy.set(false); this.sel.set(r); this.toast.success('Submitted for approval', 'A methodology owner who did not prepare it will set the final NPR.'); this.load(undefined, true); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(apiMessage(e)); },
    });
  }
  approve(p: RiskProfile) {
    this.busy.set(true);
    this.err.set(null);
    this.api.post<RiskProfile>(`/risk-profiles/${p.id}/approve`, { final_npr_pct: Number(this.finalPct), justification: this.justification.trim() }).subscribe({
      next: r => { this.busy.set(false); this.sel.set(r); this.toast.success(`NPR ${r.final_npr_pct}% approved`, `Version ${r.version} is now the project's rating.`); this.load(undefined, true); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(selfApprovalMessage(e, 'Approving a risk rating')); },
    });
  }
}
