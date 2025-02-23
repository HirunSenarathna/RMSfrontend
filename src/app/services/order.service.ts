import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  orderItems = [
    { name: 'Coconut Water', quantity: 1, price: 2.99, img: 'assets/drinks1.jpg' },
    { name: 'Fish Curry with Coconut Rice', quantity: 1, price: 13.49, img: 'assets/image1.jpg' }
  ];

  getSubtotal(): number {
    return this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getShippingCost(): number {
    return 15.00;
  }

  removeFromCart(index: number) {
    this.orderItems.splice(index, 1);
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }
}
