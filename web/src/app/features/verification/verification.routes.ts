import { Routes } from '@angular/router';
import { PackageDetailPage } from './package-detail.page';
import { VerificationPage } from './verification.page';

export default [
  { path: '', component: VerificationPage, title: 'Verification · Varsapradaya Carbon' },
  { path: ':id', component: PackageDetailPage, title: 'Verification package · Varsapradaya Carbon' },
] satisfies Routes;
