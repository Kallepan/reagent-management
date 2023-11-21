import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { Observable, filter } from 'rxjs';
import { Analysis, Device } from '../../interfaces/simple';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BaseType } from '../../interfaces/base';
import { ReagentCreateComponent } from './reagent-create/reagent-create.component';

export type FormControlInfo = {
  label: string;
  key: string;
  type: 'text' | 'number';
  placeholder?: string;
  autcomplete?: boolean;
  data?: Observable<BaseType[]>;
  hint: string;
};

@Component({
  selector: 'app-batch-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,

    ReagentCreateComponent,
  ],
  templateUrl: './batch-create.component.html',
  styleUrl: './batch-create.component.scss',
})
export class BatchCreateComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  groupForm = this._formBuilder.group({
    device: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(5)]],
    amount: [1, [Validators.required, Validators.min(1)]],
    analysis: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(5)]],
  });

  reagentsFormGroup = this._formBuilder.group({});

  // pcrStateHandlerService keeps track of the state of the pcr module and all data necessary for the forms
  private _pcrStateHandlerService = inject(PCRStateHandlerService);
  analyses: Observable<Analysis[]> = this._pcrStateHandlerService.analyses;
  devices: Observable<Device[]> = this._pcrStateHandlerService.devices;

  // used to display the forms:
  shownFormControls: FormControlInfo[] = [
    {
      label: 'Gerät',
      key: 'device',
      type: 'text',
      placeholder: 'z.B. InGe01',
      autcomplete: true,
      data: this.devices,
      hint: 'Name des Geräts'
    },
    {
      label: 'Menge',
      key: 'amount',
      type: 'number',
      hint: 'Menge der Reagenzien je Reagenz'
    },
    {
      label: 'Analyse',
      key: 'analysis',
      type: 'text',
      placeholder: 'z.B. CLO',
      autcomplete: true,
      data: this.analyses,
      hint: 'Name der Analyse'
    },
  ];

  ngOnInit(): void {
    this.groupForm.get('amount')?.valueChanges.pipe(
      filter((value) => typeof value === 'number' && !isNaN(value)),
      filter((value) => value! > 0),
    )
  }
}
