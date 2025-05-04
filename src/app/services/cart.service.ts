import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../domain/cartItem'; 

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  // For persistence between page refreshes
  private readonly CART_STORAGE_KEY = 'shopping_cart';

  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next(cartItems);
      } catch (e) {
        console.error('Error loading cart from storage', e);
        this.cartItemsSubject.next([]);
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem(
      this.CART_STORAGE_KEY, 
      JSON.stringify(this.cartItemsSubject.value)
    );
  }

  getItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    
    // Check if item already exists in cart
    const existingItemIndex = currentItems.findIndex(
      (cartItem) => 
        cartItem.id === item.id && 
        ((!cartItem.variant && !item.variant) || 
         (cartItem.variant?.id === item.variant?.id))
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      this.cartItemsSubject.next(updatedItems);
    } else {
      // Add new item
      this.cartItemsSubject.next([...currentItems, item]);
    }
    
    this.saveCart();
  }

  removeFromCart(index: number): void {
    const currentItems = this.cartItemsSubject.value;
    if (index >= 0 && index < currentItems.length) {
      const updatedItems = [
        ...currentItems.slice(0, index),
        ...currentItems.slice(index + 1)
      ];
      this.cartItemsSubject.next(updatedItems);
      this.saveCart();
    }
  }

  increaseQuantity(index: number): void {
    const currentItems = this.cartItemsSubject.value;
    if (index >= 0 && index < currentItems.length) {
      const updatedItems = [...currentItems];
      updatedItems[index].quantity += 1;
      this.cartItemsSubject.next(updatedItems);
      this.saveCart();
    }
  }

  decreaseQuantity(index: number): void {
    const currentItems = this.cartItemsSubject.value;
    if (index >= 0 && index < currentItems.length) {
      const updatedItems = [...currentItems];
      if (updatedItems[index].quantity > 1) {
        updatedItems[index].quantity -= 1;
        this.cartItemsSubject.next(updatedItems);
      } else {
        // Remove item if quantity would become 0
        this.removeFromCart(index);
      }
      this.saveCart();
    }
  }

  updateQuantity(index: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    if (index >= 0 && index < currentItems.length && quantity > 0) {
      const updatedItems = [...currentItems];
      updatedItems[index].quantity = quantity;
      this.cartItemsSubject.next(updatedItems);
      this.saveCart();
    } else if (quantity <= 0) {
      this.removeFromCart(index);
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.CART_STORAGE_KEY);
  }

  getSubtotal(): number {
    return this.cartItemsSubject.value.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
  }

  getDiscount(): number {
  
    const subtotal = this.getSubtotal();
    
    if (subtotal === 0) {
      return 0;
    }
    
    
    if (subtotal > 100) {
      return 0.1;
    }
    
    return 0.01;
  }

  getTotal(): number {
    return this.getSubtotal() - (this.getSubtotal() * this.getDiscount());
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (count, item) => count + item.quantity, 
      0
    );
  }
}
