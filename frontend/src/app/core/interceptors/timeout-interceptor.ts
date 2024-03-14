import {
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { constants } from '@core/constants/constants';
import { Observable, timeout } from 'rxjs';

export const timeoutInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
    const timeoutValue = req.headers.get('timeout') || constants.DEFAULT_TIMEOUT;
    const timeoutValueNumber = Number(timeoutValue);

    return next(req).pipe(timeout(timeoutValueNumber));
};