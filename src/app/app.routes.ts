import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/keys/keys').then((m) => m.Keys),
  },
  {
    path: 'stats',
    loadComponent: () => import('./pages/usage/usage').then((m) => m.Usage),
  },
  {
    path: 'billing',
    loadComponent: () => import('./pages/billing/billing').then((m) => m.Billing),
  },
];
