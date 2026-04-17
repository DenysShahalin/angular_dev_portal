import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Button } from '../button/button';
import { accountSvgIcon } from '../../utils/constants';

@Component({
  selector: 'app-page-header',
  imports: [Button, TranslatePipe],
  template: `
    <div class="header-wrapper" aria-label="Page header">
      <h1>{{ label() }}</h1>
      <div class="header-actions">
        <app-button [icon]="accountSvgIcon" (click)="onAccountClick()">{{
          'controls.account' | translate
        }}</app-button>
        <app-button [type]="'secondary'" (click)="onLogoutClick()">{{
          'controls.logout' | translate
        }}</app-button>
      </div>
    </div>
  `,
  styles: `
    .header-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 2rem 0;
      border-bottom: 1px solid var(--color-border);
    }

    h1 {
      color: var(--color-primary);
      font-size: 1.75rem;
      font-weight: 500;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-actions:empty {
      display: none;
    }
  `,
})
export class PageHeader {
  readonly accountSvgIcon = accountSvgIcon;
  readonly label = input.required<string>();

  onAccountClick(): void {}
  onLogoutClick(): void {}
}
