import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { DayPipe, NumPipe } from '../../core/format';
import { KIT } from '../../ui/kit';
import { Remote, daysAgo, isoDate } from './shared';
import { QualityBar } from './tier-chip';

/** One derived value, as returned by GET /fields/{id}/derived-features (supporting/derived.py `value`). */
export interface DerivedValue {
  value: number | null; unit: string; data_class: string; source_tiers: number[]; providers: string[];
  input_data_classes: string[]; quality: number; n_days: number;
  window?: [string, string]; completeness?: number; threshold_pct?: number | null; threshold_mm?: number;
  base_c?: number; method?: string; formula?: string; resolution?: string;
  spells?: { start: string; end: string; days: number; slope_pct_per_day: number }[];
}
interface Period { period_start: string; period_end: string; features: Record<string, DerivedValue> }
interface Derived {
  field_id: string; field_code: string; start: string; end: string; window: string; data_class: string;
  credit_eligible: boolean; credit_eligible_reason: string;
  wetness_threshold: { value_pct: number | null; source: string; data_class?: string };
  inputs_days: Record<string, number>; periods: Period[]; note: string;
}

interface Meta { key: string; label: string; explain: string; digits: number }
interface Group { key: string; label: string; icon: string; items: Meta[] }

/** Plain-English labels and explanations for each derived feature, grouped as users think about them. */
const GROUPS: Group[] = [
  { key: 'sm', label: 'Soil moisture', icon: 'droplets', items: [
    { key: 'sm20_mean', label: 'Moisture at 20 cm', explain: 'Average water content near the surface over the period.', digits: 1 },
    { key: 'sm60_mean', label: 'Moisture at 60 cm', explain: 'Average water content deeper in the root zone.', digits: 1 },
    { key: 'sm_gradient', label: 'Depth gradient', explain: 'Surface minus deep moisture. Positive: topsoil wetter than subsoil, e.g. after rain.', digits: 2 },
    { key: 'dry_down_rate', label: 'Dry-down rate', explain: 'How fast the topsoil dries in rain-free spells of 3+ days. Higher means faster drying.', digits: 2 },
    { key: 'wetness_days', label: 'Wet days', explain: 'Days the topsoil was at or above field capacity (the wetness threshold).', digits: 0 },
  ] },
  { key: 'air', label: 'Air & growth', icon: 'thermometer', items: [
    { key: 'temp_mean', label: 'Mean air temperature', explain: 'Average of daily mean air temperature.', digits: 1 },
    { key: 'vpd_mean', label: 'Vapour-pressure deficit', explain: 'How strongly the air pulls water from plants and soil (Tetens formula). Above ~1.5 kPa is drying.', digits: 2 },
    { key: 'vpd_max', label: 'Peak daily VPD', explain: 'The driest single day in the period.', digits: 2 },
    { key: 'gdd_base10', label: 'Growing degree days', explain: 'Warmth available for crop growth: the sum of daily mean temperature above 10 °C.', digits: 0 },
  ] },
  { key: 'rain', label: 'Rainfall', icon: 'rain', items: [
    { key: 'rain_total', label: 'Rain in the period', explain: 'Total rainfall between the first and last day of the period.', digits: 0 },
    { key: 'heavy_rain_days', label: 'Heavy-rain days', explain: 'Days with more than 25 mm — a proxy for run-off and erosion risk.', digits: 0 },
    { key: 'rain_7d', label: 'Last 7 days', explain: 'Trailing total ending on the period’s last day.', digits: 0 },
    { key: 'rain_30d', label: 'Last 30 days', explain: 'Trailing total ending on the period’s last day.', digits: 0 },
    { key: 'rain_90d', label: 'Last 90 days', explain: 'Trailing total. Shown only when at least 80% of the days have data.', digits: 0 },
  ] },
];
const MONTHLY_COLS = ['sm20_mean', 'sm_gradient', 'dry_down_rate', 'wetness_days', 'vpd_mean', 'rain_total', 'gdd_base10'];
const ALL: Record<string, Meta> = Object.fromEntries(GROUPS.flatMap(g => g.items).map(m => [m.key, m]));

