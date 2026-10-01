import { Routes } from '@angular/router';
import { staffGuard } from '../../core/auth.service';
import { Qa1Page } from './qa1.page';

export default [
  { path: '', component: Qa1Page, canActivate: [staffGuard], title: 'Process model (QA1) · Varsapradaya Carbon' },
] satisfies Routes;
