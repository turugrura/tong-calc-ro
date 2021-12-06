import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoCalculatorComponent } from './ro-calculator.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: RoCalculatorComponent }]),
  ],
  exports: [RouterModule],
})
export class RoCalculatorRoutingModule {}
