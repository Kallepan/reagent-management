import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotsListComponent } from './components/lots-list/lots-list.component';
import { LotsCreateComponent } from './components/lots-create/lots-create.component';
import { LotsDetailComponent } from './components/lots-detail/lots-detail.component';

// This could be implemented, but it causes page redirection before the lots are loaded.
// I guess it could be implemented by using a resolver to load the lots before the page is loaded.
// But I don't think it's worth the effort.
import { lotExistsGuard } from './guards/lot-exists.guard'; 
import { isAuthenticated } from '@app/core/guards/auth-guard';

const routes: Routes = [
  { path: 'lots/create', component: LotsCreateComponent, title: 'Create Lot' },
  { path: 'lots/detail/:id', component: LotsDetailComponent, title: 'Lot Detail', }, // TODO: canActivate: [isAuthenticated]
  { path: 'lots', component: LotsListComponent, title: 'Lots' },
  { path: '', redirectTo: 'lots', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BakRoutingModule { }
