import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        LoginComponent,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [
        Router,
      ]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('title should be visible', () => { 
    const node = fixture.debugElement.query(By.css('.header-title'));
    expect(node.nativeElement.textContent).toContain(component.title);
  });

  it('routes should be rendered correctly', () => {
    // Fetch by 'a' tag
    const nodes = fixture.debugElement.nativeElement.querySelectorAll('a');

    const router = TestBed.inject(Router);
    expect(nodes.length).toEqual(router.config.filter(r => !!r.data).map(r => r.data!).length);
  });
});
