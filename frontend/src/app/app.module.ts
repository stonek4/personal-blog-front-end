import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BusinessCardComponent } from './home/business-card/business-card.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { AuthInterceptor, HttpErrorInterceptor } from './app-http-client.service';
import { FeaturedComponent } from './featured/featured.component';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BusinessCardComponent,
        AboutMeComponent,
        FeaturedComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        SharedComponentsModule,
        LoggerModule.forRoot({
            // serverLoggingUrl: '/api/logs',
            level: !environment.production ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.OFF,
            serverLogLevel: NgxLoggerLevel.ERROR
        })
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
