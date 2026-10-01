import { Routes } from '@angular/router';
import { staffGuard } from '../../core/auth.service';
import { LeakagePage } from './leakage.page';

export default [
  { path: '', component: LeakagePage, canActivate: [staffGuard], title: 'Leakage records · Varsapradaya Carbon' },
] satisfies Routes;
