import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchCreateComponent } from './components/batch-create/batch-create.component';
import { BatchListComponent } from './components/batch-list/batch-list.component';
import { BatchManageComponent } from './components/batch-manage/batch-manage.component';
import { ReagentManageComponent } from './components/reagent-manage/reagent-manage.component';
import { PcrModule } from './pcr.module';

const routes: Routes = [
  { path: 'batch', title: 'Batch', component: BatchListComponent, providers: [importProvidersFrom(PcrModule)] },
  { path: 'batch/create', title: 'Create Batch', component: BatchCreateComponent, providers: [importProvidersFrom(PcrModule)] },
  { path: 'batch/manage/:id', title: 'Manage Batch', component: BatchManageComponent, providers: [importProvidersFrom(PcrModule)] },
  { path: 'reagent/manage/:id', title: 'Manage Reagent', component: ReagentManageComponent, providers: [importProvidersFrom(PcrModule)] },
  { path: '', redirectTo: 'batch/create', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PcrRoutingModule { }
