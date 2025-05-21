import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../domain/pos/Order';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {

   order: Order | null = null;
  loading = false;
  error: string | null = null;
  orderId: number = 0;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = +id;
        this.loadOrderDetails();
      } else {
        this.error = 'No order ID provided';
      }
    });
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details: ' + (err.message || 'Unknown error');
        this.loading = false;
        console.error('Error fetching order details:', err);
      }
    });
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'PREPARING': return 'status-preparing';
      case 'READY': return 'status-ready';
      case 'DELIVERED': return 'status-delivered';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

   getPaymentStatusClass(status: string | undefined): string {
  switch (status) {
    case 'PENDING': return 'status-pending';
    case 'COMPLETED': return 'status-completed';
    case 'FAILED': return 'status-failed';
    case 'REFUNDED': return 'status-refunded';
    case 'CANCELLED': return 'status-cancelled';
    default: return '';
  }
 }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

}
