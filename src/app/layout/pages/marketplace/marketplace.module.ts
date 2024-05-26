import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { MarketplaceComponent } from './marketplace.component';
import { TableModule } from 'primeng/table';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { StoreManagementComponent } from './store-management/store-management.component';
import { DialogModule } from 'primeng/dialog';
import { ItemDetailDialogComponent } from './item-detail-dialog/item-detail-dialog.component';
import { StoreDetailDialogComponent } from './store-detail-dialog/store-detail-dialog.component';
import { ListboxModule } from 'primeng/listbox';
import { StyleClassModule } from 'primeng/styleclass';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  providers: [ConfirmationService],
  declarations: [MarketplaceComponent, StoreManagementComponent, StoreDetailDialogComponent, ItemDetailDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    TableModule,
    PaginatorModule,
    AutoCompleteModule,
    DialogModule,
    StyleClassModule,
    ListboxModule,
    CascadeSelectModule,
    ConfirmDialogModule,
    MarketplaceRoutingModule,
  ],
  exports: [],
})
export class MarketplaceModule {}
