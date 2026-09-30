import { Routes } from '@angular/router';
import { FieldCampaign } from './field-campaign';
import { FieldCapture } from './field-capture';
import { FieldHome } from './field-home';
import { FieldOutbox } from './field-outbox';
import { FieldPractice } from './field-practice';
import { FieldShell } from './field-shell';

export default [
  {
    path: '',
    component: FieldShell,
    children: [
      { path: '', component: FieldHome, title: 'Field app · Varsapradaya Carbon' },
      { path: 'map', component: FieldCampaign, title: 'Map · Field app' },
      { path: 'campaign/:cid', component: FieldCampaign, title: 'Campaign · Field app' },
      { path: 'campaign/:cid/point/:pid', component: FieldCapture, title: 'Record a core · Field app' },
      { path: 'outbox', component: FieldOutbox, title: 'Outbox · Field app' },
      { path: 'practice', component: FieldPractice, title: 'Record a practice · Field app' },
    ],
  },
] satisfies Routes;
