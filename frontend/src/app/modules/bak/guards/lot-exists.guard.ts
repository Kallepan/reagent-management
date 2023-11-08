import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { BakStateHandlerService } from "../services/bak-state-handler.service";
import { Observable, map } from "rxjs";

// This guard tests if the id is in the BakStateHandlerService lots list. It uses the ActivatedRouteSnapshot to get the id from the url.
export function lotExistsGuard(
    redirectRoute: string
): CanActivateFn {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const bakStateHandlerService = inject(BakStateHandlerService);
        const router = inject(Router);

        const id = route.params['id'];
        return bakStateHandlerService.lotExists(id) || router.createUrlTree([redirectRoute]);
    }
}