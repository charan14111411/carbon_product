import { Routes } from '@angular/router';
import { PackDetailPage } from './pack-detail.page';
import { PacksPage } from './packs.page';

export default [
  { path: '', component: PacksPage, title: 'Methodology rules · Varsapradaya Carbon' },
  { path: ':id', component: PackDetailPage, title: 'Rule pack · Varsapradaya Carbon' },
] satisfies Routes;
