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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';



import { MenuItem } from '../../../domain/menu-item';
import { MenuItemVariant, Size } from '../../../domain/menu-item-variant';
import { MenuCategoryService } from '../../../services/menu-category.service';
import { MenuItemService } from '../../../services/menu-item.service';
import { MenuCategory } from '../../../domain/menu-category';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';


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
  imports: [CommonModule,ButtonModule,TableModule,FormsModule,SelectButtonModule,ToastModule,ToolbarModule,ConfirmDialog,InputTextModule,TextareaModule,FileUpload,SelectModule,Tag,FormsModule,InputNumber,IconFieldModule,InputIconModule,Dialog,DropdownModule,MessageModule],
  templateUrl: './waiter-product-management.component.html',
  styleUrl: './waiter-product-management.component.css',
  providers: [ProductServiceService,MessageService,ConfirmationService]
})
export class WaiterProductManagementComponent implements OnInit {
 @ViewChild('dt') dt!: Table;
 
   // Dialog controls
   menuItemDialog = false;
   variantDialog = false;
   detailsDialog = false;
   selectedItem: MenuItem | null = null;
 
   // Data
   menuItems: MenuItem[] = [];
   menuItem: MenuItem = this.emptyMenuItem();
   categories: MenuCategory[] = [];
   selectedMenuItems: MenuItem[] = [];
   currentVariant: MenuItemVariant = this.emptyVariant();
   sizes = Object.values(Size);
 
   // UI State
   submitted = false;
   loading = false;
 
   // Table columns
   cols: Column[] = [
     { field: 'id', header: 'ID' },
     { field: 'name', header: 'Name' },
     { field: 'imageUrl', header: 'Image' },
     { field: 'category.name', header: 'Category' }
 ];
 
   constructor(
     private menuItemService: MenuItemService,
     private categoryService: MenuCategoryService,
     private messageService: MessageService,
     private confirmationService: ConfirmationService,
     private cd: ChangeDetectorRef
   ) {}
 
   ngOnInit(): void {
     this.loadData();
   }
 
   loadData(): void {
     this.loading = true;
     
     this.menuItemService.getMenuItems().subscribe({
       next: (data) => {
         this.menuItems = data;
         this.loading = false;
       },
       error: (err) => {
         this.showError('Failed to load menu items');
         this.loading = false;
       }
     });
 
     this.categoryService.getCategories().subscribe({
       next: (data) => {
         this.categories = data;
       },
       error: (err) => {
         this.showError('Failed to load categories');
       }
     });
   }
 
   showDetails(menuItem: MenuItem): void {
     this.selectedItem = menuItem;
     this.detailsDialog = true;
 }
 
   emptyMenuItem(): MenuItem {
     return {
       id: 0,
       name: '',
       description: '',
       categoryId: null,
       categoryName: '',
       available: true,
       imageUrl: '',
       imageBase64: '',
       variants: []
     };
   }
 
   emptyVariant(): MenuItemVariant {
     return {
       id: 0,
       size: Size.MEDIUM,
       variant: '',
       price: 0,
       stockQuantity: 0,
       available: true
     };
   }
 
   openNew(): void {
     this.menuItem = this.emptyMenuItem();
     this.submitted = false;
     this.menuItemDialog = true;
   }
 
   editMenuItem(menuItem: MenuItem): void {
    // Deep copy to avoid mutating original
    this.menuItem = {
     ...menuItem,
     variants: menuItem.variants ? menuItem.variants.map(v => ({ ...v })) : [],
     categoryId: menuItem.categoryId, // Ensure categoryId is a number
   
   };
 
   this.submitted = false;
   this.menuItemDialog = true;
   }
 
   hideDialog(): void {
     this.menuItemDialog = false;
     this.variantDialog = false;
     this.submitted = false;
   }
 
