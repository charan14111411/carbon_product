import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Injectable, computed, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, firstValueFrom, map } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { Icon } from '../../ui/icon';

/* Shared lookups for households, notifications, interventions and offtake screens. */

export interface FarmerLite {
  id: string; code: string; full_name: string; phone: string; village: string; district: string; state: string;
  language: string; status: string;
}

/** The public (possibly masked) farmer summary the API embeds in records. */
export interface FarmerPublic {
  id: string; code: string; name: string; phone: string | null; village: string; district: string; state: string;
  status: string; masked: boolean;
}

/** Farmers of the organisation, fetched once and shared between screens. */
@Injectable({ providedIn: 'root' })
export class FarmerDirectory {
  private api = inject(ApiService);
  readonly list = signal<FarmerLite[]>([]);
  readonly loaded = signal(false);
  readonly error = signal<string | null>(null);
  private started = false;
  readonly byId = computed(() => new Map(this.list().map(f => [f.id, f])));

  load(force = false) {
    if (this.started && !force) return;
    this.started = true;
    this.api.get<{ items: FarmerLite[] }>('/farmers', { limit: 500 }).subscribe({
      next: r => { this.list.set([...r.items].sort((a, b) => a.full_name.localeCompare(b.full_name))); this.loaded.set(true); },
      error: (e: ApiError) => { this.error.set(e.message); this.loaded.set(true); this.started = false; },
    });
  }
  name(id: string | null | undefined): string {
    if (!id) return '—';
    const f = this.byId().get(id);
    return f ? f.full_name : 'Farmer';
  }
}

/** Upload a file as evidence (immutable, fingerprinted) and return its id. */
export function uploadEvidence(api: ApiService, file: File, entityType?: string, entityId?: string): Observable<{ id: string; sha256: string; filename: string }> {
  const form = new FormData();
  form.append('file', file);
  form.append('kind', 'document');
  if (entityType) form.append('entity_type', entityType);
  if (entityId) form.append('entity_id', entityId);
  return api.upload<{ id: string; sha256: string; filename: string }>('/evidence', form);
}

/** Open an evidence file (authenticated) in a new tab. */
export async function openEvidence(api: ApiService, id: string): Promise<void> {
  const blob = await firstValueFrom(api.blob(`/evidence/${id}/content`));
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function selfApprovalMessage(e: ApiError, what: string): string {
  return e.code === 'SELF_APPROVAL_REJECTED' ? `${e.message} ${what} always needs a second person — ask a colleague.` : e.message;
}

export function isoToday(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function unwrap<T>(obs: Observable<T[] | { items: T[] }>): Observable<T[]> {
  return obs.pipe(map(r => (Array.isArray(r) ? r : r.items)));
}

/* ------------------------------------------------------------------ farmer picker */
@Component({
  selector: 'vcx-farmer-picker',
  imports: [FormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pick" [class.open]="open()">
      @if (selected(); as f) {
        <div class="chosen">
          <span class="av">{{ initials(f.full_name) }}</span>
          <span class="cb"><strong>{{ f.full_name }}</strong><span class="small subtle">{{ f.code }} · {{ f.village }}</span></span>
          @if (!disabled()) { <button type="button" class="btn btn-ghost btn-sm btn-icon" (click)="clear()" aria-label="Change farmer"><vc-icon name="x" [size]="14" /></button> }
        </div>
      } @else {
        <div class="search">
          <vc-icon name="search" [size]="15" />
          <input class="input" [placeholder]="placeholder()" [ngModel]="q()" (ngModelChange)="q.set($event); open.set(true)" (focus)="open.set(true)" [attr.aria-label]="placeholder()" />
        </div>
        @if (open()) {
          <ul class="menu" role="listbox">
            @if (!dir.loaded()) { <li class="muted small pad">Loading farmers…</li> }
            @for (f of matches(); track f.id) {
              <li role="option" (mousedown)="choose(f)" [class.off]="exclude().includes(f.id)">
                <strong>{{ f.full_name }}</strong><span class="small subtle">{{ f.code }} · {{ f.village }}, {{ f.district }}</span>
                @if (exclude().includes(f.id)) { <span class="small subtle">already added</span> }
              </li>
            } @empty { @if (dir.loaded()) { <li class="muted small pad">No farmer matches “{{ q() }}”.</li> } }
          </ul>
        }
      }
    </div>
  `,
  styles: [`
    .pick{position:relative}
    .search{position:relative} .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)} .search .input{padding-left:34px}
    .menu{position:absolute;z-index:20;left:0;right:0;top:42px;max-height:260px;overflow:auto;margin:0;padding:4px;list-style:none;background:var(--surface);border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow-lg)}
    .menu li{display:flex;flex-direction:column;padding:7px 10px;border-radius:6px;cursor:pointer}
    .menu li:hover{background:var(--forest-50)} .menu li.off{opacity:.5;pointer-events:none} .menu li.pad{cursor:default}
    .chosen{display:flex;align-items:center;gap:10px;padding:6px 8px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface-2)}
    .av{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--forest-100);color:var(--forest-700);font-size:11.5px;font-weight:600;flex:none}
    .cb{flex:1;display:flex;flex-direction:column;line-height:1.3;min-width:0}
  `],
})
export class FarmerPicker {
  dir = inject(FarmerDirectory);
  private el = inject(ElementRef<HTMLElement>);
  value = model<string | null>(null);
  placeholder = input('Search farmers by name, code or village…');
  exclude = input<string[]>([]);
  disabled = input(false);
  q = signal('');
  open = signal(false);
  selected = computed(() => (this.value() ? this.dir.byId().get(this.value()!) ?? null : null));
  matches = computed(() => {
    const q = this.q().trim().toLowerCase();
    const all = this.dir.list();
    return (q ? all.filter(f => `${f.full_name} ${f.code} ${f.village} ${f.phone}`.toLowerCase().includes(q)) : all).slice(0, 40);
  });

  constructor() { this.dir.load(); }
  choose(f: FarmerLite) { this.value.set(f.id); this.open.set(false); this.q.set(''); }
  clear() { this.value.set(null); }
  initials(n: string) { return n.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
  @HostListener('document:mousedown', ['$event']) outside(e: MouseEvent) {
    if (!this.el.nativeElement.contains(e.target as Node)) this.open.set(false);
  }
}
