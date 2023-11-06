import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BakLot, CreateBakLot } from '../interfaces/lot';
import { constants } from '@app/core/constants/constants';
import { CustomResponseType } from '@app/core/interfaces/response';

@Injectable({
  providedIn: 'any'
})
export class LotAPIService {
  private _http = inject(HttpClient);
  
  getLots(): Observable<BakLot[]> {
    const url = `${constants.APIS.BAK.BASE}/lots/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: new HttpParams({
        fromObject: {
          // is_empty: 'false', TODO: implement
        }
      }),
    };

    return this._http.get<CustomResponseType>(url, httpOptions).pipe(
      map(resp => {
        return resp.data as BakLot[];
      }),
    )
  }

  getLotById(id: string): Observable<BakLot> {
    const url = `${constants.APIS.BAK.BASE}/lots/${id}`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this._http.get<CustomResponseType>(url, httpOptions).pipe(
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
    };

    return this._http.post<CustomResponseType>(url, lot, httpOptions).pipe(
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
    };

    return this._http.patch<CustomResponseType>(url, data, httpOptions).pipe(
      map(resp => {
        return resp.data as BakLot;
      }),
    );
  }
}
