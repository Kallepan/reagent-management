import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { CreateBakLot } from '../../interfaces/lot';
import { filterNotBeforeToday, isoDateFormat } from '@app/core/functions/date.function';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-lots-create',
  templateUrl: './lots-create.component.html',
  styleUrls: ['./lots-create.component.scss']
})
export class LotsCreateComponent {
  formGroup: FormGroup;
  fb = inject(FormBuilder);
  private bakStateHandlerService = inject(BakStateHandlerService);
  filterNotBeforeToday = filterNotBeforeToday;

  constructor() {
    const lastUser = localStorage.getItem('lastUser') || '';
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      createdBy: [lastUser, [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[a-zA-Z]*$')]],
      validFrom: ['', ],
      validUntil: ['', [Validators.required]],
      inUseFrom: ['', ],
      inUseUntil: ['', ],
      typeId: ['', [Validators.required]],
    });

    this.formGroup.get('createdBy')?.valueChanges.pipe(
      filter(value => value && typeof value === 'string'),
      map(value => value.trim()),
      map(value => value.toUpperCase()),
      tap(value => this.formGroup.get('createdBy')?.setValue(value, { emitEvent: false })),
      tap(value => localStorage.setItem('lastUser', value)),
      takeUntilDestroyed(),
    ).subscribe();
  }

  get types() {
    return this.bakStateHandlerService.types;
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
}
