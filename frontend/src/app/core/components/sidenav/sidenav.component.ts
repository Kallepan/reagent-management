import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { constants } from '@app/core/constants/constants';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  routes = constants.ROUTES;
  @Output() closeSidenav = new EventEmitter<void>();
}
