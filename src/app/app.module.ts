import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, NgModule } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { ApiServiceModule } from './api-services';
import { RoService } from './api-services/ro.service';
import { SummaryService } from './api-services/summary.service';
import { appRoutes, AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { PrettyJsonPipe } from './layout/prettier-json.pipe';

const customComponent = [PrettyJsonPipe];
const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    // providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
  ]
};


@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
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
