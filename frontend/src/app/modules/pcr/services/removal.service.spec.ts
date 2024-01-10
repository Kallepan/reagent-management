import { TestBed } from '@angular/core/testing';

import { RemovalService } from './removal.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('RemovalService', () => {
  let service: RemovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RemovalService,
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(RemovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
