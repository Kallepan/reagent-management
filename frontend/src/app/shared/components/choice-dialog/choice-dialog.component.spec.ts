import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChoiceDialogComponent } from './choice-dialog.component';

describe('ChoiceDialogComponent', () => {
  let component: ChoiceDialogComponent;
  let fixture: ComponentFixture<ChoiceDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ChoiceDialogComponent>>;
  let mockData: { title: string; choices: any[] };

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj<MatDialogRef<ChoiceDialogComponent>>([
      'close',
    ]);
    mockData = {
      title: 'TEST',
      choices: [
        {
          id: '1',
          name: 'TEST',
        },
        {
          id: '2',
          name: 'TEST',
        },
      ],
    };

    TestBed.configureTestingModule({
      imports: [ChoiceDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    });
    fixture = TestBed.createComponent(ChoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('title should be set', () => {
    expect(component.title).toEqual(mockData.title);
  });

  it('#onAbort should close the dialog', () => {
    component.onAbort();
    expect(component.dialogRef.close).toHaveBeenCalledWith(null);
  });

  it('should have as many buttons as choices', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    // length of buttons should be equal to the number of choices + 1 (for the abort button)
    expect(buttons.length).toEqual(mockData.choices.length + 1);
  });

  it('should have a cancel button', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    // length of buttons should be equal to the number of choices + 1 (for the abort button)
    expect(buttons.length).toEqual(mockData.choices.length + 1);
  });

  it('cancel button should not be present if displayCancel is false', () => {
    component.displayCancel = false;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    // length of buttons should be equal to the number of choices
    expect(buttons.length).toEqual(mockData.choices.length);
  });
});
