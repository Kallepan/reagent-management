import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { featureFlagGuard } from './core/guards/auth-guard';

// Add routes with labels to display in the menu
const routes: Routes = [
  { path: 'bak', loadChildren: () => import('./modules/bak/bak.module').then(m => m.BakModule), title: 'BAK', canActivate: [featureFlagGuard('bak', '')] },
  { path: '', loadComponent: () => import('./core/components/home/home.component').then(m => m.HomeComponent), title: 'Home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
