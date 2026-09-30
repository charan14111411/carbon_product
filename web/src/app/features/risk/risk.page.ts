import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { FieldLite, Remote, isoDate } from '../supporting/shared';

interface RiskEvent {
  id: string; project_id: string; field_id: string | null; kind: string; occurred_on: string; description: string;
  severity: 'low' | 'medium' | 'high'; estimated_impact_t: number | null; status: 'open' | 'assessing' | 'action' | 'resolved';
  resolution: string | null; evidence_ids: string[]; created_at: string; updated_at: string;
}
interface Summary {
  project_id: string; open: number; resolved: number; open_by_kind: Record<string, number>; open_by_severity: Record<string, number>;
  estimated_impact_t: number; events_without_estimate: number; buffer_t_co2e: number; approved_runs: number;
  impact_to_buffer_ratio: number | null; buffer_sufficient: boolean; message: string;
}

const KINDS: { key: string; label: string; icon: string }[] = [
  { key: 'farmer_exit', label: 'Farmer exit', icon: 'logout' },
  { key: 'land_use_change', label: 'Land-use change', icon: 'map' },
  { key: 'fire', label: 'Fire', icon: 'zap' },
  { key: 'flood', label: 'Flood', icon: 'droplets' },
  { key: 'drought', label: 'Drought', icon: 'sun' },
  { key: 'practice_reversal', label: 'Practice reversal', icon: 'undo' },
  { key: 'other', label: 'Other', icon: 'alert' },
];
const FLOW = ['open', 'assessing', 'action', 'resolved'] as const;
const STEP: Record<string, { label: string; verb: string; hint: string }> = {
  open: { label: 'Open', verb: 'Reopen', hint: 'Reported, not yet looked at' },
  assessing: { label: 'Assessing', verb: 'Start assessing', hint: 'Working out the extent and impact' },
  action: { label: 'Action', verb: 'Move to action', hint: 'Mitigation under way with the farmer' },
  resolved: { label: 'Resolved', verb: 'Resolve', hint: 'Closed with a written resolution' },
};

