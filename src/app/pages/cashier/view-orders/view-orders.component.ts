import { ChangeDetectorRef, Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
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
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { Order } from '../../../domain/pos/Order';
import { OrderService } from '../../../services/order.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessageService } from 'primeng/api';




@Component({
  selector: 'app-view-orders',
  imports: [CommonModule, TableModule,ToolbarModule,ButtonModule,CalendarModule,DropdownModule,TagModule,InputNumberModule,DialogModule,FormsModule,TabViewModule,InputTextModule,RadioButtonModule],
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css',
   providers: [MessageService],
})
export class ViewOrdersComponent implements OnInit {

  todayOrders: Order[] = [];
  allOrders: Order[] = [];
  orderDialog: boolean = false;
  orders!: Order[];
  order!: Order;
  
  error: string | null = null;
  loading: boolean = false;

  selectedOrder: Order | null = null;
  orderDetailsVisible: boolean = false;

  displayPaymentDialog = false;
  selectedOrderForPayment: any = null;
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE' = 'CASH';
  cashAmount = 0;
  changeAmount = 0;

  searchTerm: string = '';
  selectedStatus: string | null = null;
  filteredOrders: Order[] = [];
  
  
  orderStatusOptions: SelectItem[] = [
    { label: 'All', value: null },
    { label: 'Placed', value: 'PLACED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Ready', value: 'READY' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];
  
  constructor(private orderService: OrderService,private cd: ChangeDetectorRef, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
   this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...data];
        this.cd.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      },
    });
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
    this.orderService.getOrderById(order.id!).subscribe({
      next: (data) => {
        this.selectedOrder = data;  
        this.cd.markForCheck();
      }
      , error: (error) => { 
        console.error('Failed to load order details:', error);
      }
    });
    this.orderDetailsVisible = true;
  }
  
    openPaymentDialog(order: any) {
    this.selectedOrderForPayment = order;
    this.paymentMethod = 'CASH';
    this.cashAmount = order.totalAmount 
    this.calculateChange();
    this.displayPaymentDialog = true;
  }

   calculateChange() {
    if (this.selectedOrderForPayment) {
      // const totalWithTax = this.selectedOrderForPayment.totalAmount 
      this.changeAmount = this.cashAmount - this.selectedOrderForPayment.totalAmount;
    }
  }


  closePaymentDialog() {
    this.displayPaymentDialog = false;
    this.selectedOrderForPayment = null;
  }

   confirmPayment() {
    
       const paymentDetails = {
        orderId: this.selectedOrderForPayment.id,
        customerId: this.selectedOrderForPayment.customerId,
        amount: this.selectedOrderForPayment.totalAmount,
        paymentMethod: this.paymentMethod,
        cashReceived: this.cashAmount,
        change: this.changeAmount,
        isOnline: false
      };
  
       this.orderService.processInPersonPayment(this.selectedOrderForPayment.id, paymentDetails).pipe(
      catchError(err => {
        this.error = err.message || `Failed to process ${this.paymentMethod} payment.`;
        this.loading = false;
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Payment Processed',
        detail: `Payment of Rs. ${(this.selectedOrderForPayment.totalAmount).toFixed(2)} completed successfully`
      });
      this.closePaymentDialog();
      this.refreshOrders();
    });
    }
    
      refreshOrders(): void {
    this.loadOrders();
  }
  
  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.id?.toString().includes(this.searchTerm) ||
        order.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.id?.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || order.orderStatus === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = null;
    this.filteredOrders = [...this.orders];
  }

}
