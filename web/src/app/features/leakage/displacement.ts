import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { EvidenceList } from '../additionality/evidence';
import { ApiProblems, DraftTerm, Eq, PublishedTerms, Ref } from '../mrv-shared/ui';
import { Commodity, Displacement, DisplacementResult, Livestock } from './leakage.types';

interface CRow { commodity: string; unit: string; baseline_production: number | null; project_production: number | null; lm: number | null; inl_ha: number | null }
interface LRow { livestock_type: string; baseline_head: number | null; project_head: number | null }

/** Displacement / production declines per calendar year (VM0042 §8.4.2–8.4.3, VMD0054, Eq. 34–36). */
@Component({
  selector: 'vc-displacement',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Modal, EvidenceList, ApiProblems, Eq, Ref, PublishedTerms, NumPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small intro">When the project lowers what the land produces — fewer animals, less of a crop — that production may move elsewhere and
        clear land there. Record every calendar year from the project start: either show production did not fall (with evidence), or enter the
        VMD0054 worksheet values. A missing year blocks the computation.</p>
      @if (canWrite()) { <button class="btn btn-primary" (click)="start(null)"><vc-icon name="plus" />Record year</button> }
    </div>

    <section class="card">
      <div class="card-head"><h3>Years</h3><vc-dc cls="RECORDED" /><span class="subtle small">{{ active().length }} recorded</span>
        <label class="checkbox small"><input type="checkbox" [checked]="showVoided()" (change)="showVoided.set(!showVoided())" />Voided</label></div>
      @if (!shown().length) {
        <vc-empty icon="truck" title="No years recorded" text="Start with the project start year. Most years show no production decrease — record them with the evidence." />
      } @else {
        <div class="years">
          @for (r of shown(); track r.id) {
            <article class="yr" [class.void]="r.status === 'voided'" [class.nd]="r.mode === 'no_decrease'">
              <header>
                <strong class="y num">{{ r.year }}</strong>
                <span class="mode" [class.v]="r.mode === 'vmd0054'">{{ r.mode === 'vmd0054' ? 'VMD0054 worksheet' : 'No production decrease' }}</span>
                <span class="spacer"></span>
                <vc-badge [status]="r.status" /><span class="subtle small">v{{ r.version }}</span>
              </header>
              <div class="b">
                <div class="facts small">
                  <span><vc-icon name="wheat" [size]="13" />{{ r.commodities.length }} commodit{{ r.commodities.length === 1 ? 'y' : 'ies' }}</span>
                  <span><vc-icon name="users" [size]="13" />{{ headText(r) }}</span>
                  @if (r.mode === 'vmd0054') { <span><vc-icon name="sigma" [size]="13" />EF {{ r.ef_t_co2e_per_ha ?? '—' }} tCO₂e/ha</span> }
                  @if (declined(r)) { <span class="dec"><vc-icon name="trend-down" [size]="13" />Herd fell</span> }
                </div>
                <p class="st small" [title]="r.statement">{{ r.statement }}</p>
                <vc-evidence [ids]="r.evidence_ids" [readonly]="true" />
              </div>
              <footer>
                <span class="subtle small">{{ people.name(r.created_by, 'System') }} · {{ r.created_at | ago }}</span>
                <span class="spacer"></span>
                @if (r.status === 'active' && canWrite()) {
                  <button class="btn btn-ghost btn-sm" (click)="start(r)"><vc-icon name="pencil" [size]="14" />Correct</button>
                  <button class="btn btn-ghost btn-sm" (click)="voidReason = ''; voiding.set(r)">Void</button>
                }
              </footer>
            </article>
          }
        </div>
      }
    </section>

    <section class="card calc">
      <div class="card-head"><h3>LK_disp for a verification period</h3><vc-ref>VM0042 Eq. 34–36 p.53 · VMD0054</vc-ref></div>
      <div class="card-body">
        <div class="cf">
          <div class="field"><label for="dc-l">Period label</label><input id="dc-l" class="input" [(ngModel)]="c.period_label" maxlength="40" /></div>
          <div class="field"><label for="dc-s">Period start</label><input id="dc-s" type="date" class="input" [(ngModel)]="c.period_start" /></div>
          <div class="field"><label for="dc-e">Period end</label><input id="dc-e" type="date" class="input" [(ngModel)]="c.period_end" /></div>
          <div class="btns">
            <button class="btn btn-secondary" [disabled]="busy() || !cValid()" (click)="preview()"><vc-icon name="play" />Preview</button>
            @if (canPublish()) { <button class="btn btn-primary" [disabled]="busy() || !result()" (click)="publish()"><vc-icon name="send" />Publish draft term</button> }
          </div>
        </div>
        <div class="mt"><vc-api-problems [error]="calcErr()" title="Couldn't compute LK_disp" /></div>
        @if (result(); as r) {
          @if (r.warnings.length) {
            <vc-callout tone="warn" icon="circle-alert" class="mt"><strong>{{ r.warnings.length }} warning{{ r.warnings.length === 1 ? '' : 's' }}</strong>
              <ul class="wl">@for (w of r.warnings; track $index) { <li>{{ w }}</li> }</ul></vc-callout>
          }
          <div class="tiles mt">
            <div class="tile hi"><span>Period value</span><strong class="num">{{ r.value_t_co2e | num: 3 }}</strong><em>tCO₂e</em></div>
            <div class="tile"><span>LK_t (cumulative)</span><strong class="num">{{ r.lk_t_t_co2e | num: 3 }}</strong><em>tCO₂e</em></div>
            <div class="tile"><span>LK_prior</span><strong class="num">{{ r.lk_prior_t_co2e | num: 3 }}</strong><em>tCO₂e</em></div>
            <div class="tile"><span>LK_disp,t</span><strong class="num">{{ r.lk_disp_annual_t_co2e | num: 3 }}</strong><em>tCO₂e/yr · {{ r.verification_years | num: 2 }} yr</em></div>
          </div>
          @if (r.all_no_decrease) { <vc-callout tone="ok" icon="check-circle" class="mt">Every year in the period shows no production decrease, so LK_disp is zero (§8.4.2 b).</vc-callout> }
          <div class="table-wrap mt bordered">
            <table class="table">
              <thead><tr><th>Year</th><th>Basis</th><th class="num">AL <span class="u">ha</span> · Eq. 35</th><th class="num">EF <span class="u">tCO₂e/ha</span></th><th class="num">Leakage <span class="u">tCO₂e</span></th><th>Commodities (FP → l, INL)</th></tr></thead>
              <tbody>
                @for (y of r.years; track y.year) {
                  <tr [class.prior]="y.year < periodFirst(r)">
                    <td class="num"><strong>{{ y.year }}</strong>@if (y.year < periodFirst(r)) { <div class="subtle small">prior</div> }</td>
                    <td class="small">{{ y.mode === 'vmd0054' ? 'VMD0054' : 'No decrease' }} <vc-eq>{{ y.eq }}</vc-eq></td>
                    <td class="num">{{ y.al_ha | num: 3 }}</td><td class="num">{{ y.ef_t_co2e_per_ha ?? '—' }}</td>
                    <td class="num"><strong>{{ y.leakage_t_co2e | num: 3 }}</strong></td>
                    <td class="small">@for (cm of y.commodities; track cm.commodity) { <span class="cm">{{ cm.commodity }}@if (cm.l !== undefined) { · FP {{ cm.fp | num: 2 }} → l {{ cm.l | num: 2 }} {{ cm.unit }} · INL {{ cm.inl_ha ?? '—' }} ha }</span> }</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <ul class="notes small subtle">@for (n of r.method_notes; track $index) { <li>{{ n }}</li> }</ul>
        }
        @if (published(); as t) { <div class="mt"><vc-published-terms [terms]="t" /></div> }
      </div>
    </section>

    <!-- record form -->
    <vc-modal [(open)]="formOpen" [drawer]="true" width="780px" [title]="editing() ? 'Correct ' + editing()!.year : 'Record a year'" subtitle="Production and livestock for one calendar year, with evidence.">
      <div class="stack" style="--gap:16px">
        <div class="form-grid">
          <div class="field"><label for="dy-y">Calendar year</label><input id="dy-y" class="input num" type="number" min="1990" max="2200" [(ngModel)]="f.year" [disabled]="!!editing()" /></div>
          <div class="field"><label>Basis</label>
            <div class="seg"><button type="button" [class.on]="f.mode === 'no_decrease'" (click)="f.mode = 'no_decrease'">No production decrease</button><button type="button" [class.on]="f.mode === 'vmd0054'" (click)="f.mode = 'vmd0054'">VMD0054 worksheet</button></div></div>
        </div>
        <vc-callout tone="info" icon="info">
          @if (f.mode === 'no_decrease') { Show with evidence that production of every commodity did not fall compared with the baseline (§8.4.2 b). Then LK_disp is zero for the year. }
          @else { Enter, per commodity, the baseline and project production, any leakage-mitigation production (LM) and the net land conversion INL from the VMD0054 worksheet (Eq. 34–35). }
        </vc-callout>

        <section class="blk">
          <div class="bh"><h4>Commodities</h4><span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" (click)="addC()"><vc-icon name="plus" [size]="14" />Add commodity</button></div>
          <div class="ch" [class.v]="f.mode === 'vmd0054'"><span>Commodity</span><span>Unit</span><span>Baseline</span><span>Project</span>@if (f.mode === 'vmd0054') { <span>LM</span><span>INL (ha)</span> }<span></span></div>
          @for (r of cRows(); track $index; let i = $index) {
            <div class="cr" [class.v]="f.mode === 'vmd0054'">
              <input class="input sm" [(ngModel)]="r.commodity" placeholder="e.g. Milk" aria-label="Commodity" />
              <input class="input sm" [(ngModel)]="r.unit" placeholder="t" aria-label="Unit" />
              <input class="input sm num" type="number" min="0" step="any" [(ngModel)]="r.baseline_production" aria-label="Baseline production" />
              <input class="input sm num" type="number" min="0" step="any" [(ngModel)]="r.project_production" aria-label="Project production" />
              @if (f.mode === 'vmd0054') {
                <input class="input sm num" type="number" step="any" [(ngModel)]="r.lm" aria-label="LM" />
                <input class="input sm num" type="number" step="any" [(ngModel)]="r.inl_ha" aria-label="INL" />
              }
              <button type="button" class="rm" (click)="removeC(i)" aria-label="Remove commodity"><vc-icon name="trash" [size]="14" /></button>
              @if (fall(r)) { <span class="cw">{{ f.mode === 'no_decrease' ? 'Production fell — choose the VMD0054 basis instead.' : 'FP = ' + fall(r) + ' ' + r.unit + ' foregone' }}</span> }
            </div>
          } @empty { <p class="subtle small">No commodities yet.</p> }
        </section>

        <section class="blk">
          <div class="bh"><h4>Livestock</h4><span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" (click)="addL()"><vc-icon name="plus" [size]="14" />Add livestock</button></div>
          @for (r of lRows(); track $index; let i = $index) {
            <div class="lr">
              <input class="input sm" [(ngModel)]="r.livestock_type" placeholder="e.g. Dairy cattle" aria-label="Livestock type" />
              <div class="lf"><span>Baseline head</span><input class="input sm num" type="number" min="0" step="any" [(ngModel)]="r.baseline_head" /></div>
              <div class="lf"><span>Project head</span><input class="input sm num" type="number" min="0" step="any" [(ngModel)]="r.project_head" /></div>
              <button type="button" class="rm" (click)="removeL(i)" aria-label="Remove livestock"><vc-icon name="trash" [size]="14" /></button>
            </div>
          } @empty { <p class="subtle small">No livestock in this project, or none recorded.</p> }
          @if (herdFell()) { <vc-callout tone="warn" icon="trend-down">The herd fell. Under §8.4.2 (a) the baseline population is used for project livestock emissions, or show under (b) that production was kept and animals were slaughtered, not moved.</vc-callout> }
        </section>

        @if (f.mode === 'vmd0054') {
          <div class="form-grid">
            <div class="field"><label for="dy-ef">Emission factor per hectare converted (tCO₂e/ha)</label><input id="dy-ef" class="input num" type="number" min="0" step="any" [(ngModel)]="f.ef_t_co2e_per_ha" /></div>
            <div class="field"><label for="dy-efs">Source of the factor</label><input id="dy-efs" class="input" [(ngModel)]="f.ef_source" placeholder="VMD0054 worksheet, table and version" /></div>
          </div>
        }
        <div class="field"><label for="dy-st">What the evidence shows</label>
          <textarea id="dy-st" class="input" rows="3" [(ngModel)]="f.statement" placeholder="e.g. Dairy cooperative records show milk deliveries unchanged; 4 cull cows sold for slaughter (receipts attached)"></textarea></div>
        <div class="field"><label>Evidence <span class="req">*</span></label><vc-evidence [(ids)]="f.evidence_ids" entityType="leakage_displacement" /></div>
        @if (editing()) {
          <div class="field"><label for="dy-r">Why is it being corrected? <span class="req">*</span></label><textarea id="dy-r" class="input" rows="2" [(ngModel)]="f.reason"></textarea></div>
        } @else {
          <div class="field"><label for="dy-n">Note <span class="subtle">(optional)</span></label><textarea id="dy-n" class="input" rows="2" [(ngModel)]="f.note"></textarea></div>
        }
        <vc-api-problems [error]="err()" title="Couldn't save the year" />
      </div>
      <ng-container footer>
        <span class="grow small subtle">{{ problem() }}</span>
        <button class="btn btn-secondary" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !!problem()" (click)="save()">{{ busy() ? 'Saving…' : 'Save' }}</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="!!voiding()" (closed)="voiding.set(null)" [title]="'Void ' + (voiding()?.year ?? '') + '?'" width="460px">
      <div class="stack" style="--gap:12px">
        <p class="muted">The year then counts as missing until it is recorded again.</p>
        <div class="field"><label for="dv-r">Reason</label><textarea id="dv-r" class="input" rows="2" [(ngModel)]="voidReason"></textarea></div>
        <vc-api-problems [error]="err()" />
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="voiding.set(null)">Cancel</button>
        <button class="btn btn-danger" [disabled]="busy() || voidReason.trim().length < 5" (click)="doVoid()">Void year</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:16px;align-items:flex-start;margin-bottom:16px}
    .intro{flex:1;max-width:860px}
    .card-head .checkbox{margin-left:auto}
    .card-head{flex-wrap:wrap}
    .years{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;padding:16px}
    .yr{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface)}
    .yr.nd{border-left:3px solid var(--forest-400)} .yr:not(.nd){border-left:3px solid var(--clay-500)}
    .yr.void{opacity:.6}
    .yr header{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--stone-100)}
    .y{font-size:18px}
    .mode{font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--ok-soft);color:var(--forest-700)}
    .mode.v{background:var(--clay-50);color:var(--clay-700)}
    .b{padding:10px 12px;display:flex;flex-direction:column;gap:8px;flex:1}
    .facts{display:flex;flex-wrap:wrap;gap:4px 12px;color:var(--text-2)} .facts span{display:inline-flex;align-items:center;gap:4px}
    .dec{color:var(--amber-600)}
    .st{color:var(--stone-700);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .yr footer{display:flex;align-items:center;gap:6px;padding:6px 8px 6px 12px;border-top:1px solid var(--stone-100);background:var(--surface-2);border-radius:0 0 var(--radius) var(--radius)}
    .calc{margin-top:16px}
    .cf{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) auto;gap:12px;align-items:end}
    .btns{display:flex;gap:8px}
    .mt{margin-top:14px} vc-callout.mt{display:flex}
    .wl{margin:6px 0 0;padding-left:18px;font-size:13px}
    .tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden}
    .tile{display:flex;flex-direction:column;gap:2px;padding:12px 14px;border-right:1px solid var(--stone-100)} .tile:last-child{border-right:0}
    .tile span{font-size:12px;color:var(--text-2)} .tile strong{font-size:18px;font-weight:600} .tile em{font-style:normal;font-size:11.5px;color:var(--text-3)}
    .tile.hi{background:var(--forest-50)} .tile.hi strong{color:var(--forest-700)}
    .bordered{border:1px solid var(--border);border-radius:var(--radius-sm)}
    tr.prior td{background:var(--sand-50);color:var(--text-2)}
    .cm{display:inline-block;margin-right:10px}
    .u{font-size:11px;color:var(--text-3);font-weight:400}
    .notes{margin:12px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:3px}
    .seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border)}
    .seg button{height:30px;border:0;border-radius:6px;background:none;font:500 12.5px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .blk{display:flex;flex-direction:column;gap:8px;padding:14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface-2)}
    .bh{display:flex;align-items:center;gap:8px} .bh h4{font-size:14px}
    .ch,.cr{display:grid;grid-template-columns:minmax(0,2fr) 70px repeat(2,minmax(0,1fr)) 32px;gap:6px;align-items:center}
    .ch.v,.cr.v{grid-template-columns:minmax(0,2fr) 70px repeat(4,minmax(0,1fr)) 32px}
    .ch span{font-size:11.5px;color:var(--stone-700)}
    .cw{grid-column:1/-1;font-size:11.5px;color:var(--amber-600)}
    .lr{display:grid;grid-template-columns:minmax(0,2fr) repeat(2,minmax(0,1fr)) 32px;gap:6px;align-items:end}
    .lf{display:flex;flex-direction:column;gap:2px} .lf span{font-size:11px;color:var(--stone-700)}
    .input.sm{height:32px;font-size:13px}
    .rm{display:grid;place-items:center;width:30px;height:30px;border:0;border-radius:6px;background:none;color:var(--stone-400);cursor:pointer}
    .rm:hover{color:var(--danger);background:var(--danger-soft)}
    .req{color:var(--danger)} .grow{flex:1}
    @media (max-width: 900px){ .cf{grid-template-columns:1fr 1fr} .tiles{grid-template-columns:1fr 1fr} .tile:nth-child(2){border-right:0} }
    @media (max-width: 640px){ .ch{display:none} .cr,.cr.v{grid-template-columns:1fr 1fr} .bar{flex-direction:column} }
  `],
})
export class DisplacementTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);
  projectId = input.required<string>();
  records = input<Displacement[]>([]);
  changed = output<void>();
  termPublished = output<void>();

  showVoided = signal(false);
  formOpen = signal(false);
  editing = signal<Displacement | null>(null);
  voiding = signal<Displacement | null>(null);
  busy = signal(false);
  err = signal<ApiError | null>(null);
  calcErr = signal<ApiError | null>(null);
  result = signal<DisplacementResult | null>(null);
  published = signal<DraftTerm[] | null>(null);
  cRows = signal<CRow[]>([]);
  lRows = signal<LRow[]>([]);
  voidReason = '';
  f = this.blank();
  c = (() => { const y = new Date().getFullYear() - 1; return { period_label: `${y}`, period_start: `${y}-01-01`, period_end: `${y}-12-31` }; })();

  canWrite = computed(() => this.auth.can('calc.run', 'programmes.manage'));
  canPublish = computed(() => this.auth.can('calc.run', 'rules.edit'));
  active = computed(() => this.records().filter(r => r.status === 'active'));
  shown = computed(() => [...this.records()].filter(r => this.showVoided() || r.status === 'active').sort((a, b) => b.year - a.year));

  private blank() {
    return { year: new Date().getFullYear() - 1 as number | null, mode: 'no_decrease' as 'vmd0054' | 'no_decrease', ef_t_co2e_per_ha: null as number | null, ef_source: '', statement: '', evidence_ids: [] as string[], note: '', reason: '' };
  }
  start(r: Displacement | null) {
    this.editing.set(r);
    this.err.set(null);
    if (r) {
      this.f = { year: r.year, mode: r.mode, ef_t_co2e_per_ha: r.ef_t_co2e_per_ha, ef_source: r.ef_source, statement: r.statement, evidence_ids: [...r.evidence_ids], note: '', reason: '' };
      this.cRows.set(r.commodities.map(x => ({ commodity: x.commodity, unit: x.unit, baseline_production: x.baseline_production, project_production: x.project_production, lm: x.lm ?? null, inl_ha: x.inl_ha ?? null })));
      this.lRows.set(r.livestock.map(x => ({ ...x })));
    } else {
      this.f = this.blank();
      const years = this.active().map(x => x.year);
      if (years.length) this.f.year = Math.max(...years) + 1;
      const last = [...this.active()].sort((a, b) => b.year - a.year)[0];
      this.cRows.set(last ? last.commodities.map(x => ({ commodity: x.commodity, unit: x.unit, baseline_production: x.baseline_production, project_production: null, lm: null, inl_ha: null })) : []);
      this.lRows.set(last ? last.livestock.map(x => ({ livestock_type: x.livestock_type, baseline_head: x.baseline_head, project_head: null })) : []);
    }
    this.formOpen.set(true);
  }
  addC() { this.cRows.update(r => [...r, { commodity: '', unit: 't', baseline_production: null, project_production: null, lm: null, inl_ha: null }]); }
  removeC(i: number) { this.cRows.update(r => r.filter((_, j) => j !== i)); }
  addL() { this.lRows.update(r => [...r, { livestock_type: '', baseline_head: null, project_head: null }]); }
  removeL(i: number) { this.lRows.update(r => r.filter((_, j) => j !== i)); }
  fall(r: CRow): number | null {
    if (r.baseline_production === null || r.project_production === null) return null;
    const d = Number(r.baseline_production) - Number(r.project_production);
    return d > 0 ? Math.round(d * 1000) / 1000 : null;
  }
  herdFell() { return this.lRows().some(r => r.baseline_head !== null && r.project_head !== null && Number(r.project_head) < Number(r.baseline_head)); }
  headText(r: Displacement) {
    if (!r.livestock.length) return 'No livestock';
    const b = r.livestock.reduce((a, x) => a + x.baseline_head, 0), p = r.livestock.reduce((a, x) => a + x.project_head, 0);
    return `${p} head (baseline ${b})`;
  }
  declined(r: Displacement) { return r.livestock.some(x => x.project_head < x.baseline_head); }
  periodFirst(r: DisplacementResult) { return Number(String(r.period_start).slice(0, 4)); }
  cValid() { return this.c.period_label.trim() && this.c.period_start && this.c.period_end && this.c.period_end >= this.c.period_start; }

  problem() {
    const f = this.f;
    if (!f.year || f.year < 1990) return 'Give the calendar year';
    for (const [i, r] of this.cRows().entries()) {
      if (!r.commodity.trim() || !r.unit.trim()) return `Commodity ${i + 1}: give its name and unit`;
      if (r.baseline_production === null || r.project_production === null) return `Commodity ${i + 1}: give baseline and project production`;
      if (f.mode === 'vmd0054' && (r.inl_ha === null || (r.inl_ha as unknown) === '')) return `Commodity ${i + 1}: give INL from the worksheet`;
      if (f.mode === 'no_decrease' && this.fall(r)) return `${r.commodity}: production fell, so use the VMD0054 basis`;
    }
    for (const [i, r] of this.lRows().entries()) {
      if (!r.livestock_type.trim() || r.baseline_head === null || r.project_head === null) return `Livestock ${i + 1}: give the type and both head counts`;
    }
    if (f.mode === 'vmd0054' && f.ef_t_co2e_per_ha === null) return 'Give the VMD0054 emission factor';
    if (f.mode === 'vmd0054' && f.ef_source.trim().length < 5) return 'Say where the emission factor comes from';
    if (f.statement.trim().length < 10) return 'Describe what the evidence shows';
    if (!f.evidence_ids.length) return 'Attach evidence';
    if (this.editing() && f.reason.trim().length < 5) return 'Say why it is being corrected';
    return '';
  }
  save() {
    const f = this.f;
    const v = f.mode === 'vmd0054';
    const commodities: Commodity[] = this.cRows().map(r => ({
      commodity: r.commodity.trim(), unit: r.unit.trim(), baseline_production: Number(r.baseline_production), project_production: Number(r.project_production),
      lm: v && r.lm !== null && (r.lm as unknown) !== '' ? Number(r.lm) : null, inl_ha: v && r.inl_ha !== null ? Number(r.inl_ha) : null,
    }));
    const livestock: Livestock[] = this.lRows().map(r => ({ livestock_type: r.livestock_type.trim(), baseline_head: Number(r.baseline_head), project_head: Number(r.project_head) }));
    const body = { year: Number(f.year), mode: f.mode, commodities, livestock, ef_t_co2e_per_ha: v ? Number(f.ef_t_co2e_per_ha) : null, ef_source: f.ef_source.trim(), statement: f.statement.trim(), evidence_ids: f.evidence_ids, note: f.note };
    const r = this.editing();
    this.busy.set(true);
    this.err.set(null);
    const req = r ? this.api.post<Displacement>(`/leakage/displacement/${r.record_id}/versions`, { ...body, reason: f.reason.trim() }) : this.api.post<Displacement>(`/projects/${this.projectId()}/leakage/displacement`, body);
    req.subscribe({
      next: x => { this.busy.set(false); this.formOpen.set(false); this.toast.success(r ? `${x.year} corrected` : `${x.year} recorded`); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
  doVoid() {
    const r = this.voiding();
    if (!r) return;
    this.busy.set(true);
    this.err.set(null);
    this.api.post<Displacement>(`/leakage/displacement/${r.record_id}/void`, { reason: this.voidReason.trim() }).subscribe({
      next: () => { this.busy.set(false); this.voiding.set(null); this.toast.success(`${r.year} voided`); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
  private cBody() { return { ...this.c, period_label: this.c.period_label.trim() }; }
  preview() {
    this.busy.set(true);
    this.calcErr.set(null);
    this.published.set(null);
    this.api.post<DisplacementResult>(`/projects/${this.projectId()}/leakage/displacement/compute`, this.cBody()).subscribe({
      next: r => { this.busy.set(false); this.result.set(r); },
      error: (e: ApiError) => { this.busy.set(false); this.result.set(null); this.calcErr.set(e); },
    });
  }
  publish() {
    this.busy.set(true);
    this.calcErr.set(null);
    this.api.post<{ term: DraftTerm; result: DisplacementResult }>(`/projects/${this.projectId()}/leakage/displacement/publish-term`, this.cBody()).subscribe({
      next: r => { this.busy.set(false); this.result.set(r.result); this.published.set([r.term]); this.termPublished.emit(); this.toast.success('Draft LK_disp term published'); },
      error: (e: ApiError) => { this.busy.set(false); this.calcErr.set(e); },
    });
  }
}
