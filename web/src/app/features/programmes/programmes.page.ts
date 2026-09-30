import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Empty, ErrorBox, Loading, Modal, PageHeader } from '../../ui/kit';
import { fieldMap, formMessage } from './form-errors';
import { Crop, Programme, ProgrammeSummary } from './types';

interface ProgrammeForm {
  code: string; name: string; region: string; description: string;
  start_date: string; end_date: string; lookback_years: number | null; crops: string[];
}

const blank = (): ProgrammeForm => ({
  code: '', name: '', region: '', description: '', start_date: '', end_date: '', lookback_years: 10, crops: [],
});

/** Programme list: cards with status and headline numbers; create in a modal. */
@Component({
  selector: 'vc-programmes-page',
  imports: [FormsModule, RouterLink, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Icon, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Programmes & projects" eyebrow="Programmes"
      subtitle="A programme sets the region, eligible crops and commercial terms. Projects inside it follow one methodology and crediting period.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (canManage) {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New programme</button>
      }
    </vc-page-header>

    <div class="filters">
      <div class="seg" role="tablist">
        @for (s of statusTabs; track s.key) {
          <button type="button" [class.on]="status() === s.key" (click)="status.set(s.key)">
            {{ s.label }} <span class="c num">{{ count(s.key) }}</span>
          </button>
        }
      </div>
    </div>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="5" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load programmes" [message]="error()!">
        <button class="btn btn-secondary btn-sm" (click)="load()">Try again</button>
      </vc-error>
    } @else if (!all().length) {
      <div class="card">
        <vc-empty icon="briefcase" title="Start by creating a programme"
          text="A programme groups the farmers, fields and projects in one region under shared terms. You can add projects once it exists.">
          @if (canManage) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New programme</button> }
        </vc-empty>
      </div>
    } @else if (!rows().length) {
      <div class="card"><vc-empty icon="filter" title="No programmes with this status" text="Choose another status to see more." /></div>
    } @else {
      <div class="cards">
        @for (p of rows(); track p.id) {
          <a class="pcard card" [routerLink]="[p.id]">
            <div class="top">
              <span class="code mono">{{ p.code }}</span>
              <vc-badge [status]="p.status" />
            </div>
            <h3>{{ p.name }}</h3>
            <p class="region"><vc-icon name="pin" [size]="14" />{{ p.region || 'No region set' }}</p>
            <div class="nums">
              @let s = summaries()[p.id];
              <div><span class="v num">{{ s ? s.projects : '—' }}</span><span class="l">Projects</span></div>
              <div><span class="v num">{{ s ? (s.farmers_enrolled | num: 0) : '—' }}</span><span class="l">Farmers</span></div>
              <div><span class="v num">{{ s ? (s.hectares_enrolled | num: 1) : '—' }}<small>ha</small></span><span class="l">Enrolled</span></div>
            </div>
            <div class="foot">
              <span class="crops">
                @if (p.eligible_crops.length) {
                  @for (c of p.eligible_crops.slice(0, 3); track c) { <span class="chip">{{ cropName(c) }}</span> }
                  @if (p.eligible_crops.length > 3) { <span class="chip more">+{{ p.eligible_crops.length - 3 }}</span> }
                } @else { <span class="subtle small">All crops eligible</span> }
              </span>
              <span class="dates small subtle">{{ p.start_date | day }} – {{ p.end_date ? (p.end_date | day) : 'open' }}</span>
            </div>
          </a>
        }
      </div>
    }

    <vc-modal [(open)]="createOpen" title="New programme" subtitle="You can change the name, region and terms later. The code is permanent." width="640px">
      <form class="form-grid" (ngSubmit)="create()" id="prog-form">
        <div class="field">
          <label for="pc">Code</label>
          <input id="pc" class="input mono" name="code" [(ngModel)]="form.code" placeholder="KA-REGEN" required
            [class.invalid]="fieldErr('code')" />
          @if (fieldErr('code')) { <span class="error">{{ fieldErr('code') }}</span> }
          @else { <span class="hint">Letters, numbers, - and _. 2–40 characters.</span> }
        </div>
        <div class="field">
          <label for="pn">Name</label>
          <input id="pn" class="input" name="name" [(ngModel)]="form.name" placeholder="Karnataka Regenerative Soils" required
            [class.invalid]="fieldErr('name')" />
          @if (fieldErr('name')) { <span class="error">{{ fieldErr('name') }}</span> }
        </div>
        <div class="field span-2">
          <label for="pr">Region</label>
          <input id="pr" class="input" name="region" [(ngModel)]="form.region" placeholder="Chikkamagaluru and Hassan districts, Karnataka" />
        </div>
        <div class="field span-2">
          <label>Eligible crops</label>
          <div class="croppick">
            @for (c of crops(); track c.code) {
              <button type="button" class="pick" [class.on]="form.crops.includes(c.code)" (click)="toggleCrop(c.code)">
                @if (form.crops.includes(c.code)) { <vc-icon name="check" [size]="13" /> }
                {{ c.name }}
              </button>
            } @empty { <span class="subtle small">No crops in the catalogue yet. Add them under Crops & practices catalogue.</span> }
          </div>
          <span class="hint">Leave empty to accept every crop. Fields with other crops fail the eligibility check.</span>
        </div>
        <div class="field">
          <label for="psd">Start date</label>
          <input id="psd" class="input" type="date" name="start_date" [(ngModel)]="form.start_date" />
        </div>
        <div class="field">
          <label for="ped">End date <span class="subtle">(optional)</span></label>
          <input id="ped" class="input" type="date" name="end_date" [(ngModel)]="form.end_date" [class.invalid]="dateErr()" />
          @if (dateErr()) { <span class="error">The end date can't be before the start date.</span> }
        </div>
        <div class="field">
          <label for="plb">Land-use look-back</label>
          <div class="suffix">
            <input id="plb" class="input num" type="number" min="1" max="30" name="lookback" [(ngModel)]="form.lookback_years" />
            <span>years</span>
          </div>
          <span class="hint">Fields must show no forest or wetland conversion in this window.</span>
        </div>
        <div class="field span-2">
          <label for="pdsc">Description <span class="subtle">(optional)</span></label>
          <textarea id="pdsc" class="input" name="description" rows="3" [(ngModel)]="form.description"
            placeholder="Who the programme is for and what it pays for."></textarea>
        </div>
        @if (formError()) { <div class="span-2"><vc-error title="Couldn't create the programme" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="prog-form" [disabled]="saving() || !form.code || !form.name || dateErr()">
          {{ saving() ? 'Creating…' : 'Create programme' }}
        </button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
    .seg{display:inline-flex;padding:3px;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:9px}
    .seg button{height:30px;padding:0 12px;border:0;background:none;border-radius:6px;font:500 13px var(--font);color:var(--stone-600);cursor:pointer;display:inline-flex;align-items:center;gap:6px}
    .seg button:hover{color:var(--stone-900)}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{font-size:11.5px;color:var(--text-3)}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
    .pcard{display:flex;flex-direction:column;gap:6px;padding:18px 20px 16px;color:inherit;text-decoration:none!important;transition:border-color .12s,box-shadow .12s}
    .pcard:hover{border-color:var(--forest-300);box-shadow:var(--shadow)}
    .top{display:flex;align-items:center;justify-content:space-between}
    .code{font-size:12px;color:var(--text-3);letter-spacing:.02em}
    .pcard h3{font-size:16px;margin-top:2px}
    .region{display:flex;align-items:center;gap:6px;color:var(--text-2);font-size:13px}
    .region vc-icon{color:var(--text-3)}
    .nums{display:grid;grid-template-columns:repeat(3,1fr);margin:12px 0 4px;padding:12px 0;border-top:1px solid var(--stone-100);border-bottom:1px solid var(--stone-100)}
    .nums div{display:flex;flex-direction:column;gap:2px}
    .nums div + div{padding-left:14px;border-left:1px solid var(--stone-100)}
    .v{font-size:19px;font-weight:600;letter-spacing:-.01em;color:var(--stone-900)}
    .v small{font-size:12px;font-weight:500;color:var(--text-3);margin-left:3px}
    .l{font-size:12px;color:var(--text-3)}
    .foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px}
    .crops{display:flex;gap:4px;flex-wrap:wrap;min-width:0}
    .chip{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);font-size:12px;color:var(--stone-700)}
    .chip.more{color:var(--text-3)}
    .dates{white-space:nowrap}
    .croppick{display:flex;flex-wrap:wrap;gap:6px}
    .pick{display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 11px;border-radius:999px;border:1px solid var(--border-strong);background:var(--surface);font:500 13px var(--font);color:var(--stone-700);cursor:pointer}
    .pick:hover{border-color:var(--stone-400)}
    .pick.on{background:var(--forest-50);border-color:var(--forest-400);color:var(--forest-700)}
    .suffix{display:flex;align-items:center;gap:8px}
    .suffix .input{width:100px}
    .suffix span{color:var(--text-2);font-size:13px}
  `],
})
export class ProgrammesPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  canManage = inject(AuthService).can('programmes.manage');

  all = signal<Programme[]>([]);
  summaries = signal<Record<string, ProgrammeSummary>>({});
  crops = signal<Crop[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  status = signal('all');
  statusTabs = [
    { key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'draft', label: 'Draft' },
    { key: 'suspended', label: 'Suspended' }, { key: 'closed', label: 'Closed' },
  ];
  rows = computed(() => (this.status() === 'all' ? this.all() : this.all().filter(p => p.status === this.status())));
  private cropMap = computed(() => new Map(this.crops().map(c => [c.code, c.name])));

  createOpen = signal(false);
  saving = signal(false);
  formError = signal<string | null>(null);
  fieldErrors = signal<Record<string, string>>({});
  form: ProgrammeForm = blank();

  constructor() {
    this.load();
    this.api.get<Crop[]>('/catalogue/crops').subscribe({ next: c => this.crops.set(c), error: () => {} });
  }

  count(key: string) {
    return key === 'all' ? this.all().length : this.all().filter(p => p.status === key).length;
  }
  cropName(code: string) { return this.cropMap().get(code) ?? code; }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Programme[]>('/programmes').subscribe({
      next: list => {
        this.all.set(list);
        this.loading.set(false);
        if (!list.length) return;
        forkJoin(list.map(p => this.api.get<ProgrammeSummary>(`/programmes/${p.id}/summary`).pipe(catchError(() => of(null)))))
          .subscribe(res => {
            const m: Record<string, ProgrammeSummary> = {};
            res.forEach((s, i) => { if (s) m[list[i].id] = s; });
            this.summaries.set(m);
          });
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  openCreate() {
    this.form = blank();
    this.formError.set(null);
    this.fieldErrors.set({});
    this.createOpen.set(true);
  }

  toggleCrop(code: string) {
    const c = this.form.crops;
    this.form.crops = c.includes(code) ? c.filter(x => x !== code) : [...c, code];
  }

  dateErr() {
    return !!(this.form.start_date && this.form.end_date && this.form.end_date < this.form.start_date);
  }

  fieldErr(name: string) { return this.fieldErrors()[name]; }

  create() {
    const f = this.form;
    this.saving.set(true);
    this.formError.set(null);
    this.fieldErrors.set({});
    const terms: Record<string, unknown> = {};
    if (f.lookback_years) terms['lookback_years'] = Number(f.lookback_years);
    this.api.post<Programme>('/programmes', {
      code: f.code.trim(), name: f.name.trim(), region: f.region.trim(), description: f.description.trim() || null,
      eligible_crops: f.crops, start_date: f.start_date || null, end_date: f.end_date || null, commercial_terms: terms,
    }).subscribe({
      next: p => {
        this.saving.set(false);
        this.createOpen.set(false);
        this.toast.success('Programme created', `${p.code} · ${p.name} is in draft. Activate it when ready.`);
        this.router.navigate(['/app/programmes', p.id]);
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        const m = fieldMap(e);
        this.fieldErrors.set(m);
        this.formError.set(formMessage(e, m));
      },
    });
  }
}
