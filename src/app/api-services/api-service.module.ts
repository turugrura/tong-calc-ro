import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [AuthService],
  exports: [],
})
export class ApiServiceModule {}
