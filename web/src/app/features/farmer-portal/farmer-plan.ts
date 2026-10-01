import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { Household, relationKn, relationLabel } from '../households/household-types';
import { COMPLIANCE, Plan, PlanCompliance, PracticeCatalogue, YearStatus, period } from '../interventions/plan-types';
import { FarmerData } from './farmer-data';
import { FarmerTitle } from './farmer-shell';

const STATUS: Record<string, { en: string; kn: string; tone: string }> = {
  draft: { en: 'Waiting for your agreement', kn: 'ನಿಮ್ಮ ಒಪ್ಪಿಗೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ', tone: 'warn' },
  agreed: { en: 'Agreed — starting soon', kn: 'ಒಪ್ಪಿದ್ದೀರಿ', tone: 'info' },
  active: { en: 'In progress', kn: 'ನಡೆಯುತ್ತಿದೆ', tone: 'ok' },
  completed: { en: 'Completed', kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ', tone: 'ok' },
  withdrawn: { en: 'Stopped', kn: 'ನಿಲ್ಲಿಸಲಾಗಿದೆ', tone: 'neutral' },
};

@Component({
  selector: 'vcf-plan',
  imports: [...KIT, FormsModule, FarmerTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vcf-title en="My plan" kn="ನನ್ನ ಯೋಜನೆ" sub="The farming practices you agreed to on each field, and how each year is going." />

    @if (loading()) { <section class="panel"><div class="skel"></div><div class="skel" style="width:70%"></div></section> }
    @else if (error()) { <div class="err">{{ error() }}</div> }
    @else {
      @for (x of items(); track x.plan.id) {
        @let p = x.plan;
        <article class="panel plan">
          <header>
            <div><span class="subtle">Field {{ p.field_code }} · {{ p.code }}@if (p.version > 1) { · version {{ p.version }} }</span>
              <span class="pill" [class]="st(p.status).tone">{{ st(p.status).en }}</span>
              <span class="kn small" lang="kn">{{ st(p.status).kn }}</span></div>
          </header>
          @if (p.status === 'draft' && p.change_reason) { <p class="why">What changed: {{ p.change_reason }}</p> }

          @for (c of commitmentRows(x); track $index) {
            <div class="cm">
              <div class="ch"><span class="ci"><vc-icon name="sprout" [size]="18" /></span>
                <div class="cb"><strong>{{ cat.name(c.code) }}</strong><span>{{ c.when }} · {{ c.freq }}</span></div>
                @if (c.status) { <span class="pill sm" [class]="tone(c.status)">{{ meta(c.status).label }}</span> }</div>
              @if (c.years.length) {
                <div class="years">
                  @for (y of c.years; track y.year) {
                    <div class="yr" [style.border-color]="meta(y.status).color" [style.background]="meta(y.status).soft">
                      <span class="yy num">{{ y.year }}</span>
                      <span class="yv"><vc-icon [name]="meta(y.status).icon" [size]="13" [stroke]="2.4" />{{ y.recorded_times }} of {{ y.expected_times }}</span>
                      <span class="yl" lang="kn">{{ meta(y.status).kn }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }

          @if (p.status === 'draft') {
            <div class="agree">
              @if (agreeing() === p.id) {
                <p class="big">We have sent a 6-digit code to your phone. Enter it to agree to this plan.</p>
                <p class="kn" lang="kn">ನಿಮ್ಮ ಫೋನ್‌ಗೆ ಕಳುಹಿಸಿದ 6 ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ.</p>
                <input class="input otp num" inputmode="numeric" maxlength="6" [(ngModel)]="otp" placeholder="••••••" autocomplete="one-time-code" aria-label="Code from SMS" />
                <p class="small subtle">Demo: the code is 123456.</p>
                @if (agreeError()) { <div class="err">{{ agreeError() }}</div> }
                <div class="row"><button class="btn btn-ghost btn-lg" (click)="agreeing.set(null)">Not now</button><span class="spacer"></span>
                  <button class="btn btn-primary btn-lg" [disabled]="busy() || otp.trim().length !== 6" (click)="agree(p)">I agree</button></div>
              } @else {
                <p class="big">Please read each practice above. If you agree, confirm with the code we send to your phone. You can also agree in person with your field officer.</p>
                <button class="btn btn-primary btn-lg wide" (click)="agreeing.set(p.id); otp = ''; agreeError.set(null)"><vc-icon name="pen-line" [size]="18" />Agree to this plan <span lang="kn" class="knb">· ಒಪ್ಪುತ್ತೇನೆ</span></button>
              }
            </div>
          }
        </article>
      } @empty {
        <section class="panel"><p class="big">You don't have a plan yet. Your field officer will go through the practices with you once your field is enrolled.</p>
          <p class="kn" lang="kn">ನಿಮ್ಮ ಹೊಲ ನೋಂದಣಿಯಾದ ನಂತರ ಯೋಜನೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.</p></section>
      }

      <div class="legend">
        @for (s of legend; track s) { <span><i [style.background]="meta(s).color"></i>{{ meta(s).label }} · <span lang="kn">{{ meta(s).kn }}</span></span> }
      </div>

      @if (household(); as h) {
        <section class="panel">
          <div class="ph"><h2>My household</h2><span class="kn" lang="kn">ನನ್ನ ಕುಟುಂಬ</span></div>
          <p class="muted">{{ h.village }}@if (h.district) { , {{ h.district }} }</p>
          @for (m of h.members; track m.id) {
            <div class="mem"><span class="av">{{ ini(m.name) }}</span><div class="mb"><strong>{{ m.name }}</strong><span>{{ rel(m.relation) }} · <span lang="kn">{{ relKn(m.relation) }}</span></span></div></div>
          }
        </section>
      }
    }
  `,
  styles: [`
    .panel{background:var(--surface);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow-sm);padding:18px}
    .panel + .panel{margin-top:14px}
    .ph{display:flex;align-items:center;gap:10px;margin-bottom:6px} .ph h2{font-size:18px;flex:1}
    .kn{color:var(--clay-600);font-size:14px;font-weight:500}
    .big{font-size:16.5px;line-height:1.55} .muted{color:var(--stone-600)} .subtle{font-size:14px;color:var(--stone-500)}
    .skel{height:18px;border-radius:8px;background:var(--sand-200);margin:10px 0}
    .err{padding:14px;border-radius:12px;background:var(--danger-soft);color:var(--red-600);font-size:15px}
    .pill{display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;font-size:14px;font-weight:600;margin:6px 8px 0 0}
    .pill.sm{font-size:12.5px;padding:2px 10px;margin:0}
    .pill.ok{background:var(--ok-soft);color:var(--forest-700)} .pill.info{background:var(--info-soft);color:var(--sky-600)}
    .pill.warn{background:var(--warn-soft);color:var(--amber-600)} .pill.danger{background:var(--danger-soft);color:var(--red-600)} .pill.neutral{background:var(--stone-100);color:var(--stone-600)}
    .plan header > div{display:flex;flex-direction:column;align-items:flex-start}
    .why{margin-top:10px;font-size:15px;color:var(--stone-700)}
    .cm{padding:14px 0;border-top:1px solid var(--stone-100)} .cm:first-of-type{margin-top:12px}
    .ch{display:flex;gap:12px;align-items:center}
    .ci{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--forest-50);color:var(--forest-600);flex:none}
    .cb{flex:1;display:flex;flex-direction:column;min-width:0} .cb strong{font-size:16.5px} .cb span{font-size:14px;color:var(--stone-600)}
    .years{display:flex;flex-wrap:wrap;gap:8px;padding:12px 0 2px 52px}
    .yr{flex:none;display:flex;flex-direction:column;min-width:86px;padding:8px 10px;border-radius:10px;border:1px solid;border-left-width:4px}
    .yy{font-size:13px;color:var(--stone-600);font-weight:600} .yv{display:flex;align-items:center;gap:4px;font-size:15px;font-weight:600;color:var(--stone-800)}
    .yl{font-size:12px;color:var(--stone-600)}
    .agree{margin-top:14px;padding:16px;border-radius:14px;background:var(--clay-50);border:1px solid var(--clay-100);display:flex;flex-direction:column;gap:10px}
    .btn-lg{height:48px;font-size:16px;border-radius:12px} .wide{width:100%} .knb{font-weight:500;opacity:.85}
    .otp{height:56px;font-size:28px;letter-spacing:.4em;text-align:center;max-width:260px}
    .row{display:flex;align-items:center} .spacer{flex:1}
    .legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin:14px 0;font-size:13.5px;color:var(--stone-600)}
    .legend > span{display:inline-flex;align-items:center;gap:6px} .legend i{width:12px;height:12px;border-radius:3px}
    .mem{display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--stone-100)}
    .av{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:var(--forest-100);color:var(--forest-700);font-weight:600;font-size:13px;flex:none}
    .mb{display:flex;flex-direction:column} .mb strong{font-size:16px} .mb span{font-size:14px;color:var(--stone-600)}
    @media (max-width:480px){.years{padding-left:0}.yr{flex:1 1 calc(33% - 8px);min-width:0}}
  `],
})
export class FarmerPlan {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private d = inject(FarmerData);
  cat = inject(PracticeCatalogue);
  legend: YearStatus[] = ['met', 'partially', 'not_met', 'upcoming'];
  rel = relationLabel;
  relKn = relationKn;

  plans = signal<Plan[]>([]);
  comps = signal<Record<string, PlanCompliance | null>>({});
  household = signal<Household | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  agreeing = signal<string | null>(null);
  agreeError = signal<string | null>(null);
  busy = signal(false);
  otp = '';

  /** The version that matters to the farmer: a pending draft revision, else the plan in force. */
  items = computed(() => {
    const by = new Map<string, Plan[]>();
    for (const p of this.plans()) by.set(p.plan_id, [...(by.get(p.plan_id) ?? []), p]);
    const out: { plan: Plan }[] = [];
    for (const vs of by.values()) {
      const cur = vs.filter(v => v.status !== 'superseded').sort((a, b) => b.version - a.version);
      const inForce = cur.find(v => ['active', 'agreed', 'completed'].includes(v.status));
      const draft = cur.find(v => v.status === 'draft');
      if (draft) out.push({ plan: draft });
      if (inForce) out.push({ plan: inForce });
      if (!draft && !inForce && cur[0]) out.push({ plan: cur[0] });
    }
    return out;
  });

  constructor() {
    this.cat.load();
    this.load();
  }

  load() {
    const fid = this.d.farmerId();
    if (!fid) return;
    this.api.get<Plan[]>(`/farmers/${fid}/intervention-plans`).subscribe({
      next: ps => {
        this.plans.set(ps);
        const live = ps.filter(p => ['agreed', 'active', 'completed', 'withdrawn'].includes(p.status));
        if (!live.length) { this.loading.set(false); return; }
        forkJoin(live.map(p => this.api.get<PlanCompliance>(`/intervention-plans/${p.id}/compliance`).pipe(catchError(() => of(null))))).subscribe(cs => {
          this.comps.set(Object.fromEntries(live.map((p, i) => [p.id, cs[i]])));
          this.loading.set(false);
        });
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    // Household details are staff data; show them only if the API shares them with the farmer.
    this.api.get<Household>(`/farmers/${fid}/household`).pipe(catchError(() => of(null))).subscribe(h => this.household.set(h));
  }

  st(s: string) { return STATUS[s] ?? { en: s, kn: '', tone: 'neutral' }; }
  meta(s: YearStatus) { return { ...COMPLIANCE[s], label: ({ met: 'Done', partially: 'Partly done', not_met: 'Not done', upcoming: 'Coming up' } as Record<string, string>)[s] }; }
  tone(s: YearStatus) { return s === 'met' ? 'ok' : s === 'partially' ? 'warn' : s === 'not_met' ? 'danger' : 'neutral'; }
  ini(n: string) { return (n || '?').split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
  commitmentRows(x: { plan: Plan }) {
    const comp = this.comps()[x.plan.id];
    const byId = new Map((comp?.commitments ?? []).map(c => [c.commitment.id, c]));
    return (x.plan.commitments ?? []).map(c => {
      const cc = byId.get(c.id);
      const t = c.times_per_year === 1 ? 'once a year' : `${c.times_per_year} times a year`;
      return { code: c.practice_code, when: period(c), freq: c.expected_quantity ? `${t}, ${c.expected_quantity} ${c.unit ?? ''}`.trim() : t, status: cc?.status ?? null, years: (cc?.years ?? []).slice(-6) };
    });
  }

  agree(p: Plan) {
    this.busy.set(true);
    this.agreeError.set(null);
    this.api.post<Plan>(`/intervention-plans/${p.id}/agree`, { method: 'otp', otp_code: this.otp.trim() }).subscribe({
      next: () => { this.busy.set(false); this.agreeing.set(null); this.toast.success('Thank you — you agreed to the plan', 'ಧನ್ಯವಾದಗಳು. Your field officer will confirm it.'); this.load(); },
      error: (e: ApiError) => { this.busy.set(false); this.agreeError.set(e.message); },
    });
  }
}
