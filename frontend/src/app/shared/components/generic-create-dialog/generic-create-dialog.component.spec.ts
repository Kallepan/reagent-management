import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CreateDialogData, GenericCreateDialogComponent } from './generic-create-dialog.component';

describe('GenericCreateDialogComponent', () => {
  let component: GenericCreateDialogComponent;
  let fixture: ComponentFixture<GenericCreateDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<GenericCreateDialogComponent>>;
  let mockData: CreateDialogData;

  beforeEach(async () => {
    const fb = new FormBuilder();
    mockDialogRef = jasmine.createSpyObj<MatDialogRef<GenericCreateDialogComponent>>(['close']);
    mockData = {
      title: 'TEST',
      formControlInfos: [
        {
          label: 'TEST',
          type: 'text',
          hint: 'TEST',
          controlName: 'TEST',
          errors: {
            required: 'TEST is required',
          },
        }
      ],
      formGroup: fb.group({
        TEST: new FormControl('TEST', []),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        GenericCreateDialogComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('title should be set and displayed', () => {
    expect(component.title).toEqual(mockData.title);
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain(mockData.title);
  });

  it('formControlInfos should be set', () => {
    expect(component.formControlInfos).toEqual(mockData.formControlInfos);
  });

  it('formGroup should be set', () => {
    expect(component.formGroup).toEqual(mockData.formGroup);
  });

  it('should display required error message', async () => {
    // Fetch formControlInfo
    const formControlInfo = mockData.formControlInfos[0];

    // Fetch formControl
    const formControl = component.formGroup.get(formControlInfo.controlName);

    // Set formControl to invalid
    formControl!.markAsTouched();
    formControl!.setErrors({ required: true });

    // Update view
    fixture.detectChanges();
    await fixture.whenStable();

    // Fetch error message
    const compiled = fixture.nativeElement;
    const errorMessage = compiled.querySelector('mat-error');

    // Expect error message to be displayed
    expect(errorMessage).toBeTruthy();
    expect(errorMessage!.textContent).toContain(formControlInfo.errors.required);
  });
});
