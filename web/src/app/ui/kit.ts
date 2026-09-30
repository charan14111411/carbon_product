import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, HostListener, input, model, output, signal } from '@angular/core';
import { Icon } from './icon';

/* ------------------------------------------------------------------ status badge */
const TONES: Record<string, string> = {
  // positive
  active: 'ok', approved: 'ok', accepted: 'ok', enrolled: 'ok', eligible: 'ok', verified: 'ok', issued: 'ok',
  complete: 'ok', completed: 'ok', paid: 'ok', resolved: 'ok', online: 'ok', confirmed: 'ok', published: 'ok',
  delivered: 'ok', retired: 'neutral', collected: 'ok', intact: 'ok', ok: 'ok', answered: 'ok',
  // in progress
  draft: 'neutral', planned: 'neutral', pending: 'warn', under_review: 'info', calculated: 'info', in_review: 'info',
  fieldwork: 'info', lab: 'info', monitoring: 'info', design: 'neutral', reserved: 'info', contracted: 'info',
  in_progress: 'info', assessing: 'warn', submitted: 'info', open: 'warn', candidate: 'info', provisional: 'neutral',
  acknowledged: 'info', inconclusive: 'neutral', on_hold: 'warn', warning: 'warn', action: 'warn', appealed: 'warn',
  // negative
  rejected: 'danger', ineligible: 'danger', failed: 'danger', voided: 'neutral', withdrawn: 'neutral',
  cancelled: 'neutral', superseded: 'neutral', offline: 'danger', mismatch: 'danger', blocking: 'danger',
  error: 'danger', partially_failed: 'danger', findings: 'danger', suspended: 'warn', closed: 'neutral',
  skipped: 'neutral', exited: 'neutral', inactive: 'neutral', info: 'info',
};

@Component({
  selector: 'vc-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="dot"></span><ng-content>{{ label() }}</ng-content>`,
  host: { '[class]': '"badge tone-" + tone()' },
  styles: [`
    :host{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 9px;border-radius:999px;font-size:12px;
      font-weight:500;white-space:nowrap;line-height:1;border:1px solid transparent}
    .dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.85}
    :host(.tone-ok){background:var(--ok-soft);color:var(--forest-700);border-color:#cfe2d4}
    :host(.tone-warn){background:var(--warn-soft);color:var(--amber-600);border-color:#f1dcae}
    :host(.tone-danger){background:var(--danger-soft);color:var(--red-600);border-color:#f3c7c3}
    :host(.tone-info){background:var(--info-soft);color:var(--sky-600);border-color:#c9dcf0}
    :host(.tone-neutral){background:var(--stone-100);color:var(--stone-600);border-color:var(--stone-200)}
  `],
})
export class Badge {
  status = input<string>('');
  tone = computed(() => TONES[this.status()] ?? 'neutral');
  label = computed(() => humanize(this.status()));
}

