import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  activatedFeature = signal<string | null>(null);
  private router = inject(Router);

  constructor() {
    // Technically A memory leak, but this is a singleton service, so it's fine
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event as NavigationEnd),
      map((event) => event.urlAfterRedirects),
      map((url) => url.split('/')),
      map((urlParts) => urlParts[1]),
      map((feature) => feature || 'home'),
      map((feature) => feature),
    ).subscribe((feature) => {
      this.activatedFeature.set(feature);
    });
  }
}
