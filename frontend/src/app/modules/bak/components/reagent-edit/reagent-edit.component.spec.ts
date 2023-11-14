import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentEditComponent } from './reagent-edit.component';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

describe('ReagentEditComponent', () => {
  let component: ReagentEditComponent;
  let fixture: ComponentFixture<ReagentEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule
      ],
      declarations: [ReagentEditComponent]
    });
    fixture = TestBed.createComponent(ReagentEditComponent);
    component = fixture.componentInstance;
    component.reagent = {
      amount: 1,
      id: "1",
      location: {
        name: "test",
        id: "1"
      }
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should emit an event on add button click`, () => {
    spyOn(component.onPatchReagent, 'emit');
    const button = fixture.debugElement.query(By.css('button:first-child')).nativeElement;
    button.click();
    expect(component.onPatchReagent.emit).toHaveBeenCalled();
  });

  it(`should emit an event on remove button click`, () => {
    spyOn(component.onPatchReagent, 'emit');
    const button = fixture.debugElement.query(By.css('button:last-child')).nativeElement;
    button.click();
    expect(component.onPatchReagent.emit).toHaveBeenCalled();
  });
});
