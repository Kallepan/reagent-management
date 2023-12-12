import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  inject,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlContainer,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormArray,
  type FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { constants } from '@app/core/constants/constants';
import { cleanQuery } from '@app/modules/pcr/functions/query-cleaner.function';
import { BatchAPIService } from '@app/modules/pcr/services/batch-api.service';
import { createValidator } from '@app/modules/pcr/validators/reagent-validator';
import { debounceTime, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-reagent-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './reagent-create.component.html',
  styleUrl: './reagent-create.component.scss',
})
export class ReagentCreateComponent implements OnInit, OnDestroy {
  // Destroy reference
  private readonly destroyRef = inject(DestroyRef);

  // Inject the batchAPIService
  private readonly batchAPIService = inject(BatchAPIService);

  // Emit the submit event to the parent
  @Output() onSubmit = new EventEmitter<void>();

  // Inject the parent container and formBuilder
  @Input({ required: true }) controlKey = 'reagents';
  parentContainer = inject(ControlContainer);
  private readonly _formBuilder = inject(FormBuilder);

  // Functions to get the formGroup and formArray of the reagents
  get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  get reagents(): FormArray<FormGroup> {
    return this.parentFormGroup.get(this.controlKey) as FormArray;
  }

  addReagentForm(): void {
    const reagentForm = this._formBuilder.group({
      id: [
        '',
        [Validators.required, Validators.pattern(constants.PCR.REAGENT_REGEX)],
        [createValidator(this.batchAPIService)],
      ],
    });

    reagentForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(200),
        // cleanInput
        filter((value): value is { id: string } => value.id !== null),
        map((value) => {
          return { id: cleanQuery(value.id) };
        }),
        tap((value) => {
          reagentForm.patchValue(value, { emitEvent: false });
        }),
      )
      .subscribe(() => {
        // Do nothing
      });

    this.reagents.push(reagentForm);
  }

  getReagent(index: number): FormGroup {
    return this.reagents.at(index);
  }

  removeReagentForm(index: number): void {
    this.reagents.removeAt(index);
  }

  isDisabled(): boolean {
    // should return true if none of the reagents are disabled
    return !this.reagents.controls.every((reagent) => reagent.disabled);
  }

  ngOnInit(): void {
    // Add a default reagent form
    this.addReagentForm();
  }

  ngOnDestroy(): void {
    // clean the reagents array
    this.reagents.clear({ emitEvent: false });
  }
}
