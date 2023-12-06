import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { constants } from '../constants/constants';
import { messages } from '../constants/messages';
import { NotificationService } from './notification.service';

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

  private _authData = signal<AuthData | null | undefined>(undefined);

  initialized = computed(() => {
    return this._authData() !== undefined;
  });
  isLoggedIn = computed(() => {
    return this._authData() !== null && this._authData() !== undefined;
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
    ).subscribe({
      next: data => {
        this._authData.set(data);
        this._notificationService.infoMessage(messages.AUTH.LOGGED_IN);
      },
      error: () => {
        this._authData.set(null);
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
      map(() => {
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
