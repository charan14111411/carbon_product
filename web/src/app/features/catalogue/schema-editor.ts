import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../ui/icon';
import { AttrDef } from '../fields/field-data';

export function slugKey(label: string): string {
  const s = label.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
  return /^[a-z]/.test(s) ? s : s ? `f_${s}`.slice(0, 40) : '';
}

/** Problems the server would reject, so they can be fixed before saving. */
export function schemaProblems(defs: AttrDef[]): string[] {
  const out: string[] = [];
  const keys = defs.map(d => d.key);
  defs.forEach((d, i) => {
    const n = `Item ${i + 1}`;
    if (!d.label.trim()) out.push(`${n}: add a label.`);
    if (!/^[a-z][a-z0-9_]{0,39}$/.test(d.key)) out.push(`${n}: the key must start with a letter and use only a–z, 0–9 and _.`);
    if (d.type === 'choice' && !d.choices.length) out.push(`${d.label || n}: a choice needs at least one option.`);
    if (d.min !== null && d.min !== undefined && d.max !== null && d.max !== undefined && d.min > d.max) out.push(`${d.label || n}: minimum is greater than maximum.`);
  });
  const dupes = [...new Set(keys.filter((k, i) => k && keys.indexOf(k) !== i))];
  if (dupes.length) out.push(`Keys must be unique (repeated: ${dupes.join(', ')}).`);
  return out;
}

