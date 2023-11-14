import { APP_INITIALIZER, inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { constants } from "../constants/constants";
import { messages } from "../constants/messages";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs";

// Guard to check if a feature flag is enabled for the user
export const featureFlagGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router = inject(Router);
    const notificationService = inject(NotificationService);
    const http = inject(HttpClient);

    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        withCredentials: true,
    };

    const requestedFeatureFlag = (route.data['featureFlag'] as string).trim().toUpperCase();

    return http.get<any>(`${constants.APIS.AUTH}/verify`, httpOptions).pipe(
        map(resp => {
            return {
                identifier: resp.identifier,
                groups: resp.groups as string[],
            }
        }),
        // Check if the user is an admin or if the feature flag is enabled for the user
        map(data => data.identifier === 'admin' || data.groups.includes(requestedFeatureFlag)),
        // If the feature flag is disabled, show a warning message
        tap(isEnabled => {
            if (!isEnabled)
                notificationService.warnMessage(messages.GENERAL.FEATURE_FLAG_DISABLED);
        }),
        // If the feature flag is disabled, redirect the user to the home page
        map(isEnabled => isEnabled || router.createUrlTree(['']))
    );
};

// Simple guard to check if the user is authenticated
export const isAuthenticated = () => inject(AuthService).isLoggedIn();