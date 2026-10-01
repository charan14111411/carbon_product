import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { saveBlob } from './errors';

/** Download the strata and sampling points annex (VM0042 v2.2 §8.2.1.2), submitted at every verification. */
@Component({
  selector: 'vc-annex-buttons',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="annex" role="group" aria-label="Strata and points annex">
      <span class="lbl" title="Strata and sampling points annex, VM0042 v2.2 §8.2.1.2 — submitted at every verification">
        <vc-icon name="sheet" [size]="15" />Strata &amp; points annex
      </span>
      <button type="button" class="btn btn-secondary btn-sm" [disabled]="busy() !== null" (click)="get('csv')">
        <vc-icon name="file-down" [size]="14" />{{ busy() === 'csv' ? 'Preparing…' : 'CSV' }}
      </button>
      <button type="button" class="btn btn-secondary btn-sm" [disabled]="busy() !== null" (click)="get('json')">
        <vc-icon name="braces" [size]="14" />{{ busy() === 'json' ? 'Preparing…' : 'JSON' }}
      </button>
    </div>
  `,
  styles: [`
    .annex{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}
    .lbl{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;color:var(--text-2);margin-right:2px}
  `],
})
export class AnnexButtons {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  projectId = input.required<string>();
  projectCode = input<string>('');
  busy = signal<'csv' | 'json' | null>(null);

  get(kind: 'csv' | 'json') {
    this.busy.set(kind);
    this.api.blob(`/projects/${this.projectId()}/sampling-annex.${kind}`).subscribe({
      next: b => {
        this.busy.set(null);
        const blob = kind === 'json' ? new Blob([b], { type: 'application/json' }) : b;
        saveBlob(blob, `${this.projectCode() || 'project'}-sampling-annex.${kind}`);
        this.toast.success('Annex downloaded', 'Current and earlier zone versions, and every point with intended and actual coordinates.');
      },
      error: (e: ApiError) => {
        this.busy.set(null);
        // Blob requests can't carry the API's JSON error body, so explain by status.
        const why = e.status === 0 ? e.message
          : e.status === 403 ? 'You do not have permission to read this project.'
          : e.status === 404 || e.status === 405 ? 'The annex is not available on this server yet.'
          : `The server could not prepare the annex (status ${e.status}).`;
        this.toast.error("Couldn't download the annex", why);
      },
    });
  }
}
