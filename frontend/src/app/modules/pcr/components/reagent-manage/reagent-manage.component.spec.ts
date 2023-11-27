import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentManageComponent } from './reagent-manage.component';

describe('ReagentManageComponent', () => {
  let component: ReagentManageComponent;
  let fixture: ComponentFixture<ReagentManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReagentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
