import { NgModule } from '@angular/core';

import { LocationAPIService } from './services/location-api.service';
import { TypeAPIService } from './services/type-api.service';
import { LotAPIService } from './services/lot-api.service';
import { BakStateHandlerService } from './services/bak-state-handler.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ReagentAPIService } from './services/reagent-api.service';

@NgModule({
    providers: [
        BakStateHandlerService,
        LocationAPIService,
        TypeAPIService,
        LotAPIService,
        ReagentAPIService,
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'de-DE',
        },
    ],
})
export class BakModule {

}
