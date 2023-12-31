import { Component, OnInit, inject } from '@angular/core';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { filterNotBeforeToday, isoDateFormat } from '@app/core/functions/date.function';
import { MatDialog } from '@angular/material/dialog';
import { ReagentTransferComponent } from '../reagent-transfer/reagent-transfer.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReagentEditComponent } from '../reagent-edit/reagent-edit.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { LotAPIService } from '../../services/lot-api.service';
import { BakLot } from '../../interfaces/lot';

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
    filter((lot): lot is any => !!lot),
    map(lot => lot as BakLot),
    map((lot) => {
      // calculate total amount
      lot.totalAmount = lot.reagents.reduce((acc: number, reagent: any) => acc + reagent.amount, 0);
      return lot;
    }),
    tap(lot => {
      // populate form
      this.formGroup.get('validFrom')?.setValue(lot.valid_from ? new Date(lot.valid_from) : '', { emitEvent: false });
      this.formGroup.get('inUseFrom')?.setValue(lot.in_use_from ? new Date(lot.in_use_from) : '', { emitEvent: false });
      this.formGroup.get('inUseUntil')?.setValue(lot.in_use_until ? new Date(lot.in_use_until) : '', { emitEvent: false });
    }),
  );


  formGroup: FormGroup;
  fb = inject(FormBuilder);

  constructor() {
    this.formGroup = this.fb.group({
      validFrom: ['',],
      inUseFrom: ['',],
      inUseUntil: ['',],
    });
  }

  ngOnInit(): void {
    this.lotAPIService.getLotById(this.id || "").subscribe({
      next: (lot) => this.bakStateHandlerService.activeLot.next(lot),
    });
  }

  submit() {
    if (this.formGroup.invalid) return;

    const validFrom = this.formGroup.get('validFrom')?.value as Date | null;
    const inUseFrom = this.formGroup.get('inUseFrom')?.value as Date | null;
    const inUseUntil = this.formGroup.get('inUseUntil')?.value as Date | null;

    if (!validFrom && !inUseFrom && !inUseUntil) return;

    const data: any = {
      valid_from: isoDateFormat(validFrom),
      in_use_from: isoDateFormat(inUseFrom),
      in_use_until: isoDateFormat(inUseUntil),
    };

    this.bakStateHandlerService.patchLot(this.id!, data);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ReagentTransferComponent, {
      data: {
        reagents: this.bakStateHandlerService.lots.getValue().find(lot => lot.id === this.id)!.reagents,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const transferAmount = result.transferAmount as number;

      const sourceReagent = result.sourceReagent as string;
      const sourceAmount = this.bakStateHandlerService.lots.getValue().find(lot => lot.id === this.id)!.reagents.find(r => r.id === sourceReagent)!.amount - transferAmount;

      const targetReagent = result.targetReagent as string;
      const targetAmount = this.bakStateHandlerService.lots.getValue().find(lot => lot.id === this.id)!.reagents.find(r => r.id === targetReagent)!.amount + transferAmount;

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
    if (!confirm('Sind Sie sicher, dass Sie diesen Lot löschen wollen?')) return;

    this.bakStateHandlerService.deleteLot(this.id!);
  }
}
