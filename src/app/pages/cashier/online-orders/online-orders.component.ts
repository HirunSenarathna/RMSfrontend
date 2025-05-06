import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  menu_item_variant_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  item_name: string;
  size?: 'SMALL' | 'LARGE';
  variant?: string;
  special_instructions?: string;
}

export interface Order {
  id: number;
  customer_name?: string;
  customer_phone?: string;
  order_type: 'IN_RESTAURANT' | 'ONLINE';
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  total_amount: number;
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
  payment_method?: 'CASH' | 'CARD' | 'ONLINE';
  table_number?: number;
  special_instructions?: string;
  created_at: Date;
  updated_at: Date;
  items: OrderItem[];
}

@Component({
  selector: 'app-online-orders',
  imports: [TabViewModule,CommonModule,ButtonModule,TableModule,TagModule,ToolbarModule],
  templateUrl: './online-orders.component.html',
  styleUrl: './online-orders.component.css'
})
export class OnlineOrdersComponent implements OnInit {

  allOnlineOrders: Order[] = [];
  pendingPaymentOrders: Order[] = [];
  
  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOnlineOrders();
  }

  loadOnlineOrders(): void {
    this.orderService.getOnlineOrders().subscribe(
      (orders) => {
        // this.allOnlineOrders = orders;
        // this.pendingPaymentOrders = orders.filter(
        //   order => order.payment_status === 'PENDING' && order.payment_method === 'CASH'
        // );
      },
      (error) => console.error('Error loading online orders:', error)
    );
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    if (status === 'Completed') {
        return 'success';
    } else if (status === 'Pending') {
        return 'warn';
    } else if (status === 'Cancelled') {
        return 'danger';
    }
    return 'info';
}
  getPaymentStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    if (status === 'Paid') {
        return 'success';
    } else if (status === 'Pending') {
        return 'warn';
    } else if (status === 'Failed') {
        return 'danger';
    }
    return 'info';
}
  
  viewOrderDetails(order: Order): void {
    // Navigate to order details or show modal
  }
  
  processPayment(order: Order): void {
    // Navigate to POS with order loaded for payment
    this.router.navigate(['/pos'], { queryParams: { orderId: order.id } });
  }
  
  refreshOrders(): void {
    this.loadOnlineOrders();
  }

}
