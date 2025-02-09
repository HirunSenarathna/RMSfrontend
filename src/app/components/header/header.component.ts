import { Component,HostListener } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  productUrl: string;
}

@Component({
  selector: 'app-header',
  imports: [ ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [CurrencyPipe]
})

export class HeaderComponent {
  isScrolled = false;
  isMenuOpen: boolean = false;
  isSticky: boolean = false;


  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  menuItems: { label: string, url: string }[] = [
    { label: 'Rice & Curry', url: '/product-category/rice-curry' },
    { label: 'Drinks', url: '/product-category/drinks' },
    { label: 'Sides', url: '/product-category/sides' },
    { label: 'Lunch Specials', url: '/lunch-specials' },
    { label: 'Table Reservations', url: '/table-reservations' },
  ];

  cartItems: CartItem[] = [
    { name: 'Spiced Chai', quantity: 2, price: 3.99, imageUrl: './assets/tenweb_media_rgu78wknh.webp', productUrl: '/product/spiced-chai' },
  ];
  get subtotal() {
    return this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  constructor() {}

  ngOnInit() {
    // Implement sticky effect based on scroll
    window.onscroll = () => {
      this.isSticky = window.scrollY > 100;
    };
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  removeCartItem(cartItem: CartItem) {
    // Logic to remove the item from the cart
    const index = this.cartItems.indexOf(cartItem);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

}
