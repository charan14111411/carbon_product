import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { DayPipe, NumPipe } from '../../core/format';
import { KIT } from '../../ui/kit';
import { Remote } from './shared';
import { TierChip } from './tier-chip';

interface StationRow {
  field_id: string; field_code: string; decision: 'station' | 'synthetic_station'; tier: number; passes: boolean; message: string;
  station: { id: string; name: string; external_id: string; provider: string; distance_km: number; parameters: string[] } | null;
  nearest_continuous?: { name: string; distance_km: number } | null;
  synthetic_source?: string;
  excluded_stations: { station: string; external_id: string; distance_km: number; reason: string }[];
}
interface StationCheckResult {
  project_id: string; max_distance_km: number; rule: string; checked_at: string; fields: number;
  with_station: number; synthetic_station: number; items: StationRow[]; continuous_definition: string;
}

/** VM0042 v2.2 Table 6 / Table 7 note c: nearest continuous weather station within 50 km, else a synthetic station. */
@Component({
  selector: 'vc-station-check',
  imports: [...KIT, TierChip, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="card-head">
        <div class="ct">
          <h3>Weather station check</h3>
          <span class="small muted">Climate inputs must come from the closest weather station with continuous records within
            {{ max() | num: 0 }} km of the field. Otherwise a synthetic station (gridded weather at the field) is used.</span>
        </div>
        <span class="chip">VM0042 Table 6 · Table 7 note c</span>
      </div>

      @if (st.loading()) {
        <vc-loading [rows]="4" />
      } @else if (st.error()) {
        <div class="card-body"><vc-error title="Couldn't run the weather station check" [message]="st.error()!.message" /></div>
      } @else if (st.data(); as c) {
        @if (!c.items.length) {
          <vc-empty icon="cloud-sun" title="No enrolled fields to check"
            text="Each enrolled field is matched to its nearest continuous weather station once fields are enrolled." />
        } @else {
          <div class="sum">
            <div><span class="k">Fields checked</span><strong class="num">{{ c.fields }}</strong></div>
            <div><span class="k">Station within {{ c.max_distance_km | num: 0 }} km</span>
              <strong class="num ok">{{ c.with_station }}</strong><span class="subtle small num">{{ share(c.with_station, c.fields) }}</span></div>
            <div><span class="k">Synthetic station used</span>
              <strong class="num" [class.warn]="c.synthetic_station > 0">{{ c.synthetic_station }}</strong><span class="subtle small num">{{ share(c.synthetic_station, c.fields) }}</span></div>
            <div><span class="k">Checked</span><strong class="small">{{ c.checked_at | day: true }}</strong>
              <span class="subtle small">"Continuous" = {{ c.continuous_definition }}</span></div>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Field</th><th>Decision</th><th>Station</th><th class="num">Distance</th><th>Within {{ c.max_distance_km | num: 0 }} km</th><th>Notes</th>
              </tr></thead>
              <tbody>
                @for (r of shown(); track r.field_id) {
                  <tr class="clickable" (click)="openField.emit(r.field_id)">
                    <td><strong>{{ r.field_code }}</strong></td>
                    <td>
                      @if (r.decision === 'station') { <span class="dec"><vc-tier [tier]="r.tier" [compact]="true" />Weather station</span> }
                      @else { <span class="dec"><vc-tier [tier]="3" [compact]="true" />Synthetic station</span> }
                    </td>
                    <td class="small">
                      @if (r.station; as s) { <strong>{{ s.name }}</strong><div class="subtle mono">{{ s.external_id }}</div> }
                      @else { <span class="mono subtle">{{ r.synthetic_source || '—' }}</span> }
                    </td>
                    <td class="num">
                      @if (r.station) { {{ r.station.distance_km | num: 1 }} km }
                      @else if (r.nearest_continuous) { <span class="subtle" [title]="'Nearest continuous station: ' + r.nearest_continuous.name">{{ r.nearest_continuous.distance_km | num: 1 }} km</span> }
                      @else { <span class="subtle">None</span> }
                    </td>
                    <td>
                      @if (r.passes) { <span class="pass ok"><vc-icon name="circle-check" [size]="15" />Yes</span> }
                      @else { <span class="pass no"><vc-icon name="circle-x" [size]="15" />No</span> }
                    </td>
                    <td class="small muted notes">
                      {{ cap(r.message) }}
                      @if (r.excluded_stations.length) {
                        <div class="subtle">{{ r.excluded_stations.length }} nearer station{{ r.excluded_stations.length > 1 ? 's' : '' }} skipped: {{ r.excluded_stations[0].station }} ({{ r.excluded_stations[0].reason }})</div>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="card-foot left"><span class="small muted rule">{{ c.rule }}</span>
            @if (rows().length > limit) {
              <button class="btn btn-ghost btn-sm" (click)="all.set(!all())">{{ all() ? 'Show fewer' : 'Show all ' + rows().length + ' fields' }}</button>
            }
          </div>
        }
      }
    </section>
  `,
  styles: [`
    .ct{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
    .ct .muted{max-width:760px}
    .chip{flex:none;font:500 11px/1 var(--mono);padding:5px 8px;border-radius:999px;background:var(--sand-100);color:var(--stone-700);border:1px solid var(--border);white-space:nowrap}
    .sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid var(--border)}
    .sum > div{display:flex;flex-direction:column;gap:2px;padding:14px 20px;border-right:1px solid var(--border)}
    .sum > div:last-child{border-right:0}
    @media (max-width:900px){.sum{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .sum .k{font-size:12px;color:var(--text-2);font-weight:500}
    .sum strong{font-size:20px;font-weight:600} .sum strong.small{font-size:13.5px;font-weight:500;padding:4px 0}
    .sum strong.ok{color:var(--forest-600)} .sum strong.warn{color:var(--amber-600)}
    .dec{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
    .pass{display:inline-flex;align-items:center;gap:5px;font-weight:500}
    .pass.ok{color:var(--forest-600)} .pass.no{color:var(--amber-600)}
    .notes{max-width:360px}
    .card-foot.left{justify-content:flex-start;gap:12px} .rule{flex:1}
  `],
})
export class StationCheck {
  private api = inject(ApiService);
  projectId = input.required<string>();
  openField = output<string>();
  st = new Remote<StationCheckResult>();
  max = computed(() => this.st.data()?.max_distance_km ?? 50);
  rows = computed(() => [...(this.st.data()?.items ?? [])].sort((a, b) =>
    Number(a.passes) - Number(b.passes) || a.field_code.localeCompare(b.field_code)));

  limit = 8;
  all = signal(false);
  shown = computed(() => (this.all() ? this.rows() : this.rows().slice(0, this.limit)));
  cap(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  constructor() {
    effect(() => { const pid = this.projectId(); untracked(() => this.reload(pid)); });
  }

  reload(pid = this.projectId()) {
    this.st.load(this.api.get<StationCheckResult>(`/projects/${pid}/weather-station-check`));
  }

  share(n: number, total: number) { return total ? `${Math.round((n / total) * 100)}%` : ''; }
}
