import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PcrRoutingModule } from './pcr-routing.module';
import { PCRStateHandlerService } from './services/pcrstate-handler.service';
import { BatchCreateComponent } from './components/batch-create/batch-create.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PcrRoutingModule,
  ],
  providers: [
    PCRStateHandlerService
  ],
})
export class PcrModule { }
