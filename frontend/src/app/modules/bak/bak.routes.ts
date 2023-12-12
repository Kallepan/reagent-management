import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/lots-list/lots-list.component').then(
        (m) => m.LotsListComponent,
      ),
  },
  {
    path: 'lots/create',
    loadComponent: () =>
      import('./components/lots-create/lots-create.component').then(
        (m) => m.LotsCreateComponent,
      ),
  },
  {
    path: 'lots/detail/:id',
    loadComponent: () =>
      import('./components/lots-detail/lots-detail.component').then(
        (m) => m.LotsDetailComponent,
      ),
  },
];
