import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsDetailComponent } from './lots-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { BehaviorSubject } from 'rxjs';

describe('LotsDetailComponent', () => {
  let component: LotsDetailComponent;
  let fixture: ComponentFixture<LotsDetailComponent>;
  const bakStateHandlerService = jasmine.createSpyObj('BakStateHandlerService', ['getTypes', 'getLots', 'getLocations', 'getReagents'], { 'lots': new BehaviorSubject([]), });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        LotsDetailComponent,
      ],
      providers: [
        {
          provide: BakStateHandlerService,
          useValue: bakStateHandlerService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ],
    });
    fixture = TestBed.createComponent(LotsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
