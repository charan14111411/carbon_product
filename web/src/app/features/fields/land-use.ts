import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { HumanPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, Empty, ErrorBox, FileDrop, Loading, Modal } from '../../ui/kit';
import { Chip } from './chip';
import { LAND_USES, LAND_USE_COLOR, evidenceForm } from './field-data';

interface LandUseRec {
  id: string;
  field_id: string;
  from_year: number;
  to_year: number;
  land_use: string;
  evidence_id: string | null;
  source: string;
  notes: string;
  created_by: string | null;
  created_at: string;
  evidence_missing: boolean;
}

/** Land-use history as a year strip plus a list, with a form to add a period and its evidence. */
@Component({
  selector: 'vc-land-use',
  imports: [FormsModule, Loading, ErrorBox, Empty, Icon, Modal, FileDrop, Callout, Chip, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <p class="muted small">Eligibility checks look back over this history — for example, recent conversion from forest can disqualify a field.</p>
      @if (auth.can('land.manage')) {
        <button class="btn btn-secondary btn-sm" (click)="openAdd()"><vc-icon name="plus" [size]="14" />Add land-use period</button>
      }
    </div>

    @if (loading()) { <vc-loading [rows]="3" /> }
    @else if (error()) { <div class="card-body"><vc-error title="Couldn't load land-use history" [message]="error()!" /></div> }
    @else if (!items().length) {
      <vc-empty icon="calendar" title="No land-use history recorded"
        text="Record what the land was used for in past years, with a document or image as evidence where you have one." />
    } @else {
      <div class="strip-wrap">
        <div class="strip">
          @for (y of years(); track y.year) {
            <div class="yr" [class.gap]="!y.use" [style.background]="y.use ? color(y.use) : null"
              [class.multi]="y.count > 1" [title]="y.year + ': ' + (y.use ? (y.use | human) : 'no record')"></div>
          }
        </div>
        <div class="axis">
          @for (y of years(); track y.year) { <span [class.show]="y.year % 5 === 0 || $first || $last">{{ y.year }}</span> }
        </div>
        <div class="legend">
          @for (u of usedTypes(); track u) { <span class="li"><span class="sw" [style.background]="color(u)"></span>{{ u | human }}</span> }
          <span class="li"><span class="sw gap"></span>No record</span>
        </div>
      </div>

      <ul class="list">
        @for (r of sorted(); track r.id) {
          <li>
            <div class="yrs num">{{ r.from_year }}{{ r.to_year !== r.from_year ? ' – ' + r.to_year : '' }}</div>
            <div class="c">
              <div class="row-a">
                <vc-chip [swatch]="color(r.land_use)" tone="outline">{{ r.land_use | human }}</vc-chip>
                @if (r.source) { <span class="muted small">{{ r.source }}</span> }
              </div>
              @if (r.notes) { <p class="notes">{{ r.notes }}</p> }
            </div>
            <div class="ev">
              @if (r.evidence_id) {
                <button class="btn btn-ghost btn-sm" (click)="viewEvidence(r.evidence_id)"><vc-icon name="file" [size]="14" />Evidence</button>
              } @else {
                <span class="missing" title="No supporting document attached"><vc-icon name="file-warning" [size]="13" />No evidence</span>
              }
            </div>
          </li>
        }
      </ul>
    }

    <vc-modal [(open)]="addOpen" title="Add land-use period" subtitle="What was this land used for, and how do you know?" width="560px">
      <div class="form-grid">
        <div class="field"><label for="lu-from">From year</label><input id="lu-from" type="number" class="input num" [ngModel]="fromYear()" (ngModelChange)="fromYear.set(+$event)" /></div>
        <div class="field"><label for="lu-to">To year</label><input id="lu-to" type="number" class="input num" [ngModel]="toYear()" (ngModelChange)="toYear.set(+$event)" /></div>
        <div class="field span-2">
          <span class="label">Land use</span>
          <div class="uses">
            @for (u of uses; track u) {
              <button type="button" class="use" [class.on]="landUse() === u" (click)="landUse.set(u)">
                <span class="sw" [style.background]="color(u)"></span>{{ u | human }}
              </button>
            }
          </div>
        </div>
        <div class="field span-2">
          <label for="lu-src">Source</label>
          <input id="lu-src" class="input" [ngModel]="source()" (ngModelChange)="source.set($event)" placeholder="e.g. Village land records (RTC), farmer interview, 2015 satellite image" />
        </div>
        <div class="field span-2">
          <label for="lu-notes">Notes <span class="subtle">(optional)</span></label>
          <textarea id="lu-notes" class="input" rows="2" [ngModel]="notes()" (ngModelChange)="notes.set($event)"></textarea>
        </div>
        <div class="field span-2">
          <span class="label">Evidence <span class="subtle">(recommended)</span></span>
          <vc-file-drop [(file)]="file" label="Attach a land record, photo or image" hint="PDF, JPG or PNG · stored with a tamper-evident fingerprint" />
        </div>
      </div>
      @if (formError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ formError() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="addOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!valid() || saving()" (click)="save()">{{ saving() ? 'Saving…' : 'Save period' }}</button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .head{display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid var(--border)}
    .head p{flex:1}
    .strip-wrap{padding:18px 20px 10px}
    .strip{display:flex;gap:2px;height:28px}
    .yr{flex:1;border-radius:3px;min-width:4px}
    .yr.gap{background:repeating-linear-gradient(135deg,var(--sand-200),var(--sand-200) 3px,var(--sand-100) 3px,var(--sand-100) 6px)}
    .yr.multi{box-shadow:inset 0 0 0 2px rgba(255,255,255,.55)}
    .axis{display:flex;gap:2px;margin-top:6px}
    .axis span{flex:1;min-width:4px;font-size:10.5px;color:var(--text-3);text-align:center;visibility:hidden;font-variant-numeric:tabular-nums}
    .axis span.show{visibility:visible}
    .legend{display:flex;gap:14px;flex-wrap:wrap;margin-top:12px}
    .li{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2)}
    .sw{width:10px;height:10px;border-radius:3px;flex:none}
    .sw.gap{background:repeating-linear-gradient(135deg,var(--sand-300),var(--sand-300) 2px,var(--sand-100) 2px,var(--sand-100) 4px)}
    .list{list-style:none;margin:0;padding:0;border-top:1px solid var(--border)}
    .list li{display:flex;gap:16px;align-items:flex-start;padding:12px 20px;border-bottom:1px solid var(--stone-100)}
    .list li:last-child{border-bottom:0}
    .yrs{width:96px;flex:none;font-weight:600;padding-top:2px}
    .c{flex:1;min-width:0} .row-a{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .notes{margin-top:4px;font-size:13px;color:var(--stone-700)}
    .missing{display:inline-flex;gap:5px;align-items:center;font-size:12px;color:var(--amber-600);padding:4px 8px;border-radius:6px;background:var(--warn-soft)}
    .uses{display:flex;flex-wrap:wrap;gap:6px}
    .use{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 12px;border:1px solid var(--border-strong);border-radius:7px;background:var(--surface);font:inherit;font-size:13px;cursor:pointer;color:var(--stone-800)}
    .use:hover{border-color:var(--stone-400)}
    .use.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:0 0 0 1px var(--forest-500) inset}
    .mt{margin-top:14px}
    .ft{display:flex;gap:8px}
  `],
})
export class LandUse {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  fieldId = input.required<string>();

  uses = LAND_USES;
  items = signal<LandUseRec[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  addOpen = signal(false);
  fromYear = signal(new Date().getFullYear() - 10);
  toYear = signal(new Date().getFullYear() - 1);
  landUse = signal<string>('');
  source = signal('');
  notes = signal('');
  file = signal<File | null>(null);
  saving = signal(false);
  formError = signal<string | null>(null);

  sorted = computed(() => [...this.items()].sort((a, b) => b.from_year - a.from_year));
  usedTypes = computed(() => [...new Set(this.items().map(i => i.land_use))]);
  years = computed(() => {
    const it = this.items();
    const now = new Date().getFullYear();
    const min = Math.min(now - 10, ...it.map(i => i.from_year));
    const out: { year: number; use: string | null; count: number }[] = [];
    for (let y = min; y <= now; y++) {
      const hits = it.filter(i => i.from_year <= y && i.to_year >= y);
      out.push({ year: y, use: hits.length ? hits[hits.length - 1].land_use : null, count: hits.length });
    }
    return out;
  });
  valid = computed(() => !!this.landUse() && this.fromYear() >= 1900 && this.toYear() >= this.fromYear() && this.toYear() <= new Date().getFullYear());

  constructor() {
    effect(() => { this.fieldId(); this.load(); });
  }

  color(u: string) { return LAND_USE_COLOR[u] ?? 'var(--stone-400)'; }

  load() {
    this.loading.set(true);
    this.api.get<LandUseRec[]>(`/fields/${this.fieldId()}/land-use`).subscribe({
      next: r => { this.items.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  openAdd() {
    this.formError.set(null);
    this.landUse.set(''); this.source.set(''); this.notes.set(''); this.file.set(null);
    this.addOpen.set(true);
  }

  async save() {
    this.saving.set(true);
    this.formError.set(null);
    try {
      let evidenceId: string | null = null;
      const f = this.file();
      if (f) {
        const ev = await firstValueFrom(this.api.upload<{ id: string }>('/evidence', evidenceForm(f, 'document', 'field', this.fieldId())));
        evidenceId = ev.id;
      }
      await firstValueFrom(this.api.post(`/fields/${this.fieldId()}/land-use`, {
        from_year: this.fromYear(), to_year: this.toYear(), land_use: this.landUse(), evidence_id: evidenceId,
        source: this.source().trim(), notes: this.notes().trim(),
      }));
      this.toast.success('Land-use period saved', `${this.fromYear()}–${this.toYear()}${evidenceId ? ', with evidence' : ''}`);
      this.addOpen.set(false);
      this.load();
    } catch (e) {
      this.formError.set((e as ApiError).message);
    } finally {
      this.saving.set(false);
    }
  }

  viewEvidence(id: string) {
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: b => window.open(URL.createObjectURL(b), '_blank'),
      error: e => this.toast.apiError(e, "Couldn't open the file"),
    });
  }
}
