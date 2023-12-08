import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NotificationService } from '@app/core/services/notification.service';
import { BehaviorSubject, of } from 'rxjs';
import { Analysis, Device, Kind } from '../../interfaces/simple';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { BatchCreateComponent } from './batch-create.component';
import { BatchAPIService } from '../../services/batch-api.service';

const mockAnalyses: Analysis[] = [{ name: 'dummy', id: '1' }];
const mockDevices: Device[] = [{ name: 'dummy', id: '1' }];
const mockKinds: Kind[] = [{ name: 'dummy', id: '1' }];

describe('BatchCreateComponent', () => {
  let component: BatchCreateComponent;
  let fixture: ComponentFixture<BatchCreateComponent>;
  let pcrStateHandlerService: jasmine.SpyObj<PCRStateHandlerService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let batchAPIService: jasmine.SpyObj<BatchAPIService>;

  beforeEach(async () => {
    batchAPIService = jasmine.createSpyObj('BatchAPIService', [
      'deleteBatch',
      'getBatch',
      'searchBatch',
    ]);

    pcrStateHandlerService = jasmine.createSpyObj(
      'PCRStateHandlerService',
      ['refreshData'],
      {
        analyses: new BehaviorSubject(mockAnalyses),
        devices: new BehaviorSubject(mockDevices),
        kinds: new BehaviorSubject(mockKinds),
      }
    );
    notificationService = jasmine.createSpyObj('NotificationService', [
      'warnMessage',
    ]);

    await TestBed.configureTestingModule({
      imports: [BatchCreateComponent, MatDialogModule],
      providers: [
        provideHttpClient(),
        provideNoopAnimations(),
        { provide: PCRStateHandlerService, useValue: pcrStateHandlerService },
        { provide: NotificationService, useValue: notificationService },
        { provide: BatchAPIService, useValue: batchAPIService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BatchCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button to continue should be disabled', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#firstContinueButton').disabled).toBe(true);
  });

  it('button to continue should be enabled', () => {
    // fill dummy values in form
    component.groupForm.controls.device.setValue('dummy');
    component.groupForm.controls.analysis.setValue('dummy');
    component.groupForm.controls.kind.setValue('dummy');
    component.groupForm.controls.amount.setValue(1);
    component.groupForm.controls.created_by.setValue('test');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#firstContinueButton').disabled).toBe(false);
  });

  it('should warn if submit is called with empty form', () => {
    component.submit();
    expect(notificationService.warnMessage).toHaveBeenCalled();
  });

  it('should warn if submit is called with invalid form', () => {
    // fill dummy values in form
    component.groupForm.controls.device.setValue('dummy');
    component.groupForm.controls.analysis.setValue('dummy');
    component.groupForm.controls.kind.setValue('dummy');
    component.groupForm.controls.amount.setValue(0);
    fixture.detectChanges();

    // reagentsform is still invalid

    component.submit();
    expect(notificationService.warnMessage).toHaveBeenCalled();
  });

  it('submit should not warn if form is valid', () => {
    // create dialogSpy
    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(null),
    } as any);

    // only fill groupForm
    component.groupForm.controls.device.setValue('dummy');
    component.groupForm.controls.analysis.setValue('dummy');
    component.groupForm.controls.kind.setValue('dummy');
    component.groupForm.controls.created_by.setValue('test');
    component.groupForm.controls.amount.setValue(1);

    // fill reagentsForm
    component.reagentsFormGroup.controls.reagents.setValue([{ id: 'dummy' }]);
    component.reagentsFormGroup.controls.reagents.controls[0].disable();
    fixture.detectChanges();

    component.submit();
    expect(notificationService.warnMessage).not.toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should not submit if no reagents are present', () => {
    // create dialogSpy
    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(null),
    } as any);

    // only fill groupForm
    component.groupForm.controls.device.setValue('dummy');
    component.groupForm.controls.analysis.setValue('dummy');
    component.groupForm.controls.kind.setValue('dummy');
    component.groupForm.controls.amount.setValue(1);

    // submit
    component.submit();

    // test
    expect(notificationService.warnMessage).toHaveBeenCalledTimes(1);
    expect(dialogSpy).toHaveBeenCalledTimes(0);
  });

  it('should not submit if reagentForm is not disabled', () => {
    // create dialogSpy
    const dialogSpy = spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(null),
    } as any);

    // fill groupForm
    component.groupForm.controls.device.setValue('dummy');
    component.groupForm.controls.analysis.setValue('dummy');
    component.groupForm.controls.kind.setValue('dummy');
    component.groupForm.controls.amount.setValue(1);

    // fill reagentsForm
    component.reagentsFormGroup.controls.reagents.setValue([{ id: 'dummy' }]);

    // submit
    component.submit();

    // test
    expect(notificationService.warnMessage).toHaveBeenCalledTimes(1);
    expect(dialogSpy).toHaveBeenCalledTimes(0);
  });
});
