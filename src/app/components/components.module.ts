import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenuItemsComponent } from './menu-items/menu-items.component';
import { LoginComponent } from './login/login.component';
import { CartSidebarComponent } from './cart-sidebar/cart-sidebar.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HeaderComponent,
    MenuItemsComponent,
    LoginComponent,
    CartSidebarComponent
  ]
})
export class ComponentsModule { }
