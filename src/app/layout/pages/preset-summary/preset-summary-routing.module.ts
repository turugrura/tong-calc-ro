import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PresetSummaryComponent } from './preset-summary.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: PresetSummaryComponent }])],
  exports: [RouterModule],
})
export class PresetSummaryRoutingModule {}
