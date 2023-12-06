import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { Reagent } from '../../interfaces/reagent';

@Component({
  selector: 'app-reagent-manage',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './reagent-manage.component.html',
  styleUrl: './reagent-manage.component.scss'
})
export class ReagentManageComponent {
  @Input({ required: true }) reagents: Reagent[] = [];
  @Input() index: number;
  @Input() selected: boolean;

  // Emits a boolean value when the user clicks on the remove button.
  @Output() selectionChange = new EventEmitter<MatChipSelectionChange>();
}
