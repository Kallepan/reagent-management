import { Injectable, inject } from '@angular/core';
import { Kind } from '../interfaces/simple';
import { Observable, map, of } from 'rxjs';
import { CustomResponseType } from '@app/core/interfaces/response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { constants } from '@app/core/constants/constants';

@Injectable({
  providedIn: null
})
export class KindService {

  private http = inject(HttpClient);

  getKindByID(id: string): Observable<Kind> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(constants.APIS.PCR.BASE + '/kinds/' + id, httpOptions).pipe(
      map(resp => {
        return resp.data as Kind;
      })
    );
  }

  getKinds(): Observable<Kind[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(constants.APIS.PCR.BASE + '/kinds', httpOptions).pipe(
      map(resp => {
        return resp.data.results as Kind[];
      })
    );
  }
}
