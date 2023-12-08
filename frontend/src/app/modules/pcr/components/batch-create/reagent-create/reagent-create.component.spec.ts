import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
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

  it('form should be disabled if input is correct and validation passes', () => {
    const input = 'RTS000ING|U0000-000|000000|000000000';
    batchAPIService.checkIfReagentExists.and.returnValue(of(false));

    // add form and reagent
    const reagent = component.getReagent(0);

    // set value via html input
    reagent.controls['id'].setValue(input, { emitEvent: true });
    component.cleanInput(0);

    expect(reagent.disabled).toBeTrue();
    expect(reagent.errors).toBeNull();
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
});
