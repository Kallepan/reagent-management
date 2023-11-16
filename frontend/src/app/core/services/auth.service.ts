import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { constants } from '../constants/constants';
import { catchError, map } from 'rxjs';
import { messages } from '../constants/messages';

type AuthData = {
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private _notificationService = inject(NotificationService);
  private _router = inject(Router);

  private _authData = signal<AuthData | null>(null);
  isLoggedIn = computed(() => {
    return this._authData() !== null;
  });

  verifyLogin() {
    /* Called at ngOnInit() in app.component.ts to check if the user is logged in using cookies */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    this.http.get<any>(`${constants.APIS.AUTH}/verify`, httpOptions).pipe(
      map(resp => {
        return {
          department: resp.identifier,
        };
      }),
      catchError(() => {
        // DO NOTHING
        return [];
      }),
    ).subscribe({
      next: data => {
        this._authData.set(data);
        this._notificationService.infoMessage(messages.AUTH.LOGGED_IN);
      },
    });
  }

  login(identifier: string | null, password: string | null) {
    const data = {
      identifier,
      password
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    this.http.post<any>(`${constants.APIS.AUTH}/`, data, httpOptions).pipe(
      map(resp => {
        return {
          department: data.identifier!
        };
      }),
    ).subscribe({
      next: data => {
        this._authData.set(data);
        this._notificationService.infoMessage(messages.AUTH.LOGGED_IN);
      },
      error: () => {
        this._notificationService.warnMessage(messages.AUTH.INVALID_CREDENTIALS);
      }
    });
  }

  logout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    // TODO - call the logout API
    this.http.post<any>(`${constants.APIS.AUTH}/logout/`, {}, httpOptions).subscribe({
      next: () => {
        this._authData.set(null);
        this._notificationService.infoMessage(messages.AUTH.LOGGED_OUT);
        this._router.navigate(['']);
      },
    });
  }

  get authData() {
    return this._authData;
  }
}
