import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/core/services/notification.service';
import { BehaviorSubject, Subject, of } from 'rxjs';
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
  let routeSubject: Subject<any>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'infoMessage',
      'warnMessage',
    ]);

    bakStateHandlerService = jasmine.createSpyObj(
      'BakStateHandlerService',
      ['getTypes', 'getLots', 'getLocations', 'getReagents', 'handleReagentTransfer'],
      {
        lots: new Subject(),
        activeLot: new BehaviorSubject(null),
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

    routeSubject = new Subject();
    TestBed.configureTestingModule({
      imports: [LotsDetailComponent],
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
            params: routeSubject,
          },
        },
        {
          provide: MatDialog,
          useValue: mockDialog,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    });
    fixture = TestBed.createComponent(LotsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(lotAPIService.getLotById).not.toHaveBeenCalled();

    // should display mat-spinner
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should call lotAPIService.getLotById when route changes', () => {
    routeSubject.next({ id: '1' });
    fixture.detectChanges();
    expect(lotAPIService.getLotById).toHaveBeenCalledWith('1');
  });

  it('should open dialog when edit button is clicked', () => {
    bakStateHandlerService.activeLot.next({
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
    });
    fixture.detectChanges();

    const openTransferDialogSpy = spyOn(component, 'openTransferDialog');

    const button = fixture.debugElement.query(By.css('#transfer-button'));
    button.nativeElement.click();

    expect(openTransferDialogSpy).toHaveBeenCalled();
  });

  it('should open dialog on openTranserDialog', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () =>
        of({
          transferAmount: 1,
          sourceReagent: '1',
          targetReagent: '2',
        }),
    } as any);
    bakStateHandlerService.activeLot.next({
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
      reagents: [
        {
          id: '1',
          amount: 1,
          location: {
            name: 'Test',
          },
        },
        {
          id: '2',
          amount: 1,
          location: {
            name: 'Test',
          },
        },
      ] as BakLotReagent[],
      valid_from: '2021-01-01',
      valid_until: '2021-01-01',
      created_at: new Date(),
      created_by: 'Test',
      totalAmount: 0,
    });
    fixture.detectChanges();

    component.openTransferDialog();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(bakStateHandlerService.handleReagentTransfer).toHaveBeenCalled();
  });
});
