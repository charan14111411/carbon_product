import { Routes } from '@angular/router';
import { BatchDetailPage } from './batch-detail.page';
import { CreditsPage } from './credits.page';

export default [
  { path: '', component: CreditsPage, title: 'Credits · Varsapradaya Carbon' },
  { path: ':id', component: BatchDetailPage, title: 'Credit batch · Varsapradaya Carbon' },
] satisfies Routes;
