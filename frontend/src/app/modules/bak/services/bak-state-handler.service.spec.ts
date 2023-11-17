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
import { Router } from '@angular/router';

describe('BakStateHandlerService', () => {
  let service: BakStateHandlerService;
  let httpMock: HttpTestingController;

  let typeAPIService: jasmine.SpyObj<TypeAPIService>;
  let lotAPIService: jasmine.SpyObj<LotAPIService>;
  let locationAPIService: jasmine.SpyObj<LocationAPIService>;
  let reagentAPIService: jasmine.SpyObj<ReagentAPIService>;


  const mockLot = { id: 123 } as any;

  beforeEach(() => {
    typeAPIService = jasmine.createSpyObj('TypeAPIService', ['getTypes']);
    lotAPIService = jasmine.createSpyObj('LotAPIService', ['getLots', 'postLot', 'deleteLot']);
    locationAPIService = jasmine.createSpyObj('LocationAPIService', ['getLocations']);
    reagentAPIService = jasmine.createSpyObj('ReagentAPIService', ['getReagents']);

    typeAPIService.getTypes.and.returnValue(of([]));
    lotAPIService.getLots.and.returnValue(of([]));
    locationAPIService.getLocations.and.returnValue(of([]));

    lotAPIService.postLot.and.returnValue(of(mockLot));
    lotAPIService.deleteLot.and.returnValue(of({} as any));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [
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
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    TestBed.runInInjectionContext(() => {
      service = new BakStateHandlerService();
    });

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('created lot should be added to lots', () => {
    service.createLot(mockLot);
    expect(service.lots.value).toContain(mockLot);
  });

  it('should navigate to /lots/detail/:id', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    service.createLot(mockLot);

    expect(navigateSpy).toHaveBeenCalledWith(['bak', 'lots', 'detail', mockLot.id]);
  });

  it('should delete lot', () => {
    service.createLot(mockLot);
    expect(service.lots.value).toContain(mockLot);

    service.deleteLot(mockLot.id);
    expect(service.lots.value).not.toContain(mockLot);
  });
});
