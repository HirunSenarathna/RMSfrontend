import { Component, HostListener, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar.component';

@Component({
  selector: 'app-header',
  imports: [ CartSidebarComponent,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [CurrencyPipe]
})
export class HeaderComponent {
  @ViewChild(CartSidebarComponent) cartSidebar!: CartSidebarComponent; 

  isScrolled = false;
  isMenuOpen = false;
  isHomePage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/';
      }
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
