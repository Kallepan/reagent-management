import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BakRoutingModule } from './bak-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LocationAPIService } from './services/location-api.service';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { SearchBarComponent } from '@app/shared/components/search-bar/search-bar.component';
import { TypeAPIService } from './services/type-api.service';
import { LotAPIService } from './services/lot-api.service';
import { BakStateHandlerService } from './services/bak-state-handler.service';
import { LotsListComponent } from './components/lots-list/lots-list.component';
import { LotsDetailComponent } from './components/lots-detail/lots-detail.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LotsCreateComponent } from './components/lots-create/lots-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ReagentTransferComponent } from './components/reagent-transfer/reagent-transfer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChoiceDialogComponent } from '@app/shared/components/choice-dialog/choice-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReagentEditComponent } from './components/reagent-edit/reagent-edit.component';

@NgModule({
  declarations: [
    LotsListComponent,
    LotsDetailComponent,
    LotsCreateComponent,
    ReagentTransferComponent,
    ReagentEditComponent,
  ],
  imports: [
    CommonModule,
    BakRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSelectModule,

    DataTableComponent,
    SearchBarComponent,
    ChoiceDialogComponent,
  ],
  providers: [
    LocationAPIService,
    TypeAPIService,
    LotAPIService,
    BakStateHandlerService,
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE',
    }
  ]
})
export class BakModule {

}
