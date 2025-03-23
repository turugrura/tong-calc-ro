import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, RouterModule, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { ApiServiceModule } from './api-services';
import { RoService } from './api-services/ro.service';
import { SummaryService } from './api-services/summary.service';
import { appRoutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrettyJsonPipe } from './layout/prettier-json.pipe';

const customComponent = [PrettyJsonPipe];
const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
  ]
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    ApiServiceModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('accessToken'),
      },
    }),
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, RoService, SummaryService, ...appConfig.providers, ...customComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
