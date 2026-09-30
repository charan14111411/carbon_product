import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { Badge, DataClass, Empty, ErrorBox, Loading, PageHeader, Progress, Tabs } from '../../ui/kit';
import { CampaignModal } from './campaign-modal';
import { TraceDrawer } from './trace';
import { Campaign, Stratum } from './types';
import { ZoneModal } from './zone-modal';

@Component({
  selector: 'vc-sampling-page',
  imports: [
    FormsModule, PageHeader, Tabs, Loading, ErrorBox, Empty, Badge, DataClass, Progress, Icon, DayPipe, NumPipe, HumanPipe,
    ZoneModal, CampaignModal, TraceDrawer,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Sampling" eyebrow="Measurement"
      [subtitle]="'Zones, campaigns and soil cores for ' + (ctx.current()?.name ?? 'the current project') + '. Every point is placed reproducibly and every core is traceable to the bag on the lab bench.'">
      <form actions class="trace" (submit)="$event.preventDefault(); runTrace()">
        <vc-icon name="scan" [size]="15" />
        <input class="input" placeholder="Trace a sample or bag code…" [(ngModel)]="traceInput" name="trace" aria-label="Sample or bag code" />
        <button class="btn btn-secondary btn-sm" type="submit" [disabled]="!traceInput.trim()">Trace</button>
      </form>
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card">
        @if (ctx.loaded()) {
          <vc-empty icon="briefcase" title="No project selected" text="Choose a project in the top bar. Sampling is always planned for one project." />
        } @else { <vc-loading [rows]="4" /> }
      </section>
    } @else {
      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @if (tab() === 'campaigns') {
        <div class="bar">
          <p class="muted small">A campaign moves from planned, to fieldwork, to the lab, to complete.</p>
          <div class="spacer"></div>
          @if (auth.can('sampling.plan')) {
            <button class="btn btn-primary" (click)="campOpen.set(true)"><vc-icon name="plus" />Plan campaign</button>
          }
        </div>
        @if (cLoading()) {
          <div class="card"><vc-loading [rows]="5" /></div>
        } @else if (cError()) {
          <vc-error title="Couldn't load campaigns" [message]="cError()!"><button class="btn btn-secondary btn-sm" (click)="loadCampaigns()">Try again</button></vc-error>
        } @else if (!campaigns().length) {
          <section class="card">
            <vc-empty icon="target" title="No campaigns yet" text="Plan the baseline campaign first. Monitoring campaigns re-measure the same zones later.">
              @if (auth.can('sampling.plan')) { <button class="btn btn-primary" (click)="campOpen.set(true)"><vc-icon name="plus" />Plan campaign</button> }
            </vc-empty>
          </section>
        } @else {
          <div class="cards">
            @for (c of campaigns(); track c.id) {
              @let p = c.progress;
              <button class="card camp" (click)="router.navigate(['/app/sampling', c.id])">
                <div class="ch">
                  <div class="ct">
                    <div class="row" style="--gap:8px"><code class="code">{{ c.code }}</code><vc-badge [status]="c.status" /></div>
                    <h3>{{ c.name }}</h3>
                  </div>
                  <vc-icon name="chevron-right" [size]="18" />
                </div>
                <div class="meta">
                  <span><vc-icon name="target" [size]="14" />{{ c.kind | human }} · {{ c.design | human }}</span>
                  <span><vc-icon name="calendar" [size]="14" />{{ c.planned_start | day }} – {{ c.planned_end | day }}</span>
                  <span><vc-icon name="ruler" [size]="14" />{{ c.depth_from_cm | num: 0 }}–{{ c.depth_to_cm | num: 0 }} cm</span>
                </div>
                @if (p && p.points_total) {
                  <div class="prog">
                    <div class="pl"><span>Field collection</span><span class="num">{{ p.points_collected }} of {{ p.points_total }} collected</span></div>
                    <div class="stackbar">
                      <i class="s-col" [style.width.%]="100 * p.points_collected / p.points_total"></i>
                      <i class="s-skip" [style.width.%]="100 * p.points_skipped / p.points_total"></i>
                    </div>
                    <div class="legend">
                      <span><i class="s-col"></i>Collected {{ p.points_collected }}</span>
                      <span><i class="s-skip"></i>Skipped {{ p.points_skipped }}</span>
                      <span><i class="s-plan"></i>Planned {{ p.points_planned }}</span>
                    </div>
                    <div class="pl" style="margin-top:10px"><span>Lab: accepted soil carbon</span><span class="num">{{ p.layers_with_accepted_soc }} of {{ p.layers_total }} bags</span></div>
                    <vc-progress [value]="p.layers_with_accepted_soc" [max]="p.layers_total || 1" />
                  </div>
                } @else {
                  <p class="subtle small noprog">No points placed yet. Approve a sample plan for every zone, then place points.</p>
                }
              </button>
            }
          </div>
        }
      }

      @if (tab() === 'zones') {
        <div class="bar">
          <label class="checkbox"><input type="checkbox" [ngModel]="history()" (ngModelChange)="history.set($event); loadStrata()" />Show earlier versions</label>
          <div class="spacer"></div>
          @if (auth.can('sampling.plan')) {
            <button class="btn btn-primary" (click)="openZone(null)"><vc-icon name="plus" />New zone</button>
          }
        </div>
        <section class="card">
          @if (sLoading()) {
            <vc-loading [rows]="5" />
          } @else if (sError()) {
            <div class="card-body"><vc-error title="Couldn't load zones" [message]="sError()!" /></div>
          } @else if (!strata().length) {
            <vc-empty icon="layers" title="No zones drawn" text="Group the enrolled fields into zones of similar soil and land use. Each zone gets its own sample size.">
              @if (auth.can('sampling.plan')) { <button class="btn btn-primary" (click)="openZone(null)"><vc-icon name="plus" />New zone</button> }
            </vc-empty>
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr>
                  <th>Code</th><th>Name</th><th>Role</th><th class="num">Fields</th><th class="num">Area</th><th>Version</th><th>Effective</th><th></th>
                </tr></thead>
                <tbody>
                  @for (s of strata(); track s.id) {
                    <tr [class.hist]="!s.is_current">
                      <td><code>{{ s.code }}</code></td>
                      <td>
                        <div>{{ s.name }}</div>
                        @if (criteria(s); as c) { <div class="subtle small">{{ c }}</div> }
                      </td>
                      <td>
                        <vc-badge [status]="s.role === 'project' ? 'active' : 'info'">{{ s.role === 'project' ? 'Project' : 'Control' }}</vc-badge>
                        @if (s.control_for_code) { <span class="subtle small"> for {{ s.control_for_code }}</span> }
                      </td>
                      <td class="num" [title]="(s.field_codes ?? []).join(', ')">{{ s.field_ids.length }}</td>
                      <td class="num nowrap">{{ s.area_ha | num: 2 }} ha <vc-dc [cls]="s.area_data_class" /></td>
                      <td>v{{ s.version }} @if (!s.is_current) { <span class="subtle small">closed</span> }</td>
                      <td class="nowrap">{{ s.effective_from | day }} – {{ s.effective_to ? (s.effective_to | day) : 'now' }}</td>
                      <td class="num">
                        @if (s.is_current && auth.can('sampling.plan')) {
                          <button class="btn btn-ghost btn-sm" (click)="openZone(s)"><vc-icon name="branch" [size]="14" />New version</button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }

      <vc-zone-modal [(open)]="zoneOpen" [projectId]="ctx.currentId()!" [strata]="currentStrata()" [base]="zoneBase()" (saved)="loadStrata()" />
      <vc-campaign-modal [(open)]="campOpen" [projectId]="ctx.currentId()!" [campaigns]="campaigns()" (saved)="onCampaign($event)" />
    }
    <vc-trace-drawer [(open)]="traceOpen" [code]="traceCode()" />
  `,
  styles: [`
    .trace{position:relative;display:flex;gap:8px;align-items:center}
    .trace vc-icon{position:absolute;left:11px;top:11px;color:var(--text-3)}
    .trace .input{padding-left:32px;width:260px}
    .bar{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px}
    .camp{display:flex;flex-direction:column;gap:14px;padding:18px 20px;text-align:left;font:inherit;color:inherit;cursor:pointer;transition:border-color .12s,box-shadow .12s}
    .camp:hover{border-color:var(--forest-300);box-shadow:var(--shadow)}
    .ch{display:flex;align-items:flex-start;gap:10px}
    .ct{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
    .ch>vc-icon{color:var(--text-3);margin-top:2px}
    .code{font-size:12px;color:var(--stone-600)}
    .meta{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12.5px;color:var(--text-2)}
    .meta span{display:inline-flex;align-items:center;gap:6px}
    .prog{border-top:1px solid var(--stone-100);padding-top:12px}
    .pl{display:flex;justify-content:space-between;font-size:12.5px;color:var(--text-2);margin-bottom:6px}
    .stackbar{display:flex;height:8px;border-radius:4px;background:var(--sand-200);overflow:hidden}
    .stackbar i{display:block;height:100%}
    .s-col{background:var(--forest-500)} .s-skip{background:var(--clay-300)} .s-plan{background:var(--sand-300)}
    .legend{display:flex;gap:14px;margin-top:6px;font-size:11.5px;color:var(--text-3)}
    .legend span{display:inline-flex;align-items:center;gap:5px}
    .legend i{width:8px;height:8px;border-radius:2px;display:inline-block}
    .noprog{border-top:1px solid var(--stone-100);padding-top:12px}
    tr.hist td{color:var(--text-3);background:var(--surface-2)}
    @media (max-width:760px){.cards{grid-template-columns:1fr}.trace .input{width:100%}}
  `],
})
export class SamplingPage {
  private api = inject(ApiService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  router = inject(Router);

  tab = signal<string>('campaigns');
  campaigns = signal<Campaign[]>([]);
  cLoading = signal(true);
  cError = signal<string | null>(null);
  strata = signal<Stratum[]>([]);
  sLoading = signal(true);
  sError = signal<string | null>(null);
  history = signal(false);

  zoneOpen = signal(false);
  zoneBase = signal<Stratum | null>(null);
  campOpen = signal(false);
  traceOpen = signal(false);
  traceCode = signal('');
  traceInput = '';

  currentStrata = computed(() => this.strata().filter(s => s.is_current));
  tabs = computed(() => [
    { key: 'campaigns', label: 'Campaigns', count: this.cLoading() ? null : this.campaigns().length },
    { key: 'zones', label: 'Zones', count: this.sLoading() ? null : this.currentStrata().length },
  ]);

  constructor() {
    effect(() => {
      if (!this.ctx.currentId()) return;
      untracked(() => { this.loadCampaigns(); this.loadStrata(); });
    });
  }

  loadCampaigns() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.cLoading.set(true);
    this.cError.set(null);
    this.api.get<Campaign[]>(`/projects/${pid}/campaigns`).subscribe({
      next: r => { this.campaigns.set(r); this.cLoading.set(false); },
      error: (e: ApiError) => { this.cError.set(e.message); this.cLoading.set(false); },
    });
  }

  loadStrata() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.sLoading.set(true);
    this.sError.set(null);
    this.api.get<Stratum[]>(`/projects/${pid}/strata`, { all: this.history() }).subscribe({
      next: r => { this.strata.set(r); this.sLoading.set(false); },
      error: (e: ApiError) => { this.sError.set(e.message); this.sLoading.set(false); },
    });
  }

  openZone(s: Stratum | null) {
    this.zoneBase.set(s);
    this.zoneOpen.set(true);
  }

  onCampaign(c: Campaign) {
    this.loadCampaigns();
    this.router.navigate(['/app/sampling', c.id]);
  }

  runTrace() {
    const c = this.traceInput.trim();
    if (!c) return;
    this.traceCode.set(c);
    this.traceOpen.set(true);
  }

  criteria(s: Stratum): string {
    return Object.entries(s.criteria ?? {}).map(([, v]) => String(v)).filter(Boolean).join(' · ');
  }
}
