import { TestBed } from '@angular/core/testing';

import { PCRStateHandlerService } from './pcrstate-handler.service';
import { RemovalService } from './removal.service';

describe('PCRStateHandlerService', () => {
  let service: PCRStateHandlerService;
  let removalService: jasmine.SpyObj<RemovalService>;

  beforeEach(() => {
    removalService = jasmine.createSpyObj('RemovalService', ['remove']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: RemovalService,
          useValue: removalService,
        }
      ]
    });
    service = TestBed.inject(PCRStateHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
