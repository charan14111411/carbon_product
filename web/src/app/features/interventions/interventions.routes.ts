import { Routes } from '@angular/router';
import { InterventionsPage } from './interventions.page';
import { PlanDetailPage } from './plan-detail.page';

const T = ' · Varsapradaya Carbon';

export default [
  { path: '', component: InterventionsPage, title: 'Intervention plans' + T },
  { path: ':id', component: PlanDetailPage, title: 'Intervention plan' + T },
] satisfies Routes;
