import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [],
  declarations: [AuthComponent],
  providers: [],
  exports: [AuthRoutingModule],
})
export class AuthModule {}
