import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidenavComponent, RouterTestingModule, MatButtonModule]
    });
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Should have as many buttons as links
  it('should have as many buttons as links', () => {
    // Get number of buttons
    const compiled = fixture.debugElement.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    
    // Get number of links
    expect(component.links.length).toEqual(buttons.length);
  });
});
