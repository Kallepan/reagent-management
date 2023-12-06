import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { constants } from '@app/core/constants/constants';
import { CustomResponseType } from '@app/core/interfaces/response';
import { Observable, map, merge } from 'rxjs';
import { Batch, CreateBatch, CreateReagent } from '../interfaces/reagent';

@Injectable({
  providedIn: null
})
export class BatchAPIService {
  private http = inject(HttpClient);

  deleteBatch(batchID: string): Observable<any> {
    const url = `${constants.APIS.PCR.BASE}/batches/${batchID}/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.delete<CustomResponseType>(url, httpOptions) // No data returned
  }

  getBatch(batchID: string): Observable<Batch> {
    const url = `${constants.APIS.PCR.BASE}/batches/${batchID}/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(url, httpOptions).pipe(
      map(resp => {
        return resp.data as Batch;
      }),
    )
  }

  searchBatch(query: { [param: string]: string | number | boolean | readonly (string | number | boolean)[]; }): Observable<Batch[]> {
    const url = `${constants.APIS.PCR.BASE}/batches/`

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
        return resp.data.results as Batch[];
      }),
    );
  }

  createBatch(batchData: CreateBatch): Observable<any> {
    const url = `${constants.APIS.PCR.BASE}/batches/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.post<CustomResponseType>(url, batchData, httpOptions).pipe(
      map(resp => {
        return resp.data;
      }),
    );
  }

  createReagents(reagents: CreateReagent[]): Observable<any> {
    const url = `${constants.APIS.PCR.BASE}/reagents/`

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    const obsArr: Observable<any>[] = reagents.map((reagent) => {
      return this.http.post<CustomResponseType>(url, reagent, httpOptions).pipe(
        map(resp => {
          return resp
        }),
      );
    });

    return merge(...obsArr);
  }
}