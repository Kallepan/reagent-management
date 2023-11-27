import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGlobalSearchComponent } from './header-global-search.component';

describe('HeaderGlobalSearchComponent', () => {
  let component: HeaderGlobalSearchComponent;
  let fixture: ComponentFixture<HeaderGlobalSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderGlobalSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
