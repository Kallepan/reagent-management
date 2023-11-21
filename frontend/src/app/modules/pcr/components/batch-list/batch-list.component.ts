import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PCRStateHandlerService } from '../../services/pcrstate-handler.service';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss',
  providers: [
    PCRStateHandlerService
  ],
})
export class BatchListComponent {

}
