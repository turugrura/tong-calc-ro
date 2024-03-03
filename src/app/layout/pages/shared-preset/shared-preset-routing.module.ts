import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedPresetComponent } from './shared-preset.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: SharedPresetComponent }])],
  exports: [RouterModule],
})
export class SharedPresetRoutingModule {}
