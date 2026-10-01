import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, Hash, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { EvidenceList } from '../additionality/evidence';
import { ApiProblems, Ref } from '../mrv-shared/ui';
import { CampaignLite, POOL_SHORT, Qa1Model, RunImport, modelLabel } from './qa1.types';

const COLUMNS = 'site_code,scenario,year,draw,soc_t_c_ha,ch4_t_ch4_ha,n2o_t_n2o_ha,practice_category,crop_functional_group';

/** Modelled outputs per sampling point, scenario and year (data class MODELLED). Append-only; a correction is a new import. */
@Component({
  selector: 'vc-qa1-imports',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Hash, Modal, EvidenceList, ApiProblems, Ref, DayPipe, NumPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small intro">Upload the model's baseline and project runs for every sampling point, from t0 (the end of the year before the
        project start) to the latest year. SOC runs start from the directly measured stock of the baseline campaign (Eq. 4). Nothing is imported if any row has a problem.</p>
      @if (canRun()) { <button class="btn btn-primary" [disabled]="!approvedModels().length" (click)="start()"><vc-icon name="upload" />Import model runs</button> }
    </div>
    @if (canRun() && !approvedModels().length) {
      <vc-callout tone="info" icon="info" class="mb">An approved model is needed before runs can be imported. Register one under Models and ask a colleague to approve it.</vc-callout>
    }

    <section class="card">
      @if (!imports().length) {
        <vc-empty icon="file-up" title="No model runs imported" text="Each import is fingerprinted and kept as evidence. Analyses choose which imports to use." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Import</th><th>Model</th><th>Pools</th><th class="num">Points</th><th>Years</th><th class="num">Rows</th><th class="num">MC draws</th><th>Checks</th><th>Imported</th><th></th></tr></thead>
            <tbody>
              @for (i of sorted(); track i.id) {
                <tr class="clickable" (click)="detail.set(i)">
                  <td><strong>{{ i.label }}</strong><div class="subtle small mono">{{ i.sha256.slice(0, 12) }}…</div></td>
                  <td class="small">{{ modelName(i.model_id) }}</td>
                  <td>@for (p of i.pools; track p) { <span class="pool">{{ poolShort[p] }}</span> }</td>
                  <td class="num">{{ i.site_codes.length }}</td>
                  <td class="nowrap">{{ i.first_year }}–{{ i.last_year }} <span class="subtle small">t0 {{ i.t0_year }}</span></td>
                  <td class="num">{{ i.row_count | num: 0 }}</td>
                  <td class="num">{{ i.mc_draws || '—' }}</td>
                  <td>
                    @if (i.warnings.length) { <vc-badge status="warning">{{ i.warnings.length }} warning{{ i.warnings.length === 1 ? '' : 's' }}</vc-badge> }
                    @else { <vc-badge status="ok">Clean</vc-badge> }
                    @if (isSuperseded(i.id)) { <vc-badge status="superseded" /> }
                  </td>
                  <td class="nowrap small">{{ people.name(i.created_by, 'Unknown') }}<div class="subtle">{{ i.created_at | ago }}</div></td>
                  <td class="go"><vc-icon name="chevron-right" [size]="15" /></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot foot"><vc-dc cls="MODELLED" /><span class="subtle small">Modelled values — never shown as measurements. Each import's raw file is stored as evidence with its SHA-256.</span></div>
      }
    </section>

    <!-- import drawer -->
    <vc-modal [(open)]="formOpen" [drawer]="true" width="760px" title="Import model runs" subtitle="CSV with one row per point, scenario, year and draw.">
      <div class="stack" style="--gap:16px">
        <div class="form-grid">
          <div class="field"><label for="ri-m">Approved model</label>
            <select id="ri-m" class="input" [(ngModel)]="f.model_id">
              <option value="">Choose a model…</option>
              @for (m of approvedModels(); track m.id) { <option [value]="m.id">{{ label(m) }}</option> }
            </select></div>
          <div class="field"><label for="ri-l">Label</label>
            <input id="ri-l" class="input" [(ngModel)]="f.label" maxlength="120" placeholder="e.g. DayCent runs 2019–2025" /></div>
          <div class="field"><label for="ri-c">Initial SOC measurements <span class="subtle">(for SOC runs)</span></label>
            <select id="ri-c" class="input" [(ngModel)]="f.initial_campaign_id">
              <option value="">None (no SOC column)</option>
              @for (c of baselineCampaigns(); track c.id) { <option [value]="c.id">{{ c.code }} · {{ c.name }}</option> }
            </select>
            <span class="hint">The baseline campaign whose accepted lab results initialise the model at t0.</span></div>
          <div class="field"><label for="ri-s">Replaces <span class="subtle">(optional)</span></label>
            <select id="ri-s" class="input" [(ngModel)]="f.supersedes_id">
              <option value="">Nothing — a new import</option>
              @for (i of sorted(); track i.id) { <option [value]="i.id">{{ i.label }} · {{ i.created_at | day }}</option> }
            </select></div>
        </div>

        <div class="field">
          <div class="lrow"><label for="ri-csv">Model output (CSV)</label>
            <span class="spacer"></span>
            <input #fi type="file" accept=".csv,text/csv" hidden (change)="readFile($event); fi.value = ''" />
            <button type="button" class="btn btn-ghost btn-sm" (click)="fi.click()"><vc-icon name="upload" [size]="14" />Choose file</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="f.csv = header + '\\n'"><vc-icon name="clipboard-paste" [size]="14" />Insert header</button>
          </div>
          <textarea id="ri-csv" class="input csv" rows="10" [(ngModel)]="f.csv" spellcheck="false" [placeholder]="header + '\\nP-01,baseline,2019,,42.1,,,tillage_residue,grasses_cereals'"></textarea>
          <span class="hint">
            @if (fileName()) { <strong>{{ fileName() }}</strong> · }
            {{ lineCount() | num: 0 }} data row{{ lineCount() === 1 ? '' : 's' }} · columns: <code>{{ header }}</code>. Leave <code>draw</code> blank for the central run; 1…L are posterior predictive draws.
          </span>
        </div>

        <div class="form-grid">
          <div class="field"><label>Spectroscopy de minimis evidence <span class="subtle">(optional)</span></label>
            <vc-evidence [(ids)]="deMinimis" [single]="true" entityType="qa1_run_import" addLabel="Attach evidence" />
            <span class="hint">Only if initial SOC was measured by spectroscopy and its error is shown unbiased and de minimis (§8.6.1.1.2 p.67).</span></div>
          <div class="field"><label for="ri-n">Notes <span class="subtle">(optional)</span></label>
            <textarea id="ri-n" class="input" rows="3" [(ngModel)]="f.notes"></textarea></div>
        </div>

        <vc-api-problems [error]="err()" [title]="errTitle()" [limit]="20" />
      </div>
      <ng-container footer>
        <span class="grow small subtle">{{ problem() }}</span>
        <button class="btn btn-secondary" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving() || !!problem()" (click)="save()"><vc-icon name="upload" />{{ saving() ? 'Checking and importing…' : 'Import' }}</button>
      </ng-container>
    </vc-modal>

    <!-- detail -->
    <vc-modal [open]="!!detail()" (closed)="detail.set(null)" [drawer]="true" width="600px" [title]="detail()?.label ?? ''" subtitle="Model run import">
      @if (detail(); as i) {
        <div class="stack" style="--gap:16px">
          @if (i.warnings.length) {
            <vc-callout tone="warn" icon="circle-alert"><strong>{{ i.warnings.length }} warning{{ i.warnings.length === 1 ? '' : 's' }}</strong>
              <ul class="wl">@for (w of i.warnings; track $index) { <li>{{ w }}</li> }</ul></vc-callout>
          }
          <dl class="kv">
            <dt>Model</dt><dd>{{ modelName(i.model_id) }}</dd>
            <dt>Parameter set</dt><dd><vc-hash [value]="i.model_fingerprint" /></dd>
            <dt>Raw file</dt><dd><vc-evidence [ids]="[i.evidence_id]" [readonly]="true" /> <vc-hash [value]="i.sha256" /></dd>
            <dt>Pools</dt><dd>@for (p of i.pools; track p) { <span class="pool">{{ poolShort[p] }}</span> }</dd>
            <dt>t0</dt><dd>End of {{ i.t0_year }} <vc-ref>Table 6 p.24</vc-ref></dd>
            <dt>Years</dt><dd>{{ i.first_year }}–{{ i.last_year }} · {{ i.row_count | num: 0 }} rows</dd>
            <dt>Monte Carlo draws</dt><dd>{{ i.mc_draws ? i.mc_draws + ' posterior predictive draws (L)' : 'Central run only' }}</dd>
            @if (i.initial_measurement_date) { <dt>Initial measurement</dt><dd>{{ i.initial_measurement_date | day }} · Eq. 4 at {{ i.eq4_points ?? '—' }} points</dd> }
            <dt>Activity records used</dt><dd>{{ i.activity_records_used ?? '—' }} <span class="subtle small">(model management inputs, Box 1 / Table 8)</span></dd>
            <dt>Spectroscopy</dt><dd>{{ i.spectroscopy_used ? (i.spectroscopy_de_minimis_evidence_id ? 'Used · de minimis evidence attached' : 'Used · Monte Carlo required') : 'Not used' }}</dd>
            @if (i.notes) { <dt>Notes</dt><dd>{{ i.notes }}</dd> }
          </dl>
          <div>
            <div class="lbl">Sampling points ({{ i.site_codes.length }})</div>
            <div class="codes">@for (s of i.site_codes; track s) { <code>{{ s }}</code> }</div>
          </div>
        </div>
      }
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:16px;align-items:flex-start;margin-bottom:16px}
    .intro{flex:1;max-width:860px}
    .mb{display:flex;margin-bottom:16px}
    .pool{display:inline-block;font:600 10.5px var(--mono);padding:2px 6px;margin-right:4px;border-radius:4px;background:var(--dc-modelled-bg);color:var(--dc-modelled)}
    .go{color:var(--text-3);width:28px}
    .foot{justify-content:flex-start}
    .lrow{display:flex;align-items:center;gap:6px}
    .lrow label{font-size:12.5px;font-weight:500;color:var(--stone-700)}
    textarea.csv{font:12px/1.5 var(--mono);white-space:pre;overflow:auto}
    .hint code{font-size:11px}
    .grow{flex:1}
    .wl{margin:6px 0 0;padding-left:18px;font-size:13px}
    .lbl{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px}
    .codes{display:flex;flex-wrap:wrap;gap:5px} .codes code{font-size:11.5px;padding:2px 6px;border-radius:4px;background:var(--sand-100);border:1px solid var(--border)}
    @media (max-width: 760px){ .bar{flex-direction:column} }
  `],
})
export class Qa1Imports {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);
  projectId = input.required<string>();
  imports = input<RunImport[]>([]);
  models = input<Qa1Model[]>([]);
  campaigns = input<CampaignLite[]>([]);
  changed = output<void>();

  header = COLUMNS;
  poolShort = POOL_SHORT;
  label = modelLabel;
  formOpen = signal(false);
  detail = signal<RunImport | null>(null);
  saving = signal(false);
  err = signal<ApiError | null>(null);
  fileName = signal('');
  f = this.blank();
  deMinimis: string[] = [];

  canRun = computed(() => this.auth.can('calc.run'));
  approvedModels = computed(() => this.models().filter(m => m.status === 'approved'));
  baselineCampaigns = computed(() => this.campaigns().filter(c => c.kind === 'baseline'));
  sorted = computed(() => [...this.imports()].sort((a, b) => b.created_at.localeCompare(a.created_at)));
  private supersededIds = computed(() => new Set(this.imports().map(i => i.supersedes_id).filter(Boolean)));

  constructor() { this.people.load(); }

  private blank() { return { model_id: '', label: '', initial_campaign_id: '', supersedes_id: '', csv: '', notes: '' }; }
  start() {
    this.f = this.blank();
    if (this.approvedModels().length === 1) this.f.model_id = this.approvedModels()[0].id;
    if (this.baselineCampaigns().length === 1) this.f.initial_campaign_id = this.baselineCampaigns()[0].id;
    this.deMinimis = [];
    this.fileName.set('');
    this.err.set(null);
    this.formOpen.set(true);
  }
  modelName(id: string) { return modelLabel(this.models().find(m => m.id === id)); }
  isSuperseded(id: string) { return this.supersededIds().has(id); }
  lineCount() { return Math.max(0, (this.f.csv || '').split(/\r?\n/).filter(l => l.trim()).length - 1); }
  errTitle() {
    const e = this.err();
    if (!e) return '';
    return e.code === 'INVALID_IMPORT' ? 'Nothing was imported' : e.code === 'DUPLICATE_IMPORT' ? 'Already imported' : "Couldn't import the runs";
  }
  problem() {
    if (!this.f.model_id) return 'Choose an approved model';
    if (!this.f.label.trim()) return 'Give the import a label';
    if (!this.f.csv.trim()) return 'Paste or choose the CSV';
    return '';
  }
  readFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 50_000_000) { this.toast.error('File too large', 'The import limit is 50 MB.'); return; }
    file.text().then(t => {
      this.f.csv = t;
      this.fileName.set(file.name);
      if (!this.f.label.trim()) this.f.label = file.name.replace(/\.csv$/i, '');
      this.err.set(null);
      this.formOpen.set(true);
    });
  }
  save() {
    this.saving.set(true);
    this.err.set(null);
    this.api.post<RunImport>(`/projects/${this.projectId()}/qa1/run-imports`, {
      model_id: this.f.model_id, label: this.f.label.trim(), initial_campaign_id: this.f.initial_campaign_id || null, format: 'csv',
      csv: this.f.csv, spectroscopy_de_minimis_evidence_id: this.deMinimis[0] ?? null, supersedes_id: this.f.supersedes_id || null, notes: this.f.notes,
    }).subscribe({
      next: i => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.toast.success('Model runs imported', `${i.row_count} rows at ${i.site_codes.length} points${i.warnings.length ? ` · ${i.warnings.length} warning(s)` : ''}.`);
        this.changed.emit();
        if (i.warnings.length) this.detail.set(i);
      },
      error: (e: ApiError) => { this.saving.set(false); this.err.set(e); },
    });
  }
}
