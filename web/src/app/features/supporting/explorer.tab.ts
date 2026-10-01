import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Chart } from '../../ui/chart';
import { KIT } from '../../ui/kit';
import { FieldLite, Remote, TIER_ORDER, daysAgo, isSimulated, isoDate, tierMeta } from './shared';
import { QualityBar, TierChip } from './tier-chip';
import { DerivedFeatures } from './derived-features';

interface SummaryParam {
  parameter: string; label: string; unit: string; synced: boolean; tier: number | null; tier_label?: string;
  provider: string | null; avg_quality: number | null; last_value: number | null; last_date: string | null; data_class: string | null;
}
interface Summary { field_id: string; field_code: string; parameters: SummaryParam[] }
interface Point {
  date: string; value: number | null; unit: string; tier: number; tier_label: string; provider: string; source_ref: string;
  quality: number; data_class: string | null; bias_corrected: boolean; distance_km: number | null; note: string | null;
}
interface Series { field_id: string; parameter: string; label: string; unit: string; points: Point[] }

const WINDOWS = [{ d: 30, l: '30 days' }, { d: 90, l: '90 days' }, { d: 180, l: '6 months' }, { d: 365, l: '1 year' }];

@Component({
  selector: 'vc-explorer-tab',
  imports: [...KIT, FormsModule, Chart, TierChip, QualityBar, NumPipe, DayPipe, DerivedFeatures],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <div class="field picker">
        <label for="fp">Field</label>
        <select id="fp" class="input" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)">
          <option value="" disabled>Choose a field…</option>
          @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}</option> }
        </select>
      </div>
      <span class="spacer"></span>
      @if (fieldId() && canSync()) {
        <button class="btn btn-secondary" [disabled]="syncing()" (click)="syncField()">
          <vc-icon name="refresh" />{{ syncing() ? 'Syncing…' : 'Sync this field' }}
        </button>
      }
    </div>

    @if (!fieldId()) {
      <div class="card"><vc-empty icon="pin" title="Pick a field to explore its data"
        text="See which source supplies each parameter today, how good it is, and the full daily history." /></div>
    } @else {
      @if (summary.loading()) {
        <div class="card"><vc-loading [rows]="4" /></div>
      } @else if (summary.error()) {
        <vc-error title="Couldn't load the field summary" [message]="summary.error()!.message" />
      } @else if (summary.data(); as s) {
        @if (!syncedCount()) {
          <vc-callout tone="info" icon="info">
            No supporting data has been synced for {{ s.field_code }} yet.
            @if (canSync()) { Use <strong>Sync this field</strong> to fetch the last {{ windowDays() }} days from the best available sources. }
          </vc-callout>
        }
        <div class="params">
          @for (p of s.parameters; track p.parameter) {
            <button type="button" class="pcard" [class.on]="p.parameter === parameter()" [class.off]="!p.synced" (click)="parameter.set(p.parameter)">
              <div class="ph"><span class="pl">{{ p.label }}</span>
                @if (p.synced) { <vc-tier [tier]="p.tier" [compact]="true" /> }
              </div>
              @if (p.synced) {
                <div class="pv num">{{ p.last_value === null ? '—' : (p.last_value | num: 2) }}<span class="u">{{ p.unit }}</span></div>
                <div class="pm"><span class="truncate">{{ p.provider }}</span>@if (p.data_class) { <vc-dc [cls]="p.data_class" /> }</div>
                <vc-quality [value]="p.avg_quality" />
                <div class="pd subtle">{{ p.last_date ? (p.last_date | day) : '' }}</div>
              } @else {
                <div class="pv none">Not synced</div>
                <div class="pd subtle">No readings stored yet</div>
              }
            </button>
          }
        </div>
      }

      <section class="card">
        <div class="card-head">
          <div class="ct"><h3>{{ series.data()?.label ?? 'History' }}@if (series.data()?.unit) { <span class="subtle"> · {{ series.data()!.unit }}</span> }</h3>
            <span class="small muted">Best value per day. Colour shows which source supplied it.</span></div>
          <div class="seg">
            @for (w of windows; track w.d) { <button type="button" [class.on]="windowDays() === w.d" (click)="windowDays.set(w.d)">{{ w.l }}</button> }
          </div>
        </div>
        @if (series.loading()) {
          <vc-loading [rows]="5" />
        } @else if (series.error()) {
          <div class="card-body"><vc-error title="Couldn't load the history" [message]="series.error()!.message" /></div>
        } @else if (!points().length) {
          <vc-empty icon="chart" title="No readings in this window" text="Sync the field, or choose a longer window." />
        } @else {
          <div class="card-body chart-body">
            <vc-chart [option]="chart()" height="300px" />
            <div class="legend">
              @for (t of tiersPresent(); track t.tier) {
                <span class="li"><i [style.background]="t.color"></i>{{ t.short }} · {{ t.label }} <span class="subtle num">{{ t.n }} d</span></span>
              }
              @if (biasCount()) { <span class="li"><i class="dia"></i>Bias-corrected <span class="subtle num">{{ biasCount() }} d</span></span> }
            </div>
          </div>
          <div class="card-foot left">
            <div class="sources">
              <span class="small muted">Sources</span>
              @for (s of sources(); track s.ref) {
                <span class="src"><vc-tier [tier]="s.tier" [compact]="true" /><code>{{ s.ref }}</code>
                  @if (s.simulated) { <span class="sim" title="This provider returns simulated values for demonstration and testing">Simulated</span> }
                </span>
              }
            </div>
          </div>
        }
      </section>

      <vc-derived-features [fieldId]="fieldId()" [windowDays]="windowDays()" />
    }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .bar{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}
    .picker{width:min(420px,100%)}
    .params{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
    @media (max-width:1280px){.params{grid-template-columns:repeat(4,minmax(0,1fr))}}
    @media (max-width:980px){.params{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .pcard{display:flex;flex-direction:column;gap:6px;text-align:left;padding:12px 14px;background:var(--surface);border:1px solid var(--border);
      border-radius:var(--radius);box-shadow:var(--shadow-sm);font:inherit;color:inherit;cursor:pointer;transition:border-color .12s, box-shadow .12s}
    .pcard:hover{border-color:var(--stone-300)}
    .pcard.on{border-color:var(--forest-500);box-shadow:var(--focus)}
    .pcard.off{background:var(--surface-2)}
    .ph{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .pl{font-size:12.5px;font-weight:500;color:var(--text-2)}
    .pv{font-size:20px;font-weight:600;letter-spacing:-.01em} .pv .u{font-size:12px;font-weight:500;color:var(--text-3);margin-left:4px}
    .pv.none{font-size:14px;color:var(--text-3);font-weight:500;padding:4px 0}
    .pm{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2);min-height:18px}
    .pd{font-size:11.5px}
    .ct{flex:1;display:flex;flex-direction:column;gap:2px}
    .seg{display:inline-flex;background:var(--sand-100);border-radius:8px;padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 12.5px var(--font);padding:5px 10px;border-radius:6px;color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--stone-900);box-shadow:var(--shadow-sm)}
    .chart-body{padding-top:12px}
    .legend{display:flex;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:12.5px;color:var(--stone-700)}
    .li{display:inline-flex;align-items:center;gap:6px}
    .li i{width:12px;height:4px;border-radius:2px;display:inline-block}
    .li i.dia{width:9px;height:9px;border-radius:1px;transform:rotate(45deg);background:var(--surface);border:2px solid var(--clay-500)}
    .card-foot.left{justify-content:flex-start}
    .sources{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}
    .src{display:inline-flex;align-items:center;gap:6px}
    .src code{font-size:12px;color:var(--stone-700)}
    .sim{font:600 10px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;padding:4px 6px;border-radius:4px;background:var(--violet-100);color:var(--violet-600)}
  `],
})
export class ExplorerTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  fields = input<FieldLite[]>([]);
  fieldId = model<string>('');
  parameter = signal('rain_mm');
  windowDays = signal(90);
  windows = WINDOWS;
  syncing = signal(false);
  canSync = computed(() => this.auth.can('data.sync'));

  summary = new Remote<Summary>();
  series = new Remote<Series>();

  syncedCount = computed(() => (this.summary.data()?.parameters ?? []).filter(p => p.synced).length);
  points = computed(() => this.series.data()?.points ?? []);
  biasCount = computed(() => this.points().filter(p => p.bias_corrected).length);
  tiersPresent = computed(() => TIER_ORDER.map(t => ({ ...tierMeta(t), n: this.points().filter(p => p.tier === t).length })).filter(t => t.n));
  sources = computed(() => {
    const m = new Map<string, number>();
    for (const p of this.points()) if (p.source_ref && !m.has(p.source_ref)) m.set(p.source_ref, p.tier);
    return [...m].map(([ref, tier]) => ({ ref, tier, simulated: isSimulated(ref) }));
  });

  chart = computed(() => {
    const pts = this.points();
    const s = this.series.data();
    const unit = s?.unit ?? '';
    const dates = pts.map(p => p.date);
    const isRain = s?.parameter === 'rain_mm';
    const fmt = (i: number) => {
      const p = pts[i];
      if (!p) return '';
      const t = tierMeta(p.tier);
      return `<div style="font-weight:600;margin-bottom:4px">${p.date}</div>`
        + `<div style="font-size:16px;font-weight:600">${p.value === null ? '—' : p.value.toFixed(2)} <span style="font-size:11px;color:#737c76">${unit}</span></div>`
        + `<div style="margin-top:4px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${t.color};margin-right:6px"></span>${t.short} · ${t.label}</div>`
        + `<div style="color:#58625b">${p.source_ref}${p.distance_km !== null ? ` · ${p.distance_km.toFixed(1)} km away` : ''}</div>`
        + `<div style="color:#58625b">Quality ${p.quality.toFixed(2)}${p.bias_corrected ? ' · <b style="color:#ad4f1f">bias-corrected</b>' : ''}</div>`
        + (p.note ? `<div style="color:#737c76;max-width:260px;white-space:normal">${p.note}</div>` : '');
    };
    const base = {
      grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
      tooltip: { trigger: 'axis', formatter: (ps: { dataIndex: number }[]) => fmt(ps?.[0]?.dataIndex ?? -1) },
      legend: { show: false },
      xAxis: { type: 'category', data: dates, boundaryGap: isRain, axisLabel: { formatter: (v: string) => v.slice(5) } },
      yAxis: { type: 'value', scale: !isRain },
    };
    if (isRain) {
      return {
        ...base,
        series: [{
          type: 'bar', barMaxWidth: 10,
          data: pts.map(p => ({ value: p.value, itemStyle: { color: tierMeta(p.tier).color, opacity: p.bias_corrected ? 0.65 : 1, borderRadius: [2, 2, 0, 0] } })),
        }],
      };
    }
    // One line per tier; each includes its own points plus the next point so segments join up.
    const lines = TIER_ORDER.filter(t => t !== 0 && pts.some(p => p.tier === t)).map(t => ({
      type: 'line', showSymbol: false, smooth: false, connectNulls: false, lineStyle: { width: 2, color: tierMeta(t).color },
      itemStyle: { color: tierMeta(t).color }, emphasis: { disabled: true },
      data: pts.map((p, i) => (p.tier === t || (i > 0 && pts[i - 1].tier === t && p.tier !== 0)) ? p.value : null),
    }));
    const bias = {
      type: 'scatter', symbol: 'diamond', symbolSize: 9, z: 5,
      itemStyle: { color: '#ffffff', borderColor: '#c76329', borderWidth: 2 },
      data: pts.map(p => (p.bias_corrected ? p.value : null)),
    };
    return { ...base, series: [...lines, bias] };
  });

  constructor() {
    // Start on the first field so the tab never opens blank.
    effect(() => {
      const fs = this.fields();
      untracked(() => { if (fs.length && !fs.some(f => f.id === this.fieldId())) this.fieldId.set(fs[0].id); });
    });
    effect(() => {
      const id = this.fieldId();
      untracked(() => {
        if (id) this.summary.load(this.api.get<Summary>(`/fields/${id}/supporting/summary`));
        else this.summary.reset();
      });
    });
    effect(() => {
      const id = this.fieldId();
      const p = this.parameter();
      const d = this.windowDays();
      untracked(() => {
        if (!id) { this.series.reset(); return; }
        this.series.load(this.api.get<Series>(`/fields/${id}/supporting`, { parameter: p, start: daysAgo(d), end: isoDate(new Date()) }));
      });
    });
  }

  syncField() {
    const id = this.fieldId();
    if (!id) return;
    this.syncing.set(true);
    this.api.post<{ parameters: Record<string, { written: number }> }>(`/fields/${id}/supporting/sync`, {
      start: daysAgo(this.windowDays()), end: isoDate(new Date()),
    }).subscribe({
      next: r => {
        this.syncing.set(false);
        const written = Object.values(r.parameters ?? {}).reduce((a, p) => a + (p.written ?? 0), 0);
        this.toast.success('Field synced', written ? `${written} new daily readings stored.` : 'Everything was already up to date.');
        this.summary.load(this.api.get<Summary>(`/fields/${id}/supporting/summary`), true);
        this.series.load(this.api.get<Series>(`/fields/${id}/supporting`, { parameter: this.parameter(), start: daysAgo(this.windowDays()), end: isoDate(new Date()) }), true);
      },
      error: (e: ApiError) => { this.syncing.set(false); this.toast.apiError(e, "Couldn't sync the field"); },
    });
  }
}
