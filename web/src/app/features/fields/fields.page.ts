import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Empty, ErrorBox, Loading, PageHeader } from '../../ui/kit';
import { FieldCreate } from './field-create';
import { FieldMap } from './field-map';
import { Crop, FarmerLite, FieldFeatureProps, FieldRec, NO_CROP_COLOR, cropColorMap, escapeHtml } from './field-data';

type Row = FieldFeatureProps & { farmer: string; color: string; cropName: string };

@Component({
  selector: 'vc-fields-page',
  imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Badge, Icon, FieldMap, NumPipe, FieldCreate],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Fields & map" eyebrow="Land"
      [subtitle]="allFields() ? 'Every active field in your organisation.' : 'Fields enrolled in ' + (ctx.current()?.name ?? 'the current project') + '. Areas are computed from each boundary.'">
      <label actions class="toggle">
        <input type="checkbox" [ngModel]="allFields()" (ngModelChange)="allFields.set($event)" />
        <span class="track"><span class="knob"></span></span>
        All fields
      </label>
      @if (auth.can('land.manage')) {
        <button actions class="btn btn-primary" (click)="createOpen.set(true)"><vc-icon name="plus" />Add field</button>
      }
    </vc-page-header>

    <div class="kpis">
      <div class="kpi"><span class="k-l">Fields</span><span class="k-v num">{{ rows().length }}</span></div>
      <div class="kpi"><span class="k-l">Total area</span><span class="k-v num">{{ totalArea() | num: 1 }}<small>ha</small></span></div>
      <div class="kpi"><span class="k-l">Farmers</span><span class="k-v num">{{ farmerCount() }}</span></div>
      @if (!allFields()) {
        <div class="kpi"><span class="k-l">Enrolled</span><span class="k-v num">{{ enrolledCount() }}<small>of {{ rows().length }}</small></span></div>
      }
    </div>

    @if (error()) {
      <vc-error title="Couldn't load fields" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else {
      <div class="split">
        <section class="map-card card">
          @for (k of mapKey(); track k) { <vc-field-map [polygons]="mapData()" height="100%" (featureClick)="open($event)" /> }
          @if (legend().length) {
            <div class="legend">
              <div class="lg-h">Crop</div>
              @for (l of legend(); track l.code) {
                <button type="button" class="lg" [class.off]="cropFilter() && cropFilter() !== l.code" (click)="toggleCrop(l.code)">
                  <span class="sw" [style.background]="l.color"></span>{{ l.name }}<span class="n num">{{ l.count }}</span>
                </button>
              }
            </div>
          }
          @if (loading()) { <div class="map-loading"><vc-icon name="refresh" [size]="14" />Loading boundaries…</div> }
        </section>

        <section class="list card">
          <div class="list-head">
            <div class="search">
              <vc-icon name="search" [size]="15" />
              <input class="input" placeholder="Search code, name or farmer…" [ngModel]="q()" (ngModelChange)="q.set($event)" />
            </div>
            <select class="input" [ngModel]="cropFilter()" (ngModelChange)="cropFilter.set($event)" aria-label="Crop">
              <option value="">All crops</option>
              @for (l of legend(); track l.code) { <option [value]="l.code">{{ l.name }}</option> }
            </select>
            @if (!allFields()) {
              <select class="input" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" aria-label="Enrolment">
                <option value="">Any enrolment</option>
                @for (s of enrolStatuses(); track s) { <option [value]="s">{{ s.replace('_', ' ') }}</option> }
              </select>
            }
          </div>
          @if (loading()) {
            <vc-loading [rows]="8" />
          } @else if (!all().length) {
            <vc-empty icon="map" [title]="allFields() ? 'No fields yet' : 'No fields in this project yet'"
              [text]="allFields() ? 'Add the first field by drawing its boundary on the map.' : 'Fields appear here once they are enrolled in the project. Switch on “All fields” to see every field.'">
              @if (auth.can('land.manage')) { <button class="btn btn-primary" (click)="createOpen.set(true)"><vc-icon name="plus" />Add field</button> }
            </vc-empty>
          } @else if (!rows().length) {
            <vc-empty icon="search" title="No matching fields" text="Try a different search or clear the filters." >
              <button class="btn btn-secondary" (click)="clearFilters()">Clear filters</button>
            </vc-empty>
          } @else {
            <div class="table-wrap scroll">
              <table class="table">
                <thead><tr><th>Field</th><th>Farmer</th><th class="num">Area</th><th>Status</th></tr></thead>
                <tbody>
                  @for (r of rows(); track r.id) {
                    <tr class="clickable" (click)="open(r.id)">
                      <td>
                        <div class="fc"><span class="sw" [style.background]="r.color"></span>
                          <div class="min0"><div class="code mono">{{ r.code }}</div><div class="nm truncate">{{ r.name }} · {{ r.cropName }}</div></div>
                        </div>
                      </td>
                      <td class="truncate farmer">{{ r.farmer }}</td>
                      <td class="num nowrap">{{ r.area_ha | num: 2 }} <span class="subtle">ha</span></td>
                      <td>
                        @if (r.enrolment_status) { <vc-badge [status]="r.enrolment_status" /> }
                        @else { <vc-badge [status]="r.status" /> }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="list-foot subtle small">{{ rows().length }} of {{ all().length }} fields · area computed from boundaries</div>
          }
        </section>
      </div>
    }

    <vc-field-create [(open)]="createOpen" [context]="geo()" (created)="onCreated($event)" />
  `,
  styles: [`
    .toggle{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--stone-700);cursor:pointer;margin-right:6px}
    .toggle input{position:absolute;opacity:0;pointer-events:none}
    .track{width:32px;height:18px;border-radius:9px;background:var(--stone-300);position:relative;transition:background .15s}
    .knob{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:var(--shadow-sm);transition:transform .15s}
    .toggle input:checked + .track{background:var(--forest-500)}
    .toggle input:checked + .track .knob{transform:translateX(14px)}
    .toggle input:focus-visible + .track{box-shadow:var(--focus)}
    .kpis{display:flex;gap:28px;margin:-6px 0 18px;padding:0 2px;flex-wrap:wrap}
    .kpi{display:flex;flex-direction:column;gap:2px}
    .k-l{font-size:12px;color:var(--text-3)} .k-v{font-size:20px;font-weight:600;letter-spacing:-.01em}
    .k-v small{font-size:12px;font-weight:500;color:var(--text-3);margin-left:4px}
    .split{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(380px,1fr);gap:16px;height:calc(100vh - 250px);min-height:560px}
    @media (max-width: 1180px){.split{grid-template-columns:1fr;height:auto}.map-card{height:460px}.list{max-height:none}}
    .map-card{position:relative;overflow:hidden;padding:0}
    .map-card vc-field-map{position:absolute;inset:0;border:0;border-radius:var(--radius)}
    .legend{position:absolute;left:12px;bottom:28px;z-index:3;background:rgba(255,255,255,.96);border:1px solid var(--border);border-radius:var(--radius);
      box-shadow:var(--shadow);padding:10px 10px 8px;min-width:170px;max-height:calc(100% - 90px);overflow:auto;backdrop-filter:blur(4px)}
    .lg-h{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin:0 4px 6px}
    .lg{display:flex;align-items:center;gap:8px;width:100%;border:0;background:none;padding:4px;border-radius:5px;font:inherit;font-size:12.5px;color:var(--stone-800);cursor:pointer;text-align:left}
    .lg:hover{background:var(--sand-100)} .lg.off{opacity:.42}
    .lg .n{margin-left:auto;color:var(--text-3);font-size:11.5px}
    .sw{width:10px;height:10px;border-radius:3px;flex:none}
    .map-loading{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:3;display:flex;gap:6px;align-items:center;padding:6px 12px;border-radius:999px;background:var(--surface);box-shadow:var(--shadow);font-size:12px;color:var(--text-2)}
    .list{display:flex;flex-direction:column;min-height:0;overflow:hidden}
    .list-head{display:flex;gap:8px;padding:12px;border-bottom:1px solid var(--border);flex-wrap:wrap}
    .list-head select{width:auto;min-width:130px;flex:0 1 160px}
    .search{position:relative;flex:1;min-width:180px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    .scroll{flex:1;overflow:auto}
    .fc{display:flex;align-items:center;gap:10px;min-width:0}
    .fc .sw{width:8px;height:28px;border-radius:3px}
    .code{font-size:12px;font-weight:600;color:var(--stone-900)}
    .nm{font-size:12.5px;color:var(--text-2);max-width:200px}
    .min0{min-width:0}
    .farmer{max-width:140px}
    .table td{padding:10px 12px} .table th{padding:9px 12px}
    .list-foot{padding:10px 14px;border-top:1px solid var(--border);background:var(--surface-2)}
  `],
})
export class FieldsPage {
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);

  geo = signal<GeoJSON.FeatureCollection | null>(null);
  crops = signal<Crop[]>([]);
  farmers = signal<Map<string, FarmerLite>>(new Map());
  loading = signal(true);
  error = signal<string | null>(null);
  allFields = signal(false);
  createOpen = signal(false);
  q = signal('');
  cropFilter = signal('');
  statusFilter = signal('');

  private colors = computed(() => cropColorMap((this.geo()?.features ?? []).map(f => (f.properties as FieldFeatureProps).crop_code)));
  private cropNames = computed(() => new Map(this.crops().map(c => [c.code, c.name])));

  all = computed<Row[]>(() =>
    (this.geo()?.features ?? []).map(f => {
      const p = f.properties as FieldFeatureProps;
      return {
        ...p,
        farmer: (p.farmer_id && this.farmers().get(p.farmer_id)?.full_name) || '—',
        color: (p.crop_code && this.colors().get(p.crop_code)) || NO_CROP_COLOR,
        cropName: p.crop_code ? this.cropNames().get(p.crop_code) ?? p.crop_code : 'Not set',
      };
    }),
  );
  rows = computed(() => {
    const q = this.q().toLowerCase().trim();
    return this.all().filter(r =>
      (!this.cropFilter() || r.crop_code === this.cropFilter()) &&
      (!this.statusFilter() || r.enrolment_status === this.statusFilter()) &&
      (!q || `${r.code} ${r.name} ${r.farmer}`.toLowerCase().includes(q)));
  });
  totalArea = computed(() => this.rows().reduce((s, r) => s + (r.area_ha || 0), 0));
  farmerCount = computed(() => new Set(this.rows().map(r => r.farmer_id).filter(Boolean)).size);
  enrolledCount = computed(() => this.rows().filter(r => r.enrolment_status === 'enrolled').length);
  enrolStatuses = computed(() => [...new Set(this.all().map(r => r.enrolment_status).filter((s): s is string => !!s))].sort());

  legend = computed(() => {
    const counts = new Map<string, number>();
    for (const r of this.all()) counts.set(r.crop_code ?? '', (counts.get(r.crop_code ?? '') ?? 0) + 1);
    return [...counts.entries()].map(([code, count]) => ({
      code, count,
      name: code ? this.cropNames().get(code) ?? code : 'Crop not set',
      color: (code && this.colors().get(code)) || NO_CROP_COLOR,
    })).sort((a, b) => b.count - a.count);
  });

  mapData = computed<GeoJSON.FeatureCollection>(() => {
    const visible = new Set(this.rows().map(r => r.id));
    const byId = new Map(this.all().map(r => [r.id, r]));
    return {
      type: 'FeatureCollection',
      features: (this.geo()?.features ?? []).filter(f => visible.has(String(f.id))).map(f => {
        const r = byId.get(String(f.id))!;
        return {
          ...f,
          properties: {
            ...f.properties, color: r.color,
            label: `<strong>${escapeHtml(r.code)}</strong> · ${escapeHtml(r.name)}<br><span style="color:#58625b">${escapeHtml(r.farmer)} · ${escapeHtml(r.cropName)} · ${r.area_ha.toFixed(2)} ha</span>`,
          },
        };
      }),
    };
  });

  /** Re-create the map when the scope changes so it re-fits to the new fields. */
  mapKey = computed(() => [`${this.allFields()}-${this.ctx.currentId()}`]);

  constructor() {
    this.api.get<Crop[]>('/catalogue/crops', { include_inactive: true }).subscribe({ next: r => this.crops.set(r) });
    this.api.get<Page<FarmerLite>>('/farmers', { limit: 500 }).subscribe({
      next: r => this.farmers.set(new Map(r.items.map(f => [f.id, f]))),
    });
    effect(() => {
      const pid = this.ctx.currentId();
      const all = this.allFields();
      if (!all && !pid && !this.ctx.loaded()) return;
      this.load(all ? null : pid);
    });
  }

  load(pid: string | null = this.allFields() ? null : this.ctx.currentId()) {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<GeoJSON.FeatureCollection>('/fields/geojson', { project_id: pid }).subscribe({
      next: r => { this.geo.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  toggleCrop(code: string) { this.cropFilter.set(this.cropFilter() === code ? '' : code); }
  clearFilters() { this.q.set(''); this.cropFilter.set(''); this.statusFilter.set(''); }
  open(id: string) { this.router.navigate(['/app/fields', id]); }

  onCreated(f: FieldRec) {
    this.toast.success(`Field ${f.code} added`, `${f.area_ha.toFixed(2)} ha, computed from the boundary.`);
    this.router.navigate(['/app/fields', f.id]);
  }
}
