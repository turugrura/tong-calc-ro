import { NgModule } from '@angular/core';
import { UserProfileComponent } from './user-profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, FormsModule, SidebarModule, ButtonModule, InputTextModule, ToastModule],
  exports: [UserProfileComponent],
})
export class UserProfileModule {}
