import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface Choice {
  id: string
  name: string
}

export interface ChoiceDialogData {
  title: string
  choices: Choice[]
}

@Component({
  selector: 'app-choice-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './choice-dialog.component.html',
  styleUrls: ['./choice-dialog.component.scss']
})
export class ChoiceDialogComponent {
  title = '';
  choices: Choice[] = [];

  dialogRef = inject(MatDialogRef<ChoiceDialogComponent>);

  constructor (@Inject(MAT_DIALOG_DATA) data: ChoiceDialogData) {
    this.title = data.title;
    this.choices = data.choices;
  }

  onAbort (): void {
    this.dialogRef.close(null);
  }
}
