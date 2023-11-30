import { NgModule } from '@angular/core';

import { PCRStateHandlerService } from './services/pcrstate-handler.service';
import { RemovalService } from './services/removal.service';
import { KindService } from './services/kind.service';
import { DeviceService } from './services/device.service';
import { AnalysisService } from './services/analysis.service';


@NgModule({
    providers: [
        PCRStateHandlerService,
        RemovalService,
        KindService,
        DeviceService,
        AnalysisService,
    ],
})
export class PcrModule { }
