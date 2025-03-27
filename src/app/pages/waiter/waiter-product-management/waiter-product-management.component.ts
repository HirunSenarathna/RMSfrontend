import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ConfirmationService, MessageService } from 'primeng/api';

import { Product } from '../../../domain/product';
import { ProductServiceService } from '../../../services/product-service.service';


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
import { Rating } from 'primeng/rating';
import { FormsModule,FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';


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
  selector: 'app-waiter-product-management',
  imports: [CommonModule,DropdownModule,ReactiveFormsModule,ButtonModule,TableModule,ToastModule,ToolbarModule,ConfirmDialog,InputTextModule,TextareaModule,SelectModule,Tag,FormsModule,IconFieldModule,InputIconModule,Rating,Dialog],
  templateUrl: './waiter-product-management.component.html',
  styleUrl: './waiter-product-management.component.css',
  providers: [ProductServiceService,MessageService,ConfirmationService]
})
export class WaiterProductManagementComponent implements OnInit {
  productDialog: boolean = false;
  
      products!: Product[];
  
      product!: Product;
  
      selectedProducts!: Product[] | null;
  
      submitted: boolean = false;
  
      statuses!: any[];

      editedProduct: Product | null = null;
      productForm!: FormGroup;
      statusOptions = ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'];
      
  
      @ViewChild('dt') dt!: Table;
  
      ngAfterViewInit() {
          setTimeout(() => {
              if (this.dt) {
                  console.log('Table initialized successfully.');
              }
          });
      }
  
      cols!: Column[];
  
      exportColumns!: ExportColumn[];
  
      constructor(
          private productService: ProductServiceService,
          private messageService: MessageService,
          private confirmationService: ConfirmationService,
          private cd: ChangeDetectorRef,
          private fb: FormBuilder
      ) {}
      ngOnInit(): void {
          this.loadDemoData();
          // Initialize productForm with default values
    this.productForm = this.fb.group({
        name: [''],
        price: [null],
        category: [''],
        inventoryStatus: [],
        rating: [null]
    });
      }
  
      exportCSV() {
          this.dt.exportCSV();
      }
  
      loadDemoData() {
          this.productService.getProducts().then((data) => {
              this.products = data;
              this.cd.markForCheck();
          });
  
          this.statuses = [
              { label: 'INSTOCK', value: 'instock' },
              { label: 'LOWSTOCK', value: 'lowstock' },
              { label: 'OUTOFSTOCK', value: 'outofstock' }
          ];
  
          this.cols = [
              { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
              { field: 'name', header: 'Name' },
              { field: 'image', header: 'Image' },
              { field: 'price', header: 'Price' },
              { field: 'category', header: 'Category' }
          ];
  
          this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
      }
  
      openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }
    editProduct(product: Product) {
        if (!this.productForm) {
            console.error('productForm is not initialized.');
            return;
        }
    
        this.editedProduct = product;
        this.productForm.patchValue({
            name: product.name || '',
            price: product.price || 0,
            category: product.category || '',
            inventoryStatus: product.inventoryStatus || '',
            rating: product.rating || 0
        });
    
        this.productDialog = true;
    }
    
  
      deleteSelectedProducts() {
          this.confirmationService.confirm({
              message: 'Are you sure you want to delete the selected products?',
              header: 'Confirm',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                  this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
                  this.selectedProducts = null;
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'Products Deleted',
                      life: 3000
                  });
              }
          });
      }
  
      hideDialog() {
          this.productDialog = false;
          this.submitted = false;
      }
  
      deleteProduct(product: Product) {
          this.confirmationService.confirm({
              message: 'Are you sure you want to delete ' + product.name + '?',
              header: 'Confirm',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                  this.products = this.products.filter((val) => val.id !== product.id);
                  this.product = {};
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'Product Deleted',
                      life: 3000
                  });
              }
          });
      }
  
      findIndexById(id: string): number {
          let index = -1;
          for (let i = 0; i < this.products.length; i++) {
              if (this.products[i].id === id) {
                  index = i;
                  break;
              }
          }
  
          return index;
      }
  
      createId(): string {
          let id = '';
          var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (var i = 0; i < 5; i++) {
              id += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return id;
      }
  
      getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
          switch (status) {
              case 'In Stock':
                  return 'success';
              case 'Low Stock':
                  return 'warn';
              case 'Out of Stock':
                  return 'danger';
              default:
                  return 'info'; // Map 'unknown' to a valid severity type
          }
      }
  
      saveProduct() {
        this.submitted = true;
    
        if (this.productForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields',
                life: 3000
            });
            return;
        }
    
        const formData = this.productForm.value;
    
        if (this.editedProduct) {
            // Update existing product
            const updatedProduct = {
                ...this.editedProduct,
                ...formData
            };
    
            const index = this.findIndexById(updatedProduct.id!);
            if (index !== -1) {
                this.products[index] = updatedProduct;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            }
        } else {
            // Create new product
            const newProduct: Product = {
                id: this.createId(),
                code: this.createId().substring(0, 8).toUpperCase(),
                ...formData,
                image: 'product-placeholder.svg', // Default image
                rating: formData.rating || 0
            };
    
            this.products.unshift(newProduct);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Created',
                life: 3000
            });
        }
    
        this.products = [...this.products]; // Trigger change detection
        this.productDialog = false;
        this.editedProduct = null;
        this.productForm.reset();
    }

}
