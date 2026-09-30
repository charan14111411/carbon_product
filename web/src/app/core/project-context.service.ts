import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';

export interface ProjectLite {
  id: string;
  code: string;
  name: string;
  status: string;
  programme_id: string;
  methodology_code?: string;
  methodology_version?: string;
}

const KEY = 'vc.project';

/** The project the user is working on. Most MRV screens are scoped to it. */
@Injectable({ providedIn: 'root' })
export class ProjectContext {
  private api = inject(ApiService);
  readonly projects = signal<ProjectLite[]>([]);
  readonly loaded = signal(false);
  readonly currentId = signal<string | null>(localStorage.getItem(KEY));
  readonly current = computed(() => this.projects().find(p => p.id === this.currentId()) ?? null);

  load(): void {
    this.api.get<ProjectLite[] | { items: ProjectLite[] }>('/projects').subscribe({
      next: r => {
        const list = [...(Array.isArray(r) ? r : r.items)].sort((a, b) => a.code.localeCompare(b.code));
        this.projects.set(list);
        this.loaded.set(true);
        if (!list.find(p => p.id === this.currentId()) && list.length) this.select(list[0].id);
      },
      error: () => this.loaded.set(true),
    });
  }

  select(id: string): void {
    localStorage.setItem(KEY, id);
    this.currentId.set(id);
  }
}
