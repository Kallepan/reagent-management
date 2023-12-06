import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/core/services/notification.service';
import { of } from 'rxjs';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { DUMMY_BATCH } from '../../tests/constants';
import { BatchListComponent } from './batch-list.component';

describe('BatchListComponent', () => {
  let component: BatchListComponent;
  let fixture: ComponentFixture<BatchListComponent>;

  let notificationService: jasmine.SpyObj<NotificationService>;
  let pcrStateHandlerService: jasmine.SpyObj<PCRStateHandlerService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    notificationService = jasmine.createSpyObj('NotificationService', ['warnMessage', 'infoMessage']);
    pcrStateHandlerService = jasmine.createSpyObj('PCRStateHandlerService', ['refreshData', 'searchBatch']);
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', ['']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BatchListComponent],
      providers: [
        provideHttpClient(),
        provideNoopAnimations(),
        { provide: NotificationService, useValue: notificationService },
        { provide: PCRStateHandlerService, useValue: pcrStateHandlerService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searchReagents should call notificationService.warnMessage if no batches are found', () => {
    const searchTerm = 'searchTerm';
    pcrStateHandlerService.searchBatch.and.returnValue(of([]));
    component.searchReagents(searchTerm);
    expect(notificationService.warnMessage).toHaveBeenCalled();
  });

  it('searchReagens should not call notificationService.warnMessage if batches are found', () => {
    const searchTerm = 'searchTerm';
    pcrStateHandlerService.searchBatch.and.returnValue(of([DUMMY_BATCH]));
    component.searchReagents(searchTerm);
    expect(notificationService.warnMessage).not.toHaveBeenCalled();
  });

  it('searchReagents should navigate to the first batch if batches are found', () => {
    const searchTerm = 'searchTerm';
    pcrStateHandlerService.searchBatch.and.returnValue(of([DUMMY_BATCH]));
    component.searchReagents(searchTerm);
    expect(router.navigate).toHaveBeenCalledWith(['pcr', 'batch', DUMMY_BATCH.id]);
  });

  it('should handle multiple results with valid choice', () => {
    // create spy object
    const spy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of({
        id: DUMMY_BATCH.id,
      }),
    } as any);

    // call function
    const searchTerm = DUMMY_BATCH.reagents[0].id;
    pcrStateHandlerService.searchBatch.and.returnValue(of([DUMMY_BATCH, DUMMY_BATCH]));
    component.searchReagents(searchTerm);

    // check if the dialog was opened
    expect(spy).toHaveBeenCalled();

    // check if the router was called
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should handle multiple results with null choice', () => {
    // create spy object
    const spy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(null),
    } as any);

    // call function
    const searchTerm = DUMMY_BATCH.reagents[0].id;
    pcrStateHandlerService.searchBatch.and.returnValue(of([DUMMY_BATCH, DUMMY_BATCH]));
    component.searchReagents(searchTerm);

    // check if the dialog was opened
    expect(spy).toHaveBeenCalled();

    // check if the router was called
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
