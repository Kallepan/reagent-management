import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { BakLot, CreateBakLot } from '../interfaces/lot';
import { constants } from '@app/core/constants/constants';
import { CustomResponseType } from '@app/core/interfaces/response';

@Injectable({
  providedIn: null,
})
export class LotAPIService {
  private http = inject(HttpClient);

  getLots(): Observable<BakLot[]> {
    const url = `${constants.APIS.BAK.BASE}/lots/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: new HttpParams({
        fromObject: {
          is_empty: 'false',
        }
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(url, httpOptions).pipe(
      map(resp => {
        return resp.data.results as BakLot[];
      }),
    )
  }

  searchLots(query: { [param: string]: string | number | boolean | readonly (string | number | boolean)[]; }): Observable<BakLot[]> {
    const url = `${constants.APIS.BAK.BASE}/lots/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: new HttpParams({
        fromObject: query,
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(url, httpOptions).pipe(
      map(resp => {
        return resp.data.results as BakLot[];
      }),
    )
  }

  getLotById(id: string): Observable<BakLot> {
    const url = `${constants.APIS.BAK.BASE}/lots/${id}`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(url, httpOptions).pipe(
      map(resp => {
        return resp.data as BakLot;
      }),
    )
  }

  postLot(lot: CreateBakLot): Observable<BakLot> {
    const url = `${constants.APIS.BAK.BASE}/lots/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.post<CustomResponseType>(url, lot, httpOptions).pipe(
      map(resp => {
        return resp.data as BakLot;
      }),
    )
  }

  patchLot(lotId: string, data: any) {
    const url = `${constants.APIS.BAK.BASE}/lots/${lotId}/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.patch<CustomResponseType>(url, data, httpOptions).pipe(
      map(resp => {
        return resp.data as BakLot;
      }),
    );
  }

  deleteLot(lotId: string) {
    const url = `${constants.APIS.BAK.BASE}/lots/${lotId}/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.delete<CustomResponseType>(url, httpOptions);
  }
}
