import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {

  orderId: string = '';
  orderData: any = null;
  isLoading: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private orderService: OrderService) {
    // Get order data from router navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.orderId = navigation.extras.state['orderId'];
      this.orderData = navigation.extras.state['orderData'];
      this.isLoading = false;
    }
  }

  ngOnInit(): void {
   if (!this.orderData) {
      this.route.queryParamMap.subscribe(params => {
        const orderId = params.get('orderId');
        if (orderId) {
          this.orderId = orderId;
          this.fetchOrder(orderId);
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }

    fetchOrder(orderId: string) {
    this.orderService.getOrderById(+orderId).subscribe({
      next: (order) => {
        this.orderData = order;
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load order details.');
        this.router.navigate(['/']);
      }
    });
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
