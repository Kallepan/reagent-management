import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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
    this.dialogRef.close(null);
  }
}
