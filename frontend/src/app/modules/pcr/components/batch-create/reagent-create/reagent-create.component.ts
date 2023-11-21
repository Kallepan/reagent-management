import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  @Input({ required: true }) controlKey = 'reagents';

  parentContainer = inject(ControlContainer);

  private _formBuilder = inject(FormBuilder);

  get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  get reagents(): FormArray {
    // must 
    return this.parentFormGroup.get(this.controlKey)! as FormArray;
  }

  addReagent() {
    const reagentForm = this._formBuilder.group({
      id: ['', [Validators.required]],
    });
    this.reagents.push(reagentForm);
  }

  getReagent(index: number): FormGroup {
    return this.reagents.at(index) as FormGroup;
  }

  deleteReagent(index: number) {
    this.reagents.removeAt(index);
  }

  ngOnInit(): void {
    // Initialize the formGroup of the reagents from parent
    this.parentFormGroup.addControl(this.controlKey, this._formBuilder.array([]));
    this.addReagent();
  }

  ngOnDestroy(): void {
    // Cleanup the formGroup of the reagents from parent
    this.reagents.clear();
    this.parentFormGroup.removeControl(this.controlKey);
  }
}
