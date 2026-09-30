import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiError } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Brand } from '../../layout/brand';
import { Icon } from '../../ui/icon';
import { Callout } from '../../ui/kit';

@Component({
  selector: 'vc-login',
  imports: [FormsModule, Brand, Icon, Callout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="art">
      <vc-brand [light]="true" />
      <div class="pitch">
        <h1>Soil carbon you can prove.</h1>
        <p>Measure, verify and pay for regenerative farming — every tonne traced from the payment back to the soil it came from.</p>
      </div>
      <div class="profile" aria-hidden="true">
        <div class="layer l1"><span>0–10 cm</span><em>1.82% SOC</em></div>
        <div class="layer l2"><span>10–20 cm</span><em>1.41% SOC</em></div>
        <div class="layer l3"><span>20–30 cm</span><em>1.07% SOC</em></div>
        <div class="sprout"></div>
      </div>
      <ul class="points">
        <li><vc-icon name="flask" [size]="15" />Lab-measured carbon, never estimates</li>
        <li><vc-icon name="fingerprint" [size]="15" />Tamper-evident evidence, end to end</li>
        <li><vc-icon name="hand-coins" [size]="15" />Transparent payouts for every farmer</li>
      </ul>
    </section>

    <section class="panel">
      <form class="box" (ngSubmit)="submit()">
        @switch (step()) {
          @case ('password') {
            <h2>Sign in</h2>
            <p class="muted">Use the account your programme administrator created for you.</p>
            @if (expired) { <vc-callout tone="warn" icon="clock">Your session ended. Please sign in again.</vc-callout> }
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" class="input" name="email" type="email" autocomplete="username" [(ngModel)]="email" required autofocus />
            </div>
            <div class="field">
              <label for="pw">Password</label>
              <div class="pw">
                <input id="pw" class="input" name="password" [type]="show() ? 'text' : 'password'" autocomplete="current-password" [(ngModel)]="password" required />
                <button type="button" class="btn btn-ghost btn-sm" (click)="show.set(!show())">{{ show() ? 'Hide' : 'Show' }}</button>
              </div>
            </div>
          }
          @case ('setup') {
            <h2>Set up two-step verification</h2>
            <p class="muted">Your role needs a second factor. Add this key to Google Authenticator, Microsoft Authenticator or a similar app, then enter the 6-digit code.</p>
            <div class="secret"><code>{{ secret() }}</code></div>
            <div class="field"><label for="code">6-digit code</label>
              <input id="code" class="input code" name="code" inputmode="numeric" maxlength="6" [(ngModel)]="code" autofocus /></div>
          }
          @case ('mfa') {
            <h2>Enter your code</h2>
            <p class="muted">Open your authenticator app and enter the 6-digit code for Varsapradaya Carbon.</p>
            <div class="field"><label for="code2">6-digit code</label>
              <input id="code2" class="input code" name="code" inputmode="numeric" maxlength="6" [(ngModel)]="code" autofocus /></div>
          }
        }
        @if (error()) { <div class="err"><vc-icon name="alert" [size]="15" />{{ error() }}</div> }
        <button class="btn btn-primary btn-lg" type="submit" [disabled]="busy()">
          @if (busy()) { Signing in… } @else { {{ step() === 'password' ? 'Sign in' : 'Verify' }} <vc-icon name="arrow-right" [size]="16" /> }
        </button>
        <p class="legal">Protected workspace. Activity is recorded in the audit log.</p>
      </form>
    </section>
  `,
  styles: [`
    :host{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);min-height:100vh;background:var(--surface)}
    .art{position:relative;display:flex;flex-direction:column;padding:40px 48px;color:#fff;overflow:hidden;
      background:radial-gradient(120% 90% at 0% 0%,#275e3f 0%,#10291c 55%,#0b1f15 100%)}
    .pitch{margin-top:auto;max-width:460px;position:relative;z-index:2}
    .pitch h1{color:#fff;font-size:38px;line-height:1.1;letter-spacing:-.02em}
    .pitch p{margin-top:14px;font-size:16px;color:rgba(255,255,255,.74);line-height:1.55}
    .profile{position:absolute;right:56px;top:13%;width:270px;border-radius:18px;overflow:hidden;transform:rotate(-4deg);
      box-shadow:0 30px 60px rgba(0,0,0,.35);opacity:.95}
    .layer{height:84px;display:flex;align-items:flex-end;justify-content:space-between;padding:10px 16px;font:500 12px var(--mono)}
    .layer span{color:rgba(255,255,255,.75)} .layer em{font-style:normal;color:#fff;background:rgba(0,0,0,.18);padding:3px 7px;border-radius:5px}
    .l1{background:linear-gradient(180deg,#5a3a22,#6b4428)} .l2{background:linear-gradient(180deg,#7b4f2c,#8a5a33)} .l3{background:linear-gradient(180deg,#9a6a3c,#a9794a)}
    .sprout{position:absolute;top:-2px;left:40px;width:120px;height:10px;background:linear-gradient(90deg,#86b797,#4f9168);border-radius:0 0 6px 6px}
    .points{list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:10px;position:relative;z-index:2}
    .points li{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.82);font-size:14px}
    .points vc-icon{color:var(--forest-300)}
    .panel{display:grid;place-items:center;padding:40px 24px;background:var(--sand-50)}
    .box{width:100%;max-width:380px;display:flex;flex-direction:column;gap:16px}
    .box h2{font-size:24px}
    .pw{display:flex;gap:6px}
    .secret{padding:12px;border-radius:8px;background:var(--sand-100);border:1px dashed var(--border-strong);text-align:center}
    .secret code{font-size:15px;letter-spacing:.12em;word-break:break-all}
    .code{font:500 20px var(--mono);letter-spacing:.4em;text-align:center;height:48px}
    .err{display:flex;gap:8px;align-items:center;padding:10px 12px;border-radius:8px;background:var(--danger-soft);color:var(--red-600);font-size:13px}
    .legal{font-size:12px;color:var(--text-3);text-align:center}
    @media (max-width: 880px){ :host{grid-template-columns:1fr} .art{display:none} }
  `],
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  code = '';
  expired = this.route.snapshot.queryParamMap.has('expired');
  step = signal<'password' | 'setup' | 'mfa'>('password');
  secret = signal('');
  challenge = '';
  busy = signal(false);
  error = signal('');
  show = signal(false);

  submit() {
    this.error.set('');
    this.busy.set(true);
    const done = () => this.busy.set(false);
    if (this.step() === 'password') {
      this.auth.login(this.email.trim(), this.password).subscribe({
        next: r => {
          done();
          if (r.status === 'ok') return this.go();
          this.challenge = r.challenge ?? '';
          if (r.status === 'mfa_required') this.step.set('mfa');
          else this.auth.mfaSetup(this.challenge).subscribe(s => { this.secret.set(s.secret); this.step.set('setup'); });
        },
        error: (e: ApiError) => { done(); this.error.set(e.message); },
      });
    } else {
      this.auth.mfaVerify(this.challenge, this.code).subscribe({
        next: () => { done(); this.go(); },
        error: (e: ApiError) => { done(); this.error.set(e.message); },
      });
    }
  }

  private go() {
    const next = this.route.snapshot.queryParamMap.get('next');
    this.router.navigateByUrl(next && next.startsWith('/') ? next : this.auth.home());
  }
}
