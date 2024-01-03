import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { messages } from '@app/core/constants/messages';
import { NotificationService } from '@app/core/services/notification.service';
import { ChoiceDialogComponent } from '@app/shared/components/choice-dialog/choice-dialog.component';
import { EditTextareaComponent } from '@app/shared/components/edit-textarea/edit-textarea.component';
import {
  CreateDialogData,
  GenericCreateDialogComponent,
} from '@app/shared/components/generic-create-dialog/generic-create-dialog.component';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Batch, Reagent } from '../../interfaces/reagent';
import { Removal } from '../../interfaces/removal';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { ReagentManageComponent } from '../reagent-manage/reagent-manage.component';
import { RemovalManageComponent } from '../removal-manage/removal-manage.component';
import { SingleReagentCreateComponent } from '../single-reagent-create/single-reagent-create.component';

@Component({
  selector: 'app-batch-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,

    ReagentManageComponent,
    RemovalManageComponent,
    GenericCreateDialogComponent,
    EditTextareaComponent,
    SingleReagentCreateComponent,
  ],
  templateUrl: './batch-manage.component.html',
  styleUrl: './batch-manage.component.scss',
})
export class BatchManageComponent implements OnInit {
  // ─── INJECTIONS ───
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  dialog = inject(MatDialog);
  loading = signal(false);

  protected pcrStateHandlerService = inject(PCRStateHandlerService);

  // some minor states
  activeReagent = signal<Reagent | null>(null);
  scannedReagent = signal<Reagent | null>(null);

  _batch = new BehaviorSubject<string | null>(null);
  batch = toSignal(
    this._batch.asObservable().pipe(
      takeUntilDestroyed(),
      // Filter out null values
      filter((batch): batch is string => batch !== null),
      switchMap((batchId) =>
        this.pcrStateHandlerService.getBatch(batchId).pipe(
          catchError(() => {
            this.router.navigate(['/pcr/batch']);
            return of(null);
          }),
        ),
      ),
      tap((batch) => {
        if (batch === null) {
          this.notificationService.warnMessage(messages.PCR.NO_BATCHES_FOUND);
          this.router.navigate(['/pcr/batch']);
        }
      }),
      filter((batch): batch is Batch => batch !== null),
      tap((batch) => {
        // fetch searchTerm
        const searchTerm = this.pcrStateHandlerService.getLastSearchTerm();

        // get reagent from batch where id matches searchTerm
        const reagent = batch.reagents.find(
          (reagent) => reagent.id === searchTerm,
        );

        // set scannedReagent
        this.scannedReagent.set(reagent || null);
      }),
      tap((batch) => {
        // update activeReagent if it is not null:
        if (this.activeReagent() !== null) {
          const reagent = batch.reagents.find(
            (reagent) => reagent.id === this.activeReagent()?.id,
          );
          if (reagent !== undefined) this.activeReagent.set(reagent);
          else this.activeReagent.set(null);
        }
      }),
      map((batch) => {
        // set comment to default value if it is empty string
        batch.comment = batch.comment || '';
        return batch;
      }),
    ),
  );

  handleReagentSelectionChange(change: MatChipSelectionChange) {
    if (change.selected) this.activeReagent.set(change.source.value);
    else this.activeReagent.set(null);
  }

