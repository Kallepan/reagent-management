import { Injectable, inject } from '@angular/core';
import { CreateRemoval } from '../interfaces/removal';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: null
})
export class RemovalService {

  private http = inject(HttpClient);

  constructor() { }

  postRemoval(removal: CreateRemoval) {
    console.log(removal);
  }

  deleteRemoval(removalID: string) {
    console.log(removalID);
  }
}
