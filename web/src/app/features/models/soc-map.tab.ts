import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, of, throwError } from 'rxjs';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { MapView } from '../../ui/map-view';
import { FieldLite, Remote, esc, fieldsFC } from '../supporting/shared';
import { CLAY_RAMP, GREEN_RAMP, ModelVersion, SocCell, SocMap, featureLabel, ramp } from './types';
import { WallChip } from './informing-wall';

type Layer = 'prediction' | 'uncertainty' | 'priority';

@Component({
  selector: 'vc-soc-map-tab',
  imports: [...KIT, FormsModule, MapView, NumPipe, DayPipe, WallChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (state.loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (state.error()) {
      <vc-error title="Couldn't load the soil-carbon map" [message]="state.error()!.message" />
    } @else {
      @if (!socMap()) {
        <div class="card">
          <vc-empty icon="map" title="No soil-carbon map for this project yet"
            text="Generate one with an approved model. Each enrolled field gets a predicted SOC %, an uncertainty range and a sampling priority.">
            @if (canGenerate()) { <button class="btn btn-primary" (click)="openGen()"><vc-icon name="sparkles" />Generate map</button> }
          </vc-empty>
        </div>
      } @else {
        @let m = socMap()!;
        <div class="head">
          <div class="big-dc"><span>MODELLED</span></div>
          <div class="hm">
            <strong>{{ m.summary.model }}</strong>
            <span class="small muted">Generated {{ m.generated_on | day }} · {{ m.summary.predicted }} of {{ m.summary.fields }} fields predicted
              @if (m.summary.out_of_domain) { · {{ m.summary.out_of_domain }} outside the training data }</span>
          </div>
          <div class="spacer"></div>
          <div class="mstat"><span>Mean predicted SOC</span><strong class="num">{{ m.summary.mean_predicted_soc_pct | num: 2 }}<small>%</small></strong></div>
          @if (canGenerate()) { <button class="btn btn-secondary" (click)="openGen()"><vc-icon name="refresh" />Regenerate</button> }
        </div>

        <section class="card">
          <div class="card-head">
            <div class="seg" role="group" aria-label="Map layer">
              <button type="button" [class.on]="layer() === 'prediction'" (click)="layer.set('prediction')">Predicted SOC</button>
              <button type="button" [class.on]="layer() === 'uncertainty'" (click)="layer.set('uncertainty')">Uncertainty</button>
              <button type="button" [class.on]="layer() === 'priority'" (click)="layer.set('priority')">Sampling priority</button>
            </div>
            <div class="spacer"></div>
            <div class="legend">
              @if (layer() === 'priority') {
                <span class="li"><i style="background:#c76329"></i>Sample next</span>
                <span class="li"><i style="background:#c3dbca"></i>Lower priority</span>
                <span class="li"><i style="background:#dfe3df"></i>No prediction</span>
              } @else {
                <span class="small subtle num">{{ rangeLo() | num: 2 }}{{ layer() === 'prediction' ? '%' : '' }}</span>
                <span class="bar" [style.background]="gradient()"></span>
                <span class="small subtle num">{{ rangeHi() | num: 2 }}{{ layer() === 'prediction' ? '%' : '' }}</span>
                <span class="small muted">{{ layer() === 'prediction' ? 'SOC %' : 'Interval width, % SOC' }}</span>
              }
            </div>
          </div>
          <vc-map [polygons]="polys()" height="460px" (featureClick)="selected.set($event.id)" class="flat" />
        </section>

        <section class="card">
          <div class="card-head"><h3>Fields ranked by sampling priority</h3><span class="subtle small">Widest uncertainty first</span></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th class="num">#</th><th>Field</th><th class="num">Predicted SOC</th><th>90% range</th><th class="num">Width</th><th>Training data</th><th>Why</th></tr></thead>
              <tbody>
                @for (c of m.cells; track c.field_id) {
                  <tr [class.sel]="selected() === c.field_id" [class.next]="c.sample_next" (click)="selected.set(c.field_id)">
                    <td class="num">{{ c.rank }}</td>
                    <td><div class="fc"><strong>{{ c.field_code }}</strong>@if (c.sample_next) { <span class="flag"><vc-icon name="target" [size]="12" />Sample next</span> }</div></td>
                    <td class="num">@if (c.predicted_soc_pct !== null) { <strong>{{ c.predicted_soc_pct | num: 2 }}</strong><span class="u">%</span> } @else { <span class="subtle">—</span> }</td>
                    <td>
                      @if (c.lower !== null && c.upper !== null) {
                        <div class="rng" [title]="(c.lower | num: 2) + '–' + (c.upper | num: 2) + ' %'">
                          <span class="track"><span class="span" [style.left.%]="pos(c.lower)" [style.width.%]="pos(c.upper) - pos(c.lower)"></span>
                            <span class="pt" [style.left.%]="pos(c.predicted_soc_pct!)"></span></span>
                          <span class="small num subtle">{{ c.lower | num: 2 }}–{{ c.upper | num: 2 }}</span>
                        </div>
                      } @else { <span class="subtle small">Missing {{ missing(c) }}</span> }
                    </td>
                    <td class="num">{{ c.interval_width === null ? '—' : (c.interval_width | num: 3) }}</td>
                    <td>@if (c.in_domain) { <span class="small ok">Within range</span> } @else { <span class="small warn">Outside</span> }</td>
                    <td class="small muted why">{{ why(c) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="card-foot left"><vc-dc cls="MODELLED" /><span class="small muted">{{ m.summary.note }}</span><span class="spacer"></span><vc-wall-chip [data]="m" /></div>
        </section>
      }
    }

    <vc-modal [(open)]="genOpen" title="Generate a soil-carbon map" subtitle="Predicts SOC for every enrolled field in this project" width="480px">
      <div class="stack" style="--gap:14px">
        @if (!approved().length) {
          <vc-callout tone="warn" icon="lock">There is no approved model yet. Train a model, then ask a second person to approve it — only approved models can be used for mapping.</vc-callout>
        } @else {
          <div class="field">
            <label for="gm">Approved model</label>
            <select id="gm" class="input" [(ngModel)]="genModel">
              @for (m of approved(); track m.id) { <option [value]="m.id">{{ m.name }} v{{ m.version }} · RMSE {{ m.metrics.rmse | num: 3 }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="tn">Fields to flag "sample next"</label>
            <input id="tn" type="number" class="input num" min="0" max="500" [(ngModel)]="genTop" />
            <span class="hint">The fields with the widest uncertainty are flagged.</span>
          </div>
        }
        @if (genError()) { <vc-error title="Map not generated" [message]="genError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="genOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="generating() || !genModel" (click)="generate()">{{ generating() ? 'Generating…' : 'Generate map' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .head{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
    .big-dc{display:grid;place-items:center;height:44px;padding:0 16px;border-radius:10px;background:var(--dc-modelled-bg);color:var(--dc-modelled);
      font:700 14px/1 var(--mono);letter-spacing:.12em;border:1px solid #f1dcae}
    .hm{display:flex;flex-direction:column;gap:2px}
    .mstat{display:flex;flex-direction:column;align-items:flex-end}
    .mstat span{font-size:12px;color:var(--text-2)} .mstat strong{font-size:22px;font-weight:600} .mstat small{font-size:13px;color:var(--text-3);margin-left:2px}
    .seg{display:inline-flex;background:var(--sand-100);border-radius:8px;padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 12.5px var(--font);padding:6px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--stone-900);box-shadow:var(--shadow-sm)}
    .legend{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .legend .bar{width:140px;height:8px;border-radius:4px}
    .li{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--stone-700);margin-left:8px}
    .li i{width:12px;height:12px;border-radius:3px;display:inline-block}
    vc-map.flat{border:0;border-radius:0 0 var(--radius) var(--radius)}
    .fc{display:flex;flex-direction:column;gap:3px;align-items:flex-start}
    .flag{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;color:var(--clay-600);background:var(--clay-50);padding:2px 7px;border-radius:999px;border:1px solid var(--clay-100)}
    .u{font-size:11px;color:var(--text-3);margin-left:2px}
    tr.sel td{background:var(--forest-50)}
    tr.next td:first-child{box-shadow:inset 3px 0 0 var(--clay-500)}
    tbody tr{cursor:pointer}
    .rng{display:flex;align-items:center;gap:8px;min-width:190px}
    .track{position:relative;flex:1;height:8px;border-radius:4px;background:var(--sand-200)}
    .span{position:absolute;top:0;bottom:0;border-radius:4px;background:var(--amber-100);box-shadow:inset 0 0 0 1px #e8c98a}
    .pt{position:absolute;top:-2px;width:3px;height:12px;border-radius:2px;background:var(--forest-700);transform:translateX(-1px)}
    .ok{color:var(--forest-700)} .warn{color:var(--amber-600);font-weight:500}
    .why{max-width:340px}
    .card-foot.left{justify-content:flex-start}
  `],
})
export class SocMapTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  projectId = input.required<string>();
  models = input<ModelVersion[]>([]);

  state = new Remote<{ map: SocMap | null; fields: FieldLite[] }>();
  socMap = computed(() => this.state.data()?.map ?? null);
  layer = signal<Layer>('prediction');
  selected = signal<string | null>(null);
  canGenerate = computed(() => this.auth.can('models.manage', 'sampling.plan'));
  approved = computed(() => this.models().filter(m => m.status === 'approved'));

  private preds = computed(() => (this.socMap()?.cells ?? []).map(c => c.predicted_soc_pct).filter((v): v is number => v !== null));
  private widths = computed(() => (this.socMap()?.cells ?? []).map(c => c.interval_width).filter((v): v is number => v !== null));
  rangeLo = computed(() => Math.min(...(this.layer() === 'prediction' ? this.preds() : this.widths()), Infinity));
  rangeHi = computed(() => Math.max(...(this.layer() === 'prediction' ? this.preds() : this.widths()), -Infinity));
  gradient = computed(() => `linear-gradient(90deg, ${(this.layer() === 'prediction' ? GREEN_RAMP : CLAY_RAMP).join(', ')})`);

  // Range bar scale for the table, spanning all lower/upper values.
  private scale = computed(() => {
    const cells = this.socMap()?.cells ?? [];
    const lo = Math.min(...cells.map(c => c.lower ?? Infinity));
    const hi = Math.max(...cells.map(c => c.upper ?? -Infinity));
    return Number.isFinite(lo) && Number.isFinite(hi) && hi > lo ? { lo, hi } : { lo: 0, hi: 1 };
  });

  polys = computed(() => {
    const cells = new Map((this.socMap()?.cells ?? []).map(c => [c.field_id, c]));
    const layer = this.layer();
    const lo = this.rangeLo(), hi = this.rangeHi();
    const t = (v: number) => (hi > lo ? (v - lo) / (hi - lo) : 0.5);
    return fieldsFC(this.state.data()?.fields ?? [], f => {
      const c = cells.get(f.id);
      if (!c) return null;
      let color = '#dfe3df';
      if (layer === 'prediction' && c.predicted_soc_pct !== null) color = ramp(t(c.predicted_soc_pct), GREEN_RAMP);
      if (layer === 'uncertainty' && c.interval_width !== null) color = ramp(t(c.interval_width), CLAY_RAMP);
      if (layer === 'priority') color = c.sample_next ? '#c76329' : c.predicted_soc_pct === null ? '#dfe3df' : '#86b797';
      return { color, label: this.label(c) };
    });
  });

  genOpen = signal(false);
  generating = signal(false);
  genError = signal<string | null>(null);
  genModel = '';
  genTop = 5;

  constructor() {
    effect(() => {
      const pid = this.projectId();
      untracked(() => this.load(pid));
    });
  }

  load(pid = this.projectId(), keep = false) {
    this.state.load(forkJoin({
      // A project without a map answers 404; that is the empty state, not an error.
      map: this.api.get<SocMap>(`/projects/${pid}/soc-maps/latest`).pipe(
        catchError((e: ApiError) => (e.status === 404 ? of(null) : throwError(() => e))),
      ),
      fields: this.api.get<Page<FieldLite>>('/fields', { project_id: pid, limit: 500 }).pipe(map(r => r.items)),
    }), keep);
  }

  pos(v: number) {
    const s = this.scale();
    return Math.max(0, Math.min(100, ((v - s.lo) / (s.hi - s.lo)) * 100));
  }
  why(c: SocCell) {
    return c.reasons.join(' · ').replace(/(ndvi_mean|ndmi_mean|rain_365d|temp_mean|elevation_m|clay_pct|practice_count)/g, k => featureLabel(k).toLowerCase());
  }
  missing(c: SocCell) { return c.missing_features.map(featureLabel).join(', ').toLowerCase(); }

  private label(c: SocCell): string {
    const pred = c.predicted_soc_pct === null ? 'No prediction' : `${c.predicted_soc_pct.toFixed(2)}% SOC`;
    const rng = c.lower !== null && c.upper !== null ? `<br><span style="color:#737c76">90% range ${c.lower.toFixed(2)}–${c.upper.toFixed(2)}%</span>` : '';
    return `<strong>${esc(c.field_code)}</strong> <span style="font:600 9px var(--mono);color:#9a6200;background:#fbefd6;padding:2px 4px;border-radius:3px">MODELLED</span>`
      + `<br>${pred}${rng}<br><span style="color:#737c76">Priority #${c.rank}${c.sample_next ? ' · <b style="color:#ad4f1f">sample next</b>' : ''}</span>`;
  }

  openGen() {
    this.genError.set(null);
    this.genModel = this.approved()[0]?.id ?? '';
    this.genOpen.set(true);
  }

  generate() {
    this.generating.set(true);
    this.genError.set(null);
    this.api.post<SocMap>(`/projects/${this.projectId()}/soc-map`, { model_id: this.genModel, top_n: Number(this.genTop) || 0 }).subscribe({
      next: m => {
        this.generating.set(false);
        this.genOpen.set(false);
        this.toast.success('Soil-carbon map generated', `${m.summary.predicted} of ${m.summary.fields} fields predicted.`);
        this.load(this.projectId(), true);
      },
      error: (e: ApiError) => { this.generating.set(false); this.genError.set(e.message); },
    });
  }
}
