import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OfflineStore, QueuedPhoto } from '../../core/offline';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { FieldData, FieldLite, PracticeTypeLite } from './field-data';
import { FIELD_CSS } from './field.styles';
import { FieldGps } from './gps.service';
import { stampPhoto } from './photo';

@Component({
  selector: 'vc-field-practice',
  imports: [FormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fpage">
      <div>
        <div class="ftitle">Record a practice</div>
        <div class="fsub">What the farmer did on a field — for example mulching, cover crop or compost. Works offline.</div>
      </div>

      <section class="fcard fcard-pad form">
        <div>
          <label class="flabel" for="p-field">Field</label>
          <select id="p-field" class="finput" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)">
            <option value="">Choose a field…</option>
            @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }}{{ f.name ? ' · ' + f.name : '' }}</option> }
          </select>
          @if (!fields().length) { <div class="fhint">No fields on this phone yet. Download a campaign from Home, or connect once to load your fields.</div> }
        </div>

        <div>
          <label class="flabel" for="p-type">Practice</label>
          <select id="p-type" class="finput" [ngModel]="typeCode()" (ngModelChange)="setType($event)">
            <option value="">Choose a practice…</option>
            @for (t of types(); track t.code) { <option [value]="t.code">{{ t.name }}</option> }
          </select>
          @if (typesNote()) { <div class="fhint">{{ typesNote() }}</div> }
        </div>

        <div>
          <span class="flabel" id="p-scn">Is this the usual practice, or a new one for the project?</span>
          <div class="scn" role="radiogroup" aria-labelledby="p-scn">
            <button type="button" [class.on]="scenario() === 'baseline'" (click)="scenario.set('baseline')" role="radio" [attr.aria-checked]="scenario() === 'baseline'">
              <strong>Usual (baseline)</strong><em>What the farm did before the project</em>
            </button>
            <button type="button" [class.on]="scenario() === 'project'" (click)="scenario.set('project')" role="radio" [attr.aria-checked]="scenario() === 'project'">
              <strong>New (project)</strong><em>A change made because of the project</em>
            </button>
          </div>
          @if (!scenario()) { <div class="fhint">Required — this is never assumed.</div> }
        </div>

        <div>
          <label class="flabel" for="p-date">Date done</label>
          <input id="p-date" type="date" class="finput" [max]="today" [ngModel]="date()" (ngModelChange)="date.set($event)" />
        </div>

        @if (type(); as t) {
          <div>
            <label class="flabel" for="p-qty">Quantity @if (!t.requires_quantity) { <span class="opt">(optional)</span> }</label>
            <div class="qty">
              <input id="p-qty" type="number" inputmode="decimal" min="0" class="finput num" [ngModel]="qty()" (ngModelChange)="qty.set($event)" />
              <span class="unit">{{ t.unit || 'units' }}</span>
            </div>
          </div>
          @for (a of t.fields; track a.key) {
            <div>
              <label class="flabel" [for]="'x-' + a.key">{{ a.label }} @if (!a.required) { <span class="opt">(optional)</span> }</label>
              @if (a.type === 'choice') {
                <select class="finput" [id]="'x-' + a.key" [ngModel]="extra()[a.key] ?? ''" (ngModelChange)="setExtra(a.key, $event)">
                  <option value="">Choose…</option>
                  @for (c of a.choices; track c) { <option [value]="c">{{ c }}</option> }
                </select>
              } @else {
                <input class="finput" [id]="'x-' + a.key" [type]="a.type === 'number' ? 'number' : 'text'" [ngModel]="extra()[a.key] ?? ''" (ngModelChange)="setExtra(a.key, $event)" />
              }
              @if (a.unit) { <div class="fhint">In {{ a.unit }}</div> }
            </div>
          }
        }

        <div>
          <span class="flabel">Photo @if (!photoRequired()) { <span class="opt">(optional)</span> }</span>
          <label class="shot">
            <input type="file" accept="image/*" capture="environment" (change)="takePhoto($event)" hidden />
            @if (thumb()) { <img [src]="thumb()" alt="Practice photo" /> } @else { <span class="cam"><vc-icon name="camera" [size]="30" /></span> }
            <span><strong>{{ thumb() ? 'Retake photo' : 'Take a photo' }}</strong><em>Stamped with time and position</em></span>
          </label>
        </div>
      </section>

      @if (missing().length) { <p class="fhint">Still needed: {{ missing().join(', ') }}.</p> }
      <button class="fbtn primary block" [disabled]="!!missing().length || busy()" (click)="save()"><vc-icon name="check" [size]="20" />{{ busy() ? 'Saving…' : 'Save practice' }}</button>
    </div>
  `,
  styles: [FIELD_CSS, `
    .form{display:flex;flex-direction:column;gap:18px}
    .opt{font-weight:500;color:var(--stone-500)}
    .scn{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .scn button{display:flex;flex-direction:column;gap:3px;align-items:flex-start;text-align:left;min-height:76px;padding:12px;border:2px solid var(--stone-300);border-radius:12px;background:#fff;font:inherit;cursor:pointer;color:var(--stone-900)}
    .scn button.on{border-color:var(--forest-700);background:var(--forest-50);box-shadow:inset 0 0 0 1px var(--forest-700)}
    .scn strong{font-size:15.5px} .scn em{font-style:normal;font-size:13px;color:var(--stone-600)}
    .qty{display:flex;align-items:center;gap:10px}
    .unit{font-weight:600;color:var(--stone-700);min-width:60px}
    .shot{display:flex;align-items:center;gap:14px;padding:10px;border:2px dashed var(--stone-300);border-radius:12px;cursor:pointer}
    .shot img,.cam{width:88px;height:66px;border-radius:10px;object-fit:cover;flex:none}
    .cam{display:grid;place-items:center;background:var(--forest-800);color:#fff}
    .shot span{display:flex;flex-direction:column}
    .shot strong{font-size:16px} .shot em{font-style:normal;font-size:13.5px;color:var(--stone-600)}
    @media (max-width:380px){.scn{grid-template-columns:1fr}}
  `],
})
export class FieldPractice implements OnDestroy {
  private router = inject(Router);
  private toast = inject(ToastService);
  private store = inject(OfflineStore);
  private data = inject(FieldData);
  private gps = inject(FieldGps);

  today = new Date().toISOString().slice(0, 10);
  types = signal<PracticeTypeLite[]>(this.data.practiceTypes());
  typesNote = signal<string | null>(null);
  fields = signal<FieldLite[]>(this.data.fields());
  fieldId = signal('');
  typeCode = signal('');
  scenario = signal<'baseline' | 'project' | ''>('');
  date = signal(this.today);
  qty = signal<number | null>(null);
  extra = signal<Record<string, string>>({});
  photo = signal<QueuedPhoto | null>(null);
  thumb = signal<string | null>(null);
  busy = signal(false);

  type = computed(() => this.types().find(t => t.code === this.typeCode()) ?? null);
  photoRequired = computed(() => (this.type()?.required_evidence ?? []).some(e => /photo/i.test(e)));
  missing = computed(() => {
    const m: string[] = [];
    if (!this.fieldId()) m.push('field');
    if (!this.typeCode()) m.push('practice');
    if (!this.scenario()) m.push('usual or new');
    if (!this.date()) m.push('date');
    const t = this.type();
    if (t?.requires_quantity && (this.qty() === null || `${this.qty()}` === '')) m.push('quantity');
    for (const a of t?.fields ?? []) if (a.required && !`${this.extra()[a.key] ?? ''}`.trim()) m.push(a.label.toLowerCase());
    if (this.photoRequired() && !this.photo()) m.push('photo');
    return m;
  });

  constructor() {
    this.gps.start();
    void this.data.refreshBundles().then(() => this.fields.set(this.data.fields()));
    if (navigator.onLine) {
      this.data.loadPracticeTypes().then(t => this.types.set(t)).catch(() => this.typesNote.set('Showing the practice list saved on this phone.'));
      this.data.loadFields().then(() => this.fields.set(this.data.fields())).catch(() => {});
    } else if (this.types().length) {
      this.typesNote.set('Offline — showing the practice list saved on this phone.');
    } else {
      this.typesNote.set('Connect once to load the list of practices.');
    }
  }

  setType(code: string) {
    this.typeCode.set(code);
    this.extra.set({});
    this.qty.set(null);
  }

  setExtra(k: string, v: string) {
    this.extra.update(e => ({ ...e, [k]: v }));
  }

  async takePhoto(ev: Event) {
    const inp = ev.target as HTMLInputElement;
    const file = inp.files?.[0];
    inp.value = '';
    if (!file) return;
    const f = this.gps.fix();
    const at = new Date();
    try {
      const blob = await stampPhoto(file, { title: this.type()?.name ?? 'Practice', at, lat: f?.lat ?? null, lon: f?.lon ?? null, acc: f?.accuracy });
      if (this.thumb()) URL.revokeObjectURL(this.thumb()!);
      this.thumb.set(URL.createObjectURL(blob));
      this.photo.set({ kind: 'extra', blob, name: `practice-${at.getTime()}.jpg`, type: 'image/jpeg', takenAt: at.toISOString(), lat: f?.lat ?? null, lon: f?.lon ?? null });
    } catch (e) {
      this.toast.error("Couldn't use that photo", (e as Error).message);
    }
  }

  async save() {
    const t = this.type();
    const field = this.fields().find(f => f.id === this.fieldId());
    if (!t || !field) return;
    this.busy.set(true);
    const extra: Record<string, unknown> = {};
    for (const a of t.fields) {
      const v = this.extra()[a.key];
      if (v !== undefined && `${v}`.trim() !== '') extra[a.key] = a.type === 'number' ? Number(v) : v;
    }
    try {
      await this.store.queuePractice({
        localId: `prc-${crypto.randomUUID()}`,
        label: `${t.name} · ${field.code}`,
        payload: {
          field_id: field.id, practice_code: t.code, scenario: this.scenario(), performed_on: this.date(),
          quantity: this.qty() === null || `${this.qty()}` === '' ? null : Number(this.qty()), unit: t.unit, extra, source: 'field_app',
        },
        photos: this.photo() ? [this.photo()!] : [],
      });
      this.toast.success('Practice saved', this.store.online() ? 'Uploading now.' : 'It will upload when you have signal.');
      this.router.navigate(['/field/outbox']);
    } catch (e) {
      this.toast.error("Couldn't save on this phone", (e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }

  ngOnDestroy(): void {
    this.gps.stop();
    if (this.thumb()) URL.revokeObjectURL(this.thumb()!);
  }
}
