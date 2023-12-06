import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatChipSelectionChange } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/core/services/notification.service';
import { of } from 'rxjs';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { DUMMY_BATCH } from '../../tests/constants';
import { BatchManageComponent } from './batch-manage.component';


describe('BatchManageComponent', () => {
  let component: BatchManageComponent;
  let fixture: ComponentFixture<BatchManageComponent>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let pcrStateHandlerService: jasmine.SpyObj<PCRStateHandlerService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock the router
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Mock the notification service and the pcr state handler service
    notificationService = jasmine.createSpyObj('NotificationService', ['warnMessage', 'infoMessage']);
    pcrStateHandlerService = jasmine.createSpyObj('PCRStateHandlerService', ['getBatch', 'postRemoval']);
    pcrStateHandlerService.getBatch.and.returnValue(of(DUMMY_BATCH));

    // Mock the activated route
    let paramMap = jasmine.createSpyObj('ParamMap', ['get']);
    paramMap.get.and.returnValue('testID');
    activatedRoute = jasmine.createSpyObj<any>('ActivatedRoute', [], {
      snapshot: {
        paramMap: paramMap
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        BatchManageComponent,
        MatCardModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: PCRStateHandlerService, useValue: pcrStateHandlerService },
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(activatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('batchId');
    expect(component.batch()).toBeTruthy();
  });

  it('should handle switch to another reagent from this batch if the reagent is clicked', () => {
    expect(component.activeReagent()).toBeNull();

    const change: MatChipSelectionChange = {
      selected: true,
      source: {
        value: DUMMY_BATCH.reagents[0]
      } as any,
      isUserInput: true,
    };

    component.handleReagentSelectionChange(change);
    expect(component.activeReagent()).toEqual(DUMMY_BATCH.reagents[0]);
  });


  it('should filter out null values for _batch', () => {
    // reset calls
    router.navigate.calls.reset();

    // set the batch to null
    component._batch.next(null);
    fixture.detectChanges();

    // check if the method was called
    expect(router.navigate).not.toHaveBeenCalled();
    expect(notificationService.warnMessage).not.toHaveBeenCalled();
  });

  it('should handle returned null values for _batch', () => {
    // set pcrStateHandlerService.getBatch to return null
    pcrStateHandlerService.getBatch.and.returnValue(of(null) as any);

    // reset component
    component.ngOnInit();
    fixture.detectChanges();

    // expect the method to be called
    expect(notificationService.warnMessage).toHaveBeenCalled();
  });

  it('should handle creation of removal of reagents', () => {
    pcrStateHandlerService.postRemoval.and.returnValue(of(null) as any);
    const spy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of({
        amount: 1,
        user: 'testUser',
      }),
    } as any);
    // set active reagent
    component.activeReagent.set(DUMMY_BATCH.reagents[0]);
    fixture.detectChanges();

    // call the method
    component.handleRemovalCreation(DUMMY_BATCH.reagents[0]);

    // expect the dialog to be opened
    expect(spy).toHaveBeenCalled();
    expect(pcrStateHandlerService.postRemoval).toHaveBeenCalled();
  });
});
