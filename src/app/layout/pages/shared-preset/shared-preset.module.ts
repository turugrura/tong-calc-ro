import { NgModule } from '@angular/core';
import { SharedPresetRoutingModule } from './shared-preset-routing.module';
import { SharedPresetComponent } from './shared-preset.component';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { EquipmentUiComponent } from './equipment-ui/equipment-ui.component';
import { DividerModule } from 'primeng/divider';
import { EquipmentInDetailComponent } from './equipment-in-detail/equipment-in-detail.component';
import { PaginatorModule } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { RoCalculatorModule } from '../ro-calculator/ro-calculator.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SkillDetailComponent } from './skill-detail/skill-detail.component';

@NgModule({
  imports: [
    ListboxModule,
    ButtonModule,
    CommonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    DividerModule,
    PaginatorModule,
    InputSwitchModule,
    ToastModule,
    AccordionModule,
    SharedPresetRoutingModule,
    ConfirmDialogModule,
    RoCalculatorModule,
  ],
  declarations: [SharedPresetComponent, EquipmentUiComponent, EquipmentInDetailComponent, SkillDetailComponent],
})
export class SharedPresetModule {}
