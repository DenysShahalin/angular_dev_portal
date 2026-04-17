import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

export type ButtonType = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [class]="'btn btn-' + type()" [type]="'button'">
      @if (sanitizedIcon; as icon) {
        <span class="btn-icon" [innerHTML]="icon" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styles: `
    .btn {
      display: inline-flex;
      text-align: center;
      align-items: center;
      gap: 0.625rem;
      padding: 0.625rem 1.75rem;
      border: none;
      border-radius: 0.625rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s ease;
      line-height: 100%;
    }

    .btn:hover {
      opacity: 0.8;
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .btn-primary {
      background-color: var(--badge-gray);
      color: var(--color-primary);
    }

    .btn-secondary {
      background-color: var(--color-primary);
      color: var(--color-surface);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
    }
  `,
})
export class Button {
  private readonly sanitizer = inject(DomSanitizer);
  readonly type = input<ButtonType>('primary');
  readonly icon = input<string>();

  get sanitizedIcon(): SafeHtml | null {
    const icon = this.icon();
    return icon ? this.sanitizer.bypassSecurityTrustHtml(icon) : null;
  }
}
