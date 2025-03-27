import { Component,ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from "@angular/common";
import { ConfirmationService, MessageService } from 'primeng/api';

import { Order } from '../../../domain/order';
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

interface ExportColumn {
  title: string;
  dataKey: string;
}


@Component({
  selector: 'app-waiter-order-management',
  imports: [CommonModule, TableModule, Dialog, ButtonModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, SelectModule, FormsModule, IconFieldModule, InputIconModule],
  templateUrl: './waiter-order-management.component.html',
  styleUrl: './waiter-order-management.component.css',
  providers: [MessageService, ConfirmationService, OrderService]
})
export class WaiterOrderManagementComponent implements OnInit {

  orderDialog: boolean = false;
  orders!: any[];
  selectedOrder: any;
  statuses!: any[];
  submitted: boolean = false;
  cols!: Column[];

  constructor(private messageService: MessageService,private orderService: OrderService,) {}

  ngOnInit(): void {
      this.loadOrders();
  }

  exportCSV() {
    // Implement CSV export logic
    console.log('Exporting CSV...');
}


  loadOrders() {
    
      this.orderService.getOrders().then(orders => {
          this.orders = orders;
      }
      );
  
      this.statuses = [
          { label: 'Pending', value: 'Pending' },
          { label: 'Shipped', value: 'Shipped' },
          { label: 'Delivered', value: 'Delivered' },
          { label: 'Cancelled', value: 'Cancelled' }
      ];

      this.cols = [
          { field: 'orderId', header: 'Order ID' },
          { field: 'orderDate', header: 'Order Date' },
          { field: 'orderTime', header: 'Order Time' },
          { field: 'customer', header: 'Customer' },
          { field: 'paymentMethod', header: 'Payment Method' },
          { field: 'itemName', header: 'Item Name' },
          { field: 'quantity', header: 'Qty' },
          { field: 'unitPrice', header: 'Unit Price' },
          { field: 'total', header: 'Total' },
          { field: 'orderType', header: 'Order Type' },
          { field: 'status', header: 'Status' }
      ];
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;

}



updateOrderStatusDialog(order: any) {
  this.selectedOrder = { ...order }; 
  this.orderDialog = true;
}

  editOrder(order: any) {
      this.orderDialog = true;
  }

  deleteOrder(order: any) {
      this.orders = this.orders.filter(o => o.orderId !== order.orderId);
      this.messageService.add({ severity: 'success', summary: 'Order Deleted', detail: `Order ${order.orderId} has been deleted.` });
  }

  saveOrderStatus() {
    if (!this.selectedOrder.status) {
        return; // Ensure status is selected
    }

    this.orders = this.orders.map(order => 
        order.orderId === this.selectedOrder.orderId ? { ...order, status: this.selectedOrder.status } : order
    );

    this.messageService.add({ severity: 'success', summary: 'Status Updated', detail: `Order ${this.selectedOrder.orderId} status updated to ${this.selectedOrder.status}` });

    this.orderDialog = false;
}

}
