import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Add routes with labels to display in the menu
const routes: Routes = [
  { path: 'bak', loadChildren: () => import('./modules/bak/bak.module').then(m => m.BakModule), title: 'BAK' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
