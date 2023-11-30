import { TestBed } from '@angular/core/testing';

import { BatchAPIService } from './batch-api.service';

describe('BatchAPIService', () => {
  let service: BatchAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BatchAPIService
      ],
    });
    service = TestBed.inject(BatchAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
