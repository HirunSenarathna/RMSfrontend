import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ConfirmationService, MessageService } from 'primeng/api';

import { Customer } from '../../../domain/customer';
import { CustomerService } from '../../../services/customer.service';

import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
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
import { Rating } from 'primeng/rating';
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
  selector: 'app-customer-management',
  imports: [CommonModule,ButtonModule,TableModule,ToastModule,ToolbarModule,InputTextModule,TextareaModule,SelectModule,FormsModule,IconFieldModule,InputIconModule],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.css',
  providers: [CustomerService,MessageService,ConfirmationService]
})
export class CustomerManagementComponent implements OnInit {

  customerDialog: boolean = false;
  customers!: Customer[];
  customer!: Customer;
  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  constructor(
      private customerService: CustomerService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      this.loadCustomerData();
  }

  loadCustomerData() {
      this.customerService.getCustomers().subscribe((data) => {
          this.customers = data;
          this.cd.markForCheck();
      });

      this.cols = [
          { field: 'id', header: 'ID' },
          { field: 'name', header: 'Name' },
          { field: 'email', header: 'Email' },
          { field: 'phone', header: 'Phone' },
          { field: 'address', header: 'Address' }
      ];
  }

  hideDialog() {
      this.customerDialog = false;
      this.submitted = false;
  }

  exportCSV() {
      this.dt.exportCSV();
  }

  createId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.customers.length; i++) {
          if (this.customers[i].id === id) {
              index = i;
              break;
          }
      }
      return index;
  }

}
