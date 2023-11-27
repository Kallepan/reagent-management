import { NgModule } from '@angular/core';

import { PCRStateHandlerService } from './services/pcrstate-handler.service';


@NgModule({
    providers: [
        PCRStateHandlerService
    ],
})
export class PcrModule { }
