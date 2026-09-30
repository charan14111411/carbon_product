import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

/** The one error shape every API response uses. */
export interface ApiError {
  status: number;
  code: string;
  message: string;
  details: Record<string, unknown>;
}

export interface Page<T> {
  items: T[];
  total: number;
}

type Params = Record<string, string | number | boolean | null | undefined>;

function toParams(params?: Params): HttpParams {
  let p = new HttpParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== null && v !== undefined && v !== '') p = p.set(k, String(v));
  }
  return p;
}

export function asApiError(err: unknown): ApiError {
  if (err instanceof HttpErrorResponse) {
    const body = err.error ?? {};
    if (err.status === 0) {
      return { status: 0, code: 'OFFLINE', message: "Can't reach the server. Check your connection.", details: {} };
    }
    return {
      status: err.status,
      code: body.code ?? 'ERROR',
      message: body.message ?? err.message ?? 'Something went wrong.',
      details: body.details ?? {},
    };
  }
  return { status: -1, code: 'ERROR', message: String((err as Error)?.message ?? err), details: {} };
}

/** Thin, typed wrapper over HttpClient. All requests go to /api (proxied in development). */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  readonly base = '/api';

  get<T>(path: string, params?: Params): Observable<T> {
    return this.http.get<T>(this.base + path, { params: toParams(params) }).pipe(catchError(this.fail));
  }
  post<T>(path: string, body: unknown = {}, headers?: Record<string, string>): Observable<T> {
    return this.http.post<T>(this.base + path, body, { headers }).pipe(catchError(this.fail));
  }
  put<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.put<T>(this.base + path, body).pipe(catchError(this.fail));
  }
  patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(this.base + path, body).pipe(catchError(this.fail));
  }
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.base + path).pipe(catchError(this.fail));
  }
  upload<T>(path: string, form: FormData): Observable<T> {
    return this.http.post<T>(this.base + path, form).pipe(catchError(this.fail));
  }
  blob(path: string): Observable<Blob> {
    return this.http.get(this.base + path, { responseType: 'blob' }).pipe(catchError(this.fail));
  }
  url(path: string): string {
    return this.base + path;
  }

  private fail = (err: unknown) => throwError(() => asApiError(err));
}
