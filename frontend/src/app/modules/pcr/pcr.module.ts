import { NgModule } from '@angular/core';

import { AnalysisService } from './services/analysis.service';
import { BatchAPIService } from './services/batch-api.service';
import { DeviceService } from './services/device.service';
import { KindService } from './services/kind.service';
import { PCRStateHandlerService } from './services/pcrstate-handler.service';
import { RemovalService } from './services/removal.service';


@NgModule({
    providers: [
        PCRStateHandlerService,
        RemovalService,
        KindService,
        DeviceService,
        AnalysisService,
        BatchAPIService,
    ],
})
export class PcrModule { }
