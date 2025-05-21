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
import { catchError, throwError } from 'rxjs';
import { Order } from '../../../domain/pos/Order';
import { OrderItem } from '../../../domain/pos/OrderItem';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';



@Component({
  selector: 'app-online-orders',
  imports: [TabViewModule,CommonModule,ButtonModule,TableModule,TagModule,ToolbarModule,DialogModule,RadioButtonModule,FormsModule,InputNumberModule,ToastModule],
  templateUrl: './online-orders.component.html',
  styleUrl: './online-orders.component.css',
  providers: [MessageService],
})
export class OnlineOrdersComponent implements OnInit {

  allOnlineOrders: Order[] = [];
  pendingPaymentOrders: Order[] = [];
  loading: boolean = false;
  error: string = '';
  displayDialog = false;
  selectedOrder: any;
  displayPaymentDialog = false;
  selectedOrderForPayment: any = null;
   paymentMethod: 'CASH' | 'CARD' | 'ONLINE' = 'CASH';
  cashAmount = 0;
  changeAmount = 0;
  
  constructor(
    private orderService: OrderService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOnlineOrders();
  }

  loadOnlineOrders(): void {
   this.loading = true;
    this.error = '';

    this.orderService.getOnlineOrders().pipe(
      catchError(err => {
        this.error = 'Failed to load online orders.';
        console.error('Error loading online orders:', err);
        this.loading = false;
        return [];
      })
    ).subscribe(orders => {
      this.allOnlineOrders = orders;
      this.loading = false;
    });

    this.orderService.getOnlineUnpaidOrders().pipe(
      catchError(err => {
        this.error = 'Failed to load pending payment orders.';
        console.error('Error loading pending payment orders:', err);
        this.loading = false;
        return [];
      })
    ).subscribe(orders => {
      this.pendingPaymentOrders = orders.filter(
        order => !order.isPaid && order.paymentMethod === 'CASH'
      );
      this.loading = false;
    });
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
  

  showOrderDetails(order: any) {
    
    this.selectedOrder = order;
    this.displayDialog = true;
  }

    openPaymentDialog(order: any) {
    this.selectedOrderForPayment = order;
    this.paymentMethod = 'CASH';
    this.cashAmount = order.totalAmount 
    this.calculateChange();
    this.displayPaymentDialog = true;
  }

  closePaymentDialog() {
    this.displayPaymentDialog = false;
    this.selectedOrderForPayment = null;
  }

  calculateChange() {
    if (this.selectedOrderForPayment) {
      // const totalWithTax = this.selectedOrderForPayment.totalAmount 
      this.changeAmount = this.cashAmount - this.selectedOrderForPayment.totalAmount;
    }
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
    this.loadOnlineOrders();
  }

}
