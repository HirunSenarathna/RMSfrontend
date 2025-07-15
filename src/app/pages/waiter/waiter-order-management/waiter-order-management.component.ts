import { Component,ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from "@angular/common";
import { ConfirmationService, MessageService } from 'primeng/api';

import { Order } from '../../../domain/pos/Order';
import { OrderService } from '../../../services/order.service';


import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';



interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}


@Component({
  selector: 'app-waiter-order-management',
  imports: [CommonModule, TableModule, Dialog, ButtonModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, SelectModule, FormsModule, IconFieldModule, InputIconModule,DropdownModule,TagModule ],
  templateUrl: './waiter-order-management.component.html',
  styleUrl: './waiter-order-management.component.css',
  providers: [MessageService, ConfirmationService, OrderService]
})
export class WaiterOrderManagementComponent implements OnInit {
 @ViewChild('dt') table!: Table;

  orderDialog: boolean = false;
  orders: Order[] = [];
  selectedOrder: Order | null = null; 
  statuses!: any[];
  submitted: boolean = false;
  cols!: Column[];
  loading: boolean = true;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.initializeColumns();
    this.initializeStatuses();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load orders: ' + err.message,
        });
        this.loading = false;
      },
    });
  }

  initializeColumns() {
    this.cols = [
      { field: 'id', header: 'Order ID' },
      { field: 'orderTime', header: 'Order Time' },
      { field: 'customerName', header: 'Customer' },
      { field: 'paymentMethod', header: 'Payment Method' },
      { field: 'totalAmount', header: 'Total' },
      { field: 'orderStatus', header: 'Status' },
    ];
  }

  initializeStatuses() {
    this.statuses = [
      { label: 'Placed', value: 'PLACED' },
      { label: 'Confirmed', value: 'CONFIRMED' },
      { label: 'Preparing', value: 'PREPARING' },
      { label: 'Ready', value: 'READY' },
      { label: 'Delivered', value: 'DELIVERED' },
      { label: 'Cancelled', value: 'CANCELLED' },
    ];
  }

  exportCSV() {
    this.table.exportCSV();
    this.messageService.add({
      severity: 'success',
      summary: 'Export',
      detail: 'Orders exported to CSV',
    });
  }

  updateOrderStatusDialog(order: Order): void {
    this.selectedOrder = { ...order };
    this.orderDialog = true;
  }

  hideDialog(): void {
    this.orderDialog = false;
    this.selectedOrder = null;
    this.submitted = false;
  }

  saveOrderStatus(): void {
    if (!this.selectedOrder) return;

    this.submitted = true;
    this.loading = true;

    if (this.selectedOrder.id && this.selectedOrder.orderStatus) {
      this.orderService
        .updateOrderStatus(this.selectedOrder.id, this.selectedOrder.orderStatus)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Order #${this.selectedOrder?.id} status updated to ${this.selectedOrder?.orderStatus}`,
            });

            const index = this.orders.findIndex(
              (o) => o.id === this.selectedOrder?.id
            );
            if (index !== -1 && this.selectedOrder) {
              this.orders[index].orderStatus = this.selectedOrder.orderStatus;
            }

            this.orderDialog = false;
            this.loading = false;
            this.selectedOrder = null;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to update order status: ${err.message}`,
            });
            this.loading = false;
          },
        });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid order or status',
      });
      this.loading = false;
    }
  }

  deleteOrder(order: Order): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Order #${order.id}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Delete locally 
        this.orders = this.orders.filter((o) => o.id !== order.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Order Deleted',
          life: 3000,
        });
      },
    });
  }

  formatPaymentMethod(method?: string): string {
    if (!method) return 'Unknown';

    switch (method.toUpperCase()) {
      case 'CASH':
        return 'Cash';
      case 'CARD':
      case 'CREDIT_CARD':
        return 'Credit Card';
      default:
        return method;
    }
  }

  getStatusSeverity(status?: string) {
    if (!status) return 'info';

    switch (status.toUpperCase()) {
      case 'PLACED':
        return 'warn';
      case 'CONFIRMED':
      case 'PREPARING':
        return 'info';
      case 'READY':
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }
  

}
