import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentCreateComponent } from './reagent-create.component';

describe('ReagentCreateComponent', () => {
  let component: ReagentCreateComponent;
  let fixture: ComponentFixture<ReagentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReagentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
