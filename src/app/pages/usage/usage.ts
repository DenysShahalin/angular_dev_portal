import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PageHeader } from '../../shared/page-header/page-header';
import { ApiKeysService } from '../../services/api-keys.service';
import { ApiKey } from '../../types/keys';

@Component({
  selector: 'app-apis',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    PageHeader,
    CommonModule,
    CanvasJSAngularChartsModule,
    // mui select
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  template: `
    <app-page-header [label]="'usagePage.title' | translate"></app-page-header>

    <div class="select-container">
      <mat-form-field class="usage-dropdown">
        <mat-select [formControl]="dateControl">
          @for (date of datesOptions; track date) {
            <mat-option [value]="date.value">{{ date.viewValue }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field class="usage-dropdown">
        <mat-select [formControl]="keysControl">
          @for (key of apiKeysOptions(); track key) {
            <mat-option [value]="key.value">{{ key.viewValue }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
    <div class="usage-chart-container">
      <h3>{{ 'usagePage.overviewChartTitle' | translate }}</h3>
      <canvasjs-chart
        [options]="usageChartOptions()"
        [styles]="{ width: '100%', height: '360px' }"
        (chartInstance)="usageChart = $event"
      ></canvasjs-chart>
    </div>
    <div class="plan-chart-container">
      <h3>{{ 'usagePage.planChartTitle' | translate }}</h3>
      <canvasjs-chart
        [options]="planChartOptions()"
        [styles]="{ width: '100%', height: '360px' }"
        (chartInstance)="planChart = $event"
      ></canvasjs-chart>
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

    .select-container {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .usage-chart-container {
      padding: 0 1rem 1rem 1rem;
      border: 1px solid var(--color-border);
      border-bottom-left-radius: 1.25rem;
      border-bottom-right-radius: 1.25rem;

      h3 {
        font-weight: 500;
        color: var(--color-heading);
      }
    }

    .plan-chart-container {
      width: 40%;
      padding: 1rem;
      border: 1px solid var(--color-border);
      border-radius: 1.25rem;
      margin-top: 2rem;

      h3 {
        font-weight: 500;
        color: var(--color-heading);
      }
    }

    .usage-dropdown {
      border: 1px solid var(--color-border);
      border-top-left-radius: 1.25rem;
      border-top-right-radius: 1.25rem;

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      ::ng-deep .mdc-line-ripple {
        display: none;
      }

      ::ng-deep .mat-mdc-text-field-wrapper {
        border-top-left-radius: 1.25rem;
        border-top-right-radius: 1.25rem;
        background: var(--color-surface);
      }

      ::ng-deep .mat-mdc-select-panel {
        background: var(--color-surface);
        margin-top: 2px;
      }
    }
  `,
})
export class Usage {
  private readonly apiKeysService = inject(ApiKeysService);

  protected readonly dateControl = new FormControl('month');
  protected readonly keysControl = new FormControl('all');
  protected readonly usageOverviewKeys = signal<{ date: string; count: number }[] | undefined>(
    undefined,
  );
  protected readonly allApiKeys = signal<ApiKey[]>([]);
  protected readonly apiKeysOptions = signal<{ value: string; viewValue: string }[]>([]);

  protected usageChart: any;
  protected planChart: any;

  constructor() {
    effect(() => {
      const options = this.usageChartOptions();
      if (this.usageChart) {
        this.usageChart.options = options;
        this.usageChart.render();
      }
    });

    effect(() => {
      const options = this.planChartOptions();
      if (this.planChart) {
        this.planChart.options = options;
        this.planChart.render();
      }
    });

    this.apiKeysService.getAllApiKeys().then((keys) => {
      this.allApiKeys.set(keys);
      this.setAllKeysUsageData();
      const options = keys.map((k) => ({ value: k.key, viewValue: k.key }));
      options.unshift({ value: 'all', viewValue: 'All Keys' });
      this.apiKeysOptions.set(options);
    });

    this.dateControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.onDateSelect(value));

    this.keysControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.onKeySelect(value));
  }

  setAllKeysUsageData() {
    const allKeys = this.allApiKeys() || [];
    const allKeysUsageMap = allKeys.reduce(
      (acc, keyData) => {
        const usage = keyData.usage || [];
        usage.forEach((u) => {
          if (acc[u.date]) {
            acc[u.date] += u.count;
          } else {
            acc[u.date] = u.count;
          }
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    const allKeysUsageArray = Object.keys(allKeysUsageMap)
      .map((date) => ({
        date,
        count: allKeysUsageMap[date],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.usageOverviewKeys.set(allKeysUsageArray);
  }

  onKeySelect(value: string | null) {
    if (!value) return;
    if (value === 'all') {
      this.setAllKeysUsageData();
    } else {
      this.apiKeysService.getApiKey(value).then((key) => {
        this.usageOverviewKeys.set(key?.usage || undefined);
      });
    }
  }

  onDateSelect(value: string | null) {
    console.log('Selected date range:', value);
  }

  usageChartOptions = computed(() => {
    const usage = this.usageOverviewKeys() || [];
    return {
      theme: 'light2',
      data: [
        {
          type: 'line',
          dataPoints: usage.map((i) => ({ x: new Date(i.date), y: i.count })),
        },
      ],
    };
  });

  planChartOptions = computed(() => {
    const keys = this.allApiKeys() || [];
    return {
      animationEnabled: true,
      dataPointMaxWidth: 20,
      data: [
        {
          color: '#b8b8b8',
          type: 'column',
          dataPoints: keys.map((k) => ({ label: k.name, y: k.overallUsage })),
        },
      ],
    };
  });

  datesOptions: any[] = [
    { value: 'week', viewValue: 'This Week' },
    { value: 'month', viewValue: 'This Month' },
    { value: 'year', viewValue: 'This Year' },
  ];
}
