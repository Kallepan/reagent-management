import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Reagent } from '../../interfaces/reagent';
import { Removal } from '../../interfaces/removal';

@Component({
  selector: 'app-removal-manage',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatButtonModule,],
  templateUrl: './removal-manage.component.html',
  styleUrl: './removal-manage.component.scss',
  animations: [
    trigger('appearInOut', [
      state('void', style({ height: 0 })),
      state('*', style({ height: '*' })),
      transition(':enter', [animate('0.3s')]),
      transition(':leave', [animate('0.3s')]),
    ]),
    trigger('increaseOpacity', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', [animate('0.1s ease-in')]),
      transition(':leave', [animate('0.15s ease-out')]),
    ]),
  ],
})
export class RemovalManageComponent {
  @Input() reagent: Reagent | null = null;

  @Output() onCreate = new EventEmitter<Reagent>();
  @Output() onDelete = new EventEmitter<Removal>();
}
