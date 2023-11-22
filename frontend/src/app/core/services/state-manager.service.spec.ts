import { TestBed } from '@angular/core/testing';

import { StateManagerService } from './state-manager.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

describe('StateManagerService', () => {
  let service: StateManagerService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', [], { events: new Subject<NavigationEnd>() });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
      ],
    });
    service = TestBed.inject(StateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have activatedFeature signal initially null', () => {

    expect(service.activatedFeature()).toBeNull();
  });

  it('should change activatedFeature signal when router emits NavigationEnd event', () => {
    const testFeature = 'testFeature';
    (router.events as Subject<NavigationEnd>).next(new NavigationEnd(1, '/' + testFeature, '/' + testFeature));

    expect(service.activatedFeature()).toEqual(testFeature);

  });

  it('should set activatedFeature signal to home when router emits NavigationEnd event with no feature part', () => {
    (router.events as Subject<NavigationEnd>).next(new NavigationEnd(1, '/', '/'));
    expect(service.activatedFeature()).toEqual('home');
  });
});
