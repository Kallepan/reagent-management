import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { Kind } from '../interfaces/simple';
import { AnalysisService } from './analysis.service';
import { BatchAPIService } from './batch-api.service';
import { DeviceService } from './device.service';
import { KindService } from './kind.service';
import { PCRStateHandlerService } from './pcrstate-handler.service';
import { RemovalService } from './removal.service';

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
  let batchAPIService: jasmine.SpyObj<BatchAPIService>;

  beforeEach(() => {
    removalService = jasmine.createSpyObj('RemovalService', ['remove']);
    kindService = jasmine.createSpyObj('KindService', ['getKinds']);
    deviceService = jasmine.createSpyObj('DeviceService', ['getDevices']);
    analysisService = jasmine.createSpyObj('AnalysisService', ['getAnalyses']);
    batchAPIService = jasmine.createSpyObj('BatchAPIService', ['searchBatch']);

    kindService.getKinds.and.returnValue(of(mockKinds));
    deviceService.getDevices.and.returnValue(of(mockDevices));
    analysisService.getAnalyses.and.returnValue(of(mockAnalyses));

    TestBed.configureTestingModule({
      providers: [
        PCRStateHandlerService,
        { provide: RemovalService, useValue: removalService },
        { provide: KindService, useValue: kindService },
        { provide: DeviceService, useValue: deviceService },
        { provide: AnalysisService, useValue: analysisService },
        { provide: BatchAPIService, useValue: batchAPIService },
      ],
    });
    service = TestBed.inject(PCRStateHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('lastSearchTerm should be null', () => {
    expect(service.getLastSearchTerm()).toBeNull();
  });
});