/** Edit a list of {key, label, type, required, choices, unit, min, max} definitions. */
@Component({
  selector: 'vc-schema-editor',
  imports: [FormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list">
      @for (d of defs(); track $index; let i = $index) {
        <div class="item" [class.open]="expanded() === i">
          <div class="head" (click)="expanded.set(expanded() === i ? -1 : i)">
            <span [class]="'type t-' + d.type">{{ d.type === 'number' ? '123' : d.type === 'choice' ? '≡' : 'Aa' }}</span>
            <span class="lbl">{{ d.label || 'Untitled ' + noun() }}</span>
            <code class="key">{{ d.key || '—' }}</code>
            @if (d.required) { <span class="req">Required</span> }
            @if (d.unit) { <span class="unit">{{ d.unit }}</span> }
            <span class="grow"></span>
            <button type="button" class="ib" (click)="move(i, -1); $event.stopPropagation()" [disabled]="i === 0" aria-label="Move up"><vc-icon name="arrow-up" [size]="13" /></button>
            <button type="button" class="ib" (click)="move(i, 1); $event.stopPropagation()" [disabled]="i === defs().length - 1" aria-label="Move down"><vc-icon name="arrow-down" [size]="13" /></button>
            <button type="button" class="ib del" (click)="remove(i); $event.stopPropagation()" aria-label="Remove"><vc-icon name="trash" [size]="13" /></button>
            <vc-icon [name]="expanded() === i ? 'chevron-down' : 'chevron-right'" [size]="14" />
          </div>
          @if (expanded() === i) {
            <div class="body">
              <div class="grid">
                <div class="field"><label>Label</label><input class="input" [ngModel]="d.label" (ngModelChange)="setLabel(i, $event)" placeholder="e.g. Tree age" /></div>
                <div class="field"><label>Key <span class="subtle">(used in data)</span></label><input class="input mono" [ngModel]="d.key" (ngModelChange)="patch(i, { key: $event })" /></div>
                <div class="field">
                  <label>Type</label>
                  <select class="input" [ngModel]="d.type" (ngModelChange)="patch(i, { type: $event })">
                    <option value="text">Text</option><option value="number">Number</option><option value="choice">Choice from a list</option>
                  </select>
                </div>
                <div class="field chk"><label class="checkbox"><input type="checkbox" [ngModel]="d.required" (ngModelChange)="patch(i, { required: $event })" />Required</label></div>
                @if (d.type === 'number') {
                  <div class="field"><label>Unit</label><input class="input" [ngModel]="d.unit ?? ''" (ngModelChange)="patch(i, { unit: $event || null })" placeholder="e.g. years, kg/ha" /></div>
                  <div class="field"><label>Minimum</label><input type="number" class="input num" [ngModel]="d.min" (ngModelChange)="patch(i, { min: $event === '' || $event === null ? null : +$event })" /></div>
                  <div class="field"><label>Maximum</label><input type="number" class="input num" [ngModel]="d.max" (ngModelChange)="patch(i, { max: $event === '' || $event === null ? null : +$event })" /></div>
                }
                @if (d.type === 'choice') {
                  <div class="field wide">
                    <label>Options</label>
                    <div class="chips-in">
                      @for (c of d.choices; track c) { <span class="ch">{{ c }}<button type="button" (click)="removeChoice(i, c)" aria-label="Remove option"><vc-icon name="x" [size]="11" /></button></span> }
                      <input class="bare" [ngModel]="draft()" (ngModelChange)="draft.set($event)" (keydown.enter)="addChoice(i, $event)" (blur)="addChoice(i)" placeholder="Type an option and press Enter" />
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @empty {
        <div class="empty subtle small">No {{ noun() }}s yet. {{ emptyHint() }}</div>
      }
    </div>
    <button type="button" class="btn btn-secondary btn-sm add" (click)="add()"><vc-icon name="plus" [size]="14" />Add {{ noun() }}</button>
  `,
  styles: [`
    :host{display:block}
    .list{display:flex;flex-direction:column;gap:6px}
    .item{border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface)}
    .item.open{border-color:var(--forest-300);box-shadow:0 0 0 3px rgba(47,114,73,.08)}
    .head{display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;min-width:0}
    .type{display:grid;place-items:center;width:28px;height:22px;border-radius:5px;font:600 10.5px var(--mono);background:var(--stone-100);color:var(--stone-600);flex:none}
    .t-number{background:var(--sky-100);color:var(--sky-600)} .t-choice{background:var(--violet-100);color:var(--violet-600)}
    .lbl{font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .key{font-size:11.5px;color:var(--text-3)}
    .req{font-size:11px;padding:1px 6px;border-radius:4px;background:var(--clay-50);color:var(--clay-700);border:1px solid var(--clay-100)}
    .unit{font-size:11px;color:var(--text-3)}
    .grow{flex:1}
    .ib{display:grid;place-items:center;width:24px;height:24px;border:0;border-radius:5px;background:none;color:var(--stone-500);cursor:pointer}
    .ib:hover:not([disabled]){background:var(--sand-200);color:var(--stone-800)} .ib[disabled]{opacity:.35;cursor:default}
    .ib.del:hover{background:var(--danger-soft);color:var(--danger)}
    .body{padding:4px 12px 12px;border-top:1px solid var(--stone-100)}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px;margin-top:10px}
    .grid .wide{grid-column:1/-1}
    .chk{justify-content:flex-end;padding-bottom:8px}
    .chips-in{display:flex;flex-wrap:wrap;gap:6px;align-items:center;min-height:38px;padding:5px 8px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface)}
    .chips-in:focus-within{border-color:var(--forest-500);box-shadow:var(--focus)}
    .ch{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 4px 0 8px;border-radius:5px;background:var(--violet-100);color:var(--violet-600);font-size:12.5px}
    .ch button{display:grid;place-items:center;border:0;background:none;color:inherit;cursor:pointer;padding:2px;border-radius:3px;opacity:.7}
    .ch button:hover{opacity:1;background:rgba(91,71,168,.12)}
    .bare{flex:1;min-width:140px;border:0;outline:none;font:inherit;background:none;height:24px}
    .empty{padding:14px;border:1px dashed var(--border-strong);border-radius:var(--radius-sm);text-align:center}
    .add{margin-top:8px}
  `],
})
export class SchemaEditor {
  defs = model<AttrDef[]>([]);
  noun = input('attribute');
  emptyHint = input('');
  expanded = signal(-1);
  draft = signal('');

  add() {
    this.defs.update(d => [...d, { key: '', label: '', type: 'text', required: false, choices: [], unit: null, min: null, max: null }]);
    this.expanded.set(this.defs().length - 1);
  }
  remove(i: number) { this.defs.update(d => d.filter((_, k) => k !== i)); this.expanded.set(-1); }
  move(i: number, dir: number) {
    const d = [...this.defs()];
    const j = i + dir;
    [d[i], d[j]] = [d[j], d[i]];
    this.defs.set(d);
    if (this.expanded() === i) this.expanded.set(j);
  }
  patch(i: number, p: Partial<AttrDef>) {
    this.defs.update(d => d.map((x, k) => {
      if (k !== i) return x;
      const n = { ...x, ...p };
      if (p.type && p.type !== 'choice') n.choices = [];
      if (p.type && p.type !== 'number') { n.unit = null; n.min = null; n.max = null; }
      return n;
    }));
  }
  setLabel(i: number, label: string) {
    const d = this.defs()[i];
    const auto = !d.key || d.key === slugKey(d.label);
    this.patch(i, auto ? { label, key: slugKey(label) } : { label });
  }
  addChoice(i: number, ev?: Event) {
    ev?.preventDefault();
    const v = this.draft().trim().replace(/,$/, '');
    if (!v) return;
    const d = this.defs()[i];
    if (!d.choices.includes(v)) this.patch(i, { choices: [...d.choices, v] });
    this.draft.set('');
  }
  removeChoice(i: number, c: string) { this.patch(i, { choices: this.defs()[i].choices.filter(x => x !== c) }); }
}
