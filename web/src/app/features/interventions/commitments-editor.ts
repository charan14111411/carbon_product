import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KIT } from '../../ui/kit';
import { Commitment, PracticeCatalogue } from './plan-types';

export function blankCommitment(year = new Date().getFullYear()): Commitment {
  return { practice_code: '', start_year: year, start_season: null, end_year: year + 4, end_season: null, times_per_year: 1, expected_quantity: null, unit: null, notes: '' };
}

/** Rows of practice commitments, built from the organisation's practice catalogue. */
@Component({
  selector: 'vcx-commitments-editor',
  imports: [...KIT, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rows">
      @for (c of rows(); track $index; let i = $index) {
        <div class="crow">
          <div class="top">
            <span class="n num">{{ i + 1 }}</span>
            <select class="input" [name]="'cp' + i" [ngModel]="c.practice_code" (ngModelChange)="setPractice(c, $event)" aria-label="Practice">
              <option value="" disabled>Choose a practice…</option>
              @for (p of options(); track p.code) { <option [value]="p.code">{{ p.name }}@if (p.unit) { ({{ p.unit }}) }</option> }
            </select>
            <button type="button" class="btn btn-ghost btn-icon" [disabled]="rows().length === 1" (click)="remove(i)" aria-label="Remove commitment"><vc-icon name="trash" [size]="15" /></button>
          </div>
          <div class="grid4">
            <div class="field"><label>From year</label><input type="number" class="input num" [name]="'cs' + i" [(ngModel)]="c.start_year" min="1990" max="2100" /></div>
            <div class="field"><label>To year</label><input type="number" class="input num" [name]="'ce' + i" [(ngModel)]="c.end_year" min="1990" max="2100" placeholder="Ongoing" /></div>
            <div class="field"><label>Times a year</label><input type="number" class="input num" [name]="'ct' + i" [(ngModel)]="c.times_per_year" min="1" max="52" /></div>
            <div class="field"><label>Amount a year @if (unitOf(c)) { <span class="subtle">({{ unitOf(c) }})</span> }</label>
              <input type="number" class="input num" [name]="'cq' + i" [(ngModel)]="c.expected_quantity" min="0" step="any" [placeholder]="unitOf(c) ? 'Optional' : 'Not measured'" [disabled]="!unitOf(c)" /></div>
          </div>
          <input class="input" [name]="'cn' + i" [(ngModel)]="c.notes" placeholder="Notes for the farmer or field officer (optional)" />
          @if (c.end_year !== null && c.end_year !== undefined && $any(c.end_year) !== '' && c.end_year < c.start_year) { <span class="err small">The end year can't be before the start year.</span> }
        </div>
      }
    </div>
    <button type="button" class="btn btn-secondary btn-sm" (click)="add()"><vc-icon name="plus" [size]="14" />Add a practice</button>
    @if (cropCode() && hidden() > 0) { <p class="small subtle">{{ hidden() }} practice{{ hidden() === 1 ? '' : 's' }} hidden because {{ hidden() === 1 ? 'it doesn\\'t' : 'they don\\'t' }} apply to {{ cropCode() }}.</p> }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:10px}
    .rows{display:flex;flex-direction:column;gap:10px}
    .crow{display:flex;flex-direction:column;gap:10px;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2)}
    .top{display:grid;grid-template-columns:24px 1fr 36px;gap:8px;align-items:center}
    .n{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--forest-100);color:var(--forest-700);font-size:11.5px;font-weight:600}
    .grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
    @media (max-width:640px){.grid4{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .field label{font-size:12px}
    .err{color:var(--danger)}
  `],
})
export class CommitmentsEditor {
  cat = inject(PracticeCatalogue);
  rows = model.required<Commitment[]>();
  cropCode = input<string | null>(null);
  options = computed(() => this.cat.list().filter(p => p.is_active && (!this.cropCode() || !p.crop_codes?.length || p.crop_codes.includes(this.cropCode()!))));
  hidden = computed(() => this.cat.list().filter(p => p.is_active).length - this.options().length);

  constructor() { this.cat.load(); }
  unitOf(c: Commitment) { return this.cat.byCode().get(c.practice_code)?.unit ?? null; }
  setPractice(c: Commitment, code: string) {
    c.practice_code = code;
    c.unit = this.cat.byCode().get(code)?.unit ?? null;
    if (!c.unit) c.expected_quantity = null;
    this.rows.set([...this.rows()]);
  }
  add() { this.rows.set([...this.rows(), blankCommitment()]); }
  remove(i: number) { this.rows.set(this.rows().filter((_, j) => j !== i)); }
}

/** Clean editor rows into the API payload. */
export function commitmentsPayload(rows: Commitment[]) {
  return rows.filter(c => c.practice_code).map(c => ({
    practice_code: c.practice_code, start_year: Number(c.start_year),
    end_year: c.end_year === null || c.end_year === undefined || (c.end_year as unknown) === '' ? null : Number(c.end_year),
    start_season: c.start_season || null, end_season: c.end_season || null, times_per_year: Number(c.times_per_year) || 1,
    expected_quantity: c.expected_quantity === null || (c.expected_quantity as unknown) === '' ? null : Number(c.expected_quantity),
    unit: c.expected_quantity ? c.unit : null, notes: c.notes ?? '',
  }));
}
