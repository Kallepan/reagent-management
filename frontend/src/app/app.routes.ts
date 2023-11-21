import { Routes } from '@angular/router'
import { featureFlagGuard } from './core/guards/auth-guard'
import { BakModule } from './modules/bak/bak.module'
import { importProvidersFrom } from '@angular/core'
import { PcrModule } from './modules/pcr/pcr.module'
import { HomeComponent } from './core/components/home/home.component'


export const routes: Routes = [
    // Routes can be guarded by feature flags which have to be enabled for the user (groups) and have to defined here
    {
        path: 'bak',
        children: [
            {
                path: '',
                loadComponent: () => import('./modules/bak/components/lots-list/lots-list.component').then(m => m.LotsListComponent),
                canActivate: [featureFlagGuard],
                data: { featureFlag: 'BAK' },
                providers: [
                    importProvidersFrom(BakModule),
                ],
            },
            {
                path: 'lots/create',
                loadComponent: () => import('./modules/bak/components/lots-create/lots-create.component').then(m => m.LotsCreateComponent),
                canActivate: [featureFlagGuard],
                data: { featureFlag: 'BAK' },
                providers: [
                    importProvidersFrom(BakModule),
                ],
            },
            {
                path: 'lots/detail/:id',
                loadComponent: () => import('./modules/bak/components/lots-detail/lots-detail.component').then(m => m.LotsDetailComponent),
                canActivate: [featureFlagGuard],
                data: { featureFlag: 'BAK' },
                providers: [
                    importProvidersFrom(BakModule),
                ],
            },
        ],
        canActivate: [featureFlagGuard],
        data: { featureFlag: 'BAK' },
    },
    {
        path: 'pcr',
        children: [
            {
                path: 'batch',
                title: 'Batch',
                loadComponent: () => import('./modules/pcr/components/batch-list/batch-list.component').then(m => m.BatchListComponent),
                providers: [importProvidersFrom(PcrModule)]
            },
            {
                path: 'batch/create',
                title: 'Create Batch',
                loadComponent: () => import('./modules/pcr/components/batch-create/batch-create.component').then(m => m.BatchCreateComponent),
                providers: [importProvidersFrom(PcrModule)]
            },
            {
                path: 'batch/manage/:id',
                title: 'Manage Batch',
                loadComponent: () => import('./modules/pcr/components/batch-manage/batch-manage.component').then(m => m.BatchManageComponent),
                providers: [importProvidersFrom(PcrModule)],
            },
            {
                path: 'reagent/manage/:id',
                title: 'Manage Reagent',
                loadComponent: () => import('./modules/pcr/components/reagent-manage/reagent-manage.component').then(m => m.ReagentManageComponent),
                providers: [importProvidersFrom(PcrModule)],
            },
        ],
    },
    { path: 'pcr', loadComponent: () => import('./modules/pcr/components/batch-list/batch-list.component').then(m => m.BatchListComponent), title: 'PCR', canActivate: [featureFlagGuard], data: { featureFlag: 'PCR' } },
    { path: '', component: HomeComponent, title: 'Home' },
]