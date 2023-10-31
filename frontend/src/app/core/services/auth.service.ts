import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { constants } from '../constants/constants';
import { errors } from '../constants/errors';
import { map } from 'rxjs';

type AuthData = {
  access: string;
  refresh: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);
  private _notificationService = inject(NotificationService);
  private _router = inject(Router);

  private _authData = signal<AuthData|null>(null);
  isLoggedIn = computed(() => {
    return this._authData() !== null;
  });

  login(identifier: string | null, password: string | null) {
    const data = {
      identifier,
      password
    };
 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this._http.post<any>(constants.APIS.AUTH, data, httpOptions).pipe(
      map(resp => {
        return {
          access: resp.access,
          refresh: resp.refresh,
          department: data.identifier!
        };
      }),
    ).subscribe({
      next: data => {
        this._authData.set(data);
      },
      error: () => {
        this._notificationService.warnMessage(errors.AUTH.LOGIN.INVALID_CREDENTIALS);
      }
    });
  }

  logout() {
    this._authData.set(null);
    this._router.navigateByUrl('/');
  }

  get authData() {
    return this._authData;
  }
}
