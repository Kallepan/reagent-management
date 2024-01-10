import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { featureFlagGuard } from './core/guards/auth-guard';
import { BakModule } from './modules/bak/bak.module';
import { PcrModule } from './modules/pcr/pcr.module';

export const routes: Routes = [
  // Routes can be guarded by feature flags which have to be enabled for the user (groups) and have to defined here
  {
    path: 'bak',
    loadChildren: () =>
      import('./modules/bak/bak.routes').then((m) => m.routes),
    canActivate: [featureFlagGuard],
    canActivateChild: [featureFlagGuard],
    data: { featureFlag: 'BAK' },
    providers: [importProvidersFrom(BakModule)],
  },
  {
    path: 'pcr',
    loadChildren: () =>
      import('./modules/pcr/pcr.routes').then((m) => m.routes),
    canActivate: [featureFlagGuard],
    canActivateChild: [featureFlagGuard],
    data: { featureFlag: 'PCR' },
    providers: [importProvidersFrom(PcrModule)],
  },
  { path: '', component: HomeComponent, title: 'Home' },
];
