import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { PeopleDirectory } from '../benefits/benefit-types';
import { apiMessage } from '../credits/credit-ui';
import { isoToday, uploadEvidence } from '../households/lookups';
import { Remote } from '../supporting/shared';

interface Obligation {
  id: string; project_id: string; kind: 'soc_remeasurement' | 'baseline_reassessment' | 'data_retention' | 'other'; title: string; due_on: string;
  status: 'upcoming' | 'due' | 'overdue' | 'done' | 'cancelled'; basis: string; rule_ref: { key: string; value: number; source: string } | null;
  anchor_date: string | null; generated: boolean; responsible_user_id: string | null; done_on: string | null; evidence_ids: string[]; notes: string;
}
interface GenResult { created: Obligation[]; updated: Obligation[]; skipped: { kind: string; code: string; reason: string }[] }

const KIND: Record<string, { label: string; icon: string; typical: string }> = {
  soc_remeasurement: { label: 'SOC re-measurement', icon: 'flask', typical: 'Typically every 5 years (VM0042)' },
  baseline_reassessment: { label: 'Baseline reassessment', icon: 'history', typical: 'Typically every 10 years' },
  data_retention: { label: 'Data retention', icon: 'archive', typical: 'At least 2 years after crediting ends (VM0042 §9.3)' },
  other: { label: 'Other obligation', icon: 'clipboard', typical: '' },
};
const STATUS: Record<string, { label: string; badge: string }> = {
  overdue: { label: 'Overdue', badge: 'failed' }, due: { label: 'Due within 90 days', badge: 'warning' }, upcoming: { label: 'Upcoming', badge: 'planned' },
  done: { label: 'Done', badge: 'complete' }, cancelled: { label: 'Cancelled', badge: 'cancelled' },
};

