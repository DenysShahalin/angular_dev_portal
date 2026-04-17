import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { NgTemplateOutlet } from '@angular/common';

export interface DataTableColumn<T = unknown> {
  key: string & keyof T;
  label: string;
}

@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, NgTemplateOutlet, TranslatePipe],
  template: `
    <h3 class="table-title">{{ title() | translate }}</h3>
    <div class="table-container" role="region" aria-label="Data table" tabindex="0">
      <table mat-table [dataSource]="data()">
        @for (col of columns(); track col.key) {
          <ng-container [matColumnDef]="col.key" maximized>
            <th mat-header-cell *matHeaderCellDef>{{ col.label | translate }}</th>
            <td mat-cell *matCellDef="let row">
              @if (cellTemplate()) {
                <ng-container
                  *ngTemplateOutlet="cellTemplate()!; context: { $implicit: row, column: col.key }"
                />
              } @else {
                {{ row[col.key] }}
              }
            </td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns()"></tr>
      </table>
    </div>
  `,
  styles: `
    h3 {
      font-weight: 500;
      color: var(--color-heading);
    }

    .table-container {
      overflow-x: auto;
      border: 1px solid var(--color-border);
      border-radius: 1.25rem;
      background: var(--color-surface);
    }

    table {
      width: 100%;
      background: var(--color-surface);
    }

    th.mat-mdc-header-cell {
      font-weight: 600;
      color: var(--color-heading);
      background: var(--color-surface-alt);
    }

    td.mat-mdc-cell {
      color: var(--color-primary);
    }

    tr.mat-mdc-row:last-child td.mat-mdc-cell {
      border-bottom: none;
    }
  `,
})
export class DataTable<T> {
  readonly title = input.required<string>();
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly data = input.required<T[]>();

  readonly cellTemplate = contentChild<TemplateRef<unknown>>('cellTemplate');

  displayedColumns = () => this.columns().map((c) => c.key);
}
