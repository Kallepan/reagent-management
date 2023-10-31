import { Injectable, inject } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { constants } from "../constants/constants";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  private _authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._authService.isLoggedIn()) {
      return next.handle(req);
    }

    // Check if target url is auth api endpoint
    if (!req.url.includes(constants.APIS.AUTH)) {
      return next.handle(req);
    }

    const JWT_ACCESS_TOKEN = sessionStorage.getItem(constants.JWT.ACCESS_STORAGE);

    const clonedReq = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + JWT_ACCESS_TOKEN)
    });

    // Send request with token
    return next.handle(clonedReq);
  }
}