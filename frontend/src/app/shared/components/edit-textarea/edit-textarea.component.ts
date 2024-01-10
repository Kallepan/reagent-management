/**
 *
 * Component which displays a string and can be toggled to a textarea to edit the string.
 */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-textarea',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-textarea.component.html',
  styleUrl: './edit-textarea.component.scss',
})
export class EditTextareaComponent implements OnChanges {
  @Output() onSubmit = new EventEmitter<string>();

  @Input({ required: true }) text: string = '';

  // stuff for form control
  formControl = new FormControl('', []);
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() hint: string = '';

  // toggles between the string and the textarea
  isEditing: WritableSignal<boolean> = signal(false);

  // udate formControl with text onChanges
  ngOnChanges(): void {
    this.formControl.setValue(this.text);
  }

  submit(): void {
    this.onSubmit.emit(this.formControl.value || '');
    this.isEditing.set(false);
  }
}
