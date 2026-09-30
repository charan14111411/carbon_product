import { Routes } from '@angular/router';
import { ProgrammeDetailPage } from './programme-detail.page';
import { ProgrammesPage } from './programmes.page';
import { ProjectDetailPage } from './project-detail.page';

export default [
  { path: '', component: ProgrammesPage, title: 'Programmes · Varsapradaya Carbon' },
  { path: 'projects/:id', component: ProjectDetailPage, title: 'Project · Varsapradaya Carbon' },
  { path: ':id', component: ProgrammeDetailPage, title: 'Programme · Varsapradaya Carbon' },
] satisfies Routes;