@Component({
  selector: 'vc-risk-page',
  imports: [...KIT, FormsModule, NumPipe, DayPipe, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Risk & permanence" eyebrow="Care"
      subtitle="Events that could reverse stored carbon — a farmer leaving, land-use change, fire, flood or practices being dropped — and how they compare with the buffer pool held back from credits.">
      @if (canManage() && ctx.currentId()) { <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Record risk event</button> }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Risk is tracked per project. Pick one in the top bar." /></div>
    } @else {
      @if (summary.error()) {
        <vc-error title="Couldn't load the risk summary" [message]="summary.error()!.message" />
      } @else if (summary.data(); as s) {
        <div class="sum">
          <section class="card buffer">
            <div class="card-head"><h3>Open risk vs buffer pool</h3>
              <vc-badge [status]="s.estimated_impact_t === 0 ? 'ok' : s.buffer_sufficient ? 'ok' : 'blocking'">{{ s.estimated_impact_t === 0 ? 'No exposure' : s.buffer_sufficient ? 'Buffer covers it' : 'Buffer exceeded' }}</vc-badge>
            </div>
            <div class="card-body">
              <div class="bars">
                <div class="br">
                  <span class="bl">Estimated impact of open events</span>
                  <div class="bt"><span class="bf imp" [class.over]="!s.buffer_sufficient" [style.width.%]="w(s.estimated_impact_t, s)"></span></div>
                  <strong class="num">{{ s.estimated_impact_t | num: 2 }} <small>tCO₂e</small></strong>
                </div>
                <div class="br">
                  <span class="bl">Buffer pool from approved results</span>
                  <div class="bt"><span class="bf buf" [style.width.%]="w(s.buffer_t_co2e, s)"></span></div>
                  <strong class="num">{{ s.buffer_t_co2e | num: 2 }} <small>tCO₂e</small></strong>
                </div>
              </div>
              <p class="msg" [class.bad]="!s.buffer_sufficient"><vc-icon [name]="s.buffer_sufficient ? 'info' : 'alert'" [size]="15" />{{ s.message }}</p>
              <p class="small muted expl">The buffer is a share of every verified result that is held back, never sold, to cover carbon that might be lost later.
                It comes from {{ s.approved_runs }} approved calculation{{ s.approved_runs === 1 ? '' : 's' }}.
                @if (s.events_without_estimate) { <strong>{{ s.events_without_estimate }} open event{{ s.events_without_estimate === 1 ? ' has' : 's have' }} no impact estimate yet</strong> and {{ s.events_without_estimate === 1 ? 'is' : 'are' }} not counted. }</p>
            </div>
          </section>
          <section class="card">
            <div class="card-head"><h3>Open events</h3><strong class="num big">{{ s.open }}</strong></div>
            <div class="card-body">
              <div class="sev">
                @for (sv of ['high', 'medium', 'low']; track sv) {
                  <div class="sv" [class]="'s-' + sv"><span>{{ sv | titlecase }}</span><strong class="num">{{ s.open_by_severity[sv] ?? 0 }}</strong></div>
                }
              </div>
              <ul class="kinds">
                @for (k of kindRows(s); track k.key) {
                  <li><vc-icon [name]="k.icon" [size]="14" /><span>{{ k.label }}</span><span class="kb"><span [style.width.%]="k.w"></span></span><strong class="num">{{ k.n }}</strong></li>
                } @empty { <li class="muted small">No open events.</li> }
              </ul>
              <p class="small subtle">{{ s.resolved }} resolved to date.</p>
            </div>
          </section>
        </div>
      }

      <div class="filters">
        <div class="seg">
          @for (f of statusFilters; track f.key) {
            <button type="button" [class.on]="status() === f.key" (click)="status.set(f.key)">{{ f.label }}<span class="c num">{{ countStatus(f.key) }}</span></button>
          }
        </div>
        <select class="input kf" [ngModel]="kind()" (ngModelChange)="kind.set($event)" aria-label="Kind">
          <option value="">All kinds</option>
          @for (k of kinds; track k.key) { <option [value]="k.key">{{ k.label }}</option> }
        </select>
      </div>

      <section class="card">
        @if (events.loading()) {
          <vc-loading [rows]="5" />
        } @else if (events.error()) {
          <div class="card-body"><vc-error title="Couldn't load risk events" [message]="events.error()!.message" /></div>
        } @else if (!rows().length) {
          <vc-empty icon="radar" [title]="status() || kind() ? 'No matching events' : 'No risk events recorded'"
            text="Record anything that could reverse soil carbon on an enrolled field, so its impact can be weighed against the buffer." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Occurred</th><th>Event</th><th>Field</th><th>Severity</th><th class="num">Est. impact</th><th>Progress</th><th></th></tr></thead>
              <tbody>
                @for (e of rows(); track e.id) {
                  <tr class="clickable" (click)="openDetail(e)">
                    <td class="nowrap">{{ e.occurred_on | day }}</td>
                    <td><div class="ev"><span class="ki"><vc-icon [name]="kindIcon(e.kind)" [size]="14" />{{ kindLabel(e.kind) }}</span><span class="small muted truncate">{{ e.description }}</span></div></td>
                    <td>{{ fieldCode(e.field_id) }}</td>
                    <td><span class="sevb" [class]="'s-' + e.severity">{{ e.severity | titlecase }}</span></td>
                    <td class="num">@if (e.estimated_impact_t !== null) { {{ e.estimated_impact_t | num: 2 }} <span class="u">t</span> } @else { <span class="subtle">Not estimated</span> }</td>
                    <td><div class="flow">@for (st of flow; track st) { <span class="fd" [class.done]="idx(e.status) >= $index" [title]="step(st).label"></span> }<span class="small">{{ step(e.status).label }}</span></div></td>
                    <td class="num"><vc-icon name="chevron-right" class="subtle" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <!-- create -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="500px" title="Record a risk event" [subtitle]="ctx.current()?.name ?? ''">
      <form class="form-grid" id="riskCreate" (ngSubmit)="create()">
        <div class="field span-2">
          <label>What happened</label>
          <div class="kgrid">
            @for (k of kinds; track k.key) {
              <label class="kopt" [class.on]="cf.kind === k.key"><input type="radio" name="kind" [value]="k.key" [(ngModel)]="cf.kind" /><vc-icon [name]="k.icon" [size]="15" />{{ k.label }}</label>
            }
          </div>
        </div>
        <div class="field"><label for="co">Occurred on</label><input id="co" type="date" class="input" name="co" [(ngModel)]="cf.occurred_on" [max]="today" /></div>
        <div class="field"><label for="cs">Severity</label>
          <select id="cs" class="input" name="cs" [(ngModel)]="cf.severity"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
        <div class="field span-2"><label for="cfld">Field</label>
          <select id="cfld" class="input" name="cfld" [(ngModel)]="cf.field_id"><option value="">Whole project / not field-specific</option>
            @for (f of fields.data() ?? []; track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}</option> }</select></div>
        <div class="field span-2"><label for="ci">Estimated impact</label>
          <div class="unit"><input id="ci" type="number" min="0" step="0.01" class="input num" name="ci" [(ngModel)]="cf.impact" placeholder="Leave blank if not yet known" /><span>tCO₂e</span></div>
          <span class="hint">Carbon that could be lost if this is not reversed. You can add or change it later.</span></div>
        <div class="field span-2"><label for="cd">Description</label>
          <textarea id="cd" class="input" name="cd" rows="4" [(ngModel)]="cf.description" placeholder="What was seen, by whom, and what is known so far."></textarea></div>
        @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="riskCreate" [disabled]="saving() || cf.description.trim().length < 5">{{ saving() ? 'Saving…' : 'Record event' }}</button>
      </ng-container>
    </vc-modal>

    <!-- detail -->
    <vc-modal [(open)]="detailOpen" [drawer]="true" width="540px" [title]="sel() ? kindLabel(sel()!.kind) : ''" [subtitle]="sel() ? (sel()!.occurred_on | day) + ' · ' + fieldCode(sel()!.field_id) : ''">
      @if (sel(); as e) {
        <div class="stack" style="--gap:20px">
          <ol class="stepper">
            @for (st of flow; track st) {
              <li [class.done]="idx(e.status) > $index" [class.cur]="e.status === st">
                <span class="dot">@if (idx(e.status) > $index) { <vc-icon name="check" [size]="12" /> } @else { {{ $index + 1 }} }</span>
                <span class="sl">{{ step(st).label }}</span>
              </li>
            }
          </ol>

          @if (e.status !== 'resolved' && canManage()) {
            <div class="next card card-pad">
              <div class="row"><strong>Next step: {{ step(next(e)!).label }}</strong><span class="spacer"></span><span class="small subtle">{{ step(next(e)!).hint }}</span></div>
              <div class="field"><label for="mn">Note for the audit trail <span class="subtle">(optional)</span></label>
                <input id="mn" class="input" [(ngModel)]="moveNote" placeholder="e.g. Visited the field with the farmer on 12 Sep" /></div>
              @if (next(e) === 'resolved') {
                <div class="field"><label for="mr">Resolution</label>
                  <textarea id="mr" class="input" rows="3" [(ngModel)]="moveResolution" placeholder="How was the risk resolved? What changed on the ground?"></textarea>
                  <span class="hint">Required. Resolved events can't be edited afterwards.</span></div>
              }
              @if (moveError()) { <vc-error title="Status not changed" [message]="moveError()!" /> }
              <div class="row" style="justify-content:flex-end"><button class="btn btn-primary" [disabled]="moving() || (next(e) === 'resolved' && !moveResolution.trim())" (click)="move(e)">
                <vc-icon name="arrow-right" />{{ step(next(e)!).verb }}</button></div>
            </div>
          }

          @if (e.status === 'resolved' && e.resolution) {
            <vc-callout tone="ok" icon="check-circle"><strong>Resolution</strong><p style="margin-top:4px">{{ e.resolution }}</p></vc-callout>
          }

          @if (editing()) {
            <form class="form-grid" (ngSubmit)="saveEdit(e)" id="riskEdit">
              <div class="field"><label for="es">Severity</label>
                <select id="es" class="input" name="es" [(ngModel)]="ef.severity"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              <div class="field"><label for="ei">Estimated impact (tCO₂e)</label><input id="ei" type="number" min="0" step="0.01" class="input num" name="ei" [(ngModel)]="ef.impact" /></div>
              <div class="field span-2"><label for="ed">Description</label><textarea id="ed" class="input" name="ed" rows="4" [(ngModel)]="ef.description"></textarea></div>
              @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
              <div class="span-2 row" style="justify-content:flex-end">
                <button class="btn btn-ghost" type="button" (click)="editing.set(false)">Cancel</button>
                <button class="btn btn-primary" type="submit" [disabled]="saving()">{{ saving() ? 'Saving…' : 'Save changes' }}</button>
              </div>
            </form>
          } @else {
            <dl class="kv">
              <dt>Severity</dt><dd><span class="sevb" [class]="'s-' + e.severity">{{ e.severity | titlecase }}</span></dd>
              <dt>Estimated impact</dt><dd class="num">{{ e.estimated_impact_t === null ? 'Not estimated yet' : (e.estimated_impact_t | num: 2) + ' tCO₂e' }}</dd>
              <dt>Description</dt><dd>{{ e.description }}</dd>
              <dt>Evidence files</dt><dd>{{ e.evidence_ids.length || 'None attached' }}</dd>
              <dt>Recorded</dt><dd>{{ e.created_at | day: true }}</dd>
              <dt>Last change</dt><dd>{{ e.updated_at | day: true }}</dd>
            </dl>
            @if (canManage() && e.status !== 'resolved') {
              <div><button class="btn btn-secondary btn-sm" (click)="startEdit(e)"><vc-icon name="pencil" [size]="14" />Edit details</button></div>
            }
          }
        </div>
      }
    </vc-modal>
  `,
  styles: [`
    .sum{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:16px;margin-bottom:20px}
    @media (max-width:1100px){.sum{grid-template-columns:1fr}}
    .bars{display:flex;flex-direction:column;gap:14px}
    .br{display:grid;grid-template-columns:220px 1fr 130px;gap:14px;align-items:center}
    @media (max-width:800px){.br{grid-template-columns:1fr}}
    .bl{font-size:13px;color:var(--stone-700)}
    .bt{height:14px;border-radius:7px;background:var(--sand-100);overflow:hidden}
    .bf{display:block;height:100%;border-radius:7px;transition:width .4s}
    .bf.imp{background:var(--amber-600)} .bf.imp.over{background:var(--red-600)} .bf.buf{background:var(--forest-500)}
    .br strong{text-align:right;font-size:16px} .br small{font-size:11.5px;color:var(--text-3);font-weight:500}
    .msg{display:flex;gap:8px;align-items:center;margin-top:16px;padding:10px 12px;border-radius:8px;background:var(--forest-50);color:var(--forest-800);font-weight:500;font-size:13.5px}
    .msg.bad{background:var(--danger-soft);color:var(--red-600)}
    .expl{margin-top:10px}
    .big{font-size:24px;font-weight:600}
    .sev{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
    .sv{display:flex;flex-direction:column;padding:8px 12px;border-radius:8px;background:var(--stone-100)}
    .sv span{font-size:12px;color:var(--text-2)} .sv strong{font-size:18px}
    .sv.s-high{background:var(--red-100)} .sv.s-high strong{color:var(--red-600)}
    .sv.s-medium{background:var(--amber-100)} .sv.s-medium strong{color:var(--amber-600)}
    .kinds{list-style:none;margin:0 0 10px;padding:0;display:flex;flex-direction:column;gap:8px}
    .kinds li{display:grid;grid-template-columns:16px 130px 1fr 28px;gap:8px;align-items:center;font-size:13px;color:var(--stone-700)}
    .kb{height:6px;border-radius:3px;background:var(--sand-100);overflow:hidden} .kb span{display:block;height:100%;background:var(--stone-400);border-radius:3px}
    .kinds strong{text-align:right}
    .filters{display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap}
    .seg{display:inline-flex;background:var(--surface);border:1px solid var(--border-strong);border-radius:8px;padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 13px var(--font);padding:6px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer;display:inline-flex;gap:6px;align-items:center}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{font-size:11px;color:var(--text-3)}
    .kf{width:200px}
    .ev{display:flex;flex-direction:column;max-width:420px}
    .ki{display:inline-flex;align-items:center;gap:6px;font-weight:500}
    .sevb{display:inline-block;font-size:12px;font-weight:500;padding:2px 8px;border-radius:4px;background:var(--stone-100);color:var(--stone-600)}
    .sevb.s-high{background:var(--red-100);color:var(--red-600)} .sevb.s-medium{background:var(--amber-100);color:var(--amber-600)}
    .u{font-size:11px;color:var(--text-3)}
    .flow{display:flex;align-items:center;gap:4px}
    .fd{width:18px;height:5px;border-radius:3px;background:var(--sand-200)} .fd.done{background:var(--forest-500)}
    .flow .small{margin-left:6px;color:var(--stone-700)}
    .kgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
    .kopt{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border-strong);border-radius:7px;cursor:pointer;font-size:13px;color:var(--stone-700)}
    .kopt input{display:none} .kopt.on{border-color:var(--forest-500);background:var(--forest-50);color:var(--forest-800)}
    .unit{display:flex;align-items:center;gap:8px} .unit span{font-size:13px;color:var(--text-2)}
    .stepper{list-style:none;margin:0;padding:0;display:flex;gap:0}
    .stepper li{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;position:relative;font-size:12px;color:var(--text-3)}
    .stepper li:not(:last-child)::after{content:'';position:absolute;top:12px;left:calc(50% + 16px);right:calc(-50% + 16px);height:2px;background:var(--sand-200)}
    .stepper li.done:not(:last-child)::after{background:var(--forest-400)}
    .stepper .dot{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;border:2px solid var(--sand-300);background:var(--surface);font:600 11px var(--mono);color:var(--text-3)}
    .stepper li.done .dot{background:var(--forest-500);border-color:var(--forest-500);color:#fff}
    .stepper li.cur .dot{border-color:var(--forest-600);color:var(--forest-700);box-shadow:var(--focus)}
    .stepper li.cur .sl{color:var(--stone-900);font-weight:600}
    .next{display:flex;flex-direction:column;gap:12px;background:var(--surface-2)}
  `],
})
export class RiskPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  ctx = inject(ProjectContext);

  summary = new Remote<Summary>();
  events = new Remote<RiskEvent[]>();
  fields = new Remote<FieldLite[]>();
  status = signal('active');
  kind = signal('');
  kinds = KINDS;
  flow = FLOW;
  today = isoDate(new Date());
  canManage = computed(() => this.auth.can('risk.manage'));
  statusFilters = [
    { key: 'active', label: 'Not resolved' }, { key: 'open', label: 'Open' }, { key: 'assessing', label: 'Assessing' },
    { key: 'action', label: 'Action' }, { key: 'resolved', label: 'Resolved' }, { key: '', label: 'All' },
  ];
  private fieldMap = computed(() => new Map((this.fields.data() ?? []).map(f => [f.id, f.code])));
  rows = computed(() => (this.events.data() ?? []).filter(e =>
    (this.status() === '' || (this.status() === 'active' ? e.status !== 'resolved' : e.status === this.status())) &&
    (!this.kind() || e.kind === this.kind())));

  createOpen = signal(false);
  detailOpen = signal(false);
  sel = signal<RiskEvent | null>(null);
  editing = signal(false);
  saving = signal(false);
  moving = signal(false);
  formError = signal<string | null>(null);
  moveError = signal<string | null>(null);
  cf = this.blank();
  ef = { severity: 'medium', impact: null as number | null, description: '' };
  moveNote = '';
  moveResolution = '';

  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => { if (pid) this.load(pid); });
    });
  }

  load(pid = this.ctx.currentId()!, keep = false) {
    this.summary.load(this.api.get<Summary>(`/projects/${pid}/risk/summary`), keep);
    this.events.load(this.api.get<RiskEvent[]>('/risk-events', { project_id: pid }), keep);
    if (!keep) this.fields.load(this.api.get<Page<FieldLite>>('/fields', { project_id: pid, limit: 500 }).pipe(map(r => r.items)));
  }

  private blank() {
    return { kind: 'drought', occurred_on: isoDate(new Date()), severity: 'medium', field_id: '', impact: null as number | null, description: '' };
  }

  w(v: number, s: Summary) {
    const max = Math.max(s.estimated_impact_t, s.buffer_t_co2e, 1e-9);
    return (v / max) * 100;
  }
  kindRows(s: Summary) {
    const entries = Object.entries(s.open_by_kind).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map(e => e[1]), 1);
    return entries.map(([k, n]) => ({ key: k, n, w: (n / max) * 100, label: this.kindLabel(k), icon: this.kindIcon(k) }));
  }
  countStatus(k: string) {
    const all = this.events.data() ?? [];
    return all.filter(e => k === '' || (k === 'active' ? e.status !== 'resolved' : e.status === k)).length;
  }
  kindLabel(k: string) { return KINDS.find(x => x.key === k)?.label ?? k; }
  kindIcon(k: string) { return KINDS.find(x => x.key === k)?.icon ?? 'alert'; }
  fieldCode(id: string | null) { return id ? this.fieldMap().get(id) ?? 'Field' : 'Whole project'; }
  idx(s: string) { return FLOW.indexOf(s as (typeof FLOW)[number]); }
  step(s: string) { return STEP[s]; }
  next(e: RiskEvent) { return FLOW[this.idx(e.status) + 1] ?? null; }

  openCreate() {
    this.cf = this.blank();
    this.formError.set(null);
    this.createOpen.set(true);
  }

  create() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.saving.set(true);
    this.formError.set(null);
    this.api.post<RiskEvent>('/risk-events', {
      project_id: pid, kind: this.cf.kind, occurred_on: this.cf.occurred_on, severity: this.cf.severity,
      field_id: this.cf.field_id || null, description: this.cf.description.trim(),
      estimated_impact_t: this.cf.impact === null || (this.cf.impact as unknown) === '' ? null : Number(this.cf.impact),
    }).subscribe({
      next: e => {
        this.saving.set(false);
        this.createOpen.set(false);
        this.toast.success('Risk event recorded', `${this.kindLabel(e.kind)} on ${this.fieldCode(e.field_id)}.`);
        this.load(pid, true);
      },
      error: (e: ApiError) => { this.saving.set(false); this.formError.set(e.message); },
    });
  }

  openDetail(e: RiskEvent) {
    this.sel.set(e);
    this.editing.set(false);
    this.moveNote = '';
    this.moveResolution = '';
    this.moveError.set(null);
    this.formError.set(null);
    this.detailOpen.set(true);
  }

  startEdit(e: RiskEvent) {
    this.ef = { severity: e.severity, impact: e.estimated_impact_t, description: e.description };
    this.formError.set(null);
    this.editing.set(true);
  }

  saveEdit(e: RiskEvent) {
    this.saving.set(true);
    this.formError.set(null);
    const impact = this.ef.impact === null || (this.ef.impact as unknown) === '' ? null : Number(this.ef.impact);
    this.api.patch<RiskEvent>(`/risk-events/${e.id}`, { severity: this.ef.severity, description: this.ef.description.trim(), estimated_impact_t: impact }).subscribe({
      next: r => { this.saving.set(false); this.editing.set(false); this.sel.set(r); this.toast.success('Risk event updated'); this.load(undefined, true); },
      error: (err: ApiError) => { this.saving.set(false); this.formError.set(err.message); },
    });
  }

  move(e: RiskEvent) {
    const to = this.next(e);
    if (!to) return;
    this.moving.set(true);
    this.moveError.set(null);
    this.api.post<RiskEvent>(`/risk-events/${e.id}/status`, {
      status: to, note: this.moveNote.trim(), resolution: to === 'resolved' ? this.moveResolution.trim() : null,
    }).subscribe({
      next: r => {
        this.moving.set(false);
        this.sel.set(r);
        this.moveNote = '';
        this.moveResolution = '';
        this.toast.success(`Moved to ${STEP[to].label.toLowerCase()}`);
        this.load(undefined, true);
      },
      error: (err: ApiError) => { this.moving.set(false); this.moveError.set(err.message); },
    });
  }
}
