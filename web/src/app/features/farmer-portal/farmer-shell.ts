import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Brand } from '../../layout/brand';
import { Icon } from '../../ui/icon';
import { FarmerData } from './farmer-data';

/** Section title with its Kannada label alongside. */
@Component({
  selector: 'vcf-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ en() }}</h1>@if (kn()) { <span class="kn" lang="kn">{{ kn() }}</span> }@if (sub()) { <p>{{ sub() }}</p> }`,
  styles: [`
    :host{display:block;margin:4px 0 18px}
    h1{font-size:26px;line-height:1.2;letter-spacing:-.015em;color:var(--forest-900)}
    .kn{display:block;margin-top:2px;font-size:16px;color:var(--clay-600);font-weight:500}
    p{margin-top:8px;font-size:15.5px;color:var(--stone-600);line-height:1.5}
  `],
})
export class FarmerTitle {
  en = input.required<string>();
  kn = input<string>('');
  sub = input<string>('');
}

const NAV = [
  { path: '/farmer', exact: true, icon: 'sun', en: 'Home', kn: 'ಮುಖಪುಟ' },
  { path: '/farmer/fields', exact: false, icon: 'sprout', en: 'Fields', kn: 'ಹೊಲಗಳು' },
  { path: '/farmer/payments', exact: false, icon: 'wallet', en: 'Payments', kn: 'ಪಾವತಿ' },
  { path: '/farmer/consents', exact: false, icon: 'shield-check', en: 'Consents', kn: 'ಒಪ್ಪಿಗೆ' },
  { path: '/farmer/help', exact: false, icon: 'help', en: 'Help', kn: 'ಸಹಾಯ' },
];

@Component({
  selector: 'vcf-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Brand, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top">
      <vc-brand />
      <nav class="deskNav" aria-label="Sections">
        @for (n of nav; track n.path) {
          <a [routerLink]="n.path" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: n.exact }">{{ n.en }}</a>
        }
      </nav>
      <span class="spacer"></span>
      <button class="out" (click)="auth.logout()" aria-label="Sign out"><vc-icon name="logout" [size]="18" /><span>Sign out</span></button>
    </header>

    <main>
      @if (!data.farmerId()) {
        <section class="notice">
          <h1>This page is for farmers</h1>
          <p>Your account isn't linked to a farmer record. Programme staff use the main workspace.</p>
          <a class="btn btn-primary btn-lg" routerLink="/app/overview">Go to workspace</a>
        </section>
      } @else {
        <router-outlet />
      }
      <footer class="foot">
        <p>Questions about your fields or money? Talk to your field officer, or <a routerLink="/farmer/help">raise it under Help</a> — every complaint gets a reference number and a reply date.</p>
      </footer>
    </main>

    <nav class="bottom" aria-label="Sections">
      @for (n of nav; track n.path) {
        <a [routerLink]="n.path" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: n.exact }">
          <vc-icon [name]="n.icon" [size]="22" /><span class="en">{{ n.en }}</span><span class="kn" lang="kn">{{ n.kn }}</span>
        </a>
      }
    </nav>
  `,
  styles: [`
    :host{display:block;min-height:100vh;background:linear-gradient(180deg,var(--clay-50) 0,var(--sand-100) 260px);font-size:16px}
    .top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:16px;height:60px;padding:0 16px;
      background:rgba(252,243,236,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--border)}
    .spacer{flex:1}
    .deskNav{display:none;gap:4px;margin-left:24px}
    .deskNav a{height:38px;display:flex;align-items:center;padding:0 14px;border-radius:8px;color:var(--stone-700);font-weight:500;text-decoration:none}
    .deskNav a.on{background:var(--forest-100);color:var(--forest-800)}
    .out{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border:1px solid var(--border-strong);border-radius:10px;background:var(--surface);font:inherit;font-size:14px;color:var(--stone-700);cursor:pointer}
    .out span{display:none}
    main{max-width:760px;margin:0 auto;padding:20px 16px 112px}
    .foot{margin-top:32px;padding-top:16px;border-top:1px solid var(--border);font-size:14px;color:var(--text-2)}
    .notice{padding:32px 0;display:flex;flex-direction:column;gap:12px;align-items:flex-start}
    .bottom{position:fixed;left:0;right:0;bottom:0;z-index:30;display:grid;grid-template-columns:repeat(5,1fr);
      background:var(--surface);border-top:1px solid var(--border);box-shadow:0 -4px 16px rgba(16,41,28,.06);padding-bottom:env(safe-area-inset-bottom)}
    .bottom a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-height:66px;color:var(--stone-500);text-decoration:none;position:relative}
    .bottom a .en{font-size:12.5px;font-weight:600;margin-top:3px} .bottom a .kn{font-size:10.5px}
    .bottom a.on{color:var(--forest-700)}
    .bottom a.on::before{content:'';position:absolute;top:0;left:22%;right:22%;height:3px;border-radius:0 0 3px 3px;background:var(--forest-600)}
    @media (min-width: 900px){
      .bottom{display:none} .deskNav{display:flex} .out span{display:inline} main{padding-bottom:48px}
      .top{padding:0 32px}
    }
  `],
})
export class FarmerShell {
  auth = inject(AuthService);
  data = inject(FarmerData);
  nav = NAV;
  constructor() { this.data.init(); }
}
