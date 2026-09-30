import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { ProjectContext } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { Callout, Modal } from '../../ui/kit';
import { PackDetail, PackHead } from './methodology-data';

/** New rule pack, optionally copying every value (and its source) from an existing pack. */
@Component({
  selector: 'vc-create-pack',
  imports: [FormsModule, Modal, Callout, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [title]="basedOn() ? 'New revision of ' + basedOnLabel() : 'New rule pack'" width="600px"
      subtitle="A rule pack holds every methodology value the platform uses — each with its source. It starts as a draft.">
      <div class="form-grid">
        <div class="field">
          <label for="m-code">Methodology code</label>
          <input id="m-code" class="input mono" [ngModel]="code()" (ngModelChange)="code.set($event)" placeholder="e.g. VM0042" />
        </div>
        <div class="field">
          <label for="m-ver">Methodology version</label>
          <input id="m-ver" class="input mono" [ngModel]="version()" (ngModelChange)="version.set($event)" placeholder="e.g. 2.2" />
        </div>
        <div class="field span-2">
          <label for="m-title">Title</label>
          <input id="m-title" class="input" [ngModel]="title()" (ngModelChange)="title.set($event)" placeholder="e.g. VM0042 v2.2 rules for Karnataka coffee & millet project" />
        </div>
        <div class="field span-2">
          <label for="m-url">Published methodology (URL)</label>
          <input id="m-url" class="input" [ngModel]="url()" (ngModelChange)="url.set($event)" placeholder="https://verra.org/methodologies/…" />
          <span class="hint">Link to the official document the values are taken from.</span>
        </div>
        <div class="field span-2">
          <label for="m-base">Start from</label>
          <select id="m-base" class="input" [ngModel]="basedOn()" (ngModelChange)="basedOn.set($event)">
            <option value="">An empty pack — enter every value</option>
            @for (p of packs(); track p.id) { <option [value]="p.id">Copy {{ p.label }} ({{ p.status }})</option> }
          </select>
          @if (basedOn()) { <span class="hint">All values and their sources are copied. You'll count as an editor, so a colleague must approve the new revision.</span> }
        </div>
      </div>
      @if (error()) { <vc-callout tone="danger" icon="alert" class="mt">{{ error() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!valid() || saving()" (click)="save()"><vc-icon name="plus" />{{ saving() ? 'Creating…' : 'Create draft' }}</button>
      </div>
    </vc-modal>
  `,
  styles: [`.mt{margin-top:14px} .ft{display:flex;gap:8px}`],
})
export class CreatePack {
  private api = inject(ApiService);
  private ctx = inject(ProjectContext);
  open = model(false);
  packs = input<PackHead[]>([]);
  /** Pre-fill as a new revision of this pack. */
  from = input<PackHead | null>(null);
  created = output<PackDetail>();

  code = signal('');
  version = signal('');
  title = signal('');
  url = signal('');
  basedOn = signal('');
  saving = signal(false);
  error = signal<string | null>(null);

  basedOnLabel = computed(() => this.packs().find(p => p.id === this.basedOn())?.label ?? '');
  valid = computed(() => this.code().trim().length >= 2 && this.version().trim().length >= 1 && this.title().trim().length >= 3);

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const f = this.from();
      const proj = this.ctx.current();
      this.error.set(null);
      if (f) {
        this.code.set(f.methodology_code); this.version.set(f.methodology_version); this.title.set(f.title);
        this.url.set(f.source_url ?? ''); this.basedOn.set(f.id);
      } else {
        this.code.set(proj?.methodology_code ?? ''); this.version.set(proj?.methodology_version ?? '');
        this.title.set(''); this.url.set(''); this.basedOn.set('');
      }
    });
  }

  save() {
    this.saving.set(true);
    this.error.set(null);
    this.api.post<PackDetail>('/rule-packs', {
      methodology_code: this.code().trim(), methodology_version: this.version().trim(), title: this.title().trim(),
      source_url: this.url().trim() || null, based_on_id: this.basedOn() || null,
    }).subscribe({
      next: p => { this.saving.set(false); this.open.set(false); this.created.emit(p); },
      error: (e: ApiError) => { this.saving.set(false); this.error.set(e.message); },
    });
  }
}
