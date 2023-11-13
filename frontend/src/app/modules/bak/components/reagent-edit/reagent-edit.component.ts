import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BakReagent } from '../../interfaces/reagents';

@Component({
  selector: 'app-reagent-edit',
  templateUrl: './reagent-edit.component.html',
  styleUrls: ['./reagent-edit.component.scss']
})
export class ReagentEditComponent {
  @Input() reagent: BakReagent;

  @Output() onPatchReagent = new EventEmitter<number>();
}