   saveMenuItem(): void {
     this.submitted = true;
 
     if (!this.menuItem.name?.trim() || !this.menuItem.categoryId) {
       return;
     }
 
     const menuItemData = {
       name: this.menuItem.name,
       description: this.menuItem.description || '',
       categoryId: this.menuItem.categoryId ? (this.menuItem.categoryId as any).id : null,
       available: this.menuItem.available,
       imageBase64: this.menuItem.imageBase64 || '',
       variants: this.menuItem.variants || []
     };
 
     const operation = this.menuItem.id 
       ? this.menuItemService.updateMenuItem(this.menuItem.id, menuItemData)
       : this.menuItemService.createMenuItem(menuItemData);
 
     operation.subscribe({
       next: () => {
         this.showSuccess(this.menuItem.id ? 'Menu Item Updated' : 'Menu Item Created');
         this.loadData();
         this.menuItemDialog = false;
       },
       error: (err) => {
         this.showError(`Failed to ${this.menuItem.id ? 'update' : 'create'} menu item`);
       }
     });
   }
 
   getMinPrice(variants: MenuItemVariant[]): number {
     if (!variants || variants.length === 0) return 0;
     return Math.min(...variants.map(v => v.price));
   }
 
   deleteMenuItem(menuItem: MenuItem): void {
     this.confirmationService.confirm({
       message: `Are you sure you want to delete ${menuItem.name}?`,
       header: 'Confirm',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
         this.menuItemService.deleteMenuItem(menuItem.id!).subscribe({
           next: () => {
             this.menuItems = this.menuItems.filter(val => val.id !== menuItem.id);
             this.showSuccess('Menu Item Deleted');
           },
           error: (err) => {
             this.showError('Failed to delete menu item');
           }
         });
       }
     });
   }
 
   deleteSelectedMenuItems(): void {
     this.confirmationService.confirm({
       message: 'Are you sure you want to delete the selected menu items?',
       header: 'Confirm',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
         const deleteRequests = this.selectedMenuItems.map(item => 
           this.menuItemService.deleteMenuItem(item.id!)
         );
 
         Promise.all(deleteRequests).then(() => {
           this.menuItems = this.menuItems.filter(val => !this.selectedMenuItems.includes(val));
           this.selectedMenuItems = [];
           this.showSuccess('Menu Items Deleted');
         }).catch(err => {
           this.showError('Failed to delete some menu items');
         });
       }
     });
   }
 
   // Variant management
   openVariantDialog(variant?: MenuItemVariant): void {
     this.currentVariant = variant ? { ...variant } : this.emptyVariant();
     this.variantDialog = true;
   }
 
   saveVariant(): void {
     // if (!this.currentVariant.variant || this.currentVariant.price <= 0) {
     //   this.showError('Please fill all required fields');
     //   return;
     // }
 
     if (!this.menuItem.variants) {
       this.menuItem.variants = [];
     }
 
     const existingIndex = this.currentVariant.id 
       ? this.menuItem.variants.findIndex(v => v.id === this.currentVariant.id)
       : -1;
 
     if (existingIndex >= 0) {
       this.menuItem.variants[existingIndex] = { ...this.currentVariant };
     } else {
       this.menuItem.variants.push({ ...this.currentVariant });
     }
 
     this.variantDialog = false;
     this.currentVariant = this.emptyVariant();
   }
 
   deleteVariant(variant: MenuItemVariant): void {
     this.confirmationService.confirm({
       message: 'Are you sure you want to delete this variant?',
       header: 'Confirm',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
         if (this.menuItem.variants) {
           this.menuItem.variants = this.menuItem.variants.filter(v => v !== variant);
         }
       }
     });
   }
 
   // File upload handling
   onFileSelect(event: any): void {
     if (event.files?.length > 0) {
       const file = event.files[0];
       if (file.size > 2000000) {
         this.showError('File size should be less than 2MB');
         return;
       }
       const reader = new FileReader();
       reader.onload = (e) => {
         this.menuItem.imageBase64 = e.target?.result as string;
         this.menuItem.imageUrl = this.menuItem.imageBase64; // For preview
       };
       reader.readAsDataURL(file);
     }
   }
 
 
   // Helper methods
   private showSuccess(message: string): void {
     this.messageService.add({
       severity: 'success',
       summary: 'Successful',
       detail: message,
       life: 3000
     });
   }
 
   private showError(message: string): void {
     this.messageService.add({
       severity: 'error',
       summary: 'Error',
       detail: message,
       life: 3000
     });
   }
 
   getSeverity(status: boolean): 'success' | 'danger' {
     return status ? 'success' : 'danger';
   }
 
   exportCSV(): void {
     this.dt.exportCSV();
   }
 
   statuses = [
     { label: 'Available', value: true },
     { label: 'Unavailable', value: false }
 ];

}
