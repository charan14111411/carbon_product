import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, Empty } from '../../ui/kit';
import { human, sci, uncPct } from '../mrv-shared/stats';
import { TermHistory } from '../mrv-shared/term-history';
import { ApiProblems, DraftTerm, Eq, PublishedTerms, Ref } from '../mrv-shared/ui';
import { Allometry, BCampaign, WoodyResult } from './biomass.types';

/** Preview ΔC_TREE + ΔC_SHRUB (Eq. 48–51) between two campaigns, then publish a draft woody-biomass term. */
@Component({
  selector: 'vc-biomass-compute',
  imports: [FormsModule, Icon, Callout, DataClass, Empty, ApiProblems, Eq, Ref, PublishedTerms, TermHistory, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card form">
      <div class="card-head"><h3>Stock change between two campaigns</h3><vc-ref>VM0042 §8.5.1 Eq. 48–51 p.59–60</vc-ref></div>
      <div class="card-body">
        <div class="fg">
          <div class="field"><label>Scenario</label>
            <div class="seg"><button type="button" [class.on]="f.scenario === 'project'" (click)="f.scenario = 'project'">Project</button><button type="button" [class.on]="f.scenario === 'baseline'" (click)="f.scenario = 'baseline'">Baseline</button></div></div>
          <div class="field"><label for="wc-a">From campaign</label>
            <select id="wc-a" class="input" [(ngModel)]="f.from_campaign_id">
              <option value="">Earlier…</option>
              @for (c of sortedCampaigns(); track c.id) { <option [value]="c.id">{{ c.code }} · {{ c.measured_on | day }}</option> }
            </select></div>
          <div class="field"><label for="wc-b">To campaign</label>
            <select id="wc-b" class="input" [(ngModel)]="f.to_campaign_id">
              <option value="">Later…</option>
              @for (c of sortedCampaigns(); track c.id) { <option [value]="c.id">{{ c.code }} · {{ c.measured_on | day }}</option> }
            </select></div>
          <div class="field"><label for="wc-l">Period label</label><input id="wc-l" class="input" [(ngModel)]="f.period_label" maxlength="40" /></div>
          <div class="field"><label for="wc-s">Period start</label><input id="wc-s" type="date" class="input" [(ngModel)]="f.period_start" /></div>
          <div class="field"><label for="wc-e">Period end</label><input id="wc-e" type="date" class="input" [(ngModel)]="f.period_end" /></div>
        </div>
        <div class="acts">
          <span class="subtle small">The preview saves nothing. Publishing freezes the computation and creates a draft term for a colleague to approve.</span>
          <span class="spacer"></span>
          <button class="btn btn-secondary" [disabled]="busy() || !valid()" (click)="preview()"><vc-icon name="play" />{{ busy() && !publishing() ? 'Computing…' : 'Preview' }}</button>
          @if (canPublish()) { <button class="btn btn-primary" [disabled]="busy() || !result()" (click)="publish()"><vc-icon name="send" />{{ publishing() ? 'Publishing…' : 'Publish draft term' }}</button> }
        </div>
        @if (err()) { <div class="mt"><vc-api-problems [error]="err()" [title]="publishing() ? 'Couldn\\'t publish' : 'Couldn\\'t compute'" /></div> }
        @if (published(); as t) { <div class="mt"><vc-published-terms [terms]="t" /></div> }
      </div>
    </section>

    @if (result(); as r) {
      <section class="card res">
        <div class="card-head"><h3>{{ r.scenario === 'project' ? 'Project' : 'Baseline' }} trees & shrubs · {{ r.from_campaign.code }} → {{ r.to_campaign.code }}</h3>
          @for (e of r.equations; track e) { <vc-eq>{{ e }}</vc-eq> }<vc-dc cls="CALCULATED" /></div>
        <div class="tiles">
          <div class="tile hi"><span>Period value</span><strong class="num">{{ r.value_t_co2e | num: 2 }}</strong><em>tCO₂e · {{ r.credited_years | num: 2 }} yr credited</em></div>
          <div class="tile"><span>Annual change</span><strong class="num">{{ r.annual_t_co2e | num: 2 }}</strong><em>tCO₂e/yr</em></div>
          <div class="tile"><span>Trees ΔC_TREE</span><strong class="num">{{ r.tree_annual_t_co2e | num: 2 }}</strong><em>tCO₂e/yr</em></div>
          <div class="tile"><span>Shrubs ΔC_SHRUB</span><strong class="num">{{ r.shrubs_included ? (r.shrub_annual_t_co2e | num: 2) : '—' }}</strong><em>{{ r.shrubs_included ? 'tCO₂e/yr' : 'not in boundary' }}</em></div>
          <div class="tile"><span>Variance · df</span><strong class="num">{{ sci(r.variance) }}</strong><em>(tCO₂e)² · df {{ r.df === null ? '—' : (r.df | num: 1) }}</em></div>
          <div class="tile"><span>UNC</span><strong class="num">{{ unc(r) | num: 2 }}</strong><em>% · t at 66.7 %</em></div>
        </div>
        <div class="facts small muted">
          <span>Interval x = {{ r.interval_years | num: 3 }} yr</span>
          <span>Period {{ r.period_years | num: 3 }} yr</span>
          <span>Below-ground {{ r.belowground_included ? 'included' : 'excluded' }}</span>
          <span>{{ r.allometric_model_ids.length }} equation(s) · {{ r.measurement_record_ids.length }} measurement(s)</span>
          <span>Rule pack rev {{ r.rule_pack.revision }}</span>
        </div>
        @if (r.unpaired_plots.length) {
          <div class="card-body pt0"><vc-callout tone="warn" icon="circle-alert">Plots measured in only one campaign are left out: {{ r.unpaired_plots.join(', ') }}.</vc-callout></div>
        }
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>Zone</th><th class="num">Area <span class="u">ha</span></th><th class="num">Plots</th>
              <th class="num">Trees start → end <span class="u">tCO₂e/ha</span></th><th class="num">Shrubs start → end <span class="u">tCO₂e/ha</span></th>
              <th class="num">Annual <span class="u">tCO₂e/yr</span></th><th class="num">Variance</th><th class="num">df</th><th></th>
            </tr></thead>
            <tbody>
              @for (s of r.strata; track s.stratum_id) {
                <tr>
                  <td class="nowrap"><code>{{ s.stratum_code }}</code><div class="subtle small">QU {{ s.quantification_unit }}</div></td>
                  <td class="num">{{ s.area_ha | num: 2 }}</td><td class="num">{{ s.n_plots }}</td>
                  <td class="num nowrap">{{ s.tree_t_co2e_ha_start | num: 2 }} → {{ s.tree_t_co2e_ha_end | num: 2 }}</td>
                  <td class="num nowrap">{{ s.shrub_t_co2e_ha_start | num: 2 }} → {{ s.shrub_t_co2e_ha_end | num: 2 }}</td>
                  <td class="num"><strong>{{ s.tree_annual_t_co2e + s.shrub_annual_t_co2e | num: 3 }}</strong></td>
                  <td class="num">{{ sci(s.variance_annual) }}</td><td class="num">{{ s.df }}</td>
                  <td><button class="btn btn-ghost btn-sm" (click)="toggle(s.stratum_id)">{{ open().has(s.stratum_id) ? 'Hide' : 'Plots' }}</button></td>
                </tr>
                @if (open().has(s.stratum_id)) {
                  <tr class="sub"><td colspan="9">
                    @for (p of s.plots; track p.plot_id) {
                      <div class="plot">
                        <div class="ph"><code>{{ p.plot_code }}</code>
                          <span class="small">trees {{ p.tree_t_co2e_ha_start | num: 2 }} → <strong>{{ p.tree_t_co2e_ha_end | num: 2 }}</strong> tCO₂e/ha</span>
                          <span class="small subtle">shrubs {{ p.shrub_t_co2e_ha_start | num: 2 }} → {{ p.shrub_t_co2e_ha_end | num: 2 }}</span></div>
                        <table class="mini">
                          <thead><tr><th>Species</th><th class="num">DBH</th><th class="num">H</th><th class="num">n</th><th class="num">AGB/tree <span class="u">t d.m.</span></th><th class="num">Biomass/tree</th><th class="num">C <span class="u">tCO₂e</span></th><th>Equation</th></tr></thead>
                          <tbody>
                            @for (t of p.trees_end; track $index) {
                              <tr><td>{{ t.species }}</td><td class="num">{{ t.dbh_cm | num: 1 }}</td><td class="num">{{ t.height_m ?? '—' }}</td><td class="num">{{ t.count }}</td>
                                <td class="num">{{ sci(t.agb_t_dm_per_tree, 4) }}</td><td class="num">{{ sci(t.biomass_t_dm_per_tree, 4) }}</td><td class="num">{{ t.c_t_co2e | num: 3 }}</td>
                                <td class="small subtle">{{ modelName(t.model_id) }}</td></tr>
                            } @empty { <tr><td colspan="8" class="subtle small">No trees at the later campaign.</td></tr> }
                          </tbody>
                        </table>
                      </div>
                    }
                  </td></tr>
                }
              }
            </tbody>
          </table>
        </div>
        <div class="notes">
          <div class="lbl">Method notes</div>
          <ul>@for (n of r.method_notes; track $index) { <li>{{ n }}</li> }<li>{{ r.sign_convention }}.</li></ul>
          <div class="rules">@for (k of ruleKeys(r); track k) { <span class="rk"><code>{{ k }}</code> {{ ruleVal(r.rules_used[k]) }}</span> }</div>
        </div>
      </section>
    } @else if (!err()) {
      <section class="card"><vc-empty icon="tree-pine" title="No preview yet" text="Choose the scenario, two campaigns and the monitoring period, then preview the stock change." /></section>
    }

    <div class="mt"><vc-term-history [projectId]="projectId()" [terms]="['woody_biomass_project', 'woody_biomass_baseline']" [refresh]="refresh()" title="Published tree & shrub terms" /></div>
  `,
  styles: [`
    .fg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 16px}
    .seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border)}
    .seg button{height:30px;border:0;border-radius:6px;background:none;font:500 13px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .acts{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border)}
    .mt{margin-top:16px}
    .res{margin-top:16px}
    .res .card-head{flex-wrap:wrap}
    .tiles{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));border-bottom:1px solid var(--border)}
    .tile{display:flex;flex-direction:column;gap:2px;padding:14px 16px;border-right:1px solid var(--stone-100)}
    .tile:last-child{border-right:0}
    .tile span{font-size:12px;color:var(--text-2)} .tile strong{font-size:18px;font-weight:600} .tile em{font-style:normal;font-size:11.5px;color:var(--text-3)}
    .tile.hi{background:var(--forest-50)} .tile.hi strong{color:var(--forest-700)}
    .facts{display:flex;flex-wrap:wrap;gap:4px 16px;padding:10px 20px;border-bottom:1px solid var(--border)}
    .pt0{padding-top:12px;padding-bottom:0}
    .u{font-size:11px;color:var(--text-3);font-weight:400}
    tr.sub td{background:var(--sand-50)}
    .plot{padding:10px 12px;margin-bottom:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface)}
    .ph{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;margin-bottom:6px}
    .mini{width:100%;border-collapse:collapse;font-size:12.5px}
    .mini th{text-align:left;font-weight:500;color:var(--text-3);padding:4px 8px;border-bottom:1px solid var(--border)}
    .mini td{padding:4px 8px;border-bottom:1px solid var(--stone-100)}
    .mini .num{text-align:right;font-variant-numeric:tabular-nums}
    .notes{padding:14px 20px}
    .lbl{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px}
    .notes ul{margin:0 0 10px;padding-left:18px;font-size:13px;color:var(--stone-700);display:flex;flex-direction:column;gap:3px}
    .rules{display:flex;flex-wrap:wrap;gap:6px}
    .rk{font-size:12px;padding:3px 8px;border-radius:6px;background:var(--sand-100);border:1px solid var(--border)} .rk code{font-size:11px;color:var(--text-3)}
    @media (max-width: 1200px){ .tiles{grid-template-columns:repeat(3,minmax(0,1fr))} }
    @media (max-width: 900px){ .fg{grid-template-columns:1fr 1fr} }
    @media (max-width: 560px){ .fg,.tiles{grid-template-columns:1fr 1fr} }
  `],
})
export class BiomassCompute {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  projectId = input.required<string>();
  campaigns = input<BCampaign[]>([]);
  models = input<Allometry[]>([]);

  sci = sci;
  busy = signal(false);
  publishing = signal(false);
  err = signal<ApiError | null>(null);
  result = signal<WoodyResult | null>(null);
  published = signal<DraftTerm[] | null>(null);
  open = signal(new Set<string>());
  refresh = signal(0);
  f = this.blank();

  canPublish = computed(() => this.auth.can('calc.run', 'rules.edit'));
  sortedCampaigns = computed(() => [...this.campaigns()].sort((a, b) => a.measured_on.localeCompare(b.measured_on)));

  private blank() {
    const y = new Date().getFullYear() - 1;
    return { scenario: 'project' as 'project' | 'baseline', from_campaign_id: '', to_campaign_id: '', period_label: `${y}`, period_start: `${y}-01-01`, period_end: `${y}-12-31` };
  }
  constructor() {
    effect(() => {
      const c = this.sortedCampaigns();
      untracked(() => {
        if (c.length >= 2 && !this.f.from_campaign_id && !this.f.to_campaign_id) { this.f.from_campaign_id = c[c.length - 2].id; this.f.to_campaign_id = c[c.length - 1].id; }
      });
    });
  }
  valid() { const f = this.f; return f.from_campaign_id && f.to_campaign_id && f.from_campaign_id !== f.to_campaign_id && f.period_label.trim() && f.period_start && f.period_end && f.period_end >= f.period_start; }
  unc(r: WoodyResult) { return uncPct(r.value_t_co2e, r.variance, r.df); }
  toggle(id: string) { const s = new Set(this.open()); s.has(id) ? s.delete(id) : s.add(id); this.open.set(s); }
  modelName(id: string) { const m = this.models().find(x => x.id === id); return m ? `${m.species} · ${m.form_label ?? m.form}` : id.slice(0, 8); }
  ruleKeys(r: WoodyResult) { return Object.keys(r.rules_used ?? {}).filter(k => r.rules_used[k] !== null && r.rules_used[k] !== undefined); }
  ruleVal(v: unknown) { return typeof v === 'boolean' ? (v ? 'yes' : 'no') : typeof v === 'string' ? human(v) : String(v); }

  private body() { return { ...this.f, period_label: this.f.period_label.trim() }; }
  preview() {
    this.busy.set(true);
    this.publishing.set(false);
    this.err.set(null);
    this.published.set(null);
    this.api.post<WoodyResult>(`/projects/${this.projectId()}/biomass/compute`, this.body()).subscribe({
      next: r => { this.busy.set(false); this.result.set(r); },
      error: (e: ApiError) => { this.busy.set(false); this.result.set(null); this.err.set(e); },
    });
  }
  publish() {
    this.busy.set(true);
    this.publishing.set(true);
    this.err.set(null);
    this.api.post<{ term: DraftTerm; result: WoodyResult }>(`/projects/${this.projectId()}/biomass/publish-term`, this.body()).subscribe({
      next: r => {
        this.busy.set(false);
        this.publishing.set(false);
        this.result.set(r.result);
        this.published.set([r.term]);
        this.refresh.update(n => n + 1);
        this.toast.success('Draft term published', 'A colleague approves it under Calculations → Decided terms.');
      },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
}
