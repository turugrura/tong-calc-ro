import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { PresetService } from './preset.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [AuthService, PresetService],
  exports: [],
})
export class ApiServiceModule {}
