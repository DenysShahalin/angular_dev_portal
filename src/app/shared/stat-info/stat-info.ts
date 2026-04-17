import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-stat-info',
  template: `
    <div class="info-wrapper" aria-label="Stat info">
      <div class="info-header">
        <span>{{ label() }}</span>
        <span [innerHTML]="safeIcon()" aria-hidden="true"></span>
      </div>
      <span class="info-body">{{ info() }}</span>
    </div>
  `,
  styles: `
    .info-wrapper {
      border: 1px solid var(--color-border);
      border-radius: 1.25rem;
      padding: 0.875rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      background: var(--color-surface);
      box-shadow: 2px 4px 10px 0px #0000001a;
      width: 260px;
      height: 137px;
    }
    .info-header {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      color: var(--color-light-grey);
      text-transform: uppercase;
      font-size: 1.125rem;
      padding: 0.5rem 0;
    }
    .info-body {
      padding: 0.5rem 0;
      font-size: 1.5rem;
      color: var(--color-heading);
    }
  `,
})
export class StatInfo {
  private readonly sanitizer = inject(DomSanitizer);
  readonly label = input.required<string>();
  readonly info = input.required<string>();
  readonly icon = input.required<string>();
  readonly safeIcon = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.icon()));
}
