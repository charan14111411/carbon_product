import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { money } from '../credits/credit-ui';
import { ProfileForm } from '../benefits/profile-form';
import { ConsentState, FarmerData, Grievance, PAY_STATUS, PURPOSES } from './farmer-data';
import { FarmerTitle } from './farmer-shell';

const SHARED = `
  .panel{background:var(--surface);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow-sm);padding:18px}
  .panel + .panel{margin-top:14px}
  .ph{display:flex;align-items:center;gap:10px;margin-bottom:10px}
  .ph h2{font-size:18px;flex:1}
  .kn{color:var(--clay-600);font-size:14px;font-weight:500}
  .big{font-size:17px;line-height:1.55}
  .muted{color:var(--stone-600)}
  .btn-lg{height:48px;font-size:16px;border-radius:12px}
  .pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;font-size:14px;font-weight:600}
  .pill.ok{background:var(--ok-soft);color:var(--forest-700)} .pill.info{background:var(--info-soft);color:var(--sky-600)}
  .pill.warn{background:var(--warn-soft);color:var(--amber-600)} .pill.danger{background:var(--danger-soft);color:var(--red-600)}
  .pill.neutral{background:var(--stone-100);color:var(--stone-600)}
  .skel{height:18px;border-radius:8px;background:var(--sand-200);margin:10px 0}
  .err{padding:14px;border-radius:12px;background:var(--danger-soft);color:var(--red-600);font-size:15px}
`;

