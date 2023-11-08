import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceDialogComponent } from './choice-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ChoiceDialogComponent', () => {
  let component: ChoiceDialogComponent<any>;
  let fixture: ComponentFixture<ChoiceDialogComponent<any>>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ChoiceDialogComponent<any>>>;
  let mockData: { title: string, choices: any[] };

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj<MatDialogRef<ChoiceDialogComponent<any>>>(['close']);
    mockData = {
      title: 'TEST',
      choices: [
        {
          id: '1',
          name: 'TEST'
        },
        {
          id: '2',
          name: 'TEST'
        }
      ]
    };

    TestBed.configureTestingModule({
      imports: [ChoiceDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
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
    spyOn(component.dialogRef, 'close');
    component.onAbort();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should have as many buttons as choices', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons.length).toEqual(mockData.choices.length);
  });
});
