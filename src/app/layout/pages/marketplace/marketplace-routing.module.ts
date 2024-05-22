import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarketplaceComponent } from './marketplace.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: MarketplaceComponent }])],
  exports: [RouterModule],
})
export class MarketplaceRoutingModule {}
