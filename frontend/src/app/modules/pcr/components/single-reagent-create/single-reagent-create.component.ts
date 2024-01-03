import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { constants } from '@app/core/constants/constants';
import { messages } from '@app/core/constants/messages';
import { NotificationService } from '@app/core/services/notification.service';
import { debounceTime, filter, map, tap } from 'rxjs';
import { cleanQuery } from '../../functions/query-cleaner.function';
import { Batch, CreateReagent } from '../../interfaces/reagent';
import { BatchAPIService } from '../../services/batch-api.service';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { createValidatorNoDisable } from '../../validators/reagent-validator';

@Component({
  selector: 'app-single-reagent-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './single-reagent-create.component.html',
  styleUrl: './single-reagent-create.component.scss',
})
export class SingleReagentCreateComponent implements OnInit {
  private batchAPIService = inject(BatchAPIService);
  private pcrStateHandlerService = inject(PCRStateHandlerService);
  private notificationService = inject(NotificationService);
  private destroyRef$ = inject(DestroyRef);

  // formGroup
  private fb = inject(FormBuilder);
  formGroup = this.fb.group({
    createdBy: ['', [Validators.required, Validators.pattern(/^[a-z]{2,4}$/)]],
    reagentID: [
      '',
      {
        validators: [
          Validators.required,
          Validators.pattern(constants.PCR.REAGENT_REGEX),
        ],
        asyncValidators: [createValidatorNoDisable(this.batchAPIService)],
      },
    ],
  });

  // handle creation event
  @Output() createEvent = new EventEmitter<void>();
  // The batch which the reagent will be added to
  @Input() batch: Batch;

  ngOnInit(): void {
    // set the last used user as default
    const lastUser = localStorage.getItem('lastUser');
    if (lastUser) {
      this.formGroup
        .get('createdBy')
        ?.setValue(lastUser, { emitEvent: false, onlySelf: true });
    }

    // setUp cleaner during valueChanges of reagentID
    this.formGroup
      .get('reagentID')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef$),
        filter((value): value is string => typeof value === 'string'),
        map((value) => cleanQuery(value)),
        map((value) => value.trim()),
      )
      .subscribe((value) => {
        this.formGroup
          .get('reagentID')
          ?.patchValue(value, { emitEvent: false, onlySelf: true });
      });

    // set the last used user as default
    this.formGroup
      .get('createdBy')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef$),
        filter((value): value is string => typeof value === 'string'),
        debounceTime(500),
      )
      .subscribe((value) => {
        localStorage.setItem('lastUser', value);
      });
  }

  isDisabled(): boolean {
    return (
      this.formGroup.invalid ||
      this.formGroup.disabled ||
      this.formGroup.pending // <-- this is the problem
    );
  }

  createReagent(): void {
    if (!this.formGroup.valid) {
      this.notificationService.warnMessage(messages.PCR.INVALID_DATA);
      return;
    }

    // get the initial amount from the first present reagent
    const createdBy = this.formGroup.get('createdBy')?.value;
    if (!createdBy || !this.batch.reagents.length) return;
    const initialAmount = this.batch.reagents[0].initial_amount;

    // get the form
    const reagentIDToBeCreated = this.formGroup.get('reagentID')?.value;
    if (!reagentIDToBeCreated) return;

    const newReagent: CreateReagent = {
      batch_id: this.batch.id,
      id: reagentIDToBeCreated,
      initial_amount: initialAmount,
      created_by: createdBy,
    };

    // post the reagents
    this.pcrStateHandlerService
      .createOnlyReagents([newReagent])
      .pipe(
        tap(() => {
          this.formGroup.reset(
            { createdBy: '', reagentID: '' },
            { emitEvent: false },
          );
        }),
      )
      .subscribe({
        next: () => {
          this.notificationService.infoMessage(
            messages.PCR.REAGENT_CREATE_SUCCESS,
          );

          // emit the creation event
          this.createEvent.emit();
        },
        error: () => {
          this.notificationService.warnMessage(
            messages.PCR.REAGENT_CREATE_ERROR,
          );
        },
      });
  }
}
