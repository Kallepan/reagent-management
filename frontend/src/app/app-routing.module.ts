import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Add routes with labels to display in the menu
const routes: Routes = [
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
