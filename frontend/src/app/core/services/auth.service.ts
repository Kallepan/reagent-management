import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, type WritableSignal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { from, map, switchMap, tap, timeout } from 'rxjs';
import { constants } from '../constants/constants';
import { messages } from '../constants/messages';
import { NotificationService } from './notification.service';

interface AuthData {
  department: string
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _notificationService = inject(NotificationService);
  private readonly _router = inject(Router);

  private readonly _authData = signal<AuthData | null | undefined>(undefined);

  initialized = computed(() => {
    return this._authData() !== undefined;
  });

  isLoggedIn = computed(() => {
    return this._authData() !== null && this._authData() !== undefined;
  });

  verifyLogin (): void {
    /* Called at ngOnInit() in app.component.ts to check if the user is logged in using cookies */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    this.http.get<any>(`${constants.APIS.AUTH}/verify`, httpOptions).pipe(
      timeout(4000),
      map(resp => {
        return {
          department: resp.identifier
        };
      })
    ).subscribe({
      next: data => {
        this._authData.set(data);
        this._notificationService.infoMessage(messages.AUTH.LOGGED_IN);
      },
      error: () => {
        this._authData.set(null);
      }
    });
  }

  login (identifier: string | null, password: string | null): void {
    const data = {
      identifier,
      password
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    this.http.post<any>(`${constants.APIS.AUTH}/`, data, httpOptions).pipe(
      map(() => {
        return data.identifier === null ? null : { department: data.identifier };
      }),
      tap(data => { this._authData.set(data); })
    ).subscribe({
      next: () => {
        this._notificationService.infoMessage(messages.AUTH.LOGGED_IN);
      },
      error: () => {
        this._notificationService.warnMessage(messages.AUTH.INVALID_CREDENTIALS);
      }
    });
  }

  logout (): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    this.http.post<any>(`${constants.APIS.AUTH}/logout/`, {}, httpOptions).pipe(
      tap(() => { this._authData.set(null); }),
      switchMap(() => from(this._router.navigate([''])))
    ).subscribe({
      next: () => {
        this._notificationService.infoMessage(messages.AUTH.LOGGED_OUT);
      }
    });
  }

  get authData (): WritableSignal<AuthData | null | undefined> {
    return this._authData;
  }
}
