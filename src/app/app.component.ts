import { Component, OnInit} from '@angular/core';
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
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule, OwnerNavbarComponent, OwnerSidebarComponent,WaiterNavbarComponent,WaiterSidebarComponent,CashierNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'RMSfrontend';

  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }


isOwnerPage(): boolean {
    return this.router.url.includes('/owner') || 
           (this.router.url === '/profile' && this.currentUser?.role?.toLowerCase() === 'owner');
  }

  isWaiterPage(): boolean {
    return this.router.url.includes('/waiter') || 
           (this.router.url === '/profile' && this.currentUser?.role?.toLowerCase() === 'waiter');
  }

  isCashierPage(): boolean {
    return this.router.url.includes('/cashier') || 
           (this.router.url === '/profile' && this.currentUser?.role?.toLowerCase() === 'cashier');
  }

  isCustomerPage(): boolean {
    return !this.isOwnerPage() && !this.isWaiterPage() && !this.isCashierPage();
  }
}
