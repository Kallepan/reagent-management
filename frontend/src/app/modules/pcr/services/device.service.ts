import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Device } from '../interfaces/simple';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomResponseType } from '@app/core/interfaces/response';
import { constants } from '@app/core/constants/constants';

@Injectable({
  providedIn: null,
})
export class DeviceService {
  private http = inject(HttpClient);

  getDeviceByID(id: string): Observable<Device> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http
      .get<CustomResponseType>(
        constants.APIS.PCR.BASE + '/devices/' + id,
        httpOptions,
      )
      .pipe(
        map((resp) => {
          return resp.data as Device;
        }),
      );
  }

  getDevices(): Observable<Device[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    return this.http
      .get<CustomResponseType>(
        constants.APIS.PCR.BASE + '/devices',
        httpOptions,
      )
      .pipe(
        map((resp) => {
          return resp.data.results as Device[];
        }),
        map((devices) => {
          // change default order, BeGe01 should be last
          // InGe should be sorted by name
          return devices.sort((a, b) => {
            if (a.name.includes('BeGe')) {
              return 1;
            } else if (b.name.includes('BeGe')) {
              return -1;
            }

            return a.name.localeCompare(b.name);
          });
        }),
      );
  }
}
