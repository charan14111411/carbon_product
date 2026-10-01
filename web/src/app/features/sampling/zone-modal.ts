import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, ErrorBox, Loading, Modal } from '../../ui/kit';
import { fieldErrors, problemList } from './errors';
import { Enrolment, STRATIFICATION_FACTORS, Stratum } from './types';

/** Create a zone (stratum) or a new dated version of an existing one. */
@Component({
  selector: 'vc-zone-modal',
  imports: [FormsModule, Modal, Icon, Loading, ErrorBox, Callout, DataClass, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" width="720px"
      [title]="base() ? 'New version of zone ' + base()!.code : 'New zone'"
      [subtitle]="base() ? 'The current version closes the day before the new one starts. History is kept.' : 'A zone groups enrolled fields with similar soil and land use. Each zone gets its own sample plan.'">
      <div class="stack" style="--gap:18px">
        <div class="form-grid">
          <div class="field">
            <label for="z-code">Zone code</label>
            <input id="z-code" class="input mono" [(ngModel)]="code" [disabled]="!!base()" placeholder="Z1-RED" maxlength="40" />
            @if (fe()['code']; as m) { <span class="error">{{ m }}</span> }
            <span class="hint">Letters, numbers, dot, dash or underscore. Used in site codes (ST-{{ code || 'CODE' }}-001).</span>
          </div>
          <div class="field">
            <label for="z-name">Name</label>
            <input id="z-name" class="input" [(ngModel)]="name" placeholder="Red laterite, upper slopes" />
            @if (fe()['name']; as m) { <span class="error">{{ m }}</span> }
          </div>
          <div class="field">
            <label for="z-role">Role</label>
            <select id="z-role" class="input" [(ngModel)]="role" [disabled]="!!base()">
              <option value="project">Project zone — practices change here</option>
              <option value="control">Control zone — business as usual</option>
            </select>
          </div>
          @if (role === 'control') {
            <div class="field">
              <label for="z-ctl">Control for zone</label>
              <select id="z-ctl" class="input" [(ngModel)]="controlFor">
                <option value="">Not linked</option>
                @for (s of projectZones(); track s.id) { <option [value]="s.code">{{ s.code }} · {{ s.name }}</option> }
              </select>
            </div>
          } @else {
            <div class="field"></div>
          }
          <div class="field">
            <label for="z-qu">Quantification unit</label>
            <input id="z-qu" class="input mono" [(ngModel)]="qu" [placeholder]="code || 'Same as the zone code'" maxlength="40" />
            @if (fe()['quantification_unit']; as m) { <span class="error">{{ m }}</span> }
            @else { <span class="hint">The unit results are reported for. Leave empty to use the zone code.</span> }
          </div>
          <div class="field">
            <label for="z-from">Effective from</label>
            <input id="z-from" type="date" class="input" [(ngModel)]="from" />
            @if (fe()['effective_from']; as m) { <span class="error">{{ m }}</span> }
            @else if (base()) { <span class="hint">Must be after {{ base()!.effective_from }}.</span> }
          </div>
        </div>

        <div class="factors" [class.bad]="chosen().length > 0 && factorsMissing()">
          <div class="row fhead">
            <strong>Stratification factors</strong>
            <span class="chipref">VM0042 §8.2.1.2</span>
            <div class="spacer"></div>
            <span class="subtle small">{{ chosen().length }} of {{ factors.length }} used</span>
          </div>
          <p class="muted small">Pick the factors that make this zone different from the others, and describe each one. The verifier sees these in the strata annex.</p>
          <div class="fchips" role="group" aria-label="Stratification factors">
            @for (f of factors; track f.key) {
              <button type="button" class="fchip" [class.on]="chosenSet().has(f.key)" [attr.aria-pressed]="chosenSet().has(f.key)" (click)="toggleFactor(f.key)">
                <vc-icon [name]="chosenSet().has(f.key) ? 'check' : 'plus'" [size]="13" />{{ f.label }}
              </button>
            }
          </div>
          @if (chosen().length) {
            <div class="fvals">
              @for (k of chosen(); track k) {
                @let f = factorOf(k);
                <div class="fv">
                  <label class="fk" [for]="'zf-' + k">{{ f.label }}</label>
                  <input [id]="'zf-' + k" class="input" [class.bad]="!values()[k]?.trim()" [ngModel]="values()[k] ?? ''" (ngModelChange)="setValue(k, $event)" [placeholder]="f.example" />
                  <button type="button" class="btn btn-ghost btn-icon btn-sm" (click)="toggleFactor(k)" [attr.aria-label]="'Remove ' + f.label"><vc-icon name="x" [size]="14" /></button>
                </div>
              }
            </div>
          }
          @if (!chosen().length) { <span class="hint">At least one factor is required.</span> }
          @else if (factorsMissing()) { <span class="error">Give each chosen factor a value.</span> }
          @for (m of serverProblems(); track m) { <span class="error small">{{ m }}</span> }
        </div>

        <div>
          <div class="row fhead">
            <strong>Enrolled fields</strong>
            <span class="subtle small">{{ picked().size }} selected</span>
            <div class="spacer"></div>
            <input class="input search" placeholder="Filter by field or farmer…" [ngModel]="q()" (ngModelChange)="q.set($event)" />
          </div>
          <div class="flist">
            @if (loading()) {
              <vc-loading [rows]="4" />
            } @else if (error()) {
              <div style="padding:12px"><vc-error title="Couldn't load enrolled fields" [message]="error()!" /></div>
            } @else if (!enrolments().length) {
              <p class="muted small" style="padding:16px">No fields are enrolled in this project yet. Enrol fields before drawing zones.</p>
            } @else {
              @for (e of shown(); track e.field_id) {
                @let owner = takenBy().get(e.field_id);
                <label class="fr" [class.dis]="!!owner">
                  <input type="checkbox" [checked]="picked().has(e.field_id)" [disabled]="!!owner" (change)="toggle(e.field_id)" />
                  <span class="mono">{{ e.field_code }}</span>
                  <span class="muted truncate">{{ e.farmer_name }}</span>
                  <span class="spacer"></span>
                  @if (owner) { <span class="subtle small">in zone {{ owner }}</span> }
                  <span class="num small">{{ e.field_area_ha | num: 2 }} ha</span>
                </label>
              }
            }
          </div>
          <div class="sum">
            <span>Zone area</span>
            <strong class="num">{{ area() | num: 2 }} ha</strong>
            <vc-dc cls="DERIVED" />
            <span class="subtle small">Sum of selected field areas</span>
          </div>
        </div>

        @if (formError()) { <vc-callout tone="danger" icon="alert">{{ formError() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()">
          <vc-icon name="check" />{{ busy() ? 'Saving…' : base() ? 'Save new version' : 'Create zone' }}
        </button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .fhead{margin-bottom:8px}
    .search{width:240px;height:32px}
    .flist{border:1px solid var(--border);border-radius:var(--radius-sm);max-height:260px;overflow:auto;background:var(--surface)}
    .fr{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--stone-100);cursor:pointer;font-size:13.5px}
    .fr:last-child{border-bottom:0}
    .fr:hover{background:var(--forest-50)}
    .fr.dis{opacity:.55;cursor:not-allowed}
    .fr input{accent-color:var(--primary);width:16px;height:16px}
    .sum{display:flex;align-items:center;gap:10px;margin-top:10px;padding:10px 12px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm)}
    .sum strong{font-size:16px}
    .factors{display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface-2)}
    .factors.bad{border-color:var(--amber-600)}
    .factors .fhead{margin-bottom:0}
    .chipref{font:600 10.5px/1 var(--mono);padding:4px 6px;border-radius:4px;background:var(--sand-200);color:var(--stone-700);letter-spacing:.02em}
    .fchips{display:flex;flex-wrap:wrap;gap:6px}
    .fchip{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 10px;border-radius:999px;border:1px solid var(--border-strong);background:var(--surface);font:inherit;font-size:12.5px;color:var(--stone-700);cursor:pointer}
    .fchip:hover{border-color:var(--forest-400)}
    .fchip.on{background:var(--forest-50);border-color:var(--forest-500);color:var(--forest-700);font-weight:500}
    .fvals{display:flex;flex-direction:column;gap:6px}
    .fv{display:grid;grid-template-columns:150px minmax(0,1fr) auto;gap:8px;align-items:center}
    .fk{font-size:13px;font-weight:500;color:var(--stone-700)}
    .fv .input{height:34px}
    .input.bad{border-color:var(--amber-600)}
    .factors .error{font-size:12.5px;color:var(--danger)}
    .factors .hint{font-size:12.5px;color:var(--text-3)}
    @media (max-width:600px){.fv{grid-template-columns:minmax(0,1fr) auto}.fk{grid-column:1/-1}}
  `],
})
export class ZoneModal {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  open = model(false);
  projectId = input.required<string>();
  strata = input<Stratum[]>([]);
  base = input<Stratum | null>(null);
  saved = output<Stratum>();

  enrolments = signal<Enrolment[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  busy = signal(false);
  formError = signal<string | null>(null);
  picked = signal<Set<string>>(new Set());
  q = signal('');

  factors = STRATIFICATION_FACTORS;
  chosen = signal<string[]>([]);
  values = signal<Record<string, string>>({});
  chosenSet = computed(() => new Set(this.chosen()));
  factorsMissing = computed(() => !this.chosen().length || this.chosen().some(k => !this.values()[k]?.trim()));
  fe = signal<Record<string, string>>({});
  serverProblems = signal<string[]>([]);

  code = '';
  name = '';
  qu = '';
  role: 'project' | 'control' = 'project';
  controlFor = '';
  from = new Date().toISOString().slice(0, 10);

  projectZones = computed(() => this.strata().filter(s => s.role === 'project' && s.code !== this.base()?.code));
  takenBy = computed(() => {
    const m = new Map<string, string>();
    for (const s of this.strata()) {
      if (s.code === this.base()?.code) continue;
      for (const f of s.field_ids) m.set(f, s.code);
    }
    return m;
  });
  shown = computed(() => {
    const q = this.q().toLowerCase().trim();
    return this.enrolments().filter(e => !q || e.field_code.toLowerCase().includes(q) || e.farmer_name.toLowerCase().includes(q));
  });
  area = computed(() => {
    const p = this.picked();
    return this.enrolments().filter(e => p.has(e.field_id)).reduce((a, e) => a + (e.field_area_ha || 0), 0);
  });

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const b = this.base();
      this.formError.set(null);
      this.q.set('');
      this.code = b?.code ?? '';
      this.name = b?.name ?? '';
      this.role = b?.role ?? 'project';
      this.controlFor = b?.control_for_code ?? '';
      this.qu = b?.quantification_unit && b.quantification_unit !== b.code ? b.quantification_unit : '';
      const known = new Set(STRATIFICATION_FACTORS.map(f => f.key));
      const crit = Object.entries(b?.criteria ?? {}).filter(([k, v]) => known.has(k) && v !== null && v !== '');
      this.chosen.set(STRATIFICATION_FACTORS.map(f => f.key).filter(k => crit.some(([c]) => c === k)));
      this.values.set(Object.fromEntries(crit.map(([k, v]) => [k, String(v)])));
      this.fe.set({});
      this.serverProblems.set([]);
      this.from = new Date().toISOString().slice(0, 10);
      this.picked.set(new Set(b?.field_ids ?? []));
      this.loadEnrolments();
    });
  }

  valid() {
    return /^[A-Za-z0-9_.-]+$/.test(this.code) && this.name.trim().length >= 2 && !!this.from && this.picked().size > 0
      && !this.factorsMissing() && (!this.qu.trim() || /^[A-Za-z0-9_.-]+$/.test(this.qu.trim()));
  }

  factorOf(k: string) {
    return STRATIFICATION_FACTORS.find(f => f.key === k) ?? { key: k, label: k, example: '' };
  }

  toggleFactor(k: string) {
    const on = this.chosenSet().has(k);
    // Keep the canonical order so the annex reads the same way for every zone.
    this.chosen.set(on ? this.chosen().filter(x => x !== k)
      : STRATIFICATION_FACTORS.map(f => f.key).filter(x => x === k || this.chosenSet().has(x)));
    this.serverProblems.set([]);
  }

  setValue(k: string, v: string) {
    this.values.update(m => ({ ...m, [k]: v }));
  }

  toggle(id: string) {
    const s = new Set(this.picked());
    s.has(id) ? s.delete(id) : s.add(id);
    this.picked.set(s);
  }

  private loadEnrolments() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Enrolment[]>(`/projects/${this.projectId()}/enrolments`, { status: 'enrolled' }).subscribe({
      next: r => { this.enrolments.set(r.filter(e => e.status === 'enrolled')); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  save() {
    this.busy.set(true);
    this.formError.set(null);
    this.fe.set({});
    this.serverProblems.set([]);
    const criteria: Record<string, string> = {};
    for (const k of this.chosen()) criteria[k] = (this.values()[k] ?? '').trim();
    this.api.post<Stratum>(`/projects/${this.projectId()}/strata`, {
      code: this.code.trim(), name: this.name.trim(), role: this.role,
      control_for_code: this.role === 'control' && this.controlFor ? this.controlFor : null,
      quantification_unit: this.qu.trim() || null,
      criteria, field_ids: [...this.picked()], effective_from: this.from,
    }).subscribe({
      next: s => {
        this.busy.set(false);
        this.toast.success(this.base() ? `Zone ${s.code} is now version ${s.version}` : `Zone ${s.code} created`);
        this.saved.emit(s);
        this.open.set(false);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        const clashes = (e.details?.['clashes'] as { stratum: string }[] | undefined)?.map(c => c.stratum).join(', ');
        this.fe.set(fieldErrors(e));
        this.serverProblems.set(problemList(e));
        this.formError.set(clashes ? `${e.message} Already in: ${clashes}.` : e.message);
      },
    });
  }
}
