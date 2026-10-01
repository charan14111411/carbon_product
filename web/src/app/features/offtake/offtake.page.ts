import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KIT } from '../../ui/kit';
import { AgreementsTab } from './agreements.tab';
import { OffersTab } from './offers.tab';
import { Offer } from './offtake-types';

type Tab = 'offers' | 'agreements';

@Component({
  selector: 'vc-offtake-page',
  imports: [...KIT, OffersTab, AgreementsTab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Offers & offtake" eyebrow="Market"
      subtitle="Priced offers to buyers and multi-year offtake agreements, with deliveries tracked against each agreement's schedule." />
    <vc-tabs [tabs]="tabs" [active]="tab()" (activeChange)="setTab($any($event))" />
    <div [hidden]="tab() !== 'offers'"><vcx-offers-tab (makeAgreement)="fromOffer($event)" /></div>
    <div [hidden]="tab() !== 'agreements'"><vcx-agreements-tab /></div>
  `,
})
export class OfftakePage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private agreements = viewChild.required(AgreementsTab);
  tabs = [{ key: 'offers', label: 'Offers' }, { key: 'agreements', label: 'Offtake agreements' }];
  tab = signal<Tab>((this.route.snapshot.queryParamMap.get('tab') as Tab) || 'offers');

  setTab(t: Tab) {
    this.tab.set(t);
    this.router.navigate([], { queryParams: { tab: t }, replaceUrl: true });
  }
  fromOffer(o: Offer) {
    this.setTab('agreements');
    this.agreements().openCreate(o);
  }
}
