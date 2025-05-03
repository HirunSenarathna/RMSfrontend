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
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-customer-management',
  imports: [ CommonModule, 
    ButtonModule, 
    TableModule, 
    ToastModule, 
    ToolbarModule, 
    InputTextModule, 
    TextareaModule, 
    SelectModule, 
    FormsModule, 
    IconFieldModule, 
    InputIconModule, 
    DialogModule, 
    ConfirmDialogModule,
    ReactiveFormsModule,
    FileUploadModule],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.css',
  providers: [CustomerService,MessageService,ConfirmationService]
})
export class CustomerManagementComponent implements OnInit {
    customerDialog: boolean = false;
    customers: Customer[] = [];
    customer!: Customer;
    selectedCustomers: Customer[] = [];
    submitted: boolean = false;
    customerForm!: FormGroup;
    isEditMode: boolean = false;
  
    @ViewChild('dt') dt!: Table;
  
    cols!: Column[];
  
    constructor(
      private customerService: CustomerService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      private cd: ChangeDetectorRef,
      private fb: FormBuilder
    ) {}
  
    ngOnInit(): void {
      this.loadCustomerData();
      this.initForm();
    }
  
    initForm(): void {
      this.customerForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]],
        address: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });
    }
  
    loadCustomerData() {
      this.customerService.getCustomers().subscribe({
        next: (data) => {
          this.customers = data.map(customer => ({
            ...customer,
            name: `${customer.firstname} ${customer.lastname}`
          }));
          this.cd.markForCheck();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load customers', life: 3000 });
          console.error('Error loading customers:', err);
        }
      });
  
      this.cols = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'Phone' },
        { field: 'address', header: 'Address' }
      ];
    }
  
    openNew() {
      this.customer = {} as Customer;
      this.customerForm.reset();
      this.submitted = false;
      this.customerDialog = true;
      this.isEditMode = false;
    }
  
    editCustomer(customer: Customer) {
      this.customer = { ...customer };
      this.customerForm.patchValue({
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        username: customer.username,
        // Don't set password for editing
        password: ''
      });
      this.customerDialog = true;
      this.isEditMode = true;
    }
  
    deleteCustomer(customer: Customer) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this customer?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          if (customer.id) {
            this.customerService.deleteCustomer(Number(customer.id)).subscribe({
              next: () => {
                this.customers = this.customers.filter(val => val.id !== customer.id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000 });
              },
              error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer', life: 3000 });
                console.error('Error deleting customer:', err);
              }
            });
          }
        }
      });
    }
  
    hideDialog() {
      this.customerDialog = false;
      this.submitted = false;
      this.customerForm.reset();
    }
  
    saveCustomer() {
      this.submitted = true;
  
      if (this.customerForm.invalid) {
        return;
      }
  
      const customerData = this.customerForm.value;
  
      if (this.isEditMode && this.customer.id) {
        // If it's edit mode and password is empty, remove it from the request
        if (!customerData.password) {
          delete customerData.password;
        }
        
        this.customerService.updateCustomer(Number(this.customer.id), customerData).subscribe({
          next: (result) => {
            const index = this.findIndexById(this.customer.id);
            if (index !== -1) {
              this.customers[index] = { 
                ...result, 
                name: `${result.firstname} ${result.lastname}` 
              };
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
            }
            this.customerDialog = false;
            this.customerForm.reset();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update customer', life: 3000 });
            console.error('Error updating customer:', err);
          }
        });
      } else {
        this.customerService.registerCustomer(customerData).subscribe({
          next: (result) => {
            this.customers.push({ 
              ...result, 
              name: `${result.firstname} ${result.lastname}` 
            });
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
            this.customerDialog = false;
            this.customerForm.reset();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to create customer', life: 3000 });
            console.error('Error creating customer:', err);
          }
        });
      }
    }
  
    exportCSV() {
      this.dt.exportCSV();
    }
  
    findIndexById(id: string): number {
      return this.customers.findIndex(customer => customer.id === id);
    }
}
