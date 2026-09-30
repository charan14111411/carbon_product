import { Routes } from '@angular/router';
import { FieldDetailPage } from './field-detail.page';
import { FieldsPage } from './fields.page';

export default [
  { path: '', component: FieldsPage, title: 'Fields & map · Varsapradaya Carbon' },
  { path: ':id', component: FieldDetailPage, title: 'Field · Varsapradaya Carbon' },
] satisfies Routes;
