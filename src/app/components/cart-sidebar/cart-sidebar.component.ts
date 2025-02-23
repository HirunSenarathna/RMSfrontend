import { Component } from '@angular/core';
import { CartServiceService } from '../../services/cart-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-sidebar',
  imports: [CommonModule],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent {

  isCartOpen = false;
  cartItems: any[] = [];

  constructor(private cartService: CartServiceService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }

  getTotal() {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

}
