import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { constants } from '@app/core/constants/constants';
import { Observable } from 'rxjs';
import { CreateRemoval, Removal } from '../interfaces/removal';

@Injectable({
  providedIn: null
})
export class RemovalService {
  private http = inject(HttpClient);

  constructor() { }

  postRemoval(removal: CreateRemoval): Observable<any> {
    const url = `${constants.APIS.PCR.BASE}/removals/`;

    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    return this.http.post<any>(url, removal, httpOptions);
  }

  updateRemoval(removal: Removal): Observable<Removal> {
    const url = `${constants.APIS.PCR.BASE}/removals/${removal.id}`;

    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    return this.http.patch<Removal>(url, removal, httpOptions);
  }

  deleteRemoval(removalID: string): Observable<any> {
    const url = `${constants.APIS.PCR.BASE}/removals/${removalID}`;

    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    return this.http.delete<any>(url, httpOptions);
  }
}
