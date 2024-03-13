import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { filterNotBeforeToday, isoDateFormat } from '@app/core/functions/date.function';
import { Observable, combineLatest, filter, map, startWith, tap } from 'rxjs';
import { CreateBakLot } from '../../interfaces/lot';
import { Product } from '../../interfaces/type';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';

@Component({
  selector: 'app-lots-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './lots-create.component.html',
  styleUrls: ['./lots-create.component.scss'],
})
export class LotsCreateComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  formGroup: FormGroup;
  fb = inject(FormBuilder);
  private bakStateHandlerService = inject(BakStateHandlerService);
  filterNotBeforeToday = filterNotBeforeToday;

  filteredProducts: Observable<Product[]>;

  constructor() {
    const lastUser = localStorage.getItem('lastUser') || '';
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      createdBy: [
        lastUser,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.minLength(4),
          Validators.pattern('^[a-zA-Z]*$'),
        ],
      ],
      validFrom: [''],
      validUntil: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.formGroup
      .get('createdBy')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => !!value && typeof value === 'string'),
        map((value) => value.trim()),
        map((value) => value.toUpperCase()),
        tap((value) => this.formGroup.get('createdBy')?.setValue(value, { emitEvent: false })),
        tap((value) => localStorage.setItem('lastUser', value)),
      )
      .subscribe();

    this.filteredProducts = combineLatest([
      this.bakStateHandlerService.products.asObservable(),
      this.formGroup.get('type')!.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(''),
        filter((value) => typeof value === 'string'),
        map((value) => value.trim()),
        map((value) => value.toLowerCase()),
      ),
    ]).pipe(map(([types, filterValue]) => this._filterType(types, filterValue)));
  }

  submit() {
    if (this.formGroup.invalid) return;

    const name = (this.formGroup.get('name')?.value as string).trim();
    const createdBy = (this.formGroup.get('createdBy')?.value as string).trim().toUpperCase();
    const validFrom = this.formGroup.get('validFrom')?.value as Date | null;
    const validUntil = this.formGroup.get('validUntil')?.value as Date;
    const product = this.formGroup.get('type')?.value as Product;

    const data: CreateBakLot = {
      name,
      created_by: createdBy,
      valid_from: isoDateFormat(validFrom),
      valid_until: isoDateFormat(validUntil)!,
      product_id: product.id,
    };

    this.bakStateHandlerService.createLot(data);
  }

  private _filterType(types: Product[], filterValue: string): Product[] {
    return types.filter(
      (option) =>
        option.name.toLowerCase().includes(filterValue) ||
        option.producer.name.toLowerCase().includes(filterValue) ||
        option.type.name.toLowerCase().includes(filterValue) ||
        option.article_number?.toLowerCase().includes(filterValue),
    );
  }

  displayFn(product: Product): string {
    if (!product) return '';
    return product && product.name
      ? `${product.name} - ${product.producer.name} - ${product.type.name} - ${product.article_number}`
      : '';
  }
}
