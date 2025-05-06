import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';



export interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  customer_id: string | null;
  customer_name: string | null;
  created_at: Date;
  updated_at: Date;
  subtotal: number;
  tax: number;
  total: number;
  isPaid: boolean;
  paymentMethod: string;
  payment_status: string;
  isOnline: boolean;
  createdAt: Date;
  discount_amount?: number;
}

// Order Item model definition
export interface OrderItem {
  item_id: string;
  item_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  size?: string;
  variant?: string;
  notes?: string;
}
@Component({
  selector: 'app-view-orders',
  imports: [CommonModule, TableModule,ToolbarModule,ButtonModule,CalendarModule,DropdownModule,TagModule,InputNumberModule,DialogModule,FormsModule,TabViewModule],
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css'
})
export class ViewOrdersComponent implements OnInit {

  todayOrders: Order[] = [];
  allOrders: Order[] = [];
  
  selectedOrder: Order | null = null;
  orderDetailsVisible: boolean = false;
  
  
  orderStatusOptions: SelectItem[] = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Ready', value: 'READY' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];
  
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // Get today's orders
    // this.orderService.getAllOrders().subscribe(
    //   (orders) => {
    //     this.allOrders = orders;
        
    //     // Filter for today's orders
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);
        
    //     this.todayOrders = orders.filter(order => {
    //       const orderDate = new Date(order.created_at);
    //       return orderDate >= today;
    //     });
    //   },
    //   (error) => console.error('Error loading orders:', error)
    // );
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (status === 'COMPLETED') return 'success';
    if (status === 'PENDING') return 'warn';
    if (status === 'CANCELLED') return 'danger';
    return 'info';
  }
  
  getPaymentStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (status === 'PAID') return 'success';
    if (status === 'PENDING') return 'warn';
    if (status === 'FAILED') return 'danger';
    return 'info';
  }
  
  viewOrderDetails(order: Order): void {
    this.selectedOrder = {...order};
    this.orderDetailsVisible = true;
  }
  
  processPaymentForOrder(order: Order): void {
    // Navigate to POS with order loaded for payment
  }
  
  updateOrderStatus(): void {
    if (!this.selectedOrder) return;
    
    // this.orderService.updateOrderStatus(this.selectedOrder.id, this.selectedOrder.status).subscribe(
    //   (updatedOrder) => {
    //     // Update the order in the lists
    //     const todayIndex = this.todayOrders.findIndex(o => o.id === updatedOrder.id);
    //     if (todayIndex > -1) {
    //       this.todayOrders[todayIndex] = updatedOrder;
    //     }
        
    //     const allIndex = this.allOrders.findIndex(o => o.id === updatedOrder.id);
    //     if (allIndex > -1) {
    //       this.allOrders[allIndex] = updatedOrder;
    //     }
    //   },
    //   (error) => console.error('Error updating order status:', error)
    // );
  }

}
