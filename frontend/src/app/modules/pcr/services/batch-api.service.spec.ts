import { TestBed } from '@angular/core/testing';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BatchAPIService } from './batch-api.service';

describe('BatchAPIService', () => {
  let service: BatchAPIService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BatchAPIService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(BatchAPIService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a default amount for given analysisID and kindID', () => {
    const analysisID = '1';
    const kindID = '1';
    const amount = 10;

    service.getDefaultAmountForBatch(analysisID, kindID).subscribe((res) => {
      expect(res).toEqual(amount);
    });

    const req = httpMock.expectOne(
      `http://localhost:8000/api/v1/pcr/amounts/?analysis=${analysisID}&kind=${kindID}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      data: {
        results: [
          {
            value: amount,
          },
        ],
      },
    });
  });

  it('getDefaultAmountForBatch should return 1 if no defaultAmounts could be found in the backend', () => {
    const analysisID = '1';
    const kindID = '1';

    service.getDefaultAmountForBatch(analysisID, kindID).subscribe((res) => {
      expect(res).toEqual(0);
    });

    const req = httpMock.expectOne(
      `http://localhost:8000/api/v1/pcr/amounts/?analysis=${analysisID}&kind=${kindID}`,
    );

    expect(req.request.method).toBe('GET');
    req.flush({
      data: {
        results: [],
      },
    });
  });
});
