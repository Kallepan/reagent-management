import { TestBed, type ComponentFixture } from '@angular/core/testing';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { constants } from '@app/core/constants/constants';
import { BatchAPIService } from '@app/modules/pcr/services/batch-api.service';
import { of } from 'rxjs';
import { ReagentCreateComponent } from './reagent-create.component';

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
    const formArray = component.parentFormGroup.controls[
      component.controlKey
    ] as FormArray;

    component.addReagentFormGroup();
    // one form is added by default
    expect(formArray.length).toBe(2);
  });

  it('should remove reagent', () => {
    const formArray = component.parentFormGroup.controls[
      component.controlKey
    ] as FormArray;

    component.addReagentFormGroup();
    component.removeReagentFormGroup(0);

    // one form is added by default
    expect(formArray.length).toBe(1);
  });

  it('addButton should call addReagentForm', () => {
    spyOn(component, 'addReagentFormGroup');
    const addButton =
      fixture.debugElement.nativeElement.querySelector('.add-button');
    addButton.click();
    expect(component.addReagentFormGroup).toHaveBeenCalled();
  });

  it('submitButton should call submitEventEmitter', () => {
    spyOn(component.submitEvent, 'emit');
    const submitButton =
      fixture.debugElement.nativeElement.querySelector('.submit-button');

    // Set form to disabled
    const formArray = component.parentFormGroup.controls[
      component.controlKey
    ] as FormArray;
    formArray.controls[0].disable({ emitEvent: false });
    fixture.detectChanges();

    expect(formArray.controls[0].disabled).toBeTrue();

    submitButton.click();
    expect(component.submitEvent.emit).toHaveBeenCalled();
  });

  it('removeButton should call removeReagentForm', () => {
    spyOn(component, 'removeReagentFormGroup');
    const removeButton =
      fixture.debugElement.nativeElement.querySelector('.remove-button');
    removeButton.click();
    expect(component.removeReagentFormGroup).toHaveBeenCalled();
  });

  it('form should not be disabled if async validation is pending or fails', () => {
    const input = 'RTS000ING|U0000-000|000000|000000000';
    batchAPIService.checkIfReagentExists.and.returnValue(of(true));

    // add form and reagent
    const reagent = component.getReagentFormGroup(0);

    // set value via html input
    reagent.controls['id'].setValue(input, { emitEvent: true });

    expect(reagent.disabled).toBeFalse();
    expect(reagent.errors).toBeNull();
    expect(reagent.valid).toBeFalse();
  });

  it('form should be disabled if input is correct and validation passes', () => {
    const input = 'RTS000ING|U0000-000|000000|000000000';
    batchAPIService.checkIfReagentExists.and.returnValue(of(false));

    // add form and reagent
    const reagent = component.getReagentFormGroup(0);

    // set value via html input
    reagent.controls['id'].setValue(input, { emitEvent: true });

    expect(reagent.disabled).toBeTrue();
    expect(reagent.errors).toBeNull();
    expect(reagent.valid).toBeFalse();
  });

  it('form should be invalid if input is empty', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(true));

    const input = '';

    // set value via html input
    const inputElement =
      fixture.debugElement.nativeElement.querySelector('.input-element');
    inputElement.value = input;
    inputElement.dispatchEvent(new Event('input'));

    const formArray = component.parentFormGroup.controls[
      component.controlKey
    ] as FormArray;
    expect(formArray.controls[0].valid).toBeFalse();
    expect(formArray.controls[0].value).toEqual({ id: input });
    expect(formArray.controls[0].disabled).toBeFalse();
  });

  it('reagentForm should validate input', () => {
    const strings = [
      'RTS000ING|U0000-000|000000|000000000',
      'STD015PLD-5|U1222-017|241130|220020887',
      'RTS150ING|U0623-017|250131|230626882',
      'RTS120INGTB1|U0422-117|240131|220000379',
      'RTS120INGTB1|U0422-117|240131|220000379',
    ];
    const dummyForm = new FormControl(
      '',
      Validators.pattern(constants.PCR.REAGENT_REGEX),
    );
    expect(dummyForm.value).toBe('');

    strings.forEach((input) => {
      dummyForm.setValue(input, { emitEvent: true });
      expect(dummyForm.valid).toBeTrue();
      dummyForm.reset(null, { emitEvent: false });
    });
  });

  it('reagentForm should handle multiple valid reagents input', () => {
    batchAPIService.checkIfReagentExists.and.returnValue(of(false));

    // set value of initially created form, we need to do this
    const control = component.getReagentFormGroup(0);
    control.controls['id'].setValue('RTS000ING|U0000-000|000000|000000000', {
      emitEvent: true,
    });

    const strings = [
      'RTS000ING|U0000-000|000000|000000001',
      'STD015PLD-5|U1222-017|241130|220020887',
      'RTS150ING|U0623-017|250131|230626882',
      'RTS130ING|P0523-171|241130|230524844',
      'RTS120INGTB1|U0422-117|240131|220000379',
      'RTS120INGTB1|U0422-117|240131|220000379',
    ];

    // add formControls
    const formArray = component.parentFormGroup.controls[
      component.controlKey
    ] as FormArray;
    strings.forEach((input) => {
      component.addReagentFormGroup();
      const reagent = component.getReagentFormGroup(formArray.length - 1);
      reagent.controls['id'].setValue(input, { emitEvent: true });
    });

    // check if all forms are disabled
    expect(formArray.valid).toBeFalse();
    formArray.controls.forEach((control) => {
      expect(control.disabled).toBeTrue();
    });

    // try to submit form
    const spy = spyOn(component.submitEvent, 'emit');
    fixture.detectChanges();

    // click submit button
    const submitButton =
      fixture.debugElement.nativeElement.querySelector('.submit-button');
    submitButton.click();

    // check if submit event was emitted
    expect(spy).toHaveBeenCalled();
  });
});
