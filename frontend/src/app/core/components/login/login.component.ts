import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  private _fb = inject(FormBuilder);

  loginForm = this._fb.group({
    identifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(5)]],
    password: ['', [Validators.required]]
  });

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.authService.verifyLogin();
  }

  onSubmitLogin() {
    this.authService.login(this.loginForm.controls['identifier'].value, this.loginForm.controls['password'].value);
  }
}
