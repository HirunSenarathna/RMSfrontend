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

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}


@Component({
  selector: 'app-order-management',
  imports: [CommonModule,ButtonModule,TableModule,ToastModule,ToolbarModule,ConfirmDialog,InputTextModule,TextareaModule,SelectModule,Tag,FormsModule,InputNumber,IconFieldModule,InputIconModule,Dialog],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css',
  providers: [OrderService,MessageService,ConfirmationService]
})
export class OrderManagementComponent implements OnInit {

  orderDialog: boolean = false;
  orders!: Order[];
  order!: Order;
  submitted: boolean = false;
  statuses = [
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Ready', value: 'Ready' },
    { label: 'Delivered', value: 'Delivered' },
  ];

  @ViewChild('dt') dt!: Table;

  cols: Column[] = [
    { field: 'customerId', header: 'Customer ID' },
    { field: 'customerName', header: 'Customer Name' },
    { field: 'totalAmount', header: 'Total Amount' },
    { field: 'paymentStatus', header: 'Payment Status' },
    { field: 'orderStatus', header: 'Order Status' },
    { field: 'isOnline', header: 'Is Online' },
  ];

  constructor(
    private orderService: OrderService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.cd.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      },
    });
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;
  }

  generateOrderId(): string {
    return 'ORD' + Math.floor(Math.random() * 10000);
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'Accepted':
      case 'Ready':
      case 'Delivered':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Pending':
        return 'warn';
      default:
        return 'info';
    }
  }
}
