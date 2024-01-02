import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NotificationService } from '@app/core/services/notification.service';
import { LotAPIService } from '@app/modules/bak/services/lot-api.service';
import { of } from 'rxjs';
import { HeaderGlobalSearchComponent } from './header-global-search.component';

describe('HeaderGlobalSearchComponent', () => {
  let component: HeaderGlobalSearchComponent;
  let fixture: ComponentFixture<HeaderGlobalSearchComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let lotAPIService: jasmine.SpyObj<LotAPIService>;

  beforeEach(() => {
    notificationService = jasmine.createSpyObj('NotificationService', [
      'infoMessage',
      'warnMessage',
    ]);

    // setup router
    router = jasmine.createSpyObj('Router', ['navigate'], {
      events: of(new NavigationEnd(1, '', '')),
    });
    router.navigate.and.returnValue(Promise.resolve(true));

    // setup lotAPIService
    lotAPIService = jasmine.createSpyObj('LotAPIService', ['searchLots']);

    // setup activatedRoute
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', ['data'], {
      data: of({ featureFlag: 'BAK' }),
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderGlobalSearchComponent],
      providers: [
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: router },
        { provide: LotAPIService, useValue: lotAPIService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`onSearch should call lotAPIService.searchLots`, () => {
    const query = 'query';
    const lot = { id: 1, name: 'lot' } as any;
    lotAPIService.searchLots.and.returnValue(of([lot]));
    component.onSearch('BAK', query);
    expect(lotAPIService.searchLots).toHaveBeenCalled();
  });

  it(`onSearch should call notificationService.infoMessage`, () => {
    const query = 'query';
    const lot = { id: 1, name: 'lot' } as any;
    lotAPIService.searchLots.and.returnValue(of([lot]));
    component.onSearch('BAK', query);
    expect(notificationService.infoMessage).toHaveBeenCalled();
  });

  it(`onSearch should call router.navigate`, () => {
    const query = 'query';
    const lot = { id: 1, name: 'lot' } as any;
    lotAPIService.searchLots.and.returnValue(of([lot]));
    component.onSearch('BAK', query);
    expect(router.navigate).toHaveBeenCalled();
  });

  it('no results should call notificationService.warnMessage', () => {
    const query = 'query';
    lotAPIService.searchLots.and.returnValue(of([]));
    component.onSearch('BAK', query);
    expect(notificationService.warnMessage).toHaveBeenCalled();
  });

  it('should not call lotAPIService.searchLots', () => {
    const query = '';
    component.onSearch('BAK', query);
    expect(lotAPIService.searchLots).not.toHaveBeenCalled();
  });

  it('should not call lotAPIService.searchLots', () => {
    const query = 'aklusijdbnaklsjudbk';
    component.onSearch('', query);
    expect(lotAPIService.searchLots).not.toHaveBeenCalled();
  });

  it('should display PCR Home button if on Route /pcr', () => {
    component.activatedRoute$ = of('PCR');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.pcr-home-button')).toBeTruthy();
  });

  it('should not display PCR Home button if not on Route /pcr', () => {
    component.activatedRoute$ = of('BAK');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.pcr-home-button')).toBeFalsy();
    expect(compiled.querySelector('.lot-create-button')).toBeTruthy();
  });

  it('should navigate to /pcr/batch', () => {
    component.activatedRoute$ = of('PCR');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    // call input method:
    component.onSearch('PCR', 'test');

    // expect router.navigate to have been called
    expect(router.navigate).toHaveBeenCalledWith(['pcr', 'batch'], {
      queryParams: { search: 'test' },
    });
  });

  it('should clear form after navigating to /pcr/batch', fakeAsync(() => {
    component.activatedRoute$ = of('PCR');
    fixture.detectChanges();

    // call input method:
    component.onSearch('PCR', 'test');

    tick();

    // expect form to be cleared
    expect(component.control.value).toEqual('');
  }));
});
