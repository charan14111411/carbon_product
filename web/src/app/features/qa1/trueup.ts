import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { EvidenceList } from '../additionality/evidence';
import { sci } from '../mrv-shared/stats';
import { ApiProblems, Ref } from '../mrv-shared/ui';
import { CampaignLite, Qa1Model, RunImport, TrueUp, TrueUpState, practiceLabel } from './qa1.types';

/** True-up (§8.6.1.3): re-measured project SOC compared with the model, approved by a second person. */
@Component({
  selector: 'vc-qa1-trueup',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Modal, EvidenceList, ApiProblems, Ref, DayPipe, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <section class="card clock">
        <div class="card-head"><h3>Re-measurement clock</h3><vc-ref>VM0042 §8.2.1 p.27 · §8.6.1.3</vc-ref></div>
        @if (state(); as s) {
          @if (s.error) {
            <div class="card-body"><vc-callout tone="warn" icon="circle-alert">{{ s.error }}</vc-callout></div>
          } @else {
            <div class="clk">
              <div class="ring" [class.over]="s.overdue">
                <strong class="num">{{ daysLeft(s) }}</strong><span>{{ daysLeft(s) < 0 ? 'days overdue' : 'days left' }}</span>
              </div>
              <dl class="kv">
                <dt>Last direct SOC measurement</dt><dd>{{ s.last_measured_on | day }}</dd>
                <dt>Re-measure at least every</dt><dd>{{ s.max_years }} years <span class="subtle small">(rule {{ s.rule_key ?? 'remeasure_max_years' }})</span></dd>
                <dt>True-up due by</dt><dd><strong [class.bad]="s.overdue">{{ s.due_by | day }}</strong></dd>
                <dt>Latest approved true-up</dt><dd>{{ s.latest_trueup_id ? (trueupDate(s.latest_trueup_id) | day) : 'None yet' }}</dd>
              </dl>
            </div>
            @if (s.problems.length) {
              <div class="card-body pt0">
                <vc-callout [tone]="s.overdue ? 'danger' : 'warn'" icon="calendar-clock">
                  <ul class="wl">@for (p of s.problems; track p.code) { <li>{{ p.message }}</li> }</ul>
                </vc-callout>
              </div>
            }
          }
        } @else {
          <vc-empty icon="calendar-clock" title="No clock yet" text="The clock starts from the initial SOC measurement of an imported SOC run, or the project start." />
        }
      </section>

      <section class="card how">
        <div class="card-head"><h3>What a true-up does</h3></div>
        <ol class="steps">
          <li><span>1</span><div><strong>Re-measure SOC</strong><p>A monitoring campaign samples the modelled points again (equivalent soil mass).</p></div></li>
          <li><span>2</span><div><strong>Compare with the model</strong><p>The model's stock at each sampling date is compared with the measured stock; the error statistics re-estimate prediction error.</p></div></li>
          <li><span>3</span><div><strong>Update the model</strong><p>The re-measured data go into a new validation report (VMD0053) and an approved model revision that lists this true-up.</p></div></li>
          <li><span>4</span><div><strong>Re-run from t0</strong><p>Baseline and project simulations are imported again; future vintages use the new uncertainty. Issued VCUs are unchanged.</p></div></li>
        </ol>
      </section>
    </div>

    <section class="card">
      <div class="card-head"><h3>True-ups</h3><span class="subtle small">{{ trueups().length }} recorded</span>
        @if (canRun()) { <button class="btn btn-primary btn-sm" [disabled]="!socImports().length" (click)="start()"><vc-icon name="plus" [size]="14" />Record true-up</button> }
      </div>
      @if (!trueups().length) {
        <vc-empty icon="compare" title="No true-ups yet" text="Record one when a monitoring campaign has re-measured the modelled points and its lab results are accepted." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Measured</th><th>Campaign</th><th class="num">Points</th><th class="num">Mean error</th><th class="num">s² error</th><th class="num">RMSE</th><th>Status</th><th></th></tr></thead>
            <tbody>
              @for (t of sorted(); track t.id) {
                <tr class="clickable" (click)="detail.set(t)">
                  <td class="nowrap"><strong>{{ t.measured_on | day }}</strong></td>
                  <td>{{ campaignName(t.campaign_id) }}</td>
                  <td class="num">{{ t.stats.n }}</td>
                  <td class="num">{{ t.stats.mean_error | num: 3 }}</td>
                  <td class="num">{{ sci(t.stats.s2_error) }}</td>
                  <td class="num">{{ t.stats.rmse | num: 3 }}</td>
                  <td><vc-badge [status]="t.status" /></td>
                  <td class="go"><vc-icon name="chevron-right" [size]="15" /></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot foot small subtle">Errors are modelled − measured, in t CO₂e/ha (SOC × 44/12).</div>
      }
    </section>

    <!-- record -->
    <vc-modal [(open)]="formOpen" title="Record a true-up" subtitle="Compares re-measured SOC with the model at each sampling date." width="580px">
      <div class="stack" style="--gap:14px">
        <div class="field"><label for="tu-i">SOC model run import</label>
          <select id="tu-i" class="input" [(ngModel)]="f.import_id">
            <option value="">Choose an import…</option>
            @for (i of socImports(); track i.id) { <option [value]="i.id">{{ i.label }} · {{ i.first_year }}–{{ i.last_year }}</option> }
          </select></div>
        <div class="field"><label for="tu-c">Re-measurement (monitoring campaign)</label>
          <select id="tu-c" class="input" [(ngModel)]="f.campaign_id">
            <option value="">Choose a campaign…</option>
            @for (c of monitoring(); track c.id) { <option [value]="c.id">{{ c.code }} · {{ c.name }} ({{ c.status }})</option> }
          </select>
          <span class="hint">Needs accepted lab results at the modelled points — at least two per zone.</span></div>
        <div class="field"><label>Evidence <span class="subtle">(optional)</span></label>
          <vc-evidence [(ids)]="f.evidence_ids" entityType="qa1_trueup" /></div>
        <div class="field"><label for="tu-n">Notes <span class="subtle">(optional)</span></label><textarea id="tu-n" class="input" rows="2" [(ngModel)]="f.notes"></textarea></div>
        <vc-api-problems [error]="err()" title="Couldn't record the true-up" />
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !f.import_id || !f.campaign_id" (click)="create()"><vc-icon name="compare" />{{ busy() ? 'Comparing…' : 'Compare and save' }}</button>
      </ng-container>
    </vc-modal>

    <!-- detail -->
    <vc-modal [open]="!!detail()" (closed)="detail.set(null); actErr.set(null)" [drawer]="true" width="760px" [title]="detail() ? 'True-up · measured ' + (detail()!.measured_on | day) : ''" subtitle="Re-measured vs modelled SOC (equivalent soil mass)">
      @if (detail(); as t) {
        <div class="stack" style="--gap:16px">
          <div class="stats">
            <div><span>Points</span><strong class="num">{{ t.stats.n }}</strong></div>
            <div><span>Mean error</span><strong class="num">{{ t.stats.mean_error | num: 3 }}</strong><em>t CO₂e/ha</em></div>
            <div><span>s² error</span><strong class="num">{{ sci(t.stats.s2_error) }}</strong><em>(t CO₂e/ha)²</em></div>
            <div><span>RMSE</span><strong class="num">{{ t.stats.rmse | num: 3 }}</strong><em>t CO₂e/ha</em></div>
          </div>
          @if (t.stats.validated_soc_metrics.length) {
            <div class="cmp">
              <div class="lbl">Compared with the validated SOC prediction error</div>
              @for (m of t.stats.validated_soc_metrics; track $index) {
                <div class="cr"><span>{{ practice(m.practice_category) }}</span><span class="subtle small">validation n {{ m.n_sites }} · bias {{ m.bias | num: 3 }}</span>
                  <span class="num">s²<sub>Δ</sub> {{ m.s2_model_delta !== null ? sci(m.s2_model_delta) : sci(m.s2_model) + ' (s²)' }}</span></div>
              }
            </div>
          }
          <div class="table-wrap bordered">
            <table class="table">
              <thead><tr><th>Point</th><th>Zone</th><th>Sample</th><th>Collected</th><th class="num">Measured <span class="u">t C/ha</span></th><th class="num">Modelled <span class="u">t C/ha</span></th><th class="num">Error <span class="u">t CO₂e/ha</span></th></tr></thead>
              <tbody>
                @for (p of t.points; track p.sample_code) {
                  <tr>
                    <td><code>{{ p.site_code }}</code></td><td>{{ p.stratum }}</td><td class="small mono">{{ p.sample_code }}</td><td class="nowrap small">{{ p.collected_at | day }}</td>
                    <td class="num">{{ p.measured_soc_t_c_ha | num: 2 }} <vc-dc cls="MEASURED" /></td>
                    <td class="num">{{ p.modelled_soc_t_c_ha | num: 2 }} <vc-dc cls="MODELLED" /></td>
                    <td class="num"><strong [class.bad]="p.error_t_co2e_ha > 0">{{ p.error_t_co2e_ha | num: 3 }}</strong></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="next">
            <div class="lbl">Next steps</div>
            <ol>@for (s of t.stats.next_steps; track $index) { <li>{{ s }}</li> }</ol>
          </div>
          <dl class="kv">
            <dt>Import</dt><dd>{{ importName(t.import_id) }}</dd>
            <dt>Campaign</dt><dd>{{ campaignName(t.campaign_id) }}</dd>
            <dt>Evidence</dt><dd><vc-evidence [ids]="t.evidence_ids" [readonly]="true" /></dd>
            <dt>Recorded by</dt><dd>{{ people.name(t.created_by, 'Unknown') }} · {{ t.created_at | day }}</dd>
            @if (t.approved_by) { <dt>Approved by</dt><dd>{{ people.name(t.approved_by, 'Unknown') }} · {{ t.approved_at | day }}</dd> }
            @if (t.notes) { <dt>Notes</dt><dd>{{ t.notes }}</dd> }
          </dl>
          @if (t.status === 'draft' && canApprove()) {
            @if (t.created_by === me()) {
              <vc-callout tone="warn" icon="users">You created this, so another person must approve it.</vc-callout>
            } @else {
              <vc-callout tone="info" icon="users">Four-eyes rule: you can approve because someone else recorded it. After approval, the model must be revised to list this true-up and the runs re-imported before more QA1 terms can be published.</vc-callout>
            }
          }
          <vc-api-problems [error]="actErr()" />
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="detail.set(null)">Close</button>
        @if (detail()?.status === 'draft' && canApprove() && detail()?.created_by !== me()) {
          <button class="btn btn-primary" [disabled]="busy()" (click)="approve()"><vc-icon name="check" />Approve true-up</button>
        }
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .top{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px;margin-bottom:16px}
    .clk{display:flex;gap:24px;align-items:center;padding:20px}
    .ring{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;width:124px;height:124px;border-radius:50%;
      border:8px solid var(--forest-200);background:var(--forest-50);text-align:center}
    .ring strong{font-size:28px;font-weight:600;color:var(--forest-700);line-height:1}
    .ring span{font-size:11.5px;color:var(--text-2);margin-top:4px;max-width:80px}
    .ring.over{border-color:#f3c7c3;background:var(--danger-soft)} .ring.over strong{color:var(--red-600)}
    .clk .kv{flex:1}
    .bad{color:var(--red-600)}
    .pt0{padding-top:0}
    .wl{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px}
    .steps{list-style:none;margin:0;padding:12px 20px 16px;display:flex;flex-direction:column;gap:12px}
    .steps li{display:flex;gap:12px}
    .steps li > span{flex:none;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--sand-200);font-size:12px;font-weight:600;color:var(--stone-700)}
    .steps p{font-size:12.5px;color:var(--text-2);margin-top:1px}
    .go{color:var(--text-3);width:28px}
    .foot{justify-content:flex-start}
    .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .stats > div{display:flex;flex-direction:column;padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-2)}
    .stats span{font-size:12px;color:var(--text-2)} .stats strong{font-size:20px;font-weight:600} .stats em{font-style:normal;font-size:11px;color:var(--text-3)}
    .lbl{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px}
    .cmp{padding:12px 14px;border-radius:var(--radius-sm);background:var(--dc-modelled-bg);border:1px solid #f1dcae}
    .cr{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;padding:3px 0}
    .cr .num{margin-left:auto}
    .bordered{border:1px solid var(--border);border-radius:var(--radius-sm)}
    .u{font-size:11px;color:var(--text-3);font-weight:400}
    .next ol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px;font-size:13px;color:var(--stone-800)}
    @media (max-width: 1000px){ .top{grid-template-columns:minmax(0,1fr)} }
    @media (max-width: 600px){ .clk{flex-direction:column;align-items:flex-start} .stats{grid-template-columns:1fr 1fr} }
  `],
})
export class Qa1TrueUpPanel {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);
  projectId = input.required<string>();
  state = input<TrueUpState | null>(null);
  trueups = input<TrueUp[]>([]);
  imports = input<RunImport[]>([]);
  models = input<Qa1Model[]>([]);
  campaigns = input<CampaignLite[]>([]);
  changed = output<void>();

  sci = sci;
  practice = practiceLabel;
  formOpen = signal(false);
  detail = signal<TrueUp | null>(null);
  busy = signal(false);
  err = signal<ApiError | null>(null);
  actErr = signal<ApiError | null>(null);
  f = { import_id: '', campaign_id: '', evidence_ids: [] as string[], notes: '' };

  me = computed(() => this.auth.profile()?.id ?? null);
  canRun = computed(() => this.auth.can('calc.run'));
  canApprove = computed(() => this.auth.can('models.approve'));
  socImports = computed(() => this.imports().filter(i => i.pools.includes('soc')));
  monitoring = computed(() => this.campaigns().filter(c => c.kind === 'monitoring'));
  sorted = computed(() => [...this.trueups()].sort((a, b) => b.measured_on.localeCompare(a.measured_on)));

  constructor() {
    this.people.load();
    // keep an open detail in step with reloaded data
    effect(() => { const list = this.trueups(); untracked(() => { const d = this.detail(); if (d) this.detail.set(list.find(t => t.id === d.id) ?? d); }); });
  }

  daysLeft(s: TrueUpState) {
    const due = new Date(s.due_by + 'T00:00:00').getTime();
    return Math.round((due - Date.now()) / 86_400_000);
  }
  trueupDate(id: string) { return this.trueups().find(t => t.id === id)?.measured_on ?? null; }
  campaignName(id: string) { const c = this.campaigns().find(x => x.id === id); return c ? `${c.code} · ${c.name}` : '—'; }
  importName(id: string) { return this.imports().find(i => i.id === id)?.label ?? '—'; }

  start() {
    this.f = { import_id: this.socImports().length === 1 ? this.socImports()[0].id : '', campaign_id: '', evidence_ids: [], notes: '' };
    this.err.set(null);
    this.formOpen.set(true);
  }
  create() {
    this.busy.set(true);
    this.err.set(null);
    this.api.post<TrueUp>(`/projects/${this.projectId()}/qa1/trueups`, this.f).subscribe({
      next: t => { this.busy.set(false); this.formOpen.set(false); this.toast.success('True-up recorded', 'A colleague with model-approval rights approves it.'); this.changed.emit(); this.detail.set(t); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
  approve() {
    const t = this.detail();
    if (!t) return;
    this.busy.set(true);
    this.actErr.set(null);
    this.api.post<TrueUp>(`/qa1/trueups/${t.id}/approve`).subscribe({
      next: r => { this.busy.set(false); this.detail.set(r); this.toast.success('True-up approved', 'Revise the model to list it, then re-import the runs.'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.actErr.set(e); },
    });
  }
}
