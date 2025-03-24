import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OwnerNavbarComponent } from "./components/owner/owner-navbar/owner-navbar.component";
import { OwnerSidebarComponent } from "./components/owner/owner-sidebar/owner-sidebar.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule, OwnerNavbarComponent, OwnerSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RMSfrontend';

  constructor(private router: Router) {}

  isOwnerPage(): boolean {
     // Check if the current route starts with '/owner'
    return this.router.url.startsWith('/owner');
  }

  isCustomerPage(): boolean {
    return !this.router.url.startsWith('/owner'); 
  }
}
