import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { By } from '@angular/platform-browser';
import { ChooseTypeFilterComponent } from './choose-type-filter.component';
import { FilterTrackerService } from './filter-tracker.service';

describe('ChooseTypeFilterComponent', () => {
  let component: ChooseTypeFilterComponent;
  let fixture: ComponentFixture<ChooseTypeFilterComponent>;
  let loader: HarnessLoader;

  let mockFilterTrackerService: jasmine.SpyObj<FilterTrackerService>;

  beforeEach(async () => {
    mockFilterTrackerService = jasmine.createSpyObj('FilterTrackerService', [
      'productTypesToBeFilteredOut$',
      'toggleFilter',
    ]);

    await TestBed.configureTestingModule({
      imports: [ChooseTypeFilterComponent],
      providers: [{ provide: FilterTrackerService, useValue: mockFilterTrackerService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain as many checkboxes as there are product types', () => {
    mockFilterTrackerService.productTypesToBeFilteredOut$.and.returnValue([
      {
        id: '1',
        name: 'type 1',
        checked: false,
      },
      {
        id: '2',
        name: 'type 2',
        checked: false,
      },
    ]);
    fixture.detectChanges();
    const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    expect(checkboxes.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('type 1');
  });

  it('should call toggleFilter of filterTrackerService when a checkbox is clicked', async () => {
    mockFilterTrackerService.productTypesToBeFilteredOut$.and.returnValue([
      {
        id: '1',
        name: 'type 1',
        checked: false,
      },
    ]);
    fixture.detectChanges();

    const checkbox = await loader.getHarness(MatCheckboxHarness);
    await checkbox.check();
    expect(await checkbox.isChecked()).toBe(true);
    expect(mockFilterTrackerService.toggleFilter).toHaveBeenCalled();
  });
});
