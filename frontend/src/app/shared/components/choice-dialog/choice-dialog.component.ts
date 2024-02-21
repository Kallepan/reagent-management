import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface Choice {
  id: string;
  name: string;
}

export interface ChoiceDialogData {
  title: string;
  choices: Choice[];
  displayCancel?: boolean; // displays the cancel button
}

@Component({
  selector: 'app-choice-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './choice-dialog.component.html',
  styleUrls: ['./choice-dialog.component.scss'],
})
export class ChoiceDialogComponent {
  title = '';
  choices: Choice[] = [];
  displayCancel = true;

  dialogRef = inject(MatDialogRef<ChoiceDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) data: ChoiceDialogData) {
    this.title = data.title;
    this.choices = data.choices;
    this.displayCancel = data.displayCancel ?? true;
  }

  onAbort(): void {
    this.dialogRef.close(null);
  }
}
