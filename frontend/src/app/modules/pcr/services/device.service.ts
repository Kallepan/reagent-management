import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Device } from '../interfaces/simple';

const mockDevices: Device[] = [
  {
    id: "1",
    name: "InGe 1",
  },
  {
    id: "2",
    name: "InGe 2",
  },
  {
    id: "3",
    name: "InGe 3",
  },
  {
    id: "4",
    name: "Test 1",
  }
];

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor() { }

  getDevice(id: string): Observable<Device> {
    return of(mockDevices.find(device => device.id === id)!);
  }

  getDevices(): Observable<Device[]> {
    return of(mockDevices);
  }
}
