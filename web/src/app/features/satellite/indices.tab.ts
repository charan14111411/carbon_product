import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Chart } from '../../ui/chart';
import { KIT } from '../../ui/kit';
import { FieldLite, Remote, daysAgo, isSimulated, isoDate } from '../supporting/shared';

interface Alert {
  field_id: string; field_code: string; latest_date: string; latest_ndvi: number; median_60d: number; drop_pct: number;
  severity: string; message: string;
}
interface Alerts { project_id: string; threshold_pct: number; alerts: Alert[] }
interface SatPoint { date: string; value: number; cloud_pct: number; source: string; excluded: boolean }
interface SatSeries { field_id: string; index: string; data_class: string; cloud_limit_pct: number; cloudy_excluded: number; points: SatPoint[] }

const INDICES = [
  { key: 'ndvi', label: 'NDVI', long: 'Vegetation (NDVI)', hint: 'Greenness of the canopy. Bare soil ≈ 0.1, dense crop ≈ 0.8.' },
  { key: 'ndmi', label: 'NDMI', long: 'Moisture (NDMI)', hint: 'Water in leaves and surface. Higher is wetter.' },
];

@Component({
  selector: 'vc-indices-tab',
  imports: [...KIT, FormsModule, Chart, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid split">
      <section class="card alerts">
        <div class="card-head">
          <h3>Vegetation alerts</h3>
          <vc-dc cls="OBSERVED" />
        </div>
        @if (alerts.loading()) {
          <vc-loading [rows]="5" />
        } @else if (alerts.error()) {
          <div class="card-body"><vc-error title="Couldn't load alerts" [message]="alerts.error()!.message" /></div>
        } @else if (!alerts.data()?.alerts?.length) {
          <vc-empty icon="check-circle" title="No sudden vegetation drops"
            [text]="'No field\\'s latest clear pass is more than ' + (alerts.data()?.threshold_pct ?? 25) + '% below its 60-day median.'" />
        } @else {
          <p class="lead small muted">Fields whose latest clear NDVI fell more than {{ alerts.data()!.threshold_pct | num: 0 }}% below their 60-day median. Often harvest — sometimes damage or a change of land use.</p>
          <ul class="alist">
            @for (a of alerts.data()!.alerts; track a.field_id) {
              <li [class.on]="a.field_id === fieldId()" (click)="fieldId.set(a.field_id)">
                <div class="drop num" [class.big]="a.drop_pct >= 50">−{{ a.drop_pct | num: 0 }}<span>%</span></div>
                <div class="am">
                  <div class="row" style="--gap:8px"><strong>{{ a.field_code }}</strong><span class="subtle small">{{ a.latest_date | day }}</span></div>
                  <div class="small muted num">NDVI {{ a.latest_ndvi | num: 2 }} now vs {{ a.median_60d | num: 2 }} median</div>
                </div>
                <vc-icon name="chevron-right" class="subtle" />
              </li>
            }
          </ul>
        }
      </section>

      <section class="card">
        <div class="card-head wrap">
          <div class="ct">
            <select class="input fsel" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)" aria-label="Field">
              <option value="" disabled>Choose a field…</option>
              @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}</option> }
            </select>
          </div>
          <div class="seg">
            @for (i of indices; track i.key) { <button type="button" [class.on]="index() === i.key" (click)="index.set(i.key)">{{ i.label }}</button> }
          </div>
          @if (fieldId() && canRefresh()) {
            <button class="btn btn-secondary btn-sm" [disabled]="refreshing()" (click)="refresh()"><vc-icon name="refresh" [size]="14" />{{ refreshing() ? 'Fetching…' : 'Refresh' }}</button>
          }
        </div>
        @if (!fieldId()) {
          <vc-empty icon="satellite" title="Pick a field" text="Choose a field, or an alert on the left, to see its satellite history." />
        } @else if (series.loading()) {
          <vc-loading [rows]="6" />
        } @else if (series.error()) {
          <div class="card-body"><vc-error title="Couldn't load satellite data" [message]="series.error()!.message" /></div>
        } @else if (!series.data()?.points?.length) {
          <vc-empty icon="satellite" title="No satellite passes stored" text="Refresh to fetch the last 12 months of passes for this field.">
            @if (canRefresh()) { <button class="btn btn-primary" (click)="refresh()"><vc-icon name="refresh" />Fetch passes</button> }
          </vc-empty>
        } @else {
          <div class="card-body">
            <div class="meta">
              <div><span class="k">Clear passes</span><strong class="num">{{ clearCount() }}</strong></div>
              <div><span class="k">Cloudy, excluded</span><strong class="num">{{ series.data()!.cloudy_excluded }}</strong></div>
              <div><span class="k">Latest · {{ latest()?.date | day }}</span><strong class="num">{{ latest()?.value | num: 3 }}</strong></div>
              <div class="spacer"></div>
              <vc-dc cls="OBSERVED" />
            </div>
            <vc-chart [option]="chart()" height="300px" />
            <div class="legend">
              <span class="li"><i class="ln"></i>Clear pass (cloud ≤ {{ series.data()!.cloud_limit_pct | num: 0 }}%)</span>
              <span class="li"><i class="cl"></i>Cloudy pass — not used in any check</span>
              <span class="small subtle">{{ indexMeta().hint }}</span>
            </div>
          </div>
          <div class="card-foot left">
            <span class="small muted">Source</span>
            @for (s of sources(); track s) {
              <code class="small">{{ s }}</code>
              @if (sim(s)) { <span class="sim">Simulated</span> }
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .split{grid-template-columns:minmax(0,4fr) minmax(0,7fr);align-items:start}
    @media (max-width:1100px){.split{grid-template-columns:1fr}}
    .lead{padding:12px 20px 4px}
    .alist{list-style:none;margin:0;padding:6px 0 8px;max-height:460px;overflow:auto}
    .alist li{display:flex;align-items:center;gap:14px;padding:10px 20px;cursor:pointer;border-left:3px solid transparent}
    .alist li:hover{background:var(--sand-50)}
    .alist li.on{background:var(--forest-50);border-left-color:var(--forest-500)}
    .drop{flex:none;width:62px;font-size:20px;font-weight:600;color:var(--amber-600);letter-spacing:-.02em}
    .drop.big{color:var(--red-600)} .drop span{font-size:12px;margin-left:1px}
    .am{flex:1;min-width:0}
    .card-head.wrap{flex-wrap:wrap}
    .ct{flex:1;min-width:220px} .fsel{max-width:360px;height:34px}
    .seg{display:inline-flex;background:var(--sand-100);border-radius:8px;padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 12.5px var(--font);padding:5px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--stone-900);box-shadow:var(--shadow-sm)}
    .meta{display:flex;gap:28px;align-items:center;margin-bottom:10px;flex-wrap:wrap}
    .meta > div:not(.spacer){display:flex;flex-direction:column;gap:2px}
    .meta .k{font-size:12px;color:var(--text-2)} .meta strong{font-size:18px;font-weight:600}
    .legend{display:flex;flex-wrap:wrap;gap:18px;margin-top:8px;font-size:12.5px;color:var(--stone-700);align-items:center}
    .li{display:inline-flex;align-items:center;gap:6px}
    .li i.ln{width:14px;height:3px;border-radius:2px;background:#2f7249}
    .li i.cl{width:9px;height:9px;border-radius:50%;background:#dfe3df;border:1px solid #9aa29c}
    .card-foot.left{justify-content:flex-start;gap:10px}
    .sim{font:600 10px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;padding:4px 6px;border-radius:4px;background:var(--violet-100);color:var(--violet-600)}
  `],
})
export class IndicesTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  projectId = input.required<string>();
  fields = input<FieldLite[]>([]);
  fieldId = model<string>('');
  index = signal('ndvi');
  indices = INDICES;
  refreshing = signal(false);
  canRefresh = computed(() => this.auth.can('data.sync'));

  alerts = new Remote<Alerts>();
  series = new Remote<SatSeries>();
  indexMeta = computed(() => INDICES.find(i => i.key === this.index())!);
  clear = computed(() => (this.series.data()?.points ?? []).filter(p => !p.excluded));
  clearCount = computed(() => this.clear().length);
  latest = computed(() => this.clear().at(-1) ?? null);
  sources = computed(() => [...new Set((this.series.data()?.points ?? []).map(p => p.source))]);
  sim = isSimulated;

  chart = computed(() => {
    const pts = this.series.data()?.points ?? [];
    const name = this.indexMeta().label;
    const byDate = new Map(pts.map(p => [p.date, p]));
    return {
      grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
      legend: { show: false },
      tooltip: {
        trigger: 'item',
        formatter: (p: { value: [string, number] }) => {
          const d = byDate.get(p.value[0]);
          if (!d) return '';
          return `<div style="font-weight:600">${d.date}</div><div style="font-size:15px;font-weight:600">${name} ${d.value.toFixed(3)}</div>`
            + `<div style="color:#58625b">Cloud cover ${d.cloud_pct.toFixed(0)}%${d.excluded ? ' · <b style="color:#737c76">excluded</b>' : ''}</div>`;
        },
      },
      xAxis: { type: 'time', axisLabel: { formatter: '{MMM} {yy}' } },
      yAxis: { type: 'value', scale: true },
      series: [
        {
          type: 'line', name, smooth: 0.25, symbol: 'circle', symbolSize: 5, lineStyle: { width: 2, color: '#2f7249' },
          itemStyle: { color: '#2f7249' }, areaStyle: { color: 'rgba(47,114,73,0.08)' },
          data: pts.filter(p => !p.excluded).map(p => [p.date, p.value]),
        },
        {
          type: 'scatter', name: 'Cloudy', symbolSize: 7, itemStyle: { color: '#dfe3df', borderColor: '#9aa29c', borderWidth: 1 },
          data: pts.filter(p => p.excluded).map(p => [p.date, p.value]),
        },
      ],
    };
  });

  constructor() {
    effect(() => {
      const pid = this.projectId();
      untracked(() => this.alerts.load(this.api.get<Alerts>(`/projects/${pid}/satellite/alerts`)));
    });
    effect(() => {
      const id = this.fieldId();
      const idx = this.index();
      untracked(() => (id ? this.loadSeries(id, idx) : this.series.reset()));
    });
  }

  private loadSeries(id: string, idx: string, keep = false) {
    this.series.load(this.api.get<SatSeries>(`/fields/${id}/satellite`, { index: idx, include_cloudy: true, start: daysAgo(400) }), keep);
  }

  refresh() {
    const id = this.fieldId();
    if (!id) return;
    this.refreshing.set(true);
    this.api.post<{ written: Record<string, number>; cloudy_excluded: number; provider: string }>(`/fields/${id}/satellite/refresh`, {
      start: daysAgo(365), end: isoDate(new Date()),
    }).subscribe({
      next: r => {
        this.refreshing.set(false);
        const n = Object.values(r.written ?? {}).reduce((a, b) => a + b, 0);
        this.toast.success('Satellite passes fetched', n ? `${n} new index values from ${r.provider}.` : 'Already up to date.');
        this.loadSeries(id, this.index(), true);
        this.alerts.load(this.api.get<Alerts>(`/projects/${this.projectId()}/satellite/alerts`), true);
      },
      error: (e: ApiError) => { this.refreshing.set(false); this.toast.apiError(e, "Couldn't fetch satellite data"); },
    });
  }
}
