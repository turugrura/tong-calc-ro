import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { BlockUIModule } from 'primeng/blockui';
import { DataViewModule } from 'primeng/dataview';
import { TreeSelectModule } from 'primeng/treeselect';

import { RoCalculatorComponent } from './ro-calculator.component';
import { PrettyJsonPipe } from '../../prettier-json.pipe';
import { RoCalculatorRoutingModule } from './ro-calculator-routing.module';
import { EquipmentComponent } from './equipment/equipment.component';
import { CalcValueComponent } from './calc-value/calc-value.component';
import { PresetTableComponent } from './preset-table/preset-table.component';
import { MonsterDataViewComponent } from './monster-data-view/monster-data-view.component';
import { FieldsetModule } from 'primeng/fieldset';
import { MiscDetailComponent } from './misc-detail/misc-detail.component';
import { DialogModule } from 'primeng/dialog';
import { EquipmentShadowComponent } from './equipment-shadow/equipment-shadow.component';
import { ItemSearchComponent } from './item-search/item-search.component';

@NgModule({
  imports: [
    AccordionModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CascadeSelectModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    DividerModule,
    DropdownModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    ListboxModule,
    MultiSelectModule,
    OrderListModule,
    PaginatorModule,
    RadioButtonModule,
    RippleModule,
    SelectButtonModule,
    SplitButtonModule,
    StyleClassModule,
    TableModule,
    TagModule,
    ToastModule,
    ToggleButtonModule,
    BlockUIModule,
    DataViewModule,
    TreeSelectModule,
    FieldsetModule,
    DialogModule,
    RoCalculatorRoutingModule,
  ],
  declarations: [
    RoCalculatorComponent,
    EquipmentComponent,
    CalcValueComponent,
    PrettyJsonPipe,
    PresetTableComponent,
    MonsterDataViewComponent,
    MiscDetailComponent,
    EquipmentShadowComponent,
    ItemSearchComponent,
  ],
  exports: [CalcValueComponent],
})
export class RoCalculatorModule {}
