import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { messages } from '@app/core/constants/messages';
import { NotificationService } from '@app/core/services/notification.service';
import {
  ChoiceDialogComponent,
  type ChoiceDialogData,
} from '@app/shared/components/choice-dialog/choice-dialog.component';
import {
  catchError,
  filter,
  from,
  map,
  of,
  switchMap,
  throwError,
  type Observable,
} from 'rxjs';
import { type BaseType } from '../../interfaces/base';
import { type Analysis, type Device, type Kind } from '../../interfaces/simple';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { ReagentCreateComponent } from './reagent-create/reagent-create.component';

export interface FormControlInfo {
  label: string;
  key: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  hint: string;

  // autocomplete fields
  placeholder?: string;
  data?: Observable<BaseType[]>;
  maxLength?: number;
  minLength?: number;
}

@Component({
  selector: 'app-batch-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,

    ReagentCreateComponent,

    ChoiceDialogComponent,
  ],
  templateUrl: './batch-create.component.html',
  styleUrl: './batch-create.component.scss',
})
export class BatchCreateComponent implements OnInit {
  // Confirmation dialog
  dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  // Forms
  private readonly _formBuilder = inject(FormBuilder);
  groupForm = this._formBuilder.group({
    device: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(5)],
    ],
    analysis: [
      null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(5)],
    ],
    kind: [null, [Validators.required, Validators.minLength(3)]],
    amount: [1, [Validators.required, Validators.min(1)]],
    comment: ['', [Validators.maxLength(255)]],
    created_by: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(4),
        Validators.pattern(/^[a-z]*$/),
      ],
    ],
  });

  reagentsFormGroup = this._formBuilder.group({
    reagents: this._formBuilder.array([]),
  });

  // pcrStateHandlerService keeps track of the state of the pcr module and all data necessary for the forms
  private readonly _pcrStateHandlerService = inject(PCRStateHandlerService);
  analyses: Observable<Analysis[]> =
    this._pcrStateHandlerService.analyses.asObservable();
  devices: Observable<Device[]> =
    this._pcrStateHandlerService.devices.asObservable();
  kinds: Observable<Kind[]> = this._pcrStateHandlerService.kinds.asObservable();

  // used to display the forms:
  shownFormControls: FormControlInfo[] = [
    {
      label: 'Gerät',
      key: 'device',
      type: 'select',
      placeholder: 'z.B. InGe01',
      data: this.devices,
      hint: 'Name des Geräts',
    },
    {
      label: 'Analyse',
      key: 'analysis',
      type: 'select',
      placeholder: 'z.B. CLO',
      data: this.analyses,
      hint: 'Name der Analyse',
    },
    {
      label: 'Typ',
      key: 'kind',
      type: 'select',
      placeholder: 'z.B. Kontrolle',
      data: this.kinds,
      hint: 'Art der Reagenz',
    },
    {
      label: 'Menge',
      key: 'amount',
      type: 'number',
      hint: 'Menge der Reagenzien je Reagenz',
    },
    {
      label: 'Kommentar',
      key: 'comment',
      type: 'textarea',
      hint: 'Kommentar',
      maxLength: 255,
    },
    {
      label: 'Erstellt von',
      key: 'created_by',
      type: 'text',
      hint: 'Ersteller der Reagenzien',
      maxLength: 4,
      minLength: 2,
      placeholder: 'gaze',
    },
  ];

  ngOnInit(): void {
    this.groupForm
      .get('amount')
      ?.valueChanges.pipe(
        filter(
          (value) => typeof value === 'number' && !isNaN(value) && value > 0,
        ),
      );

    this.groupForm
      .get('created_by')
      ?.valueChanges.pipe(
        filter((value): value is string => typeof value === 'string'),
        takeUntilDestroyed(this.destroyRef),
        map((value) => value.toLowerCase()),
      )
      .subscribe((value) => {
        this.groupForm.controls.created_by.setValue(value, {
          emitEvent: false,
        });
      });

    this.groupForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => this.groupForm.value),
        map((value) => ({
          kind: value.kind as Kind | null,
          analysis: value.analysis as Analysis | null,
        })),
        filter((value): value is { kind: Kind; analysis: Analysis } => {
          return value.kind !== null && value.analysis !== null;
        }),
        switchMap((value) =>
          this._pcrStateHandlerService.getDefaultAmountForBatch(
            value.analysis.id,
            value.kind.id,
          ).pipe(catchError((err) => throwError(() => err))),
        ),
        catchError(() => of(1)),
      )
      .subscribe((value) => {
        this.groupForm.controls['amount'].setValue(value, { emitEvent: false });
      });
  }

  isValid(): boolean {
    // check if all forms are valid
    // for reagents form, check if each control is valid or disabled
    const reagentsFormIsValid = Object.values<AbstractControl>(
      this.reagentsFormGroup.controls,
    ).reduce((acc, curr) => acc && (curr.valid || curr.disabled), true);

    // for group form, check if all forms are valid
    const groupFormIsValid = this.groupForm.valid;

    return reagentsFormIsValid && groupFormIsValid;
  }

  submit(): void {
    // Validate form
    if (!this.isValid()) {
      this.notificationService.warnMessage('Bitte füllen Sie alle Felder aus!');
      return;
    }
    if (this.reagentsFormGroup.controls.reagents.value.length === 0) {
      this.notificationService.warnMessage(
        'Bitte fügen Sie mindestens ein Reagenz hinzu!',
      );
      return;
    }

    const dialogRef = this.dialog.open<
      ChoiceDialogComponent,
      ChoiceDialogData,
      { id: string } | undefined
    >(ChoiceDialogComponent, {
      data: {
        title:
          'Sind sie sich sicher, dass Sie die Reagenzien erstellen wollen?',
        choices: [
          {
            id: 'OK',
            name: 'Erstellen',
          },
        ],
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result?.id !== undefined),
        map((result) => result?.id ?? 'ABORT'),
        filter((choice) => choice === 'OK'),
        switchMap(() =>
          this._pcrStateHandlerService
            .createReagents(
              this.groupForm.value,
              this.reagentsFormGroup.value.reagents as Array<{ id: string }>,
            )
            .pipe(catchError((err) => throwError(() => err))),
        ),
        switchMap((batchID) =>
          from(this.router.navigate(['/pcr', 'batch', batchID])),
        ),
      )
      .subscribe({
        next: () => {
          this.notificationService.infoMessage(
            messages.PCR.REAGENT_CREATE_SUCCESS,
          );
          this.groupForm.reset();
        },
        error: () => {
          this.notificationService.warnMessage(
            messages.PCR.REAGENT_CREATE_ERROR,
          );
        },
      });
  }
}
