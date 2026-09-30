import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Product mark: a soil core with a sprouting leaf. */
@Component({
  selector: 'vc-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" [attr.fill]="light() ? '#86b797' : '#275e3f'" opacity=".18"/>
      <rect x="10" y="15" width="12" height="12" rx="2.5" [attr.fill]="light() ? '#e7a57b' : '#c76329'"/>
      <path d="M10 19.5h12M10 23.5h12" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>
      <path d="M16 15c0-4 2.2-7.3 6.6-8.2.3 4.6-2.3 7.8-6.6 8.2z" [attr.fill]="light() ? '#c3dbca' : '#2f7249'"/>
      <path d="M16 15c0-3-1.6-5.4-4.9-6.1-.2 3.4 1.7 5.8 4.9 6.1z" [attr.fill]="light() ? '#86b797' : '#4f9168'"/>
    </svg>
    <span class="wm"><strong>Varsapradaya</strong><span>Carbon</span></span>
  `,
  styles: [`
    :host{display:inline-flex;align-items:center;gap:10px}
    .wm{display:flex;flex-direction:column;line-height:1.05}
    strong{font-size:15px;font-weight:600;letter-spacing:-.01em}
    .wm span{font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;opacity:.7;margin-top:2px}
    :host(.dark) strong{color:var(--forest-900)}
  `],
  host: { '[class.dark]': '!light()', '[style.color]': 'light() ? "#fff" : "var(--forest-900)"' },
})
export class Brand {
  light = input<boolean>(false);
}
