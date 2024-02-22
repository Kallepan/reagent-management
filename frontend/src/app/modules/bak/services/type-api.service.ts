import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BakType } from '../interfaces/type';
import { constants } from '@app/core/constants/constants';
import { CustomResponseType } from '@app/core/interfaces/response';

@Injectable({
  providedIn: null,
})
export class TypeAPIService {
  private http = inject(HttpClient);
  types$ = this.getTypes();

  getTypes(): Observable<BakType[]> {
    const url = `${constants.APIS.BAK.BASE}/types`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
      params: new HttpParams({
        fromObject: {
          limit: constants.BAK.TYPES_LIMIT
        }
      })
    };

    return this.http.get<CustomResponseType>(url, httpOptions).pipe(
      map(resp => {
        return resp.data.results as BakType[];
      }),
    )
  }

  getTypeById(id: string): Observable<BakType> {
    const url = `${constants.APIS.BAK.BASE}/types/${id}`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(url, httpOptions).pipe(
      map(resp => {
        return resp.data as BakType;
      }),
    )
  }

}