export function humanize(v: string | null | undefined): string {
  if (!v) return '—';
  const s = String(v).replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ------------------------------------------------------------------ data class badge */
const DC: Record<string, string> = {
  MEASURED: 'measured', OBSERVED: 'observed', RECORDED: 'recorded', DERIVED: 'derived', CALCULATED: 'calculated',
  MODELLED: 'modelled',
};

@Component({
  selector: 'vc-dc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ cls() }}`,
  host: { '[class]': '"dc dc-" + key()', '[attr.title]': 'title()' },
  styles: [`
    :host{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:4px;font:600 10px/1 var(--mono);
      letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
    :host(.dc-measured){color:var(--dc-measured);background:var(--dc-measured-bg)}
    :host(.dc-observed){color:var(--dc-observed);background:var(--dc-observed-bg)}
    :host(.dc-recorded){color:var(--dc-recorded);background:var(--dc-recorded-bg)}
    :host(.dc-derived){color:var(--dc-derived);background:var(--dc-derived-bg)}
    :host(.dc-calculated){color:var(--dc-calculated);background:var(--dc-calculated-bg)}
    :host(.dc-modelled){color:var(--dc-modelled);background:var(--dc-modelled-bg)}
  `],
})
export class DataClass {
  cls = input<string>('MEASURED');
  key = computed(() => DC[this.cls()?.toUpperCase()] ?? 'recorded');
  title = computed(() => ({
    measured: 'Measured by a lab or instrument', observed: 'Observed by satellite or sensor',
    recorded: 'Recorded by a person or system', derived: 'Worked out from other data',
    calculated: 'Produced by the calculation engine', modelled: 'A model estimate — never a measurement',
  } as Record<string, string>)[this.key()]);
}

/* ------------------------------------------------------------------ page header */
@Component({
  selector: 'vc-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (eyebrow()) { <div class="eyebrow">{{ eyebrow() }}</div> }
    <div class="row-top">
      <div class="titles">
        <h1>{{ title() }}</h1>
        @if (subtitle()) { <p class="sub">{{ subtitle() }}</p> }
      </div>
      <div class="actions"><ng-content select="[actions]" /></div>
    </div>
    <ng-content />
  `,
  styles: [`
    :host{display:block;margin-bottom:24px}
    .eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--forest-500);margin-bottom:6px}
    .row-top{display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap}
    .titles{flex:1;min-width:240px}
    .sub{margin-top:6px;color:var(--text-2);max-width:760px}
    .actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  `],
})
export class PageHeader {
  title = input.required<string>();
  subtitle = input<string>('');
  eyebrow = input<string>('');
}

/* ------------------------------------------------------------------ stat tile */
@Component({
  selector: 'vc-stat',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <span class="label">{{ label() }}</span>
      @if (icon()) { <span class="ic"><vc-icon [name]="icon()" [size]="16" /></span> }
    </div>
    <div class="value num">{{ value() }}<span class="unit">{{ unit() }}</span></div>
    @if (hint()) { <div class="hint">{{ hint() }}</div> }
  `,
  host: { class: 'card', '[class.accent]': 'accent()' },
  styles: [`
    :host{display:block;padding:16px 18px}
    .top{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .label{font-size:12.5px;color:var(--text-2);font-weight:500}
    .ic{display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:var(--forest-50);color:var(--forest-600)}
    .value{font-size:26px;font-weight:600;letter-spacing:-.02em;margin-top:8px;color:var(--stone-900)}
    .unit{font-size:13px;font-weight:500;color:var(--text-3);margin-left:5px;letter-spacing:0}
    .hint{margin-top:4px;font-size:12px;color:var(--text-3)}
    :host(.accent){background:linear-gradient(135deg,var(--forest-800),var(--forest-600));border-color:var(--forest-700)}
    :host(.accent) .label,:host(.accent) .hint,:host(.accent) .unit{color:rgba(255,255,255,.72)}
    :host(.accent) .value{color:#fff}
    :host(.accent) .ic{background:rgba(255,255,255,.12);color:#fff}
  `],
})
export class Stat {
  label = input.required<string>();
  value = input<string | number | null>('—');
  unit = input<string>('');
  hint = input<string>('');
  icon = input<string>('');
  accent = input<boolean>(false);
}

