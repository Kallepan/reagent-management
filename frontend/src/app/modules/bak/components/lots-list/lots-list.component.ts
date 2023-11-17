import { Component, OnInit, inject } from '@angular/core';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { debounceTime, filter, tap } from 'rxjs';
import { BakLot } from '../../interfaces/lot';
import { FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ColumnsSchema, DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { ReagentTransferComponent } from '../reagent-transfer/reagent-transfer.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/core/services/notification.service';
import { messages } from '@app/core/constants/messages';
import { ChoiceDialogComponent } from '@app/shared/components/choice-dialog/choice-dialog.component';
import { CommonModule } from '@angular/common';
import { ReagentEditComponent } from '../reagent-edit/reagent-edit.component';
import { SearchBarComponent } from '@app/shared/components/search-bar/search-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  selector: 'app-lots-list',
  templateUrl: './lots-list.component.html',
  styleUrls: ['./lots-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReagentEditComponent,

    SearchBarComponent,
    DataTableComponent,
    MatButtonModule,
    RouterModule,
  ]
})
export class LotsListComponent implements OnInit {
  private router = inject(Router);
  dialog = inject(MatDialog);

  // Search stuff
  filterControl = new FormControl('');
  filter$ = this.filterControl.valueChanges.pipe(
    filter((contents): contents is string => typeof contents === 'string'),
    debounceTime(200),
  );

  // Table stuff
  bakStateHandlerService = inject(BakStateHandlerService);
  private notificationService = inject(NotificationService);
  lots$ = this.bakStateHandlerService.lots.pipe(
  );
  columnsSchema: ColumnsSchema[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      fn: (lot: BakLot) => lot.name,
    },
    {
      key: 'valid_until',
      label: 'Haltbarkeit',
      type: 'text',
      fn: (lot: BakLot) => new Date(lot.valid_until).toLocaleDateString("de-DE"),
    },
    {
      key: 'type',
      label: 'Typ',
      type: 'text',
      fn: (lot: BakLot) => lot.type.name,
    },
    {
      key: 'producer',
      label: 'Hersteller',
      type: 'text',
      fn: (lot: BakLot) => lot.type.producer,
    },
    {
      key: 'valid_from',
      label: 'Validiert',
      type: 'color',
      fn: (lot: BakLot) => lot.valid_from ? 'green' : 'red',
    }
  ];

  editLot(lot: BakLot) {
    // navigate to the detail page of the lot with the given id
    this.router.navigate(['bak', 'lots', 'detail', lot.id]);
  }

  openReagentTransferDialog(lotId: string): void {
    const dialogRef = this.dialog.open(ReagentTransferComponent, {
      data: {
        reagents: this.bakStateHandlerService.lots.getValue().find(lot => lot.id === lotId)!.reagents,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const transferAmount = result.transferAmount as number;

      const sourceReagent = result.sourceReagent as string;
      const sourceAmount = this.bakStateHandlerService.lots.getValue().find(lot => lot.id === lotId)!.reagents.find(r => r.id === sourceReagent)!.amount - transferAmount;

      const targetReagent = result.targetReagent as string;
      const targetAmount = this.bakStateHandlerService.lots.getValue().find(lot => lot.id === lotId)!.reagents.find(r => r.id === targetReagent)!.amount + transferAmount;

      // calculate amount
      this.bakStateHandlerService.handleReagentTransfer({
        sourceReagent,
        targetReagent,
        sourceAmount,
        targetAmount,
      });
    });
  }

  patchReagent(reagentId: string, amount: number): void {
    this.bakStateHandlerService.patchReagent(reagentId, amount);
  }

  searchLots(searchString: string) {
    this.bakStateHandlerService.searchLots(searchString).pipe(
      tap(lots => {
        if (lots.length === 1) {
          this.router.navigate(['bak', 'lots', 'detail', lots[0].id]);
        }
      }),
      tap(lots => {
        if (lots.length === 0) this.notificationService.infoMessage(messages.BAK.NO_LOT_FOUND);
      }),
      filter(lots => lots.length > 1),
    ).subscribe(lots => {
      // Open lots choice dialog
      const dialogRef = this.dialog.open(ChoiceDialogComponent, {
        data: {
          title: 'Mehrere Lots gefunden',
          choices: lots.map(lot => ({ id: lot.id, name: `${lot.name} (${lot.type.name} - ${lot.type.producer})` })),
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) return;

        this.router.navigate(['bak', 'lots', 'detail', result.id]);
      });
    });
  }

  ngOnInit(): void {
    this.bakStateHandlerService.refreshData();
  }
}
