import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent } from './data-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
type MockType = {
  value: string;
  id: number;
}

describe('DataTableComponent', () => {
  let component: DataTableComponent<MockType>;
  let fixture: ComponentFixture<DataTableComponent<MockType>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DataTableComponent,
        BrowserAnimationsModule
      ],
    });
    fixture = TestBed.createComponent(DataTableComponent<MockType>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of rows', () => {
    const mockData: MockType[] = [
      { value: 'foo', id: 1 },
      { value: 'bar', id: 2 },
      { value: 'baz', id: 3 },
    ];
    component.data = mockData;
    component.schema = [
      { key: 'value', label: 'Value', type: 'text', fn: (value: string) => value.toUpperCase() },
      { key: 'id', label: 'ID', type: 'text', fn: (value: number) => value.toString() },
    ];
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(rows.length).toBe(mockData.length * 2); 
  });

});
