import { Routes } from '@angular/router';
import { CalculationsPage } from './calculations.page';
import { RunDetailPage } from './run-detail.page';

export default [
  { path: '', component: CalculationsPage, title: 'Calculations · Varsapradaya Carbon' },
  { path: ':id', component: RunDetailPage, title: 'Calculation run · Varsapradaya Carbon' },
] satisfies Routes;
