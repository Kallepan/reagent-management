import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@app/core/services/auth.service';
import { By } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        BrowserAnimationsModule, 
        HttpClientTestingModule, 
        MatMenuModule,
        MatSnackBarModule
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login button', () => {
    const loginButton = fixture.debugElement.query(By.css('button'));
    expect(loginButton).toBeTruthy();
  });

  it('should open menu when login button is clicked', async () => {
    const menu = await loader.getHarness<MatMenuHarness>(MatMenuHarness);
    const loginButton = fixture.debugElement.query(By.css('button'));

    expect(await menu.isOpen()).toBeFalse();

    loginButton.nativeElement.click();
    fixture.detectChanges();

    expect(await menu.isOpen()).toBeTrue();
  });

  it('test form validity', () => {
    expect(component.loginForm.valid).toBeFalsy();

    component.loginForm.setValue({
      identifier: 'test',
      password: 'test'
    });

    expect(component.loginForm.valid).toBeTruthy();
  });

  it('confirm button should be disabled when form is invalid', async () => {
    // First open  the menu
    const menu = await loader.getHarness<MatMenuHarness>(MatMenuHarness);
    const loginButton = fixture.debugElement.query(By.css('button'));
    expect(await menu.isOpen()).toBeFalse();
    loginButton.nativeElement.click();
    fixture.detectChanges();
    expect(await menu.isOpen()).toBeTrue();

    const confirmButton = fixture.debugElement.query(By.css('#login-confirm'));

    expect(confirmButton.nativeElement.disabled).toBeTruthy();
  });

  it('should call login when login button is clicked', async () => {
    const menu = await loader.getHarness<MatMenuHarness>(MatMenuHarness);
    const loginButton = fixture.debugElement.query(By.css('button'));

    expect(await menu.isOpen()).toBeFalse();

    loginButton.nativeElement.click();
    fixture.detectChanges();

    expect(await menu.isOpen()).toBeTrue();

    spyOn(authService, 'login');
    // Now that menu is open, we can click the login button
    const confirmButton = fixture.debugElement.query(By.css('#login-confirm'));

    // populate form
    component.loginForm.setValue({
      identifier: 'test',
      password: 'test'
    });
    fixture.detectChanges();
    confirmButton.nativeElement.click();

    expect(authService.login).toHaveBeenCalled();
  });
});
