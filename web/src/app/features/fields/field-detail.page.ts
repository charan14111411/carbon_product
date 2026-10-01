import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { humanize, Badge, Callout, DataClass, Empty, ErrorBox, Loading, Modal, Tabs } from '../../ui/kit';
import { FieldMap } from './field-map';
import { AttrInputs, missingRequired } from './attr-inputs';
import { BoundaryEditor } from './boundary-editor';
import { BoundaryHistory } from './boundary-history';
import { Chip } from './chip';
import { OverlapInfo, overlapOf } from './field-create';
import { Crop, Farm, FarmerLite, FieldRec, Practice, PracticeType, cropColorMap, SOURCE_LABEL } from './field-data';
import { LngLat, outerRing, selfIntersects, toPolygon } from './field-geo';
import { LandUse } from './land-use';
import { SiteCharacteristics } from './site-characteristics';
import { TenurePanel } from './tenure';
import { EligibilitySummary } from './eligibility-summary';
import { Tenure, UserLite } from './site-data';

@Component({
  selector: 'vc-field-detail',
  imports: [
    FormsModule, RouterLink, Icon, Badge, DataClass, Empty, ErrorBox, Loading, Modal, Tabs, Callout, FieldMap, Chip,
    AttrInputs, BoundaryEditor, BoundaryHistory, LandUse, SiteCharacteristics, TenurePanel, EligibilitySummary, NumPipe, DayPipe, HumanPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/fields" class="back"><vc-icon name="arrow-left" [size]="14" />All fields</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this field" [message]="error()!" />
    } @else if (field(); as f) {
      <header class="hdr">
        <div class="t">
          <div class="eyebrow mono">{{ f.code }}</div>
          <div class="row-t"><h1>{{ f.name }}</h1><vc-badge [status]="f.status" /></div>
          <p class="sub">
            @if (farm()) { {{ farm()!.name }}@if (farm()!.village) {, {{ farm()!.village }}}@if (farm()!.district) {, {{ farm()!.district }}} }
          </p>
        </div>
        @if (auth.can('land.manage')) {
          <div class="actions">
            <button class="btn btn-secondary" (click)="openEdit()"><vc-icon name="pencil" />Edit details</button>
            @if (f.status === 'active') {
              <button class="btn btn-secondary" (click)="openBoundary()"><vc-icon name="pen-line" />Edit boundary</button>
              <button class="btn btn-ghost" (click)="statusOpen.set(true)"><vc-icon name="archive" />Retire</button>
            } @else {
              <button class="btn btn-secondary" (click)="statusOpen.set(true)"><vc-icon name="undo" />Reactivate</button>
            }
          </div>
        }
      </header>

      <div class="top">
        <section class="card map-card">
          <vc-field-map [polygons]="mapData()" height="100%" [maxZoom]="17" />
        </section>
        <section class="card facts">
          <div class="area-tile">
            <div class="a-top"><span>Area</span><vc-dc cls="CALCULATED" /></div>
            <div class="a-val num">{{ f.area_ha | num: 2 }}<small>ha</small></div>
            <div class="a-note">Computed from the boundary (version {{ f.version }}), not entered by hand.</div>
          </div>
          <dl class="kv">
            <dt>Crop</dt>
            <dd>
              @if (crop()) { <vc-chip [swatch]="cropColor()" tone="outline">{{ crop()!.name }}</vc-chip> }
              @else if (f.crop_code) { <code>{{ f.crop_code }}</code> }
              @else { <span class="subtle">Not set</span> }
            </dd>
            @for (a of attrRows(); track a.key) { <dt>{{ a.label }}</dt><dd>{{ a.value }}</dd> }
            <dt>Soil type</dt><dd>{{ f.soil_type || '—' }}</dd>
            <dt>Elevation</dt><dd class="num">{{ f.elevation_m !== null ? (f.elevation_m | num: 0) + ' m' : '—' }}</dd>
            <dt>Centre point</dt><dd class="mono small">{{ f.centroid_lat.toFixed(5) }}, {{ f.centroid_lon.toFixed(5) }}</dd>
            <dt>Farmer</dt>
            <dd>@if (farmer()) { <a [routerLink]="['/app/farmers', farmer()!.id]">{{ farmer()!.full_name }}</a>&nbsp;<span class="subtle small mono">{{ farmer()!.code }}</span> } @else { — }</dd>
            <dt>Farm</dt><dd>{{ farm()?.name ?? '—' }}</dd>
            <dt>Last changed</dt><dd>{{ f.updated_at | day: true }}</dd>
          </dl>
          <div class="links">
            <a class="lk" [routerLink]="['/app/supporting']" [queryParams]="{ field_id: f.id }">
              <span class="li-ic"><vc-icon name="rain" [size]="16" /></span>
              <span><strong>Supporting data</strong><small>Weather, soil maps and terrain for this field</small></span>
              <vc-icon name="chevron-right" [size]="15" />
            </a>
            <a class="lk" [routerLink]="['/app/satellite']" [queryParams]="{ field_id: f.id }">
              <span class="li-ic"><vc-icon name="satellite" [size]="16" /></span>
              <span><strong>Satellite</strong><small>Vegetation index and practice detection</small></span>
              <vc-icon name="chevron-right" [size]="15" />
            </a>
          </div>
        </section>
      </div>

      <div class="mid">
        <vc-site-characteristics [field]="f" (changed)="field.set($event)" />
        <vc-eligibility-summary [fieldId]="f.id" [tenure]="tenure()" />
      </div>

      <section class="card tabs-card">
        <div class="tabs-pad"><vc-tabs [tabs]="tabs()" [(active)]="tab" /></div>
        @switch (tab()) {
          @case ('boundary') { <vc-boundary-history [fieldId]="f.id" [refresh]="f.version" /> }
          @case ('land') { <vc-land-use [fieldId]="f.id" /> }
          @case ('tenure') {
            <vc-tenure [fieldId]="f.id" [farmerId]="farm()?.farmer_id ?? null" [farmerName]="farmer()?.full_name ?? ''" [users]="users()" (changed)="tenure.set($event)" />
          }
          @case ('practices') {
            @if (practicesLoading()) { <vc-loading [rows]="4" /> }
            @else if (!practices().length) {
              <vc-empty icon="sprout" title="No practices recorded" text="Practices recorded in the field app, by partners or here appear in this list.">
                <a class="btn btn-secondary" routerLink="/app/practices" [queryParams]="{ field_id: f.id, record: 1 }"><vc-icon name="plus" />Record a practice</a>
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Date</th><th>Practice</th><th>Scenario</th><th class="num">Quantity</th><th>Source</th><th>Evidence</th><th></th></tr></thead>
                  <tbody>
                    @for (p of practices(); track p.id) {
                      <tr class="clickable" [routerLink]="['/app/practices']" [queryParams]="{ record_id: p.record_id }">
                        <td class="nowrap">{{ p.performed_on | day }}</td>
                        <td>{{ ptName(p.practice_code) }}</td>
                        <td><vc-chip [tone]="p.scenario === 'baseline' ? 'outline' : 'forest'">{{ p.scenario | human }}</vc-chip></td>
                        <td class="num nowrap">{{ p.quantity !== null ? (p.quantity | num: 2) + ' ' + (p.unit ?? '') : '—' }}</td>
                        <td class="muted">{{ source(p.source) }}</td>
                        <td>@if (p.missing_evidence) { <vc-badge status="warning">Missing</vc-badge> } @else if (p.evidence_ids.length) { <span class="muted small">{{ p.evidence_ids.length }} file{{ p.evidence_ids.length === 1 ? '' : 's' }}</span> } @else { <span class="subtle">—</span> }</td>
                        <td class="num"><vc-icon name="chevron-right" [size]="14" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          }
        }
      </section>

      <!-- edit details -->
      <vc-modal [(open)]="editOpen" title="Edit field details" subtitle="Changes are recorded in the audit log." width="560px">
        <div class="stack">
          <div class="field"><label for="e-name">Field name</label><input id="e-name" class="input" [ngModel]="eName()" (ngModelChange)="eName.set($event)" /></div>
          <div class="field">
            <label for="e-crop">Main crop</label>
            <select id="e-crop" class="input" [ngModel]="eCrop()" (ngModelChange)="eCrop.set($event); eAttrs.set({})">
              <option value="">Not set</option>
              @for (c of activeCrops(); track c.code) { <option [value]="c.code">{{ c.name }}</option> }
            </select>
          </div>
          @if (eCropDef()?.attributes?.length) {
            <div class="attrs"><vc-attr-inputs [defs]="eCropDef()!.attributes" [(values)]="eAttrs" /></div>
          }
          <div class="form-grid">
            <div class="field"><label for="e-soil">Soil type</label><input id="e-soil" class="input" [ngModel]="eSoil()" (ngModelChange)="eSoil.set($event)" /></div>
            <div class="field"><label for="e-elev">Elevation (m)</label><input id="e-elev" type="number" class="input num" [ngModel]="eElev()" (ngModelChange)="eElev.set($event)" /></div>
          </div>
        </div>
        @if (editError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ editError() }}</vc-callout> }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="editOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!!editProblem() || saving()" [title]="editProblem() ?? ''" (click)="saveEdit()">{{ saving() ? 'Saving…' : 'Save changes' }}</button>
        </div>
      </vc-modal>

      <!-- edit boundary -->
      <vc-modal [(open)]="boundaryOpen" title="Edit boundary" width="1040px"
        subtitle="Move, add or remove corners. The previous boundary is kept as a version; the area is recomputed on save.">
        <vc-boundary-editor [(vertices)]="bVerts" [context]="neighbours()" mapHeight="440px" />
        <div class="field reason">
          <label for="b-reason">Why is the boundary changing? <span class="req">*</span></label>
          <textarea id="b-reason" class="input" rows="2" [ngModel]="bReason()" (ngModelChange)="bReason.set($event)"
            placeholder="e.g. Re-walked with GPS; the eastern edge follows the new fence line"></textarea>
          <span class="hint">Required — at least 5 characters. Shown in the boundary history.</span>
        </div>
        @if (bOverlap(); as o) {
          <vc-callout tone="danger" icon="alert" class="mt">
            <strong>This boundary overlaps field {{ o.fieldCode }}.</strong> {{ o.message }}
            @if (o.fieldId) { <a [routerLink]="['/app/fields', o.fieldId]" target="_blank">Open {{ o.fieldCode }}</a> }
          </vc-callout>
        } @else if (bError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ bError() }}</vc-callout> }
        <div footer class="ft">
          <span class="subtle small grow">{{ boundaryProblem() ?? 'Ready to save as version ' + (f.version + 1) }}</span>
          <button class="btn btn-ghost" (click)="boundaryOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!!boundaryProblem() || saving()" (click)="saveBoundary()">{{ saving() ? 'Saving…' : 'Save new boundary' }}</button>
        </div>
      </vc-modal>

      <!-- retire / reactivate -->
      <vc-modal [(open)]="statusOpen" [title]="f.status === 'active' ? 'Retire this field?' : 'Reactivate this field?'" width="480px">
        @if (f.status === 'active') {
          <p>Retired fields stay in the records and audit trail but can't be enrolled or sampled. A field that is enrolled in a project must be withdrawn first.</p>
        } @else {
          <p>The field becomes active again. Its boundary is checked for overlaps with other active fields.</p>
        }
        @if (statusError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ statusError() }}</vc-callout> }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="statusOpen.set(false)">Cancel</button>
          <button class="btn" [class.btn-danger]="f.status === 'active'" [class.btn-primary]="f.status !== 'active'" [disabled]="saving()" (click)="toggleStatus()">
            {{ f.status === 'active' ? 'Retire field' : 'Reactivate field' }}
          </button>
        </div>
      </vc-modal>
    }
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:14px}
    .back:hover{color:var(--forest-700);text-decoration:none}
    .hdr{display:flex;align-items:flex-end;gap:16px;margin-bottom:20px;flex-wrap:wrap}
    .t{flex:1;min-width:260px}
    .eyebrow{font-size:12px;font-weight:600;color:var(--forest-500);letter-spacing:.04em;margin-bottom:4px}
    .row-t{display:flex;align-items:center;gap:12px}
    .sub{margin-top:4px;color:var(--text-2)}
    .actions{display:flex;gap:8px;flex-wrap:wrap}
    .top{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(320px,1fr);gap:16px;margin-bottom:16px}
    @media (max-width: 1100px){.top{grid-template-columns:1fr}.map-card{height:380px}}
    .map-card{position:relative;overflow:hidden;min-height:440px}
    .map-card vc-field-map{position:absolute;inset:0;border:0}
    .facts{display:flex;flex-direction:column}
    .area-tile{margin:16px 16px 4px;padding:16px;border-radius:var(--radius);background:linear-gradient(150deg,var(--forest-800),var(--forest-600));color:#fff}
    .a-top{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:rgba(255,255,255,.75)}
    .a-val{font-size:32px;font-weight:600;letter-spacing:-.02em;margin-top:4px}
    .a-val small{font-size:14px;font-weight:500;margin-left:5px;color:rgba(255,255,255,.72)}
    .a-note{font-size:12px;color:rgba(255,255,255,.75);margin-top:2px}
    .kv{padding:16px 20px;grid-template-columns:minmax(110px,36%) 1fr}
    .links{margin-top:auto;border-top:1px solid var(--border)}
    .lk{display:flex;align-items:center;gap:12px;padding:12px 16px;color:var(--stone-800);border-bottom:1px solid var(--stone-100)}
    .lk:last-child{border-bottom:0}
    .lk:hover{background:var(--forest-50);text-decoration:none}
    .lk > span:nth-child(2){flex:1;display:flex;flex-direction:column}
    .lk strong{font-weight:500;font-size:13.5px} .lk small{font-size:12px;color:var(--text-3)}
    .li-ic{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;background:var(--sky-100);color:var(--sky-600)}
    .lk:nth-child(2) .li-ic{background:var(--violet-100);color:var(--violet-600)}
    .mid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(320px,1fr);gap:16px;margin-bottom:16px;align-items:start}
    @media (max-width: 1100px){.mid{grid-template-columns:1fr}}
    .tabs-card{overflow:hidden}
    .tabs-pad{padding:4px 12px 0}
    .tabs-pad vc-tabs{margin-bottom:0;border-bottom:0}
    .tabs-card > :not(.tabs-pad){border-top:1px solid var(--border)}
    .attrs{padding:12px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--border)}
    .reason{margin-top:16px} .req{color:var(--danger)}
    .mt{margin-top:14px}
    .ft{display:flex;gap:8px;align-items:center;width:100%;justify-content:flex-end}
    .grow{margin-right:auto}
  `],
})
export class FieldDetailPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  id = input.required<string>();
  /** Optional ?tab= deep link (boundary, land, tenure, practices). */
  tabParam = input<string | undefined>(undefined, { alias: 'tab' });
  users = signal<UserLite[]>([]);
  tenure = signal<Tenure[] | null>(null);

  field = signal<FieldRec | null>(null);
  farm = signal<Farm | null>(null);
  farmer = signal<FarmerLite | null>(null);
  crops = signal<Crop[]>([]);
  pts = signal<PracticeType[]>([]);
  practices = signal<Practice[]>([]);
  practicesLoading = signal(true);
  neighboursRaw = signal<GeoJSON.FeatureCollection | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  tab = signal('boundary');
  saving = signal(false);

  crop = computed(() => this.crops().find(c => c.code === this.field()?.crop_code) ?? null);
  activeCrops = computed(() => this.crops().filter(c => c.is_active || c.code === this.field()?.crop_code));
  cropColor = computed(() => cropColorMap(this.crops().map(c => c.code)).get(this.field()?.crop_code ?? '') ?? '#737c76');
  attrRows = computed(() => {
    const f = this.field();
    if (!f) return [];
    const defs = this.crop()?.attributes ?? [];
    const keys = new Set([...defs.map(d => d.key), ...Object.keys(f.crop_attributes ?? {})]);
    return [...keys].filter(k => f.crop_attributes?.[k] !== undefined).map(k => {
      const d = defs.find(x => x.key === k);
      return { key: k, label: d?.label ?? k, value: `${humanize(String(f.crop_attributes[k]))}${d?.unit ? ' ' + d.unit : ''}` };
    });
  });
  tabs = computed(() => [
    { key: 'boundary', label: 'Boundary history', count: this.field()?.version ?? null },
    { key: 'land', label: 'Land-use history' },
    { key: 'tenure', label: 'Land tenure', count: this.tenure()?.length ?? null },
    { key: 'practices', label: 'Practices', count: this.practicesLoading() ? null : this.practices().length },
  ]);
  mapData = computed<GeoJSON.FeatureCollection | null>(() => {
    const f = this.field();
    if (!f) return null;
    return { type: 'FeatureCollection', features: [{ type: 'Feature', id: f.id, geometry: f.boundary, properties: { id: f.id, color: this.cropColor(), label: `<strong>${f.code}</strong> · ${f.area_ha.toFixed(2)} ha` } }] };
  });
  neighbours = computed<GeoJSON.FeatureCollection | null>(() => {
    const n = this.neighboursRaw();
    return n ? { ...n, features: n.features.filter(x => String(x.id) !== this.id()) } : null;
  });

  // edit details
  editOpen = signal(false);
  eName = signal(''); eCrop = signal(''); eAttrs = signal<Record<string, unknown>>({}); eSoil = signal(''); eElev = signal<number | null>(null);
  editError = signal<string | null>(null);
  eCropDef = computed(() => this.crops().find(c => c.code === this.eCrop()) ?? null);
  editProblem = computed(() => {
    if (!this.eName().trim()) return 'Name is required';
    const miss = missingRequired(this.eCropDef()?.attributes ?? [], this.eAttrs());
    return miss.length ? `Fill in: ${miss.join(', ')}` : null;
  });

  // boundary
  boundaryOpen = signal(false);
  bVerts = signal<LngLat[]>([]);
  bReason = signal('');
  bError = signal<string | null>(null);
  bOverlap = signal<OverlapInfo | null>(null);
  boundaryProblem = computed(() => {
    if (this.bVerts().length < 3) return 'At least 3 corners are needed';
    if (selfIntersects(this.bVerts())) return 'The outline crosses itself';
    if (this.bReason().trim().length < 5) return 'Say why the boundary is changing';
    return null;
  });

  statusOpen = signal(false);
  statusError = signal<string | null>(null);

  constructor() {
    this.api.get<Crop[]>('/catalogue/crops', { include_inactive: true }).subscribe({ next: r => this.crops.set(r) });
    this.api.get<PracticeType[]>('/catalogue/practice-types', { include_inactive: true }).subscribe({ next: r => this.pts.set(r) });
    this.api.get<UserLite[]>('/users').subscribe({ next: r => this.users.set(r), error: () => {} });
    effect(() => { const id = this.id(); untracked(() => this.load(id)); });
    effect(() => { const t = this.tabParam(); if (t) untracked(() => this.tab.set(t)); });
  }

  load(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<FieldRec>(`/fields/${id}`).subscribe({
      next: f => {
        this.field.set(f);
        this.loading.set(false);
        this.api.get<Farm>(`/farms/${f.farm_id}`).subscribe({
          next: farm => {
            this.farm.set(farm);
            this.api.get<FarmerLite>(`/farmers/${farm.farmer_id}`).subscribe({ next: fr => this.farmer.set(fr), error: () => {} });
          },
          error: () => {},
        });
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    this.tenure.set(null);
    this.api.get<Tenure[]>(`/fields/${id}/tenure`).subscribe({ next: r => this.tenure.set(r), error: () => this.tenure.set([]) });
    this.practicesLoading.set(true);
    this.api.get<Page<Practice>>('/practices', { field_id: id, limit: 200 }).subscribe({
      next: r => { this.practices.set(r.items); this.practicesLoading.set(false); },
      error: () => this.practicesLoading.set(false),
    });
  }

  ptName(code: string) { return this.pts().find(p => p.code === code)?.name ?? code; }
  source(s: string) { return SOURCE_LABEL[s] ?? s; }

  openEdit() {
    const f = this.field()!;
    this.eName.set(f.name); this.eCrop.set(f.crop_code ?? ''); this.eAttrs.set({ ...(f.crop_attributes ?? {}) });
    this.eSoil.set(f.soil_type ?? ''); this.eElev.set(f.elevation_m);
    this.editError.set(null);
    this.editOpen.set(true);
  }

  saveEdit() {
    this.saving.set(true);
    const elev = this.eElev() as unknown;
    this.api.patch<FieldRec>(`/fields/${this.id()}`, {
      name: this.eName().trim(), crop_code: this.eCrop() || null, crop_attributes: this.eAttrs(),
      soil_type: this.eSoil().trim() || null, elevation_m: elev === null || elev === '' ? null : Number(elev),
    }).subscribe({
      next: f => { this.field.set(f); this.saving.set(false); this.editOpen.set(false); this.toast.success('Field updated'); },
      error: (e: ApiError) => { this.saving.set(false); this.editError.set(e.message); },
    });
  }

  openBoundary() {
    this.bVerts.set(outerRing(this.field()!.boundary));
    this.bReason.set(''); this.bError.set(null); this.bOverlap.set(null);
    if (!this.neighboursRaw()) {
      this.api.get<GeoJSON.FeatureCollection>('/fields/geojson').subscribe({ next: r => this.neighboursRaw.set(r) });
    }
    this.boundaryOpen.set(true);
  }

  saveBoundary() {
    this.saving.set(true);
    this.bError.set(null); this.bOverlap.set(null);
    this.api.patch<FieldRec>(`/fields/${this.id()}`, { boundary: toPolygon(this.bVerts()), reason: this.bReason().trim() }).subscribe({
      next: f => {
        const before = this.field()!.area_ha;
        this.field.set(f);
        this.saving.set(false);
        this.boundaryOpen.set(false);
        this.tab.set('boundary');
        this.toast.success(`Boundary saved as version ${f.version}`, `Area ${before.toFixed(2)} → ${f.area_ha.toFixed(2)} ha`);
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        const o = overlapOf(e);
        if (o) this.bOverlap.set(o); else this.bError.set(e.message);
      },
    });
  }

  toggleStatus() {
    const next = this.field()!.status === 'active' ? 'retired' : 'active';
    this.saving.set(true);
    this.statusError.set(null);
    this.api.patch<FieldRec>(`/fields/${this.id()}`, { status: next }).subscribe({
      next: f => { this.field.set(f); this.saving.set(false); this.statusOpen.set(false); this.toast.success(next === 'retired' ? 'Field retired' : 'Field reactivated'); },
      error: (e: ApiError) => { this.saving.set(false); this.statusError.set(e.message); },
    });
  }
}
