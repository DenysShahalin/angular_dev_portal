import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DataTable, DataTableColumn } from '../../shared/data-table/data-table';
import { PageHeader } from '../../shared/page-header/page-header';
import { StatInfo } from '../../shared/stat-info/stat-info';
import { DatePipe } from '@angular/common';
import { ApiKeysService } from '../../services/api-keys.service';
import { ApiKey } from '../../types/keys';
import { apiCallsSvgIcon, usageSvgIcon, timeSvgIcon, quotaSvgIcon } from '../../utils/constants';

interface ApiKeysColumns extends ApiKey {
  action?: string;
}

const COLUMNS: DataTableColumn<ApiKeysColumns>[] = [
  { key: 'name', label: 'keys.tableColumns.name' },
  { key: 'key', label: 'keys.tableColumns.key' },
  { key: 'product', label: 'keys.tableColumns.product' },
  { key: 'createdAt', label: 'keys.tableColumns.createdAt' },
  { key: 'lastUsedAt', label: 'keys.tableColumns.lastUsedAt' },
  { key: 'overallUsage', label: 'keys.tableColumns.usage' },
  { key: 'action', label: '' },
];

interface StatItem {
  label: string;
  info: string;
  icon: string;
}

@Component({
  selector: 'app-keys',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, DataTable, DatePipe, PageHeader, StatInfo],
  template: `
    <app-page-header [label]="'keys.title' | translate"></app-page-header>
    <div style="margin-top: 1rem;">
      <h3>{{ 'keys.statsTitle' | translate }}</h3>
      <div class="stats-container">
        @for (stat of stats; track stat.label) {
          <app-stat-info
            [label]="stat.label | translate"
            [info]="stat.info"
            [icon]="stat.icon"
          ></app-stat-info>
        }
      </div>
      <app-data-table [columns]="columns" [data]="keys()" title="keys.tableTitle">
        <ng-template #cellTemplate let-row let-column="column">
          @switch (column) {
            @case ('created') {
              {{ row.created | date: 'mediumDate' }}
            }
            @case ('key') {
              {{ maskMiddle(row[column]) }}
            }
            @case ('createdAt')
            @case ('lastUsedAt') {
              {{ convertToDate(row[column]) }}
            }
            @case ('overallUsage') {
              {{ convertMillisToDays(row[column]) }}
            }
            @case ('action') {
              <button class="copy-button" aria-label="Copy" type="button" (click)="onCopy(row)">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 9.16663C5 6.80996 5 5.63079 5.7325 4.89913C6.46417 4.16663 7.64333 4.16663 10 4.16663H12.5C14.8567 4.16663 16.0358 4.16663 16.7675 4.89913C17.5 5.63079 17.5 6.80996 17.5 9.16663V13.3333C17.5 15.69 17.5 16.8691 16.7675 17.6008C16.0358 18.3333 14.8567 18.3333 12.5 18.3333H10C7.64333 18.3333 6.46417 18.3333 5.7325 17.6008C5 16.8691 5 15.69 5 13.3333V9.16663Z"
                    stroke="currentColor"
                  />
                  <path
                    d="M5 15.8333C4.33696 15.8333 3.70107 15.5699 3.23223 15.1011C2.76339 14.6322 2.5 13.9963 2.5 13.3333V8.33329C2.5 5.19079 2.5 3.61913 3.47667 2.64329C4.45333 1.66746 6.02417 1.66663 9.16667 1.66663H12.5C13.163 1.66663 13.7989 1.93002 14.2678 2.39886C14.7366 2.8677 15 3.50358 15 4.16663"
                    stroke="currentColor"
                  />
                </svg>
              </button>
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
      height: 100dvh;
    }

    h3 {
      font-weight: 500;
      color: var(--color-heading);
    }

    .stats-container {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      gap: 0.875rem;
    }

    .copy-button {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-primary);
    }
  `,
})
export class Keys {
  readonly columns = COLUMNS;
  readonly stats: StatItem[] = [
    { label: 'keys.billing.apiTitle', info: '12 240', icon: apiCallsSvgIcon },
    { label: 'keys.billing.usage', info: '8 320', icon: usageSvgIcon },
    { label: 'keys.billing.time', info: '3h 21m', icon: timeSvgIcon },
    { label: 'keys.billing.quota', info: '8 320 / 10 000', icon: quotaSvgIcon },
  ];
  private readonly apiKeysService = inject(ApiKeysService);
  protected readonly keys = signal<ApiKey[]>([]);

  constructor() {
    this.apiKeysService.getAllApiKeys().then((keys) => {
      this.keys.set(keys);
    });
  }

  maskMiddle(str: string): string {
    const start = str.slice(0, 3);
    const end = str.slice(-3);
    const middleLength = str.length - 6;
    return start + '*'.repeat(middleLength) + end;
  }

  convertToDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  convertMillisToDays(millis: number): string {
    const days = Math.floor(millis / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  async onCopy(row: ApiKey): Promise<void> {
    const type = 'text/plain';
    const clipboardItemData = {
      [type]: row.key,
    };
    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);
  }
}
