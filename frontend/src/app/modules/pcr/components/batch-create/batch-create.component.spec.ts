import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCreateComponent } from './batch-create.component';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('BatchCreateComponent', () => {
  let component: BatchCreateComponent;
  let fixture: ComponentFixture<BatchCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchCreateComponent],
      providers: [
        provideHttpClient(),
        provideNoopAnimations()
      ]
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
