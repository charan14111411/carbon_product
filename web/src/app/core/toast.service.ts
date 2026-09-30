import { Injectable, signal } from '@angular/core';
import { ApiError } from './api.service';

export interface Toast {
  id: number;
  kind: 'success' | 'error' | 'info';
  title: string;
  body?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private seq = 0;

  success(title: string, body?: string) { this.push('success', title, body); }
  info(title: string, body?: string) { this.push('info', title, body); }
  error(title: string, body?: string) { this.push('error', title, body, 7000); }

  /** Show an API error in plain language. */
  apiError(err: ApiError | unknown, fallback = "That didn't work") {
    const e = err as ApiError;
    this.error(fallback, e?.message ?? String(err));
  }

  dismiss(id: number) {
    this.toasts.update(ts => ts.filter(t => t.id !== id));
  }

  private push(kind: Toast['kind'], title: string, body?: string, ms = 4200) {
    const id = ++this.seq;
    this.toasts.update(ts => [...ts.slice(-3), { id, kind, title, body }]);
    setTimeout(() => this.dismiss(id), ms);
  }
}
