import { Routes } from '@angular/router';
import { HouseholdDetailPage } from './household-detail.page';
import { HouseholdsPage } from './households.page';

const T = ' · Varsapradaya Carbon';

export default [
  { path: '', component: HouseholdsPage, title: 'Households' + T },
  { path: ':id', component: HouseholdDetailPage, title: 'Household' + T },
] satisfies Routes;
