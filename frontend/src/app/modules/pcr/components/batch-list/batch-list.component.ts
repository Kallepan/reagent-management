import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { messages } from '@app/core/constants/messages';
import { NotificationService } from '@app/core/services/notification.service';
import { ChoiceDialogComponent } from '@app/shared/components/choice-dialog/choice-dialog.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { SearchBarComponent } from '@app/shared/components/search-bar/search-bar.component';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs';
import { cleanQuery } from '../../functions/query-cleaner.function';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { Batch } from '../../interfaces/reagent';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [
    CommonModule,

    SearchBarComponent,
    DataTableComponent,

    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss',
})
export class BatchListComponent implements OnInit {
  private router = inject(Router);
  dialog = inject(MatDialog);

  // Search stuff
  filterControl = new FormControl('');
  filter$ = this.filterControl.valueChanges.pipe(
    takeUntilDestroyed(),
    filter((contents): contents is string => typeof contents === 'string'),
    debounceTime(200),
    map(query => cleanQuery(query)),
  );

  ngOnInit(): void {
    // Subscribe to filter changes and update the query parameter
    this.filter$.subscribe(query => this.filterControl.patchValue(query, { emitEvent: false }));
  }

  // State stuff
  pcrStateHandlerService = inject(PCRStateHandlerService);
  private notificationService = inject(NotificationService);

  searchReagents(searchTerm: string) {
    /**
     * Query the API for reagents matching the search term and open them
     * using the router in detailview. Should lead to batch manage view.
    **/
    this.pcrStateHandlerService.searchBatch(searchTerm).pipe(
      tap(batches => {
        if (batches.length === 0) {
          this.notificationService.warnMessage(messages.PCR.NO_BATCHES_FOUND);
        }
      }),
      filter(batches => batches.length > 0),
      tap(batches => {
        // Navigate to the first batch if there is only one
        if (batches.length === 1) {
          this.router.navigate(['pcr', 'batch', batches[0].id]);
        }
      }),
      filter(batches => batches.length > 1),
      // use notificationService to display a info
      tap(() => {
        this.notificationService.infoMessage(messages.PCR.MULTIPLE_BATCHES_FOUND);
      }),
      // Open a dialog to choose the batch
      switchMap(batches => {
        const matDialogConfig: MatDialogConfig = {
          data: {
            title: messages.PCR.MULTIPLE_BATCHES_FOUND,
            message: messages.PCR.MULTIPLE_BATCHES_FOUND,
            choices: batches.map(batch => ({
              id: batch.id,
              name: this._getFormattingString(batch),
            })),
          }
        }
        return this.dialog.open(ChoiceDialogComponent, matDialogConfig).afterClosed();
      }),
      // filter result is string
      filter(result => result !== undefined && result !== null),
      map(result => result.id as string),
    ).subscribe({
      // display notification if more than one batch is found
      next: (batchId) => {
        this.router.navigate(['pcr', 'batch', batchId]);
      },
    })
  }

  protected _getFormattingString(batch: Batch): string {
    return `${batch.kind.name}: ${batch.reagents.map(reagent => reagent.id.split('|').pop() ?? 'NA').join(', ')}`
  }
}
