import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { BakLot } from '../../interfaces/lot';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnsSchema } from '@app/shared/components/data-table/data-table.component';
import { ReagentTransferComponent } from '../reagent-transfer/reagent-transfer.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/core/services/notification.service';
import { messages } from '@app/core/constants/messages';
import { ChoiceDialogComponent } from '@app/shared/components/choice-dialog/choice-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-lots-list',
  templateUrl: './lots-list.component.html',
  styleUrls: ['./lots-list.component.scss']
})
export class LotsListComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  dialog = inject(MatDialog);

  // Search stuff
  filterControl = new FormControl('');
  filter$ = this.filterControl.valueChanges.pipe(
    takeUntilDestroyed(this.destroyRef),
    filter((contents): contents is string => typeof contents === 'string'),
    debounceTime(200),
    switchMap(searchString => this.bakStateHandlerService.searchLots(searchString)),
  ).subscribe(lots => {
    this.bakStateHandlerService.lots.next(lots);
  });

  // Table stuff
  bakStateHandlerService = inject(BakStateHandlerService);
  private notificationService = inject(NotificationService);
  lots$ = this.bakStateHandlerService.lots.pipe(
    map((lots) => {
      // calculate the total amount of reagents in each lot
      return lots.map((lot) => {
        lot.totalAmount = lot.reagents.reduce((acc, reagent) => acc + reagent.amount, 0);
        return lot;
      });
    }),
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
    },
    {
      key: 'totalAmounts',
      label: 'Gesamtmenge',
      type: 'text',
      fn: (lot: BakLot) => `${lot.totalAmount}`,
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
    this.bakStateHandlerService.patchReagentInList(reagentId, amount);
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
