import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Callout, Modal } from '../../ui/kit';
import { EvidenceList } from '../additionality/evidence';
import { ApiProblems, ChipsInput, Ref } from '../mrv-shared/ui';
import {
  CLIMATE_ZONES, CROP_GROUPS, POOL_LABEL, POOLS, PRACTICES, Pool, Qa1Model, SOIL_TEXTURES, TrueUp, ValidationMetric, modelLabel,
} from './qa1.types';

type ErrForm = 'delta' | 'rho' | 'cov';
interface MetricRow {
  pool: Pool; practice_category: string; n_sites: number | null; median_duration_years: number | null; bias: number | null;
  bias_test_passed: boolean; form: ErrForm; s2_model_delta: number | null; s2_model: number | null; rho: number | null;
  cov: number | null; rmse: number | null; notes: string;
}

/** Create or edit a QA1 model (VM0042 §4 condition 4 a–e). Drafts only; approved models are never edited. */
@Component({
  selector: 'vc-qa1-model-form',
  imports: [FormsModule, Icon, Modal, Callout, EvidenceList, ChipsInput, ApiProblems, Ref, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [drawer]="true" width="860px" [title]="edit() ? 'Edit ' + label(edit()) : 'Register a process model'"
      subtitle="A biogeochemical model version, its parameters and the validation evidence VM0042 requires before it can be used for QA1.">
      <div class="stack" style="--gap:18px">
        <!-- identity -->
        <section class="blk">
          <div class="bh"><span class="n">1</span><h4>Model and version</h4><vc-ref>VM0042 §4 cond. 4a–c p.10</vc-ref></div>
          <div class="form-grid">
            <div class="field"><label for="m-n">Model name</label>
              <input id="m-n" class="input" [(ngModel)]="f.name" [disabled]="!!edit()" placeholder="e.g. DayCent" maxlength="120" /></div>
            <div class="field"><label for="m-v">Software version</label>
              <input id="m-v" class="input" [(ngModel)]="f.version" [disabled]="!!edit()" placeholder="e.g. 4.5.2" maxlength="40" />
              @if (!edit()) { <span class="hint">A new parameter set or validation report for the same version becomes a new revision.</span> }</div>
            @if (!edit() && supersedable().length) {
              <div class="field span-2"><label for="m-s">Replaces <span class="subtle">(optional)</span></label>
                <select id="m-s" class="input" [(ngModel)]="f.supersedes_id">
                  <option value="">Nothing — a new model</option>
                  @for (m of supersedable(); track m.id) { <option [value]="m.id">{{ label(m) }} ({{ m.status }})</option> }
                </select>
                <span class="hint">Use this for an updated model validation report after a true-up (§8.6.1.3).</span></div>
            }
            <div class="field span-2"><label for="m-src">Public source</label>
              <input id="m-src" class="input" [(ngModel)]="f.public_source" placeholder="Hyperlink or full citation of the published model" maxlength="2000" /></div>
            <div class="field"><label for="m-acc">Accessed on</label>
              <input id="m-acc" type="date" class="input" [(ngModel)]="f.source_accessed_on" /></div>
            <div class="field chk"><label class="checkbox"><input type="checkbox" [(ngModel)]="f.publicly_available" />The model is publicly available</label>
              <span class="hint">Condition 4a: anyone can obtain the model code or executable.</span></div>
            <div class="field span-2"><label for="m-doc">Documentation <span class="subtle">(inputs, outputs, processes)</span></label>
              <input id="m-doc" class="input" [(ngModel)]="f.documentation_ref" placeholder="Link or citation of the conceptual documentation" maxlength="2000" /></div>
            <div class="field span-2"><label>Peer-reviewed studies</label>
              <vc-chips [(value)]="f.peer_review_refs" placeholder="Paste a citation or DOI and press Enter" />
              <span class="hint">Condition 4b: studies showing the model simulates the SOC and trace-gas changes from these practices.</span></div>
          </div>
        </section>

        <!-- parameters -->
        <section class="blk">
          <div class="bh"><span class="n">2</span><h4>Parameter set</h4><vc-ref>§4 cond. 4c</vc-ref></div>
          <div class="field"><label for="m-p">Parameter values (JSON)</label>
            <textarea id="m-p" class="input mono" rows="6" [(ngModel)]="paramText" (ngModelChange)="paramErr.set(null)" spellcheck="false" placeholder='{ "site_parameters": { "...": 0.0 } }'></textarea>
            @if (paramErr()) { <span class="error">{{ paramErr() }}</span> } @else { <span class="hint">Every parameter value used with this model version. The approved set is fingerprinted; any change needs a new revision.</span> }</div>
          <div class="field"><label for="m-ps">Sources of the parameter values</label>
            <textarea id="m-ps" class="input" rows="2" [(ngModel)]="f.parameter_sources" placeholder="Datasets, statistics and calibration studies used to set them"></textarea></div>
        </section>

        <!-- evidence -->
        <section class="blk">
          <div class="bh"><span class="n">3</span><h4>Validation evidence</h4><vc-ref>§4 cond. 4d · VMD0053 §5.2</vc-ref></div>
          <div class="form-grid">
            <div class="field"><label>Model validation report</label>
              <vc-evidence [(ids)]="mvr" [single]="true" entityType="qa1_model" addLabel="Attach report" /></div>
            <div class="field"><label>Independent modelling expert (IME) assessment</label>
              <vc-evidence [(ids)]="ime" [single]="true" entityType="qa1_model" addLabel="Attach assessment" /></div>
          </div>
          @if (approvedTrueups().length) {
            <div class="field"><label>True-ups this report incorporates</label>
              <div class="opts">
                @for (t of approvedTrueups(); track t.id) {
                  <label class="checkbox small"><input type="checkbox" [checked]="f.trueup_ids.includes(t.id)" (change)="toggle(f.trueup_ids, t.id)" />Re-measured {{ t.measured_on | day }} · n {{ t.stats.n }}</label>
                }
              </div></div>
          }
        </section>

        <!-- domain -->
        <section class="blk">
          <div class="bh"><span class="n">4</span><h4>Validation domain</h4><vc-ref>VM0042 §3 · §8.6.1.1.1 p.64</vc-ref></div>
          <p class="hint">Where the model has been shown to work. Modelled points outside this domain are refused.</p>
          <div class="field"><label>Pools the model is used for</label>
            <div class="opts">
              @for (p of pools; track p) { <label class="checkbox"><input type="checkbox" [checked]="f.pools.includes(p)" (change)="toggle(f.pools, p)" />{{ poolLabel[p] }}</label> }
            </div></div>
          <div class="field"><label>Practice categories <span class="subtle">(Appendix 1)</span></label>
            <div class="opts">
              @for (p of practices; track p.key) {
                <label class="checkbox"><input type="checkbox" [checked]="f.domain.practice_categories.includes(p.key)" (change)="toggle(f.domain.practice_categories, p.key)" />{{ p.label }} <span class="subtle small">{{ p.ref }}</span></label>
              }
            </div></div>
          <div class="form-grid">
            <div class="field span-2"><label>Crop functional groups</label>
              <vc-chips [(value)]="f.domain.crop_functional_groups" [suggestions]="cropGroups" placeholder="e.g. grasses_cereals" /></div>
            <div class="field"><label>IPCC climate zones</label>
              <vc-chips [(value)]="f.domain.climate_zones" [suggestions]="climates" placeholder="e.g. tropical_moist" /></div>
            <div class="field"><label>Soil textures</label>
              <vc-chips [(value)]="f.domain.soil_textures" [suggestions]="textures" placeholder="e.g. sandy_clay_loam" /></div>
          </div>
        </section>

        <!-- metrics -->
        <section class="blk">
          <div class="bh"><span class="n">5</span><h4>Model prediction error</h4><vc-ref>Eq. 60–61 · §8.6.1.1.1 p.64–65</vc-ref>
            <span class="spacer"></span>
            @if (missingCombos().length) { <button type="button" class="btn btn-secondary btn-sm" (click)="addMissing()"><vc-icon name="plus" [size]="14" />Add {{ missingCombos().length }} missing</button> }
            <button type="button" class="btn btn-ghost btn-sm" (click)="addRow()"><vc-icon name="plus" [size]="14" />Add row</button>
          </div>
          <p class="hint">One row per pool and practice category, from the validation report. Variances are of the per-hectare change over a verification period, (t CO₂e/ha)². Give the direct side-by-side estimate, or s²<sub>model</sub> with ρ (Eq. 61) or the covariance (Eq. 60).</p>

          @if (f.pools.length && f.domain.practice_categories.length) {
            <div class="cov">
              <span class="cl">Coverage</span>
              @for (p of f.pools; track p) {
                @for (c of f.domain.practice_categories; track c) {
                  <span class="cc" [class.ok]="hasMetric(p, c)" [title]="hasMetric(p, c) ? 'Error given' : 'No prediction error yet'"><vc-icon [name]="hasMetric(p, c) ? 'check' : 'circle-dashed'" [size]="12" />{{ poolShort(p) }} · {{ practiceShort(c) }}</span>
                }
              }
            </div>
          }

          @for (r of rows(); track $index; let i = $index) {
            <div class="met">
              <div class="mh">
                <select class="input sm" [(ngModel)]="r.pool" aria-label="Pool">@for (p of pools; track p) { <option [value]="p">{{ poolLabel[p] }}</option> }</select>
                <select class="input sm" [(ngModel)]="r.practice_category" aria-label="Practice category">@for (p of practices; track p.key) { <option [value]="p.key">{{ p.label }}</option> }</select>
                <label class="checkbox small bt" [class.bad]="!r.bias_test_passed"><input type="checkbox" [(ngModel)]="r.bias_test_passed" />Bias test passed</label>
                <button type="button" class="rm" (click)="removeRow(i)" aria-label="Remove row"><vc-icon name="trash" [size]="14" /></button>
              </div>
              <div class="mg">
                <div class="mf"><span>Sites (n)</span><input class="input sm num" type="number" min="2" step="1" [(ngModel)]="r.n_sites" /></div>
                <div class="mf"><span>Median length (yr)</span><input class="input sm num" type="number" min="0" step="any" [(ngModel)]="r.median_duration_years" /></div>
                <div class="mf"><span>Bias (t CO₂e/ha)</span><input class="input sm num" type="number" step="any" [(ngModel)]="r.bias" /></div>
                <div class="mf"><span>RMSE <em>optional</em></span><input class="input sm num" type="number" min="0" step="any" [(ngModel)]="r.rmse" /></div>
              </div>
              <div class="mg err">
                <div class="seg">
                  <button type="button" [class.on]="r.form === 'delta'" (click)="r.form = 'delta'">Side-by-side s²<sub>Δ</sub></button>
                  <button type="button" [class.on]="r.form === 'rho'" (click)="r.form = 'rho'">s² + ρ · Eq. 61</button>
                  <button type="button" [class.on]="r.form === 'cov'" (click)="r.form = 'cov'">s² + cov · Eq. 60</button>
                </div>
                @if (r.form === 'delta') {
                  <div class="mf"><span>s²<sub>model,Δ</sub></span><input class="input sm num" type="number" min="0" step="any" [(ngModel)]="r.s2_model_delta" /></div>
                } @else {
                  <div class="mf"><span>s²<sub>model</sub></span><input class="input sm num" type="number" min="0" step="any" [(ngModel)]="r.s2_model" /></div>
                  @if (r.form === 'rho') { <div class="mf"><span>ρ (−1…1)</span><input class="input sm num" type="number" min="-1" max="1" step="any" [(ngModel)]="r.rho" /></div> }
                  @else { <div class="mf"><span>cov</span><input class="input sm num" type="number" step="any" [(ngModel)]="r.cov" /></div> }
                }
              </div>
            </div>
          } @empty {
            <div class="none small subtle">No prediction errors yet. Choose pools and practice categories above, then add the missing rows.</div>
          }
        </section>

        <div class="field"><label for="m-no">Notes <span class="subtle">(optional)</span></label>
          <textarea id="m-no" class="input" rows="2" [(ngModel)]="f.notes"></textarea></div>

        <vc-callout tone="info" icon="users">Saved as a draft. A second person with model-approval rights checks it against condition 4 and approves it. Anyone who edits a draft also can't approve it.</vc-callout>
        <vc-api-problems [error]="err()" title="Couldn't save the model" />
      </div>
      <ng-container footer>
        <span class="grow small subtle">{{ problem() }}</span>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving() || !!problem()" (click)="save()">{{ saving() ? 'Saving…' : edit() ? 'Save changes' : 'Save draft' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .blk{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface-2)}
    .bh{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .bh h4{font-size:14px}
    .n{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--forest-600);color:#fff;font-size:11.5px;font-weight:600}
    .hint{font-size:12px;color:var(--text-3)} .error{font-size:12px;color:var(--danger)}
    .chk{justify-content:flex-end}
    .opts{display:flex;flex-wrap:wrap;gap:8px 18px}
    textarea.mono{font-family:var(--mono);font-size:12.5px}
    .cov{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
    .cl{font-size:11.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-right:4px}
    .cc{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 8px;border-radius:999px;font-size:11.5px;border:1px solid #f1dcae;background:var(--warn-soft);color:var(--amber-600)}
    .cc.ok{border-color:#cfe2d4;background:var(--ok-soft);color:var(--forest-700)}
    .met{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);display:flex;flex-direction:column;gap:10px}
    .mh{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .mh select{width:auto;min-width:170px}
    .input.sm{height:32px;font-size:13px}
    .bt{margin-left:auto} .bt.bad{color:var(--amber-600)}
    .mg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
    .mg.err{grid-template-columns:minmax(0,1.6fr) repeat(2,minmax(0,1fr));align-items:end}
    .mf{display:flex;flex-direction:column;gap:3px} .mf span{font-size:11.5px;color:var(--stone-700)} .mf em{font-style:normal;color:var(--text-3)}
    .seg{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border)}
    .seg button{height:26px;border:0;border-radius:5px;background:none;font:500 11.5px var(--font);color:var(--stone-600);cursor:pointer;white-space:nowrap}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .rm{display:grid;place-items:center;width:30px;height:30px;border:0;border-radius:6px;background:none;color:var(--stone-400);cursor:pointer}
    .rm:hover{color:var(--danger);background:var(--danger-soft)}
    .none{padding:12px;border:1px dashed var(--border-strong);border-radius:var(--radius-sm);text-align:center}
    .grow{flex:1}
    @media (max-width: 720px){ .mg,.mg.err{grid-template-columns:1fr 1fr} .seg{grid-column:1/-1} }
  `],
})
export class Qa1ModelForm {
  private api = inject(ApiService);
  open = model(false);
  edit = input<Qa1Model | null>(null);
  models = input<Qa1Model[]>([]);
  trueups = input<TrueUp[]>([]);
  saved = output<Qa1Model>();

  pools = POOLS;
  poolLabel = POOL_LABEL;
  practices = PRACTICES;
  climates = CLIMATE_ZONES;
  textures = SOIL_TEXTURES;
  cropGroups = CROP_GROUPS;
  label = modelLabel;

  f = this.blank();
  mvr: string[] = [];
  ime: string[] = [];
  paramText = '{}';
  paramErr = signal<string | null>(null);
  rows = signal<MetricRow[]>([]);
  saving = signal(false);
  err = signal<ApiError | null>(null);
  tick = signal(0);

  supersedable = computed(() => this.models().filter(m => m.status !== 'draft'));
  approvedTrueups = computed(() => this.trueups().filter(t => t.status === 'approved'));

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const m = this.edit();
      untracked(() => this.reset(m));
    });
  }

  private blank() {
    return {
      name: '', version: '', supersedes_id: '', public_source: '', source_accessed_on: '', publicly_available: false,
      documentation_ref: '', peer_review_refs: [] as string[], parameter_sources: '', pools: [] as Pool[], trueup_ids: [] as string[], notes: '',
      domain: { crop_functional_groups: [] as string[], practice_categories: [] as string[], climate_zones: [] as string[], soil_textures: [] as string[] },
    };
  }

  private reset(m: Qa1Model | null) {
    this.err.set(null);
    this.paramErr.set(null);
    if (!m) {
      this.f = this.blank();
      this.mvr = [];
      this.ime = [];
      this.paramText = '{\n  \n}';
      this.rows.set([]);
      return;
    }
    const d = m.validation_domain ?? { crop_functional_groups: [], practice_categories: [], climate_zones: [], soil_textures: [] };
    this.f = {
      name: m.name, version: m.version, supersedes_id: '', public_source: m.public_source, source_accessed_on: m.source_accessed_on ?? '',
      publicly_available: m.publicly_available, documentation_ref: m.documentation_ref, peer_review_refs: [...(m.peer_review_refs ?? [])],
      parameter_sources: m.parameter_sources, pools: [...(m.pools ?? [])], trueup_ids: [...(m.trueup_ids ?? [])], notes: m.notes ?? '',
      domain: {
        crop_functional_groups: [...(d.crop_functional_groups ?? [])], practice_categories: [...(d.practice_categories ?? [])],
        climate_zones: [...(d.climate_zones ?? [])], soil_textures: [...(d.soil_textures ?? [])],
      },
    };
    this.mvr = m.validation_report_evidence_id ? [m.validation_report_evidence_id] : [];
    this.ime = m.ime_report_evidence_id ? [m.ime_report_evidence_id] : [];
    this.paramText = JSON.stringify(m.parameter_set ?? {}, null, 2);
    this.rows.set((m.validation_metrics ?? []).map(x => this.toRow(x)));
  }

  private toRow(x: ValidationMetric): MetricRow {
    const form: ErrForm = x.s2_model_delta !== null && x.s2_model_delta !== undefined ? 'delta' : x.rho !== null && x.rho !== undefined ? 'rho' : 'cov';
    return { ...x, form, notes: x.notes ?? '' };
  }

  toggle<T>(list: T[], v: T) {
    const i = list.indexOf(v);
    if (i >= 0) list.splice(i, 1); else list.push(v);
    this.tick.update(t => t + 1);
  }
  hasMetric(p: string, c: string) { return this.rows().some(r => r.pool === p && r.practice_category === c); }
  missingCombos() {
    this.tick();
    const out: [Pool, string][] = [];
    for (const p of this.f.pools) for (const c of this.f.domain.practice_categories) if (!this.hasMetric(p, c)) out.push([p, c]);
    return out;
  }
  private emptyRow(pool: Pool, cat: string): MetricRow {
    return { pool, practice_category: cat, n_sites: null, median_duration_years: null, bias: 0, bias_test_passed: false, form: 'delta', s2_model_delta: null, s2_model: null, rho: null, cov: null, rmse: null, notes: '' };
  }
  addMissing() { this.rows.update(r => [...r, ...this.missingCombos().map(([p, c]) => this.emptyRow(p, c))]); }
  addRow() { this.rows.update(r => [...r, this.emptyRow(this.f.pools[0] ?? 'soc', this.f.domain.practice_categories[0] ?? PRACTICES[0].key)]); }
  removeRow(i: number) { this.rows.update(r => r.filter((_, j) => j !== i)); }
  poolShort(p: string) { return ({ soc: 'SOC', ch4_soil: 'CH₄', n2o_soil: 'N₂O' } as Record<string, string>)[p] ?? p; }
  practiceShort(c: string) { return PRACTICES.find(p => p.key === c)?.label ?? c; }

  problem(): string {
    this.tick();
    if (!this.edit() && (!this.f.name.trim() || !this.f.version.trim())) return 'Give the model name and version';
    for (const [i, r] of this.rows().entries()) {
      const n = i + 1;
      if (!r.n_sites || r.n_sites < 2) return `Row ${n}: at least 2 validation sites`;
      if (!r.median_duration_years || r.median_duration_years <= 0) return `Row ${n}: give the median experiment length`;
      if (r.bias === null || r.bias === undefined || Number.isNaN(+r.bias)) return `Row ${n}: give the bias`;
      if (r.form === 'delta' && (r.s2_model_delta === null || r.s2_model_delta < 0)) return `Row ${n}: give s²model,Δ`;
      if (r.form !== 'delta' && (r.s2_model === null || r.s2_model < 0)) return `Row ${n}: give s²model`;
      if (r.form === 'rho' && (r.rho === null || r.rho < -1 || r.rho > 1)) return `Row ${n}: ρ must be between −1 and 1`;
      if (r.form === 'cov' && (r.cov === null || Number.isNaN(+r.cov))) return `Row ${n}: give the covariance`;
    }
    return '';
  }

  save() {
    let params: Record<string, unknown>;
    try {
      const v = JSON.parse(this.paramText.trim() || '{}');
      if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('not an object');
      params = v;
    } catch {
      this.paramErr.set('This is not valid JSON. Use an object such as { "name": value }.');
      return;
    }
    const metrics = this.rows().map(r => ({
      pool: r.pool, practice_category: r.practice_category, n_sites: Number(r.n_sites), median_duration_years: Number(r.median_duration_years),
      bias: Number(r.bias), bias_test_passed: r.bias_test_passed, rmse: r.rmse === null || (r.rmse as unknown) === '' ? null : Number(r.rmse), notes: r.notes,
      s2_model_delta: r.form === 'delta' ? Number(r.s2_model_delta) : null,
      s2_model: r.form !== 'delta' ? Number(r.s2_model) : null,
      rho: r.form === 'rho' ? Number(r.rho) : null,
      cov: r.form === 'cov' ? Number(r.cov) : null,
    }));
    const f = this.f;
    const common = {
      public_source: f.public_source.trim(), source_accessed_on: f.source_accessed_on || null, publicly_available: f.publicly_available,
      documentation_ref: f.documentation_ref.trim(), peer_review_refs: f.peer_review_refs, parameter_set: params,
      parameter_sources: f.parameter_sources.trim(), validation_report_evidence_id: this.mvr[0] ?? null, ime_report_evidence_id: this.ime[0] ?? null,
      validation_domain: f.domain, pools: f.pools, validation_metrics: metrics, trueup_ids: f.trueup_ids, notes: f.notes,
    };
    const m = this.edit();
    const req = m
      ? this.api.patch<Qa1Model>(`/qa1/models/${m.id}`, common)
      : this.api.post<Qa1Model>('/qa1/models', { ...common, name: f.name.trim(), version: f.version.trim(), supersedes_id: f.supersedes_id || null });
    this.saving.set(true);
    this.err.set(null);
    req.subscribe({
      next: r => { this.saving.set(false); this.open.set(false); this.saved.emit(r); },
      error: (e: ApiError) => { this.saving.set(false); this.err.set(e); },
    });
  }
}
