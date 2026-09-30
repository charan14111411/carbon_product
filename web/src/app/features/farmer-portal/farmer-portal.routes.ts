import { Routes } from '@angular/router';
import { FarmerConsents, FarmerFields, FarmerHelp, FarmerHome, FarmerPaymentDetails, FarmerPayments } from './farmer-pages';
import { FarmerShell } from './farmer-shell';

const T = ' · Varsapradaya Carbon';

export default [
  {
    path: '',
    component: FarmerShell,
    children: [
      { path: '', component: FarmerHome, title: 'Home' + T },
      { path: 'fields', component: FarmerFields, title: 'My fields' + T },
      { path: 'payments', component: FarmerPayments, title: 'My payments' + T },
      { path: 'payment-details', component: FarmerPaymentDetails, title: 'Payment details' + T },
      { path: 'consents', component: FarmerConsents, title: 'My consents' + T },
      { path: 'help', component: FarmerHelp, title: 'Help & complaints' + T },
    ],
  },
] satisfies Routes;
