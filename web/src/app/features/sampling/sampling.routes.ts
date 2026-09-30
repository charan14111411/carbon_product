import { Routes } from '@angular/router';
import { CampaignPage } from './campaign.page';
import { SamplingPage } from './sampling.page';

export default [
  { path: '', component: SamplingPage, title: 'Sampling · Varsapradaya Carbon' },
  { path: ':id', component: CampaignPage, title: 'Campaign · Varsapradaya Carbon' },
] satisfies Routes;
