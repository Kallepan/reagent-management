import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BatchAPIService } from './batch-api.service';

describe('BatchAPIService', () => {
  let service: BatchAPIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BatchAPIService,
        { provide: HttpClient, useValue: httpMock },
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(BatchAPIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
