import { NgModule } from '@angular/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BakStateHandlerService } from './services/bak-state-handler.service';
import { LocationAPIService } from './services/location-api.service';
import { ProductAPIService } from './services/product-api.service';
import { ReagentAPIService } from './services/reagent-api.service';

@NgModule({
  providers: [
    BakStateHandlerService,
    LocationAPIService,
    ProductAPIService,
    ReagentAPIService,
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE',
    },
  ],
})
export class BakModule {}
