import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleReagentCreateComponent } from './single-reagent-create.component';
import { BatchAPIService } from '../../services/batch-api.service';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { NotificationService } from '@app/core/services/notification.service';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DUMMY_BATCH } from '../../tests/constants';

describe('SingleReagentCreateComponent', () => {
  let component: SingleReagentCreateComponent;
  let fixture: ComponentFixture<SingleReagentCreateComponent>;
  let batchAPIService: jasmine.SpyObj<BatchAPIService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let pcrStateHandlerService: jasmine.SpyObj<PCRStateHandlerService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    batchAPIService = jasmine.createSpyObj('BatchAPIService', [
      'checkIfReagentExists',
    ]);
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

    await TestBed.configureTestingModule({
      imports: [SingleReagentCreateComponent],
      providers: [
        {
          provide: BatchAPIService,
          useValue: batchAPIService,
        },
        {
          provide: PCRStateHandlerService,
          useValue: pcrStateHandlerService,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleReagentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit button should be disabled when form is invalid', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(false));
    const submitButton = fixture.nativeElement.querySelector('button');

    expect(submitButton.disabled).toBeTrue();

    component.formGroup.controls.createdBy.setValue('test');
    component.formGroup.controls.reagentID.setValue(
      'RTS150ING|U0623-017|250131|230626882',
    );

    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalse();
  });

  it('should call checkIfReagentExists', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(true));
    component.formGroup.controls.createdBy.setValue('test');
    component.formGroup.controls.reagentID.setValue(
      'RTS150ING|U0623-017|250131|230626882',
    );

    fixture.detectChanges();

    expect(batchAPIService.checkIfReagentExists).toHaveBeenCalled();

    // button should be disabled
    const submitButton = fixture.nativeElement.querySelector('button');
    expect(submitButton.disabled).toBeTrue();
  });

  it('should call checkIfReagentExists when form is valid', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(false));
    component.formGroup.controls.createdBy.setValue('test');
    component.formGroup.controls.reagentID.setValue(
      'RTS150ING|U0623-017|250131|230626882',
    );

    fixture.detectChanges();

    expect(batchAPIService.checkIfReagentExists).toHaveBeenCalled();
  });

  it('should call createReagent when the submit button is clicked', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(false));
    component.formGroup.controls.createdBy.setValue('test');
    component.formGroup.controls.reagentID.setValue(
      'RTS150ING|U0623-017|250131|230626882',
    );

    fixture.detectChanges();

    spyOn(component, 'createReagent');
    const button =
      fixture.debugElement.nativeElement.querySelector('.submit-button');
    button.click();
    expect(component.createReagent).toHaveBeenCalled();
  });

  it('should have a form and formGroup', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.valid).toBeFalse();
  });

  it('should call createOnlyReagents when createReagent is called', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(false));
    pcrStateHandlerService.createOnlyReagents.and.returnValue(of(null));

    component.batch = DUMMY_BATCH;

    // set the formGroup
    component.formGroup.controls.createdBy.setValue('test');
    component.formGroup.controls.reagentID.setValue(
      'RTS150ING|U0623-017|250131|230626882',
    );

    component.createReagent();
    expect(pcrStateHandlerService.createOnlyReagents).toHaveBeenCalled();
    expect(notificationService.infoMessage).toHaveBeenCalled();
  });

  it('should call createOnlyReagents when createReagent is called with notification error', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(false));
    pcrStateHandlerService.createOnlyReagents.and.returnValue(
      throwError(() => {}),
    );

    component.batch = DUMMY_BATCH;

    // set the formGroup
    component.formGroup.controls.createdBy.setValue('test');
    component.formGroup.controls.reagentID.setValue(
      'RTS150ING|U0623-017|250131|230626882',
    );

    component.createReagent();
    expect(pcrStateHandlerService.createOnlyReagents).toHaveBeenCalled();
    expect(notificationService.warnMessage).toHaveBeenCalled();
  });
});
