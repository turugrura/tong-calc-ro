import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { PresetService } from './preset.service';
import { EcommerceService } from './ecommerce.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [AuthService, PresetService, EcommerceService],
  exports: [],
})
export class ApiServiceModule {}
