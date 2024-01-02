/**
 * Dynamic component which depending on the activated route displays a search bar
 * or nothing.
 **/
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { messages } from '@app/core/constants/messages';
import { NotificationService } from '@app/core/services/notification.service';
import { LotAPIService } from '@app/modules/bak/services/lot-api.service';
import { SearchBarComponent } from '@app/shared/components/search-bar/search-bar.component';
import { filter, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-header-global-search',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MatButtonModule, RouterLink],
  templateUrl: './header-global-search.component.html',
  styleUrl: './header-global-search.component.scss',
})
export class HeaderGlobalSearchComponent {
  private _lotAPIService = inject(LotAPIService);
  private _notificationService = inject(NotificationService);
  private _router = inject(Router);

  control = new FormControl('');

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

  onSearch(featureFlag: string, query: string) {
    switch (featureFlag) {
      case 'BAK':
        of(query)
          .pipe(
            map((query) => query.trim()),
            filter((query) => query.length > 0),
            map((query) => {
              return { search: query, is_empty: 'false' };
            }),
            switchMap((params) => this._lotAPIService.searchLots(params)),
            tap((lots) => {
              if (lots.length === 0) {
                this._notificationService.warnMessage(
                  messages.GENERAL.NO_RESULTS_FOUND,
                );
              }
            }),
            filter((lots) => lots.length > 0),
            tap((lots) =>
              this._notificationService.infoMessage(
                `${lots.length} lots gefunden. Navigiert zu ${lots[0].name}`,
              ),
            ),
            map((lots) => lots[0]),
            tap(() => this.control.setValue('', { emitEvent: false })),
          )
          .subscribe((lot) => {
            this._router.navigate(['bak', 'lots', 'detail', lot.id]);
          });
        break;
      case 'PCR':
        this._router.navigate(['pcr', 'batch'], {
          queryParams: { search: query },
        }).then(() => this.control.setValue('', { emitEvent: false }));
        break;
      default:
        this._notificationService.warnMessage(
          messages.GENERAL.FEATURE_NOT_IMPLEMENTED,
        );
        break;
    }
  }
}
