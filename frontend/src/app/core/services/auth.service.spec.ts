import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { constants } from '../constants/constants';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        NotificationService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('authData should return null', () => {
    expect(service.authData()).toBeNull();
  });

  it('logout should set authData to null', () => {
    service.logout();
    const req = httpMock.expectOne(`${constants.APIS.AUTH}/logout/`);
    expect(req.request.method).toBe('POST');
    req.flush({});
    expect(service.authData()).toBeNull();
  });

  it('login should set authData', () => {
    service.login('test', 'test');
    const req = httpMock.expectOne(`${constants.APIS.AUTH}/`);
    expect(req.request.method).toBe('POST');
    req.flush({ department: 'test' });
    expect(service.authData()).toEqual({ department: 'test' });
  });
});
