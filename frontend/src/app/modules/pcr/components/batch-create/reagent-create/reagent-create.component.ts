import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  type OnDestroy,
  type OnInit,
  Output,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlContainer,
  type FormArray,
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { cleanQuery } from '@app/modules/pcr/functions/query-cleaner.function';
import { BatchAPIService } from '@app/modules/pcr/services/batch-api.service';
import { createValidator } from '@app/modules/pcr/validators/reagent-validator';
import { debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'app-reagent-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ],
  templateUrl: './reagent-create.component.html',
  styleUrl: './reagent-create.component.scss'
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
  get parentFormGroup (): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  get reagents (): FormArray<FormGroup> {
    return this.parentFormGroup.get(this.controlKey) as FormArray;
  }

  addReagentForm (): void {
    const reagentForm = this._formBuilder.group({
      id: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z0-9]{9}\|U[0-9]{4}-[0-9]{3}\|[0-9]{6}\|[0-9]{9}$/)
        ],
        [createValidator(this.batchAPIService)]
      ]
    });

    reagentForm.statusChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((status) => {
      // we only need to check if the form is valid since pending and invalid are handled by the validator
      if (status === 'VALID') {
        reagentForm.disable({ emitEvent: false });
      }
    });

    this.reagents.push(reagentForm);
  }

  getReagent (index: number): FormGroup {
    return this.reagents.at(index);
  }

  removeReagentForm (index: number): void {
    this.reagents.removeAt(index);
  }

  ngOnInit (): void {
    // subscribe to the valueChanges of the reagents
    this.reagents.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(200),
      // cleanInput
      map((values) => {
        return values.map((reagent) => {
          return { id: cleanQuery(reagent.id) };
        });
      }),
      tap((values) => { this.reagents.patchValue(values, { emitEvent: false }); })
    ).subscribe(() => {
      // Do nothing
    });

    // Add a default reagent form
    this.addReagentForm();
  }

  ngOnDestroy (): void {
    // clean the reagents array
    this.reagents.clear();
  }
}
