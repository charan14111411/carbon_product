import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT, TimelineItem } from '../../ui/kit';
import { PeopleDirectory } from '../benefits/benefit-types';
import { Steps, apiMessage } from '../credits/credit-ui';
import { selfApprovalMessage } from '../households/lookups';
import { ConfirmDialog } from '../programmes/confirm';
import { CommitmentsEditor, commitmentsPayload } from './commitments-editor';
import {
  COMPLIANCE, Commitment, DEV_KIND, Deviation, IMPACT, Plan, PlanCompliance, PLAN_STEPS, PLAN_STEP_LABELS,
  PracticeCatalogue, YearRow, YearStatus, frequency, period,
} from './plan-types';

type Bundle = { plan: Plan; comp: PlanCompliance | null; devs: Deviation[] };

@Component({
  selector: 'vc-plan-detail',
  imports: [...KIT, FormsModule, RouterLink, DayPipe, Steps, CommitmentsEditor, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/interventions" class="back"><vc-icon name="arrow-left" [size]="15" />All intervention plans</a>
    @if (loading() && !b()) { <div class="card"><vc-loading [rows]="8" /></div> }
    @else if (error()) { <vc-error title="Couldn't load the plan" [message]="error()!" /> }
    @else if (b(); as b) {
      @let p = b.plan;
      <vc-page-header [title]="p.code + ' · version ' + p.version" eyebrow="Intervention plan"
        [subtitle]="(p.farmer?.name ?? 'Farmer') + ' · field ' + (p.field_code ?? '') + (p.farmer?.village ? ' · ' + p.farmer!.village : '')">
        <ng-container actions>
        @if (canWrite) {
          @if (p.status === 'draft') {
            <button class="btn btn-secondary" (click)="openEdit(p)"><vc-icon name="pencil" />Edit</button>
            <button class="btn btn-primary" (click)="openAgree()"><vc-icon name="pen-line" />Record agreement</button>
          }
          @if ((p.status === 'agreed' || p.status === 'active') && isLatest(p)) {
            <button class="btn btn-secondary" (click)="openRevise(p)"><vc-icon name="branch" />Revise plan</button>
          }
          @if (p.status === 'active' || p.status === 'completed' || p.status === 'withdrawn') {
            <button class="btn btn-secondary" [disabled]="busy()" (click)="detect(p)"><vc-icon name="radar" />Detect deviations</button>
          }
        }
        @if (canManage && p.status === 'agreed') {
          <button class="btn btn-primary" [disabled]="busy() || p.created_by === me" (click)="activateOpen.set(true)"
            [title]="p.created_by === me ? 'You created this plan, so a colleague must activate it' : ''"><vc-icon name="check" />Activate</button>
        }
              </ng-container>
      </vc-page-header>

      <div class="card card-pad stepcard">
        @if (p.status === 'withdrawn' || p.status === 'superseded') {
          <div class="row"><vc-badge [status]="p.status" /><span class="muted">{{ p.status === 'withdrawn' ? 'Withdrawn on ' + (p.closed_on | day) + (p.close_reason ? ': ' + p.close_reason : '') : 'Replaced by a newer version of this plan.' }}</span>
            @if (p.status === 'superseded' && latest(); as l) { <span class="spacer"></span><a [routerLink]="['/app/interventions', l.id]">Open version {{ l.version }}</a> }</div>
        } @else {
          <vcx-steps [steps]="steps" [labels]="stepLabels" [current]="p.status" [offPath]="[]" />
        }
        @if (p.status === 'draft') {
          <p class="next"><vc-icon name="info" [size]="15" />Next: the farmer agrees to these commitments — by an SMS code on their phone, or in person with you as witness.</p>
        } @else if (p.status === 'agreed') {
          <p class="next"><vc-icon name="shield" [size]="15" />
            @if (p.created_by === me) { You created this plan, so a different colleague must activate it. This keeps plans checked by two people. }
            @else { Agreed by the farmer. A staff member who didn't prepare the plan activates it; the field must be enrolled. Prepared by {{ people.name(p.created_by) }}. }</p>
        }
      </div>

      <div class="layout">
        <div class="stack">
          <section class="card">
            <div class="card-head"><h3>Commitments and compliance <vc-dc cls="DERIVED" /></h3>
              @if (b.comp; as c) { <span class="small subtle">{{ countLine(c) }}</span> }</div>
            @for (cc of commitmentRows(); track $index) {
              <div class="cm">
                <div class="cmh">
                  <div><strong>{{ cat.name(cc.c.practice_code) }}</strong><span class="small muted"> · {{ period(cc.c) }} · {{ frequency(cc.c) }}</span>
                    @if (cc.c.notes) { <p class="small subtle">{{ cc.c.notes }}</p> }</div>
                  @if (cc.status) { <span class="cp" [style.background]="meta(cc.status).soft" [style.color]="meta(cc.status).text">{{ meta(cc.status).label }}</span> }
                </div>
                @if (cc.years.length) {
                  <div class="years">
                    @for (y of cc.years; track y.year) {
                      <div class="yr" [style.background]="meta(y.status).soft" [style.border-color]="meta(y.status).color" [title]="yearTitle(y)">
                        <span class="yy num">{{ y.year }}</span>
                        <span class="yv num"><vc-icon [name]="meta(y.status).icon" [size]="12" [stroke]="2.4" />{{ y.recorded_times }}/{{ y.expected_times }}</span>
                        @if (y.expected_quantity) { <span class="yq num">{{ y.recorded_quantity }}/{{ y.expected_quantity }} {{ y.unit }}</span> }
                      </div>
                    }
                  </div>
                } @else if (p.status === 'draft') { <p class="small subtle">Compliance is tracked once the plan is agreed.</p> }
              </div>
            } @empty { <vc-empty icon="list-checks" title="No commitments" /> }
            @if (b.comp) { <p class="basis small subtle">{{ b.comp.basis }} Records are read, never changed.</p> }
          </section>

          <section class="card">
            <div class="card-head"><h3>Deviations <span class="small subtle hn">{{ openDevs() }} open</span></h3>
              @if (canWrite && !['draft', 'superseded'].includes(p.status)) { <button class="btn btn-secondary btn-sm" (click)="openDev()"><vc-icon name="flag" [size]="14" />Report deviation</button> }</div>
            @if (!b.devs.length) {
              <vc-empty icon="check-circle" title="No deviations recorded" text="Run “Detect deviations” after a year ends to record missed or partly done commitments automatically." />
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Year</th><th>Practice</th><th>What happened</th><th>Impact</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    @for (d of b.devs; track d.id) {
                      <tr>
                        <td class="num">{{ d.year ?? '—' }}</td>
                        <td>{{ devPractice(d) }}<span class="src">{{ d.source === 'auto' ? 'Detected' : 'Reported' }}</span></td>
                        <td class="why"><strong>{{ kind(d.kind) }}.</strong> {{ reasonText(d) }}
                          @if (d.corrective_action) { <span class="ca"><vc-icon name="corner-down-right" [size]="12" />{{ d.corrective_action }}</span> }</td>
                        <td><span class="imp" [class]="'i-' + d.impact">{{ impact(d.impact) }}</span></td>
                        <td><vc-badge [status]="d.status" /></td>
                        <td class="num">@if (canManage && d.status !== 'closed') { <button class="btn btn-secondary btn-sm" (click)="openMove(d)">{{ d.status === 'open' ? 'Review' : 'Close' }}</button> }</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        </div>

        <aside class="stack">
          <section class="card card-pad">
            <h3 class="ah">Agreement</h3>
            <dl class="kv">
              <dt>Status</dt><dd><vc-badge [status]="p.status" /></dd>
              <dt>Farmer</dt><dd>{{ p.farmer?.name }}<br /><span class="mono small subtle">{{ p.farmer?.code }}</span></dd>
              <dt>Agreed</dt><dd>@if (p.agreed_at) { {{ p.agreed_at | day: true }} } @else { <span class="subtle">Not yet</span> }</dd>
              @if (p.agreed_method) { <dt>How</dt><dd>{{ p.agreed_method === 'otp' ? 'Code sent to the farmer by SMS' : 'In person, witnessed by staff' }}</dd> }
              @if (p.agreed_text_sha256) { <dt>Agreed text</dt><dd><vc-hash [value]="p.agreed_text_sha256" /></dd> }
              <dt>Prepared by</dt><dd>{{ people.name(p.created_by) }} · {{ p.created_at | day }}</dd>
              @if (p.activated_at) { <dt>Activated by</dt><dd>{{ people.name(p.activated_by) }} · {{ p.activated_at | day }}</dd> }
              @if (p.closed_on && p.status === 'completed') { <dt>Completed</dt><dd>{{ p.closed_on | day }}</dd> }
            </dl>
            @if (p.notes) { <p class="notes">{{ p.notes }}</p> }
            @if (canManage && (p.status === 'active')) {
              <div class="row acts"><button class="btn btn-secondary btn-sm" (click)="completeOpen.set(true)"><vc-icon name="check-circle" [size]="14" />Mark completed</button></div>
            }
            @if (canManage && ['draft', 'agreed', 'active'].includes(p.status)) {
              <div class="row acts"><button class="btn btn-ghost btn-sm dangerlink" (click)="withdrawOpen.set(true)"><vc-icon name="ban" [size]="14" />Withdraw plan</button></div>
            }
          </section>
          <section class="card card-pad">
            <h3 class="ah">Version history</h3>
            <div class="vers">
              @for (v of versionsDesc(); track v.id) {
                <a class="vr" [class.cur]="v.id === p.id" [routerLink]="['/app/interventions', v.id]">
                  <span class="vn num">v{{ v.version }}</span>
                  <span class="vb"><vc-badge [status]="v.status" />@if (v.change_reason) { <span class="small muted">{{ v.change_reason }}</span> } @else if (v.version === 1) { <span class="small subtle">First version</span> }</span>
                </a>
              }
            </div>
            @if (p.change_reason && p.version > 1) { <p class="small subtle" style="margin-top:10px">A new version must be agreed by the farmer and activated again. The earlier version stays in force until then.</p> }
          </section>
        </aside>
      </div>
    }

    <!-- agree -->
    <vc-modal [(open)]="agreeOpen" title="Record the farmer's agreement" [subtitle]="(b()?.plan?.farmer?.name ?? '') + ' · ' + (b()?.plan?.code ?? '')" width="520px">
      <div class="stack">
        <div class="method">
          <button type="button" [class.on]="agreeMethod() === 'otp'" (click)="agreeMethod.set('otp')"><vc-icon name="message" [size]="18" /><strong>SMS code</strong><span>The farmer reads out the code sent to their phone.</span></button>
          @if (canManage) {
            <button type="button" [class.on]="agreeMethod() === 'assisted'" (click)="agreeMethod.set('assisted')"><vc-icon name="user-check" [size]="18" /><strong>In person</strong><span>You explain the plan and witness the agreement.</span></button>
          }
        </div>
        @if (agreeMethod() === 'otp') {
          <div class="field"><label for="otp">Code from the farmer's SMS</label>
            <input id="otp" class="input otp num" inputmode="numeric" maxlength="6" [(ngModel)]="otp" placeholder="6 digits" autocomplete="one-time-code" />
            <span class="hint">Demo environment: the code is always 123456. No SMS provider is connected.</span></div>
        } @else {
          <vc-callout tone="info" icon="user-check">You'll be recorded as the witness. Confirm you have read every commitment to the farmer in a language they understand.</vc-callout>
          <label class="checkbox"><input type="checkbox" [(ngModel)]="witnessed" />I explained the plan and the farmer agreed to it</label>
        }
        <p class="small subtle">A fingerprint of the exact plan text is stored with the agreement, so any later change is visible.</p>
        @if (actionError()) { <vc-error title="Agreement not recorded" [message]="actionError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="agreeOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || (agreeMethod() === 'otp' ? otp.trim().length !== 6 : !witnessed)" (click)="agree()">Record agreement</button>
      </ng-container>
    </vc-modal>

    <!-- edit / revise -->
    <vc-modal [(open)]="editOpen" [drawer]="true" width="640px" [title]="editMode() === 'revise' ? 'Revise plan' : 'Edit draft plan'"
      [subtitle]="editMode() === 'revise' ? 'Creates version ' + ((b()?.plan?.version ?? 0) + 1) + '. The current version stays in force until the new one is agreed and activated.' : (b()?.plan?.code ?? '')">
      <div class="stack">
        @if (editMode() === 'revise') {
          <div class="field"><label for="rr">Why is the plan changing?</label>
            <textarea id="rr" class="input" rows="3" [(ngModel)]="reviseReason" placeholder="e.g. Farmer switched from mulching to cover crops after the 2025 drought."></textarea>
            <span class="hint">Required, at least 5 characters. Shown to the farmer and kept in the audit log.</span></div>
        }
        <div class="field"><label>Commitments</label><vcx-commitments-editor [(rows)]="eRows" /></div>
        <div class="field"><label for="en">Notes</label><textarea id="en" class="input" rows="3" [(ngModel)]="eNotes"></textarea></div>
        @if (actionError()) { <vc-error title="Not saved" [message]="actionError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || (editMode() === 'revise' && reviseReason.trim().length < 5)" (click)="saveEdit()">{{ editMode() === 'revise' ? 'Create new version' : 'Save changes' }}</button>
      </ng-container>
    </vc-modal>

    <!-- report deviation -->
    <vc-modal [(open)]="devOpen" title="Report a deviation" [subtitle]="b()?.plan?.code ?? ''" width="520px">
      <div class="form-grid">
        <div class="field span-2"><label for="dc">Commitment</label>
          <select id="dc" class="input" [(ngModel)]="dv.commitment_id"><option value="">Whole plan</option>
            @for (c of b()?.plan?.commitments ?? []; track c.id) { <option [value]="c.id">{{ cat.name(c.practice_code) }} · {{ period(c) }}</option> }</select></div>
        <div class="field"><label for="dy">Year</label><input id="dy" type="number" class="input num" [(ngModel)]="dv.year" /></div>
        <div class="field"><label for="dk">What happened</label>
          <select id="dk" class="input" [(ngModel)]="dv.kind"><option value="missed">Missed</option><option value="partial">Partly done</option><option value="changed">Done differently</option><option value="other">Other</option></select></div>
        <div class="field span-2"><label for="dr">Details</label><textarea id="dr" class="input" rows="3" [(ngModel)]="dv.reason" placeholder="What was seen or reported, and by whom."></textarea></div>
        <div class="field span-2"><label for="dca">Corrective action <span class="subtle">(optional)</span></label><input id="dca" class="input" [(ngModel)]="dv.corrective_action" placeholder="e.g. Seed support for rabi cover crop" /></div>
        @if (actionError()) { <div class="span-2"><vc-error title="Not recorded" [message]="actionError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="devOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || dv.reason.trim().length < 5" (click)="reportDev()">Record deviation</button>
      </ng-container>
    </vc-modal>

    <!-- move deviation -->
    <vc-modal [open]="!!moving()" (closed)="moving.set(null)" title="Review deviation" [subtitle]="moving() ? devPractice(moving()!) + (moving()!.year ? ' · ' + moving()!.year : '') : ''" width="520px">
      @if (moving(); as d) {
        <div class="stack">
          <p class="muted">{{ d.reason }}</p>
          <div class="field"><label>Impact on the carbon claim</label>
            <div class="impacts">@for (i of impacts; track i.k) { <button type="button" [class.on]="mv.impact === i.k" (click)="mv.impact = i.k"><strong>{{ i.label }}</strong><span>{{ i.hint }}</span></button> }</div></div>
          <div class="field"><label for="mca">Corrective action</label><input id="mca" class="input" [(ngModel)]="mv.corrective_action" /></div>
          <div class="field"><label for="mno">Note for the audit trail</label><input id="mno" class="input" [(ngModel)]="mv.note" /></div>
          @if (actionError()) { <vc-error title="Not changed" [message]="actionError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="moving.set(null)">Cancel</button>
        @if (moving()?.status === 'open') { <button class="btn btn-secondary" [disabled]="busy()" (click)="moveDev('acknowledged')">Acknowledge</button> }
        <button class="btn btn-primary" [disabled]="busy() || mv.impact === 'unassessed'" (click)="moveDev('closed')" [title]="mv.impact === 'unassessed' ? 'Assess the impact before closing' : ''">Close deviation</button>
      </ng-container>
    </vc-modal>

    <vc-confirm [(open)]="activateOpen" title="Activate this plan?" confirmLabel="Activate plan" icon="check" [busy]="busy()"
      [message]="'From today, ' + (b()?.plan?.farmer?.name ?? 'the farmer') + '’s recorded practices are checked against this plan. ' + (b()?.plan?.supersedes_id ? 'The earlier version is marked superseded and the change is logged as a deviation.' : '') + ' Prepared by ' + people.name(b()?.plan?.created_by) + '.'"
      (confirmed)="activate()" />
    <vc-confirm [(open)]="completeOpen" title="Mark the plan completed?" confirmLabel="Mark completed" reason="optional" reasonLabel="Closing note" [busy]="busy()"
      message="Use this when the plan period has ended. Compliance stops being counted after today." (confirmed)="close('complete', $event)" />
    <vc-confirm [(open)]="withdrawOpen" title="Withdraw this plan?" tone="danger" confirmLabel="Withdraw plan" reason="required" reasonLabel="Why is it withdrawn?"
      reasonPlaceholder="e.g. Farmer left the programme and the field was withdrawn." [busy]="busy()"
      message="A withdrawn plan can't be reopened. Past years stay on record and can still be checked for deviations." (confirmed)="close('withdraw', $event)" />
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;margin-bottom:14px;color:var(--text-2)}
    .stepcard{margin-bottom:16px;display:flex;flex-direction:column;gap:12px}
    .next{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;color:var(--stone-700)} .next vc-icon{margin-top:2px;color:var(--forest-600)}
    .layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:start}
    @media (max-width:1100px){.layout{grid-template-columns:1fr}}
    .cm{padding:14px 20px;border-bottom:1px solid var(--stone-100)}
    .cmh{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
    .cp{display:inline-block;font-size:12px;font-weight:500;padding:2px 9px;border-radius:999px;white-space:nowrap}
    .years{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
    .yr{display:flex;flex-direction:column;gap:1px;min-width:74px;padding:6px 9px;border-radius:7px;border:1px solid;border-left-width:3px}
    .yy{font-size:11.5px;color:var(--text-2);font-weight:500}
    .yv{display:inline-flex;align-items:center;gap:4px;font-weight:600;font-size:13px;color:var(--stone-800)}
    .yq{font-size:11px;color:var(--text-2)}
    .basis{padding:12px 20px}
    h3 vc-dc{margin-left:6px;vertical-align:2px} .hn{font-weight:400;margin-left:6px}
    .src{display:block;font-size:11px;color:var(--text-3)}
    .why{max-width:360px;font-size:13px}
    .ca{display:flex;gap:4px;align-items:flex-start;margin-top:4px;font-size:12px;color:var(--forest-700)}
    .imp{font-size:12px;padding:2px 8px;border-radius:4px;background:var(--stone-100);color:var(--stone-600);white-space:nowrap}
    .imp.i-major{background:var(--red-100);color:var(--red-600)} .imp.i-minor{background:var(--amber-100);color:var(--amber-600)} .imp.i-none{background:var(--forest-50);color:var(--forest-700)}
    .ah{margin-bottom:12px}
    .notes{margin-top:14px;padding-top:12px;border-top:1px solid var(--border);color:var(--stone-700);white-space:pre-wrap;font-size:13.5px}
    .acts{margin-top:12px} .dangerlink{color:var(--red-600)}
    .vers{display:flex;flex-direction:column;gap:6px}
    .vr{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:8px;border:1px solid var(--border);color:inherit;text-decoration:none!important}
    .vr:hover{background:var(--surface-2)} .vr.cur{border-color:var(--forest-300);background:var(--forest-50)}
    .vn{font:600 12px var(--mono);color:var(--stone-700);padding-top:3px}
    .vb{display:flex;flex-direction:column;gap:4px;align-items:flex-start}
    .method{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .method button{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:12px;border:1px solid var(--border-strong);border-radius:10px;background:var(--surface);font:inherit;text-align:left;cursor:pointer;color:var(--stone-800)}
    .method button span{font-size:12.5px;color:var(--text-2)} .method button vc-icon{color:var(--forest-600)}
    .method button.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:inset 0 0 0 1px var(--forest-500)}
    .otp{font-size:22px;letter-spacing:.3em;height:48px;max-width:220px}
    .impacts{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
    .impacts button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:8px 10px;border:1px solid var(--border-strong);border-radius:8px;background:var(--surface);font:inherit;text-align:left;cursor:pointer}
    .impacts button span{font-size:11.5px;color:var(--text-2)} .impacts button.on{border-color:var(--forest-500);background:var(--forest-50)}
  `],
})
export class PlanDetailPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  people = inject(PeopleDirectory);
  cat = inject(PracticeCatalogue);
  private id = toSignal(inject(ActivatedRoute).paramMap.pipe(map(p => p.get('id')!)), { initialValue: '' });
  canWrite = this.auth.can('farmers.manage', 'practice.record');
  canManage = this.auth.can('farmers.manage');
  me = this.auth.profile()?.id;
  steps = PLAN_STEPS;
  stepLabels = PLAN_STEP_LABELS;
  period = period;
  frequency = frequency;
  impacts = [
    { k: 'none' as const, label: 'None', hint: 'No effect on carbon' },
    { k: 'minor' as const, label: 'Minor', hint: 'Small, note in report' },
    { k: 'major' as const, label: 'Major', hint: 'May change the claim' },
  ];

  b = signal<Bundle | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);
  actionError = signal<string | null>(null);

  agreeOpen = signal(false);
  agreeMethod = signal<'otp' | 'assisted'>('otp');
  otp = '';
  witnessed = false;
  editOpen = signal(false);
  editMode = signal<'edit' | 'revise'>('edit');
  eRows: Commitment[] = [];
  eNotes = '';
  reviseReason = '';
  devOpen = signal(false);
  dv = { commitment_id: '', year: new Date().getFullYear() - 1 as number | null, kind: 'missed', reason: '', corrective_action: '' };
  moving = signal<Deviation | null>(null);
  mv = { impact: 'unassessed' as Deviation['impact'], corrective_action: '', note: '' };
  activateOpen = signal(false);
  completeOpen = signal(false);
  withdrawOpen = signal(false);

  commitmentRows = computed(() => {
    const b = this.b();
    if (!b) return [];
    const comp = new Map((b.comp?.commitments ?? []).map(c => [c.commitment.id, c]));
    return (b.plan.commitments ?? []).map(c => ({ c, status: comp.get(c.id)?.status ?? null as YearStatus | null, years: comp.get(c.id)?.years ?? [] as YearRow[] }));
  });
  versionsDesc = computed(() => [...(this.b()?.plan.versions ?? [])].sort((a, b) => b.version - a.version));
  latest = computed(() => this.versionsDesc()[0] ?? null);
  openDevs = computed(() => (this.b()?.devs ?? []).filter(d => d.status !== 'closed').length);

  constructor() {
    this.people.load();
    this.cat.load();
    effect(() => { const id = this.id(); if (id) this.load(id); });
  }

  load(id = this.id(), keep = false) {
    if (!keep) this.loading.set(true);
    this.error.set(null);
    forkJoin({
      plan: this.api.get<Plan>(`/intervention-plans/${id}`),
      comp: this.api.get<PlanCompliance>(`/intervention-plans/${id}/compliance`).pipe(catchError(() => of(null))),
      devs: this.api.get<Deviation[]>(`/intervention-plans/${id}/deviations`).pipe(catchError(() => of([] as Deviation[]))),
    }).subscribe({
      next: r => { this.b.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  meta(s: YearStatus) { return COMPLIANCE[s]; }
  kind(k: string) { return DEV_KIND[k] ?? k; }
  impact(k: string) { return IMPACT[k] ?? k; }
  reasonText(d: Deviation) { return d.source === 'auto' ? d.reason.replace(/^[a-z0-9_]+:\s*/, '') : d.reason; }
  isLatest(p: Plan) { return this.latest()?.id === p.id; }
  countLine(c: PlanCompliance) {
    return (['met', 'partially', 'not_met', 'upcoming'] as YearStatus[]).filter(s => c.counts[s]).map(s => `${c.counts[s]} ${COMPLIANCE[s].label.toLowerCase()}`).join(' · ');
  }
  yearTitle(y: YearRow) {
    return `${y.year}: ${COMPLIANCE[y.status].label}. ${y.recorded_times} of ${y.expected_times} recorded` + (y.expected_quantity ? `, ${y.recorded_quantity} of ${y.expected_quantity} ${y.unit ?? ''}` : '');
  }
  devPractice(d: Deviation) {
    const c = (this.b()?.plan.commitments ?? []).find(x => x.id === d.commitment_id);
    if (c) return this.cat.name(c.practice_code);
    const code = String(d.reason).split(':')[0];
    return d.commitment_id && code ? this.cat.name(code) : 'Whole plan';
  }

  private done(msg: string, body?: string) {
    this.busy.set(false);
    this.toast.success(msg, body);
    this.load(this.id(), true);
  }
  private fail = (e: ApiError) => { this.busy.set(false); this.actionError.set(selfApprovalMessage(e, 'Activating a plan')); };

  openAgree() { this.actionError.set(null); this.otp = ''; this.witnessed = false; this.agreeMethod.set('otp'); this.agreeOpen.set(true); }
  agree() {
    const p = this.b()?.plan;
    if (!p) return;
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<Plan>(`/intervention-plans/${p.id}/agree`, { method: this.agreeMethod(), otp_code: this.agreeMethod() === 'otp' ? this.otp.trim() : null }).subscribe({
      next: () => { this.agreeOpen.set(false); this.done('Agreement recorded', 'A colleague can now activate the plan.'); },
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(apiMessage(e)); },
    });
  }
  activate() {
    const p = this.b()?.plan;
    if (!p) return;
    this.busy.set(true);
    this.api.post<Plan>(`/intervention-plans/${p.id}/activate`).subscribe({
      next: () => { this.activateOpen.set(false); this.done(`${p.code} is active`); },
      error: (e: ApiError) => { this.busy.set(false); this.activateOpen.set(false); this.toast.error('Plan not activated', selfApprovalMessage(e, 'Activating a plan')); },
    });
  }
  close(kind: 'complete' | 'withdraw', reason: string) {
    const p = this.b()?.plan;
    if (!p) return;
    this.busy.set(true);
    this.api.post<Plan>(`/intervention-plans/${p.id}/${kind}`, { reason }).subscribe({
      next: () => { this.completeOpen.set(false); this.withdrawOpen.set(false); this.done(kind === 'complete' ? 'Plan completed' : 'Plan withdrawn'); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, 'Not changed'); },
    });
  }
  detect(p: Plan) {
    this.busy.set(true);
    this.api.post<{ created: number }>(`/intervention-plans/${p.id}/detect-deviations`).subscribe({
      next: r => this.done(r.created ? `${r.created} deviation${r.created === 1 ? '' : 's'} recorded` : 'No new deviations', r.created ? 'Review each one and assess its impact.' : 'Every finished year met its commitments or is already on record.'),
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't check for deviations"); },
    });
  }
  openEdit(p: Plan) {
    this.editMode.set('edit');
    this.eRows = (p.commitments ?? []).map(c => ({ ...c }));
    this.eNotes = p.notes;
    this.actionError.set(null);
    this.editOpen.set(true);
  }
  openRevise(p: Plan) {
    this.openEdit(p);
    this.editMode.set('revise');
    this.reviseReason = '';
  }
  saveEdit() {
    const p = this.b()?.plan;
    if (!p) return;
    this.busy.set(true);
    this.actionError.set(null);
    const commitments = commitmentsPayload(this.eRows);
    if (this.editMode() === 'edit') {
      this.api.patch<Plan>(`/intervention-plans/${p.id}`, { notes: this.eNotes, commitments }).subscribe({
        next: () => { this.editOpen.set(false); this.done('Draft saved'); },
        error: (e: ApiError) => { this.busy.set(false); this.actionError.set(apiMessage(e)); },
      });
    } else {
      this.api.post<Plan>(`/intervention-plans/${p.id}/revise`, { reason: this.reviseReason.trim(), notes: this.eNotes, commitments }).subscribe({
        next: n => { this.busy.set(false); this.editOpen.set(false); this.toast.success(`Version ${n.version} drafted`, 'The farmer must agree to it before it replaces the current plan.'); this.router.navigate(['/app/interventions', n.id]); },
        error: (e: ApiError) => { this.busy.set(false); this.actionError.set(apiMessage(e)); },
      });
    }
  }
  openDev() {
    this.dv = { commitment_id: '', year: new Date().getFullYear() - 1, kind: 'missed', reason: '', corrective_action: '' };
    this.actionError.set(null);
    this.devOpen.set(true);
  }
  reportDev() {
    const p = this.b()?.plan;
    if (!p) return;
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<Deviation>(`/intervention-plans/${p.id}/deviations`, {
      commitment_id: this.dv.commitment_id || null, year: this.dv.year ? Number(this.dv.year) : null, kind: this.dv.kind,
      reason: this.dv.reason.trim(), corrective_action: this.dv.corrective_action.trim(),
    }).subscribe({
      next: () => { this.devOpen.set(false); this.done('Deviation recorded'); },
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(apiMessage(e)); },
    });
  }
  openMove(d: Deviation) {
    this.mv = { impact: d.impact, corrective_action: d.corrective_action, note: '' };
    this.actionError.set(null);
    this.moving.set(d);
  }
  moveDev(status: 'acknowledged' | 'closed') {
    const d = this.moving();
    if (!d) return;
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<Deviation>(`/intervention-deviations/${d.id}/status`, {
      status, impact: this.mv.impact === 'unassessed' ? null : this.mv.impact, corrective_action: this.mv.corrective_action, note: this.mv.note,
    }).subscribe({
      next: () => { this.moving.set(null); this.done(status === 'closed' ? 'Deviation closed' : 'Deviation acknowledged'); },
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(apiMessage(e)); },
    });
  }
}
