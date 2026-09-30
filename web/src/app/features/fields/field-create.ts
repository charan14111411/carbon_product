import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { Icon } from '../../ui/icon';
import { Callout, Modal } from '../../ui/kit';
import { AttrInputs, missingRequired } from './attr-inputs';
import { BoundaryEditor } from './boundary-editor';
import { Crop, Farm, FarmerLite, FieldRec } from './field-data';
import { LngLat, selfIntersects, toPolygon } from './field-geo';

export interface OverlapInfo { message: string; fieldId?: string; fieldCode?: string }

export function overlapOf(e: ApiError): OverlapInfo | null {
  if (e.code !== 'OVERLAPPING_FIELD') return null;
  return { message: e.message, fieldId: e.details['field_id'] as string, fieldCode: e.details['field_code'] as string };
}

/** Create a field: farm, name, crop + attributes, and a drawn or pasted boundary. */
@Component({
  selector: 'vc-field-create',
  imports: [FormsModule, RouterLink, Modal, Callout, Icon, BoundaryEditor, AttrInputs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" title="Add a field" width="1080px"
      subtitle="Map the boundary and link the field to a farm. The official area is computed from the boundary when you save.">
      <div class="layout">
        <div class="details">
          <h3 class="sec">Field details</h3>
          <div class="field">
            <label for="farm-q">Farm</label>
            <input id="farm-q" class="input" placeholder="Search farm, farmer or village…" [ngModel]="farmQ()" (ngModelChange)="farmQ.set($event)" />
            <select class="input" size="5" [ngModel]="farmId()" (ngModelChange)="farmId.set($event)" aria-label="Farm">
              @for (f of farmOptions(); track f.id) {
                <option [value]="f.id">{{ f.name }} — {{ farmerName(f.farmer_id) }}{{ f.village ? ' · ' + f.village : '' }}</option>
              } @empty { <option disabled>No farms match</option> }
            </select>
            <span class="hint">Every field belongs to a farm. Add the farm on the farmer's page first if it isn't listed.</span>
          </div>
          <div class="field">
            <label for="f-name">Field name</label>
            <input id="f-name" class="input" [ngModel]="name()" (ngModelChange)="name.set($event)" placeholder="e.g. Upper terrace, east of the well" />
          </div>
          <div class="field">
            <label for="f-crop">Main crop</label>
            <select id="f-crop" class="input" [ngModel]="cropCode()" (ngModelChange)="cropCode.set($event); attrs.set({})">
              <option value="">Not set yet</option>
              @for (c of crops(); track c.code) { <option [value]="c.code">{{ c.name }}{{ c.local_name ? ' (' + c.local_name + ')' : '' }}</option> }
            </select>
          </div>
          @if (crop()?.attributes?.length) {
            <div class="attrs">
              <div class="label">{{ crop()!.name }} details</div>
              <vc-attr-inputs [defs]="crop()!.attributes" [(values)]="attrs" />
            </div>
          }
          <div class="form-grid">
            <div class="field">
              <label for="f-soil">Soil type <span class="subtle">(optional)</span></label>
              <input id="f-soil" class="input" [ngModel]="soil()" (ngModelChange)="soil.set($event)" placeholder="e.g. Red laterite" />
            </div>
            <div class="field">
              <label for="f-elev">Elevation <span class="subtle">(optional)</span></label>
              <div class="unit-wrap"><input id="f-elev" type="number" class="input num" [ngModel]="elev()" (ngModelChange)="elev.set($event)" /><span class="unit">m</span></div>
            </div>
          </div>
        </div>

        <div class="boundary">
          <h3 class="sec">Boundary</h3>
          <vc-boundary-editor [(vertices)]="vertices" [context]="context()" mapHeight="440px" />
        </div>
      </div>

      @if (overlap(); as o) {
        <vc-callout tone="danger" icon="alert" class="mt">
          <strong>This boundary overlaps field {{ o.fieldCode }}.</strong> {{ o.message }}
          @if (o.fieldId) { <a [routerLink]="['/app/fields', o.fieldId]" target="_blank" class="lnk">Open {{ o.fieldCode }} <vc-icon name="external-link" [size]="12" /></a> }
        </vc-callout>
      } @else if (error()) {
        <vc-callout tone="danger" icon="alert" class="mt">{{ error() }}</vc-callout>
      }

      <div footer class="ft">
        <span class="foot-note subtle small">{{ problem() ?? 'Ready to save' }}</span>
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!problem() || saving()" (click)="save()">
          <vc-icon name="check" />{{ saving() ? 'Saving…' : 'Save field' }}
        </button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .layout{display:grid;grid-template-columns:320px minmax(0,1fr);gap:24px}
    @media (max-width: 980px){.layout{grid-template-columns:1fr}}
    .details{display:flex;flex-direction:column;gap:14px}
    .sec{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:2px}
    .boundary .sec{margin-bottom:10px}
    select[size]{height:auto;padding:4px}
    select[size] option{padding:6px 8px;border-radius:4px}
    .attrs{padding:12px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--border);display:flex;flex-direction:column;gap:10px}
    .unit-wrap{position:relative} .unit-wrap .input{padding-right:36px}
    .unit{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--text-3)}
    .mt{margin-top:16px}
    .lnk{display:inline-flex;align-items:center;gap:4px;margin-left:6px;font-weight:500}
    .ft{display:flex;align-items:center;gap:8px;width:100%}
    .foot-note{margin-right:auto}
  `],
})
export class FieldCreate {
  private api = inject(ApiService);
  open = model(false);
  context = input<GeoJSON.FeatureCollection | null>(null);
  /** Pre-select a farm, e.g. when opened from a farmer page. */
  presetFarmId = input<string | null>(null);
  created = output<FieldRec>();

  farms = signal<Farm[]>([]);
  farmers = signal<Map<string, FarmerLite>>(new Map());
  crops = signal<Crop[]>([]);

  farmQ = signal('');
  farmId = signal('');
  name = signal('');
  cropCode = signal('');
  attrs = signal<Record<string, unknown>>({});
  soil = signal('');
  elev = signal<number | null>(null);
  vertices = signal<LngLat[]>([]);
  saving = signal(false);
  error = signal<string | null>(null);
  overlap = signal<ReturnType<typeof overlapOf>>(null);
  private loaded = false;

  crop = computed(() => this.crops().find(c => c.code === this.cropCode()) ?? null);
  farmOptions = computed(() => {
    const q = this.farmQ().toLowerCase().trim();
    return this.farms().filter(f => !q || `${f.name} ${f.village} ${this.farmerName(f.farmer_id)}`.toLowerCase().includes(q)).slice(0, 200);
  });
  problem = computed(() => {
    if (!this.farmId()) return 'Choose a farm';
    if (!this.name().trim()) return 'Give the field a name';
    if (this.vertices().length < 3) return 'Draw at least 3 corners';
    if (selfIntersects(this.vertices())) return 'The outline crosses itself';
    const miss = missingRequired(this.crop()?.attributes ?? [], this.attrs());
    if (miss.length) return `Fill in: ${miss.join(', ')}`;
    return null;
  });

  constructor() {
    effect(() => {
      if (this.open() && !this.loaded) { this.loaded = true; this.loadLookups(); }
      if (this.open()) { const p = this.presetFarmId(); if (p) this.farmId.set(p); }
    });
  }

  farmerName(id: string) { return this.farmers().get(id)?.full_name ?? 'Unknown farmer'; }

  private loadLookups() {
    this.api.get<Farm[]>('/farms').subscribe({ next: r => this.farms.set(r) });
    this.api.get<Page<FarmerLite>>('/farmers', { limit: 500 }).subscribe({
      next: r => this.farmers.set(new Map(r.items.map(f => [f.id, f]))),
    });
    this.api.get<Crop[]>('/catalogue/crops').subscribe({ next: r => this.crops.set(r) });
  }

  save() {
    if (this.problem()) return;
    this.saving.set(true);
    this.error.set(null);
    this.overlap.set(null);
    this.api.post<FieldRec>('/fields', {
      farm_id: this.farmId(), name: this.name().trim(), boundary: toPolygon(this.vertices()),
      crop_code: this.cropCode() || null, crop_attributes: this.attrs(), soil_type: this.soil().trim() || null,
      elevation_m: this.elev() === null || (this.elev() as unknown) === '' ? null : Number(this.elev()),
    }).subscribe({
      next: f => {
        this.saving.set(false);
        this.created.emit(f);
        this.reset();
        this.open.set(false);
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        const o = overlapOf(e);
        if (o) this.overlap.set(o);
        else this.error.set(e.message);
      },
    });
  }

  private reset() {
    this.name.set(''); this.cropCode.set(''); this.attrs.set({}); this.soil.set(''); this.elev.set(null);
    this.vertices.set([]); this.farmQ.set('');
  }
}
