import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-choice-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './choice-dialog.component.html',
  styleUrls: ['./choice-dialog.component.scss']
})
export class ChoiceDialogComponent<T extends { id: string, name: string }> {
  title = '';
  choices: T[] = [];

  dialogRef = inject(MatDialogRef<ChoiceDialogComponent<T>>);

  constructor(@Inject(MAT_DIALOG_DATA) data: { title: string, choices: T[] }) {
    this.title = data.title;
    this.choices = data.choices;
  }

  onAbort(): void {
    this.dialogRef.close();
  }
}
