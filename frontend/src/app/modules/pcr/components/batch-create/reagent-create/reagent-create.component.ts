import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { cleanQuery } from '@app/modules/pcr/functions/query-cleaner.function';

@Component({
  selector: 'app-reagent-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './reagent-create.component.html',
  styleUrl: './reagent-create.component.scss'
})
export class ReagentCreateComponent implements OnInit, OnDestroy {
  // Emit the submit event to the parent
  @Output() onSubmit = new EventEmitter<void>();

  // Inject the destroyRef to unsubscribe from observables
  private detroyRef = inject(DestroyRef);

  // Inject the parent container and formBuilder
  @Input({ required: true }) controlKey = 'reagents';
  parentContainer = inject(ControlContainer);
  private _formBuilder = inject(FormBuilder);
  // Functions to get the formGroup and formArray of the reagents
  get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
  get reagents(): FormArray {
    return this.parentFormGroup.get(this.controlKey) as FormArray;
  }

  addReagentForm() {
    const reagentForm = this._formBuilder.group({
      id: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{9}\|U[0-9]{4}-[0-9]{3}\|[0-9]{6}\|[0-9]{9}$/)]],
    });

    this.reagents.push(reagentForm);
  }

  getReagent(index: number): FormGroup {
    return this.reagents.at(index) as FormGroup;
  }

  removeReagentForm(index: number) {
    this.reagents.removeAt(index);
  }

  cleanInput(index: number) {
    // Get the value of the input
    const value = this.reagents.controls[index].value;
    if (!value && typeof value !== 'string') return;

    // Clean the query
    this.reagents.controls[index].patchValue({ id: cleanQuery(value.id) }, { emitEvent: false });
    if (this.reagents.controls[index].valid) {
      // disable the input
      this.reagents.controls[index].disable({ emitEvent: false });
    }
  }

  ngOnInit(): void {
    // Add a default reagent form
    this.addReagentForm();
  }

  ngOnDestroy(): void {
    // clean the reagents array
    this.reagents.clear();
  }
}
