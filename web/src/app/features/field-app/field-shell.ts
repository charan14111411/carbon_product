import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AgoPipe } from '../../core/format';
import { OfflineStore, deviceId } from '../../core/offline';
import { Icon } from '../../ui/icon';
import { Brand } from '../../layout/brand';
import { FieldData } from './field-data';

/** Frame of the field app: header with sync pill, content, bottom tab bar. */
@Component({
  selector: 'vc-field-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Brand, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app">
      <header class="top">
        <vc-brand [light]="true" class="brand" />
        <div class="spacer"></div>
        <button class="pill" [class]="'pill ' + pillTone()" (click)="syncNow()" [attr.aria-label]="pillText()">
          <vc-icon [name]="pillIcon()" [size]="16" [stroke]="2.2" [class.spin]="store.syncing()" />
          <span>{{ pillText() }}</span>
        </button>
        <button class="menu-btn" (click)="menu.set(!menu())" aria-label="Menu"><vc-icon name="menu" [size]="22" /></button>
      </header>

      @if (!store.online()) {
        <div class="offline-bar"><vc-icon name="wifi-off" [size]="16" />You're offline. Everything you record is saved on this phone.</div>
      }

      <main class="body"><router-outlet /></main>

      <nav class="tabs">
        <a routerLink="/field" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="on"><vc-icon name="home" [size]="24" /><span>Home</span></a>
        <a [routerLink]="mapLink()" routerLinkActive="on"><vc-icon name="map" [size]="24" /><span>Map</span></a>
        <a routerLink="/field/outbox" routerLinkActive="on">
          <span class="ico"><vc-icon name="cloud-upload" [size]="24" />
            @if (store.rejected()) { <b class="dot bad">{{ store.rejected() }}</b> } @else if (store.queued()) { <b class="dot">{{ store.queued() }}</b> }
          </span><span>Outbox</span>
        </a>
        <a routerLink="/field/practice" routerLinkActive="on"><vc-icon name="sprout" [size]="24" /><span>Practice</span></a>
      </nav>

      @if (menu()) {
        <div class="scrim" (click)="menu.set(false)"></div>
        <div class="sheet" role="menu">
          <div class="who">
            <span class="av">{{ auth.initials() }}</span>
            <span><strong>{{ auth.profile()?.full_name }}</strong><em>{{ auth.profile()?.role_label }} · {{ auth.profile()?.organization?.name }}</em></span>
          </div>
          <div class="meta">
            <span>Device <code>{{ device }}</code></span>
            <span>Last sync {{ store.lastSync() ? (store.lastSync() | ago) : 'never' }}</span>
          </div>
          <button class="item" (click)="syncNow(); menu.set(false)" [disabled]="!store.online()"><vc-icon name="refresh" [size]="20" />Sync now</button>
          @if (auth.can('data.read')) {
            <a class="item" routerLink="/app/overview" (click)="menu.set(false)"><vc-icon name="dashboard" [size]="20" />Open the full platform</a>
          }
          <button class="item danger" (click)="signOut()"><vc-icon name="logout" [size]="20" />Sign out</button>
          @if (confirmOut()) {
            <div class="warnbox">
              {{ store.queued() }} record(s) have not uploaded yet. They stay on this phone and upload after the next sign-in.
              <button class="item danger" (click)="auth.logout()">Sign out anyway</button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host{display:block;min-height:100vh;background:#efece4}
    .app{max-width:600px;margin:0 auto;min-height:100vh;background:var(--sand-100);display:flex;flex-direction:column;position:relative;box-shadow:0 0 0 1px var(--sand-300)}
    .top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:10px;height:60px;padding:0 10px 0 16px;background:var(--forest-900);color:#fff}
    .brand{transform:scale(.92);transform-origin:left center}
    .spacer{flex:1}
    .pill{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 12px;border-radius:999px;border:0;font:600 13.5px var(--font);cursor:pointer;white-space:nowrap}
    .pill.ok{background:rgba(134,183,151,.22);color:#d9eee0}
    .pill.pending{background:#f1c46a;color:#3d2800}
    .pill.syncing{background:rgba(255,255,255,.16);color:#fff}
    .pill.offline{background:#fff;color:var(--red-600)}
    .pill.rejected{background:#ffd9d4;color:#8a1c14}
    .spin{animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .menu-btn{display:grid;place-items:center;width:48px;height:48px;border:0;border-radius:12px;background:none;color:#fff;cursor:pointer}
    .offline-bar{display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--stone-900);color:#fff;font-size:14px;font-weight:500}
    .body{flex:1;padding-bottom:88px}
    .tabs{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:600px;z-index:30;display:grid;grid-template-columns:repeat(4,1fr);
      background:#fff;border-top:1.5px solid var(--sand-300);padding:6px 6px calc(6px + env(safe-area-inset-bottom))}
    .tabs a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:60px;border-radius:12px;color:var(--stone-600);
      font-size:13px;font-weight:600;text-decoration:none!important;-webkit-tap-highlight-color:transparent}
    .tabs a.on{color:var(--forest-800);background:var(--forest-100)}
    .ico{position:relative;display:inline-flex}
    .dot{position:absolute;top:-6px;right:-12px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#e0a225;color:#2b1c00;font-size:11.5px;display:grid;place-items:center;border:2px solid #fff}
    .dot.bad{background:var(--red-600);color:#fff}
    .scrim{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:40}
    .sheet{position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:100%;max-width:600px;z-index:41;background:#fff;border-radius:20px 20px 0 0;
      padding:18px 16px calc(18px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:6px;animation:up .18s ease-out}
    @keyframes up{from{transform:translate(-50%,20px);opacity:0}}
    .who{display:flex;align-items:center;gap:12px;padding:4px 4px 12px;border-bottom:1px solid var(--sand-200)}
    .who span:last-child{display:flex;flex-direction:column}
    .who strong{font-size:16px} .who em{font-style:normal;font-size:13.5px;color:var(--stone-600)}
    .av{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--forest-700);color:#fff;font-weight:600}
    .meta{display:flex;flex-direction:column;gap:2px;padding:8px 4px 10px;font-size:13px;color:var(--stone-600)}
    .item{display:flex;align-items:center;gap:14px;min-height:54px;padding:0 12px;border:0;border-radius:12px;background:none;font:600 16px var(--font);color:var(--stone-900);cursor:pointer;text-decoration:none!important;width:100%}
    .item:hover{background:var(--sand-100)}
    .item[disabled]{opacity:.45}
    .item.danger{color:var(--red-600)}
    .warnbox{margin-top:6px;padding:12px;border-radius:12px;background:var(--amber-100);color:#5c3a00;font-size:14px;line-height:1.45}
  `],
})
export class FieldShell {
  auth = inject(AuthService);
  store = inject(OfflineStore);
  private data = inject(FieldData);
  menu = signal(false);
  confirmOut = signal(false);
  device = deviceId();

  pillTone = computed(() => (this.store.rejected() && this.store.online() && !this.store.syncing() ? 'rejected' : this.store.status()));
  pillIcon = computed(() => ({ offline: 'wifi-off', syncing: 'refresh', pending: 'cloud-upload', ok: 'check-circle', rejected: 'alert' } as Record<string, string>)[this.pillTone()]);
  pillText = computed(() => {
    const q = this.store.queued();
    switch (this.pillTone()) {
      case 'offline': return q ? `Offline · ${q} waiting` : 'Offline';
      case 'syncing': return 'Uploading…';
      case 'pending': return `${q} to upload`;
      case 'rejected': return `${this.store.rejected()} need attention`;
      default: return 'All synced';
    }
  });
  mapLink = computed(() => {
    const last = localStorage.getItem('vc.field.lastCampaign');
    return last ? ['/field/campaign', last] : ['/field/map'];
  });

  constructor() {
    void this.data.refreshBundles();
    if (navigator.onLine) void this.store.sync();
  }

  @HostListener('window:keydown.escape') esc() { this.menu.set(false); }

  syncNow() {
    if (this.store.online()) void this.store.sync();
  }

  signOut() {
    if (this.store.queued() && !this.confirmOut()) {
      this.confirmOut.set(true);
      return;
    }
    this.auth.logout();
  }
}
