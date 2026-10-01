import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { PALETTE } from '../../ui/chart';
import { KIT } from '../../ui/kit';
import { MapView } from '../../ui/map-view';
import { EvidenceList } from '../additionality/evidence';
import { Assessment, ControlLink, ControlRules, CritRow, CritStatus, Criterion, LinkAssessment, Stratum, UserLite, critRows } from './types';

type FC = GeoJSON.FeatureCollection;
interface Cell { status: CritStatus | 'none'; a: string; b: string; note: string; message: string }

const PROJECT_COLOR = PALETTE[0];
const CONTROL_COLOR = PALETTE[1];
const LINE_COLOR = PALETTE[2];

@Component({
  selector: 'vc-control-sites-page',
  imports: [...KIT, FormsModule, DayPipe, NumPipe, MapView, EvidenceList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Control sites" eyebrow="Baseline · QA2"
      subtitle="Baseline control sites keep business-as-usual management so the project's soil carbon change can be measured against them. Each one must match the land it stands in for on every Table 7 criterion.">
      @if (ctx.currentId() && canWrite()) {
        <ng-container actions>
        <button class="btn btn-secondary" [disabled]="assessing() || !links().length" (click)="assess()">
          <vc-icon [name]="assessing() ? 'hourglass' : 'play'" />{{ assessing() ? 'Assessing…' : 'Run similarity assessment' }}
        </button>
        <button class="btn btn-primary" (click)="openLink()"><vc-icon name="link" />Link control site</button>
        </ng-container>
      }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Control sites are set up per project. Pick one in the top bar." /></div>
    } @else if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load control sites" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else {
      <!-- KPIs -->
      <div class="grid grid-4 kpis">
        <vc-stat label="Control sites linked" [value]="controlCount()" [unit]="'of ' + minSites() + ' needed'" icon="map-pinned"
          [hint]="controlCount() >= minSites() ? 'Enough sites across the project' : (minSites() - controlCount()) + ' more needed (§8.2)'" />
        <vc-stat label="Meeting Table 7" [value]="assessment() ? passingSites() : '—'" [unit]="assessment() ? 'sites' : ''" icon="circle-check"
          [hint]="assessment() ? 'All similarity criteria pass' : 'Run the similarity assessment'" />
        <vc-stat label="Project strata covered" [value]="covered()" [unit]="'of ' + projectStrata().length" icon="layers"
          hint="At least one suitable control site each" />
        <vc-stat label="Last assessment" [value]="assessment() ? (assessment()!.assessed_at | day) : 'Never'" icon="history"
          [hint]="assessment() ? 'by ' + who(assessment()!.assessed_by) : 'Results are kept as a permanent record'" />
      </div>

      @if (!controlStrata().length) {
        <vc-callout tone="info" icon="info" class="mb">
          This project has no control strata yet. Create a stratum with the role <strong>control</strong> under Sampling, add its fields, then link it here.
        </vc-callout>
      }

      <div class="top">
        <!-- project-level checks -->
        <section class="card checks">
          <div class="card-head"><h3>Project checks</h3>
            @if (assessment()) { <vc-badge [status]="statusBadge(assessment()!.overall)">{{ statusLabel(assessment()!.overall) }}</vc-badge> }
          </div>
          <ul class="cl">
            @for (c of projectChecks(); track c.code) {
              <li>
                <span class="ci" [class]="'c-' + c.status"><vc-icon [name]="statusIcon(c.status)" [size]="18" /></span>
                <div class="ct">
                  <strong>{{ c.label }}</strong>
                  <span class="muted small">{{ c.message }}</span>
                  <span class="chip">{{ c.ref }}</span>
                  @if (c.strata?.length) {
                    <div class="strata">
                      @for (s of c.strata!; track s.stratum) {
                        <span class="sp" [class]="'sp-' + s.status" [title]="s.links + ' link(s)'">
                          <vc-icon [name]="statusIcon(s.status)" [size]="12" />{{ s.stratum }}@if (s.quantification_unit !== s.stratum) { <small>· {{ s.quantification_unit }}</small> }
                        </span>
                      }
                    </div>
                  }
                </div>
              </li>
            }
          </ul>
          <div class="card-foot rules">
            <span class="subtle small">Each site: within {{ rules()?.max_distance_km ?? 250 }} km · one site may serve several quantification units if it meets the criteria for each.</span>
          </div>
        </section>

        <!-- map -->
        <section class="card mapcard">
          <div class="card-head"><h3>Map</h3>
            <div class="legend">
              <span><i class="sw" [style.background]="projectColor"></i>Project fields</span>
              <span><i class="sw" [style.background]="controlColor"></i>Control fields</span>
              <span><i class="ln" [style.background]="lineColor"></i>Link</span>
            </div>
          </div>
          @if (geoErr()) {
            <div class="card-body"><vc-error title="Couldn't load field boundaries" [message]="geoErr()!" /></div>
          } @else if (!mapPolys().features.length) {
            <vc-empty icon="map" title="No fields to show" text="Field boundaries appear here once the project and control strata have fields." />
          } @else {
            <vc-map [polygons]="mapPolys()" [points]="mapPoints()" height="auto" />
          }
        </section>
      </div>

      <!-- links table -->
      <section class="card mb">
        <div class="card-head"><h3>Links</h3><span class="subtle small">{{ links().length }} {{ links().length === 1 ? 'link' : 'links' }}</span></div>
        @if (!links().length) {
          <vc-empty icon="link" title="No control sites linked"
            text="Link a control stratum to the project stratum or quantification unit it stands in for. Its location is fixed when you link it.">
            @if (canWrite()) { <button class="btn btn-primary btn-sm" (click)="openLink()"><vc-icon name="link" />Link control site</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Control site</th><th></th><th>Stands in for</th><th class="num">Distance</th><th>Managed by</th><th>Management plan</th><th>Table 7</th><th>Linked</th></tr></thead>
              <tbody>
                @for (l of links(); track l.id) {
                  @let s = stratum(l.control_stratum_id);
                  @let la = linkResult(l.id);
                  <tr class="clickable" (click)="openDetail(l)">
                    <td><div class="cell2"><strong>{{ s?.code ?? 'Replaced stratum' }}@if (l.status === 'retired') { <vc-badge status="retired" class="rt" /> }</strong><span class="subtle small">{{ s?.name }} · {{ s?.field_ids?.length ?? 0 }} fields · {{ s?.area_ha ?? 0 | num: 1 }} ha</span></div></td>
                    <td class="arrow"><vc-icon name="arrow-left-right" [size]="15" /></td>
                    <td><div class="cell2"><strong>{{ targetLabel(l) }}</strong><span class="subtle small">{{ l.project_stratum_id ? 'Project stratum' : 'Quantification unit' }}</span></div></td>
                    <td class="num nowrap">@if (distance(l); as d) { {{ d.km | num: 1 }} km@if (d.est) { <span class="subtle small" title="Estimated from field boundaries. Run the assessment for the recorded value."> est.</span> } } @else { — }</td>
                    <td class="mg">{{ l.managed_by }}</td>
                    <td>
                      @if (l.management_plan_evidence_id) { <vc-evidence [ids]="[l.management_plan_evidence_id]" [readonly]="true" (click)="$event.stopPropagation()" /> }
                      @else { <vc-badge status="pending">Missing</vc-badge> }
                    </td>
                    <td>@if (la) { <vc-badge [status]="statusBadge(la.overall)">{{ statusLabel(la.overall) }}</vc-badge> } @else { <span class="subtle small">Not assessed</span> }</td>
                    <td class="nowrap muted">{{ l.created_at | day }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <!-- similarity matrix -->
      <section class="card">
        <div class="card-head">
          <h3>Similarity matrix</h3><span class="chip">VM0042 §8.2 Table 7</span><vc-dc cls="DERIVED" />
          <span class="spacer"></span>
          @if (assessment()) { <span class="subtle small">Assessed {{ assessment()!.assessed_at | day: true }}</span> }
        </div>
        @if (!links().length) {
          <vc-empty icon="grid" title="Nothing to compare yet" text="Link at least one control site, then run the similarity assessment." />
        } @else if (!assessment()) {
          <vc-empty icon="grid" title="Not assessed yet" text="The assessment compares every control site with the land it stands in for, criterion by criterion. Missing data is shown as pending — never assumed to pass.">
            @if (canWrite()) { <button class="btn btn-primary btn-sm" [disabled]="assessing()" (click)="assess()"><vc-icon name="play" />Run similarity assessment</button> }
          </vc-empty>
        } @else {
          @if (staleLinks().length) {
            <div class="card-body pb0"><vc-callout tone="warn" icon="circle-alert">{{ staleLinks().length }} link(s) were added after the last assessment. Run it again to include them.</vc-callout></div>
          }
          <div class="mx-wrap">
            <table class="mx">
              <thead>
                <tr>
                  <th class="rh">Criterion</th>
                  @for (la of assessment()!.links; track la.link_id) {
                    <th class="colh"><button type="button" (click)="openDetailById(la.link_id)">
                      <span class="ch-t">{{ la.control_stratum ?? '—' }} <vc-icon name="arrow-left-right" [size]="12" /> {{ targetsLabel(la) }}</span>
                      <vc-badge [status]="statusBadge(la.overall)">{{ statusLabel(la.overall) }}</vc-badge>
                    </button></th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of rows(); track row.code; let i = $index) {
                  @if (i === 0 || rows()[i - 1].group !== row.group) {
                    <tr class="grp"><td [attr.colspan]="assessment()!.links.length + 1">{{ row.group === 'table7' ? 'Table 7 similarity criteria' : 'Site conditions (§8.2)' }}</td></tr>
                  }
                  <tr>
                    <th class="rh" scope="row"><div class="rl"><strong>{{ row.label }}</strong><span class="chip" [title]="row.hint">{{ row.ref }}</span></div><span class="rhint">{{ row.hint }}</span></th>
                    @for (la of assessment()!.links; track la.link_id) {
                      @let c = cell(la, row.code);
                      <td class="mc" [class]="'m-' + c.status" [title]="c.message">
                        <div class="mc-s"><vc-icon [name]="statusIcon(c.status)" [size]="15" /><span>{{ cellLabel(c.status) }}</span></div>
                        @if (c.a || c.b) {
                          <div class="mc-v"><span><em>C</em>{{ c.a || '—' }}</span><span><em>P</em>{{ c.b || '—' }}</span></div>
                        }
                        @if (c.note) { <div class="mc-n">{{ c.note }}</div> }
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="card-foot mxf">
            <span class="subtle small"><em class="k">C</em> control site · <em class="k">P</em> project stratum or quantification unit (most frequent value, area-weighted). Hover a cell for the full explanation.</span>
          </div>
        }
      </section>
    }

    <!-- ============ link drawer ============ -->
    <vc-modal [(open)]="linkOpen" [drawer]="true" width="520px" title="Link control site" [subtitle]="ctx.current()?.name ?? ''">
      <div class="stack" style="--gap:16px">
        @if (!controlStrata().length) {
          <vc-callout tone="warn" icon="circle-alert">There are no control strata in this project. Create one (role "control") under Sampling first.</vc-callout>
        }
        <div class="field">
          <label for="ls-c">Control stratum</label>
          <select id="ls-c" class="input" [(ngModel)]="lf.control_stratum_id">
            <option value="">Choose a control stratum…</option>
            @for (s of controlStrata(); track s.id) { <option [value]="s.id">{{ s.code }} — {{ s.name }} ({{ s.field_ids.length }} fields, {{ s.area_ha | num: 1 }} ha)</option> }
          </select>
          <span class="hint">Fields in this stratum are kept under baseline management for the life of the project.</span>
        </div>
        <div class="field">
          <label>Stands in for</label>
          <div class="seg">
            <button type="button" [class.on]="lf.target === 'stratum'" (click)="lf.target = 'stratum'">A project stratum</button>
            <button type="button" [class.on]="lf.target === 'qu'" (click)="lf.target = 'qu'">A whole quantification unit</button>
          </div>
        </div>
        @if (lf.target === 'stratum') {
          <div class="field">
            <label for="ls-p">Project stratum</label>
            <select id="ls-p" class="input" [(ngModel)]="lf.project_stratum_id">
              <option value="">Choose a project stratum…</option>
              @for (s of projectStrata(); track s.id) { <option [value]="s.id">{{ s.code }} — {{ s.name }} · QU {{ s.quantification_unit }}</option> }
            </select>
          </div>
        } @else {
          <div class="field">
            <label for="ls-q">Quantification unit</label>
            <select id="ls-q" class="input" [(ngModel)]="lf.qu_code">
              <option value="">Choose a quantification unit…</option>
              @for (q of qus(); track q.code) { <option [value]="q.code">{{ q.code }} ({{ q.strata }} {{ q.strata === 1 ? 'stratum' : 'strata' }})</option> }
            </select>
            <span class="hint">One control site may serve several quantification units if it meets the criteria for each — link it once per unit.</span>
          </div>
        }
        <div class="field">
          <label for="ls-m">Managed by</label>
          <input id="ls-m" class="input" [(ngModel)]="lf.managed_by" placeholder="e.g. Hunsur FPO field team" />
          <span class="hint">Who keeps the control site under the baseline schedule of activities.</span>
        </div>
        <div class="field">
          <label>Management plan</label>
          <vc-evidence [(ids)]="lf.plan" [single]="true" entityType="ControlSiteLink" addLabel="Attach management plan" />
          <span class="hint">Location, boundaries and how the baseline schedule is kept (§8.2). You can link without it, but the site stays pending until a plan is attached.</span>
        </div>
        <div class="field">
          <label for="ls-cg">Crop functional group justification <span class="subtle">(optional)</span></label>
          <textarea id="ls-cg" class="input" rows="2" [(ngModel)]="lf.crop_group_justification" placeholder="Only when the crop type can't be matched: why the same functional group is acceptable"></textarea>
          <span class="hint">VM0042 Table 7 note e: the crop functional group is compared instead of the crop type only where the link records why.</span>
        </div>
        <div class="field">
          <label for="ls-n">Notes <span class="subtle">(optional)</span></label>
          <textarea id="ls-n" class="input" rows="3" [(ngModel)]="lf.notes"></textarea>
        </div>
        <vc-callout tone="info" icon="map-pinned">The site's location is fixed now, at the area-weighted centre of its fields. If its fields later move by more than 50 m, the assessment flags it. Who manages it, the plan, notes and justification can be edited later; the location and what it stands in for can't.</vc-callout>
        @if (linkErr()) { <vc-error title="Couldn't link the control site" [message]="linkErr()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="linkOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving() || !linkValid()" (click)="confirmOpen.set(true)"><vc-icon name="link" />Link control site</button>
      </ng-container>
    </vc-modal>

    <vc-modal [(open)]="confirmOpen" title="Fix this control site's location?" width="460px">
      <p class="muted">{{ stratum(lf.control_stratum_id)?.code }} will be linked to {{ lf.target === 'stratum' ? stratum(lf.project_stratum_id)?.code : 'quantification unit ' + lf.qu_code }}. Its location is recorded now and must stay the same for the life of the project.</p>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="confirmOpen.set(false)">Back</button>
        <button class="btn btn-primary" [disabled]="saving()" (click)="createLink()">{{ saving() ? 'Linking…' : 'Link and fix location' }}</button>
      </ng-container>
    </vc-modal>

    <!-- ============ detail drawer ============ -->
    <vc-modal [(open)]="detailOpen" [drawer]="true" width="560px" [title]="detailTitle()" subtitle="Table 7 similarity, criterion by criterion">
      @if (detail(); as l) {
        @let la = linkResult(l.id);
        <div class="stack" style="--gap:16px">
          <dl class="kv">
            <dt>Control stratum</dt><dd>{{ stratum(l.control_stratum_id)?.code ?? 'Replaced' }} — {{ stratum(l.control_stratum_id)?.name }}</dd>
            <dt>Stands in for</dt><dd>{{ targetLabel(l) }}</dd>
            <dt>Fixed location</dt><dd class="mono small">{{ l.fixed_lat | num: 5 }}, {{ l.fixed_lon | num: 5 }}</dd>
            <dt>Managed by</dt><dd>{{ l.managed_by }}</dd>
            <dt>Management plan</dt><dd><vc-evidence [ids]="l.management_plan_evidence_id ? [l.management_plan_evidence_id] : []" [readonly]="true" /></dd>
            <dt>Linked by</dt><dd>{{ who(l.created_by) }} · {{ l.created_at | day }}</dd>
            <dt>Status</dt><dd><vc-badge [status]="l.status" /></dd>
            @if (l.crop_group_justification) { <dt>Crop group justification</dt><dd>{{ l.crop_group_justification }} <span class="chip">Table 7 note e</span></dd> }
            @if (l.notes) { <dt>Notes</dt><dd>{{ l.notes }}</dd> }
            @if (la?.control_fields?.length) { <dt>Control fields</dt><dd class="small">{{ la!.control_fields!.join(', ') }}</dd> }
            @if (la?.quantification_unit_fields?.length) { <dt>Project fields</dt><dd class="small">{{ la!.quantification_unit_fields!.join(', ') }}</dd> }
          </dl>
          @if (la) {
            <ul class="dl">
              @for (c of la.criteria; track c.code) {
                <li [class]="'d-' + c.status">
                  <vc-icon [name]="statusIcon(c.status)" [size]="16" />
                  <div><strong>{{ critLabel(c.code) }}</strong><p>{{ c.message }}</p>
                    @if (missingText(c); as m) { <p class="small subtle">Missing: {{ m }}</p> }
                    @if (diffText(c); as d) { <p class="small subtle">{{ d }}</p> }
                    @if (detailExtra(c); as x) { <p class="small subtle">{{ x }}</p> }
                    @if (groupMatches(c).length) {
                      <div class="gm">@for (g of groupMatches(c); track g.year) { <span class="gmi"><strong>{{ g.year }}</strong> {{ g.control }} ↔ {{ g.quantification_unit }} · {{ g.group }}</span> }</div>
                    }
                  </div>
                  <span class="chip">{{ critRef(c.code) }}</span>
                </li>
              }
            </ul>
          } @else {
            <vc-empty icon="grid" title="Not assessed yet" text="Run the similarity assessment to check this link." />
          }
        </div>
      }
      @if (canWrite()) {
        <ng-container footer>
          <button class="btn btn-secondary" (click)="detailOpen.set(false)">Close</button>
          <button class="btn btn-primary" (click)="openEdit()"><vc-icon name="pencil" />Edit link</button>
        </ng-container>
      }
    </vc-modal>

    <!-- ============ edit drawer ============ -->
    <vc-modal [(open)]="editOpen" [drawer]="true" width="520px" title="Edit control-site link" [subtitle]="detailTitle()">
      <div class="stack" style="--gap:16px">
        <vc-callout tone="info" icon="lock">The fixed location, the control stratum and what it stands in for never change (§8.2). Retire the link and create a new one instead.</vc-callout>
        <div class="field">
          <label for="le-m">Managed by</label>
          <input id="le-m" class="input" [(ngModel)]="ef.managed_by" />
        </div>
        <div class="field">
          <label>Management plan</label>
          <vc-evidence [(ids)]="ef.plan" [single]="true" entityType="ControlSiteLink" addLabel="Attach management plan" />
        </div>
        <div class="field">
          <label for="le-cg">Crop functional group justification</label>
          <textarea id="le-cg" class="input" rows="3" [(ngModel)]="ef.crop_group_justification" placeholder="Why the same crop functional group is acceptable where the crop type differs"></textarea>
          <span class="hint">VM0042 Table 7 note e. Run the assessment again afterwards.</span>
        </div>
        <div class="field">
          <label for="le-n">Notes</label>
          <textarea id="le-n" class="input" rows="3" [(ngModel)]="ef.notes"></textarea>
        </div>
        <div class="field">
          <label>Status</label>
          <div class="seg">
            <button type="button" [class.on]="ef.status === 'active'" (click)="ef.status = 'active'">Active</button>
            <button type="button" [class.on]="ef.status === 'retired'" (click)="ef.status = 'retired'">Retired</button>
          </div>
          @if (ef.status === 'retired') { <span class="hint">A retired link no longer counts towards the minimum number of control sites.</span> }
        </div>
        @if (editErr()) { <vc-error title="Couldn't save the link" [message]="editErr()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving() || ef.managed_by.trim().length < 2" (click)="saveEdit()">{{ saving() ? 'Saving…' : 'Save changes' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .chip{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);
      font:500 11px/1 var(--mono);color:var(--stone-600);white-space:nowrap;width:max-content}
    .kpis{margin-bottom:16px}
    .mb{margin-bottom:16px;display:block}
    vc-callout.mb{display:flex}
    .top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:16px;margin-bottom:16px;align-items:stretch}
    .checks{display:flex;flex-direction:column}
    .cl{list-style:none;margin:0;padding:6px 8px;flex:1}
    .cl li{display:flex;gap:12px;padding:12px 10px}
    .cl li + li{border-top:1px solid var(--stone-100)}
    .ci{flex:none;margin-top:1px}
    .ct{display:flex;flex-direction:column;gap:5px;min-width:0}
    .c-pass{color:var(--forest-600)} .c-fail{color:var(--red-600)} .c-pending,.c-none{color:var(--amber-600)} .c-not_applicable{color:var(--stone-400)}
    .strata{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
    .sp{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 8px;border-radius:6px;font-size:12px;font-weight:500;border:1px solid var(--border);background:var(--surface-2)}
    .sp small{font-weight:400;color:var(--text-3)}
    .sp-pass{color:var(--forest-700);background:var(--ok-soft);border-color:#cfe2d4}
    .sp-fail{color:var(--red-600);background:var(--danger-soft);border-color:#f3c7c3}
    .sp-pending{color:var(--amber-600);background:var(--warn-soft);border-color:#f1dcae}
    .rules{justify-content:flex-start}
    .mapcard{overflow:hidden;display:flex;flex-direction:column}
    .mapcard vc-map{border:0;border-radius:0;flex:1;min-height:360px}
    .legend{display:flex;gap:14px;font-size:12px;color:var(--text-2);flex-wrap:wrap}
    .legend span{display:inline-flex;align-items:center;gap:6px}
    .sw{width:12px;height:12px;border-radius:3px;opacity:.8}
    .ln{width:16px;height:2px;border-radius:1px}
    .cell2{display:flex;flex-direction:column;gap:2px;min-width:170px}
    td.mg{min-width:150px}
    .arrow{color:var(--text-3);width:24px;padding-left:0!important;padding-right:0!important}
    .pb0{padding-bottom:0}
    .mx-wrap{overflow-x:auto}
    .mx{border-collapse:separate;border-spacing:0;width:100%;font-size:12.5px}
    .mx th,.mx td{border-bottom:1px solid var(--stone-100);vertical-align:top;text-align:left}
    .mx thead th{background:var(--surface-2);border-bottom:1px solid var(--border);font-weight:500}
    .rh{position:sticky;left:0;z-index:1;background:var(--surface);min-width:230px;max-width:260px;padding:10px 14px;border-right:1px solid var(--border)}
    thead .rh{background:var(--surface-2);font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);vertical-align:bottom}
    .rl{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .rl strong{font-size:13px;font-weight:600;color:var(--stone-900)}
    .rhint{display:block;margin-top:3px;font-weight:400;font-size:11.5px;line-height:1.4;color:var(--text-3)}
    .colh{min-width:170px;padding:0!important}
    .colh button{display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:100%;padding:10px 12px;border:0;background:none;font:inherit;text-align:left;cursor:pointer}
    .colh button:hover{background:var(--forest-50)}
    .ch-t{display:inline-flex;align-items:center;gap:5px;font-weight:600;font-size:12.5px;color:var(--stone-900);white-space:nowrap}
    .grp td{padding:8px 14px;background:var(--sand-50);font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--text-3);position:sticky;left:0}
    .mc{padding:9px 12px;min-width:170px}
    .mc-s{display:flex;align-items:center;gap:6px;font-weight:600;font-size:12px}
    .m-pass .mc-s{color:var(--forest-700)} .m-fail .mc-s{color:var(--red-600)} .m-pending .mc-s,.m-none .mc-s{color:var(--amber-600)} .m-not_applicable .mc-s{color:var(--stone-500)}
    .m-fail{background:color-mix(in srgb, var(--danger-soft) 55%, transparent)}
    .mc-v{display:flex;flex-direction:column;gap:1px;margin-top:5px;font-variant-numeric:tabular-nums;color:var(--stone-700)}
    .mc-v em,.k{display:inline-grid;place-items:center;width:14px;height:14px;margin-right:5px;border-radius:3px;background:var(--sand-200);font:600 9.5px var(--mono);font-style:normal;color:var(--stone-600);vertical-align:1px}
    .mc-n{margin-top:3px;font-size:11.5px;color:var(--text-3)}
    .mxf{justify-content:flex-start}
    .seg{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border)}
    .seg button{height:32px;border:0;border-radius:6px;background:none;font:inherit;font-size:13px;font-weight:500;color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .dl{list-style:none;margin:0;padding:0;border:1px solid var(--border);border-radius:var(--radius)}
    .dl li{display:flex;gap:10px;align-items:flex-start;padding:11px 14px}
    .dl li + li{border-top:1px solid var(--stone-100)}
    .dl li > div{flex:1;min-width:0} .dl strong{font-size:13px} .dl p{margin:2px 0 0;font-size:12.5px;color:var(--text-2)}
    .dl vc-icon{margin-top:1px;flex:none}
    .d-pass vc-icon{color:var(--forest-600)} .d-fail vc-icon{color:var(--red-600)} .d-pending vc-icon{color:var(--amber-600)} .d-not_applicable vc-icon{color:var(--stone-400)}
    .rt{margin-left:6px;vertical-align:1px}
    .gm{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px}
    .gmi{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--sky-100);color:var(--sky-600)}
    @media (max-width: 1100px){ .top{grid-template-columns:1fr} }
    @media (max-width: 900px){ .kpis{grid-template-columns:repeat(2,minmax(0,1fr))} .rh{min-width:180px} .rhint{display:none} }
  `],
})
export class ControlSitesPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  ctx = inject(ProjectContext);

  projectColor = PROJECT_COLOR;
  controlColor = CONTROL_COLOR;
  lineColor = LINE_COLOR;

  loading = signal(true);
  error = signal<string | null>(null);
  links = signal<ControlLink[]>([]);
  strata = signal<Stratum[]>([]);
  assessment = signal<Assessment | null>(null);
  rules = signal<ControlRules | null>(null);
  users = signal<Map<string, UserLite>>(new Map());
  geo = signal<FC>({ type: 'FeatureCollection', features: [] });
  geoErr = signal<string | null>(null);
  assessing = signal(false);

  linkOpen = signal(false);
  confirmOpen = signal(false);
  saving = signal(false);
  linkErr = signal<string | null>(null);
  lf = this.blank();

  detailOpen = signal(false);
  detail = signal<ControlLink | null>(null);
  editOpen = signal(false);
  editErr = signal<string | null>(null);
  ef = { managed_by: '', plan: [] as string[], crop_group_justification: '', notes: '', status: 'active' as 'active' | 'retired' };

  canWrite = computed(() => this.auth.can('programmes.manage', 'land.manage'));
  rows = computed(() => critRows(this.rules()));
  minSites = computed(() => this.rules()?.min_control_sites ?? 3);
  strataById = computed(() => new Map(this.strata().map(s => [s.id, s])));
  controlStrata = computed(() => this.strata().filter(s => s.role === 'control'));
  projectStrata = computed(() => this.strata().filter(s => (s.role ?? 'project') === 'project'));
  qus = computed(() => {
    const m = new Map<string, number>();
    for (const s of this.projectStrata()) m.set(s.quantification_unit, (m.get(s.quantification_unit) ?? 0) + 1);
    return [...m.entries()].sort().map(([code, strata]) => ({ code, strata }));
  });
  activeLinks = computed(() => this.links().filter(l => l.status === 'active'));
  controlCount = computed(() => new Set(this.activeLinks().map(l => l.control_stratum_id)).size);
  linkResults = computed(() => new Map((this.assessment()?.links ?? []).map(l => [l.link_id, l])));
  passingSites = computed(() => {
    const ok = new Set<string>();
    for (const l of this.activeLinks()) if (this.linkResults().get(l.id)?.overall === 'pass') ok.add(l.control_stratum_id);
    return ok.size;
  });
  staleLinks = computed(() => this.activeLinks().filter(l => !this.linkResults().has(l.id)));
  covered = computed(() => {
    const per = this.assessment()?.project_checks.find(c => c.code === 'control_site_per_stratum');
    const list = (per?.details['strata'] as { status: string }[] | undefined);
    if (list) return list.filter(s => s.status === 'pass').length;
    const ps = this.projectStrata();
    return ps.filter(s => this.activeLinks().some(l => l.project_stratum_id === s.id || l.qu_code === s.quantification_unit)).length;
  });

  projectChecks = computed(() => {
    const checks = this.assessment()?.project_checks ?? [];
    const min = checks.find(c => c.code === 'min_control_sites');
    const per = checks.find(c => c.code === 'control_site_per_stratum');
    const n = this.controlCount();
    return [
      {
        code: 'min', label: `At least ${this.minSites()} control sites`, ref: 'VM0042 §8.2 p.25',
        status: (min?.status ?? (n >= this.minSites() ? 'pending' : 'fail')) as CritStatus,
        message: min?.message ?? `${n} control site(s) linked. The assessment confirms how many meet Table 7.`,
        strata: null as { stratum: string; quantification_unit: string; status: CritStatus; links: number }[] | null,
      },
      {
        code: 'per', label: 'At least one per stratum', ref: 'VM0042 §8.2 p.25',
        status: (per?.status ?? 'pending') as CritStatus,
        message: per?.message ?? 'Every project stratum needs a suitable control site, or a control site stratified like its quantification unit.',
        strata: (per?.details['strata'] as { stratum: string; quantification_unit: string; status: CritStatus; links: number }[] | undefined)
          ?? this.projectStrata().map(s => ({ stratum: s.code, quantification_unit: s.quantification_unit, status: 'pending' as CritStatus, links: 0 })),
      },
      {
        code: 'loc', label: 'Locations fixed', ref: 'VM0042 §8.2 p.26',
        status: this.aggregate('location_fixed'),
        message: 'Control sites stay in the same place for the project lifetime and are big enough to avoid edge effects.',
        strata: null,
      },
    ];
  });

  /* ---------------------------------------------------------------- map */
  private fieldIndex = computed(() => new Map(this.geo().features.map(f => [String(f.properties?.['id'] ?? f.id), f])));
  mapPolys = computed<FC>(() => {
    const idx = this.fieldIndex();
    const feats: GeoJSON.Feature[] = [];
    const seen = new Set<string>();
    for (const s of this.strata()) {
      const control = s.role === 'control';
      for (const fid of s.field_ids) {
        const f = idx.get(fid);
        if (!f || seen.has(fid + s.role)) continue;
        seen.add(fid + s.role);
        const p = f.properties ?? {};
        feats.push({
          type: 'Feature', geometry: f.geometry,
          properties: {
            id: `${s.role}-${fid}`, color: control ? CONTROL_COLOR : PROJECT_COLOR,
            label: `<strong>${esc(String(p['code'] ?? 'Field'))}</strong><br>${control ? 'Control' : 'Project'} stratum ${esc(s.code)}` +
              (control ? '' : ` · QU ${esc(s.quantification_unit)}`) + (p['area_ha'] ? `<br>${Number(p['area_ha']).toFixed(2)} ha` : ''),
          },
        });
      }
    }
    for (const l of this.activeLinks()) {
      const t = this.targetCentroid(l);
      if (!t) continue;
      feats.push({
        type: 'Feature', geometry: { type: 'LineString', coordinates: [[l.fixed_lon, l.fixed_lat], [t[1], t[0]]] },
        properties: { id: `line-${l.id}`, color: LINE_COLOR, label: '' },
      });
    }
    return { type: 'FeatureCollection', features: feats };
  });
  mapPoints = computed<FC>(() => ({
    type: 'FeatureCollection',
    features: [...this.projectStrata().flatMap(s => {
      const c = this.centroidOfFields(s.field_ids);
      return c ? [{
        type: 'Feature', geometry: { type: 'Point', coordinates: [c[1], c[0]] },
        properties: { id: `stratum-${s.id}`, color: PROJECT_COLOR,
          label: `<strong>Project stratum ${esc(s.code)}</strong><br>${esc(s.name)}<br>QU ${esc(s.quantification_unit)} · ${s.field_ids.length} fields` },
      } as GeoJSON.Feature] : [];
    }), ...this.activeLinks().map(l => {
      const d = this.distance(l);
      return {
        type: 'Feature', geometry: { type: 'Point', coordinates: [l.fixed_lon, l.fixed_lat] },
        properties: {
          id: l.id, color: CONTROL_COLOR,
          label: `<strong>Control site ${esc(this.stratum(l.control_stratum_id)?.code ?? '')}</strong><br>Stands in for ${esc(this.targetLabel(l))}` +
            (d ? `<br>${d.km.toFixed(1)} km${d.est ? ' (estimated)' : ''}` : ''),
        },
      } as GeoJSON.Feature;
    })],
  }));

  constructor() {
    this.api.get<UserLite[]>('/users').subscribe({ next: u => this.users.set(new Map(u.map(x => [x.id, x]))), error: () => {} });
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => { if (pid) this.load(); });
    });
  }

  load() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    this.geoErr.set(null);
    forkJoin({
      links: this.api.get<ControlLink[]>(`/projects/${pid}/control-sites`),
      strata: this.api.get<Stratum[]>(`/projects/${pid}/strata`),
      rules: this.api.get<ControlRules>(`/projects/${pid}/control-sites/rules`).pipe(catchError(() => of(null))),
      assessment: this.api.get<Assessment>(`/projects/${pid}/control-sites/assessment`).pipe(
        catchError((e: ApiError) => (e.status === 404 && e.code === 'NOT_FOUND' ? of(null) : throwError(() => e)))),
    }).subscribe({
      next: r => {
        this.links.set(r.links);
        this.strata.set(r.strata);
        this.rules.set(r.rules);
        this.assessment.set(r.assessment);
        this.loading.set(false);
        this.loadGeo(pid);
        if (this.route.snapshot.queryParamMap.get('link') === 'new' && this.canWrite()) this.openLink();
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  /** Project-filtered boundaries miss control fields that aren't enrolled, so fetch both and merge. */
  private loadGeo(pid: string) {
    const needed = new Set(this.strata().flatMap(s => s.field_ids));
    this.api.get<FC>('/fields/geojson', { project_id: pid }).subscribe({
      next: fc => {
        this.geo.set(fc);
        const have = new Set(fc.features.map(f => String(f.properties?.['id'] ?? f.id)));
        if ([...needed].some(id => !have.has(id))) {
          this.api.get<FC>('/fields/geojson').subscribe({
            next: all => this.geo.set({ type: 'FeatureCollection', features: [...fc.features, ...all.features.filter(f => !have.has(String(f.properties?.['id'] ?? f.id)))] }),
            error: () => {},
          });
        }
      },
      error: (e: ApiError) => this.geoErr.set(e.message),
    });
  }

  assess() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.assessing.set(true);
    this.api.post<Assessment>(`/projects/${pid}/control-sites/assess`).subscribe({
      next: a => {
        this.assessing.set(false);
        this.assessment.set(a);
        const pass = a.links.filter(l => l.overall === 'pass').length;
        this.toast.success('Similarity assessment recorded', `${pass} of ${a.links.length} link(s) meet every Table 7 criterion.`);
      },
      error: (e: ApiError) => { this.assessing.set(false); this.toast.apiError(e, "Couldn't run the assessment"); },
    });
  }

  /* ---------------------------------------------------------------- link form */
  private blank() {
    return { control_stratum_id: '', target: 'stratum' as 'stratum' | 'qu', project_stratum_id: '', qu_code: '', managed_by: '', plan: [] as string[], notes: '', crop_group_justification: '' };
  }
  openLink() {
    this.lf = this.blank();
    this.linkErr.set(null);
    this.linkOpen.set(true);
  }
  linkValid() {
    const f = this.lf;
    return !!f.control_stratum_id && f.managed_by.trim().length >= 2 && (f.target === 'stratum' ? !!f.project_stratum_id : !!f.qu_code);
  }
  createLink() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    const f = this.lf;
    this.saving.set(true);
    this.linkErr.set(null);
    this.api.post<ControlLink>(`/projects/${pid}/control-sites`, {
      control_stratum_id: f.control_stratum_id,
      project_stratum_id: f.target === 'stratum' ? f.project_stratum_id : null,
      qu_code: f.target === 'qu' ? f.qu_code : null,
      managed_by: f.managed_by.trim(), management_plan_evidence_id: f.plan[0] ?? null, notes: f.notes.trim(),
      crop_group_justification: f.crop_group_justification.trim(),
    }).subscribe({
      next: l => {
        this.saving.set(false);
        this.confirmOpen.set(false);
        this.linkOpen.set(false);
        this.links.update(ls => [...ls, l]);
        this.toast.success('Control site linked', 'Run the similarity assessment to check it against Table 7.');
      },
      error: (e: ApiError) => { this.saving.set(false); this.confirmOpen.set(false); this.linkErr.set(e.message); },
    });
  }

  /* ---------------------------------------------------------------- detail */
  openDetail(l: ControlLink) { this.detail.set(l); this.detailOpen.set(true); }
  openDetailById(id: string) { const l = this.links().find(x => x.id === id); if (l) this.openDetail(l); }
  detailTitle() {
    const l = this.detail();
    return l ? `${this.stratum(l.control_stratum_id)?.code ?? 'Control site'} ↔ ${this.targetLabel(l)}` : '';
  }

  openEdit() {
    const l = this.detail();
    if (!l) return;
    this.ef = { managed_by: l.managed_by, plan: l.management_plan_evidence_id ? [l.management_plan_evidence_id] : [], crop_group_justification: l.crop_group_justification ?? '', notes: l.notes ?? '', status: l.status };
    this.editErr.set(null);
    this.detailOpen.set(false);
    this.editOpen.set(true);
  }
  saveEdit() {
    const pid = this.ctx.currentId();
    const l = this.detail();
    if (!pid || !l) return;
    this.saving.set(true);
    this.editErr.set(null);
    this.api.patch<ControlLink>(`/projects/${pid}/control-sites/${l.id}`, {
      managed_by: this.ef.managed_by.trim(), management_plan_evidence_id: this.ef.plan[0] ?? null, notes: this.ef.notes.trim(),
      crop_group_justification: this.ef.crop_group_justification.trim(), status: this.ef.status,
    }).subscribe({
      next: u => {
        this.saving.set(false);
        this.editOpen.set(false);
        this.links.update(ls => ls.map(x => (x.id === u.id ? u : x)));
        this.detail.set(u);
        this.toast.success('Link updated', 'Run the similarity assessment again to refresh the results.');
      },
      error: (e: ApiError) => { this.saving.set(false); this.editErr.set(e.message); },
    });
  }
  /** Extra explanation in the detail list: texture basis with sand/silt/clay, SOC depth. */
  detailExtra(c: Criterion): string {
    const d = c.details ?? {};
    if (c.code === 'soil_texture') {
      if (d['basis'] === 'measured') {
        const f = (v: unknown) => (Array.isArray(v) && v.length === 3 ? `sand ${v[0]} / silt ${v[1]} / clay ${v[2]} %` : '—');
        return `Measured sand, silt and clay (area-weighted): control ${f(d['control_sand_silt_clay'])}; project ${f(d['quantification_unit_sand_silt_clay'])}.`;
      }
      if (d['basis'] === 'field_class') return 'Based on the textural class recorded for each field (no measured sand and clay).';
    }
    if (c.code === 'soc_mean' && typeof d['depth_cm'] === 'number') return `Mean SOC is the 0–${d['depth_cm']} cm average of each sample.`;
    return '';
  }
  groupMatches(c: Criterion): { year: number; control: string; quantification_unit: string; group: string }[] {
    const g = c.details?.['crop_group_matches'];
    return Array.isArray(g) ? g : [];
  }

  /* ---------------------------------------------------------------- helpers */
  stratum(id: string | null) { return id ? this.strataById().get(id) ?? null : null; }
  targetLabel(l: ControlLink) {
    if (l.project_stratum_id) return this.stratum(l.project_stratum_id)?.code ?? 'Replaced stratum';
    return `QU ${l.qu_code}`;
  }
  targetsLabel(la: LinkAssessment) {
    if (la.qu_code) return `QU ${la.qu_code}`;
    return la.targets?.join(', ') || '—';
  }
  linkResult(id: string) { return this.linkResults().get(id) ?? null; }
  who(id: string | null) { return id ? this.users().get(id)?.full_name ?? 'Unknown user' : '—'; }

  private targetFieldIds(l: ControlLink): string[] {
    const targets = l.project_stratum_id ? this.projectStrata().filter(s => s.id === l.project_stratum_id)
      : this.projectStrata().filter(s => s.quantification_unit === l.qu_code);
    return targets.flatMap(s => s.field_ids);
  }
  private targetCentroid(l: ControlLink): [number, number] | null {
    return this.centroidOfFields(this.targetFieldIds(l));
  }
  /** Area-weighted centre [lat, lon] of some fields. */
  private centroidOfFields(ids: string[]): [number, number] | null {
    const idx = this.fieldIndex();
    let sx = 0, sy = 0, sw = 0;
    for (const id of ids) {
      const f = idx.get(id);
      const c = f ? centroidOf(f.geometry) : null;
      if (!c) continue;
      const w = Number(f!.properties?.['area_ha'] ?? 1) || 1;
      sx += c[0] * w; sy += c[1] * w; sw += w;
    }
    return sw ? [sy / sw, sx / sw] : null;
  }
  distance(l: ControlLink): { km: number; est: boolean } | null {
    const c = this.linkResult(l.id)?.criteria.find(x => x.code === 'distance');
    const km = c?.details['distance_km'];
    if (typeof km === 'number') return { km, est: false };
    const t = this.targetCentroid(l);
    return t ? { km: haversineKm(l.fixed_lat, l.fixed_lon, t[0], t[1]), est: true } : null;
  }

  private aggregate(code: string): CritStatus {
    const a = this.assessment();
    if (!a || !a.links.length) return 'pending';
    const st = a.links.map(l => l.criteria.find(c => c.code === code)?.status ?? 'pending');
    return st.includes('fail') ? 'fail' : st.includes('pending') ? 'pending' : 'pass';
  }

  statusIcon(s: string) {
    return s === 'pass' ? 'circle-check' : s === 'fail' ? 'circle-x' : s === 'not_applicable' ? 'minus' : 'circle-dashed';
  }
  statusBadge(s: string) { return s === 'pass' ? 'ok' : s === 'fail' ? 'failed' : 'pending'; }
  statusLabel(s: string) { return s === 'pass' ? 'Meets Table 7' : s === 'fail' ? 'Does not meet' : 'Pending data'; }
  cellLabel(s: string) {
    return ({ pass: 'Pass', fail: 'Fail', pending: 'Pending', not_applicable: 'Not applicable', none: 'Not checked' } as Record<string, string>)[s] ?? s;
  }
  critLabel(code: string) {
    return this.rows().find(r => r.code === code)?.label
      ?? ({ control_stratum_current: 'Control stratum current', target_current: 'Linked stratum current' } as Record<string, string>)[code] ?? code;
  }
  critRef(code: string) { return 'VM0042 ' + (this.rows().find(r => r.code === code)?.ref ?? '§8.2'); }

  missingText(c: Criterion): string {
    const m = c.details['missing'];
    if (Array.isArray(m)) return m.length > 4 ? `${m.slice(0, 4).join('; ')} and ${m.length - 4} more` : m.join('; ');
    if (m && typeof m === 'object') {
      const o = m as { control?: string[]; quantification_unit?: string[] };
      const parts = [];
      if (o.control?.length) parts.push(`control fields ${o.control.join(', ')}`);
      if (o.quantification_unit?.length) parts.push(`project fields ${o.quantification_unit.join(', ')}`);
      return parts.join('; ');
    }
    return '';
  }
  diffText(c: Criterion): string {
    const d = c.details['differences'];
    if (!Array.isArray(d) || !d.length) return '';
    return d.slice(0, 3).map((x: { year: number; practice: string; control: unknown; quantification_unit: unknown }) =>
      `${x.year}: ${x.practice.replace(/_/g, ' ')} — control ${fmtV(x.control)}, project ${fmtV(x.quantification_unit)}`).join(' · ')
      + (d.length > 3 ? ` · ${d.length - 3} more` : '');
  }

  cell(la: LinkAssessment, code: string): Cell {
    const c = la.criteria.find(x => x.code === code);
    if (!c) {
      return { status: 'none', a: '', b: '', note: '', message: 'Not part of this assessment run.' };
    }
    const d = c.details as Record<string, unknown>;
    const n = (v: unknown, digits = 1, unit = '') => (typeof v === 'number' ? `${v.toFixed(digits)}${unit}` : '');
    const s = (v: unknown) => (v === null || v === undefined ? '' : humanV(String(v)));
    const out: Cell = { status: c.status, a: '', b: '', note: '', message: c.message };
    switch (code) {
      case 'distance':
        out.note = typeof d['distance_km'] === 'number' ? `${(d['distance_km'] as number).toFixed(1)} km apart` : '';
        break;
      case 'aspect':
        out.a = n(d['control_deg'], 0, '°'); out.b = n(d['quantification_unit_deg'], 0, '°');
        if (typeof d['difference_deg'] === 'number') out.note = `Δ ${(d['difference_deg'] as number).toFixed(0)}°`;
        break;
      case 'soc_mean':
        out.a = n(d['control_mean_pct'], 2, ' %'); out.b = n(d['quantification_unit_mean_pct'], 2, ' %');
        if (typeof d['p_value'] === 'number') out.note = `p = ${(d['p_value'] as number).toFixed(3)} · n ${d['n_control']}/${d['n_quantification_unit']}`;
        if (typeof d['depth_cm'] === 'number') out.note = [`0–${d['depth_cm']} cm average`, out.note].filter(Boolean).join(' · ');
        else if (d['n_control'] !== undefined) out.note = `n ${d['n_control']}/${d['n_quantification_unit']} results (need 2+)`;
        break;
      case 'precipitation':
        out.a = n(d['control_mm'], 0, ' mm'); out.b = n(d['quantification_unit_mm'], 0, ' mm');
        if (typeof d['difference_mm'] === 'number') out.note = `Δ ${(d['difference_mm'] as number).toFixed(0)} mm`;
        break;
      case 'historical_alm': {
        const yrs = d['years'] as number[] | undefined;
        const diffs = (d['differences'] as unknown[] | undefined)?.length ?? 0;
        const miss = (d['missing'] as unknown[] | undefined)?.length ?? 0;
        const grp = (d['crop_group_matches'] as unknown[] | undefined)?.length ?? 0;
        out.note = [yrs?.length ? `${yrs[0]}–${yrs[yrs.length - 1]}` : '', diffs ? `${diffs} difference(s)` : '', miss ? `${miss} gap(s)` : '', grp ? `${grp} yr matched by crop group` : ''].filter(Boolean).join(' · ');
        break;
      }
      case 'soil_texture': {
        out.a = s(d['control']); out.b = s(d['quantification_unit']);
        const ssc = (v: unknown) => (Array.isArray(v) && v.length === 3 ? ` (${v.map(x => Math.round(Number(x))).join('/')})` : '');
        if (d['basis'] === 'measured') { out.a += ssc(d['control_sand_silt_clay']); out.b += ssc(d['quantification_unit_sand_silt_clay']); out.note = 'Measured sand/silt/clay %'; }
        else if (d['basis'] === 'field_class') out.note = 'From recorded field classes';
        break;
      }
      case 'historical_land_cover': {
        const side = (v: unknown) => {
          const o = v as { converted_from?: string | null; year?: number | null } | undefined;
          return !o ? '' : o.converted_from ? `From ${o.converted_from} (${o.year})` : 'Not converted';
        };
        out.a = side(d['control']); out.b = side(d['quantification_unit']);
        if (typeof d['difference_years'] === 'number') out.note = `${d['difference_years']} years apart (limit ±10)`;
        break;
      }
      case 'location_fixed':
        out.note = typeof d['moved_m'] === 'number' ? `Moved ${(d['moved_m'] as number).toFixed(0)} m (limit 50 m)` : '';
        break;
      case 'management_plan':
        break;
      default:
        out.a = s(d['control']); out.b = s(d['quantification_unit']);
    }
    if (c.status === 'pending' && !out.note) {
      const m = this.missingText(c);
      out.note = m ? 'Missing data' : '';
    }
    return out;
  }
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[ch]);
}
function humanV(v: string) {
  const s = v.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function fmtV(v: unknown) {
  if (v === true) return 'yes';
  if (v === false) return 'no';
  return humanV(String(v ?? '—'));
}
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(a));
}
/** Vertex-average centre of a polygon (good enough for drawing and estimating distance). */
function centroidOf(g: GeoJSON.Geometry | null): [number, number] | null {
  if (!g) return null;
  let sx = 0, sy = 0, n = 0;
  const walk = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === 'number') { sx += c[0] as number; sy += c[1] as number; n++; }
    else if (Array.isArray(c)) c.forEach(walk);
  };
  if ('coordinates' in g) walk(g.coordinates);
  return n ? [sx / n, sy / n] : null;
}
