import {
  ComponentFixture,
  DeferBlockState,
  TestBed,
} from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthService } from '@app/core/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let loader: HarnessLoader;

  beforeEach(() => {
    authService = jasmine.createSpyObj(
      'AuthService',
      ['login', 'verifyLogin', 'logout', 'isLoggedIn', 'authData'],
      {
        initialized: signal(false),
      },
    );

    TestBed.configureTestingModule({
      imports: [LoginComponent, MatMenuModule, MatSnackBarModule],
      providers: [
        provideNoopAnimations(),
        { provide: AuthService, useValue: authService },
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login button', async () => {
    const deferBlockFixture = (await fixture.getDeferBlocks())[0];
    await deferBlockFixture.render(DeferBlockState.Complete);
    const loginButton = fixture.debugElement.query(By.css('button'));
    expect(loginButton).toBeTruthy();
  });

  it('should display spinner', async () => {
    // Spinner should be displayed by default
    const spinner = await loader.getHarness(MatProgressSpinnerHarness);
    expect(spinner).toBeTruthy();
  });

  it('should not display spinner', async () => {
    // Spinner should not be displayed when initialized
    const deferBlockFixture = (await fixture.getDeferBlocks())[0];
    deferBlockFixture.render(DeferBlockState.Complete);
    fixture.detectChanges();

    // Try to find spinner --> should not be found
    try {
      await loader.getHarness(MatProgressSpinnerHarness);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should open menu upon click', async () => {
    const deferBlockFixture = (await fixture.getDeferBlocks())[0];
    await deferBlockFixture.render(DeferBlockState.Complete);

    // Click on login button
    const loginButton = fixture.debugElement.query(By.css('button'));
    loginButton.nativeElement.click();

    const menu = await loader.getHarness(MatMenuHarness);
    expect(menu).toBeTruthy();
  });

  it('loginFormButton should only be enabled when form is valid', async () => {
    const deferBlockFixture = (await fixture.getDeferBlocks())[0];
    await deferBlockFixture.render(DeferBlockState.Complete);

    // Click on login button
    const loginButton = fixture.debugElement.query(By.css('button'));
    loginButton.nativeElement.click();

    const menu = await loader.getHarness(MatMenuHarness);
    expect(menu).toBeTruthy();

    const loginFormButton = fixture.debugElement.query(
      By.css('#login-confirm'),
    );
    expect(loginFormButton.nativeElement.disabled).toBe(true);

    // Fill in username
    component.loginForm.setValue({
      identifier: 'test',
      password: 'test',
    });
    fixture.detectChanges();
    expect(component.loginForm.valid).toBeTruthy();
    expect(loginFormButton.nativeElement.disabled).toBe(false);
  });

  it('should display department after successful login', async () => {
    const deferBlockFixture = (await fixture.getDeferBlocks())[0];
    await deferBlockFixture.render(DeferBlockState.Complete);

    // Click on login button
    const loginButton = fixture.debugElement.query(By.css('button'));
    loginButton.nativeElement.click();

    const menu = await loader.getHarness(MatMenuHarness);
    expect(menu).toBeTruthy();

    const loginFormButton = fixture.debugElement.query(
      By.css('#login-confirm'),
    );
    expect(loginFormButton.nativeElement.disabled).toBe(true);

    // Fill in username
    component.loginForm.setValue({
      identifier: 'test',
      password: 'test',
    });
    fixture.detectChanges();
    expect(component.loginForm.valid).toBeTruthy();
    expect(loginFormButton.nativeElement.disabled).toBe(false);

    // Click on login button
    loginFormButton.nativeElement.click();

    authService.authData.and.returnValue({
      department: 'test',
    });
    authService.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    // Verify that department is displayed
    const department = fixture.debugElement.query(By.css('.info'));
    expect(department).toBeTruthy();
    expect(department.nativeElement.textContent).toContain('TEST'); // Uppercase!
  });
});
