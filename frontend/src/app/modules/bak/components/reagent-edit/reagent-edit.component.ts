import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BakLotReagent } from '../../interfaces/lot';

@Component({
  selector: 'app-reagent-edit',
  templateUrl: './reagent-edit.component.html',
  styleUrls: ['./reagent-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class ReagentEditComponent {
  @Input() reagent: BakLotReagent;

  @Output() onPatchReagent = new EventEmitter<number>();

  buttonConfigs = [
    { amountToBeAddedToTheReagent: 100, text: '+100', gridColumn: 2 },
    { amountToBeAddedToTheReagent: 10, text: '+10', gridColumn: 3 },
    { amountToBeAddedToTheReagent: 1, text: '+1', gridColumn: 4 },
    // 5 is reserved for the reagent amount
    { amountToBeAddedToTheReagent: -1, text: '-1', gridColumn: 6 },
    { amountToBeAddedToTheReagent: -10, text: '-10', gridColumn: 7 },
    { amountToBeAddedToTheReagent: -100, text: '-100', gridColumn: 8 },
  ];
}
