import { ApiError } from '../../core/api.service';

/** Per-field messages from a 422 (`details.fields[] = {field, message}`), keyed by the dotted field path. */
export function fieldErrors(e: ApiError): Record<string, string> {
  const out: Record<string, string> = {};
  const list = (e.details?.['fields'] as { field: string; message: string }[] | undefined) ?? [];
  for (const f of list) {
    const key = String(f.field ?? '');
    if (!out[key]) out[key] = String(f.message ?? '').replace(/^Value error, /, '');
  }
  return out;
}

/** `details.problems[]` as a plain list, when the API gives one. */
export function problemList(e: ApiError): string[] {
  const p = e.details?.['problems'];
  return Array.isArray(p) ? p.map(String) : [];
}

/** Download a blob under a file name (object URL, revoked straight after). */
export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
