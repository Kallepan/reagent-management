import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BakReagent } from '../interfaces/reagents';
import { constants } from '@app/core/constants/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReagentAPIService {
  private http = inject(HttpClient);

  patchReagent(reagentId: string, amount: number): Observable<BakReagent> {
    const url = `${constants.APIS.BAK.BASE}/reagents/${reagentId}/`

    const body = {
      amount: amount,
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http.patch<any>(url, body, httpOptions).pipe(
      map((resp) => resp.data as BakReagent),
    );
  }
}
