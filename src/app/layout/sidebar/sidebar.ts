import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ThemeService } from '../../services/theme.service';
import { UserService } from '../../services/user.service';
import { keysSvg, usageSvg, billingSvg } from '../../utils/constants';

import type { User } from '../../types/user';

interface SidebarLink {
  path: string;
  label: string;
  svg?: string;
  safeSvg?: SafeHtml;
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSlideToggle, RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <nav aria-label="Main navigation">
      <div class="user">{{ userData()?.name }}</div>
      <ul>
        @for (link of links; track link.path) {
          <li>
            <a
              [routerLink]="link.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: link.path === '/' }"
            >
              @if (link.safeSvg) {
                <span class="link-icon" aria-hidden="true" [innerHTML]="link.safeSvg"></span>
              }
              <span>{{ link.label | translate }}</span>
            </a>
          </li>
        }
      </ul>
    </nav>
    <div class="theme-toggle">
      <mat-slide-toggle
        [checked]="themeService.isDark()"
        (change)="themeService.toggle()"
        aria-label="Toggle dark theme"
      >
        {{
          themeService.isDark()
            ? ('sidebar.theme.dark' | translate)
            : ('sidebar.theme.light' | translate)
        }}
      </mat-slide-toggle>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 240px;
      min-width: 240px;
      height: 100dvh;
      background: var(--color-surface-alt);
      color: var(--color-primary);
      overflow-y: auto;
      padding: 1.5rem;
      border-right: 1px solid var(--color-border);
    }

    .user {
      padding: 1.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      border-bottom: 1px solid var(--color-border);
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0.75rem 0;
    }

    li {
      margin-bottom: 0.5rem;
    }

    li a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.5rem;
      border-radius: 0.5rem;
      color: var(--color-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition:
        background 0.15s,
        color 0.15s;
    }

    li a.active {
      background: var(--color-primary-muted);
      color: var(--color-primary-light);
    }

    .link-icon {
      display: flex;
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
    }

    .link-icon ::ng-deep svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .theme-toggle {
      margin-top: auto;
      padding: 1rem 0.5rem;
      border-top: 1px solid var(--color-border);
    }
  `,
})
export class Sidebar {
  protected readonly themeService = inject(ThemeService);
  private readonly userService = inject(UserService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly links: SidebarLink[] = this.buildLinks([
    {
      path: '/',
      label: 'sidebar.links.keys',
      svg: keysSvg,
    },
    { path: '/stats', label: 'sidebar.links.usage', svg: usageSvg },
    { path: '/billing', label: 'sidebar.links.billing', svg: billingSvg },
  ]);

  protected readonly userData = signal<User | null>(null);

  constructor() {
    this.userService.getUserData().then((user) => this.userData.set(user));
  }

  private buildLinks(links: SidebarLink[]): SidebarLink[] {
    return links.map((link) => ({
      ...link,
      safeSvg: link.svg ? this.sanitizer.bypassSecurityTrustHtml(link.svg) : undefined,
    }));
  }
}
