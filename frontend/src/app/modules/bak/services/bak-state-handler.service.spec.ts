import { TestBed } from '@angular/core/testing';

import { BakStateHandlerService } from './bak-state-handler.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TypeAPIService } from './type-api.service';
import { LotAPIService } from './lot-api.service';
import { LocationAPIService } from './location-api.service';
import { ReagentAPIService } from './reagent-api.service';
import { of } from 'rxjs';
import { NotificationService } from '@app/core/services/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('BakStateHandlerService', () => {
  let service: BakStateHandlerService;
  let httpMock: HttpTestingController;
  const typeAPIService = jasmine.createSpyObj('TypeAPIService', ['getTypes']);
  const lotAPIService = jasmine.createSpyObj('LotAPIService', ['getLots']);
  const locationAPIService = jasmine.createSpyObj('LocationAPIService', ['getLocations']);
  const reagentAPIService = jasmine.createSpyObj('ReagentAPIService', ['getReagents']);

  locationAPIService.getLocations.and.returnValue(of([]));
  typeAPIService.getTypes.and.returnValue(of([]));
  lotAPIService.getLots.and.returnValue(of([]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        BakStateHandlerService,
        NotificationService,
        {
          provide: TypeAPIService,
          useValue: typeAPIService,
        },
        {
          provide: LotAPIService,
          useValue: lotAPIService,
        },
        {
          provide: LocationAPIService,
          useValue: locationAPIService,
        },
        {
          provide: ReagentAPIService,
          useValue: reagentAPIService,
        }
      ]
    });
    service = TestBed.inject(BakStateHandlerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
