import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, ErrorBox, Loading, Modal } from '../../ui/kit';
import { LabContext } from './lab-context';
import { Lab } from './types';

@Component({
  selector: 'vc-lab-labs',
  imports: [FormsModule, Icon, Badge, Callout, Empty, ErrorBox, Loading, Modal, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small">Laboratories that analyse this organisation's soil. Accreditation is shown with its expiry.</p>
      <div class="spacer"></div>
      @if (canManage()) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />Add lab</button> }
    </div>
    <section class="card">
      @if (!ctx.labsLoaded()) {
        <vc-loading [rows]="4" />
      } @else if (ctx.labsError()) {
        <div class="card-body"><vc-error title="Couldn't load labs" [message]="ctx.labsError()!" /></div>
      } @else if (!ctx.labs().length) {
        <vc-empty icon="flask" title="No labs yet" text="Add the laboratory that will receive your soil bags." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Code</th><th>Name</th><th>City</th><th>Accreditation</th><th>Valid until</th><th>Contact</th></tr></thead>
            <tbody>
              @for (l of ctx.labs(); track l.id) {
                <tr>
                  <td><code>{{ l.code }}</code></td>
                  <td><strong>{{ l.name }}</strong></td>
                  <td>{{ l.city || '—' }}</td>
                  <td>{{ l.accreditation || '—' }}</td>
                  <td>
                    @if (l.accreditation_valid_until) {
                      <vc-badge [status]="l.accreditation_current ? 'active' : 'failed'">{{ l.accreditation_valid_until | day }}</vc-badge>
                    } @else { <span class="subtle">—</span> }
                  </td>
                  <td class="muted">{{ l.contact_email || '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="open" title="Add a lab" width="560px">
      <div class="form-grid">
        <div class="field"><label for="l-code">Code</label><input id="l-code" class="input mono" [(ngModel)]="f.code" placeholder="SOILTEST-BLR" /></div>
        <div class="field"><label for="l-name">Name</label><input id="l-name" class="input" [(ngModel)]="f.name" placeholder="Soil Test Laboratory, Bengaluru" /></div>
        <div class="field"><label for="l-city">City</label><input id="l-city" class="input" [(ngModel)]="f.city" /></div>
        <div class="field"><label for="l-mail">Contact email</label><input id="l-mail" type="email" class="input" [(ngModel)]="f.contact_email" /></div>
        <div class="field"><label for="l-acc">Accreditation</label><input id="l-acc" class="input" [(ngModel)]="f.accreditation" placeholder="NABL TC-1234" /></div>
        <div class="field"><label for="l-until">Valid until</label><input id="l-until" type="date" class="input" [(ngModel)]="f.accreditation_valid_until" /></div>
      </div>
      @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || f.code.length < 2 || f.name.length < 2" (click)="save()"><vc-icon name="check" />Add lab</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`.bar{display:flex;align-items:center;gap:12px;margin-bottom:14px}`],
})
export class LabLabs {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  ctx = inject(LabContext);
  open = signal(false);
  busy = signal(false);
  err = signal<string | null>(null);
  f = this.blank();
  canManage = computed(() => this.auth.can('sampling.plan', 'programmes.manage'));

  private blank() {
    return { code: '', name: '', city: '', contact_email: '', accreditation: '', accreditation_valid_until: '' };
  }

  openNew() {
    this.f = this.blank();
    this.err.set(null);
    this.open.set(true);
  }

  save() {
    this.busy.set(true);
    this.err.set(null);
    const f = this.f;
    this.api.post<Lab>('/labs', {
      code: f.code.trim(), name: f.name.trim(), city: f.city.trim(), contact_email: f.contact_email.trim() || null,
      accreditation: f.accreditation.trim() || null, accreditation_valid_until: f.accreditation_valid_until || null,
    }).subscribe({
      next: l => { this.busy.set(false); this.open.set(false); this.toast.success(`${l.name} added`); this.ctx.loadLabs(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e.message); },
    });
  }
}
