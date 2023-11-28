import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthService } from '@app/core/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let loader: HarnessLoader;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['login', 'verifyLogin', 'logout', 'isLoggedIn', 'authData'], {
      initialized: signal(false),
    });

    TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        MatMenuModule,
        MatSnackBarModule
      ],
      providers: [
        provideNoopAnimations(),
        { provide: AuthService, useValue: authService },
      ]
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
    await deferBlockFixture.render(DeferBlockState.Complete); const loginButton = fixture.debugElement.query(By.css('button'));
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

    const loginFormButton = fixture.debugElement.query(By.css('#login-confirm'));
    expect(loginFormButton.nativeElement.disabled).toBe(true);

    // Fill in username
    component.loginForm.setValue({
      identifier: 'test',
      password: 'test'
    });
    fixture.detectChanges();
    expect(component.loginForm.valid).toBeTruthy();
    expect(loginFormButton.nativeElement.disabled).toBe(false);
  });
});
