import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { humanize, Callout, DataClass, Empty, ErrorBox, Loading, Modal } from '../../ui/kit';
import { Chip } from './chip';
import { FieldRec } from './field-data';
import {
  ASPECT_RELEVANT, IPCC_CLIMATE_ZONES, LAND_COVERS, SLOPE_CLASSES, SoilConflict, SoilSuggestion, TerrainSummary,
  TEXTURE_CLASSES, WRB_SOIL_GROUPS, compass, normCode, slopeClassLabel, slopeClassOf,
} from './site-data';

interface Row { key: string; label: string; value: string | null; unit?: string; dc: string; source: string; note?: string }
type SoilCol = 'soil_texture_class' | 'wrb_soil_group';

/**
 * VM0042 v2.2 Table 7 site characteristics for one field: what each value is, where it came from,
 * terrain from the elevation model and soil-map suggestions that a person can apply.
 */
@Component({
  selector: 'vc-site-characteristics',
  imports: [FormsModule, Icon, DataClass, Empty, ErrorBox, Loading, Modal, Callout, Chip, NumPipe, DayPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card' },
  template: `
    <div class="card-head hd">
      <div class="ttl">
        <h3>Site characteristics</h3>
        <vc-chip tone="outline">VM0042 §8.2 Table 7</vc-chip>
      </div>
      <div class="acts">
        @if (auth.can('data.sync')) {
          <button class="btn btn-secondary btn-sm" (click)="openTerrain()"><vc-icon name="mountain" [size]="14" />Refresh terrain</button>
        }
        @if (auth.can('land.manage')) {
          <button class="btn btn-secondary btn-sm" (click)="openEdit()"><vc-icon name="pencil" [size]="14" />Edit</button>
        }
      </div>
    </div>
    <p class="intro">Control sites must match the fields they stand for on each of these. Missing values leave the comparison incomplete.</p>

    <div class="attrs">
      @for (r of rows(); track r.key) {
        <div class="attr">
          <div class="a-lbl">{{ r.label }}</div>
          @if (r.value !== null) {
            <div class="a-val">{{ r.value }}@if (r.unit) {<small>{{ r.unit }}</small>}</div>
            <div class="a-src"><vc-dc [cls]="r.dc" /><span>{{ r.source }}</span></div>
          } @else {
            <div class="a-val none">Not recorded</div>
            <div class="a-src"><span>{{ r.source }}</span></div>
          }
          @if (r.note) { <div class="a-note">{{ r.note }}</div> }
        </div>
      }
    </div>

    <div class="split">
      <!-- terrain -->
      <section class="sub">
        <div class="sub-h">
          <vc-icon name="mountain" [size]="15" /><strong>Terrain from the elevation model</strong>
          <vc-dc cls="DERIVED" />
        </div>
        @if (terrainLoading()) { <vc-loading [rows]="3" /> }
        @else if (terrainError()) { <vc-error title="Couldn't load terrain" [message]="terrainError()!" /> }
        @else if (latestTerrain(); as t) {
          <div class="t-meta small muted">Last refreshed {{ t.created_at | day: true }} · {{ t.provider }} · {{ t.n_cells }} cells of {{ t.cell_size_m | num: 0 }} m</div>
          <dl class="kv mini">
            <dt>Mean slope</dt><dd class="num">{{ t.slope_mean_pct | num: 1 }} %</dd>
            <dt>Most frequent class</dt><dd>{{ t.dominant_slope_class_label }}</dd>
            <dt>Aspect</dt><dd class="num">{{ t.aspect_deg !== null ? (t.aspect_deg | num: 0) + '° ' + dir(t.aspect_deg) : 'Flat — none' }}</dd>
            <dt>Mean elevation</dt><dd class="num">{{ t.elevation_mean_m | num: 0 }} m</dd>
          </dl>
          <div class="hist" [title]="'Share of the field in each Appendix 5 Table 10 slope class'">
            @for (h of hist(); track h.code) {
              <div class="h-row" [class.dom]="h.code === t.dominant_slope_class">
                <span class="h-l">{{ h.short }}</span>
                <span class="h-bar"><span [style.width.%]="h.share * 100"></span></span>
                <span class="h-v num">{{ h.share * 100 | num: 0 }} %</span>
              </div>
            }
          </div>
          @if (notWritten().length) {
            <p class="small muted t-foot">Not written to the field because a value was already there: {{ notWritten().join(', ') }}. Refresh with “replace existing values” to overwrite.</p>
          }
        } @else {
          <vc-empty icon="mountain" title="No terrain computed yet" text="Refresh terrain to work out slope, aspect and elevation from the elevation model over this boundary." />
        }
      </section>

      <!-- soil suggestions -->
      <section class="sub">
        <div class="sub-h">
          <vc-icon name="layers" [size]="15" /><strong>Soil-map suggestions</strong>
          <vc-dc cls="MODELLED" />
          <span class="spacer"></span>
          @if (auth.can('data.sync')) {
            <button class="btn btn-ghost btn-sm" [disabled]="soilBusy()" (click)="refreshSoil()"><vc-icon name="refresh" [size]="13" />{{ soilBusy() ? 'Asking…' : 'Get suggestion' }}</button>
          }
        </div>
        <p class="small muted">A soil map’s estimate is never applied on its own — a person confirms it.</p>
        @if (soilLoading()) { <vc-loading [rows]="3" /> }
        @else if (soilError()) { <vc-error title="Couldn't load soil suggestions" [message]="soilError()!" /> }
        @else if (!soil().length) {
          <vc-empty icon="layers" title="No suggestions yet" text="Ask the soil map for this field’s texture class and WRB soil group." />
        } @else {
          <ul class="sugg">
            @for (s of soilShown(); track s.id) {
              <li>
                <div class="s-main">
                  <div class="s-vals">
                    <span><span class="k">Texture</span> {{ texLabel(s.soil_texture_class) }}</span>
                    <span><span class="k">WRB</span> {{ s.wrb_soil_group ?? '—' }}@if (s.wrb_probability !== null) {<span class="subtle num"> · {{ s.wrb_probability * 100 | num: 0 }} % likely</span>}</span>
                  </div>
                  <div class="s-meta small subtle">
                    {{ s.created_at | day: true }} · {{ s.provider }}
                    @if (s.properties['clay_pct'] !== undefined) { · <span class="num">sand {{ s.properties['sand_pct'] | num: 0 }} / silt {{ s.properties['silt_pct'] | num: 0 }} / clay {{ s.properties['clay_pct'] | num: 0 }} %</span> }
                  </div>
                </div>
                @if (isApplied(s)) {
                  <span class="applied"><vc-icon name="check" [size]="13" />Matches the field</span>
                } @else if (auth.can('land.manage')) {
                  <button class="btn btn-secondary btn-sm" (click)="openApply(s)">Apply</button>
                }
              </li>
            }
          </ul>
          @if (soil().length > 3) {
            <button class="btn btn-ghost btn-sm more" (click)="soilAll.set(!soilAll())">{{ soilAll() ? 'Show fewer' : 'Show all ' + soil().length }}</button>
          }
        }
      </section>
    </div>

    <!-- edit -->
    <vc-modal [(open)]="editOpen" title="Edit site characteristics" subtitle="Values you enter are recorded as RECORDED and kept in the audit log." width="640px">
      <div class="form-grid">
        <div class="field">
          <label for="sc-slope">Slope (%)</label>
          <input id="sc-slope" type="number" min="0" max="300" step="0.1" class="input num" [ngModel]="eSlope()" (ngModelChange)="eSlope.set($event)" />
          @if (errs()['slope']) { <span class="error">{{ errs()['slope'] }}</span> }
          @else { <span class="hint">Class: {{ previewClass() }}</span> }
        </div>
        <div class="field">
          <label for="sc-aspect">Aspect (degrees from north)</label>
          <input id="sc-aspect" type="number" min="0" max="359.9" step="1" class="input num" [ngModel]="eAspect()" (ngModelChange)="eAspect.set($event)" />
          @if (errs()['aspect']) { <span class="error">{{ errs()['aspect'] }}</span> }
          @else { <span class="hint">0 = north, 90 = east. Compared only on hilly or steeper land.</span> }
        </div>
        <div class="field">
          <label for="sc-tex">Soil texture class (FAO)</label>
          <select id="sc-tex" class="input" [ngModel]="eTexture()" (ngModelChange)="eTexture.set($event)">
            <option value="">Not recorded</option>
            @for (t of textures; track t) { <option [value]="t">{{ t | human }}</option> }
          </select>
          <span class="hint">0–30 cm, from the texture triangle.</span>
        </div>
        <div class="field">
          <label for="sc-wrb">WRB reference soil group</label>
          <select id="sc-wrb" class="input" [ngModel]="eWrb()" (ngModelChange)="eWrb.set($event)">
            <option value="">Not recorded</option>
            @for (w of wrbs; track w) { <option [value]="w">{{ w }}</option> }
          </select>
        </div>
        <div class="field span-2">
          <label for="sc-eco">Terrestrial ecoregion (WWF)</label>
          <input id="sc-eco" class="input" maxlength="120" [ngModel]="eEco()" (ngModelChange)="eEco.set($event)" placeholder="e.g. South Deccan Plateau dry deciduous forests" />
          @if (errs()['eco']) { <span class="error">{{ errs()['eco'] }}</span> }
          @else { <span class="hint">Use the WWF ecoregion name as published, so fields and control sites compare exactly.</span> }
        </div>
        <div class="field">
          <label for="sc-cz">IPCC climate zone</label>
          <select id="sc-cz" class="input" [ngModel]="eClimate()" (ngModelChange)="eClimate.set($event)">
            <option value="">Not recorded</option>
            @for (c of zones; track c) { <option [value]="c">{{ c | human }}</option> }
          </select>
        </div>
        <div class="field">
          <label for="sc-map">Mean annual precipitation (mm)</label>
          <input id="sc-map" type="number" min="0" max="15000" step="1" class="input num" [ngModel]="ePrecip()" (ngModelChange)="ePrecip.set($event)" />
          @if (errs()['precip']) { <span class="error">{{ errs()['precip'] }}</span> }
          @else { <span class="hint">Control sites must be within ±100 mm.</span> }
        </div>
        <div class="field span-2">
          <span class="label">Land cover at the project start</span>
          <div class="seg">
            @for (c of covers; track c) {
              <button type="button" [class.on]="eCover() === c" (click)="eCover.set(c)">{{ c | human }}</button>
            }
          </div>
          <span class="hint">VM0042 §4 accepts cropland or grassland. Wetland is accepted only for flooded rice with hydrology evidence.</span>
        </div>
      </div>
      @if (editError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ editError() }}</vc-callout> }
      <div footer class="ft">
        <span class="subtle small grow">{{ changeCount() ? changeCount() + ' change' + (changeCount() === 1 ? '' : 's') : 'No changes yet' }}</span>
        <button class="btn btn-ghost" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="hasErrs() || !changeCount() || saving()" (click)="saveEdit()">{{ saving() ? 'Saving…' : 'Save changes' }}</button>
      </div>
    </vc-modal>

    <!-- terrain refresh -->
    <vc-modal [(open)]="terrainOpen" title="Refresh terrain" subtitle="Slope, aspect and elevation are worked out from an elevation model over the current boundary." width="520px">
      <p>The result is kept as a terrain record (DERIVED). Empty field values are filled in; values already on the field are kept unless you choose to replace them.</p>
      @if (hasTerrainValues()) {
        <label class="checkbox chk">
          <input type="checkbox" [ngModel]="force()" (ngModelChange)="force.set($event)" />
          <span>Replace the existing slope, aspect and elevation values</span>
        </label>
        @if (force()) { <vc-callout tone="warn" icon="alert" class="mt">Values entered by a person will be overwritten. The previous values stay in the audit log.</vc-callout> }
      }
      @if (terrainActionError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ terrainActionError() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="terrainOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="terrainBusy()" (click)="refreshTerrain()">{{ terrainBusy() ? 'Computing…' : 'Refresh terrain' }}</button>
      </div>
    </vc-modal>

    <!-- apply soil suggestion -->
    <vc-modal [(open)]="applyOpen" title="Apply soil-map suggestion?" subtitle="The chosen values are written to the field record and the change is audited." width="560px">
      @if (applyTarget(); as s) {
        <div class="table-wrap cmp">
          <table class="table">
            <thead><tr><th></th><th>Attribute</th><th>On the field now</th><th>Soil map suggests</th></tr></thead>
            <tbody>
              <tr>
                <td><input type="checkbox" [disabled]="!s.soil_texture_class" [ngModel]="colTex()" (ngModelChange)="colTex.set($event); conflicts.set([])" aria-label="Apply texture class" /></td>
                <td>Texture class</td>
                <td>{{ texLabel(field().soil_texture_class) }}</td>
                <td><strong>{{ texLabel(s.soil_texture_class) }}</strong></td>
              </tr>
              <tr>
                <td><input type="checkbox" [disabled]="!s.wrb_soil_group" [ngModel]="colWrb()" (ngModelChange)="colWrb.set($event); conflicts.set([])" aria-label="Apply WRB group" /></td>
                <td>WRB soil group</td>
                <td>{{ field().wrb_soil_group ?? '—' }}</td>
                <td><strong>{{ s.wrb_soil_group ?? '—' }}</strong>@if (s.wrb_probability !== null) { <span class="subtle small num"> ({{ s.wrb_probability * 100 | num: 0 }} %)</span> }</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="field mt">
          <label for="sa-note">Note <span class="subtle">(optional)</span></label>
          <textarea id="sa-note" class="input" rows="2" maxlength="2000" [ngModel]="applyNote()" (ngModelChange)="applyNote.set($event)" placeholder="e.g. Matches the texture seen in the 2025 soil pit"></textarea>
        </div>
        @if (conflicts().length) {
          <vc-callout tone="warn" icon="alert" class="mt">
            <strong>The field already has a different value.</strong>
            @for (c of conflicts(); track c.column) {
              <div>{{ c.column === 'wrb_soil_group' ? 'WRB soil group' : 'Texture class' }}: {{ c.column === 'wrb_soil_group' ? c.current : texLabel(c.current) }} → {{ c.column === 'wrb_soil_group' ? c.suggested : texLabel(c.suggested) }}</div>
            }
            Replace it with the soil map’s value? The previous value stays in the audit log.
          </vc-callout>
        }
        @if (applyError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ applyError() }}</vc-callout> }
      }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="applyOpen.set(false)">Cancel</button>
        @if (conflicts().length) {
          <button class="btn btn-danger" [disabled]="applyBusy()" (click)="apply(true)">{{ applyBusy() ? 'Applying…' : 'Replace existing values' }}</button>
        } @else {
          <button class="btn btn-primary" [disabled]="applyBusy() || (!colTex() && !colWrb())" (click)="apply(false)">{{ applyBusy() ? 'Applying…' : 'Apply to field' }}</button>
        }
      </div>
    </vc-modal>
  `,
  styles: [`
    :host{display:flex;flex-direction:column}
    .hd{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .ttl{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}
    .ttl h3{margin:0;flex:none}
    .acts{display:flex;gap:8px}
    .intro{padding:12px 20px 0;margin:0;font-size:13px;color:var(--text-2)}
    .attrs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--border);border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-top:14px}
    @media (max-width: 1280px){.attrs{grid-template-columns:repeat(2,minmax(0,1fr))}.attr:last-child:nth-child(odd){grid-column:1 / -1}}
    .attr{background:var(--surface);padding:12px 16px;display:flex;flex-direction:column;gap:3px;min-width:0}
    .a-lbl{font-size:12px;color:var(--text-3);font-weight:500}
    .a-val{font-size:15px;font-weight:600;color:var(--stone-900);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
    .a-val small{font-size:12px;font-weight:500;color:var(--text-3);margin-left:4px}
    .a-val.none{font-weight:400;color:var(--text-3);font-size:14px}
    .a-src{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--text-3);flex-wrap:wrap}
    .a-note{font-size:11.5px;color:var(--amber-600)}
    .split{display:grid;grid-template-columns:1fr;gap:0}
    .sub + .sub{border-top:1px solid var(--border)}
    @media (min-width: 1600px){.split{grid-template-columns:1fr 1fr}.sub + .sub{border-top:0;border-left:1px solid var(--border)}}
    .sub{padding:14px 18px;min-width:0}
    .sub-h{display:flex;align-items:center;gap:8px;margin-bottom:8px;color:var(--stone-800)}
    .sub-h strong{font-weight:600;font-size:13.5px}
    .t-meta{margin-bottom:6px}
    .kv.mini{grid-template-columns:auto 1fr;gap:4px 14px;font-size:13px;margin:0 0 10px}
    .hist{display:flex;flex-direction:column;gap:4px}
    .h-row{display:grid;grid-template-columns:120px 1fr 44px;gap:8px;align-items:center;font-size:11.5px;color:var(--text-2)}
    .h-row.dom{color:var(--stone-900);font-weight:600}
    .h-bar{height:8px;border-radius:4px;background:var(--sand-200);overflow:hidden}
    .h-bar span{display:block;height:100%;background:var(--dc-derived);border-radius:4px}
    .h-row:not(.dom) .h-bar span{opacity:.5}
    .h-v{text-align:right}
    .t-foot{margin-top:10px}
    .sugg{list-style:none;margin:6px 0 0;padding:0}
    .sugg li{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--stone-100)}
    .s-main{flex:1;min-width:0}
    .s-vals{display:flex;gap:14px;flex-wrap:wrap;font-size:13.5px;font-weight:500}
    .k{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3);margin-right:3px}
    .applied{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--forest-700);white-space:nowrap}
    .more{margin-top:4px}
    .seg{display:flex;gap:6px;flex-wrap:wrap}
    .seg button{height:32px;padding:0 12px;border:1px solid var(--border-strong);border-radius:7px;background:var(--surface);font:inherit;font-size:13px;cursor:pointer;color:var(--stone-800)}
    .seg button.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:0 0 0 1px var(--forest-500) inset}
    .chk{display:flex;gap:8px;align-items:center;margin-top:12px}
    .cmp td:first-child,.cmp th:first-child{width:28px}
    .mt{margin-top:14px}
    .ft{display:flex;gap:8px;align-items:center;width:100%;justify-content:flex-end}
    .grow{margin-right:auto}
  `],
})
export class SiteCharacteristics {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  field = input.required<FieldRec>();
  changed = output<FieldRec>();

  textures = TEXTURE_CLASSES;
  wrbs = WRB_SOIL_GROUPS;
  zones = IPCC_CLIMATE_ZONES;
  covers = LAND_COVERS;

  terrain = signal<TerrainSummary[]>([]);
  terrainLoading = signal(true);
  terrainError = signal<string | null>(null);
  soil = signal<SoilSuggestion[]>([]);
  soilLoading = signal(true);
  soilError = signal<string | null>(null);
  soilAll = signal(false);
  soilBusy = signal(false);

  latestTerrain = computed(() => this.terrain()[0] ?? null);
  soilShown = computed(() => (this.soilAll() ? this.soil() : this.soil().slice(0, 3)));
  hist = computed(() => {
    const t = this.latestTerrain();
    if (!t) return [];
    return SLOPE_CLASSES.map(c => ({ code: c.code, short: c.label.split(' (')[0].split(' /')[0], share: t.histogram?.[c.code]?.share ?? 0 }));
  });
  notWritten = computed(() => {
    const t = this.latestTerrain();
    if (!t?.applied) return [];
    const names: Record<string, string> = { slope_pct: 'slope', aspect_deg: 'aspect', elevation_m: 'elevation' };
    return Object.entries(t.applied).filter(([, a]) => !a.written && a.computed !== null && a.before !== null && a.before !== a.computed).map(([k]) => names[k] ?? k);
  });

  rows = computed<Row[]>(() => {
    const f = this.field();
    const slopeSrc = this.terrainSource('slope_pct', f.slope_pct);
    const aspectSrc = this.terrainSource('aspect_deg', f.aspect_deg);
    const texSug = this.soilSource('soil_texture_class', f.soil_texture_class);
    const wrbSug = this.soilSource('wrb_soil_group', f.wrb_soil_group);
    const hilly = ASPECT_RELEVANT.has(f.slope_class ?? '');
    const rec = 'Entered by a person';
    return [
      { key: 'slope', label: 'Slope', value: f.slope_pct !== null ? this.n(f.slope_pct, 1) : null, unit: '%',
        dc: slopeSrc ? 'DERIVED' : 'RECORDED', source: f.slope_pct === null ? 'Refresh terrain or enter it' : slopeSrc ?? rec },
      { key: 'class', label: 'Slope class (Appendix 5 Table 10)', value: f.slope_class ? slopeClassLabel(f.slope_class) : null,
        dc: 'DERIVED', source: f.slope_class ? 'Worked out from the slope' : 'Needs a slope value' },
      { key: 'aspect', label: 'Aspect', value: f.aspect_deg !== null ? `${this.n(f.aspect_deg, 0)}° ${compass(f.aspect_deg)}` : null,
        dc: aspectSrc ? 'DERIVED' : 'RECORDED', source: f.aspect_deg === null ? (hilly ? 'Needed on hilly land' : 'Optional on gentle slopes') : aspectSrc ?? rec,
        note: hilly && f.aspect_deg === null ? 'Hilly or steeper: control sites must face within 30°.' : undefined },
      { key: 'tex', label: 'Soil texture class (FAO)', value: f.soil_texture_class ? this.texLabel(f.soil_texture_class) : null,
        dc: texSug ? 'MODELLED' : 'RECORDED', source: f.soil_texture_class ? (texSug ? `Soil map (${texSug.provider}), applied by a person` : rec) : 'Apply a soil-map suggestion or enter it' },
      { key: 'wrb', label: 'WRB reference soil group', value: f.wrb_soil_group, dc: wrbSug ? 'MODELLED' : 'RECORDED',
        source: f.wrb_soil_group ? (wrbSug ? `Soil map (${wrbSug.provider}), applied by a person` : rec) : 'Apply a soil-map suggestion or enter it' },
      { key: 'eco', label: 'Terrestrial ecoregion (WWF)', value: f.ecoregion, dc: 'RECORDED', source: f.ecoregion ? rec : 'Enter the WWF ecoregion' },
      { key: 'cz', label: 'IPCC climate zone', value: f.climate_zone ? humanize(f.climate_zone) : null, dc: 'RECORDED', source: f.climate_zone ? rec : 'Choose the IPCC zone' },
      { key: 'map', label: 'Mean annual precipitation', value: f.mean_annual_precip_mm !== null ? this.n(f.mean_annual_precip_mm, 0) : null, unit: 'mm',
        dc: 'RECORDED', source: f.mean_annual_precip_mm !== null ? rec : 'Long-term mean from a station ≤ 50 km' },
      { key: 'cover', label: 'Land cover at start', value: humanize(f.land_cover || 'cropland'), dc: 'RECORDED', source: rec,
        note: f.land_cover && !['cropland', 'grassland'].includes(f.land_cover) ? 'Only cropland or grassland can be enrolled (VM0042 §4).' : undefined },
    ];
  });

  // edit
  editOpen = signal(false);
  eSlope = signal<number | string | null>(null);
  eAspect = signal<number | string | null>(null);
  eTexture = signal('');
  eWrb = signal('');
  eEco = signal('');
  eClimate = signal('');
  ePrecip = signal<number | string | null>(null);
  eCover = signal('cropland');
  editError = signal<string | null>(null);
  saving = signal(false);

  previewClass = computed(() => slopeClassLabel(slopeClassOf(this.numOrNull(this.eSlope()))));
  errs = computed(() => {
    const e: Record<string, string> = {};
    const s = this.numOrNull(this.eSlope()), a = this.numOrNull(this.eAspect()), p = this.numOrNull(this.ePrecip());
    if (s !== null && (s < 0 || s > 300)) e['slope'] = 'Between 0 and 300 %.';
    if (a !== null && (a < 0 || a >= 360)) e['aspect'] = 'From 0 up to (not including) 360°.';
    if (p !== null && (p < 0 || p > 15000)) e['precip'] = 'Between 0 and 15,000 mm.';
    const eco = this.eEco().trim();
    if (eco && eco.length < 2) e['eco'] = 'At least 2 characters.';
    return e;
  });
  hasErrs = computed(() => Object.keys(this.errs()).length > 0);
  patch = computed(() => {
    const f = this.field();
    const next: Record<string, unknown> = {
      slope_pct: this.numOrNull(this.eSlope()), aspect_deg: this.numOrNull(this.eAspect()),
      soil_texture_class: this.eTexture() || null, wrb_soil_group: this.eWrb() || null,
      ecoregion: this.eEco().trim() || null, climate_zone: this.eClimate() || null,
      mean_annual_precip_mm: this.numOrNull(this.ePrecip()), land_cover: this.eCover(),
    };
    const cur: Record<string, unknown> = {
      slope_pct: f.slope_pct, aspect_deg: f.aspect_deg, soil_texture_class: f.soil_texture_class ? normCode(f.soil_texture_class) : null,
      wrb_soil_group: f.wrb_soil_group, ecoregion: f.ecoregion, climate_zone: f.climate_zone,
      mean_annual_precip_mm: f.mean_annual_precip_mm, land_cover: f.land_cover || 'cropland',
    };
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(next)) if (next[k] !== cur[k]) out[k] = next[k];
    return out;
  });
  changeCount = computed(() => Object.keys(this.patch()).length);

  // terrain
  terrainOpen = signal(false);
  force = signal(false);
  terrainBusy = signal(false);
  terrainActionError = signal<string | null>(null);
  hasTerrainValues = computed(() => { const f = this.field(); return f.slope_pct !== null || f.aspect_deg !== null || f.elevation_m !== null; });

  // soil apply
  applyOpen = signal(false);
  applyTarget = signal<SoilSuggestion | null>(null);
  colTex = signal(true);
  colWrb = signal(true);
  applyNote = signal('');
  applyBusy = signal(false);
  applyError = signal<string | null>(null);
  conflicts = signal<SoilConflict[]>([]);

  constructor() {
    effect(() => { const id = this.field().id; untracked(() => { this.loadTerrain(id); this.loadSoil(id); }); });
  }

  private n(v: number, d: number) { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: d }).format(v); }
  private numOrNull(v: unknown): number | null { return v === null || v === undefined || v === '' ? null : Number(v); }
  dir(d: number | null) { return compass(d); }
  texLabel(v: string | null | undefined) { return v ? humanize(normCode(v)) : '—'; }

  private terrainSource(col: 'slope_pct' | 'aspect_deg', value: number | null): string | null {
    if (value === null) return null;
    const t = this.terrain().find(x => x.applied?.[col]?.written);
    if (!t) return null;
    const after = t.applied[col].after;
    return after !== null && Math.abs(after - value) < 1e-6 ? `Elevation model (${t.provider}), ${new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : null;
  }
  private soilSource(col: SoilCol, value: string | null): SoilSuggestion | null {
    if (!value) return null;
    return this.soil().find(s => s[col] && normCode(s[col]) === normCode(value)) ?? null;
  }
  isApplied(s: SoilSuggestion) {
    const f = this.field();
    const texOk = !s.soil_texture_class || normCode(s.soil_texture_class) === normCode(f.soil_texture_class);
    const wrbOk = !s.wrb_soil_group || s.wrb_soil_group.toLowerCase() === (f.wrb_soil_group ?? '').toLowerCase();
    return texOk && wrbOk;
  }

  loadTerrain(id: string) {
    this.terrainLoading.set(true);
    this.terrainError.set(null);
    this.api.get<TerrainSummary[]>(`/fields/${id}/terrain`).subscribe({
      next: r => { this.terrain.set(r); this.terrainLoading.set(false); },
      error: (e: ApiError) => { this.terrainError.set(e.message); this.terrainLoading.set(false); },
    });
  }
  loadSoil(id: string) {
    this.soilLoading.set(true);
    this.soilError.set(null);
    this.api.get<SoilSuggestion[]>(`/fields/${id}/soil-properties`).subscribe({
      next: r => { this.soil.set(r); this.soilLoading.set(false); },
      error: (e: ApiError) => { this.soilError.set(e.message); this.soilLoading.set(false); },
    });
  }
  private reloadField() {
    this.api.get<FieldRec>(`/fields/${this.field().id}`).subscribe({ next: f => this.changed.emit(f), error: () => {} });
  }

  openEdit() {
    const f = this.field();
    this.eSlope.set(f.slope_pct); this.eAspect.set(f.aspect_deg);
    this.eTexture.set(f.soil_texture_class ? normCode(f.soil_texture_class) : '');
    this.eWrb.set(f.wrb_soil_group ?? ''); this.eEco.set(f.ecoregion ?? ''); this.eClimate.set(f.climate_zone ?? '');
    this.ePrecip.set(f.mean_annual_precip_mm); this.eCover.set(f.land_cover || 'cropland');
    this.editError.set(null);
    this.editOpen.set(true);
  }

  saveEdit() {
    this.saving.set(true);
    this.editError.set(null);
    this.api.patch<FieldRec>(`/fields/${this.field().id}`, this.patch()).subscribe({
      next: f => { this.saving.set(false); this.editOpen.set(false); this.changed.emit(f); this.toast.success('Site characteristics saved'); },
      error: (e: ApiError) => {
        this.saving.set(false);
        const fields = (e.details?.['fields'] as { field?: string; loc?: string[]; message?: string }[] | undefined) ?? [];
        this.editError.set(fields.length ? `${e.message} ${fields.map(x => x.message).filter(Boolean).join(' ')}` : e.message);
      },
    });
  }

  openTerrain() {
    this.force.set(false);
    this.terrainActionError.set(null);
    this.terrainOpen.set(true);
  }

  refreshTerrain() {
    this.terrainBusy.set(true);
    this.terrainActionError.set(null);
    this.api.post<TerrainSummary>(`/fields/${this.field().id}/terrain/refresh`, { force: this.force() }).subscribe({
      next: t => {
        this.terrainBusy.set(false);
        this.terrainOpen.set(false);
        this.terrain.update(list => [t, ...list]);
        const written = Object.values(t.applied ?? {}).filter(a => a.written).length;
        this.toast.success('Terrain refreshed', `${t.dominant_slope_class_label}${written ? ` · ${written} value${written === 1 ? '' : 's'} written to the field` : ' · field values kept'}`);
        if (written) this.reloadField();
      },
      error: (e: ApiError) => { this.terrainBusy.set(false); this.terrainActionError.set(e.message); },
    });
  }

  refreshSoil() {
    this.soilBusy.set(true);
    this.api.post<SoilSuggestion>(`/fields/${this.field().id}/soil-properties/refresh`, {}).subscribe({
      next: s => { this.soilBusy.set(false); this.soil.update(l => [s, ...l]); this.toast.success('Soil-map suggestion added', 'Review it and apply it if it fits what you know of the field.'); },
      error: (e: ApiError) => { this.soilBusy.set(false); this.toast.apiError(e, "Couldn't get a soil-map suggestion"); },
    });
  }

  openApply(s: SoilSuggestion) {
    this.applyTarget.set(s);
    this.colTex.set(!!s.soil_texture_class);
    this.colWrb.set(!!s.wrb_soil_group);
    this.applyNote.set('');
    this.applyError.set(null);
    this.conflicts.set([]);
    this.applyOpen.set(true);
  }

  apply(overwrite: boolean) {
    const s = this.applyTarget();
    if (!s) return;
    const columns: SoilCol[] = [];
    if (this.colTex() && s.soil_texture_class) columns.push('soil_texture_class');
    if (this.colWrb() && s.wrb_soil_group) columns.push('wrb_soil_group');
    this.applyBusy.set(true);
    this.applyError.set(null);
    this.api.post<{ changes: Record<string, unknown> }>(`/fields/${this.field().id}/soil-properties/apply`, {
      suggestion_id: s.id, columns, overwrite, note: this.applyNote().trim(),
    }).subscribe({
      next: r => {
        this.applyBusy.set(false);
        this.applyOpen.set(false);
        const n = Object.keys(r.changes ?? {}).length;
        this.toast.success(n ? 'Soil values applied' : 'Nothing changed', n ? 'The field record now uses the soil map’s values.' : 'The field already had these values.');
        this.reloadField();
        this.loadSoil(this.field().id);
      },
      error: (e: ApiError) => {
        this.applyBusy.set(false);
        if (e.code === 'FIELD_VALUE_EXISTS') this.conflicts.set((e.details?.['conflicts'] as SoilConflict[]) ?? []);
        else this.applyError.set(e.message);
      },
    });
  }
}
