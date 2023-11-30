import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCreateComponent } from './batch-create.component';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';

describe('BatchCreateComponent', () => {
  let component: BatchCreateComponent;
  let fixture: ComponentFixture<BatchCreateComponent>;
  let pcrStateHandlerService: jasmine.SpyObj<PCRStateHandlerService>;

  beforeEach(async () => {
    pcrStateHandlerService = jasmine.createSpyObj('PCRStateHandlerService', ['refreshData']);

    await TestBed.configureTestingModule({
      imports: [BatchCreateComponent],
      providers: [
        provideHttpClient(),
        provideNoopAnimations(),
        { provide: PCRStateHandlerService, useValue: pcrStateHandlerService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BatchCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button with id firstContinueButton should be disabled', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#firstContinueButton').disabled).toBe(true);
  });
});
