import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReagentCreateComponent } from './reagent-create.component';
import { AbstractControl, ControlContainer, FormArray, FormGroup, FormGroupDirective } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ReagentCreateComponent', () => {
  let component: ReagentCreateComponent;
  let fixture: ComponentFixture<ReagentCreateComponent>;
  let fgd: FormGroupDirective;
  let fg: FormGroup;

  beforeEach(async () => {
    fg = new FormGroup({
      reagents: new FormArray([]),
    });
    fgd = new FormGroupDirective([], []);
    fgd.form = fg;

    await TestBed.configureTestingModule({
      imports: [ReagentCreateComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: ControlContainer,
          useValue: fgd,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReagentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
