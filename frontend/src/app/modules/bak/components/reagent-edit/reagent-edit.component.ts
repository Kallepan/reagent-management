import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BakReagent } from '../../interfaces/reagents';
import { BakLotReagent } from '../../interfaces/lot';

@Component({
  selector: 'app-reagent-edit',
  templateUrl: './reagent-edit.component.html',
  styleUrls: ['./reagent-edit.component.scss']
})
export class ReagentEditComponent {
  @Input() reagent: BakLotReagent;

  @Output() onPatchReagent = new EventEmitter<number>();
}
