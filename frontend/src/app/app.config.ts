import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withComponentInputBinding, withViewTransitions } from "@angular/router";
import { routes } from "./app.routes";
import { httpErrorInterceptor } from "./core/interceptors/http-error-interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([
                httpErrorInterceptor
            ])
        ),
    ]
}