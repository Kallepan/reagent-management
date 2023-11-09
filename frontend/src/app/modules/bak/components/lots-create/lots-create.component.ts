import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { CreateBakLot } from '../../interfaces/lot';
import { filterNotBeforeToday, isoDateFormat } from '@app/core/functions/date.function';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, filter, forkJoin, map, startWith, switchMap, tap } from 'rxjs';
import { BakType } from '../../interfaces/type';

@Component({
  selector: 'app-lots-create',
  templateUrl: './lots-create.component.html',
  styleUrls: ['./lots-create.component.scss']
})
export class LotsCreateComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  formGroup: FormGroup;
  fb = inject(FormBuilder);
  private bakStateHandlerService = inject(BakStateHandlerService);
  filterNotBeforeToday = filterNotBeforeToday;

  filteredTypes: Observable<BakType[]>;

  constructor() {
    const lastUser = localStorage.getItem('lastUser') || '';
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      createdBy: [lastUser, [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[a-zA-Z]*$')]],
      validFrom: ['',],
      validUntil: ['', [Validators.required]],
      inUseFrom: ['',],
      inUseUntil: ['',],
      typeId: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.formGroup.get('createdBy')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(value => !!value && typeof value === 'string'),
      map(value => value.trim()),
      map(value => value.toUpperCase()),
      tap(value => this.formGroup.get('createdBy')?.setValue(value, { emitEvent: false })),
      tap(value => localStorage.setItem('lastUser', value)),
    ).subscribe();

    this.filteredTypes = combineLatest([
      this.bakStateHandlerService.types.asObservable(),
      this.formGroup.get('typeId')!.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(''),
        filter(value => typeof value === 'string'),
        map(value => value.trim()),
        map(value => value.toLowerCase()),
      )]).pipe(
        map(([types, filterValue]) => this._filterType(types, filterValue)),
      );
  }

  submit() {
    if (this.formGroup.invalid) return;

    const name = (this.formGroup.get('name')?.value as string).trim();
    const createdBy = (this.formGroup.get('createdBy')?.value as string).trim().toUpperCase();
    const validFrom = this.formGroup.get('validFrom')?.value as Date | null;
    const validUntil = this.formGroup.get('validUntil')?.value as Date;
    const inUseFrom = this.formGroup.get('inUseFrom')?.value as Date | null;
    const inUseUntil = this.formGroup.get('inUseUntil')?.value as Date | null;
    const typeId = this.formGroup.get('typeId')?.value as string;

    const data: CreateBakLot = {
      name,
      created_by: createdBy,
      valid_from: isoDateFormat(validFrom),
      valid_until: isoDateFormat(validUntil)!,
      in_use_from: isoDateFormat(inUseFrom),
      in_use_until: isoDateFormat(inUseUntil),
      type_id: typeId,
    };

    this.bakStateHandlerService.createLot(data);
  }

  private _filterType(types: BakType[], filterValue: string): BakType[] {
    return types.filter(option => option.name.toLowerCase().includes(filterValue) || option.producer.toLowerCase().includes(filterValue) || option.article_number?.toLowerCase().includes(filterValue));
  }
}
