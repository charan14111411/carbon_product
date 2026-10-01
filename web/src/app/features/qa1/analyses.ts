import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, Hash, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { sci, uncPct } from '../mrv-shared/stats';
import { ApiProblems, DraftTerm, Eq, PublishedTerms, Ref } from '../mrv-shared/ui';
import { Analysis, POOL_LABEL, POOL_SHORT, PoolResult, Qa1Model, RunImport, TrueUpState, modelLabel, practiceLabel, ver } from './qa1.types';

/** QA1 analyses: a frozen quantification for a period (Eq. 46/47, 54, 58 and the §8.6.1 uncertainty) → draft terms. */
@Component({
  selector: 'vc-qa1-analyses',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Hash, Modal, ApiProblems, Eq, Ref, PublishedTerms, NumPipe, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="layout">
      <!-- list -->
      <aside class="card side">
        <div class="card-head"><h3>Analyses</h3>
          @if (canRun()) { <button class="btn btn-primary btn-sm" [disabled]="!imports().length" (click)="startNew()"><vc-icon name="plus" [size]="14" />New</button> }
        </div>
        @if (!analyses().length) {
          <vc-empty icon="sigma" title="No analyses yet" [text]="imports().length ? 'Choose a period and the imports to use.' : 'Import model runs first.'" />
        } @else {
          <ul class="al">
            @for (a of sorted(); track a.id) {
              <li [class.on]="a.id === selectedId()" (click)="selectedId.set(a.id)" tabindex="0" (keydown.enter)="selectedId.set(a.id)">
                <div class="r1"><strong>{{ a.period_label }}</strong>
                  @if (a.published_term_ids.length) { <vc-badge status="published" /> } @else { <vc-badge status="draft">Not published</vc-badge> }</div>
                <div class="subtle small">{{ a.period_start | day }} – {{ a.period_end | day }}</div>
                <div class="subtle small">{{ a.method === 'monte_carlo' ? 'Monte Carlo' : 'Analytical' }} · {{ poolList(a) }} · {{ a.created_at | ago }}</div>
              </li>
            }
          </ul>
        }
      </aside>

      <!-- detail -->
      <div class="main">
        @if (selected(); as a) {
          <section class="card head">
            <div class="hh">
              <div>
                <div class="eyebrow">Period {{ a.period_label }} · {{ a.period_start | day }} – {{ a.period_end | day }}</div>
                <h2>{{ a.results.model.name }} · {{ ver(a.results.model.version) }} <span class="rev">&nbsp;rev {{ a.results.model.revision }}</span></h2>
                <div class="meta small muted">
                  <span>{{ a.method === 'monte_carlo' ? 'Monte Carlo (Eq. 65–69)' : 'Analytical (Eq. 60–64)' }}</span>
                  @if (a.results.mc_draws) { <span>L = {{ a.results.mc_draws }}</span> }
                  @if (a.seed !== null) { <span>seed {{ a.seed }}</span> }
                  <span>{{ a.results.period_years | num: 3 }} credited years</span>
                  <span>{{ a.import_ids.length }} import{{ a.import_ids.length === 1 ? '' : 's' }}</span>
                  <span>by {{ people.name(a.created_by, 'Unknown') }}</span>
                </div>
              </div>
              <div class="act">
                <vc-dc cls="MODELLED" />
                @if (!a.published_term_ids.length && canRun()) {
                  <button class="btn btn-primary" [disabled]="busy() || trueupProblems(a).length > 0" (click)="publish(a)"><vc-icon name="send" />{{ busy() ? 'Publishing…' : 'Publish as draft terms' }}</button>
                }
              </div>
            </div>
            <div class="fp"><span class="subtle small">Analysis fingerprint</span><vc-hash [value]="a.sha256" /></div>
          </section>

          @if (trueupProblems(a).length) {
            <vc-callout tone="warn" icon="calendar-clock" class="mb">
              <strong>Can't be published until the true-up is resolved.</strong>
              <ul class="wl">@for (p of trueupProblems(a); track p.code) { <li>{{ p.message }}</li> }</ul>
              <vc-ref>VM0042 §8.6.1.3 p.74–75</vc-ref>
            </vc-callout>
          }
          @if (published(); as terms) { <div class="mb"><vc-published-terms [terms]="terms" /></div> }
          @else if (a.published_term_ids.length) {
            <vc-callout tone="ok" icon="check-circle" class="mb">Published as {{ a.published_term_ids.length }} draft term{{ a.published_term_ids.length === 1 ? '' : 's' }}. A colleague approves them under Calculations → Decided terms. To publish again, compute a new analysis.</vc-callout>
          }
          <vc-api-problems [error]="pubErr()" title="Couldn't publish" />

          @for (p of pools(a); track p.pool) {
            <section class="card pool">
              <div class="card-head">
                <h3>{{ poolLabel[p.pool] }}</h3>
                @for (e of p.equations; track e) { <vc-eq>{{ e }}</vc-eq> }
              </div>
              <div class="tiles">
                <div class="tile"><span>Project</span><strong class="num">{{ p.project_total_t_co2e | num: 2 }}</strong><em>tCO₂e</em></div>
                <div class="tile"><span>Baseline</span><strong class="num">{{ p.baseline_total_t_co2e | num: 2 }}</strong><em>tCO₂e</em></div>
                <div class="tile hi"><span>Reduction / removal</span><strong class="num">{{ p.reduction_total_t_co2e | num: 2 }}</strong><em>tCO₂e</em></div>
                <div class="tile"><span>Variance of total</span><strong class="num">{{ sci(p.uncertainty.variance_total) }}</strong><em>(tCO₂e)²</em></div>
                <div class="tile"><span>df (Welch)</span><strong class="num">{{ p.uncertainty.df | num: 1 }}</strong><em>&nbsp;</em></div>
                <div class="tile"><span>UNC</span><strong class="num">{{ unc(a, p) | num: 2 }}</strong><em>% · Eq. 74</em></div>
              </div>

              <div class="table-wrap">
                <table class="table">
                  <thead><tr>
                    <th>Zone</th><th class="num">Area <span class="u">ha</span></th><th class="num">n</th>
                    <th class="num">Mean <span class="u">tCO₂e/ha</span></th>
                    <th class="num">s²<sub>sampling</sub></th>
                    @if (a.method === 'analytical') { <th class="num">s²<sub>model,h</sub></th><th>Model error from</th> }
                    @else { <th class="num">τ̂<sub>h</sub> <span class="u">tCO₂e</span></th> }
                    <th></th>
                  </tr></thead>
                  <tbody>
                    @for (h of strata(p); track h.code) {
                      <tr>
                        <td><code>{{ h.code }}</code></td>
                        <td class="num">{{ h.area_ha | num: 2 }}</td>
                        <td class="num">{{ h.n }}</td>
                        <td class="num">{{ (h.mean_t_co2e_ha ?? h.mu_h) | num: 4 }}</td>
                        <td class="num">{{ sci(h.s2_sampling) }}</td>
                        @if (a.method === 'analytical') {
                          <td class="num">{{ sci(h.s2_model_h) }}</td>
                          <td class="small">@if (p.model_error_by_stratum[h.code]; as me) { {{ practice(me.practice_category) }} · n {{ me.n_sites }} <span class="subtle">· {{ me.how }}</span> } @else { — }</td>
                        } @else { <td class="num">{{ h.tau_h | num: 2 }}</td> }
                        <td class="nowrap"><button class="btn btn-ghost btn-sm" (click)="togglePts(p.pool + h.code)">{{ openPts().has(p.pool + h.code) ? 'Hide' : 'Points' }}</button></td>
                      </tr>
                      @if (openPts().has(p.pool + h.code)) {
                        <tr class="pts"><td [attr.colspan]="a.method === 'analytical' ? 8 : 7">
                          <div class="pgrid">
                            @for (pt of p.points[h.code] ?? []; track pt.site_code) {
                              <div class="pt"><code>{{ pt.site_code }}</code><span class="num">Δ {{ pt.reduction_t_co2e_ha | num: 3 }}</span><span class="subtle small num">wp {{ pt.project_t_co2e_ha | num: 3 }} · bsl {{ pt.baseline_t_co2e_ha | num: 3 }}</span></div>
                            }
                          </div>
                        </td></tr>
                      }
                    }
                  </tbody>
                  <tfoot><tr>
                    <td><strong>Project</strong></td><td class="num"><strong>{{ p.uncertainty.total_area_ha | num: 2 }}</strong></td><td></td>
                    <td class="num"><strong>{{ p.uncertainty.mean_t_co2e_ha | num: 4 }}</strong></td>
                    <td class="num" title="Eq. 62 / 68">{{ sci(p.uncertainty.s2_sampling) }}</td>
                    @if (a.method === 'analytical') { <td class="num" title="Eq. 64">{{ sci(p.uncertainty.s2_model) }}</td><td class="small">s²<sub>mean</sub> {{ sci(p.uncertainty.s2_mean) }} <span class="subtle">(Eq. 63)</span></td> }
                    @else { <td class="small">s²<sub>model</sub> {{ sci(p.uncertainty.s2_model) }} · s²<sub>mean</sub> {{ sci(p.uncertainty.s2_mean) }} <span class="subtle">(Eq. 68–69)</span></td> }
                    <td></td>
                  </tr></tfoot>
                </table>
              </div>
              <div class="card-foot foot small subtle">
                {{ p.unit_note }}.
                @if (p.draws_source) { Draws: {{ p.draws_source }}. }
                @if (p.uncertainty.mc_error_factor) { MC error factor √(1+1/L) = {{ p.uncertainty.mc_error_factor | num: 5 }}. }
                UNC uses t at {{ conf(a) * 100 | num: 1 }} % one-sided with the Welch df.
              </div>
            </section>
          }
        } @else {
          <section class="card"><vc-empty icon="sigma" title="Choose an analysis" text="Or start a new one for a monitoring period." /></section>
        }
      </div>
    </div>

    <!-- new analysis -->
    <vc-modal [(open)]="formOpen" title="New QA1 analysis" subtitle="Freezes the model, imports, rules and results for one period." width="620px">
      <div class="stack" style="--gap:14px">
        <div class="form-grid">
          <div class="field"><label for="na-l">Period label</label><input id="na-l" class="input" [(ngModel)]="f.period_label" maxlength="40" placeholder="e.g. 2025-26" />
            <span class="hint">Must match the calculation's period label.</span></div>
          <div class="field"><label for="na-seed">Monte Carlo seed <span class="subtle">(optional)</span></label>
            <input id="na-seed" class="input num" type="number" min="0" step="1" [(ngModel)]="f.seed" placeholder="e.g. 20260101" />
            <span class="hint">Needed for Monte Carlo without imported draws, so the result can be reproduced.</span></div>
          <div class="field"><label for="na-s">Period start</label><input id="na-s" type="date" class="input" [(ngModel)]="f.period_start" /></div>
          <div class="field"><label for="na-e">Period end</label><input id="na-e" type="date" class="input" [(ngModel)]="f.period_end" /></div>
        </div>
        <div class="field"><label>Imports to use</label>
          <div class="picks">
            @for (i of imports(); track i.id) {
              <label class="pick" [class.on]="f.import_ids.includes(i.id)">
                <input type="checkbox" [checked]="f.import_ids.includes(i.id)" (change)="toggleImport(i.id)" />
                <div><strong>{{ i.label }}</strong><span class="subtle small">{{ modelName(i.model_id) }} · {{ i.first_year }}–{{ i.last_year }} · {{ i.site_codes.length }} points · {{ poolsOf(i) }}{{ i.mc_draws ? ' · L ' + i.mc_draws : '' }}</span></div>
              </label>
            }
          </div>
          <span class="hint">All imports must come from the same approved model. The rules decide which pools use QA1 and which uncertainty method applies.</span></div>
        <vc-api-problems [error]="err()" title="Couldn't compute the analysis" />
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="compute()"><vc-icon name="play" />{{ busy() ? 'Computing…' : 'Compute' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:16px;align-items:start}
    .side{position:sticky;top:76px}
    .al{list-style:none;margin:0;padding:6px;max-height:70vh;overflow:auto}
    .al li{padding:10px 12px;border-radius:8px;cursor:pointer;display:flex;flex-direction:column;gap:2px;border:1px solid transparent}
    .al li:hover{background:var(--sand-100)}
    .al li.on{background:var(--forest-50);border-color:var(--forest-200)}
    .r1{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .main{display:flex;flex-direction:column;gap:16px;min-width:0}
    .head{padding:18px 20px}
    .hh{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}
    .hh > div:first-child{flex:1;min-width:240px}
    .eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--forest-500);margin-bottom:4px}
    .rev{font-size:13px;font-weight:500;color:var(--text-3)}
    .meta{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:4px}
    .act{display:flex;gap:10px;align-items:center}
    .fp{display:flex;align-items:center;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
    .mb{display:block} vc-callout.mb{display:flex}
    .wl{margin:6px 0 8px;padding-left:18px;font-size:13px}
    .pool .card-head{flex-wrap:wrap}
    .tiles{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));border-bottom:1px solid var(--border)}
    .tile{display:flex;flex-direction:column;gap:2px;padding:14px 16px;border-right:1px solid var(--stone-100)}
    .tile:last-child{border-right:0}
    .tile span{font-size:12px;color:var(--text-2)} .tile strong{font-size:18px;font-weight:600;letter-spacing:-.01em} .tile em{font-style:normal;font-size:11.5px;color:var(--text-3)}
    .tile.hi{background:var(--forest-50)} .tile.hi strong{color:var(--forest-700)}
    .u{font-size:11px;color:var(--text-3);font-weight:400}
    tfoot td{padding:11px 14px;background:var(--surface-2);border-top:1px solid var(--border)}
    tr.pts td{background:var(--sand-50)}
    .pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px}
    .pt{display:flex;flex-direction:column;padding:6px 10px;border-radius:6px;background:var(--surface);border:1px solid var(--border)}
    .foot{justify-content:flex-start;flex-wrap:wrap}
    .picks{display:flex;flex-direction:column;gap:6px;max-height:280px;overflow:auto}
    .pick{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;background:var(--surface)}
    .pick.on{border-color:var(--forest-400);background:var(--forest-50)}
    .pick input{margin-top:3px;accent-color:var(--primary)}
    .pick div{display:flex;flex-direction:column}
    @media (max-width: 1200px){ .tiles{grid-template-columns:repeat(3,minmax(0,1fr))} .tile:nth-child(3){border-right:0} .tile:nth-child(-n+3){border-bottom:1px solid var(--stone-100)} }
    @media (max-width: 1000px){ .layout{grid-template-columns:minmax(0,1fr)} .side{position:static} .al{max-height:260px} }
    @media (max-width: 560px){ .tiles{grid-template-columns:repeat(2,minmax(0,1fr))} }
  `],
})
export class Qa1Analyses {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);
  projectId = input.required<string>();
  imports = input<RunImport[]>([]);
  models = input<Qa1Model[]>([]);
  changed = output<void>();

  poolLabel = POOL_LABEL;
  practice = practiceLabel;
  sci = sci;
  ver = ver;
  analyses = signal<Analysis[]>([]);
  selectedId = signal<string | null>(null);
  formOpen = signal(false);
  busy = signal(false);
  err = signal<ApiError | null>(null);
  pubErr = signal<ApiError | null>(null);
  published = signal<DraftTerm[] | null>(null);
  openPts = signal(new Set<string>());
  f = this.blank();

  canRun = computed(() => this.auth.can('calc.run'));
  sorted = computed(() => [...this.analyses()].sort((a, b) => b.created_at.localeCompare(a.created_at)));
  selected = computed(() => this.analyses().find(a => a.id === this.selectedId()) ?? this.sorted()[0] ?? null);

  constructor() {
    this.people.load();
    effect(() => { const pid = this.projectId(); untracked(() => { if (pid) this.load(); }); });
    effect(() => { this.selectedId(); untracked(() => { this.published.set(null); this.pubErr.set(null); }); });
  }

  load() {
    this.api.get<Analysis[]>(`/projects/${this.projectId()}/qa1/analyses`).subscribe({
      next: r => this.analyses.set(r),
      error: (e: ApiError) => this.toast.apiError(e, "Couldn't load QA1 analyses"),
    });
  }

  private blank() {
    const y = new Date().getFullYear() - 1;
    return { period_label: `${y}`, period_start: `${y}-01-01`, period_end: `${y}-12-31`, import_ids: [] as string[], seed: null as number | null };
  }
  startNew() {
    this.f = this.blank();
    const latest = [...this.imports()].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    if (latest) this.f.import_ids = [latest.id];
    this.err.set(null);
    this.formOpen.set(true);
  }
  toggleImport(id: string) {
    const l = this.f.import_ids;
    this.f.import_ids = l.includes(id) ? l.filter(x => x !== id) : [...l, id];
  }
  valid() { return this.f.period_label.trim() && this.f.period_start && this.f.period_end && this.f.period_end > this.f.period_start && this.f.import_ids.length > 0; }
  modelName(id: string) { return modelLabel(this.models().find(m => m.id === id)); }
  poolsOf(i: RunImport) { return i.pools.map(p => POOL_SHORT[p]).join(', '); }
  poolList(a: Analysis) { return Object.keys(a.results?.pools ?? {}).map(p => POOL_SHORT[p] ?? p).join(', '); }
  pools(a: Analysis): PoolResult[] { return Object.values(a.results?.pools ?? {}); }
  strata(p: PoolResult) { return Object.entries(p.uncertainty.by_stratum ?? {}).map(([code, v]) => ({ code, ...v })); }
  conf(a: Analysis) { return Number(a.rules_used?.['uncertainty_confidence'] ?? 0.667) || 0.667; }
  unc(a: Analysis, p: PoolResult) { return uncPct(p.reduction_total_t_co2e, p.uncertainty.variance_total, p.uncertainty.df, this.conf(a)); }
  trueupProblems(a: Analysis) { return ((a.trueup as TrueUpState)?.problems ?? []); }
  togglePts(k: string) {
    const s = new Set(this.openPts());
    s.has(k) ? s.delete(k) : s.add(k);
    this.openPts.set(s);
  }

  compute() {
    this.busy.set(true);
    this.err.set(null);
    const body = { period_label: this.f.period_label.trim(), period_start: this.f.period_start, period_end: this.f.period_end, import_ids: this.f.import_ids, seed: this.f.seed === null || (this.f.seed as unknown) === '' ? null : Number(this.f.seed) };
    this.api.post<Analysis>(`/projects/${this.projectId()}/qa1/analyses`, body).subscribe({
      next: a => {
        this.busy.set(false);
        this.formOpen.set(false);
        this.analyses.update(l => [...l, a]);
        this.selectedId.set(a.id);
        this.toast.success('Analysis computed', 'Review the results, then publish them as draft terms.');
      },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }

  publish(a: Analysis) {
    this.busy.set(true);
    this.pubErr.set(null);
    this.api.post<{ analysis: Analysis; terms: DraftTerm[] }>(`/qa1/analyses/${a.id}/publish`).subscribe({
      next: r => {
        this.busy.set(false);
        this.analyses.update(l => l.map(x => (x.id === a.id ? r.analysis : x)));
        this.published.set(r.terms);
        this.toast.success('Published as draft terms', 'A colleague approves them under Calculations → Decided terms.');
        this.changed.emit();
      },
      error: (e: ApiError) => { this.busy.set(false); this.pubErr.set(e); },
    });
  }
}
