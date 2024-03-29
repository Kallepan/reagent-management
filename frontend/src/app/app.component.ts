import { Component } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MainComponent } from './core/components/main/main.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [MainComponent, MatSnackBarModule],
})
export class AppComponent {}
