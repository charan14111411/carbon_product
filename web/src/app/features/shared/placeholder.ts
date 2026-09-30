import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Empty, PageHeader } from '../../ui/kit';

@Component({
  selector: 'vc-placeholder',
  imports: [PageHeader, Empty],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<vc-page-header [title]="title" /><div class="card"><vc-empty icon="sparkles" title="Being prepared" text="This area is being built." /></div>`,
})
export class Placeholder {
  title = inject(ActivatedRoute).snapshot.data['title'] ?? '';
}
