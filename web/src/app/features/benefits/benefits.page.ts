import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KIT } from '../../ui/kit';
import { PayoutBatch } from './benefit-types';
import { PayoutsTab } from './payouts.tab';
import { PoolsTab } from './pools.tab';
import { ProfilesTab } from './profiles.tab';
import { RulesTab } from './rules.tab';

type TabKey = 'rules' | 'pools' | 'payouts' | 'profiles';

@Component({
  selector: 'vc-benefits-page',
  imports: [...KIT, RulesTab, PoolsTab, PayoutsTab, ProfilesTab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Farmer benefits" eyebrow="Money"
      subtitle="Share credit revenue with farmers transparently: an approved rule, a pool per sale, and payout batches checked by two people." />
    <vc-tabs [tabs]="tabs" [active]="tab()" (activeChange)="setTab($any($event))" />
    @switch (tab()) {
      @case ('rules') { <vcx-rules-tab /> }
      @case ('pools') { <vcx-pools-tab [openId]="openPool" (batchCreated)="onBatch($event)" /> }
      @case ('payouts') { <vcx-payouts-tab [openId]="openBatch()" /> }
      @case ('profiles') { <vcx-profiles-tab /> }
    }
  `,
})
export class BenefitsPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  tabs = [
    { key: 'rules', label: 'Benefit rules' }, { key: 'pools', label: 'Benefit pools' },
    { key: 'payouts', label: 'Payout batches' }, { key: 'profiles', label: 'Payment profiles' },
  ];
  tab = signal<TabKey>((this.route.snapshot.queryParamMap.get('tab') as TabKey) || 'rules');
  /** Deep links: /app/benefits?tab=pools&open=<id> opens that pool or payout batch. */
  private deep = this.route.snapshot.queryParamMap.get('open');
  openPool = this.tab() === 'pools' ? this.deep : null;
  openBatch = signal<string | null>(this.tab() === 'payouts' ? this.deep : null);

  setTab(t: TabKey) {
    this.tab.set(t);
    this.router.navigate([], { queryParams: { tab: t }, replaceUrl: true });
  }

  onBatch(b: PayoutBatch) {
    this.openBatch.set(b.id);
    this.setTab('payouts');
  }
}
