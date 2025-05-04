import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string = '';
  orderData: any = null;

  constructor(private router: Router) {
    // Get order data from router navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.orderId = navigation.extras.state['orderId'];
      this.orderData = navigation.extras.state['orderData'];
    }
  }

  ngOnInit(): void {
    // If no order data is available, redirect to home
    if (!this.orderData) {
      this.router.navigate(['/']);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  trackOrder(): void {
    // In a real app, this would navigate to an order tracking page
    alert(`Tracking order ${this.orderId}`);
    // this.router.navigate(['/track-order', this.orderId]);
  }

}