@Component({
  selector: 'vc-derived-features',
  imports: [...KIT, QualityBar, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="card-head">
        <div class="ct">
          <h3>Derived features <vc-dc cls="DERIVED" /></h3>
          <span class="small muted">Worked out from the daily readings above: context for sampling and models, never a soil-carbon measurement.</span>
        </div>
        <div class="seg">
          <button type="button" [class.on]="mode() === 'season'" (click)="mode.set('season')">Whole window</button>
          <button type="button" [class.on]="mode() === 'monthly'" (click)="mode.set('monthly')">By month</button>
        </div>
      </div>

      @if (d.loading()) {
        <vc-loading [rows]="4" />
      } @else if (d.error()) {
        <div class="card-body"><vc-error title="Couldn't work out derived features" [message]="d.error()!.message" /></div>
      } @else if (d.data(); as r) {
        @if (!hasAny()) {
          <vc-empty icon="sigma" title="Nothing to derive yet"
            text="Derived features need daily soil-moisture, rainfall and temperature readings in this window. Sync the field or choose a longer window." />
        } @else if (mode() === 'season' && season(); as p) {
          <div class="card-body">
            <div class="period small muted"><vc-icon name="calendar" [size]="14" />{{ p.period_start | day }} – {{ p.period_end | day }}
              <span class="subtle">· {{ days(p) }} days</span></div>
            @for (g of groups; track g.key) {
              <div class="grp">
                <div class="gh"><vc-icon [name]="g.icon" [size]="15" />{{ g.label }}</div>
                <div class="tiles">
                  @for (m of g.items; track m.key) {
                    @if (p.features[m.key]; as v) {
                      <div class="tile" [class.none]="v.value === null">
                        <div class="tl">{{ m.label }}</div>
                        <div class="tv num">
                          @if (v.value === null) { — } @else { {{ v.value | num: m.digits }} }
                          <span class="u">{{ v.unit }}</span>
                        </div>
                        <p class="te">{{ m.explain }}</p>
                        @if (m.key === 'wetness_days' && v.threshold_pct) {
                          <div class="subtle small">Threshold {{ v.threshold_pct | num: 1 }} % vol</div>
                        }
                        <div class="tm">
                          <span class="subtle small">{{ windowText(v, p) }}</span>
                          @if (v.value !== null) { <vc-quality [value]="v.quality" title="Lowest quality among the inputs used" /> }
                        </div>
                      </div>
                    }
                  }
                </div>
              </div>
            }
          </div>
        } @else if (mode() === 'monthly') {
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Month</th>
                @for (k of monthlyCols; track k) { <th class="num">{{ meta(k).label }}<span class="th-u">{{ unitOf(k) }}</span></th> }
              </tr></thead>
              <tbody>
                @for (p of r.periods; track p.period_start) {
                  <tr>
                    <td class="nowrap">{{ p.period_start | day }} – {{ p.period_end | day }}</td>
                    @for (k of monthlyCols; track k) {
                      <td class="num">{{ cell(p, k) === null ? '—' : (cell(p, k) | num: meta(k).digits) }}</td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        <div class="card-foot left">
          <span class="small muted">
            Wetness threshold {{ r.wetness_threshold.value_pct === null ? 'not set' : (r.wetness_threshold.value_pct | num: 1) + ' % vol' }}
            — {{ r.wetness_threshold.source }}@if (r.wetness_threshold.data_class) { <vc-dc [cls]="r.wetness_threshold.data_class" class="inl" /> }.
            A derived value is never better than its weakest input, so each shows the lowest input quality.
          </span>
        </div>
      }
    </section>
  `,
  styles: [`
    .ct{flex:1;display:flex;flex-direction:column;gap:2px}
    .ct h3{display:flex;align-items:center;gap:8px}
    .seg{display:inline-flex;background:var(--sand-100);border-radius:8px;padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 12.5px var(--font);padding:5px 10px;border-radius:6px;color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--stone-900);box-shadow:var(--shadow-sm)}
    .period{display:flex;align-items:center;gap:6px;margin-bottom:14px}
    .grp + .grp{margin-top:18px}
    .gh{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:8px}
    .tiles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
    @media (max-width:1280px){.tiles{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media (max-width:900px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .tile{display:flex;flex-direction:column;gap:4px;padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface-2)}
    .tile.none{opacity:.75}
    .tl{font-size:12.5px;font-weight:500;color:var(--text-2)}
    .tv{font-size:19px;font-weight:600;letter-spacing:-.01em} .tv .u{font-size:11.5px;font-weight:500;color:var(--text-3);margin-left:4px;letter-spacing:0}
    .te{font-size:12px;line-height:1.4;color:var(--text-3);flex:1}
    .tm{display:flex;flex-direction:column;gap:4px;padding-top:6px;border-top:1px solid var(--stone-100)} .tm vc-quality{width:100%}
    .th-u{display:block;font-size:10.5px;font-weight:500;color:var(--text-3);text-transform:none;letter-spacing:0}
    .card-foot.left{justify-content:flex-start}
    .inl{margin:0 2px;vertical-align:middle}
  `],
})
export class DerivedFeatures {
  private api = inject(ApiService);
  fieldId = input.required<string>();
  windowDays = input<number>(90);
  mode = signal<'season' | 'monthly'>('season');
  groups = GROUPS;
  monthlyCols = MONTHLY_COLS;
  d = new Remote<Derived>();

  season = computed(() => (this.d.data()?.window === 'season' ? this.d.data()!.periods[0] ?? null : null));
  hasAny = computed(() => Object.values(this.d.data()?.inputs_days ?? {}).some(n => n > 0));

  constructor() {
    effect(() => {
      const id = this.fieldId();
      const days = Math.min(this.windowDays(), 400);
      const mode = this.mode();
      untracked(() => {
        if (!id) { this.d.reset(); return; }
        this.d.load(this.api.get<Derived>(`/fields/${id}/derived-features`, {
          start: daysAgo(days - 1), end: isoDate(new Date()), window: mode,
        }));
      });
    });
  }

  meta(k: string): Meta { return ALL[k] ?? { key: k, label: k.replace(/_/g, ' '), explain: '', digits: 1 }; }
  unitOf(k: string): string {
    for (const p of this.d.data()?.periods ?? []) if (p.features[k]) return p.features[k].unit.replace(' (SM20 − SM60)', '');
    return '';
  }
  cell(p: Period, k: string): number | null { return p.features[k]?.value ?? null; }
  days(p: Period): number {
    return Math.round((new Date(p.period_end).getTime() - new Date(p.period_start).getTime()) / 86400000) + 1;
  }
  windowText(v: DerivedValue, p: Period): string {
    if (v.window) {
      const n = Math.round((new Date(v.window[1]).getTime() - new Date(v.window[0]).getTime()) / 86400000) + 1;
      const c = v.completeness !== undefined ? ` · ${Math.round(v.completeness * 100)}% of days` : '';
      return `${n} days to ${v.window[1].slice(5)}${c}`;
    }
    return v.n_days ? `${v.n_days} of ${this.days(p)} days` : 'No input days';
  }
}
