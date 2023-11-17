import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BakModule } from './bak.module';

const routes: Routes = [
  { path: 'lots/create', loadComponent: () => import('./components/lots-create/lots-create.component').then(m => m.LotsCreateComponent), title: 'Create Lot', providers: [importProvidersFrom(BakModule)] },
  { path: 'lots/detail/:id', loadComponent: () => import('./components/lots-detail/lots-detail.component').then(m => m.LotsDetailComponent), title: 'Lot Detail', providers: [importProvidersFrom(BakModule)] },
  { path: 'lots', loadComponent: () => import('./components/lots-list/lots-list.component').then(m => m.LotsListComponent), title: 'Lots', providers: [importProvidersFrom(BakModule)] },
  { path: '', redirectTo: 'lots', pathMatch: 'full', },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BakRoutingModule { }
