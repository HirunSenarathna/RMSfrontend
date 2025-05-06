import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service'; // Adjust the import path as necessary

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { MenuItemService } from '../../../services/menu-item.service';
import { PaymentService } from '../../../services/payment.service'; // Adjust the import path as necessary
import { Button, ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber'; // Import InputNumberModule for number input
import { TableModule } from 'primeng/table'; // Import TableModule for table component
import { DialogModule } from 'primeng/dialog';

export interface MenuCategory {
  id: number;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  categoryid: number;
  available: boolean;
  imageurl?: string;
  variants?: MenuItemVariant[];
}

export interface MenuItemVariant {
  id: number;
  menu_item_id: number;
  size?: 'SMALL' | 'LARGE';
  variant?: string;
  price: number;
  stock_quantity: number;
  available: boolean;
}

// src/app/models/order.model.ts
export interface Order {
  id: number;
  customer_name?: string;
  customer_phone?: string;
  order_type: 'IN_RESTAURANT' | 'ONLINE';
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  total_amount: number;
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
  payment_method?: 'CASH' | 'CARD' | 'ONLINE';
  table_number?: number;
  special_instructions?: string;
  created_at: Date;
  updated_at: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  menu_item_variant_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  item_name: string;
  size?: 'SMALL' | 'LARGE';
  variant?: string;
  special_instructions?: string;
}



@Component({
  selector: 'app-cashier-dashboard',
  imports: [CommonModule,RouterModule,FormsModule,ButtonModule,ToolbarModule,InputNumberModule,TableModule,DialogModule],
  templateUrl: './cashier-dashboard.component.html',
  styleUrl: './cashier-dashboard.component.css'
})
export class CashierDashboardComponent implements OnInit {

  categories: MenuCategory[] = [];
  menuItems: MenuItem[] = [];
  selectedCategory: MenuCategory | null = null;
  selectedMenuItem: MenuItem | null = null;
  selectedVariant: MenuItemVariant | null = null;
  
  currentOrder: Order = this.initializeNewOrder();
  quantity: number = 1;
  
  paymentDialog: boolean = false;
  paymentMethod: 'CASH' | 'CARD' = 'CASH';
  cashAmount: number = 0;
  changeAmount: number = 0;
  
  constructor(
    private menuService: MenuItemService,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  // ngOnInit(): void {
  //   this.loadCategories();
  // }

  initializeNewOrder(): Order {
    return {
      id: 0,
      order_type: 'IN_RESTAURANT',
      status: 'PENDING',
      total_amount: 0,
      payment_status: 'PENDING',
      created_at: new Date(),
      updated_at: new Date(),
      items: []
    };
  }

  loadCategories(): void {
    this.menuService.getCategories().subscribe(
      (data) => {
        this.categories = data;
        if (this.categories.length > 0) {
          this.selectCategory(this.categories[0]);
        }
      },
      (error) => console.error('Error loading categories:', error)
    );
  }

  // selectCategory(category: MenuCategory): void {
  //   this.selectedCategory = category;
  //   this.selectedMenuItem = null;
  //   this.selectedVariant = null;
    
  //   this.menuService.getMenuItemsByCategory(category.id).subscribe(
  //     (data) => {
  //       // this.menuItems = data;
  //     },
  //     (error) => console.error('Error loading menu items:', error)
  //   );
  // }

  // selectMenuItem(item: MenuItem): void {
  //   this.selectedMenuItem = item;
  //   this.selectedVariant = null;
    
  //   this.menuService.getMenuItemVariants(item.id).subscribe(
  //     (variants) => {
  //       // this.selectedMenuItem.variants = variants;
  //     },
  //     (error) => console.error('Error loading variants:', error)
  //   );
  // }

  ngOnInit(): void {
    this.loadDummyData();
  }
  
  loadDummyData(): void {
    this.categories = [
      { id: 1, name: 'Burgers' },
      { id: 2, name: 'Pizzas' },
      { id: 3, name: 'Drinks' }
    ];
  
    this.selectCategory(this.categories[0]); // auto-select first
  }
  
  selectCategory(category: MenuCategory): void {
    this.selectedCategory = category;
    this.selectedMenuItem = null;
    this.selectedVariant = null;
  
    // Dummy menu items
    this.menuItems = [
      {
        id: 1,
        name: 'Cheeseburger',
        description: 'Juicy grilled cheeseburger',
        categoryid: category.id,
        available: true,
        variants: [
          { id: 101, menu_item_id: 1, size: 'SMALL', variant: 'Beef', price: 450, stock_quantity: 10, available: true },
          { id: 102, menu_item_id: 1, size: 'LARGE', variant: 'Beef', price: 650, stock_quantity: 5, available: true }
        ]
      },
      {
        id: 2,
        name: 'Veggie Burger',
        description: 'Fresh and healthy',
        categoryid: category.id,
        available: true,
        variants: [
          { id: 201, menu_item_id: 2, size: 'SMALL', variant: 'Paneer', price: 400, stock_quantity: 8, available: true }
        ]
      }
    ];
  }
  
  selectMenuItem(item: MenuItem): void {
    this.selectedMenuItem = item;
    this.selectedVariant = null;
  
    // Directly assign dummy variants from the item
    if (item.variants) {
      this.selectedMenuItem.variants = item.variants;
    }
  }
  

  selectVariant(variant: MenuItemVariant): void {
    this.selectedVariant = variant;
  }

  addToOrder(): void {
    if (!this.selectedMenuItem || !this.selectedVariant) return;

    const existingItemIndex = this.currentOrder.items.findIndex(
      item => this.selectedVariant && item.menu_item_variant_id === this.selectedVariant.id
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      this.currentOrder.items[existingItemIndex].quantity += this.quantity;
      this.currentOrder.items[existingItemIndex].subtotal = 
        this.currentOrder.items[existingItemIndex].quantity * this.currentOrder.items[existingItemIndex].unit_price;
    } else {
      // Add new item to order
      const newItem: OrderItem = {
        id: 0,
        order_id: this.currentOrder.id,
        menu_item_id: this.selectedMenuItem.id,
        menu_item_variant_id: this.selectedVariant.id,
        quantity: this.quantity,
        unit_price: this.selectedVariant.price,
        subtotal: this.quantity * this.selectedVariant.price,
        item_name: this.selectedMenuItem.name,
        size: this.selectedVariant.size,
        variant: this.selectedVariant.variant
      };
      
      this.currentOrder.items.push(newItem);
    }
    
    // Recalculate total
    this.updateOrderTotal();
    
    // Reset selection
    this.quantity = 1;
  }
  
  updateOrderTotal(): void {
    this.currentOrder.total_amount = this.currentOrder.items.reduce(
      (total, item) => total + item.subtotal, 0
    );
  }
  
  removeItem(index: number): void {
    this.currentOrder.items.splice(index, 1);
    this.updateOrderTotal();
  }
  
  updateItemQuantity(index: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(index);
      return;
    }
    
    this.currentOrder.items[index].quantity = newQuantity;
    this.currentOrder.items[index].subtotal = 
      this.currentOrder.items[index].quantity * this.currentOrder.items[index].unit_price;
    
    this.updateOrderTotal();
  }
  
  openPaymentDialog(): void {
    if (this.currentOrder.items.length === 0) return;
    
    this.paymentDialog = true;
    this.cashAmount = this.currentOrder.total_amount;
    this.calculateChange();
  }
  
  calculateChange(): void {
    this.changeAmount = this.cashAmount - this.currentOrder.total_amount;
  }
  
  processPayment(): void {
    // this.currentOrder.payment_method = this.paymentMethod;
    
    // // First create/save the order
    // this.orderService.createOrder(this.currentOrder).subscribe(
    //   (savedOrder) => {
    //     // Then process the payment
    //     if (this.paymentMethod === 'CASH') {
    //       this.paymentService.processCashPayment(
    //         savedOrder.id, 
    //         this.currentOrder.total_amount
    //       ).subscribe(
    //         (payment) => {
    //           this.finishTransaction(savedOrder);
    //         },
    //         (error) => console.error('Error processing cash payment:', error)
    //       );
    //     } else if (this.paymentMethod === 'CARD') {
    //       // In real implementation you'd collect card details
    //       const mockCardDetails = { cardNumber: '****1234' };
          
    //       this.paymentService.processCardPayment(
    //         savedOrder.id,
    //         this.currentOrder.total_amount,
    //         mockCardDetails
    //       ).subscribe(
    //         (payment) => {
    //           this.finishTransaction(savedOrder);
    //         },
    //         (error) => console.error('Error processing card payment:', error)
    //       );
    //     }
    //   },
    //   (error) => console.error('Error saving order:', error)
    // );
  }
  
  finishTransaction(order: Order): void {
    this.paymentDialog = false;
    
    // Print receipt functionality would go here
    
    // Reset for new order
    this.currentOrder = this.initializeNewOrder();
    this.selectedMenuItem = null;
    this.selectedVariant = null;
  }
  
  cancelOrder(): void {
    this.currentOrder = this.initializeNewOrder();
    this.selectedMenuItem = null;
    this.selectedVariant = null;
  }
}
