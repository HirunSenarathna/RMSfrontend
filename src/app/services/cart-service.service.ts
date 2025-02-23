import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private cartItems: any[] = [
    {
      id: 1,
      name: 'Coconut Water',
      price: 2.99,
      quantity: 1,
      image: 'assets/drinks2.jpg'
    },
    {
      id: 2,
      name: 'Fish Curry with Coconut Rice',
      price: 13.49,
      quantity: 1,
      image: 'assets/rnc2.jpg',
    }

  ];

  constructor() {}

  addToCart(item: any) {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  clearCart() {
    this.cartItems = [];
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
