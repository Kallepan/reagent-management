import { TestBed } from '@angular/core/testing';

import { KindService } from './kind.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('KindService', () => {
  let service: KindService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KindService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(KindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
