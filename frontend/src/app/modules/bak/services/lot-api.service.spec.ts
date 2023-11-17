import { TestBed } from '@angular/core/testing';

import { LotAPIService } from './lot-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LotAPIService', () => {
  let service: LotAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LotAPIService],
    });
    service = TestBed.inject(LotAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
