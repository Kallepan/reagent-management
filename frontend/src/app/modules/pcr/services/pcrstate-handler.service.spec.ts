import { TestBed } from '@angular/core/testing';

import { PCRStateHandlerService } from './pcrstate-handler.service';
import { RemovalService } from './removal.service';
import { DeviceService } from './device.service';
import { KindService } from './kind.service';
import { AnalysisService } from './analysis.service';
import { Kind } from '../interfaces/simple';
import { of } from 'rxjs';

const mockKinds: Kind[] = [
  { name: 'kind1', id: '1' },
  { name: 'kind2', id: '2' },
];

const mockDevices = [
  { name: 'device1', id: '1' },
  { name: 'device2', id: '2' },
];

const mockAnalyses = [
  { name: 'ANA1', id: '1' },
  { name: 'ANA2', id: '2' },
];

describe('PCRStateHandlerService', () => {
  let service: PCRStateHandlerService;
  let removalService: jasmine.SpyObj<RemovalService>;
  let kindService: jasmine.SpyObj<KindService>;
  let deviceService: jasmine.SpyObj<DeviceService>;
  let analysisService: jasmine.SpyObj<AnalysisService>;

  beforeEach(() => {
    removalService = jasmine.createSpyObj('RemovalService', ['remove']);
    kindService = jasmine.createSpyObj('KindService', ['getKinds']);
    deviceService = jasmine.createSpyObj('DeviceService', ['getDevices']);
    analysisService = jasmine.createSpyObj('AnalysisService', ['getAnalyses']);

    kindService.getKinds.and.returnValue(of(mockKinds));
    deviceService.getDevices.and.returnValue(of(mockDevices));
    analysisService.getAnalyses.and.returnValue(of(mockAnalyses));

    TestBed.configureTestingModule({
      providers: [
        PCRStateHandlerService,
        { provide: RemovalService, useValue: removalService, },
        { provide: KindService, useValue: kindService, },
        { provide: DeviceService, useValue: deviceService, },
        { provide: AnalysisService, useValue: analysisService, },
      ]
    });
    service = TestBed.inject(PCRStateHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
