import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Analysis } from '../interfaces/simple';

const mockAnalyses: Analysis[] = [
  {
    id: "1",
    name: "Analysis 1",
  },
  {
    id: "2",
    name: "Analysis 2",
  },
  {
    id: "3",
    name: "Analysis 3",
  }
];
@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor() { }

  getAnalysis(id: string): Observable<Analysis> {
    return of(mockAnalyses.find(analysis => analysis.id === id)!);
  }

  getAnalyses(): Observable<Analysis[]> {
    return of(mockAnalyses);
  }
}
