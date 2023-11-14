import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { featureFlagGuard } from './core/guards/auth-guard';

// Add routes with labels to display in the menu
const routes: Routes = [
  // Routes can be guarded by feature flags which have to be enabled for the user (groups) and have to defined here
  { path: 'bak', loadChildren: () => import('./modules/bak/bak.module').then(m => m.BakModule), title: 'BAK', canActivate: [featureFlagGuard], data: { featureFlag: 'BAK' } },
  { path: 'pcr', loadChildren: () => import('./modules/pcr/pcr.module').then(m => m.PcrModule), title: 'PCR', canActivate: [featureFlagGuard], data: { featureFlag: 'PCR' } },
  { path: '', loadComponent: () => import('./core/components/home/home.component').then(m => m.HomeComponent), title: 'Home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
