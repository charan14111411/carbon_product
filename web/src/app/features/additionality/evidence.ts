import { ChangeDetectionStrategy, Component, Injectable, effect, inject, input, model, signal, untracked } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';

/* Evidence files (hash-fingerprinted uploads) attached to additionality and control-site records. */

export interface EvidenceMeta {
  id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  sha256: string;
  created_at: string;
}

/** Caches file names so chips show "legal-review.pdf" rather than an id. */
@Injectable({ providedIn: 'root' })
export class EvidenceStore {
  private api = inject(ApiService);
  private cache = signal<Record<string, EvidenceMeta | 'missing' | 'loading'>>({});

  meta(id: string) {
    return this.cache()[id];
  }

  ensure(id: string) {
    if (!id || this.cache()[id]) return;
    this.cache.update(c => ({ ...c, [id]: 'loading' }));
    this.api.get<EvidenceMeta>(`/evidence/${id}`).subscribe({
      next: m => this.cache.update(c => ({ ...c, [id]: m })),
      error: () => this.cache.update(c => ({ ...c, [id]: 'missing' })),
    });
  }

  upload(file: File, entityType: string, entityId?: string | null): Observable<EvidenceMeta> {
    const form = new FormData();
    form.append('file', file);
    form.append('kind', 'document');
    form.append('entity_type', entityType);
    if (entityId) form.append('entity_id', entityId);
    return this.api.upload<EvidenceMeta>('/evidence', form).pipe(tap(m => this.cache.update(c => ({ ...c, [m.id]: m }))));
  }

  open(id: string): Observable<void> {
    return this.api.blob(`/evidence/${id}/content`).pipe(map(b => {
      const url = URL.createObjectURL(b);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }));
  }
}

export function fileSize(b: number): string {
  return b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`;
}

/** A list of attached files with "Attach file" and remove. `single` keeps at most one file. */
@Component({
  selector: 'vc-evidence',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list">
      @for (id of ids(); track id) {
        <span class="chip" [class.bad]="store.meta(id) === 'missing'">
          <vc-icon name="file" [size]="13" />
          <button type="button" class="name" (click)="view(id)" [title]="title(id)">{{ label(id) }}</button>
          @if (!readonly()) {
            <button type="button" class="rm" (click)="remove(id)" [attr.aria-label]="'Remove ' + label(id)"><vc-icon name="x" [size]="12" /></button>
          }
        </span>
      }
      @if (!readonly() && (!single() || !ids().length)) {
        <input #inp type="file" hidden (change)="pick($event); inp.value = ''" />
        <button type="button" class="btn btn-ghost btn-sm add" [disabled]="busy()" (click)="inp.click()">
          <vc-icon [name]="busy() ? 'hourglass' : 'upload'" [size]="14" />{{ busy() ? 'Uploading…' : addLabel() }}
        </button>
      }
      @if (readonly() && !ids().length) { <span class="none">No file attached</span> }
    </div>
  `,
  styles: [`
    .list{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
    .chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 4px 0 9px;border-radius:6px;border:1px solid var(--border);
      background:var(--surface-2);color:var(--stone-600);max-width:100%}
    .chip.bad{border-color:var(--red-100);background:var(--danger-soft);color:var(--red-600)}
    .name{border:0;background:none;padding:0;font:inherit;font-size:12.5px;color:var(--stone-800);cursor:pointer;max-width:240px;
      overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .name:hover{color:var(--forest-700);text-decoration:underline}
    .rm{display:grid;place-items:center;width:20px;height:20px;border:0;border-radius:4px;background:none;color:var(--stone-500);cursor:pointer}
    .rm:hover{background:var(--sand-200);color:var(--stone-800)}
    .add{color:var(--forest-700)}
    .none{font-size:12.5px;color:var(--text-3)}
  `],
})
export class EvidenceList {
  store = inject(EvidenceStore);
  private toast = inject(ToastService);
  ids = model<string[]>([]);
  readonly = input(false);
  single = input(false);
  entityType = input('AdditionalityAssessment');
  entityId = input<string | null>(null);
  addLabel = input('Attach file');
  busy = signal(false);

  constructor() {
    effect(() => {
      const ids = this.ids();
      untracked(() => ids.forEach(id => this.store.ensure(id)));
    });
  }

  label(id: string) {
    const m = this.store.meta(id);
    if (m === 'missing') return 'File not found';
    if (!m || m === 'loading') return 'Loading…';
    return m.filename;
  }
  title(id: string) {
    const m = this.store.meta(id);
    return m && typeof m === 'object' ? `${m.filename} · ${fileSize(m.size_bytes)} · SHA-256 ${m.sha256.slice(0, 12)}…` : '';
  }
  view(id: string) {
    this.store.open(id).subscribe({ error: (e: ApiError) => this.toast.apiError(e, "Couldn't open the file") });
  }
  remove(id: string) {
    this.ids.set(this.ids().filter(x => x !== id));
  }
  pick(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.busy.set(true);
    this.store.upload(f, this.entityType(), this.entityId()).subscribe({
      next: m => { this.busy.set(false); this.ids.set(this.single() ? [m.id] : [...this.ids(), m.id]); },
      error: (err: ApiError) => { this.busy.set(false); this.toast.apiError(err, "Couldn't upload the file"); },
    });
  }
}
