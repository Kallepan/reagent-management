import { Route } from "@angular/router";


export const routes: Route[] = [
    {
        path: 'batch',
        title: 'Batch',
        loadComponent: () => import('./components/batch-list/batch-list.component').then(m => m.BatchListComponent),
    },
    {
        path: 'batch/create',
        title: 'Create Batch',
        loadComponent: () => import('./components/batch-create/batch-create.component').then(m => m.BatchCreateComponent),
    },
    {
        path: 'batch/:batchId',
        title: 'Manage Batch',
        loadComponent: () => import('./components/batch-manage/batch-manage.component').then(m => m.BatchManageComponent),
    },
    {
        path: 'reagent/:id',
        title: 'Manage Reagent',
        loadComponent: () => import('./components/reagent-manage/reagent-manage.component').then(m => m.ReagentManageComponent),
    },
];