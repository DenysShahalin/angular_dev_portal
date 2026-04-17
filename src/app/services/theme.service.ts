import { Injectable, signal, computed, effect, DOCUMENT, inject } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly theme = signal<Theme>(this.getStoredTheme());

  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      const value = this.theme();
      this.document.documentElement.classList.toggle('dark-theme', value === 'dark');
      localStorage.setItem('theme', value);
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
