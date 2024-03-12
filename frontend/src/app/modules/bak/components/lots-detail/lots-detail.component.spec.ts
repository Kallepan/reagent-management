import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { BakLot, BakLotReagent } from '../../interfaces/lot';
import { Product } from '../../interfaces/type';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { LotAPIService } from '../../services/lot-api.service';
import { LotsDetailComponent } from './lots-detail.component';

describe('LotsDetailComponent', () => {
  let component: LotsDetailComponent;
  let fixture: ComponentFixture<LotsDetailComponent>;
  let bakStateHandlerService: jasmine.SpyObj<BakStateHandlerService>;
  let lotAPIService: jasmine.SpyObj<LotAPIService>;

  beforeEach(() => {
    bakStateHandlerService = jasmine.createSpyObj(
      'BakStateHandlerService',
      ['getTypes', 'getLots', 'getLocations', 'getReagents'],
      {
        lots: new BehaviorSubject([]),
        activeLot: new BehaviorSubject({}),
      },
    );
    lotAPIService = jasmine.createSpyObj('LotAPIService', ['getLots', 'deleteLot', 'getLotById']);

    const dummyLot: BakLot = {
      id: '1',
      name: 'Test',
      product: {
        id: '1',
        name: 'Test',
        producer: {
          name: 'Test',
          id: '1',
          created_at: new Date(),
        },
        type: {
          name: 'Test',
          id: '1',
          created_at: new Date(),
        },
        created_at: new Date(),
        created_by: 'Test',
      } as Product,
      reagents: [] as BakLotReagent[],
      valid_from: '2021-01-01',
      valid_until: '2021-01-01',
      created_at: new Date(),
      created_by: 'Test',
      totalAmount: 0,
    };

    lotAPIService.getLotById.and.returnValue(of(dummyLot));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule, LotsDetailComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: BakStateHandlerService,
          useValue: bakStateHandlerService,
        },
        {
          provide: LotAPIService,
          useValue: lotAPIService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(LotsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(lotAPIService.getLotById).toHaveBeenCalled();
  });
});
