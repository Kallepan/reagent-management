import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogData, ReagentTransferComponent } from './reagent-transfer.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

describe('ReagentTransferComponent', () => {
  let component: ReagentTransferComponent;
  let fixture: ComponentFixture<ReagentTransferComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ReagentTransferComponent>>;
  let mockData: DialogData;
  let loader: HarnessLoader;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj<MatDialogRef<ReagentTransferComponent>>(['close']);
    mockData = {
      reagents: [
        {
          id: '1',
          created_at: new Date().toISOString(),
          created_by: 'TEST',
          amount: 20,
          location: {
            id: '123456',
            name: 'TESTLocation',
            created_at: new Date().toISOString(),
          }
        },
        {
          id: '2',
          created_at: new Date().toISOString(),
          created_by: 'TEST',
          amount: 20,
          location: {
            id: '123456',
            name: 'TESTLocation',
            created_at: new Date().toISOString(),
          }
        },
        {
          id: '3',
          created_at: new Date().toISOString(),
          created_by: 'TEST',
          amount: 0,
          location: {
            id: '123456',
            name: 'TESTLocation',
            created_at: new Date().toISOString(),
          }
        }
      ]
    };

    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
      declarations: [ReagentTransferComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData,
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReagentTransferComponent);
    component = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on abort', () => {
    component.onAbort();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should disable OK button when form is invalid', () => {
    const button = fixture.debugElement.query(By.css('#confirmButton')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('select valid reagents', () => {
    component.formGroup.get('sourceReagent')?.setValue('1');
    component.formGroup.get('targetReagent')?.setValue('2');
    component.formGroup.get('transferAmount')?.setValue(10);

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#confirmButton')).nativeElement;
    expect(button.disabled).toBeFalsy();
  });

  it('test selection harness', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    expect(options.length).toBe(3);
  });

  it('test selection harness, 0 reagents should be disabled', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    expect(options.length).toBe(3);
    expect(await options[2].isDisabled()).toBeTruthy();
  });

  it('test second selection harness, 0 reagents should be disabled', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    expect(options.length).toBe(3);
    expect(await options[2].isDisabled()).toBeTruthy();
  });
});
