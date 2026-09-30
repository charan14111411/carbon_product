import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AttrDef } from './field-data';

/** Renders inputs for a catalogue-defined attribute schema. Values are two-way bound as one object. */
@Component({
  selector: 'vc-attr-inputs',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-grid">
      @for (d of defs(); track d.key) {
        <div class="field">
          <label [for]="'a-' + d.key">{{ d.label }}@if (d.required) { <span class="req">*</span> }</label>
          @switch (d.type) {
            @case ('number') {
              <div class="unit-wrap">
                <input class="input num" type="number" [id]="'a-' + d.key" [ngModel]="values()[d.key]"
                  (ngModelChange)="set(d.key, $event === '' || $event === null ? null : +$event)"
                  [attr.min]="d.min ?? null" [attr.max]="d.max ?? null" />
                @if (d.unit) { <span class="unit">{{ d.unit }}</span> }
              </div>
              @if (d.min !== null && d.min !== undefined || d.max !== null && d.max !== undefined) {
                <span class="hint">Between {{ d.min ?? '—' }} and {{ d.max ?? '—' }}{{ d.unit ? ' ' + d.unit : '' }}</span>
              }
            }
            @case ('choice') {
              <select class="input" [id]="'a-' + d.key" [ngModel]="values()[d.key] ?? ''" (ngModelChange)="set(d.key, $event || null)">
                <option value="">Choose…</option>
                @for (c of d.choices; track c) { <option [value]="c">{{ c }}</option> }
              </select>
            }
            @default {
              <input class="input" [id]="'a-' + d.key" [ngModel]="values()[d.key] ?? ''" (ngModelChange)="set(d.key, $event || null)" />
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .req{color:var(--danger);margin-left:2px}
    .unit-wrap{position:relative}
    .unit-wrap .input{padding-right:52px}
    .unit{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--text-3);pointer-events:none}
  `],
})
export class AttrInputs {
  defs = input<AttrDef[]>([]);
  values = model<Record<string, unknown>>({});

  set(key: string, v: unknown) {
    const next = { ...this.values() };
    if (v === null || v === undefined || v === '') delete next[key];
    else next[key] = v;
    this.values.set(next);
  }
}

/** Client-side check mirroring the server's attribute validation (server stays authoritative). */
export function missingRequired(defs: AttrDef[], values: Record<string, unknown>): string[] {
  return defs.filter(d => d.required && (values[d.key] === undefined || values[d.key] === null || values[d.key] === '')).map(d => d.label);
}
