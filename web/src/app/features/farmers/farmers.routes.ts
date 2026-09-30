import { Routes } from '@angular/router';
import { FarmerDetailPage } from './farmer-detail.page';
import { FarmersPage } from './farmers.page';

export default [
  { path: '', component: FarmersPage, title: 'Farmers · Varsapradaya Carbon' },
  { path: ':id', component: FarmerDetailPage, title: 'Farmer · Varsapradaya Carbon' },
] satisfies Routes;
