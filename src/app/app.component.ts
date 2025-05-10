import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OwnerNavbarComponent } from "./components/owner/owner-navbar/owner-navbar.component";
import { OwnerSidebarComponent } from "./components/owner/owner-sidebar/owner-sidebar.component";
import { WaiterNavbarComponent } from './components/waiter/waiter-navbar/waiter-navbar.component';
import { WaiterSidebarComponent } from './components/waiter/waiter-sidebar/waiter-sidebar.component';
import { CashierNavbarComponent } from './components/cashier/cashier-navbar/cashier-navbar.component';
import { CashierSidebarComponent } from './components/cashier/cashier-sidebar/cashier-sidebar.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule, OwnerNavbarComponent, OwnerSidebarComponent,WaiterNavbarComponent,WaiterSidebarComponent,CashierNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RMSfrontend';

  constructor(private router: Router) {}

  isOwnerPage(): boolean {
    return this.router.url.startsWith('/owner');
  }

  isWaiterPage(): boolean {
    return this.router.url.startsWith('/waiter');
  }

  isCashierPage(): boolean {
    return this.router.url.startsWith('/cashier');
  }

  isCustomerPage(): boolean {
    return !this.isOwnerPage() && !this.isWaiterPage() && !this.isCashierPage();
  }
}
