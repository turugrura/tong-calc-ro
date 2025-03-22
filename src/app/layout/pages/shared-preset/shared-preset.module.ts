import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { RoCalculatorModule } from '../ro-calculator/ro-calculator.module';
import { EquipmentInDetailComponent } from './equipment-in-detail/equipment-in-detail.component';
import { EquipmentUiComponent } from './equipment-ui/equipment-ui.component';
import { SharedPresetRoutingModule } from './shared-preset-routing.module';
import { SharedPresetComponent } from './shared-preset.component';
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
    CascadeSelectModule,
    SelectModule,
    RoCalculatorModule,
  ],
  declarations: [SharedPresetComponent, EquipmentUiComponent, EquipmentInDetailComponent, SkillDetailComponent],
})
export class SharedPresetModule { }
