import { TestBed } from '@angular/core/testing';

import { AnalysisService } from './analysis.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalysisService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
