/**
 * Dynamic component which depending on the activated route displays a search bar 
 * or nothing.
**/
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-header-global-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-global-search.component.html',
  styleUrl: './header-global-search.component.scss'
})
export class HeaderGlobalSearchComponent {
  private _router = inject(Router);

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
    map((route) => route.data),
    switchMap((data) => data),
    map((data) => data['featureFlag']),
    tap((featureFlag) => console.log(featureFlag)),
  );

}

