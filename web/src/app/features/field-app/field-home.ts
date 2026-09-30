import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiError } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, HumanPipe } from '../../core/format';
import { OfflineStore } from '../../core/offline';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Assignment, FieldData } from './field-data';
import { FIELD_CSS } from './field.styles';

@Component({
  selector: 'vc-field-home',
  imports: [RouterLink, Icon, AgoPipe, DayPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fpage">
      <div>
        <div class="ftitle">{{ greeting() }}, {{ firstName() }}</div>
        <div class="fsub">{{ today }}</div>
      </div>

      <section class="fcard status" [class]="'fcard status s-' + store.status()">
        <div class="srow">
          <span class="sic"><vc-icon [name]="store.online() ? 'wifi' : 'wifi-off'" [size]="22" [stroke]="2.2" /></span>
          <div class="st">
            <strong>{{ store.online() ? 'Online' : 'Offline' }}</strong>
            <span>
              @if (store.syncing()) { Uploading your records… }
              @else if (store.queued()) { {{ store.queued() }} record(s) waiting to upload }
              @else { Everything on this phone is uploaded }
            </span>
          </div>
        </div>
        <div class="counts">
          <div><b class="num">{{ store.queued() }}</b><span>Waiting</span></div>
          <div [class.bad]="store.rejected()"><b class="num">{{ store.rejected() }}</b><span>Need attention</span></div>
          <div><b>{{ store.lastSync() ? (store.lastSync() | ago) : 'Never' }}</b><span>Last sync</span></div>
        </div>
        <div class="sact">
          <button class="fbtn primary block" [disabled]="!store.online() || store.syncing()" (click)="sync()">
            <vc-icon name="refresh" [size]="20" />{{ store.syncing() ? 'Syncing…' : 'Sync now' }}
          </button>
          @if (store.rejected()) {
            <a class="fbtn danger block" routerLink="/field/outbox"><vc-icon name="alert" [size]="20" />Review {{ store.rejected() }} rejected</a>
          }
        </div>
      </section>

      <div class="fsec">My campaigns</div>

      @if (loading() && !list().length) {
        <div class="fcard fcard-pad skel"><span></span><span></span><span></span></div>
      } @else if (error() && !list().length) {
        <div class="fcard fempty">
          <div class="ic"><vc-icon name="wifi-off" [size]="26" /></div>
          <h3>Couldn't load your campaigns</h3>
          <p>{{ error() }}</p>
          <button class="fbtn secondary" (click)="load()">Try again</button>
        </div>
      } @else if (!list().length) {
        <div class="fcard fempty">
          <div class="ic"><vc-icon name="clipboard" [size]="26" /></div>
          <h3>No points assigned to you</h3>
          <p>When your supervisor assigns sampling points, the campaign appears here. You can still record practices.</p>
          <a class="fbtn secondary" routerLink="/field/practice"><vc-icon name="sprout" [size]="20" />Record a practice</a>
        </div>
      } @else {
        @if (error()) { <p class="stale"><vc-icon name="info" [size]="15" />Showing the list saved {{ data.assignmentsAt() | ago }}. {{ error() }}</p> }
        @for (c of list(); track c.id) {
          @let b = bundleOf(c.id);
          <article class="fcard camp">
            <button class="ctop" (click)="open(c)">
              <div class="cinfo">
                <div class="cl"><span class="code mono">{{ c.code }}</span><span class="chip" [class]="'chip ' + tone(c.status)">{{ c.status | human }}</span></div>
                <h3>{{ c.name }}</h3>
                <div class="cm">{{ c.kind | human }} · depth {{ c.depth_from_cm }}–{{ c.depth_to_cm }} cm · until {{ c.planned_end | day }}</div>
              </div>
              <vc-icon name="chevron-right" [size]="24" />
            </button>
            <div class="cprog">
              <div class="pl"><span><b class="num">{{ done(c) }}</b> of {{ c.points.length }} points done</span><span>{{ c.remaining }} to go</span></div>
              <div class="bar"><i [style.width.%]="c.points.length ? 100 * done(c) / c.points.length : 0"></i></div>
            </div>
            <div class="cfoot">
              @if (c.status === 'complete') {
                <span class="dl"><vc-icon name="lock" [size]="18" />Finished · no more cores accepted</span>
              } @else if (b) {
                <span class="dl ok"><vc-icon name="check-circle" [size]="18" [stroke]="2.2" />Ready offline · saved {{ b.savedAt | ago }}</span>
                <button class="fbtn ghost sm" [disabled]="!store.online() || busy() === c.id" (click)="download(c)">{{ busy() === c.id ? 'Updating…' : 'Update' }}</button>
              } @else {
                <span class="dl"><vc-icon name="download" [size]="18" />Not downloaded</span>
                <button class="fbtn secondary sm" [disabled]="!store.online() || busy() === c.id" (click)="download(c)">
                  <vc-icon name="download" [size]="18" />{{ busy() === c.id ? 'Downloading…' : 'Download for offline' }}
                </button>
              }
            </div>
          </article>
        }
      }
    </div>
  `,
  styles: [FIELD_CSS, `
    .status{padding:16px;display:flex;flex-direction:column;gap:14px}
    .srow{display:flex;align-items:center;gap:12px}
    .sic{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:var(--forest-100);color:var(--forest-800)}
    .s-offline .sic{background:var(--stone-900);color:#fff}
    .s-pending .sic{background:var(--amber-100);color:#7a4d00}
    .st{display:flex;flex-direction:column}
    .st strong{font-size:18px} .st span{font-size:14.5px;color:var(--stone-700)}
    .counts{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--sand-300);border-radius:12px;overflow:hidden;border:1.5px solid var(--sand-300)}
    .counts div{background:var(--sand-50);padding:10px 12px;display:flex;flex-direction:column;gap:2px}
    .counts b{font-size:18px;color:var(--stone-900)} .counts span{font-size:12.5px;color:var(--stone-600);font-weight:500}
    .counts .bad b{color:var(--red-600)}
    .sact{display:flex;flex-direction:column;gap:10px}
    .stale{display:flex;gap:6px;align-items:center;font-size:13.5px;color:var(--stone-700)}
    .camp{overflow:hidden}
    .ctop{display:flex;align-items:center;gap:10px;width:100%;padding:16px;border:0;background:none;text-align:left;font:inherit;cursor:pointer;color:var(--stone-700)}
    .cinfo{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
    .cl{display:flex;align-items:center;gap:8px}
    .code{font-size:13.5px;font-weight:600;color:var(--stone-700)}
    .camp h3{font-size:18px;color:var(--stone-900);line-height:1.25}
    .cm{font-size:14px;color:var(--stone-600)}
    .cprog{padding:0 16px 14px}
    .pl{display:flex;justify-content:space-between;font-size:14px;color:var(--stone-700);margin-bottom:6px}
    .pl b{color:var(--stone-900)}
    .bar{height:10px;border-radius:5px;background:var(--sand-200);overflow:hidden}
    .bar i{display:block;height:100%;background:var(--forest-600);border-radius:5px}
    .cfoot{display:flex;align-items:center;gap:10px;padding:12px 16px;border-top:1.5px solid var(--sand-200);background:var(--sand-50)}
    .dl{flex:1;display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:var(--stone-700)}
    .dl.ok{color:var(--forest-700)}
    .skel{display:flex;flex-direction:column;gap:10px}
    .skel span{height:14px;border-radius:7px;background:var(--sand-200)}
    .skel span:nth-child(2){width:70%} .skel span:nth-child(3){width:40%}
  `],
})
export class FieldHome {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  store = inject(OfflineStore);
  data = inject(FieldData);

  loading = signal(false);
  error = signal<string | null>(null);
  busy = signal<string | null>(null);
  today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  /** Active work first; finished campaigns last. */
  list = computed(() => {
    const order: Record<string, number> = { fieldwork: 0, planned: 1, lab: 2, complete: 3 };
    return [...this.data.assignments()].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || a.planned_start.localeCompare(b.planned_start));
  });
  firstName = computed(() => (this.auth.profile()?.full_name ?? '').split(' ')[0]);
  greeting = computed(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  });

  constructor() {
    this.load();
  }

  async load() {
    if (!navigator.onLine) {
      this.error.set("You're offline.");
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.data.loadAssignments();
    } catch (e) {
      this.error.set((e as ApiError).message);
    } finally {
      this.loading.set(false);
    }
  }

  bundleOf(id: string) {
    return this.data.bundles().find(b => b.campaignId === id) ?? null;
  }

  done(c: Assignment) {
    return c.points.filter(p => p.status !== 'planned').length;
  }

  tone(s: string) {
    return s === 'fieldwork' ? 'ok' : s === 'planned' ? 'info' : 'muted';
  }

  async sync() {
    await this.store.sync();
    if (navigator.onLine) void this.load();
  }

  async download(c: Assignment) {
    this.busy.set(c.id);
    try {
      const b = await this.data.download(c.id);
      this.toast.success(`${c.code} is ready offline`, `${b.points.length} points and ${b.fields.features.length} field boundaries saved on this phone.`);
    } catch (e) {
      this.toast.apiError(e, "Couldn't download the campaign");
    } finally {
      this.busy.set(null);
    }
  }

  open(c: Assignment) {
    this.router.navigate(['/field/campaign', c.id]);
  }
}
