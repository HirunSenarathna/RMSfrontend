import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8000/customer'; 

  constructor(private http: HttpClient) {}

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

  getLargeOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/large`);
  }

 

  // getLargeOrdersByDateRange(startDate: string, endDate: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/orders/large`, {
  //     params: {
  //       start: startDate,
  //       end: endDate
  //     }
  //   }).pipe(
  //     map(orders => orders.map(order => ({
  //       ...order,
  //       orderDate: new Date(order.orderDate)
  //     })))
  //   );
  // }

  getLargeOrdersByDateRange(startDate: string, endDate: string): Observable<any[]> {
    const hardcodedOrders = [
      {
        orderDate: '2025-03-20',
        tableNumber: 5,
        customerName: 'Michael Scott',
        totalAmount: 150.00,
        items: [
          { name: 'Pizza', quantity: 2, price: 25.00 },
          { name: 'Pasta', quantity: 1, price: 20.00 }
        ]
      },
      {
        orderDate: '2025-03-22',
        tableNumber: 3,
        customerName: 'Pam Beesly',
        totalAmount: 220.50,
        items: [
          { name: 'Steak', quantity: 2, price: 60.00 },
          { name: 'Wine', quantity: 1, price: 50.00 },
          { name: 'Salad', quantity: 2, price: 25.00 }
        ]
      }
    ];
  
    return new Observable(observer => {
      observer.next(hardcodedOrders);
      observer.complete();
    });
  }
  
}
