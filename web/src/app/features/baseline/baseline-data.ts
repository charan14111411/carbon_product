import { Injectable, inject, signal } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { ActivitySchema } from './baseline.types';

/** The Table 4 attribute schema, loaded once and shared by the baseline tabs. */
@Injectable({ providedIn: 'root' })
export class BaselineSchema {
  private api = inject(ApiService);
  readonly schema = signal<ActivitySchema | null>(null);
  readonly error = signal<string | null>(null);
  private loading = false;

  load(): void {
    if (this.schema() || this.loading) return;
    this.loading = true;
    this.api.get<ActivitySchema>('/activity-records/schema').subscribe({
      next: s => { this.schema.set(s); this.loading = false; },
      error: (e: ApiError) => { this.error.set(e.message); this.loading = false; },
    });
  }

  label(category: string): string {
    return this.schema()?.categories[category]?.label ?? category.replace(/_/g, ' ');
  }
}
