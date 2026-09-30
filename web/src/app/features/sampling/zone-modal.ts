import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, ErrorBox, Loading, Modal } from '../../ui/kit';
import { Enrolment, Stratum } from './types';

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
            <span class="hint">Letters, numbers, dot, dash or underscore. Used in site codes (ST-{{ code || 'CODE' }}-001).</span>
          </div>
          <div class="field">
            <label for="z-name">Name</label>
            <input id="z-name" class="input" [(ngModel)]="name" placeholder="Red laterite, upper slopes" />
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
            <label for="z-soil">Soil type <span class="subtle">(optional)</span></label>
            <input id="z-soil" class="input" [(ngModel)]="soil" placeholder="Red sandy loam" />
          </div>
          <div class="field">
            <label for="z-use">Crop or land use <span class="subtle">(optional)</span></label>
            <input id="z-use" class="input" [(ngModel)]="landUse" placeholder="Rice–pulse rotation" />
          </div>
          <div class="field">
            <label for="z-from">Effective from</label>
            <input id="z-from" type="date" class="input" [(ngModel)]="from" />
            @if (base()) { <span class="hint">Must be after {{ base()!.effective_from }}.</span> }
          </div>
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

  code = '';
  name = '';
  role: 'project' | 'control' = 'project';
  controlFor = '';
  soil = '';
  landUse = '';
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
      this.soil = String(b?.criteria?.['soil_type'] ?? '');
      this.landUse = String(b?.criteria?.['crop_code'] ?? b?.criteria?.['land_use'] ?? '');
      this.from = new Date().toISOString().slice(0, 10);
      this.picked.set(new Set(b?.field_ids ?? []));
      this.loadEnrolments();
    });
  }

  valid() {
    return /^[A-Za-z0-9_.-]+$/.test(this.code) && this.name.trim().length >= 2 && !!this.from && this.picked().size > 0;
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
    const criteria: Record<string, string> = {};
    if (this.soil.trim()) criteria['soil_type'] = this.soil.trim();
    if (this.landUse.trim()) criteria['crop_code'] = this.landUse.trim();
    this.api.post<Stratum>(`/projects/${this.projectId()}/strata`, {
      code: this.code.trim(), name: this.name.trim(), role: this.role,
      control_for_code: this.role === 'control' && this.controlFor ? this.controlFor : null,
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
        this.formError.set(clashes ? `${e.message} Already in: ${clashes}.` : e.message);
      },
    });
  }
}