  handleRemovalCreation(reagent: Reagent) {
    const user = localStorage.getItem('pcr_current_user') || '';
    const data: CreateDialogData = {
      title: 'Reagenzie entnehmen',
      formControlInfos: [
        {
          controlName: 'amount',
          label: 'Menge',
          type: 'number',
          placeholder: 'Menge',
          hint: 'Menge',
          errors: {
            required: 'Menge ist erforderlich',
            min: 'Menge muss mindestens 1 sein',
            max: `Menge darf maximal ${reagent.current_amount} sein`,
            pattern: 'Menge muss eine Zahl sein',
          },
        },
        {
          controlName: 'user',
          label: 'Benutzer',
          type: 'text',
          placeholder: 'gaze',
          hint: 'Benutzer',
          errors: {
            required: 'Benutzer ist erforderlich',
            pattern: 'Benutzer muss ein Wort sein',
          },
        },
        {
          controlName: 'comment',
          label: 'Kommentar',
          type: 'textarea',
          placeholder: 'Kommentar',
          hint: 'Kommentar',
          errors: {
            maxlength: 'Kommentar darf maximal 255 Zeichen lang sein',
          },
        },
      ],
      formGroup: this.fb.group({
        amount: [
          1,
          [
            Validators.required,
            Validators.min(1),
            Validators.pattern(/^-?[0-9]+$/),
            Validators.max(reagent.current_amount),
          ],
        ],
        user: [user, [Validators.required, Validators.pattern(/^[a-z]+$/)]],
        comment: ['', [Validators.maxLength(255)]],
      }),
    };
    const matDialogConfig: MatDialogConfig = {
      data,
    };

    this.dialog
      .open(GenericCreateDialogComponent, matDialogConfig)
      .afterClosed()
      .pipe(
        filter(
          (
            result,
          ): result is { amount: number; user: string; comment: string } =>
            result !== undefined && result !== null,
        ),
        // set default comment to empty string
        map((result) => {
          if (result.comment === undefined || result.comment === null)
            result.comment = '';
          return result;
        }),
        tap((result) => localStorage.setItem('pcr_current_user', result.user)),
        map((result) => ({
          amount: result.amount,
          user: result.user.trim().toLowerCase(),
          comment: result.comment.trim(),
        })),
        tap(() => this.loading.set(true)),
        switchMap((result) =>
          this.pcrStateHandlerService
            .postRemoval(reagent.id, result.user, result.amount, result.comment)
            .pipe(catchError((err) => throwError(() => err))),
        ),
        catchError(() => {
          this.notificationService.warnMessage(
            messages.PCR.REMOVAL_CREATE_FAILED,
          );
          return of(null);
        }),
        tap(() => this.loading.set(false)),
        filter((removal): removal is Removal => removal !== null),
        tap(() => {
          // Side effects
          this.notificationService.infoMessage(
            messages.PCR.REMOVAL_CREATE_SUCCESS,
          );
          this._batch.next(this._batch.value);
        }),
        switchMap(() => {
          // switch to check if the reagent was removed more than X times
          // Note that removal in this context means the number of single removal events not how many units were removed
          return (
            this.pcrStateHandlerService
              .getMaxRecommendedRemovalsForReagent(
                this.batch()?.analysis.id ?? '',
                this.batch()?.kind.id ?? '',
              )
              // Here we handle the default case if no maxReagents were found
              .pipe(catchError(() => of(0)))
          );
        }),
        filter(
          (maxRemovals) =>
            // maxRemmovals is 0 if the no maxReagents were found
            maxRemovals <= reagent.removals.length && maxRemovals > 0,
        ),
        switchMap((maxRemovals) => {
          // open dialog to warn user if the reagent was removed more than X times
          const matDialogConfig: MatDialogConfig = {
            data: {
              title: `Maximale Anzahl an empfohlenen Entnahmen (${maxRemovals}) erreicht!`,
              choices: [{ id: 'ok', name: 'Ok' }],
              displayCancel: false,
            },
          };

          return this.dialog
            .open(ChoiceDialogComponent, matDialogConfig)
            .afterClosed();
        }),
      )
      .subscribe({
        next: (maxRemovals) => {
          console.log('maxRemovals: ', maxRemovals);
        },
      });
  }

  handleRemovalDeletion(removal: Removal) {
    const matDialogConfig: MatDialogConfig = {
      data: {
        title: 'Möchten Sie diese Entnahme wirklich löschen?',
        choices: [{ id: 'yes', name: 'Ja' }],
      },
    };

    // open confirmation Dialog
    this.dialog
      .open(ChoiceDialogComponent, matDialogConfig)
      .afterClosed()
      .pipe(
        filter(
          (result): result is { id: string; name: string } =>
            result !== undefined && result !== null,
        ),
        filter((result) => result.id === 'yes'),
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.pcrStateHandlerService
            .deleteRemoval(removal.id)
            .pipe(catchError((err) => throwError(() => err))),
        ),
      )
      .subscribe({
        next: () => {
          this.notificationService.infoMessage(
            messages.PCR.REMOVAL_DELETE_SUCCESS,
          );
          this._batch.next(this._batch.value);
        },
        error: () => {
          this.notificationService.warnMessage(
            messages.PCR.REMOVAL_DELETE_FAILED,
          );
        },
        complete: () => this.loading.set(false),
      });
  }

  deleteBatch() {
    const matDialogConfig: MatDialogConfig = {
      data: {
        title:
          'Möchten Sie diesen Batch wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
        choices: [{ id: 'yes', name: 'Ja' }],
      },
    };

    this.dialog
      .open(ChoiceDialogComponent, matDialogConfig)
      .afterClosed()
      .pipe(
        filter(
          (result): result is { id: string; name: string } =>
            result !== undefined && result !== null,
        ),
        filter((result) => result.id === 'yes'),
        map(() => this.batch()?.id),
        filter(
          (batchId): batchId is string =>
            batchId !== undefined && batchId !== null,
        ),
        switchMap((batchId) =>
          this.pcrStateHandlerService
            .deleteBatch(batchId)
            .pipe(catchError((err) => throwError(() => err))),
        ),
        tap(() => this.router.navigate(['/pcr/batch'])),
      )
      .subscribe({
        next: () => {
          this.notificationService.infoMessage(
            messages.PCR.BATCH_DELETE_SUCCESS,
          );
        },
        error: () => {
          this.notificationService.warnMessage(
            messages.PCR.BATCH_DELETE_FAILED,
          );
        },
      });
  }

  updateBatchComment(id: string, comment: string) {
    this.loading.set(true);
    this.pcrStateHandlerService.updateBatchComment(id, comment).subscribe({
      next: () => {
        this._batch.next(id);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  refreshBatch() {
    this._batch.next(this._batch.value);
  }

  ngOnInit(): void {
    // Fetch batchId from route
    const batchId = this.route.snapshot.paramMap.get('batchId');

    // Emit batchId to subscribers
    this._batch.next(batchId);
  }
}
