import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { KIT } from '../../ui/kit';
import { Remote } from '../supporting/shared';

interface Run { id: string; period_label: string; period_start: string; period_end: string; net_t_co2e: number; status: string | null; created_at: string }
interface Citation { type: string; id?: string; key?: string; ref?: string; role?: string; source?: string | null; snapshot_sha256?: string }
interface Answer { question: string; run_id: string | null; method: string; answered: boolean; intent: string | null; answer: string; citations: Citation[] }
interface Turn { q: string; runLabel: string | null; a?: Answer; error?: string; at: Date }

const SUGGESTIONS = [
  'Where did the net result come from?',
  'Why was the buffer deducted?',
  'Which samples were used?',
  'Which rules applied?',
];
const CITE_LABEL: Record<string, string> = {
  calculation_run: 'Calculation run', rule_pack: 'Rule pack', campaign: 'Sampling campaign', rule: 'Rule', sample: 'Sample',
};

@Component({
  selector: 'vc-assistant-page',
  imports: [...KIT, FormsModule, RouterLink, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/partners" class="back"><vc-icon name="arrow-left" [size]="14" />Partners & API</a>
    <vc-page-header title="Results assistant" eyebrow="Explain a calculation"
      subtitle="Ask where a number came from, why deductions were made, which samples and rules were used. Answers are looked up from the saved calculation record — no AI model is involved, and nothing is made up." />

    <div class="layout">
      <section class="card chat">
        <div class="thread" #thread>
          @if (!turns().length) {
            <div class="intro">
              <span class="ii"><vc-icon name="message" [size]="20" /></span>
              <h3>Ask about a calculation run</h3>
              <p class="muted">Pick a run on the right, then ask in plain words. Each answer lists the records it came from.</p>
              <div class="sugg">@for (s of suggestions; track s) { <button type="button" class="sg" (click)="ask(s)">{{ s }}</button> }</div>
            </div>
          }
          @for (t of turns(); track $index) {
            <div class="msg me"><div class="bub">{{ t.q }}@if (t.runLabel) { <span class="ctx">{{ t.runLabel }}</span> }</div></div>
            <div class="msg bot">
              <span class="av"><vc-icon name="calculator" [size]="14" /></span>
              <div class="bub" [class.na]="t.a && !t.a.answered" [class.err]="!!t.error">
                @if (t.error) { {{ t.error }} }
                @else if (!t.a) { <span class="typing"><i></i><i></i><i></i></span> }
                @else {
                  <p>{{ t.a.answer }}</p>
                  @if (t.a.citations.length) {
                    <div class="cites">
                      <span class="ch">Sources · {{ t.a.citations.length }}</span>
                      <ul>
                        @for (c of t.a.citations.slice(0, showAll()[$index] ? 999 : 6); track $index) {
                          <li><span class="ct">{{ citeLabel(c) }}</span><code>{{ citeRef(c) }}</code>@if (c.source) { <span class="small subtle">{{ c.source }}</span> }</li>
                        }
                      </ul>
                      @if (t.a.citations.length > 6 && !showAll()[$index]) {
                        <button type="button" class="more" (click)="expand($index)">Show all {{ t.a.citations.length }}</button>
                      }
                    </div>
                  }
                  <div class="meth">{{ t.a.method }}</div>
                }
              </div>
            </div>
          }
        </div>
        <form class="composer" (ngSubmit)="ask(question)">
          <input class="input" name="q" [(ngModel)]="question" placeholder="e.g. Why was an uncertainty deduction made?" maxlength="1000" autocomplete="off" />
          <button class="btn btn-primary" type="submit" [disabled]="question.trim().length < 3 || pending()"><vc-icon name="send" />Ask</button>
        </form>
      </section>

      <aside class="side">
        <section class="card">
          <div class="card-head"><h3>Calculation run</h3></div>
          <div class="card-body">
            @if (!ctx.currentId()) { <p class="muted small">Choose a project in the top bar to list its runs.</p> }
            @else if (runs.loading()) { <vc-loading [rows]="3" /> }
            @else if (!runs.data()?.length) { <p class="muted small">This project has no calculation runs yet. The assistant can still tell you what it can answer.</p> }
            @else {
              <div class="runs">
                @for (r of runs.data(); track r.id) {
                  <label class="run" [class.on]="runId() === r.id">
                    <input type="radio" name="run" [value]="r.id" [ngModel]="runId()" (ngModelChange)="runId.set($event)" />
                    <span class="rm"><strong>{{ r.period_label }}</strong><span class="small subtle">{{ r.period_start | day }} – {{ r.period_end | day }}</span></span>
                    <span class="rr"><span class="num">{{ r.net_t_co2e | num: 1 }} <small>t</small></span>@if (r.status) { <vc-badge [status]="r.status" /> }</span>
                  </label>
                }
              </div>
            }
          </div>
        </section>
        <vc-callout tone="info" icon="info">The assistant answers four kinds of question: where a result came from, why deductions were made, which samples were used, and which rules applied.</vc-callout>
      </aside>
    </div>
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;margin-bottom:12px;color:var(--text-2)}
    .layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:start}
    @media (max-width:1100px){.layout{grid-template-columns:1fr}}
    .chat{display:flex;flex-direction:column;height:calc(100vh - 260px);min-height:480px}
    .thread{flex:1;overflow:auto;padding:20px;display:flex;flex-direction:column;gap:14px}
    .intro{margin:auto;text-align:center;max-width:480px;display:flex;flex-direction:column;align-items:center;gap:8px}
    .ii{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--forest-50);color:var(--forest-600)}
    .sugg{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px}
    .sg{border:1px solid var(--border-strong);background:var(--surface);border-radius:999px;padding:7px 13px;font:inherit;font-size:13px;color:var(--stone-700);cursor:pointer}
    .sg:hover{border-color:var(--forest-400);color:var(--forest-700);background:var(--forest-50)}
    .msg{display:flex;gap:10px;align-items:flex-start}
    .msg.me{justify-content:flex-end}
    .bub{max-width:680px;padding:10px 14px;border-radius:12px;font-size:13.5px;line-height:1.55}
    .me .bub{background:var(--forest-700);color:#fff;border-bottom-right-radius:4px;display:flex;flex-direction:column;gap:4px}
    .ctx{font-size:11.5px;color:rgba(255,255,255,.7)}
    .bot .bub{background:var(--surface-2);border:1px solid var(--border);border-bottom-left-radius:4px;color:var(--stone-800)}
    .bot .bub.na{background:var(--sand-100)}
    .bot .bub.err{background:var(--danger-soft);border-color:#f3c7c3;color:var(--red-600)}
    .av{display:grid;place-items:center;flex:none;width:28px;height:28px;border-radius:8px;background:var(--forest-100);color:var(--forest-700)}
    .cites{margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
    .ch{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3)}
    .cites ul{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}
    .cites li{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;font-size:12.5px}
    .ct{font-size:11.5px;padding:1px 6px;border-radius:4px;background:var(--dc-calculated-bg);color:var(--dc-calculated);font-weight:500}
    .cites code{font-size:11.5px;color:var(--stone-700);overflow-wrap:anywhere}
    .more{border:0;background:none;color:var(--primary);font:inherit;font-size:12.5px;cursor:pointer;padding:4px 0 0}
    .meth{margin-top:8px;font-size:11.5px;color:var(--text-3)}
    .typing{display:inline-flex;gap:4px} .typing i{width:6px;height:6px;border-radius:50%;background:var(--stone-400);animation:b 1s infinite ease-in-out}
    .typing i:nth-child(2){animation-delay:.15s} .typing i:nth-child(3){animation-delay:.3s}
    @keyframes b{0%,80%,100%{opacity:.3}40%{opacity:1}}
    .composer{display:flex;gap:10px;padding:14px 16px;border-top:1px solid var(--border);background:var(--surface-2);border-radius:0 0 var(--radius) var(--radius)}
    .side{display:flex;flex-direction:column;gap:12px}
    .runs{display:flex;flex-direction:column;gap:6px;max-height:420px;overflow:auto}
    .run{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer}
    .run input{accent-color:var(--primary)}
    .run.on{border-color:var(--forest-400);background:var(--forest-50)}
    .rm{flex:1;display:flex;flex-direction:column;min-width:0}
    .rr{display:flex;flex-direction:column;align-items:flex-end;gap:3px;font-size:13px} .rr small{color:var(--text-3)}
  `],
})
export class AssistantPage {
  private api = inject(ApiService);
  ctx = inject(ProjectContext);
  runs = new Remote<Run[]>();
  runId = signal<string>('');
  turns = signal<Turn[]>([]);
  showAll = signal<Record<number, boolean>>({});
  pending = computed(() => this.turns().some(t => !t.a && !t.error));
  question = '';
  suggestions = SUGGESTIONS;
  private thread = viewChild<ElementRef<HTMLDivElement>>('thread');

  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => {
        if (!pid) return;
        this.runs.load(this.api.get<Run[]>(`/projects/${pid}/calculations`).pipe(catchError(() => of([] as Run[]))));
      });
    });
    effect(() => {
      const r = this.runs.data();
      untracked(() => {
        if (r?.length && !r.find(x => x.id === this.runId())) this.runId.set((r.find(x => x.status === 'approved') ?? r[0]).id);
      });
    });
    effect(() => {
      this.turns();
      const el = this.thread()?.nativeElement;
      if (el) setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 30);
    });
  }

  citeLabel(c: Citation) { return (CITE_LABEL[c.type] ?? c.type) + (c.role ? ` · ${c.role}` : ''); }
  citeRef(c: Citation) { return c.key ?? c.ref ?? (c.id ? c.id.slice(0, 8) : '') + (c.snapshot_sha256 ? ` · sha256 ${c.snapshot_sha256.slice(0, 12)}…` : ''); }
  expand(i: number) { this.showAll.update(s => ({ ...s, [i]: true })); }

  ask(q: string) {
    q = q.trim();
    if (q.length < 3 || this.pending()) return;
    const run = this.runs.data()?.find(r => r.id === this.runId()) ?? null;
    const idx = this.turns().length;
    this.turns.update(t => [...t, { q, runLabel: run ? `About ${run.period_label}` : null, at: new Date() }]);
    this.question = '';
    this.api.post<Answer>('/assistant/ask', { question: q, run_id: run?.id ?? null }).subscribe({
      next: a => this.turns.update(t => t.map((x, i) => (i === idx ? { ...x, a } : x))),
      error: (e: ApiError) => this.turns.update(t => t.map((x, i) => (i === idx ? { ...x, error: e.message } : x))),
    });
  }
}
