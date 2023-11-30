import { DestroyRef, Injectable, inject } from '@angular/core';
import { KindService } from './kind.service';
import { NotificationService } from '@app/core/services/notification.service';
import { DeviceService } from './device.service';
import { AnalysisService } from './analysis.service';
import { RemovalService } from './removal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { Analysis, Device, Kind } from '../interfaces/simple';
import { Reagent } from '../interfaces/reagent';

@Injectable({
  providedIn: null
})
export class PCRStateHandlerService {
  // system-wide loading state
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef)

  // Module specific loading state
  private kindAPIService = inject(KindService);
  private deviceAPIService = inject(DeviceService);
  private analysisAPIService = inject(AnalysisService);
  private removalAPIService = inject(RemovalService);

  // Module specific data
  kinds = new BehaviorSubject<Kind[]>([]);
  devices = new BehaviorSubject<Device[]>([]);
  analyses = new BehaviorSubject<Analysis[]>([]);
  reagents = new BehaviorSubject<Reagent[]>([]);

  constructor() {
    this.refreshData();
  }

  private refreshData() {
    this.kindAPIService.getKinds().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((kinds) => {
      this.kinds.next(kinds);
    });
    this.deviceAPIService.getDevices().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((devices) => {
      this.devices.next(devices);
    });
    this.analysisAPIService.getAnalyses().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((analyses) => {
      this.analyses.next(analyses);
    });
  }
}
