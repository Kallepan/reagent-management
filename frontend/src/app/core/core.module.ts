import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHttpInterceptor } from './interceptors/http-error-interceptor.module';
import { NotificationService } from './services/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    MainComponent,
    CommonModule,
    MatSnackBarModule,
    HttpClientModule,
  ],
  exports: [
    MainComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHttpInterceptor,
      multi: true,
    },
    
    NotificationService,
  ]
})
export class CoreModule { }
