import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, untracked } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { DayPipe, NumPipe } from '../../core/format';
import { Chart } from '../../ui/chart';
import { KIT } from '../../ui/kit';
import { Remote, TIER_ORDER, tierMeta } from './shared';
import { QualityBar, TierChip } from './tier-chip';

interface CovParam { tier: number; provider: string | null; quality: number }
interface CovField {
  field_id: string; field_code: string; area_ha: number; best_tier: number; worst_tier: number; avg_quality: number;
  parameters: Record<string, CovParam>; reason?: string;
}
export interface Coverage {
  project_id: string; as_of: string; fields: number; by_best_tier: Record<string, number>;
  tier_labels: Record<string, string>; device_would_help_most: CovField[]; field_details: CovField[];
}

const PARAM_COLS = [
  { key: 'rain_mm', label: 'Rainfall' },
  { key: 'air_temp_c', label: 'Air temp.' },
  { key: 'soil_moisture_20cm_pct', label: 'Soil moisture' },
];

@Component({
  selector: 'vc-coverage-tab',
  imports: [...KIT, Chart, TierChip, QualityBar, DayPipe, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cov.loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (cov.error()) {
      <vc-error title="Couldn't load coverage" [message]="cov.error()!.message" />
    } @else if (cov.data(); as c) {
      @if (!c.fields) {
        <div class="card"><vc-empty icon="map" title="No enrolled fields yet"
          text="Coverage appears once fields are enrolled in this project. Each field is checked for the best available data source." /></div>
      } @else {
        <div class="grid top">
          <section class="card">
            <div class="card-head"><h3>Fields by best data source</h3><span class="subtle small">as of {{ c.as_of | day }}</span></div>
            <div class="card-body donut-wrap">
              <div class="donut">
                <vc-chart [option]="donut()" height="200px" />
                <div class="centre"><strong class="num">{{ c.fields }}</strong><span>fields</span></div>
              </div>
              <ul class="legend">
                @for (t of tiers; track t) {
                  <li>
                    <vc-tier [tier]="t" />
                    <span class="spacer"></span>
                    <strong class="num">{{ c.by_best_tier[t] ?? 0 }}</strong>
                    <span class="share num">{{ share(c.by_best_tier[t] ?? 0, c.fields) }}</span>
                  </li>
                }
              </ul>
            </div>
            <div class="card-foot left">
              <span class="small muted">"Best" is the highest tier reached by rainfall, air temperature or soil moisture on that day.</span>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <h3>Where a device would help most</h3>
              <span class="subtle small">{{ c.device_would_help_most.length }} fields</span>
            </div>
            @if (!c.device_would_help_most.length) {
              <vc-empty icon="check-circle" title="Every field has device-grade data"
                text="No field relies only on external regional sources. Good coverage." />
            } @else {
              <ol class="help">
                @for (h of c.device_would_help_most; track h.field_id; let i = $index) {
                  <li>
                    <span class="rank num">{{ i + 1 }}</span>
                    <div class="h-main">
                      <div class="row" style="--gap:8px"><strong>{{ h.field_code }}</strong><span class="subtle small num">{{ h.area_ha | num: 2 }} ha</span></div>
                      <p class="small muted">{{ h.reason }}</p>
                    </div>
                    <vc-quality [value]="h.avg_quality" />
                  </li>
                }
              </ol>
            }
          </section>
        </div>

        <section class="card">
          <div class="card-head"><h3>Field by field</h3><span class="subtle small">Source chosen for each key parameter</span></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Field</th><th class="num">Area</th><th>Best source</th>
                @for (p of params; track p.key) { <th>{{ p.label }}</th> }
                <th>Average quality</th><th></th>
              </tr></thead>
              <tbody>
                @for (f of rows(); track f.field_id) {
                  <tr class="clickable" (click)="openField.emit(f.field_id)">
                    <td><strong>{{ f.field_code }}</strong></td>
                    <td class="num">{{ f.area_ha | num: 2 }} ha</td>
                    <td><vc-tier [tier]="f.best_tier" /></td>
                    @for (p of params; track p.key) {
                      <td>
                        @if (f.parameters[p.key]; as fp) {
                          <span class="pcell"><vc-tier [tier]="fp.tier" [compact]="true" /><span class="subtle small truncate">{{ fp.provider || '—' }}</span></span>
                        } @else { <span class="subtle">—</span> }
                      </td>
                    }
                    <td><vc-quality [value]="f.avg_quality" /></td>
                    <td class="num"><vc-icon name="chevron-right" class="subtle" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }
    }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .top{grid-template-columns:minmax(0,5fr) minmax(0,6fr)}
    @media (max-width:1100px){.top{grid-template-columns:1fr}}
    .donut-wrap{display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:center}
    @media (max-width:720px){.donut-wrap{grid-template-columns:1fr}}
    .donut{position:relative}
    .centre{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}
    .centre strong{font-size:28px;font-weight:600;letter-spacing:-.02em} .centre span{font-size:12px;color:var(--text-3)}
    .legend{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
    .legend li{display:flex;align-items:center;gap:10px;padding-bottom:10px;border-bottom:1px solid var(--stone-100)}
    .legend li:last-child{border-bottom:0;padding-bottom:0}
    .share{width:44px;text-align:right;font-size:12px;color:var(--text-3)}
    .card-foot.left{justify-content:flex-start}
    .help{list-style:none;margin:0;padding:6px 0;max-height:318px;overflow:auto}
    .help li{display:flex;align-items:center;gap:14px;padding:10px 20px;border-bottom:1px solid var(--stone-100)}
    .help li:last-child{border-bottom:0}
    .rank{display:grid;place-items:center;flex:none;width:24px;height:24px;border-radius:6px;background:var(--amber-100);color:var(--amber-600);font-size:12px;font-weight:600}
    .h-main{flex:1;min-width:0} .h-main p{margin-top:2px}
    .pcell{display:inline-flex;align-items:center;gap:6px;max-width:170px}
  `],
})
export class CoverageTab {
  private api = inject(ApiService);
  projectId = input.required<string>();
  openField = output<string>();
  cov = new Remote<Coverage>();
  tiers = TIER_ORDER;
  params = PARAM_COLS;

  rows = computed(() =>
    [...(this.cov.data()?.field_details ?? [])].sort((a, b) =>
      (a.best_tier || 9) - (b.best_tier || 9) || a.field_code.localeCompare(b.field_code)),
  );

  donut = computed(() => {
    const c = this.cov.data();
    const data = TIER_ORDER.map(t => ({
      name: tierMeta(t).label, value: c?.by_best_tier[t] ?? 0, itemStyle: { color: tierMeta(t).color },
    })).filter(d => d.value > 0);
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} fields ({d}%)' },
      xAxis: { show: false }, yAxis: { show: false }, grid: { show: false },
      legend: { show: false },
      series: [{
        type: 'pie', radius: ['62%', '88%'], avoidLabelOverlap: false, label: { show: false }, labelLine: { show: false },
        itemStyle: { borderColor: '#fff', borderWidth: 2 }, data,
      }],
    };
  });

  constructor() {
    effect(() => { const pid = this.projectId(); untracked(() => this.reload(pid)); });
  }

  reload(pid = this.projectId()) {
    this.cov.load(this.api.get<Coverage>(`/projects/${pid}/supporting/coverage`));
  }

  share(n: number, total: number) {
    return total ? `${Math.round((n / total) * 100)}%` : '—';
  }
}
