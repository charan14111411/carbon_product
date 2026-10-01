import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Empty, Modal } from '../../ui/kit';
import { ApiProblems } from '../mrv-shared/ui';
import { BCampaign, Measurement, Plot, StratumLite } from './biomass.types';

/** Permanent plots (project and baseline) and the measurement campaigns that revisit them. */
@Component({
  selector: 'vc-biomass-plots',
  imports: [FormsModule, Icon, Badge, Empty, Modal, ApiProblems, DayPipe, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cols">
      <section class="card">
        <div class="card-head"><h3>Permanent plots</h3><span class="subtle small">{{ plots().length }}</span>
          @if (canWrite()) { <button class="btn btn-primary btn-sm" (click)="startPlot()"><vc-icon name="plus" [size]="14" />Add plot</button> }
        </div>
        @if (!plots().length) {
          <vc-empty icon="land-plot" title="No plots yet" text="Plots are fixed areas where every tree is measured at each campaign. Stock change comes from plots measured in both campaigns." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Plot</th><th>Scenario</th><th>Zone</th><th class="num">Area</th><th class="num">Measured</th><th>Location</th></tr></thead>
              <tbody>
                @for (p of plots(); track p.id) {
                  <tr>
                    <td class="nowrap"><code>{{ p.code }}</code>@if (p.status !== 'active') { <vc-badge [status]="p.status" /> }</td>
                    <td><span class="scn" [class.b]="p.scenario === 'baseline'">{{ p.scenario }}</span></td>
                    <td>{{ stratumCode(p.stratum_id) }}</td>
                    <td class="num nowrap">{{ p.area_m2 | num: 0 }} <span class="u">m²</span></td>
                    <td class="num">{{ measuredIn(p.id) }}</td>
                    <td class="small mono subtle">{{ p.latitude !== null ? (p.latitude | num: 5) + ', ' + (p.longitude | num: 5) : '—' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <section class="card">
        <div class="card-head"><h3>Campaigns</h3><span class="subtle small">{{ campaigns().length }}</span>
          @if (canWrite()) { <button class="btn btn-primary btn-sm" (click)="startCampaign()"><vc-icon name="plus" [size]="14" />Add campaign</button> }
        </div>
        @if (!campaigns().length) {
          <vc-empty icon="calendar" title="No campaigns yet" text="A campaign is one round of measurement, on a date. Re-measure at least every 5 years (§9.2)." />
        } @else {
          <ol class="tl">
            @for (c of sortedCampaigns(); track c.id; let i = $index) {
              <li>
                <span class="pt"></span>
                <div class="c">
                  <div class="h"><code>{{ c.code }}</code><strong>{{ c.measured_on | day }}</strong><span class="spacer"></span><span class="subtle small">{{ plotsIn(c.id) }} plot{{ plotsIn(c.id) === 1 ? '' : 's' }}</span></div>
                  @if (c.note) { <p class="small muted">{{ c.note }}</p> }
                  @if (i > 0) { <p class="small subtle">{{ gapYears(sortedCampaigns()[i - 1], c) | num: 2 }} years after {{ sortedCampaigns()[i - 1].code }}</p> }
                </div>
              </li>
            }
          </ol>
        }
      </section>
    </div>

    <vc-modal [(open)]="plotOpen" title="Add a permanent plot" width="560px">
      <div class="stack" style="--gap:14px">
        <div class="form-grid">
          <div class="field"><label for="pl-c">Plot code</label><input id="pl-c" class="input" [(ngModel)]="pf.code" maxlength="40" placeholder="e.g. TP-07" /></div>
          <div class="field"><label>Scenario</label>
            <div class="seg"><button type="button" [class.on]="pf.scenario === 'project'" (click)="pf.scenario = 'project'">Project</button><button type="button" [class.on]="pf.scenario === 'baseline'" (click)="pf.scenario = 'baseline'">Baseline</button></div></div>
          <div class="field"><label for="pl-z">Zone</label>
            <select id="pl-z" class="input" [(ngModel)]="pf.stratum_id">
              <option value="">Choose a zone…</option>
              @for (s of currentStrata(); track s.id) { <option [value]="s.id">{{ s.code }} · {{ s.name }} ({{ s.role }})</option> }
            </select></div>
          <div class="field"><label for="pl-f">Field <span class="subtle">(optional)</span></label>
            <select id="pl-f" class="input" [(ngModel)]="pf.field_id" [disabled]="!pf.stratum_id">
              <option value="">Not tied to one field</option>
              @for (f of zoneFields(); track f.id) { <option [value]="f.id">{{ f.code }}</option> }
            </select></div>
          <div class="field"><label for="pl-a">Area (m²)</label><input id="pl-a" class="input num" type="number" min="1" step="any" [(ngModel)]="pf.area_m2" /></div>
          <div class="field"><label>Centre <span class="subtle">(optional)</span></label>
            <div class="ll"><input class="input num" type="number" step="any" placeholder="Latitude" [(ngModel)]="pf.latitude" aria-label="Latitude" /><input class="input num" type="number" step="any" placeholder="Longitude" [(ngModel)]="pf.longitude" aria-label="Longitude" /></div></div>
        </div>
        <vc-api-problems [error]="err()" title="Couldn't add the plot" />
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="plotOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !pf.code.trim() || !pf.stratum_id || !(pf.area_m2 > 0)" (click)="savePlot()">Add plot</button>
      </ng-container>
    </vc-modal>

    <vc-modal [(open)]="campOpen" title="Add a measurement campaign" width="480px">
      <div class="stack" style="--gap:14px">
        <div class="field"><label for="bc-c">Code</label><input id="bc-c" class="input" [(ngModel)]="cf.code" maxlength="40" placeholder="e.g. WB-2026" /></div>
        <div class="field"><label for="bc-d">Measured on</label><input id="bc-d" type="date" class="input" [(ngModel)]="cf.measured_on" />
          <span class="hint">The date the interval x between campaigns is counted from.</span></div>
        <div class="field"><label for="bc-n">Note <span class="subtle">(optional)</span></label><textarea id="bc-n" class="input" rows="2" [(ngModel)]="cf.note"></textarea></div>
        <vc-api-problems [error]="err()" title="Couldn't add the campaign" />
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="campOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !cf.code.trim() || !cf.measured_on" (click)="saveCampaign()">Add campaign</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .cols{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:16px;align-items:start}
    .scn{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--forest-100);color:var(--forest-700);text-transform:capitalize}
    .scn.b{background:var(--sand-200);color:var(--stone-700)}
    .u{font-size:11.5px;color:var(--text-3)}
    .tl{list-style:none;margin:0;padding:16px 20px}
    .tl li{position:relative;display:flex;gap:12px;padding-bottom:16px}
    .tl li:not(:last-child)::before{content:'';position:absolute;left:5px;top:16px;bottom:0;width:2px;background:var(--sand-200)}
    .pt{flex:none;width:12px;height:12px;margin-top:5px;border-radius:50%;border:2px solid var(--forest-500);background:var(--surface)}
    .c{flex:1;min-width:0} .h{display:flex;align-items:center;gap:8px}
    .seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border)}
    .seg button{height:30px;border:0;border-radius:6px;background:none;font:500 13px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .ll{display:grid;grid-template-columns:1fr 1fr;gap:6px}
    @media (max-width: 1000px){ .cols{grid-template-columns:minmax(0,1fr)} }
  `],
})
export class BiomassPlots {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  projectId = input.required<string>();
  plots = input<Plot[]>([]);
  campaigns = input<BCampaign[]>([]);
  strata = input<StratumLite[]>([]);
  measurements = input<Measurement[]>([]);
  changed = output<void>();

  plotOpen = signal(false);
  campOpen = signal(false);
  busy = signal(false);
  err = signal<ApiError | null>(null);
  pf = this.blankPlot();
  cf = { code: '', measured_on: '', note: '' };

  canWrite = computed(() => this.auth.can('calc.run', 'programmes.manage'));
  currentStrata = computed(() => this.strata().filter(s => s.is_current !== false));
  sortedCampaigns = computed(() => [...this.campaigns()].sort((a, b) => a.measured_on.localeCompare(b.measured_on)));

  private blankPlot() { return { code: '', scenario: 'project' as 'project' | 'baseline', stratum_id: '', field_id: '', area_m2: 500, latitude: null as number | null, longitude: null as number | null }; }
  stratumCode(id: string) { return this.strata().find(s => s.id === id)?.code ?? '—'; }
  zoneFields() {
    const s = this.strata().find(x => x.id === this.pf.stratum_id);
    if (!s) return [];
    return s.field_ids.map((id, i) => ({ id, code: s.field_codes?.[i] ?? id.slice(0, 8) }));
  }
  measuredIn(plotId: string) { return this.measurements().filter(m => m.plot_id === plotId).length; }
  plotsIn(campaignId: string) { return this.measurements().filter(m => m.campaign_id === campaignId).length; }
  gapYears(a: BCampaign, b: BCampaign) { return (new Date(b.measured_on).getTime() - new Date(a.measured_on).getTime()) / (365.25 * 86_400_000); }

  startPlot() { this.pf = this.blankPlot(); this.err.set(null); this.plotOpen.set(true); }
  startCampaign() { this.cf = { code: '', measured_on: '', note: '' }; this.err.set(null); this.campOpen.set(true); }

  savePlot() {
    const p = this.pf;
    this.busy.set(true);
    this.err.set(null);
    const num = (v: unknown) => (v === null || v === '' || v === undefined ? null : Number(v));
    this.api.post<Plot>(`/projects/${this.projectId()}/biomass/plots`, {
      code: p.code.trim(), scenario: p.scenario, stratum_id: p.stratum_id, field_id: p.field_id || null, area_m2: Number(p.area_m2),
      latitude: num(p.latitude), longitude: num(p.longitude),
    }).subscribe({
      next: r => { this.busy.set(false); this.plotOpen.set(false); this.toast.success(`Plot ${r.code} added`); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
  saveCampaign() {
    this.busy.set(true);
    this.err.set(null);
    this.api.post<BCampaign>(`/projects/${this.projectId()}/biomass/campaigns`, { code: this.cf.code.trim(), measured_on: this.cf.measured_on, note: this.cf.note }).subscribe({
      next: r => { this.busy.set(false); this.campOpen.set(false); this.toast.success(`Campaign ${r.code} added`); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
}
