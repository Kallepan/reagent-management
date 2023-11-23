import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkColumnDef } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CdkDetailRowDirective } from '@app/shared/directives/cdk-detail-row.directive';

export type ColumnsSchema = {
  key: string,
  label: string,
  type: 'text' | 'color',
  fn: (row: any) => string | number,
};

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    CdkColumnDef
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataTableComponent<T> implements OnInit, AfterViewInit {
  @Output() editClick = new EventEmitter<T>();

  @Input() set data(data: T[]) {
    this.dataSource.data = data;
  }

  @Input() schema: ColumnsSchema[] = [];
  @Input() detailRowTemplate: TemplateRef<any> | null = null;

  // static: true is required becuase we use a tempalte to include a row
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  expandedElement: T | null = null;

  ngOnInit(): void {
    this.displayedColumns = this.schema.map((column) => column.key).concat(['actions']);
    this.dataSource.filterPredicate = (data: T, filter: string) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      const fn = this.schema.find((column) => column.key === property)?.fn;
      if (fn) return fn(item);
      return item[property];
    }
  }
}