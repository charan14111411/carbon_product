import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, Hash, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { EvidenceList } from '../additionality/evidence';
import { ApiProblems, Ref } from '../mrv-shared/ui';
import { POOL_SHORT, Qa1Model, TrueUp, modelLabel, practiceLabel, ver } from './qa1.types';
import { Qa1ModelForm } from './model-form';

/** The organisation's register of QA1 process models (VM0042 §4 condition 4). */
@Component({
  selector: 'vc-qa1-models',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Hash, Modal, EvidenceList, ApiProblems, Ref, Qa1ModelForm, DayPipe, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small intro">A model can be used only after a second person approves it. Approval checks condition 4: public availability,
        peer review, a versioned parameter set, the validation report with its independent assessment, and an unbiased prediction error for every pool and practice in the validation domain.</p>
      @if (canManage()) { <button class="btn btn-primary" (click)="startNew()"><vc-icon name="plus" />Register model</button> }
    </div>

    @if (!models().length) {
      <section class="card">
        <vc-empty icon="cpu" title="No process models registered" text="Register the biogeochemical model your project uses for QA1, with its parameter set and validation report.">
          @if (canManage()) { <button class="btn btn-primary btn-sm" (click)="startNew()"><vc-icon name="plus" />Register model</button> }
        </vc-empty>
      </section>
    } @else {
      <div class="list">
        @for (m of sorted(); track m.id) {
          <article class="card mdl" [class.retired]="m.status === 'retired'">
            <header>
              <span class="ic" [class]="'ic ' + m.status"><vc-icon [name]="m.status === 'approved' ? 'lock' : m.status === 'retired' ? 'archive' : 'pencil'" [size]="16" /></span>
              <div class="t">
                <h3>{{ m.name }} <span class="v">· {{ ver(m.version) }}</span> <span class="rev">&nbsp;rev {{ m.revision }}</span></h3>
                <div class="sub small muted">
                  @for (p of m.pools; track p) { <span class="pool">{{ poolShort[p] }}</span> }
                  <span>{{ m.validation_metrics.length }} prediction error{{ m.validation_metrics.length === 1 ? '' : 's' }}</span>
                  <span>Created by {{ people.name(m.created_by, 'Unknown') }} · {{ m.created_at | day }}</span>
                  @if (m.approved_by) { <span>Approved by {{ people.name(m.approved_by, 'Unknown') }} · {{ m.approved_at | day }}</span> }
                </div>
              </div>
              <vc-dc cls="MODELLED" />
              <vc-badge [status]="m.status" />
            </header>

            <div class="body">
              <div class="dom">
                <div><span class="k">Practices</span>@for (c of m.validation_domain.practice_categories; track c) { <span class="tag">{{ practice(c) }}</span> } @empty { <span class="subtle small">None listed</span> }</div>
                <div><span class="k">Crop groups</span>@for (c of m.validation_domain.crop_functional_groups; track c) { <span class="tag">{{ c }}</span> } @empty { <span class="subtle small">None listed</span> }</div>
                <div><span class="k">Climate</span>@for (c of m.validation_domain.climate_zones; track c) { <span class="tag">{{ c }}</span> } @empty { <span class="subtle small">None listed</span> }</div>
                <div><span class="k">Textures</span>@for (c of m.validation_domain.soil_textures; track c) { <span class="tag">{{ c }}</span> } @empty { <span class="subtle small">None listed</span> }</div>
              </div>

              @if (m.status === 'draft') {
                @if (m.approval_problems.length) {
                  <div class="probs">
                    <div class="ph"><vc-icon name="circle-alert" [size]="15" /><strong>{{ m.approval_problems.length }} thing{{ m.approval_problems.length === 1 ? '' : 's' }} to fix before approval</strong><vc-ref>VM0042 §4 cond. 4 p.10–11</vc-ref></div>
                    <ul>@for (p of m.approval_problems; track $index) { <li>{{ p }}</li> }</ul>
                  </div>
                } @else {
                  <div class="ready"><vc-icon name="check-circle" [size]="15" />Meets the condition 4 checks — ready for a second person to approve.</div>
                }
              }
            </div>

            <footer>
              <button class="btn btn-ghost btn-sm" (click)="detail.set(m)"><vc-icon name="eye" [size]="14" />Details</button>
              <span class="spacer"></span>
              @if (m.status === 'draft' && canManage()) { <button class="btn btn-secondary btn-sm" (click)="startEdit(m)"><vc-icon name="pencil" [size]="14" />Edit</button> }
              @if (m.status === 'draft' && canApprove()) {
                @if (isEditor(m)) {
                  <span class="own" title="You created or edited this model."><vc-icon name="lock" [size]="13" />You created or edited this, so another person must approve it</span>
                } @else {
                  <button class="btn btn-primary btn-sm" [disabled]="m.approval_problems.length > 0" (click)="confirm.set({ kind: 'approve', m })"><vc-icon name="check" [size]="14" />Approve</button>
                }
              }
              @if (m.status === 'approved' && canApprove()) { <button class="btn btn-ghost btn-sm" (click)="reason = ''; confirm.set({ kind: 'retire', m })"><vc-icon name="archive" [size]="14" />Retire</button> }
            </footer>
          </article>
        }
      </div>
    }

    <vc-qa1-model-form [(open)]="formOpen" [edit]="editing()" [models]="models()" [trueups]="trueups()" (saved)="onSaved($event)" />

    <!-- approve / retire -->
    <vc-modal [open]="!!confirm()" (closed)="confirm.set(null)" [title]="confirm()?.kind === 'approve' ? 'Approve this model?' : 'Retire this model?'" width="520px">
      @if (confirm(); as c) {
        <div class="stack" style="--gap:14px">
          <p class="muted">{{ label(c.m) }} · parameter set <code>{{ c.m.parameter_fingerprint.slice(0, 16) }}…</code></p>
          @if (c.kind === 'approve') {
            <vc-callout tone="info" icon="users">Four-eyes rule: you can approve because someone else created and edited this model. Once approved it is frozen — any change to its parameters or validation report becomes a new revision.</vc-callout>
          } @else {
            <div class="field"><label for="rt-r">Why is it being retired?</label>
              <textarea id="rt-r" class="input" rows="3" [(ngModel)]="reason" placeholder="e.g. Replaced by revision 2 after the 2026 true-up"></textarea></div>
            <vc-callout tone="warn" icon="alert">A retired model can't be used for new imports or analyses. Published terms stay as they are.</vc-callout>
          }
          <vc-api-problems [error]="actErr()" />
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="confirm.set(null)">Cancel</button>
        @if (confirm()?.kind === 'approve') {
          <button class="btn btn-primary" [disabled]="busy()" (click)="approve()"><vc-icon name="check" />Approve model</button>
        } @else {
          <button class="btn btn-danger" [disabled]="busy() || reason.trim().length < 5" (click)="retire()"><vc-icon name="archive" />Retire model</button>
        }
      </ng-container>
    </vc-modal>

    <!-- details -->
    <vc-modal [open]="!!detail()" (closed)="detail.set(null)" [drawer]="true" width="640px" [title]="detail() ? label(detail()) : ''" subtitle="Model record and validation metrics">
      @if (detail(); as m) {
        <div class="stack" style="--gap:16px">
          <dl class="kv">
            <dt>Status</dt><dd><vc-badge [status]="m.status" /></dd>
            <dt>Public source</dt><dd>{{ m.public_source || '—' }} @if (m.source_accessed_on) { <span class="subtle">· accessed {{ m.source_accessed_on | day }}</span> }</dd>
            <dt>Publicly available</dt><dd>{{ m.publicly_available ? 'Yes' : 'No' }}</dd>
            <dt>Documentation</dt><dd>{{ m.documentation_ref || '—' }}</dd>
            <dt>Peer review</dt><dd>@for (r of m.peer_review_refs; track r) { <div class="small">{{ r }}</div> } @empty { — }</dd>
            <dt>Parameter set</dt><dd><vc-hash [value]="m.parameter_fingerprint" /> <span class="subtle small">{{ paramCount(m) }} top-level entries</span></dd>
            <dt>Parameter sources</dt><dd>{{ m.parameter_sources || '—' }}</dd>
            <dt>Validation report</dt><dd><vc-evidence [ids]="m.validation_report_evidence_id ? [m.validation_report_evidence_id] : []" [readonly]="true" /></dd>
            <dt>IME assessment</dt><dd><vc-evidence [ids]="m.ime_report_evidence_id ? [m.ime_report_evidence_id] : []" [readonly]="true" /></dd>
            @if (m.notes) { <dt>Notes</dt><dd>{{ m.notes }}</dd> }
          </dl>
          <div class="table-wrap bordered">
            <table class="table">
              <thead><tr><th>Pool</th><th>Practice</th><th class="num">n</th><th class="num">Median yr</th><th class="num">Bias</th><th class="num">s²<sub>Δ</sub> / s² · ρ / cov</th><th>Bias test</th></tr></thead>
              <tbody>
                @for (x of m.validation_metrics; track $index) {
                  <tr>
                    <td>{{ poolShort[x.pool] }}</td><td>{{ practice(x.practice_category) }}</td>
                    <td class="num">{{ x.n_sites }}</td><td class="num">{{ x.median_duration_years | num: 1 }}</td><td class="num">{{ x.bias | num: 3 }}</td>
                    <td class="num small">@if (x.s2_model_delta !== null) { {{ x.s2_model_delta | num: 4 }} } @else { {{ x.s2_model | num: 4 }} · {{ x.rho !== null ? 'ρ ' + x.rho : 'cov ' + x.cov }} }</td>
                    <td>@if (x.bias_test_passed) { <vc-badge status="ok">Passed</vc-badge> } @else { <vc-badge status="failed">Not shown</vc-badge> }</td>
                  </tr>
                } @empty { <tr><td colspan="7" class="muted small">No prediction errors recorded.</td></tr> }
              </tbody>
            </table>
          </div>
        </div>
      }
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:16px;align-items:flex-start;margin-bottom:16px}
    .intro{flex:1;max-width:860px}
    .list{display:flex;flex-direction:column;gap:14px}
    .mdl header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border)}
    .mdl.retired{opacity:.72}
    .ic{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;flex:none;background:var(--sand-200);color:var(--stone-600)}
    .ic.approved{background:var(--forest-100);color:var(--forest-700)} .ic.draft{background:var(--amber-100);color:var(--amber-600)}
    .t{flex:1;min-width:0}
    h3 .v{font-weight:500;color:var(--stone-700)} h3 .rev{font-size:12px;font-weight:500;color:var(--text-3)}
    .sub{display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:3px;align-items:center}
    .pool{font:600 10.5px var(--mono);padding:2px 6px;border-radius:4px;background:var(--dc-modelled-bg);color:var(--dc-modelled)}
    .body{padding:14px 20px;display:flex;flex-direction:column;gap:12px}
    .dom{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 20px}
    .dom > div{display:flex;flex-wrap:wrap;gap:5px;align-items:center}
    .k{font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--text-3);min-width:88px}
    .tag{font-size:12px;padding:1px 8px;border-radius:999px;background:var(--sand-100);border:1px solid var(--border);color:var(--stone-700)}
    .probs{padding:12px 14px;border-radius:var(--radius-sm);background:var(--warn-soft);border:1px solid #f1dcae}
    .ph{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:var(--amber-600)} .ph strong{color:var(--stone-900);font-size:13.5px}
    .probs ul{margin:8px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--stone-800)}
    .ready{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:var(--radius-sm);background:var(--ok-soft);border:1px solid #cfe2d4;color:var(--forest-700);font-size:13px}
    footer{display:flex;align-items:center;gap:8px;padding:10px 20px;border-top:1px solid var(--border);background:var(--surface-2);border-radius:0 0 var(--radius) var(--radius);flex-wrap:wrap}
    .own{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--text-3)}
    .bordered{border:1px solid var(--border);border-radius:var(--radius-sm)}
    @media (max-width: 760px){ .dom{grid-template-columns:minmax(0,1fr)} .bar{flex-direction:column} }
  `],
})
export class Qa1Models {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);
  models = input<Qa1Model[]>([]);
  trueups = input<TrueUp[]>([]);
  changed = output<void>();

  poolShort = POOL_SHORT;
  label = modelLabel;
  ver = ver;
  practice = practiceLabel;
  formOpen = signal(false);
  editing = signal<Qa1Model | null>(null);
  detail = signal<Qa1Model | null>(null);
  confirm = signal<{ kind: 'approve' | 'retire'; m: Qa1Model } | null>(null);
  busy = signal(false);
  actErr = signal<ApiError | null>(null);
  reason = '';

  canManage = computed(() => this.auth.can('models.manage'));
  canApprove = computed(() => this.auth.can('models.approve'));
  sorted = computed(() => {
    const rank: Record<string, number> = { draft: 0, approved: 1, retired: 2 };
    return [...this.models()].sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3) || a.name.localeCompare(b.name) || b.revision - a.revision);
  });

  constructor() { this.people.load(); }

  isEditor(m: Qa1Model) {
    const me = this.auth.profile()?.id;
    return !!me && (m.created_by === me || (m.editors ?? []).includes(me));
  }
  paramCount(m: Qa1Model) { return Object.keys(m.parameter_set ?? {}).length; }
  startNew() { this.editing.set(null); this.formOpen.set(true); }
  startEdit(m: Qa1Model) { this.editing.set(m); this.formOpen.set(true); }
  onSaved(m: Qa1Model) {
    this.toast.success(this.editing() ? 'Model updated' : 'Model registered', m.approval_problems.length ? `${m.approval_problems.length} condition 4 item(s) still to complete.` : 'Ready for a colleague to approve.');
    this.changed.emit();
  }

  approve() {
    const c = this.confirm();
    if (!c) return;
    this.busy.set(true);
    this.actErr.set(null);
    this.api.post<Qa1Model>(`/qa1/models/${c.m.id}/approve`).subscribe({
      next: () => { this.busy.set(false); this.confirm.set(null); this.toast.success('Model approved', 'It can now be used for QA1 runs.'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.actErr.set(e); },
    });
  }
  retire() {
    const c = this.confirm();
    if (!c) return;
    this.busy.set(true);
    this.actErr.set(null);
    this.api.post<Qa1Model>(`/qa1/models/${c.m.id}/retire`, { reason: this.reason.trim() }).subscribe({
      next: () => { this.busy.set(false); this.confirm.set(null); this.toast.success('Model retired'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.actErr.set(e); },
    });
  }
}
