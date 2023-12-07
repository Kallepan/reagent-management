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

  // returns a CSS-Class depending on current_amount of reagent at index.
  protected getStyle(index: number) {
    const reagent = this.reagents[index];
    switch (reagent.current_amount) {
      case reagent.initial_amount:
        return 'full';
      case 0:
        return 'empty';
      default:
        return 'partial';
    }
  }
}
