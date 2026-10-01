import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { EvidenceList } from './evidence';
import {
  AdditionalityRules, Assessment, AssessmentResult, BARRIER_LABELS, Barrier, Practice, PracticeResult,
  RegulatorySurplus, SOURCE_LABELS, STEP_META, StepResult, StepStatus, UserLite,
} from './types';

interface PracticeRow extends Practice { unknown: boolean; expert: NonNullable<Practice['expert']>; essential_distinction: NonNullable<Practice['essential_distinction']> }
interface FormModel { regulatory_surplus: RegulatorySurplus; barriers: Barrier[]; common_practice: PracticeRow[] }

type Review = 'submit' | 'approve' | 'reject' | 'new' | null;

@Component({
  selector: 'vc-additionality-page',
  imports: [...KIT, FormsModule, DayPipe, NumPipe, EvidenceList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Additionality" eyebrow="Methodology"
      subtitle="Show that the project's practices go beyond what the law requires, face real barriers, and aren't already common in the region. Each version is prepared by one person and approved by another.">
      @if (a(); as x) {
        <div actions class="hdr-actions">
          @if (x.status === 'draft' && canWrite() && isLatest()) {
            <button class="btn btn-secondary" [disabled]="saving() || !dirty()" (click)="save()"><vc-icon name="check" />{{ saving() ? 'Saving…' : dirty() ? 'Save draft' : 'Saved' }}</button>
            <button class="btn btn-primary" [disabled]="saving()" (click)="review.set('submit')"><vc-icon name="send" />Submit for approval</button>
          }
          @if (x.status === 'submitted' && canApprove() && isLatest()) {
            <button class="btn btn-secondary" (click)="openReview('reject')"><vc-icon name="x-circle" />Reject</button>
            <button class="btn btn-primary" (click)="openReview('approve')"><vc-icon name="check-circle" />Approve</button>
          }
          @if ((x.status === 'approved' || x.status === 'rejected' || x.status === 'superseded') && canWrite() && isLatest()) {
            <button class="btn btn-secondary" (click)="review.set('new')"><vc-icon name="copy" />Start new version</button>
          }
        </div>
      }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Additionality is demonstrated per project. Pick one in the top bar." /></div>
    } @else if (loading()) {
      <div class="card"><vc-loading [rows]="7" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load the additionality assessment" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else if (!a()) {
      <div class="card start">
        <vc-empty icon="scale" title="No additionality assessment yet"
          text="VM0042 §7 asks for three tests: regulatory surplus, barrier analysis and common practice. Start a draft and work through them one at a time — nothing is final until someone else approves it.">
          @if (canWrite()) { <button class="btn btn-primary" [disabled]="busy()" (click)="start()"><vc-icon name="plus" />Start assessment</button> }
        </vc-empty>
        <div class="three">
          @for (s of steps; track s.n) {
            <div class="three-i"><span class="n">{{ s.n }}</span><div><strong>{{ s.title }}</strong><span class="chip">{{ s.ref }}</span></div></div>
          }
        </div>
      </div>
    } @else {
      @let x = a()!;
      @if (!isLatest()) {
        <vc-callout tone="info" icon="history" class="mb">
          You're looking at version {{ x.version }} ({{ x.status }}). It can't be changed.
          <button class="linkbtn" (click)="viewVersion(latest()!)">Back to the latest version</button>
        </vc-callout>
      }

      <div class="layout">
        <div class="main">
          <!-- stepper -->
          <nav class="stepper" aria-label="Assessment steps">
            @for (s of steps; track s.n) {
              <button type="button" class="st" [class.on]="step() === s.n" (click)="step.set(s.n)" [attr.aria-current]="step() === s.n ? 'step' : null">
                <span class="st-ic" [class]="'s-' + stepStatus(s.code)">
                  @switch (stepStatus(s.code)) {
                    @case ('pass') { <vc-icon name="check" [size]="14" [stroke]="2.5" /> }
                    @case ('fail') { <vc-icon name="x" [size]="14" [stroke]="2.5" /> }
                    @default { {{ s.n }} }
                  }
                </span>
                <span class="st-t"><strong>{{ s.title }}</strong><small>{{ s.short }}</small></span>
              </button>
              @if (s.n < 3) { <span class="st-bar" aria-hidden="true"></span> }
            }
          </nav>

          @if (stepResult(steps[step() - 1].code); as sr) {
            @if (sr.status !== 'pass') {
              <vc-callout [tone]="sr.status === 'fail' ? 'danger' : 'warn'" [icon]="sr.status === 'fail' ? 'circle-x' : 'circle-alert'" class="mb">
                <strong>{{ sr.status === 'fail' ? 'This step fails' : 'Still to do' }}.</strong> {{ sr.status === 'incomplete' && sr.details.problems?.length ? '' : sr.message }}
                @if (sr.details.problems?.length) {
                  <ul class="probs">@for (p of sr.details.problems!; track $index) { <li>{{ p }}</li> }</ul>
                }
              </vc-callout>
            }
          }

          @switch (step()) {
            <!-- ============ STEP 1 ============ -->
            @case (1) {
              <section class="card">
                <div class="card-head">
                  <h3>Step 1 · Regulatory surplus</h3><span class="chip">VCS Standard · VM0042 §7</span>
                </div>
                <div class="card-body stack">
                  <p class="lead">The practices must not be required by any law, regulation or court order that is enforced in the project area. If a law requires them but isn't enforced, say so and show evidence.</p>
                  <div class="field">
                    <label>Is any of the project's practices required by law or regulation?</label>
                    <div class="seg">
                      <label class="opt" [class.on]="f().regulatory_surplus.legally_required === false">
                        <input type="radio" name="lr" [disabled]="ro()" [checked]="f().regulatory_surplus.legally_required === false" (change)="setLegal(false)" />
                        <vc-icon name="circle-check" [size]="16" /><span><strong>No</strong><small>Not required by any law or regulation</small></span>
                      </label>
                      <label class="opt bad" [class.on]="f().regulatory_surplus.legally_required === true">
                        <input type="radio" name="lr" [disabled]="ro()" [checked]="f().regulatory_surplus.legally_required === true" (change)="setLegal(true)" />
                        <vc-icon name="gavel" [size]="16" /><span><strong>Yes</strong><small>At least one practice is legally required</small></span>
                      </label>
                    </div>
                    @if (f().regulatory_surplus.legally_required === true) {
                      <span class="error">A legally required practice isn't regulatory surplus, so the project can't be additional for it.</span>
                    }
                  </div>
                  <div class="field">
                    <label for="rs-st">Statement</label>
                    <textarea id="rs-st" class="input" rows="6" [readonly]="ro()" [(ngModel)]="f().regulatory_surplus.statement" (ngModelChange)="touch()"
                      placeholder="e.g. We reviewed the state's agriculture, water and soil conservation acts and the central schemes that apply in the project districts. None of them mandates reduced tillage, cover cropping or residue retention on private farmland…"></textarea>
                    <span class="hint" [class.warnt]="len(f().regulatory_surplus.statement) < 20">
                      {{ len(f().regulatory_surplus.statement) }} characters · at least 20. Name the laws you checked and who checked them.
                    </span>
                  </div>
                  <div class="field">
                    <label>Evidence</label>
                    <vc-evidence [(ids)]="f().regulatory_surplus.evidence_ids" (idsChange)="touch()" [readonly]="ro()" [entityId]="x.id" addLabel="Attach legal review" />
                    <span class="hint">A legal review, a letter from the relevant department, or an extract of the regulation.</span>
                  </div>
                </div>
                <div class="card-foot"><span class="spacer"></span><button class="btn btn-secondary" (click)="step.set(2)">Next: barriers<vc-icon name="arrow-right" /></button></div>
              </section>
            }

            <!-- ============ STEP 2 ============ -->
            @case (2) {
              <section class="card">
                <div class="card-head">
                  <h3>Step 2 · Barrier analysis</h3><span class="chip">VT0008 Step 2</span>
                  @if (!ro()) { <button class="btn btn-secondary btn-sm" (click)="addBarrier()"><vc-icon name="plus" />Add barrier</button> }
                </div>
                <div class="card-body stack">
                  <p class="lead">List the barriers that would stop farmers adopting the practices without the project's carbon revenue and support. At least one documented barrier is needed.</p>
                  @for (b of f().barriers; track $index; let i = $index) {
                    <div class="row-card" [class.bad]="barrierProblem(i)">
                      <div class="rc-head">
                        <span class="rc-n">{{ i + 1 }}</span>
                        <select class="input type" [disabled]="ro()" [(ngModel)]="b.type" (ngModelChange)="touch()" [attr.aria-label]="'Barrier ' + (i + 1) + ' type'">
                          @for (t of rules()?.barrier_types ?? []; track t) { <option [value]="t">{{ barrierLabel(t) }}</option> }
                        </select>
                        <span class="hint grow">{{ barrierHint(b.type) }}</span>
                        @if (!ro()) { <button class="btn btn-ghost btn-sm btn-icon" (click)="removeBarrier(i)" [attr.aria-label]="'Remove barrier ' + (i + 1)"><vc-icon name="trash" [size]="15" /></button> }
                      </div>
                      <textarea class="input" rows="3" [readonly]="ro()" [(ngModel)]="b.description" (ngModelChange)="touch()"
                        placeholder="What the barrier is, who it affects and how the project helps overcome it."></textarea>
                      <div class="rc-foot">
                        <vc-evidence [(ids)]="b.evidence_ids" (idsChange)="touch()" [readonly]="ro()" [entityId]="x.id" />
                        <span class="spacer"></span>
                        <span class="hint" [class.warnt]="len(b.description) < 20">{{ len(b.description) }} / 20+ characters</span>
                      </div>
                    </div>
                  } @empty {
                    <vc-empty icon="fence" title="No barriers yet" text="Investment, technological, institutional or other barriers — each with evidence.">
                      @if (!ro()) { <button class="btn btn-primary btn-sm" (click)="addBarrier()"><vc-icon name="plus" />Add barrier</button> }
                    </vc-empty>
                  }
                </div>
                <div class="card-foot">
                  <button class="btn btn-ghost" (click)="step.set(1)"><vc-icon name="arrow-left" />Back</button><span class="spacer"></span>
                  <button class="btn btn-secondary" (click)="step.set(3)">Next: common practice<vc-icon name="arrow-right" /></button>
                </div>
              </section>
            }

            <!-- ============ STEP 3 ============ -->
            @case (3) {
              <section class="card">
                <div class="card-head">
                  <h3>Step 3 · Common practice</h3><span class="chip">VM0042 §7 p.18</span>
                  @if (!ro()) { <button class="btn btn-secondary btn-sm" (click)="addPractice()"><vc-icon name="plus" />Add practice</button> }
                </div>
                <div class="card-body stack">
                  <p class="lead">
                    For each practice (or stack of practices) give its adoption rate in the region — normally the state. It must be below
                    <strong>{{ thr() }} %</strong>. If it is {{ thr() }} % or more, or nobody knows, show an essential distinction instead (Step 3.2).
                  </p>
                  @for (p of f().common_practice; track $index; let i = $index) {
                    @let pr = practiceResult(i);
                    <div class="row-card">
                      <div class="rc-head">
                        <span class="rc-n">{{ i + 1 }}</span>
                        <strong class="grow">{{ p.practice || 'New practice' }}@if (p.region) { <span class="muted"> · {{ p.region }}</span> }</strong>
                        @if (pr) { <vc-badge [status]="pr.status === 'pass' ? 'ok' : pr.status === 'fail' ? 'failed' : 'pending'">{{ pr.status === 'pass' ? 'Not common practice' : pr.status === 'fail' ? 'Common practice' : 'Incomplete' }}</vc-badge> }
                        @if (!ro()) { <button class="btn btn-ghost btn-sm btn-icon" (click)="removePractice(i)" [attr.aria-label]="'Remove practice ' + (i + 1)"><vc-icon name="trash" [size]="15" /></button> }
                      </div>
                      <div class="form-grid g3">
                        <div class="field">
                          <label>Practice or stack</label>
                          <input class="input" [readonly]="ro()" [(ngModel)]="p.practice" (ngModelChange)="touch()" placeholder="e.g. Reduced tillage + cover crops" />
                        </div>
                        <div class="field">
                          <label>Region (state or province)</label>
                          <input class="input" [readonly]="ro()" [(ngModel)]="p.region" (ngModelChange)="touch()" placeholder="e.g. Karnataka" />
                        </div>
                        <div class="field">
                          <label>Adoption rate</label>
                          <div class="pct">
                            <input class="input num" type="number" min="0" max="100" step="0.1" [readonly]="ro() || p.unknown" [(ngModel)]="p.adoption_pct" (ngModelChange)="touch()" placeholder="—" />
                            <span class="unit">% of farmland</span>
                          </div>
                          <label class="checkbox small"><input type="checkbox" [disabled]="ro()" [(ngModel)]="p.unknown" (ngModelChange)="setUnknown(p)" />Unknown</label>
                        </div>
                      </div>

                      @if (p.adoption_pct !== null && !p.unknown) {
                        <div class="gauge">
                          <div class="g-track"><span class="g-fill" [class.over]="p.adoption_pct >= thr()" [style.width.%]="min(p.adoption_pct, 100)"></span><span class="g-thr" [style.left.%]="thr()"><em>{{ thr() }} %</em></span></div>
                          <span class="small" [class.bad-t]="p.adoption_pct >= thr()">{{ p.adoption_pct >= thr() ? 'At or above the threshold — Step 3.2 applies.' : 'Below the threshold.' }}</span>
                        </div>
                        <div class="src">
                          <div class="field">
                            <label>Source of the adoption rate</label>
                            <select class="input" [disabled]="ro()" [(ngModel)]="p.source_type" (ngModelChange)="touch()">
                              <option [ngValue]="null">Choose a source…</option>
                              @for (s of rules()?.source_types ?? []; track s) { <option [ngValue]="s">{{ sourceLabel(s) }}</option> }
                            </select>
                            @if (p.source_type) { <span class="hint">{{ sourceHint(p.source_type) }}</span> }
                          </div>
                          @if (p.source_type === 'expert_attestation') {
                            <div class="form-grid">
                              <div class="field"><label>Expert's name</label><input class="input" [readonly]="ro()" [(ngModel)]="p.expert.name" (ngModelChange)="touch()" /></div>
                              <div class="field"><label>Signed attestation</label>
                                <vc-evidence [ids]="p.expert.attestation_evidence_id ? [p.expert.attestation_evidence_id] : []" (idsChange)="p.expert.attestation_evidence_id = $event[0] ?? null; touch()"
                                  [single]="true" [readonly]="ro()" [entityId]="x.id" addLabel="Attach signed attestation" /></div>
                              <div class="field span-2"><label>Qualifications</label><textarea class="input" rows="2" [readonly]="ro()" [(ngModel)]="p.expert.qualifications" (ngModelChange)="touch()" placeholder="Degree, years of local experience, affiliation, independence from the project."></textarea></div>
                              <div class="field span-2"><label>Method used to estimate adoption</label><textarea class="input" rows="2" [readonly]="ro()" [(ngModel)]="p.expert.method" (ngModelChange)="touch()" placeholder="e.g. Survey of 40 villages across 6 districts, cross-checked with input-dealer sales."></textarea></div>
                            </div>
                          } @else if (p.source_type) {
                            <div class="form-grid">
                              <div class="field span-2"><label>Reference or link</label><input class="input" [readonly]="ro()" [(ngModel)]="p.source_reference" (ngModelChange)="touch()" placeholder="Citation, report title and year, or a URL" /></div>
                              <div class="field span-2"><label>Source document</label><vc-evidence [(ids)]="p.evidence_ids" (idsChange)="touch()" [readonly]="ro()" [entityId]="x.id" addLabel="Attach source" /></div>
                            </div>
                          }
                        </div>
                      }

                      @if (needs32(p)) {
                        @let fp = fPct(p);
                        <div class="s32">
                          <div class="s32-h">
                            <vc-icon name="combine" [size]="16" />
                            <strong>Step 3.2 · Essential distinction</strong>
                            <span class="chip">VT0008 Step 4c</span>
                            <span class="spacer"></span>
                            <span class="small muted">{{ p.unknown || p.adoption_pct === null ? 'Adoption rate unknown' : 'Adoption ' + p.adoption_pct + ' % ≥ ' + thr() + ' %' }}</span>
                          </div>
                          <p class="small muted">Describe what makes the project's practice essentially different from what others already do (e.g. a different technology, input or management system). Then compare land areas: N<sub>all</sub> is all land in the region using a similar practice; N<sub>diff</sub> is the part of it that uses the essentially different practice.</p>
                          <div class="field">
                            <label>Essential distinction</label>
                            <textarea class="input" rows="3" [readonly]="ro()" [(ngModel)]="p.essential_distinction.description" (ngModelChange)="touch()" placeholder="e.g. Project fields use roller-crimped multi-species cover crops with no herbicide burndown, unlike the conventional reduced-tillage in the district."></textarea>
                          </div>
                          <div class="nrow">
                            <div class="field"><label>N<sub>all</sub></label><div class="pct"><input class="input num" type="number" min="0" [readonly]="ro()" [(ngModel)]="p.essential_distinction.n_all_ha" (ngModelChange)="touch()" /><span class="unit">ha</span></div></div>
                            <div class="field"><label>N<sub>diff</sub></label><div class="pct"><input class="input num" type="number" min="0" [readonly]="ro()" [(ngModel)]="p.essential_distinction.n_diff_ha" (ngModelChange)="touch()" /><span class="unit">ha</span></div></div>
                            <div class="fbox" [class]="fp === null ? 'f-na' : fp < thr() ? 'f-ok' : 'f-bad'">
                              <span class="f-l">F = 1 − N<sub>diff</sub> / N<sub>all</sub></span>
                              <span class="f-v num">{{ fp === null ? '—' : (fp | num: 1) }}<small> %</small></span>
                              <span class="f-s">
                                @if (fp === null) { Enter both areas (N<sub>diff</sub> ≤ N<sub>all</sub>) }
                                @else if (fp < thr()) { <vc-icon name="circle-check" [size]="13" />Below {{ thr() }} % — not common practice }
                                @else { <vc-icon name="circle-x" [size]="13" />Not below {{ thr() }} % — common practice }
                              </span>
                            </div>
                          </div>
                          <div class="field"><label>Evidence for the areas</label><vc-evidence [(ids)]="p.essential_distinction.evidence_ids" (idsChange)="touch()" [readonly]="ro()" [entityId]="x.id" /></div>
                          <p class="note"><vc-icon name="info" [size]="13" /><span>Measured on land area. The VT0008 rule “N<sub>all</sub> − N<sub>diff</sub> &gt; 3” does not apply under VM0042 §7.</span></p>
                        </div>
                      }

                      @if (pr?.problems?.length) {
                        <ul class="probs inl">@for (m of pr!.problems!; track $index) { <li>{{ m }}</li> }</ul>
                      } @else if (pr?.message) {
                        <p class="small muted res">{{ pr!.message }}</p>
                      }
                    </div>
                  } @empty {
                    <vc-empty icon="percent" title="No practices yet" text="Add each practice the project introduces — or the stack of practices farmers adopt together.">
                      @if (!ro()) { <button class="btn btn-primary btn-sm" (click)="addPractice()"><vc-icon name="plus" />Add practice</button> }
                    </vc-empty>
                  }
                </div>
                <div class="card-foot">
                  <button class="btn btn-ghost" (click)="step.set(2)"><vc-icon name="arrow-left" />Back</button><span class="spacer"></span>
                  @if (x.status === 'draft' && canWrite() && isLatest()) {
                    <button class="btn btn-secondary" [disabled]="saving() || !dirty()" (click)="save()">{{ dirty() ? 'Save draft' : 'Saved' }}</button>
                    <button class="btn btn-primary" (click)="review.set('submit')"><vc-icon name="send" />Submit for approval</button>
                  }
                </div>
              </section>
            }
          }
        </div>

        <!-- ============ RAIL ============ -->
        <aside class="rail">
          @let r = result();
          <section class="card verdict" [class]="'v-' + verdict()">
            <div class="v-top">
              <span class="v-ic"><vc-icon [name]="verdict() === 'yes' ? 'check-circle' : verdict() === 'no' ? 'x-circle' : 'circle-dashed'" [size]="26" /></span>
              <div>
                <div class="v-t">{{ verdict() === 'yes' ? 'Additional' : verdict() === 'no' ? 'Not additional' : 'Not yet complete' }}</div>
                <div class="v-s">
                  {{ x.status === 'draft' ? 'Live check of the saved draft' : 'Result frozen when submitted' }}
                  @if (dirty()) { · <strong>unsaved changes</strong> }
                </div>
              </div>
              <vc-dc cls="CALCULATED" />
            </div>
            @if (r) {
              <ul class="v-steps">
                @for (s of r.steps; track s.code; let i = $index) {
                  <li>
                    <button type="button" (click)="step.set(i + 1)">
                      <vc-icon [name]="s.status === 'pass' ? 'circle-check' : s.status === 'fail' ? 'circle-x' : 'circle-dashed'" [size]="16" [class]="'c-' + s.status" />
                      <span><strong>{{ steps[i].title }}</strong><small>{{ s.message }}</small></span>
                    </button>
                  </li>
                }
              </ul>
              @if (verdict() === 'yes') { <p class="v-r">{{ r.reasons[0] }}</p> }
            }
            <div class="v-ref"><span class="chip">{{ rules()?.reference ?? 'VM0042 v2.2 §7 p.17–19' }}</span></div>
          </section>

          <section class="card">
            <div class="card-head"><h3>Version {{ x.version }}</h3><vc-badge [status]="x.status" /></div>
            <div class="card-body">
              <dl class="kv">
                <dt>Prepared by</dt><dd>{{ who(x.created_by) }}<span class="subtle small"> · {{ x.created_at | day }}</span></dd>
                <dt>Submitted by</dt><dd>@if (x.submitted_by) { {{ who(x.submitted_by) }}<span class="subtle small"> · {{ x.submitted_at | day }}</span> } @else { <span class="subtle">Not yet</span> }</dd>
                <dt>{{ x.status === 'rejected' ? 'Rejected' : 'Approved by' }}</dt>
                <dd>@if (x.approved_by) { {{ who(x.approved_by) }}<span class="subtle small"> · {{ x.approved_at | day }}</span> } @else if (x.status === 'rejected') { <span class="bad-t">Returned for changes</span> } @else { <span class="subtle">Not yet</span> }</dd>
                @if (x.review_note) { <dt>Reviewer's note</dt><dd class="note-q">{{ x.review_note }}</dd> }
              </dl>
              @if (x.status === 'submitted' && canApprove() && selfAuthored()) {
                <vc-callout tone="warn" icon="user-check" class="mt">You prepared or submitted this version, so another person must approve it (four-eyes rule).</vc-callout>
              } @else if (x.status === 'submitted' && !canApprove()) {
                <p class="small muted mt">Waiting for a methodology approver. The person who prepared it can't approve it.</p>
              }
            </div>
          </section>

          <section class="card">
            <div class="card-head"><h3>Version history</h3></div>
            @if (versionsErr()) {
              <div class="card-body"><vc-error title="Couldn't load versions" [message]="versionsErr()!" /></div>
            } @else if (!versions().length) {
              <vc-loading [rows]="2" />
            } @else {
              <ul class="vers">
                @for (v of versions(); track v.id) {
                  <li><button type="button" [class.on]="v.id === x.id" (click)="viewVersion(v)">
                    <span class="vn">v{{ v.version }}</span>
                    <span class="vt"><span>{{ who(v.created_by) }}</span><small>{{ v.updated_at | day }}</small></span>
                    @if (v.result && v.result.additional !== undefined && v.status !== 'draft') {
                      <vc-icon [name]="v.result.additional ? 'circle-check' : 'circle-x'" [size]="15" [class]="v.result.additional ? 'c-pass' : 'c-fail'" />
                    }
                    <vc-badge [status]="v.status" />
                  </button></li>
                }
              </ul>
            }
          </section>
        </aside>
      </div>
    }

    <!-- ============ CONFIRM / REVIEW ============ -->
    <vc-modal [open]="review() !== null" (closed)="review.set(null)" [title]="reviewTitle()" width="520px">
      <div class="stack" style="--gap:14px">
        @switch (review()) {
          @case ('submit') {
            <p>Version {{ a()?.version }} will be locked and sent for approval. The result is frozen at this point. You can't approve it yourself.</p>
            @if (dirty()) { <vc-callout tone="info" icon="info">Your unsaved changes will be saved first.</vc-callout> }
            @if (verdict() !== 'yes' && !dirty()) {
              <vc-callout [tone]="verdict() === 'no' ? 'danger' : 'warn'" icon="circle-alert">
                {{ verdict() === 'no' ? 'The current result is "not additional". You can still submit it so the decision is recorded.' : 'Some steps are incomplete, so the submission will be refused until they are finished.' }}
              </vc-callout>
            }
          }
          @case ('approve') {
            <p>Approving version {{ a()?.version }} makes it the project's additionality demonstration of record. Any earlier approved version is marked superseded.</p>
            <dl class="kv"><dt>Prepared by</dt><dd>{{ who(a()?.created_by ?? null) }}</dd><dt>Submitted by</dt><dd>{{ who(a()?.submitted_by ?? null) }}</dd><dt>Result</dt><dd>{{ a()?.result?.additional ? 'Additional' : 'Not additional' }}</dd></dl>
            @if (selfAuthored()) { <vc-callout tone="warn" icon="user-check">You created or submitted this, so another person must approve it.</vc-callout> }
            <div class="field"><label for="rv-n">Note <span class="subtle">(optional)</span></label><textarea id="rv-n" class="input" rows="3" [(ngModel)]="note"></textarea></div>
          }
          @case ('reject') {
            <p>Version {{ a()?.version }} goes back as rejected. The author starts a new version to fix it.</p>
            <div class="field"><label for="rv-r">Reason</label><textarea id="rv-r" class="input" rows="4" [(ngModel)]="note" placeholder="What needs to change before it can be approved."></textarea>
              <span class="hint">At least 5 characters. Kept in the audit log.</span></div>
          }
          @case ('new') {
            <p>Start version {{ (latest()?.version ?? 0) + 1 }} as a copy of version {{ latest()?.version }}. Version {{ latest()?.version }} stays as it is.</p>
          }
        }
        @if (reviewErr()) {
          <vc-error [title]="reviewErrCode() === 'SELF_APPROVAL_REJECTED' ? 'Another person must approve this' : 'That didn’t work'" [message]="reviewErrMsg()" />
        }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="review.set(null)">Cancel</button>
        <button class="btn" [class.btn-danger]="review() === 'reject'" [class.btn-primary]="review() !== 'reject'"
          [disabled]="busy() || (review() === 'reject' && note.trim().length < 5)" (click)="confirmReview()">
          {{ busy() ? 'Working…' : reviewCta() }}
        </button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .chip{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);
      font:500 11px/1 var(--mono);color:var(--stone-600);white-space:nowrap}
    .mb{margin-bottom:16px;display:flex} .mt{margin-top:14px;display:flex}
    .hdr-actions{display:flex;gap:8px;flex-wrap:wrap}
    .linkbtn{border:0;background:none;padding:0;margin-left:6px;font:inherit;font-weight:600;color:var(--forest-700);cursor:pointer;text-decoration:underline}
    .start .three{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border)}
    .three-i{display:flex;gap:12px;align-items:flex-start;padding:18px 20px;background:var(--surface-2)}
    .three-i .n{display:grid;place-items:center;flex:none;width:26px;height:26px;border-radius:50%;background:var(--forest-100);color:var(--forest-700);font-weight:600;font-size:13px}
    .three-i div{display:flex;flex-direction:column;gap:6px;align-items:flex-start}
    .layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:20px;align-items:start}
    .main{min-width:0}
    .rail{display:flex;flex-direction:column;gap:16px;position:sticky;top:calc(var(--topbar-h) + 16px)}
    .stepper{display:flex;align-items:center;gap:0;margin-bottom:16px;padding:6px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-sm)}
    .st{flex:1;display:flex;align-items:center;gap:10px;min-width:0;padding:10px 12px;border:0;border-radius:var(--radius-sm);background:none;font:inherit;text-align:left;cursor:pointer;color:var(--stone-700)}
    .st:hover{background:var(--surface-2)}
    .st.on{background:var(--forest-50);color:var(--forest-800)}
    .st-ic{display:grid;place-items:center;flex:none;width:26px;height:26px;border-radius:50%;border:1.5px solid var(--stone-300);font-size:12.5px;font-weight:600;color:var(--stone-600);background:var(--surface)}
    .st.on .st-ic{border-color:var(--forest-600);color:var(--forest-700)}
    .st .st-ic.s-pass{background:var(--forest-600);border-color:var(--forest-600);color:#fff}
    .st .st-ic.s-fail{background:var(--red-600);border-color:var(--red-600);color:#fff}
    .st-t{display:flex;flex-direction:column;min-width:0}
    .st-t strong{font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .st-t small{font-size:12px;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .st-bar{flex:none;width:18px;height:1.5px;background:var(--border-strong)}
    .lead{color:var(--stone-700);max-width:720px;line-height:1.55}
    .seg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .opt{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);cursor:pointer;color:var(--stone-500)}
    .opt input{position:absolute;opacity:0;pointer-events:none}
    .opt span{display:flex;flex-direction:column;gap:2px;color:var(--stone-800)} .opt small{color:var(--text-3);font-size:12px}
    .opt.on{border-color:var(--forest-500);background:var(--forest-50);color:var(--forest-600);box-shadow:0 0 0 1px var(--forest-500) inset}
    .opt.bad.on{border-color:var(--red-600);background:var(--danger-soft);color:var(--red-600);box-shadow:0 0 0 1px var(--red-600) inset}
    .opt:focus-within{box-shadow:var(--focus)}
    .warnt{color:var(--amber-600)!important} .bad-t{color:var(--red-600)}
    .row-card{border:1px solid var(--border);border-radius:var(--radius);padding:14px;display:flex;flex-direction:column;gap:12px;background:var(--surface)}
    .row-card.bad{border-color:#f1dcae}
    .rc-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .rc-n{display:grid;place-items:center;flex:none;width:24px;height:24px;border-radius:6px;background:var(--sand-200);font-size:12px;font-weight:600;color:var(--stone-700)}
    .rc-head .type{width:180px}
    .grow{flex:1;min-width:0}
    .rc-foot{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .form-grid.g3{grid-template-columns:2fr 1.3fr 1fr}
    .pct{position:relative;display:flex;align-items:center}
    .pct .input{padding-right:92px;text-align:right}
    .pct .unit{position:absolute;right:10px;font-size:12px;color:var(--text-3);pointer-events:none}
    .nrow .pct .input{padding-right:34px}
    .gauge{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
    .g-track{position:relative;flex:1;min-width:200px;max-width:420px;height:8px;border-radius:4px;background:var(--sand-200)}
    .g-fill{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--forest-500)}
    .g-fill.over{background:var(--amber-600)}
    .g-thr{position:absolute;top:-4px;bottom:-4px;width:2px;background:var(--stone-700)}
    .g-thr em{position:absolute;top:14px;left:50%;transform:translateX(-50%);font:500 10.5px var(--mono);font-style:normal;color:var(--stone-600);white-space:nowrap}
    .src{display:flex;flex-direction:column;gap:12px;padding-top:12px;margin-top:4px}
    .src > .field{max-width:420px}
    .s32{border:1px solid #f1dcae;background:linear-gradient(0deg,var(--surface),var(--warn-soft));border-radius:var(--radius-sm);padding:14px;display:flex;flex-direction:column;gap:12px}
    .s32-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:var(--amber-600)} .s32-h strong{color:var(--stone-900)}
    .nrow{display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:14px;align-items:end}
    .fbox{display:flex;flex-direction:column;gap:2px;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface)}
    .f-l{font-size:12px;color:var(--text-2)} .f-v{font-size:24px;font-weight:600;letter-spacing:-.02em;line-height:1.15} .f-v small{font-size:13px;color:var(--text-3)}
    .f-s{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--text-3)}
    .fbox.f-ok{border-color:#cfe2d4;background:var(--ok-soft)} .fbox.f-ok .f-s{color:var(--forest-700)}
    .fbox.f-bad{border-color:#f3c7c3;background:var(--danger-soft)} .fbox.f-bad .f-s{color:var(--red-600)}
    .note{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-3)}
    .probs{margin:6px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:3px}
    .probs.inl{margin:0;font-size:12.5px;color:var(--amber-600)}
    .res{margin:0}
    .verdict{overflow:hidden}
    .v-top{display:flex;gap:12px;align-items:flex-start;padding:18px 18px 14px}
    .v-top > div{flex:1}
    .v-ic{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;flex:none}
    .v-t{font-size:18px;font-weight:600;letter-spacing:-.01em;color:var(--stone-900)}
    .v-s{font-size:12px;color:var(--text-3);margin-top:2px}
    .v-yes{border-color:#cfe2d4} .v-yes .v-top{background:var(--ok-soft)} .v-yes .v-ic{background:var(--forest-600);color:#fff}
    .v-no{border-color:#f3c7c3} .v-no .v-top{background:var(--danger-soft)} .v-no .v-ic{background:var(--red-600);color:#fff}
    .v-open .v-top{background:var(--surface-2)} .v-open .v-ic{background:var(--sand-200);color:var(--stone-600)}
    .v-steps{list-style:none;margin:0;padding:6px 8px;border-top:1px solid var(--border)}
    .v-steps button{display:flex;gap:10px;align-items:flex-start;width:100%;padding:8px 10px;border:0;border-radius:var(--radius-sm);background:none;font:inherit;text-align:left;cursor:pointer}
    .v-steps button:hover{background:var(--surface-2)}
    .v-steps vc-icon{margin-top:1px;flex:none}
    .v-steps span{display:flex;flex-direction:column;gap:2px;min-width:0} .v-steps strong{font-size:13px} .v-steps small{font-size:12px;color:var(--text-2);line-height:1.4}
    .c-pass{color:var(--forest-600)} .c-fail{color:var(--red-600)} .c-incomplete{color:var(--stone-400)}
    .v-r{margin:0;padding:0 18px 10px;font-size:12.5px;color:var(--forest-700)}
    .v-ref{padding:10px 18px 14px;border-top:1px solid var(--border)}
    .v-ref .chip{white-space:normal;height:auto;padding:4px 7px;line-height:1.4;width:auto}
    .kv{margin:0}
    .note-q{font-style:italic;color:var(--stone-700)}
    .vers{list-style:none;margin:0;padding:6px}
    .vers button{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:0;border-radius:var(--radius-sm);background:none;font:inherit;text-align:left;cursor:pointer}
    .vers button:hover{background:var(--surface-2)} .vers button.on{background:var(--forest-50)}
    .vn{font:600 12px var(--mono);color:var(--stone-700);width:28px}
    .vt{flex:1;display:flex;flex-direction:column;min-width:0;font-size:13px} .vt small{font-size:11.5px;color:var(--text-3)}
    @media (max-width: 1100px){
      .layout{grid-template-columns:1fr}
      .rail{position:static;display:grid;grid-template-columns:1fr 1fr}
      .rail .verdict{grid-column:1/-1}
    }
    @media (max-width: 900px){
      .st-t small{display:none}
      .form-grid.g3{grid-template-columns:1fr 1fr} .form-grid.g3 .field:first-child{grid-column:1/-1}
      .nrow{grid-template-columns:1fr 1fr} .nrow .fbox{grid-column:1/-1}
      .start .three{grid-template-columns:1fr}
    }
    @media (max-width: 720px){ .rail{grid-template-columns:1fr} .seg{grid-template-columns:1fr} .st-bar{display:none} }
  `],
})
export class AdditionalityPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  ctx = inject(ProjectContext);

  steps = STEP_META;
  loading = signal(true);
  error = signal<string | null>(null);
  latest = signal<Assessment | null>(null);
  a = signal<Assessment | null>(null);
  versions = signal<Assessment[]>([]);
  versionsErr = signal<string | null>(null);
  rules = signal<AdditionalityRules | null>(null);
  users = signal<Map<string, UserLite>>(new Map());
  f = signal<FormModel>(this.toForm(null));
  step = signal<number>(1);
  dirty = signal(false);
  saving = signal(false);
  busy = signal(false);
  review = signal<Review>(null);
  reviewErr = signal<ApiError | null>(null);
  note = '';

  canWrite = computed(() => this.auth.can('programmes.manage'));
  canApprove = computed(() => this.auth.can('rules.approve'));
  isLatest = computed(() => !!this.a() && this.a()!.id === this.latest()?.id);
  ro = computed(() => !this.canWrite() || this.a()?.status !== 'draft' || !this.isLatest());
  result = computed<AssessmentResult | null>(() => {
    const r = this.a()?.result as AssessmentResult | undefined;
    return r && Array.isArray(r.steps) ? r : null;
  });
  verdict = computed<'yes' | 'no' | 'open'>(() => {
    const r = this.result();
    if (!r) return 'open';
    if (r.additional) return 'yes';
    return r.complete || r.steps.some(s => s.status === 'fail') ? 'no' : 'open';
  });
  thr = computed(() => this.rules()?.common_practice_threshold_pct ?? 20);
  selfAuthored = computed(() => {
    const me = this.auth.profile()?.id;
    const x = this.a();
    return !!me && !!x && (x.created_by === me || x.submitted_by === me);
  });
  reviewErrCode = computed(() => this.reviewErr()?.code ?? '');
  reviewErrMsg = computed(() => {
    const e = this.reviewErr();
    if (!e) return '';
    if (e.code === 'SELF_APPROVAL_REJECTED') return 'You created, edited or submitted this version, so another person must approve it. This four-eyes rule keeps every approval independent.';
    return e.message;
  });

  constructor() {
    const s = Number(this.route.snapshot.queryParamMap.get('step'));
    if (s >= 1 && s <= 3) this.step.set(s);
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
    if (!this.rules()) this.api.get<AdditionalityRules>(`/projects/${pid}/additionality/rules`).subscribe({ next: r => this.rules.set(r), error: () => {} });
    this.api.get<Assessment>(`/projects/${pid}/additionality`).subscribe({
      next: x => { this.setLatest(x); this.loading.set(false); this.loadVersions(); },
      error: (e: ApiError) => {
        this.loading.set(false);
        if (e.status === 404 && e.code === 'NOT_FOUND') { this.latest.set(null); this.a.set(null); this.versions.set([]); }
        else this.error.set(e.message);
      },
    });
  }

  private loadVersions() {
    const pid = this.ctx.currentId();
    this.versionsErr.set(null);
    this.api.get<Assessment[]>(`/projects/${pid}/additionality/versions`).subscribe({
      next: v => this.versions.set(v),
      error: (e: ApiError) => this.versionsErr.set(e.message),
    });
  }

  private setLatest(x: Assessment) {
    this.latest.set(x);
    this.show(x);
  }

  private show(x: Assessment) {
    this.a.set(x);
    this.f.set(this.toForm(x));
    this.dirty.set(false);
  }

  viewVersion(v: Assessment) {
    if (this.dirty()) { this.toast.info('Save your draft first', 'You have unsaved changes on this version.'); return; }
    const pid = this.ctx.currentId();
    if (v.id === this.latest()?.id) { this.show(this.latest()!); return; }
    this.api.get<Assessment>(`/projects/${pid}/additionality/${v.id}`).subscribe({
      next: x => this.show(x),
      error: (e: ApiError) => this.toast.apiError(e, "Couldn't open that version"),
    });
  }

  /* ---------------------------------------------------------------- form helpers */
  private toForm(x: Assessment | null): FormModel {
    const rs = x?.regulatory_surplus ?? {};
    return {
      regulatory_surplus: { statement: rs.statement ?? '', legally_required: rs.legally_required ?? null, evidence_ids: [...(rs.evidence_ids ?? [])] },
      barriers: (x?.barriers ?? []).map(b => ({ type: b.type, description: b.description ?? '', evidence_ids: [...(b.evidence_ids ?? [])] })),
      common_practice: (x?.common_practice ?? []).map(p => this.row(p)),
    };
  }

  private row(p?: Partial<Practice>): PracticeRow {
    const ed = p?.essential_distinction;
    const ex = p?.expert;
    return {
      practice: p?.practice ?? '', region: p?.region ?? '', adoption_pct: p?.adoption_pct ?? null,
      unknown: !!p && p.adoption_pct === null, source_type: p?.source_type ?? null, source_reference: p?.source_reference ?? '',
      evidence_ids: [...(p?.evidence_ids ?? [])],
      expert: { name: ex?.name ?? '', qualifications: ex?.qualifications ?? '', method: ex?.method ?? '', attestation_evidence_id: ex?.attestation_evidence_id ?? null },
      essential_distinction: { n_all_ha: ed?.n_all_ha ?? null, n_diff_ha: ed?.n_diff_ha ?? null, description: ed?.description ?? '', evidence_ids: [...(ed?.evidence_ids ?? [])] },
    };
  }

  private payload() {
    const f = this.f();
    const num = (v: unknown) => (v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Number(v));
    return {
      regulatory_surplus: { ...f.regulatory_surplus, statement: f.regulatory_surplus.statement.trim() },
      barriers: f.barriers.map(b => ({ type: b.type, description: b.description.trim(), evidence_ids: b.evidence_ids })),
      common_practice: f.common_practice.map(p => {
        const adoption = p.unknown ? null : num(p.adoption_pct);
        const ed = p.essential_distinction;
        const hasEd = ed.description.trim() || num(ed.n_all_ha) !== null || num(ed.n_diff_ha) !== null || ed.evidence_ids.length;
        const ex = p.expert;
        return {
          practice: p.practice.trim(), region: p.region.trim(), adoption_pct: adoption,
          source_type: adoption === null ? p.source_type : p.source_type, source_reference: p.source_reference.trim(),
          expert: p.source_type === 'expert_attestation' ? { ...ex, name: ex.name.trim() } : null,
          evidence_ids: p.evidence_ids,
          essential_distinction: hasEd ? { n_all_ha: num(ed.n_all_ha), n_diff_ha: num(ed.n_diff_ha), description: ed.description.trim(), evidence_ids: ed.evidence_ids } : null,
        };
      }),
    };
  }

  touch() { this.dirty.set(true); }
  len(s: string | null | undefined) { return (s ?? '').trim().length; }
  min(a: number, b: number) { return Math.min(Number(a), b); }
  setLegal(v: boolean) { this.f().regulatory_surplus.legally_required = v; this.touch(); }
  setUnknown(p: PracticeRow) { if (p.unknown) p.adoption_pct = null; this.touch(); }
  addBarrier() {
    this.f().barriers.push({ type: this.rules()?.barrier_types[0] ?? 'investment', description: '', evidence_ids: [] });
    this.f.set({ ...this.f() });
    this.touch();
  }
  removeBarrier(i: number) { this.f().barriers.splice(i, 1); this.f.set({ ...this.f() }); this.touch(); }
  addPractice() { this.f().common_practice.push(this.row()); this.f.set({ ...this.f() }); this.touch(); }
  removePractice(i: number) { this.f().common_practice.splice(i, 1); this.f.set({ ...this.f() }); this.touch(); }
  barrierLabel(t: string) { return BARRIER_LABELS[t]?.label ?? t; }
  barrierHint(t: string) { return BARRIER_LABELS[t]?.hint ?? ''; }
  sourceLabel(t: string) { return SOURCE_LABELS[t]?.label ?? t; }
  sourceHint(t: string) { return SOURCE_LABELS[t]?.hint ?? ''; }

  needs32(p: PracticeRow) {
    const v = p.unknown || p.adoption_pct === null || (p.adoption_pct as unknown) === '' ? null : Number(p.adoption_pct);
    return v === null || v >= this.thr();
  }
  fPct(p: PracticeRow): number | null {
    const all = Number(p.essential_distinction.n_all_ha), diff = Number(p.essential_distinction.n_diff_ha);
    if (p.essential_distinction.n_all_ha === null || p.essential_distinction.n_diff_ha === null) return null;
    if (!(all > 0) || diff < 0 || diff > all || Number.isNaN(diff)) return null;
    return Math.round((1 - diff / all) * 100 * 1e6) / 1e6;
  }

  stepResult(code: string): StepResult | null { return this.result()?.steps.find(s => s.code === code) ?? null; }
  stepStatus(code: string): StepStatus | 'none' { return this.stepResult(code)?.status ?? 'none'; }
  barrierProblem(i: number) { return (this.stepResult('barrier_analysis')?.details.problems ?? []).some(p => p.startsWith(`Barrier ${i + 1}:`)); }
  practiceResult(i: number): PracticeResult | null {
    if (this.dirty()) return null;
    return this.stepResult('common_practice')?.details.practices?.[i] ?? null;
  }

  who(id: string | null) {
    if (!id) return '—';
    const u = this.users().get(id);
    return u ? (id === this.auth.profile()?.id ? `${u.full_name} (you)` : u.full_name) : 'Unknown user';
  }

  /* ---------------------------------------------------------------- actions */
  private validate(): string | null {
    const f = this.f();
    const bad = f.common_practice.findIndex(p => p.practice.trim().length < 2);
    if (bad >= 0) { this.step.set(3); return `Name practice ${bad + 1} (at least 2 characters) before saving.`; }
    for (const p of f.common_practice) {
      const v = p.adoption_pct;
      if (!p.unknown && v !== null && (v as unknown) !== '' && (Number(v) < 0 || Number(v) > 100)) { this.step.set(3); return 'Adoption rates must be between 0 and 100 %.'; }
    }
    return null;
  }

  private saveObs(): Observable<Assessment> {
    const x = this.a()!;
    if (!this.dirty()) return of(x);
    return this.api.patch<Assessment>(`/projects/${x.project_id}/additionality/${x.id}`, this.payload());
  }

  save() {
    const msg = this.validate();
    if (msg) { this.toast.error("Can't save yet", msg); return; }
    this.saving.set(true);
    this.saveObs().subscribe({
      next: x => { this.saving.set(false); this.setLatest(x); this.loadVersions(); this.toast.success('Draft saved', 'The result on the right has been re-checked.'); },
      error: (e: ApiError) => { this.saving.set(false); this.toast.apiError(e, "Couldn't save the draft"); },
    });
  }

  start() {
    const pid = this.ctx.currentId();
    this.busy.set(true);
    this.api.post<Assessment>(`/projects/${pid}/additionality`, null).subscribe({
      next: x => { this.busy.set(false); this.review.set(null); this.step.set(1); this.setLatest(x); this.loadVersions(); this.toast.success(`Version ${x.version} started`); },
      error: (e: ApiError) => { this.busy.set(false); this.reviewErr.set(e); if (!this.review()) this.toast.apiError(e, "Couldn't start the assessment"); },
    });
  }

  openReview(kind: Review) { this.note = ''; this.reviewErr.set(null); this.review.set(kind); }

  reviewTitle() {
    return ({ submit: 'Submit for approval', approve: 'Approve additionality', reject: 'Reject this version', new: 'Start a new version' } as Record<string, string>)[this.review() ?? ''] ?? '';
  }
  reviewCta() {
    return ({ submit: 'Submit', approve: 'Approve', reject: 'Reject', new: 'Start version' } as Record<string, string>)[this.review() ?? ''] ?? 'Confirm';
  }

  confirmReview() {
    const kind = this.review();
    const x = this.a();
    if (!kind || !x) return;
    this.reviewErr.set(null);
    if (kind === 'new') { this.start(); return; }
    const base = `/projects/${x.project_id}/additionality/${x.id}`;
    let obs: Observable<Assessment>;
    if (kind === 'submit') {
      const msg = this.validate();
      if (msg) { this.reviewErr.set({ status: 0, code: 'LOCAL', message: msg, details: {} }); return; }
      obs = this.saveObs().pipe(tap(saved => { if (this.dirty()) { this.setLatest(saved); this.loadVersions(); } }), switchMap(() => this.api.post<Assessment>(`${base}/submit`)));
    } else if (kind === 'approve') {
      obs = this.api.post<Assessment>(`${base}/approve`, { note: this.note.trim() });
    } else {
      obs = this.api.post<Assessment>(`${base}/reject`, { note: this.note.trim() });
    }
    this.busy.set(true);
    obs.subscribe({
      next: r => {
        this.busy.set(false);
        this.review.set(null);
        this.setLatest(r);
        this.loadVersions();
        this.toast.success(kind === 'submit' ? 'Submitted for approval' : kind === 'approve' ? `Version ${r.version} approved` : `Version ${r.version} rejected`);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        this.reviewErr.set(e);
      },
    });
  }
}
