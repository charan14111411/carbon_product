import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { ProjectContext } from '../core/project-context.service';
import { Icon } from '../ui/icon';
import { Brand } from './brand';
import { NAV } from './nav';

@Component({
  selector: 'vc-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Brand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="side" [class.open]="menuOpen()">
      <div class="brand-row"><vc-brand [light]="true" /></div>
      <nav>
        @for (g of groups(); track g.label) {
          @if (g.label) { <div class="glabel">{{ g.label }}</div> }
          @for (i of g.items; track i.path) {
            <a [routerLink]="i.path" routerLinkActive="on" (click)="menuOpen.set(false)">
              <vc-icon [name]="i.icon" [size]="17" /><span>{{ i.label }}</span>
            </a>
          }
        }
      </nav>
      <div class="side-foot">
        <div class="org"><vc-icon name="building" [size]="15" /><span class="truncate">{{ auth.profile()?.organization?.name }}</span></div>
      </div>
    </aside>
    @if (menuOpen()) { <div class="scrim" (click)="menuOpen.set(false)"></div> }

    <div class="main">
      <header class="top">
        <button class="btn btn-ghost btn-icon burger" (click)="menuOpen.set(true)" aria-label="Menu"><vc-icon name="menu" [size]="18" /></button>
        <div class="crumb">{{ section() }}</div>
        <div class="spacer"></div>

        @if (ctx.projects().length) {
          <label class="proj">
            <vc-icon name="briefcase" [size]="15" />
            <select [value]="ctx.currentId() ?? ''" (change)="ctx.select($any($event.target).value)" aria-label="Current project">
              @for (p of ctx.projects(); track p.id) { <option [value]="p.id">{{ p.code }} · {{ p.name }}</option> }
            </select>
            <vc-icon name="chevrons-up-down" [size]="14" />
          </label>
        }

        <div class="user" (click)="userOpen.set(!userOpen())">
          <span class="avatar">{{ auth.initials() }}</span>
          <span class="who"><strong>{{ auth.profile()?.full_name }}</strong><span>{{ auth.profile()?.role_label }}</span></span>
          <vc-icon name="chevron-down" [size]="14" />
          @if (userOpen()) {
            <div class="menu" (click)="$event.stopPropagation()">
              <div class="menu-h"><strong>{{ auth.profile()?.email }}</strong></div>
              @if (auth.can('sample.collect')) { <a routerLink="/field" (click)="userOpen.set(false)"><vc-icon name="tractor" [size]="15" />Open field app</a> }
              <button (click)="auth.logout()"><vc-icon name="logout" [size]="15" />Sign out</button>
            </div>
          }
        </div>
      </header>
      <main class="content"><router-outlet /></main>
    </div>
  `,
  styles: [`
    :host{display:flex;min-height:100vh}
    .side{position:fixed;inset:0 auto 0 0;width:var(--sidebar-w);display:flex;flex-direction:column;
      background:var(--forest-900);color:#dfe9e2;z-index:50;border-right:1px solid rgba(255,255,255,.04)}
    .brand-row{height:var(--topbar-h);display:flex;align-items:center;padding:0 18px;border-bottom:1px solid rgba(255,255,255,.06)}
    nav{flex:1;overflow-y:auto;padding:10px 10px 16px}
    .glabel{margin:16px 10px 6px;font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(223,233,226,.45)}
    nav a{display:flex;align-items:center;gap:10px;height:34px;padding:0 10px;border-radius:7px;color:rgba(231,239,233,.82);
      font-size:13.5px;text-decoration:none!important;transition:background .12s,color .12s}
    nav a:hover{background:rgba(255,255,255,.06);color:#fff}
    nav a.on{background:rgba(134,183,151,.16);color:#fff}
    nav a.on vc-icon{color:var(--forest-300)}
    .side-foot{padding:12px 16px;border-top:1px solid rgba(255,255,255,.06)}
    .org{display:flex;align-items:center;gap:8px;font-size:12.5px;color:rgba(223,233,226,.7)}
    .main{flex:1;margin-left:var(--sidebar-w);min-width:0;display:flex;flex-direction:column}
    .top{position:sticky;top:0;z-index:40;height:var(--topbar-h);display:flex;align-items:center;gap:12px;padding:0 24px;
      background:rgba(245,243,238,.86);backdrop-filter:saturate(1.4) blur(8px);border-bottom:1px solid var(--border)}
    .burger{display:none}
    .crumb{font-weight:600;color:var(--stone-800)}
    .spacer{flex:1}
    .proj{display:flex;align-items:center;gap:8px;height:36px;padding:0 10px;border:1px solid var(--border-strong);border-radius:8px;background:var(--surface);color:var(--stone-600);cursor:pointer;max-width:340px}
    .proj select{border:0;background:none;font:500 13px var(--font);color:var(--stone-800);outline:none;appearance:none;cursor:pointer;min-width:0;max-width:260px;text-overflow:ellipsis}
    .user{position:relative;display:flex;align-items:center;gap:10px;padding:4px 8px 4px 4px;border-radius:10px;cursor:pointer}
    .user:hover{background:var(--sand-200)}
    .avatar{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--forest-600);color:#fff;font-size:12px;font-weight:600}
    .who{display:flex;flex-direction:column;line-height:1.2}
    .who strong{font-size:13px;font-weight:600} .who span{font-size:11.5px;color:var(--text-3)}
    .menu{position:absolute;right:0;top:46px;min-width:240px;background:var(--surface);border:1px solid var(--border);border-radius:10px;box-shadow:var(--shadow-lg);padding:6px;z-index:60}
    .menu-h{padding:8px 10px 10px;border-bottom:1px solid var(--border);margin-bottom:4px;font-size:12.5px;color:var(--text-2)}
    .menu a,.menu button{display:flex;align-items:center;gap:8px;width:100%;height:34px;padding:0 10px;border:0;border-radius:6px;background:none;font:inherit;color:var(--stone-800);cursor:pointer;text-decoration:none!important}
    .menu a:hover,.menu button:hover{background:var(--sand-100)}
    .content{flex:1;padding:28px 32px 48px;max-width:1440px;width:100%}
    .scrim{display:none}
    @media (max-width: 960px){
      .side{transform:translateX(-100%);transition:transform .2s}
      .side.open{transform:none;box-shadow:var(--shadow-lg)}
      .scrim{display:block;position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:45}
      .main{margin-left:0} .burger{display:inline-flex} .who{display:none} .content{padding:20px 16px 40px}
    }
  `],
})
export class Shell {
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  private router = inject(Router);
  menuOpen = signal(false);
  userOpen = signal(false);

  groups = computed(() =>
    NAV.map(g => ({
      ...g,
      items: g.items.filter(i => (this.auth.profile()?.role === 'client_viewer' ? !!i.client : !i.client || i.path !== '/app/portfolio' || this.auth.can('users.manage', 'programmes.manage')) && this.auth.can(...i.perms)),
    })).filter(g => g.items.length),
  );

  private url = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.router.url)), {
    initialValue: this.router.url,
  });
  section = computed(() => {
    const u = this.url();
    for (const g of NAV) for (const i of g.items) if (u.startsWith(i.path)) return i.label;
    return '';
  });

  constructor() {
    this.ctx.load();
  }
}
