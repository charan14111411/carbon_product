import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { EvidenceList } from '../additionality/evidence';
import { ApiProblems } from '../mrv-shared/ui';
import { Allometry, AllometryForms, PARAM_LABEL } from './biomass.types';

/** Allometric equations per species (AR-TOOL14). Entered by one person, approved by another. */
@Component({
  selector: 'vc-allometry',
  imports: [FormsModule, Icon, Badge, Callout, Empty, Modal, EvidenceList, ApiProblems, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small intro">Each tree's above-ground biomass comes from an approved equation for its species, valid for its DBH range. A generic
        equation (species “*”) is used only for species without their own. Root-to-shoot ratios are needed when below-ground biomass is in the boundary.</p>
      @if (canWrite()) { <button class="btn btn-primary" (click)="start()"><vc-icon name="plus" />Add equation</button> }
    </div>
    <section class="card">
      @if (!models().length) {
        <vc-empty icon="ruler" title="No allometric equations yet" text="Add one per species from a published source, with the publication attached as evidence." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Species</th><th>Equation</th><th>Parameters</th><th class="num">DBH range</th><th class="num">Root:shoot</th><th>Source</th><th>Status</th><th></th></tr></thead>
            <tbody>
              @for (m of sorted(); track m.id) {
                <tr [class.dim]="m.status === 'retired'">
                  <td><strong>{{ m.species === '*' ? 'Generic (*)' : m.species }}</strong></td>
                  <td class="small"><code class="frm">{{ m.form_label ?? m.form }}</code><div class="subtle">result in {{ m.output_unit === 't' ? 'tonnes' : 'kilograms' }} d.m.</div></td>
                  <td class="small mono">@for (p of paramList(m); track p[0]) { <span class="pv">{{ p[0] }} = {{ p[1] }}</span> }</td>
                  <td class="num nowrap">{{ m.dbh_min_cm | num: 1 }}–{{ m.dbh_max_cm | num: 1 }} <span class="u">cm</span></td>
                  <td class="num">{{ m.root_shoot_ratio ?? '—' }}</td>
                  <td class="small src"><span [title]="m.source">{{ m.source }}</span><vc-evidence [ids]="m.evidence_ids" [readonly]="true" /></td>
                  <td><vc-badge [status]="m.status" />@if (m.approved_by) { <div class="subtle small">by {{ people.name(m.approved_by, '—') }}</div> }</td>
                  <td class="nowrap act">
                    @if (m.status === 'draft' && canApprove()) {
                      @if (m.created_by === me()) { <span class="own" title="You created this, so another person must approve it."><vc-icon name="lock" [size]="13" />Needs a colleague</span> }
                      @else { <button class="btn btn-secondary btn-sm" (click)="act.set({ kind: 'approve', m })"><vc-icon name="check" [size]="14" />Approve</button> }
                    }
                    @if (m.status !== 'retired' && canApprove()) { <button class="btn btn-ghost btn-sm" (click)="reason = ''; act.set({ kind: 'retire', m })">Retire</button> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="formOpen" title="Add an allometric equation" subtitle="Saved as a draft for a colleague to approve." width="640px">
      <div class="stack" style="--gap:14px">
        <div class="form-grid">
          <div class="field"><label for="al-s">Species</label>
            <input id="al-s" class="input" [(ngModel)]="f.species" placeholder='e.g. Grevillea robusta, or "*" for generic' maxlength="200" /></div>
          <div class="field"><label for="al-f">Equation form</label>
            <select id="al-f" class="input" [(ngModel)]="f.form" (ngModelChange)="onForm()">
              @for (x of forms()?.forms ?? []; track x.key) { <option [value]="x.key">{{ x.label }}</option> }
            </select>
            @if (form()?.needs_height) { <span class="hint">Needs tree height for every tree of this species.</span> }</div>
        </div>
        @if (form(); as fm) {
          <div class="params">
            @for (p of fm.params; track p) {
              <div class="field"><label [attr.for]="'al-p-' + p">{{ paramLabel(p) }}</label>
                <input [id]="'al-p-' + p" class="input num" type="number" step="any" [(ngModel)]="f.params[p]" /></div>
            }
          </div>
        }
        <div class="form-grid">
          @if (f.form !== 'volume_bef') {
            <div class="field"><label>Result unit</label>
              <div class="seg"><button type="button" [class.on]="f.output_unit === 'kg'" (click)="f.output_unit = 'kg'">kg dry matter</button><button type="button" [class.on]="f.output_unit === 't'" (click)="f.output_unit = 't'">t dry matter</button></div></div>
          }
          <div class="field"><label for="al-r">Root-to-shoot ratio <span class="subtle">(optional)</span></label>
            <input id="al-r" class="input num" type="number" min="0" max="10" step="any" [(ngModel)]="f.root_shoot_ratio" /></div>
          <div class="field"><label for="al-min">DBH from (cm)</label><input id="al-min" class="input num" type="number" min="0" step="any" [(ngModel)]="f.dbh_min_cm" /></div>
          <div class="field"><label for="al-max">DBH to (cm)</label><input id="al-max" class="input num" type="number" min="0" step="any" [(ngModel)]="f.dbh_max_cm" /></div>
          <div class="field span-2"><label for="al-src">Source</label><input id="al-src" class="input" [(ngModel)]="f.source" placeholder="Publication, table and page" maxlength="2000" /></div>
          <div class="field span-2"><label>Publication <span class="req">*</span></label><vc-evidence [(ids)]="f.evidence_ids" entityType="allometric_model" addLabel="Attach publication" /></div>
        </div>
        <vc-api-problems [error]="err()" title="Couldn't save the equation" />
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()">{{ busy() ? 'Saving…' : 'Save draft' }}</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="!!act()" (closed)="act.set(null)" [title]="act()?.kind === 'approve' ? 'Approve this equation?' : 'Retire this equation?'" width="480px">
      @if (act(); as a) {
        <div class="stack" style="--gap:12px">
          <p class="muted">{{ a.m.species }} · <code>{{ a.m.form_label }}</code> · DBH {{ a.m.dbh_min_cm }}–{{ a.m.dbh_max_cm }} cm</p>
          @if (a.kind === 'approve') { <vc-callout tone="info" icon="users">Four-eyes rule: you can approve because someone else entered it. Only one approved equation per species is allowed.</vc-callout> }
          @else { <div class="field"><label for="al-rr">Reason</label><textarea id="al-rr" class="input" rows="2" [(ngModel)]="reason"></textarea></div> }
          <vc-api-problems [error]="actErr()" />
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="act.set(null)">Cancel</button>
        @if (act()?.kind === 'approve') { <button class="btn btn-primary" [disabled]="busy()" (click)="approve()"><vc-icon name="check" />Approve</button> }
        @else { <button class="btn btn-danger" [disabled]="busy() || reason.trim().length < 5" (click)="retire()">Retire</button> }
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:16px;align-items:flex-start;margin-bottom:16px}
    .intro{flex:1;max-width:860px}
    .frm{font-size:11.5px;padding:2px 6px;border-radius:4px;background:var(--dc-calculated-bg);color:var(--dc-calculated)}
    .pv{display:inline-block;margin-right:8px;white-space:nowrap}
    .u{font-size:11.5px;color:var(--text-3)}
    .src{max-width:240px} .src span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:4px}
    tr.dim td{color:var(--text-3)}
    .act{text-align:right}
    .own{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--text-3)}
    .params{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;padding:12px;border-radius:var(--radius-sm);background:var(--dc-calculated-bg);border:1px solid #cfd9ee}
    .seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border)}
    .seg button{height:30px;border:0;border-radius:6px;background:none;font:500 13px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .req{color:var(--danger)}
    @media (max-width: 760px){ .bar{flex-direction:column} }
  `],
})
export class AllometryTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);
  projectId = input.required<string>();
  models = input<Allometry[]>([]);
  forms = input<AllometryForms | null>(null);
  changed = output<void>();

  formOpen = signal(false);
  busy = signal(false);
  err = signal<ApiError | null>(null);
  act = signal<{ kind: 'approve' | 'retire'; m: Allometry } | null>(null);
  actErr = signal<ApiError | null>(null);
  reason = '';
  f = this.blank();
  formKey = signal('power_dbh');

  me = computed(() => this.auth.profile()?.id ?? null);
  canWrite = computed(() => this.auth.can('calc.run', 'models.manage', 'rules.edit'));
  canApprove = computed(() => this.auth.can('models.approve', 'rules.approve'));
  form = computed(() => this.forms()?.forms.find(x => x.key === this.formKey()) ?? null);
  sorted = computed(() => {
    const rank: Record<string, number> = { draft: 0, approved: 1, retired: 2 };
    return [...this.models()].sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3) || a.species.localeCompare(b.species));
  });

  constructor() { this.people.load(); }

  private blank() {
    return { species: '', form: 'power_dbh', params: {} as Record<string, number | null>, output_unit: 'kg' as 'kg' | 't', dbh_min_cm: null as number | null, dbh_max_cm: null as number | null, root_shoot_ratio: null as number | null, source: '', evidence_ids: [] as string[] };
  }
  start() {
    this.f = this.blank();
    this.f.form = this.forms()?.forms[0]?.key ?? 'power_dbh';
    this.onForm();
    this.err.set(null);
    this.formOpen.set(true);
  }
  onForm() {
    this.formKey.set(this.f.form);
    const keep: Record<string, number | null> = {};
    for (const p of this.form()?.params ?? []) keep[p] = this.f.params[p] ?? null;
    this.f.params = keep;
  }
  paramLabel(p: string) { return PARAM_LABEL[p] ?? p; }
  paramList(m: Allometry) { return Object.entries(m.params ?? {}); }
  valid() {
    const f = this.f;
    const ps = this.form()?.params ?? [];
    return f.species.trim() && ps.every(p => f.params[p] !== null && f.params[p] !== undefined && !Number.isNaN(Number(f.params[p])))
      && f.dbh_min_cm !== null && f.dbh_max_cm !== null && Number(f.dbh_min_cm) > 0 && Number(f.dbh_max_cm) > Number(f.dbh_min_cm)
      && f.source.trim().length >= 5 && f.evidence_ids.length > 0;
  }
  save() {
    const f = this.f;
    const params: Record<string, number> = {};
    for (const p of this.form()?.params ?? []) params[p] = Number(f.params[p]);
    this.busy.set(true);
    this.err.set(null);
    this.api.post<Allometry>(`/projects/${this.projectId()}/allometric-models`, {
      species: f.species.trim(), form: f.form, params, output_unit: f.form === 'volume_bef' ? 't' : f.output_unit,
      dbh_min_cm: Number(f.dbh_min_cm), dbh_max_cm: Number(f.dbh_max_cm),
      root_shoot_ratio: f.root_shoot_ratio === null || (f.root_shoot_ratio as unknown) === '' ? null : Number(f.root_shoot_ratio),
      source: f.source.trim(), evidence_ids: f.evidence_ids,
    }).subscribe({
      next: () => { this.busy.set(false); this.formOpen.set(false); this.toast.success('Equation saved as draft', 'A colleague approves it before it is used.'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e); },
    });
  }
  approve() {
    const a = this.act();
    if (!a) return;
    this.busy.set(true);
    this.actErr.set(null);
    this.api.post<Allometry>(`/allometric-models/${a.m.id}/approve`).subscribe({
      next: () => { this.busy.set(false); this.act.set(null); this.toast.success('Equation approved'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.actErr.set(e); },
    });
  }
  retire() {
    const a = this.act();
    if (!a) return;
    this.busy.set(true);
    this.actErr.set(null);
    this.api.post<Allometry>(`/allometric-models/${a.m.id}/retire`, { reason: this.reason.trim() }).subscribe({
      next: () => { this.busy.set(false); this.act.set(null); this.toast.success('Equation retired'); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.actErr.set(e); },
    });
  }
}
