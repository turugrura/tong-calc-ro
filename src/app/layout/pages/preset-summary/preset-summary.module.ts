import { NgModule } from '@angular/core';
import { PresetSummaryRoutingModule } from './preset-summary-routing.module';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { PresetSummaryComponent } from './preset-summary.component';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [PresetSummaryComponent],
  imports: [
    PresetSummaryRoutingModule,
    ListboxModule,
    ButtonModule,
    CommonModule,
    TableModule,
    FormsModule,
    CheckboxModule,
  ],
  exports: [],
})
export class PresetSummaryModule {}
