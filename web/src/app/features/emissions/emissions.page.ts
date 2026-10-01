import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { NumPipe, fmtNum } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { PALETTE, Chart } from '../../ui/chart';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, Empty, Loading, PageHeader, Stat, TabItem, Tabs } from '../../ui/kit';
import { Ref } from '../mrv-shared/ui';
import { Qa3Result } from '../calculations/calc.types';
import { LeakagePanel } from '../calculations/vm0042-panels';
import { EF_END_TEXT, SOURCE_ORDER, sourceLabel } from '../calculations/vm0042';

interface Breakdown extends Qa3Result {
  project_id: string; start: string; end: string; project_start_year: number;
  quantification_units: { code: string; area_ha: number; field_ids: string[] }[];
  records_used: number; total_reduction_t_co2e: number; leakage_oa_t_co2e: number;
  equations: { eq: string; label: string }[]; rule_pack: string; note: string;
}

const TIER: Record<string, string> = {
  '1': 'Tier 1 · records with evidence', '2': 'Tier 2 · management plan', '3': 'Tier 3 · farmer attestation', '4': 'Tier 4 · regional census',
};

@Component({
  selector: 'vc-emissions-page',
  imports: [FormsModule, RouterLink, PageHeader, Icon, Stat, Tabs, Loading, Empty, Callout, DataClass, Chart, LeakagePanel, NumPipe, Ref],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Emissions & leakage" eyebrow="Carbon"
      subtitle="Changing how a field is farmed changes more than its soil carbon: fuel, lime, fertiliser, livestock and residue burning all emit greenhouse gases. This page compares what the fields emitted under the old practice (baseline) with what they emit now (project), using the VM0042 default-factor equations.">
      <div actions class="period">
        <label class="small muted" for="em-s">From</label>
        <input id="em-s" type="date" class="input" [ngModel]="start()" (ngModelChange)="start.set($event)" />
        <label class="small muted" for="em-e">to</label>
        <input id="em-e" type="date" class="input" [ngModel]="end()" (ngModelChange)="end.set($event)" />
        <button class="btn btn-secondary" (click)="load()" [disabled]="loading()"><vc-icon name="refresh" />Update</button>
      </div>
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Pick a project in the top bar to see its emissions." /></section>
    } @else if (loading()) {
      <section class="card"><vc-loading [rows]="7" /></section>
    } @else if (err(); as e) {
      <section class="card blk">
        <div class="blk-h">
          <span class="bi"><vc-icon [name]="e.code === 'ACTIVITY_DATA_INCOMPLETE' ? 'clipboard' : 'alert'" [size]="20" /></span>
          <div><h3>{{ errTitle() }}</h3><p>{{ e.message }}</p></div>
          <code class="code">{{ e.code }}</code>
        </div>
        @if (missing().length) {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Field</th><th class="num">Project year</th><th>Category practised in the baseline</th><th class="num">Baseline year</th></tr></thead>
              <tbody>
                @for (m of missing().slice(0, 30); track $index) {
                  <tr><td>{{ fieldName(m.field_id) }}</td><td class="num">{{ m.year }}</td><td>{{ human(m.category) }}</td><td class="num">{{ m.baseline_year }}</td></tr>
                }
              </tbody>
            </table>
          </div>
        }
        <div class="card-foot">
          @if (e.code === 'ACTIVITY_DATA_INCOMPLETE' || e.code === 'ACTIVITY_DATA_INVALID') { <a class="btn btn-primary" routerLink="/app/baseline" [queryParams]="{ tab: 'records' }">Record activity data<vc-icon name="arrow-right" [size]="14" /></a> }
          @else if (e.code === 'RULE_MISSING' || e.code === 'RULES_NOT_APPROVED' || e.status === 409) { <a class="btn btn-primary" routerLink="/app/methodology">Review methodology rules<vc-icon name="arrow-right" [size]="14" /></a> }
          <button class="btn btn-ghost" (click)="load()">Try again</button>
        </div>
      </section>
    } @else if (data(); as d) {
      <div class="grid grid-4 stats">
        <vc-stat label="Emission reductions ΣΔE" [value]="fmt(d.total_reduction_t_co2e, 2)" unit="tCO₂e" icon="trend-down" [accent]="true" hint="Baseline minus project, all sources" />
        <vc-stat label="Baseline emissions" [value]="fmt(totals().b, 2)" unit="tCO₂e" icon="history" hint="Old practice, repeated schedule" />
        <vc-stat label="Project emissions" [value]="fmt(totals().p, 2)" unit="tCO₂e" icon="sprout" hint="Monitored project activity" />
        <vc-stat label="Leakage LE_OA" [value]="fmt(d.leakage_oa_t_co2e, 3)" unit="tCO₂e" icon="truck" hint="Imported organic amendments (Eq. 33)" />
      </div>

      <div class="meta small muted">
        <span><vc-icon name="database" [size]="13" />{{ d.records_used }} activity records</span>
        <span><vc-icon name="layers" [size]="13" />{{ d.quantification_units.length }} quantification unit(s), {{ totalArea() | num: 1 }} ha</span>
        <span><vc-icon name="scale" [size]="13" />{{ d.rule_pack }}</span>
        <span><vc-icon name="calendar" [size]="13" />Project start {{ d.project_start_year }}</span>
        @for (t of tierChips(); track t.k) { <span class="tier" [class]="'tier t' + t.k">{{ t.label }} · {{ t.n }}</span> }
      </div>

      @if (d.displacement_leakage_required) {
        <div class="disp mb">
          <span class="di"><vc-icon name="truck" [size]="20" /></span>
          <div class="dt"><strong>Displacement leakage must be quantified</strong>
            <p>Livestock fell below the look-back average and production was not shown to be kept, so project emissions use the look-back herd and LK_disp must be computed from VMD0054 records (§8.4.2 a, Eq. 36).</p></div>
          <vc-ref>VM0042 §8.4.2 p.52</vc-ref>
          <a class="btn btn-primary btn-sm" routerLink="/app/leakage" [queryParams]="{ tab: 'displacement' }">Record displacement<vc-icon name="arrow-right" [size]="14" /></a>
        </div>
      }
      @for (w of d.warnings; track $index) { <vc-callout tone="warn" icon="alert" class="mb">{{ w }}</vc-callout> }
      @if (d.skipped_sources.length) {
        <vc-callout tone="info" icon="info" class="mb">Soil N₂O ({{ skippedLabels() }}) is quantified by a validated model (QA1) in this rule pack, so it comes from an approved estimate in the calculation, not from default factors here.</vc-callout>
      }

      <vc-tabs [tabs]="tabs" [(active)]="tab" />

      @switch (tab()) {
        @case ('summary') {
          <section class="card">
            <div class="card-head"><h3>By source</h3><vc-dc cls="CALCULATED" /><span class="subtle small">{{ d.start }} to {{ d.end }} · tCO₂e</span></div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Source</th><th>Equations</th><th class="num">Baseline</th><th class="num">Project</th><th class="num">Reduction</th><th>Factor end (§8.6.3)</th></tr></thead>
                <tbody>
                  @for (s of sources(); track s.key) {
                    <tr [class.zero]="!s.baseline && !s.project">
                      <td><strong>{{ s.label }}</strong><div class="subtle small mono">{{ s.symbol }}</div></td>
                      <td><code class="eq">{{ s.eq }}</code></td>
                      <td class="num">{{ s.baseline | num: 3 }}</td>
                      <td class="num">{{ s.project | num: 3 }}</td>
                      <td class="num"><strong [class.neg]="s.reduction < 0">{{ s.reduction | num: 3 }}</strong></td>
                      <td><span class="end" [class]="'end e-' + s.end" [title]="endText(s.end)">{{ endLabel(s.end) }}</span></td>
                    </tr>
                  }
                </tbody>
                <tfoot><tr>
                  <td colspan="2"><strong>Total</strong></td>
                  <td class="num"><strong>{{ totals().b | num: 3 }}</strong></td><td class="num"><strong>{{ totals().p | num: 3 }}</strong></td>
                  <td class="num"><strong>{{ d.total_reduction_t_co2e | num: 3 }}</strong></td><td></td>
                </tr></tfoot>
              </table>
            </div>
            <div class="card-foot small muted foot">{{ d.note }} A source that isn't practised has no emissions and needs no data.</div>
          </section>

          <section class="card mt">
            <div class="card-head"><h3>Per year</h3><vc-dc cls="CALCULATED" /><span class="subtle small">Weighted by the share of each calendar year inside the period</span></div>
            @if (years().length) { <div class="chart"><vc-chart [option]="yearOption()" height="300px" /></div> }
            @else { <vc-empty icon="chart" title="No years in this period" /> }
          </section>

          @if (floor().length) {
            <section class="card mt">
              <div class="card-head"><h3>Livestock floor</h3><vc-ref>VM0042 §8.3 p.48 · §8.4.2 p.52</vc-ref><span class="subtle small">Where the herd fell below the look-back average</span></div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Field</th><th class="num">Year</th><th>Livestock</th><th class="num">Look-back average</th><th class="num">Project herd</th><th>Treatment</th></tr></thead>
                  <tbody>
                    @for (i of floor(); track $index) {
                      <tr>
                        <td>{{ fieldName(i.field_id) }}</td><td class="num">{{ i.year }}</td><td>{{ human(i.type) }}</td>
                        <td class="num">{{ i.lookback_average_head | num: 1 }} <span class="u">head</span></td>
                        <td class="num">{{ i.project_head | num: 1 }} <span class="u">head</span></td>
                        <td>@if (i.option === 'a') { <span class="opt a">(a) Look-back herd used · LK_disp required</span> } @else { <span class="opt b">(b) Production kept, animals slaughtered · project herd used</span> }</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div class="card-foot small muted foot">Option (b) applies when the project's livestock record says production was maintained and the animals were slaughtered, not displaced — with evidence. Otherwise option (a) adds the missing head at the look-back attributes.</div>
            </section>
          }
        }

        @case ('fields') {
          <section class="card">
            <div class="card-head"><h3>Per field and year</h3><vc-dc cls="CALCULATED" /><span class="subtle small">Baseline years repeat the look-back schedule (§6, footnote 8)</span></div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Field</th><th>Unit</th><th class="num">Year</th><th class="num">Baseline data from</th><th class="num">Area</th><th class="num">Baseline</th><th class="num">Project</th><th class="num">Reduction</th><th class="num">Reduction / ha</th></tr></thead>
                <tbody>
                  @for (f of d.fields; track f.field_id + f.year) {
                    <tr>
                      <td>{{ fieldName(f.field_id) }}</td><td>{{ f.unit }}</td><td class="num">{{ f.year }}</td>
                      <td class="num">@if (f.baseline_data_year === null) { <span class="subtle">No look-back</span> } @else { {{ f.baseline_data_year }} }</td>
                      <td class="num nowrap">{{ f.area_ha | num: 2 }} <span class="u">ha</span></td>
                      <td class="num">{{ f.baseline_t_co2e | num: 3 }}</td>
                      <td class="num">{{ f.project_t_co2e | num: 3 }}</td>
                      <td class="num"><strong [class.neg]="f.baseline_t_co2e - f.project_t_co2e < 0">{{ f.baseline_t_co2e - f.project_t_co2e | num: 3 }}</strong></td>
                      <td class="num">{{ f.area_ha ? ((f.baseline_t_co2e - f.project_t_co2e) / f.area_ha | num: 3) : '—' }}</td>
                    </tr>
                  } @empty { <tr><td colspan="9" class="muted small">No fields in the project zones yet.</td></tr> }
                </tbody>
              </table>
            </div>
            <div class="card-foot small muted foot">tCO₂e, unweighted per calendar year. The credited reduction is computed per quantification unit as (baseline − project areal mean) × area (Eq. 52–59).</div>
          </section>
        }

        @case ('trail') {
          <div class="grid grid-2 two-col">
            <section class="card">
              <div class="card-head"><h3>Equations used</h3></div>
              <ol class="eqs">
                @for (q of d.equations; track q.eq) { <li><code class="eq">{{ q.eq }}</code><span>{{ q.label }}</span></li> }
              </ol>
            </section>
            <section class="card">
              <div class="card-head"><h3>Emission factors used</h3><span class="subtle small">{{ factors().length }} factors@if (noRange()) { · <span class="nrc">{{ noRange() }} without a range</span> }</span></div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Factor</th><th>Source</th><th class="num">Value</th><th>End chosen</th></tr></thead>
                  <tbody>
                    @for (f of factors(); track f.id) {
                      <tr [class.nr]="f.range_missing"><td class="mono small">{{ f.key }}</td><td class="small">{{ f.source }}</td><td class="num">{{ f.value }}</td>
                        <td><span class="end" [class]="'end e-' + f.end" [title]="endText(f.end)">{{ endLabel(f.end) }}</span>
                          @if (f.range_missing) { <span class="nrt" title="VM0042 §8.6.3 (p.81) asks for the conservative end of the factor's uncertainty range, but the rule pack gives only a central value.">No range · §8.6.3</span> }</td></tr>
                    } @empty { <tr><td colspan="4" class="muted small">No factors were needed.</td></tr> }
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <section class="card mt">
            <div class="card-head"><h3>Calculation trail</h3><span class="subtle small">Every non-zero source total per field, scenario and year, with the inputs the equation used</span>
              <select class="input sel" [ngModel]="trailSource()" (ngModelChange)="trailSource.set($event)" aria-label="Filter by source">
                <option value="">All sources</option>
                @for (s of trailSources(); track s) { <option [value]="s">{{ label(s) }}</option> }
              </select>
            </div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Source</th><th>Eq.</th><th>Field</th><th>Scenario</th><th class="num">Year</th><th class="num">Data year</th><th>Inputs</th><th class="num">tCO₂e</th></tr></thead>
                <tbody>
                  @for (t of trail(); track $index) {
                    <tr>
                      <td>{{ label(t.source) }}</td><td><code class="eq">{{ t.eq }}</code></td><td>{{ fieldName(t.field_id) }}</td>
                      <td><span class="scn" [class.b]="t.scenario === 'baseline'">{{ t.scenario }}</span></td>
                      <td class="num">{{ t.year }}</td><td class="num">{{ t.data_year }}</td>
                      <td class="small mono inp">{{ inputs(t.inputs) }}</td>
                      <td class="num"><strong>{{ t.t_co2e | num: 4 }}</strong></td>
                    </tr>
                  } @empty { <tr><td colspan="8" class="muted small">No emissions were calculated — no source was practised in this period.</td></tr> }
                </tbody>
              </table>
            </div>
          </section>
        }

        @case ('leakage') {
          <div class="lkx mb">
            <vc-icon name="truck" [size]="18" />
            <div><strong>Residues diverted and displacement</strong><p class="small muted">LE_BR (TOOL16, §8.4.4) and LK_disp (VMD0054, Eq. 34–36) are recorded and published as terms on the Leakage records page.</p></div>
            <a class="btn btn-secondary btn-sm" routerLink="/app/leakage">Open leakage records<vc-icon name="arrow-right" [size]="14" /></a>
          </div>
          <section class="card">
            <div class="card-head"><h3>Organic-amendment leakage</h3><vc-dc cls="CALCULATED" /><span class="subtle small">VM0042 §8.4.1 · Eq. 33</span></div>
            <vc-leakage-panel [items]="d.leakage_items" [leOa]="d.leakage_oa_t_co2e" [names]="fieldNames()" />
          </section>
          @if (d.biochar_items.length) {
            <section class="card mt">
              <div class="card-head"><h3>Biochar subtracted from soil carbon</h3><span class="subtle small">§4 condition 7</span></div>
              <div class="table-wrap"><table class="table">
                <thead><tr><th>Field</th><th class="num">Year</th><th class="num">Organic carbon <span class="u">t</span></th><th class="num">As CO₂ <span class="u">t</span></th></tr></thead>
                <tbody>@for (b of d.biochar_items; track $index) { <tr><td>{{ fieldName(b.field_id) }}</td><td class="num">{{ b.year }}</td><td class="num">{{ b.organic_carbon_t | num: 3 }}</td><td class="num">{{ b.t_co2e | num: 3 }}</td></tr> }</tbody>
              </table></div>
            </section>
          }
        }
      }
    }
  `,
  styles: [`
    .period{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .period .input{width:150px}
    .stats{margin-bottom:12px}
    .meta{display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
    .meta > span{display:inline-flex;gap:5px;align-items:center}
    .tier{padding:2px 8px;border-radius:999px;border:1px solid var(--border);background:var(--surface)}
    .tier.t1{border-color:#cfe2d4;background:var(--ok-soft);color:var(--forest-700)}
    .tier.t3,.tier.t4{border-color:#f1dcae;background:var(--warn-soft);color:var(--amber-600)}
    .mb{display:flex;margin-bottom:12px}
    .mt{margin-top:16px}
    .eq{font-size:11.5px;padding:2px 6px;border-radius:4px;background:var(--dc-calculated-bg);color:var(--dc-calculated);white-space:nowrap}
    .neg{color:var(--red-600)}
    tr.zero td{color:var(--text-3)}
    tfoot td{padding:12px 14px;background:var(--surface-2);border-top:1px solid var(--border)}
    .end{display:inline-block;font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--stone-100);color:var(--stone-600)}
    .end.e-low{background:var(--sky-100);color:var(--sky-600)} .end.e-high{background:var(--clay-100);color:var(--clay-700)}
    .foot{justify-content:flex-start}
    .chart{padding:12px 16px}
    .u{font-size:11.5px;color:var(--text-3)}
    .eqs{list-style:none;margin:0;padding:8px 20px 14px}
    .eqs li{display:flex;gap:12px;align-items:baseline;padding:8px 0;border-bottom:1px solid var(--stone-100);font-size:13px}
    .eqs li:last-child{border-bottom:0}
    .eqs .eq{flex:none;min-width:74px;text-align:center}
    .sel{width:220px;height:32px}
    .scn{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--forest-100);color:var(--forest-700);text-transform:capitalize}
    .scn.b{background:var(--sand-200);color:var(--stone-700)}
    .inp{max-width:360px;white-space:normal;color:var(--text-2)}
    .blk-h{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;background:var(--warn-soft);border-radius:var(--radius) var(--radius) 0 0;border-bottom:1px solid #f1dcae}
    .blk-h > div{flex:1} .blk-h p{color:var(--stone-700);margin-top:2px}
    .bi{color:var(--amber-600);margin-top:2px}
    .code{font-size:11px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.7);color:var(--stone-600)}
    .two-col{align-items:start}
    .disp{display:flex;gap:14px;align-items:flex-start;padding:14px 18px;border-radius:var(--radius);background:var(--clay-50);border:1px solid var(--clay-100);flex-wrap:wrap}
    .di{color:var(--clay-600);margin-top:1px} .dt{flex:1;min-width:240px} .dt p{color:var(--stone-700);font-size:13.5px;margin-top:2px}
    .opt{font-size:12px;font-weight:500;padding:2px 8px;border-radius:999px;white-space:nowrap}
    .opt.a{background:var(--clay-50);color:var(--clay-700)} .opt.b{background:var(--ok-soft);color:var(--forest-700)}
    tr.nr td{background:color-mix(in srgb, var(--warn-soft) 45%, transparent)}
    .nrt{display:inline-block;margin-left:6px;font-size:11px;font-weight:600;padding:1px 7px;border-radius:999px;background:var(--warn-soft);color:var(--amber-600);border:1px solid #f1dcae;cursor:help}
    .nrc{color:var(--amber-600);font-weight:500}
    .lkx{display:flex;gap:12px;align-items:center;padding:12px 16px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--border);flex-wrap:wrap}
    .lkx > div{flex:1;min-width:220px} .lkx vc-icon{color:var(--clay-600)}
  `],
})
export class EmissionsPage {
  private api = inject(ApiService);
  ctx = inject(ProjectContext);

  start = signal(`${new Date().getFullYear() - 2}-01-01`);
  end = signal(`${new Date().getFullYear() - 1}-12-31`);
  data = signal<Breakdown | null>(null);
  loading = signal(false);
  err = signal<ApiError | null>(null);
  tab = signal(inject(ActivatedRoute).snapshot.queryParamMap.get('tab') ?? 'summary');
  trailSource = signal('');
  fieldNames = signal<Record<string, string>>({});
  tabs: TabItem[] = [
    { key: 'summary', label: 'Summary' }, { key: 'fields', label: 'By field' },
    { key: 'trail', label: 'Equations & factors' }, { key: 'leakage', label: 'Leakage' },
  ];

  sources = computed(() => {
    const src = this.data()?.sources ?? {};
    const keys = [...SOURCE_ORDER.filter(k => src[k]), ...Object.keys(src).filter(k => !SOURCE_ORDER.includes(k))];
    return keys.map(k => ({ key: k, label: sourceLabel(k), eq: src[k].eq, symbol: src[k].symbol, baseline: src[k].baseline_t_co2e,
      project: src[k].project_t_co2e, reduction: src[k].reduction_t_co2e, end: src[k].ef_end }));
  });
  totals = computed(() => this.sources().reduce((a, s) => ({ b: a.b + s.baseline, p: a.p + s.project }), { b: 0, p: 0 }));
  totalArea = computed(() => (this.data()?.quantification_units ?? []).reduce((a, u) => a + u.area_ha, 0));
  years = computed(() => this.data()?.years ?? []);
  tierChips = computed(() => Object.entries(this.data()?.tiers ?? {}).filter(([k]) => k !== '0').map(([k, n]) => ({ k, n, label: TIER[k] ?? `Tier ${k}` })));
  skippedLabels = computed(() => (this.data()?.skipped_sources ?? []).map(s => sourceLabel(s)).join(', '));
  missing = computed(() => ((this.err()?.details?.['missing'] as { field_id: string; year: number; category: string; baseline_year: number }[] | undefined) ?? []));
  errTitle = computed(() => {
    const c = this.err()?.code;
    if (c === 'ACTIVITY_DATA_INCOMPLETE') return 'Project activity data is missing';
    if (c === 'RULE_MISSING') return 'A methodology value is missing';
    if (c === 'APPROACH_NOT_PERMITTED') return 'The rule pack uses an approach VM0042 does not allow';
    return "Emissions can't be calculated yet";
  });
  factors = computed(() => Object.entries(this.data()?.factors_used ?? {}).map(([id, f]) => {
    const [src, key] = id.split(':');
    return { id, key, source: sourceLabel(src), value: f.value, end: f.end, range_missing: !!f.range_missing };
  }));
  noRange = computed(() => this.factors().filter(f => f.range_missing).length);
  floor = computed(() => this.data()?.livestock_floor ?? []);
  trailSources = computed(() => [...new Set((this.data()?.trail ?? []).map(t => t.source))]);
  trail = computed(() => (this.data()?.trail ?? []).filter(t => !this.trailSource() || t.source === this.trailSource()).slice(0, 400));
  yearOption = computed(() => {
    const ys = this.years();
    const src = Object.values(this.data()?.sources ?? {});
    const by = (y: number, k: 'baseline_t_co2e' | 'project_t_co2e' | 'reduction_t_co2e') =>
      src.reduce((a, s) => a + (s.per_year.find(p => p.year === y)?.[k] ?? 0), 0);
    return {
      legend: { data: ['Baseline', 'Project', 'Reduction'] },
      tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${fmtNum(v, 3)} tCO₂e` },
      xAxis: { type: 'category', data: ys.map(String) },
      yAxis: { type: 'value', name: 'tCO₂e', nameTextStyle: { color: '#737c76', fontSize: 11, align: 'right' } },
      series: [
        { name: 'Baseline', type: 'bar', barMaxWidth: 34, itemStyle: { color: '#c3c9c4', borderRadius: [3, 3, 0, 0] }, data: ys.map(y => by(y, 'baseline_t_co2e')) },
        { name: 'Project', type: 'bar', barMaxWidth: 34, itemStyle: { color: PALETTE[0], borderRadius: [3, 3, 0, 0] }, data: ys.map(y => by(y, 'project_t_co2e')) },
        { name: 'Reduction', type: 'line', symbolSize: 8, itemStyle: { color: PALETTE[1] }, lineStyle: { width: 2 }, data: ys.map(y => by(y, 'reduction_t_co2e')) },
      ],
    };
  });

  fieldNameFn = (id: string) => this.fieldName(id);

  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      if (!pid) return;
      untracked(() => this.init(pid));
    });
  }

  private init(pid: string) {
    this.api.get<{ crediting_start?: string | null; crediting_end?: string | null }>(`/projects/${pid}`).subscribe({
      next: p => {
        if (p.crediting_start) {
          this.start.set(p.crediting_start);
          const today = new Date().toISOString().slice(0, 10);
          const lastYearEnd = `${new Date().getFullYear() - 1}-12-31`;
          let end = lastYearEnd > p.crediting_start ? lastYearEnd : today;
          if (p.crediting_end && p.crediting_end < end) end = p.crediting_end;
          this.end.set(end);
        }
        this.load();
      },
      error: () => this.load(),
    });
    this.api.get<{ items: { id: string; code: string; name: string }[] }>('/fields', { project_id: pid, limit: 500 }).subscribe({
      next: r => this.fieldNames.set(Object.fromEntries(r.items.map(f => [f.id, `${f.code} · ${f.name}`]))),
      error: () => undefined,
    });
  }

  load() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.loading.set(true);
    this.err.set(null);
    this.api.get<Breakdown>(`/projects/${pid}/emissions`, { start: this.start(), end: this.end() }).subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: (e: ApiError) => { this.err.set(e); this.data.set(null); this.loading.set(false); },
    });
  }

  fmt(v: number | null | undefined, d = 2) { return fmtNum(v, d); }
  fieldName(id: string) { return this.fieldNames()[id] ?? id.slice(0, 8); }
  label = sourceLabel;
  human(v: string) { const s = (v ?? '').replace(/_/g, ' '); return s.charAt(0).toUpperCase() + s.slice(1); }
  endText(e: string) { return EF_END_TEXT[e] ?? ''; }
  endLabel(e: string) { return ({ low: 'Low end', high: 'High end', central: 'Central', value: 'Single value', fixed: 'Fixed by VM0042' } as Record<string, string>)[e] ?? e; }
  inputs(o: Record<string, unknown>): string {
    return Object.entries(o ?? {}).map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: ${v.map(x => (typeof x === 'object' ? Object.entries(x as object).filter(([, y]) => typeof y !== 'object').map(([a, b]) => `${a}=${typeof b === 'number' ? fmtNum(b, 3) : b}`).join(' ') : x)).join('; ')}`;
      if (v && typeof v === 'object') return `${k}: ${Object.entries(v).map(([a, b]) => `${a}=${typeof b === 'number' ? fmtNum(b, 3) : b}`).join(', ')}`;
      return `${k}=${typeof v === 'number' ? fmtNum(v, 4) : v}`;
    }).join(' · ');
  }
}
