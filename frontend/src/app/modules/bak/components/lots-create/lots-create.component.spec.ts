import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsCreateComponent } from './lots-create.component';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('LotsCreateComponent', () => {
  let component: LotsCreateComponent;
  let fixture: ComponentFixture<LotsCreateComponent>;
  let bakStateHandlerService: jasmine.SpyObj<BakStateHandlerService>;
  const lastUser = 'TEST';

  beforeEach(() => {
    bakStateHandlerService = jasmine.createSpyObj('BakStateHandlerService', ['getTypes', 'getLots', 'getLocations', 'getReagents', 'createLot'], { lots: new BehaviorSubject([]), types: new BehaviorSubject([]), locations: new BehaviorSubject([]) });
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatInputModule,
      ],
      declarations: [LotsCreateComponent],
      providers: [
        {
          provide: BakStateHandlerService,
          useValue: bakStateHandlerService
        }
      ],
    });
    localStorage.setItem('lastUser', lastUser);
    fixture = TestBed.createComponent(LotsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeAll(() => {
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid', () => {
    component.formGroup.reset();
    component.formGroup.setValue({
      name: '',
      createdBy: 'TESTs',
      validUntil: new Date(),
      validFrom: '',
      inUseFrom: '',
      inUseUntil: '',
      typeId: 'typeId',
    });
    component.submit();
    expect(component.formGroup.valid).toBeFalsy();

    // Fetch by id #submitButton
    const submitButton = fixture.debugElement.nativeElement.querySelector('#submitButton');
    expect(submitButton.disabled).toBeTruthy();

    expect(bakStateHandlerService.createLot).not.toHaveBeenCalled();
  });

  it('should fill formGroup createdBy with lastUser from localStorage', () => {
    fixture.detectChanges();
    expect(component.formGroup.get('createdBy')?.value).toBe(lastUser);
  });

  it('#submit should call #createLot of bakStateHandlerService if form is valid', () => {
    component.formGroup.reset();
    component.formGroup.setValue({
      name: 'name',
      createdBy: 'KALL',
      validUntil: new Date(),
      validFrom: '',
      inUseFrom: '',
      inUseUntil: '',
      typeId: 'typeId',
    });
    component.submit();
    expect(bakStateHandlerService.createLot).toHaveBeenCalled();
  });
});
