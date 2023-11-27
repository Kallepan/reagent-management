import { Injectable } from '@angular/core';
import { Kind } from '../interfaces/simple';
import { Observable, of } from 'rxjs';

const mockKinds: Kind[] = [
  {
    id: "1",
    name: "Standard",
  },
  {
    id: "2",
    name: "Kontrolle",
  },
  {
    id: "3",
    name: "Mastermix",
  },
];

@Injectable({
  providedIn: 'root'
})
export class KindService {

  constructor() { }

  getKind(name: string): Observable<Kind> {
    return of(mockKinds.find(kind => kind.name === name)!);
  }

  getKinds(): Observable<Kind[]> {
    return of(mockKinds);
  }
}
