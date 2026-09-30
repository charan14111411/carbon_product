import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';
import { Icon } from './icon';

@Component({
  selector: 'vc-toasts',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (t of toast.toasts(); track t.id) {
      <div class="t" [class]="t.kind" role="status">
        <vc-icon [name]="t.kind === 'success' ? 'check-circle' : t.kind === 'error' ? 'alert' : 'info'" [size]="18" />
        <div class="c"><strong>{{ t.title }}</strong>@if (t.body) { <span>{{ t.body }}</span> }</div>
        <button (click)="toast.dismiss(t.id)" aria-label="Dismiss"><vc-icon name="x" [size]="14" /></button>
      </div>
    }
  `,
  styles: [`
    :host{position:fixed;right:20px;bottom:20px;z-index:200;display:flex;flex-direction:column;gap:10px;width:min(380px,calc(100vw - 40px))}
    .t{display:flex;gap:10px;align-items:flex-start;padding:12px 12px 12px 14px;border-radius:10px;background:var(--stone-900);color:#fff;
      box-shadow:var(--shadow-lg);animation:in .2s ease-out}
    .t.success vc-icon:first-child{color:var(--forest-300)} .t.error vc-icon:first-child{color:#f4a39c} .t.info vc-icon:first-child{color:#9cc3ea}
    .c{flex:1;display:flex;flex-direction:column;gap:2px;font-size:13px} .c span{color:rgba(255,255,255,.75)}
    button{border:0;background:none;color:rgba(255,255,255,.6);cursor:pointer;padding:2px}
    @keyframes in{from{opacity:0;transform:translateY(8px)}}
  `],
})
export class Toasts {
  toast = inject(ToastService);
}
