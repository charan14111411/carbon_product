import { Routes } from '@angular/router';
import { BuyerPortfolio, BuyerSale, BuyerShell } from './buyer-portal';

export default [
  {
    path: '',
    component: BuyerShell,
    children: [
      { path: '', component: BuyerPortfolio, title: 'Carbon portfolio · Varsapradaya Carbon' },
      { path: 'sales/:id', component: BuyerSale, title: 'Purchase report · Varsapradaya Carbon' },
    ],
  },
] satisfies Routes;
