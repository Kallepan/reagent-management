import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Analysis } from '../interfaces/simple';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomResponseType } from '@app/core/interfaces/response';
import { constants } from '@app/core/constants/constants';

@Injectable({
  providedIn: null
})
export class AnalysisService {
  private http = inject(HttpClient);

  getAnalysisByID(id: string): Observable<Analysis> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(constants.APIS.PCR.BASE + '/analyses/' + id, httpOptions).pipe(
      map(resp => {
        return resp.data as Analysis;
      })
    );
  }

  getAnalyses(): Observable<Analysis[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(constants.APIS.PCR.BASE + '/analyses', httpOptions).pipe(
      map(resp => {
        return resp.data.results as Analysis[];
      })
    );
  }
}