/* ------------------------------------------------------------------ home */
@Component({
  selector: 'vcf-home',
  imports: [RouterLink, ...KIT, FarmerTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vcf-title [en]="'Namaskara, ' + d.firstName()" kn="ನಮಸ್ಕಾರ" sub="Here is how your soil-carbon work is going." />

    <section class="hero">
      <span class="lbl">Total paid to you <span lang="kn">· ನಿಮಗೆ ಪಾವತಿಸಿದ ಒಟ್ಟು ಮೊತ್ತ</span></span>
      @if (st().loading && !st().data) { <div class="skel light"></div> }
      @else { <strong class="amt num">{{ m(st().data?.total_paid ?? '0') }}</strong> }
      @if (waiting() > 0) { <span class="sub">{{ m(waiting()) }} more is on its way</span> }
      @else { <span class="sub">From {{ st().data?.items?.length ?? 0 }} credit sale{{ st().data?.items?.length === 1 ? '' : 's' }} so far</span> }
      <a routerLink="/farmer/payments" class="heroLink">See how it was worked out <vc-icon name="arrow-right" [size]="16" /></a>
    </section>

    <section class="panel">
      <div class="ph"><h2>Next steps</h2><span class="kn" lang="kn">ಮುಂದಿನ ಹೆಜ್ಜೆಗಳು</span></div>
      @for (s of steps(); track s.title) {
        <a class="step" [routerLink]="s.link" [class]="'t-' + s.tone">
          <span class="si"><vc-icon [name]="s.icon" [size]="20" /></span>
          <span class="sb"><strong>{{ s.title }}</strong><span>{{ s.text }}</span></span>
          <vc-icon name="chevron-right" [size]="18" />
        </a>
      } @empty {
        <div class="allgood"><vc-icon name="check-circle" [size]="22" /><span class="big">You're all set. Nothing needs your attention right now.</span></div>
      }
    </section>

    <div class="quick">
      <a routerLink="/farmer/plan" class="q wide"><vc-icon name="clipboard-check" [size]="22" /><strong>My plan</strong><span lang="kn">ನನ್ನ ಯೋಜನೆ</span><em>The practices you agreed to, year by year</em></a>
      <a routerLink="/farmer/fields" class="q"><vc-icon name="sprout" [size]="22" /><strong>My fields</strong><span lang="kn">ನನ್ನ ಹೊಲಗಳು</span></a>
      <a routerLink="/farmer/payment-details" class="q"><vc-icon name="landmark" [size]="22" /><strong>Payment details</strong><span lang="kn">ಪಾವತಿ ವಿವರಗಳು</span></a>
      <a routerLink="/farmer/consents" class="q"><vc-icon name="shield-check" [size]="22" /><strong>My consents</strong><span lang="kn">ನನ್ನ ಒಪ್ಪಿಗೆಗಳು</span></a>
      <a routerLink="/farmer/help" class="q"><vc-icon name="message" [size]="22" /><strong>Help</strong><span lang="kn">ಸಹಾಯ</span></a>
    </div>
  `,
  styles: [SHARED + `
    .hero{display:flex;flex-direction:column;gap:4px;padding:22px 20px;border-radius:18px;color:#fff;margin-bottom:16px;
      background:radial-gradient(120% 140% at 100% 0%,#4f9168 0%,#275e3f 45%,#173826 100%);box-shadow:0 12px 30px rgba(23,56,38,.22)}
    .lbl{font-size:14px;color:rgba(255,255,255,.8)}
    .amt{font-size:40px;font-weight:600;letter-spacing:-.02em;line-height:1.15;margin-top:4px}
    .sub{font-size:15px;color:rgba(255,255,255,.82)}
    .heroLink{margin-top:12px;display:inline-flex;align-items:center;gap:6px;color:#fff;font-weight:600;font-size:15px}
    .skel.light{background:rgba(255,255,255,.2);height:40px;width:60%}
    .step{display:flex;align-items:center;gap:14px;padding:14px 4px;border-top:1px solid var(--stone-100);color:var(--stone-800);text-decoration:none!important}
    .step:first-of-type{border-top:0}
    .si{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:var(--forest-50);color:var(--forest-600);flex:none}
    .t-warn .si{background:var(--warn-soft);color:var(--amber-600)} .t-danger .si{background:var(--danger-soft);color:var(--red-600)}
    .sb{flex:1;display:flex;flex-direction:column;gap:2px} .sb strong{font-size:16px} .sb span{font-size:14.5px;color:var(--stone-600)}
    .allgood{display:flex;gap:12px;align-items:center;color:var(--forest-700)}
    .quick{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
    .q{display:flex;flex-direction:column;gap:4px;padding:16px;border-radius:16px;background:var(--surface);border:1px solid var(--border);color:var(--stone-800);text-decoration:none!important}
    .q vc-icon{color:var(--forest-600);margin-bottom:6px} .q strong{font-size:16px} .q span{font-size:13.5px;color:var(--clay-600)}
    .q.wide{grid-column:1 / -1} .q em{font-style:normal;font-size:14px;color:var(--stone-600)}
  `],
})
export class FarmerHome {
  d = inject(FarmerData);
  st = this.d.statement;
  m = (v: string | number) => money(v);
  waiting = computed(() => (this.st().data?.items ?? []).filter(i => i.payout_status !== 'paid').reduce((a, i) => a + Number(i.amount), 0));

  steps = computed(() => {
    const out: { title: string; text: string; icon: string; link: string; tone: string }[] = [];
    const p = this.d.profile();
    if (!p.loading && !p.data) out.push({ title: 'Add your payment details', text: 'We need your UPI ID or bank account to pay you.', icon: 'wallet', link: '/farmer/payment-details', tone: 'warn' });
    else if (p.data && !p.data.verified) out.push({ title: 'Payment details are being checked', text: 'We are confirming your account with the bank. No action needed.', icon: 'clock', link: '/farmer/payment-details', tone: 'info' });
    for (const i of this.st().data?.items ?? []) {
      if (i.payout_status === 'on_hold') out.push({ title: `Payment for ${i.sale_code} is on hold`, text: i.lines[i.lines.length - 1]?.replace(/^On hold: /, '') ?? '', icon: 'alert', link: '/farmer/payments', tone: 'warn' });
      if (i.payout_status === 'failed') out.push({ title: `Payment for ${i.sale_code} didn't go through`, text: 'It will be tried again. Check your payment details are correct.', icon: 'alert', link: '/farmer/payment-details', tone: 'danger' });
    }
    const missing = (this.d.consents().data?.current ?? []).filter(c => c.state !== 'granted' && (c.purpose === 'payments' || c.purpose === 'sampling'));
    for (const c of missing) out.push({ title: `Consent needed: ${PURPOSES[c.purpose]?.en ?? c.purpose}`, text: 'Without it, this part of the programme is paused for you.', icon: 'shield', link: '/farmer/consents', tone: 'warn' });
    const open = (this.d.grievances().data ?? []).filter(g => !['resolved', 'closed'].includes(g.status));
    if (open.length) out.push({ title: `${open.length} open complaint${open.length > 1 ? 's' : ''}`, text: `We will reply by ${new Date(open[0].due_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.`, icon: 'message', link: '/farmer/help', tone: 'info' });
    return out;
  });
}

/* ------------------------------------------------------------------ fields */
@Component({
  selector: 'vcf-fields',
  imports: [...KIT, NumPipe, FarmerTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vcf-title en="My fields" kn="ನನ್ನ ಹೊಲಗಳು" sub="The land you have enrolled in the soil-carbon programme." />
    @let ov = d.overview();
    @if (ov.loading && !ov.data) {
      <section class="panel"><div class="skel"></div><div class="skel" style="width:60%"></div></section>
    } @else if (ov.data; as o) {
      <div class="tot">
        <div><strong class="num">{{ o.total_area_ha | num: 2 }}</strong><span>hectares · ಹೆಕ್ಟೇರ್</span></div>
        <div><strong class="num">{{ fieldCount(o) }}</strong><span>fields · ಹೊಲಗಳು</span></div>
        <div><strong class="num">{{ o.practice_records }}</strong><span>practices recorded</span></div>
      </div>
      @for (f of o.farms; track f.id) {
        <section class="panel">
          <div class="ph"><h2>{{ f.name }}</h2><span class="muted">{{ f.village }}</span></div>
          @for (fl of f.fields; track fl.id) {
            <div class="fld">
              <span class="fi"><vc-icon name="sprout" [size]="20" /></span>
              <div class="fb"><strong>{{ fl.name || fl.code }}</strong><span>{{ fl.code }}@if (fl.crop_code) { · {{ fl.crop_code }} }</span></div>
              <div class="fa"><strong class="num">{{ fl.area_ha | num: 2 }} ha</strong>
                @if (enrolled(o, fl.code); as e) { <span class="pill ok">In {{ e.project_code }}</span> } @else { <span class="pill neutral">Not enrolled</span> }</div>
            </div>
          } @empty { <p class="muted">No fields mapped on this farm yet.</p> }
        </section>
      } @empty {
        <section class="panel"><p class="big">No farms are registered to you yet. Your field officer maps your fields with you on the first visit.</p></section>
      }
    } @else {
      <!-- The overview API is staff-only today; fall back to what the statement tells us. -->
      @if (fromStatement().length) {
        <div class="tot">
          <div><strong class="num">{{ area() | num: 2 }}</strong><span>hectares enrolled · ಹೆಕ್ಟೇರ್</span></div>
          <div><strong class="num">{{ fromStatement().length }}</strong><span>fields · ಹೊಲಗಳು</span></div>
          <div><strong class="num">{{ practices() }}</strong><span>practices counted</span></div>
        </div>
        <section class="panel">
          <div class="ph"><h2>Enrolled fields</h2></div>
          @for (c of fromStatement(); track c) {
            <div class="fld"><span class="fi"><vc-icon name="sprout" [size]="20" /></span>
              <div class="fb"><strong class="mono">{{ c }}</strong><span>Counted in your latest payment</span></div>
              <span class="pill ok">Enrolled</span></div>
          }
        </section>
        <p class="note">These are the fields counted in your latest payment. To see the mapped boundaries or correct a field, ask your field officer or raise it under Help.</p>
      } @else {
        <section class="panel"><p class="big">Your field details will appear here after your field officer has mapped and enrolled your land.</p></section>
      }
    }
  `,
  styles: [SHARED + `
    .tot{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
    .tot div{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 12px;display:flex;flex-direction:column}
    .tot strong{font-size:24px;font-weight:600;color:var(--forest-800)} .tot span{font-size:13px;color:var(--stone-600)}
    .fld{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--stone-100)}
    .fld:first-of-type{border-top:0}
    .fi{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--forest-50);color:var(--forest-600);flex:none}
    .fb{flex:1;display:flex;flex-direction:column;min-width:0} .fb strong{font-size:16px} .fb span{font-size:13.5px;color:var(--stone-600)}
    .fa{display:flex;flex-direction:column;align-items:flex-end;gap:4px} .fa strong{font-size:16px}
    .fa .pill{font-size:12px;padding:2px 10px}
    .note{margin-top:14px;font-size:14.5px;color:var(--stone-600)}
  `],
})
export class FarmerFields {
  d = inject(FarmerData);
  fieldCount(o: { farms: { fields: unknown[] }[] }) { return o.farms.reduce((a, f) => a + f.fields.length, 0); }
  enrolled(o: { enrolments: { field_code: string; status: string; project_code: string }[] }, code: string) {
    return o.enrolments.find(e => e.field_code === code && e.status === 'enrolled') ?? null;
  }
  private latest = computed(() => { const it = this.d.statement().data?.items ?? []; return it[it.length - 1] ?? null; });
  fromStatement = computed(() => this.latest()?.inputs.fields ?? []);
  area = computed(() => this.latest()?.inputs.area_ha ?? 0);
  practices = computed(() => this.latest()?.inputs.practices ?? 0);
}

/* ------------------------------------------------------------------ payments & statement */
@Component({
  selector: 'vcf-payments',
  imports: [RouterLink, ...KIT, FarmerTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vcf-title en="My payments" kn="ನನ್ನ ಪಾವತಿಗಳು" sub="Every payment, and exactly how your share was worked out." />
    @let st = d.statement();
    @if (st.loading && !st.data) { <section class="panel"><div class="skel"></div><div class="skel"></div></section> }
    @else if (st.error) { <div class="err">{{ st.error }}</div> }
    @else if (st.data; as s) {
      <div class="sum">
        <div><span>Paid to you</span><strong class="num">{{ m(s.total_paid) }}</strong></div>
        <div><span>Your total share</span><strong class="num">{{ m(s.total_entitled) }}</strong></div>
      </div>
      @for (i of s.items.slice().reverse(); track i.pool_id) {
        <article class="panel pay">
          <header>
            <div><span class="subtle">Credit sale {{ i.sale_code }}</span><strong class="num">{{ m(i.amount, i.currency) }}</strong></div>
            <span class="pill" [class]="meta(i.payout_status).tone">{{ meta(i.payout_status).label }}</span>
          </header>
          <ol class="lines">
            @for (l of i.lines; track $index) { <li>{{ pretty(l) }}</li> }
          </ol>
          <div class="chips">
            <span>Rule version {{ i.rule_version }}</span>
            @if (i.inputs.area_ha) { <span>{{ i.inputs.area_ha.toFixed(2) }} ha counted</span> }
            @if (i.inputs.share) { <span>Your share {{ (i.inputs.share * 100).toFixed(2) }}%</span> }
          </div>
        </article>
      } @empty {
        <section class="panel"><p class="big">No payments yet. When carbon credits from your fields are sold, your share will appear here with a full explanation.</p></section>
      }
    }
    <a routerLink="/farmer/payment-details" class="panel link">
      <vc-icon name="landmark" [size]="20" /><span class="big">Where we pay you</span><span class="kn" lang="kn">ಪಾವತಿ ವಿವರಗಳು</span><vc-icon name="chevron-right" [size]="18" />
    </a>
  `,
  styles: [SHARED + `
    .sum{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
    .sum div{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px;display:flex;flex-direction:column}
    .sum span{font-size:13.5px;color:var(--stone-600)} .sum strong{font-size:22px;font-weight:600;color:var(--forest-800)}
    .pay header{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px}
    .pay header div{display:flex;flex-direction:column} .pay header strong{font-size:26px;font-weight:600;letter-spacing:-.01em}
    .subtle{font-size:14px;color:var(--stone-500)}
    .lines{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:8px;font-size:15.5px;line-height:1.5;color:var(--stone-800)}
    .lines li::marker{color:var(--forest-500);font-weight:600}
    .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
    .chips span{font-size:13px;padding:3px 10px;border-radius:999px;background:var(--sand-100);color:var(--stone-700)}
    .link{display:flex;align-items:center;gap:12px;margin-top:14px;color:var(--stone-800);text-decoration:none!important}
    .link .big{flex:1;font-weight:600} .link > vc-icon:first-child{color:var(--forest-600)}
  `],
})
export class FarmerPayments {
  d = inject(FarmerData);
  m = (v: string | number, c = 'INR') => money(v, c);
  meta(s: string) { return PAY_STATUS[s] ?? PAY_STATUS['not_scheduled']; }
  /** Make the API's plain-language lines friendlier: "1303500.00 INR" -> "₹13,03,500", ISO dates -> "30 Sept 2026". */
  pretty(l: string) {
    return l
      .replace(/(\d+(?:\.\d{1,2})?) INR/g, (_, n) => money(Number(n)).replace(/\.00$/, ''))
      .replace(/(\d+\.\d{3,})( ha)/g, (_, n, u) => `${Number(n).toFixed(2)}${u}`)
      .replace(/(\d{4}-\d{2}-\d{2})/g, d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
  }
}

/* ------------------------------------------------------------------ payment details */
@Component({
  selector: 'vcf-payment-details',
  imports: [...KIT, DayPipe, FarmerTitle, ProfileForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vcf-title en="Payment details" kn="ಪಾವತಿ ವಿವರಗಳು" sub="Where your money is sent. We only ever show the last few digits." />
    @let p = d.profile();
    @if (editing()) {
      <section class="panel">
        <vcx-profile-form [farmerId]="d.farmerId()!" [current]="p.data" [large]="true" (saved)="saved($event)" (cancelled)="editing.set(false)" />
      </section>
    } @else if (p.loading && !p.data) {
      <section class="panel"><div class="skel"></div></section>
    } @else if (p.data; as pr) {
      <section class="panel card">
        <div class="acct">
          <span class="ic"><vc-icon [name]="pr.method === 'upi' ? 'zap' : 'landmark'" [size]="24" /></span>
          <div class="ab">
            <span class="subtle">{{ pr.method === 'upi' ? 'UPI' : 'Bank account' }}</span>
            <strong class="mono">{{ pr.method === 'upi' ? pr.upi_id : pr.account_masked }}</strong>
            @if (pr.ifsc) { <span class="subtle mono">IFSC {{ pr.ifsc }}</span> }
            <span>{{ pr.account_name }}</span>
          </div>
        </div>
        @if (pr.verified) {
          <div class="ver ok"><vc-icon name="check-circle" [size]="20" /><span>Verified on {{ pr.verified_on | day }}. Payments go here.</span></div>
        } @else {
          <div class="ver wait"><vc-icon name="clock" [size]="20" /><span>Being checked with the bank. Payments start once this is confirmed.</span></div>
        }
        <button class="btn btn-secondary btn-lg" (click)="editing.set(true)"><vc-icon name="pencil" [size]="18" />Change details</button>
      </section>
    } @else {
      <section class="panel">
        <p class="big">You haven't added payment details yet. Add your UPI ID or bank account so we can pay your share.</p>
        <button class="btn btn-primary btn-lg" style="margin-top:14px;width:100%" (click)="editing.set(true)"><vc-icon name="plus" [size]="18" />Add payment details</button>
      </section>
    }
    <p class="note"><vc-icon name="lock" [size]="15" />Nobody from the programme will ever ask for your UPI PIN or OTP.</p>
  `,
  styles: [SHARED + `
    .card{display:flex;flex-direction:column;gap:16px}
    .acct{display:flex;gap:14px;align-items:flex-start}
    .ic{display:grid;place-items:center;width:52px;height:52px;border-radius:14px;background:var(--forest-50);color:var(--forest-600);flex:none}
    .ab{display:flex;flex-direction:column;gap:2px;font-size:15.5px;min-width:0} .ab strong{font-size:20px;overflow-wrap:anywhere}
    .subtle{font-size:13.5px;color:var(--stone-500)}
    .ver{display:flex;gap:10px;align-items:center;padding:12px 14px;border-radius:12px;font-size:15px}
    .ver.ok{background:var(--ok-soft);color:var(--forest-700)} .ver.wait{background:var(--warn-soft);color:var(--amber-600)}
    .note{display:flex;gap:8px;align-items:center;margin-top:16px;font-size:14px;color:var(--stone-600)}
  `],
})
export class FarmerPaymentDetails {
  d = inject(FarmerData);
  private toast = inject(ToastService);
  editing = signal(false);
  saved(p: Parameters<FarmerData['setProfile']>[0]) {
    this.d.setProfile(p);
    this.editing.set(false);
    this.toast.success('Payment details saved', 'We will check them with your bank.');
  }
}

/* ------------------------------------------------------------------ consents */
@Component({
  selector: 'vcf-consents',
  imports: [...KIT, DayPipe, FarmerTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vcf-title en="My consents" kn="ನನ್ನ ಒಪ್ಪಿಗೆಗಳು" sub="You decide what the programme may do. You can change your mind at any time." />
    @let c = d.consents();
    @if (c.loading && !c.data) { <section class="panel"><div class="skel"></div><div class="skel"></div></section> }
    @else if (c.error) { <div class="err">{{ c.error }}</div> }
    @else if (c.data; as cs) {
      @for (x of cs.current; track x.purpose) {
        <article class="panel cons">
          <div class="ch">
            <div class="ct"><strong>{{ p(x).en }}</strong><span class="kn" lang="kn">{{ p(x).kn }}</span></div>
            <span class="pill" [class]="x.state === 'granted' ? 'ok' : x.state === 'withdrawn' ? 'neutral' : 'warn'">
              {{ x.state === 'granted' ? 'Given' : x.state === 'withdrawn' ? 'Withdrawn' : 'Not given' }}</span>
          </div>
          <p class="what">{{ p(x).what }}</p>
          <div class="cf">
            <span class="subtle">@if (x.effective_on) { Since {{ x.effective_on | day }} } @else { Not asked yet }</span>
            @if (x.state === 'granted') {
              <button class="btn btn-secondary" (click)="ask(x, false)">Withdraw</button>
            } @else {
              <button class="btn btn-primary" (click)="ask(x, true)">Give consent</button>
            }
          </div>
        </article>
      }
    }

    <vc-modal [open]="!!target()" (closed)="target.set(null)" [title]="target()?.grant ? 'Give consent?' : 'Withdraw consent?'"
      [subtitle]="target() ? p(target()!.c).en + ' · ' + p(target()!.c).kn : ''" width="460px">
      @if (target(); as t) {
        <div class="stack">
          @if (t.grant) {
            <p class="big">You agree that: {{ p(t.c).what }}</p>
          } @else {
            <p class="big">From today, the programme will stop this. {{ withdrawEffect(t.c.purpose) }}</p>
            <p class="muted">Anything already done before today stays on record. You can give consent again later.</p>
          }
          @if (err()) { <div class="err">{{ err() }}</div> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost btn-lg" (click)="target.set(null)">Go back</button>
        <button class="btn btn-lg" [class.btn-primary]="target()?.grant" [class.btn-danger]="!target()?.grant" [disabled]="busy()" (click)="confirm()">
          {{ target()?.grant ? 'Yes, I agree' : 'Yes, withdraw' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [SHARED + `
    .ch{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
    .ct{display:flex;flex-direction:column;gap:2px} .ct strong{font-size:17px}
    .what{margin:10px 0 12px;font-size:15px;line-height:1.5;color:var(--stone-700)}
    .cf{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .cf .btn{height:44px;padding:0 18px;font-size:15px;border-radius:10px}
    .subtle{font-size:14px;color:var(--stone-500)}
  `],
})
export class FarmerConsents {
  d = inject(FarmerData);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  target = signal<{ c: ConsentState; grant: boolean } | null>(null);
  busy = signal(false);
  err = signal<string | null>(null);

  p(c: ConsentState) { return PURPOSES[c.purpose] ?? { en: c.purpose, kn: '', what: '' }; }
  ask(c: ConsentState, grant: boolean) { this.err.set(null); this.target.set({ c, grant }); }
  withdrawEffect(purpose: string) {
    return ({
      sampling: 'Nobody will take soil samples from your fields.',
      payments: 'Payments to you will be put on hold until you give consent again.',
      share_with_buyers: 'Your fields will not be counted in summaries shared with buyers.',
      sensor_installation: 'No new sensors will be placed, and existing ones will be collected.',
    } as Record<string, string>)[purpose] ?? '';
  }
  confirm() {
    const t = this.target();
    const fid = this.d.farmerId();
    if (!t || !fid) return;
    this.busy.set(true);
    this.api.post(`/farmers/${fid}/consents`, { purpose: t.c.purpose, granted: t.grant, channel: 'app', notes: 'Changed by the farmer in the farmer portal.' }).subscribe({
      next: () => {
        this.busy.set(false);
        this.target.set(null);
        this.toast.success(t.grant ? 'Consent given' : 'Consent withdrawn', this.p(t.c).en);
        this.d.reloadConsents();
      },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e.message); },
    });
  }
}

/* ------------------------------------------------------------------ help & complaints */
@Component({
  selector: 'vcf-help',
  imports: [FormsModule, ...KIT, DayPipe, FarmerTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vcf-title en="Help & complaints" kn="ಸಹಾಯ ಮತ್ತು ದೂರುಗಳು" sub="Tell us about any problem. You will get a reference number and a date by which we reply." />

    @if (!formOpen()) {
      <button class="btn btn-primary btn-lg wide" (click)="formOpen.set(true)"><vc-icon name="plus" [size]="18" />Raise a new complaint</button>
    } @else {
      <section class="panel">
        <div class="ph"><h2>New complaint</h2><span class="kn" lang="kn">ಹೊಸ ದೂರು</span></div>
        <div class="stack">
          <div class="field"><label>What is it about?</label>
            <div class="cats">
              @for (c of cats; track c.k) { <button type="button" [class.on]="cat === c.k" (click)="cat = c.k">{{ c.en }}<small lang="kn">{{ c.kn }}</small></button> }
            </div></div>
          <div class="field"><label>Short title</label><input class="input lg" [(ngModel)]="subject" maxlength="200" placeholder="e.g. Payment not received" /></div>
          <div class="field"><label>Tell us what happened</label>
            <textarea class="input lg" [(ngModel)]="desc" rows="5" maxlength="5000" placeholder="You can write in Kannada or English."></textarea></div>
          <label class="checkbox"><input type="checkbox" [(ngModel)]="urgent" />This is urgent (reply within 3 days)</label>
          @if (err()) { <div class="err">{{ err() }}</div> }
          <div class="row">
            <button class="btn btn-ghost btn-lg" (click)="formOpen.set(false)">Cancel</button>
            <span class="spacer"></span>
            <button class="btn btn-primary btn-lg" [disabled]="busy() || subject.trim().length < 3 || desc.trim().length < 5" (click)="send()">Send</button>
          </div>
        </div>
      </section>
    }

    <h2 class="lh">My complaints <span class="kn" lang="kn">ನನ್ನ ದೂರುಗಳು</span></h2>
    @let g = d.grievances();
    @if (g.loading && !g.data) { <section class="panel"><div class="skel"></div></section> }
    @else if (g.error) { <div class="err">{{ g.error }}</div> }
    @else {
      @for (x of g.data ?? []; track x.id) {
        <article class="panel gr">
          <div class="gh"><span class="mono subtle">{{ x.code }}</span><span class="pill" [class]="tone(x)">{{ label(x) }}</span></div>
          <strong class="gs">{{ x.subject }}</strong>
          <p class="gd">{{ x.description }}</p>
          @if (x.resolution) { <div class="res"><strong>Our answer</strong><p>{{ x.resolution }}</p></div> }
          <span class="subtle">Sent {{ x.created_at | day }}@if (!['resolved', 'closed'].includes(x.status)) { · reply by {{ x.due_on | day }} }</span>
        </article>
      } @empty {
        <section class="panel"><p class="big muted">You haven't raised any complaints.</p></section>
      }
    }
  `,
  styles: [SHARED + `
    .wide{width:100%;margin-bottom:8px}
    .cats{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .cats button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px;border:1px solid var(--border-strong);border-radius:12px;background:var(--surface);font:inherit;font-size:15px;font-weight:500;cursor:pointer;text-align:left;color:var(--stone-800)}
    .cats button.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:inset 0 0 0 1px var(--forest-500)}
    .cats small{font-size:12.5px;color:var(--clay-600);font-weight:400}
    .input.lg{height:48px;font-size:16px} textarea.input.lg{height:auto}
    .field label{font-size:15px}
    .checkbox{font-size:15px}
    .spacer{flex:1}
    .lh{font-size:19px;margin:24px 0 12px} .lh .kn{margin-left:6px}
    .gr{display:flex;flex-direction:column;gap:6px}
    .gh{display:flex;justify-content:space-between;align-items:center}
    .gs{font-size:17px} .gd{font-size:15px;color:var(--stone-700);line-height:1.5}
    .res{padding:12px;border-radius:12px;background:var(--ok-soft);font-size:15px} .res p{margin-top:4px}
    .subtle{font-size:13.5px;color:var(--stone-500)}
  `],
})
export class FarmerHelp {
  d = inject(FarmerData);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  cats = [
    { k: 'payment', en: 'Payment', kn: 'ಪಾವತಿ' }, { k: 'sampling', en: 'Soil sampling', kn: 'ಮಣ್ಣಿನ ಮಾದರಿ' },
    { k: 'enrolment', en: 'Enrolment', kn: 'ನೋಂದಣಿ' }, { k: 'data', en: 'My information', kn: 'ನನ್ನ ಮಾಹಿತಿ' },
    { k: 'other', en: 'Something else', kn: 'ಇತರೆ' },
  ];
  formOpen = signal(false);
  cat = 'payment';
  subject = '';
  desc = '';
  urgent = false;
  busy = signal(false);
  err = signal<string | null>(null);

  label(g: Grievance) {
    return ({ open: 'Received', in_progress: 'Being looked at', resolved: 'Answered', appealed: 'Reopened', closed: 'Closed' } as Record<string, string>)[g.status] ?? g.status;
  }
  tone(g: Grievance) { return g.status === 'resolved' || g.status === 'closed' ? 'ok' : g.overdue ? 'warn' : 'info'; }

  send() {
    this.busy.set(true);
    this.err.set(null);
    this.api.post<Grievance>('/grievances', {
      farmer_id: this.d.farmerId(), category: this.cat, subject: this.subject.trim(), description: this.desc.trim(),
      channel: 'app', priority: this.urgent ? 'high' : 'normal',
    }).subscribe({
      next: g => {
        this.busy.set(false);
        this.formOpen.set(false);
        this.subject = ''; this.desc = ''; this.urgent = false;
        this.toast.success(`Complaint ${g.code} sent`, `We will reply by ${new Date(g.due_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}.`);
        this.d.reloadGrievances();
      },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e.message); },
    });
  }
}
