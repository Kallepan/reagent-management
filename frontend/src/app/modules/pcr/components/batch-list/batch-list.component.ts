import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';
import { SearchBarComponent } from '@app/shared/components/search-bar/search-bar.component';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs';
import { NotificationService } from '@app/core/services/notification.service';
import { MatButtonModule } from '@angular/material/button';

type ColumnsSchema = {

};

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [
    CommonModule,

    SearchBarComponent,
    DataTableComponent,

    MatButtonModule,
  ],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss',
})
export class BatchListComponent implements OnInit {
  private router = inject(Router);

  // Search stuff
  filterControl = new FormControl('');
  filter$ = this.filterControl.valueChanges.pipe(
    filter((contents): contents is string => typeof contents === 'string'),
    debounceTime(200),
  );

  // Table stuff
  pcrStateHandlerService = inject(PCRStateHandlerService);
  private notificationService = inject(NotificationService);
  reagents = this.pcrStateHandlerService.reagents;
  columnsSchema: ColumnsSchema[];

  searchReagents(searchTerm: string) {
    //this.pcrStateHandlerService.searchReagents(searchTerm);
  }

  ngOnInit(): void {
    //this.pcrStateHandlerService.refreshData();
  }
}
