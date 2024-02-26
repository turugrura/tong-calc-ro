import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: AuthComponent }])],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
