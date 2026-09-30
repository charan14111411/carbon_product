import { Routes } from '@angular/router';
import { ModelDetailPage } from './model-detail.page';
import { ModelsPage } from './models.page';

export default [
  { path: '', component: ModelsPage, title: 'Soil-carbon models · Varsapradaya Carbon' },
  { path: ':id', component: ModelDetailPage, title: 'Model · Varsapradaya Carbon' },
] satisfies Routes;
