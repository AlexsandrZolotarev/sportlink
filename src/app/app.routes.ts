import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'media',
    pathMatch: 'full',
  },
  {
    path: 'media',
    loadComponent: () =>
      import('../pages/media').then((m) => m.MediaPageComponent),
    title: 'Медиа — SportClick',
  },
  {
    path: 'services',
    loadComponent: () =>
      import('../pages/media').then((m) => m.MediaPageComponent), // placeholder
    title: 'Сервисы — SportClick',
  },
  {
    path: '**',
    redirectTo: 'media',
  },
];