/* ------------------------------------------------------------------ states */
@Component({
  selector: 'vc-empty',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ic"><vc-icon [name]="icon()" [size]="22" /></div>
    <h3>{{ title() }}</h3>
    @if (text()) { <p>{{ text() }}</p> }
    <div class="act"><ng-content /></div>
  `,
  styles: [`
    :host{display:flex;flex-direction:column;align-items:center;text-align:center;padding:48px 24px;gap:8px}
    .ic{display:grid;place-items:center;width:48px;height:48px;border-radius:12px;background:var(--sand-200);color:var(--stone-600);margin-bottom:6px}
    p{color:var(--text-2);max-width:420px}
    .act{margin-top:10px;display:flex;gap:8px}
  `],
})
export class Empty {
  icon = input<string>('inbox');
  title = input<string>('Nothing here yet');
  text = input<string>('');
}

@Component({
  selector: 'vc-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (r of rowsArr(); track $index) { <div class="bar" [style.width.%]="r"></div> }`,
  styles: [`
    :host{display:flex;flex-direction:column;gap:12px;padding:20px}
    .bar{height:12px;border-radius:6px;background:linear-gradient(90deg,var(--sand-200),var(--sand-100),var(--sand-200));
      background-size:200% 100%;animation:sh 1.3s ease-in-out infinite}
    @keyframes sh{0%{background-position:100% 0}100%{background-position:-100% 0}}
  `],
})
export class Loading {
  rows = input<number>(4);
  rowsArr = computed(() => Array.from({ length: this.rows() }, (_, i) => [92, 76, 84, 60, 70, 88][i % 6]));
}

@Component({
  selector: 'vc-error',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-icon name="alert" [size]="18" />
    <div class="txt"><strong>{{ title() }}</strong><span>{{ message() }}</span></div>
    <ng-content />
  `,
  styles: [`
    :host{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:var(--radius-sm);
      background:var(--danger-soft);color:var(--red-600);border:1px solid #f3c7c3}
    .txt{display:flex;flex-direction:column;gap:2px;flex:1}
    .txt span{color:var(--stone-700)}
  `],
})
export class ErrorBox {
  title = input<string>('Something went wrong');
  message = input<string>('');
}

@Component({
  selector: 'vc-callout',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<vc-icon [name]="icon()" [size]="18" /><div class="c"><ng-content /></div>`,
  host: { '[class]': '"tone-" + tone()' },
  styles: [`
    :host{display:flex;gap:10px;padding:12px 14px;border-radius:var(--radius-sm);border:1px solid;font-size:13.5px}
    .c{flex:1;min-width:0}
    :host(.tone-info){background:var(--info-soft);border-color:#c9dcf0;color:var(--stone-800)} :host(.tone-info) vc-icon{color:var(--sky-600)}
    :host(.tone-ok){background:var(--ok-soft);border-color:#cfe2d4;color:var(--stone-800)} :host(.tone-ok) vc-icon{color:var(--forest-600)}
    :host(.tone-warn){background:var(--warn-soft);border-color:#f1dcae;color:var(--stone-800)} :host(.tone-warn) vc-icon{color:var(--amber-600)}
    :host(.tone-danger){background:var(--danger-soft);border-color:#f3c7c3;color:var(--stone-800)} :host(.tone-danger) vc-icon{color:var(--red-600)}
  `],
})
export class Callout {
  tone = input<'info' | 'ok' | 'warn' | 'danger'>('info');
  icon = input<string>('info');
}

/* ------------------------------------------------------------------ modal / drawer */
@Component({
  selector: 'vc-modal',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="scrim" (click)="close()"></div>
      <section class="panel" [class.drawer]="drawer()" [style.width]="width()" role="dialog" aria-modal="true">
        <header>
          <div class="t"><h2>{{ title() }}</h2>@if (subtitle()) { <p>{{ subtitle() }}</p> }</div>
          <button class="btn btn-ghost btn-icon" (click)="close()" aria-label="Close"><vc-icon name="x" [size]="18" /></button>
        </header>
        <div class="body"><ng-content /></div>
        <footer><ng-content select="[footer]" /></footer>
      </section>
    }
  `,
  styles: [`
    .scrim{position:fixed;inset:0;background:rgba(16,24,20,.42);backdrop-filter:blur(2px);z-index:100;animation:f .15s}
    .panel{position:fixed;z-index:101;left:50%;top:8vh;transform:translateX(-50%);max-width:calc(100vw - 32px);max-height:84vh;
      display:flex;flex-direction:column;background:var(--surface);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);animation:p .18s ease-out}
    .panel.drawer{left:auto;right:0;top:0;bottom:0;transform:none;max-height:100vh;height:100vh;border-radius:0;animation:d .2s ease-out}
    header{display:flex;align-items:flex-start;gap:12px;padding:18px 20px 14px;border-bottom:1px solid var(--border)}
    .t{flex:1} .t p{margin-top:4px;color:var(--text-2);font-size:13px}
    .body{padding:20px;overflow:auto;flex:1}
    footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--border);background:var(--surface-2);border-radius:0 0 var(--radius-lg) var(--radius-lg)}
    footer:empty{display:none}
    @keyframes f{from{opacity:0}} @keyframes p{from{opacity:0;transform:translate(-50%,8px)}} @keyframes d{from{transform:translateX(24px);opacity:0}}
  `],
})
export class Modal {
  open = model<boolean>(false);
  title = input<string>('');
  subtitle = input<string>('');
  width = input<string>('560px');
  drawer = input<boolean>(false);
  closed = output<void>();
  close() {
    this.open.set(false);
    this.closed.emit();
  }
  @HostListener('document:keydown.escape') esc() {
    if (this.open()) this.close();
  }
}

/* ------------------------------------------------------------------ tabs */
export interface TabItem { key: string; label: string; count?: number | null }

@Component({
  selector: 'vc-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (t of tabs(); track t.key) {
      <button type="button" [class.on]="t.key === active()" (click)="active.set(t.key)">
        {{ t.label }} @if (t.count !== undefined && t.count !== null) { <span class="c">{{ t.count }}</span> }
      </button>
    }
  `,
  styles: [`
    :host{display:flex;gap:4px;border-bottom:1px solid var(--border);margin-bottom:20px;overflow-x:auto}
    button{position:relative;height:40px;padding:0 14px;border:0;background:none;font:inherit;font-weight:500;color:var(--text-2);cursor:pointer;white-space:nowrap}
    button:hover{color:var(--text)}
    button.on{color:var(--forest-700)}
    button.on::after{content:'';position:absolute;left:10px;right:10px;bottom:-1px;height:2px;border-radius:2px;background:var(--forest-600)}
    .c{display:inline-grid;place-items:center;min-width:20px;height:18px;padding:0 6px;margin-left:4px;border-radius:9px;background:var(--sand-200);font-size:11px;color:var(--stone-600)}
  `],
})
export class Tabs {
  tabs = input.required<TabItem[]>();
  active = model.required<string>();
}

