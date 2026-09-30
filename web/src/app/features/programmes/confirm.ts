import { ChangeDetectionStrategy, Component, effect, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../ui/icon';
import { Modal } from '../../ui/kit';

/**
 * Confirmation dialog for irreversible or significant actions.
 * Optionally asks for a reason (recorded in the audit log).
 */
@Component({
  selector: 'vc-confirm',
  imports: [FormsModule, Modal, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [title]="title()" width="480px">
      <div class="stack" style="--gap:14px">
        <p class="msg">{{ message() }}</p>
        <ng-content />
        @if (reason() !== 'none') {
          <div class="field">
            <label for="cf-reason">{{ reasonLabel() }} @if (reason() === 'optional') { <span class="subtle">(optional)</span> }</label>
            <textarea id="cf-reason" class="input" rows="3" [placeholder]="reasonPlaceholder()"
              [ngModel]="text()" (ngModelChange)="text.set($event)"></textarea>
            @if (reason() === 'required') { <span class="hint">At least {{ minReason() }} characters. This is kept in the audit log.</span> }
          </div>
        }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="open.set(false)">Cancel</button>
        <button class="btn" type="button" [class.btn-danger]="tone() === 'danger'" [class.btn-primary]="tone() !== 'danger'"
          [disabled]="busy() || !valid()" (click)="go()">
          @if (busy()) { Working… } @else { @if (icon()) { <vc-icon [name]="icon()" /> } {{ confirmLabel() }} }
        </button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`.msg{color:var(--stone-700);line-height:1.55}`],
})
export class ConfirmDialog {
  open = model(false);
  title = input('Are you sure?');
  message = input('');
  confirmLabel = input('Confirm');
  icon = input('');
  tone = input<'primary' | 'danger'>('primary');
  reason = input<'none' | 'optional' | 'required'>('none');
  reasonLabel = input('Reason');
  reasonPlaceholder = input('');
  minReason = input(5);
  busy = input(false);
  confirmed = output<string>();
  text = signal('');

  constructor() {
    effect(() => { if (this.open()) this.text.set(''); });
  }

  valid() {
    return this.reason() !== 'required' || this.text().trim().length >= this.minReason();
  }

  go() {
    if (this.valid()) this.confirmed.emit(this.text().trim());
  }
}
