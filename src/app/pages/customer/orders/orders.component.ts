import { Component,OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Order } from '../../../domain/pos/Order';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  totalOrders = 0;
  totalPages = 0;
  sortBy = 'orderTime';
  sortDirection = 'DESC';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCustomerOrders();
  }

  loadCustomerOrders(): void {
    this.loading = true;
    this.error = null;
    
    const currentUser = this.authService.getCurrentUserValue();
    if (!currentUser || !currentUser.id) {
      this.error = 'User not authenticated or missing ID';
      this.loading = false;
      return;
    }

    // Using the customer orders paginated endpoint
    this.orderService.getCustomerOrdersPaged(
      currentUser.id, 
      this.currentPage, 
      this.pageSize,
      this.sortBy,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.orders = response.content;
        this.totalOrders = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders: ' + (err.message || 'Unknown error');
        this.loading = false;
        console.error('Error fetching customer orders:', err);
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCustomerOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCustomerOrders();
    }
  }

  changeSorting(column: string): void {
    if (this.sortBy === column) {
      // Toggle direction if clicking the same column
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = column;
      this.sortDirection = 'DESC'; // Default to descending when changing columns
    }
    this.loadCustomerOrders();
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

  getFormattedDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
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

}
