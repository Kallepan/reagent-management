import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness } from '@angular/material/chips/testing';
import { DUMMY_BATCH } from '../../tests/constants';
import { ReagentManageComponent } from './reagent-manage.component';

describe('ReagentManageComponent', () => {
  let component: ReagentManageComponent;
  let fixture: ComponentFixture<ReagentManageComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentManageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReagentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display reagent manage title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent.trim()).toContain('Reagenzien in diesem Batch');
  });

  it('should contain reagent id, initial_amount and current_amount', async () => {
    // Set dummy batch
    component.reagents = DUMMY_BATCH.reagents;
    fixture.detectChanges();

    // Fetch mat chips using MatChipHarness
    const chips = await loader.getAllHarnesses(MatChipHarness);

    // Check if chips are displayed
    expect(chips.length).toEqual(DUMMY_BATCH.reagents.length);

    // Check if chips contain reagent id, initial_amount and current_amount
    DUMMY_BATCH.reagents.forEach(async (reagent, index) => {
      const text = await chips[index].getText();
      expect(text).toContain(reagent.id);
      expect(text).toContain(`${reagent.initial_amount}`);
      expect(text).toContain(`${reagent.current_amount}`);
    });
  });
});
