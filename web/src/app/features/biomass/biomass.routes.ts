import { Routes } from '@angular/router';
import { staffGuard } from '../../core/auth.service';
import { BiomassPage } from './biomass.page';

export default [
  { path: '', component: BiomassPage, canActivate: [staffGuard], title: 'Trees & shrubs · Varsapradaya Carbon' },
] satisfies Routes;
