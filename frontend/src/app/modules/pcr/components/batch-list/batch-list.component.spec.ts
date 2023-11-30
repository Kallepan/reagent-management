import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchListComponent } from './batch-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NotificationService } from '@app/core/services/notification.service';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { AnalysisService } from '../../services/analysis.service';
import { DeviceService } from '../../services/device.service';
import { KindService } from '../../services/kind.service';
import { RemovalService } from '../../services/removal.service';

describe('BatchListComponent', () => {
  let component: BatchListComponent;
  let fixture: ComponentFixture<BatchListComponent>;

  let notificationService: jasmine.SpyObj<NotificationService>;
  let pcrStateHandlerService: jasmine.SpyObj<PCRStateHandlerService>;

  beforeEach(async () => {
    notificationService = jasmine.createSpyObj('NotificationService', ['warnMessage', 'infoMessage']);
    pcrStateHandlerService = jasmine.createSpyObj('PCRStateHandlerService', ['refreshData']);

    await TestBed.configureTestingModule({
      imports: [BatchListComponent],
      providers: [
        provideHttpClient(),
        provideNoopAnimations(),
        { provide: NotificationService, useValue: notificationService },
        { provide: PCRStateHandlerService, useValue: pcrStateHandlerService },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
