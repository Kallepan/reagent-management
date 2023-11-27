import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsListComponent } from './lots-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BakStateHandlerService } from '../../services/bak-state-handler.service';
import { BehaviorSubject, of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BakLot } from '../../interfaces/lot';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

const mockSearchResults: { id: string, name: string, type: { name: string, producer: string } }[] = [
  {
    id: "1",
    name: "Test Lot 1",
    type: {
      name: 'Test Type 1',
      producer: 'Test Producer 1',
    }
  },
  {
    id: "2",
    name: "Test Lot 1",
    type: {
      name: 'Test Type 1',
      producer: 'Test Producer 1',
    }
  },
  {
    id: "3",
    name: "Test Lot 3",
    type: {
      name: 'Test Type 1',
      producer: 'Test Producer 1',
    }
  },
];

describe('LotsListComponent', () => {
  let component: LotsListComponent;
  let fixture: ComponentFixture<LotsListComponent>;
  let bakStateHandlerService: jasmine.SpyObj<BakStateHandlerService>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    bakStateHandlerService = jasmine.createSpyObj('BakStateHandlerService', ['getTypes', 'getLots', 'getLocations', 'getReagents', 'searchLots', 'refreshData'], { lots: new BehaviorSubject([]) });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'bak/lots/detail/:id', redirectTo: '' },
        ]),
        LotsListComponent,
      ],
      providers: [
        {
          provide: BakStateHandlerService,
          useValue: bakStateHandlerService
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotsListComponent);
    component = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test open search dialog
  it('should open search dialog for multiple results', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    bakStateHandlerService.searchLots.and.returnValue(of(mockSearchResults as BakLot[]));
    component.queryLot("Test Lot 1");

    expect(bakStateHandlerService.searchLots).toHaveBeenCalledWith("Test Lot 1", true);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should not open search dialog if no results', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    bakStateHandlerService.searchLots.and.returnValue(of([]));
    component.queryLot("Test Lot 1");

    expect(bakStateHandlerService.searchLots).toHaveBeenCalledWith("Test Lot 1", true);
    expect(dialogSpy).not.toHaveBeenCalled();
  });

  it('should not open search dialog if one result', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    bakStateHandlerService.searchLots.and.returnValue(of([mockSearchResults[0]] as BakLot[]));
    component.queryLot("Test Lot 1");

    expect(bakStateHandlerService.searchLots).toHaveBeenCalledWith("Test Lot 1", true);
    expect(dialogSpy).not.toHaveBeenCalled();
  });
});