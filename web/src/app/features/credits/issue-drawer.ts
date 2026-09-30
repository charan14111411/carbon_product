import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { CreditBatch, apiFieldErrors } from './credit-ui';

const REGISTRIES = ['Verra', 'Gold Standard'];

/** Drawer to record a registry issuance for a verified batch. */
@Component({
  selector: 'vcx-issue-drawer',
  imports: [FormsModule, ...KIT, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [open]="!!batch()" (closed)="closed.emit()" [drawer]="true" width="480px" title="Record registry issuance"
      [subtitle]="batch() ? batch()!.code + ' · vintage ' + batch()!.vintage : ''">
      @if (batch(); as b) {
        <div class="stack">
          <vc-callout tone="info" icon="landmark">
            Enter the details exactly as they appear on the registry's issuance record. The serial range is shown to buyers on
            their retirement records.
          </vc-callout>
          <div class="sum">
            <div><span>Reductions</span><strong class="num">{{ b.reductions_t | num: 2 }} t</strong></div>
            <div><span>Removals</span><strong class="num">{{ b.removals_t | num: 2 }} t</strong></div>
          </div>

          <div class="field">
            <label>Registry</label>
            <div class="reg">
              @for (r of registries; track r) {
                <button type="button" class="opt" [class.on]="registry === r" (click)="registry = r">{{ r }}</button>
              }
              <button type="button" class="opt" [class.on]="!registries.includes(registry)" (click)="registry = ''; other = true">Other</button>
            </div>
            @if (!registries.includes(registry)) {
              <input class="input" name="regname" placeholder="Registry name, e.g. Isometric" [(ngModel)]="registry" maxlength="40" />
            }
            @if (err('registry_name')) { <span class="error">{{ err('registry_name') }}</span> }
          </div>
          <div class="field">
            <label>Registry project reference</label>
            <input class="input mono" [(ngModel)]="projectRef" placeholder="e.g. VCS-4821" maxlength="80" />
            @if (err('registry_project_ref')) { <span class="error">{{ err('registry_project_ref') }}</span> }
          </div>
          <div class="form-grid">
            <div class="field">
              <label>First serial</label>
              <input class="input mono" [(ngModel)]="serialStart" placeholder="…-00001" maxlength="120" />
            </div>
            <div class="field">
              <label>Last serial</label>
              <input class="input mono" [(ngModel)]="serialEnd" placeholder="…-01250" maxlength="120" />
            </div>
            @if (err('serial_start') || err('serial_end')) { <span class="error span-2">{{ err('serial_start') || err('serial_end') }}</span> }
          </div>
          <div class="field">
            <label>Issued on</label>
            <input class="input" type="date" [(ngModel)]="issuedOn" [max]="today" />
          </div>
          @if (error()) { <vc-error title="Couldn't record issuance" [message]="error()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="closed.emit()">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="submit()">Record issuance</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .sum{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .sum div{padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2);display:flex;flex-direction:column}
    .sum span{font-size:12px;color:var(--text-2)} .sum strong{font-size:16px}
    .reg{display:flex;gap:6px;flex-wrap:wrap}
    .opt{height:34px;padding:0 14px;border:1px solid var(--border-strong);border-radius:8px;background:var(--surface);font:inherit;font-weight:500;cursor:pointer;color:var(--stone-700)}
    .opt.on{border-color:var(--forest-500);background:var(--forest-50);color:var(--forest-700)}
  `],
})
export class IssueDrawer {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  batch = input<CreditBatch | null>(null);
  done = output<CreditBatch>();
  closed = output<void>();

  registries = REGISTRIES;
  today = new Date().toISOString().slice(0, 10);
  registry = 'Verra';
  other = false;
  projectRef = '';
  serialStart = '';
  serialEnd = '';
  issuedOn = this.today;
  busy = signal(false);
  error = signal<string | null>(null);
  fieldErrors = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      if (this.batch()) {
        this.registry = 'Verra'; this.projectRef = ''; this.serialStart = ''; this.serialEnd = '';
        this.issuedOn = this.today; this.error.set(null); this.fieldErrors.set({});
      }
    });
  }

  valid() {
    return this.registry.trim().length >= 2 && this.projectRef.trim() && this.serialStart.trim() && this.serialEnd.trim() && this.issuedOn;
  }
  err(k: string) { return this.fieldErrors()[k] ?? ''; }

  submit() {
    const b = this.batch();
    if (!b) return;
    this.busy.set(true);
    this.error.set(null);
    this.api.post<CreditBatch>(`/credit-batches/${b.id}/issue`, {
      registry_name: this.registry.trim(), registry_project_ref: this.projectRef.trim(),
      serial_start: this.serialStart.trim(), serial_end: this.serialEnd.trim(), issued_on: this.issuedOn,
    }).subscribe({
      next: nb => { this.busy.set(false); this.toast.success(`${nb.code} issued`, `Recorded on ${nb.registry_name}. Credits can now be sold.`); this.done.emit(nb); },
      error: (e: ApiError) => {
        this.busy.set(false);
        const fe = apiFieldErrors(e);
        this.fieldErrors.set(fe);
        this.error.set(e.message);
      },
    });
  }
}
