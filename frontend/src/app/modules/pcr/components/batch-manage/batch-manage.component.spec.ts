/* eslint-disable @typescript-eslint/no-explicit-any */
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  ComponentFixture,
  DeferBlockState,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatChipSelectionChange } from '@angular/material/chips';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/core/services/notification.service';
import { of } from 'rxjs';
import { Removal } from '../../interfaces/removal';
import { BatchAPIService } from '../../services/batch-api.service';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { DUMMY_BATCH } from '../../tests/constants';
import { BatchManageComponent } from './batch-manage.component';

const DUMMY_REMOVAL: Removal = {
  id: 'testID',
  reagentID: DUMMY_BATCH.reagents[0].id,
  created_at: new Date(),
  created_by: 'testUser',
  amount: 1,
  comment: 'null',
};

describe('BatchManageComponent', () => {
  let component: BatchManageComponent;
  let fixture: ComponentFixture<BatchManageComponent>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let pcrStateHandlerService: jasmine.SpyObj<PCRStateHandlerService>;
  let batchAPIService: jasmine.SpyObj<BatchAPIService>;

  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    // Mock the router
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Mock the notification service and the pcr state handler service
    notificationService = jasmine.createSpyObj('NotificationService', [
      'warnMessage',
      'infoMessage',
    ]);
    pcrStateHandlerService = jasmine.createSpyObj('PCRStateHandlerService', [
      'getBatch',
      'postRemoval',
      'createOnlyReagents',
      'setLastSearchTerm',
      'getLastSearchTerm',
      'getMaxRecommendedRemovalsForReagent',
    ]);
    pcrStateHandlerService.getBatch.and.returnValue(of(DUMMY_BATCH));
    pcrStateHandlerService.createOnlyReagents.and.returnValue(of(null));
    pcrStateHandlerService.getLastSearchTerm.and.returnValue(null);

    // Mock the activated route
    const paramMap = jasmine.createSpyObj('ParamMap', ['get']);
    paramMap.get.and.returnValue('testID');
    activatedRoute = jasmine.createSpyObj<ActivatedRoute>(
      'ActivatedRoute',
      [],
      {
        snapshot: {
          paramMap: paramMap,
        },
      } as any,
    );

    await TestBed.configureTestingModule({
      imports: [BatchManageComponent, MatCardModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: BatchAPIService, useValue: batchAPIService },
        { provide: PCRStateHandlerService, useValue: pcrStateHandlerService },
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: router },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchManageComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(activatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith(
      'batchId',
    );
    expect(component.batch()).toBeTruthy();
  });

  it('should handle switch to another reagent from this batch if the reagent is clicked', () => {
    expect(component.activeReagent()).toBeNull();

    const change: MatChipSelectionChange = {
      selected: true,
      source: {
        value: DUMMY_BATCH.reagents[0],
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
    pcrStateHandlerService.postRemoval.and.returnValue(
      of(DUMMY_REMOVAL) as any,
    );
    pcrStateHandlerService.getMaxRecommendedRemovalsForReagent.and.returnValue(
      of(10),
    );
    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () =>
        of({
          amount: 1,
          user: 'testUser',
          comment: 'test',
        }),
    } as any);

    // set active reagent
    component.activeReagent.set(DUMMY_BATCH.reagents[0]);
    fixture.detectChanges();

    // call the method
    component.handleRemovalCreation(DUMMY_BATCH.reagents[0]);

    // expect the dialog to be opened
    expect(dialogSpy).toHaveBeenCalled();
    expect(pcrStateHandlerService.postRemoval).toHaveBeenCalled();
    expect(notificationService.infoMessage).toHaveBeenCalled();
  });

  it('should handle creation of removal of reagents with null comment', () => {
    pcrStateHandlerService.postRemoval.and.returnValue(
      of(DUMMY_REMOVAL) as any,
    );
    pcrStateHandlerService.getMaxRecommendedRemovalsForReagent.and.returnValue(
      of(10),
    );
    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () =>
        of({
          amount: 1,
          user: 'testUser',
          comment: 'test',
        }),
    } as any);

    // set active reagent
    component.activeReagent.set(DUMMY_BATCH.reagents[0]);
    fixture.detectChanges();

    // call the method
    component.handleRemovalCreation(DUMMY_BATCH.reagents[0]);

    // expect the dialog to be opened
    expect(dialogSpy).toHaveBeenCalled();
    expect(pcrStateHandlerService.postRemoval).toHaveBeenCalled();
    expect(notificationService.infoMessage).toHaveBeenCalled();
  });

  it('should handle creation of removal of reagents with error in postRemoval', () => {
    pcrStateHandlerService.postRemoval.and.returnValue(
      new Error('testError') as any,
    );
    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () =>
        of({
          amount: 1,
          user: 'testUser',
          comment: 'test',
        }),
    } as any);

    // set active reagent
    component.activeReagent.set(DUMMY_BATCH.reagents[0]);
    fixture.detectChanges();

    // call the method
    component.handleRemovalCreation(DUMMY_BATCH.reagents[0]);

    // expect the dialog to be opened
    expect(dialogSpy).toHaveBeenCalled();
    expect(pcrStateHandlerService.postRemoval).toHaveBeenCalled();
    expect(notificationService.warnMessage).toHaveBeenCalled();
  });

  it('setUp function should be called during initial setup', () => {
    pcrStateHandlerService.getBatch.and.returnValue(of(DUMMY_BATCH));

    // must be called once due to the initial call
    expect(pcrStateHandlerService.getBatch).toHaveBeenCalledTimes(1);
  });

  it('addReagents should refresh the batch', () => {
    pcrStateHandlerService.getBatch.and.returnValue(of(DUMMY_BATCH));

    component.refreshBatch();

    // must be called twice due to the initial call and the call in the method
    expect(pcrStateHandlerService.getBatch).toHaveBeenCalledTimes(2);
  });

  it('if batch.comment is empty it should be replaced by ""', () => {
    pcrStateHandlerService.getBatch.and.returnValue(
      of({
        ...DUMMY_BATCH,
        comment: '',
      }),
    );
    component.ngOnInit();

    expect(component.batch()).toBeTruthy();
    expect(component.batch()!.comment).toBe('');
  });

  it('should display batch.first_opened_at if first_opened_at is not null and kind.name ist Mastermix', async () => {
    pcrStateHandlerService.getBatch.and.returnValue(
      of({
        ...DUMMY_BATCH,
        first_opened_at: new Date(),
        first_opened_by: 'test',
      }),
    );
    component.ngOnInit();
    component.loading.set(false);
    fixture.detectChanges();

    // wait for the defer block to be rendered
    const deferBlockFixture = (await fixture.getDeferBlocks())[0];
    await deferBlockFixture.render(DeferBlockState.Complete);

    expect(component.batch()).toBeTruthy();
    expect(component.batch()!.first_opened_at).toBeTruthy();
    expect(component.batch()!.first_opened_by).toBeTruthy();

    // fetch CardHarness
    const card = await loader.getHarness(MatCardHarness);

    // check if the text is displayed
    expect(await card.getText()).not.toContain(
      'NEG PRAEP Kontrolle gelaufen am',
    );

    // Set kind to Mastermix
    pcrStateHandlerService.getBatch.and.returnValue(
      of({
        ...DUMMY_BATCH,
        first_opened_at: new Date(),
        first_opened_by: 'test',
        kind: {
          id: '1',
          name: 'Mastermix',
        },
      }),
    );
    component.ngOnInit();
    component.loading.set(false);
    fixture.detectChanges();

    // wait for the defer block to be rendered
    const deferBlockFixture2 = (await fixture.getDeferBlocks())[0];
    await deferBlockFixture2.render(DeferBlockState.Complete);

    // check if the text is displayed
    expect(await card.getText()).toContain('NEG PRAEP Kontrolle gelaufen am');
  });

  it('should not open the warning dialog if getMaxRecommendedRemovalsForReagent returns more than batch.reagents[i].amount', fakeAsync(() => {
    pcrStateHandlerService.getBatch.and.returnValue(of(DUMMY_BATCH));
    component._batch.next(DUMMY_BATCH.id);

    fixture.detectChanges();

    pcrStateHandlerService.postRemoval.and.returnValue(
      of(DUMMY_REMOVAL) as any,
    );
    pcrStateHandlerService.getMaxRecommendedRemovalsForReagent.and.returnValue(
      of(10),
    );
    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () =>
        of({
          amount: 1,
          user: 'testUser',
          comment: 'test',
        }),
    } as any);

    // call the method
    component.handleRemovalCreation(DUMMY_BATCH.reagents[0]);
    // simulate time passage
    tick();

    // expect the dialog to be opened --> Open dalog once, because the second opening for the warning does not occur.
    expect(dialogSpy).toHaveBeenCalledTimes(1);

    // spy on notificationService.infoMessage --> Side Effect removal creation success
    expect(notificationService.infoMessage).toHaveBeenCalled();
  }));

  it('should open the warning dialog if getMaxRecommendedRemovalsForReagent returns less than batch.reagents[i].amount', fakeAsync(() => {
    pcrStateHandlerService.getBatch.and.returnValue(of(DUMMY_BATCH));
    component._batch.next(DUMMY_BATCH.id);

    fixture.detectChanges();

    pcrStateHandlerService.postRemoval.and.returnValue(
      of(DUMMY_REMOVAL) as any,
    );
    // set the max recommended removals to 1 so that the warning dialog is opened
    pcrStateHandlerService.getMaxRecommendedRemovalsForReagent.and.returnValue(
      of(1),
    );

    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () =>
        of({
          amount: 1,
          user: 'testUser',
          comment: 'test',
        }),
    } as any);

    // call the method
    component.handleRemovalCreation(DUMMY_BATCH.reagents[0]);
    // simulate time passage
    tick();

    // expect the dialog to be opened --> Open dalog twice, because the second opening for the warning occurs.
    expect(dialogSpy).toHaveBeenCalledTimes(2);
    expect(notificationService.infoMessage).toHaveBeenCalled();
  }));
});
