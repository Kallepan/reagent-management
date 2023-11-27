import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGlobalSearchComponent } from './header-global-search.component';
import { NotificationService } from '@app/core/services/notification.service';
import { NavigationEnd, Router } from '@angular/router';
import { LotAPIService } from '@app/modules/bak/services/lot-api.service';
import { of } from 'rxjs';

describe('HeaderGlobalSearchComponent', () => {
  let component: HeaderGlobalSearchComponent;
  let fixture: ComponentFixture<HeaderGlobalSearchComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;
  let lotAPIService: jasmine.SpyObj<LotAPIService>;

  beforeEach(() => {
    notificationService = jasmine.createSpyObj('NotificationService', ['infoMessage', 'warnMessage']);
    router = jasmine.createSpyObj('Router', ['navigate'], { events: of(new NavigationEnd(1, '', '')) });
    lotAPIService = jasmine.createSpyObj('LotAPIService', ['searchLots']);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderGlobalSearchComponent],
      providers: [
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: router },
        { provide: LotAPIService, useValue: lotAPIService },
      ]
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
});
