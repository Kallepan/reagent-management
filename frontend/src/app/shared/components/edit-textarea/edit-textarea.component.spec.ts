import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EditTextareaComponent } from './edit-textarea.component';

describe('EditTextareaComponent', () => {
  let component: EditTextareaComponent;
  let fixture: ComponentFixture<EditTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTextareaComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if text is null or "", should display placeholder', () => {
    expect(component.text).toBe('');
    expect(component.isEditing()).toBe(false);

    // fetch the placeholder with By.css
    const placeholder = fixture.debugElement.query(By.css('.text'));

    expect(placeholder.nativeElement.textContent).toBe(
      'Kein Kommentar hinterlegt',
    );

    // test for null just to be sure
    component.text = null as any;
    fixture.detectChanges();
    expect(component.isEditing()).toBe(false);

    // fetch the placeholder with By.css
    const placeholder2 = fixture.debugElement.query(By.css('.text'));

    expect(placeholder2.nativeElement.textContent).toBe(
      'Kein Kommentar hinterlegt',
    );
  });

  it(`should toggle isEditing`, () => {
    expect(component.isEditing()).toBe(false);

    // fetch the button with By.css
    const button = fixture.debugElement.query(By.css('#toggle-edit'));

    // click the button
    button.triggerEventHandler('click', null);

    expect(component.isEditing()).toBe(true);
  });

  it(`should have a textarea upon edit button click`, () => {
    // fetch the button with By.css
    const button = fixture.debugElement.query(By.css('#toggle-edit'));

    // click the button
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    // fetch the textarea with By.css
    const textarea = fixture.debugElement.query(By.css('textarea'));

    expect(textarea).toBeTruthy();
  });

  it('button should submit form value', () => {
    // fetch the button with By.css
    const button = fixture.debugElement.query(By.css('#toggle-edit'));
    // create spy
    const spy = spyOn(component.onSubmit, 'emit');

    // click the button
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    // fetch the textarea with By.css
    const textarea = fixture.debugElement.query(By.css('textarea'));

    // set the value of the textarea
    component.formControl.setValue('test value');

    // fetch the submit button with By.css
    const submitButton = fixture.debugElement.query(By.css('#submit'));

    // click the submit button
    submitButton.triggerEventHandler('click', null);

    // check if the onSubmit event was emitted with the correct value
    expect(spy).toHaveBeenCalledWith('test value');
  });

  it('edit button should be disabled if isEditing() is true', () => {
    // fetch the button with By.css
    const button = fixture.debugElement.query(By.css('#toggle-edit'));

    // click the button
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    // fetch the button with By.css
    const editButton = fixture.debugElement.query(By.css('#toggle-edit'));

    expect(editButton.nativeElement.disabled).toBe(true);
  });

  it('submit button should be enabled if isEditing() is false', () => {
    // fetch initial button with By.css
    const initialButton = fixture.debugElement.query(By.css('#submit'));
    expect(initialButton.nativeElement.disabled).toBe(true);

    // fetch the button with By.css
    const button = fixture.debugElement.query(By.css('#toggle-edit'));

    // click the button
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    // fetch the textarea with By.css
    const textarea = fixture.debugElement.query(By.css('textarea'));

    // set the value of the textarea
    component.formControl.setValue('test value');

    // fetch the submit button with By.css
    const submitButton = fixture.debugElement.query(By.css('#submit'));

    expect(submitButton.nativeElement.disabled).toBe(false);
  });
});
