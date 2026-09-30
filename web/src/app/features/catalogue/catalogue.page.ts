import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { HumanPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, ErrorBox, Loading, Modal, PageHeader, Tabs } from '../../ui/kit';
import { Chip } from '../fields/chip';
import { AttrDef, CROP_CATEGORIES, Crop, PRACTICE_CATEGORIES, PracticeType } from '../fields/field-data';
import { SchemaEditor, schemaProblems } from './schema-editor';

const CODE_RE = /^[a-z][a-z0-9_]{1,39}$/;
const EVIDENCE_KINDS = ['photo', 'invoice', 'receipt', 'delivery_note', 'geotagged_photo', 'document'];

interface CropDraft { id?: string; code: string; name: string; local_name: string; category: string; attributes: AttrDef[] }
interface PtDraft {
  id?: string; code: string; name: string; category: string; description: string; crop_codes: string[]; unit: string;
  requires_quantity: boolean; required_evidence: string[]; fields: AttrDef[]; emission_factor_keys: string;
}

@Component({
  selector: 'vc-catalogue-page',
  imports: [FormsModule, PageHeader, Tabs, Loading, ErrorBox, Empty, Badge, Modal, Callout, Icon, Chip, SchemaEditor, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Crops & practices catalogue" eyebrow="Land"
      subtitle="The crops you work with and the practices farmers can record. Attributes you define here become the questions asked in the field app.">
 <ng-container actions>
      @if (canManage()) {
        <button class="btn btn-secondary" (click)="defaultsOpen.set(true)"><vc-icon name="sparkles" />Install recommended defaults</button>
        <button class="btn btn-primary" (click)="tab() === 'crops' ? newCrop() : newPt()"><vc-icon name="plus" />{{ tab() === 'crops' ? 'Add crop' : 'Add practice type' }}</button>
      }
      </ng-container>
    </vc-page-header>

    <vc-tabs [tabs]="tabItems()" [(active)]="tab" />

    <div class="filters">
      <div class="search"><vc-icon name="search" [size]="15" /><input class="input" [placeholder]="tab() === 'crops' ? 'Search crops…' : 'Search practices…'" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
      <div class="cats">
        <button type="button" class="cat" [class.on]="!cat()" (click)="cat.set('')">All</button>
        @for (c of tab() === 'crops' ? cropCats : ptCats; track c) {
          <button type="button" class="cat" [class.on]="cat() === c" (click)="cat.set(cat() === c ? '' : c)">{{ c | human }}</button>
        }
      </div>
      <label class="checkbox small"><input type="checkbox" [ngModel]="showInactive()" (ngModelChange)="showInactive.set($event)" />Show inactive</label>
    </div>

    <section class="card">
      @if (loading()) { <vc-loading [rows]="7" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load the catalogue" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div> }
      @else if (tab() === 'crops') {
        @if (!crops().length) {
          <vc-empty icon="wheat" title="No crops yet" text="Install the recommended defaults for common Indian crops, or add your own.">
            @if (canManage()) { <button class="btn btn-primary" (click)="defaultsOpen.set(true)"><vc-icon name="sparkles" />Install defaults</button> }
          </vc-empty>
        } @else if (!cropRows().length) {
          <vc-empty icon="search" title="No crops match" text="Try another search or category." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Crop</th><th>Category</th><th>Attributes asked in the field</th><th>Status</th>@if (canManage()) { <th></th> }</tr></thead>
              <tbody>
                @for (c of cropRows(); track c.id) {
                  <tr [class.inactive]="!c.is_active">
                    <td><div class="nm">{{ c.name }}@if (c.local_name) { <span class="local">{{ c.local_name }}</span> }</div><code class="code">{{ c.code }}</code></td>
                    <td><vc-chip [cat]="c.category">{{ c.category | human }}</vc-chip></td>
                    <td>
                      <div class="attrs">
                        @for (a of c.attributes.slice(0, 4); track a.key) { <span class="attr" [title]="a.type + (a.required ? ', required' : '')">{{ a.label }}@if (a.required) {<span class="star">*</span>}</span> }
                        @if (c.attributes.length > 4) { <span class="subtle small">+{{ c.attributes.length - 4 }} more</span> }
                        @if (!c.attributes.length) { <span class="subtle small">None</span> }
                      </div>
                    </td>
                    <td><vc-badge [status]="c.is_active ? 'active' : 'inactive'" /></td>
                    @if (canManage()) {
                      <td class="num nowrap">
                        <button class="btn btn-ghost btn-sm" (click)="editCrop(c)"><vc-icon name="pencil" [size]="14" />Edit</button>
                        <button class="btn btn-ghost btn-sm" (click)="askToggle('crop', c)">{{ c.is_active ? 'Deactivate' : 'Activate' }}</button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      } @else {
        @if (!pts().length) {
          <vc-empty icon="sprout" title="No practice types yet" text="Install the recommended defaults (tillage, residue, nutrients, water, trees…) or add your own.">
            @if (canManage()) { <button class="btn btn-primary" (click)="defaultsOpen.set(true)"><vc-icon name="sparkles" />Install defaults</button> }
          </vc-empty>
        } @else if (!ptRows().length) {
          <vc-empty icon="search" title="No practices match" text="Try another search or category." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Practice</th><th>Category</th><th>Applies to</th><th>Quantity</th><th>Evidence required</th><th class="num">Details</th><th>Status</th>@if (canManage()) { <th></th> }</tr></thead>
              <tbody>
                @for (p of ptRows(); track p.id) {
                  <tr [class.inactive]="!p.is_active">
                    <td class="pcell"><div class="nm">{{ p.name }}</div><code class="code">{{ p.code }}</code>@if (p.description) { <div class="desc">{{ p.description }}</div> }</td>
                    <td><vc-chip [cat]="p.category">{{ p.category | human }}</vc-chip></td>
                    <td>
                      @if (!p.crop_codes.length) { <span class="muted small">All crops</span> }
                      @else { <div class="attrs">@for (c of p.crop_codes.slice(0, 3); track c) { <span class="attr">{{ cropName(c) }}</span> }@if (p.crop_codes.length > 3) { <span class="subtle small">+{{ p.crop_codes.length - 3 }}</span> }</div> }
                    </td>
                    <td class="nowrap">@if (p.requires_quantity) { <span>Required</span> <span class="subtle">· {{ p.unit }}</span> } @else if (p.unit) { <span class="muted">Optional · {{ p.unit }}</span> } @else { <span class="subtle">—</span> }</td>
                    <td>@for (e of p.required_evidence; track e) { <vc-chip tone="amber">{{ e | human }}</vc-chip> } @empty { <span class="subtle">—</span> }</td>
                    <td class="num">{{ p.fields.length || '—' }}</td>
                    <td><vc-badge [status]="p.is_active ? 'active' : 'inactive'" /></td>
                    @if (canManage()) {
                      <td class="num nowrap">
                        <button class="btn btn-ghost btn-sm" (click)="editPt(p)"><vc-icon name="pencil" [size]="14" />Edit</button>
                        <button class="btn btn-ghost btn-sm" (click)="askToggle('pt', p)">{{ p.is_active ? 'Deactivate' : 'Activate' }}</button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </section>

    <!-- crop modal -->
    <vc-modal [(open)]="cropOpen" [title]="cropD().id ? 'Edit crop' : 'Add a crop'" width="680px"
      subtitle="Attributes are the details collected for every field growing this crop.">
      <div class="stack">
        <div class="form-grid">
          <div class="field"><label for="c-name">Name</label><input id="c-name" class="input" [ngModel]="cropD().name" (ngModelChange)="setCrop({ name: $event }, true)" placeholder="e.g. Finger millet" /></div>
          <div class="field"><label for="c-local">Local name <span class="subtle">(optional)</span></label><input id="c-local" class="input" [ngModel]="cropD().local_name" (ngModelChange)="setCrop({ local_name: $event })" placeholder="e.g. Ragi" /></div>
          <div class="field">
            <label for="c-code">Code</label>
            <input id="c-code" class="input mono" [ngModel]="cropD().code" (ngModelChange)="setCrop({ code: $event })" [disabled]="!!cropD().id" />
            <span class="hint">{{ cropD().id ? "Codes can't change once records use them." : 'Lower-case letters, digits and _.' }}</span>
          </div>
          <div class="field">
            <label for="c-cat">Category</label>
            <select id="c-cat" class="input" [ngModel]="cropD().category" (ngModelChange)="setCrop({ category: $event })">
              @for (c of cropCats; track c) { <option [value]="c">{{ c | human }}</option> }
            </select>
          </div>
        </div>
        <div>
          <div class="label sec">Field attributes</div>
          <vc-schema-editor [defs]="cropD().attributes" (defsChange)="setCrop({ attributes: $event })" noun="attribute" emptyHint="For example tree age, variety or irrigation." />
        </div>
        @for (p of cropProblems(); track p) { <div class="err small">{{ p }}</div> }
        @if (saveError()) { <vc-callout tone="danger" icon="alert">{{ saveError() }}</vc-callout> }
      </div>
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="cropOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!cropValid() || saving()" (click)="saveCrop()">{{ saving() ? 'Saving…' : cropD().id ? 'Save changes' : 'Add crop' }}</button>
      </div>
    </vc-modal>

    <!-- practice type modal -->
    <vc-modal [(open)]="ptOpen" [title]="ptD().id ? 'Edit practice type' : 'Add a practice type'" width="760px"
      subtitle="Defines what is asked when this practice is recorded, and which evidence proves it.">
      <div class="stack">
        <div class="form-grid">
          <div class="field"><label for="t-name">Name</label><input id="t-name" class="input" [ngModel]="ptD().name" (ngModelChange)="setPt({ name: $event }, true)" placeholder="e.g. Cover cropping" /></div>
          <div class="field">
            <label for="t-code">Code</label>
            <input id="t-code" class="input mono" [ngModel]="ptD().code" (ngModelChange)="setPt({ code: $event })" [disabled]="!!ptD().id" />
          </div>
          <div class="field">
            <label for="t-cat">Category</label>
            <select id="t-cat" class="input" [ngModel]="ptD().category" (ngModelChange)="setPt({ category: $event })">
              @for (c of ptCats; track c) { <option [value]="c">{{ c | human }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="t-unit">Unit <span class="subtle">(if measured)</span></label>
            <input id="t-unit" class="input" [ngModel]="ptD().unit" (ngModelChange)="setPt({ unit: $event })" placeholder="e.g. kg, t/ha, L" />
          </div>
          <div class="field span-2">
            <label class="checkbox"><input type="checkbox" [ngModel]="ptD().requires_quantity" (ngModelChange)="setPt({ requires_quantity: $event })" />A quantity must be entered every time</label>
          </div>
          <div class="field span-2"><label for="t-desc">Description</label><textarea id="t-desc" class="input" rows="2" [ngModel]="ptD().description" (ngModelChange)="setPt({ description: $event })" placeholder="Plain-language explanation shown to field staff"></textarea></div>
          <div class="field span-2">
            <span class="label">Applies to crops</span>
            <div class="pick">
              <button type="button" class="pk" [class.on]="!ptD().crop_codes.length" (click)="setPt({ crop_codes: [] })">All crops</button>
              @for (c of activeCrops(); track c.code) {
                <button type="button" class="pk" [class.on]="ptD().crop_codes.includes(c.code)" (click)="toggleIn('crop_codes', c.code)">{{ c.name }}</button>
              }
            </div>
          </div>
          <div class="field span-2">
            <span class="label">Evidence required</span>
            <div class="pick">
              @for (e of evidenceKinds(); track e) {
                <button type="button" class="pk" [class.on]="ptD().required_evidence.includes(e)" (click)="toggleIn('required_evidence', e)">{{ e | human }}</button>
              }
            </div>
            <span class="hint">Records without these are flagged as missing evidence.</span>
          </div>
          <div class="field span-2">
            <label for="t-ef">Emission factor keys <span class="subtle">(optional, comma-separated)</span></label>
            <input id="t-ef" class="input mono" [ngModel]="ptD().emission_factor_keys" (ngModelChange)="setPt({ emission_factor_keys: $event })" placeholder="e.g. n2o_direct_synthetic" />
          </div>
        </div>
        <div>
          <div class="label sec">Details asked when recording</div>
          <vc-schema-editor [defs]="ptD().fields" (defsChange)="setPt({ fields: $event })" noun="detail" emptyHint="For example the fertiliser product or the cover crop species." />
        </div>
        @for (p of ptProblems(); track p) { <div class="err small">{{ p }}</div> }
        @if (saveError()) { <vc-callout tone="danger" icon="alert">{{ saveError() }}</vc-callout> }
      </div>
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="ptOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!ptValid() || saving()" (click)="savePt()">{{ saving() ? 'Saving…' : ptD().id ? 'Save changes' : 'Add practice type' }}</button>
      </div>
    </vc-modal>

    <!-- activate / deactivate -->
    <vc-modal [(open)]="toggleOpen" [title]="toggleTarget()?.active ? 'Deactivate ' + toggleTarget()?.name + '?' : 'Activate ' + toggleTarget()?.name + '?'" width="480px">
      @if (toggleTarget()?.active) {
        <p>It will no longer be offered for new {{ toggleTarget()?.kind === 'crop' ? 'fields' : 'practice records' }}. Existing records keep it, and you can activate it again at any time.</p>
      } @else {
        <p>It becomes available again for new {{ toggleTarget()?.kind === 'crop' ? 'fields' : 'practice records' }}.</p>
      }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="toggleOpen.set(false)">Cancel</button>
        <button class="btn" [class.btn-danger]="toggleTarget()?.active" [class.btn-primary]="!toggleTarget()?.active" [disabled]="saving()" (click)="doToggle()">
          {{ toggleTarget()?.active ? 'Deactivate' : 'Activate' }}
        </button>
      </div>
    </vc-modal>

    <!-- defaults -->
    <vc-modal [(open)]="defaultsOpen" title="Install recommended defaults?" width="520px">
      <p>Adds a starter set of common crops (field crops, horticulture, plantations, rice) and regenerative practice types with sensible attributes and evidence rules.</p>
      <ul class="bul">
        <li>Only items you don't already have are added — nothing existing is changed.</li>
        <li>You can edit or deactivate anything afterwards.</li>
      </ul>
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="defaultsOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving()" (click)="installDefaults()"><vc-icon name="sparkles" />{{ saving() ? 'Installing…' : 'Install defaults' }}</button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .filters{display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
    .search{position:relative;flex:0 1 300px;min-width:200px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    .cats{display:flex;gap:4px;flex-wrap:wrap;flex:1}
    .cat{height:30px;padding:0 11px;border:1px solid var(--border-strong);border-radius:999px;background:var(--surface);font:inherit;font-size:12.5px;color:var(--stone-700);cursor:pointer}
    .cat:hover{border-color:var(--stone-400)} .cat.on{background:var(--forest-600);border-color:var(--forest-600);color:#fff}
    .nm{font-weight:500} .local{margin-left:8px;font-weight:400;color:var(--text-3);font-size:12.5px}
    .code{font-size:11.5px;color:var(--text-3)}
    .desc{font-size:12px;color:var(--text-2);margin-top:3px;max-width:340px;line-height:1.4}
    .pcell{max-width:360px}
    .attrs{display:flex;gap:4px;flex-wrap:wrap;align-items:center}
    .attr{font-size:12px;padding:2px 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);color:var(--stone-700)}
    .star{color:var(--clay-600);margin-left:1px}
    tr.inactive td{opacity:.6}
    tr.inactive td:last-child{opacity:1}
    td vc-chip + vc-chip{margin-left:4px}
    .sec{margin-bottom:8px;display:block}
    .pick{display:flex;gap:6px;flex-wrap:wrap}
    .pk{height:30px;padding:0 11px;border:1px solid var(--border-strong);border-radius:7px;background:var(--surface);font:inherit;font-size:12.5px;color:var(--stone-700);cursor:pointer}
    .pk:hover{border-color:var(--stone-400)}
    .pk.on{border-color:var(--forest-500);background:var(--forest-50);color:var(--forest-700);box-shadow:0 0 0 1px var(--forest-500) inset}
    .err{color:var(--danger)}
    .bul{margin:10px 0 0;padding-left:18px;color:var(--stone-700);display:flex;flex-direction:column;gap:4px}
    .ft{display:flex;gap:8px}
  `],
})
export class CataloguePage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  cropCats = CROP_CATEGORIES;
  ptCats = PRACTICE_CATEGORIES;
  crops = signal<Crop[]>([]);
  pts = signal<PracticeType[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  tab = signal('crops');
  q = signal('');
  cat = signal('');
  showInactive = signal(true);
  saving = signal(false);
  saveError = signal<string | null>(null);

  canManage = computed(() => this.auth.can('catalogue.manage'));
  tabItems = computed(() => [
    { key: 'crops', label: 'Crops', count: this.crops().length },
    { key: 'practices', label: 'Practice types', count: this.pts().length },
  ]);
  activeCrops = computed(() => this.crops().filter(c => c.is_active));
  cropRows = computed(() => {
    const q = this.q().toLowerCase().trim();
    return this.crops().filter(c => (this.showInactive() || c.is_active) && (!this.cat() || c.category === this.cat()) &&
      (!q || `${c.name} ${c.local_name ?? ''} ${c.code}`.toLowerCase().includes(q)));
  });
  ptRows = computed(() => {
    const q = this.q().toLowerCase().trim();
    return this.pts().filter(p => (this.showInactive() || p.is_active) && (!this.cat() || p.category === this.cat()) &&
      (!q || `${p.name} ${p.code} ${p.description}`.toLowerCase().includes(q)));
  });
  evidenceKinds = computed(() => [...new Set([...EVIDENCE_KINDS, ...this.pts().flatMap(p => p.required_evidence), ...this.ptD().required_evidence])]);

  // crop form
  cropOpen = signal(false);
  cropD = signal<CropDraft>({ code: '', name: '', local_name: '', category: 'field', attributes: [] });
  cropProblems = computed(() => schemaProblems(this.cropD().attributes));
  cropValid = computed(() => !!this.cropD().name.trim() && CODE_RE.test(this.cropD().code) && !this.cropProblems().length);

  // practice type form
  ptOpen = signal(false);
  ptD = signal<PtDraft>(this.blankPt());
  ptProblems = computed(() => {
    const p = schemaProblems(this.ptD().fields);
    if (this.ptD().requires_quantity && !this.ptD().unit.trim()) p.unshift('A practice that needs a quantity must say which unit it is measured in.');
    return p;
  });
  ptValid = computed(() => !!this.ptD().name.trim() && CODE_RE.test(this.ptD().code) && !this.ptProblems().length);

  toggleOpen = signal(false);
  toggleTarget = signal<{ kind: 'crop' | 'pt'; id: string; name: string; active: boolean } | null>(null);
  defaultsOpen = signal(false);

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    let pending = 2;
    const done = () => { if (--pending === 0) this.loading.set(false); };
    const fail = (e: ApiError) => { this.error.set(e.message); done(); };
    this.api.get<Crop[]>('/catalogue/crops', { include_inactive: true }).subscribe({ next: r => { this.crops.set(r); done(); }, error: fail });
    this.api.get<PracticeType[]>('/catalogue/practice-types', { include_inactive: true }).subscribe({ next: r => { this.pts.set(r); done(); }, error: fail });
  }

  cropName(code: string) { return this.crops().find(c => c.code === code)?.name ?? code; }

  private slug(s: string) { const k = s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40); return /^[a-z]/.test(k) ? k : ''; }
  private blankPt(): PtDraft {
    return { code: '', name: '', category: 'soil', description: '', crop_codes: [], unit: '', requires_quantity: false, required_evidence: [], fields: [], emission_factor_keys: '' };
  }

  newCrop() { this.saveError.set(null); this.cropD.set({ code: '', name: '', local_name: '', category: 'field', attributes: [] }); this.cropOpen.set(true); }
  editCrop(c: Crop) {
    this.saveError.set(null);
    this.cropD.set({ id: c.id, code: c.code, name: c.name, local_name: c.local_name ?? '', category: c.category, attributes: c.attributes.map(a => ({ ...a, choices: [...(a.choices ?? [])] })) });
    this.cropOpen.set(true);
  }
  setCrop(p: Partial<CropDraft>, autoCode = false) {
    this.cropD.update(d => {
      const n = { ...d, ...p };
      if (autoCode && !d.id && (!d.code || d.code === this.slug(d.name))) n.code = this.slug(n.name);
      return n;
    });
  }
  saveCrop() {
    const d = this.cropD();
    const body = { name: d.name.trim(), local_name: d.local_name.trim() || null, category: d.category, attributes: d.attributes };
    this.saving.set(true);
    this.saveError.set(null);
    const req = d.id ? this.api.patch<Crop>(`/catalogue/crops/${d.id}`, body) : this.api.post<Crop>('/catalogue/crops', { ...body, code: d.code });
    req.subscribe({
      next: c => { this.saving.set(false); this.cropOpen.set(false); this.toast.success(d.id ? `${c.name} updated` : `${c.name} added`); this.load(); },
      error: (e: ApiError) => { this.saving.set(false); this.saveError.set(e.message); },
    });
  }

  newPt() { this.saveError.set(null); this.ptD.set(this.blankPt()); this.ptOpen.set(true); }
  editPt(p: PracticeType) {
    this.saveError.set(null);
    this.ptD.set({
      id: p.id, code: p.code, name: p.name, category: p.category, description: p.description ?? '', crop_codes: [...p.crop_codes],
      unit: p.unit ?? '', requires_quantity: p.requires_quantity, required_evidence: [...p.required_evidence],
      fields: (p.fields as AttrDef[]).map(a => ({ ...a, choices: [...(a.choices ?? [])] })), emission_factor_keys: p.emission_factor_keys.join(', '),
    });
    this.ptOpen.set(true);
  }
  setPt(p: Partial<PtDraft>, autoCode = false) {
    this.ptD.update(d => {
      const n = { ...d, ...p };
      if (autoCode && !d.id && (!d.code || d.code === this.slug(d.name))) n.code = this.slug(n.name);
      return n;
    });
  }
  toggleIn(key: 'crop_codes' | 'required_evidence', v: string) {
    const cur = this.ptD()[key];
    this.setPt({ [key]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] } as Partial<PtDraft>);
  }
  savePt() {
    const d = this.ptD();
    const body = {
      name: d.name.trim(), category: d.category, description: d.description.trim(), crop_codes: d.crop_codes,
      unit: d.unit.trim() || null, requires_quantity: d.requires_quantity, required_evidence: d.required_evidence, fields: d.fields,
      emission_factor_keys: d.emission_factor_keys.split(',').map(s => s.trim()).filter(Boolean),
    };
    this.saving.set(true);
    this.saveError.set(null);
    const req = d.id ? this.api.patch<PracticeType>(`/catalogue/practice-types/${d.id}`, body) : this.api.post<PracticeType>('/catalogue/practice-types', { ...body, code: d.code });
    req.subscribe({
      next: p => { this.saving.set(false); this.ptOpen.set(false); this.toast.success(d.id ? `${p.name} updated` : `${p.name} added`); this.load(); },
      error: (e: ApiError) => { this.saving.set(false); this.saveError.set(e.message); },
    });
  }

  askToggle(kind: 'crop' | 'pt', x: Crop | PracticeType) {
    this.toggleTarget.set({ kind, id: x.id, name: x.name, active: x.is_active });
    this.toggleOpen.set(true);
  }
  doToggle() {
    const t = this.toggleTarget()!;
    const path = t.kind === 'crop' ? `/catalogue/crops/${t.id}` : `/catalogue/practice-types/${t.id}`;
    this.saving.set(true);
    this.api.patch(path, { is_active: !t.active }).subscribe({
      next: () => { this.saving.set(false); this.toggleOpen.set(false); this.toast.success(`${t.name} ${t.active ? 'deactivated' : 'activated'}`); this.load(); },
      error: (e: ApiError) => { this.saving.set(false); this.toggleOpen.set(false); this.toast.apiError(e); },
    });
  }

  installDefaults() {
    this.saving.set(true);
    this.api.post<{ crops_added: string[]; practice_types_added: string[] }>('/catalogue/install-defaults').subscribe({
      next: r => {
        this.saving.set(false);
        this.defaultsOpen.set(false);
        const n = r.crops_added.length + r.practice_types_added.length;
        if (n) this.toast.success('Defaults installed', `${r.crops_added.length} crop${r.crops_added.length === 1 ? '' : 's'} and ${r.practice_types_added.length} practice type${r.practice_types_added.length === 1 ? '' : 's'} added.`);
        else this.toast.info('Already up to date', 'You already have every recommended crop and practice type.');
        this.load();
      },
      error: (e: ApiError) => { this.saving.set(false); this.toast.apiError(e, "Couldn't install the defaults"); },
    });
  }
}
