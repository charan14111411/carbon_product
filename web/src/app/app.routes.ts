import { Routes } from '@angular/router';

import { signedInGuard } from './core/auth.service';

import { DevLogin } from './features/auth/dev-login';
import { Login } from './features/auth/login';

import { Shell } from './layout/shell';



export const routes: Routes = [

  { path: 'login', component: Login, title: 'Sign in · Varsapradaya Carbon' },
  { path: 'dev-login', component: DevLogin },

  {

    path: 'app',

    component: Shell,

    canActivate: [signedInGuard],

    children: [

      { path: '', pathMatch: 'full', redirectTo: 'overview' },

      { path: 'overview', loadChildren: () => import('./features/overview/overview.routes') },

      { path: 'programmes', loadChildren: () => import('./features/programmes/programmes.routes') },

      { path: 'farmers', loadChildren: () => import('./features/farmers/farmers.routes') },

      { path: 'agreements', loadChildren: () => import('./features/agreements/agreements.routes') },

      { path: 'fields', loadChildren: () => import('./features/fields/fields.routes') },

      { path: 'practices', loadChildren: () => import('./features/practices/practices.routes') },

      { path: 'catalogue', loadChildren: () => import('./features/catalogue/catalogue.routes') },

      { path: 'methodology', loadChildren: () => import('./features/methodology/methodology.routes') },

      { path: 'sampling', loadChildren: () => import('./features/sampling/sampling.routes') },

      { path: 'lab', loadChildren: () => import('./features/lab/lab.routes') },

      { path: 'quality', loadChildren: () => import('./features/quality/quality.routes') },

      { path: 'calculations', loadChildren: () => import('./features/calculations/calculations.routes') },

      { path: 'verification', loadChildren: () => import('./features/verification/verification.routes') },

      { path: 'supporting', loadChildren: () => import('./features/supporting/supporting.routes') },

      { path: 'satellite', loadChildren: () => import('./features/satellite/satellite.routes') },

      { path: 'models', loadChildren: () => import('./features/models/models.routes') },

      { path: 'credits', loadChildren: () => import('./features/credits/credits.routes') },

      { path: 'sales', loadChildren: () => import('./features/sales/sales.routes') },

      { path: 'benefits', loadChildren: () => import('./features/benefits/benefits.routes') },

      { path: 'risk', loadChildren: () => import('./features/risk/risk.routes') },

      { path: 'grievances', loadChildren: () => import('./features/grievances/grievances.routes') },

      { path: 'users', loadChildren: () => import('./features/users/users.routes') },

      { path: 'partners', loadChildren: () => import('./features/partners/partners.routes') },

      { path: 'audit', loadChildren: () => import('./features/audit/audit.routes') },
      { path: 'portfolio', loadChildren: () => import('./features/portfolio/portfolio.routes') },
      { path: 'households', loadChildren: () => import('./features/households/households.routes') },
      { path: 'interventions', loadChildren: () => import('./features/interventions/interventions.routes') },
      { path: 'baseline', loadChildren: () => import('./features/baseline/baseline.routes') },
      { path: 'additionality', loadChildren: () => import('./features/additionality/additionality.routes') },
      { path: 'control-sites', loadChildren: () => import('./features/control-sites/control-sites.routes') },
      { path: 'emissions', loadChildren: () => import('./features/emissions/emissions.routes') },
      { path: 'offtake', loadChildren: () => import('./features/offtake/offtake.routes') },
      { path: 'notifications', loadChildren: () => import('./features/notifications/notifications.routes') },
      { path: 'documents', loadChildren: () => import('./features/documents/documents.routes') },
      { path: 'qa1', loadChildren: () => import('./features/qa1/qa1.routes') },
      { path: 'biomass', loadChildren: () => import('./features/biomass/biomass.routes') },
      { path: 'leakage', loadChildren: () => import('./features/leakage/leakage.routes') },

    ],

  },

  { path: 'field', canActivate: [signedInGuard], loadChildren: () => import('./features/field-app/field-app.routes') },

  { path: 'farmer', canActivate: [signedInGuard], loadChildren: () => import('./features/farmer-portal/farmer-portal.routes') },

  { path: 'buyer', canActivate: [signedInGuard], loadChildren: () => import('./features/buyer-portal/buyer-portal.routes') },

  { path: 'verify', loadChildren: () => import('./features/verifier/verifier.routes') },

  { path: '', pathMatch: 'full', redirectTo: 'app/overview' },

  { path: '**', redirectTo: 'app/overview' },

];

