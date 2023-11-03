import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CanActivateFn, Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { errors } from "../constants/errors";
import { constants } from "../constants/constants";

// Guard to check if the user has the feature flag enabled
export function featureFlagGuard(
    flagName: string,
    redirectRoute: string
): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const notificationService = inject(NotificationService);
        
        // Debug mode
        if (!constants.IS_PRODUCTION)
            return true;

        const isFeatureEnabled = authService.isFeatureEnabled(flagName);

        if (!isFeatureEnabled) {
            notificationService.warnMessage(errors.AUTH.UNAUTHORIZED);
        }

        return isFeatureEnabled || router.createUrlTree([redirectRoute]);
    }
}

// Simple guard to check if the user is authenticated
export const isAuthenticated = () => inject(AuthService).isLoggedIn();