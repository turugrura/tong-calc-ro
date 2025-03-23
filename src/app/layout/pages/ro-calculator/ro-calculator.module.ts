import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeSelectModule } from 'primeng/treeselect';

import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { FluidModule } from 'primeng/fluid';
import { PrettyJsonPipe } from '../../prettier-json.pipe';
import { BattleDmgSummaryComponent } from './battle-dmg-summary/battle-dmg-summary.component';
import { BattleMonsterSummaryComponent } from './battle-monster-summary/battle-monster-summary.component';
import { CalcValueComponent } from './calc-value/calc-value.component';
import { ElementalTableRawComponent } from './elemental-table-raw/elemental-table-raw.component';
import { ElementalTableComponent } from './elemental-table/elemental-table.component';
import { EquipmentCosEnchantComponent } from './equipment-cos-enchant/equipment-cos-enchant.component';
import { EquipmentShadowComponent } from './equipment-shadow/equipment-shadow.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { ItemSearchComponent } from './item-search/item-search.component';
import { MiscDetailComponent } from './misc-detail/misc-detail.component';
import { MonsterDataViewComponent } from './monster-data-view/monster-data-view.component';
import { PresetTableComponent } from './preset-table/preset-table.component';
import { RoCalculatorRoutingModule } from './ro-calculator-routing.module';
import { RoCalculatorComponent } from './ro-calculator.component';
import { StatusInputComponent } from './status-input/status-input.component';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CascadeSelectModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    DividerModule,
    SelectModule,
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
    FluidModule,
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
    ElementalTableComponent,
    ElementalTableRawComponent,
    BattleDmgSummaryComponent,
    BattleMonsterSummaryComponent,
    EquipmentCosEnchantComponent,
    StatusInputComponent,
  ],
  exports: [CalcValueComponent],
})
export class RoCalculatorModule { }
