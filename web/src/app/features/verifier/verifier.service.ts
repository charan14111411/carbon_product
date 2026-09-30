import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { asApiError } from '../../core/api.service';

const KEY = 'vc.verifier.token';

/**
 * Verifier portal HTTP: every call carries the review token in `X-Verifier-Token`.
 * The token arrives in the URL fragment (#token=…), is removed from the address bar
 * at once and kept only for this browser tab (sessionStorage).
 */
@Injectable({ providedIn: 'root' })
export class VerifierApi {
  private http = inject(HttpClient);
  private base = '/api/verifier';

  /** Read the token from the fragment (then scrub it) or from this tab's storage. */
  captureToken(): string | null {
    const m = /(?:^|[#&])token=([^&]+)/.exec(location.hash);
    if (m) {
      const t = decodeURIComponent(m[1]);
      try { sessionStorage.setItem(KEY, t); } catch { /* private mode */ }
      history.replaceState(history.state, '', location.pathname + location.search);
      return t;
    }
    try { return sessionStorage.getItem(KEY); } catch { return null; }
  }

  forget(): void {
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  }

  private headers(): HttpHeaders {
    let t: string | null = null;
    try { t = sessionStorage.getItem(KEY); } catch { /* ignore */ }
    return new HttpHeaders(t ? { 'X-Verifier-Token': t } : {});
  }

  private fail = (err: unknown) => throwError(() => asApiError(err));

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.base + path, { headers: this.headers() }).pipe(catchError(this.fail));
  }
  post<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(this.base + path, body, { headers: this.headers() }).pipe(catchError(this.fail));
  }
  blob(path: string): Observable<Blob> {
    return this.http.get(this.base + path, { headers: this.headers(), responseType: 'blob' }).pipe(catchError(this.fail));
  }
}
