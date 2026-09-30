import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth.service';
import { UsersPage } from './users.page';

export default [
  { path: '', component: UsersPage, canActivate: [permissionGuard('users.manage')], title: 'Users & roles · Varsapradaya Carbon' },
] satisfies Routes;
