import { BundlePoint, QueuedSample } from '../../core/offline';

export type LocalStatus = 'planned' | 'saved' | 'uploading' | 'synced' | 'rejected' | 'collected' | 'skipped';

export const LOCAL_LABEL: Record<LocalStatus, string> = {
  planned: 'To do', saved: 'Saved on phone', uploading: 'Uploading', synced: 'Uploaded', rejected: 'Rejected',
  collected: 'Collected', skipped: 'Skipped',
};
export const LOCAL_TONE: Record<LocalStatus, string> = {
  planned: 'info', saved: 'warn', uploading: 'warn', synced: 'ok', rejected: 'bad', collected: 'ok', skipped: 'muted',
};
export const LOCAL_COLOR: Record<LocalStatus, string> = {
  planned: '#1f5f99', saved: '#e0a225', uploading: '#e0a225', synced: '#2f7249', rejected: '#b3261e', collected: '#2f7249', skipped: '#9aa29c',
};

/** Combine the server's point status with what this phone has recorded. */
export function localStatus(p: BundlePoint, samples: QueuedSample[]): LocalStatus {
  const s = samples.filter(x => x.pointId === p.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  if (s) {
    if (s.state === 'queued') return 'saved';
    if (s.state === 'syncing') return 'uploading';
    if (s.state === 'synced') return 'synced';
    if (s.state === 'rejected') return p.status === 'planned' ? 'rejected' : (p.status as LocalStatus);
  }
  return p.status === 'collected' ? 'collected' : p.status === 'skipped' ? 'skipped' : 'planned';
}
