import { TestBed } from '@angular/core/testing';

import { RemovalService } from './removal.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemovalService', () => {
  let service: RemovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(RemovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
