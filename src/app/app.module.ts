import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { RoService } from './demo/service/ro.service';
import { PrettyJsonPipe } from './layout/prettier-json.pipe';

const customComponent = [PrettyJsonPipe];

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, AppLayoutModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, RoService, ...customComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
