import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BakReagent } from '../../interfaces/reagents';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BakLotReagent } from '../../interfaces/lot';

@Component({
  selector: 'app-reagent-edit',
  templateUrl: './reagent-edit.component.html',
  styleUrls: ['./reagent-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class ReagentEditComponent {
  @Input() reagent: BakLotReagent;

  @Output() onPatchReagent = new EventEmitter<number>();
}
