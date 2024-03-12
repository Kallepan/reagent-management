import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { constants } from '@app/core/constants/constants';
import { CustomResponseType } from '@app/core/interfaces/response';
import { Observable, map } from 'rxjs';
import { Product } from '../interfaces/type';

@Injectable({
  providedIn: null,
})
export class ProductAPIService {
  private http = inject(HttpClient);
  products$ = this.getProducts();

  getProducts(): Observable<Product[]> {
    const url = `${constants.APIS.BAK.BASE}/products`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
      params: new HttpParams({
        fromObject: {
          limit: constants.BAK.PRODUCTS_LIMIT,
        },
      }),
    };

    return this.http.get<CustomResponseType>(url, httpOptions).pipe(
      map((resp) => {
        return resp.data.results as Product[];
      }),
    );
  }

  getProductById(id: string): Observable<Product> {
    const url = `${constants.APIS.BAK.BASE}/products/${id}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.get<CustomResponseType>(url, httpOptions).pipe(
      map((resp) => {
        return resp.data as Product;
      }),
    );
  }
}
