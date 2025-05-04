import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../domain/cartItem'; 
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
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
  
  get subtotal(): number {
    return this.cartService.getSubtotal();
  }
  
  get discount(): number {
    return this.cartService.getDiscount() * this.subtotal ;
  }
  
  get total(): number {
    return this.cartService.getTotal();
  }
  
  increaseQuantity(index: number): void {
    this.cartService.increaseQuantity(index);
  }
  
  decreaseQuantity(index: number): void {
    this.cartService.decreaseQuantity(index);
  }
  
  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }
  
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
  
  continueShopping(): void {
    this.router.navigate(['/']);
  }

    
  }
  
