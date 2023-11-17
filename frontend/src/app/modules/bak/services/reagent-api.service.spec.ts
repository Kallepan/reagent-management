import { TestBed } from '@angular/core/testing';

import { ReagentAPIService } from './reagent-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReagentAPIService', () => {
  let service: ReagentAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReagentAPIService],
    });
    service = TestBed.inject(ReagentAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
