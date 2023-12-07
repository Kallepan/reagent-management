import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ControlContainer,
  FormArray,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ReagentCreateComponent } from './reagent-create.component';
import { BatchAPIService } from '@app/modules/pcr/services/batch-api.service';
import { of } from 'rxjs';

describe('ReagentCreateComponent', () => {
  let component: ReagentCreateComponent;
  let fixture: ComponentFixture<ReagentCreateComponent>;
  let fgd: FormGroupDirective;
  let fg: FormGroup;
  let batchAPIService: jasmine.SpyObj<BatchAPIService>;

  beforeEach(async () => {
    batchAPIService = jasmine.createSpyObj('BatchAPIService', [
      'checkIfReagentExists',
    ]);

    fg = new FormGroup({
      reagents: new FormArray([]),
    });
    fgd = new FormGroupDirective([], []);
    fgd.form = fg;

    await TestBed.configureTestingModule({
      imports: [ReagentCreateComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: ControlContainer,
          useValue: fgd,
        },
        {
          provide: BatchAPIService,
          useValue: batchAPIService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReagentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.parentFormGroup).toBe(fg);
  });

  it('should add reagent', () => {
    component.addReagentForm();
    // one form is added by default
    expect(component.reagents.length).toBe(2);
  });

  it('should remove reagent', () => {
    component.addReagentForm();
    component.removeReagentForm(0);

    // one form is added by default
    expect(component.reagents.length).toBe(1);
  });

  it('addButton should call addReagentForm', () => {
    spyOn(component, 'addReagentForm');
    const addButton =
      fixture.debugElement.nativeElement.querySelector('.add-button');
    addButton.click();
    expect(component.addReagentForm).toHaveBeenCalled();
  });

  it('submitButton should call submitEventEmitter', () => {
    spyOn(component.onSubmit, 'emit');
    const submitButton =
      fixture.debugElement.nativeElement.querySelector('.submit-button');
    submitButton.click();
    expect(component.onSubmit.emit).toHaveBeenCalled();
  });

  it('removeButton should call removeReagentForm', () => {
    spyOn(component, 'removeReagentForm');
    const removeButton =
      fixture.debugElement.nativeElement.querySelector('.remove-button');
    removeButton.click();
    expect(component.removeReagentForm).toHaveBeenCalled();
  });

  it('form should be valid if input is correct', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(true));

    const input = 'RTS000ING|U0000-000|000000|000000000';

    component.addReagentForm();
    const reagent = component.getReagent(0);
    reagent.controls['id'].setValue(input);

    expect(reagent.valid).toBeTruthy();
  });

  it('form should be invalid if input is empty', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(true));

    const input = '';

    // set value via html input
    const inputElement =
      fixture.debugElement.nativeElement.querySelector('.input-element');
    inputElement.value = input;
    inputElement.dispatchEvent(new Event('input'));

    expect(component.reagents.controls[0].valid).toBeFalsy();
    expect(component.reagents.controls[0].value).toEqual({ id: input });
    expect(component.reagents.controls[0].disabled).toBeFalsy();
  });

  it('should disable input if input is valid', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(true));

    const input = 'RTS000ING|U0000-000|000000|000000000';

    expect(component.reagents.controls[0].enabled).toBeTruthy();

    // set value via html input
    const inputElement =
      fixture.debugElement.nativeElement.querySelector('.input-element');
    inputElement.value = input;
    inputElement.dispatchEvent(new Event('input'));

    expect(component.reagents.controls[0].disabled).toBeTruthy();
    expect(component.reagents.controls[0].value).toEqual({ id: input });
    expect(component.reagents.controls[0].valid).toBeFalsy();
  });

  it('should enable input if input is invalid', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(true));

    const input = 'RTS000ING|U0000-000|000000|000000000';

    // set value via html input
    const inputElement =
      fixture.debugElement.nativeElement.querySelector('.input-element');
    inputElement.value = input;
    inputElement.dispatchEvent(new Event('input'));

    expect(component.reagents.controls[0].disabled).toBeTruthy();
    expect(component.reagents.controls[0].value).toEqual({ id: input });
    expect(component.reagents.controls[0].valid).toBeFalsy();

    // set value via html input
    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.reagents.controls[0].enabled).toBeTruthy();
    expect(component.reagents.controls[0].value).toEqual({ id: '' });
    expect(component.reagents.controls[0].valid).toBeFalsy();
  });
});
