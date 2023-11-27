import { APP_INITIALIZER, inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { constants } from "../constants/constants";
import { messages } from "../constants/messages";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, of, tap } from "rxjs";

// Guard to check if a feature flag is enabled for the user
export const featureFlagGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router = inject(Router);
    const http = inject(HttpClient);

    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        withCredentials: true,
    };

    const requestedFeatureFlag = (route.data['featureFlag'] as string).trim().toUpperCase();

    return http.get<any>(`${constants.APIS.AUTH}/has_access/${requestedFeatureFlag}`, httpOptions).pipe(
        map(() => true),
        catchError(() => of(false)),
        // If the feature flag is disabled, redirect the user to the home page
        map(isEnabled => isEnabled || router.createUrlTree([''])),
    );
};

// Simple guard to check if the user is authenticated
export const isAuthenticated = () => inject(AuthService).isLoggedIn();