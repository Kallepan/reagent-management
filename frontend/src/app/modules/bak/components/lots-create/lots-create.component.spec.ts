import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../interfaces/type';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { LotsCreateComponent } from './lots-create.component';

describe('LotsCreateComponent', () => {
  let component: LotsCreateComponent;
  let fixture: ComponentFixture<LotsCreateComponent>;
  let bakStateHandlerService: jasmine.SpyObj<BakStateHandlerService>;
  const lastUser = 'TEST';

  beforeEach(() => {
    bakStateHandlerService = jasmine.createSpyObj(
      'BakStateHandlerService',
      ['getProducts', 'getLots', 'getLocations', 'getReagents', 'createLot'],
      {
        lots: new BehaviorSubject([]),
        products: new BehaviorSubject([]),
        locations: new BehaviorSubject([]),
      },
    );
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
        LotsCreateComponent,
      ],
      providers: [
        {
          provide: BakStateHandlerService,
          useValue: bakStateHandlerService,
        },
      ],
    });
    localStorage.setItem('lastUser', lastUser);
    fixture = TestBed.createComponent(LotsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeAll(() => {});

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
      type: 'type',
    });
    component.submit();
    expect(component.formGroup.valid).toBeFalsy();

    // Fetch by id #submitButton
    const submitButton = fixture.debugElement.nativeElement.querySelector('#submitButton');
    expect(submitButton.disabled).toBeTruthy();

    expect(bakStateHandlerService.createLot).not.toHaveBeenCalled();
  });

  it('should display type name', () => {
    const undefinedType = undefined as unknown as Product;
    expect(component.displayFn(undefinedType)).toBe('');

    const product = {
      name: 'name',
      producer: {
        name: 'producer',
        id: 'id',
        created_at: new Date(),
      },
      type: {
        name: 'type',
        id: 'id',
        created_at: new Date(),
      },
      article_number: 'article_number',
    } as unknown as Product;
    expect(component.displayFn(product)).toBe(
      `${product.name} - ${product.producer.name} - ${product.type.name} - ${product.article_number}`,
    );

    const type2 = {} as Product;
    expect(component.displayFn(type2)).toBe('');
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
      type: 'typeId',
    });
    component.submit();
    expect(bakStateHandlerService.createLot).toHaveBeenCalled();
  });
});
