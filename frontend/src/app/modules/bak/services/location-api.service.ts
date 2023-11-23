import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { constants } from '@app/core/constants/constants';
import { Observable, map } from 'rxjs';
import { BakLocation } from '../interfaces/location';
import { CustomResponseType } from '@app/core/interfaces/response';

@Injectable({
  providedIn: 'any'
})
export class LocationAPIService {
  private http = inject(HttpClient);

  getLocations(): Observable<BakLocation[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(constants.APIS.BAK.BASE + '/locations', httpOptions).pipe(
      map(resp => {
        return resp.data.results as BakLocation[];
      }),
    );
  }

  getLocationById(id: string): Observable<BakLocation> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(constants.APIS.BAK.BASE + '/locations/' + id, httpOptions).pipe(
      map(resp => {
        return resp.data as BakLocation;
      })
    );
  }
}
