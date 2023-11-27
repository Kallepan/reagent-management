import { TestBed } from '@angular/core/testing';

import { BakStateHandlerService } from './bak-state-handler.service';
import { TypeAPIService } from './type-api.service';
import { LotAPIService } from './lot-api.service';
import { LocationAPIService } from './location-api.service';
import { ReagentAPIService } from './reagent-api.service';
import { of } from 'rxjs';
import { NotificationService } from '@app/core/services/notification.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

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
    reagentAPIService = jasmine.createSpyObj('ReagentAPIService', ['getReagents', 'patchReagent']);

    typeAPIService.getTypes.and.returnValue(of([]));
    lotAPIService.getLots.and.returnValue(of([]));
    locationAPIService.getLocations.and.returnValue(of([]));

    lotAPIService.postLot.and.returnValue(of(mockLot));
    lotAPIService.deleteLot.and.returnValue(of({} as any));

    TestBed.configureTestingModule({
      imports: [
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
        },
        provideHttpClientTesting(),
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

  it('patched reagent is not present and shoult not throw error', () => {
    const mockReagent = {
      id: 123456,
      lot: {
        id: 123456,
      },
      amount: 1000,
    } as any;

    expect(service.lots.value).toEqual([]);

    reagentAPIService.patchReagent.and.returnValue(of(mockReagent));

    service.patchReagentInList(mockReagent.id, 123);
  });

  it('patch reagent should update value if present in array', () => {
    const mockLot = {
      id: "123456",
      reagents: [
        {
          id: "123456",
          amount: 1000,
        }
      ]
    } as any;

    const mockResponse = {
      id: "123456",
      amount: 123,
      lot: {
        id: "123456",
      }
    } as any;

    service.lots.next([mockLot]);
    reagentAPIService.patchReagent.and.returnValue(of(mockResponse));

    // The value passed to patchReagent is not important, only the id is used.
    service.patchReagentInList(mockResponse.id, -1);

    expect(service.lots.value[0].reagents[0].amount).toEqual(mockResponse.amount);
  });

  it('should handle patching reagent in single lot', () => {
    const mockLot = {
      id: "123456",
      reagents: [
        {
          id: "123456",
          amount: 1000,
        }
      ]
    } as any;

    const mockResponse = {
      id: "123456",
      amount: 123,
      lot: {
        id: "123456",
      }
    } as any;

    service.activeLot.next(mockLot);
    reagentAPIService.patchReagent.and.returnValue(of(mockResponse));

    // The value passed to patchReagent is not important, only the id is used.
    service.patchReagentSingle(mockResponse.id, -1);

    expect(service.activeLot.value!.reagents[0].amount).toEqual(mockResponse.amount);
  });

  it('should handle patching reagent in single lot when active lot is null', () => {
    const mockResponse = {
      id: "123456",
      amount: 123,
      lot: {
        id: "123456",
      }
    } as any;

    service.activeLot.next(null);
    reagentAPIService.patchReagent.and.returnValue(of(mockResponse));

    // The value passed to patchReagent is not important, only the id is used.
    service.patchReagentSingle(mockResponse.id, -1);

    expect(service.activeLot.value).toBeNull();
  });
});
