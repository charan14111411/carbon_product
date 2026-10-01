import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, Loading, Modal } from '../../ui/kit';
import { ApiProblems, Ref } from '../mrv-shared/ui';
import { Campaign } from './types';

type Unit = 'landowner' | 'farm' | 'field';
type Sel = 'census' | 'pps_wr' | 'equal_wr';

interface PopField { field_id: string; label: string; area_ha: number; strata: Record<string, number>; pps_probability: number | null; equal_probability: number | null }
interface PopUnit { unit_id: string; label: string; area_ha: number; field_count: number; pps_probability: number | null; equal_probability: number | null; fields: PopField[] }
interface Population { project_id: string; stage1_unit: Unit; area_ha: number; unit_count: number; units: PopUnit[]; reference: string }

interface DesignRow { id: string; label: string; draws: number; area_ha: number; selection_probability: number; inclusion_probability: number; stratum_areas_ha: Record<string, number> }
interface Design {
  id: string; campaign_id: string; campaign_status: string | null; status: 'draft' | 'locked'; locked: boolean; version: number;
  stage1_unit: Unit; stage1_selection: Sel; stage2_selection: Sel | null; population: { area_ha: number; unit_count: number };
  stage1_draws: number; stage1_selected: number; units: (DesignRow & { population_field_count: number | null; fields: DesignRow[] })[];
  estimator: { qa2: string; qa1: string; reference: string }; justification: string; created_by: string | null; created_at: string; updated_at: string | null;
}

const UNIT_LABEL: Record<Unit, string> = { landowner: 'Landowners', farm: 'Farms', field: 'Fields' };
const SEL_LABEL: Record<Sel, string> = { census: 'Census (all)', pps_wr: 'PPS with replacement', equal_wr: 'Equal probability with replacement' };

