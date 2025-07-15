import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { OrderService } from '../../../services/order.service';
import { SelectItem } from 'primeng/api';
import { Payment } from '../../../domain/pos/Payment';
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
import { MultiSelectModule } from 'primeng/multiselect';

import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-view-payments',
  imports: [CommonModule, TableModule,ToolbarModule,ButtonModule,CalendarModule,DropdownModule,TagModule,InputNumberModule,DialogModule,FormsModule, ToastModule,MultiSelectModule],
  templateUrl: './view-payments.component.html',
  styleUrl: './view-payments.component.css',
  providers: [MessageService]
})
export class ViewPaymentsComponent implements OnInit {

  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  loading: boolean = false;
  
  // Filter properties
  statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Refunded', value: 'REFUNDED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];
  
  methodOptions = [
    { label: 'Credit Card', value: 'CREDIT_CARD' },
    { label: 'Debit Card', value: 'DEBIT_CARD' },
    { label: 'Cash', value: 'CASH' },
    { label: 'Bank Transfer', value: 'BANK_TRANSFER' }
  ];
  
  dateRange: Date[] | undefined;
  selectedStatuses: string[] = [];
  selectedMethods: string[] = [];
  orderIdFilter: string = '';
  paymentIdFilter: string = '';
  amountFrom: number | null = null;
  amountTo: number | null = null;

  constructor(
    private paymentService: PaymentService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAllPayments().subscribe({
      next: (response) => {
        this.processPayments(response);
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payments'
        });
        this.loading = false;
      }
    });
  }

  processPayments(data: any): void {
    if (Array.isArray(data)) {
      this.payments = data;
    } else if (data?.content && Array.isArray(data.content)) {
      this.payments = data.content;
    } else {
      console.error('Unexpected data format:', data);
      this.payments = [];
    }
  }

  applyFilters(): void {
    this.filteredPayments = [...this.payments];
    
    // Apply status filter
    if (this.selectedStatuses.length > 0) {
      this.filteredPayments = this.filteredPayments.filter(payment => 
        this.selectedStatuses.includes(payment.status)
      );
    }
    
    // Apply method filter
    if (this.selectedMethods.length > 0) {
      this.filteredPayments = this.filteredPayments.filter(payment => 
        this.selectedMethods.includes(payment.method)
      );
    }
    
    // Apply order ID filter
    if (this.orderIdFilter) {
      this.filteredPayments = this.filteredPayments.filter(payment => 
        payment.orderId.toString().includes(this.orderIdFilter)
      );
    }
    
    // // Apply payment ID filter
    // if (this.paymentIdFilter) {
    //   this.filteredPayments = this.filteredPayments.filter(payment => 
    //     payment.id.toString().includes(this.paymentIdFilter)
    //   );
    // }
    
    // Apply amount range filter
    if (this.amountFrom !== null) {
      this.filteredPayments = this.filteredPayments.filter(payment => 
        payment.amount >= this.amountFrom!
      );
    }
    
    if (this.amountTo !== null) {
      this.filteredPayments = this.filteredPayments.filter(payment => 
        payment.amount <= this.amountTo!
      );
    }
    
    // Apply date range filter
    if (this.dateRange && this.dateRange.length === 2) {
      const startDate = new Date(this.dateRange[0]).setHours(0, 0, 0, 0);
      const endDate = new Date(this.dateRange[1]).setHours(23, 59, 59, 999);
      
      this.filteredPayments = this.filteredPayments.filter(payment => {
        const paymentDate = new Date(payment.createdAt).getTime();
        return paymentDate >= startDate && paymentDate <= endDate;
      });
    }
  }

  resetFilters(): void {
    this.dateRange = undefined;
    this.selectedStatuses = [];
    this.selectedMethods = [];
    this.orderIdFilter = '';
    this.paymentIdFilter = '';
    this.amountFrom = null;
    this.amountTo = null;
    this.applyFilters();
  }

    getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'PENDING': return 'warn';  
    case 'FAILED': return 'danger';
    case 'REFUNDED': return 'info';
    case 'CANCELLED': return 'secondary';
    default: return undefined;
  }
}

  
  getMethodIcon(method: string): string {
    switch (method) {
      case 'CREDIT_CARD': return 'pi pi-credit-card';
      case 'DEBIT_CARD': return 'pi pi-credit-card';
      case 'CASH': return 'pi pi-money-bill';
      case 'BANK_TRANSFER': return 'pi pi-building';
      default: return 'pi pi-question-circle';
    }
  }

}
