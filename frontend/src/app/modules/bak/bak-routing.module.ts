import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotsListComponent } from './components/lots-list/lots-list.component';
import { LotsCreateComponent } from './components/lots-create/lots-create.component';
import { LotsDetailComponent } from './components/lots-detail/lots-detail.component';

const routes: Routes = [
  { path: 'lots/create', component: LotsCreateComponent, title: 'Create Lot' },
  { path: 'lots/detail/:id', component: LotsDetailComponent, title: 'Lot Detail', }, // TODO: canActivate: [isAuthenticated]
  { path: 'lots', component: LotsListComponent, title: 'Lots' },
  { path: '', redirectTo: 'lots', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BakRoutingModule { }
