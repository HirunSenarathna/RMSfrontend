import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../domain/cartItem';
import { Router } from '@angular/router'; // Import Router for navigation
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-sidebar',
  imports: [CommonModule],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent {

  isCartOpen = false;
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  getTotal(): number {
    return this.cartService.getSubtotal();
  }
  
  viewCart(): void {
    this.toggleCart(); // Close the sidebar
    this.router.navigate(['/cart']);
  }
  
  checkout(): void {
    this.toggleCart(); // Close the sidebar
    this.router.navigate(['/checkout']);
  }

  // Added quantity control methods
  increaseQuantity(index: number): void {
    this.cartService.increaseQuantity(index);
  }
  
  decreaseQuantity(index: number): void {
    this.cartService.decreaseQuantity(index);
  }

  
  // isCartOpen = false;
  // cartItems: CartItem[] = [];

  // constructor(
  //   private cartService: CartService,
  //   private router: Router
  // ) {}

  // ngOnInit(): void {
  //   // Subscribe to cart changes
  //   this.cartService.cartItems$.subscribe(items => {
  //     this.cartItems = items;
  //   });
  // }

  // toggleCart(): void {
  //   this.isCartOpen = !this.isCartOpen;
  // }

  // removeItem(index: number): void {
  //   this.cartService.removeFromCart(index);
  // }

  // getTotal(): number {
  //   return this.cartService.getSubtotal();
  // }
  
  // viewCart(): void {
  //   this.toggleCart(); // Close the sidebar
  //   this.router.navigate(['/cart']);
  // }
  
  // checkout(): void {
  //   this.toggleCart(); // Close the sidebar
  //   this.router.navigate(['/checkout']);
  // }

}
