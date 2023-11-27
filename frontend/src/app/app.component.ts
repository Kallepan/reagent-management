import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MainComponent } from './core/components/main/main.component';
import { RouterOutlet } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MainComponent,
    RouterOutlet,
    MatSnackBarModule,
  ],
})
export class AppComponent {

}
