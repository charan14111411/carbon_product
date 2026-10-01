import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, DataClass, Empty, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { EvidenceList } from '../additionality/evidence';
import { ApiProblems, DraftTerm, Eq, PublishedTerms, Ref } from '../mrv-shared/ui';
import { Residue, ResidueResult } from './leakage.types';

/** Biomass residues that used to be burnt for energy and are now kept on the field (LE_BR, CDM TOOL16). */
@Component({
  selector: 'vc-residues',
  imports: [FormsModule, Icon, Badge, DataClass, Empty, Modal, EvidenceList, ApiProblems, Eq, Ref, PublishedTerms, NumPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small intro">If the project keeps crop residues on the field that someone used to burn for energy, that energy now comes from another
        fuel. Record each residue type per monitoring period with its quantity and the replacing fuel's factors — or rule its leakage out with evidence.</p>
      @if (canWrite()) { <button class="btn btn-primary" (click)="start(null)"><vc-icon name="plus" />Record residue</button> }
    </div>

    <div class="cols">
      <section class="card">
        <div class="card-head"><h3>Residue records</h3><vc-dc cls="RECORDED" />
          <select class="input sel" [ngModel]="period()" (ngModelChange)="period.set($event)" aria-label="Period">
            <option value="">All periods</option>
            @for (p of periods(); track p) { <option [value]="p">{{ p }}</option> }
          </select>
          <label class="checkbox small"><input type="checkbox" [checked]="showVoided()" (change)="showVoided.set(!showVoided())" />Voided</label>
        </div>
        @if (!shown().length) {
          <vc-empty icon="wheat" title="No residue records" text="Record each residue that was used for energy before the project, even if its leakage is ruled out." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Period</th><th>Residue</th><th class="num">Quantity <span class="u">t d.m.</span></th><th class="num">NCV <span class="u">GJ/t</span></th><th class="num">EF <span class="u">t CO₂/GJ</span></th><th>Version</th><th></th></tr></thead>
              <tbody>
                @for (r of shown(); track r.id) {
                  <tr [class.void]="r.status === 'voided'">
                    <td class="nowrap">{{ r.period_label }}</td>
                    <td><strong>{{ r.residue_type }}</strong><div class="subtle small clip" [title]="r.baseline_energy_use">{{ r.baseline_energy_use }}</div>
                      @if (r.leakage_ruled_out) { <span class="ro" [title]="r.ruled_out_reason">Leakage ruled out</span> }
                      <div class="ev"><vc-evidence [ids]="r.evidence_ids" [readonly]="true" /></div></td>
                    <td class="num">{{ r.quantity_t_dry | num: 2 }}</td>
                    <td class="num">{{ r.ncv_gj_per_t_dry ?? '—' }}</td>
                    <td class="num">{{ r.ef_co2_t_per_gj ?? '—' }}</td>
                    <td class="small nowrap"><vc-badge [status]="r.status" /> v{{ r.version }}<div class="subtle">{{ people.name(r.created_by, 'System') }} · {{ r.created_at | ago }}</div></td>
                    <td class="nowrap r">@if (r.status === 'active' && canWrite()) {
                      <button class="btn btn-ghost btn-sm" (click)="start(r)"><vc-icon name="pencil" [size]="14" /></button>
                      <button class="btn btn-ghost btn-sm" (click)="voidReason = ''; voiding.set(r)">Void</button> }</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <section class="card calc">
        <div class="card-head"><h3>LE_BR for a period</h3><vc-ref>VM0042 §8.4.4 p.53 · TOOL16</vc-ref></div>
        <div class="card-body stack" style="--gap:12px">
          <div class="field"><label for="rb-p">Monitoring period</label>
            <input id="rb-p" class="input" [attr.list]="'rb-periods'" [(ngModel)]="calcPeriod" placeholder="e.g. 2025-26" />
            <datalist id="rb-periods">@for (p of periods(); track p) { <option [value]="p"></option> }</datalist></div>
          <div class="row" style="--gap:8px">
            <button class="btn btn-secondary" [disabled]="busy() || !calcPeriod.trim()" (click)="preview()"><vc-icon name="play" />Preview</button>
            @if (canPublish()) { <button class="btn btn-primary" [disabled]="busy() || !result() || result()!.period_label !== calcPeriod.trim()" (click)="publish()"><vc-icon name="send" />Publish draft term</button> }
          </div>
          <vc-api-problems [error]="calcErr()" title="Couldn't compute LE_BR" />
          @if (result(); as r) {
            <div class="total"><span>LE_BR · {{ r.period_label }}</span><strong class="num">{{ r.le_br_t_co2e | num: 3 }}</strong><em>tCO₂e</em><vc-dc cls="CALCULATED" /></div>
            <table class="mini">
              <thead><tr><th>Residue</th><th class="num">Energy <span class="u">GJ</span></th><th class="num">LE_BR</th></tr></thead>
              <tbody>
                @for (i of r.items; track i.record_id) {
                  <tr><td>{{ i.residue_type }}@if (i.leakage_ruled_out) { <span class="ro">ruled out</span> }</td>
                    <td class="num">{{ i.energy_gj === null ? '—' : (i.energy_gj | num: 1) }}</td><td class="num">{{ i.le_br_t_co2e | num: 3 }}</td></tr>
                }
              </tbody>
            </table>
            <p class="small subtle"><vc-eq>Σ BR × NCV × EF</vc-eq> {{ r.sign_convention }}.</p>
          }
          @if (published(); as t) { <vc-published-terms [terms]="t" /> }
        </div>
      </section>
    </div>

    <vc-modal [(open)]="formOpen" [drawer]="true" width="620px" [title]="editing() ? 'Correct residue record' : 'Record a residue diverted'" [subtitle]="editing() ? 'Saved as a new version.' : 'One residue type for one monitoring period.'">
      <div class="stack" style="--gap:14px">
        <div class="form-grid">
          <div class="field"><label for="rs-p">Monitoring period</label><input id="rs-p" class="input" [(ngModel)]="f.period_label" [disabled]="!!editing()" maxlength="40" placeholder="e.g. 2025-26" /></div>
          <div class="field"><label for="rs-t">Residue type</label><input id="rs-t" class="input" [(ngModel)]="f.residue_type" maxlength="120" placeholder="e.g. Rice straw" /></div>
          <div class="field span-2"><label for="rs-b">How it was used for energy before the project</label>
            <textarea id="rs-b" class="input" rows="2" [(ngModel)]="f.baseline_energy_use" placeholder="e.g. Sold to the local brick kiln as fuel"></textarea></div>
          <div class="field"><label for="rs-q">Quantity diverted (t dry matter)</label><input id="rs-q" class="input num" type="number" min="0" step="any" [(ngModel)]="f.quantity_t_dry" /></div>
          <div class="field chk"><label class="checkbox"><input type="checkbox" [(ngModel)]="f.leakage_ruled_out" />Leakage is ruled out for this residue</label></div>
        </div>
        @if (f.leakage_ruled_out) {
          <div class="field"><label for="rs-r">Why leakage is ruled out (TOOL16)</label>
            <textarea id="rs-r" class="input" rows="3" [(ngModel)]="f.ruled_out_reason" placeholder="e.g. Surplus residue: the region burns more than 25 % of this residue in the open (survey attached)"></textarea></div>
        } @else {
          <div class="form-grid">
            <div class="field"><label for="rs-n">Net calorific value (GJ / t dry)</label><input id="rs-n" class="input num" type="number" min="0" step="any" [(ngModel)]="f.ncv_gj_per_t_dry" /></div>
            <div class="field"><label for="rs-e">EF of the replacing fuel (t CO₂ / GJ)</label><input id="rs-e" class="input num" type="number" min="0" max="1" step="any" [(ngModel)]="f.ef_co2_t_per_gj" /></div>
            <div class="field span-2"><label for="rs-s">Source of the factors</label><input id="rs-s" class="input" [(ngModel)]="f.factor_source" placeholder="e.g. IPCC 2006 Vol. 2 Table 1.2 (coal, sub-bituminous)" /></div>
          </div>
          @if (energy() !== null) { <div class="pv">This record gives <strong class="num">{{ energy()! | num: 1 }} GJ</strong> → <strong class="num">{{ le()! | num: 3 }} tCO₂e</strong> of leakage.</div> }
        }
        <div class="field"><label>Evidence <span class="req">*</span></label><vc-evidence [(ids)]="f.evidence_ids" entityType="leakage_residue" /></div>
        @if (editing()) {
          <div class="field"><label for="rs-why">Why is it being corrected? <span class="req">*</span></label><textarea id="rs-why" class="input" rows="2" [(ngModel)]="f.reason"></textarea></div>
        } @else {
          <div class="field"><label for="rs-note">Note <span class="subtle">(optional)</span></label><textarea id="rs-note" class="input" rows="2" [(ngModel)]="f.note"></textarea></div>
        }
        <vc-api-problems [error]="err()" title="Couldn't save the record" />
      </div>
      <ng-container footer>
        <span class="grow small subtle">{{ problem() }}</span>
        <button class="btn btn-secondary" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !!problem()" (click)="save()">{{ busy() ? 'Saving…' : 'Save' }}</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="!!voiding()" (closed)="voiding.set(null)" title="Void this residue record?" width="460px">
      <div class="stack" style="--gap:12px">
        <div class="field"><label for="rv-r">Reason</label><textarea id="rv-r" class="input" rows="2" [(ngModel)]="voidReason"></textarea></div>
        <vc-api-problems [error]="err()" />
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="voiding.set(null)">Cancel</button>
        <button class="btn btn-danger" [disabled]="busy() || voidReason.trim().length < 5" (click)="doVoid()">Void record</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:16px;align-items:flex-start;margin-bottom:16px}
    .intro{flex:1;max-width:860px}
    .cols{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(300px,1fr);gap:16px;align-items:start}
    .sel{width:150px;height:32px}
    .card-head{flex-wrap:wrap}
    .u{font-size:11px;color:var(--text-3);font-weight:400}
    .clip{max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .ro{display:inline-block;margin-top:3px;font-size:11px;font-weight:600;padding:1px 7px;border-radius:999px;background:var(--sky-100);color:var(--sky-600)}
    tr.void td{color:var(--text-3)}
    .r{text-align:right}
    .ev{margin-top:6px}
    .calc{position:sticky;top:76px}
    .total{display:flex;align-items:baseline;gap:8px;padding:12px 14px;border-radius:var(--radius-sm);background:var(--forest-50);border:1px solid var(--forest-200)}
    .total span{flex:1;font-size:12.5px;color:var(--text-2)} .total strong{font-size:20px;color:var(--forest-700)} .total em{font-style:normal;font-size:12px;color:var(--text-3)}
    .mini{width:100%;border-collapse:collapse;font-size:12.5px}
    .mini th{white-space:nowrap;text-align:left;font-weight:500;color:var(--text-3);padding:5px 6px;border-bottom:1px solid var(--border)}
    .mini td{padding:5px 6px;border-bottom:1px solid var(--stone-100)} .mini .num{text-align:right}
    .chk{justify-content:flex-end}
    .pv{padding:10px 12px;border-radius:var(--radius-sm);background:var(--dc-calculated-bg);font-size:13px}
    .req{color:var(--danger)} .grow{flex:1}
    @media (max-width: 1500px){ .cols{grid-template-columns:minmax(0,1fr)} .calc{position:static} }
    @media (max-width: 760px){ .bar{flex-direction:column} }
  `],
})
export class ResiduesTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);
  projectId = input.required<string>();
  records = input<Residue[]>([]);
  changed = output<void>();
  termPublished = output<void>();

  period = signal('');
  showVoided = signal(false);
  formOpen = signal(false);
  editing = signal<Residue | null>(null);
  voiding = signal<Residue | null>(null);
  busy = signal(false);
  err = signal<ApiError | null>(null);
  calcErr = signal<ApiError | null>(null);
  result = signal<ResidueResult | null>(null);
  published = signal<DraftTerm[] | null>(null);
  calcPeriod = '';
  voidReason = '';
  f = this.blank();

  canWrite = computed(() => this.auth.can('calc.run', 'programmes.manage'));
  canPublish = computed(() => this.auth.can('calc.run', 'rules.edit'));
  periods = computed(() => [...new Set(this.records().map(r => r.period_label))].sort().reverse());
  shown = computed(() => this.records().filter(r => (!this.period() || r.period_label === this.period()) && (this.showVoided() || r.status === 'active')));

  constructor() {
    this.people.load();
    effect(() => { const p = this.periods(); untracked(() => { if (!this.calcPeriod && p.length) this.calcPeriod = p[0]; }); });
  }

  private blank() {
    return { period_label: '', residue_type: '', baseline_energy_use: '', quantity_t_dry: null as number | null, ncv_gj_per_t_dry: null as number | null, ef_co2_t_per_gj: null as number | null, factor_source: '', leakage_ruled_out: false, ruled_out_reason: '', evidence_ids: [] as string[], note: '', reason: '' };
  }
  start(r: Residue | null) {
    this.editing.set(r);
    this.err.set(null);
    this.f = r ? { ...this.blank(), period_label: r.period_label, residue_type: r.residue_type, baseline_energy_use: r.baseline_energy_use, quantity_t_dry: r.quantity_t_dry, ncv_gj_per_t_dry: r.ncv_gj_per_t_dry, ef_co2_t_per_gj: r.ef_co2_t_per_gj, factor_source: r.factor_source, leakage_ruled_out: r.leakage_ruled_out, ruled_out_reason: r.ruled_out_reason, evidence_ids: [...r.evidence_ids] }
      : { ...this.blank(), period_label: this.period() || this.periods()[0] || '' };
    this.formOpen.set(true);
  }
  energy() { const q = Number(this.f.quantity_t_dry), n = Number(this.f.ncv_gj_per_t_dry); return this.f.quantity_t_dry !== null && this.f.ncv_gj_per_t_dry !== null && q >= 0 && n > 0 ? q * n : null; }
  le() { const e = this.energy(); return e !== null && this.f.ef_co2_t_per_gj !== null ? e * Number(this.f.ef_co2_t_per_gj) : null; }
  problem() {
    const f = this.f;
    if (!f.period_label.trim()) return 'Give the monitoring period';
    if (f.residue_type.trim().length < 2) return 'Name the residue';
    if (f.baseline_energy_use.trim().length < 5) return 'Describe the energy use before the project';
    if (f.quantity_t_dry === null || Number(f.quantity_t_dry) < 0) return 'Give the quantity diverted';
    if (f.leakage_ruled_out && f.ruled_out_reason.trim().length < 10) return 'Explain why leakage is ruled out';
    if (!f.leakage_ruled_out && (f.ncv_gj_per_t_dry === null || f.ef_co2_t_per_gj === null)) return 'Give the calorific value and emission factor';
    if (!f.leakage_ruled_out && f.factor_source.trim().length < 5) return 'Say where the factors come from';
    if (!f.evidence_ids.length) return 'Attach evidence';
    if (this.editing() && f.reason.trim().length < 5) return 'Say why it is being corrected';
    return '';
  }
  save() {
    const f = this.f;
    const body = {
      period_label: f.period_label.trim(), residue_type: f.residue_type.trim(), baseline_energy_use: f.baseline_energy_use.trim(), quantity_t_dry: Number(f.quantity_t_dry),
      ncv_gj_per_t_dry: f.leakage_ruled_out || f.ncv_gj_per_t_dry === null ? null : Number(f.ncv_gj_per_t_dry),
      ef_co2_t_per_gj: f.leakage_ruled_out || f.ef_co2_t_per_gj === null ? null : Number(f.ef_co2_t_per_gj),
      factor_source: f.factor_source.trim(), leakage_ruled_out: f.leakage_ruled_out, ruled_out_reason: f.ruled_out_reason.trim(), evidence_ids: f.evidence_ids, note: f.note,
    };
    const r = this.editing();
    this.busy.set(true);
    this.err.set(null);
    const req = r ? this.api.post<Residue>(`/leakage/residues/${r.record_id}/versions`, { ...body, reason: f.reason.trim() }) : this.api.post<Residue>(`/projects/${this.projectId()}/leakage/residues`, body);
    req.subscribe({
      next: () => { this.busy.set(false); this.formOpen.set(false); this.toast.success(r ? 'Residue record corrected' : 'Residue recorded'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
  doVoid() {
    const r = this.voiding();
    if (!r) return;
    this.busy.set(true);
    this.err.set(null);
    this.api.post<Residue>(`/leakage/residues/${r.record_id}/void`, { reason: this.voidReason.trim() }).subscribe({
      next: () => { this.busy.set(false); this.voiding.set(null); this.toast.success('Residue record voided'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
  preview() {
    this.busy.set(true);
    this.calcErr.set(null);
    this.published.set(null);
    this.api.post<ResidueResult>(`/projects/${this.projectId()}/leakage/residues/compute`, { period_label: this.calcPeriod.trim() }).subscribe({
      next: r => { this.busy.set(false); this.result.set(r); },
      error: (e: ApiError) => { this.busy.set(false); this.result.set(null); this.calcErr.set(e); },
    });
  }
  publish() {
    this.busy.set(true);
    this.calcErr.set(null);
    this.api.post<{ term: DraftTerm; result: ResidueResult }>(`/projects/${this.projectId()}/leakage/residues/publish-term`, { period_label: this.calcPeriod.trim() }).subscribe({
      next: r => { this.busy.set(false); this.result.set(r.result); this.published.set([r.term]); this.termPublished.emit(); this.toast.success('Draft LE_BR term published'); },
      error: (e: ApiError) => { this.busy.set(false); this.calcErr.set(e); },
    });
  }
}
