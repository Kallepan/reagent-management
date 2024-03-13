import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterTrackerService } from './filter-tracker.service';

@Component({
  selector: 'app-choose-type-filter',
  standalone: true,
  imports: [MatCheckboxModule, FormsModule],
  templateUrl: './choose-type-filter.component.html',
  styleUrl: './choose-type-filter.component.scss',
})
export class ChooseTypeFilterComponent {
  filterTrackerService = inject(FilterTrackerService);
}
