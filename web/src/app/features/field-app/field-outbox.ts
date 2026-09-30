import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgoPipe } from '../../core/format';
import { OfflineStore, QueuedPractice, QueuedSample, SyncState } from '../../core/offline';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { FIELD_CSS } from './field.styles';

interface Item {
  kind: 'sample' | 'practice';
  id: string;
  title: string;
  sub: string;
  createdAt: string;
  state: SyncState;
  error?: string;
  attempts: number;
  code?: string;
  photos: number;
  findings: { rule_code: string; severity: string; message: string }[];
}

const STATE_LABEL: Record<SyncState, string> = { queued: 'Waiting to upload', syncing: 'Uploading…', synced: 'Uploaded', rejected: 'Rejected' };
const STATE_TONE: Record<SyncState, string> = { queued: 'warn', syncing: 'info', synced: 'ok', rejected: 'bad' };

@Component({
  selector: 'vc-field-outbox',
  imports: [RouterLink, Icon, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fpage">
      <div class="top">
        <div>
          <div class="ftitle">Outbox</div>
          <div class="fsub">Everything recorded on this phone and whether it has reached the server.</div>
        </div>
      </div>
      <button class="fbtn primary block" [disabled]="!store.online() || store.syncing() || !store.queued()" (click)="store.sync()">
        <vc-icon name="refresh" [size]="20" />{{ store.syncing() ? 'Uploading…' : store.queued() ? 'Upload ' + store.queued() + ' now' : 'Nothing waiting' }}
      </button>
      @if (!store.online() && store.queued()) { <p class="fhint">You're offline. Records upload automatically when the phone has signal.</p> }

      <div class="seg">
        @for (f of filters; track f.key) {
          <button [class.on]="filter() === f.key" (click)="filter.set(f.key)">{{ f.label }} <b>{{ count(f.key) }}</b></button>
        }
      </div>

      @for (it of shown(); track it.id) {
        <article class="fcard item" [class]="'fcard item s-' + it.state">
          <div class="ih">
            <span class="kic"><vc-icon [name]="it.kind === 'sample' ? 'shovel' : 'sprout'" [size]="20" /></span>
            <div class="it">
              <strong>{{ it.title }}</strong>
              <span>{{ it.sub }} · {{ it.createdAt | ago }}</span>
            </div>
            <span class="chip" [class]="'chip ' + tone[it.state]">{{ label[it.state] }}</span>
          </div>
          @if (it.state === 'synced' && it.code) { <div class="ok-line"><vc-icon name="check-circle" [size]="16" />Server code <b class="mono">{{ it.code }}</b></div> }
          @if (it.findings.length) {
            <ul class="finds">
              @for (f of it.findings; track $index) { <li [class.block]="f.severity === 'blocking'"><vc-icon name="alert" [size]="15" />{{ f.message }}</li> }
            </ul>
          }
          @if (it.state === 'queued' && it.error) { <div class="retry-line"><vc-icon name="clock" [size]="16" />Last try failed: {{ it.error }} It will be tried again.</div> }
          @if (it.state === 'rejected') {
            <div class="rej"><strong>The server refused this record</strong><span>{{ it.error || 'No reason given.' }}</span></div>
            <div class="acts">
              <button class="fbtn secondary sm" [disabled]="!store.online()" (click)="retry(it)"><vc-icon name="refresh" [size]="18" />Retry</button>
              <button class="fbtn danger sm" (click)="askDiscard(it)"><vc-icon name="trash" [size]="18" />Discard</button>
            </div>
          }
          @if (it.state === 'queued') {
            <div class="acts end"><button class="linkbtn" (click)="askDiscard(it)">Delete from phone</button></div>
          }
          @if (confirmId() === it.id) {
            <div class="confirm">
              <p>Delete this {{ it.kind }} and its {{ it.photos }} photo(s) from the phone? {{ it.state === 'queued' ? 'It has not been uploaded — the fieldwork will be lost.' : 'This cannot be undone.' }}</p>
              <div class="acts">
                <button class="fbtn ghost sm" (click)="confirmId.set(null)">Keep</button>
                <button class="fbtn danger sm" (click)="discard(it)">Delete</button>
              </div>
            </div>
          }
        </article>
      } @empty {
        <div class="fcard fempty">
          <div class="ic"><vc-icon name="inbox" [size]="26" /></div>
          <h3>{{ filter() === 'rejected' ? 'Nothing rejected' : filter() === 'waiting' ? 'Nothing waiting' : 'Nothing recorded yet' }}</h3>
          <p>Samples and practices you save appear here until they are uploaded.</p>
          <a class="fbtn secondary" routerLink="/field">Go to Home</a>
        </div>
      }
    </div>
  `,
  styles: [FIELD_CSS, `
    .seg{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border:1.5px solid var(--sand-300);border-radius:12px;padding:4px;gap:4px}
    .seg button{min-height:42px;padding:0 4px;border:0;border-radius:9px;background:none;font:600 14px var(--font);color:var(--stone-700);cursor:pointer}
    .seg button.on{background:var(--forest-700);color:#fff}
    .seg b{opacity:.8;margin-left:2px}
    .item{padding:14px;display:flex;flex-direction:column;gap:10px}
    .item.s-rejected{border-color:#eba59f}
    .ih{display:flex;align-items:center;gap:12px}
    .kic{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:var(--sand-200);color:var(--stone-800);flex:none}
    .it{flex:1;min-width:0;display:flex;flex-direction:column}
    .it strong{font-size:16px} .it span{font-size:13.5px;color:var(--stone-600)}
    .ok-line,.retry-line{display:flex;gap:6px;align-items:center;font-size:14px;color:var(--forest-700)}
    .retry-line{color:#7a4d00;align-items:flex-start}
    .finds{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px}
    .finds li{display:flex;gap:6px;align-items:flex-start;font-size:13.5px;color:#7a4d00}
    .finds li.block{color:var(--red-600)}
    .rej{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:10px;background:var(--red-100);color:#7c1a13;font-size:14px}
    .acts{display:flex;gap:10px}
    .acts .fbtn{flex:1}
    .acts.end{justify-content:flex-end}
    .linkbtn{border:0;background:none;color:var(--stone-600);font:500 14px var(--font);text-decoration:underline;cursor:pointer;padding:6px}
    .confirm{padding:12px;border-radius:12px;background:var(--sand-100);display:flex;flex-direction:column;gap:10px;font-size:14.5px}
  `],
})
export class FieldOutbox {
  private toast = inject(ToastService);
  store = inject(OfflineStore);
  label = STATE_LABEL;
  tone = STATE_TONE;
  filters = [
    { key: 'all', label: 'All' }, { key: 'waiting', label: 'Waiting' }, { key: 'rejected', label: 'Rejected' }, { key: 'synced', label: 'Done' },
  ] as const;

  samples = signal<QueuedSample[]>([]);
  practices = signal<QueuedPractice[]>([]);
  filter = signal<'all' | 'waiting' | 'rejected' | 'synced'>('all');
  confirmId = signal<string | null>(null);

  items = computed<Item[]>(() => [
    ...this.samples().map(s => ({
      kind: 'sample' as const, id: s.localId, title: `Core at ${s.siteCode}`,
      sub: `${s.payload.layers.length} bag(s) · ${s.photos.length} photo(s)`, createdAt: s.createdAt, state: s.state,
      error: s.error, attempts: s.attempts, code: s.serverCode, photos: s.photos.length, findings: s.findings ?? [],
    })),
    ...this.practices().map(p => ({
      kind: 'practice' as const, id: p.localId, title: p.label, sub: `Practice · ${p.photos.length} photo(s)`, createdAt: p.createdAt,
      state: p.state, error: p.error, attempts: p.attempts, photos: p.photos.length, findings: [],
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  shown = computed(() => this.items().filter(i => this.match(i, this.filter())));

  constructor() {
    effect(() => {
      this.store.changed();
      void this.reload();
    });
  }

  private match(i: Item, f: string) {
    return f === 'all' || (f === 'waiting' && (i.state === 'queued' || i.state === 'syncing')) || i.state === f;
  }

  count(f: string) {
    return this.items().filter(i => this.match(i, f)).length;
  }

  async reload() {
    const [s, p] = await Promise.all([this.store.allSamples(), this.store.allPractices()]);
    this.samples.set(s);
    this.practices.set(p);
  }

  async retry(it: Item) {
    await this.store.requeue(it.id, it.kind);
    this.toast.info('Trying again', 'If the server refuses it again, the reason is shown here.');
  }

  askDiscard(it: Item) {
    this.confirmId.set(it.id);
  }

  async discard(it: Item) {
    if (it.kind === 'sample') await this.store.discardSample(it.id);
    else await this.store.discardPractice(it.id);
    this.confirmId.set(null);
    this.toast.success('Deleted from this phone');
  }
}
