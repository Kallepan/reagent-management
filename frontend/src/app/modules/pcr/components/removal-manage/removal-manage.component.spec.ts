import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatListItemHarness } from '@angular/material/list/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DUMMY_REAGENT } from '../../tests/constants';
import { RemovalManageComponent } from './removal-manage.component';

describe('RemovalManageComponent', () => {
  let component: RemovalManageComponent;
  let fixture: ComponentFixture<RemovalManageComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemovalManageComponent],
      providers: [
        provideNoopAnimations(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RemovalManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message if reagent is null', () => {
    component.reagent = null;
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelector('p');
    expect(message.textContent.trim()).toEqual('Bitte waehlen Sie eine Reagenzie aus.');
  });

  it('should display removals if reagent is not null', async () => {
    const date = new Date('2021-01-01');
    component.reagent = DUMMY_REAGENT;
    fixture.detectChanges();

    // fetch mat list items using MatListItemHarness
    const listItems = await loader.getAllHarnesses(MatListItemHarness);

    // Compare list items with removals
    expect(listItems.length).toEqual(DUMMY_REAGENT.removals.length);
  });

  it('should display reagent id, amount and date in list items', async () => {
    component.reagent = DUMMY_REAGENT;
    fixture.detectChanges();

    // fetch mat list items using MatListItemHarness
    const listItems = await loader.getAllHarnesses(MatListItemHarness);

    expect(listItems.length).toEqual(DUMMY_REAGENT.removals.length);

    // Compare list items with removals
    DUMMY_REAGENT.removals.forEach(async (removal, index) => {
      const text = await listItems[index].getFullText();
      expect(text).toContain(removal.id);
      expect(text).toContain(`${removal.amount}`);
      expect(text).toContain(removal.created_at.toLocaleDateString("de-DE"));
    });
  });

  it('button click should emit remove', () => {
    // set reagent
    component.reagent = DUMMY_REAGENT;
    fixture.detectChanges();

    // subscribe to remove event emitter
    spyOn(component.onCreate, 'emit');

    // Click button
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.onCreate.emit).toHaveBeenCalled();
  });

  it('button should be disabled if reagent.current_amount is 0', () => {
    // set reagent
    component.reagent = { ...DUMMY_REAGENT, current_amount: 0 };
    fixture.detectChanges();

    // Click button
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();

    // set reagent
    component.reagent = { ...DUMMY_REAGENT, current_amount: 1 };
    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });

  it('click on delete icon (matListIcon) should emit delete', async () => {
    // set reagent
    component.reagent = { ...DUMMY_REAGENT, current_amount: 1 };
    fixture.detectChanges();

    // subscribe to delete event emitter
    spyOn(component.onDelete, 'emit');

    // fetch first mat-list-item using MatListItemHarness
    const listItem = await loader.getHarness(MatListItemHarness);

    // fetch mat list icon using MatIconHarness
    const icon = await listItem.getHarness(MatIconHarness);

    // simulate click on mat list icon by using angular click method
    (await icon.host()).dispatchEvent('click');

    // Expect delete event emitter to have been called
    expect(component.onDelete.emit).toHaveBeenCalled();
  });
});