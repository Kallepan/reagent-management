/**
 * Dynamic component which depending on the activated route displays a search bar
 * or nothing.
 **/
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { messages } from '@app/core/constants/messages';
import { NotificationService } from '@app/core/services/notification.service';
import { LotAPIService } from '@app/modules/bak/services/lot-api.service';
import { cleanQuery } from '@app/modules/pcr/functions/query-cleaner.function';
import { ChoiceDialogComponent, ChoiceDialogData } from '@app/shared/components/choice-dialog/choice-dialog.component';
import { SearchBarComponent } from '@app/shared/components/search-bar/search-bar.component';
import { Subject, filter, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-header-global-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchBarComponent, MatButtonModule, RouterLink, MatCheckboxModule, MatTooltipModule],
  templateUrl: './header-global-search.component.html',
  styleUrl: './header-global-search.component.scss',
})
export class HeaderGlobalSearchComponent implements OnInit {
  private _lotAPIService = inject(LotAPIService);
  private _notificationService = inject(NotificationService);
  private _router = inject(Router);
  private destroyRef$ = inject(DestroyRef);

  control = new FormControl('');
  searchEmpty = new FormControl(false);

  dialog = inject(MatDialog);

  activatedRoute$ = this._router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    // Get the activated route
    map(() => this._router.routerState.root),
    // Get the last activated route
    map((route) => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    // Get the data from the route
    switchMap((route) => route.data),
    map((data) => data['featureFlag']),
  );

  private _query = new Subject<{ query: string; featureFlag: string }>();
  query$ = this._query.asObservable().pipe(
    takeUntilDestroyed(this.destroyRef$),
    switchMap(({ query, featureFlag }) => {
      switch (featureFlag) {
        case 'BAK':
          return of(query).pipe(
            map((query) => query.trim()),
            filter((query) => query.length > 0),
            map((query) => {
              return { search: query, is_empty: this.searchEmpty.value! };
            }),
            switchMap((params) => this._lotAPIService.searchLots(params)),
            tap((lots) => {
              if (lots.length === 0) {
                this._notificationService.warnMessage(messages.GENERAL.NO_RESULTS_FOUND);
              }
            }),
            filter((lots) => lots.length > 0),
            tap((lots) => console.log(lots)),
            switchMap((lots) => {
              if (lots.length === 1) {
                return of(lots[0].id);
              }

              const formattedLots = lots.map((lot) => ({
                id: lot.id,
                name: `${lot.name} (${lot.type.producer}-${lot.type.name})`,
              }));

              const data: ChoiceDialogData = {
                title: 'Es wurden mehrere Lots gefunden. Bitte wählen Sie eine aus.',
                choices: formattedLots,
                displayCancel: true,
              };

              const config = new MatDialogConfig();
              config.enterAnimationDuration = 300;
              config.enterAnimationDuration = 300;
              config.data = data;
              return this.dialog
                .open(ChoiceDialogComponent, config)
                .afterClosed()
                .pipe(map((choice) => (choice ? choice.id : null)));
            }),
            filter((lotId) => lotId !== null),
            tap(() => this.control.setValue('', { emitEvent: false })),
            switchMap((lotId) => this._router.navigate(['bak', 'lots', 'detail', lotId])),
          );
        case 'PCR':
          return of(query).pipe(
            map((query) => cleanQuery(query)),
            switchMap((query) =>
              this._router.navigate(['pcr', 'batch'], {
                queryParams: { search: query },
              }),
            ),
          );
        default:
          return of(null).pipe(tap(() => this._notificationService.warnMessage(messages.GENERAL.FEATURE_NOT_IMPLEMENTED)));
      }
    }),
    filter((query) => query !== null),
  );

  onSearch(featureFlag: string, query: string) {
    this._query.next({ query, featureFlag });
  }

  ngOnInit() {
    this.query$.subscribe(() => {
      this.control.setValue('', { emitEvent: false });
    });
  }
}