@Component({
  selector: 'vcx-obligations-tab',
  imports: [...KIT, FormsModule, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">What the methodology requires the project to do over time. Due dates are worked out from the project's rule pack and its recorded dates — nothing is assumed. Missing rules are reported, not guessed.</p>
      <span class="spacer"></span>
      @if (canManage) {
        <button class="btn btn-secondary" (click)="openManual()"><vc-icon name="plus" />Add obligation</button>
        <button class="btn btn-primary" (click)="openGen()"><vc-icon name="refresh" />Generate from rules</button>
      }
    </div>

    <div class="sum">
      @for (s of statusOrder; track s) {
        <div class="sc" [class]="count(s) ? 't-' + s : ''"><span>{{ st(s).label }}</span><strong class="num">{{ count(s) }}</strong></div>
      }
    </div>

    <section class="card">
      @if (list.loading() && !list.data()) { <vc-loading [rows]="5" /> }
      @else if (list.error()) { <div class="card-body"><vc-error title="Couldn't load obligations" [message]="list.error()!.message" /></div> }
      @else if (!(list.data() ?? []).length) {
        <vc-empty icon="calendar" title="No monitoring obligations yet" text="Generate them from the rule pack: SOC re-measurement, baseline reassessment and how long data must be kept.">
          @if (canManage) { <button class="btn btn-primary" (click)="openGen()"><vc-icon name="refresh" />Generate from rules</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Obligation</th><th>Due</th><th>Status</th><th>How the date was worked out</th><th></th></tr></thead>
            <tbody>
              @for (o of list.data(); track o.id) {
                <tr>
                  <td><div class="ob"><span class="ki"><vc-icon [name]="kind(o.kind).icon" [size]="15" /></span>
                    <div><strong>{{ o.title }}</strong><span class="small subtle">{{ kind(o.kind).label }}@if (!o.generated) { · added by hand }</span></div></div></td>
                  <td class="nowrap"><strong>{{ o.due_on | day }}</strong>@if (o.status !== 'done' && o.status !== 'cancelled') { <span class="small subtle rel">{{ rel(o.due_on) }}</span> }</td>
                  <td><vc-badge [status]="st(o.status).badge">{{ st(o.status).label }}</vc-badge>@if (o.done_on) { <span class="small subtle"> {{ o.done_on | day }}</span> }</td>
                  <td class="basis small">{{ o.basis || '—' }}@if (o.rule_ref; as r) { <span class="src"><vc-icon name="book" [size]="11" />{{ r.source || r.key }}</span> }</td>
                  <td class="num nowrap">
                    @if (canManage && !['done', 'cancelled'].includes(o.status)) {
                      <button class="btn btn-secondary btn-sm" (click)="openClose(o, 'complete')"><vc-icon name="check" [size]="13" />Mark done</button>
                      <button class="btn btn-ghost btn-sm" (click)="openClose(o, 'cancel')">Cancel</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- generate -->
    <vc-modal [(open)]="genOpen" title="Generate obligations from rules" width="560px" subtitle="Values come from the project's rule pack. Enter one here only if the pack doesn't hold it, with its source.">
      <div class="stack">
        @if (!genResult()) {
          <div class="form-grid">
            <div class="field"><label for="g1">SOC re-measurement every (years)</label><input id="g1" type="number" min="1" class="input num" [(ngModel)]="g.soc" placeholder="From rule pack" /><span class="hint">{{ kind('soc_remeasurement').typical }}</span></div>
            <div class="field"><label for="g2">Baseline reassessment every (years)</label><input id="g2" type="number" min="1" class="input num" [(ngModel)]="g.base" placeholder="From rule pack" /><span class="hint">{{ kind('baseline_reassessment').typical }}</span></div>
            <div class="field"><label for="g3">Keep data after crediting ends (years)</label><input id="g3" type="number" min="0" class="input num" [(ngModel)]="g.ret" placeholder="From rule pack" /><span class="hint">{{ kind('data_retention').typical }}</span></div>
            <div class="field"><label for="g4">Source of these values</label><input id="g4" class="input" [(ngModel)]="g.source" placeholder="e.g. VM0042 v2.2 §8.2" /><span class="hint">Required when you enter a value.</span></div>
          </div>
          @if (genError()) { <vc-error title="Not generated" [message]="genError()!" /> }
        } @else {
          @let r = genResult()!;
          <vc-callout [tone]="r.skipped.length ? 'warn' : 'ok'" [icon]="r.skipped.length ? 'alert' : 'check-circle'">
            {{ r.created.length }} created · {{ r.updated.length }} updated · {{ r.skipped.length }} skipped</vc-callout>
          @for (o of r.created.concat(r.updated); track o.id) { <div class="gr"><vc-icon name="check" [size]="14" /><strong>{{ o.title }}</strong><span class="muted small">{{ o.due_on | day }} — {{ o.basis }}</span></div> }
          @for (s of r.skipped; track s.kind) { <div class="gr skip"><vc-icon name="alert" [size]="14" /><strong>{{ kind(s.kind).label }}</strong><span class="small">{{ s.reason }}</span></div> }
        }
      </div>
      <ng-container footer>
        @if (!genResult()) {
          <button class="btn btn-ghost" (click)="genOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="busy()" (click)="generate()">Generate</button>
        } @else { <button class="btn btn-primary" (click)="genOpen.set(false)">Done</button> }
      </ng-container>
    </vc-modal>

    <!-- manual -->
    <vc-modal [(open)]="manOpen" title="Add an obligation" width="520px">
      <div class="form-grid">
        <div class="field span-2"><label for="mt">Title</label><input id="mt" class="input" [(ngModel)]="m.title" placeholder="e.g. Verifier site visit" /></div>
        <div class="field"><label for="mk">Kind</label><select id="mk" class="input" [(ngModel)]="m.kind">@for (k of kinds; track k) { <option [value]="k">{{ kind(k).label }}</option> }</select></div>
        <div class="field"><label for="md">Due on</label><input id="md" type="date" class="input" [(ngModel)]="m.due_on" /></div>
        <div class="field span-2"><label for="mb">Basis</label><input id="mb" class="input" [(ngModel)]="m.basis" placeholder="Why this is required" /></div>
        <div class="field span-2"><label for="mr">Responsible <span class="subtle">(optional)</span></label>
          <select id="mr" class="input" [(ngModel)]="m.responsible"><option value="">Nobody yet</option>@for (u of users(); track u.id) { <option [value]="u.id">{{ u.name }}</option> }</select></div>
        @if (formError()) { <div class="span-2"><vc-error title="Not added" [message]="formError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="manOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || m.title.trim().length < 3 || !m.due_on" (click)="addManual()">Add obligation</button>
      </ng-container>
    </vc-modal>

    <!-- complete / cancel -->
    <vc-modal [open]="!!closing()" (closed)="closing.set(null)" [title]="closing()?.mode === 'complete' ? 'Mark obligation done' : 'Cancel obligation'" [subtitle]="closing()?.o?.title ?? ''" width="500px">
      @if (closing(); as c) {
        <div class="stack">
          @if (c.mode === 'complete') {
            <div class="field"><label for="cd">Done on</label><input id="cd" type="date" class="input" [max]="today" [(ngModel)]="cf.done_on" /></div>
            @if (c.o.kind !== 'data_retention') {
              <div class="field"><label>Evidence</label><vc-file-drop [(file)]="evidence" label="Report, lab certificate or sampling record" hint="Required — stored as immutable evidence" /></div>
            }
          }
          <div class="field"><label for="cn">Note @if (c.mode === 'cancel') { <span class="subtle">(required)</span> }</label>
            <textarea id="cn" class="input" rows="3" [(ngModel)]="cf.note" [placeholder]="c.mode === 'cancel' ? 'Why does this obligation no longer apply?' : 'Optional'"></textarea></div>
          @if (formError()) { <vc-error title="Not changed" [message]="formError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="closing.set(null)">Back</button>
        <button class="btn" [class.btn-primary]="closing()?.mode === 'complete'" [class.btn-danger]="closing()?.mode === 'cancel'"
          [disabled]="busy() || (closing()?.mode === 'cancel' ? !cf.note.trim() : (closing()?.o?.kind !== 'data_retention' && !evidence()))" (click)="close()">
          {{ closing()?.mode === 'complete' ? 'Mark done' : 'Cancel obligation' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:10px;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap} .bar p{max-width:720px}
    .sum{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:14px}
    @media (max-width:900px){.sum{grid-template-columns:repeat(3,1fr)}}
    .sc{display:flex;flex-direction:column;padding:10px 14px;border-radius:10px;background:var(--surface);border:1px solid var(--border)}
    .sc span{font-size:12.5px;color:var(--text-2)} .sc strong{font-size:22px;font-weight:600}
    .sc.t-overdue strong{color:var(--red-600)} .sc.t-due strong{color:var(--amber-600)} .sc.t-done strong{color:var(--forest-700)}
    .ob{display:flex;gap:10px;align-items:flex-start} .ob div{display:flex;flex-direction:column;line-height:1.35}
    .ki{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:var(--forest-50);color:var(--forest-600);flex:none}
    .rel{display:block}
    .basis{max-width:380px;color:var(--stone-700)} .src{display:flex;gap:4px;align-items:center;margin-top:3px;color:var(--text-3)}
    .gr{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;color:var(--forest-700)} .gr .muted{color:var(--text-2)}
    .gr.skip{color:var(--amber-600)}
  `],
})
export class ObligationsTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private people = inject(PeopleDirectory);
  projectId = input.required<string>();
  canManage = this.auth.can('risk.manage');
  today = isoToday();
  statusOrder = ['overdue', 'due', 'upcoming', 'done', 'cancelled'];
  kinds = Object.keys(KIND);

  list = new Remote<Obligation[]>();
  busy = signal(false);
  users = computed(() => Object.entries(this.people.names()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)));

  genOpen = signal(false);
  genError = signal<string | null>(null);
  genResult = signal<GenResult | null>(null);
  g = { soc: null as number | null, base: null as number | null, ret: null as number | null, source: '' };
  manOpen = signal(false);
  formError = signal<string | null>(null);
  m = { title: '', kind: 'other', due_on: '', basis: '', responsible: '' };
  closing = signal<{ o: Obligation; mode: 'complete' | 'cancel' } | null>(null);
  cf = { done_on: isoToday(), note: '' };
  evidence = signal<File | null>(null);

  constructor() {
    this.people.load();
    effect(() => { const pid = this.projectId(); untracked(() => this.load(pid)); });
  }
  load(pid = this.projectId(), keep = false) { this.list.load(this.api.get<Obligation[]>(`/projects/${pid}/monitoring-obligations`), keep); }
  kind(k: string) { return KIND[k] ?? KIND['other']; }
  st(s: string) { return STATUS[s] ?? { label: s, badge: s }; }
  count(s: string) { return (this.list.data() ?? []).filter(o => o.status === s).length; }
  rel(d: string) {
    const days = Math.round((new Date(d + 'T00:00:00').getTime() - Date.now()) / 86400000);
    if (days < 0) return `${-days} days late`;
    if (days < 60) return `in ${days} days`;
    const months = Math.round(days / 30.4);
    return months < 24 ? `in ${months} months` : `in ${(days / 365).toFixed(1)} years`;
  }

  openGen() { this.g = { soc: null, base: null, ret: null, source: '' }; this.genError.set(null); this.genResult.set(null); this.genOpen.set(true); }
  generate() {
    this.busy.set(true);
    this.genError.set(null);
    const v = (x: number | null) => (x === null || (x as unknown) === '' ? null : Number(x));
    this.api.post<GenResult>(`/projects/${this.projectId()}/monitoring-obligations/generate`, {
      soc_remeasurement_interval_years: v(this.g.soc), baseline_reassessment_interval_years: v(this.g.base),
      data_retention_years_after_crediting: v(this.g.ret), source: this.g.source.trim(),
    }).subscribe({
      next: r => { this.busy.set(false); this.genResult.set(r); this.load(undefined, true); },
      error: (e: ApiError) => { this.busy.set(false); this.genError.set(apiMessage(e)); },
    });
  }
  openManual() { this.m = { title: '', kind: 'other', due_on: '', basis: '', responsible: '' }; this.formError.set(null); this.manOpen.set(true); }
  addManual() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post<Obligation>('/monitoring-obligations', {
      project_id: this.projectId(), kind: this.m.kind, title: this.m.title.trim(), due_on: this.m.due_on, basis: this.m.basis.trim(),
      responsible_user_id: this.m.responsible || null,
    }).subscribe({
      next: () => { this.busy.set(false); this.manOpen.set(false); this.toast.success('Obligation added'); this.load(undefined, true); },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(apiMessage(e)); },
    });
  }
  openClose(o: Obligation, mode: 'complete' | 'cancel') { this.cf = { done_on: isoToday(), note: '' }; this.evidence.set(null); this.formError.set(null); this.closing.set({ o, mode }); }
  close() {
    const c = this.closing();
    if (!c) return;
    this.busy.set(true);
    this.formError.set(null);
    const send = (ids: string[]) => this.api.post<Obligation>(`/monitoring-obligations/${c.o.id}/${c.mode}`, {
      done_on: c.mode === 'complete' ? this.cf.done_on : null, evidence_ids: ids, note: this.cf.note.trim(),
    }).subscribe({
      next: () => { this.busy.set(false); this.closing.set(null); this.toast.success(c.mode === 'complete' ? 'Obligation done' : 'Obligation cancelled', c.mode === 'complete' ? 'Run “Generate from rules” to schedule the next one.' : undefined); this.load(undefined, true); },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(apiMessage(e)); },
    });
    const f = this.evidence();
    if (c.mode === 'complete' && f) {
      uploadEvidence(this.api, f, 'monitoring_obligation', c.o.id).subscribe({ next: ev => send([ev.id]), error: (e: ApiError) => { this.busy.set(false); this.formError.set(e.message); } });
    } else send([]);
  }
}
