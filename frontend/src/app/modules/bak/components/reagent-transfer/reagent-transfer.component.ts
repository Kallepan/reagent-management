import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { combineLatest, filter, map, tap } from 'rxjs';
import { BakLotReagent } from '../../interfaces/lot';

export interface DialogData {
  reagents: BakLotReagent[]
}

@Component({
  selector: 'app-reagent-transfer',
  templateUrl: './reagent-transfer.component.html',
  styleUrls: ['./reagent-transfer.component.scss']
})
export class ReagentTransferComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  formGroup: FormGroup = this.fb.group({
    sourceReagent: ['', Validators.required],
    targetReagent: ['', Validators.required],
    transferAmount: [0, [Validators.required, Validators.min(1)]],
  });

  dialogRef = inject(MatDialogRef<ReagentTransferComponent>);
  validAmounts$ = this.formGroup.get('sourceReagent')!.valueChanges.pipe(
    map((reagentId: string) => this.data.reagents.find(r => r.id === reagentId)),
    filter((r): r is BakLotReagent => !!r),
    map(r => r.amount),
    map(v => Array.from(Array(v).keys()).map(i => i + 1)),
  );
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {  }

  ngOnInit(): void {
    combineLatest([
      this.formGroup.get('sourceReagent')!.valueChanges,
      this.formGroup.get('targetReagent')!.valueChanges,
    ]).pipe(
      takeUntilDestroyed(this._destroyRef),
      map(([sourceReagent, targetReagent]) => [sourceReagent, targetReagent] as [string, string]),
      tap(() => this.formGroup.get('transferAmount')!.setValue(0)),
      filter(([sourceReagent, targetReagent]) => sourceReagent === targetReagent),
      ).subscribe(([sourceReagent, _]) => {
        const otherReagent = this.data.reagents.find(r => r.id !== sourceReagent)?.id;
        this.formGroup.get('targetReagent')!.setValue(otherReagent);
      });
  }

  onAbort(): void {
    this.dialogRef.close();
  }
}
