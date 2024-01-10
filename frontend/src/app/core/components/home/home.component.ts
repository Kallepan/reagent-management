import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { constants } from '@app/core/constants/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  routes = constants.ROUTES;

  title = constants.TITLE_LONG;
}
