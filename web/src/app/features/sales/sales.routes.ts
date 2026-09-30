import { Routes } from '@angular/router';
import { SaleDetailPage } from './sale-detail.page';
import { SalesPage } from './sales.page';

export default [
  { path: '', component: SalesPage, title: 'Sales · Varsapradaya Carbon' },
  { path: ':id', component: SaleDetailPage, title: 'Sale · Varsapradaya Carbon' },
] satisfies Routes;
