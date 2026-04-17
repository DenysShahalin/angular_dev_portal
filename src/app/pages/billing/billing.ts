import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DataTable, DataTableColumn } from '../../shared/data-table/data-table';
import { Button } from '../../shared/button/button';
import { PageHeader } from '../../shared/page-header/page-header';
import { BillingService } from '../../services/billing.service';

import type { BillingData, PaymentDetails, PlanDetails } from '../../types/keys';

const COLUMNS: DataTableColumn<BillingData>[] = [
  { key: 'date', label: 'billingPage.tableColumns.date' },
  { key: 'description', label: 'billingPage.tableColumns.description' },
  { key: 'amount', label: 'billingPage.tableColumns.amount' },
  { key: 'used', label: 'billingPage.tableColumns.used' },
  { key: 'status', label: 'billingPage.tableColumns.status' },
];

@Component({
  selector: 'app-applications',
  imports: [TranslatePipe, DataTable, PageHeader, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [label]="'billingPage.title' | translate"></app-page-header>
    <div style="margin-top: 1rem;">
      <div class="details-section">
        <div class="details-info">
          <span class="details-header">{{ 'billingPage.planDetails.title' | translate }}</span>
          <span class="details-plan">{{ planDetails()?.currentPlan }}</span>
          <span>{{ planDetails()?.pay }}</span>
          <span>{{ planDetails()?.unitsPerPlan }} units included</span>
        </div>
        <app-button type="secondary">{{ 'controls.selectPlan' | translate }}</app-button>
      </div>

      <div class="details-section">
        <div class="details-info">
          <span class="details-header">{{ 'billingPage.paymentDetails.title' | translate }}</span>
          <span class="details-plan">{{ paymentDetails()?.cardNumber }}</span>
          <span>{{ paymentDetails()?.cardType }}</span>
          <span>{{ paymentDetails()?.expiryDate }}</span>
        </div>
        <app-button type="ghost">{{ 'controls.update' | translate }}</app-button>
      </div>

      <app-data-table [columns]="columns" [data]="data()" title="billingPage.tableTitle">
        <ng-template #cellTemplate let-row let-column="column">
          @switch (column) {
            @case ('date') {
              {{ convertToDate(row[column]) }}
            }
            @case ('status') {
              <span class="status-badge">
                {{ row[column] }}
              </span>
            }
            @default {
              {{ row[column] }}
            }
          }
        </ng-template>
      </app-data-table>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding: 2rem;
      background: var(--color-surface);
      height: fit-content;
      min-height: 100dvh;
    }

    .status-badge {
      background-color: var(--badge-gray);
      padding: 0.125rem 0.625rem;
      border-radius: 0.625rem;
    }

    .details-section {
      width: 100%;
      border: 1px solid var(--color-border);
      border-radius: 1.25rem;
      padding: 1rem;
      margin: 1rem 0;
      background: var(--color-surface);
      box-shadow: 2px 4px 10px 0px #0000001a;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      color: var(--color-light-grey);
    }

    .details-info {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .details-header {
      text-transform: uppercase;
      font-weight: 500;
      font-size: 1.125rem;
    }

    .details-plan {
      font-size: 1.75rem;
      color: var(--color-primary);
      padding: 0.25rem 0;
    }
  `,
})
export class Billing {
  readonly columns = COLUMNS;
  protected readonly data = signal<BillingData[]>([]);
  protected readonly planDetails = signal<PlanDetails | null>(null);
  protected readonly paymentDetails = signal<PaymentDetails | null>(null);

  private readonly billingService = inject(BillingService);

  constructor() {
    this.billingService.getBillingData().then((data) => {
      this.data.set(data);
    });

    this.billingService.getPlanDetails().then((details) => {
      this.planDetails.set(details);
    });

    this.billingService.getPaymentDetails().then((details) => {
      this.paymentDetails.set(details);
    });
  }

  convertToDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
