import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth.service';
import { AssistantPage } from './assistant.page';
import { PartnersPage } from './partners.page';

export default [
  { path: '', component: PartnersPage, canActivate: [permissionGuard('partners.manage')], title: 'Partners & API · Varsapradaya Carbon' },
  { path: 'assistant', component: AssistantPage, canActivate: [permissionGuard('data.read', 'verify.read')], title: 'Results assistant · Varsapradaya Carbon' },
] satisfies Routes;
