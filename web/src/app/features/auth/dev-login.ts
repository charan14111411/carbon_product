import { ChangeDetectionStrategy, Component, OnInit, inject, isDevMode, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

/** Development only: /dev-login?email=...&next=/app/... signs in with the demo password. */
@Component({
  selector: 'vc-dev-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p style="padding:24px;font-family:var(--mono)">{{ msg() }}</p>`,
})
export class DevLogin implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  msg = signal('Signing in…');

  ngOnInit(): void {
    if (!isDevMode()) {
      this.router.navigate(['/login']);
      return;
    }
    const q = this.route.snapshot.queryParamMap;
    const email = q.get('email') ?? 'admin@example.com';
    const next = q.get('next') ?? '';
    this.auth.login(email, q.get('password') ?? 'Demo-Pass-2026!').subscribe({
      next: r => (r.status === 'ok' ? this.router.navigateByUrl(next || this.auth.home()) : this.msg.set('MFA required')),
      error: e => this.msg.set(e.message),
    });
  }
}
