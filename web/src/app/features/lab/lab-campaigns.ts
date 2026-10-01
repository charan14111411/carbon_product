import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { HumanPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { Badge, DataClass, Empty, ErrorBox, Loading } from '../../ui/kit';
import { LabProgress, SpectroscopyCheck, analyteLabel } from './types';
import { VmRef } from './vm-ref';

interface CampaignLite { id: string; code: string; name: string; status: string; kind?: string; planned_start?: string | null }

const STATUS: Record<SpectroscopyCheck['status'], { badge: string; label: string; text: string }> = {
  ok: { badge: 'ok', label: 'Enough checked', text: 'Enough spectroscopy bags have been re-run by dry combustion.' },
  too_few: { badge: 'blocking', label: 'Too few checked', text: 'Re-run more spectroscopy bags by dry combustion — this blocks the calculation.' },
  not_applicable: { badge: 'skipped', label: 'Not applicable', text: 'No SOC in this campaign was measured by spectroscopy, so no dry-combustion check is needed.' },
  rule_not_configured: { badge: 'warning', label: 'Rule not set', text: 'The project rule pack has no minimum check share configured. Ask the programme scientist to set it.' },
};

/** Per-campaign lab progress and the dry-combustion check of spectroscopy results (VM0042 Eq. 73). */
@Component({
  selector: 'vc-lab-campaigns',
  imports: [FormsModule, Icon, Badge, DataClass, Empty, ErrorBox, Loading, HumanPipe, NumPipe, VmRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (campaigns().length) {
    <div class="bar">
      <div class="field inl">
        <label for="cp-c">Campaign</label>
        <select id="cp-c" class="input" [ngModel]="campId()" (ngModelChange)="pick($event)" [disabled]="!campaigns().length">
          @if (!campaigns().length) { <option value="">No campaigns</option> }
          @for (c of campaigns(); track c.id) { <option [value]="c.id">{{ c.code }} · {{ c.name }}</option> }
        </select>
      </div>
      <div class="spacer"></div>
      @if (campId()) { <button class="btn btn-secondary" (click)="loadCampaign(campId())"><vc-icon name="refresh" />Refresh</button> }
    </div>
    }

    @if (!project.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Campaign progress is shown per project. Pick one from the project menu at the top." /></section>
    } @else if (campLoading()) {
      <section class="card"><vc-loading [rows]="4" /></section>
    } @else if (campError()) {
      <section class="card"><div class="card-body"><vc-error title="Couldn't load campaigns" [message]="campError()!"><button class="btn btn-secondary btn-sm" (click)="loadCampaigns()">Try again</button></vc-error></div></section>
    } @else if (!campaigns().length) {
      <section class="card"><vc-empty icon="calendar" title="No sampling campaigns yet" text="Lab progress appears here once a campaign has collected bags." /></section>
    } @else {
      <div class="cols">
        <!-- lab progress -->
        <section class="card">
          <div class="card-head"><h3>Lab progress</h3><span class="subtle small">{{ progress()?.layers_total ?? 0 }} bags</span></div>
          @if (progLoading()) { <vc-loading [rows]="5" /> }
          @else if (progError()) { <div class="card-body"><vc-error title="Couldn't load lab progress" [message]="progError()!" /></div> }
          @else if (!progress()?.layers_total) { <vc-empty icon="package" title="No bags yet" text="No soil bags have been recorded for this campaign." /> }
          @else {
            <div class="card-body prog">
              @for (a of analyteRows(); track a.key) {
                <div class="pr">
                  <div class="pl"><span>{{ a.label }}</span><span class="num subtle small">{{ a.accepted }} / {{ a.total }} accepted</span></div>
                  <div class="stackbar" [attr.aria-label]="a.label + ': ' + a.accepted + ' accepted, ' + a.pending + ' pending, ' + a.missing + ' missing'">
                    <span class="s-acc" [style.width.%]="pct(a.accepted, a.total)"></span>
                    <span class="s-pen" [style.width.%]="pct(a.pending, a.total)"></span>
                  </div>
                </div>
              }
              <div class="legend small"><span><i class="s-acc"></i>Accepted</span><span><i class="s-pen"></i>Awaiting review</span><span><i class="s-mis"></i>No result</span></div>
            </div>
          }
        </section>

        <!-- spectroscopy check -->
        <section class="card">
          <div class="card-head">
            <h3>Spectroscopy check</h3><vc-dc cls="CALCULATED" />
            <span class="spacer"></span>
            @if (check()) { <vc-vm-ref [ref]="check()!.reference" /> }
          </div>
          @if (checkLoading()) { <vc-loading [rows]="5" /> }
          @else if (checkError()) { <div class="card-body"><vc-error title="Couldn't load the spectroscopy check" [message]="checkError()!" /></div> }
          @else if (check(); as c) {
            <div class="card-body stack" style="--gap:18px">
              <p class="muted small intro">When SOC is measured by spectroscopy, VM0042 asks for a share of the bags (10–15 %) to be re-run by dry combustion.
                The differences give the model error of Eq. 73, which is added to the uncertainty of the result.</p>

              @if (c.status === 'not_applicable') {
                <div class="na"><vc-icon name="info" [size]="16" /><div><strong>No spectroscopy results in {{ c.campaign_code }}.</strong>
                  <p class="muted small">{{ st(c).text }} If the lab later reports SOC by MIR, NIR, Vis-NIR, LIBS or INS, re-run 10–15 % of those bags by dry combustion and enter them with the purpose “Spectroscopy check”.</p></div></div>
              } @else {
              <div class="share">
                <div class="big">
                  <strong class="num">{{ c.checked_pct === null ? '—' : (c.checked_pct | num: 1) }}</strong><span>%</span>
                  <vc-badge [status]="st(c).badge">{{ st(c).label }}</vc-badge>
                </div>
                <div class="subtle small">{{ c.n_dry_combustion_checked }} of {{ c.n_spectroscopy_samples }} spectroscopy bag{{ c.n_spectroscopy_samples === 1 ? '' : 's' }} re-run by dry combustion</div>
                <div class="band" role="img" [attr.aria-label]="'Checked ' + (c.checked_pct ?? 0) + ' %, recommended ' + c.recommended_range_pct[0] + '–' + c.recommended_range_pct[1] + ' %'">
                  <div class="track">
                    <span class="rec" [style.left.%]="scale(c.recommended_range_pct[0], c)" [style.width.%]="scale(c.recommended_range_pct[1], c) - scale(c.recommended_range_pct[0], c)"></span>
                    <span class="fill" [class]="'fill f-' + c.status" [style.width.%]="scale(c.checked_pct ?? 0, c)"></span>
                    @if (c.required_min_pct !== null) { <span class="min" [style.left.%]="scale(c.required_min_pct, c)" [title]="'Project minimum ' + c.required_min_pct + ' %'"></span> }
                  </div>
                  <div class="ticks small subtle">
                    <span [style.left.%]="0">0 %</span>
                    <span class="t-rec" [style.left.%]="(scale(c.recommended_range_pct[0], c) + scale(c.recommended_range_pct[1], c)) / 2">{{ c.recommended_range_pct[0] }}–{{ c.recommended_range_pct[1] }} % target</span>
                    <span [style.left.%]="100" class="t-end">{{ axisMax(c) }} %</span>
                  </div>
                </div>
                <p class="small st-t" [class]="'small st-t t-' + c.status">{{ st(c).text }}
                  @if (c.required_min_pct !== null) { Project minimum: {{ c.required_min_pct | num: 1 }} %@if (c.required_max_pct !== null) {, maximum {{ c.required_max_pct | num: 1 }} %}. }
                </p>
              </div>

              <div>
                <div class="row" style="--gap:8px;margin-bottom:8px"><strong>Model error (Eq. 73)</strong><vc-dc cls="CALCULATED" /></div>
                @if (c.model_error.s2_model === null) {
                  <p class="muted small">{{ c.model_error.reason || 'Not enough paired samples yet.' }}
                    @if (c.model_error.tvd === 1) { One pair so far (error {{ c.model_error.mean_error | num: 3 }} % SOC). }</p>
                } @else {
                  <div class="me">
                    <div><span class="k">s²<sub>model</sub></span><strong class="num">{{ c.model_error.s2_model | num: 4 }}</strong><span class="u">(% SOC)²</span></div>
                    <div><span class="k">Mean error</span><strong class="num">{{ signed(c.model_error.mean_error) }}</strong><span class="u">% SOC</span></div>
                    <div><span class="k">RMSE</span><strong class="num">{{ c.model_error.rmse | num: 3 }}</strong><span class="u">% SOC</span></div>
                    <div><span class="k">Pairs (t<sub>vd</sub>)</span><strong class="num">{{ c.model_error.tvd }}</strong><span class="u">bags</span></div>
                  </div>
                  <p class="subtle small eq">s² = 1/(t<sub>vd</sub> − 1) × Σ (error − mean error)², error = spectroscopy − dry combustion. Shown before the A² area factor, which the calculation applies.</p>
                }
              </div>

              }
              @if (c.pairs.length) {
                <details class="pairs">
                  <summary>Paired bags ({{ c.pairs.length }})</summary>
                  <div class="table-wrap">
                    <table class="table">
                      <thead><tr><th>Bag</th><th>Method</th><th class="num">Spectroscopy</th><th class="num">Dry combustion</th><th class="num">Error</th></tr></thead>
                      <tbody>
                        @for (p of c.pairs; track p.layer_id) {
                          <tr><td><code>{{ p.bag_code }}</code></td><td class="muted">{{ p.method | human }}</td>
                            <td class="num">{{ p.predicted | num: 3 }} % <vc-dc cls="MODELLED" /></td>
                            <td class="num">{{ p.dry_combustion | num: 3 }} % <vc-dc cls="MEASURED" /></td>
                            <td class="num">{{ signed(p.error) }} %</td></tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </details>
              }
            </div>
          }
        </section>
      </div>
    }
  `,
  styles: [`
    .bar{display:flex;align-items:flex-end;gap:12px;margin-bottom:14px}
    .inl{min-width:320px;margin:0}
    .cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:16px;align-items:start}
    @media (max-width:1100px){.cols{grid-template-columns:1fr}}
    .card-head{gap:8px;flex-wrap:wrap} .card-head h3{white-space:nowrap}
    .prog{display:flex;flex-direction:column;gap:14px}
    .pl{display:flex;justify-content:space-between;gap:8px;margin-bottom:5px;font-size:13px}
    .stackbar{display:flex;height:8px;border-radius:4px;background:var(--sand-200);overflow:hidden}
    .s-acc{background:var(--forest-500)} .s-pen{background:var(--amber-600)} .s-mis{background:var(--sand-200)}
    .legend{display:flex;gap:14px;color:var(--text-2)} .legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:-1px}
    .intro{margin:0;line-height:1.5}
    .big{display:flex;align-items:baseline;gap:6px}
    .big strong{font-size:34px;font-weight:600;letter-spacing:-.02em;line-height:1;color:var(--stone-900)}
    .big > span{font-size:16px;color:var(--text-2);margin-right:8px}
    .band{margin-top:14px}
    .track{position:relative;height:12px;border-radius:6px;background:var(--sand-200)}
    .rec{position:absolute;top:-3px;bottom:-3px;border-radius:3px;background:var(--forest-100);border:1px dashed var(--forest-400)}
    .fill{position:absolute;left:0;top:2px;bottom:2px;border-radius:4px;background:var(--forest-500);transition:width .4s ease}
    .fill.f-too_few{background:var(--red-600)} .fill.f-rule_not_configured{background:var(--amber-600)}
    .min{position:absolute;top:-6px;bottom:-6px;width:2px;background:var(--stone-700);border-radius:1px}
    .ticks{position:relative;height:18px;margin-top:6px}
    .ticks span{position:absolute;transform:translateX(0);white-space:nowrap}
    .ticks .t-rec{transform:translateX(-50%);color:var(--forest-700);font-weight:500}
    .ticks .t-end{transform:translateX(-100%)}
    .st-t{margin:8px 0 0;color:var(--text-2)} .t-too_few{color:var(--red-600)} .t-ok{color:var(--forest-700)}
    .me{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
    @media (max-width:700px){.me{grid-template-columns:1fr 1fr}}
    .me > div{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-2)}
    .me .k{font-size:11.5px;font-weight:600;color:var(--text-3)} .me strong{font-size:18px;color:var(--stone-900)} .me .u{font-size:11.5px;color:var(--text-3)}
    .eq{margin:8px 0 0}
    .na{display:flex;gap:10px;padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-2);color:var(--stone-600)}
    .na p{margin:4px 0 0;line-height:1.5}
    .pairs summary{cursor:pointer;font-weight:500;color:var(--forest-700);margin-bottom:8px}
  `],
})
export class LabCampaigns {
  private api = inject(ApiService);
  project = inject(ProjectContext);

  campaigns = signal<CampaignLite[]>([]);
  campLoading = signal(true);
  campError = signal<string | null>(null);
  campId = signal('');
  progress = signal<LabProgress | null>(null);
  progLoading = signal(false);
  progError = signal<string | null>(null);
  check = signal<SpectroscopyCheck | null>(null);
  checkLoading = signal(false);
  checkError = signal<string | null>(null);

  analyteRows = computed(() => {
    const p = this.progress();
    if (!p) return [];
    return Object.entries(p.analytes)
      .map(([key, v]) => ({ key, label: analyteLabel(key), ...v, total: p.layers_total }))
      .filter(a => a.accepted + a.pending > 0 || ['soc_pct', 'bulk_density_g_cm3', 'coarse_fraction'].includes(a.key));
  });

  constructor() {
    effect(() => {
      const pid = this.project.currentId();
      if (pid) this.loadCampaigns(pid);
    });
  }

  loadCampaigns(pid = this.project.currentId()) {
    if (!pid) return;
    this.campLoading.set(true);
    this.campError.set(null);
    this.api.get<CampaignLite[]>(`/projects/${pid}/campaigns`).subscribe({
      next: c => {
        this.campaigns.set(c);
        this.campLoading.set(false);
        const keep = c.find(x => x.id === this.campId());
        const first = keep ?? [...c].reverse().find(x => x.status !== 'planned' && x.status !== 'design') ?? c[c.length - 1];
        if (first) this.pick(first.id); else { this.campId.set(''); this.progress.set(null); this.check.set(null); }
      },
      error: (e: ApiError) => { this.campError.set(e.message); this.campLoading.set(false); },
    });
  }

  pick(id: string) {
    this.campId.set(id);
    if (id) this.loadCampaign(id);
  }

  loadCampaign(id: string) {
    this.progLoading.set(true);
    this.progError.set(null);
    this.checkLoading.set(true);
    this.checkError.set(null);
    this.api.get<LabProgress>(`/campaigns/${id}/lab-progress`).subscribe({
      next: p => { this.progress.set(p); this.progLoading.set(false); },
      error: (e: ApiError) => { this.progError.set(e.message); this.progLoading.set(false); },
    });
    this.api.get<SpectroscopyCheck>(`/campaigns/${id}/spectroscopy-check`).subscribe({
      next: c => { this.check.set(c); this.checkLoading.set(false); },
      error: (e: ApiError) => { this.checkError.set(e.message); this.checkLoading.set(false); },
    });
  }

  st(c: SpectroscopyCheck) { return STATUS[c.status] ?? STATUS.not_applicable; }
  pct(n: number, total: number) { return total ? (100 * n) / total : 0; }
  axisMax(c: SpectroscopyCheck) {
    const top = Math.max(30, (c.checked_pct ?? 0) * 1.15, (c.required_max_pct ?? 0) * 1.15);
    return Math.min(100, Math.ceil(top / 10) * 10);
  }
  scale(v: number, c: SpectroscopyCheck) { return Math.max(0, Math.min(100, (100 * v) / this.axisMax(c))); }
  signed(v: number | null) { return v === null ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(3)}`; }
}
