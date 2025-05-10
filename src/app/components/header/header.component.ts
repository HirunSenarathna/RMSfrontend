import { Component, HostListener, ViewChild ,OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [ CartSidebarComponent,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [CurrencyPipe]
})
export class HeaderComponent implements OnInit, OnDestroy {
 @ViewChild(CartSidebarComponent) cartSidebar!: CartSidebarComponent;

  isScrolled = false;
  isMenuOpen = false;
  isHomePage = false;
  isLoggedIn = false;
  
  private authSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/';
      }
    });
  }

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  ngOnDestroy() {
    // Clean up the subscription
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      // Navigation is already handled in AuthService
    });
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openCart() {
    if (this.cartSidebar) {
      this.cartSidebar.toggleCart(); 
    } else {
      console.error('CartSidebarComponent is not initialized');
    }
  }
}
