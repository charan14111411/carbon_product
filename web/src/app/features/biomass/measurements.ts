import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { EvidenceList } from '../additionality/evidence';
import { ApiProblems, Ref } from '../mrv-shared/ui';
import { Allometry, BCampaign, Measurement, Plot } from './biomass.types';

interface TreeEdit { species: string; dbh_cm: number | null; height_m: number | null; count: number | null }

/** Per-plot tree and shrub measurements for one campaign. Append-only: corrections and voids are new versions. */
@Component({
  selector: 'vc-biomass-measurements',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Modal, EvidenceList, ApiProblems, Ref, DayPipe, NumPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!campaigns().length || !plots().length) {
      <section class="card"><vc-empty icon="tree-pine" title="Add plots and a campaign first" text="Measurements are entered per plot for one campaign." /></section>
    } @else {
      <div class="pick">
        <div class="seg">
          @for (c of sortedCampaigns(); track c.id) {
            <button type="button" [class.on]="c.id === campaignId()" (click)="campaignId.set(c.id)"><code>{{ c.code }}</code><span>{{ c.measured_on | day }}</span></button>
          }
        </div>
        <label class="checkbox small"><input type="checkbox" [checked]="showVoided()" (change)="showVoided.set(!showVoided())" />Show voided</label>
      </div>

      <section class="card">
        <div class="card-head"><h3>Plots in {{ campaign()?.code }}</h3><vc-dc cls="MEASURED" />
          <span class="subtle small">{{ doneCount() }} of {{ activePlots().length }} measured</span></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Plot</th><th>Scenario</th><th class="num">Trees</th><th>Species</th><th>Shrubs</th><th>Evidence</th><th>Version</th><th></th></tr></thead>
            <tbody>
              @for (row of rows(); track row.p.id) {
                @let m = row.m;
                <tr [class.void]="m?.status === 'voided'">
                  <td class="nowrap"><code>{{ row.p.code }}</code></td>
                  <td><span class="scn" [class.b]="row.p.scenario === 'baseline'">{{ row.p.scenario }}</span></td>
                  @if (m) {
                    <td class="num">{{ treeCount(m) | num: 0 }}</td>
                    <td class="small">{{ speciesList(m) }}</td>
                    <td class="small">{{ shrubText(m) }}@if (m.harvested) { <vc-badge status="warning">Harvested</vc-badge> }</td>
                    <td><vc-evidence [ids]="m.evidence_ids" [readonly]="true" /></td>
                    <td class="small nowrap"><vc-badge [status]="m.status" /> v{{ m.version }}<div class="subtle">{{ people.name(m.created_by, 'System') }} · {{ m.created_at | ago }}</div></td>
                    <td class="nowrap r">
                      @if (m.status === 'active' && canWrite()) {
                        <button class="btn btn-secondary btn-sm" (click)="openEdit(row.p, m)"><vc-icon name="pencil" [size]="14" />Correct</button>
                        <button class="btn btn-ghost btn-sm" (click)="voidReason = ''; voiding.set(m)">Void</button>
                      } @else if (m.status === 'voided' && m.note) { <span class="subtle small" [title]="m.note">Voided: {{ m.note }}</span> }
                    </td>
                  } @else {
                    <td class="num subtle">—</td><td class="subtle small" colspan="4">Not measured in this campaign</td>
                    <td class="r">@if (canWrite() && row.p.status === 'active') { <button class="btn btn-primary btn-sm" (click)="openNew(row.p)"><vc-icon name="plus" [size]="14" />Enter</button> }</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    }

    <!-- entry drawer -->
    <vc-modal [(open)]="formOpen" [drawer]="true" width="760px" [title]="(editing() ? 'Correct ' : 'Measure ') + 'plot ' + (plot()?.code ?? '')"
      [subtitle]="(campaign()?.code ?? '') + ' · ' + ((campaign()?.measured_on ?? '') | day) + ' · ' + (plot()?.area_m2 ?? 0) + ' m² · ' + (plot()?.scenario ?? '')">
      <div class="stack" style="--gap:16px">
        <section class="blk">
          <div class="bh"><h4>Trees</h4><vc-ref>AR-TOOL14</vc-ref><span class="spacer"></span>
            <span class="subtle small">{{ totalTrees() | num: 0 }} trees · {{ trees().length }} row{{ trees().length === 1 ? '' : 's' }}</span></div>
          <div class="th"><span>Species</span><span>DBH (cm)</span><span>Height (m)</span><span>Count</span><span></span></div>
          @for (t of trees(); track $index; let i = $index) {
            <div class="tr" [class.warn]="rangeWarn(t)">
              <input class="input sm" [attr.list]="'sp-list'" [(ngModel)]="t.species" placeholder="Species" aria-label="Species" />
              <input class="input sm num" type="number" min="0" step="any" [(ngModel)]="t.dbh_cm" aria-label="DBH" />
              <input class="input sm num" type="number" min="0" step="any" [(ngModel)]="t.height_m" [placeholder]="needsHeight(t.species) ? 'needed' : 'optional'" aria-label="Height" />
              <input class="input sm num" type="number" min="1" step="1" [(ngModel)]="t.count" aria-label="Count" />
              <button type="button" class="rm" (click)="removeTree(i)" aria-label="Remove tree row"><vc-icon name="trash" [size]="14" /></button>
              @if (rangeWarn(t); as w) { <span class="tw">{{ w }}</span> }
            </div>
          }
          <datalist id="sp-list">@for (s of species(); track s) { <option [value]="s"></option> }</datalist>
          <div class="row wrap" style="--gap:8px">
            <button type="button" class="btn btn-ghost btn-sm" (click)="addTree()"><vc-icon name="plus" [size]="14" />Add tree</button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="pasteOpen.set(!pasteOpen())"><vc-icon name="clipboard-paste" [size]="14" />Paste rows</button>
          </div>
          @if (pasteOpen()) {
            <div class="paste">
              <textarea class="input mono" rows="4" [(ngModel)]="pasteText" placeholder="species, dbh_cm, height_m, count — one tree (or group) per line"></textarea>
              <button type="button" class="btn btn-secondary btn-sm" (click)="applyPaste()">Add {{ pasteCount() }} row{{ pasteCount() === 1 ? '' : 's' }}</button>
            </div>
          }
        </section>

        <section class="blk">
          <div class="bh"><h4>Shrubs</h4><vc-ref>AR-TOOL14 · Eq. 50/51</vc-ref></div>
          <div class="seg3">
            <button type="button" [class.on]="shrubMode === 'none'" (click)="shrubMode = 'none'">Not measured</button>
            <button type="button" [class.on]="shrubMode === 'cover'" (click)="shrubMode = 'cover'">Crown cover</button>
            <button type="button" [class.on]="shrubMode === 'agb'" (click)="shrubMode = 'agb'">Measured biomass</button>
          </div>
          @if (shrubMode === 'cover') {
            <div class="field"><label for="sh-c">Crown cover (fraction 0–1)</label><input id="sh-c" class="input num" type="number" min="0" max="1" step="0.01" [(ngModel)]="shrubCover" />
              <span class="hint">Biomass then comes from the rule pack's BDR<sub>SF</sub> and forest biomass values.</span></div>
          } @else if (shrubMode === 'agb') {
            <div class="field"><label for="sh-b">Above-ground shrub biomass (t d.m./ha)</label><input id="sh-b" class="input num" type="number" min="0" step="any" [(ngModel)]="shrubAgb" /></div>
          } @else { <p class="hint">Needed when the rule pack includes shrubs in the project boundary.</p> }
          <label class="checkbox"><input type="checkbox" [(ngModel)]="harvested" />Woody biomass was harvested on this plot since the last campaign</label>
          @if (harvested) { <vc-callout tone="warn" icon="alert">Harvested plots need the long-term average GHG benefit (§8.2.2), which this calculator does not compute — a computation that includes this plot will be refused.</vc-callout> }
        </section>

        <div class="form-grid">
          <div class="field span-2"><label>Field sheets or photos <span class="req">*</span></label>
            <vc-evidence [(ids)]="evidence" entityType="biomass_measurement" addLabel="Attach evidence" /></div>
          @if (editing()) {
            <div class="field span-2"><label for="ms-r">Why is it being corrected? <span class="req">*</span></label>
              <textarea id="ms-r" class="input" rows="2" [(ngModel)]="reason" placeholder="e.g. Tree 14 DBH entered in mm"></textarea></div>
          } @else {
            <div class="field span-2"><label for="ms-n">Note <span class="subtle">(optional)</span></label><textarea id="ms-n" class="input" rows="2" [(ngModel)]="note"></textarea></div>
          }
        </div>
        <vc-api-problems [error]="err()" title="Couldn't save the measurement" />
      </div>
      <ng-container footer>
        <span class="grow small subtle">{{ problem() }}</span>
        <button class="btn btn-secondary" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !!problem()" (click)="save()">{{ busy() ? 'Saving…' : editing() ? 'Save new version' : 'Save measurement' }}</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="!!voiding()" (closed)="voiding.set(null)" title="Void this measurement?" width="460px">
      <div class="stack" style="--gap:12px">
        <p class="muted">A voided measurement is kept in the history but no longer used. Enter a fresh measurement afterwards if needed.</p>
        <div class="field"><label for="vd-r">Reason</label><textarea id="vd-r" class="input" rows="2" [(ngModel)]="voidReason"></textarea></div>
        <vc-api-problems [error]="err()" />
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="voiding.set(null)">Cancel</button>
        <button class="btn btn-danger" [disabled]="busy() || voidReason.trim().length < 5" (click)="doVoid()">Void measurement</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .pick{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px}
    .seg{display:flex;flex-wrap:wrap;gap:4px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-200)}
    .seg button{display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 12px;border:0;border-radius:6px;background:none;font:inherit;cursor:pointer;color:var(--stone-600)}
    .seg button span{font-size:11.5px}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .scn{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--forest-100);color:var(--forest-700);text-transform:capitalize}
    .scn.b{background:var(--sand-200);color:var(--stone-700)}
    tr.void td{color:var(--text-3)}
    .r{text-align:right}
    .blk{display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface-2)}
    .bh{display:flex;align-items:center;gap:8px} .bh h4{font-size:14px}
    .th,.tr{display:grid;grid-template-columns:minmax(0,2fr) repeat(3,minmax(0,1fr)) 32px;gap:6px;align-items:center}
    .th span{font-size:11.5px;color:var(--stone-700)}
    .tr.warn .input{border-color:#e7c27a}
    .tw{grid-column:1/-1;font-size:11.5px;color:var(--amber-600);margin-top:-2px}
    .input.sm{height:32px;font-size:13px}
    .rm{display:grid;place-items:center;width:30px;height:30px;border:0;border-radius:6px;background:none;color:var(--stone-400);cursor:pointer}
    .rm:hover{color:var(--danger);background:var(--danger-soft)}
    .paste{display:flex;flex-direction:column;gap:6px;align-items:flex-start}
    .paste textarea{font:12px/1.5 var(--mono)}
    .seg3{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border)}
    .seg3 button{height:30px;border:0;border-radius:6px;background:none;font:500 13px var(--font);color:var(--stone-600);cursor:pointer}
    .seg3 button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .hint{font-size:12px;color:var(--text-3)} .req{color:var(--danger)} .grow{flex:1}
    @media (max-width: 600px){ .th{display:none} .tr{grid-template-columns:1fr 1fr} .tr input:first-child{grid-column:1/-1} }
  `],
})
export class BiomassMeasurements {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);
  projectId = input.required<string>();
  plots = input<Plot[]>([]);
  campaigns = input<BCampaign[]>([]);
  measurements = input<Measurement[]>([]);
  models = input<Allometry[]>([]);
  changed = output<void>();

  campaignId = signal<string | null>(null);
  showVoided = signal(false);
  formOpen = signal(false);
  pasteOpen = signal(false);
  plot = signal<Plot | null>(null);
  editing = signal<Measurement | null>(null);
  voiding = signal<Measurement | null>(null);
  busy = signal(false);
  err = signal<ApiError | null>(null);
  trees = signal<TreeEdit[]>([]);
  shrubMode: 'none' | 'cover' | 'agb' = 'none';
  shrubCover: number | null = null;
  shrubAgb: number | null = null;
  harvested = false;
  evidence: string[] = [];
  note = '';
  reason = '';
  voidReason = '';
  pasteText = '';

  canWrite = computed(() => this.auth.can('calc.run', 'programmes.manage'));
  sortedCampaigns = computed(() => [...this.campaigns()].sort((a, b) => b.measured_on.localeCompare(a.measured_on)));
  campaign = computed(() => this.campaigns().find(c => c.id === this.campaignId()) ?? null);
  activePlots = computed(() => this.plots().filter(p => p.status === 'active'));
  approvedModels = computed(() => this.models().filter(m => m.status === 'approved'));
  species = computed(() => [...new Set(this.approvedModels().map(m => m.species).filter(s => s !== '*'))].sort());
  rows = computed(() => {
    const cid = this.campaignId();
    const ms = this.measurements().filter(m => m.campaign_id === cid && (this.showVoided() || m.status === 'active'));
    return this.plots().map(p => ({ p, m: ms.find(m => m.plot_id === p.id && m.status === 'active') ?? ms.find(m => m.plot_id === p.id) ?? null }));
  });
  doneCount = computed(() => this.rows().filter(r => r.m?.status === 'active').length);
  totalTrees = computed(() => this.trees().reduce((a, t) => a + (Number(t.count) || 0), 0));

  constructor() {
    this.people.load();
    effect(() => {
      const list = this.sortedCampaigns();
      untracked(() => { if (!list.find(c => c.id === this.campaignId())) this.campaignId.set(list[0]?.id ?? null); });
    });
  }

  treeCount(m: Measurement) { return m.trees.reduce((a, t) => a + t.count, 0); }
  speciesList(m: Measurement) { const s = [...new Set(m.trees.map(t => t.species))]; return s.length ? s.slice(0, 3).join(', ') + (s.length > 3 ? ` +${s.length - 3}` : '') : 'No trees'; }
  shrubText(m: Measurement) {
    if (!m.shrub) return '—';
    if (m.shrub.crown_cover_fraction !== undefined && m.shrub.crown_cover_fraction !== null) return `Cover ${(m.shrub.crown_cover_fraction * 100).toFixed(0)} % `;
    return `${m.shrub.agb_t_dm_ha} t d.m./ha `;
  }
  private modelFor(species: string) {
    const n = species.trim().toLowerCase();
    return this.approvedModels().find(m => m.species.trim().toLowerCase() === n) ?? this.approvedModels().find(m => m.species === '*') ?? null;
  }
  needsHeight(species: string) { const m = this.modelFor(species); return !!m && m.form !== 'power_dbh'; }
  rangeWarn(t: TreeEdit): string {
    if (!t.species?.trim() || !t.dbh_cm) return '';
    const m = this.modelFor(t.species);
    if (!m) return 'No approved equation for this species (and no generic one).';
    if (t.dbh_cm < m.dbh_min_cm || t.dbh_cm > m.dbh_max_cm) return `DBH outside the equation's range ${m.dbh_min_cm}–${m.dbh_max_cm} cm.`;
    if (this.needsHeight(t.species) && !t.height_m) return 'This species\' equation needs tree height.';
    return '';
  }

  private reset(p: Plot, m: Measurement | null) {
    this.plot.set(p);
    this.editing.set(m);
    this.err.set(null);
    this.pasteOpen.set(false);
    this.pasteText = '';
    this.trees.set(m ? m.trees.map(t => ({ ...t })) : [{ species: '', dbh_cm: null, height_m: null, count: 1 }]);
    this.shrubMode = !m?.shrub ? 'none' : m.shrub.crown_cover_fraction !== undefined && m.shrub.crown_cover_fraction !== null ? 'cover' : 'agb';
    this.shrubCover = m?.shrub?.crown_cover_fraction ?? null;
    this.shrubAgb = m?.shrub?.agb_t_dm_ha ?? null;
    this.harvested = m?.harvested ?? false;
    this.evidence = m ? [...m.evidence_ids] : [];
    this.note = '';
    this.reason = '';
    this.formOpen.set(true);
  }
  openNew(p: Plot) { this.reset(p, null); }
  openEdit(p: Plot, m: Measurement) { this.reset(p, m); }
  addTree() { const last = this.trees().at(-1); this.trees.update(t => [...t, { species: last?.species ?? '', dbh_cm: null, height_m: null, count: 1 }]); }
  removeTree(i: number) { this.trees.update(t => t.filter((_, j) => j !== i)); }
  private parsePaste(): TreeEdit[] {
    return this.pasteText.split(/\r?\n/).map(l => l.split(/[,\t;]/).map(x => x.trim())).filter(c => c[0] && c[1] && !/species/i.test(c[0]))
      .map(c => ({ species: c[0], dbh_cm: Number(c[1]) || null, height_m: c[2] ? Number(c[2]) || null : null, count: c[3] ? Math.max(1, Math.round(Number(c[3]) || 1)) : 1 }));
  }
  pasteCount() { return this.parsePaste().length; }
  applyPaste() {
    const add = this.parsePaste();
    this.trees.update(t => [...t.filter(x => x.species.trim() || x.dbh_cm), ...add]);
    this.pasteText = '';
    this.pasteOpen.set(false);
  }

  problem(): string {
    for (const [i, t] of this.trees().entries()) {
      if (!t.species.trim() && !t.dbh_cm) continue;
      if (!t.species.trim()) return `Tree row ${i + 1}: give the species`;
      if (!t.dbh_cm || t.dbh_cm <= 0) return `Tree row ${i + 1}: give the DBH`;
      if (!t.count || t.count < 1) return `Tree row ${i + 1}: count must be at least 1`;
    }
    if (this.shrubMode === 'cover' && (this.shrubCover === null || this.shrubCover < 0 || this.shrubCover > 1)) return 'Crown cover must be between 0 and 1';
    if (this.shrubMode === 'agb' && (this.shrubAgb === null || this.shrubAgb < 0)) return 'Give the shrub biomass';
    if (!this.evidence.length) return 'Attach at least one field sheet or photo';
    if (this.editing() && this.reason.trim().length < 5) return 'Say why it is being corrected';
    return '';
  }

  private body() {
    const trees = this.trees().filter(t => t.species.trim() && t.dbh_cm).map(t => ({
      species: t.species.trim(), dbh_cm: Number(t.dbh_cm), height_m: t.height_m ? Number(t.height_m) : null, count: Math.round(Number(t.count) || 1),
    }));
    const shrub = this.shrubMode === 'cover' ? { crown_cover_fraction: Number(this.shrubCover) } : this.shrubMode === 'agb' ? { agb_t_dm_ha: Number(this.shrubAgb) } : null;
    return { trees, shrub, harvested: this.harvested, evidence_ids: this.evidence };
  }

  save() {
    const p = this.plot();
    const c = this.campaign();
    if (!p || !c) return;
    const m = this.editing();
    this.busy.set(true);
    this.err.set(null);
    const req = m
      ? this.api.post<Measurement>(`/biomass/measurements/${m.record_id}/versions`, { ...this.body(), reason: this.reason.trim() })
      : this.api.post<Measurement>('/biomass/measurements', { ...this.body(), campaign_id: c.id, plot_id: p.id, note: this.note });
    req.subscribe({
      next: r => { this.busy.set(false); this.formOpen.set(false); this.toast.success(m ? `Plot ${p.code} corrected (v${r.version})` : `Plot ${p.code} measured`); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
  doVoid() {
    const m = this.voiding();
    if (!m) return;
    this.busy.set(true);
    this.err.set(null);
    this.api.post<Measurement>(`/biomass/measurements/${m.record_id}/void`, { reason: this.voidReason.trim() }).subscribe({
      next: () => { this.busy.set(false); this.voiding.set(null); this.toast.success('Measurement voided'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
}
