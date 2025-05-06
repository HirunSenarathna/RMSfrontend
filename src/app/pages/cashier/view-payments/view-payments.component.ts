import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { OrderService } from '../../../services/order.service';
import { SelectItem } from 'primeng/api';
import { Payment } from '../../../domain/payment';
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

export interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  customer_id: string | null;
  created_at: Date;
  updated_at: Date;
  subtotal: number;
  tax: number;
  total: number;
  isPaid: boolean;
  paymentMethod: string;
  isOnline: boolean;
  createdAt: Date;
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
  selector: 'app-view-payments',
  imports: [CommonModule, TableModule,ToolbarModule,ButtonModule,CalendarModule,DropdownModule,TagModule,InputNumberModule,DialogModule,FormsModule],
  templateUrl: './view-payments.component.html',
  styleUrl: './view-payments.component.css'
})
export class ViewPaymentsComponent implements OnInit {

  // Payment tracking
  payments: Payment[] = [];
  fromDate: Date | null = null;
  toDate: Date | null = null;
  selectedPaymentMethod: string | null = null;
  selectedPaymentStatus: string | null = null;
  
  // Summary statistics
  todayTotal: number = 0;
  todayCount: number = 0;
  todayCash: number = 0;
  todayCashCount: number = 0;
  todayCard: number = 0;
  todayCardCount: number = 0;
  todayOnline: number = 0;
  todayOnlineCount: number = 0;
  
  // Filter options
  paymentMethodOptions: SelectItem[] = [
    { label: 'All', value: null },
    { label: 'Cash', value: 'CASH' },
    { label: 'Card', value: 'CARD' },
    { label: 'Online', value: 'ONLINE' }
  ];
  
  paymentStatusOptions: SelectItem[] = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Refunded', value: 'REFUNDED' }
  ];
  
  // Current order data
  currentOrder: Order = {
    id: '',
    items: [],
    total_amount: 0,
    status: 'PENDING',
    customer_id: null,
    created_at: new Date(),
    updated_at: new Date(),
    subtotal: 0,
    tax: 0,
    total: 0,
    isPaid: false,
    paymentMethod: '',
    isOnline: false,
    createdAt: new Date()
  };
  
  // Payment dialog properties
  paymentDialog: boolean = false;
  paymentMethod: string = 'CASH';
  cashAmount: number = 0;
  changeAmount: number = 0;
  
  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getAllPayments().subscribe(
      (payments) => {
        this.payments = payments;
        this.calculateTodayStats();
      },
      (error) => console.error('Error loading payments:', error)
    );
  }

  calculateTodayStats(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPayments = this.payments.filter(payment => {
      const paymentDate = new Date(payment.created_at);
      return paymentDate >= today;
    });
    
    this.todayCount = todayPayments.length;
    this.todayTotal = todayPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    this.todayCashCount = todayPayments.filter(p => p.payment_method === 'CASH').length;
    this.todayCash = todayPayments
      .filter(p => p.payment_method === 'CASH')
      .reduce((sum, payment) => sum + payment.amount, 0);
      
    this.todayCardCount = todayPayments.filter(p => p.payment_method === 'CARD').length;
    this.todayCard = todayPayments
      .filter(p => p.payment_method === 'CARD')
      .reduce((sum, payment) => sum + payment.amount, 0);
      
    this.todayOnlineCount = todayPayments.filter(p => p.payment_method === 'ONLINE').length;
    this.todayOnline = todayPayments
      .filter(p => p.payment_method === 'ONLINE')
      .reduce((sum, payment) => sum + payment.amount, 0);
  }

  getPaymentStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (status === 'COMPLETED') return 'success';
    if (status === 'PENDING') return 'warn';
    if (status === 'FAILED') return 'danger';
    if (status === 'REFUNDED') return 'info';
    return 'secondary';
  }

  getCashierName(cashierId: string): string {
    // In a real app, you would fetch this from a user service
    return `Cashier ${cashierId.substring(0, 4)}`;
  }

  viewOrder(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  processRefund(payment: Payment): void {
    if (confirm(`Are you sure you want to refund Rs. ${payment.amount.toFixed(2)} for payment ${payment.id}?`)) {
      this.paymentService.processRefund(payment.id.toString()).subscribe(
        (refundedPayment) => {
          // Update the payment in the list
          const index = this.payments.findIndex(p => p.id === refundedPayment.id);
          if (index > -1) {
            this.payments[index] = refundedPayment;
          }
          this.calculateTodayStats();
        },
        (error) => console.error('Error processing refund:', error)
      );
    }
  }

  refreshPayments(): void {
    this.loadPayments();
  }
  
  // Filter functionality
  applyFilters(): void {
    this.paymentService.getFilteredPayments(
      this.fromDate, 
      this.toDate, 
      this.selectedPaymentMethod, 
      this.selectedPaymentStatus
    ).subscribe(
      (filteredPayments) => {
        this.payments = filteredPayments;
      },
      (error) => console.error('Error filtering payments:', error)
    );
  }
  
  // POS order functionality
  updateItemQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(index);
      return;
    }
    
    const item = this.currentOrder.items[index];
    item.quantity = quantity;
    item.subtotal = item.unit_price * quantity;
    this.recalculateOrderTotal();
  }
  
  removeItem(index: number): void {
    this.currentOrder.items.splice(index, 1);
    this.recalculateOrderTotal();
  }
  
  recalculateOrderTotal(): void {
    this.currentOrder.total_amount = this.currentOrder.items.reduce(
      (sum: number, item: OrderItem) => sum + item.subtotal, 0
    );
  }
  
  cancelOrder(): void {
    if (this.currentOrder.items.length === 0 || 
        confirm('Are you sure you want to cancel the current order?')) {
      this.resetOrder();
    }
  }
  
  resetOrder(): void {
    this.currentOrder = {
      id: '',
      items: [],
      total_amount: 0,
      status: 'PENDING',
      customer_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      subtotal: 0,
      tax: 0,
      total: 0,
      isPaid: false,
      paymentMethod: '',
      isOnline: false,
      createdAt: new Date()
    };
  }
  
  // Payment processing
  openPaymentDialog(): void {
    if (this.currentOrder.items.length === 0) {
      alert('Cannot process payment for an empty order.');
      return;
    }
    
    this.paymentMethod = 'CASH';
    this.cashAmount = 0;
    this.changeAmount = -this.currentOrder.total_amount;
    this.paymentDialog = true;
  }
  
  calculateChange(): void {
    this.changeAmount = this.cashAmount - this.currentOrder.total_amount;
  }
  
  processPayment(): void {
    if (this.paymentMethod === 'CASH' && this.changeAmount < 0) {
      alert('Insufficient cash amount.');
      return;
    }
    
    // First create the order
    // this.orderService.createOrder(this.currentOrder).subscribe(
    //   (order) => {
    //     // Then create the payment
    //     const payment = {
    //       order_id: order.id,
    //       amount: this.currentOrder.total_amount,
    //       payment_method: this.paymentMethod,
    //       payment_status: 'COMPLETED',
    //       cashier_id: localStorage.getItem('currentCashierId') || 'unknown'
    //     };
        
    //     this.paymentService.createPayment(payment).subscribe(
    //       (newPayment) => {
    //         this.paymentDialog = false;
    //         this.resetOrder();
    //         this.loadPayments(); // Refresh the payments list
    //       },
    //       (error) => console.error('Error creating payment:', error)
    //     );
    //   },
    //   (error) => console.error('Error creating order:', error)
    // );
  }

}
