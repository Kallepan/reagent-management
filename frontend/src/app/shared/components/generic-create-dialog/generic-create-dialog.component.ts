import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { messages } from '@app/core/constants/messages';

export type CreateDialogData = {
  title: string;
  formControlInfos: FormControlInfo[];
  formGroup: FormGroup;
}

type FormControlInfo = {
  // Form control name
  controlName: string;

  // Form control metadata
  label: string;
  type: 'text' | 'number';
  placeholder?: string;
  hint?: string;

  // Custom error messages
  errors: {
    required?: string;
    minlength?: string;
    maxlength?: string;
    pattern?: string;
    min?: string;
    max?: string;
  };
}

@Component({
  selector: 'app-generic-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './generic-create-dialog.component.html',
  styleUrl: './generic-create-dialog.component.scss'
})
export class GenericCreateDialogComponent {
  title: string;
  formControlInfos: FormControlInfo[];
  formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { title: string, formControlInfos: FormControlInfo[], formGroup: FormGroup }
  ) {
    this.title = data.title;
    this.formControlInfos = data.formControlInfos;
    this.formGroup = data.formGroup;
  }

  getErrorMessage(controlInfo: FormControlInfo): (string | null) {
    const errors = this.formGroup.get(controlInfo.controlName)?.errors;
    if (!errors) return null;

    // Switch case for error messages
    if (errors['required']) return controlInfo.errors.required || messages.GENERAL.FORM_ERRORS.REQUIRED;
    if (errors['minlength']) return controlInfo.errors.minlength || messages.GENERAL.FORM_ERRORS.MIN_LENGTH;
    if (errors['maxlength']) return controlInfo.errors.maxlength || messages.GENERAL.FORM_ERRORS.MAX_LENGTH;
    if (errors['pattern']) return controlInfo.errors.pattern || messages.GENERAL.FORM_ERRORS.PATTERN;
    if (errors['min']) return controlInfo.errors.min || messages.GENERAL.FORM_ERRORS.MIN;
    if (errors['max']) return controlInfo.errors.max || messages.GENERAL.FORM_ERRORS.MAX;

    return null
  }
}
