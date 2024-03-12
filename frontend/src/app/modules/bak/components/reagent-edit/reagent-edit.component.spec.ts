import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReagentEditComponent } from './reagent-edit.component';

describe('ReagentEditComponent', () => {
  let component: ReagentEditComponent;
  let fixture: ComponentFixture<ReagentEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatIconModule, ReagentEditComponent],
    });
    fixture = TestBed.createComponent(ReagentEditComponent);
    component = fixture.componentInstance;
    component.reagent = {
      amount: 1,
      id: '1',
      location: {
        name: 'test',
        id: '1',
      },
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have as many buttons as defined in the buttonConfigs', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(component.buttonConfigs.length);
  });

  it('should emit the correct amount when a button is clicked', () => {
    const spy = spyOn(component.onPatchReagent, 'emit');
    (fixture.nativeElement.querySelectorAll('button') as any[]).forEach((button, index) => {
      const expectedAmount =
        component.reagent.amount + component.buttonConfigs[index].amountToBeAddedToTheReagent < 0
          ? 0
          : component.reagent.amount + component.buttonConfigs[index].amountToBeAddedToTheReagent;
      button.click();
      expect(spy).toHaveBeenCalledWith(expectedAmount);
      spy.calls.reset();
    });
  });

  it('each button should have a grid-column property', () => {
    (fixture.nativeElement.querySelectorAll('button') as any[]).forEach((button, index) => {
      expect(button.style.gridColumn).toBe(component.buttonConfigs[index].gridColumn.toString());
    });
  });
});
