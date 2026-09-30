import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, ErrorBox, Loading, Modal } from '../../ui/kit';
import { Chip } from '../fields/chip';
import { Practice, PracticeType, SOURCE_LABEL } from '../fields/field-data';
import { FieldLite } from './practice-form';

/** A practice record with its full version history, and correct / void actions. */
@Component({
  selector: 'vc-practice-drawer',
  imports: [FormsModule, RouterLink, Modal, Loading, ErrorBox, Callout, Badge, DataClass, Icon, Chip, DayPipe, HumanPipe, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [drawer]="true" width="560px" [title]="latest() ? typeName(latest()!.practice_code) : 'Practice record'"
      [subtitle]="latest() ? (fieldOf(latest()!.field_id)?.code ?? '') + ' · ' + (latest()!.performed_on | day) : ''">
      @if (loading()) { <vc-loading [rows]="6" /> }
      @else if (error()) { <vc-error title="Couldn't load this record" [message]="error()!" /> }
      @else if (latest(); as p) {
        <div class="stack">
          <div class="chips">
            <vc-badge [status]="p.status === 'voided' ? 'voided' : 'active'">{{ p.status === 'voided' ? 'Voided' : 'Current' }}</vc-badge>
            <vc-chip [tone]="p.scenario === 'baseline' ? 'outline' : 'forest'">{{ p.scenario | human }} scenario</vc-chip>
            <vc-chip tone="outline">{{ src(p.source) }}</vc-chip>
            <vc-dc [cls]="p.data_class" />
            <span class="spacer"></span>
            <span class="subtle small">Version {{ p.version }}</span>
          </div>

          @if (p.missing_evidence) {
            <vc-callout tone="warn" icon="file-warning">
              <strong>Evidence missing.</strong> This practice type needs {{ requiredEvidence(p.practice_code) }}. Add it with a correction so verifiers can confirm the record.
            </vc-callout>
          }
          @if (p.status === 'voided') {
            <vc-callout tone="info" icon="ban"><strong>Voided:</strong> {{ p.reason }}. It no longer counts in any calculation.</vc-callout>
          }

          <dl class="kv">
            <dt>Field</dt>
            <dd>@if (fieldOf(p.field_id); as f) { <a [routerLink]="['/app/fields', f.id]">{{ f.code }}</a> · {{ f.name }} } @else { <span class="mono small">{{ p.field_id.slice(0, 8) }}</span> }</dd>
            <dt>Date</dt><dd>{{ p.performed_on | day }}@if (p.ended_on && p.ended_on !== p.performed_on) { – {{ p.ended_on | day }} }</dd>
            <dt>Quantity</dt><dd class="num">{{ p.quantity !== null ? (p.quantity | num: 2) + ' ' + (p.unit ?? '') : '—' }}</dd>
            <dt>Area covered</dt><dd class="num">{{ p.area_ha !== null ? (p.area_ha | num: 2) + ' ha' : 'Whole field' }}</dd>
            @for (d of detailRows(); track d.key) { <dt>{{ d.label }}</dt><dd>{{ d.value }}</dd> }
            <dt>Evidence</dt>
            <dd>
              @if (p.evidence_ids.length) {
                <div class="ev">
                  @for (id of p.evidence_ids; track id; let i = $index) {
                    <button class="btn btn-secondary btn-sm" (click)="view(id)"><vc-icon name="file" [size]="13" />File {{ i + 1 }}</button>
                  }
                </div>
              } @else { <span class="subtle">None attached</span> }
            </dd>
          </dl>

          <div>
            <h3 class="sec">History</h3>
            <ol class="tl">
              @for (v of versions(); track v.id) {
                <li [class.void]="v.status === 'voided'" [class.cur]="$first">
                  <span class="pt"></span>
                  <div class="c">
                    <div class="h">
                      <strong>{{ v.version === 1 ? 'Recorded' : v.status === 'voided' ? 'Voided' : 'Corrected' }}</strong>
                      <span class="vn mono">v{{ v.version }}</span>
                      <span class="at">{{ v.created_at | day: true }}</span>
                    </div>
                    @if (v.version > 1) { <p class="why">“{{ v.reason }}”</p> }
                    @if (changes(v); as ch) {
                      @if (ch.length) {
                        <ul class="diff">@for (c of ch; track c.k) { <li><span class="k">{{ c.k }}</span><span class="from">{{ c.from }}</span><vc-icon name="arrow-right" [size]="11" /><span class="to">{{ c.to }}</span></li> }</ul>
                      }
                    }
                  </div>
                </li>
              }
            </ol>
          </div>
        </div>
      }

      @if (latest() && latest()!.status !== 'voided' && auth.can('practice.record')) {
        <div footer class="ft">
          <button class="btn btn-ghost danger-txt" (click)="voidOpen.set(true)"><vc-icon name="ban" />Void</button>
          <span class="grow"></span>
          <button class="btn btn-primary" (click)="correct.emit(latest()!)"><vc-icon name="pencil" />Correct</button>
        </div>
      }
    </vc-modal>

    <vc-modal [(open)]="voidOpen" title="Void this practice record?" width="480px">
      <p>A voided record stays in the history for the audit trail but no longer counts in any calculation. This can't be undone.</p>
      <div class="field mt">
        <label for="v-reason">Reason <span class="req">*</span></label>
        <textarea id="v-reason" class="input" rows="3" [ngModel]="voidReason()" (ngModelChange)="voidReason.set($event)" placeholder="e.g. Recorded twice — duplicate of the 12 June entry"></textarea>
        <span class="hint">At least 5 characters.</span>
      </div>
      @if (voidError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ voidError() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="voidOpen.set(false)">Cancel</button>
        <button class="btn btn-danger" [disabled]="voidReason().trim().length < 5 || busy()" (click)="doVoid()">{{ busy() ? 'Voiding…' : 'Void record' }}</button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .chips{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
    .spacer{flex:1}
    .ev{display:flex;gap:6px;flex-wrap:wrap}
    .sec{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin:6px 0 10px}
    .tl{list-style:none;margin:0;padding:0}
    .tl li{position:relative;display:flex;gap:12px;padding-bottom:16px}
    .tl li:not(:last-child)::before{content:'';position:absolute;left:5px;top:14px;bottom:0;width:2px;background:var(--sand-200)}
    .pt{flex:none;width:12px;height:12px;margin-top:4px;border-radius:50%;border:2px solid var(--stone-400);background:var(--surface)}
    .cur .pt{border-color:var(--forest-500);background:var(--forest-500)}
    .void .pt{border-color:var(--red-600)}
    .c{flex:1;min-width:0}
    .h{display:flex;gap:8px;align-items:baseline}
    .vn{font-size:11px;color:var(--text-3)}
    .at{margin-left:auto;font-size:12px;color:var(--text-3)}
    .why{margin-top:3px;font-size:13px;color:var(--stone-700)}
    .diff{list-style:none;margin:6px 0 0;padding:8px 10px;border-radius:6px;background:var(--surface-2);border:1px solid var(--border);display:flex;flex-direction:column;gap:4px}
    .diff li{display:flex;gap:6px;align-items:center;font-size:12px;flex-wrap:wrap}
    .k{color:var(--text-2);min-width:90px} .from{color:var(--stone-500);text-decoration:line-through} .to{color:var(--stone-900);font-weight:500}
    .ft{display:flex;gap:8px;align-items:center;width:100%}
    .grow{flex:1}
    .danger-txt{color:var(--danger)}
    .req{color:var(--danger)} .mt{margin-top:14px}
  `],
})
export class PracticeDrawer {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  open = model(false);
  recordId = input<string | null>(null);
  fields = input<FieldLite[]>([]);
  types = input<PracticeType[]>([]);
  /** Bump to reload (after a correction). */
  refresh = input(0);
  correct = output<Practice>();
  changed = output<void>();

  versions = signal<Practice[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  voidOpen = signal(false);
  voidReason = signal('');
  voidError = signal<string | null>(null);
  busy = signal(false);

  latest = computed(() => this.versions()[0] ?? null);
  detailRows = computed(() => {
    const p = this.latest();
    if (!p) return [];
    const defs = this.types().find(t => t.code === p.practice_code)?.fields ?? [];
    return Object.entries(p.details ?? {}).filter(([k]) => k !== 'client_ref').map(([k, v]) => {
      const d = (defs as { key: string; label: string; unit?: string }[]).find(x => x.key === k);
      return { key: k, label: d?.label ?? k, value: `${v}${d?.unit ? ' ' + d.unit : ''}` };
    });
  });

  constructor() {
    effect(() => {
      const id = this.recordId();
      this.refresh();
      if (!id || !this.open()) return;
      this.load(id);
    });
  }

  load(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Practice[]>(`/practices/${id}/versions`).subscribe({
      next: r => { this.versions.set([...r].sort((a, b) => b.version - a.version)); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  typeName(code: string) { return this.types().find(t => t.code === code)?.name ?? code; }
  fieldOf(id: string) { return this.fields().find(f => f.id === id) ?? null; }
  src(s: string) { return SOURCE_LABEL[s] ?? s; }
  requiredEvidence(code: string) {
    return (this.types().find(t => t.code === code)?.required_evidence ?? []).map(e => e.replace(/_/g, ' ')).join(', ') || 'evidence';
  }

  /** What changed between a version and the one before it. */
  changes(v: Practice): { k: string; from: string; to: string }[] {
    const prev = this.versions().find(x => x.version === v.version - 1);
    if (!prev || v.status === 'voided') return [];
    const out: { k: string; from: string; to: string }[] = [];
    const cmp = (k: string, a: unknown, b: unknown) => {
      const s = (x: unknown) => (x === null || x === undefined || x === '' ? '—' : typeof x === 'object' ? JSON.stringify(x) : String(x));
      if (s(a) !== s(b)) out.push({ k, from: s(a), to: s(b) });
    };
    cmp('Field', this.fieldOf(prev.field_id)?.code ?? prev.field_id, this.fieldOf(v.field_id)?.code ?? v.field_id);
    cmp('Practice', this.typeName(prev.practice_code), this.typeName(v.practice_code));
    cmp('Scenario', prev.scenario, v.scenario);
    cmp('Date', prev.performed_on, v.performed_on);
    cmp('End date', prev.ended_on, v.ended_on);
    cmp('Quantity', prev.quantity, v.quantity);
    cmp('Area (ha)', prev.area_ha, v.area_ha);
    cmp('Evidence files', prev.evidence_ids.length, v.evidence_ids.length);
    const keys = new Set([...Object.keys(prev.details ?? {}), ...Object.keys(v.details ?? {})]);
    keys.delete('client_ref');
    for (const k of keys) cmp(k, prev.details?.[k], v.details?.[k]);
    return out;
  }

  view(id: string) {
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: b => window.open(URL.createObjectURL(b), '_blank'),
      error: e => this.toast.apiError(e, "Couldn't open the file"),
    });
  }

  doVoid() {
    const p = this.latest()!;
    this.busy.set(true);
    this.voidError.set(null);
    this.api.post<Practice>(`/practices/${p.record_id}/void`, { reason: this.voidReason().trim() }).subscribe({
      next: () => {
        this.busy.set(false); this.voidOpen.set(false); this.voidReason.set('');
        this.toast.success('Practice record voided');
        this.load(p.record_id);
        this.changed.emit();
      },
      error: (e: ApiError) => { this.busy.set(false); this.voidError.set(e.message); },
    });
  }
}
