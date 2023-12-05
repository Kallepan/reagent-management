import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { constants } from '@app/core/constants/constants';
import { HeaderGlobalSearchComponent } from '../header-global-search/header-global-search.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    LoginComponent,
    HeaderGlobalSearchComponent,
    RouterLink,
  ],
})
export class HeaderComponent {
  title = constants.TITLE_SHORT;
  @Input() isDark = false;
  @Output() onToggleTheme = new EventEmitter<void>();
  @Output() onToggleSidenav = new EventEmitter<void>();

  toggleTheme() {
    this.onToggleTheme.emit();
  }

  toggleSidenav() {
    this.onToggleSidenav.emit();
  }
}