/* ------------------------------------------------------------------ copyable hash */
@Component({
  selector: 'vc-hash',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-icon name="fingerprint" [size]="14" />
    <code [title]="value()">{{ short() }}</code>
    <button type="button" (click)="copy($event)" [attr.aria-label]="'Copy fingerprint'">
      <vc-icon [name]="copied() ? 'check' : 'copy'" [size]="13" />
    </button>
  `,
  styles: [`
    :host{display:inline-flex;align-items:center;gap:6px;padding:2px 4px 2px 8px;border-radius:6px;background:var(--sand-100);
      border:1px solid var(--border);color:var(--stone-600);max-width:100%}
    code{font-size:12px;color:var(--stone-800)}
    button{display:grid;place-items:center;width:22px;height:22px;border:0;border-radius:4px;background:none;color:var(--stone-500);cursor:pointer}
    button:hover{background:var(--sand-200);color:var(--stone-800)}
  `],
})
export class Hash {
  value = input<string>('');
  full = input<boolean>(false);
  copied = signal(false);
  short = computed(() => (this.full() ? this.value() : `${this.value().slice(0, 10)}…${this.value().slice(-6)}`));
  copy(ev: Event) {
    ev.stopPropagation();
    navigator.clipboard?.writeText(this.value());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1400);
  }
}

/* ------------------------------------------------------------------ progress bar */
@Component({
  selector: 'vc-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="track"><div class="fill" [style.width.%]="pct()" [class]="tone()"></div></div>`,
  styles: [`
    :host{display:block}
    .track{height:6px;border-radius:3px;background:var(--sand-200);overflow:hidden}
    .fill{height:100%;border-radius:3px;background:var(--forest-500);transition:width .4s ease}
    .fill.warn{background:var(--amber-600)} .fill.danger{background:var(--red-600)}
  `],
})
export class Progress {
  value = input<number>(0);
  max = input<number>(100);
  tone = input<'ok' | 'warn' | 'danger'>('ok');
  pct = computed(() => (this.max() > 0 ? Math.max(0, Math.min(100, (this.value() / this.max()) * 100)) : 0));
}

