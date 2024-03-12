import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { filterNotBeforeToday, isoDateFormat } from '@app/core/functions/date.function';
import { filter, map, tap } from 'rxjs';
import { BakLot } from '../../interfaces/lot';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { LotAPIService } from '../../services/lot-api.service';
import { ReagentEditComponent } from '../reagent-edit/reagent-edit.component';
import { ReagentTransferComponent } from '../reagent-transfer/reagent-transfer.component';

@Component({
  selector: 'app-lots-detail',
  templateUrl: './lots-detail.component.html',
  styleUrls: ['./lots-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    ReagentEditComponent,
  ],
})
export class LotsDetailComponent implements OnInit {
  private bakStateHandlerService = inject(BakStateHandlerService);
  private lotAPIService = inject(LotAPIService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  filterNotBeforeToday = filterNotBeforeToday;

  id = this.route.snapshot.paramMap.get('id');
  lot$ = this.bakStateHandlerService.activeLot.asObservable().pipe(
    filter((lot): lot is BakLot => !!lot),
    map((lot) => {
      lot.totalAmount = lot.reagents.reduce((acc: number, reagent: any) => acc + reagent.amount, 0);
      return lot;
    }),
    tap((lot) => {
      // populate form
      this.formGroup
        .get('validFrom')
        ?.setValue(lot.valid_from ? new Date(lot.valid_from) : '', { emitEvent: false });
    }),
  );

  formGroup: FormGroup;
  fb = inject(FormBuilder);

  constructor() {
    this.formGroup = this.fb.group({
      validFrom: [''],
    });
  }

  ngOnInit(): void {
    this.lotAPIService.getLotById(this.id || '').subscribe({
      next: (lot) => this.bakStateHandlerService.activeLot.next(lot),
    });
  }

  submit() {
    if (this.formGroup.invalid) return;

    const validFrom = this.formGroup.get('validFrom')?.value as Date | null;

    const data: {
      valid_from: string | null;
    } = {
      valid_from: isoDateFormat(validFrom),
    };

    this.bakStateHandlerService.patchLot(this.id!, data);
  }

  openTransferDialog() {
    const dialogRef = this.dialog.open(ReagentTransferComponent, {
      data: {
        reagents: this.bakStateHandlerService.lots.getValue().find((lot) => lot.id === this.id)!
          .reagents,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const transferAmount = result.transferAmount as number;

      const sourceReagent = result.sourceReagent as string;
      const sourceAmount =
        this.bakStateHandlerService.lots
          .getValue()
          .find((lot) => lot.id === this.id)!
          .reagents.find((r) => r.id === sourceReagent)!.amount - transferAmount;

      const targetReagent = result.targetReagent as string;
      const targetAmount =
        this.bakStateHandlerService.lots
          .getValue()
          .find((lot) => lot.id === this.id)!
          .reagents.find((r) => r.id === targetReagent)!.amount + transferAmount;

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
    this.bakStateHandlerService.patchReagentSingle(reagentId, amount);
  }

  deleteLot() {
    if (
      !confirm(
        'Sind Sie sicher, dass Sie diesen Lot löschen wollen? Diese Aktion kann nicht rueckgängig gemacht werden.',
      )
    )
      return;

    this.bakStateHandlerService.deleteLot(this.id!);
  }
}
