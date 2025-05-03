import { Component, HostListener, ViewChild ,OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  @ViewChild(CartSidebarComponent) cartSidebar!: CartSidebarComponent; 

  isScrolled = false;
  isMenuOpen = false;
  isHomePage = false;
  isLoggedIn = false;
  userName: string | null = '';
  
  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
      this.isLoggedIn = true;
      this.userName = JSON.parse(user).firstName;
      console.log(this.userName);
  
    } else {
      this.isLoggedIn = false;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }


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