/* ------------------------------------------------------------------ file drop */
@Component({
  selector: 'vc-file-drop',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input #inp type="file" [accept]="accept()" (change)="pick($event)" hidden />
    <button type="button" class="zone" [class.over]="over()" (click)="inp.click()"
      (dragover)="$event.preventDefault(); over.set(true)" (dragleave)="over.set(false)" (drop)="drop($event)">
      <vc-icon name="upload" [size]="20" />
      <span class="t">{{ file()?.name ?? label() }}</span>
      <span class="s">{{ file() ? size() : hint() }}</span>
    </button>
  `,
  styles: [`
    .zone{width:100%;display:flex;flex-direction:column;align-items:center;gap:6px;padding:22px;border:1.5px dashed var(--border-strong);
      border-radius:var(--radius);background:var(--surface-2);color:var(--stone-600);cursor:pointer;font:inherit}
    .zone:hover,.zone.over{border-color:var(--forest-400);background:var(--forest-50);color:var(--forest-700)}
    .t{font-weight:500;color:var(--stone-800)} .s{font-size:12px;color:var(--text-3)}
  `],
})
export class FileDrop {
  accept = input<string>('');
  label = input<string>('Choose a file or drop it here');
  hint = input<string>('PDF, JPG, PNG or CSV · up to 25 MB');
  file = model<File | null>(null);
  over = signal(false);
  size = computed(() => {
    const b = this.file()?.size ?? 0;
    return b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`;
  });
  pick(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.file.set(f);
  }
  drop(e: DragEvent) {
    e.preventDefault();
    this.over.set(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) this.file.set(f);
  }
}

/* ------------------------------------------------------------------ timeline */
export interface TimelineItem { title: string; at?: string | null; by?: string | null; note?: string | null; tone?: string }

@Component({
  selector: 'vc-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (i of items(); track $index) {
      <div class="it" [class]="'t-' + (i.tone ?? 'ok')">
        <span class="pt"></span>
        <div class="c">
          <div class="h"><strong>{{ i.title }}</strong>@if (i.at) { <span class="at">{{ i.at }}</span> }</div>
          @if (i.by) { <div class="by">{{ i.by }}</div> }
          @if (i.note) { <div class="n">{{ i.note }}</div> }
        </div>
      </div>
    } @empty { <p class="muted small">No events yet.</p> }
  `,
  styles: [`
    :host{display:block}
    .it{position:relative;display:flex;gap:12px;padding-bottom:16px}
    .it:not(:last-child)::before{content:'';position:absolute;left:5px;top:14px;bottom:0;width:2px;background:var(--sand-200)}
    .pt{flex:none;width:12px;height:12px;margin-top:4px;border-radius:50%;border:2px solid var(--forest-500);background:var(--surface)}
    .t-warn .pt{border-color:var(--amber-600)} .t-danger .pt{border-color:var(--red-600)} .t-neutral .pt{border-color:var(--stone-400)}
    .c{flex:1;min-width:0} .h{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
    .at{font-size:12px;color:var(--text-3)} .by{font-size:12.5px;color:var(--text-2)} .n{margin-top:4px;font-size:13px;color:var(--stone-700)}
  `],
})
export class Timeline {
  items = input<TimelineItem[]>([]);
}

export const KIT = [Icon, Badge, DataClass, PageHeader, Stat, Empty, Loading, ErrorBox, Callout, Modal, Tabs, Hash, Progress, FileDrop, Timeline, NgTemplateOutlet];
