import { ApplicationConfig } from "@angular/core";
import { provideRouter, withViewTransitions } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { httpErrorInterceptor } from "./core/interceptors/http-error-interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withViewTransitions()),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([
                httpErrorInterceptor
            ])
        ),
    ]
}