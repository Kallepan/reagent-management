import { Route } from "@angular/router";
import { featureFlagGuard } from "@app/core/guards/auth-guard";


export const routes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./components/lots-list/lots-list.component').then(m => m.LotsListComponent),
        canActivate: [featureFlagGuard],
        data: { featureFlag: 'BAK' },
    },
    {
        path: 'lots/create',
        loadComponent: () => import('./components/lots-create/lots-create.component').then(m => m.LotsCreateComponent),
        canActivate: [featureFlagGuard],
        data: { featureFlag: 'BAK' },
    },
    {
        path: 'lots/detail/:id',
        loadComponent: () => import('./components/lots-detail/lots-detail.component').then(m => m.LotsDetailComponent),
        canActivate: [featureFlagGuard],
        data: { featureFlag: 'BAK' },
    },
];