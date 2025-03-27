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

  getOrdersData() {
    return [
      {
          orderId: 'ORD1001',
          orderDate: '2025-03-24',
          orderTime: '14:30',
          pickupDate: '2025-03-25',
          pickupTime: '16:00',
          customer: 'John Doe',
          paymentMethod: 'Credit Card',
          itemName: 'Fish Curry with Coconut Rice',
          quantity: 2,
          unitPrice: 13.49,
          total: 26.98,
          server: 'Alice',
          orderType: 'Dine-In',
          status: 'Accepted'
      },
      {
          orderId: 'ORD1002',
          orderDate: '2025-03-23',
          orderTime: '10:15',
          pickupDate: '2025-03-24',
          pickupTime: '12:00',
          customer: 'Jane Smith',
          paymentMethod: 'Cash',
          itemName: 'Coconut Water',
          quantity: 1,
          unitPrice: 2.99,
          total: 2.99,
          server: 'Bob',
          orderType: 'Takeaway',
          status: 'Rejected'
      }
  ];
  }

  getOrders() {
    return Promise.resolve(this.getOrdersData());
  }

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
