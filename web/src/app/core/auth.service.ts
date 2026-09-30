import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, catchError, firstValueFrom, map, of, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  role_label: string;
  language: string;
  permissions: string[];
  scope: Record<string, string>;
  mfa_enabled: boolean;
  organization: { id: string; name: string; slug: string };
}

export interface LoginResult {
  status: 'ok' | 'mfa_required' | 'mfa_setup_required';
  access_token?: string;
  challenge?: string;
  user?: Profile;
}

const TOKEN_KEY = 'vc.token';
const PROFILE_KEY = 'vc.profile';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  readonly profile = signal<Profile | null>(this.read());
  readonly signedIn = computed(() => !!this.profile());
  readonly permissions = computed(() => new Set(this.profile()?.permissions ?? []));
  readonly initials = computed(() =>
    (this.profile()?.full_name ?? '?').split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(),
  );

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  can(...perms: string[]): boolean {
    const have = this.permissions();
    return perms.length === 0 || perms.some(p => have.has(p));
  }

  login(email: string, password: string): Observable<LoginResult> {
    return this.api.post<LoginResult>('/auth/login', { email, password }).pipe(tap(r => this.adopt(r)));
  }

  mfaSetup(challenge: string) {
    return this.api.post<{ secret: string; otpauth_uri: string }>('/auth/mfa/setup', { challenge });
  }

  mfaVerify(challenge: string, code: string): Observable<LoginResult> {
    return this.api.post<LoginResult>('/auth/mfa/verify', { challenge, code }).pipe(tap(r => this.adopt(r)));
  }

  refresh(): Observable<Profile | null> {
    if (!this.token) return of(null);
    return this.api.get<Profile>('/auth/me').pipe(
      tap(p => this.store(p)),
      catchError(err => {
        if (err.status === 401) this.clear();
        return throwError(() => err);
      }),
    );
  }

  logout(): void {
    this.clear();
    this.router.navigate(['/login']);
  }

  /** Landing page for a role. */
  home(): string {
    const p = this.profile();
    if (!p) return '/login';
    if (p.role === 'farmer') return '/farmer';
    if (p.role === 'buyer') return '/buyer';
    if (p.role === 'field_collector') return '/field';
    if (p.role === 'lab_technician') return '/app/lab';
    return '/app/overview';
  }

  private adopt(r: LoginResult) {
    if (r.status === 'ok' && r.access_token && r.user) {
      localStorage.setItem(TOKEN_KEY, r.access_token);
      this.store(r.user);
    }
  }

  private store(p: Profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    this.profile.set(p);
  }

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    this.profile.set(null);
  }

  private read(): Profile | null {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw && localStorage.getItem(TOKEN_KEY) ? (JSON.parse(raw) as Profile) : null;
    } catch {
      return null;
    }
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const isApi = req.url.startsWith('/api') && !req.url.startsWith('/api/verifier/');
  return next(isApi && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req).pipe(
    catchError(err => {
      if (err?.status === 401 && isApi && !req.url.endsWith('/auth/login')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PROFILE_KEY);
        if (!location.pathname.startsWith('/login')) location.assign('/login?expired=1');
      }
      return throwError(() => err);
    }),
  );
};

export const signedInGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.signedIn() ? true : router.createUrlTree(['/login'], { queryParams: { next: state.url } });
};

/** Route guard: `canActivate: [permissionGuard('land.manage', 'data.read')]` (any of). */
export function permissionGuard(...perms: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.signedIn()) return router.createUrlTree(['/login']);
    return auth.can(...perms) ? true : router.createUrlTree([auth.home()]);
  };
}

export async function bootstrapSession(auth: AuthService): Promise<void> {
  try {
    await firstValueFrom(auth.refresh().pipe(map(() => undefined), catchError(() => of(undefined))));
  } catch {
    /* offline: keep the cached profile */
  }
}