/** VM0042 Appendix 6 multi-stage sampling design for one campaign (stage 1: landowners, farms or fields; stage 2: fields). */
@Component({
  selector: 'vc-sampling-design',
  imports: [FormsModule, Icon, Badge, Callout, Empty, Loading, Modal, ApiProblems, Ref, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="card-head">
        <h3>Sampling design</h3><vc-ref>VM0042 Appendix 6 pp.159–165</vc-ref>
        <span class="spacer"></span>
        @if (design(); as d) {
          @if (d.locked) { <span class="lock"><vc-icon name="lock" [size]="13" />Locked · campaign {{ d.campaign_status }}</span> } @else { <vc-badge status="draft" /> }
          <span class="subtle small">v{{ d.version }}</span>
        }
        @if (canEdit()) {
          @if (design()) {
            <button class="btn btn-ghost btn-sm" (click)="delOpen.set(true)">Use stratified sampling</button>
            <button class="btn btn-secondary btn-sm" (click)="startEdit()"><vc-icon name="pencil" [size]="14" />Edit design</button>
          } @else if (!loading()) {
            <button class="btn btn-primary btn-sm" (click)="startEdit()"><vc-icon name="workflow" [size]="14" />Set up multi-stage design</button>
          }
        }
      </div>

      @if (loading()) {
        <vc-loading [rows]="3" />
      } @else if (loadErr()) {
        <div class="card-body"><vc-api-problems [error]="loadErr()" title="Couldn't load the sampling design" /></div>
      } @else if (design(); as d) {
        <div class="sum">
          <div class="st"><span>Stage 1</span><strong>{{ unitLabel[d.stage1_unit] }}</strong><em>{{ selLabel[d.stage1_selection] }}</em></div>
          @if (d.stage1_unit !== 'field') { <div class="st"><span>Stage 2</span><strong>Fields</strong><em>{{ d.stage2_selection ? selLabel[d.stage2_selection] : '—' }}</em></div> }
          <div class="st"><span>Population</span><strong class="num">{{ d.population.unit_count }}</strong><em>{{ unitLabel[d.stage1_unit].toLowerCase() }} · {{ d.population.area_ha | num: 1 }} ha</em></div>
          <div class="st"><span>Selected</span><strong class="num">{{ d.stage1_selected }}</strong><em>{{ d.stage1_draws }} draw{{ d.stage1_draws === 1 ? '' : 's' }}</em></div>
          <div class="st"><span>Estimator</span><strong>Eq. A6.8–A6.9</strong><em>QA1: Eq. A6.1–A6.7</em></div>
        </div>
        @if (d.locked) { <div class="card-body pb0"><vc-callout tone="info" icon="lock">The design is locked because the campaign has left the planned stage. Calculations use it exactly as recorded.</vc-callout></div> }
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Unit</th><th class="num">Draws</th><th class="num">Area <span class="u">ha</span></th><th class="num">p (per draw)</th><th class="num">π (inclusion)</th><th>Zones <span class="u">ha</span></th></tr></thead>
            <tbody>
              @for (u of d.units; track u.id) {
                <tr class="u1">
                  <td><strong>{{ u.label }}</strong>@if (u.population_field_count !== null) { <span class="subtle small"> · {{ u.fields.length }} of {{ u.population_field_count }} fields</span> }</td>
                  <td class="num">{{ u.draws }}</td><td class="num">{{ u.area_ha | num: 2 }}</td>
                  <td class="num">{{ u.selection_probability | num: 4 }}</td><td class="num">{{ u.inclusion_probability | num: 4 }}</td>
                  <td class="small">{{ zones(u.stratum_areas_ha) }}</td>
                </tr>
                @for (f of u.fields; track f.id) {
                  <tr class="u2">
                    <td><span class="ind"><vc-icon name="corner-down-right" [size]="13" /></span>{{ f.label }}</td>
                    <td class="num">{{ f.draws }}</td><td class="num">{{ f.area_ha | num: 2 }}</td>
                    <td class="num">{{ f.selection_probability | num: 4 }}</td><td class="num">{{ f.inclusion_probability | num: 4 }}</td>
                    <td class="small">{{ zones(f.stratum_areas_ha) }}</td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot jf"><span class="small"><strong>Justification.</strong> {{ d.justification }}</span><span class="spacer"></span><span class="subtle small nowrap">{{ d.created_by ?? '—' }} · {{ (d.updated_at ?? d.created_at) | day }}</span></div>
      } @else {
        <vc-empty icon="layers" title="Stratified random sampling" text="This campaign uses the default design: random points in every zone. A multi-stage design first selects landowners, farms or fields with known probabilities, then samples inside them (Appendix 6).">
          @if (canEdit()) { <button class="btn btn-secondary btn-sm" (click)="startEdit()"><vc-icon name="workflow" [size]="14" />Set up multi-stage design</button> }
        </vc-empty>
        @if (campaign().status !== 'planned') { <div class="card-body pt0"><p class="small subtle center">The campaign is {{ campaign().status }}, so its design can no longer change.</p></div> }
      }
    </section>

    <!-- editor -->
    <vc-modal [(open)]="editOpen" [drawer]="true" width="880px" [title]="design() ? 'Edit sampling design' : 'Multi-stage sampling design'" subtitle="Probabilities are computed by the server from field areas; the selection is checked against the population.">
      <div class="stack" style="--gap:16px">
        <div class="form-grid">
          <div class="field"><label>Stage-1 unit</label>
            <div class="seg3">@for (u of units; track u) { <button type="button" [class.on]="f.stage1_unit === u" (click)="setUnit(u)">{{ unitLabel[u] }}</button> }</div></div>
          <div class="field"><label for="sd-s1">Stage-1 selection</label>
            <select id="sd-s1" class="input" [ngModel]="f.stage1_selection" (ngModelChange)="setSel1($event)">@for (s of sels; track s) { <option [value]="s">{{ selLabel[s] }}</option> }</select></div>
          @if (f.stage1_unit !== 'field') {
            <div class="field"><label for="sd-s2">Stage-2 selection (fields within a unit)</label>
              <select id="sd-s2" class="input" [ngModel]="f.stage2_selection" (ngModelChange)="setSel2($event)">@for (s of sels; track s) { <option [value]="s">{{ selLabel[s] }}</option> }</select></div>
          }
          <div class="field"><label>Population</label>
            <div class="pop">@if (pop(); as p) { <strong class="num">{{ p.unit_count }}</strong> {{ unitLabel[f.stage1_unit].toLowerCase() }} · <strong class="num">{{ p.area_ha | num: 1 }}</strong> ha in current project zones } @else if (popLoading()) { Loading… } @else { — }</div></div>
        </div>

        <vc-callout tone="info" icon="info">
          @switch (f.stage1_selection) {
            @case ('census') { Census: every {{ unitSingular() }} is included once (draws = 1). }
            @case ('pps_wr') { PPS with replacement: each draw picks a {{ unitSingular() }} with probability proportional to its area, p = A<sub>f</sub> / A. A unit drawn twice gets 2 draws. }
            @default { Equal probability with replacement: each draw picks a {{ unitSingular() }} with p = 1 / {{ pop()?.unit_count ?? 'N' }}. }
          }
          At least two draws are needed to estimate the sampling variance.
        </vc-callout>

        @if (popErr()) { <vc-api-problems [error]="popErr()" title="Couldn't load the population" /> }
        @if (pop(); as p) {
          @if (f.stage1_selection !== 'census') {
            <div class="drawbar">
              <span class="small">Draw at random</span>
              <input class="input sm num" type="number" min="1" [(ngModel)]="drawN" aria-label="Number of draws" />
              <span class="small subtle">{{ unitLabel[f.stage1_unit].toLowerCase() }}</span>
              <button type="button" class="btn btn-secondary btn-sm" (click)="drawUnits()"><vc-icon name="shuffle" [size]="14" />Draw</button>
              <span class="spacer"></span>
              <span class="small subtle">{{ selectedCount() }} selected · {{ totalDraws() }} draws</span>
            </div>
          }
          <div class="pick">
            <div class="ph"><span></span><span>{{ unitLabel[f.stage1_unit].slice(0, -1) }}</span><span class="num">Area ha</span><span class="num" [class.act]="f.stage1_selection === 'pps_wr'">p PPS</span><span class="num" [class.act]="f.stage1_selection === 'equal_wr'">p equal</span><span class="num">Draws</span></div>
            @for (u of p.units; track u.unit_id) {
              @let s = sel()[u.unit_id];
              <div class="pr" [class.on]="!!s">
                <input type="checkbox" [checked]="!!s" [disabled]="f.stage1_selection === 'census'" (change)="toggleUnit(u)" [attr.aria-label]="'Select ' + u.label" />
                <span class="pl"><strong>{{ u.label }}</strong>@if (f.stage1_unit !== 'field') { <span class="subtle small"> · {{ u.field_count }} field{{ u.field_count === 1 ? '' : 's' }}</span> }</span>
                <span class="num">{{ u.area_ha | num: 2 }}</span>
                <span class="num" [class.act]="f.stage1_selection === 'pps_wr'">{{ u.pps_probability | num: 4 }}</span>
                <span class="num" [class.act]="f.stage1_selection === 'equal_wr'">{{ u.equal_probability | num: 4 }}</span>
                <span class="num">@if (s) { <input class="input sm num dr" type="number" min="1" [ngModel]="s.draws" (ngModelChange)="setDraws(u.unit_id, $event)" [disabled]="f.stage1_selection === 'census'" [attr.aria-label]="'Draws for ' + u.label" /> } @else { — }</span>
              </div>
              @if (s && f.stage1_unit !== 'field') {
                <div class="fields">
                  <div class="fh"><span class="small subtle">Fields in {{ u.label }} · {{ selLabel[f.stage2_selection] }}</span>
                    @if (f.stage2_selection !== 'census') { <button type="button" class="btn btn-ghost btn-sm" (click)="drawFields(u, 2)"><vc-icon name="shuffle" [size]="13" />Draw 2</button> }</div>
                  @for (fl of u.fields; track fl.field_id) {
                    @let fs = s.fields[fl.field_id];
                    <div class="fr" [class.on]="!!fs">
                      <input type="checkbox" [checked]="!!fs" [disabled]="f.stage2_selection === 'census'" (change)="toggleField(u.unit_id, fl.field_id)" [attr.aria-label]="'Select ' + fl.label" />
                      <span class="pl">{{ fl.label }} <span class="subtle small">{{ zones(fl.strata) }}</span></span>
                      <span class="num">{{ fl.area_ha | num: 2 }}</span>
                      <span class="num" [class.act]="f.stage2_selection === 'pps_wr'">{{ fl.pps_probability | num: 4 }}</span>
                      <span class="num" [class.act]="f.stage2_selection === 'equal_wr'">{{ fl.equal_probability | num: 4 }}</span>
                      <span class="num">@if (fs) { <input class="input sm num dr" type="number" min="1" [ngModel]="fs" (ngModelChange)="setFieldDraws(u.unit_id, fl.field_id, $event)" [disabled]="f.stage2_selection === 'census'" [attr.aria-label]="'Draws for ' + fl.label" /> } @else { — }</span>
                    </div>
                  }
                </div>
              }
            } @empty { <vc-empty icon="map" title="No fields in the project zones" text="The population is every field in the project's current project zones." /> }
          </div>
        }

        <div class="field"><label for="sd-j">Justification</label>
          <textarea id="sd-j" class="input" rows="3" [(ngModel)]="f.justification" placeholder="Why this design, how units were drawn (random seed, tool) and why the sample size is adequate"></textarea></div>
        <vc-api-problems [error]="saveErr()" title="The sampling design is not valid" />
      </div>
      <ng-container footer>
        <span class="grow small subtle">{{ problem() }}</span>
        <button class="btn btn-secondary" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !!problem()" (click)="save()">{{ busy() ? 'Checking…' : 'Save design' }}</button>
      </ng-container>
    </vc-modal>

    <vc-modal [(open)]="delOpen" title="Return to stratified random sampling?" width="460px">
      <p class="muted">The multi-stage design is removed (kept in the audit log) and the campaign uses random points in every zone.</p>
      <vc-api-problems [error]="saveErr()" />
      <ng-container footer>
        <button class="btn btn-secondary" (click)="delOpen.set(false)">Cancel</button>
        <button class="btn btn-danger" [disabled]="busy()" (click)="remove()">Remove design</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .lock{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;padding:2px 9px;border-radius:999px;background:var(--stone-100);color:var(--stone-700)}
    .sum{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-bottom:1px solid var(--border)}
    .st{display:flex;flex-direction:column;gap:1px;padding:14px 18px;border-right:1px solid var(--stone-100)} .st:last-child{border-right:0}
    .st span{font-size:11.5px;color:var(--text-3)} .st strong{font-size:15px} .st em{font-style:normal;font-size:12px;color:var(--text-2)}
    .pb0{padding-bottom:0} .pt0{padding-top:0} .center{text-align:center}
    .u{font-size:11px;color:var(--text-3);font-weight:400}
    tr.u2 td{background:var(--sand-50);font-size:13px}
    .ind{color:var(--text-3);margin:0 6px 0 4px;vertical-align:-2px;display:inline-flex}
    .jf{justify-content:flex-start;align-items:flex-start}
    .seg3{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border)}
    .seg3 button{height:30px;border:0;border-radius:6px;background:none;font:500 13px var(--font);color:var(--stone-600);cursor:pointer}
    .seg3 button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .pop{height:38px;display:flex;align-items:center;gap:4px;font-size:13px;color:var(--text-2)}
    .drawbar{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--border)}
    .drawbar .input{width:80px}
    .input.sm{height:30px;font-size:13px}
    .pick{border:1px solid var(--border);border-radius:var(--radius-sm);max-height:480px;overflow:auto}
    .ph,.pr,.fr{display:grid;grid-template-columns:28px minmax(0,2fr) repeat(3,minmax(0,.8fr)) 90px;gap:8px;align-items:center;padding:7px 12px}
    .ph{position:sticky;top:0;z-index:1;background:var(--surface-2);border-bottom:1px solid var(--border);font-size:11.5px;color:var(--text-2)}
    .pr{border-bottom:1px solid var(--stone-100)} .pr.on{background:var(--forest-50)}
    .pick .num{text-align:right;font-variant-numeric:tabular-nums}
    .act{color:var(--forest-700);font-weight:600}
    .pr input[type=checkbox],.fr input[type=checkbox]{accent-color:var(--primary);width:15px;height:15px}
    .pl{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .dr{width:72px;margin-left:auto}
    .fields{padding:4px 0 8px 28px;background:var(--sand-50);border-bottom:1px solid var(--stone-100)}
    .fh{display:flex;align-items:center;justify-content:space-between;padding:2px 12px}
    .fr{padding:4px 12px;font-size:13px} .fr.on{color:var(--forest-800)}
    .grow{flex:1}
    @media (max-width: 900px){ .sum{grid-template-columns:repeat(2,minmax(0,1fr))} .st{border-bottom:1px solid var(--stone-100)} }
    @media (max-width: 640px){ .ph,.pr,.fr{grid-template-columns:24px minmax(0,1.6fr) minmax(0,.8fr) 72px} .ph span:nth-child(4),.ph span:nth-child(5),.pr > span:nth-child(4),.pr > span:nth-child(5),.fr > span:nth-child(4),.fr > span:nth-child(5){display:none} }
  `],
})
export class SamplingDesignCard {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  campaign = input.required<Campaign>();

  units: Unit[] = ['landowner', 'farm', 'field'];
  sels: Sel[] = ['census', 'pps_wr', 'equal_wr'];
  unitLabel = UNIT_LABEL;
  selLabel = SEL_LABEL;
  loading = signal(true);
  loadErr = signal<ApiError | null>(null);
  design = signal<Design | null>(null);
  editOpen = signal(false);
  delOpen = signal(false);
  busy = signal(false);
  saveErr = signal<ApiError | null>(null);
  pop = signal<Population | null>(null);
  popLoading = signal(false);
  popErr = signal<ApiError | null>(null);
  /** unit_id → { draws, fields: field_id → draws } */
  sel = signal<Record<string, { draws: number; fields: Record<string, number> }>>({});
  drawN = 4;
  f = { stage1_unit: 'landowner' as Unit, stage1_selection: 'pps_wr' as Sel, stage2_selection: 'equal_wr' as Sel, justification: '' };

  canEdit = computed(() => this.auth.can('sampling.plan') && this.campaign().status === 'planned' && !this.design()?.locked);
  selectedCount = computed(() => Object.keys(this.sel()).length);
  totalDraws = computed(() => Object.values(this.sel()).reduce((a, s) => a + s.draws, 0));

  constructor() {
    effect(() => { const c = this.campaign(); untracked(() => this.load(c.id)); });
  }

  load(id: string) {
    this.loading.set(true);
    this.loadErr.set(null);
    this.api.get<Design>(`/campaigns/${id}/sampling-design`).subscribe({
      next: d => { this.design.set(d); this.loading.set(false); },
      error: (e: ApiError) => { this.loading.set(false); this.design.set(null); if (e.status !== 404 || e.code !== 'NOT_FOUND') this.loadErr.set(e); },
    });
  }

  unitSingular() { return ({ landowner: 'landowner', farm: 'farm', field: 'field' } as Record<Unit, string>)[this.f.stage1_unit]; }
  zones(z: Record<string, number> | null | undefined) { return Object.entries(z ?? {}).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(' · ') || '—'; }

  startEdit() {
    const d = this.design();
    this.saveErr.set(null);
    this.f = d
      ? { stage1_unit: d.stage1_unit, stage1_selection: d.stage1_selection, stage2_selection: d.stage2_selection ?? 'equal_wr', justification: d.justification }
      : { stage1_unit: 'landowner', stage1_selection: 'pps_wr', stage2_selection: 'equal_wr', justification: '' };
    const s: Record<string, { draws: number; fields: Record<string, number> }> = {};
    for (const u of d?.units ?? []) s[u.id] = { draws: u.draws, fields: Object.fromEntries(u.fields.map(x => [x.id, x.draws])) };
    this.sel.set(s);
    this.editOpen.set(true);
    this.loadPop(true);
  }
  setUnit(u: Unit) {
    if (u === this.f.stage1_unit) return;
    this.f.stage1_unit = u;
    this.sel.set({});
    this.loadPop(false);
  }
  setSel1(s: Sel) { this.f.stage1_selection = s; this.applyCensus(); }
  setSel2(s: Sel) { this.f.stage2_selection = s; this.applyCensus(); }

  private loadPop(keep: boolean) {
    const c = this.campaign();
    this.popLoading.set(true);
    this.popErr.set(null);
    this.pop.set(null);
    this.api.get<Population>(`/projects/${c.project_id}/sampling-design/population`, { stage1_unit: this.f.stage1_unit }).subscribe({
      next: p => {
        this.pop.set(p);
        this.popLoading.set(false);
        if (!keep) this.sel.set({});
        this.applyCensus();
      },
      error: (e: ApiError) => { this.popLoading.set(false); this.popErr.set(e); },
    });
  }

  /** A census lists every unit (or field) once. */
  private applyCensus() {
    const p = this.pop();
    if (!p) return;
    const s = { ...this.sel() };
    if (this.f.stage1_selection === 'census') for (const u of p.units) s[u.unit_id] = { draws: 1, fields: s[u.unit_id]?.fields ?? {} };
    else for (const k of Object.keys(s)) if (s[k].draws < 1) s[k] = { ...s[k], draws: 1 };
    if (this.f.stage1_unit !== 'field' && this.f.stage2_selection === 'census') {
      for (const u of p.units) if (s[u.unit_id]) s[u.unit_id] = { ...s[u.unit_id], fields: Object.fromEntries(u.fields.map(x => [x.field_id, 1])) };
    } else if (this.f.stage1_unit !== 'field') {
      for (const k of Object.keys(s)) s[k] = { ...s[k], fields: Object.fromEntries(Object.entries(s[k].fields).map(([a, b]) => [a, Math.max(1, b)])) };
    }
    this.sel.set(s);
  }

  toggleUnit(u: PopUnit) {
    const s = { ...this.sel() };
    if (s[u.unit_id]) delete s[u.unit_id];
    else s[u.unit_id] = { draws: 1, fields: this.f.stage2_selection === 'census' ? Object.fromEntries(u.fields.map(x => [x.field_id, 1])) : {} };
    this.sel.set(s);
  }
  setDraws(id: string, v: unknown) {
    const n = Math.max(1, Math.round(Number(v) || 1));
    this.sel.update(s => ({ ...s, [id]: { ...s[id], draws: n } }));
  }
  toggleField(uid: string, fid: string) {
    this.sel.update(s => {
      const fields = { ...s[uid].fields };
      if (fields[fid]) delete fields[fid]; else fields[fid] = 1;
      return { ...s, [uid]: { ...s[uid], fields } };
    });
  }
  setFieldDraws(uid: string, fid: string, v: unknown) {
    const n = Math.max(1, Math.round(Number(v) || 1));
    this.sel.update(s => ({ ...s, [uid]: { ...s[uid], fields: { ...s[uid].fields, [fid]: n } } }));
  }

  /** Random draws with replacement using the design's own probabilities (crypto-strength randomness). */
  private drawIndex(weights: number[]): number {
    const total = weights.reduce((a, w) => a + w, 0);
    const r = (crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * total;
    let acc = 0;
    for (let i = 0; i < weights.length; i++) { acc += weights[i]; if (r < acc) return i; }
    return weights.length - 1;
  }
  drawUnits() {
    const p = this.pop();
    if (!p || !p.units.length) return;
    const n = Math.max(1, Math.round(Number(this.drawN) || 1));
    const w = p.units.map(u => (this.f.stage1_selection === 'pps_wr' ? u.area_ha : 1));
    const counts: Record<string, number> = {};
    for (let i = 0; i < n; i++) { const u = p.units[this.drawIndex(w)]; counts[u.unit_id] = (counts[u.unit_id] ?? 0) + 1; }
    const s: Record<string, { draws: number; fields: Record<string, number> }> = {};
    for (const [id, c] of Object.entries(counts)) {
      const u = p.units.find(x => x.unit_id === id)!;
      s[id] = { draws: c, fields: this.f.stage2_selection === 'census' ? Object.fromEntries(u.fields.map(x => [x.field_id, 1])) : this.sel()[id]?.fields ?? {} };
    }
    this.sel.set(s);
    if (!this.f.justification.trim()) this.f.justification = `${n} stage-1 draws made with replacement (${SEL_LABEL[this.f.stage1_selection].toLowerCase()}) in the platform on ${new Date().toISOString().slice(0, 10)}.`;
  }
  drawFields(u: PopUnit, n: number) {
    const w = u.fields.map(x => (this.f.stage2_selection === 'pps_wr' ? x.area_ha : 1));
    const counts: Record<string, number> = {};
    for (let i = 0; i < n; i++) { const fl = u.fields[this.drawIndex(w)]; counts[fl.field_id] = (counts[fl.field_id] ?? 0) + 1; }
    this.sel.update(s => ({ ...s, [u.unit_id]: { ...s[u.unit_id], fields: counts } }));
  }

  problem() {
    if (!this.pop()) return 'Loading the population…';
    if (!this.selectedCount()) return 'Select at least one unit';
    if (this.f.stage1_unit !== 'field' && Object.values(this.sel()).some(s => !Object.keys(s.fields).length)) return 'Select fields in every selected unit';
    if (this.f.justification.trim().length < 5) return 'Give a justification';
    return '';
  }

  save() {
    const c = this.campaign();
    const field = this.f.stage1_unit === 'field';
    const body = {
      stage1_unit: this.f.stage1_unit, stage1_selection: this.f.stage1_selection, stage2_selection: field ? null : this.f.stage2_selection,
      justification: this.f.justification.trim(),
      units: Object.entries(this.sel()).map(([unit_id, s]) => ({
        unit_id, draws: s.draws, fields: field ? [] : Object.entries(s.fields).map(([field_id, draws]) => ({ field_id, draws })),
      })),
    };
    this.busy.set(true);
    this.saveErr.set(null);
    const req = this.design() ? this.api.put<Design>(`/campaigns/${c.id}/sampling-design`, body) : this.api.post<Design>(`/campaigns/${c.id}/sampling-design`, body);
    req.subscribe({
      next: d => { this.busy.set(false); this.design.set(d); this.editOpen.set(false); this.toast.success('Sampling design saved', `${d.stage1_selected} ${UNIT_LABEL[d.stage1_unit].toLowerCase()} selected with ${d.stage1_draws} draws.`); },
      error: (e: ApiError) => { this.busy.set(false); this.saveErr.set(e); },
    });
  }
  remove() {
    const c = this.campaign();
    this.busy.set(true);
    this.saveErr.set(null);
    this.api.delete<void>(`/campaigns/${c.id}/sampling-design`).subscribe({
      next: () => { this.busy.set(false); this.delOpen.set(false); this.design.set(null); this.toast.success('Design removed', 'The campaign uses stratified random sampling.'); },
      error: (e: ApiError) => { this.busy.set(false); this.saveErr.set(e); },
    });
  }
}
